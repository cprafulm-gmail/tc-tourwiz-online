import React from "react";
import { Trans } from "../../helpers/translate";

const BookingSteps = ({ isLoggedIn, isPayment }) => {
  return (
    <div className="title-bg booking-steps">
      <div className="container">
        <div className="row pt-3 pb-3">
          <div
            className={
              isLoggedIn
                ? "step col-4 d-flex flex-wrap justify-content-center active completed"
                : "step col-4 d-flex flex-wrap justify-content-center active"
            }
          >
            <span className="d-flex">1</span>
            <label className="text-white m-0 w-100 text-center mt-2">
              {Trans("_bookingStepReview")}
            </label>
          </div>
          <div
            className={
              isLoggedIn
                ? isPayment
                  ? "step col-4 d-flex flex-wrap justify-content-center active completed"
                  : "step col-4 d-flex flex-wrap justify-content-center active"
                : "step col-4 d-flex flex-wrap justify-content-center"
            }
          >
            <span className="d-flex">2</span>
            <label className="text-white m-0 w-100 d-block text-center mt-2">
              {Trans("_bookingStepCustomerInformation")}
            </label>
          </div>
          <div
            className={
              isPayment
                ? "step col-4 d-flex flex-wrap justify-content-center active"
                : "step col-4 d-flex flex-wrap justify-content-center"
            }
          >
            <span className="d-flex">3</span>
            <label className="text-white m-0 w-100 d-block text-center mt-2">
              {Trans("_bookingStepPaymentInformation")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
