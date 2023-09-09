// Routing to /posts/tags
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');

// returns all tags
router.get('/', async (req, res) => {
    try {
      const result = await Tags.find().exec();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Converts tag_name (string) into tag_id
router.get('/:tag', async (req, res) => {
    const tag = req.params.tag;
    try {
      const result = await Tags.find({ name: tag }).exec();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Converts tag_id into tag_name (string)
router.get('/tag_id/:tag_id', async (req, res) => {
    const tag_id = req.params.tag_id;
    try {
      const result = await Tags.findById(tag_id).exec();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
router.get('/tag_id/:tag_id/questions', async (req, res) => {
    const tag_id = req.params.tag_id;
    try {
      const result = await Questions.find({ tags: tag_id }).exec();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;