import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

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

const GoBackBtnD = styled(Link)`
  font-size: 16px;
  display: block;
  font-weight: normal;
  height: 100px;
  width: 150px;
  line-height: 100px;
  &:hover {
    color: #e32a6c;
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

const GoBackBtnArrowD = styled.span`
  font-size: 18px;
  padding-right: 5px;
`;

const CompanyD = styled.div`
  width: 1000px;
  margin: 0 auto;
  @media (max-width: 760px) {
    display: none;
  }
`;

const FlexD = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
`;

const ShadowBlockD = styled.div`
  display: flex;
  flex: 1;
  box-shadow: none;
`;

const VideoBlockD = styled.div`
  -webkit-box-flex: 5;
  -ms-flex: 5;
  flex: 5;
  padding-bottom: 20px;
  padding-right: 20px;
`;

const YesVideoD = styled.div`
  height: 300px;
  margin-bottom: 5px;
  background-color: #000;
  border-radius: 10px;
  overflow: hidden;
`;

const NoVideoD = styled.div`
  text-align: center;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #000;
  height: 300px;
  margin-bottom: 10px;
`;

const VideoDescrD = styled.p`
  margin-top: 30px;
  font-size: 16px;
  line-height: 24px;
  color: #4f4f4f;
`;

const VideoDescrNameD = styled.span`
  font-weight: 700;
`;

const DescD = styled.span`
  -webkit-box-flex: 5;
  -ms-flex: 5;
  flex: 4;
  padding: 0 5px 0 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopDescriptionD = styled.div`
  font-size: 1em;
  font-weight: 300;
  line-height: 1.5;
`;

const DescNameD = styled.h3`
  font-weight: 700;
  font-size: 30px;
  line-height: 35px;
`;

const TypeOfPartyD = styled.p`
  font-size: 18px;
  line-height: 21px;
  padding: 2px 0 4px 0;
  font-weight: 500;
  color: #4f4f4f;
`;

const DayOfWeekD = styled.p`
  text-transform: uppercase;
  display: inline-block;
  padding: 0 10px;
  height: 22px;
  background: #36cc33;
  border-radius: 5px;
  color: #fff;
  font-weight: 700;
  font-size: 10px;
  line-height: 22px;
`;

const RowWithImageD = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #4f4f4f;
`;

const CustomImgStyleD = styled(CustomImg)`
  margin-right: 16px;
`;

const RowWithImageTextD = styled.p`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
`;

const RowWithImageLeftTextD = styled.span`
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 2;
`;

const RowWithImageRightTextD = styled.span`
  margin-left: 10px;
  -webkit-box-flex: 3;
  -ms-flex: 3;
  flex: 3;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
`;

const SmallMapD = styled.div`
  border: 1px solid #747474;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 85px;
`;

const CompanyTypeD = styled.div`
  color: #e32a6c;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  padding-left: 30px;
`;

const CompanyM = styled.div`
  display: none;
  @media (max-width: 760px) {
    display: block;
    padding: 0;
    margin-bottom: 100px;
    position: relative;
  }
`;

const FlexM = styled.div`
  display: block;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  margin: 10px;
  padding-top: 55px;
`;

const ShadowBlockM = styled.div`
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
`;

const VideoBlockM = styled.div`
  padding-right: 0px;
  padding-bottom: 0;
`;

const YesVideoM = styled.div`
  height: 300px;
  margin-bottom: 5px;
  background-color: #000;
  border-radius: 10px;
  overflow: hidden;
`;

const NoVideoM = styled.div`
  text-align: center;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #000;
  height: 300px;
  margin-bottom: 10px;
`;

const DescM = styled.div`
  -webkit-box-flex: 5;
  -ms-flex: 5;
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
  height: 45px;
`;

const DescriptionM = styled.div`
  display: flex;
  height: 20px;
  justify-content: space-between;
`;

const DistanceM = styled.p`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.05em;
  color: #e32a6c;
  padding-bottom: 5px;
`;

const OpenedToM = styled.p`
  display: block;
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #219704;
  height: 25px;
  line-height: 25px;
`;

const SmallMapWrapM = styled.div`
  height: 200px;
  display: block;
  opacity: 1;
  background-color: #fff;
  border-radius: 5px;
  @media (max-width: 500px) {
    height: 160px;
  }
`;

const SmallMapM = styled.div`
  display: block;
  border: none;
  margin-top: 10px;
  border-radius: 5px;
  overflow: hidden;
  height: 200px;
  @media (max-width: 500px) {
    height: 160px;
  }
`;

const SmallMapLocationM = styled.p`
  display: block;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: #000000;
  padding: 12px 9px;
`;

