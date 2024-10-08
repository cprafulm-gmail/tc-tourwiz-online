import React from "react";
import jsPDF from 'jspdf';
import { renderToString } from 'react-dom/server';
import Datecomp from "../../helpers/date";
import autoTable from "jspdf-autotable"

class InvoiceListPdf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.printRef = React.createRef();
    }
    componentDidMount() {
        let data = this.props.data
        let reconciliationDetails = data["reconciliationDetails"]
        let paymentReconciliationHistory = data["paymentReconciliationHistory"]
        let paymentHistory = data["paymentHistory"]
        paymentHistory = paymentHistory.length === 1 && !paymentHistory[0].paymentMode ? [] : paymentHistory;
        const pdf = new jsPDF("l");
        pdf.setFont("default", "bold");
        let x = 10;
        let y = 20;
        pdf.setFontSize(18);
        autoTable(pdf, {
            html: '#invoiceDetailslabel', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold', fontSize: 18 }
            }
        });
        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#invoiceDetails', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold' }
            }
        });
        y = pdf.lastAutoTable.finalY;
        if (reconciliationDetails && reconciliationDetails.length) {
            autoTable(pdf, {
                html: '#ReconciliationDetailsLabel', theme: "plain", startY: y + 5,
                columnStyles: {
                    0: { fontStyle: 'bold', fontSize: 18 }
                }
            });
            y = pdf.lastAutoTable.finalY;
            autoTable(pdf, {
                html: '#ReconciliationDetails', theme: "striped", startY: y, showHead: "everyPage",
                headerStyles: {
                    overflow: 'linebreak',
                },
                columnStyles: {
                    0: { minCellWidth: "5px" },
                    2: { minCellWidth: "15px" },
                }
            });
            y = pdf.lastAutoTable.finalY;
        }
        if (paymentHistory && paymentHistory.length > 0) {
            autoTable(pdf, {
                html: '#PaymentHistoryLabel', theme: "plain", startY: y + 5,
                // theme: "striped", startY: y, showHead: "everyPage",
                columnStyles: {
                    0: { fontStyle: 'bold', fontSize: 18 }
                }
            });
            y = pdf.lastAutoTable.finalY;
            autoTable(pdf, {
                html: '#PaymentHistory', theme: "striped", startY: y, showHead: "everyPage",
                // columnStyles: {
                //     0: { fontStyle: 'bold' }
                // }
            });
            y = pdf.lastAutoTable.finalY;
        }
        if (paymentReconciliationHistory && paymentReconciliationHistory.length > 0) {
            autoTable(pdf, {
                html: '#PaymentReconciliationHistoryLabel', theme: "plain", startY: y + 5,
                // theme: "striped", startY: y, showHead: "everyPage",
                columnStyles: {
                    0: { fontStyle: 'bold', fontSize: 18 }
                }
            });
            y = pdf.lastAutoTable.finalY;
            autoTable(pdf, {
                html: '#PaymentReconciliationHistory', theme: "striped", startY: y, showHead: "everyPage",
            });
        }



        pdf.save(this.props.data["invoiceDetails"]["invoiceNumber"]);
        this.props.onExportComplete();
    }

    Prints = () => {
        let data = this.props.data
        let invoiceDetails = data["invoiceDetails"]
        let reconciliationDetails = data["reconciliationDetails"]
        let paymentReconciliationHistory = data["paymentReconciliationHistory"]
        let paymentHistory = data["paymentHistory"]
        //this.props.customerData;
        return (
            <div style={{ width: "900px", "word-wrap": "break-word" }}>
                <table id="invoiceDetailslabel">
                    <tr>
                        <td>
                            Invoice Details
                         </td>
                    </tr>
                </table>
                <table id="invoiceDetails">
                    <tr>
                        <td>
                            <b> Invoice Number: </b>
                        </td>
                        <td>{invoiceDetails.invoiceNumber}</td>
                    </tr>
                    <tr>
                        <td>
                            <b> Net Amount: </b>
                        </td>
                        <td>{invoiceDetails.currencyCode + " "}{invoiceDetails.invoiceNetAmount}</td>
                    </tr>
                    <tr>
                        <td>
                            <b> Due Amount: </b>
                        </td>
                        <td> {invoiceDetails.currencyCode + " "}{invoiceDetails.dueAmount}</td>
                    </tr>
                    <tr>
                        <td>
                            <b> Invoice Date: </b>
                        </td>
                        <td> <Datecomp date={invoiceDetails.invoiceDate} /></td>
                    </tr>
                    <tr>
                        <td>
                            <b> Due Date: </b>
                        </td>
                        <td> <Datecomp date={invoiceDetails.dueDate} /></td>
                    </tr>
                    <tr>
                        <td>
                            <b> Start Date: </b>
                        </td>
                        <td> <Datecomp date={invoiceDetails.invoiceDurationStartDate} /></td>
                    </tr>
                    <tr>
                        <td>
                            <b> End Date: </b>
                        </td>
                        <td> <Datecomp date={invoiceDetails.invoiceDurationEndDate} /></td>
                    </tr>
                    <tr>
                        <td>
                            <b> Invoice Status:  </b>
                        </td>
                        <td> {" "}{invoiceDetails.invoiceStatus}</td>
                    </tr>
                </table>
                <table id="ReconciliationDetailsLabel">
                    <tr>
                        <td>
                            Reconciliation Details
                         </td>
                    </tr>
                </table>
                <table id="ReconciliationDetails"
                    style={{ marginTop: "10px", borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
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
                    {reconciliationDetails && reconciliationDetails.length > 0 &&
                        reconciliationDetails.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td><Datecomp date={item.bookingDate} /></td>
                                <td>{item.supplierName}</td>
                                <td>{item.supplierBookingCurrency}</td>
                                <td>{item.supplierBookingAmount}</td>
                                <td>
                                    {item.reconciliationDate ? <Datecomp date={item.reconciliationDate} /> : null}
                                </td>
                                <td>{item.reconciliationInvoiceNo}</td>

                                <td>{item.supplierReconciledAmout}</td>
                                <td>{item.paidAmount}</td>
                                <td>{item.supplierDueAmount}</td>
                                <td>{item.reconciliationInvoiceDate ? <Datecomp date={item.reconciliationInvoiceDate} /> : null}</td>
                                <td>{item.reconciliationStatus}</td>

                            </tr>
                        })
                    }
                </table>
                <table id="PaymentHistoryLabel">
                    <tr>
                        <td>
                            Payment History
                         </td>
                    </tr>
                </table>
                <table id="PaymentHistory" style={{ marginTop: "10px", borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
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
                    </thead>
                    {paymentHistory && paymentHistory.length > 0 &&
                        paymentHistory.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.invoiceNumber}</td>
                                <td><Datecomp date={item.invoiceDate} /></td>

                                <td>{item.paymentMode}</td>
                                <td>{item.paymentAmount}</td>
                                <td>
                                    {item.paymentDate ? <Datecomp date={item.paymentDate} /> : null}
                                </td>
                                <td>{item.transactionRefNumber}</td>

                                <td>{item.chequeNumber ? `Cheque Number:${item.chequeNumber},
                                Dt:${item.chequeDate},Bank: ${item.chequeBank},Branch:${item.chequeBranch}` : null}</td>
                                <td>{item.totalPaidAmount}</td>
                                <td>{item.dueAmount}</td>


                            </tr>
                        })
                    }
                </table>

                <table id="PaymentReconciliationHistoryLabel">
                    <tr>
                        <td>
                            Payment Reconciliation History
                         </td>
                    </tr>
                </table>
                <table id="PaymentReconciliationHistory" style={{ marginTop: "10px", borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
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
                    </thead>
                    {paymentReconciliationHistory.map((item, index) => {
                        return <tr>
                            <td>{index + 1}</td>
                            <td>{item.bookingRefNo}</td>
                            <td>{item.supplierBookingCurrency}</td>
                            <td>{item.supplierBookingAmount}</td>
                            <td>{item.supplierReconciledAmount}</td>
                            <td><Datecomp date={item.reconciliationDate} /></td>
                            <td>{item.reconciliationNarration}</td>
                            <td>{item.paidAmount}</td>
                            <td>{item.paymentAmount}</td>
                            <td>{item.dueAmount}</td>
                        </tr>
                    })
                    }
                </table>
            </div >

        )
    }


    render() {
        return (
            this.Prints()
        );
    }
}
export default InvoiceListPdf;