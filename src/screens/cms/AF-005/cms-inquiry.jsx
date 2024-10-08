import React from "react";
import { apiRequesterCMS } from "../../../services/requester-cms";
import { apiRequester_quotation_api } from "../../../services/requester-quotation";
import { apiRequester_unified_api } from "../../../services/requester-unified-api";
import * as DropdownList from "../../../helpers/dropdown-list";
import CMSPageTitle from "../../../components/cms/cms-page-title";
import Loader from "../../../components/common/loader";
import { cmsConfig } from "../../../helpers/cms-config";
import Form from "../../../components/common/form";
import CMSCopyrights from "../../../components/cms/AF-005/cms-copywrite";
import { Link } from "react-router-dom";
import * as Global from "../../../helpers/global";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../../config";
import { decode } from "html-entities";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import HtmlParser from "../../../helpers/html-parser";

const recaptchaRef = React.createRef();
class CMSInquiry extends Form {
  state = {};

  state = {
    ...cmsConfig,
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
    result: "",
    resultEmail: "",
    isLoading: true,
    CountryList: [],
  };

  onChangeCaptcha = (value) => {
    const { data } = this.state;
    data.captcha = value;
    data.isValidCaptcha = true;
    this.setState({ data });
  };
  getDetails = () => {
    const { id, portalId } = this.state;
    let reqOBJ = {};
    let reqURL =
      "cms/specialpromotiondetails?portalid=" + portalId + "&itemid=" + id;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          result: data?.response || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };

