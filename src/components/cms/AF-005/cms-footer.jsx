import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-white.png";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSFooter = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";
  return (
    <div className="cp-footer">
      <div className="container">
        <div className="row border-bottom border-dark">
          <div className="col-lg-4">
            <div>
              <Link to="/">
                {(!companyLogo || companyLogo === "Images/logo.gif" || companyLogo === "Images/noLogo.png") && (
                  <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold d-flex align-items-center">
                    <img
                      className="header-logo mr-3"
                      src={CustomerLogo}
                      alt="TourWiz"
                      height="44px"
                    />
                    {companyName}
                  </h3>
                )}

                {companyLogo && companyLogo !== "Images/logo.gif" && companyLogo !== "Images/noLogo.png" && (
                  <img
                    height="44px"
                    src={process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo}
                    alt={companyName}
                  />
                )}
              </Link>

              <p className="text-secondary mt-4">
                We come together each day to fulfill a promise of offering the single most comprehensive. We encourage, inspire, and empower through travel.
              </p>
              <div className="mb-2">
                <HtmlParser text={decode(cmsContents.socialMediaContent !== undefined ? cmsContents.socialMediaContent[0].desktopHtml : "")} /></div>
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
                    <Link className="text-secondary mb-2 d-block" to="/about">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link className="text-secondary mb-2 d-block" to="/contact">
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
                    <Link className="text-secondary mb-2 d-block" to="/signin">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link className="text-secondary mb-2 d-block" to="/signup">
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
                  +91 897 699 7098
                </div>
                <div>
                  <b className="d-block text-secondary mb-2">Mail</b>
                  <a
                    href={"mailto:sales@thetripcentre.com"}
                    className="text-primary"
                  >
                    sales@thetripcentre.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSFooter;
