import React from "react";
import { articlesURL } from "../utils/constant";
import Comment from "./Comment";
import withRouter from "./withRouter";

class CommentBox extends React.Component {
  state = {
    comment: "",
    comments: null,
    invert: false,
    errors: {
      comment: "",
    },
  };
  componentDidMount() {
    this.fetchComments();
  }
  componentDidUpdate(preProps, preState) {
    if (preState.invert !== this.state.invert) {
      this.fetchComments();
      console.log("update");
    }
  }

  handleChange = (event) => {
    let { name, value } = event.target;

    this.setState({ [name]: value });
  };
  fetchComments = () => {
    let slug = this.props.params.slug;

    fetch(articlesURL + `/${slug}/comments`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ comments }) => {
        console.log(comments);
        this.setState({
          comments,
        });
      })
      .catch((errors) => console.log(errors));
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { comment } = this.state;
    let slug = this.props.params.slug;
    fetch(`${articlesURL}/${slug}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
      },
      body: JSON.stringify({
        comment: {
          body: comment,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`can not create new comment`);
        }
        return res.json();
      })
      .then(({ comment }) => {
        this.setState({
          invert: !this.state.invert,
        });
      })
      .catch((errors) => {
        this.setState({ errors });
      });
  };
  deleteComment = (id) => {
    console.log(`delete`);
    let slug = this.props.params.slug;
    fetch(`${articlesURL}/${slug}/comments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
      },
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        return this.setState({
          invert: !this.state.invert,
        });
      }

      // if (!res.ok) {
      //   throw new Error(`can not delete comment`);
      // }
      // return res.json();
    });
    // .then(({ comment }) => {
    //   this.setState({
    //     comment: "",
    //   });
    // })
    // .catch((errors) => {
    //   this.setState({ errors });
    // });
  };
  render() {
    // let { body } = this.state.errors;

    return (
      <>
        <section className="container">
          <form className="comment-box">
            <fieldset>
              <textarea
                onChange={this.handleChange}
                type="text"
                name="comment"
                value={this.state.comment}
                placeholder="Write a comment..."
              />
            </fieldset>
            <div className="post-comment flex space-between">
              <img
                src={
                  this.props.user.image ||
                  `https://static.productionready.io/images/smiley-cyrus.jpg`
                }
                alt={this.props.user.username}
              />
              <button type="submit" onClick={this.handleSubmit}>
                Post Comment
              </button>
            </div>
          </form>
          <div>
            {this.state.comments &&
              this.state.comments.map((comment, i) => (
                <Comment
                  key={i}
                  {...comment}
                  deleteComment={this.deleteComment}
                  user={this.props.user}
                />
              ))}
          </div>
        </section>
      </>
    );
  }
}
export default withRouter(CommentBox);