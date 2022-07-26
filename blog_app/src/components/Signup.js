import React from "react";
import { Link } from "react-router-dom";
import { registerURL } from "../utils/constant";
import withRouter from "./withRouter";
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
        username: "",
      },
    };
  }
  validatePassword = (value) => {
    let hasNum = false,
      hasString = false;
    if (!value) {
      return `This field can't be empty`;
    } else if (value.length < 6) {
      return "Password must be more than 6 characters";
    } else {
      let valArr = value.split("");
      valArr.forEach((val) => {
        if (!Boolean(Number(val))) {
          hasString = true;
        }
        if (Boolean(Number(val))) {
          hasNum = true;
        }
      });
    }
    return hasNum && hasString
      ? ""
      : "Password must contain both strings and numbers";
  };

  handleChange = (event) => {
    let { name, value } = event.target;
    let errors = { ...this.state.errors };
    switch (name) {
      case "email":
        errors.email =
          value.indexOf("@") === -1 ? "Include @ in your email" : "";
        break;
      case "password":
        errors.password = this.validatePassword(value);
        break;
      case "username":
        errors.username =
          value.length < 6 ? "Username should have more than 6 characters" : "";
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      errors: errors,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    fetch(registerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username,
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
        }
        return res.json();
      })
      .then(({ user }) => {
        this.props.updateUser(user);
        this.props.navigate("/");
      })
      .catch((errors) => this.setState({ errors }));
  };
  render() {
    return (
      <section className="form-container  container">
        <h1 className="text-lg">Sign up</h1>
        <Link to="/login">
          <p>Need an account?</p>
        </Link>
        <form className="form flex-column" onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.username}
            type="username"
            name="username"
            placeholder="username"
            className="form-control"
          />
          {this.state.errors.username ? (
            <span className="error-message text-danger">
              * {this.state.errors.username}
            </span>
          ) : (
            ""
          )}
          <input
            onChange={this.handleChange}
            value={this.state.email}
            type="email"
            name="email"
            placeholder="Email"
            className="form-control"
          />
          {this.state.errors.email ? (
            <span className="error-message text-danger">
              * {this.state.errors.email}
            </span>
          ) : (
            ""
          )}
          <input
            onChange={this.handleChange}
            value={this.state.password}
            type="password"
            name="password"
            placeholder="Password"
            className="form-control"
          />
          {this.state.errors.password ? (
            <span className="error-message text-danger">
              * {this.state.errors.password}
            </span>
          ) : (
            ""
          )}
          <input
            type="submit"
            value="Sign in"
            className="form-control submit"
          />
        </form>
      </section>
    );
  }
}
export default withRouter(Signup);