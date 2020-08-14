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
import { isShowStreamNow, isWorkTimeNow } from "../../calculateTime";
import { getDistanceFromLatLonInKm } from "../../getDistance";
import QUERY from "../../query";
import {
  DAY_OF_WEEK,
  EN_SHORT_TO_RU_LONG_V_P,
  queryPath,
} from "../../constants";
import { defaultColor } from "../../constants";

import "./company.css";

const GoBackBtnD = styled(Link)`
  font-size: 16px;
  display: block;
  font-weight: normal;
  height: 100px;
  width: 150px;
  line-height: 100px;
  &:hover {
    color: ${defaultColor};
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
  flex: 1;
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
  position: relative;
  border-radius: 10px;
  display: flex;
  background: #000;
  height: 300px;
  margin-bottom: 10px;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  overflow: hidden;
`;
const NoVideoBgTransparentD = styled.div`
  display: flex;
  position: absolute;
  top: 0%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #eee;
  font-weight: 400;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  text-align: center;
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
  flex: 1;
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
  margin-left: -1px;
`;

const CompanyTypeRowD = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;
const CustomImgTypeD = styled(CustomImg)`
  margin-right: 6px;
`;

const CompanyTypeD = styled.div`
  font-weight: 500;
  font-size: 20px;
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
  padding-bottom: 30px;
`;

const VideoBlockM = styled.div`
  padding-right: 0px;
  padding-bottom: 0;
  border-radius: 10px;
`;

const YesVideoM = styled.div`
  /* height: 250px; */
  margin-bottom: 5px;
  background-color: #000;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s ease all;
  @media (max-width: 460px) {
    /* height: 175px; */
  }
`;

const NoVideoM = styled.div`
  position: relative;
  height: 350px;
  text-align: center;
  border-radius: 10px;
  display: flex;
  background: #000;
  margin-bottom: 10px;
  transition: 0.3s ease all;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  @media (max-width: 460px) {
    height: 200px;
  }
`;

const NoVideoBgTransparentM = styled.div`
  display: flex;
  position: absolute;
  top: 0%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #eee;
  font-weight: 400;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const DescM = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

const NameRowM = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const WithIconBlockM = styled.div`
  display: flex;
  flex-direction: row;
`;
const DescIconsColumnM = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const DescNoIconsColumnM = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NameM = styled.span`
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.5px;
  color: #000000;
`;

const CompanyTypeM = styled.div`
  font-weight: normal;
  font-size: 14px;
  letter-spacing: 0.5px;
  padding: 8px 0 3px 0;
  display: flex;
  align-items: center;
`;

const CustomImgTypeM = styled(CustomImg)`
  margin-right: 5px;
`;

const OpenedToM = styled.p`
  display: block;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.5px;
  color: #000;
  height: 25px;
  line-height: 25px;
  text-transform: lowercase;
`;

const CircleM = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 7px;
  background-color: ${({ isWork }) => (isWork ? "#04B000" : "#6D6D6D")};
  margin-right: 6px;
`;

const SmallMapWrapM = styled.div`
  position: relative;
  height: 200px;
  display: block;
  opacity: 1;
  background-color: #fff;
  @media (max-width: 500px) {
    height: 100px;
  }
`;

const SmallMapM = styled.div`
  display: block;
  border: none;
  margin-top: 0px;
  overflow: hidden;
  height: 185px;
  border-radius: 5px;
  @media (max-width: 500px) {
    height: 90px;
  }
`;

const SmallMapLocationM = styled.p`
  display: flex;
  color: #000000;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 8px;
  height: 30px;
`;

