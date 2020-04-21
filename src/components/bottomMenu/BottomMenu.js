import React from "react";
import { Link } from "react-router-dom";

import "./bottomMenu.css";

const BottomMenu = ({ style }) => {
  const pathname = window.location.pathname;

  return (
    <div className="BottomMenu" style={style}>
      <Link
        to="/home"
        style={
          pathname === "/home" ? { color: "#fff", background: "#e32a6c" } : {}
        }
      >
        СПИСОК
      </Link>
      <Link
        to="/map"
        style={
          pathname === "/map" ? { color: "#fff", background: "#e32a6c" } : {}
        }
      >
        КАРТА
      </Link>
    </div>
  );
};

export default BottomMenu;
