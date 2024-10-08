import React from "react";
import ReactExport from "react-export-excel";
import Datecomp from "../../helpers/date";
import Amount from "../../helpers/amount";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class InvoiceListExcel extends React.Component {
    componentDidMount() {
        document.getElementById("excel").click();
        this.props.onExportComplete();
    }
    render() {
        let { InvoiceList, isfrommanualinvoicelist } = this.props;
        let exportInvoiceList = InvoiceList.map((data) => {
            let item = { ...data };
            item.invoiceDate = Datecomp({ date: item.invoiceDate });
            item.invoiceDueDate = item.type === "Invoice" ? item.invoiceDueDate === "--" ? "" : Datecomp({ date: item.invoiceDueDate }) : "---";
            item.invoiceTotalAmount = item.type === "Invoice" ? Amount({ amount: item.invoiceTotalAmount, currencyCode: item.bookingCurrency }) : "---";
            item.paidAmount = item.type === "Invoice" ? Amount({ amount: item.paidAmount, currencyCode: item.bookingCurrency }) : "---";
            item.dueAmount = item.type === "Invoice" ? Amount({ amount: item.dueAmount, currencyCode: item.bookingCurrency }) : "---";
            item.bookingCurrency = item.type === "Invoice" ? item.bookingCurrency : "---";
            item.invoiceReconciliationStatus = item.type === "Invoice" ? item.invoiceReconciliationStatus : "---";
            return item;
        })

        return (
            <ExcelFile filename={this.props.filename ?? "List"} element={<button id="excel">Download</button>}>
                <ExcelSheet data={exportInvoiceList} name="Invoices">
                    <ExcelColumn label="Customer Name" value="customerName" />
                    <ExcelColumn label="Invoice/Voucher Date" value="invoiceDate" />
                    <ExcelColumn label="Invoice Due Date" value="invoiceDueDate" />
                    <ExcelColumn label="Invoice/Voucher Number" value="invoiceNumber" />
                    <ExcelColumn label="Invoice Currency" value="bookingCurrency" />
                    <ExcelColumn label="Total Amount" value="invoiceTotalAmount" />
                    <ExcelColumn label="Paid Amount" value="paidAmount" />
                    <ExcelColumn label="Due Amount" value="dueAmount" />
                    <ExcelColumn label="Status" value="invoiceReconciliationStatus" />
                </ExcelSheet>
            </ExcelFile>
        );


    }
}
export default InvoiceListExcel;