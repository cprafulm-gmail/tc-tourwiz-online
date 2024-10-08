import React, { Component } from "react";
import DateComp from "../../helpers/date";
import SVGIcon from "../../helpers/svg-icon";
import Amount from "../../helpers/amount";

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      creditData: [],
    };
  }
  componentDidMount() {
    // let arr = [];
    // arr = this.props.creditPaymentDetials.filter((data) => {
    //   if (data.timeStemp === this.props.data.timeStemp) {
    //     return data;
    //   }
    // });
    // this.setState({ creditData: arr });
  }
  render() {
    const { data } = this.props;
    const { creditData, showDetails } = this.state;
    return (
      <React.Fragment>
        <tr>
          <th
            scope="row"
            onClick={() => {
              if (data.creditPaymentAmount) {
                this.setState({ showDetails: !this.state.showDetails });
              }
            }}
          >
            <p className="d-table text-center">
              {data.rowNum}{" "}
              {/* {(data.creditPaymentAmount && !showDetails ) ? (
                <img
                  title="Show more"
                  style={{ cursor: "pointer" }}
                  height={14}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAMklEQVRIiWNgGGngPxQTDZho5JBRC0YtGEoWMCKxScpAxJpNcx+QCkaLilELRi0YkQAArMYFIENGFBoAAAAASUVORK5CYII="
                />
              ) : null}
              {(data.creditPaymentAmount && showDetails) ? (
                <img
                  title="Show less"
                  style={{ cursor: "pointer" }}
                  height={14}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAJUlEQVRIiWNgGAWjYBSMAoKAEYn9nxZmM1HZ0FEwCkbBKCAHAAD4CQEEQU/AbwAAAABJRU5ErkJggg=="
                />
              ):null} */}
            </p>
          </th>
          <td style={{ "wordBreak": "break-word" }}>{data.customerName}</td>
          <td>{data.invoiceNumber}</td>
          <td>{
            data.transactionType === "Additional Payment Receipt"
              ? "Payment"
              : data.transactionType === "Receipt"
                ? "Payment Received"
                : data.transactionType}
          </td> {/* data.transactionType==="Credit Note" */}
          <td>{<DateComp date={data.invoiceDate} />}</td>
          <td>{data.business}</td>
          {data.transactionType === "Additional Payment Receipt" ?
            <React.Fragment>
              <td>{<Amount amount={data.totalBasic} />}</td>
              <td>{<Amount amount={data.totalItemAmount} />}</td>
              <td>{<Amount amount={data.totalTaxes} />}</td>
              <td>{<Amount amount={data.serviceCharges} />}</td>
              <td>{<Amount amount={data.discount} />}</td>
              <td>{<Amount amount={data.netAmount} />}</td>
              <td>{<Amount amount={data.netAmount} />}</td>
              <td>{<Amount amount={data.paidAmount} />}</td>
              <td>{<DateComp date={data.paymentDate} />}</td>
              <td>{data.paymentMode !== undefined ? data.paymentMode === "CreditCard" ? "Credit Card" : data.paymentMode === "DebitCard" ? "Debit Card" : data.paymentMode : "--"}</td>
              <td>{data.paymentMode !== undefined && data.paymentMode === "Cheque" && data.chequeDate && data.chequeDate != "0001-01-01T00:00:00" ? <DateComp date={data.chequeDate} /> : "--"}</td>
              <td style={{ "wordBreak": "break-word" }}>{(data.paymentMode === "Cheque" && data.bankName !== "" && data.bankName !== undefined && data.branchName !== undefined && data.chequeNumber !== undefined) ? (data.chequeNumber + ", " + data.bankName + ", " + data.branchName) : (data.paymentMode === "CreditCard" || data.paymentMode === "DebitCard") ? data.bankName : "--"}</td>
              <td style={{ "wordBreak": "break-word" }}>{data.transactionToken !== undefined && data.transactionToken !== "" ? data.transactionToken : "--"}</td>
              <td style={{ "wordBreak": "break-word" }}>{data.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + data.cardLastFourDigit : "---"}</td>
              <td></td>
            </React.Fragment> :
            data.transactionType === "Credit Note" ?
              <React.Fragment>
                <td>{<Amount amount={data.creditPaymentAmount} />}</td>
                <td>{<Amount amount={data.creditPaymentAmount} />}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>{<Amount amount={data.creditPaymentAmount} />}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </React.Fragment>
              :
              <React.Fragment>
                <td>{<Amount amount={data.totalBasic} />}</td>
                <td>{<Amount amount={data.totalItemAmount} />}</td>
                <td>{<Amount amount={data.totalTaxes} />}</td>
                <td>{<Amount amount={data.serviceCharges} />}</td>
                <td>{<Amount amount={data.discount} />}</td>
                <td>{<Amount amount={data.netAmount} />}</td>
                <td>{<Amount amount={data.paidAmount} />}</td>
                <td>{<Amount amount={data.dueAmount} />}</td>
                <td>{<DateComp date={data.paymentDate} />}</td>
                <td>{data.paymentMode !== undefined ? data.paymentMode === "CreditCard" ? "Credit Card" : data.paymentMode === "DebitCard" ? "Debit Card" : data.paymentMode : "--"}</td>
                <td>{data.paymentMode !== undefined && data.paymentMode === "Cheque" && data.chequeDate && data.chequeDate != "0001-01-01T00:00:00" ? <DateComp date={data.chequeDate} /> : "--"}</td>
                <td style={{ "wordBreak": "break-word" }}>{(data.paymentMode === "Cheque" && data.bankName !== "" && data.bankName !== undefined && data.branchName !== undefined && data.chequeNumber !== undefined) ? (data.chequeNumber + ", " + data.bankName + ", " + data.branchName) : (data.paymentMode === "CreditCard" || data.paymentMode === "DebitCard") ? data.bankName : "--"}</td>
                <td style={{ "wordBreak": "break-word" }}>{data.transactionToken !== undefined && data.transactionToken !== "" ? data.transactionToken : "--"}</td>
                <td style={{ "wordBreak": "break-word" }}>{data.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + data.cardLastFourDigit : "---"}</td>
                <td>
                  {data.paymentMode !== undefined &&
                    <button className="btn btn-link m-0 p-0 text-secondary"
                      onClick={() => { this.props.getReceiptDetails(data) }}
                    >
                      <i className="fa fa-download" aria-hidden="true"></i>{" "}
                    </button>
                  }
                </td>
              </React.Fragment>
          }
        </tr>
        {showDetails && (
          <>
            {creditData.map((fld) => {
              return (
                <tr>
                  <th scope="row"></th>
                  <td>{data.customerName}</td>
                  <td>{fld.invoiceNumber}</td>
                  <td>{<DateComp date={fld.paymentDate} />}</td>
                  <td></td>
                  <td>{data.businessDetails.length > 0 ? data.businessDetails[0].totalBaseRate : 0}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{data.invoiceNetAmount}</td>
                  <td>{data.paymentMode === "CreditCard" ? "Credit Card" : data.paymentMode === "DebitCard" ? "Debit Card" : data.paymentMode}</td>
                  <td>{data.chequeDate}</td>
                  <td></td>
                  <td></td>
                </tr>
              );
            })}
          </>
        )}
      </React.Fragment>
    );
  }
}
