// Routing to /posts/questions
const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');
const Answers = require('../models/answers');

async function searchByString(searchWords) {
  let results = [];
  for (let word of searchWords) {
    word = word.replace(/[\\.+*?^$[\](){}/'#:!=|]/gi, '\\$&'); // escape special characters
    try {
      const questions = await Questions.find({
        $or: [{ title: { $regex: word, $options: 'i' } }, { text: { $regex: word, $options: 'i' } }],
      }).sort({ ask_date_time: -1 });
      results = [...results, ...questions];
    } catch (err) {
      console.error(err);
    }
  }
  return results;
}

async function searchByTag(searchTags) {
  try {
    // convert all tags to its ids
    const tagIds = [];
    for (const tag of searchTags) {
      const tagObj = await Tags.findOne({ name: { $regex: tag, $options: 'i' } });
      if (tagObj) {
        tagIds.push(tagObj._id);
      }
    }
    const questions = await Questions.find({ tags: { $in: tagIds } }).sort({ ask_date_time: -1 });
    return questions;
  } catch (err) {
    console.error(err);
  }
}

router.get('/', (req, res) => {
  res.redirect('/newest');
});

router.get('/search/:searchText', async (req, res) => {
  const phrase = req.params.searchText;
  if (phrase.trim() === '') {
    const questions = await Questions.find().sort({ ask_date_time: -1 }).exec();
    res.send(questions);
    return;
  }
  let searchWords = [];
  let searchTags = [];
  let currentWord = '';
  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i] === '[') {
      while (phrase[++i] !== ']' && phrase[i] !== ' ' && i < phrase.length) {
        currentWord += phrase[i];
      }
      if (phrase[i] === ']') {
        searchTags.push(currentWord.trim());
        currentWord = '';
      } else {
        currentWord = '[' + currentWord;
        searchWords.push(currentWord.trim());
        currentWord = '';
      }
    } else {
      while (phrase[i] !== ' ' && i < phrase.length) {
        currentWord += phrase[i];
        i++;
      }
      searchWords.push(currentWord.trim());
      currentWord = '';
    }
  }
  const filteredSearchWords = searchWords.filter((word) => word !== '');

  const questionsByString = await searchByString(filteredSearchWords);
  const questionsByTag = await searchByTag(searchTags);

  let results = [...questionsByString, ...questionsByTag];

  const uniqueResults = [];

  for (const result of results) {
    if (!uniqueResults.find((r) => r._id.toString() === result._id.toString())) {
      uniqueResults.push(result);
    }
  }

  res.send(uniqueResults);
});

router.get('/newest', async (req, res) => {
  try {
    const result = await Questions.find().sort({ ask_date_time: -1 }).exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

async function getLatestAnswerDate(answerIds) {
  let latestDate = new Date(0);
  for (const answerId of answerIds) {
    const answer = await Answers.findById(answerId);
    if (answer.ans_date_time > latestDate) {
      latestDate = answer.ans_date_time;
    }
  }
  return latestDate;
}

router.get('/active', async (req, res) => {
  const questionsWithoutAnswers = await Questions.find({ answers: { $size: 0 } }).sort({
    ask_date_time: -1,
  });
  const questionsWithAnswers = await Questions.find({ answers: { $exists: true, $ne: [] } });

  const questionAnswerDateMap = new Map();

  for (const question of questionsWithAnswers) {
    const latestAnswerDate = await getLatestAnswerDate(question.answers);
    questionAnswerDateMap.set(question, latestAnswerDate);
  }

  questionsWithAnswers.sort((a, b) => {
    const aDate = questionAnswerDateMap.get(a);
    const bDate = questionAnswerDateMap.get(b);
    return bDate - aDate;
  });

  const questions = [...questionsWithAnswers, ...questionsWithoutAnswers];

  res.send(questions);
});

router.get('/unanswered', async (req, res) => {
  try {
    const result = await Questions.find({ answers: { $size: 0 } })
      .sort({ ask_date_time: -1 })
      .exec();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:question', async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question).exec();
    if (question) {
      res.send(question);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/askQuestion', async (req, res) => {
  let newQuestionInput = req.body;
  const tagNames = Array.isArray(newQuestionInput.tagNames) ? newQuestionInput.tagNames : [];
  const tags = [...new Set(tagNames)];
  const tagIds = [];
  for (const tag of tags) {
    const tagExists = await Tags.findOne({ name: tag }).exec();
    if (tagExists) {
      tagIds.push(tagExists._id);
    } else {
      try {
        const newTag = new Tags({ name: tag });
        await newTag.save();
        tagIds.push(newTag._id);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error creating tag');
        return;
      }
    }
  }

  const newQuestion = new Questions({
    title: newQuestionInput.title,
    text: newQuestionInput.text,
    tags: tagIds,
    asked_by: newQuestionInput.askedBy,
  });
  await newQuestion.save();
  res.send(newQuestion);
});

router.patch('/incrementViews/:question', async (req, res) => {
  const question = await Questions.findById(req.params.question).exec();
  if (question) {
    question.views += 1;
    question.save();
    res.send(question);
  } else {
    res.status(404).send('Question not found');
  }
});

module.exports = router;
