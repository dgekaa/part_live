import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

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
    color: "#fff",
    background: "#e32a6c",
  };
  // useEffect(() => {
  //   alert(window.location.pathname, "pathname");
  // }, []);
  return (
    <animated.div style={animateProps} className="BottomMenu">
      <Link
        to="/home"
        style={window.location.pathname === "/home" ? clickedBtnStyle : {}}
      >
        СПИСОК
      </Link>
      <Link
        to="/map"
        style={window.location.pathname === "/map" ? clickedBtnStyle : {}}
      >
        КАРТА
      </Link>
    </animated.div>
  );
};

export default BottomMenu;
