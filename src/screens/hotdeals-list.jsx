import React, { Component } from "react";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import moment from "moment";

import PackagePrint from "./package-print";
import QuotationListLoading from "../components/quotation/quotation-list-loading";
import ActionModal from "../helpers/action-modal";
import DateComp from "../helpers/date";
import * as Global from "../helpers/global";
import Amount from "../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import InquiryView from "../components/quotation/inquiry-view";
import ModelPopup from "../helpers/model";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import SVGIcon from "../helpers/svg-icon";
import PackageListFilters from "./hotdeals-list-filters";
import PackageAppliedFilter from "../components/quotation/package-filter-applied";
import onlineBooking from "../assets/images/customer-portal/template-images/DeleteSVG.svg";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";

class HotDealsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteURL: "",
      results: [],
      resultsExport: "",
      isDeleteConfirmPopup: false,
      deleteItem: 0,
      type: "Itinerary",
      importItineraries: "",
      isImport: false,
      isFilters: false,
      currentPage: 0,
      pageSize: 30,
      totalRecords: 0,
      hasNextPage: false,
      isBtnLoading: true,
      isBtnLoadingExport: false,
      isViewInquiry: false,
      filter: {
        packagename: "",
        packagetheme: "0",
        customername: "",
        email: "",
        phone: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "this-month",
        specificmonth: "1",
        searchBy: "createddate",
        rating: 0
      },
      isshowauthorizepopup: false,
      itemtoview: "",
    };
    this.myRef = null;
  }
  componentDidMount() {
    this.getPackageDetails();
  }
  getBasicData = () => {

    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        if (data.response[0].isCMSPortalCreated === "true")
          this.getPackageDetails(data.response[0].customHomeURL.toLowerCase());
        //this.setState({ isLoading: false, portalURL: data.response[0].customHomeURL.toLowerCase().replace("http://", "https://"), isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true" });
      }, 'GET');
  }
  getPackageDetails = (mode) => {
    this.setState({
      totalRecords: 0,
      isBtnLoading: mode === "pageing" ? this.state.isBtnLoading : true,
      isBtnLoadingPageing: mode === "pageing" ? true : this.state.isBtnLoadingPageing,
      isLoading: true
    });
    var reqURL =
      "cms/package/getall?page=" +
      this.state.currentPage +
      "&records=" +
      this.state.pageSize;
    if (this.state.filter.packagename)
      reqURL += "&packagename=" + this.state.filter.packagename;
    if (this.props.isFromContentManager)
      reqURL += "&siteurl=" + (this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "") + "/cms");
    if (this.state.filter.packagetheme || this.props.isFromContentManager)
      reqURL += "&packagetheme=" + (this.props.isFromContentManager ? this.props.dealsType : this.state.filter.packagetheme);
    if (this.state.filter.customername)
      reqURL += "&customername=" + this.state.filter.customername;
    if (this.state.filter.email)
      reqURL += "&email=" + this.state.filter.email;
    if (this.state.filter.phone)
      reqURL += "&phone=" + this.state.filter.phone;
    if (this.state.filter.rating > 0)
      reqURL += "&rating=" + this.state.filter.rating;
    if (this.state.filter.fromDate)
      reqURL += "&datefrom=" + this.state.filter.fromDate;
    if (this.state.filter.toDate)
      reqURL += "&dateto=" + this.state.filter.toDate;
    reqURL += "&datemode=" + this.state.filter.dateMode;
    reqURL += "&searchby=" + this.state.filter.searchBy;
    //reqURL += "&groupby=nogroup";//+this.state.filter.groupBy;
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;

    const reqOBJ = {};
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      let results = this.state.results || [];
      if (mode === 'pageing')
        results = results.concat(resonsedata.response);
      else
        results = resonsedata.response;
      let hasNextPage = true;
      if (resonsedata?.paging?.totalRecords > results.length) {
        hasNextPage = true;
      } else {
        hasNextPage = false;
      }
      //this.setState({ results: resonsedata.response, isLoading: false, isBtnLoading: false });
      this.setState({
        results,
        defaultResults: results,
        hasNextPage,
        totalRecords: resonsedata?.paging?.totalRecords ?? 0,
        isBtnLoading: mode === "pageing" ? this.state.isBtnLoading : false,
        isBtnLoadingPageing: mode === "pageing" ? false : this.state.isBtnLoadingPageing
      });
    }.bind(this), "GET");
  }
  RedirectToList = () => {
    this.props.history.push(`/HotdealsList`);
  };


  viewDetailsMode = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { ///PackageList~packages-preview-package
      window.open(`/HotdealsView/${btoa(id)}`);
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };
  deletePackage = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { ///PackageList~packages-delete-package
      this.setState({
        deleteItem: id,
        isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
        currentPage: 0,
      });
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  handleConfirmDeletePackage = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { //PackageList~packages-delete-package
      this.setState({ isLoading: true });
      const reqOBJ = {
        request: {
          SpecialPromotionID: this.state.deleteItem
        },
      };
      let reqURL = "cms/package/delete";
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        this.getPackageDetails();
      }.bind(this), "POST");
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };
  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.handleConfirmDeletePackage();
  };

  confirmDeletePackage = () => {
    let deleteItem = this.state.deleteItem;
    deleteItem.id = deleteItem.specialPromotionID;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "cms/package/delete";
    var reqOBJ = deleteItem;
    apiRequester_unified_api(reqURL, reqOBJ, () => {
      this.getPackageDetails();
    });
  };

  getExportInquries = () => {
    this.getPackageDetails(true, this.exportInquries);
  }


  setDefaultFilter = (callback) => {
    let filter = this.state.filter;

    filter.fromDate = moment().format('YYYY-MM-DD');
    filter.toDate = moment().format('YYYY-MM-DD');
    filter.searchBy = "bookbefore";
    filter.dateMode = "today";

    this.setState({ filter }, () => { callback(false, 'initial-load') });
  }
  showHideFilters = () => {
    this.setState({ isFilters: !this.state.isFilters });
  };

  handleFilters = (data) => {
    let filter = this.state.filter;
    filter["packagename"] = data["packagename"] ? data["packagename"] : "";
    filter["customername"] = data["customername"] ? data["customername"] : "";
    filter["packagetheme"] = data["packagetheme"] ? data["packagetheme"] : "0";
    filter["email"] = data["email"] ? data["email"] : "";
    filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
    filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "";
    filter["fromDate"] = data["fromDate"] ?
      moment(new Date(data["fromDate"])).format(Global.DateFormate) : null;
    filter["toDate"] = data["toDate"] ?
      moment(new Date(data["toDate"])).format(Global.DateFormate) : null;
    filter["phone"] = data["phone"] ? data["phone"] : "";
    //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"inquirytype";
    filter["rating"] = data["rating"] ? parseInt(data["rating"]) : 0;
    filter["specificmonth"] = data.specificmonth;

    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getPackageDetails('filter'));

  };

  handlePaginationResults = (currentPage) => {
    this.setState({ currentPage }, () =>
      this.getPackageDetails('pageing')
    );
  };

  actionHide = () => {
    this.setState({ showPrint: false, showPDF: false, printData: {} });
  }

  generateStartRating = (rating) => {
    return rating > 0 && [...Array(parseInt(rating, 10)).keys()].map(item => {
      return <SVGIcon
        name="star"
        key={item}
        type="fill"
        width="14"
        height="14"
        className="text-primary"
      ></SVGIcon>
    })
  }

  removeFilter = (filterName) => {
    let filter = this.state.filter;
    filter[filterName] = "";
    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getPackageDetails("filter"));
    this.handleFilters(filter);
    this.myRef.setDefaultFilter();
  }

  handleCreateEditLocation = (id) => {
    let state = this.state;
    this.props.handleCreateEditLocation(state, id);
  }

  handleShowHideForm = (flag) => {
    this.props.handleShowHideForm(flag);
  }

  render() {
    const {
      results,
      isDeleteConfirmPopup,
      isFilters,
      currentPage,
      hasNextPage,
      isBtnLoading,
      isBtnLoadingExport,
      isViewInquiry,
    } = this.state;
    const { userInfo, isFromContentManager } = this.props;
    let renderDataH = [];
    if (results)
      renderDataH = results.filter(x => x.packagethemeid === 1);
    let renderDataF = [];
    if (results)
      renderDataF = results.filter(x => x.packagethemeid === 2);
    let renderDataL = [];
    if (results)
      renderDataL = results.filter(x => x.packagethemeid === 3);
    return (
      <div className="quotation quotation-list">
        <div className={isFromContentManager ? "border-bottom pt-1 pb-1 mb-3" : "title-bg pt-3 pb-3 mb-3"}>
          <div className="container">
            <h1 className={isFromContentManager ? "text-dark m-0 p-0 f30" : "text-white m-0 p-0 f30"}>
              {!isFromContentManager && <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>}
              {"Manage" + (this.props.isFromContentManager ? this.props.dealsType === 3 ? " Packages" : " Deals " : " Deals")}
              {/* <AuthorizeComponent title="InquiryList~inquiries-export-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                        {localStorage.getItem("userToken") &&
                          <React.Fragment>
                            {isBtnLoadingExport &&
                              <button
                                className="btn btn-sm btn-primary pull-right"
                              >
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                Export Packages
                              </button>
                            }
                            {!isBtnLoadingExport &&
                              <button
                                className="btn btn-sm btn-primary pull-right"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "InquiryList~inquiries-export-inquiries") ? this.getExportInquries() : this.setState({ isshowauthorizepopup: true })}
                              >

                                Export Packages
                              </button>
                            }
                          </React.Fragment>
                        }
                      </AuthorizeComponent> */}
              <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={userInfo.rolePermissions}>
                <button
                  className="btn btn-sm btn-primary pull-right mr-2"
                  onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(0) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~dashboard") ? this.props.history.push(`/hotdeals/add`) : this.setState({ isshowauthorizepopup: true })}
                >
                  {"Create" + (this.props.isFromContentManager ? this.props.dealsType === 3 ? " Packages" : " Deals " : " Deals")}
                </button>
              </AuthorizeComponent>
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
          {results && isFilters && (
            <PackageListFilters
              onRef={ref => (this.myRef = ref)}
              handleFilters={this.handleFilters}
              showHideFilters={this.showHideFilters}
              filterData={this.state.filter}
              //groupByfilter={this.state.filter.groupBy}
              filterMode={this.props.match.params.filtermode}
              isFromContentManager={isFromContentManager}
            />
          )}
          {<PackageAppliedFilter
            filterData={this.state.filter}
            removeFilter={this.removeFilter}
          />}
          {isFromContentManager && (
            <div className="row mt-4">
              {results && results.length > 0 && results.map((item, index) => {
                return (
                  <div className="col-lg-4 pull-left">
                    <div className="mb-4 card tw-offers-card shadow border-0" key={index}>
                      <a href={`/hotdeals/Edit/` + item.specialPromotionID}>
                        <img className="w-100" style={{ height: "200px" }} src={item?.smallImagePath.indexOf(".s3.") > 0 ? item?.smallImagePath : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + item?.portalID + "/SpecialsPromotions/images/" + item?.smallImagePath} />
                      </a>
                      <button
                        className="btn btn-primary tw-offers-card-btn"
                        onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(item.specialPromotionID) : this.props.history.push(`/hotdeals/Edit/` + item.specialPromotionID)}
                      >
                        {item.shortDescription}
                      </button>
                      <button
                        className="btn btn-sm position-absolute text-nowrap p-0" style={{ right: "-10px", top: "-10px" }}
                        onClick={() => this.deletePackage(item.specialPromotionID)}
                      >
                        <img style={{ width: "22px" }} src={onlineBooking} alt="" />
                      </button>
                    </div>
                  </div>
                )
              })
              }
            </div>
          )}
          {!isFromContentManager && (
            <div className="border mt-2">

              {results && (
                <div>
                  <div className="row quotation-list-grid-header">
                    <div className="col-lg-12">
                      <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                        <div className="row">
                          <div className="col-lg-2">
                            <b>Type</b>
                          </div>

                          <div className="col-lg-4">
                            <b>Deal Details</b>
                          </div>

                          <div className="col-lg-5">
                            <b>Summary</b>
                          </div>

                          <div className="col-lg-1">
                            <b>Actions</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {renderDataH.map((item, key) => {
                    return (
                      <div key={key} className="border-bottom pl-3 pr-3 pt-3">
                        <div className="row quotation-list-item">
                          <div className="col-lg-2">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                {item.packagethemeid === 1 ? "Popular Hotels" : item.packagethemeid === 2 ? "Visa Destination" : "Popular Flights"}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-4 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                <b className="text-primary">{item.shortDescription.toUpperCase()}</b>
                              </span>
                              <span className="text-secondary mr-3">
                                {item.validFrom && (
                                  <small>
                                    <DateComp date={item.validFrom}></DateComp>
                                  </small>
                                )}

                                {item.validTo && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      -{" "}
                                    </span>
                                    <DateComp date={item.validTo}></DateComp>
                                  </small>
                                )}
                                {/* 
                                      {item.city && (
                                        <small>
                                          <span className="quotation-list-item-sprt">
                                            {" "}
                                            |{" "}
                                          </span>
                                          {item.city}
                                        </small>
                                      )} */}

                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>
                                  <Amount amount={isNaN(item.price) ? 0 : item.price} currencySymbol={item.currencyCode}></Amount>
                                </small>
                                {item.rating > 0 && (<small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>{this.generateStartRating(item.rating)}
                                </small>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="col-lg-5 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block" title={item.summaryDescription}>
                                {item.summaryDescription.length > 125 ? <HtmlParser text={decode(item.summaryDescription).substring(0, 125)} /> + "..." : <HtmlParser text={decode(item.summaryDescription)} />}
                              </span>
                            </div>
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
                                    <li>
                                      <button
                                        className="btn btn-sm text-nowrap w-100 text-left"
                                        //onClick={() => this.ViewInquiry(item)}
                                        onClick={() => this.viewDetailsMode(item.specialPromotionID)}
                                      >
                                        View Deal
                                      </button>
                                    </li>
                                    <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.props.history.push(`/hotdeals/Edit/` + item.specialPromotionID)}
                                        >
                                          Edit Deal
                                        </button>
                                      </li>
                                    </AuthorizeComponent>

                                    <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.deletePackage(item.specialPromotionID)}
                                        >
                                          Delete Deal
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
                    );
                  })}

                  {renderDataF.map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="border-bottom pl-3 pr-3 pt-3"
                      >
                        <div className="row quotation-list-item">
                          <div className="col-lg-2">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                {item.packagethemeid === 1 ? "Popular Hotels" : item.packagethemeid === 2 ? "Visa Destination" : "Popular Flights"}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-4 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                <b className="text-primary">{item.shortDescription.toUpperCase()}</b>
                              </span>
                              <span className="text-secondary mr-3">
                                {item.validFrom && (
                                  <small>
                                    <DateComp date={item.validFrom}></DateComp>
                                  </small>
                                )}

                                {item.validTo && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      -{" "}
                                    </span>
                                    <DateComp date={item.validTo}></DateComp>
                                  </small>
                                )}
                                {/* 
                                      {item.city && (
                                        <small>
                                          <span className="quotation-list-item-sprt">
                                            {" "}
                                            |{" "}
                                          </span>
                                          {item.city}
                                        </small>
                                      )} */}

                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>
                                  <Amount amount={isNaN(item.price) ? 0 : item.price} currencySymbol={item.currencyCode}></Amount>
                                </small>
                                {item.rating > 0 && (<small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>{this.generateStartRating(item.rating)}
                                </small>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="col-lg-5 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block" title={item.summaryDescription}>
                                {item.summaryDescription.length > 125 ? <HtmlParser text={decode(item.summaryDescription).substring(0, 125)} /> + "..." : <HtmlParser text={decode(item.summaryDescription)} />}
                              </span>
                            </div>
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
                                    <li>
                                      <button
                                        className="btn btn-sm text-nowrap w-100 text-left"
                                        //onClick={() => this.ViewInquiry(item)}
                                        onClick={() => this.viewDetailsMode(item.specialPromotionID)}
                                      >
                                        View Deal
                                      </button>
                                    </li>
                                    <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.props.history.push(`/hotdeals/Edit/` + item.specialPromotionID)}
                                        >
                                          Edit Deal
                                        </button>
                                      </li>
                                    </AuthorizeComponent>

                                    <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.deletePackage(item.specialPromotionID)}
                                        >
                                          Delete Deal
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
                    );
                  })}

                  {renderDataL.map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="border-bottom pl-3 pr-3 pt-3"
                      >
                        <div className="row quotation-list-item">
                          <div className="col-lg-2">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                {item.packagethemeid === 1 ? "Popular Hotels" : item.packagethemeid === 2 ? "Visa Destination" : "Popular Flights"}
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-4 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                <b className="text-primary">{item.shortDescription.toUpperCase()}</b>
                              </span>
                              <span className="text-secondary mr-3">
                                {item.validFrom && (
                                  <small>
                                    <DateComp date={item.validFrom}></DateComp>
                                  </small>
                                )}

                                {item.validTo && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      -{" "}
                                    </span>
                                    <DateComp date={item.validTo}></DateComp>
                                  </small>
                                )}
                                {/* 
                                      {item.city && (
                                        <small>
                                          <span className="quotation-list-item-sprt">
                                            {" "}
                                            |{" "}
                                          </span>
                                          {item.city}
                                        </small>
                                      )} */}

                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>
                                  <Amount amount={isNaN(item.price) ? 0 : item.price} currencySymbol={item.currencyCode}></Amount>
                                </small>
                                {item.rating > 0 && (<small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>{this.generateStartRating(item.rating)}
                                </small>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="col-lg-5 d-flex align-items-center pb-3">
                            <div>
                              <span className="text-secondary mr-3 d-block" title={item.summaryDescription}>
                                {item.summaryDescription.length > 125 ? <HtmlParser text={decode(item.summaryDescription).substring(0, 125)} /> + "..." : <HtmlParser text={decode(item.summaryDescription)} />}
                              </span>
                            </div>
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
                                    <li>
                                      <button
                                        className="btn btn-sm text-nowrap w-100 text-left"
                                        //onClick={() => this.ViewInquiry(item)}
                                        onClick={() => this.viewDetailsMode(item.specialPromotionID)}
                                      >
                                        View Deal
                                      </button>
                                    </li>
                                    <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.props.history.push(`/hotdeals/Edit/` + item.specialPromotionID)}
                                        >
                                          Edit Deal
                                        </button>
                                      </li>
                                    </AuthorizeComponent>

                                    <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.deletePackage(item.specialPromotionID)}
                                        >
                                          Delete Deal
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
                    );
                  })}

                  {isViewInquiry && (
                    <ModelPopup
                      header={this.state.itemtoview.title}
                      content={<InquiryView
                        item={this.state.itemtoview}
                        handleHide={this.handleHidePopup}
                        userInfo={this.props.userInfo}
                      />
                      }
                      handleHide={this.handleHidePopup}
                    />
                  )}

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
              {isBtnLoading && <QuotationListLoading />}
              {!isBtnLoading && results.length === 0 && (
                <div className="p-4 text-center">No Deals Found.</div>
              )}
            </div>
          )}

          {isDeleteConfirmPopup && (
            <ActionModal
              title="Confirm Delete"
              message="Are you sure you want to delete this item?"
              positiveButtonText="Confirm"
              onPositiveButton={() => this.handleConfirmDelete(true)}
              handleHide={() => this.handleConfirmDelete(false)}
            />
          )}

          <nav className={isFromContentManager ? "row col-lg-12" : ""}>
            <ul className={isFromContentManager ? "col-lg-12 pagination justify-content-center mt-3" : "pagination justify-content-center mt-3"}>
              <li
                className={
                  this.state.totalRecords > 0 ? "page-item" : "page-item disabled d-none"
                }
                style={{
                  "display": "flex",
                  "justify-content": "space-between",
                  "flex-grow": "2"
                }}
              >
                {!isBtnLoading &&
                  <span className="text-primary">Showing {((this.state.currentPage + 1) * this.state.pageSize) > this.state.totalRecords ? this.state.totalRecords : ((this.state.currentPage + 1) * this.state.pageSize)} out of {this.state.totalRecords}</span>}
                <button
                  className={"page-link" + (!hasNextPage ? " d-none" : "")}
                  onClick={() => this.handlePaginationResults(currentPage + 1)}
                >
                  {isBtnLoading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Show More
                </button>
                <div></div>
              </li>
            </ul>
          </nav>
        </div>

        {this.state.isImport && (
          <div className="model-popup">
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Import Itinerary</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={this.props.hideQuickBook}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="border">
                      {this.state.importItineraries &&
                        this.state.importItineraries.map((item, key) => (
                          <div key={key}>
                            <div className="border-bottom p-2">
                              <div className="row">
                                <div className="col-lg-4">{item.data.name}</div>
                                <div className="col-lg-4">
                                  {item.data.duration}
                                </div>
                                <div className="col-lg-2">
                                  <button className="btn btn-sm border p-2">
                                    Import
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}

        {this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }

        {this.state.showPrint &&
          <div style={{ display: "none" }}>
            < PackagePrint actionHide={this.actionHide} printData={true} customerData={this.state.customerData} />
          </div>
        }
        {this.state.showPDF &&
          <div>
            < PackagePrint actionHide={this.actionHide} printData={false} customerData={this.state.customerData} />
          </div>
        }
      </div>
      // <div className="container">
      //     <div className="row">
      //         <div className="col-lg-3 hideMenu">
      //         <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
      //         </div>
      //     <div className="col-lg-9">
      //         {isLoading && (
      //                 <div className="container ">
      //                     <Loader />
      //                 </div>
      //         )}
      //         {!isLoading && results && results.length > 0 && results.map((item, index) => {
      //             return (
      //                 <div className="col-lg-4 pull-left">
      //                   <div className="mb-4 card tw-offers-card shadow border-0" key={index}>
      //                     {/* <div className="card-header">
      //                       <h6 className="m-0 p-0">{item.shortDescription}</h6>
      //                     </div>
      //                     <div className="card-body">
      //                       <p className="card-text">
      //                         {item.shortDescription}
      //                       </p>
      //                     </div> */}
      //                       <a target="_blank" href={"#"}>
      //                         <img className="w-100" src={item.smallImagePath} />
      //                       </a>
      //                     <button
      //                       className="btn btn-primary tw-offers-card-btn"
      //                       onClick={() => this.props.history.push(`/Package/Edit/` + item.specialPromotionID)}
      //                     >
      //                     {item.shortDescription}
      //                     </button>
      //                   </div>
      //                   </div>
      //         )})
      //     }
      //     </div>
      //     </div>
      // </div>
    );
  }
}
export default HotDealsList;
