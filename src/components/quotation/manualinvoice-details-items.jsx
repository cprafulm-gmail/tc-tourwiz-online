import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import StarRating from "./../common/star-rating";
import Date from "../../helpers/date";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import HtmlParser from "../../helpers/html-parser";
import QuotationDetailsPopup from "./quotation-details-popup";
import ComingSoon from "../../helpers/coming-soon";
import AuthorizeComponent from "../common/authorize-component";
import PaxIcons from "../common/pax-icons";

class ManualInvoiceDetailsItems extends Component {
  constructor(props) {
    super(props);
    this.state = { isDetailPopup: false, comingsoon: false };
  }

  handleItemDelete = (item) => {
    this.props.handleItemDelete(item);
  };

  handleItemEdit = (item) => {
    this.props.handleItemEdit(item);
  };

  showHideDetailPopup = () => {
    this.setState({ isDetailPopup: !this.state.isDetailPopup });
  };

  handleViewInvoice = (item) => {
    let portalURL = window.location.origin;
    let mode = 'single';
    var win = window.open(
      `${portalURL}/manualinvoice/${this.props.invoiceid}/${item.offlineItem.uuid}`,
      "_blank"
    );
    win.focus();
  }
  renderStops = (stopDetails) => {
    let stops = Array.isArray(stopDetails) ? stopDetails.length : Number(stopDetails);
    return stops === 0 ? "Non Stop" : stops + " stops "
  }

