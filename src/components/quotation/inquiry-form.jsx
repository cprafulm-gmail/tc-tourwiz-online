import React, { Component } from "react";
import * as Global from "../../helpers/global";
import CustomerAddSelect from "../common/customer-add-select";
import { Trans } from "../../helpers/translate";
import Form from "../common/form";
import moment from "moment";
import Datecomp from "../../helpers/date";
import $ from "jquery";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Select from "react-select";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import TimeField from 'react-simple-timefield';
import { find } from "domutils";

class InquiryForm extends Form {
  state = {
    data: {
      Country: "",
      customerName: "",
      email: "",
      phone: "",
      title: "",
      duration: "",
      startDate: !this.props.editMode
        ? moment().add("10", "days").format('YYYY-MM-DD')
        : this.props.inquiryDetails?.data
          ? moment(this.props.inquiryDetails.data["startDate"]).format('YYYY-MM-DD')
          : moment().add("10", "days").format('YYYY-MM-DD'),
      endDate: moment().add("15", "days").format('YYYY-MM-DD'),
      typetheme: "",
      budget: "",
      inclusions: "",
      adults: "",
      children: "",
      infant: "",
      requirements: "",
      assignmentComment: "",
      inquirySource: "",
      inquirySourceOther: "",
      tripType: "",
      triptypeOther: "",
      inquiryType: "Packages",
      bookingFor: "Individual",
      followupDate: moment().add("9", "days").format('YYYY-MM-DD'),
      referenceby: "",
      status: "New",
      statusOther: "",
      packageOther: "",
      flightclassOther: "",
      railclassOther: "",
      classOther: "",
      itemType: "",
      userID: this.props.employeesOptions.find(x => x.isLoggedinEmployee).value,
      sendEmail: false,
      inquiryNumber: "",
      pickuptime: "",
      followup_time: "00:00",
      classtype: "",
      journeytype: "",
      CountryList: [],
      priority: "",
    },
    priority: "",
    errors: {},
    sendEmail: false,
    employeesOptions: this.props.employeesOptions,
    isshowauthorizepopup: false,
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";
    else if (!this.validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/))
      errors.customerName = "< and > characters not allowed";

    if (data.email && !this.validateFormData(data.email, "email")) errors.email = "Invalid Email";

    if (!this.validateFormData(data.phone, "require") || data.phone === "1-" || data.phone.split('-')[1] === "") errors.phone = "Phone required";

    if (data.phone)
      if (!this.validateFormData(data.phone, "phonenumber")) errors.phone = "Invalid Contact Phone";

