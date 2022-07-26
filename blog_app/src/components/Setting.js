import React from "react";
import { updateUserURL } from "../utils/constant";
import withRouter from "./withRouter";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
      errors: {
        image: "",
        username: "",
        bio: "",
        email: "",
        password: "",
      },
    };
  }
  validateField = (Field) => {
    let FieldError;
    if (Field.length < 1) {
      FieldError = "This field can't be empty";
    }
    return FieldError;
  };
  validateBio = (bio) => {
    let bioError;
    if (bio.length < 5) {
      bioError = "This field can't be less than 2 words";
    }
    return bioError;
  };
  validatePassword = (password) => {
    let passwordError;
    if (password.length < 7) {
      passwordError = "Password can't be less than 6 characters";
    }
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
    if (!re.test(password)) {
      passwordError = "Password must contain a character and a Number";
    }
    return passwordError;
  };
  handleSubmit = (event) => {
    console.log(this.props.user.token, `efe`);
    event.preventDefault();
    const { image, username, bio, email, password } = this.state;
    console.log(this.state.password);
    fetch(updateUserURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${this.props.user.token}`,
      },
      body: JSON.stringify({
        user: {
          image,
          username,
          bio,
          email,
          password,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(({ errors }) => {
            return Promise.reject(errors);
          });
        } else {
          return res.json();
        }
      })
      .then(({ user }) => {
        console.log(user);
        this.setState({
          image: "",
          username: "",
          bio: "",
          email: "",
          password: "",
        });
        this.props.updateUser({ ...user }, () => {
          this.props.navigate(`/`);
        });
      })
      .catch((errors) => {
        this.setState({ errors });
      });
  };
  handleInput = (event) => {
    let { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "image":
        errors.image = this.validateField(value);
        break;
      case "username":
        errors.name = this.validateField(value);
        break;
      case "bio":
        errors.bio = this.validateBio(value);
        break;
      case "email":
        errors.email = this.validateField(value);
        break;
      case "password":
        errors.password = this.validatePassword(value);
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      errors,
    });
  };
  componentDidMount = () => {
    this.setState({
      username: this.props.user.username,
      email: this.props.user.email,
      image: this.props.user.image,
      bio: this.props.user.bio,
      password: this.props.user.password,
    });
  };
  render() {
    let { image, username, bio, email, password } = this.state.errors;

    return (
      <div className="container setting ">
        <center>
          <h1>Your Settings</h1>
        </center>
        <form className="flex-center">
          <fieldset className="flex-column">
            <input
              type="text"
              placeholder="URL of user profile"
              value={this.state.image}
              id="image"
              name="image"
              onChange={this.handleInput}
            />
            <span>{image}</span>
            <input
              type="text"
              placeholder="Username"
              value={this.state.username}
              name="username"
              id="username"
              onChange={this.handleInput}
            />
            <span>{username}</span>
            <textarea
              placeholder="short bio about you..."
              value={this.state.bio}
              name="bio"
              id="bio"
              onChange={this.handleInput}
            ></textarea>
            <span>{bio}</span>
            <input
              type="text"
              placeholder="Email"
              value={this.state.email}
              id="email"
              name="email"
              onChange={this.handleInput}
            />
            <span>{email}</span>
            <input
              type="text"
              placeholder="New password"
              value={this.state.password}
              id="password"
              name="password"
              onChange={this.handleInput}
            />
            <span>{password}</span>
            <input
              type="submit"
              className="submit"
              value="Update Settings"
              onClick={this.handleSubmit}
            />
          </fieldset>
        </form>
        <div className="logout-box">
          <button
            className="logout-btn"
            onClick={() => {
              this.props.logout();
              this.props.navigate("/");
            }}
          >
            Click here to Logout
          </button>
        </div>
      </div>
    );
  }
}
export default withRouter(Setting);