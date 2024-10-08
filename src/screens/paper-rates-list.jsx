import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import Duration from "../assets/images/clock.svg";
import { Trans } from '../helpers/translate';
import ActionModal from "../helpers/action-modal";
import QuotationReportFilters from "../components/quotation/quotation-report-filters";
import moment from "moment";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import Amount from "../helpers/amount";
import Date from "../helpers/date";
import Loader from "../components/common/loader";
import Stops from "../components/common/stops";
import PaperRatesListFilter from "./paper-rates-list-filter";

class PaperRatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FromAirportCode: '',
      ToAirportCode: '',
      isRoundTrip: '',
      departStartDate: '',
      departEndDate: '',
      airlineName: '',
      supplier: '',
      departclass: '',
      stops: '',
      results: [],
      resultsExport: "",
      isDeleteConfirmPopup: false,
      isHideShowFilter: false,
      deleteItem: "",
      isImport: false,
      isFilters: false,
      currentPage: 0,
      pageSize: 10,
      totalRecords: 0,
      hasNextPage: false,
      isBtnLoading: true,
      isBtnLoadingExport: false,
      isBtnLoadingMode: "",
      notRecordFound: false,
      isshowauthorizepopup: false,
      searchBy: "",
      dateMode: "this-month",
      specificmonth: "1",
    };
    this.myRef = null;

  }
  componentDidMount() {
    this.getAuthToken();
  }
  getAuthToken = () => {
    if (this.props.match.params.filtermode) {
      this.setDefaultFilter(this.getPaperRates);
    }
    else {
      this.getPaperRates(false, undefined, "page-load");
    }
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      if (this.props.match.params.filtermode) {
        this.setDefaultFilter(this.getPaperRates);
      }
      else {
        this.getPaperRates(false, undefined, "page-load");
      }
    }); */
  };
  setDefaultFilter = (callback) => {
    let filter = this.state.filter;
    filter.fromDate = moment().format("YYYY-MM-DD");
    filter.toDate = moment().format("YYYY-MM-DD");
    filter.searchBy = "followupdate";
    filter.dateMode = "today";

    this.setState({ filter }, () => { callback(); });
  }

  getPaperRates = (isExport = false, callback, mode) => {
    if (isExport) {
      this.setState({ isBtnLoadingExport: true });
    }
    else
      this.setState({ totalRecords: 0, mode });

    var reqURL = "paperrates/list";
    let cPage = this.state.currentPage;
    let pSize = this.state.pageSize;
    var reqURL = "paperrates/list";
    const { FromAirportCode, ToAirportCode, isRoundTrip, departStartDate, departEndDate, airlineName, supplier, departclass, stops, searchBy, dateMode, specificmonth } = this.state;
    var reqOBJ = {
      // isRoundTrip: (isRoundTrip === "undefined" || isRoundTrip === "") ? null : null,
      isRoundTrip: isRoundTrip === "undefined" ? "" : isRoundTrip,
      FromAirportCode: FromAirportCode === "undefined" ? "" : FromAirportCode,
      ToAirportCode: ToAirportCode === "undefined" ? "" : ToAirportCode,
      // DepartFromDate: departStartDate === "undefined" ? "" : departStartDate,
      DepartFromDate: "",
      DepartToDate: "",
      // ReturnFromDate: departEndDate === "undefined" ? "" : departEndDate,
      ReturnFromDate: "",
      ReturnToDate: "",
      DepartAirline: airlineName === "undefined" ? "" : airlineName,
      ReturnAirline: airlineName === "undefined" ? "" : airlineName,
      supplier: supplier === "undefined" ? "" : supplier,
      class: departclass === "undefined" ? "" : departclass,
      stops: stops === "undefined" ? "" : stops,
      IsfromSearch: false,
      pageNo: cPage,
      pageSize: pSize,
      searchBy: searchBy,
      // dateMode: dateMode,
      dateMode: '',
      // specificmonth: specificmonth,
      specificmonth: '',
    };

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let results = this.state.results || [];
        if (mode === 'pageing') {
          results = results.concat(data.response);
        }
        else {
          results = data.response;
        }
        let notRecordFound = results <= 0 ? true : false;
        results.filter((x) => x.status === "deleted");
        let hasNextPage = true;
        if (
          data?.pageInfo?.totalRecords > (this.state.currentPage === 0 ? 1 : this.state.currentPage + 1) * this.state.pageSize
        ) {
          hasNextPage = true;
        } else {
          hasNextPage = false;
        }
        this.setState({
          results,
          totalRecords: data?.pageInfo?.totalRecords ?? 0,
          defaultResults: results,
          notRecordFound,
          hasNextPage,
          isBtnLoading: false,
          isBtnLoadingMode: "",
        });

      },
      "POST"
    );
  };
  deletePaperRates = (item) => {
    this.setState({
      deleteItem: item,
      isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
      currentPage: 0,
    });
  };
  confirmDeletePaperRates = () => {
    let deleteItem = this.state.deleteItem;
    let paperRateID = deleteItem.paperRateID;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "paperrates/delete";
    var reqOBJ = {
      paperrateid: paperRateID
    }
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      this.getPaperRates(false, undefined, "delete");
    });
  };
  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.confirmDeletePaperRates();
  };
  handlePaginationResults = (currentPage) => {
    this.setState({ isBtnLoadingMode: true, currentPage }, () =>
      this.getPaperRates(false, undefined, "pageing")
    );
  };
  editPaperRates = (item) => {
    this.props.history.push("/paperrates/" + item.paperRateID);
  };
  handlePaperRatesFilter = (state) => {
    const data = this.state;
    data.FromAirportCode = state.fromLocation.id;
    data.ToAirportCode = state.toLocation.id;
    if (state.data.isRoundTrip === "roundtrip")
      data.isRoundTrip = true;
    else if (state.data.isRoundTrip === "oneway")
      data.isRoundTrip = false;
    else
      data.isRoundTrip = null;
    data.departStartDate = state.data.departStartDate;
    data.departEndDate = state.data.departEndDate;
    data.airlineName = state.data.departAirlineName;
    data.supplier = state.data.supplier;
    data.departclass = state.data.departClass;
    data.stops = state.data.departStops;
    data.searchBy = state.data.searchBy;
    data.dateMode = state.data.dateMode;
    data.specificmonth = state.data.specificmonth;
    this.setState({ data });
    this.getPaperRates(false, undefined, "page-load");
  }
  showHideFilters = () => {
    this.setState({ isHideShowFilter: !this.state.isHideShowFilter })
  }
  closeFilters = () => {
    this.setState({ isHideShowFilter: false })
  }

  render() {
    const { results, isDeleteConfirmPopup, isFilters, currentPage, hasNextPage, isBtnLoading, isHideShowFilter, isBtnLoadingMode } = this.state;
    const { notAvailable } = "Not Available"
    const { userInfo } = this.props;
    return (
      <div className="quotation quotation-list">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              Manage Paper Rates
              <button
                className="btn btn-sm btn-primary pull-right mr-2"
                onClick={() => this.props.history.push(`/paperrates`)}
              >
                Create Paper Rates
              </button>
              <button
                className="btn btn-sm btn-light pull-right mr-2"
                onClick={this.showHideFilters}
              >
                Filters
              </button>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-2">
            {isHideShowFilter &&
              <PaperRatesListFilter
                handlePaperRatesFilter={this.handlePaperRatesFilter}
                closeFilters={this.closeFilters}
                filterType="adminList"
              />
            }
          </div>
        </div>
        {isBtnLoading &&
          <Loader />
        }
        <div className="container">
          <div className="mt-2">
            {results && !isBtnLoading && !this.state.notRecordFound && (
              <div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="bg-light border mb-2 pt-2 pb-2 pl-3 pr-3">
                      <div className="row">
                        <div className="col-lg-7">
                          <b>Paper Rates Details</b>
                        </div>
                        <div className="col-lg-2">
                          <b>Availability</b>
                        </div>
                        <div className="col-lg-2">
                          <b>Rate</b>
                        </div>
                        <div className="col-lg-1">
                          <b>Action</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {results.map((item, key) => {
                  return (
                    <React.Fragment>
                      <div
                        key={key}
                        className="border-bottom card mb-2 pl-3 pr-3 pt-3 position-relative"
                      >
                        <div className="row quotation-list-item card-body">
                          <div className="col-lg-7">
                            <div className="row">
                              <div className="col-lg-12 d-flex justify-content-start">
                                {item.isRoundTrip &&
                                  <button
                                    className="p-0 m-0 pb-2 btn btn-sm btn-muted text-secondary font-weight-bold"
                                  >
                                    Round trip
                                  </button>
                                }
                                {!item.isRoundTrip &&
                                  <button
                                    className="p-0 m-0 pb-2 btn btn-sm btn-muted text-secondary font-weight-bold"
                                  >
                                    One Way
                                  </button>
                                }
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-5">
                                <h5 className="text-primary">{item.fromAirportName}</h5>
                              </div>
                              <div className="col-lg-2  text-center">
                                <small >
                                  <img
                                    className="pb-1"
                                    style={{ filter: "none", height: "16px" }}
                                    src={Duration}
                                    alt=""
                                  />
                                  {item.departDuration !== "h m" ? " " + item.departDuration : "  0h 0m"}
                                </small>
                                <Stops  {...[item.departStops]} />
                                <small>{item.departStops ? item.departStops + "  stops " : "Non stop "}</small>
                              </div>
                              <div className="col-lg-5 d-flex justify-content-end">
                                <h5 className="text-primary">{item.toAirportName}</h5>
                              </div>
                              <div className="col-lg-5">
                                <h6 className="text-secondary">{item.fromLocation} ({item.fromAirportCode})</h6>
                              </div>
                              <div className="col-lg-2">
                                <hr className="border-0"></hr>
                              </div>
                              <div className="col-lg-5 d-flex justify-content-end">
                                <h6 className="text-secondary">{item.toLocation} ({item.toAirportCode})</h6>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-5">
                                <small>Departure : <Date
                                  date={item.departFromDate}
                                  format="shortDate"
                                />

                                  {" "} <Date date={item.departFromDate} format="shortTime" />

                                </small>
                              </div>
                              <div className="col-lg-2">
                                {/* <small>Class : {item.departClass}</small> */}
                              </div>
                              <div className="col-lg-5 d-flex justify-content-end">
                                <small>Arrival : <Date
                                  date={item.departToDate}
                                  format="shortDate"
                                />
                                  {" "} <Date date={item.departToDate} format="shortTime" />
                                </small>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-5">
                                <small>Airline : {item.departAirline} ({item.departClass})</small>
                              </div>
                              <div className="col-lg-2">
                                {/* <small>Class : {item.departClass}</small> */}
                              </div>
                              <div className="col-lg-5 d-flex justify-content-end">
                                <small>Flight Number : {item.departFlightNumber ? item.departFlightNumber : "N/A"}</small>
                              </div>
                            </div>
                            {item.isRoundTrip &&
                              <React.Fragment>
                                <div className="row mt-5">
                                  <div className="col-lg-5">
                                    <h5 className="text-primary">{item.toAirportName}</h5>
                                  </div>
                                  <div className="col-lg-2 text-center">
                                    <small >
                                      <img
                                        className="pb-1"
                                        style={{ filter: "none", height: "16px" }}
                                        src={Duration}
                                        alt=""
                                      />
                                      {item.returnDuration !== "h m" ? " " + item.returnDuration : " 0h 0m"}
                                    </small>
                                    <Stops {...[item.returnStops]} />
                                    <small>{item.returnStops ? item.returnStops + "  stops" : "nonstop"}</small>
                                  </div>
                                  <div className="col-lg-5 d-flex justify-content-end">
                                    <h5 className="text-primary">{item.fromAirportName}</h5>
                                  </div>

                                  <div className="col-lg-6 d-flex justify-content-start">
                                    <h6 className="text-secondary">{item.toLocation} ({item.toAirportCode})</h6>
                                  </div>
                                  <div className="col-lg-6 d-flex justify-content-end">
                                    <h6 className="text-secondary">{item.fromLocation} ({item.fromAirportCode})</h6>
                                  </div>

                                </div>
                                <div className="row">
                                  <div className="col-lg-6 d-flex justify-content-start">
                                    <small>Departure : <Date
                                      date={item.returnFromDate}
                                      format="shortDate"
                                    />
                                      {" "} <Date date={item.returnFromDate} format="shortTime" />
                                    </small>
                                  </div>
                                  <div className="col-lg-6 d-flex justify-content-end">
                                    <small>Arrival : <Date
                                      date={item.returnToDate}
                                      format="shortDate"
                                    />
                                      {" "} <Date date={item.returnToDate} format="shortTime" />
                                    </small>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6 d-flex justify-content-start">
                                    <small>Airline : {item.returnAirline} ({item.returnClass})</small>
                                  </div>

                                  <div className="col-lg-6 d-flex justify-content-end">
                                    <small>Flight Number : {item.returnFlightNumber ? item.returnFlightNumber : "N/A"}</small>
                                  </div>
                                </div>
                              </React.Fragment>
                            }

                          </div>
                          <div className="col-lg-2 d-flex align-items-center pb-3">
                            <ul class="list-group list-group-flush">
                              <li class="list-group-item d-flex justify-content-between align-items-center pr-3 text-secondary font-weight-bold">
                                Hold :
                                <span class="ml-1 badge  badge-pill">{item.onHold}</span>
                              </li>
                              <li class="list-group-item d-flex justify-content-between align-items-center pr-3 text-secondary font-weight-bold">
                                Booked :
                                <span class="ml-1 badge  badge-pill">{item.blocked}</span>
                              </li>
                              <li class="list-group-item d-flex justify-content-between align-items-center pr-3 text-secondary font-weight-bold">
                                Available :
                                <span class="ml-1 badge  badge-pill">{item.availableSeats}</span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-2 d-flex align-items-center pb-3 font-weight-bold text-primary">
                            <Amount amount={item.sellPrice} />
                          </div>
                          <div className="col-lg-1 d-flex align-items-center pb-3 justify-content-end">
                            <React.Fragment>
                              <div className="custom-dropdown-btn position-relative">
                                <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center">
                                  <div className="border-right pr-2">Actions</div>
                                  <SVGIcon
                                    name="angle-arrow-down"
                                    width="8"
                                    height="8"
                                    className="ml-2"
                                  ></SVGIcon>
                                </button>

                                <div className="custom-dropdown-btn-menu position-absolute">
                                  <ul className="list-unstyled border bg-white shadow-sm p-2 rounded">

                                    <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.editPaperRates(item)}
                                        >
                                          Edit
                                        </button>
                                      </li>
                                    </AuthorizeComponent>
                                    <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions} >
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.deletePaperRates(item)}
                                        >
                                          Delete
                                        </button>
                                      </li>
                                    </AuthorizeComponent>
                                  </ul>
                                </div>
                              </div>
                            </React.Fragment>
                          </div>
                        </div>

                      </div>
                    </React.Fragment>
                  );
                })}
                {isDeleteConfirmPopup && (
                  <ActionModal
                    title="Confirm Delete"
                    message="Are you sure you want to delete this item?"
                    positiveButtonText="Confirm"
                    onPositiveButton={() => this.handleConfirmDelete(true)}
                    handleHide={() => this.handleConfirmDelete(false)}
                  />
                )}
              </div>

            )}
            {this.state.notRecordFound &&
              <div>
                <div className="pl-3 pr-3 pt-3 position-relative">
                  <div className="row quotation-list-item d-flex justify-content-center">
                    <div className="col-lg-12 pb-3">
                      <h6 className="ml-3">No Flight Paper Rate(s) found</h6>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li
                className="page-item"
                style={{
                  display: "flex",
                  "justifyContent": "space-between",
                  "flexGrow": "2",
                }}
              >
                {!isBtnLoading && !this.state.notRecordFound &&
                  <span className="text-primary">
                    Showing{" "}{(this.state.currentPage + 1) * this.state.pageSize > this.state.totalRecords
                      ? this.state.totalRecords
                      : (this.state.currentPage + 1) * this.state.pageSize}{" "} out of {this.state.totalRecords}
                  </span>
                }
                <button
                  className={"page-link" + (!hasNextPage ? " d-none" : "")}
                  onClick={() => this.handlePaginationResults(currentPage + 1)}
                >
                  {isBtnLoadingMode && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Show More
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
  }
}
export default PaperRatesList;