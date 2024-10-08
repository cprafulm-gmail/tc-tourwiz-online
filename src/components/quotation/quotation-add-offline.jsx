import React, { Component } from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import AutoComplete from "../../components/search/auto-complete";
import DateRangePicker from "../common/date-range";
import moment from "moment";
import * as Global from "../../helpers/global";
import TimeField from 'react-simple-timefield';
import ModelPopup from "../../helpers/model";
import HotelPaxWidget from "../search/hotel-pax-widget";
import Imagelibrary from "./ImageLibrary";
import ImageNotFoundHotel from "../../assets/images/ImageNotFound-Hotel.gif";
import ImageNotFoundActivity from "../../assets/images/ImageNotFound-Activity.gif";
import ImageNotFoundPackage from "../../assets/images/ImageNotFound-Package.gif";
import ImageNotFoundTransfers from "../../assets/images/ImageNotFound-Transfers.gif";
import ImageNotFoundVehicle from "../../assets/images/ImageNotFound-Vehicle.gif";
import trashImage from "../../assets/images/x-circle.svg"
import TaxQuotationAddOffline from "./tax-quotation-add-offline";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import CreatableSelect from 'react-select/creatable';
import FlightStops from "./stop-quotation-add-offline";

class QuotationAddOffline extends Form {
  state = {
    popupContent: "",
    popupTitle: "",
    showPopup: false,
    data: {
      business: this.props.business,
      fromLocation: "",
      fromLocationName: "",
      fromLocationCity: "",
      toLocation: "",
      toLocationName: "",
      toLocationCity: "",
      DepartFlight: [],
      ReturnFlight: [],
      fromLocationFlight: [],
      toLocationFlight: [],
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
      departStops: [],
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
      returnStops: [],
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
          .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.cutOffDays, 'days')
          .format(Global.DateFormate),
        checkOutDate: moment()
          .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.cutOffDays
            + Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.stayInDays, 'days')
          .format(Global.DateFormate)
      },
      datesIsValid: "valid",
      cutOffDays: Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.cutOffDays,
      stayInDays: Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.stayInDays,
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
      type: this.props.type,
      ImageName: 'Select Image',
      ImageUrl: '',
      ImgExtension: '',
      isTax1Modified: false,
      isTax2Modified: false,
      isTax3Modified: false,
      isTax4Modified: false,
      isTax5Modified: false,
    },
    errors: {},
    staticBRN: "",
    suppliers: [],
    isSupplierlistLoading: false
  };

  handleHotelPax = (hotelPaxInfo) => {
    let data = this.state.data;
    data.hotelPaxInfo = hotelPaxInfo;
    this.setState({ data });
  }
  getSupplier = (business) => {
    this.setState({ isSupplierlistLoading: true });

    let businessID = Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business).id;
    if (this.props.business.toLowerCase() === 'transfers' || this.props.business.toLowerCase() === 'package' || this.props.business.toLowerCase() === 'custom')
      businessID = Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business).aliasId;
    let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID;
    apiRequester_unified_api(
      reqURL,
      {},
      function (data) {
        //data.response;
        this.setState({ suppliers: data.response, isSupplierlistLoading: false });
      }.bind(this),
      "GET"
    );
  }

  setFromLocation = (fromLocation) => {
    let fromlocation = {
      "id": fromLocation?.id,
      "name": fromLocation?.name,
      "address": fromLocation?.address,
    }
    if (fromLocation === undefined || fromLocation === "") {
      fromLocation = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          fromLocationFlight: fromlocation,
          fromLocation: fromlocation?.address === undefined ? fromLocation : fromlocation.address,
        }
      }));
    }
    if (fromLocation || localStorage.getItem("isUmrahPortal")) {
      this.setState(preState => ({
        data: {
          ...preState.data,
          fromLocationFlight: fromlocation,
          fromLocation: fromlocation?.address === undefined ? fromLocation : fromlocation.address,
        }
      }));
    }
  };
  setToLocation = (toLocation) => {
    let tolocation = {
      "id": toLocation?.id,
      "name": toLocation?.name,
      "address": toLocation?.address,
    }
    if (toLocation === undefined || toLocation === "") {
      toLocation = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          toLocationFlight: tolocation,
          toLocation: tolocation?.address === undefined ? toLocation : tolocation.address,
        }
      }));
    }
    if (toLocation)
      this.setState(preState => ({
        data: {
          ...preState.data,
          toLocationFlight: tolocation,
          toLocation: tolocation?.address === undefined ? toLocation : tolocation.address,
        }
      }));
  };
  handleDepartFlight = (data) => {
    let departFlight = {
      "id": data?.id,
      "name": data?.name,
      "address": data?.provider,
    }
    if (data === undefined || data === "") {
      data = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          departAirlineName: departFlight?.address === undefined ? data : departFlight.address,
          DepartFlight: departFlight,
        }
      }));
    }
    if (data) {
      this.setState(preState => ({
        data: {
          ...preState.data,
          departAirlineName: departFlight?.address === undefined ? data : departFlight.address,
          DepartFlight: departFlight,
        }
      }));
    }
  };

  handleReturnFlight = (data) => {
    let returnFlight = {
      "id": data?.id,
      "name": data?.name,
      "address": data?.provider,
    }
    if (data) {
      this.setState(preState => ({
        data: {
          ...preState.data,
          returnAirlineName: returnFlight?.address === undefined ? data : returnFlight.address,
          ReturnFlight: returnFlight,
        }
      }));
    }
    if (data === undefined || data === "") {
      data = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          returnAirlineName: returnFlight?.address === undefined ? data : returnFlight.address,
          ReturnFlight: returnFlight,
        }
      }));
    }
  };
  validate = () => {
    //const errors = {};
    const { errors, data } = this.state;
    if (this.props.business === "hotel" || this.props.business === "activity") {
      // if (!this.validateFormData(data.toLocation, "require"))
      //   errors.toLocation = "Location required";
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/))
        errors.toLocation = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["toLocation"];
      }
      // if (!this.validateFormData(data.name, "require")) errors.name = "Name required";
      if (data.name && !this.validateFormData(data.name, "special-characters-not-allowed", /[<>]/))
        errors.name = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["name"];
      }
      if (this.props.business === "hotel" && data.nights && !this.validateFormData(data.nights, "only-numeric"))
        errors.nights = "Please enter no of nights in numeric only";
      else if (errors) {
        delete Object.assign(errors)["nights"];
      }
      if (data.rating && !this.validateFormData(data.rating, "numeric"))
        errors.rating = "Please enter star rating in decimal only";
      else if (errors) {
        delete Object.assign(errors)["rating"];
      }
      //if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
    }

    if (this.props.business === "hotel") {
      //if (!this.validateFormData(data.endDate, "require")) errors.endDate = "Check Out required";
      //if (!this.validateFormData(data.itemType, "require")) errors.itemType = "Room Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["itemType"];
      }
      //if (!this.validateFormData(data.noRooms, "require")) errors.noRooms = "No of Rooms required";
      if (data.noRooms && !this.validateFormData(data.noRooms, "only-numeric")) errors.noRooms = "Please enter no of rooms in numeric only";
      else if (errors) {
        delete Object.assign(errors)["noRooms"];
      }
      if (data.hotelContactNumber && data.hotelContactNumber.split('-').length > 2) errors.hotelContactNumber = "Please enter valid Hotel Contact Number";
      else if (data.hotelContactNumber && !data.hotelContactNumber.endsWith('-') && !this.validateFormData(data.hotelContactNumber, "phonenumber")) errors.hotelContactNumber = "Please enter valid Hotel Contact Number";
      else if (data.hotelContactNumber && !data.hotelContactNumber.endsWith('-') &&
        !this.validateFormData(data.hotelContactNumber, "phonenumber_length", { min: 8, max: 14 })
      ) {
        errors.hotelContactNumber = Trans("_error_phoneNumber_phonenumber_length");
      } else {
        delete Object.assign(errors)["hotelContactNumber"];
      }
    }

    if (this.props.business === "activity") {
      //if (!this.validateFormData(data.duration, "require")) errors.duration = "Duration required";
      //if (!this.validateFormData(data.guests, "require")) errors.guests = "Guests required";
      if (data.duration && !this.validateFormData(data.duration, "special-characters-not-allowed", /[<>]/))
        errors.duration = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["duration"];
      }
      if (data.guests && !this.validateFormData(data.guests, "only-numeric")) errors.guests = "Please enter no of guests in numeric only";
      else if (errors) {
        delete Object.assign(errors)["guests"];
      }
      //if (!this.validateFormData(data.itemType, "require"))
      //  errors.itemType = "Activity Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["itemType"];
      }
    }
    if (this.props.business === "transfers") {
      // if (!this.validateFormData(data.fromLocation, "require"))
      //   errors.fromLocation = "Pickup Location required";
      if (data.fromLocation && !this.validateFormData(data.fromLocation, "special-characters-not-allowed", /[<>]/))
        errors.fromLocation = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["fromLocation"];
      }
      // if (!this.validateFormData(data.pickupType, "require")) errors.pickupType = "Type required";
      // if (!this.validateFormData(data.toLocation, "require"))
      //   errors.toLocation = "Dropoff Location required";
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/))
        errors.toLocation = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["toLocation"];
      }
      if (data.pickupTime && !this.validateFormData(data.pickupTime, "special-characters-not-allowed", /[<>]/))
        errors.pickupTime = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["pickupTime"];
      }
      // if (!this.validateFormData(data.dropoffType, "require")) errors.dropoffType = "Type required";
      // if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
      // if (!this.validateFormData(data.duration, "require")) errors.duration = "Start Time required";
      // if (!this.validateFormData(data.guests, "require")) errors.guests = "Guests required";
      if (data.guests && !this.validateFormData(data.guests, "only-numeric")) errors.guests = "Please enter no of guests in numeric only";
      else if (errors) {
        delete Object.assign(errors)["guests"];
      }
      // if (!this.validateFormData(data.itemType, "require"))
      //   if (!this.validateFormData(data.itemType, "require"))
      //     errors.itemType = "Transfers Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["itemType"];
      }
    }

    if (this.props.business === "air") {
      if (data.fromLocation && !this.validateFormData(data.fromLocation, "special-characters-not-allowed", /[<>]/)) errors.fromLocation = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["fromLocation"];
      }
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/)) errors.toLocation = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["toLocation"];
      }
      if (data.departAirlineName && !this.validateFormData(data.departAirlineName, "special-characters-not-allowed", /[<>]/)) errors.departAirlineName = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["departAirlineName"];
      }
      if (data.returnAirlineName && !this.validateFormData(data.returnAirlineName, "special-characters-not-allowed", /[<>]/)) errors.returnAirlineName = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["returnAirlineName"];
      }
    }

    if (!this.validateFormData(data.costPrice, "require")) errors.costPrice = "Cost Price required";
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (!this.validateFormData(data.sellPrice, "require")) errors.sellPrice = "Sell Price required";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }

    if (data.sellPrice && !this.validateFormData(data.sellPrice, "numeric")) errors.sellPrice = "Please enter sell price in decimal only";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }

    if (data.conversionRate && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in decimal only";
    else if (errors) {
      delete Object.assign(errors)["conversionRate"];
    }
    if (data.supplierCostPrice && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.markupPrice && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup in decimal only";
    else if (errors) {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.discountPrice && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount in decimal only";
    else if (errors) {
      delete Object.assign(errors)["discountPrice"];
    }
    if (data.processingFees && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter Processing Fees in decimal only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.percentage && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter Percentage in decimal only";
    else if (errors) {
      delete Object.assign(errors)["percentage"];
    }
    if (data.CGSTPrice && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.tax1 && !this.validateFormData(data.tax1, "numeric")) errors.tax1 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax1"];
    }
    if (data.tax2 && !this.validateFormData(data.tax2, "numeric")) errors.tax2 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax2"];
    }
    if (data.tax3 && !this.validateFormData(data.tax3, "numeric")) errors.tax3 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax3"];
    }
    if (data.tax4 && !this.validateFormData(data.tax4, "numeric")) errors.tax4 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax4"];
    }
    if (data.tax5 && !this.validateFormData(data.tax5, "numeric")) errors.tax5 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax5"];
    }
    if (data.vendor && !this.validateFormData(data.vendor, "special-characters-not-allowed", /[<>_]/)) errors.vendor = "< , > , _ characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["vendor"];
    }
    if (data.brn && !this.validateFormData(data.brn, "special-characters-not-allowed", /[`$&'<>"\[\]/.?]/)) errors.brn = "<,>,$,&,\",[,],/,.,? and ' characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["brn"];
    }
    if (data.description && !this.validateFormData(data.description, "special-characters-not-allowed", /[<>]/)) errors.description = "< and > characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["description"];
    }
    if (isNaN(Number(data.costPrice)) || Number(data.costPrice) <= 0) {
      errors.costPrice = "Cost Price should not be less than or equal to 0";
    }
    if (isNaN(Number(data.sellPrice)) || Number(data.sellPrice) <= 0) {
      errors.sellPrice = "Sell Price should not be less than or equal to 0";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };


  handleAddItem = (Editmode, isVendorvalidate) => {
    let { data, errors } = this.state;

    errors = this.validate();
    if (errors === null)
      errors = {};
    if (data.isSellPriceReadonly && (isNaN(Number(data.costPrice)) || !isNaN(Number(data.costPrice)) && Number(data.costPrice) === 0)) {
      errors.costPrice = "Cost Price should not be 0";
    }
    else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0) {
      errors.costPrice = "Cost Price should not be less than 0";
    }
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (!isNaN(Number(data.sellPrice)) && Number(data.sellPrice) < 0) {
      errors.sellPrice = "Sell Price should not be less than 0";
    }
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }

    if (data.sellPrice && data.sellPrice !== "" && !this.validateFormData(data.sellPrice, "numeric")) errors.sellPrice = "Please enter sell price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }
    if (data.conversionRate && data.conversionRate !== "" && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in numeric only";
    else if (errors) {
      delete Object.assign(errors)["conversionRate"];
    }
    if (data.supplierCostPrice && data.supplierCostPrice !== "" && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && data.supplierTaxPrice !== "" && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.costPrice && data.costPrice !== "" && !this.validateFormData(data.costPrice, "numeric")) errors.costPrice = "Please enter agent cost price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (data.markupPrice && data.markupPrice !== "" && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.discountPrice && data.discountPrice !== "" && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["discountPrice"];
    }
    if (data.processingFees && data.processingFees !== "" && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter Processing Fees price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.percentage && data.percentage !== "" && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter Percentage in numeric only";
    else if (errors) {
      delete Object.assign(errors)["percentage"];
    }
    if (data.CGSTPrice && data.CGSTPrice !== "" && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && data.SGSTPrice !== "" && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && data.IGSTPrice !== "" && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.tax1 && data.tax1 !== "" && !this.validateFormData(data.tax1, "numeric")) errors.tax1 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax1"];
    }
    if (data.tax2 && data.tax2 !== "" && !this.validateFormData(data.tax2, "numeric")) errors.tax2 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax2"];
    }
    if (data.tax3 && data.tax3 !== "" && !this.validateFormData(data.tax3, "numeric")) errors.tax3 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax3"];
    }
    if (data.tax4 && data.tax4 !== "" && !this.validateFormData(data.tax4, "numeric")) errors.tax4 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax4"];
    }
    if (data.tax5 && data.tax5 !== "" && !this.validateFormData(data.tax5, "numeric")) errors.tax5 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax5"];
    }


    if (this.props.business === "air") {
      if (data.adult && data.adult !== "" && !this.validateFormData(data.adult, "only-numeric")) errors.adult = "Please enter adult(s) in numeric only";
      else if (data.adult && data.adult !== "" && Number(data.adult) < 0) errors.adult = "Adult(s) must be greater than zero";
      else if (errors) {
        delete Object.assign(errors)["adult"];
      }
      if (data.child && data.child !== "" && !this.validateFormData(data.child, "only-numeric")) errors.child = "Please enter child(s) in numeric only";
      else if (data.child && data.child !== "" && Number(data.child) < 0) errors.child = "Child(s) must be greater than zero";
      else if (errors) {
        delete Object.assign(errors)["child"];
      }
      if (data.infant && data.infant !== "" && !this.validateFormData(data.infant, "only-numeric")) errors.infant = "Please enter infant(s) in numeric only";
      else if (data.infant && data.infant !== "" && Number(data.infant) < 0) errors.infant = "Infant(s) must be greater than zero";
      else if (errors) {
        delete Object.assign(errors)["infant"];
      }
      // if (data.departStops && data.departStops !== "" && !this.validateFormData(data.departStops, "only-numeric")) errors.departStops = "Please enter Departure stops in numeric only";
      // else if (errors) {
      //   delete Object.assign(errors)["departStops"];
      // }
      // if (data.returnStops && data.returnStops !== "" && !this.validateFormData(data.returnStops, "only-numeric")) errors.returnStops = "Please enter Return stops in numeric only";
      // else if (errors) {
      //   delete Object.assign(errors)["returnStops"];
      // }

      if (data.departDurationH && data.departDurationH !== "" && !this.validateFormData(data.departDurationH, "only-numeric")) errors.departDurationH = "Please enter Departure Duration Hour in numeric only";
      else if (errors) {
        delete Object.assign(errors)["departDurationH"];
      }
      if (data.departDurationM && data.departDurationM !== "" && !this.validateFormData(data.departDurationM, "only-numeric")) errors.departDurationM = "Please enter Departure Duration Minute in numeric only";
      else if (errors) {
        delete Object.assign(errors)["departDurationM"];
      }

      if (data.returnDurationH && data.returnDurationH !== "" && !this.validateFormData(data.returnDurationH, "only-numeric")) errors.returnDurationH = "Please enter Return Duration Hour in numeric only";
      else if (errors) {
        delete Object.assign(errors)["returnDurationH"];
      }

      if (data.returnDurationM && data.returnDurationM !== "" && !this.validateFormData(data.returnDurationM, "only-numeric")) errors.returnDurationM = "Please enter Return Duration Minute in numeric only";
      else if (errors) {
        delete Object.assign(errors)["returnDurationM"];
      }

      if (data.departFlightNumber && data.departFlightNumber !== "" && !this.validateFormData(data.departFlightNumber, "special-characters-not-allowed", /[<>]/)) errors.departFlightNumber = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["departFlightNumber"];
      }

      if (data.returnFlightNumber && data.returnFlightNumber !== "" && !this.validateFormData(data.returnFlightNumber, "special-characters-not-allowed", /[<>]/)) errors.returnFlightNumber = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["returnFlightNumber"];
      }

      if (data.departClass && data.departClass !== "" && !this.validateFormData(data.departClass, "special-characters-not-allowed", /[<>]/)) errors.departClass = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["departClass"];
      }

      if (data.returnClass && data.returnClass !== "" && !this.validateFormData(data.returnClass, "special-characters-not-allowed", /[<>]/)) errors.returnFlightNumber = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["returnClass"];
      }
    }

    if (data.otherType && data.otherType !== "" && !this.validateFormData(data.otherType, "special-characters-not-allowed", /[<>]/)) errors.otherType = "< and > characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["otherType"];
    }


    if (data.guests && data.guests !== "" && !this.validateFormData(data.guests, "only-numeric")) errors.guests = "Please enter No of Guest(s) in numeric only";
    else if (errors) {
      delete Object.assign(errors)["guests"];
    }

    if (errors && Object.keys(errors).length > 0) {
      this.setState({
        errors,
        showPopup: false,
        popupContent: "",
        popupTitle: ""
      });
      return;
    }
    if (!errors)
      errors = [];
    this.setState({
      errors,
      showPopup: false,
      popupContent: "",
      popupTitle: ""
    });

    if (!isVendorvalidate && !data.vendor) {
      this.handlePopup();
      return;
    }

    if (!Editmode)
      data.uuid = this.generateUUID();
    if (!Editmode) {
      let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
      if (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") {
        if (data.day === "All Days") {
          data.startDate = moment(data.startDate)
            .format("MM/DD/YYYY");
          data.endDate = moment(data.endDate).format("MM/DD/YYYY");
        }
        else {
          data.startDate = moment(quotationInfo.startDate).add(parseInt(data.day) - 1, "days").format('YYYY-MM-DD');
          data.endDate = moment(data.startDate).add(parseInt(data.nights), "days").format('YYYY-MM-DD');
        }
        if (moment(data.departStartDate).format("MM/DD/YYYY") === moment().format("MM/DD/YYYY")) {
          data.departStartDate = moment(data.startDate)
            .add(data.dayDepart - 1, "days")
            .format("MM/DD/YYYY");
          data.departEndDate = moment(data.startDate)
            .add((data.dayDepart !== 1 && data.dayDepartEnd === 1) ? data.dayDepart - 1 : data.dayDepartEnd - 1, "days")
            .format("MM/DD/YYYY");

          data.returnStartDate = moment(data.startDate)
            .add(data.dayReturn - 1, "days")
            .format("MM/DD/YYYY");
          data.returnEndDate = moment(data.startDate)
            .add((data.dayReturn !== 1 && data.dayReturnEnd === 1) ? data.dayReturn - 1 : data.dayReturnEnd - 1, "days")
            .format("MM/DD/YYYY");
        } else {
          data.departStartDate = moment(data.startDate)
            .add(data.dayDepart - 1, "days")
            .format("MM/DD/YYYY");
          data.departEndDate = moment(data.startDate)
            .add((data.dayDepart !== 1 && data.dayDepartEnd === 1) ? data.dayDepart - 1 : data.dayDepartEnd - 1, "days")
            .format("MM/DD/YYYY");

          data.returnStartDate = moment(data.startDate)
            .add(data.dayReturn - 1, "days")
            .format("MM/DD/YYYY");
          data.returnEndDate = moment(data.startDate)
            .add((data.dayReturn !== 1 && data.dayReturnEnd === 1) ? data.dayReturn - 1 : data.dayReturnEnd - 1, "days")
            .format("MM/DD/YYYY");
        }

      }
    }

    if (this.props.business === "custom") {
      if (data.customitemType.toLowerCase() === "other" && data.otherType !== "") {
        data.itemType = data.otherType;
      }
      else
        data.itemType = data.customitemType;
    }

    if (this.props.business === "air") {
      if (data.departDurationH !== "" && data.departDurationM !== "") {
        data.departDuration = data.departDurationH + "h " + data.departDurationM + "m";
      }
      else {
        data.departDuration = "0h 0m";
      }

      data.totaldepartDuration =
        (data.departDurationH !== "" ? parseInt(data.departDurationH) : 0) * 60 +
        (data.departDurationM !== "" ? parseInt(data.departDurationM) : 0);

      if (data.returnDurationH && data.returnDurationM) {
        data.returnDuration = data.returnDurationH + "h " + data.returnDurationM + "m";
        data.totalreturnDuration = (data.returnDuration !== "" ? parseInt(data.returnDurationH) : 0) * 60 + (data.returnDuration !== "" ? parseInt(data.returnDurationM) : 0);
      }
      else {
        data.returnDuration = "0h 0m";
        data.totalreturnDuration = (data.returnDuration !== "" ? parseInt(data.returnDurationH) : 0) * 60 + (data.returnDuration !== "" ? parseInt(data.returnDurationM) : 0);
      }
      if (data.adult === "0" || data.adult === "") {
        data.adult = "1";
      }
    }

    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    if (Editmode && this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") {
      if (data.day === "All Days") {
        if (quotationInfo.startDate) {
          data.startDate = moment(quotationInfo.startDate).format('YYYY-MM-DD');
        }
        if (quotationInfo.endDate) {
          data.endDate = moment(quotationInfo.endDate).format('YYYY-MM-DD');
        }
      }
      else {
        if (quotationInfo.startDate) {
          data.startDate = moment(quotationInfo.startDate).add(parseInt(data.day) - 1, "days").format('YYYY-MM-DD');
        }
        if (quotationInfo.endDate) {
          data.endDate = moment(data.startDate).add(parseInt(data.nights), "days").format('YYYY-MM-DD');
        }
      }

      if (quotationInfo.startDate) {
        data.departStartDate = moment(quotationInfo.startDate).add(parseInt(data.dayDepart) - 1, "days").format('YYYY-MM-DD');
      }
      if (quotationInfo.endDate) {
        data.departEndDate = moment(quotationInfo.startDate).add(parseInt(data.dayDepartEnd) - 1, "days").format('YYYY-MM-DD');
      }

      if (quotationInfo.startDate) {
        data.returnStartDate = moment(quotationInfo.endDate).format('YYYY-MM-DD');
      }

      if (quotationInfo.endDate) {
        data.returnEndDate = moment(quotationInfo.startDate).add((parseInt(data.dayReturn) !== 1 && parseInt(data.dayReturnEnd) === 1) ? parseInt(data.dayReturn - 1) : parseInt(data.dayReturnEnd) - 1, "days").format('YYYY-MM-DD');
      }
    }
    if (this.props.type !== "Itinerary" && this.props.type !== "Itinerary_Master") {
      let day;
      data.startDate === undefined
        ? day = moment(data.endDate).diff(moment(data.departStartDate), "days")
        : day = moment(data.endDate).diff(moment(data.startDate), "days");
      data.nights = day;
    }
    if (isNaN(parseFloat(data.costPrice)) || parseFloat(data.costPrice) === 0) data.costPrice = 0;
    if (isNaN(parseFloat(data.sellPrice)) || parseFloat(data.sellPrice) === 0) data.sellPrice = 0;
    this.props.handleOffline(data);
    if (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") {
      this.setDates();
    }
  };

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    this.setState({ data: newData });
  };

  handleStartDate = (startDate) => {
    if (moment(startDate).diff(moment(this.state.data.dates.checkInDate), "days") === 0)
      return;
    let availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    let endDate = moment(startDate).add(availableBusinesses.find((x) => x.name === this.props.business)?.stayInDays ?? 0, "days").format(Global.DateFormate)
    this.setDate(startDate, endDate);
  }
  handleEndDate = (startDate, endDate) => {
    this.setDate(this.state.data.dates.checkInDate, startDate);
  }

  changeairTripType = () => {
    let newData = { ...this.state.data };
    newData.isRoundTrip = !this.state.data.isRoundTrip;
    this.setState({ data: newData });
  };

  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  setDates = () => {
    let newData = { ...this.state.data };
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));

    if (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") {
      if (!quotationInfo.startDate) {
        newData.startDate = new Date();
        //newData.bookBefore = new Date();
      } else {
        newData.startDate = quotationInfo.startDate;
        //newData.bookBefore = quotationInfo.startDate;
      }
    }
    else {
      if (this.props.type !== "Itinerary" && this.props.type !== "Itinerary_Master" && this.props.business.toLowerCase() === "custom") {
        newData.startDate = this.state.data.dates.checkInDate;
      }
      else {
        newData.startDate = moment().add(this.state.data.cutOffDays, "days").format('YYYY-MM-DD');
      }
    }

    if (!quotationInfo.endDate) {
      newData.endDate = moment().add(this.state.data.stayInDays, "days").format('YYYY-MM-DD');
    } else {
      newData.endDate = quotationInfo.endDate;
    }

    if (this.props.type !== "Itinerary" && this.props.type !== "Itinerary_Master" && this.props.business.toLowerCase() === "custom") {
      newData.endDate = this.state.data.dates.checkOutDate;
    }

    if (!quotationInfo.departStartDate) {
      newData.departStartDate = this.state.data.dates.checkInDate;
    } else {
      newData.departStartDate = quotationInfo.departStartDate;
    }

    if (!quotationInfo.departEndDate) {
      newData.departEndDate = this.state.data.dates.checkOutDate;
    } else {
      newData.departEndDate = quotationInfo.departEndDate;
    }

    if (!quotationInfo.returnStartDate) {
      newData.returnStartDate = this.state.data.dates.checkInDate;
    } else {
      newData.returnStartDate = quotationInfo.returnStartDate;
    }

    if (!quotationInfo.returnEndDate) {
      newData.returnEndDate = this.state.data.dates.checkOutDate;
    } else {
      newData.returnEndDate = quotationInfo.returnEndDate;
    }
    let count = quotationInfo.duration && Math.ceil(quotationInfo.duration);
    let day = moment(newData.endDate).diff(moment(newData.startDate), "days") + 1;
    if (count < day) {
      count += 1;
    }
    const duration = [...Array(count).keys()];
    let days = [];
    duration.map((item) => {
      days.push({
        name:
          "Day " +
          (item + 1) +
          " - " +
          moment(quotationInfo.startDate).add(item, "days").format("MMM DD"),
        value: item + 1,
      });
    });
    newData.dayReturn = days[days.length - 1].value
    newData.dayReturnEnd = days[days.length - 1].value

    this.setState({ data: newData });
  };

  setImportData = () => {
    let data = { ...this.state.data };
    let item = this.props.importItem;
    let fromlocation = {
      "id": item?.fromLocation,
      "name": item?.fromLocation,
      "address": item?.fromLocation,
    }
    let tolocation = {
      "id": item?.toLocation,
      "name": item?.toLocation,
      "address": item?.toLocation,
    }
    let getDepart = {
      "id": item?.departAirlineName,
      "name": item?.departAirlineName,
      "address": item?.departAirlineName,
    }
    let getReturn = {
      "id": item?.returnAirlineName,
      "name": item?.returnAirlineName,
      "address": item?.returnAirlineName,
    }
    if (!item.editMode) {
      item.sellPrice = "";
      item.costPrice = "";
      item.bookBefore = "";
    }

    if (item.business === "air") {
      item.departStops = Array.isArray(item.departStops) ? item.departStops :
        [...Array(Number(item.departStops)).keys()].map(i => {
          return {
            stopsID: i + 1,
          }
        });
      item.returnStops = Array.isArray(item.returnStops) ? item.returnStops :
        [...Array(Number(item.returnStops)).keys()].map(i => {
          return {
            stopsID: i + 1,
          }
        });

      item.fromLocation = item.fromLocation;
      item.fromLocationFlight = fromlocation;
      item.toLocation = item.toLocation;
      item.toLocationFlight = tolocation;
      item.departAirlineName = item.departAirlineName;
      item.DepartFlight = getDepart;
      item.returnAirlineName = item.returnAirlineName;
      item.ReturnFlight = getReturn;
      item.child = item.child === "" ? "0" : item.child;
      item.infant = item.infant === "" ? "0" : item.infant;
    }

    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    /* if (!quotationInfo.startDate) {
      item.bookBefore = new Date();
    } else {
      item.bookBefore = quotationInfo.startDate;
    } */

    if (item.departDuration && item.departDuration.length > 0) {
      item.departDurationH = item.departDuration.replace("h", "").replace("m", "").split(' ')[0];
      item.departDurationM = item.departDuration.replace("h", "").replace("m", "").split(' ')[1];
    }
    else {
      item.departDurationH = "00";
      item.departDurationM = "00";
    }
    if (item.returnDuration && item.returnDuration !== "" && item.returnDuration.length > 0) {
      item.returnDurationH = item.returnDuration.replace("h", "").replace("m", "").split(' ')[0];
      item.returnDurationM = item.returnDuration.replace("h", "").replace("m", "").split(' ')[1];
    }
    else {
      item.returnDurationH = "00";
      item.returnDurationM = "00";
    }
    if (item.hotelPaxInfo.length === 0) {
      let itemType = item.itemType;
      item.hotelPaxInfo = [...Array(Number(item.noRooms ?? 1)).keys()].map((item, index) => {
        return {
          roomID: index + 1,
          noOfAdults: 2,
          noOfChild: 0,
          roomType: itemType ? (Array.isArray(itemType) ? itemType[0] : itemType) : "",
          childAge: []
        }
      });
    }
    if (item.editMode) {
      item.isSellPriceReadonly = (item.conversionRate || item.supplierCostPrice || item.supplierTaxPrice || item.markupPrice || item.discountPrice || item.processingFees || item.tax1 || item.tax2 || item.tax3 || item.tax4 || item.tax5) ? true : false;
    }
    if (item.business === "custom") {
      if (item.itemType === "" || itemTypeList.filter(x => x.name.toLowerCase() === item.itemType.toLowerCase()).length > 0) {
        item.customitemType = item.itemType;
      }
      else {
        item.customitemType = "Other";
        item.otherType = item.itemType;
      }
    }

    item.type = this.props.type;
    if (!item.ImageUrl && item.business === "activity" && item.details) {
      if (item.details.images.length > 0) {
        item.imgUrl = item.details.images[0].url
      }
    }
    if (!item.ImageUrl && item.imgUrl) {
      item.ImageUrl = item.imgUrl.split('/')[item.imgUrl.split('/').length - 1]
      item.ImgExtension = item.ImageUrl.split('.')[item.ImageUrl.split('.').length - 1]
      item.ImageName = item.ImageUrl.replace("." + item.ImgExtension, "");
      item.ImageUrl = item.imgUrl;
    }
    item.description = item.description?.replaceAll('<br/>', '\n');
    data = item;

    this.setState({ data, editMode: item.editMode }, () => {
      //if (item.editMode)
      this.handleAmountFields(0, { target: { name: "", value: "" } });
    });
  };

  validateBRN = tmpBRN => {
    const errors = {};
    const { data } = this.state;

    if (data.brn) {
      const quotationInfo = JSON.parse(localStorage.getItem("quotationItems"));
      if (quotationInfo && quotationInfo.filter(x => x.offlineItem.uuid !== this.state.data.uuid
        && x.offlineItem.brn
        && x.offlineItem.brn.toLowerCase() === tmpBRN.toLowerCase()).length > 0)
        errors.brn = "Confirmation Number should be unique per " + ((this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") ? "itinerary" : "quotation") + ".";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0 ? null : errors;
  }

  componentDidMount() {

    this.setDates();
    this.getSupplier(this.state.data.business);
    this.props.importItem && this.setImportData();
    this.props.importItem && window.scrollTo(0, 206);
  }

  handleShowHideTax = () => {
    var data = this.state.data;
    data.isShowTax = !data.isShowTax;
    this.setState({ data });
  }

  handleAmountFields = (value, e) => {
    let data = this.state.data;
    let costPrice = 0;
    let tmpSellPrice = Number(data.sellPrice);
    let taxType = data.taxType ?? "CGSTSGST";
    let conversionRate = isNaN(Number(data.conversionRate)) ? 1 : data.conversionRate === "" ? 1 : Number(data.conversionRate);
    let supplierTaxPrice = isNaN(Number(data.supplierTaxPrice)) ? 0 : Number(data.supplierTaxPrice);
    let supplierCostPrice = isNaN(Number(data.supplierCostPrice)) ? 0 : Number(data.supplierCostPrice);

    costPrice = (supplierCostPrice + supplierTaxPrice) * conversionRate;
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
    costPrice = costPrice === 0 && Number(data.costPrice) > 0 ? Number(data.costPrice) : costPrice;//Old itinerary/quotation
    let business = data.business.toLowerCase();
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
      data.conversionRate || data.supplierCostPrice || data.supplierTaxPrice || data.markupPrice
      || data.discountPrice || data.processingFees
    ) ? true : false;
    if (!data.isSellPriceReadonly) {
      sellPrice = tmpSellPrice;
      costPrice = tmpSellPrice;
    }

    let amountToCalculateGST = 0;
    let amountToCalculateTax = 0;
    amountToCalculateTax = costPrice + markupPrice + processingFees - discountPrice;
    if (business === 'hotel' || business === 'transfers') {
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
      amountToCalculateTax = sellPrice;
      if (percentage > 0) {
        let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
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

      tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
      tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
      tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
      tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
      tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);

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
          let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
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
        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
        if (!data.isInclusive)
          totalAmount = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
        else
          totalAmount = 0;
        totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
      }
      else {
        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
        totalAmount = (Number(sellPrice) + Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2)));
      }
    }

    //data.conversionRate = conversionRate;
    //data.supplierTaxPrice = supplierTaxPrice;
    //data.supplierCostPrice = supplierCostPrice;
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
    data.processingFees = processingFees;
    data.sellPrice = sellPrice;
    this.setState({ data });
  }

  getCustomTaxAmount = (purpose, business, amountToCalculate, isTaxModified, currentAmount) => {
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

    if (customTaxConfigurations?.find(y => y.purpose === purpose)?.chargeValue > 0) {
      return Number(((customTaxConfigurations.find(y => y.purpose === purpose).chargeValue * amountToCalculate) / 100).toFixed(2));
    }
    return 0;
  }

  porcessTaxInfo = (baseAmount, data, taxPercentage) => {
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

  setFocusOnVendor = () => {
    this.setState({
      showPopup: false,
      popupContent: "",
      popupTitle: ""
    });
    //this.inputRef['vendor'].current && this.references['vendor'].current.focus();
  }

  handlePopup = () => {
    this.setState({
      popupTitle: this.state.showPopup ? "" : "Vendor/Supplier",
      showPopup: !this.state.showPopup,
      popupContent: this.state.showPopup ? "" : <div>
        <div>Add item without Vendor/Supplier?</div>
        <button
          className="btn btn-primary pull-right m-1 "
          onClick={() => this.handleAddItem(this.state.editMode, true)}
        >
          {Trans("_yes")}
        </button>

        <button
          className="btn btn-primary pull-right m-1 "
          onClick={() => this.setFocusOnVendor()}
        >
          {Trans("_no")}
        </button>
      </div>,
      sizeClass: "modal-dialog"

    });
  };

  handleOnDateChange1 = () => {

    let data = this.state.data;
    if (moment(data.startDate).diff(moment(data.endDate), 'days') > 0) {
      data.endDate = moment(data.startDate).add(1, "d").format(Global.DateFormate);
      this.setState({ data });
    }
  };
  callContentModal = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      popupTitle: "Content Library",
      popupContent: <Imagelibrary imageDetails={this.imageDetails} />,
      sizeClass: "modal-dialog modal-lg modal-dialog-centered"
    })
  }
  callPreviewModal = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      popupTitle: "Preview Image",
      popupContent:
        <img src={this.state.data.ImageUrl} className="img-responsive img-thumbnail"
          style={{ height: "150px", width: "250px" }} alt=''
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = this.getOnErrorImageURL();
          }}
        />,
      sizeClass: "modal-dialog"
    })
  }

  getOnErrorImageURL = () => {
    let business = this.props.business;
    if (business === "hotel")
      return ImageNotFoundHotel.toString();
    else if (business === "activity") {
      return ImageNotFoundActivity.toString();
    } else if (business === "package") {
      return ImageNotFoundPackage.toString();
    } else if (business === "transfers") {
      return ImageNotFoundTransfers.toString();
    } else if (business === "vehicle") {
      return ImageNotFoundVehicle.toString();
    } else if (business === "custom") {
      return ImageNotFoundActivity.toString();
    }
  };

  handleHidePopup = () => {
    this.setState({
      isCopyItemPopup: !this.state.isCopyItemPopup,
    });
  };
  imageDetails = (imageData, url, extension) => {
    let data = this.state.data;
    data.ImageName = imageData;
    data.ImageUrl = url;
    data.ImgExtension = extension;
    this.setState({ data, showPopup: false })
  }
  removeImage = () => {
    let data = this.state.data;
    data.ImageUrl = '';
    data.ImageName = 'Select Image';
    data.ImgExtension = '';
    this.setState({ data })
  }
  handleTaxQuoationoData = (taxdata) => {

    let data = this.state.data;
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
    data.isTax1Modified = taxdata.isTax1Modified;
    data.isTax2Modified = taxdata.isTax2Modified;
    data.isTax3Modified = taxdata.isTax3Modified;
    data.isTax4Modified = taxdata.isTax4Modified;
    data.isTax5Modified = taxdata.isTax5Modified;
    data.taxType = taxdata.taxType;
    this.setState({ data }, () => this.handleAmountFields(0, { target: { name: "", value: "" } }));
  }
  handleCreate = (vendorName) => {
    let { data } = this.state;
    data.vendor = vendorName;
    this.setState({ data });
  }
  handleChange1 = (e) => {
    let { data } = this.state;
    if (e == null) {
      data.vendor = null;
    }
    else {
      data.vendor = e.label;
    }
    this.setState({ data });
  }
  addDepartureStops = (e) => {
    if (e.target.value > 3) return;
    let data = this.state.data;
    let stopsValue = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
    var objr = [];
    data.departStops = objr;
    if (stopsValue > 0) {

      for (let i = 0; i < stopsValue; i++) {
        var objContainer = {
          stopsID: data.departStops.length + 1,
        };
        objr = data.departStops;
        objr.push(objContainer);
      }
      data.departStops = objr;
    }
    this.setState({ data });
  }
  addReturnStops = (e) => {
    if (e.target.value > 3) return;
    let data = this.state.data;
    let stopsValue = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
    var objr = [];
    data.returnStops = objr;
    if (stopsValue > 0) {

      for (let i = 0; i < stopsValue; i++) {
        var objContainer = {
          stopsID: data.returnStops.length + 1,
        };
        objr = data.returnStops;
        objr.push(objContainer);
      }
      data.returnStops = objr;
    }
    this.setState({ data });
  }
  singleAddDepartureStops = () => {
    let data = this.state.data;
    var objr = [];
    var objContainer = {
      stopsID: data.departStops.length + 1,
    };
    var objr = data.departStops;
    objr.push(objContainer);
    data.departStops = objr;
    this.setState({ data });
  }
  singleAddReturnStops = () => {
    let data = this.state.data;
    var objr = [];
    var objContainer = {
      stopsID: data.returnStops.length + 1,
    };
    var objr = data.returnStops;
    objr.push(objContainer);
    data.returnStops = objr;
    this.setState({ data });
  }
  deleteDepartureStops = (stopId) => {
    let data = this.state.data;
    var objr = [];
    const idToRemove = stopId;
    objr = data.departStops.filter((item) => item.stopsID !== idToRemove);
    data.departStops = objr;
    this.setState({ data });
  }
  deleteReturnStops = (stopId) => {
    let data = this.state.data;
    var objr = [];
    const idToRemove = stopId;
    objr = data.returnStops.filter((item) => item.stopsID !== idToRemove);
    data.returnStops = objr;
    this.setState({ data });
  }
  saveDepartStops = (response) => {
    this.deleteDepartureStops(response.stopsID);
    let data = this.state.data;
    var objr = [];
    var objContainer = { ...response };
    var objr = data.departStops;
    objr.push(objContainer);
    objr = objr.sort((a, b) => (a.stopsID > b.stopsID) ? 1 : ((b.stopsID > a.stopsID) ? -1 : 0));
    data.departStops = objr;
    this.setState({ data });
  }
  saveReturnStops = (response) => {
    this.deleteReturnStops(response.stopsID);
    let data = this.state.data;
    var objr = [];
    var objContainer = { ...response };
    var objr = data.returnStops;
    objr.push(objContainer);
    objr = objr.sort((a, b) => (a.stopsID > b.stopsID) ? 1 : ((b.stopsID > a.stopsID) ? -1 : 0));
    data.returnStops = objr;
    this.setState({ data });
  }
  render() {
    const { business, type } = this.props;
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    const isPringAllowed = !(((type === "Itinerary" || type === "Itinerary_Master") && quotationInfo)
      ? (quotationInfo.configurations?.isPackagePricing ?? false)
      : false);
    let count = quotationInfo.duration && Math.ceil(quotationInfo.duration);
    let day = moment(quotationInfo.endDate).diff(moment(quotationInfo.startDate), "days") + 1;
    if (count < day) {
      count += 1;
    }
    const duration = [...Array(count).keys()];
    let days = [];
    let nights = [];
    duration.map((item) => {
      days.push({
        name:
          "Day " +
          (item + 1) +
          " - " +
          moment(quotationInfo.startDate).add(item, "days").format("MMM DD"),
        value: item + 1,
      });
      nights.push({ name: item + 1, value: item + 1 });
    });
    //nights.pop();

    if (business === "custom") {
      days.push({
        name:
          "All Days",
        value: "All Days",
      });
    }

    let returnDays = [...Array(4).keys()];
    let daysReturn = [];
    returnDays.map((item) => {
      daysReturn.push({
        name:
          "Day " +
          (item + count) +
          " - " +
          moment(quotationInfo.endDate).add(item, "days").format("MMM DD"),
        value: item + count,
      });
    });

    let departStartdays = [];
    let departEnddays = [];
    let returndepartStartdays = [];
    let returnEnddays = [];
    departStartdays = days;
    //returndepartStartdays=days;
    if (business === "air") {
      days.map((item) => {
        if (parseInt(item.value) === parseInt(this.state.data.dayDepart) || parseInt(item.value) > parseInt(this.state.data.dayDepart)) {
          departEnddays.push(item);
        }
      });

      daysReturn.map((item, cnt) => {
        if (cnt === 0) {
          returndepartStartdays.push(item);
        }
      });

      daysReturn.map((item) => {
        if (parseInt(item.value) === parseInt(this.state.data.dayReturn) || parseInt(item.value) > parseInt(this.state.data.dayReturn)) {
          returnEnddays.push(item);
        }
      });
      daysReturn = returnEnddays;
    }


    let currencyList = [{ name: "Select", value: "" }];
    Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        name: x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode + " (" + x.symbol + ")",
      })
    );

    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    let supplierOptions = []

    if (this.state.suppliers.length > 0) {
      let agentSupplier = this.state.suppliers.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
      let tourwizSupplier = this.state.suppliers.filter(x => x.isTourwizSupplier === 1).map(item => { return { label: item.fullName, value: item.providerId } });
      let Supplier = this.state.suppliers.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
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
    return (
      <div className="p-3">
        <div className="row">
          {(business === "hotel" || business === "activity") && (
            <React.Fragment>
              <div className="col-lg-4">
                {this.renderInput("name", business === "hotel" ? "Hotel Name" : "Activity Name")}
              </div>
              <div className="col-lg-4">{this.renderInput("toLocation", "Address / Location")}</div>
            </React.Fragment>
          )}

          {business === "hotel" && (
            <React.Fragment>
              {(type === "Quotation" || type === "Quotation_Master") && (
                <React.Fragment>
                  <div className="col-lg-2">
                    <DateRangePicker
                      isValid={this.props.datesIsValid}
                      cutOffDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
                      stayInDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays}
                      minDate={moment("2001-01-01").format(Global.DateFormate)}
                      minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                      maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                      isSingleDateRangePicker={true}
                      handleDateChange={this.handleStartDate}
                      dates={
                        { checkInDate: this.state.data.dates.checkInDate }
                      }
                      checklabelName={"checkin"}
                      business={business}
                    />
                  </div>
                  <div className="col-lg-2">
                    <DateRangePicker
                      isValid={this.props.datesIsValid}
                      cutOffDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
                      stayInDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays}
                      minDate={this.state.data.dates.checkInDate}
                      minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                      maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                      isSingleDateRangePicker={true}
                      handleDateChange={this.handleEndDate}
                      checklabelName={"checkout"}
                      dates={
                        { checkInDate: this.state.data.dates.checkOutDate }
                      }
                      business={business}
                    />
                  </div>
                </React.Fragment>
              )}

              {(type === "Itinerary" || type === "Itinerary_Master") && (
                <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days)}</div>
              )}

              {(type === "Itinerary" || type === "Itinerary_Master") && (
                <div className="col-lg-2">
                  {this.renderSelect("nights", "No of Nights", nights)}
                </div>
              )}

              <div className="col-lg-1">
                {this.renderSelect("rating", "Star Rating", starRating)}
              </div>
              {business != 'hotel' &&
                <React.Fragment>
                  <div className="col-lg-2 text-nowrap">
                    {this.renderInput("noRooms", "No of Rooms")}
                  </div>
                  <div className="col-lg-2">{this.renderInput("itemType", "Room Type")}</div>
                </React.Fragment>
              }

              <HotelPaxWidget
                key={this.state.data.hotelPaxInfo}
                handlePax={this.handleHotelPax}
                isValid={"valid"}//this.props.paxIsValid
                roomDetails={this.state.data.hotelPaxInfo}//this.props.pax
                totalNoOfAdult={0}//this.props.totalNoOfAdult
                totalNoOfChild={0}//this.props.totalNoOfChild
                ishandleRoomType={true}
              />

              <div className="col-lg-2">{this.renderSelect("mealType", "Meal Type", mealSelection)}</div>
              <div className="col-lg-2">{this.renderContactInput("hotelContactNumber", "Hotel Contact Number")}</div>
              <div className="col-lg-4" >
                <label>Hotel Image</label>
                <button className="btn form-control d-flex justify-content-start"
                  style={{ border: "2px solid rgb(221, 216, 215)" }}
                  onClick={() => this.callContentModal()}
                >
                  {this.state.data.ImageName === 'Select Image' ?
                    this.state.data.ImageName
                    : !this.state.data.ImageName
                      ? ""
                      : this.state.data.ImageName.length > 20 ?
                        this.state.data.ImageName.slice(0, 20) + "..."
                        : (this.state.data.ImageName + "." + this.state.data.ImgExtension)}
                </button>
                {this.state.data.ImageName === 'Select Image'
                  ? ""
                  : !this.state.data.ImageName
                    ? ""
                    : <div className="btn-group">
                      <small
                        className="btn btn-sm alert  alert-success p-1 mt-2"
                        onClick={() => this.callPreviewModal()}>
                        Preview Image
                      </small>
                      <small
                        className="btn btn-sm alert alert-success p-1 mt-2"
                        onClick={() => this.removeImage()}
                        data-toggle="tooltip" data-placement="top"
                        title="Remove"
                      >
                        <img
                          style={{ filter: "none" }}
                          src={trashImage}
                          alt=""
                        />
                      </small>
                    </div>}
              </div>
            </React.Fragment>
          )}

          {business === "activity" && (
            <React.Fragment>
              {(type === "Quotation" || type === "Quotation_Master") && (
                <div className="col-lg-2">
                  {this.renderSingleDate("startDate", "Date", this.state.data.startDate, moment('2001-01-01').format('YYYY-MM-DD'))}
                </div>
              )}

              {(type === "Itinerary" || type === "Itinerary_Master") && (
                <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days)}</div>
              )}

              <div className="col-lg-2">
                {!this.props.importItem && this.renderSelect("duration", "Duration", durationList)}
                {this.props.importItem && this.renderInput("duration", "Duration")}
              </div>

              <div className="col-lg-2">{this.renderInput("guests", "No of Guests")}</div>
              <div className="col-lg-4" >
                <label>Activity Image</label>
                <button className="btn form-control d-flex justify-content-start"
                  style={{ border: "2px solid rgb(221, 216, 215)" }}
                  onClick={() => this.callContentModal()}
                >
                  {this.state.data.ImageName === 'Select Image' ?
                    this.state.data.ImageName
                    : !this.state.data.ImageName
                      ? ""
                      : this.state.data.ImageName.length > 20 ?
                        this.state.data.ImageName.slice(0, 20) + "..."
                        : (this.state.data.ImageName + "." + this.state.data.ImgExtension)}
                </button>
                {this.state.data.ImageName === 'Select Image'
                  ? ""
                  : !this.state.data.ImageName
                    ? ""
                    : <div className="btn-group">
                      <small
                        className="btn btn-sm alert  alert-success p-1 mt-2"
                        onClick={() => this.callPreviewModal()}>
                        Preview Image
                      </small>
                      <small
                        className="btn btn-sm alert alert-success p-1 mt-2"
                        onClick={() => this.removeImage()}
                        data-toggle="tooltip" data-placement="top"
                        title="Remove"
                      >
                        <img
                          style={{ filter: "none" }}
                          src={trashImage}
                          alt=""
                        />
                      </small>
                    </div>}
              </div>
              <div className="col-lg-4">{this.renderInput("itemType", "Activity Type")}</div>
            </React.Fragment>
          )}

          {business === "air" && (
            <React.Fragment>
              <div className="col-lg-2">
                <label className="d-block" style={{ marginBottom: "14px" }}>
                  Trip Type
                </label>
                <div className="BE-Search-Radio">
                  <ul>
                    <li className="checked">
                      <input
                        checked={this.state.data.isRoundTrip}
                        value="RoundTrip"
                        name="Direction"
                        type="radio"
                        onChange={() => this.changeairTripType()}
                      />
                      <label>{Trans("_airTripDirection_Roundtrip")}</label>
                    </li>
                    <li>
                      <input
                        value="OneWay"
                        name="Direction"
                        type="radio"
                        checked={!this.state.data.isRoundTrip}
                        onChange={() => this.changeairTripType()}
                      />
                      <label>{Trans("_airTripDirection_Oneway")}</label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="form-group col-lg-12" id="fromLocation" >
                  <label htmlFor="fromLocation">
                    {Trans("_widget" + business + "FromLocationTitle")}
                  </label>
                  <AutoComplete
                    selectedOptions={this.state.data.fromLocationFlight && this.state.data.fromLocationFlight.id
                      ? [this.state.data.fromLocationFlight]
                      : []}
                    isValid="valid"
                    businessName={business}
                    handleLocation={this.setFromLocation}
                    mode="From"
                  />
                </div>
              </div>
              <div className="col-lg-5 ">
                <div className="form-group col-lg-12" id="toLocation">
                  <label htmlFor="tolocation">
                    {Trans("_widget" + business + "ToLocationTitle")}
                  </label>
                  <AutoComplete
                    selectedOptions={this.state.data.toLocationFlight && this.state.data.toLocationFlight.id
                      ? [this.state.data.toLocationFlight]
                      : []
                    }
                    isValid="valid"
                    businessName={business}
                    handleLocation={this.setToLocation}
                    mode="To"
                  />
                </div>
              </div>

              <div className="col-lg-12">
                {this.state.data.isRoundTrip && (
                  <span className="d-block text-primary mb-2">Enter Departure Flight Details</span>
                )}
                <div className="row">
                  <div className="col-lg-3">
                    <div className="row">
                      {(type === "Quotation" || type === "Quotation_Master") && (
                        <div className="col-lg-7">
                          {this.renderSingleDate(
                            "departStartDate",
                            "Depart Date",
                            this.state.data.departStartDate,
                            moment('2001-01-01').format('YYYY-MM-DD')
                          )}
                        </div>
                      )}

                      {(type === "Itinerary" || type === "Itinerary_Master") && (
                        <div className="col-lg-7">
                          {this.renderSelect("dayDepart", "Depart Day", days)}
                        </div>
                      )}

                      {/* <div className="col-lg-5">
                        {this.renderInput("departStartTime", "Depart Time")}
                      </div> */}
                      <div className="col-lg-5">
                        <div className="form-group departStartTime">
                          <label htmlFor="departStartTime">Depart Time</label>
                          <TimeField
                            className="form-control w-100"
                            name="departStartTime"
                            value={this.state.data.departStartTime}
                            onChange={e => this.handleChange({ currentTarget: e.target })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="row">
                      {(type === "Quotation" || type === "Quotation_Master") && (
                        <div className="col-lg-7">
                          {this.renderSingleDate(
                            "departEndDate",
                            "Arrival Date",
                            this.state.data.departEndDate,
                            moment('2001-01-01').format('YYYY-MM-DD')
                          )}
                        </div>
                      )}

                      {(type === "Itinerary" || type === "Itinerary_Master") && (
                        <div className="col-lg-7">
                          {this.renderSelect("dayDepartEnd", "Arrival Day", departEnddays)}
                        </div>
                      )}

                      {/* <div className="col-lg-5">
                        {this.renderInput("departEndTime", "Arrival Time")}
                      </div> */}
                      <div className="col-lg-5">
                        <div className="form-group departEndTime">
                          <label htmlFor="departEndTime">Arrival Time</label>
                          <TimeField
                            className="form-control w-100"
                            name="departEndTime"
                            value={this.state.data.departEndTime}
                            onChange={e => this.handleChange({ currentTarget: e.target })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="row">
                      <div className="form-group col-lg-6" id="departAirlineName">
                        <label htmlFor="airline">Airline Name</label>
                        <AutoComplete
                          isValid="valid"
                          businessName={business}
                          handleLocation={this.handleDepartFlight}
                          mode="airline"
                          selectedOptions={this.state.data.DepartFlight && this.state.data.DepartFlight.id
                            ? [this.state.data.DepartFlight] : []}
                        />
                      </div>
                      <div className="col-lg-6">
                        {this.renderInput("departFlightNumber", "Flight Number")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="row">
                      <div className="col-lg-5">{this.renderInput("departClass", "Class")}</div>
                      <div className="col-lg-4">
                        {this.renderDuration(["departDurationH", "departDurationM"], "Duration")}
                      </div>
                      <div className="col-lg-3">
                        {/* {this.renderInput("departStops", "Stops")} */}
                        <label className="text-dark">Stops</label>
                        <select class="form-select"
                          name="departStops"
                          aria-label="Default select example"
                          style={{ width: "50px", height: "35px", border: "1px solid #ced4da" }}
                          value={Array.isArray(this.state.data.departStops) ? this.state.data.departStops.length : this.state.data.departStops}
                          onChange={(e) => this.addDepartureStops(e)}
                        >
                          <option selected>0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>

                        {/* <input type="number"
                          id="departStops"
                          name="departStops"
                          // min="0"
                          max="3"
                          style={{ width: "50px", height: "35px", border: "1px solid #ced4da" }}
                          value={this.state.data.departStops.length}
                          onChange={(e) => this.addDepartureStops(e)}
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {Array.isArray(this.state.data.departStops) && this.state.data.departStops.map((item, index) => (
                <FlightStops
                  key={item.stopsID}
                  {...this.props}
                  type={type}
                  // stopsID={item.stopsID}
                  data={item}
                  minDate={this.state.data.departStartDate}
                  maxDate={this.state.data.departEndDate}
                  // stopsDetails={this.state.data.departStops}
                  saveStops={this.saveDepartStops}
                  dayDepart={parseInt(this.state.data.dayDepart)}
                  dayDepartEnd={parseInt(this.state.data.dayDepartEnd)}
                />
              ))}
              {this.state.data.isRoundTrip && (
                <div className="col-lg-12">
                  <span className="d-block text-primary mb-2">Enter Return Flight Details</span>
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="row">
                        {(type === "Quotation" || type === "Quotation_Master") && (
                          <div className="col-lg-7">
                            {this.renderSingleDate(
                              "returnStartDate",
                              "Depart Date",
                              this.state.data.returnStartDate,
                              moment('2001-01-01').format('YYYY-MM-DD')
                            )}
                          </div>
                        )}

                        {(type === "Itinerary" || type === "Itinerary_Master") && (
                          <div className="col-lg-7">
                            {this.renderSelect("dayReturn", "Depart Day", returndepartStartdays)}
                          </div>
                        )}

                        {/* <div className="col-lg-5">
                          {this.renderInput("returnStartTime", "Depart Time")}
                        </div> */}
                        <div className="col-lg-5">
                          <div className="form-group returnStartTime">
                            <label htmlFor="returnStartTime">Depart Time</label>
                            <TimeField
                              className="form-control w-100"
                              name="returnStartTime"
                              value={this.state.data.returnStartTime}
                              onChange={e => this.handleChange({ currentTarget: e.target })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="row">
                        {(type === "Quotation" || type === "Quotation_Master") && (
                          <div className="col-lg-7">
                            {this.renderSingleDate(
                              "returnEndDate",
                              "Arrival Date",
                              this.state.data.returnEndDate,
                              moment('2001-01-01').format('YYYY-MM-DD')
                            )}
                          </div>
                        )}

                        {(type === "Itinerary" || type === "Itinerary_Master") && (
                          <div className="col-lg-7">
                            {this.renderSelect("dayReturnEnd", "Arrival Day", daysReturn)}
                          </div>
                        )}

                        {/* <div className="col-lg-5">
                          {this.renderInput("returnEndTime", "Arrival Time")}
                        </div> */}
                        <div className="col-lg-5">
                          <div className="form-group returnEndTime">
                            <label htmlFor="returnEndTime">Arrival Time</label>
                            <TimeField
                              className="form-control w-100"
                              name="returnEndTime"
                              value={this.state.data.returnEndTime}
                              onChange={e => this.handleChange({ currentTarget: e.target })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="row">
                        <div className="form-group col-lg-6" id="returnAirlineName">
                          <label htmlFor="airline">Airline Name</label>
                          <AutoComplete
                            isValid="valid"
                            businessName={business}
                            handleLocation={this.handleReturnFlight}
                            mode="airline"
                            selectedOptions={this.state.data.ReturnFlight && this.state.data.ReturnFlight.id
                              ? [this.state.data.ReturnFlight] : []}
                          />
                        </div>
                        <div className="col-lg-6">
                          {this.renderInput("returnFlightNumber", "Flight Number")}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="row">
                        <div className="col-lg-5">{this.renderInput("returnClass", "Class")}</div>
                        <div className="col-lg-4">
                          {this.renderDuration(["returnDurationH", "returnDurationM"], "Duration")}
                        </div>
                        {/* <div className="col-lg-3">{this.renderInput("returnStops", "Stops")}</div> */}
                        <div className="col-lg-3">
                          <label className="text-dark">Stops</label>
                          <select class="form-select"
                            aria-label="Default select example"
                            style={{ width: "50px", height: "35px", border: "1px solid #ced4da" }}
                            name="returnStops"
                            value={Array.isArray(this.state.data.returnStops) ? this.state.data.returnStops.length : this.state.data.returnStops}
                            onChange={(e) => this.addReturnStops(e)}
                          >
                            <option selected>0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                          {/* <label className="text-dark">Stops</label>
                          <input type="number"
                            id="returnStops"
                            name="returnStops"
                            // min="0"
                            max="3"
                            style={{ width: "50px", height: "35px", border: "1px solid #ced4da" }}
                            value={this.state.data.returnStops.length}
                            onChange={(e) => this.addReturnStops(e)}
                          /> */}
                        </div>
                      </div>
                    </div>
                    {Array.isArray(this.state.data.returnStops) && this.state.data.returnStops.map((item, index) => (
                      <FlightStops
                        key={item.stopsID}
                        {...this.props}
                        // stopsID={item.stopsID}
                        data={item}
                        minDate={this.state.data.returnStartDate}
                        maxDate={this.state.data.returnEndDate}
                        // stopsDetails={this.state.data.returnStops}
                        saveStops={this.saveReturnStops}
                        dayReturn={parseInt(this.state.data.dayReturn)}
                        dayReturnEnd={parseInt(this.state.data.dayReturnEnd)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="col-lg-3">
                <div className="row">
                  <div className="col-lg-4">{this.renderInput("adult", "Adult")}</div>
                  <div className="col-lg-4">{this.renderInput("child", "Child")}</div>
                  <div className="col-lg-4">{this.renderInput("infant", "Infant")}</div>
                </div>
              </div>
            </React.Fragment>
          )}

          {business === "transfers" && (
            <React.Fragment>
              {!this.props.importItem && (
                <React.Fragment>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("fromLocation", "Pick-up Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("pickupType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("toLocation", "Drop-off Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {this.props.importItem && (
                <React.Fragment>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("fromLocation", "Pick-up Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("pickupType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("toLocation", "Drop-off Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {/* {this.props.importItem && (
                <div className="col-lg-8">{this.renderInput("name", "Transfer Name")}</div>
              )} */}

              <div className="col-lg-4">
                <div className="row">
                  {(type === "Quotation" || type === "Quotation_Master") && (
                    <div className="col-lg-6">
                      {this.renderSingleDate(
                        "startDate",
                        "Transfers Date",
                        this.state.data.startDate,
                        moment('2001-01-01').format('YYYY-MM-DD')
                      )}
                    </div>
                  )}

                  {(type === "Itinerary" || type === "Itinerary_Master") && (
                    <div className="col-lg-6">
                      {this.renderSelect("day", "Itinerary Day", days)}
                    </div>
                  )}

                  {/* {this.props.importItem && (
                    <div className="col-lg-6 text-nowrap">
                      {this.renderInput("duration", "Duration")}
                    </div>
                  )} */}

                  {!this.props.importItem && (
                    <div className="col-lg-6 text-nowrap">
                      {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime)}
                    </div>
                  )}

                  {this.props.importItem && (
                    <div className="col-lg-6 text-nowrap">
                      {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime)}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-8 text-nowrap">
                    {this.renderInput("itemType", "Vehicle Type (eg. Bus, Sedan)")}
                  </div>
                  <div className="col-lg-4">{this.renderInput("guests", "No of Guests")}</div>
                </div>
              </div>
              <div className="col-lg-4" >
                <label>Transfer Image</label>
                <button className="btn form-control d-flex justify-content-start"
                  style={{ border: "2px solid rgb(221, 216, 215)" }}
                  onClick={() => this.callContentModal()}
                >
                  {this.state.data.ImageName === 'Select Image' ?
                    this.state.data.ImageName
                    : !this.state.data.ImageName
                      ? ""
                      : this.state.data.ImageName.length > 20 ?
                        this.state.data.ImageName.slice(0, 20) + "..."
                        : (this.state.data.ImageName + "." + this.state.data.ImgExtension)}
                </button>
                {this.state.data.ImageName === 'Select Image'
                  ? ""
                  : !this.state.data.ImageName
                    ? ""
                    : <div className="btn-group">
                      <small
                        className="btn btn-sm alert  alert-success p-1 mt-2"
                        onClick={() => this.callPreviewModal()}>
                        Preview Image
                      </small>
                      <small
                        className="btn btn-sm alert alert-success p-1 mt-2"
                        onClick={() => this.removeImage()}
                        data-toggle="tooltip" data-placement="top"
                        title="Remove"
                      >
                        <img
                          style={{ filter: "none" }}
                          src={trashImage}
                          alt=""
                        />
                      </small>
                    </div>}
              </div>
            </React.Fragment>
          )}

          {business === "custom" && (
            <React.Fragment>
              <div className="col-lg-2">{this.renderInput("toLocation", "Location")}</div>
              <div className="col-lg-2">{this.renderInput("name", "Item Name")}</div>
              {(type === "Quotation" || type === "Quotation_Master") && (
                <div className="col-lg-2">
                  {this.renderSingleDate(
                    "startDate"
                    , "Start Date"
                    , this.state.data.startDate
                    , moment('2001-01-01').format('YYYY-MM-DD')
                    , moment(this.state.data.startDate).diff(moment(this.state.data.endDate), 'days') > 0 ? this.handleOnDateChange1() : undefined
                  )}
                </div>
              )}

              {(type === "Itinerary" || type === "Itinerary_Master") && (
                <div className="col-lg-2">
                  {this.renderSelect("day", "Itinerary Day", days)}
                </div>
              )}

              {(type === "Quotation" || type === "Quotation_Master") && (
                <div className="col-lg-2">
                  <div className="row">
                    <div className="col-lg-12">
                      {this.renderSingleDate(
                        "endDate"
                        , "End Date"
                        , moment(this.state.data.startDate).diff(moment(this.state.data.endDate), 'days') > 0 ? moment(this.state.data.startDate).format(Global.DateFormate) : moment().add(1, "m").format(Global.DateFormate)
                        , moment(this.state.data.startDate).format(Global.DateFormate)
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-lg-4" >
                <label>Custom Image</label>
                <button className="btn form-control d-flex justify-content-start"
                  style={{ border: "2px solid rgb(221, 216, 215)" }}
                  onClick={() => this.callContentModal()}
                >
                  {this.state.data.ImageName === 'Select Image' ?
                    this.state.data.ImageName
                    : !this.state.data.ImageName
                      ? ""
                      : this.state.data.ImageName.length > 20 ?
                        this.state.data.ImageName.slice(0, 20) + "..."
                        : (this.state.data.ImageName + "." + this.state.data.ImgExtension)}
                </button>
                {this.state.data.ImageName === 'Select Image'
                  ? ""
                  : !this.state.data.ImageName
                    ? ""
                    : <div className="btn-group">
                      <small
                        className="btn btn-sm alert  alert-success p-1 mt-2"
                        onClick={() => this.callPreviewModal()}>
                        Preview Image
                      </small>
                      <small
                        className="btn btn-sm alert alert-success p-1 mt-2"
                        onClick={() => this.removeImage()}
                        data-toggle="tooltip" data-placement="top"
                        title="Remove"
                      >
                        <img
                          style={{ filter: "none" }}
                          src={trashImage}
                          alt=""
                        />
                      </small>
                    </div>}
              </div>
              <div className="col-lg-4">
                {this.renderSelect("customitemType", "Item Type (eg. Restaurant)", itemTypeList)}
              </div>



              {(this.state.data.customitemType === "Other") &&
                <div className="col-lg-2">
                  {this.renderInput("otherType", "Other")}
                </div>
              }
            </React.Fragment>
          )}

          {true &&
            <div className="col-lg-2">
              {
                <div className="form-group">
                  <label for="amountWithoutGST">Vendor/Supplier</label>
                  {
                    <CreatableSelect
                      id={"vendor"}
                      styles={customStyles}
                      name={"vendor"}
                      isClearable={true}
                      placeholder={''}
                      //defaultInputValue={supplierOptions.find(x => x.label.toLowerCase() === this.state.data.vendor) ?? ''}
                      options={supplierOptions}
                      value={(this.state.data.vendor !== "" && this.state.data.vendor !== null && this.state.data.vendor) ? (supplierOptions.find(x => x.label.toLowerCase() === this.state.data.vendor) ?? { "label": this.state.data.vendor, "value": 0 }) : null}
                      isLoading={this.state.isSupplierlistLoading}
                      loadingMessage={() => 'Loading...'}
                      onCreateOption={this.handleCreate}
                      onChange={this.handleChange1}
                    // components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                    />
                  }
                </div>
              }
            </div>
          }
          {isPringAllowed &&
            <div className="col-lg-2">{this.renderInput("brn", "Confirmation Number", "text", false, this.validateBRN)}</div>
          }
          {!isPringAllowed &&
            <React.Fragment>
              <div className="col-lg-2">{this.renderInput("brn", "Confirmation Number", "text", false, this.validateBRN)}</div>

              <div className="col-lg-2">
                {this.renderCurrentDateWithDuration(
                  "bookBefore",
                  "Book Before (Supplier)", moment().format('YYYY-MM-DD')
                )}
              </div>
              {business === "transfers" && <div className="col-lg-10"></div>}
            </React.Fragment>}
          {isPringAllowed &&
            <React.Fragment>
              {this.state.data.isInclusive && this.state.data.sellPrice > 0 && Number(this.state.data.processingFees) === 0 && Number(this.state.data.amountWithoutGST) > 0 &&
                <div className="col-lg-2">
                  <div className="form-group amountWithoutGST">
                    <label for="amountWithoutGST">Sell Price (Without GST)</label>
                    <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={this.state.data.amountWithoutGST} />
                  </div>
                </div>
              }

              <div className="col-lg-2">
                {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", this.state.data.isSellPriceReadonly, this.handleAmountFields)}
              </div>
              {this.state.data.totalAmount > 0 && Number(this.state.data.totalAmount) > Number(this.state.data.sellPrice) &&
                <div className="col-lg-2">
                  {this.renderInput("totalAmount", "Total Amount (" + portalCurrency + ")", "text", true, this.handleAmountFields)}
                </div>}
              {/* <div className="col-lg-2">
                {this.renderInput("costPrice", "Cost Price (" + portalCurrency + ")")}
              </div>
              <div className="col-lg-2">
                {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")")}
              </div> */}

              <div className="col-lg-12">
                <div className="row pull-right mt-2 mb-2">
                  <div className="col-lg-12">
                    <button className="btn btn-link p-0 m-0 text-primary" onClick={this.handleShowHideTax}>
                      {this.state.data.isShowTax ? "Hide" : "Show"} more
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          }

          {isPringAllowed && this.state.data.isShowTax &&
            <div className="col-lg-12">
              <div className="row">

                {/* <div className="col-lg-2">{this.renderInput("vendor", "Vendor/Supplier")}</div>

                <div className="col-lg-2">{this.renderInput("brn", "Confirmation Number","text", false, this.validateBRN)}</div> */}

                <div className="col-lg-2">
                  {this.renderSelect("supplierCurrency", "Supplier Currency", currencyList)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("conversionRate", "Conversion Rate", "text", false, this.handleAmountFields)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("supplierCostPrice", "Supplier Cost Price", "text", false, this.handleAmountFields)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("supplierTaxPrice", "Supplier Tax", "text", false, this.handleAmountFields)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("costPrice", "Agent Cost Price (" + portalCurrency + ")", "text", true)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("markupPrice", "Agent Markup", "text", false, this.handleAmountFields)}
                </div>

                <div className="col-lg-2">
                  {this.renderInput("discountPrice", "Discount", "text", false, this.handleAmountFields)}
                </div>
                <TaxQuotationAddOffline
                  business={business}
                  handleTaxQuoationoData={this.handleTaxQuoationoData}
                  data={this.state.data}
                  errors={this.state.errors}
                />



                <div className="col-lg-2">
                  {this.renderCurrentDateWithDuration(
                    "bookBefore",
                    "Book Before (Supplier)", moment().format('YYYY-MM-DD')
                  )}
                </div>
              </div>
            </div>
          }

          <div className="col-lg-10">
            {this.renderTextarea(
              "description",
              "Description",
              "Add your own description or notes about the item you would like to share with the client."
            )}
          </div>

          <div className="col-lg-2">
            <div className="form-group">
              <label className="d-block">&nbsp;</label>
              <button
                id="AddItem"
                onClick={() => this.handleAddItem(this.state.editMode)}
                className="btn btn-primary w-100 text-capitalize"
              >
                {this.state.editMode ? "Save" : "Add"}{" "}
                {(type === "Quotation" || type === "Quotation_Master") && business !== "custom" && "Offline"} {business === "air" ? "Flight" : business}
                {business === "custom" && " Item"}
              </button>
            </div>
          </div>
        </div>
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            sizeClass={this.state.sizeClass}
            handleHide={this.handlePopup}
          />
        ) : null}
      </div>
    );
  }
}

export default QuotationAddOffline;


const starRating = [
  { name: "Select", value: "" },
  { name: "1", value: "1" },
  { name: "2", value: "2" },
  { name: "3", value: "3" },
  { name: "4", value: "4" },
  { name: "5", value: "5" },
];

const mealSelection = [
  { name: "Select", value: "" },
  { name: "Vegetarian", value: "Vegetarian" },
  { name: "Non-Vegetarian", value: "Non-Vegetarian" },
  { name: "Jain", value: "Jain" },
  { name: "European Plan", value: "European Plan" },
  { name: "Continental Plan", value: "Continental Plan" },
  { name: "American Plan", value: "American Plan" },
  { name: "Modified American Plan", value: "Modified American Plan" },
];

const PickupStartTime = [
  { value: "", name: "Select" },
  { value: "00:00", name: "12:00 am" },
  { value: "12:30", name: "12:30 am" },
  { value: "12:59", name: "12:59 am" },
  { value: "01:00", name: "01:00 am" },
  { value: "01:30", name: "01:30 pm" },
  { value: "01:59", name: "01:59 am" },
  { value: "02:00", name: "02:00 am" },
  { value: "02:30", name: "02:30 am" },
  { value: "02:59", name: "02:59 am" },
  { value: "03:00", name: "03:00 am" },
  { value: "03:30", name: "03:30 am" },
  { value: "03:59", name: "03:59 am" },
  { value: "04:00", name: "04:00 am" },
  { value: "04:30", name: "04:30 am" },
  { value: "04:59", name: "04:59 am" },
  { value: "05:00", name: "05:00 am" },
  { value: "05:30", name: "05:30 am" },
  { value: "05:59", name: "05:59 am" },
  { value: "06:00", name: "06:00 am" },
  { value: "06:30", name: "06:30 am" },
  { value: "06:59", name: "06:59 am" },
  { value: "07:00", name: "07:00 am" },
  { value: "07:30", name: "07:30 am" },
  { value: "07:59", name: "07:59 am" },
  { value: "08:00", name: "08:00 am" },
  { value: "08:30", name: "08:30 am" },
  { value: "08:59", name: "08:59 am" },
  { value: "09:00", name: "09:00 am" },
  { value: "09:30", name: "09:30 am" },
  { value: "09:59", name: "09:59 am" },
  { value: "10:00", name: "10:00 am" },
  { value: "10:30", name: "10:30 am" },
  { value: "10:59", name: "10:59 am" },
  { value: "11:00", name: "11:00 am" },
  { value: "11:30", name: "11:30 am" },
  { value: "11:59", name: "11:59 am" },
  { value: "12:00", name: "12:00 pm" },
  { value: "12:30", name: "12:30 pm" },
  { value: "12:59", name: "12:59 pm" },
  { value: "13:00", name: "01:00 pm" },
  { value: "13:30", name: "01:30 pm" },
  { value: "13:59", name: "01:59 pm" },
  { value: "14:00", name: "02:00 pm" },
  { value: "14:30", name: "02:30 pm" },
  { value: "14:59", name: "02:59 pm" },
  { value: "15:00", name: "03:00 pm" },
  { value: "15:30", name: "03:30 pm" },
  { value: "15:59", name: "03:59 pm" },
  { value: "16:00", name: "04:00 pm" },
  { value: "16:30", name: "04:30 pm" },
  { value: "16:59", name: "04:59 pm" },
  { value: "17:00", name: "05:00 pm" },
  { value: "17:30", name: "05:30 pm" },
  { value: "17:59", name: "05:59 pm" },
  { value: "18:00", name: "06:00 pm" },
  { value: "18:30", name: "06:30 pm" },
  { value: "18:59", name: "06:59 pm" },
  { value: "19:00", name: "07:00 pm" },
  { value: "19:30", name: "07:30 pm" },
  { value: "19:59", name: "07:59 pm" },
  { value: "20:00", name: "08:00 pm" },
  { value: "20:30", name: "08:30 pm" },
  { value: "20:59", name: "08:59 pm" },
  { value: "21:00", name: "09:00 pm" },
  { value: "21:30", name: "09:30 pm" },
  { value: "21:59", name: "09:59 pm" },
  { value: "22:00", name: "10:00 pm" },
  { value: "22:30", name: "10:30 pm" },
  { value: "22:59", name: "10:59 pm" },
  { value: "23:00", name: "11:00 pm" },
  { value: "23:30", name: "11:30 pm" },
  { value: "23:59", name: "11:59 pm" }
];

const durationList = [
  { name: "Select", value: "" },
  { name: "30 minutes", value: "30 minutes" },
  { name: "1 hour", value: "1 hour" },
  { name: "1 hour 30 minutes", value: "1 hour 30 minutes" },
  { name: "2 hours", value: "2 hours" },
  { name: "2 hours 30 minutes", value: "2 hours 30 minutes" },
  { name: "3 hours", value: "3 hours" },
  { name: "3 hours 30 minutes", value: "3 hours 30 minutes" },
  { name: "4 hours", value: "4 hours" },
  { name: "4 hours 30 minutes", value: "4 hours 30 minutes" },
  { name: "5 hours", value: "5 hours" },
  { name: "5 hours 30 minutes", value: "5 hours 30 minutes" },
  { name: "6 hours", value: "6 hours" },
  { name: "6 hours 30 minutes", value: "6 hours 30 minutes" },
  { name: "7 hours", value: "7 hours" },
  { name: "7 hours 30 minutes", value: "7 hours 30 minutes" },
  { name: "8 hours", value: "8 hours" },
  { name: "8 hours 30 minutes", value: "8 hours 30 minutes" },
  { name: "9 hours", value: "9 hours" },
  { name: "9 hours 30 minutes", value: "9 hours 30 minutes" },
  { name: "10 hours", value: "10 hours" },
  { name: "10 hours 30 minutes", value: "10 hours 30 minutes" },
  { name: "11 hours", value: "11 hours" },
  { name: "11 hours 30 minutes", value: "11 hours 30 minutes" },
  { name: "12 hours", value: "12 hours" },
  { name: "12 hours 30 minutes", value: "12 hours 30 minutes" },
  { name: "13 hours", value: "13 hours" },
  { name: "13 hours 30 minutes", value: "13 hours 30 minutes" },
  { name: "14 hours", value: "14 hours" },
  { name: "14 hours 30 minutes", value: "14 hours 30 minutes" },
  { name: "15 hours", value: "15 hours" },
  { name: "15 hours 30 minutes", value: "15 hours 30 minutes" },
  { name: "16 hours", value: "16 hours" },
  { name: "16 hours 30 minutes", value: "16 hours 30 minutes" },
  { name: "17 hours", value: "17 hours" },
  { name: "17 hours 30 minutes", value: "17 hours 30 minutes" },
  { name: "18 hours", value: "18 hours" },
  { name: "18 hours 30 minutes", value: "18 hours 30 minutes" },
  { name: "19 hours", value: "19 hours" },
  { name: "19 hours 30 minutes", value: "19 hours 30 minutes" },
  { name: "20 hours", value: "20 hours" },
  { name: "20 hours 30 minutes", value: "20 hours 30 minutes" },
  { name: "21 hours", value: "21 hours" },
  { name: "21 hours 30 minutes", value: "21 hours 30 minutes" },
  { name: "22 hours", value: "22 hours" },
  { name: "22 hours 30 minutes", value: "22 hours 30 minutes" },
  { name: "23 hours", value: "23 hours" },
  { name: "23 hours 30 minutes", value: "23 hours 30 minutes" },
  { name: "1 day", value: "1 day" },
];

const itemTypeList = [
  { name: "Select Inquiry Type", value: "" },
  { name: "Visa", value: "Visa" },
  { name: "Rail", value: "Rail" },
  { name: "Forex", value: "Forex" },
  { name: "Bus", value: "Bus" },
  { name: "Rent a Car", value: "Rent a Car" },
  { name: "Other", value: "Other" }
];