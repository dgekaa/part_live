import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import CustomImg from "../customImg/CustomImg";

import "./bottomMenu.css";

const BottomMenu = ({ isShowMenu }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const animateProps = useSpring({
    left: isShowMenu ? -200 : 0,
    config: {
      duration: 200,
    },
  });

  const clickedBtnStyle = {
    color: "#e32a6c",
    // background: "#e32a6c",
  };

  return (
    <animated.div style={animateProps} className="BottomMenu">
      <Link
        to="/home"
        style={window.location.pathname === "/home" ? clickedBtnStyle : {}}
      >
        <CustomImg alt="!" name={"menu2"} width={26} height={26} />
        <span className="bottomMenuText">СПИСОК</span>
      </Link>
      <Link
        to="/map"
        style={window.location.pathname === "/map" ? clickedBtnStyle : {}}
      >
        <CustomImg alt="!" name={"location1"} width={26} height={26} />
        <span className="bottomMenuText"> КАРТА</span>
      </Link>
    </animated.div>
  );
};

export default BottomMenu;
