import React from "react";
import Date from "../../helpers/date";
import Amount from "../../helpers/amount";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import { Trans } from "../../helpers/translate";

const UmrahPackageEmailItemsFromList = (props) => {
  const item = props.item.itemDtl;
  const tripType = item.tripType;
  let totalAmount = 0;

  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
      <tbody>
        {(item.business === "hotel" ||
          item.business === "activity" ||
          item.business === "transfers") && (
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
                                    {item.fromLocation} {item.pickupType} To {item.toLocation}{" "}
                                    {item.dropoffType}
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
                              <h5
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              >
                                <Amount amount={item.amount}></Amount>
                              </h5>
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
                                        <img
                                          src={item.images.find((x) => x.isDefault === true).url}
                                          alt=""
                                          width="250px"
                                          height="160px"
                                          style={{
                                            width: "250px",
                                            height: "160px",
                                            objectFit: "cover",
                                          }}
                                        ></img>
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
                                            item.business === "activity") && (
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  <b>Address : </b>
                                                  {item.locationInfo.fromLocation.address ||
                                                    item.locationInfo.fromLocation.city}
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
                                                    {item.stopInfo.find(
                                                      (x) => x.code === "pickup"
                                                    ) &&
                                                      item.stopInfo.find((x) => x.code === "pickup")
                                                        .item[0].name}{" "}
                                                    {item.stopInfo.find(
                                                      (x) => x.code === "pickup"
                                                    ) &&
                                                      item.stopInfo.find((x) => x.code === "pickup")
                                                        .type}
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
                                                    {item.stopInfo.find(
                                                      (x) => x.code === "dropoff"
                                                    ) &&
                                                      item.stopInfo.find(
                                                        (x) => x.code === "dropoff"
                                                      ).item[0].name}{" "}
                                                    {item.stopInfo.find(
                                                      (x) => x.code === "dropoff"
                                                    ) &&
                                                      item.stopInfo.find(
                                                        (x) => x.code === "dropoff"
                                                      ).type}
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
                                                    {item.items.length > 1 && (
                                                      <div>
                                                        <b>No of Room(s) : </b>
                                                        {item.items.length}
                                                      </div>
                                                    )}

                                                    {item.items.length === 1 && (
                                                      <div>
                                                        <b>No of Room(s) : </b>
                                                        {item.items[0].item.length}
                                                      </div>
                                                    )}
                                                  </React.Fragment>
                                                )}

                                                {(item.business === "activity" ||
                                                  item.business === "transfers") && (
                                                  <React.Fragment>
                                                    <b>No of Guest(s) : </b>
                                                    {item.paxInfo.find((x) => x) &&
                                                      item.paxInfo.find((x) => x).quantity !== 0 &&
                                                      item.paxInfo.find((x) => x).quantity}

                                                    {!item.paxInfo.find((x) => x.quantity) &&
                                                      item.items[0]?.properties?.pax?.adult}
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
                                                {item.business === "hotel" && (
                                                  <React.Fragment>
                                                    {item.items.length > 1 && (
                                                      <div>
                                                        <b>Room Type(s) : </b>
                                                        {item.items.map((room, key) => {
                                                          return (
                                                            <React.Fragment key={key}>
                                                              {key !== 0 && ", "}
                                                              {room.item.find((x) => x).name}
                                                            </React.Fragment>
                                                          );
                                                        })}
                                                      </div>
                                                    )}

                                                    {item.items.length === 1 && (
                                                      <div>
                                                        <b>Room Type(s) : </b>
                                                        {item.items[0].item.map((room, key) => {
                                                          return (
                                                            <React.Fragment key={key}>
                                                              {key !== 0 && ", "}
                                                              {room.name}
                                                            </React.Fragment>
                                                          );
                                                        })}
                                                      </div>
                                                    )}
                                                  </React.Fragment>
                                                )}

                                                {item.business === "activity" && (
                                                  <React.Fragment>
                                                    <b>Activity Type : </b>
                                                    {item.items[0].item[0].name}
                                                  </React.Fragment>
                                                )}

                                                {item.business === "transfers" && (
                                                  <React.Fragment>
                                                    <b>Vehicle Type : </b>
                                                    {item.items[0].item[0].name}
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
                                                  item.business === "transfers") && <b>Date : </b>}
                                                <Date date={item.dateInfo.startDate} />
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
                                                  <b>Duration : </b>

                                                  {item.tpExtension &&
                                                    item.tpExtension.find(
                                                      (x) => x.key === "duration"
                                                    ) &&
                                                    item.tpExtension.find(
                                                      (x) => x.key === "duration"
                                                    ).value}
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
                                                  <Date date={item.dateInfo.endDate} />
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
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}

        {item.business === "air" && (
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
                                {item.locationInfo.fromLocation.city}
                                {" - "}
                                {item.locationInfo.toLocation.city}
                                {tripType === "roundtrip" && " - "}
                                {tripType === "roundtrip" && item.locationInfo.fromLocation.city}
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
                              <h5
                                style={{
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold",
                                  padding: "0px",
                                  margin: "0px",
                                }}
                              >
                                {item.displayAmount}
                              </h5>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {item.items.map((item, key) => {
                        const loc = item.locationInfo;
                        loc.fromLocation = loc.fromLocation || loc.FromLocation;
                        loc.toLocation = loc.toLocation || loc.ToLocation;
                        const date = item.dateInfo;
                        const stopCount = item.item.length - 1;
                        const stops =
                          stopCount === 0
                            ? "non stop"
                            : stopCount === 1
                            ? stopCount + " stop"
                            : stopCount + " stops";
                        const duration =
                          item.tpExtension.find((x) => x.key === "durationHours").value +
                          "h " +
                          item.tpExtension.find((x) => x.key === "durationMinutes").value +
                          "m";
                        const url = item.item[0].images.find((x) => x.type === "default").url;

                        const airline = item.item[0].vendors[0].item.name;
                        const airlineCode = item.item[0].code;

                        const getOnErrorImageURL = () => {
                          return ImageNotFound.toString();
                        };

                        const cabinClass = item.item[0].tpExtension.find(
                          (x) => x.key === "cabinClass"
                        )
                          ? item.item[0].tpExtension.find((x) => x.key === "cabinClass").value
                          : "";

                        return (
                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" key={key}>
                            <tbody>
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
                                                  <b>
                                                    {loc.fromLocation.id +
                                                      ", " +
                                                      loc.fromLocation.name +
                                                      ", " +
                                                      loc.fromLocation.city}{" "}
                                                    -{" "}
                                                  </b>
                                                  <b>
                                                    {loc.toLocation.id +
                                                      ", " +
                                                      loc.toLocation.name +
                                                      ", " +
                                                      loc.toLocation.city}
                                                  </b>
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
                                                <td width="1%">
                                                  <img
                                                    src={url}
                                                    alt=""
                                                    style={{
                                                      width: "120px",
                                                      height: "50px",
                                                      objectFit: "contain",
                                                      border: "solid 1px #f1f1f1",
                                                      marginRight: "16px",
                                                    }}
                                                  />
                                                </td>
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
                                                            {airline}
                                                          </span>{" "}
                                                          <span>{airlineCode}</span>,{" "}
                                                          <span>
                                                            <b>Stop(s): </b>
                                                            {Trans(
                                                              "_" +
                                                                stops
                                                                  .replace(" ", "")
                                                                  .replace(" ", "")
                                                                  .toLowerCase()
                                                            )}
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Duration: </b>
                                                            {duration}
                                                          </span>
                                                          {", "}
                                                          <span>
                                                            <b>Cabin Class: </b>
                                                            {cabinClass}
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
                                                              date={date.startDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            <Date
                                                              date={date.startDate}
                                                              format="shortTime"
                                                            />
                                                            <b>, Arrival: </b>
                                                            <Date
                                                              date={date.endDate}
                                                              format="shortDate"
                                                            />{" "}
                                                            <Date
                                                              date={date.endDate}
                                                              format="shortTime"
                                                            />
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
                            </tbody>
                          </table>
                        );
                      })}
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

export default UmrahPackageEmailItemsFromList;
