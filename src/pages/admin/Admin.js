import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
// import Cropper from "react-easy-crop";
import Cropper from "cropperjs";

import Dropzone from "react-dropzone";
import { Redirect, Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import Switch from "react-switch";

import CustomImg from "../../components/customImg/CustomImg";
import GoogleMap from "../../components/googleMap/GoogleMap";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import Popup from "../../components/popup/Popup";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import TimePicker from "./TimePicker";
import {
  EN_SHORT_TO_NUMBER,
  EN_SHORT_DAY_OF_WEEK,
  EN_SHORT_TO_RU_SHORT,
  SHORT_DAY_OF_WEEK,
} from "../../constants";
import { numberDayNow } from "../../calculateTime";
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  downloadBase64File,
} from "./EncodeToBase64";
import SideBar from "./Sidebar";

import "./admin.css";
import "./sidebar.css";
import "cropperjs/dist/cropper.min.css";
import "./imagecropper.css";

const MobileAdminMenuTitle = styled.p`
  text-align: center;
  padding-top: 20px;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
`;

const DescriptionWrap = styled.div`
  display: flex;
  flex-direction: column !important;
  font-size: 10px;
  margin-top: 10px;
  width: ${(props) => props.width && props.width};
  height: ${(props) => props.height && props.height};
`;

const LengthofDescription = styled.span`
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

const DisableStream = styled.span`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  div {
    display: flex;
    flex-direction: column;
  }
`;
const DayOffDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e32a6c;
  display: inline-block;
  top: -10px;
  position: relative;
  left: 2px;
`;

const Gray16px = styled.span`
  font-size: 16px;
  color: #6f6f6f;
`;

const Black18px = styled.span`
  font-size: 18px;
  color: #000;
`;

