import React, { useState, useEffect, Component } from "react";
import firebase from '../../firebase';
import "firebase/database";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import styles from "./addUser.module.scss";
import { useHistory } from "react-router-dom";
import 'firebase/storage'
import ImageUploader from 'react-images-upload';
import { BsArrowReturnLeft } from "react-icons/bs";

class app extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pictures: [],
            progress: 0,
            downloadURL: null
        }
        this.onDrop = this.onDrop.bind(this);
    }


    handleSubmit = async e => {
        e.preventDefault();
        const { Email, Password, Gender, Name, Surname, Position, Tel } = this.state
        try {
            //console.log(this.props.setSession[0].user)
            const currentUser = this.props.setSession[0].user;
            const response = await firebase.auth().createUserWithEmailAndPassword(Email, Password).catch(function (error) {
                //console.log(error.code);
                //console.log(error.message);
                alert(error.message);
                throw error
            });

            if (response != null) {
                //console.log(currentUser);
                //console.log(response);
                const user = response.user;
                try {
                    //console.log(this.state.pictures[0].name)
                    var uploadTask = firebase.storage().ref('images').child(this.state.pictures[0].name).put(this.state.pictures[0]);
                    // console.log(uploadTask)
                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                        (snapshot) => {
                            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                            this.setState({ progress })
                        }, (error) => {
                            throw error
                        }, () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                                firebase.database().ref("user").child(user.uid).set({
                                    email: Email,
                                    gender: Gender,
                                    name: Name,
                                    photo: url,
                                    password: Password,
                                    position: Position,
                                    surname: Surname,
                                    tel: Tel,
                                    user_id: user.uid
                                });
                                firebase.auth().signOut().then(() => {
                                    firebase.auth().signInWithEmailAndPassword(currentUser.email, currentUser.password.toString());
                                    alert("เพิ่มพนักงานสำเร็จ");
                                }).catch((error) => {
                                    console.log(error);
                                    alert("adduser: " + error);
                                    throw error

                                });
                                this.setState({
                                    downloadURL: url
                                })

                            })
                        }
                    )

                } catch (error) {
                    throw error
                }
            }

        } catch (error) {
            //console.log(error);
            alert("error :" + error);
        }
    };

    onChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    render() {
        return (
            <>
                <div className={styles.body}>
                    <form onSubmit={this.handleSubmit}>
                        <h1>เพิ่มพนักงาน</h1>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Password</label>
                                <input
                                    type="assword"
                                    name="Password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label>Gender</label>
                                <input
                                    type="text"
                                    name="Gender"
                                    className="form-control"
                                    placeholder="Enter Gender"
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group col-md-5">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="Name"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className="form-group col-md-5">
                                <label>Surname</label>
                                <input
                                    type="text"
                                    name="Surname"
                                    className="form-control"
                                    placeholder="Enter Surname"
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label>Position</label>
                                <input
                                    type="text"
                                    name="Position"
                                    className="form-control"
                                    placeholder="Enter Position"
                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Tel.</label>
                                <input
                                    type="text"
                                    name="Tel"
                                    className="form-control"
                                    placeholder="Enter Tel"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                            </div>
                            <div className="form-group col-md-4">
                                <label>Upload Profile</label>
                                <ImageUploader
                                    withPreview={true}
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    singleImage={true}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-dark btn-lg btn-block" refresh="true">
                            Save
                        </button>

                    </form>
                </div>
            </>
        )
    };
};

export default app;