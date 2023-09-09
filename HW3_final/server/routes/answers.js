// Routing to /posts/answers
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');

router.get('/:qid', async (req, res) => {
    try {
      const question = await Questions.findById(req.params.qid).exec();
      const answer = await Answers.find({_id: {$in: question.answers}}).sort({ans_date_time : -1});
      if (answer) {
        res.send(answer);
      } else {
        res.status(404).send('Answer not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });


router.post('/answerQuestion', async (req, res) => {
    let newAnswerInput = req.body;
    try {
      const newAnswer = new Answers({
        text: newAnswerInput.text,
        ans_by: newAnswerInput.ansBy,
      });
      await newAnswer.save();
  
      if (!newAnswerInput.qid) {
        res.status(400).send('Missing qid parameter');
        return;
      }
  
      const question = await Questions.findById(newAnswerInput.qid).exec();
  
      if (question) {
        question.answers.push(newAnswer._id);
        await question.save();
        res.send(question);
      } else {
        res.status(404).send('Question not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;