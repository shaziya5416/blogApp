import React from "react";
import ProfileBanner from "./ProfileBanner";

import withParams from "./withParams";
import { articlesURL, profileURL } from "../utils/constant";
import { Link } from "react-router-dom";
class Profile extends React.Component {
  state = {
    activeTab: "author",
    articles: [],
    profile: "",
  };
  componentDidMount() {
    this.fetchProfile();
    this.fetchData();
  }
  componentDidUpdate(preProps, preState) {
    if (preProps.params.username !== this.props.params.username) {
      this.fetchProfile();
      this.fetchData();
    }
  }
  fetchProfile = () => {
    fetch(profileURL + `/${this.props.params.username}`)
      .then((data) => {
        if (!data.ok) {
          data.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return data.json();
      })
      .then(({ profile }) => {
        this.setState({ profile });
      })
      .catch((error) => console.log(error));
  };
  fetchData = () => {
    fetch(
      articlesURL + `/?${this.state.activeTab}=${this.props.params.username}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Can not fetch data for specific user!`);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          articles: data.articles,
        });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch articles" });
      });
  };
  handleActive = (tab) => {
    this.setState({ activeTab: tab }, () => {
      this.fetchData();
    });
  };
  handleFollow = (username, user) => {
    console.log(username);
    fetch(profileURL + `/${username}/follow`, {
      method: "POST",
      headers: {
        authorization: `Token ${this.props.user.token}`,
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
      .then(({ profile }) => {
        console.log(profile);
        this.setState({ profile: profile });
        // this.fetchProfile();
      })
      .catch((errors) => console.log(errors));
  };

  handleUnFollow = (username, user) => {
    fetch(profileURL + `/${username}/follow`, {
      method: "DELETE",
      headers: {
        authorization: `Token ${this.props.user.token}`,
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
      .then(({ profile }) => {
        console.log(profile);
        this.fetchProfile();
      })
      .catch((errors) => console.log(errors));
  };
  render() {
    return (
      <>
        <ProfileBanner
          profile={this.state.profile}
          user={this.props.user}
          handleFollow={this.handleFollow}
          handleUnFollow={this.handleUnFollow}
        />

        <section className="container feed-nav">
          <ul className="my-article flex">
            <li
              onClick={() => this.handleActive(`author`)}
              className={this.state.activeTab === `author` && "active-feed"}
            >
              My Articles
            </li>
            <li
              onClick={() => this.handleActive(`favorited`)}
              className={this.state.activeTab === `favorited` && "active-feed"}
            >
              Favorited Articles
            </li>
          </ul>
        </section>
        <div className="container flex-column prof-article">
          {!this.state.articles
            ? "No articles yet ..."
            : this.state.articles.map((article) => (
                <article key={article.slug} className="article-card flex">
                  <div className="user-info flex">
                    <img
                      src={article.author.image}
                      className="user-icon"
                      alt={article.slug}
                    />
                    <div className="article-creation-info">
                      <h6 className="text-sm text-primary">
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
                      <button className="favourite-count">
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
      </>
    );
  }
}
export default withParams(Profile);