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
    let { data } = this.props;
    data = data.map((item, pindex) => {
      return item.brnDetails.map((brnitem, cindex) => {
        if (cindex == 0) {
          return {
            "rowNum": item.rowNum,
            "invoiceNumber": item.invoiceNumber,
            "invoiceDate": Datecomp({ date: item.invoiceDate }),
            "business": item.business === "Air" ? "Flight" : item.business,
            "bookingRefNo": brnitem.bookingRefNo,
            "customerName": brnitem.customerName,
            "invoiceNetAmount": item.invoiceNetAmount === 0 ? "---" : Amount({ amount: item.invoiceNetAmount, currencyCode: item.invoiceCurrencyCode }),
            /* "taxAmount" : Amount({ amount: item.taxAmount, currencyCode: item.invoiceCurrencyCode }), */
            "paidAmount": Amount({ amount: ((item.invoiceNetAmount * 1000 - item.dueAmount * 1000) / 1000), currencyCode: item.invoiceCurrencyCode }),
            "dueAmount": Amount({ amount: item.dueAmount, currencyCode: item.invoiceCurrencyCode }),
            "dueDate": item.dueDate ? Datecomp({ date: item.dueDate }) : "---",
            "invoiceReconciliationStatus": item.invoiceReconciliationStatus,
            "conversionFactor": parseFloat(brnitem.conversionFactor).toFixed(5),
            "supplierBookingCurrency": brnitem.supplierBookingCurrency,
            "comments": brnitem.comments,
            "paymentDate": brnitem.paymentDate ? Datecomp({ date: brnitem.paymentDate, }) : "---",
            "paymentMode": brnitem.paymentMode,
            "chequeDate": brnitem.chequeDate ? Datecomp({ date: brnitem.chequeDate }) : "---",
            "bankBranchName": brnitem.paymentMode === "Cheque" ? brnitem.chequeNumber + ", " + brnitem.chequeBank + ", " + brnitem.chequeBranch : (brnitem.paymentMode === "CreditCard" || brnitem.paymentMode === "DebitCard") ? brnitem.chequeBank : "---",
            "transactionRefNumber": brnitem.transactionRefNumber ? brnitem.transactionRefNumber : '---',
            "cardLastFourDigit": brnitem.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + brnitem.cardLastFourDigit : "---"
          }
        }
        else {
          return {
            "rowNum": "",
            "invoiceNumber": "",
            "invoiceDate": "",
            "business": "",
            "bookingRefNo": brnitem.bookingRefNo,
            "customerName": brnitem.customerName,
            "invoiceNetAmount": "",
            /* "taxAmount" : "", */
            "paidAmount": "",
            "dueAmount": "",
            "dueDate": "",
            "invoiceReconciliationStatus": "",
            "conversionFactor": parseFloat(brnitem.conversionFactor).toFixed(5),
            "supplierBookingCurrency": brnitem.supplierBookingCurrency,
            "comments": brnitem.comments,
            "paymentDate": brnitem.paymentDate ? Datecomp({ date: brnitem.paymentDate, }) : "---",
            "paymentMode": brnitem.paymentMode === "CreditCard" ? "Credit Card" : brnitem.paymentMode === "DebitCard" ? "Debit Card" : brnitem.paymentMode,
            "chequeDate": brnitem.chequeDate ? Datecomp({ date: brnitem.chequeDate }) : "---",
            "bankBranchName": brnitem.paymentMode === "Cheque" ? brnitem.chequeNumber + ", " + brnitem.chequeBank + ", " + brnitem.chequeBranch : (brnitem.paymentMode === "CreditCard" || brnitem.paymentMode === "DebitCard") ? brnitem.chequeBank : "---",
            "transactionRefNumber": brnitem.transactionRefNumber ? brnitem.transactionRefNumber : '---',
            "cardLastFourDigit": brnitem.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + brnitem.cardLastFourDigit : "---"
          }
        }
      });
    });
    data = data.flatMap(x => x);

    return (
      <ExcelFile
        filename={this.props.filename}
        element={<button id="excel">Download</button>}
      >
        <ExcelSheet data={data} name="SupplierInvoices">
          <ExcelColumn label={"Invoice Number"} value={"invoiceNumber"} />
          <ExcelColumn label={"Invoice Date"} value={"invoiceDate"} />
          <ExcelColumn label={"Business"} value={"business"} />
          <ExcelColumn label={"Booking Ref. No."} value={"bookingRefNo"} />
          <ExcelColumn label={"Customer Name"} value={"customerName"} />
          <ExcelColumn label={"Invoice Amount"} value={"invoiceNetAmount"} />
          {/* <ExcelColumn label={"Tax Amount"} value={"taxAmount"} /> */}
          <ExcelColumn label={"Paid Amount"} value={"paidAmount"} />
          <ExcelColumn label={"Due Amount"} value={"dueAmount"} />
          <ExcelColumn label={"Payment Due Date"} value={"dueDate"} />
          <ExcelColumn label={"Status"} value={"invoiceReconciliationStatus"} />
          <ExcelColumn label={"Conversion Rate"} value={"conversionFactor"} />
          <ExcelColumn
            label={"Booking Currency"}
            value={"supplierBookingCurrency"}
          />
          <ExcelColumn label={"Comments"} value={"comments"} />
          <ExcelColumn label={"Payment Date"} value={"paymentDate"} />
          <ExcelColumn label={"Payment Mode"} value={"paymentMode"} />
          <ExcelColumn label={"Cheque Date"} value={"chequeDate"} />
          <ExcelColumn label={"Cheque Number, Bank Name, Branch"} value={"bankBranchName"} />
          <ExcelColumn
            label={"Transaction No."}
            value={"transactionRefNumber"}
          />
          <ExcelColumn
            label={"Card Number"}
            value={"cardLastFourDigit"}
          />
        </ExcelSheet>
      </ExcelFile>
    );
  }
}
export default InvoiceListExcel;
