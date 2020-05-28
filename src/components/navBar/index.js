import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Spinner, Button } from "reactstrap";

import "./navBar.scss";
import AuthContext from "../../context/auth-context";

const NavBar = ({ loading }) => {
  const [load, toggleLoad] = useState(false);
  const logoutHandler = async (logout) => {
    toggleLoad(true);
    await logout();
    toggleLoad(false);
  };

  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <h2>
              <NavLink to="/tasks">URL Shortener</NavLink>
            </h2>
            {loading ? (
              <Spinner className="bigSpinner" color="primary" />
            ) : (
              context.user && (
                <>
                  <Button
                    color="danger"
                    className="toolBtn"
                    onClick={() => logoutHandler(context.logout)}
                  >
                    {load ? <Spinner size="sm" /> : <>Logout</>}
                  </Button>
                </>
              )
            )}
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default NavBar;
