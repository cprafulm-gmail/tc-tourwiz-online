import React, { Component } from "react";
import Datecomp from "../../helpers/date";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import Amount from "../../helpers/amount";

const style = `<style>td {padding:3px}</style>`;

class InvoicePrint extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.printRef = React.createRef();
    }
    componentDidMount() {
        let printData = this.props.printData;
        const pdf = new jsPDF("l");
        pdf.setFont("default", "bold");
        let x = 10;
        let y = 20;
        pdf.setFontSize(18);

        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#customerInfo', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold' },
                2: { fontStyle: 'bold' }
            },
            createdCell: function (cell, data) {
                if (cell.row.index === 0) {
                    cell.cell.styles.fontSize = 18;
                }
            }
        });

        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#InvoiceDetailsLabel', theme: "plain", startY: y += 5,
            columnStyles: {
                0: { fontStyle: 'bold', fontSize: 18 }
            }
        });
        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#InvoiceDetails', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold' },
                2: { fontStyle: 'bold' },
                4: { fontStyle: 'bold' },
            }
        });
        y = pdf.lastAutoTable.finalY;
        if (printData.itenary && printData.itenary.length > 0) {
            autoTable(pdf, {
                html: '#ItenaryDetailsLabel', theme: "plain", startY: y += 5,
                columnStyles: {
                    0: { fontStyle: 'bold', fontSize: 18 }
                }
            });
            y = pdf.lastAutoTable.finalY;
            autoTable(pdf, {
                html: '#itenaryDetail', theme: "striped", startY: y, showHead: "everyPage"
            });
            y = pdf.lastAutoTable.finalY;
        }
        if (printData.paymentHistory && printData.paymentHistory.length > 0) {
            autoTable(pdf, {
                html: '#PaymentDetailsLabel', theme: "plain", startY: y += 5,
                columnStyles: {
                    0: { fontStyle: 'bold', fontSize: 18 }
                }
            });
            y = pdf.lastAutoTable.finalY;
            autoTable(pdf, {
                html: '#paymentHistory', theme: "striped", startY: y, showHead: "everyPage"
            });
        }
        pdf.save(this.props.printData.header.invoiceNumber);
        this.props.actionHide();
    }
    Prints = () => {
        let printData = this.props.printData;
        let customerData = this.props.customerData;
        let userInfo = this.props.userInfo;
        let companyDataArray = [];
        let customerDataArray = [];
        companyDataArray.push("companyName", "companyEmail", "companyPhone", "companyAddress", "gstNumber");
        customerDataArray.push("firstName", "email", "phoneNumber", "fullAddress", "gstNumber", "panNumber");
        const { print, customer } = this.state;
        let companyDataObject = companyDataArray.map(item => {
            if (item === "companyName" && printData.header.companyName) {
                return {
                    title: "Name",
                    data: printData.header.companyName,
                    type: "String"
                }
            }
            else if (item === "companyEmail" && printData.header.companyEmail) {
                return {
                    title: "Email Address",
                    data: printData.header.companyEmail,
                    type: "String"
                }
            }
            else if (item === "companyPhone" && printData.header.companyPhone) {
                return {
                    title: "Contact Phone",
                    data: printData.header.companyPhone,
                    type: "String"
                }
            }
            else if (item === "companyAddress" && printData.header.companyAddress) {
                return {
                    title: "Address",
                    data: `${printData.header.companyAddress && printData.header.companyAddress.length > 0 ? printData.header.companyAddress : ""}
                    ${printData.header.companyCity && printData.header.companyCity.length > 0 ? "," + printData.header.companyCity : ""}
                    ${printData.header.companyState && printData.header.companyState.length > 0 ? "," + printData.header.companyState : ""}
                    ${printData.header.companyCountry && printData.header.companyCountry.length > 0 ? "," + printData.header.companyCountry : ""}
                    ${printData.header.companyPostalCode && printData.header.companyPostalCode.length > 0 ? "-" + printData.header.companyPostalCode : ""}.`,
                    type: "String"
                }
            }
            else if (item === "gstNumber" && printData.header.gstNumber) {
                return {
                    title: "GST Number",
                    data: printData.header.gstNumber,
                    type: "String"
                }
            }
            else {
                return
            }
        })
        if (userInfo?.websiteURL) {
            companyDataObject.push({
                title: "Website",
                data: userInfo.websiteURL,
                type: "link"
            });
        }
        companyDataObject = companyDataObject.filter(Boolean);

        let customerDataObject = customerDataArray.map(item => {
            if (item === "firstName" && customerData.firstName) {
                return {
                    title: "Name",
                    data: customerData.firstName,
                    type: "String"
                }
            }
            else if (item === "email" && customerData.contactInformation.email) {
                return {
                    title: "Email Address",
                    data: customerData.contactInformation.email,
                    type: "String"
                }
            }
            else if (item === "phoneNumber" && customerData.contactInformation.phoneNumber) {
                return {
                    title: "Contact Phone",
                    data: customerData.contactInformation.phoneNumber,
                    type: "String"
                }
            }
            else if (item === "fullAddress") {
                return {
                    title: "Address",
                    data: customerData.fullAddress,
                    type: "String"
                }
            }
            else if (item === "gstNumber" && customerData.gstNumber) {
                return {
                    title: "GST Number",
                    data: customerData.gstNumber,
                    type: "String"
                }
            }
            else if (item === "panNumber" && customerData.panNumber) {
                return {
                    title: "PAN Number",
                    data: customerData.panNumber,
                    type: "String"
                }
            }
            else {
                return;
            }
        })
        customerDataObject = customerDataObject.filter(Boolean);
        const Business = Object.assign(...Global.getEnvironmetKeyValue("availableBusinesses").map(business => ({ [business.aliasId ? business.aliasId : business.id]: Trans("_" + business.name) })));
        return (
            <div style={{ width: "800px", "word-wrap": "break-word" }}>
                <table id="customerinforLabel">
                    <tr>
                        <td>
                            Customer Information
                        </td>
                    </tr>
                </table>
                <table id="supplierInfoLabel">
                    <tr>
                        <td>
                            Agency Information
                        </td>
                    </tr>
                </table>
                <table id="InvoiceDetailsLabel">
                    <tr>
                        <td>
                            Invoice Details
                        </td>
                    </tr>
                </table>
                <table id="ItenaryDetailsLabel">
                    <tr>
                        <td>
                            Itinerary Details
                        </td>
                    </tr>
                </table>
                <table id="PaymentDetailsLabel">
                    <tr>
                        <td>
                            Payment Details
                        </td>
                    </tr>
                </table>
                <table id="customerInfo" style={{ width: "50%", "word-wrap": "break-word" }}>
                    <tr>
                        <td colSpan="2">
                            Customer Information
                        </td>
                        <td colSpan="2">
                            Agency Information
                        </td>
                    </tr>
                    {[...Array(Math.max(customerDataObject.length, companyDataObject.length)).keys()].map((item, index) => {
                        return <tr>
                            <td>
                                {customerDataObject[index] ? customerDataObject[index].title : " "}
                            </td>
                            <td>
                                {customerDataObject[index] ? customerDataObject[index].data : " "}
                            </td>
                            <td>
                                {companyDataObject[index] ? companyDataObject[index].title : " "}
                            </td>
                            <td>
                                {companyDataObject[index] ?
                                    companyDataObject[index].type === "link" ? <a
                                        href={companyDataObject[index].data}
                                        target="_blank"
                                    >{userInfo.websiteURL}
                                    </a> : companyDataObject[index].data : " "}
                            </td>
                        </tr>
                    })}

                    {customerData.serviceTaxRegNumber && customerData.serviceTaxRegNumber !== "" &&
                        <tr>
                            <td>
                                Service Tax Number:
                            </td>
                            <td>
                                {customerData.serviceTaxRegNumber}
                            </td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>}
                    {customerData.registrationNumber && customerData.registrationNumber !== "" &&
                        <tr>
                            <td>
                                Registration Number:
                            </td>
                            <td>
                                {customerData.registrationNumber}
                            </td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    }
                </table>
                <table id="InvoiceDetails" style={{ width: "100%", "word-wrap": "break-word" }}>
                    <tr>
                        <td><b>Number:</b></td>
                        <td>{printData.header.invoiceNumber}</td>
                        <td><b>Date:</b></td>
                        <td>{printData.header.invoiceDate ? <Datecomp date={printData.header.invoiceDate} /> : ""}</td>
                        <td><b>Start Date:</b></td>
                        <td>{printData.header.invoiceStartDate ? <Datecomp date={printData.header.invoiceStartDate} /> : null}</td>
                    </tr>
                    <tr>
                        <td><b>End Date:</b></td>
                        <td>{printData.header.invoiceEndDate ? <Datecomp date={printData.header.invoiceEndDate} /> : ""}</td>
                        <td><b>Total Amount:</b></td>
                        <td><Amount amount={printData.header.invoiceTotalAmount} currencyCode={printData.header.currency} /></td>
                        <td><b>Tax Amount:</b></td>
                        <td><Amount amount={printData.header.invoiceTaxAmount} currencyCode={printData.header.currency} /></td>
                    </tr>
                    <tr>
                        <td><b>Net Amount:</b></td>
                        <td><Amount amount={printData.header.invoiceNetAmount} currencyCode={printData.header.currency} /></td>
                        <td><b>Reconciliation Status:</b></td>
                        <td>{printData.header.invoiceReconciliationStatus}</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
                <table id="itenaryDetail" style={{ borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
                            <th>Reference Number</th>
                            <th>Business</th>
                            <th>Booking Amount</th>
                            <th>Reconciliation Date</th>
                            <th>Reconciliation Amount</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    {printData.itenary && printData.itenary.map((item) => {
                        return <tr>
                            <td>{item.bookingRef}</td>
                            <td>{Business[item.businessID]}{item.businessID === 14 && item.customType ? " (" + item.customType + ")" : ""}</td>
                            <td>{item.bookingAmount >= 0 ? <Amount amount={item.bookingAmount} currencyCode={item.bookingCurrency} /> : ""}</td>
                            <td>{item.reconciliationDate ? <Datecomp date={item.reconciliationDate} /> : ""}</td>
                            <td>{item.reconciliationAmount >= 0 ? <Amount amount={item.reconciliationAmount} currencyCode={item.bookingCurrency} /> : ""}</td>
                            <td>{item.comments}</td>
                        </tr>
                    })
                    }
                </table>
                <table id="paymentHistory" style={{ borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
                            <th>Payment Date</th>
                            <th>Total Paid Amount</th>
                            <th>Due Amount</th>
                            <th>Payment Amount</th>
                            <th>Payment Mode</th>
                            <th>Transaction Number</th>
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>Cheque Number</th>
                            <th>Cheque Date</th>
                            <th>Card Number</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    {printData.paymentHistory && printData.paymentHistory.map((item) => {
                        return <tr>
                            <td>{item.paymentDate ? <Datecomp date={item.paymentDate} /> : ""}</td>
                            <td>{item.totalPaidAmount >= 0 ? <Amount amount={item.totalPaidAmount} currencyCode={item.bookingCurrency} /> : ""}</td>
                            <td>{item.dueAmount ? <Amount amount={item.dueAmount} currencyCode={item.bookingCurrency} /> : ""}</td>
                            <td>{item.paymentAmount >= 0 ? <Amount amount={item.paymentAmount} currencyCode={item.bookingCurrency} /> : ""}</td>
                            <td>{item.paymentMode === "CreditCard" ? "Credit Card" : item.paymentMode === "DebitCard" ? "Debit Card" : item.paymentMode}</td>
                            <td>{item.transactionToken ? item.transactionToken : "--"}</td>
                            <td>{item.bankName ? item.bankName : "--"}</td>
                            <td>{item.branchName ? item.branchName : "--"}</td>
                            <td>{item.chequeNumber ? item.chequeNumber : "--"}</td>
                            <td>{item.chequeDate ? <Datecomp date={item.chequeDate} /> : "--"}</td>
                            <td>{item.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + item.cardLastFourDigit : "--"}</td>
                            <td>{item.comment}</td>
                        </tr>
                    })}
                </table>
            </div >
        )
    }
    render() {
        return (
            this.Prints()
        )
    }
}
export default InvoicePrint;