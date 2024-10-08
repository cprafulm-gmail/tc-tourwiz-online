import React from "react";
import StarRating from "../common/star-rating";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import { Trans } from "../../helpers/translate";

const ViewItemDetails = props => {
  const { businessObject } = props;
  const imgUrl = businessObject.url
    ? businessObject.url
    : businessObject.images.length > 0
      ? businessObject.images[0].url
      : null;
  const getOnErrorImageURL = () => {
    if (businessObject.business === "hotel")
      return (ImageNotFoundHotel.toString());
    else if (businessObject.business === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (businessObject.business === "package") {
      return ImageNotFoundPackage.toString();
    }
  };
  let meal = "";
  if (businessObject.tpExtension && businessObject.tpExtension.find((x) => x.key === "meal") && businessObject.tpExtension.find((x) => x.key === "meal")
    .value !== "") {
    meal = businessObject.tpExtension.find((x) => x.key === "meal").value;
  }
  return (<>
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">
          {Trans("_view" + businessObject.business + "Details")}
        </h5>
      </div>
      <div className="card-body position-relative">
        <img
          className="img-fluid position-absolute img-thumbnail"
          src={imgUrl}
          onError={e => {
            e.target.onerror = null;
            e.target.src = getOnErrorImageURL();
          }}
          style={{ maxHeight: "94px", top: "16px", right: "16px" }}
          alt=""
        ></img>
        <ul className="list-unstyled p-0 m-0">
          <li className="row">
            <label className="col-3">
              {Trans("_view" + businessObject.business + "Name") + " : "}
            </label>
            <b className="col-7">{businessObject.name}</b>
          </li>
          <li className="row">
            <label className="col-3">{Trans("_viewRating") + " : "}</label>
            <b className="col-7">
              <span className="star-rating">
                <StarRating {...[businessObject.rating]} />
              </span>
            </b>
          </li>
          <li className="row">
            <label className="col-3 text-nowrap">{Trans("_viewAddress") + " : "}</label>
            <b className="col-7">
              {businessObject.locationInfo.fromLocation.address ? businessObject.locationInfo.fromLocation.address : businessObject.locationInfo.fromLocation.city}
            </b>
          </li>
          {meal && meal !== "" &&
            <li className="row">
              <label className="col-3">{Trans("Meal") + " : "}</label>
              <b className="col-7">
                {meal}
              </b>
            </li>
          }
        </ul>
      </div>
    </div>

  </>
  );
};

export default ViewItemDetails;