const Admin = (props) => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [DATA, setDATA] = useState([]);
  const [showPopupDatePicker, setShowPopapDatePicker] = useState(false);
  const [showPopupGoogleMap, setShowPopapGoogleMap] = useState(false);
  const [startTimePicker, setStartTimePicker] = useState("00:00");
  const [endTimePicker, setEndTimePicker] = useState("00:00");
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
  const [pseudonimOfCompany, setPseudonimOfCompany] = useState("");
  const [typeOfCompany, setTypeOfCompany] = useState("");
  const [typeOfCompanyId, setTypeOfCompanyId] = useState("");
  const [descOfCompany, setDescOfCompany] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [switchChecked, setSwitchChecked] = useState(null);
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

  const chooseNewAddress = (streetName, latLng) => {
    if (cookies.origin_data) {
      const stringLatLng = "" + latLng.lat + "," + latLng.lng;
      QUERY(
        {
          query: `mutation {
          updatePlace(
            input:{
              id:"${props.match.params.id}"
              address : "${streetName}"
              coordinates: "${stringLatLng}"
            }
          ){id address coordinates}
        }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            togglePopupGoogleMap();
            refreshData();
          } else {
          }
        })
        .catch((err) => console.log(err, "ADMIN UPDATEPLACE ERR"));
    }
  };

  const refreshData = () => {
    QUERY({
      query: `query {
      place (id:"${props.match.params.id}") {
        id name address description logo menu actions coordinates
        streams{url name id preview schedules{id day start_time end_time}}
        schedules {id day start_time end_time}
        categories {id name}
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
          if (!data.errors) {
            refreshData();
          } else {
            console.log(data.errors, "DELETESCHEDULE ERRORS");
          }
        })
        .catch((err) => console.log(err, "  DELETESCHEDULE ERR"));
    }
  };

  const updateStream = (name) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            updateStream (
              input:{
                id:"${DATA.streams[0].id}"
                url :"https://partycamera.org/${name}/index.m3u8"
                preview : "http://partycamera.org/${name}/preview.jpg"
              }
            ) { id name url }
          }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            refreshData();
          } else {
            console.log(data.errors, "UPDATESTREAM ERRORS");
          }
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
          if (!data.errors) {
            refreshData();
          } else {
            console.log(data.errors, "CREATE STREAM ERRORS");
          }
        })
        .catch((err) => console.log(err, "CREATE STREAM ERR"));
    }
  };

  const setStreamTimeOfOneDay = () => {
    if (cookies.origin_data) {
      if (DATA.streams[0] && !isEmptyTime) {
        // не пустое время стрима и стрим уже существет
        QUERY(
          {
            query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    update:[
                       {
                        id: ${clickedTime.id}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) {
                id name url
                }
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, " ERR"));
      }
      if (DATA.streams[0] && isEmptyTime) {
        // пустое время стрима и стрим уже существет
        QUERY(
          {
            query: `mutation {
              updateStream (
                input:{
                  id:"${DATA.streams[0].id}"
                  schedules:{
                    create:[
                       {
                        day: ${enumWeekName}
                        start_time: "${startTimePicker}"
                        end_time: "${endTimePicker}"
                      }
                    ]
                  }
                }
              ) {
                id name url
                }
            }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
              console.log(data, "FETCH data");
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, " ERR"));
      }
    }
  };

  const setWorkTimeOfOneDay = () => {
    if (cookies.origin_data) {
      if (isEmptyTime) {
        //СОЗДАТЬ время работы заведения
        QUERY(
          {
            query: `mutation {
              updatePlace(
                input:{
                  id:"${props.match.params.id}"
                  schedules:{
                    create:{
                      day: ${enumWeekName} start_time: "${startTimePicker}" end_time: "${endTimePicker}"
                    }
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
              refreshData();
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  ERR"));
      }

      if (!isEmptyTime) {
        //ИЗМЕНИТЬ время работы заведения
        QUERY(
          {
            query: `mutation {
          updateSchedule(
            input:{
              id:"${clickedTime.id}" start_time: "${startTimePicker}" end_time: "${endTimePicker}"
            }
          ){id}
        }`,
          },
          cookies.origin_data
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.errors) {
              refreshData();
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, " ERR"));
      }
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

  const togglePopupDatePicker = () => {
    showPopupDatePicker
      ? setShowPopapDatePicker(false)
      : setShowPopapDatePicker(true);
  };

  const togglePopupGoogleMap = () => {
    showPopupGoogleMap
      ? setShowPopapGoogleMap(false)
      : setShowPopapGoogleMap(true);
  };

  useEffect(() => {
    if (showPopupDatePicker || showPopupGoogleMap) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPopupDatePicker, showPopupGoogleMap]);

  const setStartTime = (h, m) => {
    setStartTimePicker("" + h + ":" + m);
  };
  const setEndTime = (h, m) => {
    setEndTimePicker("" + h + ":" + m);
  };

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
    localStorage.getItem("opened_li_admin")
      ? JSON.parse(localStorage.getItem("opened_li_admin"))
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
    localStorage.setItem("opened_li_admin", JSON.stringify(leftMenuSettings));
  }, [leftMenuSettings]);

  useEffect(() => {
    DATA.description && setDescOfCompany(DATA.description);
  }, [DATA.description]);

  useEffect(() => {
    DATA.name && setNameOfCompany(DATA.name);
  }, [DATA.name]);

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
                description:"${descOfCompany || DATA.description}"
                ${
                  typeOfCompanyId && typeOfCompanyId !== DATA.categories[0].id
                    ? `categories:{
                    disconnect:"${DATA.categories[0].id}"
                    connect:"${typeOfCompanyId}"
                  }`
                    : `categories:{}`
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
            console.log("SUCCESS");
            setIsSuccessSave(true);
            setTimeout(() => {
              setIsSuccessSave(false);
            }, 1000);
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  document.body.style.background = "#fff";

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(1 / 1);
  const [zoom, setZoom] = useState(1.5);
  const [imgSrc, setImgSrc] = useState(null);
  const [naturalImageSize, setNaturalImageSize] = useState({});
  const [currentImageSize, setCurrentImageSize] = useState({});
  const [imgSrcExt, setImgSrcExt] = useState(null);
  const imagePreviewCanvas = useRef(null);

  const imageMaxSize = 10000000000;
  const acceptedFileTypes =
    "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
  const acceptedFileTypesArray = acceptedFileTypes
    .split(",")
    .map((item) => item.trim());

  const onCropComplete = (crop) => {
    const canvasRef = imagePreviewCanvas.current;

    image64toCanvasRef(
      canvasRef,
      imgSrc,
      crop,
      naturalImageSize,
      currentImageSize
    );
  };

  const imageElementRef = useRef(null);
  const [imageDestination, setImageDestination] = useState("");

  useEffect(() => {
    if (imageElementRef.current) {
      const cropper = new Cropper(imageElementRef.current, {
        zoomable: true,
        scalable: true,
        aspectRatio: 1,
        rotatable: true,
        crop: () => {
          const canvas = cropper.getCroppedCanvas();
          setImageDestination(canvas.toDataURL("image/png"));
        },
      });
    }
  }, [imageElementRef.current]);

  // function submitImage() {
  //   const formData = new FormData();
  //   formData.append("file", currentImage);

  //   fetch("http://194.87.95.37/graphql", {
  //     method: "POST",
  //     mode: "cors",
  //     body: JSON.stringify(formData),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: cookies.origin_data
  //         ? "Bearer " + cookies.origin_data
  //         : "",
  //     },
  //   })
  //     .then((res) => console.log(res, "RES"))
  //     .catch((err) => console.log(err, " ERR"));
  // }

  const downloadImgFromCanvas = () => {
    if (imgSrc && imgSrcExt) {
      const canvasRef = imagePreviewCanvas.current;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);

      const myFileName = "preview." + imgSrcExt;

      if (imageData64.length > 8) {
        downloadBase64File(imageData64, myFileName);
        handeleClearToDefault();
        // submitImage();
      } else {
        alert("Нужно обрезать изображение");
      }
    }
  };

  const handeleClearToDefault = () => {
    const canvasRef = imagePreviewCanvas.current;
    const ctx = canvasRef.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    setImgSrc(null);
    setImgSrcExt(null);
  };

  const verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];

      setCurrentImage(currentFile);
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
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
    if (rejectedFiles && rejectedFiles.length > 0) {
      console.log(rejectedFiles, "---rejectedFiles");
      verifyFile(rejectedFiles);
    }
    if (files && files.length > 0) {
      const isVerified = verifyFile(files);
      if (isVerified) {
        // Base64data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();

        myFileItemReader.onloadend = function (theFile) {
          var image = new Image();
          image.onload = function () {
            setNaturalImageSize({ width: this.width, height: this.height });
          };
          image.src = theFile.target.result;
        };

        myFileItemReader.addEventListener(
          "load",
          (theFile) => {
            const myResult = myFileItemReader.result;
            setImgSrc(myResult);
            setImgSrcExt(extractImageFileExtensionFromBase64(myResult));
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  const isWorkTimeOrDayOff = (oneDay, i) => {
    // const nextDay = () => {
    //   if (i) {
    //     return " (" + SHORT_DAY_OF_WEEK[tomorrowFromDay(i)] + ") ";
    //   } else {
    //     return "";
    //   }
    // };
    // const thisDay = () => {
    //   if (i) {
    //     return " (" + SHORT_DAY_OF_WEEK[i] + ") ";
    //   } else {
    //     return "";
    //   }
    // };

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
            {/* <span className="dayOfWeekGray">{thisDay()}</span> -{" "} */}
            {oneDay.end_time.replace(":", ".")}{" "}
            {/* <span className="dayOfWeekGray">{thisDay()}</span> */}
          </p>
        );
      } else {
        return (
          <p>
            {oneDay.start_time.replace(":", ".")}
            {" - "}
            {/* <span className="dayOfWeekGray">{thisDay()}</span> -{" "} */}
            {oneDay.end_time.replace(":", ".")}
            {/* <span> {nextDay()}</span> */}
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
    opacity: isSuccessSave ? 1 : 0,
    top: isSuccessSave ? 0 : 4999,
    config: { duration: 300 },
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
      (pseudonimOfCompany && !pseudonimOfCompany.match("^[a-zA-Z0-9]+$")) ||
      pseudonimOfCompany.length < 1
    ) {
      setValidationErr({
        pseudonimOfCompany: "только латиница и цифры и поле не пустое",
      });
      return false;
    } else {
      setValidationErr({});
      return true;
    }
  };

  useEffect(() => {
    // console.log(validationErr, "validationErr");
  }, [validationErr]);

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

  if (!Number(cookies.origin_id)) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div>
        <div
          onClick={(e) => {
            if (e.target.className !== "SlideSideMenu" && showSlideSideMenu) {
              hideSideMenu();
            }
          }}
        >
          <animated.div
            className="Admin"
            style={animateProps}
            onClick={(e) => {
              if (e.target.className !== "SlideSideMenu" && showSlideSideMenu)
                hideSideMenu();
            }}
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
              <div className="adminWrapper">
                {/* __________________DESCTOP__________________ */}
                <div className="leftAdminMenuDesctop">
                  <div className="leftAdminMenu">
                    <Link className={"goBackFromAdmin"} to={"/editCompany"}>
                      <span
                        style={{
                          fontSize: "18px",
                          paddingRight: "10px",
                          paddingBottom: "2px",
                        }}
                      >
                        &#8592;
                      </span>
                      К списку заведений
                    </Link>
                    <ul>
                      {leftMenuSettings.map((el, id) => {
                        return (
                          <li
                            key={id}
                            className={
                              el.clicked
                                ? "clickedLeftAdminBtn"
                                : "LeftAdminBtn"
                            }
                            onClick={() => {
                              setLeftMenuSettings((prev) => {
                                let newArr = [...prev];
                                newArr.forEach((el) => (el.clicked = false));
                                newArr[id] = {
                                  ...newArr[id],
                                  clicked: true,
                                };
                                return newArr;
                              });
                            }}
                          >
                            {el.img && (
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  marginRight: "16px",
                                }}
                              >
                                <CustomImg
                                  className={el.class}
                                  alt={el.altImg}
                                  name={el.img}
                                />
                              </div>
                            )}
                            {el.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="adminContentDesctop">
                  {leftMenuSettings.map((el, i) => {
                    if (el.clicked && i === 0) {
                      return (
                        <div key={i}>
                          <div style={{ display: "flex" }}>
                            <h3
                              style={{
                                fontSize: "24px",
                                lineHeight: "24px",
                              }}
                            >
                              ПРОФИЛЬ ЗАВЕДЕНИЯ
                            </h3>
                            <span
                              style={{
                                paddingLeft: "12px",
                                color: "#E32A6C",
                                fontWeight: "bold",
                                fontSize: "24px",
                                lineHeight: "24px",
                              }}
                            >
                              ({DATA.name})
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: "22px",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <div>
                              {imgSrc ? (
                                <div>
                                  <div
                                    className="cropWrapper"
                                    style={{
                                      position: "relative",
                                      height: "250px",
                                      background: "#fff",
                                    }}
                                  >
                                    <div className="img-container">
                                      <img
                                        ref={imageElementRef}
                                        src={imgSrc}
                                        alt="src"
                                      />
                                    </div>

                                    {/* <img
                                      className="img-preview"
                                      src={imageDestination}
                                      alt="destination"
                                    /> */}
                                    {/* <Cropper
                                      style={{
                                        containerStyle: {
                                          background: "#fff",
                                          maxWidth: "250px",
                                          maxHeight: "250px",
                                        },
                                      }}
                                      image={imgSrc}
                                      crop={crop}
                                      zoom={zoom}
                                      onZoomChange={setZoom}
                                      aspect={aspect}
                                      onCropChange={setCrop}
                                      onCropComplete={(
                                        croppedArea,
                                        croppedAreaPixels
                                      ) => {
                                        onCropComplete(croppedAreaPixels);
                                      }}
                                      onMediaLoaded={({
                                        naturalWidth,
                                        naturalHeight,
                                      }) => {
                                        setCurrentImageSize({
                                          width: naturalWidth,
                                          height: naturalHeight,
                                        });
                                      }}
                                    /> */}
                                    <canvas
                                      className="cropCanvasImage"
                                      ref={imagePreviewCanvas}
                                    ></canvas>
                                  </div>
                                  {/* <span
                                    onClick={downloadImgFromCanvas}
                                    style={{}}
                                  >
                                    Скачать
                                  </span> */}
                                </div>
                              ) : (
                                <div
                                  className="previewPhoto"
                                  onClick={() =>
                                    document
                                      .querySelector(".previewRef")
                                      .click()
                                  }
                                >
                                  <p className="uploadPhotoTextDesctop">
                                    Загрузить фото
                                  </p>
                                  <p className="uploadPhotoSizeTextDesctop">
                                    250 X 250
                                  </p>
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
                                          Удалить
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
                                <DescriptionWrap
                                  width={"100%"}
                                  height={"230px"}
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
                                  <LengthofDescription
                                    descOfCompany={descOfCompany}
                                    descOfCompanyLimit={descOfCompanyLimit}
                                  >
                                    {descOfCompany.length} /{" "}
                                    {descOfCompanyLimit}
                                  </LengthofDescription>
                                </DescriptionWrap>
                              </div>
                            </div>
                          </div>
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
                                  validationErr["pseudonimOfCompany"]
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
                                placeholder={DATA.name}
                                value={pseudonimOfCompany}
                                onChange={(e) =>
                                  setPseudonimOfCompany(
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
                                                background: "#e32a6c",
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
                                                background: "#e32a6c",
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
                                  value={DATA.address}
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
                                  checkValidationError() && updatePlaceData();
                                }}
                              >
                                СОХРАНИТЬ
                              </p>
                              <Link
                                to={"/editCompany"}
                                className="cancelBtnProfile"
                                onClick={() => {
                                  // cancelSave()
                                  setValidationErr({});
                                  setNameOfCompany(DATA.name);
                                  // setPseudonimOfCompany("");
                                  console.log(
                                    DATA.categories[0].id,
                                    "DATA.categories[0].id"
                                  );
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
                                                color: "#e32a6c",
                                              }
                                            : { fontWeight: "normal" }
                                        }
                                      >
                                        {EN_SHORT_TO_RU_SHORT[el.day]}

                                        {oneDay.start_time &&
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
                                        {numberDayNow === i && <DayOffDot />}
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
                                                color: "#E32A6C",
                                              }
                                            : {
                                                fontWeight: "normal",
                                              }
                                        }
                                      >
                                        {EN_SHORT_TO_RU_SHORT[el.day]}
                                        {oneDay.start_time &&
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
                                        {numberDayNow === i && <DayOffDot />}
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
                        <div key={i} className="streamAdminBlock">
                          <h3>СТРИМ</h3>
                          {!!DATA.streams && DATA.streams[0] && (
                            <div className="videoWrapAdminDesctop">
                              <VideoPlayer
                                preview={
                                  DATA.streams &&
                                  DATA.streams[0] &&
                                  DATA.streams[0].preview
                                }
                                src={
                                  DATA.streams &&
                                  DATA.streams[0] &&
                                  DATA.streams[0].url
                                }
                              />
                            </div>
                          )}
                          <DisableStream>
                            <div>
                              <Black18px>Отключить стрим</Black18px>
                              <Gray16px>Выключить до следующего дня</Gray16px>
                            </div>
                            <Switch
                              onChange={setSwitchChecked}
                              checked={switchChecked}
                              onColor="#e32a6c"
                              offColor="#999"
                              uncheckedIcon={false}
                              checkedIcon={false}
                            />
                          </DisableStream>
                          <div className="chooseStreamAddressDesc">
                            <div className="cameraAddressWrapper">
                              <span className="cameraAddresLable">
                                Адрес камеры:
                              </span>
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
                            </div>
                            <div style={{ display: "flex" }}>
                              <div
                                style={{ marginRight: "19px" }}
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
                              <div
                                style={{ marginTop: "38px" }}
                                className="cancelBtnProfile"
                                onClick={() => {
                                  setStreamAddressData("");
                                }}
                              >
                                Отмена
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                {/* __________________MOBILE__________________ */}
                <div className="adminContentMobile">
                  <div className="adminMenuContainer">
                    <div className="menuBlockWrap ">
                      <div
                        className="menuBlock"
                        onClick={(e) => setStreamOpen(true)}
                      >
                        Стрим<span className="rotateArrow"></span>
                      </div>
                      {!!DATA.streams && DATA.streams[0] && (
                        <SideBar
                          isOpen={streamOpen}
                          right
                          pageWrapId={"page-wrap"}
                          outerContainerId={"App"}
                          width={"100%"}
                        >
                          <span
                            className="closeSidebarBtn"
                            onClick={() => closeAllSidebar()}
                          >
                            &#10006;
                          </span>
                          <MobileAdminMenuTitle>Стрим</MobileAdminMenuTitle>
                          <div className="videoWrapAdminMobile">
                            <VideoPlayer
                              preview={DATA.streams[0].preview}
                              src={DATA.streams[0].url}
                            />
                          </div>
                        </SideBar>
                      )}
                    </div>
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
                          isOpen={profileOpen}
                          right
                          pageWrapId={"page-wrap"}
                          outerContainerId={"App"}
                          width={"100%"}
                        >
                          <span
                            className="closeSidebarBtn"
                            onClick={() => closeAllSidebar()}
                          >
                            &#10006;
                          </span>
                          <MobileAdminMenuTitle>
                            Профиль заведения
                          </MobileAdminMenuTitle>

                          <div className="uploadFileContainer">
                            <div className="uploadFile">
                              {imgSrc ? (
                                <div
                                  className="cropWrapper"
                                  style={{
                                    position: "relative",
                                    height: "250px",
                                    background: "#fff",
                                  }}
                                >
                                  {/* <Cropper
                                    style={{
                                      containerStyle: {
                                        maxHeight: "250px",
                                      },
                                      mediaStyle: {
                                        maxHeight: "250px",
                                      },
                                    }}
                                    image={imgSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    onZoomChange={setZoom}
                                    aspect={aspect}
                                    onCropChange={setCrop}
                                    onCropComplete={(
                                      croppedArea,
                                      croppedAreaPixels
                                    ) => {
                                      onCropComplete(croppedAreaPixels);
                                    }}
                                    onMediaLoaded={({
                                      naturalWidth,
                                      naturalHeight,
                                    }) => {
                                      setCurrentImageSize({
                                        width: naturalWidth,
                                        height: naturalHeight,
                                      });
                                    }}
                                  /> */}
                                  <br />
                                  {/* <span onClick={downloadImgFromCanvas}>
                                  Скачать
                                </span>
                                <span onClick={handeleClearToDefault}>
                                  Очистить
                                </span> */}
                                  <canvas
                                    className="cropCanvasImage"
                                    ref={imagePreviewCanvas}
                                  ></canvas>
                                </div>
                              ) : (
                                <div
                                  className="previewPhoto"
                                  onClick={() =>
                                    document
                                      .querySelector(".previewRef")
                                      .click()
                                  }
                                >
                                  <p>Загрузить фото</p>
                                  <p>250 X 250</p>
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
                            <div className="inputBlockWrap">
                              <p
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
                                style={
                                  validationErr["pseudonimOfCompany"]
                                    ? { color: "red" }
                                    : {}
                                }
                              >
                                Псевдоним:
                                <span style={{ color: "red" }}>*</span>
                              </p>
                              <input
                                type="text"
                                placeholder={DATA.name}
                                value={pseudonimOfCompany}
                                onChange={(e) =>
                                  setPseudonimOfCompany(
                                    e.target.value.toLowerCase()
                                  )
                                }
                              />
                            </div>
                            <div className="bigInputBlockWrap">
                              <p>Категория:</p>
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
                                                background: "#e32a6c",
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
                                                background: "#e32a6c",
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
                                        {el.name}
                                      </span>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="inputBlockWrap">
                              <p className="addressTextMobile">
                                Адрес заведения:
                              </p>
                              <div className="mobileAddresColumn">
                                <input type="text" value={DATA.address} />
                                <p
                                  className="chooseAddressDesc"
                                  onClick={() => togglePopupGoogleMap()}
                                >
                                  ВЫБРАТЬ АДРЕС НА КАРТЕ
                                </p>
                              </div>
                            </div>
                            <div className="inputBlockWrap">
                              <p>Описание:</p>
                              <LengthofDescription
                                descOfCompany={descOfCompany}
                                descOfCompanyLimit={descOfCompanyLimit}
                              >
                                {descOfCompany.length} / {descOfCompanyLimit}
                              </LengthofDescription>
                              <textarea
                                className="descTextarea"
                                maxLength={descOfCompanyLimit}
                                value={descOfCompany}
                                onChange={(e) =>
                                  setDescOfCompany(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <p
                                style={{ marginRight: "20px" }}
                                className="saveBtnProfile"
                                onClick={() => {
                                  checkValidationError() && updatePlaceData();
                                }}
                              >
                                СОХРАНИТЬ
                              </p>
                              <Link
                                to={"/editCompany"}
                                className="cancelBtnProfile"
                                style={{ marginTop: "10px" }}
                                onClick={() => {
                                  //  cancelSave()
                                  setValidationErr({});
                                  setNameOfCompany(DATA.name);
                                  // setPseudonimOfCompany("");
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
                        </SideBar>
                      </div>
                    </div>
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
                          <div>
                            <span
                              className="closeSidebarBtn"
                              onClick={() => closeAllSidebar()}
                            >
                              &#10006;
                            </span>
                            <MobileAdminMenuTitle>
                              График работы
                            </MobileAdminMenuTitle>
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
                                                    color: "#E32A6C",
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
                                                togglePopupDatePicker();
                                                setClickedTime(oneDay); //объект для отправки запроса
                                                setIsSetWorkTimeDPick(true);
                                              } else {
                                                setIsEmptyTime(true);
                                                setEnumWeekName(el.day);
                                                setStartRealTimeInPicker(
                                                  "00:00"
                                                );
                                                setEndRealTimeInPicker("00:00");
                                                togglePopupDatePicker();
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
                        </SideBar>
                      </div>
                    </div>
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
                          <div>
                            <span
                              className="closeSidebarBtn"
                              onClick={() => closeAllSidebar()}
                            >
                              &#10006;
                            </span>
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
                            <MobileAdminMenuTitle>
                              График трансляций
                            </MobileAdminMenuTitle>
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
                                                  color: "#E32A6C",
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
                                                togglePopupDatePicker();
                                                setClickedTime(oneDay);
                                                setIsSetWorkTimeDPick(false);
                                              } else {
                                                setIsEmptyTime(true); //пустое время
                                                setEnumWeekName(el.day);
                                                setStartRealTimeInPicker(
                                                  "00:00"
                                                );
                                                setEndRealTimeInPicker("00:00");
                                                togglePopupDatePicker();
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
                        </SideBar>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </animated.div>

          <SlideSideMenu isShowMenu={isShowMenu} />
          {showPopupDatePicker && (
            <Popup
              togglePopup={togglePopupDatePicker}
              wrpaStyle={windowWidth <= 760 ? { alignItems: "flex-end" } : {}}
              style={
                windowWidth <= 760
                  ? {}
                  : { borderRadius: "5px", transform: "scale(1.5)" }
              }
            >
              <div className="popupWrapper">
                <span className="closePopupBtn" onClick={togglePopupDatePicker}>
                  &#215;
                </span>
                <div className="TimePickerContainer">
                  <TimePicker
                    realTimeInPicker={startRealTimeInPicker}
                    timePickerName={
                      EN_SHORT_TO_RU_SHORT[enumWeekName] ||
                      EN_SHORT_TO_RU_SHORT[clickedTime.day]
                    }
                    setTime={setStartTime}
                  />
                  <span className="space"></span>
                  <TimePicker
                    realTimeInPicker={endRealTimeInPicker}
                    timePickerName={
                      startTimePicker.split(":")[0] * 3600 +
                        startTimePicker.split(":")[1] * 60 <=
                      endTimePicker.split(":")[0] * 3600 +
                        endTimePicker.split(":")[1] * 60
                        ? EN_SHORT_TO_RU_SHORT[enumWeekName] ||
                          EN_SHORT_TO_RU_SHORT[clickedTime.day]
                        : SHORT_DAY_OF_WEEK[
                            tomorrowFromDay(
                              EN_SHORT_TO_NUMBER[
                                enumWeekName || clickedTime.day
                              ]
                            )
                          ]
                    }
                    setTime={setEndTime}
                  />
                </div>
                <p
                  className="makeAsDayOffMobile"
                  onClick={() => {
                    setAsDayOf();
                    togglePopupDatePicker();
                  }}
                >
                  Сделать выходным
                </p>
                <div style={{ display: "flex" }}>
                  <div
                    className="saveBtn"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      togglePopupDatePicker();
                      isSetWorkTimeDPick && setWorkTimeOfOneDay();
                      !isSetWorkTimeDPick && setStreamTimeOfOneDay();
                    }}
                  >
                    Сохранить
                  </div>
                  <div
                    className="cancelBtn"
                    onClick={() => togglePopupDatePicker()}
                  >
                    Отмена
                  </div>
                </div>
              </div>
            </Popup>
          )}
          {showPopupGoogleMap && (
            <Popup
              togglePopup={togglePopupGoogleMap}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <GoogleMap
                initialCenterMap={
                  DATA.coordinates
                    ? {
                        lat: Number(DATA.coordinates.split(",")[0]),
                        lng: Number(DATA.coordinates.split(",")[1]),
                      }
                    : null
                }
                togglePopupGoogleMap={togglePopupGoogleMap}
                chooseNewAddress={chooseNewAddress}
                isNewAddress
              />
            </Popup>
          )}
        </div>
        {/* {isSuccessSave && ( */}
        <animated.div
          style={
            ({
              position: "absolute",
              top: "4999px",
              left: 0,
              right: 0,
              bottom: 0,
              height: "100%",
              width: "100%",
              zIndex: -10,
              background: "red",
              boxShadow: "0 0  1000px rgba(0,0,0,0.7) inset",
            },
            animateSavedProps)
          }
        >
          <div
            style={{
              // position: "relative",
              // top: 0,
              // left: 0,
              // right: 0,
              // bottom: 0,
              height: "100%",
              width: "100%",
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <p
              style={
                ({
                  background: "#FFFFFF",
                  border: "2px solid #AEAEAE",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                  height: "53px",
                  width: "245px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  top: "calc(50vh - 26px)",
                  left: "calc(50vw - 122px)",
                  fontWeight: "bold",
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#4F4F4F",
                  textTransform: "uppercase",
                  opacity: 1,
                  boxShadow: "0 0  1000px 1000px rgba(255,255,255,0.4)",
                },
                isSuccessSave ? { zIndex: 4 } : { zIndex: 0 })
              }
            >
              Сохранено
            </p>
          </div>
        </animated.div>
        {/* )} */}
      </div>
    );
  }
};

export default Admin;
