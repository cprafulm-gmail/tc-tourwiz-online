

import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import Filters from "../../components/reports/supplier-invoice-payment-filter"
import Pagination from "../booking-management/booking-pagination";
import TableLoading from "../loading/table-loading";
import Datecomp from "../../helpers/date";
import PdfIcon from "../../assets/images/reports/pdf.png"
import PrintIcon from "../../assets/images/reports/print.png"

class InvoiceSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecordIds: this.props.selectedRecordIds,
            selectedRecords: this.props.selectedRecords,
            paymentType: "full",
            isError: false
        }

    }
    selectRecord = (e, record) => {
        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {

            selectedRecordIds.push(record.supplierInvoicesAndReconciliationId)
            selectedRecords.push(record);
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.supplierInvoicesAndReconciliationId);
            selectedRecordIds.splice(recordIndex, 1);
            selectedRecords.splice(recordIndex, 1);
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    checkAll = (e) => {

        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {
            let newSelectedRecordIds = this.props.result.filter((item) => { return item.dueAmount > 0 && selectedRecordIds.indexOf(item.supplierInvoicesAndReconciliationId) === -1 }).map((item) => { return item.supplierInvoicesAndReconciliationId });
            newSelectedRecordIds.map((recordId) => {
                selectedRecordIds.push(recordId);
                selectedRecords.push(this.props.result.filter((item) => { return item.supplierInvoicesAndReconciliationId === recordId })[0]);
            });
        } else {
            let recordIds = this.props.result.filter((item) => { return item.dueAmount > 0 && selectedRecordIds.indexOf(item.supplierInvoicesAndReconciliationId) > -1 }).map((item) => { return item.supplierInvoicesAndReconciliationId });
            recordIds.map((recordId) => {
                let recordIndex = selectedRecordIds.indexOf(recordId);
                selectedRecordIds.splice(recordIndex, 1);
                selectedRecords.splice(recordIndex, 1);

            });
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    selectedRecordIdsAmount = () => {
        return this.state.selectedRecords.reduce((sum, item) => { return sum + parseFloat(item.dueAmount) }, 0);
    }
    showSaveForm = (noValidate) => {
        if (!noValidate && this.state.selectedRecords.length === 0) {
            this.setState({ isError: true });
            return;
        }
        let Amount = this.state.selectedRecords.reduce((sum, item) => { return sum + parseFloat(item.dueAmount) }, 0);
        this.props.showSaveForm(Amount, this.state.selectedRecords, this.state.paymentType, this.state.selectedRecordIds);
    }
    changePaymentType = (type) => {
        this.setState({ paymentType: type })
        if (type === "partial") {
            let Amount = this.state.selectedRecords.reduce((sum, item) => { return sum + parseFloat(item.dueAmount) }, 0);
            this.props.showSaveForm(Amount, this.state.selectedRecords, type, this.state.selectedRecordIds);
        }
    }
    isCheckAll = () => {
        const RecordIds = this.props.result.filter((item) => { return item.dueAmount > 0 }).map((item) => { return item.supplierInvoicesAndReconciliationId });
        if (RecordIds.length === 0)
            return false;
        const selectedRecordIds = this.state.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    render() {
        const pageInfoIndex = [{ item: this.props.pageInfo }];
        const { selectedRecordIds } = this.state;
        const isAllChecked = this.isCheckAll();
        return (
            <React.Fragment>
                <Filters
                    isFilters={this.props.isFilters}
                    filters={this.props.filters}
                    handleFilters={this.props.handleFilters}
                    showHideFilters={this.props.showHideFilters}
                    status={this.props.status}
                />
                <div className="row">
                    <div className="col-sm-6  col-md-6 col-lg-6">
                        <button
                            className="btn mr-2 float-left btn-secondary"
                            type="submit"
                            onClick={() => this.props.RedirectToInvoiceList()}
                        >
                            Back To Invoices
                         </button>
                    </div>

                    <div className="col-sm-6  col-md-6 col-lg-6 mt-2">
                        <button
                            className={`btn mr-2 float-right ${selectedRecordIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            type="submit"
                            disabled={selectedRecordIds.length === 0}
                            onClick={() => this.changePaymentType("partial")}>
                            Pay Partial
                        </button>
                        <button
                            className={`btn mr-2 float-right ${selectedRecordIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            type="submit"
                            disabled={selectedRecordIds.length === 0}
                            onClick={() => this.showSaveForm()}
                        >
                            Pay Full
                        </button>

                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-lg-6">
                        <b>{selectedRecordIds.length === 0 ? "Select at least one record for pay." : `Total ${selectedRecordIds.length} record(s) selected.`}</b>
                    </div>
                    <div className="col-lg-6">
                        <div className="float-right mr-2">
                            <b>Total Amount : {this.selectedRecordIdsAmount()}</b>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className=" border-bottom pt-2 pb-2 ">
                            <div className="table-responsive-lg">
                                <table className="table border">
                                    <thead className="thead-light">
                                        <tr>
                                            <th><input checked={isAllChecked} type="checkbox" onChange={(e) => { this.checkAll(e) }} /></th>
                                            <th >Invoice Number</th>
                                            <th >Invoice Date</th>
                                            <th >Invoice Amount</th>
                                            <th >Paid Amount</th>
                                            <th >Due Amount</th>
                                            <th >Status</th>
                                            <th >Actions</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.props.isLoading && this.props.result.length === 0 &&
                                            <tr>
                                                <td className="text-center" colSpan={8}>
                                                    No records found.
                                                </td>
                                            </tr>
                                        }
                                        {!this.props.isLoading && this.props.result.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>
                                                        {item.dueAmount > 0 &&
                                                            <input type="checkbox" checked={this.state.selectedRecordIds.indexOf(item.supplierInvoicesAndReconciliationId) > -1} onChange={(e) => { this.selectRecord(e, item) }} />
                                                        }
                                                    </td>

                                                    <td>{item.invoiceNumber}</td>
                                                    <td><Datecomp date={item.invoiceDate} /></td>
                                                    <td> {item.invoiceCurrencyCode + " " + item.invoiceNetAmount}</td>
                                                    <td> {item.invoiceCurrencyCode + " " + (item.invoiceNetAmount - item.dueAmount)}</td>
                                                    <td> {item.invoiceCurrencyCode + " " + item.dueAmount}</td>
                                                    <td>{item.invoiceReconciliationStatus}</td>
                                                    <td>
                                                        <a onClick={() => { this.props.btnaction(item.supplierInvoicesAndReconciliationId, "Print") }} className="">
                                                            <img title="Print" style={{ cursor: "pointer" }} height={20} src={PrintIcon} />
                                                        </a>
                                                        <a onClick={() => { this.props.btnaction(item.supplierInvoicesAndReconciliationId, "PDF") }} className="ml-2">
                                                            <img title="PDF" style={{ cursor: "pointer" }} height={20} src={PdfIcon} />
                                                        </a>
                                                        {/* <button className="btn btn-primary btn-sm mr-1" onClick={() => { this.props.btnaction(item.supplierInvoicesAndReconciliationId, "Print") }}>Print</button>
                                                    <button className="btn btn-primary btn-sm" onClick={() => { this.props.btnaction(item.supplierInvoicesAndReconciliationId, "PDF") }}>Pdf</button> */}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {this.props.isLoading &&
                                            <TableLoading columns={8} />
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 report-pagination">
                        {!this.props.isLoading && this.props.result.length > 0 &&
                            <Pagination
                                pageInfoIndex={pageInfoIndex}
                                handlePaginationResults={this.props.handlePaginationResults}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default InvoiceSelection;