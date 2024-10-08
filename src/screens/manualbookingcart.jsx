import React from "react";
import { Link } from "react-router-dom";
import CartItems from "../components/cart/cart-items";
import PriceBreakup from "../components/cart/price-breakup";
import CartLoading from "../components/cart/cart-loading";
import Travellers from "../components/cart/travellers";
import TravellersManualBooking from "../components/cart/travellers-manualbooking";
import BookingSteps from "../components/common/booking-steps";
import ModelPopup from "../helpers/model";
import CartBase from "../base/cart-base";
import { Trans } from "../helpers/translate";
import * as Global from "../helpers/global";

class ManualBookingCart extends CartBase {
  constructor(props) {
    super(props);
    this.state = {
      page: "manualbookingcart",
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
    };
    if (sessionStorage.getItem("callCenterType") !== undefined && (sessionStorage.getItem("callCenterType") === "Customer" || sessionStorage.getItem("callCenterType") === "Agent")) {
      this.getPersonateDetails();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.viewCart();
  }

  setuserInfoForTourwiz = () => {
    if (localStorage.getItem("quotationDetails") !== undefined && localStorage.getItem("quotationDetails") !== null) {
      let localUserInfo = JSON.parse(localStorage.getItem("quotationDetails"));
      return {
        firstName: localUserInfo.customerName.split(' ')[0],
        lastName: localUserInfo.customerName.replace(localUserInfo.customerName.split(' ')[0] + " ", ''),
        contactInformation: {
          email: localUserInfo.email,
          phoneNumberCountryCode: "+" + localUserInfo.phone.split('-')[0],
          phoneNumber: localUserInfo.phone.replace(localUserInfo.phone.split('-')[0] + "-", '')
        }
      }
    }
  }

  render() {
    const { cart, isLoading, personateDetails } = this.state;
    const { isLoggedIn, isLoginMenu } = this.props;
    let { userInfo } = this.props;
    if (userInfo.firstName === "" && userInfo.lastName === "" && localStorage.getItem("quotationDetails") !== undefined) {
      userInfo = this.setuserInfoForTourwiz();
    }
    else if (cart && cart.items.length === 1 && cart.items[0].data.business === 'package') {
      let bookingForInfo = JSON.parse(sessionStorage.getItem("bookingForInfo"));
      userInfo = {
        firstName: bookingForInfo.firstName.split(' ')[0],
        lstName: bookingForInfo.firstName.split(' ')[0],
        contactInformation: {
          email: bookingForInfo.contactInformation.email,
          phoneNumberCountryCode: bookingForInfo.contactInformation.phoneNumber.split('-')[0],
          phoneNumber: bookingForInfo.contactInformation.phoneNumber.split('-')[1]
        }
      }
    }
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
        if (cart.items[count].availabilityStatus === 3 && available === 0) {
          tempAvailabilityStatus = true;
        }
        else {
          available = available + 1;
          tempAvailabilityStatus = false;
        }
        return true;
      });
    }
    return (
      <div className="cart">
        <BookingSteps isLoggedIn={isLoggedIn} />
        {!localStorage.getItem("cartLocalId") ?
          <div class="container">
            <div class="row mt-4">
              <div class="col-lg-12">
                <div class="row cart-items-grid">
                  <div class="col-12 pt-3 text-center text-primary">
                    No item(s) in cart.
                  </div>
                </div>
              </div>
            </div>
          </div>
          : <div className="container">
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
                  />

                  {this.renderCartAvailabilityChanged()}

                  {isLoggedIn || this.state.continueAsGuest ? sessionStorage.getItem("callCenterType") !== undefined && (sessionStorage.getItem("callCenterType") === "Customer" || sessionStorage.getItem("callCenterType") === "Agent") && personateDetails === null ? "" : (
                    <div className="mt-3">
                      <TravellersManualBooking
                        {...cart}
                        handleAddTravellers={this.addTravellers}
                        userInfo={userInfo}
                        continueAsGuest={this.state.continueAsGuest}
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
                        {/* {" "} <span style={{ marginLeft: "20px", marginRight: "20px" }}>{Trans("_or")}</span>{" "}
                          <button
                            className="btn btn-primary"
                            onClick={() => this.handleContinueAsGuest()}
                          >
                            {Trans("_continueAsGuest")}
                          </button> */}
                      </div>
                    )
                  )}
                </div>
                <div className="col-lg-3">
                  <PriceBreakup {...cart} />
                </div>
              </div>
            )}
          </div>}
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.handleHidePopup}
          />
        ) : null}
      </div>
    );
  }
}

export default ManualBookingCart;
