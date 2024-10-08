import React, { Component } from "react";
import ViewBookingLoading from "../components/loading/view-booking-loading";
import { Trans } from "../helpers/translate";
import HtmlParser from "../helpers/html-parser";
import { apiRequester } from "../services/requester";
import ReactToPrint from "react-to-print";
import Form from "../components/common/form";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import { renderToString } from 'react-dom/server'

class ManualInvoiceItemPrint extends Form {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      isEmailSent: null,
      emailErrorResponse: null,
      data: {
        emailTo: "",
        emailCC: "",
        customerName: "",
        email: "",
        address: "",
        phone: "",
        gstno: "",
        narration: "",
        title: "",
        duration: "",
        startDate: "",
        endDate: "",
        dates: "",
        datesIsValid: "valid",
        cutOfDays: 1,
        stayInDays: 4,
        createdDate: "",
        status: "",
        phoneNotoValidate: "",
        invoicenumber: "",
        itineraryID: 0,
        customerledger: "",
        addToSupplierLedger: "",
        customitemType: "",
        customitemTypeother: "",
      },
      items: null,
      errors: {},
      isLoadingSendEmail: false,
    };
  }

  /* getInvoiceData = () => {
    let reqURL = "api/v1/mybookings/invoice";
    let reqOBJ = null;

    if (this.props.match)
      reqOBJ = {
        Request: {
          itineraryID: this.props.match.params.itineraryid,
          bookingID: this.props.match.params.bookingid,
          businessShortDescription: this.props.match.params.businessName.toLowerCase(),
          isvoucher: this.props.match.params.mode === "voucher"
        }
      };
    else
      reqOBJ = {
        Request: {
          itineraryID: this.props.itineraryid,
          bookingID: this.props.bookingid,
          businessShortDescription: (this.props.businessName.toLowerCase() === "ground service" || this.props.businessName.toLowerCase() === "groundservice") ? "ground service" : this.props.businessName.toLowerCase(),
          isvoucher: this.props.mode === "voucher"
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
  }; */

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
    return Object.keys(errors).length === 0 ? null : errors;
  };

  sendEmail = (callback) => {
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
      emailTo = emailTolist.filter(x => x != "").join(',');
    }
    let emailCC = "";
    let emailCClist;
    if (this.state.data.emailCC !== "") {
      this.state.data.emailCC.split(",").forEach((item, index) => {
        if (emailCC === "")
          emailCC = item.trim();
        else
          emailCC += ',' + item.trim();
      });
      emailCClist = emailCC.trim().split(',');
      emailCC = emailCClist.filter(x => x != "").join(',');
    }
    this.setState({
      isEmailSent: null,
      emailErrorResponse: null,
      isLoadingSendEmail: true
    });
    //let emailBody = renderToString(<VoucherInvoiceContent results={this.state.items} ref={el => (this.componentRef = el)} />);
    let reqOBJ = {
      Request: {
        InvoiceId: this.props.match.params.invoiceid,
        ItemId: this.props.match.params.itemid ? this.props.match.params.itemid : "",
        Email: emailTo,
        CCEmail: emailCC,
        Type: this.props.match.params.mode.toLowerCase() === "voucher" ? "Voucher" : "Invoice"
      }
    };
    let reqURL = "tw/manualinvoice/senddetail";
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          isLoadingSendEmail: false
        });
        callback(data);
      }.bind(this),
      "POST"
    );
  };

  handleMessage = (data) => {
    if (data.result) {
      this.setState({
        isEmailSent: true,
        emailErrorResponse: null,
        data: {
          emailTo: "",
          emailCC: ""
        }
      });
    }
    else {
      this.setState({
        isEmailSent: false,
        emailErrorResponse: data,
        data: {
          emailTo: "",
          emailCC: ""
        }
      });
    }
  }
  handleSendEmail = () => {
    this.sendEmail(this.handleMessage);
  };

  getinvoicehtmlcontent = (mode, invoiceid, itemid) => {
    let reqURL = "tw/manualinvoice/invoicehtmlcontent?mode=" + mode + "&invoiceid=" + invoiceid;
    if (itemid)
      reqURL = reqURL + "&itemid=" + itemid;
    let reqOBJ = {}
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response.length > 0) {
          this.setState({
            items: data.response.indexOf("<body") > -1
              ? /<body.*?>([\s\S]*)<\/body>/.exec(data.response)[1]
              : data.response
            , isLoading: false,
            isError: false
          });
        }
        else {
          this.setState({
            isLoading: false,
            isError: true
          });
        }
      }.bind(this),
      "GET"
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    //this.getInvoiceData();
    this.getinvoicehtmlcontent(this.props.match.params.mode, this.props.match.params.invoiceid, this.props.match.params.itemid);
  }

  render() {
    return (
      <div>
        {!this.state.isLoading && !this.state.items && (
          <div className="alert alert-secondary m-5" role="alert">
            <h4 className="alert-heading">{Trans("_ooops")}</h4>
            <p className="mt-3">
              {Trans("_ooopsSomeThingWentWrongAfterBooking")}
            </p>
          </div>
        )}
        <div className="container">
          {!this.state.isLoading && this.state.items && (
            <div className="mt-3">
              <VoucherInvoiceContent
                results={this.state.items}
                ref={el => (this.componentRef = el)}
              />

              <div className="" style={{ "margin-left": "316px" }}>
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
                    <span>
                      {"(" + Trans("_sendEmailTemplateMessage") + ")"}
                    </span>
                  </div>
                </div>
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

class VoucherInvoiceContent extends Component {
  render() {
    return <HtmlParser text={this.props.results} />;
  }
}

export default ManualInvoiceItemPrint;
