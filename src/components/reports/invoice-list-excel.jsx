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
        InvoiceList.map((item) => {
            item.invoiceDate = Datecomp({ date: item.invoiceDate });
            item.lastPaymentDate = item.lastPaymentDate === "--" ? "" : Datecomp({ date: item.lastPaymentDate });
            item.invoiceTotalAmount = Amount({ amount: item.invoiceTotalAmount, currencyCode: item.bookingCurrency });
            item.paidAmount = Amount({ amount: item.paidAmount, currencyCode: item.bookingCurrency });
            item.dueAmount = Amount({ amount: item.dueAmount, currencyCode: item.bookingCurrency });
        })

        return (
            <ExcelFile filename={this.props.filename} element={<button id="excel">Download</button>}>
                <ExcelSheet data={InvoiceList} name="Invoices">
                    <ExcelColumn label="Invoice Date" value="invoiceDate" />
                    <ExcelColumn label="Invoice Number" value="invoiceNumber" />
                    <ExcelColumn label="Invoice Currency" value="bookingCurrency" />
                    <ExcelColumn label="Total Amount" value="invoiceTotalAmount" />
                    <ExcelColumn label="Paid Amount" value="paidAmount" />
                    <ExcelColumn label="Due Amount" value="dueAmount" />
                    <ExcelColumn label="Last Payment Date" value="lastPaymentDate" />
                    <ExcelColumn label="Status" value="invoiceReconciliationStatus" />
                </ExcelSheet>
            </ExcelFile>
        );


    }
}
export default InvoiceListExcel;