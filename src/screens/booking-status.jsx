import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import Loader from "../components/common/loader";
import FailureBookingMessage from "../components/booking-status/failure-booking-message";
import SuccessBookingMessage from "../components/booking-status/success-booking-message";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import { Trans } from "../helpers/translate";
import * as Global from "../helpers/global";
import SVGIcon from "../helpers/svg-icon";
import Amount from "../helpers/amount";
import Config from "../config.json";

class BookingStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cartId: this.props.match.params.token,
      cartStatus: null,
      cart: null,
      mybookingsData: null,
    };
  }

  viewCart = () => {
    var reqURL = "api/v1/cart";
    var reqOBJ = {
      Request: this.state.cartId,
      Flags: { lockcartifunlocked: true },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let response = data.response;
        response.items = response.items.filter(x => x.isBookable);
        this.setState({
          cart: response,
          cartStatus: data.response.bookingTransactionStatus,
        });
        this.getBookings(response.itineraryReferenceNumber);
        this.clearCart();
      }.bind(this)
    );
  };
  getBookings = (itineraryReferenceNumber) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    // const dateString = new Date().toISOString().slice(0, 10);
    let filter = [
      {
        "item": [
          {
            "Name": "bookingdaterange",
            "minValue": dateString,
            "maxValue": dateString
          },
          {
            "Name": "itineraryreferencenumber",
            "DefaultValue": itineraryReferenceNumber
          }
        ]
      }
    ]
    var reqURL = "api/v1/" + 'mybookings';
    var reqOBJ = {
      Request: {
        Data: "all",
        filtersIndex: filter,
        PageInfoIndex: [
          {
            "Item": {
              "PageLength": 10
            }
          }
        ]
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 30) {
          console.log('Get MyBookings Response', data);
          this.setState({
            isLoginError: true, isLoading: false,
          });
        }
        else {
          this.setState({
            mybookingsData: data.response, isLoading: false,
          });
        }
      }.bind(this)
    );
  };

  clearCart = () => {
    var reqURL = "api/v1/cart/clear";
    var reqOBJ = {
      Request: {
        CartID: this.state.cartId,
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (Config.codebaseType === "tourwiz") {
          sessionStorage.removeItem("personateId");
          sessionStorage.removeItem("callCenterType");
          sessionStorage.removeItem("bookingFor");
          sessionStorage.removeItem("bookingForInfo");
          sessionStorage.setItem("personateId", localStorage.getItem("personateId"));
        }
      }.bind(this)
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.viewCart();
  }
  redirectToVoucher = (mode, itineraryID, bookingID, businessName) => {
    let portalURL = window.location.origin;
    var win = window.open(
      `${portalURL}/Voucher/${mode}/${businessName}/${itineraryID}/${bookingID}`,
      // "_blank"
    );
    win.focus();
  };

  render() {
    const { isLoading, cart, cartStatus, mybookingsData } = this.state;
    let IsHidePortalDetails = Global.getEnvironmetKeyValue(window.location.hostname);
    return (
      <div className="booking-status">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="info-circle"
                className="mr-3"
                width="24"
                height="24"
              ></SVGIcon>
              {Trans("_titleBookingStatus")}
            </h1>
          </div>
        </div>
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <div className="border bg-white p-4 ">
                  {cartStatus === 2 || cartStatus === 4 ? (
                    <SuccessBookingMessage cart={cart} {...this.props} />
                  ) : (
                    <FailureBookingMessage cart={cart} />
                  )}
                </div>
                <div className="border bg-white p-4 mt-4 ">
                  <div>
                    <h5 className="d-flex align-items-center font-weight-bold">
                      <SVGIcon
                        name="id-card"
                        type="fill"
                        className="mr-2 text-success"
                      ></SVGIcon>
                      {Trans("_companyInfoTitle")}
                    </h5>
                    <div className="border-top mt-4 pt-3">
                      <h6>{Global.getEnvironmetKeyValue("portalName")}</h6>
                      {!IsHidePortalDetails &&
                        <React.Fragment>
                          <p className="d-block">
                            {Global.getEnvironmetKeyValue("portalAddress")}
                          </p>
                          <p className="d-block">
                            <SVGIcon
                              name="phone"
                              type="fill"
                              className="mr-2 text-success"
                            ></SVGIcon>
                            {Trans("_call")} :{" "}
                            {Global.getEnvironmetKeyValue("portalPhone")}
                          </p>
                        </React.Fragment>
                      }
                      <p className="d-block">
                        <SVGIcon
                          name="envelope"
                          className="mr-2 text-success"
                        ></SVGIcon>
                        {Trans("_email")} :{" "}
                        <a
                          className="mailto"
                          href={
                            "mailto:" +
                            Global.getEnvironmetKeyValue(
                              "portalCustomerCareEmail"
                            ) ??
                            Global.getEnvironmetKeyValue("customerCareEmail")
                          }
                        >
                          {Global.getEnvironmetKeyValue(
                            "portalCustomerCareEmail"
                          ) ??
                            Global.getEnvironmetKeyValue("customerCareEmail")}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                {cart.items.map((cart, key) => {
                  const booking = mybookingsData.data.length > 0
                    ? mybookingsData.data[0][Object.keys(mybookingsData.data[0])[0]].find(x => x.bookingRefNo === cart.bookingReferenceCode)
                    : null;
                  return (
                    <React.Fragment>
                      <div className="border bg-white p-3 mb-2" key={key}>
                        <h6>
                          <span className="text-capitalize badge badge-secondary bg-success">
                            {Trans("_" + cart.data.business.toLowerCase())}
                          </span>
                        </h6>
                        <h6 className="border-bottom pb-3 font-weight-bold">
                          {cart.data.name && cart.data.name.replaceAll("&amp;", "&").replaceAll("&Amp;", "&")}
                          {cart.data.business === "air" &&
                            cart.data.locationInfo.fromLocation.id.replaceAll("&amp;", "&").replaceAll("&Amp;", "&") +
                            " - " +
                            cart.data.locationInfo.toLocation.id.replaceAll("&amp;", "&").replaceAll("&Amp;", "&") +
                            (cart.data.tripType === "roundtrip"
                              ? " - " + cart.data.locationInfo.fromLocation.id.replaceAll("&amp;", "&").replaceAll("&Amp;", "&")
                              : "")}
                        </h6>
                        <div className="mb-2">
                          {Trans("_status") + " : "}
                          {cart.bookingStatus === 1 ? (
                            <span className="text-success ml-2">
                              {Trans("_bookingStatusConfirmed")}
                            </span>
                          ) : cart.bookingStatus === 12 ? (
                            <span className="text-success ml-2">
                              {Trans("_bookingStatusBooked")}
                            </span>
                          ) : cart.bookingStatus === 15 ? (
                            <span className="text-success ml-2">
                              {Trans("_bookingStatusTicketOnProcess")}
                            </span>
                          ) : (
                            <span className="text-danger ml-2">
                              {Trans("_bookingStatusFailed")}
                            </span>
                          )}
                        </div>

                        {cart.bookingStatus === 1 ||
                          cart.bookingStatus === 10 ||
                          cart.bookingStatus === 12 ? (
                          <div className="mb-2">
                            {Trans("_lblBRN") + " : "}{" "}
                            {cart.bookingReferenceCode}
                          </div>
                        ) : null}
                        <div>
                          {Trans("_amount") + " : "}{" "}
                          <Amount
                            amount={
                              this.state.cart.paymentTransaction
                                .transactionRequest[key].totalAmount
                            }
                          />
                        </div>
                        <div>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mt-2">
                                {cart.bookingStatus === 1 && (
                                  <React.Fragment>
                                    <AuthorizeComponent title="bookings~customer-bookings-voucher" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                      <button
                                        className="btn btn-sm btn-light text-secondary mr-2"
                                        onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "bookings~customer-bookings-voucher") ?
                                          this.redirectToVoucher(
                                            "voucher",
                                            booking.itineraryID,
                                            booking.bookingID,
                                            booking.businessDescription.toLowerCase() === "flight" ? "air" :
                                              booking.businessDescription.toLowerCase() === "car rental" ? "vehicle" : booking.businessDescription
                                          )
                                          : this.setState({ isshowauthorizepopup: true })
                                        }
                                      >
                                        <SVGIcon
                                          name="file-text"
                                          className="mr-1"
                                          width="12"
                                        ></SVGIcon>
                                        <small>{Trans("_voucher")}</small>
                                      </button>
                                    </AuthorizeComponent>
                                    <AuthorizeComponent title="bookings~customer-bookings-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                      <button
                                        className="btn btn-sm btn-light text-secondary"
                                        onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "bookings~customer-bookings-invoice") ?
                                          this.redirectToVoucher(
                                            "invoice",
                                            booking.itineraryID,
                                            booking.bookingID,
                                            booking.businessDescription.toLowerCase() === "flight" ? "air" :
                                              booking.businessDescription.toLowerCase() === "car rental" ? "vehicle" : booking.businessDescription
                                          )
                                          : this.setState({ isshowauthorizepopup: true })
                                        }
                                      >
                                        <SVGIcon
                                          name="file-excel"
                                          className="mr-1"
                                          width="12"
                                        ></SVGIcon>
                                        <small>{Trans("_invoice")}</small>
                                      </button>
                                    </AuthorizeComponent>
                                    {/* <AuthorizeComponent title="dashboard-menu~paperrates-bookings" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                      {booking.isPaperRateBooking &&
                                        <button
                                          className="btn btn-sm btn-light text-secondary mr-2 pl-2 "
                                          onClick={() => this.handleEticket(booking, booking, booking.bookingRefNo)}
                                        >
                                          <SVGIcon
                                            name="file-excel"
                                            className="mr-1"
                                            width="12"
                                          ></SVGIcon>
                                          <small>{booking.isEticketUpdated ? "Update E-Ticket" : "Generate E-Ticket"}</small>
                                        </button>
                                      }
                                    </AuthorizeComponent> */}
                                  </React.Fragment>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* {cart.bookingStatus === 15 && (
                        <div className="alert alert-danger mt-1 p-1 pl-3 pr-3 d-inline-block small">
                          {Trans("_bookingStatusTicketNotGenerated")}
                        </div>
                      )} */}
                      {cart.bookingStatus === 15 && (
                        <div
                          class="alert alert-danger mt-1 p-1 p-3 pr-3 d-block small"
                          role="alert"
                        >
                          <h4 class="alert-heading">
                            {Trans("_warningTitle")}
                          </h4>
                          <hr></hr>
                          <p class="mb-0">{Trans("_eTicketNotGenerated")}</p>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BookingStatus;
