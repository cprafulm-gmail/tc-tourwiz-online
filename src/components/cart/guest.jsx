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

class Guest extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        gender: "Male",
        firstName: "",
        lastName: "",
        middleName: "",
        birthDate: "",
        code: "",
        token: "",
        documentNumber: "",
        pancard: "",
        documentType: this.getdocumenttype(),
        passportExpirationDate: "",
        nationalityCode: Global.getEnvironmetKeyValue("PortalCountryCode"),
        additionalServices: [],
        AvailableInputs: this.props.supplierquestions.availableInputs,
        add_arrivhotel: "",
        add_direccionhtl: "",
        add_hotel: "",
        business: this.props.business,
        eticketno: ""
      },
      errors: {},
      isAdditionalServices: localStorage.getItem("umrahPackageDetails") && (this.props.business === "transportation" || this.props.business === "groundservice") ? true : false,
      travelers: [],
      isSaveTraveler: false,
      isvalidAdditionalQuantity: true,
    };
  }

  getdocumenttype = () => {
    let isPANMandatory = false;
    let isPassportMandatory = false;
    if (this.props.business === "hotel" && (this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPANMandatory").length > 0 || this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPassportMandatory").length > 0)) {
      isPANMandatory = this.props.data.items[0].item[0].config.filter(x => x.key === "IsPANMandatory")[0].value === "true" ? true : false;
      isPassportMandatory = this.props.data.items[0].item[0].config.filter(x => x.key === "IsPassportMandatory")[0].value === "true" ? true : false;
    }
    let documentType = "";
    if (isPANMandatory) {
      documentType = "PANCARD";
    }
    if (isPassportMandatory) {
      documentType = "PASSPORTNUMBER";
    }
    return documentType;
  }

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
    let IsManualItem = this.props.data.flags.isManualItem ? true : false;
    let data = { ...this.state.data };
    if (IsManualItem && this.props.count > 0) {
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
    let IsManualItem = this.props.data.flags.isManualItem ? true : false;
    let isSkipRequiredValidation = IsManualItem && this.props.count > 0;
    const { data, isvalidAdditionalQuantity } = this.state;
    var isB2CUmrahPortal = localStorage.getItem("umrahPackageDetails") && localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C";
    let isPANMandatory = false;
    let isPassportMandatory = false;
    if (this.props.business === "hotel" && (this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPANMandatory").length > 0 || this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPassportMandatory").length > 0)) {
      isPANMandatory = this.props.data.items[0].item[0].config.filter(x => x.key === "IsPANMandatory")[0].value === "true" ? true : false;
      isPassportMandatory = this.props.data.items[0].item[0].config.filter(x => x.key === "IsPassportMandatory")[0].value === "true" ? true : false;
    }
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
      if (!IsManualItem &&
        !this.validateFormData(data.birthDate, "require_date", {
          conditionDate: new Date(),
        })
      )
        errors.birthDate = Trans("_error_birthDate_require");
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

      if (isPANMandatory) {
        if (!this.validateFormData(data.documentNumber, "require"))
          errors.documentNumber = Trans("_error_pancard_require");


      }
      if (isPANMandatory || isPassportMandatory) {
        if (!this.validateFormData(data.middleName, "require"))
          errors.middleName = Trans("_error_middleName_require");
        else if (data.middleName && !this.validateFormData(data.middleName, "alpha_space"))
          errors.middleName = Trans("Enter valid Middle Name");
      }

      if (isPassportMandatory) {
        if (!this.validateFormData(data.documentNumber, "require"))
          errors.documentNumber = Trans("_error_documentNumber_require");
        else if (!this.validateFormData(data.documentNumber, "alpha_numeric"))
          errors.documentNumber = Trans("_error_documentNumber_alpha_numeric");
        else if (
          !this.validateFormData(data.documentNumber, "length", {
            min: 5,
            max: 20,
          })
        )
          errors.documentNumber = Trans("_error_documentNumber_length");

        //passportExpirationDate
        if (!this.validateFormData(data.passportExpirationDate, "require"))
          errors.passportExpirationDate = Trans(
            "_error_passportExpirationDate_require"
          );
        else if (
          !this.validateFormData(data.passportExpirationDate, "require_date")
        )
          errors.passportExpirationDate = Trans(
            "_error_passportExpirationDate_require"
          );
        else if (
          !this.validateFormData(data.passportExpirationDate, "pastdate", {
            conditionDate: this.props.dateInfo.endDate,
            addMonth: 6,
          })
        )
          errors.passportExpirationDate = Trans(
            "_error_passportExpirationDate_pastdate"
          );

      }

      if (this.props.business !== "groundservice" && this.props.supplierquestions.availableInputs.length > 0) {
        {
          this.props.supplierquestions.availableInputs.length > 0 &&
            [...Array(this.props.supplierquestions.availableInputs.length).keys()].map(inputcount => {
              {
                [...Array(this.props.supplierquestions.availableInputs[inputcount].item.length).keys()].map(count => {
                  let val = "add_";
                  val = val + this.props.supplierquestions.availableInputs[inputcount].item[count].id.toLowerCase();
                  if (!this.validateFormData(data[val], "require"))
                    errors[val] = Trans("_error_additional_require");
                })
              }
            })
        }
      }
    }
    let paxIsValid = true;
    if (this.props.business === "groundservice" && this.state.data.additionalServices.length > 0) {
      this.state.data.additionalServices.filter((x) => x.Selected === true).map((service) => {
        if (service.Quantity <= 0)
          paxIsValid = false;
      });
      if (!paxIsValid) {
        errors["additional"] = Trans("Enter quantity greater than 0");
        this.setState({ isAdditionalServices: true, isvalidAdditionalQuantity: false });
      }
      else {
        this.setState({ isAdditionalServices: false, isvalidAdditionalQuantity: true });
      }
    }
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
    let typestring = this.props.business === "hotel" ? "ADT-CHD" : "";
    let conditiondate =
      (this.props.business === "hotel" || this.props.business === "vehicle")
        ? this.props.data.dateInfo.startDate//this.props.breakDownRateInfo[0].dateInfo.startDate
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

    (this.props.count === 0 || traveler) &&
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

  setAdditionalData = () => {
    let Dynamicstatedata = { ...this.state.data };
    {
      this.props.supplierquestions.availableInputs.length > 0 &&
        [...Array(this.props.supplierquestions.availableInputs.length).keys()].map(inputcount => {
          {
            [...Array(this.props.supplierquestions.availableInputs[inputcount].item.length).keys()].map(count => {
              let val = "add_";
              val = val + this.props.supplierquestions.availableInputs[inputcount].item[count].id.toLowerCase();
              Dynamicstatedata[val] = "";
            })
          }
        })
      this.setState({ data: Dynamicstatedata });
    }
  };

  setAdditionalServiceForGroundservice = () => {
    let additionalservice = [];
    this.props.supplierquestions.availableInputs.filter(
      (x) => x.type === "additionalServices"
    ).map((item) => {
      additionalservice.push({
        name: item.item[0].name,
        id: item.item[0].id,
        code: item.item[0].code,
        value: item.item[0].id,
        maxQuantity: item.item[0].maxQuantity,
        duration: item.item[0].duration,
        amount: item.item[0].amount,
        businessItemToken: item.item[0].id,
        Quantity: 0,
        Selected: false,
        Disabled: true,
      });
    });
    let data = this.state.data;
    data.additionalServices = additionalservice;
    this.setState({ data });
  };

  setAdditionalServiceSelection = (e) => {
    var data = this.state.data;
    var selectedadditionalservice = this.state.data.additionalServices;
    if (selectedadditionalservice.find((x) => x.id === e.target.value).Selected === true) {
      selectedadditionalservice.find((x) => x.id === e.target.value).Selected =
        false;
      selectedadditionalservice.find((x) => x.id === e.target.value).Quantity = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Disabled = true;
    }
    else {
      selectedadditionalservice.find((x) => x.id === e.target.value).Selected =
        true;
      selectedadditionalservice.find((x) => x.id === e.target.value).Quantity = 0;
      selectedadditionalservice.find((x) => x.id === e.target.value).Disabled = false;
    }
    data.additionalServices = selectedadditionalservice;
    this.setState({ data });
  }

  setAdditionalServiceQuantity = (id, e) => {
    var data = this.state.data;
    var selectedadditionalservice = this.state.data.additionalServices;
    selectedadditionalservice.find((x) => x.id === id).Quantity = e.target.value;
    data.additionalServices = selectedadditionalservice;
    this.setState({ data });
  }

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
      this.setAdditionalData();
      this.setAdditionalServiceForGroundservice();
      this.setUserInfo();
      this.getTravelers();
      if (this.props.userInfo.firstName === "" && this.props.userInfo.lastName === "" && localStorage.getItem("quotationDetails") !== undefined)
        this.setuserInfoForTourwiz();
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
    const itemName = Trans("_room") + " : " + this.props.name;
    const GenderList = DropdownList.Gender;
    const { isAdditionalServices, travelers } = this.state;
    let IsManualItem = this.props.data.flags.isManualItem ? true : false;
    let isSkipRequiredValidation = IsManualItem && this.props.count > 0;
    let additionalServicesList = [];
    if (this.props.business !== "groundservice" &&
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

    // else if(this.props.business === "groundservice" &&
    //     this.props.supplierquestions &&
    //     this.props.supplierquestions.availableInputs.filter(
    //       (x) => x.type === "additionalServices"
    //     ).length > 0
    //   )
    //   {
    //     this.props.supplierquestions.availableInputs.filter(
    //       (x) => x.type === "additionalServices"
    //     ).map((item) => {
    //       additionalServicesList.push({
    //         name: item.item[0].name,
    //         nameAR:item.item[0].nameAR,
    //         id:item.item[0].id,
    //         code:item.item[0].code,
    //         value:item.item[0].id,
    //         maxQuantity:item.item[0].maxQuantity,
    //         duration:item.item[0].duration,
    //         amount: item.item[0].amount,
    //         businessItemToken: item.item[0].id,
    //         Quantity:0,
    //         Selected:false,
    //         Disabled:true,
    //       });
    //       return true;
    //     });
    //   }
    let isB2CUmrahPortal = localStorage.getItem("umrahPackageDetails") && localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" && true;
    let isPANMandatory = false;
    let isPassportMandatory = false;
    if (business === "hotel" && (this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPANMandatory").length > 0 || this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPassportMandatory").length > 0)) {
      isPANMandatory = this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPANMandatory")[0].value === "true" ? true : false;
      isPassportMandatory = this.props.data.items[0].item[0].config?.filter(x => x.key === "IsPassportMandatory")[0].value === "true" ? true : false;
    }
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

              <div className="col-lg-3">
                {this.renderSelect("gender", isSkipRequiredValidation ? Trans("_lblGender") : Trans("_lblGenderWithStar"), GenderList)}
              </div>

              <div className="col-lg-3">
                {this.renderInput("firstName", isSkipRequiredValidation ? Trans("_lblFirstName") : Trans("_lblFirstNameWithStar"))}
              </div>

              {(isPANMandatory || isPassportMandatory) &&
                <div className="col-lg-3">
                  {this.renderInput("middleName", Trans("_lblMiddleNameWithStar"))}
                </div>
              }

              <div className="col-lg-3">
                {this.renderInput("lastName", isSkipRequiredValidation ? Trans("_lblLastName") : Trans("_lblLastNameWithStar"))}
              </div>
              {isPANMandatory &&
                <div className="col-lg-3">
                  {this.renderInput("documentNumber", Trans("_lblPanCardWithStar"))}
                </div>
              }

              {isPassportMandatory &&
                <React.Fragment>
                  <div className="col-lg-3">
                    {this.renderInput(
                      "documentNumber",
                      Trans("_lblPassportNumberWithStar")
                    )}
                  </div>
                  <div className="col-lg-3">
                    {this.renderPassportExpiryDate(
                      "passportExpirationDate",
                      Trans("_lblExpiryDateWithStar"),
                      this.props.dateInfo.endDate
                    )}
                  </div>
                </React.Fragment>
              }

              {this.props.business === "air" && this.props.isPaperRateBooking && this.props.isPaperRateBooking === true &&
                <div className="col-lg-3">
                  {this.renderInput("eticketno", Trans("E-Ticket Number"))}
                </div>
              }

              {this.props.business === "hotel" || (!this.props.business && this.props.data.business && (this.props.data.business === "activity" || this.props.data.business === "transfers" || this.props.data.business === "package" || this.props.data.business === "vehicle")) ? (
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
                )}

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
        {(additionalServicesList.length > 0 || this.state.data.additionalServices.length > 0)
          && !isB2CUmrahPortal
          && (
            <div className="col-lg-12 mb-3">
              <button
                className="btn btn-link p-0 m-0 text-primary mr-4"
                onClick={this.handleAdditionalServices}
              >
                {(isAdditionalServices) ? (
                  <i className="fa fa-minus-circle mr-2" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                )}
                {Trans("_lbladditionalServices")}
              </button>
            </div>
          )}

        {isAdditionalServices && (
          <div className="col-lg-12 mb-3 ml-3">
            <div className="row">
              {this.props.business === "groundservice" && (
                <React.Fragment>
                  <table class="ml-2">
                    <tbody>
                      <tr>
                        <th><div className="col-lg-12">{Trans("_service")}</div></th>
                        <th><div className="col-lg-12">{Trans("_filterPrice")}</div></th>
                        <th><div className="col-lg-12">{Trans("_duration")}</div></th>
                        <th><div className="col-lg-12">{Trans("Quantity")}</div></th>
                        <th></th>
                      </tr>

                      {this.state.data.additionalServices
                        .map((item, key) => {
                          return (
                            <tr>
                              <td>
                                <div
                                  className="col-lg-12 custom-checkbox"
                                  key={key}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    value={item.id}
                                    id={"chkAgree" + item.value}
                                    checked={item.Selected
                                    }
                                    onChange={(e) => this.setAdditionalServiceSelection(e)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={"chkAgree" + item.value}
                                  >
                                    {item.name}
                                  </label>
                                </div>
                              </td>
                              <td><div className="col-lg-12" key={key}><Amount amount={item.amount} /></div></td>

                              <td><div className="col-lg-12" key={key}>{item.duration + " " + Trans("_Days")}</div></td>
                              <td>
                                <div className="col-lg-12 form-group" key={key}>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.maxQuantity}
                                    className={
                                      "form-control" +
                                      (!this.state.isvalidAdditionalQuantity && item.Quantity === 0 && item.Selected === true ? " border-danger" : "")
                                    }
                                    disabled={item.Disabled}
                                    onChange={(e) => {
                                      if (e.target.value.indexOf(".") > -1) {
                                        return false;
                                      } else { this.setAdditionalServiceQuantity(item.id, e) }
                                      return true;
                                    }
                                    }
                                    value={item.Quantity}
                                  /></div>
                              </td>
                              <td>
                                <div className="col-lg-12 form-group" key={key}>{Trans("_widgetgroundserviceMax") + " " + item.maxQuantity}</div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </React.Fragment>
              )}
              {this.props.business === "transportation" && this.props.data.items[0].item.map((vehicle, key) => {
                return (
                  <React.Fragment>
                    <h6>
                      {vehicle.name} -{" "}
                      {
                        vehicle.tpExtension?.find(
                          (x) => x.key === "categoryName"
                        ).value
                      }
                      {" ( "}
                      <SVGIcon
                        name="bus-alt"
                        className="mr-2"
                        width="16"
                        height="16"
                        type="fill"
                      />{" "}
                      : {vehicle.quantity}
                      {" ,  "}
                      <SVGIcon
                        name="user-alt"
                        className="mr-2"
                        width="16"
                        height="16"
                        type="fill"
                      />{" "}
                      : {vehicle.availabilityCount} )
                    </h6>
                    {additionalServicesList
                      .filter((x) => x.businessItemToken === vehicle.code)
                      .map((item, key) => {
                        return (
                          <div
                            className="col-lg-12 custom-control custom-checkbox"
                            key={key}
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              value={item.value}
                              id={"chkAgree" + item.value}
                              checked={
                                this.state.data.additionalServices.indexOf(
                                  item.value
                                ) > -1
                              }
                              onChange={this.handleCheckAdditionalServices}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={"chkAgree" + item.value}
                            >
                              {item.name} (<Amount amount={item.amount} />)
                            </label>
                          </div>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {((!isB2CUmrahPortal) || (isB2CUmrahPortal && this.props.business === "hotel")) &&
          (
            <React.Fragment>
              {!this.props.continueAsGuest && portalType && (
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
              )}
            </React.Fragment>
          )}
        {this.props.business !== "groundservice" && this.props.supplierquestions.availableInputs.filter(x => x.type !== "umrahflightdetails").length > 0 && [...Array(this.props.supplierquestions.availableInputs.filter(x => x.type !== "umrahflightdetails").length).keys()].map(inputcount => {
          return (
            <div className="col-lg-12">
              <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
                {Trans("_lbladditionalInformations")}
              </h5>
              {[...Array(this.props.supplierquestions.availableInputs[inputcount].item.length).keys()].map(count => {
                return (
                  (this.props.supplierquestions.availableInputs[inputcount].item[count].type === "Text" ?
                    this.renderInput(
                      "add_" + this.props.supplierquestions.availableInputs[inputcount].item[count].id.toLowerCase()
                      , this.props.supplierquestions.availableInputs[inputcount].item[count].label + " *")

                    : ""
                  )
                )
              })}
            </div>
          )
        })}

      </div>
    );
  }
}

export default Guest;
