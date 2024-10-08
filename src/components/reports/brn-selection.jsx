import React, { Component } from "react";
import TableLoading from "../loading/table-loading";
import { Trans } from "./../../helpers/translate";
import Datecomp from "./../../helpers/date";
import Pagination from "./../../components/booking-management/booking-pagination";
import ReconciliationDetailFilters from "./reconciliationdetail-filters";
import Amount from "./../../helpers/amount";

class BRNSelection extends Component {
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
            selectedRecordIds.push(record.itineraryDetailID)
            selectedRecords.push(record);
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.itineraryDetailID);
            selectedRecordIds.splice(recordIndex, 1);
            selectedRecords.splice(recordIndex, 1);
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    checkAll = (e) => {
        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {
            let newSelectedRecordIds = this.props.result.filter((item) => { return selectedRecordIds.indexOf(item.itineraryDetailID) === -1 }).map((item) => { return item.itineraryDetailID });
            newSelectedRecordIds.map((recordId) => {
                selectedRecordIds.push(recordId);
                let record = this.props.result.filter((item) => { return item.itineraryDetailID === recordId })[0];
                selectedRecords.push(Object.assign(record, { ReconciliationAmount: 0 }));
            });
        } else {
            let recordIds = this.props.result.filter((item) => { return selectedRecordIds.indexOf(item.itineraryDetailID) > -1 }).map((item) => { return item.itineraryDetailID });
            recordIds.map((recordId) => {
                let recordIndex = selectedRecordIds.indexOf(recordId);
                selectedRecordIds.splice(recordIndex, 1);
                selectedRecords.splice(recordIndex, 1);

            });
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    selectedRecordIdsAmount = () => {
        return this.state.selectedRecords.reduce((sum, item) => { return sum + (isNaN(parseFloat(item.ReconciliationAmount)) ? 0 : parseFloat(item.ReconciliationAmount)) }, 0);
    }
    getBRNReconcileAmount = (itineraryDetailID) => {
        let itenary = this.state.selectedRecords.filter((item) => { return item.itineraryDetailID === itineraryDetailID });
        if (itenary.length > 0)
            return itenary[0].ReconciliationAmount;
        else return null;
    }
    ReconciliationAmountChange = (e, recordId) => {
        let Records = [...this.state.selectedRecords]
        let selectedRecord = Records.filter((item) => { return item.itineraryDetailID === recordId })[0];
        selectedRecord.ReconciliationAmount = e.target.value;
        this.setState({ selectedRecords: Records });
    }
    showSaveForm = () => {
        if (this.state.selectedRecords.length === 0) {
            this.setState({ isError: true, errorMessage: "Select atleast one invoice for receive payment." });
            return;
        }
        if (this.state.selectedRecords.filter((item) => { return !item.ReconciliationAmount || item.ReconciliationAmount <= 0 || isNaN(parseFloat(item.ReconciliationAmount)) }).length > 0) {
            let refNo = this.state.selectedRecords.filter((item) => { return !item.ReconciliationAmount || item.ReconciliationAmount <= 0 || isNaN(parseFloat(item.ReconciliationAmount)) })[0].bookingRef;
            this.setState({ isError: true, errorMessage: "Recieved Amount can not be less or equal to 0 or blank or text for BRN " + refNo });
            return;
        }
        if (this.state.selectedRecords.filter((item) => { return parseFloat(item.ReconciliationAmount) > item.dueAmount }).length > 0) {
            let refNo = this.state.selectedRecords.filter((item) => { return parseFloat(item.ReconciliationAmount) > item.dueAmount })[0].bookingRef;
            this.setState({ isError: true, errorMessage: "Recieved Amount can not be greater than due amount for BRN " + refNo });
            return;
        }
        let Amount = this.state.selectedRecords.reduce((sum, item) => { return sum + parseFloat(item.ReconciliationAmount) }, 0);
        this.props.showSaveForm(Amount, this.state.selectedRecords, "brnPayment", this.state.selectedRecordIds);
    }
    isCheckAll = () => {
        const RecordIds = this.props.result.map((item) => { return item.itineraryDetailID });
        const selectedRecordIds = this.state.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    handleFilters = (filters) => {
        this.props.handleFilters(filters);
        this.setState({
            selectedRecordIds: [],
            selectedRecords: []
        });
    }
    render() {
        let pageInfoIndex = [{ item: this.props.pageInfo }];
        const { selectedRecordIds } = this.state;
        const isAllChecked = this.isCheckAll();
        return (
            <React.Fragment>
                {
                    this.props.isFilters && (
                        <ReconciliationDetailFilters
                            filters={this.props.filters}
                            handleFilters={this.handleFilters}
                            showHideFilters={this.props.showHideFilters}
                            type={"BRN"}
                        />
                    )
                }
                <div className="row">
                    <div className="col-lg-8 mt-1">
                        {this.state.isError &&
                            <div className="text-danger">{this.state.errorMessage}</div>
                        }
                    </div>
                    <div className="col-lg-4 mt-1">
                        <button
                            className={`btn mr-2 float-right ${selectedRecordIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                            type="submit"
                            onClick={this.showSaveForm}
                            disabled={selectedRecordIds.length === 0}
                        >
                            {Trans("_next")}
                        </button>
                        <button
                            className="btn btn-secondary mr-2 float-right"
                            type="submit"
                            onClick={this.props.back}
                        >
                            {Trans("_previous")}
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

                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="table-responsive-lg">
                            <table className="table border small">
                                <thead className="thead-light">
                                    <tr>
                                        <th><input type="checkbox" checked={isAllChecked} onChange={(e) => { this.checkAll(e) }} /></th>
                                        <th >Invoice Number</th>
                                        <th >Invoice Date</th>
                                        <th >Invoice Amount</th>
                                        <th >Business</th>
                                        <th >Booking Reference Number</th>
                                        <th >Total Item Amount</th>
                                        <th >Due Amount</th>
                                        <th >Reconciliation Amount</th>
                                    </tr>
                                </thead>
                                {!this.props.isLoading && this.props.result.length === 0 &&
                                    <tr>
                                        <td className="text-center" colSpan={9}>
                                            No records found.
                                                </td>
                                    </tr>
                                }
                                {!this.props.isLoading && this.props.result.map((item) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="checkbox" checked={this.state.selectedRecordIds.indexOf(item.itineraryDetailID) > -1} onClick={(e) => { this.selectRecord(e, item) }} />
                                            </td>
                                            <td>{item.invoiceNumber}</td>
                                            <td><Datecomp date={item.invoiceDate} /></td>
                                            <td><Amount amount={item.invoiceNetAmount} currencyCode={item.bookingCurrency} /></td>
                                            <td>{item.business}</td>
                                            <td>{item.bookingRef}</td>
                                            <td><Amount amount={item.totalItemAmount} currencyCode={item.bookingCurrency} /></td>
                                            <td><Amount amount={item.dueAmount} currencyCode={item.bookingCurrency} /></td>
                                            <td>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div className="input-group-text">{item.bookingCurrency}</div>
                                                    </div>
                                                    <input type="number" style={{ minWidth: "75px" }} disabled={this.state.selectedRecordIds.indexOf(item.itineraryDetailID) === -1} className="form-control" value={this.getBRNReconcileAmount(item.itineraryDetailID)} onChange={(e) => { this.ReconciliationAmountChange(e, item.itineraryDetailID) }}></input>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {this.props.isLoading &&
                                    <TableLoading columns={9} />
                                }
                            </table>
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
export default BRNSelection;