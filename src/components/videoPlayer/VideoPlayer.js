import React from "react";
import ReactAwesomePlayer from "react-awesome-player";

// import "./typeNav.css";

const VideoPlayer = ({ src }) => {
  const options = {
    poster: "",

    sources: [
      {
        type: "application/x-mpegURL",
        src: src,
      },
    ],
  };

  const loadeddata = () => {
    console.log("loadeddata");
  };
  const canplay = () => {
    console.log("canplay");
  };
  const canplaythrough = () => {
    console.log("canplaythrough");
  };
  const play = () => {
    console.log("play");
  };
  const pause = () => {
    console.log("pause");
  };
  const waiting = () => {
    console.log("waiting");
  };
  const playing = () => {
    console.log("playing");
  };
  const ended = () => {
    console.log("ended");
  };
  const error = (err) => {
    console.log(err, "error");
  };
  return (
    <div>
      <ReactAwesomePlayer
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
        onError={(err) => console.log(err, "ERRRRRR")}
      />
    </div>
  );
};

export default VideoPlayer;
