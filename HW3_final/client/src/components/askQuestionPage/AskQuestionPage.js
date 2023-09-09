import React, { useState } from 'react';
import '../../stylesheets/AskQuestionPage.css';
import validateHyperLinks from '../utils/validateHyperLinks';
import axios from 'axios';

function AskQuestionPage({ updatePage }) {
  const [hasError, setHasError] = useState({ title: false, content: null, tags: null, username: false }); // tags is null if no error, otherwise it is a string with the error message
  const [question, setQuestion] = useState({ title: '', content: '', tags: '', username: '' });

  const setQuestionTitle = (e) => {
    setQuestion({ ...question, title: e.target.value.trim() });
  };

  const setQuestionContent = (e) => {
    setQuestion({ ...question, content: e.target.value.trim() });
  };

  const setQuestionTags = (e) => {
    setQuestion({ ...question, tags: e.target.value.trim() });
  };

  const setQuestionUsername = (e) => {
    setQuestion({ ...question, username: e.target.value.trim() });
  };

  const validateQuestion = () => {
    let newStateHasError = { title: false, content: null, tags: null, username: false };
    let tags = question.tags.toLowerCase().split(' ');
    tags = tags.filter((tag) => tag.trim() !== '');
    if (tags.length === 0) {
      newStateHasError = { ...newStateHasError, tags: '*Question must have at least one tag' };
    }

    if (tags.length > 5) {
      newStateHasError = { ...newStateHasError, tags: '*Question cannot have more than 5 tags' };
    } else {
      for (const tag of tags) {
        if (tag.length > 10) {
          newStateHasError = { ...newStateHasError, tags: '*Tag cannot have more than 10 characters' };
        }
      }
    }

    if (question.title === '') {
      newStateHasError = { ...newStateHasError, title: true };
    }

    if (question.content === '') {
      newStateHasError = { ...newStateHasError, content: '*Description field cannot be empty' };
    } else {
      let foundError = validateHyperLinks(question.content);
      if (foundError) {
        newStateHasError = {
          ...newStateHasError,
          content:
            '*Constraints violated. The target of a hyperlink, that is, the stuff within () cannot be empty and must begin with “https://” or “http://”.',
        };
      }
    }

    if (question.username === '') {
      newStateHasError = { ...newStateHasError, username: true };
    }

    setHasError(newStateHasError);

    if (
      !newStateHasError.title &&
      newStateHasError.content === null &&
      newStateHasError.tags === null &&
      !newStateHasError.username
    ) {
      const newQuestion = {
        title: question.title,
        text: question.content,
        tagNames: tags,
        askedBy: question.username,
      };

      axios
        .post('http://localhost:8000/posts/questions/askQuestion', newQuestion, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          updatePage('questions');
        });
    }
  };

  return (
    <div id="ask-question">
      <h2>Question Title*</h2>
      <label htmlFor="title">Limit title to 100 characters or less</label>
      <input
        onChange={(e) => setQuestionTitle(e)}
        type="text"
        className="new-q-input"
        id="new-title"
        name="title"
        maxLength="100"
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="title-error">
        {hasError.title ? '*Title field cannot be empty' : ''}
      </label>
      <h2>Question Text*</h2>
      <label htmlFor="content">Add details</label>
      <textarea onChange={(e) => setQuestionContent(e)} id="new-content" name="content"></textarea>
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="content-error">
        {hasError.content === null ? '' : hasError.content}
      </label>
      <h2>Tags*</h2>
      <label htmlFor="tags">Add keywords separated by whitespace</label>
      <input onChange={(e) => setQuestionTags(e)} type="text" className="new-q-input" id="new-tags" name="tags" />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="tags-error">
        {hasError.tags === null ? '' : hasError.tags}
      </label>
      <h2>Username*</h2>
      <label htmlFor="username">Will be displayed to public</label>
      <input
        onChange={(e) => setQuestionUsername(e)}
        type="text"
        className="new-q-input"
        id="new-username"
        name="username"
      />
      <br />
      <br />
      <label htmlFor="title" className="new-q-error" id="username-error">
        {hasError.username ? '*Username field cannot be empty' : ''}
      </label>
      <input type="submit" className="submit-question" value="Post Question" onClick={() => validateQuestion()} />
      <h3>* indicates mandatory fields</h3>
    </div>
  );
}

export default AskQuestionPage;;
