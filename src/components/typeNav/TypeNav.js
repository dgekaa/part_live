import React from "react";
import { Link } from "react-router-dom";

import "./typeNav.css";

const TypeNav = ({ style }) => {
  return (
    <div className="TypeNav" style={{ ...style }}>
      <Link
        style={{ color: "#000" }}
        className="typeNavText typeNavBlock"
        to={{
          pathname: "/map"
        }}
      >
        <p>КАРТА</p>
      </Link>
      <Link
        style={{ color: "#000" }}
        className="typeNavText typeNavBlock"
        to={{ pathname: "/home" }}
      >
        <p>СПИСОК </p>
      </Link>
    </div>
  );
};

export default TypeNav;
