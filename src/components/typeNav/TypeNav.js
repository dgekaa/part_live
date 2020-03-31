import React from "react";
import { Link } from "react-router-dom";

import "./typeNav.css";

const TypeNav = ({ style }) => {
  // console.log(props, "PROPS NAV___");
  const pathname = window.location.pathname;
  return (
    <div className="TypeNav" style={{ ...style }}>
      <Link
        className="typeNavText typeNavBlock"
        to={{
          pathname: "/map"
        }}
        style={
          pathname === "/map" ? { color: "#fff", background: "#e32a6c" } : {}
        }
      >
        <p>КАРТА</p>
      </Link>
      <Link
        className="typeNavText typeNavBlock"
        to={{ pathname: "/home" }}
        style={
          pathname === "/home" ? { color: "#fff", background: "#e32a6c" } : {}
        }
      >
        <p>СПИСОК </p>
      </Link>
    </div>
  );
};

export default TypeNav;
