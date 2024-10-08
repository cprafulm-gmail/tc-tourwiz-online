import React, { Component, useEffect, useState } from "react";
import { apiRequesterCMS } from "../../../services/requester-cms";
import { Link } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-darkblue.png";
import CMSMenu from "./cms-menu";
import SVGIcon from "../../../helpers/svg-icon";
import * as Global from "../../../helpers/global";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import Config from "../../../config.json";


const CMSHeader = (props) => {
  const [state, setState] = useState({
    resultContactDetails: "",
  });
  const getContactDetails = async () => {
    const { siteurl } = state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" + siteurl + "&modulename=ContactDetails&culturecode=en-us";
    return new Promise((resolve, reject) => {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          setState((prevState) => {
            return {
              ...prevState,
              resultContactDetails: (data?.response && data?.response[0]?.desktopHtml) || "",
            };
          });
          resolve();
        },
        "GET"
      );
    });
  };

  var { cmsSettings } = props;
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
  if (state.resultContactDetails != "") {
    var res = decode(state.resultContactDetails);
    const paragraphs = res.split("</div>");

    portalAddress = typeof (paragraphs[0]) === "string" && paragraphs[0].indexOf("Address:") > 0 ? paragraphs[0].replace("<div>", "").replaceAll("<br />", "").replace("<br>", "").replace("Address:", "") : portalAddress;
    portalPhone = typeof (paragraphs[1]) === "string" && paragraphs[1].indexOf("CallUS:") > 0 && paragraphs[1].indexOf("Your call details") == -1 ? paragraphs[1].replace("<div>", "").replace("CallUS:", "") : portalPhone;
    portalEmail = typeof (paragraphs[2]) === "string" && paragraphs[2].indexOf("EmailUS:") > 0 && paragraphs[2].indexOf("Your email details") == -1 ? paragraphs[2].replace("<div>", "").replace("EmailUS:", "") : portalEmail;

  }
  var emailArray = portalEmail && portalEmail.split(',');
  useEffect(() => {
    (async () => {
      await getContactDetails();
    })();
  }, [])
  return (
    <React.Fragment>
      <div className="cp-header-menu d-flex align-items-center ">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-6"><nav
              className={
                "d-flex align-items-start justify-content-start pt-2 pb-2 w-100 h-50 "
              }
            >
              <span className="mr-3">
                <SVGIcon
                  name="phone"
                  className="mr-2 "
                  width="15"
                  height="15"
                ></SVGIcon>
                {portalPhone}</span>

              <span>
                <SVGIcon
                  name="envelope"
                  className="mr-2 "
                  width="15"
                  height="15"
                ></SVGIcon>
                {emailArray}
              </span>
            </nav>
            </div>
            <div className="col-lg-6"><nav
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
            </div>
          </div>
        </div>
      </div>
      <div className="cp-header d-flex align-items-center border bg-white shadow">
        {/* Test Comment */}
        <div className="container">
          <div className="row pt-3">
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
                    src={companyLogo.indexOf("s3") > -1 ? companyLogo : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo)}
                    alt={companyName}
                  />
                )}
              </Link>
            </div>
            <div className="col-lg-8">
              <CMSMenu />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CMSHeader;

