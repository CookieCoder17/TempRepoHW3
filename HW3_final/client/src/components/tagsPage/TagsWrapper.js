import axios from 'axios';
import { useState, useEffect } from 'react';

function TagsWrapper({ updatePage, setSearch, tags }) {
  const searchForTag = (element) => {
    setSearch({ tagSearch: true, search: '[' + element + ']' });
    updatePage('questions');
  };

  const [tagQuestionsCount, setTagQuestionsCount] = useState({});

  useEffect(() => {
    const fetchTagQuestionsCount = async () => {
      const countObj = {};
      for (let i = 0; i < tags.length; i++) {
        const res = await axios.get(`http://localhost:8000/posts/tags/tag_id/${tags[i]._id}/questions`);
        countObj[tags[i]._id] = res.data.length;
      }
      setTagQuestionsCount(countObj);
    };
    fetchTagQuestionsCount();
  }, [tags]);

  return (
    <ul id="tags-wrapper">
      {tags.map((element) => (
        <li key={element._id} className="tag-container">
          <div className="tag-name-div">
            <h2>
              <a
                href={element._id}
                id={element._id}
                onClick={(e) => {
                  e.preventDefault();
                  searchForTag(element.name);
                }}
              >
                {element.name}
              </a>
            </h2>
          </div>
          <div className="tag-num-questions-div">
            <h4>
              {tagQuestionsCount[element._id] ?? 'Loading...'}{' '}
              {tagQuestionsCount[element._id] === 1 ? 'question' : 'questions'}
            </h4>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TagsWrapper;
