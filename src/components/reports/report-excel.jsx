import React from "react";
import ReactExport from "react-export-excel";
import Datecomp from "../../helpers/date";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class ExcelExport extends React.Component {
    componentDidMount() {
        document.getElementById("excel").click();
        this.props.onExportComplete();
    }
    render() {
        let { data, reportType } = this.props;
        if(reportType === "sales-report"){
            return (
                <ExcelFile filename={"sales-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                    <ExcelSheet data={data} name="sales report">
                        <ExcelColumn label="Customer Details" value={(col) => col.customerName + " (" + col.cellPhone + ")"} />
                        <ExcelColumn label="Customer ID" value="customerId" />
                        <ExcelColumn label="Product" value="product" />
                        <ExcelColumn label="Booked by" value="agentName" />
                        <ExcelColumn label="Itinerary Reference Number" value="itineraryRefNo" />
                        <ExcelColumn label="Transaction Token" value="transactionToken" />
                        <ExcelColumn label="Booking ID" value="bookingID" />
                        <ExcelColumn label="Booking Date" value={(col) =>  Datecomp({ date: col.bookingDateTime, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Total Passengers" value="totalPassengers" />
                        <ExcelColumn label="Base Price" value={(col) => Amount({ amount: col.baseAmount.split(' ')[0], currencyCode: col.baseAmount.split(' ')[0] })} />
                        <ExcelColumn label="Tax" value={(col) => Amount({ amount: col.tax.split(' ')[0], currencyCode: col.tax.split(' ')[0] })} />
                        <ExcelColumn label="Fees" value={(col) => Amount({ amount: col.fees.split(' ')[0], currencyCode: col.fees.split(' ')[0] })} />
                        <ExcelColumn label="Discount Given if any" value={(col) => Amount({ amount: col.discountAmount.split(' ')[0], currencyCode: col.discountAmount.split(' ')[0] })} />
                        <ExcelColumn label="Total Booking Amount" value={(col) => Amount({ amount: col.totalBookingAmount.split(' ')[0], currencyCode: col.totalBookingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Paid Amount" value={(col) => Amount({ amount: col.paidAmount.split(' ')[0], currencyCode: col.paidAmount.split(' ')[0] })} />
                        <ExcelColumn label="Net Value" value={(col) => Amount({ amount: col.netAmount.split(' ')[0], currencyCode: col.netAmount.split(' ')[0] })} />
                        <ExcelColumn label="Cancelled" value="isCalcelled" />
                        <ExcelColumn label="Cancellation Charges" value={(col) => col.cancellationCharges ? Amount({ amount: col.cancellationCharges.split(' ')[0], currencyCode: col.cancellationCharges.split(' ')[0] }) : "--"} />
                        <ExcelColumn label="Refund" value={(col) => col.refund || (col.refund && parseFloat(col.refund)>0) ? Amount({ amount: col.refund.split(' ')[0], currencyCode: col.refund.split(' ')[0] }) : "--"} />
                    </ExcelSheet>
                </ExcelFile>
            );
        }
        else if(reportType === "revenue-report"){
            return (
                <ExcelFile filename={"revenue-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                    <ExcelSheet data={data} name="revenue report">
                        <ExcelColumn label="Customer Details" value={(col) => col.customerName + " (" + col.cellPhone + ")"} />
                        <ExcelColumn label="Customer ID" value="customerId" />
                        <ExcelColumn label="Itinerary Reference Number" value="itineraryRefNo" />
                        <ExcelColumn label="TransactionToken" value="transactionToken" />
                        <ExcelColumn label="Status" value="bookingStatus" />
                        <ExcelColumn label="Booking ID" value="bookingID" />
                        <ExcelColumn label="Booking Date" value={(col) =>  Datecomp({ date: col.bookingDateTime, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Booking Details" value="destination" />
                        <ExcelColumn label="Prodcut" value="product" />
                        <ExcelColumn label="Start Date" value={(col) =>  Datecomp({ date: col.startDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="End Date" value={(col) =>  Datecomp({ date: col.endDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Payment Mode" value="--" />
                        <ExcelColumn label="Cost Price" value={(col) => Amount({ amount: col.baseAmount.split(' ')[0], currencyCode: col.baseAmount.split(' ')[0] })} />
                        <ExcelColumn label="Tax" value={(col) => Amount({ amount: col.tax.split(' ')[0], currencyCode: col.tax.split(' ')[0] })} />
                        <ExcelColumn label="Transaction Fee" value="--" />
                        <ExcelColumn label="Selling Price" value={(col) => Amount({ amount: col.totalBookingAmount.split(' ')[0], currencyCode: col.totalBookingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Commission" value="--" />
                        <ExcelColumn label="Net Revenue" value={(col) => Amount({ amount: col.fees.split(' ')[0], currencyCode: col.fees.split(' ')[0] })} />
                        <ExcelColumn label="Cancel Fee" value={(col) => col.cancellationCharges ? Amount({ amount: col.cancellationCharges.split(' ')[0], currencyCode: col.cancellationCharges.split(' ')[0] }) : "--"} />
                    </ExcelSheet>
                </ExcelFile>
            );
        }
        else if(reportType === "outstanding-report"){
            return (
                <ExcelFile filename={"outstanding-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                    <ExcelSheet data={data} name="outstanding report">
                        <ExcelColumn label="Customer Details" value={(col) => col.customerName + " (" + col.cellPhone + ")"} />
                        <ExcelColumn label="Cusomer ID" value="customerId" />
                        <ExcelColumn label="Product" value="product" />
                        <ExcelColumn label="Booked by" value="agentName" />
                        <ExcelColumn label="Booking Date" value={(col) =>  Datecomp({ date: col.bookingDateTime, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Booking ID" value="bookingID" />
                        <ExcelColumn label="Status" value="bookingStatus" />
                        <ExcelColumn label="Start Date" value={(col) =>  Datecomp({ date: col.startDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="End Date" value={(col) =>  Datecomp({ date: col.endDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Total Passengers" value="totalPassengers" />
                        <ExcelColumn label="Destination" value="destination" />
                        <ExcelColumn label="Total Booking Amount" value={(col) => Amount({ amount: col.totalBookingAmount.split(' ')[0], currencyCode: col.totalBookingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Discount Given if any" value={(col) => Amount({ amount: col.discountAmount.split(' ')[0], currencyCode: col.discountAmount.split(' ')[0] })} />
                        <ExcelColumn label="Net Value" value={(col) => Amount({ amount: col.netAmount.split(' ')[0], currencyCode: col.netAmount.split(' ')[0] })} />
                        <ExcelColumn label="Paid Amount" value={(col) => Amount({ amount: col.paidAmount.split(' ')[0], currencyCode: col.paidAmount.split(' ')[0] })} />
                        <ExcelColumn label="Pending Amount" value={(col) => Amount({ amount: col.pandingAmount.split(' ')[0], currencyCode: col.pandingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Payment Due Date" value="--" />
                    </ExcelSheet>
                </ExcelFile>
            );
        }
        else if(reportType === "collection-report"){
            return (
                <ExcelFile filename={"collection-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                    <ExcelSheet data={data} name="collection report">
                        <ExcelColumn label="Customer Details" value={(col) => col.customerName + " (" + col.cellPhone + ")"} />
                        <ExcelColumn label="Customer ID" value="customerName" />
                        <ExcelColumn label="Product" value="product" />
                        <ExcelColumn label="Booking by" value="agentName" />
                        <ExcelColumn label="Booking Date" value={(col) =>  Datecomp({ date: col.bookingDateTime, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Booking ID" value="bookingID" />
                        <ExcelColumn label="Status" value="bookingStatus" />
                        <ExcelColumn label="Start Date" value={(col) =>  Datecomp({ date: col.startDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="End Date" value={(col) =>  Datecomp({ date: col.endDate, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Total Passengers" value="totalPassengers" />
                        <ExcelColumn label="Destination" value="destination" />
                        <ExcelColumn label="Total Booking Amount" value={(col) => Amount({ amount: col.totalBookingAmount.split(' ')[0], currencyCode: col.totalBookingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Discount Given if any" value={(col) => Amount({ amount: col.discountAmount.split(' ')[0], currencyCode: col.discountAmount.split(' ')[0] })} />
                        <ExcelColumn label="Net Amount" value={(col) => Amount({ amount: col.netAmount.split(' ')[0], currencyCode: col.netAmount.split(' ')[0] })} />
                        <ExcelColumn label="Initial Payment Due Date" value="--" />
                        <ExcelColumn label="Amount collected" value={(col) => Amount({ amount: col.paidAmount.split(' ')[0], currencyCode: col.paidAmount.split(' ')[0] })} />
                        <ExcelColumn label="Amount pending for collection" value={(col) => Amount({ amount: col.pandingAmount.split(' ')[0], currencyCode: col.pandingAmount.split(' ')[0] })} />
                        <ExcelColumn label="Final Collection Date" value="--" />
                        <ExcelColumn label="OverDue by Days" value="--" />
                    </ExcelSheet>
                </ExcelFile>
            );
        }
        else if(reportType === "leads-report"){
            return (
                <ExcelFile filename={"leads-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                    <ExcelSheet data={data} name="lead report">
                        <ExcelColumn label="Customer" value={(col) => col.nameoftheCustomer} />
                        <ExcelColumn label="Date Created" value={(col) =>  Datecomp({ date: col.DateCreated, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="No of passengers" value="noofpassengers" />
                        <ExcelColumn label="Product Type" value="productType" />
                        <ExcelColumn label="Opportunity Status" value="opportunityStatus" />
                        <ExcelColumn label="Opportunity Stage" value="opportunityStage" />
                        <ExcelColumn label="Opportunity Last Modified" value={(col) =>  Datecomp({ date: col.opportunityLastModified, format:Global.getEnvironmetKeyValue("DisplayDateFormate") })} />
                        <ExcelColumn label="Rs. Value" value={(col) => Amount({ amount: col.rsValue })} />
                        <ExcelColumn label="City" value={(col) => col.cityState} />
                        <ExcelColumn label="State/Country" value={(col) => col.country} />
                        <ExcelColumn label="Primary Contact" value={(col) => col.primaryContact} />
                        <ExcelColumn label="Email Address" value={(col) => col.emailAddress} />
                        <ExcelColumn label="Phone Number" value={(col) => col.phoneNumber} />
                        <ExcelColumn label="Remarks" value={(col) => col.remarks} />
                    </ExcelSheet>
                </ExcelFile>
            );
        }
    }
}

//Report - Export to excel
export default ExcelExport;