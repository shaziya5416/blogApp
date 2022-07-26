import React from "react";
import { articlesURL } from "../utils/constant";
import withRouter from "./withRouter";

class EditArticle extends React.Component {
  state = {
    title: "",
    description: "",
    tagList: "",
    body: "",
    errors: {
      title: "",
      description: "",
      body: "",
    },
  };

  componentDidMount() {
    fetch(articlesURL + `/${this.props.params.slug}`)
      .then((data) => data.json())
      .then(({ article }) => {
        let { title, description, tagList, body } = article;
        this.setState({
          title,
          description,
          tagList: tagList.join(", "),
          body,
        });
      });
  }

  handleChange = (event) => {
    let { name, value } = event.target;
    let { errors } = this.state;
    switch (name) {
      case "title":
        errors.title = value ? "" : "title should be includes one world";
        break;
      case "description":
        errors.description = value
          ? ""
          : "description should be includes one world";
        break;
      case "body":
        errors.title = value ? "" : "body should be includes one world";
        break;
      default:
        break;
    }

    this.setState({
      errors,
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { title, description, tagList, body } = this.state;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
      },
      body: JSON.stringify({
        article: {
          title,
          description,
          body,
          tagList: tagList.split(",").map((e) => e.trim()),
        },
      }),
    };
    fetch(articlesURL, requestOptions)
      .then((res) => {
        if (!res.ok) {
          res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        }
        return res.json();
      })
      .then(({ article }) => {
        this.setState({ title: "", description: "", tagList: "", body: "" });
        this.props.navigate("/");
      })
      .catch((errors) => this.setState({ errors }));
  };

  render() {
    const { title, description, tagList, body } = this.state;
    return (
      <div className="container">
        <form className="new-post flex-center">
          <fieldset className="flex-column">
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              name="title"
              onChange={this.handleChange}
            />
            <input
              type="text"
              placeholder="Enter description"
              value={description}
              name="description"
              onChange={this.handleChange}
            />
            <textarea
              placeholder="writr your article(In markdown format)"
              value={body}
              name="body"
              onChange={this.handleChange}
            ></textarea>
            <input
              type="text"
              placeholder="Enter Tags"
              value={tagList}
              name="tagList"
              onChange={this.handleChange}
            />
            <input
              type="submit"
              className="submit"
              onClick={this.handleSubmit}
              placeholder="Publish Title"
            />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default withRouter(EditArticle);