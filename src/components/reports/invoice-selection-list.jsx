import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import ReconciliationDetailFilters from "./reconciliationdetail-filters";
import Pagination from "./../../components/booking-management/booking-pagination";
import TableLoading from "../loading/table-loading";
import Datecomp from "./../../helpers/date";
import PdfIcon from "../../assets/images/reports/pdf.png";
import PrintIcon from "../../assets/images/reports/print.png";
import Amount from "./../../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";

class InvoiceSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecordIds: this.props.selectedRecordIds,
            selectedRecords: this.props.selectedRecords,
            paymentType: "full",
            isError: false,
            isshowauthorizepopup: false,
        }
    }

    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    selectRecord = (e, record) => {
        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {

            selectedRecordIds.push(record.agentCustomerInvoiceID)
            selectedRecords.push(record);
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.agentCustomerInvoiceID);
            selectedRecordIds.splice(recordIndex, 1);
            selectedRecords.splice(recordIndex, 1);
        }
        this.setState({ selectedRecordIds, selectedRecords, isError: false });
    }
    checkAll = (e) => {

        let selectedRecordIds = this.state.selectedRecordIds;
        let selectedRecords = this.state.selectedRecords;
        if (e.target.checked) {
            let newSelectedRecordIds = this.props.result.filter((item) => { return item.dueAmount > 0 && selectedRecordIds.indexOf(item.agentCustomerInvoiceID) === -1 }).map((item) => { return item.agentCustomerInvoiceID });
            newSelectedRecordIds.map((recordId) => {
                selectedRecordIds.push(recordId);
                selectedRecords.push(this.props.result.filter((item) => { return item.agentCustomerInvoiceID === recordId })[0]);
            });
        } else {
            let recordIds = this.props.result.filter((item) => { return item.dueAmount > 0 && selectedRecordIds.indexOf(item.agentCustomerInvoiceID) > -1 }).map((item) => { return item.agentCustomerInvoiceID });
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
        } else if (type === "additionals") {
            this.props.showAdditionals();
        }
    }
    handleFilters = (filters) => {
        this.props.handleFilters(filters);
        this.setState({
            selectedRecordIds: [],
            selectedRecords: []
        });
    }
    isCheckAll = () => {
        const RecordIds = this.props.result.filter((item) => { return item.dueAmount > 0 }).map((item) => { return item.agentCustomerInvoiceID });
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
                {
                    this.props.isFilters && (
                        <ReconciliationDetailFilters
                            filters={this.props.filters}
                            handleFilters={this.handleFilters}
                            showHideFilters={this.props.showHideFilters}
                            type={"Invoice"}
                        />
                    )
                }
                <div className="row">
                    <div className="col-sm-6  col-md-6 col-lg-6 mt-2">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <AuthorizeComponent title="CustomerReconciliation~reconciliation-paybyinvoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                <button type="button" onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-paybyinvoice") ? this.changePaymentType("full") : this.setState({ isshowauthorizepopup: true })} className={`btn ${this.state.paymentType === "full" ? 'btn-primary active' : 'btn-secondary'}`}>Pay by Invoices</button>
                            </AuthorizeComponent>
                            <AuthorizeComponent title="CustomerReconciliation~reconciliation-paybybrn" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                <button type="button" onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-paybybrn") ? this.changePaymentType("partial") : this.setState({ isshowauthorizepopup: true })} className={`btn ${this.state.paymentType === "partial" ? 'btn-primary active' : 'btn-secondary'}`}>Pay by BRNs</button>
                            </AuthorizeComponent>
                            <AuthorizeComponent title="CustomerReconciliation~reconciliation-payadditionals" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                <button type="button" onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-payadditionals") ? this.changePaymentType("additionals") : this.setState({ isshowauthorizepopup: true })} className={`hide-notes btn ${this.state.paymentType === "additionals" ? 'btn-primary active' : 'btn-secondary'}`}>Pay Additionals</button>
                            </AuthorizeComponent>
                        </div>
                    </div>

                    <div className="col-sm-6  col-md-6 col-lg-6 mt-2">
                        <AuthorizeComponent title="CustomerReconciliation~reconciliation-next" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                            <button
                                className={`btn mr-2 float-right ${selectedRecordIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                                type="submit"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-next") ? this.showSaveForm() : this.setState({ isshowauthorizepopup: true })}
                                disabled={selectedRecordIds.length === 0}
                            >
                                {Trans("_next")}
                            </button>
                        </AuthorizeComponent>
                    </div>
                </div>
                <div className="row mt-2">
                    <AuthorizeComponent title="CustomerReconciliation~reconciliation-next" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                        <div className="col-lg-6">
                            <b>{selectedRecordIds.length === 0 ? "Please select at least one record to pay." : `Total ${selectedRecordIds.length} record(s) selected.`}</b>
                        </div>
                        <div className="col-lg-6">
                            <div className="float-right mr-2">
                                <b>Total Amount : {this.selectedRecordIdsAmount()}</b>
                            </div>
                        </div>
                    </AuthorizeComponent>
                </div>

                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table border small table-column-width">
                                <thead className="thead-light">
                                    <tr>
                                        <th width="30px"><AuthorizeComponent title="CustomerReconciliation~reconciliation-next" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}><input checked={isAllChecked} type="checkbox" onChange={(e) => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-next") ? this.checkAll(e) : this.setState({ isshowauthorizepopup: true }) }} /></AuthorizeComponent></th>
                                        {[
                                            "Customer Name", "Date of Booking", "Invoice Number", "Hotel Reference Number / PNR",
                                            "Business", "Base Value", "Taxes", "Service Charges", "Discount", "Net Value", "Paid Amount",
                                            "Due Amount", "Booking Currency", "Rate of Exchange", "Status", "Payment Mode", "Payment Date",
                                            "Cheque Date", "Cheque Number, Bank Name, Branch", "Transaction No", "Card Number", "Actions"
                                        ].map((data, index) => {
                                            return (<th width={table_column_width[data]} key={index} scope="col">{data}</th>)
                                        })}
                                    </tr>
                                </thead>
                                {!this.props.isLoading && this.props.result.length === 0 &&
                                    <tr>
                                        <td className="text-center" colSpan={8}>
                                            No records found.
                                        </td>
                                    </tr>
                                }
                                {!this.props.isLoading && this.props.result.map((item) => {
                                    return (
                                        <tr>
                                            <td>
                                                <AuthorizeComponent title="CustomerReconciliation~reconciliation-next" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                                    {item.dueAmount > 0 &&
                                                        <input type="checkbox" checked={this.state.selectedRecordIds.indexOf(item.agentCustomerInvoiceID) > -1} onClick={(e) => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerReconciliation~reconciliation-next") ? this.selectRecord(e, item) : this.setState({ isshowauthorizepopup: true }) }} />
                                                    }
                                                </AuthorizeComponent>
                                            </td>
                                            <td style={{ "word-break": "break-word" }}>{item.customerName}</td>
                                            <td><Datecomp date={item.invoiceDate} /></td>
                                            <td>{item.invoiceNumber}</td>
                                            <td style={{ "word-break": "break-word" }}>{item.brnDetails.map((brnitem, key) => {
                                                return <React.Fragment> {(key > 0 ? <br /> : '')} {brnitem.bookingRef}</React.Fragment>
                                            })
                                            }
                                            </td>
                                            <td>{item.brnDetails.map((brnitem, key) => {
                                                return <React.Fragment> {(key > 0 ? <br /> : '')} {brnitem.business}</React.Fragment>
                                            })
                                            }</td>
                                            <td>{<Amount amount={item["invoiceNetAmount"]} />}</td>
                                            <td>{item.brnDetails && item.brnDetails.length > 0 ? item.brnDetails[0].taxes ? <Amount amount={item.brnDetails[0].taxes} /> : <Amount amount={0} /> : <Amount amount={0} />}</td>
                                            <td>{item.brnDetails && item.brnDetails.length > 0 ? item.brnDetails[0]["service Charges"] ? <Amount amount={item.brnDetails[0]["service Charges"]} /> : <Amount amount={0} /> : <Amount amount={0} />}</td>
                                            <td>{item.brnDetails && item.brnDetails.length > 0 ? item.brnDetails[0]["discount"] ? <Amount amount={item.brnDetails[0]["discount"]} /> : <Amount amount={0} /> : <Amount amount={0} />}</td>
                                            <td>{<Amount amount={item["invoiceNetAmount"]} />}</td>
                                            <td>{<Amount amount={item["paidAmount"]} />}</td>
                                            <td>{<Amount amount={item["dueAmount"]} />}</td>
                                            <td>{item.bookingCurrency}</td>
                                            <td>{item.brnDetails && item.brnDetails.length > 0 ? item.brnDetails[0]["rate of Exchange"] ? parseFloat(item.brnDetails[0]["rate of Exchange"]).toFixed(5) : '---' : '---'}</td>
                                            <td>{item.invoiceReconciliationStatus}</td>
                                            <td>{item.paymentMode !== undefined ? item.paymentMode === "CreditCard" ? "Credit Card" : item.paymentMode === "DebitCard" ? "Debit Card" : item.paymentMode : "--"}</td>
                                            <td>{item.lastPaymentDate && item.lastPaymentDate != "0001-01-01T00:00:00" ? <Datecomp date={item.lastPaymentDate} /> : "--"}</td>
                                            <td>{item.paymentMode !== undefined && item.paymentMode === "Cheque" && item.chequeDate && item.chequeDate != "0001-01-01T00:00:00" ? <Datecomp date={item.chequeDate} /> : "--"}</td>
                                            <td style={{ "word-break": "break-word" }}>{(item.paymentMode === "Cheque" && item.bankName !== "" && item.bankName !== undefined && item.branchName !== undefined && item.chequeNumber !== undefined) ? (item.chequeNumber + ", " + item.bankName + ", " + item.branchName) : (item.paymentMode === "CreditCard" || item.paymentMode === "DebitCard") ? item.bankName : "--"}</td>
                                            <td style={{ "word-break": "break-word" }}>{item.transactionToken !== undefined && item.transactionToken !== "" ? item.transactionToken : "--"}</td>
                                            <td style={{ "word-break": "break-word" }}>{item.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + item.cardLastFourDigit : "---"}</td>
                                            <td>
                                                {/* <button className="btn btn-primary btn-sm mr-1" onClick={() => { this.props.btnaction(item.agentCustomerInvoiceID, "Print") }}>Print</button> */}
                                                {/* <button className="btn btn-primary btn-sm" onClick={() => { this.props.btnaction(item.agentCustomerInvoiceID, "PDF") }}>Pdf</button> */}
                                                <div>
                                                    <AuthorizeComponent title="CustomerReconciliation~reconciliation-download-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                                        <a onClick={() => { this.props.btnaction(item.agentCustomerInvoiceID, "Print") }} className="m-1">
                                                            <img title="Print" style={{ cursor: "pointer" }} height={20} src={PrintIcon} />                                                    </a>
                                                        <a onClick={() => { this.props.btnaction(item.agentCustomerInvoiceID, "PDF") }} className="m-1">
                                                            <img title="PDF" style={{ cursor: "pointer" }} height={20} src={PdfIcon} />                                                    </a>
                                                    </AuthorizeComponent>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {this.props.isLoading &&
                                    <TableLoading columns={22} />
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
                    {this.state.isshowauthorizepopup &&
                        <ModelPopupAuthorize
                            header={""}
                            content={""}
                            handleHide={this.hideauthorizepopup}
                            history={this.props.history}
                        />
                    }
                </div>
            </React.Fragment>
        )
    }
}

const table_column_width = {
    "Customer Name": 150,
    "Date of Booking": 80,
    "Invoice Number": 130,
    "Hotel Reference Number / PNR": 200,
    "Business": 100,
    "Base Value": 120,
    "Taxes": 100,
    "Service Charges": 100,
    "Discount": 100,
    "Net Value": 120,
    "Paid Amount": 120,
    "Due Amount": 120,
    "Booking Currency": 80,
    "Rate of Exchange": 100,
    "Status": 100,
    "Payment Mode": 100,
    "Payment Date": 80,
    "Cheque Date": 80,
    "Cheque Number, Bank Name, Branch": 150,
    "Transaction No": 150,
    "Card Number": 150,
    "Actions": 100
}

export default InvoiceSelection;