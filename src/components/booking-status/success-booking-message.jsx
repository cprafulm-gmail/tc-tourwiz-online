import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";

const SuccessBookingMessage = props => {
  const cart = props;
  const paymentToken = () => {
    if (
      cart !== null &&
      cart["cart"].paymentTransaction !== undefined &&
      cart["cart"].paymentTransaction.paymentToken !== undefined
    )
      return cart["cart"].paymentTransaction.paymentToken;
    else return null;
  };

  const redirectToDetails = () => {
    let irn = cart["cart"].itineraryReferenceNumber;
    let brns = [];
    cart["cart"].items.map(item => {
      return brns.push(btoa(item.bookingReferenceCode));
    });
    brns = brns.join("||");

    props.history.push(`/ViewBooking/view/${irn}/${brns}`);
  };

  // var visaFeeQuantity = 0;
  // var visafee = 0;
  var umrahMutamerRequestID = "";
  if (localStorage.getItem("umrahPackageDetails")) {
    if (cart.cart.items.filter(x => x.data.business === "hotel").length > 0 && cart.cart.items.filter(x => x.data.business === "hotel")[0].addons?.availableAddons) {
      // visaFeeQuantity = cart.cart.items.filter(x => x.data.business === "hotel")[0].addons.availableAddons.filter(x => x.type === "umrahVisaFee").length;
      // visafee = cart.cart.items.filter(x => x.data.business === "hotel")[0].addons.availableAddons.filter(x => x.type === "umrahVisaFee").reduce((sum, item) => (sum + item.item[0].amount), 0);
      var umrahMutamerRequestID = cart.cart.paymentTransaction?.transactionRequest?.find(x => x.businessObject.business === 'hotel')?.config.find(x => x.key === "UmrahMutamerRequestID")?.value
      if (umrahMutamerRequestID)
        umrahMutamerRequestID = "https://poc.sejeltech.com/eservices3-DEV/VisaForm/mutamervisa/processing?" + umrahMutamerRequestID.split("?")[1];
    }
  }
  return (
    <div>
      <h5 className="d-flex align-items-center font-weight-bold">
        <SVGIcon name="check-circle" className="fa-2x mr-2 text-success" width="24" height="24"></SVGIcon>
        {Trans("_titleBookingSuccessfully")}
      </h5>

      <div className="border-top mt-4 pt-3">
        <p>{Trans("_infoBookingSuccessfully")}</p>
        <b className="d-block mt-4 mb-4">
          {Trans("_itineraryNumber") + " :"}
          <span className="badge badge-secondary bg-success p-2 ml-2">
            {cart["cart"].itineraryReferenceNumber}
          </span>
        </b>

        <p className="d-block">{Trans("_infoItineraryNumber")}</p>

        {cart["cart"].bookingTransactionStatus === 4 && (
          <p className="mt-2 text-danger">
            {Trans("_infoItemIsNotBooked") + " "}
            {paymentToken() != null && (
              <React.Fragment>
                {"using transaction token : " + paymentToken()}
              </React.Fragment>
            )}
            .
          </p>
        )}
        {localStorage.getItem("umrahPackageDetails")
          && (<React.Fragment>
            {!umrahMutamerRequestID &&
              <h6 class="text-primary font-weight-bold">
                Due to technical difficulties we could not process your Visa Application. <br />Please contact customer support team using {Global.getEnvironmetKeyValue("customerCareEmail")} or {Global.getEnvironmetKeyValue("portalPhone")}.
              </h6>
            }

            {umrahMutamerRequestID &&
              <div class="border bg-white p-3 mb-2">
                <h6 class="border-bottom pb-3 font-weight-bold">
                  <a className="umrahMutamerRequest btn btn-sm btn-primary" target="_blank" href={umrahMutamerRequestID}>
                    <SVGIcon name="visaprocess" className="fa-2x mr-2 text-success" width="24" height="24"></SVGIcon>
                    {Trans("_completeVisaProcess")}</a>
                </h6>

                {cart.cart.items.filter(x => x.data.business === "hotel")[0].addons.availableAddons.filter(x => x.type === "umrahVisaFee").map((item, index) => {
                  return <React.Fragment key={index}>
                    <div class="mb-2">{cart.cart.paymentTransaction.transactionRequest.find(x => x.businessShortDescription === "Hotel").travellerDetails[index].details.firstName}
                      {' '}{cart.cart.paymentTransaction.transactionRequest.find(x => x.businessShortDescription === "Hotel").travellerDetails[index].details.lastName}
                      {' '}:{' '}<span class="text-success ml-2">SAR {item.item[0].amount}</span>
                    </div>
                  </React.Fragment>
                })}
              </div>
            }
          </React.Fragment>)
        }
        <div className="border-top mt-4 pt-3">
          <button
            onClick={() => redirectToDetails(cart["cart"].items)}
            className="btn btn-sm btn-primary"
          >
            {Trans("_detailsAndPrintView")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessBookingMessage;
