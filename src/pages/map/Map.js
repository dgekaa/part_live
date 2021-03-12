import React, { useState, useRef, useEffect } from "react";
import GooggleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { debounce } from "lodash";

import CustomImg from "../../components/customImg/CustomImg";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import { API_KEY, queryPath, PLACES_EXT_DATA_QUERY } from "../../constants";
import QUERY from "../../query";
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
  `,
  MapContainer = styled.div`
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
  `,
  YouAreHere = styled.p`
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
  `,
  ClusterMarker = styled.div`
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
  `,
  MarkerArrow = styled.div`
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
  `,
  MarkerWrapp = styled.div`
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
  `,
  MarkerInner = styled.div`
    overflow: hidden;
    display: flex;
    border-radius: 10px 10px 0 0;
    flex: 1;
    align-items: flex-end;
    @media (max-width: 760px) {
      border-radius: 10px;
    }
  `,
  CustomImgStyle = styled(CustomImg)``,
  PreviewBlock = styled.div`
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
  `,
  TranslationBlock = styled.div`
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
  `,
  NoTranslation = styled.p`
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
  `,
  LoaderWrapper = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MarkerDesc = styled.p`
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
  `,
  MarkerName = styled.p`
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
  `,
  BottomMarkerText = styled.p`
    display: flex;
    justify-content: space-between;
    line-height: 16px;
    padding: 2px;
  `,
  IsOpened = styled.span`
    color: #000;
    font-size: 12px;
    line-height: 13px;
    font-weight: normal;
    line-height: 9px;
    @media (max-width: 760px) {
      color: #909090;
      font-size: 11px;
    }
  `,
  Row = styled.div`
    display: flex;
  `,
  Circle = styled.div`
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
  `,
  Opened = styled.span`
    display: inline-block;

    @media (max-width: 760px) {
      display: none;
    }
  `;

const MapComponent = (props) => {
  const mapRef = useRef();

  const [markers, setMarkers] = useState([]),
    [zoom, setZoom] = useState(12),
    [bounds, setBounds] = useState(null),
    [isLoading, setIsLoading] = useState(true),
    [mouseMapCoordinates, setMouseMapCoordinates] = useState({}),
    [referrer, setReferrer] = useState(""),
    [currentCenterOfMap, setCurrentCenterOfMap] = useState(),
    [defaultCenter, setDefaultCenter] = useState(),
    [gMapDefaultCenter, setGMapDefaultCenter] = useState(),
    [typeId, setTypeId] = useState(""),
    [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false),
    [bottomLeft, setBottomLeft] = useState(null),
    [topRight, setTopRight] = useState(null);

  const loadContent = (id) => {
    const current_id = id || sessionStorage.getItem("filter_id"),
      searchString = current_id
        ? ` first : 180,
        where: {
          AND : [
        { column: CATEGORY_IDS, operator: LIKE, value: "%[${current_id}]%"}
             {column : LAT, operator: BETWEEN, value: ["${bottomLeft.lat}", "${topRight.lat}"] }
             {column : LON, operator: BETWEEN, value: ["${bottomLeft.lng}", "${topRight.lng}"] }
            ]
        }`
        : ` first : 180,
        where: {
          AND : [
             {column : LAT, operator: BETWEEN, value: ["${bottomLeft.lat}", "${topRight.lat}"] }
             {column : LON, operator: BETWEEN, value:["${bottomLeft.lng}", "${topRight.lng}"] }
            ]
        }`;

    setIsLoading(true);
    QUERY({
      query: `query{ 
        placesExt(${searchString}) 
        {${PLACES_EXT_DATA_QUERY} }
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setMarkers(data.data.placesExt.data);
      })
      .catch((err) => console.log(err, "MAP  ERR"));
  };
  const debouncedLoad = debounce(() => loadContent(), 500);

  useEffect(() => {
    if (bottomLeft && topRight) {
      console.log(bottomLeft, "------bottomLeft");
      console.log(topRight, "------topRight");
      debouncedLoad();
    }
  }, [bottomLeft, topRight]);

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
            coordinates: [+el.lon, +el.lat],
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

  const clickedType = (id) => {
      setMarkers([]);
      setTypeId(id);
      if (typeId !== id) {
        id ? loadContent(id) : loadContent("");
      }
    },
    hideSideMenu = () => {
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

  useEffect(() => {
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
  }, []);

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
      // ne: {lat: 53.905449424270586, lng: 27.571740348739354} северо-восток
      // nw: {lat: 53.905449424270586, lng: 27.55963822166416} северо-запад
      // se: {lat: 53.90251657841472, lng: 27.571740348739354} юго-восток
      // sw: {lat: 53.90251657841472, lng: 27.55963822166416} юго-запад
      setBottomLeft(bounds.sw);
      setTopRight(bounds.ne);
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
          {!isLoading && defaultCenter && (
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
              } = cluster.properties,
              item = cluster.item;

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
                    pathname: referrer ? `/company/${item.id}` : `/map`,
                  }}
                >
                  <MarkerArrow></MarkerArrow>
                  <MarkerWrapp>
                    <MarkerInner>
                      <PreviewBlock>
                        {item.streams &&
                          item.streams[0] &&
                          item.streams[0].preview &&
                          !!item.is_online &&
                          !item.mobile_stream && (
                            <TranslationBlock
                              style={{
                                backgroundImage: `url(${item.streams[0].preview})`,
                              }}
                            />
                          )}
                        {!item.is_online && !item.mobile_stream && (
                          <NoTranslation
                            bg={
                              item.profile_image
                                ? `${queryPath}/storage/` +
                                  item.profile_image.replace(".png", ".jpg")
                                : ""
                            }
                          ></NoTranslation>
                        )}
                        {item.mobile_stream && (
                          <TranslationBlock
                            style={{
                              backgroundImage: `url(https://ms1.partylive.by/hls/show/${cluster.item.id}/image.jpg)`,
                            }}
                          />
                        )}
                      </PreviewBlock>

                      <MarkerDesc>
                        <div style={{ display: "flex" }}>
                          {item.categories[0] && item.categories[0].slug && (
                            <CustomImgStyle
                              className="qwe"
                              alt="Icon"
                              name={item.categories[0].slug}
                              width="16"
                              height="16"
                            />
                          )}
                          <MarkerName>{item.name}</MarkerName>
                        </div>

                        <BottomMarkerText>
                          <IsOpened>
                            {item.is_work && (
                              <Row>
                                <Circle isWork={item.is_work} />
                                <span>
                                  <Opened>Открыто</Opened> до{" "}
                                  {item.currentScheduleInterval.end_time
                                    .split(" ")[1]
                                    .split(":")
                                    .slice(0, 2)
                                    .join(":")}
                                </span>
                              </Row>
                            )}
                            {!item.is_work && (
                              <Row>
                                <Circle isWork={item.is_work} />
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

      <BottomMenu isShowMenu={isShowMenu} border />
      <SlideSideMenu isShowMenu={isShowMenu} />
      {isLoading && (
        <LoaderWrapper style={{ height: window.innerHeight }}>
          <Loader />
        </LoaderWrapper>
      )}
    </div>
  );
};

export default MapComponent;
