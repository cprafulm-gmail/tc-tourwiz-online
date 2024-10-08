import React, { Component } from "react";
import $ from "jquery";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import Form from "../common/form";
import { apiRequester } from "../../services/requester";
import UmrahPackageEmailItems from "./umrah-package-email-items";
import UmrahPackageEmailFooter from "./umrah-package-email-footer";
import UmrahPackageEmailHeader from "./umrah-package-email-header";
import UmrahPackageEmailItemsOffline from "./umrah-package-email-items-offline";
import UmrahPackageEmailItemsFromList from "./umrah-package-email-items-fromlist";

class UmrahPackageEmail extends Form {
  state = {
    isSucessMsg: false,
    isEmailPreview: false,
    data: {
      title: "",
      email: "",
      terms: "",
    },
    errors: {},
    saveMode: false,
    savedCartId: null,
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

  sendEmail = () => {
    const { data } = this.state;

    var emailBody = document.getElementById("emailHTML").outerHTML;
    //var reqURL = "https://quotation-builder.000webhostapp.com/email-sender.php";
    var reqURL = "https://quotationmail.000webhostapp.com/email-parser.php";
    var reqOBJ =
      "sendQuotation=sendQuotation&" +
      "emailTo=" +
      data.email +
      "&" +
      "emailFrom=" +
      Global.getEnvironmetKeyValue("customerCareEmail") +
      "&" +
      "emailSubject=" +
      data.title +
      "&" +
      "emailBody=" +
      emailBody;
    this.ajaxRequester(reqURL, reqOBJ, () => {
      this.quotationSuccess();
    });
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.title, "require")) errors.title = "Quotation title required";
    if (!this.validateFormData(data.email, "require")) errors.email = "Email required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSendEmail = (mode) => {
    const errors = this.validate();
    this.setState({ errors: errors || {}, saveMode: false });
    if (errors) return;
    this.sendEmail();

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
          offlineItems: localStorage.getItem("umrahPackageItems"),
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

  setData = () => {
    let defautData = { ...this.state.data };
    defautData.title = this.props.title ? this.props.title : "";
    defautData.email = this.props.email ? this.props.email : "";
    defautData.terms = this.props.terms ? this.props.terms : "";
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

  quotationEmailPreview = () => {
    this.setState({
      isEmailPreview: !this.state.isEmailPreview,
    });
  };

  componentDidMount() {
    this.setData();
  }

  render() {
    const { items, type } = this.props;
    const { isSucessMsg, isEmailPreview, saveMode } = this.state;
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
            <h6 className="font-weight-bold m-0 p-0">{type} Email</h6>
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
              {this.renderInput("title", "Quotation Title *")}
              {this.renderInput("email", "Email *")}
            </div>
            <div className="col-lg-6 quotation-email">
              {this.renderTextarea("terms", "Terms and Conditions")}
            </div>
          </div>

          {isSucessMsg && (
            <h6 className="alert alert-success mt-3">
              {type} {saveMode && "Save and "} Sent Successfully!
            </h6>
          )}

          <div className="mt-2">
            <button className="btn btn-sm btn-primary mr-3" onClick={this.quotationEmailPreview}>
              Preview Email
            </button>

            <button className="btn btn-sm btn-primary mr-3" onClick={this.handleSendEmail}>
              Send {type}
            </button>
          </div>

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
                                        src={Global.getEnvironmetKeyValue("portalLogo")}
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
                                      <UmrahPackageEmailHeader {...this.props} />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      {items.map((item, key) => {
                                        return (
                                          <React.Fragment key={key}>
                                            {!item.offlineItem && !item.isFromList && (
                                              <UmrahPackageEmailItems item={item} />
                                            )}

                                            {item.offlineItem && !item.isFromList && (
                                              <UmrahPackageEmailItemsOffline item={item} />
                                            )}

                                            {item.isFromList && (
                                              <UmrahPackageEmailItemsFromList item={item} />
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <UmrahPackageEmailFooter {...this.state} />
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
      </div>
    );
  }
}

export default UmrahPackageEmail;
