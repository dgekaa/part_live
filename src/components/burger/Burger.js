import React from "react";
import styled from "styled-components";

const BurgerStyle = styled.span`
  display: none;
  @media (max-width: 760px) {
    display: inline-block;
    position: absolute;
    right: 20px;
    top: 14px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    z-index: 3;
  }
`;

const BurgerLine = styled.span`
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #616161;
  &:before {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #616161;
    content: "";
    top: 10px;
  }
  &:after {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #616161;
    content: "";
    top: 20px;
  }
`;

const ActiveBurger = styled.span`
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 14px;
  width: 26px;
  height: 26px;
  cursor: pointer;
`;

const ActiveBurgerLine = styled.span`
  transform: rotate(45deg);
  top: 10px;
  transition: 0.2s ease all;
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #616161;
  &:before {
    opacity: 0;
  }
  &:after {
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #616161;
    content: "";
    transform: rotate(-90deg);
    transition: 0.2s ease all;
    left: 0;
    top: 0;
  }
`;

const Burger = ({ showSlideSideMenu, showSideMenu }) =>
  showSlideSideMenu ? (
    <ActiveBurger>
      <ActiveBurgerLine></ActiveBurgerLine>
    </ActiveBurger>
  ) : (
    <BurgerStyle onClick={() => !showSlideSideMenu && showSideMenu()}>
      <BurgerLine></BurgerLine>
    </BurgerStyle>
  );

export default Burger;
