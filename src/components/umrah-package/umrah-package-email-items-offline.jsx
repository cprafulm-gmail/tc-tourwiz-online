import React from "react";
import Date from "../../helpers/date";
import Amount from "../../helpers/amount";
import ImageHotelDefault from "../../assets/images/tourwiz/hotel-default.png";
import ImageActivityDefault from "../../assets/images/tourwiz/activity-default.png";
import ImageTransfersDefault from "../../assets/images/tourwiz/transfers-default.png";
import ImageCustomDefault from "../../assets/images/tourwiz/custom-default.png";

const UmrahPackageEmailItemsOffline = (props) => {
  const item = props.item.offlineItem;
  const isHidePrice = props.isHidePrice;

  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
      <tbody>
        {(item.business === "hotel" ||
          item.business === "activity" ||
          item.business === "transfers" ||
          item.business === "custom") && (
          <tr>
            <td>
              <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                paddingBottom: "16px",
                                paddingTop: "24px",
                              }}
                            >
                              <h5
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              >
                                {item.name}

                                {item.business === "transfers" && (
                                  <React.Fragment>
                                    {item.fromLocation} To {item.toLocation}
                                  </React.Fragment>
                                )}
                              </h5>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {!isHidePrice && (
                                <h5
                                  style={{
                                    fontSize: "20px",
                                    color: "#f18247",
                                    fontWeight: "bold",
                                    padding: "0px",
                                    margin: "0px",
                                  }}
                                >
                                  <Amount amount={item.sellPrice}></Amount>
                                </h5>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td valign="top">
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td valign="top">
                              <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td width="1%" style={{ width: "1%" }}>
                                      <span>
                                        {item.imgUrl && (
                                          <img
                                            src={item.imgUrl}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src =
                                                item.business === "hotel"
                                                  ? ImageHotelDefault
                                                  : item.business === "activity"
                                                  ? ImageActivityDefault
                                                  : item.business === "transfers"
                                                  ? ImageTransfersDefault
                                                  : ImageCustomDefault;
                                            }}
                                            alt=""
                                            width="250px"
                                            height="160px"
                                            style={{
                                              width: "250px",
                                              height: "160px",
                                              objectFit: "cover",
                                            }}
                                          ></img>
                                        )}

                                        {!item.imgUrl && (
                                          <img
                                            src={
                                              item.business === "hotel"
                                                ? ImageHotelDefault
                                                : item.business === "activity"
                                                ? ImageActivityDefault
                                                : item.business === "transfers"
                                                ? ImageTransfersDefault
                                                : ImageCustomDefault
                                            }
                                            alt=""
                                            width="250px"
                                            height="160px"
                                            style={{
                                              width: "250px",
                                              height: "160px",
                                              objectFit: "cover",
                                            }}
                                          ></img>
                                        )}
                                      </span>
                                    </td>

                                    <td
                                      valign="top"
                                      style={{
                                        paddingLeft: "16px",
                                      }}
                                    >
                                      <table
                                        cellPadding="0"
                                        cellSpacing="0"
                                        border="0"
                                        width="100%"
                                      >
                                        <tbody>
                                          {(item.business === "hotel" ||
                                            item.business === "activity" ||
                                            item.business === "custom") && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  <b>Address : </b>
                                                  {item.toLocation}
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          {item.business === "transfers" && (
                                            <React.Fragment>
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Pick-up : </b>
                                                    {item.fromLocation}
                                                  </div>
                                                </td>
                                              </tr>

                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Drop-off : </b>
                                                    {item.toLocation}
                                                  </div>
                                                </td>
                                              </tr>
                                            </React.Fragment>
                                          )}

                                          {item.business === "hotel" && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  <b>Star Rating : </b> {item.rating}
                                                  <span> Star</span>
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          {item.business !== "custom" && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  {item.business === "hotel" && (
                                                    <React.Fragment>
                                                      <b>No of Room(s) : </b> {item.noRooms}
                                                    </React.Fragment>
                                                  )}

                                                  {(item.business === "activity" ||
                                                    item.business === "transfers") && (
                                                    <React.Fragment>
                                                      <b>No of Guest(s) : </b>
                                                      {item.guests}
                                                    </React.Fragment>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          <tr>
                                            <td
                                              style={{
                                                fontSize: "14px",
                                                paddingBottom: "8px",
                                              }}
                                            >
                                              <div>
                                                {item.business === "hotel" && (
                                                  <React.Fragment>
                                                    <b>Room Type(s) : </b>
                                                    {item.itemType}
                                                  </React.Fragment>
                                                )}

                                                {(item.business === "activity" ||
                                                  item.business === "transfers" ||
                                                  item.business === "custom") && (
                                                  <React.Fragment>
                                                    <b>
                                                      {item.business === "activity" &&
                                                        "Activity Type : "}
                                                      {item.business === "transfers" &&
                                                        "Vehicle Type : "}
                                                      {item.business === "custom" && "Item Type : "}
                                                    </b>
                                                    {item.itemType}
                                                  </React.Fragment>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: "14px",
                                                paddingBottom: "8px",
                                              }}
                                            >
                                              <div>
                                                {item.business === "hotel" && <b>Check-in : </b>}
                                                {(item.business === "activity" ||
                                                  item.business === "transfers" ||
                                                  item.business === "custom") && <b>Date : </b>}
                                                <Date date={item.startDate} />
                                              </div>
                                            </td>
                                          </tr>

                                          {(item.business === "activity" ||
                                            item.business === "transfers") && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  <b>
                                                    {item.business === "activity" && "Duration : "}
                                                    {item.business === "transfers" &&
                                                      "Pick-up Time : "}
                                                  </b>
                                                  <span>{item.duration}</span>
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          {item.business === "hotel" && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                }}
                                              >
                                                <div>
                                                  <b>Check-out : </b>
                                                  <Date date={item.endDate} />
                                                </div>
                                              </td>
                                            </tr>
                                          )}

                                          {item.business === "custom" &&
                                            item.description.length < 180 && (
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  <div>
                                                    <b>Description : </b>
                                                    {item.description}
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          {item.description && item.business !== "custom" && (
                            <tr>
                              <td
                                style={{
                                  fontSize: "14px",
                                }}
                              >
                                <br />
                                <div>{item.description}</div>
                              </td>
                            </tr>
                          )}

                          {item.description &&
                            item.description.length > 180 &&
                            item.business === "custom" && (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  <br />
                                  <div>{item.description}</div>
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}

        {(item.business || item.itemDtl.business) === "air" && (
          <tr>
            <td>
              <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                paddingTop: "24px",
                              }}
                            >
                              <h5
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              >
                                {item.fromLocation}
                                {" - "}
                                {item.toLocation}
                                {item.isRoundTrip && " - "}
                                {item.isRoundTrip && item.fromLocation}
                              </h5>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              {(props.type !== "ItineraryItem" ||
                                (props.departFlight && !props.returnFlight)) &&
                                !isHidePrice && (
                                  <h5
                                    style={{
                                      fontSize: "20px",
                                      color: "#f18247",
                                      fontWeight: "bold",
                                      padding: "0px",
                                      margin: "0px",
                                    }}
                                  >
                                    <Amount amount={item.sellPrice}></Amount>
                                  </h5>
                                )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          {(props.type !== "ItineraryItem" ||
                            (props.departFlight && !props.returnFlight)) && (
                            <tr>
                              <td
                                style={{
                                  paddingTop: "16px",
                                }}
                              >
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "16px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <b>{item.fromLocation}- </b>
                                                <b>{item.toLocation}</b>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td width="99%">
                                                <table
                                                  cellPadding="0"
                                                  cellSpacing="0"
                                                  border="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        style={{
                                                          fontSize: "14px",
                                                          paddingBottom: "8px",
                                                        }}
                                                      >
                                                        <span>
                                                          <b>Airline: </b>
                                                          {item.departAirlineName}
                                                        </span>{" "}
                                                        <span>{item.departFlightNumber}</span>,{" "}
                                                        <span>
                                                          <b>Stop(s): </b>
                                                          {item.departStops} stop(s)
                                                        </span>
                                                        {", "}
                                                        <span>
                                                          <b>Duration: </b>
                                                          {item.departDuration}
                                                        </span>
                                                        {", "}
                                                        <span>
                                                          <b>Cabin Class: </b>
                                                          {item.departClass}
                                                        </span>
                                                      </td>
                                                    </tr>

                                                    <tr>
                                                      <td
                                                        style={{
                                                          fontSize: "14px",
                                                          paddingBottom: "8px",
                                                        }}
                                                      >
                                                        <span>
                                                          <b>Departure: </b>
                                                          <Date
                                                            date={item.departStartDate}
                                                            format="shortDate"
                                                          />{" "}
                                                          {item.departStartTime}
                                                          <b>, Arrival: </b>
                                                          <Date
                                                            date={item.departEndDate}
                                                            format="shortDate"
                                                          />{" "}
                                                          {item.departEndTime}
                                                        </span>

                                                        <span>
                                                          {item.adult && (
                                                            <React.Fragment>
                                                              , <b>{item.adult}</b> Adult(s)
                                                            </React.Fragment>
                                                          )}
                                                          {item.child && !item.child == "0" && (
                                                            <React.Fragment>
                                                              , <b>{item.child}</b> Child(ren)
                                                            </React.Fragment>
                                                          )}
                                                          {item.infant && !item.infant === "0" && (
                                                            <React.Fragment>
                                                              , <b>{item.infant}</b> Infant(s)
                                                            </React.Fragment>
                                                          )}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}

                          {(props.type !== "ItineraryItem" ||
                            (!props.departFlight && props.returnFlight)) &&
                            item.isRoundTrip && (
                              <tr>
                                <td
                                  style={{
                                    paddingTop: "16px",
                                  }}
                                >
                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style={{
                                                    fontSize: "16px",
                                                    paddingBottom: "8px",
                                                  }}
                                                >
                                                  <b>{item.toLocation}- </b>
                                                  <b>{item.fromLocation}</b>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>
                                          <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            border="0"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td width="99%">
                                                  <table
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    border="0"
                                                    width="100%"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Airline: </b>
                                                            {item.returnAirlineName}
                                                          </span>{" "}
                                                          <span>{item.returnFlightNumber}</span>,{" "}
                                                          <span>
                                                            <b>Stop(s): </b>
                                                            {item.returnStops} stop(s)
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Duration: </b>
                                                            {item.returnDuration}
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Cabin Class: </b>
                                                            {item.returnClass}
                                                          </span>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: "14px",
                                                            paddingBottom: "8px",
                                                          }}
                                                        >
                                                          <span>
                                                            <b>Departure: </b>
                                                            <Date
                                                              date={item.returnStartDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.departStartTime}
                                                            <b>, Arrival: </b>
                                                            <Date
                                                              date={item.returnEndDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            {item.returnEndTime}
                                                          </span>

                                                          <span>
                                                            {item.adult && (
                                                              <React.Fragment>
                                                                , <b>{item.adult}</b> Adult(s)
                                                              </React.Fragment>
                                                            )}
                                                            {item.child && !item.child == "0" && (
                                                              <React.Fragment>
                                                                , <b>{item.child}</b> Child(ren)
                                                              </React.Fragment>
                                                            )}
                                                            {item.infant && !item.infant === "0" && (
                                                              <React.Fragment>
                                                                , <b>{item.infant}</b> Infant(s)
                                                              </React.Fragment>
                                                            )}
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UmrahPackageEmailItemsOffline;
