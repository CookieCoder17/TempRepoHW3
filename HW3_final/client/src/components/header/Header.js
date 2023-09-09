import React from 'react';
import '../../stylesheets/Header.css';

function Header({ setSearch, updatePage }) {
  function searchQuestion(e) {
    if (e.key === 'Enter') {
      setSearch({ tagSearch: false, search: e.target.value });
      updatePage('questions');
      e.target.value = '';
    }
  }
  return (
    <div id="header" className="header">
      <div id="header-title-div">
        <a id="header-title" href="/">
          Fake Stack Overflow
        </a>
      </div>
      <div id="header-search-div">
        <input
          id="header-search"
          onKeyUp={(e) => searchQuestion(e)}
          type="text"
          name="search"
          placeholder="Search..."
        />
      </div>
    </div>
  );
}

export default Header;
