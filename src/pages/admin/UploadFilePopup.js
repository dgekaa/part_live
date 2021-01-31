import React, { useRef } from "react";
import { defaultColor } from "../../constants";
import styled from "styled-components";
import CropperMobile from "./CropperMobile";
import Dropzone from "react-dropzone";

import Popup from "../../components/popup/Popup";

const UploadFilePopup = ({
  togglePopupUploadFile,
  setImgSrc,
  titleInPicker,
  imgSrc,
  uploadImageTranscode,
  acceptedFileTypes,
  imageMaxSize,
  handleOnDrop,
}) => {
  const editorRef = useRef(null);

  const onCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImage().toDataURL();
      fetch(canvas)
        .then((res) => res.blob())
        .then((blob) => uploadImageTranscode(blob));
    }
  };

  return (
    <Popup
      togglePopup={togglePopupUploadFile}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="mobileTimePickerHeader"
        style={{
          height: "44px",
          borderBottom: "1px solid #ECECEC",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 25px",
        }}
      >
        <p
          style={{
            letterSpacing: "0.5px",
            color: defaultColor,
            fontSize: "16px",
            fontWeight: 500,
          }}
          onClick={() => {
            setImgSrc(null);
            togglePopupUploadFile();
          }}
        >
          Отмена
        </p>
        <p
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {titleInPicker}
        </p>
        <p
          style={{
            letterSpacing: "0.5px",
            color: defaultColor,
            fontSize: "16px",
            fontWeight: 500,
          }}
          onClick={() => {
            togglePopupUploadFile();
            onCrop();
          }}
        >
          Готово
        </p>
      </div>
      <CropperMobile imgSrc={imgSrc} editorRef={editorRef} />
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
              <div className="changePhotoBlock" {...getRootProps()}>
                <input
                  className="changePhotoInput previewRef"
                  {...getInputProps()}
                />
              </div>
            </section>
          );
        }}
      </Dropzone>
    </Popup>
  );
};

export default UploadFilePopup;
