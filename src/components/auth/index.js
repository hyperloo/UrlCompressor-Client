import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import axios from "axios";
import { api } from "../../api";

import AuthContext from "../../context/auth-context";
import Message from "../Message";
import "./auth.scss";

const AuthPage = () => {
  const [state, changeState] = useState("login");
  const [loading, toggleLoading] = useState(false);
  const [name, changeName] = useState("");
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  const onSubmitHandler = async (e, login, createMessage) => {
    e.preventDefault();
    toggleLoading(true);
    const body = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const res = await axios.post(`${api}/${state}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      login(res.data.token, res.data.user, `${state} Successful`);
      toggleLoading(false);
    } catch (err) {
      if (err.response) {
        createMessage(false, err.response.data.msg);
        toggleLoading(false);
      }
    }
  };

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <div className="parent-auth">
            <div className="auth-container">
              <button
                className={
                  state === "login" ? "btn btn-lg active" : "btn btn-lg"
                }
                onClick={() => changeState("login")}
              >
                Login
              </button>
              <button
                className={
                  state === "register" ? "btn btn-lg active" : "btn btn-lg"
                }
                onClick={() => changeState("register")}
              >
                Register
              </button>
            </div>
            {context.msg && (
              <Message status={context.status} msg={context.msg} />
            )}

            <Form
              className="authForm"
              onSubmit={(e) =>
                onSubmitHandler(e, context.login, context.createMessage)
              }
            >
              {state === "register" && (
                <FormGroup>
                  <Label for="Name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    onChange={(e) => {
                      context.createMessage(false, null);
                      changeName(e.target.value);
                    }}
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Label for="Email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="abc@gmail.com"
                  onChange={(e) => {
                    context.createMessage(false, null);
                    changeEmail(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="*****"
                  onChange={(e) => {
                    context.createMessage(false, null);
                    changePassword(e.target.value);
                  }}
                />
              </FormGroup>
              <Button>
                {state === "login" ? "Login" : "Register"}{" "}
                {loading && (
                  <>
                    &nbsp;&nbsp;
                    <Spinner size="sm" color="white" />
                    &nbsp;&nbsp;
                  </>
                )}
              </Button>
            </Form>
            {/* <div className="appInfo">
              This WebApp is the{" "}
              <h3>
                <mark>
                  <b>Task Management App</b>
                </mark>
              </h3>
              An App to manage Day to Day Tasks by maintaining Records in the
              App.
              <h4>
                <b>Active Section</b>
              </h4>
              Here you can add your <mark>Active Tasks</mark> to the app with
              all the <i>details</i> including <i>Due Date</i>(deadline) and
              other details like <i>Label</i> and <i>Status</i> of the Task. On
              these Tasks, one can perform <i>CRUD</i> operations and update{" "}
              <i>labels</i>. A Task is added to <i>archive</i> if it is{" "}
              <i>Updated</i> with a <i>Status Completed</i> or if it crosses its{" "}
              <i>deadline</i> / <i>ueDate</i>. The <i>Safer</i> (that have not
              approached deadline) are with a <i>green</i> outline and that have{" "}
              <i>approached Deadline</i> are in <i>red</i> outline.
              <h4>
                <b>Archived Section</b>
              </h4>
              In <mark>Archived Section</mark>, one can see details of all the{" "}
              <i>Archived Tasks</i>, and can <i>delete</i> them but{" "}
              <i>cannot modify</i>.
              <h4>
                <b>Stats Section</b>
              </h4>
              Here one can see <mark>tats</mark> of Tasks{" "}
              <mark>Graphically</mark>.<br /> - <i>Active to Archive Ratio</i>{" "}
              using <i>Pie</i> Chart
              <br /> - <i>Label wise Active and Archived Tasks</i> Stats using{" "}
              <i>Bar</i> Graph <br />-{" "}
              <i>Status wise Active and Archived Tasks</i> Stats using{" "}
              <i>Bar</i> Graph
            </div> */}
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default AuthPage;
