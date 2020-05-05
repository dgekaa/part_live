import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import ReactCrop from "react-image-crop";
import Dropzone from "react-dropzone";
import { Redirect } from "react-router-dom";
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

import "./reactCrop.css";
import "./admin.css";

const DescriptionWrap = styled.div`
  display: flex;
  flex-direction: column !important;
  font-size: 10px;
  margin-top: 10px;
`;

const LengthofDesc = styled.span`
  padding-left: 10px;
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
                preview : "http://partycamera.org:80/${name}/preview.mp4"
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
    console.log("-----------------------");
    console.log(cookies.origin_data, "-----------------------");
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

  const accordionHandler = (e) => {
    if (e.target.nextSibling.style.maxHeight) {
      e.target.nextSibling.style.maxHeight = null;
      e.target.firstElementChild.style.transform = "rotate(0deg)";
    } else {
      e.target.nextSibling.style.maxHeight =
        e.target.nextSibling.scrollHeight + "px";
      e.target.firstElementChild.style.transform = "rotate(180deg)";
    }
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
          },
          {
            name: "ГРАФИК РАБОТЫ",
            img: "clocklite",
            altImg: "work",
            clicked: false,
          },
          {
            name: "ГРАФИК ТРАНСЛЯЦИЙ",
            img: "video-camera",
            altImg: "camera",
            clicked: false,
          },
          {
            name: "СТРИМ",
            img: "streaming",
            altImg: "stream",
            clicked: false,
          },
        ]
  );

  useEffect(() => {
    localStorage.setItem("opened_li_admin", JSON.stringify(leftMenuSettings));
  }, [leftMenuSettings]);

  useEffect(() => {
    DATA.description && setDescOfCompany(DATA.description);
  }, [DATA.description]);

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
                  typeOfCompanyId &&
                  `categories:{
                    disconnect:"${DATA.categories[0].id}"
                    connect:"${typeOfCompanyId}"}`
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
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  document.body.style.background = "#fff";

  const [crop, setCrop] = useState({ aspect: 1 / 1 });
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

  function submitImage() {
    const formData = new FormData();
    formData.append("file", currentImage);

    fetch("http://194.87.95.37/graphql", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: cookies.origin_data
          ? "Bearer " + cookies.origin_data
          : "",
      },
    })
      .then((res) => console.log(res, "RES"))
      .catch((err) => console.log(err, " ERR"));
  }

  const downloadImgFromCanvas = () => {
    if (imgSrc && imgSrcExt) {
      const canvasRef = imagePreviewCanvas.current;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);

      const myFileName = "preview." + imgSrcExt;

      if (imageData64.length > 8) {
        downloadBase64File(imageData64, myFileName);
        handeleClearToDefault();
        submitImage();
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

  const isWorkTimeOrDayOff = (oneDay) => {
    if (oneDay && oneDay.id) {
      return oneDay.start_time + " - " + oneDay.end_time;
    } else {
      return "Выходной";
    }
  };

  const isSetAsDayOff = (oneDay) => {
    if (oneDay && oneDay.id) {
      return "Сделать выходным";
    } else {
      return "";
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
    config: { duration: 100 },
  });

  const tomorrowFromDay = (day) => {
    if (day === 6) {
      return 0;
    } else {
      return day + 1;
    }
  };

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
                              <CustomImg
                                alt={el.altImg}
                                className="eyeCompanyBlock"
                                name={el.img}
                              />
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
                          {imgSrc ? (
                            <div className="cropWrapper">
                              <ReactCrop
                                src={imgSrc}
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={(crop) => onCropComplete(crop)}
                                onImageLoaded={({ width, height }) =>
                                  setCurrentImageSize({
                                    width,
                                    height,
                                  })
                                }
                              />
                              <br />
                              <span onClick={downloadImgFromCanvas}>
                                Скачать
                              </span>
                              <span onClick={handeleClearToDefault}>
                                Очистить
                              </span>
                              <canvas
                                className="cropCanvasImage"
                                ref={imagePreviewCanvas}
                              ></canvas>
                            </div>
                          ) : (
                            <div
                              className="previewPhoto"
                              onClick={() =>
                                document.querySelector(".previewRef").click()
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
                                <section>
                                  <div
                                    className="changePhotoBlock previewRef"
                                    {...getRootProps()}
                                  >
                                    <input
                                      className="changePhotoInput"
                                      {...getInputProps()}
                                    />
                                    <p className="changePhoto">
                                      Сменить фото профиля
                                    </p>
                                  </div>
                                </section>
                              );
                            }}
                          </Dropzone>
                          <div className="profileDataDesc">
                            <div className="inputBlockWrap">
                              <p>Название заведения:</p>
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
                              <p>Псевдоним:</p>
                              <input
                                type="text"
                                placeholder={DATA.name}
                                value={pseudonimOfCompany}
                                onChange={(e) =>
                                  setPseudonimOfCompany(e.target.value)
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
                              <p className="addressText">Адрес заведения:</p>
                              <div className="addressBlockWrapp">
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
                              <DescriptionWrap>
                                <LengthofDesc
                                  descOfCompany={descOfCompany}
                                  descOfCompanyLimit={descOfCompanyLimit}
                                >
                                  {descOfCompany.length} / {descOfCompanyLimit}
                                </LengthofDesc>

                                <textarea
                                  className="descTextarea"
                                  maxLength={descOfCompanyLimit}
                                  value={descOfCompany}
                                  onChange={(e) =>
                                    setDescOfCompany(e.target.value)
                                  }
                                />
                              </DescriptionWrap>
                            </div>
                            <p
                              className="saveBtnProfile"
                              onClick={() => updatePlaceData()}
                            >
                              СОХРАНИТЬ
                            </p>
                          </div>
                        </div>
                      );
                    }
                    if (el.clicked && i === 1) {
                      return (
                        <div key={i} className="workTimeTableWrap">
                          <h3>ГРАФИК РАБОТЫ</h3>
                          <table className="tableWorkDesc">
                            <tbody>
                              {DATA.schedules &&
                                EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                  const oneDay = SetNewTimeObject(
                                    DATA.schedules
                                  )[el.day];
                                  return (
                                    <tr key={i}>
                                      <td>
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
                                      </td>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "bold",
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
                                        {isWorkTimeOrDayOff(oneDay)}
                                      </td>
                                      <td
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
                          <h3>ГРАФИК ТРАНСЛЯЦИЙ</h3>
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
                                      <td>
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
                                      </td>
                                      <td
                                        style={
                                          numberDayNow === i
                                            ? {
                                                fontWeight: "bold",
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
                                        {isWorkTimeOrDayOff(oneDay)}
                                      </td>
                                      <td
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
                        </div>
                      );
                    }
                  })}
                </div>
                {/* __________________MOBILE__________________ */}
                <div className="adminContentMobile">
                  {!!DATA.streams && DATA.streams[0] && (
                    <div className="videoWrapAdminMobile">
                      <VideoPlayer
                        preview={DATA.streams[0].preview}
                        src={DATA.streams[0].url}
                      />
                    </div>
                  )}
                  <div className="adminMenuContainer">
                    <div className="menuBlockWrap profile">
                      <div
                        className="menuBlock"
                        onClick={(e) => accordionHandler(e)}
                      >
                        Профиль заведения
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">
                        <div className="uploadFileContainer">
                          <div className="uploadFile">
                            {imgSrc ? (
                              <div className="cropWrapper">
                                <ReactCrop
                                  src={imgSrc}
                                  crop={crop}
                                  onChange={(newCrop) => setCrop(newCrop)}
                                  onComplete={(crop) => onCropComplete(crop)}
                                  onImageLoaded={({ width, height }) =>
                                    setCurrentImageSize({
                                      width,
                                      height,
                                    })
                                  }
                                />
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
                                  document.querySelector(".previewRef").click()
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
                                  <section>
                                    <div
                                      className="changePhotoBlock"
                                      {...getRootProps()}
                                    >
                                      <input
                                        className="changePhotoInput previewRef"
                                        {...getInputProps()}
                                      />
                                      <p className="changePhoto">
                                        Сменить фото профиля
                                      </p>
                                    </div>
                                  </section>
                                );
                              }}
                            </Dropzone>
                          </div>
                        </div>
                        {/* ================================================= */}
                        <div className="profileDataDesc">
                          <div className="inputBlockWrap">
                            <p>Название заведения:</p>
                            <input
                              type="text"
                              placeholder={DATA.name}
                              value={nameOfCompany}
                              onChange={(e) => setNameOfCompany(e.target.value)}
                            />
                          </div>
                          <div className="inputBlockWrap">
                            <p>Псевдоним:</p>
                            <input
                              type="text"
                              placeholder={DATA.name}
                              value={pseudonimOfCompany}
                              onChange={(e) =>
                                setPseudonimOfCompany(e.target.value)
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
                                            DATA.categories[0].name === el.name
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
                                      onMouseOver={() => setHoveredBtn(el.name)}
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
                            <LengthofDesc
                              descOfCompany={descOfCompany}
                              descOfCompanyLimit={descOfCompanyLimit}
                            >
                              {descOfCompany.length} / {descOfCompanyLimit}
                            </LengthofDesc>
                            <textarea
                              className="descTextarea"
                              maxLength={descOfCompanyLimit}
                              value={descOfCompany}
                              onChange={(e) => setDescOfCompany(e.target.value)}
                            />
                          </div>
                          <p
                            className="saveBtnProfile"
                            onClick={() => updatePlaceData()}
                          >
                            СОХРАНИТЬ
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="menuBlockWrap workSchedule">
                      <div
                        className="menuBlock"
                        onClick={(e) => accordionHandler(e)}
                      >
                        График работы
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">
                        <table>
                          <tbody>
                            {DATA.schedules &&
                              EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                const oneDay = SetNewTimeObject(DATA.schedules)[
                                  el.day
                                ];
                                return (
                                  <tr key={i}>
                                    <td>{EN_SHORT_TO_RU_SHORT[el.day]}</td>
                                    <td
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
                                      {isWorkTimeOrDayOff(oneDay)}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="menuBlockWrap streamSchedule">
                      <div
                        className="menuBlock"
                        onClick={(e) => accordionHandler(e)}
                      >
                        График трансляций
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">
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
                                    <td>{EN_SHORT_TO_RU_SHORT[el.day]}</td>
                                    <td
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
                </div>
              </div>
            )}
          </animated.div>

          <SlideSideMenu isShowMenu={isShowMenu} />
          {showPopupDatePicker && (
            <Popup
              togglePopup={togglePopupDatePicker}
              wrpaStyle={windowWidth <= 760 ? { alignItems: "flex-end" } : {}}
              style={windowWidth <= 760 ? {} : { borderRadius: "5px" }}
            >
              <div className="popupWrapper">
                <span
                  className="closePopupBtn"
                  onClick={togglePopupDatePicker}
                ></span>
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
                <div
                  className="saveBtn"
                  onClick={() => {
                    togglePopupDatePicker();
                    isSetWorkTimeDPick && setWorkTimeOfOneDay();
                    !isSetWorkTimeDPick && setStreamTimeOfOneDay();
                  }}
                >
                  Сохранить
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
      </div>
    );
  }
};

export default Admin;
