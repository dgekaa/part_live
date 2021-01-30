import React, { useRef, useState, useEffect } from "react";
import ReactAwesomePlayer from "react-awesome-player";
import styled from "styled-components";

const VideoError = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #c4c4c4;
  padding: 30px;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  @media (max-width: 760px) {
    height: 380px;
  }
  @media (max-width: 560px) {
    height: 190px;
  }
`;

const Wrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const VideoPlayer = ({ src, autoplay, muted, preview }) => {
  const [isVideoErr, setIsVideoErr] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.video.style.height = "100%";
  }, []);

  const options = {
    autoplay: autoplay,
    muted: muted,
    poster: preview,
    fluid: true,
    sources: [
      {
        type: "application/x-mpegURL",
        src: src,
      },
    ],
  };

  const error = () => setIsVideoErr("Ошибка");

  return (
    <Wrap>
      {!isVideoErr ? (
        <ReactAwesomePlayer ref={videoRef} options={options} error={error} />
      ) : (
        <VideoError>
          Видео временно не работает. <br />
          Извините за неудобства.
        </VideoError>
      )}
    </Wrap>
  );
};

export default VideoPlayer;
