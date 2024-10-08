import React, { useContext } from "react";
import Slider1 from "../../../assets/images/customer-portal/template-images/TripCentreBGImage.png";
import { Link } from "react-router-dom";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSSlider = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;

  const params = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // autoplay:{
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev"
    // },

    loop: true,
    breakpoints: {
      1024: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
  };
  return (
    <div className="cp-home-slider">

      <Swiper className="d-flex align-items-center justify-content-center" {...params}>
        {cmsContents.sliderContent.map((item, key) => {
          return (
            <div className="sliderContainer" key={key}>
              <div className="contentdivv align-items-center justify-content-center">
                <div className="text-left">
                  <h1 className="text-white w-100">{item.title}</h1>
                  <h3 className="text-white w-100">{item.description}</h3>
                  {false && (<Link className="btn btn-lg btn-primary mt-4 shadow" to="/login">
                    Sign In to Learn More
                  </Link>)}
                </div>
              </div>
              <img src={item.imagePath} alt="" style={{ height: "525px" }} />
            </div>
          );
        })}
      </Swiper>
    </div>
  );
};

export default CMSSlider;
