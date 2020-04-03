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
        {/* <img
          alt="Home"
          src={`${process.env.PUBLIC_URL}/img/menu2.png`}
          className="homeImg"
        /> */}
        СПИСОК
      </Link>
      <Link
        to="/map"
        style={
          pathname === "/map" ? { color: "#fff", background: "#e32a6c" } : {}
        }
      >
        {/* <img
          alt="Loc"
          src={`${process.env.PUBLIC_URL}/img/location1.png`}
          className="locationImg"
        /> */}
        КАРТА
      </Link>
    </div>
  );
};

export default BottomMenu;
