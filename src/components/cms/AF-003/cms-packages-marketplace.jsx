import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import SVGIcon from "../../../helpers/svg-icon";
import * as Global from "../../../helpers/global";
import { apiRequester_unified_api } from "../../../services/requester-unified-api";
import PackageListFilters from "./cms-package-filters";
import PackageAppliedFilter from "../../../components/quotation/package-filter-applied";
import PlainTextComponent from "../../../components/cms/plain-text-from-html";
import Config from "../../../config.json";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import PriceConverter from "../../common/PriceConverter";

class CMSPackagesMarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteURL: "",
      results: props.cmsContents.marketplacePackages.getMarketplacePackageData,
      resultsExport: "",
      isDeleteConfirmPopup: false,
      deleteItem: 0,
      type: "Itinerary",
      importItineraries: "",
      isImport: false,
      isFilters: false,
      currentPage: 0,
      pageSize: props.cmsContents.marketplacePackages.paging.records,
      totalRecords: props.cmsContents.marketplacePackages.paging.totalRecords,
      hasNextPage: props.cmsContents.marketplacePackages.paging.totalRecords > 16 ? true : false,
      isBtnLoading: false,
      isBtnLoadingExport: false,
      isViewInquiry: false,
      filter: {
        packagename: "",
        customername: "",
        email: "",
        phone: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "this-year",
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
    //this.getPackageDetails();
  }
  getPackageDetails = (mode) => {
    this.setState({
      isBtnLoading: true,
      isBtnLoadingPageing: true,
      isLoading: true
    });
    var reqURL =
      "cms/marketplace/package/list?page=" +
      this.state.currentPage +
      "&records=" +
      this.state.pageSize;
    if (this.state.filter.packagename)
      reqURL += "&packagename=" + this.state.filter.packagename;
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
  goToList = () => {
    this.props.history.push(`/marketplace`);
  };

  removeFilter = (filterName) => {
    let filter = this.state.filter;
    filter[filterName] = "";
    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getPackageDetails("filter"));
    this.handleFilters(filter);
    this.myRef.setDefaultFilter();
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
      isViewInquiry
    } = this.state;
    const { userInfo } = this.props;
    const scss = `p.small.text-secondary.mb-0 p {
  margin: 0px;
}`
    //let imageURL =  process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";
    return (
      <div className="cp-home-marketplace cp-home-marketplace" style={{ background: "#eaeeee" }}>
        <style>{scss}</style>
        <div className="container">
          <h2 className="mb-5 font-weight-bold ">Packages
            <button
              className="btn btn-sm btn-light pull-right mr-2 d-none"
              onClick={this.showHideFilters}
            >
              Filters
            </button></h2>
          <div className="row1 d-none">
            <div className="clo-lg-12">
              {/* <h2 className="mb-4 font-weight-bold text-white">Popular Deals</h2> */}
              {results && isFilters && (
                <PackageListFilters
                  onRef={ref => (this.myRef = ref)}
                  handleFilters={this.handleFilters}
                  showHideFilters={this.showHideFilters}
                  filterData={this.state.filter}
                  isFromMarketplace={true}
                  isHidePackageType={true}
                //groupByfilter={this.state.filter.groupBy}
                // filterMode={this.props.match.params.filtermode}
                />
              )}
              {<PackageAppliedFilter
                filterData={this.state.filter}
                removeFilter={this.removeFilter}
              />}
            </div>
          </div>

          <div className="row">
            {results &&
              results.map((x, key) => {
                // Render the element only if key is less than 5
                const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: this.props.ipCurrencyCode });
                if (key < 4) {
                  return (
                    <div key={key} className="col-lg-3 mb-4">
                      <div className="bg-white populer-marketplace populer-marketplace">
                        <div className="clo-lg-12 d-block border border-3 border-white">
                          <img
                            class="img-fluid"
                            src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + x?.portalID + "/SpecialsPromotions/images/" + x?.smallImagePath}
                            alt={x?.shortDescription}
                          />
                        </div>
                        <div className="p-2 populer-marketplace-content bg-white" style={{ minHeight: "195px" }}>
                          <h5 className="font-weight-bold mb-3">
                            <Link to={"/details/deals/" + x?.specialPromotionID}>
                              {x?.shortDescription}
                            </Link>
                          </h5>
                          <div className="clo-lg-12 d-block">
                            <p className="small text-secondary mb-0">
                              {/* <HtmlParser text={decode(x?.summaryDescription)} /> */}
                              <PlainTextComponent htmlString={decode(x?.summaryDescription)} />
                            </p>
                          </div>
                          <div className="clo-lg-12 mt-2 mb-2 font-weight-bold price">
                            {x?.price > 0 && "Starting at "}
                            {x?.price > 0 && (<span className=" ml-2 font-weight-bold" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                              {(convertedCurrency + " ") + convertedPrice}
                            </span>
                            )}
                            {x?.offerPrice > 0 && (<span className="text-white ml-2 font-weight-bold " style={{ marginLeft: '.5rem' }}>
                              {(Config.codebaseType === "tourwiz-marketplace" ? x?.symbol === "Rs" ? "INR " : x?.symbol : x?.symbol === "Rs" ? "INR " : x?.symbol + " ") + x?.offerPrice}
                            </span>
                            )}
                          </div>
                          <div className="clo-lg-12 d-block mt-3" style={{ position: "absolute", bottom: "10px", width: "238px" }}>
                            <Link className="btn btn-lg more btn-primary mt-1 pt-1 pb-1 shadow w-100 text-center" to={"/details/deals/" + x?.specialPromotionID}>More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

          </div>
          <div>

            <nav>
              <ul className="pagination justify-content-center mt-3">
                <li
                  className={
                    this.state.totalRecords > 0 ? "page-item" : "page-item disabled d-none"
                  }
                  style={{
                    "display": "flex",
                    "justify-content": "space-between",
                    // "flex-grow": "2"
                  }}
                >
                  {!isBtnLoading && false &&
                    <span className="text-primary">Showing {((this.state.currentPage + 1) * this.state.pageSize) > this.state.totalRecords ? this.state.totalRecords : ((this.state.currentPage + 1) * this.state.pageSize)} out of {this.state.totalRecords}</span>}
                  {/* <button
                    className={"location-show-more btn btn-lg btn btn-primary mt-1 pt-1 pb-1 shadow" + (!hasNextPage ? " d-none" : "")}
                    onClick={() => this.goToList()}
                  >
                    {isBtnLoading && (
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Show More
                  </button> */}
                  <Link className={"location-show-more btn btn-lg btn btn-primary mt-1 pt-1 pb-1 shadow" + (!hasNextPage ? " d-none" : "")}
                    to={"/marketplace"}>

                    {isBtnLoading && (
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                    )}
                    Show More
                  </Link>
                  <div></div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default CMSPackagesMarketPlace;
