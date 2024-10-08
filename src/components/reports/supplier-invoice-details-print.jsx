import React, { Component } from "react";
import Datecomp from "../../helpers/date";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import ReactToPrint from "react-to-print";
class InvoicePrint extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.printRef = React.createRef();
    }
    componentDidMount() {
        document.getElementById("print").click();
        this.props.onExportComplete();
    }
    render() {
        let data = this.props.data
        let invoiceDetails = data["invoiceDetails"]
        let reconciliationDetails = data["reconciliationDetails"]
        let paymentReconciliationHistory = data["paymentReconciliationHistory"]
        let paymentHistory = data["paymentHistory"];
        paymentHistory = paymentHistory.length === 1 && !paymentHistory[0].paymentMode ? [] : paymentHistory;
        return (
            <React.Fragment>
                < ReactToPrint
                    trigger={() => (
                        <button id="print" className="btn btn-primary btn-sm ml-2 pull-right">
                            Print
                        </button>
                    )}
                    content={() => this.componentRef}
                />

                <div ref={el => (this.componentRef = el)}>
                    <div className="invoicePrint" style={{ width: "90%", "word-wrap": "break-word", margin: "15px" }}>
                        <div style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
                            <h4>Invoice Details</h4>
                            <div style={{ width: "100%" }}>
                                <div>
                                    <b>Invoice Number: </b>{invoiceDetails.invoiceNumber}
                                </div>
                                <div style={{ width: "100%", display: "flex", marginTop: "3px" }}>
                                    <div style={{ width: "48%" }}>
                                        <b>Net Amount: </b>{invoiceDetails.currencyCode + " "}{invoiceDetails.invoiceNetAmount}
                                    </div>
                                    <div style={{ width: "48%" }}>
                                        <b>Due Amount: </b>{invoiceDetails.currencyCode + " "}{invoiceDetails.dueAmount}
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", marginTop: "3px" }}>
                                    <div style={{ width: "48%" }}>
                                        <b>Invoice Date: </b><Datecomp date={invoiceDetails.invoiceDate} />
                                    </div>
                                    <div style={{ width: "48%" }}>
                                        <b>Due Date: </b><Datecomp date={invoiceDetails.dueDate} />
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", marginTop: "3px" }}>
                                    <div style={{ width: "48%" }}>
                                        <b>Start Date: </b><Datecomp date={invoiceDetails.invoiceDurationStartDate} />
                                    </div>
                                    <div style={{ width: "48%" }}><b>End Date: </b><Datecomp date={invoiceDetails.invoiceDurationEndDate} />
                                    </div>
                                </div>
                                <div style={{ width: "100%", display: "flex", marginTop: "3px" }}>
                                    <b>Invoice Status: </b>{invoiceDetails.invoiceStatus}
                                </div>

                            </div>
                        </div>
                        <div style={{ marginTop: "10px", width: "100%" }}>
                            <h4>Reconciliation Details</h4>
                        </div>
                        <table style={{ borderCollapse: "collapse", width: "100%" }} border={1}>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Booking Date</th>
                                    <th>Supplier Name</th>
                                    <th>Booking Currency</th>
                                    <th>Booking Amount</th>
                                    <th>Reconciliation Date</th>
                                    <th>Invoice Number</th>
                                    <th>Reconciled Amount</th>

                                    <th>Paid Amount</th>
                                    <th>Due Amount</th>
                                    <th>Reconciliation Invoice Date</th>
                                    <th>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {reconciliationDetails && reconciliationDetails.length > 0 &&
                                    reconciliationDetails.map((item, index) => {
                                        return <tr>
                                            <td>{index + 1}</td>
                                            <td><Datecomp date={item.bookingDate} /></td>
                                            <td style={{ wordBreak: "break-all" }}>{item.supplierName}</td>
                                            <td>{item.supplierBookingCurrency}</td>
                                            <td>{item.supplierBookingAmount}</td>
                                            <td>
                                                {item.reconciliationDate ? <Datecomp date={item.reconciliationDate} /> : null}
                                            </td>
                                            <td style={{ wordBreak: "break-all" }}>{item.reconciliationInvoiceNo}</td>

                                            <td>{item.supplierReconciledAmout}</td>
                                            <td>{item.paidAmount}</td>
                                            <td>{item.supplierDueAmount}</td>
                                            <td>{item.reconciliationInvoiceDate ? <Datecomp date={item.reconciliationInvoiceDate} /> : null}</td>
                                            <td style={{ wordBreak: "break-all" }}>{item.reconciliationStatus}</td>

                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <div style={{ marginTop: "10px", width: "100%" }}>
                            <h4>Payment History</h4>
                        </div>
                        <table style={{ marginTop: "5px", borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Invoice Number</th>
                                <th>Invoice Date</th>
                                <th>Payment Mode</th>
                                <th>Payment Amount</th>
                                <th>Payment Date</th>
                                <th>Transaction Reference Number</th>
                                <th>Cheque Details</th>
                                <th>Paid Amount</th>
                                <th>Due Amount</th>

                            </tr>
                            {paymentHistory && paymentHistory.length > 0 &&
                                paymentHistory.map((item, index) => {
                                    return <tr>
                                        <td>{index + 1}</td>
                                        <td style={{ wordBreak: "break-all" }}>{item.invoiceNumber}</td>
                                        <td><Datecomp date={item.invoiceDate} /></td>

                                        <td>{item.paymentMode}</td>
                                        <td>{item.paymentAmount}</td>
                                        <td>
                                            {item.paymentDate ? <Datecomp date={item.paymentDate} /> : null}
                                        </td>
                                        <td style={{ wordBreak: "break-all" }}>{item.transactionRefNumber}</td>

                                        <td style={{ wordBreak: "break-word" }}>{item.chequeNumber ? `Cheque Number:${item.chequeNumber}, 
                                Dt:${Datecomp({ date: item.chequeDate })}, Bank:${item.chequeBank}, Branch:${item.chequeBranch}` : null}</td>
                                        <td>{item.totalPaidAmount}</td>
                                        <td>{item.dueAmount}</td>


                                    </tr>
                                })
                            }
                            {paymentHistory && paymentHistory.length === 0 &&
                                <td className="text-center" colSpan={10}> No records found.</td>
                            }
                        </table>

                        {paymentReconciliationHistory && paymentReconciliationHistory.length > 0 && (<>
                            <div style={{ marginTop: "10px", width: "100%" }}>
                                <h4>Payment Reconciliation History</h4>
                            </div>
                            <table style={{ marginTop: "5px", borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Booking Ref No</th>
                                    <th>Booking Currency</th>
                                    <th>Booking Amount</th>
                                    <th>Reconciled Amount</th>
                                    <th>Reconciliation Date</th>
                                    <th>Narration</th>
                                    <th>Paid Amount</th>
                                    <th>Payment Amount</th>
                                    <th>Due Amount</th>

                                </tr>
                                {paymentReconciliationHistory.map((item, index) => {
                                    return <tr>
                                        <td>{index + 1}</td>
                                        <td style={{ wordBreak: "break-all" }}>{item.bookingRefNo}</td>
                                        <td>{item.supplierBookingCurrency}</td>
                                        <td>{item.supplierBookingAmount}</td>
                                        <td>{item.supplierReconciledAmount}</td>
                                        <td><Datecomp date={item.reconciliationDate} /></td>

                                        <td style={{ wordBreak: "break-all" }}>{item.reconciliationNarration}</td>
                                        <td>{item.paidAmount}</td>

                                        <td>{item.paymentAmount}</td>

                                        <td>{item.dueAmount}</td>



                                    </tr>
                                })
                                }
                            </table>


                        </>)}
                    </div>


                </div>
            </React.Fragment>
        )
    }
}
export default InvoicePrint;