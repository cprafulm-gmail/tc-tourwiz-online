import React from "react";
import { apiRequester } from "../services/requester";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as Global from "../helpers/global";
import ModelPopup from "../helpers/model";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import FileBase64 from "../components/common/FileBase64";
import moment, { lang } from "moment";
import HtmlParser from "../helpers/html-parser";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../config";
import MessageBar from '../components/admin/message-bar';

const recaptchaRef = React.createRef();
class Signup extends Form {
  state = {
    isLoading: false,
    userInfo: "",
    showErrow: false,
    files: [],
    isPolicyChecked: true,
    errorMsg: "",
    successMessage: "",
    data: {
      firstname: "",
      lastname: "",
      gender: "Male",
      password: "",
      confirmpassword: "",
      email: "",
      mobilenumber: "",
      nationality: Global.getEnvironmetKeyValue("PortalCountryCode"),
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      agreeCondition: false,
      captcha: ""
    },
    errors: {}
  };

  validate = () => {
    this.setState({ errorMsg: "" });
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstname, "require"))
      errors.firstname = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstname, "special-characters-not-allowed", /[<>]/))
      errors.firstname = "< and > characters not allowed";
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

    if (!this.validateFormData(data.gender, "require"))
      errors.gender = Trans("_error_gender_require");

    if (!this.validateFormData(data.password, "require"))
      errors.password = Trans("_error_password_require");
    else if (
      !this.validateFormData(data.password, "length", { min: 6, max: 20 })
    )
      errors.password = Trans("_error_password_length");

    if (!this.validateFormData(data.confirmpassword, "require"))
      errors.confirmpassword = Trans("_error_confirmpassword_require");
    else if (data.password !== data.confirmpassword)
      errors.confirmpassword = Trans("_error_confirmpassword_not_match");

    if (!this.validateFormData(data.email, "require"))
      errors.email = Trans("_error_email_require");
    else if (!this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    //Phone number
    const tempmobilenumber = parsePhoneNumberFromString(data.mobilenumber);
    if (!this.validateFormData(data.mobilenumber, "require_phoneNumber"))
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber");
    else if (!this.validateFormData(data.mobilenumber, "phonenumber"))
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber");
    else if (
      !this.validateFormData(data.mobilenumber, "phonenumber_length", {
        min: 8,
        max: 14
      })
    )
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber_length");
    else if (!tempmobilenumber)
      errors.mobilenumber = Trans("_error_mobilenumber_require");

    if (!this.validateFormData(data.nationality, "require"))
      errors.nationality = Trans("_error_nationality_require");

    if (recaptchaRef.current.getValue() === "")
      errors.captcha = Trans("_error_captcha_require");

    if (data.agreeCondition === false)
      errors.agreeCondition = Trans("_pleaseAcceptTermsAndConditions");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  validateSignupUser = () => {
    if (!this.state.data.agreeCondition) {
      this.setState({
        isPolicyChecked: false
      });
      return false;
    }
    return true;
  };
  // Callback~
  getFiles(files) {
    this.setState({ files: files });
  }
  /*
   ** Call Signup api
   */
  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    this.signupUser();
  };

  signupUser = () => {
    this.setState({ errorMsg: "" });
    const recaptchaValue = recaptchaRef.current.getValue();
    if (!this.validateSignupUser()) {
      return;
    }
    let profileImgName = "";
    let profileImgRaw = "";
    let profilePicture = null;
    //Validate form inputs
    const { CountryList } = DropdownList;
    const tempPhoneNumber = parsePhoneNumberFromString(
      this.state.data.mobilenumber
    );

    this.setState({
      isLoading: true
    });
    /**
     * Check for profile picture is uploaded or not
     * If yes then get imagename and rawData fro file
     * and send profileImgObject in request
     */
    if (
      this.state.files &&
      this.state.files !== "undefined" &&
      this.state.files.base64 &&
      this.state.files.base64 !== "undefined"
    ) {
      profileImgName = this.state.files.name;
      if (this.state.files.base64.includes("data:image/jpeg;base64,")) {
        profileImgRaw = this.state.files.base64.replace(
          "data:image/jpeg;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:image/png;base64,", "")
      ) {
        profileImgRaw = this.state.files.base64.replace(
          "data:image/png;base64,",
          ""
        );
      }
      profilePicture = {
        url: profileImgName,
        rawData: profileImgRaw,
        updatedDate: moment().format("DD/MM/YYYY")
      };
    }

    var reqOBJ = {
      request: {
        profilePicture,
        loginName: this.state.data.firstname + " " + this.state.data.lastname,
        firstName: this.state.data.firstname,
        lastName: this.state.data.lastname,
        password: this.state.data.password,
        location: {
          countryID: this.state.data.nationality.split("_")[0],
          country: CountryList.find(
            x => x.isoCode === this.state.data.nationality
          ).name
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,
          phoneNumber: tempPhoneNumber.nationalNumber,
          phoneNumberCountryCode: "+" + tempPhoneNumber.countryCallingCode,
          email: this.state.data.email
        },

        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        CaptchaToken: recaptchaRef.current.getValue()
      },
      flags: {}
    };

    var reqURL = "api/v1/user/signup";

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          isLoading: false
        });

        //if (data.response !== undefined && data.status.code === 0) {
        if (data.status.code === 0) {
          //(window.location = "/") //window.alert("You are registered successfully")
          this.setState({
            successMessage: "You are registered successfully!"
          });
        }
        else {
          let message = Trans("_" + data.status.code) === ("_" + data.status.code) ? data.status.message : Trans("_" + data.status.code)
          this.setState({ errorMsg: message });
          recaptchaRef.current.reset();
        }
      }.bind(this)
    );
  };

  handleShowTerms = mode => {
    this.setState({
      showPopup: true,
      popupTitle:
        mode === "TermsAndConditions"
          ? Trans("_termsAndConditions")
          : Trans("_privacyPolicy"),
      popupContent:
        mode === "TermsAndConditions" ? (
          <HtmlParser
            text={(Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== null && Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== "") ? Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") : Trans("_noPolicyFound")}
          />
        ) : (
          <HtmlParser
            text={(Global.getEnvironmetKeyValue("PRIVACYPOLICYTERMS", "cobrand") !== null && Global.getEnvironmetKeyValue("PRIVACYPOLICYTERMS", "cobrand") !== "") ? Global.getEnvironmetKeyValue("PRIVACYPOLICYTERMS", "cobrand") : Trans("_noPolicyFound")}
          />
        )
    });
  };

  handleHideTerms = () => {
    this.setState({
      showPopup: false,
      popupTitle: "",
      popupContent: null
    });
  };

  agreeCondition = () => {
    let data = { ...this.state.data };
    data.agreeCondition = !this.state.data.agreeCondition;
    this.setState({
      data
    });
  };
  /**
   * Hide action dialog
   */
  hideActionDialog = () => {
    this.setState({ errorMsg: "" });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.isLoggedIn) props.history.push(`/`);
  }

  RedirectToHome = () => {
    window.location = "/";
    //this.props.history.push(`/`);
  };

  render() {
    const { CountryList, Gender } = DropdownList;
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="user-plus"
                type="fill"
                className="mr-3"
                width="30"
                height="30"
              ></SVGIcon>
              {Trans("_titleCreateMyAccount")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="border p-3 bg-white box-shadow mt-3">
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                {this.renderSelect(
                  "gender",
                  Trans("_lblGenderWithStar"),
                  Gender
                )}
              </div>
              <div className="col-lg-4 col-sm-12">
                {this.renderInput("firstname", Trans("_lblFirstNameWithStar"))}
              </div>

              <div className="col-lg-4 col-sm-12">
                {this.renderInput("lastname", Trans("_lblLastNameWithStar"))}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                {this.renderInput("email", Trans("_lblEmailWithStar"))}
              </div>
              <div className="col-lg-4 col-sm-12">
                {this.renderInput(
                  "password",
                  Trans("_rqMinPasswordMessageWithStar"),
                  "password"
                )}
              </div>
              <div className="col-lg-4 col-sm-12">
                {this.renderInput(
                  "confirmpassword",
                  Trans("_lblConfirmPassword"),
                  "password"
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                {this.renderContactInput(
                  "mobilenumber",
                  Trans("_lblMobileNumberWithStar"),
                  "number",
                  true
                )}
              </div>
              <div className="col-lg-4 col-sm-12">
                {this.renderSelect(
                  "nationality",
                  Trans("_lblCountryWithStar"),
                  CountryList,
                  "isoCode",
                  "name"
                )}
              </div>
              <div className="col-lg-4 col-sm-12">
                {this.state.files &&
                  this.state.files !== "undefined" &&
                  this.state.files.base64 &&
                  this.state.files.base64 !== "undefined" &&
                  this.state.files.base64 !== null ? (
                  <img
                    src={this.state.files.base64}
                    className="profile-img d-inline-block pull-right ml-0 mt-3 col-lg-3 p-0"
                    alt=""
                  />
                ) : (
                  <img
                    className="profile-img d-inline-block pull-right ml-0 mt-3 col-lg-3 p-0"
                    alt=""
                  />
                )}
                <FileBase64
                  multiple={false}
                  onDone={this.getFiles.bind(this)}
                  name="userProfile"
                  label={Trans("_lblUserProfile")}
                  placeholder={Trans("_chooseFile")}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12 mb-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                  hl={localStorage.getItem("lang").split("-")[0]}
                />
                {this.state.errors.captcha && (
                  <div className="col-lg-12 col-sm-12 m-0 p-0">
                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                      {this.state.errors.captcha}
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 mb-2 ml-3 custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="chkAgree"
                  checked={this.state.data.agreeCondition}
                  onChange={() => this.agreeCondition()}
                />
                <label
                  className="custom-control-label text-secondary"
                  htmlFor="chkAgree"
                >
                  {Trans("_signupPageAgreeMessagePart1") + " "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => this.handleShowTerms("TermsAndConditions")}
                  >
                    {Trans("_signupPageAgreeMessagePart2")}
                  </button>
                  {" " + Trans("_signupPageAgreeMessagePart3") + " "}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => this.handleShowTerms("PrivacyPolicy")}
                  >
                    {" " + Trans("_signupPageAgreeMessagePart4") + " "}
                  </button>
                  {" " + Trans("_signupPageAgreeMessagePart5") + " "}
                </label>
              </div>

              {/**
               * Check for policy is checked or not and show error message
               */
                this.state.errors.agreeCondition && (
                  <div className="col-lg-4 col-sm-12 ml-3 p-0">
                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                      {Trans("_pleaseAcceptTermsAndConditions")}
                    </small>
                  </div>
                )}
              {this.state.errorMsg && this.state.errorMsg !== "" ? (
                <div className="col-lg-4 col-sm-12 ml-4">
                  <small className="alert alert-danger mt-2 p-1 d-inline-block">
                    {Trans("_ooops")} {this.state.errorMsg}
                  </small>
                </div>
              ) : null}
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12 mt-3">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  {this.state.isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  {Trans("_btnSignUp")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.handleHideTerms}
          />
        ) : null}
        {this.state.successMessage &&
          <MessageBar Message={this.state.successMessage} handleClose={() => this.RedirectToHome()} />
        }
      </div>

    );
  }
}

export default Signup;
