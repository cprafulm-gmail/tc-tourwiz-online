import React from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import { apiRequester_quotation_api } from "../../services/requester-quotation";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import * as DropdownList from "../../helpers/dropdown-list";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import { cmsConfig } from "../../helpers/cms-config";
import Form from "../../components/common/form";
import { Link } from "react-router-dom";
import moment from "moment";
import * as Global from "../../helpers/global";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../config";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as encrypt from "../../helpers/encrypto";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { CMSContext } from "./cms-context";

const CMSInquiry = (props) => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings } = cmsState;
  const recaptchaRef = useRef();
  const [state, setState] = useState({
    data: {
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
    },
    errors: {},
    isAgreeTerms: true,
    isInquirySubmited: false,
    resultEmail: "",
    isLoading: true,
    isBtnLoading: false,
    CountryList: [],
  });
  const [result, setResult] = useState("");

  const onChangeCaptcha = (value) => {
    setState({ ...state, data: { ...state.data, captcha: value, isValidCaptcha: true } });
  }
  const getDetails = () => {
    var portalId;
    let reqOBJ = {};
    let reqURL =
      "cms/specialpromotiondetails?portalid=" + portalId + "&itemid=" + props.match.params.id;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        console.log("getDetails before result", result);
        setResult({
          result: data.response
        });
        console.log("getDetails after result", result);
      },
      "GET"
    );
  };

  const SubmitInquiry = () => {
    const { data } = state;
    //state.isBtnLoading = true;
    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "";

    let reqOBJ = {
      request: {
        SpecialPromotionID: (details && details?.specialpromotionid) || "0",
        UserToken: localStorage.getItem("userToken") ? localStorage.getItem("userToken") : "",
        AgentID: (details && details?.twAgentId) || Global.getEnvironmetKeyValue("portalId"),
        Title: title,
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
        Comments: state.data?.comments
      }
    };
    let reqURL =
      "cms/newsletter/add";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        if (data?.error) {
          const errors = {};
          errors.createInquiry = data?.error;
          setState({ ...state, errors: errors || {}, isBtnLoading: false });
        }
        else {
          setState({ ...state, isInquirySubmited: true, isBtnLoading: false });
        }
        //setState({ isInquirySubmited: true }, () => handleEnquiryEmail());
      },
      "POST"
    );
  };

  const handleRegistration = () => {
    const { data } = state;
    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "";
    //let data = state.data;
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
      // StateId: data.StateId,
      // CityId: data.CityId
    };

    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data?.status) {
        setState({ ...state, isRegisterSuccess: true });
      } else {
        recaptchaRef.current.reset();
        if (data?.validationErrors) {
          let errors = {};
          if (data?.validationErrors.customerCareEmail)
            errors.email = "Email address is already taken.";
          if (data?.validationErrors.phoneNumber)
            errors.phone = "Phone Number is already taken.";
          setState({
            ...state,
            isRegistering: false,
            isRegisterFailed: false,
            RegisterErrorMsg: data?.validationErrors.phoneNumber
              ? data?.validationErrors.phoneNumber
              : data?.validationErrors.customerCareEmail
                ? data?.validationErrors.customerCareEmail
                : "Email address is already taken.",
            errors,
          });
        } else {
          setState({
            ...state,
            isRegistering: false,
            isRegisterFailed: false,
            RegisterErrorMsg: "Email address is already taken.",
          });
        }
      }
    });
  };
  const sendInquiryEmail = () => {
    const errors = validate();
    setState({ ...state, errors: errors || {} });
    if (errors) return;
    SubmitInquiry();
  };


  const validateFormData = (data, type, options) => {
    if (typeof data === "string") data = data.trim();
    let output = false;
    switch (type) {
      case "require":
        output = data !== "" && data !== undefined;
        break;
      case "require_date":
        output = data !== "" && data !== "0001-01-01T00:00:00";
        break;
      case "require_phoneNumber":
        output = data.indexOf("-") > -1 && data.split("-")[1] !== "";
        output = output || (data.indexOf("-") > -1 && data !== "");
        break;
      case "length":
        if (options.min !== undefined && options.max !== undefined)
          output = data.length >= options.min && data.length <= options.max;
        else if (options.min) output = data.length >= options.min;
        else if (options.max) output = data.length <= options.max;
        else output = false;
        break;
      case "only-numeric":
        output = /^[+]?\d+$/g.test(data);
        break;
      case "numeric":
        output = /^[0-9.]+$/g.test(data);
        break;
      case "alpha_space":
        output = /^[a-zA-Z '\-\_]+$/g.test(data);
        break;
      case "alpha_numeric_space":
        output = /^[a-zA-Z0-9 ]+$/g.test(data);
        break;
      case "special-characters-not-allowed":
        //Below are not allowed -> need to pass in options parameter
        //Please do not break below combination
        // \-   \[   \]    \\    \/
        //options = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        //e.g. /[@$]/
        //e.g. /[!@#$%^&]/
        output = options.test(data);
        output = !output;
        break;
      case "alpha_numeric":
        output = /^[a-zA-Z0-9]+$/g.test(data);
        break;
      case "email":
        var regxEmail =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        output = regxEmail.test(data);
        break;
      case "phonenumber":
        output = data.indexOf("+") === data.lastIndexOf("+");
        output = output && data.indexOf("-") === data.lastIndexOf("-");
        output =
          output &&
          data.replace("+", "").replace("-", "").length ===
          data.replace("+", "").replace("-", "").replace(/\D/g, "").length;
        break;
      case "phonenumber_length":
        output =
          data.indexOf("-") > -1 &&
          data.split("-")[1].length >= 8 &&
          data.split("-")[1].length <= 14;
        output =
          output ||
          (data.indexOf("-") === -1 && data.length >= 8 && data.length <= 14);
        break;
      case "pastdate":
        let dateValue = moment(data);
        let conditionDate =
          options.conditionDate === undefined
            ? moment()
            : moment(options.conditionDate);
        let maxDate = conditionDate.add(options.addMonth, 'months');
        output = maxDate.isBefore(dateValue);
        break;
      default:
        output = false;
        break;
    }
    return output;
  }

  const validate = () => {
    const errors = {};
    const { data } = state;

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
    setState({ ...state, isAgreeTerms: !state.isAgreeTerms });
  };
  const getCountryList = () => {
    let portalId = Global.getEnvironmetKeyValue("portalId");
    const reqOBJ = {
      request: {
        ProviderId: parseInt(portalId)
      }
    };
    let reqURL = "admin/lookup/signupcountry";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));

      console.log("getCountryList state", state);
      setState({ ...state, CountryList: resonsedata.response })
      console.log("getCountryList state", state);
    }.bind(this), "POST");
  }
  const getPage = () => {
    const { siteurl } = state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" +
      siteurl +
      "&modulename=ContactDetails&culturecode=en-us";

    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {

        console.log("getPage state", state);
        setState({
          ...state,
          resultEmail: (data?.response && data?.response[0]?.desktopHtml) || ""
        });
        console.log("getPage state", state);
      },
      "GET"
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getCountryList();
    Config.codebaseType === "tourwiz-marketplace" && getPage();
    getDetails();
  }, []);

  const handleDataChange = (e) => {
    let { data } = state;
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
    setState({ ...state, data });
  }

  const { resultEmail, isLoading, isInquirySubmited, isAgreeTerms, errors, data, CountryList } =
    state;
  console.log("return result", result)
  const details = result.result ? result.result.details[0] : "";
  const title = (details && details?.shortdescription) || "";
  const defaultImg = (details && details?.imagepath) ? details?.imagepath.indexOf(".s3.") > 0 ? details?.imagepath :
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/" +
    details?.imagepath : "";

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
  console.log("state result", result);

  const customStyle = `
  .textLimited {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 13; /* number of lines to show */
            line-clamp: 13; 
    -webkit-box-orient: vertical;
 }`
  return (
    <div>
      <CMSPageTitle title={title} icon="map-marker" />
      {result !== "" && (
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
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.firstName}
                          onChange={(e) => {
                            setState({ ...state, data: { ...state.data, firstName: e.target.value } });
                          }
                          }
                        />
                        {state.errors.firstName !== undefined &&
                          state.errors.firstName !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.firstName}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.lastName}
                          onChange={(e) => {
                            setState({ ...state, data: { ...state.data, lastName: e.target.value } });
                          }
                          }
                        />
                        {state.errors.lastName !== undefined &&
                          state.errors.lastName !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.lastName}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.email}
                          onChange={e =>
                            setState({ ...state, ...state.data, email: e.target.value })
                          }
                        />
                        {state.errors.email !== undefined &&
                          state.errors.email !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.email}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      {/* {this.renderContactInput("phone", "Phone *", "text", true)} */}
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.address1}
                          onChange={e =>
                            setState({ ...state, ...state.data, address1: e.target.value })
                          }
                        />
                        {state.errors.address1 !== undefined &&
                          state.errors.address1 !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.address1}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.address2}
                          onChange={e =>
                            setState({ ...state, ...state.data, address2: e.target.value })
                          }
                        />
                        {state.errors.address2 !== undefined &&
                          state.errors.address2 !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.address2}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.state}
                          onChange={e =>
                            setState({ ...state, ...state.data, state: e.target.value })
                          }
                        />
                        {state.errors.state !== undefined &&
                          state.errors.state !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.state}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.city}
                          onChange={e =>
                            setState({ ...state, ...state.data, city: e.target.value })
                          }
                        />
                        {state.errors.city !== undefined &&
                          state.errors.city !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.city}
                              </small>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          value={state.data.postalCode}
                          onChange={e =>
                            setState({ ...state, ...state.data, postalCode: e.target.value })
                          }
                        />
                        {state.errors.postalCode !== undefined &&
                          state.errors.postalCode !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                {state.errors.postalCode}
                              </small>
                            </div>
                          )}
                      </div>
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
                    {/* <div className="col-lg-12">
                      {this.renderTextarea("comments", "Comments")}
                    </div> */}
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
                            onChange={onChangeCaptcha}
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
                          onClick={sendInquiryEmail}>
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

                    <p>
                      If you have any other queries in the meantime, please
                      don't hesitate to get in touch with us at{" "}
                      <a
                        href={Config.codebaseType === "tourwiz-marketplace" ? "mailto:" + portalEmail : "mailto:sales@thetripcentre.com"}
                        className="text-primary"
                      >
                        {Config.codebaseType === "tourwiz-marketplace" ? portalEmail : "sales@thetripcentre.com"}
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
                          <b>{state.data?.firstName + " " + state.data?.lastName}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Subject : </label>
                          <b>{"Inquiry for " + title}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Email : </label>
                          <b>{state.data?.email}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Phone : </label>
                          <b>{state.data?.phone}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Address 1 : </label>
                          <b>{state.data?.address1}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Address 2 : </label>
                          <b>{state.data?.address2}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>State : </label>
                          <b>{state.data?.state}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>City : </label>
                          <b>{state.data?.city}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Postal Code : </label>
                          <b>{state.data?.postalCode}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Country : </label>
                          <b>{state.data?.country}</b>
                        </div>

                        <div style={{ padding: "8px 16px" }}>
                          <label>Comments : </label>
                          <b>{state.data?.comments}</b>
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
                <p className="text-secondary textLimited">
                  <HtmlParser text={decode(details?.summarydescription)} />
                </p>
                {details?.price > 0 &&
                  <h5 className="text-primary font-weight-">
                    {(details?.isShowOnMarketPlace ? "Starting at $ " : "Rs" + " ") + details?.price}
                  </h5>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {result === "" && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
}

export default CMSInquiry;
