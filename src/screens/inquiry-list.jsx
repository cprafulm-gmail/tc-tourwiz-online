import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import QuotationListLoading from "../components/quotation/quotation-list-loading";
import ActionModal from "../helpers/action-modal";
import DateComp from "../helpers/date";
import QuotationReportFilters from "../components/quotation/quotation-report-filters";
import Amount from "../helpers/amount";
import moment from "moment";
import * as Global from "../helpers/global";
import XLSX from "xlsx";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import InquiryView from "../components/quotation/inquiry-view";
import ModelPopup from "../helpers/model";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import InquiryAppliedFilter from "../components/quotation/inquiry-filter-applied";
import ActivityLogDetails from "../components/quotation/activity-log-details";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import { Trans } from "../helpers/translate";
import { Helmet } from "react-helmet";
import Loader from "../components/common/loader"

class InquiryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      resultsExport: "",
      isDeleteConfirmPopup: false,
      deleteItem: "",
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
      isBtnLoadingMode: "",
      isViewInquiry: false,
      filter: {
        customername: "",
        inquiryNumber: "",
        email: "",
        phone: "",
        title: "",
        fromDate: moment().add(-1, "M").format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        inquirysource: "",
        triptype: "",
        inquirytype: "",
        bookingfor: "",
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        groupBy: "inquirytype",
        stayInDays: 30,
        priority: ""
      },
      isshowauthorizepopup: false,
      isSubscriptionPlanend: false,
      itemtoview: "",
      activityLogDetails: null,
      isBtnLoading_activityLog: false,
      isBtnLoading: false

    };
    this.myRef = null;

  }

  getInquiries = (isExport = false, callback, isBtnLoadingMode) => {
    if (isExport) {
      this.setState({ isBtnLoadingExport: true });
    }
    else
      this.setState({ totalRecords: 0, isBtnLoading: true, isBtnLoadingMode });

    var reqURL = "inquiries";
    let cPage = !isExport ? this.state.currentPage : 0;
    let pSize = !isExport ? this.state.pageSize : 1000;
    var reqURL =
      "inquiries?page=" +
      +cPage +
      "&records=" +
      pSize;
    if (this.state.filter.bookingfor)
      reqURL += "&bookingfor=" + this.state.filter.bookingfor;
    if (this.state.filter.customername)
      reqURL += "&customername=" + this.state.filter.customername;
    if (this.state.filter.inquiryNumber)
      reqURL += "&inquiryNumber=" + this.state.filter.inquiryNumber;
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
    if (this.state.filter.inquirysource)
      reqURL += "&inquirysource=" + this.state.filter.inquirysource;
    if (this.state.filter.triptype)
      reqURL += "&triptype=" + this.state.filter.triptype;
    if (this.state.filter.inquirytype)
      reqURL += "&inquirytype=" + this.state.filter.inquirytype;
    if (this.state.filter.priority)
      reqURL += "&priority=" + this.state.filter.priority;
    reqURL += "&datemode=" + this.state.filter.dateMode;
    //reqURL += "&status=active";
    reqURL += "&searchby=" + this.state.filter.searchBy;
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;
    //reqURL += "&groupby=nogroup"; //+this.state.filter.groupBy;
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
          results = results.concat(data.result);

          let resultsDeleted = results.filter((x) => x.status === "deleted");
          //results = results.filter((x) => x.status === "active");

          let hasNextPage = true;
          if (
            data?.paging?.totalRecords > (this.state.currentPage === 0 ? 1 : this.state.currentPage + 1) * this.state.pageSize
          ) {
            hasNextPage = true;
          } else {
            hasNextPage = false;
          }

          this.setState({
            results,
            totalRecords: data?.paging?.totalRecords ?? 0,
            defaultResults: results,
            hasNextPage,
            isBtnLoading: false,
            isBtnLoadingMode: "",
          });
        }
      },
      "GET"
    );
  };

  getAuthToken = () => {
    if (this.props.match.params.filtermode) {
      this.setDefaultFilter(this.getInquiries);
    }
    else {
      this.getInquiries(false, undefined, "page-load");
    }
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      if (this.props.match.params.filtermode) {
        this.setDefaultFilter(this.getInquiries);
      }
      else {
        this.getInquiries(false, undefined, "page-load");
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

  deleteInquiry = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "InquiryList~inquiries-delete-inquiry")) {
      this.setState({
        deleteItem: item,
        isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
        currentPage: 0,
      });
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  confirmDeleteInquiry = () => {
    let deleteItem = this.state.deleteItem;
    deleteItem.id = deleteItem.id;
    deleteItem.status = "deleted";
    this.setState({ results: [] });

    var reqURL = "inquiry/update";
    var reqOBJ = deleteItem;
    apiRequester_quotation_api(reqURL, reqOBJ, () => {
      this.getInquiries(false, undefined, "delete");
    });
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.confirmDeleteInquiry();
  };

  InquiryDetails = (item, type) => {
    let key = "";
    if (type === "Itinerary")
      key = "InquiryList~inquiries-add-itinerary";
    else if (type === "Quotation" || type === "QuickQuotation")
      key = "InquiryList~inquiries-add-quotation";
    else
      key = "InquiryList~inquiries-add-package";

    this.setState({ isBtnLoading: true });

    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, key)) {
      if (type === "Package") {
        this.props.history.push(`/Package/Use/${item.data.marketPlacePackageID}/${item.id}`);
      }
      else {
        if (type === "Itinerary") {
          item.data.configurations = {
            isShowTotalPrice: true,
            isShowItemizedPrice: true,
            isShowFlightPrices: true,
            isShowImage: true,
            isHidePrice: true,
            ShowhideElementname: "showAllPrices",
            isPackagePricing: false,
            isHideFareBreakupInvoice: false
          };
        }
        else if (type === "Quotation") {
          item.data.configurations = {
            isShowTotalPrice: false,
            isShowItemizedPrice: true,
            isShowFlightPrices: true,
            isShowImage: true,
            isHidePrice: true,
            ShowhideElementname: "showAllPrices",
            isPackagePricing: false,
            isHideFareBreakupInvoice: false
          };
        }
        const quotationInfo = { ...item.data };
        quotationInfo.duration = Number(quotationInfo.duration);
        if (quotationInfo.duration === 0)
          quotationInfo.duration = 1;
        // if (quotationInfo.inquiryType.toLowerCase() === "hotel" && quotationInfo.duration !== 0)
        //   quotationInfo.duration = quotationInfo.duration + 1;
        if (quotationInfo.inquiryType.toLowerCase() !== "hotel" && quotationInfo.duration !== 0)
          quotationInfo.duration = quotationInfo.duration;
        quotationInfo.duration = quotationInfo.duration === -1 ? 1 : quotationInfo.duration;
        //item.data.duration = quotationInfo.duration;
        let reqURL = "quotation";
        let reqOBJ = {
          title: quotationInfo.title,
          name: quotationInfo.title,
          owner: quotationInfo.customerName,
          isPublic: true,
          type: type === "QuickQuotation" ? "Quotation" : type,
          userID: quotationInfo.userID,
          isQuickProposal: type === "QuickQuotation" ? true : false,
          data: {
            name: quotationInfo.title,
            title: quotationInfo.title,
            customerName: quotationInfo.customerName,
            email: quotationInfo.email,
            phone: quotationInfo.phone,
            duration: quotationInfo.duration,
            startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
            endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
            type: type === "QuickQuotation" ? "Quotation" : type,
            status: "saved",
            from: "Inquiry-" + type,
            month: quotationInfo.month,
            typetheme: quotationInfo.typetheme,
            budget: quotationInfo.budget,
            inclusions: quotationInfo.inclusions,
            adults: quotationInfo.adults,
            children: quotationInfo.children,
            infant: quotationInfo.infant,
            requirements: quotationInfo.requirements,
            inquiryId: item.id,
            configurations: quotationInfo.configurations
          },
        };
        apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
          item.data.priority = item.priority;
          item.data.userID = item.userID;
          item.data.itemId = data.id;
          item.data.itemType = type === "QuickQuotation" ? "Quotation" : type;
          item.isQuickProposal = type === "QuickQuotation" ? true : false;
          this.handleUpdateInquiry(item);
        });
      }

    }
    else {
      this.setState({ isshowauthorizepopup: true });
    }
  };

  CratePackage = (item) => {

    let supplierObj = {
      supplierCurrency: "",
      conversionRate: "",
      supplierCostPrice: 0,
      supplierTaxPrice: "",
      costPrice: 0,
      brn: "",
      markupPrice: 0,
      discountPrice: 0,
      CGSTPrice: 0,
      SGSTPrice: 0,
      IGSTPrice: 0,
      bookBefore: "",
      sellPrice: 0,
      amountWithoutGST: 0,
      isInclusive: false,
      percentage: (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
      processingFees: 0,
      tax1: 0,
      tax2: 0,
      tax3: 0,
      tax4: 0,
      tax5: 0,
      isTax1Modified: false,
      isTax2Modified: false,
      isTax3Modified: false,
      isTax4Modified: false,
      isTax5Modified: false,
      taxType: "CGSTSGST",
      totalAmount: 0,
      isSellPriceReadonly: false,
      flight: "",
      hotelDetails: "",
      Adults: 1,
      Child: 0,
      Infants: 0,
      supplierCostPriceAdult: "",
      supplierCostPriceChild: "",
      supplierCostPriceInfant: ""
    };

    let reqURL = "cms/package/add";

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let element = ("dashboard-menu~packages-create-package");
    let quota = Global.LimitationQuota[element];

    const quotationInfo = { ...item.data };
    quotationInfo.duration = Number(quotationInfo.duration);
    if (quotationInfo.duration === 0)
      quotationInfo.duration = 1;
    // if (quotationInfo.inquiryType.toLowerCase() === "hotel" && quotationInfo.duration !== 0)
    //   quotationInfo.duration = quotationInfo.duration + 1;
    if (quotationInfo.inquiryType.toLowerCase() !== "hotel" && quotationInfo.duration !== 0)
      quotationInfo.duration = quotationInfo.duration;
    quotationInfo.duration = quotationInfo.duration === -1 ? 1 : quotationInfo.duration;
    //item.data.duration = quotationInfo.duration;

    let reqOBJ = {
      request: {
        siteURL: "",
        countryID: "101",
        stateID: "",
        cityID: "",
        validFrom: moment(quotationInfo.startDate).format('YYYY-MM-DD'),
        validTo: moment(quotationInfo.endDate).format('YYYY-MM-DD'),
        bookingStartDate: "",
        bookingEndDate: "",
        packageName: quotationInfo.title,
        specialPromotionType: "",
        summaryDescription: "",
        description: "",
        termsConditions: "",
        sellPriceDisplay: 0,
        currencyID: "1",
        isShowOnHomePage: false,
        packageThemes: 3,
        cultureCode: "en-US",
        offerPrice: "",
        rating: 0,
        agentId: this.props.userInfo.agentID,
        userId: quotationInfo.userID,
        customerName: quotationInfo.customerName,
        customerEmail: quotationInfo.email ? quotationInfo.email : quotationInfo.phone + process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"),
        customerPhone: quotationInfo.phone,
        images: [],
        inclusionExclusion: [],
        bookBefore: "",
        vendor: "",
        twPriceGuideLine: "",
        isShowOnMarketPlace: false,
        totalAmount: 0,
        IGST: 0,
        CGST: 0,
        SGST: 0,
        PDFList: [],
        Status: "confirm",
        IsMaster: false,
        Duration: null,
        supplierObj: JSON.stringify(supplierObj),
        IsCMSPackage: false,
        price: 0,
        createCustomer_validateEmailAndPhone: true,
        createCustomer_UseAgentDetailInEmail: true,
        createCustomer_iscmsportalcreated: false,
        InquiryId: item.id
      }
    };

    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {
          item.data.itemId = resonsedata.id;
          item.data.itemType = "Package";
          this.handleUpdateInquiry(item);
        }
      }.bind(this),
      "POST"
    );
  }

  handleUpdateInquiry = (data) => {
    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: data.data.title,
      from: data.data.customerName,
      fromEmail: data.data.email,
      id: data.id,
      data: data.data,
      status: data.status,
      userID: data.userID,
      startDate: moment(data.startDate).format("YYYY-MM-DD"),
      endDate: moment(data.endDate).format("YYYY-MM-DD"),
      priority: data.priority,
    };

    apiRequester_quotation_api(reqURL, reqOBJ, () => {
      localStorage.setItem("inquiryId", data.id);
      localStorage.setItem("cartLocalId", data.data.itemId);
      if (data.isQuickProposal) {
        data.data.isQuickProposal = true;
      }
      localStorage.setItem("quotationDetails", JSON.stringify(data.data));
      localStorage.setItem("quotationItems", JSON.stringify([]));
      this.setState({ isBtnLoading: false });
      if (data.data.itemType.toLowerCase() === "package") {
        this.props.history.push(`/Package/Edit/${data.data.itemId}`);
      }
      else {
        this.props.history.push(`/${data.data.itemType === "QuickQuotation" ? "Quotation" : data.data.itemType}/DetailsInquiry`);
      }
    });
  };

  InquiryDetailsEdit = (item, type) => {
    let key = "";
    if (type === "Itinerary")
      key = "InquiryList~inquiries-add-itinerary";
    else if (type === "Quotation")
      key = "InquiryList~inquiries-add-quotation";
    else
      key = "InquiryList~inquiries-add-package";
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, key)) {
      if (type === "Package") {
        this.props.history.push(`/Package/Edit/${item.data.itemId}`);
      }
      else {
        this.getInquiryDetails(item);
      }
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  getInquiryDetails = (item) => {
    var reqURL = "quotation?id=" + item.data.itemId;
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        data.data.title = data.data.name;
        localStorage.setItem("inquiryId", item.id);
        localStorage.setItem("cartLocalId", data.id);
        if (data.isQuickproposal) {
          data.data.isQuickProposal = true;
          data.data.documentPath = data.documentPath;
          data.data.quickproposalcomments = data.quickproposalcomments;
          data.data.fileName = data.fileName;
        }
        localStorage.setItem("quotationDetails", JSON.stringify(data.data));
        localStorage.setItem("quotationItems", data.data.offlineItems ?? []);
        this.props.history.push(`/${item.data.itemType}/DetailsInquiry`);
      },
      "GET"
    );
  };

  InquiryDetailsEditOld = (item) => {
    const quotationInfo = item.data;

    let reqOBJ = {
      name: item.title,
      name: item.title,
      owner: quotationInfo.customerName,
      isPublic: true,
      type: quotationInfo.type,
      data: {
        name: quotationInfo.title,
        title: item.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        duration: quotationInfo.duration,
        startDate: "03/15/2021",
        endDate: "03/20/2021",
        type: quotationInfo.type,
        status: "saved",
        from: "Inquiry-" + quotationInfo.type,
        destination: quotationInfo.destination,
        month: quotationInfo.month,
        typetheme: quotationInfo.typetheme,
        budget: quotationInfo.budget,
        inclusions: quotationInfo.inclusions,
        adults: quotationInfo.adults,
        children: quotationInfo.children,
        infant: quotationInfo.infant,
        requirements: quotationInfo.requirements,
      },
    };

    let quotationItems = [];
    item.data.offlineItems &&
      JSON.parse(item.data.offlineItems) &&
      JSON.parse(item.data.offlineItems).map(
        (item) => item.offlineItem && quotationItems.push(item)
      );

    localStorage.setItem("inquiryId", item.id);
    localStorage.setItem("cartLocalId", quotationInfo.cartLocalId);
    localStorage.setItem("quotationDetails", JSON.stringify(reqOBJ.data));
    localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    this.props.history.push(`/${quotationInfo.type}/DetailsInquiry`);
  };

  importItinerary = () => {
    this.setState({ isImport: true });

    var reqURL = "quotations?page=0&records=100";
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let results = [];
        data.result.map(
          (item) => item.data.type === this.state.type && results.push(item)
        );
        this.setState({ importItineraries: results });
      },
      "GET"
    );
  };

  showHideFilters = () => {
    this.setState({ isFilters: !this.state.isFilters });
  };

  handleFilters = (data) => {
    let filter = this.state.filter;
    filter["customername"] = data["customername"] ? data["customername"] : "";
    filter["inquiryNumber"] = data["inquiryNumber"] ? data["inquiryNumber"] : "";
    filter["email"] = data["email"] ? data["email"] : "";
    filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
    filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "";
    filter["fromDate"] = data["fromDate"] ?
      moment(data["fromDate"]).format(Global.DateFormate) : null;
    filter["toDate"] = data["toDate"] ?
      moment(data["toDate"]).format(Global.DateFormate) : null;
    filter["phone"] = data["phone"] ? data["phone"] : "";
    //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"inquirytype";
    filter["title"] = data["title"] ? data["title"] : "";
    if (data["inquirysource"]) {
      filter["inquirysource"] = data["inquirysource"].toLowerCase() === "other" ? data["othersource"] : data["inquirysource"];
    } else {
      filter["inquirysource"] = "";
    }
    filter["triptype"] = data["triptype"] ? data["triptype"] : "";
    filter["inquirytype"] = data["inquirytype"] ? data["inquirytype"] : "";
    filter["bookingfor"] = data["bookingfor"] ? data["bookingfor"] : "";
    filter["specificmonth"] = data.specificmonth;
    filter["priority"] = data["priority"] ? data["priority"] : "";
    this.setState({ filter, results: [], defaultResults: [], currentPage: 0, isFilterApplied: data["isFilterApplied"] }, () => this.getInquiries(false, undefined, "filter"));

  };

  handlePaginationResults = (currentPage) => {
    this.setState({ isBtnLoading: true, currentPage }, () =>
      this.getInquiries(false, undefined, "pageing")
    );
  };

  EditInquiry = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "InquiryList~inquiries-edit-inquiries")) {
      this.props.history.push("/Inquiry/" + item.id);
    }
    else {
      (localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken"))
        ? this.setState({ isshowauthorizepopup: true })
        : this.setState({ isshowauthorizepopup: false })
    }
  };

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }

  getExportInquries = () => {
    this.getInquiries(true, this.exportInquries);
  }

  exportInquries = resultsExport => {
    let value = this.state.filterObject;
    if (value) {
      resultsExport = resultsExport.filter(
        (x) =>
          x.from
            ?.toLowerCase()
            .includes(
              value.find((y) => y.name?.toLowerCase())
                ? value.find((y) => y.name?.toLowerCase()).name?.toLowerCase()
                : ""
            ) &&
          x.title
            ?.toLowerCase()
            .includes(
              value.find((y) => y.title?.toLowerCase())
                ? value.find((y) => y.title?.toLowerCase()).title?.toLowerCase()
                : ""
            ) &&
          x.fromEmail
            ?.toLowerCase()
            .includes(
              value.find((y) => y.email?.toLowerCase())
                ? value.find((y) => y.email?.toLowerCase()).email?.toLowerCase()
                : ""
            ) &&
          x.data.phone
            ?.toLowerCase()
            .includes(
              value.find((y) => y.phone?.toLowerCase())
                ? value.find((y) => y.phone?.toLowerCase()).phone?.toLowerCase()
                : ""
            )
      );
    }
    let exportData = resultsExport.map(item => {
      return {
        "Inquiry Type": item.data.inquiryType.toLowerCase() === "air" ? "Flight" : item.data.inquiryType,
        "Customer Name": item.data.customerName,
        "Email": item.data.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? '' : item.data.email,
        "Contact Phone": item.data.phone,
        "Inquiry Number": item.inquiryNumber,
        "Priority": (item.priority === "" || item.priority === undefined) ? "--" : item.priority,
        "Inquiry Title": item.data.destinationlocation !== "" ? item.title + " - " + item.data.destinationlocation : item.title,
        "Trip Type": item.data.tripType, "Trip Type": item.data.tripType,
        "Status": item.status,
        "Inquiry Source": item.data.inquirySource,
        "Trip Type": item.data.tripType,
        "Status": item.status,
        "Inquiry Source": item.data.inquirySource,
        "Reference By": item.data.referredBy,
        "Social Media": item.data.inquirySource === "Social Media"
          ? (item.data.socialMediaSource === "" ? "Facebook" : item.data.socialMediaSource)
          : item.data.socialMediaSource,
        "Booking For Source": item.data.bookingFor,
        "Class": item.data.inquiryType.toLowerCase() === "air" ? item.data.classtype : '',
        "Class Type/Journey Type/Package Type/Rating": item.data.classtype !== "" ? item.data.classtype : item.data.journeytype,
        "Start Date/Departure Date/Pick Up Date/Travel Date/Check In": item.startDate ? DateComp({ date: item.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
        "End Date/Arrival Date/Drop Off Date/Check Out": item.endDate ? DateComp({ date: item.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
        "Duration": (
          item.data.inquiryType.toLowerCase() === "transfers"
          || item.data.inquiryType.toLowerCase() === "rail"
          || item.data.inquiryType.toLowerCase() === "forex"
          || item.data.inquiryType.toLowerCase() === "bus"
          || item.data.inquiryType.toLowerCase() === "rent a car") ? '' : item.data.duration,
        "Pick Up Time": item.data.pickuptime,
        "Followup Date": item.followUpDate ? DateComp({ date: item.followUpDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
        "Followup Time": item.data.followup_time,
        "Budget": Amount({ amount: item.data.budget ? item.data.budget : 0 }),
        "Adults": item.data.adults,
        "Children": item.data.children,
        "Infant": item.data.infant,
        "Other Requirements": item.data.requirements,
      }
    });
    if (exportData.length === 0) {
      exportData = [{
        "Inquiry Type": "No records found.",
        "Customer Name": "",
        "Email": "",
        "Contact Phone": "",
        "Inquiry Number": "",
        "Priority": "",
        "Inquiry Title": "",
        "Trip Type": "",
        "Status": "",
        "Inquiry Source": "",
        "Reference By": "",
        "Social Media": "",
        "Booking For Source": "",
        "Class": "",
        "Class Type/Journey Type/Package Type/Rating": "",
        "Start Date/Departure Date/Pick Up Date/Travel Date/Check In": "",
        "End Date/Arrival Date/Drop Off Date/Check Out": "",
        "Duration": "",
        "Pick Up Time": "",
        "Followup Date": "",
        "Followup Time": "",
        "Budget": "",
        "Adults": "",
        "Children": "",
        "Infant": "",
        "Other Requirements": "",
      }]
    }
    const workbook1 = XLSX.utils.json_to_sheet(exportData);
    workbook1['!cols'] = [
      { wpx: 100 }, { wpx: 100 }, { wpx: 200 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 250 },
      { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 250 },
      { wpx: 320 }, { wpx: 320 }, { wpx: 80 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
      { wpx: 100 }, { wpx: 50 }, { wpx: 50 }, { wpx: 50 }, { wpx: 150 }, { wpx: 300 },
    ];
    const workbook = {
      SheetNames: ['Inquries'],
      Sheets: {
        'Inquries': workbook1
      }
    };

    this.setState({
      isBtnLoadingExport: false,
    });

    return XLSX.writeFile(workbook, `Inquries.xlsx`);

  }

  ViewInquiry = (item) => {
    this.setState({
      isViewInquiry: !this.state.isViewInquiry,
      itemtoview: item
    });
  };


  BookPackageInquiry = (item) => {
    sessionStorage.removeItem("packageInquiryBook");
    sessionStorage.setItem("packageInquiryBook", JSON.stringify(item));
    let bookingForInfo = JSON.parse(sessionStorage.getItem("packageInquiryBook"));
    this.props.history.push("/ManualInvoice/PackageInvoice");
    // this.setState({
    //   isViewInquiry: !this.state.isViewInquiry,
    //   itemtoview: item
    // });
  };

  handleHidePopup = () => {
    this.setState({
      isViewInquiry: !this.state.isViewInquiry,
      itemtoview: ""
    });
  };

  componentDidMount() {
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-manage-inquiry")) {
      this.props.history.push('/');
    }
    this.getAuthToken();
  }

  removeFilter = (filterName) => {
    let filter = this.state.filter;
    filter[filterName] = "";
    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getInquiries(false, undefined, "filter"));
    this.handleFilters(filter);
    this.myRef.setDefaultFilter();
  }

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

    let IsFilterApplied = false;

    if (this.state.filter.customername !== ""
      || this.state.filter.inquiryNumber !== ""
      || this.state.filter.email !== ""
      || this.state.filter.phone !== ""
      || this.state.filter.title !== ""
      || this.state.filter.inquirysource !== ""
      || this.state.filter.triptype !== ""
      || this.state.filter.inquirytype !== ""
      || this.state.filter.bookingfor !== ""
      || this.state.filter.dateMode !== ""
      || this.state.filter.searchBy !== ""
      || this.state.filter.priority !== ""
    ) {
      IsFilterApplied = true;
    }


    return (
      <div className="quotation quotation-list">
        <Helmet>
          {localStorage.getItem('portalType') === 'B2C' ?
            <title>
              My Inquiries
            </title> :
            <title>
              Manage Inquiries
            </title>}
        </Helmet>
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <h1 className="text-white m-0 p-0 f30">
                  <SVGIcon
                    name="file-text"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGIcon>
                  Manage Inquiries
                </h1>
              </div>
              <div className="col-lg-4 pl-0 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-light mt-1 mr-1"
                  onClick={this.showHideFilters}
                >
                  Filters
                </button>
                {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") && (
                  <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  mr-1 mt-1"
                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~inquiries-create-inquiry") ? this.setState({ isSubscriptionPlanend: true }) : (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry") ? this.props.history.push(`/Inquiry`) : this.setState({ isshowauthorizepopup: true }))}
                    >
                      Create Inquiry
                    </button>
                  </AuthorizeComponent>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") && (
                  <AuthorizeComponent title="dashboard-menu~inquiries-import-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <button
                      className="btn btn-sm btn-primary  mr-1 mt-1"
                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~inquiries-import-inquiries") ? this.setState({ isSubscriptionPlanend: true }) : (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-import-inquiries") ? this.props.history.push(`/ImportInquiries`) : this.setState({ isshowauthorizepopup: true }))}
                    >
                      Import Inquiries
                    </button>
                  </AuthorizeComponent>
                )}
                {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") && (
                  <AuthorizeComponent title="InquiryList~inquiries-export-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                    {localStorage.getItem("userToken") &&
                      <React.Fragment>
                        {isBtnLoadingExport &&
                          <button
                            className="btn btn-sm btn-primary mt-1"
                          >
                            <span className="spinner-border spinner-border-sm mx-1"></span>
                            Export Inquiries
                          </button>
                        }
                        {!isBtnLoadingExport &&
                          <button
                            className="btn btn-sm btn-primary mt-1"
                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "InquiryList~inquiries-export-inquiries") ? this.getExportInquries() : this.setState({ isshowauthorizepopup: true })}
                          >
                            Export Inquiries
                          </button>
                        }
                      </React.Fragment>
                    }
                  </AuthorizeComponent>
                )}
              </div>
            </div>
          </div>
        </div>
        {isBtnLoading ?
          <Loader />
          :
          <div className="container">
            {results && isFilters &&
              <QuotationReportFilters
                onRef={ref => (this.myRef = ref)}
                handleFilters={this.handleFilters}
                showHideFilters={this.showHideFilters}
                filterData={this.state.filter}
                //groupByfilter={this.state.filter.groupBy}
                filterMode={this.props.match.params.filtermode}
                isBtnLoadingMode={this.state.isBtnLoadingMode}
              />
            }
            {IsFilterApplied &&
              <InquiryAppliedFilter
                filterData={this.state.filter}
                removeFilter={this.removeFilter}
              />
            }
            <div className="border mt-2">
              {results && (
                <div>
                  <div className="row quotation-list-grid-header">
                    <div className="col-lg-12">
                      <div className="bg-light border-bottom pt-2 pb-2 pl-3 pr-3">
                        <div className="row">
                          <div className="col-lg-5">
                            <b>Customer Details</b>
                          </div>
                          <div className="col-lg-4">
                            <b>Inquiry Details</b>
                          </div>

                          <div className="col-lg-2">
                            <b>Status</b>
                          </div>

                          <div className="col-lg-1">
                            <b>Actions</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {results.map((item, key) => {
                    let destinationlocation = (item.data.destinationlocation === "" || item.data.destinationlocation === undefined)
                      ? "" : " - " + item.data.destinationlocation;
                    return (
                      <div
                        key={key}
                        className="border-bottom pl-3 pr-3 pt-3 position-relative"
                      /* onClick={() => this.EditInquiry(item)}
                      style={{ cursor: "pointer" }} */
                      >
                        <div className="row quotation-list-item">
                          <div className="col-lg-5 d-flex align-items-center pb-3"
                            onClick={() => this.EditInquiry(item)}
                            style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
                            <div>
                              <span className="quotation-list-usericon">
                                {item.from}
                              </span>
                            </div>
                            <div>

                              <div className="row">
                                <div className="col-lg-12">
                                  <h5 className="m-0 p-0 mb-1">{item.from}
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
                                      </span>}</h5>
                                </div>

                              </div>
                              <small className="row d-block text-secondary mt-2">
                                <div class="col-lg-12">
                                  <span className="badge badge-info badge-info-custom mr-2">{item.inquiryNumber}</span>
                                  <span>{item.fromEmail.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? "" : item.fromEmail}</span>
                                  <span className="quotation-list-item-sprt">
                                    {item.fromEmail === "" || item.fromEmail.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? "" : " | "}
                                  </span>
                                  <span>{item.data.phone}</span>
                                </div>
                              </small>
                            </div>
                          </div>

                          <div className="col-lg-4 d-flex align-items-center pb-3"
                            onClick={() => this.EditInquiry(item)}
                            style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
                            <div>
                              <span className="text-secondary mr-3 d-block">
                                <b className="text-primary">{destinationlocation !== "" ? item.title + destinationlocation : item.title}</b>
                              </span>
                              <span className="text-secondary mr-3">
                                {item.data.startDate && (
                                  <small>
                                    <DateComp date={item.data.startDate}></DateComp>
                                  </small>
                                )}

                                {item.data.duration && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      |{" "}
                                    </span>
                                    {item.data.duration} day(s)
                                  </small>
                                )}

                                {item.data.typetheme && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      |{" "}
                                    </span>
                                    {item.data.typetheme}
                                  </small>
                                )}

                                {item.data.budget && (
                                  <small>
                                    <span className="quotation-list-item-sprt">
                                      {" "}
                                      |{" "}
                                    </span>
                                    <Amount amount={isNaN(item.data.budget) ? 0 : item.data.budget}></Amount>
                                  </small>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="col-lg-2"
                            onClick={() => this.EditInquiry(item)}
                            style={localStorage.getItem('portalType') === 'B2C' ? null : { cursor: "pointer" }}>
                            {(item.status === "active" || item.status.toLowerCase() === "new") && !item?.data?.itemId && (
                              <div>
                                <small>New</small>
                                <small className="text-secondary d-block mt-1">
                                  <DateComp date={item.createdDate}></DateComp>
                                </small>
                              </div>
                            )}

                            {(item.status === "active" || item.status.toLowerCase() === "new") && item?.data?.itemId && (
                              <div>
                                <small>{item.data.itemType === "Quotation"
                                  ? Trans("_quotationReplaceKey")
                                  : item.data.itemType} added</small>
                                <small className="text-secondary d-block mt-1">
                                  <DateComp date={item.updatedDate}></DateComp>
                                </small>
                              </div>
                            )}

                            {(item.status !== "active" && item.status.toLowerCase() !== "new") && <div>
                              <small>{item.status}</small>
                              <small className="text-secondary d-block mt-1">
                                <DateComp date={item.updatedDate}></DateComp>
                              </small>
                            </div>}
                          </div>

                          <div className="col-lg-1 d-flex align-items-center pb-3 justify-content-center p-0">
                            <React.Fragment>
                              {localStorage.getItem('portalType') === 'B2C' &&
                                <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center"
                                  onClick={() => this.ViewInquiry(item)}
                                >
                                  View Inquiry
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
                                        <li>
                                          <button
                                            className="btn btn-sm text-nowrap w-100 text-left"
                                            onClick={() => this.ViewInquiry(item)}
                                          >
                                            View Inquiry
                                          </button>
                                        </li>
                                        <AuthorizeComponent title="InquiryList~inquiries-edit-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                                          {item.isEditable &&
                                            <li>
                                              <button
                                                className="btn btn-sm text-nowrap w-100 text-left"
                                                onClick={() => this.EditInquiry(item)}
                                              >
                                                Edit Inquiry
                                              </button>
                                            </li>
                                          }
                                        </AuthorizeComponent>

                                        {!item.data.itemId && (
                                          <React.Fragment>
                                            {!item.data.marketPlacePackageID && <><AuthorizeComponent title="InquiryList~inquiries-add-itinerary" type="button" rolepermissions={userInfo.rolePermissions}>
                                              {item.isEditable &&
                                                <li>
                                                  <button
                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                    onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~itineraries-create-itineraries") ? this.setState({ isSubscriptionPlanend: true }) :
                                                      this.InquiryDetails(
                                                        item,
                                                        "Itinerary"
                                                      )
                                                    }
                                                  >
                                                    Add Itinerary
                                                  </button>
                                                </li>}
                                            </AuthorizeComponent>
                                              <AuthorizeComponent title="InquiryList~inquiries-add-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                                                {item.isEditable &&
                                                  <li>
                                                    <button
                                                      className="btn btn-sm text-nowrap w-100 text-left"
                                                      onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~master-quotation-create-quotation") ? this.setState({ isSubscriptionPlanend: true }) :
                                                        this.InquiryDetails(
                                                          item,
                                                          "Quotation"
                                                        )
                                                      }
                                                    >
                                                      Add {Trans("_quotationReplaceKey")}
                                                    </button>
                                                  </li>}
                                              </AuthorizeComponent></>}
                                            <AuthorizeComponent title="InquiryList~inquiries-add-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                                              {item.isEditable &&
                                                <li>
                                                  <button
                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                    onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~master-quotation-create-quotation") ? this.setState({ isSubscriptionPlanend: true }) :
                                                      this.InquiryDetails(
                                                        item,
                                                        "QuickQuotation"
                                                      )
                                                    }
                                                  >
                                                    Add Quick Proposal
                                                  </button>
                                                </li>}
                                            </AuthorizeComponent>
                                            <AuthorizeComponent title="InquiryList~inquiries-add-package" type="button" rolepermissions={userInfo.rolePermissions}>
                                              {item.isEditable && item.data.marketPlacePackageID &&
                                                <li>
                                                  <button
                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                    onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "InquiryList~inquiries-add-package") ? this.setState({ isSubscriptionPlanend: true }) :
                                                      this.InquiryDetails(item, "Package")
                                                    }
                                                  >
                                                    Add Package
                                                  </button>
                                                </li>}
                                            </AuthorizeComponent>
                                          </React.Fragment>
                                        )}

                                        {item.data.itemId && (
                                          <React.Fragment>
                                            {item.data.itemType === "Itinerary" && (
                                              <AuthorizeComponent title="InquiryList~inquiries-add-itinerary" type="button" rolepermissions={userInfo.rolePermissions}>
                                                {item.isEditable &&
                                                  <li>
                                                    <button
                                                      className="btn btn-sm text-nowrap w-100 text-left"
                                                      onClick={() =>
                                                        this.InquiryDetailsEdit(
                                                          item,
                                                          "Itinerary"
                                                        )
                                                      }
                                                    >
                                                      Edit Itinerary
                                                    </button>
                                                  </li>}
                                              </AuthorizeComponent>
                                            )}

                                            {item.data.itemType === "Quotation" && (
                                              <AuthorizeComponent title="InquiryList~inquiries-add-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                                                {item.isEditable &&
                                                  <li>
                                                    <button
                                                      className="btn btn-sm text-nowrap w-100 text-left"
                                                      onClick={() =>
                                                        this.InquiryDetailsEdit(
                                                          item,
                                                          "Quotation"
                                                        )
                                                      }
                                                    >
                                                      Edit {Trans("_quotationReplaceKey")}
                                                    </button>
                                                  </li>}
                                              </AuthorizeComponent>
                                            )}
                                            {item.data.itemType === "Package" && item.data.itemId && (
                                              <AuthorizeComponent title="InquiryList~inquiries-add-package" type="button" rolepermissions={userInfo.rolePermissions}>
                                                {item.isEditable &&
                                                  <li>
                                                    <button
                                                      className="btn btn-sm text-nowrap w-100 text-left"
                                                      onClick={() =>
                                                        this.InquiryDetailsEdit(
                                                          item,
                                                          "Package"
                                                        )
                                                      }
                                                    >
                                                      Edit Package
                                                    </button>
                                                  </li>}
                                              </AuthorizeComponent>
                                            )}
                                          </React.Fragment>
                                        )}
                                        <AuthorizeComponent title="InquiryList~inquiries-delete-inquiry" type="button" rolepermissions={userInfo.rolePermissions} >
                                          {item.isEditable &&
                                            <li>
                                              <button
                                                className="btn btn-sm text-nowrap w-100 text-left"
                                                onClick={() => this.deleteInquiry(item)}
                                              >
                                                Delete Inquiry
                                              </button>
                                            </li>
                                          }
                                        </AuthorizeComponent>
                                        {item.data.inquirySource === "Website" && (
                                          <li>
                                            <button
                                              className="btn btn-sm text-nowrap w-100 text-left"
                                              onClick={() => this.BookPackageInquiry(item)}
                                            >
                                              Create Invoice
                                            </button>
                                          </li>
                                        )}

                                        <li>
                                          <button
                                            className="btn btn-sm text-nowrap w-100 text-left"
                                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                              "InquiryList~inquiries-activity-log")
                                              ? this.getActivityLogDetails(item)
                                              : this.setState({ isshowauthorizepopup: true })
                                            }
                                          >
                                            Activity Log
                                          </button>
                                        </li>

                                      </ul >
                                    </div >
                                  </div >
                                </React.Fragment >
                              }
                            </React.Fragment>
                          </div >
                        </div >
                      </div >
                    );
                  })}
                  {
                    isViewInquiry && (
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
                    )
                  }

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
                <div className="p-4 text-center">No Inquiries Found.</div>
              )}
            </div>

            <nav>
              <ul className="pagination justify-content-center mt-3">
                <li
                  className={
                    this.state.totalRecords > 0 ? "page-item" : "page-item disabled d-none"
                  }
                  style={{
                    display: "flex",
                    "justifyContent": "space-between",
                    "flexGrow": "2",
                  }}
                >
                  {!isBtnLoading &&
                    <span className="text-primary">Showing{" "}{(this.state.currentPage + 1) * this.state.pageSize > this.state.totalRecords ? this.state.totalRecords : (this.state.currentPage + 1) * this.state.pageSize}{" "} out of {this.state.totalRecords}</span>}
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
          </div >
        }

        {
          this.state.isImport && (
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
          )
        }

        {
          this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
        {
          this.state.activityLogDetails ? (
            <ModelPopup
              header={"Activity Log"}
              content={<ActivityLogDetails activityLogDetails={this.state.activityLogDetails} userInfo={userInfo} />}
              handleHide={this.handleHideActivityLogPopup}
            />
          ) : null
        }
        {
          this.state.isSubscriptionPlanend &&
          <ModelLimitExceeded
            header={"Plan Limitations Exceeded"}
            content={"The maximum recommended plan has been exceeded"}
            handleHide={this.hidelimitpopup}
            history={this.props.history}
          />
        }
      </div >
    );
  }
}

export default InquiryList;
