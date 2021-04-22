import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./Map.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { renderToStaticMarkup } from "react-dom/server";
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
    border-bottom: 0;
    position: relative;
    bottom: 0;
    left: 65px;
    border-top-color: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
    @media (max-width: 760px) {
      bottom: 0;
      left: 50px;
    }
  `,
  MarkerWrapp = styled.div`
    width: 150px;
    height: 150px;
    background-color: #fff;
    overflow: hidden !important;
    border-radius: 10px !important;
    transition: 0.3s ease opacity;
    &:hover {
      opacity: 1;
    }
    @media (max-width: 760px) {
      width: 120px;
      height: 120px;
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
      height: 80px;
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
    border-radius: 10px;
    @media (max-width: 760px) {
      height: 80px;
      width: 120px;
      border-radius: 5px;
    }
  `,
  NoTranslation = styled.p`
    border-radius: 10px;
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
      height: 80px;
      text-align: center;
      width: 120px;
    }
  `,
  MarkerDesc = styled.p`
    position: relative;
    padding: 4px;
    padding-top: 4px;
    padding-right: 6px;
    padding-left: 15px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-bottom-right-radius: 10px;
    @media (max-width: 760px) {
      padding: 2px;
    }
  `,
  MarkerName = styled.p`
    color: #000;
    font-weight: 700;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 19px;
    margin-left: 5px;
    @media (max-width: 760px) {
      margin-top: -1px;
      font-size: 14px;
    }
  `,
  BottomMarkerText = styled.p`
    display: flex;
    justify-content: space-between;
    line-height: 16px;
    padding: 2px;
    @media (max-width: 760px) {
      margin-top: -6px;
    }
  `,
  IsOpened = styled.span`
    color: #9d9d9d;
    font-size: 14px;
    /* line-height: 14px; */
    font-weight: 500;
    line-height: 9px;
    @media (max-width: 760px) {
      font-size: 11px;
      line-height: 11px;
    }
  `,
  IsOpenedText = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #9d9d9d;
    margin-left: 7px;
    @media (max-width: 760px) {
      font-weight: 700;
      font-size: 11px;
      color: #bababa;
      margin-top: 2px;
    }
  `,
  Row = styled.div`
    display: flex;
    align-items: center;
  `,
  Circle = styled.div`
    width: 7px;
    height: 7px;
    background: ${({ isWork }) => (isWork ? "#04b000" : " #C4C4C4")};
    border-radius: 50%;
    margin-right: 5px;
    margin-left: 8px;
    @media (max-width: 760px) {
      margin-top: 3px;
    }
  `,
  Opened = styled.span`
    /* display: inline-block; */
    @media (max-width: 760px) {
      display: none;
    }
  `;

const CustomMarker = ({ place }) => (
  <div style={{ width: 0, height: 0 }}>
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
                ? `${queryPath}/storage/` + place.profile_image
                : ""
            }
          />
        )}

        {place.mobile_stream && (
          <TranslationBlock
            style={{
              backgroundImage: `url(https://ms1.partylive.by/hls/show/${place.id}/image.jpg)`,
            }}
          />
        )}
      </PreviewBlock>

      <MarkerDesc>
        <div style={{ display: "flex", padding: "0 5px" }}>
          {place.categories[0] && place.categories[0].slug && (
            <CustomImgStyle
              className="qwe"
              alt="Icon"
              name={place.categories[0].slug + "_map"}
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
                <IsOpenedText>
                  До{" "}
                  {place.currentScheduleInterval.end_time
                    .split(" ")[1]
                    .split(":")
                    .slice(0, 2)
                    .join(":")}
                </IsOpenedText>
              </Row>
            )}

            {!place.is_work && (
              <Row>
                <Circle isWork={place.is_work} />
                <IsOpenedText>Закрыто</IsOpenedText>
              </Row>
            )}
          </IsOpened>
        </BottomMarkerText>
      </MarkerDesc>
    </MarkerWrapp>
    <MarkerArrow isWork={place.is_work} />
  </div>
);

const MapComponent = (props) => {
  const [markers, setMarkers] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [typeId, setTypeId] = useState(""),
    [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false),
    [mapRef, setMapRef] = useState(null),
    [isRedirect, setIsRedirect] = useState(false);

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
    },
    clickedType = (id) => {
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
    },
    dancerClick = (target) => {
      target.previousSibling.style.opacity = 1;
      setTimeout(() => {
        target.previousSibling.style.opacity = 0;
      }, 2000);
    },
    hide = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
        hideSideMenu();
    },
    markerClick = (place) => {
      sessionStorage.setItem("prevZoom", mapRef._zoom);
      sessionStorage.setItem(
        "prevCenter",
        JSON.stringify({ lat: place.lat, lng: place.lon })
      );
      setIsRedirect(place.id);
    };

  console.log(markers, "----markers");

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    window.onresize = (e) => hideSideMenu();
  });

  useEffect(() => {
    console.log(mapRef, "_REF");
    if (mapRef)
      mapRef._onResize = (e) => {
        console.log(e);
      };
    if (sessionStorage.getItem("prevCenter") && mapRef) {
      const { lat, lng } = JSON.parse(sessionStorage.getItem("prevCenter")),
        prevZoom = +sessionStorage.getItem("prevZoom");

      mapRef.setView([lat, lng], prevZoom, {
        animate: false,
        pan: {
          duration: 0,
        },
      });
    }
  }, [mapRef]);

  const SwipePageSpring = useSpring({
    left: isShowMenu ? -200 : 0,
    config: { duration: 200 },
  });

  if (isRedirect) {
    return <Redirect push to={`/company/${isRedirect}`} />;
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
            opacity={true}
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
            whenCreated={(mapInstance) => setMapRef(mapInstance)}
            style={{ height: "125%", top: "-80px" }}
            zoom={12}
            maxNativeZoom={19}
            maxZoom={41}
            center={[53.904577, 27.557328]}
          >
            <TileLayer
              opacity={1}
              maxNativeZoom={19}
              zoom={12}
              maxZoom={41}
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MarkerClusterGroup
              showCoverageOnHover={false}
              maxClusterRadius={100}
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
                  eventHandlers={{
                    click: (e) => markerClick(place),
                  }}
                  icon={L.divIcon({
                    html: renderToStaticMarkup(
                      <CustomMarker place={place} props={props} />
                    ),
                    iconAnchor: [
                      window.innerWidth < 760 ? 60 : 75,
                      window.innerWidth < 760 ? 140 : 160,
                    ],
                    iconSize: [
                      window.innerWidth < 760 ? 120 : 150,
                      window.innerWidth < 760 ? 130 : 150,
                    ],
                    popupAnchor: null,
                    shadowSize: [0, 0],
                  })}
                  position={[place.lat, place.lon]}
                />
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </Container>

        <BottomMenu isShowMenu={isShowMenu} border />
        <SlideSideMenu isShowMenu={isShowMenu} />
        {isLoading && <Loader />}
      </div>
    );
  }
};

export default MapComponent;
