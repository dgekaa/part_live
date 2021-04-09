import React from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import { defaultColor } from "../../constants";

const MenuText = styled.span`
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`;

const Button = styled(Link)`
  position: fixed;
  bottom: 24px;
  margin-left: calc(50% - 65px);
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  width: 130px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${defaultColor};
  z-index: 1;
  &:hover {
    transition: 0.3s ease all;
  }
`;

const BottomMenu = ({ isShowMenu, border }) => {
  const swipeFixedElementSpring = useSpring({
    left: isShowMenu ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  const current = window.location.pathname;

  return (
    <Button
      style={swipeFixedElementSpring}
      as={animated(Link)}
      to={current === "/" ? "/map" : "/"}
    >
      <MenuText>{current === "/" ? "НА КАРТУ" : "НА ГЛАВНУЮ"}</MenuText>
    </Button>
  );
};

export default BottomMenu;
