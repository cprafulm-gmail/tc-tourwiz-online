import React from "react";
import Slider1 from "../../../assets/images/customer-portal/template-images/VideoBGImage.png";
import { Link } from "react-router-dom";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";

const CMSVideo = ({ sliderImages, cmsSettings, imageSliderContent }) => {
  //let imgSlider = sliderImages.length > 0 ? sliderImages[0].imagePath : Slider1;
  return (
    <div className="cp-home-video position-relative">
      <div className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          {/* <h2>VIDEO WILL COME IN THIS PLACE</h2>
          <p>with parallax effect</p> */}
        </div>
      </div>
      <iframe
        className="videoFrame"
        width="100%"
        src="https://www.youtube.com/embed/rc1hXYMKdwg"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {/* <img src={Slider1} alt="" /> */}
    </div>
  );
};

export default CMSVideo;
