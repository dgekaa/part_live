import React, { useRef, useState, useEffect } from "react";
import ReactAwesomePlayer from "react-awesome-player";

import "./videoPlayer.css";

const VideoPlayer = ({ src, autoplay, muted, preview, disablePlayBtn }) => {
  // const [isPlay, setIsPlay] = useState(false);
  const [isVideoErr, setIsVideoErr] = useState(false);

  const options = {
    autoplay: autoplay,
    muted: muted,
    poster: preview,
    fluid: true,
    children: [
      // disablePlayBtn ? "" : "bigPlayButton",
      // "controlBar",
      "PosterImage",
      // "PictureInPictureToggle",
      // "LoadingSpinner",
    ],
    sources: [
      {
        type: "application/x-mpegURL",
        src: src,
      },
    ],
  };

  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.video.style.height = "100%";
  }, []);

  // const play = () => {
  //   setIsPlay(true);
  //   videoRef.current.player.play();
  // };

  // const playing = () => {
  // setIsPlay(true);
  // videoRef.current.player.play();
  // };

  const error = () => {
    setIsVideoErr("Ошибка");
  };

  // const pause = () => {
  // setIsPlay(false);
  // videoRef.current.player.pause();
  // };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
      {/* {!isPlay && !isVideoErr && (
        <video
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isPlay ? 0 : 3,
          }}
          src={preview}
          autoPlay
        />
      )} */}
      {!isVideoErr ? (
        <ReactAwesomePlayer
          ref={videoRef}
          options={options}
          // play={play}
          // playing={playing}
          error={error}
          // pause={pause}
        />
      ) : (
        <p
          style={{
            width: "100%",
            height: "100%",
            color: "#fff",
            textAlign: "center",
            padding: "30px",
            background: "#000",
          }}
        >
          Видео временно не работает. <br />
          Извините за неудобства.
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
