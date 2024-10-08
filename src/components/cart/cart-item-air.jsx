import React, { Component } from "react";
import Date from "../../helpers/date";
import DateComp from "../../helpers/date";
import Stops from "../common/stops";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import ImageNotFoundFlight from "../../assets/images/image-not-found-flight.png";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      PolicyHTML: null,
      isShowCart: this.props.isLastCart ? true : false,
      fareRules: null,
    };
  }

  toggleCartSection = () => {
    this.setState({
      isShowCart: !this.state.isShowCart,
    });
  };

  handleShow = (PolicyHTML) => {
    this.setState({
      showPopup: true,
      PolicyHTML: PolicyHTML,
    });
  };

  handleHide = () => {
    this.setState({
      showPopup: false,
    });
  };

  removeCartItem = (cartid) => {
    if (this.props.isRemoveCartLoading === null)
      this.props.removeCartItem(cartid);
  };

  render() {
    const isPaymentPage =
      this.props.match.path.toLowerCase().indexOf("/payment") === 0;
    const cart = this.props.cart;
    const business = cart.data.business;
    const name = cart.data.items[0].locationInfo;
    name.fromLocation = name.fromLocation || name.FromLocation;
    name.toLocation = name.toLocation || name.ToLocation;

    const cartIconClass = () => {
      return business === "hotel"
        ? "hotel"
        : business === "activity"
          ? "globe"
          : business === "package"
            ? "gift"
            : business === "air"
              ? "plane"
              : "";
    };

    const getOnErrorImageURL = () => {
      return ImageNotFoundFlight.toString();
    };

    const tripLocation =
      cart.data.tripType === "multicity"
        ? cart.data.items.reduce((sum, item) => sum + (sum === "" ? "" : ", ") + item.locationInfo.fromLocation.id + " - " + item.locationInfo.toLocation.id, "")
        : name.fromLocation.id + " - " + name.toLocation.id + (cart.data.tripType === "roundtrip" ? " - " + name.fromLocation.id : "")

    const detailsDetails =
      cart.data.tripType === "multicity"
        ? cart.data.items.reduce((sum, item) => sum + (sum === "" ? "" : ", ") + DateComp({ date: item.dateInfo.startDate }) + " - " + DateComp({ date: item.dateInfo.endDate }), "")
        : (DateComp({ date: this.props.cart.data?.items[0]?.dateInfo?.startDate })
          + (this.props.cart.data.tripType !== "oneway" ? " - " + DateComp({ date: this.props.cart.data?.items[1]?.dateInfo?.startDate }) : ""))
    return (
      <React.Fragment>
        <div className="row">
          <div
            className="col-2 pt-3 text-capitalize"
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
          >
            <SVGIcon name={cartIconClass()} type="fill"></SVGIcon>{" "}
            {Trans("_widgetTab" + business)}
          </div>
          <div
            className="col-4 p-3"
            onClick={() => this.toggleCartSection()}
            title={tripLocation}
            style={{
              cursor: "pointer",
              "overflow": "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis"
            }}
          >
            {tripLocation.replaceAll("&amp;", "&")}
          </div>
          <div
            className="col-3 p-3"
            onClick={() => this.toggleCartSection()}
            title={detailsDetails}
            style={{
              cursor: "pointer",
              "overflow": "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis"
            }}
          >
            {detailsDetails}
          </div>
          <div
            className={
              "col-" +
              (isPaymentPage ? "2" : "1") +
              " p-3 text-right text-nowrap"
            }
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
          >
            <Amount amount={cart.data.amount}></Amount>
          </div>
          <div
            className={"col-" + (isPaymentPage ? "1" : "2") + " p-3 "}
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
          >
            <span className="float-right pl-3">
              <SVGIcon
                name={"chevron-" + (this.state.isShowCart ? "up" : "down")}
              ></SVGIcon>
            </span>
            {Global.getEnvironmetKeyValue("isCart") && !isPaymentPage && (
              <span
                className="btn btn-link p-0 m-0 mr-3 text-primary float-right"
                onClick={() => this.removeCartItem(this.props.cartSequenceId)}
              >
                {this.props.isRemoveCartLoading !== null &&
                  this.props.isRemoveCartLoading ===
                  this.props.cartSequenceId && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                {(this.props.isRemoveCartLoading === null ||
                  this.props.isRemoveCartLoading !==
                  this.props.cartSequenceId) && (
                    <SVGIcon name="times" className="mr-1 text-primary"></SVGIcon>
                  )}
                {Trans("_remove")}
              </span>
            )}
          </div>
        </div>
        {this.state.isShowCart && (
          <div className="border bg-white mb-3 cart-item-air">
            <div className="row">
              <div className="col-lg-12">
                <ul className="list-unstyled m-0">
                  {cart.data.items.map((item, itemKey) => {
                    const loc = item.locationInfo;
                    loc.fromLocation = loc.fromLocation || loc.FromLocation;
                    loc.toLocation = loc.toLocation || loc.ToLocation;
                    loc.fromLocation.id =
                      loc.fromLocation.id || loc.FromLocation.id;
                    loc.fromLocation.id =
                      loc.fromLocation.id || loc.FromLocation.id;
                    loc.toLocation.id = loc.toLocation.id || loc.ToLocation.id;
                    loc.toLocation.id = loc.toLocation.id || loc.ToLocation.id;

                    const date = item.dateInfo;
                    const stopCount = item.item[0].stops || item.item.length - 1;
                    const stops =
                      stopCount === 0
                        ? Trans("_airNonStop")
                        : stopCount === 1
                          ? stopCount + " " + Trans("_airStop")
                          : stopCount + " " + Trans("_airStops");
                    const duration =
                      (item.tpExtension.find((x) => x.key === "durationHours")
                        .value === "-1" ? 0 : item.tpExtension.find((x) => x.key === "durationHours")
                        .value) +
                      "h " +
                      (item.tpExtension.find((x) => x.key === "durationMinutes")
                        .value === "-1" ? 0 : item.tpExtension.find((x) => x.key === "durationMinutes")
                        .value) +
                      "m";
                    const url = item.item[0].images?.find(
                      (x) => x.type === "default"
                    )?.url;

                    const airline = item.item[0].vendors[0].item.name;
                    const airlineCode = item.item[0].code;

                    const cabinClass =
                      item.item[0].tpExtension.find(
                        (x) => x.key === "cabinClass"
                      ) &&
                      item.item[0].tpExtension.find(
                        (x) => x.key === "cabinClass"
                      ).value;

                    return (
                      <li className="border-bottom p-3" key={itemKey}>
                        <div className="row">
                          <div className="col-lg-1 d-flex justify-content-center align-items-center flex-column cart-item-air-trip">
                            <div
                              className="position-absolute bg-light small p-2 w-100 text-center"
                              style={{
                                transform: "rotate(270deg)",
                                left: "-22px",
                              }}
                            >
                              {cart.data.items.length > 2 ? "Trip " + (itemKey + 1) : itemKey === 0
                                ? Trans("_airDeparture")
                                : Trans("_airReturn")}
                            </div>
                          </div>
                          <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column cart-item-air-logo">
                            <img className="img-fluid" src={url} alt="" onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getOnErrorImageURL();
                            }} />
                            <span className="small text-secondary mt-2 text-nowrap">
                              {airline.replaceAll("&amp;", "&") + " " + airlineCode.replaceAll("&amp;", "&")}
                            </span>
                            <span className="small text-secondary text-nowrap">
                              {cabinClass.replaceAll("&amp;", "&")}
                            </span>
                          </div>
                          <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                            <span className="small text-secondary">
                              {loc.fromLocation.id.replaceAll("&amp;", "&")}
                            </span>

                            <b>
                              <Date date={date.startDate} format="shortTime" />
                            </b>

                            <span className="small text-secondary">
                              <Date
                                date={date.startDate}
                                format={Global.getEnvironmetKeyValue(
                                  "DisplayDateFormate"
                                )}
                              />
                            </span>
                          </div>
                          <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                            <Stops {...[stopCount]} />
                            <span className="small mt-1">
                              {Trans(
                                "_" +
                                stops
                                  .replace(" ", "")
                                  .replace(" ", "")
                                  .toLowerCase()
                              )}
                            </span>
                          </div>
                          <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
                            <span className="small text-secondary">
                              {loc.toLocation.id.replaceAll("&amp;", "&")}
                            </span>

                            <b>
                              <Date date={date.endDate} format="shortTime" />
                            </b>

                            <span className="small text-secondary">
                              <Date
                                date={date.endDate}
                                format={Global.getEnvironmetKeyValue(
                                  "DisplayDateFormate"
                                )}
                              />
                            </span>
                          </div>
                          <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
                            <span className="small text-nowrap">
                              <SVGIcon
                                name="clock"
                                className="mr-1 text-secondary"
                              ></SVGIcon>
                              {duration}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {cart.data.config.find(x => x.key === "isOfflineItinerary")?.value === undefined && !this.props.isPaperRateBooking &&
                <div className="col-lg-12">
                  <button
                    onClick={() =>
                      this.props.handleAirFareRules(
                        this.props.cartSequenceId,
                        cart.data
                      )
                    }
                    className="btn  btn-link text-primary pull-right"
                  >
                    {Trans("_priceRules")}
                  </button>
                </div>
              }
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default CartItem;
