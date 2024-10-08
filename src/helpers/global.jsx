import { apiRequester } from "../services/requester";
export const Language =
  localStorage.getItem("lang") === null ? "en-US" : localStorage.getItem("lang").length === 2 ? "en-US" : localStorage.getItem("lang");
export const DateFormate = "YYYY-MM-DD";
export const InnerDateFormate = "MM/DD/YYYY";
export const DisplayDateFormateWidgets = "DD MMM YYYY";
export const specialCharData = {
  "\\": "backshlashTag",
  "#": "hashTag"
};
export const isSameDayAllow = true;
export const pipeTag = "~pipeTag~";

export const getEnvironmetKeyValue = (key, params) => {
  let returnValue = null;

  if (localStorage.getItem("environment") === null) return returnValue;
  let env = JSON.parse(localStorage.getItem("environment"));
  if (key === "portalCurrencySymbol") returnValue = env.portalCurrency.symbol;
  else if (key === "portalCurrencyCode") returnValue = env.portalCurrency.isoCode;
  else if (key === "PortalCountryCode") returnValue = env.portalCountry.code;
  else if (key === "PortalCountryName") returnValue = env.portalCountry.name;
  else if (key === "DisplayDateFormate")
    returnValue = env.dateFormat.toUpperCase();
  else if (key === "isUploadDocument") returnValue = env.isUploadDocument;
  else if (key === "customerCareEmail") returnValue = env.customerCareEmail;
  else if (key === "portalAddress") returnValue = env.portalAddress;
  else if (key === "portalLogo") returnValue = env.portalLogo;
  else if (key === "portalName") returnValue = env.portalName;
  else if (key === "portalPhone") returnValue = env.portalPhone;
  else if (key === "isCurrencyPrefix") returnValue = env.isCurrencyPrefix;
  else if (key === "isRoundOff") returnValue = env.isRoundOff;
  else if (key === "portalId") returnValue = env.portalID;
  else if (key === "disableContinueAsGuest") returnValue = env.disableContinueAsGuest;
  else if (key === "availableBusinesses") {
    returnValue = env.availableBusinesses
      ? Object.keys(env.availableBusinesses).map(function (i) {
        return env.availableBusinesses[i];
      })
      : null;
  } else if (params === "cobrand") {
    if (
      env.cobrandDetails.find(
        x => x.shortDesc.toLowerCase() === key.toLowerCase()
      )
    )
      returnValue = env.cobrandDetails.find(
        x => x.shortDesc.toLowerCase() === key.toLowerCase()
      ).value;
  } else if (key.indexOf("flightogram") > -1 || key.indexOf("demo-bookingv7") > -1) {
    returnValue = true;
  }
  else returnValue = env[key];

  // if (key === "isAirPaperRateEnabled")
  //   returnValue = "true";

  return returnValue;
};

export const toolbarFCK = {
  toolbar: {
    items: ['heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
      'link', 'bulletedList', 'numberedList', 'todoList', '|', 'insertTable', '|',
      'undo', 'redo']
  },
}

export const bookingStatus = {
  1: "Confirmed",
  2: "Cancel Request",
  3: "Amend Request",
  4: "Request in Process",
  5: "On Request",
  6: "Amend",
  7: "Cancelled",
  8: "Expired Request",
  9: "Denied Request",
  10: "Booked",
  11: "System Cancel",
  12: "Booked",
  13: "Auto Cancel"
};

export const getBookingStatus = key => {
  return bookingStatus[key];
};

