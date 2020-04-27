import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./bottomMenu.css";

const BottomMenu = ({ isShowMenu }) => {
  const pathname = window.location.pathname;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const getStyle = () => {
    if (windowWidth && windowWidth <= 760) {
      if (isShowMenu) {
        return {
          animation: "toLeftFixed 0.3s ease",
          left: "-200px",
        };
      } else {
        return {
          animation: "toRightFixed 0.3s ease",
          left: "0px",
        };
      }
    } else {
      return {};
    }
  };

  const clickedBtnStyle = {
    color: "#fff",
    background: "#e32a6c",
  };

  return (
    <div style={{ ...getStyle() }} className="BottomMenu">
      <Link to="/home" style={pathname === "/home" ? clickedBtnStyle : {}}>
        СПИСОК
      </Link>
      <Link to="/map" style={pathname === "/map" ? clickedBtnStyle : {}}>
        КАРТА
      </Link>
    </div>
  );
};

export default BottomMenu;
