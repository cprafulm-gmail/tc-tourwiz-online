import React, { Component } from "react";
import HowitworksMobileWeb from "../../assets/images/tw/H1.png";
import HowitworksMobileMobile from "../../assets/images/tw/H2.png";
import BulletPlus from "../../assets/images/tw/bullet-plus.png";
import BulletMinus from "../../assets/images/tw/bullet-minus.png";

  const HomePageHowitworksPartner = (props) => {
    return (
      <div className="tw-howitworks" style={{clear:"both"}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>How it Works</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <img
                className="tw-howitworks-info-img tw-howitworks-info-img-web"
                src={HowitworksMobileWeb}
                alt="See How it Works"
              />
            </div>
          </div>

          <div className="d-none row mt-5 mb-5 tw-howitworks-info-img-mobile">
            <div className="col-lg-12">
              <img
                src={HowitworksMobileMobile}
                alt="How TourWiz works - Itinerary Builder, Travel CRM, Travel Accounting"
              />
            </div>
          </div>
        
          <div className="row">
          <div className="col-lg-12">
            
        <button
          onClick={() => props.handleLoginPopup("signup")}
          className="btn btn-lg"
        >
          Become a Partner
        </button>
          </div>
        </div>
        </div>
      </div>
    )
  };
  export default HomePageHowitworksPartner;