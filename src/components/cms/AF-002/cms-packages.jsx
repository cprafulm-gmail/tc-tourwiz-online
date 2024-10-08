import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSPackages = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";
  return (
    <div className="cp-home-packages">
      <div className="container">
        <div className="col-lg-12 p-0 mb-5 d-flex justify-content-center align-items-center flex-column">
          <h1 className="mb-4 font-weight-bold text-white">OUR PACKAGES</h1>
          <h3 className="mb-4 text-white font-italic">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil</h3>
        </div>
        <div className="row">
          {cmsContents.packagesContent &&
            cmsContents.packagesContent.map((x, key) => key < 3 && (
              <div key={key} className="col-lg-4 mb-4">
                <Link to={"/details/packages/" + x?.specialPromotionID}>
                  <div className="bg-white shadow">
                    <img
                      class="img-fluid"
                      src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                      alt={x?.shortDescription}
                    />
                    <h5 className="font-weight-bold text-center text-white position-relative">
                      {x?.shortDescription}
                    </h5>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <div className="d-flex align-items-center justify-content-center" >
          {cmsContents.packagesContent.length > 3 && (
            <button
              className="btn btn-lg btn btn-dark mt-1 pt-1 pb-1 shadow" style={{ background: "#152b38" }} >
              <Link to={"/list/packages"}
                style={{ textDecoration: "none", color: "white" }}
              >
                Show More
              </Link></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSPackages;
