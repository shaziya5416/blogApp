import React from "react";
import Loader from "./Loader";
import { tagsURL } from "../utils/constant";

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: null,
      error: "",
    };
  }
  componentDidMount() {
    fetch(tagsURL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ tags }) =>
        this.setState({
          tags,
        })
      )
      .catch((err) => {
        this.setState({ error: "Not able to fetch tags" });
      });
  }
  render() {
    if (!this.state.tags) {
      return <Loader />;
    }
    return (
      <div className="flex-25">
        <h3 className="text-md tag-heading text-danger">#Popular Tags</h3>
        <ul className="tags-menu wrap">
          {this.state.tags.map((tag) =>
            tag ? (
              <li
                key={tag}
                className="tags-menu-item text-xsm"
                onClick={() => this.props.addTab(tag)}
              >
                {tag}
              </li>
            ) : (
              ""
            )
          )}
        </ul>
      </div>
    );
  }
}
export default Tags;