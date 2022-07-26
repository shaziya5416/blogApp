import React from "react";
import { Link } from "react-router-dom";

function FeedNav(props) {
  return (
    <nav className="feed-nav">
      <ul className="flex">
        <li onClick={props.emptyTab}>
          <Link className={props.activeTab === "" && "active-feed"} to="/">
            Global Feed
          </Link>
        </li>
        {props.activeTab && (
          <li>
            <Link className={props.activeTab && "active-feed"} to="/">
              # {props.activeTab}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default FeedNav;