export const getTransportationLookupData = (lookupName) => {
  let isLookupAvailable = true;
  if (lookupName === "route") {
    if (
      localStorage.getItem("transportation_route_" + localStorage.getItem("lang")) !== null
    ) {
      return JSON.parse(
        localStorage.getItem("transportation_route_" + localStorage.getItem("lang"))
      );
    }
    isLookupAvailable = false;
  } else if (lookupName === "companies") {
    if (
      localStorage.getItem("transportation_companies_" + localStorage.getItem("lang")) !== null
    ) {
      return JSON.parse(
        localStorage.getItem("transportation_companies_" + localStorage.getItem("lang"))
      );
    }
    isLookupAvailable = false;
  }
  if (
    !isLookupAvailable &&
    getEnvironmetKeyValue("availableBusinesses") &&
    getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === "transportation")
  ) {
    let reqURL = "api/v1/lookup";
    let lang = localStorage.getItem("lang");
    let availableLang = getEnvironmetKeyValue("availableLanguages");
    localStorage.setItem("transportation_route_" + localStorage.getItem("lang"), "[]");
    localStorage.setItem("transportation_categories_" + localStorage.getItem("lang"), "[]");
    localStorage.setItem("transportation_vehicletypes_" + localStorage.getItem("lang"), "[]");
    localStorage.setItem("transportation_companies_" + localStorage.getItem("lang"), "[]");

    apiRequester(
      reqURL,
      {
        info: {
          cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
        },
        request: "transportation:routes",
      },
      function (data) {
        if (data.status.code === 0) {
          localStorage.setItem(
            "transportation_route_" + localStorage.getItem("lang"),
            JSON.stringify(data.response)
          );

        } else localStorage.removeItem("transportation_route_" + localStorage.getItem("lang"));
      }.bind(this)
    );
    apiRequester(
      reqURL,
      {
        info: {
          cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
        },
        request: "transportation:categories",
      },
      function (data) {
        if (data.status.code === 0) {
          localStorage.setItem(
            "transportation_categories_" + localStorage.getItem("lang"),
            JSON.stringify(data.response)
          );
        } else
          localStorage.removeItem("transportation_categories_" + localStorage.getItem("lang"));
      }.bind(this)
    );
    apiRequester(
      reqURL,
      {
        info: {
          cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
        },
        request: "transportation:vehicletypes",
      },
      function (data) {
        if (data.status.code === 0) {
          localStorage.setItem(
            "transportation_vehicletypes_" + localStorage.getItem("lang"),
            JSON.stringify(data.response)
          );
        } else
          localStorage.removeItem("transportation_vehicletypes_" + localStorage.getItem("lang"));
      }.bind(this)
    );
    apiRequester(
      reqURL,
      {
        info: {
          cultureCode: availableLang.filter((x) => x.cultureName.startsWith(lang))[0].cultureName,
        },
        request: "transportation:companies",
      },
      function (data) {
        if (data.status.code === 0) {
          localStorage.setItem(
            "transportation_companies_" + localStorage.getItem("lang"),
            JSON.stringify(data.response)
          );
        } else
          localStorage.removeItem("transportation_companies_" + localStorage.getItem("lang"));
      }.bind(this)
    );
    return [];
  } else return [];
};
export const LimitationQuota = {
  "dashboard-menu~inquiries-create-inquiry": "inquiryQuota",
  "dashboard-menu~itineraries-create-itineraries": "itineraryQuota",
  "dashboard-menu~master-itineraries-create-itineraries": "itineraryQuota",
  "dashboard-menu~master-quotation-create-quotation": "quotationQuota",
  "dashboard-menu~quotation-create-quotation": "quotationQuota",
  "dashboard-menu~packages-create-package": "packageQuota",
  "Customer-list~customer-add-customers": "customerQuota",
  "EmployeeList~agentsettings-addemployee": "employeeQuota",
  "QuotationDetails~quotation-book-quotation": "bookingQuota",
  "ItineraryDetails~itineraries-book-itineraries": "bookingQuota",
  "dashboard-menu~packages-book-package": "bookingQuota"
};

export const itineraryConfigurations = {
  isShowTotalPrice: true,
  isShowItemizedPrice: true,
  isShowFlightPrices: true,
  isShowImage: true,
  isHidePrice: true,
  ShowhideElementname: "showAllPrices",
  isPackagePricing: false,
  isHideFareBreakupInvoice: false
}

export const getBusinessWiseGSTPercentage = (business, gstType) => {
  let returnValue = 0;
  business = business.toLowerCase();
  let key = '';
  switch (business.toLowerCase()) {
    case 'air':
      key = "DefaultGSTPercentageAir"
      break;
    case 'hotel':
      key = "DefaultGSTPercentageHotel"
      break;
    case 'activity':
    case 'package':
    case 'transfers':
    case 'custom':
      business = "activity";
      key = "DefaultGSTPercentageActivity"
      break;
    default:
      key = ""
  }
  var cobrandValue = getEnvironmetKeyValue(key, "cobrand")
  if (cobrandValue === null)
    return 0;
  if (gstType === "CGSTSGST" || gstType === "CGST" || gstType === "SGST") {
    returnValue = Number(cobrandValue.split(',')[0]);
  }
  else if (gstType === "IGST") {
    returnValue = Number(cobrandValue.split(',')[1]);
  }

  // if (business === "package" || business === "transfers" || business === "custom")
  //   business = "activity";

  let env = JSON.parse(localStorage.getItem("environment"));
  if (gstType === "IGST" && env.customTaxConfigurations.find(x => x.business.toLowerCase() === business)
    .taxes.find(x => x.name === "IGST" && x.isShowOnUI)
    .chargeType === "Percentage") {
    returnValue = Number(env
      .customTaxConfigurations.find(x => x.business.toLowerCase() === business)
      .taxes.find(x => x.name === "IGST" && x.isShowOnUI)
      .chargeValue);
  }
  if (gstType === "CGSTSGST" && env.customTaxConfigurations.find(x => x.business.toLowerCase() === business)
    .taxes.find(x => x.name === "CGST" && x.isShowOnUI)
    .chargeType === "Percentage") {
    returnValue = Number(env
      .customTaxConfigurations.find(x => x.business.toLowerCase() === business)
      .taxes.find(x => x.name === "CGST" && x.isShowOnUI)
      .chargeValue);
    returnValue += Number(env
      .customTaxConfigurations.find(x => x.business.toLowerCase() === business)
      .taxes.find(x => x.name === "SGST" && x.isShowOnUI)
      .chargeValue);
  }
  return returnValue;
}