const SmallMapTransparentBg = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: calc(100% + 10px);
  background: transparent;
  cursor: pointer;
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
  const [ismobileStream, setIsmobileStream] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("uniqueCompanyType")) {
      sessionStorage.setItem("uniqueCompanyType", "");
    }
  }, []);

  const dateNow = new Date()
    .toLocaleDateString()
    .split(".")
    .reverse()
    .join("-");

  useEffect(() => {
    if (DATA) {
      isShowStreamNow(
        DATA.place,
        setShowStream,
        setNextStreamTime,
        DATA.place.streams &&
          DATA.place.streams[0] &&
          dateNow === DATA.place.streams[0].see_you_tomorrow
      );
      isWorkTimeNow(DATA.place, setWorkTime, setIsWork);
    }
  }, [DATA]);

  useEffect(() => {
    QUERY({
      query: `query {
        place (id: ${props.match.params.id}) {
          id name address description profile_image mobile_stream
          streams{url name id preview see_you_tomorrow schedules{id day start_time end_time}}
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
      return "Заведение закрыто";
    }
  };

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  const updateIsMobileStreaming = () => {
    if (DATA && DATA.place) {
      fetch(
        `https://partylivestream.web4net.ru:8080/hls/show/${DATA.place.id}.m3u8`
      )
        .then((res) => setIsmobileStream(res.ok))
        .catch(() => setIsmobileStream(false));
    }
  };

  useEffect(() => {
    updateIsMobileStreaming();
  }, [DATA]);

  setInterval(() => {
    updateIsMobileStreaming();
    console.log(ismobileStream, " company___________");
  }, 5000);

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
        <GoBackBtnD to="/">
          <GoBackBtnArrowD>&#8592;</GoBackBtnArrowD>
          На главную
        </GoBackBtnD>

        {DATA && (
          <FlexD>
            <ShadowBlockD>
              <VideoBlockD>
                {showStream && !ismobileStream && (
                  <YesVideoD>
                    <VideoPlayer
                      preview={DATA.place.streams[0].preview}
                      src={DATA.place.streams[0].url}
                    />
                  </YesVideoD>
                )}
                {!showStream && !ismobileStream && (
                  <NoVideoD
                    bg={
                      DATA.place.profile_image
                        ? `${queryPath}/storage/` + DATA.place.profile_image
                        : ""
                    }
                  >
                    <NoVideoBgTransparentD>
                      {" "}
                      {whenIsTranslation()}
                    </NoVideoBgTransparentD>
                  </NoVideoD>
                )}
                {ismobileStream && (
                  <YesVideoD>
                    <VideoPlayer
                      preview={`https://partylivestream.web4net.ru:8080/hls/show/${DATA.place.id}.jpeg`}
                      src={`https://partylivestream.web4net.ru:8080/hls/show/${DATA.place.id}.m3u8`}
                    />
                  </YesVideoD>
                )}
                <VideoDescrD>
                  <VideoDescrNameD>{DATA.place.name}</VideoDescrNameD> -{" "}
                  {DATA.place.description}
                </VideoDescrD>
              </VideoBlockD>
              <DescD>
                <TopDescriptionD>
                  <DescNameD>{DATA.place.name}</DescNameD>
                  <CompanyTypeRowD>
                    <CustomImgTypeD
                      alt="ico"
                      name={
                        DATA.place.categories[0] &&
                        DATA.place.categories[0].slug
                      }
                      height="25"
                      width="25"
                    />
                    <CompanyTypeD>
                      {DATA.place.categories[0] &&
                        DATA.place.categories[0].name}
                    </CompanyTypeD>
                  </CompanyTypeRowD>
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
                      name={"location"}
                      height="16"
                      width="16"
                    />
                    <RowWithImageTextD>
                      <RowWithImageLeftTextD>Адрес: </RowWithImageLeftTextD>
                      <RowWithImageRightTextD>
                        {DATA.place.address &&
                          DATA.place.address
                            .split(",")[0]
                            .replace("улица", "ул.")
                            .replace("проспект", "пр-т.")}
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
                {showStream && !ismobileStream && (
                  <YesVideoM>
                    <VideoPlayer
                      preview={DATA.place.streams[0].preview}
                      src={DATA.place.streams[0].url}
                    />
                  </YesVideoM>
                )}
                {!showStream && !ismobileStream && (
                  <NoVideoM
                    bg={
                      DATA.place.profile_image
                        ? `${queryPath}/storage/` + DATA.place.profile_image
                        : ""
                    }
                  >
                    <NoVideoBgTransparentM>
                      {whenIsTranslation()}
                    </NoVideoBgTransparentM>
                  </NoVideoM>
                )}
                {ismobileStream && (
                  <YesVideoM>
                    <VideoPlayer
                      preview={`https://partylivestream.web4net.ru:8080/hls/show/${DATA.place.id}.jpeg`}
                      src={`https://partylivestream.web4net.ru:8080/hls/show/${DATA.place.id}.m3u8`}
                    />
                  </YesVideoM>
                )}
              </VideoBlockM>
              <DescM>
                <NameRowM>
                  <NameM>{DATA.place.name}</NameM>
                  <CustomImg alt="ico" name={"back"} height="20" width="20" />
                </NameRowM>
                <WithIconBlockM>
                  <DescIconsColumnM>
                    <CustomImgTypeM
                      alt="ico"
                      name={
                        DATA.place.categories[0] &&
                        DATA.place.categories[0].slug
                      }
                      height="16"
                      width="16"
                    />
                    <CircleM isWork={isWork} />
                  </DescIconsColumnM>
                  <DescNoIconsColumnM>
                    <CompanyTypeM>
                      {DATA.place.categories[0] &&
                        DATA.place.categories[0].name}
                    </CompanyTypeM>
                    <OpenedToM>
                      {isWork && (
                        <span>Открыто: до {workTime.split("-")[1]}</span>
                      )}
                      {!isWork && "закрыто"}
                    </OpenedToM>
                  </DescNoIconsColumnM>
                </WithIconBlockM>

                <SmallMapWrapM>
                  <SmallMapLocationM>
                    <CustomImgTypeM
                      alt="ico"
                      name={"location"}
                      height="16"
                      width="16"
                    />
                    {DATA
                      ? DATA.place.address
                          .split(",")[0]
                          .replace("улица", "ул.")
                          .replace("проспект", "пр-т.")
                      : ""}
                  </SmallMapLocationM>
                  <SmallMapM
                    onMouseDown={mouseDownMapHandler}
                    onMouseUp={mouseUpMapHandler}
                  >
                    <GoogleMap
                      togglePopupGoogleMap={togglePopup}
                      styleContainerMap={{ height: "330px" }}
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

                  <SmallMapTransparentBg
                    onClick={() => togglePopup()}
                  ></SmallMapTransparentBg>
                </SmallMapWrapM>
              </DescM>
            </ShadowBlockM>
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
