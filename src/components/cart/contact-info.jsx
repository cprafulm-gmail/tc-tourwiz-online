import React from "react";
import Form from "../common/form";
import * as DropdownList from "../../helpers/dropdown-list";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SVGIcon from "../../helpers/svg-icon";
import Config from "../../config.json";

class ContactInfo extends Form {
  state = {
    data: {
      gender: "Male",
      firstname: "",
      lastname: "",
      city: "",
      itineraryname: "",
      email: "",
      phoneNumber: "",
      countryID: Global.getEnvironmetKeyValue("PortalCountryCode")
    },
    errors: {}
  };

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.props.handleSubmit({ count: this.props.count, data: this.state.data });
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    //firstname
    if (!this.validateFormData(data.firstname, "require"))
      errors.firstname = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.firstname, "length", { min: 2, max: 50 })
    )
      errors.firstname = Trans("_error_firstname_length");

    //lastname
    if (!this.validateFormData(data.lastname, "require"))
      errors.lastname = Trans("_error_lastname_require");
    else if (!this.validateFormData(data.lastname, "special-characters-not-allowed", /[<>]/))
      errors.lastname = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.lastname, "length", { min: 2, max: 50 })
    )
      errors.lastname = Trans("_error_lastname_length");

    //city
    if (Config.codebaseType === "tourwiz" && data.city.trim() === "") {
      //do nothing
    }
    else if (!this.validateFormData(data.city, "require"))
      errors.city = Trans("_error_city_require");
    else if (!this.validateFormData(data.city, "alpha_space"))
      errors.city = Trans("_error_city_alpha_space");
    else if (!this.validateFormData(data.city, "length", { min: 2, max: 50 }))
      errors.city = Trans("_error_city_length");

    //itineraryname
    if (!this.validateFormData(data.itineraryname, "require"))
      errors.itineraryname = Trans("_error_itineraryname_require");
    else if (
      !this.validateFormData(data.itineraryname, "length", { min: 2, max: 50 })
    )
      errors.itineraryname = Trans("_error_itineraryname_length");

    // else if (!this.validateFormData(data.itineraryname, "alpha_space"))
    //   errors.itineraryname = Trans("_error_itineraryname_alpha_space");

    if (!this.validateFormData(data.email, "require"))
      errors.email = Trans("_error_email_require");
    else if (!this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    //Phone number
    const tempPhoneNumber = parsePhoneNumberFromString(data.phoneNumber);
    if (!this.validateFormData(data.phoneNumber, "require_phoneNumber"))
      errors.phoneNumber = Trans("_error_phoneNumber_phonenumber");
    else if (!this.validateFormData(data.phoneNumber, "phonenumber"))
      errors.phoneNumber = Trans("_error_phoneNumber_phonenumber");
    else if (
      !this.validateFormData(data.phoneNumber, "phonenumber_length", {
        min: 8,
        max: 14
      })
    )
      errors.phoneNumber = Trans("_error_phoneNumber_phonenumber_length");
    else if (!tempPhoneNumber)
      errors.phoneNumber = Trans("_error_phoneNumber_require");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  setUserInfo = () => {
    const {
      gender,
      firstName,
      lastName,
      location,
      contactInformation
    } = this.props.userInfo;

    let userInfo = { ...this.state.data };
    userInfo.gender = gender;
    userInfo.firstname = firstName === undefined ? "" : firstName;
    userInfo.lastname = lastName === undefined ? "" : lastName;
    userInfo.city = location === undefined || location.city === undefined ? "" : location.city;
    userInfo.itineraryname = "booking for " + (firstName === undefined ? "" : firstName) + " " + (lastName === undefined ? "" : lastName);
    if (Config.codebaseType === "tourwiz")
      userInfo.itineraryname = (JSON.parse(localStorage.getItem("quotationDetails"))?.title ?? "");
    userInfo.email = contactInformation === undefined || contactInformation.email === undefined ? this.props.userInfo.customerCareEmail !== undefined ? this.props.userInfo.customerCareEmail : "" : contactInformation.email;
    userInfo.email = userInfo.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")) ? "" : userInfo.email;

    userInfo.phoneNumber =
      contactInformation.phoneNumberCountryCode +
      "-" +
      contactInformation.phoneNumber;
    userInfo.countryID = location === undefined ? Global.getEnvironmetKeyValue("PortalCountryCode") : location.countryID ? location.countryID : Global.getEnvironmetKeyValue("PortalCountryCode");

    this.setState({
      data: userInfo
    });
  };

  componentDidMount() {
    this.props.onRef(this);
    if (!this.props.continueAsGuest && this.props.userInfo !== null)
      this.setUserInfo();
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const GenderList = [
      { name: "Male", value: "M" },
      { name: "Female", value: "F" }
    ];
    const isReadOnlyField = typeof this.props.customerCrateErrorMsg !== 'undefined'
      && Global.getEnvironmetKeyValue("isCustomerSignupOnCartPage", "cobrand")
      && sessionStorage.getItem("callCenterType")
      && sessionStorage.getItem("callCenterType") !== "undefined";
    const { customerCrateErrorMsg } = this.props;
    return (
      <div className="contact-details border p-3 bg-white box-shadow mt-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon
            name="envelope"
            width="20"
            height="20"
            className="mr-2"
          ></SVGIcon>
          {Trans("_titleContactDetails")}
        </h5>
        <div className="row">
          <div className="col-lg-3">
            {this.renderSelect(
              "gender",
              Trans("_lblGenderWithStar"),
              GenderList
            )}
          </div>

          <div className="col-lg-3">
            {this.renderInput("firstname", Trans("_lblFirstNameWithStar"), "text", isReadOnlyField)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("lastname", Trans("_lblLastNameWithStar"), "text", isReadOnlyField)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("city", Config.codebaseType === "tourwiz" ? Trans("_lblCity") : Trans("_lblCityWithStar"))}
          </div>

          <div className="col-lg-3">
            {this.renderInput(
              "itineraryname",
              Trans("_lblItineraryNameWithStar")
            )}
          </div>

          <div className="col-lg-3">
            {this.renderInput("email", Trans("_lblEmailWithStar"), "text", isReadOnlyField)}
          </div>

          <div className="col-lg-3">
            {this.renderContactInput(
              "phoneNumber",
              Trans("_lblMobileNumberWithStar"),
              "text",
              this.props.continueAsGuest,
              isReadOnlyField
            )}
          </div>

          <div className="col-lg-3">
            {this.renderSelect(
              "countryID",
              Trans("_lblCountryWithStar"),
              DropdownList.CountryList,
              "isoCode",
              "name"
            )}
          </div>
          {typeof this.props.customerCrateErrorMsg !== 'undefined' && Global.getEnvironmetKeyValue("isCustomerSignupOnCartPage", "cobrand") && !isReadOnlyField &&
            <small className="alert alert-info mt-2 ml-3 p-1 d-inline-block">
              Notes : New customer will added with combination of email and phone number. Email and phone number should be unique among all customer.
            </small>
          }
          {typeof this.props.customerCrateErrorMsg !== 'undefined' && Global.getEnvironmetKeyValue("isCustomerSignupOnCartPage", "cobrand") && customerCrateErrorMsg &&
            <small className="alert alert-danger mt-2 ml-3 p-1 d-inline-block">
              {customerCrateErrorMsg}
            </small>
          }
        </div>
      </div>
    );
  }
}

export default ContactInfo;
