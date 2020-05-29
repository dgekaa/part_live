import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import CustomImg from "../customImg/CustomImg";

const BottomMenuStyle = styled.div`
  display: none;
  @media (max-width: 760px) {
    display: flex;
    height: 55px;
    background: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 0;
    left: 0;
    align-items: center;
    justify-content: center;
  }
`;

const MenuText = styled.span`
  margin-left: 10px;
`;

const Button = styled(Link)`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  &:hover {
    transition: 0.3s ease all;
    color: #e32a6c;
  }
`;

const BottomMenu = ({ isShowMenu }) => {
  const swipeFixedElementSpring = useSpring({
    left: isShowMenu ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <BottomMenuStyle
      as={animated.div}
      style={swipeFixedElementSpring}
      className="BottomMenu"
    >
      <Button
        to="/home"
        style={window.location.pathname === "/home" ? { color: "#e32a6c" } : {}}
      >
        <CustomImg alt="list" name={"menu2"} width={26} height={26} />
        <MenuText>СПИСОК</MenuText>
      </Button>
      <Button
        to="/map"
        style={window.location.pathname === "/map" ? { color: "#e32a6c" } : {}}
      >
        <CustomImg alt="locat" name={"location1"} width={26} height={26} />
        <MenuText> КАРТА</MenuText>
      </Button>
    </BottomMenuStyle>
  );
};

export default BottomMenu;
