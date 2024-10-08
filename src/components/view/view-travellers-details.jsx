import React from "react";
import { Trans } from "../../helpers/translate";

const ViewTravellersDetails = (props) => {
  const travellerDetails = props.travellerDetails[0];
  const business = props.businessObject.business;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">
          {Trans(
            props.businessname
              ? "_viewTravelersDetails"
              : "_viewTravelersDetailsAir"
          )}
        </h5>
      </div>
      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">
          <li className="row">
            <label className="col-3">{Trans("_viewName")} :</label>
            <b className="col-9">
              {travellerDetails.details.firstName}{" "}
              {travellerDetails.details.lastName}
            </b>
          </li>
          {/* <li className="row">
            <label className="col-3">Age :</label>
            <b className="col-9">{travellerDetails.age}</b>
          </li> */}
          <li className="row">
            <label className="col-3">{Trans("_viewGender")} :</label>
            <b className="col-9">{travellerDetails.details.genderDesc}</b>
          </li>
          {travellerDetails.details.location.city && (
            <li className="row">
              <label className="col-3">{Trans("_viewCity")} :</label>
              <b className="col-9">{travellerDetails.details.location.city}</b>
            </li>
          )}
          {(business === "activity" || business === "package") &&
            travellerDetails.details.location.country && (
              <li className="row">
                <label className="col-3">{Trans("_viewCountry")} :</label>
                <b className="col-9">
                  {travellerDetails.details.location.country}
                </b>
              </li>
            )}
          <li className="row">
            <label className="col-3">{Trans("_viewEmail")} :</label>
            <b className="col-9">
              {travellerDetails.details.contactInformation.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")) ? '---' : travellerDetails.details.contactInformation.email}
            </b>
          </li>
          {travellerDetails.details.contactInformation &&
            travellerDetails.details.contactInformation.phoneNumber && (
              <li className="row">
                <label className="col-3">{Trans("_viewContactPhone")} :</label>
                <b className="col-9">
                  {
                    travellerDetails.details.contactInformation
                      .phoneNumberCountryCode
                  }{" "}
                  {travellerDetails.details.contactInformation.phoneNumber}
                </b>
              </li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default ViewTravellersDetails;
