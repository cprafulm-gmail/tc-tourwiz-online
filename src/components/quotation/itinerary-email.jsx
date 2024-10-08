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
import QuotationEmailItemsOffline from "./quotation-email-items-offline";
import QuotationEmailItemsOfflineSupplier from "./quotation-email-items-offline-supplier";
import QuotationEmailItemsFromList from "./quotation-email-items-fromlist";
import Amount from "../../helpers/amount";
import ComingSoon from "../../helpers/coming-soon";
import { Trans } from "../../helpers/translate";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { getLocalhostUrlFromEndPoints } from "../../services/get-localhost-url-from-end-points";
import HtmlParser from "../../helpers/html-parser";

class ItineraryEmail extends Form {
  state = {
    isSupplieritinerany: false,
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
    isHidePrice: this.props.configurations?.isShowTotalPrice,
    isShowTotalPrice: this.props.configurations?.isShowTotalPrice,
    hideItemizedPrices: !this.props.configurations?.isShowItemizedPrice,
    comingsoon: false,
    ShowhideElementname: this.props.configurations?.ShowhideElementname,
    selectedItemsforMail: [],
    isPreviewSupplierEmail: false,
    showNoItemSelectedError: false,
    showImagesInEmail: this.props.configurations?.isShowImage,
    hideAllPrices: !this.props.configurations?.isShowTotalPrice,
    showAllPrices: this.props.configurations?.isShowItemizedPrice,
    isShowFlightPrice: this.props.configurations?.isShowFlightPrices,
    isLoading: false,
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

  getselecteditems = (data) => {
    var selecteditem = this.state.selectedItemsforMail;
    if (selecteditem.filter(x => x === data).length === 0) {
      selecteditem.push(data);
    }
    else {
      selecteditem = selecteditem.map(x => { if (x !== data) return x; }).filter(Boolean);
    }

    this.setState({
      selectedItemsforMail: selecteditem
    });
  }

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
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
      IsSupplier: true,

    };

    let reqURL = process.env.REACT_APP_QUOTATION_API_ENDPOINT + "/itinerary/send";
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
      reqURL = "/itinerary/send";
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

    var emailBody = document.getElementById("emailHTML").outerHTML;

    //Info :  use below for IsShowPrice
    //   ShowPrice
    //   {
    //      ShowAll = 1,
    //      HideAll = 2,
    //      HideItemized = 3
    //  }
    var priceShowHide;
    if (this.state.showAllPrices)
      priceShowHide = 1;
    else if (this.state.hideAllPrices)
      priceShowHide = 2;
    else if (this.state.hideItemizedPrices)
      priceShowHide = 3;
    let reqOBJ = {
      id: localStorage.getItem("cartLocalId"),
      title: this.state.data.title,
      ToEmail: emailTo,
      Notes: this.state.data.terms.replaceAll("\n", "<br/>"),
      IsShowImage: this.state.showImagesInEmail,
      IsShowPrice: priceShowHide,
      itemId: this.props.items.map(item => item.offlineItem).map(item => item.uuid),
      IsSupplier: false,
      isShowFlightPrice: this.state.isShowFlightPrice
    };

