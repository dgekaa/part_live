import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { defaultColor } from "../../constants";

const TypeNavStyle = styled.div`
  height: 70px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  @media (max-width: 760px) {
    display: none;
  }
`;

const Block = styled(Link)`
  background-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 54px;
  border: 1px solid #eee;
  border-right: none;
  cursor: pointer;
  transition: 0.5s ease all;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  color: #000;
  &:last-of-type {
    border-right: 1px solid #eee;
    border-radius: 0 5px 5px 0;
  }
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  &:hover {
    color: #fff;
    background: ${defaultColor};
  }
`;

const clickedStyle = {
  color: "#fff",
  background: defaultColor,
};

const TypeNav = ({ style }) => {
  const pathname = window.location.pathname;
  return (
    <TypeNavStyle style={{ ...style }}>
      <Block
        to={{ pathname: "/" }}
        style={pathname === "/" ? clickedStyle : {}}
      >
        <p>СПИСОК </p>
      </Block>
      <Block
        to={{
          pathname: "/map",
        }}
        style={pathname === "/map" ? clickedStyle : {}}
      >
        <p>КАРТА</p>
      </Block>
    </TypeNavStyle>
  );
};

export default TypeNav;
