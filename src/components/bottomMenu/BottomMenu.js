import React from "react";
import { Link } from "react-router-dom";

import "./bottomMenu.css";

const BottomMenu = ({ style }) => {
  return (
    <div className="BottomMenu" style={style}>
      <Link to="/home">
        <img
          alt="Home"
          src={`${process.env.PUBLIC_URL}/img/menu2.png`}
          className="homeImg"
        />
      </Link>
      <Link to="/map">
        <img
          alt="Loc"
          src={`${process.env.PUBLIC_URL}/img/location1.png`}
          className="locationImg"
        />
      </Link>
    </div>
  );
};

export default BottomMenu;
