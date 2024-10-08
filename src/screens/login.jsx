import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import * as Global from "../helpers/global";

class Login extends Component {
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
      showSuccessMsg: false,
    };
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
          Email: this.state.username,
        };
      } else {
        ContactInformation = {
          phoneNumber: this.state.phoneNumber,
          phoneNumberCountryCode: this.state.callingCountryCode,
        };
      }

      var reqOBJ = {
        Request: {
          ContactInformation,
          CanSendEmail: true,
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
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        errorMessage: Trans("_incorrectEmailPassword"),
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
          Email: this.state.username,
        };
      } else {
        ContactInformation = {
          phoneNumber: this.state.phoneNumber,
          phoneNumberCountryCode: this.state.callingCountryCode,
        };
      }

      var reqOBJ = {
        Request: {
          LoginName: this.state.username,
          Password: this.state.password,
          ContactInformation,
        },
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.status.code === 0) {
            this.setState({ isButtonLoding: false });
            window.location.href = window.location.origin;
          } else {
            this.setState({
              isButtonLoding: false,
              errorMessage: Trans("_incorrectEmailPassword"),
            });
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

  render() {
    const { toggleLogin, phoneNumber, username, isShowForgotPassword, showSuccessMsg } = this.state;

    return (
      <div className="container">
        <div
          className="mt-4 mb-5 loginbox loginbox-static"
          ref={(node) => {
            this.node = node;
          }}
        >
          {!isShowForgotPassword ? (
            <div className="border bg-white shadow p-4">
              <h4 className="mb-3">{Trans("_titleLogin")}</h4>
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
              </div>
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

              <div className="row">
                {Global.getEnvironmetKeyValue("socialNetworkIntegration") &&
                  Global.getEnvironmetKeyValue("socialNetworkIntegration").indexOf("facebook") >
                  -1 &&
                  Global.getEnvironmetKeyValue("oAuthProviderInfo").find(
                    (x) => x.name === "facebook"
                  ) !== undefined && (
                    <div className="form-group col-lg-6">
                      <FacebookLogin
                        cssClass="btn w-100 btn-facebook"
                        appId={
                          Global.getEnvironmetKeyValue("oAuthProviderInfo").find(
                            (x) => x.name === "facebook"
                          ).appID
                        } //APP ID
                        fields="name,email,picture,birthday,gender,address,first_name,last_name"
                        callback={this.responseFacebook}
                        onFailure={this.responseFacebook}
                        textButton="Login with Facebook"
                      />
                    </div>
                  )}
                {Global.getEnvironmetKeyValue("oAuthProviderInfo").find(
                  (x) => x.name === "google"
                ) !== undefined && (
                    <div className="form-group col-lg-6">
                      <GoogleLogin
                        className="btn w-100 btn-google"
                        clientId={
                          Global.getEnvironmetKeyValue("oAuthProviderInfo").find(
                            (x) => x.name === "google"
                          ).appID
                        } //CLIENTID
                        buttonText="Login with Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={"single_host_origin"}
                      />
                    </div>
                  )}
              </div>

              <div className="form-group mb-0">
                <button
                  type="button"
                  className="btn btn-link w-100"
                  onClick={() =>
                    this.setState({
                      isShowForgotPassword: true,
                      isValidUsername: true,
                      isValidPassword: true,
                      username: "",
                      errorMessage: "",
                      password: "",
                      phoneNumber: "",
                      isButtonLoding: false,
                      showSuccessMsg: false,
                    })
                  }
                >
                  {Trans("_forgotPassword")}?
                </button>
              </div>
            </div>
          ) : (
              //Forgot Password Modal View
              <div className="border bg-white shadow p-4">
                <h4 className="mb-3">{Trans("_forgotPassword")}</h4>

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
                            showSuccessMsg: false,
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
                            showSuccessMsg: false,
                          })
                        }
                      />
                      <label className="custom-control-label" htmlFor="customSwitch2">
                        {Trans("_lblMobileNumber")}
                      </label>
                    </div>
                  </div>
                </div>

                {toggleLogin === "email" ? (
                  <div className="form-group">
                    <label>{Trans("_email")}</label>
                    <input
                      className={
                        "form-control " + (!this.state.isValidUsername ? "border border-danger" : "")
                      }
                      value={username ? username : ""}
                      name="username"
                      type="text"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDownForgotPassword}
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
                {this.state.errorMessage && this.state.errorMessage !== "" ? (
                  <span className="text-center">
                    <small
                      className={
                        "alert text-center mt-0 p-1 d-inline-block " +
                        (showSuccessMsg ? "alert-success" : "alert-danger")
                      }
                    >
                      {this.state.errorMessage}
                    </small>
                  </span>
                ) : null}
                <div className="form-group">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    onClick={this.forgotPassword}
                  >
                    {this.state.isButtonLoding ? (
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    {Trans("_forgotPassword")}
                  </button>
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-link w-100"
                    onClick={() =>
                      this.setState({
                        isShowForgotPassword: false,
                        username: "",
                        isValidUsername: true,
                        isValidPassword: true,
                        errorMessage: "",
                        password: "",
                        phoneNumber: "",
                        isButtonLoding: false,
                        showSuccessMsg: false,
                      })
                    }
                  >
                    {Trans("_btnBack")}
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default Login;
