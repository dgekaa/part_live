import React, { useState, useRef, useEffect, PureComponent } from "react";
import PropTypes from "prop-types";
import { Redirect, Link } from "react-router-dom";

import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MapContainer, TileLayer, useMap, MapConsumer } from "react-leaflet";
import Marker from "react-leaflet-enhanced-marker";
import L from "leaflet";
// import { debounce } from "lodash";
import countries from "./countries.json";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./Map.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

import CustomImg from "../../components/customImg/CustomImg";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";
import { queryPath, PLACES_EXT_DATA_QUERY } from "../../constants";
import QUERY from "../../query";
import TypeNav from "../../components/typeNav/TypeNav";
import CompanyNav from "../../components/companyNav/CompanyNav";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";

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
  Container = styled.div`
    position: fixed;
    top: 0;
    width: 130%;
    height: 120vh;
    margin-left: -15%;
    @media (max-width: 760px) {
      position: fixed;
      top: 105px;
      height: calc(100% - 30px);
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
  MarkerArrow = styled.div`
    width: 0;
    height: 0;
    margin: 0 auto;
    border: 10px solid transparent;
    border-top-color: #fff;
    border-bottom: 0;
    position: absolute;
    bottom: 21px;
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
    position: relative;
    padding: 6px;
    padding-top: 4px;
    padding-right: 6px;
    padding-left: 15px;

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
    margin-left: 8px;
    margin-top: 5px;
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

const CustomMarker = ({ place, props }) => (
  <>
    <MarkerArrow />
    <MarkerWrapp>
      <PreviewBlock>
        {place.streams &&
          place.streams[0] &&
          place.streams[0].preview &&
          !!place.is_online &&
          !place.mobile_stream && (
            <TranslationBlock
              style={{
                backgroundImage: `url(${place.streams[0].preview})`,
              }}
            />
          )}
        {!place.is_online && !place.mobile_stream && (
          <NoTranslation
            bg={
              place.profile_image
                ? `${queryPath}/storage/` +
                  place.profile_image.replace(".png", ".jpg")
                : ""
            }
          />
        )}

        {/* {place.mobile_stream && (
              <TranslationBlock
                style={{
                  backgroundImage: `url(https://ms1.partylive.by/hls/show/${cluster.item.id}/image.jpg)`,
                }}
              />
            )} */}
      </PreviewBlock>

      <MarkerDesc>
        <div style={{ display: "flex", padding: "0 5px" }}>
          {place.categories[0] && place.categories[0].slug && (
            <CustomImgStyle
              className="qwe"
              alt="Icon"
              name={place.categories[0].slug}
              width="16"
              height="16"
            />
          )}
          <MarkerName>{place.name}</MarkerName>
        </div>

        <BottomMarkerText>
          <IsOpened>
            {place.is_work && (
              <Row>
                <Circle isWork={place.is_work} />
                <span>
                  <Opened>Открыто</Opened> до{" "}
                  {place.currentScheduleInterval.end_time
                    .split(" ")[1]
                    .split(":")
                    .slice(0, 2)
                    .join(":")}
                </span>
              </Row>
            )}

            {!place.is_work && (
              <Row>
                <Circle isWork={place.is_work} />
                <span>Закрыто</span>
              </Row>
            )}
          </IsOpened>
        </BottomMarkerText>
      </MarkerDesc>
    </MarkerWrapp>
  </>
);

const MapComponent = (props) => {
  const mapRef = useRef();

  const [markers, setMarkers] = useState([]),
    [zoom, setZoom] = useState(12),
    [isLoading, setIsLoading] = useState(true),
    [currentCenterOfMap, setCurrentCenterOfMap] = useState(),
    [defaultCenter, setDefaultCenter] = useState(),
    [gMapDefaultCenter, setGMapDefaultCenter] = useState(),
    [typeId, setTypeId] = useState(""),
    [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false);

  const loadContent = (id, loaderDelete) => {
    const current_id = id || sessionStorage.getItem("filter_id"),
      searchString = current_id
        ? ` first : 180,
        where: {
          AND : [{ column: CATEGORY_IDS, operator: LIKE, value: "%[${current_id}]%"}]
        }`
        : ` first : 180`;

    !loaderDelete && setIsLoading(true);
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

  useEffect(() => {
    loadContent();
  }, []);

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
    hide = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
        hideSideMenu();
    };

  const [isRedirect, setIsRedirect] = useState(false);

  if (isRedirect) {
    return <Redirect to={`/company/${isRedirect}`} />;
  } else {
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

        <Container as={animated.div} style={SwipePageSpring}>
          <MapContainer
            className="markercluster-map"
            style={{ height: "100%" }}
            zoom={+sessionStorage.getItem("prevZoom") || 12}
            // maxZoom={20}
            center={
              gMapDefaultCenter
                ? [gMapDefaultCenter.lat, gMapDefaultCenter.lng]
                : [53.904577, 27.557328]
            }
          >
            <TileLayer
              opacity={0.8}
              maxZoom={20}
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=b749b5a5506045238983e5c7ebba195b"
              // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              // https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
              // https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
              // url="https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=b749b5a5506045238983e5c7ebba195b"
            />
            <MarkerClusterGroup
              showCoverageOnHover={false}
              maxClusterRadius={145}
              spiderLegPolylineOptions={{
                weight: 0,
                opacity: 0,
              }}
              spiderfyOnMaxZoom={true}
              spiderfyDistanceMultiplier={5}
            >
              {markers.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lon]}
                  eventHandlers={{
                    click: (e) => {
                      console.log("marker clicked", e);
                      console.log(place, "---place");

                      setIsRedirect(place.id);
                    },
                  }}
                  icon={
                    <CustomMarker place={place} props={props} />
                    // <Link
                    //   //  onClick={() => markerClick()}
                    //   //  onMouseDown={(e) => markerMouseDown(e)}
                    //   //  onMouseUp={(e) => markerMouseUp(e, cluster)}
                    //   //  onTouchStart={(e) => onTouchStart(e, cluster)}
                    //   //  onTouchEnd={(e) => onTouchEnd(e, cluster)}
                    //   // to={`/company/${place.id}`}
                    //   to={{
                    //     pathname: `/company/${place.id}`,
                    //   }}
                    // >
                    //   <CustomMarker place={place} />
                    // </Link>
                  }
                />
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </Container>

        <BottomMenu isShowMenu={isShowMenu} border />
        <SlideSideMenu isShowMenu={isShowMenu} />
        {isLoading && (
          <LoaderWrapper style={{ height: window.innerHeight }}>
            <Loader />
          </LoaderWrapper>
        )}
      </div>
    );
  }
};

export default MapComponent;
