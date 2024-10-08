import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import SVGIcon from "../helpers/svg-icon";
import ManualInvoiceItemsDetails from "../components/quotation/manualinvoiceitem-details"
import { Trans } from "../helpers/translate";
import ComingSoon from "../helpers/coming-soon";
import { getItem } from "../components/quotation/quotation-get-cart-item";
import moment from "moment";
import * as Global from "../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import CustomerAddSelect from "../components/common/customer-add-select";
import Form from "../components/common/form";
import ManualInvoiceAddOffline from "../components/quotation/manual-invoice-add-offline";
import TravellersManualinvoice from "../components/cart/travellers-manualinvoice";
import MessageBar from '../components/admin/message-bar';
import BusinessDD from "../components/reports/business-dropdown";
import Loader from "../components/common/loader";
import { scroller } from "react-scroll";
import { apiRequester_dxcoretourwizonline_api } from '../services/requester-dxcoretourwizonline';
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import * as GlobalEvents from "../helpers/global-events";
import ModelPopup from "../helpers/model";
import { Helmet } from "react-helmet";
import SearchWidgetModeQuotationTabs from "../components/search/search-widget-mode-quotation-tabs";

class ManualInvoice extends Form {
  constructor(props) {
    super(props);
    this.state = {
      businessName: "",
      isResults: false,
      resultKey: 1,
      popupContent: "",
      popupTitle: "",
      showPopup: false,
      popupSizeClass: "modal-dialog",
      showMessageBar: false,
      quickProposal: {
        mode: "quick",
        startDate: "",
        endDate: "",
        title: "",
        supplierCurrency: "",
        conversionRate: "",
        description: "",
        costPrice: 0,
        sellPrice: 0,
        supplierCostPrice: "",
        supplierTaxPrice: "",
        markupPrice: 0,
        discountPrice: 0,
        CGSTPrice: 0,
        IGSTPrice: 0,
        SGSTPrice: 0,
        amountWithoutGST: 0,
        isInclusive: false,
        percentage: 0,
        processingFees: 0,
        isTax1Modified: false,
        isTax2Modified: false,
        isTax3Modified: false,
        isTax4Modified: false,
        isTax5Modified: false,
        tax1: 0,
        tax2: 0,
        tax3: 0,
        tax4: 0,
        tax5: 0,
        taxType: "",
        totalAmount: 0,
        isShowTax: false,
        isSellPriceReadonly: false,
        IGST: 0,
        CGST: 0,
        SGST: 0,
      },
      data: {
        customerName: "",
        email: "",
        address: "",
        phone: "",
        gstno: "",
        narration: "",
        title: "",
        duration: "",
        startDate: "",
        endDate: "",
        dates: "",
        datesIsValid: "valid",
        cutOfDays: 1,
        stayInDays: 1,
        createdDate: "",
        status: "",
        phoneNotoValidate: "",
        invoicenumber: "",
        itineraryID: 0,
        customerledger: "",
        addToSupplierLedger: "",
        customitemType: "",
        customitemTypeother: "",
        addToBooking: "",
        convertToInvoice: "",
        isBookingInProgress: false,
        isHideFareBreakupInvoice: false
      },
      businessdetails: {},
      showpaxsection: false,
      packageResult: "",
      errors: {},
      items:
        localStorage.getItem("ManualInvoiceItems") &&
          localStorage.getItem("ManualInvoiceItems") !== "undefined"
          ? JSON.parse(localStorage.getItem("ManualInvoiceItems")) &&
          JSON.parse(localStorage.getItem("ManualInvoiceItems"))
          : [],
      isEmail: false,
      detailsKey: 1,
      isSaveSucessMsg: false,
      isLoading: false,
      isBtnLoading: false,
      isBtnLoadingUpdateOnlyInvoice: false,
      isBtnLoadingAddOnlyInvoice: false,
      isBtnLoadingAddInvoiceWithBooking: false,
      isBtnLoadingAddInvoiceToBooking: false,
      isBtnLoadingAddToCustomerLedger: false,
      isBtnLoadingAddToSupplierLedger: false,
      type: this.props.match.path.toLowerCase().split("/").includes("manualinvoice")
        ? "Invoice"
        : this.props.match.path.toLowerCase().split("/").includes("manualvoucher")
          ? "Voucher"
          : "",
      importItem: false,
      importItemKey: 1,
      isShowSearch: true,
      comingsoon: false,
      bookingItemCount: 0,
      isMetaResults: false,
      isErrorMsg: "",
      isSearch: true,
      isShowSucessMsg: false,
      SucessMsg: "",
      isShowUnsavedMsg: false,
      isSubscriptionPlanend: false,
      isshowauthorizepopup: false,
    };
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }

