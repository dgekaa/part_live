import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
  border: 2px solid #c4c4c4;
  border-right: none;
  cursor: pointer;
  transition: 0.5s ease all;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  color: #000;
  &:last-of-type {
    border-right: 2px solid #c4c4c4;
    border-radius: 0 5px 5px 0;
  }
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  &:hover {
    color: #fff;
    background: #e32a6c;
  }
`;

const clickedStyle = {
  color: "#fff",
  background: "#e32a6c",
};

const TypeNav = ({ style }) => {
  const pathname = window.location.pathname;
  return (
    <TypeNavStyle style={{ ...style }}>
      <Block
        to={{ pathname: "/home" }}
        style={pathname === "/home" ? clickedStyle : {}}
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
