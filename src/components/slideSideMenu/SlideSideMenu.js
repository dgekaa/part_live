import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";

import QUERY from "../../query";

import "./slideSideMenu.css";

const SlideSideMenu = ({ isShowMenu }) => {
  const [shomMenu, setShowMenu] = useState(false);
  const [cookies, removeCookie] = useCookies([]);

  const pathname = window.location.pathname;

  useEffect(() => {
    if (!isShowMenu) {
      setTimeout(() => {
        setShowMenu(false);
      }, 500);
    } else {
      setShowMenu(true);
    }
  }, [isShowMenu]);

  const logout = () => {
    QUERY(
      {
        query: `mutation {logout{status message}}`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          console.log(data, " LOGOUT");
          removeCookie("origin_data");
          removeCookie("origin_id");
        } else {
          console.log(data.errors, " ERRORS LOGOUT");
        }
      })
      .catch((err) => console.log(err, "  *******ERR LOGOUT"));

    removeCookie("origin_data");
    removeCookie("origin_id");
  };

  const animateProps = useSpring({
    right: isShowMenu ? 0 : -200,
    config: { duration: 100 },
  });

  return (
    <div
      className="SlideSideMenuWrap"
      style={shomMenu ? { display: "block" } : { display: "none" }}
    >
      <animated.div className="SlideSideMenu" style={animateProps}>
        <ul className="sideMenuUl">
          <li className="sideMenuLi">
            <Link
              to="/home"
              style={pathname === "/home" ? { color: "#e32a6c" } : {}}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/map"
              style={pathname === "/map" ? { color: "#e32a6c" } : {}}
            >
              Карта
            </Link>
          </li>
          <li>
            {Number(cookies.origin_id) === 1 && (
              <Link
                to="/editCompany"
                style={pathname === "/editCompany" ? { color: "#e32a6c" } : {}}
              >
                К списку
              </Link>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && (
              <Link
                to="/login"
                style={pathname === "/login" ? { color: "#e32a6c" } : {}}
              >
                Вход
              </Link>
            )}
            {!!Number(cookies.origin_id) && (
              <Link onClick={logout} to="/login">
                Выход
              </Link>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && (
              <Link
                to="/registration"
                style={pathname === "/registration" ? { color: "#e32a6c" } : {}}
              >
                Регистрация
              </Link>
            )}
          </li>
        </ul>
      </animated.div>
    </div>
  );
};

export default SlideSideMenu;
