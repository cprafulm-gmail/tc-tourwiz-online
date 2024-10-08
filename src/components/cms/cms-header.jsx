import React from "react";
import { Link } from "react-router-dom";
import CustomerLogo from "../../assets/images/customer-portal/customer-logo-white.png";
import CMSMenu from "./cms-menu";

const CMSHeader = ({ cmsSettings }) => {
  const companyLogo = cmsSettings?.logoFile;
  const companyName = "Your Logo";

  return (
    <div className="cp-header d-flex align-items-center">
      {/* Test Comment */}
      <div className="container">
        <div className="row">
          <div className="col-lg-4 d-flex align-items-center">
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
          </div>
          <div className="col-lg-8">
            <CMSMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSHeader;
