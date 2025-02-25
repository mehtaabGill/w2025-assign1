import express from 'express';

import supabase from '../supabase';
import { guaranteeNumber } from '../utils';

const genresRouter = express.Router();

const defaultSelect = 'genreId,genreName,description,wikiLink,eras (eraId,eraName,eraYears)';

genresRouter
  .get('/', async (req, res) => {
    const { data, error } = await supabase
      .from('genres')
      .select(defaultSelect)

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase
      .from('genres')
      .select(defaultSelect)
      .eq('genreId', parseResult.value)

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/:painting/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase
      .from('_painting_to_genre')
      .select('genres (genreId,genreName,description,wikiLink,eras (eraId,eraName,eraYears))')
      .eq('paintingId', parseResult.value)
      .order('genreName', { referencedTable: 'genres', ascending: true })

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })

export default genresRouter;