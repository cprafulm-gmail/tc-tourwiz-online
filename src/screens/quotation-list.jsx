import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import QuotationListLoading from "../components/quotation/quotation-list-loading";
import ActionModal from "../helpers/action-modal";
import DateComp from "../helpers/date";
import QuotationListFilters from "../components/quotation/quotation-list-filters";
import XLSX from "xlsx";
import * as Global from "../helpers/global";
import ModelPopup from "../helpers/model";
import itinerarySamplePDF from './../assets/templates/sunderban-tour.pdf';
import quotationSamplePDF from './../assets/templates/hotel-booking-in-lonavala.pdf';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import moment from "moment";
import QuotationCreateCopy from "../components/quotation/quotation-create-copy";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import QuotationAppliedFilter from "../components/quotation/quotation-filter-applied";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import ActivityLogDetails from "../components/quotation/activity-log-details";
import { Helmet } from "react-helmet";
import Config from "../config.json";

class QuotationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: "",
      resultsExport: "",
      isDeleteConfirmPopup: false,
      isCopyItemPopup: false,
      deleteItem: "",
      type: this.props.match.path.split("/").includes("ItineraryList")
        ? "Itinerary"
        : "Quotation",
      isFilters: false,
      currentPage: 0,
      pageSize: 10,
      totalRecords: 0,
      hasNextPage: false,
      isBtnLoading: false,
      isBtnLoadingExport: false,
      isBtnLoadingPageing: false,
      filter: {
        customername: "",
        email: "",
        phone: "",
        title: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        //groupBy: "inquirytype"
        stayInDays: 30,
      },
      isshowauthorizepopup: false,
      isBtnLoadingMode: "",
      isSubscriptionPlanend: false
    };
    this.myRef = null;
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }

  getQuotations = (isExport = false, mode, callback) => {
    if (isExport) {
      this.setState({ isBtnLoadingExport: true });
    }
    else
      this.setState({
        totalRecords: 0,
        isBtnLoading: mode === "pageing" ? this.state.isBtnLoading : true,
        isBtnLoadingPageing: mode === "pageing" ? true : this.state.isBtnLoadingPageing,
        isBtnLoadingMode: mode,
      });
    var reqURL =
      "quotations?type=" +
      this.state.type +
      "&page=" +
      (isExport ? 0 : this.state.currentPage) +
      "&records=" +
      (isExport ? 1000 : this.state.pageSize);
    if (this.state.filter.customername)
      reqURL += "&customername=" + this.state.filter.customername;
    if (this.state.filter.email)
      reqURL += "&email=" + this.state.filter.email;
    if (this.state.filter.phone)
      reqURL += "&phone=" + this.state.filter.phone;
    if (this.state.filter.title)
      reqURL += "&title=" + this.state.filter.title;
    if (this.state.filter.fromDate)
      reqURL += "&datefrom=" + this.state.filter.fromDate;
    if (this.state.filter.toDate)
      reqURL += "&dateto=" + this.state.filter.toDate;
    reqURL += "&datemode=" + this.state.filter.dateMode;
    reqURL += "&status=active";
    reqURL += "&searchby=" + this.state.filter.searchBy;
    //reqURL += "&groupby=nogroup";//+this.state.filter.groupBy;
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (isExport) {
          let resultsExport = this.state.resultsExport || [];
          callback(resultsExport.concat(data.result));
        }
        else {
          let results = this.state.results || [];

          if (mode === 'pageing')
            results = results.concat(data.result);
          else
            results = data.result;
          let hasNextPage = true;
          if (data?.paging?.totalRecords > results.length) {
            hasNextPage = true;
          } else {
            hasNextPage = false;
          }

          this.setState({
            results,
            defaultResults: results,
            hasNextPage,
            totalRecords: data?.paging?.totalRecords ?? 0,
            isBtnLoading: mode === "pageing" ? this.state.isBtnLoading : false,
            isBtnLoadingPageing: mode === "pageing" ? false : this.state.isBtnLoadingPageing,
            isBtnLoadingMode: "",
          });
        }
      },
      "GET"
    );
  };

  deleteQuotation = (item) => {
    this.setState({
      deleteItem: item,
      isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
      currentPage: 0,
    });
  };

  copyQuotation = (item) => {
    this.quotationDetails(item, true);
    sessionStorage.removeItem("reportCustomer");
    this.setState({
      isErrorMsg: "",
      isCopyItemPopup: !this.state.isCopyItemPopup,
      currentPage: 0,
    });
  };

  handleHidePopup = () => {
    this.setState({
      isCopyItemPopup: !this.state.isCopyItemPopup,
      currentPage: 0,
    });
  };

  resetQuotation = () => {
    localStorage.removeItem("quotationDetails");
    this.setState({ items: [] });
  };

  addCustomer = (reqData) => {
    this.setState({
      isBtnLoading: true,
      isErrorMsg: "",
    });
    var reqURL = "api/v1/customer/create";

    var reqOBJ = {
      Request: {
        UserDisplayName: reqData?.customerName,
        FirstName: reqData?.customerName.trim()?.split(" ")[0],
        LastName:
          reqData?.customerName.trim()?.split(" ")[1] !== undefined
            ? reqData?.customerName.trim()?.split(" ")[1]
            : reqData?.customerName.trim(),
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
        },
        ContactInformation: {
          PhoneNumber: reqData?.phone,
          PhoneNumberCountryCode: "",
          Email: reqData?.email,
        },
      },
      Flags: {
        validateEmailAndPhone: true,
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(reqData?.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (data?.response?.token) {
        sessionStorage.setItem("personateId", data.response.token);
      }

      if (data.status.code === 260031) {
        // && reqData.phoneNotoValidate !== reqData.phone
        this.setState({
          isBtnLoading: false,
          isErrorMsg:
            "Given phone number is associated with another customer. Kindly enter another phone number.",
        });
      } else {
        this.setState({ isBtnLoading: false }, this.generateQuotation(reqData));
      }
    });
  };

  generateQuotation = (data) => {
    this.setState({
      isBtnLoading: true,
      isErrorMsg: "",
    });
    let inquiryDetails = JSON.parse(localStorage.getItem("quotationDetails"));
    let isfromInquiry = inquiryDetails?.from;

    if (isfromInquiry) {
      data.from = inquiryDetails.from;
      data.month = inquiryDetails.month;
      data.typetheme = inquiryDetails.typetheme;
      data.budget = inquiryDetails.budget;
      data.inclusions = inquiryDetails.inclusions;
      data.adults = inquiryDetails.adults;
      data.children = inquiryDetails.children;
      data.infant = inquiryDetails.infant;
    }

    localStorage.setItem("quotationDetails", JSON.stringify(data));
    if (!data.fromCopy) {
      this.saveQuotation();
    }
    else {
      this.createCart();
    }

    this.props.history.push(
      "/" + this.state.type + (isfromInquiry ? "/DetailsInquiry" : "/Details")
    );
  };

  handleHideActivityLogPopup = () => {
    this.setState({
      activityLogDetails: null,
    });
  };

  getActivityLogDetails = (item) => {
    this.setState({ isErrorMsg: "", isBtnLoading_activityLog: true });
    let id = item.id;

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
  createCart = () => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let reqURL = "quotation";
    let reqOBJ = {
      name: quotationInfo.title,
      imageURL: quotationInfo.imageURL,
      owner: quotationInfo.customerName,
      isPublic: true,
      type: this.state.type,
      userID: quotationInfo.userId,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms === undefined ? quotationInfo?.termsconditions : quotationInfo.terms,
        offlineItems: localStorage.getItem("quotationItems"),
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        configurations: quotationInfo.configurations,
        followupDate: moment(quotationInfo?.followupDate).format("YYYY-MM-DD"),
      },
      adult: quotationInfo?.adult,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      followupDate: moment(quotationInfo?.followupDate).format("YYYY-MM-DD"),
      createCustomer_validateEmailAndPhone: true,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: false,
    };
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.id);
      //Fixed issue : cannot update state in event of unmount component.
      // this.setState({
      //   savedCartId: localStorage.getItem("cartLocalId"),
      //   isBtnLoading: false,
      // });
      let localQuotationInfo = JSON.parse(
        localStorage.getItem("quotationDetails")
      );
      localQuotationInfo.status = localQuotationInfo?.status === "" ? "New" : localQuotationInfo?.status;
      localStorage.setItem(
        "quotationDetails",
        JSON.stringify(localQuotationInfo)
      );
    });
  };

  saveQuotation = () => {
    // Save Quotation Changes
    this.setState({ isBtnLoading: true });
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));

    var reqURL = "quotation/update";
    var reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      name: quotationInfo.title,
      imageURL: quotationInfo.imageURL,
      owner: quotationInfo.customerName,
      isPublic: true,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms === undefined ? quotationInfo?.termsconditions : quotationInfo.terms,
        offlineItems: localStorage.getItem("quotationItems"),
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        configurations: quotationInfo.configurations,
        inquiryId: quotationInfo.inquiryId,
        followupDate: moment(quotationInfo?.followupDate).format("YYYY-MM-DD"),
      },
      adult: quotationInfo?.adult,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      followupDate: moment(quotationInfo?.followupDate).format("YYYY-MM-DD"),
      validateEmailAndPhone: true,
      UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: true
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      this.setState({
        savedCartId: localStorage.getItem("cartLocalId"),
        isSaveSucessMsg: true,
        isBtnLoading: false,
      });
      let localQuotationInfo = JSON.parse(
        localStorage.getItem("quotationDetails")
      );
      localQuotationInfo.status = localQuotationInfo?.status === "" ? "New" : localQuotationInfo?.status;
      localStorage.setItem(
        "quotationDetails",
        JSON.stringify(localQuotationInfo)
      );

      setTimeout(() => {
        this.setState({ isSaveSucessMsg: false });
      }, 5000);

      // this.props.match.params.mode === "DetailsInquiry" &&
      //   this.saveInquiry(quotationInfo);
    });
  };

  confirmDeleteQuotation = () => {
    this.setState({ results: "" });
    var reqURL = "quotation/delete";

    var reqOBJ = { id: this.state.deleteItem.id };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      this.getQuotations(false, 'load');
      let inquiryId = this.state.deleteItem.data?.inquiryId;
      if (inquiryId) {
        this.getInquiryDetails(inquiryId);
      }
    });
  };

  getInquiryDetails = (id) => {
    var reqURL = "inquiry?id=" + id;
    var reqOBJ = "";

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        this.handleUpdateInquiry(data);
      },
      "GET"
    );
  };

  handleUpdateInquiry = (data) => {
    data.data.itemId = "";
    data.data.itemType = "";
    var reqURL = "inquiry/update";
    var reqOBJ = data;
    apiRequester_quotation_api(reqURL, reqOBJ, () => { });
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.confirmDeleteQuotation();
  };

  quotationDetails = (item, fromcopy) => {
    if (item.isQuickproposal && localStorage.getItem('portalType') === 'B2C') {
      let cartLocalId = localStorage.getItem("cartLocalId");
      if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
        let portalURL = window.location.origin.toLowerCase() + '/' + window.location.pathname.split('/')[1];
        window.open(`${portalURL}/EmailView/${cartLocalId}`, "_blank");
      }
      else {
        window.open(`/EmailView/${cartLocalId}`, "_blank");
      }
    }

    let customerDetails = {
      customerName: item.data.customerName,
      email: item.data.email,
      phone: item.data.phone,
      title: item.data.name,
      terms: item.data.terms,
      termsconditions: item.data.termsconditions,
      duration: item.data.duration,
      startDate: moment(item.data.startDate).format('YYYY-MM-DD'),
      endDate: moment(item.data.endDate).format('YYYY-MM-DD'),
      type: item.data.type,
      status: item.data.status,
      inquiryId: item.data.inquiryId,
      userId: item.userId,
      imageURL: item.imageURL,
      configurations: item.data.configurations,
      id: item.id,
      isQuickProposal: item.isQuickproposal,
      priority: item.priority,
      budget: item.budget,
      adult: item.adult,
      followupDate: moment(item.followupDate).format("YYYY-MM-DD"),
      children: item.children,
      infant: item.infant,
      tripType: item.tripType,
      documentPath: item.documentPath,
      fileName: item.fileName,
      quickproposalcomments: item.quickproposalcomments
    };

    let quotationItems = [];

    item.data.offlineItems &&
      JSON.parse(item.data.offlineItems) &&
      JSON.parse(item.data.offlineItems).map(
        (item) => item.offlineItem && quotationItems.push(item)
      );

    localStorage.setItem("cartLocalId", item.id ? item.id : "");
    localStorage.setItem("quotationDetails", JSON.stringify(customerDetails));
    localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    if (item.isQuickproposal && localStorage.getItem('portalType') === 'B2C') { return; }
    if (!fromcopy) {
      this.props.history.push(`/${this.state.type}/Details`);
    }
    if (item.isQuickproposal && localStorage.getItem('portalType') === 'B2B') {
      this.props.history.push(`/${this.state.type}/Edit`);
    }
  };

  getAuthToken = () => {
    if (this.props.match.params.filtermode) {
      this.setDefaultFilter(this.getQuotations);
    }
    else {
      this.getQuotations(false, 'initial-load');
    }
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      if (this.props.match.params.filtermode) {
        this.setDefaultFilter(this.getQuotations);
      }
      else {
        this.getQuotations(false, 'initial-load');
      }
    }); */
  };

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

  handleFilters = (data, mode) => {

    let filter = this.state.filter;

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
    filter["title"] = data["title"] ? data["title"] : "";
    filter["specificmonth"] = data.specificmonth;

    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getQuotations(false, mode, mode));

  };

  handlePaginationResults = (currentPage) => {
    this.setState({ currentPage }, () =>
      this.getQuotations(false, "pageing", undefined)
    );
  };

  getExportData = () => {
    this.getQuotations(true, "export", this.exportData)
  }

  exportData = data => {
    let exportData = data.filter(x => x.isQuickproposal === false).map((item, count) => {
      if (!item.data.offlineItems || JSON.parse(item.data.offlineItems).length === 0) {
        return {
          "Trip Name": item.data.name,
          "Customer Name": item.data.customerName,
          "Email": item.data.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : item.data.email,
          "Phone": item.data.phone,
          "TripStartDate": DateComp({ date: item.data.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }),
          "TripEndDate": DateComp({ date: item.data.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }),
          "TripDuration": item.data.duration,
        };
      }
      else {
        let offlineItems = JSON.parse(item.data.offlineItems);
        return offlineItems.map((itineraryItem, index) => {
          itineraryItem = itineraryItem.offlineItem;
          let business = itineraryItem?.business ?? "";
          business = business.toLowerCase() === "air" ? "flight" : business;

          return {
            "Trip Name": index === 0 ? item.data.name : "",
            "Customer Name": index === 0 ? item.data.customerName : "",
            "Email": index === 0 ? (item.data.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : item.data.email) : "",
            "Phone": index === 0 ? item.data.phone : "",
            "TripStartDate": index === 0 ? item.data.startDate ? DateComp({ date: item.data.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "" : "",
            "TripEndDate": index === 0 ? item.data.endDate ? DateComp({ date: item.data.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "" : "",
            "TripDuration": index === 0 ? item.data.duration : "",
            "Business": business,
            "FromLocation": this.getExcelColumnData(itineraryItem, business, "fromLocation", itineraryItem?.fromLocation ?? ""),
            "ToLocation": this.getExcelColumnData(itineraryItem, business, "toLocation", itineraryItem?.toLocation ?? ""),
            "Name": this.getExcelColumnData(itineraryItem, business, "name", itineraryItem?.name ?? ""),
            "StartDate": this.getExcelColumnData(itineraryItem, business, "startDate", itineraryItem?.startDate ? DateComp({ date: itineraryItem.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "EndDate": this.getExcelColumnData(itineraryItem, business, "endDate", itineraryItem?.endDate ? DateComp({ date: itineraryItem.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "CostPrice": this.getExcelColumnData(itineraryItem, business, "costPrice", itineraryItem?.costPrice ?? ""),
            "SellPrice": this.getExcelColumnData(itineraryItem, business, "sellPrice", (Number(itineraryItem?.totalAmount) > 0 ? itineraryItem?.totalAmount : (itineraryItem?.sellPrice ?? ""))),
            "Vendor": this.getExcelColumnData(itineraryItem, business, "vendor", itineraryItem?.vendor ?? ""),
            "ConfirmationNumber": this.getExcelColumnData(itineraryItem, business, "brn", itineraryItem?.brn ?? ""),
            "ItemType": this.getExcelColumnData(itineraryItem, business, "itemType", itineraryItem?.itemType ?? ""),
            "Description": this.getExcelColumnData(itineraryItem, business, "description", itineraryItem?.description ?? ""),
            "SupplierCurrency": this.getExcelColumnData(itineraryItem, business, "supplierCurrency", itineraryItem?.supplierCurrency ?? ""),
            "ConversionRate": this.getExcelColumnData(itineraryItem, business, "conversionRate", itineraryItem?.conversionRate ?? ""),
            "BookBefore": this.getExcelColumnData(itineraryItem, business, "bookBefore", itineraryItem?.bookBefore ? DateComp({ date: itineraryItem.bookBefore, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "SupplierCostPrice": this.getExcelColumnData(itineraryItem, business, "supplierCostPrice", itineraryItem?.supplierCostPrice ?? ""),
            "Day": this.getExcelColumnData(itineraryItem, business, "day", itineraryItem?.day ?? ""),
            "NumberOfRooms": this.getExcelColumnData(itineraryItem, business, "noRooms", itineraryItem?.noRooms ?? ""),
            "Rating": this.getExcelColumnData(itineraryItem, business, "rating", itineraryItem?.rating ?? ""),
            "MealType": this.getExcelColumnData(itineraryItem, business, "mealType", itineraryItem?.mealType ?? ""),
            "Nights": this.getExcelColumnData(itineraryItem, business, "nights", itineraryItem?.nights ?? ""),
            "Duration": this.getExcelColumnData(itineraryItem, business, "duration", itineraryItem?.duration ?? ""),
            "Guests": this.getExcelColumnData(itineraryItem, business, "guests", itineraryItem?.guests ?? ""),
            "NoofAdult": this.getExcelColumnData(itineraryItem, business, "adult", itineraryItem?.adult ?? ""),
            "NoofChild": this.getExcelColumnData(itineraryItem, business, "child", itineraryItem?.child ?? ""),
            "NoofInfant": this.getExcelColumnData(itineraryItem, business, "infant", itineraryItem?.infant ?? ""),
            "PickupTime": this.getExcelColumnData(itineraryItem, business, "pickupTime", itineraryItem?.pickupTime ?? ""),
            "RoundTrip": this.getExcelColumnData(itineraryItem, business, "isRoundTrip", itineraryItem?.isRoundTrip ?? ""),
            "DayDepart": this.getExcelColumnData(itineraryItem, business, "dayDepart", itineraryItem?.dayDepart ?? ""),
            "DayDepartEnd": this.getExcelColumnData(itineraryItem, business, "dayDepartEnd", itineraryItem?.dayDepartEnd ?? ""),
            "DepartStartDate": this.getExcelColumnData(itineraryItem, business, "departStartDate", itineraryItem.departStartDate ? DateComp({ date: itineraryItem.departStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "DepartEndDate": this.getExcelColumnData(itineraryItem, business, "departEndDate", itineraryItem.departEndDate ? DateComp({ date: itineraryItem.departEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "DepartStartTime": this.getExcelColumnData(itineraryItem, business, "departStartTime", itineraryItem?.departStartTime ?? ""),
            "DepartEndTime": this.getExcelColumnData(itineraryItem, business, "departEndTime", itineraryItem?.departEndTime ?? ""),
            "DepartAirlineName": this.getExcelColumnData(itineraryItem, business, "departAirlineName", itineraryItem?.departAirlineName ?? ""),
            "DepartFlightNumber": this.getExcelColumnData(itineraryItem, business, "departFlightNumber", itineraryItem?.departFlightNumber ?? ""),
            "DepartClass": this.getExcelColumnData(itineraryItem, business, "departClass", itineraryItem?.departClass ?? ""),
            "DepartStops": this.getExcelColumnData(itineraryItem, business, "departStops", (itineraryItem?.departStops ? (Array.isArray(itineraryItem?.departStops) ? itineraryItem?.departStops.length : itineraryItem?.departStops) : "")),
            "DepartDurationHour": this.getExcelColumnData(itineraryItem, business, "departDurationH", itineraryItem?.departDurationH ?? ""),
            "DepartDurationMinute": this.getExcelColumnData(itineraryItem, business, "departDurationM", itineraryItem?.departDurationM ?? ""),
            "DayReturn": this.getExcelColumnData(itineraryItem, business, "dayReturn", itineraryItem?.dayReturn ?? ""),
            "DayReturnEnd": this.getExcelColumnData(itineraryItem, business, "dayReturnEnd", itineraryItem?.dayReturnEnd ?? ""),
            "ReturnStartDate": this.getExcelColumnData(itineraryItem, business, "returnStartDate", itineraryItem.returnStartDate ? DateComp({ date: itineraryItem.returnStartDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "ReturnEndDate": this.getExcelColumnData(itineraryItem, business, "returnEndDate", itineraryItem.returnEndDate ? DateComp({ date: itineraryItem.returnEndDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""),
            "ReturnStartTime": this.getExcelColumnData(itineraryItem, business, "returnStartTime", itineraryItem?.returnStartTime ?? ""),
            "ReturnEndTime": this.getExcelColumnData(itineraryItem, business, "returnEndTime", itineraryItem?.returnEndTime ?? ""),
            "ReturnAirlineName": this.getExcelColumnData(itineraryItem, business, "returnAirlineName", itineraryItem?.returnAirlineName ?? ""),
            "ReturnFlightNumber": this.getExcelColumnData(itineraryItem, business, "returnFlightNumber", itineraryItem?.returnFlightNumber ?? ""),
            "ReturnClass": this.getExcelColumnData(itineraryItem, business, "returnClass", itineraryItem?.returnClass ?? ""),
            "ReturnStops": this.getExcelColumnData(itineraryItem, business, "returnStops", (itineraryItem?.returnStops ? (Array.isArray(itineraryItem?.returnStops) ? itineraryItem?.returnStops.length : itineraryItem?.returnStops) : "")),
            "ReturnDurationHour": this.getExcelColumnData(itineraryItem, business, "returnDurationH", itineraryItem?.returnDurationH ?? ""),
            "ReturnDurationMinute": this.getExcelColumnData(itineraryItem, business, "returnDurationM", itineraryItem?.returnDurationM ?? ""),
          };
        });
      }
    });

    exportData = [].concat.apply([], exportData);

    if (exportData.length === 0) {
      exportData = [{
        "Trip Name": "No records found.",
        "Customer Name": "",
        "Email": "",
        "Phone": "",
        "TripStartDate": "",
        "TripEndDate": "",
        "TripDuration": "",
        "Business": "",
        "FromLocation": "",
        "ToLocation": "",
        "Name": "",
        "StartDate": "",
        "EndDate": "",
        "CostPrice": "",
        "SellPrice": "",
        "Vendor": "",
        "ConfirmationNumber": "",
        "ItemType": "",
        "Description": "",
        "SupplierCurrency": "",
        "ConversionRate": "",
        "BookBefore": "",
        "SupplierCostPrice": "",
        "Day": "",
        "NumberOfRooms": "",
        "Rating": "",
        "MealType": "",
        "Nights": "",
        "Duration": "",
        "Guests": "",
        "NoofAdult": "",
        "NoofChild": "",
        "NoofInfant": "",
        "PickupTime": "",
        "RoundTrip": "",
        "DayDepart": "",
        "DayDepartEnd": "",
        "DepartStartDate": "",
        "DepartEndDate": "",
        "DepartStartTime": "",
        "DepartEndTime": "",
        "DepartAirlineName": "",
        "DepartFlightNumber": "",
        "DepartClass": "",
        "DepartStops": "",
        "DepartDurationHour": "",
        "DepartDurationMinute": "",
        "DayReturn": "",
        "DayReturnEnd": "",
        "ReturnStartDate": "",
        "ReturnEndDate": "",
        "ReturnStartTime": "",
        "ReturnEndTime": "",
        "ReturnAirlineName": "",
        "ReturnFlightNumber": "",
        "ReturnClass": "",
        "ReturnStops": "",
        "ReturnDurationHour": "",
        "ReturnDurationMinute": "",
      }]
    }

    const type = this.state.type === "Quotation"
      ? Trans("_quotationReplaceKeys")
      : this.state.type === "Quotation_Master"
        ? Trans("_quotationReplaceKeys") + " Master"
        : this.state.type;
    const workbook1 = XLSX.utils.json_to_sheet(exportData);

    workbook1['!cols'] = [
      { wpx: 100 }, { wpx: 100 }, { wpx: 200 }, { wpx: 120 }, { wpx: 100 }, //00
      { wpx: 100 }, { wpx: 50 }, { wpx: 80 }, { wpx: 150 }, { wpx: 150 }, //10
      { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 50 }, { wpx: 50 },
      { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, //20
      { wpx: 100 }, { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 },
      { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, //30
      { wpx: 50 }, { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 100 },
      { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 150 }, { wpx: 100 }, //40
      { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 },
      { wpx: 50 }, { wpx: 100 }, { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, //50
      { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 50 }, { wpx: 50 },
      { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, //60
    ];

    const workbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': workbook1
      }
    };

    this.setState({
      isBtnLoadingExport: false,
    });

    return XLSX.writeFile(workbook, type + ".xlsx");
  }

  getExcelColumnData = (allData, business, column, data) => {
    let returnValue = "";
    let generalFields = ['day', 'costPrice', 'sellPrice', 'vendor', 'brn', 'description', 'supplierCurrency', 'conversionRate', 'bookBefore', 'supplierCostPrice'];
    let hotelFields = ['toLocation', 'name', 'startDate', 'endDate', 'itemType', 'noRooms', 'rating', 'mealType', 'nights'];
    let activityFields = ['toLocation', 'name', 'itemType', 'guests', 'startDate', 'duration'];
    let transfersFields = ['fromLocation', 'toLocation', 'name', 'itemType', 'startDate', 'guests', 'pickupTime', 'duration'];
    let customFields = ['toLocation', 'name', 'startDate', 'itemType'];
    let airFields = ['fromLocation', 'toLocation', 'adult', 'child', 'infant', 'roundTrip'];
    let airDepartFields = ['dayDepart', 'dayDepartEnd', 'departStartDate', 'departEndDate', 'departStartTime', 'departEndTime', 'departAirlineName', 'departFlightNumber', 'departClass', 'departStops', 'departDurationH', 'departDurationM'];
    let airArrivalFields = ['dayReturn', 'dayReturnEnd', 'returnStartDate', 'returnEndDate', 'returnStartTime', 'returnEndTime', 'returnAirlineName', 'returnFlightNumber', 'returnClass', 'returnStops', 'returnDurationH', 'returnDurationM'];

    if (generalFields.indexOf(column) > -1)
      returnValue = data;
    else {
      switch (business) {
        //Hotel
        case "hotel":
          if (hotelFields.indexOf(column) > -1) {
            if (column === "rating" && data.toString() === "0") {
              returnValue = "";
            }
            else {
              returnValue = data;
            }
          }
          break;
        //Activity
        case "activity":
          if (activityFields.indexOf(column) > -1)
            returnValue = data;
          break;
        //Transfers
        case "transfers":
          if (transfersFields.indexOf(column) > -1)
            returnValue = data;
          break;
        //Custom
        case "custom":
          if (customFields.indexOf(column) > -1)
            returnValue = data;
          break;
        //Flight
        case "flight":
          if (airFields.indexOf(column) > -1)
            returnValue = data;
          else if (airDepartFields.indexOf(column) > -1)
            returnValue = data;
          else if (allData.isRoundTrip && airArrivalFields.indexOf(column) > -1) {
            returnValue = data;
          }
          if (column === "isRoundTrip")
            returnValue = data === true ? "Yes" : "No";
          break;
        default:
          returnValue = "";
          break;
      }
    }
    return returnValue;
  }

  componentDidMount() {
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~quotation-manage-quotation")) {
      this.props.history.push('/');
    }
    this.getAuthToken();
    this.resetQuotation();
  }

  removeFilter = (filterName) => {
    let filter = this.state.filter;

    filter[filterName] = "";
    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getQuotations(false, "filter"));
    this.handleFilters(filter, 'filter');
    this.myRef.setDefaultFilter();
  }

  render() {
    const {
      results,
      isDeleteConfirmPopup,
      type,
      isFilters,
      currentPage,
      hasNextPage,
      isBtnLoading,
      isBtnLoadingExport,
      isBtnLoadingPageing,
      isCopyItemPopup,
    } = this.state;
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    const { userInfo } = this.props;
    let pageTitle = '';
    if (localStorage.getItem('portalType') === 'B2C') {
      pageTitle = "My " + (type === "Quotation" ? Trans("_quotationReplaceKey") : type);
    }
    else if (type === "Quotation")
      pageTitle = Trans("_manageQuotations").replace("##Quotations##", Trans("_quotationReplaceKeys"));
    else if (type === "Itinerary")
      pageTitle = Trans("_manageItineraries");

    let IsFilterApplied = false;
    if (this.state.filter.customername !== ""
      || this.state.filter.email !== ""
      || this.state.filter.phone !== ""
      || this.state.filter.title !== ""
      || this.state.filter.dateMode !== ""
      || this.state.filter.searchBy !== ""
    ) {
      IsFilterApplied = true;
    }

    return (
      <div className="quotation quotation-list">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {pageTitle}
            </title>
          </Helmet>
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <h1 className="text-white m-0 p-0 f30">
                  <SVGIcon
                    name="file-text"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGIcon>
                  {pageTitle}
                </h1>
              </div>
              <div className="col-lg-9 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-light mt-1"
                  onClick={this.showHideFilters}
                >
                  Filters
                </button>
                {localStorage.getItem('portalType') !== 'B2C' && type === "Quotation" && (
                  <React.Fragment>
                    <AuthorizeComponent title="dashboard-menu~quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        className="btn btn-sm btn-primary  ml-1 mt-1"
                        onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~quotation-create-quotation")
                          ? this.setState({ isSubscriptionPlanend: true })
                          : (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~quotation-create-quotation") ? this.props.history.push(`/Quotation/Create`) : this.setState({ isshowauthorizepopup: true }))}
                      >
                        {Trans("_createQuotation").replace("##Quotation##", Trans("_quotationReplaceKey"))}
                      </button>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        className="btn btn-sm btn-primary  ml-1 mt-1"
                        onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~quotation-create-quotation")
                          ? this.setState({ isSubscriptionPlanend: true })
                          : (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~quotation-create-quotation") ? this.props.history.push(`/Quotation/CreateQuick`) : this.setState({ isshowauthorizepopup: true }))}
                      >
                        {Trans("_createQuotation").replace("##Quotation##", "Quick " + Trans("_quotationReplaceKey"))}
                      </button>
                    </AuthorizeComponent>
                  </React.Fragment>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && type === "Quotation" && (
                  <AuthorizeComponent title="dashboard-menu~quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  ml-1 mt-1"
                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~quotation-import-quotation")
                        ? this.setState({ isSubscriptionPlanend: true })
                        : (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~quotation-import-quotation") ? this.props.history.push(`/ImportQuotation`) : this.setState({ isshowauthorizepopup: true }))}
                    >
                      Import {Trans("_quotationReplaceKeys")}
                    </button>
                  </AuthorizeComponent>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && type === "Itinerary" && (
                  <AuthorizeComponent title="dashboard-menu~itineraries-create-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  ml-1 mt-1"
                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~itineraries-create-itineraries") ? this.setState({ isSubscriptionPlanend: true }) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~itineraries-create-itineraries") ? this.props.history.push(`/Itinerary/Create`) : this.setState({ isshowauthorizepopup: true })}
                    >
                      {Trans("Create Itinerary")}
                    </button>
                  </AuthorizeComponent>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && type === "Itinerary" && (
                  <AuthorizeComponent title="dashboard-menu~itineraries-import-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  ml-1 mt-1"
                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~itineraries-import-itineraries") ? this.setState({ isSubscriptionPlanend: true }) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~itineraries-create-itineraries") ? this.props.history.push(`/ImportItinerary`) : this.setState({ isshowauthorizepopup: true })}
                    >
                      Import Itinerary
                    </button>
                  </AuthorizeComponent>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") &&
                  <React.Fragment>
                    <AuthorizeComponent title={type === "Quotation" ? "QuotationList~quotation-export-quotation" : "ItineraryList~itineraries-export-itineraries"} type="button" rolepermissions={userInfo.rolePermissions}>
                      {isBtnLoadingExport &&
                        <button
                          className="btn btn-sm btn-primary ml-1 mt-1"
                        >
                          <span className="spinner-border spinner-border-sm mx-2"></span>
                          Export {type === "Quotation" ? Trans("_quotationReplaceKeys") : "Itineraries"}
                        </button>
                      }
                      {!isBtnLoadingExport &&
                        <button
                          className="btn btn-sm btn-primary ml-1 mt-1"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (type === "Quotation" ? "QuotationList~quotation-export-quotation" : "ItineraryList~itineraries-export-itineraries")) ? this.getExportData() : this.setState({ isshowauthorizepopup: true })}
                        >
                          Export {type === "Quotation" ? Trans("_quotationReplaceKeys") : "Itineraries"}
                        </button>
                      }
                    </AuthorizeComponent>
                  </React.Fragment>
                }
                {localStorage.getItem('portalType') !== 'B2C' &&
                  <AuthorizeComponent title={type === "Quotation" ? "QuotationList~quotation-download-sample" : "ItineraryList~itineraries-download-sample"} type="button" rolepermissions={userInfo.rolePermissions}>
                    <a href={type === "Quotation" ? quotationSamplePDF : itinerarySamplePDF} className="text-white btn btn-sm btn-primary ml-1 mt-1" download={`sample ${type === "Quotation" ? Trans("_quotationReplaceKeys") : type}.pdf`}>Download Sample</a>
                  </AuthorizeComponent>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {results && isFilters && (
            <QuotationListFilters
              onRef={ref => (this.myRef = ref)}
              mode={type.toLowerCase()}
              filterData={this.state.filter}
              handleFilters={this.handleFilters}
              showHideFilters={this.showHideFilters}
              filterMode={this.props.match.params.filtermode}
              isBtnLoadingMode={this.state.isBtnLoadingMode}
            />
          )}
          {IsFilterApplied &&
            <QuotationAppliedFilter
              filterData={this.state.filter}
              removeFilter={this.removeFilter}
            />
          }

          <div className="border mt-2">
            {results ? (
              <div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                      <div className="row">
                        <div className="col-lg-6">
                          <b>{type === "Quotation" ? Trans("_quotationReplaceKey") : type} Details</b>
                        </div>
                        <div className="col-lg-4">
                          <b>Customer Details</b>
                        </div>
                        <div className="col-lg-2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {results.map((item, key) => {
                  const itemDtl = item.data;
                  return (
                    <div
                      key={key}
                      className="border-bottom pl-3 pr-3 pt-3 position-relative"
                      style={itemDtl?.status.toLowerCase() === "booked" ? { backgroundColor: "#EEE9E8" } : {}}
                    >
                      <div
                        className="row quotation-list-item"
                        onClick={() => this.quotationDetails(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="col-lg-6 d-flex align-items-center pb-3">
                          <div>
                            <span className="quotation-list-usericon">
                              {itemDtl.customerName}
                            </span>
                          </div>
                          <div>
                            <h5 className="m-0 p-0 mb-1">{itemDtl.name}
                              {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") && item.priority &&
                                <span style={{ fontSize: "small" }}
                                  className={item.priority === "Low" ?
                                    "badge badge-info badge-info-custom mt-1 px-1 ml-2" :
                                    item.priority === "High" ?
                                      "badge badge-danger badge-info-danger mt-1 px-1 ml-2" :
                                      "badge badge-primary badge-info-primary mt-1 px-1 ml-2"
                                  }>
                                  <b className={item.priority === "Low" ?
                                    "text-secondary d-block " :
                                    item.priority === "High" ?
                                      "text-white d-block " :
                                      "text-white d-block "
                                  }>
                                    {item.priority}
                                  </b>
                                </span>}
                              {item.isQuickproposal === true ?
                                <span style={{ fontSize: "small" }}
                                  className={"badge badge-primary badge-info-primary mt-1 px-1 ml-2"
                                  }>
                                  <b className={"text-white d-block "
                                  }>
                                    Quick Proposal
                                  </b>
                                </span> : <span></span>}</h5>

                            <small className="d-block text-secondary mt-2">
                              {type === "Itinerary" ? (
                                <React.Fragment>
                                  <span>
                                    Start Date:{" "}
                                    <DateComp date={itemDtl.startDate}></DateComp>
                                  </span>
                                  <span className="ml-4">
                                    End Date:{" "}
                                    <DateComp date={itemDtl.endDate}></DateComp>
                                  </span>
                                  <span className="ml-4">
                                    No of Days: {itemDtl.duration}
                                  </span>
                                </React.Fragment>
                              ) : (
                                itemDtl.customerName
                              )}
                            </small>

                            <div
                              className="text-primary mt-2 d-none tourwiz-agentName"
                              style={{ display: "none" }}
                            >
                              {itemDtl.agentName}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 d-flex justify-content-between pb-3">
                          <div>
                            <span className="text-secondary mr-3 d-block">
                              <b className="text-primary">
                                {itemDtl.customerName}
                              </b>
                            </span>
                            <span className="text-secondary mr-3">
                              <small>{itemDtl.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : itemDtl.email}</small>
                              <small>
                                <span className="quotation-list-item-sprt">
                                  {itemDtl.email === "" || itemDtl.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : ' | '}
                                </span>
                                {itemDtl.phone}
                              </small>
                              <small>
                                <span className="quotation-list-item-sprt">
                                  {" "}
                                  |{" "}
                                </span>
                                Created Date :{" "}
                                <DateComp date={itemDtl.createdDate}></DateComp>
                              </small>
                            </span>
                            {item.bookBefore &&
                              <span className="text-secondary mr-3 d-block">
                                <small>Book Before :{" "}
                                  <DateComp date={item.bookBefore}></DateComp>
                                </small>
                              </span>}
                          </div>
                          {itemDtl?.status.toLowerCase() === "booked" &&
                            <div className="text-success text-underline" style={{ position: "absolute", bottom: "4px", right: "20px" }}>
                              <b>Completed</b>
                            </div>
                          }
                        </div>
                      </div>
                      <AuthorizeComponent title={type === "Quotation" ? "QuotationList~quotation-delete-quotation" : "ItineraryList~itineraries-delete-itineraries"} type="button" rolepermissions={userInfo.rolePermissions}>
                        <button
                          className="btn btn-sm position-absolute bg-light p-1 border d-flex align-items-center"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (type === "Quotation" ? "QuotationList~quotation-delete-quotation" : "ItineraryList~itineraries-delete-itineraries")) ? this.deleteQuotation(item) : this.setState({ isshowauthorizepopup: true })}
                          style={{ zIndex: "100", right: "16px", top: "26px" }}
                          title="Delete"
                        >
                          <SVGIcon
                            name="delete"
                            width="16"
                            height="16"
                            className="text-secondary d-flex align-items-center"
                          ></SVGIcon>
                        </button>
                      </AuthorizeComponent>
                      <AuthorizeComponent title={type === "Quotation" ? "QuotationList~quotation-copy-quotation" : "ItineraryList~itineraries-copy-itineraries"} type="button" rolepermissions={userInfo.rolePermissions}>
                        {!item.isQuickproposal &&
                          <button
                            className="btn btn-sm position-absolute bg-light p-1 border d-flex align-items-center"
                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (type === "Quotation" ? "QuotationList~quotation-copy-quotation" : "ItineraryList~itineraries-copy-itineraries")) ? this.copyQuotation(item) : this.setState({ isshowauthorizepopup: true })}
                            style={{ zIndex: "100", right: "50px", top: "26px" }}
                            title="Copy"
                          >
                            <SVGIcon
                              name="copy"
                              width="16"
                              height="16"
                              className="text-secondary d-flex align-items-center"
                            ></SVGIcon>
                          </button>
                        }
                        <button
                          className="btn btn-sm position-absolute bg-light p-1 border d-flex align-items-center"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (type === "Quotation"
                            ? "QuotationList~quotation-delete-quotation"
                            : "ItineraryList~itineraries-delete-itineraries"))
                            ? this.getActivityLogDetails(item)
                            : this.setState({ isshowauthorizepopup: true })}
                          style={{ zIndex: "100", right: "85px", top: "26px" }}
                          title="Activity Log"
                        >
                          <SVGIcon
                            name="info"
                            width="16"
                            height="16"
                            className="text-secondary d-flex align-items-center"
                          ></SVGIcon>
                        </button>
                      </AuthorizeComponent>
                    </div>
                  );
                })}

                {!isBtnLoading && results.length < 1 && (
                  <div className="p-4 text-center">
                    {type === "Itinerary"
                      ? "No Itineraries Found"
                      : "No " + Trans("_quotationReplaceKeys") + " Found."}
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
                {isCopyItemPopup && (
                  <ModelPopup
                    header={"Copy " + type}
                    content={<QuotationCreateCopy
                      type={type}
                      {...quotationInfo}
                      handleCreate={this.generateQuotation}
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
            ) : ""}
            {isBtnLoading &&
              <QuotationListLoading />
            }
          </div>

          <nav>
            <ul className="pagination justify-content-center mt-3">
              <li
                className={
                  this.state.totalRecords > 0 ? "page-item" : "page-item disabled d-none"
                }
                style={{
                  "display": "flex",
                  justifyContent: "space-between",
                  flexGrow: "2"
                }}
              >
                {!isBtnLoadingPageing &&
                  <span className="text-primary">Showing {((this.state.currentPage + 1) * this.state.pageSize) > this.state.totalRecords ? this.state.totalRecords : ((this.state.currentPage + 1) * this.state.pageSize)} out of {this.state.totalRecords}</span>}
                <button
                  className={"page-link" + (!hasNextPage ? " d-none" : "")}
                  onClick={() => this.handlePaginationResults(currentPage + 1)}
                >
                  {isBtnLoadingPageing && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Show More
                </button>
                <div></div>
              </li>
            </ul>
          </nav>
        </div>
        {
          this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
        {this.state.activityLogDetails ? (
          <ModelPopup
            header={"Activity Log"}
            content={<ActivityLogDetails activityLogDetails={this.state.activityLogDetails} userInfo={userInfo} type={this.state.type} />}
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
    );
  }
}

export default QuotationList;
