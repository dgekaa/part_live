import React from "react";
import styled, { keyframes } from "styled-components";

const PopupInner = styled.div`
  background-color: #fff;
`;

const Show = keyframes`{
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 
}`;

const Show760 = keyframes`{
    0% {
      top: 500px;
      opacity: 0;
    }
    100% {
      top: 0;
      opacity: 1;
    }
}`;

const PopupStyle = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
  transition: 1s ease all;
  animation: ${Show} 0.3s ease;
  @media (max-width: 760px) {
    animation: ${Show760} 0.3s ease;
  }
`;

const Popup = ({ children, togglePopup, style, wrpaStyle }) => {
  return (
    <PopupStyle
      className="popup"
      onClick={(e) => {
        if (e.target.className.includes("popup")) {
          togglePopup();
        }
      }}
      style={wrpaStyle}
    >
      <PopupInner style={style}>{children}</PopupInner>
    </PopupStyle>
  );
};
export default Popup;
