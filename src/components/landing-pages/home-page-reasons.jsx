import React from "react";
import ReasonsIcon1 from "../../assets/images/tw/reasons-icon-1.png";
import ReasonsIcon2 from "../../assets/images/tw/reasons-icon-2.png";
import ReasonsIcon3 from "../../assets/images/tw/reasons-icon-3.png";
import ReasonsIcon4 from "../../assets/images/tw/reasons-icon-4.png";

const HomePageReasons = (props) => {
  return (
    <div className="tw-reasons mb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>4 More Reasons to Switch to TourWiz</h2>
            <h3>No Obligations | No Credit Card Required | No Commitments</h3>
            <h4>
              And lots of help to get you set up and expand your network for
              growth
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            <div className="tw-reasons-box">
              <img
                src={ReasonsIcon1}
                alt="TourWiz - Web & Mobile Friendly icon"
              />
              <p>
                Web & mobile-friendly to help you manage your agency from
                anywhere
              </p>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="tw-reasons-box">
              <img src={ReasonsIcon2} alt="TourWiz - High Data Security icon" />
              <p>
                High data security & 99.9% uptime guaranteed by Amazon cloud
                hosting
              </p>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="tw-reasons-box">
              <img src={ReasonsIcon3} alt="TourWiz - No APIs icon" />
              <p>
                You don’t need to have your own booking system/supplier APIs to
                use it
              </p>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="tw-reasons-box">
              <img src={ReasonsIcon4} alt="TourWiz - Easy on the pocket icon" />
              <p>
                Easy on the pocket - Available for a very low monthly
                subscription
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => props.handleLoginPopup("signup")}
          className="btn btn-lg"
        >
          Start Free
        </button>
      </div>
    </div>
  );
};

export default HomePageReasons;
