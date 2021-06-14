import React from "react";
import Narbar from "../Navber/navbar";
import styles from "./Home.module.scss";
import firebase from "../../firebase";
import "firebase/database";
import List from "../List/List";
import AddUser from "../AddUser/addUser";

import Checking from "../HistoryChecking/Checking";

import Leave from "../Leave/Leave";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Home(props) {
  return (
    <Router>
      <Narbar setSession={props} />
      {/*<div className={styles.body}>*/}
      <Switch>
        <Route exact path="/list">
          {" "}
          <List />
        </Route>
        <Route exact path="/adduser">
          <AddUser setSession={props} />{" "}
        </Route>
        <Route exact path="/checking">
          <Checking setSession={props} />{" "}
        </Route>
        <Route exact path="/leave">
          <Leave setSession={props} />
        </Route>
        <Route exact path="/*">
          {" "}
          <List />
        </Route>
      </Switch>
      {/* </div>*/}
    </Router>
  );
}

export default Home;
