import React from "react";
import withRouter from "./withRouter";

function Comment(props) {
  return (
    <section className="container">
      <div className="comment-box">
        <div className="comnt-body">
          <p>{props.body}</p>
        </div>
        <div className="post-comment flex-column">
          <div className="flex  space-between">
            <div className="flex flex-center">
              <img
                src={
                  props.author.image ||
                  `https://static.productionready.io/images/smiley-cyrus.jpg`
                }
                alt={props.author.username}
              />
              <p>{props.author.username}</p>
            </div>

            <p className="date">{props.createdAt.split("T")[0]}</p>
          </div>
          <div
            onClick={() => props.deleteComment(props.id)}
            className="delete-comment align-self"
          >
            {props.user.username === props.author.username ? (
              <i className="fas fa-trash"></i>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default withRouter(Comment);