  render() {
    const { item, mode } = this.props;
    const tripType = item.tripType;
    const tripTypeDtl = item.itemDtl && item.itemDtl.tripType;
    let totalAmount = 0;
    let totalTaxAmount = 0;

    if ((item.offlineItem.CGSTPrice || item.offlineItem.SGSTPrice || item.offlineItem.IGSTPrice) && !item.offlineItem.isInclusive) {
      totalTaxAmount = Number(item.offlineItem.CGSTPrice) + Number(item.offlineItem.SGSTPrice) + Number(item.offlineItem.IGSTPrice);
    }
    const env = JSON.parse(localStorage.getItem("environment"));
    let generalTaxes = []
    let business = (item.offlineItem.business || item?.itemDtl?.business).toLowerCase();
    if (business === "transfers" || business === "custom" || business === "package") business = "activity";
    if (env?.customTaxConfigurations && env?.customTaxConfigurations
      .find(x => x.business.toLowerCase() === business)) {
      generalTaxes = env?.customTaxConfigurations
        .find(x => x.business.toLowerCase() === business)
        .taxes.filter(tax => tax.isShowOnUI && Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
        .map(item => { return { "name": item.name, "purpose": item.purpose } })
        .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    }

    if (generalTaxes.length > 0) {
      generalTaxes.map((taxitem, count) => {
        totalTaxAmount += Number(item.offlineItem["tax" + ((parseInt(taxitem.purpose) - 160) + 1)])
      })
    }

    return (
      <div className="border-bottom p-3 quotation-details-item dayview-item">
        {!item.offlineItem && !item.isFromList && (
          <React.Fragment>
            {(item.business || item.itemDtl.business) === "hotel" && (
              <div className="row">
                <div className="col-lg-6 d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="border rounded bg-white d-flex align-items-center justify-content-center"
                      style={{ height: "48px", width: "48px" }}
                    >
                      <SVGIcon
                        className="d-flex align-items-center text-primary"
                        name={"hotel"}
                        width="32"
                        type="fill"
                      ></SVGIcon>
                    </div>
                    <div className="ml-3">
                      <h2
                        className="p-0 m-0 mb-1"
                        style={{ fontSize: "1.2rem", fontWeight: "600" }}
                      >
                        {item.itemDtl.name}
                        <span className="ml-3 position-relative" style={{ top: "-2px" }}>
                          <StarRating {...[item.itemDtl.rating]} />
                        </span>
                      </h2>
                      <small className="mt-1 mr-3 text-secondary">
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        {item.itemDtl.locationInfo.fromLocation.address}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 d-flex align-items-center">
                  <div>
                    {item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms && (
                      <div>
                        <b>
                          {item.itemDtl.items.find((x, key) => x.id === item.roomId).item.length} x
                          Room(s) :{" "}
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

                    {!item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms && (
                      <div>
                        <b>{item.roomId.length} x Room(s) : </b>{" "}
                        {item.roomId.map((room, key) => {
                          return (
                            <React.Fragment key={key}>
                              {key !== 0 && ", "}
                              {
                                item.itemDtl.items
                                  .find((x) => x.id === room.groupid)
                                  .item.find((y) => y.code === room.roomCode).name
                              }
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}

                    <div>
                      <small className="text-secondary">
                        {item.itemDtl.locationInfo.fromLocation.city} -{" "}
                        <Date date={item.itemDtl.dateInfo.startDate} /> to{" "}
                        <Date date={item.itemDtl.dateInfo.endDate} />
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 d-flex align-items-center justify-content-end">
                  <h3
                    className="p-0 m-0 text-primary"
                    style={{ fontSize: "1.2rem", fontWeight: "700" }}
                  >
                    {item.itemDtl.items.find((x) => x.flags).flags.isGroupedRooms &&
                      item.itemDtl.items.find((x) => x.id === item.roomId).displayAmount}

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
                  </h3>

                  <button
                    className="btn btn-sm d-flex align-items-center ml-2"
                    onClick={() => this.handleItemDelete(item)}
                  >
                    <SVGIcon
                      name="delete"
                      width="20"
                      height="20"
                      className="d-flex align-items-center text-secondary"
                    ></SVGIcon>
                  </button>
                </div>
              </div>
            )}

            {((item.business || item.itemDtl.business) === "activity" ||
              (item.business || item.itemDtl.business) === "transfers") && (
                <div className="row">
                  <div className="col-lg-6 d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <div
                        className="border rounded bg-white d-flex align-items-center justify-content-center"
                        style={{ height: "48px", width: "48px" }}
                      >
                        <SVGIcon
                          className="d-flex align-items-center text-primary"
                          name={item.itemDtl.business}
                          width="32"
                          type="fill"
                        ></SVGIcon>
                      </div>
                      <div className="ml-3">
                        <h2
                          className="p-0 m-0 mb-1"
                          style={{ fontSize: "1.2rem", fontWeight: "600" }}
                        >
                          <HtmlParser text={item.itemDtl.name} />
                          <span className="ml-3 position-relative" style={{ top: "-2px" }}>
                            <StarRating {...[item.itemDtl.rating]} />
                          </span>
                        </h2>
                        {!item.itemDtl.business === "transfers" && (
                          <small className="mt-1 mr-3 text-secondary">
                            <SVGIcon
                              name="map-marker"
                              width="16"
                              type="fill"
                              height="16"
                              className="mr-2"
                            ></SVGIcon>
                            {item.itemDtl.locationInfo.fromLocation.address}
                          </small>
                        )}
                        {item.itemDtl.tpExtension.find((x) => x.key === "duration") !== undefined &&
                          item.itemDtl.tpExtension.find((x) => x.key === "duration").value !== "" ? (
                          <small className="text-secondary">
                            <SVGIcon name="clock" className="mr-2"></SVGIcon>
                            {Trans("_duration")} :{" "}
                            <HtmlParser
                              text={item.itemDtl.tpExtension.find((x) => x.key === "duration").value}
                            />
                          </small>
                        ) : item.itemDtl.tpExtension.find((x) => x.key === "totalduration") !==
                          undefined &&
                          item.tpExtension.find((x) => x.key === "totalduration").value !== "" ? (
                          <small className="text-secondary">
                            <SVGIcon name="clock" className="mr-2"></SVGIcon>
                            {Trans("_duration")} :{" "}
                            <HtmlParser
                              text={
                                item.itemDtl.tpExtension.find((x) => x.key === "totalduration").value
                              }
                            />
                          </small>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 d-flex align-items-center">
                    <div>
                      <div>
                        <div>
                          <b>
                            {!item.itemDtl.paxInfo.find((x) => x.quantity) &&
                              item.itemDtl.items.map(
                                (x) =>
                                  x.item.find((y) => y.id === item.roomId) &&
                                  x.properties &&
                                  x.properties.pax &&
                                  x.properties.pax.adult &&
                                  x.properties.pax.adult
                              )}
                            {item.itemDtl.paxInfo.find((x) => x.quantity) &&
                              item.itemDtl.paxInfo.find((x) => x.quantity).quantity}{" "}
                            x Guest(s) :{" "}
                          </b>

                          {item.itemDtl.items.map(
                            (x) =>
                              x.item.find((y) => y.id === item.roomId) &&
                              x.item.find((y) => y.id === item.roomId).name
                          )}
                        </div>

                        <div>
                          <small className="text-secondary">
                            {item.itemDtl.items.map(
                              (x, key) =>
                                x.item.find((y) => y.id === item.roomId) && (
                                  <Date
                                    key={key}
                                    date={x.item.find((y) => y.id === item.roomId).dateInfo.startDate}
                                  />
                                )
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 d-flex align-items-center justify-content-end">
                    <h3
                      className="p-0 m-0 text-primary"
                      style={{ fontSize: "1.2rem", fontWeight: "700" }}
                    >
                      {
                        item.itemDtl.items.find((x) => x).item.find((x) => x.code === item.roomCode)
                          .displayAmount
                      }
                    </h3>

                    <button
                      className="btn btn-sm d-flex align-items-center ml-2"
                      onClick={() => this.handleItemDelete(item)}
                    >
                      <SVGIcon
                        name="delete"
                        width="20"
                        height="20"
                        className="d-flex align-items-center text-secondary"
                      ></SVGIcon>
                    </button>
                  </div>
                </div>
              )}

            {(item.business || item.itemDtl.business) === "air" && (
              <div className="row">
                <div className="col-lg-1">
                  <div
                    className="border rounded bg-white d-flex align-items-center justify-content-center"
                    style={{ height: "48px", width: "48px" }}
                  >
                    <SVGIcon
                      className="d-flex align-items-center text-primary"
                      name={item.business}
                      width="32"
                      type="fill"
                    ></SVGIcon>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row">
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
                        <div
                          className={tripType === "roundtrip" ? "col-lg-6" : "col-lg-12"}
                          key={key}
                        >
                          <div className="border-right">
                            <div className="row">
                              <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                <img
                                  className="img-fluid"
                                  src={url || ImageNotFound}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getOnErrorImageURL();
                                  }}
                                  alt=""
                                />
                                <span className="small text-secondary mt-2 text-center">
                                  <span className="text-nowrap">{airline}</span>{" "}
                                  <span className="text-nowrap">{airlineCode}</span>
                                </span>
                              </div>
                              <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                <span className="small text-secondary">{loc.fromLocation.id}</span>

                                <b>
                                  <Date date={date.startDate} format="shortTime" />
                                </b>

                                <span className="small text-secondary">
                                  <Date date={date.startDate} format="shortDate" />
                                </span>
                              </div>
                              <div className="col-lg-4 d-flex justify-content-center align-items-center flex-column">
                                <span className="small text-nowrap mb-2">
                                  <i className="align-text-bottom">
                                    <SVGIcon
                                      name="clock"
                                      className="mr-1 text-secondary"
                                      width="12"
                                      height="12"
                                    ></SVGIcon>
                                  </i>
                                  {duration}
                                </span>
                                <Stops {...[stopCount]} />
                                <span className="small mt-1">
                                  {Trans(
                                    "_" + stops.replace(" ", "").replace(" ", "").toLowerCase()
                                  )}
                                  {cabinClass && " | " + cabinClass}
                                </span>
                              </div>
                              <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                <span className="small text-secondary">{loc.toLocation.id}</span>

                                <b>
                                  <Date date={date.endDate} format="shortTime" />
                                </b>

                                <span className="small text-secondary">
                                  <Date date={date.endDate} format="shortDate" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-lg-2 d-flex align-items-center justify-content-end">
                  <h3
                    className="p-0 m-0 text-primary text-right"
                    style={{ fontSize: "1.2rem", fontWeight: "700" }}
                  >
                    {item.displayAmount}
                    <small className="d-block text-secondary mt-2" style={{ fontSize: "0.7rem" }}>
                      {item.paxInfo.find((x) => x.typeString === "ADT") &&
                        item.paxInfo.find((x) => x.typeString === "ADT").quantity + " Adult(s)"}
                      {item.paxInfo.find((x) => x.typeString === "CHD") &&
                        ", " +
                        item.paxInfo.find((x) => x.typeString === "CHD").quantity +
                        " Child(ren)"}
                      {item.paxInfo.find((x) => x.typeString === "INF") &&
                        ", " +
                        item.paxInfo.find((x) => x.typeString === "INF").quantity +
                        " Infant(s)"}
                    </small>
                  </h3>

                  <button
                    className="btn btn-sm d-flex align-items-center ml-2"
                    onClick={() => this.handleItemDelete(item)}
                  >
                    <SVGIcon
                      name="delete"
                      width="20"
                      height="20"
                      className="d-flex align-items-center text-secondary"
                    ></SVGIcon>
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        )}

        {item.offlineItem && !item.isFromList && (
          <React.Fragment>
            {item.offlineItem && (
              <div className="row">
                {this.state.isDetailPopup && (
                  <QuotationDetailsPopup
                    details={item.offlineItem.details}
                    businessName={item.offlineItem.business}
                    hideQuickBook={this.showHideDetailPopup}
                  />
                )}

                {(item.offlineItem.business === "hotel" ||
                  item.offlineItem.business === "activity" ||
                  item.offlineItem.business === "transfers" ||
                  item.offlineItem.business === "custom") && (
                    <React.Fragment>
                      <div className={"quotation-details-item-col col-lg-6 d-flex align-items-center " + item.offlineItem.business}>
                        <div className="d-flex align-items-center">
                          <div
                            className="quotation-details-item-icon border rounded bg-white d-flex align-items-center justify-content-center"
                            style={{ height: "48px", width: "48px" }}
                          >
                            <SVGIcon
                              className="d-flex align-items-center text-primary"
                              name={item.offlineItem.business + "new"}
                              width="32"
                              type="fill"
                            ></SVGIcon>
                          </div>

                          <div className="quotation-details-item-title ml-3">
                            {item.offlineItem.details && (
                              <h2
                                className="p-0 m-0 mb-1"
                                style={{ fontSize: "1.2rem", fontWeight: "600", cursor: "pointer" }}
                                onClick={this.showHideDetailPopup}
                              >
                                {item.offlineItem.name}

                                {item.offlineItem.rating > 0 && (
                                  <span className="ml-3 position-relative" style={{ top: "-2px" }}>
                                    <StarRating {...[parseInt(item.offlineItem.rating)]} />
                                  </span>
                                )}
                              </h2>
                            )}

                            {!item.offlineItem.details && (
                              <h2
                                className="p-0 m-0 mb-1"
                                style={{ fontSize: "1.2rem", fontWeight: "600" }}
                              >
                                {item.offlineItem.name}

                                {item.offlineItem.rating > 0 && (
                                  <span className="ml-3 position-relative" style={{ top: "-2px" }}>
                                    <StarRating {...[parseInt(item.offlineItem.rating)]} />
                                  </span>
                                )}
                              </h2>
                            )}

                            {item.offlineItem.business === "transfers" && (
                              <h2
                                className="p-0 m-0 mb-1"
                                style={{ fontSize: "1.2rem", fontWeight: "600" }}
                              >
                                {item.offlineItem.fromLocation}
                                {item.offlineItem.toLocation && " To " + item.offlineItem.toLocation}
                              </h2>
                            )}

                            {item.offlineItem.business === "hotel" && item.offlineItem.toLocation && (
                              <small className="mt-1 mr-3 text-secondary">
                                <SVGIcon
                                  name="map-marker"
                                  width="16"
                                  type="fill"
                                  height="16"
                                  className="mr-2"
                                ></SVGIcon>
                                {item.offlineItem.toLocation}
                              </small>
                            )}

                            {(item.offlineItem.business === "activity" ||
                              item.offlineItem.business === "transfers") &&
                              item.offlineItem.duration && (
                                <small className="text-secondary">
                                  <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                  {Trans("_duration")} : {item.offlineItem.duration}
                                </small>
                              )}

                            {item.offlineItem.business === "transfers" &&
                              item.offlineItem.pickupTime && (
                                <small className="text-secondary">
                                  <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                  {"Start Time"} : {item.offlineItem.pickupTime}
                                </small>
                              )}

                            {item.offlineItem.business === "custom" &&
                              item.offlineItem.description &&
                              item.offlineItem.description.length < 180 && (
                                <small className="mt-1 mr-3 text-secondary">
                                  <SVGIcon
                                    name="file-text"
                                    width="16"
                                    height="16"
                                    className="mr-2"
                                  ></SVGIcon>
                                  {<HtmlParser text={item.offlineItem.description} />}
                                </small>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
                        <div>
                          <div>
                            {item.offlineItem.business === "hotel" && !item.offlineItem.hotelPaxInfo && item.offlineItem.noRooms && (
                              <b>{item.offlineItem.noRooms} x Room(s) : </b>
                            )}

                            {item.offlineItem.business === "hotel" && item.offlineItem.hotelPaxInfo &&
                              item.offlineItem.hotelPaxInfo.map(room =>
                                <React.Fragment>
                                  <span>
                                    {room.roomType ? room.roomType : "Unnamed Room"} {" : "}
                                  </span>
                                  <span style={{ "color": "gray" }}>
                                    {room.noOfAdults} X <PaxIcons
                                      type="adult"
                                      {...[1]}
                                    />
                                  </span>
                                  {room.noOfChild > 0 &&
                                    <React.Fragment>
                                      {" - "}
                                      <span style={{ "color": "gray" }}>
                                        {room.noOfChild} x <PaxIcons
                                          type="child"
                                          {...[1]}
                                        />
                                      </span>
                                    </React.Fragment>}
                                  <br />
                                </React.Fragment>
                              )
                            }

                            {(item.offlineItem.business === "activity" ||
                              item.offlineItem.business === "transfers") &&
                              item.offlineItem.guests && (
                                <b>{item.offlineItem.guests} x Guest(s) : </b>
                              )}

                            {item.offlineItem.business === "hotel" && (!item.offlineItem.hotelPaxInfo || (item.offlineItem.hotelPaxInfo && item.offlineItem.hotelPaxInfo.length === 0)) && item.offlineItem.itemType}
                            {item.offlineItem.business !== "hotel" && item.offlineItem.itemType}

                            {item.offlineItem.business === "hotel" && item.offlineItem.mealType && (
                              <b> Meal : {item.offlineItem.mealType}</b>
                            )}
                          </div>

                          <div>
                            {item.offlineItem.business === "hotel" && (
                              <small className="text-secondary">
                                {item.offlineItem.toLocationCity &&
                                  item.offlineItem.toLocationCity + " - "}
                                <Date date={item.offlineItem.startDate} />
                                {item.offlineItem.endDate && " to "}
                                <Date date={item.offlineItem.endDate} />{" "}
                                {item.offlineItem.nights !== 0 &&
                                  " - " + item.offlineItem.nights + " night(s)"}
                              </small>
                            )}

                            {item.offlineItem.business === "activity" && (
                              <small className="text-secondary">
                                {item.offlineItem.toLocation && item.offlineItem.toLocation + " - "}
                                <Date date={item.offlineItem.startDate} />
                              </small>
                            )}

                            {item.offlineItem.business === "custom" && (
                              <small className="text-secondary">
                                {item.offlineItem.toLocation && item.offlineItem.toLocation + " - "}
                                <Date date={item.offlineItem.startDate} />
                                {/* {" - "}
                                <Date date={item.offlineItem.endDate} /> */}
                              </small>
                            )}

                            {item.offlineItem.business === "transfers" && (
                              <small className="text-secondary">
                                {item.offlineItem.pickupType}
                                {item.offlineItem.dropoffType &&
                                  " - " + item.offlineItem.dropoffType + " - "}
                                <Date date={item.offlineItem.startDate} />
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                {item.offlineItem.business === "air" && (
                  <React.Fragment>
                    <div className="col-lg-10">
                      <div className="row">
                        {!this.props.departFlight && !this.props.returnFlight && (
                          <React.Fragment>
                            <div className="col-lg-12">
                              <div>
                                <div className="row">
                                  <div className={"quotation-details-item-col col-lg-5 d-flex align-items-center " + item.offlineItem.business}>
                                    <div
                                      className="quotation-details-item-icon border rounded bg-white d-flex align-items-center justify-content-center"
                                      style={{ height: "48px", width: "48px" }}
                                    >
                                      <SVGIcon
                                        className="d-flex align-items-center text-primary"
                                        name={item.offlineItem.business}
                                        width="32"
                                        type="fill"
                                      ></SVGIcon>
                                    </div>

                                    <div className="quotation-details-item-title ml-3">
                                      <img
                                        style={{ maxWidth: "60px" }}
                                        src={item.offlineItem.departImg}
                                        alt=""
                                      />

                                      <h2
                                        className="p-0 m-0 mb-1"
                                        style={{ fontSize: "1.2rem", fontWeight: "600" }}
                                      >
                                        <span className="text-nowrap mr-2">
                                          {item.offlineItem.departAirlineName}
                                        </span>
                                        <small className="text-secondary">
                                          {item.offlineItem.departFlightNumber}
                                        </small>
                                      </h2>
                                    </div>
                                  </div>

                                  <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                    <span className="small text-secondary">
                                      {item.offlineItem.fromLocation}
                                    </span>

                                    <b>{item.offlineItem.departStartTime}</b>

                                    <span className="small text-secondary">
                                      <Date
                                        date={item.offlineItem.departStartDate}
                                        format="shortDate"
                                      />
                                    </span>
                                  </div>

                                  <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                    {item.offlineItem.departDuration !== "0h 0m" &&
                                      <span className="small text-nowrap mb-2">
                                        <i className="align-text-bottom">
                                          <SVGIcon
                                            name="clock"
                                            className="mr-1 text-secondary"
                                            width="12"
                                            height="12"
                                          ></SVGIcon>
                                        </i>
                                        {item.offlineItem.departDuration}
                                      </span>
                                    }
                                    <Stops {...[item.offlineItem.departStops]} />
                                    <span className="small mt-1">
                                      {this.renderStops(item.offlineItem.departStops)}
                                      {item.offlineItem.departClass &&
                                        (item.offlineItem.departStops ? " | " : "") + item.offlineItem.departClass}

                                    </span>
                                  </div>

                                  <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                    <span className="small text-secondary">
                                      {item.offlineItem.toLocation}
                                    </span>

                                    <b>{item.offlineItem.departEndTime}</b>

                                    <span className="small text-secondary">
                                      <Date
                                        date={item.offlineItem.departEndDate}
                                        format="shortDate"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {item.offlineItem.isRoundTrip && (
                              <div className="col-lg-12">
                                <div className="mt-3">
                                  <div className="row">
                                    <div className={"quotation-details-item-col col-lg-5 d-flex align-items-center " + item.offlineItem.business}>
                                      <div
                                        className="border rounded bg-white d-flex align-items-center justify-content-center"
                                        style={{ height: "48px", width: "48px" }}
                                      >
                                        <SVGIcon
                                          className="d-flex align-items-center text-primary"
                                          name={item.offlineItem.business}
                                          width="32"
                                          type="fill"
                                        ></SVGIcon>
                                      </div>

                                      <div className="quotation-details-item-title ml-3">
                                        <img
                                          style={{ maxWidth: "60px", maxHeight: "28px" }}
                                          src={item.offlineItem.returnImg}
                                          alt=""
                                        />
                                        <h2
                                          className="p-0 m-0 mb-1"
                                          style={{ fontSize: "1.2rem", fontWeight: "600" }}
                                        >
                                          <span className="text-nowrap mr-2">
                                            {item.offlineItem.returnAirlineName}
                                          </span>
                                          <small className="text-secondary">
                                            {item.offlineItem.returnFlightNumber}
                                          </small>
                                        </h2>
                                      </div>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                      <span className="small text-secondary">
                                        {item.offlineItem.toLocation}
                                      </span>

                                      <b>{item.offlineItem.returnStartTime}</b>

                                      <span className="small text-secondary">
                                        <Date
                                          date={item.offlineItem.returnStartDate}
                                          format="shortDate"
                                        />
                                      </span>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                      {item.offlineItem.returnDuration !== "0h 0m" &&
                                        <span className="small text-nowrap mb-2">
                                          <i className="align-text-bottom">
                                            <SVGIcon
                                              name="clock"
                                              className="mr-1 text-secondary"
                                              width="12"
                                              height="12"
                                            ></SVGIcon>
                                          </i>
                                          {item.offlineItem.returnDuration}
                                        </span>
                                      }
                                      <Stops {...[item.offlineItem.returnStops]} />
                                      <span className="small mt-1">
                                        {this.renderStops(item.offlineItem.returnStops)}
                                        {item.offlineItem.returnClass &&
                                          (item.offlineItem.returnStops ? " | " : "") + item.offlineItem.returnClass}

                                      </span>
                                    </div>

                                    <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                      <span className="small text-secondary">
                                        {item.offlineItem.fromLocation}
                                      </span>

                                      <b>{item.offlineItem.returnEndTime}</b>

                                      <span className="small text-secondary">
                                        <Date
                                          date={item.offlineItem.returnEndDate}
                                          format="shortDate"
                                        />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        )}

                        {this.props.departFlight && !this.props.returnFlight && (
                          <div className="col-lg-12">
                            <div>
                              <div className="row">
                                <div className={"quotation-details-item-col col-lg-5 d-flex align-items-center " + item.offlineItem.business}>
                                  <div
                                    className="quotation-details-item-icon border rounded bg-white d-flex align-items-center justify-content-center"
                                    style={{ height: "48px", width: "48px" }}
                                  >
                                    <SVGIcon
                                      className="d-flex align-items-center text-primary"
                                      name={item.offlineItem.business}
                                      width="32"
                                      type="fill"
                                    ></SVGIcon>
                                  </div>

                                  <div className="quotation-details-item-title ml-3">
                                    <img
                                      style={{ maxWidth: "60px" }}
                                      src={item.offlineItem.departImg}
                                      alt=""
                                    />

                                    <h2
                                      className="p-0 m-0 mb-1"
                                      style={{ fontSize: "1.2rem", fontWeight: "600" }}
                                    >
                                      <span className="text-nowrap mr-2">
                                        {item.offlineItem.departAirlineName}
                                      </span>
                                      <small className="text-secondary">
                                        {item.offlineItem.departFlightNumber}
                                      </small>
                                    </h2>
                                  </div>
                                </div>

                                <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.fromLocation}
                                  </span>

                                  <b>{item.offlineItem.departStartTime}</b>

                                  <span className="small text-secondary">
                                    <Date
                                      date={item.offlineItem.departStartDate}
                                      format="shortDate"
                                    />
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <span className="small text-nowrap mb-2">
                                    <i className="align-text-bottom">
                                      <SVGIcon
                                        name="clock"
                                        className="mr-1 text-secondary"
                                        width="12"
                                        height="12"
                                      ></SVGIcon>
                                    </i>
                                    {item.offlineItem.departDuration}
                                  </span>
                                  <Stops {...[item.offlineItem.departStops]} />
                                  <span className="small mt-1">
                                    {this.renderStops(item.offlineItem.departStops)}
                                    {item.offlineItem.departClass &&
                                      " | " + item.offlineItem.departClass}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.toLocation}
                                  </span>

                                  <b>{item.offlineItem.departEndTime}</b>

                                  <span className="small text-secondary">
                                    <Date
                                      date={item.offlineItem.departEndDate}
                                      format="shortDate"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!this.props.departFlight && this.props.returnFlight && (
                          <div className="col-lg-12">
                            <div>
                              <div className="row">
                                <div className={"quotation-details-item-col col-lg-5 d-flex align-items-center " + item.offlineItem.business}>
                                  <div
                                    className="border rounded bg-white d-flex align-items-center justify-content-center"
                                    style={{ height: "48px", width: "48px" }}
                                  >
                                    <SVGIcon
                                      className="d-flex align-items-center text-primary"
                                      name={item.offlineItem.business}
                                      width="32"
                                      type="fill"
                                    ></SVGIcon>
                                  </div>

                                  <div className="quotation-details-item-title ml-3">
                                    <img
                                      style={{ maxWidth: "60px", maxHeight: "28px" }}
                                      src={item.offlineItem.returnImg}
                                      alt=""
                                    />
                                    <h2
                                      className="p-0 m-0 mb-1"
                                      style={{ fontSize: "1.2rem", fontWeight: "600" }}
                                    >
                                      <span className="text-nowrap mr-2">
                                        {item.offlineItem.returnAirlineName}
                                      </span>
                                      <small className="text-secondary">
                                        {item.offlineItem.returnFlightNumber}
                                      </small>
                                    </h2>
                                  </div>
                                </div>

                                <div className="quotation-details-item-col col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.toLocation}
                                  </span>

                                  <b>{item.offlineItem.returnStartTime}</b>

                                  <span className="small text-secondary">
                                    <Date
                                      date={item.offlineItem.returnStartDate}
                                      format="shortDate"
                                    />
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <span className="small text-nowrap mb-2">
                                    <i className="align-text-bottom">
                                      <SVGIcon
                                        name="clock"
                                        className="mr-1 text-secondary"
                                        width="12"
                                        height="12"
                                      ></SVGIcon>
                                    </i>
                                    {item.offlineItem.returnDuration}
                                  </span>
                                  <Stops {...[item.offlineItem.returnStops]} />
                                  <span className="small mt-1">
                                    {this.renderStops(item.offlineItem.returnStops)}
                                    {item.offlineItem.returnClass &&
                                      " | " + item.offlineItem.returnClass}
                                  </span>
                                </div>

                                <div className="quotation-details-item-col col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                  <span className="small text-secondary">
                                    {item.offlineItem.fromLocation}
                                  </span>

                                  <b>{item.offlineItem.returnEndTime}</b>

                                  <span className="small text-secondary">
                                    <Date
                                      date={item.offlineItem.returnEndDate}
                                      format="shortDate"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                )}

                {(item.offlineItem.business !== "air" ||
                  (this.props.departFlight && !this.props.returnFlight) ||
                  (!this.props.departFlight && !this.props.returnFlight)) && (
                    <div className="quotation-details-item-col quotation-details-item-col-price col-lg-2 d-flex align-items-center justify-content-end">
                      <h3
                        className="p-0 m-0 text-primary popup-toggle text-right text-nowrap"
                        style={{ fontSize: "1.2rem", fontWeight: "700", cursor: "pointer" }}
                      >

                        {Number(item.offlineItem.totalAmount) > 0
                          ? <Amount amount={item.offlineItem.totalAmount}></Amount>
                          : <Amount amount={item.offlineItem.sellPrice}></Amount>}
                        {item.offlineItem.business === "air" &&
                          <small className="d-block text-secondary mt-2" style={{ fontSize: "0.7rem" }}>
                            {item.offlineItem.adult && item.offlineItem.adult.toString() + " Adult(s)"}
                            {item.offlineItem.business === "air" &&
                              ", " + (item.offlineItem.child?.toString() ?? "0") + " Child(ren)" +
                              ", " + (item.offlineItem.infant === "" ? "0" : item.offlineItem.infant?.toString() ?? "0") + " Infant(s)"}
                          </small>
                        }
                        <AuthorizeComponent title="itinerary-details~amount-popup" type="button">
                          <ul
                            className="border m-0 p-3 list-unstyled small text-secondary position-absolute bg-light rounded shadow-sm"
                            style={{
                              right: "0px",
                              top: "40px",
                              display: "none",
                              zIndex: "100",
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.offlineItem.vendor && (
                              <li className="text-nowrap pb-3">
                                Vendor/Supplier : <b>{item.offlineItem.vendor}</b>
                              </li>
                            )}

                            {item.offlineItem.brn && (
                              <li className="text-nowrap pb-3">
                                Booking Ref. : <b>{item.offlineItem.brn}</b>
                              </li>
                            )}

                            {mode === "Edit" && item.offlineItem.supplierCurrency && (
                              <li className="text-nowrap pb-3">
                                Supplier Currency : <b>{item.offlineItem.supplierCurrency}</b>
                              </li>
                            )}
                            {mode === "Edit" && item.offlineItem.conversionRate && (
                              <li className="text-nowrap pb-3">
                                Conversion Rate : <b>{item.offlineItem.conversionRate}</b>
                              </li>
                            )}
                            {Number(item.offlineItem.supplierCostPrice) > 0 && (
                              <li className="text-nowrap pb-3">
                                Supplier Cost Price : <b>{item.offlineItem.supplierCostPrice}</b>
                              </li>
                            )}

                            {mode === "Create" && item.offlineItem.business === "air"
                              && ((Number(item.offlineItem.supplierCostPrice) + Number(item.offlineItem.supplierTaxPrice)) > 0)
                              && Number(item.offlineItem.costPrice) > 0 && (
                                <li className="text-nowrap pb-3">
                                  Agent Cost Price :{" "}
                                  <b>
                                    <Amount amount={item.offlineItem.costPrice}></Amount>
                                  </b>
                                </li>
                              )}

                            {mode === "Edit" && item.offlineItem.costPrice && (
                              <li className="text-nowrap pb-3">
                                Agent Cost Price :{" "}
                                <b>
                                  <Amount amount={item.offlineItem.costPrice}></Amount>
                                </b>
                              </li>
                            )}

                            {Number(item.offlineItem.markupPrice) > 0 && (
                              <li className="text-nowrap pb-3">
                                Agent Markup :{" "}
                                <b>
                                  <Amount amount={item.offlineItem.markupPrice}></Amount>
                                </b>
                              </li>
                            )}

                            {Number(item.offlineItem.processingFees) > 0 && (
                              <li className="text-nowrap pb-3">
                                Processing Fee :{" "}
                                <b>
                                  <Amount amount={item.offlineItem.processingFees}></Amount>
                                </b>
                              </li>
                            )}

                            {totalTaxAmount > 0 && (
                              <li className="text-nowrap pb-3">
                                Tax (All Inclusive):{" "}
                                <b>
                                  <Amount amount={Number(totalTaxAmount)}></Amount>
                                </b>
                              </li>
                            )}

                            {Number(item.offlineItem.discountPrice) > 0 && (
                              <li className="text-nowrap pb-3">
                                Discount :{" "}
                                <b>
                                  <Amount amount={item.offlineItem.discountPrice} />
                                </b>
                              </li>
                            )}

                            {item.offlineItem.sellPrice && (
                              <li className="text-nowrap pb-3">
                                Sell Price :{" "}
                                <b>

                                  {Number(item.offlineItem.totalAmount) > 0
                                    ? <Amount amount={item.offlineItem.totalAmount}></Amount>
                                    : <Amount amount={item.offlineItem.sellPrice}></Amount>}
                                </b>
                              </li>
                            )}
                            {item.offlineItem.bookBefore && (
                              <li className="text-nowrap">
                                Book Before :{" "}
                                <b>
                                  <Date date={item.offlineItem.bookBefore} />
                                </b>
                              </li>
                            )}
                          </ul>
                        </AuthorizeComponent>
                      </h3>
                      {!this.props.removeEditDeleteBtn &&
                        <AuthorizeComponent title="invoiceEdit~invoice-edit-item" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                          <button
                            className="btn btn-sm d-flex align-items-center ml-2"
                            onClick={() => this.handleItemEdit(item)}
                            style={{ marginRight: "-12px" }}
                          >
                            <SVGIcon
                              name="edit"
                              width="18"
                              height="18"
                              className="d-flex align-items-center text-secondary"
                            ></SVGIcon>
                          </button>
                        </AuthorizeComponent>
                      }
                      {this.state.comingsoon && <ComingSoon handleComingSoon={this.handleItemEdit} />}
                      {!this.props.removeEditDeleteBtn &&
                        <AuthorizeComponent title="invoiceEdit~invoice-delete-item" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                          <button
                            className="btn btn-sm d-flex align-items-center ml-0"
                            onClick={() => this.handleItemDelete(item)}
                          >
                            <SVGIcon
                              name="delete"
                              width="20"
                              height="20"
                              className="d-flex align-items-center text-secondary"
                            ></SVGIcon>
                          </button>
                        </AuthorizeComponent>
                      }
                      {/* {this.props.invoiceid &&
                        <AuthorizeComponent title="itinerary-details~delete-item" type="button">
                          <button
                            className="btn btn-sm d-flex align-items-center ml-0"
                            onClick={() => this.handleViewInvoice(item)}
                          >
                            <SVGIcon
                              name="file-excel"
                              width="15"
                              height="15"
                              className="d-flex align-items-center text-secondary"
                            ></SVGIcon>
                          </button>
                        </AuthorizeComponent>
                      } */}
                    </div>
                  )}

                {item.offlineItem.description && item.offlineItem.business !== "custom" && (
                  <div
                    className={
                      (item.offlineItem.description.length > 180 ? "col-lg-12" : "col-lg-6") +
                      " text-secondary mt-2"
                    }
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                  >
                    <small style={{ whiteSpace: "pre-wrap" }}>{<HtmlParser text={item.offlineItem.description} />}</small>
                  </div>
                )}

                {item.offlineItem.description &&
                  item.offlineItem.business === "custom" &&
                  item.offlineItem.description.length > 180 && (
                    <div
                      className="col-lg-12 text-secondary mt-2"
                      style={{ maxHeight: "100px", overflowY: "auto" }}
                    >
                      <small style={{ whiteSpace: "pre-wrap" }}>
                        {<HtmlParser text={item.offlineItem.description} />}
                      </small>
                    </div>
                  )}
              </div>
            )}
          </React.Fragment>
        )
        }

        {
          item.isFromList && (
            <React.Fragment>
              <div className="row">
                {(item.itemDtl.business === "hotel" ||
                  item.itemDtl.business === "activity" ||
                  item.itemDtl.business === "transfers") && (
                    <React.Fragment>
                      <div className="col-lg-6 d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <div
                            className="border rounded bg-white d-flex align-items-center justify-content-center"
                            style={{ height: "48px", width: "48px" }}
                          >
                            <SVGIcon
                              className="d-flex align-items-center text-primary"
                              name={item.itemDtl.business}
                              width="32"
                              type="fill"
                            ></SVGIcon>
                          </div>
                          <div className="ml-3">
                            <h2
                              className="p-0 m-0 mb-1"
                              style={{ fontSize: "1.2rem", fontWeight: "600" }}
                            >
                              {item.itemDtl.name}
                            </h2>

                            {item.itemDtl.business === "hotel" && (
                              <small className="mt-1 mr-3 text-secondary">
                                <SVGIcon
                                  name="map-marker"
                                  width="16"
                                  type="fill"
                                  height="16"
                                  className="mr-2"
                                ></SVGIcon>
                                {item.itemDtl.locationInfo.fromLocation.address}
                              </small>
                            )}
                            {(item.itemDtl.business === "activity" ||
                              item.itemDtl.business === "transfers") && (
                                <small className="text-secondary">
                                  <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                  {Trans("_duration")} :{" "}
                                  {item.itemDtl.tpExtension.find((x) => x.key === "duration") &&
                                    item.itemDtl.tpExtension.find((x) => x.key === "duration").value}
                                </small>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 d-flex align-items-center">
                        <div>
                          <div>
                            {item.itemDtl.business === "hotel" && (
                              <React.Fragment>
                                {item.itemDtl.items.length > 1 && (
                                  <div>
                                    <b>{item.itemDtl.items.length} x Room(s) : </b>{" "}
                                    {item.itemDtl.items.map((room, key) => {
                                      return (
                                        <React.Fragment key={key}>
                                          {key !== 0 && ", "}
                                          {room.item.find((x) => x).name}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                )}

                                {item.itemDtl.items.length === 1 && (
                                  <div>
                                    <b>{item.itemDtl.items[0].item.length} x Room(s) : </b>{" "}
                                    {item.itemDtl.items[0].item.map((room, key) => {
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

                            {(item.itemDtl.business === "activity" ||
                              item.itemDtl.business === "transfers") && (
                                <React.Fragment>
                                  <b>
                                    {!item.itemDtl.paxInfo.find((x) => x.quantity) &&
                                      item.itemDtl.items[0]?.properties?.pax?.adult}
                                    {item.itemDtl.paxInfo.find((x) => x.quantity) &&
                                      item.itemDtl.paxInfo.find((x) => x.quantity).quantity}
                                    x Guest(s) :{" "}
                                  </b>
                                  {item.itemDtl.items[0].item[0].name}
                                </React.Fragment>
                              )}
                          </div>

                          <div>
                            {item.itemDtl.business === "hotel" && (
                              <small className="text-secondary">
                                {item.itemDtl.locationInfo.fromLocation.city} -{" "}
                                <Date date={item.itemDtl.dateInfo.startDate} /> to{" "}
                                <Date date={item.itemDtl.dateInfo.endDate} />
                              </small>
                            )}

                            {(item.itemDtl.business === "activity" ||
                              item.itemDtl.business === "transfers") && (
                                <small className="text-secondary">
                                  <Date date={item.itemDtl.dateInfo.startDate} />
                                </small>
                              )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                {item.itemDtl.business === "air" && (
                  <div className="col-lg-10">
                    <div className="row">
                      <div className="col-lg-1">
                        <div
                          className="border rounded bg-white d-flex align-items-center justify-content-center"
                          style={{ height: "48px", width: "48px" }}
                        >
                          <SVGIcon
                            className="d-flex align-items-center text-primary"
                            name={item.itemDtl.business}
                            width="32"
                            type="fill"
                          ></SVGIcon>
                        </div>
                      </div>

                      <div className="col-lg-11">
                        <div className="row">
                          {item.itemDtl.items.map((item, key) => {
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
                              <div
                                className={tripTypeDtl === "roundtrip" ? "col-lg-6" : "col-lg-12"}
                                key={key}
                              >
                                <div className="border-right">
                                  <div className="row">
                                    <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                      <img
                                        className="img-fluid"
                                        src={url || ImageNotFound}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = getOnErrorImageURL();
                                        }}
                                        alt=""
                                      />
                                      <span className="small text-secondary mt-2 text-center">
                                        <span className="text-nowrap">{airline}</span>{" "}
                                        <span className="text-nowrap">{airlineCode}</span>
                                      </span>
                                    </div>
                                    <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                      <span className="small text-secondary">
                                        {loc.fromLocation.id}
                                      </span>

                                      <b>
                                        <Date date={date.startDate} format="shortTime" />
                                      </b>

                                      <span className="small text-secondary">
                                        <Date date={date.startDate} format="shortDate" />
                                      </span>
                                    </div>
                                    <div className="col-lg-4 d-flex justify-content-center align-items-center flex-column">
                                      <span className="small text-nowrap mb-2">
                                        <i className="align-text-bottom">
                                          <SVGIcon
                                            name="clock"
                                            className="mr-1 text-secondary"
                                            width="12"
                                            height="12"
                                          ></SVGIcon>
                                        </i>
                                        {duration}
                                      </span>
                                      <Stops {...[stopCount]} />
                                      <span className="small mt-1">
                                        {Trans(
                                          "_" + stops.replace(" ", "").replace(" ", "").toLowerCase()
                                        )}
                                        {cabinClass && " | " + cabinClass}
                                      </span>
                                    </div>
                                    <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                      <span className="small text-secondary">
                                        {loc.toLocation.id}
                                      </span>

                                      <b>
                                        <Date date={date.endDate} format="shortTime" />
                                      </b>

                                      <span className="small text-secondary">
                                        <Date date={date.endDate} format="shortDate" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-lg-2 d-flex align-items-center justify-content-end">
                  <h3
                    className="p-0 m-0 text-primary text-right"
                    style={{ fontSize: "1.2rem", fontWeight: "700" }}
                  >
                    <Amount amount={item.itemDtl.amount}></Amount>
                    <small className="d-block text-secondary mt-2" style={{ fontSize: "0.7rem" }}>
                      {item.itemDtl.paxInfo.find((x) => x.typeString === "ADT") &&
                        item.itemDtl.paxInfo.find((x) => x.typeString === "ADT").quantity +
                        " Adult(s)"}
                      {item.itemDtl.paxInfo.find((x) => x.typeString === "CHD") &&
                        ", " +
                        item.itemDtl.paxInfo.find((x) => x.typeString === "CHD").quantity +
                        " Child(ren)"}
                      {item.itemDtl.paxInfo.find((x) => x.typeString === "INF") &&
                        ", " +
                        item.itemDtl.paxInfo.find((x) => x.typeString === "INF").quantity +
                        " Infant(s)"}
                    </small>
                  </h3>
                  <button
                    className="btn btn-sm d-flex align-items-center ml-2"
                    onClick={() => this.handleItemDelete(item)}
                  >
                    <SVGIcon
                      name="delete"
                      width="20"
                      height="20"
                      className="d-flex align-items-center text-secondary"
                    ></SVGIcon>
                  </button>
                </div>
              </div>
            </React.Fragment>
          )
        }
      </div >
    );
  }
}

export default ManualInvoiceDetailsItems;
