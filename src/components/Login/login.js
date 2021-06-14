import React, { Component } from "react";
import styles from "./Login.module.scss";
import firebase from "../../firebase";
import "firebase/auth";

export default class Login extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("componentDidMount", user);
      if (user) {
        /*this.setState({
          currentUser: user,
        })
        this.props.setSession({
          isLoggedIn: true,
          currentUser: user
        })*/
        this.selectUserByUid(user);
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      currentUser: null,
      message: "",
    };
  }

  selectUserByUid(user) {
    const itemsRef = firebase.database().ref("user/" + user.uid);
    itemsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      // console.log('data', data);
      if (
        data == null ||
        (data.position.toLowerCase() != "hr" &&
          data.position.toLowerCase() != "admin")
      ) {
        firebase
          .auth()
          .signOut()
          .then((response) => {
            this.props.setSession({
              isLoggedIn: false,
              currentUser: null,
              errorMessage: null,
              user: null,
            });
          });
      } else {
        this.setState({
          currentUser: user.user,
          user: data,
        });
        this.props.setSession({
          isLoggedIn: true,
          currentUser: user.user,
          user: data,
        });
      }
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    // console.log("user", email, password);
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      this.selectUserByUid(response.user);
    } catch (error) {
      console.log("error", error.message);
      this.setState({
        message: error.message,
      });
      this.props.setSession({
        isLoggedIn: false,
        currentUser: null,
        errorMessage: error.message,
        data: null,
      });
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <form className={styles.form} onSubmit={this.onSubmit}>
        <h3>Log in</h3>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
            onChange={this.onChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
            onChange={this.onChange}
          />
        </div>

        <button type="submit" className="btn btn-signin btn-lg btn-block ">
          Sign in
        </button>
        {/*<div className="form-group">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
              </label>
          </div>
        </div>*/}

        {/*<a class="alignleft" href="/sign-up">
          Sign-up
          </a>
        <span class="alignright">
          Forgot <a href="/home">password?</a>
        </span>*/}
      </form>
    );
  }
}
