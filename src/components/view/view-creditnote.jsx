import React, { Component } from "react";
import Form from "../common/form";
import { apiRequester } from "../../services/requester";
import ViewBookingLoading from "../loading/view-booking-loading";
import HtmlParser from "../../helpers/html-parser";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import ReactToPrint from "react-to-print";

class ViewCreditNote extends Form {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isError: false,
            results: null,
            isEmailSent: null,
            data: {
                emailTo: "",
                emailCC: "",
                comments: ""
            },
            errors: {},
            isLoadingSendEmail: false,
        }
    }
    componentDidMount() {
        this.getDebitNoteHtml();
    }
    getDebitNoteHtml = () => {
        let reqURL = "api/v1/mybookings/debitcreditnote";
        let reqOBJ = null;

        reqOBJ = {
            Request: {
                itineraryID: this.props.results[0].response.itineraryID,
                itineraryDetailID: this.props.results[0].response.itineraryDetailID,
                bookingID: this.props.results[0].response.bookingID,
                businessShortDescription: this.props.results[0].response.businessObject.business.toLowerCase(),
                debitCreditNoteTemplate: "creditnote"
            }
        };

        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.status.code === 0) {
                    this.setState({
                        //results: data.response,
                        results:
                            data.response.indexOf("<body") > -1
                                ? /<body.*?>([\s\S]*)<\/body>/.exec(data.response)[1]
                                : data.response,
                        isLoading: false,
                        isError: false
                    });
                } else
                    this.setState({
                        isLoading: false,
                        isError: true
                    });
            }.bind(this)
        );
    };
    handleSubmit = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.handleSendEmail();
    };
    validate = () => {
        const errors = {};
        const { data } = this.state;
        if (!this.validateFormData(data.emailTo, "require"))
            errors.emailTo = Trans("_error_emailTo_require");
        else {
            if (data.emailTo !== "") {
                let isValidemailTo = true;
                data.emailTo.trim().split(",").forEach((item, index) => {
                    if (!this.validateFormData(item.replace(' ', ''), "email") && item !== "") isValidemailTo = false;
                });
                if (!isValidemailTo) errors.emailTo = Trans("_error_emailTo_email");
            }
        }

        if (data.emailCC !== "") {
            let isValidemailCC = true;
            data.emailCC.trim().split(",").forEach((item, index) => {
                if (!this.validateFormData(item.replace(' ', ''), "email") && item !== "") isValidemailCC = false;
            });
            if (!isValidemailCC) errors.emailCC = Trans("_error_emailCC_email");
        }

        if (data.comments && !this.validateFormData(data.comments, "special-characters-not-allowed", /[<>]/))
            errors.comments = "< and > characters not allowed";

        return Object.keys(errors).length === 0 ? null : errors;
    };
    handleSendEmail = () => {
        this.setState({
            isEmailSent: null
        });

        let emailTo = "";
        let emailTolist;
        if (this.state.data.emailTo !== "") {
            this.state.data.emailTo.split(",").forEach((item, index) => {
                if (emailTo === "")
                    emailTo = item.trim();
                else
                    emailTo += ',' + item.trim();
            });
            emailTolist = emailTo.trim().split(',');
            emailTo = emailTolist.filter(x => x !== "").join(',');
        }
        let emailCC = "";
        let emailCClist;
        if (this.state.data.emailCC !== "") {
            this.state.data.emailCC.split(",").forEach((item, index) => {
                if (!emailTo.includes(item)) {
                    if (emailCC === "")
                        emailCC = item.trim();
                    else
                        emailCC += ',' + item.trim();
                }
            });
            emailCClist = emailCC.trim().split(',');
            emailCC = emailCClist.filter(x => x !== "").join(',');
        }
        let comments = "";
        comments = this.state.data.comments;
        this.setState({ isLoadingSendEmail: true });
        let reqURL = "api/v1/mybookings/invoice/notification";
        let reqOBJ = null;
        if (this.props.match)
            reqOBJ = {
                Request: {
                    itineraryID: this.props.results[0].response.itineraryDetailID,
                    businessShortDescription: this.props.results[0].response.businessObject.business.toLowerCase(),
                    debitCreditNoteTemplate: "creditnote",
                    email: emailTo,
                    ccEmail: emailCC,
                    notes: comments
                }
            };
        else
            reqOBJ = {
                Request: {
                    itineraryID: this.props.itineraryid,
                    bookingID: this.props.bookingid,
                    businessShortDescription: this.props.businessName.toLowerCase(),
                    isvoucher: this.props.mode === "voucher",
                    email: this.state.data.emailTo,
                    ccEmail: this.state.data.emailCC,
                    notes: comments
                }
            };

        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.status.code === 0) {
                    this.setState({
                        isEmailSent: true,
                        data: {
                            emailTo: "",
                            emailCC: "",
                            comments: "",
                        },
                        isLoadingSendEmail: false
                    });
                } else
                    this.setState({
                        isEmailSent: false,
                        data: {
                            emailTo: "",
                            emailCC: "",
                            comments: "",
                        },
                        isLoadingSendEmail: false
                    });
            }.bind(this)
        );
    };
    render() {
        let bookingAmount = 0;
        let creditAmount = 0;
        var cancellationCharges = this.props.results[0].response.businessObject.cancellationCharges;
        if (cancellationCharges && cancellationCharges.length > 0 && cancellationCharges.find(x => x.purpose === "12")) {
            bookingAmount = cancellationCharges.find(x => x.purpose === "12").amount + cancellationCharges.find(x => x.purpose === "11").amount;
            creditAmount = bookingAmount - cancellationCharges.find(x => x.purpose === "12").amount;
        }
        return (
            <div>
                {!this.state.isLoading && !this.state.results && (
                    <div className="alert alert-secondary m-5" role="alert">
                        <h4 className="alert-heading">{Trans("_ooops")}</h4>
                        <p className="mt-3">
                            {Trans("_ooopsSomeThingWentWrongAfterBooking")}
                        </p>
                    </div>
                )}
                <div className="container" align="center">
                    {!this.state.isLoading && this.state.results && (
                        <div className="mt-3">
                            <GetContent
                                results={this.state.results}
                                ref={el => (this.componentRef = el)}
                            />

                            <div>
                                <div className="row mt-5">
                                    <div className="col-2 text-right">
                                        <div>{Trans("_emailTo")} :</div>
                                    </div>
                                    <div className="col-4 text-left">
                                        {this.renderInput("emailTo", "")}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2 text-right">
                                        <div>{Trans("_emailCC")} :</div>
                                    </div>
                                    <div className="col-4 text-left">
                                        {this.renderTextarea("emailCC", "")}

                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-2 text-right">
                                        <div>{Trans("Comments")} :</div>
                                    </div>
                                    <div className="col-4 text-left">
                                        {this.renderTextarea("comments", "")}
                                        <span>
                                            {"(" + Trans("_sendEmailTemplateMessage") + ")"}
                                        </span>
                                    </div>
                                </div> */}
                                <div className="row mt-3">
                                    <div className="col-2 text-right">
                                        <ReactToPrint
                                            trigger={() => (
                                                <button className="btn btn-primary btn-sm ml-2 pull-right">
                                                    <SVGIcon name="print" className="mr-1"></SVGIcon>
                                                    {Trans("_btnPrint")}
                                                </button>
                                            )}
                                            content={() => this.componentRef}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <button
                                            className="btn btn-primary btn-sm pull-left"
                                            onClick={this.handleSubmit}
                                        >
                                            {this.state.isLoadingSendEmail && (
                                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                            )}
                                            {Trans("_sendEmail")}
                                        </button>
                                    </div>
                                </div>
                                {this.state.isEmailSent !== null && (
                                    <div className="row mt-3">
                                        <div className="col-2 text-right"></div>
                                        <div className="col-3">
                                            <small
                                                className={
                                                    "alert mt-2 p-1 d-inline-block " +
                                                    (this.state.isEmailSent
                                                        ? "alert-success"
                                                        : "alert-danger ")
                                                }
                                            >
                                                {this.state.isEmailSent
                                                    ? Trans("_emailSentSucccessfully")
                                                    : Trans("_ooopsSomeThingWentWrongAfterBooking")}
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {this.state.isLoading && (
                        <div className="mt-3">
                            <ViewBookingLoading />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
class GetContent extends Component {
    render() {
        return <HtmlParser text={this.props.results.replaceAll("&amp;", "&")} />;
    }
}

export default ViewCreditNote;