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
import PackageListFilters from "../components/cms/AF-003/cms-package-filters";
import PackageAppliedFilter from "../components/quotation/package-filter-applied";
import PackageCreateCopy from "../components/quotation/quotation-create-copy";
import Config from "../config.json";

class PartnerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCMSPortalCreated: false,
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
      pageSize: 10,
      totalRecords: 0,
      hasNextPage: false,
      isBtnLoading: true,
      isBtnLoadingExport: false,
      isViewInquiry: false,
      filter: {
        packagename: "",
        customername: "",
        email: "",
        phone: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        rating: 0,
        packagetheme: ""
      },
      isshowauthorizepopup: false,
      itemtoview: "",
      isCopyItemPopup: false,
      providerID: this.props.userInfo.portalAgentID,
    };
    this.myRef = null;
  }
  componentDidMount() {
    this.getPackageDetails();
    this.getBasicData();
  }
  getBasicData = () => {

    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        // if (data.response[0].isCMSPortalCreated === "true")
        //   this.getPackageDetails(data.response[0].customHomeURL.toLowerCase());
        this.setState({
          siteURL: data.response[0].customHomeURL.toLowerCase(),
          isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true",
        });
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

    var reqURL = "";
    if (this.props.location.pathname.indexOf("/deactivepackagelist") > -1) {
      reqURL =
        "cms/marketplace/package/list?page=" +
        this.state.currentPage +
        "&records=" +
        this.state.pageSize + "&status=pending";
    } else {
      reqURL =
        "cms/package/getall?page=" +
        this.state.currentPage +
        "&ismarketplace=1&records=" +
        this.state.pageSize;
    }
    reqURL += "&packagetheme=0";
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
    if (this.state.filter.countryid)
      reqURL += "&countryid=" + this.state.filter.countryid;
    if (this.state.filter.stateid)
      reqURL += "&stateid=" + this.state.filter.stateid;
    if (this.state.filter.cityid)
      reqURL += "&cityid=" + this.state.filter.cityid;

    if (this.state.filter.packagetheme) reqURL += "&packagetheme=" + this.state.filter.packagetheme;
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
    this.props.history.push(`/Package-list`);
  };

  getPackageDetailsbyId = (id) => {
    const reqOBJ = {};
    let reqURL =
      "cms/package/getbyid?id=" + id; //getbyid?id=" + id;
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let data = resonsedata.response.package[0];
        data.termsConditions = resonsedata.response.package[0].termsConditions;
        data.description = resonsedata.response.package[0].description;
        data.packageName = resonsedata.response.package[0].shortDescription;
        data.images = resonsedata.response.images.map((item) => {
          item["id"] = item.imageid;
          item["isDefaultImage"] = false;
          item["isDeleted"] = false;
          item["fileExtension"] = "jpg";
          item["fileURL"] = item.imagepath;
          item["portalID"] = resonsedata.response.package[0].portalID;
          delete item["createdby"];
          delete item["createddate"];
          delete item["updatedby"];
          delete item["updateddate"];
          delete item["specialpromotionimageid"];
          delete item["specialpromotionid"];
          return item;
        });
        data.inclusionExclusion = resonsedata.response.inclusionExclusion.map(
          (item) => {
            item["id"] = item.inclusionExclusionID;
            item["isInclusion"] = item.isInclusion;
            item["description"] = "<![CDATA[" + item.shortDescription + "]]>";
            item["isDeleted"] = false;
            return item;
          }
        );
        var obj = {};
        obj["imageid"] = 190824;
        obj["imagepath"] = resonsedata.response.package[0].smallImagePath;
        obj["isDefaultImage"] = true;
        obj["isDeleted"] = false;
        obj["id"] = resonsedata.response.package[0].smallImageID;
        obj["fileExtension"] = "jpg";
        obj["fileURL"] = resonsedata.response.package[0].smallImagePath;
        obj["portalID"] = resonsedata.response.package[0].portalID;
        data.images.push(obj);

        data.packageBrochure = [];
        if (resonsedata.response.package[0].brochureFileName) {
          var objPDF = {};
          objPDF["isDefaultImage"] = true;
          objPDF["isDeleted"] = false;
          objPDF["id"] = resonsedata.response.package[0].specialPromotionID;
          objPDF["fileExtension"] = "pdf";
          objPDF["fileURL"] = resonsedata.response.package[0].brochureFileName;
          objPDF["portalID"] = resonsedata.response.package[0].portalID;
          data.packageBrochure.push(objPDF);
        }
        if (resonsedata.response.package[0].twOthers) {
          let supplierObj = JSON.parse(resonsedata.response.package[0].twOthers);
          data["supplierCurrency"] = supplierObj.supplierCurrency;
          data["conversionRate"] = supplierObj.conversionRate;
          data["supplierCostPrice"] = supplierObj.supplierCostPrice;
          data["supplierTaxPrice"] = supplierObj.supplierTaxPrice;
          data["costPrice"] = supplierObj.costPrice === "0" ? "1" : supplierObj.costPrice;
          data["markupPrice"] = supplierObj.markupPrice;
          data["discountPrice"] = supplierObj.discountPrice;
          data["CGSTPrice"] = supplierObj.CGSTPrice;
          data["SGSTPrice"] = supplierObj.SGSTPrice;
          data["IGSTPrice"] = supplierObj.IGSTPrice;
          data["brn"] = supplierObj.brn;
          data["bookBefore"] = supplierObj.bookBefore;
        }

        let bookingForInfo = JSON.parse(
          sessionStorage.getItem("customer-info")
        );

        data.customerName =
          this.props.match.params.mode === "Edit"
            ? data.twCustomerName
            : bookingForInfo && bookingForInfo.displayName
              ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
              : data.twCustomerName || "";

        data.customerEmail =
          this.props.match.params.mode === "Edit"
            ? data.twCustomerEmail
            : bookingForInfo && bookingForInfo.contactInformation
              ? bookingForInfo.contactInformation.email
              : data.twCustomerEmail || "";
        data.isSellPriceReadonly = data.price ? true : false;
        data.customerPhone =
          this.props.match.params.mode === "Edit"
            ? data.twCustomerPhone
            : bookingForInfo && bookingForInfo.contactInformation
              ? bookingForInfo.contactInformation.phoneNumber
              : data.twCustomerPhone || "";
        this.setState(
          {
            data,
            isLoading: false,
            isEditModeLoading: false,
            isErrorMsg: "",
            isCopyItemPopup: !this.state.isCopyItemPopup,
            currentPage: 0
          },
          () => {
            if (this.state.data["countryID"])
              this.getCityList(this.state.data["countryID"], true);
          }
        );
      }.bind(this),
      "GET"
    );
  };

  getCityList = (countryID, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode) data.cityID = "";
    if (countryID === "") {
      this.setState({ CityList: [], data });
      return;
    }
    const reqOBJ = {};
    let reqURL = "cms/package/getcitybycountry?countryid=" + countryID;
    this.setState({ LoadingCityList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        this.setState({
          CityList: resonsedata.response,
          data,
          LoadingCityList: false,
        });
      }.bind(this),
      "GET"
    );
  };
  saveOffer = (fromdata) => {
    this.setState({
      isBtnLoading: true,
      isErrorMsg: "",
    });
    const { mode, providerID, CurrencyList } = { ...this.state };
    let data = Object.assign({}, fromdata);
    data.images = this.state.packageLargeImages && this.state.packageLargeImages !== null ? data.images.concat(this.state.packageLargeImages) : data.images;
    data.PDFList = this.state.packageBrochure && this.state.packageBrochure !== null ? data.packageBrochure.concat(this.state.packageBrochure) : data.packageBrochure;
    delete data["packageBrochure"];
    delete data["isActive"];
    delete data["isDeleted"];
    delete data["status"];
    delete data["inclusion"];
    delete data["exclusion"];
    delete data["imagesURL"];
    delete data["specialPromotionID"];
    delete data["customerPhone"];
    data["siteURL"] = this.state.isCMSPortalCreated && data.isShowOnHomePage ? this.state.siteURL : "";
    let supplierObj = {
      supplierCurrency: data.supplierCurrency,
      conversionRate: data.conversionRate,
      supplierCostPrice: data.supplierCostPrice,
      supplierTaxPrice: data.supplierTaxPrice,
      costPrice: data.costPrice > 0 ? data.costPrice : 1,
      brn: data.brn,
      markupPrice: data.markupPrice,
      discountPrice: data.discountPrice,
      CGSTPrice: data.CGSTPrice,
      SGSTPrice: data.SGSTPrice,
      IGSTPrice: data.IGSTPrice,
      bookBefore: data.bookBefore,
    };

    data["ParentId"] = data.specialPromotionID;
    data["IsMaster"] = false;
    data["agentId"] = providerID;
    data["supplierObj"] = JSON.stringify(supplierObj);
    //if(data.supplierCurrency != ""){
    //let currencyid = CurrencyList.find((x) => x.currencyCode === data.supplierCurrency.split(' ')[0]).currencyID;
    //data["currencyID"] = currencyid;
    //}
    if (data.price === "0" || data.price === "") {
      data["price"] = "1";
    }
    delete data["supplierCurrency"];
    delete data["conversionRate"];
    delete data["supplierCostPrice"];
    delete data["supplierTaxPrice"];
    delete data["costPrice"];
    delete data["markupPrice"];
    delete data["discountPrice"];
    delete data["CGSTPrice"];
    delete data["SGSTPrice"];
    delete data["IGSTPrice"];
    delete data["brn"];
    delete data["bookBefore"];

    data.packageThemes = data.packagethemeid;

    data.createCustomer_validateEmailAndPhone = true;
    data.createCustomer_UseAgentDetailInEmail = Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false;
    data.createCustomer_iscmsportalcreated = this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(data.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"));

    let OfferInfo = Object.assign({}, data);
    this.setState({ isLoading: true });
    let reqURL = `cms/package${"/add"}`;

    let reqOBJ = { request: OfferInfo };
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {
          this.setState({ isBtnLoading: false, isCopyItemPopup: false });
          window.location.reload();
          window.open(`/Packageview/${btoa(resonsedata.id)}`, "_blank");
          //window.open(`/Packageview/${btoa(resonsedata.id)}`);
          //this.props.history.push("/PackageList");
        } else {
          //let { errors } = this.state;
          let ErrorMsg = "";
          if (resonsedata.code) {
            ErrorMsg = resonsedata.error;
          }
          else {
            ErrorMsg = "Oops! something went wrong";
          }
          this.setState({ isBtnLoading: false, isErrorMsg: ErrorMsg });
        }
      }.bind(this),
      "POST"
    );
  };


  viewDetailsMode = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~packages-manage-package")) { ///PackageList~packages-preview-package
      window.open(`/Packageview/${btoa(id)}`, "_blank");
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

  copyPackage = (id) => {
    sessionStorage.removeItem("reportCustomer");
    this.getPackageDetailsbyId(id);

  };

  handleHidePopup = () => {
    this.setState({
      isCopyItemPopup: !this.state.isCopyItemPopup,
      currentPage: 0,
    });
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
    filter["countryid"] = data["countryID"] ? data["countryID"] : "";
    filter["stateid"] = data["stateID"] ? data["stateID"] : "";
    filter["cityid"] = data["cityID"] ? data["cityID"] : "";
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
  formatDuration = (num) => {
    return num > 1 ? `${num}D/${num - 1}N` : `${num}D`;
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
      isCopyItemPopup
    } = this.state;
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
              Manage Packages
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
              <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                <button
                  className="btn btn-sm btn-primary pull-right mr-2"
                  onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry") ? this.props.history.push(`/packagemarketplace/add`) : this.setState({ isshowauthorizepopup: true })}
                >
                  Create Marketplace Package
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
              isFromMarketplace={true}
            />
          )}
          {/* {<PackageAppliedFilter
            filterData={this.state.filter}
            removeFilter={this.removeFilter}
          />} */}
          <div className="border mt-2">
            {results && (
              <div>
                <div className="row quotation-list-grid-header">
                  <div className="col-lg-12">
                    <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                      <div className="row">
                        <div className="col-lg-5" style={{ display: "none" }}>
                          <b>Customer Details</b>
                        </div>
                        <div className="col-lg-2">
                          <b>Category</b>
                        </div>
                        <div className="col-lg-7">
                          <b>Package Details</b>
                        </div>

                        <div className="col-lg-2">
                          <b>Create Date</b>
                        </div>

                        <div className="col-lg-1">
                          <b>Actions</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {results.map((item, key) => {
                  return (
                    <div
                      key={key}
                      className="border-bottom pl-3 pr-3 pt-3"
                    >
                      <div className="row quotation-list-item">
                        <div className="col-lg-5 d-flexx align-items-center pb-3" style={{ display: "none" }}>
                          <div>
                            <span className="quotation-list-usericon">
                              {item.twCustomerName}
                            </span>
                          </div>
                          <div>
                            <h5 className="m-0 p-0 mb-1">{item.twCustomerName}</h5>
                            <small className="d-block text-secondary mt-2">
                              <span>{item.twCustomerEmail}</span>
                              <span className="quotation-list-item-sprt">
                                {item.twCustomerEmail ? " | " : ""}
                              </span>
                              <span>{item.twCustomerPhone}</span>
                            </small>
                          </div>
                        </div>

                        <div className="col-lg-2">
                          <div>
                            <span className="text-secondary mr-3 d-block">
                              {item.packagethemeid === 3 ? "Holiday" :
                                item.packagethemeid === 2 ? "Flight" :
                                  item.packagethemeid === 1 ? "Hotel" :
                                    item.packagethemeid === 5 ? "Activity" :
                                      item.packagethemeid === 11 ? "Transfer" :
                                        "Other"}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-7 d-flex align-items-center pb-3">
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

                              {item.specialPromotionType && (
                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>
                                  {item.specialPromotionType}
                                </small>
                              )}

                              {parseInt(item.duration) > 0 && (
                                <small>
                                  <span className="quotation-list-item-sprt">
                                    {" "}
                                    |{" "}
                                  </span>
                                  {!isNaN(parseInt(item.duration)) && (parseInt(item.duration) > 1 ? `${parseInt(item.duration)}D/${parseInt(item.duration) - 1}N` : `${parseInt(item.duration)}D`)}
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
                                <Amount amount={isNaN(item.price) ? 0 : item.price} currencySymbol={Global.getEnvironmetKeyValue("portalCurrencyCode")}></Amount>
                              </small>
                            </span>
                          </div>
                        </div>

                        <div className="col-lg-2">
                          {item.createdDate && (
                            <div>
                              {/* <small>Package created</small> */}
                              {/*  */}

                              {this.generateStartRating(item.rating)}
                              <small className="text-secondary d-block mt-1">
                                <DateComp date={item.createdDate}></DateComp>
                              </small>
                            </div>
                          )}
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
                                      View Package
                                    </button>
                                  </li>
                                  {this.props.location.pathname.indexOf("/deactivepackagelist") > -1 && <li>
                                    <button
                                      className="btn btn-sm text-nowrap w-100 text-left"
                                      //onClick={() => this.ViewInquiry(item)}
                                      onClick={() => this.viewDetailsMode(item.specialPromotionID)}
                                    >
                                      Active Package
                                    </button>
                                  </li>}
                                  {this.props.location.pathname.indexOf("/deactivepackagelist") < 0 && <><AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                    <li>
                                      <button
                                        className="btn btn-sm text-nowrap w-100 text-left"
                                        onClick={() => this.props.history.push(`/packagemarketplace/Edit/` + item.specialPromotionID)}
                                      >
                                        Edit Package
                                      </button>
                                    </li>
                                  </AuthorizeComponent>

                                    <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.deletePackage(item.specialPromotionID)}
                                        >
                                          Delete Package
                                        </button>
                                      </li>
                                    </AuthorizeComponent>
                                  </>}
                                  <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                                    <li>
                                      <button
                                        className="btn btn-sm text-nowrap w-100 text-left"
                                        onClick={() => this.copyPackage(item.specialPromotionID)}
                                      >
                                        Copy Package
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

                {isDeleteConfirmPopup && (
                  <ActionModal
                    title="Confirm Delete"
                    message="Are you sure you want to delete this item?"
                    positiveButtonText="Confirm"
                    onPositiveButton={() => this.handleConfirmDelete(true)}
                    handleHide={() => this.handleConfirmDelete(false)}
                  />
                )}
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
              <div className="p-4 text-center">No Packages Found.</div>
            )}
          </div>

          <nav>
            <ul className="pagination justify-content-center mt-3">
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
        {isCopyItemPopup && (
          <ModelPopup
            header={"Copy Package"}
            content={<PackageCreateCopy
              type={'Marketplace Package'}
              data={this.state.data}
              handleCreate={this.saveOffer}
              handleDateChange={this.props.setDate}
              isErrorMsg={this.state.isErrorMsg}
              isBtnLoading={this.state.isBtnLoading}
              removedeletebutton={true}
              handleHide={this.handleHidePopup}
              userInfo={this.props.userInfo}
              mode={"Edit"}
            />
            }
            handleHide={this.handleHidePopup}
          />
        )}
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
export default PartnerList;
