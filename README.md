# COMP 4513
## Assigment 1: Painting API

- Hosting: ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
- Runtime: ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- Language: ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- Stack: ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- Dev Tools: ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
- Version Control: ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## Code Structure
```
src/
│── routers/ - contains all routers for the global express app for modularization
│   ├── artists.ts
│   ├── counts.ts
│   ├── eras.ts
│   ├── galleries.ts
│   ├── genres.ts
│   ├── paintings.ts
│── supabase/ - contains the initialized supabase client
│   ├── index.ts
│── index.ts - main entry file
│── utils.ts - contains any extra global functions
```

## API Endpoints

### Eras
- [/api/eras](https://w2025-assign1-8bp8.onrender.com/api/eras)

### Galleries
- [/api/galleries](https://w2025-assign1-8bp8.onrender.com/api/galleries)
- [/api/galleries/30](https://w2025-assign1-8bp8.onrender.com/api/galleries/30)
- [/api/galleries/Calgary](https://w2025-assign1-8bp8.onrender.com/api/galleries/Calgary)
- [/api/galleries/country/fra](https://w2025-assign1-8bp8.onrender.com/api/galleries/country/fra)

### Artists
- [/api/artists](https://w2025-assign1-8bp8.onrender.com/api/artists)
- [/api/artists/12](https://w2025-assign1-8bp8.onrender.com/api/artists/12)
- [/api/artists/1223423](https://w2025-assign1-8bp8.onrender.com/api/artists/1223423)
- [/api/artists/search/ma](https://w2025-assign1-8bp8.onrender.com/api/artists/search/ma)
- [/api/artists/search/mA](https://w2025-assign1-8bp8.onrender.com/api/artists/search/mA)
- [/api/artists/country/fra](https://w2025-assign1-8bp8.onrender.com/api/artists/country/fra)

### Paintings
- [/api/paintings](https://w2025-assign1-8bp8.onrender.com/api/paintings)
- [/api/paintings/sort/year](https://w2025-assign1-8bp8.onrender.com/api/paintings/sort/year)
- [/api/paintings/63](https://w2025-assign1-8bp8.onrender.com/api/paintings/63)
- [/api/paintings/search/port](https://w2025-assign1-8bp8.onrender.com/api/paintings/search/port)
- [/api/paintings/search/pORt](https://w2025-assign1-8bp8.onrender.com/api/paintings/search/pORt)
- [/api/paintings/search/connolly](https://w2025-assign1-8bp8.onrender.com/api/paintings/search/connolly)
- [/api/paintings/years/1800/1850](https://w2025-assign1-8bp8.onrender.com/api/paintings/years/1800/1850)
- [/api/paintings/galleries/5](https://w2025-assign1-8bp8.onrender.com/api/paintings/galleries/5)
- [/api/paintings/artist/16](https://w2025-assign1-8bp8.onrender.com/api/paintings/artist/16)
- [/api/paintings/artist/666](https://w2025-assign1-8bp8.onrender.com/api/paintings/artist/666)
- [/api/paintings/artist/country/ital](https://w2025-assign1-8bp8.onrender.com/api/paintings/artist/country/ital)

### Genres
- [/api/genres](https://w2025-assign1-8bp8.onrender.com/api/genres)
- [/api/genres/76](https://w2025-assign1-8bp8.onrender.com/api/genres/76)
- [/api/genres/painting/408](https://w2025-assign1-8bp8.onrender.com/api/genres/painting/408)
- [/api/genres/painting/jsdfhg](https://w2025-assign1-8bp8.onrender.com/api/genres/painting/jsdfhg)
- [/api/paintings/genre/78](https://w2025-assign1-8bp8.onrender.com/api/paintings/genre/78)
- [/api/paintings/era/2](https://w2025-assign1-8bp8.onrender.com/api/paintings/era/2)

### Counts
- [/api/counts/genres](https://w2025-assign1-8bp8.onrender.com/api/counts/genres)
- [/api/counts/artists](https://w2025-assign1-8bp8.onrender.com/api/counts/artists)
- [/api/counts/topgenres/20](https://w2025-assign1-8bp8.onrender.com/api/counts/topgenres/20)
- [/api/counts/topgenres/2034958](https://w2025-assign1-8bp8.onrender.com/api/counts/topgenres/2034958)

## Side Notes
When coding the `/api/counts` router, the functionality could either be coded through mapping through the array and calculating the correct values or by using raw SQL. They are much more difficult or even impossible to do with a single line supabase query. This is an introduction to the limitations of ORMs and the power of writing raw SQL for more complex use cases. The method I chose was to write the SQL and use supabase's RPC (remote procedure call) functionality to call the queries when needed. Here is an explanation of each query.

### /api/counts/genres
```sql
SELECT g."genreName", COUNT(pg."paintingId") AS count FROM _painting_to_genre pg
JOIN genres g ON g."genreId" = pg."genreId"
GROUP BY g."genreName"
ORDER BY count ASC;
```

Here we use Postgres' aggregate functions to get the count of paintings for each genre.

### /api/counts/artists
```sql
SELECT 
  CONCAT(a."firstName", ' ', a."lastName") AS artistName,
  COUNT(p."paintingId") AS paintingCount
FROM artists a
JOIN paintings p ON a."artistId" = p."artistId"
GROUP BY artistName
ORDER BY paintingCount DESC;
```

Postgres provides us a way to join strings using `CONCAT` along with the `COUNT` aggregate function. We can access artist properties through our inner join. 

### /api/counts/topgenres/20
```sql
SELECT g."genreName", COUNT(pg."paintingId") AS count FROM _painting_to_genre pg
JOIN genres g ON g."genreId" = pg."genreId"
GROUP BY g."genreName"
HAVING  COUNT(pg."paintingId") > min
ORDER BY count ASC;
```

In this case, we re-use the function from the `/api/counts/genres` endpoint but instead provide a `min` parameter to filter by. `HAVING  COUNT(pg."paintingId") > min` we have to use `HAVING` opposed to a `WHERE` clause since we are using an aggregate function.
