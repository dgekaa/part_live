import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import CustomImg from "../../components/customImg/CustomImg";
import GoogleMap from "../../components/googleMap/GoogleMap";
import Popup from "../../components/popup/Popup";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import {
  isShowStreamNow,
  isWorkTimeNow,
  numberDayNow,
} from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import QUERY from "../../query";
import { DAY_OF_WEEK, EN_SHORT_TO_RU_LONG_V_P } from "../../constants";

import "./company.css";

const Company = (props) => {
  const [showPopup, setShowPopap] = useState(false);
  const [DATA, setDATA] = useState(null);

  const [showStream, setShowStream] = useState(false);
  const [nextStreamTime, setNextStreamTime] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [curDistance, setCurDistance] = useState(null);
  const [mouseMapCoordinates, setMouseMapCoordinates] = useState({});

  useEffect(() => {
    if (localStorage.getItem("uniqueCompanyType")) {
      localStorage.setItem("uniqueCompanyType", "");
    }
  }, []);

  useEffect(() => {
    if (DATA) {
      isShowStreamNow(DATA.place, setShowStream, setNextStreamTime);
      isWorkTimeNow(DATA.place, setWorkTime, setIsWork);
    }
  }, [DATA]);

  useEffect(() => {
    QUERY({
      query: `query {
        place (id: ${props.match.params.id}) {
          id name address description
          streams{url name id preview schedules{id day start_time end_time}}
          categories{name slug} coordinates
          schedules {day start_time end_time} user {id name email}
        }
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setDATA(data.data);
      })
      .catch((err) => console.log(err, "  ONE PLACE"));
  }, []);

  const togglePopup = () => {
    showPopup ? setShowPopap(false) : setShowPopap(true);
  };

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

  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
      hideSideMenu();
    };
  });

  if (navigator.geolocation && DATA) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurDistance(
          getDistanceFromLatLonInKm(
            pos.coords.latitude,
            pos.coords.longitude,
            DATA.place.coordinates.split(",")[0],
            DATA.place.coordinates.split(",")[1]
          )
        );
      },
      (err) => console.log(err, " GEOLOCATION COMPANY ERROR ")
    );
  } else {
    console.log("Геолокация недоступна ");
  }

  const mouseDownMapHandler = (e) => {
    setMouseMapCoordinates({
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const mouseUpMapHandler = (e) => {
    if (
      +mouseMapCoordinates.clientX === +e.clientX &&
      +mouseMapCoordinates.clientY === +e.clientY
    ) {
      togglePopup();
    }
  };

  const whenIsTranslation = () => {
    if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() !== "сегодня"
    ) {
      return (
        "Трансляция начнется в " +
        EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
        " в " +
        nextStreamTime.start_time
      );
    } else if (
      nextStreamTime.start_time &&
      nextStreamTime.day.toLowerCase() === "сегодня"
    ) {
      return "Трансляция начнется сегодня в " + nextStreamTime.start_time;
    } else if (!nextStreamTime.start_time) {
      return "Нет предстоящих трансляций";
    }
  };

  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 100 },
  });

  return (
    <div
      onClick={(e) => {
        if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
          hideSideMenu();
        }
      }}
    >
      <Header
        logo
        burger
        arrow
        isShowMenu={isShowMenu}
        showSlideSideMenu={showSlideSideMenu}
        showSideMenu={showSideMenu}
      />
      <animated.div
        className="Company"
        style={animateProps}
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
            hideSideMenu();
        }}
      >
        <div className="bigCompanyHeaderDesc">
          <Link to="/home"> &#60; На главную</Link>
        </div>
        {DATA && (
          <div className="flex">
            <div className="shadowBlock">
              <div className="videoBlock">
                {showStream && (
                  <div>
                    <div className="yesVideo">
                      <VideoPlayer
                        preview={DATA.place.streams[0].preview}
                        src={DATA.place.streams[0].url}
                      />
                    </div>
                    <div className="rowCompanyBlockStreamDesc">
                      <div className="rowCompanyBlockStreamInner">
                        <CustomImg
                          alt="eye"
                          className="eyeCompanyBlock"
                          name={"eye"}
                        />
                        <p className="leftTextCompanyBlock">25 752</p>
                      </div>
                      <div className="rowCompanyBlockStreamInner">
                        <span className="circle"></span>
                        <p className="leftTextCompanyBlock">255</p>
                      </div>
                    </div>
                  </div>
                )}
                {!showStream && (
                  <div className="noVideo">{whenIsTranslation()}</div>
                )}
                <p className="videoDescription">
                  <span>{DATA.place.name}</span> - {DATA.place.description}
                </p>
              </div>
              <div className="desc">
                <div className="mobileDescription">
                  <h3>
                    <span className="mobileCompanyType">
                      {DATA.place.categories[0] &&
                        DATA.place.categories[0].name}{" "}
                      "
                    </span>
                    {DATA.place.name}
                    <span className="mobileCompanyType">"</span>
                  </h3>
                  <p className="typeOfPati">"Супер пати всех студентов"</p>
                  <p className="dayOfWeek">{DAY_OF_WEEK[numberDayNow]}</p>
                  <p className="distance">
                    {curDistance && (
                      <span>{Number(curDistance).toFixed(2)} km</span>
                    )}
                    {!curDistance && " 0 km"}
                  </p>
                </div>
                <p className="mobileOpenedTo">
                  {isWork && <span>Открыто: до {workTime.split("-")[1]}</span>}
                  {!isWork && "Закрыто"}
                </p>
                <div className="timeBlocksDesc">
                  <div className="timeBlock">
                    <CustomImg
                      alt="clock"
                      name={"clock"}
                      height="16"
                      width="16"
                    />
                    <p className="rightTimeBlock">
                      <span>Время работы:</span>
                      <span>{workTime || "Выходной"}</span>
                    </p>
                  </div>
                  <div className="timeBlock streamTime">
                    <CustomImg
                      alt="camera"
                      name={"camera"}
                      height="16"
                      width="16"
                    />
                    <p className="rightTimeBlock">
                      <span> Стрим:</span>
                      <span>
                        {showStream ? " Стрим идет" : " Стрим не идет"}
                      </span>
                    </p>
                  </div>
                  <div className="timeBlock">
                    <CustomImg
                      alt="location"
                      name={"location1"}
                      height="16"
                      width="16"
                    />
                    <p className="rightTimeBlock">
                      <span>Адрес: </span>
                      <span>{DATA.place.address}</span>
                    </p>
                  </div>
                </div>

                <div className="smallMapWrapDesc">
                  <div
                    className="smallMap"
                    onMouseDown={mouseDownMapHandler}
                    onMouseUp={mouseUpMapHandler}
                  >
                    <GoogleMap
                      togglePopupGoogleMap={togglePopup}
                      styleContainerMap={{ height: "85px" }}
                      initialCenterMap={
                        DATA.place.coordinates
                          ? {
                              lat: Number(DATA.place.coordinates.split(",")[0]),
                              lng: Number(DATA.place.coordinates.split(",")[1]),
                            }
                          : null
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="type">
                {DATA.place.categories[0] && DATA.place.categories[0].name}
              </div>
            </div>

            <div className="smallMapWrapMobile">
              <div
                className="smallMap"
                onMouseDown={mouseDownMapHandler}
                onMouseUp={mouseUpMapHandler}
              >
                <GoogleMap
                  togglePopupGoogleMap={togglePopup}
                  styleContainerMap={{ height: "200px" }}
                  initialCenterMap={
                    DATA.place.coordinates
                      ? {
                          lat: Number(DATA.place.coordinates.split(",")[0]),
                          lng: Number(DATA.place.coordinates.split(",")[1]),
                        }
                      : null
                  }
                />
              </div>
              <p className="smallMapLocation">
                {DATA ? DATA.place.address : ""}
              </p>
            </div>
          </div>
        )}
        {!DATA && isLoading && <Loader />}
        {showPopup && (
          <Popup togglePopup={togglePopup}>
            <GoogleMap
              togglePopupGoogleMap={togglePopup}
              styleContainerMap={{ width: "100vw" }}
              closeBtn
              initialCenterMap={
                DATA.place.coordinates
                  ? {
                      lat: Number(DATA.place.coordinates.split(",")[0]),
                      lng: Number(DATA.place.coordinates.split(",")[1]),
                    }
                  : null
              }
            />
          </Popup>
        )}
      </animated.div>
      <BottomMenu isShowMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default Company;
