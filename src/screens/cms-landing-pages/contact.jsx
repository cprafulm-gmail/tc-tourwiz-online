import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import LandingMenu from "./landing-menu";
import Form from "../../components/common/form";
import { Link } from "react-router-dom";
class Contact extends Form {
  state = {
    data: {
      name: "",
      business: "",
      email: "",
      phone: "",
      comments: "",
    },
    errors: {},
    isAgreeTerms: true,
    isInquirySubmited: false,
  };

  sendInquiryEmail = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    let data = this.state.data;
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

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAgreeTerms = () => {
    this.setState({ isAgreeTerms: !this.state.isAgreeTerms });
  };

  render() {
    const { isAgreeTerms, isInquirySubmited } = this.state;
    return (
      <div className="landing-pages">
        <LandingMenu />

        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="envelope"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              Contact Us
            </h1>
          </div>
        </div>
        <div className="container-sm">
          <p className="text-secondary mt-4">
            Interested in our solutions ? Simply fill out the form below and
            we'll get back to you within 24 hours! <br />
            Please be assured that your details will not be shared with
            third-parties
          </p>

          <div className="row">
            <div className="col-lg-8">
              <div className="mt-3 shadow p-4">
                {!isInquirySubmited && (
                  <p className="text-secondary">
                    Kindly fill out this short form. It will help us understand
                    your business better and offer you the ideal solution.
                  </p>
                )}

                {!isInquirySubmited && (
                  <div className="row">
                    <div className="col-lg-6">
                      {this.renderInput("name", "Name *")}
                    </div>
                    <div className="col-lg-6">
                      {this.renderInput("business", "Business")}
                    </div>
                    <div className="col-lg-6">
                      {this.renderInput("email", "Email *")}
                    </div>
                    <div className="col-lg-6">
                      {this.renderInput("phone", "Phone *")}
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
                          {/* <a
                            href="#/terms"
                            target="_blank"
                            className="text-primary"
                          >
                            Privacy & Cookie Policy.
                          </a> */}
                          <Link
                            className="text-primary"
                            to="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy & Cookie Policy.
                          </Link>
                        </label>
                      </div>
                    </div>

                    {!isAgreeTerms && (
                      <div className="col-lg-12">
                        <h6 className="alert alert-success d-inline-block p-2">
                          <small>Please agree Privacy & Cookie Policy.</small>
                        </h6>
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
                      Your inquiry has been submitted successfully. We will get
                      in touch with you soon.
                    </h5>

                    <p>
                      If you have any other queries in the meantime, please
                      don't hesitate to get in touch with us at{" "}
                      <a
                        href="mailto:info@tourwizonline.com"
                        className="text-primary"
                      >
                        info@tourwizonline.com
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="mt-3 shadow p-4">
                <h5 className="mb-3">Email Us :</h5>
                <a
                  href="mailto:info@tourwizonline.com"
                  className="d-block text-primary"
                >
                  <SVGIcon
                    name="envelope"
                    width="16"
                    height="16"
                    className="mr-2"
                  ></SVGIcon>
                  info@tourwizonline.com
                </a>
                <a
                  href="mailto:sales@tourwizonline.com"
                  className="d-block text-primary"
                >
                  <SVGIcon
                    name="envelope"
                    width="16"
                    height="16"
                    className="mr-2"
                  ></SVGIcon>
                  sales@tourwizonline.com
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
                <div style={{ padding: "8px 16px" }}>
                  <label>Name : </label>
                  <b>{this.state.data?.name}</b>
                </div>

                <div style={{ padding: "8px 16px" }}>
                  <label>Business : </label>
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
    );
  }
}

export default Contact;
