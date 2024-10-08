import React from "react";
import { Link } from "react-scroll";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";

const JumpMenu = (data) => {
  const isShowitenaryDetailsLink =
    data.business === "package" &&
    data.tpExtension.find((x) => x.key === "itenaryDetails") &&
    data.tpExtension.find((x) => x.key === "itenaryDetails").value;

  const isShowInclustionLink =
    (data.business === "activity" || data.business === "transfers" || data.business === "package") &&
    ((data.tpExtension.find((x) => x.key === "inclusions") &&
      data.tpExtension.find((x) => x.key === "inclusions").value) ||
      (data.tpExtension.find((x) => x.key === "exclusions") &&
        data.tpExtension.find((x) => x.key === "exclusions").value));

  const isShowTermsLink =
    (data.business === "activity" || data.business === "transfers" || data.business === "package") &&
    data.tpExtension.find((x) => x.key === "rulesAndRegulations") &&
    data.tpExtension.find((x) => x.key === "rulesAndRegulations").value;

  let businessName = data.business;
  const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;

  return (
    <div className="jump-menu row">
      <div className="col-12">
        <ul className="list-unstyled pt-3 pb-3 m-0">
          <li className="d-inline-block mr-3">
            <b>{Trans("_jumpTo") + " : "}</b>
          </li>

          {data.description !== undefined && data.description !== "" &&
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="overview"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToOverview")}
              </Link>
            </li>
          }
          {!isCRSRoomSelectionFlowEnable || (isCRSRoomSelectionFlowEnable && businessName !== "package") &&
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="availability"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToAvailability")}
              </Link>
            </li>
          }

          {data.business === "hotel" && data.amenities !== undefined && data.amenities.length > 0 && (
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="amenities"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToFacilities")}
              </Link>
            </li>
          )}

          {isShowInclustionLink && (
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="inclusionsexclusions"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToInclusionsExclusions")}
              </Link>
            </li>
          )}

          {!isShowInclustionLink && data.business === "transfers" && (
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="inclusionsexclusions"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToInclusionsExclusions")}
              </Link>
            </li>
          )}

          {isShowitenaryDetailsLink && (
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="itenaryDetails"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToItineraryDetails")}
              </Link>
            </li>
          )}

          {isShowTermsLink && (
            <li className="d-inline-block mr-3">
              <Link
                activeClass="active"
                className="text-secondary"
                href="#"
                to="termsConditions"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
              >
                {Trans("_jumpToTermsAndConditions")}
              </Link>
            </li>
          )}

          {(data.business === "hotel" ||
            data.business === "activity" ||
            data.business === "transfers" ||
            data.business === "package") &&
            data.locationInfo.fromLocation.latitude !== undefined &&
            data.locationInfo.fromLocation.longitude !== undefined &&
            data.locationInfo.fromLocation.latitude !== -1 &&
            data.locationInfo.fromLocation.longitude !== -1 &&
            data.locationInfo.fromLocation.address !== undefined &&
            data.locationInfo.fromLocation.address !== "" && (
              <li className="d-inline-block mr-3">
                <Link
                  activeClass="active"
                  className="text-secondary"
                  href="#"
                  to="map-control"
                  spy={true}
                  smooth={true}
                  offset={-120}
                  duration={500}
                >
                  {Trans("_jumpToMap")}
                </Link>
              </li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default JumpMenu;
