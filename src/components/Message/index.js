import React from "react";

import "./message.scss";

const Error = ({ status, msg }) => {
  return <div className={`msg ${status ? "success" : "danger"}`}>{msg}</div>;
};

export default Error;
