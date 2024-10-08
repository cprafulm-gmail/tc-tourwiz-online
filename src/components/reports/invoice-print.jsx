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
        this.props.actionHide();
    }
    render() {
        let printData = this.props.printData;
        let customerData = this.props.customerData;
        let userInfo = this.props.userInfo;
        const Business = Object.assign(...Global.getEnvironmetKeyValue("availableBusinesses").map(business => ({ [business.aliasId ? business.aliasId : business.id]: Trans("_" + business.name) })));
        return (
            <React.Fragment>
                <ReactToPrint
                    trigger={() => (
                        <button id="print" className="btn btn-primary btn-sm ml-2 pull-right">
                            Print
                        </button>
                    )}
                    content={() => this.componentRef}
                />

                <div ref={el => (this.componentRef = el)}>
                    <div className="invoicePrint" style={{ width: "90%", "word-wrap": "break-word", margin: "15px" }}>
                        <div style={{ marginTop: "10px" }}>
                            <table id="customerInfo" style={{ width: "100%", "word-wrap": "break-word" }}>
                                <tr>
                                    <td colSpan="2">
                                        <h3>Customer Information</h3>
                                    </td>
                                    <td colSpan="2">
                                        <h3>Agency Information</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Name:
                                    </td>
                                    <td>
                                        {customerData.firstName}
                                    </td>
                                    <td>
                                        Name:
                                    </td>
                                    <td>
                                        {printData.header.companyName}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email Address:
                                    </td>
                                    <td>
                                        {customerData.contactInformation.email ? customerData.contactInformation.email : '---'}
                                    </td>
                                    <td>
                                        Email Address:
                                    </td>
                                    <td>
                                        {printData.header.companyEmail}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Contact Phone:
                                    </td>
                                    <td>
                                        {customerData.contactInformation.phoneNumber}
                                    </td>
                                    <td>
                                        Contact Phone:
                                    </td>
                                    <td>
                                        {printData.header.companyPhone}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Address:
                                    </td>
                                    <td>
                                        {customerData.fullAddress}
                                    </td>
                                    <td>
                                        Address:
                                    </td>
                                    <td>
                                        {`${printData.header.companyAddress && printData.header.companyAddress.length > 0 ? printData.header.companyAddress : ""}
                                        ${printData.header.companyCity && printData.header.companyCity.length > 0 ? "," + printData.header.companyCity : ""}
                                        ${printData.header.companyState && printData.header.companyState.length > 0 ? "," + printData.header.companyState : ""}
                                        ${printData.header.companyCountry && printData.header.companyCountry.length > 0 ? "," + printData.header.companyCountry : ""}
                                        ${printData.header.companyPostalCode && printData.header.companyPostalCode.length > 0 ? "-" + printData.header.companyPostalCode : ""}.`}
                                    </td>
                                </tr>
                                {(customerData.gstNumber || printData.header.gstNumber) &&
                                    <tr>
                                        {customerData.gstNumber &&
                                            <React.Fragment>
                                                <td>
                                                    GST Number:
                                                </td>
                                                <td>
                                                    {customerData.gstNumber}
                                                </td>
                                            </React.Fragment>
                                        }
                                        {printData.header.gstNumber &&
                                            <React.Fragment>
                                                <td>
                                                    GST Number:
                                                </td>
                                                <td>
                                                    {printData.header.gstNumber}
                                                </td>
                                            </React.Fragment>
                                        }
                                    </tr>
                                }
                                {customerData.panNumber && <tr>
                                    <td>
                                        PAN Number:
                                    </td>
                                    <td>
                                        {customerData.panNumber}
                                    </td>
                                </tr>
                                }
                                {userInfo?.websiteURL &&
                                    <tr>
                                        <React.Fragment>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>Website:</td>
                                            <td>
                                                <a
                                                    href={userInfo?.websiteURL}
                                                    target="_blank"
                                                >{userInfo.websiteURL}
                                                </a>
                                            </td>
                                        </React.Fragment>
                                    </tr>}
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
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <h3 >Invoice Details</h3>
                            <div>
                                <table style={{ width: "100%" }}>
                                    <tr>
                                        <td><b>Number:</b></td>
                                        <td style={{ wordBreak: "break-all" }}>{printData.header.invoiceNumber}</td>
                                        <td><b>Date:</b></td>
                                        <td>{printData.header.invoiceDate ? <Datecomp date={printData.header.invoiceDate} /> : ""}</td>
                                        <td><b>Start Date:</b></td>
                                        <td>{printData.header.invoiceStartDate ? <Datecomp date={printData.header.invoiceStartDate} /> : ""}</td>
                                    </tr>
                                    <tr>
                                        <td><b>End Date</b></td>
                                        <td>{printData.header.invoiceEndDate ? <Datecomp date={printData.header.invoiceEndDate} /> : ""}</td>
                                        <td><b>Total Amount</b></td>
                                        <td>{printData.header.currency + " " + printData.header.invoiceTotalAmount}</td>
                                        <td><b>Tax Amount</b></td>
                                        <td>{printData.header.currency + " " + printData.header.invoiceTaxAmount}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Net Amount</b></td>
                                        <td>{printData.header.currency + " " + printData.header.invoiceNetAmount}</td>
                                        <td><b>Reconciliation Status</b></td>
                                        <td style={{ wordBreak: "break-all" }}>{printData.header.invoiceReconciliationStatus}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        {printData.itenary.length > 0 && (
                            <div style={{ marginTop: "10px" }}>
                                <h3 >Itinerary Details</h3>
                                <div>
                                    <table style={{ borderCollapse: "collapse", width: "100%" }} border={1}>
                                        <thead>
                                            <tr>
                                                <th>Reference Number</th>
                                                <th>Business</th>
                                                <th>Booking Amount</th>
                                                <th>Reconciliation Date</th>
                                                <th>Reconciliation Amount</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {printData.itenary.map((item) => {
                                                return <tr>
                                                    <td style={{ wordBreak: "break-all" }}>{item.bookingRef}</td>
                                                    <td>{Business[item.businessID]}</td>
                                                    <td>{item.bookingAmount ? item.bookingCurrency + " " + item.bookingAmount : ""}</td>
                                                    <td>{item.reconciliationDate ? <Datecomp date={item.reconciliationDate} /> : ""}</td>
                                                    <td>{item.reconciliationAmount ? item.bookingCurrency + " " + item.reconciliationAmount : ""}</td>
                                                    <td style={{ wordBreak: "break-all" }}>{item.comments}</td>
                                                </tr>
                                            })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        )}
                        {printData.paymentHistory.length > 0 && (<div style={{ marginTop: "10px" }}>
                            <h3 >Payment Details</h3>
                            <div>
                                <table style={{ borderCollapse: "collapse", width: "100%" }} border={1}>
                                    <thead>
                                        <tr>
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
                                    <tbody>
                                        {printData.paymentHistory.map((item) => {
                                            return <tr>
                                                <td>{item.paymentDate ? <Datecomp date={item.paymentDate} /> : ""}</td>
                                                <td>{item.paymentCurrency + " " + item.totalPaidAmount}</td>
                                                <td>{item.paymentCurrency + " " + item.dueAmount}</td>
                                                <td>{item.paymentCurrency + " " + item.paymentAmount}</td>
                                                <td>{item.paymentMode === "CreditCard" ? "Credit Card" : item.paymentMode === "DebitCard" ? "Debit Card" : item.paymentMode}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.transactionToken ? item.transactionToken : "--"}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.bankName ? item.bankName : "--"}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.branchName ? item.branchName : "--"}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.chequeNumber ? item.chequeNumber : "--"}</td>
                                                <td>{item.chequeDate ? <Datecomp date={item.chequeDate} /> : "--"}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + item.cardLastFourDigit : "--"}</td>
                                                <td style={{ wordBreak: "break-all" }}>{item.comment}</td>
                                            </tr>
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default InvoicePrint;