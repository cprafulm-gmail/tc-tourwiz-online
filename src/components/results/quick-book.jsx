import React, { Component } from "react";
import Loader from "../common/loader";
import Rooms from "../details/rooms";
import Amenities from "../details/amenities";
import OverView from "../details/overview";
import AllAmenities from "../details/all-amenities";
import ImageSlider from "../details/image-slider";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";
import SVGIcon from "../../helpers/svg-icon";
import HtmlParser from "../../helpers/html-parser";
import * as Global from "../../helpers/global";
import Schedule from "../details/schedule";
import Schedulevehicle from "../details/schedule-vehicle"
import InclusionsExcusions from "./../details/inclusions-excusions";
import RulesRegulations from "./../details/rules-regulations";
import ItineraryDetails from "./../details/itenary-details";
import Date from "../../helpers/date";

class QuickBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "availability",
      isBtnLoading: false,
      data:
        this.props.businessName === "transportation"
          ? this.transportationgetJsonData(this.props.details)
          : this.props.businessName === "groundservice"
            ? this.groundservicegetJsonData(this.props.details)
            : null,
      isErrorMessage: false,
    };
  }

  changeTabs = (tab) => {
    this.setState({
      tab,
    });
  };

  groundservicegetJsonData = (details) => {
    let jsonData = details.items[0].item.map((item) => {
      return {
        id: item.id,
        code: item.code,
        specialRequests: !item.specialRequests
          ? []
          : item.specialRequests
            .find((x) => x.categoryName === "additionalServices")
            .specialRequestItems.map((sp) => {
              return {
                id: sp.id,
                amount: sp.displayCharges.find((x) => x.purpose === "10")
                  .amount,
                currencyCode: sp.displayCharges.find((x) => x.purpose === "10")
                  .currencyCode,
                name: sp.name,
                duration: sp.duration
              };
            }),
      };
    });
    return jsonData;
  };

  //Transportation Method
  transportationgetJsonData = (details) => {
    let jsonData = details.items[0].item.map((item) => {
      return {
        id: item.id,
        code: item.code,
        vehicle: 0,
        pax: 0,
        amount:
          item.displayRateInfo.find((x) => x.purpose === "10").amount
        ,
        specialRequests: !item.specialRequests
          ? []
          : item.specialRequests
            .find((x) => x.categoryName === "additionalServices")
            .specialRequestItems.map((sp) => {
              return {
                id: sp.id,
                amount: sp.displayCharges.find((x) => x.purpose === "10")
                  .amount,
                isSelected: false,
              };
            }),
      };
    });
    return jsonData;
  };

  //Transportation Method
  handleTransportationSelection = (mode, id, value) => {
    let data = this.state.data;
    if (mode === "quantity") data.find((x) => x.id === id).vehicle = value;
    else if (mode === "availabilityCount")
      data.find((x) => x.id === id).pax = value;
    this.setState({ data });
  };

  //Transportation Method
  getTransportationAmount = (data, id) => {
    if (data.length === 0) return 0;
    else {
      let vehicleData = data.filter((x) => x.id === id)[0];
      let amount =
        vehicleData.amount *
        (parseInt(vehicleData.vehicle) === 0 ? 1 : vehicleData.vehicle);
      return amount;
    }
  };

  handleCart = (id, code) => {

    if (this.props.businessName === "transportation") {
      var data = this.state.data.reduce(
        (sum, item) =>
        (sum = {
          vehicle: sum.vehicle + parseInt(item.vehicle),
          pax:
            sum.pax + (parseInt(item.vehicle) > 0 ? parseInt(item.pax) : 0),
        }),
        { vehicle: 0, pax: 0 }
      );
      let nofpax = parseInt(
        this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity
      );
      let nofvehicle = parseInt(
        this.props
          .requestObject()
          .Request.Filters.filter((x) => x.Column === "quantity")[0].Query
      );
      if (data.vehicle !== nofvehicle || data.pax !== nofpax) {
        this.setState({ isErrorMessage: true });
        return;
      } else this.setState({ isErrorMessage: false });
      this.props.handleCart(
        code,
        this.state.data.filter((x) => x.vehicle > 0 && x.pax > 0),
        this.props.details.token
      );
    } else this.props.handleCart(id, code, this.props.details.id);
  };

  hideQuickBook = () => {
    this.props.hideQuickBook();
  };

  getAminitiesLength = (param_amenities) => {
    this.props.getAminitiesLength(param_amenities);
  };

  render() {
    const { businessName, details } = this.props;
    const { tab, data } = this.state;
    const defaultClass = "btn btn-sm btn-link text-secondary";
    const activeClass = "btn btn-sm btn-primary btn-active";
    var requestObject = this.props.requestObject();

    return details !== "" ? (
      businessName === "transportation" ? (
        <div className="quick-book-cont">
          <React.Fragment>
            <span
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                right: "25px",
              }}
              onClick={() => this.hideQuickBook()}
            >
              <SVGIcon name="times"></SVGIcon>
            </span>
            <ul className="nav nav-pills bg-light p-2">
              <li className="nav-item">
                <button
                  onClick={() => this.changeTabs("availability")}
                  className={
                    tab === "availability" ? activeClass : defaultClass
                  }
                >
                  {Trans("_availability")}
                </button>
              </li>

              {this.props.details.policies &&
                this.props.details.policies.length > 0 && (
                  <li className="nav-item">
                    <button
                      onClick={() => this.changeTabs("policy")}
                      className={tab === "policy" ? activeClass : defaultClass}
                    >
                      {Trans("_bookingTerms")}
                    </button>
                  </li>
                )}
            </ul>
            <div className="row quick-book">
              <div className="col-lg-12">
                <div className="pt-3 pl-2">
                  {this.state.isErrorMessage && tab === "availability" && (
                    <span className="alert alert-danger mb-2">
                      {Trans("_error_transportation_Detail_ValidationMessage1")}
                    </span>
                  )}
                  {tab === "availability" && (
                    <div
                      className={
                        "card" + (this.state.isErrorMessage ? " mt-3" : "")
                      }
                    >
                      <div className="card-header">
                        <div className="container">
                          <div className="row">
                            <div className="col-3">
                              <h6>{Trans("_transportation")}</h6>
                            </div>
                            <div className="col-2">
                              <h6>{Trans("_vehicleQuantity")}</h6>
                            </div>
                            <div className="col-3">
                              <h6>{Trans("_VehicleNoOfPersion")}</h6>
                            </div>
                            <div className="col-3 pull-right">
                              {this.props.isBtnLoading !== null &&
                                this.props.isBtnLoading !== false ? (
                                  <button className="btn btn-primary">
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                    {Trans("_bookNow")}
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => this.handleCart()}
                                  >
                                    {Trans("_bookNow")}
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {details.items[0].item.map((item, key) => {
                        return (
                          <div className="card-body" key={key}>
                            <h6 className="card-title">{item.name}</h6>
                            <div className="container">
                              <div className="row">
                                <div className="col-3 p-0">
                                  <span className="d-block">
                                    {Trans("_vehicleCategory")} :{" "}
                                    {
                                      item.tpExtension.find(
                                        (x) => x.key === "categoryName"
                                      ).value
                                    }
                                  </span>
                                  <span className="d-block">
                                    {Trans("_vehicleModel")} :{" "}
                                    {
                                      item.tpExtension.find(
                                        (x) => x.key === "modelFrom"
                                      ).value
                                    }{" "}
                                    -{" "}
                                    {
                                      item.tpExtension.find(
                                        (x) => x.key === "modelTo"
                                      ).value
                                    }
                                  </span>
                                </div>
                                <div className="col-2">
                                  <select
                                    className="form-control"
                                    onChange={(e) =>
                                      this.handleTransportationSelection(
                                        "quantity",
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option>{0}</option>
                                    {[...Array(item.quantity > parseInt(this.props.requestObject().Request.Filters.filter((x) => x.Column === "quantity")[0].Query) ? parseInt(this.props.requestObject().Request.Filters.filter((x) => x.Column === "quantity")[0].Query) : item.quantity).keys()].map(
                                      (item) => {
                                        return <option>{item + 1}</option>;
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="col-2">
                                  <select
                                    className="form-control"
                                    onChange={(e) =>
                                      this.handleTransportationSelection(
                                        "availabilityCount",
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option>{0}</option>
                                    {[
                                      ...Array(item.availabilityCount > parseInt(this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity) ? parseInt(this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity) : item.availabilityCount).keys(),
                                    ].map((item) => {
                                      return <option>{item + 1}</option>;
                                    })}
                                  </select>
                                </div>
                                <div className="col-2">
                                  {Global.getEnvironmetKeyValue(
                                    "portalType"
                                  ).toLowerCase() !== "b2c" ? (
                                      <span
                                        className={
                                          "d-block pull-right text-primary font-weight-bold btn btn-link "
                                        }
                                        onClick={() =>
                                          this.props.showPriceFarebreakup(
                                            null,
                                            item.id,
                                            this.props.details.token
                                          )
                                        }
                                      >
                                        <Amount
                                          amount={this.getTransportationAmount(
                                            this.state.data,
                                            item.id
                                          )}
                                          currencyCode={
                                            item.displayRateInfo.find(
                                              (x) => x.purpose === "10"
                                            ).currencyCode
                                          }
                                        />
                                      </span>
                                    ) : (
                                      <span
                                        className={
                                          "d-block pull-right text-primary font-weight-bold"
                                        }
                                      >
                                        <Amount
                                          amount={this.getTransportationAmount(
                                            this.state.data,
                                            item.id
                                          )}
                                          currencyCode={
                                            item.displayRateInfo.find(
                                              (x) => x.purpose === "10"
                                            ).currencyCode
                                          }
                                        />
                                      </span>
                                    )}
                                </div>
                              </div>

                              {item.specialRequests && (
                                <div className="row">
                                  <div className="col p-0">
                                    <React.Fragment>
                                      <small className="mr-2">
                                        {Trans("_additionalFacilities")} :
                                      </small>
                                      {item.specialRequests[0].specialRequestItems.map(
                                        (services, key) => {
                                          return (
                                            <span
                                              key={key}
                                              className="badge badge-light border border-primary font-weight-normal pt-1 pb-1 pl-2 pr-2 mr-2"
                                            >
                                              {services.description}
                                            </span>
                                          );
                                        }
                                      )}
                                      {item.specialRequests[0].specialRequestItems.length > 0 && <div class="row"><small class="alert alert-info d-inline-block p-2 mt-2 ml-3">Additional facilities can be add on next page.</small></div>}
                                    </React.Fragment>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {tab === "policy" && this.props.details.policies && (
                    <div className="mt-3 ml-1">
                      <h6>{Trans("_bookingTerms")}</h6>
                      <div>
                        {this.props.details.policies.map((item, key) => {
                          return (
                            item.type !== "CreditCard" && (
                              <React.Fragment key={key}>
                                <h6>{item.type}</h6>
                                <ul className="pl-3">
                                  <li className="mb-3" key={key}>
                                    <HtmlParser text={item.description} />
                                  </li>
                                </ul>
                              </React.Fragment>
                            )
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        </div>
      )
        : businessName === "groundservice" ? (
          <div className="quick-book-cont">
            <React.Fragment>
              <span
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "25px",
                }}
                onClick={() => this.hideQuickBook()}
              >
                <SVGIcon name="times"></SVGIcon>
              </span>
              <ul className="nav nav-pills bg-light p-2">
                <li className="nav-item">
                  <button
                    onClick={() => this.changeTabs("availability")}
                    className={
                      tab === "availability" ? activeClass : defaultClass
                    }
                  >
                    {Trans("_lbladditionalServices")}
                  </button>
                </li>

                {this.props.details.policies &&
                  this.props.details.policies.length > 0 && (
                    <li className="nav-item">
                      <button
                        onClick={() => this.changeTabs("policy")}
                        className={tab === "policy" ? activeClass : defaultClass}
                      >
                        {Trans("_bookingTerms")}
                      </button>
                    </li>
                  )}

                <li className="nav-item ml-auto mr-5">
                  {this.props.isBtnLoading !== null &&
                    this.props.isBtnLoading !== false ? (
                      <button className="btn btn-primary">
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                        {Trans("_bookNow")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => this.handleCart(details.id, details.token)}
                      >
                        {Trans("_bookNow")}
                      </button>
                    )}
                </li>

              </ul>
              <div className="row quick-book">
                <div className="col-lg-12">
                  <div className="pt-3 pl-2">
                    {tab === "availability" && (
                      <div
                        className={
                          (data[0].specialRequests.length > 0 ? "card" : "") + (this.state.isErrorMessage ? " mt-3" : "")
                        }
                      >
                        {data[0].specialRequests.length === 0 && (
                          <React.Fragment>
                            <HtmlParser text={Trans("NoAdditionalServiceFoundMsg")} />
                          </React.Fragment>
                        )}
                        {data[0].specialRequests.length !== 0 && (
                          <div className="card-header">
                            <div className="container">
                              <div className="row">
                                <div className="col-4">
                                  <h6>{Trans("_lbladditionalServices")}</h6>
                                </div>
                                <div className="col-4">
                                  <h6>{Trans("_filterPrice")}</h6>
                                </div>
                                <div className="col-4">
                                  <h6>{Trans("_sortduration")}</h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {data[0].specialRequests.length !== 0 && (
                          <div className="card-body">
                            <h6 className="card-title"></h6>
                            <div className="container">
                              <React.Fragment>
                                {data[0].specialRequests.map(
                                  (services, key) => {
                                    return (
                                      <div className="row">
                                        <div className="col-4 p-0">
                                          {services.name}
                                        </div>
                                        <div className="col-4">
                                          <Amount
                                            amount={services.amount}
                                            currencyCode={services.currencyCode}
                                          />
                                        </div>
                                        <div className="col-4">
                                          {services.duration + " " + Trans("_Days")}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                                <div class="row"><small class="alert alert-info d-inline-block p-2 mt-2">Additional services can be add on next page.</small></div>
                              </React.Fragment>
                            </div>
                          </div>
                        )
                        }
                      </div>
                    )}
                    {tab === "policy" && this.props.details.policies && (
                      <div className="mt-3 ml-1">
                        <h6>{Trans("_bookingTerms")}</h6>
                        <div>
                          {this.props.details.policies.map((item, key) => {
                            return (
                              item.type !== "CreditCard" && (
                                <React.Fragment key={key}>
                                  <h6>{item.type}</h6>
                                  <ul className="pl-3">
                                    <li className="mb-3" key={key}>
                                      <HtmlParser text={item.description} />
                                    </li>
                                  </ul>
                                </React.Fragment>
                              )
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          </div>
        )
          : businessName === "vehicle" ?
            (
              <div className="quick-book-cont">
                <span
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "25px",
                  }}
                  onClick={() => this.hideQuickBook()}
                >
                  <SVGIcon name="times"></SVGIcon>
                </span>
                <ul className="nav nav-pills bg-light p-2">
                  <li className="nav-item">
                    <button
                      onClick={() => this.changeTabs("availability")}
                      className={tab === "availability" ? activeClass : defaultClass}
                    >
                      {Trans("_availability")}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={() => this.changeTabs("location")}
                      className={tab === "location" ? activeClass : defaultClass}
                    >
                      {Trans("_filterlocation")}
                    </button>
                  </li>
                </ul>

                <div className="row quick-book">
                  <div className="col-lg-12">
                    <div className="pt-3 pl-2">
                      {tab === "availability" ?
                        (
                          <Schedulevehicle
                            {...details}
                            handleCart={this.handleCart}
                            showRoomTerms={this.props.showRoomTerms}
                            showPriceFarebreakup={this.props.showPriceFarebreakup}
                            handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                            isBtnLoading={this.props.isBtnLoading}
                            handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                            itemid={this.props.itemid}
                          />
                        )
                        : null}
                      {tab === "location" && (
                        <div className="rooms row mb-4">
                          <div className="col-12">
                            <h4 className="font-weight-bold mb-3">
                            </h4>
                            <div className="card">
                              <div className="card-header">
                                <div className="container">
                                  <div className="row">
                                    <div className="col-6">
                                      <h6>{Trans("_widgetvehicleFromLocationTitle")}</h6>
                                    </div>
                                    <div className="col-6">
                                      <h6>{Trans("_widgetvehicleToLocationTitle")}</h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-body">
                                <div className="container">
                                  <div className="row">
                                    <div className="col-6 p-0">
                                      <span className="d-block">
                                        <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>
                                        <HtmlParser text={this.props.details.locationInfo.fromLocation.name} />
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-address-card-o mr-2" aria-hidden="true"></i>
                                        <HtmlParser text={this.props.details.locationInfo.fromLocation.address} />
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
                                        <Date date={this.props.details.dateInfo.startDate} />
                                        {/* <HtmlParser text={this.props.details.dateInfo.startDate} /> */}
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-clock-o mr-2" aria-hidden="true"></i>
                                        <Date date={this.props.details.dateInfo.startDate} format={"shortTimeampm"} />
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <span className="d-block">
                                        <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>
                                        <HtmlParser text={this.props.details.locationInfo.toLocation.name} />
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-address-card-o mr-2" aria-hidden="true"></i>
                                        <HtmlParser text={this.props.details.locationInfo.toLocation.address} />
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-calendar mr-2" aria-hidden="true"></i>
                                        <Date date={this.props.details.dateInfo.endDate} />
                                        {/* <HtmlParser text={this.props.details.dateInfo.endDate} /> */}
                                      </span>
                                      <span className="d-block">
                                        <i className="fa fa-clock-o mr-2" aria-hidden="true"></i>
                                        <Date date={this.props.details.dateInfo.endDate} format={"shortTimeampm"} />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div >
            )
            : (
              <div className="quick-book-cont">
                <span
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "25px",
                  }}
                  onClick={() => this.hideQuickBook()}
                >
                  <SVGIcon name="times"></SVGIcon>
                </span>
                <ul className="nav nav-pills bg-light p-2">
                  <li className="nav-item">
                    <button
                      onClick={() => this.changeTabs("availability")}
                      className={tab === "availability" ? activeClass : defaultClass}
                    >
                      {Trans("_availability")}
                    </button>
                  </li>
                  {details.description !== undefined &&
                    details.description.length > 0 && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("overview")}
                          className={tab === "overview" ? activeClass : defaultClass}
                        >
                          {Trans("_overview")}
                        </button>
                      </li>
                    )}

                  {details.amenities !== undefined &&
                    details.amenities.length > 0 &&
                    this.getAminitiesLength(details.amenities) > 0 && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("amenities-icons")}
                          className={
                            tab === "amenities-icons" ? activeClass : defaultClass
                          }
                        >
                          {Trans("_thingsYouWillLove")}
                        </button>
                      </li>
                    )}

                  {businessName === "hotel" &&
                    details.amenities !== undefined &&
                    details.amenities.length > 0 && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("amenities")}
                          className={tab === "amenities" ? activeClass : defaultClass}
                        >
                          {Trans("_facilities")}
                        </button>
                      </li>
                    )}

                  {(businessName === "activity" || businessName === "package" || businessName === "transfers") &&
                    ((details.tpExtension.find((x) => x.key === "inclusions") &&
                      details.tpExtension.find((x) => x.key === "inclusions")
                        .value) ||
                      (details.tpExtension.find((x) => x.key === "exclusions") &&
                        details.tpExtension.find((x) => x.key === "exclusions")
                          .value)) && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("amenities")}
                          className={tab === "amenities" ? activeClass : defaultClass}
                        >
                          {Trans("_jumpToInclusionsExclusions")}
                        </button>
                      </li>
                    )}

                  {businessName === "package" &&
                    details.tpExtension.find((x) => x.key === "itenaryDetails") &&
                    details.tpExtension.find((x) => x.key === "itenaryDetails")
                      .value && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("itineraryDetails")}
                          className={
                            tab === "itineraryDetails" ? activeClass : defaultClass
                          }
                        >
                          {Trans("_jumpToItineraryDetails")}
                        </button>
                      </li>
                    )}

                  {details.images !== undefined && details.images.length > 0 && (
                    <li className="nav-item">
                      <button
                        onClick={() => this.changeTabs("photos")}
                        className={tab === "photos" ? activeClass : defaultClass}
                      >
                        {Trans("_photo")}
                      </button>
                    </li>
                  )}

                  {(businessName === "activity" || businessName === "package" || businessName === "transfers") &&
                    details.tpExtension.find(
                      (x) => x.key === "rulesAndRegulations"
                    ) &&
                    details.tpExtension.find((x) => x.key === "rulesAndRegulations")
                      .value && (
                      <li className="nav-item">
                        <button
                          onClick={() => this.changeTabs("termsConditions")}
                          className={
                            tab === "termsConditions" ? activeClass : defaultClass
                          }
                        >
                          {Trans("_jumpToTermsAndConditions")}
                        </button>
                      </li>
                    )}
                </ul>

                <div className="row quick-book">
                  <div className="col-lg-12">
                    <div className="pt-3 pl-2">
                      {tab === "availability" ? (
                        businessName === "hotel" ? (
                          <Rooms
                            {...details}
                            handleCart={this.handleCart}
                            showRoomTerms={this.props.showRoomTerms}
                            showPriceFarebreakup={this.props.showPriceFarebreakup}
                            handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                            isBtnLoading={this.props.isBtnLoading}
                            handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                            itemid={this.props.itemid}
                          />
                        ) : (
                            <Schedule
                              {...details}
                              handleCart={this.handleCart}
                              showRoomTerms={this.props.showRoomTerms}
                              showPriceFarebreakup={this.props.showPriceFarebreakup}
                              handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                              isBtnLoading={this.props.isBtnLoading}
                              handleShowPolicyPopup={this.props.handleShowPolicyPopup}
                              itemid={this.props.itemid}
                            />
                          )
                      ) : tab === "amenities" ? (
                        businessName === "hotel" ? (
                          <Amenities {...details} />
                        ) : (
                            <InclusionsExcusions {...details} />
                          )
                      ) : tab === "overview" ? (
                        <OverView {...details} />
                      ) : tab === "amenities-icons" ? (
                        <div className="amenities-icons fade show">
                          <AllAmenities {...details} />
                        </div>
                      ) : tab === "termsConditions" ? (
                        <RulesRegulations {...details} />
                      ) : tab === "itineraryDetails" ? (
                        <ItineraryDetails {...details} />
                      ) : tab === "photos" ? (
                        <ImageSlider
                          {...details}
                          businessName={businessName}
                          noofimage={3}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )
    ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "160px" }}
        >
          {this.props.isDetailsResponseLoading ? (
            <React.Fragment>
              <span
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "25px",
                }}
                onClick={() => this.hideQuickBook()}
              >
                <SVGIcon name="times"></SVGIcon>
              </span>
              <h5>{Trans("_detail" + businessName + "NotAvailable")}</h5>
            </React.Fragment>
          ) : (
              <Loader />
            )}
        </div>
      );
  }
}

export default QuickBook;
