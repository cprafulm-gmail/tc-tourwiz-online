import React from "react";
import { Link } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-white.png";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import * as Global from "../../../helpers/global";
import SVGIcon from "../../../helpers/svg-icon";

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
    <div className="cp-footer AF-003">
      <div className="container">
        <div className="row border-bottom">
          <div className="col-lg-12">
            <div>
              <Link to="/">
                {(!companyLogo || companyLogo === "Images/logo.gif" || companyLogo === "Images/noLogo.png") && (
                  <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold d-flex align-items-center">
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

            <div className="address-link text-secondary mt-4 mb-4"><ul className="d-inline p-0">
              <li className="mr-4">
                <SVGIcon
                  name="map-marker"
                  width="16"
                  height="16"
                  className="mr-2"
                ></SVGIcon>
                {<HtmlParser text={portalAddress} />}</li>
              <li className="mr-4">
                <SVGIcon
                  name="phone"
                  width="16"
                  height="16"
                  className="mr-2"
                ></SVGIcon>
                {portalPhone && <HtmlParser text={portalPhone} />}</li>
              <li className="mr-4">
                <SVGIcon
                  name="envelope"
                  width="16"
                  height="16"
                  className="mr-2"
                ></SVGIcon>
                {emailArray && emailArray.map(item => (
                  <a
                    href={"mailto:" + item}
                    className="d-inline text-primary"
                  >
                    {<HtmlParser text={item} />}
                  </a>
                ))}</li></ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSFooter;
