import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import QuotationResultsLoading from "./quotation-results-loading";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import moment from "moment";
import ResultItemAirDetailsMeta from "../results/result-item-air-details-meta";
import Config from "../../config.json";

class QuotationResultsMetaAir extends Component {
  state = {
    businessName: "air",
    results: "",
    token: "",
    pageInfo: "",
    itemProps: [],
    isShowResults: true,
    isDetails: false,
    pageNo: 1,
    pageSize: 20,
  };

  metaRequester = (param, callback) => {
    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/meta/air/list?" +
      "departurecode=" + param.departurecode +
      "&arrivalcode=" +
      param.arrivalcode +
      "&fromdate=" +
      param.fromdate +
      "&pageno=" +
      param.pageNo +
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

    let param = {
      departurecode: departurecode,
      arrivalcode: arrivalcode,
      fromdate: fromdate,
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNo,
    };

    this.metaRequester(param, (data) => {
      let results = this.state.results
        ? this.state.results.concat(data.flights)
        : data.flights;

      results = results.map((x) => {
        return {
          ...x,
          startDate: searchRequest?.dates?.checkInDate,
          endDate: searchRequest?.dates?.checkOutDate,
        };
      });

      let pageInfo = data.pageInfo;
      this.setState({ results, pageInfo });
    });
  };

  showhideResults = () => {
    this.setState({
      isShowResults: !this.state.isShowResults,
    });
  };

  showDetails = (itemToken) => {
    let itemProps = this.state.results;

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
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    item.dayReturn = parseInt(quotationInfo.duration);
    item.dayReturnEnd = parseInt(quotationInfo.duration);
    let dtl = {
      itemDtlMeta: item,
    };
    this.setState({ isShowResults: false });
    this.props.addItem(dtl);
  };

  handlePaging = () => {
    this.setState({ pageNo: this.state.pageNo + 1 }, () => this.getResults());
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
      pageNo,
      pageSize,
    } = this.state;

    return (
      <div className="border shadow-sm mt-4">
        {results && (
          <div>
            <div className="quotation-results-total d-flex p-2 pl-3 pr-3 m-0 bg-light">
              <div className="mr-auto d-flex align-items-center">
                <SVGIcon
                  className="mr-2 d-flex align-items-center"
                  name={businessName}
                  width="24"
                  type="fill"
                ></SVGIcon>

                {pageInfo.totalRecords > 0 ? (
                  <h6 className="font-weight-bold m-0 p-0">
                    {pageInfo.totalRecords} Flight(s) Found Matching Your Search
                  </h6>
                ) : (
                  <h6 className="font-weight-bold m-0 p-0">
                    No Flight(s) found!
                  </h6>
                )}
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

            {isShowResults && (
              <div className="row no-gutters">
                <div className="col-lg-12">
                  <div className="quotation-search-results border-top">
                    <div className="row">
                      {results.map((item, itemKey) => {
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
                        return (<div className="col-lg-12">
                          <ul className="list-unstyled m-0">
                            <li className="border-bottom p-3" key={itemKey}>
                              <div className="row">
                                <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
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
                                <div className="col-lg-2 d-flex justify-content-center align-items-end flex-column">
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
                                <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <Stops {...[stopCount]} />
                                  <span className="small mt-1">
                                    {Trans(
                                      "_" +
                                      stops.replace(" ", "").replace(" ", "").toLowerCase()
                                    )}
                                  </span>
                                </div>
                                <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
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
                                <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
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
                                  <span className="small text-nowrap text-secondary mt-1">
                                    {cabinClass}
                                  </span>
                                </div>
                                <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                  <button
                                    className="btn btn-sm btn-primary mt-1"
                                    onClick={() =>
                                      this.addItem(item, item)
                                    }
                                  >
                                    Add to {this.props.type === "Quotation"
                                      ? Trans("_quotationReplaceKey")
                                      : this.props.type === "Quotation_Master"
                                        ? "Master " + Trans("_quotationReplaceKey")
                                        : this.props.type === "Itinerary_Master"
                                          ? "Master Itinerary" : this.props.type}
                                  </button>
                                  <button
                                    className="btn btn-sm btn-link mt-1 text-secondary"
                                    onClick={() => this.showDetails(item.flightRouteDetailId)}
                                    key={item.flightRouteDetailId}
                                  >
                                    {this.state.itemProps.length > 0 && this.state.itemProps.find((x) => x.flightRouteDetailId === this.state.token)
                                      .isShow && this.state.token === item.flightRouteDetailId ? Trans("_hideDetails") : Trans("_viewDetails")}
                                  </button>

                                </div>
                              </div>
                            </li>
                          </ul>
                          {this.state.token !== "" && this.state.token === item.flightRouteDetailId && this.state.itemProps.find(
                            (x) => x.flightRouteDetailId === this.state.token
                          ) !== undefined &&
                            this.state.itemProps.find((x) => x.flightRouteDetailId === this.state.token)
                              .isShow && (
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="border-top pl-4 pr-4 pb-4 pt-0">
                                    {this.state.itemProps.find(
                                      (x) => x.flightRouteDetailId === this.state.token
                                    ) !== undefined && (
                                        <ResultItemAirDetailsMeta Airitem={this.state.itemProps.filter(
                                          (x) => x.flightRouteDetailId === this.state.token)} />
                                      )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>)
                      })}

                      {/* <div className="col-lg-2 border-left bg-light d-flex justify-content-center align-items-center flex-column">
                        <button
                          className="btn btn-sm btn-primary mt-1"
                          onClick={() =>
                            this.addItem(item.flightRouteId, item)
                          }
                        >
                          Add to {props.type}
                        </button>
                        
                      </div> */}
                    </div>
                  </div>
                </div>
                {results && results.length > 0 && (
                  <React.Fragment>
                    {pageNo < pageInfo.totalRecords / pageSize && (
                      <div className=" col-lg-12 p-2 text-center">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => this.handlePaging()}
                        >
                          Show More
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                )}


              </div>
            )}
          </div>
        )}

        {!results && <QuotationResultsLoading businessName={businessName} />}
      </div>
    );
  }
}

export default QuotationResultsMetaAir;
