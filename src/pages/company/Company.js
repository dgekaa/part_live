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
// import { getDistanceFromLatLonInKm } from "../../getDistance";
import QUERY from "../../query";
import { queryPath } from "../../constants";
import { defaultColor, PLACE_EXT_DATA_QUERY } from "../../constants";

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
  `,
  GoBackBtnArrowD = styled.span`
    font-size: 18px;
    padding-right: 5px;
  `,
  CompanyD = styled.div`
    width: 1000px;
    margin: 0 auto;
    @media (max-width: 760px) {
      display: none;
    }
  `,
  FlexD = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  `,
  ShadowBlockD = styled.div`
    display: flex;
    flex: 1;
    box-shadow: none;
  `,
  VideoBlockD = styled.div`
    -webkit-box-flex: 5;
    -ms-flex: 5;
    flex: 1;
    padding-bottom: 20px;
    padding-right: 20px;
  `,
  YesVideoD = styled.div`
    height: 300px;
    margin-bottom: 5px;
    background-color: #000;
    border-radius: 10px;
    overflow: hidden;
  `,
  NoVideoD = styled.div`
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
  `,
  NoVideoBgTransparentD = styled.div`
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
  `,
  VideoDescrD = styled.p`
    margin-top: 30px;
    font-size: 16px;
    line-height: 24px;
    color: #4f4f4f;
  `,
  VideoDescrNameD = styled.span`
    font-weight: 700;
  `,
  DescD = styled.span`
    flex: 1;
    padding: 0 5px 0 20px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  TopDescriptionD = styled.div`
    font-size: 1em;
    font-weight: 300;
    line-height: 1.5;
  `,
  DescNameD = styled.h3`
    font-weight: 700;
    font-size: 30px;
    line-height: 35px;
    margin-left: -1px;
  `,
  CompanyTypeRowD = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
  `,
  CustomImgTypeD = styled(CustomImg)`
    margin-right: 6px;
  `,
  CompanyTypeD = styled.div`
    font-weight: 500;
    font-size: 20px;
  `,
  RowWithImageD = styled.div`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
    font-weight: 500;
    color: #4f4f4f;
  `,
  CustomImgStyleD = styled(CustomImg)`
    margin-right: 16px;
  `,
  RowWithImageTextD = styled.p`
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
  `,
  RowWithImageLeftTextD = styled.span`
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 2;
  `,
  RowWithImageRightTextD = styled.span`
    margin-left: 10px;
    -webkit-box-flex: 3;
    -ms-flex: 3;
    flex: 3;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
  `,
  SmallMapD = styled.div`
    border: 1px solid #747474;
    overflow: hidden;
    cursor: pointer;
    width: 100%;
    height: 85px;
  `,
  CompanyM = styled.div`
    display: none;
    @media (max-width: 760px) {
      display: block;
      padding: 0;
      margin-bottom: 100px;
      position: relative;
    }
  `,
  FlexM = styled.div`
    display: block;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin: 10px;
    padding-top: 55px;
  `,
  ShadowBlockM = styled.div`
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding-bottom: 30px;
  `,
  VideoBlockM = styled.div`
    padding-right: 0px;
    padding-bottom: 0;
    border-radius: 10px;
  `,
  YesVideoM = styled.div`
    /* height: 250px; */
    margin-bottom: 5px;
    background-color: #000;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.3s ease all;
    @media (max-width: 460px) {
      /* height: 175px; */
    }
  `,
  NoVideoM = styled.div`
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
  `,
  NoVideoBgTransparentM = styled.div`
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
  `,
  DescM = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  `,
  NameRowM = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  WithIconBlockM = styled.div`
    display: flex;
    flex-direction: row;
  `,
  DescIconsColumnM = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  `,
  DescNoIconsColumnM = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  NameM = styled.span`
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    letter-spacing: 0.5px;
    color: #000000;
  `,
  CompanyTypeM = styled.div`
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.5px;
    padding: 8px 0 3px 0;
    display: flex;
    align-items: center;
  `,
  CustomImgTypeM = styled(CustomImg)`
    margin-right: 5px;
  `,
  OpenedToM = styled.p`
    display: block;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.5px;
    color: #000;
    height: 25px;
    line-height: 25px;
    text-transform: lowercase;
  `,
  CircleM = styled.span`
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 7px;
    background-color: ${({ isWork }) => (isWork ? "#04B000" : "#6D6D6D")};
    margin-right: 6px;
  `,
  SmallMapWrapM = styled.div`
    position: relative;
    height: 200px;
    display: block;
    opacity: 1;
    background-color: #fff;
    @media (max-width: 500px) {
      height: 100px;
    }
  `,
  SmallMapM = styled.div`
    display: block;
    border: none;
    margin-top: 0px;
    overflow: hidden;
    height: 185px;
    border-radius: 5px;
    @media (max-width: 500px) {
      height: 90px;
    }
  `,
  SmallMapLocationM = styled.p`
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
  `,
  SmallMapTransparentBg = styled.div`
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    height: calc(100% + 10px);
    background: transparent;
    cursor: pointer;
  `;

