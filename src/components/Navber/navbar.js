import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "./Navbar.css";
import firebase from "../../firebase";
import { IconContext } from "react-icons";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

export default function Navbar(props) {
  const [sidebar, setSidebar] = useState(false);

  const [users, setUsers] = useState([]);

  const showSidebar = () => setSidebar(!sidebar);

  const logout = (e) => {
    e.preventDefault();

    firebase.auth().signOut().then((response) => {
      props.setSession[1]({
        isLoggedIn: false,
        currentUser: null,
        errorMessage: null,

      });
    });
  }

  useEffect(() => {
    console.log(props)
    console.log(props.setSession[0].user)
    const user = props.setSession[0].user;
    setUsers(user);
    // console.log("narbar", user.name + " " + user.surname);
  }, []);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <div className="menu-bars" onClick={showSidebar}>
            {sidebar ? (
              <FaIcons.FaTimes className="menu-icon " />
            ) : (
              <FaIcons.FaBars className="menu-icon " />
            )}
            <label>CHECKING</label>
          </div>
          <div className="navbar-nav ml-auto nav-user">
            ยินดีต้อนรับ {users.name} {users.surname}
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            {SidebarData.map((item, index) => {
              return (
                //<div>
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
                //</div>
              );
            })}
            <div className="logout">
              <hr className="nav-hr" />
              <li className="nav-logout" onClick={logout}>
                <Link to={"/"}>
                  <FaIcons.FaReplyAll />
                  <span> Logout</span>
                </Link>
              </li>
            </div>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
