import React, { Component } from "react";
import $ from "jquery";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import Form from "../common/form";
import { apiRequester } from "../../services/requester";
import QuotationEmailItems from "./quotation-email-items";
import QuotationEmailFooter from "./quotation-email-footer";
import QuotationSupplierEmailFooter from "./quotation-supplieremail-footer";
import QuotationEmailHeader from "./quotation-email-header";
import QuotationEmailSupplierHeader from "./quotation-email-supplier-header";
import QuotationEmailItemsOfflineSupplier from "./quotation-email-items-offline-supplier";
import QuotationEmailItemsOffline from "./quotation-email-items-offline";
import QuotationEmailItemsFromList from "./quotation-email-items-fromlist";
import ComingSoon from "../../helpers/coming-soon";
import { Trans } from "../../helpers/translate";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { getLocalhostUrlFromEndPoints } from "../../services/get-localhost-url-from-end-points";
import HtmlParser from "../../helpers/html-parser";

class QuotationEmail extends Form {
  state = {
    isSucessMsg: false,
    isEmailPreview: false,
    data: {
      title: "",
      email: "",
      terms: "",
      notes: "",
      supplieremail: "",
      supplieremailtermsconditions: "",
    },
    errors: {},
    saveMode: false,
    savedCartId: null,
    comingsoon: false,
    selectedItemsforMail: [],
    isSupplieritinerany: false,
    isPreviewSupplierEmail: false,
    showImagesInEmail: true,
    isLoadingSendSupplierEmail: false,
    isshowauthorizepopup: false,
  };

  ajaxRequester = (reqURL, reqOBJ, callback) => {
    $.ajax({
      type: "POST",
      url: reqURL,
      data: reqOBJ,
      dataType: "JSON",
      success: function (data) {
        callback();
      },
      error: function (err) {
        callback();
      },
    });
  };

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  sendEmail = () => {
    const { data } = this.state;
    this.setState({ isLoading: true });
    let emailTo = "";
    let emailTolist;
    if (data.email !== "") {
      data.email.split(",").forEach((item, index) => {
        if (emailTo === "")
          emailTo = item.trim();
        else
          emailTo += ',' + item.trim();
      });
      emailTolist = emailTo.trim().split(',');
      emailTo = emailTolist.filter(x => x != "").join(',');
    }
    //Info :  use below for IsShowPrice
    //   ShowPrice
    //   {
    //      ShowAll = 1,
    //      HideAll = 2,
    //      HideItemized = 3
    //  }
    var emailBody = document.getElementById("emailHTML").outerHTML;
    let reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      title: this.state.data.title,
      ToEmail: emailTo,
      Notes: this.state.data.terms.replaceAll("\n", "<br/>"),
      IsShowImage: this.state.showImagesInEmail,
      IsShowPrice: 1,
      itemId: this.props.items.map(item => item.offlineItem).map(item => item.uuid),
      IsSupplier: false
    };

