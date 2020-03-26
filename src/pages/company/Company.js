import React, { useState, useEffect, useRef } from "react";
import GooggleMapReact from "google-map-react";
import { Link } from "react-router-dom";
import ReactHLS from "react-hls";

import Popup from "../../components/popup/Popup";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";

import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import QUERY from "../../query";
import { API_KEY } from "../../constants";

import "./company.css";

const Marker = ({ children }) => children;

const Company = props => {
  const [showPopup, setShowPopap] = useState(false);
  const [DATA, setDATA] = useState(null);
  const [geoposition, setGeoposition] = useState([0, 0]);
  const dayOfWeek = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
  ];
  const [showStream, setShowStream] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [curDistance, setCurDistance] = useState(null);

  const numberDayNow = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => {
    if (DATA) {
      isShowStreamNow(DATA.place, setShowStream);
      isWorkTimeNow(DATA.place, setWorkTime, setIsWork);
    }
  }, [DATA]);

  useEffect(() => {
    if (DATA) {
      setGeoposition([
        +DATA.place.coordinates.split(",")[0],
        +DATA.place.coordinates.split(",")[1]
      ]);
    }
  }, [DATA]);

  useEffect(() => {
    QUERY({
      query: `query {
        place (id: ${props.match.params.id}) {
          id name address description
          streams{url name id preview
            schedules{id day start_time end_time}
          }
          categories{name slug}
          coordinates
          schedules {day start_time end_time}
          user {id name email}
        }
      }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setIsLoading(false);
        setDATA(data.data);
      })
      .catch(err => {
        console.log(err, "  ONE PLACE");
      });
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

  window.onresize = function(e) {
    setWindowWidth(e.target.innerWidth);
    hideSideMenu();
  };

  if (navigator.geolocation && DATA) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCurDistance(
          getDistanceFromLatLonInKm(
            pos.coords.latitude,
            pos.coords.longitude,
            DATA.place.coordinates.split(",")[0],
            DATA.place.coordinates.split(",")[1]
          )
        );
      },
      err => {
        console.log(err, " GEOLOCATION ERROR ");
      }
    );
  } else {
    console.log("Геолокация недоступна ");
  }

  return (
    <div
      onClick={e => {
        if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
          hideSideMenu();
        }
      }}
    >
      <div
        className="Company"
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
        {windowWidth && windowWidth > 760 && (
          <div className="bigCompanyHeader">
            <Link to="/home"> &#60; На главную</Link>
          </div>
        )}
        {windowWidth && windowWidth < 760 && (
          <Header
            logo
            burger
            arrow
            toSlideFixedHeader={isShowMenu}
            isShowMenu={isShowMenu}
            showSlideSideMenu={showSlideSideMenu}
            showSideMenu={showSideMenu}
          />
        )}
        {DATA && (
          <div className="flex">
            <div className="shadowBlock">
              <div className="videoBlock">
                {showStream && (
                  <ReactHLS
                    url={DATA.place.streams[0].url}
                    controls={true}
                    autoplay={true}
                  />
                )}
                {!showStream && (
                  <div className="noVideo">
                    На данный момент трансляция не запланирована
                  </div>
                )}

                <div className="showWatchPeople"></div>
                <p className="videoDescription">
                  <span>{DATA.place.name}</span> - {DATA.place.description}
                </p>
              </div>
              <div className="desc">
                <div className="mobileDescription">
                  <h3>
                    <span className="mobileCompanyType">
                      {DATA.place.categories[0].name} "
                    </span>
                    {DATA.place.name}
                    <span className="mobileCompanyType">"</span>
                  </h3>
                  <p className="typeOfPati">тип мероприятия?????</p>
                  <p className="dayOfWeek">{dayOfWeek[numberDayNow]}</p>
                  <p className="distance">
                    {curDistance && (
                      <span>{Number(curDistance).toFixed(2)} km</span>
                    )}
                    {!curDistance && " 0 km"}
                  </p>
                </div>
                <p className="smallOpenedTo">
                  {isWork && <span>Открыто: до {workTime.split("-")[1]}</span>}
                  {!isWork && "Закрыто"}
                </p>
                <div className="timeBlocks">
                  <div className="timeBlock">
                    <img
                      height="16"
                      width="16"
                      alt="clock"
                      src={`${process.env.PUBLIC_URL}/img/clock.png`}
                    />
                    <p className="rightTimeBlock">
                      <span>Время работы:</span> <span>{workTime}</span>
                    </p>
                  </div>
                  <div className="timeBlock streamTime">
                    <img
                      height="16"
                      width="16"
                      alt="camera"
                      src={`${process.env.PUBLIC_URL}/img/camera.png`}
                    />
                    <p className="rightTimeBlock">
                      <span> Стрим:</span>
                      <span>
                        {showStream ? " Стрим идет" : " Стрим не идет"}
                      </span>
                    </p>
                  </div>
                  <div className="timeBlock">
                    <img
                      alt="location"
                      height="16"
                      width="16"
                      src={`${process.env.PUBLIC_URL}/img/location.png`}
                    />
                    <p className="rightTimeBlock">
                      <span>Адрес: </span>
                      <span>{DATA.place.address}</span>
                    </p>
                  </div>
                </div>
                {windowWidth && windowWidth > 760 && (
                  <div className="smallMapWrap">
                    <div className="smallMap">
                      <GooggleMapReact
                        onClick={() => {
                          togglePopup();
                        }}
                        // <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAZQdg3dPHXD5Bt-Dgi85wNHG5G_MXpR7g&amp;&libraries=geometry,places"></script>
                        bootstrapURLKeys={{
                          key: API_KEY
                        }}
                        defaultCenter={{
                          lat: geoposition[0],
                          lng: geoposition[1]
                        }}
                        defaultZoom={10}
                      >
                        <Marker lat={geoposition[0]} lng={geoposition[1]}>
                          <button className="mapMarkerCompany">
                            <img
                              alt="img"
                              src={`${process.env.PUBLIC_URL}/img/location.png`}
                            ></img>
                          </button>
                        </Marker>
                      </GooggleMapReact>
                    </div>
                  </div>
                )}
              </div>
              <div className="type">{DATA.place.categories[0].name}</div>
            </div>
            {!!windowWidth && windowWidth <= 760 && (
              <div className="smallMapWrap">
                <div className="smallMap">
                  <GooggleMapReact
                    onClick={() => {
                      togglePopup();
                    }}
                    bootstrapURLKeys={{
                      key: API_KEY
                    }}
                    defaultCenter={{
                      lat: geoposition[0],
                      lng: geoposition[1]
                    }}
                    defaultZoom={10}
                  >
                    <Marker lat={geoposition[0]} lng={geoposition[1]}>
                      <button className="mapMarkerCompany">
                        <img
                          alt="img"
                          src={`${process.env.PUBLIC_URL}/img/location.png`}
                        ></img>
                      </button>
                    </Marker>
                  </GooggleMapReact>
                </div>
                <p className="smallMapLocation">
                  {DATA ? DATA.place.address : ""}
                </p>
              </div>
            )}
          </div>
        )}
        {!DATA && isLoading && <Loader />}
        {showPopup && (
          <Popup togglePopup={togglePopup}>
            <GooggleMapReact
              style={{ height: "100%", width: "100%" }}
              bootstrapURLKeys={{
                key: API_KEY
              }}
              defaultCenter={{
                lat: geoposition[0],
                lng: geoposition[1]
              }}
              defaultZoom={10}
            >
              <Marker lat={geoposition[0]} lng={geoposition[1]}>
                <button className="mapMarkerCompany">
                  <img
                    alt="img"
                    src={`${process.env.PUBLIC_URL}/img/location.png`}
                  ></img>
                </button>
              </Marker>
            </GooggleMapReact>
            <div className="closeBtn" onClick={togglePopup}>
              &#215;
            </div>
          </Popup>
        )}
      </div>
      <BottomMenu toSlideFixedBottomMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default Company;
