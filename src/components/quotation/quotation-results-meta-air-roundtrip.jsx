import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import QuotationResultsLoading from "./quotation-results-loading";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import moment from "moment";
import ResultItemAirDetailsMeta from "../results/result-item-air-details-meta";
import ResultItemAirDomesticMetaSelected from "../results/result-item-air-domestic-meta-selected";
import Config from "../../config.json";

class QuotationResultsMetaAirRoundTrip extends Component {
  state = {
    businessName: "air",
    resultsDeparture: "",
    resultsArrival: "",
    token: "",
    DeparturepageInfo: "",
    ArrivalpageInfo: "",
    itemProps: [],
    isShowResults: true,
    isDetails: false,
    DeparturepageNo: 1,
    ArrivalpageNo: 1,
    pageSize: 20,
    resultsfor: "both",
    selectedFlights: [],
  };

  metaDepartureRequester = (param, callback) => {
    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/meta/air/list?" +
      "departurecode=" + param.departurecode +
      "&arrivalcode=" +
      param.arrivalcode +
      "&fromdate=" +
      param.fromdate +
      "&pageno=" +
      param.DeparturepageNo +
      "&pagesize=" +
      param.pageSize;

    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("GET", reqURL, true);
    // xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(""));
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(this.responseText ? JSON.parse(this.responseText) : null);
      }
    };
  };

  metaArrivalRequester = (param, callback) => {
    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/meta/air/list?" +
      "departurecode=" + param.arrivalcode +
      "&arrivalcode=" +
      param.departurecode +
      "&fromdate=" +
      param.todate +
      "&pageno=" +
      param.ArrivalpageNo +
      "&pagesize=" +
      param.pageSize;

    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("GET", reqURL, true);
    // xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(""));
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(this.responseText ? JSON.parse(this.responseText) : null);
      }
    };
  };

  getResults = () => {
    const { searchRequest } = this.state;
    let departurecode = this.state?.searchRequest?.fromLocation?.id;
    let arrivalcode = this.state?.searchRequest?.toLocation?.id;
    let fromdate = this.state.searchRequest?.dates?.checkInDate;
    let todate = this.state.searchRequest?.dates?.checkOutDate;
    let resultsArrival = "";
    let ArrivalpageInfo = "";

    let param = {
      departurecode: departurecode,
      arrivalcode: arrivalcode,
      fromdate: fromdate,
      todate: todate,
      pageSize: this.state.pageSize,
      DeparturepageNo: this.state.DeparturepageNo,
      ArrivalpageNo: this.state.ArrivalpageNo,
    };


    if (this.state.resultsfor === "both" || this.state.resultsfor === "departure") {
      this.metaDepartureRequester(param, (data) => {
        let resultsDeparture = this.state.resultsDeparture
          ? this.state.resultsDeparture.concat(data.flights)
          : data.flights;

        resultsDeparture = resultsDeparture.map((x) => {
          return {
            ...x,
            startDate: searchRequest?.dates?.checkInDate,
            endDate: searchRequest?.dates?.checkOutDate,
          };
        });

        let DeparturepageInfo = data.pageInfo;
        this.setState({ resultsDeparture, DeparturepageInfo });
      });
    }
    if (this.state.resultsfor === "both" || this.state.resultsfor === "arrival") {
      this.metaArrivalRequester(param, (data) => {
        resultsArrival = this.state.resultsArrival
          ? this.state.resultsArrival.concat(data.flights)
          : data.flights;

        resultsArrival = resultsArrival.map((x) => {
          return {
            ...x,
            startDate: searchRequest?.dates?.checkInDate,
            endDate: searchRequest?.dates?.checkOutDate,
          };
        });

        ArrivalpageInfo = data.pageInfo;
        this.setState({ resultsArrival, ArrivalpageInfo });
      });
    }
  };

  handleFlightSelect = (items, routeType) => {
    let selectedFlightsArr = [...this.state.selectedFlights];
    selectedFlightsArr.length === 0 && selectedFlightsArr.push({}, {});

    if (routeType === "departure") {
      selectedFlightsArr[0] = items;
    }
    if (routeType === "arrival") {
      selectedFlightsArr[1] = items;
    }

    this.setState({ selectedFlights: selectedFlightsArr });
  };

  showhideResults = () => {
    this.setState({
      isShowResults: !this.state.isShowResults,
    });
  };

  showDetails = (itemToken, detailsfor) => {
    let itemProps;

    if (detailsfor === "departure")
      itemProps = this.state.resultsDeparture;
    if (detailsfor === "arrival")
      itemProps = this.state.resultsArrival;

    if (itemProps.find((x) => x.flightRouteDetailId === itemToken) === undefined)
      itemProps.push({
        token: itemToken,
        activeTab: "itinerary",
        isShow: true,
      });
    else
      itemProps.find((x) => x.flightRouteDetailId === itemToken).isShow = !itemProps.find(
        (x) => x.flightRouteDetailId === itemToken
      ).isShow;

    this.setState({
      itemProps: itemProps,
      token: itemToken,
    });
  };

  addItem = (item, room) => {
    item.businessName = "air";
    item.triptype = "roundtrip";
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    item.dayReturn = parseInt(quotationInfo.duration);
    item.dayReturnEnd = parseInt(quotationInfo.duration);
    let dtl = {
      itemDtlMeta: item,
    };
    this.setState({ isShowResults: false });
    this.props.addItem(dtl);
  };

  handlePaging = (resultsfor) => {
    if (resultsfor === "departure")
      this.setState({ DeparturepageNo: this.state.DeparturepageNo + 1, resultsfor: resultsfor }, () => this.getResults());
    else if (resultsfor === "arrival")
      this.setState({ ArrivalpageNo: this.state.ArrivalpageNo + 1, resultsfor: resultsfor }, () => this.getResults());
  };

  componentDidMount() {
    const { searchRequest } = this.props;
    this.setState(
      {
        searchRequest,
      },
      () => this.getResults()
    );
  }

  render() {
    const {
      businessName,
      results,
      pageInfo,
      isRooms,
      isDetails,
      isShowResults,
      DeparturepageNo,
      ArrivalpageNo,
      pageSize,
      resultsArrival,
      resultsDeparture,
      DeparturepageInfo,
      ArrivalpageInfo
    } = this.state;
    let departurecity = this.props?.searchRequest?.fromLocation?.city;
    let arrivalcity = this.props?.searchRequest?.toLocation?.city;
    return (
      <React.Fragment>
        <div className="border shadow-sm mt-4">
          {(resultsDeparture !== "" || resultsArrival !== "") && (
            <div>
              <div className="quotation-results-total d-flex p-2 pl-3 pr-3 m-0 bg-light">
                <div className="mr-auto d-flex align-items-center">
                  <SVGIcon
                    className="mr-2 d-flex align-items-center"
                    name={businessName}
                    width="24"
                    type="fill"
                  ></SVGIcon>
                  {(departurecity !== undefined && arrivalcity !== undefined) && (
                    <h6 className="font-weight-bold m-0 p-0">
                      {departurecity + " - " + arrivalcity + " - " + departurecity}
                    </h6>
                  )
                  }

                </div>
                <button className="btn btn-sm" onClick={this.showhideResults}>
                  <SVGIcon
                    className="d-flex align-items-center"
                    name={isShowResults ? "caret-down" : "caret-up"}
                    width="24"
                    type="fill"
                  ></SVGIcon>
                </button>

                <button
                  className="btn btn-sm border bg-white"
                  style={{ borderRadius: "50%" }}
                  onClick={this.props.deleteResults}
                >
                  <SVGIcon
                    className="d-flex align-items-center"
                    name="times"
                    width="16"
                    height="16"
                  ></SVGIcon>
                </button>
              </div>
            </div>
          )}
          <div class="row no-gutters">
            {!isShowResults && resultsDeparture.length === 0 && resultsArrival.length === 0 &&
              <h6 className="font-weight-bold m-0 p-0">
                No Flight(s) found!
              </h6>
            }
            {isShowResults && resultsDeparture && (resultsDeparture.length !== 0 || resultsArrival.length !== 0) && (
              <React.Fragment>
                <div className="col-lg-6 pr-1">

                  {isShowResults && (
                    <React.Fragment>
                      <div>
                        {DeparturepageInfo.totalRecords > 0 ? (
                          <h6 className="border-bottom pb-3 pt-2">
                            {DeparturepageInfo.totalRecords} Departure Flight(s) Found Matching Your Search
                          </h6>
                        ) : (
                          <h6 className="font-weight-bold m-0 p-0">
                            No Departure Flight(s) found!
                          </h6>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="search-results search-results-air">
                          <div className="row">
                            {DeparturepageInfo.totalRecords === 0 ? (
                              <h6 className="ml-3">{Trans("_noairFound")}</h6>
                            ) : null}

                            {resultsDeparture.map((item, itemKey) => {
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
                                <div className="result-item col-lg-12" key={"Departure"}>
                                  <div className="row no-gutters border shadow-sm mb-2">
                                    <div className="col-lg-12">
                                      <div className="row no-gutters bg-white">
                                        <div className="col-lg-9 d-flex justify-content-center align-items-center flex-column">

                                          <ul className="list-unstyled m-0">
                                            <li className="border-bottom p-3" key={itemKey}>
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
                                                  <span className="small text-secondary mt-2 text-center">
                                                    {airline + " " + airlineCode}
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                                  <span className="small text-secondary">
                                                    {item.departureCode}
                                                  </span>

                                                  <b>
                                                    <Date date={item.departureDate} format="shortTime" />
                                                  </b>

                                                  <span className="small text-secondary">
                                                    <Date date={item.departureDate} format="shortDate" />
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                                                  <span className="small text-nowrap">
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
                                                    {Trans(
                                                      "_" +
                                                      stops.replace(" ", "").replace(" ", "").toLowerCase()
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                                  <span className="small text-secondary">
                                                    {item.arrivalCode}
                                                  </span>

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

                                          {this.state.token !== "" && this.state.token === item.flightRouteDetailId && this.state.itemProps.find(
                                            (x) => x.flightRouteDetailId === this.state.token
                                          ) !== undefined &&
                                            this.state.itemProps.find((x) => x.flightRouteDetailId === this.state.token)
                                              .isShow && (
                                              <div className="border-top pl-4 pr-4 pb-4 pt-0">
                                                {this.state.itemProps.find(
                                                  (x) => x.flightRouteDetailId === this.state.token
                                                ) !== undefined && (
                                                    <ResultItemAirDetailsMeta Airitem={this.state.itemProps.filter(
                                                      (x) => x.flightRouteDetailId === this.state.token)} />
                                                  )}
                                              </div>

                                            )}

                                        </div>
                                        <div class="col-lg-3 border-left bg-light d-flex justify-content-center align-items-center flex-column">
                                          {true && (
                                            <div className="custom-control custom-radio">
                                              <input
                                                type="radio"
                                                className="custom-control-input"
                                                name={"r-departure"}
                                                id={"r-departure" + item.flightRouteDetailId}
                                                onChange={() => this.handleFlightSelect(item, "departure")}
                                              />
                                              <label
                                                className="custom-control-label"
                                                htmlFor={"r-departure" + item.flightRouteDetailId}
                                                style={{ cursor: "pointer" }}
                                              ></label>
                                            </div>
                                          )}
                                        </div>


                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  {resultsDeparture && resultsDeparture.length > 0 && (
                    <React.Fragment>
                      {DeparturepageNo < DeparturepageInfo.totalRecords / pageSize && (
                        <div className=" col-lg-12 p-2 text-center">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => this.handlePaging("departure")}
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}

            {isShowResults && resultsArrival && (resultsDeparture.length !== 0 || resultsArrival.length !== 0) && (
              <React.Fragment>
                <div className="col-lg-6 pr-1">

                  {isShowResults && (
                    <React.Fragment>
                      <div>
                        {ArrivalpageInfo.totalRecords > 0 ? (
                          <h6 className="border-bottom pb-3 pt-2">
                            {ArrivalpageInfo.totalRecords} Return Flight(s) Found Matching Your Search
                          </h6>
                        ) : (
                          <h6 className="font-weight-bold m-0 p-0">
                            No Return Flight(s) found!
                          </h6>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="search-results search-results-air">
                          <div className="row">
                            {ArrivalpageInfo.totalRecords === 0 ? (
                              <h6 className="ml-3">{Trans("_noairFound")}</h6>
                            ) : null}

                            {resultsArrival.map((item, itemKey) => {
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
                                <div className="result-item col-lg-12" key={"Departure"}>
                                  <div className="row no-gutters border shadow-sm mb-2">
                                    <div className="col-lg-12">
                                      <div className="row no-gutters bg-white">
                                        <div className="col-lg-9 d-flex justify-content-center align-items-center flex-column">

                                          <ul className="list-unstyled m-0">
                                            <li className="border-bottom p-3" key={itemKey}>
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
                                                  <span className="small text-secondary mt-2 text-center">
                                                    {airline + " " + airlineCode}
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                                  <span className="small text-secondary">
                                                    {item.departureCode}
                                                  </span>

                                                  <b>
                                                    <Date date={item.departureDate} format="shortTime" />
                                                  </b>

                                                  <span className="small text-secondary">
                                                    <Date date={item.departureDate} format="shortDate" />
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                                                  <span className="small text-nowrap">
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
                                                    {Trans(
                                                      "_" +
                                                      stops.replace(" ", "").replace(" ", "").toLowerCase()
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                                  <span className="small text-secondary">
                                                    {item.arrivalCode}
                                                  </span>

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
                                        <div class="col-lg-3 border-left bg-light d-flex justify-content-center align-items-center flex-column">
                                          {true && (
                                            <div className="custom-control custom-radio">
                                              <input
                                                type="radio"
                                                className="custom-control-input"
                                                name={"r-arrival"}
                                                id={"r-arrival" + item.flightRouteDetailId}
                                                onChange={() => this.handleFlightSelect(item, "arrival")}
                                              />
                                              <label
                                                className="custom-control-label"
                                                htmlFor={"r-arrival" + item.flightRouteDetailId}
                                                style={{ cursor: "pointer" }}
                                              ></label>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  {resultsArrival && resultsArrival.length > 0 && (
                    <React.Fragment>
                      {ArrivalpageNo < ArrivalpageInfo.totalRecords / pageSize && (
                        <div className=" col-lg-12 p-2 text-center">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => this.handlePaging("arrival")}
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
            {(!resultsDeparture || !resultsArrival) && <QuotationResultsLoading businessName={businessName} />}
            {isShowResults && this.state.selectedFlights.length > 0 && (
              <div style={{ minHeight: "60px" }}>
                <ResultItemAirDomesticMetaSelected
                  selectedFlights={this.state.selectedFlights}
                  type={this.props.type}
                  handelDetails={this.showDetails}
                  addItem={this.addItem}
                  resultsDeparture={this.state.resultsDeparture}
                  resultsArrival={this.state.resultsArrival}
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default QuotationResultsMetaAirRoundTrip;
