import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import withParams from "./withParams";
import { articlesURL } from "../utils/constant";
import CommentBox from "./CommentBox";

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      error: "",
    };
  }
  componentDidMount() {
    let slug = this.props.params.slug;

    fetch(articlesURL + "/" + slug)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          article: data.article,
          error: "",
        });
      })
      .catch((err) => {
        this.setState({ error: "Not able to fetch articles" });
      });
  }
  deleteArticle = () => {
    let slug = this.props.params.slug;
    fetch(articlesURL + "/" + slug, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((res) => {
        console.log("article is deleted", res, "article");
        this.props.navigate("/");
        if (!res.ok) {
          throw new Error(`can not delete comment`);
        }
        return res.json();
      })
      .then(({ comment }) => {
        this.props.navigate("/");
      })
      .catch((errors) => {
        this.setState({ errors });
      });
  };
  render() {
    const { article, error } = this.state;
    console.log(article, "article");
    let user = this.props.user;

    if (error) {
      return (
        <center>
          <h1 className="error">{error}</h1>
        </center>
      );
    }
    if (!article) {
      return <Loader />;
    }
    return (
      <>
        <section className="single-article">
          <div className="container">
            <h5>{article.title}</h5>
          </div>
          <div className="flex author-box container">
            <img src={article.author.image} alt="img" />
            <div className="info flex-column">
              <p>{article.author.username}</p>
              <span className="date">{article.createdAt.split(`T`)[0]}</span>
            </div>
            <div className="edit-article-btn">
              {user && user.username === article.author.username ? (
                <>
                  <Link to={`/updateArticle/${article.slug}`}>
                    <button className="logout-btn">Edit Article</button>
                  </Link>
                  <Link to={`/articles/${article.slug}`}>
                    <button className="logout-btn" onClick={this.deleteArticle}>
                      Delete Article
                    </button>
                  </Link>
                </>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </section>
        <section className="container single-article-body">
          <p>{this.state.article.body}</p>
          <span>{this.state.article.tagList}</span>
        </section>
        {user === null ? (
          <footer className="comment-footer">
            <div>
              <p>
                <Link to="/login">
                  <span>Sign in</span>
                </Link>{" "}
                or{" "}
                <Link to="/signup">
                  <span>sign up</span>
                </Link>
                to add comments on this article.
              </p>
            </div>
          </footer>
        ) : (
          <CommentBox user={user} />
        )}
      </>
    );
  }
}

export default withParams(Article);