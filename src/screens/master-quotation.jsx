import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import SVGIcon from "../helpers/svg-icon";
import QuotationCreate from "../components/quotation/quotation-create";
import Quotationinfo from "../components/quotation/quotation-info";
import QuotationResults from "../components/quotation/quotation-results";
import QuotationDetails from "../components/quotation/quotation-details";
import QuotationSearch from "../components/quotation/quotation-search";
import QuotationEmail from "../components/quotation/quotation-email";
import { Trans } from "../helpers/translate";
import ItineraryDetails from "../components/quotation/itinerary-details";
import ItineraryEmail from "../components/quotation/itinerary-email";
import ItineraryAddOffline from "../components/quotation/itinerary-add-offline";
import ComingSoon from "../helpers/coming-soon";
import { getItem } from "../components/quotation/quotation-get-cart-item";
import moment from "moment";
import QuotationResultsMeta from "../components/quotation/quotation-results-meta";
import QuotationResultsMetaAir from "../components/quotation/quotation-results-meta-air";
import QuotationResultsMetaActivity from "../components/quotation/quotation-results-meta-activity";
import QuotationResultsMetaAirRoundTrip from "../components/quotation/quotation-results-meta-air-roundtrip";
import * as Global from "../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import ItineraryQuotationTermsConditions from "../components/quotation/itinerary-quotation-termsconditions";
import SocialMediaWhatsappWhite from "../assets/images/tw/social-media-whatsapp-white.png";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAIAssitant from "./package-ai-assistant";
import { Helmet } from "react-helmet";
import Config from "../config.json";

