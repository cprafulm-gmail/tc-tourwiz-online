import React from "react";
import BookingBase from "../base/booking-base";
import BookingLoading from "../components/loading/booking-loading";
import Datecomp from "../helpers/date";
import BookingFilters from "../components/booking-management/booking-filters";
import { Trans } from "../helpers/translate";
import ModelPopup from "../helpers/model";
import Pagination from "../components/booking-management/booking-pagination";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import moment from "moment";
import CallCenter from "../components/call-center/call-center";
import ComingSoon from "../helpers/coming-soon";

class MyBookings extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      comingsoon: false,
      page: "mybookings",
      results: [],
      isLoading: true,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      popupSizeClass: "",
      type: "upcoming",
      pageLength: 10,
      defaultFilters: [
        {
          Name: "bookingdaterange",
          minValue: moment().add(-1, 'months').format(Global.DateFormate),
          maxValue: moment().format(Global.DateFormate)
        }
      ]
    };
  }

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  render() {
    const { results, isLoading, page } = this.state;
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    const isTourwizB2CPortal = localStorage.getItem("portalType");
    //const isTourwizB2CPortal = true;
    return (
      <div className="bookings">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("_titleMyBookings")}
            </h1>
          </div>
        </div>
        <div className="container">
          {this.state.isLoginError ? (
            <div className="alert alert-danger">
              {Trans("_pleaseLoginToAccessProfile")}
            </div>
          ) : (
            <React.Fragment>
              {isPersonateEnabled && (
                <div className="mt-2 mb-3">
                  <CallCenter />
                </div>
              )}
              <BookingFilters filterResults={this.filterResults} page={page} {...this.props} />
              {!isLoading && results.data && results.data.length > 0
                ? results.data.map((item, key) => {
                  const itinerary = item[Object.keys(item)[0]];
                  const booking = item[Object.keys(item)[0]][0];
                  return (
                    <div className="card shadow-sm mb-3" key={key}>
                      <div className="card-header">
                        {Trans("_lblItinerary") + " : "}{" "}
                        {booking.itineraryRefNo}
                        <button
                          className="btn btn-link p-0 m-0 pull-right text-primary"
                          onClick={() =>
                            this.redirectToDetails("view", itinerary)
                          }
                        >
                          {Trans("_moreDetails")}
                        </button>
                      </div>

                      <div className="card-body pb-1 ">
                        {itinerary.map((booking, key) => {
                          return (
                            <ul
                              className="list-unstyled row border-bottom mb-3"
                              key={key}
                            >
                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_businessName") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    {booking.businessShortDescription ===
                                      "Excursion"
                                      ? "Activity"
                                      : booking.businessShortDescription === "GroundService"
                                        ? "Ground Service"
                                        : booking.businessShortDescription}
                                    {" - " + booking.details}
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_bookingReferenceNumber") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    {booking.bookingRefNo}
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_bookingStatus") + " : "}
                                  </label>
                                  <b
                                    className={
                                      "col-lg-12 " +
                                      (booking.bookingStatusID === "1" &&
                                        "text-success")
                                    }
                                  >
                                    {Trans("_bookingStatus" + (booking.bookingStatus === "Amend Request" ? "AmendRequest" : booking.bookingStatus === "Cancel Request" ? "CancelRequest" : booking.bookingStatus === "Auto Cancel" ? "AutoCancel" : booking.bookingStatus === "Auto Cancel Failure" ? "AutoCancelFailure" : booking.bookingStatus))}
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_bookingDate") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    <Datecomp date={booking.bookingDate} />
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_checkIn") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    <Datecomp
                                      date={booking.dateInfo.startDate}
                                    />
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_checkOut") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    <Datecomp
                                      date={booking.dateInfo.endDate}
                                    />
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_guestName") + " : "}
                                  </label>
                                  <b className="col-lg-12">
                                    {booking.firstName} {booking.lastName}
                                  </b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("_email") + " : "}
                                  </label>
                                  <b className="col-lg-12">{booking.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '---' : booking.email}</b>
                                </div>
                              </li>

                              {booking.deadlineDate && (
                                <li className="col-lg-4 mb-3">
                                  <div className="row">
                                    <label className="col-lg-12 mb-0 text-secondary">
                                      {Trans("_deadlineDate") + " : "}
                                    </label>
                                    <b className="col-lg-12">
                                      <Datecomp date={booking.deadlineDate} />
                                    </b>
                                  </div>
                                </li>
                              )}
                              {false &&
                                <React.Fragment>
                                  <li className="col-lg-4 mb-3">
                                    <div className="row">

                                    </div>
                                  </li>
                                  {this.state.comingsoon && (
                                    <ComingSoon handleComingSoon={this.handleComingSoon} />
                                  )}
                                  <li className="col-lg-4 mb-3 ml-md-auto">
                                    <div className="row">
                                      <div className="col-lg-12">
                                        <div className="mt-2">
                                          <button
                                            className="btn btn-sm btn-outline-primary form-control w-50 pull-right"
                                            onClick={this.handleComingSoon}
                                          >
                                            <span>Pay Now</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </React.Fragment>}

                              {booking.flags["showprovidername"] !==
                                undefined &&
                                booking.flags["showprovidername"] ===
                                true && (
                                  <li className="col-lg-4 mb-3">
                                    <div className="row">
                                      <label className="col-lg-12 mb-0 text-secondary">
                                        {Trans("_providerName") + " : "}
                                      </label>
                                      <b className="col-lg-12">
                                        {booking.providerName}
                                      </b>
                                    </div>
                                  </li>
                                )}

                              <li className="col-lg-4 mb-3 ml-md-auto">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="mt-2">
                                      <button
                                        className="btn btn-sm btn-light text-secondary mr-2"
                                        onClick={() =>
                                          this.redirectToDetails(
                                            "view",
                                            itinerary,
                                            booking.bookingRefNo
                                          )
                                        }
                                      >
                                        <SVGIcon
                                          name="search"
                                          className="mr-1"
                                          width="12"
                                        ></SVGIcon>
                                        <small>{Trans("_view")}</small>
                                      </button>

                                      {isTourwizB2CPortal !== "B2C" && (booking.flags.allowcancellation ||
                                        booking.flags.allowcancellation) && booking.businessShortDescription.toLowerCase() !== "transportation" && booking.businessShortDescription.toLowerCase() !== "groundservice" && (
                                          <React.Fragment>
                                            {booking.flags
                                              .allowcancellation && (
                                                <button
                                                  className="btn btn-sm btn-light text-secondary mr-2"
                                                  onClick={() => isTourwizB2CPortal === "B2C" ? this.handleComingSoon() :
                                                    this.redirectToDetails(
                                                      "cancel",
                                                      itinerary,
                                                      booking.bookingRefNo
                                                    )
                                                  }
                                                >
                                                  <SVGIcon
                                                    name="ban"
                                                    className="mr-1"
                                                    width="12"
                                                  ></SVGIcon>
                                                  <small>{Trans("_cancel")}</small>
                                                </button>
                                              )}
                                            {booking.flags
                                              .allowcancellation && (
                                                <button
                                                  className="btn btn-sm btn-light text-secondary mr-2"
                                                  onClick={() => isTourwizB2CPortal === "B2C" ? this.handleComingSoon() :
                                                    this.redirectToDetails(
                                                      "modify",
                                                      itinerary,
                                                      booking.bookingRefNo
                                                    )
                                                  }
                                                >
                                                  <SVGIcon
                                                    name="pencil-alt"
                                                    className="mr-1"
                                                    width="12"
                                                  ></SVGIcon>
                                                  <small>{Trans("_modify")}</small>
                                                </button>
                                              )}
                                          </React.Fragment>
                                        )}
                                      {booking.bookingStatusID === "1" && (
                                        <React.Fragment>
                                          <button
                                            className="btn btn-sm btn-light text-secondary mr-2"
                                            onClick={() =>
                                              this.redirectToVoucher(
                                                "voucher",
                                                booking.itineraryID,
                                                booking.bookingID,
                                                booking.businessDescription.toLowerCase() === "flight" ? "air" :
                                                  booking.businessDescription.toLowerCase() === "car rental" ? "vehicle" : booking.businessDescription
                                              )
                                            }
                                          >
                                            <SVGIcon
                                              name="file-text"
                                              className="mr-1"
                                              width="12"
                                            ></SVGIcon>
                                            <small>{Trans("_voucher")}</small>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-light text-secondary"
                                            onClick={() =>
                                              this.redirectToVoucher(
                                                "invoice",
                                                booking.itineraryID,
                                                booking.bookingID,
                                                booking.businessDescription.toLowerCase() === "flight" ? "air" :
                                                  booking.businessDescription.toLowerCase() === "car rental" ? "vehicle" : booking.businessDescription
                                              )
                                            }
                                          >
                                            <SVGIcon
                                              name="file-excel"
                                              className="mr-1"
                                              width="12"
                                            ></SVGIcon>
                                            <small>{Trans("_invoice")}</small>
                                          </button>
                                        </React.Fragment>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          );
                        })}
                      </div>
                      {this.state.showPopup ? (
                        <ModelPopup
                          header={this.state.popupTitle}
                          content={this.state.popupContent}
                          handleHide={this.handleHidePopup}
                          sizeClass={this.state.popupSizeClass}
                        />
                      ) : null}
                    </div>
                  );
                })
                : isLoading && <BookingLoading />}
              {this.state.results &&
                this.state.results.data &&
                this.state.results.data.length > 0 && (
                  <Pagination
                    {...results}
                    handlePaginationResults={this.paginationResults}
                  />
                )}

              {!isLoading &&
                this.state.results &&
                this.state.results.data &&
                this.state.results.data.length === 0 && (
                  <span className={"alert alert-danger mt-2 p-1 d-inline-block "}>
                    {Trans("_noBookingFound")}
                  </span>
                )}
            </React.Fragment>
          )}
        </div>
        {
          this.state.comingsoon && (
            <ComingSoon handleComingSoon={this.handleComingSoon} />
          )
        }
      </div>
    );
  }
}

export default MyBookings;
