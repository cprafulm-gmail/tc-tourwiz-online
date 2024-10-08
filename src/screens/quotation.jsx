import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import SVGIcon from "../helpers/svg-icon";
import QuotationCreate from "../components/quotation/quotation-create";
import Quotationinfo from "../components/quotation/quotation-info";
import MessageBar from '../components/admin/message-bar';
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
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAIAssitant from "./package-ai-assistant";
import { Helmet } from "react-helmet";
import Config from "../config.json";

class Quotation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageBar: false,
      SucessMsg: "",
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
      type: this.props.match.path.split("/").includes("Itinerary")
        ? "Itinerary"
        : "Quotation",
      importItem: false,
      importItemKey: 1,
      isShowSearch: true,
      comingsoon: false,
      bookingItemCount: 0,
      isMetaResults: false,
      isErrorMsg: "",
      isshowauthorizepopup: false,
      issavedTermsConditions: false,
      //employeesOptions: [],
      selectedItemsforQuotation: [],
      selectedItemValidationMsg: '',
      isSubscriptionPlanend: false,
      isAssistant: "",
      ipCountryName: "",
      isQuickProposal: (this.props.match.params.mode === "CreateQuick" ? true : false)
    };
  }

  childRef = React.createRef();
  detailsRef = React.createRef();

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
    if (inquiryDetails !== null && inquiryDetails.termsconditions)
      data.termsconditions = inquiryDetails.termsconditions;
    // if (this.state.isQuickProposal) {
    //   let test = localStorage.getItem("quotationItems");
    //   if (test) {
    //     let quotationItems = JSON.parse(test)
    //     if (quotationItems.find(x => x.offlineItem.business === "package")) {
    //       quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem.totalAmount = this.state.budget;
    //       quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem.sellPrice = this.state.budget;
    //     }
    //     localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    //   }
    // }
    if (inquiryDetails === null || !inquiryDetails.isQuickProposal)
      localStorage.setItem("quotationDetails", JSON.stringify(data));
    (this.props.match.params.mode === "Create" || this.props.match.params.mode === "CreateQuick") && this.createCart();
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
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (reqData?.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"))
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

  createCart = () => {
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let quotationItems = localStorage.getItem("quotationItems");
    let budget = 0;
    if (this.state.isQuickProposal) {
      if (!quotationInfo) {
        var childrefelement = this.childRef.current;
        childrefelement["fileExtension"] = this.detailsRef.current.data.fileExtension;
        childrefelement["fileContentType"] = this.detailsRef.current.data.fileContentType;
        childrefelement["fileData"] = this.detailsRef.current.data.fileData;
        childrefelement["fileName"] = this.detailsRef.current.data.fileName;
        childrefelement["quickproposalcomments"] = this.detailsRef.current.data.quickproposalcomments;
        localStorage.setItem("quotationDetails", JSON.stringify(childrefelement));
      }
      quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
      if (!localStorage.getItem("quotationItems")) {
        quotationItems = this.getQuickProposalItem(quotationInfo);
        quotationItems = JSON.stringify(quotationItems);
      }
      budget = localStorage.getItem("quotationItems") ?
        JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          : JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            : 0
        : 0

    }
    this.setState({ isBtnLoading: true });
    //quotationItems = JSON.stringify(quotationItems);
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
        offlineItems: quotationItems,
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo.status === "" ? "New" : quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        configurations: quotationInfo?.configurations,
        budget: quotationInfo?.budget,
        priority: quotationInfo?.priority,
        tripType: quotationInfo?.tripType,
        followupDate: moment(quotationInfo.followupDate).format("YYYY-MM-DD"),
      },
      adult: quotationInfo?.adult === undefined ? quotationInfo?.adults : quotationInfo?.adult,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      status: quotationInfo.status === "" ? "New" : quotationInfo.status,
      followupDate: quotationInfo?.followupDate,
      createCustomer_validateEmailAndPhone: true,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: false,
      isQuickproposal: this.state.isQuickProposal,
      fileContentType: quotationInfo?.fileContentType ? quotationInfo?.fileContentType : null,
      fileData: quotationInfo?.fileData ? quotationInfo?.fileData : null,
      fileExtension: quotationInfo?.fileExtension ? quotationInfo?.fileExtension : null,
      fileName: quotationInfo?.fileName ? quotationInfo?.fileName : null,
      quickproposalcomments: quotationInfo?.quickproposalcomments ? quotationInfo?.quickproposalcomments : quotationInfo?.quickProposalDetails ? quotationInfo?.quickProposalDetails : null,
      documentPath: quotationInfo?.documentPath ? quotationInfo?.documentPath : null,
    };

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let element = this.state.type === "Itinerary" ? "dashboard-menu~itineraries-create-itineraries" : "dashboard-menu~quotation-create-quotation";
    let quota = Global.LimitationQuota[element];
    let SucessMsg = "Quick Proposal Saved Successfully";
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        if (data.code && data.code === 101) {
          this.setState({ isSubscriptionPlanend: true, isBtnLoading: false });
        }
        else {
          this.setState({ isErrorMsg: data.error, isBtnLoading: false });
        }
      }
      else {
        if (quotaUsage["totalUsed" + quota] === null)
          quotaUsage["totalUsed" + quota] = 1;
        else
          quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
        localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
        localStorage.setItem("cartLocalId", data.id);
        let items = [];
        if (localStorage.getItem("quotationItems")) {
          items = JSON.parse(localStorage.getItem("quotationItems"));
        }
        this.setState({
          showMessageBar: this.state.isQuickProposal ? true : false,
          SucessMsg: SucessMsg,
          popupTitle: "Create Quick Proposal Successfully",
          savedCartId: localStorage.getItem("cartLocalId"),
          isBtnLoading: false,
          items
        });
        let localQuotationInfo = JSON.parse(
          localStorage.getItem("quotationDetails")
        );
        localQuotationInfo.status = localQuotationInfo?.status === "" ? "New" : localQuotationInfo?.status;
        localQuotationInfo.id = data.id;
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

  getQuickProposalItem = (quotationInfo) => {
    let defaultPackageforQuickProposal = { ...defaultPackagePricingData };
    defaultPackageforQuickProposal.name = quotationInfo.title;
    defaultPackageforQuickProposal.startDate = moment(quotationInfo.startDate).format("YYYY-MM-DD");
    defaultPackageforQuickProposal.endDate = moment(quotationInfo.endDate).format("YYYY-MM-DD");
    defaultPackageforQuickProposal.sellPrice = quotationInfo.budget;
    let offlineItem = [{ "offlineItem": defaultPackageforQuickProposal }];
    return offlineItem;

  };

  handleEdit = () => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "dashboard-menu~quotation-create-quotation" : "dashboard-menu~itineraries-create-itineraries"))) {
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "dashboard-menu~quotation-create-quotation" : "dashboard-menu~itineraries-create-itineraries"))) {
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "QuotationDetails~quotation-send-quotation" : "IitineraryDetails~itineraries-send-itineraries"))) {
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "QuotationDetails~quotation-delete-item" : "ItineraryDetails~itineraries-delete-item"))) {
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "dashboard-menu~quotation-create-quotation" : "dashboard-menu~itineraries-create-itineraries"))) {
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
  closesMessageBar = () => {
    this.setState({ showMessageBar: false });
  }
  saveQuotation = (isSkipPhoneValidation) => {
    // Save Quotation Changes
    this.setState({ isBtnLoading: true });
    let SucessMsg = "Quick Proposal Saved Successfully"
    var quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let quotationItems = JSON.parse(localStorage.getItem("quotationItems"))
    if (this.state.type === "Itinerary_Master" && quotationItems
      && quotationItems.filter(x => x.offlineItem.business === "package").length > 0) {
      quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem = { ...quotationInfo.packagePricingData };
      localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    }

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
    let budget = 0;
    if (this.state.isQuickProposal && this.childRef.current !== null) {
      var childrefelement = this.childRef.current;
      childrefelement["fileExtension"] = this.detailsRef.current.data.fileExtension === undefined ? this.detailsRef.current.fileExtension : this.detailsRef.current.data.fileExtension;
      childrefelement["fileContentType"] = this.detailsRef.current.data.fileContentType === undefined ? this.detailsRef.current.fileContentType : this.detailsRef.current.data.fileContentType;
      childrefelement["fileData"] = this.detailsRef.current.data.fileData === undefined ? this.detailsRef.current.fileData : this.detailsRef.current.data.fileData;
      childrefelement["fileName"] = this.detailsRef.current.data.fileName === undefined ? this.detailsRef.current.fileName : this.detailsRef.current.data.fileName;
      childrefelement["quickproposalcomments"] = this.detailsRef.current.data.quickproposalcomments;
      localStorage.setItem("quotationDetails", JSON.stringify(childrefelement));
      quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
      if (!localStorage.getItem("quotationItems")) {
        quotationItems = this.getQuickProposalItem(quotationInfo);
        quotationItems = JSON.stringify(quotationItems);
      }
      budget = localStorage.getItem("quotationItems") ?
        JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.totalAmount
          : JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            ? JSON.parse(localStorage.getItem("quotationItems"))?.filter(x => x.offlineItem.business === "package")[0]?.offlineItem.sellPrice
            : 0
        : 0

    }
    quotationItems = JSON.stringify(quotationItems);
    var reqURL = "quotation/update";
    var reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      name: quotationInfo.title,
      imageURL: quotationInfo.imageURL,
      owner: quotationInfo.customerName,
      isPublic: true,
      userID: quotationInfo.userID ?? quotationInfo.userId,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        notes: quotationInfo.terms ? quotationInfo.terms : "",
        termsconditions: quotationInfo.termsconditions ? quotationInfo.termsconditions : "",
        offlineItems: quotationItems,
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: quotationInfo?.status === "" ? "New" : quotationInfo.status,
        agentName: localStorage.getItem("agentName") || "",
        configurations: quotationInfo?.configurations,
        inquiryId: quotationInfo.inquiryId,
        budget: quotationInfo?.budget,
        priority: quotationInfo?.priority,
        tripType: quotationInfo?.tripType,
        followupDate: moment(quotationInfo.followupDate).format("YYYY-MM-DD"),
        // assignmentComment: quotationInfo?.assignmentComment
      },
      adult: quotationInfo?.adult === undefined ? quotationInfo?.adults : quotationInfo?.adult,
      children: quotationInfo?.children,
      infant: quotationInfo?.infant,
      priority: quotationInfo?.priority,
      tripType: quotationInfo?.tripType,
      followupDate: quotationInfo?.followupDate,
      bookBefore: bookBefore,
      createCustomer_validateEmailAndPhone: true,
      createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
      createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (quotationInfo.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")),
      createCustomer_isSkipPhoneValidation: isSkipPhoneValidation,
      isQuickproposal: this.state.isQuickProposal,
      fileContentType: quotationInfo?.fileContentType ? quotationInfo?.fileContentType : null,
      fileData: quotationInfo?.fileData ? quotationInfo?.fileData : null,
      fileExtension: quotationInfo?.fileExtension ? quotationInfo?.fileExtension : null,
      fileName: quotationInfo?.fileName ? quotationInfo?.fileName : null,
      quickproposalcomments: quotationInfo?.quickproposalcomments ? quotationInfo?.quickproposalcomments : quotationInfo?.quickProposalDetails ? quotationInfo?.quickProposalDetails : null,
      documentPath: quotationInfo?.documentPath ? quotationInfo?.documentPath : null,
    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error)
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      else {
        let items = [];
        if (localStorage.getItem("quotationItems")) {
          items = JSON.parse(localStorage.getItem("quotationItems"));
          if (this.state.isQuickProposal) {
            // let quotationItems = JSON.parse(localStorage.getItem("quotationItems"))
            // if (quotationItems.find(x => x.offlineItem.business === "package")) {
            //   quotationItems.filter(x => x.offlineItem.business === "package")[0].offlineItem.totalAmount = this.state.budget;
            // }
            // localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
          }
        }
        this.setState({
          showMessageBar: this.state.isQuickProposal ? true : false,
          SucessMsg: SucessMsg,
          popupTitle: "Create Quick Proposal Successfully",
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
          this.setState({ isSaveSucessMsg: false, showMessageBar: false });
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
    var reqURL = "inquiry/update";
    var reqOBJ = {
      title: quotationInfo.title,
      from: quotationInfo.customerName,
      fromEmail: quotationInfo.email,
      type: this.state.type,
      id: localStorage.getItem("inquiryId"),
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms,
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDat).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: quotationInfo.createdDate,
        status: "saved",
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "QuotationDetails~quotation-preview-quotation" : "ItineraryDetails~itineraries-preview-itineraries"))) {
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

  setpersonate = (callback, Email) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    const quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));
    let reqOBJ = {
      Request: Email ? Email : quotationDetails.email ? quotationDetails.email : quotationDetails.phone,
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
          callback();
        }
      }.bind(this)
    );
  };

  bookQuotationManually = async () => {
    let bookingTtems = [];
    let AllItems = JSON.parse(localStorage.getItem("quotationItems"))
      ? JSON.parse(localStorage.getItem("quotationItems"))
      : [];

    if (this.state.type === 'Quotation' && this.state.selectedItemsforQuotation.length <= 0 && !this.state.isQuickProposal) {
      this.setState({ isBtnLoadingBookItinerary: false, isErrorMsg_BookItinerary: "", selectedItemValidationMsg: 'Please Select at least one item' });
      setTimeout(() => {
        this.setState({ selectedItemValidationMsg: '' })
      }, 5000);
      return false;
    }

    if (this.state.type === 'Quotation' && !this.state.isQuickProposal) {
      AllItems.map(
        (x) =>
          (x.offlineItem.business === "hotel" ||
            x.offlineItem.business === "air" ||
            x.offlineItem.business === "activity" ||
            x.offlineItem.business === "transfers" ||
            x.offlineItem.business === "custom" ||
            x.offlineItem.business === "package") &&
          (x.offlineItem.uuid === this.state.selectedItemsforQuotation.find(e => e === x.offlineItem.uuid)) &&

          bookingTtems.push(x.offlineItem)
      );
    }
    else {
      AllItems.map(
        (x) =>
          (x.offlineItem.business === "hotel" ||
            x.offlineItem.business === "air" ||
            x.offlineItem.business === "activity" ||
            x.offlineItem.business === "transfers" ||
            x.offlineItem.business === "custom" ||
            x.offlineItem.business === "package") &&
          bookingTtems.push(x.offlineItem)
      );
    }


    if (!GlobalEvents.handleCheckforFreeExcess(this.props, (this.state.type === "Quotation" ? "QuotationDetails~quotation-book-quotation" : "ItineraryDetails~itineraries-book-itineraries"), bookingTtems.length)) {
      this.setState({ isSubscriptionPlanend: true });
    }
    else {
      this.setState({ isBtnLoadingBookItinerary: true });
      await this.CheckforAccessQuota(bookingTtems.length);
      if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "QuotationDetails~quotation-book-quotation" : "ItineraryDetails~itineraries-book-itineraries"))) {
        this.setState({ isErrorMsg_BookItinerary: "", selectedItemValidationMsg: '' });

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
    }

  };

  CheckforAccessQuota = async (itemscount) => {
    let reqURL = "user/checkaccessquota?type=Booking&totalitems=" + itemscount
    let reqOBJ = {}
    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.code && data.code === 101) {
            this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend, isBtnLoadingBookItinerary: false });
          }
          else if (data.response) {
            resolve()
          }
        }.bind(this),
        "GET"
      );
    });
  }

  bookQuotationManuallyCreate = () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };

    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.response);
      this.bookQuotationManuallyAdd(data.response);
    });
  };
  getselecteditemsBook = (data) => {
    let selecteditem = this.state.selectedItemsforQuotation;
    if (!selecteditem) {
      selecteditem.push(data);
    }
    else if (selecteditem.filter(x => x === data).length === 0) {
      selecteditem.push(data);
    }
    else {
      selecteditem.pop(data);
    }
    this.setState({
      selectedItemsforQuotation: selecteditem
    });
  }
  bookQuotationManuallyAdd = (manualCartId) => {

    let bookingTtems = [];
    let AllItems = JSON.parse(localStorage.getItem("quotationItems"))
      ? JSON.parse(localStorage.getItem("quotationItems"))
      : [];
    if (this.state.type === 'Quotation' && !this.state.isQuickProposal) {
      AllItems.map(
        (x) =>
          (x.offlineItem.business === "hotel" ||
            x.offlineItem.business === "air" ||
            x.offlineItem.business === "activity" ||
            x.offlineItem.business === "transfers" ||
            x.offlineItem.business === "custom" ||
            x.offlineItem.business === "package") &&
          (x.offlineItem.uuid === this.state.selectedItemsforQuotation.find(e => e === x.offlineItem.uuid)) &&

          bookingTtems.push(x.offlineItem)
      );
    }
    else {
      AllItems.map(
        (x) =>
          (x.offlineItem.business === "hotel" ||
            x.offlineItem.business === "air" ||
            x.offlineItem.business === "activity" ||
            x.offlineItem.business === "transfers" ||
            x.offlineItem.business === "custom" ||
            x.offlineItem.business === "package") &&
          bookingTtems.push(x.offlineItem)
      );
    }


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
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = item.business.toLowerCase();
    if (business === "transfers" || business === "custom" || business === "package") business = "activity";

    const quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));

    let objconfig = [];
    objconfig = [
      {
        key: "isHideFareBreakupInvoice",
        value: quotationDetails?.configurations?.isHideFareBreakupInvoice
      },
      {
        key: "SellPrice",
        value: Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : 0),
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
            : 1,
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
            : 0,
      },
      {
        key: "supplierCostPricePortalCurrency",
        value:
          item.supplierCostPrice && item.supplierCostPrice !== ""
            ? parseFloat(item.supplierCostPrice.toString().replace(/,/g, "")) *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : 1
            )
            : 0,
      },
      {
        key: "supplierTaxPricePortalCurrency",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : 1
            )
            : 0,
      },
      {
        key: "markupPrice",
        value:
          item.markupPrice && item.markupPrice !== "" ? item.markupPrice : 0,
      },
      {
        key: "discountPrice",
        value:
          item.discountPrice && item.discountPrice !== ""
            ? item.discountPrice
            : 0,
      },
      {
        key: "CGSTPrice",
        value: item.CGSTPrice && item.CGSTPrice !== "" ? item.CGSTPrice : 0,
      },
      {
        key: "SGSTPrice",
        value: item.SGSTPrice && item.SGSTPrice !== "" ? item.SGSTPrice : 0,
      },
      {
        key: "IGSTPrice",
        value: item.IGSTPrice && item.IGSTPrice !== "" ? item.IGSTPrice : 0,
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
        value: item.tax1 && item.tax1 !== "" ? item.tax1 : 0,
      },
      {
        key: "tax2Price",
        value: item.tax2 && item.tax2 !== "" ? item.tax2 : 0,
      },
      {
        key: "tax3Price",
        value: item.tax3 && item.tax3 !== "" ? item.tax3 : 0,
      },
      {
        key: "tax4Price",
        value: item.tax4 && item.tax4 !== "" ? item.tax4 : 0,
      },
      {
        key: "tax5Price",
        value: item.tax5 && item.tax5 !== "" ? item.tax5 : 0,
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
        value: (item.amountWithoutGST === "" || !item.amountWithoutGST) ? 0 : item.amountWithoutGST,
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

    if (item.description && item.description !== "") {
      objconfig.push({
        key: "Description",
        value: item.description
      });
    }

    if (quotationDetails?.termsconditions && quotationDetails?.termsconditions !== "") {
      objconfig.push({
        key: "TermsConditions",
        value: quotationDetails?.termsconditions
      });
    }

    if (true) { //(quotationDetails?.inquiryId && quotationDetails?.inquiryId !== "") {
      objconfig.push({
        key: "QuotationItineraryID",
        value: quotationDetails?.id
      });
    }

    return objconfig;
  };

  getCostPrice = (item) => {
    return item.costPrice && item.costPrice !== "" ? item.costPrice.toString().replace(/,/g, "") : 0
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
            Amount: item.sellPrice !== "" ? item.sellPrice : 0,
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
      item.departStops = (Array.isArray(item.departStops)
        ? item.departStops
        : [...Array(Number(item.departStops)).keys()])
        .map(item => {
          if (Object.keys(item).length < 2)
            return false
          else return item;
        }).filter(Boolean);
      item.returnStops = (Array.isArray(item.returnStops)
        ? item.returnStops
        : [...Array(Number(item.returnStops)).keys()])
        .map(item => {
          if (Object.keys(item).length < 2)
            return false
          else return item;
        }).filter(Boolean);
      if (!item.isRoundTrip) {
        return [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "oneway",
              Amount: item.sellPrice !== "" ? item.sellPrice : 0,
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
              StopDetails: [item.departStops !== ""
                ? Array.isArray(item.departStops)
                  ? item.departStops.length
                  : item.departStops
                : 0],
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
                      LocationInfo: {
                        FromLocation: {
                          ID: item.fromLocation || "Unnamed",
                          Name: item.fromLocation || "Unnamed",
                          CountryID: item.fromLocation || "Unnamed",
                          Country: item.fromLocationCity || "Unnamed",
                          City: item.fromLocationCity || "Unnamed",
                          Type: "Location",
                        },
                        ToLocation: {
                          ID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          Name: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          CountryID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          Country: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                          City: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
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
                          (moment(Array.isArray(item.departStops) && item.departStops.length > 0
                            ? item.departStops[0].endDate
                            : item.departEndDate).format("YYYY-MM-DD")) +
                          "T" +
                          (Array.isArray(item.departStops) && item.departStops.length > 0
                            ? (item.departStops[0].departEndTime === "" ? "00:00" : item.departStops[0].departEndTime) + ":00"
                            : (item.departEndTime !== ""
                              ? item.departEndTime + ":00"
                              : "00:00:00")),
                      },
                    },
                    Array.isArray(item.departStops) && item.departStops.map((flightItem, index, array) => {
                      let toLocation = "";
                      let hours = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]) === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]);
                      let minutes = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]) === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]);
                      if (array.length === 1) {
                        toLocation = item.toLocation;
                      }
                      else if (array.length > index + 1) {
                        toLocation = array[index + 1].stopLocation;
                      }
                      else
                        toLocation = item.toLocation;
                      return {
                        journeyDuration: flightItem.totaldepartDuration ?? 0,
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                        ],
                        images: [
                          {
                            URL: flightItem.departImg ?? "",
                            Type: "default",
                            IsDefault: true,
                          },
                        ],
                        LayOverDuration: hours * 60 + minutes,
                        Code: flightItem.departFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension: [
                          {
                            key: "cabinClass",
                            value: flightItem.departClass,
                          },
                          {
                            key: "durationHours",
                            value:
                              flightItem.departDurationH !== ""
                                ? parseInt(
                                  flightItem.departDurationH
                                )
                                : "0",
                          },
                          {
                            key: "durationMinutes",
                            value:
                              flightItem.departDurationM !== ""
                                ? parseInt(
                                  flightItem.departDurationM
                                )
                                : "0",
                          },
                        ],
                        "LocationInfo": {
                          "FromLocation": {
                            "ID": flightItem.stopLocation || "Unnamed",
                            "Name": flightItem.stopLocation || "Unnamed",
                            "CountryID": flightItem.fromLocation || "Unnamed",
                            "Country": flightItem.fromLocationCity || "Unnamed",
                            "City": flightItem.fromLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                          "ToLocation": {
                            "ID": toLocation || "Unnamed",
                            "Name": toLocation || "Unnamed",
                            "CountryID": toLocation || "Unnamed",
                            "Country": flightItem.toLocationCity || "Unnamed",
                            "City": flightItem.toLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                        },
                        "dateInfo": {
                          startDate:
                            moment(flightItem.startDate).format("YYYY-MM-DD") +
                            "T" +
                            (flightItem.departStartTime !== ""
                              ? flightItem.departStartTime + ":00"
                              : "00:00:00"),
                          endDate:
                            (moment(item.departStops.length - 1 === index
                              ? item.departEndDate
                              : item.departStops[0].endDate).format("YYYY-MM-DD"))
                            + "T" +
                            (item.departStops.length - 1 === index
                              ? (item.departEndTime !== ""
                                ? item.departEndTime + ":00"
                                : "00:00:00")
                              : (item.departStops[index + 1].departEndTime === ''
                                ? '00:00'
                                : item.departStops[index + 1].departEndTime) + ":00"
                            ),
                        },
                      }
                    }),
                  ].filter(Boolean).flatMap((x) => x),
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
              Amount: item.sellPrice !== "" ? item.sellPrice : 0,
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
                  Name: item.fromLocation || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocationCity || "Unnamed",
                  City: item.fromLocationCity || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocation || "Unnamed",
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
                item.departStops !== ""
                  ? Array.isArray(item.departStops)
                    ? item.departStops.length
                    : item.departStops
                  : 0,
                item.returnStops !== ""
                  ? Array.isArray(item.returnStops)
                    ? item.returnStops.length
                    : item.returnStops
                  : 0,
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
                      Name: item.fromLocation || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocation || "Unnamed",
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
                      LocationInfo: {
                        FromLocation: {
                          ID: item.fromLocation || "Unnamed",
                          Name: item.fromLocation || "Unnamed",
                          CountryID: item.fromLocation || "Unnamed",
                          Country: item.fromLocationCity || "Unnamed",
                          City: item.fromLocationCity || "Unnamed",
                          Type: "Location",
                        },
                        ToLocation: {
                          ID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          Name: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          CountryID: (Array.isArray(item.departStops) && item.departStops.length > 0 ? item.departStops[0].stopLocation : item.toLocation) || "Unnamed",
                          Country: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
                          City: (Array.isArray(item.departStops) && item.departStops.length > 0 ? "" : item.toLocationCity) || "Unnamed",
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
                          (moment(Array.isArray(item.departStops) && item.departStops.length > 0
                            ? item.departStops[0].endDate
                            : item.departEndDate).format("YYYY-MM-DD")) +
                          "T" +
                          (Array.isArray(item.departStops) && item.departStops.length > 0
                            ? (item.departStops[0].departEndTime === '' ? '00:00' : item.departStops[0].departEndTime) + ":00"
                            : (item.departEndTime !== ""
                              ? item.departEndTime + ":00"
                              : "00:00:00")),
                      },
                    },
                    Array.isArray(item.departStops) && item.departStops.map((flightItem, index, array) => {
                      let toLocation = "";
                      let hours = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]) === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]);
                      let minutes = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]) === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]);
                      if (array.length === 1) {
                        toLocation = item.toLocation;
                      }
                      else if (array.length > index + 1) {
                        toLocation = array[index + 1].stopLocation;
                      }
                      else
                        toLocation = item.toLocation;
                      return {
                        journeyDuration: flightItem.totaldepartDuration ?? 0,
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                        ],
                        images: [
                          {
                            URL: flightItem.departImg ?? "",
                            Type: "default",
                            IsDefault: true,
                          },
                        ],
                        LayOverDuration: hours * 60 + minutes,
                        Code: flightItem.departFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension: [
                          {
                            key: "cabinClass",
                            value: flightItem.departClass,
                          },
                          {
                            key: "durationHours",
                            value:
                              flightItem.departDurationH !== ""
                                ? parseInt(
                                  flightItem.departDurationH
                                )
                                : "0",
                          },
                          {
                            key: "durationMinutes",
                            value:
                              flightItem.departDurationM !== ""
                                ? parseInt(
                                  flightItem.departDurationM
                                )
                                : "0",
                          },
                        ],
                        "LocationInfo": {
                          "FromLocation": {
                            "ID": flightItem.stopLocation || "Unnamed",
                            "Name": flightItem.stopLocation || "Unnamed",
                            "CountryID": flightItem.fromLocation || "Unnamed",
                            "Country": flightItem.fromLocationCity || "Unnamed",
                            "City": flightItem.fromLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                          "ToLocation": {
                            "ID": toLocation || "Unnamed",
                            "Name": toLocation || "Unnamed",
                            "CountryID": toLocation || "Unnamed",
                            "Country": flightItem.toLocationCity || "Unnamed",
                            "City": flightItem.toLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                        },
                        "dateInfo": {
                          startDate:
                            moment(flightItem.startDate).format("YYYY-MM-DD") +
                            "T" +
                            (flightItem.departStartTime !== ""
                              ? flightItem.departStartTime + ":00"
                              : "00:00:00"),
                          endDate:
                            (moment(item.departStops.length - 1 === index
                              ? item.departEndDate
                              : item.departStops[0].endDate).format("YYYY-MM-DD"))
                            + "T" +
                            (item.departStops.length - 1 === index
                              ? (item.departEndTime !== ""
                                ? item.departEndTime + ":00"
                                : "00:00:00")
                              : (item.departStops[index + 1].departEndTime === '' ? '00:00' : item.departStops[index + 1].departEndTime) + ":00"
                            ),
                        },
                      }
                    }),
                  ].filter(Boolean).flatMap((x) => x),
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
                      Name: item.toLocation || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocation || "Unnamed",
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
                      "LocationInfo": {
                        "FromLocation": {
                          "ID": item.toLocation || "Unnamed",
                          "Name": item.toLocation || "Unnamed",
                          "CountryID": item.toLocation || "Unnamed",
                          "Country": item.toLocationCity || "Unnamed",
                          "City": item.toLocationCity || "Unnamed",
                          "Type": "Location",
                        },
                        "ToLocation": {
                          "ID": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                          "Name": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                          "CountryID": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].stopLocation : item.fromLocation) || "Unnamed",
                          "Country": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? "" : item.fromLocationCity) || "Unnamed",
                          "City": (Array.isArray(item.returnStops) && item.returnStops.length > 0 ? "" : item.fromLocationCity) || "Unnamed",
                          "Type": "Location",
                        },
                      },

                      "dateInfo": {
                        "startDate":
                          moment(item.returnStartDate).format("YYYY-MM-DD") +
                          "T" +
                          (item.returnStartTime !== ""
                            ? item.returnStartTime + ":00"
                            : "00:00:00"),
                        "endDate":
                          moment(Array.isArray(item.returnStops) && item.returnStops.length > 0 ? item.returnStops[0].endDate : item.returnEndDate).format("YYYY-MM-DD") +
                          "T" +
                          (Array.isArray(item.returnStops) && item.returnStops.length > 0
                            ? (item.returnStops[0].departEndTime === '' ? '00:00' : item.returnStops[0].departEndTime) + ":00"
                            : (item.returnEndTime !== ""
                              ? item.returnEndTime + ":00"
                              : "00:00:00")),
                      },
                    },
                    Array.isArray(item.returnStops) && item.returnStops.map((flightItem, index, array) => {
                      let toLocation = "";
                      let hours = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]) === "" ? 0 : parseInt(flightItem.layOverTime.split('h')[0]);
                      let minutes = flightItem.layOverTime === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]) === "" ? 0 : parseInt(flightItem.layOverTime.split(' ')[1]);
                      if (array.length === 1) {
                        toLocation = item.fromLocation;
                      }
                      else if (array.length > index + 1) {
                        toLocation = array[index + 1].stopLocation;
                      }
                      else
                        toLocation = item.fromLocation;
                      return {
                        journeyDuration: flightItem.totalreturnDuration ?? 0,
                        vendors: [
                          {
                            type: "airline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                          {
                            type: "operatingAirline",
                            item: {
                              code: "6E",
                              name: flightItem.departAirlineName,
                            },
                          },
                        ],
                        images: [
                          {
                            URL: flightItem.departImg ?? "",
                            Type: "default",
                            IsDefault: true,
                          },
                        ],
                        LayOverDuration: hours * 60 + minutes,
                        Code: flightItem.departFlightNumber,
                        business: "air",
                        objectIdentifier: "flight",
                        tpExtension: [
                          {
                            key: "cabinClass",
                            value: flightItem.departClass,
                          },
                          {
                            key: "durationHours",
                            value:
                              flightItem.departDurationH !== ""
                                ? parseInt(
                                  flightItem.departDurationH
                                )
                                : "0",
                          },
                          {
                            key: "durationMinutes",
                            value:
                              flightItem.departDurationM !== ""
                                ? parseInt(
                                  flightItem.departDurationM
                                )
                                : "0",
                          },
                        ],
                        "LocationInfo": {
                          "FromLocation": {
                            "ID": flightItem.stopLocation || "Unnamed",
                            "Name": flightItem.stopLocation || "Unnamed",
                            "CountryID": flightItem.fromLocation || "Unnamed",
                            "Country": flightItem.fromLocationCity || "Unnamed",
                            "City": flightItem.fromLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                          "ToLocation": {
                            "ID": toLocation || "Unnamed",
                            "Name": toLocation || "Unnamed",
                            "CountryID": toLocation || "Unnamed",
                            "Country": flightItem.toLocationCity || "Unnamed",
                            "City": flightItem.toLocationCity || "Unnamed",
                            "Type": "Location",
                          },
                        },
                        "dateInfo": {
                          startDate:
                            moment(flightItem.startDate).format("YYYY-MM-DD") +
                            "T" +
                            (flightItem.departStartTime !== ""
                              ? flightItem.departStartTime + ":00"
                              : "00:00:00"),
                          endDate:
                            (moment(item.returnStops.length - 1 === index
                              ? item.returnEndDate
                              : item.returnStops[0].endDate).format("YYYY-MM-DD"))
                            + "T" +
                            (item.returnStops.length - 1 === index
                              ? (item.returnEndTime !== ""
                                ? item.returnEndTime + ":00"
                                : "00:00:00")
                              : (item.returnStops[index + 1].departEndTime === '' ? '00:00' : item.returnStops[index + 1].departEndTime) + ":00"
                            ),
                        },
                      }
                    }),
                  ].filter(Boolean).flatMap((x) => x),
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
            Amount: item.sellPrice !== "" ? item.sellPrice : 0,
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
            Amount: Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : 0),
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
            Amount: item.sellPrice !== "" ? item.sellPrice : 0,
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
    } else if (business === "package") {
      const quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));
      return [{
        ManualItem: {
          business: "package",
          objectIdentifier: "package",
          Name: quotationDetails.title, // item.name && item.name !== "" ? item.name : "Unnamed",
          Description: '',
          Amount: item.sellPrice !== "" ? item.sellPrice : 0,
          CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
          dateInfo: {
            startDate: moment(quotationDetails.startDate).format("YYYY-MM-DD"),
            endDate: moment(quotationDetails.endDate).format("YYYY-MM-DD"),
          },
          images: item.smallImagePath
            ? [
              {
                URL: item.smallImagePath,
                Type: "default",
                IsDefault: true,
              },
            ]
            : [],
          TPExtension: [
            {
              Key: "duration",
              Value: moment(quotationDetails.endDate).diff(moment(quotationDetails.startDate), "days"),
            },
          ],
          paxInfo: [
            {
              typeString: "ADT",
              quantity: 1, //item.guests && item.guests !== "" ? item.guests : "1"
              type: 0,
            },
          ],
          CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
          LocationInfo: {
            FromLocation: {
              ID: "Unnamed",
              City: "",
              Name: "",
              CountryID: "IN",
              Type: "Location",
              Priority: 1,
            },
          },
          vendors: [
            {
              item: {
                name: "ManualPackageBookingProvider"
              },
            },
          ],
          config: this.getbrnconfig(item),
          items: [
            {
              item: [
                {
                  name: quotationDetails.packageName,
                  business: "package",
                  objectIdentifier: "packageOption",
                },
              ],
            },
          ],
        },
      }]
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
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.type === "Quotation" ? "QuotationDetails~quotation-edit-item" : "IitineraryDetails~itineraries-edit-item"))) {
      //this.handleItemDelete(item);
      //localStorage.setItem("edititemuuid",item.offlineItem)
      this.addItem({ itemDtlEdit: item.offlineItem });
    }
    else {
      this.setState({ isshowauthorizepopup: true });
    }
  };
  componentDidMount = () => {
    this.getCountry();
    let type = this.props.match.path.toLowerCase().split("/").includes("itinerary") ? "Itinerary" : "Quotation";
    let roleName = type === "Itinerary" ? "dashboard-menu~itineraries-manage-itineraries" : "dashboard-menu~quotation-manage-quotation";
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, roleName)) {
      this.props.history.push('/');
    }
    const { mode } = this.props.match.params;
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    (mode === "Create" || mode === "CreateQuick") && this.resetQuotation();
    if (mode !== "Create" && mode !== "CreateQuick") {
      let quotationInfoforquick = JSON.parse(localStorage.getItem("quotationDetails"));
      let isQuickProposal = quotationInfoforquick?.isQuickProposal ?? false;
      this.setState({ isQuickProposal });
    }
    //this.getEmployees();
    //this.getAuthToken();
  };
  // getEmployees() {
  //   let reqOBJ = { Request: { IsActive: true, PageNumber: 0, PageSize: 0 } };
  //   let reqURL = "admin/employee/list";
  //   apiRequester_unified_api(
  //     reqURL,
  //     reqOBJ,
  //     function (data) {
  //       if (data.error) {
  //         data.response = [];
  //       }
  //       if (data.response.length > 0) {
  //         let employeesOptions = data.response.map(item => {
  //           return {
  //             label: item.fullName ?? item.firstName + " " + item.lastName,
  //             value: item.userID,
  //             isLoggedinEmployee: item.isLoggedinEmployee,
  //           }
  //         });

  //         //let stateData = this.state.data;
  //         //stateData.userID = employeesOptions.find(x => x.isLoggedinEmployee).value;
  //         this.setState({ employeesOptions, isLoadingEmployees: false })
  //       }
  //       else {
  //         this.setState({ employeesOptions: [], isLoadingEmployees: false })
  //       }
  //     }.bind(this),
  //     "POST"
  //   );
  // }
  shareQuatationDetails = () => {
    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
        const whatsappNumber = quotationInfo === null ? '' : quotationInfo.phone;
        let cartLocalId = localStorage.getItem("cartLocalId");
        let whatsappMessage = data.response[0].customHomeURL.toLowerCase().replace("http://", "https://") + "/EmailView/" + cartLocalId;
        window.open(`https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`, "_blank");
      }, 'GET');
  }
  handleAssistant = () => {
    let isAssistant = this.state.isAssistant;
    this.setState({ isAssistant: !isAssistant })
  }
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
  handlequickproposal = () => {
    let items = this.state.items;
    if (!this.state.isQuickProposal === false) {
      localStorage.removeItem('quotationItems');
      items = [];
      this.saveQuotation(false);
    }
    this.setState({ isQuickProposal: !this.state.isQuickProposal, items });
  }
  handleInvoice = () => {
    let genrateInvoiceData = localStorage.getItem('quotationDetails');
    let genrateInvoiceItemData = localStorage.getItem('quotationItems');
    localStorage.setItem("QuickProposalData", genrateInvoiceData);
    localStorage.setItem("QuickProposalItemData", genrateInvoiceItemData);
    this.props.history.push("/manualinvoice/quickProposal");
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
      selectedItemValidationMsg,
      ipCountryName
    } = this.state;
    let isQuickProposal = this.state.isQuickProposal;
    const { mode } = this.props.match.params;
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    // if (mode === "DetailsInquiry" && quotationInfo.isQuickproposal === true) {
    //   quotationInfo.isQuickproposal = true;
    //   isQuickProposal = true
    // }
    const { userInfo } = this.props;
    return (
      <div className="quotation">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {(mode === "Create" || mode === "CreateQuick")
                ? type === "Itinerary"
                  ? localStorage.getItem("isUmrahPortal")
                    ? "Create Package"
                    : "Create Itinerary"
                  : Trans("_createQuotation").replace("##Quotation##", (mode === "CreateQuick" ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")))
                : mode === "Edit"
                  ? type === "Itinerary"
                    ? "Edit Itinerary"
                    : "Edit " + Trans("_quotationReplaceKey")
                  : type === "Itinerary"
                    ? mode !== "DetailsInquiry"
                      ? "Itinerary Details"
                      : "Inquiry Details"
                    : Trans("_quotationReplaceKey") + " Details"}
            </title>
          </Helmet>
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <h1 className="text-white m-0 p-0 f30">
                  <SVGIcon
                    name="file-text"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGIcon>
                  {(mode === "Create" || mode === "CreateQuick")
                    ? type === "Itinerary"
                      ? localStorage.getItem("isUmrahPortal")
                        ? "Create Package"
                        : "Create Itinerary"
                      : Trans("_createQuotation").replace("##Quotation##", (mode === "CreateQuick" ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")))
                    : mode === "Edit"
                      ? type === "Itinerary"
                        ? "Edit Itinerary"
                        : "Edit " + Trans("_quotationReplaceKey")
                      : type === "Itinerary"
                        ? mode !== "DetailsInquiry"
                          ? "Itinerary Details"
                          : "Inquiry Details"
                        : (isQuickProposal ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")) + " Details"}


                </h1>
              </div>
              <div className="col-lg-3 d-flex justify-content-end">
                {type === "Quotation" && mode !== "DetailsInquiry" && (
                  <>
                    <AuthorizeComponent
                      title="ai-assistant~button"
                      type="button"
                      rolepermissions={this.props.userInfo.rolePermissions}>
                      {mode !== "Create" &&
                        <button
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => this.handleAssistant()}
                        >
                          Your AI Assistant
                        </button>
                      }
                    </AuthorizeComponent>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => this.props.history.push(`/QuotationList`)}
                    >
                      {localStorage.getItem("portalType") === "B2C"
                        ? "My " + (Trans("_quotationReplaceKey"))
                        : Trans("_manageQuotation").replace("##Quotation##", Trans("_quotationReplaceKeys"))}
                    </button>
                  </>
                )}

                {type === "Itinerary" &&
                  mode !== "DetailsInquiry" &&
                  !localStorage.getItem("isUmrahPortal") && (
                    <>
                      <AuthorizeComponent
                        title="ai-assistant~button"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}>
                        {mode !== "Create" &&
                          <button
                            className="btn btn-sm btn-primary mr-2"
                            onClick={() => this.handleAssistant()}
                          >
                            Your AI Assistant
                          </button>
                        }
                      </AuthorizeComponent>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => this.props.history.push(`/ItineraryList`)}
                      >
                        {localStorage.getItem("portalType") === "B2C"
                          ? "My Itineraries"
                          : Trans("_manageItineraries")}
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
          {(mode === "Create" || mode === "CreateQuick") && (
            <QuotationCreate
              type={type}
              handleCreate={this.generateQuotation}
              handleDateChange={this.props.setDate}
              isErrorMsg={this.state.isErrorMsg}
              isBtnLoading={this.state.isBtnLoading}
              mode={mode}
              //employeesOptions={this.state.employeesOptions}
              history={this.props.history}
              userInfo={this.props.userInfo}
              isquickpropo={isQuickProposal}
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
              userInfo={this.props.userInfo}
              isquickpropo={isQuickProposal}
              //employeesOptions={this.state.employeesOptions}
              childRef={this.childRef}
            />
          )}

          {(mode === "Details" ||
            mode === "Edit" ||
            mode === "DetailsInquiry" ||
            mode === "CreateQuick"
          ) && (
              <React.Fragment>
                {(mode !== "CreateQuick" && mode !== "Edit") &&
                  <Quotationinfo
                    type={type}
                    {...quotationInfo}
                    handleEdit={this.handleEdit}
                    userInfo={this.props.userInfo}
                    handlequickproposal={this.handlequickproposal}
                    rdoquickproposal={this.state.isQuickProposal}
                    isquickpropo={isQuickProposal}
                    mode={mode}
                  />
                }
                {!isQuickProposal &&
                  <AuthorizeComponent
                    title={type === "Quotation" ? "dashboard-menu~quotation-create-quotation" : "dashboard-menu~itineraries-create-itineraries"}
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
                }

                {isQuickProposal &&
                  <QuotationDetails
                    key={"detailsKey" + detailsKey}
                    items={items}
                    type={type}
                    handleItemDelete={this.handleItemDelete}
                    handleItemEdit={this.handleItemEdit}
                    userInfo={this.props.userInfo}
                    savetermsconditions={this.saveTermsConditions}
                    getselecteditemsBook={this.getselecteditemsBook}
                    savequot={this.saveQuotation}
                    isQuickProposal={isQuickProposal}
                    mode={mode}
                    {...quotationInfo}
                    detailsRef={this.detailsRef}
                  />
                }

                {(type === "Quotation") && (
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

                    {(items.length > 0 || isQuickProposal) && (
                      <React.Fragment>
                        {!isQuickProposal &&
                          <QuotationDetails
                            key={"detailsKey" + detailsKey}
                            items={items}
                            type={type}
                            handleItemDelete={this.handleItemDelete}
                            handleItemEdit={this.handleItemEdit}
                            userInfo={this.props.userInfo}
                            savetermsconditions={this.saveTermsConditions}
                            getselecteditemsBook={this.getselecteditemsBook}
                            detailsRef={this.detailsRef}
                          />
                        }
                        {!isQuickProposal && selectedItemValidationMsg !== '' &&
                          <div className="alert alert-box alert-danger">
                            <span>{selectedItemValidationMsg}</span>
                          </div>}

                        <div className="quotation-action-buttons mt-4 text-center">
                          {!isQuickProposal &&
                            <AuthorizeComponent
                              title="QuotationDetails~quotation-preview-quotation"
                              type="button"
                              rolepermissions={this.props.userInfo.rolePermissions}
                            >
                              <button
                                onClick={this.viewDetailsMode}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2"
                              >
                                Preview {Trans("_quotationReplaceKey")}
                              </button>
                            </AuthorizeComponent>
                          }
                          {isQuickProposal &&
                            <React.Fragment>
                              <AuthorizeComponent
                                title="dashboard-menu~quotation-create-quotation"
                                type="button"
                                rolepermissions={this.props.userInfo.rolePermissions}
                              >
                                {this.state.isBtnLoading ? <button
                                  className="btn btn-sm btn-outline-primary ml-2 mr-2"
                                >
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Save Quick Proposal
                                </button> :
                                  <button
                                    onClick={(e) => (mode === "CreateQuick" ? this.createCart() : this.saveQuotation(false))}
                                    className="btn btn-sm btn-outline-primary ml-2 mr-2"
                                  >
                                    Save Quick Proposal
                                  </button>
                                }
                              </AuthorizeComponent>
                              {mode !== "CreateQuick" &&
                                <AuthorizeComponent
                                  title="QuotationDetails~quotation-preview-quotation"
                                  type="button"
                                  rolepermissions={this.props.userInfo.rolePermissions}
                                >
                                  <button
                                    onClick={this.viewDetailsMode}
                                    className="btn btn-sm btn-outline-primary ml-2 mr-2"
                                  >
                                    Preview Quick {Trans("_quotationReplaceKey")}
                                  </button>
                                </AuthorizeComponent>
                              }
                            </React.Fragment>
                          }
                          {mode !== "CreateQuick" &&
                            <AuthorizeComponent
                              title="QuotationDetails~quotation-send-quotation"
                              type="button"
                              rolepermissions={this.props.userInfo.rolePermissions}
                            >
                              <button
                                className="btn btn-sm btn-outline-primary ml-2 mr-2"
                                onClick={this.sendEmail}
                              >
                                {Trans("_sendQuotation").replace("##Quotation##", isQuickProposal ? Trans("Quick Proposal") : Trans("_quotationReplaceKey"))}
                              </button>
                            </AuthorizeComponent>
                          }
                          {isQuickProposal && mode !== "CreateQuick" && quotationInfo.status.toLowerCase() !== "booked" &&
                            <AuthorizeComponent
                              title="QuotationDetails~quotation-book-quotation"
                              type="button"
                              rolepermissions={this.props.userInfo.rolePermissions}
                            >
                              <button
                                onClick={(e) => this.handleInvoice()}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2"
                              >
                                Generate Invoice
                              </button>
                            </AuthorizeComponent>
                          }
                          {!this.state.isQuickProposal && quotationInfo.status.toLowerCase() !== "booked" &&
                            <AuthorizeComponent
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
                            </AuthorizeComponent>
                          }
                          {!this.state.isQuickProposal && quotationInfo.status.toLowerCase() === "booked" &&
                            <React.Fragment>
                              <button
                                className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                              >
                                {quotationInfo.status.toLowerCase() === "booked" ? "Already Booked" : "Generate Invoice"}
                              </button>
                            </React.Fragment>}
                          {!this.state.isQuickProposal &&
                            <AuthorizeComponent
                              title="QuotationDetails~quotation-share-whatsapp"
                              type="button"
                              rolepermissions={this.props.userInfo.rolePermissions}
                            >
                              <button
                                // href={window.innerWidth <= 768 ? "https://wa.me/918976939231" : "https://web.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + whatsappMessage}
                                target="_blank"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "QuotationDetails~quotation-share-whatsapp") ? this.shareQuatationDetails() : this.setState({ isshowauthorizepopup: true })}
                                className="btn btn-sm btn-outline-success ml-2 mr-2">
                                <img src={SocialMediaWhatsappWhite} alt="Whatsapp" style={{ width: "18px" }} />&nbsp; Share on Whatsapp
                              </button>
                            </AuthorizeComponent>
                          }
                        </div>

                        {isEmail && (
                          <QuotationEmail
                            {...this.props}
                            {...quotationInfo}
                            saveQuotation={this.saveQuotation}
                            sendEmail={this.sendEmail}
                            items={items}
                            type={type}
                            isquickpropo={isQuickProposal}
                          />
                        )}
                      </React.Fragment>
                    )}
                    {localStorage.getItem("portalType") === "B2C" &&
                      type === "Quotation" &&
                      items.length === 0 && (
                        <div className="text-center mt-4">
                          <b>No Item(s) added.</b>
                        </div>
                      )}
                  </React.Fragment>
                )}

                {type === "Itinerary" && (
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
                        title="ItineraryDetails~itineraries-preview-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >
                        {this.state.items.length > 0 ? <button
                          onClick={this.viewDetailsMode}
                          className="btn btn-sm btn-outline-primary ml-2 mr-2"
                        >
                          Preview Itinerary
                        </button> : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          Preview Itinerary
                        </button>}

                      </AuthorizeComponent>
                      <AuthorizeComponent
                        title="IitineraryDetails~itineraries-send-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >{this.state.items.length > 0 ?
                        <button
                          className="btn btn-sm btn-outline-primary ml-2 mr-2"
                          onClick={this.sendEmail}
                        >
                          {Trans("Send Itinerary")}
                        </button> : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          {Trans("Send Itinerary")}
                        </button>}
                      </AuthorizeComponent>
                      <AuthorizeComponent
                        title="ItineraryDetails~itineraries-book-itineraries"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >{this.state.items.length > 0 && quotationInfo.status.toLowerCase() !== "booked" ?
                        !isBtnLoadingBookItinerary ? (
                          <button
                            onClick={this.bookQuotationManually}
                            className="btn btn-sm btn-outline-primary ml-2 mr-2"
                          >
                            {quotationInfo.status.toLowerCase() === "booked" ? "Already Booked" : "Generate Invoice"}
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-primary ml-2 mr-2">
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                            {quotationInfo.status.toLowerCase() === "booked" ? "Already Booked" : "Generate Invoice"}
                          </button>
                        ) : <button
                          className="btn btn-sm btn-outline-secondary ml-2 mr-2"
                        >
                          {quotationInfo.status.toLowerCase() === "booked" ? "Already Booked" : "Generate Invoice"}
                        </button>}
                      </AuthorizeComponent>
                      <AuthorizeComponent
                        title="ItineraryDetails~itineraries-share-whatsapp"
                        type="button"
                        rolepermissions={this.props.userInfo.rolePermissions}
                      >
                        <button
                          // href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + whatsappMessage}
                          target="_blank"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ItineraryDetails~itineraries-share-whatsapp") ? this.shareQuatationDetails() : this.setState({ isshowauthorizepopup: true })}
                          className="btn btn-sm btn-outline-success ml-2 mr-2">
                          <img src={SocialMediaWhatsappWhite} alt="Whatsapp" style={{ width: "18px" }} />&nbsp; Share on Whatsapp
                        </button>
                      </AuthorizeComponent>
                      <AuthorizeComponent
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
                      </AuthorizeComponent>
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

        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}

        {this.state.isshowauthorizepopup &&
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
        {this.state.showMessageBar &&
          <MessageBar Message={this.state.SucessMsg} handleClose={() => { this.closesMessageBar() }
          } />
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
export default Quotation;

const defaultPackagePricingData = {
  business: "package",
  fromLocation: "",
  fromLocationName: "",
  fromLocationCity: "",
  toLocation: "",
  toLocationName: "",
  toLocationCity: "",
  name: "",
  startDate: moment().add(1, "days").format('YYYY-MM-DD'),
  endDate: "",
  costPrice: "0",
  sellPrice: "0",
  vendor: "",
  brn: "",
  itemType: "",
  noRooms: "",
  rating: "",
  duration: "",
  guests: "",
  adult: "",
  child: "",
  infant: "",
  pickupType: "",
  dropoffType: "",
  pickupTime: "",
  departStartDate: "",
  departEndDate: "",
  departStartTime: "",
  departEndTime: "",
  departAirlineName: "",
  departFlightNumber: "",
  departClass: "",
  departStops: "",
  departDurationH: "",
  departDurationM: "",
  totaldepartduration: "",
  returnStartDate: "",
  returnEndDate: "",
  returnStartTime: "",
  returnEndTime: "",
  returnAirlineName: "",
  returnFlightNumber: "",
  returnClass: "",
  returnStops: "",
  totalreturnDuration: "",
  returnDurationH: "",
  returnDurationM: "",
  isRoundTrip: true,
  uuid: "",
  day: 1,
  toDay: 1,
  nights: 1,
  hotelPaxInfo: [
    {
      roomID: 1,
      noOfAdults: 2,
      noOfChild: 0,
      roomType: "",
      childAge: []
    }
  ],
  dayDepart: 1,
  dayDepartEnd: 1,
  dayReturn: 1,
  dayReturnEnd: 1,
  dates: {
    checkInDate: moment()
      .add(Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1, 'days')
      .format(Global.DateFormate),
    checkOutDate: moment()
      .add(Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1
        + Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.stayInDays ?? 1, 'days')
      .format(Global.DateFormate)
  },
  datesIsValid: "valid",
  cutOffDays: Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.cutOffDays ?? 1,
  stayInDays: Global.getEnvironmetKeyValue("availableBusinesses")?.find((x) => x.name === 'package')?.stayInDays ?? 1,
  description: "",
  supplierCurrency: "",
  conversionRate: "",
  bookBefore: "",
  supplierCostPrice: "",
  supplierTaxPrice: "",
  markupPrice: "",
  discountPrice: "",
  CGSTPrice: 0,
  IGSTPrice: 0,
  SGSTPrice: 0,
  amountWithoutGST: 0,
  isInclusive: false,
  percentage: (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
  processingFees: 0,
  tax1: 0,
  tax2: 0,
  tax3: 0,
  tax4: 0,
  tax5: 0,
  taxType: "CGSTSGST",
  totalAmount: 0,
  mealType: "",
  hotelContactNumber: "",
  isShowTax: false,
  isSellPriceReadonly: false,
  tpExtension: [],
  customitemType: "",
  otherType: "",
  type: "Quotation",
  ImageName: 'Select Image',
  ImageUrl: '',
  ImgExtension: '',
  isTax1Modified: false,
  isTax2Modified: false,
  isTax3Modified: false,
  isTax4Modified: false,
  isTax5Modified: false,
};