    let reqURL = process.env.REACT_APP_QUOTATION_API_ENDPOINT + "/itinerary/send";
    if (process.env.NODE_ENV === "development" && process.env.REACT_APP_IS_USE_LOCAL_ENDPOINT === "true") {
      reqURL = "/itinerary/send";
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
      errors.title = this.props.type === "Itinerary"
        ? this.props.type + " title required"
        : this.props.type === "Itinerary_Master"
          ? "Itinerary Master title required"
          : this.props.type + " title required";


    // errors.title = Trans("_quotationReplaceKeys") + " title required";
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
      errors: {},
      showNoItemSelectedError: false
    });
    setTimeout(() => {
      this.setState({ isSucessMsg: false });
    }, 5000);
  };

  quotationEmailPreview = () => {
    this.setState({
      isEmailPreview: !this.state.isEmailPreview,
      isSupplieritinerany: false
    });
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    quotationInfo.terms = this.state.data.terms.replaceAll("\n", "<br/>");
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    //this.props.saveQuotation();
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

  handlePrices = (e) => {
    let target = e.target;
    if (target.name === "showAllPrices") {
      if (target.checked === true) {
        this.setState({
          showAllPrices: true,
          isShowFlightPrice: false,
          hideItemizedPrices: false,
          hideAllPrices: false,
          isHidePrice: false,
          ShowhideElementname: "showAllPrices",
        });
      } else {
        this.setState({
          showAllPrices: false,
          isShowFlightPrice: false,
          hideItemizedPrices: false,
          hideAllPrices: false,
          isHidePrice: false,
          ShowhideElementname: "",
        });
      }
    }

    if (target.name === "hideItemizedPrices") {
      if (target.checked === true) {
        this.setState({
          showAllPrices: false,
          isShowFlightPrice: false,
          hideItemizedPrices: true,
          hideAllPrices: false,
          isHidePrice: true,
          ShowhideElementname: "hideItemizedPrices",
        });
      } else {
        this.setState({
          showAllPrices: false,
          hideItemizedPrices: false,
          hideAllPrices: false,
          isHidePrice: false,
          ShowhideElementname: "",
        });
      }
    }
    if (target.name === "hideAllPrices") {
      if (target.checked === true) {
        this.setState({
          showAllPrices: false,
          isShowFlightPrice: false,
          hideItemizedPrices: false,
          hideAllPrices: true,
          isHidePrice: false,
          ShowhideElementname: "hideAllPrices",
        });
      } else {
        this.setState({
          showAllPrices: false,
          hideItemizedPrices: false,
          hideAllPrices: false,
          isHidePrice: false,
          ShowhideElementname: "",
        });
      }
    }
    if (target.name === "isShowFlightPrice") {
      if (target.checked === true) {
        this.setState({
          showAllPrices: false,
          isShowFlightPrice: true,
          ShowhideElementname: "isShowFlightPrice",
        });
      }
      else {
        this.setState({
          showAllPrices: false,
          isShowFlightPrice: false,
          ShowhideElementname: "",
        });
      }
    }
  };

  componentDidMount() {
    this.setData();
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  itineraryData = (day, items, isHidePrice, showImagesInEmail, ShowhideElementname) => {
    let itineraryEmailItems = [];
    {
      items.map(
        (item, key) => {
          if (item.offlineItem.business === "air" &&
            Number(day + 1) ===
            Number(
              items &&
              item.offlineItem
                .dayDepart
            ))
            itineraryEmailItems.push(<QuotationEmailItemsOffline
              handleItemDelete={this.handleItemDelete}
              item={item}
              isHidePrice={isHidePrice}
              showImagesInEmail={showImagesInEmail}
              ShowhideElementname={ShowhideElementname}
              type={"ItineraryItem"}
              departFlight={
                Number(
                  day + 1
                ) ===
                Number(
                  items &&
                    item
                      .offlineItem
                      .dayReturn
                    ? true
                    : false
                )
              }
              returnFlight={
                Number(
                  day + 1
                ) !==
                Number(
                  items &&
                    item
                      .offlineItem
                      .dayReturn
                    ? true
                    : false
                )
              }
              isRemovePriceAndActionButton={true}
            />
            )


          if (item.offlineItem.business === "air" &&
            item.offlineItem
              .isRoundTrip &&
            Number(day + 1) ===
            Number(
              items &&
              item.offlineItem
                .dayReturn
            ))
            itineraryEmailItems.push(<QuotationEmailItemsOffline
              handleItemDelete={this.handleItemDelete}
              item={item}
              isHidePrice={isHidePrice}
              showImagesInEmail={showImagesInEmail}
              ShowhideElementname={ShowhideElementname}
              type={"ItineraryItem"}
              departFlight={
                Number(day + 1) ===
                Number(
                  items &&
                    item
                      .offlineItem
                      .dayReturn
                    ? true
                    : false
                )
              }
              returnFlight={
                Number(
                  day + 1
                ) !==
                Number(
                  items &&
                    item
                      .offlineItem
                      .dayReturn
                    ? true
                    : false
                )
              }
              isRemovePriceAndActionButton={true}
            />)

          if (item.offlineItem.business === "hotel" &&
            Number(day + 1) > Number(items && item.offlineItem.day) &&
            Number(day + 1) < Number(items && Number(item.offlineItem.day) + Number(item.offlineItem.nights)))
            itineraryEmailItems.push(<QuotationEmailItemsOffline
              handleItemDelete={this.handleItemDelete}
              item={item}
              isHidePrice={isHidePrice}
              showImagesInEmail={showImagesInEmail}
              ShowhideElementname={ShowhideElementname}
              type={"ItineraryItem"}
              isRemovePriceAndActionButton={false}
            />)

          if (item.offlineItem.business !== "air" &&
            Number(day + 1) ===
            Number(item.offlineItem.day === "All Days" ? 1 :
              items &&
              item.offlineItem
                .day
            ))
            itineraryEmailItems.push(<QuotationEmailItemsOffline
              handleItemDelete={this.handleItemDelete}
              item={item}
              isHidePrice={isHidePrice}
              showImagesInEmail={showImagesInEmail}
              ShowhideElementname={ShowhideElementname}
              type={"ItineraryItem"}
              isRemovePriceAndActionButton={true}

            />)
          return items;
        });
      return itineraryEmailItems
    }
  }
  render() {
    const { items, type, duration, userInfo } = this.props;
    const {
      isLoading,
    } = this.state;
    const { isSupplieritinerany, isPreviewSupplierEmail, isSucessMsg, isEmailPreview, saveMode, isHidePrice, ShowhideElementname, showImagesInEmail } = this.state;
    const count = Math.ceil(duration);
    const totalDays = [...Array(count).keys()];
    let totalPrice = 0;
    // items.map(
    //   (item) =>
    //     item.offlineItem &&
    //     (totalPrice = Number(totalPrice) + Number(item.offlineItem.sellPrice))
    // );
    items.map(
      (item) =>
        item.offlineItem && (totalPrice = Number(totalPrice) +
          (Number(item.offlineItem.totalAmount) > 0 ? Number(item.offlineItem.totalAmount) : Number(item.offlineItem.sellPrice))
        ))
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
            <h6 className="font-weight-bold m-0 p-0">{type === "Itinerary_Master" ? "Itinerary Master" : type} Email</h6>
          </div>

          <button
            className="btn btn-sm border bg-white"
            onClick={this.props.sendEmail}
          >
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
              {this.renderInput("title", "Itinerary Title *")}
              {this.renderInput("email", "Email *" + " (" + Trans("_sendEmailTemplateMessage") + ")")}
            </div>
            <div className="col-lg-6 quotation-email">
              {this.renderTextarea("terms", "Email Notes")}
            </div>
          </div>

          {isSucessMsg && (
            <h6 className="alert alert-success mt-3">
              {type === "Itinerary_Master"
                ? "Itinerary Master"
                : (type === "Quotation_Master"
                  ? "Master " + Trans("_quotationReplaceKey")
                  : type)} {saveMode && "Save and "} Sent Successfully!
            </h6>
          )}

          <div className="mt-2">
            {/* <AuthorizeComponent title={type === 'Itinerary' ? "QuotationDetails~itinerary-preview-email" : "QuotationDetails~master-itinerary-preview-email"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                type === 'Itinerary'
                  ? "QuotationDetails~itinerary-preview-email"
                  : "QuotationDetails~master-itinerary-preview-email")
                ? this.quotationEmailPreview()
                : this.setState({ isshowauthorizepopup: true })
              }
            >
              Preview Email
            </button>
            {/* </AuthorizeComponent> */}
            {/* <AuthorizeComponent title={type === 'Itinerary' ? "QuotationDetails~itinerary-send-customer" : "QuotationDetails~master-itinerary-send-customer"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                type === 'Itinerary'
                  ? "QuotationDetails~itinerary-send-customer"
                  : "QuotationDetails~master-itinerary-send-customer")
                ? this.handleSendEmail()
                : this.setState({ isshowauthorizepopup: true })
              }
            >
              {isLoading && (
                <span className="spinner-border spinner-border-sm mr-2"></span>
              )}
              Send {type === "Itinerary_Master" ? "Itinerary Master" : type}
            </button>
            {/* </AuthorizeComponent> */}
            {/* <AuthorizeComponent title={type === 'Itinerary' ? "QuotationDetails~itinerary-send-supplier" : "QuotationDetails~master-itinerary-send-supplier"} type="button" rolepermissions={userInfo.rolePermissions}> */}
            <button
              className="btn btn-sm btn-primary mr-3"
              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                type === 'Itinerary'
                  ? "QuotationDetails~itinerary-send-supplier"
                  : "QuotationDetails~master-itinerary-send-supplier")
                ? this.quotationSupplieritinerany()
                : this.setState({ isshowauthorizepopup: true })
              }
            >
              Send {type === "Itinerary_Master" ? "Itinerary Master" : type} to Supplier
            </button>
            {/* </AuthorizeComponent> */}
          </div>

          {this.state.comingsoon && (
            <ComingSoon handleComingSoon={this.handleComingSoon} />
          )}
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
                                      <QuotationEmailHeader {...this.props} />
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
                                          {totalDays.map((day, key) => {
                                            var itineraryItems = this.itineraryData(day, items, isHidePrice, showImagesInEmail, ShowhideElementname);
                                            return (<tr key={key}>
                                              <td>
                                                {(itineraryItems.length > 0 || items.length === 0) &&
                                                  <div
                                                    style={{
                                                      background: "#f1f1f1",
                                                      padding: "8px",
                                                      borderRadius: "4px",
                                                    }}
                                                  >
                                                    <b>Day {day + 1}</b>
                                                  </div>}

                                                {itineraryItems}
                                              </td>
                                            </tr>)
                                          })}

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
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <b
                                                        style={{
                                                          fontSize: "20px",
                                                        }}
                                                      >
                                                        {this.state.data.title}
                                                      </b>
                                                    </td>
                                                    {(this.state.isShowTotalPrice === true) && (
                                                      <td align="right">
                                                        <b
                                                          style={{
                                                            fontSize: "20px",
                                                            color:
                                                              "rgb(241, 130, 71)",
                                                          }}
                                                        >
                                                          Total Price :{" "}
                                                          <Amount
                                                            amount={totalPrice}
                                                          />
                                                        </b>
                                                      </td>
                                                    )}
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
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

          {isSupplieritinerany &&
            <div className="model-popup">
              <div className="modal fade show d-block" tabindex='-1'>
                <div
                  className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{"Send Itinerary to Supplier"}</h5>
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
                                                <QuotationEmailSupplierHeader {...this.props} supplieremailtermsconditions={this.state.data.supplieremailtermsconditions} />
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
                                                    {totalDays.map((day, key) => {
                                                      return <tr key={key}>
                                                        <td>
                                                          {items.map(
                                                            (item, key) =>
                                                              item.offlineItem && (
                                                                <React.Fragment key={key}>
                                                                  {item.offlineItem
                                                                    .business === "air" &&
                                                                    Number(day + 1) ===
                                                                    Number(
                                                                      items &&
                                                                      item.offlineItem
                                                                        .dayDepart
                                                                    ) && (
                                                                      <QuotationEmailItemsOfflineSupplier
                                                                        handleItemDelete={
                                                                          this
                                                                            .handleItemDelete
                                                                        }
                                                                        getselecteditems={this.getselecteditems}
                                                                        item={item}
                                                                        selectedItemsforMail={this.state.selectedItemsforMail}
                                                                        isHidePrice={
                                                                          isHidePrice
                                                                        }
                                                                        showImagesInEmail={showImagesInEmail}
                                                                        ShowhideElementname={ShowhideElementname}
                                                                        type={
                                                                          "ItineraryItem"
                                                                        }
                                                                        departFlight={
                                                                          Number(
                                                                            day + 1
                                                                          ) ===
                                                                          Number(
                                                                            items &&
                                                                              item
                                                                                .offlineItem
                                                                                .dayReturn
                                                                              ? true
                                                                              : false
                                                                          )
                                                                        }
                                                                        returnFlight={
                                                                          Number(
                                                                            day + 1
                                                                          ) !==
                                                                          Number(
                                                                            items &&
                                                                              item
                                                                                .offlineItem
                                                                                .dayReturn
                                                                              ? true
                                                                              : false
                                                                          )
                                                                        }
                                                                      />
                                                                    )}

                                                                  {item.offlineItem
                                                                    .business === "air" &&
                                                                    item.offlineItem
                                                                      .isRoundTrip &&
                                                                    Number(day + 1) ===
                                                                    Number(
                                                                      items &&
                                                                      item.offlineItem
                                                                        .dayReturn
                                                                    ) && (
                                                                      <QuotationEmailItemsOfflineSupplier
                                                                        handleItemDelete={
                                                                          this
                                                                            .handleItemDelete
                                                                        }
                                                                        getselecteditems={this.getselecteditems}
                                                                        selectedItemsforMail={this.state.selectedItemsforMail}
                                                                        item={item}
                                                                        isHidePrice={
                                                                          isHidePrice
                                                                        }
                                                                        showImagesInEmail={showImagesInEmail}
                                                                        ShowhideElementname={ShowhideElementname}
                                                                        type={
                                                                          "ItineraryItem"
                                                                        }
                                                                        departFlight={
                                                                          Number(
                                                                            day + 1
                                                                          ) ===
                                                                          Number(
                                                                            items &&
                                                                              item
                                                                                .offlineItem
                                                                                .dayReturn
                                                                              ? true
                                                                              : false
                                                                          )
                                                                        }
                                                                        returnFlight={
                                                                          Number(
                                                                            day + 1
                                                                          ) !==
                                                                          Number(
                                                                            items &&
                                                                              item
                                                                                .offlineItem
                                                                                .dayReturn
                                                                              ? true
                                                                              : false
                                                                          )
                                                                        }
                                                                      />
                                                                    )}

                                                                  {item.offlineItem
                                                                    .business !== "air" &&
                                                                    Number(day + 1) ===
                                                                    Number(item.offlineItem.day === "All Days" ? 1 :
                                                                      items &&
                                                                      item.offlineItem
                                                                        .day
                                                                    ) && (
                                                                      <QuotationEmailItemsOfflineSupplier
                                                                        handleItemDelete={
                                                                          this
                                                                            .handleItemDelete
                                                                        }
                                                                        getselecteditems={this.getselecteditems}
                                                                        selectedItemsforMail={this.state.selectedItemsforMail}
                                                                        item={item}
                                                                        isHidePrice={
                                                                          isHidePrice
                                                                        }
                                                                        showImagesInEmail={showImagesInEmail}
                                                                        ShowhideElementname={ShowhideElementname}
                                                                        type={
                                                                          "ItineraryItem"
                                                                        }
                                                                      />
                                                                    )}
                                                                </React.Fragment>
                                                              )
                                                          )}
                                                        </td>
                                                      </tr>
                                                    }

                                                    )}

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
                                      <QuotationEmailSupplierHeader {...this.props} supplieremailtermsconditions={this.state.data.supplieremailtermsconditions} />
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
                                          {totalDays.map((day, key) => {
                                            return <tr key={key}>
                                              <td>
                                                <br />
                                                {items.map(
                                                  (item, key) =>
                                                    item.offlineItem && (
                                                      <React.Fragment key={key}>
                                                        {item.offlineItem
                                                          .business === "air" && this.state.selectedItemsforMail.includes(item.offlineItem.uuid)
                                                          &&
                                                          Number(day + 1) ===
                                                          Number(
                                                            items &&
                                                            item.offlineItem
                                                              .dayDepart
                                                          ) && !item.offlineItem.isRoundTrip && (
                                                            <QuotationEmailItemsOfflineSupplier
                                                              handleItemDelete={
                                                                this
                                                                  .handleItemDelete
                                                              }
                                                              item={item}
                                                              isHidePrice={
                                                                isHidePrice
                                                              }
                                                              showImagesInEmail={showImagesInEmail}
                                                              ShowhideElementname={ShowhideElementname}
                                                              selectedItemsforMail={this.state.selectedItemsforMail}
                                                              type={
                                                                "ItineraryItem"
                                                              }
                                                              departFlight={
                                                                true
                                                              }
                                                              returnFlight={
                                                                false
                                                              }
                                                              isfromPreview={true}
                                                            />
                                                          )}
                                                        {item.offlineItem
                                                          .business === "air" && this.state.selectedItemsforMail.includes(item.offlineItem.uuid)
                                                          &&
                                                          Number(day + 1) ===
                                                          Number(
                                                            items &&
                                                            item.offlineItem
                                                              .dayDepart
                                                          ) && item.offlineItem.isRoundTrip && (
                                                            <QuotationEmailItemsOfflineSupplier
                                                              handleItemDelete={
                                                                this
                                                                  .handleItemDelete
                                                              }
                                                              item={item}
                                                              isHidePrice={
                                                                isHidePrice
                                                              }
                                                              showImagesInEmail={showImagesInEmail}
                                                              ShowhideElementname={ShowhideElementname}
                                                              selectedItemsforMail={this.state.selectedItemsforMail}
                                                              type={
                                                                "ItineraryItem"
                                                              }
                                                              departFlight={
                                                                true
                                                              }
                                                              returnFlight={
                                                                false
                                                              }
                                                              isfromPreview={true}
                                                            />
                                                          )}

                                                        {item.offlineItem
                                                          .business === "air" && this.state.selectedItemsforMail.includes(item.offlineItem.uuid) &&
                                                          item.offlineItem
                                                            .isRoundTrip &&
                                                          Number(day + 1) ===
                                                          Number(
                                                            items &&
                                                            item.offlineItem
                                                              .dayReturn
                                                          ) && (
                                                            <QuotationEmailItemsOfflineSupplier
                                                              handleItemDelete={
                                                                this
                                                                  .handleItemDelete
                                                              }
                                                              item={item}
                                                              isHidePrice={
                                                                isHidePrice
                                                              }
                                                              showImagesInEmail={showImagesInEmail}
                                                              ShowhideElementname={ShowhideElementname}
                                                              selectedItemsforMail={this.state.selectedItemsforMail}
                                                              type={
                                                                "ItineraryItem"
                                                              }
                                                              departFlight={
                                                                Number(day + 1) ===
                                                                Number(
                                                                  items &&
                                                                    item.offlineItem.dayReturn
                                                                    ? true
                                                                    : false
                                                                )
                                                              }
                                                              returnFlight={
                                                                Number(day + 1) !==
                                                                Number(
                                                                  items &&
                                                                    item.offlineItem.dayReturn
                                                                    ? true
                                                                    : false
                                                                )
                                                              }
                                                              isfromPreview={true}
                                                            />
                                                          )}

                                                        {item.offlineItem
                                                          .business !== "air" && this.state.selectedItemsforMail.includes(item.offlineItem.uuid) &&
                                                          Number(day + 1) ===
                                                          Number(item.offlineItem.day === "All Days" ? 1 :
                                                            items &&
                                                            item.offlineItem
                                                              .day
                                                          ) && (
                                                            <QuotationEmailItemsOfflineSupplier
                                                              handleItemDelete={
                                                                this
                                                                  .handleItemDelete
                                                              }
                                                              item={item}
                                                              isHidePrice={
                                                                isHidePrice
                                                              }
                                                              showImagesInEmail={showImagesInEmail}
                                                              ShowhideElementname={ShowhideElementname}
                                                              selectedItemsforMail={this.state.selectedItemsforMail}
                                                              type={
                                                                "ItineraryItem"
                                                              }
                                                              isfromPreview={true}
                                                            />
                                                          )}
                                                      </React.Fragment>
                                                    )
                                                )}
                                              </td>
                                            </tr>
                                          })}

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
        {this.state.isshowauthorizepopup &&
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

export default ItineraryEmail;
