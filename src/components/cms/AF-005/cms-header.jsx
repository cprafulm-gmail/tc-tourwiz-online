import React, { Component, useContext } from "react";
import { apiRequesterCMS } from "../../../services/requester-cms";
import { Link } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-darkblue.png";
import CMSMenu from "./cms-menu";
import SVGIcon from "../../../helpers/svg-icon";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import Config from "../../../config.json";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSHeader = (props) => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";
  return (
    <React.Fragment>
      <div className="cp-header d-flex align-items-center shadow">
        {/* Test Comment */}
        <div className="container">
          <div className="row d-flex align-items-center justify-content-end h-100 ">
            <div className="col-lg-3 d-flex align-items-center dsad">
              <Link to="/">
                {(!companyLogo || companyLogo === "Images/logo.gif" || companyLogo === "Images/noLogo.png") && (
                  <h3 className="text-capitalize mt-2 mb-2 text-black-50 font-weight-bold d-flex align-items-center">
                    <img
                      className="header-logo mr-3"
                      src={CustomerLogo}
                      alt="TourWiz"
                      height="60px"
                    />
                    {companyName}
                  </h3>
                )}

                {companyLogo && companyLogo !== "Images/logo.gif" && companyLogo !== "Images/noLogo.png" && (
                  <img
                    className=""
                    height="60px"
                    src={companyLogo.indexOf("s3") > -1 ? companyLogo : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo)}
                    alt={companyName}
                  />
                )}
              </Link>
            </div>
            <div className="col-lg-9">
              <CMSMenu />
            </div>
          </div>
        </div>
      </div>
      <div className="cp-header-menu d-flex align-items-center shadow">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CMSHeader;

