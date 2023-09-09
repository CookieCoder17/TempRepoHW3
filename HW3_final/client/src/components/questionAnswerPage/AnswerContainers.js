import parseContent from '../utils/parseContent';
import generateDate from '../utils/generateDate';
import axios from 'axios';
import { useState, useEffect } from 'react';

function AnswerContainers({ question_id }) {
  const [answerListObj, setAnswerListObj] = useState([]);

  useEffect(() => {
      axios.get(`http://localhost:8000/posts/answers/${question_id}`).then((res) => {
        setAnswerListObj([...res.data]);
      });
  }, [question_id]);

  const answerList = answerListObj.map((element) => {
    let timeNow = new Date();
    return (
      <div key={element._id} className="answer-container">
        <div className="answer-content-div">
          <p>{parseContent(element.text)}</p>
        </div>
        <div className="answer-metadata-div">
          <h4>{element.ans_by}&nbsp;</h4>
          <h5>asked {generateDate(element.ans_date_time, timeNow)} </h5>
        </div>
      </div>
    );
  });
  return <>{answerList}</>;
}

export default AnswerContainers;
