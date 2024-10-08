import React from "react";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";

const PaymentMode = (props) => {
  const { paymentGatewayCharges, paymentMode } = props;
  return (
    <div className="payment-form">
      <div className="payment-details border pt-3 pl-3 pr-3 bg-white box-shadow mb-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon name="credit-card" width="24" height="24" type="fill" className="mr-2"></SVGIcon>
          {Trans("_titlePaymentMode")}
        </h5>
        <div>{props.paymentInfo()}</div>
        <div>
          <ul className="list-unstyled m-0 p-0">
            {Object.keys(paymentGatewayCharges).map((item, key) => {
              const charges = paymentGatewayCharges[item];
              const modeName = paymentMode.paymentGatewayInputInfo.find(
                (x) => x.code.toLowerCase() === item.toLowerCase()
              ).name;
              const modeCode = paymentMode.paymentGatewayInputInfo.find(
                (x) => x.code.toLowerCase() === item.toLowerCase()
              ).code;
              return (
                <li key={key}>
                  <h6 className="bg-light p-3 border font-weight-bold text-capitalize m-0">
                    <div className="custom-control custom-radio d-inline-block">
                      <input
                        type="radio"
                        id={"customRadio" + key}
                        name="customRadio"
                        className="custom-control-input"
                        defaultChecked={key === 0}
                        onChange={() => props.setPaymentMode(item)}
                      />
                      <label className="custom-control-label" htmlFor={"customRadio" + key}>
                        {modeName}
                      </label>
                    </div>

                    <span className="pull-right">
                      <Amount amount={charges.find((x) => x.purpose === "10").amount}></Amount>
                    </span>
                  </h6>
                  <div className="border p-3 mb-3">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="bg-light p-3">
                          <div className="row mb-2">
                            <span className="col-8">{Trans("_itineraryAmount") + " : "}</span>
                            <b className="col-4">
                              <Amount
                                amount={charges.find((x) => x.purpose === "1").amount}
                              ></Amount>
                            </b>
                          </div>
                          <div className="row mb-2">
                            <span className="col-8">
                              {Trans("_serviceChargesOrPaymentFees") + " : "}
                            </span>
                            <b className="col-4">
                              <Amount
                                amount={charges.find((x) => x.purpose === "116").amount}
                              ></Amount>
                            </b>
                          </div>
                          {charges
                            .filter(
                              (x) => x.purpose !== "1" && x.purpose !== "116" && x.purpose !== "10"
                            )
                            .map((item) => {
                              return (
                                <div className="row mb-2">
                                  <span className="col-8">{item.purpose + " : "}</span>
                                  <b className="col-4">
                                    <Amount amount={item.amount}></Amount>
                                  </b>
                                </div>
                              );
                            })}
                          <div className="row mt-2 pt-2">
                            <div className="col-12">
                              <div className="border-top pt-2"></div>
                            </div>
                            <span className="col-8 text-primary">
                              {Trans("_totalAmount") + " : "}
                            </span>
                            <b className="col-4 text-primary">
                              <Amount
                                amount={charges.find((x) => x.purpose === "10").amount}
                              ></Amount>
                            </b>
                          </div>
                        </div>
                      </div>

                      {Global.getEnvironmetKeyValue("portalType").toLowerCase() === "b2c" &&
                        modeCode === "holdBooking" && (
                          <div className="col-11 alert alert-danger m-3">
                            {Trans("_bookAndPayLaterMessage")}
                          </div>
                        )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentMode;
