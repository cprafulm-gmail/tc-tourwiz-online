import React, { Component } from "react";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import moment from "moment";
import PackagePrint from "./package-print";
import QuotationListLoading from "../components/quotation/quotation-list-loading";
import ActionModal from "../helpers/action-modal";
import DateComp from "../helpers/date";
import * as Global from "../helpers/global";
import Amount from "../helpers/amount";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import InquiryView from "../components/quotation/inquiry-view";
import ModelPopup from "../helpers/model";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import SVGIcon from "../helpers/svg-icon";
import PackageListFilters from "./package-list-filters";
import PackageAppliedFilter from "../components/quotation/package-filter-applied";
import PackageCreateCopy from "../components/quotation/quotation-create-copy";
import SocialMediaWhatsappWhite from "../assets/images/tw/social-media-whatsapp-white.png";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import { Helmet } from "react-helmet";
import ActivityLogDetails from "../components/quotation/activity-log-details";
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
        dateMode: this.props.match.params.filter === "followup" ? "today" : "",
        specificmonth: "1",
        searchBy: this.props.match.params.filter === "followup" ? "bookbefore" : "",
        rating: 0,
        packagetheme: "0"
      },
      isshowauthorizepopup: false,
      isLockToDeletePackage: false,
      itemtoview: "",
      isCopyItemPopup: false,
      providerID: this.props.userInfo.portalAgentID,
      isSubscriptionPlanend: false,
    };
    this.myRef = null;
    this.IsContentManage = this.props.location.pathname.indexOf("/ManageContent") > -1 ? true : false;
    this.IsMaster = this.props.location.pathname.indexOf("/masterpackagelist") > -1 ? true : false;
  }
  componentDidMount() {
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "dashboard-menu~master-packages-manage-package" : this.IsContentManage ? "dashboard-menu~managewebsite-managecontent" : "dashboard-menu~packages-manage-package"))) {
      this.props.history.push('/');
    }
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
    console.log(this.state.filter);

    var reqURL =
      "cms/package/getall?page=" +
      this.state.currentPage +
      "&records=" +
      this.state.pageSize;
    //reqURL += (!this.props.isFromContentManager && (this.props.location.pathname.indexOf("/QuickPackageList") > -1 ? "&packagetheme=13" : "&packagetheme=" + this.state.filter.packagetheme));
    reqURL += this.IsMaster ? "&ismaster=true" : "&ismaster=false";
    reqURL += this.props.isFromContentManager ? "&iscmspackage=true" : "&iscmspackage=false";
    if (this.state.filter.packagename)
      reqURL += "&packagename=" + this.state.filter.packagename;

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
    if (this.state.filter.countryID)
      reqURL += "&countryid=" + this.state.filter.countryID;
    if (this.state.filter.stateID)
      reqURL += "&stateid=" + this.state.filter.stateID;
    if (this.state.filter.cityID)
      reqURL += "&cityid=" + this.state.filter.cityID;
    if (this.state.filter.fromDate)
      reqURL += "&datefrom=" + this.state.filter.fromDate;
    if (this.state.filter.toDate)
      reqURL += "&dateto=" + this.state.filter.toDate;
    reqURL += "&datemode=" + this.state.filter.dateMode;
    reqURL += "&searchby=" + this.state.filter.searchBy;
    // if (this.state.filter.packagetheme) reqURL += "&packagetheme=" + this.state.filter.packagetheme;
    //reqURL += "&groupby=nogroup";//+this.state.filter.groupBy;
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&phone=" + this.props.userInfo.contactInformation.phoneNumber;
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

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  handleHideActivityLogPopup = () => {
    this.setState({
      activityLogDetails: null,
    });
  };
  getActivityLogDetails = (item) => {
    this.setState({ isErrorMsg: "", isBtnLoading_activityLog: true });
    let id = item;

    var reqURL = "inquiry/activitylog?id=" + id;

    apiRequester_quotation_api(reqURL, null, (data) => {
      if (data.error)
        this.setState({ isErrorMsg: data.error, isBtnLoading_activityLog: false });
      else {
        this.setState({
          isBtnLoading_activityLog: false,
          activityLogDetails: data.response,
        });
      }
    }, 'GET');
  };
  getPackageDetailsbyId = (id) => {
    const reqOBJ = {};
    let reqURL =
      "cms/package/getbyid?id=" + id; //getbyid?id=" + id;
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        debugger
        let data = resonsedata.response.package[0];
        data.termsConditions = resonsedata.response.package[0].termsConditions;
        data.description = resonsedata.response.package[0].description;
        data.packageName = resonsedata.response.package[0].shortDescription;
        data.vendor = resonsedata.response.package[0].providerName;
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
          data["costPrice"] = Number(supplierObj.costPrice) === 0 ? 0 : supplierObj.costPrice;
          data["markupPrice"] = supplierObj.markupPrice;
          data["discountPrice"] = supplierObj.discountPrice;
          data["CGSTPrice"] = supplierObj.CGSTPrice;
          data["SGSTPrice"] = supplierObj.SGSTPrice;
          data["IGSTPrice"] = supplierObj.IGSTPrice;
          data["brn"] = supplierObj.brn;
          data["bookBefore"] = supplierObj.bookBefore;
          data["markupPrice"] = supplierObj.markupPrice;
          data["discountPrice"] = supplierObj.discountPrice;
          data["CGSTPrice"] = supplierObj.CGSTPrice;
          data["SGSTPrice"] = supplierObj.SGSTPrice;
          data["IGSTPrice"] = supplierObj.IGSTPrice;
          data["bookBefore"] = supplierObj.bookBefore;
          data["sellPrice"] = supplierObj.sellPrice;
          data["amountWithoutGST"] = supplierObj.amountWithoutGST;
          data["isInclusive"] = supplierObj.isInclusive;
          data["percentage"] = supplierObj.percentage;
          data["processingFees"] = supplierObj.processingFees;
          data["tax1"] = supplierObj.tax1;
          data["tax2"] = supplierObj.tax2;
          data["tax3"] = supplierObj.tax3;
          data["tax4"] = supplierObj.tax4;
          data["tax5"] = supplierObj.tax5;
          data["isTax1Modified"] = supplierObj.isTax1Modified;
          data["isTax2Modified"] = supplierObj.isTax2Modified;
          data["isTax3Modified"] = supplierObj.isTax3Modified;
          data["isTax4Modified"] = supplierObj.isTax4Modified;
          data["isTax5Modified"] = supplierObj.isTax5Modified;
          data["taxType"] = supplierObj.taxType;
          data["totalAmount"] = supplierObj.totalAmount;
          data["isSellPriceReadonly"] = supplierObj.isSellPriceReadonly;
          data["flight"] = supplierObj.flight;
          data["hotelDetails"] = supplierObj.hotelDetails;
          data["Adults"] = supplierObj.Adults ?? 1;
          data["Child"] = supplierObj.Child ?? 0;
          data["Infants"] = supplierObj.Infants ?? 0;
          data["supplierCostPriceAdult"] = supplierObj.supplierCostPriceAdult ?? supplierObj.supplierCostPrice;
          data["supplierCostPriceChild"] = supplierObj.supplierCostPriceChild ?? "";
          data["supplierCostPriceInfant"] = supplierObj.supplierCostPriceInfant ?? "";

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

    data["ParentId"] = data.specialPromotionID;
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
      costPrice: data.costPrice,
      brn: data.brn,
      markupPrice: data.markupPrice,
      discountPrice: data.discountPrice,
      CGSTPrice: data.CGSTPrice,
      SGSTPrice: data.SGSTPrice,
      IGSTPrice: data.IGSTPrice,
      bookBefore: data.bookBefore,
      sellPrice: data.sellPrice,
      amountWithoutGST: data.amountWithoutGST,
      isInclusive: data.isInclusive,
      percentage: data.percentage,
      processingFees: data.processingFees,
      tax1: data.tax1,
      tax2: data.tax2,
      tax3: data.tax3,
      tax4: data.tax4,
      tax5: data.tax5,
      isTax1Modified: data.isTax1Modified,
      isTax2Modified: data.isTax2Modified,
      isTax3Modified: data.isTax3Modified,
      isTax4Modified: data.isTax4Modified,
      isTax5Modified: data.isTax5Modified,
      taxType: data.taxType,
      totalAmount: data.totalAmount,
      isSellPriceReadonly: data.isSellPriceReadonly,
      flight: data.flight,
      hotelDetails: data.hotelDetails,
      Adults: data.Adults ?? 1,
      Child: data.Child ?? 0,
      Infants: data.Infants ?? 0,
      supplierCostPriceAdult: data.supplierCostPriceAdult ?? data.supplierCostPrice,
      supplierCostPriceChild: data.supplierCostPriceChild ?? "",
      supplierCostPriceInfant: data.supplierCostPriceInfant ?? ""
    };
    data["Status"] = "confirm";
    data["agentId"] = providerID;
    data["supplierObj"] = JSON.stringify(supplierObj);
    //if(data.supplierCurrency != ""){
    //let currencyid = CurrencyList.find((x) => x.currencyCode === data.supplierCurrency.split(' ')[0]).currencyID;
    //data["currencyID"] = currencyid;
    //}
    data["price"] = data.totalAmount > 0 ? data.totalAmount : data.sellPrice;

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

    data["IsMaster"] = false;
    data["packageThemes"] = data.packagethemeid;
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "dashboard-menu~master-packages-manage-package" : this.IsContentManage ? "dashboard-menu~managewebsite-managecontent" : "dashboard-menu~packages-manage-package"))) { ///PackageList~packages-preview-package
      let portalURL = window.location.origin;
      let portalType = localStorage.getItem('portalType')
      if (portalType === 'B2C') {
        portalURL = window.location.href.toLowerCase().replace('/packagelist', '')
        window.open(`${portalURL}/Packageview/${btoa(id)}`, "_blank");
      }
      else {
        window.open(`${portalURL}/Packageview/${btoa(id)}`, "_blank");
      }
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };
  sharePackageDetails = (id, customerPhone) => {
    window.open(`https://web.whatsapp.com/send?phone=${customerPhone}&text=${this.state.siteURL}/Packageview/${btoa(id)}`, "_blank");
  }

  deletePackage = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "dashboard-menu~master-packages-manage-package" : this.IsContentManage ? "dashboard-menu~managewebsite-managecontent" : "dashboard-menu~packages-manage-package"))) { ///PackageList~packages-delete-package
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
      isCopyItemPopup: false,
      isLockToDeletePackage: false,
      currentPage: 0,
    });
  };

  handleConfirmDeletePackage = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "dashboard-menu~master-packages-manage-package" : this.IsContentManage ? "dashboard-menu~managewebsite-managecontent" : "dashboard-menu~packages-manage-package"))) { //PackageList~packages-delete-package
      this.setState({ isLoading: true });
      const reqOBJ = {
        request: {
          SpecialPromotionID: this.state.deleteItem
        },
      };
      let reqURL = "cms/package/delete";
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        if (resonsedata.error && resonsedata.error === "linked package") {
          this.setState({ isLockToDeletePackage: true });
        }
        else {
          this.getPackageDetails();
        }
      }.bind(this), "POST");
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };
  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.handleConfirmDeletePackage();
  };
  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  confirmDeletePackage = () => {
    let deleteItem = this.state.deleteItem;
    deleteItem.id = deleteItem.specialPromotionID;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "cms/package/delete";
    var reqOBJ = deleteItem;
    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
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
    filter["cityID"] = data["cityID"] ? data["cityID"] : "";
    filter["countryID"] = data["countryID"] ? data["countryID"] : "";
    filter["stateID"] = data["stateID"] ? data["stateID"] : "";
    filter["stateID"] = data["stateID"] ? data["stateID"] : "";
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
  editPackage = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
      "InquiryList~inquiries-edit-inquiries")) {
      this.props.history.push(this.IsMaster
        ? (`/masterpackage/Edit/` + item.specialPromotionID)
        : (`/Package/Edit/` + item.specialPromotionID))
    }
    else {
      (localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken"))
        ? this.setState({ isshowauthorizepopup: true })
        : this.setState({ isshowauthorizepopup: false })
    }
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
      isCopyItemPopup,
      isLockToDeletePackage
    } = this.state;
    const { userInfo, isFromContentManager } = this.props;
    const isQuickPackage = this.props.location.pathname.indexOf("/QuickPackageList") > -1 ? true : false;

    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");

    let IsFilterApplied = false;
    if (this.state.filter.customername !== ""
      || this.state.filter.email !== ""
      || this.state.filter.phone !== ""
      || this.state.filter.dateMode !== ""
      || this.state.filter.searchBy !== ""
      || this.state.filter.packagename !== ""
    ) {
      IsFilterApplied = true;
    }

    return (
      <div className="quotation quotation-list">
        <Helmet>
          {localStorage.getItem('portalType') === 'B2C' ?
            <title>
              My Packages
            </title> :
            <title>
              Manage {this.IsMaster ? 'Master Packages' : this.props.isFromContentManager ? this.props.dealsType === 3 ? " Packages" : " Deals " : " Packages"}
            </title>}
        </Helmet>
        <div className={this.props.isFromContentManager ? "border-bottom pt-1 pb-1 mb-3" : "title-bg pt-3 pb-3 mb-3"}>
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <h1 className={this.props.isFromContentManager ? "text-dark m-0 p-0 f30" : "text-white m-0 p-0 f30"}>
                  {!this.props.isFromContentManager && <SVGIcon
                    name="file-text"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGIcon>}
                  Manage {this.IsMaster ? 'Master Packages' : this.props.isFromContentManager ? this.props.dealsType === 1 ? "Hot Deals" : "Package" : 'Packages'}
                </h1>
              </div>
              <div className="col-lg-3 text-right">
                <button
                  className={this.props.isFromContentManager ? "btn btn-sm btn-primary mt-1" : "btn btn-sm btn-light mt-1"}
                  onClick={this.showHideFilters}
                >
                  Filters
                </button>
                {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") && (
                  <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  mx-2 mt-1"
                      onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(0) : !GlobalEvents.handleCheckforFreeExcess(this.props, (this.IsMaster ? "dashboard-menu~master-packages-create-package" : "dashboard-menu~packages-create-package")) ? this.setState({ isSubscriptionPlanend: true }) :
                        AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry") ? this.props.history.push(this.IsMaster ? `/masterpackage/add` : `/Package/add`) : this.setState({ isshowauthorizepopup: true })}
                    >
                      Create {this.IsMaster ? 'Master Package' : (this.props.isFromContentManager ? this.props.dealsType === 3 ? " Packages" : " Deals " : " Packages")}
                    </button>
                  </AuthorizeComponent>)}
              </div>
            </div>
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
              isMarkeetPlace={this.IsMaster ? true : false}
              isFromContentManager={isFromContentManager}
            />
          )}
          {IsFilterApplied && <PackageAppliedFilter
            filterData={this.state.filter}
            removeFilter={this.removeFilter}
          />}
          <div className="border mt-2">
            {results && (
              <div>
                <div className="row quotation-list-grid-header">
                  <div className="col-lg-12">
                    <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                      <div className="row">
                        {!isFromContentManager && <div className="col-lg-1">
                          <b>Category</b>
                        </div>}
                        {!this.IsMaster && !this.IsContentManage && <div className={"col-lg-4"}>
                          <b>Customer Details</b>
                        </div>}
                        <div className={!this.IsMaster ? !this.IsContentManage ? "col-lg-4" : "col-lg-9" : "col-lg-8"}>
                          <b>Package Details</b>
                        </div>

                        <div className={"col-lg-2"}>
                          <b>Create Date</b>
                        </div>

                        <div className="col-lg-1">
                          <b>Actions</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* {results.map((item, key) => { */}
                {results.filter(x => (isFromContentManager ? x.packagethemeid === this.props.dealsType : x.packagethemeid !== 13)).map((item, key) => {
                  let supplierObj = item && JSON.parse(item?.twOthers);
                  let supplierCurrencySymbol = supplierObj ? supplierObj?.supplierCurrency ? supplierObj?.supplierCurrency : item?.currencySymbol : item?.currencySymbol;
                  return (
                    <div
                      key={key}
                      className="border-bottom pl-3 pr-3 pt-3"
                    /* onClick={() => this.props.isFromContentManager ? this.handleCreateEditLocation(item.specialPromotionID) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                      "InquiryList~inquiries-edit-inquiries")
                      ? this.props.history.push(this.IsMaster ? (`/masterpackage/Edit/` + item.specialPromotionID) : (`/Package/Edit/` + item.specialPromotionID))
                      : this.setState({ isshowauthorizepopup: true })
                    }
                    style={{ cursor: "pointer" }} */
                    >
                      <div className="row quotation-list-item">

                        {!isFromContentManager &&
                          <div className="col-lg-1"
                            onClick={() => this.editPackage(item)}
                            style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
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
                          </div>}
                        {!this.IsMaster && !isFromContentManager &&
                          <div className={"col-lg-4 d-flex align-items-center pb-3"}
                            onClick={() => this.editPackage(item)}
                            style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
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
                          </div>}

                        <div className={!this.IsMaster ? !this.IsContentManage ? "col-lg-4 d-flex align-items-center pb-3" : "col-lg-9 d-flex align-items-center pb-3" : "col-lg-8 d-flex align-items-center pb-3"}
                          onClick={() => this.editPackage(item)}
                          style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
                          {isFromContentManager && <div className="pull-left mr-3">
                            <img src={item?.smallImagePath.indexOf(".s3.") > 0 ? item?.smallImagePath : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + item?.portalID + "/SpecialsPromotions/images/" + item?.smallImagePath} alt="Package" style={{ width: "90px" }} />
                          </div>}
                          <div>
                            <span className="text-secondary mr-3 d-block">
                              <b className="text-primary">{item.shortDescription.toUpperCase()}</b>
                            </span>
                            <span className="text-secondary mr-3">
                              {!isQuickPackage && item.validFrom && (
                                <small>
                                  <DateComp date={item.validFrom}></DateComp>
                                </small>
                              )}

                              {!isQuickPackage && item.validTo && (
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
                                {!isQuickPackage && <span className="quotation-list-item-sprt">
                                  {" "}
                                  |{" "}
                                </span>}
                                <Amount amount={isNaN(item.price) ? 0 : item.price} currencySymbol={portalCurrency}></Amount>
                              </small>
                            </span>
                          </div>
                        </div>

                        <div className={"col-lg-2"}
                          onClick={() => this.editPackage(item)}
                          style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
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

                        <div className="col-lg-1 d-flex align-items-center pb-3 justify-content-center p-0">
                          <React.Fragment>
                            {localStorage.getItem('portalType') === 'B2C' &&
                              <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                  (this.IsMaster ? "PackageDetails~master - packages - view - package" : "PackageDetails~package - view - package"))
                                  ? this.viewDetailsMode(item.specialPromotionID)
                                  : this.setState({ isshowauthorizepopup: true })
                                }
                              >
                                View Package
                              </button>
                            }
                            {localStorage.getItem('portalType') !== 'B2C' &&
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
                                      <AuthorizeComponent title={this.IsMaster ? "PackageDetails~master-packages-view-package" : "PackageDetails~package-view-package"} type="button" rolepermissions={userInfo.rolePermissions}>
                                        <li>
                                          <button
                                            className="btn btn-sm text-nowrap w-100 text-left"
                                            //onClick={() => this.ViewInquiry(item)}
                                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                              (this.IsMaster ? "PackageDetails~master - packages - view - package" : "PackageDetails~package - view - package"))
                                              ? this.viewDetailsMode(item.specialPromotionID)
                                              : this.setState({ isshowauthorizepopup: true })
                                            }
                                          >
                                            View Package
                                          </button>
                                        </li>
                                      </AuthorizeComponent>
                                      {/* <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}> */}
                                      <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => this.props.isFromContentManager
                                            ? this.handleCreateEditLocation(item.specialPromotionID)
                                            : this.editPackage(item)
                                          }
                                        >
                                          Edit Package
                                        </button>
                                      </li>
                                      {/* </AuthorizeComponent> */}

                                      <AuthorizeComponent title={this.IsMaster ? "PackageList~master-packages-delete-package" : "PackageDetails~package-delete-package"} type="button" rolepermissions={userInfo.rolePermissions}>
                                        <li>
                                          <button
                                            className="btn btn-sm text-nowrap w-100 text-left"
                                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                              (this.IsMaster ? "PackageList~master-packages-delete-package" : "PackageDetails~package-delete-package"))
                                              ? this.deletePackage(item.specialPromotionID)
                                              : this.setState({ isshowauthorizepopup: true })
                                            }
                                          >
                                            Delete Package
                                          </button>
                                        </li>
                                      </AuthorizeComponent>
                                      {/* this.IsMaster  */}
                                      {/* <AuthorizeComponent title=(this.IsMaster ? "PackageDetails~master-packages-copy-package" : "PackageDetails~package-copy-package") type="button" rolepermissions={userInfo.rolePermissions}> */}
                                      {!this.props.isFromContentManager && <li>
                                        <button
                                          className={isQuickPackage ? "d-none" : "btn btn-sm text-nowrap w-100 text-left"}
                                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                            (this.IsMaster ? "PackageDetails~master-packages-copy-package" : "PackageDetails~package-copy-package"))
                                            ? this.copyPackage(item.specialPromotionID)
                                            : this.setState({ isshowauthorizepopup: true })
                                          }
                                        >
                                          {this.IsMaster ? "Use Package" : "Copy Package"}
                                        </button>
                                      </li>}
                                      {/* </AuthorizeComponent> */}
                                      {/* <AuthorizeComponent
                                    title=(this.IsMaster ? "PackageDetails~master-packages-share-whatsapp" : "PackageDetails~package-share-whatsapp")
                                    type="button"
                                    rolepermissions={this.props.userInfo.rolePermissions}
                                  > */}
                                      {!this.IsMaster && !this.props.isFromContentManager && <li>
                                        <button
                                          // href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=" + item.twCustomerPhone + "&text=" + "/Packageview/" + item.specialPromotionID}
                                          target="_blank"
                                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                            (this.IsMaster ? "PackageDetails~master-packages-share-whatsapp" : "PackageDetails~package-share-whatsapp"))
                                            ? this.sharePackageDetails(item.specialPromotionID, item.twCustomerPhone)
                                            : this.setState({ isshowauthorizepopup: true })
                                          }
                                          className="btn btn-sm text-nowrap w-100 text-left">
                                          {/* <img src={SocialMediaWhatsappWhite} alt="Whatsapp" style={{ width: "26px" }} /> */}
                                          Share on Whatsapp
                                        </button>
                                      </li>}
                                      {/* <li>
                                        <button
                                          className="btn btn-sm text-nowrap w-100 text-left"
                                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                            "InquiryList~inquiries-activity-log")
                                            ? this.getActivityLogDetails(item.specialPromotionID)
                                            : this.setState({ isshowauthorizepopup: true })
                                          }
                                        >
                                          Activity Log
                                        </button>
                                      </li> */}

                                      {/* </AuthorizeComponent> */}
                                    </ul>
                                  </div>
                                </div>
                              </React.Fragment>}
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

                {isLockToDeletePackage && (
                  <ActionModal
                    title="Warning"
                    message="This package cannot be deleted because there are still dependent inquiries associated with it."
                    positiveButtonText="Ok"
                    onPositiveButton={() => this.handleHidePopup(true)}
                    handleHide={() => this.handleHidePopup(false)}
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
            header={this.IsMaster ? "Use Package" : "Copy Package"}
            content={<PackageCreateCopy
              type={this.IsMaster ? "Master Package" : this.IsContentManage ? 'Hot Deals' : 'Package'}
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
        {this.state.activityLogDetails ? (
          <ModelPopup
            header={"Activity Log"}
            content={<ActivityLogDetails activityLogDetails={this.state.activityLogDetails} userInfo={userInfo} />}
            handleHide={this.handleHideActivityLogPopup}
          />
        ) : null}
        {
          this.state.isSubscriptionPlanend &&
          <ModelLimitExceeded
            header={"Plan Limitations Exceeded"}
            content={"The maximum recommended plan has been exceeded"}
            handleHide={this.hidelimitpopup}
            history={this.props.history}
          />
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
export default PartnerList;