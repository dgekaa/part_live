import React, { useState, useRef, useEffect } from "react";
import GooggleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import CustomImg from "../../components/customImg/CustomImg";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import {
  EN_SHORT_TO_RU_LONG_V_P,
  API_KEY,
  EN_SHORT_TO_RU_LONG,
} from "../../constants";
import QUERY from "../../query";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import TypeNav from "../../components/typeNav/TypeNav";
import CompanyNav from "../../components/companyNav/CompanyNav";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";

import { styles } from "../../components/googleMap/GoogleMapStyles";

const Marker = ({ children }) => children;

const createMapOptions = () => {
  return { styles: styles };
};

const NavContainerMap = styled.div`
  position: relative;
  display: flex;
  width: 1000px;
  margin: 0 auto;
  justify-content: space-between;
  top: 50px;
  @media (max-width: 760px) {
    justify-content: center;
  }
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  @media (max-width: 760px) {
    position: fixed;
    top: 105px;
    width: 100%;
    height: calc(100% - 100px);
  }
`;

const YouAreHere = styled.p`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  font-weight: bold;
  border-radius: 5px;
  letter-spacing: 1px;
  width: 80px;
  height: 25px;
  color: #fff;
  position: relative;
  left: -25px;
  bottom: 10px;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: 0.3s ease all;
  &::after {
    width: 0;
    height: 0;
    content: "";
    position: absolute;
    bottom: -5px;
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.3);
    border-bottom: 0;
  }
`;

const ClusterMarker = styled.div`
  width: 36px;
  height: 36px;
  background: #e32a6c;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

const MarkerArrow = styled.div`
  width: 0;
  height: 0;
  margin: 0 auto;
  border: 10px solid transparent;
  border-top-color: #fff;
  border-bottom: 0;
  position: absolute;
  bottom: -30px;
  left: 15px;
  @media (max-width: 760px) {
    bottom: -10px;
    left: 0px;
  }
`;

const MarkerWrapp = styled.div`
  width: 150px;
  height: 150px;
  background-color: #fff;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  bottom: 130px;
  right: 50px;
  transition: 0.3s ease opacity;
  &:hover {
    opacity: 0.9;
  }
  @media (max-width: 760px) {
    width: 120px;
    height: 130px;
  }
`;

const MarkerInner = styled.div`
  overflow: hidden;
  display: flex;
  border-radius: 10px 10px 0 0;
  flex: 1;
  align-items: flex-end;
  @media (max-width: 760px) {
    border-radius: 10px;
  }
`;

const CustomImgStyle = styled(CustomImg)``;

const PreviewBlock = styled.div`
  object-fit: cover;
  -webkit-transition: 0.2s ease all;
  -o-transition: 0.2s ease all;
  transition: 0.2s ease all;
  height: 95px;
  display: flex;
  padding-bottom: 26px;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  @media (max-width: 760px) {
    height: 90px;
  }
`;

const TranslationBlock = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 95px;
  width: 150px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  background-color: #000;
  @media (max-width: 760px) {
    height: 90px;
    width: 120px;
    border-radius: 5px;
  }
`;

const NoTranslationText = styled.p`
  color: #919191;
  padding: 3px;
  background-color: #000;
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 95px;
  display: flex;
  align-self: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  @media (max-width: 760px) {
    height: 90px;
    text-align: center;
    width: 120px;
  }
`;

const MarkerDesc = styled.p`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 55px;
  padding: 8px;
  padding-top: 6px;
  padding-right: 6px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  @media (max-width: 760px) {
    height: 40px;
    padding: 4px;
  }
`;

const MarkerName = styled.p`
  color: #000;
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 19px;
  margin-left: 5px;
  @media (max-width: 760px) {
    font-size: 12px;
  }
`;

const BottomMarkerText = styled.p`
  display: flex;
  justify-content: space-between;
  line-height: 16px;
  padding: 2px;
`;

const IsOpened = styled.span`
  color: #000;
  font-size: 12px;
  line-height: 13px;
  font-weight: normal;
  line-height: 9px;
  @media (max-width: 760px) {
    color: #909090;
    font-size: 11px;
  }
`;

const Row = styled.div`
  display: flex;
`;

const Circle = styled.div`
  width: 7px;
  height: 7px;
  background: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 3px;
  @media (max-width: 760px) {
    margin-top: 3px;
    width: 5px;
    height: 5px;
  }
`;

const Opened = styled.span`
  display: inline-block;

  @media (max-width: 760px) {
    display: none;
  }
`;

