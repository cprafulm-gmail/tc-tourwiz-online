import React, { Component } from "react";
import $ from "jquery";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import Form from "../components/common/form";
import Amount from "../helpers/amount";
import ComingSoon from "../helpers/coming-soon";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import Date from "../helpers/date";
import { Trans } from "../helpers/translate";
import starRatingImg from "../assets/images/dashboard/star-rating.png";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import Linkedin from '../assets/images/linkedin.png';
import Facebook from '../assets/images/facebook.png';
import Instagram from '../assets/images/instagram.png';

class PackageEmail extends Form {
  state = {
    isSupplieritinerany: false,
    isSucessMsg: false,
    isEmailPreview: false,
    data: {
      title: this.props.packageDetails.shortDescription,
      email: "",
      supplieremailtermsconditions: "",
      supplieremail: "",
      isLoadingSendEmail: false,
      isLoadingSendSupplierEmail: false
    },
    errors: {},
    saveMode: false,
    savedCartId: null,
    isHidePrice: true,
    hideItemizedPrices: true,
    comingsoon: false,
    ShowhideElementname: "hideItemizedPrices",
    selectedItemsforMail: [],
    isPreviewSupplierEmail: false,
    showNoItemSelectedError: false,
    showImagesInEmail: true,
    isshowauthorizepopup: false,
  };

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  sendSEmail = () => {
    this.setState({ isLoadingSendSupplierEmail: true });
    const { data } = this.state;
    const { packageDetails } = this.props;
    const errors = {};
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
    if (Object.keys(errors).length > 0) {
      this.setState({ errors, isLoadingSendSupplierEmail: false });
      return;
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
    let reqOBJ = {
      id: this.props.packageDetails.specialPromotionID,
      toEmail: emailTo,
      IsShowPrice: false,
      Notes: this.state.data.supplieremailtermsconditions,
      IsSupplier: true,
      currencySymbol: Global.getEnvironmetKeyValue("portalCurrencySymbol"),
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/package/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      this.packageMailSuccess();
      // if (this.readyState === 4 && this.status === 200) {
      // }
    };
  };

  sendEmail = () => {
    this.setState({ isLoadingSendEmail: true });
    const { data } = this.state;
    const { packageDetails } = this.props;
    const errors = {};
    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email required";
    else if (data.email !== "") {
      let isValidemailTo = true;
      data.email.trim().split(",").forEach((item, index) => {
        if (!this.validateFormData(item.replace(' ', ''), "email") && item !== "") isValidemailTo = false;
      });
      if (!isValidemailTo)
        errors.email = Trans("_error_emailTo_email");
      else
        delete Object.assign(errors)["email"];
    }
    else {
      delete Object.assign(errors)["email"];
    }
    if (Object.keys(errors).length > 0) {
      this.setState({ errors, isLoadingSendEmail: false });
      return;
    }

    var emailBody = document.getElementById("emailHTML").outerHTML;

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
    let reqOBJ = {
      id: this.props.packageDetails.specialPromotionID,
      toEmail: emailTo,
      IsShowPrice: this.props.packageDetails.price > 0 ? true : false,
      currencySymbol: Global.getEnvironmetKeyValue("portalCurrencySymbol"),
      Notes: "",
      IsSupplier: false,
      AttachmentPDFFilePath: this.props.packageDetails.brochureFileName && this.props.packageDetails.brochureFileName,
      LoggedinUserID: this?.props?.userInfo?.logggedInUserdetails?.userID ?? ""
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/package/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      this.packageMailSuccess();
    };
  };

  packageMailSuccess = () => {
    const { data } = this.state;
    data.email = "";
    data.supplieremailtermsconditions = "";
    data.supplieremail = "";
    this.setState({
      isSucessMsg: !this.state.isSucessMsg,
      errors: {},
      showNoItemSelectedError: false,
      isSupplieritinerany: false,
      data,
      isLoadingSendEmail: false,
      isLoadingSendSupplierEmail: false
    });
    setTimeout(() => {
      this.setState({ isSucessMsg: false });
    }, 5000);
  };

  packageEmailPreview = () => {
    this.setState({
      isEmailPreview: !this.state.isEmailPreview,
      isSupplieritinerany: false
    });
  };

  packageSupplieritinerany = () => {
    this.setState({
      isSupplieritinerany: !this.state.isSupplieritinerany,
      isEmailPreview: false,
    });
  };
  generateStartRating = (rating) => {
    return rating > 0 && [...Array(parseInt(rating, 10)).keys()].map(item => {
      return <img src={window.location.origin + starRatingImg} alt="" style={{ width: "20px" }} />
    })
  }

  render() {

    const { items, packageDetails, type, duration } = this.props;
    const { isSupplieritinerany, isPreviewSupplierEmail, isSucessMsg, isEmailPreview, saveMode, isHidePrice, ShowhideElementname, showImagesInEmail } = this.state;
    const count = Math.ceil(duration);
    const totalDays = 3;
    let totalPrice = 0;
    items.map(
      (item) =>
        item.offlineItem &&
        (totalPrice = Number(totalPrice) + Number(item.offlineItem.sellPrice))
    );
    const priceGuidelineStyle = `
    figure.table table {
      width: 100%;
      border: 1px solid #dee2e6;
  }
  figure.table table td {
      border-left: 1px solid #dee2e6;
  }
    `;
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

          {/* <button
            className="btn btn-sm border bg-white"
            onClick={this.props.sendEmail}
          >
            <SVGIcon
              className="d-flex align-items-center"
              name="times"
              width="16"
              height="16"
            ></SVGIcon>
          </button> */}
        </div>

        <div className="p-3">
          <div className="quotation-email-form row">
            <div className="col-lg-6">
              {this.renderInput("email", "Email* " + " (" + Trans("_sendEmailTemplateMessage") + ")")}
              {packageDetails.status === "pending" && this.renderTextarea("supplieremailtermsconditions", "Notes")}
            </div>
          </div>

          {isSucessMsg && (
            <h6 className="alert alert-success mt-3">
              {type} {saveMode && "Save and "} Sent Successfully!
            </h6>
          )}

          <div className="mt-2">
            {packageDetails.status !== "pending" && <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "PackageDetails~master-packages-preview-email" : "PackageDetails~package-preview-email")) ? this.packageEmailPreview() : this.setState({ isshowauthorizepopup: true })}>
              Preview Email
            </button>}

            {packageDetails.status === "pending" && <>
              <button
                className="btn btn-sm btn-primary mr-3"
                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "PackageDetails~master-packages-send-customer" : "PackageDetails~package-send-customer")) ? this.sendEmail() : this.setState({ isshowauthorizepopup: true })}
              >
                {this.state.isLoadingSendEmail && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                {"Approve"}
              </button>
              <button
                className="btn btn-sm btn-primary mr-3"
                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "PackageDetails~master-packages-send-customer" : "PackageDetails~package-send-customer")) ? this.sendEmail() : this.setState({ isshowauthorizepopup: true })}
              >
                {this.state.isLoadingSendEmail && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                {"Reject"}
              </button></>}
            {packageDetails.status !== "pending" && <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "PackageDetails~master-packages-send-customer" : "PackageDetails~package-send-customer")) ? this.sendEmail() : this.setState({ isshowauthorizepopup: true })}
            >
              {this.state.isLoadingSendEmail && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              {"Send Package to Customer"}
            </button>}


            {packageDetails.status !== "pending" && <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.IsMaster ? "PackageDetails~master-packages-send-supplier" : "PackageDetails~package-send-supplier")) ? this.packageSupplieritinerany() : this.setState({ isshowauthorizepopup: true })}>
              Send Package to Supplier
            </button>}
          </div>

          {this.state.comingsoon && (
            <ComingSoon handleComingSoon={this.handleComingSoon} />
          )}

          {this.state.isshowauthorizepopup &&
            <ModelPopupAuthorize
              header={""}
              content={""}
              handleHide={this.hideauthorizepopup}
              history={this.props.history}
            />
          }

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
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border="0"
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border="0"
                                width="100%"
                              >
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
                                      {packageDetails && packageDetails.shortDescription}

                                      {this?.props?.userInfo?.provider?.logo
                                        ?.url ? (
                                        <img
                                          src={
                                            this?.props?.userInfo?.provider
                                              ?.logo?.url
                                          }
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
                                      ) : (
                                        <h5
                                          style={{
                                            background: "#fff",
                                            borderRadius: "4px",
                                            float: "right",
                                            padding: "4px 4px 6px 4px",
                                            color: "rgb(241, 130, 71)",
                                            margin: "0px",
                                          }}
                                        >
                                          {this.props.userInfo?.provider?.name}
                                        </h5>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ padding: "16px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border="0"
                                width="100%"
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>Dear {packageDetails.twCustomerName},</span>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>
                                                Following your recent inquiry, we are pleased to offer you the following{" "}
                                                your package:
                                              </span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <table
                                        cellPadding="0"
                                        cellSpacing="0"
                                        border="0"
                                        width="100%"
                                      >
                                        <tbody>
                                          <tr>
                                            <td>
                                              <div style={{ width: "50%", float: "left", padding: "0px 7px", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", background: "rgb(67, 76, 91, 0.5)", boxSizing: "border-box", width: "100%", height: "230px" }}>


                                                <h4 style={{ marginTop: "22px", textTransform: "uppercase" }}>
                                                  {packageDetails && packageDetails.shortDescription}</h4>
                                                {packageDetails.rating > 0 && (<div className="mt-2"> {
                                                  this.generateStartRating(packageDetails.rating)} </div>)}

                                                {packageDetails.specialPromotionType && <div className="text-white mt-2 text-center"><small className="">
                                                  Package Type:{" "}
                                                  <b>{packageDetails.specialPromotionType} </b>
                                                </small></div>}
                                                <div className=" mt-2" style={{ margin: "10px 0px" }} >
                                                  <small>
                                                    <b>
                                                      Start Date:{" "}
                                                      <Date date={packageDetails.validFrom}></Date>
                                                    </b>
                                                  </small>
                                                  <span> - </span>
                                                  <small className="mt-2" >
                                                    <b>
                                                      End Date:{" "}
                                                      <Date date={packageDetails.validTo}></Date>
                                                    </b>
                                                  </small>
                                                  {/* <small className="ml-4">
                                            No of Days: <b>
                                              {5}</b>
                                          </small> */}
                                                </div>

                                                {/* <span style={{ width: "100%", padding: "5px 0px" }}>
                                                  <HtmlParser text={decode(packageDetails.summaryDescription)} />
                                                </span> */}
                                                {packageDetails.price > 0 && <h4 style={{}}>
                                                  <Amount
                                                    amount={packageDetails.price} currencyCode={packageDetails.symbol}
                                                  /></h4>}
                                                <div className="text-white mt-0 text-center">
                                                  {parseInt(JSON.parse(packageDetails.twOthers)?.Adults) > 0 && <small className="mr-3">
                                                    Adults:{" "}
                                                    <b>{JSON.parse(packageDetails.twOthers).Adults}
                                                    </b>
                                                  </small>}
                                                  {parseInt(JSON.parse(packageDetails.twOthers)?.Child) > 0 && <small className="mr-3">
                                                    Children:{" "}
                                                    <b>{JSON.parse(packageDetails.twOthers).Child}
                                                    </b>
                                                  </small>}
                                                  {parseInt(JSON.parse(packageDetails.twOthers)?.Infants) > 0 && <small className="mr-3">
                                                    Infants:{" "}
                                                    <b>{JSON.parse(packageDetails.twOthers).Infants}
                                                    </b>
                                                  </small>}
                                                </div>
                                              </div>
                                              <div style={{ width: "50%", float: "left", position: "absolute", width: "100%", height: "212px", zIndex: "-1" }}>
                                                <img src={packageDetails.smallImagePath} alt="" style={{ width: "763px", height: "230px" }} />
                                              </div>
                                            </td>
                                          </tr>
                                          {packageDetails.summaryDescription && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Overview</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.summaryDescription).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.description && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Itinerary</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.description).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.flight && packageDetails.flight !== undefined && packageDetails.flight !== "" && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Flight Details</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.flight).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.hotelDetails && packageDetails.hotelDetails !== undefined && packageDetails.hotelDetails !== "" && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Hotel Details</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.hotelDetails).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => x.isInclusion).length > 0 && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Inclusion</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>
                                                        {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => y.isInclusion && (
                                                          <p><HtmlParser text={decode(y?.description)} /></p>
                                                        ))}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => !x.isInclusion).length > 0 && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Exclusion</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>
                                                        {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => !y.isInclusion && (
                                                          <p><HtmlParser text={decode(y?.description)} /></p>
                                                        ))}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.images && packageDetails.images.length > 0 && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Photo Gallery</b>
                                                  <style>{priceGuidelineStyle}</style>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        {packageDetails.images && packageDetails.images.map((item, key) => (

                                                          <img
                                                            style={{ float: "left", padding: "5px", width: "20%", height: "150px" }}
                                                            key={key}
                                                            id={"largeImg" + key}
                                                            src={item.imagepath}
                                                            alt=""
                                                          />
                                                        ))}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.twPriceGuideLine && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Price Guidelines</b>
                                                  <style>{priceGuidelineStyle}</style>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser text={decode(packageDetails.twPriceGuideLine).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")} />
                                                        {/* <HtmlParser
                                                          text={decode(packageDetails.twPriceGuideLine)}
                                                        /> */}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          )}
                                          {packageDetails.termsConditions && (
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Terms & Conditions</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.termsConditions)}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>)}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px", paddingTop: "20px" }}>
                                              <span>Thank You,</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
                                              {this.props.userInfo?.provider?.logo?.url ? (
                                                <img
                                                  src={this.props.userInfo?.provider?.logo?.url}
                                                  height="42px"
                                                  style={{ height: "42px" }}
                                                  alt=""
                                                />
                                              ) : (
                                                <h6
                                                  style={{
                                                    background: "#f8f9fa",
                                                    border: "solid 2px #dee2e6",
                                                    borderRadius: "4px",
                                                    float: "left",
                                                    padding: "8px",
                                                    color: "rgb(241, 130, 71)",
                                                    margin: "0px",
                                                    fontSize: "18px",
                                                  }}
                                                >
                                                  {this.props.userInfo?.provider?.name}
                                                </h6>
                                              )}
                                            </td>
                                          </tr>

                                          <tr>
                                            <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
                                              <b>{this.props.userInfo?.provider?.name}</b>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>{this.props.userInfo?.location?.address}</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>
                                                Phone :{" "}
                                                {(this.props.userInfo?.contactInformation?.phoneNumberCountryCode
                                                  ? this.props.userInfo?.contactInformation?.phoneNumberCountryCode + " "
                                                  : "") + this.props.userInfo?.contactInformation?.phoneNumber}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>
                                                Email :{" "}
                                                <a
                                                  href={
                                                    "mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")
                                                  }
                                                >
                                                  {this.props.userInfo?.contactInformation?.email}
                                                </a>
                                              </span>
                                            </td>
                                          </tr>
                                          {this?.props?.userInfo?.websiteURL &&
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                <span>
                                                  Website :{" "}
                                                  <a
                                                    href={this?.props?.userInfo?.websiteURL}
                                                    target="_blank"
                                                  >
                                                    {this?.props?.userInfo?.websiteURL}
                                                  </a>
                                                </span>
                                              </td>
                                            </tr>}
                                          <tr>
                                            <td className="d-flex justify-content-start mb-2">
                                              {this?.props?.userInfo?.facebookURL &&
                                                <a
                                                  target="_blank"
                                                  href={this?.props?.userInfo?.facebookURL}
                                                  className="shadow-sm"
                                                >
                                                  <img className='img-responsive mr-1'
                                                    width="30"
                                                    style={{ filter: "none" }}
                                                    src={Facebook}></img> </a>
                                              }
                                              {this?.props?.userInfo?.instagramURL &&
                                                <a
                                                  target="_blank"
                                                  href={this?.props?.userInfo?.instagramURL}
                                                  className="shadow-sm"
                                                >
                                                  <img width="30"
                                                    className='img-responsive mr-1'
                                                    style={{ filter: "none" }}
                                                    src={Instagram}
                                                  />
                                                </a>
                                              }
                                              {this?.props?.userInfo?.linkedinURL &&
                                                <a
                                                  href={this?.props?.userInfo?.linkedinURL}
                                                  target="_blank"
                                                  className="shadow-sm"
                                                >
                                                  <img width="30"
                                                    className='img-responsive mr-1'
                                                    style={{ filter: "none" }}
                                                    src={Linkedin}
                                                  />
                                                </a>
                                              }
                                            </td>
                                          </tr>
                                          {this?.props?.userInfo &&
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                <span>
                                                  <b>Contact Informations</b>
                                                </span>
                                              </td>
                                            </tr>}
                                          {this?.props?.userInfo &&
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                <span>
                                                  {this?.props?.userInfo?.logggedInUserdetails?.firstName + ' ' + this?.props?.userInfo?.logggedInUserdetails?.lastName}
                                                </span>
                                              </td>
                                            </tr>}
                                          {this?.props?.userInfo &&
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                <span>
                                                  Email :{" "}
                                                  <a
                                                    href={
                                                      "mailto:" + this?.props?.userInfo?.logggedInUserdetails?.emailID
                                                    }
                                                  >
                                                    {this?.props?.userInfo?.logggedInUserdetails?.emailID}
                                                  </a>
                                                </span>
                                              </td>
                                            </tr>}
                                          {this?.props?.userInfo &&
                                            <tr>
                                              <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                <span>
                                                  Phone :{" "}
                                                  {this?.props?.userInfo?.logggedInUserdetails?.cellPhone}
                                                </span>
                                              </td>
                                            </tr>}
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          {isSupplieritinerany &&
            <div className="model-popup">
              <div className="modal fade show d-block" tabindex='-1'>
                <div
                  className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{"Send Package to Supplier"}</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={this.packageSupplieritinerany}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div id="emailHTML" className="m-4">
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
                                <table
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border="0"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
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

                                                {this?.props?.userInfo?.provider?.logo
                                                  ?.url ? (
                                                  <img
                                                    src={
                                                      this?.props?.userInfo?.provider
                                                        ?.logo?.url
                                                    }
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
                                                ) : (
                                                  <h5
                                                    style={{
                                                      background: "#fff",
                                                      borderRadius: "4px",
                                                      float: "right",
                                                      padding: "4px 4px 6px 4px",
                                                      color: "rgb(241, 130, 71)",
                                                      margin: "0px",
                                                    }}
                                                  >
                                                    {this.props.userInfo.provider.name}
                                                  </h5>
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td style={{ padding: "16px" }}>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>Dear Vendor/Supplier,</span>
                                                      </td>
                                                    </tr>

                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        {this.state.data.supplieremailtermsconditions === "" &&

                                                          <span>
                                                            We have a received a request for package. Below are the details requested for your review:
                                                          </span>
                                                        }
                                                        {this.state.data.supplieremailtermsconditions !== "" &&
                                                          <span>
                                                            {this.state.data.supplieremailtermsconditions}
                                                          </span>
                                                        }
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <div style={{
                                                  width: "50%", float: "left", padding: "0px", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", background: "rgb(67, 76, 91, 0.5)",
                                                  boxSizing: "border-box", width: "100%", height: "200px", backgroundSize: "cover", boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)", background: `url(${packageDetails.smallImagePath})`
                                                }}>


                                                  <h4 style={{ marginTop: "22px", textTransform: "uppercase" }}>
                                                    {packageDetails && packageDetails.shortDescription}</h4>
                                                  {packageDetails.rating > 0 && (<div className="mt-1 mb-1"> {
                                                    this.generateStartRating(packageDetails.rating)} </div>)}

                                                  {packageDetails.specialPromotionType && <div className="text-white mt-2 text-center"><small className="">
                                                    Package Type:{" "}
                                                    <b>{packageDetails.specialPromotionType} </b>
                                                  </small></div>}
                                                  <div className=" mt-2" style={{ margin: "10px 0px" }} >
                                                    <small>
                                                      <b>
                                                        Start Date:{" "}
                                                        <Date date={packageDetails.validFrom}></Date>
                                                      </b>
                                                    </small>
                                                    <span> - </span>
                                                    <small className="mt-2" >
                                                      <b>
                                                        End Date:{" "}
                                                        <Date date={packageDetails.validTo}></Date>
                                                      </b>
                                                    </small>
                                                    {/* <small className="ml-4">
                                            No of Days: <b>
                                              {5}</b>
                                          </small> */}
                                                  </div>

                                                  {/* <span style={{ width: "100%", padding: "5px 0px" }}>
                                                  <HtmlParser text={decode(packageDetails.summaryDescription)} />
                                                </span> */}
                                                  <div className="text-white mt-0 text-center">
                                                    {parseInt(JSON.parse(packageDetails.twOthers)?.Adults) > 0 && <small className="mr-3">
                                                      Adults:{" "}
                                                      <b>{JSON.parse(packageDetails.twOthers).Adults}
                                                      </b>
                                                    </small>}
                                                    {parseInt(JSON.parse(packageDetails.twOthers)?.Child) > 0 && <small className="mr-3">
                                                      Children:{" "}
                                                      <b>{JSON.parse(packageDetails.twOthers).Child}
                                                      </b>
                                                    </small>}
                                                    {parseInt(JSON.parse(packageDetails.twOthers)?.Infants) > 0 && <small className="mr-3">
                                                      Infants:{" "}
                                                      <b>{JSON.parse(packageDetails.twOthers).Infants}
                                                      </b>
                                                    </small>}
                                                  </div>
                                                </div>
                                                <div style={{ width: "50%", float: "left", position: "absolute", width: "100%", height: "212px", zIndex: "-1" }}>
                                                  <img src={packageDetails.smallImagePath} alt="" style={{ width: "763px", height: "230px" }} />
                                                </div>
                                              </td>
                                            </tr>
                                            {packageDetails.summaryDescription && (
                                              <tr>
                                                <td>
                                                  <br />
                                                  <div
                                                    style={{
                                                      background: "#f1f1f1",
                                                      padding: "8px",
                                                      borderRadius: "4px",
                                                    }}
                                                  >
                                                    <b>Overview</b>
                                                  </div>

                                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                    <tbody>
                                                      <tr>
                                                        <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                          <HtmlParser
                                                            text={decode(packageDetails.summaryDescription)}
                                                          />
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            )}

                                            <tr>
                                              <td>
                                                <table
                                                  cellPadding="0"
                                                  cellSpacing="0"
                                                  border="0"
                                                  width="100%"
                                                >
                                                  <tbody>
                                                    {packageDetails.description && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Itinerary</b>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  <HtmlParser
                                                                    text={decode(packageDetails.description)}
                                                                  />
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>

                                                    )}
                                                    {packageDetails.flight && packageDetails.flight != undefined && packageDetails.flight != "" && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Flight Details</b>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  <HtmlParser
                                                                    text={decode(packageDetails.flight)}
                                                                  />
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {packageDetails.hotelDetails && packageDetails.hotelDetails != undefined && packageDetails.hotelDetails != "" && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Hotel Details</b>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  <HtmlParser
                                                                    text={decode(packageDetails.hotelDetails)}
                                                                  />
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => x.isInclusion).length > 0 && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Inclusion</b>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  <ul>
                                                                    {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => y.isInclusion && (
                                                                      <li><HtmlParser
                                                                        text={decode(y?.description)} /></li>
                                                                    ))}
                                                                  </ul>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => !x.isInclusion).length > 0 && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Exclusion</b>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  <ul>
                                                                    {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => !y.isInclusion && (
                                                                      <li><HtmlParser
                                                                        text={decode(y?.description)} /></li>
                                                                    ))}
                                                                  </ul>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {packageDetails.images.length > 0 && (
                                                      <tr>
                                                        <td>
                                                          <br />
                                                          <div
                                                            style={{
                                                              background: "#f1f1f1",
                                                              padding: "8px",
                                                              borderRadius: "4px",
                                                            }}
                                                          >
                                                            <b>Photo Gallery</b>
                                                            <style>{priceGuidelineStyle}</style>
                                                          </div>

                                                          <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                            <tbody>
                                                              <tr>
                                                                <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                                  {packageDetails.images && packageDetails.images.map((item, key) => (

                                                                    <img
                                                                      style={{ float: "left", padding: "5px", width: "20%", height: "150px" }}
                                                                      key={key}
                                                                      id={"largeImg" + key}
                                                                      src={item.imagepath}
                                                                      alt=""
                                                                    />
                                                                  ))}
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    )}
                                                    {/* {packageDetails.termsConditions && (
                                                <tr>
                                                      <td>
                                                        <br />
                                                        <div
                                                          style={{
                                                            background: "#f1f1f1",
                                                            padding: "8px",
                                                            borderRadius: "4px",
                                                          }}
                                                        >
                                                          <b>Terms & Conditions</b>
                                                        </div>
                                                        
                                                        <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                          <tbody>
                                                            <tr>
                                                              <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>
                                                                
                                          <HtmlParser
                                            text={decode(packageDetails.termsConditions)}
                                          />  
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                    )} */}
                                                    <tr>
                                                      <td>
                                                        <br />
                                                        <table
                                                          cellPadding="8"
                                                          cellSpacing="0"
                                                          border="0"
                                                          width="100%"
                                                          style={{
                                                            background: "#f1f1f1",
                                                            borderRadius: "4px",
                                                          }}
                                                        >
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>

                                            <tr>
                                              <td>
                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ padding: "9px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>Please confirm the above details so we can inform the details to customer.</span>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>Thank You,</span>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
                                                        {this?.props?.userInfo?.provider?.logo?.url ? (
                                                          <img
                                                            src={this?.props?.userInfo?.provider?.logo?.url}
                                                            height="42px"
                                                            style={{ height: "42px" }}
                                                            alt=""
                                                          />
                                                        ) : (
                                                          <h6
                                                            style={{
                                                              background: "#f8f9fa",
                                                              border: "solid 2px #dee2e6",
                                                              borderRadius: "4px",
                                                              float: "left",
                                                              padding: "8px",
                                                              color: "rgb(241, 130, 71)",
                                                              margin: "0px",
                                                              fontSize: "18px",
                                                            }}
                                                          >
                                                            {this?.props?.userInfo?.provider?.name}
                                                          </h6>
                                                        )}
                                                      </td>
                                                    </tr>

                                                    <tr>
                                                      <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
                                                        <b>{this?.props?.userInfo?.provider?.name}</b>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>{this?.props?.userInfo?.location?.address}</span>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>
                                                          Phone :{" "}
                                                          {(this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode
                                                            ? this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode + " "
                                                            : "") + this?.props?.userInfo?.contactInformation?.phoneNumber}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                        <span>
                                                          Email :{" "}
                                                          <a
                                                            href={
                                                              "mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")
                                                            }
                                                          >
                                                            {this?.props?.userInfo?.contactInformation?.email}
                                                          </a>
                                                        </span>
                                                      </td>
                                                    </tr>
                                                    {this?.props?.userInfo?.websiteURL &&
                                                      <tr>
                                                        <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                                          <span>
                                                            Website :{" "}
                                                            <a
                                                              href={this?.props?.userInfo?.websiteURL}
                                                              target="_blank"
                                                            >
                                                              {this?.props?.userInfo?.websiteURL}
                                                            </a>
                                                          </span>
                                                        </td>
                                                      </tr>}
                                                    <tr>
                                                      <td style={{ padding: "0px 0px 8px 0px" }}>
                                                        <span></span>
                                                        {this?.props?.userInfo?.facebookURL &&
                                                          <a
                                                            target="_blank"
                                                            href={this?.props?.userInfo?.facebookURL}
                                                            className="shadow-sm"
                                                          >
                                                            <img className='img-responsive mr-1' width="24"
                                                              style={{ filter: "none" }} src={Facebook} alt="Facebook"></img> </a>
                                                        }
                                                        <span></span>
                                                        {this?.props?.userInfo?.instagramURL &&
                                                          <a
                                                            target="_blank"
                                                            href={this?.props?.userInfo?.instagramURL}
                                                            className="shadow-sm"
                                                          >
                                                            <img width="24"
                                                              className='img-responsive mr-1'
                                                              style={{ filter: "none" }}
                                                              src={Instagram}
                                                            />
                                                          </a>
                                                        }
                                                        <span></span>
                                                        {this?.props?.userInfo?.linkedinURL &&
                                                          <a
                                                            href={this?.props?.userInfo?.linkedinURL}
                                                            target="_blank"
                                                            className="shadow-sm"
                                                          >
                                                            <img width="24"
                                                              className='img-responsive mr-1'
                                                              style={{ filter: "none" }}
                                                              src={Linkedin}
                                                            />
                                                          </a>
                                                        }
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
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-lg-12" style={{ marginTop: "15px" }}>
                        {this.renderInput("supplieremail", "Email* " + " (" + Trans("_sendEmailTemplateMessage") + ")")}
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
                          )} Send Email </button>
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
                width="800px"
                style={{ border: "solid 2px #434C5B" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border="0"
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border="0"
                                width="100%"
                              >
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

                                      {this?.props?.userInfo?.provider?.logo
                                        ?.url ? (
                                        <img
                                          src={
                                            this?.props?.userInfo?.provider
                                              ?.logo?.url
                                          }
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
                                      ) : (
                                        <h5
                                          style={{
                                            background: "#fff",
                                            borderRadius: "4px",
                                            float: "right",
                                            padding: "4px 4px 6px 4px",
                                            color: "rgb(241, 130, 71)",
                                            margin: "0px",
                                          }}
                                        >
                                          {this.props.userInfo?.provider?.name}
                                        </h5>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ padding: "16px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border="0"
                                width="100%"
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>Dear Vendor/Supplier,</span>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              {this.state.data.supplieremailtermsconditions === "" &&

                                                <span>
                                                  We have a received a request for package. Below are the details requested for your review:
                                                </span>
                                              }
                                              {this.state.data.supplieremailtermsconditions !== "" &&
                                                <span>
                                                  {this.state.data.supplieremailtermsconditions}
                                                </span>
                                              }
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div style={{ width: "50%", float: "left", padding: "0px 7px", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", background: "rgb(67, 76, 91, 0.5)", boxSizing: "border-box", width: "100%", height: "200px" }}>


                                        <h4 style={{ marginTop: "22px", textTransform: "uppercase" }}>
                                          {packageDetails && packageDetails.shortDescription}</h4>
                                        {packageDetails.rating > 0 && (<div className="mt-1"> {
                                          this.generateStartRating(packageDetails.rating)} </div>)}

                                        {packageDetails.specialPromotionType && <div className="text-white mt-1 text-center"><small className="">
                                          Package Type:{" "}
                                          <b>{packageDetails.specialPromotionType} </b>
                                        </small></div>}
                                        <div className=" mt-1" style={{ margin: "10px 0px" }} >
                                          <small>
                                            <b>
                                              Start Date:{" "}
                                              <Date date={packageDetails.validFrom}></Date>
                                            </b>
                                          </small>
                                          <span> - </span>
                                          <small className="mt-2" >
                                            <b>
                                              End Date:{" "}
                                              <Date date={packageDetails.validTo}></Date>
                                            </b>
                                          </small>
                                          {/* <small className="ml-4">
                                            No of Days: <b>
                                              {5}</b>
                                          </small> */}
                                        </div>

                                        {/* <span style={{ width: "100%", padding: "5px 0px" }}>
                                                  <HtmlParser text={decode(packageDetails.summaryDescription)} />
                                                </span> */}
                                        {packageDetails.price > 0 && <h4 style={{}}>
                                          <Amount
                                            amount={packageDetails.price} currencySymbol={packageDetails.symbol}
                                          /></h4>}
                                      </div>
                                      <div style={{ width: "50%", float: "left", position: "absolute", width: "100%", height: "212px", zIndex: "-1" }}>
                                        <img src={packageDetails.smallImagePath} alt="" style={{ width: "763px", height: "200px" }} />
                                      </div>
                                    </td>
                                  </tr>
                                  {packageDetails.summaryDescription && (
                                    <tr>
                                      <td>
                                        <br />
                                        <div
                                          style={{
                                            background: "#f1f1f1",
                                            padding: "8px",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          <b>Overview</b>
                                        </div>

                                        <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                          <tbody>
                                            <tr>
                                              <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                <HtmlParser
                                                  text={decode(packageDetails.summaryDescription)}
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  )}
                                  {packageDetails.description && (
                                    <tr>
                                      <td>
                                        <table
                                          cellPadding="0"
                                          cellSpacing="0"
                                          border="0"
                                          width="100%"
                                        >
                                          <tbody>
                                            <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Itinerary</b>
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                        <HtmlParser
                                                          text={decode(packageDetails.description)}
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => x.isInclusion).length > 0 && (
                                              <tr>
                                                <td>
                                                  <br />
                                                  <div
                                                    style={{
                                                      background: "#f1f1f1",
                                                      padding: "8px",
                                                      borderRadius: "4px",
                                                    }}
                                                  >
                                                    <b>Inclusion</b>
                                                  </div>

                                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%" }}>
                                                    <tbody>
                                                      <tr>
                                                        <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                          <ul>
                                                            {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => y.isInclusion && (
                                                              <li>{y?.description}</li>
                                                            ))}
                                                          </ul>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            )}
                                            {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.filter((x) => !x.isInclusion).length > 0 && (
                                              <tr>
                                                <td>
                                                  <br />
                                                  <div
                                                    style={{
                                                      background: "#f1f1f1",
                                                      padding: "8px",
                                                      borderRadius: "4px",
                                                    }}
                                                  >
                                                    <b>Exclusion</b>
                                                  </div>

                                                  <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                    <tbody>
                                                      <tr>
                                                        <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>

                                                          <ul>
                                                            {packageDetails.inclusionExclusion && packageDetails.inclusionExclusion.map((y) => !y.isInclusion && (
                                                              <li>{y?.description}</li>
                                                            ))}
                                                          </ul>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            )}
                                            {/* {packageDetails.termsConditions && (
                                        <tr>
                                              <td>
                                                <br />
                                                <div
                                                  style={{
                                                    background: "#f1f1f1",
                                                    padding: "8px",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                  <b>Terms & Conditions</b>
                                                </div>
                                                
                                                <table cellPadding="0" cellSpacing="0" border="0" width="100%" style={{ width: "100%", padding: "8px" }}>
                                                  <tbody>
                                                    <tr>
                                                      <td style={{ width: "100%", padding: "8px", border: "1px solid #f1f1f1" }}>
                                                        
                                  <HtmlParser
                                    text={decode(packageDetails.termsConditions)}
                                  />  
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                            )} */}
                                            <tr>
                                              <td>
                                                <br />
                                                <table
                                                  cellPadding="8"
                                                  cellSpacing="0"
                                                  border="0"
                                                  width="100%"
                                                  style={{
                                                    background: "#f1f1f1",
                                                    borderRadius: "4px",
                                                  }}
                                                >
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  )}

                                  <tr>
                                    <td>
                                      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "9px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>Please confirm the above details so we can inform the details to customer.</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>Thank You,</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "16px 0px 8px 0px", fontSize: "14px" }}>
                                              {this?.props?.userInfo?.provider?.logo?.url ? (
                                                <img
                                                  src={this?.props?.userInfo?.provider?.logo?.url}
                                                  height="42px"
                                                  style={{ height: "42px" }}
                                                  alt=""
                                                />
                                              ) : (
                                                <h6
                                                  style={{
                                                    background: "#f8f9fa",
                                                    border: "solid 2px #dee2e6",
                                                    borderRadius: "4px",
                                                    float: "left",
                                                    padding: "8px",
                                                    color: "rgb(241, 130, 71)",
                                                    margin: "0px",
                                                    fontSize: "18px",
                                                  }}
                                                >
                                                  {this?.props?.userInfo?.provider?.name}
                                                </h6>
                                              )}
                                            </td>
                                          </tr>

                                          <tr>
                                            <td style={{ padding: "0px 0px 4px 0px", fontSize: "14px" }}>
                                              <b>{this?.props?.userInfo?.provider?.name}</b>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>{this?.props?.userInfo?.location?.address}</span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>
                                                Phone :{" "}
                                                {(this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode
                                                  ? this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode + " "
                                                  : "") + this?.props?.userInfo?.contactInformation?.phoneNumber}
                                              </span>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "0px 0px 8px 0px", fontSize: "14px" }}>
                                              <span>
                                                Email :{" "}
                                                <a
                                                  href={
                                                    "mailto:" + Global.getEnvironmetKeyValue("customerCareEmail")
                                                  }
                                                >
                                                  {this?.props?.userInfo?.contactInformation?.email}
                                                </a>
                                              </span>
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

export default PackageEmail;
