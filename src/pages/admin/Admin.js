import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import Cropper from "cropperjs";
import Dropzone from "react-dropzone";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import autosize from "autosize";
import axios from "axios";

import CustomImg from "../../components/customImg/CustomImg";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Popup from "../../components/popup/Popup";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import {
  EN_SHORT_DAY_OF_WEEK,
  EN_SHORT_TO_RU_SHORT,
  SHORT_DAY_OF_WEEK,
  defaultColor,
  queryPath,
} from "../../constants";
import { numberDayNow } from "../../calculateTime";
import SideBar from "./Sidebar";

import Stream from "./Stream";
import StreamMobile from "./StreamMobile";

import "./admin.css";
import "./sidebar.css";
import "cropperjs/dist/cropper.min.css";
import "./imagecropper.css";
import DatePickerPopup from "./DatePickerPopup";
import GoogleMapPopup from "./GoogleMapPopup";
import DescriptionPopup from "./DescriptionPopup";
import UploadFilePopup from "./UploadFilePopup";
import ChooseTypePopup from "./ChooseTypePopup";
import LeftMenu from "./LeftMenu";

const AdminStyle = styled.div`
  position: relative;
`;

const AdminWrapper = styled.div`
  display: flex;
  width: 1000px;
  margin: 0 auto;
  @media (max-width: 760px) {
    max-width: 100%;
  }
`;

const PartyLive = styled.p`
  display: inline-block;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.05em;
  transition: 0.3s ease all;
  color: #323232;
  @media (max-width: 760px) {
    font-size: 20px;
  }
`;

const Live = styled.span`
  display: inline-block;
  background-color: ${defaultColor};
  color: #fff;
  border-radius: 5px;
  margin-left: 3px;
  padding: 0 7px;
`;
// ---------------------------------------------
const LeftAdminMenuD = styled.div`
  flex: 1.5;
  padding: 0px 10px 10px 0;
  @media (max-width: 760px) {
    display: none;
  }
`;

const GoBack = styled(Link)`
  font-size: 16px;
  font-weight: normal;
  height: 100px;
  display: flex;
  align-items: center;
  cursor: pointer;
  letter-spacing: 0.5px;
  &:hover {
    color: rgb(227, 42, 108);
  }
`;

const GoBackArrow = styled.span`
  font-size: 18px;
  padding-right: 10px;
  padding-bottom: 2px;
`;

const LeftAdminMenuInnerD = styled.div`
  position: fixed;
`;

const AdminContentD = styled.div`
  display: flex;
  flex: 4;
  padding: 100px 10px 10px 10px;
  flex-direction: column;
  @media (max-width: 760px) {
    display: none;
  }
`;

const ProfileTitleD = styled.div`
  display: flex;
`;

const ProfileTitleH3D = styled.h3`
  font-size: 24px;
  line-height: 24px;
`;

const ProfileTitleNameD = styled.span`
  padding-left: 12px;
  color: ${defaultColor};
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
`;

const ProfileContentD = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: row;
`;

const CropWrapperD = styled.div`
  position: relative;
  height: 205px;
  background: #fff;
`;

const PreviewPhotoTextD = styled.p`
  font-size: 22px;
  font-weight: 500;
  color: #aeaeae;
`;

const PreviewPhotoD = styled.div`
  display: flex;
  height: 200px;
  width: 320px;
  background-color: #f2f2f7;
  border-radius: 10px;
  color: #aeaeae;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    border: ${({ doNotHoverBorder }) =>
      doNotHoverBorder ? "" : `2px solid ${defaultColor}`};
  }
  &:hover ${PreviewPhotoTextD} {
    color: ${defaultColor};
    transition: 0.3s ease all;
  }
`;

const ImgContainerD = styled.div`
  width: 320px;
  height: 200px;
  overflow: hidden;
`;

const CanvasImageD = styled.canvas`
  display: none;
`;

const DescriptionWrapD = styled.div`
  display: flex;
  flex-direction: column !important;
  font-size: 10px;
  margin-top: 10px;
  width: ${(props) => props.width && props.width};
  height: ${(props) => props.height && props.height};
`;

const LengthofDescriptionD = styled.span`
  padding-left: 10px;
  font-weight: 500;
  font-size: 11px;
  text-align: end;
  color: ${(props) =>
    props.descOfCompany.length === props.descOfCompanyLimit ? "red" : "green"};
  @media (max-width: 760px) {
    width: 100%;
    font-size: 10px;
  }
`;

const DayOffDotD = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${defaultColor};
  display: inline-block;
  top: -10px;
  position: relative;
  left: 2px;
`;

// ____________________________________________-

const PreviewPhotoM = styled.div`
  display: flex;
  height: 122px;
  width: 213px;
  background-color: #f2f2f7;
  border: 2px solid #909090;
  border-radius: 10px;
  color: #aeaeae;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: 0.3s ease all;
  align-self: center;
  margin-top: 15px;
  &:hover {
    border: 2px solid ${defaultColor};
    color: ${defaultColor};
  }
`;

const AddressM = styled.div`
  display: inline-block;
  overflow: hidden;
  font-weight: 300;
  font-size: 16px;
  color: #4f4f4f;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid #e5e5e5;
  margin: 15px 0;
  padding: 15px 0;
  cursor: pointer;
`;

const DescriptionM = styled.div`
  display: inline-block;
  overflow: hidden;
  font-weight: 300;
  font-size: 16px;
  color: #4f4f4f;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid #e5e5e5;
  margin: 15px 0;
  padding: 15px 0;
  cursor: pointer;
`;

const AdminMenuTitleM = styled.p`
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
`;

