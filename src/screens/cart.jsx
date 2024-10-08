import React from "react";
import { Link } from "react-router-dom";
import CartItems from "../components/cart/cart-items";
import PriceBreakup from "../components/cart/price-breakup";
import CartLoading from "../components/cart/cart-loading";
import Travellers from "../components/cart/travellers";
import BookingSteps from "../components/common/booking-steps";
import ModelPopup from "../helpers/model";
import CartBase from "../base/cart-base";
import { Trans } from "../helpers/translate";
import * as Global from "../helpers/global";
import TaxInfo from "../components/cart/tax-info"
import moment from "moment";

import PaperRatesTimerControl from "./paper-rates-timer-control-widget";

class Cart extends CartBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "cart",
      isLoading: true,
      cart: null,
      cartId: localStorage.getItem("cartLocalId"),
      isRemoveCartLoading: null,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      specialRequest: [],
      personateDetails: null,
      continueAsGuest: false,
      PriceChangeSoldOut: [],
      continueAsGuestMessage: [],
      customerCrateErrorMsg: "",
      paperratetimer: new moment('2014-01-01 00:01:00'),
      myInterval: 0,
      isProceedToPaymentLoading: false,
      isPaperRateBooking: false,
      seatTransactionToken: "",
      airPaperRateId: 0,
      TotalSeats: 0,
      PaperRateId: 0,
      IsInternational: false,
      paperRateTotalTimeForExpire: 0,
      ispaperratetimeexpire: false,
      //GSTInfo: []
    };
    if (sessionStorage.getItem("callCenterType") !== undefined && (sessionStorage.getItem("callCenterType") === "Customer" || sessionStorage.getItem("callCenterType") === "Agent")) {
      this.getPersonateDetails();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.viewCart();
  }

  render() {
    const { cart, isLoading, personateDetails } = this.state;
    const { isLoggedIn, isLoginMenu } = this.props;
    let { userInfo } = this.props;
    if (sessionStorage.getItem("callCenterType") !== undefined && (sessionStorage.getItem("callCenterType") === "Customer" || sessionStorage.getItem("callCenterType") === "Agent")) {
      if (sessionStorage.getItem("callCenterType") === "Agent" && personateDetails !== null) {
        userInfo.contactInformation.email = personateDetails.customerCareEmail;
      }
      else {
        userInfo = personateDetails
      }
    }

    let tempAvailabilityStatus = false;
    let available = 0;
    if (cart !== undefined && cart !== null) {
      [...Array(cart.items.length).keys()].map(count => {
        if ((cart.items[count].availabilityStatus === 3 || cart.items[count].availabilityStatus === 4) && available === 0) {
          tempAvailabilityStatus = true;
        }
        else {
          available = available + 1;
          tempAvailabilityStatus = false;
        }
        return true;
      });
    }
    let ispaperratetimeexpire = this.state.ispaperratetimeexpire;
    var paperRateTotalTimeForExpire = new Date();
    paperRateTotalTimeForExpire.setSeconds(paperRateTotalTimeForExpire.getSeconds() + this.state.paperRateTotalTimeForExpire);
    if (ispaperratetimeexpire) {
      paperRateTotalTimeForExpire.setSeconds(paperRateTotalTimeForExpire.getSeconds() + (this.state.paperRateTotalTimeForExpire * -2));
    }
    return (
      <div className="cart">
        <BookingSteps isLoggedIn={isLoggedIn} />
        <div className="container">
          {isLoading ? (
            <CartLoading />
          ) : (
            <div className="row mt-4">
              <div className="col-lg-9">
                <CartItems
                  history={this.props.history}
                  match={this.props.match}
                  {...cart}
                  removeCartItem={this.removeCartItemConfirm}
                  isRemoveCartLoading={this.state.isRemoveCartLoading}
                  handleShowSpecialRequest={this.handleShowSpecialRequest}
                  showVehicletermsCondition={this.showVehicletermsCondition}
                  handleAirFareRules={this.handleAirFareRules}
                  specialRequest={this.state.specialRequest}
                  isPaperRateBooking={this.state.isPaperRateBooking}
                />

                {this.renderCartAvailabilityChanged()}
                {this.state.isPaperRateBooking && paperRateTotalTimeForExpire > 0 &&
                  <PaperRatesTimerControl
                    handleReleasePaperRatesSeats={this.releasePaperRatesSeats}
                    paperRateTotalTimeForExpire={paperRateTotalTimeForExpire}
                    history={this.props.history} />
                }
                {isLoggedIn
                  || this.state.continueAsGuest
                  ? (sessionStorage.getItem("callCenterType") !== undefined && (sessionStorage.getItem("callCenterType") === "Customer" || sessionStorage.getItem("callCenterType") === "Agent") && personateDetails === null) || ispaperratetimeexpire
                    ? ""
                    : (
                      <div className="mt-3">
                        <Travellers
                          {...cart}
                          handleAddTravellers={this.addTravellers}
                          userInfo={userInfo}
                          continueAsGuest={this.state.continueAsGuest}
                          bookUmrahPackage={this.bookUmrahPackage}
                          continueAsGuestMessage={this.state.continueAsGuestMessage}
                          customerCrateErrorMsg={this.state.customerCrateErrorMsg}
                          isPaperRateBooking={this.state.isPaperRateBooking}
                          IsInternational={this.state.IsInternational}
                        />
                      </div>
                    ) : (
                    isLoginMenu && !tempAvailabilityStatus && (
                      <div className="mt-4 text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => this.props.handleLoginBox()}
                        >
                          {Trans("_pleaseLoginToBook")}
                        </button>
                        {Global.getEnvironmetKeyValue("portalType") === "B2C" && !Global.getEnvironmetKeyValue("disableContinueAsGuest") &&
                          <React.Fragment>
                            {" "} <span style={{ marginLeft: "20px", marginRight: "20px" }}>{Trans("_or")}</span>{" "}
                            <button
                              className="btn btn-primary"
                              onClick={() => this.handleContinueAsGuest()}
                            >
                              {Trans("_continueAsGuest")}
                            </button>
                          </React.Fragment>
                        }
                      </div>
                    )
                  )}
              </div>
              <div className="col-lg-3">
                {localStorage.getItem("umrahPackageDetails") &&
                  < Link
                    className="btn btn-primary text-white mb-3 w-100"
                    to="/umrah-package/Details"
                  >
                    Back to Package Detail
                  </Link>
                }
                {!localStorage.getItem("umrahPackageDetails")
                  && Global.getEnvironmetKeyValue("ClearCartOnSearch", "cobrand") === null
                  && <React.Fragment>
                    {
                      Global.getEnvironmetKeyValue("isCart") === true &&
                      ((Global.getEnvironmetKeyValue("portalType") === "B2B" ||
                        Global.getEnvironmetKeyValue("portalType") === "BOTH") ? (
                        <Link
                          className="btn btn-primary text-white mb-3 w-100"
                          to="/Search"
                        >
                          {Trans("_addMoreItems")}
                        </Link>
                      ) : (
                        <Link
                          className="btn btn-primary text-white mb-3 w-100"
                          to="/"
                        >
                          {Trans("_addMoreItems")}
                        </Link>
                      ))
                    }
                  </React.Fragment>
                }
                <PriceBreakup {...cart} /> {/* GSTInfo={this.state.GSTInfo} */}
                {Global.getEnvironmetKeyValue("IsShowTaxInfoSectionOnCart", "cobrand") && cart && cart.items.length > 0 && (cart.items[0].availabilityStatus === 0 || cart.items[0].availabilityStatus === 1) &&
                  <TaxInfo cartItems={cart.items} updateGSTInfo={this.updateGSTInfo} isLoadingTaxInfo={this.state.isLoadingTaxInfo} taxInfoSuccessMessage={this.state.taxInfoSuccessMessage} /> /* handleGSTInfo={this.handleGSTInfo} */
                }
              </div>
            </div>
          )}
        </div>
        {
          this.state.showPopup ? (
            <ModelPopup
              header={this.state.popupTitle}
              content={this.state.popupContent}
              handleHide={this.handleHidePopup}
            />
          ) : null
        }
      </div >
    );
  }
}

export default Cart;
//Sample commit - commit Date Issue check