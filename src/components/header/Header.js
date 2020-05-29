import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import Burger from "../burger/Burger";
import QUERY from "../../query";

const HeaderContainer = styled.div`
  width: 100%;
  height: 65px;
  background-color: #f3f3f3;
  position: relative;
  top: 0;
  left: 0;
  z-index: 4 !important;
  @media (max-width: 760px) {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    height: 48px;
    background-color: #fff;
    display: flex;
  }
`;

const HeaderStyle = styled.div`
  margin: 0 auto;
  width: 1000px;
  height: 65px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  background-color: #f3f3f3;
  justify-content: space-between;
  @media (max-width: 760px) {
    justify-content: center;
    height: 48px;
    padding: 0 5px;
    transition: 0.3s ease all;
    background-color: #fff;
    border-bottom: 1px solid #ececec;
  }
`;

const PartyLive = styled.p`
  display: inline-block;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.05em;
  transition: 0.3s ease all;
  color: #323232;

  @media (max-width: 760px) {
    font-size: 20px;
  }
`;

const Live = styled.span`
  display: inline-block;
  background-color: #e32a6c;
  color: #fff;
  border-radius: 5px;
  margin-left: 3px;
  padding: 0 7px;
`;

const GoBackArrow = styled.div`
  @media (max-width: 760px) {
    position: absolute;
    left: 7.5px;
    top: 13px;
    display: inline-block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding-left: 7px;
    &:after {
      border-radius: 1.5px;
      content: "";
      top: 16.5px;
      display: block;
      position: absolute;
      width: 16px;
      height: 1.5px;
      background-color: #444;
      transform: rotate(45deg);
    }
    &:before {
      border-radius: 1.5px;
      content: "";
      top: 6px;
      display: block;
      position: absolute;
      width: 16px;
      height: 1.5px;
      transform: rotate(-45deg);
      background-color: #444;
    }
  }
`;

const RightHeaderMenu = styled.div`
  @media (max-width: 760px) {
    display: none;
  }
`;

const HeaderBTN = styled(Link)`
  letter-spacing: 0.5px;
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.pathname && props.pathname === "/editCompany" ? "#e32a6c" : "#000"};
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease color;
  &:hover {
    color: #e32a6c;
  }
`;

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

  const swipeFixedElementSpring = useSpring({
    left: isShowMenu ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <HeaderContainer as={animated.div} style={swipeFixedElementSpring}>
      <HeaderStyle>
        {logo && (
          <Link to="/home">
            <PartyLive>
              PARTY<Live>.LIVE</Live>
            </PartyLive>
          </Link>
        )}
        {arrow && <GoBackArrow onClick={() => history.goBack()}></GoBackArrow>}

        <RightHeaderMenu>
          {!Number(cookies.origin_id) && (
            <div>
              <HeaderBTN to="/registration">Регистрация</HeaderBTN>
              <HeaderBTN to="/login">Вход</HeaderBTN>
            </div>
          )}
          {!!Number(cookies.origin_id) && (
            <div>
              {Number(cookies.origin_id) === 1 && (
                <HeaderBTN
                  pathname={window.location.pathname}
                  to="/editCompany"
                >
                  К списку
                </HeaderBTN>
              )}
              <HeaderBTN onClick={logout} to="/login">
                Выход
              </HeaderBTN>
            </div>
          )}
        </RightHeaderMenu>
        {burger && (
          <Burger
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
        )}
      </HeaderStyle>
    </HeaderContainer>
  );
};

export default Header;
