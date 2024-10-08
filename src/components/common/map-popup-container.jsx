import React from "react";
import StarRating from "../common/star-rating";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import HtmlParser from "../../helpers/html-parser";
import { Link } from "react-router-dom";

const MapPopupContainer = props => {
  const item = props.item;
  const businessName = props.businessName;
  const getOnErrorImageURL = () => {
    if (businessName === "hotel") return ImageNotFoundHotel.toString();
    else if (businessName === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (businessName === "package") {
      return ImageNotFoundPackage.toString();
    }
  };
  return (
    <React.Fragment>
      <div style={props.infoWindowStyle}>
        <div className="row overflow-auto " style={{ maxheight: 200 }}>
          <div className="col-3">
            {item.detailLink !== "" ? (
              <Link to={item.detailLink}>
                <img
                  style={{ cursor: "pointer", height: "90px", width: "90px" }}
                  className="img-fluid"
                  src={item.image}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = getOnErrorImageURL();
                  }}
                  alt=""
                />
              </Link>
            ) : (
              <img
                style={{ cursor: "pointer", height: "90px", width: "90px" }}
                className="img-fluid"
                src={item.image}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = getOnErrorImageURL();
                }}
                alt=""
              />
            )}
          </div>
          <div className="col-8">
            <span className="float-left">
              {item.detailLink !== "" ? (
                <Link to={item.detailLink}>
                  <HtmlParser text={item.name} />
                </Link>
              ) : (
                <HtmlParser text={item.name} />
              )}
            </span>
            <span
              className="star-rating mt-2 float-left"
              style={{ clear: "both" }}
            >
              <StarRating {...[item.rating]} />
            </span>
            <div className="mt-2 float-left" style={{ clear: "both" }}>
              <HtmlParser text={item.address} />
            </div>
          </div>
          {/* <div className="mt-2 col-12">
            <div>
              <HtmlParser
                text={
                  item.description.length > 350
                    ? item.description.substring(0, 350) + "..."
                    : item.description
                }
              />
            </div>
          </div> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MapPopupContainer;
