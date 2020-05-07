import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";

import Burger from "../burger/Burger";
import QUERY from "../../query";

import "./header.css";

const Header = ({
  showSlideSideMenu,
  showSideMenu,
  isShowMenu,
  burger,
  arrow,
  logo,
}) => {
  let history = useHistory();

  const [cookies, removeCookie] = useCookies([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const logout = () => {
    QUERY(
      {
        query: `mutation { logout{status message} }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          removeCookie("origin_data");
          removeCookie("origin_id");
        } else {
          console.log(data.errors, " ERRORS LOGOUT");
        }
      })
      .catch((err) => console.log(err, " ERR LOGOUT"));

    removeCookie("origin_data");
    removeCookie("origin_id");
  };

  !windowWidth && setWindowWidth(window.innerWidth);
  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const animateProps = useSpring({
    left: isShowMenu ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <animated.div className="headerContainer" style={animateProps}>
      <div className="header">
        {logo && (
          <Link to="/home">
            <p className="party_live">
              PARTY<span className="live">.LIVE</span>
            </p>
          </Link>
        )}
        {arrow && (
          <div
            className="arrowGoBack"
            onClick={() => {
              history.goBack();
            }}
          ></div>
        )}

        <div className="rightHeaderMenu">
          {!Number(cookies.origin_id) && (
            <div>
              <Link to="/registration" className="registrBtn">
                Регистрация
              </Link>
              <Link to="/login" className="loginBtn">
                Вход
              </Link>
            </div>
          )}
          {!!Number(cookies.origin_id) && (
            <div>
              {Number(cookies.origin_id) === 1 && (
                <Link
                  to="/editCompany"
                  className="registrBtn"
                  style={
                    window.location.pathname === "/editCompany"
                      ? { color: "#e32a6c" }
                      : {}
                  }
                >
                  К списку
                </Link>
              )}
              <Link onClick={logout} to="/login" className="loginBtn">
                Выход
              </Link>
            </div>
          )}
        </div>
        {burger && (
          <Burger
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
        )}
      </div>
    </animated.div>
  );
};

export default Header;
