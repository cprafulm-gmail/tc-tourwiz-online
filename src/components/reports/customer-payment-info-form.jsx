import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import { PaymentMode } from "../../helpers/dropdown-list";
import { apiRequester_unified_api } from "./../../services/requester-unified-api";
import moment from 'moment';
import MessageBar from '../admin/message-bar';
import ComingSoon from "../../helpers/coming-soon";
import Config from "../../config.json"
import Amount from "../../helpers/amount";
import Loader from "../common/loader";
import * as Global from "../../helpers/global";

class CustomerPaymentInfoForm extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                PaymentAmountTotal: this.props.Amount,
                PaymentAmount: this.props.paymentType === "additionals" ? "" : this.props.Amount,
                RemainingAmount: 0,
                PaymentMode: "Cash",
                TransactionToken: "",
                BankName: "",
                BranchName: "",
                ChequeNumber: "",
                ChequeDate: moment(new Date()).format("YYYY-MM-DD"),
                PaymentDate: moment(new Date()).format("YYYY-MM-DD"),
                PaymentFollowupDate: moment().add("0", "days").format('YYYY-MM-DD'),
                CardLastFourDigit: "",
                Comments: "",
            }, errors: {},
            saveError: "",
            isLoading: false,
            isPageLoading: Config.codebaseType === "tourwiz-customer" || this.props.paymentType === "additionals" ? false : true,
            comingsoon: false,
            isCreditNotePayment: false,
            creditNoteList: [],
            settlementAmount: 0,
            creditNotePayments: [],
            isCreditNoteSettlement: false,
        };
    }
    handleComingSoon = () => {
        this.setState({
            comingsoon: !this.state.comingsoon,
        });
    };

    componentDidMount() {
        const isTourwizB2CPortal = Config.codebaseType === "tourwiz-customer";
        if (!isTourwizB2CPortal)
            this.getCreditNoteList();
    }

    getCreditNoteList = () => {
        this.setState({ creditNoteList: [], isPageLoading: true });
        let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
        let reqURL = "reconciliation/notes?type=credit-note&customerId=" + bookingForInfo.customerID;
        const reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.error) {
                    data.response = [];
                }
                if (data.response.length > 0) {
                    let creditNoteList = data.response.map((item, index) => {
                        return { ...item, isSelected: false };
                    });
                    this.setState({ creditNoteList, isPageLoading: false });
                }
                else {
                    this.setState({ creditNoteList: [], isPageLoading: false });
                }
            }.bind(this),
            "GET"
        );
    }
    saveReconciliation = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isLoading: true });
        let currency = (this.props.SelectedRecords && this.props.SelectedRecords.length > 0)
            ? this.props.SelectedRecords[0].bookingCurrency
            : Global.getEnvironmetKeyValue("portalCurrencyCode");
        let reqURL = {}
        if (this.props.paymentType === "additionals")
            reqURL = "reconciliation/customer/additionalspayment";
        else if (this.props.paymentType === "full")
            reqURL = "reconciliation/customer/invoice/payment";
        else
            reqURL = "reconciliation/customer/invoice/payment/brn";

        let PaymentInfo = { ...this.state.data };
        if (PaymentInfo.PaymentMode === "Cheque" || PaymentInfo.PaymentMode === "CreditCard" || PaymentInfo.PaymentMode === "DebitCard") {
            PaymentInfo.TransactionToken = "";
        } else {
            PaymentInfo.BankName = "";
            PaymentInfo.BranchName = "";
            PaymentInfo.ChequeNumber = "";
            PaymentInfo.ChequeDate = "";
            PaymentInfo.CardLastFourDigit = "";
        }
        PaymentInfo["PaymentCurrency"] = currency;
        let reqOBJ = { PaymentInfo };
        if (this.props.paymentType === "additionals") {
            let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
            reqOBJ.customerId = bookingForInfo.customerID;
        }
        else if (this.props.paymentType === "full") {
            reqOBJ.agentCustomerInvoiceIDs = this.props.SelectedRecords.map((item) => { return item.agentCustomerInvoiceID });
        }
        else {
            let BRNList = [...this.props.SelectedRecords];
            reqOBJ.BRNInfo = BRNList.reduce((bRNObject, item) => {
                let invoice = bRNObject.filter((param) => { return param.AgentCustomerInvoiceID === item.agentCustomerInvoiceID });
                if (invoice.length === 0) {
                    bRNObject.push({
                        AgentCustomerInvoiceID: item.agentCustomerInvoiceID,
                        ItineraryDetails: [this.createItenaryDetail(item, reqOBJ.PaymentInfo)]
                    });

                } else {
                    invoice[0].ItineraryDetails.push(this.createItenaryDetail(item, reqOBJ.PaymentInfo));
                }
                return bRNObject;
            }, []);
        }

        if (this.state.isCreditNoteSettlement) {
            reqOBJ.creditNotePayments = this.state.creditNotePayments
        }

        apiRequester_unified_api(reqURL, { "request": reqOBJ }, function (data) {
            if (data.message === "success") {
                this.setState({
                    isLoading: false
                });
                this.setState({ showSuccessMessage: true });
            } else {
                this.setState({
                    isLoading: false, isSaveError: true, saveError: data.message
                });
            }

        }.bind(this), "POST")

    }
    createItenaryDetail = (item, PaymentInfo) => {
        return {
            "AgentCustomerReconciliationID": item.agentCustomerReconciliationID,
            "ItineraryRefNo": item.itineraryRefNo,
            "ItineraryID": item.itineraryID,
            "BookingRef": item.bookingRef,
            "ItineraryDetailID": item.itineraryDetailID,
            "ReconciliationDate": PaymentInfo.PaymentDate,
            "ReconciliationAmount": parseFloat(item.ReconciliationAmount),
            "ReconciliationCurrency": PaymentInfo.PaymentCurrency,
            "Comments": PaymentInfo.Comments
        }
    }
    validate = () => {
        const errors = {};
        const { data } = this.state;
        if (isNaN(Number(data.PaymentAmount))) {
            errors.PaymentAmount = "Enter valid amount.";
        }
        if (Number(data.PaymentAmount) <= 0) {
            errors.PaymentAmount = "Amount should not be zero or negative.";
        }
        if (!this.validateFormData(data.PaymentDate, "require_date"))
            errors.PaymentDate = "Payment Date required";

        if (!this.validateFormData(data.ReconciliationDate, "require_date"))
            errors.ReconciliationDate = "Reconciliation Date required";


        if (!this.validateFormData(data.PaymentMode, "require"))
            errors.PaymentMode = "Payment Mode required";

        if (data.PaymentMode === "CreditCard" || data.PaymentMode === "DebitCard") {
            if (!this.validateFormData(data.BankName, "require"))
                errors.BankName = "Bank Name required";
            if (data.BankName && !this.validateFormData(data.BankName, "special-characters-not-allowed", /[<>]/))
                errors.BankName = "< and > characters not allowed";
            if (!this.validateFormData(data.CardLastFourDigit, "require"))
                errors.CardLastFourDigit = "Card Number required";
            if (!this.validateFormData(data.CardLastFourDigit, "numeric"))
                errors.CardLastFourDigit = "Card Number should be numeric only.";
        }

        if (data.PaymentMode === "Cheque") {
            if (!this.validateFormData(data.BankName, "require"))
                errors.BankName = "Bank Name required";
            if (data.BankName && !this.validateFormData(data.BankName, "special-characters-not-allowed", /[<>]/))
                errors.BankName = "< and > characters not allowed";
            if (!this.validateFormData(data.BranchName, "require"))
                errors.BranchName = "Branch Name required";
            if (data.BranchName && !this.validateFormData(data.BranchName, "special-characters-not-allowed", /[<>]/))
                errors.BranchName = "< and > characters not allowed";
            if (!this.validateFormData(data.ChequeNumber, "require"))
                errors.ChequeNumber = "Cheque Number required";
            else if (!this.validateFormData(data.ChequeNumber, "only-numeric"))
                errors.ChequeNumber = "Enter valid Cheque Number.";
            if (!this.validateFormData(data.ChequeDate, "require_date"))
                errors.ChequeDate = "Cheque Date required";
        }
        if (data.PaymentMode != "Cheque" && data.PaymentMode !== "CreditCard" && data.PaymentMode !== "DebitCard") {
            if (!this.validateFormData(data.TransactionToken, "require"))
                errors.TransactionToken = "Reference Number required";
            if (data.TransactionToken && !this.validateFormData(data.TransactionToken, "special-characters-not-allowed", /[<>'"\[\]]/))
                errors.TransactionToken = "<,>,',[,] and \" characters not allowed";
        }
        if (!this.validateFormData(data.Comments, "require"))
            errors.Comments = "Comment required";
        if (data.Comments && !this.validateFormData(data.Comments, "special-characters-not-allowed", /[<>'"]/))
            errors.Comments = "<,>,' and \" space characters not allowed";

        return Object.keys(errors).length === 0 ? null : errors;
    }

    handleCreditNotePayment = () => {
        this.setState({ isCreditNotePayment: !this.state.isCreditNotePayment });
    }

    handleCreditNoteSelection = (e) => {
        let { creditNoteList, settlementAmount, creditNotePayments } = this.state;
        let reqNoteData = creditNoteList.find(x => x.noteNumber === e.target.name);
        if (e.currentTarget.checked) {
            //data.PaymentAmount -= Number(reqNoteData.noteAmount);
            settlementAmount += Number(reqNoteData.noteAmount);
            let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
            if (creditNotePayments.length > 0) {
                creditNotePayments = creditNotePayments.find(x => x.NoteID !== reqNoteData.noteID)
            }
            creditNotePayments.push({
                "CreditNoteNumber": e.target.name,
                "NoteID": reqNoteData.noteID,
                "NoteAmount": reqNoteData.noteAmount,
                "CustomerID": bookingForInfo.customerID,
            });
        }
        else {
            //data.PaymentAmount += Number(reqNoteData.noteAmount);
            settlementAmount -= Number(reqNoteData.noteAmount);
            creditNotePayments = creditNotePayments.filter(x => x.noteNumber !== e.target.name);
        }
        reqNoteData.isSelected = e.currentTarget.checked;

        this.setState({ creditNoteList, settlementAmount, creditNotePayments, isCreditNoteSettlement: false });
    }

    handleAdjust = () => {
        let { settlementAmount, data } = this.state;
        if (this.props.paymentType === "additionals") {
            data.RemainingAmount = data.PaymentAmount - settlementAmount;
        }
        else {
            data.PaymentAmount = this.props.Amount - settlementAmount;
        }
        this.setState({ data, isCreditNoteSettlement: true });
    }

    render() {
        let currency = (this.props.SelectedRecords && this.props.SelectedRecords.length > 0)
            ? this.props.SelectedRecords[0].bookingCurrency
            : Global.getEnvironmetKeyValue("portalCurrencyCode");
        const { showSuccessMessage } = this.state;
        const isTourwizB2CPortal = Config.codebaseType === "tourwiz-customer";
        //const isTourwizB2CPortal = true;
        return (
            <div>
                {showSuccessMessage &&
                    <MessageBar Message={`Payment done successfully.`} handleClose={() => this.props.onSaveSuccess()} />
                }
                {this.state.isPageLoading &&
                    <Loader />
                }
                {!this.state.isPageLoading &&
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
                                <div className="border-bottom pl-2 pr-2 pt-2 pb-1">
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-12">
                                            {this.renderInput(
                                                this.props.paymentType === "additionals" ? "PaymentAmount" : "PaymentAmountTotal",
                                                this.props.paymentType === "additionals" ? Trans("Payment Amount *") : Trans("Payment Received *"),
                                                "text",
                                                this.props.paymentType === "additionals" ? false : true
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-sm-12">
                                            {this.renderBirthDate(
                                                "PaymentDate",
                                                Trans("Payment Date *")
                                            )}
                                        </div>
                                        {this.state.creditNoteList.length > 0 &&
                                            <div className="col-lg-12 col-sm-12 mb-2 hide-notes">
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="bg-light pt-2 pb-2 pl-2 pr-2">
                                                            <div className=" custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="custom-control-input"
                                                                    id="isCreditNotePayment"
                                                                    name="isCreditNotePayment"
                                                                    checked={this.state.isCreditNotePayment}
                                                                    onChange={this.handleCreditNotePayment}
                                                                />
                                                                <label className="custom-control-label" htmlFor="isCreditNotePayment">
                                                                    <b>Credit note settlement</b>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {this.state.isCreditNotePayment &&
                                                    <React.Fragment>
                                                        <div className=" pl-2 pr-2 pt-2 pb-1">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-sm-12">
                                                                    {this.state.creditNoteList.map((item, key) => {
                                                                        let checked = this.state.creditNoteList
                                                                            .filter(x => x.noteNumber === item.noteNumber && x.isSelected).length === 1;
                                                                        return (
                                                                            <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                                                                <div className=" custom-control custom-checkbox">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="custom-control-input"
                                                                                        id={item.noteNumber}
                                                                                        name={item.noteNumber}
                                                                                        checked={checked}
                                                                                        onChange={this.handleCreditNoteSelection}
                                                                                    />
                                                                                    <label className="custom-control-label" htmlFor={item.noteNumber}>
                                                                                        {item.noteNumber} - <Amount amount={item.noteAmount} />
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                                <div className="col-lg-6 m-3 mb-2">
                                                                    <span>Settlement Amount: <b><Amount amount={this.state.settlementAmount} /></b></span>
                                                                </div>
                                                                <div className="col-lg-5 mt-2 mb-2">
                                                                    <button
                                                                        className="btn btn-primary mr-2 float-right"
                                                                        type="submit"
                                                                        onClick={this.handleAdjust}
                                                                    >
                                                                        Adjust
                                                                    </button>
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </React.Fragment>
                                                }
                                            </div>
                                        }
                                        {this.state.isCreditNoteSettlement && this.props.paymentType !== "additionals" && this.state.creditNoteList.length > 0 && this.state.data.PaymentAmountTotal !== this.state.data.PaymentAmount &&
                                            <div className="col-lg-12 mt-2 mb-2">
                                                <span>Remaining Amount: <b><Amount amount={this.state.data.PaymentAmount} /></b></span>
                                            </div>}
                                        {this.state.isCreditNoteSettlement && this.props.paymentType === "additionals" && this.state.creditNoteList.length > 0 && this.state.data.PaymentAmountTotal !== this.state.data.PaymentAmount &&
                                            this.state.data.RemainingAmount > 0 &&
                                            <div className="col-lg-12 mt-2 mb-2">
                                                <span>Remaining Amount: <b><Amount amount={this.state.data.RemainingAmount} /></b></span>
                                            </div>}
                                        <div className="col-lg-6 col-sm-12">
                                            {this.renderSelect(
                                                "PaymentMode",
                                                Trans("Payment Mode *"),
                                                PaymentMode
                                            )}
                                        </div>

                                        {(this.state.data.PaymentMode === "CreditCard" || this.state.data.PaymentMode === "DebitCard") &&
                                            <React.Fragment>
                                                <div className="col-lg-6 col-sm-12">
                                                    {this.renderInput(
                                                        "BankName",
                                                        Trans("Bank Name *"),
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
                                                        "BankName",
                                                        Trans("Bank Name *"),
                                                        "text",
                                                        false
                                                    )}
                                                </div>
                                                <div className="col-lg-6 col-sm-12">
                                                    {this.renderInput(
                                                        "BranchName",
                                                        Trans("Branch Name *"),
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
                                        {this.state.data.PaymentMode != "Cheque" && this.state.data.PaymentMode !== "CreditCard" && this.state.data.PaymentMode !== "DebitCard" &&
                                            <div className="col-lg-6 col-sm-12">
                                                {this.renderInput(
                                                    "TransactionToken",
                                                    Trans("Reference Number *"),
                                                    "text",
                                                    false
                                                )}
                                            </div>
                                        }
                                        <div className="col-lg-6 col-sm-6">
                                            {this.renderTextarea("Comments", Trans("Comment *"))}
                                        </div>
                                        {this.props.isShowPaymentDueDate &&
                                            <div className="col-lg-6 col-sm-6">
                                                {this.renderPassportExpiryDate(
                                                    "PaymentFollowupDate",
                                                    Trans("Payment FollowUp Date *"),
                                                    this.state.data.PaymentDate
                                                )}
                                            </div>}
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
                                            onClick={!this.state.isLoading ? () => { isTourwizB2CPortal ? this.handleComingSoon() : this.saveReconciliation() } : ""}
                                        >
                                            {this.state.isLoading ? (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            ) : null}
                                            Pay
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
                            </div>
                        </div>
                        {this.props.paymentType !== "additionals" &&
                            <div className="col-lg-4">
                                <div className="border">
                                    <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                        <b>{this.props.paymentType === "full" ? "Invoices" : "Booking Reference Numbers"}</b>
                                    </div>

                                    {this.props.paymentType === "full" &&
                                        <React.Fragment>
                                            <div className="row small">
                                                <div className="col-lg-12">
                                                    <div className="bg-light border-bottom pt-2 pb-2 pl-2 pr-2">
                                                        <div className="row">
                                                            <div className="col-lg-7"><b>Invoices Number</b></div>
                                                            {/* <div className="col-lg-4"><b>Invoices Date</b></div> */}
                                                            <div className="col-lg-5"><b>Due Amount</b></div>
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
                                                        <div className="row small">
                                                            <div className="col-lg-7">{item.invoiceNumber}</div>
                                                            {/* <div className="col-lg-4"><Datecomp date={item.invoiceDate} /></div> */}
                                                            <div className="col-lg-5"><Amount amount={item.dueAmount} currencyCode={currency} /></div>
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
                                                        <div className="row small">
                                                            {/* <div className="col-lg-3"><b>Invoices Number</b></div>
                                                    <div className="col-lg-3"><b>Invoices Date</b></div> */}
                                                            <div className="col-lg-7"><b>Booking Reference Number</b></div>
                                                            <div className="col-lg-5"><b>Received Amount</b></div>
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
                                                        <div className="row small">
                                                            {/* <div className="col-lg-3">{item.invoiceNumber}</div>
                                                    <div className="col-lg-3"><Datecomp date={item.invoiceDate} /></div> */}
                                                            <div className="col-lg-7">{item.bookingRef}</div>
                                                            <div className="col-lg-5"><Amount amount={item.ReconciliationAmount} currencyCode={currency} /></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    }

                                    <div className="border-bottom pl-2 pr-2 pt-2 pb-1 position-relative">
                                        <div className="row small">
                                            <div className="col-lg-7"><b>Total Amount</b></div>
                                            <div className="col-lg-5"><b><Amount amount={this.props.Amount} currencyCode={currency} /></b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>}
                {this.state.comingsoon && (
                    <ComingSoon handleComingSoon={this.handleComingSoon} />
                )}
            </div>
        );
    }
}

export default CustomerPaymentInfoForm;