class MasterQuotation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: "",
      isResults: false,
      resultKey: 1,
      items:
        localStorage.getItem("quotationItems") &&
          localStorage.getItem("quotationItems") !== "undefined"
          ? JSON.parse(localStorage.getItem("quotationItems")) && JSON.parse(localStorage.getItem("quotationItems"))
          : [],
      isEmail: false,
      saveTermsConditons: false,
      detailsKey: 1,
      isSaveSucessMsg: false,
      isBtnLoading: false,
      isBtnLoadingBookItinerary: false,
      isErrorMsg_BookItinerary: "",
      type: this.props.match.path.split("/").includes("Itinerary_Master")
        ? "Itinerary_Master"
        : "Quotation_Master",
      importItem: false,
      importItemKey: 1,
      isShowSearch: true,
      comingsoon: false,
      bookingItemCount: 0,
      isMetaResults: false,
      isErrorMsg: "",
      isshowauthorizepopup: false,
      issavedTermsConditions: false,
      customerPortalURL: '',
      isSubscriptionPlanend: false,
      screenWidth: window.innerWidth,
      isAssistant: "",
      ipCountryName: "",
    };
    this.handleResize = this.handleResize.bind(this);
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }

  generateQuotation = (data) => {
    this.setState({ isBtnLoading: true, isErrorMsg: "", isEmail: false });
    let inquiryDetails = JSON.parse(localStorage.getItem("quotationDetails"));
    let isfromInquiry = inquiryDetails?.from;

    if (isfromInquiry) {
      data.from = inquiryDetails.from;
      data.month = inquiryDetails.month;
      data.typetheme = inquiryDetails.typetheme;
      data.budget = inquiryDetails.budget;
      data.inclusions = inquiryDetails.inclusions;
      data.adult = inquiryDetails.adult;
      data.children = inquiryDetails.children;
      data.infant = inquiryDetails.infant;
      data.priority = inquiryDetails?.priority;
      data.tripType = inquiryDetails?.tripType;
      data.followupDate = inquiryDetails?.followupDate;
    }

    localStorage.setItem("quotationDetails", JSON.stringify(data));
    this.props.match.params.mode === "Create" && this.createCart();
    this.props.match.params.mode === "Edit" && this.saveQuotation();
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
        UseAgentDetailInEmail:
          Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") ===
            "true"
            ? true
            : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (reqData?.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
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

  childRef = React.createRef();
  detailsRef = React.createRef();

  createCart = () => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    // let element = this.state.type === "Itinerary_Master" ? "dashboard-menu~master-itineraries-create-itineraries" : "dashboard-menu~master-quotation-create-quotation";
    // let quota = Global.LimitationQuota[element];

    quotationInfo.customerName = "Demo Customer"
    quotationInfo.email = "democustomer@tourwiz.com";
    quotationInfo.phone = "+91-1234567890";
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    let reqURL = "quotation";
    let reqOBJ = {
      name: quotationInfo.title,
      imageURL: quotationInfo.imageURL,
      owner: quotationInfo.customerName,
      isPublic: true,
      type: this.state.type,
      userID: quotationInfo.userID,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        notes: quotationInfo.terms ? quotationInfo.terms : "",
        termsconditions: quotationInfo.termsconditions ? quotationInfo.termsconditions : "",
        offlineItems: localStorage.getItem("quotationItems"),
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo.status === "" ? "New" : quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        configurations: {
          isShowTotalPrice: quotationInfo.configurations?.isShowTotalPrice,
          isShowItemizedPrice: quotationInfo.configurations?.isShowItemizedPrice,
          isShowFlightPrices: quotationInfo.configurations?.isShowFlightPrices,
          isShowImage: quotationInfo.configurations?.isShowImage,
          isHidePrice: quotationInfo.configurations?.isHidePrice,
          ShowhideElementname: quotationInfo.configurations?.ShowhideElementname,
          isPackagePricing: quotationInfo.configurations?.isPackagePricing,
          isHideFareBreakupInvoice: quotationInfo.configurations?.isHideFareBreakupInvoice
        },
        budget: quotationInfo?.budget,
        priority: quotationInfo?.priority,
        tripType: quotationInfo?.tripType,
        followupDate: quotationInfo?.followupDate,
      },
      adult: quotationInfo?.adults,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      followupDate: quotationInfo?.followupDate,
      createCustomer_validateEmailAndPhone: true,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: false
    };
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        // if (data.code && data.code === 101) {
        //   this.setState({ isSubscriptionPlanend: true, isBtnLoading: false });
        // }
        // else {
        //   this.setState({ isErrorMsg: data.error, isBtnLoading: false });
        // }
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      }
      else {
        // if (quotaUsage["totalUsed" + quota] === null)
        //   quotaUsage["totalUsed" + quota] = 1;
        // else
        //   quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
        // localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
        localStorage.setItem("cartLocalId", data.id);
        let items = [];
        if (localStorage.getItem("quotationItems")) {
          items = JSON.parse(localStorage.getItem("quotationItems"));
        }
        this.setState({
          savedCartId: localStorage.getItem("cartLocalId"),
          isBtnLoading: false,
          items
        });
        let localQuotationInfo = JSON.parse(
          localStorage.getItem("quotationDetails")
        );
        localQuotationInfo.status = localQuotationInfo?.status === "" ? "New" : localQuotationInfo?.status;
        localStorage.setItem(
          "quotationDetails",
          JSON.stringify(localQuotationInfo)
        );

        this.props.history.push(
          "/" + this.state.type + (localQuotationInfo?.from ? "/DetailsInquiry" : "/Details")
        );

      }
    });
  };

  handleEdit = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "dashboard-menu~master-quotation-create-quotation" : "dashboard-menu~master-itineraries-create-itineraries"))) {
      this.props.history.push("/" + this.state.type + "/Edit");
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  handleResults = (businessName, searchRequest) => {
    let isMetaResults = false;
    if (businessName === "air") {
      if (
        (searchRequest !== undefined &&
          searchRequest.fromLocation.countryID.toLowerCase() ===
          Global.getEnvironmetKeyValue("PortalCountryCode").toLowerCase()) ||
        searchRequest.toLocation.countryID.toLowerCase() ===
        Global.getEnvironmetKeyValue("PortalCountryCode").toLowerCase()
      ) {
        isMetaResults = true;
      }
      this.setState({
        isSearch: false,
        isResults: true,
        isMetaResults: isMetaResults,
        businessName: businessName,
      });
    } else {
      if (businessName === "hotel" || businessName === "air" || businessName === "activity") {
        isMetaResults = true
      }
      this.setState({
        isSearch: false,
        isResults: true,
        isMetaResults: isMetaResults,
        businessName: businessName,
      });
    }
  };

  handleSearchRequest = (searchParam) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "dashboard-menu~master-quotation-create-quotation" : "dashboard-menu~master-itineraries-create-itineraries"))) {
      this.setState({
        searchRequest: searchParam,
        resultKey: this.state.resultKey + 1,
        isResults: true,
        isMetaResults: true,
      });
      this.handleResults(searchParam.businessName, searchParam);
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  deleteResults = () => {
    this.setState({ isResults: false, isMetaResults: false });
  };

  bookQuotation = () => {
    this.handleComingSoon();
  };
  sendEmail = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "QuotationDetails~master-quotation-send-quotation" : "IitineraryDetails~master-itineraries-send-itineraries"))) {
      this.setState({
        isEmail: !this.state.isEmail,
      });
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  saveTermsConditions = () => {
    this.setState({
      saveTermsConditons: !this.state.saveTermsConditons,
      issavedTermsConditions: !this.state.saveTermsConditons ? false : true,
    });
  }

  addItem = (item) => {
    const quotationItems =
      localStorage.getItem("quotationItems") &&
      localStorage.getItem("quotationItems") !== "undefined" &&
      JSON.parse(localStorage.getItem("quotationItems"));
    let items = quotationItems ? quotationItems : [];
    items = items.filter(
      (x) =>
        (x.offlineItem && x.offlineItem.uuid) !==
        (item.offlineItem && item.offlineItem.uuid)
    );
    item.offlineItem && items.push(item);

    this.setState({
      items,
      detailsKey: this.state.detailsKey + 1,
      isShowSearch: false,
    });

    localStorage.setItem("quotationItems", JSON.stringify(items));

    (item.itemDtl ||
      item.itemDtlMeta ||
      item.business === "air" ||
      item.itemDtlEdit) &&
      this.handleImportItem(item);
    this.saveQuotation(true);
  };

  handleItemDelete = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "QuotationDetails~master-quotation-delete-item" : "ItineraryDetails~master-itineraries-delete-item"))) {
      const quotationItems = JSON.parse(localStorage.getItem("quotationItems"));
      let items = quotationItems ? quotationItems : [];

      items = items.filter(
        (x) =>
          (x.offlineItem && x.offlineItem.uuid) !==
          (item.offlineItem && item.offlineItem.uuid)
      );

      this.setState({ items, detailsKey: this.state.detailsKey + 1 });
      localStorage.setItem("quotationItems", JSON.stringify(items));
      this.saveQuotation();
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  changeQuotationTab = (businessName) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "dashboard-menu~master-quotation-create-quotation" : "dashboard-menu~master-itineraries-create-itineraries"))) {
      this.setState({
        businessName,
        importItem: false,
        isShowSearch: true,
        isResults: false,
        isMetaResults: false,
      });
    }
    else {
      this.setState({ isshowauthorizepopup: true });
    }
  };

  resetQuotation = () => {
    localStorage.removeItem("quotationDetails");
    localStorage.removeItem("quotationItems");
    localStorage.removeItem("cartLocalId");
    this.setState({ items: [] });
  };

  handleOffline = (item) => {
    this.addItem({ offlineItem: item });
  };

  saveQuotation = (isSkipPhoneValidation) => {
    // Save Quotation Changes
    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    this.setState({ isBtnLoading: true });
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let quotationItems = JSON.parse(localStorage.getItem("quotationItems"))
    if (this.state.type === "Itinerary_Master" && quotationItems
      && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
      quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem = { ...quotationInfo.packagePricingData };
      localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    }
    quotationInfo.customerName = "Demo Customer";
    quotationInfo.email = "democustomer@tourwiz.com";
    quotationInfo.phone = "+91-1234567890";

    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    let bookBefore = null;
    if (localStorage.getItem("quotationItems") != null &&
      JSON.parse(localStorage.getItem("quotationItems"))
        .map((x) => {
          return x.offlineItem.bookBefore
            ? new Date(x.offlineItem.bookBefore)
            : "";
        })
        .filter(Boolean).length > 0
    )
      bookBefore = new Date(
        Math.min.apply(
          null,
          JSON.parse(localStorage.getItem("quotationItems"))
            .map((x) => {
              return x.offlineItem.bookBefore
                ? new Date(x.offlineItem.bookBefore)
                : "";
            })
            .filter(Boolean)
        )
      );
    var reqURL = "quotation/update";
    var reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      name: quotationInfo.title,
      imageURL: quotationInfo.imageURL,
      owner: quotationInfo.customerName,
      isPublic: true,
      userID: quotationInfo.userID,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        notes: quotationInfo.terms ? quotationInfo.terms : "",
        termsconditions: quotationInfo.termsconditions ? quotationInfo.termsconditions : "",
        offlineItems: localStorage.getItem("quotationItems"),
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo.status === "" ? "New" : quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        inquiryId: quotationInfo.inquiryId,
        configurations: {
          isShowTotalPrice: quotationInfo.configurations?.isShowTotalPrice,
          isShowItemizedPrice: quotationInfo.configurations?.isShowItemizedPrice,
          isShowFlightPrices: quotationInfo.configurations?.isShowFlightPrices,
          isShowImage: quotationInfo.configurations?.isShowImage,
          isHidePrice: quotationInfo.configurations?.isHidePrice,
          ShowhideElementname: quotationInfo.configurations?.ShowhideElementname,
          isPackagePricing: quotationInfo.configurations?.isPackagePricing,
          isHideFareBreakupInvoice: quotationInfo.configurations?.isHideFareBreakupInvoice
        },
        budget: quotationInfo?.budget,
        priority: quotationInfo?.priority,
        tripType: quotationInfo?.tripType,
        followupDate: quotationInfo?.followupDate,
      },
      adult: quotationInfo?.adults,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      followupDate: quotationInfo?.followupDate,
      bookBefore: bookBefore,
      createCustomer_validateEmailAndPhone: true,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: isSkipPhoneValidation
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error)
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      else {
        let items = [];
        if (localStorage.getItem("quotationItems")) {
          items = JSON.parse(localStorage.getItem("quotationItems"));
        }
        this.setState({
          savedCartId: localStorage.getItem("cartLocalId"),
          isSaveSucessMsg: true,
          isBtnLoading: false,
          issavedTermsConditions: true,
          items
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
          if (this.state.saveTermsConditons)
            this.saveTermsConditions();
        }, 2500);
        this.props.history.push(
          "/" + this.state.type + (localQuotationInfo?.from ? "/DetailsInquiry" : "/Details")
        );
        // this.props.match.params.mode === "DetailsInquiry" &&
        //   this.saveInquiry(quotationInfo);
      }
    });
  };

  saveInquiry = (quotationInfo) => {
    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: quotationInfo.title,
      from: "Demo Customer",
      fromEmail: "democustomer@tourwiz.com",
      type: this.state.type,
      id: localStorage.getItem("inquiryId"),
      data: {
        name: quotationInfo.title,
        customerName: "Demo Customer",

        email: bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.email
          : "",
        phone: bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.phoneNumber
          : "",
        terms: quotationInfo.terms,
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDat).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: quotationInfo.createdDate,
        status: quotationInfo.status === "" ? "New" : quotationInfo.status,
        title: quotationInfo.title,
        destination: quotationInfo.destination,
        month: quotationInfo.month,
        typetheme: quotationInfo.typetheme,
        budget: quotationInfo.budget,
        inclusions: quotationInfo.inclusions,
        adult: quotationInfo.adult,
        children: quotationInfo.children,
        infant: quotationInfo.infant,
        requirements: quotationInfo.requirements,
        from: quotationInfo.from,
        offlineItems: localStorage.getItem("quotationItems"),
        agentName: localStorage.getItem("agentName") || "",
        cartLocalId: localStorage.getItem("cartLocalId"),
        inquirySource: quotationInfo.inquirySource,
        referenceby:
          quotationInfo.inquirySource === "Referred By" ||
            quotationInfo.inquirySource === "Social Media"
            ? quotationInfo.referenceby
            : "",
      },
      status: "active",
      startDate: "2021-01-22",
      endDate: "2021-01-26",
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => { });
  };

  handleImportItem = (item) => {
    this.setState({
      importItem: item,
      importItemKey: this.state.importItemKey + 1,
    });
  };

  handleQuotationImportItem = (item) => {
    let cartItem = getItem(item);
    cartItem.uuid = this.generateUUID();
    this.addItem({ offlineItem: cartItem });
  };

  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  /* getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
    });
  }; */

  viewDetailsMode = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "QuotationDetails~master-quotation-preview-quotation" : "ItineraryDetails~master-itineraries-preview-itineraries"))) {
      let cartLocalId = localStorage.getItem("cartLocalId");
      if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
        let portalURL = window.location.origin.toLowerCase() + '/' + window.location.pathname.split('/')[1];
        window.open(`${portalURL}/EmailView/${cartLocalId}`, "_blank");
      }
      else {
        window.open(`/EmailView/${cartLocalId}`, "_blank");
      }
      //this.props.history.push(`/EmailView/${cartLocalId}`);
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  setpersonate = (callback, email) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    const quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));
    let reqOBJ = {
      Request: email ? email : quotationDetails.email ? quotationDetails.email : quotationDetails.phone,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 4) {
          this.setState({ isBtnLoadingBookItinerary: false, isErrorMsg_BookItinerary: "Oops ! Something went wrong" });
        }
        else {
          sessionStorage.setItem("personateId", data.response);
          sessionStorage.setItem("callCenterType", data.userDetail.type);
          sessionStorage.setItem("bookingForInfo", JSON.stringify(data.userDetail.details));
          sessionStorage.setItem("bookingFor", data.userDetail.details.firstName);
          if (callback)
            callback();
        }
      }.bind(this)
    );
  };

  bookQuotationManually = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "QuotationDetails~quotation-book-quotation" : "ItineraryDetails~itineraries-book-itineraries"))) {
      this.setState({ isBtnLoadingBookItinerary: true, isErrorMsg_BookItinerary: "" });

      /*this.bookQuotationManuallyCreate();*/
      if (
        localStorage.getItem("inquiryId") !== null ||
        localStorage.getItem("quotationDetails") !== null ||
        localStorage.getItem("quotationItems") !== null ||
        localStorage.getItem("inquiryId") !== null
      ) {
        this.setpersonate(this.bookQuotationManuallyCreate);
      } else {
        this.bookQuotationManuallyCreate();
      }
    }
    else
      this.setState({ isshowauthorizepopup: true });
  };

  bookQuotationManuallyCreate = () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };

    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.response);
      this.bookQuotationManuallyAdd(data.response);
    });
  };

  bookQuotationManuallyAdd = (manualCartId) => {
    let bookingTtems = [];
    let AllItems = JSON.parse(localStorage.getItem("quotationItems"))
      ? JSON.parse(localStorage.getItem("quotationItems"))
      : [];

    AllItems.map(
      (x) =>
        (x.offlineItem.business === "hotel" ||
          x.offlineItem.business === "air" ||
          x.offlineItem.business === "activity" ||
          x.offlineItem.business === "transfers" ||
          x.offlineItem.business === "custom") &&
        bookingTtems.push(x.offlineItem)
    );

    if (this.state.bookingItemCount < bookingTtems.length) {
      this.bookQuotationItemsManually(manualCartId, bookingTtems);
    } else {
      this.props.history.push(`/QuickBookCart`);
    }
  };

  bookQuotationItemsManually = (manualCartId, bookingTtems) => {
    let item = bookingTtems[this.state.bookingItemCount];

    let reqURL = "api/v1/cart/add";

    let reqOBJ = {
      Request: {
        CartID: manualCartId,
        Data: this.getRequestInfo(item, item.business),
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      this.setState(
        {
          bookingItemCount: this.state.bookingItemCount + 1,
        },
        () => this.bookQuotationManuallyAdd(manualCartId)
      );
    });
  };

  getbrnconfig = (item) => {
    console.log("impdata", item);
    const env = JSON.parse(localStorage.getItem("environment"));
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let business = item.business.toLowerCase();
    if (business === "transfers" || business === "custom") business = "activity";

    let objconfig = [];
    objconfig = [
      {
        key: "isHideFareBreakupInvoice",
        value: quotationInfo.configurations?.isHideFareBreakupInvoice
      },
      {
        key: "SellPrice",
        value: Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : "1"),
      },
      {
        key: "CostPrice",
        value:
          this.getCostPrice(item)
      },
      {
        key: "isOfflineItinerary",
        value: true,
      },
      {
        key: "pickupTime",
        value: item.pickupTime,
      },
      {
        key: "supplierCurrency",
        value:
          item.supplierCurrency && item.supplierCurrency !== ""
            ? item.supplierCurrency.split(" ")[0]
            : Global.getEnvironmetKeyValue("portalCurrencySymbol"),
      },
      {
        key: "conversionRate",
        value:
          item.conversionRate && item.conversionRate !== ""
            ? item.conversionRate
            : "1",
      },
      {
        key: "supplierCostPrice",
        value: this.getAmountValue(item.supplierCostPrice, this.getCostPrice(item))
      },
      {
        key: "supplierTaxPrice",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice
            : "0",
      },
      {
        key: "supplierCostPricePortalCurrency",
        value:
          item.supplierCostPrice && item.supplierCostPrice !== ""
            ? parseFloat(item.supplierCostPrice.toString().replace(/,/g, "")) *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : "1"
            )
            : "0",
      },
      {
        key: "supplierTaxPricePortalCurrency",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : "1"
            )
            : "0",
      },
      {
        key: "markupPrice",
        value:
          item.markupPrice && item.markupPrice !== "" ? item.markupPrice : "0",
      },
      {
        key: "discountPrice",
        value:
          item.discountPrice && item.discountPrice !== ""
            ? item.discountPrice
            : "0",
      },
      {
        key: "CGSTPrice",
        value: item.CGSTPrice && item.CGSTPrice !== "" ? item.CGSTPrice : "0",
      },
      {
        key: "SGSTPrice",
        value: item.SGSTPrice && item.SGSTPrice !== "" ? item.SGSTPrice : "0",
      },
      {
        key: "IGSTPrice",
        value: item.IGSTPrice && item.IGSTPrice !== "" ? item.IGSTPrice : "0",
      },
      {
        key: "GSTPercentage",
        value: Number(item.percentage ?? 0),
      },
      {
        key: "processingFees",
        value: Number(item.processingFees ?? 0),
      },
      {
        key: "tax1Price",
        value: item.tax1 && item.tax1 !== "" ? item.tax1 : "0",
      },
      {
        key: "tax2Price",
        value: item.tax2 && item.tax2 !== "" ? item.tax2 : "0",
      },
      {
        key: "tax3Price",
        value: item.tax3 && item.tax3 !== "" ? item.tax3 : "0",
      },
      {
        key: "tax4Price",
        value: item.tax4 && item.tax4 !== "" ? item.tax4 : "0",
      },
      {
        key: "tax5Price",
        value: item.tax5 && item.tax5 !== "" ? item.tax5 : "0",
      },
      {
        key: "tax1Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 160)?.name ?? ""
          : ""
      },
      {
        key: "tax2Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 161)?.name ?? ""
          : ""
      },
      {
        key: "tax3Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 162)?.name ?? ""
          : ""
      },
      {
        key: "tax4Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 163)?.name ?? ""
          : ""
      },
      {
        key: "tax5Name",
        value: (env.customTaxConfigurations && env.customTaxConfigurations
          .find(x => x.business.toLowerCase() === business)) ? env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)
            ?.taxes.find(tax => Number(tax.purpose) === 164)?.name ?? ""
          : ""
      },
      {
        key: "gstTaxType",
        value: item.taxType && item.taxType !== "" ? item.taxType : "",
      },
      {
        key: "totalAmount",
        value: Number(item.totalAmount ?? 0),
      },
      {
        key: "isInclusiveGST",
        value: (item.isInclusive === "" || !item.isInclusive) ? false : item.isInclusive,
      },
      {
        key: "amountWithoutGST",
        value: (item.amountWithoutGST === "" || !item.amountWithoutGST) ? "0" : item.amountWithoutGST,
      },
      {
        key: "gstTaxAppliedOn",
        value: (Number(item.processingFees) > 0 ? "processing-fees" : "sell-price"),
      }
    ];

    if (item.brn && item.brn !== "") {
      objconfig.push({
        key: "BRN",
        value: item.brn.trim(),
      });
    }
    if (item.mealType && item.mealType !== "") {
      objconfig.push({
        key: "MealType",
        value: item.mealType && item.mealType !== "" ? item.mealType : "",
      });
    }
    if (item.hotelContactNumber && item.hotelContactNumber !== "" && !item.hotelContactNumber.endsWith('-')) {
      objconfig.push({
        key: "hotelContactNumber",
        value: item.hotelContactNumber
      });
    }

    return objconfig;
  };

  getCostPrice = (item) => {
    return item.costPrice && item.costPrice !== ""
      ? item.costPrice.toString().replace(/,/g, "")
      : "1"
  }
  getAmountValue = (amount, amountToRepace) => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      amount = amount.toString().replace(/,/g, "");
    }
    else if (amount && !isNaN(Number(amount)) && Number(amount) === 0) {
      amount = amountToRepace ? amountToRepace : 0
    }
    else
      amount = amountToRepace ? amountToRepace.toString().replace(/,/g, "") : 0
    return amount;
  }
  getRequestInfo = (item, business) => {
    if (business === "hotel") {
      if (!item.hotelPaxInfo) {
        item.hotelPaxInfo = [
          ...Array(parseInt(item.noRooms === "" ? 1 : item.noRooms)).keys(),
        ].map((data) => {
          return {
            roomID: 1,
            noOfAdults: 2,
            noOfChild: 0,
            roomType: item.itemType,
            childAge: [],
          };
        });
      }
      return [
        {
          ManualItem: {
            business: item.business,
            Name: item.name && item.name !== "" ? item.name : "Unnamed Hotel",
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID:
                  item.details?.locationInfo?.fromLocation.countryID ||
                  "Unnamed",
                City:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                Name:
                  item.toLocationCity !== "" ? item.toLocationCity : "Unnamed",
                CountryID:
                  item.details?.locationInfo?.fromLocation.countryID ||
                  "Unnamed",
                Type: "Location",
                Priority: 1,
              },
            },
            objectIdentifier: item.business,
            Rating: item.rating,
            RatingType: "Star",
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.endDate).format("YYYY-MM-DD"),
            },
            paxInfo: this.getHotelPaxObj(item),
            images: item.ImageUrl
              ? [
                {
                  URL: item.ImageUrl,
                  Type: "default",
                  Title: "Hotel",
                  IsDefault: true,
                },
              ]
              : [],
            config: this.getbrnconfig(item),
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            items: this.getHotelItemObj(item),
          },
        },
      ];
    } else if (business === "air") {
      if (!item.isRoundTrip) {
        return [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "oneway",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration !== ""
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocationName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocationCity || "Unnamed",
                  City: item.fromLocationCity || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocationName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocationCity || "Unnamed",
                  City: item.toLocationCity || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate:
                  moment(item.departStartDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departStartTime !== ""
                    ? item.departStartTime + ":00"
                    : "00:00:00"),
                endDate:
                  moment(item.departEndDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departEndTime !== ""
                    ? item.departEndTime + ":00"
                    : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult !== "" ? parseInt(item.adult) : 1,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: item.child !== "" ? parseInt(item.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: item.infant !== "" ? parseInt(item.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.vendor,
                  },
                },
              ],
              StopDetails: [item.departStops !== "" ? item.departStops : 0],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.departStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departStartTime !== ""
                        ? item.departStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.departEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departEndTime !== ""
                        ? item.departEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "durationHours",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totaldepartDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                      ],
                      images: item.departImg
                        ? [
                          {
                            URL: item.departImg,
                            Type: "default",
                            IsDefault: true,
                          },
                        ]
                        : [],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      } else {
        return [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "roundtrip",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration !== ""
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocationName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocationCity || "Unnamed",
                  City: item.fromLocationCity || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocationName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocationCity || "Unnamed",
                  City: item.toLocationCity || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate:
                  moment(item.departStartDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departStartTime !== ""
                    ? item.departStartTime + ":00"
                    : "00:00:00"),
                endDate:
                  moment(item.departEndDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departEndTime !== ""
                    ? item.departEndTime + ":00"
                    : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult !== "" ? parseInt(item.adult) : 1,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: item.child !== "" ? parseInt(item.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: item.infant !== "" ? parseInt(item.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.vendor,
                  },
                },
              ],
              StopDetails: [
                item.departStops !== "" ? item.departStops : 0,
                item.returnStops !== "" ? item.returnStops : 0,
              ],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration !== ""
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.departStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departStartTime !== ""
                        ? item.departStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.departEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departEndTime !== ""
                        ? item.departEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.departClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration !== ""
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totaldepartDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                      ],
                      images: [
                        {
                          URL: item.departImg,
                          Type: "default",
                          IsDefault: true,
                        },
                      ],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration !== ""
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
                {
                  totalDuration:
                    item.returnDuration !== ""
                      ? parseInt(
                        item.returnDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.returnStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.returnStartTime !== ""
                        ? item.returnStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.returnEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.returnEndTime !== ""
                        ? item.returnEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.returnClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.returnDuration !== ""
                          ? parseInt(
                            item.returnDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.returnDuration !== ""
                          ? parseInt(
                            item.returnDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totalreturnDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.returnAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.returnAirlineName,
                          },
                        },
                      ],
                      images: item.returnImg
                        ? [
                          {
                            URL: item.returnImg,
                            Type: "default",
                            IsDefault: true,
                          },
                        ]
                        : [],
                      Code: item.returnFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.returnClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.returnDuration !== ""
                              ? parseInt(
                                item.returnDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.returnDuration !== ""
                              ? parseInt(
                                item.returnDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      }
    } else if (business === "activity") {
      return [
        {
          ManualItem: {
            business: item.business,
            objectIdentifier: "activity",
            Name: item.name && item.name !== "" ? item.name : "Unnamed",
            Description: item.description,
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.startDate).format("YYYY-MM-DD"),
            },
            images: item.ImageUrl
              ? [
                {
                  URL: item.ImageUrl,
                  Type: "default",
                  IsDefault: true,
                },
              ]
              : [],
            TPExtension: [
              {
                Key: "duration",
                Value: item.duration,
              },
            ],
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests && item.guests !== "" ? item.guests : "1",
                type: 0,
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                City:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                Name:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                CountryID: "AE",
                Type: "Location",
                Priority: 1,
              },
            },
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    name: item.itemType ? (Array.isArray(item.itemType) ? item.itemType[0] : item.itemType) : "Unnamed",
                    business: "activity",
                    objectIdentifier: "activityOption",
                  },
                ],
              },
            ],
          },
        },
      ];
    } else if (business === "transfers") {
      return [
        {
          ManualItem: {
            tripType: !item.isRoundTrip ? "oneway" : "roundtrip",
            business: "transfers",
            objectIdentifier: "transfers",
            Description: item.description,
            Amount: Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : "1"),
            dateInfo: {
              startDate:
                moment(item.startDate).format("YYYY-MM-DD") + "T00:00:00",
              endDate:
                moment(item.startDate).format("YYYY-MM-DD") + "T00:00:00",
              startTime:
                item.pickupTime && item.pickupTime !== ""
                  ? item.pickupTime.split(":")[0]
                  : "00",
              endTime:
                item.pickupTime && item.pickupTime !== ""
                  ? item.pickupTime.split(":")[1].split(" ")[0]
                  : "00",
              type: null,
            },
            images: item.ImageUrl
              ? [
                {
                  URL: item.ImageUrl,
                  Type: "default",
                  IsDefault: true,
                },
              ]
              : [],
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests !== "" ? item.guests : "1",
                type: 0,
              },
            ],
            tpExtension: [
              {
                Key: "adultCount",
                Value: item.guests !== "" ? item.guests : "1",
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID: item.fromLocation || "Unnamed",
                Name: item.fromLocation || "Unnamed",
                CountryID: item.fromLocation || "Unnamed",
                Type:
                  item.pickupType && item.pickupType !== ""
                    ? item.pickupType
                    : "Airport",
              },
              ToLocation: {
                ID: (item.toLocation && item.toLocation) || "Unnamed",
                Name: (item.toLocation && item.toLocation) || "Unnamed",
                CountryID: (item.toLocation && item.toLocation) || "Unnamed",
                Type:
                  item.dropoffType && item.dropoffType !== ""
                    ? item.dropoffType
                    : "Airport",
              },
            },
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    business: "transfers",
                    objectIdentifier: "transfersoption",
                    tpExtension: [
                      {
                        Key: "adultCount",
                        Value: item.guests !== "" ? item.guests : "2",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ];
    } else if (business === "custom") {
      return [
        {
          ManualItem: {
            business: "activity",
            objectIdentifier: "activity",
            flags: {
              isCustomBusiness: true,
            },
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests !== "" ? item.guests : "2",
                type: 0,
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                City:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                Name:
                  item.toLocation && item.toLocation !== ""
                    ? item.toLocation
                    : "Unnamed",
                CountryID: "AE",
                Type: "Location",
                Priority: 1,
              },
            },
            Name: item.name && item.name !== "" ? item.name : "Unnamed",
            Description: item.description,
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment((item.day === "All Days" || item.startDate !== item.endDate) ? item.endDate : item.startDate).format("YYYY-MM-DD"),
            },
            images: item.ImageUrl
              ? [
                {
                  URL: item.ImageUrl,
                  Type: "default",
                  IsDefault: true,
                },
              ]
              : [],

            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    name: (item.itemType && item.itemType) || "Unnamed",
                    business: "activity",
                    objectIdentifier: "activityOption",
                  },
                ],
              },
            ],
          },
        },
      ];
    }
  };

  getHotelItemObj = (hotelItem) => {
    if (hotelItem.hotelPaxInfo.length > 0) {
      return [
        {
          item: [...Array(hotelItem.hotelPaxInfo.length).keys()].map(
            (data, index) => {
              let itemType = hotelItem.hotelPaxInfo[index].roomType;
              return {
                name:
                  (itemType && Array.isArray(itemType)
                    ? itemType[0]
                    : itemType) || "Unnamed Room",
                id:
                  (itemType && Array.isArray(itemType)
                    ? itemType[0]
                    : itemType) || "Unnamed Room",
                business: "hotel",
                objectIdentifier: "room",
                paxInfo: this.getRoomWiseHotelPaxObj(hotelItem, index),
                config: this.getRoomConfig(hotelItem.hotelPaxInfo[index]),
              };
            }
          ),
        },
      ];
    } else {
      return [
        {
          item: [
            ...Array(
              parseInt(hotelItem.noRooms === "" ? 1 : hotelItem.noRooms)
            ).keys(),
          ].map((data) => {
            return {
              name:
                (hotelItem.itemType && hotelItem.itemType) || "Unnamed Room",
              id: (hotelItem.itemType && hotelItem.itemType) || "Unnamed Room",
              business: hotelItem.business,
              objectIdentifier: "room",
            };
          }),
        },
      ];
    }
  };
  getRoomConfig = (roomObj, index) => {
    let objconfig = [];
    if (roomObj.noOfChild > 0) {
      return [
        {
          key: "ChildAges",
          value: Array(roomObj.noOfChild).fill(5).toString(),
        },
      ];
    } else {
      return [];
    }
  };

  getRoomWiseHotelPaxObj = (hotelItem, index) => {
    let adt = {
      typeString: "ADT",
      quantity: hotelItem.hotelPaxInfo[index].noOfAdults,
      type: 0,
    };

    let chd = [
      ...Array(hotelItem.hotelPaxInfo[index].noOfChild).keys(),
    ].flatMap((item, chdindex) => {
      return {
        typeString: "CHD",
        quantity: 1,
        type: 1,
        age: 5, //hotelItem.hotelPaxInfo[index].childAge[chdindex]
      };
    });
    if (hotelItem.hotelPaxInfo[index].noOfChild > 0) {
      return [adt, chd].flatMap((x) => x);
    } else return [adt];
  };
  getHotelPaxObj = (hotelItem) => {
    if (hotelItem.hotelPaxInfo.length > 0) {
      let tmpArr = [...Array(hotelItem.hotelPaxInfo.length).keys()].map(
        (item, index) => {
          let adt = {
            typeString: "ADT",
            quantity: hotelItem.hotelPaxInfo[index].noOfAdults,
            type: 0,
          };

          let chd = [
            ...Array(hotelItem.hotelPaxInfo[index].noOfChild).keys(),
          ].flatMap((item, chdindex) => {
            return {
              typeString: "CHD",
              quantity: 1,
              type: 1,
              age: 5, //hotelItem.hotelPaxInfo[index].childAge[chdindex]
            };
          });

          if (hotelItem.hotelPaxInfo[index].noOfChild > 0) {
            return [adt, ...chd];
          } else return [adt];
        }
      );

      return tmpArr.flatMap((x) => x);
    } else {
      return [
        ...Array(
          parseInt(hotelItem.noRooms === "" ? 1 : hotelItem.noRooms)
        ).keys(),
      ].map((data) => {
        return {
          typeString: "ADT",
          quantity: 2,
          type: 0,
        };
      });
    }
  };
  handleItemEdit = (item) => {
    this.setState({ businessName: item.offlineItem.business });
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation_Master" ? "QuotationDetails~master-quotation-edit-item" : "IitineraryDetails~master-itineraries-edit-item"))) {
      //this.handleItemDelete(item);
      //localStorage.setItem("edititemuuid",item.offlineItem)
      this.addItem({ itemDtlEdit: item.offlineItem });
    }
    else {
      this.setState({ isshowauthorizepopup: true });
    }
  };
  getCountry = () => {
    return fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name.toLowerCase() !== "india" && data?.country_name.toLowerCase() !== "not found") {
          this.setState({ ipCountryName: data?.country_name })
        }
        else {
          this.setState({ ipCountryName: "india" })
        }
        console.log(data, data?.country_name);
      }).catch((err) => {
        this.setState({ ipCountryName: "" })
      });
  };
  componentDidMount = () => {
    this.getCountry();
    // if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~master-quotation-create-quotation")) {
    //   this.props.history.push('/');
    // }
    window.addEventListener('resize', this.handleResize);
    const { mode } = this.props.match.params;
    mode === "Create" && this.resetQuotation();
    //this.getAuthToken();
    this.setpersonate(undefined, 'democustomer@tourwiz.com');
    this.getBasicDataForCustomerPortal();
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleResize() {
    this.setState({ screenWidth: window.innerWidth });
  }
  getBasicDataForCustomerPortal = () => {
    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        if (data.error) return;
        else
          this.setState({ customerPortalURL: data.response[0].customHomeURL.toLowerCase().replace("http://", "https://") });
      }, 'GET');
  }
  handleAssistant = () => {
    let isAssistant = this.state.isAssistant;
    this.setState({ isAssistant: !isAssistant })
  }
  render() {
    const {
      isResults,
      isMetaResults,
      businessName,
      searchRequest,
      resultKey,
      isEmail,
      items,
      detailsKey,
      isBtnLoadingBookItinerary,
      type,
      importItem,
      importItemKey,
      isShowSearch,
      saveTermsConditons,
      ipCountryName,
    } = this.state;
    const { mode } = this.props.match.params;
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    const { userInfo } = this.props;
    let screenWidth = this.state.screenWidth;
    return (
      <div className="quotation">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {mode === "Create"
                ? type === "Itinerary_Master"
                  ? localStorage.getItem("isUmrahPortal")
                    ? "Create Package"
                    : "Create Master Itinerary"
                  : "Create Master " + Trans("_quotationReplaceKey")
                : mode === "Edit"
                  ? type === "Itinerary_Master"
                    ? "Edit Master Itinerary"
                    : "Edit Master " + Trans("_quotationReplaceKey")
                  : type === "Itinerary_Master"
                    ? mode !== "DetailsInquiry"
                      ? "Itinerary Details"
                      : "Inquiry Details"
                    : Trans("_quotationReplaceKey") + " Details"}
            </title>
          </Helmet>
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

                  {mode === "Create"
                    ? type === "Itinerary_Master"
                      ? localStorage.getItem("isUmrahPortal")
                        ? "Create Package"
                        : "Create Master Itinerary"
                      : "Create Master " + Trans("_quotationReplaceKey")
                    : mode === "Edit"
                      ? type === "Itinerary_Master"
                        ? "Edit Master Itinerary"
                        : "Edit Master " + Trans("_quotationReplaceKey")
                      : type === "Itinerary_Master"
                        ? mode !== "DetailsInquiry"
                          ? "Itinerary Details"
                          : "Inquiry Details"
                        : Trans("_quotationReplaceKey") + " Details"}
                </h1>
              </div>
              <div className="col-lg-4 d-flex justify-content-end">
                {type === "Quotation_Master" && mode !== "DetailsInquiry" && (
                  <>
                    <AuthorizeComponent
                      title="ai-assistant~button"
                      type="button"
                      rolepermissions={this.props.userInfo.rolePermissions}>
                      {mode !== "Create" &&
                        <button
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ai-assistant~button") ? this.handleAssistant() : this.setState({ isshowauthorizepopup: true })}
                        >
                          Your AI Assistant
                        </button>
                      }
                    </AuthorizeComponent>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => this.props.history.push(`/QuotationList_Master`)}
                    >
                      {localStorage.getItem("portalType") === "B2C"
                        ? "My Master " + Trans("_quotationReplaceKey")
                        : screenWidth >= 768 ? "Manage Master " + Trans("_quotationReplaceKeys") : "Manage  " + Trans("_quotationReplaceKeys")}
                    </button>
                  </>
                )}

                {type === "Itinerary_Master" &&
                  mode !== "DetailsInquiry" &&
                  !localStorage.getItem("isUmrahPortal") && (
                    <>
                      <AuthorizeComponent title="ai-assistant~button"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}>
                        {mode !== "Create" &&
                          <button
                            className="btn btn-sm btn-primary mr-2"
                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ai-assistant~button") ? this.handleAssistant() : this.setState({ isshowauthorizepopup: true })}
                          >
                            Your AI Assistant
                          </button>
                        }
                      </AuthorizeComponent>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => this.props.history.push(`/ItineraryList_Master`)}
                      >
                        {localStorage.getItem("portalType") === "B2C"
                          ? "My Master Itineraries"
                          : screenWidth >= 768 ? "Manage Master Itineraries" : "Manage  Itineraries"}
                      </button>
                    </>
                  )}

                {mode === "DetailsInquiry" && (
                  <button
                    className="btn btn-sm btn-primary pull-right"
                    onClick={() => this.props.history.push(`/InquiryList`)}
                  >
                    {Trans("Manage Inquiries")}
                  </button>
                )}

              </div>
            </div>

          </div>
        </div>

        <div className="container">
          {mode === "Create" && (
            <QuotationCreate
              type={type}
              handleCreate={this.generateQuotation}
              handleDateChange={this.props.setDate}
              isErrorMsg={this.state.isErrorMsg}
              isBtnLoading={this.state.isBtnLoading}
              mode={mode}
              history={this.props.history}
              childRef={this.childRef}
            />
          )}

          {mode === "Edit" && (
            <QuotationCreate
              type={type}
              {...quotationInfo}
              handleCreate={this.generateQuotation}
              handleDateChange={this.props.setDate}
              isErrorMsg={this.state.isErrorMsg}
              isBtnLoading={this.state.isBtnLoading}
              mode={mode}
              history={this.props.history}
              childRef={this.childRef}
            />
          )}

          {(mode === "Details" ||
            mode === "Edit" ||
            mode === "DetailsInquiry") && (
              <React.Fragment>
                <Quotationinfo
                  type={type}
                  {...quotationInfo}
                  handleEdit={this.handleEdit}
                  userInfo={this.props.userInfo}
                />
                <AuthorizeComponent
                  title={type === "Quotation_Master"
                    ? "dashboard-menu~master-quotation-create-quotation"
                    : "dashboard-menu~master-itineraries-create-itineraries"}
                  type="button"
                  rolepermissions={this.props.userInfo.rolePermissions}
                >
                  <React.Fragment>
                    <QuotationSearch
                      businessName={businessName}
                      history={this.props.history}
                      match={this.props.match}
                      handleResults={this.handleResults}
                      handleSearchRequest={this.handleSearchRequest}
                      changeQuotationTab={this.changeQuotationTab}
                      handleOffline={this.handleOffline}
                      type={type}
                      quotationInfo={quotationInfo}
                      isShowSearch={isShowSearch}
                      userInfo={this.props.userInfo}
                    />

                    {isMetaResults && businessName == "hotel" && (
                      <QuotationResultsMeta
                        key={"resultKey" + resultKey}
                        searchRequest={searchRequest}
                        addItem={this.addItem}
                        deleteResults={this.deleteResults}
                        type={type}
                      />
                    )}

                    {isMetaResults &&
                      businessName == "air" &&
                      searchRequest.tripDirection.toLowerCase() !==
                      "roundtrip" && (
                        <QuotationResultsMetaAir
                          key={"resultKey" + resultKey}
                          addItem={this.addItem}
                          searchRequest={searchRequest}
                          deleteResults={this.deleteResults}
                          type={type}
                        />
                      )}

                    {isMetaResults &&
                      businessName == "air" &&
                      searchRequest.tripDirection.toLowerCase() ===
                      "roundtrip" && (
                        <QuotationResultsMetaAirRoundTrip
                          key={"resultKey" + resultKey}
                          addItem={this.addItem}
                          searchRequest={searchRequest}
                          deleteResults={this.deleteResults}
                          type={type}
                          tripDirection={searchRequest.tripDirection.toLowerCase()}
                        />
                      )}

                    {isMetaResults && businessName == "activity" && (
                      <QuotationResultsMetaActivity
                        key={"resultKey" + resultKey}
                        addItem={this.addItem}
                        searchRequest={searchRequest}
                        deleteResults={this.deleteResults}
                        type={type}
                      />
                    )}

                    {isResults && !isMetaResults && (
                      <QuotationResults
                        key={"resultKey" + resultKey}
                        businessName={businessName}
                        addItem={this.addItem}
                        searchRequest={searchRequest}
                        deleteResults={this.deleteResults}
                        type={type}
                      />
                    )}
                  </React.Fragment>
                </AuthorizeComponent>
                {type === "Quotation_Master" && (
                  <React.Fragment>
                    {importItem && (
                      <ItineraryAddOffline
                        type={type}
                        business={businessName}
                        handleOffline={this.handleOffline}
                        importItem={importItem}
                        key={"importItemKey" + importItemKey}
                        userInfo={this.props.userInfo}
                      />
                    )}

                    {items.length > 0 && (
                      <React.Fragment>
                        <QuotationDetails
                          key={"detailsKey" + detailsKey}
                          items={items}
                          type={type}
                          handleItemDelete={this.handleItemDelete}
                          handleItemEdit={this.handleItemEdit}
                          userInfo={this.props.userInfo}
                          savetermsconditions={this.saveTermsConditions}
                          detailsRef={this.detailsRef}
                        />

                        <div className="quotation-action-buttons mt-4 text-center">
                          <AuthorizeComponent
                            title="QuotationDetails~master-quotation-preview-quotation"
                            type="button"
                            rolepermissions={this.props.userInfo.rolePermissions}
                          >
                            <button
                              onClick={this.viewDetailsMode}
                              className="btn btn-sm btn-outline-primary ml-2 mr-2"
                            >
                              Preview Master {Trans("_quotationReplaceKey")}
                            </button>
                          </AuthorizeComponent>
                          <AuthorizeComponent
                            title="QuotationDetails~master-quotation-send-quotation"
                            type="button"
                            rolepermissions={this.props.userInfo.rolePermissions}
                          >
                            <button
                              className="btn btn-sm btn-outline-primary ml-2 mr-2"
                              onClick={this.sendEmail}
                            >
                              Send Master {Trans("_quotationReplaceKey")}
                            </button>
                          </AuthorizeComponent>
                          {/* <AuthorizeComponent
                            title="QuotationDetails~quotation-book-quotation"
                            type="button"
                            rolepermissions={this.props.userInfo.rolePermissions}
                          >
                            <button
                              onClick={this.bookQuotationManually}
                              className="btn btn-sm btn-outline-primary ml-2 mr-2"
                            >
                              {isBtnLoadingBookItinerary && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              Generate Invoice
                            </button>
                          </AuthorizeComponent> */}
                          {/* <AuthorizeComponent
                            title="QuotationDetails~quotation-share-whatsapp"
                            type="button"
                            rolepermissions={this.props.userInfo.rolePermissions}
                          >
                            <button
                              // href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + whatsappMessage}
                              target="_blank"
                              onClick={() => this.shareQuatationDetails()}
                              className="btn btn-sm btn-outline-success text-success ml-2 mr-2">
                              <img src={SocialMediaWhatsappWhite} alt="Whatsapp" style={{ width: "18px" }} />&nbsp; Share on Whatsapp
                            </button>
                          </AuthorizeComponent> */}
                        </div>

                        {isEmail && (
                          <QuotationEmail
                            {...this.props}
                            {...quotationInfo}
                            saveQuotation={this.saveQuotation}
                            sendEmail={this.sendEmail}
                            items={items}
                            type={type}
                          />
                        )}
                      </React.Fragment>
                    )}
                    {localStorage.getItem("portalType") === "B2C" &&
                      type === "Quotation_Master" &&
                      items.length === 0 && (
                        <div className="text-center mt-4">
                          <b>No Item(s) added.</b>
                        </div>
                      )}
                  </React.Fragment>
                )}

                {type === "Itinerary_Master" && (
                  <React.Fragment>
                    {importItem && (
                      <ItineraryAddOffline
                        type={type}
                        business={businessName}
                        handleOffline={this.handleOffline}
                        importItem={importItem}
                        key={"importItemKey" + importItemKey}
                        userInfo={this.props.userInfo}
                      />
                    )}

                    <ItineraryDetails
                      {...quotationInfo}
                      items={items}
                      type={type}
                      handleItemDelete={this.handleItemDelete}
                      handleItemEdit={this.handleItemEdit}
                      key={"detailsKey" + detailsKey}
                      userInfo={this.props.userInfo}
                      savetermsconditions={this.saveTermsConditions}
                    />

                    <div className="quotation-action-buttons mt-4 text-center">
                      <AuthorizeComponent
                        title="ItineraryDetails~master-itineraries-preview-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >
                        {this.state.items.length > 0 ? <button
                          onClick={this.viewDetailsMode}
                          className="btn btn-sm btn-outline-primary ml-2 mr-2"
                        >
                          Preview Master Itinerary
                        </button> : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          Preview Master Itinerary
                        </button>}

                      </AuthorizeComponent>
                      <AuthorizeComponent
                        title="IitineraryDetails~master-itineraries-send-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >{this.state.items.length > 0 ?
                        <button
                          className="btn btn-sm btn-outline-primary ml-2 mr-2"
                          onClick={this.sendEmail}
                        >
                          Send Itinerary Master
                        </button> : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          Send Itinerary Master
                        </button>}
                      </AuthorizeComponent>
                      {/* <AuthorizeComponent
                        title="ItineraryDetails~itineraries-book-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >{this.state.items.length > 0 ?
                        !isBtnLoadingBookItinerary ? (
                          <button
                            onClick={this.bookQuotationManually}
                            className="btn btn-sm btn-outline-primary ml-2 mr-2"
                          >
                            Generate Invoice
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-primary ml-2 mr-2">
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                            Generate Invoice
                          </button>
                        ) : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          Generate Invoice
                        </button>}
                      </AuthorizeComponent> */}
                      {/* <AuthorizeComponent
                        title="ItineraryDetails~itineraries-share-whatsapp"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >
                        <button
                          // href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + whatsappMessage}
                          target="_blank"
                          onClick={() => this.shareQuatationDetails()}
                          className="btn btn-sm btn-outline-success text-success ml-2 mr-2">
                          <img src={SocialMediaWhatsappWhite} alt="Whatsapp" style={{ width: "18px" }} />&nbsp; Share on Whatsapp
                        </button>
                      </AuthorizeComponent> */}
                      {/* <AuthorizeComponent
                        title="itinerary-details~book-itinerary-manually"
                        type="button"
                      >
                        <button
                          onClick={this.bookQuotationManually}
                          className="btn btn-sm btn-primary ml-2 mr-2"
                          style={{ display: "none" }}
                        >
                          Book Itinerary Manually
                        </button>
                      </AuthorizeComponent> */}
                    </div>
                    {this.state.isErrorMsg_BookItinerary && (
                      <div className="col-lg-12 text-center" >
                        <h6 className="alert alert-danger mt-3 d-inline-block">
                          {this.state.isErrorMsg_BookItinerary}
                        </h6>
                      </div>
                    )}

                    {isEmail && (
                      <ItineraryEmail
                        {...this.props}
                        {...quotationInfo}
                        saveQuotation={this.saveQuotation}
                        sendEmail={this.sendEmail}
                        items={items}
                        type={type}
                      />
                    )}
                  </React.Fragment>
                )}
                {saveTermsConditons && (
                  <ItineraryQuotationTermsConditions
                    {...this.props}
                    {...quotationInfo}
                    isBtnLoading={this.state.isBtnLoading}
                    saveQuotation={this.saveQuotation}
                    saveTermsConditions={this.saveTermsConditions}
                    issavedTermsConditions={this.state.issavedTermsConditions}
                  />
                )}

              </React.Fragment>
            )}
        </div>

        {
          this.state.comingsoon && (
            <ComingSoon handleComingSoon={this.handleComingSoon} />
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
          this.state.isSubscriptionPlanend &&
          <ModelLimitExceeded
            header={"Plan Limitations Exceeded"}
            content={"The maximum recommended plan has been exceeded"}
            handleHide={this.hidelimitpopup}
            history={this.props.history}
          />
        }
        {
          this.state.isAssistant &&
          <AssistantModelPopup
            content={
              <PackageAIAssitant
                handleHide={this.handleAssistant}
                promptMode={"Itinerary"}
              />}
            sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
            handleHide={this.handleAssistant}
          />
        }
      </div>
    );
  }
}

// Tourwiz inquiry issues changes - Naitik
export default MasterQuotation;
