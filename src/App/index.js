import "./index.css";
import React, { Component } from "react";
import axios from 'axios';
import Search from "../Search/index";
import Button from "../Button/index";
import Table from "../Table/";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
  } from '../constants';

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
    }
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]? results[searchKey].hits: [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = ( results && results[searchKey] && results[searchKey].page) || 0;
    const list = ( results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        { error ? 
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
          : <Table list={list} onDismiss={this.onDismiss}/>
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            Больше историй
          </Button>
        </div>
      </div>
    );
  }
}

// const Search = ({ value, onChange, children, onSubmit }) => (
//   <form onSubmit={onSubmit}>
//     <input type="text" value={value} onChange={onChange} />
//     <button type="submit">{children}</button>
//   </form>
// );

// class Button extends Component {
//   render() {
//     const { onClick, className = "", children } = this.props;
//     return (
//       <button onClick={onClick} className={className} type="button">
//         {children}
//       </button>
//     );
//   }
// }
// const Table = ({ list, onDismiss }) => (
//   <div className="table">
//     {list.map((item) => (
//       <div key={item.objectID} className="table-row">
//         <span style={{ width: "40%" }}>
//           <a href={item.url}>{item.title}</a>
//         </span>
//         <span style={{ width: "30%" }}>{item.author}</span>
//         <span style={{ width: "10%" }}>{item.num_comments}</span>
//         <span style={{ width: "10%" }}>
//           <Button
//             onClick={() => onDismiss(item.objectID)}
//             className="button-inline"
//           >
//             Отбросить
//           </Button>
//         </span>
//       </div>
//     ))}
//   </div>
// );

export default App;
