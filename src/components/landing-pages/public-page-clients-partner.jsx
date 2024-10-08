import React from "react";
import OurClients from "../../assets/images/tw/our-clients.png";

const PublicPageClients = () => {
  return (
    <div className="tw-clients mt-5">
      <div className="container">
        <div className="row">
          {/* <div className="col-lg-3 d-flex align-items-center">
            <h2>Our Clients</h2>
          </div>
          <div className="col-lg-9">
            <img src={OurClients} alt="Our Clients" />
          </div> */}
          <div className="col-lg-12">
            <h3 style={{ fontWeight: "600" }}>
              Trusted by <b>26000+</b> Travel Professionals Globally
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPageClients;
