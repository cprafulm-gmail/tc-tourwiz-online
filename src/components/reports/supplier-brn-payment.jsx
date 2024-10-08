import React, { Component } from "react";
import TableLoading from "../loading/table-loading";
import { Trans } from "./../../helpers/translate";
import Datecomp from "./../../helpers/date";

class SupplierBRNPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecordIds: this.props.selectedRecordIds,
            selectedRecords: this.props.selectedRecords,
            isError: false
        }
    }
    selectRecord = (e, record) => {
        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {
            selectedRecordIds.push(record.itineraryDetailId)
            selectedRecords.push({ ...record });
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.itineraryDetailId);
            selectedRecordIds.splice(recordIndex, 1);
            selectedRecords.splice(recordIndex, 1);
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    checkAll = (e) => {
        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {
            let newSelectedRecordIds = this.props.result.filter((item) => { return item.supplierDueAmount > 0 && selectedRecordIds.indexOf(item.itineraryDetailId) === -1 }).map((item) => { return item.itineraryDetailId });
            newSelectedRecordIds.map((recordId) => {
                selectedRecordIds.push(recordId);
                let record = this.props.result.filter((item) => { return item.itineraryDetailId === recordId })[0];
                selectedRecords.push(Object.assign(record, { PaidAmount: "" }));
            });
        } else {
            let recordIds = this.props.result.filter((item) => { return selectedRecordIds.indexOf(item.itineraryDetailId) > -1 }).map((item) => { return item.itineraryDetailId });
            recordIds.map((recordId) => {
                let recordIndex = selectedRecordIds.indexOf(recordId);
                selectedRecordIds.splice(recordIndex, 1);
                selectedRecords.splice(recordIndex, 1);

            });
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    selectedRecordIdsAmount = () => {
        return this.state.selectedRecords.reduce((sum, item) => { return sum + (isNaN(parseFloat(item.PaidAmount)) ? 0 : parseFloat(item.PaidAmount)) }, 0);
    }
    getBRNReconcileAmount = (itineraryDetailId) => {
        let itenary = this.state.selectedRecords.filter((item) => { return item.itineraryDetailId === itineraryDetailId });
        if (itenary.length > 0)
            return itenary[0].PaidAmount;
        else return null;
    }
    PaidAmountChange = (e, recordId) => {
        let Records = [...this.state.selectedRecords]
        let selectedRecord = Records.filter((item) => { return item.itineraryDetailId === recordId })[0];
        selectedRecord.PaidAmount = e.target.value;
        this.setState({ selectedRecords: Records });
    }
    showSaveForm = () => {
        if (this.state.selectedRecords.length === 0) {
            this.setState({ isError: true, errorMessage: "Select atleast one Booking Reference Number for receive payment." });
            return;
        }
        if (this.state.selectedRecords.filter((item) => { return !item.PaidAmount || item.PaidAmount <= 0 || isNaN(parseFloat(item.PaidAmount)) }).length > 0) {
            let refNo = this.state.selectedRecords.filter((item) => { return !item.PaidAmount || item.PaidAmount <= 0 || isNaN(parseFloat(item.PaidAmount)) })[0].bookingRefNo;
            this.setState({ isError: true, errorMessage: "Paid Amount can not be less or equal to 0 or blank or text for BRN " + refNo });
            return;
        }
        if (this.state.selectedRecords.filter((item) => { return parseFloat(item.PaidAmount) > item.supplierDueAmount }).length > 0) {
            let refNo = this.state.selectedRecords.filter((item) => { return parseFloat(item.PaidAmount) > item.supplierDueAmount })[0].bookingRefNo;
            this.setState({ isError: true, errorMessage: "Paid Amount can not be greater than due amount for BRN " + refNo });
            return;
        }
        let Amount = this.state.selectedRecords.reduce((sum, item) => { return sum + parseFloat(item.PaidAmount) }, 0);
        this.props.showSaveForm(Amount, this.state.selectedRecords, "brnPayment", this.state.selectedRecordIds);
    }
    reset = () => {
        this.setState({ selectedRecordIds: [], selectedRecords: [], isError: "" })
    }
    isCheckAll = () => {
        const RecordIds = this.props.result.filter((item) => { return item.supplierDueAmount > 0 }).map((item) => { return item.itineraryDetailId });
        if (RecordIds.length === 0)
            return false;
        const selectedRecordIds = this.state.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    render() {
        const { selectedRecordIds, BRNTab } = this.state;
        const isAllChecked = this.isCheckAll();
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-1 mt-4">
                        <button
                            className="btn btn-secondary float-left"
                            type="submit"
                            onClick={() => this.props.back("InvoiceSelection")}
                        >
                            {Trans("_previous")}
                        </button>
                    </div>
                    <div className="col-lg-8 mt-4 d-flex flex-column justify-content-center align-items-center">
                        {this.state.isError &&
                            <span className="text-danger ml-3">{this.state.errorMessage}</span>
                        }
                    </div>
                    <div className="col-lg-3 mt-4">
                        <button
                            className={`btn mr-2 float-right ${selectedRecordIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            type="submit"
                            onClick={this.showSaveForm}
                            disabled={selectedRecordIds.length === 0}
                        >
                            {Trans("Pay")}
                        </button>
                        <button
                            className="btn btn-secondary mr-2 float-right"
                            type="submit"
                            onClick={this.reset}
                        >
                            {Trans("Reset")}
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
                <div className="mt-2">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="table-responsive-lg tableFixHead border">
                                <table className="table small">
                                    <thead className="bg-light">
                                        <tr>
                                            <th><input type="checkbox" checked={isAllChecked} onChange={(e) => { this.checkAll(e) }} /></th>
                                            <th >Sr. No.</th>
                                            <th >Invoice Number</th>
                                            <th >Invoice Date</th>
                                            <th >Booking Date</th>
                                            <th >Booking Ref. No.</th>
                                            <th >Due Amount</th>
                                            <th >Paid Amount</th>
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
                                        {!this.props.isLoading && this.props.result.map((item, index) => {
                                            return (

                                                <tr key={index}>
                                                    <td>
                                                        {item.supplierDueAmount > 0 &&
                                                            <input type="checkbox" checked={this.state.selectedRecordIds.indexOf(item.itineraryDetailId) > -1} onChange={(e) => { this.selectRecord(e, item) }} />
                                                        }
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{item.reconciliationInvoiceNo}</td>
                                                    <td><Datecomp date={item.reconciliationInvoiceDate} /></td>
                                                    <td><Datecomp date={item.bookingDate} /></td>
                                                    <td>{item.bookingRefNo}</td>
                                                    <td>{item.supplierReconciledCurrency + " " + item.supplierDueAmount}</td>
                                                    <td>
                                                        <div className="input-group input-group-sm">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text">{item.supplierReconciledCurrency}</div>
                                                            </div>
                                                            {this.state.selectedRecordIds.indexOf(item.itineraryDetailId) > -1 ?
                                                                <input type="number" style={{ minWidth: "75px" }} className="form-control" value={this.getBRNReconcileAmount(item.itineraryDetailId)} onChange={(e) => { this.PaidAmountChange(e, item.itineraryDetailId) }}></input>
                                                                : <input type="number" style={{ minWidth: "75px" }} className="form-control" value={""} disabled={true}></input>
                                                            }

                                                        </div>
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
                </div>
            </React.Fragment>
        )
    }
}
export default SupplierBRNPayment;