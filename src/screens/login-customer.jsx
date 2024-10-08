import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import * as Global from "../helpers/global";
import * as encrypt from "../helpers/encrypto";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../config";
import ForgotPassword from "./onboarding/components/forgot-password";


const recaptchaRef = React.createRef();
class LoginCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false,
      username: "",
      password: "",
      callingCountryCode: "",
      phoneNumber: "",
      countryCode: "",
      isButtonLoding: false,
      isValidUsername: true,
      isValidPassword: true,
      errorMessage: "",
      toggleLogin: "email",
      isShowForgotPassword: false,
      isShowGeneratePassword: false,
      showSuccessMsg: false,
      captcha: "",
      isValidCaptcha: true,
      IsFromAutoPopulated: false,
    };
  }

  onChangeCaptcha = (value) => {
    this.setState({
      captcha: value,
      isValidCaptcha: true,
    });
  }
  handleChange = (e) => {
    if (e.target.name === "username") {
      this.setState({ username: e.target.value.trim(), showSuccessMsg: false });
    }
    if (e.target.name === "password") {
      this.setState({ password: e.target.value.trim(), showSuccessMsg: false });
    }
  };

  forgotPassword = () => {
    if (Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" && recaptchaRef.current.getValue() === "") {
      this.setState({
        isValidCaptcha: !(recaptchaRef.current.getValue() === "")
      });
    }
    if (this.state.toggleLogin === "email" && this.state.username === "") {
      this.setState({
        isValidUsername: !(this.state.username === ""),
        errorMessage: Trans("_rqEmail"),
      });
    } else if (this.state.toggleLogin === "mobile" && this.state.phoneNumber === "") {
      this.setState({
        isValidUsername: !(this.state.username === ""),
        errorMessage: Trans("_rqMobileNumber"),
      });
    } else {
      this.setState({
        isButtonLoding: true,
        isValidUsername: true,
        isValidPassword: true,
        errorMessage: "",
      });

      var reqURL = "api/v1/user/forgotpassword";
      let ContactInformation = null;
      if (this.state.toggleLogin === "email") {
        ContactInformation = {
          Email: encrypt.encryptUsingAES256(this.state.username),
        };
      } else {
        ContactInformation = {
          phoneNumber: encrypt.encryptUsingAES256(this.state.phoneNumber),
          phoneNumberCountryCode: encrypt.encryptUsingAES256(this.state.callingCountryCode),
        };
      }

      var reqOBJ = {
        Request: {
          ContactInformation,
          CanSendEmail: true,
          CaptchaToken: Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" ? recaptchaRef.current.getValue() : "",
        },
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.setState({
            isButtonLoding: false,
          });
          if (data.status.code === 0) {
            this.setState({
              errorMessage:
                this.state.toggleLogin === "email"
                  ? Trans("_forgotPasswordMessageEmail")
                  : Trans("_forgotPasswordMessageSMS"),
              showSuccessMsg: true,
            });
          } else {
            this.setState({
              errorMessage: Trans(
                "_" +
                data.status.message
                  .replace(" ", "")
                  .replace(" ", "")
                  .replace(" ", "")
                  .replace(" ", "")
              ),
              showSuccessMsg: false,
            });
            recaptchaRef.current.reset();
          }
        }.bind(this)
      );
    }
  };

  authUser = () => {
    if (
      this.state.toggleLogin === "email" &&
      (this.state.username === "" || this.state.password === "")
    ) {
      var isValidCaptcha = true;
      if (Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" && recaptchaRef.current.getValue() === "" && !this.state.IsFromAutoPopulated) {
        isValidCaptcha = !(recaptchaRef.current.getValue() === "")
      }
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        isValidCaptcha: isValidCaptcha,
        errorMessage: Trans("_rqUserNameEmail"),
      });
    } else if (
      this.state.toggleLogin === "mobile" &&
      (this.state.phoneNumber === "" || this.state.password === "")
    ) {
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        errorMessage: Trans("_rqMobileNumberPassword"),
      });
    } else if (Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" && recaptchaRef.current.getValue() === "" && !this.state.IsFromAutoPopulated) {
      this.setState({
        isValidCaptcha: !(recaptchaRef.current.getValue() === "")
      });
    } else {
      this.setState({
        isButtonLoding: true,
        isValidUsername: true,
        isValidPassword: true,
        errorMessage: "",
      });

      var reqURL = "api/v1/user/login";
      let ContactInformation = null;
      if (this.state.toggleLogin === "email") {
        ContactInformation = {
          Email: encrypt.encryptUsingAES256(this.state.username),
        };
      } else {
        ContactInformation = {
          phoneNumber: encrypt.encryptUsingAES256(this.state.phoneNumber),
          phoneNumberCountryCode: encrypt.encryptUsingAES256(this.state.callingCountryCode),
        };
      }

      var reqOBJ = {
        Request: {
          LoginName: encrypt.encryptUsingAES256(this.state.username),
          Password: encrypt.encryptUsingAES256(this.state.password),
          ContactInformation,
          CaptchaToken: Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" ? recaptchaRef.current.getValue() : "",
        },
      };
      if (this.state.IsFromAutoPopulated) {
        reqOBJ.Flags = { IsFromAutoPopulated: this.state.IsFromAutoPopulated }
      }
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.status.code === 0) {
            this.setState({ isButtonLoding: false });
            if (window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
              window.location.href = window.location.origin + "/" + window.location.pathname.split('/')[1];
            }
            else {
              window.location.href = window.location.origin;
            }
          } else {
            this.setState({
              isButtonLoding: false,
              errorMessage: Trans("_incorrectEmailPassword"),
            });
            recaptchaRef.current.reset();
          }
        }.bind(this)
      );
    }
  };

  handleClickOutside = (event) => {
    if (this.node.contains(event.target)) {
      return;
    }
    if (this.props.parentref.contains(event.target)) {
      return;
    }
    this.props.onLoginSuccess();
  };

  componentDidMount() {
    //document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    //document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.authUser();
    }
  };

  handleKeyDownForgotPassword = (e) => {
    if (e.key === "Enter") {
      this.forgotPassword();
    }
  };

  onPhoneNumberChange = (status, value, countryData, number, id) => {
    this.setState({
      phoneNumber: value ? value : "",
      countryCode: countryData !== "undefined" ? countryData.iso2 : "",
      callingCountryCode: countryData.dialCode,
    });
  };
  /**
   * Called when user change flag
   */
  onFlagChanged = (status, countryData, value, number, id) => {
    this.setState({
      countryCode: countryData !== "undefined" ? countryData.iso2 : "",
      callingCountryCode: countryData.dialCode,
    });
  };
  /**
   * Response from Facebook signin - Parse response
   */
  responseFacebook = (response) => {
    if (response && response.status && response.status === "unknown") return;
    if (response && response !== "undefined" && response !== null) {
      var reqOBJ = {
        request: {
          profilePicture: response.picture ? { URL: response.picture.data.url } : {},
          loginName: response.name,
          firstName: response.first_name,
          lastName: response.last_name,
          password: "",
          openIDs: {
            facebook: response.id,
          },
          contactInformation: {
            name: response.name,
            email: response.email,
          },
        },
        flags: {},
      };

      this.callSignUpUser(reqOBJ);
    }
  };
  /**
   * Response from google signin - Parse response
   */
  responseGoogle = (response) => {
    if (
      response &&
      response !== "undefined" &&
      response.profileObj &&
      response.profileObj !== "undefined"
    ) {
      var reqOBJ = {
        request: {
          profilePicture: response.profileObj.imageUrl ? { URL: response.profileObj.imageUrl } : {},
          loginName: response.profileObj.name,
          firstName: response.profileObj.givenName,
          lastName: response.profileObj.familyName,
          password: "",
          openIDs: {
            google: response.profileObj.googleId,
          },
          contactInformation: {
            name: response.profileObj.name,
            email: response.profileObj.email,
          },
        },
        flags: {},
      };

      this.callSignUpUser(reqOBJ);
    }
  };
  /**
   * Call user signup api after getting profile with Google OR Facebook
   */
  callSignUpUser = (reqOBJ) => {
    var reqURL = "api/v1/user/signup";
    apiRequester(reqURL, reqOBJ, function (data) {
      data !== "undefined" && data.status.code === 0
        ? window.location.reload()
        : window.alert(data.status.message);
    });
  };
  authUsereentry = () => {
    this.setState({ IsFromAutoPopulated: !this.state.IsFromAutoPopulated });
  }

  setForgotPasswordVisible = () => {
    this.setState({ isShowForgotPassword: !this.state.isShowForgotPassword });
  };
  render() {
    const { toggleLogin, phoneNumber, username, isShowForgotPassword, isShowGeneratePassword, showSuccessMsg, isValidCaptcha } = this.state;
    return (
      <div className="container">
        <div
          className="mt-4 mb-5 loginbox loginbox-static"
          style={{ zIndex: "0" }}
          ref={(node) => {
            this.node = node;
          }}
        >

          <div className="border bg-white shadow p-4">
            <h4 className="mb-3">{Trans("_titleLogin")}</h4>
            {false &&
              <div className="custom-control custom-switch mb-3 mt-2">
                <div className="row">
                  <div className="col-sm-4">
                    <input
                      type="checkbox"
                      checked={toggleLogin === "email" ? true : false}
                      className="custom-control-input"
                      id="customSwitch1"
                      onChange={() =>
                        this.setState({
                          toggleLogin: "email",
                          isValidUsername: true,
                          isValidPassword: true,
                          errorMessage: "",
                          password: "",
                          phoneNumber: "",
                          username: "",
                        })
                      }
                    />
                    <label className="custom-control-label" htmlFor="customSwitch1">
                      {Trans("_email")}
                    </label>
                  </div>
                  <div className="col-sm-8">
                    <input
                      type="checkbox"
                      checked={toggleLogin === "mobile" ? true : false}
                      className="custom-control-input"
                      id="customSwitch2"
                      onChange={() =>
                        this.setState({
                          toggleLogin: "mobile",
                          isValidUsername: true,
                          isValidPassword: true,
                          errorMessage: "",
                          password: "",
                          phoneNumber: "",
                          username: "",
                        })
                      }
                    />
                    <label className="custom-control-label" htmlFor="customSwitch2">
                      {Trans("_lblMobileNumber")}
                    </label>
                  </div>
                </div>
              </div>}
            {toggleLogin === "email" ? (
              <div className="form-group">
                <label>{Trans("_lblEmail")}</label>
                <input
                  className={
                    "form-control " + (!this.state.isValidUsername ? "border border-danger" : "")
                  }
                  value={username ? username : ""}
                  name="username"
                  type="text"
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor={"phoneNumber"}>{Trans("_lblMobileNumber")}</label>
                <IntlTelInput
                  preferredCountries={[]}
                  className={!this.state.isValidUsername ? "border border-danger" : ""}
                  // className={"border border-danger"}
                  defaultCountry={
                    this.state.countryCode === ""
                      ? Global.getEnvironmetKeyValue("PortalCountryCode").toLowerCase()
                      : this.state.countryCode
                  }
                  onPhoneNumberChange={this.onPhoneNumberChange}
                  onSelectFlag={this.onFlagChanged}
                  containerClassName={[
                    "form-control intl-tel-input allow-dropdown w-100 col-lg-12 p-0 position-relative",
                  ]}
                  inputClassName="form-control d-block"
                  value={phoneNumber ? phoneNumber : ""}
                  fieldName={"phoneNumber"}
                  fieldId={"phoneNumber"}
                  autoHideDialCode={true}
                  formatOnInit={false}
                  separateDialCode={false}
                  format={false}
                  placeholder={""}
                />
              </div>
            )}
            <div className="form-group">
              <label>{Trans("_lblPassword")}</label>
              <input
                className={
                  "form-control " + (!this.state.isValidPassword ? "border border-danger" : "")
                }
                name="password"
                type="password"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
            </div>
            {Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" && (
              <div className="form-group">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                  hl={'en'}
                  onChange={this.onChangeCaptcha}
                />
              </div>)}
            <div className="form-group">
              <button className="btn btn-primary w-100" type="submit" onClick={this.authUser}>
                {this.state.isButtonLoding ? (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                {Trans("_btnLogin")}
              </button>
            </div>
            {this.state.errorMessage && this.state.errorMessage !== "" ? (
              <span className="text-center">
                <small className="alert alert-danger text-center mt-0 p-1 d-inline-block">
                  {this.state.errorMessage}
                </small>
              </span>
            ) : null}
            {!isValidCaptcha && (
              <div className="col-lg-12 col-sm-12 m-0 p-0">
                <small className="alert alert-danger mt-0 p-1 d-inline-block">
                  {"Please verify captcha"}
                </small>
              </div>
            )}

            <div className="form-group mb-0">
              <button
                type="button"
                className="btn btn-outline-primary w-50"
                onClick={() =>
                  this.setState({
                    isShowGeneratePassword: true,
                    isShowForgotPassword: true,
                    isValidUsername: true,
                    isValidPassword: true,
                    username: "",
                    errorMessage: "",
                    password: "",
                    phoneNumber: "",
                    isButtonLoding: false,
                    showSuccessMsg: false,
                    isValidCaptcha: true,
                  })
                }
              >
                Generate Password
              </button>

              <button
                type="button"
                className="btn btn-link w-50"
                onClick={() =>
                  this.setState({
                    isShowForgotPassword: true,
                    isShowGeneratePassword: false,
                    isValidUsername: true,
                    isValidPassword: true,
                    username: "",
                    errorMessage: "",
                    password: "",
                    phoneNumber: "",
                    isButtonLoding: false,
                    showSuccessMsg: false,
                    isValidCaptcha: true,
                  })
                }
              >
                {Trans("_forgotPassword")}?
              </button>
            </div>
          </div>

        </div>
        {(isShowForgotPassword) &&
          < ForgotPassword onClose={() => this.setForgotPasswordVisible()} isFromB2CPortal={true} isGeneratePassword={this.state.isShowGeneratePassword} />

        }
        <button id="eentry"
          className="btn btn-primary d-none"
          type="submit"
          onClick={this.authUsereentry}
        >e-entry</button>
      </div>
    );
  }
}

export default LoginCustomer;
