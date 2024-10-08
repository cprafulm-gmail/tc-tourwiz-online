import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import Form from "../../components/common/form";
import PublicPageHeader from "../../components/landing-pages/public-page-header-partner";
import PublicPageFindus from "../../components/landing-pages/public-page-findus-partner";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe-partner";
import PublicPageClients from "../../components/landing-pages/public-page-clients-partner";
import PublicPageFooter from "../../components/landing-pages/public-page-footer-partner";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights-partner";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import TwLogo from "../../assets/images/tw/tw-mail-logo.png";
import * as Global from "../../helpers/global";
import Config from "../../config";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();
class Contact extends Form {
  state = {
    data: {
      firstname: "",
      lastname: "",
      business: "",
      email: "",
      code: "",
      phone: "",
      comments: "",
      country: "",
      state: "",
      howdidhearabout: "",
      captcha: ""
    },
    errors: {},
    isAgreeTerms: true,
    isInquirySubmited: false,
    isAgreeReceive: true,
  };

  sendInquiryEmail = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    let data = this.state.data;
    this.setState({ isInquirySubmited: true }, () => this.handleEnquiryEmail());
  };

  handleEnquiryEmail = () => {
    let reqOBJ = {
      FirstName: this.state.data?.firstname,
      LastName: this.state.data?.lastname,
      Business: this.state.data?.business,
      ToEmail: this.state.data?.email,
      Code: this.state.data?.code,
      Phone: this.state.data?.phone,
      Country: this.state.data?.country,
      State: this.state.data?.state,
      Help: this.state.data?.comments,
      Iscommunication: this.state.isAgreeReceive,
      ispersonalinfo: this.state.isAgreeTerms
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/contactpartner/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      recaptchaRef.current.reset();
      this.props.history.push(`/thank-you`);
    };
  };


  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstname, "require"))
      errors.firstname = "First Name required";

    if (!this.validateFormData(data.lastname, "require"))
      errors.lastname = "Last Name required";

    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email Address required";
    else if (!this.validateFormData(data.email, "email"))
      errors.email = "Invalid Email Address";

    if (!this.validateFormData(data.code, "require"))
      errors.code = "Code required";

    if (!this.validateFormData(data.phone, "require"))
      errors.phone = "Phone Number required";

    if (Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && recaptchaRef.current.getValue() === "")
      errors.captcha = "Captcha required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAgreeTerms = () => {
    this.setState({ isAgreeTerms: !this.state.isAgreeTerms });
  };

  handleAgreeReceive = () => {
    this.setState({ isAgreeReceive: !this.state.isAgreeReceive });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isAgreeTerms, isInquirySubmited } = this.state;

    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;

    return (
      <div className="tw-public-pages tw-contact-page">
        <style>{css}</style>

        <Helmet>
          <title>Contact Us | TourWiz</title>
          <meta
            name="description"
            content="Get in touch with us for Product Queries, Demo Requests, Collaboration or General Inquiries"
          />
        </Helmet>

        <StickyContainer>

          <Sticky>
            {({ style }) => (<div
              className={
                "hight-z-index mod-search-area"
              }
              style={{ ...style, transform: "inherit" }}
            >
              <PublicPageHeader />
            </div>
            )}
          </Sticky>

          <div className="tw-common-banner">
            <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h1>Get in Touch</h1>
                  <h2>
                    Have questions about the partner program and how you can get the most out of it?<br />
                    Feel free to reach out to us. We are here to help!
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="tw-contact-form">
                  <div className="row">
                    <div className="col-lg-6 pr-lg-2">
                      {this.renderInputPlaceholder("firstname", "First Name *")}
                    </div>
                    <div className="col-lg-6 pl-lg-2">
                      {this.renderInputPlaceholder("lastname", "Last Name *")}
                    </div>
                    <div className="col-lg-6 pr-lg-2">
                      {this.renderInputPlaceholder("business", "Business Name")}
                    </div>
                    <div className="col-lg-6 pl-lg-2">
                      {this.renderInputPlaceholder("email", "Email Address *")}
                    </div>
                    <div className="col-lg-6 pr-lg-2">
                      {this.renderInputPlaceholder("country", "Country")}
                    </div>
                    <div className="col-lg-6 pl-lg-2">
                      {this.renderInputPlaceholder("state", "State")}
                    </div>
                    <div className="col-lg-6 pr-lg-2">
                      {this.renderInputPlaceholder(
                        "howdidhearabout",
                        "How did you hear about us?"
                      )}
                    </div>
                    <div className="col-lg-2 pl-lg-2 pr-lg-2">
                      {this.renderInputPlaceholder("code", "Code *")}
                    </div>
                    <div className="col-lg-4 pl-lg-2">
                      {this.renderInputPlaceholder("phone", "Phone Number *")}
                    </div>
                    <div className="col-lg-12">
                      {this.renderTextarea(
                        "comments",
                        "How can we help you?",
                        "How can we help you?"
                      )}
                    </div>

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
                      <div className="tw-contact-terms-text mb-3">
                        <p className="mt-2">
                          TourWiz is committed to protecting and respecting your
                          privacy, and we’ll only use your personal information
                          to administer your account and to provide the products
                          and services you requested from us.
                        </p>

                        <div className=" custom-control custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="isAgreeReceive"
                            name="isAgreeReceive"
                            checked={this.state.isAgreeReceive}
                            onChange={this.handleAgreeReceive}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="isAgreeReceive"
                          >
                            I would like to receive other communications from
                            TourWiz. You can unsubscribe from these at any time.
                          </label>
                        </div>

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
                            className="custom-control-label"
                            htmlFor="agreeTerms"
                          >
                            I understand that my personal information will be
                            securely processed as detailed on the TourWiz{" "}
                            <Link
                              to="/terms-of-use"
                              target="_blank"
                              className="text-primary"
                            >
                              Privacy Policy.
                            </Link>
                          </label>
                        </div>
                      </div>

                      {!isAgreeTerms && (
                        <h6 className="alert alert-success d-inline-block p-2">
                          <small>Please agree Privacy Policy.</small>
                        </h6>
                      )}
                    </div>

                    <div className="col-lg-12 text-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.sendInquiryEmail}
                      >
                        Send
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <div className="col-lg-4">
                <div className="tw-contact-details mb-4">
                  <h3>Other ways to reach us</h3>
                  <a href="mailto:info@tourwizonline.com" className="d-block ml-1">
                    <SVGIcon
                      name="envelope"
                      width="16"
                      height="16"
                      className="mr-2"
                    ></SVGIcon>
                    info@tourwizonline.com
                  </a>
                  <a href="mailto:partners@tourwizonline.com" className="d-block ml-1 mb-4">
                    <SVGIcon
                      name="envelope"
                      width="16"
                      height="16"
                      className="mr-2"
                    ></SVGIcon>
                    partners@tourwizonline.com
                  </a>
                  <a href="https://www.facebook.com/TourWiz-101869248569536" className="d-inline m-1">
                    <SVGIcon
                      name="facebook"
                      width="36"
                      height="36"
                      className="mr-2"
                    ></SVGIcon>
                  </a>
                  <a href="https://twitter.com/tourwizonline" className="d-inline m-1">
                    <SVGIcon
                      name="twitter"
                      width="36"
                      height="36"
                      className="mr-2"
                    ></SVGIcon>
                  </a>
                  <a href="https://www.linkedin.com/company/tourwiz" className="d-inline m-1">
                    <SVGIcon
                      name="linkedin"
                      width="36"
                      height="36"
                      className="mr-2"
                    ></SVGIcon>
                  </a>
                  <a href="https://www.instagram.com/tourwiz" className="d-inline m-1">
                    <SVGIcon
                      name="instagram"
                      width="36"
                      height="36"
                      className="mr-2"
                      type="fill"
                    ></SVGIcon>
                  </a>
                </div>
                <div className="tw-contact-details mb-4">
                  <h3><SVGIcon
                    name="address-card"
                    width="20"
                    height="20"
                    className="mr-2"
                  ></SVGIcon>Address</h3>

                  301, Balleshwar Avenue, <br />Opp. Rajpath Club, SG Road,<br /> Ahmedabad,<br /> Gujarat - 380015 (India)
                </div>
                <div className="tw-contact-details mb-4">
                  <h3>Connect on whatsapp</h3>
                  <a href={window.innerWidth <= 768 ? "https://wa.me/918976997100" : "https://web.whatsapp.com/send?phone=+918976997100"} className="d-inline m-1" target="_blank">
                    <SVGIcon
                      name="whatsapp-green"
                      width="36"
                      height="36"
                      className="mr-2"
                    ></SVGIcon><b>+91 897 699 7100</b>
                  </a>
                </div>
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
                    <b>Inquiry from Tourwiz</b>
                  </div>
                  {this.state.data?.firstname != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>First Name : </label>
                    <b>{this.state.data?.firstname}</b>
                  </div>)}

                  {this.state.data?.lastname != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Last Name : </label>
                    <b>{this.state.data?.lastname}</b>
                  </div>)}

                  {this.state.data?.business != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Business : </label>
                    <b>{this.state.data?.business}</b>
                  </div>)}

                  {this.state.data?.email != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Email : </label>
                    <b>{this.state.data?.email}</b>
                  </div>)}

                  {this.state.data?.code != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Code : </label>
                    <b>{this.state.data?.code}</b>
                  </div>)}

                  {this.state.data?.phone != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Phone : </label>
                    <b>{this.state.data?.phone}</b>
                  </div>)}

                  {this.state.data?.country != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>Country : </label>
                    <b>{this.state.data?.country}</b>
                  </div>)}

                  {this.state.data?.state != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>State : </label>
                    <b>{this.state.data?.state}</b>
                  </div>)}

                  {this.state.data?.howdidhearabout != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>How did you hear about us? : </label>
                    <b>{this.state.data?.howdidhearabout}</b>
                  </div>)}

                  {this.state.data?.comments != "" && (<div style={{ padding: "8px 16px" }}>
                    <label>How can we help you? : </label>
                    <b>{this.state.data?.comments}</b>
                  </div>)}

                  <div style={{ padding: "8px 16px" }}>
                    <label>Like to receive other communications : </label>
                    <b>{this.state.isAgreeReceive ? "Yes" : "No"}</b>
                  </div>

                  <div style={{ padding: "8px 16px" }}>
                    <label>
                      Personal information will be securely processed as detailed
                      :
                    </label>
                    <b>{this.state.isAgreeTerms ? "Yes" : "No"}</b>
                  </div>
                </div>
              </div>


              <div id="thankYouEmailHTML">

                <body class="tw-mail-body">
                  <table style={{ paddingRight: "0px", paddingLeft: "0px", fontSize: "12px", paddingBottom: "0px", margin: "0px", color: "#3f3f3f", paddingTop: "0px", backgroundColor: "#ffffff", fontFamily: "Montserrat, sans-serif" }} cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td align="center">
                          <table style={{ margin: "20px", width: "600px", textAlign: "left" }} cellspacing="4" cellpadding="0" border="0">
                            <tbody>
                              <tr>
                                <td>
                                  <table style={{ width: "100%", height: "100%" }} cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                      <tr>
                                        <td style={{ background: "#fff", border: "1px solid #CCCCCC" }}>
                                          <table>
                                            <tr>
                                              <td>
                                                <a title="TourWiz" alt="TourWiz" href="https://www.tourwizonline.com">
                                                  <img title="TourWiz" alt="TourWiz" src={TwLogo} border="0" style={{ width: "200px" }} />
                                                </a>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table style={{ padding: "20px", background: "#f9f9f9" }} cellspacing="0" cellpadding="0" border="0">
                                    <tbody>
                                      <tr>
                                        <td style={{ padding: "20px 20px 0px 20px" }}>
                                          Dear <b style={{ color: "#29506f" }}>{this.state.data?.firstname + " " + this.state.data?.lastname}</b>,
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style={{ padding: "20px 20px 20px 20px" }}>
                                          <p>
                                            Thank you for expressing your interest in TourWiz.
                                            <br />
                                            <br />
                                            We acknowledge the receipt of your inquiry. Our solution specialist will contact
                                            you soon to work out the most appropriate solution for your business.
                                            <br />
                                            <br />
                                            For further assistance, please send an email to <a class="tw-Content_link2" title="TravelCarma"
                                              href="mailto:info@tourwizonline.com">info@tourwizonline.com</a> or <a class="tw-Content_link2" title="TravelCarma"
                                                href="mailto:sales@tourwizonline.com">sales@tourwizonline.com</a>
                                            <br />
                                            <br />
                                            Regards,<br />
                                            <a style={{ fontWeight: "bold", color: "#29506f", textDecoration: "none" }} title="TourWiz" href="https://www.tourwizonline.com" target="_blank">TourWiz</a>
                                            | <a style={{ fontWeight: "bold", color: "#1e1e1e", textDecoration: "none" }} title="TourWiz" href="https://www.tourwizonline.com" target="_blank">www.tourwizonline.com</a>
                                            <br />
                                          </p>
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
                </body>
              </div>

            </div>
          )}

          {/* <PublicPageFindus />
        <PublicPageWherewe />*/}
          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />
        </StickyContainer>
      </div>
    );
  }
}

export default Contact;
