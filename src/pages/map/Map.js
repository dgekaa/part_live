import React, { useState, useRef, useEffect } from "react";
import GooggleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import { Link } from "react-router-dom";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Header from "../../components/header/Header";

import { EN_SHORT_TO_RU_LONG, EN_SHORT_TO_RU_LONG_V_P } from "../../constants";
import QUERY from "../../query";
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { API_KEY } from "../../constants";

import { styles } from "../../components/googleMap/GoogleMapStyles";
import "./map.css";

import TypeNav from "../../components/typeNav/TypeNav";
import CompanyNav from "../../components/companyNav/CompanyNav";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Loader from "../../components/loader/Loader";

const Marker = ({ children }) => children;

const createMapOptions = maps => {
  return { styles: styles };
};

const MapComponent = props => {
  const [DATA, setDATA] = useState([]);

  const [markers, setMarkers] = useState([]);

  const mapRef = useRef();
  const [zoom, setZoom] = useState(11);
  const [bounds, setBounds] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    QUERY({
      query: `query{
        places{id name coordinates
          streams{url name id preview
            schedules{id day start_time end_time}
          }
          schedules{id day start_time end_time}
          categories{id name slug}}
        }`
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setIsLoading(false);
        setMarkers(data.data.places);
        setDATA(data.data.places);
      })
      .catch(err => {
        console.log(err, "  ERR");
      });
  }, []);

  const points = markers.map((el, i) => {
    return {
      type: "Feature",
      item: el,
      properties: {
        cluster: false,
        crimeId: i,
        category: el.categories[0].name
      },
      geometry: {
        type: "Point",
        coordinates: [
          +el.coordinates.split(",")[1],
          +el.coordinates.split(",")[0]
        ]
      }
    };
  });

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 170,
      maxZoom: 20
    }
  });

  const clickedType = type => {
    if (type) {
      const filteredData = DATA.filter(
        el => el.categories[0].name.toUpperCase() === type.toUpperCase()
      );
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

  window.onresize = function(e) {
    hideSideMenu();
  };

  const [defaultCenter, setDefaultCenter] = useState();

  if (navigator.geolocation && !defaultCenter) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setDefaultCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      err => {
        console.log(err, " GEOLOCATION ERROR");
      }
    );
  } else {
    console.log("Геолокация недоступна");
  }

  return (
    <div
      onClick={e => {
        if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
          hideSideMenu();
        }
      }}
    >
      <Header
        logo
        arrow
        burger
        toSlideFixedHeader={isShowMenu}
        showSlideSideMenu={showSlideSideMenu}
        showSideMenu={showSideMenu}
      />
      <div className="navContainerMap">
        <CompanyNav
          style={{ zIndex: 1 }}
          currentPage="/map"
          clickedType={clickedType}
        />
        <TypeNav style={{ zIndex: 1 }} />
      </div>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="mapContainer">
          <GooggleMapReact
            options={createMapOptions}
            style={{
              height: "100%",
              width: "100%"
            }}
            bootstrapURLKeys={{
              key: API_KEY
            }}
            defaultCenter={
              defaultCenter || {
                lat: 53.904577,
                lng: 27.557328
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
                bounds.nw.lat
              ]);
            }}
          >
            {defaultCenter && (
              <Marker lat={defaultCenter.lat} lng={defaultCenter.lng}>
                <img
                  alt="me"
                  style={{ height: "32px", width: "32px" }}
                  src={`${process.env.PUBLIC_URL}/img/dancer.png`}
                  className="eye"
                />
              </Marker>
            )}

            {clusters.map(cluster => {
              const [longitude, latitude] = cluster.geometry.coordinates;
              const {
                cluster: isCluster,
                point_count: pointCount
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

              const setShowStream = time => {
                streamTime = time;
              };
              const setWorkTime = time => {
                workTime = time;
              };
              const setIsWork = bool => {
                isWork = bool;
              };
              const setNextStreamTime = time => {
                nextStreamTime = time;
              };

              isShowStreamNow(cluster.item, setShowStream, setNextStreamTime);
              isWorkTimeNow(cluster.item, setWorkTime, setIsWork);

              return (
                <Marker
                  key={cluster.properties.crimeId}
                  lat={latitude}
                  lng={longitude}
                >
                  <Link
                    to={{
                      pathname: `/company/${cluster.item.id}`
                    }}
                  >
                    <div className="mapMarkerWrap">
                      <div className="mapMarker">
                        {!!streamTime && (
                          <video
                            className="companyImg1"
                            src={cluster.item.streams[0].preview}
                            autoPlay
                          />
                        )}
                        {!streamTime && (
                          <div
                            className="companyImg1"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <p
                              style={{
                                color: "#fff",
                                textAlign: "center",
                                padding: "3px"
                              }}
                            >
                              {nextStreamTime.start_time &&
                                "Начало трансляции в " +
                                  EN_SHORT_TO_RU_LONG_V_P[nextStreamTime.day] +
                                  " в " +
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
        </div>
      )}

      <BottomMenu toSlideFixedBottomMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default MapComponent;
