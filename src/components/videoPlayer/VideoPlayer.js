import React from "react";
import ReactAwesomePlayer from "react-awesome-player";

const VideoPlayer = ({ src }) => {
  const options = {
    poster: "",
    fluid: true,
    sources: [
      {
        type: "application/x-mpegURL",
        src: src,
      },
    ],
  };

  const loadeddata = () => {};
  const canplay = () => {};
  const canplaythrough = () => {};
  const play = () => {};
  const pause = () => {};
  const waiting = () => {};
  const playing = () => {};
  const ended = () => {};
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
        onError={(err) => console.log(err, "ERRRRRR video")}
      />
    </div>
  );
};

export default VideoPlayer;
