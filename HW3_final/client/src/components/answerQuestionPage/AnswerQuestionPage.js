import React, { useState, useEffect } from 'react';
import '../../stylesheets/AnswerQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AnswerQuestionPage({ updatePage, qid }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [hasError, setHasError] = useState({ username: false, content: null });
  const [answer, setAnswer] = useState({ username: '', content: '' });

  const setAnswerUsername = (e) => {
    setAnswer({ ...answer, username: e.target.value.trim() });
  };

  const setAnswerContent = (e) => {
    setAnswer({ ...answer, content: e.target.value.trim() });
  };

  const validateAnswer = (qid) => {
    let newStateHasError = { username: false, content: null };

    if (answer.username.length === 0) {
      newStateHasError = { ...newStateHasError, username: true };
    }

    if (answer.content.length === 0) {
      newStateHasError = { ...newStateHasError, content: '*Answer field cannot be empty' };
    } else {
      let foundError = validateHyperLinks(answer.content);
      if (foundError) {
        newStateHasError = {
          ...newStateHasError,
          content:
            '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.',
        };
      }
    }

    setHasError(newStateHasError);

    if (newStateHasError.content === null && !newStateHasError.username) {
      let newAnswer = {
        qid: qid,
        text: `${answer.content}`,
        ansBy: `${answer.username}`,
      };

      axios.post('http://localhost:8000/posts/answers/answerQuestion', newAnswer).then(() => {
        updatePage({ currentPage: 'question-answer', qid: qid });
      });
    }
  };

  return (
    <div id="ask-question">
      <h2>Username*</h2>
      <label htmlFor="username">Will be displayed to public</label>
      <input
        onChange={(e) => setAnswerUsername(e)}
        type="text"
        className="new-q-input"
        id="ans-new-username"
        name="username"
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="ans-username-error">
        {hasError.username ? '*Username field cannot be empty' : ''}
      </label>
      <h2>Answer Text*</h2>
      <label htmlFor="content">Write answer here</label>
      <textarea onChange={(e) => setAnswerContent(e)} id="ans-new-content" name="content"></textarea>
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="ans-content-error">
        {hasError.content === null ? '' : hasError.content}
      </label>
      <input
        type="submit"
        className="submit-question"
        id={qid}
        value="Post Answer"
        onClick={() => validateAnswer(qid)}
      />
      <h3>* indicates mandatory fields</h3>
    </div>
  );
}

export default AnswerQuestionPage;
