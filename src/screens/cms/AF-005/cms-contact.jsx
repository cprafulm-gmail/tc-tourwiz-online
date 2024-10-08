import React from "react";
import { cmsConfig } from "../../../helpers/cms-config";
import { apiRequesterCMS } from "../../../services/requester-cms";
import SVGIcon from "../../../helpers/svg-icon";
import Form from "../../../components/common/form";
import Loader from "../../../components/common/loader";
import CMSPageTitle from "../../../components/cms/cms-page-title";
import { Link } from "react-router-dom";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import * as Global from "../../../helpers/global";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../../config";
import BannerImage from "../../../assets/images/customer-portal/template-images/top-contact-us-banner.png";
import CMSCopyrights from "../../../components/cms/AF-005/cms-copywrite";

const recaptchaRef = React.createRef();
class CMSContact extends Form {
  state = {
    ...cmsConfig,
    result: "",
    isLoading: true,
    data: {
      name: "",
      business: "",
      email: "",
      phone: "",
      comments: "",
      captcha: "",
      isValidCaptcha: true,
    },
    errors: {},
    isAgreeTerms: true,
    isInquirySubmited: false,
    isLoading: false,
  };

  onChangeCaptcha = (value) => {
    const { data } = this.state;
    data.captcha = value;
    data.isValidCaptcha = true;
    this.setState({ data });
  };
  sendInquiryEmail = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.setState({ isInquirySubmited: true }, () => this.handleEnquiryEmail());
  };

  handleEnquiryEmail = () => {
    const { cmsSettings } = this.props;
    let textBody = "";
    let reqOBJ = {
      Name: this.state.data?.name,
      ToEmail: this.state.data?.email,
      Phone: this.state.data?.phone,
      Business: this.state.data?.business,
      Comments: this.state.data?.comments
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/contact/send";
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

    if (!this.validateFormData(data.name, "require"))
      errors.name = "Name required";

    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email required";

    if (!this.validateFormData(data.phone, "require"))
      errors.phone = "Phone required";

    if (!this.validateFormData(data.business, "require"))
      errors.business = "Subject required";

    if (
      Global.getEnvironmetKeyValue("ISEXCURSIONPACKAGEALLOW", "cobrand") ===
      "true" &&
      recaptchaRef.current.getValue() === ""
    ) {
      errors.isValidCaptcha = !(recaptchaRef.current.getValue() === "");
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAgreeTerms = () => {
    this.setState({ isAgreeTerms: !this.state.isAgreeTerms });
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
          result: (data?.response && data?.response[0]?.desktopHtml) || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getPage();
  }

  render() {
    const { isAgreeTerms, result, isInquirySubmited, isLoading, errors } =
      this.state;

    const { cmsSettings } = this.props;

    var portalEmail =
      Global.getEnvironmetKeyValue("portalCustomerCareEmail") ??
      Global.getEnvironmetKeyValue("customerCareEmail");

    var portalPhone = Global.getEnvironmetKeyValue("portalPhone");

    var portalAddress = "Your Address Details";
    if (result != "") {
      var res = decode(result);
      const paragraphs = res.split("</div>");
      portalAddress =
        typeof paragraphs[0] === "string" &&
          paragraphs[0].indexOf("Address:") > 0
          ? paragraphs[0].replace("<div>", "").replace("Address:", "")
          : portalAddress;
      portalPhone =
        typeof paragraphs[1] === "string" &&
          paragraphs[1].indexOf("CallUS:") > 0 &&
          paragraphs[1].indexOf("Your call details") == -1
          ? paragraphs[1].replace("<div>", "").replace("CallUS:", "")
          : portalPhone;
      portalEmail =
        typeof paragraphs[2] === "string" &&
          paragraphs[2].indexOf("EmailUS:") > 0 &&
          paragraphs[2].indexOf("Your email details") == -1
          ? paragraphs[2].replace("<div>", "").replace("EmailUS:", "")
          : portalEmail;
    }
    var emailArray = portalEmail.split(",");
    return (
      <React.Fragment>
        <div>
          {/* <CMSPageTitle title="Contact Us" icon="envelope" /> */}
          <div className="head-banner">
            <img className="head-banner-img" src={BannerImage} alt="" />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h1>GET IN TOUCH</h1>
                  <h2>
                    If you’ve got questions about the product, pricing or anything
                    else,feel free to reach out to us.
                    <br />
                    We are here to help!
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {!isLoading && (
            <div
              className="container mt-4 mb-5"
              style={{ minHeight: "calc(100vh - 284px)" }}
            >
              <div className="row">
                <div className="col-lg-12 cms-contact-us">
                  <div className="mt-3 p-4">
                    {!isInquirySubmited && (
                      <div className="row">
                        <div className="offset-lg-2 col-lg-8 mb-3">
                          {this.renderInputPlaceholder("name", "Name *")}
                        </div>
                        <div className="offset-lg-2 col-lg-8 mb-3">
                          {this.renderInputPlaceholder("business", "Subject *")}
                        </div>
                        <div className="offset-lg-2 col-lg-8 mb-3">
                          {this.renderInputPlaceholder("email", "Email *")}
                        </div>
                        <div className="offset-lg-2 col-lg-8 mb-3">
                          {this.renderInputPlaceholder("phone", "Phone *")}
                        </div>
                        <div className="offset-lg-2 col-lg-8 mb-3">
                          {this.renderTextarea(
                            "comments",
                            "Comments",
                            "Comments"
                          )}
                        </div>
                        <div className="offset-lg-4 col-lg-6 mb-3">
                          <div className=" custom-control custom-checkbox mb-1">
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

                          {!isAgreeTerms && (
                            <h6 className="mt-1 p-1 d-inline-block">
                              <small
                                style={{ color: "#f10a0a" }}
                                className=" mt-0 p-1 d-inline-block"
                              >
                                Please agree Privacy & Cookie Policy.
                              </small>
                            </h6>
                          )}
                        </div>

                        {Global.getEnvironmetKeyValue(
                          "ISEXCURSIONPACKAGEALLOW",
                          "cobrand"
                        ) === "true" && (
                            <div className="offset-lg-4 col-lg-6">
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
                            <div className="offset-lg-4 col-lg-6 mb-3">
                              <small
                                style={{ color: "#f10a0a" }}
                                className=" mt-0 p-1 d-inline-block"
                              >
                                {"Please verify captcha"}
                              </small>
                            </div>
                          )}

                        <div className="offset-lg-4 col-lg-6 mb-3">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.sendInquiryEmail}
                          >
                            Submit
                            {/* <SVGIcon
              className="ml-2 d-fclex align-items-center"
              name={"chevron-right"}
              width="16"
              type="fill"
            ></SVGIcon> */}
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
                            href={"mailto:sales@thetripcentre.com"}
                            className="text-primary"
                          >
                            sales@thetripcentre.com
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                        <b>Inquiry from Trip Centre</b>
                      </div>
                      <div style={{ padding: "8px 16px" }}>
                        <label>Name : </label>
                        <b>{this.state.data?.name}</b>
                      </div>

                      <div style={{ padding: "8px 16px" }}>
                        <label>Subject : </label>
                        <b>{this.state.data?.business}</b>
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
                        <label>Comments : </label>
                        <b>{this.state.data?.comments}</b>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="cp-home-testimonial">
            <div className="container" style={{ position: "relative" }}>
              <div className="row">
                <div className=" col-lg-12 p-0">
                  <div className=" col-lg-3 pull-right testimonial-heading">
                    <p className="mb-0 font-weight-bold text-whiste text-left mb-0 text-uppercase testimonial-sub-title">
                      STAY
                    </p>
                    <h2 className="font-weight-bold text-whiste text-left mb-3 text-uppercase testimonial-title">
                      CONNECT WITH US
                    </h2>
                  </div>
                  <div
                    className="offset-lg-1 pull-right col-lg-8 testimonial-items"
                    style={{ display: "flex" }}
                  >
                    <div
                      className="p-3 bg-white col-lg-5 mb-5 m-3 shadow"
                      style={{ boxSizing: "border-box", float: "left" }}
                    >
                      <h6>
                        <SVGIcon
                          name="map-marker"
                          width="16"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        Address :
                      </h6>
                      <p className="text-secondary">
                        The Tripcentre, <br />
                        CLTech Solutions Pvt Ltd,
                        <br />
                        3D 1, Third Floor, Gundecha Onclave,
                        Kherani Road, <br />Sakinaka, Andheri East,
                      </p>
                    </div>
                    <div
                      className="p-3 bg-white col-lg-5 mb-5 m-3 shadow"
                      style={{ boxSizing: "border-box", float: "left" }}
                    >
                      <h6>
                        <SVGIcon
                          name="phone"
                          width="16"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        Call Us :
                      </h6>
                      <p className="text-secondary">
                        +91 897 699 7098
                        {/* {<HtmlParser text={portalPhone} />} */}
                      </p>
                      <h6 className="border-top pt-3">
                        <SVGIcon
                          name="envelope"
                          width="16"
                          height="16"
                          className="mr-2"
                        ></SVGIcon>
                        Email Us :
                      </h6>

                      <a
                        href={"mailto:sales@thetripcentre.com"}
                        className="d-block text-primary"
                      >
                        sales@thetripcentre.com
                      </a>
                      {/* {emailArray.map(item => (
                      <a
                        href={"mailto:" + item}
                        className="d-block text-primary"
                      >
                        {<HtmlParser text={item} />}
                      </a>
                    ))} */}
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
            >
              <Loader />
            </div>
          )}
        </div>
        <CMSCopyrights {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default CMSContact;
