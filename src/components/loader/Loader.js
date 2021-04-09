import React from "react";
import styled from "styled-components";
import "./loader.css";

const LoaderWrap = styled.div`
  display: flex;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.3);
`;

const LoaderBottomWrap = styled.div`
  display: flex;
  bottom: -10px;
  left: 0;
  position: relative;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const Loader = ({ isBottom }) => {
  if (isBottom) {
    return (
      <LoaderBottomWrap>
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoaderBottomWrap>
    );
  } else {
    return (
      <LoaderWrap>
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoaderWrap>
    );
  }
};

export default Loader;
