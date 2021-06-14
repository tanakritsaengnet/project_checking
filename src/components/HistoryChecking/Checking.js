import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import styles from "./Checking.module.scss";
import "../../App.css";
import firebase from "../../firebase";
import "firebase/database";

import moment from "moment";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      name: "",
    };
  }

  componentWillMount() {
    const { items } = this.state;
    const locationRef = firebase.database().ref("location");
    let newState = [];
    locationRef.once("value").then((snapshot) => {
      let items = snapshot.val();
      for (let item in items) {
        moment().locale("TH");
        const date = moment(items[item].date.toString(), "DD/MM/YYYY");
        date.add(543, "years");
        newState.push({
          fullname: "",
          date: date.format("DD/MM/YYYY"),
          lat: items[item].latitude,
          locationId: items[item].location_id,
          long: items[item].longitude,
          photo: items[item].photo,
          status: items[item].status,
          time: items[item].time,
          user_id: items[item].user_id,
          position: items[item].latitude + "," + items[item].longitude,
        });
        console.log("newState", newState);
      }

      newState.map((item, index) => {
        const dbRef = firebase.database().ref("user");
        let data = dbRef
          .child(item.user_id)
          .once("value")
          .then((snapshot) => {
            let items = snapshot.val();
            if (items != null) {
              item.fullname = items.name + " " + items.surname;
              this.setState({
                items: newState,
              });
            }
          });
      });
    });
  }

  openInNewTab = (url) => {
    console.log(url);
    const newWindow = window.open(
      "https://www.google.com/maps/search/?api=1&query=" + url,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  render() {
    return (
      <>
        <div className={styles.body}>
          <h1>ประวัติการเข้าทำงาน</h1>
          <MaterialTable
            options={{
              headerStyle: { backgroundColor: "grey" },
              showTitle: false,
              emptyRowsWhenPaging: true,
              pageSizeOptions: [5, 10],
              rowStyle: {
                fontFamily: ["Prompt", "sans-serif"],
              },
              headerStyle: {
                fontFamily: ["Prompt", "sans-serif"],
              },
              exportButton: true,
              headerStyle: {
                backgroundColor: "#555555",
                color: "#FFF",
              }
            }}
            columns={[
              { title: "ชื่อ - สกุล", field: "fullname" },
              {
                title: "สถานะ",
                field: "status",
                cellStyle: (data, rowData) => {
                  if (rowData.status === "check-in") {
                    return { color: "green", fontWeight: "bold" };
                  } else {
                    return { color: "red", fontWeight: "bold" };
                  }
                  return {};
                },
              },
              { title: "วันที่", field: "date", type: "date" },
              { title: "เวลา", field: "time", type: "time" },
              {
                title: "ละติจูด,ลองจูด",
                field: "position",
              },
            ]}
            data={this.state.items.map((item) => {
              return item;
            })}
            actions={[
              {
                icon: "search",
                tooltip: "search google map",
                onClick: (event, rowData) =>
                  this.openInNewTab(rowData.position),
              },
            ]}
          />
        </div>
      </>
    );
  }
}

export default App;
