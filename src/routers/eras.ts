import express from 'express';

import supabase from '../supabase';

const erasRouter = express.Router();

erasRouter
  .get('/', async (req, res) => {
    const { data, error } = await supabase
      .from('eras')
      .select()

    if (error !== null) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  })

export default erasRouter;