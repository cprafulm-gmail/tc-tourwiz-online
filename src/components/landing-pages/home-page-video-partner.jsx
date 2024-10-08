import React from "react";
import HomeVideo from "../../assets/images/tw/TourWiz_Video.mp4";

const HomePageVideo = (props) => {
  return (
    <div className="tw-home-video-bg">
      <button className="btn" onClick={props.handleVideo}>
        X
      </button>
      <video
        src={HomeVideo}
        type="video/mp4"
        controls="true"
        autoplay
        loop
        playsinline
      ></video>
    </div>
  );
};

export default HomePageVideo;
