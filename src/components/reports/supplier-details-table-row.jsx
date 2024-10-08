import React, { Component } from 'react'
import Datecomp from '../../helpers/date';
import Amount from "../../helpers/amount";

export class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPayment: false
        }
    }
    render() {
        let { index, data } = this.props
        let { showPayment } = this.state
        return (
            <>
                {data.paymentMode &&
                    <tr>
                        <td>{index + 1}</td>
                        <td><Datecomp date={data.paymentDate} /></td>
                        <td>{data.paymentMode}</td>
                        <td><Amount amount={data.paymentAmount} currencyCode={data.invoiceCurrencyCode} /></td>
                        <td><Amount amount={data.totalPaidAmount} currencyCode={data.invoiceCurrencyCode} /></td>
                        <td><Amount amount={data.dueAmount} currencyCode={data.invoiceCurrencyCode} /></td>
                        <td><a onClick={() => { this.setState({ showPayment: !showPayment }) }} style={{ cursor: "pointer", color: "blue" }}>Payment Details</a></td>
                        <td>
                            {data.supplierInvoicePaymentDetailId &&
                                <a onClick={() => { this.props.setReconcilition(data.supplierInvoicePaymentDetailId) }} style={{ cursor: "pointer", color: "blue" }}>Reconciliation History</a>
                            }
                        </td>

                    </tr>
                }
                {!data.paymentMode &&
                    <tr className="text-center">
                        <td colSpan={8}>No Payment Found.</td>
                    </tr>
                }
                {showPayment && (
                    <tr>
                        <td colSpan={8}>
                            {data.paymentMode && data.paymentMode.toLowerCase() === "cheque" ? (
                                <div>
                                    Cheque Number: {data.chequeNumber} {" "}
                                Cheque Date:  {Datecomp({ date: data.chequeDate })} {" "}
                                Bank:  {data.chequeBank} {" "}
                                Branch: {data.chequeBranch}
                                </div>
                            ) : data.paymentMode && data.paymentMode.toLowerCase() === "debitcard" || data.paymentMode.toLowerCase() === "creditcard" ? (
                                <div>
                                Bank:  {data.chequeBank} {" "}
                                <br/>Card Number: {"xxxx-xxxx-xxxx-"+ data.cardLastFourDigit}
                                </div>
                            ) : (
                                <div>Transaction Reference Number: {data.transactionRefNumber}</div>

                            )}
                        </td>
                    </tr>
                )}

            </>
        )
    }
}

export default TableRow
