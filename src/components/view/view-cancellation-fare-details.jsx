import React from "react";
import Amount from "../../helpers/amount";

const ViewCancellationFareDetails = props => {
  let fareBreakup = props.fareBreakup;
  let isInclusiveGST = false;
  let priceBrackup = []
  let supplierCancellationCharge = fareBreakup.find(x => x.purpose === "166")
  if (supplierCancellationCharge && supplierCancellationCharge.amount > 0) {
    priceBrackup.push({ description: "Supplier Cancellation Charge", amount: supplierCancellationCharge.amount })
  }
  let additionalCharge = fareBreakup.find(x => x.purpose === "165")
  if (additionalCharge && additionalCharge.amount > 0) {
    priceBrackup.push({ description: "Additional Charge", amount: additionalCharge.amount })
  }
  let cancellationFees = fareBreakup.find(x => x.purpose === "156")
  if (cancellationFees && cancellationFees.amount > 0) {
    priceBrackup.push({ description: "Cancellation Fees", amount: cancellationFees.amount })
    isInclusiveGST = cancellationFees.isInclusiveTax;
  }
  let CGST = fareBreakup.find(x => x.purpose === "157")
  if (!isInclusiveGST && CGST && CGST.amount > 0) {
    priceBrackup.push({ description: "CGST", amount: CGST.amount })
  }
  let SGST = fareBreakup.find(x => x.purpose === "158")
  if (!isInclusiveGST && SGST && SGST.amount > 0) {
    priceBrackup.push({ description: "SGST", amount: SGST.amount })
  }
  let IGST = fareBreakup.find(x => x.purpose === "159")
  if (!isInclusiveGST && IGST && IGST.amount > 0) {
    priceBrackup.push({ description: "IGST", amount: IGST.amount })
  }
  let tax160 = fareBreakup.find(x => x.purpose === "160")
  if (tax160 && tax160.amount > 0) {
    priceBrackup.push({ description: tax160.description, amount: tax160.amount })
  }
  let tax161 = fareBreakup.find(x => x.purpose === "161")
  if (tax161 && tax161.amount > 0) {
    priceBrackup.push({ description: tax161.description, amount: tax161.amount })
  }
  let tax162 = fareBreakup.find(x => x.purpose === "162")
  if (tax162 && tax162.amount > 0) {
    priceBrackup.push({ description: tax162.description, amount: tax162.amount })
  }
  let tax163 = fareBreakup.find(x => x.purpose === "163")
  if (tax163 && tax163.amount > 0) {
    priceBrackup.push({ description: tax163.description, amount: tax163.amount })
  }
  let tax164 = fareBreakup.find(x => x.purpose === "164")
  if (tax164 && tax164.amount > 0) {
    priceBrackup.push({ description: tax164.description, amount: tax164.amount })
  }
  let cancellationAmount = fareBreakup.find(x => x.purpose === "11")
  if (cancellationAmount && cancellationAmount.amount > 0) {
    priceBrackup.push({ description: "Total Cancellation Amount", amount: cancellationAmount.amount })
  }
  let refundAmount = fareBreakup.find(x => x.purpose === "12")
  //if (refundAmount && refundAmount.amount > 0) {
  priceBrackup.push({ description: "Refund Amount", amount: refundAmount.amount })
  //}

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">Cancellation Price Details</h5>
      </div>
      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">
          {priceBrackup.map((item, index) => {
            //Room Wise Loop
            return (
              <li className="row" key={index}>
                <label className="col-lg-3">{item.description}</label>
                <b className="col-lg-9">
                  <Amount amount={item.amount}></Amount>
                </b>
              </li>
            );
          })}

        </ul>
        {isInclusiveGST && <small className="">- Total Cancellation Amount inclusive of all taxes</small>}
      </div>
    </div>
  );
};

export default ViewCancellationFareDetails;
