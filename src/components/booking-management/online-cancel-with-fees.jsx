import React from "react";
import Loader from "../common/loader";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import info from "../../assets/images/dashboard/info-circle.svg";
import * as Global from "../../helpers/global";

const OnlineCancel = props => {
  const { isErrorResponseInonlineCancelationFare, onlineCancelationFare, onlineCancelConfirm } = props;
  let cancellationCharge = props.bookingData.isOfflineBooking
    ? Number(props.cancellationCharges.supplierCancellationCharge)
    : onlineCancelationFare
      ? onlineCancelationFare.find(x => x.purpose === "11").amount
      : "";
  let refundAmount = props.bookingData.isOfflineBooking
    ? Number(props.cancellationCharges.refundAmount)
    : onlineCancelationFare
      ? onlineCancelationFare.find(x => x.purpose === "12").amount
      : "";
  const { mode } = props;
  const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
    && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
  if (props.bookingData.isOfflineBooking) {
    refundAmount = props.bookingData.businessObject.displayRateInfo.find(x => x.purpose === "10").amount;
  }

  const env = JSON.parse(localStorage.getItem("environment"));
  let business = props.business.toLowerCase();
  if (business === "transfers" || business === "custom" || business === "package") business = "activity";
  let generalTaxes = [];
  if (env.customTaxConfigurations && env.customTaxConfigurations
    .find(x => x.business.toLowerCase() === business.toLowerCase())) {
    generalTaxes = env.customTaxConfigurations
      .find(x => x.business.toLowerCase() === business.toLowerCase())
      .taxes.filter(tax => tax.isShowOnUI && Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
      .map(item => { return { "name": item.name, "purpose": item.purpose } })
      .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
  }

  return (
    <div className="model-popup">
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable  modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-capitalize">
                {Trans("_" + mode.toLowerCase())}{" "}{Trans("_reservation")}
              </h5>
              <button
                type="button"
                className="close"
                onClick={props.handleOnlineCancel}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {onlineCancelationFare && <React.Fragment>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="form-group cancellationCharge">
                      <label for={props.bookingData.isOfflineBooking ? "supplierCancellationCharge" : "cancellationCharge"}>Cancellation Charge</label>
                      <input type="text"
                        name={props.bookingData.isOfflineBooking ? "supplierCancellationCharge" : "cancellationCharge"}
                        id={props.bookingData.isOfflineBooking ? "supplierCancellationCharge" : "cancellationCharge"}
                        className="form-control "
                        disabled={props.bookingData.isOfflineBooking ? false : true}
                        value={props.bookingData.isOfflineBooking ? props.cancellationCharges.supplierCancellationCharge : cancellationCharge}
                        onChange={props.handleCancellationCharges}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group additionalCharge">
                      <label for="additionalCharge">Additional Charge</label>
                      <input type="text" name="additionalCharge" id="additionalCharge" className="form-control "
                        value={props.cancellationCharges.additionalCharge}
                        onChange={props.handleCancellationCharges} />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group cancellationFees">
                      <label for="cancellationFees">Cancellation Fees</label>
                      <input type="text" name="cancellationFees" id="cancellationFees" className="form-control "
                        value={props.cancellationCharges.cancellationFees}
                        onChange={props.handleCancellationCharges}
                      />
                    </div>
                  </div>
                  {IsGSTApplicable &&
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label htmlFor="taxType">Tax Category</label>

                        <button className='btn disabled' data-toggle="tooltip" data-placement="right" title="Percentage is divided equally between CGST and SGST"
                          style={{ position: "absolute", top: "-7px", right: "10px" }}>
                          <figure>
                            <img
                              style={{ filter: "none" }}
                              src={info}
                              alt=""
                            />
                          </figure>
                        </button>
                        <select className="form-control" name="taxType"
                          defaultValue={props.cancellationCharges.taxType}
                          onChange={props.handleCancellationCharges}
                        >
                          {props?.taxOptions?.map(item => {
                            return <option key={item.value} value={item.value}>{item.label}</option>
                          })}
                        </select>
                      </div>
                    </div>
                  }
                  {generalTaxes.length > 0 &&
                    <React.Fragment>
                      {generalTaxes.map((item, count) => {
                        return (!props.paperrates || props.business.toLowerCase() === "package")
                          ?
                          <div className="col-lg-3">
                            <div className={"form-group " + item.name}>
                              <label for={item.name}>{item.name}</label>
                              <input type="text" name={"tax" + item.purpose} id={"tax" + item.purpose} className="form-control "
                                value={props.cancellationCharges["tax" + item.purpose]}
                                onChange={props.handleCancellationCharges}
                              />
                            </div>
                          </div>
                          : <div></div>
                      })}
                    </React.Fragment>
                  }
                </div>
                <div className="row">
                  {IsGSTApplicable && <React.Fragment>
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label htmlFor="taxPercentage">GST Percentage (%)</label>
                        <input type="numeric" name="taxPercentage" id="taxPercentage" className="form-control"
                          /* onChange={this.handleTaxPercentage} value={Number(this.state.data.taxPercentage)}  */
                          value={props.cancellationCharges.taxPercentage}
                          onChange={props.handleCancellationCharges}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label htmlFor="">Inclusive GST</label>
                      <div className="custom-control custom-switch  ">
                        <input
                          id="isInclusive"
                          name="isInclusive"
                          type="checkbox"
                          className="custom-control-input"
                          checked={props.cancellationCharges.isInclusive}
                          onChange={props.handleCancellationCharges}
                        />
                        <label className="custom-control-label" htmlFor="isInclusive" style={{ fontSize: "0.8em" }}>
                        </label>
                      </div>
                    </div>
                    {props.cancellationCharges.taxType === "IGST" &&
                      <React.Fragment>
                        <div className="col-lg-3">
                          <div className="form-group">
                            <label htmlFor="IGST">IGST</label>
                            <input type="text" name="IGST" id="IGST" className="form-control"
                              /* onChange={(e) => this.handledata(e.target.name, e.target.value)} */
                              /* value={Number(refundAmount)} */
                              value={props.cancellationCharges.IGST}
                              onChange={props.handleCancellationCharges}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3"></div>
                      </React.Fragment>}
                    {props.cancellationCharges.taxType === "CGSTSGST" && <React.Fragment>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label htmlFor="CGST">CGST</label>
                          <input type="text" name="CGST" id="CGST" className="form-control"
                            /* onChange={(e) => this.handledata(e.target.name, e.target.value)} value={Number(this.state.data.CGST)}  */
                            onChange={props.handleCancellationCharges}
                            value={props.cancellationCharges.CGST}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label htmlFor="SGST">SGST</label>
                          <input type="text" name="SGST" id="SGST" className="form-control"
                            /* onChange={(e) => this.handledata(e.target.name, e.target.value)} value={Number(this.state.data.SGST)}  */
                            onChange={props.handleCancellationCharges}
                            value={props.cancellationCharges.SGST}
                          />
                        </div>
                      </div>
                    </React.Fragment>}
                  </React.Fragment>}
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="totalCancellationCharge" style={{ "fontSize": "0.8em" }}>Total Cancellation Charge</label>
                      <input type="text" name="totalCancellationCharge" id="totalCancellationCharge" className="form-control" disabled={true}
                        /* onChange={(e) => this.handledata(e.target.name, e.target.value)}   */
                        value={props.cancellationCharges.totalCancellationCharge === 0 ? cancellationCharge : props.cancellationCharges.totalCancellationCharge}
                      />
                      {props.cancellationCharges.errorMessages.totalCancellationCharge &&
                        <small className="alert alert-danger mt-2 p-1 d-inline-block">{props.cancellationCharges.errorMessages.totalCancellationCharge}</small>}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="form-group">
                      <label htmlFor="refundAmount">Refund Amount</label>
                      <input type="text" name="refundAmount" id="refundAmount" className="form-control" disabled={true}
                        /* onChange={(e) => this.handledata(e.target.name, e.target.value)}   */
                        value={props.cancellationCharges.refundAmount === -1 ? refundAmount : props.cancellationCharges.refundAmount}
                      />
                      {props.cancellationCharges.errorMessages.refundAmount &&
                        <small className="alert alert-danger mt-2 p-1 d-inline-block">{props.cancellationCharges.errorMessages.refundAmount}</small>}
                    </div>
                  </div>
                </div>
              </React.Fragment>}
              {onlineCancelationFare && (
                <div className="p-3">
                  {/* <ul className="list-unstyled p-0 m-0">
                    <li className="row mb-2">
                      <label className="col-lg-5">{Trans("_cancellationCharges")} : </label>
                      <b className="col-lg-7">
                        <Amount amount={cancellationCharge} />
                      </b>
                    </li>

                    <li className="row">
                      <label className="col-lg-5">{Trans("_refundAmount")} : </label>
                      <b className="col-lg-7">
                        <Amount amount={refundAmount} />
                      </b>
                    </li>
                  </ul> */}
                  {!onlineCancelConfirm && (
                    <div className="text-center">
                      {props.isLocadingButton ?
                        <button className="btn btn-primary">
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          {Trans("_confirm")}{" "}{mode}
                        </button> : <button
                          onClick={() => { props.handleCancelConfirm() }}
                          className="btn btn-primary"
                        >
                          {Trans("_confirmcancel")}
                        </button>
                      }
                    </div>
                  )}
                </div>
              )}
              {isErrorResponseInonlineCancelationFare &&
                <div className="col-lg-12 text-center p-3">
                  <h6 className='text-secondary mb-3'>OOps! Some thing went wrong. Kindly try again after some time.</h6>
                </div>}
              {!onlineCancelationFare && !isErrorResponseInonlineCancelationFare && <Loader />}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default OnlineCancel;
