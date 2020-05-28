import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import { api } from "./api";

import AuthContext from "./context/auth-context";

import Navigation from "./components/navBar";
import authPage from "./components/auth";
import urlPage from "./components/url";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

class App extends React.Component {
  state = {
    isLoading: false,
    token: localStorage.getItem("token"),
    user: null,
    msg: null,
    status: false,
  };

  loadUser = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await axios.get(`${api}/login/user`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": `${this.state.token}`,
        },
      });
      this.setState({ isLoading: false, user: res.data });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        localStorage.removeItem("token");
        this.setState({ isLoading: false, token: null });
      }
    }
  };

  componentDidMount() {
    this.loadUser();
  }

  login = (token, user, msg) => {
    localStorage.setItem("token", token);
    this.setState({
      token: token,
      user: user,
      status: true,
      msg: msg,
    });
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({
      token: null,
      user: null,
      status: true,
      msg: "Logout Successful",
    });
  };

  errorLogout = (msg) => {
    localStorage.removeItem("token");
    this.setState({
      token: null,
      user: null,
      status: false,
      msg: msg,
    });
  };

  createMessage = (status, msg) => {
    this.setState({
      status: status,
      msg: msg,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            user: this.state.user,
            login: this.login,
            logout: this.logout,
            errorLogout: this.errorLogout,
            status: this.state.status,
            msg: this.state.msg,
            createMessage: this.createMessage,
          }}
        >
          <Navigation loading={this.state.loading} />
          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/urls" exact />}

              {this.state.token && <Redirect from="/auth" to="/urls" exact />}
              {!this.state.token && <Redirect from="/urls" to="/auth" exact />}

              {!this.state.token && (
                <Route path="/auth" exact component={authPage} />
              )}
              {this.state.token && (
                <Route path="/urls" exact component={urlPage} />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
