import React, { Component } from "react";
import CartItem from "./cart-item";
import CartItemAir from "./cart-item-air";
import SVGIcon from "../../helpers/svg-icon";
import Date from "../../helpers/date";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";

class CartItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleCartSection = () => {
    this.setState({
      isShowCart: !this.state.isShowCart,
    });
  };


  render() {
    let umrahDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"));
    let umrahFlightDetails = umrahDetails?.umrahFlightDetails;
    const isTWPackage = this.props.items.filter(x => x.data.business === "package").length > 0
      && this.props.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0;
    let items = isTWPackage ? this.props.items.filter(x => x.data.business === "package") : this.props.items;
    return (
      <React.Fragment>
        {umrahFlightDetails &&
          <React.Fragment>
            <div className="row">
              <div
                className="col-2 pt-3 text-capitalize"
                onClick={() => this.toggleCartSection()}
                style={{ cursor: "pointer" }}
              >
                <SVGIcon name={"air"} type="fill"></SVGIcon> {Trans("_widgetTabair")}
              </div>
              <div
                className="col-4 p-3"
                onClick={() => this.toggleCartSection()}
                style={{ cursor: "pointer" }}
                title={"Arrival - " + umrahFlightDetails.arrivalairportcode + ", Departure - " + umrahFlightDetails.departureairportcode}
              >
                <HtmlParser text={"Arrival - " + umrahFlightDetails.arrivalairportcode + ", Departure - " + umrahFlightDetails.departureairportcode} />
              </div>
              <div
                className="col-3 p-3"
                onClick={() => this.toggleCartSection()}
                style={{ cursor: "pointer" }}
              >
                <React.Fragment>
                  <Date date={umrahFlightDetails.arrivaldate} /> - <Date date={umrahFlightDetails.departuredate} />
                </React.Fragment>
              </div>
              {/* <div className="col-1 p-3 text-right text-nowrap"
              onClick={() => this.toggleCartSection()}
              style={{ cursor: "pointer" }}
              >
                <span>Offline Flight Details</span>
              </div>  */}
              <div className="col-3 p-3 text-right text-nowrap">
                <span className="float-right pl-3">
                  <SVGIcon name={"chevron-" + (this.state.isShowCart ? "up" : "down")}></SVGIcon>
                </span>
                <span
                  className="btn btn-link p-0 m-0 mr-3 text-primary float-right"
                  onClick={() => this.props.history.push(`/umrah-package/Details`)}
                >
                  <SVGIcon
                    name={localStorage.getItem("isUmrahPortal") && localStorage.getItem("umrahPackageDetails") ? "edit" : "times"}
                    width="16"
                    height="16"
                    className="mr-1 text-primary"
                  ></SVGIcon>
                  {localStorage.getItem("isUmrahPortal") && localStorage.getItem("umrahPackageDetails") ? "Change" : Trans("_remove")}
                </span>

              </div>
            </div>
            {this.state.isShowCart && (
              <div className="border bg-white mb-3">
                <div className="row">
                  <div className="col-3 d-inline-block">
                    <SVGIcon width="150" name={"flight1"} type="fill"></SVGIcon>
                  </div>
                  <div className={"col-9 p-3"}>
                    {/* <h5>
                  <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        <HtmlParser text={"Departure : " + umrahFlightDetails.arrivalairportcode + ", " + umrahFlightDetails.departureairportcode} />
                  </h5> */}

                    <ul className="list-unstyled m-0 p-0">

                      <li className="pt-1 pb-1">
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        <span>
                          Departure : {" "}
                        </span>
                        <b>
                          <HtmlParser
                            text={umrahFlightDetails.arrivalairportcode + (umrahFlightDetails.arrivalairportcode === "MED" ? " - Medina Airport, Saudi Arabia" : " - Jeddah Airport, Saudi Arabia")}
                          />
                        </b>
                      </li>
                      <li className="pt-1 pb-1">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        <span>{Trans("_departureDate") + " : "} </span>
                        <b>
                          <Date date={umrahFlightDetails.arrivaldate} />{" "}
                          <Date date={umrahFlightDetails.arrivaldate} format={"LT"} />
                        </b>
                      </li>
                      <li className="pt-1 pb-1">
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2 mt-2"
                        ></SVGIcon>
                        <span>
                          Arrival : {" "}
                        </span>
                        <b>
                          <HtmlParser
                            text={umrahFlightDetails.departureairportcode + (umrahFlightDetails.departureairportcode === "MED" ? " - Medina Airport, Saudi Arabia" : " - Jeddah Airport, Saudi Arabia")}
                          />
                        </b>
                      </li>
                      <li className="pt-1 pb-1">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        <span>{"Arrival Date" + " : "} </span>
                        <b>
                          <Date date={umrahFlightDetails.departuredate} />{" "}
                          <Date date={umrahFlightDetails.departuredate} format={"LT"} />
                        </b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        }
        {items.map((cart, key) => {
          return cart.data.business !== "air" ? (
            <CartItem
              history={this.props.history}
              match={this.props.match}
              cart={cart}
              key={key}
              cartSequenceId={key}
              isLastCart={this.props.items.length === key + 1}
              isRemoveCartLoading={this.props.isRemoveCartLoading}
              removeCartItem={this.props.removeCartItem}
              handleShowSpecialRequest={this.props.handleShowSpecialRequest}
              showVehicletermsCondition={this.props.showVehicletermsCondition}
              specialRequest={this.props.specialRequest}
            />
          ) : (
            <CartItemAir
              history={this.props.history}
              match={this.props.match}
              cart={cart}
              key={key}
              cartSequenceId={key}
              isLastCart={this.props.items.length === key + 1}
              isRemoveCartLoading={this.props.isRemoveCartLoading}
              removeCartItem={this.props.removeCartItem}
              handleAirFareRules={this.props.handleAirFareRules}
              isPaperRateBooking={this.props.isPaperRateBooking}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

export default CartItems;
