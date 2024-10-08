import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import { parsePhoneNumberFromString } from "libphonenumber-js";

class OfflineCancelModify extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        email: "",
        phoneNumber: "",
        comments: "",
        terms: false
      },
      errors: {},
      isBtnLoading: false
    };
  }

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    //On Success Create Request
    const { email, phoneNumber, comments } = this.state.data;
    const { business } = this.props.businessObject;
    let changeReq = {
      BookingRefNo: this.props.bookingRefNo,
      ItineraryRefNo: this.props.itineraryRefNo,
      BusinessShortDescription: business,
      Email: email,
      Phone: phoneNumber,
      Comment: comments
    };

    this.setState({
      isBtnLoading: true
    });

    this.props.handleChangeBookingStatus(changeReq);
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.email, "require"))
      errors.email = Trans("_error_email_require");
    else if (!this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    const tempmobilenumber = parsePhoneNumberFromString(data.phoneNumber);
    if (!this.validateFormData(data.phoneNumber, "require_phoneNumber"))
      errors.phoneNumber = Trans("_error_mobilenumber_phonenumber");
    else if (!this.validateFormData(data.phoneNumber, "phonenumber"))
      errors.phoneNumber = Trans("_error_mobilenumber_phonenumber");
    else if (
      !this.validateFormData(data.phoneNumber, "phonenumber_length", {
        min: 8,
        max: 14
      })
    )
      errors.phoneNumber = Trans("_error_mobilenumber_phonenumber_length");
    else if (!tempmobilenumber)
      errors.phoneNumber = Trans("_error_mobilenumber_require");

    // Comments Validation
    if (!this.validateFormData(data.comments, "require"))
      errors.comments = Trans("_error_comments_require");

    if (data.terms === false)
      errors.terms = Trans("_pleaseAcceptTermsAndConditions");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  agreeCondition = () => {
    let data = { ...this.state.data };
    data.terms = !this.state.data.terms;
    this.setState({
      data
    });
  };

  setUserInfo = () => {
    const { contactInformation } = this.props.travellerDetails[0].details;

    let userInfo = { ...this.state.data };
    userInfo.email = contactInformation.email;
    userInfo.phoneNumber =
      contactInformation.phoneNumberCountryCode +
      "-" +
      contactInformation.phoneNumber;

    this.setState({
      data: userInfo
    });
  };

  componentDidMount() {
    this.setUserInfo();
  }

  render() {
    const { itineraryRefNo, bookingRefNo, mode } = this.props;
    const { isBtnLoading } = this.state;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">
                  {Trans("_" + mode.toLowerCase())}{" "} {Trans("_reservation")}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleOfflineCancelModify}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="row">
                    <div className="col-lg-6">
                      <label className="text-secondary">
                        {Trans("_bookingReferenceNumber")}:{" "}
                      </label>
                      <b className="ml-2 text-primary">{bookingRefNo}</b>
                    </div>

                    <div className="col-lg-6">
                      <label className="text-secondary">
                        {Trans("_itineraryNumber")}:{" "}
                      </label>
                      <b className="ml-2 text-primary">{itineraryRefNo}</b>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-lg-6">
                      {this.renderInput("email", Trans("_email") + " *")}
                    </div>

                    <div className="col-lg-6">
                      {this.renderContactInput(
                        "phoneNumber",
                        Trans("_lblMobileNumberWithStar")
                      )}
                    </div>

                    <div className="col-lg-12">
                      {this.renderTextarea("comments", Trans("_comments") + " *")}
                    </div>

                    <div className="col-lg-12">
                      <div className="custom-control custom-checkbox m-0">
                        <input
                          className="custom-control-input"
                          type="checkbox"
                          id="terms"
                          value="terms"
                          name="terms"
                          checked={this.state.agreeCondition}
                          onChange={() => this.agreeCondition()}
                        />
                        <label
                          name="terms"
                          htmlFor="terms"
                          title="terms"
                          className="custom-control-label text-secondary"
                        >
                          {Trans("_signupPageAgreeMessagePart1")}{" "}
                          <button className="p-0 m-0 border-0 bg-white">
                            <span
                              className="text-primary"
                              onClick={() => this.props.handleShowTerms()}
                            >
                              {Trans("_signupPageAgreeMessagePart2")}
                            </span>
                          </button>
                        </label>
                      </div>
                      {this.state.errors.terms && (
                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                          {this.state.errors.terms}
                        </small>
                      )}
                    </div>

                    <div className="col-lg-12 mt-4 mb-2">
                      {!isBtnLoading ?
                        <button
                          className="btn btn-primary"
                          onClick={this.handleSubmit}
                        >
                          {Trans("_sendRequest")}
                        </button>
                        :
                        <button className="btn btn-primary" >
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          {Trans("_sendRequest")}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default OfflineCancelModify;
