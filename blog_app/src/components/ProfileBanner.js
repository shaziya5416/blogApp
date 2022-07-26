

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/userContext";

import withRouter from "./withRouter";
function ProfileBanner(props) {
  const { image, username, following } = props.profile;
  console.log(props.user, "props");
  let user = useContext(UserContext);
  console.log(user.data.user, "context");
  return (
    <section className="profile-banner">
      <div className="container">
        <div className="p-banner-box">
          <img
            src={
              image ||
              `https://static.productionready.io/images/smiley-cyrus.jpg`
            }
            alt="img"
          />
          <p> {username}</p>
        </div>
        <div className="flex flex-end">
          {props.user && props.user.username === username ? (
            <Link to="/settings">
              <button className="logout-btn edit-profile-btn">
                ⚙️ Edit Profile Setting
              </button>
            </Link>
          ) : (
            <div className="follow-box">
              {following === false ? (
                <button
                  className="logout-btn"
                  onClick={() => props.handleFollow(username)}
                >
                  + Follow {username}
                </button>
              ) : (
                <button
                  className="logout-btn"
                  onClick={() => props.handleFollow(username)}
                >
                  UnFollow {username}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default withRouter(ProfileBanner);