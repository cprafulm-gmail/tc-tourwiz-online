import React from "react";
import Swiper from 'react-id-swiper';
import TwBannerMobile from "../../assets/images/tw/tw-banner-mobile.png";
import TwBannerSlide1 from "../../assets/images/tw/Slide-1.png";
import TwBannerSlide2 from "../../assets/images/tw/Slide-2.png";
import TwBannerSlide3 from "../../assets/images/tw/Slide-3.png";
import TwBannerSlide4 from "../../assets/images/tw/Slide-4.png";
import TwBannerSlide5 from "../../assets/images/tw/Slide-5.png";
import TwBannerSlide6 from "../../assets/images/tw/banner-image-AI.png";
import TwBannerSlide7 from "../../assets/images/tw/banner-image-marketplace.png";
import { Link as BrowserRouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import HomePageDMC from "./home-page-dmc";

const HomePageBanner = (props) => {
  const params = {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
      pauseOnMouseEnter: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }
  return (
    <div className="tw-banner" style={{ background: "linear-gradient(to right, #fa7438 0%, #891d9b 100%)" }}>
      <div className="container">
        <div className="row">
          <Swiper {...params}>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Take your Travel Business to the next level with Tourwiz B2B Marketplace
                  </h2>
                  <button
                    onClick={() => props.handleLoginPopup("signup")}
                    className="btn btn-lg mt-3"
                  >
                    Start Free
                  </button>
                  <BrowserRouterLink
                    className="btn btn-lg mt-3 btn-book-demo"
                    to={"/Preview"} target="_blank">
                    Preview
                  </BrowserRouterLink>

                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>


              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide7}
                  alt="TourWiz - Automate your accounting and generate accurate reconciliation and business reports"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    TourWizAI Lite<sup style={{ fontSize: "14px", top: "-20px" }}>BETA</sup> uses artificial intelligence to generate personalized itineraries.
                  </h2>
                  <button
                    onClick={() => props.handleLoginPopup("signup-ai-assistant")}
                    className="btn btn-lg mt-3"
                  >
                    Start Free
                  </button>
                  <Link to="/tourwizAI" className="btn btn-lg mt-3 btn-book-demo">Try It</Link>
                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>
              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide6}
                  alt="TourWiz - Automate your accounting and generate accurate reconciliation and business reports"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Virtual Companion helping 26k+ Travel Professionals Work Smarter & Double their Earnings
                  </h2>
                  <button
                    onClick={() => props.handleLoginPopup("signup")}
                    className="btn btn-lg mt-3"
                  >
                    Start Free
                  </button>
                  {/* <Link to="/book-demo" className="btn btn-lg mt-3 btn-book-demo">Book a Demo</Link> */}
                  <h3>No Commitments | No Credit Card Required</h3>
                  <button
                    onClick={props.handleVideo}
                    className="btn btn-lg mt-3 tw-banner-video-btn d-none "
                  >
                    Watch Video
                  </button>
                </div>
              </div>

              <div className="col-lg-5 slideImage">
                <img
                  onClick={props.handleVideo}
                  src={TwBannerSlide1}
                  alt="TourWiz - Virtual companion for travel professionals"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Generate more leads and bookings with a mobile-friendly website with your branding
                  </h2>
                  <button
                    onClick={() => props.handleRedirect("features", "customer-portal")}
                    className="btn btn-lg mt-3"
                  >
                    Learn More
                  </button>
                  {/* <Link to="/book-demo" className="btn btn-lg mt-3 btn-book-demo">Book a Demo</Link> */}
                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>

              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide2}
                  alt="TourWiz - Generate more leads and bookings with a mobile-friendly website with your branding"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Manage and track all your inquiries, customers and bookings from one place
                  </h2>
                  <button
                    onClick={() => props.handleRedirect("features", "travel-crm")}
                    className="btn btn-lg mt-3"
                  >
                    Learn More
                  </button>
                  {/* <Link to="/book-demo" className="btn btn-lg mt-3 btn-book-demo">Book a Demo</Link> */}
                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>

              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide3}
                  alt="TourWiz - Manage and track all your inquiries, customers and bookings from one place"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Effortlessly build stunning itineraries with TourWizAI Lite <sup>BETA</sup> Assistant and proposals that generate sales
                  </h2>
                  <button
                    onClick={() => props.handleRedirect("features", "itinerary-builder")}
                    className="btn btn-lg mt-3"
                  >
                    Learn More
                  </button>
                  {/* <Link to="/book-demo" className="btn btn-lg mt-3 btn-book-demo">Book a Demo</Link> */}
                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>

              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide4}
                  alt="TourWiz - Effortlessly build stunning itineraries and proposals that generate sales"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div className="col-lg-7 slideContent">
                <div>
                  <h2 className="text-white">
                    Automate your accounting and generate accurate reconciliation & business reports
                  </h2>
                  <button
                    onClick={() => props.handleRedirect("features", "accounting-reconciliation")}
                    className="btn btn-lg mt-3"
                  >
                    Learn More
                  </button>
                  {/* <Link to="/book-demo" className="btn btn-lg mt-3 btn-book-demo">Book a Demo</Link> */}
                  <h3>No Commitments | No Credit Card Required</h3>
                </div>
              </div>

              <div className="col-lg-5 slideImage">
                <img
                  src={TwBannerSlide5}
                  alt="TourWiz - Automate your accounting and generate accurate reconciliation and business reports"
                />
              </div>
            </div>
          </Swiper></div>
      </div>
      <div style={{ color: "#fff" }}>
        <div className="container">
          <div className="row">
            <HomePageDMC />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageBanner;
// 