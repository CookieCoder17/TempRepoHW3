import React from 'react';
import PageSelector from './pageSelector/PageSelector.js';

export default class FakeStackOverflow extends React.Component {
  render() {
    return (
      <div>
        <PageSelector currentPage={'questions'} />
      </div>
    );
  }
}
