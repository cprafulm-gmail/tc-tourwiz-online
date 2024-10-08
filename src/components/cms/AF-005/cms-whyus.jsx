import React, { useContext } from "react";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import SVGIcon from "../../../helpers/svg-icon";
import onlineBooking from "../../../assets/images/customer-portal/template-images/online-booking.svg";
import profits from "../../../assets/images/customer-portal/template-images/boxes.png";
import booking from "../../../assets/images/customer-portal/template-images/booking.svg";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSWhyus = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsContents } = cmsState;
  return (
    cmsContents.howItWorkContent !== undefined &&
    cmsContents.howItWorkContent !== "" && (
      <div className="cp-home-why-us">
        <div className="container">
          <p className="why-us-sub-title">WHY CHOOSE</p>
          <h2 className="why-us-title">THE TRIP CENTRE ? </h2>
          <div class="row">
            <br />
            <div class="col-lg-4 text-center">
              <div className="why-us-icon">
                <img style={{ width: "32px" }} src={onlineBooking} alt="" />
              </div>
              <h5>Trip centre Offers</h5>
              <p>
                A wide variety of services catering to all travel needs. From
                booking hotels to holidays packages to all ancillary services.
              </p>
            </div>
            <div class="col-lg-4 text-center">
              <div className="why-us-icon">
                <img style={{ width: "42px" }} src={profits} alt="" />
              </div>
              <h5>Assured best deals</h5>
              <p>
                Get instant best deals on our hand-picked collections designed for you!
                You can now get affordable and customized packages at your convenience.
              </p>
            </div>
            <div class="col-lg-4 text-center">
              <div className="why-us-icon">
                <img style={{ width: "42px" }} src={booking} alt="" />
              </div>
              <h5>Flawless Booking Experience</h5>
              <p>
                Basis on the valuable feedback from agents, the user friendly
                interface and easy navigation system enhances booking
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CMSWhyus;
