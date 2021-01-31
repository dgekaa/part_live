import React, { useRef } from "react";
import { defaultColor } from "../../constants";
import styled from "styled-components";
import CropperMobile from "./CropperMobile";
import Dropzone from "react-dropzone";

import Popup from "../../components/popup/Popup";

const CancelSave = styled.p`
    letter-spacing: 0.5px;
    color: defaultColor;
    font-size: 16px;
    font-weight: 500;
  `,
  Title = styled.p`
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  `,
  MobileTimePickerHeader = styled.div`
    display: none;
    @media (max-width: 760px) {
      display: flex;
      margin-bottom: 31px;
      height: 44px;
      border-bottom: 1px solid #ececec;
      align-items: center;
      justify-content: space-between;
      padding: 0 25px;
    }
  `;

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
    },
    cancel = () => {
      setImgSrc(null);
      togglePopupUploadFile();
    },
    save = () => {
      togglePopupUploadFile();
      onCrop();
    };

  return (
    <Popup
      togglePopup={togglePopupUploadFile}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <MobileTimePickerHeader>
        <CancelSave onClick={() => cancel()}>Отмена</CancelSave>
        <Title>{titleInPicker}</Title>
        <CancelSave onClick={() => save()}>Готово</CancelSave>
      </MobileTimePickerHeader>
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
