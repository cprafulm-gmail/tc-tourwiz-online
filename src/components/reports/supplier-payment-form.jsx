import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import { PaymentMode } from "../../helpers/dropdown-list";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import moment from 'moment';
import MessageBar from '../admin/message-bar';
class SupplierPaymentInfoForm extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PaymentAmount: this.props.Amount,
                PaymentMode: "Cash",
                TransactionNumber: "",
                ChequeBank: "",
                ChequeBranch: "",
                ChequeNumber: "",
                ChequeDate: moment(new Date()).format("YYYY-MM-DD"),
                PaymentDate: moment(new Date()).format("YYYY-MM-DD"),
                CardLastFourDigit: "",
                Comment: ""
            }, errors: {},
            saveError: "",
            isLoading: false
        };
    }
    saveReconciliation = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isLoading: true });
        let reqURL = "reconciliation/supplier/invoices/payment/add";
        let reqOBJ = { ...this.props.headerData };
        reqOBJ.PaymentDetails = {
            ...this.state.data, ...{ CreatedBy: this.props.headerData.CreatedBy }
        }
        if (reqOBJ.PaymentDetails.PaymentMode === "Cheque" || reqOBJ.PaymentDetails.PaymentMode === "CreditCard" || reqOBJ.PaymentDetails.PaymentMode === "DebitCard") {
            reqOBJ.PaymentDetails.TransactionToken = "";
        } else {
            reqOBJ.PaymentDetails.BankName = "";
            reqOBJ.PaymentDetails.BranchName = "";
            reqOBJ.PaymentDetails.ChequeNumber = "";
            reqOBJ.PaymentDetails.ChequeDate = "";
            reqOBJ.PaymentDetails.CardLastFourDigit = "";
        }
        if (reqOBJ["CreatedBy"])
            delete reqOBJ["CreatedBy"];
        if (this.props.paymentType === "full") {
            reqOBJ.SelectedInvoices = this.props.SelectedRecords.map((item) => { return item.supplierInvoicesAndReconciliationId });
        }
        else {
            let BRNList = [...this.props.SelectedRecords];
            reqOBJ.ItineraryDetails = BRNList.map((item) => {
                return this.createItenaryDetail(item, reqOBJ.PaymentDetails);
            });
        }
        apiRequester_unified_api(reqURL, { "Request": reqOBJ }, function (data) {
            if (data.response && data.response.status === "Payment done successfully") {
                this.setState({
                    isLoading: false
                });
                this.setState({ showSuccessMessage: true });
            } else {
                this.setState({
                    isLoading: false, isSaveError: true, saveError: data.error
                });
            }
        }.bind(this), "POST")

    }
    createItenaryDetail = (item, PaymentDetails) => {
        return {
            PortalAgentId: item.portalAgentId,
            ItineraryDetailId: item.itineraryDetailId,
            BookingRefNo: item.bookingRefNo,
            BusinessId: item.businessId,
            SupplierName: item.supplierName,
            SupplierBookingAmount: item.supplierBookingAmount,
            SupplierBookingCurrency: item.supplierBookingCurrency,
            SupplierReconciledAmount: item.supplierReconciledAmount,
            SupplierReconciledCurrency: item.supplierReconciledCurrency,
            TotalPaidAmount: parseFloat(item.paidAmount) + parseFloat(item.PaidAmount),
            PaidAmount: parseFloat(item.PaidAmount),
            ConversionFactor: item.conversionFactor,
            ReconciliationDate: PaymentDetails.PaymentDate,
            ReconciliationInvoiceNo: item.reconciliationInvoiceNo,
            ReconciliationInvoiceDate: item.reconciliationInvoiceDate,
            CreatedBy: item.createdBy,
            UpdatedBy: item.updatedBy,
            SupplierId: item.supplierId,
            SupplierInvoicesAndReconciliationId: item.supplierInvoicesAndReconciliationID,
            SupplierReconciliationId: item.supplierReconciliationId
        }
    }
    validate = () => {
        const errors = {};
        const { data } = this.state;

        if (!this.validateFormData(data.PaymentDate, "require_date"))
            errors.PaymentDate = "Payment Date required";

        if (!this.validateFormData(data.ReconciliationDate, "require_date"))
            errors.ReconciliationDate = "Reconciliation Date required";


        if (!this.validateFormData(data.PaymentMode, "require"))
            errors.PaymentMode = "Payment Mode required";

        if (data.PaymentMode === "Cheque") {
            if (!this.validateFormData(data.ChequeBank, "require"))
                errors.ChequeBank = "Bank Name required";
            else if (data.ChequeBank && !this.validateFormData(data.ChequeBank, "special-characters-not-allowed", /[<>]/))
                errors.ChequeBank = "< and > characters not allowed";
            if (!this.validateFormData(data.ChequeBranch, "require"))
                errors.ChequeBranch = "Branch Name required";
            else if (data.ChequeBranch && !this.validateFormData(data.ChequeBranch, "special-characters-not-allowed", /[<>]/))
                errors.ChequeBranch = "< and > characters not allowed";
            if (!this.validateFormData(data.ChequeNumber, "require"))
                errors.ChequeNumber = "Cheque Number required";
            else if (!this.validateFormData(data.ChequeNumber, "only-numeric"))
                errors.ChequeNumber = "Enter Cheque Number in numeric only";
            if (!this.validateFormData(data.ChequeDate, "require_date"))
                errors.ChequeDate = "Cheque Date required";
        }
        if (data.PaymentMode === "CreditCard" || data.PaymentMode === "DebitCard") {
            if (!this.validateFormData(data.ChequeBank, "require"))
                errors.ChequeBank = "Bank Name required";
            else if (data.ChequeBank && !this.validateFormData(data.ChequeBank, "special-characters-not-allowed", /[<>]/))
                errors.ChequeBank = "< and > characters not allowed";
            if (!this.validateFormData(data.CardLastFourDigit, "require"))
                errors.CardLastFourDigit = "Card Number required";
            if (!this.validateFormData(data.CardLastFourDigit, "numeric"))
                errors.CardLastFourDigit = "Card Number should be numeric only.";
        }
        if (data.PaymentMode != "Cheque" && data.PaymentMode !== "CreditCard" && data.PaymentMode !== "DebitCard") {
            if (!this.validateFormData(data.TransactionNumber, "require"))
                errors.TransactionNumber = "Transaction Number required";
            if (data.TransactionNumber && !this.validateFormData(data.TransactionNumber, "special-characters-not-allowed", /[<>'"]/))
                errors.TransactionNumber = "<,>,' and \" characters not allowed";
        }
        if (!this.validateFormData(data.Comment, "require"))
            errors.Comment = "Comment required";
        if (data.Comment && !this.validateFormData(data.Comment, "special-characters-not-allowed", /[<>'"]/))
            errors.Comment = "<,>,' and \" space characters not allowed";

        return Object.keys(errors).length === 0 ? null : errors;
    };
    render() {
        const { paymentType, SelectedRecords } = this.props;
        const { showSuccessMessage } = this.state;
        const currency = paymentType === "full" ? SelectedRecords[0].invoiceCurrencyCode : SelectedRecords[0].supplierReconciledCurrency;
        return (
            <div>
                {showSuccessMessage &&
                    <MessageBar Message={`Payment done successfully.`} handleClose={() => this.props.onSaveSuccess()} />
                }
                <div className="row">
                    <div className="col-lg-8">
                        <div className="border">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                        <b>Payment Information</b>
                                    </div>
                                </div>
                            </div>
                            <div className="border-bottom pl-2 pr-2 pt-2 pb-1 position-relative">
                                <div className="row">
                                    <div className="col-lg-6 col-sm-12">
                                        {this.renderInput(
                                            "PaymentAmount",
                                            Trans("Total Amount *"),
                                            "text",
                                            true
                                        )}
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                        {this.renderBirthDate(
                                            "PaymentDate",
                                            Trans("Payment Date *")
                                        )}
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                        {this.renderSelect(
                                            "PaymentMode",
                                            Trans("Payment Mode *"),
                                            PaymentMode
                                        )}
                                    </div>
                                    {this.state.data.PaymentMode !== "Cheque" && this.state.data.PaymentMode !== "CreditCard" && this.state.data.PaymentMode !== "DebitCard" &&
                                        <div className="col-lg-6 col-sm-12">
                                            {this.renderInput(
                                                "TransactionNumber",
                                                Trans("Transaction Number *"),
                                                "text",
                                                false
                                            )}
                                        </div>
                                    }

                                    {(this.state.data.PaymentMode === "CreditCard" || this.state.data.PaymentMode === "DebitCard") &&
                                        <React.Fragment>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "ChequeBank",
                                                    Trans("Bank Name*"),
                                                    "text",
                                                    false
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "CardLastFourDigit",
                                                    "Card Number (Last 4 Digits)*",
                                                    "text",
                                                    false,
                                                    "",
                                                    4,
                                                    4
                                                )}
                                            </div>
                                        </React.Fragment>
                                    }

                                    {this.state.data.PaymentMode === "Cheque" &&
                                        <React.Fragment>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "ChequeBank",
                                                    Trans("Cheque Bank *"),
                                                    "text",
                                                    false
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "ChequeBranch",
                                                    Trans("Cheque Branch *"),
                                                    "text",
                                                    false
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "ChequeNumber",
                                                    Trans("Cheque Number *"),
                                                    "text",
                                                    false
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderPaymentDate(
                                                    "ChequeDate",
                                                    Trans("Cheque Date *")
                                                )}
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className="col-lg-6 col-sm-6">
                                        {this.renderTextarea("Comment", Trans("Comment *"))}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mt-2 mb-2 text-danger">
                                    {this.state.saveError}
                                </div>
                                <div className="col-lg-6 mt-2 mb-2">
                                    <button
                                        className="btn btn-primary mr-2 float-right"
                                        type="submit"
                                        onClick={!this.state.isLoading ? () => { this.saveReconciliation() } : ""}
                                    >
                                        {this.state.isLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                        {"Pay"}
                                    </button>
                                    <button
                                        className="btn btn-secondary mr-2 float-right"
                                        type="submit"
                                        onClick={() => this.props.back(paymentType === "full" ? "InvoiceSelection" : "BRNSelection")}
                                    >
                                        {Trans("_previous")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 small">
                        <div className="border">
                            <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                <b>{this.props.paymentType === "full" ? "Invoices" : "Booking Reference Numbers"}</b>
                            </div>

                            {this.props.paymentType === "full" &&
                                <React.Fragment>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                                <div className="row">
                                                    <div className="col-lg-8"><b>Invoices Number</b></div>
                                                    {/* <div className="col-lg-4"><b>Invoices Date</b></div> */}
                                                    <div className="col-lg-4"><b>Due Amount</b></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.props.SelectedRecords.map((item, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className="border-bottom pl-2 pr-2 pt-2 pb-1 position-relative"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-8">{item.invoiceNumber}</div>
                                                    {/* <div className="col-lg-4"><Datecomp date={item.invoiceDate} /></div> */}
                                                    <div className="col-lg-4">{currency + " " + item.dueAmount}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            }
                            {this.props.paymentType === "brnPayment" &&
                                <React.Fragment>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                                <div className="row">
                                                    <div className="col-lg-8"><b>Booking Reference Number</b></div>
                                                    <div className="col-lg-4"><b>Received Amount</b></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.props.SelectedRecords.map((item, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className="border-bottom pl-2 pr-2 pt-2 pb-1 position-relative"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-8">{item.bookingRefNo}</div>
                                                    <div className="col-lg-4">{currency + " " + item.PaidAmount}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            }

                            <div className="border-bottom pl-2 pr-2 pt-2 pb-1 position-relative">
                                <div className="row">
                                    <div className="col-lg-8"><b>Total Amount</b></div>
                                    <div className="col-lg-4"><b>{currency + " " + this.props.Amount}</b></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default SupplierPaymentInfoForm;
