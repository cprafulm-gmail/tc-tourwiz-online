import React from "react";
import FindUs11 from "../../assets/images/tw/find-us-iitm.jpg";
import FindUs1 from "../../assets/images/tw/find-us-wtm.png";
import FindUs2 from "../../assets/images/tw/find-us-satte.png";
import FindUs3 from "../../assets/images/tw/find-us-otm.png";
import FindUs4 from "../../assets/images/tw/find-us-ttf.png";
import FindUs5 from "../../assets/images/tw/find-us-iitm.png";
import FindUsITBAsia from "../../assets/images/tw/find-us-itb-singapore.png";


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

                <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUs3}
                      alt="TourWiz - Meet us at OTM 13-15 September 2022"
                    />
                    <h4>
                      OTM Mumbai
                      <br />
                      13-15 September 2022
                    </h4>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUsITBAsia}
                      alt="TourWiz - Meet us at ITB Singapore 19-21 October 2022"
                    />
                    <h4>
                      ITB Singapore
                      <br />
                      19-21 October 2022
                    </h4>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="tw-findus-box">
                    <img
                      src={FindUs1}
                      alt="TourWiz - Meet us at WTM London 7-9 November 2022"
                    />
                    <h4>
                      WTM London
                      <br />
                      7-9 November 2022
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
