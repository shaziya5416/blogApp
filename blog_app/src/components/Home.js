import React from "react";
import Hero from "./Hero";
import Articles from "./Articles";
import Tags from "./Tags";

import { articlesURL } from "../utils/constant";
import Pagination from "./Pagination";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      articles: null,
      articlesCount: 0,
      error: "",
      limit: 10,
      activePage: 1,
      activeTab: "",
    };
  }
  componentDidMount() {
    fetch(articlesURL + `/?limit=${this.state.limit}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ articles, articlesCount }) =>
        this.setState({
          articles: articles,
          articlesCount: articlesCount,
        })
      )
      .catch((err) => {
        this.setState({ error: "Not able to fetch tags" });
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.activePage !== this.state.activePage ||
      prevState.activeTab !== this.state.activeTab
    ) {
      this.fetchData();
    }
  }
  fetchData = () => {
    const offset = (this.state.activePage - 1) * 10;
    const tag = this.state.activeTab;
    fetch(
      articlesURL +
        `/?limit=${this.state.limit}&offset=${offset}` +
        (tag && `&tag=${tag}`)
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ articles, articlesCount }) =>
        this.setState({
          articles: articles,
          articlesCount: articlesCount,
        })
      )
      .catch((err) => {
        this.setState({ error: "Not able to fetch tags" });
      });
  };
  updatePageIndex = (index) => {
    this.setState(
      {
        activePage: index,
      },
      this.fetchData
    );
  };
  emptyTab = () => {
    this.setState({
      activeTab: "",
    });
  };
  addTab = (value) => {
    this.setState({
      activeTab: value,
    });
  };
  render() {
    const { articlesCount, limit, activePage } = this.state;
    return (
      <>
        <Hero />
        <div className="flex space-between container main-wrapper">
          <Articles
            articles={this.state.articles}
            feedNav={this.state.activeTab}
            emptyTab={this.emptyTab}
            fetchData={this.fetchData}
          />
          <Tags addTab={this.addTab} />
        </div>
        <Pagination
          articlesCount={articlesCount}
          articlesPerPage={limit}
          activeIndex={activePage}
          updatePage={this.updatePageIndex}
        />
      </>
    );
  }
}
export default Home;