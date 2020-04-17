import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import Burger from "../burger/Burger";
import "./header.css";
import QUERY from "../../query";

const Header = ({
  showSlideSideMenu,
  showSideMenu,
  style,
  burger,
  arrow,
  logo,
  toSlideFixedHeader,
}) => {
  let history = useHistory();

  const [windowWidth, setWindowWidth] = useState();

  window.onresize = function (e) {
    setWindowWidth(e.target.innerWidth);
  };

  const [cookies, removeCookie] = useCookies([]);

  const logout = () => {
    QUERY(
      {
        query: `mutation {
        logout{status message}
      }`,
      },
      cookies.origin_data
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          console.log(data, " LOGOUT");
          removeCookie("origin_data");
          removeCookie("origin_id");
        } else {
          console.log(data.errors, " ERRORS LOGOUT");
        }
      })
      .catch((err) => {
        console.log(err, "  *******ERR LOGOUT");
      });

    removeCookie("origin_data");
    removeCookie("origin_id");
  };

  return (
    <div className="headerContainer" style={style}>
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
              <Link to="/editCompany" className="registrBtn">
                К списку
              </Link>
              <Link
                onClick={() => {
                  logout();
                }}
                to="/login"
                className="loginBtn"
              >
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
    </div>
  );
};

export default Header;