    if (
      !this.validateFormData(data.phone, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.phone = Trans("_error_mobilenumber_phonenumber_length");
    if (!this.validateFormData(data.title, "require")) {
      this.state.data.inquiryType.toLowerCase() !== 'visa'
        ? errors.title = "Required"
        : errors.title = "Please select Country";
    }
    if (data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rail' || this.state.data.inquiryType.toLowerCase() === 'bus' || this.state.data.inquiryType.toLowerCase() === 'rent a car') {
      if (!this.validateFormData(data.destinationlocation, "require")) errors.destinationlocation = "Required";
    }


    if (data.title && !this.validateFormData(data.title, "special-characters-not-allowed", /[<>]/))
      errors.title = "< and > characters not allowed";

    if (data.referenceby && !this.validateFormData(data.referenceby, "special-characters-not-allowed", /[<>]/))
      errors.referenceby = "< and > characters not allowed";

    if (data.inquiryType.toLowerCase() !== 'forex' && data.inquiryType.toLowerCase() !== 'air' && data.inquiryType.toLowerCase() !== 'transfers' && this.state.data.inquiryType.toLowerCase() !== 'rail') {

      if ((data.inquiryType.toLowerCase() === "flight"
        || data.inquiryType.toLowerCase() === "hotel"
        || data.inquiryType.toLowerCase() === "activity"
        || data.inquiryType.toLowerCase() === "packages"
        || data.inquiryType.toLowerCase() === "visa") && !this.validateFormData(data.duration, "require")) errors.duration = "Duration required";

      if (data.duration && !this.validateFormData(data.duration, "special-characters-not-allowed", /[<>.-]/)) errors.duration = "Please enter duration in numeric only";

      if ((data.inquiryType.toLowerCase() === "flight"
        || data.inquiryType.toLowerCase() === "hotel"
        || data.inquiryType.toLowerCase() === "packages"
        || data.inquiryType.toLowerCase() === "visa") &&
        isNaN(data.duration))
        errors.duration = "Please enter duration in numeric only";

      if (parseInt(data.duration) < 0) errors.duration = "Duration must be greater than or equal to zero";
    }
    if (data.inquiryType.toLowerCase() === "activity"
      && (!isNaN(this.state.data.duration))
    )
      errors.duration = "Duration required";

    if (data.adults && !this.validateFormData(data.adults, "only-numeric")) errors.adults = "Please enter adults in numeric only";

    if (data.children && !this.validateFormData(data.children, "only-numeric")) errors.children = "Please enter children in numeric only";

    if (data.infant && !this.validateFormData(data.infant, "only-numeric")) errors.infant = "Please enter infant(s) in numeric only";

    if (data.adults && !this.validateFormData(data.adults, "length", { min: 0, max: 2 })) errors.adults = "Adults count must be between 0 to 99.";

    if (data.children && !this.validateFormData(data.children, "length", { min: 0, max: 2 })) errors.children = "Children count must be between 0 to 99.";

    if (data.infant && !this.validateFormData(data.infant, "length", { min: 0, max: 2 })) errors.infant = "Infants count must be between 0 to 99.";

    if (data.adults !== "" && Number(data.adults) < 0) errors.adults = "Adults must be greater than zero";

    if (data.children !== "" && Number(data.children) < 0) errors.children = "Children must be greater than zero";

    if (data.infant !== "" && Number(data.infant) < 0) errors.infant = "Infant(s) must be greater than zero";

    if (data.budget !== "" && !this.validateFormData(data.budget, "numeric")) errors.budget = "Please enter budget in decimal only";

    if (data.budget !== "" && Number(data.budget) < 0) errors.budget = "Budget must be greater than zero";

    if (data.requirements && !this.validateFormData(data.requirements, "special-characters-not-allowed", /[<>]/))
      errors.requirements = "< and > characters not allowed";

    if (data.statusOther && !this.validateFormData(data.statusOther, "special-characters-not-allowed", /[<>]/))
      errors.statusOther = "< and > characters not allowed";
    if (this.state.CountryList?.map(item => item.countryName).includes(data.title) === false
      && this.state.data.inquiryType.toLowerCase() === 'visa') {
      errors.title = "Please select Country"
    }
    if (data.title)
      if (!this.validateFormData(data.title, "require")) {
        this.state.data.inquiryType.toLowerCase() !== 'visa'
          ? errors.title = "Required"
          : errors.title = "Please select Country";
      }

    if (this.props.inquiryDetails?.data && (this.props.inquiryDetails.data.userID !== this.state.data.userID
      || moment(this.props.inquiryDetails.data.followupDate).format('YYYY-MM-DD') !== moment(this.state.data.followupDate).format('YYYY-MM-DD')
      || (this.state.data.status !== 'Other' && this.props.inquiryDetails.data.status !== this.state.data.status))
    ) {
      if (!this.validateFormData(data.assignmentComment, "require"))
        errors.assignmentComment = "Comments required";
    }
    if (this.props.editMode === true && this.state.data.status === 'Other' && this.props.inquiryDetails?.data.statusOther
      !== this.state.data.statusOther) {
      if (!this.validateFormData(data.assignmentComment, "require"))
        errors.assignmentComment = "Comments required";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  setData = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info")); //bookingForInfo

    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName =
      (bookingForInfo && bookingForInfo.displayName) ?? '';

    defautData.email =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";

    defautData.phone =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";
    defautData.status = this.props.status ? this.props.status : "New";
    if (defautData.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
      defautData.email = "";

    this.setState({ data: defautData });
  };

  getCountryList = () => {
    const { userInfo: { agentID } } = this.props;
    const reqOBJ = {
      request: {
      }
    };
    let reqURL = "admin/lookup/country";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
      this.setState({ CountryList: resonsedata.response })
    }.bind(this), "POST");
  }

  handleInquirySubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    let data = Object.assign({}, this.state.data);
    data.startDate = moment(data.startDate).format("YYYY-MM-DD");
    if (Number(data.duration) === 0)
      data.duration = 0;
    else {
      data.duration = data.duration || 4;
    }
    if (data.inquiryType.toLowerCase() === 'air' || data.inquiryType.toLowerCase() === 'rail' || data.inquiryType.toLowerCase() === 'bus') {
      data.duration = this.GetDuration(data.startDate, data.endDate);
    }

    if (data.inquiryType.toLowerCase() !== 'air' && data.inquiryType.toLowerCase() !== 'rail' && data.inquiryType.toLowerCase() !== 'bus')
      data.endDate = moment(data.startDate).add(Number(data.duration), "days").format("YYYY-MM-DD");

    if (data.inquiryType.toLowerCase() !== 'hotel' && Number(data.duration) >= 1)
      data.endDate = moment(data.endDate).add(Number(-1), "days").format("YYYY-MM-DD");

    if (data.inquiryType.toLowerCase() === 'air' || data.inquiryType.toLowerCase() === 'rail' || data.inquiryType.toLowerCase() === 'bus')
      data.endDate = moment(data.endDate).add(Number(1), "days").format("YYYY-MM-DD");

    data.followupDate = moment(data.followupDate).format("YYYY-MM-DD");
    data.budget = isNaN(data.budget) ? 0 : data.budget;
    data.status = data.status === "Other" && data.statusOther ? data.statusOther : data.status;
    data.classtype = data.classtype === "Other"
      && data.inquiryType.toLowerCase() === 'packages'
      ? data.packageOther
      : data.classtype === "Other"
        && data.inquiryType.toLowerCase() === 'air'
        ? data.flightclassOther
        : data.classtype === "Other"
          && data.inquiryType.toLowerCase() === 'rail'
          ? data.railclassOther
          : data.classtype;
    data.inquirySource = data.inquirySource === "Other" && data.inquirySourceOther ? data.inquirySourceOther : data.inquirySource;
    data.SocialMediaSource = data.inquirySource === "Social Media" ? data.referenceby : "";
    data.tripType = data.tripType === "Other" && data.triptypeOther ? data.triptypeOther : data.tripType;
    data.sendEmail = this.state.sendEmail;
    data.priority = data.priority;
    //this.state.priority = data.priority;
    this.props.handleInquiry(data);
  };

