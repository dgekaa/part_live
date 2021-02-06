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
  queryPath,
} from "../../constants";
import QUERY from "../../query";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import TypeNav from "../../components/typeNav/TypeNav";
import CompanyNav from "../../components/companyNav/CompanyNav";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";
import { defaultColor } from "../../constants";

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
    height: calc(100% - 140px);
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
  background: ${defaultColor};
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

const NoTranslation = styled.p`
  color: #eee;
  padding: 3px;
  background-color: #000;
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 95px;
  display: flex;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  @media (max-width: 760px) {
    height: 90px;
    text-align: center;
    width: 120px;
  }
`;

const TransparentBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-self: center;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
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

  const [DATA, setDATA] = useState([]),
    [markers, setMarkers] = useState([]),
    [zoom, setZoom] = useState(12),
    [bounds, setBounds] = useState(null),
    [isLoading, setIsLoading] = useState(true),
    [mouseMapCoordinates, setMouseMapCoordinates] = useState({}),
    [referrer, setReferrer] = useState(""),
    [currentCenterOfMap, setCurrentCenterOfMap] = useState(),
    [defaultCenter, setDefaultCenter] = useState(),
    [gMapDefaultCenter, setGMapDefaultCenter] = useState();

  const dateNow = new Date()
    .toLocaleDateString()
    .split(".")
    .reverse()
    .join("-");

  useEffect(() => {
    QUERY({
      query: `query{
          places{id name coordinates profile_image disabled mobile_stream
          streams{url name see_you_tomorrow id preview schedules{id day start_time end_time}}
          schedules{id day start_time end_time}
          categories{id name slug}}
        }`,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data.places, "---data.data.places");
        setIsLoading(false);
        setMarkers(data.data.places);
        setDATA(data.data.places);
      })
      .catch((err) => console.log(err, "MAP  ERR"));
  }, []);

  // useEffect(() => {
  //   if (sessionStorage.getItem("filter_type") && !isLoading && DATA.length) {
  //     const filterName = sessionStorage.getItem("filter_id");
  //     clickedType(filterName);
  //   }
  // }, [DATA]);

  const points = markers
      .filter((el) => !el.disabled)
      .map((el, i) => {
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
      }),
    { clusters } = useSupercluster({
      points,
      bounds,
      zoom,
      options: {
        radius: 220,
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

  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false);

  const hideSideMenu = () => {
      setShowSlideSideMenu(false);
      setTimeout(() => {
        document.body.style.overflow = "visible";
      }, 400);
      setIsShowMenu(false);
    },
    showSideMenu = () => {
      setShowSlideSideMenu(true);
      document.body.style.overflow = "hidden";
      setIsShowMenu(true);
    };

  useEffect(() => {
    window.onresize = (e) => hideSideMenu();
  });

  useEffect(() => {
    const center = sessionStorage.getItem("prevCenter")
      ? {
          lat: JSON.parse(sessionStorage.getItem("prevCenter")).lat,
          lng: JSON.parse(sessionStorage.getItem("prevCenter")).lng,
        }
      : defaultCenter;

    setGMapDefaultCenter(center);
  }, [defaultCenter]);

  if (navigator.geolocation && !defaultCenter) {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setDefaultCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.log(err, " GEOLOCATION MAP ERROR")
    );
  } else {
    console.log("Геолокация недоступна");
  }

  const mouseDownHandler = ({ clientX, clientY }) =>
      setMouseMapCoordinates({
        clientX,
        clientY,
      }),
    mouseUpHandler = (e, data) => {
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

  const dancerClick = (target) => {
      target.previousSibling.style.opacity = 1;
      setTimeout(() => {
        target.previousSibling.style.opacity = 0;
      }, 2000);
    },
    markerClick = () => {
      sessionStorage.setItem("prevZoom", zoom);
      sessionStorage.setItem("prevCenter", JSON.stringify(currentCenterOfMap));
    },
    markerMouseDown = (e) => {
      !("ontouchstart" in document.documentElement) && mouseDownHandler(e);
    },
    markerMouseUp = (e, cluster) => {
      !("ontouchstart" in document.documentElement) &&
        mouseUpHandler(e, cluster.item.id);
    },
    hide = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
        hideSideMenu();
    },
    onChangeMap = (zoom, bounds, center) => {
      setCurrentCenterOfMap(center);
      setZoom(zoom);
      setBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]);
    },
    onTouchStart = (e, cluster) => {
      mouseDownHandler(
        {
          clientX: e.nativeEvent.changedTouches[0].clientX,
          clientY: e.nativeEvent.changedTouches[0].clientY,
        },
        cluster.item.id
      );
    },
    onTouchEnd = (e, cluster) => {
      mouseUpHandler(
        {
          clientX: e.nativeEvent.changedTouches[0].clientX,
          clientY: e.nativeEvent.changedTouches[0].clientY,
        },
        cluster.item.id
      );
    };

  return (
    <div onClick={(e) => hide(e)}>
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
              gMapDefaultCenter || {
                lat: 53.904577,
                lng: 27.557328,
              }
            }
            defaultZoom={+sessionStorage.getItem("prevZoom") || 12}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => (mapRef.current = map)}
            onChange={({ zoom, bounds, center }) =>
              onChangeMap(zoom, bounds, center)
            }
          >
            {defaultCenter && (
              <Marker lat={defaultCenter.lat} lng={defaultCenter.lng}>
                <YouAreHere>Вы тут</YouAreHere>
                <CustomImg
                  onClick={({ target }) => dancerClick(target)}
                  alt="me"
                  name={"dancer"}
                  width="32"
                  height="32"
                />
              </Marker>
            )}
            {clusters.map((cluster) => {
              const [longitude, latitude] = cluster.geometry.coordinates,
                {
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

              const setShowStream = (time) => (streamTime = time),
                setWorkTime = (time) => (workTime = time),
                setIsWork = (bool) => (isWork = bool),
                setNextStreamTime = (time) => (nextStreamTime = time),
                setNextWorkTime = (time) => (nextWorkTime = time);

              isShowStreamNow(
                cluster.item,
                setShowStream,
                setNextStreamTime,
                cluster.item.streams[0] &&
                  dateNow === cluster.item.streams[0].see_you_tomorrow
              );
              isWorkTimeNow(
                cluster.item,
                setWorkTime,
                setIsWork,
                setNextWorkTime
              );

              const isStartTime = nextStreamTime.start_time,
                streamNotTodayText =
                  isStartTime &&
                  nextStreamTime.day.toLowerCase() !== "сегодня" &&
                  "Начало трансляции в " +
                    EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
                    " в " +
                    isStartTime,
                streamTodayText =
                  isStartTime &&
                  nextStreamTime.day.toLowerCase() === "сегодня" &&
                  "Трансляция начнется сегодня в " + isStartTime,
                closed = !isStartTime && !nextWorkTime && "Заведение закрыто",
                isWillOpen =
                  !isStartTime && nextWorkTime && nextWorkTime.start_time,
                willOpen = isWillOpen && "Откроется: ",
                whenWillOpen =
                  isWillOpen &&
                  `${
                    nextWorkTime.day.toLowerCase() !== "сегодня"
                      ? EN_SHORT_TO_RU_LONG[nextWorkTime.day]
                      : nextWorkTime.day
                  } ${nextWorkTime.start_time}-${nextWorkTime.end_time}`;

              return (
                <Marker
                  key={cluster.properties.crimeId}
                  lat={latitude}
                  lng={longitude}
                >
                  <Link
                    onClick={() => markerClick()}
                    onMouseDown={(e) => markerMouseDown(e)}
                    onMouseUp={(e) => markerMouseUp(e, cluster)}
                    onTouchStart={(e) => onTouchStart(e, cluster)}
                    onTouchEnd={(e) => onTouchEnd(e, cluster)}
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
                            !!streamTime &&
                            !cluster.item.mobile_stream && (
                              <TranslationBlock
                                style={{
                                  backgroundImage: `url(${cluster.item.streams[0].preview})`,
                                }}
                              />
                            )}
                          {!streamTime && !cluster.item.mobile_stream && (
                            <NoTranslation
                              bg={
                                cluster.item.profile_image
                                  ? `${queryPath}/storage/` +
                                    cluster.item.profile_image.replace(
                                      ".png",
                                      ".jpg"
                                    )
                                  : ""
                              }
                            >
                              <TransparentBg>
                                {streamNotTodayText}
                                {streamTodayText}
                                {closed}
                                {willOpen}
                                {isWillOpen && <br />}
                                {whenWillOpen}
                              </TransparentBg>
                            </NoTranslation>
                          )}
                          {cluster.item.mobile_stream && (
                            <TranslationBlock
                              style={{
                                backgroundImage: `url(https://partylivestream.web4net.ru:8080/hls/show/${cluster.item.id}.jpeg)`,
                              }}
                            />
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

      <BottomMenu isShowMenu={isShowMenu} border />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default MapComponent;
