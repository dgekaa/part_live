import React, { useState, useEffect, useRef } from "react";
import GoogleMap from "../../components/googleMap/GoogleMap";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";

import { useCookies } from "react-cookie";
import Header from "../../components/header/Header";
import SlideSideMenu from "../../components/slideSideMenu/SlideSideMenu";
import BottomMenu from "../../components/bottomMenu/BottomMenu";
import Popup from "../../components/popup/Popup";
import Loader from "../../components/loader/Loader";
import QUERY from "../../query";
import { EN_SHORT_DAY_OF_WEEK, EN_SHORT_TO_RU_SHORT } from "../../constants";
import { numberDayNow } from "../../calculateTime";
import ReactCrop from "react-image-crop";
import Dropzone from "react-dropzone";
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
  downloadBase64File,
} from "./EncodeToBase64";

import "./reactCrop.css";
import "./admin.css";
import { Redirect } from "react-router-dom";

const TimePicker = ({ timePickerName, setTime, realTimeInPicker }) => {
  const [hours, setHours] = useState(realTimeInPicker.split(":")[0]);
  const [minutes, setMinutes] = useState(realTimeInPicker.split(":")[1]);

  const clickHandlerTop = (e, max) => {
    e.target.nextSibling.innerText = +e.target.nextSibling.innerText + 1;
    if (+e.target.nextSibling.innerText === max) {
      e.target.nextSibling.innerText = 0;
    }
    if (+e.target.nextSibling.innerText < 10) {
      e.target.nextSibling.innerText = "0" + e.target.nextSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.nextSibling.innerText);
    } else {
      setMinutes(e.target.nextSibling.innerText);
    }
  };

  const clickHandlerBottom = (e, max) => {
    if (+e.target.previousSibling.innerText === 0) {
      e.target.previousSibling.innerText = max;
    }
    e.target.previousSibling.innerText =
      +e.target.previousSibling.innerText - 1;

    if (e.target.previousSibling.innerText < 10) {
      e.target.previousSibling.innerText =
        "0" + e.target.previousSibling.innerText;
    }
    if (max === 24) {
      setHours(e.target.previousSibling.innerText);
    } else {
      setMinutes(e.target.previousSibling.innerText);
    }
  };

  useEffect(() => {
    setTime(hours, minutes);
  }, [hours, minutes]);

  return (
    <div className="timePickerWrap">
      <p className="timePickerName">{timePickerName}</p>
      <div className="timePicker">
        <div className="timePickerHoursWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 24);
            }}
          ></span>
          <p className="timePickerHours">
            {realTimeInPicker && realTimeInPicker.split(":")[0]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => {
              clickHandlerBottom(e, 24);
            }}
          ></span>
        </div>
        <p className="twoDots">:</p>
        <div className="timePickerMinutesWrap">
          <span
            className="topArrow"
            onClick={(e) => {
              clickHandlerTop(e, 60);
            }}
          ></span>
          <p className="timePickerMinutes">
            {realTimeInPicker && realTimeInPicker.split(":")[1]}
          </p>
          <span
            className="bottomArrow"
            onClick={(e) => {
              clickHandlerBottom(e, 60);
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

const Admin = (props) => {
  const [showSlideSideMenu, setShowSlideSideMenu] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [clickedTime, setClickedTime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInput = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  !windowWidth && setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.onresize = function (e) {
      setWindowWidth(e.target.innerWidth);
    };
  });

  const chooseNewAddress = (streetName, latLng) => {
    const stringLatLng = "" + latLng.lat + "," + latLng.lng;

    if (cookies.origin_data) {
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
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (!data.errors) {
            togglePopupGoogleMap();
            refreshData();
          } else {
          }
        })
        .catch((err) => {
          console.log(err, "  *****************ERR");
        });
    }
  };

  const refreshData = () => {
    QUERY({
      query: `query {
      place (id:"${props.match.params.id}") {
        id name address description logo menu actions coordinates
        streams{url name id preview
          schedules{id day start_time end_time}
        }
        schedules {id day start_time end_time}
        categories {id name}
      }
  }`,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.errors) {
          setIsLoading(false);
          setDATA(data.data.place);
        } else {
          console.log(data.errors, " ERRORS");
        }
      })
      .catch((err) => {
        console.log(err, "  *****************ERR");
      });
  };

  const setAsDayOf = (id) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
            deleteSchedule(
              id:"${id || clickedTime.id}"
            ){id day start_time end_time}
          }`,
        },
        cookies.origin_data
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (!data.errors) {
            refreshData();
            console.log(data, " ??????????????????");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => {
          console.log(err, "  *****************ERR");
        });
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
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  const [uniqueCompanyType, setUniqueCompanyType] = useState();

  useEffect(() => {
    QUERY({
      query: `query {
        categories {
          id name slug
        }
      }`,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUniqueCompanyType(data.data.categories);
      })
      .catch((err) => {
        console.log(err, "  ERR");
      });
  }, []);

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
            console.log(data, "FETCH data");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
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
              console.log(data, "FETCH data");
            } else {
              console.log(data.errors, " ERRORS");
            }
          })
          .catch((err) => console.log(err, "  *******ERR"));
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
          .catch((err) => console.log(err, "  *******ERR"));
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
          .catch((err) => console.log(err, "  *******ERR"));
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
          .catch((err) => console.log(err, "  *******ERR"));
      }
    }
  };

  useEffect(() => {
    if (cookies.origin_data) {
      refreshData();
    }
  }, []);

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

  const selectFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = (e) => {
    if (selectedFile) {
      const fd = new FormData();
      fd.append("image", selectedFile, selectedFile.name);
      console.log(selectedFile, "---selecteedFile");
      console.log(fd, "---------======= fd");
    }
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
            img: "barIcon.png",
            altImg: "profile",
            clicked: true,
          },
          {
            name: "ГРАФИК РАБОТЫ",
            img: "clocklite.png",
            altImg: "work",
            clicked: false,
          },
          {
            name: "ГРАФИК ТРАНСЛЯЦИЙ",
            img: "video-camera.png",
            altImg: "camera",
            clicked: false,
          },
          {
            name: "СТРИМ",
            img: "streaming.png",
            altImg: "stream",
            clicked: false,
          },
        ]
  );

  useEffect(() => {
    localStorage.setItem("opened_li_admin", JSON.stringify(leftMenuSettings));
  }, [leftMenuSettings]);

  const [hoveredBtn, setHoveredBtn] = useState("");

  const [nameOfCompany, setNameOfCompany] = useState("");
  const [pseudonimOfCompany, setPseudonimOfCompany] = useState("");
  const [typeOfCompany, setTypeOfCompany] = useState("");
  const [typeOfCompanyId, setTypeOfCompanyId] = useState("");
  const [descOfCompany, setDescOfCompany] = useState("");

  useEffect(() => {
    DATA.description && setDescOfCompany(DATA.description);
  }, [DATA.description]);

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
            console.log(typeOfCompanyId, "typeOfCompanyId");
            console.log("SUCCESS");
          } else {
            console.log(data.errors, " ERRORS");
          }
        })
        .catch((err) => console.log(err, "  *******ERR"));
    }
  };

  document.body.style.background = "#fff";

  const [file, setFile] = useState("");
  const fileLoaderInput = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // const _handleSubmit = (e) => {
  //   console.log(e.target, "_handleSubmit ");

  //   e.preventDefault();
  //   // TODO: do something with -> this.state.file
  // };

  // const _handleImageChange = (e) => {
  //   console.log(e.target.files[0], "_handleImageChange ");
  //   e.preventDefault();

  //   let reader = new FileReader();
  //   let file = e.target.files[0];

  //   reader.onloadend = () => {
  //     setFile(file);
  //     setImagePreviewUrl(reader.result);
  //   };

  //   reader.readAsDataURL(file);
  // };

  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [imgSrc, setImgSrc] = useState(null);
  const [imgSrcExt, setImgSrcExt] = useState(null);
  const imagePreviewCanvas = useRef(null);

  const imageMaxSize = 10000000000;
  const acceptedFileTypes =
    "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
  const acceptedFileTypesArray = acceptedFileTypes
    .split(",")
    .map((item) => item.trim());

  const onCropComplete = (crop, pixelCrop) => {
    const canvasRef = imagePreviewCanvas.current;
    image64toCanvasRef(canvasRef, imgSrc, crop);
  };

  const downloadImgFromCanvas = () => {
    if (imgSrc && imgSrcExt) {
      const canvasRef = imagePreviewCanvas.current;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt); //качаем обрезаную картинку

      const myFileName = "preview." + imgSrcExt;

      if (imageData64.length > 8) {
        downloadBase64File(imageData64, myFileName);
        handeleClearToDefault();
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
      console.log(files, "---files");
      const isVerified = verifyFile(files);
      if (isVerified) {
        // Base64data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
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
          <div
            className="Admin"
            style={
              isShowMenu
                ? {
                    animation: "toLeft 0.3s ease",
                    position: "relative",
                    right: "200px",
                  }
                : {
                    animation: "toRight 0.3s ease",
                    position: "relative",
                  }
            }
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
              toSlideFixedHeader={isShowMenu}
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
                              <img
                                alt={el.altImg}
                                src={`${process.env.PUBLIC_URL}/img/${el.img}`}
                                className="eyeCompanyBlock"
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
                            <div>
                              <ReactCrop
                                src={imgSrc}
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                onComplete={(crop, pixelCrop) => {
                                  console.log(crop, "CROP");
                                  console.log(pixelCrop, "pixelCrop");
                                  onCropComplete(crop, pixelCrop);
                                }}
                                onImageLoaded={(image) =>
                                  console.log(image, "LOADED")
                                }
                              />
                              <br />
                              <p
                                onClick={() => {
                                  downloadImgFromCanvas();
                                }}
                              >
                                Скачать
                              </p>
                              <p
                                onClick={() => {
                                  handeleClearToDefault();
                                }}
                              >
                                Очистить
                              </p>
                              <canvas ref={imagePreviewCanvas}></canvas>
                            </div>
                          ) : (
                            <div className="previewPhoto">
                              <p>Загрузить фото</p>
                              <p>250 X 250</p>
                            </div>
                          )}
                          <Dropzone
                            multiple={false}
                            accept={acceptedFileTypes}
                            maxSize={imageMaxSize}
                            onDrop={(acceptedFiles, rejectedFiles) => {
                              handleOnDrop(acceptedFiles, rejectedFiles);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section>
                                <div
                                  className="changePhotoBlock"
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
                            )}
                          </Dropzone>

                          <div className="profileDataDesc">
                            <div className="inputBlockWrap">
                              <p>Название заведения:</p>
                              <input
                                type="text"
                                placeholder={DATA.name}
                                value={nameOfCompany}
                                onChange={(e) => {
                                  setNameOfCompany(e.target.value);
                                }}
                              />
                            </div>
                            <div className="inputBlockWrap">
                              <p>Псевдоним:</p>
                              <input
                                type="text"
                                placeholder={DATA.name}
                                value={pseudonimOfCompany}
                                onChange={(e) => {
                                  setPseudonimOfCompany(e.target.value);
                                }}
                              />
                            </div>
                            <div className="bigInputBlockWrap">
                              <p>Категория:</p>

                              <div className="categoryBtnWrap">
                                {uniqueCompanyType &&
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
                                        onMouseOver={() => {
                                          setHoveredBtn(el.name);
                                        }}
                                        onMouseOut={() => {
                                          setHoveredBtn("");
                                        }}
                                      >
                                        {typeOfCompany &&
                                        typeOfCompany === el.name ? (
                                          <img
                                            alt="Icon"
                                            className="сompanyNavImg"
                                            src={`${process.env.PUBLIC_URL}/img/${el.slug}_w.png`}
                                            width="30"
                                            height="30"
                                          />
                                        ) : !typeOfCompany &&
                                          DATA.categories &&
                                          DATA.categories[0] &&
                                          DATA.categories[0].name ===
                                            el.name ? (
                                          <img
                                            alt="Icon"
                                            className="сompanyNavImg"
                                            src={`${process.env.PUBLIC_URL}/img/${el.slug}_w.png`}
                                            width="30"
                                            height="30"
                                          />
                                        ) : hoveredBtn === el.name ? (
                                          <img
                                            alt="Icon"
                                            className="сompanyNavImg"
                                            src={`${process.env.PUBLIC_URL}/img/${el.slug}_w.png`}
                                            width="30"
                                            height="30"
                                          />
                                        ) : (
                                          <img
                                            alt="Icon"
                                            className="сompanyNavImg"
                                            src={`${process.env.PUBLIC_URL}/img/${el.slug}.png`}
                                            width="30"
                                            height="30"
                                          />
                                        )}

                                        {el.name}
                                      </span>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="inputBlockWrap">
                              <p className="addressText">Адрес заведения:</p>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "140px",
                                }}
                              >
                                <input type="text" value={DATA.address} />
                                <p
                                  className="chooseAddressDesc"
                                  onClick={() => {
                                    togglePopupGoogleMap();
                                  }}
                                >
                                  ВЫБРАТЬ АДРЕС НА КАРТЕ
                                </p>
                              </div>
                            </div>
                            <div className="inputBlockWrap">
                              <p>Описание:</p>
                              <textarea
                                className="descTextarea"
                                maxLength={300}
                                // placeholder={DATA.description}
                                value={descOfCompany}
                                onChange={(e) => {
                                  setDescOfCompany(e.target.value);
                                }}
                              />
                            </div>
                            <p
                              className="saveBtnProfile"
                              onClick={() => {
                                updatePlaceData();
                              }}
                            >
                              СОХРАНИТЬ
                            </p>
                          </div>
                        </div>
                      );
                    }
                    if (el.clicked && i === 1) {
                      return (
                        <div className="workTimeTableWrap">
                          <h3>ГРАФИК РАБОТЫ</h3>
                          <table className="tableWorkDesc">
                            <tbody>
                              {DATA.schedules &&
                                EN_SHORT_DAY_OF_WEEK.map((el, i) => {
                                  // console.log(
                                  //   el,
                                  //   i,
                                  //   "__________________________",
                                  //   numberDayNow
                                  // );
                                  const oneDay = SetNewTimeObject(
                                    DATA.schedules
                                  )[el.day];
                                  return (
                                    <tr key={i}>
                                      <td>{EN_SHORT_TO_RU_SHORT[el.day]}</td>

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
                                        {oneDay && oneDay.id
                                          ? oneDay.start_time +
                                            " - " +
                                            oneDay.end_time
                                          : "Выходной"}
                                      </td>
                                      <td
                                        className="doAsDayOfTd"
                                        onClick={() => {
                                          setAsDayOf(oneDay.id);
                                        }}
                                      >
                                        {oneDay && oneDay.id
                                          ? "Сделать выходным"
                                          : ""}
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
                                      <td>{EN_SHORT_TO_RU_SHORT[el.day]}</td>
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
                                        {oneDay && oneDay.id
                                          ? oneDay.start_time +
                                            " - " +
                                            oneDay.end_time
                                          : "Выходной"}
                                      </td>
                                      <td
                                        className="doAsDayOfTd"
                                        onClick={() => {
                                          setAsDayOf(oneDay.id);
                                        }}
                                      >
                                        {oneDay && oneDay.id
                                          ? "Сделать выходным"
                                          : ""}
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
                        <div className="streamAdminBlock">
                          <h3>СТРИМ</h3>
                          {!!DATA.streams && DATA.streams[0] && (
                            <div className="videoWrapAdminDesctop">
                              <VideoPlayer
                                src={
                                  DATA.streams &&
                                  DATA.streams[0] &&
                                  DATA.streams[0].url
                                }
                              />
                            </div>
                          )}
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
                                onInput={(e) => {
                                  setStreamAddressData(e.target.value);
                                }}
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
                        src={
                          DATA.streams && DATA.streams[0] && DATA.streams[0].url
                        }
                      />
                    </div>
                  )}
                  <div className="adminMenuContainer">
                    <div className="menuBlockWrap profile">
                      <div
                        className="menuBlock"
                        onClick={(e) => {
                          accordionHandler(e);
                        }}
                      >
                        Профиль заведения
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">
                        <div className="uploadFileContainer">
                          <h3>Загрузка изображения профиля</h3>
                          <div className="uploadFile">
                            <input
                              type="file"
                              ref={fileInput}
                              style={{ display: "none" }}
                              onChange={selectFile}
                            />
                            <div
                              className="pickFileBtn"
                              onClick={() => {
                                fileInput.current.click();
                              }}
                            >
                              <p className="chooseImg"> Выбрать изображение</p>
                            </div>

                            <div className="uploadFileBtn" onClick={uploadFile}>
                              Загрузить
                            </div>
                          </div>
                          <p className="fileName">
                            Название:{" "}
                            {selectedFile
                              ? selectedFile.name
                              : "Изображение отсутствует "}
                          </p>
                        </div>
                        <div className="pickAddress">
                          <h3>Выбрать адрес заведения</h3>
                          <p className="curAddress">
                            {DATA.address || "Адрес не задан"}
                          </p>
                          <p
                            onClick={() => {
                              togglePopupGoogleMap();
                            }}
                            className="chooseAddressBtn"
                          >
                            Выбрать адрес
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="menuBlockWrap workSchedule">
                      <div
                        className="menuBlock"
                        onClick={(e) => {
                          accordionHandler(e);
                        }}
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
                                    <td>{el.day}</td>
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
                                      {oneDay && oneDay.id
                                        ? oneDay.start_time +
                                          " - " +
                                          oneDay.end_time
                                        : "Выходной"}
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
                        onClick={(e) => {
                          accordionHandler(e);
                        }}
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
                            onInput={(e) => {
                              setStreamAddressData(e.target.value);
                            }}
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
                                    <td>{el.day}</td>
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
                                      {oneDay && oneDay.id
                                        ? oneDay.start_time +
                                          " - " +
                                          oneDay.end_time
                                        : "Выходной"}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="menuBlockWrap address">
                      <div
                        className="menuBlock"
                        onClick={(e) => {
                          accordionHandler(e);
                        }}
                      >
                        Адрес заведения
                        <span className="rotateArrow"></span>
                      </div>
                      <div className="drDownWrap">В разработке</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <BottomMenu
            style={{ borderTop: "1px solid #ECECEC" }}
            toSlideFixedBottomMenu={isShowMenu}
          />
          <SlideSideMenu isShowMenu={isShowMenu} />
          {showPopupDatePicker && (
            <Popup
              togglePopup={togglePopupDatePicker}
              wrpaStyle={{ alignItems: "flex-end" }}
            >
              <div className="popupWrapper">
                <span
                  className="closePopupBtn"
                  onClick={togglePopupDatePicker}
                ></span>
                <div className="TimePickerContainer">
                  <TimePicker
                    realTimeInPicker={startRealTimeInPicker}
                    timePickerName=""
                    setTime={setStartTime}
                  />
                  <span className="space"></span>
                  <TimePicker
                    realTimeInPicker={endRealTimeInPicker}
                    timePickerName=""
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
