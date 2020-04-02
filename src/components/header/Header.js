import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Burger from "../burger/Burger";
import "./header.css";
import { styles } from "../googleMap/GoogleMapStyles";

const Header = ({
  showSlideSideMenu,
  showSideMenu,
  style,
  burger,
  arrow,
  logo,
  toSlideFixedHeader
}) => {
  let history = useHistory();

  const [windowWidth, setWindowWidth] = useState();

  window.onresize = function(e) {
    setWindowWidth(e.target.innerWidth);
  };

  return (
    <div className="headerContainer" style={style}>
      <div className="header">
        {arrow && (
          <div
            className="arrowGoBack"
            onClick={() => {
              history.goBack();
            }}
          ></div>
        )}
        {logo && (
          <Link to="/home">
            <p className="party_live">
              PARTY<span className="live">.LIVE</span>
            </p>
          </Link>
        )}

        {burger && (
          <Burger
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
