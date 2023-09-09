import React, { useState } from 'react';
import '../../stylesheets/NavBar.css';
import MainPage from '../mainPage/MainPage';
import Header from '../header/Header';

function NavBar({ currentPage }) {
  const [selectedNav, setSelectedNav] = useState(currentPage || 'none');
  const [currentSearch, setSearch] = useState({ tagSearch: false, search: '' });

  const updateSelectedNav = (navValue) => {
    setSelectedNav(navValue);
  };

  const updateSearch = (searchValue) => {
    setSearch(searchValue);
  };

  function navQuestionClick() {
    setSelectedNav('questions');
    setSearch({ tagSearch: false, search: '' });
  }

  function navTagsClick() {
    setSelectedNav('tags');
    setSearch({ tagSearch: false, search: '' });
  }

  return (
    <div>
      <Header setSearch={updateSearch} updatePage={updateSelectedNav} />
      <div id="nav-main-div">
        <div id="nav" className={'nav'}>
          <button
            id="nav-questions"
            onClick={navQuestionClick}
            className={'nav-button'}
            style={{
              backgroundColor: selectedNav === 'questions' ? 'lightgray' : 'whitesmoke',
            }}
          >
            Questions
          </button>
          <button
            id="nav-tags"
            onClick={navTagsClick}
            className={'nav-button'}
            style={{ backgroundColor: selectedNav === 'tags' ? 'lightgray' : 'whitesmoke' }}
          >
            Tags
          </button>
        </div>
        <MainPage
          currentPage={selectedNav}
          updatePage={updateSelectedNav}
          setSearch={updateSearch}
          currentSearch={currentSearch}
        />
      </div>
    </div>
  );
}

export default NavBar;
