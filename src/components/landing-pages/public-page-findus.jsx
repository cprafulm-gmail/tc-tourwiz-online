import React from "react";
import ITM_Jaipur from "../../assets/images/tw/ITM_Jaipur.jpg";
import GPS_Pune from "../../assets/images/tw/global-panorama-logo.png";
import OTM_Mumbai from "../../assets/images/tw/OTM_Mumbai.png";
import SATTE_Gr_Noida from "../../assets/images/tw/SATTE_Gr_Noida.png";
import FindUs3 from "../../assets/images/tw/find-us-otm.png";
import FindUs4 from "../../assets/images/tw/find-us-ttf.png";
import FindUs5 from "../../assets/images/tw/find-us-iitm.png";
import FindUsITBAsia from "../../assets/images/tw/find-us-itb-singapore.png";
import TechPartner1 from "../../assets/images/landing-pg/Tech-Partner1.png";

const PublicPageFindus = () => {
  return (
    <div className="tw-findus">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 d-flex align-items-center">
            <h2>
              <b>Where to Meet Us</b>
              <br /> in 2023
            </h2>
            {/* <button className="btn">See All Events</button> */}
          </div>
          <div className="col-lg-9">
            <div className="tw-findus-bg">
              <div className="row justify-content-center">
                {/* <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUs11}
                      alt="TourWiz - Meet us at IITM Ahmedabad 10-11 March 2022"
                      style={{height:"84px"}}
                    />
                    <h4>
                    IITM Ahmedabad
                      <br />
                      10-11 March 2022
                    </h4>
                  </div>
                </div> */}
                {/* <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUs3}
                      alt="TourWiz - Meet us at OTM 14-16 March 2022"
                    />
                    <h4>
                      OTM Mumbai
                      <br />
                      14-16 March 2022
                    </h4>
                  </div>
                </div> */}

                {/* <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      style={{ width: "100%" }}
                      src={ITM_Jaipur}
                      alt="TourWiz - Meet us at ITM Jaipur 09-11 December 2022"
                    />
                    <h4>
                      ITM Jaipur
                      <br />
                      09-11 December 2022
                    </h4>
                  </div>
                </div> */}

                {/* <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      style={{ width: "100%" }}
                      src={OTM_Mumbai}
                      alt="TourWiz - Meet us at OTM Mumbai 02-04 February 2023"
                      style={{ width: "80%" }}
                    />
                    <h4>
                      OTM Mumbai
                      <br />
                      02-04 February 2023
                    </h4>
                  </div>
                </div> */}

                <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      style={{ width: "100%" }}
                      src={GPS_Pune}
                      alt="TourWiz - Meet us at GPS Connect Pune 24-25 March 2023"
                    />
                    <h4>
                      GPS Connect Pune
                      <br />
                      24-25 March 2023
                    </h4>
                  </div>
                </div>

                {/* <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUs3}
                      alt="TourWiz - Meet us at OTM Mumbai 2022"
                    />
                    <h4>
                      OTM
                      <br />
                      9-11 February 2022
                    </h4>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPageFindus;
