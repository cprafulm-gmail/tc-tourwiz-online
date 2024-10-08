import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import * as DropdownList from "../../helpers/dropdown-list";
import HtmlParser from "../../helpers/html-parser";
import moment from "moment";
import * as Global from "../../helpers/global";
import Amount from "../../helpers/amount";
import SVGIcon from "../../helpers/svg-icon";
import { apiRequester } from "../../services/requester";

class GuestManualInvoice extends Form {
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
      AvailableInputs: this.props?.supplierquestions?.availableInputs,
      add_arrivhotel: "",
      add_direccionhtl: "",
      add_hotel: "",
      business: this.props.business,
    },
    errors: {},
    isAdditionalServices: localStorage.getItem("umrahPackageDetails") && (this.props.business === "transportation" || this.props.business === "groundservice") ? true : false,
    travelers: [],
    isSaveTraveler: false,
    isvalidAdditionalQuantity: true,
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
    let data = { ...this.state.data };
    if (this.props.count > 0) {
      if (data.firstName === "")
        data.firstName = "TBA";
      if (data.lastName === "")
        data.lastName = "TBA";
    }
    data.code = this.props.code;
    data.token = this.props.token === "" ? this.props.code : this.props.token;
    data.isSaveTraveler = this.state.isSaveTraveler;
    this.props.handleChildSubmit({
      business: this.props.business,
      count: this.props.count,
      data: data,
      isErrors: errors !== null,
    });
  };

  validate = () => {
    const errors = {};
    let isSkipRequiredValidation = this.props.count > 0;
    if (this.props.business !== "hotel" && this.props.business !== "air") {
      isSkipRequiredValidation = this.props.count > 1;
    }
    const { data, isvalidAdditionalQuantity } = this.state;
    var isB2CUmrahPortal = localStorage.getItem("umrahPackageDetails") && localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C";
    if (!isB2CUmrahPortal) {
      if (isSkipRequiredValidation && data.firstName.trim().length === 0) {
        //DO Nothing
      }
      else if (!this.validateFormData(data.firstName, "require"))
        errors.firstName = Trans("_error_firstname_require");
      else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
        errors.firstName = "< and > characters not allowed";
      else if (
        !this.validateFormData(data.firstName, "length", { min: 2, max: 50 })
      )
        errors.firstName = Trans("_error_firstname_length");

      //lastname
      if (isSkipRequiredValidation && data.lastName.trim().length === 0) {
        //DO Nothing
      }
      else if (!this.validateFormData(data.lastName, "require"))
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
    }
    let paxIsValid = true;
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
    if (this.props.guestdetails && firstName === "" && lastName === "" && this.props.business !== "hotel" && this.props.count === 1) {
      userInfo.firstName = this.props.guestdetails[0].data.firstName;
      userInfo.lastName = this.props.guestdetails[0].data.lastName;
    }
    if (sessionStorage.getItem("customer-info") && userInfo.firstName === "" && this.props.business === "hotel" && this.props.count === 0)
      userInfo.firstName = JSON.parse(sessionStorage.getItem("customer-info")).firstName;
    if (sessionStorage.getItem("customer-info") && userInfo.lastName === "" && this.props.business === "hotel" && this.props.count === 0)
      userInfo.lastName = JSON.parse(sessionStorage.getItem("customer-info")).lastName;
    if (sessionStorage.getItem("customer-info") && userInfo.firstName === "" && this.props.business !== "hotel" && this.props.count === 1)
      userInfo.firstName = JSON.parse(sessionStorage.getItem("customer-info")).firstName;
    if (sessionStorage.getItem("customer-info") && userInfo.lastName === "" && this.props.business !== "hotel" && this.props.count === 1)
      userInfo.lastName = JSON.parse(sessionStorage.getItem("customer-info")).lastName;

    if (userInfo.firstName === "TBA")
      userInfo.firstName = "";

    if (userInfo.lastName === "TBA")
      userInfo.lastName = "";

    let typestring = this.props.business === "hotel" ? "ADT-CHD" : "";
    // let conditiondate =
    //   (this.props.business === "hotel" || this.props.business === "vehicle")
    //     ? this.props.data.dateInfo.startDate//this.props.breakDownRateInfo[0].dateInfo.startDate
    //     : this.props.item
    //       ? this.props.item[0].dateInfo.startDate
    //       : null;
    // userInfo.birthDate =
    //   birthDate !== ""
    //     ? moment(birthDate) >=
    //       this.getMinDateForBirthDate(typestring, conditiondate) &&
    //       moment(birthDate) <=
    //       this.getMaxDateForBirthDate(typestring, conditiondate)
    //       ? birthDate
    //       : ""
    //     : "";
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
    if (!this.props.continueAsGuest) {
      if (this.props.userInfo)
        this.setUserInfo();
      //this.getTravelers();
      // if (this.props.userInfo.firstName === "" && this.props.userInfo.lastName === "" && localStorage.getItem("quotationDetails") !== undefined)
      //   this.setuserInfoForTourwiz();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const business = this.props.business;
    const portalType =
      Global.getEnvironmetKeyValue("portalType") === "B2C" ? true :
        Global.getEnvironmetKeyValue("EnableCoTravelerForB2BPortal", "cobrand") === null ? false : true;
    const itemName = Trans("_room") + " : " + (this.props.roomType && this.props.roomType !== "" ? this.props.roomType : "Unnamed");
    const GenderList = DropdownList.Gender;
    const { isAdditionalServices, travelers } = this.state;
    let isB2CUmrahPortal = localStorage.getItem("umrahPackageDetails") && localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" && true;
    return (
      <div className="row">
        {this.props.business === "hotel" && (
          <div className="col-lg-12">
            <h6 className="font-weight-bold mb-3 mt-2">
              <HtmlParser text={itemName} />
            </h6>
          </div>
        )}
        {((!localStorage.getItem("umrahPackageDetails")) || (localStorage.getItem("umrahPackageDetails") && this.props.business === "hotel")) &&
          (
            <React.Fragment>
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
                      <option value="">{Trans("_select")}</option>
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
                {this.renderInput("firstName", (this.props.business === "hotel" && this.props.count > 0) ? Trans("_lblFirstName") : Trans("_lblFirstNameWithStar"))}
              </div>

              <div className="col-lg-3">
                {this.renderInput("lastName", (this.props.business === "hotel" && this.props.count > 0) ? Trans("_lblLastName") : Trans("_lblLastNameWithStar"))}
              </div>

              {/* {this.props.business === "hotel" || (!this.props.business && this.props.data.business && (this.props.data.business === "activity" || this.props.data.business === "transfers" || this.props.data.business === "package" || this.props.data.business === "vehicle")) ? (
                <div className="col-lg-3">
                  {this.renderBirthDate(
                    "birthDate",
                    IsManualItem ? Trans("_lblBirthdate") : Trans("_lblBirthdateWithStar"),
                    "ADT-CHD",
                    this.props.business === "hotel" ? this.props.data.dateInfo.startDate ://this.props.breakDownRateInfo[0].dateInfo.startDate :
                      !this.props.business && this.props.data.business && (this.props.data.business === "activity" || this.props.data.business === "package" || this.props.data.business === "vehicle")
                        ? this.props.data.dateInfo.startDate : "0001-01-01T00:00:00"
                  )}
                </div>
              )
                : (
                  <div className="col-lg-3">
                    {this.renderBirthDate("birthDate", (IsManualItem ? Trans("_lblBirthdate") : Trans("_lblBirthdateWithStar")))}
                  </div>
                )} */}

              {this.props.business === "transportation" && (
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
              )}
            </React.Fragment>
          )}
      </div>
    );
  }
}

export default GuestManualInvoice;
