import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import SVGIcon from "../../../helpers/svg-icon";
import { apiRequesterCMS } from "../../../services/requester-cms";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-white.png";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSCopywrite = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const companyName1 = "Your Logo";
  const companyName = cmsSettings?.footerText;
  const companyLogo = cmsSettings?.logoFile;
  return (
    <React.Fragment>
      <div className="cp-footer">
        <div className="container">
          <div className="row border-bottom border-dark">
            <div className="col-lg-4">
              <div>
                <Link to="/">
                  {(!companyLogo ||
                    companyLogo === "Images/logo.gif" ||
                    companyLogo === "Images/noLogo.png") && (
                      <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold d-flex align-items-center">
                        <img
                          className="header-logo mr-3"
                          src={CustomerLogo}
                          alt="TourWiz"
                          height="60px"
                        />
                        {companyName}
                      </h3>
                    )}

                  {companyLogo &&
                    companyLogo !== "Images/logo.gif" &&
                    companyLogo !== "Images/noLogo.png" && (
                      <img
                        height="60px"
                        src={
                          process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
                          cmsSettings?.portalID +
                          "/" +
                          companyLogo
                        }
                        alt={companyName}
                      />
                    )}
                </Link>

                <p className="text-secondary mt-1">
                  Your Holiday Package search ends here! <br />
                  We got you covered with the best affordable holiday packages
                  without burning a hole in your pocket!
                </p>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="col-lg-4 p-0 pull-left">
                <b className="d-block text-secondary mb-2">Quick Links</b>
                <div className="d-flex footer-menu">
                  <ul className="d-inline-block list-unstyled p-0 m-0 mr-5">
                    <li>
                      <Link className="text-secondary mb-2 d-block" to="/">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-secondary mb-2 d-block"
                        to="/about"
                      >
                        About us
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-secondary mb-2 d-block"
                        to="/contact"
                      >
                        Contact us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 p-0 pull-left">
                <b className="d-block text-secondary mb-2">Subscribe</b>
                <div className="d-flex footer-menu">
                  <ul className="d-inline-block list-unstyled p-0 m-0 mr-5">
                    <li>
                      <Link
                        className="text-secondary mb-2 d-block"
                        to="/signin"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-secondary mb-2 d-block"
                        to="/signup"
                      >
                        Sign up
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4c pull-left">
                <div>
                  <div>
                    <b className="d-block text-secondary mb-2">Call</b>

                    <a
                      href={
                        window.innerWidth <= 768
                          ? "https://wa.me/918976997098"
                          : "https://web.whatsapp.com/send?phone=+918976997098"
                      }
                      className="d-inline m-1"
                      target="_blank"
                    >
                      <SVGIcon
                        name="whatsapp-green"
                        width="24"
                        height="24"
                        className="mr-2"
                      ></SVGIcon>
                      +91 897 699 7098
                    </a>
                  </div>
                  <div>
                    <b className="d-block text-secondary mt-2 mb-2">Mail</b>
                    <a
                      href={"mailto:sales@thetripcentre.com"}
                      className="text-primary"
                    >
                      sales@thetripcentre.com
                    </a>
                  </div>
                  <div className="mb-2">
                    <HtmlParser text={decode(cmsContents.socialMediaContent !== undefined ? cmsContents.socialMediaContent[0].desktopHtml : "")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-copyrights">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 d-flex align-items-center justify-content-center">
              <div>
                {companyName} |{" "}
                <Link to="/terms">Terms of Use | Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CMSCopywrite;
