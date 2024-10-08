import React from "react";
import HomeVideo from "../../assets/images/tw/TourWiz_Video.mp4";
import VideoLaptop from "../../assets/images/tw/Video-Section-Laptop.png";
import VideoPlay from "../../assets/images/tw/Video-Section-Play-logo.png";
import VideoPoster from "../../assets/images/tw/Video-Poster.png";
const playPause1 = () => {

  document.querySelector('.imgVideoPlay').click();
  //document.getElementById("divVideoBtn").style.visibility = 'visible';
  //playPause();

}
const playPause = () => {

  const twVideo = document.getElementById("HomeVideo");
  if (twVideo.paused) {
    twVideo.play();
    document.getElementById("divVideoBtn").style.visibility = 'hidden';
  }
  else {
    twVideo.pause();
    document.getElementById("divVideoBtn").style.visibility = 'visible';
    document.getElementById("divVideoBtn").style.visibility = 'visible';
  }
}


const HomePageVideo = (props) => {
  return (
    <div className="tw-home-video-bg">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <h2>What is TourWiz</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 mt-4">
            <img
              className="w-100 video-laptop-img"
              src={VideoLaptop}
              alt="How TourWiz works - Itinerary Builder, Travel CRM, Travel Accounting"
            />
            <div className="tw-video-play-btn" id="divVideoBtn">
              <img
                src={VideoPlay}
                onClick={playPause}
                className="imgVideoPlay"
                alt="How TourWiz works - Itinerary Builder, Travel CRM, Travel Accounting"
              /></div>
            <video
              height="495"
              id="HomeVideo"
              poster={VideoPoster}
              src={HomeVideo}
              type="video/mp4"
              controls="true"
              autoplay
              loop
              playsinline
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageVideo;
