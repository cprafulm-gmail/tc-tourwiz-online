import React from "react";
import OurClients from "../../assets/images/tw/our-clients.png";
import Award1 from "../../assets/images/tw/Award-1.png";
import Award2 from "../../assets/images/tw/Award-2.png";
import Award3 from "../../assets/images/tw/Award-3.png";

const PublicPageClients = () => {
  return (
    <React.Fragment>
      <div className="tw-clients">
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-3 d-flex align-items-center">
            <h2>Our Clients</h2>
          </div>
          <div className="col-lg-9">
            <img src={OurClients} alt="Our Clients" />
          </div> */}
            <div className="col-lg-12">
              <h3>
                Trusted by <b>26000+</b> Travel Professionals Globally
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-award mt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-flex align-items-center">
              <h2>
                <b>Awards</b>
              </h2>
              {/* <button className="btn">See All Events</button> */}
            </div>
            <div className="col-lg-9">
              <div className="tw-award-bg">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="tw-award-box">
                      <img
                        src={Award1}
                        alt="TourWiz - Technology Product of The Year"
                        style={{ width: "100%" }}
                      />
                      <h4 style={{ display: "none" }}>
                        OTM Mumbai
                        <br />
                        9-11 February 2022
                      </h4>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="tw-award-box">
                      <img
                        src={Award2}
                        alt="TourWiz - Most Innovative Product"
                        style={{ width: "100%" }}
                      />
                      <h4 style={{ display: "none" }}>
                        SATTE
                        <br />
                        16-18 February 2022
                      </h4>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="tw-award-box">
                      <img
                        src={Award3}
                        alt="TourWiz - Travel Trade Partnership"
                        style={{ width: "100%" }}
                      />
                      <h4 style={{ display: "none" }}>
                        SATTE
                        <br />
                        16-18 February 2022
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
    </React.Fragment>
  );
};

export default PublicPageClients;
