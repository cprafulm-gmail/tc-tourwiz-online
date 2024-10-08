import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import DateRangePicker from "../common/date-range";
import moment from "moment";
import * as Global from "../../helpers/global";
import * as DropdownList from "../../helpers/dropdown-list";
import TimeField from 'react-simple-timefield';
import ModelPopup from "../../helpers/model";
import HotelPaxWidget from "../search/hotel-pax-widget";
import SVGIcon from "../../helpers/svg-icon";
import TaxQuotationAddOffline from "./tax-quotation-add-offline";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import CreatableSelect from 'react-select/creatable';
import AutoComplete from "../search/auto-complete";
import FlightStops from "./stop-quotation-add-offline";
class ManualInvoiceAddOffline extends Form {

  initialize_State = () => {
    return {
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
        name: this.props.mode === "PackageInvoice" ? JSON.parse(sessionStorage.getItem("packageInquiryBook")).data.title : this.props.quickProposal.title ? this.props.quickProposal.title : "",
        startDate: "",
        endDate: "",
        costPrice: this.props.mode === "PackageInvoice" ? JSON.parse(sessionStorage.getItem("packageInquiryBook")).data.budget.replace(".00", "") : "0",
        sellPrice: this.props.mode === "PackageInvoice" ? JSON.parse(sessionStorage.getItem("packageInquiryBook")).data.budget.replace(".00", "") : this.props.quickProposal.sellPrice ? this.props.quickProposal.sellPrice : "0",
        vendor: "",
        brn: "",
        itemType: "",
        noRooms: "",
        rating: "",
        duration: "",
        guests: "1",
        adult: "1",
        child: "0",
        infant: "0",
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
        supplierCurrency: this.props.quickProposal.supplierCurrency ? this.props.quickProposal.supplierCurrency : "",
        conversionRate: this.props.quickProposal.conversionRate ? this.props.quickProposal.conversionRate : "",
        bookBefore: "",
        supplierCostPrice: this.props.quickProposal.supplierCostPrice ? this.props.quickProposal.supplierCostPrice : 0,
        supplierTaxPrice: this.props.quickProposal.supplierTaxPrice ? this.props.quickProposal.supplierTaxPrice : 0,
        markupPrice: this.props.quickProposal.markupPrice ? this.props.quickProposal.markupPrice : 0,
        discountPrice: this.props.quickProposal.discountPrice ? this.props.quickProposal.discountPrice : 0,
        CGSTPrice: this.props.quickProposal.CGSTPrice ? this.props.quickProposal.CGSTPrice : 0,
        SGSTPrice: this.props.quickProposal.SGSTPrice ? this.props.quickProposal.SGSTPrice : 0,
        IGSTPrice: this.props.quickProposal.IGSTPrice ? this.props.quickProposal.IGSTPrice : 0,
        percentage: this.props.quickProposal.percentage ? this.props.quickProposal.percentage : (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
        processingFees: this.props.quickProposal.processingFees ? this.props.quickProposal.processingFees : 0,
        tax1: this.props.quickProposal.tax1 ? this.props.quickProposal.tax1 : 0,
        tax2: this.props.quickProposal.tax2 ? this.props.quickProposal.tax2 : 0,
        tax3: this.props.quickProposal.tax3 ? this.props.quickProposal.tax3 : 0,
        tax4: this.props.quickProposal.tax4 ? this.props.quickProposal.tax4 : 0,
        tax5: this.props.quickProposal.tax5 ? this.props.quickProposal.tax5 : 0,
        mealType: "",
        hotelContactNumber: "",
        isShowTax: false,
        isSellPriceReadonly: false,
        tpExtension: [],
        customitemType: this.props.mode === "PackageInvoice" ? "Package" : this.props.quickProposal.mode === "quick" ? "Package" : "",
        otherType: "",
        agentbankname: this.props.userInfo.bankName ? this.props.userInfo.bankName : "",
        agentbankaccnumber: this.props.userInfo.bankAccountNumber ? this.props.userInfo.bankAccountNumber : "",
        agentbankifscnumber: this.props.userInfo.ifscCode ? this.props.userInfo.ifscCode : "",
        agentbankswiftnumber: this.props.userInfo.swiftCode ? this.props.userInfo.swiftCode : "",
        agentbankbranchnameaddress: this.props.userInfo.bankBranchName ? this.props.userInfo.bankBranchName : "",
        agentaccountholdername: this.props.userInfo.accountHolderName ? this.props.userInfo.accountHolderName : "",
        agencyname: this.props.userInfo.provider.name ? this.props.userInfo.provider.name : "",
        taxType: "CGSTSGST",
        isInclusive: false,
        amountWithoutGST: 0,
        totalAmount: 0,
        isTax1Modified: this.props.quickProposal.isTax1Modified ? this.props.quickProposal.isTax1Modified : false,
        isTax2Modified: this.props.quickProposal.isTax2Modified ? this.props.quickProposal.isTax2Modified : false,
        isTax3Modified: this.props.quickProposal.isTax3Modified ? this.props.quickProposal.isTax3Modified : false,
        isTax4Modified: this.props.quickProposal.isTax4Modified ? this.props.quickProposal.isTax4Modified : false,
        isTax5Modified: this.props.quickProposal.isTax5Modified ? this.props.quickProposal.isTax5Modified : false,
      },
      errors: {},
      staticBRN: "",
      showEditBtn: false,
      showpaxsection: false,
      suppliers: [],
      isSupplierlistLoading: false
    }
  }

  state = this.initialize_State();
  getCustomTaxConfiguration() {
    let environment = JSON.parse(localStorage.getItem("environment"));
    let business = this.props.business;
    if (business === "custom" || business === "transfers" || business === "package")
      business = "activity";
    return environment.customTaxConfigurations.find(x => x.business.toLowerCase() === business.toLowerCase());
  }

