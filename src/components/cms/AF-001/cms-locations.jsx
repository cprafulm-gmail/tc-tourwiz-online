import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSLocations = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;

  let imageURL = process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/LocationsGuide/images/";

  return (
    <div className="cp-home-locations">
      <div className="cp-home-locations-wrap col-lg-12">
        {cmsContents.topLocationsContents &&
          cmsContents.topLocationsContents.reverse().map((x, index) => index < 4 && (
            <div className="col-lg-6 pl-3 pr-3 pb-4">
              <div className="col-lg-12 p-0 cp-home-location-content overflow-hidden">
                <Link to={"/details/locations/" + x?.locationID}>
                  <img
                    class="img-fluid"
                    src={imageURL + x?.locationImage}
                    alt={x?.locationTitle}
                  />
                  <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                    {x?.locationTitle}
                  </h5>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CMSLocations;
