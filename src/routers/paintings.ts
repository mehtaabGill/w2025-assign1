import express from 'express';

import supabase from '../supabase';
import { guaranteeNumber } from '../utils';

const paintingsRouter = express.Router();

const defaultSelect = 'paintingId,imageFileName,title,museumLink,accessionNumber,copyrightText,description,excerpt,yearOfWork,width,height,medium,cost,MSRP,googleLink,googleDescription,wikiLink,jsonAnnotations';

paintingsRouter
  .get('/', async (req, res) => {
    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .order('title')

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error })
      return;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .eq('paintingId', parseResult.value)
      .order('title')

    if (error !== null) {
      res.status(500).json(error);
    } else if(data.length < 1) {
      res.status(404).json({ error: 'Not found' })
    } else {
      res.json(data);
    }
  })
  .get('/sort/:titleOrYear', async (req, res) => {
    if (!['title', 'year'].includes(req.params.titleOrYear)) {
      res.status(400).json({ error: 'param must be one of "title" or "year"' });
      return;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .order(req.params.titleOrYear === 'title' ? 'title' : 'yearOfWork')

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/search/:substring', async (req, res) => {
    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .order('title')
      .ilike('title', `%${req.params.substring}%`)

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/years/:start/:end', async (req, res) => {
    const startParseResult = guaranteeNumber(req.params.start, { minimum: 0, maximum: new Date().getFullYear() }),
      endParseResult = guaranteeNumber(req.params.end, { minimum: 0, maximum: new Date().getFullYear() });

    if (startParseResult.error) {
      res.status(400).json({ error: startParseResult.error })
      return;
    } else if (endParseResult.error) {
      res.status(400).json({ error: endParseResult.error })
      return;
    }

    if (endParseResult.value < startParseResult.value) {
      res.status(400).json({ error: 'End year must be greater than start year' });
      return;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .order('yearOfWork')
      .gte('yearOfWork', startParseResult.value)
      .lte('yearOfWork', endParseResult.value)

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/galleries/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error })
      return;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .eq('galleryId', parseResult.value)
      .order('title')

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/artist/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error })
      return;
    }

    const { data, error } = await supabase
      .from('paintings')
      .select(defaultSelect)
      .eq('artistId', parseResult.value)
      .order('title')

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/artists/country/:substring', async (req, res) => {
    const { data, error } = await supabase
      .from('paintings')
      .select(`${defaultSelect}, artists!inner(nationality)`)
      .ilike('artists.nationality', `${req.params.substring}%`)
      .order('title');

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/genres/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase
      .from('_painting_to_genre')
      .select('genres (genreId,genreName,description,wikiLink,eras (eraId,eraName,eraYears)), paintings (paintingId, title, yearOfWork)')
      .eq('genreId', parseResult.value)
      .order('yearOfWork', { referencedTable: 'paintings', ascending: true })

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/era/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase
      .from('_painting_to_genre')
      .select('genres!inner(genreId,genreName,description,wikiLink,eras (eraId,eraName,eraYears)), paintings (paintingId, title, yearOfWork)')
      .eq('genres.eraId', parseResult.value)
      .order('yearOfWork', { referencedTable: 'paintings', ascending: true })

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })

export default paintingsRouter;