  setInquiryData = () => {
    if (!this.props.inquiryDetails?.data) {
      this.setState({ errorMessage: "Inquiry not found" });
      return false;
    }
    let inquiryDetails = this.props.inquiryDetails.data;
    inquiryDetails["status"] = this.props.status;
    if (inquiryDetails.followupDate === undefined)
      inquiryDetails["followupDate"] = moment();
    if (inquiryDetails.budget === "00.00")
      inquiryDetails["budget"] = "0.00";
    inquiryDetails["phoneNotoValidate"] = inquiryDetails["phone"];
    inquiryDetails['inquiryType'] = inquiryTypeList.find(x => x.name.toLowerCase() === (inquiryDetails['inquiryType'].toLowerCase() === "air" ? "flight" : inquiryDetails['inquiryType'].toLowerCase())).value;
    if (statusList.filter(x => x.value.toLowerCase() === inquiryDetails["status"].toLowerCase()).length === 0) {
      inquiryDetails["statusOther"] = inquiryDetails["status"];
      inquiryDetails["status"] = "Other";
    }
    if (tripTypeList.filter(x => x.value.toLowerCase() === inquiryDetails["tripType"].toLowerCase()).length === 0) {
      inquiryDetails["triptypeOther"] = inquiryDetails["tripType"];
      inquiryDetails["tripType"] = inquiryDetails["tripType"];//"Other";
    }
    if (inquiryDetails['inquiryType'].toLowerCase() === "visa" &&
      tripTypeListVisa.filter(x => x.value.toLowerCase() === inquiryDetails["tripType"].toLowerCase()).length === 0) {
      inquiryDetails["triptypeOther"] = inquiryDetails["tripType"];
      inquiryDetails["tripType"] = "Other";
    }

    if (inquiryDetails['inquiryType'].toLowerCase() === "rail"
      && tripTypeOtherRailList.filter(x => x.value.toLowerCase() === inquiryDetails["classtype"].toLowerCase()).length === 0) {
      inquiryDetails["railclassOther"] = inquiryDetails["classtype"];
      inquiryDetails["classtype"] = "Other";
    }
    if (inquiryDetails['inquiryType'].toLowerCase() === "packages"
      && tripTypePackageList.filter(x => x.value.toLowerCase() === inquiryDetails["classtype"]?.toLowerCase()).length === 0) {
      inquiryDetails["packageOther"] = inquiryDetails["classtype"];
      inquiryDetails["classtype"] = "Other";
    }
    if (inquiryDetails['inquiryType'].toLowerCase() === "air" &&
      classTypeAir.filter(x => x.value.toLowerCase() === inquiryDetails["classtype"].toLowerCase()).length === 0) {
      inquiryDetails["flightclassOther"] = inquiryDetails["classtype"];
      inquiryDetails["classtype"] = "Other";
    }
    if ((this.props.inquiryDetails.data.inquirySource.toLowerCase() !== "website" && this.props.inquiryDetails.data.inquirySource.toLowerCase() !== "marketplace") && inquirySourceList.filter(x => x.value.toLowerCase() === inquiryDetails["inquirySource"].toLowerCase()).length === 0) {
      inquiryDetails["inquirySourceOther"] = inquiryDetails["inquirySource"];
      inquiryDetails["inquirySource"] = "Other";
    }

    inquiryDetails["userID"] = this.props.inquiryDetails.userID;
    if (inquiryDetails["email"].endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
      inquiryDetails["email"] = "";
    if (this.props.inquiryDetails.data.inquirySource.toLowerCase() === "website" && this.props.editMode) {
      var inquirySourceElement = {};
      inquirySourceElement.name = "Website";
      inquirySourceElement.value = "Website";
      this.props.editMode && inquirySourceList.push(inquirySourceElement);
    }
    if (this.props.inquiryDetails.data.inquirySource.toLowerCase() === "marketplace" && this.props.editMode) {
      var inquirySourceElement = {};
      inquirySourceElement.name = "Marketplace";
      inquirySourceElement.value = "Marketplace";
      this.props.editMode && inquirySourceList.push(inquirySourceElement);
    }
    inquiryDetails["priority"] = this.props.inquiryDetails.priority;
    inquiryDetails["inquiryNumber"] = this.props.inquiryDetails.inquiryNumber;
    this.setState({ data: inquiryDetails });
  };

  handleSendEmail = () => {
    this.setState({ sendEmail: !this.state.sendEmail });
  };

  ajaxRequester = (reqURL, reqOBJ, callback) => {
    $.ajax({
      type: "POST",
      url: reqURL,
      data: reqOBJ,
      dataType: "JSON",
      success: function (data) {
        callback();
      },
      error: function (err) {
        callback();
        console.log("err", err);
      },
    });
  };

  quotationSuccess = () => {
    this.setState({
      isSucessMsg: !this.state.isSucessMsg,
    });
    setTimeout(() => {
      this.setState({ isSucessMsg: false });
    }, 5000);
  };

  componentDidMount() {
    if (inquirySourceList.length > 8)
      inquirySourceList.pop()
    !this.props.editMode ? this.setData() : this.setInquiryData();
    this.getCountryList();
  }

  getEmployees(callback) {
    let reqOBJ = { Request: { IsActive: true, PageNumber: 0, PageSize: 0 } };
    let reqURL = "admin/employee/list";
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.error) {
          data.response = [];
        }
        if (data.response.length > 0) {
          let employeesOptions = data.response.map(item => {
            return {
              label: item.fullName ?? item.firstName + " " + item.lastName,
              value: item.userID,
              isLoggedinEmployee: item.isLoggedinEmployee,
            }
          });

          let stateData = this.state.data;
          stateData.userID = employeesOptions.find(x => x.isLoggedinEmployee).value;
          this.setState({ employeesOptions, isLoadingEmployees: false, data: stateData }, () => callback())
        }
        else {
          this.setState({ employeesOptions: [], isLoadingEmployees: false }, () => callback())
        }
      }.bind(this),
      "POST"
    );
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  changeCustomerType = (Type) => {
    let newData = { ...this.state.data };
    newData.bookingFor = Type;
    if (Type === "Corporate" && AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "inquiries~create-inquiry-corporate")) {
      // if (Type === 'Corporate' && false) {
      this.setState({ data: newData });
    }
    else if (Type === "Individual") {
      this.setState({ data: newData });
    }
    else {
      this.setState({ isshowauthorizepopup: true })
    }
  };
  handleCustomerChange = (bookingForInfo) => {
    let defautData = { ...this.state.data };
    defautData.customerName = (bookingForInfo && bookingForInfo.displayName) ?? '';
    defautData.email = bookingForInfo && bookingForInfo.contactInformation ? bookingForInfo.contactInformation.email : "";
    defautData.phone = bookingForInfo && bookingForInfo.contactInformation ? bookingForInfo.contactInformation.phoneNumber : "";
    this.setState({ data: defautData });
  }
  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    const { employeesOptions } = this.state;
    let CountryList = this.state.CountryList;
    if (CountryList) {
      CountryList = CountryList.map(option => {
        return {
          label: option["countryName"],
          value: option["countryId"],
        }
      });
    }
    const { bookingFor } = this.state.data;
    const { isErrorMsg, isSucessMsg, isBtnLoading, isBtnLoading_activityLog, editMode, userInfo } = this.props;
    const { contactInformation, location, provider } = userInfo;
    const customStyles = {
      control: styles => ({ ...styles, "textTransform": "capitalize" }),
      option: styles => ({ ...styles, "textTransform": "capitalize" }),
      menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
    };
    let title = "Inquiry Title / Details*";
    let tripTypeOther = "";
    let tripType = "Trip Type";
    let otherRequirements = "Other Requirements";
    let destinationLocation = "Drop Off Location"

    if (this.state.data.inquiryType.toLowerCase() === "packages") {
      title = 'Package Name*';
      tripTypeOther = 'Package Type';

    }
    else if (this.state.data.inquiryType.toLowerCase() === "air") {
      title = 'Sector *';
      tripTypeOther = 'Journey Type';
    }
    else if (this.state.data.inquiryType.toLowerCase() === "hotel") {
      title = 'Hotel Name/Location/City *';
      tripTypeOther = 'Star Rating';
    }
    else if (this.state.data.inquiryType.toLowerCase() === "activity") {
      title = 'Activity / Sighteeings / Type *';
    }
    else if (this.state.data.inquiryType.toLowerCase() === "visa") {
      title = 'Country / Type *';
      tripType = 'Category';
      otherRequirements = "Nationality / Documents Recieved / Remarks";
    }
    else if (this.state.data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rent a car') {
      title = 'Pick Up Location *';
      destinationLocation = 'Drop Off Location *';
    }
    else if (this.state.data.inquiryType.toLowerCase() === 'rail') {
      title = 'Destination From *';
      destinationLocation = 'Destination To *';
      tripTypeOther = 'Class';

    }
    else if (this.state.data.inquiryType.toLowerCase() === 'forex') {
      title = 'Currency Type*';
    }
    else if (this.state.data.inquiryType.toLowerCase() === 'bus') {
      title = 'Destination From *';
      destinationLocation = 'Destination To *';
    }
    else if (this.state.data.inquiryType.toLowerCase() === 'rent a car') {
      title = 'Pick Up Location *';
      destinationLocation = 'Drop Off Location *';
    }
    return (
      <React.Fragment>
        {this.state.errorMessage ?
          <div className="row">
            <div class="alert alert-danger" role="alert">
              {this.state.errorMessage}
            </div>
          </div>
          :
          <div className="border p-3 mt-3 bg-white shadow-sm mb-3 position-relative">
            <div className="row">
              <div className="col-lg-3">
                {/* {this.renderSelect("bookingFor", "Booking For Source", bookingForList)} */}
                <div className="BE-Search-Radio pt-1">
                  <label className="d-block">Booking For Source</label>
                  {this.props.editMode
                    ? <button className="btn btn-primary w-100 btn-sm">{this.state.data.bookingFor === '' ? 'Individual' : this.state.data.bookingFor}</button>
                    : <ul>
                      <li className="checked">
                        <input
                          checked={this.state.data.bookingFor === "Individual" ? true : false}
                          value="Individual"
                          name="Direction"
                          type="radio"
                          onChange={() => this.changeCustomerType("Individual")}
                        />
                        <label>Individual</label>
                      </li>
                      <li>
                        <input
                          value="Corporate"
                          name="Direction"
                          type="radio"
                          checked={this.state.data.bookingFor === "Corporate" ? true : false}
                          onChange={() => this.changeCustomerType("Corporate")}
                        />
                        <label>Corporate</label>
                      </li>
                    </ul>}
                </div>
              </div>
              {bookingFor === "Individual"
                ? <div className="col-lg-6">
                  <CustomerAddSelect
                    key={"Customer"}
                    labelName="Individual"
                    isReadOnly={editMode}
                    userInfo={this.props.userInfo}
                    errors={this.state.errors}
                    handleChange={this.handleCustomerChange}
                    selectedCustomer={editMode
                      ? {
                        "name": this.props.inquiryDetails.data.customerName,
                        "contactInformation": {
                          "email": this.props.inquiryDetails.data.email,
                          "phoneNumber": this.props.inquiryDetails.data.phone
                        }
                      }
                      : null}
                  />
                </div>
                : <div className="col-lg-6">
                  <CustomerAddSelect
                    key={"Corporate"}
                    labelName="Corporate"
                    isReadOnly={editMode}
                    userInfo={this.props.userInfo}
                    errors={this.state.errors}
                    handleChange={this.handleCustomerChange}
                    selectedCustomer={editMode
                      ? {
                        "name": this.props.inquiryDetails.data.customerName,
                        "contactInformation": {
                          "email": this.props.inquiryDetails.data.email,
                          "phoneNumber": this.props.inquiryDetails.data.phone
                        }
                      }
                      : null}
                  />
                </div>
              }
              <div className="col-lg-3">
                {this.renderSelect("inquiryType", "Inquiry Type", inquiryTypeList)}
              </div>
              {this.state.data.inquiryType.toLowerCase() !== 'visa' &&
                <div className="col-lg-3">{this.renderInput("title", title)}</div>}
              {
                (this.state.data.inquiryType.toLowerCase() === "transfers"
                  || this.state.data.inquiryType.toLowerCase() === "bus"
                  || this.state.data.inquiryType.toLowerCase() === 'rent a car'
                  || this.state.data.inquiryType.toLowerCase() === 'rail') &&
                <div className="col-lg-3">{this.renderInput("destinationlocation", destinationLocation)}</div>
              }
              {this.state.data.inquiryType.toLowerCase() === 'visa' &&
                <div className="col-md-3">
                  <div className={"form-group"}>
                    <label htmlFor={"Country"}>{"Country *"}</label>
                    <Select
                      styles={customStyles}
                      placeholder="Select Country..."
                      id={"CountryID"}
                      value={CountryList?.find(x => x.label === this.state.data.title)}
                      options={CountryList}
                      onChange={(e) => { this.handleChange({ currentTarget: { value: e.label, name: "title" } }) }}
                      name={"Country"}
                      noOptionsMessage={() => "No Country(s) available"}
                    />
                  </div>
                  {this.state.errors["title"] && (
                    <small className="alert alert-danger p-1 d-inline-block">
                      {this.state.errors["title"]}
                    </small>
                  )}
                </div>
              }

              {
                (this.state.data.inquiryType.toLowerCase() === "packages"
                  || this.state.data.inquiryType.toLowerCase() === "hotel"
                  || this.state.data.inquiryType.toLowerCase() === 'rail'
                ) &&
                <div className="col-lg-3">
                  {this.renderSelect("classtype", tripTypeOther,
                    this.state.data.inquiryType.toLowerCase() === 'hotel' ? tripTypeOtherHotelList
                      : this.state.data.inquiryType.toLowerCase() === 'rail' ? tripTypeOtherRailList
                        : tripTypePackageList
                  )}
                </div>
              }
              {this.state.data.inquiryType.toLowerCase() === "rail" && this.state.data.classtype === "Other" &&
                <div className="col-lg-3">
                  {this.renderInput("railclassOther", "Class (Other)", "text", false, null, 0, 50)}
                </div>
              }
              {this.state.data.inquiryType.toLowerCase() === "packages" && this.state.data.classtype === "Other" &&
                <div className="col-lg-3">
                  {this.renderInput("packageOther", "Package Type (Other)", "text", false, null, 0, 50)}
                </div>
              }
              {
                this.state.data.inquiryType.toLowerCase() === "air" &&
                <div className="col-lg-3">
                  {this.renderSelect("classtype", "Class", classTypeAir)}
                </div>
              }
              {this.state.data.inquiryType.toLowerCase() === "air" && this.state.data.classtype === "Other" &&
                <div className="col-lg-3">
                  {this.renderInput("flightclassOther", "Class (Other)", "text", false, null, 0, 50)}
                </div>
              }
              {
                this.state.data.inquiryType.toLowerCase() === "air" &&
                <div className="col-lg-3">
                  {this.renderSelect("journeytype", tripTypeOther, tripTypeOtherAirList)}
                </div>
              }


              <div className="col-lg-3">
                {this.renderSelect("tripType", tripType,
                  this.state.data.inquiryType.toLowerCase() === "visa" ? tripTypeListVisa
                    : tripTypeList
                )}
              </div>
              {
                this.state.data.inquiryType.toLowerCase() === "visa" && this.state.data.tripType === "Other" &&
                <div className="col-lg-3">
                  {this.renderInput("triptypeOther", "Category (Other)", "text", false, null, 0, 50)}
                </div>
              }
              <div className="col-lg-3">
                {this.renderSelect("inquirySource", "Inquiry Source", inquirySourceList, undefined, undefined,
                  this.props.inquiryDetails !== undefined
                    && this.props.inquiryDetails?.data && (this.props.inquiryDetails.data.inquirySource.toLowerCase() === "website" || this.props.inquiryDetails.data.inquirySource.toLowerCase() === "marketplace") && this.props.editMode
                    ? true : false)}
              </div>
              {(this.state.data.inquirySource === "Referred By") &&
                <div className="col-lg-3">
                  {this.renderInput("referenceby", this.state.data.inquirySource === "Referred By" ? "Referred By" : "Social Media")}
                </div>
              }
              {(this.state.data.inquirySource === "Social Media") &&
                <div className="col-lg-3">
                  {this.renderSelect("referenceby", "Social Media", SocialMediaSource, undefined, undefined,
                    this.props.inquiryDetails !== undefined
                      && this.props.inquiryDetails?.data && (this.props.inquiryDetails.data.inquirySource.toLowerCase() === "website" || this.props.inquiryDetails.data.inquirySource.toLowerCase() === "marketplace") && this.props.editMode
                      ? true : false)}
                </div>}
              {(this.state.data.inquirySource === "Other") &&
                <div className="col-lg-3">
                  {this.renderInput("inquirySourceOther", "Inquiry Source (Other)", "text", false, null, 0, 50)}
                </div>
              }


              {/* <div className="col-lg-3">
            {this.renderSelect("bookingFor", "Booking For Source", bookingForList)}
          </div> */}

              <div className="col-lg-3">
                {this.renderSelect("status", "Status", statusList)}
              </div>

              {this.state.data.status === "Other" &&
                <div className="col-lg-3">
                  {this.renderInput("statusOther", "Status (Other)", "text", false, null, 0, 50)}
                </div>
              }

              <div className="col-lg-3">
                {this.state.data.inquiryType.toLowerCase() === 'forex' &&
                  this.renderCurrentDateWithDuration("startDate",
                    (this.state.data.inquiryType.toLowerCase() === 'air' || this.state.data.inquiryType.toLowerCase() === 'rail') ? "Departure Date"
                      : this.state.data.inquiryType.toLocaleLowerCase() === 'hotel' ? "Check In"
                        : (this.state.data.inquiryType.toLowerCase() === "visa" || this.state.data.inquiryType.toLowerCase() === 'forex') ? "Travel Date"
                          : this.state.data.inquiryType.toLowerCase() === 'transfers' ? "Pickup Date"
                            : "Start Date", moment('2001-01-01').format('YYYY-MM-DD'))
                }
                {this.state.data.inquiryType.toLowerCase() !== 'forex' &&
                  <div className="row">
                    <React.Fragment>
                      <div className="col-lg-6">
                        {this.renderCurrentDateWithDuration("startDate", (this.state.data.inquiryType.toLowerCase() === 'air' || this.state.data.inquiryType.toLowerCase() === 'rail') ? "Departure Date" : this.state.data.inquiryType.toLocaleLowerCase() === 'hotel' ? "Check In" : this.state.data.inquiryType.toLowerCase() === "visa" ? "Travel Date" : (this.state.data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rent a car') ? "Pickup Date" : "Start Date", moment('2001-01-01').format('YYYY-MM-DD'))}
                      </div>
                      <div className="col-lg-6">
                        {this.state.data.inquiryType.toLowerCase() === 'air'
                          || this.state.data.inquiryType.toLowerCase() === 'rail'
                          || this.state.data.inquiryType.toLowerCase() === 'bus' ? this.renderCurrentDateWithDuration("endDate", "Arrival Date", moment('2001-01-01').format('YYYY-MM-DD'))
                          : (this.state.data.inquiryType.toLowerCase() === 'transfers' || this.state.data.inquiryType.toLowerCase() === 'rent a car')
                            ? (<div class="form-group pickuptime">
                              <label for="pickuptime">Pickup Time</label>
                              <TimeField
                                class="form-control w-100"
                                name="pickuptime"
                                input={null}
                                value={this.state.data.pickuptime}
                                onChange={e => this.handleChange({ currentTarget: e.target })}
                              />
                            </div>)
                            : this.state.data.inquiryType.toLowerCase() === 'activity' ? this.renderSelect("duration", "Duration *", durationList)
                              : this.renderInput("duration", this.state.data.inquiryType.toLowerCase() === 'visa'
                                ? "Duration (Days)*"
                                : this.state.data.inquiryType.toLowerCase() === 'packages'
                                  ? "Duration (Days)*"
                                  : "Duration (Nights)*")
                        }
                      </div>
                    </React.Fragment>
                  </div>
                }

              </div>

              <div className="col-lg-3">
                {<div className="row">
                  <React.Fragment>
                    <div className="col-lg-6">
                      {this.renderCurrentDateWithDuration(
                        "followupDate",
                        "Followup Date",
                        moment(this.state.data.startDate).isSameOrBefore(moment(), "day") ? this.state.data.startDate : moment().format('YYYY-MM-DD'),
                        moment(this.state.data.startDate).add(
                          moment(this.state.data.startDate).isSameOrBefore(moment(), "day") ? 0 : -1, 'days').format('YYYY-MM-DD'))
                      }
                    </div>
                    <div className="col-lg-6">
                      <div class="form-group followup_time">
                        <label for="followup_time">Followup Time</label>
                        <TimeField
                          class="form-control w-100"
                          name="followup_time"
                          input={null}
                          value={this.state.data.followup_time}
                          onChange={e => this.handleChange({ currentTarget: e.target })}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                </div>
                }
              </div>
              <div className="col-lg-3">
                {this.renderInput("budget", this.state.data.inquiryType.toLowerCase() === 'forex' ? "Amount" : "Budget (" + portalCurrency + ")", "Amit")}
              </div>

              {this.state.data.inquiryType.toLowerCase() !== 'forex' &&
                <div className="col-lg-3">
                  <div className="row">
                    <div className="col-lg-4">{this.renderInput("adults", "Adults")}</div>
                    <div className="col-lg-4">{this.renderInput("children", "Children")}</div>
                    <div className="col-lg-4">{this.renderInput("infant", this.state.data.inquiryType.toLowerCase() === 'visa' ? "Infant" : "Infant(s)")}</div>
                  </div>
                </div>
              }
              <div className="col-md-3">
                <div className={"form-group"}>
                  <label htmlFor={"employees"}>{"Assigned To"}</label>
                  <Select
                    styles={customStyles}
                    placeholder="Select Employee..."
                    id={"employees"}
                    defaultValue={employeesOptions.find(x => x.isLoggedinEmployee)}
                    value={employeesOptions.find(x => x.value === this.state.data.userID)}
                    options={employeesOptions}
                    onChange={(e) => {
                      this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                    }}
                    noOptionsMessage={() => "No employee(s) available"}
                    isLoading={this.state.isLoadingEmployees}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className={"form-group"}>
                  <label htmlFor={"priority"}>{"Priority"}</label>
                  <Select
                    styles={customStyles}
                    placeholder="Select priority..."
                    id={"priority"}
                    value={prioritylist.find(x => x.value === this.state.data.priority)}
                    options={prioritylist}
                    onChange={(e) => {
                      this.handleChange({ currentTarget: { value: e.value, name: "priority" } })
                    }}
                    noOptionsMessage={() => "No priority(s) available"}
                    isLoading={this.state.isLoadingEmployees}
                  />
                </div>
              </div>
              {this.props.editMode &&
                <div className="col-lg-3">
                  {this.renderInput("inquiryNumber", "Inquiry Number", "tex", true,)}
                </div>}
              {(this.props.inquiryDetails?.data
                && (this.props.inquiryDetails.data.userID !== this.state.data.userID
                  || this.props.inquiryDetails.data.statusOther !== this.state.data.statusOther
                  || this.props.inquiryDetails.data.status !== this.state.data.status
                  || this.props.inquiryDetails.data.followupDate.slice(0, 10) !== this.state.data.followupDate.slice(0, 10)))
                && <div className="col-lg-12">
                  {this.renderTextarea("assignmentComment", "Comments *")}
                </div>
              }
              <div className="col-lg-12">
                {this.renderTextarea("requirements", otherRequirements)}
              </div>

              <div className="col-lg-12">
                <div className=" custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="sendEmail"
                    name="sendEmail"
                    checked={this.state.sendEmail}
                    onChange={this.handleSendEmail}
                  />
                  <label className="custom-control-label" htmlFor="sendEmail">
                    Send Email?
                  </label>
                </div>
              </div>

              {isSucessMsg && (
                <div className="col-lg-12">
                  <h6 className="alert alert-success mt-3 d-inline-block">
                    Inquiry {!editMode ? "Added" : "Updated"} Successfully!
                  </h6>
                </div>
              )}

              {isErrorMsg && (
                <div className="col-lg-12">
                  <h6 className="alert alert-danger mt-3 d-inline-block">
                    {isErrorMsg}
                  </h6>
                </div>
              )}

              {(!isSucessMsg || isErrorMsg) && (
                <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                  {((editMode && (this.props.inquiryDetails?.isEditable ?? false)) || !editMode) &&
                    <div className="col-lg-2 mt-2">
                      <div className="form-group">
                        {!isBtnLoading ?
                          <button onClick={() => this.handleInquirySubmit()}
                            className="btn btn-primary w-100 text-capitalize">
                            Save
                          </button> : <button className="btn btn-primary w-100 text-capitalize" >
                            <span className="spinner-border spinner-border-sm mr-2"></span> Save
                          </button>
                        }
                      </div>
                    </div>}
                </AuthorizeComponent>
              )}
              {(!isSucessMsg || isErrorMsg) && (
                <div className="col-lg-2 mt-2">
                  <div className="form-group">
                    <button
                      onClick={() => this.props.history.push("/InquiryList")}
                      className="btn btn-primary w-100 text-capitalize"
                    > Cancel
                    </button>
                  </div>
                </div>
              )}
              {this.props.editMode &&
                <div className="col-lg-3 mt-2">
                  <div className="form-group">
                    {/* <AuthorizeComponent title="InquiryDetails~inquiries-activity-log" type="button" rolepermissions={userInfo.rolePermissions}> */}
                    <button
                      className="btn btn-primary mr-3 text-capitalize"
                      onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                        "InquiryDetails~inquiries-activity-log")
                        ? this.props.getActivityLogDetails()
                        : this.setState({ isshowauthorizepopup: true })
                      }
                    >
                      {isBtnLoading_activityLog && <span className="spinner-border spinner-border-sm mr-2"></span>}
                      Show Activity Log
                    </button>
                    {/* </AuthorizeComponent> */}
                  </div>
                </div>
              }
              {isSucessMsg && !editMode && (
                <div className="col-lg-12 mt-2">
                  <div className="form-group text-center inquiry-success-btns">
                    <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        className="btn btn-primary mr-3 text-capitalize"
                        onClick={this.props.handleNewInquiry}
                      >
                        {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                        Create New Inquiry
                      </button>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="InquiryList~inquiries-add-itinerary" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        id="addItinery"
                        className="btn btn-primary mr-3 text-capitalize"
                        onClick={this.props.handleAddItinerary}
                      >
                        {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                        Add Itinerary
                      </button>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="InquiryList~inquiries-add-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        id="addProposal"
                        className="btn btn-primary mr-3 text-capitalize"
                        onClick={this.props.handleAddQuotation}
                      >
                        {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                        Add {Trans("_quotationReplaceKey")}
                      </button>
                    </AuthorizeComponent>
                    {/* <AuthorizeComponent title="InquiryList~inquiries-add-package" type="button" rolepermissions={userInfo.rolePermissions}>
                      <button
                        id="addItinery"
                        className="btn btn-primary mr-3 text-capitalize"
                        onClick={this.props.handleAddPackage}
                      >
                        {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                        Add Package
                      </button>
                    </AuthorizeComponent> */}
                  </div>
                </div>
              )}

              <div style={{ display: "none" }}>
                <div id="emailHTML" className="mt-4">
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border="0"
                    width="800px"
                    style={{ border: "solid 2px #434C5B" }}>
                    <tbody>
                      <tr>
                        <td>
                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                            <tbody>
                              <tr>
                                <td>
                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td
                                          style={{
                                            background: "#434C5B",
                                            padding: "8px 16px",
                                            color: "#ffffff",
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {"Inquiry Details"}
                                          <img
                                            src={userInfo?.provider?.logo?.url ? userInfo?.provider?.logo?.url
                                              : Global.getEnvironmetKeyValue("portalLogo")}
                                            height="32px"
                                            style={{
                                              height: "32px",
                                              background: "#fff",
                                              borderRadius: "4px",
                                              float: "right",
                                              padding: "0px 4px",
                                            }}
                                            alt=""
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ padding: "16px" }}>
                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                            <tbody>
                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>Dear {this.state.data.customerName},</span>
                                                </td>
                                              </tr>

                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>
                                                    Following your recent inquiry details:
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                            <tbody>
                                              <tr>
                                                <td width="20%">
                                                  <span>Inquiry Type:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.inquiryType !== "" ? this.state.data.inquiryType : "--"}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Name:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.customerName}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Email:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.email}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Contact Phone:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.phone}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Inquiry Title / Details:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.title}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Inquiry Source:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.inquirySource !== "" ? this.state.data.inquirySource : "--"}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Trip Type:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.tripType !== "" ? this.state.data.tripType : "--"}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Booking For Source:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.bookingFor !== "" ? this.state.data.bookingFor : "--"}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Start Date:</span>
                                                </td>
                                                <td>
                                                  <span>{<Datecomp date={this.state.data.startDate} />}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Duration (Nights):</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.duration}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Followup Date:</span>
                                                </td>
                                                <td>
                                                  <span>{<Datecomp date={this.state.data.followupDate} />}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Budget ({portalCurrency}):</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.budget !== "" ? this.state.data.budget : 0.00}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Adult:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.adults !== "" ? this.state.data.adults : 0}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Child:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.children !== "" ? this.state.data.children : 0}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Infant(s):</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.infant !== "" ? this.state.data.infant : 0}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td width="20%">
                                                  <span>Other Requirements:</span>
                                                </td>
                                                <td>
                                                  <span>{this.state.data.requirements !== "" ? this.state.data.requirements : "--"}</span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                            <tbody>
                                              <tr>&nbsp;</tr>
                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>Thank You,</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
                                                  {userInfo?.provider?.logo?.url ? (
                                                    <img
                                                      src={userInfo?.provider?.logo?.url}
                                                      height="42px"
                                                      style={{ height: "42px" }}
                                                      alt=""
                                                    />
                                                  ) : (
                                                    <h6
                                                      style={{
                                                        background: "#f8f9fa",
                                                        border: "solid 2px #dee2e6",
                                                        borderRadius: "4px",
                                                        float: "left",
                                                        padding: "8px",
                                                        color: "rgb(241, 130, 71)",
                                                        margin: "0px",
                                                        fontSize: "18px",
                                                      }}
                                                    >
                                                      {provider?.name}
                                                    </h6>
                                                  )}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
                                                  <b>{provider?.name}</b>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>{location?.address}</span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>
                                                    Phone :{" "}
                                                    {(contactInformation?.phoneNumberCountryCode
                                                      ? contactInformation?.phoneNumberCountryCode + " "
                                                      : "") + contactInformation?.phoneNumber}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                  <span>
                                                    Email :{" "}
                                                    <a
                                                      href={
                                                        "mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")
                                                      }
                                                    >
                                                      {contactInformation?.email}
                                                    </a>
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {this.state.isshowauthorizepopup &&
              <ModelPopupAuthorize
                header={""}
                content={""}
                handleHide={this.hideauthorizepopup}
                history={this.props.history}
              />
            }
          </div>}
      </React.Fragment>
    );
  }
}

