import React from "react";
import Date from "../../helpers/date";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import HtmlParser from "../../helpers/html-parser";

const QuotationEmailItems = (props) => {
  const { item, showImagesInEmail } = props;
  const tripType = item.tripType;
  let totalAmount = 0;
  return (
    <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
      <tbody>
        {(item.business || item.itemDtl.business) === "hotel" && (
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
                                {item.itemDtl.name}
                              </h5>
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                fontSize: "20px",
                                color: "#f18247",
                                fontWeight: "bold"
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
                                {item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms &&
                                  item.itemDtl.items.find((x) => x.id === item.roomId)
                                    .displayAmount}

                                {!item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms && (
                                  <React.Fragment>
                                    {item.roomId.map((room) => {
                                      let roomAmount = item.itemDtl.items
                                        .find((x) => x.id === room.groupid)
                                        .item.find((y) => y.code === room.roomCode).amount;
                                      totalAmount = roomAmount + totalAmount;
                                    })}
                                    <Amount amount={totalAmount.toFixed(2)}></Amount>
                                  </React.Fragment>
                                )}
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
                            {showImagesInEmail &&
                              <td width="1%">
                                <span>
                                  <img
                                    src={item.itemDtl.images.find((x) => x.isDefault).url}
                                    alt=""
                                    style={{
                                      width: "250px",
                                      height: "160px",
                                      objectFit: "cover",
                                    }}
                                  ></img>
                                </span>
                              </td>
                            }
                            <td
                              valign="top"
                              style={{
                                paddingLeft: "16px",
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
                                                fontSize: "14px",
                                                paddingBottom: "8px",
                                              }}
                                            >
                                              <div>
                                                <b>Address : </b>
                                                {item.itemDtl.locationInfo.fromLocation.address ||
                                                  item.itemDtl.locationInfo.fromLocation.city}
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
                                                <b>Star Rating : </b> {item.itemDtl.rating}
                                                <span> Star</span>
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
                                                {item.itemDtl.items.find((x) => x.flags).flags
                                                  .isGroupedRooms && (
                                                    <div>
                                                      <b>
                                                        {
                                                          item.itemDtl.items.find(
                                                            (x, key) => x.id === item.roomId
                                                          ).item.length
                                                        }{" "}
                                                        x Room(s) :{" "}
                                                      </b>{" "}
                                                      {item.itemDtl.items
                                                        .find((x) => x.id === item.roomId)
                                                        .item.map((room, key) => {
                                                          return (
                                                            <React.Fragment key={key}>
                                                              {key !== 0 && ", "}
                                                              {room.name}
                                                            </React.Fragment>
                                                          );
                                                        })}
                                                    </div>
                                                  )}

                                                {!item.itemDtl.items.find((x) => x.flags).flags
                                                  .isGroupedRooms && (
                                                    <div>
                                                      <b>{item.roomId.length} x Room(s) : </b>{" "}
                                                      {item.roomId.map((room, key) => {
                                                        return (
                                                          <React.Fragment>
                                                            {key !== 0 && ", "}
                                                            {
                                                              item.itemDtl.items
                                                                .find((x) => x.id === room.groupid)
                                                                .item.find(
                                                                  (y) => y.code === room.roomCode
                                                                ).name
                                                            }
                                                          </React.Fragment>
                                                        );
                                                      })}
                                                    </div>
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
                                                <b>Check-in : </b>
                                                <Date date={item.itemDtl.dateInfo.startDate} />
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              <div>
                                                <b>Check-out : </b>
                                                <Date date={item.itemDtl.dateInfo.endDate} />
                                              </div>
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
            </td>
          </tr>
        )}

        {((item.business || item.itemDtl.business) === "activity" ||
          (item.business || item.itemDtl.business) === "transfers") && (
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
                                  paddingTop: "24px"
                                }}
                              >
                                <h5
                                  style={{
                                    fontSize: "20px",
                                    color: "#f18247",
                                    fontWeight: "bold",
                                    padding: "0px",
                                    margin: "0px"
                                  }}
                                >
                                  {item.itemDtl.name}
                                </h5>
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontSize: "20px",
                                  color: "#f18247",
                                  fontWeight: "bold"
                                }}
                              >
                                <h5
                                  style={{
                                    fontSize: "20px",
                                    color: "#f18247",
                                    fontWeight: "bold",
                                    padding: "0px",
                                    margin: "0px"
                                  }}
                                >
                                  {
                                    item.itemDtl.items
                                      .find((x) => x)
                                      .item.find((x) => x.code === item.roomCode).displayAmount
                                  }
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
                              {showImagesInEmail &&
                                <td width="1%">
                                  <span>
                                    <img
                                      src={item.itemDtl.images.find((x) => x.isDefault).url}
                                      alt=""
                                      style={{
                                        width: "250px",
                                        height: "160px",
                                        objectFit:
                                          item.itemDtl.business === "transfers" ? "contain" : "cover",
                                      }}
                                    ></img>
                                  </span>
                                </td>
                              }
                              <td
                                valign="top"
                                style={{
                                  paddingLeft: "16px",
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
                                                  fontSize: "14px",
                                                  paddingBottom: "8px",
                                                }}
                                              >
                                                <div>
                                                  <b>Address : </b>
                                                  {item.itemDtl.locationInfo.fromLocation.address}
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
                                                  <b>{Trans("_duration")} : </b>
                                                  <HtmlParser
                                                    text={
                                                      item.itemDtl.tpExtension.find(
                                                        (x) => x.key === "duration"
                                                      ).value
                                                    }
                                                  />
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
                                                  <b>
                                                    {item.itemDtl.paxInfo.find((x) => x).quantity} x
                                                    Guest(s) :{" "}
                                                  </b>

                                                  {item.itemDtl.items.map(
                                                    (x) =>
                                                      x.item.find((y) => y.id === item.roomId) &&
                                                      x.item.find((y) => y.id === item.roomId).name
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
                                                  <b>Date : </b>
                                                  {item.itemDtl.items.map(
                                                    (x, key) =>
                                                      x.item.find((y) => y.id === item.roomId) && (
                                                        <Date
                                                          key={key}
                                                          date={
                                                            x.item.find((y) => y.id === item.roomId)
                                                              .dateInfo.startDate
                                                          }
                                                        />
                                                      )
                                                  )}
                                                </div>
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
                                fontWeight: "bold"
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
                                                {showImagesInEmail &&
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
                                                }
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

export default QuotationEmailItems;
