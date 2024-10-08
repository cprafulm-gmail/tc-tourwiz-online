import React from "react";
import Datecomp from "../../helpers/date";
import XLSX from "xlsx"
import Amount from "../../helpers/amount";

class SupplierInvoiceReconcilationReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      BRNcolumns: [], BRNdata: []
    }
  }
  componentDidMount() {
    const { reconciliationDetails, paymentHistory, paymentReconciliationHistory, invoiceDetails } = this.props.InvoiceReport;
    const BRNcolumns = ["Booking Date", "Booking Ref.", "Reconciliation Status", "Booking Amount", "Supplier Amount", "Paid Amount", "Supplier Due Amount", "Reconciliation Date"];
    const BRNdata = reconciliationDetails.map((item) => {
      let BRNDataRow = [Datecomp({ date: item.bookingDate }), item.bookingRef, item.reconciliationStatus, Amount({ amount: item.supplierBookingAmount, currencyCode: item.supplierBookingCurrency }), Amount({ amount: item.supplierReconciledAmout, currencyCode: item.supplierReconciledCurrency }), Amount({ amount: item.paidAmount, currencyCode: item.supplierReconciledCurrency }), Amount({ amount: item.supplierDueAmount, currencyCode: item.supplierBookingCurrency }), Datecomp({ date: item.reconciliationDate })];
      if (item.reconciledPaymentList && item.reconciledPaymentList.length > 0) {
        item.reconciledPaymentList.map((payment, index) => {
          if (BRNcolumns.indexOf("Payment " + (index + 1)) < 0) {
            BRNcolumns.push("Payment " + (index + 1))
          }
          BRNDataRow.push(Amount({ amount: payment.paymentAmount, currencyCode: payment.supplierReconciledCurrency }));
        })
      }
      return BRNDataRow;
    });
    const paymentHistoryColumns = ["Sr.", "Payment Date", "Paid By", "Paid Amount", "Total Paid Amount", "Payment Datails"];
    const paymentHistoryData = paymentHistory.length === 1 && !paymentHistory[0].paymentMode ? [] : paymentHistory.map((item) => {
      let paymentMode = item.paymentMode === "CreditCard" ? "Credit Card": item.paymentMode === "DebitCard" ? "Debit Card" : item.paymentMode;
      return [item.rowNum, Datecomp({ date: item.paymentDate }), paymentMode, Amount({ amount: item.paymentAmount, currencyCode: item.invoiceCurrencyCode }), Amount({ amount: item.totalPaidAmount, currencyCode: item.invoiceCurrencyCode }), item.paymentMode === "Cheque" ? "Cheque Branch :" + item.chequeBranch : (item.paymentMode === "CreditCard" || item.paymentMode === "DebitCard") ? ("xxx-xxx-xxx-"+ item.cardLastFourDigit):"Transaction Ref Number :" + item.transactionRefNumber]
    })
    const paymentReconciliationHistoryColumns = ["Sr.", "Reconciliation Date", "Booking Ref. No.", "Supplier Booking Amount", "Supplier Reconciled Amount", "Conversion Factor", "Reconciliation Date", "Paid Amount", "Payment Amount", "Due Amount", "Comment"];
    const paymentReconciliationHistoryData = paymentReconciliationHistory.map((item, index) => {
      return [index + 1, Datecomp({ date: item.reconciliationDate }), item.bookingRefNo, Amount({ amount: item.supplierBookingAmount, currencyCode: item.supplierBookingCurrency }), Amount({ amount: item.supplierReconciledAmount, currencyCode: item.supplierReconciledCurrency }), "'" + parseFloat(item.conversionFactor).toFixed(5), Datecomp({ date: item.reconciliationDate }), Amount({ amount: item.paidAmount, currencyCode: item.supplierBookingCurrency }), Amount({ amount: item.paymentAmount, currencyCode: item.supplierBookingCurrency }), Amount({ amount: item.dueAmount, currencyCode: item.supplierBookingCurrency }), item.reconciliationNarration]
    })
    this.setState({ isLoading: false, BRNcolumns, BRNdata, paymentHistoryColumns, paymentHistoryData, paymentReconciliationHistoryColumns, paymentReconciliationHistoryData }, () => {
      this.getInvoiceReport(invoiceDetails.invoiceNumber);
    })
  }
  getInvoiceReport(filename) {
    const table = document.querySelector('#sheet1');
    const workbook1 = XLSX.utils.table_to_sheet(table);
    const table2 = document.querySelector('#sheet2');
    const workbook2 = XLSX.utils.table_to_sheet(table2);
    workbook1['!cols'] = [{ wpx: 100 }, { wpx: 170 }, { wpx: 125 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }];
    workbook2['!cols'] = [{ wpx: 50 }, { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }];
    workbook1['!printHeader'] = [1, 1]
    const workbook = {
      SheetNames: ['Reconcile Details', 'Invoice Payment Details'],
      Sheets: {
        'Reconcile Details': workbook1,
        "Invoice Payment Details": workbook2
      }
    };
    this.props.onReportDownloadComplete();
    return XLSX.writeFile(workbook, `ReconciliationReport-${filename}.xlsx`);
  }
  render() {
    const { isLoading, BRNcolumns, BRNdata, paymentHistoryColumns, paymentHistoryData, paymentReconciliationHistoryColumns, paymentReconciliationHistoryData } = this.state;
    const { invoiceDetails } = this.props.InvoiceReport;
    return isLoading === false ? (
      <div>
        <table id="sheet1">
          <thead>
            <tr>
              <th colSpan={8}>
                Reconcile Invoice ({invoiceDetails.invoiceNumber})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Invoice Number:</td>
              <td colSpan={2}>{invoiceDetails.invoiceNumber}</td>
              <td colSpan={2}>Invoice Net Amount:</td>
              <td colSpan={2}><Amount amount={invoiceDetails.invoiceNetAmount} currencyCode={invoiceDetails.currencyCode} /></td>
            </tr>
            <tr>
              <td colSpan={2}>Invoice Date:</td>
              <td colSpan={2}><Datecomp date={invoiceDetails.invoiceDate} /></td>
              <td colSpan={2}>Due Amount:</td>
              <td colSpan={2}><Amount amount={invoiceDetails.dueAmount} currencyCode={invoiceDetails.currencyCode} /></td>
            </tr>
            <tr>
              <td colSpan={2}>Invoice Duration:</td>
              <td colSpan={2}><Datecomp date={invoiceDetails.invoiceDurationStartDate} />-<Datecomp date={invoiceDetails.invoiceDurationEndDate} /></td>
              <td colSpan={2}>Invoice Status:</td>
              <td colSpan={2}>{invoiceDetails.invoiceStatus}</td>
            </tr>
            <tr></tr>
            <tr>
              <th colSpan={8}>
                Reconciliation Details
              </th>
            </tr>
            <tr>
              {BRNcolumns.map((item) => {
                return (<td>{item}</td>)
              })}
            </tr>
            {BRNdata.map((row) => {
              return (<tr>
                {
                  row.map((item) => {
                    return (<td>{item}</td>)
                  })
                }
              </tr>)
            })}
          </tbody>
        </table>
        <table id="sheet2">
          <thead>
            <tr>
              <th colSpan={8}>
                Reconcile Invoice ({invoiceDetails.invoiceNumber})
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>Invoice Number:</td>
              <td colSpan={2}>{invoiceDetails.invoiceNumber}</td>
              <td colSpan={2}>Invoice Net Amount:</td>
              <td colSpan={2}><Amount amount={invoiceDetails.invoiceNetAmount} currencyCode={invoiceDetails.currencyCode} /></td>
            </tr>
            <tr>
              <td colSpan={2}>Invoice Date:</td>
              <td colSpan={2}><Datecomp date={invoiceDetails.invoiceDate} /></td>
              <td colSpan={2}>Due Amount:</td>
              <td colSpan={2}><Amount amount={invoiceDetails.dueAmount} currencyCode={invoiceDetails.currencyCode} /></td>
            </tr>
            <tr>
              <td colSpan={2}>Invoice Duration:</td>
              <td colSpan={2}><Datecomp date={invoiceDetails.invoiceDurationStartDate} />-<Datecomp date={invoiceDetails.invoiceDurationEndDate} /></td>
              <td colSpan={2}>Invoice Status:</td>
              <td colSpan={2}>{invoiceDetails.invoiceStatus}</td>
            </tr>
            <tr></tr>
            <tr>
              <th colSpan={8}>
                Payment History
              </th>
            </tr>
            <tr>
              {paymentHistoryColumns.map((item) => {
                return (<td>{item}</td>)
              })}
            </tr>
            {paymentHistoryData.length === 0 ? <tr><td colSpan={6}>No record found.</td></tr> :
              paymentHistoryData.map((row) => {
                return (<tr>
                  {
                    row.map((item) => {
                      return (<td>{item}</td>)
                    })
                  }
                </tr>)
              })}
            <tr></tr>
            <tr>
              <th colSpan={8}>
                Reconciliation History
              </th>
            </tr>
            <tr>
              {paymentReconciliationHistoryColumns.map((item) => {
                return (<td>{item}</td>)
              })}
            </tr>
            {paymentReconciliationHistoryData.length === 0 ? <tr><td colSpan={11}>No record found.</td></tr> :
              paymentReconciliationHistoryData.map((row) => {
                return (<tr>
                  {
                    row.map((item) => {
                      return (<td>{item}</td>)
                    })
                  }
                </tr>)
              })}
          </tbody>
        </table>
      </div>
    ) : null;
  }
}
export default SupplierInvoiceReconcilationReport;