const Company = (props) => {
  const [showPopup, setShowPopap] = useState(false),
    [DATA, setDATA] = useState(null),
    [showSlideSideMenu, setShowSlideSideMenu] = useState(false),
    [isShowMenu, setIsShowMenu] = useState(false),
    [isLoading, setIsLoading] = useState(true),
    // [curDistance, setCurDistance] = useState(null),
    [mouseMapCoordinates, setMouseMapCoordinates] = useState({}),
    [ismobileStream, setIsmobileStream] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("uniqueCompanyType"))
      sessionStorage.setItem("uniqueCompanyType", "");

    QUERY({
      query: `query {
        placeExt (id: ${+props.match.params.id}) {
          ${PLACE_EXT_DATA_QUERY}
        }
      }`,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setDATA(data.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err, "  ONE PLACE");
      });

    // if (navigator.geolocation && DATA) {
    //   navigator.geolocation.getCurrentPosition(
    //     (pos) => {
    //       setCurDistance(
    //         getDistanceFromLatLonInKm(
    //           pos.coords.latitude,
    //           pos.coords.longitude,
    //           DATA.placeExt.lat,
    //           DATA.placeExt.lon
    //         )
    //       );
    //     },
    //     (err) => console.log(err, "ошибка геолокации")
    //   );
    // } else {
    //   console.log("Геолокация недоступна ");
    // }
  }, []);

  useEffect(() => {
    updateIsMobileStreaming();
  }, [DATA]);

  useEffect(() => {
    window.onresize = function (e) {
      hideSideMenu();
    };
  });

  const togglePopup = () =>
      showPopup ? setShowPopap(false) : setShowPopap(true),
    hideSideMenu = () => {
      setShowSlideSideMenu(false);
      document.body.style.overflow = "visible";
      setIsShowMenu(false);
    },
    showSideMenu = () => {
      setShowSlideSideMenu(true);
      document.body.style.overflow = "hidden";
      setIsShowMenu(true);
    },
    mouseDownMapHandler = (e) => {
      setMouseMapCoordinates({
        clientX: e.clientX,
        clientY: e.clientY,
      });
    },
    mouseUpMapHandler = (e) => {
      if (
        +mouseMapCoordinates.clientX === +e.clientX &&
        +mouseMapCoordinates.clientY === +e.clientY
      ) {
        togglePopup();
      }
    },
    updateIsMobileStreaming = () => {
      if (DATA && DATA.placeExt) {
        fetch(
          `https://ms1.partylive.by/hls/show/${DATA.placeExt.id}/camera.m3u8`
        )
          .then((res) => setIsmobileStream(res.ok))
          .catch(() => setIsmobileStream(false));
      }
    },
    hide = (e) => {
      if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
        hideSideMenu();
    };

  // setInterval(() => {
  //   updateIsMobileStreaming();
  // }, 5000);

  const SwipePageSpring = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  return (
    <div onClick={(e) => hide(e)}>
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
        onClick={(e) => hide(e)}
      >
        <GoBackBtnD to="/">
          <GoBackBtnArrowD>&#8592;</GoBackBtnArrowD>
          На главную
        </GoBackBtnD>

        {DATA && (
          <FlexD>
            <ShadowBlockD>
              <VideoBlockD>
                {DATA.placeExt.is_online && !ismobileStream && (
                  <YesVideoD>
                    <VideoPlayer
                      preview={DATA.placeExt.streams[0].preview}
                      src={DATA.placeExt.streams[0].url}
                    />
                  </YesVideoD>
                )}
                {!DATA.placeExt.is_online && !ismobileStream && (
                  <NoVideoD
                    bg={
                      DATA.placeExt.profile_image
                        ? `${queryPath}/storage/` +
                          DATA.placeExt.profile_image.replace(".png", ".jpg")
                        : ""
                    }
                  />
                )}
                {ismobileStream && (
                  <YesVideoD>
                    <VideoPlayer
                      preview={`https://ms1.partylive.by/hls/show/${DATA.placeExt.id}/image.jpg`}
                      src={` https://ms1.partylive.by/hls/show/${DATA.placeExt.id}/camera.m3u8`}
                    />
                  </YesVideoD>
                )}
                <VideoDescrD>
                  <VideoDescrNameD>{DATA.placeExt.name}</VideoDescrNameD> -{" "}
                  {DATA.placeExt.description}
                </VideoDescrD>
              </VideoBlockD>
              <DescD>
                <TopDescriptionD>
                  <DescNameD>{DATA.placeExt.name}</DescNameD>
                  <CompanyTypeRowD>
                    <CustomImgTypeD
                      alt="ico"
                      name={
                        DATA.placeExt.categories[0] &&
                        DATA.placeExt.categories[0].slug
                      }
                      height="25"
                      width="25"
                    />
                    <CompanyTypeD>
                      {DATA.placeExt.categories[0] &&
                        DATA.placeExt.categories[0].name}
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
                        {DATA.placeExt.is_work || "Выходной"}
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
                        {DATA.placeExt.is_online
                          ? " Стрим идет"
                          : " Стрим не идет"}
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
                        {DATA.placeExt.address &&
                          DATA.placeExt.address
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
                      DATA.placeExt.lat
                        ? {
                            lat: Number(DATA.placeExt.lat),
                            lng: Number(DATA.placeExt.lon),
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
        onClick={(e) => hide(e)}
      >
        {DATA && (
          <FlexM>
            <ShadowBlockM>
              <VideoBlockM>
                {DATA.placeExt.is_online && !ismobileStream && (
                  <YesVideoM>
                    <VideoPlayer
                      preview={DATA.placeExt.streams[0].preview}
                      src={DATA.placeExt.streams[0].url}
                    />
                  </YesVideoM>
                )}
                {!DATA.placeExt.is_online && !ismobileStream && (
                  <NoVideoM
                    bg={
                      DATA.placeExt.profile_image
                        ? `${queryPath}/storage/` +
                          DATA.placeExt.profile_image.replace(".png", ".jpg")
                        : ""
                    }
                  />
                )}

                {ismobileStream && (
                  <YesVideoM>
                    <VideoPlayer
                      preview={`https://ms1.partylive.by/hls/show/${DATA.placeExt.id}/image.jpg`}
                      src={`https://ms1.partylive.by/hls/show/${DATA.placeExt.id}/camera.m3u8`}
                    />
                  </YesVideoM>
                )}
              </VideoBlockM>
              <DescM>
                <NameRowM>
                  <NameM>{DATA.placeExt.name}</NameM>
                  <CustomImg alt="ico" name={"back"} height="20" width="20" />
                </NameRowM>
                <WithIconBlockM>
                  <DescIconsColumnM>
                    <CustomImgTypeM
                      alt="ico"
                      name={
                        DATA.placeExt.categories[0] &&
                        DATA.placeExt.categories[0].slug
                      }
                      height="16"
                      width="16"
                    />
                    <CircleM isWork={DATA.placeExt.is_work} />
                  </DescIconsColumnM>
                  <DescNoIconsColumnM>
                    <CompanyTypeM>
                      {DATA.placeExt.categories[0] &&
                        DATA.placeExt.categories[0].name}
                    </CompanyTypeM>
                    <OpenedToM>
                      {DATA.placeExt.is_work && (
                        <span>
                          Открыто: до{" "}
                          {DATA.placeExt.currentScheduleInterval.end_time
                            .split(" ")[1]
                            .slice(0, 5)}
                        </span>
                      )}
                      {!DATA.placeExt.is_work && "закрыто"}
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
                      ? DATA.placeExt.address
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
                        DATA.placeExt.lat
                          ? {
                              lat: Number(DATA.placeExt.lat),
                              lng: Number(DATA.placeExt.lon),
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

      {isLoading && <Loader />}
      {showPopup && (
        <Popup togglePopup={togglePopup}>
          <GoogleMap
            togglePopupGoogleMap={togglePopup}
            styleContainerMap={{ width: "100vw" }}
            closeBtn
            initialCenterMap={
              DATA.placeExt.lat
                ? {
                    lat: Number(DATA.placeExt.lat),
                    lng: Number(DATA.placeExt.lon),
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
