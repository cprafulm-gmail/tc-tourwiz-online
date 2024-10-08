import React, { useContext } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import { apiRequester_quotation_api } from "../../services/requester-quotation";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import * as DropdownList from "../../helpers/dropdown-list";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import { cmsConfig } from "../../helpers/cms-config";
import Form from "../../components/common/form";
import SVGIcon from "../../helpers/svg-icon";
import { Link } from "react-router-dom";
import * as Global from "../../helpers/global";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../config";
import { decode } from "html-entities";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as encrypt from "../../helpers/encrypto";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import useForm from "../../components/common/useForm";
import HtmlParser from "../../helpers/html-parser";
import { CMSContext } from "../../screens/cms/cms-context";
import { Helmet } from "react-helmet";
import PriceConverter from "../../components/common/PriceConverter";
import ModelPopup from "../../helpers/model";

const CMSInquiry = (props) => {
  const recaptchaRef = useRef();
  const { cmsState, cmsProps } = useContext(CMSContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    CountryId: "101",
    CountryIsoCode: "IN",
    CountryName: "India",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    comments: "",
    agreeTerms: "",
    captcha: "",
    isValidCaptcha: true,
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    isAgreeTerms: true,
    isInquirySubmited: false,
    result: "",
    resultEmail: "",
    isLoading: true,
    isBtnLoading: false,
    CountryList: [],
    cmsSettings: "", Name: "", EmailAddress: "",
    isEmailEntered: true,
    emailOtp: "",
    isEmailOTP: true,
    isEmailOTPValidate: false,
    isEmailLoading: false,
    isEmailOTPLoading: false,
    isTimerActive: false,
    timer: 30,
    isLinkDisabled: false,
    emailSentMsgShow: false,
    isOTPSentPopup: false,
  });

  const rule = {
    data,
    setData,
    errors,
    setErrors
  }
  const { renderInput, renderContactInput, validateFormData, renderTextarea } = useForm(rule);
  const onChangeCaptcha = (value) => {
    setData((prevState) => { return { ...prevState, captcha: value, isValidCaptcha: true }; });
  }

  let currencyList = [];
  Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
    currencyList.push({
      label: x.description + " - " + x.isoCode + " (" + x.symbol + ")",
      value: x.isoCode,
    })
  );

  let timerId = null;
  const startTimer = () => {
    timerId = setInterval(() => {
      setState((prevState) => {
        if (prevState.timer === 0) {
          clearInterval(timerId);
          return {
            ...prevState,
            isTimerActive: false,
            isLinkDisabled: false,
            timer: 30,
          };
        }
        return {
          ...prevState, // Spread the previous state to preserve other properties
          timer: prevState.timer - 1,
        };
      });
    }, 1000);
  };


  const validateEmailOTP = () => {
    const errors = {};

    if (!validateFormData(data.emailOtp, "require"))
      errors.emailOtp = "Please enter valid email OTP.";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleEmailOTP = (isForOTPVarify) => {
    if (!isForOTPVarify) {
      setState((prevState) => {
        return {
          ...prevState,
          isTimerActive: true,
          isLinkDisabled: true,
          emailSentMsgShow: true,
        };
      });
      startTimer();
      setTimeout(() => {
        setState((prevState) => {
          return {
            ...prevState,
            emailSentMsgShow: false,
          };
        });
      }, 5000);
    }
    setState((prevState) => {
      return {
        ...prevState,
        isEmailLoading: true,
      };
    });
    let test = false;
    if (isForOTPVarify) {
      const errors = validateEmailOTP();
      setState((prevState) => {
        return {
          ...prevState,
          errors: errors || {}, isEmailOTPLoading: true
        };
      });
      if (errors) return;
    }
    var reqURL = "tw/setup/otp";
    var reqOBJ = {
      "customerCareEmail": encrypt.encryptUsingAES256(data.email.trim()),
      "Otp": state.emailOtp
      // StateId: data.StateId,
      // CityId: data.CityId
    };
    apiRequester_unified_api(reqURL, reqOBJ, (dataRes) => {
      debugger
      console.log({ dataRes });
      if (dataRes?.result === "ok") {
        if (isForOTPVarify) {
          data.emailOtp = "";
          setState((prevState) => {
            return {
              ...prevState,
              isOTPSentPopup: false,
              isEmailEntered: true,
              isEmailOTPValidate: true,
              isEmailLoading: false,
              isEmailOTPLoading: false
            };
          });
          SubmitInquiry(true);
        }
        else {
          setState((prevState) => {
            return {
              ...prevState,
              isOTPSentPopup: true
            };
          });
        }
      }
      else {
        const errors = {};
        errors.emailOtp = "Invalid otp";
        setState((prevState) => {
          return {
            ...prevState,
            isOTPSentPopup: true,
            errors: errors || {}, isEmailOTPLoading: false
          };
        });
      }
    });
  };


  const handleBookPackagePopup = () => {
    setState((prevState) => {
      return {
        ...prevState,
        isOTPSentPopup: false,
        emailOtp: "",
      };
    });
  };

  const getDetails = async () => {
    let reqOBJ = {};
    let reqURL =
      "cms/specialpromotiondetails?portalid=" + Global.getEnvironmetKeyValue("portalId") + "&itemid=" + props.match.params.id;
    return new Promise((resolve, reject) => {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          setState((prevState) => {
            return {
              ...prevState,
              result: data?.response || "",
              isLoading: false,
            };
          });
          resolve();
        },
        "GET"
      );
    });
  };

  const SubmitInquiry = (isVerify) => {
    state.isBtnLoading = true;
    setState((prevState) => {
      return {
        ...prevState, isBtnLoading: true,
        isOTPSentPopup: false,
        emailOtp: ""
      };
    })
    const details = state.result.details ? state.result.details[0] : "";
    const title = (details && details?.shortdescription) || "";
    const duration = (details && details?.duration) || 4;
    let reqOBJ = {
      request: {
        SpecialPromotionID: (details && details?.specialpromotionid) || "0",
        UserToken: localStorage.getItem("userToken") ? localStorage.getItem("userToken") : "",
        AgentID: (details && details?.twAgentId) || Global.getEnvironmetKeyValue("portalId"),
        Title: title,
        Duration: duration,
        Amount: details?.price,
        FirstName: data.firstName,
        LastName: data.lastName,
        Address: data.address1,
        Address2: data.address2,
        City: data.city,
        State: data.state,
        PostCode: data.postalCode,
        EmailAddress: data.email,
        Phone: data.phone,
        Mobile: data.phone,
        Country: data.CountryName,
        IsReceiveNewsLetter: 1,
        IsReceiveElectronicCommunication: 1,
        ModuleID: 1,
        CultureId: 1,
        ParentId: 1,
        Comments: data?.comments,
        IsShowOnMarketPlace: data?.isShowOnMarketPlace,
        SpecialPromotionType: data?.specialPromotionType,
      }
    };

    let reqURL =
      "cms/newsletter/add";
    if (isVerify) {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          if (data?.error) {
            const errors = {};
            errors.createInquiry = data?.error;
            setErrors((prevState) => {
              return { ...prevState, createInquiry: data?.error };
            });
            setState((prevState) => { return { ...prevState, isBtnLoading: false }; });
          }
          else {
            setState((prevState) => { return { ...prevState, isInquirySubmited: true, isBtnLoading: false }; });
          }
        },
        "POST"
      );
    }
    else {
      handleEmailOTP(false);
    }
  };

  const handleRegistration = () => {
    const details = state.result.details ? state.result.details[0] : "";
    const title = (details && details?.shortdescription) || "";
    var reqURL = "tw/setup";
    let currencySymbol = "INR";
    var reqOBJ = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      companyName: title.trim(),
      customerCareEmail: encrypt.encryptUsingAES256(data.email.trim()),
      loginName: encrypt.encryptUsingAES256(data.email.trim()),
      identificationCode: encrypt.encryptUsingAES256(data.email.trim()),
      phoneNumber: encrypt.encryptUsingAES256(data.phone.trim()),
      displayName: data.firstName.trim() + " " + data.lastName.trim(),
      password: encrypt.encryptUsingAES256(data.email.trim()),
      currencySymbol: currencySymbol,
      zoneName: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      CountryId: data.CountryId,
      CountryIsoCode: data.CountryIsoCode,
      CountryName: data.CountryName,
      isCustomerMode: true,
      CaptchaToken: Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" ? recaptchaRef.current.getValue() : ""
    };

    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data?.status) {
        setState((prevState) => { return { ...prevState, isRegisterSuccess: true }; });
      } else {
        recaptchaRef.current.reset();
        if (data?.validationErrors) {
          let errors = {};
          if (data?.validationErrors.customerCareEmail)
            errors.email = "Email address is already taken.";
          if (data?.validationErrors.phoneNumber)
            errors.phone = "Phone Number is already taken.";
          setErrors((prevState) => { return { ...prevState, errors: { ...errors || {} } }; });
          setState((prevState) => {
            return {
              ...prevState,
              isRegistering: false,
              isRegisterFailed: false,
              RegisterErrorMsg: data?.validationErrors.phoneNumber
                ? data?.validationErrors.phoneNumber
                : data?.validationErrors.customerCareEmail
                  ? data?.validationErrors.customerCareEmail
                  : "Email address is already taken.",
            };
          });
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              isRegistering: false,
              isRegisterFailed: false,
              RegisterErrorMsg: "Email address is already taken.",
            };
          });
        }
      }
    });
  };
  const sendInquiryEmail = (flag) => {
    const errors = validate();
    setErrors((prevState) => { return { ...prevState, ...errors }; });
    if (errors) return;
    SubmitInquiry(flag);
  };


  const validate = () => {
    const errors = {};

    if (!validateFormData(data.firstName, "require"))
      errors.firstName = "First Name required";
    else if (!validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (
      !validateFormData(data.firstName, "length", { min: 2, max: 50 })
    )
      errors.firstName = "First Name must be between 2 and 50 characters long";

    if (!validateFormData(data.lastName, "require"))
      errors.lastName = "Last Name required";
    else if (!validateFormData(data.lastName, "special-characters-not-allowed", /[<>]/))
      errors.lastName = "< and > characters not allowed";
    else if (
      !validateFormData(data.lastName, "length", { min: 2, max: 50 })
    )
      errors.lastName = "Last Name must be between 2 and 50 characters long";


    if (!validateFormData(data.email, "require"))
      errors.email = "Email required";
    else if (!validateFormData(data.email, "email"))
      errors.email = "Enter valid Email";

    if (!validateFormData(data.phone, "require"))
      errors.phone = "Phone required";

    const tempmobilenumber = parsePhoneNumberFromString(data.phone);
    if (!validateFormData(data.phone, "require_phoneNumber"))
      errors.phone = "Enter valid Mobile Number";
    else if (!validateFormData(data.phone, "phonenumber"))
      errors.phone = "Enter valid Mobile Number";
    else if (
      !validateFormData(data.phone, "phonenumber_length", {
        min: 8,
        max: 14
      })
    )
      errors.phone = "Mobile Number must be between 8 and 14 characters long";
    else if (!tempmobilenumber)
      errors.phone = "Mobile Number required";

    if (
      Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") ===
      "true" &&
      recaptchaRef.current.getValue() === ""
    ) {
      errors.isValidCaptcha = !(recaptchaRef.current.getValue() === "");
    }

    // if (!validateFormData(data.business, "require"))
    //   errors.business = "Subject required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleAgreeTerms = () => {
    setState((prevState) => { return { ...prevState, isAgreeTerms: !state.isAgreeTerms }; });
  };
  const getCountryList = async () => {
    const reqOBJ = {
      request: {
        ProviderId: parseInt(Global.getEnvironmetKeyValue("portalId"))
      }
    };
    let reqURL = "admin/lookup/signupcountry";
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
        setState((prevState) => { return { ...prevState, CountryList: resonsedata.response }; })
        resolve()
      }.bind(this), "POST");
    });
  }
  const getPage = async () => {
    const { siteurl } = state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" +
      siteurl +
      "&modulename=ContactDetails&culturecode=en-us";
    return new Promise((resolve, reject) => {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          setState((prevState) => {
            return {
              ...prevState,
              resultEmail: (data?.response && data?.response[0]?.desktopHtml) || ""
            };
          });
          resolve();
        },
        "GET"
      );
    });
  };

  const getUserData = async () => {
    const reqOBJ = {
    };
    let reqURL = "admin/user/details";
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        let data = resonsedata.response[0]
        let Name = data.firstName + " " + data.lastName;
        let EmailAddress = data.customerCareEmail;
        setState((prevState) => { return { ...prevState, Name, EmailAddress } });
        resolve();
      }.bind(this), "GET");
    });
  }
  useEffect(() => {
    (async () => {
      Config.codebaseType !== "tourwiz-customer" && await getUserData();
      await getCountryList();
      Config.codebaseType === "tourwiz-marketplace" && await getPage();
      await getDetails();
    })();
  }, []);

  const handleDataChange = (e) => {
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
    setData((prevState) => { return { ...prevState, ...data }; });
  }

  const { resultEmail, isLoading, isInquirySubmited, isAgreeTerms, CountryList,
    isEmailOTP,
    isEmailOTPValidate,
    isEmailLoading,
    isEmailOTPLoading,
    LoadingCityList, isTimerActive, timer, isLinkDisabled, emailSentMsgShow, isEmailEntered, isOTPSentPopup } = state;
  const { cmsSettings } = props;

  const details = state.result && state.result.details ? state.result.details[0] : "";
  const title = (details && details?.shortdescription) || "";
  const defaultImg = (details && details?.imagepath) ? details?.imagepath.indexOf(".s3.") > 0 ? details?.imagepath :
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/" +
    details?.imagepath : "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg";

  var portalEmail =
    Global.getEnvironmetKeyValue("portalCustomerCareEmail") ??
    Global.getEnvironmetKeyValue("customerCareEmail");
  if (resultEmail != "") {
    var res = decode(resultEmail);
    const paragraphs = res.split("</div>");
    portalEmail =
      typeof paragraphs[2] === "string" &&
        paragraphs[2].indexOf("EmailUS:") > 0 &&
        paragraphs[2].indexOf("Your email details") == -1
        ? paragraphs[2].replace("<div>", "").replace("EmailUS:", "")
        : portalEmail;
  }
  const customStyle = `
  .textLimited {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 13; /* number of lines to show */
            line-clamp: 13; 
    -webkit-box-orient: vertical;
 }`

  let starItems = [];
  for (var i = 0; i < details?.rating; i++) {
    starItems.push(<SVGIcon
      name="star"
      key={i}
      type="fill"
      width="14"
      height="14"
      className="text-primary"
    ></SVGIcon>);
  }
  const [convertedPrice, convertedCurrency] = PriceConverter({ amount: details?.price, currentCurrency: cmsState?.ipCurrencyCode });
  return (
    <div>
      <CMSPageTitle title={title} icon="map-marker" />
      {!isLoading && (
        <div
          style={{ minHeight: "calc(100vh - 284px)" }}
          className="container mt-4 mb-5"
        >
          <style>{customStyle}</style>
          <div className="row">
            <div className="col-lg-8">

              <div className="mt-3 shadow p-4">
                {!isInquirySubmited && (
                  <div className="row">
                    <div className="col-lg-6">
                      {renderInput({ name: "firstName", label: "First Name *" })}
                    </div>

                    <div className="col-lg-6">
                      {renderInput({ name: "lastName", label: "Last Name *" })}
                    </div>

                    <div className="col-lg-6">
                      {renderInput({ name: "email", label: "Email *" })}
                    </div>

                    <div className="col-lg-6">
                      {renderContactInput({ name: "phone", label: "Phone *", type: "text", isDefaultLoad: true })}
                    </div>

                    <div className="col-lg-6">
                      {renderInput({ name: "address1", label: "Address1" })}
                    </div>
                    <div className="col-lg-6">
                      {renderInput({ name: "address2", label: "Address2" })}
                    </div>
                    <div className="col-lg-3">
                      {renderInput({ name: "state", label: "State" })}
                    </div>
                    <div className="col-lg-3">
                      {renderInput({ name: "city", label: "City" })}
                    </div>
                    <div className="col-lg-3">
                      {renderInput({ name: "postalCode", label: "Postal Code" })}
                    </div>
                    <div className="col-lg-3">
                      <label htmlFor={"Country"}>{"Country"}</label>
                      <select
                        value={data.CountryId}
                        onChange={(e) => handleDataChange(e)}
                        name={"CountryId"}
                        id={"CountryID"}
                        //disabled={disabled}
                        className={"form-control"}>
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
                    <div className="col-lg-12">
                      {renderTextarea({ name: "comments", label: "Comments" })}
                    </div>
                    <div className="col-lg-12">
                      <div className=" custom-control custom-checkbox mb-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={state.isAgreeTerms}
                          onChange={handleAgreeTerms}
                        />
                        <label
                          className="custom-control-label text-secondary small"
                          htmlFor="agreeTerms"
                        >
                          By using this form you agree with the storage and
                          handling of your data in accordance with the{" "}
                          <Link
                            to="/terms"
                            target="_blank"
                            className="text-primary"
                          >
                            Privacy & Cookie Policy.
                          </Link>
                        </label>
                      </div>
                    </div>

                    {!isAgreeTerms && (
                      <div className="col-lg-12">
                        <h6 className="alert alert-danger d-inline-block p-2">
                          <small>Please agree Privacy & Cookie Policy.</small>
                        </h6>
                      </div>
                    )}
                    {Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") === "true" && (
                      <div className="col-lg-12">
                        <div className="form-group">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                            hl={'en'}
                            onChange={(value) => { setData((prevState) => { return { ...prevState, captcha: value, isValidCaptcha: true }; }); }}
                          />
                        </div>
                      </div>)}
                    {errors.isValidCaptcha !== undefined && !errors.isValidCaptcha && (
                      <div className="col-lg-12 col-sm-12 m-0">
                        <small className="alert alert-danger mt-0 p-1 d-inline-block">
                          {"Please verify captcha"}
                        </small>
                      </div>
                    )}
                    {errors.createInquiry !== undefined && errors.createInquiry !== "" && (
                      <div className="col-lg-12 col-sm-12 m-0">
                        <small className="alert alert-danger mt-0 p-1 d-inline-block">
                          {errors.createInquiry}
                        </small>
                      </div>
                    )}
                    <div className="col-lg-12">
                      {!state.isBtnLoading ?
                        <button className="btn btn-primary"
                          onClick={() => sendInquiryEmail(true)}>
                          Submit
                        </button> : <button className="btn btn-primary" >
                          <span className="spinner-border spinner-border-sm mr-2"></span> Submit
                        </button>
                      }

                    </div>
                  </div>

                )}

                {isInquirySubmited && (
                  <div className="text-center">
                    <h5 className="text-primary mb-4">
                      Your inquiry has been submitted successfully. We will
                      get in touch with you soon.
                    </h5>

                    <p className="d-none">
                      If you have any other queries in the meantime, please
                      don't hesitate to get in touch with us at{" "}
                      <a
                        href={Config.codebaseType === "tourwiz-marketplace" ? "mailto:" + portalEmail : "mailto:sales@thetripcentre.com"}
                        className="text-primary"
                      >
                        {/* {Config.codebaseType === "tourwiz-marketplace" ? portalEmail : "sales@thetripcentre.com"} */}
                        {state.EmailAddress || portalEmail}
                      </a>
                    </p>
                  </div>
                )}
                {isInquirySubmited && (
                  <div style={{ display: "none" }}>
                    <div id="emailHTML">
                      <div style={{ border: "solid 2px #434C5B" }}>
                        <div
                          style={{
                            background: "#434C5B",
                            color: "#fff",
                            padding: "8px 8px 12px 8px",
                          }}
                        >
                          <b>{"Inquiry for " + title}</b>
                        </div>
                        <div style={{ padding: "8px 16px" }}>
                          <label>Name : </label>
                          <b>{data?.firstName + " " + data?.lastName}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Subject : </label>
                          <b>{"Inquiry for " + title}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Email : </label>
                          <b>{data?.email}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Phone : </label>
                          <b>{data?.phone}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Address 1 : </label>
                          <b>{data?.address1}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Address 2 : </label>
                          <b>{data?.address2}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>State : </label>
                          <b>{data?.state}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>City : </label>
                          <b>{data?.city}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Postal Code : </label>
                          <b>{data?.postalCode}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Country : </label>
                          <b>{data?.country}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Comments : </label>
                          <b>{data?.comments}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mt-3 shadow p-4">
                <img
                  className="img-fluid"
                  src={defaultImg}
                  alt={details?.shortdescription}
                />
                <h5 className="mt-3 font-weight-bold">
                  {details?.shortdescription}
                </h5>
                <div><span title="Package star rating">{starItems}</span>
                  {details?.specialPromotionType && details?.rating ? ` | ` : ``}
                  <span title="Package type">{details?.specialPromotionType !== "" && details?.specialPromotionType !== null && details?.specialPromotionType ? `${details?.specialPromotionType}` : ``}</span>
                  {((details?.specialPromotionType || details?.rating) && (!isNaN(parseInt(details.duration)) && parseInt(details.duration) > 0)) ? ` | ` : ``}
                  <span title="Package duration">{!isNaN(parseInt(details.duration)) && (parseInt(details.duration) > 0) && (parseInt(details.duration) > 1 ? `${parseInt(details.duration)}D/${parseInt(details.duration) - 1}N` : `${parseInt(details.duration)}D`)}</span></div>

                <p className="text-secondary textLimited mt-3">
                  <HtmlParser
                    text={decode(details?.summarydescription)}
                  />
                </p>
                {(details?.price > 0) &&
                  <h5 className="text-primary font-weight-">
                    {(details?.isShowOnMarketPlace ? "Starting at " + convertedCurrency : cmsState?.cmsContents?.agentDetails?.currencySymbol + " ") + " " + convertedPrice + " "}
                    <span style={{ fontSize: "15px" }} className="d-block text-secondary"> per person</span>
                  </h5 >
                }
              </div >
            </div >
          </div >
        </div >
      )}

      {
        (isOTPSentPopup) && (
          <ModelPopup
            sizeClass={"modal-sm"}
            header={"Verify OTP"}
            content={
              <div className="container">
                <div className="row">
                  {isEmailEntered && isEmailOTP && !isEmailOTPValidate && (
                    <div className="row">
                      <div className="col-lg-12 mt-1 mb-1">
                        {emailSentMsgShow && <span className="text-success">OTP sent successfully in your email</span>}
                      </div>
                      <div className="col-lg-12">
                        {renderInput({
                          name: "emailOtp",
                          label: "Email OTP *",
                          maxlength: 6,
                        })}
                      </div>

                      <div className="col-lg-12 mt-0 mb-2 d-flex justify-content-between">
                        {isLinkDisabled ? "Resend OTP" : <a href="javascript:void(0);" onClick={() => handleEmailOTP(false)} disabled={isLinkDisabled}>
                          Resend OTP
                        </a>}
                        {isTimerActive && (
                          <span>{timer} seconds</span>
                        )}
                      </div>
                      <div className="col-lg-12">
                        <button
                          onClick={() => handleEmailOTP(true)}
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
                </div>
              </div>
            }
            handleHide={handleBookPackagePopup}
          />
        )
      }
      {
        isLoading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
          >
            <Loader />
          </div>
        )
      }
    </div >
  );
}

export default CMSInquiry;
