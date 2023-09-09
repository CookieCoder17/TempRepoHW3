import React, { useState, useEffect } from 'react';
import '../../stylesheets/QuestionsPage.css';
import QuestionContainers from './QuestionContainers';
import axios from 'axios';

function QuestionsPage({ updatePage, setSearch, currentSearch }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [questionSortMode, setQuestionSortMode] = useState('latest');
  const [questionsList, setQuestionsList] = useState([]);
  const numberOfQuestions = questionsList.length;

  useEffect(() => {
    questionsBasedOnMode(questionSortMode, currentSearch).then((res) => {
      setQuestionsList(res);
    });
  }, [currentSearch, questionSortMode]);

  function questionsBasedOnMode(questionSortMode, currentSearch) {
    if (currentSearch.search !== '') {
      let encodedSearch = encodeURIComponent(currentSearch.search);
      return axios.get(`http://localhost:8000/posts/questions/search/${encodedSearch}`).then((res) => {
        return res.data;
      });
    }
    if (questionSortMode === 'unanswered') {
      return axios.get('http://localhost:8000/posts/questions/unanswered').then((res) => {
        return res.data;
      });
    }
    if (questionSortMode === 'active') {
      return axios.get('http://localhost:8000/posts/questions/active').then((res) => {
        return res.data;
      });
    }
    if (questionSortMode === 'latest') {
      return axios.get('http://localhost:8000/posts/questions/newest').then((res) => {
        return res.data;
      });
    }
  }
  const tagSearchResult = currentSearch.tagSearch
    ? `All Questions With Tag: ${currentSearch.search.slice(1, -1)}`
    : 'Search Results';
  return (
    <div>
      <div id="upper-main">
        <div id="top-upper-main">
          <h1 id="top-upper-main-title">{currentSearch.search === '' ? 'All Questions' : tagSearchResult}</h1>
          <button id="main-ask" onClick={() => updatePage('ask-question')}>
            Ask Question
          </button>
        </div>
        <div id="bottom-upper-main">
          <h3 id="number-of-questions">
            {numberOfQuestions} question{numberOfQuestions > 1 ? 's' : ''}
          </h3>

          <button
            id="main-unanswered"
            onClick={() => {
              setSearch({ tagSearch: false, search: '' });
              setQuestionSortMode('unanswered');
            }}
          >
            Unanswered
          </button>

          <button
            id="main-active"
            onClick={() => {
              setSearch({ tagSearch: false, search: '' });
              setQuestionSortMode('active');
            }}
          >
            Active
          </button>

          <button
            id="main-newest"
            onClick={() => {
              setSearch({ tagSearch: false, search: '' });
              setQuestionSortMode('latest');
            }}
          >
            Newest
          </button>
        </div>
      </div>
      <div id="lower-main">
        <QuestionContainers questions={questionsList} updatePage={updatePage} />
      </div>
    </div>
  );
}

export default QuestionsPage;
