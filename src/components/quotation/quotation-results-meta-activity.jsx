import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import QuotationResultsLoading from "./quotation-results-loading";
import HtmlParser from "../../helpers/html-parser";
import QuotationDetailsPopupMetaActivity from "../quotation/quotation-details-popup-meta-activity";
import { Trans } from "../../helpers/translate";
import Config from "../../config.json";

class QuotationResultsMetaActivity extends Component {
  state = {
    businessName: "activity",
    results: "",
    pageInfo: "",
    isShowResults: true,
    isDetails: false,
    pageNo: 1,
    pageSize: 20,
  };

  metaRequester = (param, callback) => {
    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/meta/activity/list?" +
      "locationcode=" + param.locationcode +
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

    let locationcode = this.state?.searchRequest?.fromLocation?.id;

    let param = {
      locationcode: locationcode,
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNo,
    };

    this.metaRequester(param, (data) => {
      let results = this.state.results
        ? this.state.results.concat(data.activities)
        : data.activities;

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

  handleRooms = (hotelCode) => {
    this.setState({ isRooms: hotelCode });
  };

  handleDetails = (activityCode) => {
    this.setState({ isDetails: activityCode });
  };

  addItem = (item, room) => {
    item.businessName = "activity";
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
                    {pageInfo.totalRecords} Activity(s) Found Matching Your Search
                  </h6>
                ) : (
                  <h6 className="font-weight-bold m-0 p-0">
                    No Activity(s) found!
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
                      {results &&
                        results.map((item, key) => (
                          <div
                            className="quotation-result-item col-lg-12"
                            key={key}
                          >
                            <div className="row no-gutters border-bottom p-3">
                              <div className="col-lg-6">
                                <h2
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    this.handleDetails(item.code)
                                  }
                                >
                                  <HtmlParser text={item.name} />
                                </h2>

                                <small className="mr-3 text-secondary">
                                  <SVGIcon
                                    name="map-marker"
                                    width="16"
                                    type="fill"
                                    height="16"
                                    className="mr-2"
                                  ></SVGIcon>
                                  {item.city}
                                </small>


                              </div>
                              <div className="col-lg-2 d-flex align-items-center justify-content-center">
                                <small className="mr-3 text-secondary">
                                  <SVGIcon name="clock" className="mr-2"></SVGIcon>
                                  {Trans("_duration")} :{" "}
                                  <HtmlParser
                                    text={item.duration}
                                  />
                                </small>
                              </div>
                              <div className="col-lg-2 d-flex align-items-center justify-content-center">
                                <button
                                  className="btn btn-link text-primary"
                                  onClick={() =>
                                    this.handleDetails(item.code)
                                  }
                                >
                                  Details
                                </button>
                              </div>

                              <div className="col-lg-2 d-flex align-items-center justify-content-end">
                                <button
                                  className="btn btn-sm btn-primary m-0 text-nowrap"
                                  onClick={() => this.addItem(item, item)}
                                >
                                  Add to {this.props.type === "Quotation"
                                    ? Trans("_quotationReplaceKey")
                                    : this.props.type === "Quotation_Master"
                                      ? "Master " + Trans("_quotationReplaceKey")
                                      : this.props.type === "Itinerary_Master"
                                        ? "Master Itinerary" : this.props.type}
                                </button>
                              </div>

                              {item.code === isDetails && (
                                <QuotationDetailsPopupMetaActivity
                                  details={{ name: item.name, ...item }}
                                  businessName={businessName}
                                  hideQuickBook={this.handleDetails}
                                />
                              )}

                            </div>
                          </div>
                        ))}

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

                      {results && results.length === 0 && (
                        <div className="col-lg-12">
                          <h5 className="text-center p-4 text-primary text-capitalize">
                            No Activity(s) found! Please Add Manually
                          </h5>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!results && <QuotationResultsLoading businessName={businessName} />}
      </div>
    );
  }
}

export default QuotationResultsMetaActivity;
