import React from "react";
import styled, { keyframes } from "styled-components";

import { defaultColor } from "../../constants";

const LoaderWrap = styled.div`
  display: flex;
  top: 100px;
  left: 0;
  position: fixed;
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const Roller = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const anim = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Roll = styled.div`
  animation: ${anim} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
  &:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${defaultColor};
    margin: -4px 0 0 -4px;
  }
  &:nth-child(1) {
    animation-delay: -0.036s;
  }
  &:nth-child(1):after {
    top: 63px;
    left: 63px;
  }

  &:nth-child(2) {
    animation-delay: -0.072s;
  }
  &:nth-child(2):after {
    top: 68px;
    left: 56px;
  }

  &:nth-child(3) {
    animation-delay: -0.108s;
  }
  &:nth-child(3):after {
    top: 71px;
    left: 48px;
  }

  &:nth-child(4) {
    animation-delay: -0.144s;
  }
  &:nth-child(4):after {
    top: 72px;
    left: 40px;
  }

  &:nth-child(5) {
    animation-delay: -0.18s;
  }
  &:nth-child(5):after {
    top: 71px;
    left: 32px;
  }

  &:nth-child(6) {
    animation-delay: -0.216s;
  }
  &:nth-child(6):after {
    top: 68px;
    left: 24px;
  }

  &:nth-child(7) {
    animation-delay: -0.252s;
  }
  &:nth-child(7):after {
    top: 63px;
    left: 17px;
  }

  &:nth-child(8) {
    animation-delay: -0.288s;
  }
  &:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
`;

const Loader = () => (
  <LoaderWrap>
    <Roller>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
      <Roll></Roll>
    </Roller>
  </LoaderWrap>
);

export default Loader;