export default InquiryForm;

const inquirySourceList = [
  { name: "Select Inquiry Source", value: "" },
  { name: "Call Center", value: "Call Center" },
  { name: "Walkin", value: "Walkin" },
  { name: "Email", value: "Email" },
  { name: "Referred By", value: "Referred By" },
  { name: "Social Media", value: "Social Media" },
  { name: "Self", value: "Self" },
  { name: "Other", value: "Other" },
];
const classTypeAir = [
  { name: "Select Class", value: "" },
  { name: "Economy", value: "Economy" },
  { name: "Premium Economy", value: "Premium Economy" },
  { name: "Business", value: "Business" },
  { name: "First Class", value: "First Class" },
  { name: "Other", value: "Other" },
]

const statusList = [
  { name: "New", value: "New" },
  { name: "Assigned", value: "Assigned" },
  { name: "Follow Up", value: "Follow Up" },
  { name: "Query", value: "Query" },
  { name: "Lost", value: "Lost" },
  { name: "Closed", value: "Closed" },
  { name: "Completed", value: "Completed" },
];

const SocialMediaSource = [
  { name: "Facebook", value: "Facebook" },
  { name: "Instagram", value: "Instagram" },
  { name: "Google", value: "Google" },
  { name: "LinkedIn", value: "LinkedIn" },
]
let tripTypeList = [
  { name: "Select Trip Type", value: "" },
  { name: "Domestic", value: "Domestic" },
  { name: "International", value: "International" },
  { name: "Both", value: "Both" },
];

