import React from "react";
import { Link } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-darkblue.png";
import { decode } from "html-entities";
import * as Global from "../../../helpers/global";
import Config from "../../../config.json";

const CMSFooter = ({ cmsSettings, ...rest }) => {
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";

  var portalEmail = Global.getEnvironmetKeyValue(
    "portalCustomerCareEmail"
  ) ??
    Global.getEnvironmetKeyValue("customerCareEmail")

  var portalPhone = Global.getEnvironmetKeyValue(
    "portalPhone"
  )

  var portalAddress = "Your Address Details";
  if (rest.resultContactDetails != "") {
    var res = decode(rest.resultContactDetails);
    const paragraphs = res.split("</div>");

    portalAddress = typeof (paragraphs[0]) === "string" && paragraphs[0].indexOf("Address:") > 0 ? paragraphs[0].replace("<div>", "").replaceAll("<br />", "").replace("<br>", "").replace("Address:", "") : portalAddress;
    portalPhone = typeof (paragraphs[1]) === "string" && paragraphs[1].indexOf("CallUS:") > 0 && paragraphs[1].indexOf("Your call details") == -1 ? paragraphs[1].replace("<div>", "").replace("CallUS:", "") : portalPhone;
    portalEmail = typeof (paragraphs[2]) === "string" && paragraphs[2].indexOf("EmailUS:") > 0 && paragraphs[2].indexOf("Your email details") == -1 ? paragraphs[2].replace("<div>", "").replace("EmailUS:", "") : portalEmail;

  }
  var emailArray = portalEmail && portalEmail.split(',');
  return rest.resultContactDetails != "" && rest.resultContactDetails != undefined && (
    <div className="cp-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 d-flex align-items-center sfdf">
            <Link to="/">
              {(!companyLogo || companyLogo === "Images/logo.gif" || companyLogo === "Images/noLogo.png") && (
                <h3 className="text-capitalize mt-3 mb-3 text-black-50 font-weight-bold d-flex align-items-center">
                  <img
                    className="header-logo mr-3"
                    src={CustomerLogo}
                    alt="TourWiz"
                    height="48px"
                  />
                  {companyName}
                </h3>
              )}

              {companyLogo && companyLogo !== "Images/logo.gif" && companyLogo !== "Images/noLogo.png" && (
                <img
                  height="48px"
                  src={process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo}
                  alt={companyName}
                />
              )}
            </Link>
          </div>
          <div className="col-lg-8">
            <nav
              className={
                "d-flex align-items-center justify-content-end h-100 "}
            >
              <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                <li>
                  <Link className="text-white" to="/">
                    Home
                  </Link>
                </li>

                <li>
                  <Link className="text-white ml-4" to="/about">
                    About us
                  </Link>
                </li>

                {/* <li>
            <Link className="text-white ml-4" to="/">
              Popular Deals
            </Link>
          </li>

          <li>
            <Link className="text-white ml-4" to="/">
              Special Packages
            </Link>
          </li> */}

                <li>
                  <Link className="text-white ml-4" to="/contact">
                    Contact us
                  </Link>
                </li>

                <li>
                  <Link className="text-white ml-4" to={Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? "/login" : "/signin"}>
                    Sign in
                  </Link>
                </li>

                {Config.codebaseType === "tourwiz-tripcenter" && Config.codebaseType === "tourwiz-marketplace" && (
                  <li>
                    <Link className="text-white ml-4" to="/signup">
                      Sign up
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSFooter;
