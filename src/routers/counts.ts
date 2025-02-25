import express from 'express';

import supabase from '../supabase';
import { guaranteeNumber } from '../utils';

const countsRouter = express.Router();

countsRouter
  .get('/genres', async (req, res) => {
    const { data, error } = await supabase.rpc('get_painting_counts_by_genre');

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/artists', async (req, res) => {
    const { data, error } = await supabase.rpc('get_paintings_by_artists');

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/topgenres/:ref', async (req, res) => {
    const parseResult = guaranteeNumber(req.params.ref, { minimum: 0 });
    if (parseResult.error) {
      res.status(400).json({ error: parseResult.error });
      return;
    }

    const { data, error } = await supabase.rpc('get_painting_counts_by_genre_with_min_count', { min: parseResult.value });

    if (error !== null) {
      res.status(500).json(error);
    } else if(data.length < 1) {
      res.status(404).json({ error: 'Not found' })
    } else {
      res.json(data);
    }
  })

export default countsRouter;