let tripTypeListVisa = [
  { name: "Select Category", value: "" },
  { name: "Student", value: "Student" },
  { name: "Tourist", value: "Tourist" },
  { name: "Educational", value: "Educational" },
  { name: "Visitor", value: "Visitor" },
  { name: "Business", value: "Business" },
  { name: "Employment Visa", value: "Employment Visa" },
  { name: "Conference", value: "Conference" },
  { name: "Visa on Arrival", value: "Visa on Arrival" },
  { name: "Other", value: "Other" },
];

let tripTypePackageList = [
  { name: "Select Package Type", value: "" },
  { name: "Spiritual", value: "Spiritual" },
  { name: "Adventure", value: "Adventure" },
  { name: "Yatra", value: "Yatra" },
  { name: "Educational", value: "Educational" },
  { name: "Leisure", value: "Leisure" },
  { name: "Honeymoon", value: "Honeymoon" },
  { name: "Wildlife", value: "Wildlife" },
  { name: "Other", value: "Other" },
];

let tripTypeOtherAirList = [
  { name: "One Way", value: "One Way" },
  { name: "RoundTrip", value: "RoundTrip" },
  { name: "Multicity", value: "Multicity" },
];

let tripTypeOtherHotelList = [
  { name: "Select Rating", value: "" },
  { name: "2 Star", value: "2 Star" },
  { name: "3 Star", value: "3 Star" },
  { name: "4 Star", value: "4 Star" },
  { name: "5 Star", value: "5 Star" },
];

