import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import QUERY from "../../query";

import "./slideSideMenu.css";

const SlideSideMenu = ({ isShowMenu }) => {
  const [shomMenu, setShowMenu] = useState(false);
  const [cookies, removeCookie] = useCookies([]);

  useEffect(() => {
    if (!isShowMenu) {
      setTimeout(() => {
        setShowMenu(false);
      }, 300);
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

  return (
    <div
      className="SlideSideMenuWrap"
      style={shomMenu ? { display: "block" } : { display: "none" }}
    >
      <div
        className="SlideSideMenu"
        style={
          isShowMenu
            ? { animation: "on 0.25s ease", right: 0 }
            : { animation: "off 0.25s ease", right: "-200px" }
        }
      >
        <ul className="sideMenuUl">
          <li className="sideMenuLi">
            <Link to="/home">Главная</Link>
          </li>
          <li>
            <Link to="/map">Карта</Link>
          </li>
          <li>
            {console.log(
              Number(cookies.origin_id),
              "Number(cookies.origin_id)"
            )}
            {Number(cookies.origin_id) === 1 && (
              <Link to="/editCompany">К списку</Link>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && <Link to="/login">Вход</Link>}
            {!!Number(cookies.origin_id) && (
              <Link onClick={logout} to="/login">
                Выход
              </Link>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && (
              <Link to="/registration">Регистрация</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SlideSideMenu;
