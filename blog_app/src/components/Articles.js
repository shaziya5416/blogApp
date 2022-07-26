import React from "react";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import FeedNav from "./FeedNav";
import { articlesURL } from "../utils/constant";

class Articles extends React.Component {
  favoriteArticle = (slug) => {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: "POST",
      headers: {
        authorization: `Token ${localStorage.getItem("app_user")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ article }) => {
        console.log(article);
        this.props.fetchData();
      });
  };

  unFavoriteArticle = (slug) => {
    fetch(articlesURL + `/${slug}/favorite`, {
      method: "DELETE",
      headers: {
        authorization: `Token ${localStorage.getItem("app_user")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ article }) => {
        console.log(article);
        this.props.fetchData();
      });
  };
  render() {
    if (!this.props.articles) {
      return <Loader />;
    }

    return (
      <>
        {" "}
        <section className="articles-container">
          <div className="container flex-column">
            <FeedNav
              activeTab={this.props.feedNav}
              emptyTab={this.props.emptyTab}
            />
            {this.props.articles.length === 0
              ? "No articles in your feed yet..."
              : this.props.articles.map((article) => (
                  <article
                    key={article.slug}
                    className="article-card flex-column"
                  >
                    <div className="user-info flex">
                      <img
                        src={
                          article.author.image
                            ? article.author.image
                            : "logo512.png"
                        }
                        alt={article.author}
                        className="user-icon"
                      />
                      <div className="article-creation-info ">
                        <h6>
                          <Link
                            to={`/profile/${article.author.username}`}
                            className="text-sm text-primary site-link"
                          >
                            {article.author.username}
                          </Link>
                        </h6>
                        <time className="text-xsm text-secondary">
                          {article.createdAt.split(`T`)[0]}
                        </time>
                        <button
                          className="favourite-count"
                          onClick={
                            article.favoritesCount === 0
                              ? () => this.favoriteArticle(article.slug)
                              : () => this.unFavoriteArticle(article.slug)
                          }
                        >
                          💚 {article.favoritesCount}
                        </button>
                      </div>
                    </div>
                    <div className="article-info">
                      <Link
                        to={`/articles/${article.slug}`}
                        className="site-link"
                      >
                        <h3 className="text-md text-bold text-primary">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-secondary">
                        {article.description}
                      </p>
                    </div>
                    <div className="read-info flex">
                      <Link
                        to={`/articles/${article.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <p className="text-xsm text-secondary read-link">
                          Read More...
                        </p>
                      </Link>
                      <ul className="article-card-tag-list flex">
                        {article.tagList?.map((tag) => (
                          <li
                            key={tag}
                            className="text-xsm text-secondary tag-item"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
          </div>
        </section>
      </>
    );
  }
}
export default Articles;