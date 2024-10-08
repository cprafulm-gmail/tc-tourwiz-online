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


const CMSHeader = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";

  return (
    <React.Fragment>
      <div className="cp-header d-flex align-items-center">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-flex align-items-center dsad">
              <Link to="/">
                {(!companyLogo || companyLogo === "Images/logo.gif" || companyLogo === "Images/noLogo.png") && (
                  <h3 className="text-capitalize mt-3 mb-4 text-black-50 font-weight-bold d-flex align-items-center">
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
                    src={companyLogo.indexOf("s3") > -1 ? companyLogo : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo)}
                    alt={companyName}
                  />
                )}
              </Link>
            </div>
            <div className="col-lg-6">
              <CMSMenu />
            </div>
            <div className="col-lg-3">

              <nav
                className={
                  "d-flex align-items-start justify-content-end pt-2 pb-2 w-100 h-50 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-black-50" to={Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? "/login" : "/signin"}>
                      <SVGIcon
                        name="sign-in"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                      Customer Login
                    </Link>
                  </li>

                  {Config.codebaseType === "tourwiz-tripcenter" && (
                    <li>
                      <Link className="text-black-50 ml-4" to="/signup">
                        <SVGIcon
                          name="sign-up"
                          className="mr-2 "
                          width="15"
                          height="15"
                        ></SVGIcon>
                        Sign up
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              <nav
                className={
                  "d-flex align-items-end justify-content-end pt-2 w-100 pb-2 h-50 "
                }
              >
                {/* <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                    <li>
                      <SVGIcon
                        name="phone"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                      +91 972 281 3555
                    </li>
                  </ul> */}
                <HtmlParser text={decode(cmsContents.socialMediaContent !== undefined ? cmsContents.socialMediaContent[0].desktopHtml : "")} />
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-header-menu d-flex align-items-center">
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