  SubmitInquiry = () => {
    const { data, result } = this.state;
    const { cmsSettings } = this.props;

    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "";

    let reqOBJ = {
      request: {
        SpecialPromotionID: (details && details?.specialpromotionid) || "0",
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
        Comments: this.state.data?.comments
      },
    };
    let reqURL = "cms/newsletter/add";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        //this.setState({ isInquirySubmited: true });
        this.setState({ isInquirySubmited: true }, () =>
          this.handleEnquiryEmail()
        );
      },
      "POST"
    );
  };

  sendInquiryEmail = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.SubmitInquiry();
  };

  handleEnquiryEmail = () => {
    //let htmlBody = document.getElementById("emailHTML").outerHTML;
    let textBody = "";
    const details = this.state.result.details ? this.state.result.details[0] : "";
    const title = (details && details?.shortdescription) || "";

    let reqOBJ = {
      Title: title,
      FirstName: this.state.data?.firstName,
      LastName: this.state.data?.lastName,
      Email: this.state.data?.email,
      Phone: this.state.data?.phone,
      Address1: this.state.data?.address1,
      Address2: this.state.data?.address2,
      State: this.state.data?.state,
      City: this.state.data?.city,
      PostalCode: this.state.data?.postalCode,
      Country: this.state.data?.country,
      Comments: this.state.data?.comments
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/inquirydetail/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = function () { };
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstName, "require"))
      errors.firstName = "First Name required";
    else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.firstName, "length", { min: 2, max: 50 })
    )
      errors.firstName = "First Name must be between 2 and 50 characters long";

    if (!this.validateFormData(data.lastName, "require"))
      errors.lastName = "Last Name required";
    else if (!this.validateFormData(data.lastName, "special-characters-not-allowed", /[<>]/))
      errors.lastName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.lastName, "length", { min: 2, max: 50 })
    )
      errors.lastName = "Last Name must be between 2 and 50 characters long";


    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email required";
    else if (!this.validateFormData(data.email, "email"))
      errors.email = "Enter valid Email";

    if (!this.validateFormData(data.phone, "require"))
      errors.phone = "Phone required";

    const tempmobilenumber = parsePhoneNumberFromString(data.phone);
    if (!this.validateFormData(data.phone, "require_phoneNumber"))
      errors.phone = "Enter valid Mobile Number";
    else if (!this.validateFormData(data.phone, "phonenumber"))
      errors.phone = "Enter valid Mobile Number";
    else if (
      !this.validateFormData(data.phone, "phonenumber_length", {
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

    // if (!this.validateFormData(data.business, "require"))
    //   errors.business = "Subject required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAgreeTerms = () => {
    this.setState({ isAgreeTerms: !this.state.isAgreeTerms });
  };
  getCountryList = () => {
    let portalId = Global.getEnvironmetKeyValue("portalId");
    const reqOBJ = {
      request: {
        ProviderId: parseInt(portalId),
      },
    };
    let reqURL = "admin/lookup/signupcountry";
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        resonsedata.response = resonsedata.response.sort((a, b) =>
          a.countryName > b.countryName
            ? 1
            : b.countryName > a.countryName
              ? -1
              : 0
        );
        this.setState({ CountryList: resonsedata.response });
      }.bind(this),
      "POST"
    );
  };
  getPage = () => {
    const { siteurl } = this.state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" +
      siteurl +
      "&modulename=ContactDetails&culturecode=en-us";

    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          resultEmail: (data?.response && data?.response[0]?.desktopHtml) || ""
        });
      },
      "GET"
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getCountryList();
    Config.codebaseType === "tourwiz-marketplace" && this.getPage();
    this.setState({ id: this.props.match.params.id }, () => this.getDetails());
  }

  handleDataChange = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    let countrName = e.target[e.target.selectedIndex].text;
    const foundCountry = DropdownList.CountryList.find(
      (element) => element.name === countrName.toString()
    );
    //If get countryCode then only update state
    if (foundCountry && foundCountry !== "undefined") {
      data["phone"] = "+" + foundCountry.countryCode.toString() + "-";
      data["CountryIsoCode"] = foundCountry.isoCode.toString();
      data["CountryName"] = foundCountry.name.toString();
    }
    this.setState({ data });
  };

  render() {
    const {
      result,
      resultEmail,
      isLoading,
      isInquirySubmited,
      isAgreeTerms,
      errors,
      data,
      CountryList,
    } = this.state;
    const { cmsSettings } = this.props;

    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "";
    const defaultImg =
      details && details?.imagepath
        ? details?.imagepath.indexOf(".s3.") > 0
          ? details?.imagepath
          : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
          cmsSettings?.portalID +
          "/SpecialsPromotions/images/" +
          details?.imagepath
        : "";

    var portalEmail =
      Global.getEnvironmetKeyValue("portalCustomerCareEmail") ??
      Global.getEnvironmetKeyValue("customerCareEmail");
    if (resultEmail != "") {
      var res = decode(result);
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
      -webkit-line-clamp: 14; /* number of lines to show */
              line-clamp: 14; 
      -webkit-box-orient: vertical;
   }`
    return (
      <React.Fragment>
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
                          {this.renderInput("firstName", "First Name *")}
                        </div>

                        <div className="col-lg-6">
                          {this.renderInput("lastName", "Last Name *")}
                        </div>

                        <div className="col-lg-6">
                          {this.renderInput("email", "Email *")}
                        </div>

                        <div className="col-lg-6">
                          {this.renderContactInput(
                            "phone",
                            "Phone *",
                            "text",
                            true
                          )}
                        </div>

                        <div className="col-lg-6">
                          {this.renderInput("address1", "Address1")}
                        </div>
                        <div className="col-lg-6">
                          {this.renderInput("address2", "Address2")}
                        </div>
                        <div className="col-lg-3">
                          {this.renderInput("state", "State")}
                        </div>
                        <div className="col-lg-3">
                          {this.renderInput("city", "City")}
                        </div>
                        <div className="col-lg-3">
                          {this.renderInput("postalCode", "Postal Code")}
                        </div>
                        <div className="col-lg-3">
                          <label htmlFor={"Country"}>{"Country"} </label>
                          <select
                            value={data.CountryId}
                            onChange={(e) => this.handleDataChange(e)}
                            name={"CountryId"}
                            id={"CountryID"}
                            //disabled={disabled}
                            className={"form-control"}
                          >
                            {CountryList.map((option, key) => (
                              <option key={key} value={option["countryId"]}>
                                {option["countryName"]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-12">
                          {this.renderTextarea("comments", "Comments")}
                        </div>
                        <div className="col-lg-12">
                          <div className=" custom-control custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="agreeTerms"
                              name="agreeTerms"
                              checked={this.state.isAgreeTerms}
                              onChange={this.handleAgreeTerms}
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
                        {Global.getEnvironmetKeyValue(
                          "ISEXCURSIONPACKAGEALLOW",
                          "cobrand"
                        ) === "true" && (
                            <div className="col-lg-12">
                              <div className="form-group">
                                <ReCAPTCHA
                                  ref={recaptchaRef}
                                  sitekey={
                                    Global.getEnvironmetKeyValue(
                                      "GoogleCaptchSiteKey",
                                      "cobrand"
                                    ) !== null &&
                                      Global.getEnvironmetKeyValue(
                                        "GoogleCaptchSiteKey",
                                        "cobrand"
                                      ) !== ""
                                      ? Global.getEnvironmetKeyValue(
                                        "GoogleCaptchSiteKey",
                                        "cobrand"
                                      )
                                      : Config.GoogleCaptchSiteKey
                                  }
                                  hl={"en"}
                                  onChange={this.onChangeCaptcha}
                                />
                              </div>
                            </div>
                          )}
                        {errors.isValidCaptcha !== undefined &&
                          !errors.isValidCaptcha && (
                            <div className="col-lg-12 col-sm-12 m-0">
                              <small className="alert alert-danger mt-0 p-1 d-inline-block">
                                {"Please verify captcha"}
                              </small>
                            </div>
                          )}

                        <div className="col-lg-12">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.sendInquiryEmail}
                          >
                            Submit
                          </button>
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
                              <b>{this.state.data?.firstName + " " + this.state.data?.lastName}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Subject : </label>
                              <b>{"Inquiry for " + title}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Email : </label>
                              <b>{this.state.data?.email}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Phone : </label>
                              <b>{this.state.data?.phone}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Address 1 : </label>
                              <b>{this.state.data?.address1}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Address 2 : </label>
                              <b>{this.state.data?.address2}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>State : </label>
                              <b>{this.state.data?.state}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>City : </label>
                              <b>{this.state.data?.city}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Postal Code : </label>
                              <b>{this.state.data?.postalCode}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Country : </label>
                              <b>{this.state.data?.country}</b>
                            </div>

                            <div style={{ padding: "8px 16px" }}>
                              <label>Comments : </label>
                              <b>{this.state.data?.comments}</b>
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
                      class="img-fluid"
                      src={defaultImg}
                      alt={details?.shortdescription}
                    />
                    <h5 className="mt-3 font-weight-bold">
                      {details?.shortdescription}
                    </h5>
                    <p className="text-secondary textLimited">
                      <HtmlParser text={decode(details?.summarydescription)} />
                    </p>
                    <h5 className="text-primary font-weight-">
                      {details?.price > 0 && "Starting at Rs " + details?.price + " /-*"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
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
        <CMSCopyrights {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default CMSInquiry;
