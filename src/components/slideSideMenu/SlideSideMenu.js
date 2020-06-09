import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import QUERY from "../../query";
import { defaultColor } from "../../constants";

const SideMenuWrap = styled(Link)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100%;
  z-index: 2;
  display: ${({ shomMenu }) => (shomMenu ? "block" : "none")};
`;

const SideMenu = styled(Link)`
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  padding: 10px;
  background-color: #eef1f6;
  overflow: hidden;
  padding-top: 50px;
  z-index: 3;
`;

const SideMenuList = styled.ul`
  line-height: 30px;
  padding-left: 20px;
  list-style-type: none;
`;

const ListLink = styled(Link)`
  display: block;
  width: 100%;
  transition: 0.3s ease all;
  &:hover {
    color: rgb(227, 42, 108);
  }
`;

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
          console.log(data.errors, "ERRORS LOGOUT");
        }
      })
      .catch((err) => console.log(err, "err LOGOUT"));
    removeCookie("origin_data");
    removeCookie("origin_id");
  };

  const SwipeMenuSpring = useSpring({
    right: isShowMenu ? 0 : -200,
    config: { duration: 200 },
  });

  const clicked = {
    color: defaultColor,
  };

  return (
    <SideMenuWrap shomMenu={shomMenu}>
      <SideMenu as={animated.div} style={SwipeMenuSpring}>
        <SideMenuList>
          <li>
            <ListLink to="/home" style={pathname === "/home" ? clicked : {}}>
              Главная
            </ListLink>
          </li>
          <li>
            <ListLink to="/map" style={pathname === "/map" ? clicked : {}}>
              Карта
            </ListLink>
          </li>
          <li>
            {Number(cookies.origin_id) === 1 && (
              <ListLink
                to="/editCompany"
                style={pathname === "/editCompany" ? clicked : {}}
              >
                К списку
              </ListLink>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && (
              <ListLink
                to="/login"
                style={pathname === "/login" ? clicked : {}}
              >
                Вход
              </ListLink>
            )}
            {!!Number(cookies.origin_id) && (
              <ListLink onClick={logout} to="/login">
                Выход
              </ListLink>
            )}
          </li>
          <li>
            {!Number(cookies.origin_id) && (
              <ListLink
                to="/registration"
                style={pathname === "/registration" ? clicked : {}}
              >
                Регистрация
              </ListLink>
            )}
          </li>
        </SideMenuList>
      </SideMenu>
    </SideMenuWrap>
  );
};

export default SlideSideMenu;
