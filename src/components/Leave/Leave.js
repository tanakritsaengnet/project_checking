import React, { Component, useEffect } from "react";

import MaterialTable from "material-table";
import styles from "./Leave.module.scss";
import firebase from "../../firebase";
import "firebase/database";

import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: [],
    };
  }

  dbfirebase() {
    const leaveRef = firebase.database().ref("leave");
    leaveRef.once("value").then((snapshot) => {
      let array = [];
      snapshot.forEach((el) => {
        const list = el.val();
        console.log(list);
        for (const index in list) {
          console.log(list[index]);

          moment().locale("TH");
          const date = moment(list[index].date.toString(), "DD/MM/YYYY");
          date.add(543, "years");

          array.push({
            fullname: "",
            date: date.format("DD/MM/YYYY"),
            comment: list[index].comment,
            leave: list[index].leave,
            time: list[index].time,
            user_id: list[index].user_id,
          });
        }
      });

      array.map((users, index) => {
        const dbRef = firebase.database().ref("user");
        let data = dbRef
          .child(users.user_id)
          .once("value")
          .then((snapshot) => {
            let user = snapshot.val();
            users.fullname = user.name + " " + user.surname;
            this.setState({
              datas: array,
            });
          });
      });
      console.log(this.state.datas);
    });
  }

  componentWillMount = () => {
    this.dbfirebase();
  };

  render() {
    return (
      <div className={styles.body}>
        <h1>ประวัติการลาของพนักงาน</h1>
        <MaterialTable
          options={{
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
            },
          }}
          columns={[
            { title: "ชื่อ-นามสกุล", field: "fullname" },
            { title: "วันที่ลา", field: "date", type: "date" },
            { title: "ประเภท  ", field: "leave" },
            { title: "หมายเหตุ", field: "comment" },
          ]}
          data={this.state.datas}
        />
      </div>
    );
  }
}

export default App;
