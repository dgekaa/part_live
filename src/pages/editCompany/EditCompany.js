import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Redirect, Link } from "react-router-dom";

import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
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

  const getStyle = () => {
    if (windowWidth && windowWidth <= 760) {
      if (isShowMenu) {
        return {
          animation: "toLeft 0.3s ease",
          position: "relative",
          right: "200px",
        };
      } else {
        return {
          animation: "toRight 0.3s ease",
          position: "relative",
        };
      }
    } else {
      return {};
    }
  };

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else if (Number(cookies.origin_id) !== 1) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
            hideSideMenu();
          }
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
          <div className="editCompanyContent" style={{ ...getStyle() }}>
            <h3>СПИСОК ЗАВЕДЕНИЙ</h3>
            <table>
              <tbody>
                {places &&
                  places.length &&
                  places.map(({ id, name, categories, streams }, i) => {
                    return (
                      <tr key={id}>
                        <td className="name">
                          <Link to={`/admin/${id}`}>{name}</Link>
                        </td>
                        <td className="enName">{id}</td>
                        <td className="typeCompany">
                          {categories[0] &&
                            categories[0].name &&
                            categories[0].name.toLowerCase()}
                        </td>
                        <td className="enName">
                          {streams[0] && streams[0].preview ? (
                            <div>
                              {(scriptErr[i] && scriptErr[i]) || "Ok"}
                              <video
                                type="application/x-mpegURL"
                                onError={() => {
                                  setScriptErr((prev) => ({
                                    ...prev,
                                    [i]: "Err",
                                  }));
                                }}
                                style={{ display: "none" }}
                                className="companyImg"
                                src={streams[0] && streams[0].preview}
                                autoPlay
                              />
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
        {isLoading && <Loader />}
        <SlideSideMenu isShowMenu={isShowMenu} />
      </div>
    );
  }
};

export default EditCompany;
