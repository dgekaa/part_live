import React, { useState, useRef, useEffect } from "react";
import GooggleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";

import CustomImg from "../../components/customImg/CustomImg";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import { EN_SHORT_TO_RU_LONG_V_P, API_KEY } from "../../constants";
import QUERY from "../../query";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import TypeNav from "../../components/typeNav/TypeNav";
import CompanyNav from "../../components/companyNav/CompanyNav";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";

import { styles } from "../../components/googleMap/GoogleMapStyles";
import "./map.css";

const Marker = ({ children }) => children;

const createMapOptions = () => {
  return { styles: styles };
};

const MapComponent = (props) => {
  const [DATA, setDATA] = useState([]);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef();
  const [zoom, setZoom] = useState(12);
  const [bounds, setBounds] = useState(null);
  const [windowWidth, setWindowWidth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [mouseMapCoordinates, setMouseMapCoordinates] = useState({});
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    QUERY({
      query: `query{
          places{id name coordinates
          streams{url name id preview schedules{id day start_time end_time}}
          schedules{id day start_time end_time}
          categories{id name slug}}
        }`,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setMarkers(data.data.places);
        setDATA(data.data.places);
      })
      .catch((err) => console.log(err, "MAP  ERR"));
  }, []);

  const points = markers.map((el, i) => {
    return {
      type: "Feature",
      item: el,
      properties: {
        cluster: false,
        crimeId: i,
        category: el.categories[0] && el.categories[0].name,
      },
      geometry: {
        type: "Point",
        coordinates: [
          +el.coordinates.split(",")[1],
          +el.coordinates.split(",")[0],
        ],
      },
    };
  });

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 190,
      maxZoom: 20,
    },
  });

  const clickedType = (type) => {
    if (type) {
      const filteredData = DATA.filter((el) => {
        if (el.categories && el.categories[0]) {
          return el.categories[0].name.toUpperCase() === type.toUpperCase();
        }
      });
      setMarkers(filteredData);
    } else {
      setMarkers(DATA);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("filter_type") && !isLoading && DATA.length) {
      const filterName = localStorage.getItem("filter_type");
      clickedType(filterName);
    }
  }, [DATA]);

  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [referrer, setReferrer] = useState("");

  const hideSideMenu = () => {
    setShowSlideSideMenu(false);
    setTimeout(() => {
      document.body.style.overflow = "visible";
    }, 400);
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

  const [defaultCenter, setDefaultCenter] = useState();

  if (navigator.geolocation && !defaultCenter) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDefaultCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log(err, " GEOLOCATION MAP ERROR")
    );
  } else {
    console.log("Геолокация недоступна");
  }

  const mouseDownHandler = ({ clientX, clientY }) =>
    setMouseMapCoordinates({
      clientX,
      clientY,
    });
  const mouseUpHandler = (e, data) => {
    if (
      +mouseMapCoordinates.clientX === +e.clientX &&
      +mouseMapCoordinates.clientY === +e.clientY
    ) {
      setReferrer(`/company/${data}`);
    }
  };

  const animateProps = useSpring({
    left: isShowMenu ? -200 : 0,
    config: { duration: 200 },
  });

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
        arrow
        burger
        showSlideSideMenu={showSlideSideMenu}
        showSideMenu={showSideMenu}
      />
      <div className="navContainerMap">
        <CompanyNav
          style={{ zIndex: 1 }}
          currentPage="/map"
          clickedType={clickedType}
          toSlideFixedNav={isShowMenu}
        />
        <TypeNav style={{ zIndex: 1 }} />
      </div>
      {isLoading && <Loader />}
      {!isLoading && (
        <animated.div className="mapContainer" style={animateProps}>
          <GooggleMapReact
            options={createMapOptions}
            style={{
              height: "100%",
              width: "100%",
            }}
            bootstrapURLKeys={{
              key: API_KEY,
            }}
            defaultCenter={
              defaultCenter || {
                lat: 53.904577,
                lng: 27.557328,
              }
            }
            defaultZoom={12}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map;
            }}
            onChange={({ zoom, bounds }) => {
              setZoom(zoom);
              setBounds([
                bounds.nw.lng,
                bounds.se.lat,
                bounds.se.lng,
                bounds.nw.lat,
              ]);
            }}
          >
            {defaultCenter && (
              <Marker lat={defaultCenter.lat} lng={defaultCenter.lng}>
                <CustomImg
                  alt="me"
                  className="eye"
                  name={"dancer"}
                  width="32"
                  height="32"
                />
              </Marker>
            )}

            {clusters.map((cluster) => {
              const [longitude, latitude] = cluster.geometry.coordinates;
              const {
                cluster: isCluster,
                point_count: pointCount,
              } = cluster.properties;

              //ЗАМЕНА НА ЦИФРЫ
              if (isCluster) {
                return (
                  <Marker
                    key={cluster.properties.cluster_id}
                    lat={latitude}
                    lng={longitude}
                  >
                    <div className="clusterMarker">
                      <p> {pointCount}</p>
                    </div>
                  </Marker>
                );
              }

              //БЕЗ ЗАМЕНЫ НА ЦИФРЫ
              let streamTime = "",
                workTime = "",
                isWork = false,
                nextStreamTime = "";

              const setShowStream = (time) => (streamTime = time);
              const setWorkTime = (time) => (workTime = time);
              const setIsWork = (bool) => (isWork = bool);
              const setNextStreamTime = (time) => (nextStreamTime = time);

              isShowStreamNow(cluster.item, setShowStream, setNextStreamTime);
              isWorkTimeNow(cluster.item, setWorkTime, setIsWork);
              return (
                <Marker
                  key={cluster.properties.crimeId}
                  lat={latitude}
                  lng={longitude}
                >
                  <Link
                    onMouseDown={(e) => {
                      !("ontouchstart" in document.documentElement) &&
                        mouseDownHandler(e);
                    }}
                    onMouseUp={(e) => {
                      !("ontouchstart" in document.documentElement) &&
                        mouseUpHandler(e, cluster.item.id);
                    }}
                    onTouchStart={(e) => {
                      mouseDownHandler(
                        {
                          clientX: e.nativeEvent.changedTouches[0].clientX,
                          clientY: e.nativeEvent.changedTouches[0].clientY,
                        },
                        cluster.item.id
                      );
                    }}
                    onTouchEnd={(e) => {
                      mouseUpHandler(
                        {
                          clientX: e.nativeEvent.changedTouches[0].clientX,
                          clientY: e.nativeEvent.changedTouches[0].clientY,
                        },
                        cluster.item.id
                      );
                    }}
                    to={{
                      pathname: referrer
                        ? `/company/${cluster.item.id}`
                        : `/map`,
                    }}
                  >
                    <div className="mapMarkerWrap">
                      <div className="mapMarker">
                        {!!streamTime &&
                          (!previewError ? (
                            <VideoPlayer
                              disablePlayBtn
                              className="companyImg"
                              preview={cluster.item.streams[0].preview}
                              // src={cluster.item.streams[0].url}
                              autoPlay={true}
                            />
                          ) : (
                            // <video
                            //   className="companyImg"
                            //   src={cluster.item.streams[0].url}
                            //   autoPlay
                            //   onError={(err) => setPreviewError(err)}
                            // />
                            <div className="companyImg mapNoTranslationWrap">
                              <p className="mapNoTranslationText">ERR</p>
                            </div>
                          ))}
                        {!streamTime && (
                          <div className="companyImg mapNoTranslationWrap">
                            <p className="mapNoTranslationText">
                              {nextStreamTime.start_time &&
                                nextStreamTime.day.toLowerCase() !==
                                  "сегодня" &&
                                "Начало трансляции в " +
                                  EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
                                  " в " +
                                  nextStreamTime.start_time}
                              {nextStreamTime.start_time &&
                                nextStreamTime.day.toLowerCase() ===
                                  "сегодня" &&
                                "Трансляция начнется сегодня в " +
                                  nextStreamTime.start_time}
                              {!nextStreamTime.start_time &&
                                "Нет предстоящих трансляций"}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="mapMarkerName">
                        {cluster.item.name}
                        <span className="openedTo">
                          {isWork && <span> Открыто:{workTime} </span>}
                          {!isWork && <span> Закрыто </span>}
                        </span>
                      </p>
                      <div className="arrow"></div>
                    </div>
                  </Link>
                </Marker>
              );
            })}
          </GooggleMapReact>
        </animated.div>
      )}

      <BottomMenu isShowMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default MapComponent;
