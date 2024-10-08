import React from "react";
import Whoisit1 from "../../assets/images/tw/B1.png";
import Whoisit2 from "../../assets/images/tw/B2.png";
import Whoisit3 from "../../assets/images/tw/B3.png";
import Whoisit4 from "../../assets/images/tw/B4.png";
import Whoisit5 from "../../assets/images/tw/B5.png";
import Whoisit6 from "../../assets/images/tw/B6.png";

const HomePageReasons = (props) => {
  return (
    <div className="tw-whoisit">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2>Benefits of becoming a partner</h2>
            
          </div>
        </div>

        <div className="row justify-content-md-center">
          <div className="col-lg-4 mb-5">
            <div className="tw-whoisit-box">
              <img
                src={Whoisit1}
                alt="Direct connect with agents across the globe on one platform"
              />
              <p>Direct connect with <br />agents across the globe <br />on one platform
              </p>
            </div>
          </div>

          <div className="col-lg-4 mb-5">
            <div className="tw-whoisit-box">
              <img src={Whoisit2} alt="Get your products and deals in front of a wider audience" />
              <p>Get your products and <br />deals in front of a <br />wider audience
              </p>
            </div>
          </div>

          <div className="col-lg-4 mb-5">
            <div className="tw-whoisit-box">
              <img src={Whoisit3} alt="Drive more traffic to your website" />
              <p>Drive more traffic <br />to your website
              </p>
            </div>
          </div>

          <div className="col-lg-4 mb-5">
            <div className="tw-whoisit-box">
              <img src={Whoisit4} alt="Generate more B2B inquiries and bookings" />
              <p>Generate more <br />B2B inquiries and <br />bookings
              </p>
            </div>
          </div>

<div className="col-lg-4 mb-5 ">
  <div className="tw-whoisit-box">
    <img src={Whoisit5} alt="Cut down your marketing & advertising costs" />
    <p>Cut down your <br />marketing & <br />advertising costs
    </p>
  </div>
</div>

<div className="col-lg-4 mb-5">
  <div className="tw-whoisit-box">
    <img src={Whoisit6} alt="Get access to valuable intent and demand insights that you can use to generate even more business" />
    <p>Get access to valuable <br />intent and demand insights <br />that you can use to generate <br />even more business
    </p>
  </div>
</div>
        </div>

      </div>
    </div>
  );
};

export default HomePageReasons;
