import React, { useEffect, useRef, useState } from "react";
import ReactAwesomePlayer from "react-awesome-player";

import "./videoPlayer.css";

const VideoPlayer = ({ src, autoplay, muted, preview }) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isVideoErr, setIsVideoErr] = useState(false);

  const options = {
    autoplay: autoplay,
    muted: muted,
    poster: "",
    fluid: true,
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

  const play = () => {
    setIsPlay(true);
    videoRef.current.player.play();
  };

  const playing = () => {
    setIsPlay(true);
    videoRef.current.player.play();
    // onErr && onErr(false);
  };

  const error = () => {
    setIsVideoErr("Ошибка");
    // onErr && onErr("Ошибка");
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {!isPlay && !isVideoErr && (
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
      )}
      {!isVideoErr ? (
        <ReactAwesomePlayer
          ref={videoRef}
          options={options}
          play={play}
          playing={playing}
          error={error}
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
