import generateDate from '../utils/generateDate';
import GenerateHtmlForTags from '../utils/generateHtmlForTags';
import axios from 'axios';

function QuestionContainers({ questions, updatePage }) {
  if (questions.length === 0) {
    return (
      <div id="no-question-found">
        <h1>No questions found</h1>
      </div>
    );
  }
  const questionsList = questions.map((question) => {
    return (
      <div key={question._id} className="question-container">
        <div className="question-ans-views-div">
          <h6>{question.answers.length} answers</h6>
          <h6>{question.views} views</h6>
        </div>
        <div className="question-content-div">
          <div id="question-content-div-top">
            <h2
              id={question._id}
              onClick={async () => {
                await axios.patch('http://localhost:8000/posts/questions/incrementViews/' + question._id);
                updatePage({ currentPage: 'question-answer', qid: question._id });
              }}
            >
              {question.title}
            </h2>
          </div>
          <div id="question-content-div-bottom">
            <GenerateHtmlForTags tagIds={question.tags} qid={question._id} />
          </div>
        </div>
        <div className="question-metadata-div">
          <h4>{question.asked_by}&nbsp;</h4>
          <h5>asked {generateDate(question.ask_date_time, new Date())} </h5>
        </div>
      </div>
    );
  });

  return <>{questionsList}</>;
}

export default QuestionContainers;
