import React from "react";
import { Link } from "react-scroll";
import Form from "../components/common/form";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Loader from "../components/common/loader";
import MessageBar from "../components/admin/message-bar";
import * as Global from "../helpers/global";
import moment from "moment";
import SVGIcon from "../helpers/svg-icon";
import FileBase64 from "../components/common/FileBase64";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
import AuthorizeComponent from "../components/common/authorize-component";
import CallCenter from "../components/call-center/quotation-call-center";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import PackageAssistant from "./package-assistant";
import PackageAssistantHeader from "./package-assistant-header";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAssistantFooter from "./package-assistant-footer";
import PackageAIAssitant from "./package-ai-assistant";

class DealsPartnerForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
      portalURL: "",
      isCMSPortalCreated: false,
      packageLargeImages: [],
      packageBrochure: [],
      providerID: this.props.userInfo.portalAgentID,
      mode: this.props.match.params.mode.toLowerCase(),
      showSuccessMessage: false,
      isLoading: false,
      isEditModeLoading: false,
      errors: {},
      CountryList: [],
      LoadingCountryList: false,
      StateList: [],
      LoadingStateList: false,
      CityList: [],
      LoadingCityList: false,
      CurrencyList: [],
      LoadingCurrencyList: false,
      isShowExtraFields: true,
      data: {
        siteURL: "preprod-portaltest608.mytriponline.tech",
        countryID: "",
        cityID: "",
        stateID: "",
        validFrom: moment().add(0, "d").format(Global.DateFormate),
        validTo: moment().add(5, "d").format(Global.DateFormate),
        packageName: "",
        summaryDescription: "",
        description: "",
        termsConditions: "",
        price: "",
        currencyID: "",
        isShowOnHomePage: false,
        packageThemes: 3,
        cultureCode: "en-US",
        Duration: 0,
        offerPrice: "",
        rating: 0,
        agentId: this.props.userInfo.agentID,
        userId: this.props.userInfo.agentID,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        images: [],
        inclusionExclusion: [],
        exclusion: "",
        inclusion: "",
        imagesURL: [],
        packageBrochure: [],
        supplierCurrency: "",
        conversionRate: "",
        supplierCostPrice: "",
        supplierTaxPrice: "",
        costPrice: "0",
        markupPrice: "",
        discountPrice: "",
        CGSTPrice: "",
        SGSTPrice: "",
        IGSTPrice: "",
        brn: "",
        bookBefore: "",
        twPriceGuideLine: "",
        isSellPriceReadonly: false,
        isShowOnMarketPlace: true,
      },
      sampleImageObj: {
        fileExtension: "",
        fileContentType: "",
        fileData: "",
        fileName: "",
      },
      activeTab: "Overview",
      activePoint: "",
      isAssistant: false,
      assistantInput: '',
      assistantResponse: '',
      pasteFromAI: '',
      isShowAdvancedPricing: false,
    };
  }
  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleAmountFields = (value, e) => {
    let data = this.state.data;
    let costPrice = 0;
    let tmpSellPrice = data.price;

    let conversionRate = isNaN(Number(data.conversionRate))
      ? 1
      : data.conversionRate === ""
        ? 1
        : Number(data.conversionRate);
    let supplierTaxPrice = isNaN(Number(data.supplierTaxPrice))
      ? 0
      : Number(data.supplierTaxPrice) * conversionRate;
    let supplierCostPrice = isNaN(Number(data.supplierCostPrice))
      ? 0
      : Number(data.supplierCostPrice) * conversionRate;

    if (
      e.target.name === "conversionRate" ||
      e.target.name === "supplierTaxPrice" ||
      e.target.name === "supplierCostPrice"
    ) {
      costPrice = supplierCostPrice + supplierTaxPrice;
      data.costPrice = costPrice;
    }
    if (
      e.target.name !== "price" &&
      supplierTaxPrice === 0 &&
      supplierCostPrice === 0
    ) {
      data.costPrice = 0;
      costPrice = 0;
    }

    let markupPrice = isNaN(Number(data.markupPrice))
      ? 0
      : Number(data.markupPrice);
    let discountPrice = isNaN(Number(data.discountPrice))
      ? 0
      : Number(data.discountPrice);
    let CGSTPrice = isNaN(Number(data.CGSTPrice)) ? 0 : Number(data.CGSTPrice);
    let SGSTPrice = isNaN(Number(data.SGSTPrice)) ? 0 : Number(data.SGSTPrice);
    let IGSTPrice = isNaN(Number(data.IGSTPrice)) ? 0 : Number(data.IGSTPrice);
    let price = isNaN(Number(data.costPrice))
      ? 0
      : Number(data.costPrice) + markupPrice;
    price = price - discountPrice;
    price = price + CGSTPrice + SGSTPrice + IGSTPrice;
    data.price = price;

    data.isSellPriceReadonly =
      data.conversionRate ||
        data.supplierCostPrice ||
        data.supplierTaxPrice ||
        data.markupPrice ||
        data.discountPrice ||
        data.CGSTPrice ||
        data.SGSTPrice ||
        data.IGSTPrice
        ? true
        : false;
    if (!data.isSellPriceReadonly) {
      data.price = tmpSellPrice;
      data.costPrice = tmpSellPrice;
      costPrice = tmpSellPrice;
    }

    if (e.target.name === "price") data.costPrice = data.price;
    this.setState({ data });
  };
  validateBRN = (tmpBRN) => {
    const errors = {};
    const { data } = this.state;

    if (data.brn) {
      const quotationInfo = JSON.parse(localStorage.getItem("quotationItems"));
      if (
        quotationInfo &&
        quotationInfo.filter(
          (x) =>
            x.offlineItem.uuid !== this.state.data.uuid &&
            x.offlineItem.brn &&
            x.offlineItem.brn.toLowerCase() === tmpBRN.toLowerCase()
        ).length > 0
      )
        errors.brn =
          "Confirmation Number should be unique per " +
          (this.props.type === "Itinerary" ? "itinerary" : "quotation") +
          ".";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0 ? null : errors;
  };
  handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };
  getCurrencyList = () => {
    const { providerID, data } = this.state;
    const reqOBJ = {};
    let reqURL = "cms/package/getcurrency";
    this.setState({ LoadingBranchList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let currencyid = resonsedata.response.find((x) => x.currencyCode === Global.getEnvironmetKeyValue("portalCurrencyCode")).currencyID;
        data.currencyID = currencyid;
        this.setState({
          CurrencyList: resonsedata.response,
          LoadingCurrencyList: false,
          data
        });
      }.bind(this),
      "GET"
    );
  };

  getCountryList = (isLoadingEditMode) => {
    const { providerID } = this.state;
    let { data } = this.state;
    const reqOBJ = {
      request: {
      }
    };
    let reqURL = "admin/lookup/country";
    this.setState({ LoadingCountryList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
      this.setState({ CountryList: resonsedata.response, LoadingCountryList: false })
      if (isLoadingEditMode)
        this.getStateList(data.countryID, true);
    }.bind(this), "POST");
  }
  getStateList = (countryId, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode) {
      data.stateID = "";
      data.cityID = "";
    }
    if (countryId === "") {
      this.setState({ StateList: [], CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        countryID: countryId
      }
    };
    let reqURL = "admin/lookup/state";
    this.setState({ LoadingStateList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ StateList: resonsedata.response, CityList: [], data, LoadingStateList: false });
      if (isLoadingEditMode && data.stateID) {
        this.getCityList(data.stateID, true);
      }
    }.bind(this), "POST");
  }
  getCityList = (stateId, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode)
      data.cityID = "";
    if (stateId === "") {
      this.setState({ CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        stateID: stateId,
        countryID: data.countryID
      }
    };
    let reqURL = "admin/lookup/city";
    this.setState({ LoadingCityList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
    }.bind(this), "POST");
  }
  getBasicData = () => {
    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        this.setState({
          portalURL: data.response[0].customHomeURL.toLowerCase(),
          isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true",
        });
        // if (data.response[0].isCMSPortalCreated === "true") {
        //   this.getBranchList();
        // this.getCountryList();
        //   const { mode, id } = this.props.match.params;
        //   if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
        //     this.getPackageDetails(id);
        //   }
        //   this.setData();
        // }
      },
      "GET"
    );
  };
  componentDidMount() {
    this.getCountryList();
    this.getBasicData();
    this.getCurrencyList();
    this.setData();
    const { mode, id } = this.props.match.params;
    this.setState({ isEditModeLoading: mode.toLowerCase() === "edit" });
    if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
      this.getPackageDetails(id);
    }
    //this.getBasicData();
  }
  setData = () => {
    let { data } = this.state;

    let bookingForInfo = JSON.parse(sessionStorage.getItem("bookingForInfo"));

    data.customerName =
      this.props.match.params.mode === "Edit"
        ? data.twCustomerName
        : bookingForInfo && bookingForInfo.firstName
          ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
          : data.twCustomerName || "Demo customer marketplace";

    data.customerEmail =
      this.props.match.params.mode === "Edit"
        ? data.twCustomerEmail
        : bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.email
          : data.twCustomerEmail || "democustomermp@marketplace.com";

    data.customerPhone =
      this.props.match.params.mode === "Edit"
        ? data.twCustomerPhone
        : bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.phoneNumber
          : data.twCustomerPhone || "+91-1321321321";

    this.setState({ data });
  };
  getPackageDetails = (id) => {
    this.setState({ isLoading: true, isEditModeLoading: true });
    const reqOBJ = {};
    let reqURL =
      "cms/package/getbyid?id=" + id;
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let data = resonsedata.response.package[0];
        data.termsConditions = resonsedata.response.package[0].termsConditions;
        data.description = resonsedata.response.package[0].description;
        data.packageThemes = resonsedata.response.package[0].packagethemeid;
        data.packageName = resonsedata.response.package[0].shortDescription;
        data.cityID = (resonsedata.response.package[0].countryID != 101 && resonsedata.response.package[0].cityID == 8) ? "" : resonsedata.response.package[0].cityID;
        data.stateID = (resonsedata.response.package[0].countryID != 101 && resonsedata.response.package[0].stateID == 16) ? "" : resonsedata.response.package[0].stateID;
        data.countryID = resonsedata.response.package[0].countryID;
        data.duration = resonsedata.response.package[0].duration > 0 ? resonsedata.response.package[0].duration : "";
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
        data.inclusionExclusion = [];
        let htmlExclusion = '';

        let isMultiple = resonsedata.response.inclusionExclusion?.filter((x) => !x.isInclusion).length > 1 ? true : false;
        resonsedata.response.inclusionExclusion
          ?.filter((x) => !x.isInclusion)
          .forEach((item, index) => {

            htmlExclusion += (isMultiple ? `<li>${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "").replace("•\t", "")}</li>` : `${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "")}`);
          });

        if (htmlExclusion !== '') {
          var obj = {};
          obj["id"] = this.generateUUID();
          obj["isInclusion"] = false;
          obj["description"] = (isMultiple ? `<ul>${encode(htmlExclusion)}</ul>` : encode(htmlExclusion));
          obj["isDeleted"] = false;
          data.inclusionExclusion.push(obj);
        }
        let htmlInclusion = '';
        isMultiple = resonsedata.response.inclusionExclusion?.filter((x) => x.isInclusion).length > 1 ? true : false;
        resonsedata.response.inclusionExclusion
          ?.filter((x) => x.isInclusion)
          .forEach((item, index) => {
            htmlInclusion += (isMultiple ? `<li>${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "").replace("•\t", "")}</li>` : `${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "")}`);
          });
        if (htmlInclusion !== '') {
          var obj = {};
          obj["id"] = this.generateUUID();
          obj["isInclusion"] = true;
          obj["description"] = (isMultiple ? `<ul>${encode(htmlInclusion)}</ul>` : encode(htmlInclusion));// encode(`${htmlExclusion}`);
          obj["isDeleted"] = false;
          data.inclusionExclusion.push(obj);
        }

        // data.inclusionExclusion = resonsedata.response.inclusionExclusion.map(
        //   (item) => {
        //     item["id"] = item.inclusionExclusionID;
        //     item["isInclusion"] = item.isInclusion;
        //     item["description"] = "<![CDATA[" + item.shortDescription + "]]>";
        //     item["isDeleted"] = false;
        //     return item;
        //   }
        // );
        var obj = {};
        obj["imageid"] = 190824;
        obj["imagepath"] = resonsedata.response.package[0].smallImagePath;
        obj["isDefaultImage"] = true;
        obj["isDeleted"] = false;
        obj["id"] = resonsedata.response.package[0].smallImageID;
        obj["fileExtension"] = "jpg";
        obj["fileURL"] = resonsedata.response.package[0].smallImagePath;
        obj["portalID"] = resonsedata.response.package[0].portalID;
        obj["countryID"] = resonsedata.response.package[0].countryID;
        obj["stateID"] = resonsedata.response.package[0].stateID;
        obj["cityID"] = resonsedata.response.package[0].cityID;
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
          sessionStorage.getItem("bookingForInfo")
        );

        data.customerName =
          this.props.match.params.mode === "Edit"
            ? data.twCustomerName
            : bookingForInfo && bookingForInfo.firstName
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
          { data, isLoading: false, isEditModeLoading: false },
          () => {
            if (this.state.data["countryID"])
              //this.getCityList(this.state.data["countryID"], true);
              this.getStateList(this.state.data["countryID"], true);
          }
        );
      }.bind(this),
      "GET"
    );
  };
  validateInformation = () => {
    const errors = {};
    const { data, SelectedRoleID, mode } = this.state;

    if (!this.validateFormData(data.packageName, "require"))
      errors.packageName = "Package name required";
    if (data.packageName && !this.validateFormData(data.packageName, "special-characters-not-allowed", /[<>]/))
      errors.packageName = "< and > characters not allowed";

    let validFrom = moment(data.validFrom);
    let validTo = moment(data.validTo);
    if (validFrom.isAfter(validTo))
      errors.validTo =
        "Offer end date should not be greater than offer start date.";
    if (!this.validateFormData(data.summaryDescription, "require"))
      errors.summaryDescription = "Overview required";
    // if (data.summaryDescription && !this.validateFormData(data.summaryDescription, "special-characters-not-allowed", /[<>]/))
    //   errors.summaryDescription = "< and > characters not allowed";
    if (!this.validateFormData(data.description, "require"))
      errors.description = "Itinerary required";
    if (!this.validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";
    else if (!this.validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/))
      errors.customerName = "< and > characters not allowed";
    /* if (!this.validateFormData(data.customerEmail, "require"))
      errors.customerEmail = "Customer Email required"; 
      else */
    if (data.customerEmail && !this.validateFormData(data.customerEmail, "email"))
      errors.customerEmail = "Enter valid Email";

    if (!this.validateFormData(data.customerPhone, "require") || data.customerPhone === "1-" || data.customerPhone.split('-')[1] === "") errors.customerPhone = "Phone required";

    if (data.customerPhone && data.customerPhone !== "")
      if (!this.validateFormData(data.customerPhone, "phonenumber")) errors.customerPhone = "Invalid Contact Phone";

    if (data.customerPhone &&
      !this.validateFormData(data.customerPhone, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.customerPhone = Trans("_error_mobilenumber_phonenumber_length");
    if (
      (this.state.packageLargeImages.filter((x) => x.IsDefaultImage).length ===
        0 || this.state.packageLargeImages.filter((x) => x.IsDefaultImage && x.isDeleted).length ===
        1) &&
      (data.images.filter((x) => x.isDefaultImage).length === 0 || data.images.filter((x) => x.isDefaultImage && x.isDeleted).length === 1)
    )
      errors.LeadImage = "Featured Image Required.";
    if (data.isSellPriceReadonly && (isNaN(Number(data.costPrice)) || !isNaN(Number(data.costPrice)) && Number(data.costPrice) === 0)) {
      errors.costPrice = "Cost Price should not be 0";
    }
    else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0) {
      errors.costPrice = "Cost Price should not be less than 0";
    }
    else {
      delete Object.assign(errors)["costPrice"];
    }
    if (!isNaN(Number(data.price)) && Number(data.price) < 0) {
      errors.price = "Sell Price should not be less than 0";
    }
    else if (!isNaN(Number(data.price)) && Number(data.price) === 0) {
      errors.price = "Sell Price should not be 0";
    }
    else {
      delete Object.assign(errors)["price"];
    }
    // if (isNaN(Number(data.duration)) || Number(data.duration) < 0 || data.duration === "") {
    //   errors.duration = "Duration should not be less than 0";
    // }
    // else if (!isNaN(Number(data.duration)) && Number(data.duration) === 0) {
    //   errors.duration = "Duration should not be 0 or empty";
    // }
    // else {
    //   delete Object.assign(errors)["duration"];
    // }
    // if (!isNaN(Number(data.packageThemes)) && Number(data.packageThemes) < 1) {
    //   errors.packageThemes = "Package category required";
    // }
    // if (!this.validateFormData(data.specialPromotionType, "require"))
    //   errors.specialPromotionType = "Package type required";

    if (data.price && data.price !== "" && !this.validateFormData(data.price, "numeric")) errors.price = "Please enter sell price in decimal only";
    else if (data.price != "" && !isNaN(Number(data.price)) && Number(data.price) === 0) {
      errors.price = "Sell Price should not be 0";
    }
    else {
      delete Object.assign(errors)["price"];
    }
    if (data.conversionRate && data.conversionRate !== "" && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in decimal only";
    else {
      delete Object.assign(errors)["conversionRate"];
    }
    if (data.supplierCostPrice && data.supplierCostPrice !== "" && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in decimal only";
    else {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && data.supplierTaxPrice !== "" && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax price in decimal only";
    else {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.costPrice && data.costPrice !== "" && !this.validateFormData(data.costPrice, "numeric")) errors.costPrice = "Please enter agent cost price in decimal only";
    else {
      delete Object.assign(errors)["costPrice"];
    }
    if (data.markupPrice && data.markupPrice !== "" && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup price in decimal only";
    else {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.discountPrice && data.discountPrice !== "" && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount price in decimal only";
    else {
      delete Object.assign(errors)["discountPrice"];
    }
    if (data.CGSTPrice && data.CGSTPrice !== "" && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST price in decimal only";
    else {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && data.SGSTPrice !== "" && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST price in decimal only";
    else {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && data.IGSTPrice !== "" && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST price in decimal only";
    else {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.brn && !this.validateFormData(data.brn, "special-characters-not-allowed", /[<>]/)) errors.brn = "< and > characters not allowed";
    else {
      delete Object.assign(errors)["brn"];
    }

    if (data.description && (data.description.indexOf('<Script>') >= 0 || data.description.indexOf('<script>') >= 0)) errors.description = "Invalid Itinerary description";
    else {
      delete Object.assign(errors)["description"];
    }
    if (data.twPriceGuideLine && (data.twPriceGuideLine.indexOf('<Script>') >= 0 || data.twPriceGuideLine.indexOf('<script>') >= 0)) errors.twPriceGuideLine = "Invalid Price Guidelines";
    else {
      delete Object.assign(errors)["twPriceGuideLine"];
    }

    // if (!this.validateFormData(data.cityID, "require"))
    //   errors.cityID = "City required";
    // if (!this.validateFormData(data.stateID, "require"))
    //   errors.stateID = "State required";
    if (!this.validateFormData(data.countryID, "require"))
      errors.countryID = "Country required";
    //  if (!data.currencyID || !this.validateFormData(data.currencyID, "require"))
    //    errors.currencyID = "Currency required";

    // if (!data.countryID || !this.validateFormData(data.countryID, "require"))
    //   errors.countryID = "Country Name required";
    return Object.keys(errors).length === 0 ? null : errors;
  };

  saveOfferClick = () => {
    this.setState({ isBtnLoading: true });
    this.setState({ isLoading: true });
    const errors = this.validateInformation();
    this.setState({ errors: errors || {}, isBtnLoading: false, isLoading: false });
    if (errors) return;
    this.setState({ isErrorMsg: "", isBtnLoading: true, isLoading: true });
    this.saveOffer();
    /*
    const { mode, providerID } = { ...this.state };
    const { userInfo } = this.props;
    let data = Object.assign({}, this.state.data);
    var reqURL = "api/v1/customer/create";
    var reqOBJ = {
      Request: {
        UserDisplayName: data.customerName.trim(),
        FirstName: data.customerName.trim()?.split(" ")[0],
        LastName: data.customerName.trim()?.split(" ")[1] !== undefined ? data.customerName.trim()?.split(" ")[1] : data?.customerName.trim(),
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          countryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
        },
        ContactInformation: {
          PhoneNumber: data.customerPhone,
          PhoneNumberCountryCode: "",
          Email: data.customerEmail,
        },
      },
      Flags: {
        validateEmailAndPhone: !this.state.editMode,
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.iscmsportalcreated.toLowerCase() === "true" && data.customerEmail.indexOf("mytriponline.net") <= 0 ? true : false
      },
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (data?.response?.token) {
        sessionStorage.setItem("personateId", data.response.token);
      }

      if (data.status.code === 260031 && data.phoneNotoValidate !== data.phone) {
        this.setState({
          isBtnLoading: false,
          isErrorMsg: "Given phone number is associated with another customer. Kindly enter another phone number."
        });
      }
      else
        this.saveOffer();
    });
    */
  };
  saveOffer = () => {
    const { mode, providerID, CurrencyList } = { ...this.state };
    const { userInfo } = this.props;
    let data = Object.assign({}, this.state.data);
    data.images = data.images.concat(this.state.packageLargeImages);
    data.PDFList = data.packageBrochure.concat(this.state.packageBrochure);
    delete data["packageBrochure"];
    delete data["isActive"];
    delete data["isDeleted"];
    delete data["status"];
    delete data["inclusion"];
    delete data["exclusion"];
    delete data["imagesURL"];
    data["siteURL"] = this.state.isCMSPortalCreated && data.isShowOnHomePage ? this.state.portalURL : "";
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
    data["Duration"] = parseInt(data.duration);
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

    data.createCustomer_validateEmailAndPhone = false;
    data.createCustomer_UseAgentDetailInEmail = Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false;
    data.createCustomer_iscmsportalcreated = this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(data.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"));
    let OfferInfo = Object.assign({}, data);
    this.setState({ isLoading: true });
    let reqURL = `cms/package${mode.toLowerCase() === "add" ? "/add" : "/update"
      }`;
    let reqOBJ = { request: OfferInfo };
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {
          this.setState({ isLoading: false, showSuccessMessage: true });
        } else {
          let { errors } = this.state;
          if (resonsedata.code) {
            errors.SaveError = resonsedata.error;
          }
          else {
            errors.SaveError = "Oops! something went wrong";
          }
          this.setState({ isLoading: false, errors });
        }
      }.bind(this),
      "POST"
    );
  };

  handleDataChange = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    this.setState({ data });
    if (e.target.name === "countryID")
      this.getStateList(e.target.value);
    if (e.target.name === "stateID")
      this.getCityList(e.target.value);
  }
  getFiles(isLeadImage, mode, files) {
    let errors = Object.assign({}, this.state.errors);
    if (isLeadImage) {
      delete errors["LeadImage"];
    }
    this.setState({
      files: files,
      uploadDocValidationLeadImage: "",
      uploadDocValidationPDF: "",
      uploadDocValidationImage: "",
      errors
    });

    if (files && files !== "undefined" && files.base64 && files.base64 !== "undefined") {
      if (mode === "image" && files.file.size > 1024000) {
        if (isLeadImage) {
          this.setState({ uploadDocValidationLeadImage: "File size should not be greater then 1 MB." });
        }
        else {
          this.setState({ uploadDocValidationImage: "File size should not be greater then 1 MB." });
        }

        return;
      }
      if (mode === "pdf" && files.file.size > 5120000) {
        this.setState({ uploadDocValidationPDF: "File size should not be greater then 5 MB." });
        return;
      }

      let errors = Object.assign({}, this.state.errors);
      if (isLeadImage) {
        delete errors["LeadImage"];
        delete errors["uploadDocValidationLeadImage"];
      }
      else if (mode === "pdf") {
        delete errors["uploadDocValidationPDF"];
      }
      let tempRawData = "";
      if (this.state.files.base64.includes("data:image/jpeg;base64,")) {
        tempRawData = this.state.files.base64.replace(
          "data:image/jpeg;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:image/png;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:image/png;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:application/msword;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:application/pdf;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/pdf;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes(
          "data:application/x-zip-compressed;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/x-zip-compressed;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        );
      }
      let filedata_base64 = tempRawData;
      const reqOBJ = {
        Name: this.state.files.name,
        Extension: this.state.files.name.split('.').at(-1),
        ContentType: this.state.files.type,
        Data: filedata_base64,
      };
      let reqURL = "tw/image/validate";
      this.setState({ isSaving: true });
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        if (resonsedata && resonsedata.response && resonsedata.response.toLowerCase() === "success") {
          if (mode === "image" && this.state.files.type.includes("image/")) {
            let packageLargeImages = this.state.packageLargeImages;
            if (isLeadImage)
              packageLargeImages = packageLargeImages.filter(
                (x) => !x.IsDefaultImage
              );
            let sampleImageObj = {
              id: this.generateUUID(),
              IsDefaultImage: isLeadImage,
              fileExtension: this.state.files.name.split(".").at(-1),
              fileContentType: this.state.files.type,
              fileData: this.state.files.base64,
              fileName: this.state.files.name,
            };

            packageLargeImages.push(sampleImageObj);
            this.setState({ packageLargeImages });
          } else if (
            mode === "pdf" &&
            this.state.files.type === "application/pdf"
          ) {
            let packageBrochure = this.state.packageBrochure;
            packageBrochure.shift();
            let sampleImageObj = {
              id: this.generateUUID(),
              fileExtension: this.state.files.name.split(".").at(-1),
              fileContentType: this.state.files.type,
              fileData: this.state.files.base64,
              fileName: this.state.files.name,
            };
            packageBrochure.push(sampleImageObj);
            this.setState({ packageBrochure });
          } else if (
            mode === "image" &&
            !this.state.files.type.includes("image/")
          ) {
            if (isLeadImage)
              this.setState({
                uploadDocValidationLeadImage: "Invalid file selected.",
              });
            else
              this.setState({ uploadDocValidationImage: "Invalid file selected." });
          } else if (mode === "pdf" && !this.state.files.type.includes("pdf/")) {
            this.setState({ uploadDocValidationPDF: "Invalid file selected." });
          }
        }
        else {
          if (mode === "image") {
            if (isLeadImage)
              this.setState({
                uploadDocValidationLeadImage: "Invalid file selected.",
              });
            else
              this.setState({ uploadDocValidationImage: "Invalid file selected." });
          }
          else if (mode === "pdf") {
            let packageBrochure = this.state.packageBrochure;
            packageBrochure.shift();
            this.setState({
              uploadDocValidationPDF: "Invalid file selected.",
              packageBrochure,
            });
          }
        }
      }.bind(this), "POST");
    }
    else if (mode === "image" && !this.state.files.type.includes("image/")) {
      if (isLeadImage)
        this.setState({ uploadDocValidationLeadImage: "Invalid file selected." });
      else
        this.setState({ uploadDocValidationImage: "Invalid file selected." });
    }
    else if (mode === "pdf" && !this.state.files.type.includes("pdf/")) {
      this.setState({ uploadDocValidationPDF: "Invalid file selected." });
    }
  }
  RedirectToList = () => {
    this.props.history.push(`/packagemarketplacelist`);
  };

  handleShowHideTax = () => {
    this.setState({ isShowExtraFields: !this.state.isShowExtraFields });
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

  removeImage = (id) => {
    let packageLargeImages = this.state.packageLargeImages.filter(
      (x) => x.id !== id
    );
    let data = this.state.data;
    if (data.images && data.images.filter((x) => x.id === id).length > 0)
      data.images.filter((x) => x.id === id)[0].isDeleted = 1;
    if (data.imagesURL && data.imagesURL.filter((x) => x.id === id).length > 0)
      data.imagesURL.filter((x) => x.id === id)[0].isDeleted = 1;
    this.setState({ packageLargeImages, data });
  };
  addInclusionExclusion = (description, isInclusion) => {
    const errors = {};
    const { data, SelectedRoleID, mode } = this.state;
    if (isInclusion) {
      // if (
      //   !this.validateFormData(
      //     data.inclusion === undefined ? "" : data.inclusion,
      //     "require"
      //   )
      // ) {
      //   errors.inclusion = "Inclusion required";
      // }
      // else 
      if (data.inclusion && !this.validateFormData(data.inclusion, "special-characters-not-allowed", /[<>]/)) {
        errors.inclusion = "< and > characters not allowed";
      }
    } else {
      // if (
      //   !this.validateFormData(
      //     data.exclusion === undefined ? "" : data.exclusion,
      //     "require"
      //   )
      // ) {
      //   errors.exclusion = "Exclusion required";
      // }
      // else 
      if (data.exclusion && !this.validateFormData(data.exclusion, "special-characters-not-allowed", /[<>]/)) {
        errors.exclusion = "< and > characters not allowed";
      }
    }
    //errors =  Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errors || {} });
    if (Object.keys(errors).length > 0) return;
    var obj = {};
    obj["id"] = this.generateUUID();
    obj["isInclusion"] = isInclusion;
    obj["description"] = description;
    obj["isDeleted"] = false;

    //data.inclusionExclusion.push(obj);
    if (data.inclusionExclusion.filter((x) => x.isInclusion === isInclusion).length > 0) {
      if (description !== "") {
        data.inclusionExclusion[data.inclusionExclusion.findIndex(x => x.isInclusion === isInclusion)] = obj;
        this.setState({ data });
      }
      else {
        data.inclusionExclusion = data.inclusionExclusion.filter(x => x.isInclusion !== isInclusion);
        this.setState({ data });
      }
    } else {
      data.inclusionExclusion.push(obj);
    }
    // data.inclusion = "";
    // data.exclusion = "";
    // this.setState({ data });
  };
  removeInclusionExclusion = (id) => {
    let inclusionExclusion = this.state.data.inclusionExclusion.filter(
      (x) => x.id !== id
    );
    let data = this.state.data;
    if (
      data.inclusionExclusion &&
      data.inclusionExclusion.filter((x) => x.id === id).length > 0
    )
      data.inclusionExclusion.filter((x) => x.id === id)[0].isDeleted = true;
    if (
      data.inclusionExclusion &&
      data.inclusionExclusion.filter((x) => x.id === id).length > 0
    )
      data.inclusionExclusion.filter((x) => x.id === id)[0].isDeleted = true;
    this.setState({ inclusionExclusion, data });
  };

  removePDF = (id) => {
    let packageBrochure = this.state.packageBrochure.filter((x) => x.id !== id);
    let data = this.state.data;
    if (
      data.packageBrochure &&
      data.packageBrochure.filter((x) => x.id === id).length > 0
    )
      data.packageBrochure.filter((x) => x.id === id)[0].isDeleted = true;
    this.setState({ packageBrochure, data });
  };

  updateHTML = (datekey, htmldata) => {
    let data = this.state.data;
    data.datekey = encode(htmldata);
    this.setState({ data });
  };
  RedirectToListPage = () => {
    this.props.history.push(`/packagemarketplacelist`);
  };
  filterResults = (contolName, locationName, lat, long) => {
    let data = this.state.data;
    data.latitude = lat;
    data.locationName = locationName;
    data.longitude = long;
    this.setState({ data });
  };
  handleOnChange = () => {
    let data = this.state.data;
    data.isShowOnHomePage = !data.isShowOnHomePage;
    this.setState({ data });
  };

  handleOnChangeMarketPlace = () => {
    let data = this.state.data;
    data.isShowOnMarketPlace = true;//!data.isShowOnMarketPlace;
    this.setState({ data });
  };

  handleOnChangeMarketPlaceTW = () => {
    let data = this.state.data;
    data.isShowOnTourWizMarketPlace = true;//!data.isShowOnTourWizMarketPlace;
    this.setState({ data });
  };
  handleOnChangeMarketPlaceNew = () => {
    let data = this.state.data;
    data.isShowOnMarketPlace = true;//!data.isShowOnMarketPlace;
    //this.setState({ data });
  };

  handleOnDateChange1 = () => {
    let data = this.state.data;
    if (moment(data.validFrom).diff(moment(data.validTo), 'days') > 0) {
      data.validTo = moment(data.validFrom).add(5, "d").format(Global.DateFormate);
      this.setState({ data });
    }
  };
  handleAssistant = () => {
    let isAssistant = this.state.isAssistant;
    this.setState({ isAssistant: !isAssistant, assistantResponse: "", assistantInput: "" })
  }
  handleFetchData = (response) => {
    this.setState({ assistantResponse: response });
  }
  handleFetchInputData = (inputData) => {
    this.setState({ assistantInput: inputData });
  }
  getResponseData = (response) => {
    this.setState({ pasteFromAI: response, isAssistant: false });
  }
  closeAssitant = () => {
    this.setState({ isAssistant: false });
  }
  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    const {
      data,
      errors,
      mode,
      isLoading,
      isEditModeLoading,
      CountryList,
      activeTab,
      StateList,
      CityList,
      LoadingCountryList,
      LoadingStateList,
      LoadingCityList,
      showSuccessMessage,
      CurrencyList,
      LoadingCurrencyList,
      isCMSPortalCreated,
    } = this.state;
    const disabled = mode === "view";
    const isEditMode = mode === "edit";
    const { userInfo } = this.props;

    let currencyList = [{ name: "Select", value: "" }];
    Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        name: x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode + " (" + x.symbol + ")",
      })
    );

    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    const starRating = [
      { name: "Select", value: "" },
      { name: "1", value: "1" },
      { name: "2", value: "2" },
      { name: "3", value: "3" },
      { name: "4", value: "4" },
      { name: "5", value: "5" },
    ];
    const key2Types = packageTypeList.filter(item => item.key === parseInt(data.packageThemes))[0].types;//.map(type => type.name);
    console.log(key2Types); // ["Select Package Type", "Spiritual", "Adventure", "Yatra", "Educational", "Leisure", "Honeymoon", "Wildlife"]
    var tet = moment(data.validFrom).diff(moment(data.validTo), 'days') > 0 ? moment(data.validFrom).format(Global.DateFormate) : moment().add(1, "m").format(Global.DateFormate);
    const css = `
  .package-tab span {
    height: 100%;
}`;


    let htmlExclusion = '';
    this.state.data?.inclusionExclusion
      ?.filter((x) => !x.isDeleted && !x.isInclusion)
      .forEach((item, index) => {
        htmlExclusion += `${item.description.replace("<![CDATA[", "").replace("]]>", "")} <br/>`;
      });
    let htmlInclusion = '';
    this.state.data?.inclusionExclusion
      ?.filter((x) => !x.isDeleted && x.isInclusion)
      .forEach((item, index) => {
        htmlInclusion += `${item.description.replace("<![CDATA[", "").replace("]]>", "")} <br/>`;
      });
    return (
      <div>
        <style>{css}</style>
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon name="file-text" width="24" height="24" className="mr-3"></SVGIcon>
              {mode === "add" ? "Create " : mode === "view" ? "View " : "Edit "} Marketplace Package
              <button
                className="btn btn-sm btn-primary pull-right"
                onClick={() => this.props.history.push(`/packagemarketplacelist`)}
              >
                {Trans("Manage Marketplace Packags")}
              </button>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-3 hideMenu">
                        <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div> */}
            {isEditModeLoading && (
              <div className="col-lg-12">
                <div className="container ">
                  <Loader />
                </div>
              </div>
            )}
            {!isEditModeLoading && (
              <div className="col-lg-12 ">
                <div className="container ">
                  {showSuccessMessage && (
                    <MessageBar
                      Message={`Package ${mode === "add" ? "added" : "updated"
                        } successfully.`}
                      handleClose={() => this.RedirectToList()}
                    />
                  )}
                  {data.status === "REJECTED" && (
                    <div className="col-lg-12 alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                      <p className="m-2">
                        Your offer has been <strong>Rejected</strong> due to
                        below reason.
                      </p>
                      <blockquote className="m-2 ml-4">
                        <i>{data.statusReason}</i>
                      </blockquote>
                    </div>
                  )}
                  <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm" style={{ display: "none" }}>
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                      Customer Details
                    </h5>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {this.renderInput(
                          "customerName",
                          "Customer * (e.g. Firstname Lastname)"
                        )}{" "}
                        {isPersonateEnabled && mode != "edit" && (
                          <div
                            className="position-absolute"
                            style={{ right: "20px", top: "32px" }}
                          >
                            <CallCenter />
                          </div>
                        )}
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {this.renderInput(
                          "customerEmail",
                          Trans("_email")
                        )}
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {this.renderContactInput(
                          "customerPhone",
                          Trans("_lblContactPhoneWithStar"),
                          "text",
                          true
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container mt-4">
                  <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                      {mode != "edit" ? "Add New" : "Edit Existing"}
                    </h5>
                    <div className="row d-none" >
                      <div className={"col-lg-12 col-md-12 col-sm-12 mb-3"}>
                        <div className={"form-group  packageThemes mb-0"}>
                          <label htmlFor={"packageThemes"}>{"Package Category"}</label>
                          <div className="input-group">
                            <div className="form-check form-check-inline mr-3">
                              <input className="form-check-input" type="radio" name="packageThemes" id="3"
                                onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 3; this.setState({ data: dataTheme }); }} value={3} checked={data.packageThemes === 3} />
                              <label className="form-check-label" htmlFor="packageThemes3" onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 3; this.setState({ data: dataTheme }); }}>Holiday Packages</label>
                            </div>
                            <div className="form-check form-check-inline mr-3">
                              <input className="form-check-input" type="radio" name="packageThemes" id="2"
                                onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 2; this.setState({ data: dataTheme }); }} checked={data.packageThemes === 2} />
                              <label className="form-check-label" htmlFor="packageThemes2" onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 2; this.setState({ data: dataTheme }); }}>Flight Packages</label>
                            </div>
                            <div className="form-check form-check-inline mr-3">
                              <input className="form-check-input" type="radio" name="packageThemes" id="1"
                                onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 1; this.setState({ data: dataTheme }); }} value={1} checked={data.packageThemes === 1} />
                              <label className="form-check-label" htmlFor="packageThemes1" onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 1; this.setState({ data: dataTheme }); }}>Hotel Packages</label>
                            </div>
                            <div className="form-check form-check-inline mr-3">
                              <input className="form-check-input" type="radio" name="packageThemes" id="5"
                                onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 5; this.setState({ data: dataTheme }); }} checked={data.packageThemes === 5} />
                              <label className="form-check-label" htmlFor="packageThemes2" onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 5; this.setState({ data: dataTheme }); }}>Activity Packages</label>
                            </div>
                            <div className="form-check form-check-inline mr-3">
                              <input className="form-check-input" type="radio" name="packageThemes" id="11"
                                onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 11; this.setState({ data: dataTheme }); }} checked={data.packageThemes === 11} />
                              <label className="form-check-label" htmlFor="packageThemes2" onClick={() => { let dataTheme = this.state.data; dataTheme.packageThemes = 11; this.setState({ data: dataTheme }); }}>Transfer Packages</label>
                            </div>
                          </div>

                          {errors["packageThemes"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["packageThemes"]}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        {this.renderInput(
                          "packageName",
                          "Title *",
                          "text",
                          disabled,
                          "",
                          2,
                          100
                        )}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderSelect("packageThemes", "Category *", PackageCategory)}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderSelect("specialPromotionType", "Type ", key2Types)}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderSelect("rating", "Star Rating", starRating)}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderSingleDate(
                          "validFrom",
                          "Valid From",
                          moment().format(Global.DateFormate),
                          moment("2001-01-01").format(Global.DateFormate),
                          moment(data.validFrom).diff(moment(data.validTo), 'days') > 0 ? this.handleOnDateChange1() : undefined,
                          false
                        )}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderSingleDate(
                          "validTo",
                          "Valid To",
                          moment(data.validFrom).diff(moment(data.validTo), 'days') > 0 ? moment(data.validFrom).format(Global.DateFormate) : moment().add(1, "m").format(Global.DateFormate),
                          moment(data.validFrom).format(Global.DateFormate),
                          undefined,
                          false
                        )}
                      </div>
                      <div
                        className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderInput(
                          "duration",
                          "Duration (in days)",
                          "number"
                        )}
                      </div>

                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className={"form-group " + "countryID"}>
                          <label htmlFor={"countryID"}>{"Country *"}</label>
                          <div className="input-group">
                            <select
                              value={data.countryID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"countryID"}
                              id={"countryID"}
                              disabled={disabled}
                              className={"form-control"}>
                              <option key={0} value={''}>Select</option>
                              {CountryList.map((option, key) => (

                                <option
                                  key={key}
                                  value={
                                    option["countryId"]
                                  }
                                >
                                  {option["countryName"]}
                                </option>
                              ))}
                            </select>
                            {LoadingCountryList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["countryID"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["countryID"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className={"form-group " + "stateID"}>
                          <label htmlFor={"stateID"}>{"State "}</label>
                          <div className="input-group">
                            <select
                              value={data.stateID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"stateID"}
                              id={"stateID"}
                              disabled={disabled}
                              className={"form-control"}>
                              <option key={0} value={''}>Select</option>
                              {StateList.map((option, key) => (

                                <option
                                  key={key}
                                  value={
                                    option["stateId"]
                                  }
                                >
                                  {option["stateName"]}
                                </option>
                              ))}
                            </select>
                            {LoadingStateList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["stateID"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["stateID"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className={"form-group " + "cityID"}>
                          <label htmlFor={"cityID"}>{"City "}</label>
                          <div className="input-group">
                            <select
                              value={data.cityID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"cityID"}
                              id={"cityID"}
                              disabled={disabled}
                              className={"form-control"}>
                              <option key={0} value={''}>Select</option>
                              {CityList.map((option, key) => (

                                <option
                                  key={key}
                                  value={
                                    option["cityId"]
                                  }
                                >
                                  {option["cityName"]}
                                </option>
                              ))}
                            </select>
                            {LoadingCityList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["cityID"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["cityID"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12" style={{ display: "none" }}>
                        <div className={"form-group " + "currencyID"}>
                          <label htmlFor={"currencyID"}>{"Currency *"}</label>
                          <div className="input-group">
                            <select
                              value={data.currencyID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"currencyID"}
                              id={"currencyID"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>
                                Select
                              </option>
                              {CurrencyList.map((option, key) => (
                                <option key={key} value={option["currencyID"]}>
                                  {option["displayName"] +
                                    " (" +
                                    option["symbol"] +
                                    ")"}
                                </option>
                              ))}
                            </select>
                            {LoadingCurrencyList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["currencyID"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["currencyID"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-12"
                        style={{ display: "none" }}
                      >
                        {this.renderInput(
                          "offerPrice",
                          "Offer price",
                          "number"
                        )}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="col-sm-12 p-0">
                          <FileBase64
                            multiple={false}
                            onDone={this.getFiles.bind(this, true, "image")}
                            name="uploadDocument"
                            label={"Featured Image *"}
                            placeholder={"Select Image file"}
                            className="w-100 col-lg-12"
                          />
                        </div>
                        <div
                          className="col-sm-12 p-0 pull-left"
                          style={{ marginTop: "-6px" }}
                        >
                          {this.state.uploadDocValidationLeadImage && (
                            <small className="alert alert-danger m-0 p-1 d-inline-block">
                              {this.state.uploadDocValidationLeadImage}
                            </small>
                          )}
                          {errors["LeadImage"] && this.state.packageLargeImages?.filter((x) => x.IsDefaultImage).length == 0 && (
                            <small className="alert alert-danger praful m-0 p-1 d-inline-block">
                              {errors["LeadImage"]}
                            </small>
                          )}
                        </div>
                        <div className="col-sm-12 m-0 p-0 pull-left">
                          {this.state.packageLargeImages
                            ?.filter((x) => x.IsDefaultImage).length == 0 && this.state.data.images
                              ?.filter((x) => x.isDefaultImage && !x.isDeleted)
                              .map((item, index) => {
                                return (
                                  <div
                                    className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                    role="alert"
                                    key={index}
                                  >
                                    <div className="alert alert-warning alert-dismissible fade show p-2">
                                      <span>
                                        <a
                                          className="btn btn-link  text-primary"
                                          href={
                                            item.imagepath.indexOf("http") > -1
                                              ? item.imagepath
                                              : "http://preprod-images.yourtripplans.tech/cms/portals/" +
                                              item.portalID +
                                              "/SpecialsPromotions/images/" +
                                              item.imagepath
                                          }
                                          target="_blank"
                                          download={`offer${index + 1}.pdf`}
                                        >
                                          Download Featured Image{" "}
                                        </a>
                                      </span>
                                      {/* <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                      onClick={() => this.removeImage(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button> */}
                                    </div>
                                  </div>
                                );
                              })}
                          {!this.state.uploadDocValidationLeadImage && this.state.packageLargeImages
                            ?.filter((x) => x.IsDefaultImage)
                            .map((item, index) => {
                              return (
                                <div
                                  className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                  role="alert"
                                  key={index}
                                >
                                  <div className="alert alert-warning alert-dismissible fade show">
                                    {item.fileName}
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                      onClick={() => this.removeImage(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="col-sm-12 p-0">
                          <FileBase64
                            multiple={false}
                            onDone={this.getFiles.bind(this, true, "pdf")}
                            name="uploadDocument"
                            label={"Brochure"}
                            placeholder={"Select PDF file"}
                            className="w-100 col-lg-12"
                          />
                          <div className="col-sm-12 p-0 m-0 pull-left">
                            {this.state.uploadDocValidationPDF && (
                              <small className="alert alert-danger m-0 p-1 d-inline-block">
                                {this.state.uploadDocValidationPDF}
                              </small>
                            )}
                          </div>
                          <div className="col-sm-12 m-0 p-0 pull-left">
                            {this.state.data?.packageBrochure
                              ?.filter((x) => !x.isDeleted)
                              .map((item, index) => {
                                return (
                                  <div
                                    className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                    role="alert"
                                    key={index}
                                  >
                                    <div className="alert alert-warning alert-dismissible fade show p-2">
                                      <span>
                                        <a
                                          className="btn btn-link  text-primary"
                                          href={
                                            item.fileURL.indexOf("http") > -1
                                              ? item.fileURL
                                              : "http://preprod-images.yourtripplans.tech/cms/portals/" +
                                              item.portalID +
                                              "/SpecialsPromotions/Brochure/" +
                                              item.fileURL
                                          }
                                          target="_blank"
                                          download={`offer${index + 1}.pdf`}
                                        >
                                          Downlaod Brochure{" "}
                                        </a>
                                      </span>
                                      <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                        onClick={() => this.removePDF(item.id)}
                                      >
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            {!this.state.uploadDocValidationPDF && this.state.packageBrochure?.map((item, index) => {
                              return (
                                <div
                                  className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                  role="alert"
                                  key={index}
                                >
                                  <div className="alert alert-warning alert-dismissible fade show">
                                    {item.fileName}
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                      onClick={() => this.removePDF(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {this.renderInput("price", "Sell Price  (" + portalCurrency + ")", "text", this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12 mx-auto">

                        <div className={"form-group AdvancedPricing"}>
                          <label htmlFor={"AdvancedPricing"} style={{ visibility: "hidden" }}>AdvancedPricing </label>
                          {/* <button
                            className="btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn mx-auto"
                            onClick={() => this.setState({ isShowAdvancedPricing: !this.state.isShowAdvancedPricing })}
                          >
                            {Trans("Advanced Pricing")}
                          </button> */}
                          <Link
                            activeClass="active"
                            className="btn btn-sm m-0 btn-outline-primary text-center d-flex dashboard-btn mx-auto"
                            href="#"
                            to={!this.state.isShowAdvancedPricing ? "overview" : ""}
                            onClick={() => this.setState({ isShowAdvancedPricing: !this.state.isShowAdvancedPricing })}
                            spy={true}
                            smooth={true}
                            offset={-120}
                            duration={500}
                          >
                            {!this.state.isShowAdvancedPricing ? Trans("Show Advanced Pricing") : Trans("Hide Advanced Pricing")}
                          </Link>
                        </div>
                      </div>
                      {isCMSPortalCreated && (
                        <React.Fragment>

                          <div
                            className="col-lg-12 col-md-6 col-sm-12 d-none"
                          >
                            <div className={"form-group " + "isShowOnHomePage"}>
                              <label htmlFor={"isShowOnHomePage"}>Publish on </label>
                              <div className="input-group">
                                <div className="form-check form-check-inline mr-5">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnHomePage"
                                    id="isShowOnHomePage"
                                    onChange={this.handleOnChange}
                                    value={data.isShowOnHomePage}
                                    checked={data.isShowOnHomePage}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                    onClick={this.handleOnChange}
                                  >
                                    Own Website ?
                                  </label>
                                </div>
                                <div className="form-check form-check-inline mr-5" style={{ display: "none" }}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnPATAMarketPlace"
                                    id="isShowOnPATAMarketPlace"
                                    onChange={this.handleOnChangeMarketPlaceNew}
                                    value={data.isShowOnPATAMarketPlace}
                                    checked={data.isShowOnPATAMarketPlace}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                  >
                                    PATA Marketplace ?
                                  </label>
                                </div>
                                <div className="form-check form-check-inline mr-5" style={{ display: "none" }}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnTAFIMarketPlace"
                                    id="isShowOnTAFIMarketPlace"
                                    onChange={this.handleOnChangeMarketPlaceNew}
                                    value={data.isShowOnTAFIMarketPlace}
                                    checked={data.isShowOnTAFIMarketPlace}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                  >
                                    TAFI Marketplace ?
                                  </label>
                                </div>
                                <div className="form-check form-check-inline mr-5" style={{ display: "none" }}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnTAAIMarketPlace"
                                    id="isShowOnTAAIMarketPlace"
                                    onChange={this.handleOnChangeMarketPlaceNew}
                                    value={data.isShowOnTAAIMarketPlace}
                                    checked={data.isShowOnTAAIMarketPlace}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                    onClick={this.handleOnChangeMarketPlaceNew}
                                  >
                                    TAAI Marketplace ?
                                  </label>
                                </div>
                                <div className="form-check form-check-inline mr-5 d-none">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnMarketPlace"
                                    id="isShowOnMarketPlace"
                                    onChange={this.handleOnChangeMarketPlace}
                                    value={data.isShowOnMarketPlace}
                                    checked={data.isShowOnMarketPlace}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                    onClick={this.handleOnChangeMarketPlace}
                                  >
                                    Tourwiz Marketplace ?
                                  </label>
                                </div>
                                <div className="form-check form-check-inline mr-5 d-none" style={{ display: "none" }}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isShowOnTourWizMarketPlace"
                                    id="isShowOnTourWizMarketPlace"
                                    onChange={this.handleOnChangeMarketPlaceTW}
                                    value={data.isShowOnTourWizMarketPlace}
                                    checked={data.isShowOnTourWizMarketPlace}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="IsActiveYes"
                                    onClick={this.handleOnChangeMarketPlaceTW}
                                  >
                                    TourWiz Marketplace ?
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>)}
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-12" style={{
                        width: "412px", overflowX: "auto"
                      }} >
                        <div className="row">
                          <div className="col-lg-12 d-flex flex-row  package-tab-row">
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Overview" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("Overview")}
                            >
                              <span>Overview</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Itinerary" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("Itinerary")}
                            >
                              <span>Itinerary</span>
                            </div>

                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Incusion" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("Incusion")}
                            >
                              <span>Inclusions</span>
                            </div>

                            <div
                              className={
                                "package-tab" +
                                (activeTab === "exclusion" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("exclusion")}
                            >
                              <span>Exclusions</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "PhotoGallery" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("PhotoGallery")}
                            >
                              <span>Photo Gallery</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "PriceGuidelines" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("PriceGuidelines")}
                            >
                              <span>Price Guidelines</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Terms" ? " active" : "")
                              }
                              onClick={() => this.handleTabChange("Terms")}
                            >
                              <span>Terms & Conditions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-6 col-sm-12 mt-3">
                        <AuthorizeComponent
                          title="ai-assistant~button"
                          type="button"
                          rolepermissions={userInfo.rolePermissions}>
                          {activeTab !== "PhotoGallery" &&
                            <div className="row">
                              <div className="col-lg-12 col-md-6 col-sm-12  mb-3 d-flex justify-content-end">
                                <button type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => this.handleAssistant()}
                                >
                                  Your AI Assistant
                                </button>
                              </div>
                            </div>
                          }
                        </AuthorizeComponent>
                        {/* {this.renderTextarea("ADVT_HTMLText", "Offer details", "Detailed Info for an offer.", disabled)} */}
                        {activeTab === "Overview" && (
                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={decode(this.state.data.summaryDescription)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.summaryDescription = encode(data);
                                this.setState({ dataState });
                              }}
                            />

                            {errors["summaryDescription"] && (
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {errors["summaryDescription"]}
                              </small>
                            )}
                          </div>
                        )}
                        {activeTab === "Itinerary" && (<>
                          {/* <div className="col-lg-12 col-md-6 col-sm-12  mb-3 d-flex justify-content-end">
                            <button type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => this.handleAssistant(true)}
                            >
                              Your AI Assistant
                            </button>
                          </div> */}
                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={this.state.pasteFromAI !== "" ? decode(this.state.pasteFromAI) : decode(this.state.data.description)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.description = encode(data);
                                this.setState({ dataState });
                              }}
                            />

                            {errors["description"] && (
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {errors["description"]}
                              </small>
                            )}
                          </div>
                        </>
                        )}
                        {activeTab === "Incusion" && (

                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={decode(this.state.data.inclusion || htmlInclusion)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.inclusion = encode(data);
                                this.setState({ dataState });
                                this.addInclusionExclusion(
                                  dataState.inclusion,
                                  true
                                )
                              }}
                            />

                            {errors["inclusion"] && (
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {errors["inclusion"]}
                              </small>
                            )}
                          </div>
                          // <div className="row">
                          //   <div className="col-lg-12 col-md-12 col-sm-12 ">
                          //     {this.renderInput(
                          //       "inclusion",
                          //       "Inclusions *",
                          //       "text"
                          //     )}
                          //     <button
                          //       className="btn btn-primary position-absolute bottom-0 end-0 m-3"
                          //       type="submit"
                          //       style={{ top: "16px", right: "0px" }}
                          //       onClick={() =>
                          //         this.addInclusionExclusion(
                          //           data.inclusion,
                          //           true
                          //         )
                          //       }
                          //     >
                          //       Add
                          //     </button>
                          //   </div>
                          //   {this.state.data?.inclusionExclusion
                          //     ?.filter((x) => !x.isDeleted && x.isInclusion)
                          //     .map((item, index) => {
                          //       return (
                          //         <div
                          //           className="col-lg-12 col-md-6 col-sm-12 m-0"
                          //           role="alert"
                          //           key={index}
                          //         >
                          //           <div className="alert alert-warning alert-dismissible fade show p-2">
                          //             {item.description.replace("<![CDATA[", "").replace("]]>", "")}
                          //             <button
                          //               type="button"
                          //               className="close p-2"
                          //               data-dismiss="alert"
                          //               aria-label="Close"
                          //               onClick={() =>
                          //                 this.removeInclusionExclusion(item.id)
                          //               }
                          //             >
                          //               <span aria-hidden="true">&times;</span>
                          //             </button>
                          //           </div>
                          //         </div>
                          //       );
                          //     })}
                          // </div>
                        )}
                        {activeTab === "exclusion" && (


                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={decode(this.state.data.exclusion || htmlExclusion)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.exclusion = encode(data);
                                this.setState({ dataState });
                                this.addInclusionExclusion(
                                  dataState.exclusion,
                                  false
                                )
                              }}
                            />

                            {errors["exclusion"] && (
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {errors["exclusion"]}
                              </small>
                            )}
                          </div>
                          // <div className="row">
                          //   <div className="col-lg-12 col-md-12 col-sm-12 ">
                          //     {this.renderInput(
                          //       "exclusion",
                          //       "Exclusions *",
                          //       "text"
                          //     )}
                          //     <button
                          //       className="btn btn-primary position-absolute bottom-0 end-0 m-3"
                          //       type="submit"
                          //       style={{ top: "16px", right: "0px" }}
                          //       onClick={() =>
                          //         this.addInclusionExclusion(
                          //           data.exclusion,
                          //           false
                          //         )
                          //       }
                          //     >
                          //       Add
                          //     </button>
                          //   </div>
                          //   {this.state.data?.inclusionExclusion
                          //     ?.filter((x) => !x.isDeleted && !x.isInclusion)
                          //     .map((item, index) => {
                          //       return (
                          //         <div
                          //           className="col-lg-12 col-md-6 col-sm-12 m-0"
                          //           role="alert"
                          //           key={index}
                          //         >
                          //           <div className="alert alert-warning alert-dismissible fade show p-2">
                          //             {item.description.replace("<![CDATA[", "").replace("]]>", "")}
                          //             <button
                          //               type="button"
                          //               className="close p-2"
                          //               data-dismiss="alert"
                          //               aria-label="Close"
                          //               onClick={() =>
                          //                 this.removeInclusionExclusion(item.id)
                          //               }
                          //             >
                          //               <span aria-hidden="true">&times;</span>
                          //             </button>
                          //           </div>
                          //         </div>
                          //       );
                          //     })}
                          // </div>
                        )}{activeTab === "PriceGuidelines" && (
                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={decode(this.state.data.twPriceGuideLine)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.twPriceGuideLine = encode(data);
                                this.setState({ dataState });
                              }}
                            />

                            {errors["description"] && (
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {errors["description"]}
                              </small>
                            )}
                          </div>
                        )}
                        {activeTab === "PhotoGallery" && (
                          <div className="col-lg-12 col-md-6 col-sm-12 p-0">
                            <div className="col-lg-4 col-md-6 col-sm-12 p-0 clearfix">
                              <FileBase64
                                multiple={false}
                                onDone={this.getFiles.bind(
                                  this,
                                  false,
                                  "image"
                                )}
                                name="uploadDocument"
                                placeholder={"Select Image file"}
                                className="w-100 col-lg-12 p-0"
                              />

                              {this.state.uploadDocValidationImage && (
                                <small className="alert alert-danger p-1 d-inline-block">
                                  {this.state.uploadDocValidationImage}
                                </small>
                              )}
                              {errors["packageLargeImages"] && (
                                <small className="alert alert-danger p-1 d-inline-block">
                                  {errors["packageLargeImages"]}
                                </small>
                              )}
                            </div>

                            {this.state.data.images
                              ?.filter((x) => !x.isDefaultImage && !x.isDeleted)
                              .map((item, index) => {
                                return (
                                  <div
                                    className="col-lg-4 col-md-6 col-sm-12 mt-3 pull-left"
                                    role="alert"
                                    key={index}
                                  >
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                      onClick={() => this.removeImage(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                    <img
                                      src={
                                        item.imagepath.indexOf("http") > -1
                                          ? item.imagepath
                                          : "http://preprod-images.yourtripplans.tech/cms/portals/" +
                                          item.portalID +
                                          "/SpecialsPromotions/images/" +
                                          item.imagepath
                                      }
                                      className="img-fluid img-thumbnail"
                                      style={{ height: "260px" }}
                                    />
                                  </div>
                                );
                              })}
                            {!this.state.uploadDocValidationImage && this.state.packageLargeImages
                              ?.filter((x) => !x.IsDefaultImage)
                              .map((item, index) => {
                                return (
                                  <div
                                    className="col-lg-4 col-md-6 col-sm-12 mt-3 pull-left"
                                    role="alert"
                                    key={index}
                                  >
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                      onClick={() => this.removeImage(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                    <img
                                      src={item.fileData}
                                      className="img-fluid img-thumbnail"
                                      style={{ height: "260px", width: "100%" }}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        )}
                        {activeTab === "Terms" && (
                          <div className="form-group locationName">
                            <CKEditor
                              editor={ClassicEditor} config={Global.toolbarFCK}
                              data={decode(this.state.data.termsConditions)}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                let dataState = this.state.data;
                                dataState.termsConditions = encode(data);
                                this.setState({ dataState });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container overview mt-4">
                  {this.state.isShowAdvancedPricing &&
                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                      <h5 className="text-primary border-bottom pb-2 mb-2">
                        Advanced Pricing
                        <button
                          class="btn btn-link p-0 m-0 text-primary pull-right"
                          onClick={this.handleShowHideTax} style={{ display: "none" }}
                        >
                          {this.state.isShowExtraFields ? "Hide" : "Show"} More
                        </button>
                      </h5>

                      {this.state.isShowExtraFields && (
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderSelect(
                              "supplierCurrency",
                              "Supplier Currency",
                              currencyList
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "conversionRate",
                              "Conversion Rate",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "supplierCostPrice",
                              "Supplier Cost Price",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "supplierTaxPrice",
                              "Supplier Tax",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "costPrice",
                              "Agent Cost Price (" + portalCurrency + ")",
                              "text",
                              true
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "markupPrice",
                              "Agent Markup",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "discountPrice",
                              "Discount",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "CGSTPrice",
                              "CGST",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "SGSTPrice",
                              "SGST",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "IGSTPrice",
                              "IGST",
                              "text",
                              false,
                              this.handleAmountFields
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput("price", "Sell Price  (" + portalCurrency + ")", "text", this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderInput(
                              "brn",
                              "Confirmation Number",
                              "text",
                              false,
                              this.validateBRN
                            )}
                          </div>

                          <div className="col-lg-3 col-md-6 col-sm-12">
                            {this.renderCurrentDateWithDuration(
                              "bookBefore",
                              "Book Before (Supplier)",
                              moment().format("YYYY-MM-DD")
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  <div className="row mt-3">
                    {errors["SaveError"] && (
                      <div className="col-lg-12">
                        <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                          {errors["SaveError"]}
                        </small>
                      </div>
                    )}

                    {!disabled && (
                      <AuthorizeComponent
                        title="dashboard-menu~inquiries-create-inquiry"
                        type="button"
                        rolepermissions={userInfo.rolePermissions}
                      >
                        <div className="col-lg-2 mt-2">
                          <div className="form-group">
                            <button
                              onClick={() => this.saveOfferClick()}
                              className="btn btn-primary w-100 text-capitalize" id="create_package"
                            >
                              {isLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              {mode != "edit" ? "Create" : "Update"} Package
                            </button>
                          </div>
                        </div>
                      </AuthorizeComponent>
                    )}
                    {!disabled && (
                      <div className="col-lg-2 mt-2">
                        <div className="form-group">
                          <button
                            onClick={() =>
                              this.props.history.push("/packagemarketplacelist")
                            }
                            className="btn btn-primary w-100 text-capitalize"
                          >
                            {" "}
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {
          this.state.isAssistant &&
          <AssistantModelPopup
            content={
              <PackageAIAssitant
                handleHide={this.handleAssistant}
                promptMode={"Pacakage " + activeTab}
              />}
            sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
            handleHide={this.handleAssistant}
          />
          /* <AssistantModelPopup
            header={<PackageAssistantHeader handleHide={this.handleAssistant} />}
            content={<PackageAssistant
              inputData={this.state.assistantInput}
              responseData={this.state.assistantResponse}
              getResponseData={this.getResponseData}
              closeAssitant={this.closeAssitant}
            />}
            footer={<PackageAssistantFooter
              handleFetchInputData={this.handleFetchInputData}
              handleFetchData={this.handleFetchData}
            />}
            sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
            handleHide={this.handleAssistant} />*/
        }
      </div>

    );
  }
}
export default DealsPartnerForm;

const status = [
  { value: "CREATED", name: "Draft" },
  { value: "REQUESTFORPUBLISH", name: "Request For Publish" },
  { value: "PUBLISHED", name: "Published" },
  { value: "REJECTED", name: "Rejected" },
];
const PackageCategory = [
  { value: "3", name: "Holiday" },
  { value: "1", name: "Hotel" },
  { value: "2", name: "Flight" },
  { value: "5", name: "Activity" },
  { value: "11", name: "Transfers" },
  { value: "99", name: "Other" },
];

let packageTypeList = [
  {
    key: 0, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 1, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 2, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 3, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 5, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 11, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  },
  {
    key: 99, types: [
      { name: "Select Type", value: "" },
      { name: "Adventure", value: "Adventure" },
      { name: "Educational", value: "Educational" },
      { name: "Honeymoon", value: "Honeymoon" },
      { name: "Leisure", value: "Leisure" },
      { name: "Spiritual", value: "Spiritual" },
      { name: "Yatra", value: "Yatra" },
      { name: "Wildlife", value: "Wildlife" },
    ]
  }
];