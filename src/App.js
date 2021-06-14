import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import firebase from "./firebase";
import "firebase/auth";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login/login";
import SignUp from "./components/Login/signup";
import Home from "./components/Home/Home";
import List from "./components/List/List";
import AddUser from "./components/AddUser/addUser";
import Checking from "./components/HistoryChecking/Checking";
import Leave from "./components/Leave/Leave";
import Narbar from "./components/Navber/navbar";

function App() {
  const [session, setSession] = useState({
    isLoggedIn: false,
    currentUser: null,
    errorMessage: null,
    user: null,
  });

  useEffect(() => {
    const handleAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        selectUserByUid(user);
      }
    });

    return () => {
      handleAuth();
    };
  }, []);

  const selectUserByUid = (user) => {
    const itemsRef = firebase.database().ref("user/" + user.uid);
    itemsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (
        data == null ||
        (data.position.toLowerCase() != "hr" &&
          data.position.toLowerCase() != "admin")
      ) {
        firebase
          .auth()
          .signOut()
          .then((response) => {
            setSession({
              isLoggedIn: false,
              currentUser: null,
              errorMessage: null,
              user: null,
            });
          });
      } else {
        setSession({
          isLoggedIn: true,
          currentUser: user.user,
          user: data,
        });
      }
    });
  };

  return (
    <Router>
      <div className="App">
        <div className="outer">
          {session.isLoggedIn ? (
            <>
              <Router>
                <Narbar setSession={[session, setSession]} />
                <Switch>
                  <Route exact path="/list">
                    <List />
                  </Route>
                  <Route exact path="/adduser">
                    <AddUser setSession={[session, setSession]} />{" "}
                  </Route>
                  <Route exact path="/checking">
                    <Checking setSession={[session, setSession]} />{" "}
                  </Route>
                  <Route exact path="/leave">
                    <Leave setSession={[session, setSession]} />
                  </Route>
                  <Route exact path="/*">
                    <List />
                  </Route>
                </Switch>
              </Router>
            </>
          ) : (
            <Switch>
              <Route
                exact
                path="/*"
                component={() => <Login setSession={setSession} />}
              />
              <Route
                path="/sign-in"
                component={() => <Login setSession={setSession} />}
              />
            </Switch>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
