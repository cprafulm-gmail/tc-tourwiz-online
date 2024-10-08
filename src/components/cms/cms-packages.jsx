import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { CMSContext } from "../../screens/cms/cms-context";

const CMSPackages = React.memo(() => {
  const { cmsState: { cmsSettings, cmsContents } } = useContext(CMSContext);

  const imageURL = useMemo(
    () => process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/",
    [cmsSettings?.portalID]
  );

  return (
    <div className="cp-home-packages">
      <div className="container">
        <h2 className="mb-4 font-weight-bold text-white">Special Packages</h2>
        <div className="row">
          {cmsContents.packagesContent &&
            cmsContents.packagesContent.map((x, key) => key < 3 && (
              <div key={key} className="col-lg-4 mb-4">
                <Link to={"/details/packages/" + x?.specialPromotionID}>
                  <div className="bg-white shadow">
                    <img
                      className="img-fluid"
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
        <div className="d-flex align-items-center justify-content-center ">
          {cmsContents.packagesContent.length > 3 && (
            <button
              className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow border-0 ">
              <Link to={"/list/packages"}
                style={{ textDecoration: "none", color: "white" }}>
                Show More
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default CMSPackages;