    let reqURL = process.env.REACT_APP_QUOTATION_API_ENDPOINT + "/quotation/send";
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
      reqURL = "/quotation/send";
      let appPath = getLocalhostUrlFromEndPoints(reqURL);
      if (reqURL.startsWith('/'))
        reqURL = reqURL.substring(1);
      //appPath = "http://localhost:5005/";
      reqURL = appPath + reqURL.replace("tw/", "");
    }
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      this.quotationSuccess();
      this.setState({ isLoading: false });
      // if (this.readyState === 4 && this.status === 200) {
      // }
    };
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.title, "require"))
      errors.title = this.props.type === "Quotation"
        ? Trans("_quotationReplaceKey") + " title required"
        : this.props.type === "Quotation_Master"
          ? Trans("_quotationReplaceKey") + " Master title required"
          : this.props.type + " title required";
    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email required";
    else {
      if (data.email !== "") {
        let isValidemailTo = true;
        data.email.trim().split(",").forEach((item, index) => {
          if (!this.validateFormData(item.replace(' ', ''), "email") && item !== "") isValidemailTo = false;
        });
        if (!isValidemailTo) errors.email = Trans("_error_emailTo_email");
      }
    }
    if (!this.validateFormData(data.terms, "special-characters-not-allowed", /[<>]/)) errors.terms = "< and > characters not allowed";

    if (data.supplieremailtermsconditions && !this.validateFormData(data.supplieremailtermsconditions, "special-characters-not-allowed", /[<>]/)) errors.supplieremailtermsconditions = "< and > characters not allowed";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSendEmail = (mode) => {
    const errors = this.validate();
    this.setState({ errors: errors || {}, saveMode: false });
    if (errors) return;
    this.sendEmail();
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    quotationInfo.terms = this.state.data.terms;
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    this.props.saveQuotation();
    mode === "save" && this.saveQuotation();
  };

  saveQuotation = () => {
    this.setState({ saveMode: true });

    var reqURL = "api/v1/cart/persist";
    var reqOBJ = {
      Request: {
        metaData: {
          name: this.state.data.title,
          customerName: this.props.customerName,
          email: this.props.email,
          phone: this.props.phone,
          terms: this.state.data.terms,
          offlineItems: localStorage.getItem("quotationItems"),
        },
        cartID: localStorage.getItem("cartLocalId"),
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({ savedCartId: data.info.token });
      }.bind(this)
    );
  };

  sendSEmail = () => {
    const { data, errors } = this.state;
    if (!this.validateFormData(data.supplieremail, "require"))
      errors.supplieremail = "Email required";
    else if (data.supplieremail !== "") {
      let isValidemailTo = true;
      data.supplieremail.trim().split(",").forEach((item, index) => {
        if (!this.validateFormData(item.replace(' ', ''), "email") && item !== "") isValidemailTo = false;
      });
      if (!isValidemailTo)
        errors.supplieremail = Trans("_error_emailTo_email");
      else
        delete Object.assign(errors)["supplieremail"];
    }
    else {
      delete Object.assign(errors)["supplieremail"];
    }
    if (this.state.errors && Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }


    if (this.state.selectedItemsforMail.length === 0) {
      this.setState({ showNoItemSelectedError: true });
      return;
    }
    else {
      this.setState({ showNoItemSelectedError: false });
    }
    var emailBody = document.getElementById("emailHTMLsupplierPreview").outerHTML;

    let emailTo = "";
    let emailTolist;
    if (data.supplieremail !== "") {
      data.supplieremail.split(",").forEach((item, index) => {
        if (emailTo === "")
          emailTo = item.trim();
        else
          emailTo += ',' + item.trim();
      });
      emailTolist = emailTo.trim().split(',');
      emailTo = emailTolist.filter(x => x != "").join(',');
    }
    //Info :  use below for IsShowPrice
    //   ShowPrice
    //   {
    //      ShowAll = 1,
    //      HideAll = 2,
    //      HideItemized = 3
    //  }
    this.setState({ isLoadingSendSupplierEmail: true });
    let reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      title: this.state.data.title,
      ToEmail: emailTo,
      Notes: this.state.data.supplieremailtermsconditions.replaceAll("\n", "<br/>"),
      IsShowImage: this.state.showImagesInEmail,
      IsShowPrice: 2,
      itemId: this.state.selectedItemsforMail,
      IsSupplier: true
    };

    let reqURL = process.env.REACT_APP_QUOTATION_API_ENDPOINT + "/quotation/send";
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
      reqURL = "/quotation/send";
      let appPath = getLocalhostUrlFromEndPoints(reqURL);
      if (reqURL.startsWith('/'))
        reqURL = reqURL.substring(1);
      //appPath = "http://localhost:5005/";
      reqURL = appPath + reqURL.replace("tw/", "");
    }
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      this.quotationSuccess();
      this.setState({ isSupplieritinerany: false, isLoadingSendSupplierEmail: false });
      // if (this.readyState === 4 && this.status === 200) {
      // }
    };
  };

  setData = () => {
    let defautData = { ...this.state.data };
    defautData.title = this.props.title ? this.props.title : "";
    defautData.email = this.props.email ? this.props.email : "";
    defautData.terms = this.props.terms ? this.props.terms.replaceAll("<br/>", "\n") : "";
    this.setState({ data: defautData });
  };

  quotationSuccess = () => {
    this.setState({
      isSucessMsg: !this.state.isSucessMsg,
    });
    setTimeout(() => {
      this.setState({ isSucessMsg: false });
    }, 5000);
  };

  quotationSupplieritinerany = () => {
    const { data } = this.state;
    data.supplieremail = "";
    data.supplieremailtermsconditions = "";
    this.setState({
      isSupplieritinerany: !this.state.isSupplieritinerany,
      isEmailPreview: false,
      errors: {},
      selectedItemsforMail: [],
      data
    });
  };

  handleImage = (e) => {
    this.setState({
      showImagesInEmail: e.target.checked
    });
  }

  quotationEmailPreview = () => {
    this.setState({
      isEmailPreview: !this.state.isEmailPreview,
      isSupplieritinerany: false
    });

    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    quotationInfo.terms = this.state.data.terms.replaceAll("\n", "<br/>");
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    if (!this.props.isquickpropo)
      this.props.saveQuotation();
  };

  getselecteditems = (data) => {
    let selecteditem = this.state.selectedItemsforMail;
    if (!selecteditem) {
      selecteditem.push(data);
    }
    else if (selecteditem.filter(x => x === data).length === 0) {
      selecteditem.push(data);
    }
    else {
      selecteditem.pop(data);
    }
    this.setState({
      selectedItemsforMail: selecteditem
    });
  }

  componentDidMount() {
    this.setData();
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  render() {
    const { items, type, userInfo } = this.props;
    const {
      isLoading,
    } = this.state;
    const { isSupplieritinerany, isPreviewSupplierEmail, isSucessMsg, isEmailPreview, saveMode, showImagesInEmail } = this.state;
    return (
      <div className="quotation-email border shadow-sm mt-4">
        <div className="border-bottom bg-light d-flex p-2 pl-3 pr-3">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              className="mr-2 d-flex align-items-center"
              name={"envelope"}
              width="16"
              type="fill"
            ></SVGIcon>
            <h6 className="font-weight-bold m-0 p-0">
              {type === "Quotation"
                ? Trans("_quotationReplaceKey")
                : type === "Quotation_Master"
                  ? Trans("_quotationReplaceKey") + " Master"
                  : type} Email
            </h6>
          </div>

          <button className="btn btn-sm border bg-white" onClick={this.props.sendEmail}>
            <SVGIcon
              className="d-flex align-items-center"
              name="times"
              width="16"
              height="16"
            ></SVGIcon>
          </button>
        </div>

        <div className="p-3">
          <div className="quotation-email-form row">
            <div className="col-lg-6">
              {this.renderInput("title", Trans("_quotationReplaceKey") + " Title *")}
              {this.renderInput("email", "Email *" + " (" + Trans("_sendEmailTemplateMessage") + ")")}
            </div>
            <div className="col-lg-6 quotation-email">
              {this.renderTextarea("terms", "Email Notes")}
            </div>
            {!this.props.isquickpropo &&
              <div className="col-lg-12 mb-13 mt-1">
                <div className="custom-control custom-switch d-inline-block mr-4">
                  <input
                    id="showImagesInEmail"
                    name="showImagesInEmail"
                    type="checkbox"
                    className="custom-control-input"
                    checked={this.state.showImagesInEmail}
                    onChange={this.handleImage}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="showImagesInEmail"
                  >
                    {this.state.showImagesInEmail ? "Show Images" : "Hide Images"}
                  </label>
                </div>
              </div>
            }
          </div>

          {isSucessMsg && (
            <h6 className="alert alert-success mt-3">
              {type === "Quotation"
                ? Trans("_quotationReplaceKey")
                : type === "Quotation_Master"
                  ? Trans("_quotationReplaceKey") + " Master"
                  : type} {saveMode && "Save and "} Sent Successfully!
            </h6>
          )}

          <div className="mt-2 d-flex flex-row">
            {/* <AuthorizeComponent title={type === "Quotation" ? "QuotationDetails~quotation-preview-email" : "QuotationDetails~master-quotation-preview-email"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            <button className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                (type === "Quotation"
                  ? "QuotationDetails~quotation-preview-email"
                  : "QuotationDetails~master-quotation-preview-email"))
                ? this.quotationEmailPreview()
                : this.setState({ isshowauthorizepopup: true })
              }
            >
              Preview Email
            </button>
            {/* </AuthorizeComponent> */}
            {/* <AuthorizeComponent title={type === "Quotation" ? "QuotationDetails~quotation-send-customer" : "QuotationDetails~master-quotation-send-customer"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            <button className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                (type === "Quotation"
                  ? "QuotationDetails~quotation-send-customer"
                  : "QuotationDetails~master-quotation-send-customer"))
                ? this.handleSendEmail()
                : this.setState({ isshowauthorizepopup: true })
              }
            >
              {isLoading && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              Send {type === "Quotation"
                ? (this.props.isquickpropo ? "Quick Proposal" : Trans("_quotationReplaceKey"))
                : type === "Quotation_Master"
                  ? Trans("_quotationReplaceKey") + " Master"
                  : type}
            </button>
            {/* </AuthorizeComponent> */}
            {/* <AuthorizeComponent title={type === "Quotation" ? "QuotationDetails~quotation-send-supplier" : "QuotationDetails~master-quotation-send-supplier"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            {!this.props.isquickpropo &&
              <button className="btn btn-sm btn-primary mr-3"
                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                  (type === "Quotation"
                    ? "QuotationDetails~quotation-send-customer"
                    : "QuotationDetails~master-quotation-send-customer"))
                  ? this.quotationSupplieritinerany()
                  : this.setState({ isshowauthorizepopup: true })
                }
              >
                Send {type === "Quotation"
                  ? Trans("_quotationReplaceKey")
                  : type === "Quotation_Master"
                    ? Trans("_quotationReplaceKey") + " Master"
                    : type} to Supplier
              </button>
            }
            {/* </AuthorizeComponent> */}
          </div>

          {this.state.comingsoon && (
            <ComingSoon handleComingSoon={this.handleComingSoon} />
          )}

          {!this.props.isquickpropo &&
            <div style={{ display: !isEmailPreview && "none" }}>
              <div id="emailHTML" className="mt-4">
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border="0"
                  width="800px"
                  style={{ border: "solid 2px #434C5B" }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                          <tbody>
                            <tr>
                              <td>
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          background: "#434C5B",
                                          padding: "8px 16px",
                                          color: "#ffffff",
                                          fontSize: "24px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {this.state.data.title}
                                        <img
                                          src={userInfo?.provider?.logo?.url ? userInfo?.provider?.logo?.url : Global.getEnvironmetKeyValue("portalLogo")}
                                          height="32px"
                                          style={{
                                            height: "32px",
                                            background: "#fff",
                                            borderRadius: "4px",
                                            float: "right",
                                            padding: "0px 4px",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: "16px" }}>
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <QuotationEmailHeader {...this.props} />
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        {items.map((item, key) => {
                                          return (
                                            <React.Fragment key={key}>
                                              {!item.offlineItem && !item.isFromList && (
                                                <QuotationEmailItems item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                              )}

                                              {item.offlineItem && !item.isFromList && (
                                                <QuotationEmailItemsOffline item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} type={type} isRemovePriceAndActionButton={true} />
                                              )}

                                              {item.isFromList && (
                                                <QuotationEmailItemsFromList item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                              )}
                                            </React.Fragment>
                                          );
                                        })}
                                      </td>
                                    </tr>
                                    {this.state.data.terms !== "" &&
                                      <tr>
                                        <td>
                                          <br />
                                          <span><b>Notes :</b> {<HtmlParser text={this.state.data.terms.replaceAll("\n", "<br/>")} />}</span>
                                        </td>
                                      </tr>
                                    }
                                    <tr>
                                      <td>
                                        <QuotationEmailFooter
                                          {...this.props}
                                          {...this.state}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }

          {this.props.isquickpropo &&
            <div style={{ display: !isEmailPreview && "none" }}>
              <div id="emailHTML" className="mt-4">
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border="0"
                  width="800px"
                  style={{ border: "solid 2px #434C5B" }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                          <tbody>
                            <tr>
                              <td>
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          background: "#434C5B",
                                          padding: "8px 16px",
                                          color: "#ffffff",
                                          fontSize: "24px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {this.state.data.title}
                                        <img
                                          src={userInfo?.provider?.logo?.url ? userInfo?.provider?.logo?.url : Global.getEnvironmetKeyValue("portalLogo")}
                                          height="32px"
                                          style={{
                                            height: "32px",
                                            background: "#fff",
                                            borderRadius: "4px",
                                            float: "right",
                                            padding: "0px 4px",
                                          }}
                                          alt=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: "16px" }}>
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                          <tbody>
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px" }}>
                                                <span>Dear {this.props.customerName},</span>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px" }}>
                                                <span>
                                                  I'm excited to present you with a quick travel proposal for your inquiry:
                                                  <br /><br />Proposal Name: {this.props.title}
                                                  {this.props.budget > 0 &&
                                                    <React.Fragment>
                                                      <br />Sell Price: {this.props.budget}
                                                    </React.Fragment>
                                                  }
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    {this.props.quickproposalcomments &&
                                      <tr>
                                        <td>
                                          Description: {<HtmlParser text={this.props.quickproposalcomments.replaceAll("\n", "<br/>").replaceAll("&nbsp;", "")} />}
                                        </td>
                                      </tr>
                                    }
                                    <br />
                                    <tr>
                                      <td>
                                        Attached, you'll find the detailed travel proposal document. It includes a day-by-day itinerary, accommodation options, transportation details, and additional services tailored to your preferences.
                                      </td>
                                    </tr>
                                    <br />
                                    <tr>
                                      <td>
                                        Please review the proposal at your convenience. Feel free to reach out if you have any questions or would like to discuss further. We're here to make your travel dreams a reality!
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <QuotationEmailFooter
                                          {...this.props}
                                          {...this.state}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }
          {isSupplieritinerany &&
            <div className="model-popup">
              <div className="modal fade show d-block" tabindex='-1'>
                <div
                  className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{"Send " + Trans("_quotationReplaceKey") + " to Supplier"}</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={this.quotationSupplieritinerany}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div id="emailHTML" className="mt-4">
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border="0"
                          width="700px"
                          style={{ border: "solid 2px #434C5B" }}
                        >
                          <tbody>
                            <tr>
                              <td>
                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  background: "#434C5B",
                                                  padding: "8px 16px",
                                                  color: "#ffffff",
                                                  fontSize: "24px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {this.state.data.title}
                                                <img
                                                  src={userInfo?.provider?.logo?.url ? userInfo?.provider?.logo?.url : Global.getEnvironmetKeyValue("portalLogo")}
                                                  height="32px"
                                                  style={{
                                                    height: "32px",
                                                    background: "#fff",
                                                    borderRadius: "4px",
                                                    float: "right",
                                                    padding: "0px 4px",
                                                  }}
                                                  alt=""
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td style={{ padding: "16px" }}>
                                        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                          <tbody>
                                            <tr>
                                              <td>
                                                <QuotationEmailSupplierHeader {...this.props} supplieremailtermsconditions={this.state.data.supplieremailtermsconditions} />
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>
                                                {items.map((item, key) => {
                                                  return (
                                                    <React.Fragment key={key}>
                                                      {!item.offlineItem && !item.isFromList && (
                                                        <QuotationEmailItems item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                                      )}

                                                      {item.offlineItem && !item.isFromList && (
                                                        <QuotationEmailItemsOfflineSupplier getselecteditems={this.getselecteditems} selectedItemsforMail={this.state.selectedItemsforMail} item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} type={type} />
                                                      )}

                                                      {item.isFromList && (
                                                        <QuotationEmailItemsFromList item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                                      )}
                                                    </React.Fragment>
                                                  );
                                                })}
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>
                                                <QuotationSupplierEmailFooter
                                                  {...this.props}
                                                  {...this.state}
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-lg-12" style={{ marginTop: "15px" }}>
                        {this.renderInput("supplieremail", "Email *" + " (" + Trans("_sendEmailTemplateMessage") + ")")}
                        {this.renderTextarea("supplieremailtermsconditions", "Notes")}
                        {this.state.showNoItemSelectedError === true &&
                          <React.Fragment>
                            <small class="alert alert-danger mt-2 p-1 d-inline-block">Please select Item(s)</small>
                            <br />
                          </React.Fragment>
                        }
                        <button className="btn btn-sm btn-primary mr-3" onClick={this.sendSEmail}>
                          {this.state.isLoadingSendSupplierEmail && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                          )}
                          Send Email
                        </button>
                        {/* <button className="btn btn-sm btn-primary mr-3" onClick={() => { this.setState({ isPreviewSupplierEmail: true }); }}>PreviewSupplierEmail </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show"></div>
            </div>
          }

          <div style={{ display: !isPreviewSupplierEmail && "none" }}>
            <div id="emailHTMLsupplierPreview" className="mt-4">
              <table
                cellPadding="0"
                cellSpacing="0"
                border="0"
                width="700px"
                style={{ border: "solid 2px #434C5B" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        background: "#434C5B",
                                        padding: "8px 16px",
                                        color: "#ffffff",
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {this.state.data.title}
                                      <img
                                        src={userInfo?.provider?.logo?.url ? userInfo?.provider?.logo?.url : Global.getEnvironmetKeyValue("portalLogo")}
                                        height="32px"
                                        style={{
                                          height: "32px",
                                          background: "#fff",
                                          borderRadius: "4px",
                                          float: "right",
                                          padding: "0px 4px",
                                        }}
                                        alt=""
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ padding: "16px" }}>
                              <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td>
                                      <QuotationEmailSupplierHeader {...this.props} supplieremailtermsconditions={this.state.data.supplieremailtermsconditions} />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      {items.map((item, key) =>
                                        this.state.selectedItemsforMail.includes(item.offlineItem.uuid) &&
                                        (
                                          <React.Fragment key={key}>
                                            {!item.offlineItem && !item.isFromList && (
                                              <QuotationEmailItems item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                            )}

                                            {item.offlineItem && !item.isFromList && (
                                              <QuotationEmailItemsOfflineSupplier getselecteditems={this.getselecteditems} isfromPreview={true} selectedItemsforMail={this.state.selectedItemsforMail} item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} type={type} />
                                            )}

                                            {item.isFromList && (
                                              <QuotationEmailItemsFromList item={item} ShowhideElementname={"showAllPrices"} showImagesInEmail={showImagesInEmail} />
                                            )}
                                          </React.Fragment>

                                        )
                                      )}
                                    </td>
                                  </tr>
                                  {this.state.data.supplieremailtermsconditions !== "" &&
                                    <tr>
                                      <td style={{ padding: "9px 0px 8px 0px", fontSize: "14px" }}>
                                        <span><b>Notes :</b> {this.state.data.supplieremailtermsconditions}</span>
                                      </td>
                                    </tr>
                                  }
                                  <tr>
                                    <td>
                                      <QuotationSupplierEmailFooter
                                        {...this.props}
                                        {...this.state}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {
          this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
      </div>
    );
  }
}

export default QuotationEmail;
