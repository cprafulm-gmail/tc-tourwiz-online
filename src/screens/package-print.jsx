import React, { Component } from "react";
import Datecomp from "../helpers/date";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import ReactToPrint from "react-to-print";
class InvoicePrint extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.printRef = React.createRef();
    }
    componentDidMount() {
        this.getPackageDetails(0);
        document.getElementById("print").click();
        this.props.actionHide();
    }
    getPackageDetails = (id) => {
        this.setState({ isLoading: true, isEditModeLoading: true });
        const reqOBJ = {};
        //let reqURL ="/cms/package/getbyid?id=" + id;
        let reqURL = "cms/package/getbyid?id=46303"
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                let data = resonsedata.response.package[0];
                data.termsConditions = resonsedata.response.package[0].termsConditions;
                data.description = resonsedata.response.package[0].description;
                data.packageName = resonsedata.response.package[0].shortDescription;
                data.images = resonsedata.response.images.map((item) => {
                    item["id"] = item.imageid;
                    item["isDefaultImage"] = false;
                    item["isDeleted"] = false;
                    item["fileExtension"] = "jpg";
                    item["fileURL"] = item.imagepath;
                    item["portalID"] = resonsedata.response.package[0].portalID;
                    delete item["createdby"];
                    delete item["createddate"];
                    delete item["updatedby"];
                    delete item["updateddate"];
                    delete item["specialpromotionimageid"];
                    delete item["specialpromotionid"];
                    return item;
                });
                data.inclusionExclusion = resonsedata.response.inclusionExclusion.map(
                    (item) => {
                        item["id"] = item.inclusionExclusionID;
                        item["isInclusion"] = item.isInclusion;
                        item["description"] = item.shortDescription;
                        item["isDeleted"] = false;
                        return item;
                    }
                );

                var obj = {};
                obj["imageid"] = 190824;
                obj["imagepath"] = resonsedata.response.package[0].smallImagePath;
                obj["isDefaultImage"] = true;
                obj["isDeleted"] = false;
                obj["id"] = resonsedata.response.package[0].smallImageID;
                obj["fileExtension"] = "jpg";
                obj["fileURL"] = resonsedata.response.package[0].smallImagePath;
                obj["portalID"] = resonsedata.response.package[0].portalID;
                data.images.push(obj);

                data.packageBrochure = [];
                if (resonsedata.response.package[0].brochureFileName) {
                    var objPDF = {};
                    objPDF["isDefaultImage"] = true;
                    objPDF["isDeleted"] = false;
                    objPDF["id"] = resonsedata.response.package[0].specialPromotionID;
                    objPDF["fileExtension"] = "pdf";
                    objPDF["fileURL"] = resonsedata.response.package[0].brochureFileName;
                    objPDF["portalID"] = resonsedata.response.package[0].portalID;
                    data.packageBrochure.push(objPDF);
                }
                if (resonsedata.response.package[0].twOthers) {
                    let supplierObj = JSON.parse(resonsedata.response.package[0].twOthers);
                    data["supplierCurrency"] = supplierObj.supplierCurrency;
                    data["conversionRate"] = supplierObj.conversionRate;
                    data["supplierCostPrice"] = supplierObj.supplierCostPrice;
                    data["supplierTaxPrice"] = supplierObj.supplierTaxPrice;
                    data["costPrice"] = supplierObj.costPrice;
                    data["markupPrice"] = supplierObj.markupPrice;
                    data["discountPrice"] = supplierObj.discountPrice;
                    data["CGSTPrice"] = supplierObj.CGSTPrice;
                    data["SGSTPrice"] = supplierObj.SGSTPrice;
                    data["IGSTPrice"] = supplierObj.IGSTPrice;
                    data["brn"] = supplierObj.brn;
                    data["bookBefore"] = supplierObj.bookBefore;
                }
                let bookingForInfo = JSON.parse(
                    sessionStorage.getItem("bookingForInfo")
                );

                data.customerName =
                    this.props.mode === "Edit"
                        ? this.props.customerName
                        : bookingForInfo && bookingForInfo.firstName
                            ? bookingForInfo.firstName + " " + (bookingForInfo.lastName ?? "")
                            : this.props.customerName || "";

                data.customerEmail =
                    this.props.mode === "Edit"
                        ? this.props.email
                        : bookingForInfo && bookingForInfo.contactInformation
                            ? bookingForInfo.contactInformation.email
                            : this.props.email || "";

                data.customerPhone =
                    this.props.mode === "Edit"
                        ? this.props.phone
                        : bookingForInfo && bookingForInfo.contactInformation
                            ? bookingForInfo.contactInformation.phoneNumber
                            : this.props.phone || "";
                this.setState(
                    { data, isLoading: false, isEditModeLoading: false },
                    () => {
                        if (this.state.data["countryID"])
                            this.getCityList(this.state.data["countryID"], true);
                    }
                );
            }.bind(this),
            "GET"
        );
    };
    render() {
        let printData = this.props.printData;
        let customerData = this.props.customerData;
        const Business = Object.assign(...Global.getEnvironmetKeyValue("availableBusinesses").map(business => ({ [business.aliasId ? business.aliasId : business.id]: Trans("_" + business.name) })));
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
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>
                                        Name:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Email Address:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>
                                        Email Address:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Contact Phone:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>
                                        Contact Phone:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Address:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>
                                        Address:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                </tr>
                                <tr>
                                    <React.Fragment>
                                        <td>
                                            GST Number:
                                        </td>
                                        <td>
                                            {"Praful Chauhan"}
                                        </td>
                                    </React.Fragment>
                                    <React.Fragment>
                                        <td>
                                            GST Number:
                                        </td>
                                        <td>
                                            {"Praful Chauhan"}
                                        </td>
                                    </React.Fragment>
                                </tr>
                                <tr>
                                    <td>
                                        Service Tax Number:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        Registration Number:
                                    </td>
                                    <td>
                                        {"Praful Chauhan"}
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                            </table>
                        </div>
                        {/* <div style={{ marginTop: "10px" }}>
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
                        )} */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default InvoicePrint;