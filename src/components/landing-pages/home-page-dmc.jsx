import React from "react";
import { Link, Link as ReactLink } from "react-router-dom";
import ReasonsIcon1 from "../../assets/images/tw/features-agency-management.png";
import ReasonsIcon3 from "../../assets/images/tw/features-itinerary-builder.png";
import ReasonsIcon2 from "../../assets/images/tw/packages.png";
import ReasonsIcon4 from "../../assets/images/tw/reasons-icon-4.png";
import SaprSection from "../../assets/images/landing-pg/home-Info-sap.png";

const HomePageDMC = (props) => {
  return (
    <div className="tw-DMC text-center mb-4">
      <div className="container">
        {/* <div className="row mt-5">
          <div className="col-lg-12">
            <h3>Solutions For</h3>
          </div>
        </div> */}

        <div className="row mt-3 mb-1">

          <div className="col-lg-4">
            <div
              style={{ background: "#04040421", color: "#fff" }} className="merketplace-box pt-2 pb-2 pl-1 pr-1">
              <Link
                to="/travel-agents"
                className="text-white text-decoration-none"
              >
                <div className="tw-DMC-boxss">
                  {/* <img
                  src={ReasonsIcon1}
                  style={{ height: "76px" }}
                  alt="TourWiz - Web & Mobile Friendly icon"
                /> */}
                  <h3 className="mb-3 text-white">Travel Agents</h3>
                  <p style={{ fontSize: "13px" }}>
                    Efficiently manage your travel agency with tourwiz, Provide an OTA like experience
                  </p>
                  {/* <p className="text-center text-primary btn-link">Read more..</p> */}
                </div>
              </Link></div>
          </div>


          <div className="col-lg-4">
            <div
              style={{ background: "#04040421", color: "#fff" }} className="merketplace-box pt-2 pb-2 pl-1 pr-1">
              <Link
                to="/tour-operator"
                className="text-white text-decoration-none"
                style={{ background: "#04040421", color: "#fff" }}
              >
                <div className="tw-DMC-boxss">
                  {/* <img src={ReasonsIcon2} style={{ height: "76px" }} alt="TourWiz - High Data Security icon" /> */}
                  <h3 className="mb-3 text-white">DMC’s+Tour operators</h3>
                  <p style={{ fontSize: "13px" }}>
                    Create beautiful branded itineraries, email / whatsapp quotes, impress customers close deals
                  </p>
                  {/* <p className="text-center text-primary btn-link">Read more..</p> */}
                </div>
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              style={{ background: "#04040421", color: "#fff" }} className="merketplace-box pt-2 pb-2 pl-1 pr-1">
              <Link
                to="/content-partners"
                className="text-white text-decoration-none"
                style={{ background: "#04040421", color: "#fff" }}
              >
                <div className="tw-DMC-boxss">
                  {/* <img src={ReasonsIcon3} style={{ height: "76px" }} alt="TourWiz - No APIs icon" /> */}
                  <h3 className="mb-3 text-white">Content Partners</h3>
                  <p style={{ fontSize: "13px" }}>
                    Place offers, promotions on marketplace, Directly connect with agencies, increase reach
                  </p>
                  {/* <p className="text-center text-primary btn-link">Read more..</p> */}
                </div>
              </Link>
            </div>
          </div>
        </div>


        {/* 
        <button
          onClick={() => props.handleLoginPopup("signup")}
          className="btn btn-lg"
        >
          Start Free
        </button> */}
      </div>
    </div>
  );
};

export default HomePageDMC;
