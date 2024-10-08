import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import * as DropdownList from "../../helpers/dropdown-list";
import HtmlParser from "../../helpers/html-parser";
import moment from "moment";
import * as Global from "../../helpers/global";
import { apiRequester } from "../../services/requester";

class ManualInvoiceGuestTransfers extends Form {
  state = {
    data: {
      gender: "Male",
      firstName: "",
      lastName: "",
      birthDate: "",
      code: "",
      token: "",
      documentNumber: "",
      nationalityCode: Global.getEnvironmetKeyValue("PortalCountryCode"),
      additionalServices: [],
      pickupfromdate: moment().format("YYYY-MM-DDT00:00:00"),
      pickuptodate: moment().format("YYYY-MM-DDT00:00:00"),
      returnpickupfromdate: moment().format("YYYY-MM-DDT00:00:00"),
      returnpickuptodate: moment().format("YYYY-MM-DDT00:00:00"),
      pickuphotelname: "",
      pickuptime: "",
      dropoffhotelname: "",
      returnpickuphotelname: "",
      returnpickuptime: "",
      returndropffhotelname: "",
      otherdetailspickuphotelname: "",
      otherdetailsdropoffhotelname: "",
      otherdetailsreturnpickuphotelname: "",
      otherdetailsreturndropoffhotelname: "",
      otherdetailspickupairport: "",
      otherdetailsdropoffairport: "",
      otherdetailsreturnpickupairport: "",
      otherdetailsreturndropoffairport: "",
      arrivingfromdate: moment().format("YYYY-MM-DDT00:00:00"),
      arrivingtodate: moment().format("YYYY-MM-DDT00:00:00"),
      returnarrivingfromdate: moment().format("YYYY-MM-DDT00:00:00"),
      returnarrivingtodate: moment().format("YYYY-MM-DDT00:00:00"),
      departingfromdate: "",//moment().format("YYYY-MM-DDT00:00:00"),
      departingtodate: "",//moment().format("YYYY-MM-DDT00:00:00"),
      returndepartingfromdate: "",//moment().format("YYYY-MM-DDT00:00:00"),
      returndepartingtodate: "",//moment().format("YYYY-MM-DDT00:00:00"),
      arrivingairline: "",
      arrivingfromaddress: "",
      arrivingflightno: "",
      arrivingtime: "",
      returnarrivingairline: "",
      returnarrivingfromaddress: "",
      returnarrivingflightno: "",
      returnarrivingtime: "",
      departingairline: "",
      departingfromaddress: "",
      departingflightno: "",
      departingtime: "",
      returndepartingairline: "",
      returndepartingfromaddress: "",
      returndepartingflightno: "",
      returndepartingtime: "",
      IsRoundTrip: false,
      Types: "",
      business: "transfers",
      AvailableInputs: []
    },
    errors: {},
    isAdditionalServices: false,
    travelers: [],
    isSaveTraveler: false,
  };

  handleChildSubmitDuplicateValidation = () => {
    const errors = {};
    errors.firstName = Trans("_error_firstname_duplicate");
    errors.lastName = Trans("_error_lastname_duplicate");
    this.setState({ errors: errors });
  };

  handleChildSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    //if (errors) return;
    let data = this.state.data;
    data.code = this.props.code;
    data.token = this.props.token === "" ? this.props.code : this.props.token;
    data.isSaveTraveler = this.state.isSaveTraveler;
    this.props.handleChildSubmit({
      count: this.props.count,
      data: data,
      isErrors: errors !== null,
    });
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;
    if (!this.validateFormData(data.firstName, "require"))
      errors.firstName = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.firstName, "length", { min: 2, max: 50 })
    )
      errors.firstName = Trans("_error_firstname_length");

    //lastname
    if (!this.validateFormData(data.lastName, "require"))
      errors.lastName = Trans("_error_lastname_require");
    else if (!this.validateFormData(data.lastName, "special-characters-not-allowed", /[<>]/))
      errors.lastName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.lastName, "length", { min: 2, max: 50 })
    )
      errors.lastName = Trans("_error_lastname_length");

    //birthDate
    // if (!IsManualItem &&
    //   !this.validateFormData(data.birthDate, "require_date", {
    //     conditionDate: new Date(),
    //   })
    // )
    //   errors.birthDate = Trans("_error_birthDate_require");
    if (this.props.business === "transportation") {
      if (!this.validateFormData(data.documentNumber, "require"))
        errors.documentNumber = Trans("_error_passportNumber_require");
      else if (
        !this.validateFormData(data.documentNumber, "length", {
          min: 2,
          max: 50,
        })
      )
        errors.documentNumber = Trans("_error_passportNumber_length");
      else if (!this.validateFormData(data.documentNumber, "alpha_numeric"))
        errors.documentNumber = Trans("_error_passportNumber_invalid");
    }

    // if (this.props.supplierquestions.availableInputs.length > 0) {
    //   if (this.props.supplierquestions.availableInputs.length === 4) {
    //     if (this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {

    //       if (!this.validateFormData(data.pickuphotelname, "require"))
    //         errors.pickuphotelname = Trans("_error_pickuphotelname_require");

    //       if (!this.validateFormData(data.pickupfromdate, "require_date"))
    //         errors.pickupfromdate = Trans("_error_pickupfromdate_require");

    //       // if (
    //       //     !this.validateFormData(data.pickupfromdate, "pastdate", {
    //       //       conditionDate: this.props.dateInfo.startDate,
    //       //       addMonth: 0,
    //       //     })
    //       //   ){
    //       //     errors.pickupfromdate = Trans(
    //       //       "_error_passportExpirationDate_pastdate"
    //       //     );
    //       // }
    //       if (!this.validateFormData(data.pickuptime, "require"))
    //         errors.pickuptime = Trans("_error_pickuptime_require");

    //       // if (!this.validateFormData(data.otherdetailspickuphotelname, "require"))
    //       //   errors.otherdetailspickuphotelname = Trans("_error_otherdetailspickuphotelname_require");
    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.arrivingairline, "require"))
    //         errors.arrivingairline = Trans("_error_arrivingairline_require");

    //       if (!this.validateFormData(data.arrivingfromaddress, "require"))
    //         errors.arrivingfromaddress = Trans("_error_arrivingfromaddress_require");

    //       if (!this.validateFormData(data.arrivingflightno, "require"))
    //         errors.arrivingflightno = Trans("_error_arrivingflightno_require");

    //       if (!this.validateFormData(data.arrivingfromdate, "require"))
    //         errors.arrivingfromdate = Trans("_error_arrivingfromdate_require");

    //       if (!this.validateFormData(data.arrivingtime, "require"))
    //         errors.arrivingtime = Trans("_error_arrivingtime_require");

    //       // if (!this.validateFormData(data.otherdetailspickupairport, "require"))
    //       //    errors.otherdetailspickupairport = Trans("_error_otherdetailspickupairport_require");
    //     }

    //     if (this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
    //       if (!this.validateFormData(data.dropoffhotelname, "require"))
    //         errors.dropoffhotelname = Trans("_error_dropoffhotelname_require");
    //       // if (!this.validateFormData(data.otherdetailsdropoffhotelname, "require"))
    //       //   errors.otherdetailsdropoffhotelname = Trans("_error_otherdetailsdropoffhotelname_require");
    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.departingairline, "require"))
    //         errors.departingairline = Trans("_error_departingairline_require");

    //       if (!this.validateFormData(data.departingfromaddress, "require"))
    //         errors.departingfromaddress = Trans("_error_departingfromaddress_require");

    //       if (!this.validateFormData(data.departingflightno, "require"))
    //         errors.departingflightno = Trans("_error_departingflightno_require");

    //       if (!this.validateFormData(data.departingfromdate, "require"))
    //         errors.departingfromdate = Trans("_error_departingfromdate_require");

    //       if (!this.validateFormData(data.departingtime, "require"))
    //         errors.departingtime = Trans("_error_departingtime_require");

    //       //  if (!this.validateFormData(data.otherdetailsdropoffairport, "require"))
    //       //    errors.otherdetailsdropoffairport = Trans("_error_otherdetailsdropoffairport_require");
    //     }

    //     if (this.props.supplierquestions.availableInputs[2].item[0].id.includes("accommodation")) {
    //       if (!this.validateFormData(data.returnpickuphotelname, "require"))
    //         errors.returnpickuphotelname = Trans("_error_returnpickuphotelname_require");

    //       if (!this.validateFormData(data.returnpickupfromdate, "require_date"))
    //         errors.returnpickupfromdate = Trans("_error_returnpickupfromdate_require");

    //       if (!this.validateFormData(data.returnpickuptime, "require"))
    //         errors.returnpickuptime = Trans("_error_returnpickuptime_require");

    //       // if (!this.validateFormData(data.otherdetailsreturnpickuphotelname, "require"))
    //       //   errors.otherdetailsreturnpickuphotelname = Trans("_error_otherdetailsreturnpickuphotelname_require");

    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.returnarrivingairline, "require"))
    //         errors.returnarrivingairline = Trans("_error_returnarrivingairline_require");

    //       if (!this.validateFormData(data.returnarrivingfromaddress, "require"))
    //         errors.returnarrivingfromaddress = Trans("_error_returnarrivingfromaddress_require");

    //       if (!this.validateFormData(data.returnarrivingflightno, "require"))
    //         errors.returnarrivingflightno = Trans("_error_returnarrivingflightno_require");

    //       if (!this.validateFormData(data.returnarrivingfromdate, "require"))
    //         errors.returnarrivingfromdate = Trans("_error_returnarrivingfromdate_require");

    //       if (!this.validateFormData(data.returnarrivingtime, "require"))
    //         errors.returnarrivingtime = Trans("_error_returnarrivingtime_require");

    //       // if (!this.validateFormData(data.otherdetailsreturnpickupairport, "require"))
    //       //   errors.otherdetailsreturnpickupairport = Trans("_error_otherdetailsreturnpickupairport_require");
    //     }

    //     if (this.props.supplierquestions.availableInputs[3].item[0].id.includes("accommodation")) {
    //       if (!this.validateFormData(data.returndropffhotelname, "require"))
    //         errors.returndropffhotelname = Trans("_error_returndropoffhotelname_require");

    //       // if (!this.validateFormData(data.otherdetailsreturndropoffhotelname, "require"))
    //       //   errors.otherdetailsreturndropoffhotelname = Trans("_error_otherdetailsreturndropoffhotelname_require");

    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.returndepartingairline, "require"))
    //         errors.returndepartingairline = Trans("_error_returndepartingairline_require");

    //       if (!this.validateFormData(data.returndepartingfromaddress, "require"))
    //         errors.returndepartingfromaddress = Trans("_error_returndepartingfromaddress_require");

    //       if (!this.validateFormData(data.returndepartingflightno, "require"))
    //         errors.returndepartingflightno = Trans("_error_returndepartingflightno_require");

    //       if (!this.validateFormData(data.returndepartingfromdate, "require"))
    //         errors.returndepartingfromdate = Trans("_error_returndepartingfromdate_require");

    //       if (!this.validateFormData(data.returndepartingtime, "require"))
    //         errors.returndepartingtime = Trans("_error_returndepartingtime_require");

    //       // if (!this.validateFormData(data.otherdetailsreturndropoffairport, "require"))
    //       //   errors.otherdetailsreturndropoffairport = Trans("_error_otherdetailsreturndropoffairport_require");
    //     }

    //   }
    //   else {
    //     // one way
    //     if (this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {

    //       if (!this.validateFormData(data.pickuphotelname, "require"))
    //         errors.pickuphotelname = Trans("_error_pickuphotelname_require");

    //       if (!this.validateFormData(data.pickupfromdate, "require_date"))
    //         errors.pickupfromdate = Trans("_error_pickupfromdate_require");

    //       if (!this.validateFormData(data.pickuptime, "require"))
    //         errors.pickuptime = Trans("_error_pickuptime_require");

    //       // if (!this.validateFormData(data.otherdetailspickuphotelname, "require"))
    //       //   errors.otherdetailspickuphotelname = Trans("_error_otherdetailspickuphotelname_require");
    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.arrivingairline, "require"))
    //         errors.arrivingairline = Trans("_error_arrivingairline_require");

    //       if (!this.validateFormData(data.arrivingfromaddress, "require"))
    //         errors.arrivingfromaddress = Trans("_error_arrivingfromaddress_require");

    //       if (!this.validateFormData(data.arrivingflightno, "require"))
    //         errors.arrivingflightno = Trans("_error_arrivingflightno_require");

    //       if (!this.validateFormData(data.arrivingfromdate, "require"))
    //         errors.arrivingfromdate = Trans("_error_arrivingfromdate_require");

    //       if (!this.validateFormData(data.arrivingtime, "require"))
    //         errors.arrivingtime = Trans("_error_arrivingtime_require");

    //       // if (!this.validateFormData(data.otherdetailspickupairport, "require"))
    //       //    errors.otherdetailspickupairport = Trans("_error_otherdetailspickupairport_require");
    //     }

    //     if (this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
    //       if (!this.validateFormData(data.dropoffhotelname, "require"))
    //         errors.dropoffhotelname = Trans("_error_dropoffhotelname_require");
    //       // if (!this.validateFormData(data.otherdetailsdropoffhotelname, "require"))
    //       //   errors.otherdetailsdropoffhotelname = Trans("_error_otherdetailsdropoffhotelname_require");
    //     }
    //     else {
    //       //Airport
    //       if (!this.validateFormData(data.departingairline, "require"))
    //         errors.departingairline = Trans("_error_departingairline_require");

    //       if (!this.validateFormData(data.departingfromaddress, "require"))
    //         errors.departingfromaddress = Trans("_error_departingfromaddress_require");

    //       if (!this.validateFormData(data.departingflightno, "require"))
    //         errors.departingflightno = Trans("_error_departingflightno_require");

    //       if (!this.validateFormData(data.departingfromdate, "require"))
    //         errors.departingfromdate = Trans("_error_departingfromdate_require");

    //       if (!this.validateFormData(data.departingtime, "require"))
    //         errors.departingtime = Trans("_error_departingtime_require");

    //       // if (!this.validateFormData(data.otherdetailsdropoffairport, "require"))
    //       //   errors.otherdetailsdropoffairport = Trans("_error_otherdetailsdropoffairport_require");
    //     }

    //   }
    // }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  setUserInfo = (traveler) => {
    const {
      gender,
      firstName,
      lastName,
      birthDate,
      documentNumber,
      nationalityCode,
    } = traveler ? traveler : this.props.userInfo;
    let userInfo = { ...this.state.data };
    userInfo.gender = gender ? (gender === "M" ? "Male" : "Female") : "Male";
    userInfo.firstName = firstName;
    userInfo.lastName = lastName;
    if (sessionStorage.getItem("customer-info") && firstName === "" && this.props.business !== "hotel" && this.props.count === 1)
      userInfo.firstName = JSON.parse(sessionStorage.getItem("customer-info")).firstName;
    if (sessionStorage.getItem("customer-info") && lastName === "" && this.props.business !== "hotel" && this.props.count === 1)
      userInfo.lastName = JSON.parse(sessionStorage.getItem("customer-info")).lastName;
    let typestring = this.props.business === "hotel" ? "ADT-CHD" : "";
    let conditiondate =
      this.props.business === "hotel"
        ? this.props.breakDownRateInfo[0].dateInfo.startDate
        : this.props.item
          ? this.props.item[0].dateInfo.startDate
          : null;
    userInfo.birthDate =
      birthDate !== ""
        ? moment(birthDate) >=
          this.getMinDateForBirthDate(typestring, conditiondate) &&
          moment(birthDate) <=
          this.getMaxDateForBirthDate(typestring, conditiondate)
          ? birthDate
          : ""
        : "";
    userInfo.documentNumber = documentNumber ? documentNumber : "";
    userInfo.nationalityCode = nationalityCode
      ? nationalityCode
      : Global.getEnvironmetKeyValue("PortalCountryCode");
    (this.props.count === 0 || traveler || 1 === 1) &&
      this.setState({
        data: userInfo,
      });
  };

  getMinDateForBirthDate = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate ? new Date(conditiondate) : new Date();
    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 100;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 18;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 2;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 100;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
      conditiondate.setDate(conditiondate.getDate() + 1);
    } else {
      conditiondate.setFullYear(conditiondate.getFullYear() - 100);
      conditiondate.setDate(conditiondate.getDate() + 1);
    }
    return moment(conditiondate);
  };

  getMaxDateForBirthDate = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate ? new Date(conditiondate) : new Date();

    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 18;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 2;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 0;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 12;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
    }

    return moment(conditiondate);
  };

  handleAdditionalServices = () => {
    this.setState({ isAdditionalServices: !this.state.isAdditionalServices });
  };

  handleCheckAdditionalServices = (e) => {
    let data = this.state.data;
    let additionalServices = data.additionalServices;
    if (additionalServices.indexOf(e.target.value) > -1)
      additionalServices.splice(additionalServices.indexOf(e.target.value), 1);
    else additionalServices.push(e.target.value);
    data.additionalServices = additionalServices;
    this.setState({ data });
  };

  getTravelers = () => {
    var reqURL = "api/v1/cotraveler/details";
    var reqOBJ = {
      Request: "",
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      this.setState({ travelers: data.response });
    });
  };

  setTravelers = (e) => {
    let traveler = this.state.travelers.find(
      (x) => x.customerID === e.target.value
    );

    this.setUserInfo(traveler);
  };

  saveTraveler = () => {
    this.setState({ isSaveTraveler: !this.state.isSaveTraveler });
  };

  setSupplierQuestionData = () => {
    let data = this.state.data;
    if (this.props.supplierquestions !== "" && this.props.supplierquestions !== undefined && this.props.supplierquestions.availableInputs.length > 0) {
      [...Array(this.props.supplierquestions.availableInputs.length).keys()].map(inputcount => {
        if ((this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup0") || this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup2"))) {
          //Pickup details
          if (this.props.supplierquestions.availableInputs[inputcount].item[0].id.includes("accommodation")) {
            //Accomodation case
            [...Array(this.props.supplierquestions.availableInputs[inputcount].item.length).keys()].map(count => {
              if (this.props.supplierquestions.availableInputs[inputcount].item[count].type === "DatePicker") {
                if (this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup0")) {
                  data.pickupfromdate = moment(this.props.supplierquestions.availableInputs[inputcount].item[count].values[0]).format("YYYY-MM-DDT00:00:00");
                }
                else {
                  data.returnpickupfromdate = moment(this.props.supplierquestions.availableInputs[inputcount].item[count].values[0]).format("YYYY-MM-DDT00:00:00");
                }
              }
              else if (this.props.supplierquestions.availableInputs[inputcount].item[count].type === "TimePicker") {
                if (this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup0")) {
                  data.pickuptime = this.props.supplierquestions.availableInputs[inputcount].item[count].values[0] + ":" + this.props.supplierquestions.availableInputs[inputcount].item[count].values[1];
                }
                else {
                  data.returnpickuptime = this.props.supplierquestions.availableInputs[inputcount].item[count].values[0] + ":" + this.props.supplierquestions.availableInputs[inputcount].item[count].values[1];
                }
              }
              return true;
            })
          }
          else {
            //Airport case
            [...Array(this.props.supplierquestions.availableInputs[inputcount].item.length).keys()].map(count => {
              if (this.props.supplierquestions.availableInputs[inputcount].item[count].type === "DatePicker") {
                if (this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup0")) {
                  data.arrivingfromdate = moment(this.props.supplierquestions.availableInputs[inputcount].item[count].values[0]).format("YYYY-MM-DDT00:00:00");
                }
                else {
                  data.returnarrivingfromdate = moment(this.props.supplierquestions.availableInputs[inputcount].item[count].values[0]).format("YYYY-MM-DDT00:00:00");
                }
              }
              else if (this.props.supplierquestions.availableInputs[inputcount].item[count].type === "TimePicker") {
                if (this.props.supplierquestions.availableInputs[inputcount].code.includes("pickup0")) {
                  data.arrivingtime = this.props.supplierquestions.availableInputs[inputcount].item[count].values[0] + ":" + this.props.supplierquestions.availableInputs[inputcount].item[count].values[1];
                }
                else {
                  data.returnarrivingtime = this.props.supplierquestions.availableInputs[inputcount].item[count].values[0] + ":" + this.props.supplierquestions.availableInputs[inputcount].item[count].values[1];
                }
              }
              return true;
            })
          }
        }
        return true;
      })
      if (this.props.supplierquestions.availableInputs.length === 4) {
        data.IsRoundTrip = true;
        if (this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|PickupAccomodation";
          else
            data.Types = "PickupAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|PickupAirport";
          else
            data.Types = "PickupAirport";
        }

        if (this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|DropoffAccomodation";
          else
            data.Types = "DropoffAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|DropoffAirport";
          else
            data.Types = "DropoffAirport";
        }

        if (this.props.supplierquestions.availableInputs[2].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|ReturnPickupAccomodation";
          else
            data.Types = "ReturnPickupAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[2].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|ReturnPickupAirport";
          else
            data.Types = "ReturnPickupAirport";
        }

        if (this.props.supplierquestions.availableInputs[3].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|ReturnDropoffAccomodation";
          else
            data.Types = "ReturnDropoffAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[3].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|ReturnDropoffAirport";
          else
            data.Types = "ReturnDropoffAirport";
        }
      }
      else {
        data.IsRoundTrip = false;
        if (this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|PickupAccomodation";
          else
            data.Types = "PickupAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[0].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|PickupAirport";
          else
            data.Types = "PickupAirport";
        }

        if (this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|DropffAccomodation";
          else
            data.Types = "DropoffAccomodation";
        }
        else if (!this.props.supplierquestions.availableInputs[1].item[0].id.includes("accommodation")) {
          if (data.Types !== "")
            data.Types = data.Types + "|DropoffAirport";
          else
            data.Types = "DropoffAirport";
        }
      }
      this.setState({ data });
    }
  };

  setuserInfoForTourwiz = () => {
    if (localStorage.getItem("quotationDetails") !== undefined && localStorage.getItem("quotationDetails") !== null) {
      let statedata = { ...this.state.data };
      let localUserInfo = JSON.parse(localStorage.getItem("quotationDetails"));
      statedata["firstName"] = localUserInfo.customerName.split(' ')[0];
      statedata["lastName"] = localUserInfo.customerName.replace(localUserInfo.customerName.split(' ')[0] + " ", '');
      this.setState({ data: statedata });
    }
  }

  componentDidMount() {
    this.props.onRef(this);
    //this.setSupplierQuestionData();
    if (!this.props.continueAsGuest) {
      if (this.props.userInfo)
        this.setUserInfo();
      //this.setUserInfo();
      //this.getTravelers();
      //if (this.props.userInfo.firstName === "" && this.props.userInfo.lastName === "" && localStorage.getItem("quotationDetails") !== undefined)
      //this.setuserInfoForTourwiz();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  getlistarray = (listitem) => {
    const Items = [{ value: "", name: "Choose One" }];
    listitem.map(
      (item) => {
        Items.push({
          value: item.key + "_" + item.value,
          name: item.value
        });
        return true;
      });
    return Items;
  };

  render() {
    const portalType =
      Global.getEnvironmetKeyValue("portalType") === "B2C" ? true :
        Global.getEnvironmetKeyValue("EnableCoTravelerForB2BPortal", "cobrand") === null ? false : true;
    const itemName = "Room : " + this.props.name;
    const GenderList = DropdownList.Gender;
    const { travelers } = this.state;
    let additionalServicesList = [];
    if (
      this.props.addons &&
      this.props.addons.availableAddons.filter(
        (x) => x.type === "additionalServices"
      ).length > 0
    )
      this.props.addons.availableAddons
        .filter((x) => x.type === "additionalServices")[0]
        .item.map((item) => {
          additionalServicesList.push({
            name: item.name,
            value: item.id,
            amount: item.amount,
            businessItemToken: item.businessItemToken,
          });
          return true;
        });
    return (
      <div className="row">
        {this.props.business === "hotel" && (
          <div className="col-lg-12">
            <h6 className="font-weight-bold mb-3 mt-2">
              <HtmlParser text={itemName} />
            </h6>
          </div>
        )}
        {!this.props.continueAsGuest && portalType && travelers.length > 0 && (
          <div className="col-lg-3">
            <div className="form-group travelers">
              <label htmlFor="travelers">{Trans("_lblTravelers")}</label>
              <select
                name="travelers"
                id="travelers"
                className="form-control"
                onChange={(e) => this.setTravelers(e)}
              >
                <option value="">Select</option>
                {travelers.map((item) => {
                  return (
                    <option key={item.customerID} value={item.customerID}>
                      {item.firstName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* <div className="col-lg-3">
          {this.renderSelect("gender", Trans("_lblGenderWithStar"), GenderList)}
        </div> */}

        <div className="col-lg-3">
          {this.renderInput("firstName", Trans("_lblFirstNameWithStar"))}
        </div>

        <div className="col-lg-3">
          {this.renderInput("lastName", Trans("_lblLastNameWithStar"))}
        </div>

        {/* {this.props.business === "hotel" || (!this.props.business && this.props.data.business && (this.props.data.business === "activity" || this.props.data.business === "transfers" || this.props.data.business === "package")) ? (
          <div className="col-lg-3">
            {this.renderBirthDate(
              "birthDate",
              Trans("_lblBirthdate"),
              "ADT-CHD",
              this.props.business === "hotel" ? this.props.breakDownRateInfo[0].dateInfo.startDate :
                !this.props.business && this.props.data.business && (this.props.data.business === "activity" || this.props.data.business === "transfers" || this.props.data.business === "package")
                  ? this.props.data.dateInfo.startDate : "0001-01-01T00:00:00"
            )}
          </div>
        )
          : (
            <div className="col-lg-3">
              {this.renderBirthDate("birthDate", Trans("_lblBirthdate"))}
            </div>
          )} */}

        {/* {this.props.business === "transportation" && (
          <React.Fragment>
            <div className="col-lg-3">
              {this.renderInput(
                "documentNumber",
                Trans("_lblPassportNumberWithStar")
              )}
            </div>
            <div className="col-lg-3">
              {this.renderSelect(
                "nationalityCode",
                Trans("_lblNationality"),
                DropdownList.CountryList,
                "isoCode",
                "name"
              )}
            </div>
          </React.Fragment>
        )} */}

        {/* {portalType && (
          <div className="col-lg-12 mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                onChange={this.saveTraveler}
                id={"saveTraveler" + this.props.count}
                name={"saveTraveler" + this.props.count}
              />
              <label
                className="custom-control-label"
                htmlFor={"saveTraveler" + this.props.count}
              >
                {Trans("_saveAsCoTraveller")}
              </label>
            </div>
          </div>
        )} */}
      </div>
    );
  }
}

export default ManualInvoiceGuestTransfers;


const TransfersStartHour = [
  { value: "", name: "Choose One" },
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
]