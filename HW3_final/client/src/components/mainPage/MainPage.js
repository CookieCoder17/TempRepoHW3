import React from 'react';
import '../../stylesheets/MainPage.css';
import QuestionsPage from '../questionPage/QuestionsPage';
import TagsPage from '../tagsPage/TagsPage';
import AskQuestionPage from '../askQuestionPage/AskQuestionPage';
import QuestionAnswerPage from '../questionAnswerPage/QuestionAnswerPage';
import AnswerQuestionPage from '../answerQuestionPage/AnswerQuestionPage';

function MainPage({ currentPage, updatePage, setSearch, currentSearch }) {
  if (currentPage === 'questions') {
    return (
      <div className={'main'}>
        <QuestionsPage updatePage={updatePage} setSearch={setSearch} currentSearch={currentSearch} />
      </div>
    );
  }
  if (currentPage === 'tags') {
    return (
      <div className={'main'}>
        <TagsPage updatePage={updatePage} setSearch={setSearch} />
      </div>
    );
  }
  if (currentPage === 'ask-question') {
    return (
      <div className={'main'}>
        <AskQuestionPage updatePage={updatePage} />
      </div>
    );
  }
  if (currentPage.currentPage === 'question-answer') {
    return (
      <div className={'main'}>
        <QuestionAnswerPage updatePage={updatePage} qid={currentPage.qid} />
      </div>
    );
  }
  if (currentPage.currentPage === 'reply-to-question') {
    return (
      <div className={'main'}>
        <AnswerQuestionPage updatePage={updatePage} qid={currentPage.qid} />
      </div>
    );
  }
  return <div>404</div>;
}

export default MainPage;
