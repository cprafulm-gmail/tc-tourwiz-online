import React from "react";
import { Link } from "react-scroll";
import { Link as ReactLink } from "react-router-dom";
import StarRating from "../common/star-rating";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";
import TripAdvisorRating from "../common/trip-advisor-rating";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";


const DetailsHeader = (props) => {
  const { name, locationInfo, rating, ratingInfo, business } = props;
  let businessName = business;
  const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;

  return (
    <div className="border-bottom">
      <div className="row">
        <div className="col-8 pt-4 pb-4">
          <h3 className="font-weight-bold d-inline-block">
            <HtmlParser text={name} />
          </h3>
          <span className="star-rating d-inline-block ml-3">
            <StarRating {...[rating]} />
          </span>
          {locationInfo && ((locationInfo.fromLocation.address != undefined && locationInfo.fromLocation.address != "")
            || (locationInfo.fromLocation.zipCode != undefined && locationInfo.fromLocation.zipCode != "") || (locationInfo.fromLocation.city != undefined && locationInfo.fromLocation.city != ""))
            && (
              <div className="text-secondary">
                <SVGIcon
                  name="map-marker"
                  width="14"
                  type="fill"
                  height="14"
                  className="mr-2"
                ></SVGIcon>
                <HtmlParser text={locationInfo.fromLocation.address} />
                &nbsp;
                {locationInfo.fromLocation.zipCode}
                &nbsp;
                <HtmlParser text={locationInfo.fromLocation.city} />
              </div>
            )}

          <div className="text-secondary mt-1">
            {props.contactInformation.phoneNumber && (
              <span className="mr-4">
                <SVGIcon name="phone" type="fill" className="mr-2"></SVGIcon>
                {props.contactInformation.phoneNumber}
              </span>
            )}
            {props.contactInformation.fax && (
              <span className="mr-4">
                <SVGIcon name="fax" className="mr-2"></SVGIcon>
                {props.contactInformation.fax}
              </span>
            )}
            {props.contactInformation.email && (
              <span className="mr-4">
                <SVGIcon name="envelope" className="mr-2"></SVGIcon>
                <a
                  className="mailto"
                  href={"mailto:" + props.contactInformation.email}
                >
                  {props.contactInformation.email}
                </a>
              </span>
            )}
            {!localStorage.getItem("isUmrahPortal") && props.url && (
              <span className="mr-4">
                <SVGIcon name="globe" className="mr-2"></SVGIcon>
                <a href={props.url} target="_blank">
                  {props.url.length > 20
                    ? props.url.substring(0, 35) + "..."
                    : props.url}
                </a>
              </span>
            )}
          </div>
        </div>

        <div className="col-4 pt-4 pb-4 text-right">
          <ReactLink
            to={props.backToSearchURL}
            className="btn btn-link text-secondary mr-2"
          >
            {Trans("_backToSearchResult")}
          </ReactLink>
          {!isCRSRoomSelectionFlowEnable || (isCRSRoomSelectionFlowEnable && businessName !== "package") ? <Link
            className="btn btn-primary"
            activeClass="active"
            href="#"
            to="rooms"
            spy={true}
            smooth={true}
            offset={-120}
            duration={500}
          >
            {localStorage.getItem("ssotoken") !== null ? Trans("_titleRoomsAndRates") : Trans("_bookNow")}
          </Link>
            : <Link
              className="btn btn-primary"
              activeClass="active"
              href="#"
              to="agent-dashboard"
              spy={true}
              smooth={true}
              offset={-120}
              duration={500}
            >
              {localStorage.getItem("ssotoken") !== null ? Trans("_titleRoomsAndRates") : Trans("_bookNow")}
            </Link>
          }

          {ratingInfo && ratingInfo.find((x) => x.type === "tripAdvisor") && (
            <div className="pull-right text-right mt-1">
              <span className="tripadvisor-rating ml-3">
                <TripAdvisorRating rating={ratingInfo} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsHeader;
