import React from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";

const ViewTravellerAirsDetails = props => {
  const isShowDocumentLink = props.travellerDetails.filter(x => x.documents.filter(y => y.url && y.url !== '' && y.url.length > 10).length > 0).length > 0;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_viewTravelersDetailsAir")}</h5>
      </div>
      <div className="card-body">
        <div className="border shadow-sm">
          <div className="table-responsive">
            <table className="table offline-booking-table m-0">
              <thead>
                <tr>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewTravelerType")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewName")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewGender")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewBirthDate")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewDocument")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_viewETicket")}
                  </th>
                  <th className="align-middle bg-light text-nowrap">
                    {Trans("_specialRequest")}
                  </th>
                  {isShowDocumentLink &&
                    <th className="align-middle bg-light text-nowrap">
                      {Trans("_viewDocument")}
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                {props.travellerDetails.map((traveler, key) => {
                  const { typeString, addons } = traveler;
                  let {
                    firstName,
                    lastName,
                    genderDesc,
                    birthDate,
                    documentType,
                    documentNumber
                  } = traveler.details;
                  const documentsURL = traveler.documents.length > 0 && traveler.documents[0].url && traveler.documents[0].url !== "" ? traveler.documents[0].url : ""
                  const { eTicketNo } = traveler.bookingDetails;
                  const type =
                    typeString === "ADT"
                      ? Trans("_viewAdult")
                      : typeString === "CHD"
                        ? Trans("_viewChild")
                        : Trans("_viewInfant");
                  if (firstName !== "TBA" || lastName !== "TBA") {
                    return (
                      <tr key={key}>
                        <td>{type}</td>
                        <td>
                          {firstName === "TBA" ? "" : firstName} {lastName === "TBA" ? "" : lastName}
                        </td>
                        <td>{genderDesc}</td>
                        <td>{birthDate && birthDate != "0001-01-01T00:00:00" ? <Date date={birthDate} /> : "---"}</td>
                        <td>
                          {documentType
                            ? documentType + " : " + documentNumber
                            : "---"}
                        </td>
                        <td>{eTicketNo && eTicketNo !== "TBA" ? eTicketNo : "---"}</td>
                        <td>
                          {addons.length > 0
                            ? addons.map(item => {
                              return (
                                <React.Fragment>
                                  {item.type === "SeatPreference" && (
                                    <div>{Trans("_seat")} : {item.name}</div>
                                  )}

                                  {item.type === "MealPreference" && (
                                    <div>{Trans("_meal")} : {item.name}</div>
                                  )}

                                  {item.type === "Baggage" &&
                                    item.route === "departure" && (
                                      <div>{Trans("_baggageDeparture")} : {item.name}</div>
                                    )}

                                  {item.type === "Baggage" &&
                                    item.route === "arrival" && (
                                      <div>{Trans("_baggageArrival")} : {item.name}</div>
                                    )}
                                </React.Fragment>
                              );
                            })
                            : "---"}
                        </td>
                        {isShowDocumentLink &&
                          <td>
                            <a href={documentsURL} target="_blank">
                              <i
                                className="fa fa-download ml-2"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </td>
                        }
                      </tr>
                    );
                  }

                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTravellerAirsDetails;