const prioritylist = [
  { label: "Select", value: "" },
  { label: "High", value: "High" },
  { label: "Moderate", value: "Moderate" },
  { label: "Low", value: "Low" },
];
const inquiryTypeList = [
  { name: "Packages", value: "Packages" },
  { name: "Flight", value: "Air" },
  { name: "Hotel", value: "Hotel" },
  { name: "Activity", value: "Activity" },
  { name: "Transfers", value: "Transfers" },
  { name: "Visa", value: "Visa" },
  { name: "Rail", value: "Rail" },
  { name: "Forex", value: "Forex" },
  { name: "Bus", value: "Bus" },
  { name: "Rent a Car", value: "Rent a Car" }
];

const bookingForList = [
  { name: "Select Booking For", value: "" },
  { name: "Individual", value: "Individual" },
  { name: "Corporate", value: "Corporate" },
];
let tripTypeOtherRailList = [
  { name: "Select Class", value: "" },
  { name: "Sleeper (SL)", value: "Sleeper (SL)" },
  { name: "Second Sitting (2S)", value: "Second Sitting (2S)" },
  { name: "First Class (FC)", value: "First Class (FC)" },
  { name: "AC 3 Economy (3E)", value: "AC 3 Economy (3E)" },
  { name: "AC First Class (1A)", value: "AC First Class (1A)" },
  { name: "AC 2 Tier (2A)", value: "AC 2 Tier (2A)" },
  { name: "AC 3 Tier (3A)", value: "AC 3 Tier (3A)" },
  { name: "AC Chair Car (CC)", value: "AC Chair Car (CC)" },
  { name: "Exec. Chair Car (EC)", value: "Exec. Chair Car (EC)" },
  { name: "Anubhuti Class (EA)", value: "Anubhuti Class (EA)" },
  { name: "Vistadome AC (EV)", value: "Vistadome AC (EV)" },
  { name: "Vistadome Chair Car (VC)", value: "Vistadome Chair Car (VC)" },
  { name: "Vistadome Non AC (VS)", value: "Vistadome Non AC (VS)" },
  { name: "Other", value: "Other" },
];
const durationList = [
  { name: "Select Duration", value: "" },
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
