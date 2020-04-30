import React, { useEffect, useRef } from "react";
import ReactAwesomePlayer from "react-awesome-player";

// <video
// className="companyImg"
// src={item.streams[0].preview}
// autoPlay
// onError={(err) => setPreviewError(err)}
// />http://partycamera.org:80/klever/preview.mp4

const VideoPlayer = ({ src, autoplay, onErr, muted, preview }) => {
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
    console.log(videoRef.current, "CURRENT");
  }, []);

  const loadeddata = () => {};
  const canplay = () => {};
  const canplaythrough = () => {};
  const play = () => {};
  const pause = () => {};
  const waiting = () => {};
  const playing = () => onErr && onErr(false);
  const ended = () => {};
  const error = () => onErr && onErr("Ошибка");

  return (
    <div>
      <ReactAwesomePlayer
        ref={videoRef}
        options={options}
        loadeddata={loadeddata}
        canplay={canplay}
        canplaythrough={canplaythrough}
        play={play}
        pause={pause}
        waiting={waiting}
        playing={playing}
        ended={ended}
        error={error}
        onError={() => onErr && onErr("Ошибка")}
      />
    </div>
  );
};

export default VideoPlayer;
