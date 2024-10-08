import React from "react";
import Form from "../common/form";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import Amount from "../../helpers/amount";
import moment from "moment";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";

class BookingFilters extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        type: "upcoming",
        business: "",
        bookingFromDate: this.getFromDate(),
        bookingToDate: this.getToDate(),
        bookingRefNo: "",
        itineraryRefNo: "",
        itineraryName: "",
        email: "",
        customerName: "",
        supplierName: "",
        bookingStatus:
          this.props.page === "mybookings/getchangerequests" ? "2" : "",
        transactionType: "",
        contactNumber: "",
        transactionstatus: "0",
        transactiontoken: "",
        transaction_name: "",
        ispaperratebookings: this.props?.match?.params.frompaperrate ? true : false
      },
      errors: {},
      showHideText: Trans("_showAdditionalOptions"),
      isShowAdvanceLink: false
    };
  }

  getFromDate = () => {
    if (
      this.props.page === "ledgerbalance" ||
      this.props.page === "mytransactions" ||
      this.props.page === "holdbookings"
    )
      return moment().add(-7, 'days').format(
        Global.DateFormate
      );
    // else if (this.props.page === "mybookings/getchangerequests")
    //   return moment(new Date()).format(Global.DateFormate);
    else
      return moment().add(-1, 'months').format(
        Global.DateFormate
      );
  };

  getToDate = () => {
    if (this.props.page === "mybookings/getchangerequests")
      return moment().add(7, 'days').format(
        Global.DateFormate
      );
    else return moment().format(Global.DateFormate);
  };

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.filterBookings();
  };

  validate = () => {
    const errors = {};
    return Object.keys(errors).length === 0 ? null : errors;
  };

  filterBookings = () => {
    let filters = [];

    this.state.data.business &&
      this.state.data.business !== "All" &&
      this.state.data.business !== "" &&
      filters.push({
        Name: "businessid",
        DefaultValue: this.state.data.business
      });

    this.state.data.bookingFromDate &&
      this.state.data.bookingToDate &&
      filters.push({
        Name:
          this.props.page === "ledgerbalance"
            ? "daterange"
            : this.props.page === "mybookings/getchangerequests"
              ? "changerequestdaterange"
              : "bookingdaterange",
        minValue: this.state.data.bookingFromDate,
        maxValue: this.state.data.bookingToDate
      });

    this.state.data.bookingRefNo &&
      filters.push({
        Name: "bookingreferencenumber",
        DefaultValue: this.state.data.bookingRefNo
      });

    this.state.data.itineraryRefNo &&
      filters.push({
        Name: "itineraryreferencenumber",
        DefaultValue: this.state.data.itineraryRefNo
      });

    this.state.data.itineraryName &&
      filters.push({
        Name: "itineraryname",
        DefaultValue: this.state.data.itineraryName
      });

    this.state.data.email &&
      filters.push({
        Name: "email",
        DefaultValue: this.state.data.email
      });

    this.state.data.customerName &&
      filters.push({
        Name: "customername",
        DefaultValue: this.state.data.customerName
      });

    this.state.data.supplierName &&
      filters.push({
        Name: "suppliername",
        DefaultValue: this.state.data.supplierName
      });

    this.props.page === "mybookings" &&
      this.state.data.bookingStatus &&
      this.state.data.bookingStatus !== "All" &&
      filters.push({
        Name: "bookingstatus",
        DefaultValue: this.state.data.bookingStatus
      });

    this.props.page !== "mybookings" &&
      this.state.data.bookingStatus &&
      filters.push({
        Name:
          this.props.page === "mybookings"
            ? "bookingstatus"
            : "bookingstatusid",
        DefaultValue: this.state.data.bookingStatus
      });

    this.state.data.transactionType &&
      this.state.data.transactionType !== "0" &&
      filters.push({
        Name: "transactiontype",
        DefaultValue: this.state.data.transactionType
      });

    this.state.data.contactNumber &&
      filters.push({
        Name: "contactnumber",
        DefaultValue: this.state.data.contactNumber
      });

    this.state.data.transactionstatus &&
      this.state.data.transactionstatus !== "0" &&
      filters.push({
        Name: "paymentstatusid",
        DefaultValue: this.state.data.transactionstatus
      });

    this.state.data.transactiontoken &&
      filters.push({
        Name: "transactiontoken",
        DefaultValue: this.state.data.transactiontoken
      });

    this.state.data.transaction_name &&
      filters.push({
        Name: "name",
        DefaultValue: this.state.data.transaction_name
      });

    this.state.data.ispaperratebookings &&
      filters.push({
        Name: "showpaperratebookings",
        DefaultValue: "true"
      });

    let type = this.state.data.type;
    this.props.filterResults(
      filters,
      this.props.page === "mybookings" ? type : null
    );
  };

  isRenderFilter = filterName => {
    let filters_collenction = [];
    if (this.props.page === "mybookings/getchangerequests")
      filters_collenction = this.state.isShowAdvanceLink
        ? filters_getchangerequests
        : filters_getchangerequestsHide;
    else if (this.props.page === "ledgerbalance")
      filters_collenction = filters_ledgerbalance;
    else if (this.props.page === "mybookings") {
      if (!this.state.isShowAdvanceLink) {
        filters_collenction = filters_bookingsHide;
      } else if (Global.getEnvironmetKeyValue("portalType") === "B2B") {
        //TODO : If Agent then remove supplier name
        filters_collenction = filters_bookingsAgent;
      } else if (Global.getEnvironmetKeyValue("portalType") === "B2C") {
        filters_collenction = filters_bookingsB2C;
      } else filters_collenction = filters_bookingsAdmin;
    } else if (this.props.page === "mytransactions") {
      filters_collenction = this.state.isShowAdvanceLink
        ? filters_myTransactions
        : filters_myTransactionsHide;
    } else if (this.props.page === "holdbookings") {
      filters_collenction = filters_holdbookings;
    } else {
      return false;
    }

    return filters_collenction.find(filter => filter === filterName);
  };

  handlepaperratebookings = () => {
    let newdata = { ...this.state.data };
    newdata.ispaperratebookings = !newdata.ispaperratebookings;
    this.setState({ data: newdata });
  }

  handleShowAdditionalOptions = () => {
    this.setState({
      isShowAdvanceLink: !this.state.isShowAdvanceLink,
      showHideText:
        this.state.showHideText === Trans("_showAdditionalOptions")
          ? Trans("_hideAdditionalOptions")
          : Trans("_showAdditionalOptions")
    });
  };

  render() {
    const Business = Global.getEnvironmetKeyValue("availableBusinesses").map(
      business => {
        return { value: business.aliasId ? business.aliasId : business.id, name: Trans("_" + business.name) };
      }
    );

    Business.splice(0, 0, {
      id: "",
      name: Trans("_all")
    });
    const { balanceInfo } = this.props;

    return (
      <div className="border pt-3 pl-3 pr-3 pb-0 m-0 mb-3 shadow-sm">
        <h5 className="text-primary border-bottom pb-3">
          <SVGIcon
            name="filter"
            width="16"
            height="16"
            type="fill"
            className="mr-2"
          ></SVGIcon>
          <span>{" " + Trans("_filters")}</span>
          {!this.props.isFromPaperRateBookings && (this.props.page === "mybookings" ||
            this.props.page === "mybookings/getchangerequests" ||
            this.props.page === "mytransactions") && (
              <button
                className="btn btn-link p-0 m-0 text-primary pull-right"
                onClick={this.handleShowAdditionalOptions}
              >
                {this.state.showHideText}
              </button>
            )}
          {this.props.page === "ledgerbalance" && (
            <div className="pull-right">
              <h5 className="text-primary">
                {Trans("_currentBalance") + " : "}{" "}
                <Amount amount={balanceInfo.agentBalance} />{" "}
                {" (" + balanceInfo.userDisplayName + ")"}
              </h5>
            </div>
          )}
        </h5>

        <div className="row border-bottom">
          {this.isRenderFilter("transactionstatus") && (
            <div className="col-lg-2">
              {this.renderSelect(
                "transactionstatus",
                Trans("_transactionStatus"),
                failedBookingTransactionStatus
              )}
            </div>
          )}

          {!this.props.isFromPaperRateBookings && this.isRenderFilter("bookingtype") && (
            <div className="col-lg-2">
              {this.renderSelect("type", Trans("_viewType"), bookingType)}
            </div>
          )}
          {!this.props.isFromPaperRateBookings && this.isRenderFilter("bookingstatus") && (
            <div className="col-lg-2">
              {this.renderSelect(
                "bookingStatus",
                Trans("_status"),
                this.props.page === "mybookings"
                  ? myBookingStatus
                  : offlineBookingStatus
              )}
            </div>
          )}

          {!this.props.isFromPaperRateBookings && this.isRenderFilter("businessid") && (
            <div className="col-lg-2">
              {this.renderSelect("business", Trans("_business"), Business)}
            </div>
          )}

          {this.isRenderFilter("bookingdaterange") && (
            <React.Fragment>
              <div className="col-lg-2">
                {this.renderSingleDate(
                  "bookingFromDate",
                  Trans("_fromDate"),
                  moment(this.state.data.bookingFromDate).format(Global.DateFormate),
                  moment().add(-10, 'years').format(Global.DateFormate),
                  "text", false, true
                )}
              </div>
              <div className="col-lg-2">
                {this.renderSingleDate(
                  "bookingToDate",
                  Trans("_toDate"),
                  moment(this.state.data.bookingToDate).format(Global.DateFormate),
                  moment(this.state.data.bookingFromDate).format(Global.DateFormate),
                  "text", false, true
                )}
              </div>
            </React.Fragment>
          )}

          {this.isRenderFilter("transactiontoken") && (
            <div className="col-lg-2">
              {this.renderInput("transactiontoken", Trans("_transactionToken"))}
            </div>
          )}

          {this.isRenderFilter("bookingreferencenumber") && (
            <div className="col-lg-2">
              {this.renderInput("bookingRefNo", Trans("_bookingRefNo"))}
            </div>
          )}

          {this.isRenderFilter("itineraryreferencenumber") && (
            <div className="col-lg-2">
              {this.renderInput("itineraryRefNo", Trans("_itineraryRefNo"))}
            </div>
          )}

          {this.isRenderFilter("itineraryname") && (
            <div className="col-lg-2">
              {this.renderInput("itineraryName", Trans("_itineraryName"))}
            </div>
          )}

          {this.isRenderFilter("email") && (
            <div className="col-lg-2">
              {this.renderInput("email", Trans("_emailAddress"))}
            </div>
          )}

          {this.isRenderFilter("customername") && (
            <div className="col-lg-2">
              {this.renderInput("customerName", Trans("_customerName"))}
            </div>
          )}

          {this.isRenderFilter("suppliername") && (
            <div className="col-lg-2">
              {this.renderInput("supplierName", Trans("_supplierName"))}
            </div>
          )}

          {!this.props.isFromPaperRateBookings && this.isRenderFilter("transactiontype") && (
            <div className="col-lg-2">
              {this.renderSelect(
                "transactionType",
                Trans("_transactionType"),
                transactionType
              )}
            </div>
          )}

          {this.isRenderFilter("contactnumber") && (
            <div className="col-lg-2">
              {this.renderInput("contactNumber", Trans("_contactNumber"))}
            </div>
          )}

          {this.isRenderFilter("name") && (
            <div className="col-lg-2">
              {this.renderInput("transaction_name", Trans("_viewName"))}
            </div>
          )}


          {Global.getEnvironmetKeyValue("isAirPaperRateEnabled", "cobrand") === "true" && !this.props.isFromPaperRateBookings && this.isRenderFilter("ispaperratebookings") &&
            //<AuthorizeComponent title="bookings~customer-bookings-add-brn" type="button" rolepermissions={this.props.rolePermissions}>
            <div className="col-lg-2 mt-4">
              <div className=" custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="ispaperratebookings"
                  name="ispaperratebookings"
                  checked={this.state.data.ispaperratebookings}
                  onChange={this.handlepaperratebookings}
                />
                <label className="custom-control-label" htmlFor="ispaperratebookings">
                  Show Only Paper Rate Booking(s)
                </label>
              </div>
            </div>
            //</AuthorizeComponent>
          }

          <div className="col-lg-2 mb-3">
            <label>&nbsp;</label>
            <button
              className="btn btn-sm btn-primary form-control"
              onClick={() => this.filterBookings()}
            >
              <SVGIcon
                name="filter"
                width="12"
                height="12"
                className="mr-1"
                type="fill"
              ></SVGIcon>
              {Trans("_applyFilter")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BookingFilters;

const bookingType = [
  { value: "all", name: Trans("_bookingTypeAll") },
  { value: "upcoming", name: Trans("_bookingTypeUpcoming") },
  { value: "completed", name: Trans("_bookingTypeCompleted") },
  { value: "cancelled", name: Trans("_bookingTypeCancelled") },
  { value: "other", name: Trans("_bookingTypeOther") }
];

const transactionType = [
  { value: 0, name: Trans("_transactionTypeAll") },
  { value: 1, name: Trans("_transactionTypeRechargeCash") },
  { value: 2, name: Trans("_transactionTypeRechargeCheque") },
  { value: 3, name: Trans("_transactionTypeRechargeForBooking") },
  { value: 4, name: Trans("_transactionTypeReservation") },
  { value: 5, name: Trans("_transactionTypeRefund") },
  { value: 6, name: Trans("_transactionTypeRechargeOnline") }
];

const offlineBookingStatus = [
  { value: 2, name: Trans("_bookingStatusCancelRequest") },
  { value: 3, name: Trans("_bookingStatusAmendRequest") },
  { value: 4, name: Trans("_bookingStatusRequestInProcess") },
  { value: 5, name: Trans("_bookingStatusOnRequest") }
];

const myBookingStatus = [
  { value: "All", name: Trans("_all") },
  { value: "Booked", name: Trans("_bookingStatusBooked") },
  { value: "Confirmed", name: Trans("_bookingStatusConfirmed") },
  { value: "Cancel", name: Trans("_bookingStatusCancel") },
  { value: "CancelRequest", name: Trans("_bookingStatusCancelRequest") },
  { value: "ModifyRequest", name: Trans("_bookingStatusAmendRequest") },
  { value: "ProcessedRequest", name: Trans("_bookingStatusRequestInProcess") },
  { value: "Expired", name: Trans("_bookingStatusExpiredRequest") },
  { value: "Denied", name: Trans("_bookingStatusDeniedRequest") },
  { value: "Modify", name: Trans("_bookingStatusModifiedSucessfully") },
  { value: "AutoCancel", name: Trans("_bookingStatusAutoCancel") },
  { value: "AutoCancelFail", name: Trans("_bookingStatusAutoCancelFailure") },
  { value: "SystemVoid", name: Trans("_bookingStatusSystemVoid") }
];

const failedBookingTransactionStatus = [
  { value: "0", name: Trans("_failedBookingTransactionStatusAll") },
  { value: "97", name: Trans("_failedBookingTransactionStatusDirtyAttempt") },
  { value: "98", name: Trans("_failedBookingTransactionStatusPaymentReceived") },
  { value: "99", name: Trans("_failedBookingTransactionStatusPaymentFailure") },
  { value: "100", name: Trans("_failedBookingTransactionStatusReservationServiceSuccess") },
  { value: "101", name: Trans("_failedBookingTransactionStatusReservationFailure") },
  { value: "102", name: Trans("_failedBookingTransactionStatusTransactionLoggedSuccess") },
  { value: "103", name: Trans("_failedBookingTransactionStatusTransactionLoggedFailure") },
  { value: "255", name: Trans("_failedBookingTransactionStatusTransactionStart") },
  { value: "198", name: Trans("_failedBookingTransactionStatusRefundFailure") }
];

const filters_bookingsAdmin = [
  "bookingtype",
  "bookingstatus",
  "businessid",
  "bookingdaterange",
  "bookingreferencenumber",
  "itineraryreferencenumber",
  "itineraryname",
  "email",
  "customername",
  "suppliername",
  "transactiontoken",
  "ispaperratebookings"
];

const filters_bookingsAgent = [
  "bookingtype",
  "bookingstatus",
  "businessid",
  "bookingdaterange",
  "bookingreferencenumber",
  "itineraryreferencenumber",
  "itineraryname",
  "email",
  "customername",
  "transactiontoken",
  "ispaperratebookings"
];

const filters_bookingsB2C = [
  "bookingtype",
  "bookingstatus",
  "businessid",
  "bookingdaterange",
  "bookingreferencenumber",
  "itineraryreferencenumber",
  "itineraryname",
  "transactiontoken",
  "ispaperratebookings"
];

const filters_bookingsHide = [
  "bookingtype",
  "bookingstatus",
  "businessid",
  "bookingdaterange"
];

const filters_ledgerbalance = ["bookingdaterange", "transactiontype"];

const filters_getchangerequests = [
  "businessid",
  "bookingstatus",
  "bookingdaterange",
  "itineraryreferencenumber",
  "customername",
  "bookingreferencenumber",
  "contactnumber"
];

const filters_getchangerequestsHide = [
  "businessid",
  "bookingstatus",
  "bookingdaterange",
  "bookingreferencenumber"
];

const filters_myTransactionsHide = [
  "transactionstatus",
  "businessid",
  "bookingdaterange",
  "transactiontoken"
];

const filters_myTransactions = [
  "transactionstatus",
  "businessid",
  "bookingdaterange",
  "transactiontoken",
  "Transactiontype",
  "customername",
  "name",
  "suppliername"
];

const filters_holdbookings = [
  "businessid",
  "bookingdaterange",
  "itineraryreferencenumber",
  "bookingreferencenumber"
];
