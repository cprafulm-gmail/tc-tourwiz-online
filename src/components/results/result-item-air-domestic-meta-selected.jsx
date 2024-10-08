import React, { Component } from "react";
import ResultItemAirDetails from "./result-item-air-details";
import { Trans } from "../../helpers/translate";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import Date from "../../helpers/date";
import moment from "moment";
import Stops from "../common/stops";
import SVGIcon from "../../helpers/svg-icon";
import ResultItemAirDetailsMeta from "../results/result-item-air-details-meta";

class ResultItemAirDomesticMetaSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemProps: [],
      fareRules: null,
      isSelected: false,
      token: "",
      selecteddeparturetoken: "",
      selectedarrivaltoken: "",
      showdetaildeparture: false,
      showdetailarrival: false,
    };
  }

  showDetails = (itemToken, detailsfor) => {
    let itemProps = (detailsfor === "departure" ? this.props.resultsDeparture : this.props.resultsArrival);

    if (itemProps.find((x) => x.flightRouteDetailId === itemToken) === undefined) {
      if (detailsfor === "departure") {
        itemProps.push({
          token: itemToken,
          activeTab: "itinerary",
          isShow: true,
          selecteddeparturetoken: itemToken,
        });
      }
      else {
        itemProps.push({
          token: itemToken,
          activeTab: "itinerary",
          isShow: true,
          selectedarrivaltoken: itemToken,
        });
      }
    }
    else
      itemProps.find((x) => x.flightRouteDetailId === itemToken).isShow = !itemProps.find(
        (x) => x.flightRouteDetailId === itemToken
      ).isShow;

    if (detailsfor === "departure") {
      this.setState({
        itemProps: itemProps,
        token: itemToken,
        selecteddeparturetoken: itemToken,
        showdetaildeparture: !this.state.showdetaildeparture,
      });
    }
    else {
      this.setState({
        itemProps: itemProps,
        token: itemToken,
        selectedarrivaltoken: itemToken,
        showdetailarrival: !this.state.showdetailarrival,
      });
    }
  };

  addItem = () => {
    let dtl = {
      itemDtlMeta: this.props.selectedFlights,
    };
    this.props.addItem(dtl);
  };

  handlefareRules = (fareRules) => {
    this.setState({
      fareRules,
    });
  };

  changeTabs = (itemToken, activeTab) => {
    let itemProps = this.state.itemProps;

    itemProps.find((x) => x.token === itemToken).activeTab = activeTab;

    this.setState({
      itemProps: itemProps,
    });
  };

  handleSelectionValidation = () => {
    (this.props.selectedFlights[0].token || this.props.selectedFlights[1].token) &&
      this.setState({
        isSelected: true,
      });
  };

  render() {
    let totalPrice = 0;
    this.props.selectedFlights.map((items) => (totalPrice = totalPrice + items.amount));
    const selectedFlights = [this.props.selectedFlights[0], this.props.selectedFlights[1]];
    let dep = selectedFlights[0].flightRouteDetailId;
    return (
      <div className="selected-flight">
        <div
          className="position-fixed w-100"
          style={{ bottom: "0px", left: "0px", zIndex: "1001" }}
        >
          <div className="container">
            <div className="search-results-air title-bg p-2">
              <div className="row no-gutters">
                <div className="col-lg-10">
                  <div className="row no-gutters">
                    {selectedFlights.map((item, key) => {
                      const stopCount = item.stops;
                      const stops =
                        stopCount === 0
                          ? "non stop"
                          : stopCount === 1
                            ? stopCount + " stop"
                            : stopCount + " stops";
                      let startTime = moment(item.departureDate);
                      let endTime = moment(item.arrivalDate);
                      let durationdiff = moment.duration(endTime.diff(startTime));
                      let hoursduration = parseInt(durationdiff.asHours());
                      let minuteduration = parseInt(durationdiff.asMinutes()) % 60;
                      const duration = hoursduration +
                        "h " +
                        minuteduration +
                        "m";
                      const url = item.logo || "";

                      const airline = item.airlineName;
                      const airlineCode = item.flightNumber;

                      const getOnErrorImageURL = () => {
                        return ImageNotFound.toString();
                      };

                      const cabinClass = "";
                      return (
                        <div className="result-item col-lg-6 pr-2" key={key}>
                          {item.flightRouteDetailId && (
                            <React.Fragment>
                              <div className="row no-gutters bg-white">
                                <div className="col-lg-9 d-flex justify-content-center align-items-center flex-column">
                                  <ul className="list-unstyled m-0">
                                    <li className="border-bottom p-3" key={item.flightRouteDetailId}>
                                      <div className="row">
                                        <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                                          <img
                                            className="img-fluid"
                                            src={url || ImageNotFound}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = getOnErrorImageURL();
                                            }}
                                            alt=""
                                          />
                                          <span
                                            className="small text-secondary mt-2"
                                            title={airline}
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              maxWidth: "72px",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {airline}
                                          </span>
                                          <span className="small text-secondary">{airlineCode}</span>
                                        </div>
                                        <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                          <span className="small text-secondary">{item.departureCode}</span>

                                          <b>
                                            <Date date={item.departureDate} format="shortTime" />
                                          </b>

                                          <span className="small text-secondary">
                                            <Date date={item.departureDate} format="shortDate" />
                                          </span>
                                        </div>
                                        <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                                          <span className="small text-nowrap mb-1">
                                            <i className="align-text-bottom">
                                              <SVGIcon
                                                name="clock"
                                                className="mr-1 text-secondary"
                                                width="12"
                                                height="12"
                                              ></SVGIcon>
                                            </i>
                                            {duration}
                                          </span>
                                          <Stops {...[stopCount]} />
                                          <span className="small mt-1">
                                            {Trans("_" + stops.replace(" ", "").replace(" ", "").toLowerCase())}
                                          </span>
                                        </div>
                                        <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                          <span className="small text-secondary">{item.arrivalCode}</span>

                                          <b>
                                            <Date date={item.arrivalDate} format="shortTime" />
                                          </b>

                                          <span className="small text-secondary">
                                            <Date date={item.arrivalDate} format="shortDate" />
                                          </span>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className="col-lg-3 border-left bg-light d-flex justify-content-center align-items-center flex-column">
                                  {true && (
                                    <button
                                      className="btn btn-sm btn-link text-primary p-0 m-0"
                                      onClick={() => this.showDetails(item.flightRouteDetailId, (selectedFlights[0].flightRouteDetailId === item.flightRouteDetailId ? "departure" : "arrival"))}
                                      key={item.flightRouteDetailId}
                                    >
                                      {key === 0 && <>
                                        {this.state.showdetaildeparture && this.state.selecteddeparturetoken === item.flightRouteDetailId ? Trans("_hideDetails") : Trans("_viewDetails")}
                                      </>}
                                      {key === 1 && <>
                                        {this.state.showdetailarrival && this.state.selectedarrivaltoken === item.flightRouteDetailId ? Trans("_hideDetails") : Trans("_viewDetails")}
                                      </>}
                                    </button>
                                  )}
                                </div>
                                {(this.state.showdetaildeparture && this.state.selecteddeparturetoken === item.flightRouteDetailId) && (
                                  <div className="row" key={item.flightRouteDetailId}>
                                    <div className="col-lg-12">
                                      <div className="border-top pl-4 pr-4 pb-4 pt-0">
                                        <ResultItemAirDetailsMeta Airitem={this.props.resultsDeparture.filter(
                                          (x) => x.flightRouteDetailId === item.flightRouteDetailId)} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {(this.state.showdetailarrival && this.state.selectedarrivaltoken === item.flightRouteDetailId) && (
                                  <div className="row" key={item.flightRouteDetailId}>
                                    <div className="col-lg-12">
                                      <div className="border-top pl-4 pr-4 pb-4 pt-0">
                                        <ResultItemAirDetailsMeta Airitem={this.props.resultsArrival.filter(
                                          (x) => x.flightRouteDetailId === item.flightRouteDetailId)} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          )}

                          {!item.flightRouteDetailId && (
                            <div
                              className="d-flex h-100 justify-content-center align-items-center text-secondary bg-white"
                              style={{ minHeight: "80px" }}
                            >
                              <div
                                className={
                                  this.state.isSelected
                                    ? "alert alert-danger m-0 pt-1 pb-1 pl-3 pr-3"
                                    : ""
                                }
                              >
                                Please Select {!selectedFlights[0].flightRouteDetailId ? "Departure" : "Return"}{" "}
                                Flight
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-lg-2 d-flex align-items-center bg-white justify-content-center">
                  <div>
                    {selectedFlights[0].flightRouteDetailId &&
                      selectedFlights[1].flightRouteDetailId && (
                        <button
                          className="btn btn-primary mt-1"
                          onClick={() =>
                            this.addItem()
                          }
                        >
                          Add to {this.props.type === "Quotation"
                            ? Trans("_quotationReplaceKey")
                            : this.props.type === "Quotation_Master"
                              ? "Master " + Trans("_quotationReplaceKey")
                              : this.props.type === "Itinerary_Master"
                                ? "Master Itinerary" : this.props.type}
                        </button>
                      )}

                    {(!selectedFlights[0].flightRouteDetailId || !selectedFlights[1].flightRouteDetailId) && (
                      <button
                        className="btn btn-secondary mt-1"
                        onClick={() => this.handleSelectionValidation()}
                      >
                        Add to {this.props.type === "Quotation"
                          ? Trans("_quotationReplaceKey")
                          : this.props.type === "Quotation_Master"
                            ? "Master " + Trans("_quotationReplaceKey")
                            : this.props.type === "Itinerary_Master"
                              ? "Master Itinerary" : this.props.type}
                      </button>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultItemAirDomesticMetaSelected;
