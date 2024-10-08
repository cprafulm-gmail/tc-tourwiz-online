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
import Amount from "../helpers/amount";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import DebitNote from "./debit-note";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import Config from "../config.json";
import PaperRatesEticket from "./paper-rates-e-ticket";
import { apiRequester } from "../services/requester";

class MyBookings extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      comingsoon: false,
      page: "mybookings",
      results: [],
      isLoading: true,
      showPopup: false,
      isshowTicketPopup: false,
      popupTitle: "",
      popupContent: null,
      popupSizeClass: "",
      type: "upcoming",
      pageLength: 10,
      defaultFilters: [
        {
          Name: "bookingdaterange",
          minValue: moment(
            new Date().setMonth(new Date().getMonth() - 1)
          ).format(Global.DateFormate),
          maxValue: moment(new Date()).format(Global.DateFormate)
        },
        {
          Name: "showpaperratebookings",
          DefaultValue: "true"
        }
      ],
      itemBRNUpdate: "",
      supplierBRN: "",
      supplierBRNDetails: [],
      isshowauthorizepopup: false,
      isfromUpdateEticket: false,
      itineraryDetailID: ""
    };
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  componentDidMount() {
    this.getBookings(this.state.defaultFilters);
  }

  editBRN = (item) => {
    this.setState({
      itemBRNUpdate: item.itineraryDetailID
    });
  };

  handlesupplierBRN = (item) => {
    this.setState({
      supplierBRN: item
    });
  };

  saveSupplierBRN = (item) => {
    let itineraryDetailID = item.itineraryDetailID;

    var reqURL = "tw/booking/update/itinerarydetails";
    var reqOBJ = {
      Request: {
        ItineraryDetailID: item.itineraryDetailID,
        SupplierBRN: this.state.supplierBRN
      }
    };
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response) {
          //this.getBookings(this.state.defaultFilters);
          let supplierBRNDetails = [];
          let brndetails = [{
            ItineraryDetailID: itineraryDetailID,
            supplierBRN: this.state.supplierBRN
          }];
          supplierBRNDetails.push(...brndetails);
          this.setState({ supplierBRNDetails, itemBRNUpdate: "" });
        }
      }
    );
  };
  handleHideEticketPopup = () => {
    this.setState({ isshowTicketPopup: !this.state.isshowTicketPopup, brnBookingDetails: [] });
  }
  handleEticket = (booking, itinerary, brn) => {
    this.setState({
      isshowTicketPopup: !this.state.isshowTicketPopup, brnBookingDetails: '',
      isfromUpdateEticket: booking.isEticketUpdated,
      itineraryDetailID: itinerary[0].itineraryDetailID
    });
    brn = brn.split("||");
    brn.map(item => {
      return this.getBookingDetails(item, itinerary[0].portalAgentID, itinerary[0].itineraryRefNo);
    });
  }
  getBookingDetails = (arg, portalAgentID, itineraryrefno) => {
    let reqURL = "api/v1/mybookings/details";
    let reqOBJ = {
      Request: {
        itineraryRefNo: itineraryrefno,
        bookingRefNo: arg
      }
    };
    reqOBJ.Request.portalAgentID = portalAgentID;
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 0) {
          this.setState({
            brnBookingDetails: data.response,
            isLoading: false,
            isError: false
          });
        } else
          this.setState({
            isLoading: false,
            isError: true
          });
      }.bind(this)
    );
  };

  updateBookingEticketStatus = (itineraryDetailID, itineraryRefNo) => {
    let result = { ...this.state.results }
    result.data.filter(x => Object.keys(x)[0] === itineraryRefNo)[0][itineraryRefNo][0].isEticketUpdated = true;
    this.setState({
      result
    });
  }
  render() {
    const { results, isLoading, page } = this.state;
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let HideSupplierName = (Global.getEnvironmetKeyValue("HideSupplierName", "cobrand")
      && Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") === "true") ? false : true;
    let HideSupplierBRNUpdate = (Global.getEnvironmetKeyValue("HideSupplierBRNUpdate", "cobrand")
      && Global.getEnvironmetKeyValue("HideSupplierBRNUpdate", "cobrand") === "true") ? false : true;

    return (
      <div className="bookings">
        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("Paper Rate Booking(s)")}
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
              <BookingFilters filterResults={this.filterResults} page={page} rolepermissions={this.props.userInfo.rolePermissions} isFromPaperRateBookings={true} />
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
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "bookings~customer-bookings-view") ?
                            this.redirectToDetails("view", itinerary)
                            : this.setState({ isshowauthorizepopup: true })
                          }
                        >
                          {Trans("_moreDetails")}
                        </button>
                      </div>

                      <div className="card-body pb-1 ">
                        {itinerary.map((booking, key) => {
                          const supplierbrnstatedetails = this.state.supplierBRNDetails.filter(x => x.ItineraryDetailID === booking.itineraryDetailID);
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
                                        : booking.businessShortDescription === "Air"
                                          ? "Flight"
                                          : booking.businessShortDescription}
                                    {" - " + booking.details.replaceAll("&amp;", "&")}
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
                                    {(booking.businessShortDescription === "Custom" || booking.businessShortDescription === "Excursion" || booking.businessShortDescription === "Air" ? Trans("_startDate") : Trans("_checkIn")) + " : "}
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
                                    {(booking.businessShortDescription === "Custom" || booking.businessShortDescription === "Excursion" || booking.businessShortDescription === "Air" ? Trans("_endDate") : Trans("_checkOut")) + " : "}
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

                              {booking.dateInfo.startDate && (
                                <li className="col-lg-4 mb-3">
                                  <div className="row">
                                    <label className="col-lg-12 mb-0 text-secondary">
                                      {Trans("_deadlineDate") + " : "}
                                    </label>
                                    <b className="col-lg-12">
                                      <Datecomp date={moment(booking.dateInfo.startDate).add(-7, 'days')} />
                                    </b>
                                  </div>
                                </li>
                              )}

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("Cost Price") + " : "}
                                  </label>
                                  <b className="col-lg-12">{<Amount amount={booking.costPrice} currencyCode={item.currencyCode} />}</b>
                                </div>
                              </li>

                              <li className="col-lg-4 mb-3">
                                <div className="row">
                                  <label className="col-lg-12 mb-0 text-secondary">
                                    {Trans("Sell Price") + " : "}
                                  </label>
                                  <b className="col-lg-12">{<Amount amount={booking.sellPrice} currencyCode={item.currencyCode} />}</b>
                                </div>
                              </li>
                              <AuthorizeComponent title="bookings~customer-bookings-add-brn" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                {HideSupplierBRNUpdate && <li className="col-lg-4 mb-3">
                                  <div className="row">
                                    <label className="col-lg-12 mb-0 text-secondary">
                                      {Trans("Supplier BRN") + " : "}
                                    </label>


                                    {this.state.itemBRNUpdate === booking.itineraryDetailID ?
                                      <React.Fragment>
                                        <input type="text" name="supplierBRN" placeholder={supplierbrnstatedetails.length > 0 ? supplierbrnstatedetails[0].supplierBRN : booking.supplierBRN} className="form-control mt-2 ml-3" style={{ width: "50%" }} onChange={(e) => this.handlesupplierBRN(e.target.value)}></input>
                                        <button
                                          className="btn btn-sm btn-primary form-control mt-2 ml-1"
                                          style={{ width: "14%" }}
                                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "bookings~customer-bookings-add-brn") ?
                                            this.saveSupplierBRN(booking)
                                            : this.setState({ isshowauthorizepopup: true })
                                          }
                                        >
                                          <SVGIcon
                                            name="edit"
                                            className="mr-1"
                                            width="12"
                                          ></SVGIcon>
                                          <small>{Trans("Add")}</small>
                                        </button>
                                      </React.Fragment>
                                      : <button
                                        className="col-lg-1 btn btn-sm float-left ml-2 "
                                        onClick={() => this.editBRN(booking)}

                                      >
                                        <SVGIcon
                                          name="edit"
                                          width="16"
                                          height="16"
                                          className="text-secondary d-flex align-items-center"
                                        ></SVGIcon>
                                      </button>}

                                    {this.state.itemBRNUpdate !== booking.itineraryDetailID && supplierbrnstatedetails.length > 0 ?
                                      <b className="col-lg-10 p-0">{supplierbrnstatedetails.length > 0 ? supplierbrnstatedetails[0].supplierBRN : "--"}</b>
                                      : this.state.itemBRNUpdate !== booking.itineraryDetailID && booking.supplierBRN ?
                                        <b className="col-lg-10 p-0">{booking.supplierBRN}</b>
                                        : this.state.itemBRNUpdate !== booking.itineraryDetailID ? "--" : ""
                                    }

                                  </div>
                                </li>}
                              </AuthorizeComponent>
                              {HideSupplierName && booking.flags["showprovidername"] !==
                                undefined &&
                                booking.flags["showprovidername"] ===
                                true && (
                                  <li className="col-lg-4 mb-3">
                                    <div className="row">
                                      <label className="col-lg-12 mb-0 text-secondary">
                                        {Trans("_providerName") + " : "}
                                      </label>
                                      <b className="col-lg-12">
                                        {booking.providerName.replaceAll("&amp;", "&")}
                                      </b>
                                    </div>
                                  </li>
                                )}

                              <li className="col-lg-4 mb-3 ml-md-auto">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="mt-2">
                                      <AuthorizeComponent title="bookings~customer-bookings-view" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                        <button
                                          className="btn btn-sm btn-light text-secondary mr-2"
                                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "bookings~customer-bookings-view") ?
                                            this.redirectToDetails(
                                              "view",
                                              itinerary,
                                              booking.bookingRefNo
                                            )
                                            : this.setState({ isshowauthorizepopup: true })
                                          }
                                        >
                                          <SVGIcon
                                            name="search"
                                            className="mr-1"
                                            width="12"
                                          ></SVGIcon>
                                          <small>{Trans("_view")}</small>
                                        </button>
                                      </AuthorizeComponent>
                                      <button
                                        className="btn btn-sm btn-light text-secondary mr-2 pl-2 "
                                        onClick={() => this.handleEticket(booking, itinerary, booking.bookingRefNo)}
                                      >
                                        <small>{booking.isEticketUpdated ? "Update E-Ticket" : "Generate E-Ticket"}</small>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          );
                        })}
                      </div>
                      {
                        this.state.showPopup ? (
                          <ModelPopup
                            header={this.state.popupTitle}
                            content={this.state.popupContent}
                            handleHide={this.handleHidePopup}
                            sizeClass={this.state.popupSizeClass}
                          />
                        ) : null
                      }
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

              {this.state.isshowauthorizepopup &&
                <ModelPopupAuthorize
                  header={""}
                  content={""}
                  handleHide={this.hideauthorizepopup}
                  history={this.props.history}
                />
              }
              {this.state.isshowTicketPopup && //this.state.brnBookingDetails && this.state.brnBookingDetails !== '' &&
                <ModelPopup
                  header={"Generate E-Ticket"}
                  content={<PaperRatesEticket bookingDetails={this.state.brnBookingDetails} isfromUpdateEticket={this.state.isfromUpdateEticket} itineraryDetailID={this.state.itineraryDetailID} updateBookingEticketStatus={this.updateBookingEticketStatus} handleHide={this.handleHideEticketPopup} />}
                  sizeClass="modal-dialog modal-xl modal-dialog-centered"
                  handleHide={this.handleHideEticketPopup}
                />
              }
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default MyBookings;
