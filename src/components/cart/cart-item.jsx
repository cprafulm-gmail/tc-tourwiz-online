import React, { Component } from "react";
import Date from "../../helpers/date";
import ModelPopup from "../../helpers/model";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundTransportation from "../../assets/images/ImageNotFound-Transportation.gif";
import ImageNotFoundGroundservice from "../../assets/images/ImageNotFound-GroundServices.gif";
import ImageNotFoundTransfers from "../../assets/images/ImageNotFound-Transfers.gif";
import ImageNotFoundVehicle from "../../assets/images/ImageNotFound-Vehicle.gif";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import StarRating from "../common/star-rating";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      PolicyHTML: null,
      isShowCart: this.props.isLastCart ? true : false,
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
    if (
      localStorage.getItem("isUmrahPortal") &&
      localStorage.getItem("umrahPackageDetails")
    ) {
      this.props.history.push(`/umrah-package/Details`);
    } else if (this.props.isRemoveCartLoading === null)
      this.props.removeCartItem(cartid);
  };

  render() {
    const isPaymentPage =
      this.props.match.path.toLowerCase().indexOf("/payment") === 0;
    const cart = this.props.cart;
    const name = cart.data.name;
    const url =
      cart.data.business === "vehicle"
        ? cart.data.url !== ""
          ? cart.data.url
          : ""
        : cart.data.images.length > 0 &&
          cart.data.images.find((x) => x.isDefault === true) !== undefined
          ? cart.data.images.find((x) => x.isDefault === true).url
          : "";
    const locationInfo = cart.data.locationInfo.fromLocation;
    const dateInfo = cart.data.dateInfo;
    const rooms = cart.data.items;
    const business = cart.data.business;
    const IsCustomBusiness =
      cart.data.flags.isCustomBusiness == true ? true : false;
    const roomCount = () => {
      var roomCount = 0;
      rooms.map((group) => {
        roomCount += group.item.length;
        return true;
      });
      return roomCount;
    };
    let IsManualItem = cart.data.flags.isManualItem ? true : false;
    const adults = () => {
      if (business === "hotel") {
        if (rooms[0].flags["isGroupedRooms"] === "true")
          return rooms[0].paxInfo[0].item[0].quantity;
        else {
          var adultsCount = 0;
          rooms.map((group) => {
            group.item.map((room) => {
              adultsCount += parseInt(
                room.tpExtension.find((x) => x.key === "adults").value
              );
              return true;
            });
            return true;
          });
          return adultsCount;
        }
      } else if (business === "activity") {
        return rooms[0].item[0].tpExtension.find(x => x.key === "PackageScheduleName")?.value ?? rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
      } else if (business === "package" && IsManualItem) {
        return rooms[0].properties.pax.adult;
      } else if (business === "package" && !IsManualItem) {
        return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
      } else if (business === "transfers") {
        return rooms[0].item[0].tpExtension.find((x) => x.key === "adultCount")
          .value;
      } else return 0;
    };

    const children = () => {
      if (business === "hotel") {
        if (rooms[0].flags["isGroupedRooms"] === "true")
          return rooms[0].paxInfo[0].item[2].quantity;
        else {
          var adultsCount = 0;
          rooms.map((group) => {
            group.item.map((room) => {
              adultsCount += parseInt(
                room.tpExtension.find((x) => x.key === "children").value
              );
              return true;
            });
            return true;
          });
          return adultsCount;
        }
      } else if (business === "activity") {
        return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
      } else if (business === "package" && IsManualItem) {
        return rooms[0].properties.pax.child;
      } else if (business === "package" && !IsManualItem) {
        return rooms[0].properties.pax.adult + rooms[0].properties.pax.child;
      } else return 0;
    };

    const infants = () => {
      if (business === "package" && IsManualItem) {
        return rooms[0].properties.pax.infant;
      } else return 0;
    };

    const isPolicyExist = () => {
      return (
        cart.data.policies.find((x) => x.type !== "CreditCard") !== undefined ||
        cart.data.items.find(
          (x) => x.item.find((y) => y.policies.length > 0) !== undefined
        ) !== undefined
      );
    };

    const cartIconClass = () => {
      return business === "hotel"
        ? "hotel"
        : business === "activity"
          ? "activity"
          : business === "transfers"
            ? "transfers"
            : business === "package"
              ? "package"
              : business === "transportation"
                ? "transportation"
                : business === "vehicle"
                  ? "vehicle"
                  : business === "groundservice"
                    ? "groundservice"
                    : "";
    };
    const getOnErrorImageURL = () => {
      if (business === "hotel")
        return ImageNotFoundHotel.toString();
      else if (business === "activity") {
        return ImageNotFoundActivity.toString();
      } else if (business === "package") {
        return ImageNotFoundPackage.toString();
      } else if (business === "transfers") {
        return ImageNotFoundTransfers.toString();
      } else if (business === "vehicle") {
        return ImageNotFoundVehicle.toString();
      } else if (business === "groundservice") {
        return ImageNotFoundGroundservice.toString();
      }
    };
    let cartSequenceId = this.props.cartSequenceId;
    var specialRequestValue =
      this.props.specialRequest && this.props.specialRequest.length > 0
        ? this.props.specialRequest.find((x) => x.cartItemID === cartSequenceId)
          ?.value
        : "";
    const policies = (
      <React.Fragment>
        {isPolicyExist() && (
          <React.Fragment>
            {cart.data.items.map((item, key) => {
              return (
                <React.Fragment key={key}>
                  {item.item.map((room, key) => {
                    return room.policies.length > 0 ? (
                      <React.Fragment key={key}>
                        <h6>
                          <HtmlParser text={room.name} /> -{" "}
                          {
                            room.tpExtension.find((x) => x.key === "adults")
                              .value
                          }
                          {" " + Trans("_adultsWithBracesSmall") + " "}
                          {
                            room.tpExtension.find((x) => x.key === "children")
                              .value
                          }
                          {" " + Trans("_childrenWithBracesSmall") + " "}
                        </h6>

                        {room.policies.filter(x => x.type === "Cancellation").length > 0 ?
                          <React.Fragment>
                            <h6>{room.policies.filter(x => x.type === "Cancellation")[0].type}</h6>
                            <ul className="pl-3">
                              {room.policies.filter(x => x.type === "Cancellation").map((policy) => {
                                return (<li className="mb-3">{<HtmlParser text={policy.description} />}</li>)
                              })}
                            </ul>
                          </React.Fragment>
                          : null}

                        {room.policies.filter(x => x.type !== "Cancellation" && x.name !== "").length > 0 ?
                          room.policies.map((policy, key) => {
                            return (
                              <React.Fragment key={key}>
                                <h6>{policy.type}</h6>
                                <ul className="pl-3">
                                  <li className="mb-3">
                                    <HtmlParser text={policy.description} />
                                  </li>
                                </ul>
                              </React.Fragment>
                            );
                          })
                          : null}
                      </React.Fragment>
                    ) : null;
                  })}
                </React.Fragment>
              );
            })}

            {cart.data.policies
              .filter((x) => x.isItemLevel === false)
              .map((item, key) => {
                return (
                  item.type !== "CreditCard" && item.type !== "Cancellation" && (
                    <React.Fragment key={key}>
                      <h6 className="text-capitalize">{item.type}</h6>
                      <ul className="pl-3">
                        <li className="mb-3" key={key}>
                          <HtmlParser text={item.description} />
                        </li>
                      </ul>
                    </React.Fragment>
                  )
                );
              })}

            {cart.data.policies
              .filter((x) => x.isItemLevel === false && x.type === "Cancellation").length > 0 ?
              (
                <React.Fragment>
                  <h6 className="text-capitalize">{cart.data.policies
                    .filter((x) => x.isItemLevel === false && x.type === "Cancellation")[0].type}</h6>
                  <ul className="pl-3">
                    {cart.data.policies.filter(x => x.type === "Cancellation").map((policy) => {
                      return (<li className="mb-3">
                        <HtmlParser text={policy.description} />
                      </li>)
                    })}

                  </ul>
                </React.Fragment>
              )
              :
              null
            }
          </React.Fragment>
        )}
        {!isPolicyExist() && (
          <React.Fragment>{Trans("_noPolicyFound")}</React.Fragment>
        )}
      </React.Fragment>
    );

    let isexcursionDiffDate = false;
    if ((business === "activity" ||
      business === "package" ||
      business === "transportation" ||
      business === "groundservice")
      && dateInfo.startDate !== dateInfo.endDate && dateInfo.endDate !== "0001-01-01T05:30:00") {
      isexcursionDiffDate = true;
    }
    if (business === "package" && dateInfo.startDate === dateInfo.endDate && dateInfo.endDate !== "0001-01-01T05:30:00") {
      isexcursionDiffDate = true;
    }

    return (
      <React.Fragment>
        <div className="row cart-items-grid">
          <div
            className="col-2 pt-3 text-capitalize"
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
          >
            <SVGIcon name={cartIconClass()} type="fill"></SVGIcon>{" "}
            {Trans(
              "_widgetTab" +
              (business == "activity" && IsCustomBusiness
                ? "custom"
                : business)
            )}
          </div>
          <div
            className="col-4 p-3"
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
            title={name}
          >
            <HtmlParser
              text={name.length > 25 ? name.substring(0, 25) + "..." : name}
            />{" "}
            {business === "hotel" ? (
              <StarRating {...[this.props.cart.data.rating]} />
            ) : (
              ""
            )}
          </div>
          <div
            className="col-3 p-3"
            onClick={() => this.toggleCartSection()}
            style={{ cursor: "pointer" }}
          >
            {(business === "hotel" || business === "vehicle") && (
              <React.Fragment>
                <Date date={dateInfo.startDate} /> -{" "}
                <Date date={dateInfo.endDate} />
              </React.Fragment>
            )}

            {(business === "activity") && cart.data.dateInfo.startDate === cart.data.dateInfo.endDate && (
              <Date date={cart.data.dateInfo.startDate} />

            )}
            {(business === "package") && cart.data.dateInfo.startDate === cart.data.dateInfo.endDate && (
              <React.Fragment>
                <Date date={cart.data.dateInfo.startDate} /> - {" "}
                <Date date={cart.data.dateInfo.endDate} />
              </React.Fragment>
            )}
            {(business === "activity" || business === "package") && cart.data.dateInfo && cart.data.dateInfo.startDate && cart.data.dateInfo.endDate && cart.data.dateInfo.startDate !== cart.data.dateInfo.endDate && (
              <React.Fragment>
                <Date date={cart.data.dateInfo.startDate} /> - {" "}
                < Date date={cart.data.dateInfo.endDate} />
              </React.Fragment>
            )}

            {business === "transfers" && (
              <React.Fragment>
                <Date date={cart.data.items[0].item[0].dateInfo.startDate} />
                {/* {this.props.cart.data.tripType !== "oneway" ? " - " : ""}
                  {this.props.cart.data.tripType !== "oneway" ? (
                    <Date date={cart.data.items[0].item[0].dateInfo.startDate} />
                  ) : (
                    ""
                  )} */}
              </React.Fragment>
            )}

            {(business === "transportation" ||
              business === "groundservice") && (
                <React.Fragment>
                  <Date date={dateInfo.startDate} />
                </React.Fragment>
              )}
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
                    <SVGIcon
                      name={
                        localStorage.getItem("isUmrahPortal") &&
                          localStorage.getItem("umrahPackageDetails")
                          ? "edit"
                          : "times"
                      }
                      width="16"
                      height="16"
                      className="mr-1 text-primary"
                    ></SVGIcon>
                  )}
                {localStorage.getItem("isUmrahPortal") &&
                  localStorage.getItem("umrahPackageDetails")
                  ? "Change"
                  : Trans("_remove")}
              </span>
            )}
          </div>
        </div>
        {this.state.isShowCart && (
          <div
            className={"border bg-white mb-3 cart-item-" + (business || "none")}
          >
            <div className="row">
              <div className="col-lg-3 d-inline-block cart-item-img">
                <img
                  className={"img-fluid img-fluid-" + business}
                  style={
                    business === "groundservice"
                      ? { "object-fit": "contain" }
                      : {}
                  }
                  src={
                    business === "transportation"
                      ? ImageNotFoundTransportation
                      : url
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getOnErrorImageURL();
                  }}
                  alt=""
                />
              </div>
              <div
                className={
                  business === "vehicle"
                    ? "col-lg-5 p-3 cart-item-details"
                    : "col-lg-9 p-3 cart-item-details"
                }
              >
                <h5>
                  <HtmlParser text={name} />{" "}
                  {business === "hotel" ? (
                    <StarRating {...[this.props.cart.data.rating]} />
                  ) : (
                    ""
                  )}
                </h5>
                {business === "vehicle" && (
                  <ul className="list-unstyled m-0 p-0">
                    <li className="pt-1 pb-1">
                      <span>{Trans("_category")}</span>
                      <HtmlParser text={" " + cart.data.category} />
                    </li>
                  </ul>
                )}
                <ul className="list-unstyled m-0 p-0">
                  {(business === "activity" || business === "custom") && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name={"activity"} type="fill"></SVGIcon>{" "}
                      <span>
                        {"Schedule Name : "}
                      </span>
                      <b>
                        <HtmlParser
                          text={cart.data.items[0].item[0].name}
                        />
                      </b>
                    </li>
                  )}
                  {business != "vehicle" && business != "transfers" && (locationInfo.id !== "Unnamed" || "") && (
                    <li className="pt-1 pb-1">
                      <SVGIcon
                        name="map-marker"
                        width="16"
                        type="fill"
                        height="16"
                        className="mr-2"
                      ></SVGIcon>
                      <span>
                        {Trans(
                          business === "transportation"
                            ? "_widgettransportationRoute"
                            : "_location"
                        ) + " : "}
                      </span>
                      <b>
                        <HtmlParser
                          text={
                            business === "transportation"
                              ? cart.data.stopInfo[0].item[0].name
                              : locationInfo.address && locationInfo.address !== ""
                                ? locationInfo.address + (locationInfo.city && " , " + locationInfo.city)
                                : "" + locationInfo.city
                          }
                        />
                      </b>
                    </li>
                  )}
                  {business === "transfers" && (locationInfo.name !== "" || undefined) && (
                    <li className="pt-1 pb-1">
                      <SVGIcon
                        name="map-marker"
                        width="16"
                        type="fill"
                        height="16"
                        className="mr-2"
                      ></SVGIcon>
                      <span>
                        {Trans(
                          business === "transportation"
                            ? "_widgettransportationRoute"
                            : "_location"
                        ) + " : "}
                      </span>
                      <b>
                        <HtmlParser text={locationInfo.name} />
                      </b>
                    </li>
                  )}
                  {business === "transfers" &&
                    cart.data.tripType === "roundtrip" && (
                      <li className="pt-1 pb-1">
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          type="fill"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        <span>{Trans("_viewTripType") + " : "}</span>
                        <b>
                          <HtmlParser
                            text={Trans("_airTripDirection_Roundtrip")}
                          />
                        </b>
                      </li>
                    )}
                  {business != "vehicle" && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name="clock" className="mr-2"></SVGIcon>
                      {business === "hotel" && (
                        <span>{Trans("_checkIn") + " : "} </span>
                      )}
                      {(business === "activity" ||
                        business === "package" ||
                        business === "transfers" ||
                        business === "transportation" ||
                        business === "groundservice") && !isexcursionDiffDate && (
                          <span>{Trans("_" + business + "Date") + " : "} </span>
                        )}

                      {(business === "activity" ||
                        business === "package" ||
                        business === "transfers" ||
                        business === "transportation" ||
                        business === "groundservice") && isexcursionDiffDate && (
                          <span>{Trans("_startDate") + " : "} </span>
                        )}

                      <b>
                        <Date date={dateInfo.startDate} />{" "}
                        {dateInfo.startTime &&
                          dateInfo.startTime !== "" &&
                          Date({
                            date: "1901-01-01T" + dateInfo.startTime,
                            format: "LT",
                          }) !== "Invalid date" && (
                            <Date
                              date={"1901-01-01T" + dateInfo.startTime}
                              format={"LT"}
                            />
                          )}
                      </b>
                    </li>
                  )}
                  {business != "vehicle" && (business === "activity" ||
                    business === "package" ||
                    business === "transfers" ||
                    business === "transportation" ||
                    business === "groundservice" || business === "custom") && isexcursionDiffDate && (
                      <li className="pt-1 pb-1">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        <span>{Trans("_endDate") + " : "} </span>

                        <b>
                          <Date date={dateInfo.endDate} />{" "}
                        </b>
                      </li>
                    )}

                  {business === "transfers" &&
                    cart.data.tripType === "roundtrip" && (
                      <li className="pt-1 pb-1">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        <span>{Trans("_transfersreturnDate")} : </span>{" "}
                        <b>
                          <Date date={dateInfo.endDate} />{" "}
                          {dateInfo.endTime &&
                            dateInfo.endTime !== "" &&
                            Date({
                              date: "1901-01-01T" + dateInfo.endTime,
                              format: "LT",
                            }) !== "Invalid date" && (
                              <Date
                                date={"1901-01-01T" + dateInfo.endTime}
                                format={"LT"}
                              />
                            )}
                        </b>
                      </li>
                    )}
                  {business === "hotel" && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name="clock" className="mr-2"></SVGIcon>
                      <span>{Trans("_checkOut")} : </span>{" "}
                      <b>
                        <Date date={dateInfo.endDate} />{" "}
                        {dateInfo.endTime &&
                          dateInfo.endTime !== "" &&
                          Date({
                            date: "1901-01-01T" + dateInfo.endTime,
                            format: "LT",
                          }) !== "Invalid date" && (
                            <Date
                              date={"1901-01-01T" + dateInfo.endTime}
                              format={"LT"}
                            />
                          )}
                      </b>
                    </li>
                  )}
                  {business === "package" &&
                    cart.data.tpExtension.find((x) => x.key === "duration") &&
                    cart.data.tpExtension.find((x) => x.key === "duration")
                      .value !== "" && (
                      <li className="pt-1 pb-1">
                        <SVGIcon name="clock" className="mr-2"></SVGIcon>
                        <span>{Trans("_duration")} :</span>{" "}
                        <b>
                          {
                            cart.data.tpExtension.find(
                              (x) => x.key === "duration"
                            ).value
                          }
                        </b>
                      </li>
                    )}
                  {business === "hotel" && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name="user-alt" className="mr-2"></SVGIcon>
                      <span>{Trans("_rooms") + " : "}</span>{" "}
                      <b>{roomCount()}</b>
                      <span className="ml-3">
                        {Trans("_adultsWithBracesSmall") + " : "}
                      </span>{" "}
                      <b>{adults()}</b>
                      <span className="ml-3">
                        {Trans("_childrenWithBracesSmall") + " : "}
                      </span>{" "}
                      <b>{children()}</b>
                    </li>
                  )}
                  {business === "hotel" && cart.data?.config?.find(x => x.key === "MealType")?.value &&
                    <li className="pt-1 pb-1">
                      <SVGIcon name="meal" className="mr-2"></SVGIcon>
                      <span>{Trans("Meal") + " : "}</span>{" "}
                      <b>{cart.data?.config?.find(x => x.key === "MealType")?.value}</b>
                    </li>
                  }
                  {(business === "activity" ||
                    (business === "package" && !IsManualItem) ||
                    business === "transfers") &&
                    !(business == "activity" && IsCustomBusiness) && (
                      <li className="pt-1 pb-1">
                        <SVGIcon name="user-alt" className="mr-2"></SVGIcon>
                        <span>{rooms[0].item[0].tpExtension.find(x => x.key === "PackageScheduleName")?.value
                          ? "Guest & Rooms : "
                          : Trans("_personsWithBraces") + " : "} </span>{" "}
                        <b>{adults()}</b>
                      </li>
                    )}

                  {business === "package" && IsManualItem && (
                    <React.Fragment>
                      <li className="pt-1 pb-1">
                        <SVGIcon name="user-alt" className="mr-2"></SVGIcon>
                        <span>{Trans("_viewAdults") + " : "} </span>{" "}
                        <b>{adults()}</b>{", " + Trans("_viewChildren") + " : "}<b>{children()}</b>{", " + Trans("_viewInfant") + " : "}<b>{infants()}</b>
                      </li>
                    </React.Fragment>
                  )}

                  {business === "groundservice" && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name="user-alt" className="mr-2"></SVGIcon>
                      <span>{Trans("_personsWithBraces") + " : "} </span>{" "}
                      <b>{cart.data.paxInfo[0].quantity}</b>
                    </li>
                  )}
                  {business === "transportation" && (
                    <li className="pt-1 pb-1">
                      <SVGIcon name="bus-alt" className="mr-2"></SVGIcon>
                      <span>
                        {Trans("_widgettransportationNoOfVehicle")} :{" "}
                      </span>
                      <b className="mr-3">
                        {cart.data.items[0].item.reduce(
                          (sum, item) => sum + parseInt(item.quantity),
                          0
                        )}
                      </b>
                      <SVGIcon name="user-alt" className="mr-2"></SVGIcon>
                      <span>{Trans("_lblTravelers")} : </span>
                      <b>
                        {cart.data.items[0].item.reduce(
                          (sum, item) => sum + parseInt(item.availabilityCount),
                          0
                        )}
                      </b>
                    </li>
                  )}
                </ul>
                {business == "vehicle" && (
                  <div>
                    <div>
                      <ul className="list-unstyled">
                        {cart.data.tpExtension.find(
                          (x) => x.key === "passengerQuantity"
                        ) !== undefined && (
                            <li title="Passenger quantity">
                              <i
                                className="fa fa-user mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>
                                x
                                {
                                  cart.data.tpExtension.find(
                                    (x) => x.key === "passengerQuantity"
                                  ).value
                                }
                              </span>
                            </li>
                          )}
                        {cart.data.tpExtension.find(
                          (x) => x.key === "doorCount"
                        ) !== undefined && (
                            <li title="Doors quantity">
                              <i
                                className="fa fa-user mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>
                                x
                                {
                                  cart.data.tpExtension.find(
                                    (x) => x.key === "doorCount"
                                  ).value
                                }
                              </span>
                            </li>
                          )}
                        {cart.data.flags.isAirConditionAvailable !==
                          undefined &&
                          cart.data.flags.isAirConditionAvailable === true && (
                            <li title="Air Conditioning">
                              <i
                                className="fa fa-user mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>{Trans("_yes")}</span>
                            </li>
                          )}
                        {cart.data.flags.isAirConditionAvailable !==
                          undefined &&
                          cart.data.flags.isAirConditionAvailable === false && (
                            <li title="Air Conditioning">
                              <i
                                className="fa fa-user mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>{Trans("_no")}</span>
                            </li>
                          )}
                        {cart.data.tpExtension.find(
                          (x) => x.key === "transmissionType"
                        ) !== undefined && (
                            <li
                              title={
                                cart.data.tpExtension.find(
                                  (x) => x.key === "transmissionType"
                                ).value + " Transmission"
                              }
                            >
                              <i
                                className="fa fa-user mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>
                                {
                                  cart.data.tpExtension.find(
                                    (x) => x.key === "transmissionType"
                                  ).value
                                }
                              </span>
                            </li>
                          )}
                        {cart.data.tpExtension.find(
                          (x) => x.key === "baggageQuantity"
                        ) !== undefined && (
                            <li title="Baggage Quantity">
                              <i
                                className="fa fa-suitcase mr-2"
                                aria-hidden="true"
                              ></i>
                              <span>
                                {
                                  cart.data.tpExtension.find(
                                    (x) => x.key === "baggageQuantity"
                                  ).value
                                }
                              </span>
                            </li>
                          )}
                      </ul>
                    </div>
                  </div>
                )}
                {business === "vehicle" && (
                  <button
                    className="btn btn-link p-0 m-0 mr-3 pull-right text-primary"
                    onClick={() =>
                      this.props.showVehicletermsCondition(
                        cart.data.token,
                        this.props.cartSequenceId
                      )
                    }
                  >
                    <SVGIcon name="info" type="fill" className="mr-1"></SVGIcon>
                    {Trans("_bookingTerms")}
                  </button>
                )}
                {business !== "vehicle" && cart.data.config.find(x => x.key === "isOfflineItinerary")?.value === undefined && (
                  <button
                    className="btn btn-link p-0 m-0 mr-3 pull-right text-primary"
                    onClick={() => this.handleShow(policies)}
                  >
                    <SVGIcon name="info" type="fill" className="mr-1"></SVGIcon>
                    {Trans("_bookingTerms")}
                  </button>
                )}
                {!isPaymentPage && business === "hotel" && cart.data.config.find(x => x.key === "isOfflineItinerary")?.value === undefined && (
                  <button
                    className={
                      specialRequestValue !== ""
                        ? "btn btn-link p-0 m-0 mr-3 pull-right text-success"
                        : "btn btn-link p-0 m-0 mr-3 pull-right text-primary"
                    }
                    onClick={() =>
                      this.props.handleShowSpecialRequest(
                        this.props.cartSequenceId
                      )
                    }
                  >
                    <SVGIcon name="info" type="fill" className="mr-1"></SVGIcon>
                    {Trans("_specialRequest")}
                  </button>
                )}
              </div>
              {business === "vehicle" && (
                <div className="col-lg-4 p-3 border-left cart-item-details">
                  <div>
                    <h6>{Trans("PriceIncludesLabel")}</h6>
                    <ul className="list-unstyled">
                      {cart.data.amenities.length === 0 && (
                        <li>
                          <span>{Trans("_noinclusions")}</span>
                        </li>
                      )}
                      {cart.data.amenities.length > 0 &&
                        cart.data.amenities.map((item, cnt) => {
                          if (cnt <= 1) {
                            return (
                              <li>
                                <i
                                  className="fa fa-check-square mr-2"
                                  aria-hidden="true"
                                ></i>
                                <span>{Trans("_Free") + " " + item.name}</span>
                              </li>
                            );
                          }
                        })}
                    </ul>
                  </div>
                  {cart.data.amenities.length > 2 && (
                    <React.Fragment>
                      <div
                        className="p-0 m-0 btn-link text-primary popup-toggle"
                        style={{ cursor: "pointer" }}
                      >
                        {Trans("_morelabel")}
                        <ul
                          className="border m-0 p-3 list-unstyled small text-secondary position-absolute bg-light rounded shadow-sm"
                          style={{
                            right: "67px",
                            top: "110px",
                            display: "none",
                            zIndex: "100",
                          }}
                        >
                          {cart.data.amenities.length > 0 &&
                            cart.data.amenities.map((item) => {
                              return (
                                <li>
                                  <i
                                    className="fa fa-check-square mr-2"
                                    aria-hidden="true"
                                  ></i>
                                  <span>
                                    {Trans("_Free") + " " + item.name}
                                  </span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {this.state.showPopup ? (
          <ModelPopup
            header={Trans("_bookingTermsPopupTitle")}
            content={this.state.PolicyHTML}
            handleHide={this.handleHide}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default CartItem;
