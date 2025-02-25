import express from 'express';

import supabase from '../supabase';
import { guaranteeNumber } from '../utils';

const artistsRouter = express.Router();

artistsRouter
  .get('/', async (req, res) => {
    const { data, error } = await supabase
      .from('artists')
      .select()

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
      .from('artists')
      .select()
      .eq('artistId', parseResult.value)

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/search/:substring', async (req, res) => {
    const { data, error } = await supabase
      .from('artists')
      .select()
      .ilike('lastName', `${req.params.substring}%`);

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })
  .get('/country/:substring', async (req, res) => {
    const { data, error } = await supabase
      .from('artists')
      .select()
      .ilike('nationality', `${req.params.substring}%`);

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })

export default artistsRouter;