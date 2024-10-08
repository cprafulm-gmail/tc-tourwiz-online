import React, { Component } from "react";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import FailedBookingPopupHotel from "./failed-booking-popup-hotel"
import FailedBookingPopupAir from "./failed-booking-popup-air"
import FailedBookingPopupActivity from "./failed-booking-popup-activity"
import Amount from "../../helpers/amount";

class FailedBookingPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBtnLoading: false,
      brn: "",
      charge: "",
      errors: {}
    };
  }

  handleFailedBookingUpdate = () => {
    let failedBookingDetails = this.props.failedBookingDetails;
    const errors = {};
    if (this.state.brn === "" && this.props.mode === "confirm")
      errors.brn = Trans("_error__bookingReferenceNumber_require");
    if (this.state.charge === "" && this.props.mode === "cancel")
      errors.charge = Trans("_error_cancellationCharges_require");
    else if (
      (isNaN(parseFloat(this.state.charge)) ||
        !/^\d+(\.\d{2})?$/g.test(this.state.charge) ||
        parseFloat(this.state.charge) >
        parseFloat(failedBookingDetails.amount) ||
        parseFloat(this.state.charge) < 0) &&
      this.props.mode === "cancel"
    )
      errors.charge = Trans("_error_cancellationCharges_invalid");

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errorsNew || {} });
    if (errorsNew) return;

    this.props.mode === "confirm" &&
      (failedBookingDetails.BookingRefNo = this.state.brn);

    this.props.mode === "cancel" &&
      (failedBookingDetails.CancellationAmount = this.state.charge);

    this.setState({
      isBtnLoading: true
    });
    this.props.handleFailedBookingUpdate(failedBookingDetails, this.props.mode);
  };

  render() {
    const { isBtnLoading } = this.state;
    const { mode, failedBookingDetails, viewBookingDetails } = this.props;
    const { amount } = failedBookingDetails;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">
                  {mode === "confirm"
                    ? Trans("_confirmBooking")
                    : mode === "cancel"
                      ? Trans("_cancelBooking")
                      : Trans("_itineraryDetails")}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.hideFailedBookingPopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {viewBookingDetails ? (
                  <div>

                    {this.props.failedBookingDetails.businessDescription.toLowerCase() === "hotel" &&
                      <FailedBookingPopupHotel
                        viewBookingDetails={viewBookingDetails}
                        {...mode}
                      />
                    }
                    {this.props.failedBookingDetails.businessDescription.toLowerCase() === "air" &&
                      <FailedBookingPopupAir
                        viewBookingDetails={viewBookingDetails}
                        {...mode}
                      />
                    }
                    {((this.props.failedBookingDetails.businessDescription.toLowerCase() === "excursion" && viewBookingDetails.businessShortDescription.toLowerCase() === "activity")
                      || (this.props.failedBookingDetails.businessDescription.toLowerCase() === "transportation" && viewBookingDetails.businessShortDescription.toLowerCase() === "transportation")
                      || (this.props.failedBookingDetails.businessDescription.toLowerCase() === "groundservice" && viewBookingDetails.businessShortDescription.toLowerCase() === "groundservice")
                      || (this.props.failedBookingDetails.businessDescription.toLowerCase() === "transfers" && viewBookingDetails.businessShortDescription.toLowerCase() === "transfers"))
                      &&
                      <FailedBookingPopupActivity
                        viewBookingDetails={viewBookingDetails}
                        {...mode}
                      />
                    }

                    {(mode === "confirm" || mode === "cancel") && (
                      <React.Fragment>
                        <div className="row">
                          <div className="col-lg-6">
                            {mode === "confirm" && (
                              <div className="form-group">
                                <label>{Trans("_bookingReferenceNumber") + " *"} :</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={this.state.brn}
                                  onChange={e =>
                                    this.setState({ brn: e.target.value })
                                  }
                                />
                                {this.state.errors.brn !== undefined &&
                                  this.state.errors.brn !== "" && (
                                    <div className="col-lg-12 col-sm-12 m-0 p-0">
                                      <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                        {this.state.errors.brn}
                                      </small>
                                    </div>
                                  )}
                              </div>
                            )}

                            {mode === "cancel" && (
                              <div className="form-group">
                                <label> {Trans("_cancellationCharges")} * :</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={this.state.charge}
                                  onChange={e =>
                                    this.setState({ charge: e.target.value })
                                  }
                                />
                                {this.state.errors.charge !== undefined &&
                                  this.state.errors.charge !== "" && (
                                    <div className="col-lg-12 col-sm-12 m-0 p-0">
                                      <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                        {this.state.errors.charge}
                                      </small>
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>

                          <div className="col-lg-6">
                            <label>{Trans("_amount")} :</label>
                            <b className="d-block mt-1">
                              <Amount amount={amount} />
                            </b>
                          </div>
                        </div>

                        <div className="row"></div>

                        <div className="row">
                          <div className="col-lg-12 mt-2">
                            <button
                              className="btn btn-primary mr-3"
                              onClick={this.handleFailedBookingUpdate}
                            >
                              {isBtnLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              {mode === "confirm"
                                ? Trans("_confirmBooking")
                                : Trans("_cancelBooking")}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                ) : (
                    <Loader />
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default FailedBookingPopup;
