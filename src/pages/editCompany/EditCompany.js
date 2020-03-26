import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Loader from "../../components/loader/Loader";

import QUERY from "../../query";

import "./editCompany.css";
import { Redirect, Link } from "react-router-dom";

const EditCompany = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);

  const hideSideMenu = () => {
    setShowSlideSideMenu(false);
    document.body.style.overflow = "visible";
    setIsShowMenu(false);
  };

  const showSideMenu = () => {
    setShowSlideSideMenu(true);
    document.body.style.overflow = "hidden";
    setIsShowMenu(true);
  };

  window.onresize = function(e) {
    hideSideMenu();
  };

  const [cookies, setCookie, removeCookie] = useCookies([]);

  const [isLoading, setIsLoading] = useState(true);

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    QUERY({
      query: `query {
            places {id name}
          }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.errors) {
          setIsLoading(false);
          setPlaces(data.data.places);
          console.log(data.data.places, " edit compani  DATA");
        } else {
          console.log(data.errors, " ERRORS");
        }
      })
      .catch(err => {
        console.log(err, "  *****************ERR");
      });
  }, []);

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else if (Number(cookies.origin_id) !== 1) {
    // Вход под обычным юзером
    // нужно переходить на /admin/id заведения
    return <Redirect to="/home" />;
  } else {
    return (
      <div
        onClick={e => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
            hideSideMenu();
          }
        }}
      >
        <div
          className="EditCompany"
          style={
            isShowMenu
              ? {
                  animation: "toLeft 0.3s ease",
                  position: "relative",
                  right: "200px"
                }
              : {
                  animation: "toRight 0.3s ease",
                  position: "relative"
                }
          }
          onClick={e => {
            if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
              hideSideMenu();
            }
          }}
        >
          <Header
            logo
            burger
            arrow
            toSlideFixedHeader={isShowMenu}
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
          {!isLoading && (
            <div className="editCompanyContent">
              <h3>СПИСОК СТРИМОВ</h3>
              <ul>
                {places.map(({ id, name }) => (
                  <li key={id}>
                    <Link to={`/admin/${id}`}>{name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isLoading && <Loader />}
        </div>

        <BottomMenu
          style={{ borderTop: "1px solid #ECECEC" }}
          toSlideFixedBottomMenu={isShowMenu}
        />
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default EditCompany;
