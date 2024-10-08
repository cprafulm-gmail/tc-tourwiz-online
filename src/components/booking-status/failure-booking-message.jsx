import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const FailureBookingMessage = cart => {
  const paymentToken = () => {
    if (
      cart !== null &&
      cart["cart"].paymentTransaction !== undefined &&
      cart["cart"].paymentTransaction.paymentToken !== undefined
    )
      return cart["cart"].paymentTransaction.paymentToken;
    else return null;
  };
  return (
    <div>
      <h5 className="d-flex align-items-center font-weight-bold">
        <SVGIcon name="ban" width="24" height="24" className="fa-2x mr-2 text-danger"></SVGIcon>
        {Trans("_titleBookingFailed")}
      </h5>

      <div className="border-top mt-4 pt-3">
        <p>{Trans("_infoBookingFailed")}</p>
        {paymentToken() != null && (
          <React.Fragment>
            <b className="d-block mt-4 mb-4">
              {Trans("_transactionToken") + " : "}
              <span className="badge badge-secondary bg-success p-2 ml-2">
                {paymentToken()}
              </span>
            </b>
            <p className="d-block">{Trans("_infoItineraryNumber")}</p>
            <p className="d-block">{Trans("_infoItineraryNumber1")}</p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default FailureBookingMessage;
