import React, { Component } from "react";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Row from "./supplier-details-table-row";
import TableLoading from "../loading/table-loading";
import Datecomp from "../../helpers/date";
import Amount from "../../helpers/amount";

export class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            reconciliationDetails: [],
            isLoadingreconciliationDetails: false,
            showreconciliationDetails: false,
            isLoadingPayment: true,
        };
    }

    componentDidMount() {
        let reqURL =
            "reconciliation/supplier/invoice/payment?invoiceid=" +
            this.props.id.supplierInvoicesAndReconciliationId;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                data.response = data.response.sort((a, b) => (a.totalPaidAmount > b.totalPaidAmount) ? 1 : ((b.totalPaidAmount > a.totalPaidAmount) ? -1 : 0));
                this.setState({ data: data.response, isLoadingPayment: false });
            }.bind(this),
            "GET"
        );
    }
    setReconcilition(supplierInvoicePaymentDetailId) {
        this.setState({
            isLoadingreconciliationDetails: true,
            showreconciliationDetails: true,
            reconciliationDetails: [],
        });
        let reqURL =
            "reconciliation/supplier/invoice/reconciliation?invoiceid=" +
            this.props.id.supplierInvoicesAndReconciliationId +
            "&paymentdetailid=" +
            supplierInvoicePaymentDetailId;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                if (typeof data.response === "string") {
                    data.response = [];
                }
                this.setState({
                    reconciliationDetails: data.response,
                    isLoadingreconciliationDetails: false,
                });
            }.bind(this),
            "GET"
        );
    }
    closePopup = () => {
        this.setState({
            showreconciliationDetails: false,
        });
    };
    render() {
        const {
            reconciliationDetails,
            data,
            showreconciliationDetails,
            isLoadingreconciliationDetails,
            isLoadingPayment,
        } = this.state;
        const { id } = this.props
        return (
            <div className="w-100">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <button
                                onClick={this.props.backClick}
                                className="btn btn-primary float-right"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="row small mb-2">
                        <div className="col-md-3"><b>Invoice Number:&nbsp;</b>{id.invoiceNumber}</div>
                        <div className="col-md-3"><b>Net Invoice Amount:&nbsp;</b><Amount amount={id.invoiceNetAmount} currencyCode={id.invoiceCurrencyCode} /></div>
                        <div className="col-md-3"><b>Paid Amount:&nbsp;</b><Amount amount={(id.invoiceNetAmount - id.dueAmount)} currencyCode={id.invoiceCurrencyCode} /></div>
                        <div className="col-md-3"><b>Due Amount:&nbsp;</b><Amount amount={id.dueAmount} currencyCode={id.invoiceCurrencyCode} /></div>

                    </div>
                    <div className="table-responsive-lg border">
                        <table className="table small mb-0">
                            <thead className="thead-light">
                                <tr>
                                    {[
                                        "#",
                                        "Payment Date",
                                        "Paid By",
                                        "Paid Amount",
                                        "Total Paid Amount",
                                        "Due Amt",
                                        "Payment Details",
                                        "Reconciliation History",
                                    ].map((item) => {
                                        return <th scope="col">{item}</th>;
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    return (
                                        <Row
                                            data={item}
                                            index={index}
                                            setReconcilition={this.setReconcilition.bind(this)}
                                        />
                                    );
                                })}
                                {!isLoadingPayment && data.length === 0 && (
                                    <tr>
                                        <td className="text-center" colSpan={8}>
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                                {isLoadingPayment && <TableLoading columns={9} />}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showreconciliationDetails && (
                    <div>
                        <div className="model-popup  call-center-selection">
                            <div className="modal fade show d-block">
                                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title text-capitalize">
                                                Reconciliation History
                                            </h5>
                                            <button
                                                type="button"
                                                className="close"
                                                onClick={this.closePopup}
                                            >
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="container">
                                                <div className="table-responsive-lg border">
                                                    <table className="table small mb-0">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                {[
                                                                    "Booking Reference Number",
                                                                    "Supplier Booking Amount",
                                                                    "Reconciliation Amount",
                                                                    "Reconciliation Date",

                                                                    "Payment Amount",
                                                                    "Due Amount",
                                                                    "Comment",
                                                                ].map((item) => {
                                                                    return <th scope="col">{item}</th>;
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reconciliationDetails && reconciliationDetails.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>{item.bookingRefNo}</td>
                                                                        <td><Amount amount={item.supplierBookingAmount} currencyCode={item.supplierBookingCurrency} /></td>
                                                                        <td><Amount amount={item.supplierReconciledAmount} currencyCode={item.supplierReconciledCurrency} /></td>
                                                                        {/* <td>{item.conversionFactor}</td> */}
                                                                        <td><Datecomp date={item.reconciliationDate} /></td>
                                                                        <td><Amount amount={item.paymentAmount} currencyCode={item.supplierBookingCurrency} /></td>
                                                                        <td><Amount amount={item.dueAmount} currencyCode={item.supplierBookingCurrency} /></td>
                                                                        <td style={{ "word-break": "break-word" }}>{item.reconciliationNarration}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            {!isLoadingreconciliationDetails &&
                                                                reconciliationDetails.length === 0 && (
                                                                    <tr>
                                                                        <td className="text-center" colSpan={8}>
                                                                            No records found.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            {isLoadingreconciliationDetails && (
                                                                <TableLoading columns={8} />
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-backdrop fade show"></div>
                        </div>
                    </div>
                )}
            </div>
        );
        // return (
        //     <div>
        //         <div className="model-popup call-center-selection">
        //             <div className="modal fade show d-block">
        //                 <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        //                     <div className="modal-content">
        //                         <div className="modal-header">
        //                             <h5 className="modal-title text-capitalize">
        //                                 Customer Selection
        //                             </h5>
        //                             <button
        //                                 type="button"
        //                                 className="close"
        //                                 onClick={this.props.closePopup}
        //                             >
        //                                 <span aria-hidden="true">&times;</span>
        //                             </button>
        //                         </div>
        //                         <div className="modal-body">
        // <table className="table">
        //     <thead className="thead-light">
        //         <tr>
        //             {["#", "Invoice number", "Invoice Date", "Narration",
        //                 "Paid", "Due Amt", "Payment Amount"
        //             ].map((data) => {
        //                 return (<th scope="col">{data}</th>)
        //             })}
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {this.state.data.map((data, index) => {
        //             return (
        //                 <tr>
        //                     <td>{index}</td>
        //                 </tr>
        //             )
        //         })}
        //     </tbody>
        // </table>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="modal-backdrop fade show"></div>
        //         </div>

        //     </div>
        // )
    }
}

export default Dialog;
