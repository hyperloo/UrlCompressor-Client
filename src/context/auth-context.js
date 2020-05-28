import React from "react";

export default React.createContext({
  token: null,
  user: null,
  login: (token, user, msg) => {},
  logout: () => {},
  errorLogout: (msg) => {},
  createMessage: (status, msg) => {},
  status: false,
  msg: null,
});