const Company = (props) => {
  const [showPopup, setShowPopap] = useState(false);
  const [DATA, setDATA] = useState(null);
  const [showStream, setShowStream] = useState(false);
  const [nextStreamTime, setNextStreamTime] = useState(false);
  const [workTime, setWorkTime] = useState(false);
  const [isWork, setIsWork] = useState(false);
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
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

  useEffect(() => {
    window.onresize = function (e) {
      hideSideMenu();
    };
  });

  useEffect(() => {
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
        (err) => console.log(err, "ошибка геолокации")
      );
    } else {
      console.log("Геолокация недоступна ");
    }
  }, []);

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

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
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

      {/* _______________________________________ DESCTOP */}

      <CompanyD
        as={animated.div}
        style={SwipePageSpring}
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
            hideSideMenu();
        }}
      >
        <GoBackBtnD to="/home">
          <GoBackBtnArrowD>&#8592;</GoBackBtnArrowD>
          На главную
        </GoBackBtnD>

        {DATA && (
          <FlexD>
            <ShadowBlockD>
              <VideoBlockD>
                {showStream && (
                  <YesVideoD>
                    <VideoPlayer
                      preview={DATA.place.streams[0].preview}
                      src={DATA.place.streams[0].url}
                    />
                  </YesVideoD>
                )}
                {!showStream && <NoVideoD>{whenIsTranslation()}</NoVideoD>}
                <VideoDescrD>
                  <VideoDescrNameD>{DATA.place.name}</VideoDescrNameD> -{" "}
                  {DATA.place.description}
                </VideoDescrD>
              </VideoBlockD>
              <DescD>
                <TopDescriptionD>
                  <DescNameD>{DATA.place.name}</DescNameD>
                  <TypeOfPartyD>"Супер пати всех студентов"</TypeOfPartyD>
                  <DayOfWeekD>{DAY_OF_WEEK[numberDayNow]}</DayOfWeekD>
                </TopDescriptionD>

                <div>
                  <RowWithImageD>
                    <CustomImgStyleD
                      alt="clock"
                      name={"clock"}
                      height="16"
                      width="16"
                    />
                    <RowWithImageTextD>
                      <RowWithImageLeftTextD>
                        Время работы:
                      </RowWithImageLeftTextD>
                      <RowWithImageRightTextD>
                        {workTime || "Выходной"}
                      </RowWithImageRightTextD>
                    </RowWithImageTextD>
                  </RowWithImageD>
                  <RowWithImageD>
                    <CustomImgStyleD
                      alt="camera"
                      name={"camera"}
                      height="16"
                      width="16"
                    />
                    <RowWithImageTextD>
                      <RowWithImageLeftTextD> Стрим:</RowWithImageLeftTextD>
                      <RowWithImageRightTextD>
                        {showStream ? " Стрим идет" : " Стрим не идет"}
                      </RowWithImageRightTextD>
                    </RowWithImageTextD>
                  </RowWithImageD>
                  <RowWithImageD>
                    <CustomImgStyleD
                      alt="location"
                      name={"location1"}
                      height="16"
                      width="16"
                    />
                    <RowWithImageTextD>
                      <RowWithImageLeftTextD>Адрес: </RowWithImageLeftTextD>
                      <RowWithImageRightTextD>
                        {DATA.place.address}
                      </RowWithImageRightTextD>
                    </RowWithImageTextD>
                  </RowWithImageD>
                </div>

                <SmallMapD
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
                </SmallMapD>
              </DescD>
              <CompanyTypeD>
                {DATA.place.categories[0] && DATA.place.categories[0].name}
              </CompanyTypeD>
            </ShadowBlockD>
          </FlexD>
        )}
      </CompanyD>

      {/* ________________________________ MOBILE */}

      <CompanyM
        as={animated.div}
        style={SwipePageSpring}
        onClick={(e) => {
          if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
            hideSideMenu();
        }}
      >
        {DATA && (
          <FlexM>
            <ShadowBlockM>
              <VideoBlockM>
                {showStream && (
                  <YesVideoM>
                    <VideoPlayer
                      preview={DATA.place.streams[0].preview}
                      src={DATA.place.streams[0].url}
                    />
                  </YesVideoM>
                )}
                {!showStream && <NoVideoM>{whenIsTranslation()}</NoVideoM>}
              </VideoBlockM>
              <DescM>
                <DescriptionM>
                  <h3>
                    <span>
                      {DATA.place.categories[0] &&
                        DATA.place.categories[0].name}{" "}
                      "
                    </span>
                    {DATA.place.name}"
                  </h3>

                  <DistanceM>
                    {curDistance && (
                      <span>{Number(curDistance).toFixed(2)} km</span>
                    )}
                    {!curDistance && " 0 km"}
                  </DistanceM>
                </DescriptionM>

                <OpenedToM>
                  {isWork && <span>Открыто: до {workTime.split("-")[1]}</span>}
                  {!isWork && "Закрыто"}
                </OpenedToM>
              </DescM>
            </ShadowBlockM>

            <SmallMapWrapM>
              <SmallMapM
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
              </SmallMapM>
              <SmallMapLocationM>
                {DATA ? DATA.place.address : ""}
              </SmallMapLocationM>
            </SmallMapWrapM>
          </FlexM>
        )}
      </CompanyM>

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
      <BottomMenu isShowMenu={isShowMenu} />
      <SlideSideMenu isShowMenu={isShowMenu} />
    </div>
  );
};

export default Company;
