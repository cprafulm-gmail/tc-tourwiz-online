import React from "react";
import { Link } from "react-scroll";
import useForm from "../components/common/useForm";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import Loader from "../components/common/loader";
import MessageBar from "../components/admin/message-bar";
import * as Global from "../helpers/global";
import SVGIcon from "../helpers/svg-icon";
import moment from "moment";
import FileBase64 from "../components/common/FileBase64";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
import AuthorizeComponent, {
  AuthorizeComponentCheck,
} from "../components/common/authorize-component";
import CustomerAddSelect from "../components/common/customer-add-select";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import ModelPopup from "../helpers/model";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import { useState, useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import TaxQuotationAddOffline from "../components/quotation/tax-quotation-add-offline";
import PackageAssistant from "./package-assistant";
import PackageAssistantHeader from "./package-assistant-header";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAssistantFooter from "./package-assistant-footer";
import PackageAIAssitant from "./package-ai-assistant";
import { useParams, useLocation } from 'react-router-dom';
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

const PackageForm = (props) => {
  const location = useLocation();
  let useParamsd = useParams();
  const isMarketplaceMode = location.pathname.indexOf("/packagemarketplace/") > -1 ? true : false;
  const isQuickPackage = location.pathname.indexOf("/QuickPackage/") > -1 ? true : false;
  const isMasterPackage = location.pathname.indexOf("/masterpackage/") > -1 ? true : false;
  const [data, setData] = useState({
    siteURL: "",
    countryID: "101",
    stateID: "",
    cityID: "",
    validFrom: moment().add(0, "d").format(Global.DateFormate),
    validTo: moment().add(5, "d").format(Global.DateFormate),
    bookingStartDate: "",
    bookingEndDate: "",
    packageName: "",
    specialPromotionType: "",
    summaryDescription: "",
    description: "",
    termsConditions: "",
    sellPrice: "",
    sellPriceDisplay: "",
    currencyID: "1",
    isShowOnHomePage: false,
    isHideFareBreakupInvoice: false,
    packageThemes: props.isFromContentManager ? props.dealsType : 3,
    cultureCode: "en-US",
    offerPrice: "",
    rating: 0,
    agentId: props.userInfo.agentID,
    userId: props.userInfo.agentID,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    images: [],
    inclusionExclusion: [],
    exclusion: "",
    flight: "",
    hotelDetails: "",
    inclusion: "",
    imagesURL: [],
    packageBrochure: [],
    supplierCurrency: "",
    conversionRate: "",
    supplierCostPrice: "",
    supplierTaxPrice: "",
    costPrice: 0,
    markupPrice: "",
    discountPrice: "",
    CGSTPrice: "",
    SGSTPrice: "",
    IGSTPrice: "",
    brn: "",
    bookBefore: "",
    vendor: "",
    twPriceGuideLine: "",
    isSellPriceReadonly: false,
    isShowOnMarketPlace: isMarketplaceMode,
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
    isSellPriceReadonly: false,
    isTax1Modified: false,
    isTax2Modified: false,
    isTax3Modified: false,
    isTax4Modified: false,
    isTax5Modified: false,
    supplierCostPriceAdult: "",
    supplierCostPriceChild: "",
    supplierCostPriceInfant: "",
    Adults: 1,
    Child: 0,
    Infants: 0,
    inquiryId: "",
    status: "New",
    bookingFor: "Individual",
    tripType: "",
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    portalURL: "",
    isCMSPortalCreated: false,
    packageLargeImages: [],
    packageBrochure: [],
    providerID: props.userInfo.portalAgentID,
    mode: props.isFromContentManager ? props.mode : props.match.params.mode.toLowerCase(),
    showSuccessMessage: false,
    isLoading: false,
    LoadingFile: false,
    isLoadingEditMode: ((props.isFromContentManager ? props.mode : props.match.params.mode) === "Edit" || (props.isFromContentManager ? props.mode : props.match.params.mode) === "Use"),
    isEditModeLoading: ((props.isFromContentManager ? props.mode : props.match.params.mode) === "Edit" || (props.isFromContentManager ? props.mode : props.match.params.mode) === "Use"),
    CountryList: [],
    LoadingCountryList: false,
    StateList: [],
    LoadingStateList: false,
    CityList: [],
    LoadingCityList: false,
    CurrencyList: [],
    LoadingCurrencyList: false,
    isShowExtraFields: false,
    popupContent: "",
    popupTitle: "",
    showPopup: false,
    sampleImageObj: {
      fileExtension: "",
      fileContentType: "",
      fileData: "",
      fileName: "",
    },
    activeTab: isQuickPackage ? "Itinerary" : "Overview",
    activePoint: "",
    isBookPackagePopup: false,
    bookNoOfPax: 1,
    isBookPackageLoading: false,
    isBookPackageError: "",
    isBookPackageErrorPax: "",
    isSubscriptionPlanend: false,
    suppliers: [],
    isSupplierlistLoading: false,
    ipCountryName: "",
  });
  const [isAssistant, setIsAssistant] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [pasteFromAI, setPasteFromAI] = useState('');
  const [isShowAuthorizePopup, setIsShowAuthorizePopup] = useState(false);

  const getSupplier = async (business) => {
    setState((prevState) => { return { ...prevState, isSupplierlistLoading: true }; });

    let businessID = Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === 'package').aliasId;
    let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID + "&providerid=" + props.userInfo.agentID;
    if (props.userInfo.afUserType) {
      reqURL = reqURL + "&usertype=" + props.userInfo.afUserType
    }
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        {},
        function (data) {
          //data.response;
          setState((prevState) => { return { ...prevState, suppliers: data.response, isSupplierlistLoading: false }; });
          resolve();
        }.bind(this),
        "GET"
      );
    })
  }
  const rule = {
    schema: {
      username: "Sdfsdf",
      password: "Asdasd",
    },
    onSubmit: () => {
      console.log("submitted");
    },
    data,
    setData,
    errors,
    setErrors,
  };

  const {
    renderInput,
    renderContactInput,
    renderSingleDate,
    renderCurrentDateWithDuration,
    renderSelect,
    validateFormData,
    renderButton,
    submitHandler,
  } = useForm(rule);

  const handleTabChange = (tab) => {
    setState((prevState) => {
      return {
        ...prevState,
        activeTab: tab,
      };
    });
  };



  const handleAmountFields = (value, e) => {
    if (e && e.target.name !== "sellPriceDisplay") {
      let costPrice = 0;
      let tmpSellPrice = Number(data.sellPrice);

      let taxType = data.taxType ?? "CGSTSGST";
      let conversionRate = isNaN(Number(data.conversionRate)) ? 1 : data.conversionRate === "" ? 1 : Number(data.conversionRate);
      let supplierTaxPrice = isNaN(Number(data.supplierTaxPrice)) ? 0 : Number(data.supplierTaxPrice);
      let supplierCostPrice = ((isNaN(Number(data.supplierCostPriceAdult)) ? 0 : Number(data.supplierCostPriceAdult))
        + (isNaN(Number(data.supplierCostPriceChild)) ? 0 : Number(data.supplierCostPriceChild))
        + (isNaN(Number(data.supplierCostPriceInfant)) ? 0 : Number(data.supplierCostPriceInfant)));

      costPrice = Number(Number((supplierCostPrice + supplierTaxPrice) * conversionRate).toFixed(2));
      /*
      if (e.target.name === "conversionRate" || e.target.name === "supplierTaxPrice" || e.target.name === "supplierCostPrice") {
        costPrice = (supplierCostPrice + supplierTaxPrice) * conversionRate;
        //data.costPrice = costPrice;
      }
      */
      if (e && e.target.name !== "sellPrice" && supplierTaxPrice === 0 && supplierCostPrice === 0) {
        //data.costPrice = 0;
        costPrice = 0;
      }
      let business = "package";
      let markupPrice = isNaN(Number(data.markupPrice)) ? 0 : Number(data.markupPrice);
      let discountPrice = isNaN(Number(data.discountPrice)) ? 0 : Number(data.discountPrice);
      let CGSTPrice = isNaN(Number(data.CGSTPrice)) ? 0 : Number(data.CGSTPrice);
      let SGSTPrice = isNaN(Number(data.SGSTPrice)) ? 0 : Number(data.SGSTPrice);
      let IGSTPrice = isNaN(Number(data.IGSTPrice)) ? 0 : Number(data.IGSTPrice);
      if (taxType === "IGST") {
        CGSTPrice = 0;
        SGSTPrice = 0;
      }
      else if (taxType === "CGSTSGST") {
        IGSTPrice = 0;
      }

      let tax1 = isNaN(Number(data.tax1)) ? 0 : Number(data.tax1);
      let tax2 = isNaN(Number(data.tax2)) ? 0 : Number(data.tax2);
      let tax3 = isNaN(Number(data.tax3)) ? 0 : Number(data.tax3);
      let tax4 = isNaN(Number(data.tax4)) ? 0 : Number(data.tax4);
      let tax5 = isNaN(Number(data.tax5)) ? 0 : Number(data.tax5);
      let totalAmount = isNaN(Number(data.totalAmount)) ? 0 : Number(data.totalAmount);

      let processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
      let percentage = isNaN(Number(data.percentage))
        ? (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"))
        : Number(data.percentage);
      let sellPrice = isNaN(Number(costPrice)) ? 0 : Number(costPrice) + Number(markupPrice);
      sellPrice = sellPrice - discountPrice;
      sellPrice = sellPrice + processingFees;
      if (processingFees > 0 && !data.isInclusive) {
        sellPrice += (CGSTPrice + SGSTPrice + IGSTPrice);
      }
      sellPrice = Number(sellPrice.toFixed(2));

      data.isSellPriceReadonly = (
        data.conversionRate || data.supplierCostPriceAdult || data.supplierCostPriceChild || data.supplierCostPriceInfant || data.supplierTaxPrice || data.markupPrice
        || data.discountPrice || data.processingFees
      ) ? true : false;
      if (!data.isSellPriceReadonly) {
        sellPrice = tmpSellPrice;
        costPrice = tmpSellPrice;
      }

      let amountToCalculateGST = 0;
      let amountToCalculateTax = 0;
      amountToCalculateTax = costPrice + markupPrice + processingFees - discountPrice;
      if (business === 'hotel' || business === 'transfers' || business === 'package') {
        amountToCalculateGST = processingFees > 0 ? processingFees : data.isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice);
      }
      else if (business === 'custom') {
        data.customitemType === 'Visa' ||
          data.customitemType === 'Rail' ||
          data.customitemType === 'Forex' ||
          data.customitemType === 'Rent a Car' ? amountToCalculateGST = processingFees
          : amountToCalculateGST = Number(data.isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice));
      }
      else {
        amountToCalculateGST = processingFees;
      }

      if (e && e.target.name === "sellPrice" || !data.isSellPriceReadonly) {
        costPrice = sellPrice;

        if (percentage > 0) {
          let tmpData = porcessTaxInfo(amountToCalculateGST, data, percentage);
          CGSTPrice = tmpData.CGST;
          SGSTPrice = tmpData.SGST;
          IGSTPrice = tmpData.IGST;
          //data.amountWithoutGST = tmpData.amountWithoutGST;
          /* 
          let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
          let IGSTPrice = (amountToCalculateGST * percentage) / 100;  //  calculate price for IGST
          let CGSTSGSTPrice = (amountToCalculateGST * CGSTSGST) / 100; // calculate price for CGST & SGST
          if (taxType !== "IGST") {
            IGSTPrice = 0;
            CGSTPrice = CGSTSGSTPrice;
            SGSTPrice = CGSTSGSTPrice;
          } */
        }

        tax1 = getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);

        if (!data.isInclusive)
          totalAmount = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
        else
          totalAmount = Number(sellPrice);

        totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
      }
      else {
        if (processingFees === 0) {
          if (percentage > 0) {
            let percentage = isNaN(Number(data.percentage)) ? 0 : Number(data.percentage);
            let tmpData = porcessTaxInfo(amountToCalculateGST, data, percentage);
            CGSTPrice = tmpData.CGST;
            SGSTPrice = tmpData.SGST;
            IGSTPrice = tmpData.IGST;
            //data.amountWithoutGST = tmpData.amountWithoutGST;
            /* let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
            let IGSTPrice = (amountToCalculateGST * percentage) / 100;  //  calculate price for IGST
            let CGSTSGSTPrice = (amountToCalculateGST * CGSTSGST) / 100; // calculate price for CGST & SGST
            if (taxType !== "IGST") {
              IGSTPrice = 0;
              CGSTPrice = CGSTSGSTPrice;
              SGSTPrice = CGSTSGSTPrice;
            } */
          }
          tax1 = getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
          tax2 = getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
          tax3 = getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
          tax4 = getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
          tax5 = getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
          if (!data.isInclusive)
            totalAmount = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
          else
            totalAmount = Number(sellPrice);
          totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
        }
        else {
          tax1 = getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
          tax2 = getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
          tax3 = getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
          tax4 = getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
          tax5 = getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
          totalAmount = Number(sellPrice) + Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
        }
      }

      //data.conversionRate = conversionRate;
      //data.supplierTaxPrice = supplierTaxPrice;
      data.supplierCostPrice = supplierCostPrice;
      data.costPrice = costPrice;
      data.markupPrice = markupPrice;
      data.discountPrice = discountPrice;
      data.taxType = taxType;
      data.percentage = percentage;
      data.CGSTPrice = CGSTPrice;
      data.SGSTPrice = SGSTPrice;
      data.IGSTPrice = IGSTPrice;
      data.tax1 = tax1;
      data.tax2 = tax2;
      data.tax3 = tax3;
      data.tax4 = tax4;
      data.tax5 = tax5;
      data.totalAmount = Number(totalAmount.toFixed(2));

      if (e && e.target.name !== "sellPriceDisplay")
        data.sellPriceDisplay = Number(totalAmount.toFixed(2));
      data.processingFees = processingFees;
      data.sellPrice = sellPrice;
    }
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const getCustomTaxAmount = (purpose, business, amountToCalculate, isTaxModified, currentAmount) => {
    if (isTaxModified) return currentAmount;
    // let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === business.toLowerCase()).taxes;
    let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
      .customTaxConfigurations
      .find(x => x.business.toLowerCase() === business.toLowerCase())
      ?.taxes;
    //Fixed Crash - Immediate Solution
    if (!customTaxConfigurations && (business === "package" || business === "transfers" || business === "custom")) {
      customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
        .customTaxConfigurations
        .find(x => x.business.toLowerCase() === 'activity'.toLowerCase())
        ?.taxes;
    }
    customTaxConfigurations = customTaxConfigurations.filter(x => x.chargeType.toLowerCase() === "percentage");
    if (customTaxConfigurations.find(y => y.purpose === purpose)?.chargeValue > 0) {
      return Number(((customTaxConfigurations.find(y => y.purpose === purpose).chargeValue * amountToCalculate) / 100).toFixed(2));
    }
    return 0;
  }

  const porcessTaxInfo = (baseAmount, data, taxPercentage) => {
    let taxType = data.taxType;
    if (!isNaN(Number(baseAmount) > 0) && Number(baseAmount) <= 0)
      return { amountWithoutGST: 0, CGST: 0, SGST: 0, IGST: 0 };

    if (!isNaN(Number(baseAmount) > 0) && taxType) {
      if (data.isInclusive) {
        data.IGST = baseAmount - (baseAmount * (100 / (100 + taxPercentage)));
        data.IGST = Number(data.IGST.toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
      else {
        data.IGST = Number((baseAmount * (taxPercentage / 100)).toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
    }
    //data.amountForGST = baseAmount;
    if (data.isInclusive) {
      data.amountWithoutGST = baseAmount - data.CGST - data.SGST - data.IGST;
      data.amountWithoutGST = Number(data.amountWithoutGST.toFixed(2));
    } else
      data.amountWithoutGST = 0;
    return data;
  }

  const handleTaxQuoationoData = (taxdata) => {

    // let data = state.data;
    data.CGSTPrice = taxdata.CGSTPrice;
    data.IGSTPrice = taxdata.IGSTPrice;
    data.SGSTPrice = taxdata.SGSTPrice;
    data.amountWithoutGST = taxdata.amountWithoutGST;
    data.isInclusive = taxdata.isInclusive;
    data.percentage = taxdata.percentage;
    data.processingFees = taxdata.processingFees;
    data.tax1 = taxdata.tax1;
    data.tax2 = taxdata.tax2;
    data.tax3 = taxdata.tax3;
    data.tax4 = taxdata.tax4;
    data.tax5 = taxdata.tax5;
    data.taxType = taxdata.taxType;
    data.isTax1Modified = taxdata.isTax1Modified;
    data.isTax2Modified = taxdata.isTax2Modified;
    data.isTax3Modified = taxdata.isTax3Modified;
    data.isTax4Modified = taxdata.isTax4Modified;
    data.isTax5Modified = taxdata.isTax5Modified;
    // setState({ data }, () => handleAmountFields(0, { target: { name: "", value: "" } }));
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
    handleAmountFields(0, { target: { name: "", value: "" } });
  }
  const validateBRN = (tmpBRN) => {
    if (data.brn) {
      const quotationInfo = JSON.parse(localStorage.getItem("quotationItems"));
      if (
        quotationInfo &&
        quotationInfo.filter(
          (x) =>
            x.offlineItem.uuid !== data.uuid &&
            x.offlineItem.brn &&
            x.offlineItem.brn.toLowerCase() === tmpBRN.toLowerCase()
        ).length > 0
      )
        errors.brn =
          "Confirmation Number should be unique per " +
          (props.type === "Itinerary" ? "itinerary" : "quotation") +
          ".";
    }
    setErrors((prevState) => {
      return {
        ...prevState,
        errors,
      };
    });
    return Object.keys(errors).length === 0 ? null : errors;
  };
  const handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office") props.history.push(`/Backoffice/${req}`);
      else {
        props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      props.history.push(`${req}`);
    }
  };
  const getCurrencyList = () => {
    const reqOBJ = {};
    let reqURL = "cms/package/getcurrency";
    setState((prevState) => {
      return {
        ...prevState,
        LoadingBranchList: true,
      };
    });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let currencyid = resonsedata.response.find(
          (x) =>
            x.currencyCode ===
            Global.getEnvironmetKeyValue("portalCurrencyCode")
        ).currencyID;
        setState((prevState) => {
          return {
            ...prevState,
            CurrencyList: resonsedata.response,
            LoadingCurrencyList: false,
          };
        });
        setData((prevState) => {
          return {
            ...prevState,
            currencyID: currencyid,
          };
        });
      }.bind(this),
      "GET"
    );
  };

  const getCountryList = async (countryID, isLoadingEditMode) => {
    const reqOBJ = {
      request: {},
    };
    let reqURL = "admin/lookup/country";
    setState((prevState) => {
      return {
        ...prevState,
        LoadingCountryList: true,
      };
    });

    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          resonsedata.response = resonsedata.response.sort((a, b) =>
            a.countryName > b.countryName
              ? 1
              : b.countryName > a.countryName
                ? -1
                : 0
          );
          setState((prevState) => {
            return {
              ...prevState,
              CountryList: resonsedata.response,
              LoadingCountryList: false,
            };
          });
          getStateList(data.countryID, true);
          resolve(resonsedata.response);
        }.bind(this),
        "POST"
      );
    });
  };
  const getStateList = async (countryId, stateId) => {
    if (!state.isLoadingEditMode) {
      data.stateID = "";
      // data.cityID = "";
    }
    if (countryId === "") {
      setData((prevState) => {
        return {
          ...prevState,
          stateID: "",
          // cityID: "",
        };
      });
      setState((prevState) => {
        return {
          ...prevState,
          StateList: [],
          CityList: [],
        };
      });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        countryID: countryId,
      },
    };
    let reqURL = "admin/lookup/state";
    setState((prevState) => {
      return {
        ...prevState,
        LoadingStateList: true,
      };
    });
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          setState((prevState) => {
            return {
              ...prevState,
              StateList: resonsedata.response,
              CityList: [],
              LoadingStateList: false,
            };
          });
          // if (state.isLoadingEditMode) {
          //   getCityList(countryId, stateId);
          // }
          resolve();
        }.bind(this),
        "POST"
      );
    });
  };
  const getCityList = async (countryId, stateId, cityID) => {
    //console.log("countryId, stateId, cityID  : ", countryId, stateId, cityID);
    if (!state.isLoadingEditMode) data.cityID = "";
    if (stateId === "" && !state.isLoadingEditMode) {
      setData((prevState) => {
        return {
          ...prevState,
          cityID: "",
        };
      });
      setState((prevState) => {
        return {
          ...prevState,
          CityList: [],
        };
      });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        stateID: !state.isLoadingEditMode && data.stateID ? data.stateID : stateId,
        countryID: !state.isLoadingEditMode && data.countryID ? data.countryID : countryId,
      },
    };
    console.log(reqOBJ);
    let reqURL = "admin/lookup/city";
    setState((prevState) => {
      return {
        ...prevState,
        LoadingCityList: true,
      };
    });
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          //console.log("cityID : ", cityID);
          setState((prevState) => {
            return {
              ...prevState,
              CityList: resonsedata.response,
              LoadingCityList: false,
            };
          });
          setData((prevState) => {
            return {
              ...prevState,
              cityID: cityID,
            };
          });
          resolve();
        }.bind(this),
        "POST"
      );
    });
  };
  const getBasicData = async () => {
    var reqURL = "tw/portal/info";
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        null,
        (data) => {
          setState((prevState) => {
            return {
              ...prevState,
              portalURL: data.response[0].customHomeURL.toLowerCase(),
              isCMSPortalCreated:
                data.response[0].isCMSPortalCreated === "true",
            };
          });
          resolve();

          // if (data.response[0].isCMSPortalCreated === "true") {
          //   getBranchList();
          //   getCountryList();
          //   const { mode, id } = props.match.params;
          //   if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
          //     getPackageDetails(id);
          //   }
          //   setDatass();
          // }
        },
        "GET"
      );
    });
  };

  let defaultBind = async () => {
    if (props.match.params.mode && props.match.params.mode.toLowerCase() === "use" && props.match.params.inquiryid !== "" && props.match.params.inquiryid !== undefined) {
      let resInquiryData = await getInquiryDetails(props.match.params.inquiryid);
    }
    let resCountry = await getCountryList();
    //let resCurrency = await getCurrencyList();
    let resBasicData = await getBasicData();
    let resCustomer = await setCustomerData();
    await getSupplier('package');
    if ((props.isFromContentManager && props.mode === "edit" && props.idForEdit > 0)
    ) {
      getPackageDetails(props.idForEdit);
    }
    else if (props.match.params.mode && (
      props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use" ||
      props.match.params.mode.toLowerCase() === "view")
    ) {
      getPackageDetails(props.match.params.id);
    }
  };
  useEffect(() => {
    if (
      !AuthorizeComponentCheck(
        props.userInfo.rolePermissions,
        (isMasterPackage ? "dashboard-menu~master-packages-create-package" : "dashboard-menu~packages-create-package")
      )
    ) {
      props.history.push("/");
    }
    if (state.isBookPackageLoading) {
      bookPackage();
    } else {
      defaultBind();
    }
  }, [state.isBookPackageLoading]);
  const setCustomerData = async () => {
    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    console.log("setCustomerData", state.inquiryDetails?.data?.customerName);
    console.log("setCustomerData", data.customerName);
    console.log("setCustomerData", data.twCustomerName)
    return new Promise((resolve, reject) => {
      data.customerName = (isMarketplaceMode || isMasterPackage || props.isFromContentManager)
        ? "Demo Customer"
        : props.match.params.mode === "Edit"
          ? data.twCustomerName
          : props.match.params.mode.toLowerCase() === "use" ? data.twCustomerName : bookingForInfo && bookingForInfo.displayName
            ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
            : data.twCustomerName || "";

      data.customerEmail = (isMarketplaceMode || isMasterPackage || props.isFromContentManager)
        ? "democustomer@tourwiz.com"
        : props.match.params.mode === "Edit"
          ? data.twCustomerEmail
          : props.match.params.mode.toLowerCase() === "use" ? data.twCustomerEmail : bookingForInfo && bookingForInfo.contactInformation
            ? bookingForInfo.contactInformation.email
            : data.twCustomerEmail || "";

      data.customerPhone = (isMarketplaceMode || isMasterPackage || props.isFromContentManager)
        ? "+91-1234567890"
        : props.match.params.mode === "Edit"
          ? data.twCustomerPhone
          : props.match.params.mode.toLowerCase() === "use" ? data.twCustomerPhone : bookingForInfo && bookingForInfo.contactInformation
            ? bookingForInfo.contactInformation.phoneNumber
            : data.twCustomerPhone || "";

      setData((prevState) => {
        return {
          ...prevState,
          ...data,
        };
      });
      resolve();
    });
  };

  const getInquiryDetails = async (id) => {

    //let id = this.props.location.pathname.replace("/Inquiry/", "");

    var reqURL = "inquiry?id=" + id;
    var reqOBJ = "";
    return new Promise(function (resolve, reject) {
      apiRequester_quotation_api(
        reqURL,
        reqOBJ,
        (dataInq) => {

          let bookingForInfo = JSON.parse(
            sessionStorage.getItem("customer-info")
          );
          setState((prevState) => {
            return {
              ...prevState,
              inquiryDetails: dataInq,
            };
          });
          data.customerName = dataInq.data.customerName;
          data.customerEmail = dataInq.data.email;
          data.customerPhone = dataInq.data.phone;
          data.twCustomerName = dataInq.data.customerName;
          data.twCustomerEmail = dataInq.data.email;
          data.twCustomerPhone = dataInq.data.phone;
          setData((prevState) => {
            return {
              ...prevState,
              ...data,
            };
          });
          console.log("set data")
          resolve();
        },
        "GET"
      );
    });
  };
  const getPackageDetails = (id) => {
    const tempCustomer = data;
    setState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
        isEditModeLoading: true,
      };
    });
    const reqOBJ = {};
    let reqURL = "cms/package/getbyid?id=" + id;
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let data = resonsedata.response.package[0];
        data.termsConditions = resonsedata.response.package[0].termsConditions;
        data.description = resonsedata.response.package[0].description;
        data.packageThemes = resonsedata.response.package[0].packagethemeid;
        data.packageName = resonsedata.response.package[0].shortDescription;
        data.vendor = resonsedata.response.package[0].providerName;
        let defaultBind = async () => {
          let resState = await getStateList(resonsedata.response.package[0].countryID, resonsedata.response.package[0].stateID);

          //console.log("resonsedata.response.package[0].cityID : ", resonsedata.response.package[0].cityID);

          if (resonsedata.response.package[0].stateID > 0)
            await getCityList(resonsedata.response.package[0].countryID, resonsedata.response.package[0].stateID, resonsedata.response.package[0].cityID);


        }
        defaultBind();
        data.stateID = resonsedata.response.package[0].stateID;
        data.cityID = resonsedata.response.package[0].cityID;
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

        let htmlExclusion = '';
        resonsedata.response.inclusionExclusion
          ?.filter((x) => !x.isDeleted && !x.isInclusion)
          .forEach((item, index) => {
            htmlExclusion += item.shortDescription ? `${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "")} <br/>` : '';
          });
        let htmlInclusion = '';
        resonsedata.response.inclusionExclusion
          ?.filter((x) => !x.isDeleted && x.isInclusion)
          .forEach((item, index) => {
            htmlInclusion += item.shortDescription ? `${item.shortDescription.replace("<![CDATA[", "").replace("]]>", "")} <br/>` : '';
          });
        data.inclusion = htmlInclusion;
        data.exclusion = htmlExclusion;
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
          let supplierObj = JSON.parse(
            resonsedata.response.package[0].twOthers
          );
          data["supplierCurrency"] = supplierObj.supplierCurrency;
          data["conversionRate"] = supplierObj.conversionRate;
          data["supplierCostPrice"] = supplierObj.supplierCostPrice;
          data["supplierTaxPrice"] = supplierObj.supplierTaxPrice;
          data["costPrice"] =
            supplierObj.costPrice === 0 ? 0 : supplierObj.costPrice;
          data["markupPrice"] = supplierObj.markupPrice;
          data["discountPrice"] = supplierObj.discountPrice;
          data["CGSTPrice"] = supplierObj.CGSTPrice;
          data["SGSTPrice"] = supplierObj.SGSTPrice;
          data["IGSTPrice"] = supplierObj.IGSTPrice;
          data["brn"] = supplierObj.brn;
          data["bookBefore"] = supplierObj.bookBefore;
          data["flight"] = supplierObj.flight;
          data["hotelDetails"] = supplierObj.hotelDetails;
          data["Adults"] = supplierObj.Adults ?? 1;
          data["Child"] = supplierObj.Child ?? 0;
          data["Infants"] = supplierObj.Infants ?? 0;
          data["supplierCostPriceAdult"] = supplierObj.supplierCostPriceAdult ?? supplierObj.supplierCostPrice;
          data["supplierCostPriceChild"] = supplierObj.supplierCostPriceChild ?? "";
          data["supplierCostPriceInfant"] = supplierObj.supplierCostPriceInfant ?? "";
          if (supplierObj.sellPrice !== undefined) {
            data["sellPriceDisplay"] = data.price;
            data["sellPrice"] = supplierObj.sellPrice;
            data["amountWithoutGST"] = supplierObj.amountWithoutGST;
            data["isInclusive"] = supplierObj.isInclusive;
            data["processingFees"] = supplierObj.processingFees;
            data["tax1"] = supplierObj.tax1;
            data["tax2"] = supplierObj.tax2;
            data["tax3"] = supplierObj.tax3;
            data["tax4"] = supplierObj.tax4;
            data["tax5"] = supplierObj.tax5;
            data["taxType"] = supplierObj.taxType;
            data["totalAmount"] = supplierObj.totalAmount;
            data["isSellPriceReadonly"] = supplierObj.isSellPriceReadonly;
            data["percentage"] = supplierObj.percentage;
            data["isTax1Modified"] = supplierObj.isTax1Modified;
            data["isTax2Modified"] = supplierObj.isTax2Modified;
            data["isTax3Modified"] = supplierObj.isTax3Modified;
            data["isTax4Modified"] = supplierObj.isTax4Modified;
            data["isTax5Modified"] = supplierObj.isTax5Modified;
          }
          else {
            data["sellPriceDisplay"] = data.price;
            data["sellPrice"] = data.price;
            data["percentage"] = 0;
          }
        }
        if (props.match.params.mode && props.match.params.mode.toLowerCase() === "use") {

          data["isShowOnMarketPlace"] = false;
          data["isMarketplacePublish"] = data.price;
        }


        let bookingForInfo = JSON.parse(
          sessionStorage.getItem("customer-info")
        );
        console.log("getPackageDetails", state.inquiryDetails?.data?.customerName)
        console.log("getPackageDetails", data.customerName)
        console.log("getPackageDetails", data.twCustomerName)
        data.customerName =
          props.match.params.mode === "Edit"
            ? data.twCustomerName
            : props.match.params.mode === "Use" ? tempCustomer.twCustomerName : bookingForInfo && bookingForInfo.displayName
              ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
              : data.twCustomerName || "";
        data.bookingStartDate = moment(data.validFrom).diff(
          moment().format(Global.DateFormate),
          "days"
        ) > 0
          ? moment(data.validFrom).format(Global.DateFormate)
          : moment(data.validFrom).diff(
            moment().format(Global.DateFormate),
            "days"
          ) < 0
            ? moment(data.validFrom).format(Global.DateFormate)
            : moment().format(Global.DateFormate);

        data.bookingEndDate = moment(data.validFrom).diff(
          moment().format(Global.DateFormate),
          "days"
        ) > 0
          ? moment(moment(data.bookingStartDate)).add(data?.duration ? data.duration - 1 : 4, "d").format(Global.DateFormate)
          : moment(data.validFrom).diff(
            moment().format(Global.DateFormate),
            "days"
          ) < 0
            ? moment(moment(data.bookingStartDate)).add(data?.duration ? data.duration - 1 : 4, "d").format(Global.DateFormate)
            : moment().add(data?.duration ? data.duration - 1 : 4, "d").format(Global.DateFormate);
        data.twCustomerName = props.match.params.mode === "Use" ? tempCustomer.twCustomerName : data.twCustomerName;
        data.twCustomerEmail = props.match.params.mode === "Use" ? tempCustomer.twCustomerEmail : data.twCustomerEmail;
        data.twCustomerPhone = props.match.params.mode === "Use" ? tempCustomer.twCustomerPhone : data.twCustomerPhone;
        data.customerEmail =
          props.match.params.mode === "Edit"
            ? data.twCustomerEmail
            : props.match.params.mode === "Use" ? tempCustomer.twCustomerEmail : bookingForInfo && bookingForInfo.contactInformation
              ? bookingForInfo.contactInformation.email
              : data.twCustomerEmail || "";
        data.isSellPriceReadonly = data.sellPrice ? true : false;
        data.customerPhone =
          props.match.params.mode === "Edit"
            ? data.twCustomerPhone
            : props.match.params.mode === "Use" ? tempCustomer.twCustomerPhone : bookingForInfo && bookingForInfo.contactInformation
              ? bookingForInfo.contactInformation.phoneNumber
              : data.twCustomerPhone || "";
        data.inquiryId = resonsedata.response.package[0].inquiryId;
        data.isShowOnHomePage = props.match.params.mode && props.match.params.mode.toLowerCase() === "use" ? false : data.isShowOnHomePage;
        setData((prevState) => {
          return {
            ...prevState,
            ...data,
          };
        });
        let packageLargeImagesPubl = data.images;
        packageLargeImagesPubl = packageLargeImagesPubl.filter(
          (x) => x.isDefaultImage
        );
        localStorage.setItem("packageItemDetails", JSON.stringify({
          ...data
        }));
        setState((prevState) => {
          return {
            ...prevState,
            packageLargeImages: packageLargeImagesPubl,
            isLoading: false,
            isEditModeLoading: false,
          };
        });
        if (data["countryID"]) getStateList(data["countryID"], data["stateID"]);
      }.bind(this),
      "GET"
    );
  };

  const validateInformation = () => {
    const errors = {};
    if (!validateFormData(data.packageName, "require"))
      errors.packageName = "Package name required";
    if (
      data.packageName &&
      !validateFormData(
        data.packageName,
        "special-characters-not-allowed",
        /[<>]/
      )
    )
      errors.packageName = "< and > characters not allowed";

    let validFrom = moment(data.validFrom);
    let validTo = moment(data.validTo);
    if (validFrom.isAfter(validTo))
      errors.validTo =
        "Offer end date should not be greater than offer start date.";
    // if (!validateFormData(data.summaryDescription, "require"))
    //   errors.summaryDescription = "Overview required";
    // if (data.summaryDescription && !validateFormData(data.summaryDescription, "special-characters-not-allowed", /[<>]/))
    //   errors.summaryDescription = "< and > characters not allowed";
    if (!validateFormData(data.description, "require"))
      errors.description = "Itinerary required";
    if (!validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";
    else if (!validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/))
      errors.customerName = "< and > characters not allowed";
    /* if (!validateFormData(data.customerEmail, "require"))
      errors.customerEmail = "Customer Email required"; 
      else */
    if (data.customerEmail && !validateFormData(data.customerEmail, "email"))
      errors.customerEmail = "Enter valid Email";

    if (
      !validateFormData(data.customerPhone, "require") ||
      data.customerPhone === "1-" ||
      data.customerPhone.split("-")[1] === ""
    )
      errors.customerPhone = "Phone required";

    if (data.customerPhone && data.customerPhone !== "")
      if (!validateFormData(data.customerPhone, "phonenumber"))
        errors.customerPhone = "Invalid Contact Phone";

    if (
      data.customerPhone &&
      !validateFormData(data.customerPhone, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.customerPhone = Trans("_error_mobilenumber_phonenumber_length");
    // if (
    //   (state.packageLargeImages.filter((x) => x.IsDefaultImage).length === 0 ||
    //     state.packageLargeImages.filter((x) => x.IsDefaultImage && x.isDeleted)
    //       .length === 1) &&
    //   (data.images.filter((x) => x.isDefaultImage).length === 0 ||
    //     data.images.filter((x) => x.isDefaultImage && x.isDeleted).length === 1)
    // )
    //   errors.LeadImage = "Featured Image Required.";

    if (data.duration !== "" && (data.duration <= 0 || /\./.test(data.duration) || /^-\d/.test(data.duration))) {
      errors.duration = "Duration should be a positive integer value";
    }
    if (
      data.isSellPriceReadonly &&
      (isNaN(Number(data.costPrice)) ||
        (!isNaN(Number(data.costPrice)) && Number(data.costPrice) === 0))
    ) {
      errors.costPrice = "Cost Price should not be 0";
    } else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0) {
      errors.costPrice = "Cost Price should not be less than 0";
    } else {
      delete Object.assign(errors)["costPrice"];
    }
    if (!isNaN(Number(data.sellPrice)) && Number(data.sellPrice) < 0) {
      errors.sellPrice = "Sell Price should not be less than 0";
    } else {
      delete Object.assign(errors)["price"];
    }

    if (
      data.sellPrice &&
      data.sellPrice !== "" &&
      !validateFormData(data.sellPrice, "numeric")
    )
      errors.sellPrice = "Please enter sell price in decimal only";
    else if (
      data.sellPrice != "" &&
      !isNaN(Number(data.sellPrice)) &&
      Number(data.sellPrice) === 0
    ) {
      errors.sellPrice = "Sell Price should not be 0";
    } else {
      delete Object.assign(errors)["price"];
    }
    if (
      data.conversionRate &&
      data.conversionRate !== "" &&
      !validateFormData(data.conversionRate, "numeric")
    )
      errors.conversionRate = "Please enter conversion rate in decimal only";
    else {
      delete Object.assign(errors)["conversionRate"];
    }
    // if (
    //   data.supplierCostPrice &&
    //   data.supplierCostPrice !== "" &&
    //   !validateFormData(data.supplierCostPrice, "numeric")
    // )
    //   errors.supplierCostPrice =
    //     "Please enter supplier cost price in decimal only";
    // else {
    //   delete Object.assign(errors)["supplierCostPrice"];
    // }
    if (
      data.supplierCostPriceAdult &&
      data.supplierCostPriceAdult !== "" &&
      !validateFormData(data.supplierCostPriceAdult, "numeric")
    )
      errors.supplierCostPriceAdult =
        "Please enter adult supplier cost price in decimal only";
    else {
      delete Object.assign(errors)["supplierCostPriceAdult"];
    }
    if (
      data.supplierCostPriceChild &&
      data.supplierCostPriceChild !== "" &&
      !validateFormData(data.supplierCostPriceChild, "numeric")
    )
      errors.supplierCostPriceChild =
        "Please enter child supplier cost price in decimal only";
    else {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (
      data.supplierCostPriceInfant &&
      data.supplierCostPriceInfant !== "" &&
      !validateFormData(data.supplierCostPriceInfant, "numeric")
    )
      errors.supplierCostPriceInfant =
        "Please enter infant supplier cost price in decimal only";
    else {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (
      data.supplierTaxPrice &&
      data.supplierTaxPrice !== "" &&
      !validateFormData(data.supplierTaxPrice, "numeric")
    )
      errors.supplierTaxPrice =
        "Please enter supplier tax price in decimal only";
    else {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (
      data.costPrice &&
      data.costPrice !== "" &&
      !validateFormData(data.costPrice, "numeric")
    )
      errors.costPrice = "Please enter agent cost price in decimal only";
    else {
      delete Object.assign(errors)["costPrice"];
    }
    if (
      data.markupPrice &&
      data.markupPrice !== "" &&
      !validateFormData(data.markupPrice, "numeric")
    )
      errors.markupPrice = "Please enter agent markup price in decimal only";
    else {
      delete Object.assign(errors)["markupPrice"];
    }
    if (
      data.discountPrice &&
      data.discountPrice !== "" &&
      !validateFormData(data.discountPrice, "numeric")
    )
      errors.discountPrice = "Please enter discount price in decimal only";
    else {
      delete Object.assign(errors)["discountPrice"];
    }
    if (
      data.CGSTPrice &&
      data.CGSTPrice !== "" &&
      !validateFormData(data.CGSTPrice, "numeric")
    )
      errors.CGSTPrice = "Please enter CGST price in decimal only";
    else {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (
      data.SGSTPrice &&
      data.SGSTPrice !== "" &&
      !validateFormData(data.SGSTPrice, "numeric")
    )
      errors.SGSTPrice = "Please enter SGST price in decimal only";
    else {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (
      data.IGSTPrice &&
      data.IGSTPrice !== "" &&
      !validateFormData(data.IGSTPrice, "numeric")
    )
      errors.IGSTPrice = "Please enter IGST price in decimal only";
    else {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (
      data.brn &&
      !validateFormData(data.brn, "special-characters-not-allowed", /[<>]/)
    )
      errors.brn = "< and > characters not allowed";
    else {
      delete Object.assign(errors)["brn"];
    }
    if (
      data.vendor &&
      !validateFormData(data.vendor, "special-characters-not-allowed", /[<>_]/)
    )
      errors.vendor = "< , > , _ characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["vendor"];
    }
    if (
      data.description &&
      (data.description.indexOf("<Script>") >= 0 ||
        data.description.indexOf("<script>") >= 0)
    )
      errors.description = "Invalid Itinerary description";
    else {
      delete Object.assign(errors)["description"];
    }
    if (
      data.twPriceGuideLine &&
      (data.twPriceGuideLine.indexOf("<Script>") >= 0 ||
        data.twPriceGuideLine.indexOf("<script>") >= 0)
    )
      errors.twPriceGuideLine = "Invalid Price Guidelines";
    else {
      delete Object.assign(errors)["twPriceGuideLine"];
    }
    //  if (!data.currencyID || !validateFormData(data.currencyID, "require"))
    //    errors.currencyID = "Currency required";

    if (!data.countryID || !validateFormData(data.countryID, "require"))
      errors.countryID = "Country Name required";

    if (!data.Adults || !validateFormData(data.Adults, "require")) errors.Adults = "Please enter adults";

    if (data.Adults && !validateFormData(data.Adults.toString(), "only-numeric")) errors.Adults = "Please enter adults in numeric only";

    if (data.Child && !validateFormData(data.Child.toString(), "only-numeric")) errors.Child = "Please enter children in numeric only";

    if (data.Infants && !validateFormData(data.Infants.toString(), "only-numeric")) errors.Infants = "Please enter infant(s) in numeric only";

    if (data.Adults && !validateFormData(data.Adults.toString(), "length", { min: 1, max: 2 })) errors.Adults = "Adults count must be between 1 to 99.";

    if (data.Adults && data.Adults <= 0) errors.Adults = "Adults count must be between 1 to 99.";

    if (data.Child && !validateFormData(data.Child.toString(), "length", { min: 0, max: 2 })) errors.Child = "Children count must be between 0 to 99.";

    if (data.Infants && !validateFormData(data.Infants.toString(), "length", { min: 0, max: 2 })) errors.Infants = "Infants count must be between 0 to 99.";

    // if (!data.stateID || !validateFormData(data.stateID, "require"))
    //   errors.stateID = "State Name required";

    // if (!data.cityID || !validateFormData(data.cityID, "require"))
    //   errors.cityID = "City Name required";
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const savePackageClick = (isVendorvalidate) => {
    const errors = validateInformation();
    if (errors && Object.keys(errors).length > 0) {
      setErrors(errors || {});
      setState({
        ...state,
        isBtnLoading: false,
        isLoading: false,
        showPopup: false,
        popupContent: "",
        popupTitle: "",
      });
      if (errors) return;
    }
    if (!isMarketplaceMode && !isQuickPackage && !isMasterPackage) {
      if (!isVendorvalidate && !data.vendor) {
        handlePopup();
        return;
      }
    }
    saveOffer();
  };
  const saveOffer = () => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    setState((prevState) => {
      return {
        ...prevState,
        isErrorMsg: "",
        isBtnLoading: true,
        isLoading: true,
        showPopup: false,
        popupContent: "",
        popupTitle: "",
      };
    });
    const { mode, providerID, CurrencyList } = { ...state };
    const { userInfo } = props;
    //let data = Object.assign({}, data);
    data.images = data.images.concat(state.packageLargeImages);
    data.PDFList = data.packageBrochure.concat(state.packageBrochure);
    if (isQuickPackage) {
      data.packageThemes = 13;
      data.smallImagePath = "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg";
    }
    data["siteURL"] =
      state.isCMSPortalCreated && data.isShowOnHomePage ? state.portalURL : "";
    let supplierObj = {
      supplierCurrency: data.supplierCurrency,
      conversionRate: data.conversionRate,
      supplierCostPrice: (isNaN(Number(data.supplierCostPriceAdult)) && isNaN(Number(data.supplierCostPriceChild)) && isNaN(Number(data.supplierCostPriceInfant)) ? 0 : ((isNaN(Number(data.supplierCostPriceAdult)) ? 0 : Number(data.supplierCostPriceAdult)) + (isNaN(Number(data.supplierCostPriceChild)) ? 0 : Number(data.supplierCostPriceChild)) + (isNaN(Number(data.supplierCostPriceInfant)) ? 0 : Number(data.supplierCostPriceInfant)))),
      supplierTaxPrice: data.supplierTaxPrice,
      costPrice: data.costPrice > 0 ? data.costPrice : 0,
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
      Adults: data.Adults && data.Adults !== "" ? data.Adults : 1,
      Child: data.Child && data.Child !== "" ? data.Child : 0,
      Infants: data.Infants && data.Infants !== "" ? data.Infants : 0,
      supplierCostPriceAdult: data.supplierCostPriceAdult ?? data.supplierCostPrice,
      supplierCostPriceChild: data.supplierCostPriceChild ?? "",
      supplierCostPriceInfant: data.supplierCostPriceInfant ?? ""
    };
    data["inclusionExclusion"] = [];
    if (data.inclusion !== "") {
      var obj = {};
      obj["id"] = generateUUID();
      obj["isInclusion"] = true;
      obj["description"] = encode(data.inclusion);
      obj["isDeleted"] = false;
      data["inclusionExclusion"].push(obj);
    }
    if (data.exclusion !== "") {
      var obj = {};
      obj["id"] = generateUUID();
      obj["isInclusion"] = false;
      obj["description"] = encode(data.exclusion);
      obj["isDeleted"] = false;
      data["inclusionExclusion"].push(obj);
    }



    data["Status"] = (data.status === "" || data.status === undefined) ? "New" : data.status;//isMarketplaceMode ? "pending" : "confirm";
    data["bookingFor"] = (data.bookingFor === "" || data.bookingFor === undefined || data.bookingFor === null) ? "Individual" : data.bookingFor;//isMarketplaceMode ? "pending" : "confirm";
    data["tripType"] = (data.tripType === "" || data.tripType === undefined) ? "" : data.tripType;//isMarketplaceMode ? "pending" : "confirm";
    data["IsMaster"] = isMasterPackage;
    data["Duration"] = parseInt(data.duration);
    data["agentId"] = providerID;
    data["inquiryId"] = props.match.params.mode && props.match.params.mode.toLowerCase() === "use" ? props.match.params.inquiryid : "";
    data["supplierObj"] = JSON.stringify(supplierObj);
    data["IsCMSPackage"] = props.isFromContentManager ? true : false;
    //if(data.supplierCurrency != ""){
    //let currencyid = CurrencyList.find((x) => x.currencyCode === data.supplierCurrency.split(' ')[0]).currencyID;
    //data["currencyID"] = currencyid;
    //}

    data["price"] = data.totalAmount > 0 ? data.totalAmount : Number(data.sellPriceDisplay) > 0 ? Number(data.sellPriceDisplay) : data.sellPrice;

    data.createCustomer_validateEmailAndPhone = (isMarketplaceMode || isMasterPackage) ? false : true;
    data.createCustomer_UseAgentDetailInEmail =
      Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") ===
        "true"
        ? true
        : false;
    data.createCustomer_iscmsportalcreated =
      props.userInfo.issendregistrationemail.toLowerCase() === "true" &&
      !(
        data.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")
      ).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"));
    localStorage.setItem("packageItem", JSON.stringify({ data }));
    let OfferInfo = { ...data };
    delete OfferInfo["packageBrochure"];
    delete OfferInfo["isActive"];
    delete OfferInfo["isDeleted"];
    delete OfferInfo["status"];
    delete OfferInfo["inclusion"];
    delete OfferInfo["exclusion"];
    delete OfferInfo["imagesURL"];

    delete OfferInfo["supplierCurrency"];
    delete OfferInfo["conversionRate"];
    delete OfferInfo["supplierCostPrice"];
    delete OfferInfo["supplierTaxPrice"];
    delete OfferInfo["costPrice"];
    delete OfferInfo["markupPrice"];
    delete OfferInfo["discountPrice"];
    delete OfferInfo["CGSTPrice"];
    delete OfferInfo["SGSTPrice"];
    delete OfferInfo["IGSTPrice"];
    delete OfferInfo["brn"];
    delete OfferInfo["markupPrice"];
    delete OfferInfo["discountPrice"];
    delete OfferInfo["CGSTPrice"];
    delete OfferInfo["SGSTPrice"];
    delete OfferInfo["IGSTPrice"];
    delete OfferInfo["sellPrice"];
    delete OfferInfo["amountWithoutGST"];
    delete OfferInfo["isInclusive"];
    delete OfferInfo["percentage"];
    delete OfferInfo["processingFees"];
    delete OfferInfo["tax1"];
    delete OfferInfo["tax2"];
    delete OfferInfo["tax3"];
    delete OfferInfo["tax4"];
    delete OfferInfo["tax5"];
    delete OfferInfo["isTax1Modified"];
    delete OfferInfo["isTax2Modified"];
    delete OfferInfo["isTax3Modified"];
    delete OfferInfo["isTax4Modified"];
    delete OfferInfo["isTax5Modified"];
    delete OfferInfo["taxType"];
    //delete OfferInfo["totalAmount"];
    delete OfferInfo["isSellPriceReadonly"];
    delete OfferInfo["flight"];
    delete OfferInfo["hotelDetails"];
    delete OfferInfo["Adults"];
    delete OfferInfo["Child"];
    delete OfferInfo["Infants"];
    delete OfferInfo["supplierCostPriceAdult"];
    delete OfferInfo["supplierCostPriceChild"];
    delete OfferInfo["supplierCostPriceInfant"];

    setState((prevState) => {
      return {
        ...prevState,
        isLoading: true,
      };
    });
    let reqURL = `cms/package${mode.toLowerCase() === "add" || mode.toLowerCase() === "use" ? "/add" : "/update"
      }`;
    let reqOBJ = { request: OfferInfo };
    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let element = (isMasterPackage ? "dashboard-menu~master-packages-create-package" : "dashboard-menu~packages-create-package");
    let quota = Global.LimitationQuota[element];

    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {

          if (data.isShowOnHomePage && !props.isFromContentManager && false) {

            data["IsCMSPackage"] = true;
            data["ParentId"] = resonsedata?.id;
            let OfferInfoCopy = { ...data };

            let reqURLInner = `cms/package${mode.toLowerCase() === "add" || mode.toLowerCase() === "use" ? "/add" : "/update"
              }`;
            let reqOBJInner = { request: OfferInfoCopy };

            let quotaUsage = localStorage.getItem("quotaUsage");
            quotaUsage = JSON.parse(quotaUsage);
            let element = (isMasterPackage ? "dashboard-menu~master-packages-create-package" : "dashboard-menu~packages-create-package");
            let quota = Global.LimitationQuota[element];

            apiRequester_unified_api(
              reqURLInner,
              reqOBJInner,
              function (resonsedataInner) {
                //console.log(resonsedataInner);
              }.bind(this),
              "POST"
            );
          }
          if (quotaUsage["totalUsed" + quota] === null)
            quotaUsage["totalUsed" + quota] = 1;
          else
            quotaUsage["totalUsed" + quota] =
              quotaUsage["totalUsed" + quota] + 1;
          localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
          setState((prevState) => {
            return {
              ...prevState,
              isLoading: false,
              showSuccessMessage: true,
            };
          });
          if (props.match.params.mode.toLowerCase() === "use") {
            updateInquiry(resonsedata?.id);
          }
        } else {
          if (resonsedata.code) {
            if (resonsedata.code === 101) {
              setState((prevState) => {
                return {
                  ...prevState,
                  isSubscriptionPlanend: true,
                  isLoading: false,
                };
              });
            } else {
              errors.SaveError = resonsedata.error;
            }
          } else {
            errors.SaveError = "Oops! something went wrong";
          }
          setErrors({ ...errors, errors });
          setState((prevState) => {
            return {
              ...prevState,
              isLoading: false,
            };
          });
        }
      }.bind(this),
      "POST"
    );
  };

  const updateInquiry = (id) => {
    var reqURL = "inquiry/update";
    var reqOBJ = {
      id: props.match.params.inquiryid,
      data: {
        itemId: id
      }

    };

    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
    });
  };


  const hidelimitpopup = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isSubscriptionPlanend: !state.isSubscriptionPlanend,
      };
    });
  };

  const handleDataChange = (e) => {
    data[e.target.name] = e.target.value;
    setData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
    if (e.target.name === "countryID") getStateList(e.target.value);
    if (e.target.name === "stateID") getCityList(data.countryID, e.target.value);
  };

  const getFiles = (isLeadImage, mode, files) => {
    //let errors = Object.assign({}, errors);
    if (isLeadImage) {
      delete errors["LeadImage"];
    }
    setErrors((prevState) => {
      return {
        ...prevState,
        errors,
      };
    });
    setState((prevState) => {
      return {
        ...prevState,
        LoadingFile: true,
        files: { ...files },
        uploadDocValidationLeadImage: "",
        uploadDocValidationPDF: "",
        uploadDocValidationImage: "",
      };
    });

    if (
      files &&
      files !== "undefined" &&
      files.base64 &&
      files.base64 !== "undefined"
    ) {
      if (mode === "image" && files.file.size > 1024000) {
        if (isLeadImage) {
          setState((prevState) => {
            return {
              ...prevState,
              uploadDocValidationLeadImage:
                "File size should not be greater then 1 MB.",
            };
          });
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              uploadDocValidationImage:
                "File size should not be greater then 1 MB.",
            };
          });
        }

        return;
      }
      if (mode === "pdf" && files.file.size > 4194304) {
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationPDF:
              "File size should not be greater then 4 MB.",
          };
        });
        return;
      }

      // let errors = Object.assign({}, errors);
      if (isLeadImage) {
        delete errors["LeadImage"];
        delete errors["uploadDocValidationLeadImage"];
      } else if (mode === "pdf") {
        delete errors["uploadDocValidationPDF"];
      }
      let tempRawData = "";
      if (files.base64.includes("data:image/jpeg;base64,")) {
        tempRawData = files.base64.replace("data:image/jpeg;base64,", "");
      } else if (files.base64.includes("data:image/png;base64,", "")) {
        tempRawData = files.base64.replace("data:image/png;base64,", "");
      } else if (
        files.base64.includes("data:application/msword;base64,", "")
      ) {
        tempRawData = files.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (
        files.base64.includes("data:application/pdf;base64,", "")
      ) {
        tempRawData = files.base64.replace(
          "data:application/pdf;base64,",
          ""
        );
      } else if (
        files.base64.includes(
          "data:application/x-zip-compressed;base64,",
          ""
        )
      ) {
        tempRawData = files.base64.replace(
          "data:application/x-zip-compressed;base64,",
          ""
        );
      } else if (
        files.base64.includes(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        )
      ) {
        tempRawData = files.base64.replace(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        );
      }
      let filedata_base64 = tempRawData;
      const reqOBJ = {
        Name: files.name,
        Extension: files.name.split(".").at(-1),
        ContentType: files.type,
        Data: filedata_base64,
      };
      let reqURL = "tw/image/validate";
      setState((prevState) => {
        return {
          ...prevState,
          isSaving: true,
        };
      });
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          if (
            resonsedata &&
            resonsedata.response &&
            resonsedata.response.toLowerCase() === "success"
          ) {
            if (mode === "image" && files.type.includes("image/")) {
              let packageLargeImages = state.packageLargeImages;
              if (isLeadImage)
                packageLargeImages = packageLargeImages.filter(
                  (x) => !x.IsDefaultImage
                );
              let sampleImageObj = {
                id: generateUUID(),
                IsDefaultImage: isLeadImage,
                fileExtension: files.name.split(".").at(-1),
                fileContentType: files.type,
                fileData: files.base64,
                fileName: files.name,
              };

              packageLargeImages.push(sampleImageObj);
              setState((prevState) => {
                return {
                  ...prevState,
                  packageLargeImages,
                  LoadingFile: false,
                };
              });
            } else if (
              mode === "pdf" &&
              files.type === "application/pdf"
            ) {
              let packageBrochure = state.packageBrochure;
              packageBrochure.shift();
              let sampleImageObj = {
                id: generateUUID(),
                fileExtension: files.name.split(".").at(-1),
                fileContentType: files.type,
                fileData: files.base64,
                fileName: files.name,
              };
              packageBrochure.push(sampleImageObj);
              setState((prevState) => {
                return {
                  ...prevState,
                  packageBrochure,
                  LoadingFile: false,
                };
              });
            } else if (
              mode === "image" &&
              !files.type.includes("image/")
            ) {
              if (isLeadImage)
                setState({
                  ...state,
                  uploadDocValidationLeadImage: "Invalid file selected.",
                });
              else
                setState((prevState) => {
                  return {
                    ...prevState,
                    uploadDocValidationImage: "Invalid file selected.",
                  };
                });
            } else if (mode === "pdf" && !files.type.includes("pdf/")) {
              setState((prevState) => {
                return {
                  ...prevState,
                  uploadDocValidationPDF: "Invalid file selected.",
                };
              });
            }
          } else {
            if (mode === "image") {
              if (isLeadImage)
                setState({
                  ...state,
                  uploadDocValidationLeadImage: "Invalid file selected.",
                });
              else
                setState((prevState) => {
                  return {
                    ...prevState,
                    uploadDocValidationImage: "Invalid file selected.",
                  };
                });
            } else if (mode === "pdf") {
              let packageBrochure = state.packageBrochure;
              packageBrochure.shift();
              setState({
                ...state,
                uploadDocValidationPDF: "Invalid file selected.",
                packageBrochure,
              });
            }
          }
        }.bind(this),
        "POST"
      );
    } else if (mode === "image" && !files.type.includes("image/")) {
      if (isLeadImage)
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationLeadImage: "Invalid file selected.",
          };
        });
      else
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationImage: "Invalid file selected.",
          };
        });
    } else if (mode === "pdf" && !files.type.includes("pdf/")) {
      setState((prevState) => {
        return {
          ...prevState,
          uploadDocValidationPDF: "Invalid file selected.",
        };
      });
    }
  };
  const getFilesOld = (isLeadImage, mode, files) => {
    //let errors = Object.assign({}, errors);
    if (isLeadImage) {
      delete errors["LeadImage"];
    }
    setErrors((prevState) => {
      return {
        ...prevState,
        errors,
      };
    });
    setState((prevState) => {
      return {
        ...prevState,
        files: { ...files },
        uploadDocValidationLeadImage: "",
        uploadDocValidationPDF: "",
        uploadDocValidationImage: "",
      };
    });

    if (
      files &&
      files !== "undefined" &&
      files.base64 &&
      files.base64 !== "undefined"
    ) {
      if (mode === "image" && files.file.size > 1024000) {
        if (isLeadImage) {
          setState((prevState) => {
            return {
              ...prevState,
              uploadDocValidationLeadImage:
                "File size should not be greater then 1 MB.",
            };
          });
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              uploadDocValidationImage:
                "File size should not be greater then 1 MB.",
            };
          });
        }

        return;
      }
      if (mode === "pdf" && files.file.size > 4194304) {
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationPDF:
              "File size should not be greater then 4 MB.",
          };
        });
        return;
      }

      // let errors = Object.assign({}, errors);
      if (isLeadImage) {
        delete errors["LeadImage"];
        delete errors["uploadDocValidationLeadImage"];
      } else if (mode === "pdf") {
        delete errors["uploadDocValidationPDF"];
      }
      let tempRawData = "";
      if (state.files.base64.includes("data:image/jpeg;base64,")) {
        tempRawData = state.files.base64.replace("data:image/jpeg;base64,", "");
      } else if (state.files.base64.includes("data:image/png;base64,", "")) {
        tempRawData = state.files.base64.replace("data:image/png;base64,", "");
      } else if (
        state.files.base64.includes("data:application/msword;base64,", "")
      ) {
        tempRawData = state.files.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (
        state.files.base64.includes("data:application/pdf;base64,", "")
      ) {
        tempRawData = state.files.base64.replace(
          "data:application/pdf;base64,",
          ""
        );
      } else if (
        state.files.base64.includes(
          "data:application/x-zip-compressed;base64,",
          ""
        )
      ) {
        tempRawData = state.files.base64.replace(
          "data:application/x-zip-compressed;base64,",
          ""
        );
      } else if (
        state.files.base64.includes(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        )
      ) {
        tempRawData = state.files.base64.replace(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        );
      }
      let filedata_base64 = tempRawData;
      const reqOBJ = {
        Name: state.files.name,
        Extension: state.files.name.split(".").at(-1),
        ContentType: state.files.type,
        Data: filedata_base64,
      };
      let reqURL = "tw/image/validate";
      setState((prevState) => {
        return {
          ...prevState,
          isSaving: true,
        };
      });
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          if (
            resonsedata &&
            resonsedata.response &&
            resonsedata.response.toLowerCase() === "success"
          ) {
            if (mode === "image" && state.files.type.includes("image/")) {
              let packageLargeImages = state.packageLargeImages;
              if (isLeadImage)
                packageLargeImages = packageLargeImages.filter(
                  (x) => !x.IsDefaultImage
                );
              let sampleImageObj = {
                id: generateUUID(),
                IsDefaultImage: isLeadImage,
                fileExtension: state.files.name.split(".").at(-1),
                fileContentType: state.files.type,
                fileData: state.files.base64,
                fileName: state.files.name,
              };

              packageLargeImages.push(sampleImageObj);
              setState((prevState) => {
                return {
                  ...prevState,
                  packageLargeImages,
                  LoadingFile: false,
                };
              });
            } else if (
              mode === "pdf" &&
              state.files.type === "application/pdf"
            ) {
              let packageBrochure = state.packageBrochure;
              packageBrochure.shift();
              let sampleImageObj = {
                id: generateUUID(),
                fileExtension: state.files.name.split(".").at(-1),
                fileContentType: state.files.type,
                fileData: state.files.base64,
                fileName: state.files.name,
              };
              packageBrochure.push(sampleImageObj);
              setState((prevState) => {
                return {
                  ...prevState,
                  packageBrochure,
                  LoadingFile: false,
                };
              });
            } else if (
              mode === "image" &&
              !state.files.type.includes("image/")
            ) {
              if (isLeadImage)
                setState({
                  ...state,
                  uploadDocValidationLeadImage: "Invalid file selected.",
                });
              else
                setState((prevState) => {
                  return {
                    ...prevState,
                    uploadDocValidationImage: "Invalid file selected.",
                  };
                });
            } else if (mode === "pdf" && !state.files.type.includes("pdf/")) {
              setState((prevState) => {
                return {
                  ...prevState,
                  uploadDocValidationPDF: "Invalid file selected.",
                };
              });
            }
          } else {
            if (mode === "image") {
              if (isLeadImage)
                setState({
                  ...state,
                  uploadDocValidationLeadImage: "Invalid file selected.",
                });
              else
                setState((prevState) => {
                  return {
                    ...prevState,
                    uploadDocValidationImage: "Invalid file selected.",
                  };
                });
            } else if (mode === "pdf") {
              let packageBrochure = state.packageBrochure;
              packageBrochure.shift();
              setState({
                ...state,
                uploadDocValidationPDF: "Invalid file selected.",
                packageBrochure,
              });
            }
          }
        }.bind(this),
        "POST"
      );
    } else if (mode === "image" && !state.files.type.includes("image/")) {
      if (isLeadImage)
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationLeadImage: "Invalid file selected.",
          };
        });
      else
        setState((prevState) => {
          return {
            ...prevState,
            uploadDocValidationImage: "Invalid file selected.",
          };
        });
    } else if (mode === "pdf" && !state.files.type.includes("pdf/")) {
      setState((prevState) => {
        return {
          ...prevState,
          uploadDocValidationPDF: "Invalid file selected.",
        };
      });
    }
  };
  const RedirectToList = () => {

    props.isFromContentManager ? handleShowHideForm(0) : props.history.push(isMarketplaceMode ? `/packagemarketplacelist` : isQuickPackage ? `/QuickPackageList` : isMasterPackage ? `/masterpackagelist` : props.isFromContentManager ? props.dealsType === 1 ? `/HotDealsList` : `/PackageList` : `/PackageList`);
  };

  const handleShowHideTax = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isShowExtraFields: !state.isShowExtraFields,
      };
    });
  };

  const generateUUID = () => {
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

  const removeImage = (id) => {
    let packageLargeImages = state.packageLargeImages.filter(
      (x) => x.id !== id
    );
    if (data.images && data.images.filter((x) => x.id === id).length > 0)
      data.images.filter((x) => x.id === id)[0].isDeleted = 1;
    if (data.imagesURL && data.imagesURL.filter((x) => x.id === id).length > 0)
      data.imagesURL.filter((x) => x.id === id)[0].isDeleted = 1;
    setState((prevState) => {
      return {
        ...prevState,
        packageLargeImages,
      };
    });
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };
  const addInclusionExclusion = (description, isInclusion) => {
    const { SelectedRoleID, mode } = state;
    if (isInclusion) {
      if (
        !validateFormData(
          data.inclusion === undefined ? "" : data.inclusion,
          "require"
        )
      ) {
        errors.inclusion = "Inclusion required";
      } else if (
        data.inclusion &&
        !validateFormData(
          data.inclusion,
          "special-characters-not-allowed",
          /[<>]/
        )
      ) {
        errors.inclusion = "< and > characters not allowed";
      }
      else {
        delete Object.assign(errors)["inclusion"];
      }
    } else {
      if (
        !validateFormData(
          data.exclusion === undefined ? "" : data.exclusion,
          "require"
        )
      ) {
        errors.exclusion = "Exclusion required";
      } else if (
        data.exclusion &&
        !validateFormData(
          data.exclusion,
          "special-characters-not-allowed",
          /[<>]/
        )
      ) {
        errors.exclusion = "< and > characters not allowed";
      }
      else {
        delete Object.assign(errors)["exclusion"];
      }
    }
    //errors =  Object.keys(errors).length === 0 ? null : errors;
    setErrors({ ...errors, ...errors || {} });

    if (isInclusion && "inclusion" in errors) return;
    if (!isInclusion && "exclusion" in errors) return;
    var obj = {};
    obj["id"] = generateUUID();
    obj["isInclusion"] = isInclusion;
    obj["description"] = "<![CDATA[" + description + "]]>";
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

    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };
  const removeInclusionExclusion = (id) => {
    let inclusionExclusion = data.inclusionExclusion.filter((x) => x.id !== id);
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
    setState((prevState) => {
      return {
        ...prevState,
        inclusionExclusion,
      };
    });
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const removePDF = (id) => {
    let packageBrochure = state.packageBrochure.filter((x) => x.id !== id);
    if (
      data.packageBrochure &&
      data.packageBrochure.filter((x) => x.id === id).length > 0
    )
      data.packageBrochure.filter((x) => x.id === id)[0].isDeleted = true;
    setState((prevState) => {
      return {
        ...prevState,
        packageBrochure,
      };
    });
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const updateHTML = (datekey, htmldata) => {
    data.datekey = encode(htmldata);
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };
  const RedirectToListPage = () => {
    props.isFromContentManager ? handleShowHideForm(0) : props.history.push(isMarketplaceMode ? `/packagemarketplacelist` : isQuickPackage ? `/QuickPackageList` : isMasterPackage ? `/masterpackagelist` : `/PackageList`);
  };
  const filterResults = (contolName, locationName, lat, long) => {
    data.latitude = lat;
    data.locationName = locationName;
    data.longitude = long;
    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });
  };
  const handleOnChange = () => {
    setData((prevState) => {
      return {
        ...prevState,
        isShowOnHomePage: !data.isShowOnHomePage,
      };
    });
  };

  const handleOnChangeMarketPlace = () => {
    setData((prevState) => {
      return {
        ...prevState,
        isShowOnMarketPlace: !data.isShowOnMarketPlace,
      };
    });
  };

  const handleOnDateChange1 = () => {
    if (moment(data.validFrom).diff(moment(data.validTo), "days") > 0) {
      setData((prevState) => {
        return {
          ...prevState,
          validTo: moment(data.validFrom)
            .add(5, "d")
            .format(Global.DateFormate),
        };
      });
    }
  };
  const handleOnBookingDateChange = (e, picker, d) => {
    let bookingStartDate = picker.startDate.format(Global.DateFormate);
    let bookingEndDate = picker.startDate
      .add(data.duration ? data.duration - 1 : 4, "d")
      .format(Global.DateFormate);
    setData((prevState) => {
      return {
        ...prevState,
        bookingStartDate,
        bookingEndDate,
      };
    });
  };

  const createCart = async () => {
    let reqURL = "api/v1/cart/create";

    let reqOBJ = { Request: {} };
    return new Promise(function (resolve, reject) {
      apiRequester(reqURL, reqOBJ, (data) => {
        localStorage.setItem("cartLocalId", data.response);
        resolve(data.response);
      });
    });
  };

  const CheckforAccessQuota = async (itemscount) => {
    let reqURL = "user/checkaccessquota?type=Booking&totalitems=" + itemscount;
    let reqOBJ = {};
    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.code && data.code === 101) {
            setState((prevState) => {
              return {
                ...prevState,
                isSubscriptionPlanend: !state.isSubscriptionPlanend,
              };
            });
          } else if (data.response) {
            resolve();
          }
        }.bind(this),
        "GET"
      );
    });
  };

  const bookPackage = async () => {
    await CheckforAccessQuota(1);
    await setpersonate(
      data.customerEmail !== "" ? data.customerEmail : data.customerPhone
    );
    let cartId = await createCart();
    let isSuccess = await cartAdd(cartId);
    localStorage.setItem("quotationDetails", JSON.stringify({
      "title": data.packageName,
    }));
    localStorage.setItem("packageInvoice", JSON.stringify({
      "createInvoice": true,
    }));
    if (isSuccess)
      props.history.push(`/QuickBookCart`);
    else
      setState((prevState) => {
        return {
          ...prevState,
          isBookPackageLoading: false,
          isBookPackageError:
            "Ooops, Something went wrong. Kindly try again after some time.",
        };
      });
  };
  const setpersonate = async (Email) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    let reqOBJ = {
      Request: Email,
    };
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.status.code === 4) {
            reject(data);
          } else {
            sessionStorage.setItem("personateId", data.response);
            sessionStorage.setItem("callCenterType", data.userDetail.type);
            sessionStorage.setItem(
              "bookingForInfo",
              JSON.stringify(data.userDetail.details)
            );
            sessionStorage.setItem(
              "bookingFor",
              data.userDetail.details.displayName
            );
            resolve();
          }
        }.bind(this)
      );
    });
  };
  const validateBookPackage = () => {
    if (state.isBookPackageLoading) return;
    if (state.bookNoOfPax === 0) {
      setState((prevState) => {
        return {
          ...prevState,
          isBookPackageErrorPax: "No. of traveller required",
        };
      });
      return;
    } else if (state.bookNoOfPax > 15) {
      setState((prevState) => {
        return {
          ...prevState,
          isBookPackageErrorPax:
            "Maximum number of 15 travellers can be booked.",
        };
      });
      return;
    }
    setState((prevState) => {
      return {
        ...prevState,
        isBookPackageLoading: true,
        isBookPackageError: "",
        isBookPackageErrorPax: "",
      };
    });
  };

  const cartAdd = async (cartId) => {
    let reqURL = "api/v1/cart/add";

    let reqOBJ = {
      Request: {
        CartID: cartId,
        Data: getRequestInfo(),
      },
    };
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          resolve(resonsedata.status.code === 0);
        }.bind(this)
      );
    });
  };

  const getRequestInfo = () => {
    let item = data;
    let durations = moment(item.bookingEndDate).diff(moment(item.bookingStartDate), "days");
    let reqOBJ = [
      {
        ManualItem: {
          business: "package",
          objectIdentifier: "package",
          Name: data.packageName, // item.name && item.name !== "" ? item.name : "Unnamed",
          Description: '',
          Amount: item.sellPrice !== "" ? item.sellPrice : 0,
          dateInfo: {
            startDate: moment(item.bookingStartDate).format("YYYY-MM-DD"),
            endDate: moment(item.bookingEndDate).format("YYYY-MM-DD"),
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
              Value: moment.duration(durations, "days").add(1, "days").days(),
            },
          ],
          paxInfo: [
            {
              typeString: "ADT",
              quantity: Number(data.Adults), //item.guests && item.guests !== "" ? item.guests : "1"
              type: 0,
            },
            {
              typeString: "CHD",
              quantity: Number(data.Child), //item.guests && item.guests !== "" ? item.guests : "1"
              type: 1,
            },
            {
              typeString: "INF",
              quantity: Number(data.Infants), //item.guests && item.guests !== "" ? item.guests : "1"
              type: 2,
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
                name: item.vendor, //"ManualPackageBookingProvider"
              },
            },
          ],
          config: getbrnconfig(item),
          items: [
            {
              item: [
                {
                  name: data.packageName,
                  business: "package",
                  objectIdentifier: "packageOption",
                },
              ],
            },
          ],
        },
      },
    ];

    return reqOBJ;
  };

  const getbrnconfig = (item) => {
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = "activity";
    let objconfig = [];
    let bookNoOfPax = 1;//state.bookNoOfPax === 0 ? 1 : state.bookNoOfPax;

    objconfig = [
      {
        key: "isHideFareBreakupInvoice",
        value: data.isHideFareBreakupInvoice
      },
      {
        key: "SellPrice",
        value: (Number(item.totalAmount) > 0 ? Number(item.totalAmount) : (item.sellPrice && item.sellPrice !== "" ? item.sellPrice : 0)) * bookNoOfPax,
      },
      {
        key: "CostPrice",
        value: getCostPrice(item) * bookNoOfPax
      },
      {
        key: "isOfflineItinerary",
        value: true,
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
        //value: (getAmountValue(item.supplierCostPrice, getCostPrice(item))) * bookNoOfPax
        value: (getAmountValue(item.supplierCostPrice, getCostPrice(item)))
      },
      {
        key: "supplierCostPriceAdult",
        //value: (getAmountValue(item.supplierCostPrice, getCostPrice(item))) * bookNoOfPax
        value: item.supplierCostPriceAdult && item.supplierCostPriceAdult !== ""
          ? item.supplierCostPriceAdult * bookNoOfPax
          : 0,
      },
      {
        key: "supplierCostPriceChild",
        //value: (getAmountValue(item.supplierCostPrice, getCostPrice(item))) * bookNoOfPax
        value: item.supplierCostPriceChild && item.supplierCostPriceChild !== ""
          ? item.supplierCostPriceChild * bookNoOfPax
          : 0,
      },
      {
        key: "supplierCostPriceInfant",
        //value: (getAmountValue(item.supplierCostPrice, getCostPrice(item))) * bookNoOfPax
        value: item.supplierCostPriceInfant && item.supplierCostPriceInfant !== ""
          ? item.supplierCostPriceInfant * bookNoOfPax
          : 0,
      },
      {
        key: "Adult",
        value: item.Adults
      },
      {
        key: "Childs",
        value: item.Child
      },
      {
        key: "Infants",
        value: item.Infants
      },
      {
        key: "supplierTaxPrice",
        value:
          item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice * bookNoOfPax
            : 0,
      },
      {
        key: "supplierCostPricePortalCurrency",
        value:
          (item.supplierCostPrice && item.supplierCostPrice !== ""
            ? parseFloat(item.supplierCostPrice.toString().replace(/,/g, "")) *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : 1
            )
            : 0) * bookNoOfPax,
      },
      {
        key: "supplierTaxPricePortalCurrency",
        value:
          (item.supplierTaxPrice && item.supplierTaxPrice !== ""
            ? item.supplierTaxPrice *
            parseFloat(
              item.conversionRate && item.conversionRate !== ""
                ? item.conversionRate
                : 1
            )
            : 0) * bookNoOfPax,
      },
      {
        key: "markupPrice",
        value:
          item.markupPrice && item.markupPrice !== "" ? item.markupPrice * bookNoOfPax : 0,
      },
      {
        key: "discountPrice",
        value:
          item.discountPrice && item.discountPrice !== ""
            ? item.discountPrice * bookNoOfPax
            : 0,
      },
      {
        key: "CGSTPrice",
        value: item.CGSTPrice && item.CGSTPrice !== "" ? item.CGSTPrice * bookNoOfPax : 0,
      },
      {
        key: "SGSTPrice",
        value: item.SGSTPrice && item.SGSTPrice !== "" ? item.SGSTPrice * bookNoOfPax : 0,
      },
      {
        key: "IGSTPrice",
        value: item.IGSTPrice && item.IGSTPrice !== "" ? item.IGSTPrice * bookNoOfPax : 0,
      },
      {
        key: "GSTPercentage",
        value: Number(item.percentage ?? 0),
      },
      {
        key: "processingFees",
        value: Number(item.processingFees ?? 0) * bookNoOfPax,
      },
      {
        key: "tax1Price",
        value: item.tax1 && item.tax1 !== "" ? item.tax1 * bookNoOfPax : 0,
      },
      {
        key: "tax2Price",
        value: item.tax2 && item.tax2 !== "" ? item.tax2 * bookNoOfPax : 0,
      },
      {
        key: "tax3Price",
        value: item.tax3 && item.tax3 !== "" ? item.tax3 * bookNoOfPax : 0,
      },
      {
        key: "tax4Price",
        value: item.tax4 && item.tax4 !== "" ? item.tax4 * bookNoOfPax : 0,
      },
      {
        key: "tax5Price",
        value: item.tax5 && item.tax5 !== "" ? item.tax5 * bookNoOfPax : 0,
      },
      {
        key: "tax1Name",
        value:
          env.customTaxConfigurations &&
            env.customTaxConfigurations.find(
              (x) => x.business.toLowerCase() === business
            )
            ? env.customTaxConfigurations
              .find((x) => x.business.toLowerCase() === business)
              ?.taxes.find((tax) => Number(tax.purpose) === 160)?.name ?? ""
            : "",
      },
      {
        key: "tax2Name",
        value:
          env.customTaxConfigurations &&
            env.customTaxConfigurations.find(
              (x) => x.business.toLowerCase() === business
            )
            ? env.customTaxConfigurations
              .find((x) => x.business.toLowerCase() === business)
              ?.taxes.find((tax) => Number(tax.purpose) === 161)?.name ?? ""
            : "",
      },
      {
        key: "tax3Name",
        value:
          env.customTaxConfigurations &&
            env.customTaxConfigurations.find(
              (x) => x.business.toLowerCase() === business
            )
            ? env.customTaxConfigurations
              .find((x) => x.business.toLowerCase() === business)
              ?.taxes.find((tax) => Number(tax.purpose) === 162)?.name ?? ""
            : "",
      },
      {
        key: "tax4Name",
        value:
          env.customTaxConfigurations &&
            env.customTaxConfigurations.find(
              (x) => x.business.toLowerCase() === business
            )
            ? env.customTaxConfigurations
              .find((x) => x.business.toLowerCase() === business)
              ?.taxes.find((tax) => Number(tax.purpose) === 163)?.name ?? ""
            : "",
      },
      {
        key: "tax5Name",
        value:
          env.customTaxConfigurations &&
            env.customTaxConfigurations.find(
              (x) => x.business.toLowerCase() === business
            )
            ? env.customTaxConfigurations
              .find((x) => x.business.toLowerCase() === business)
              ?.taxes.find((tax) => Number(tax.purpose) === 164)?.name ?? ""
            : "",
      },
      {
        key: "gstTaxType",
        value: item.taxType && item.taxType !== "" ? item.taxType : "",
      },
      {
        key: "totalAmount",
        value: Number(item.totalAmount ?? 0) * bookNoOfPax,
      },
      {
        key: "isInclusiveGST",
        value: item.isInclusive === "" || !item.isInclusive ? false : item.isInclusive,
      },
      {
        key: "amountWithoutGST",
        value: item.amountWithoutGST === "" || !item.amountWithoutGST ? 0 : item.amountWithoutGST,
      },
      {
        key: "gstTaxAppliedOn",
        value: Number(item.processingFees) > 0 ? "processing-fees" : "sell-price",
      },
    ];

    if (item.brn && item.brn !== "") {
      objconfig.push({
        key: "BRN",
        value: item.brn.trim(),
      });
    }

    if (item?.inquiryId && item?.inquiryId !== "") {
      if (props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use" ||
        props.match.params.mode.toLowerCase() === "view") {
        objconfig.push({
          key: "QuotationItineraryID",
          value: props.match.params.id
        });
      }
    }

    return objconfig;
  };

  const getCostPrice = (item) => {
    return item.costPrice && item.costPrice !== ""
      ? item.costPrice.toString().replace(/,/g, "")
      : 0;
  };
  const handleShowHideForm = (flag) => {
    props.handleShowHideForm(flag);
  }

  const getAmountValue = (amount, amountToRepace) => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      amount = amount.toString().replace(/,/g, "");
    } else if (amount && !isNaN(Number(amount)) && Number(amount) === 0) {
      amount = amountToRepace ? amountToRepace : 0;
    } else
      amount = amountToRepace ? amountToRepace.toString().replace(/,/g, "") : 0;
    return amount;
  };

  const handleBookPackagePopup = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isBookPackagePopup: false,
        bookNoOfPax: 0,
        isBookPackageLoading: false,
        isBookPackageErrorPax: "",
        isBookPackageErrorPax: "",
      };
    });
  };

  const handlebookNoOfPax = (e) => {
    let count = e.target.value;
    if (!isNaN(Number(count)) && count.indexOf("-1") === -1) {
      setState((prevState) => {
        return {
          ...prevState,
          bookNoOfPax: Number(count),
        };
      });
    } else
      setState((prevState) => {
        return {
          ...prevState,
          bookNoOfPax: 0,
        };
      });
  };
  const setFocusOnVendor = () => {
    setState((prevState) => {
      return {
        ...prevState,
        showPopup: false,
        popupContent: "",
        popupTitle: "",
        isBtnLoading: false,
        isLoading: false,
      };
    });
    //inputRef['vendor'].current && references['vendor'].current.focus();
  };
  const handleCustomerChange = (bookingForInfo) => {
    console.log("handleCustomerChange", state.inquiryDetails?.data?.customerName);
    console.log("handleCustomerChange", data.customerName)
    console.log("handleCustomerChange", data.twCustomerName)
    data.customerName = (isMarketplaceMode || isMasterPackage)
      ? "Demo Customer"
      : props.match.params.mode === "Edit"
        ? data.twCustomerName
        : props.match.params.mode.toLowerCase() === "use" ? state.inquiryDetails?.data?.customerName : bookingForInfo && bookingForInfo.displayName
          ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
          : data.twCustomerName || "";

    data.customerEmail = (isMarketplaceMode || isMasterPackage)
      ? "democustomer@tourwiz.com"
      : props.match.params.mode === "Edit"
        ? data.twCustomerEmail
        : props.match.params.mode.toLowerCase() === "use" ? state.inquiryDetails?.data?.email : bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.email
          : data.twCustomerEmail || "";

    data.customerPhone = (isMarketplaceMode || isMasterPackage)
      ? "+91-1234567890"
      : props.match.params.mode === "Edit"
        ? data.twCustomerPhone
        : props.match.params.mode.toLowerCase() === "use" ? state.inquiryDetails?.data?.phone : bookingForInfo && bookingForInfo.contactInformation
          ? bookingForInfo.contactInformation.phoneNumber
          : data.twCustomerPhone || "";

    setData((prevState) => {
      return {
        ...prevState,
        ...data,
      };
    });

  }

  const handlePopup = () => {
    setState((prevState) => {
      return {
        ...prevState,
        popupTitle: state.showPopup ? "" : "Vendor/Supplier",
        showPopup: !state.showPopup,
        popupContent: state.showPopup ? (
          ""
        ) : (
          <div>
            <div>Add package without Vendor/Supplier?</div>
            <button
              className="btn btn-primary pull-right m-1 "
              onClick={() => savePackageClick(true)}
            >
              {Trans("_yes")}
            </button>

            <button
              className="btn btn-primary pull-right m-1 "
              onClick={() => setFocusOnVendor()}
            >
              {Trans("_no")}
            </button>
          </div>
        ),
        sizeClass: "modal-dialog",
      };
    });
  };

  let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
  const {
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
    isBookPackagePopup,
    bookNoOfPax,
    isBookPackageLoading,
    isBookPackageError,
    isBookPackageErrorPax,
  } = state;
  const disabled = mode === "view";
  const isEditMode = mode === "edit";
  const { userInfo } = props;
  let currencyList = [{ name: "Select", value: "" }];
  Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
    currencyList.push({
      name: x.isoCode + " (" + x.symbol + ")",
      value: x.isoCode + " (" + x.symbol + ")",
    })
  );

  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");

  var tet =
    moment(data.validFrom).diff(moment(data.validTo), "days") > 0
      ? moment(data.validFrom).format(Global.DateFormate)
      : moment().add(1, "m").format(Global.DateFormate);

  const handleCreate = (vendorName) => {
    setData((prevState) => { return { ...prevState, vendor: vendorName }; });
  }
  const handleChange1 = (e) => {
    if (e == null) {
      setData((prevState) => { return { ...prevState, vendor: null }; });
    }
    else {
      setData((prevState) => { return { ...prevState, vendor: e.label }; });
    }
  }

  let supplierOptions = []

  if (state.suppliers.length > 0) {
    let agentSupplier = state.suppliers.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
    let tourwizSupplier = state.suppliers.filter(x => x.isTourwizSupplier === 1).map(item => { return { label: item.fullName, value: item.providerId } });
    let Supplier = state.suppliers.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
    supplierOptions = [
      {
        label: "Agent Supplier",
        options: agentSupplier
      },
      {
        label: "Tourwiz Supplier",
        options: tourwizSupplier
      }
    ];
    supplierOptions = Supplier;
  }
  const customStyles = {
    control: styles => ({ ...styles, "textTransform": "capitalize" }),
    option: styles => ({ ...styles, "textTransform": "capitalize" }),
    menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
  };
  function handleAssistant() {
    setAssistantInput("");
    setIsAssistant(!isAssistant);
    setAssistantResponse("");
  }
  function handleFetchData(response) {
    setAssistantResponse(response);
  }
  function handleFetchInputData(inputData) {
    setAssistantInput(inputData);
  }
  function getResponseData(response) {
    setPasteFromAI(response);
    setIsAssistant(false);
  }
  function closeAssitant() {
    setIsAssistant(false);
  }
  function showauthorizepopup() {
    setIsShowAuthorizePopup(true);
  }
  function hideauthorizepopup() {
    setIsShowAuthorizePopup(false);
  }

  const css = `
  .package-tab span {
    height: 100%;
}`;

  const key2Types = packageTypeList.filter(item => item.key === parseInt(data.packageThemes))[0].types;//.map(type => type.name);
  //console.log(key2Types); // ["Select Package Type", "Spiritual", "Adventure", "Yatra", "Educational", "Leisure", "Honeymoon", "Wildlife"]
  var tet = moment(data.validFrom).diff(moment(data.validTo), 'days') > 0 ? moment(data.validFrom).format(Global.DateFormate) : moment().add(1, "m").format(Global.DateFormate);


  const handleOnChangeMarketPlaceNew = () => {
    setData((prevState) => {
      return {
        ...prevState,
        isShowOnMarketPlace: !data.isShowOnMarketPlace,
      };
    });
  };
  const handleHideFareBreakupInvoice = () => {
    setData((prevState) => {
      return {
        ...prevState,
        isHideFareBreakupInvoice: !data.isHideFareBreakupInvoice,
      };
    });
  };
  const handleOnChangeMarketPlaceTW = () => {
    setData((prevState) => {
      return {
        ...prevState,
        isShowOnTourWizMarketPlace: !data.isShowOnTourWizMarketPlace,
      };
    });
  };
  const changeCustomerType = (Type) => {
    let newData = { ...data };
    newData.bookingFor = Type;
    if (Type === "Corporate" && AuthorizeComponentCheck(props.userInfo.rolePermissions, "inquiries~create-inquiry-corporate")) {
      // if (Type === 'Corporate' && false) {
      setData(newData);
    }
    else if (Type === "Individual") {
      setData(newData);
    }
    else {
      setData(newData);
      setIsShowAuthorizePopup(true)
    }
  };
  return (
    <div>
      <style>{css}</style>
      <Helmet>
        <title>
          {mode === "add" ? "Create " : mode === "view" ? "View " : mode.toLowerCase() === "use" ? "Create " : "Edit "}{" "}
          {isMasterPackage ? `Master Package` : `Package`}
        </title>
      </Helmet>
      <div className={props.isFromContentManager ? "border-bottom pt-1 pb-1 mb-3" : "title-bg pt-3 pb-3 mb-3"}>
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <h1 className={props.isFromContentManager ? "text-dark m-0 p-0 f30" : "text-white m-0 p-0 f30"}>
                {!props.isFromContentManager && <SVGIcon
                  name="file-text"
                  width="24"
                  height="24"
                  className="mr-3"
                ></SVGIcon>}
                {mode === "add" ? "Create " : mode === "view" ? "View " : mode.toLowerCase() === "use" ? "Create " : "Edit "}{" "}
                {isMasterPackage ? `Master Package` : props.isFromContentManager ? props.dealsType === 1 ? 'Hot Deal' : `Package` : `Package`}
              </h1>
            </div>
            <div className="col-lg-3 d-flex justify-content-end">
              <button
                className="btn btn-sm btn-primary pull-right"
                onClick={() => props.isFromContentManager ? handleShowHideForm(0) : props.history.push(isMarketplaceMode ? `/packagemarketplacelist` : isQuickPackage ? `/QuickPackageList` : isMasterPackage ? `/masterpackagelist` : `/PackageList`)}
              >
                {isMasterPackage ? `Manage Master Packages` : props.isFromContentManager ? props.dealsType === 1 ? 'Manage Hot Deals' : `Manage Packages` : `Manage Packages`}
              </button>
              {!isEditModeLoading && mode === "edit" && !isMasterPackage && !isMarketplaceMode && !props.isFromContentManager && (
                <AuthorizeComponent
                  title="dashboard-menu~packages-book-package"
                  type="button"
                  rolepermissions={userInfo.rolePermissions}
                >
                  <button
                    onClick={() => {
                      !GlobalEvents.handleCheckforFreeExcess(
                        props,
                        "QuotationDetails~quotation-book-quotation",
                        1
                      )
                        ? setState((prevState) => {
                          return {
                            ...prevState,
                            isSubscriptionPlanend: true,
                          };
                        })
                        : setState((prevState) => {
                          return {
                            ...prevState,
                            isBookPackagePopup: true,
                          };
                        });
                    }}
                    className="btn btn-sm btn-primary pull-right mr-2 ml-2"
                  >
                    Generate Invoice
                  </button>
                </AuthorizeComponent>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {/* <div className="col-lg-3 hideMenu">
                        <QuotationMenu handleMenuClick={handleMenuClick} userInfo={props.userInfo} />
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
                    handleClose={() => RedirectToList()}
                  />
                )}
                {data.status === "REJECTED" && (
                  <div className="col-lg-12 alert alert-danger mt-2 p-1 d-inline-block">
                    <p className="m-2">
                      Your offer has been <strong>Rejected</strong> due to below
                      reason.
                    </p>
                    <blockquote className="m-2 ml-4">
                      <i>{data.statusReason}</i>
                    </blockquote>
                  </div>
                )}
                {(!isMarketplaceMode && !isMasterPackage && !props.isFromContentManager) && <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                  <h5 className="text-primary border-bottom pb-2 mb-2">
                    Customer Details
                  </h5>
                  <div className="row">
                    <div className="col-lg-3">
                      {/* {this.renderSelect("bookingFor", "Booking For Source", bookingForList)} */}
                      <div className="BE-Search-Radio pt-1">
                        <label className="d-block">Booking For Source</label>
                        {mode === "edit"
                          ? <button className="btn btn-primary w-100 btn-sm">{(data.bookingFor === '' || data.bookingFor === null || data.bookingFor === undefined) ? 'Individual' : data.bookingFor}</button>
                          :
                          <ul>
                            <li className="checked">
                              <input
                                checked={data.bookingFor === "Individual" ? true : false}
                                value="Individual"
                                name="Direction"
                                type="radio"
                                onChange={() => changeCustomerType("Individual")}
                              />
                              <label>Individual</label>
                            </li>
                            <li>
                              <input
                                value="Corporate"
                                name="Direction"
                                type="radio"
                                checked={data.bookingFor === "Corporate" ? true : false}
                                onChange={() => changeCustomerType("Corporate")}
                              />
                              <label>Corporate</label>
                            </li>
                          </ul>
                        }
                      </div>
                    </div>
                    {(data.bookingFor === "Individual" || data.bookingFor === "" || data.bookingFor === null || data.bookingFor === undefined)
                      ? <div className="col-lg-6">
                        <CustomerAddSelect
                          labelName="Individual"
                          key={"Customer"}
                          isReadOnly={props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use"}
                          userInfo={userInfo}
                          errors={errors}
                          handleChange={handleCustomerChange}
                          selectedCustomer={(props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use")
                            ? {
                              "name": data.twCustomerName || state.inquiryDetails?.data?.customerName,
                              "contactInformation": {
                                "email": data.twCustomerEmail || state.inquiryDetails?.data?.email,
                                "phoneNumber": data.twCustomerPhone || state.inquiryDetails?.data?.phone
                              }
                            }
                            : null}
                        />
                      </div>
                      : <div className="col-lg-6">
                        <CustomerAddSelect
                          labelName="Corporate"
                          key={"Corporate"}
                          isReadOnly={props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use"}
                          userInfo={userInfo}
                          errors={errors}
                          handleChange={handleCustomerChange}
                          selectedCustomer={(props.match.params.mode.toLowerCase() === "edit" || props.match.params.mode.toLowerCase() === "use")
                            ? {
                              "name": data.twCustomerName || state.inquiryDetails?.data?.customerName,
                              "contactInformation": {
                                "email": data.twCustomerEmail || state.inquiryDetails?.data?.email,
                                "phoneNumber": data.twCustomerPhone || state.inquiryDetails?.data?.phone
                              }
                            }
                            : null}
                        />
                      </div>
                    }

                  </div>
                </div>
                }
              </div>
              <div className="container mt-4">
                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                  <h5 className="text-primary border-bottom pb-2 mb-2">
                    Package Details
                  </h5>
                  <div className="row">
                    {!isQuickPackage &&
                      <>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                          {renderInput({
                            name: "packageName",
                            label: "Title *",
                            minLength: 2,
                            maxLength: 100,
                          })}
                        </div>
                        <div className={props.isFromContentManager ? "col-lg-3 col-md-6 col-sm-12 d-none" : "col-lg-2 col-md-6 col-sm-12"}>
                          {renderSelect({ name: "packageThemes", label: "Category *", options: PackageCategory })}
                        </div>
                        <div className={props.isFromContentManager ? "col-lg-3 col-md-6 col-sm-12" : "col-lg-2 col-md-6 col-sm-12"}>
                          {renderSelect({ name: "specialPromotionType", label: "Type", options: key2Types })}
                        </div>
                        <div className="col-lg-2">
                          {renderSelect({ name: "tripType", label: "Trip Type", options: tripTypeList })}
                        </div>
                        <div className={props.isFromContentManager ? "col-lg-3 col-md-6 col-sm-12" : "col-lg-2 col-md-6 col-sm-12"}>
                          {renderSelect({ name: "rating", label: "Star Rating", options: starRating })}
                        </div>
                        <div className="col-lg-2">
                          {renderSelect({ name: "status", label: "Status", options: statusList })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderSingleDate({
                            name: "validFrom",
                            label: "Valid From",
                            startdate: moment().format(Global.DateFormate),
                            mindate: moment("2001-01-01").format(
                              Global.DateFormate
                            ),
                            onChange:
                              moment(data.validFrom).diff(
                                moment(data.validTo),
                                "days"
                              ) > 0
                                ? handleOnDateChange1()
                                : undefined,
                            disabled: false,
                          })}
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderSingleDate({
                            name: "validTo",
                            label: "Valid To",
                            startdate:
                              moment(data.validFrom).diff(
                                moment(data.validTo),
                                "days"
                              ) > 0
                                ? moment(data.validFrom).format(Global.DateFormate)
                                : moment().add(1, "m").format(Global.DateFormate),
                            mindate: moment(data.validFrom).format(
                              Global.DateFormate
                            ),
                            undefined,
                            disabled: false,
                          })}
                        </div>
                        <div
                          className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "duration",
                            label: "Duration (in days)",
                            type: "text",
                          })}
                        </div>
                      </>}

                    {!isQuickPackage && <>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        <div className={"form-group " + "countryID"}>
                          <label htmlFor={"countryID"}>{"Country *"}</label>
                          <div className="input-group">
                            <select
                              value={data.countryID}
                              onChange={(e) => handleDataChange(e)}
                              name={"countryID"}
                              id={"countryID"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>Select</option>
                              {CountryList.map((option, key) => (
                                <option key={key} value={option["countryId"]}>
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
                              onChange={(e) => handleDataChange(e)}
                              name={"stateID"}
                              id={"stateID"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>
                                Select
                              </option>
                              {StateList.length > 0 &&
                                StateList.map((option, key) => (
                                  <option key={key} value={option["stateId"]}>
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
                              onChange={(e) => handleDataChange(e)}
                              name={"cityID"}
                              id={"cityID"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>
                                Select
                              </option>
                              {CityList.map((option, key) => (
                                <option key={key} value={option["cityId"]}>
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
                      {/* <div
                        className="col-lg-2 col-md-6 col-sm-12">
                        <label>Assigned To</label>
                      </div>
                      <div
                        className="col-lg-2 col-md-6 col-sm-12">
                        <label>Priority</label>
                      </div> */}
                      <div className="col-lg-2 col-md-6 col-sm-12" style={{ display: "none" }}>
                        <div className={"form-group " + "currencyID"}>
                          <label htmlFor={"currencyID"}>{"Currency *"}</label>
                          <div className="input-group">
                            <select
                              value={data.currencyID}
                              onChange={(e) => handleDataChange(e)}
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
                        {renderInput({
                          name: "offerPrice",
                          label: "Offer price",
                          type: "number",
                        })}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="col-sm-12 p-0">
                          <FileBase64
                            multiple={false}
                            onDone={getFiles.bind(this, true, "image")}
                            name="uploadDocument"
                            label={"Featured Image "}
                            placeholder={"Select Image file"}
                            className="w-100 col-lg-12"
                          />
                        </div>
                        {(state.LoadingFile && !state.uploadDocValidationPDF && !state.uploadDocValidationImage) &&
                          <div
                            className="col-lg-12 col-md-6 col-sm-12 m-0 p-0 pull-left"
                            role="alert"
                          >
                            <div class="spinner-grow text-secondary" style={{ width: "0.8rem", height: "0.8rem" }} role="status">
                              <span class="visually-hidden"></span>
                            </div>
                            <div class="spinner-grow text-secondary" style={{ width: "0.8rem", height: "0.8rem" }} role="status">
                              <span class="visually-hidden"></span>
                            </div>
                            <div class="spinner-grow text-secondary" style={{ width: "0.8rem", height: "0.8rem" }} role="status">
                              <span class="visually-hidden"></span>
                            </div>
                          </div>
                        }
                        <div
                          className="col-sm-12 p-0 pull-left"
                          style={{ marginTop: "-6px" }}
                        >
                          {state.uploadDocValidationLeadImage && (
                            <small className="alert alert-danger m-0 p-1 d-inline-block">
                              {state.uploadDocValidationLeadImage}
                            </small>
                          )}
                          {errors["LeadImage"] && state.packageLargeImages?.filter((x) => x.IsDefaultImage).length == 0 && (
                            <small className="alert alert-danger praful m-0 p-1 d-inline-block">
                              {errors["LeadImage"]}
                            </small>
                          )}
                        </div>
                        <div className="col-sm-12 m-0 p-0 pull-left">
                          {state.packageLargeImages && state.packageLargeImages.length > 0 && state.packageLargeImages
                            ?.filter((x) => x.IsDefaultImage).length == 0 && data.images
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
                                      onClick={() => removeImage(item.id)}
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button> */}
                                    </div>
                                  </div>
                                );
                              })}
                          {!state.uploadDocValidationLeadImage && state.packageLargeImages
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
                                      onClick={() => removeImage(item.id)}
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
                          {/* <small>{state.LoadingFile ? "loading" : "done"}</small> */}
                          <FileBase64
                            multiple={false}
                            onDone={getFiles.bind(this, true, "pdf")}
                            name="uploadDocument"
                            label={"Brochure (Up to 4MB)"}
                            placeholder={"Select PDF file"}
                            className="w-100 col-lg-12"
                          />

                          <div className="col-sm-12 p-0 m-0 pull-left">
                            {state.uploadDocValidationPDF && (
                              <small className="alert alert-danger m-0 p-1 d-inline-block">
                                {state.uploadDocValidationPDF}
                              </small>
                            )}
                          </div>
                          <div className="col-sm-12 m-0 p-0 pull-left">
                            {data?.packageBrochure
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
                                        onClick={() => removePDF(item.id)}
                                      >
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            {!state.uploadDocValidationPDF && state.packageBrochure?.map((item, index) => {
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
                                      onClick={() => removePDF(item.id)}
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
                    </>}
                    <div className="col-lg-2 col-md-6 col-sm-12 d-none">
                      {renderInput({
                        name: "sellPriceDisplay",
                        label: "Display Price (" + portalCurrency + ")",
                        type: "text",
                        disable: (data.totalAmount > 0 && Number(data.totalAmount) > Number(data.sellPrice)) ? true : false,
                        onBlurCB: handleAmountFields
                      })}
                    </div>

                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-2 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label for="amountWithoutGST">Vendor/Supplier</label>
                            <CreatableSelect
                              id={"vendor"}
                              styles={customStyles}
                              name={"vendor"}
                              isClearable={true}
                              placeholder={''}
                              //defaultInputValue={supplierOptions.find(x => x.label.toLowerCase() === state.data.vendor) ?? ''}
                              options={supplierOptions}
                              value={(data.vendor !== "" && data.vendor !== null) ? (supplierOptions.find(x => x.label.toLowerCase() === data.vendor) ?? { "label": data.vendor, "value": 0 }) : null}
                              isLoading={state.isSupplierlistLoading}
                              loadingMessage={() => 'Loading...'}
                              onCreateOption={handleCreate}
                              onChange={handleChange1}
                            // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                            />
                          </div>
                        </div>
                        {data.isInclusive && data.sellPrice > 0 && Number(data.processingFees) === 0 && Number(data.amountWithoutGST) > 0 &&
                          <div className="col-lg-2 d-none">
                            <div className="form-group amountWithoutGST">
                              <label for="amountWithoutGST">Sell Price (Without GST)</label>
                              <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={data.amountWithoutGST} />
                            </div>
                          </div>
                        }
                        <div className="col-lg-2">
                          {renderInput({
                            name: "sellPrice",
                            label: "Sell Price (" + portalCurrency + ")",
                            type: "text",
                            disable: data.isSellPriceReadonly,
                            onBlurCB: handleAmountFields
                          })}
                        </div>
                        {data.totalAmount > 0 && Number(data.totalAmount) > Number(data.sellPrice) &&
                          <div className="col-lg-2">
                            {renderInput({
                              name: "totalAmount",
                              label: "Total Amount (" + portalCurrency + ")",
                              type: "text",
                              disable: true,
                              onBlurCB: handleAmountFields
                            })}
                          </div>}
                        {!isQuickPackage &&
                          <div className="col-lg-2 col-md-6 col-sm-12">
                            <div className={"form-group AdvancedPricing"}>
                              {!(data.totalAmount > 0 && Number(data.totalAmount) > Number(data.sellPrice)) && <label htmlFor={"AdvancedPricing"} style={{ visibility: "hidden" }}>AdvancedPricing </label>}
                              {/* <button
                            className="btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn mx-auto"
                            onClick={() => setState({ isShowAdvancedPricing: !state.isShowAdvancedPricing })}
                          >
                            {Trans("Advanced Pricing")}
                          </button> */}
                              <label></label>
                              <Link
                                activeClass="active"
                                className="btn btn-sm m-0 btn-outline-primary text-center d-flex text-center mx-auto"
                                href="#"
                                to={!state.isShowExtraFields ? "overview" : ""}
                                onClick={() => setState((prevState) => {
                                  return {
                                    ...prevState,
                                    isShowExtraFields: !state.isShowExtraFields,
                                  };
                                })}
                                spy={true}
                                smooth={true}
                                offset={-120}
                                duration={500}
                              >
                                {!state.isShowExtraFields ? Trans("Show Advanced Pricing") : Trans("Hide Advanced Pricing")}
                              </Link>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                    {(isCMSPortalCreated && !isMarketplaceMode && !isMasterPackage && !isQuickPackage) && (
                      <React.Fragment>

                        <div
                          className="col-lg-12 col-md-6 col-sm-12"
                        >
                          <div className={"form-group " + "isShowOnHomePage"}>
                            {/* <label htmlFor={"isShowOnHomePage"}>Publish on </label> */}
                            <div className="input-group">
                              <div className="form-check form-check-inline mr-5">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="isShowOnHomePage"
                                  id="isShowOnHomePage"
                                  onChange={handleOnChange}
                                  value={data.isShowOnHomePage}
                                  checked={data.isShowOnHomePage}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="IsActiveYes"
                                  onClick={handleOnChange}
                                >
                                  Publish on own website ?
                                </label>
                              </div>
                              <div className="form-check form-check-inline mr-5 d-none">
                                <input
                                  id="isHideFareBreakupInvoice"
                                  name="isHideFareBreakupInvoice"
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={data.isHideFareBreakupInvoice}
                                  value={data.isHideFareBreakupInvoice}
                                  onChange={handleHideFareBreakupInvoice}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="isHideFareBreakupInvoice"
                                >
                                  Hide Fare Breakup In Invoice
                                </label>
                              </div>
                              <div className="form-check form-check-inline mr-5" style={{ display: "none" }}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="isShowOnPATAMarketPlace"
                                  id="isShowOnPATAMarketPlace"
                                  onChange={handleOnChangeMarketPlaceNew}
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
                                  onChange={handleOnChangeMarketPlaceNew}
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
                                  onChange={handleOnChangeMarketPlaceNew}
                                  value={data.isShowOnTAAIMarketPlace}
                                  checked={data.isShowOnTAAIMarketPlace}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="IsActiveYes"
                                  onClick={handleOnChangeMarketPlaceNew}
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
                                  onChange={handleOnChangeMarketPlace}
                                  value={data.isShowOnMarketPlace}
                                  checked={data.isShowOnMarketPlace}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="IsActiveYes"
                                  onClick={handleOnChangeMarketPlace}
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
                                  onChange={handleOnChangeMarketPlaceTW}
                                  value={data.isShowOnTourWizMarketPlace}
                                  checked={data.isShowOnTourWizMarketPlace}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="IsActiveYes"
                                  onClick={handleOnChangeMarketPlaceTW}
                                >
                                  TourWiz Marketplace ?
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>)}
                  </div>
                  <div className={`row ${(isCMSPortalCreated && !isMarketplaceMode && !isMasterPackage && !isQuickPackage) ? 'mt-3' : 'mt-5'}`}>
                    <div className="col-lg-12" style={{
                      width: "412px", overflowX: "auto"
                    }} >
                      {!isQuickPackage && <div className="row">
                        <div className="col-lg-12 d-flex flex-row">
                          {!isQuickPackage && <div
                            className={
                              "package-tab" +
                              (activeTab === "Overview" ? " active" : "")
                            }
                            onClick={() => handleTabChange("Overview")}
                          >
                            <span>Overview</span>
                          </div>}
                          <div
                            className={
                              "package-tab" +
                              (activeTab === "Itinerary" ? " active" : "")
                            }
                            onClick={() => handleTabChange("Itinerary")}
                          >
                            <span>Itinerary</span>
                          </div>
                          {!isQuickPackage && <>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Flight" ? " active" : "")
                              }
                              onClick={() => handleTabChange("Flight")}
                            >
                              <span>Flight Details</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "hotelDetails" ? " active" : "")
                              }
                              onClick={() => handleTabChange("hotelDetails")}
                            >
                              <span>Hotel Details</span>
                            </div>

                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Incusion" ? " active" : "")
                              }
                              onClick={() => handleTabChange("Incusion")}
                            >
                              <span>Inclusions</span>
                            </div>

                            <div
                              className={
                                "package-tab" +
                                (activeTab === "exclusion" ? " active" : "")
                              }
                              onClick={() => handleTabChange("exclusion")}
                            >
                              <span>Exclusions</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "PhotoGallery" ? " active" : "")
                              }
                              onClick={() => handleTabChange("PhotoGallery")}
                            >
                              <span>Photo Gallery</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "PriceGuidelines" ? " active" : "")
                              }
                              onClick={() => handleTabChange("PriceGuidelines")}
                            >
                              <span>Price Guidelines</span>
                            </div>
                            <div
                              className={
                                "package-tab" +
                                (activeTab === "Terms" ? " active" : "")
                              }
                              onClick={() => handleTabChange("Terms")}
                            >
                              <span>Terms & Conditions</span>
                            </div>
                          </>
                          }

                        </div>
                      </div>}
                    </div>
                    <div className="col-lg-12 package-tab-row" style={{
                      width: "412px", overflowX: "auto"
                    }} >
                    </div>
                    <div className="col-lg-12 col-md-6 col-sm-12 mt-3">
                      {!isQuickPackage && ((props.ipCountryName.toLowerCase() !== "india" || true) && activeTab !== "PhotoGallery") &&
                        <div className="row">
                          <div className="col-lg-12 col-md-6 col-sm-12  mb-3 d-flex justify-content-end">
                            <button type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => AuthorizeComponentCheck(props.userInfo.rolePermissions, "ai-assistant~button") ? handleAssistant(true) : showauthorizepopup()}
                            >
                              Your AI Assistant
                            </button>
                          </div>
                        </div>
                      }
                      {/* {renderTextarea("ADVT_HTMLText", "Offer details", "Detailed Info for an offer.", disabled)} */}
                      {activeTab === "Overview" && (
                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.summaryDescription)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  summaryDescription: encode(data),
                                };
                              });
                            }}
                          />

                          {errors["summaryDescription"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["summaryDescription"]}
                            </small>
                          )}
                        </div>
                      )}
                      {activeTab === "Itinerary" && (<>
                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={pasteFromAI !== "" ? decode(pasteFromAI) : decode(data.description)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  description: encode(data),
                                };
                              });
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
                      {activeTab === "Flight" && (
                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.flight)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  flight: encode(data),
                                };
                              });
                            }}
                          />

                          {errors["flight"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["flight"]}
                            </small>
                          )}
                        </div>
                      )}

                      {activeTab === "hotelDetails" && (
                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.hotelDetails)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  hotelDetails: encode(data),
                                };
                              });
                            }}
                          />

                          {errors["hotelDetails"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["hotelDetails"]}
                            </small>
                          )}
                        </div>
                      )}
                      {activeTab === "Incusion" && (

                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.inclusion)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              let dataState = encode(data);
                              setData((prevState) => { return { ...prevState, inclusion: encode(data) }; });
                              // addInclusionExclusion(
                              //   dataState.inclusion,
                              //   true
                              // )
                            }}
                          />

                          {errors["inclusion"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["inclusion"]}
                            </small>
                          )}
                        </div>
                      )}
                      {activeTab === "exclusion" && (


                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.exclusion)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              let dataState = encode(data);
                              setData((prevState) => { return { ...prevState, exclusion: encode(data) }; });
                              // addInclusionExclusion(
                              //   dataState.exclusion,
                              //   false
                              // )
                            }}
                          />

                          {errors["exclusion"] && (
                            <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                              {errors["exclusion"]}
                            </small>
                          )}
                        </div>
                      )}{activeTab === "PriceGuidelines" && (
                        <div className="form-group locationName">
                          <CKEditor
                            editor={ClassicEditor} config={Global.toolbarFCK}
                            data={decode(data.twPriceGuideLine)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  twPriceGuideLine: encode(data),
                                };
                              });
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
                              onDone={getFiles.bind(
                                this,
                                false,
                                "image"
                              )}
                              name="uploadDocument"
                              placeholder={"Select Image file"}
                              className="w-100 col-lg-12 p-0"
                            />

                            {state.uploadDocValidationImage && (
                              <small className="alert alert-danger p-1 d-inline-block">
                                {state.uploadDocValidationImage}
                              </small>
                            )}
                            {errors["packageLargeImages"] && (
                              <small className="alert alert-danger p-1 d-inline-block">
                                {errors["packageLargeImages"]}
                              </small>
                            )}
                          </div>

                          {data.images
                            ?.filter((x) => !x.isDefaultImage && !x.isDeleted)
                            .map((item, index) => {
                              return item.imagepath && (
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
                                    onClick={() => removeImage(item.id)}
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                  <img
                                    src={item.imagepath &&
                                      (item.imagepath.indexOf("http") > -1
                                        ? item.imagepath
                                        : "http://preprod-images.yourtripplans.tech/cms/portals/" +
                                        item.portalID +
                                        "/SpecialsPromotions/images/" +
                                        item.imagepath)
                                    }
                                    className="img-fluid img-thumbnail"
                                    style={{ height: "260px" }}
                                  />
                                </div>
                              );
                            })}
                          {!state.uploadDocValidationImage && state.packageLargeImages
                            ?.filter((x) => !x.isDefaultImage)
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
                                    onClick={() => removeImage(item.id)}
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
                            data={decode(data.termsConditions)}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setData((prevState) => {
                                return {
                                  ...prevState,
                                  termsConditions: encode(data),
                                };
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="container overview mt-4">
                {state.isShowExtraFields &&
                  <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                      Other Details
                      <button
                        class="btn btn-link p-0 m-0 text-primary pull-right"
                        onClick={handleShowHideTax}
                      >
                        {state.isShowExtraFields ? "Hide" : "Show"} More
                      </button>
                    </h5>
                    <div className="row">
                      <div className="col-lg-3 col-md-6 col-sm-12 d-none">
                        <div className="form-group">
                          <label for="amountWithoutGST">Vendor/Supplier</label>
                          <CreatableSelect
                            id={"vendor"}
                            styles={customStyles}
                            name={"vendor"}
                            isClearable={true}
                            placeholder={''}
                            //defaultInputValue={supplierOptions.find(x => x.label.toLowerCase() === state.data.vendor) ?? ''}
                            options={supplierOptions}
                            value={(data.vendor !== "" && data.vendor !== null) ? (supplierOptions.find(x => x.label.toLowerCase() === data.vendor) ?? { "label": data.vendor, "value": 0 }) : null}
                            isLoading={state.isSupplierlistLoading}
                            loadingMessage={() => 'Loading...'}
                            onCreateOption={handleCreate}
                            onChange={handleChange1}
                          // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                          />
                        </div>
                      </div>
                      {data.isInclusive && data.sellPrice > 0 && Number(data.processingFees) === 0 && Number(data.amountWithoutGST) > 0 &&
                        <div className="col-lg-2">
                          <div className="form-group amountWithoutGST">
                            <label for="amountWithoutGST">Sell Price (Without GST)</label>
                            <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={data.amountWithoutGST} />
                          </div>
                        </div>
                      }
                      <div className="col-lg-2">
                        {renderInput({
                          name: "sellPrice",
                          label: "Sell Price (" + portalCurrency + ")",
                          type: "text",
                          disable: data.isSellPriceReadonly,
                          onBlurCB: handleAmountFields
                        })}
                      </div>
                      {data.totalAmount > 0 && Number(data.totalAmount) > Number(data.sellPrice) &&
                        <div className="col-lg-3">
                          {renderInput({
                            name: "totalAmount",
                            label: "Total Amount (" + portalCurrency + ")",
                            type: "text",
                            disable: true,
                            onBlurCB: handleAmountFields
                          })}
                        </div>}
                      <div className="col-lg-1 col-md-1 col-sm-3">
                        {renderInput({
                          name: "Adults",
                          label: "Adult(s)",
                          type: "text",
                        })}
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-3">
                        {renderInput({
                          name: "Child",
                          label: "Children",
                          type: "text",
                        })}
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-3">
                        {renderInput({
                          name: "Infants",
                          label: "Infant(s)",
                          type: "text",
                        })}
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-12">
                        {renderSelect({
                          name: "supplierCurrency",
                          label: "Supplier Currency",
                          options: currencyList,
                        })}
                      </div>
                      {/* <div className="col-lg-3">
                      <label>&nbsp;</label>
                      <button
                        class="btn btn-link p-0 m-0 text-primary"
                        onClick={handleShowHideTax}
                      >
                        {state.isShowExtraFields ? "Hide" : "Show"} More
                      </button>
                    </div> */}
                    </div>

                    {state.isShowExtraFields && (
                      <div className="row">
                        <div className="col-lg-3 col-md-9 col-sm-12">
                          {renderInput({
                            name: "conversionRate",
                            label: "Conversion Rate",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-3 col-md-9 col-sm-12">
                          {renderInput({
                            name: "supplierCostPriceAdult",
                            label: "Adult(s) Supplier Cost Price",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-3 col-md-9 col-sm-12">
                          {renderInput({
                            name: "supplierCostPriceChild",
                            label: "Children Supplier Cost Price",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-3 col-md-9 col-sm-12">
                          {renderInput({
                            name: "supplierCostPriceInfant",
                            label: "Infant(s) Supplier Cost Price",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "supplierTaxPrice",
                            label: "Supplier Tax",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "costPrice",
                            label: "Agent Cost Price (" + portalCurrency + ")",
                            type: "text",
                            disable: true,
                          })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "markupPrice",
                            label: "Agent Markup",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "discountPrice",
                            label: "Discount",
                            type: "text",
                            disable: false,
                            onBlurCB: handleAmountFields,
                          })}
                        </div>
                        <TaxQuotationAddOffline
                          business={'package'}
                          handleTaxQuoationoData={handleTaxQuoationoData}
                          data={data}
                          errors={errors}
                          isMarketplaceMode={isMarketplaceMode}
                        />


                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderInput({
                            name: "brn",
                            label: "Confirmation Number",
                            type: "text",
                            disable: false,
                            onBlurCB: validateBRN,
                          })}
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-12">
                          {renderCurrentDateWithDuration({
                            name: "bookBefore",
                            label: "Book Before (Supplier)",
                            startdate:
                              moment(data.validFrom).diff(
                                moment(data.bookBefore),
                                "days"
                              ) > 0
                                ? moment(data.validFrom).format(Global.DateFormate)
                                : moment().add(1, "m").format(Global.DateFormate),
                          })}
                        </div>
                        {/* <div className="col-lg-3 col-md-6 col-sm-12">
                          {renderInput(
                            "vendor",
                            "Vendor/Supplier",
                            "text",
                            false,
                          )}
                        </div> */}
                      </div>
                    )}
                  </div>
                }
                <div className="row mt-3">
                  {errors["SaveError"] && (
                    <div className="col-lg-12">
                      <small className="alert alert-danger mt-2 p-1 d-inline-block">
                        {errors["SaveError"]}
                      </small>
                    </div>
                  )}

                  {!disabled && (
                    <AuthorizeComponent
                      title={isMasterPackage ? "dashboard-menu~master-packages-create-package" : "dashboard-menu~packages-create-package"}
                      type="button"
                      rolepermissions={userInfo.rolePermissions}
                    >
                      <div className="col-lg-2 mt-2">
                        <div className="form-group">
                          <button
                            onClick={
                              !isLoading ? () => savePackageClick(false) : ""
                            }
                            className="btn btn-primary w-100 text-capitalize"
                            id="create_package"
                          >
                            {isLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            {mode != "edit" ? "Create" : "Update"} {props.isFromContentManager ? props.dealsType === 1 ? 'Hot Deal' : `Package` : `Package`}
                          </button>
                        </div>
                      </div>
                    </AuthorizeComponent>
                  )}
                  {!disabled && (
                    <div className="col-lg-2 mt-2">
                      <div className="form-group">
                        <button
                          onClick={() => props.isFromContentManager ? handleShowHideForm(0) : props.history.push(isMarketplaceMode ? `/packagemarketplacelist` : isQuickPackage ? `/QuickPackageList` : isMasterPackage ? `/masterpackagelist` : `/PackageList`)}
                          className="btn btn-primary w-100 text-capitalize"
                        >
                          {" "}
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {mode === "edit" && !isMasterPackage && !isMarketplaceMode && !props.isFromContentManager && (
                    <>
                      <AuthorizeComponent
                        title="dashboard-menu~packages-book-package"
                        type="button"
                        rolepermissions={userInfo.rolePermissions}
                      >
                        <div className="col-lg-2 mt-2">
                          <div className="form-group">
                            <button
                              onClick={() => {
                                !GlobalEvents.handleCheckforFreeExcess(
                                  props,
                                  "dashboard-menu~packages-book-package",
                                  1
                                )
                                  ? setState((prevState) => {
                                    return {
                                      ...prevState,
                                      isSubscriptionPlanend: true,
                                    };
                                  })
                                  : setState((prevState) => {
                                    return {
                                      ...prevState,
                                      isBookPackagePopup: true,
                                    };
                                  });
                              }}
                              className="btn btn-primary w-100 text-capitalize"
                            >
                              Generate Invoice
                            </button>
                          </div>
                        </div>
                      </AuthorizeComponent>
                      <AuthorizeComponent
                        title={isMasterPackage ? " PackageDetails~master-packages-view-package" : "PackageDetails~package-view-package"}
                        type="button"
                        rolepermissions={userInfo.rolePermissions}
                      >
                        <div className="col-lg-2 mt-2">
                          <div className="form-group">
                            <button
                              className="btn btn-primary w-100 text-capitalize"
                              //onClick={() => this.ViewInquiry(item)}
                              onClick={() => window.open(`/Packageview/${btoa(props.match.params.id)}`, "_blank")}
                            >
                              Preview Package
                            </button>
                          </div>
                        </div>
                      </AuthorizeComponent>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {
        isBookPackagePopup && (
          <ModelPopup
            sizeClass={"modal-lg"}
            header={"Generate Invoice"}
            content={
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="row">
                      <div className="col-lg-6">
                        {renderSingleDate({
                          name: "bookingStartDate",
                          label: "Start Date",
                          startdate: moment().format(Global.DateFormate),
                          mindate: moment(data.validFrom).format(Global.DateFormate),
                          maxDate: moment(data.validTo).format(Global.DateFormate),
                          onChange: handleOnBookingDateChange,
                          disabled: false,
                        })}
                      </div>
                      <div className="col-lg-6">
                        {renderSingleDate({
                          name: "bookingEndDate",
                          label: "End Date",
                          startdate: moment(data.bookingEndDate).diff(moment(data.bookingEndDate),
                            "days") > 0
                            ? moment(data.bookingStartDate).format(Global.DateFormate)
                            : moment().add(1, "m").format(Global.DateFormate),
                          mindate: moment(data.bookingStartDate).format(Global.DateFormate),
                          disabled: false,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 d-none">
                    <label htmlFor={"bookNoOfPax"}>No of traveller(s)</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className={
                          "form-control " +
                          (isBookPackageErrorPax ? "border-danger" : "")
                        }
                        value={bookNoOfPax}
                        onChange={(e) => {
                          handlebookNoOfPax(e);
                        }}
                      />
                    </div>
                  </div>
                  {/* {Number(data.price) > 0 && (
                    <div className="col-lg-3">
                      <label htmlFor={"SellPrice"}>
                        {"Sell Price  (" + portalCurrency + ")"}
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={
                            bookNoOfPax > 0
                              ? data.price * bookNoOfPax
                              : data.price
                          }
                          disabled
                        />
                      </div>
                    </div>
                  )} */}
                  <div className="col-lg-5">
                    <label htmlFor={"bookNoOfPax"}>&nbsp;</label>
                    <button
                      onClick={validateBookPackage}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      {isBookPackageLoading && (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      Generate Invoice
                    </button>
                  </div>
                </div>
                {(isBookPackageError || isBookPackageErrorPax) && (
                  <div className="row mt-2">
                    <div className="col-lg 5">
                      <span className="text-danger">
                        {isBookPackageError || isBookPackageErrorPax}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
            handleHide={handleBookPackagePopup}
          />
        )
      }
      {
        state.isSubscriptionPlanend && (
          <ModelLimitExceeded
            header={"Plan Limitations Exceeded"}
            content={"The maximum recommended plan has been exceeded"}
            handleHide={hidelimitpopup}
            history={props.history}
          />
        )
      }
      {
        state.showPopup ? (
          <ModelPopup
            header={state.popupTitle}
            content={state.popupContent}
            sizeClass={state.sizeClass}
            handleHide={handlePopup}
          />
        ) : null
      }
      {
        isAssistant &&
        <AssistantModelPopup
          content={
            <PackageAIAssitant
              handleHide={handleAssistant}
              promptMode={"Pacakage " + activeTab}
            />}
          sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
          handleHide={handleAssistant}
        />
        /* <AssistantModelPopup
          header={<PackageAssistantHeader handleHide={handleAssistant} />}
          content={<PackageAssistant
            inputData={assistantInput}
            responseData={assistantResponse}
            getResponseData={getResponseData}
            closeAssitant={closeAssitant}
          />}
          footer={<PackageAssistantFooter
            handleFetchInputData={handleFetchInputData}
            handleFetchData={handleFetchData}
          />}
          sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
          handleHide={handleAssistant}
        /> */
      }
      {
        isShowAuthorizePopup &&
        <ModelPopupAuthorize
          header={""}
          content={""}
          handleHide={hideauthorizepopup}
          history={props.history}
        />
      }
    </div>
  );

};
export default PackageForm;


const PackageCategory = [
  { value: "3", name: "Holiday" },
  { value: "1", name: "Hotel" },
  { value: "2", name: "Flight" },
  { value: "5", name: "Activity" },
  { value: "11", name: "Transfers" },
  { value: "12", name: "Other" },
];
const status = [
  { value: "CREATED", name: "Draft" },
  { value: "REQUESTFORPUBLISH", name: "Request For Publish" },
  { value: "PUBLISHED", name: "Published" },
  { value: "REJECTED", name: "Rejected" },
];
const starRating = [
  { name: "Select", value: "" },
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
];
const adultCount = [
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
  { name: "6", value: "6" },
  { name: "7", value: "7" },
  { name: "8", value: "8" },
  { name: "9", value: "9" },
  { name: "10", value: "10" },
];
const statusList = [
  { name: "New", value: "New" },
  { name: "Assigned", value: "Assigned" },
  { name: "Follow Up", value: "Follow Up" },
  { name: "Query", value: "Query" },
  { name: "Lost", value: "Lost" },
  { name: "Closed", value: "Closed" },
  { name: "Completed", value: "Completed" },
];
const childinfantCount = [
  { name: "0", value: "0" },
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
  { name: "6", value: "6" },
  { name: "7", value: "7" },
  { name: "8", value: "8" },
  { name: "9", value: "9" },
  { name: "10", value: "10" },
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
    key: 12, types: [
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
    key: 13, types: [
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
let tripTypeList = [
  { name: "Select Trip Type", value: "" },
  { name: "Domestic", value: "Domestic" },
  { name: "International", value: "International" },
  { name: "Both", value: "Both" },
];