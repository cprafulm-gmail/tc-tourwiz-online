import React, { Component } from "react";
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import * as Global from "../../helpers/global";
import * as DropdownList from "../../helpers/dropdown-list";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import * as encrypt from "../../helpers/encrypto";
import Config from "../../config";
import { apiRequester } from "../../services/requester";
import { Trans } from "../../helpers/translate";
import { Helmet } from "react-helmet";

const recaptchaRef = React.createRef();
class AgentSignUpNew extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      emailOtp: "",
      phone: "+91-",
      password: "",
      confirmPassword: "",
      companyName: "",
      CityId: "",
      StateId: "",
      CountryId: "101",
      CountryIsoCode: "IN",
      CountryName: "India",
      currencySymbol: "INR (Rs)",
      captcha: "",
      referralCode: "GPS2023",
      signupIPDetails: "",
      agreenewsletter: false
    },
    errors: {},
    isRegisterSuccess: false,
    isRegisterFailed: false,
    isEmailEntered: false,
    isEmailOTP: true,
    isEmailOTPValidate: false,
    RegisterErrorMsg: "",
    isRegistering: false,
    isEmailLoading: false,
    isEmailOTPLoading: false,
    StateList: [],
    CityList: [],
    CountryList: [],
    CurrencyList: [],
    isTimerActive: false,
    timer: 30,
    isLinkDisabled: false,
    emailSentMsgShow: false
  };

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.timer === 0) {
          clearInterval(this.timerId);
          return {
            isTimerActive: false,
            isLinkDisabled: false,
            timer: 30,
          };
        }
        return {
          timer: prevState.timer - 1,
        };
      });
    }, 1000);
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstName, "require"))
      errors.firstName = "First Name required";
    else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (!this.validateFormData(data.firstName, "length", { min: 2 }))
      errors.firstName = "First Name must be between 2 and 50 characters long";

    if (!this.validateFormData(data.lastName, "require"))
      errors.lastName = "Last Name required";
    else if (!this.validateFormData(data.lastName, "special-characters-not-allowed", /[<>]/))
      errors.lastName = "< and > characters not allowed";
    else if (!this.validateFormData(data.lastName, "length", { min: 2 }))
      errors.lastName = "Last Name must be between 2 and 50 characters long";

    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email Address required";

    if (!this.validateFormData(data.phone, "require"))
      errors.phone = "Phone Number required";
    else if (
      data.phone.indexOf("-") > -1 &&
      !this.validateFormData(data.phone.split("-")[1], "require")
    )
      errors.phone = "Phone Number required";
    else if (
      data.phone.indexOf("-") > -1 &&
      !this.validateFormData(data.phone.split("-")[1], "only-numeric")
    )
      errors.phone = "Enter valid Phone Number";
    else if (!this.validateFormData(data.phone, "phonenumber_length"))
      errors.phone = "Phone Number must be between 8 and 14 digit long";

    if (!this.validateFormData(data.password, "require"))
      errors.password = "Password required";
    else if (!this.validateFormData(data.password, "length", { min: 6 }))
      errors.password = "Minimum 6 character password required";
    else if (!this.validateFormData(data.password, "special-characters-not-allowed", /[<>'&` "]/))
      errors.password = "<,>,',&,`,\" and blank space characters not allowed";

    if (!this.validateFormData(data.CountryId, "require"))
      errors.CountryId = "Please select Country";

    if (Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && recaptchaRef.current.getValue() === "")
      errors.captcha = "Captcha required";

    if (!this.validateFormData(data.currencySymbol, "require"))
      errors.currencySymbol = "Please select currency";

    if (!this.validateFormData(data.companyName, "special-characters-not-allowed", /[<>]/))
      errors.companyName = "< and > characters not allowed";

    // if (!this.validateFormData(data.StateId, "require"))
    //   errors.StateId = "Please select State";
    // if (!this.validateFormData(data.CityId, "require"))
    //   errors.CityId = "Please select City";

    // if (!this.validateFormData(data.confirmPassword, "require"))
    //   errors.confirmPassword = "Confirm Password required";

    // if (data?.password !== data?.confirmPassword) {
    //   errors.confirmPassword = "Password and Confirm Password must match";
    // }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  validateEmail = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.email, "email"))
      errors.email = "Please enter valid email address.";

    return Object.keys(errors).length === 0 ? null : errors;
  };


  validateEmailOTP = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.emailOtp, "require"))
      errors.emailOtp = "Please enter valid email OTP.";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSignup = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.setState({ isRegistering: true }, this.handleRegistration());
  };


  handleEmailOTP = (isForOTPVarify) => {
    if (!isForOTPVarify) {
      const errors = this.validateEmail();
      this.setState({ errors: errors || {} });
      if (errors) return;
      this.setState({
        isTimerActive: true,
        isLinkDisabled: true,
        emailSentMsgShow: true,
      });
      this.startTimer();
      setTimeout(() => {
        this.setState({
          emailSentMsgShow: false,
        });
      }, 5000);
    }
    this.setState({ isEmailLoading: true });
    let test = false;
    if (isForOTPVarify) {
      const errors = this.validateEmailOTP();
      this.setState({ errors: errors || {}, isEmailOTPLoading: true });
      if (errors) return;
    }
    let data = this.state.data;
    var reqURL = "tw/setup/otp";
    let currencySymbol = data.currencySymbol.split(" ")[0];
    var reqOBJ = {
      customerCareEmail: encrypt.encryptUsingAES256(data.email.trim()),
      Otp: data.emailOtp
      // StateId: data.StateId,
      // CityId: data.CityId
    };
    apiRequester_unified_api(reqURL, reqOBJ, (dataRes) => {
      console.log({ dataRes });
      if (dataRes?.result === "ok") {
        if (isForOTPVarify) {
          const { data } = this.state;
          data.emailOtp = "";
          this.setState({
            data,
            isEmailEntered: true,
            isEmailOTPValidate: true,
            isEmailLoading: false,
            isEmailOTPLoading: false
          });
        }
        else {
          this.handleEmail();
        }
      }
      else {
        const errors = {};
        errors.emailOtp = "Invalid otp";
        this.setState({ errors: errors || {}, isEmailOTPLoading: false });
      }
    });
  };

  handleRegistration = () => {
    let data = this.state.data;
    var reqURL = "tw/setup";
    let currencySymbol = data.currencySymbol.split(" ")[0];
    var reqOBJ = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      companyName: data.companyName.trim(),
      customerCareEmail: encrypt.encryptUsingAES256(data.email.trim()),
      loginName: encrypt.encryptUsingAES256(data.email.trim()),
      identificationCode: encrypt.encryptUsingAES256(data.email.trim()),
      phoneNumber: encrypt.encryptUsingAES256(data.phone.trim()),
      displayName: data.companyName.trim()
        ? data.companyName.trim()
        : data.firstName.trim() + " " + data.lastName.trim(),
      password: encrypt.encryptUsingAES256(data.password.trim()),
      currencySymbol: currencySymbol,
      zoneName: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      CountryId: data.CountryId,
      CountryIsoCode: data.CountryIsoCode,
      CountryName: data.CountryName,
      CaptchaToken: Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" ? recaptchaRef.current.getValue() : "",
      PromoCode: currencySymbol === "INR" ? data.referralCode : "",
      signupIPDetails: encrypt.encryptUsingAES256(JSON.stringify(data.signupIPDetails)) ?? ""
      // StateId: data.StateId,
      // CityId: data.CityId
    };
    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data?.status) {

        if (this.props.match?.params?.plandetail) {
          this.authUser();
        }
        else {
          this.setState({ isRegisterSuccess: true });
          if (this.props.location.pathname === "/signup-hajj-umrah")
            this.props.history.push("/thankyou-hajj-umrah")
          else if (this.props.location.pathname === "/signup-marketplace")
            this.props.history.push("/thankyou-marketplace")
          else if (this.props.location.pathname === "/signup-admin")
            this.props.history.push("/thankyou-admin")
          else if (this.props.location.pathname === "/signup-ai-assistant")
            this.props.history.push("/thankyou-ai-assistant")
          else if (localStorage.getItem("isFromB2Bmarketplace"))
            this.props.history.push("/thankyou-marketplace")
          else
            this.props.history.push("/thankyou-gps")

        }
      } else {
        recaptchaRef.current.reset();
        if (data?.validationErrors) {
          let errors = {};
          if (data?.validationErrors.customerCareEmail)
            errors.email = "Email address is already taken.";
          if (data?.validationErrors.phoneNumber)
            errors.phone = "Phone Number is already taken.";
          this.setState({
            isRegistering: false,
            isRegisterFailed: true,
            RegisterErrorMsg: data?.validationErrors.phoneNumber
              ? data?.validationErrors.phoneNumber
              : data?.validationErrors.customerCareEmail
                ? data?.validationErrors.customerCareEmail
                : "Email address is already taken.",
            errors,
          });
        } else {
          this.setState({
            isRegistering: false,
            isRegisterFailed: false
          });
        }
      }
    });
  };

  authUser = () => {
    let statedata = this.state.data;
    if (true) {
      var reqURL = "api/v1/user/login";
      var reqOBJ = {
        Request: {
          LoginName: encrypt.encryptUsingAES256(statedata.email.trim()),
          Password: encrypt.encryptUsingAES256(statedata.password.trim()),
          ContactInformation: { Email: encrypt.encryptUsingAES256(statedata.email.trim()) }
        },
        Flags: { IsFromAutoPopulated: true }
      };

      apiRequester(reqURL, reqOBJ, (data) => {
        localStorage.setItem("agentName", this.state.agentname);
        if (data.status.code === 0) {
          if (localStorage.getItem("afUserType") === null)
            localStorage.setItem("afUserType", data.response.afUserType);
          let isPersonateEnabled =
            Global.getEnvironmetKeyValue("isPersonateEnabled");
          if (isPersonateEnabled) {
            this.props.getLoginDetails((data) => {
              this.props.handleLoginBox(data);
              if (this.props.match?.params?.plandetail) {
                this.props.history.push(`/BillingAndSubscription/plan/` + this.props.match?.params?.plandetail);
              }
              else {
                this.props.history.push(`/`);
              }
            });
            this.props.getPortals();
          } else {
            this.props.handleLoginBox(data);
            if (this.props.match?.params?.plandetail) {
              this.props.history.push(`/BillingAndSubscription/plan/` + this.props.match?.params?.plandetail);
            }
            else {
              this.props.history.push(`/`);
            }
          }
        }
        // else if (data.status.code === 22) {
        //    recaptchaRef.current.reset();
        //    this.setState({
        //      isValidCaptcha: true
        //    });
        //  } 
        // else {
        //   // recaptchaRef.current.reset();
        //   this.setState({
        //     isButtonLoding: false,
        //     isValidCaptcha: true,
        //     errorMessage: Trans("_incorrectUserNamePassword"),
        //   });
        // }
      });
    }

  };

  handleDataChange = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    let countrName = e.target[e.target.selectedIndex].text;
    const foundCountry = DropdownList.CountryList.find(
      element => element.name === countrName.toString()
    );
    //If get countryCode then only update state
    if (foundCountry && foundCountry !== "undefined") {
      data["phone"] = "+" + foundCountry.countryCode.toString() + "-";
      data["CountryIsoCode"] = foundCountry.isoCode.toString();
      data["CountryName"] = foundCountry.name.toString();
    }
    this.setState({ data });
    if (e.target.name === "CountryId")
      this.getStateList(e.target.value);
    if (e.target.name === "StateId")
      this.getCityList(e.target.value);
  }
  getCountryList = () => {
    let portalId = Global.getEnvironmetKeyValue("portalId");
    const reqOBJ = {
      request: {
        ProviderId: parseInt(portalId)
      }
    };
    let reqURL = "admin/lookup/signupcountry";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
      this.setState({ CountryList: resonsedata.response })
    }.bind(this), "POST");
  }
  getStateList = (countryId, isFirstCall) => {
    let { data } = this.state;

    if (!isFirstCall) {
      data.State = "";
      data.City = "";
    }

    if (countryId === "") {
      this.setState({ StateList: [], CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        CountryID: countryId
      }
    };
    let reqURL = "admin/lookup/state";
    this.setState({ LoadingStateList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ StateList: resonsedata.response, CityList: [], data, LoadingStateList: false });
      if (isFirstCall && data.State) {
        this.getCityList(data.State, true);
      }
    }.bind(this), "POST");
  }
  getCityList = async (stateId, isFirstCall) => {
    let { data } = this.state;
    if (!isFirstCall) {
      data.City = "";
    }

    if (stateId === "") {
      this.setState({ CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        StateID: stateId,
        CountryID: data.CountryId
      }
    };
    let reqURL = "admin/lookup/city";
    this.setState({ LoadingCityList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
    }.bind(this), "POST");
  }
  getSignUpIPDetails = () => {
    let data = this.state.data;
    return fetch(process.env.REACT_APP_GETIPDETAILS_ENDPOINT)
      .then((res) => res.json())
      .then((locationdata) => {
        data.signupIPDetails = locationdata;
        this.setState({ data });
      }).catch((err) => {
      });
  };

  agreeNewsLetter = () => {
    let data = this.state.data;
    data.agreenewsletter = !this.state.agreenewsletter;
    this.setState({
      data
    });
  }

  componentDidMount() {
    this.getCountryList();
    this.getSignUpIPDetails();
  }
  handleEmail = () => {
    const errors = this.validateEmail();
    this.setState({ errors: errors || {}, isEmailLoading: false });
    if (errors) return;

    const { data } = this.state;
    this.setState({ isEmailEntered: !this.state.isEmailEntered });
    var reqURL = "tw/register/email";
    var reqOBJ = { email: data?.email };
    apiRequester_unified_api(reqURL, reqOBJ, () => {
      this.setState({
        isEmailEntered: true,
        isEmailLoading: false,
        isEmailOTPLoading: false
      });
    });
  };

  render() {
    const {
      data,
      errors,
      isRegisterSuccess,
      isRegisterFailed,
      isEmailEntered,
      isEmailOTP,
      isEmailOTPValidate,
      RegisterErrorMsg,
      CountryList,
      isEmailLoading,
      isEmailOTPLoading,
      CityList,
      StateList,
      LoadingStateList,
      LoadingCityList, isTimerActive, timer, isLinkDisabled, emailSentMsgShow
    } = this.state;
    let currencyList = [{ name: "Select", value: "" }];
    Global.getEnvironmetKeyValue("availableCurrencies") && Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        name: x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode + " (" + x.symbol + ")",
      })
    );
    const { signUpMode } = this.props;
    return (
      <div>
        {!isRegisterSuccess && !isRegisterFailed && (
          <div>
            {!isEmailEntered && !isEmailOTPValidate && (

              <div className="row">
                <Helmet>
                  <title>
                    {this.props.location.pathname.replace("/", "").charAt(0).toUpperCase() + this.props.location.pathname.replace("/", "").slice(1)} | Tourwiz
                    {/* {signUpMode === "ai-assistant" ? "Signup-AI-Assistant | Tourwiz" : "Signup-GPS | Tourwiz"} */}
                  </title>
                </Helmet>
                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "email",
                    label: "Email Address *",
                    maxlength: 100,
                  })}
                </div>

                <div className="col-lg-12">
                  <button
                    onClick={() => { this.handleEmailOTP(false); }}
                    className="btn btn-primary w-100 btn-signin"
                  >
                    {isEmailLoading && <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true">
                    </span>}
                    Continue
                  </button>
                </div>
              </div>
            )}

            {isEmailEntered && isEmailOTP && !isEmailOTPValidate && (
              <div className="row">
                <Helmet>
                  <title>
                    {signUpMode === "ai-assistant" ? "Signup-AI-Assistant - OTP Verification | Tourwiz" : "Signup-GPS - OTP Verification | Tourwiz"}
                  </title>
                </Helmet>
                <div className="col-lg-12 mt-1 mb-1">
                  {emailSentMsgShow && <span className="text-success">OTP sent successfully in your email</span>}
                </div>
                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "emailOtp",
                    label: "Email OTP *",
                    maxlength: 6,
                  })}
                </div>
                <div className="col-lg-12 mt-0 mb-2 d-flex justify-content-between">
                  {isLinkDisabled ? "Resend OTP" : <a href="javascript:void(0);" onClick={() => this.handleEmailOTP(false)} disabled={isLinkDisabled}>
                    Resend OTP
                  </a>}
                  {isTimerActive && (
                    <span>{timer} seconds</span>
                  )}
                </div>
                <div className="col-lg-12">
                  <button
                    onClick={() => this.handleEmailOTP(true)}
                    className="btn btn-primary w-100 btn-signin"
                  >
                    {isEmailOTPLoading && <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true">
                    </span>}
                    Continue
                  </button>
                </div>
              </div>
            )}

            {isEmailEntered && (isEmailOTP ? isEmailOTPValidate : true) && (
              <div className="row">
                <Helmet>
                  <title>
                    {signUpMode === "ai-assistant" ? "Signup-AI-Assistant- Details | Tourwiz" : "Signup-GPS - Details | Tourwiz"}
                  </title>
                </Helmet>
                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "email",
                    label: "Email Address *",
                    maxlength: 100,
                    disable: true,
                  })}
                </div>

                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "firstName",
                    label: "First Name *",
                    minlength: 2,
                    maxlength: 50,
                  })}
                </div>

                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "lastName",
                    label: "Last Name *",
                    minlength: 2,
                    maxlength: 50,
                  })}
                </div>

                <div className="col-lg-12">
                  {this.renderInput(
                    "companyName",
                    "Company Name",
                    "companyName",
                    false,
                    null,
                    2,
                    60
                  )}
                </div>

                <div className="col-lg-12">
                  <div className={"form-group " + "Country"}>
                    <label htmlFor={"Country"}>{"Country *"}</label>
                    <div className="input-group">
                      <select
                        value={data.CountryId}
                        onChange={(e) => this.handleDataChange(e)}
                        name={"CountryId"}
                        id={"CountryID"}
                        //disabled={disabled}
                        className={"form-control"}>
                        <option key={0} value={''}>Select</option>
                        {CountryList.map((option, key) => (

                          <option
                            key={key}
                            value={
                              option["countryId"]
                            }
                          >
                            {option["countryName"]}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors["CountryId"] && (
                      <small className="alert alert-danger mt-2 p-1 d-inline-block">
                        {errors["CountryId"]}
                      </small>
                    )}
                  </div>

                </div>

                <div className="col-lg-12">
                  {this.renderSelect("currencySymbol", "Currency *", currencyList, undefined, undefined, false)}
                </div>
                {/* 
                <div className="col-lg-12">
                  <div className={"form-group " + "StateId"}>
                    <label htmlFor={"StateId"}>{"State *"}</label>
                    <div className="input-group">
                      <select
                        value={data.StateId}
                        onChange={(e) => this.handleDataChange(e)}
                        name={"StateId"}
                        id={"StateID"}
                        //disabled={disabled}
                        className={"form-control"}>
                        <option key={0} value={''}>Select</option>
                        {StateList.map((option, key) => (

                          <option
                            key={key}
                            value={
                              option["stateId"]
                            }
                          >
                            {option["stateName"]}
                          </option>
                        ))}
                      </select>
                      {LoadingStateList ? (
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span
                              className="spinner-border spinner-border-sm mr-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {errors["StateId"] && (
                      <small className="alert alert-danger mt-2 p-1 d-inline-block">
                        {errors["StateId"]}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className={"form-group " + "CityID"}>
                    <label htmlFor={"CityID"}>{"City *"}</label>
                    <div className="input-group">
                      <select
                        value={data.CityId}
                        onChange={(e) => this.handleDataChange(e)}
                        name={"CityId"}
                        id={"CityId"}
                        //disabled={disabled}
                        className={"form-control"}>
                        <option key={0} value={''}>Select</option>
                        {CityList && CityList.map((option, key) => (

                          <option
                            key={key}
                            value={
                              option["cityId"]
                            }
                          >
                            {option["cityName"]}
                          </option>
                        ))}
                      </select>
                      {LoadingCityList ? (
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span
                              className="spinner-border spinner-border-sm mr-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {errors["CityId"] && (
                      <small className="alert alert-danger mt-2 p-1 d-inline-block">
                        {errors["CityId"]}
                      </small>
                    )}
                  </div>
                </div> */}

                <div className="col-lg-12">
                  {this.renderContactInput(
                    "phone",
                    "Phone Number * (e.g. 9823999999)",
                    "text",
                    true
                  )}
                </div>

                <div className="col-lg-12">
                  {this.renderInputParam({
                    name: "password",
                    label: "Password *",
                    type: "password",
                    minlength: 2,
                    maxlength: 100,
                  })}
                </div>
                {signUpMode !== "ai-assistant" &&
                  <div className="col-lg-12">
                    {this.renderInputParam({
                      name: "referralCode",
                      label: "Referral Code",
                      minlength: 2,
                      maxlength: 50,
                      disable: true
                    })}
                  </div>}
                {Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && (
                  <div className="col-lg-12">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                      hl={'en'}
                    />
                    {this.state.errors.captcha && (
                      <div className="col-lg-12 col-sm-12 m-0 p-0">
                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                          {this.state.errors.captcha}
                        </small>
                      </div>
                    )}
                  </div>)}

                <div className="col-lg-12">
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    By signing up, you agree to our{" "}
                    <Link
                      to="/terms-of-use"
                      target="_blank"
                      className="text-primary"
                    >
                      Terms of Use and Privacy Policy
                    </Link>
                  </p>
                </div>

                <div className="col-lg-12">
                  <div className=" custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      type="checkbox"
                      id={"signupchk"}
                      checked={this.state.agreenewsletter}
                      onChange={() => this.agreeNewsLetter()}
                    />
                    <label className="custom-control-label" style={{ fontSize: "14px", color: "#666", 'margin-bottom': "1rem" }} htmlFor={"signupchk"}>I want to subscribe to the newsletter.{" "}
                      <Link
                        to="/terms-of-use"
                        target="_blank"
                        className="text-primary"
                      >
                        Terms of Use and Privacy Policy
                      </Link></label>
                  </div>

                </div>

                {this.state.isRegistering && (
                  <div className="col-lg-12 text-right">
                    <button className="btn btn-primary w-100 btn-signin">
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Sign up
                    </button>
                  </div>
                )}
                {!this.state.isRegistering && (
                  <div className="col-lg-12 text-right">
                    <button
                      onClick={() => this.handleSignup()}
                      className="btn btn-primary w-100 btn-signin"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isRegisterSuccess && (
          <div>
            <Helmet>
              <title>
                {signUpMode === "ai-assistant" ? "Signup-AI-Assistant - Thank You | Tourwiz" : "Signup-GPS - Thank You | Tourwiz"}
              </title>
            </Helmet>
            <h3 className="mt-5 text-primary text-center">Welcome aboard !</h3>
            <h6 className="mt-3 mb-5 text-center">
              Please go ahead and login with your credentials.
            </h6>
          </div>
        )}

        {isRegisterFailed && (
          <div>
            <h3 className="mt-5 text-primary text-center">
              Oops ! something went wrong.
            </h3>
            <h6 className="mt-3 text-center">
              We were unable to create your account, please try again later.
            </h6>
            {RegisterErrorMsg &&
              <p className="mt-3 mb-5 text-center">{RegisterErrorMsg}</p>
            }
          </div>
        )}
      </div>
    );
  }
}

export default AgentSignUpNew;
//