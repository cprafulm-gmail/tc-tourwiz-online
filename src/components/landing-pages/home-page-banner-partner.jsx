import React from "react";
//import TwBannerMobile from "../../assets/images/tw/tw-partner-globe.png";
import TwBannerMobile from "../../assets/images/tw/001.png";

const HomePageBannerPartner = (props) => {
  return (
    <div className="tw-banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div>
              <h2 className="text-white">
                Reach 26000+ Agents Globally with the TourWiz Partner Program
              </h2>
              <h5 className="text-white">
                Add a powerful revenue growth channel to your business and boost your brand visibility and sales at no cost!
              </h5>
              <button
                onClick={() => { props.mode === "marketPlacePartner" ? props.handleLoginPopup("signup-partner") : props.handleLoginPopup("signup") }}
                className="btn btn-lg mt-3"
              >
                Become a Partner
              </button>
              <button
                onClick={props.handleVideo}
                className="btn btn-lg mt-3 tw-banner-video-btn d-none "
              >
                Watch Video
              </button>
            </div>
          </div>

          <div className="col-lg-5">
            <img
              //onClick={props.handleVideo}
              src={TwBannerMobile}
              alt="TourWiz - Virtual companion for travel professionals"
              style={{ width: "100%", }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageBannerPartner;
