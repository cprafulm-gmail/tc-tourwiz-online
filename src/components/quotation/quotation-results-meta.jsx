import React, { Component } from "react";
import HtmlParser from "../../helpers/html-parser";
import StarRating from "./../common/star-rating";
import SVGIcon from "../../helpers/svg-icon";
import Amenities from "./../common/amenities";
import QuotationDetailsPopup from "../quotation/quotation-details-popup";
import QuotationResultsLoading from "./quotation-results-loading";
import { Trans } from "../../helpers/translate";
import Config from "../../config.json";

class QuotationResultsMeta extends Component {
  state = {
    businessName: "hotel",
    results: "",
    pageInfo: "",
    isShowResults: true,
    isRooms: false,
    isDetails: false,
    pageNo: 1,
    pageSize: 20,
  };

  metaRequester = (param, callback) => {
    let reqURL =
      process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/meta/hotel/list?" +
      (param.type === "Location"
        ? "locationcode=" + param.locationcode
        : "hotelcode=" + param.hotelcode) +
      "&sortcolumn=" +
      param.sortcolumn +
      "&sortorder=" +
      param.sortorder +
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
    let commonCode = this.state?.searchRequest?.fromLocation?.commonCode;
    let type = this.state.searchRequest?.fromLocation?.type;

    let param = {
      locationcode: locationcode,
      hotelcode: commonCode,
      type: type,
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNo,
      sortcolumn: "rating",
      sortorder: "DESC",
    };

    this.metaRequester(param, (data) => {
      let results = this.state.results
        ? this.state.results.concat(data.hotels)
        : data.hotels;

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

  handleRooms = (hotelCode) => {
    this.setState({ isRooms: hotelCode });
  };

  handleDetails = (hotelCode) => {
    this.setState({ isDetails: hotelCode });
  };

  showhideResults = () => {
    this.setState({
      isShowResults: !this.state.isShowResults,
    });
  };

  addItem = (item, room) => {
    item.roomName = room;
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
                    {pageInfo.totalRecords} Hotel(s) Found -{" "}
                    <span className="text-capitalize">
                      {results && results[0]?.city.toLowerCase()}
                    </span>
                    <span className="text-capitalize">
                      , {results && results[0]?.country.toLowerCase()}
                    </span>
                  </h6>
                ) : (
                  <h6 className="font-weight-bold m-0 p-0">
                    No Hotel(s) found!
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
                                    this.handleDetails(item.hotelCode)
                                  }
                                >
                                  <HtmlParser text={item.name} />
                                  <span
                                    className="ml-2 text-nowrap position-relative"
                                    style={{ top: "-2px" }}
                                  >
                                    {item.rating && (
                                      <StarRating
                                        {...[Number(item.rating) || 0]}
                                      />
                                    )}
                                  </span>
                                </h2>

                                <small className="mr-3 text-secondary">
                                  <SVGIcon
                                    name="map-marker"
                                    width="16"
                                    type="fill"
                                    height="16"
                                    className="mr-2"
                                  ></SVGIcon>
                                  {item.address}
                                </small>
                              </div>

                              <div className="col-lg-2 d-flex align-items-center justify-content-start">
                                {item.amenities &&
                                  item.amenities.length > 0 && (
                                    <Amenities amenities={item.amenities} />
                                  )}
                              </div>

                              <div className="col-lg-2 d-flex align-items-center justify-content-center">
                                <button
                                  className="btn btn-link text-primary"
                                  onClick={() =>
                                    this.handleDetails(item.hotelCode)
                                  }
                                >
                                  Details
                                </button>
                              </div>

                              <div className="col-lg-2 d-flex align-items-center justify-content-end">
                                {item.hotelCode !== isRooms && (
                                  <button
                                    className="btn btn-sm btn-primary m-0 text-nowrap"
                                    onClick={() =>
                                      this.handleRooms(item.hotelCode)
                                    }
                                  >
                                    Select Rooms
                                  </button>
                                )}

                                {item.hotelCode === isRooms && (
                                  <button
                                    className="btn btn-sm btn-primary m-0 text-nowrap"
                                    onClick={() => this.handleRooms()}
                                  >
                                    Hide Rooms
                                  </button>
                                )}
                              </div>

                              {item.hotelCode === isRooms && (
                                <div className="col-lg-12 border mt-3">
                                  <div className="quick-book-cont">
                                    <div className="quick-book">
                                      <div className="rooms row">
                                        <div className="col-lg-12">
                                          {item.rooms &&
                                            item.rooms.map((room, key) => (
                                              <div
                                                className="border-bottom bg-white change-rooms"
                                                key={key}
                                              >
                                                <ul className="row list-unstyled m-0 no-gutters">
                                                  <li className="col-lg-5 p-2 d-flex align-items-center">
                                                    <b className="text-primary">
                                                      {room.name}
                                                    </b>
                                                  </li>

                                                  <li className="col-lg-3 p-2 d-flex align-items-center justify-content-center">
                                                    <div className="text-center room-pax-icons text-secondary"></div>
                                                  </li>

                                                  <li className="col-lg-2 text-center d-flex align-items-center justify-content-center"></li>

                                                  <li className="col-lg-2 p-2 d-flex align-items-center justify-content-end">
                                                    <button
                                                      className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap"
                                                      onClick={() =>
                                                        this.addItem(
                                                          item,
                                                          room.name
                                                        )
                                                      }
                                                    >
                                                      Add to {this.props.type === "Quotation"
                                                        ? Trans("_quotationReplaceKey")
                                                        : this.props.type === "Quotation_Master"
                                                          ? "Master " + Trans("_quotationReplaceKey")
                                                          : this.props.type === "Itinerary_Master"
                                                            ? "Master Itinerary" : this.props.type}
                                                    </button>
                                                  </li>
                                                </ul>
                                              </div>
                                            ))}

                                          {item.rooms &&
                                            item.rooms.length === 0 && (
                                              <div className="p-3">
                                                <div className="text-center text-primary text-capitalize d-inline">
                                                  No Rooms Found, You can add
                                                  Room manually.
                                                </div>
                                                <button
                                                  className="btn btn-sm btn-light m-0 text-primary d-flex border text-nowrap pull-right"
                                                  onClick={() =>
                                                    this.addItem(item, "")
                                                  }
                                                >
                                                  Add to {this.props.type === "Quotation"
                                                    ? Trans("_quotationReplaceKey")
                                                    : this.props.type === "Quotation_Master"
                                                      ? "Master " + Trans("_quotationReplaceKey")
                                                      : this.props.type === "Itinerary_Master"
                                                        ? "Master Itinerary" : this.props.type}
                                                </button>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {item.hotelCode === isDetails && (
                                <QuotationDetailsPopup
                                  details={{ name: item.hotelName, ...item }}
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
                            No Hotel(s) found! Please Add Manually
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

export default QuotationResultsMeta;
