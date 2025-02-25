import express from 'express';

import supabase from '../supabase';
import { guaranteeNumber } from '../utils';

const galleriesRouter = express.Router();

galleriesRouter
  .get('/', async (req, res) => {
    const { data, error } = await supabase
      .from('galleries')
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
      res.status(400).json({ error: parseResult.error })
      return;
    }

    const { data, error } = await supabase
      .from('galleries')
      .select()
      .eq('galleryId', parseResult.value)

    if (error !== null) {
      res.status(500).json(error);
    } else if(data.length < 1) {
      res.status(404).json({ error: 'Not found' })
    } else {
      res.json(data);
    }
  })
  .get('/country/:substring', async (req, res) => {
    const { data, error } = await supabase
      .from('galleries')
      .select()
      .ilike('galleryCountry', `${req.params.substring}%`);

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })

export default galleriesRouter;