  CheckforAccessQuota = (itemscount) => {
    let reqURL = "user/checkaccessquota?type=Booking&totalitems=" + itemscount
    let reqOBJ = {}
    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.code && data.code === 101) {
            this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
            return false;
          }
          else if (data.response) {
            resolve()
          }
        }.bind(this),
        "GET"
      );
    });
  }

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    newData.duration = this.GetDuration(startDate, endDate);
    this.setState({ data: newData });
  };

  addTravellers = (data) => {
    let { businessdetails } = this.state;
    businessdetails["guestdetails"] = data[0].data.guests;
    businessdetails["description"] = businessdetails["description"].replaceAll('\n', '<br/>');
    this.handleOffline(businessdetails);
    this.setState({ businessdetails, importItem: false });
  };
  createCart = () => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let reqURL = "quotation";
    let reqOBJ = {
      name: quotationInfo.title,
      owner: quotationInfo.customerName,
      isPublic: true,
      type: this.state.type,
      data: {
        name: quotationInfo.title,
        customerName: quotationInfo.customerName,
        email: quotationInfo.email,
        phone: quotationInfo.phone,
        terms: quotationInfo.terms,
        offlineItems: localStorage.getItem("quotationItems"),
        duration: quotationInfo.duration,
        startDate: moment(quotationInfo.startDate).format("YYYY-MM-DD"),
        endDate: moment(quotationInfo.endDate).format("YYYY-MM-DD"),
        type: this.state.type,
        createdDate: moment(quotationInfo.createdDate).format("YYYY-MM-DD"),
        status: "saved",
        agentName: localStorage.getItem("agentName") || "",
      },
    };
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      localStorage.setItem("cartLocalId", data.id);
      this.setState({
        savedCartId: localStorage.getItem("cartLocalId"),
        isBtnLoading: false,
      });
      let localQuotationInfo = JSON.parse(
        localStorage.getItem("quotationDetails")
      );
      localQuotationInfo.status = "saved";
      localStorage.setItem(
        "quotationDetails",
        JSON.stringify(localQuotationInfo)
      );
    });
  };

  handleEdit = () => {
    this.props.history.push("/Manual" + this.state.type + "/Edit");
  };

  handleData = (Itemdata) => {
    let importitem = this.state.importItem;
    if (importitem) {
      importitem.itemDtlEdit = Itemdata
    }
    this.setState({ businessName: Itemdata.business, businessdetails: Itemdata, showpaxsection: Itemdata.showpaxsection, importItem: importitem }, () => {
      scroller.scrollTo("TravellersManualinvoice", {
        duration: 1000,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -15
      });
    });
  }

  handleResults = (businessName, searchRequest) => {
    if (businessName === "air") {
      let isMetaResults = false;
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
      this.setState({
        isSearch: false,
        isResults: true,
        isMetaResults:
          businessName === "hotel" ||
            businessName === "air" ||
            businessName === "activity"
            ? true
            : false,
        businessName: businessName,
      });
    }
  };

  handleSearchRequest = (searchParam) => {
    this.setState({
      searchRequest: searchParam,
      resultKey: this.state.resultKey + 1,
      isResults: true,
      isMetaResults: true,
    });
    this.handleResults(searchParam.businessName, searchParam);
  };

  deleteResults = () => {
    this.setState({ isResults: false, isMetaResults: false });
  };

  bookQuotation = () => {
    this.handleComingSoon();
  };

  sendEmail = () => {
    this.setState({
      isEmail: !this.state.isEmail,
    });
  };

  addItem = (item) => {
    const ManualInvoiceItems =
      localStorage.getItem("ManualInvoiceItems") &&
      localStorage.getItem("ManualInvoiceItems") !== "undefined" &&
      JSON.parse(localStorage.getItem("ManualInvoiceItems"));
    let items = ManualInvoiceItems ? ManualInvoiceItems : [];
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

    localStorage.setItem("ManualInvoiceItems", JSON.stringify(items));

    if (item.itemDtl ||
      item.itemDtlMeta ||
      item.business === "air" ||
      item.itemDtlEdit) {
      this.handleImportItem(item);
    }

    {
      this.setState({
        businessName: "",
        businessdetails: {},
        showpaxsection: false,
      });
    }
    //this.saveQuotation();
  };

  handleItemDelete = (item) => {
    const quotationItems = JSON.parse(localStorage.getItem("ManualInvoiceItems"));
    let items = quotationItems ? quotationItems : [];

    items = items.filter(
      (x) =>
        (x.offlineItem && x.offlineItem.uuid) !==
        (item.offlineItem && item.offlineItem.uuid)
    );

    this.setState({ items, detailsKey: this.state.detailsKey + 1 });
    localStorage.setItem("ManualInvoiceItems", JSON.stringify(items));
    //this.saveQuotation();
  };

  validate = (validateonblur) => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";
    else if (data.customerName && !this.validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/))
      errors.customerName = "< and > characters not allowed";

    //if (!this.validateFormData(data.email, "require")) errors.email = "Email required";

    if (data.email)
      if (!this.validateFormData(data.email, "email")) errors.email = "Invalid Email";

    if (!this.validateFormData(data.phone, "require") || data.phone === "+1-" || data.phone.split('-')[1] === "") errors.phone = "Phone required";

    if (data.phone)
      if (!this.validateFormData(data.phone, "phonenumber")) errors.phone = "Invalid Contact Phone";

    if (data.phone &&
      !this.validateFormData(data.phone, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.phone = Trans("_error_mobilenumber_phonenumber_length");
    //if (!this.validateFormData(data.invoicenumber, "require")) errors.invoicenumber = "Invoice number required";

    if (!this.validateFormData(data.address, "require")) {
      errors.address = "Address required";
    }
    else if (data.address && !this.validateFormData(data.address, "special-characters-not-allowed", /[<>'"]/))
      errors.address = "<,',\" and > characters not allowed";

    if (data.gstno && !this.validateFormData(data.gstno, "alpha_numeric_space"))
      errors.gstno = "Invalid GST Number";

    if (data.narration && !this.validateFormData(data.narration, "special-characters-not-allowed", /[<>]/))
      errors.narration = "< and > characters not allowed";

    if (validateonblur) {
      this.setState({ errors: errors || {} });
      if (errors) {
        return;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  changeQuotationTab = (businessName) => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      return;
    }
    else {

      this.setState({
        businessName: businessName,
        businessdetails: {},
        importItem: false,
        importItemKey: 1,
        isShowSearch: true,
        isResults: false,
        isMetaResults: false,
        isSearch: true,
        showpaxsection: false,
      }, () => {
        scroller.scrollTo("ManualInvoiceAddOffline", {
          duration: 1000,
          delay: 0,
          smooth: "easeInOutQuart",
          offset: -15
        });
      });
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

  handleImportItem = (item) => {
    this.setState({
      importItem: item,
      businessName: item.itemDtlEdit.business,
      importItemKey: this.state.importItemKey + 1,
    });
  };

  handleQuotationImportItem = (item) => {
    let cartItem = getItem(item);
    cartItem.uuid = this.generateUUID();
    this.addItem({ offlineItem: cartItem });
  };
  handleHideFareBreakupInvoice = () => {
    this.setState(preState => ({
      data: {
        ...preState.data,
        isHideFareBreakupInvoice: !this.state.data.isHideFareBreakupInvoice
      }
    }));
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
    let cartLocalId = localStorage.getItem("cartLocalId");
    window.open(`/EmailView/${cartLocalId}`, "_blank");
    //this.props.history.push(`/EmailView/${cartLocalId}`);
  };

  setpersonate = (query) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    let reqOBJ = {
      Request: query,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.setItem("personateId", data.response);
        sessionStorage.setItem("callCenterType", data.userDetail.type);
        sessionStorage.setItem("bookingForInfo", JSON.stringify(data.userDetail.details));
        sessionStorage.setItem("bookingFor", data.userDetail.details.firstName);
        let SucessMsg = this.state.type + " Created Successfully"
        this.setState({
          isBtnLoading: false,
          isBtnLoadingUpdateOnlyInvoice: false,
          isBtnLoadingAddOnlyInvoice: false,
          isBtnLoadingAddInvoiceWithBooking: false,
          isBtnLoadingAddInvoiceToBooking: false,
          isBtnLoadingAddToCustomerLedger: false,
          isBtnLoadingAddToSupplierLedger: false,
          showMessageBar: true,
          SucessMsg: SucessMsg,
          popupTitle: "Create " + this.state.type,
          popupContent: <div>
            <div>{this.state.type} Created Successfully.</div>
            <button
              className="btn btn-primary pull-right m-1 "
              onClick={() => this.props.history.push(`/ManualInvoices`)}
            >
              {Trans("Ok")}
            </button>
          </div>
        });
      }.bind(this)
    );
  };

  getbrnconfig = (item) => {
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = item.business.toLowerCase();
    if (business === "transfers" || business === "custom") business = "activity";
    let objconfig = [];
    objconfig = [
      {
        key: "isHideFareBreakupInvoice",
        value: this.state.data?.isHideFareBreakupInvoice
      },
      {
        key: "SellPrice",
        value: Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : 0),
      },
      {
        key: "CostPrice",
        value: this.getCostPrice(item),
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
            ? item.supplierCurrency.split(' ')[0]
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
        key: "TermsConditions",
        value: item.description
      });
    }

    return objconfig;
  };

  getCostPrice = (item) => {
    return item.costPrice && item.costPrice !== "" ? item.costPrice.toString().replace(/,/g, "") : 0
  }

  getAmountValue = (amount, amountToRepace) => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      amount = amount
    }
    else if (amount && !isNaN(Number(amount)) && Number(amount) === 0) {
      amount = amountToRepace ? amountToRepace : 0
    }
    else
      amount = amountToRepace ? amountToRepace : 0
    return amount;
  }
  getRequestInfo = (item, business) => {
    if (business === "hotel") {
      return [
        {
          ManualItem: {
            business: item.business,
            Name: item.name && item.name !== "" ? item.name : "Unnamed Hotel",
            Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
              Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
              : 0 : "1",
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
            images: item.imgUrl
              ? [
                {
                  URL: item.imgUrl,
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
              Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
                Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
                : 0 : "1",
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
              Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
                Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
                : 0 : "1",
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
            Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
              Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
              : 0 : "1",
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.startDate).format("YYYY-MM-DD"),
            },
            images: item.imgUrl
              ? [
                {
                  URL: item.imgUrl,
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
                    name:
                      item.itemType
                        ? item.itemType
                        : "Unnamed",
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
            Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
              Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
              : 0 : "1",
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
            images: item.imgUrl
              ? [
                {
                  URL: item.imgUrl,
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
            Amount: item.sellPrice !== "" ? Number(item.processingFees) === 0 && !item.isInclusive ?
              Number((Number(item.sellPrice) + Number(item.CGSTPrice) + Number(item.SGSTPrice) + Number(item.IGSTPrice)).toFixed(2))
              : 0 : "1",
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
              endDate: moment((item.day === "All Days" && business === "custom") ? item.endDate : item.startDate).format("YYYY-MM-DD"),
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
      return [{
        item: [...Array(hotelItem.hotelPaxInfo.length).keys()].map((data, index) => {
          let itemType = hotelItem.hotelPaxInfo[index].roomType;
          return {
            name: (itemType && itemType) || "Unnamed Room",
            id: (itemType && itemType) || "Unnamed Room",
            business: 'hotel',
            objectIdentifier: "room",
            paxInfo: this.getRoomWiseHotelPaxObj(hotelItem, index)
          };
        }),
      }]
    }
    else {
      return [
        {
          item: [
            ...Array(
              parseInt(hotelItem.noRooms === "" ? 1 : hotelItem.noRooms)
            ).keys(),
          ].map((data) => {
            return {
              name: (hotelItem.itemType && hotelItem.itemType) || "Unnamed Room",
              id: (hotelItem.itemType && hotelItem.itemType) || "Unnamed Room",
              business: hotelItem.business,
              objectIdentifier: "room",
            };
          }),
        },
      ]
    }
  }
  getRoomWiseHotelPaxObj = (hotelItem, index) => {
    let adt = {
      typeString: "ADT",
      quantity: hotelItem.hotelPaxInfo[index].noOfAdults,
      type: 0,
    };

    let chd = [...Array(hotelItem.hotelPaxInfo[index].noOfChild).keys()].flatMap((item, chdindex) => {
      return {
        typeString: "CHD",
        quantity: 1,
        type: 1,
        age: 5//hotelItem.hotelPaxInfo[index].childAge[chdindex]
      }
    });
    if (hotelItem.hotelPaxInfo[index].noOfChild > 0) {
      return [adt, chd].flatMap(x => x);
    }
    else
      return [adt];
  }
  getHotelPaxObj = (hotelItem) => {
    if (hotelItem.hotelPaxInfo.length > 0) {
      let tmpArr = [...Array(hotelItem.hotelPaxInfo.length).keys()].map((item, index) => {
        let adt = {
          typeString: "ADT",
          quantity: hotelItem.hotelPaxInfo[index].noOfAdults,
          type: 0,
        };

        let chd = [...Array(hotelItem.hotelPaxInfo[index].noOfChild).keys()].flatMap((item, chdindex) => {
          return {
            typeString: "CHD",
            quantity: 1,
            type: 1,
            age: 5//hotelItem.hotelPaxInfo[index].childAge[chdindex]
          }
        });

        if (hotelItem.hotelPaxInfo[index].noOfChild > 0) {
          return { "item": [adt, chd] };
        }
        else
          return { "item": [adt] };
      });

      return tmpArr;//.flatMap(x => x);
    }
    else {
      return [
        ...Array(parseInt(hotelItem.noRooms === "" ? 1 : hotelItem.noRooms)).keys(),
      ].map((data) => {
        return {
          typeString: "ADT",
          quantity: 2,
          type: 0,
        };
      });
    }
  }
  handleItemEdit = (item) => {
    //this.handleItemDelete(item);
    //localStorage.setItem("edititemuuid",item.offlineItem)
    this.setState({ businessName: "" }, () => {
      scroller.scrollTo("ManualInvoiceAddOffline", {
        duration: 1000,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -15
      });
    });
    this.addItem({ itemDtlEdit: item.offlineItem });
  };

  setData = () => {

    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));

    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName = this.props.mode === "Edit" ? this.props.customerName :
      bookingForInfo && bookingForInfo.firstName
        ? bookingForInfo.firstName + ' ' + (bookingForInfo.lastName ?? "")
        : this.props.customerName || "";

    defautData.email = this.props.mode === "Edit" ? this.props.email :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";

    defautData.phone = this.props.mode === "Edit" ? this.props.phone :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";

    defautData.address = this.props.mode === "Edit" ? this.props.address :
      bookingForInfo && bookingForInfo.address
        ? bookingForInfo.address
        : this.props.address || "";

    defautData.gstno = this.props.mode === "Edit" ? this.props.gstno :
      bookingForInfo && bookingForInfo.gstNumber
        ? bookingForInfo.gstNumber
        : this.props.gstno || "";

    defautData.phoneNotoValidate = defautData.phone;

    defautData.startDate = this.props.mode === "Edit" ? this.props.startDate :
      bookingForInfo && bookingForInfo.startDate
        ? bookingForInfo.startDate
        : this.props.startDate || new Date();

    defautData.endDate = this.props.mode === "Edit" ? this.props.endDate :
      bookingForInfo && bookingForInfo.endDate
        ? bookingForInfo.endDate
        : this.props.endDate || new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000);

    defautData.duration = this.GetDuration(defautData.startDate, defautData.endDate);

    defautData.createdDate = this.props.mode === "Edit" ? this.props.createdDate :
      bookingForInfo && bookingForInfo.createdDate
        ? bookingForInfo.createdDate
        : this.props.createdDate || new Date();

    if (defautData.createdDate === "0001-01-01T00:00:00")
      defautData.createdDate = new Date();
    defautData.status = this.props.status ? this.props.status : "";

    if (defautData.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
      defautData.email = "";

    this.setState({ data: defautData });
  };

  createInvoice = async (action) => {
    // let isShowUnsavedMsg = this.state.isShowUnsavedMsg;
    // if (isShowUnsavedMsg) {
    //   if (action === "updateonlyinvoice")
    //     isShowUnsavedMsg = false;
    //   else
    //     return;
    // }
    let ManualInvoiceItems = JSON.parse(localStorage.getItem("ManualInvoiceItems"));
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      return;
    }
    if (action === "addtobooking") {
      await this.CheckforAccessQuota(ManualInvoiceItems.length)
    }
    this.setState({
      isBtnLoading: true,
      isBtnLoadingAddOnlyInvoice: action === "addonlyinvoice" ? true : false,
      isBtnLoadingAddInvoiceWithBooking: action === "addinvoicewithbooking" ? true : false,
      isBtnLoadingAddInvoiceToBooking: action === "addtobooking" ? true : false,
      isBtnLoadingAddToCustomerLedger: action === "addtocustomerledger" ? true : false,
      isBtnLoadingAddToSupplierLedger: action === "addtoallledger" ? true : false,
      isBtnLoadingUpdateOnlyInvoice: action === "updateonlyinvoice" ? true : false,
      isBtnLoadingConvertToInvoice: action === "converttoinvoice" ? true : false,
      isErrorMsg: "",
      //isShowUnsavedMsg: isShowUnsavedMsg,
    });
    let data = { ...this.state.data };

    let totalInvoicePrice = 0;
    let SucessMsg = "";
    let agentbankname = "";
    let agentbankaccnumber = "";
    let agentbankifscnumber = "";
    let agentbankswiftnumber = "";
    let agentbankbranchnameaddress = "";
    let agentaccountholdername = "";
    let agencyname = "";
    for (let item of ManualInvoiceItems) {
      item.addToCartReq = this.getRequestInfo(item.offlineItem, item.offlineItem.business);
      if (item.addToCartReq[0].ManualItem.config.find(x => x.key === "totalAmount").value > 0)
        totalInvoicePrice += item.addToCartReq[0].ManualItem.config.find(x => x.key === "totalAmount").value;
      else
        totalInvoicePrice += Number(item.offlineItem.sellPrice);
      if (agentbankname === "")
        agentbankname = item.offlineItem.agentbankname;
      if (agentbankaccnumber === "")
        agentbankaccnumber = item.offlineItem.agentbankaccnumber;
      if (agentbankifscnumber === "")
        agentbankifscnumber = item.offlineItem.agentbankifscnumber;
      if (agentbankswiftnumber === "")
        agentbankswiftnumber = item.offlineItem.agentbankswiftnumber;
      if (agentbankbranchnameaddress === "")
        agentbankbranchnameaddress = item.offlineItem.agentbankbranchnameaddress;
      if (agencyname === "")
        agencyname = item.offlineItem.agencyname;
      if (agentaccountholdername === "")
        agentaccountholdername = item.offlineItem.agentbankbranchnameaddress;

    }
    var reqURL = "tw/manualinvoice/create";
    var reqOBJ = {
      type: this.state.type,
      invoicenumber: data.invoicenumber !== "" ? "M-" + data.invoicenumber : "",
      owner: data.customerName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      gstnumber: data.gstno,
      narration: data.narration,
      invoicedate: moment(data.startDate).format("YYYY-MM-DD"),
      invoiceduedate: moment(data.endDate).format("YYYY-MM-DD"),
      TotalInvoicePrice: totalInvoicePrice,
      InvoiceInsertAction: action,
      currencySymbol: Global.getEnvironmetKeyValue("portalCurrencyCode"),
      ItineraryID: data.itineraryID,
      InvoiceId: this.props.match.params?.mode === "Edit" ? this.props.match.params?.id : 0,
      PersonateID: sessionStorage.getItem("personateId"),
      agentbankname: agentbankname,
      agentbankaccnumber: agentbankaccnumber,
      agentbankifscnumber: agentbankifscnumber,
      agentbankswiftnumber: agentbankswiftnumber,
      agentbankbranchnameaddress: agentbankbranchnameaddress,
      agentaccountholdername: agentbankbranchnameaddress,
      agencyname: agencyname,
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        offlineItems: ManualInvoiceItems,
      }
    };
    apiRequester_dxcoretourwizonline_api(
      reqURL,
      reqOBJ,
      function (res) {
        if (res.response && Object.keys(res.response).length > 0) {
          if (action === "addonlyinvoice" || action === "addinvoicewithbooking") {
            SucessMsg = this.state.type + " Created Successfully";
            localStorage.removeItem("ManualInvoiceItems");
            if (sessionStorage.getItem("customer-info") == null
              || (sessionStorage.getItem("customer-info") !== null
                && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length === 1)) {
              this.setpersonate(data.phone);
            }
            else {
              this.setState({
                isBtnLoading: false,
                isBtnLoadingUpdateOnlyInvoice: false,
                isBtnLoadingAddOnlyInvoice: false,
                isBtnLoadingAddInvoiceWithBooking: false,
                isBtnLoadingAddInvoiceToBooking: false,
                isBtnLoadingAddToCustomerLedger: false,
                isBtnLoadingAddToSupplierLedger: false,
                showMessageBar: true,
                SucessMsg: SucessMsg,
                popupTitle: "Create " + this.state.type,
                popupContent: this.state.showMessageBar ? "" : <div>
                  <div>{this.state.type} Created Successfully.</div>
                  <button
                    className="btn btn-primary pull-right m-1 "
                    onClick={() => this.props.history.push(`/ManualInvoices`)}
                  >
                    {Trans("Ok")}
                  </button>
                </div>
              });
            }
          }
          else {
            if (action === "addtobooking") { SucessMsg = this.state.type + " Added In Booking Successfully" }
            if (action === "addtocustomerledger") { SucessMsg = this.state.type + " Added In Customer Ledger Successfully" }
            if (action === "addtoallledger") { SucessMsg = this.state.type + " Added In Supplier Ledger Successfully" }
            if (action === "updateonlyinvoice") { SucessMsg = this.state.type + " Updated Successfully" }
            if (action === "converttoinvoice") { SucessMsg = "Invoice Created Successfully" }

            this.setState({
              showMessageBar: true,
              SucessMsg: SucessMsg,
              isBtnLoading: false,
              isBtnLoadingUpdateOnlyInvoice: false,
              isBtnLoadingAddOnlyInvoice: false,
              isBtnLoadingAddInvoiceWithBooking: false,
              isBtnLoadingAddInvoiceToBooking: false,
              isBtnLoadingAddToCustomerLedger: false,
              isBtnLoadingAddToSupplierLedger: false,
              isBtnLoadingAddToSupplierLedger: action === "converttoinvoice" ? true : false
            });
          }
        }
        else {
          let errormsg = '';
          if (res.error.includes("Given Mobile Number") || res.error.includes("Given Email is")) {
            errormsg = res.error;
          }
          else {
            errormsg = 'Oops! Something Went Wrong - There may be an issue with your input data. Please try again or visit our help center if you need a hand.';
          }
          this.setState({
            isErrorMsg: errormsg,
            isBtnLoading: false,
            isBtnLoadingUpdateOnlyInvoice: false,
            isBtnLoadingAddOnlyInvoice: false,
            isBtnLoadingAddInvoiceWithBooking: false,
            isBtnLoadingAddInvoiceToBooking: false,
            isBtnLoadingAddToCustomerLedger: false,
            isBtnLoadingAddToSupplierLedger: false,
          });
        }
      }.bind(this),
    );
  }

  getinvoicedetail = (invoiceid) => {
    this.setState({ isLoading: true });
    let reqURL = "tw/manualinvoice/details?invoiceid=" + Number(invoiceid)
    let reqOBJ = {}
    apiRequester_dxcoretourwizonline_api(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response.length > 0) {
          let newData = { ...this.state.data };
          newData.customerName = data.response[0].customerName;
          if (data.response[0].customerEmail.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
            newData.email = "";
          else {
            newData.email = data.response[0].customerEmail;
          }
          newData.type = data.response[0].type ?? "Invoice";
          newData.phone = data.response[0].customerPhone;
          newData.startDate = data.response[0].invoiceDate;
          newData.endDate = data.response[0].invoiceDueDate;
          newData.invoicenumber = data.response[0].invoiceNumber.split('-')[1];
          newData.itineraryID = data.response[0].itineraryID;
          newData.customerledger = data.response[0].addToCustomerLedger;
          newData.addToBooking = data.response[0].addToBooking;
          newData.convertToInvoice = data.response[0].convertToInvoice ?? "";
          newData.addToSupplierLedger = data.response[0].addToSupplierLedger;
          newData.isBookingInProgress = data.response[0].isBookingInProgress;
          newData.gstno = data.response[0].gsTnumber;
          newData.address = data.response[0].address || "Address";
          newData.narration = data.response[0].narration;
          localStorage.setItem("ManualInvoiceItems", data.response[0].manualInvoiceData)
          this.setState({ data: newData, items: JSON.parse(data.response[0].manualInvoiceData), isLoading: false });
        }
      }.bind(this),
      "GET"
    );
  }
  closesPopup = () => {
    this.setState({ showPopup: false, popupTitle: "", popupContent: "" });
  }
  closesMessageBar = () => {
    const { mode } = this.props.match.params;

    if (mode === "Edit") {
      //window.location.reload();
      this.setState({ showMessageBar: false });
      this.getinvoicedetail(this.props.match.params.id);
      if (this.state.isBtnLoadingAddToSupplierLedger)
        this.props.history.push(`/ManualInvoices`);
    }
    else {
      this.props.history.push(`/ManualInvoices`)
    }
  }

  getPackageDetails = (id) => {
    // this.setState({ isLoading: true, isEditModeLoading: true });

    let bookingForInfo = JSON.parse(sessionStorage.getItem("packageInquiryBook"));
    let newData = { ...this.state.data };
    newData.customerName = bookingForInfo.data.customerName;
    newData.email = bookingForInfo.data.email;
    newData.address = "Address";
    newData.phone = bookingForInfo.data.phone;
    newData.title = bookingForInfo.data.title;
    newData.startDate = new Date();
    newData.endDate = new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000);
    this.setState({ data: newData, businessName: "custom" });
    // newData.address = "fsdf";
    // newData.title = "sdfsdfsdf";
    // this.setState({ data: newData, packageResult: resonsedata.response.package[0], isLoading: false, businessName: "custom" });


    // const reqOBJ = {};
    // let reqURL =
    //   "cms/package/getbyid?id=" +
    //   atob(this.props.match.params.id); //getbyid?id=" + id;
    // apiRequester_unified_api(
    //   reqURL,
    //   reqOBJ,
    //   function (resonsedata) {
    //     if (resonsedata.response.package.length > 0) {
    //       let newData = { ...this.state.data };
    //       newData.customerName = resonsedata.response.package[0].twCustomerName;
    //       if (resonsedata.response.package[0].twCustomerEmail.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")))
    //         newData.email = "";
    //       else {
    //         newData.email = resonsedata.response.package[0].twCustomerEmail;
    //       }
    //       newData.address = "fsdf";
    //       newData.phone = resonsedata.response.package[0].twCustomerPhone;
    //       //newData.startDate = resonsedata.response.package[0].validFrom;
    //       //newData.endDate = resonsedata.response.package[0].validTo;
    //       //newData.invoicenumber = "";//data.response[0].invoiceNumber.split('-')[1];
    //       //newData.itineraryID = "";//data.response[0].itineraryID;
    //       //newData.customerledger = "";//data.response[0].addToCustomerLedger;
    //       //newData.addToBooking = "";//data.response[0].addToBooking;
    //       //newData.addToSupplierLedger = "";//data.response[0].addToSupplierLedger;
    //       //newData.gstno = "";//data.response[0].gsTnumber;
    //       //newData.address = "";//data.response[0].address;
    //       //newData.narration = "";//data.response[0].narration;
    //       //localStorage.setItem("ManualInvoiceItems", data.response[0].manualInvoiceData)
    //       newData.address = "fsdf";
    //       newData.title = "sdfsdfsdf";
    //       this.setState({ data: newData, packageResult: resonsedata.response.package[0], isLoading: false, businessName: "custom" });

    //     }
    //   }.bind(this),
    //   "GET"
    // );
  }
  getQuickProposalDetails = (id) => {
    // this.setState({ isLoading: true, isEditModeLoading: true });
    let defautData = { ...this.state.data };
    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    let quickProposalInfo = JSON.parse(localStorage.getItem("QuickProposalData"));
    let quickProposalItem = JSON.parse(localStorage.getItem("QuickProposalItemData"));
    debugger;
    let newData = this.state.data;
    let newQuickData = this.state.quickProposal;
    newData.customerName = quickProposalInfo?.customerName;
    newData.email = quickProposalInfo.email;
    newData.phone = quickProposalInfo.phone;
    newData.title = quickProposalInfo.title;
    newData.address = bookingForInfo.address || "";

    newData.gstno = bookingForInfo.gstNumber || "";
    // newData.address = quickProposalInfo.address || "";
    // newData.gstno = quickProposalInfo.gstno || "";
    newData.startDate = new Date();
    newData.endDate = new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000);
    newQuickData.title = quickProposalInfo.title;
    newQuickData.startDate = quickProposalInfo.startDate;
    newQuickData.endDate = quickProposalInfo.endDate;
    newQuickData.sellPrice = quickProposalItem[0].offlineItem.sellPrice;
    newQuickData.supplierCurrency = quickProposalItem[0].offlineItem.supplierCurrency;
    newQuickData.conversionRate = quickProposalItem[0].offlineItem.conversionRate;
    newQuickData.description = quickProposalItem[0].offlineItem.description;
    newQuickData.costPrice = quickProposalItem[0].offlineItem.costPrice;
    newQuickData.sellPrice = quickProposalItem[0].offlineItem.sellPrice;
    newQuickData.supplierCostPrice = quickProposalItem[0].offlineItem.supplierCostPrice;
    newQuickData.supplierTaxPrice = quickProposalItem[0].offlineItem.supplierTaxPrice;
    newQuickData.markupPrice = quickProposalItem[0].offlineItem.markupPrice;
    newQuickData.discountPrice = quickProposalItem[0].offlineItem.discountPrice;
    newQuickData.CGSTPrice = quickProposalItem[0].offlineItem.CGSTPrice;
    newQuickData.IGSTPrice = quickProposalItem[0].offlineItem.IGSTPrice;
    newQuickData.SGSTPrice = quickProposalItem[0].offlineItem.SGSTPrice;
    newQuickData.amountWithoutGST = quickProposalItem[0].offlineItem.amountWithoutGST;
    newQuickData.isInclusive = quickProposalItem[0].offlineItem.isInclusive;
    newQuickData.percentage = quickProposalItem[0].offlineItem.percentage;
    newQuickData.processingFees = quickProposalItem[0].offlineItem.processingFees;
    newQuickData.isTax1Modified = quickProposalItem[0].offlineItem.isTax1Modified;
    newQuickData.isTax2Modified = quickProposalItem[0].offlineItem.isTax2Modified;
    newQuickData.isTax3Modified = quickProposalItem[0].offlineItem.isTax3Modified;
    newQuickData.isTax4Modified = quickProposalItem[0].offlineItem.isTax4Modified;
    newQuickData.isTax5Modified = quickProposalItem[0].offlineItem.isTax5Modified;
    newQuickData.tax1 = quickProposalItem[0].offlineItem.tax1;
    newQuickData.tax2 = quickProposalItem[0].offlineItem.tax2;
    newQuickData.tax3 = quickProposalItem[0].offlineItem.tax3;
    newQuickData.tax4 = quickProposalItem[0].offlineItem.tax4;
    newQuickData.tax5 = quickProposalItem[0].offlineItem.tax5;
    newQuickData.taxType = quickProposalItem[0].offlineItem.taxType;
    newQuickData.totalAmount = quickProposalItem[0].offlineItem.totalAmount;
    newQuickData.isShowTax = quickProposalItem[0].offlineItem.isShowTax;
    newQuickData.isSellPriceReadonly = quickProposalItem[0].offlineItem.isSellPriceReadonly;
    newQuickData.IGST = quickProposalItem[0].offlineItem.IGST;
    newQuickData.CGST = quickProposalItem[0].offlineItem.CGST;
    newQuickData.SGST = quickProposalItem[0].offlineItem.SGST;
    newQuickData.description = quickProposalItem[0].offlineItem.description;
    this.setState({ data: newData, businessName: "custom", quickProposal: newQuickData });
  }
  componentDidMount = () => {
    const { mode } = this.props.match.params;
    //this.getAuthToken();
    this.setData();
    if (mode === "Edit") {
      localStorage.removeItem("ManualInvoiceItems");
      this.setState({ packageResult: "", items: [] });
      this.getinvoicedetail(this.props.match.params.id);
    }
    else if (mode === "PackageInvoice") {
      localStorage.removeItem("ManualInvoiceItems");
      this.setState({ packageResult: "", items: [] });
      this.getPackageDetails();
    }
    else if (mode === "quickProposal") {
      localStorage.removeItem("ManualInvoiceItems");
      this.setState({ packageResult: "", items: [] });
      this.getQuickProposalDetails();
    }
    else {
      if (this.state.data.customerName === "") {
        localStorage.removeItem("ManualInvoiceItems");
        this.setState({ packageResult: "", items: [] });

      }
    }
  }

  handleCheckforFreeExcess = (action, isLoading) => {
    if (isLoading || this.state.isBtnLoading)
      return false;

    this.setState({
      isBtnLoading: true,
      isBtnLoadingAddOnlyInvoice: action === "addonlyinvoice" ? true : false,
      isBtnLoadingAddInvoiceWithBooking: action === "addinvoicewithbooking" ? true : false,
      isBtnLoadingAddInvoiceToBooking: action === "addtobooking" ? true : false,
      isBtnLoadingAddToCustomerLedger: action === "addtocustomerledger" ? true : false,
      isBtnLoadingAddToSupplierLedger: action === "addtoallledger" ? true : false,
      isBtnLoadingUpdateOnlyInvoice: action === "updateonlyinvoice" ? true : false,
      isBtnLoadingConvertToInvoice: action === "converttoinvoice" ? true : false,
    });

    if (!GlobalEvents.handleCheckforFreeExcess(this.props, "QuotationDetails~quotation-book-quotation")) {
      this.setState({
        isSubscriptionPlanend: true,
        isBtnLoading: false,
        isBtnLoadingAddOnlyInvoice: false,
        isBtnLoadingAddInvoiceWithBooking: false,
        isBtnLoadingAddInvoiceToBooking: false,
        isBtnLoadingAddToCustomerLedger: false,
        isBtnLoadingAddToSupplierLedger: false,
        isBtnLoadingUpdateOnlyInvoice: false,
      });

      return false
    }
    this.createInvoice(action);
  }
  handleCustomerChange = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));

    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName = this.props.mode === "Edit" ? this.props.customerName :
      bookingForInfo && bookingForInfo.firstName
        ? bookingForInfo.firstName + ' ' + (bookingForInfo.lastName ?? "")
        : this.props.customerName || "";

    defautData.email = this.props.mode === "Edit" ? this.props.email :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";

    defautData.phone = this.props.mode === "Edit" ? this.props.phone :
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";

    defautData.address = this.props.mode === "Edit" ? this.props.address :
      bookingForInfo && bookingForInfo.address
        ? bookingForInfo.address
        : this.props.address || "";

    defautData.gstno = this.props.mode === "Edit" ? this.props.gstno :
      bookingForInfo && bookingForInfo.gstNumber
        ? bookingForInfo.gstNumber
        : this.props.gstno || "";

    this.setState({ data: defautData });
  }
  render() {
    const {
      type,
      items,
      detailsKey,
      errors,
      importItemKey,
      isShowSucessMsg,
      isErrorMsg,
      data,
      isLoading,
      isBtnLoadingUpdateOnlyInvoice,
      isBtnLoadingAddOnlyInvoice,
      isBtnLoadingAddInvoiceWithBooking,
      isBtnLoadingAddInvoiceToBooking,
      isBtnLoadingAddToCustomerLedger,
      isBtnLoadingAddToSupplierLedger,
      isBtnLoadingConvertToInvoice,
      packageResult,
    } = this.state;
    let isShowUnsavedMsg = this.state.isShowUnsavedMsg;
    let { userInfo } = this.props;
    userInfo.firstName = "";
    userInfo.lastName = "";

    const { mode } = this.props.match.params;
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let importItem = this.state.importItem;
    let businessName = this.state.businessName;
    let showpaxsection = this.state.showpaxsection;
    let hotelPaxInfo = this.state.businessdetails.hotelPaxInfo;
    let businessdetails = { ...this.state.businessdetails }
    if (importItem) {
      businessName = importItem.itemDtlEdit.business;
      //showpaxsection = true;
      hotelPaxInfo = importItem.itemDtlEdit.hotelPaxInfo;
      businessdetails = importItem.itemDtlEdit;
      isShowUnsavedMsg = true;
    }
    if (!AuthorizeComponentCheck(userInfo.rolePermissions, "dashboard-menu~invoice-create-invoice")) {
      this.props.history.push('/');
    }
    return (
      <div className="quotation">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {mode === "Create" || mode === "PackageInvoice"
                ? "Create " + type
                : mode === "Edit"
                  ? "Edit " + type
                  : ""}
            </title>
          </Helmet>
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="text-white m-0 p-0 f30">
                  <SVGIcon
                    name="file-text"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGIcon>

                  {mode === "Create" || mode === "quickProposal" || mode === "PackageInvoice"
                    ? "Create " + type
                    : mode === "Edit"
                      ? "Edit " + type
                      : ""}
                </h1>
              </div>
              <div className="col-lg-6">
                {mode !== "DetailsInquiry" &&
                  (
                    <button
                      className="btn btn-sm btn-primary pull-right"
                      onClick={() => this.props.history.push(`/ManualInvoices`)}
                    >
                      {Trans("Manage Invoices/Voucher")}
                    </button>
                  )}
                {mode !== "Create" && mode !== "Edit" && mode !== "quickProposal" &&
                  (
                    <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                      <button
                        className="btn btn-sm btn-primary pull-right mr-2"
                        onClick={() => this.props.history.push(`/invoice/Create`)}
                      >
                        {Trans("Create " + type)}
                      </button>
                    </AuthorizeComponent>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {isLoading &&
            <div className="row p-3">
              <div className="container ">
                <Loader />
              </div>
            </div>
          }
          {!isLoading &&
            <React.Fragment>
              <div className="quotation-details border shadow-sm mt-3">
                <div className="border-bottom bg-light d-flex p-3">
                  <div className="mr-auto d-flex align-items-center">
                    <SVGIcon
                      name={"file-text"}
                      className="mr-2 d-flex align-items-center"
                      width="24"
                      type="fill"
                    ></SVGIcon>
                    <h6 className="font-weight-bold m-0 p-0">{this.state.type} Details</h6>
                  </div>
                </div>
                <div className="row p-3">
                  {true && (
                    <React.Fragment>
                      <div className="col-lg-6">
                        {((mode === "Edit" && this.state.data.phone) || mode !== "Edit" || mode === "quickProposal") &&
                          <CustomerAddSelect
                            key={Math.random()}
                            isReadOnly={mode === "Edit"}
                            userInfo={this.props.userInfo}
                            errors={this.state.errors}
                            handleChange={this.handleCustomerChange}
                            selectedCustomer={mode === "Edit" || mode === "quickProposal"
                              ? {
                                "name": this.state.data.customerName,
                                "contactInformation": {
                                  "email": this.state.data.email,
                                  "phoneNumber": this.state.data.phone,
                                }
                              }
                              : null}
                          />
                        }
                      </div>
                      <div className="col-lg-3">
                        {this.renderInput("address", Trans("_lblAddressWithStar"), null, (mode === "Edit" && data.itineraryID !== 0 ? true : false))}
                      </div>

                      {mode === "Edit" &&
                        <div className="col-lg-3">
                          {/* {this.renderInput("invoicenumber", Trans("Invoice Number"))} */}
                          <label className="">{Trans(this.state.type + " Number")} *</label>
                          <div className="input-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text">M-</span>
                            </div>
                            {/* <input type="text" maxlength="30" onChange={(e) => this.handleOwnSubDomain(e)} class="form-control text-lowercase" aria-label="Recipient's username" aria-describedby="basic-addon2" /> */}
                            <input name="invoicenumber" disabled={mode === "Edit" ? true : false} value={data.invoicenumber} class="form-control" onChange={(e) => this.handleChange({ currentTarget: { name: e.target.name, value: e.target.value } })} onBlur={(e) => this.validate(true)} />
                          </div>
                          {errors["invoicenumber"] &&
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["invoicenumber"]}
                            </small>
                          }
                        </div>
                      }

                      <div className="col-lg-3">
                        {this.renderCurrentDateWithDuration("startDate", Trans(type + " Date"), moment("2001-01-01").format("YYYY-MM-DD"), null, null, (mode === "Edit" && data.itineraryID !== 0 ? true : false))}
                      </div>
                      {type !== "Voucher" &&
                        <div className="col-lg-3">
                          {this.renderCurrentDateWithDuration("endDate", Trans(type + " Due Date"), moment("2001-01-01").format("YYYY-MM-DD"), null, null, (mode === "Edit" && data.itineraryID !== 0 ? true : false))}
                        </div>}

                      <div className="col-lg-3">
                        {this.renderInput("gstno", Trans("GST Number"), null, (mode === "Edit" && data.itineraryID !== 0 ? true : false))}
                      </div>

                      <div className="col-lg-3">
                        {this.renderInput("narration", Trans("Narration"), null, (mode === "Edit" && data.itineraryID !== 0 ? true : false))}
                      </div>
                      <div className={mode === "Edit" ? "col-lg-3 d-none" : "col-lg-3 mt-4 d-none"}>
                        <small>
                          <div className={mode === "Edit"
                            ? "custom-control custom-checkbox d-inline-block mr-2 mb-2 "
                            : "custom-control custom-checkbox d-inline-block mr-2 mb-2 mt-3"}>
                            <input
                              id="isHideFareBreakupInvoice"
                              name="isHideFareBreakupInvoice"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.data?.isHideFareBreakupInvoice}
                              onChange={this.handleHideFareBreakupInvoice}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="isHideFareBreakupInvoice"
                            >
                              Hide Fare Breakup In Invoice
                            </label>
                          </div>
                        </small>
                      </div>

                      {isErrorMsg && (
                        <div className="col-lg-12">
                          <h6 className="alert alert-danger mt-3 d-inline-block">
                            {isErrorMsg}
                          </h6>
                        </div>
                      )}

                      {isShowSucessMsg && (
                        <div className="col-lg-12">
                          <h6 className="alert alert-success mt-3 d-inline-block">
                            {type} Created Successfully!
                          </h6>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>

                {this.props.customerName && !this.props.removedeletebutton && (
                  <button
                    className="btn btn-sm position-absolute p-1 border-left border-bottom rounded-0 bg-light"
                    style={{ top: "0px", right: "0px" }}
                    onClick={this.handleCreate}
                  >
                    <SVGIcon
                      name="times"
                      width="16"
                      height="16"
                      className="d-flex align-items-center text-secondary"
                    ></SVGIcon>
                  </button>
                )}
              </div>
              {data.itineraryID === 0 && !importItem.itemDtlEdit &&
                <SearchWidgetModeQuotationTabs
                  changeTab={this.changeQuotationTab}
                  type={this.props?.match?.path?.includes('ManualVoucher')
                    ? "manual-voucher" : "manual-invoice"}
                  userInfo={this.props.userInfo} />
              }
              <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                {businessName !== "" && (
                  <React.Fragment>
                    <React.Fragment>
                      <div>
                        <div name="ManualInvoiceAddOffline" className="quotation-details border shadow-sm mt-3">

                          <ManualInvoiceAddOffline
                            mode={mode}
                            business={businessName}
                            handleOffline={this.handleOffline}
                            handleDateChange={this.props.setDate}
                            type={type}
                            packageResult={packageResult}
                            handleData={this.handleData}
                            importItem={importItem.itemDtlEdit}
                            key={businessName}
                            userInfo={userInfo}
                            quickProposal={this.state.quickProposal}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  </React.Fragment>
                )}
              </AuthorizeComponent>
              {showpaxsection &&
                <div>
                  <div className="shadow-sm mt-4" name="TravellersManualinvoice">
                    <TravellersManualinvoice
                      items={hotelPaxInfo}
                      {...businessdetails}
                      guestdetails={businessdetails.guestdetails}
                      handleAddTravellers={this.addTravellers}
                      userInfo={userInfo}
                      importItem={importItem.itemDtlEdit}
                      category={type}
                    //continueAsGuest={this.state.continueAsGuest}
                    />
                  </div>
                </div>
              }
              {false && //isShowUnsavedMsg &&
                <div className="mt-3 d-flex align-items-center alert alert-danger">
                  <SVGIcon
                    name={"file-text"}
                    className="mr-2 d-flex align-items-center"
                    width="24"
                    type="fill"
                  ></SVGIcon>
                  <h6 className="font-weight-bold m-0 p-0">{"You have Unsaved data.Please Click Update " + type + " button to proceed."}</h6>
                </div>
              }
              {items && items.length > 0 && (
                <React.Fragment>
                  <ManualInvoiceItemsDetails
                    key={"detailsKey" + detailsKey}
                    items={items}
                    handleItemDelete={this.handleItemDelete}
                    handleItemEdit={this.handleItemEdit}
                    removeEditDeleteBtn={data.itineraryID === 0 ? false : true}
                    invoiceid={mode === "Edit" ? Number(this.props.match.params.id) : null}
                    mode={mode}
                    userInfo={userInfo}
                    category={type}
                  />
                </React.Fragment>
              )}
              <div className="quotation-action-buttons text-center">
                {items && items.length > 0 &&
                  <React.Fragment>
                    <div className="form-group">
                      <label className="d-block">&nbsp;</label>
                      {mode === "Edit" && data.isBookingInProgress &&
                        <div className="text-center d-flex justify-content-center align-items-center">
                          <div className="alert alert-info col-10" role="alert">
                            Please wait a moment before attempting your next action as the last action is still in progress. Please refresh after sometime.
                          </div>
                        </div>
                      }
                      {mode === "Edit" && !data.isBookingInProgress &&
                        <React.Fragment>
                          {data.itineraryID === 0 &&
                            <AuthorizeComponent title="invoiceEdit~invoice-update-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              <button onClick={() => { this.createInvoice("updateonlyinvoice") }} className="btn btn-sm btn-outline-primary ml-2 mr-2">
                                {isBtnLoadingUpdateOnlyInvoice && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                {Trans("Update " + type)}
                              </button>
                            </AuthorizeComponent>
                          }
                          <AuthorizeComponent title="invoiceEdit~invoice-update-voucher-convert-to-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            {type === "Voucher" && (data.convertToInvoice === "" || data.convertToInvoice === "False") &&
                              <button
                                onClick={() => this.handleCheckforFreeExcess("converttoinvoice", isBtnLoadingConvertToInvoice)}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2">
                                {isBtnLoadingConvertToInvoice && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                Convert to Invoice
                              </button>

                            }
                          </AuthorizeComponent>
                          <AuthorizeComponent title="invoiceEdit~invoice-addtobooking-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            {type === "Invoice" && (data.addToBooking === "" || data.addToBooking === "False") &&
                              <button
                                onClick={() => this.handleCheckforFreeExcess("addtobooking", isBtnLoadingAddInvoiceToBooking)}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2">
                                {isBtnLoadingAddInvoiceToBooking && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                {Trans("Add To Booking")}
                              </button>
                            }
                            {(type === "Invoice" && data.addToBooking !== "" && data.addToBooking === "True") &&
                              <button className="btn btn-sm btn-outline-success ml-2 mr-2">
                                <SVGIcon name={"yes"} type="fill"></SVGIcon>{" "}
                                {Trans("Add To Booking")}
                              </button>
                            }
                          </AuthorizeComponent>
                          <AuthorizeComponent title="invoiceEdit~invoice-addtocustomerledger-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            {type === "Invoice" && (data.customerledger === "" || data.customerledger === "False") &&
                              <button
                                onClick={() => this.handleCheckforFreeExcess("addtocustomerledger", isBtnLoadingAddToCustomerLedger)}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2">
                                {isBtnLoadingAddToCustomerLedger && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                {Trans("Add To Customer Ledger")}
                              </button>
                            }
                            {(type === "Invoice" && data.customerledger !== "" && data.customerledger === "True") &&
                              <button className="btn btn-sm btn-outline-success ml-2 mr-2">
                                <SVGIcon name={"yes"} type="fill"></SVGIcon>{" "}
                                {Trans("Add To Customer Ledger")}
                              </button>
                            }
                          </AuthorizeComponent>
                          <AuthorizeComponent title="invoiceEdit~invoice-addtoallledger-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            {type === "Invoice" && (data.addToSupplierLedger === "" || data.addToSupplierLedger === "False") &&
                              <button
                                onClick={() => this.handleCheckforFreeExcess("addtoallledger", isBtnLoadingAddToSupplierLedger)}
                                className="btn btn-sm btn-outline-primary ml-2 mr-2">
                                {isBtnLoadingAddToSupplierLedger && (
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                )}
                                {Trans("Add To All Ledger")}
                              </button>
                            }
                            {(type === "Invoice" && data.addToSupplierLedger !== "" && data.addToSupplierLedger === "True") &&
                              <button className="btn btn-sm btn-outline-success ml-2 mr-2">
                                <SVGIcon name={"yes"} type="fill"></SVGIcon>{" "}
                                {Trans("Add To All Ledger")}
                              </button>
                            }
                          </AuthorizeComponent>
                        </React.Fragment>
                      }
                      {mode !== "Edit" &&
                        <React.Fragment>
                          <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            <button
                              onClick={() => this.handleCheckforFreeExcess("addonlyinvoice", isBtnLoadingAddOnlyInvoice)}
                              className="btn btn-sm btn-outline-primary ml-2 mr-2">
                              {isBtnLoadingAddOnlyInvoice && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              {Trans("Create " + type)}
                            </button>
                          </AuthorizeComponent>
                          {/* <button onClick={() => {  !isBtnLoadingAddInvoiceWithBooking ? this.createInvoice("addinvoicewithbooking") : "" }} className="btn btn-sm btn-outline-primary ml-2 mr-2">
                      {isBtnLoadingAddInvoiceWithBooking && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      {Trans("Add Invoice With Booking")}
                    </button> */}
                        </React.Fragment>
                      }
                    </div>
                    {mode === "Edit" &&
                      <AuthorizeComponent title="invoiceEdit~invoice-update-voucher-convert-to-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        {type === "Voucher" && (data.convertToInvoice === "" || data.convertToInvoice === "False") &&
                          <small class="text-secondary">When you convert a voucher into an invoice, you won't be able to access the voucher anymore. However, you can view the voucher again by booking the invoice.</small>
                        }
                      </AuthorizeComponent>
                    }
                  </React.Fragment>
                }
                {/* {(!items || items.length === 0) &&
              <React.Fragment>
                <div className="quotation-details border shadow-sm mt-3">
                  <div className="border-bottom bg-light d-flex p-3">
                    <div className="mr-auto d-flex align-items-center">
                      <SVGIcon
                        name={"file-text"}
                        className="mr-2 d-flex align-items-center"
                        width="24"
                        type="fill"
                      ></SVGIcon>
                      <h6 className="font-weight-bold m-0 p-0">Invoice Items</h6>
                    </div>
                  </div>
                  <div className="p-4 text-center">No Item(s) in Invoice.</div>
                </div>
                <div className="form-group">
                  <label className="d-block">&nbsp;</label>
                  {mode === "Edit" && data.itineraryID === 0 &&
                    <button onClick={() => { this.createInvoice("updateonlyinvoice") }} className="btn btn-sm btn-outline-primary ml-2 mr-2">
                      {isBtnLoadingUpdateOnlyInvoice && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      {Trans("Update Invoice")}
                    </button>
                  }
                </div>
              </React.Fragment>
            } */}
              </div>
              {(isBtnLoadingAddInvoiceWithBooking || isBtnLoadingAddInvoiceToBooking || isBtnLoadingAddToCustomerLedger ||
                isBtnLoadingAddToSupplierLedger) &&
                <div className="text-center d-flex justify-content-center align-items-center">
                  <div className="alert alert-info col-6" role="alert">
                    Please avoid refreshing or reloading page while actions are in progress.
                  </div>
                </div>}
            </React.Fragment>
          }
        </div>
        {this.state.showMessageBar &&
          <MessageBar Message={this.state.SucessMsg} handleClose={() => { this.closesMessageBar() }
          } />
        }

        {this.state.showPopup &&
          <ModelPopup
            sizeClass={this.state.popupSizeClass}
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.closesPopup}
          />
        }

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
      </div>
    );
  }
}

export default ManualInvoice;

const itemTypeList = [
  { name: "Select Custom Type", value: "" },
  { name: "Visa", value: "Visa" },
  { name: "Rail", value: "Rail" },
  { name: "Forex", value: "Forex" },
  { name: "Bus", value: "Bus" },
  { name: "Rent a Car", value: "Rent a Car" },
  { name: "Other", value: "Other" }
];
