import React from "react";
import BookingSteps from "../components/common/booking-steps";
import CartItems from "../components/cart/cart-items";
import CartLoading from "../components/cart/cart-loading";
import PriceBreakup from "../components/cart/price-breakup";
import PaymentMode from "../components/payment/payment-mode";
import CartBase from "../base/cart-base";
import ModelPopup from "../helpers/model";
import { Trans } from "../helpers/translate";
import PromoCode from "../components/payment/payment-promocode";
import moment from "moment";
import PaperRatesTimer from "./paper-rates-timer-widget";
import PaperRateTimeOut from "./paper-rates-timeout-widget ";
import Countdown from 'react-countdown';

class Payment extends CartBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "payment",
      isLoading: true,
      cart: null,
      cartId: localStorage.getItem("cartLocalId"),
      paymentMode: null,
      selectedPaymentMode: null,
      isBtnLoading: false,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      agreeCondition: false,
      errorMessages: [],
      promoCodeMsg: false,
      isPromoBtnLoading: true,
      PriceChangeSoldOut: [],
      paperratetimer: new moment('2014-01-01 00:01:00'),
      myInterval: 0,
      isProceedToPaymentLoading: false,
      isPaperRateBooking: false,
      seatTransactionToken: "",
      airPaperRateId: 0,
      TotalSeats: 0,
      paperRateTotalTimeForExpire: 0,
      ispaperratetimeexpire: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.viewCart();
    this.getPaymentMode();
  }
  renderTimer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <PaperRateTimeOut {...this.props} handleRelease={this.releasePaperRatesSeats} />
    } else {
      return <PaperRatesTimer minutes={minutes} seconds={seconds} />
    }
  };
  render() {
    const {
      cart,
      isLoading,
      paymentMode,
      isBtnLoading,
      promoCodeMsg,
      isPromoBtnLoading
    } = this.state;
    const paymentGatewayCharges = this.state.cart ? this.state.cart.paymentGatewayCharges : null;
    let ispaperratetimeexpire = this.state.ispaperratetimeexpire;
    var paperRateTotalTimeForExpire = new Date();
    paperRateTotalTimeForExpire.setSeconds(paperRateTotalTimeForExpire.getSeconds() + this.state.paperRateTotalTimeForExpire);
    if (ispaperratetimeexpire) {
      paperRateTotalTimeForExpire.setSeconds(paperRateTotalTimeForExpire.getSeconds() + (this.state.paperRateTotalTimeForExpire * -2));
    }
    return (
      <div className="cart">
        <BookingSteps isLoggedIn={true} isPayment={true} />
        <div className="container">
          {isLoading || paymentMode === null ? (
            <CartLoading />
          ) : (
            <div className="row mt-4">
              <div className="col-lg-9">
                <CartItems
                  history={this.props.history}
                  match={this.props.match}
                  {...cart}
                  removeCartItem={this.removeCartItem}
                  isRemoveCartLoading={this.state.isRemoveCartLoading}
                  showVehicletermsCondition={this.showVehicletermsCondition}
                  handleAirFareRules={this.handleAirFareRules}
                  isPaperRateBooking={this.state.isPaperRateBooking}
                />

                {this.renderCartAvailabilityChanged()}
                {this.state.isPaperRateBooking && this.state.paperRateTotalTimeForExpire > 0 &&
                  <Countdown
                    date={paperRateTotalTimeForExpire}
                    renderer={this.renderTimer}
                  />
                }
                {this.state.cart.items.length &&
                  this.state.cart.items.filter(
                    (x) => x.availabilityStatus === 3 || x.availabilityStatus === 4 || x.availabilityStatus === 5
                  ).length !== this.state.cart.items.length &&
                  Object.keys(cart.paymentGatewayCharges).length > 0 && !ispaperratetimeexpire && (
                    <React.Fragment>
                      <div className="mt-3">
                        {cart.inputs.availableInputs.find(
                          (x) => x.type === "promocode"
                        ) && (
                            <PromoCode
                              handlePromoCode={this.handlePromoCode}
                              promoCodeMsg={promoCodeMsg}
                              cart={cart}
                              isPromoBtnLoading={isPromoBtnLoading}
                              removePromoCode={this.removePromoCode}
                            />
                          )}
                      </div>

                      <div className="mt-3">
                        <PaymentMode
                          {...cart}
                          paymentMode={paymentMode}
                          setPaymentMode={this.setPaymentMode}
                          paymentInfo={this.getPaymentInformation}
                        />
                      </div>

                      <div className="mt-3 mb-3">
                        <div>
                          <b className="text-primary">
                            {Trans("_paymentPageDoNotRefreshMessage")}
                          </b>
                        </div>
                        <div className="mt-3">
                          {this.state.cart && this.state.cart.items.length &&
                            (
                              [...Array(this.state.cart.items.filter(x => x.data.pricingMessage !== undefined && x.data.pricingMessage !== "").length).keys()].map(count => {
                                {
                                  return (
                                    <div className=" custom-control custom-checkbox">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={"mandatory" + count}
                                        checked={true}
                                      //onChange={() => this.agreeCondition()}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={"mandatory" + count}
                                      >
                                        {Trans("_MandatoryFeePolicyLineLabel")} <b>{this.state.cart.items[count].data.name}</b> {this.state.cart.items[count].data.pricingMessage}
                                      </label>
                                    </div>
                                  )
                                }
                              })
                            )
                          }

                          <div className=" custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="chkAgree"
                              checked={this.state.agreeCondition}
                              onChange={() => this.agreeCondition()}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="chkAgree"
                            >
                              {Trans("_paymentPageAgreeMessagePart1") + " "}
                              <button
                                className="btn btn-link p-0 text-primary"
                                onClick={() => this.handleShowTerms()}
                              >
                                {Trans("_paymentPageAgreeMessagePart2")}
                              </button>{" "}
                              {" " + Trans("_paymentPageAgreeMessagePart3")}
                            </label>
                          </div>
                          {!localStorage.getItem("isUmrahPortal")
                            && Object.keys(paymentGatewayCharges).filter(x => x.toLowerCase() === "holdbooking").length === 0 &&
                            <div className=" custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="chkNonRefund"
                                checked={this.state.agreeNonRefundable}
                                onChange={() => this.agreeNonRefundable()}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="chkNonRefund"
                              >
                                {Trans("_paymentnonBNPLMessage")}
                              </label>
                            </div>
                          }
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={this.bookCart}
                      >
                        {isBtnLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        {Trans("_btnConfirmBooking")}
                      </button>
                      {this.state.errorMessages.length > 0 && (
                        <div className="alert alert-danger mt-3" role="alert">
                          <span>{Trans("_ooops")}</span>
                          <ul>
                            {this.state.errorMessages.map((error) => {
                              return <li>{error}</li>;
                            })}
                          </ul>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                {Object.keys(cart.paymentGatewayCharges).length === 0 &&
                  <div className="mt-3">
                    <div className="payment-form">
                      <div className="payment-details border pt-3 pl-3 pr-3 pb-3 bg-white box-shadow mb-3">
                        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
                          No payment option(s) available!
                        </h5>
                        <div>
                          <b class="text-primary">
                            There are no payment option(s) available to book your cart. Kindly make a new search and try again.
                            {/* We are sorry. You can not do reservation due to insufficient balance and hold booking is not available for your booking. */}
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>

              <div className="col-lg-3">
                <PriceBreakup {...cart} />
              </div>
            </div>
          )}
        </div>
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.handleHideTerms}
          />
        ) : null}
      </div>
    );
  }
}

export default Payment;
