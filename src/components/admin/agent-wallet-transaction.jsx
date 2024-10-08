import React from 'react'
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import MessageBar from '../admin/message-bar';
export class WalletTransaction extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderId: this.props.ProviderId,
                AgentId: this.props.AgentId,
                PaymentType: 1,
                Amount: "",
                ChildCurrencySymbol: "",
                ParentCurrencySymbol: "",
                Balance: "",
                ConversionFactor: this.props.ConversionFactor,
                Comment: "",
                ReferenceNo: "",
                ChequeBank: "",
                ChequeBranch: "",
                ChequeNumber: "",
                ChequeDate: "",
                UserId: this.props.UserId,
                IsCredit: 1,
                IsPrePaid: "",
                SelectedCurrency: "",
                AgentName: ""
            },
            errors: {},
            currencyList: [],
            isLoading: false,
            isSaveInProgress: false,

        };
    }
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        this.setState({ isLoading: true });
        let reqURL = "admin/agent/transaction/details";
        const reqOBJ = {
            "request": {
                "ProviderId": this.props.ProviderId,
                "agentId": this.props.AgentId,
            }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (responsedata) {
                let { data } = this.state;
                let currencyList = [];
                if (responsedata.response && responsedata.response.length > 0) {
                    responsedata = responsedata.response[0];
                    data["AgentName"] = responsedata["name"];
                    data["Balance"] = responsedata["balance"];
                    data["IsPrePaid"] = responsedata["isPrePaid"] === true ? 1 : 0;
                    data["ChildCurrencySymbol"] = responsedata["childCurrencySymbol"];
                    data["ParentCurrencySymbol"] = responsedata["parentCurrencySymbol"];
                    data["CurrencySymbol"] = responsedata["currencySymbol"];
                    data["SelectedCurrency"] = responsedata["childCurrencySymbol"];
                    currencyList.push(responsedata["childCurrencySymbol"]);
                    if (responsedata["childCurrencySymbol"] !== responsedata["parentCurrencySymbol"]) {
                        currencyList.push(responsedata["parentCurrencySymbol"]);
                    }
                }
                this.setState({ data, currencyList, isLoading: false });
            }.bind(this),
            "POST"
        );

    }
    handleSubmit = () => {
        const errors = this.validateData();

        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isSaveInProgress: true, saveError: "" });
        let reqURL = "admin/agent/transaction/add";
        let reqOBJ = { ...this.state.data };
        delete reqOBJ["AgentName"];
        delete reqOBJ["CurrencySymbol"];
        if (reqOBJ.PaymentType !== 2) {
            reqOBJ["ChequeBank"] = "";
            reqOBJ["ChequeBranch"] = "";
            reqOBJ["ChequeDate"] = "";
            reqOBJ["ChequeNumber"] = "";
        } else
            reqOBJ["ReferenceNo"] = "";
        reqOBJ["Amount"] = parseFloat(reqOBJ["Amount"]);
        apiRequester_unified_api(
            reqURL,
            { request: reqOBJ },
            function (data) {
                this.setState({ isSaveInProgress: false })
                if (data && data.response && data.response.status === "Success") {
                    this.setState({ showSuccessMessage: true });
                }
                else {
                    this.setState({ saveError: data.error })
                }
            }.bind(this)
        );
    }
    validateData = () => {
        const errors = {};
        const { data } = this.state;
        if (!this.validateFormData(data.Amount, "require"))
            errors.Amount = "Amount required";
        else if (parseFloat(data.Amount) <= 0)
            errors.Amount = "Amount can not be less or equal to 0";
        if (data.PaymentType === 2) {
            if (!this.validateFormData(data.ChequeBank, "require"))
                errors.ChequeBank = "Bank Name required";
            if (!this.validateFormData(data.ChequeBranch, "require"))
                errors.ChequeBranch = "Branch Name required";
            if (!this.validateFormData(data.ChequeNumber, "require"))
                errors.ChequeNumber = "Cheque Number required";
            if (!this.validateFormData(data.ChequeDate, "require_date"))
                errors.ChequeDate = "Cheque Date required";
        }
        else {
            if (!this.validateFormData(data.ReferenceNo, "require"))
                errors.ReferenceNo = "Reference Number required";
        }
        if (!this.validateFormData(data.Comment, "require"))
            errors.Comment = "Comment required";
        return Object.keys(errors).length === 0 ? null : errors;
    }
    PaymentTypeChange = (value) => {
        const { data } = this.state;
        data.IsCredit = value;
        this.setState({ data });
    }
    CurrencyChange = (value) => {
        const { data } = this.state;
        data.SelectedCurrency = value;
        this.setState({ data });
    }
    render() {
        const { data, isLoading, isSaveInProgress, saveError, currencyList, showSuccessMessage } = this.state;
        const PaymentMode = [{ value: 1, name: "Cash" }, { value: 2, name: "Cheque" }];

        return (
            <div>
                <div>
                    <div className="model-popup">
                        <div className="modal fade show d-block">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-capitalize">
                                            Wallet Transaction
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => { this.props.closePopup() }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {isLoading && (<Loader />)}
                                    {!isLoading && <div className="modal-body">
                                        {showSuccessMessage &&
                                            <MessageBar Message={`Wallet transaction saved successfully.`} handleClose={() => this.props.closePopup(true)} />
                                        }
                                        <div className="container">
                                            <div className="row" >
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className={"form-group " + "PaymentType"}>
                                                        <label htmlFor={"PaymentType"}>{"Payment Type"}</label>
                                                        <div className="input-group">
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" name="PaymentType" id="yes" onClick={() => this.PaymentTypeChange(1)} value={1} checked={data.IsCredit === 1} />
                                                                <label className="form-check-label" htmlFor="PaymentTypeYes">Credit</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" name="PaymentType" id="no" value={0} onClick={() => this.PaymentTypeChange(0)} checked={data.IsCredit === 0} />
                                                                <label className="form-check-label" htmlFor="PaymentTypeNo">Debit</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    {this.renderInput("AgentName", "Agency Name", "text", true)}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <label htmlFor={"CurrentBalance"}>{"Current Balance"}</label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">{data.CurrencySymbol}</div>
                                                        </div>
                                                        <input type="number" className="form-control" value={data.Balance} disabled={true}></input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    {this.renderInput("Amount", "Amount *", "number")}
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className={"form-group " + "PaymentType"}>
                                                        <label htmlFor={"Currency"}>{"Currency *"}</label>
                                                        <div className="input-group">
                                                            {currencyList.map((item, key) => {
                                                                return (
                                                                    <div key={key} className="form-check form-check-inline">
                                                                        <input className="form-check-input" type="radio" name="Currency" id={key} onClick={() => this.CurrencyChange(item)} value={item} checked={data.SelectedCurrency === item} />
                                                                        <label className="form-check-label" htmlFor="PaymentTypeYes">{item}</label>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <label htmlFor={"ClosingBalance"}>{"Closing Balance"}</label>
                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <div className="input-group-text">{data.CurrencySymbol}</div>
                                                        </div>
                                                        <input type="number" className="form-control" value={data.Balance} disabled={true}></input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-12">
                                                    {this.renderSelect(
                                                        "PaymentType",
                                                        Trans("Payment Type *"),
                                                        PaymentMode
                                                    )}
                                                </div>

                                                {data.PaymentType === 2 &&
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
                                                {data.PaymentType !== 2 &&
                                                    <div className="col-lg-6 col-sm-12">
                                                        {this.renderInput(
                                                            "ReferenceNo",
                                                            Trans("Reference Number *"),
                                                            "text",
                                                            false
                                                        )}
                                                    </div>
                                                }
                                                <div className="col-lg-6 col-sm-6">
                                                    {this.renderTextarea("Comment", Trans("Comment *"))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    <div className="modal-footer">
                                        {saveError && saveError.length > 0 &&
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {saveError}
                                            </small>
                                        }
                                        <button
                                            name="Cancel"
                                            onClick={() => { this.props.closePopup() }}
                                            className="btn btn-secondary  float-left mr-2"
                                        >
                                            {Trans("_cancel")}
                                        </button>
                                        <button
                                            name="Submit"
                                            onClick={this.handleSubmit}
                                            className="btn btn-primary float-left"
                                        >
                                            {isSaveInProgress ? (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            ) : null}
                                            {Trans("_save")}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                </div>
            </div >
        )
    }
}

export default WalletTransaction;
