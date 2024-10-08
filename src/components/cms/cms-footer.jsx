import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomerLogo from "../../assets/images/customer-portal/customer-logo-white.png";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../screens/cms/cms-context";

const CMSFooter = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";
  return (
    <div className="cp-footer AF-010">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
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
                    src={companyLogo.indexOf("s3") > -1 ? companyLogo : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/" + companyLogo)}
                    alt={companyName}
                  />
                )}
              </Link>

              <p className="text-secondary mt-4">
                Affordable online solution for travel professionals that
                replaces spreadsheets to simplify itinerary building, customer
                management, accounting reconciliation & reporting
              </p>
            </div>
          </div>

          <div className="col-lg-3">
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
                {/* <li>
                  <Link className="text-secondary mb-2 d-block" to="/">
                    Popular Deals
                  </Link>
                </li>
                <li>
                  <Link className="text-secondary mb-2 d-block" to="/">
                    Special Packages
                  </Link>
                </li> */}
                <li>
                  <Link className="text-secondary mb-2 d-block" to="/contact">
                    Contact us
                  </Link>
                </li>

                <li>
                  <Link className="text-secondary mb-2 d-block" to="/login">
                    Sign in
                  </Link>
                </li>
              </ul>

              {/* <ul className="d-inline-block list-unstyled p-0 m-0 ml-5">
                <li>
                  <Link className="text-secondary mb-2 d-block" to="/login">
                    Sign in
                  </Link>
                </li>
              </ul> */}
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <div>
                <b className="d-block text-secondary mb-2">Mail</b>
                <a
                  className="d-block text-secondary mb-1"
                  href={"mailto:" + cmsSettings?.email}
                >
                  {cmsSettings?.email}
                </a>
              </div>
              <div class="footer-socialicons">
                <HtmlParser text={decode(cmsContents.socialMediaContent !== undefined ? cmsContents.socialMediaContent[0].desktopHtml : "")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSFooter;
