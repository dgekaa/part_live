import React from "react";

import "./burger.css";

const Burger = ({ showSlideSideMenu, showSideMenu }) => {
  return (
    <span
      className={showSlideSideMenu ? "activeburger" : "burger"}
      onClick={() => {
        if (!showSlideSideMenu) {
          showSideMenu();
        }
      }}
    >
      <span></span>
    </span>
  );
};

export default Burger;
