import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Burger from "../burger/Burger";
import "./header.css";

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
  return (
    <div
      className="headerContainer"
      style={
        (style,
        toSlideFixedHeader
          ? {
              animation: "toLeftFixed 0.3s ease",
              left: "-200px"
            }
          : {
              animation: "toRightFixed 0.3s ease",
              left: "0px"
            })
      }
    >
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
