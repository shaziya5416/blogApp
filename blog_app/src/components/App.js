import React from "react";
import Header from "./Header";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Article from "./Article";
import NewPost from "./NewPost";
import Setting from "./Setting";
import Profile from "./Profile";
import EditArticle from "./EditArticle";
import FullpageSpinner from "./FullpageSpinner";
import { localStorageKey, userVerifyURL } from "../utils/constant";
import NoMatch from "./NoMatch";
import ErrorBoundry from "./ErrorBoundry";
import { UserProvider } from "../context/userContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: null,
      isVerifying: true,
    };
  }
  fetchData = () => {
    const storagekey = localStorage[localStorageKey];
    fetch(userVerifyURL, {
      method: "GET",
      headers: {
        authorization: `Token ${storagekey}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then(({ errors }) => {
          return Promise.reject(errors);
        });
      })
      .then(({ user }) => this.updateUser(user))
      .catch((errors) => console.log(errors));
  };
  componentDidMount() {
    let storagekey = localStorage[localStorageKey];
    if (storagekey) {
      fetch(userVerifyURL, {
        method: "GET",
        headers: {
          authorization: `Token ${storagekey}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        })
        .then(({ user }) => this.updateUser(user))
        .catch((errors) => console.log(errors));
    } else {
      this.setState({ isVerifying: false });
    }
  }
  updateUser = (user) => {
    this.setState({
      isLoggedIn: true,
      user: user,
      isVerifying: false,
    });
    localStorage.setItem(localStorageKey, user.token);
  };
  logout = () => {
    this.setState({
      isLoggedIn: false,
    });
    localStorage.clear();
  };
  render() {
    if (this.state.isVerifying) {
      return <FullpageSpinner />;
    }
    return (
      <>
        <UserProvider
          value={{
            data: this.state,
            updateUser: this.updateUser,
            handleLogout: this.logout,
          }}
        >
          <ErrorBoundry>
            <Header isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
            {this.state.isLoggedIn ? (
              <AuthenticatedApp user={this.state.user} logout={this.logout} />
            ) : (
              <UnauthenticatedApp
                updateUser={this.updateUser}
                user={this.state.user}
              />
            )}
          </ErrorBoundry>
        </UserProvider>
      </>
    );
  }
}
function UnauthenticatedApp(props) {
  return (
    <>
      <Routes>
        <Route path="/" exact="true" element={<Home />} />
        <Route
          path="/login"
          element={<Login updateUser={props.updateUser} />}
        />
        <Route
          path="/signup"
          element={<Signup updateUser={props.updateUser} />}
        />
        <Route path="/articles/:slug" element={<Article user={props.user} />} />
        <Route
          path="/profile/:username"
          element={<Profile user={props.user} />}
        />
      </Routes>
    </>
  );
}
function AuthenticatedApp(props) {
  return (
    <>
      <Routes>
        <Route path="/" exact="true" element={<Home />} />
        <Route path="/new-post" element={<NewPost user={props.user} />} />
        <Route
          path="/settings"
          element={
            <Setting
              user={props.user}
              updateUser={props.updateUser}
              logout={props.logout}
            />
          }
        />
        <Route
          path="/profile/:username"
          element={<Profile user={props.user} />}
        />
        <Route
          path="/updateArticle/:slug"
          element={<EditArticle user={props.user} />}
        />
        <Route path="/articles/:slug" element={<Article user={props.user} />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}
export default App;

// {this.state.isLoggedIn ? (
//   <AuthenticatedApp
//     isLoggedIn={this.state.isLoggedIn}
//     updateUser={this.updateUser}
//   />
// ) : (
//   <UnauthenticatedApp
//     isLoggedIn={this.state.isLoggedIn}
//     updateUser={this.updateUser}
//   />
// )}
// return (
//   <>
//     <Header isLoggedIn={this.state.isLogged} />
//     <Routes>
//       <Route path="/" exact element={<Home />} />
//       <Route
//         path="/login"
//         element={<Login updateUser={this.updateUser} />}
//       />
//       <Route
//         path="/signup"
//         element={<Signup updateUser={this.updateUser} />}
//       />
//       <Route path="/articles/:slug" element={<Article />} />
//     </Routes>
//   </>
// );