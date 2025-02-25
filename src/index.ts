import { config } from 'dotenv';
config();

import express from 'express';
import erasRouter from './routers/eras';
import galleriesRouter from './routers/galleries';
import artistsRouter from './routers/artists';
import paintingsRouter from './routers/paintings';
import genresRouter from './routers/genres';
import countsRouter from './routers/counts';

const PORT = parseFloat(process.env.PORT ?? '8080');

const app = express();

app
  .use('/api/eras', erasRouter)
  .use('/api/galleries', galleriesRouter)
  .use('/api/artists', artistsRouter)
  .use('/api/paintings', paintingsRouter)
  .use('/api/genres', genresRouter)
  .use('/api/counts', countsRouter)

app.listen(PORT, () => console.log(`app listening at http://localhost:${PORT}`))