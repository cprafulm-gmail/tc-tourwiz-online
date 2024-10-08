import React, { Component } from "react";
import Loader from "../common/loader";
import Date from "../../helpers/date";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import TaxInfo from "../cart/tax-info";

class OfflineBookingComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCancellationCharges: true,
      isBtnLoading: false,
      bookingStatusID: "7",
      cancellationCharges: props.onlineCancelationFare ? props.onlineCancelationFare.find(x => x.purpose === "11").amount : 0,
      fees: 0,
      taxInfo: null,
      comment: "",
      isShowComments: this.props.mode,
      errors: {}
    };
  }

  validate = () => {
    const errors = {};
    const { offlineComment } = this.props;

    const details = offlineComment && offlineComment.details;

    if (this.state.comment === "")
      errors.comment = Trans("_error_comment_require");
    if (
      this.state.bookingStatusID !== "" &&
      this.state.bookingStatusID === "7"
    ) {
      if (
        this.state.cancellationCharges === "" ||
        this.state.cancellationCharges === "0" ||
        this.state.cancellationCharges === 0
      )
        errors.cancellationCharges = Trans(
          "_error_cancellationCharges_require"
        );
      else if (
        !/^\d+(\.\d{2})?$/g.test(this.state.cancellationCharges) ||
        isNaN(parseFloat(this.state.cancellationCharges)) ||
        parseFloat(this.state.cancellationCharges) >
        parseFloat(details.businessObject.amount) ||
        parseFloat(this.state.cancellationCharges) < 0
      )
        errors.cancellationCharges = Trans(
          "_error_cancellationCharges_invalid"
        );
    }
    if (this.state.bookingStatusID === "")
      errors.bookingStatusID = Trans("_error_bookingStatusID_require");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  updateStatus = e => {
    let status = e.target.value;

    this.setState({
      isCancellationCharges: false,
      bookingStatusID: status,
      cancellationCharges: 0
    });

    status === "7" &&
      this.setState({
        isCancellationCharges: true
      });
  };

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.setState({
      isBtnLoading: true
    });

    let req = this.props.offlineComment.details;
    req.comment = this.state.comment;
    req.bookingStatusID = this.state.bookingStatusID;
    req.cancellationCharges = this.state.cancellationCharges;
    /* 
    let config = {};
    config["processingFee"] = this.state.taxInfo.processingFee;
    config["CGST"] = this.state.taxInfo.CGST;
    config["IGST"] = this.state.taxInfo.IGST;
    config["SGST"] = this.state.taxInfo.SGST;
    config["isInclusive"] = this.state.taxInfo.isInclusive;
    config["taxType"] = this.state.taxInfo.taxType; 
    */
    req.customTaxConfiguration = this.state.taxInfo.customTaxConfiguration
    this.props.updateOfflineBookingManual(req);
  };

  showAmendCancelOptions = (Offlinecomment, fromoptions) => {
    let displayoption = false;
    if (fromoptions === "cancel") {
      Offlinecomment.comments.map((key) => {
        if (key.bookingStatusID === "2" && key.comment !== "" && Offlinecomment.details.bookingStatusID !== "3") {
          displayoption = true;
        }
        return true;
      });
    }
    if (fromoptions === "amend") {
      Offlinecomment.comments.map((key) => {
        if (key.bookingStatusID === "3" && key.comment !== "" && Offlinecomment.details.bookingStatusID !== "2") {
          displayoption = true;
        }
      });
    }
    return displayoption;
  };

  showComments = () => {
    this.setState({
      isShowComments: this.state.isShowComments === "view" ? "add" : "view"
    });
  };

  updateGSTInfo = taxInfo => {
    this.setState({
      taxInfo: taxInfo
    });
  }
  render() {
    const { isCancellationCharges, isBtnLoading, isShowComments, taxInfo, cancellationCharges } = this.state;
    const { offlineComment, mode, onlineCancelationFare } = this.props;

    const details = offlineComment && offlineComment.details;
    const comments = offlineComment && offlineComment.comments;
    const netCancellationCharges = parseFloat(cancellationCharges ?? 0)
      + (parseFloat(taxInfo?.processingFee ?? 0))
      + (parseFloat(taxInfo?.CGST ?? 0))
      + (parseFloat(taxInfo?.SGST ?? 0))
      + (parseFloat(taxInfo?.IGST ?? 0));
    const refundAmount = parseFloat(details?.businessObject?.amount ?? 0) - parseFloat(netCancellationCharges);
    return (
      <div className="model-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">
                  {mode === "view" ? Trans("_viewComments") : "Cancel Booking"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.hideCommentPopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {offlineComment && (
                  <div>
                    <div className="row">
                      <div className="col-lg-6">
                        <h6 className="text-primary">
                          {Trans("_bookingDetails")} - {details.businessShortDescription}
                        </h6>
                        <ul className="list-unstyled">
                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_bookingReferenceNumber")} :
                            </label>
                            <span>{details.bookingRefNo}</span>
                          </li>
                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_itineraryNumber")} :
                            </label>
                            <span>{details.itineraryRefNo}</span>
                          </li>
                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_vendor")} :
                            </label>
                            <span>{details.providerName}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-6">
                        <h6 className="text-primary">{Trans("_customerDetails")}</h6>
                        <ul className="list-unstyled">
                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_customerName")} :
                            </label>
                            <span>{details?.travellerDetails.length > 0 ? details?.travellerDetails[0].details?.userDisplayName : ""}</span>
                          </li>

                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_email")} :
                            </label>
                            <span>{details?.travellerDetails.length > 0 ? details?.travellerDetails[0].details?.contactInformation?.email : ""}</span>
                          </li>

                          <li>
                            <label className="text-secondary mr-2">
                              {Trans("_viewPhone")} :
                            </label>
                            <span>{details?.travellerDetails.length > 0 ? details?.travellerDetails[0].details?.contactInformation?.homePhoneNumberCountryCode + "-" + details?.travellerDetails[0].details?.contactInformation?.homePhoneNumber : ""}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {mode === "add" && (
                      <div className="border-top pt-2 mb-4">
                        <div className="row">
                          <div className="col-lg-4 d-none">
                            <div className="form-group">
                              <label>{Trans("_viewStatus")} : </label>
                              <select
                                className="form-control"
                                onChange={this.updateStatus}
                                defaultValue={this.state.bookingStatusID}
                                disabled={true}
                              >
                                <option value="">{Trans("_select")}</option>
                                {this.showAmendCancelOptions(offlineComment, "cancel") && <option value="7">{Trans("_bookingStatusCancelled")}</option>}
                                <option value="4">{Trans("_bookingStatusRequestInProcess")}</option>
                                <option value="5">{Trans("_bookingStatusOnRequest")}</option>
                                <option value="8">{Trans("_bookingStatusExpiredRequest")}</option>
                                <option value="9">{Trans("_bookingStatusDeniedRequest")}</option>

                                {this.showAmendCancelOptions(offlineComment, "amend") && <option value="6">{Trans("_bookingStatusAmendRequest")}</option>}
                              </select>
                              {this.state.errors.bookingStatusID !==
                                undefined &&
                                this.state.errors.bookingStatusID !== "" && (
                                  <div className="col-lg-12 col-sm-12 m-0 p-0">
                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                      {this.state.errors.bookingStatusID}
                                    </small>
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <label>{Trans("_paidAmount")} : </label>
                            <b className="d-block mt-1">
                              <Amount amount={details.businessObject.amount} />
                            </b>
                          </div>

                          {isCancellationCharges && (
                            <div className="col-lg-3">
                              <div className="form-group">
                                <label>{Trans("_cancellationCharges")}</label>
                                <input
                                  type="text"
                                  value={this.state.cancellationCharges}
                                  className="form-control"
                                  onChange={e =>
                                    this.setState({
                                      cancellationCharges: e.target.value
                                    })
                                  }
                                  disabled={onlineCancelationFare ? true : false}
                                />
                                {this.state.errors.cancellationCharges !==
                                  undefined &&
                                  this.state.errors.cancellationCharges !==
                                  "" && (
                                    <div className="col-lg-12 col-sm-12 m-0 p-0">
                                      <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                        {this.state.errors.cancellationCharges}
                                      </small>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          <TaxInfo
                            cartItems={[{ data: { business: details.businessShortDescription } }]}
                            updateGSTInfo={this.updateGSTInfo}
                            isLoadingTaxInfo={this.state.isLoadingTaxInfo}
                            mode={"manual-cancel"}
                          />
                          <div className="col-lg-4 mb-4">
                            <label>Net Cancelation Charge : </label>
                            <b className="d-block mt-1">
                              <Amount amount={netCancellationCharges} />
                            </b>
                          </div>

                          <div className="col-lg-3">
                            <label>Refund Amount : </label>
                            <b className="d-block mt-1">
                              <Amount amount={refundAmount} />
                            </b>
                          </div>
                        </div>



                        <div className="row">
                          <div className="col-lg-12">
                            <div className="form-group">
                              <label>{Trans("_comments")} : </label>
                              <textarea
                                className="form-control"
                                value={this.state.comment}
                                onChange={e =>
                                  this.setState({ comment: e.target.value })
                                }
                              />
                              {this.state.errors.comment !== undefined &&
                                this.state.errors.comment !== "" && (
                                  <div className="col-lg-12 col-sm-12 m-0 p-0">
                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                      {this.state.errors.comment}
                                    </small>
                                  </div>
                                )}
                              <small className="text-secondary">
                                {Trans("_notePaidAmountIncludesFeesByAgent")}
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-12">
                            <button
                              className="btn btn-primary mr-3"
                              onClick={this.handleSubmit}
                            >
                              {isBtnLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              Confirm Cancel
                            </button>
                            <button
                              className="btn btn-link text-primary p-0 m-0"
                              onClick={this.showComments}
                            >
                              {Trans("_viewComments")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isShowComments === "view" && (
                      <div className="row">
                        <div className="col-lg-12">
                          <h6 className="text-primary">{Trans("_requestComments")}</h6>
                          {comments.map((item, key) => {
                            return (
                              <ul className="list-unstyled row" key={key}>
                                <li className="col-lg-6">
                                  <label className="text-secondary mr-2">
                                    {Trans("_requestDate")} :
                                  </label>
                                  <span>
                                    <Date date={item.transactionDate} />{" "}
                                    <Date
                                      date={item.transactionDate}
                                      format="shortTime"
                                    />
                                  </span>
                                </li>

                                {item.bookingStatus && item.bookingStatus !== '' &&
                                  <li className="col-lg-6">
                                    <label className="text-secondary mr-2">
                                      {Trans("_status")} :
                                    </label>
                                    <span>{item.bookingStatus}</span>
                                  </li>
                                }

                                <li className="col-lg-12">
                                  <label className="text-secondary mr-2">
                                    {Trans("_lblDetails")} :
                                  </label>
                                  <span>{unescape(item.comment)}</span>
                                </li>

                                <li className="col-lg-12">
                                  <label className="text-secondary mr-2">
                                    {Trans("_commentBy")} :
                                  </label>
                                  <span>{item.displayUserName}</span>
                                </li>
                              </ul>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!offlineComment && <Loader />}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default OfflineBookingComments;
