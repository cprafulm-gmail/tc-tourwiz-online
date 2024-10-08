import React, { Component } from "react";
import * as Global from "../../helpers/global";
import CallCenter from "../../components/call-center/quotation-call-center";
import { Trans } from "../../helpers/translate";
import Form from "../common/form";

class UmrahPackageInquiryForm extends Form {
  state = {
    data: {
      customerName: "",
      email: "",
      phone: "",
      destination: "",
      duration: "",
      month: "",
      typetheme: "",
      budget: "",
      inclusions: "",
      adults: "",
      children: "",
      infant: "",
      requirements: "",
    },
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";

    if (!this.validateFormData(data.email, "require")) errors.email = "Email required";

    if (!this.validateFormData(data.phone, "require")) errors.phone = "Phone required";

    if (!this.validateFormData(data.destination, "require"))
      errors.destination = "Destination required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  setData = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("bookingForInfo"));

    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName =
      bookingForInfo && bookingForInfo.firstName
        ? bookingForInfo.firstName
        : this.props.customerName || "";

    defautData.email =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";

    defautData.phone =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";

    defautData.status = this.props.status ? this.props.status : "";

    this.setState({ data: defautData });
  };

  handleInquirySubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.props.handleInquiry(this.state.data);
  };

  componentDidMount() {
    this.setData();
  }

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");

    const { isSucessMsg, isBtnLoading } = this.props;

    const durationList = [
      { name: "Select Duration", value: "" },
      { name: "1 - 3 Days", value: "1 - 3 Days" },
      { name: "4 - 6 Days", value: "4 - 6 Days" },
      { name: "7 - 9 Days", value: "7 - 9 Days" },
      { name: "10+ Days", value: "10+ Days" },
      { name: "Not Decided", value: "Not Decided" },
    ];

    const monthList = [
      { name: "Select Month", value: "" },
      { name: "Nov 20", value: "Nov 20" },
      { name: "Dec 20", value: "Dec 20" },
      { name: "Jan 21", value: "Jan 21" },
      { name: "Feb 21", value: "Feb 21" },
      { name: "Not Decided", value: "Not Decided" },
    ];

    const typethemeList = [
      { name: "Select Type & Theme", value: "" },
      { name: "Family", value: "Family" },
      { name: "Group", value: "Group" },
      { name: "Solo", value: "Solo" },
      { name: "Romantic", value: "Romantic" },
      { name: "Nature", value: "Nature" },
      { name: "Adventure", value: "Adventure" },
      { name: "Not Decided", value: "Not Decided" },
    ];

    const budgetList = [
      { name: "Select Budget", value: "" },
      { name: "<10K", value: "<10K" },
      { name: "10K - 50K", value: "10K - 50K" },
      { name: "50K - 1L", value: "50K - 1L" },
      { name: "1L -2L", value: "1L -2L" },
      { name: "2L +", value: "2L +" },
      { name: "Not Decided", value: "Not Decided" },
    ];

    const inclusionsList = [
      { name: "Select Inclusions", value: "" },
      { name: "All", value: "All" },
      { name: "Hotel", value: "Hotel" },
      { name: "Flight", value: "Flight" },
      { name: "Activity", value: "Activity" },
      { name: "Transfers", value: "Transfers" },
      { name: "Custom", value: "Custom" },
      { name: "Not Decided", value: "Not Decided" },
    ];

    return (
      <div className="border p-3 mt-3 bg-white shadow-sm mb-3 position-relative">
        <div className="row">
          <div className="col-lg-3">
            {this.renderInput("customerName", Trans("_customerNamewithstar"))}{" "}
            {isPersonateEnabled && (
              <div className="position-absolute" style={{ right: "20px", top: "32px" }}>
                <CallCenter />
              </div>
            )}
          </div>

          <div className="col-lg-3">{this.renderInput("email", Trans("_lblEmailWithStar"))}</div>

          <div className="col-lg-3">
            {this.renderInput("phone", Trans("_lblContactPhoneWithStar"))}
          </div>

          <div className="col-lg-3">{this.renderInput("destination", "Destination*")}</div>

          <div className="col-lg-3">{this.renderSelect("duration", "Duration", durationList)}</div>

          <div className="col-lg-3">{this.renderSelect("month", "Month", monthList)}</div>

          <div className="col-lg-3">
            {this.renderSelect("typetheme", "Type & Theme", typethemeList)}
          </div>

          <div className="col-lg-3">{this.renderSelect("budget", "Budget", budgetList)}</div>

          {/* <div className="col-lg-3">
            {this.renderSelect("inclusions", "Inclusions", inclusionsList)}
          </div> */}

          <div className="col-lg-3">
            <div className="row">
              <div className="col-lg-4">{this.renderInput("adults", "Adults")}</div>
              <div className="col-lg-4">{this.renderInput("children", "Children")}</div>
              <div className="col-lg-4">{this.renderInput("infant", "Infant(s)")}</div>
            </div>
          </div>

          <div className="col-lg-9">{this.renderInput("requirements", "Other Requirements")}</div>

          {isSucessMsg && (
            <div className="col-lg-12">
              <h6 className="alert alert-success mt-3 d-inline-block">
                Inquiry Added Successfully!
              </h6>
            </div>
          )}

          {!isSucessMsg && (
            <div className="col-lg-2 mt-2">
              <div className="form-group">
                <button
                  onClick={() => this.handleInquirySubmit()}
                  className="btn btn-primary w-100 text-capitalize"
                >
                  {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                  Create Inquiry
                </button>
              </div>
            </div>
          )}

          {isSucessMsg && (
            <div className="col-lg-12 mt-2">
              <div className="form-group text-center">
                <button
                  className="btn btn-primary mr-3 text-capitalize"
                  onClick={this.props.handleAddItinerary}
                >
                  {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                  Add Itinerary
                </button>

                <button
                  className="btn btn-primary mr-3 text-capitalize"
                  onClick={this.props.handleAddQuotation}
                >
                  {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                  Add Quotation
                </button>

                <button
                  className="btn btn-primary mr-3 text-capitalize"
                  onClick={this.props.handleManageInquiry}
                >
                  {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                  Manage Inquiries
                </button>

                <button className="btn btn-primary mr-3 text-capitalize">
                  {isBtnLoading && <span className="spinner-border spinner-border-sm mr-2"></span>}
                  Create New Inquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UmrahPackageInquiryForm;
