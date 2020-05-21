import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";

import "./editCompany.css";

const EditCompany = () => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [scriptErr, setScriptErr] = useState({});
  const [cookies] = useCookies([]);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  !windowWidth && setWindowWidth(window.innerWidth);
  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

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

  window.onresize = function (e) {
    hideSideMenu();
  };

  useEffect(() => {
    QUERY({
      query: `query {
            places {id name  categories{name slug} streams{url preview}}
          }`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setIsLoading(false);
          setPlaces(data.data.places);
        } else {
          console.log(data.errors, "EDIT ERROR");
        }
      })
      .catch((err) => console.log(err, "EDIT ERROR"));
  }, []);

  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else if (Number(cookies.origin_id) !== 1) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
            hideSideMenu();
        }}
      >
        <Header
          isShowMenu={isShowMenu}
          logo
          burger
          arrow
          showSlideSideMenu={showSlideSideMenu}
          showSideMenu={showSideMenu}
        />
        {!isLoading && (
          <animated.div className="editCompanyContent" style={animateProps}>
            <div className="bigEditCompanyHeaderDesc">
              <Link to="/home">
                <span style={{ fontSize: "18px", paddingRight: "10px" }}>
                  &#8592;
                </span>
                На главную
              </Link>
            </div>
            <h3>СПИСОК ЗАВЕДЕНИЙ</h3>
            <table>
              <tbody>
                {places &&
                  places.length &&
                  places.map(({ id, name, categories, streams }, i) => {
                    if (streams[0]) {
                      fetch(streams[0].url).then((res) => {
                        if (!res.ok) {
                          setScriptErr((prev) => ({
                            ...prev,
                            [i]: "Err",
                          }));
                        }
                      });
                    }
                    return (
                      <tr key={id} className="editCompanyRow">
                        <td className="name">
                          <Link to={`/admin/${id}`}>{name}</Link>
                        </td>
                        <td className="typeCompany">
                          {categories[0] &&
                            categories[0].slug &&
                            categories[0].slug.toLowerCase()}
                        </td>
                        <td className="errStyle">
                          {categories[0] &&
                            categories[0].name &&
                            categories[0].name.toLowerCase()}
                          {/* {streams[0] && streams[0].preview ? (
                            <div>
                              {scriptErr[i] && scriptErr[i] ? (
                                <span style={{ color: "red" }}>
                                  {scriptErr[i] && scriptErr[i]}
                                </span>
                              ) : (
                                <span style={{ color: "green" }}>Ok</span>
                              )}
                            </div>
                          ) : (
                            "-"
                          )} */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </animated.div>
        )}
        {isLoading && <Loader />}
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default EditCompany;
