import { useState, useEffect } from 'react';
import '../../stylesheets/TagsPage.css';
import TagsWrapper from './TagsWrapper';
import axios from 'axios';

function TagsPage({ updatePage, setSearch}) {
  const [tagsObj, setTagsObj] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get(`http://localhost:8000/posts/tags`, {
        cancelToken: source.token,
      })
      .then((res) => {
        setTagsObj(res.data);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request cancelled:', err.message);
        } else {
          console.log('Request failed:', err.message);
        }
      });

    return () => {
      source.cancel('Component unmounted');
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div id="upper-main-tags">
        <div id="top-upper-main-tags">
          <h1 id="top-upper-main-title-tags">All Tags</h1>
          <button id="main-ask" onClick={() => updatePage('ask-question')}>
            Ask Question
          </button>
          <h1 id="number-of-tags">{tagsObj.length} Tags</h1>
        </div>
      </div>
      <div id="lower-main">
        <div id="tags-wrapper-div">
          <TagsWrapper updatePage={updatePage} setSearch={setSearch} tags={tagsObj} />
        </div>
      </div>
    </div>
  );
}

export default TagsPage;
