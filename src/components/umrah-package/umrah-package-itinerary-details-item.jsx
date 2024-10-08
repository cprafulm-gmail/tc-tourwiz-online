import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import StarRating from "./../common/star-rating";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import UmrahPackageDetailsPopup from "./umrah-package-details-popup";
import HtmlParser from "../../helpers/html-parser";
import ImageHotelDefault from "../../assets/images/tourwiz/hotel-default.png";
import ImageActivityDefault from "../../assets/images/tourwiz/activity-default.png";
import ImageTransfersDefault from "../../assets/images/tourwiz/transfers-default.png";
import ImageCustomDefault from "../../assets/images/tourwiz/custom-default.png";

class UmrahPackageItineraryDetailsItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isDetailPopup: false, activeTab: "photos" };
  }

  showHideDetailPopup = (activeTab) => {
    this.setState({ isDetailPopup: !this.state.isDetailPopup, activeTab });
  };

  render() {
    const { item } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="border-bottom p-3 quotation-details-item dayview-item">
        <React.Fragment>
          {item.offlineItem && (
            <div className="row">
              {this.state.isDetailPopup && (
                <UmrahPackageDetailsPopup
                  details={item.offlineItem.details}
                  businessName={item.offlineItem.business}
                  hideQuickBook={this.showHideDetailPopup}
                  activeTab={activeTab}
                />
              )}

              {(item.offlineItem.business === "hotel" ||
                item.offlineItem.business === "activity" ||
                item.offlineItem.business === "transfers" ||
                item.offlineItem.business === "custom") && (
                <React.Fragment>
                  <div className="quotation-details-item-col col-lg-10 d-flex">
                    <div className="d-flex itinerary-landing-page-items">
                      <div className="position-relative itinerary-landing-page-img">
                        <img
                          style={{
                            height: "280px",
                            width: "420px",
                            objectFit: "cover",
                          }}
                          src={
                            item.offlineItem.imgUrl
                              ? item.offlineItem.imgUrl
                              : ImageCustomDefault
                          }
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
                        />
                        {item.offlineItem.details && (
                          <button
                            className="btn btn-primary"
                            style={{
                              position: "absolute",
                              right: "16px",
                              bottom: "16px",
                              margin: "auto auto",
                              opacity: "0.9",
                            }}
                            onClick={() => this.showHideDetailPopup("photos")}
                          >
                            <SVGIcon
                              name="search"
                              width="16"
                              type="fill"
                              height="16"
                            ></SVGIcon>
                          </button>
                        )}
                      </div>

                      <div className="quotation-details-item-title ml-4">
                        {item.offlineItem.details && (
                          <h2
                            className="p-0 m-0 mb-1"
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                            onClick={() => this.showHideDetailPopup("")}
                          >
                            {item.offlineItem.name}

                            {item.offlineItem.rating && (
                              <span
                                className="ml-3 position-relative"
                                style={{ top: "-2px" }}
                              >
                                <StarRating
                                  {...[parseInt(item.offlineItem.rating)]}
                                />
                              </span>
                            )}
                          </h2>
                        )}

                        {!item.offlineItem.details && (
                          <h2
                            className="p-0 m-0 mb-1"
                            style={{ fontSize: "1.5rem", fontWeight: "600" }}
                          >
                            {item.offlineItem.name}

                            {item.offlineItem.rating && (
                              <span
                                className="ml-3 position-relative"
                                style={{ top: "-2px" }}
                              >
                                <StarRating
                                  {...[parseInt(item.offlineItem.rating)]}
                                />
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
                            {item.offlineItem.toLocation &&
                              " To " + item.offlineItem.toLocation}
                          </h2>
                        )}

                        {item.offlineItem.business === "hotel" &&
                          item.offlineItem.toLocation && (
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
                              {item.offlineItem.description}
                            </small>
                          )}

                        <div className="mt-3">
                          <div>
                            {item.offlineItem.business === "hotel" &&
                              item.offlineItem.noRooms && (
                                <b>{item.offlineItem.noRooms} x Room(s) : </b>
                              )}

                            {(item.offlineItem.business === "activity" ||
                              item.offlineItem.business === "transfers") &&
                              item.offlineItem.guests && (
                                <b>{item.offlineItem.guests} x Guest(s) : </b>
                              )}

                            {item.offlineItem.itemType}
                          </div>

                          <div>
                            {item.offlineItem.business === "hotel" && (
                              <small className="text-secondary">
                                {item.offlineItem.toLocationCity &&
                                  item.offlineItem.toLocationCity + " - "}
                                <Date date={item.offlineItem.startDate} />
                                {item.offlineItem.endDate && " to "}
                                <Date date={item.offlineItem.endDate} />{" "}
                                {item.offlineItem.nights &&
                                  " - " + item.offlineItem.nights + " night(s)"}
                              </small>
                            )}

                            {item.offlineItem.business === "activity" && (
                              <small className="text-secondary">
                                {item.offlineItem.toLocation &&
                                  item.offlineItem.toLocation + " - "}
                                <Date date={item.offlineItem.startDate} />
                              </small>
                            )}

                            {item.offlineItem.business === "custom" && (
                              <small className="text-secondary mb-3 d-block">
                                {item.offlineItem.toLocation &&
                                  item.offlineItem.toLocation + " - "}
                                <Date date={item.offlineItem.startDate} />
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

                            {item.offlineItem?.details?.description && (
                              <p
                                className="mt-3 text-secondary"
                                style={{
                                  maxHeight: "78px",
                                  overflow: "hidden",
                                }}
                              >
                                <HtmlParser
                                  text={item.offlineItem.details.description}
                                />
                              </p>
                            )}

                            {item.offlineItem.details && (
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-primary m-0"
                                  onClick={() => this.showHideDetailPopup("")}
                                >
                                  More Details
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
                                <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
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
                                      style={{
                                        fontSize: "1.2rem",
                                        fontWeight: "600",
                                      }}
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
                                  <span className="small mt-1 text-nowrap">
                                    {Number(item.offlineItem.departStops) === 0
                                      ? "non stop"
                                      : Number(item.offlineItem.departStops) ===
                                        1
                                      ? item.offlineItem.departStops + " stop"
                                      : item.offlineItem.departStops + " stops"}

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

                          {item.offlineItem.isRoundTrip && (
                            <div className="col-lg-12">
                              <div className="mt-3">
                                <div className="row">
                                  <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
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
                                        style={{
                                          maxWidth: "60px",
                                          maxHeight: "28px",
                                        }}
                                        src={item.offlineItem.returnImg}
                                        alt=""
                                      />
                                      <h2
                                        className="p-0 m-0 mb-1"
                                        style={{
                                          fontSize: "1.2rem",
                                          fontWeight: "600",
                                        }}
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
                                    <Stops
                                      {...[item.offlineItem.departStops]}
                                    />
                                    <span className="small mt-1 text-nowrap">
                                      {Number(item.offlineItem.returnStops) ===
                                      0
                                        ? "non stop"
                                        : Number(
                                            item.offlineItem.returnStops
                                          ) === 1
                                        ? item.offlineItem.returnStops + " stop"
                                        : item.offlineItem.returnStops +
                                          " stops"}

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
                        </React.Fragment>
                      )}

                      {this.props.departFlight && !this.props.returnFlight && (
                        <div className="col-lg-12">
                          <div>
                            <div className="row">
                              <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
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
                                    style={{
                                      fontSize: "1.2rem",
                                      fontWeight: "600",
                                    }}
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
                                <span className="small mt-1 text-nowrap">
                                  {Number(item.offlineItem.departStops) === 0
                                    ? "non stop"
                                    : Number(item.offlineItem.departStops) === 1
                                    ? item.offlineItem.departStops + " stop"
                                    : item.offlineItem.departStops + " stops"}
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
                              <div className="quotation-details-item-col col-lg-4 d-flex align-items-center">
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
                                    style={{
                                      maxWidth: "60px",
                                      maxHeight: "28px",
                                    }}
                                    src={item.offlineItem.returnImg}
                                    alt=""
                                  />
                                  <h2
                                    className="p-0 m-0 mb-1"
                                    style={{
                                      fontSize: "1.2rem",
                                      fontWeight: "600",
                                    }}
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
                                <Stops {...[item.offlineItem.departStops]} />
                                <span className="small mt-1 text-nowrap">
                                  {Number(item.offlineItem.returnStops) === 0
                                    ? "non stop"
                                    : Number(item.offlineItem.returnStops) === 1
                                    ? item.offlineItem.returnStops + " stop"
                                    : item.offlineItem.returnStops + " stops"}

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
                <div className="quotation-details-item-col quotation-details-item-col-price col-lg-2 d-flex justify-content-end">
                  {this.props.isIndividualPrice && (
                    <h3
                      className="p-0 m-0 text-primary popup-toggle text-right"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                      }}
                    >
                      <Amount amount={item.offlineItem.sellPrice}></Amount>

                      <small
                        className="d-block text-secondary mt-2"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {item.offlineItem.adult &&
                          item.offlineItem.adult + " Adult(s)"}
                        {item.offlineItem.child &&
                          !item.offlineItem.child == "0" &&
                          ", " + item.offlineItem.child + " Child(ren)"}
                        {item.offlineItem.infant &&
                          !item.offlineItem.infant === "0" &&
                          ", " + item.offlineItem.infant + " Infant(s)"}
                      </small>
                    </h3>
                  )}
                </div>
              )}

              {item.offlineItem.description &&
                item.offlineItem.business !== "custom" && (
                  <div
                    className={
                      (item.offlineItem.description.length > 180
                        ? "col-lg-12"
                        : "col-lg-6") + " text-secondary mt-2"
                    }
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                  >
                    <small style={{ whiteSpace: "pre-wrap" }}>
                      {item.offlineItem.description}
                    </small>
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
                      {item.offlineItem.description}
                    </small>
                  </div>
                )}
            </div>
          )}
        </React.Fragment>
      </div>
    );
  }
}

export default UmrahPackageItineraryDetailsItem;