const Admin = (props) => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [DATA, setDATA] = useState([]);
  const [showPopupDatePicker, setShowPopapDatePicker] = useState(false);
  const [showPopupGoogleMap, setShowPopapGoogleMap] = useState(false);
  const [showPopupDescription, setShowPopapDescription] = useState(false);
  const [showPopupChooseType, setShowPopapChooseType] = useState(false);
  const [showPopupUploadFile, setShowPopapUploadFile] = useState(false);

  const [startRealTimeInPicker, setStartRealTimeInPicker] = useState();
  const [endRealTimeInPicker, setEndRealTimeInPicker] = useState();
  const [isEmptyTime, setIsEmptyTime] = useState(true);
  const [enumWeekName, setEnumWeekName] = useState("");
  const [isSetWorkTimeDPick, setIsSetWorkTimeDPick] = useState(false);
  const [streamAddressData, setStreamAddressData] = useState("");
  const [clickedTime, setClickedTime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueCompanyType, setUniqueCompanyType] = useState();
  const [hoveredBtn, setHoveredBtn] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");
  const [aliasOfCompany, setAliasOfCompany] = useState("");
  const [typeOfCompany, setTypeOfCompany] = useState("");
  const [typeOfCompanyId, setTypeOfCompanyId] = useState("");
  const [descOfCompany, setDescOfCompany] = useState("");

  const [isSuccessSave, setIsSuccessSave] = useState(false);

  const [cookies] = useCookies([]);

  useEffect(() => {
    if (cookies.origin_data) {
      refreshData();
    }

    QUERY({ query: `query {categories { id name slug } }` })
      .then((res) => res.json())
      .then((data) => setUniqueCompanyType(data.data.categories))
      .catch((err) => console.log(err, "UNIQUE ADMIN ERR"));
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const refreshData = () => {
    QUERY({
      query: `query {
      place (id:"${props.match.params.id}") {
        id name address description logo menu actions coordinates alias profile_image
        streams{url name id preview schedules{id day start_time end_time} see_you_tomorrow}
        schedules {id day start_time end_time}
        categories {id name slug}
      }
  }`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setIsLoading(false);
          setDATA(data.data.place);
        } else {
          console.log(data.errors, "REFRESH ERRORS");
        }
      })
      .catch((err) => console.log(err, "REFRESH ERR"));
  };

  const setAsDayOf = (id) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            deleteSchedule(id:"${id || clickedTime.id}"){
              id day start_time end_time
            }
          }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          !data.errors
            ? refreshData()
            : console.log(data.errors, "DELETESCHEDULE ERRORS");
        })
        .catch((err) => console.log(err, "  DELETESCHEDULE ERR"));
    }
  };

  const updateStream = (name) => {
    if (cookies.origin_data) {
      const videoPreview = name.split("/"),
        videoPreviewUrl = name.replace(
          videoPreview[videoPreview.length - 1],
          "image.jpg"
        );

      QUERY(
        {
          query: `mutation {
            updateStream (
              input:{
                id:"${DATA.streams[0].id}"
                url :"${name}"
                preview : "${videoPreviewUrl}"
              }
            ) { id name url }
          }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          !data.errors
            ? refreshData()
            : console.log(data.errors, "UPDATESTREAM ERRORS");
        })
        .catch((err) => console.log(err, "UPDATESTREAM ERR"));
    }
  };

  const createStream = (name) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
              createStream(
                input:{
                  name: "${DATA.name}"
                  url :"https://partycamera.org/${name}/index.m3u8"
                  preview : "http://partycamera.org:80/${name}/preview.mp4"
                  place:{connect:"${props.match.params.id}"}                  
                }) {id name url}
            }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          !data.errors
            ? refreshData()
            : console.log(data.errors, "CREATE STREAM ERRORS");
        })
        .catch((err) => console.log(err, "CREATE STREAM ERR"));
    }
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

  window.onresize = function (e) {
    hideSideMenu();
  };

  const [titleInPicker, setTitleInPicker] = useState("");

  const togglePopupDatePicker = (whatPickerWillShow) => {
    setTitleInPicker(whatPickerWillShow);
    setShowPopapDatePicker(!showPopupDatePicker);
  };

  const togglePopupGoogleMap = () => setShowPopapGoogleMap(!showPopupGoogleMap);

  const togglePopupDescription = () =>
    setShowPopapDescription(!showPopupDescription);

  const togglePopupChooseType = () =>
    setShowPopapChooseType(!showPopupChooseType);

  const togglePopupUploadFile = () =>
    setShowPopapUploadFile(!showPopupUploadFile);

  useEffect(() => {
    if (
      showPopupDatePicker ||
      showPopupGoogleMap ||
      showPopupDescription ||
      showPopupChooseType ||
      showPopupUploadFile
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [
    showPopupDatePicker,
    showPopupGoogleMap,
    showPopupDescription,
    showPopupChooseType,
    showPopupUploadFile,
  ]);

  const SetNewTimeObject = (data) => {
    const timeObject = {};
    EN_SHORT_DAY_OF_WEEK.forEach((e, i) => {
      data.forEach((el, ind) => {
        if (!timeObject[e.day]) {
          timeObject[e.day] = "Пусто";
        }
        if (el.day) {
          timeObject[el.day] = el;
        }
      });
    });
    return timeObject;
  };

  const [leftMenuSettings, setLeftMenuSettings] = useState(
    sessionStorage.getItem("opened_li_admin")
      ? JSON.parse(sessionStorage.getItem("opened_li_admin"))
      : [
          {
            name: "ПРОФИЛЬ ЗАВЕДЕНИЯ",
            img: "barIcon",
            altImg: "profile",
            clicked: true,
            class: "barIconClass",
          },
          {
            name: "ГРАФИК РАБОТЫ",
            img: "clocklite",
            altImg: "work",
            clicked: false,
            class: "clockliteClass",
          },
          {
            name: "ГРАФИК ТРАНСЛЯЦИЙ",
            img: "video-camera",
            altImg: "camera",
            clicked: false,
            class: "videoCameraClass",
          },
          {
            name: "СТРИМ",
            img: "streaming",
            altImg: "stream",
            clicked: false,
            class: "streamingClass",
          },
        ]
  );

  useEffect(() => {
    sessionStorage.setItem("opened_li_admin", JSON.stringify(leftMenuSettings));
  }, [leftMenuSettings]);

  useEffect(() => {
    DATA.description && setDescOfCompany(DATA.description);
  }, [DATA.description]);

  useEffect(() => {
    DATA.name && setNameOfCompany(DATA.name);
  }, [DATA.name]);

  useEffect(() => {
    DATA.alias && setAliasOfCompany(DATA.alias);
  }, [DATA.alias]);

  const descOfCompanyLimit = 300;

  const updatePlaceData = () => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            updatePlace(
              input:{
                id:"${props.match.params.id}"
                name:"${nameOfCompany || DATA.name}"
                alias:"${aliasOfCompany || DATA.alias}"              
                ${
                  DATA.categories &&
                  DATA.categories[0] &&
                  typeOfCompanyId &&
                  typeOfCompanyId !== DATA.categories[0].id
                    ? `categories:{
                    disconnect:"${DATA.categories[0].id}"
                    connect:"${typeOfCompanyId}"
                  }`
                    : typeOfCompanyId
                    ? `categories:{
                      connect:"${typeOfCompanyId}"
                    }`
                    : `categories:{
                      
                    }`
                }
              }
            ){id}
          }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            setIsSuccessSave(true);
            setTimeout(() => {
              setIsSuccessSave(false);
            }, 2000);
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  const updateOrRemoveUploadImage = (profile_image) => {
    QUERY(
      {
        query: `mutation {
          updatePlace(
            input:{
              id:"${props.match.params.id}"
              ${
                profile_image
                  ? `profile_image: "${profile_image}"`
                  : `profile_image: ${null}`
              }             
            }
          ){id profile_image}
        }`,
      },
      cookies.origin_data
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          handeleClearToDefault();
          refreshData();
        } else {
          console.log(data.errors, " ERRORS");
        }
      })
      .catch((err) => console.log(err, "  *******ERR"));
  };

  const uploadImageTranscode = (blob) => {
    if (cookies.origin_data) {
      const query = `
          mutation ($file: Upload!) {
            placeImage(file: $file)
          }
        `;

      const data = {
        file: null,
      };

      const operations = JSON.stringify({
        query,
        variables: {
          data,
        },
      });

      let formData = new FormData();
      formData.append("operations", operations);
      const map = {
        0: ["variables.file"],
      };
      formData.append("map", JSON.stringify(map));
      formData.append("0", blob || imageDestination);
      axios({
        url: `${queryPath}/graphql`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: cookies.origin_data
            ? "Bearer " + cookies.origin_data
            : "",
        },
        data: formData,
      })
        .then((res) => {
          res.data.data.placeImage &&
            updateOrRemoveUploadImage(res.data.data.placeImage);
        })
        .catch((err) => console.log(err, " ERR"));
    }
  };

  document.body.style.background = "#fff";

  const [imgSrc, setImgSrc] = useState(null);
  const imagePreviewCanvas = useRef(null);

  const imageMaxSize = 10000000000,
    acceptedFileTypes =
      "image/x-png, image/png, image/jpg, image/jpeg, image/gif",
    acceptedFileTypesArray = acceptedFileTypes
      .split(",")
      .map((item) => item.trim());

  const imageElementRef = useRef(null);
  const [imageDestination, setImageDestination] = useState("");

  useEffect(() => {
    if (imageElementRef.current) {
      const cropper = new Cropper(imageElementRef.current, {
        zoomable: true,
        scalable: false,
        dragMode: "move",
        aspectRatio: 16 / 9,
        rotatable: true,
        movableL: true,
        modal: true,
        imageSmoothingEnabled: true,
        crop: (e) => {
          const canvas = cropper.getCroppedCanvas();
          canvas.toBlob(function (blob) {
            if (blob) {
              const formData = new FormData();
              formData.append("my-file", blob, "filename.png");
              setImageDestination(blob);
            }
          });
        },
      });
    }
  }, [imageElementRef.current]);

  const handeleClearToDefault = () => setImgSrc(null);

  const verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0],
        currentFileType = currentFile.type,
        currentFileSize = currentFile.size;

      if (currentFileSize > imageMaxSize) {
        alert("слишком большой размер файла");
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("поддерживаются только изображения");
        return false;
      }
      return true;
    }
  };

  const handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) verifyFile(rejectedFiles);

    if (files && files.length > 0) {
      const isVerified = verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];
        const myFileItemReader = new FileReader();

        myFileItemReader.onloadend = function (theFile) {
          var image = new Image();
          image.src = theFile.target.result;
        };

        myFileItemReader.addEventListener(
          "load",
          (theFile) => {
            const myResult = myFileItemReader.result;
            setImgSrc("");

            setImgSrc(myResult);
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  const isWorkTimeOrDayOff = (oneDay, i) => {
    if (oneDay && oneDay.id) {
      if (
        oneDay.start_time.split(":")[0] * 3600 +
          oneDay.start_time.split(":")[1] * 60 <=
        oneDay.end_time.split(":")[0] * 3600 +
          oneDay.end_time.split(":")[1] * 60
      ) {
        return (
          <p>
            {oneDay.start_time.replace(":", ".")}
            {" - "}
            {oneDay.end_time.replace(":", ".")}{" "}
          </p>
        );
      } else {
        return (
          <p>
            {oneDay.start_time.replace(":", ".")}
            {" - "}
            {oneDay.end_time.replace(":", ".")}
          </p>
        );
      }
    } else {
      return "Выходной";
    }
  };

  const isSetAsDayOff = (oneDay) => {
    if (oneDay && oneDay.id) {
      return "Сделать выходным";
    } else {
      return "Выходной";
    }
  };

  const renderCustomTypeImg = (slug, active) => {
    return (
      <CustomImg
        alt="Icon"
        className="сompanyNavImg"
        name={slug}
        active={active ? true : false}
        width="30"
        height="30"
      />
    );
  };

  const animateProps = useSpring({
    right: isShowMenu ? 200 : 0,
    config: { duration: 200 },
  });

  const animateSavedProps = useSpring({
    bottom: isSuccessSave ? 20 : -100,
    config: { duration: 200 },
  });

  const tomorrowFromDay = (day) => {
    if (day === 6) {
      return 0;
    } else {
      return day + 1;
    }
  };

  const [validationErr, setValidationErr] = useState({});

  const checkValidationError = () => {
    if (nameOfCompany.length < 1) {
      setValidationErr({
        nameOfCompany: "обязательно для заполнения",
      });
      return false;
    } else if (
      (aliasOfCompany && !aliasOfCompany.match("^[a-zA-Z0-9]+$")) ||
      aliasOfCompany.length < 1
    ) {
      setValidationErr({
        aliasOfCompany: "только латиница и цифры и поле не пустое",
      });
      return false;
    } else {
      setValidationErr({});
      return true;
    }
  };

  const [streamOpen, setStreamOpen] = useState(false);
  const [profileOpen, setPprofileOpen] = useState(false);
  const [workScheduleOpen, setWorkScheduleOpen] = useState(false);
  const [streamScheduleOpen, setStreamScheduleOpen] = useState(false);

  const closeAllSidebar = () => {
    setStreamOpen(false);
    setPprofileOpen(false);
    setWorkScheduleOpen(false);
    setStreamScheduleOpen(false);
  };

  useEffect(() => {
    sessionStorage.setItem("prevZoom", "");
    sessionStorage.setItem("prevCenter", "");
  }, []);

  useEffect(() => {
    autosize(document.querySelectorAll("textarea"));
  });

  const hide = (e) => {
    if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
      hideSideMenu();
  };

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div>
        <div onClick={(e) => hide(e)}>
          <AdminStyle
            as={animated.div}
            style={animateProps}
            onClick={(e) => hide(e)}
          >
            <Header
              isShowMenu={isShowMenu}
              logo
              burger
              arrow
              showSlideSideMenu={showSlideSideMenu}
              showSideMenu={showSideMenu}
            />
            {isLoading && <Loader />}
            {!isLoading && (
              <AdminWrapper>
                {/* __________________DESCTOP__________________ */}
                <LeftAdminMenuD>
                  <GoBack to={"/editCompany"}>
                    <GoBackArrow>&#8592;</GoBackArrow>К списку заведений
                  </GoBack>
                  <LeftAdminMenuInnerD>
                    <ul>
                      {leftMenuSettings.map((el, id) => (
                        <LeftMenu
                          el={el}
                          setLeftMenuSettings={setLeftMenuSettings}
                          id={id}
                        />
                      ))}
                    </ul>
                  </LeftAdminMenuInnerD>
                </LeftAdminMenuD>

                <AdminContentD>
                  {leftMenuSettings.map((el, i) => {
                    if (el.clicked && i === 0) {
                      return (
                        <div key={i}>
                          <ProfileTitleD>
                            <ProfileTitleH3D>ПРОФИЛЬ ЗАВЕДЕНИЯ</ProfileTitleH3D>
                            <ProfileTitleNameD>({DATA.name})</ProfileTitleNameD>
                          </ProfileTitleD>
                          <ProfileContentD>
                            <div>
                              {imgSrc ? (
                                <div>
                                  <CropWrapperD>
                                    <ImgContainerD>
                                      <img
                                        ref={imageElementRef}
                                        src={imgSrc}
                                        alt="src"
                                      />
                                    </ImgContainerD>
                                    <CanvasImageD
                                      ref={imagePreviewCanvas}
                                    ></CanvasImageD>
                                  </CropWrapperD>
                                </div>
                              ) : (
                                <PreviewPhotoD
                                  doNotHoverBorder={DATA.profile_image}
                                  onClick={() =>
                                    document
                                      .querySelector(".previewRef")
                                      .click()
                                  }
                                >
                                  {DATA.profile_image ? (
                                    <img
                                      className={"uploadImgStyle"}
                                      src={`${queryPath}/storage/${DATA.profile_image.replace(
                                        ".png",
                                        ".jpg"
                                      )}`}
                                      alt="image"
                                    />
                                  ) : (
                                    <>
                                      <PreviewPhotoTextD>
                                        Загрузить фото
                                      </PreviewPhotoTextD>
                                    </>
                                  )}
                                </PreviewPhotoD>
                              )}
                              {DATA.profile_image && !imgSrc && (
                                <div style={{ marginTop: "10px" }}>
                                  <span
                                    className="changePhoto"
                                    style={{ marginRight: "20px" }}
                                    onClick={() =>
                                      document
                                        .querySelector(".previewRef")
                                        .click()
                                    }
                                  >
                                    Изменить
                                  </span>
                                  <span
                                    className="changePhoto"
                                    onClick={() => updateOrRemoveUploadImage()}
                                  >
                                    Удалить
                                  </span>
                                </div>
                              )}
                              <Dropzone
                                multiple={false}
                                accept={acceptedFileTypes}
                                maxSize={imageMaxSize}
                                onDrop={(acceptedFiles, rejectedFiles) =>
                                  handleOnDrop(acceptedFiles, rejectedFiles)
                                }
                              >
                                {({ getRootProps, getInputProps }) => {
                                  return (
                                    <section style={{ display: "flex" }}>
                                      <div
                                        className="changePhotoBlock previewRef"
                                        {...getRootProps()}
                                      >
                                        <input
                                          className="changePhotoInput"
                                          {...getInputProps()}
                                        />
                                        {imgSrc && (
                                          <p className="changePhoto">
                                            Изменить
                                          </p>
                                        )}
                                      </div>
                                      {imgSrc && (
                                        <span
                                          className="changePhoto"
                                          onClick={handeleClearToDefault}
                                        >
                                          Отмена
                                        </span>
                                      )}
                                    </section>
                                  );
                                }}
                              </Dropzone>
                            </div>
                            <div
                              className="profileDataDesc"
                              style={{
                                width: "100%",
                                height: "250px",
                                margin: 0,
                                paddingLeft: "29px",
                              }}
                            >
                              <div
                                className="inputBlockWrap"
                                style={{
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <p
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "16px",
                                  }}
                                >
                                  Описание:
                                </p>
                                <DescriptionWrapD
                                  width={"100%"}
                                  height={"185px"}
                                >
                                  <textarea
                                    className="descTextarea"
                                    style={{
                                      padding: "0 5px",
                                    }}
                                    maxLength={descOfCompanyLimit}
                                    value={descOfCompany}
                                    onChange={(e) =>
                                      setDescOfCompany(e.target.value)
                                    }
                                  />
                                  <LengthofDescriptionD
                                    descOfCompany={descOfCompany}
                                    descOfCompanyLimit={descOfCompanyLimit}
                                  >
                                    {descOfCompany.length} /{" "}
                                    {descOfCompanyLimit}
                                  </LengthofDescriptionD>
                                </DescriptionWrapD>
                              </div>
                            </div>
                          </ProfileContentD>
                          <div className="profileDataDesc">
                            <div className="inputBlockWrap">
                              <p
                                className="blockNameDesc"
                                style={
                                  validationErr["nameOfCompany"]
                                    ? { color: "red" }
                                    : {}
                                }
                              >
                                Название заведения:
                                <span style={{ color: "red" }}>*</span>
                              </p>
                              <input
                                type="text"
                                placeholder={DATA.name}
                                value={nameOfCompany}
                                onChange={(e) =>
                                  setNameOfCompany(e.target.value)
                                }
                              />
                            </div>
                            <div className="inputBlockWrap">
                              <p
                                className="blockNameDesc"
                                style={
                                  validationErr["aliasOfCompany"]
                                    ? { color: "red" }
                                    : {}
                                }
                              >
                                Псевдоним:
                                <span style={{ color: "red" }}>*</span>
                              </p>
                              <input
                                pattern="^[a-zA-Z0-9]+$"
                                type="text"
                                placeholder={DATA.alias}
                                value={aliasOfCompany}
                                onChange={(e) =>
                                  setAliasOfCompany(
                                    e.target.value.toLowerCase()
                                  )
                                }
                              />
                            </div>
                            <div className="bigInputBlockWrap">
                              <p className="blockNameDesc">Категория:</p>
                              <div className="categoryBtnWrap">
                                {!!uniqueCompanyType &&
                                  uniqueCompanyType.map((el, i) => {
                                    return (
                                      <span
                                        className="categoryBtn"
                                        key={i}
                                        style={
                                          el &&
                                          el.name &&
                                          typeOfCompany &&
                                          typeOfCompany === el.name
                                            ? {
                                                background: defaultColor,
                                                color: "#fff",
                                              }
                                            : !typeOfCompany &&
                                              DATA.categories &&
                                              DATA.categories[0] &&
                                              el &&
                                              el.name &&
                                              DATA.categories[0].name ===
                                                el.name
                                            ? {
                                                background: defaultColor,
                                                color: "#fff",
                                              }
                                            : {}
                                        }
                                        onClick={() => {
                                          setTypeOfCompany(el.name);
                                          setTypeOfCompanyId(el.id);
                                        }}
                                        onMouseOver={() =>
                                          setHoveredBtn(el.name)
                                        }
                                        onMouseOut={() => setHoveredBtn("")}
                                      >
                                        {typeOfCompany &&
                                        typeOfCompany === el.name
                                          ? renderCustomTypeImg(el.slug, true)
                                          : !typeOfCompany &&
                                            DATA.categories &&
                                            DATA.categories[0] &&
                                            DATA.categories[0].name === el.name
                                          ? renderCustomTypeImg(el.slug, true)
                                          : hoveredBtn === el.name
                                          ? renderCustomTypeImg(el.slug, true)
                                          : renderCustomTypeImg(el.slug, false)}
                                        <span
                                          style={{
                                            display: "inline-block",
                                            width: "5px",
                                          }}
                                        ></span>
                                        {el.name}
                                      </span>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="inputBlockWrap">
                              <p className="addressText blockNameDesc">
                                Адрес заведения:
                              </p>
                              <div className="addressBlockWrapp">
                                <input
                                  disabled
                                  type="text"
                                  value={
                                    DATA.address &&
                                    DATA.address
                                      .split(",")[0]
                                      .replace("улица", "ул.")
                                      .replace("проспект", "пр-т.")
                                  }
                                />
                                <div>
                                  <span
                                    className="chooseAddressHoveredDesc"
                                    onClick={() => togglePopupGoogleMap()}
                                  >
                                    ВЫБРАТЬ АДРЕС НА КАРТЕ
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p
                                style={{ marginRight: "20px" }}
                                className="saveBtnProfile"
                                onClick={() => {
                                  checkValidationError() &&
                                    uploadImageTranscode();
                                  checkValidationError() && updatePlaceData();
                                }}
                              >
                                СОХРАНИТЬ
                              </p>
                              <Link
                                to={"/editCompany"}
                                className="cancelBtnProfile"
                                onClick={() => {
                                  setValidationErr({});
                                  setNameOfCompany(DATA.name);
                                  setAliasOfCompany(DATA.alias);
                                  setTypeOfCompany(
                                    DATA.categories &&
                                      DATA.categories[0] &&
                                      DATA.categories[0].name
                                  );
                                  setTypeOfCompanyId(
                                    DATA.categories &&
                                      DATA.categories[0] &&
                                      DATA.categories[0].id
                                  );
                                  setDescOfCompany(DATA.description);
                                }}
                              >
                                ОТМЕНА
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (el.clicked && i === 1) {
                      return (
                        <div key={i} className="workTimeTableWrap">
                          <h3 style={{ paddingLeft: "15px" }}>ГРАФИК РАБОТЫ</h3>
                          <table className="tableWorkDesc">
                            <tbody>
                              {DATA.schedules &&
                                EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                  const oneDay = SetNewTimeObject(
                                    DATA.schedules
                                  )[el.day];
                                  return (
                                    <tr key={i}>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                                color: defaultColor,
                                              }
                                            : { fontWeight: "normal" }
                                        }
                                      >
                                        {EN_SHORT_TO_RU_SHORT[el.day]}

                                        {oneDay &&
                                          oneDay.start_time &&
                                          (oneDay.start_time.split(":")[0] *
                                            3600 +
                                            oneDay.start_time.split(":")[1] *
                                              60 <=
                                          oneDay.end_time.split(":")[0] * 3600 +
                                            oneDay.end_time.split(":")[1] * 60
                                            ? ""
                                            : `-${
                                                SHORT_DAY_OF_WEEK[
                                                  tomorrowFromDay(i)
                                                ]
                                              }`)}
                                        {numberDayNow === i && <DayOffDotD />}
                                      </td>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                              }
                                            : {}
                                        }
                                        className="timeTd"
                                        onClick={() => {
                                          if (oneDay && oneDay.id) {
                                            setIsEmptyTime(false); //не пустое время
                                            setEnumWeekName(""); //день недели для отправки запроса
                                            setStartRealTimeInPicker(
                                              oneDay.start_time
                                            );
                                            setEndRealTimeInPicker(
                                              oneDay.end_time
                                            );
                                            togglePopupDatePicker();
                                            setClickedTime(oneDay); //объект для отправки запроса
                                            setIsSetWorkTimeDPick(true);
                                          } else {
                                            setIsEmptyTime(true);
                                            setEnumWeekName(el.day);
                                            setStartRealTimeInPicker("00:00");
                                            setEndRealTimeInPicker("00:00");
                                            togglePopupDatePicker();
                                            setIsSetWorkTimeDPick(true);
                                          }
                                        }}
                                      >
                                        {isWorkTimeOrDayOff(oneDay, i)}
                                      </td>
                                      <td
                                        style={
                                          (numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                              }
                                            : {},
                                          isSetAsDayOff(
                                            oneDay
                                          ).toLowerCase() === "выходной"
                                            ? { color: "#000" }
                                            : {})
                                        }
                                        className="doAsDayOfTd"
                                        onClick={() => setAsDayOf(oneDay.id)}
                                      >
                                        {isSetAsDayOff(oneDay)}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }

                    if (el.clicked && i === 2) {
                      return (
                        <div className="workTimeTableWrap">
                          <h3 style={{ paddingLeft: "15px" }}>
                            ГРАФИК ТРАНСЛЯЦИЙ
                          </h3>
                          <table className="tableWorkDesc">
                            <tbody>
                              {DATA.streams &&
                                EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                  const oneDay = SetNewTimeObject(
                                    DATA.streams[0]
                                      ? DATA.streams[0].schedules
                                      : []
                                  )[el.day];
                                  return (
                                    <tr key={i}>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                                color: defaultColor,
                                              }
                                            : {
                                                fontWeight: "normal",
                                              }
                                        }
                                      >
                                        {EN_SHORT_TO_RU_SHORT[el.day]}
                                        {oneDay &&
                                          oneDay.start_time &&
                                          (oneDay.start_time.split(":")[0] *
                                            3600 +
                                            oneDay.start_time.split(":")[1] *
                                              60 <=
                                          oneDay.end_time.split(":")[0] * 3600 +
                                            oneDay.end_time.split(":")[1] * 60
                                            ? ""
                                            : `-${
                                                SHORT_DAY_OF_WEEK[
                                                  tomorrowFromDay(i)
                                                ]
                                              }`)}
                                        {numberDayNow === i && <DayOffDotD />}
                                      </td>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                              }
                                            : {}
                                        }
                                        className="timeTd"
                                        onClick={() => {
                                          if (!DATA.streams[0]) {
                                            alert("Стрим еще не создан");
                                          } else {
                                            if (oneDay && oneDay.id) {
                                              setIsEmptyTime(false); //не пустое время
                                              setEnumWeekName("");
                                              setStartRealTimeInPicker(
                                                oneDay.start_time
                                              );
                                              setEndRealTimeInPicker(
                                                oneDay.end_time
                                              );
                                              togglePopupDatePicker();
                                              setClickedTime(oneDay);
                                              setIsSetWorkTimeDPick(false);
                                            } else {
                                              setIsEmptyTime(true); //пустое время
                                              setEnumWeekName(el.day);
                                              setStartRealTimeInPicker("00:00");
                                              setEndRealTimeInPicker("00:00");
                                              togglePopupDatePicker();
                                              setIsSetWorkTimeDPick(false);
                                            }
                                          }
                                        }}
                                      >
                                        {isWorkTimeOrDayOff(oneDay, i)}
                                      </td>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "700",
                                              }
                                            : {}
                                        }
                                        className="doAsDayOfTd"
                                        onClick={() => setAsDayOf(oneDay.id)}
                                      >
                                        {isSetAsDayOff(oneDay)}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (el.clicked && i === 3) {
                      return (
                        <Stream
                          index={i}
                          DATA={DATA}
                          props={props}
                          setDATA={setDATA}
                          refreshData={refreshData}
                          setIsLoading={setIsLoading}
                        />
                      );
                    }
                  })}
                </AdminContentD>

                {/* __________________MOBILE__________________ */}
                <div className="adminContentMobile">
                  <div className="adminMenuContainer">
                    {/* ____________________________________ Стрим */}
                    <div className="menuBlockWrap ">
                      <div
                        className="menuBlock"
                        onClick={(e) => setStreamOpen(true)}
                      >
                        Стрим<span className="rotateArrow"></span>
                      </div>
                      <SideBar
                        isOpen={streamOpen}
                        right
                        pageWrapId={"page-wrap"}
                        outerContainerId={"App"}
                        width={"100%"}
                      >
                        <StreamMobile
                          closeAllSidebar={closeAllSidebar}
                          DATA={DATA}
                          refreshData={refreshData}
                        />
                      </SideBar>
                    </div>
                    {/* ______________________________Профиль заведения */}
                    <div className="menuBlockWrap profile">
                      <div
                        className="menuBlock"
                        onClick={(e) => setPprofileOpen(true)}
                      >
                        Профиль заведения
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">
                        <SideBar
                          styles={{ padding: "0px !important" }}
                          style={{ padding: 0 }}
                          isOpen={profileOpen}
                          right
                          pageWrapId={"page-wrap"}
                          outerContainerId={"App"}
                          width={"100%"}
                        >
                          <div style={{ position: "relative", top: "-46px" }}>
                            <div
                              style={{
                                display: "flex",
                                height: "44px",
                                borderBottom: "1px solid #ECECEC",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 25px",
                              }}
                            >
                              <p
                                className=""
                                style={{
                                  letterSpacing: "0.5px",
                                  color: defaultColor,
                                  fontWeight: 500,
                                  fontSize: "18px",
                                }}
                                onClick={() => {
                                  closeAllSidebar();
                                  setValidationErr({});
                                  setNameOfCompany(DATA.name);
                                  setAliasOfCompany(DATA.alias);
                                }}
                              >
                                Отмена
                              </p>
                              <Link to="/">
                                <PartyLive>
                                  PARTY<Live>.LIVE</Live>
                                </PartyLive>
                              </Link>
                              <p
                                style={{
                                  letterSpacing: "0.5px",
                                  color: defaultColor,
                                  fontWeight: 500,
                                  fontSize: "18px",
                                }}
                                className=""
                                onClick={() => {
                                  checkValidationError() && updatePlaceData();
                                  checkValidationError() && closeAllSidebar();
                                }}
                              >
                                Готово
                              </p>
                            </div>

                            <AdminMenuTitleM>Профиль</AdminMenuTitleM>

                            <div
                              className="uploadFileContainer"
                              style={{ paddingTop: "0" }}
                            >
                              <div className="uploadFile">
                                {imgSrc ? (
                                  <></>
                                ) : (
                                  <>
                                    <PreviewPhotoM
                                      onClick={() => {
                                        togglePopupUploadFile();
                                        document
                                          .querySelector(".previewRef")
                                          .click();
                                      }}
                                    >
                                      {DATA.profile_image ? (
                                        <img
                                          className={"uploadImgStyleMobile"}
                                          src={`${queryPath}/storage/${DATA.profile_image.replace(
                                            ".png",
                                            ".jpg"
                                          )}`}
                                          alt="image"
                                          style={{ height: "120px" }}
                                        />
                                      ) : (
                                        <p>Загрузить фото</p>
                                      )}
                                    </PreviewPhotoM>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        marginTop: "15px",
                                      }}
                                    >
                                      <span
                                        style={{ marginRight: "30px" }}
                                        onClick={() => {
                                          togglePopupUploadFile();
                                          document
                                            .querySelector(".previewRef")
                                            .click();
                                        }}
                                      >
                                        Изменить
                                      </span>
                                      <span
                                        onClick={() =>
                                          updateOrRemoveUploadImage()
                                        }
                                      >
                                        Удалить
                                      </span>
                                    </div>
                                  </>
                                )}
                                <Dropzone
                                  multiple={false}
                                  accept={acceptedFileTypes}
                                  maxSize={imageMaxSize}
                                  onDrop={(acceptedFiles, rejectedFiles) =>
                                    handleOnDrop(acceptedFiles, rejectedFiles)
                                  }
                                >
                                  {({ getRootProps, getInputProps }) => {
                                    return (
                                      <section style={{ display: "flex" }}>
                                        <div
                                          className="changePhotoBlock"
                                          {...getRootProps()}
                                        >
                                          <input
                                            className="changePhotoInput previewRef"
                                            {...getInputProps()}
                                          />
                                          {imgSrc && (
                                            <p className="changePhoto">
                                              Изменить
                                            </p>
                                          )}
                                        </div>
                                        {imgSrc && (
                                          <span
                                            className="changePhoto"
                                            onClick={handeleClearToDefault}
                                          >
                                            Удалить
                                          </span>
                                        )}
                                      </section>
                                    );
                                  }}
                                </Dropzone>
                              </div>
                            </div>
                            {/* ================================================= */}
                            <div className="profileDataDesc">
                              <div
                                className="inputBlockWrap"
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={
                                    validationErr["nameOfCompany"]
                                      ? { color: "red" }
                                      : {}
                                  }
                                >
                                  Название:
                                </p>
                                <input
                                  type="text"
                                  placeholder={DATA.name}
                                  value={nameOfCompany}
                                  onChange={(e) =>
                                    setNameOfCompany(e.target.value)
                                  }
                                />
                              </div>
                              <div
                                className="inputBlockWrap"
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={
                                    validationErr["aliasOfCompany"]
                                      ? { color: "red" }
                                      : {}
                                  }
                                >
                                  Псевдоним:
                                </p>
                                <input
                                  type="text"
                                  placeholder={DATA.alias}
                                  value={aliasOfCompany}
                                  onChange={(e) =>
                                    setAliasOfCompany(
                                      e.target.value.toLowerCase()
                                    )
                                  }
                                />
                              </div>
                              <div className="bigInputBlockWrap">
                                <p>Категория:</p>

                                <div
                                  className="categoryBtnWrap"
                                  style={{
                                    margin: 0,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  {DATA.categories &&
                                    DATA.categories[0] &&
                                    DATA.categories[0].slug && (
                                      <span
                                        className="categoryAloneBtn"
                                        style={{ margin: 0 }}
                                      >
                                        {renderCustomTypeImg(
                                          DATA.categories[0].slug,
                                          false
                                        )}
                                        {DATA.categories[0].name}
                                      </span>
                                    )}

                                  <span
                                    className="ChooseNewCategory"
                                    onClick={() => togglePopupChooseType()}
                                  >
                                    Выбрать...
                                  </span>
                                </div>
                              </div>
                              <div
                                className="inputBlockWrap"
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  margin: 0,
                                }}
                              >
                                <p className="addressTextMobile">Адрес:</p>
                                <AddressM
                                  onClick={() => togglePopupGoogleMap()}
                                >
                                  {DATA.address &&
                                    DATA.address
                                      .split(",")[0]
                                      .replace("улица", "ул.")
                                      .replace("проспект", "пр-т.")}
                                </AddressM>
                              </div>
                              <div
                                className="inputBlockWrap"
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  margin: 0,
                                }}
                              >
                                <p>Описание:</p>
                                <DescriptionM
                                  onClick={() => togglePopupDescription()}
                                >
                                  {descOfCompany}
                                </DescriptionM>
                              </div>
                            </div>
                          </div>
                        </SideBar>
                      </div>
                    </div>
                    {/* ______________________________________ График работы */}
                    <div className="menuBlockWrap workSchedule">
                      <div
                        className="menuBlock"
                        onClick={(e) => setWorkScheduleOpen(true)}
                      >
                        График работы<span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrapPaddingOff">
                        <SideBar
                          isOpen={workScheduleOpen}
                          right
                          pageWrapId={"page-wrap"}
                          outerContainerId={"App"}
                          width={"100%"}
                        >
                          <div style={{ position: "relative", top: "-46px" }}>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  height: "44px",
                                  borderBottom: "1px solid #ECECEC",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "0 25px",
                                }}
                              >
                                <p
                                  className=""
                                  style={{
                                    letterSpacing: "0.5px",
                                    color: defaultColor,
                                    fontSize: "16px",
                                    fontWeight: "normal",
                                  }}
                                  onClick={() => {
                                    closeAllSidebar();
                                  }}
                                >
                                  Отмена
                                </p>
                                <Link to="/">
                                  <PartyLive>
                                    PARTY<Live>.LIVE</Live>
                                  </PartyLive>
                                </Link>
                                <p
                                  style={{
                                    letterSpacing: "0.5px",
                                    color: defaultColor,
                                    fontSize: "16px",
                                    fontWeight: "normal",
                                  }}
                                  className=""
                                  onClick={() => {
                                    closeAllSidebar();
                                  }}
                                >
                                  Готово
                                </p>
                              </div>
                              <AdminMenuTitleM>График работы</AdminMenuTitleM>
                              <div>
                                <table>
                                  <tbody>
                                    {DATA.schedules &&
                                      EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                        const oneDay = SetNewTimeObject(
                                          DATA.schedules
                                        )[el.day];
                                        return (
                                          <tr key={i}>
                                            <td
                                              className="dayOfWeekScheduleMobile"
                                              style={
                                                numberDayNow === i
                                                  ? {
                                                      color: defaultColor,
                                                      fontWeight: "700",
                                                    }
                                                  : { fontWeight: "400" }
                                              }
                                            >
                                              {EN_SHORT_TO_RU_SHORT[el.day]}
                                            </td>
                                            <td
                                              style={
                                                numberDayNow === i
                                                  ? {
                                                      fontWeight: "700",
                                                    }
                                                  : {}
                                              }
                                              onClick={() => {
                                                if (oneDay && oneDay.id) {
                                                  setIsEmptyTime(false); //не пустое время
                                                  setEnumWeekName(""); //день недели для отправки запроса
                                                  setStartRealTimeInPicker(
                                                    oneDay.start_time
                                                  );
                                                  setEndRealTimeInPicker(
                                                    oneDay.end_time
                                                  );
                                                  togglePopupDatePicker(
                                                    "График работы"
                                                  );
                                                  setClickedTime(oneDay); //объект для отправки запроса
                                                  setIsSetWorkTimeDPick(true);
                                                } else {
                                                  setIsEmptyTime(true);
                                                  setEnumWeekName(el.day);
                                                  setStartRealTimeInPicker(
                                                    "00:00"
                                                  );
                                                  setEndRealTimeInPicker(
                                                    "00:00"
                                                  );
                                                  togglePopupDatePicker(
                                                    "График работы"
                                                  );
                                                  setIsSetWorkTimeDPick(true);
                                                }
                                              }}
                                            >
                                              {isWorkTimeOrDayOff(oneDay)}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </SideBar>
                      </div>
                    </div>
                    {/* _____________________________________ График трансляций */}
                    <div className="menuBlockWrap streamSchedule">
                      <div
                        className="menuBlock"
                        onClick={(e) => setStreamScheduleOpen(true)}
                      >
                        График трансляций
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrapPaddingOff">
                        <SideBar
                          isOpen={streamScheduleOpen}
                          right
                          pageWrapId={"page-wrap"}
                          outerContainerId={"App"}
                          width={"100%"}
                        >
                          <div style={{ position: "relative", top: "-46px" }}>
                            <div
                              style={{
                                display: "flex",
                                height: "44px",
                                borderBottom: "1px solid #ECECEC",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 25px",
                              }}
                            >
                              <p
                                className=""
                                style={{
                                  letterSpacing: "0.5px",
                                  color: defaultColor,
                                  fontSize: "16px",
                                  fontWeight: "normal",
                                }}
                                onClick={() => {
                                  closeAllSidebar();
                                }}
                              >
                                Отмена
                              </p>
                              <Link to="/">
                                <PartyLive>
                                  PARTY<Live>.LIVE</Live>
                                </PartyLive>
                              </Link>
                              <p
                                style={{
                                  letterSpacing: "0.5px",
                                  color: defaultColor,
                                  fontSize: "16px",
                                  fontWeight: "normal",
                                }}
                                className=""
                                onClick={() => {
                                  closeAllSidebar();
                                }}
                              >
                                Готово
                              </p>
                            </div>
                            <div>
                              <div className="chooseStreamAddress">
                                <input
                                  className="streamAddress"
                                  placeholder={
                                    (DATA.streams &&
                                      DATA.streams[0] &&
                                      DATA.streams[0].url &&
                                      DATA.streams[0].url) ||
                                    "Введите адрес стрима"
                                  }
                                  value={streamAddressData}
                                  onInput={(e) =>
                                    setStreamAddressData(e.target.value)
                                  }
                                />
                                <div
                                  className="chooseStreamAddressSaveBtn"
                                  onClick={() => {
                                    if (streamAddressData) {
                                      if (!DATA.streams[0]) {
                                        createStream(streamAddressData);
                                      } else {
                                        updateStream(streamAddressData);
                                      }
                                    } else {
                                      alert("Заполните поле");
                                    }
                                  }}
                                >
                                  Сохранить
                                </div>
                              </div>
                              <AdminMenuTitleM>
                                График трансляций
                              </AdminMenuTitleM>
                              <table>
                                <tbody>
                                  {DATA.streams &&
                                    EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                      const oneDay = SetNewTimeObject(
                                        DATA.streams[0]
                                          ? DATA.streams[0].schedules
                                          : []
                                      )[el.day];
                                      return (
                                        <tr key={i}>
                                          <td
                                            className="dayOfWeekScheduleMobile"
                                            style={
                                              numberDayNow === i
                                                ? {
                                                    color: defaultColor,
                                                    fontWeight: "700",
                                                  }
                                                : { fontWeight: "400" }
                                            }
                                          >
                                            {EN_SHORT_TO_RU_SHORT[el.day]}
                                          </td>
                                          <td
                                            style={
                                              numberDayNow === i
                                                ? {
                                                    fontWeight: "700",
                                                  }
                                                : {}
                                            }
                                            onClick={() => {
                                              if (!DATA.streams[0]) {
                                                alert("Стрим еще не создан");
                                              } else {
                                                if (oneDay && oneDay.id) {
                                                  setIsEmptyTime(false); //не пустое время
                                                  setEnumWeekName("");
                                                  setStartRealTimeInPicker(
                                                    oneDay.start_time
                                                  );
                                                  setEndRealTimeInPicker(
                                                    oneDay.end_time
                                                  );
                                                  togglePopupDatePicker(
                                                    "График трансляций"
                                                  );
                                                  setClickedTime(oneDay);
                                                  setIsSetWorkTimeDPick(false);
                                                } else {
                                                  setIsEmptyTime(true); //пустое время
                                                  setEnumWeekName(el.day);
                                                  setStartRealTimeInPicker(
                                                    "00:00"
                                                  );
                                                  setEndRealTimeInPicker(
                                                    "00:00"
                                                  );
                                                  togglePopupDatePicker(
                                                    "График трансляций"
                                                  );
                                                  setIsSetWorkTimeDPick(false);
                                                }
                                              }
                                            }}
                                          >
                                            {isWorkTimeOrDayOff(oneDay)}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </SideBar>
                      </div>
                    </div>
                  </div>
                </div>
              </AdminWrapper>
            )}
          </AdminStyle>
          <SlideSideMenu isShowMenu={isShowMenu} />

          {showPopupDatePicker && (
            <DatePickerPopup
              togglePopupDatePicker={togglePopupDatePicker}
              windowWidth={windowWidth}
              titleInPicker={titleInPicker}
              setAsDayOf={setAsDayOf}
              startRealTimeInPicker={startRealTimeInPicker}
              isSetWorkTimeDPick={isSetWorkTimeDPick}
              isEmptyTime={isEmptyTime}
              props={props}
              enumWeekName={enumWeekName}
              endRealTimeInPicker={endRealTimeInPicker}
              refreshData={refreshData}
              clickedTime={clickedTime}
              DATA={DATA}
              tomorrowFromDay={tomorrowFromDay}
            />
          )}
          {showPopupChooseType && (
            <ChooseTypePopup
              togglePopupChooseType={togglePopupChooseType}
              DATA={DATA}
              setTypeOfCompany={setTypeOfCompany}
              setTypeOfCompanyId={setTypeOfCompanyId}
              props={props}
              typeOfCompanyId={typeOfCompanyId}
              refreshData={refreshData}
              uniqueCompanyType={uniqueCompanyType}
              typeOfCompany={typeOfCompany}
              setHoveredBtn={setHoveredBtn}
              renderCustomTypeImg={renderCustomTypeImg}
              hoveredBtn={hoveredBtn}
            />
          )}
          {showPopupDescription && (
            <DescriptionPopup
              togglePopupDescription={togglePopupDescription}
              DATA={DATA}
              setDescOfCompany={setDescOfCompany}
              props={props}
              descOfCompany={descOfCompany}
              refreshData={refreshData}
              descOfCompanyLimit={descOfCompanyLimit}
            />
          )}
          {showPopupGoogleMap && (
            <GoogleMapPopup
              togglePopupGoogleMap={togglePopupGoogleMap}
              DATA={DATA}
              props={props}
              refreshData={refreshData}
            />
          )}
          {showPopupUploadFile && (
            <UploadFilePopup
              togglePopupUploadFile={togglePopupUploadFile}
              setImgSrc={setImgSrc}
              titleInPicker={titleInPicker}
              imgSrc={imgSrc}
              uploadImageTranscode={uploadImageTranscode}
              acceptedFileTypes={acceptedFileTypes}
              imageMaxSize={imageMaxSize}
              handleOnDrop={handleOnDrop}
            />
          )}
        </div>

        <animated.div
          className="successSaved"
          style={{
            bottom: animateSavedProps.bottom,
            background: defaultColor,
          }}
        >
          <div>
            <p>Сохранено</p>
          </div>
        </animated.div>
      </div>
    );
  }
};

export default Admin;