const MapComponent = (props) => {
  const mapRef = useRef();

  const [DATA, setDATA] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(12);
  const [bounds, setBounds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mouseMapCoordinates, setMouseMapCoordinates] = useState({});
  const [referrer, setReferrer] = useState("");
  const [currentCenterOfMap, setCurrentCenterOfMap] = useState();
  const [defaultCenter, setDefaultCenter] = useState();

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

  useEffect(() => {
    if (sessionStorage.getItem("filter_type") && !isLoading && DATA.length) {
      const filterName = sessionStorage.getItem("filter_type");
      clickedType(filterName);
    }
  }, [DATA]);

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

  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
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
  useEffect(() => {
    window.onresize = function (e) {
      hideSideMenu();
    };
  });

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

  const SwipePageSpring = useSpring({
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
      <NavContainerMap>
        <CompanyNav
          style={{ zIndex: 1 }}
          currentPage="/map"
          clickedType={clickedType}
          toSlideFixedNav={isShowMenu}
        />
        <TypeNav style={{ zIndex: 1 }} />
      </NavContainerMap>
      {isLoading && <Loader />}
      {!isLoading && (
        <MapContainer as={animated.div} style={SwipePageSpring}>
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
              sessionStorage.getItem("prevCenter")
                ? {
                    lat: JSON.parse(sessionStorage.getItem("prevCenter")).lat,
                    lng: JSON.parse(sessionStorage.getItem("prevCenter")).lng,
                  }
                : defaultCenter || {
                    lat: 53.904577,
                    lng: 27.557328,
                  }
            }
            defaultZoom={+sessionStorage.getItem("prevZoom") || 12}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map;
            }}
            onChange={({ zoom, bounds, center }) => {
              setCurrentCenterOfMap(center);
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
                <YouAreHere>Вы тут</YouAreHere>
                <CustomImg
                  onClick={({ target }) => {
                    target.previousSibling.style.opacity = 1;
                    setTimeout(() => {
                      target.previousSibling.style.opacity = 0;
                    }, 2000);
                  }}
                  alt="me"
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
                    <ClusterMarker>
                      <p> {pointCount}</p>
                    </ClusterMarker>
                  </Marker>
                );
              }

              //БЕЗ ЗАМЕНЫ НА ЦИФРЫ
              let streamTime = "",
                workTime = "",
                isWork = false,
                nextStreamTime = false,
                nextWorkTime = null;

              const setShowStream = (time) => (streamTime = time);
              const setWorkTime = (time) => (workTime = time);
              const setIsWork = (bool) => (isWork = bool);
              const setNextStreamTime = (time) => (nextStreamTime = time);
              const setNextWorkTime = (time) => (nextWorkTime = time);

              isShowStreamNow(cluster.item, setShowStream, setNextStreamTime);
              isWorkTimeNow(
                cluster.item,
                setWorkTime,
                setIsWork,
                setNextWorkTime
              );
              return (
                <Marker
                  key={cluster.properties.crimeId}
                  lat={latitude}
                  lng={longitude}
                >
                  <Link
                    onClick={() => {
                      sessionStorage.setItem("prevZoom", zoom);
                      sessionStorage.setItem(
                        "prevCenter",
                        JSON.stringify(currentCenterOfMap)
                      );
                    }}
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
                    <MarkerArrow></MarkerArrow>
                    <MarkerWrapp>
                      <MarkerInner>
                        <PreviewBlock>
                          {cluster.item.streams &&
                            cluster.item.streams[0] &&
                            cluster.item.streams[0].preview &&
                            !!streamTime && (
                              <TranslationBlock
                                style={{
                                  backgroundImage: `url(${cluster.item.streams[0].preview})`,
                                }}
                              />
                            )}
                          {!streamTime && (
                            <NoTranslationText>
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
                                !nextWorkTime &&
                                "Заведение закрыто"}

                              {!nextStreamTime.start_time &&
                                nextWorkTime &&
                                nextWorkTime.start_time &&
                                "Откроется: "}
                              {!nextStreamTime.start_time &&
                                nextWorkTime &&
                                nextWorkTime.start_time && <br />}
                              {!nextStreamTime.start_time &&
                                nextWorkTime &&
                                nextWorkTime.start_time &&
                                `${
                                  nextWorkTime.day.toLowerCase() !== "сегодня"
                                    ? EN_SHORT_TO_RU_LONG[nextWorkTime.day]
                                    : nextWorkTime.day
                                } ${nextWorkTime.start_time}-${
                                  nextWorkTime.end_time
                                }`}
                            </NoTranslationText>
                          )}
                        </PreviewBlock>

                        <MarkerDesc>
                          <div style={{ display: "flex" }}>
                            {cluster.item.categories[0] &&
                              cluster.item.categories[0].slug && (
                                <CustomImgStyle
                                  className="qwe"
                                  alt="Icon"
                                  name={cluster.item.categories[0].slug}
                                  width="16"
                                  height="16"
                                />
                              )}
                            <MarkerName>{cluster.item.name}</MarkerName>
                          </div>

                          <BottomMarkerText>
                            <IsOpened>
                              {isWork && (
                                <Row>
                                  <Circle isWork={isWork} />
                                  <span>
                                    <Opened>Открыто</Opened> до{" "}
                                    {workTime.split("-")[1]}
                                  </span>
                                </Row>
                              )}
                              {!isWork && (
                                <Row>
                                  <Circle isWork={isWork} />
                                  <span>Закрыто</span>
                                </Row>
                              )}
                            </IsOpened>
                          </BottomMarkerText>
                        </MarkerDesc>
                      </MarkerInner>
                    </MarkerWrapp>
                  </Link>
                </Marker>
              );
            })}
          </GooggleMapReact>
        </MapContainer>
      )}

      <BottomMenu isShowMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default MapComponent;
