import React from "react";
import Loader from "../common/loader";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";

const OnlineCancel = props => {
  const { onlineCancelationFare, onlineCancelConfirm } = props;
  let cancellationCharge = onlineCancelationFare
    ? onlineCancelationFare.find(x => x.purpose === "11").amount
    : "";
  let refundAmount = onlineCancelationFare
    ? onlineCancelationFare.find(x => x.purpose === "12").amount
    : "";
  const { mode } = props;

  return (
    <div className="model-popup">
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
              {onlineCancelationFare && (
                <div className="p-3">
                  <ul className="list-unstyled p-0 m-0">
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
                  </ul>
                  {!onlineCancelConfirm && (
                    <div className="mt-4 text-center">
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

              {!onlineCancelationFare && <Loader />}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default OnlineCancel;
