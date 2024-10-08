import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CMSContext } from "../../screens/cms/cms-context";

const CMSLocations = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  let imageURL = process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/LocationsGuide/images/";

  return (
    <div>
      <div className="cp-home-locations">
        <div className="cp-home-locations-wrap">
          {cmsContents.topLocationsContents &&
            cmsContents.topLocationsContents.map((x, key) => key < 5 && (
              <div key={key}>
                <Link to={"/details/locations/" + x?.locationID}>
                  <img
                    class="img-fluid"
                    src={(x?.locationImage.indexOf(".s3.") > 0 || x?.locationImage.indexOf("/cms/") > 0) ? x?.locationImage : imageURL + x?.locationImage}
                    alt={x?.locationTitle}
                    style={{ height: "100%" }}
                  />
                  <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                    {x?.locationTitle}
                  </h5>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center py-3 bg-light"  >
        {cmsContents.topLocationsContents.length > 5 && (
          <button
            class="location-show-more btn btn-lg btn btn-primary mt-1 pt-1 pb-1 shadow">
            <Link to={"/list/locations"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Show More
            </Link></button>
        )}
      </div>
    </div>
  );
};

export default CMSLocations;