  getSupplier = (business) => {
    this.setState({ isSupplierlistLoading: true });

    let businessID = Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business).id;
    if (this.props.business.toLowerCase() === 'transfers' || this.props.business.toLowerCase() === 'package' || this.props.business.toLowerCase() === 'custom')
      businessID = Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business).aliasId;
    let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID + "&providerid=" + this.props.userInfo.agentID;
    if (this.props.userInfo.afUserType) {
      reqURL = reqURL + "&usertype=" + this.props.userInfo.afUserType
    }
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
  handleHotelPax = (hotelPaxInfo) => {
    let data = this.state.data;
    hotelPaxInfo.forEach(element => {
      if (element.roomType === "" || element.roomType === null) {
        element.roomType = "Unnamed";
      }
    });
    data.hotelPaxInfo = hotelPaxInfo;
    this.setState({ data });
  }
  validate = () => {

    const { errors, data } = this.state;

    if (this.props.business === "hotel" || this.props.business === "activity") {
      // if (!this.validateFormData(data.toLocation, "require"))
      //   errors.toLocation = "Location required";
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/))
        errors.toLocation = "< and > characters not allowed";
      else
        delete Object.assign(errors)["toLocation"];
      // if (!this.validateFormData(data.name, "require")) errors.name = "Name required";
      if (data.name && !this.validateFormData(data.name, "special-characters-not-allowed", /[<>]/))
        errors.name = "< and > characters not allowed";
      else
        delete Object.assign(errors)["name"];
      if (data.nights && !this.validateFormData(data.nights, "only-numeric"))
        errors.nights = "Please enter no of nights in numeric only";
      else
        delete Object.assign(errors)["nights"];
      if (data.rating && !this.validateFormData(data.rating, "numeric"))
        errors.rating = "Please enter star rating in decimal only";
      else
        delete Object.assign(errors)["rating"];
      //if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
    }

    if (this.props.business === "hotel") {
      //if (!this.validateFormData(data.endDate, "require")) errors.endDate = "Check Out required";
      //if (!this.validateFormData(data.itemType, "require")) errors.itemType = "Room Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else
        delete Object.assign(errors)["itemType"];
      //if (!this.validateFormData(data.noRooms, "require")) errors.noRooms = "No of Rooms required";
      if (data.noRooms && !this.validateFormData(data.noRooms, "only-numeric")) errors.noRooms = "Please enter no of rooms in numeric only";
      else
        delete Object.assign(errors)["noRooms"];
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
      else
        delete Object.assign(errors)["duration"];
      if (data.guests && !this.validateFormData(data.guests, "only-numeric")) errors.guests = "Please enter no of guests in numeric only";
      else
        delete Object.assign(errors)["guests"];
      //if (!this.validateFormData(data.itemType, "require"))
      //  errors.itemType = "Activity Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else
        delete Object.assign(errors)["itemType"];
    }
    if (this.props.business === "transfers") {
      // if (!this.validateFormData(data.fromLocation, "require"))
      //   errors.fromLocation = "Pickup Location required";
      if (data.fromLocation && !this.validateFormData(data.fromLocation, "special-characters-not-allowed", /[<>]/))
        errors.fromLocation = "< and > characters not allowed";
      else
        delete Object.assign(errors)["fromLocation"];
      // if (!this.validateFormData(data.pickupType, "require")) errors.pickupType = "Type required";
      // if (!this.validateFormData(data.toLocation, "require"))
      //   errors.toLocation = "Dropoff Location required";
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/))
        errors.toLocation = "< and > characters not allowed";
      else
        delete Object.assign(errors)["toLocation"];
      if (data.pickupTime && !this.validateFormData(data.pickupTime, "special-characters-not-allowed", /[<>]/))
        errors.pickupTime = "< and > characters not allowed";
      else
        delete Object.assign(errors)["pickupTime"];
      // if (!this.validateFormData(data.dropoffType, "require")) errors.dropoffType = "Type required";
      // if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
      // if (!this.validateFormData(data.duration, "require")) errors.duration = "Start Time required";
      // if (!this.validateFormData(data.guests, "require")) errors.guests = "Guests required";
      if (data.guests && !this.validateFormData(data.guests, "only-numeric")) errors.guests = "Please enter no of guests in numeric only";
      else
        delete Object.assign(errors)["guests"];
      // if (!this.validateFormData(data.itemType, "require"))
      //   if (!this.validateFormData(data.itemType, "require"))
      //     errors.itemType = "Transfers Type required";
      if (data.itemType && !this.validateFormData(data.itemType, "special-characters-not-allowed", /[<>]/))
        errors.itemType = "< and > characters not allowed";
      else
        delete Object.assign(errors)["itemType"];
    }

    if (this.props.business === "air") {
      if (data.fromLocation && !this.validateFormData(data.fromLocation, "special-characters-not-allowed", /[<>]/)) errors.fromLocation = "< and > characters not allowed";
      else
        delete Object.assign(errors)["fromLocation"];
      if (data.toLocation && !this.validateFormData(data.toLocation, "special-characters-not-allowed", /[<>]/)) errors.toLocation = "< and > characters not allowed";
      else
        delete Object.assign(errors)["toLocation"];
      if (data.departAirlineName && !this.validateFormData(data.departAirlineName, "special-characters-not-allowed", /[<>]/)) errors.departAirlineName = "< and > characters not allowed";
      else
        delete Object.assign(errors)["departAirlineName"];
      if (data.returnAirlineName && !this.validateFormData(data.returnAirlineName, "special-characters-not-allowed", /[<>]/)) errors.returnAirlineName = "< and > characters not allowed";
      else
        delete Object.assign(errors)["returnAirlineName"];
    }

    if (!this.validateFormData(data.costPrice, "require")) errors.costPrice = "Cost Price required";
    else
      delete Object.assign(errors)["costPrice"];
    if (!this.validateFormData(data.sellPrice, "require")) errors.sellPrice = "Sell Price required";
    else
      delete Object.assign(errors)["sellPrice"];

    if (isNaN(Number(data.costPrice)) || Number(data.costPrice) <= 0) {
      errors.costPrice = "Cost Price should not be less than or equal to 0";
    }
    else if (isNaN(Number(data.sellPrice)) || Number(data.sellPrice) <= 0) {
      errors.costPrice = "Sell Price should not be less than or equal to 0";
    }
    else
      delete Object.assign(errors)["costPrice"];
    // if (isNaN(Number(data.sellPrice)) || Number(data.sellPrice) <= 0) {
    //   errors.sellPrice = "Sell Price should not be less than or equal to 0";
    // }

    if (this.props.business === "air" && this.props.mode === "Create"
      && Number(data.discountPrice) > 0 && Number(data.markupPrice) > 0 && Number(data.processingFees) > 0
      && Number(data.supplierCostPrice) <= 0 && Number(data.supplierTaxPrice) <= 0) {
      errors.supplierCostPrice = "Supplier Cost Price required";
    }
    let processingFees = isNaN(Number(data.processingFees)) || Number(data.processingFees) ? Number(data.processingFees) : 0;
    let discount = isNaN(Number(data.discountPrice)) || Number(data.discountPrice) ? Number(data.discountPrice) : 0;
    let cgst = isNaN(Number(data.CGSTPrice)) || Number(data.CGSTPrice) ? Number(data.CGSTPrice) : 0;
    let sgst = isNaN(Number(data.SGSTPrice)) || Number(data.SGSTPrice) ? Number(data.SGSTPrice) : 0;
    let igst = isNaN(Number(data.IGSTPrice)) || Number(data.IGSTPrice) ? Number(data.IGSTPrice) : 0;

    if (this.props.mode !== "Edit" && this.props.business !== "air") {
      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < processingFees)
        errors.processingFees = "Processing fee should not be greater than sell price";
      else
        delete Object.assign(errors)["processingFees"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < discount)
        errors.discountPrice = "Discount should not be greater than sell price";
      else
        delete Object.assign(errors)["discountPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < cgst)
        errors.CGSTPrice = "CGST should not be greater than sell price";
      else
        delete Object.assign(errors)["CGSTPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < sgst)
        errors.SGSTPrice = "SGST should not be greater than sell price";
      else
        delete Object.assign(errors)["SGSTPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < igst)
        errors.IGSTPrice = "IGST should not be greater than sell price";
      else
        delete Object.assign(errors)["IGSTPrice"];
    }

    if (data.sellPrice && !this.validateFormData(data.sellPrice, "numeric")) errors.sellPrice = "Please enter sell price in decimal only";
    else
      delete Object.assign(errors)["sellPrice"];

    if (data.conversionRate && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in decimal only";
    else
      delete Object.assign(errors)["conversionRate"];

    if (data.supplierCostPrice && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in decimal only";
    else
      delete Object.assign(errors)["supplierCostPrice"];

    if (data.supplierTaxPrice && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax in decimal only";
    else
      delete Object.assign(errors)["supplierTaxPrice"];

    if (data.markupPrice && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup in decimal only";
    else
      delete Object.assign(errors)["markupPrice"];

    if (data.processingFees && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter processing fee in decimal only";
    else
      delete Object.assign(errors)["processingFees"];

    if (data.discountPrice && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount in decimal only";
    else
      delete Object.assign(errors)["discountPrice"];

    if (data.percentage && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter percentage in decimal only";
    else
      delete Object.assign(errors)["percentage"];

    if (data.CGSTPrice && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST in decimal only";
    else
      delete Object.assign(errors)["CGSTPrice"];

    if (data.SGSTPrice && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST in decimal only";
    else
      delete Object.assign(errors)["SGSTPrice"];

    if (data.IGSTPrice && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST in decimal only";
    else
      delete Object.assign(errors)["IGSTPrice"];

    if (data.tax1 && !this.validateFormData(data.tax1, "numeric")) errors.tax1 = "Please enter tax in decimal only";
    else
      delete Object.assign(errors)["tax1"];

    if (data.tax2 && !this.validateFormData(data.tax2, "numeric")) errors.tax2 = "Please enter tax in decimal only";
    else
      delete Object.assign(errors)["tax2"];

    if (data.tax3 && !this.validateFormData(data.tax3, "numeric")) errors.tax3 = "Please enter tax in decimal only";
    else
      delete Object.assign(errors)["tax3"];

    if (data.tax4 && !this.validateFormData(data.tax4, "numeric")) errors.tax4 = "Please enter tax in decimal only";
    else
      delete Object.assign(errors)["tax4"];

    if (data.tax5 && !this.validateFormData(data.tax5, "numeric")) errors.tax5 = "Please enter tax in decimal only";
    else
      delete Object.assign(errors)["tax5"];

    if (data.brn && !this.validateFormData(data.brn, "special-characters-not-allowed", /[`$&'<>"\[\]/.?]/)) errors.brn = "<,>,$,&,\",[,],/,.,? and ' characters not allowed";
    else
      delete Object.assign(errors)["brn"];

    if (data.vendor && !this.validateFormData(data.vendor, "special-characters-not-allowed", /[<>_]/)) errors.vendor = "< , > , _ characters not allowed";
    else
      delete Object.assign(errors)["vendor"];

    if (data.adult && !this.validateFormData(data.adult, "only-numeric")) errors.adult = "Please enter no of adult in numeric only";
    else
      delete Object.assign(errors)["adult"];

    if (data.child && !this.validateFormData(data.child, "only-numeric")) errors.child = "Please enter no of child in numeric only";
    else
      delete Object.assign(errors)["child"];

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAddManualItem = (isshoweditbtn, removeguestdetails) => {

    let data;
    data = this.handleAddItem(this.props.importItem ? true : false);
    if (!data) {
      return;
    }

    this.setState({ showEditBtn: isshoweditbtn, showPopup: false });
    if (removeguestdetails) {
      delete data.guestdetails;
    }
    if (!isshoweditbtn) {
      data["isshoweditbtn"] = false;
      data["showpaxsection"] = false;
    }
    else {
      data["isshoweditbtn"] = true;
      data["showpaxsection"] = true;
    }
    this.props.handleData(data);
  }

  handleEditManualItem = () => {
    this.handleEditPopup();
  }

  handleAddItem = (Editmode, isVendorvalidate) => {
    let { data, errors } = this.state;
    errors = this.validate();
    if (errors === null)
      errors = {};
    if (this.props.business === "air" && this.props.mode === "Create"
      && (Number(data.discountPrice) > 0 || Number(data.markupPrice) > 0 || Number(data.processingFees) > 0)
      && Number(data.supplierCostPrice) <= 0 && Number(data.supplierTaxPrice) <= 0) {
      errors.supplierCostPrice = "Supplier Cost Price required";
    }
    else {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.isSellPriceReadonly && (isNaN(Number(data.costPrice)) || (!isNaN(Number(data.costPrice)) && Number(data.costPrice) === 0))) {
      errors.costPrice = "Cost Price should not be 0";
    }
    else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0) {
      errors.costPrice = "Cost Price should not be less than 0";
    }
    else {
      delete Object.assign(errors)["costPrice"];
    }
    if (!isNaN(Number(data.sellPrice)) && Number(data.sellPrice) < 0) {
      errors.sellPrice = "Sell Price should not be less than 0";
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
    if (data.processingFees && data.processingFees !== "" && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter agent processing fees in numeric only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.discountPrice && data.discountPrice !== "" && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["discountPrice"];
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

    let processingFees = isNaN(Number(data.processingFees)) || Number(data.processingFees) ? Number(data.processingFees) : 0;
    let discount = isNaN(Number(data.discountPrice)) || Number(data.discountPrice) ? Number(data.discountPrice) : 0;
    let cgst = isNaN(Number(data.CGSTPrice)) || Number(data.CGSTPrice) ? Number(data.CGSTPrice) : 0;
    let sgst = isNaN(Number(data.SGSTPrice)) || Number(data.SGSTPrice) ? Number(data.SGSTPrice) : 0;
    let igst = isNaN(Number(data.IGSTPrice)) || Number(data.IGSTPrice) ? Number(data.IGSTPrice) : 0;
    let tax1 = isNaN(Number(data.tax1)) ? 0 : Number(data.tax1);
    let tax2 = isNaN(Number(data.tax2)) ? 0 : Number(data.tax2);
    let tax3 = isNaN(Number(data.tax3)) ? 0 : Number(data.tax3);
    let tax4 = isNaN(Number(data.tax4)) ? 0 : Number(data.tax4);
    let tax5 = isNaN(Number(data.tax5)) ? 0 : Number(data.tax5);
    let baseamount = ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) + discount) - (cgst + sgst + igst + processingFees + tax1 + tax2 + tax3 + tax4 + tax5);

    if (baseamount < 0) {
      errors.sellPrice = "Sell Price should be greater then sum of processing fee, taxes and discount";
    }
    if (!isNaN(Number(data.sellPrice)) && Number(data.sellPrice) < 0) {
      errors.sellPrice = "Sell Price should not be less than 0";
    }
    else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0
      && this.props.business !== "air" && this.props.mode === "Create") {
      errors.sellPrice = "Cost Price should not be less than 0";
    }
    else {
      delete Object.assign(errors)["sellPrice"];
    }

    if (this.props.mode !== "Edit" && this.props.business !== "air") {
      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < processingFees)
        errors.processingFees = "Processing fee should not be greater than sell price";
      else
        delete Object.assign(errors)["processingFees"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < discount)
        errors.discountPrice = "Discount should not be greater than sell price";
      else
        delete Object.assign(errors)["discountPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < cgst)
        errors.CGSTPrice = "CGST should not be greater than sell price";
      else
        delete Object.assign(errors)["CGSTPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < sgst)
        errors.SGSTPrice = "SGST should not be greater than sell price";
      else
        delete Object.assign(errors)["SGSTPrice"];

      if ((isNaN(Number(data.sellPrice)) || Number(data.sellPrice)) < igst)
        errors.IGSTPrice = "IGST should not be greater than sell price";
      else
        delete Object.assign(errors)["IGSTPrice"];
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

    this.setState({
      errors,
      showPopup: false,
      popupContent: "",
      popupTitle: ""
    });

    if (!Editmode)
      data.uuid = this.generateUUID();

    if (!Editmode) {
      if (this.props.type === "Itinerary") {
        data.startDate = moment(data.startDate)
          .add(data.day - 1, "days")
          .format("MM/DD/YYYY");
        data.endDate = moment(data.startDate).add(data.nights, "days").format("MM/DD/YYYY");

        if (moment(data.departStartDate).format("MM/DD/YYYY") === moment().format("MM/DD/YYYY")) {
          data.departStartDate = moment(data.startDate)
            .add(data.dayDepart - 1, "days")
            .format("MM/DD/YYYY");
          data.departEndDate = moment(data.startDate)
            .add(data.dayDepartEnd - 1, "days")
            .format("MM/DD/YYYY");

          data.returnStartDate = moment(data.startDate)
            .add(data.dayReturn - 1, "days")
            .format("MM/DD/YYYY");
          data.returnEndDate = moment(data.startDate)
            .add(data.dayReturnEnd - 1, "days")
            .format("MM/DD/YYYY");
        } else {
          data.departStartDate = moment(data.departStartDate)
            .add(data.dayDepart - 1, "days")
            .format("MM/DD/YYYY");
          data.departEndDate = moment(data.departStartDate)
            .add(data.dayDepartEnd - 1, "days")
            .format("MM/DD/YYYY");

          data.returnStartDate = moment(data.departStartDate)
            .add(data.dayReturn - 1, "days")
            .format("MM/DD/YYYY");
          data.returnEndDate = moment(data.startDate)
            .add(data.dayReturnEnd - 1, "days")
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
    if (Editmode && this.props.type === "Itinerary") {
      if (quotationInfo.startDate) {
        data.startDate = moment(quotationInfo.startDate).add(parseInt(data.day) - 1, "days").format('YYYY-MM-DD');
      }
      if (quotationInfo.endDate) {
        data.endDate = moment(data.startDate).add(parseInt(data.nights), "days").format('YYYY-MM-DD');
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
        data.returnEndDate = moment(quotationInfo.startDate).add(parseInt(data.dayReturnEnd) - 1, "days").format('YYYY-MM-DD');
      }
    }

    if (isNaN(parseFloat(data.costPrice)) || parseFloat(data.costPrice) === 0) data.costPrice = 1;
    if (isNaN(parseFloat(data.sellPrice)) || parseFloat(data.sellPrice) === 0) data.sellPrice = 1;
    if (data.sellPrice === 1 && data.costPrice === 1) {
      //&& (isNaN(parseFloat(data.totalAmount)) || parseFloat(data.totalAmount) === 0)
      if (Number(data.CGSTPrice) === 0 && Number(data.SGSTPrice) === 0 && Number(data.IGSTPrice) === 0) {
        data.totalAmount = 1;
      }
    }
    return data;
  };

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    let days = moment(endDate).diff(startDate, "days");
    let nights = days;
    newData.nights = nights;

    this.setState({ data: newData });
  };

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

  validateBRN = tmpBRN => {
    const errors = {};
    const { data } = this.state;

    if (data.brn) {
      const quotationInfo = JSON.parse(localStorage.getItem("ManualInvoiceItems"));
      if (quotationInfo && quotationInfo.filter(x => x.offlineItem.uuid !== this.state.data.uuid
        && x.offlineItem.brn
        && x.offlineItem.brn.toLowerCase() === tmpBRN.toLowerCase()).length > 0)
        errors.brn = "Confirmation Number should be unique per Invoice.";
    }
    this.setState({ errors });
    return Object.keys(errors).length === 0 ? null : errors;
  }

  setDates = () => {
    let newData = { ...this.state.data };
    //let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    newData.startDate = this.props.quickProposal.startDate ? this.props.quickProposal.startDate : new Date();
    newData.endDate = this.props.quickProposal.endDate ? this.props.quickProposal.endDate : new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    newData.departStartDate = new Date();
    newData.departEndDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    newData.returnStartDate = newData.departEndDate;
    newData.returnEndDate = newData.returnStartDate;
    let days = moment(newData.endDate).diff(newData.startDate, "days");
    newData.nights = days;
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
    item.isSellPriceReadonly = (item.conversionRate || item.supplierCostPrice || item.supplierTaxPrice || item.costPrice || item.markupPrice || item.processingFees || item.discountPrice) ? true : false;
    if (this.props.mode === "Create") {
      item.isSellPriceReadonly = false;
    }
    if (this.props.mode === "Edit" && Number(item.supplierCostPrice) === 0 && Number(item.supplierTaxPrice) === 0) {
      item.supplierCostPrice = Number(item.costPrice);
    }
    if (item.business === "custom") {
      if (itemTypeList.find(x => x.value === item.itemType) === undefined) {
        item.customitemType = "Other";
        item.otherType = item.itemType;
      }
    }

    item.description = item.description.replaceAll('<br/>', '\n');
    data = item;
    this.setState({ data, editMode: true });
  };

  componentDidMount() {
    if (this.props.quickProposal.sellPrice) {
      this.handleTaxQuoationoData(this.props.quickProposal);
    }
    if (!this.props.importItem)
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
  handleTaxQuoationoData = (taxdata) => {
    debugger;
    let data = this.state.data;
    data.taxType = taxdata.taxType;
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
    this.setState({ data }, () => this.handleAmountFields(0, { target: { name: "", value: "" } }));
  }

  handleAmountFields = (value, e) => {

    let data = this.state.data;
    let costPrice = 0;
    let tmpSellPrice = data.sellPrice;
    let conversionRate = isNaN(Number(data.conversionRate)) ? 1 : data.conversionRate === "" ? 1 : Number(data.conversionRate);
    let supplierTaxPrice = isNaN(Number(data.supplierTaxPrice)) ? 0 : Number(data.supplierTaxPrice) * conversionRate;
    let supplierCostPrice = isNaN(Number(data.supplierCostPrice)) ? 0 : Number(data.supplierCostPrice) * conversionRate;
    let markupPrice = isNaN(Number(data.markupPrice)) ? 0 : Number(data.markupPrice);
    let processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
    let discountPrice = isNaN(Number(data.discountPrice)) ? 0 : Number(data.discountPrice);
    let CGSTPrice = isNaN(Number(data.CGSTPrice)) ? 0 : Number(data.CGSTPrice);
    let SGSTPrice = isNaN(Number(data.SGSTPrice)) ? 0 : Number(data.SGSTPrice);
    let IGSTPrice = isNaN(Number(data.IGSTPrice)) ? 0 : Number(data.IGSTPrice);
    let percentage = isNaN(Number(data.percentage))
      ? (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"))
      : Number(data.percentage);
    let tax1 = isNaN(Number(data.tax1)) ? 0 : Number(data.tax1);
    let tax2 = isNaN(Number(data.tax2)) ? 0 : Number(data.tax2);
    let tax3 = isNaN(Number(data.tax3)) ? 0 : Number(data.tax3);
    let tax4 = isNaN(Number(data.tax4)) ? 0 : Number(data.tax4);
    let tax5 = isNaN(Number(data.tax5)) ? 0 : Number(data.tax5);
    let taxType = data.taxType;
    let sellPrice = isNaN(Number(data.sellPrice)) ? 0 : Number(data.sellPrice);
    let totalAmount = isNaN(Number(data.totalAmount)) ? 0 : Number(data.totalAmount);
    let amountWithoutGST = isNaN(Number(data.amountWithoutGST)) ? 0 : Number(data.amountWithoutGST);
    let isInclusive = data.isInclusive;
    costPrice = (supplierCostPrice + supplierTaxPrice);
    if (e && e.target.name !== "sellPrice" && supplierTaxPrice === 0 && supplierCostPrice === 0) {
      costPrice = 0;
    }
    let isSellPriceReadonly = false;
    isSellPriceReadonly = supplierCostPrice > 0 || supplierTaxPrice > 0 || markupPrice > 0 || processingFees > 0 || discountPrice > 0;
    let business = this.props.business;
    let isCustom = (business === "custom" &&
      this.state.data.customitemType === "Visa"
      || this.state.data.customitemType === "Rail"
      || this.state.data.customitemType === "Forex"
      || this.state.data.customitemType === "Rent a Car");
    let amountToCalculateGST = 0;
    let amountToCalculateTax = 0;
    amountToCalculateTax = costPrice + markupPrice + processingFees - discountPrice;
    if (business === 'hotel' || business === 'transfers') {
      //amountToCalculateGST = processingFees > 0 ? processingFees : Number(sellPrice) - (tax1 + tax2 + tax3 + tax4 + tax5);
      amountToCalculateGST = processingFees > 0 ? processingFees : isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice);
    }
    else if (business === 'custom') {
      data.customitemType === 'Visa' ||
        data.customitemType === 'Rail' ||
        data.customitemType === 'Forex' ||
        data.customitemType === 'Rent a Car' ? amountToCalculateGST = processingFees
        //: amountToCalculateGST = Number(sellPrice) - (tax1 + tax2 + tax3 + tax4 + tax5);
        : amountToCalculateGST = Number(isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice));
    }
    else {
      amountToCalculateGST = processingFees;
    }
    if (isSellPriceReadonly) {
      //if (supplierCostPrice > 0 || supplierTaxPrice > 0 || markupPrice > 0 || processingFees > 0 || discountPrice > 0) {
      sellPrice = Number(Number((costPrice + markupPrice + processingFees) - discountPrice).toFixed(2));
      // sellPrice = this.removeNNumber(sellPrice);

      if ((business === "air" || business === "activity" || isCustom) && processingFees === 0 && sellPrice > 0) {
        CGSTPrice = 0;
        SGSTPrice = 0;
        IGSTPrice = 0;
        amountWithoutGST = 0;
        totalAmount = 0;
      }
      if (!isInclusive) {
        // Inclusive
        totalAmount = 0;
        if (processingFees > 0) {
          sellPrice = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
          totalAmount = 0;
          tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
          tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
          tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
          tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
          tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
          totalAmount = (Number(sellPrice) + Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2)));
        }
        //Case : sell price
        else if (processingFees === 0) {
          if (percentage > 0) {
            let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
            CGSTPrice = tmpData.CGST;
            SGSTPrice = tmpData.SGST;
            IGSTPrice = tmpData.IGST;
            /* 
            let percentage = isNaN(Number(data.percentage)) ? 0 : Number(data.percentage);
            let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
            let IGSTPrice = (amountToCalculateGST * percentage) / 100;  //  calculate price for IGST
            let CGSTSGSTPrice = (amountToCalculateGST * CGSTSGST) / 100; // calculate price for CGST & SGST
            if (data.taxType !== "IGST") {
              IGSTPrice = 0;
              CGSTPrice = CGSTSGSTPrice;
              SGSTPrice = CGSTSGSTPrice;
            } */
          }
          else {
            CGSTPrice = Number(data.CGSTPrice);
            SGSTPrice = Number(data.SGSTPrice);
            IGSTPrice = Number(data.IGSTPrice);
          }
          tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
          tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
          tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
          tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
          tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);

          totalAmount = Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice);
          totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
          totalAmount = this.removeNNumber(totalAmount);
          if (totalAmount === sellPrice)
            totalAmount = 0;
        }
        else {
          totalAmount = 0;
        }
      }
      else {
        // Inclusive
        totalAmount = 0;
        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
        totalAmount = Number(sellPrice) + Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
      }
    }
    else if (sellPrice > 0 && costPrice === 0 && markupPrice === 0 && processingFees === 0 && discountPrice === 0) {
      costPrice = sellPrice;
      amountToCalculateTax = sellPrice;
      if ((business === "air" || business === "activity" || isCustom) && processingFees === 0 && sellPrice > 0) {
        CGSTPrice = 0;
        SGSTPrice = 0;
        IGSTPrice = 0;
        if (isInclusive) {
          amountWithoutGST = 0;
          totalAmount = 0;
        }
      }
      if (!isInclusive) {
        totalAmount = 0;
        if (percentage > 0) {
          let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
          CGSTPrice = tmpData.CGST;
          SGSTPrice = tmpData.SGST;
          IGSTPrice = tmpData.IGST;
        }
        totalAmount = sellPrice + CGSTPrice + SGSTPrice + IGSTPrice;
        totalAmount = this.removeNNumber(totalAmount);

        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
        totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
        if (totalAmount === sellPrice)
          totalAmount = 0;
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
    // else if (sellPrice === 0 && (tax1 + tax2 + tax3 + tax4 + tax5) > 0) {
    //   sellPrice += (tax1 + tax2 + tax3 + tax4 + tax5);
    // }

    data.markupPrice = isNaN(Number(data.markupPrice)) ? 0 : Number(data.markupPrice);
    data.processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
    data.discountPrice = isNaN(Number(data.discountPrice)) ? 0 : Number(data.discountPrice);
    data.isSellPriceReadonly = isSellPriceReadonly;
    data.costPrice = costPrice;
    data.sellPrice = sellPrice;
    data.totalAmount = Number(totalAmount.toFixed(2))
    data.CGSTPrice = CGSTPrice;
    data.SGSTPrice = SGSTPrice;
    data.IGSTPrice = IGSTPrice;
    data.percentage = percentage;
    data.tax1 = tax1;
    data.tax2 = tax2;
    data.tax3 = tax3;
    data.tax4 = tax4;
    data.tax5 = tax5;
    data.taxType = taxType;
    data.amountWithoutGST = amountWithoutGST;

    if (CGSTPrice === 0 && SGSTPrice === 0 && IGSTPrice === 0) {
      data.isInclusive = false;
      //data.taxType = "";
    }
    this.setState({ data });
  }

  getCustomTaxAmount = (purpose, business, amountToCalculate, isTaxModified, currentAmount) => {
    if (isTaxModified) return currentAmount;
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

  removeNNumber = (input) => {

    if (Number(input).toString().indexOf('.') === -1)
      return Number(input);
    else if (Number(input).toString().split('.')[1].length > 2)
      return Number(Number(input).toFixed(2));
    else
      return Number(Number(input).toFixed(2));
  }
  setFocusOnVendor = () => {

    this.setState({
      showPopup: false,
      popupContent: "",
      popupTitle: ""
    });
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
      </div>

    });
  };

  handleEditPopup = () => {

    this.setState({
      popupTitle: this.state.showPopup ? "" : "Edit",
      showPopup: !this.state.showPopup,
      popupContent: this.state.showPopup ? "" : <div>
        <div>Guest details will be removed.</div>
        <button
          className="btn btn-primary pull-right m-1 "
          onClick={() => this.handleAddManualItem(false, true)}
        >
          {Trans("Ok")}
        </button>

        <button
          className="btn btn-primary pull-right m-1 "
          onClick={() => this.handleEditPopup()}
        >
          {Trans("Cancel")}
        </button>
      </div>

    });
  };



  Rs = (amount) => {
    var words = new Array();
    words[0] = 'Zero';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    var op;
    amount = amount.toString();
    var atemp = amount.split('.');
    var number = atemp[0].split(',').join('');
    var n_length = number.length;
    var words_string = '';
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      var value = '';
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + ' ';
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Crores ';
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Lakhs ';
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Thousand ';
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += 'Hundred ';
        } else if (i == 6 && value != 0) {
          words_string += 'Hundred ';
        }
      }
      words_string = words_string.split(' ').join(' ');
    }
    return words_string;
  }

  RsPaise = (n) => {
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    let { currencyName, decimalCurrencyName } = DropdownList.CurrencyList.find(x => x.ISOCode === portalCurrency);

    var nums = n.toString().split('.')
    var whole = this.Rs(nums[0])
    if (nums[1] == null) nums[1] = 0;
    if (nums[1].length == 1) nums[1] = nums[1] + '0';
    if (nums[1].length > 2) {
      nums[1] = nums[1].substring(2, nums[1].length - 1)
    }
    if (nums.length == 2) {
      if (nums[0] <= 9) {
        nums[0] = nums[0] * 10
      } else {
        nums[0] = nums[0]
      };
      var fraction = this.Rs(nums[1])
      var op = '';
      if (whole == '' && fraction == '') {
        op = 'Zero only';
      }
      if (whole == '' && fraction != '') {
        op = ' ' + fraction + ' ' + decimalCurrencyName + ' only';
      }
      if (whole != '' && fraction == '') {
        op = currencyName + ' ' + whole + ' only';
      }
      if (whole != '' && fraction != '') {
        op = currencyName + ' ' + whole + 'and ' + fraction + ' ' + decimalCurrencyName + ' only';
      }
      var amt = n;
      if (amt > 999999999.99) {
        op = 'Oops!!! The amount is too big to convert';
      }
      if (isNaN(amt) == true) {
        op = 'Error : Amount in number appears to be incorrect. Please Check.';
      }
      return op;
    }
  }

  EnglishFromNumber = (number) => {

    number = Number(number);
    var currencyNames = ['Indian Rupee', 'Paisa'];

    var MajorCurrency = currencyNames[0];
    var MinorCurrency = currencyNames[1];

    let num = number;
    var numParts = num.toString().split('.');

    if (numParts.length === 1) {
      return this.renderEnglishFromNumber(number, false) + "" + MajorCurrency;
    }
    else {
      var finalNumber = this.renderEnglishFromNumber((numParts[0]), false) + "And" + ((parseInt(numParts[1]) > 0) ? (" " + this.renderEnglishFromNumber((numParts[1]), true) + " " + MinorCurrency) : "") + " Only";
      return finalNumber;
    }
  }

  renderEnglishFromNumber = (number, frompaisa) => {
    if (number === 0) {
      return onesMapping[number];
    }

    var retVal = "";
    var group = 0;
    while (number > 0) {
      var numberToProcess = Math.round((number % 1000));
      number = Math.round(number / 1000);
      var groupDescription = this.ProcessGroup(numberToProcess);
      if (groupDescription !== null) {
        if (group > 0) {
          retVal = groupMapping[group] + " " + retVal;
        }
        retVal = groupDescription + " " + retVal;
      }

      group++;
    }

    return retVal;
  }

  ProcessGroup = (number) => {
    var tens = number % 100;
    var hundreds = Math.round(number / 100);

    var retVal = "";
    if (hundreds > 0) {
      retVal = onesMapping[hundreds] + " " + groupMapping[0];
    }
    if (tens > 0) {
      if (tens < 20) {
        retVal += ((retVal !== "") ? " " : "") + onesMapping[tens];
      }
      else {
        var ones = tens % 10;
        tens = (tens / 10) - 2; // 20's offset

        retVal += ((retVal !== "") ? "" : "") + tensMapping[tens];

        if (ones > 0) {
          retVal += ((retVal !== "") ? "" : "") + onesMapping[ones];
        }
      }
    }

    return retVal;
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    let newimportItem = this.props.importItem;
    let previmportItem = prevProps.importItem;
    if (!newimportItem && previmportItem) {
      this.setState(this.initialize_State());
    }
    else if (newimportItem && !previmportItem) {
      this.componentDidMount();
    }
    else if (newimportItem && previmportItem && JSON.stringify(newimportItem) !== JSON.stringify(previmportItem)) { //!this.isEqualsJson(newimportItem, previmportItem)
      this.componentDidMount();
    }

  };

  isEqualsJson = (obj1, obj2) => {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    //return true when the two json has same length and all the properties has same value key by key
    return keys1.length === keys2.length && Object.keys(obj1).every(key => obj1[key] == obj2[key]);
  }

  handleOnDateChange = () => {

    let data = this.state.data;
    if (moment(data.startDate).diff(moment(data.endDate), 'days') > 0) {
      data.endDate = moment(data.startDate).add(1, "d").format(Global.DateFormate);
      this.setState({ data });
    }
  };

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
    const { type } = this.props;
    let business = this.props.business;
    //let count = 1;
    //const duration = [...Array(count).keys()];
    let days = [];
    //let nights = this.state.data.nights;
    let daysReturn = [];
    //let departStartdays = [];
    let departEnddays = [];
    let returndepartStartdays = [];
    let returnEnddays = [];
    //departStartdays = days;
    if (business === "air") {
      days.map((item) => {
        if (parseInt(item.value) === parseInt(this.state.data.dayDepart) || parseInt(item.value) > parseInt(this.state.data.dayDepart)) {
          departEnddays.push(item);
        }
        return true;
      });
      daysReturn.map((item, cnt) => {
        if (cnt === 0) {
          returndepartStartdays.push(item);
        }
        return true;
      });

      daysReturn.map((item) => {
        if (parseInt(item.value) === parseInt(this.state.data.dayReturn) || parseInt(item.value) > parseInt(this.state.data.dayReturn)) {
          returnEnddays.push(item);
        }
        return true;
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
    let ViewInDisabled = false;
    if (this.state.showEditBtn)
      ViewInDisabled = true;

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
      <React.Fragment>
        <div class="border-bottom bg-light d-flex p-3">
          <div class="mr-auto d-flex align-items-center">
            <SVGIcon
              name={"file-text"}
              className="mr-2 d-flex align-items-center"
              width="24"
              type="fill"
            ></SVGIcon>
            <h6 class="font-weight-bold m-0 p-0">Item Details</h6>
          </div>
        </div>
        <div className="p-3" key={this.props.key}>
          {this.props.mode !== "Edit" &&
            <div className="row">
              <div className="col-lg-12">
                {/* <span class="d-block text-primary mb-2">Item Details</span> */}
              </div>
              {(business === "hotel" || business === "activity") && (
                <React.Fragment>
                  <div className="col-lg-4">
                    {this.renderInput("name", business === "hotel" ? "Hotel Name" : "Activity Name", "", ViewInDisabled ? true : false)}
                  </div>
                  <div className="col-lg-3">{this.renderInput("toLocation", "Address / Location", "", ViewInDisabled ? true : false)}</div>
                </React.Fragment>
              )}

              {business === "hotel" && (
                <React.Fragment>
                  {true && (
                    <React.Fragment>
                      <div className="col-lg-2">
                        <DateRangePicker
                          isValid={this.props.datesIsValid}
                          cutOfDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
                          stayInDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays}
                          minDate={moment("2001-01-01").format(Global.DateFormate)}
                          minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                          maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                          isSingleDateRangePicker={true}
                          handleDateChange={this.handleStartDate}
                          isBoth={true}
                          checklabelName={"checkin"}
                          dates={
                            { checkInDate: this.state.data.dates.checkInDate }
                          }
                          business={business}
                          readOnly={ViewInDisabled ? true : false}
                        />
                      </div>
                      <div className="col-lg-2">
                        <DateRangePicker
                          isValid={this.props.datesIsValid}
                          cutOfDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
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
                          readOnly={ViewInDisabled ? true : false}
                        />
                      </div>
                    </React.Fragment>
                  )}

                  {business !== 'hotel' &&
                    <React.Fragment>
                      <div className="col-lg-2 text-nowrap">
                        {this.renderInput("noRooms", "No of Rooms", "", ViewInDisabled ? true : false)}
                      </div>
                      <div className="col-lg-2">{this.renderInput("itemType", "Room Type", "", ViewInDisabled ? true : false)}</div>
                    </React.Fragment>
                  }

                  <HotelPaxWidget
                    //key={this.state.data.hotelPaxInfo}
                    handlePax={this.handleHotelPax}
                    isValid={"valid"}//this.props.paxIsValid
                    roomDetails={this.state.data.hotelPaxInfo}//this.props.pax
                    totalNoOfAdult={0}//this.props.totalNoOfAdult
                    totalNoOfChild={0}//this.props.totalNoOfChild
                    ishandleRoomType={true}
                    readOnly={ViewInDisabled ? true : false}
                  />

                  {/* <div className="col-lg-2">{this.renderSelect("mealType", "Meal Type", mealSelection, undefined, undefined, ViewInDisabled ? true : false)}</div> */}
                </React.Fragment>
              )}

              {business === "activity" && (
                <React.Fragment>
                  {true && (
                    <div className="col-lg-2">
                      {this.renderSingleDate("startDate", "Date", this.state.data.startDate, moment("2001-01-01").format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false)}
                    </div>
                  )}

                  {type === "Itinerary" && (
                    <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}</div>
                  )}

                  <div className="col-lg-2">
                    {!this.props.importItem && this.renderSelect("duration", "Duration", durationList, undefined, undefined, ViewInDisabled ? true : false)}
                    {this.props.importItem && this.renderInput("duration", "Duration", "", ViewInDisabled ? true : false)}
                  </div>

                  <div className="col-lg-2">{this.renderInput("guests", "No of Guests", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-4">{this.renderInput("itemType", "Activity Type", "", ViewInDisabled ? true : false)}</div>
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
                            onChange={ViewInDisabled ? "" : () => this.changeairTripType()}
                          />
                          <label>{Trans("_airTripDirection_Roundtrip")}</label>
                        </li>
                        <li>
                          <input
                            value="OneWay"
                            name="Direction"
                            type="radio"
                            checked={!this.state.data.isRoundTrip}
                            onChange={ViewInDisabled ? "" : () => this.changeairTripType()}
                          />
                          <label>{Trans("_airTripDirection_Oneway")}</label>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-5" id="fromLocation">
                    <label htmlFor="fromLocation">
                      {Trans("_widget" + business + "FromLocationTitle")}
                    </label>
                    <AutoComplete
                      isValid="valid"
                      businessName={business}
                      handleLocation={this.setFromLocation}
                      mode="From"
                      selectedOptions={this.state.data.fromLocationFlight && this.state.data.fromLocationFlight.id
                        ? [this.state.data.fromLocationFlight]
                        : []}
                    />
                  </div>

                  <div className="col-lg-5" id="toLocation">
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

                  <div className="col-lg-12">
                    {this.state.data.isRoundTrip && (
                      <span className="d-block text-primary mb-2">Enter Departure Flight Details</span>
                    )}
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="row">
                          {true && (
                            <div className="col-lg-7">
                              {this.renderSingleDate(
                                "departStartDate",
                                "Depart Date",
                                this.state.data.departStartDate,
                                moment("2001-01-01").format('YYYY-MM-DD')
                                , undefined, ViewInDisabled ? true : false
                              )}
                            </div>
                          )}

                          {type === "Itinerary" && (
                            <div className="col-lg-7">
                              {this.renderSelect("dayDepart", "Depart Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                            </div>
                          )}

                          <div className="col-lg-5">
                            <div class="form-group departStartTime">
                              <label for="departStartTime">Depart Time</label>
                              <TimeField
                                class="form-control w-100"
                                name="departStartTime"
                                input={ViewInDisabled ? <input type="text" value={this.state.data.departStartTime} disabled /> : null}
                                value={this.state.data.departStartTime}
                                onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          {true && (
                            <div className="col-lg-7">
                              {this.renderSingleDate(
                                "departEndDate",
                                "Arrival Date",
                                this.state.data.departEndDate,
                                this.state.data.departStartDate
                                , undefined, ViewInDisabled ? true : false
                              )}
                            </div>
                          )}

                          {type === "Itinerary" && (
                            <div className="col-lg-7">
                              {this.renderSelect("dayDepartEnd", "Arrival Day", departEnddays, undefined, undefined, ViewInDisabled ? true : false)}
                            </div>
                          )}

                          {/* <div className="col-lg-5">
                        {this.renderInput("departEndTime", "Arrival Time")}
                      </div> */}
                          <div className="col-lg-5">
                            <div class="form-group departEndTime">
                              <label for="departEndTime">Arrival Time</label>
                              <TimeField
                                class="form-control w-100"
                                name="departEndTime"
                                input={ViewInDisabled ? <input type="text" value={this.state.data.departEndTime} disabled /> : null}
                                value={this.state.data.departEndTime}
                                onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          <div className="col-lg-6" id="departAirlineName">
                            <label htmlFor="airline name">{Trans("Airline Name")}</label>
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
                            {this.renderInput("departFlightNumber", "Flight Number", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          <div className="col-lg-5">{this.renderInput("departClass", "Class", "", ViewInDisabled ? true : false)}</div>
                          <div className="col-lg-4">
                            {this.renderDuration(["departDurationH", "departDurationM"], "Duration", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-3">
                            {/* {this.renderInput("departStops", "Stops", "", ViewInDisabled ? true : false)} */}
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
                            {true && (
                              <div className="col-lg-7">
                                {this.renderSingleDate(
                                  "returnStartDate",
                                  "Depart Date",
                                  this.state.data.returnStartDate,
                                  this.state.data.departEndDate
                                  , undefined, ViewInDisabled ? true : false
                                )}
                              </div>
                            )}

                            {type === "Itinerary" && (
                              <div className="col-lg-7">
                                {this.renderSelect("dayReturn", "Depart Day", returndepartStartdays, undefined, undefined, ViewInDisabled ? true : false)}
                              </div>
                            )}

                            <div className="col-lg-5">
                              <div class="form-group returnStartTime">
                                <label for="returnStartTime">Depart Time</label>
                                <TimeField
                                  class="form-control w-100"
                                  input={ViewInDisabled ? <input type="text" value={this.state.data.returnStartTime} disabled /> : null}
                                  name="returnStartTime"
                                  value={this.state.data.returnStartTime}
                                  onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            {true && (
                              <div className="col-lg-7">
                                {this.renderSingleDate(
                                  "returnEndDate",
                                  "Arrival Date",
                                  this.state.data.returnEndDate,
                                  this.state.data.returnStartDate
                                  , undefined, ViewInDisabled ? true : false
                                )}
                              </div>
                            )}

                            {type === "Itinerary" && (
                              <div className="col-lg-7">
                                {this.renderSelect("dayReturnEnd", "Arrival Day", daysReturn, undefined, undefined, ViewInDisabled ? true : false)}
                              </div>
                            )}
                            <div className="col-lg-5">
                              <div class="form-group returnEndTime">
                                <label for="returnEndTime">Arrival Time</label>
                                <TimeField
                                  class="form-control w-100"
                                  input={ViewInDisabled ? <input type="text" value={this.state.data.returnEndTime} disabled /> : null}
                                  name="returnEndTime"
                                  value={this.state.data.returnEndTime}
                                  onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            <div className="col-lg-6" id="returnAirlineName">
                              <label htmlFor="airline name">{Trans("Airline Name")}</label>
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
                              {this.renderInput("returnFlightNumber", "Flight Number", "", ViewInDisabled ? true : false)}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            <div className="col-lg-5">{this.renderInput("returnClass", "Class", "", ViewInDisabled ? true : false)}</div>
                            <div className="col-lg-4">
                              {this.renderDuration(["returnDurationH", "returnDurationM"], "Duration", ViewInDisabled ? true : false)}
                            </div>
                            <div className="col-lg-3">
                              {/* {this.renderInput("returnStops", "Stops", "", ViewInDisabled ? true : false)} */}
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
                      <div className="col-lg-4">{this.renderInput("adult", "Adult", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-4">{this.renderInput("child", "Child", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-4">{this.renderInput("infant", "Infant", "", ViewInDisabled ? true : false)}</div>
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
                            {this.renderInput("fromLocation", "Pick-up Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("pickupType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="row">
                          <div className="col-lg-12">
                            {this.renderInput("toLocation", "Drop-off Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
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
                            {this.renderInput("fromLocation", "Pick-up Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("pickupType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="row">
                          <div className="col-lg-12">
                            {this.renderInput("toLocation", "Drop-off Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  <div className="col-lg-4">
                    <div className="row">
                      {true && (
                        <div className="col-lg-6">
                          {this.renderSingleDate(
                            "startDate",
                            "Transfers Date",
                            this.state.data.startDate,
                            moment("2001-01-01").format('YYYY-MM-DD')
                            , undefined, ViewInDisabled ? true : false
                          )}
                        </div>
                      )}

                      {type === "Itinerary" && (
                        <div className="col-lg-6">
                          {this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}

                      {!this.props.importItem && (
                        <div className="col-lg-6 text-nowrap">
                          {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}

                      {this.props.importItem && (
                        <div className="col-lg-6 text-nowrap">
                          {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-8 text-nowrap">
                        {this.renderInput("itemType", "Vehicle Type (eg. Bus, Sedan)")}
                      </div>
                      <div className="col-lg-4">{this.renderInput("guests", "No of Guests", "", ViewInDisabled ? true : false)}</div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {business === "custom" && (
                <React.Fragment>
                  <div className="col-lg-2">{this.renderInput("toLocation", "Location", "", ViewInDisabled ? true : false)}</div>
                  <div className="col-lg-2">{this.renderInput("name", "Item Name", "", ViewInDisabled ? true : false)}</div>
                  <div className="col-lg-2">
                    {this.renderSingleDate("startDate", "From Date", this.state.data.startDate, moment("2001-01-01").format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false, this.handleOnDateChange)}
                  </div>
                  <div className="col-lg-2">
                    {this.renderSingleDate("endDate", "To Date", this.state.data.endDate, moment(this.state.data.startDate).format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false)}
                  </div>
                  {type === "Itinerary" && (
                    <div className="col-lg-3">
                      {this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                    </div>
                  )}

                  <div className="col-lg-2">
                    {this.renderSelect("customitemType", "Item Type (eg. Restaurant)", itemTypeList, undefined, undefined, ViewInDisabled ? true : false)}
                  </div>

                  {(this.state.data.customitemType === "Other") &&
                    <div className="col-lg-3">
                      {this.renderInput("otherType", "Other", "", ViewInDisabled ? true : false)}
                    </div>
                  }

                  {(this.state.data.customitemType === "Package") &&
                    <React.Fragment>
                      <div className="col-lg-1">{this.renderInput("adult", "Adult", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-1">{this.renderInput("child", "Child", "", ViewInDisabled ? true : false)}</div>
                    </React.Fragment>
                  }
                </React.Fragment>
              )}
              <div className="col-lg-12">
                <span class="d-block text-primary mb-2 border-bottom mb-3 pb-2">Price Details</span>
              </div>

              <React.Fragment>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-2">
                      {this.renderSelect("supplierCurrency", "Supplier Currency", currencyList, undefined, undefined, ViewInDisabled ? true : false)}
                    </div>

                    <div className="col-lg-2">
                      {this.renderInput("conversionRate", "Conversion Rate", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                    </div>
                    <div className="col-lg-2">
                      {this.renderInput("supplierCostPrice", "Supplier Cost Price", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                    </div>
                    <div className="col-lg-2">
                      {this.renderInput("supplierTaxPrice", "Supplier Tax", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                    </div>
                    <div className="col-lg-2">
                      {this.renderInput("costPrice", "Agent Cost Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : true)}
                    </div>
                    <div className="col-lg-2">
                      {this.renderInput("markupPrice", "Agent Markup", "", ViewInDisabled ? true : false, this.handleAmountFields)}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row">

                    <div className="col-lg-2">
                      {this.renderInput("discountPrice", "Discount", "", ViewInDisabled ? true : false, this.handleAmountFields)}
                    </div>
                    <TaxQuotationAddOffline
                      key={this.state.editMode === undefined ? false : this.state.editMode}
                      business={business}
                      handleTaxQuoationoData={this.handleTaxQuoationoData}
                      data={this.state.data}
                      errors={this.state.errors}
                      ViewInDisabled={ViewInDisabled}
                    />
                    <div className="col-lg-2">
                      {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                    </div>
                    {this.state.data.isInclusive && this.state.data.sellPrice > 0 && Number(this.state.data.processingFees) === 0 && Number(this.state.data.amountWithoutGST) > 0 &&
                      <div className="col-lg-2">
                        <div className="form-group amountWithoutGST">
                          <label for="amountWithoutGST">Sell Price (Without GST)</label>
                          <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={this.state.data.amountWithoutGST} />
                        </div>
                      </div>
                    }
                    {Number(this.state.data.totalAmount) > 0 &&
                      <div className={"col-lg-2"}>
                        {this.renderInput("totalAmount", "Total Amount (" + portalCurrency + ")", "text", true)}
                      </div>
                    }
                    {(Number(this.state.data.totalAmount) > 0 || Number(this.state.data.sellPrice) > 0) &&
                      <div className="col-lg-2" style={{ "align-items": "center", display: "flex" }}>
                        <div class="">
                          <label for="amount for">{this.RsPaise(Number(this.state.data.totalAmount) > 0 ? Number(this.state.data.totalAmount) : Number(this.state.data.sellPrice))}</label>
                        </div>
                      </div>}
                  </div>
                </div>
              </React.Fragment>

              <div className="col-lg-12">
                <div className="row pull-right mt-2 mb-2">
                  <div className="col-lg-12">
                    <button class="btn btn-link p-0 m-0 text-primary" onClick={this.handleShowHideTax}>
                      {this.state.data.isShowTax ? "Hide" : "Show"} more
                    </button>
                  </div>
                </div>
              </div>

              {this.state.data.isShowTax &&
                <div className="col-lg-12">
                  <div className="row">

                    <div className="col-lg-2">{this.renderInput("brn", "Confirmation Number", "", ViewInDisabled ? true : false, this.validateBRN)}</div>

                    <div className="col-lg-2">{this.renderInput("agentaccountholdername", "Account Holder Name", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agentbankname", "Agent Bank Name", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agentbankaccnumber", "Agent Bank Account No", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agentbankifscnumber", "Agent Bank IFSC", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agentbankswiftnumber", "Agent Bank SWIFT Code", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agentbankbranchnameaddress", "Branch Name/Address", "", ViewInDisabled ? true : false)}</div>

                    <div className="col-lg-2">{this.renderInput("agencyname", "Agency Name", "", ViewInDisabled ? true : false)}</div>
                  </div>
                </div>
              }

              <div className="col-lg-10">
                {this.renderTextarea(
                  "description",
                  business === "custom" && this.state.data.customitemType === "Package" ? "Terms and Conditions / Inclusion(s) & Exclusion(s)" : "Terms and Conditions",
                  "Add terms and conditions about the item you would like to share with the client.",
                  "",
                  ViewInDisabled ? true : false
                )}
              </div>

              <div className="col-lg-2">
                <div className="form-group">
                  <label className="d-block">&nbsp;</label>
                  {!this.state.showEditBtn &&
                    <button
                      id="AddItem"
                      onClick={() => { this.handleAddManualItem(true) }}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      Next
                    </button>
                  }
                  {(this.state.showEditBtn) &&
                    <button
                      id="AddItem"
                      onClick={this.handleEditManualItem}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      Edit
                    </button>
                  }
                </div>

              </div>
              <div className="col-lg-12">
                <h6>Computer Generated Report, Requires No Signature.</h6>
              </div>
            </div>
          }
          {this.props.mode === "Edit" &&
            <div className="row">
              <div className="col-lg-12">
                <span class="d-block text-primary mb-2 border-bottom mb-3 pb-2 text-capitalize">{business} Details</span>
              </div>
              {(business === "hotel" || business === "activity") && (
                <React.Fragment>
                  <div className="col-lg-4">
                    {this.renderInput("name", business === "hotel" ? "Hotel Name" : "Activity Name", "", ViewInDisabled ? true : false)}
                  </div>
                  <div className="col-lg-2">{this.renderInput("toLocation", "Address / Location", "", ViewInDisabled ? true : false)}</div>
                </React.Fragment>
              )}

              {business === "hotel" && (
                <React.Fragment>
                  {true && (
                    <React.Fragment>
                      <div className="col-lg-2">
                        <DateRangePicker
                          isValid={this.props.datesIsValid}
                          cutOfDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
                          stayInDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays}
                          minDate={moment("2001-01-01").format(Global.DateFormate)}
                          minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                          maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                          isSingleDateRangePicker={true}
                          handleDateChange={this.handleStartDate}
                          checklabelName={"checkin"}
                          dates={
                            { checkInDate: this.state.data.dates.checkInDate }
                          }
                          business={business}
                          readOnly={ViewInDisabled ? true : false}
                        />
                      </div>

                      <div className="col-lg-2">
                        <DateRangePicker
                          isValid={this.props.datesIsValid}
                          cutOfDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.cutOffDays}
                          stayInDays={Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === business)?.stayInDays}
                          minDate={this.state.data.dates.checkInDate}
                          minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                          maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                          isSingleDateRangePicker={true}
                          handleDateChange={this.handleEndDate}
                          dates={{ checkInDate: this.state.data.dates.checkOutDate }}
                          checklabelName={"checkout"}
                          business={business}
                          readOnly={ViewInDisabled ? true : false}
                        />
                      </div>
                    </React.Fragment>)}

                  <div className="col-lg-2">
                    {this.renderSelect("rating", "Star Rating", starRating, undefined, undefined, ViewInDisabled ? true : false)}
                  </div>
                  {business !== 'hotel' &&
                    <React.Fragment>
                      <div className="col-lg-2 text-nowrap">
                        {this.renderInput("noRooms", "No of Rooms", "", ViewInDisabled ? true : false)}
                      </div>
                      <div className="col-lg-2">{this.renderInput("itemType", "Room Type", "", ViewInDisabled ? true : false)}</div>
                    </React.Fragment>
                  }

                  <HotelPaxWidget
                    //key={this.state.data.hotelPaxInfo}
                    handlePax={this.handleHotelPax}
                    isValid={"valid"}//this.props.paxIsValid
                    roomDetails={this.state.data.hotelPaxInfo}//this.props.pax
                    totalNoOfAdult={0}//this.props.totalNoOfAdult
                    totalNoOfChild={0}//this.props.totalNoOfChild
                    ishandleRoomType={true}
                    readOnly={ViewInDisabled ? true : false}
                  />

                  <div className="col-lg-2">{this.renderSelect("mealType", "Meal Type", mealSelection, undefined, undefined, ViewInDisabled ? true : false)}</div>
                  <div className="col-lg-2">{this.renderContactInput("hotelContactNumber", "Hotel Contact Number")}</div>
                </React.Fragment>
              )}

              {business === "activity" && (
                <React.Fragment>
                  {true && (
                    <div className="col-lg-2">
                      {this.renderSingleDate("startDate", "Date", this.state.data.startDate, moment("2001-01-01").format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false)}
                    </div>
                  )}

                  {type === "Itinerary" && (
                    <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}</div>
                  )}

                  <div className="col-lg-2">
                    {!this.props.importItem && this.renderSelect("duration", "Duration", durationList, undefined, undefined, ViewInDisabled ? true : false)}
                    {this.props.importItem && this.renderInput("duration", "Duration", "", ViewInDisabled ? true : false)}
                  </div>

                  <div className="col-lg-2">{this.renderInput("guests", "No of Guests", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-4">{this.renderInput("itemType", "Activity Type", "", ViewInDisabled ? true : false)}</div>
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
                            onChange={ViewInDisabled ? "" : () => this.changeairTripType()}
                          />
                          <label>{Trans("_airTripDirection_Roundtrip")}</label>
                        </li>
                        <li>
                          <input
                            value="OneWay"
                            name="Direction"
                            type="radio"
                            checked={!this.state.data.isRoundTrip}
                            onChange={ViewInDisabled ? "" : () => this.changeairTripType()}
                          />
                          <label>{Trans("_airTripDirection_Oneway")}</label>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-5" id="fromLocation">
                    <label htmlFor="fromLocation">
                      {Trans("_widget" + business + "FromLocationTitle")}
                    </label>
                    <AutoComplete
                      isValid="valid"
                      businessName={business}
                      handleLocation={this.setFromLocation}
                      mode="From"
                      selectedOptions={this.state.data.fromLocationFlight && this.state.data.fromLocationFlight.id
                        ? [this.state.data.fromLocationFlight]
                        : []}
                    />
                  </div>

                  <div className="col-lg-5" id="toLocation">
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

                  <div className="col-lg-12">
                    {this.state.data.isRoundTrip && (
                      <span className="d-block text-primary mb-2">Enter Departure Flight Details</span>
                    )}
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="row">
                          {true && (
                            <div className="col-lg-7">
                              {this.renderSingleDate(
                                "departStartDate",
                                "Depart Date",
                                this.state.data.departStartDate,
                                moment("2001-01-01").format('YYYY-MM-DD')
                                , undefined, ViewInDisabled ? true : false
                              )}
                            </div>
                          )}

                          {type === "Itinerary" && (
                            <div className="col-lg-7">
                              {this.renderSelect("dayDepart", "Depart Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                            </div>
                          )}

                          <div className="col-lg-5">
                            <div class="form-group departStartTime">
                              <label for="departStartTime">Depart Time</label>
                              <TimeField
                                class="form-control w-100"
                                name="departStartTime"
                                input={ViewInDisabled ? <input type="text" value={this.state.data.departStartTime} disabled /> : null}
                                value={this.state.data.departStartTime}
                                onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          {true && (
                            <div className="col-lg-7">
                              {this.renderSingleDate(
                                "departEndDate",
                                "Arrival Date",
                                this.state.data.departEndDate,
                                this.state.data.departStartDate
                                , undefined, ViewInDisabled ? true : false
                              )}
                            </div>
                          )}

                          {type === "Itinerary" && (
                            <div className="col-lg-7">
                              {this.renderSelect("dayDepartEnd", "Arrival Day", departEnddays, undefined, undefined, ViewInDisabled ? true : false)}
                            </div>
                          )}

                          {/* <div className="col-lg-5">
                        {this.renderInput("departEndTime", "Arrival Time")}
                      </div> */}
                          <div className="col-lg-5">
                            <div class="form-group departEndTime">
                              <label for="departEndTime">Arrival Time</label>
                              <TimeField
                                class="form-control w-100"
                                name="departEndTime"
                                input={ViewInDisabled ? <input type="text" value={this.state.data.departEndTime} disabled /> : null}
                                value={this.state.data.departEndTime}
                                onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          <div className="col-lg-6" id="departAirlineName">
                            <label htmlFor="airline name">{Trans("Airline Name")}</label>
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
                            {this.renderInput("departFlightNumber", "Flight Number", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="row">
                          <div className="col-lg-5">{this.renderInput("departClass", "Class", "", ViewInDisabled ? true : false)}</div>
                          <div className="col-lg-4">
                            {this.renderDuration(["departDurationH", "departDurationM"], "Duration", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-3">
                            {/* {this.renderInput("departStops", "Stops", "", ViewInDisabled ? true : false)} */}
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
                            {true && (
                              <div className="col-lg-7">
                                {this.renderSingleDate(
                                  "returnStartDate",
                                  "Depart Date",
                                  this.state.data.returnStartDate,
                                  this.state.data.departEndDate
                                  , undefined, ViewInDisabled ? true : false
                                )}
                              </div>
                            )}

                            {type === "Itinerary" && (
                              <div className="col-lg-7">
                                {this.renderSelect("dayReturn", "Depart Day", returndepartStartdays, undefined, undefined, ViewInDisabled ? true : false)}
                              </div>
                            )}

                            <div className="col-lg-5">
                              <div class="form-group returnStartTime">
                                <label for="returnStartTime">Depart Time</label>
                                <TimeField
                                  class="form-control w-100"
                                  input={ViewInDisabled ? <input type="text" value={this.state.data.returnStartTime} disabled /> : null}
                                  name="returnStartTime"
                                  value={this.state.data.returnStartTime}
                                  onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            {true && (
                              <div className="col-lg-7">
                                {this.renderSingleDate(
                                  "returnEndDate",
                                  "Arrival Date",
                                  this.state.data.returnEndDate,
                                  this.state.data.returnStartDate
                                  , undefined, ViewInDisabled ? true : false
                                )}
                              </div>
                            )}

                            {type === "Itinerary" && (
                              <div className="col-lg-7">
                                {this.renderSelect("dayReturnEnd", "Arrival Day", daysReturn, undefined, undefined, ViewInDisabled ? true : false)}
                              </div>
                            )}
                            <div className="col-lg-5">
                              <div class="form-group returnEndTime">
                                <label for="returnEndTime">Arrival Time</label>
                                <TimeField
                                  class="form-control w-100"
                                  input={ViewInDisabled ? <input type="text" value={this.state.data.returnEndTime} disabled /> : null}
                                  name="returnEndTime"
                                  value={this.state.data.returnEndTime}
                                  onChange={ViewInDisabled ? "" : e => this.handleChange({ currentTarget: e.target })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            <div className="col-lg-6" id="returnAirlineName">
                              <label htmlFor="airline name">{Trans("Airline Name")}</label>
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
                              {this.renderInput("returnFlightNumber", "Flight Number", "", ViewInDisabled ? true : false)}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="row">
                            <div className="col-lg-5">{this.renderInput("returnClass", "Class", "", ViewInDisabled ? true : false)}</div>
                            <div className="col-lg-4">
                              {this.renderDuration(["returnDurationH", "returnDurationM"], "Duration", ViewInDisabled ? true : false)}
                            </div>
                            <div className="col-lg-3">
                              {/* {this.renderInput("returnStops", "Stops", "", ViewInDisabled ? true : false)} */}
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
                      <div className="col-lg-4">{this.renderInput("adult", "Adult", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-4">{this.renderInput("child", "Child", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-4">{this.renderInput("infant", "Infant", "", ViewInDisabled ? true : false)}</div>
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
                            {this.renderInput("fromLocation", "Pick-up Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("pickupType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="row">
                          <div className="col-lg-12">
                            {this.renderInput("toLocation", "Drop-off Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
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
                            {this.renderInput("fromLocation", "Pick-up Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("pickupType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="row">
                          <div className="col-lg-12">
                            {this.renderInput("toLocation", "Drop-off Location", "", ViewInDisabled ? true : false)}
                          </div>
                          <div className="col-lg-6 text-nowrap d-none">
                            {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)", "", ViewInDisabled ? true : false)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  <div className="col-lg-4">
                    <div className="row">
                      {true && (
                        <div className="col-lg-6">
                          {this.renderSingleDate(
                            "startDate",
                            "Transfers Date",
                            this.state.data.startDate,
                            moment("2001-01-01").format('YYYY-MM-DD')
                            , undefined, ViewInDisabled ? true : false
                          )}
                        </div>
                      )}

                      {type === "Itinerary" && (
                        <div className="col-lg-6">
                          {this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}


                      {!this.props.importItem && (
                        <div className="col-lg-6 text-nowrap">
                          {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}

                      {this.props.importItem && (
                        <div className="col-lg-6 text-nowrap">
                          {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime, undefined, undefined, ViewInDisabled ? true : false)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-8 text-nowrap">
                        {this.renderInput("itemType", "Vehicle Type (eg. Bus, Sedan)")}
                      </div>
                      <div className="col-lg-4">{this.renderInput("guests", "No of Guests", "", ViewInDisabled ? true : false)}</div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {business === "custom" && (
                <React.Fragment>
                  <div className="col-lg-2">{this.renderInput("toLocation", "Location", "", ViewInDisabled ? true : false)}</div>
                  <div className="col-lg-2">{this.renderInput("name", "Item Name", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">
                    {this.renderSingleDate("startDate", "From Date", this.state.data.startDate, moment("2001-01-01").format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false, this.handleOnDateChange)}
                  </div>
                  <div className="col-lg-2">
                    {this.renderSingleDate("endDate", "To Date", this.state.data.endDate, moment(this.state.data.startDate).format('YYYY-MM-DD'), undefined, ViewInDisabled ? true : false)}
                  </div>
                  {type === "Itinerary" && (
                    <div className="col-lg-3">
                      {this.renderSelect("day", "Itinerary Day", days, undefined, undefined, ViewInDisabled ? true : false)}
                    </div>
                  )}

                  <div className="col-lg-2">
                    {this.renderSelect("customitemType", "Item Type (eg. Restaurant)", itemTypeList, undefined, undefined, ViewInDisabled ? true : false)}
                  </div>

                  {(this.state.data.customitemType === "Other") &&
                    <div className="col-lg-3">
                      {this.renderInput("otherType", "Other", "", ViewInDisabled ? true : false)}
                    </div>
                  }
                  {(this.state.data.customitemType === "Package") &&
                    <React.Fragment>
                      <div className="col-lg-1">{this.renderInput("adult", "Adult", "", ViewInDisabled ? true : false)}</div>
                      <div className="col-lg-1">{this.renderInput("child", "Child", "", ViewInDisabled ? true : false)}</div>
                    </React.Fragment>
                  }
                </React.Fragment>
              )}

              {/* <div className="col-lg2">
                {this.renderInput("vendor", "Vendor/Supplier", "", ViewInDisabled ? true : false)}
              </div> */}

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
                          value={(this.state.data.vendor !== "" && this.state.data.vendor !== null) ? (supplierOptions.find(x => x.label.toLowerCase() === this.state.data.vendor) ?? { "label": this.state.data.vendor, "value": 0 }) : null}
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

              <div className="col-lg-2">{this.renderInput("brn", "Confirmation Number", "", ViewInDisabled ? true : false)}</div>

              {(this.state.data.isInclusive || (!this.state.data.isInclusive
                && Number(this.state.data.supplierCostPrice) === 0 && Number(this.state.data.supplierTaxPrice) === 0 && Number(this.state.data.discountPrice) === 0 && Number(this.state.data.processingFees) === 0 && Number(this.state.data.markupPrice) === 0))
                ? <div className="col-lg-2">
                  {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                </div>
                : !this.state.data.isInclusive /* && Number(this.state.data.sellPrice) > 0 && Number(this.state.data.markupPrice) > 0 */
                  ? <div className="col-lg-2">
                    {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                  </div>
                  : ""
              }
              {Number(this.state.data.totalAmount) > 0 &&
                <div className={"col-lg-2"}>
                  {this.renderInput("totalAmount", "Total Amount (" + portalCurrency + ")", "text", true)}
                </div>
              }

              {(Number(this.state.data.sellPrice) > 0 || Number(this.state.data.totalAmount) > 0) &&
                <div className="col-lg-2" >
                  <div class="">
                    <label for="amount for">{this.RsPaise(Number(this.state.data.totalAmount) > 0
                      ? Number(this.state.data.totalAmount)
                      : Number(this.state.data.sellPrice))}</label>
                  </div>
                </div>
              }

              <div className="col-lg-12">
                <div className="row pull-right mt-2 mb-2">
                  <div className="col-lg-12">
                    <button class="btn btn-link p-0 m-0 text-primary" onClick={this.handleShowHideTax}>
                      {this.state.data.isShowTax ? "Hide" : "Show"} more
                    </button>
                  </div>
                </div>
              </div>

              {this.state.data.isShowTax &&
                <React.Fragment>
                  <div className="col-lg-12">
                    <span class="d-block text-primary mb-2 border-bottom mb-3 pb-2">Price Details</span>
                  </div>
                  <div className="col-lg-12">
                    <div className="row">

                      <div className="col-lg-2">
                        {this.renderSelect("supplierCurrency", "Supplier Currency", currencyList, undefined, undefined, ViewInDisabled ? true : false)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("conversionRate", "Conversion Rate", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("supplierCostPrice", "Supplier Cost Price", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("supplierTaxPrice", "Supplier Tax", "text", ViewInDisabled ? true : false, this.handleAmountFields)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("costPrice", "Agent Cost Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : true)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("markupPrice", "Agent Markup", "", ViewInDisabled ? true : false, this.handleAmountFields)}
                      </div>

                      <div className="col-lg-2">
                        {this.renderInput("discountPrice", "Discount", "", ViewInDisabled ? true : false, this.handleAmountFields)}
                      </div>

                      <TaxQuotationAddOffline
                        key={this.state.editMode === undefined ? false : this.state.editMode}
                        business={business}
                        handleTaxQuoationoData={this.handleTaxQuoationoData}
                        data={this.state.data}
                        errors={this.state.errors}
                        ViewInDisabled={ViewInDisabled}
                      />
                      {!this.state.data.isInclusive && this.state.data.sellPrice > 0 && Number(this.state.data.processingFees) === 0 &&
                        <div className="col-lg-2">
                          {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", ViewInDisabled ? true : this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                        </div>
                      }
                    </div>
                  </div>
                </React.Fragment>
              }
              <div className="col-lg-12">
                <span class="d-block text-primary mb-2 border-bottom mb-3 pb-2">Bank Details</span>
              </div>
              <div className="col-lg-12">

                <div className="row">

                  <div className="col-lg-2">{this.renderInput("agentaccountholdername", "Account Holder Name", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agentbankname", "Agent Bank Name", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agentbankaccnumber", "Agent Bank Account No", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agentbankifscnumber", "Agent Bank IFSC", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agentbankswiftnumber", "Agent Bank SWIFT Code", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agentbankbranchnameaddress", "Branch Name/Address", "", ViewInDisabled ? true : false)}</div>

                  <div className="col-lg-2">{this.renderInput("agencyname", "Agency Name", "", ViewInDisabled ? true : false)}</div>
                </div>
              </div>
              <div className="col-lg-10">
                {this.renderTextarea(
                  "description",
                  business === "custom" && this.state.data.customitemType === "Package" ? "Terms and Conditions / Inclusion(s) & Exclusion(s)" : "Terms and Conditions",
                  "Add terms and conditions about the item you would like to share with the client.",
                  "",
                  ViewInDisabled ? true : false
                )}
              </div>

              <div className="col-lg-2">
                <div className="form-group">
                  <label className="d-block">&nbsp;</label>
                  {!this.state.showEditBtn &&
                    <button
                      id="AddItem"
                      onClick={() => { this.handleAddManualItem(true) }}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      Next
                    </button>
                  }
                  {(this.state.showEditBtn) &&
                    <button
                      id="AddItem"
                      onClick={this.handleEditManualItem}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      Edit
                    </button>
                  }
                </div>
              </div>
              <div className="col-lg-12">
                <h6>Computer Generated Report, Requires No Signature.</h6>
              </div>
            </div>
          }
          {this.state.showPopup ? (
            <ModelPopup
              header={this.state.popupTitle}
              content={this.state.popupContent}
              handleHide={this.handlePopup}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default ManualInvoiceAddOffline;


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
  { name: "Package", value: "Package" },
  { name: "Visa", value: "Visa" },
  { name: "Rail", value: "Rail" },
  { name: "Forex", value: "Forex" },
  { name: "Bus", value: "Bus" },
  { name: "Rent a Car", value: "Rent a Car" },
  { name: "Other", value: "Other" }
];

var onesMapping =
  [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];


var tensMapping =
  [
    'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

var groupMapping =
  [
    'Hundred', 'Thousand', 'Million', 'Billion', 'Trillion'
  ];