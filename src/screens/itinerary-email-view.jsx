import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_LocationImage } from "../services/requester-location-img";
import QuotationItineraryDetailsItem from "../components/quotation/quotation-itinerary-details-item";
import Date from "../helpers/date";
import DateComp from "../helpers/date";
import Loader from "../components/common/loader";
import ComingSoon from "../helpers/coming-soon";
import * as Global from "../helpers/global";
import Amount from "../helpers/amount";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopup from "../helpers/model";
import Select from "react-select";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Config from "../config.json";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import Linkedin from '../assets/images/linkedin.png';
import Facebook from '../assets/images/facebook.png';
import Instagram from '../assets/images/instagram.png';
class ItineraryEmailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: "",
      offlineItems: "",
      locationImg: "",
      copyUrl: false,
      comingsoon: false,
      isprint: false,
      showImagesInPreview: true,
      currency: Global.getEnvironmetKeyValue("portalCurrencyCode"),
      conversionRate: 1,
      isShowCurrencySection: false,
      isB2B: Config.codebaseType === "tourwiz" ? true : false,
    };
  }

  handleImage = (e) => {
    this.setState({
      showImagesInPreview: e.target.checked
    });
  }

  getDetails = () => {
    var reqURL = "quotation?id=" + this.props.match.params.cartId;
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        this.getItineraryDetails(data);
      },
      "GET"
    );
  };

  getItineraryDetails = (cartDetails) => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let details = cartDetails.data;
    let info = {
      name: details.name,
      duration: details.duration,
      startDate: details.startDate,
      endDate: details.endDate,
      customerName: details.customerName,
      email: details.email,
      phone: details.phone,
      type: details.type,
      termsconditions: (!details.termsconditions && details.termsconditions === undefined) ? quotationInfo?.termsconditions : details.termsconditions,
      imageURL: cartDetails.imageURL,
      configurations: details.configurations,
      budget: quotationInfo.budget,
      isQuickProposal: quotationInfo.isQuickProposal,
      quickproposalcomments: quotationInfo.quickproposalcomments,
      fileName: quotationInfo.fileName,
      filepath: cartDetails.documentPath
    };

    let offlineItems =
      details?.offlineItems && JSON.parse(details.offlineItems);
    this.setState({ info, offlineItems, showImagesInPreview: info.configurations?.isShowImage });
    this.getLocationImage();
  };

  getLocationImage = () => {
    let location = this?.state?.offlineItems?.find(
      (x) => x.offlineItem.business === "hotel"
    );
    var reqURL = location
      ? location.offlineItem
        ? location.offlineItem.toLocationCity
        : "travel"
      : "travel";

    apiRequester_LocationImage(reqURL, (data) => {
      this.setState({ locationImg: data.hits[0].largeImageURL });
    });
  };

  copyToClipboard = () => {
    let isB2B = this.state.isB2B;
    var reqURL = "tw/portal/info";
    if (isB2B) {
      apiRequester_unified_api(
        reqURL,
        null,
        (data) => {
          var textField = document.createElement("textarea")
          let b2cPortalUrl = data.response[0].customHomeURL.toLowerCase().replace("http://", "https://");
          textField.innerText = b2cPortalUrl + window.location.pathname;
          document.body.appendChild(textField);
          textField.select();
          document.execCommand("copy");
          textField.remove();
        }, 'GET');
    }
    else {
      var textField = document.createElement("textarea")
      textField.innerText = window.location.href;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
    }
    this.setState({ copyUrl: true });
    setTimeout(() => {
      this.setState({ copyUrl: false });
    }, 5000);
  };

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };
  generatePDF = (type) => {
    this.setState({
      isprint: true
    }, () => this.doHtml2canvas(type));
  }

  doHtml2canvas = (type) => {
    html2canvas(document.querySelector("#preview"), {
      imageTimeout: 150000,
      logging: false,
      useCORS: true,
      width: 1366,
      windowWidth: 1366,
      scale: 1,
    })
      .then((canvas) => {
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        if (imgHeight > imgWidth)
          doc = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
        var position = 0; // give some top padding to first page

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');

        //heightLeft -= pageHeight;

        // while (heightLeft >= 0) {
        //   position += heightLeft - imgHeight; // top padding for other pages
        //   doc.addPage();
        //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }
        if (type === "print") {
          doc.autoPrint();
          window.open(doc.output('bloburl'), '_blank');
        }
        else {
          const { name } = this.state.info;
          doc.save(name + '.pdf');
        }
      })
      .then(() => {
        this.setState({
          isprint: false
        });
      })
  }
  componentDidMount() {
    this.getDetails();
  }
  getImageCall = (uuid, imgUrl, secondaryImageURL) => {
    if (imgUrl) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          if (uuid) {
            var data = reader.result;
            if (data.startsWith("data:application/problem") && secondaryImageURL) {
              document.getElementById(uuid).src = secondaryImageURL;
            }
            else {
              data = atob(data.replace("data:text/plain;base64,", ""));
              document.getElementById(uuid).src = data;
            }
          }
        }.bind(this);
        reader.readAsDataURL(xhr.response);
      }.bind(this);
      xhr.open('GET', process.env.REACT_APP_IMAGEHANDLER_ENDPOINT + "/image?isbase64ImageString=true&url=" + imgUrl);
      xhr.responseType = 'blob';
      xhr.send();
    }
  }

  handleCurrencySection = () => {
    this.setState({ isShowCurrencySection: !this.state.isShowCurrencySection })
  }

  handleApplyCurrency = () => {
    this.setState({
      appliedCurrency: {
        currency: this.state.currency,
        currencySymbol: Global.getEnvironmetKeyValue("availableCurrencies").find(x => x.isoCode === this.state.currency).symbol,
        conversionRate: this.state.conversionRate
      },
      isShowCurrencySection: false
    })
  }
  handleResetSection = () => {
    this.setState({
      appliedCurrency: null,
      isShowCurrencySection: false,
      currency: Global.getEnvironmetKeyValue("portalCurrencyCode"),
      conversionRate: 1
    })
  }
  handleConversionChange = (e) => {
    if (!/^[0-9.]+$/g.test(e.target.value))
      return this.setState({ conversionRate: 0 })
    else
      this.setState({ conversionRate: e.target.value })
  }
  handleCurrencyChange = (e) => {
    this.setState({ currency: e.target.value })
  }
  getItineraryItemByDay = (day, items, info, showImagesInPreview) => {
    let itineraryItem = [];
    {
      items && Array.isArray(items) &&
        items.map(
          (item, key) => {
            if (item.offlineItem.business === "air" &&
              Number(day + 1) ===
              Number(
                items &&
                item.offlineItem.dayDepart
              ) && !item.offlineItem.isRoundTrip)

              itineraryItem.push(<QuotationItineraryDetailsItem
                handleItemDelete={
                  this.handleItemDelete
                }
                showImagesInPreview={showImagesInPreview}
                item={item}
                departFlight={
                  true
                }
                returnFlight={
                  false
                }
                isIndividualPrice={info.configurations?.isShowItemizedPrice === true
                  ? true
                  : info.configurations?.isShowFlightPrices}
                isRemovePriceAndActionButton={true}
              />
              )

            if (item.offlineItem.business === "air" &&
              Number(day + 1) ===
              Number(
                items &&
                item.offlineItem.dayDepart
              ) && item.offlineItem.isRoundTrip)

              itineraryItem.push(<QuotationItineraryDetailsItem
                handleItemDelete={
                  this.handleItemDelete
                }
                showImagesInPreview={showImagesInPreview}
                item={item}
                departFlight={
                  true
                }
                returnFlight={
                  false
                }
                isIndividualPrice={info.configurations?.isShowItemizedPrice === true
                  ? true
                  : info.configurations?.isShowFlightPrices}
                isRemovePriceAndActionButton={true}
              />
              )

            if (item.offlineItem.business === "air" &&
              item.offlineItem.isRoundTrip &&
              Number(day + 1) ===
              Number(
                items &&
                item.offlineItem.dayReturn
              ))

              itineraryItem.push(<QuotationItineraryDetailsItem
                handleItemDelete={
                  this.handleItemDelete
                }
                showImagesInPreview={showImagesInPreview}
                item={item}
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
                isIndividualPrice={info.configurations?.isShowItemizedPrice === true
                  ? true
                  : info.configurations?.isShowFlightPrices}
                isRemovePriceAndActionButton={true}
              />)

            if (item.offlineItem.business === "hotel" &&
              Number(day + 1) > Number(items && item.offlineItem.day) &&
              Number(day + 1) < Number(items && Number(item.offlineItem.day) + Number(item.offlineItem.nights)))
              itineraryItem.push(
                <QuotationItineraryDetailsItem
                  handleItemDelete={
                    this.handleItemDelete
                  }
                  showImagesInPreview={showImagesInPreview}
                  item={item}
                  type={info.type}
                  isIndividualPrice={info.configurations?.isShowItemizedPrice}
                  isRemovePriceAndActionButton={false}

                />)

            if (item.offlineItem.business !== "air" &&
              Number(day + 1) ===
              Number(item.offlineItem.day === "All Days" ? 1 :
                items && item.offlineItem.day
              ))
              itineraryItem.push(
                <QuotationItineraryDetailsItem
                  handleItemDelete={
                    this.handleItemDelete
                  }
                  showImagesInPreview={showImagesInPreview}
                  item={item}
                  type={info.type}
                  isIndividualPrice={info.configurations?.isShowItemizedPrice}
                  isRemovePriceAndActionButton={true}
                />)
            return items;
          });
      return itineraryItem;
    }
  }
  render() {
    const { info, offlineItems, copyUrl, isprint, showImagesInPreview } = this.state;
    const items = offlineItems;
    const count = Math.ceil(info.duration) || "";
    const totalDays = [...Array(count).keys()];
    let dayArr = [];
    totalDays.map((day) => {
      dayArr.push({ day: day + 1, isHotel: [] });
    });

    let totalPrice = 0;
    offlineItems &&
      offlineItems.map(
        (item) =>
          item.offlineItem &&
          (totalPrice = Number(totalPrice)
            + ((isNaN(Number(item.offlineItem.totalAmount)) || Number(item.offlineItem.totalAmount) === 0)
              ? Number(item.offlineItem.sellPrice) : Number(item.offlineItem.totalAmount)
            ))
      );

    const css = `
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    .contact-details {
      font-size: 14px;
      margin-left: 30px;
      margin-top: -37px;
    }`;

    const cssPrint = `
    .quotation-details:not(h1,h4) {
      font-size: 22px;
      color: #000000 !important;
    }
    .quotation-details *:not(h1,h4) {
      font-size: 22px !important;
      color: #000000 !important;
    }
    .contact-details {
      font-size: 22px;
      display:block;
      margin-left: 40px;
      margin-top: -37px;
    }`;
    // if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ItineraryDetails~itineraries-preview-itineraries")) {
    //   this.props.history.push('/');
    // }
    let currencyList = [];
    Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        label: x.description + " - " + x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode,
      })
    );
    const portalType = localStorage.getItem('portalType');
    return (
      <div id="preview">
        <style>{css}</style>
        {isprint &&
          <div>
            <style>{cssPrint}</style>
          </div>
        }
        {info && (
          <React.Fragment>
            <div className="quotation itinerary-landing-page">
              <div className="itinerary-landing-coverBg pt-4 pb-4 mb-3 d-flex align-items-center">
                <div className="container">
                  <h1 className="text-white m-0 p-0 text-center title-name">
                    {info.name && info.name}
                  </h1>
                  {(info.type !== "Quotation") && (info.type !== "Quotation_Master") &&
                    <div className="text-white mt-3 text-center">
                      <small>
                        Start Date:{" "}
                        <b>
                          {DateComp({ date: info.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                          {/* <Date date={info.startDate}></Date> */}
                        </b>
                      </small>
                      <small className="ml-4">
                        End Date:{" "}
                        <b>
                          {DateComp({ date: info.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                          {/* <Date date={info.endDate}></Date> */}
                        </b>
                      </small>
                      <small className="ml-4">
                        No of Days: <b>{info.duration}</b>
                      </small>
                    </div>
                  }
                  {info.isQuickProposal && totalPrice > 0 &&
                    <div className="text-center text-white mt-3">
                      <h5
                        className="border d-inline-block rounded"
                        style={{
                          background: "rgba(0,0,0,0.4)",
                          padding: "6px 16px",
                        }}
                      >
                        <React.Fragment>
                          Price:<Amount
                            amount={(this.state.appliedCurrency ? this.state.appliedCurrency.conversionRate : 1) * totalPrice}
                            currencyCode={this.state.appliedCurrency ? this.state.appliedCurrency.currency : Global.getEnvironmetKeyValue("portalCurrencyCode")} />
                        </React.Fragment>
                      </h5>
                    </div>
                  }
                  {(info.configurations?.isShowTotalPrice === true)
                    &&
                    <div className="text-center text-white mt-3">
                      <h5
                        className="border d-inline-block rounded"
                        style={{
                          background: "rgba(0,0,0,0.4)",
                          padding: "6px 16px",
                        }}
                      >
                        <React.Fragment>
                          Price:<Amount
                            amount={(this.state.appliedCurrency ? this.state.appliedCurrency.conversionRate : 1) * totalPrice}
                            currencyCode={this.state.appliedCurrency ? this.state.appliedCurrency.currency : Global.getEnvironmetKeyValue("portalCurrencyCode")} />
                        </React.Fragment>
                      </h5>
                    </div>
                  }
                  <div data-html2canvas-ignore className="text-white pull-right mt-3">
                    <div className="custom-control custom-switch d-inline-block mr-4">
                      <input
                        id="showImagesInPreview"
                        name="showImagesInPreview"
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.showImagesInPreview}
                        onChange={this.handleImage}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="showImagesInPreview"
                      >
                        {this.state.showImagesInPreview ? "Show Images" : "Hide Images"}
                      </label>
                    </div>
                  </div>

                  <div data-html2canvas-ignore
                    className="text-center mt-3"
                    style={{ position: "absolute", right: "8px", top: "0px" }}
                  >
                    {info.fileName && (
                      <a className="btn btn-sm btn-outline-primary text-white border mr-2"
                        href={info.filepath}
                        target="_blank"
                        download={`Quick Proposal - ${info.name && info.name}.pdf`}
                      >
                        Download{" "}
                      </a>
                    )}
                    <AuthorizeComponent
                      title={
                        info && (info.type === "Itinerary" || info.type === "Itinerary_Master")
                          ? "ItineraryDetails~itineraries-preview-copy-link"
                          : "QuotationDetails~quotation-preview-copy-link"
                      }
                      type="button"
                      rolepermissions={this.props.userInfo?.rolePermissions ?? [
                        {
                          "displayname": "Billing and Subscription",
                          "objectid": 1,
                          "objectkeyid": info && (info.type === "Itinerary" || info.type === "Itinerary_Master")
                            ? "ItineraryDetails~itineraries-preview-copy-link"
                            : "QuotationDetails~quotation-preview-copy-link",
                          "permissionid": 0,
                          "permissionname": "Hide",
                          "roleid": 1
                        }
                      ]}
                    >
                      {!info.isQuickProposal &&
                        <button
                          className="btn btn-sm btn-outline-primary text-white border mr-2"
                          onClick={this.copyToClipboard}
                        >
                          Copy Link
                        </button>}
                    </AuthorizeComponent>


                    <button
                      className="btn btn-sm btn-outline-primary text-white border mr-2"
                      onClick={() => this.generatePDF("pdf")}
                    >
                      Download PDF
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary text-white border mr-2"
                      onClick={() => this.generatePDF("print")}
                    >
                      Print
                    </button>
                    {copyUrl && (
                      <div
                        className="alert alert-sm alert-success mt-2 p-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Copied Link URL to your clipboard
                      </div>
                    )}
                    <AuthorizeComponent
                      title={
                        info && (info.type === "Itinerary" || info.type === "Itinerary_Master")
                          ? "ItineraryDetails~itineraries-preview-change-currency"
                          : "QuotationDetails~quotation-preview-change-currency"
                      }
                      type="button"
                      rolepermissions={this.props.userInfo?.rolePermissions ?? [
                        {
                          "displayname": "Billing and Subscription",
                          "objectid": 1,
                          "objectkeyid": (info && info.type === "Itinerary" || info.type === "Itinerary_Master")
                            ? "ItineraryDetails~itineraries-preview-change-currency"
                            : "QuotationDetails~quotation-preview-change-currency",
                          "permissionid": 0,
                          "permissionname": "Hide",
                          "roleid": 1
                        }
                      ]}
                    >
                      <button
                        className="btn btn-sm btn-outline-primary text-white border mr-2"
                        onClick={this.handleCurrencySection}
                      >
                        Change Currency
                      </button>
                    </AuthorizeComponent>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="quotation-details border shadow-sm mt-3 mb-5">
                  {info && (info.type === "Itinerary" || info.type === "Itinerary_Master") && (
                    <div className="dayview pt-4 pl-3 pr-3">
                      <ul className="list-unstyled dayview-days">
                        {totalDays.map((day, key) => {
                          var itineraryItems = this.getItineraryItemByDay(day, items, info, showImagesInPreview);
                          return (<li
                            className="dayview-day position-relative"
                            key={key}
                          >
                            {(itineraryItems.length > 0 || items.length === 0) &&
                              <div className="d-flex align-items-center">
                                <h4>{day + 1}</h4>
                                <h5>
                                  Day {day + 1} -
                                  <b className="text-primary ml-2">
                                    {DateComp({ date: info.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate"), add: { day } })}
                                    {/* <Date
                                    date={info.startDate}
                                    format="longDate"
                                    add={day}
                                  ></Date> */}
                                  </b>
                                </h5>
                              </div>}

                            <div className="dayview-items">
                              {itineraryItems}
                            </div>
                          </li>
                          )
                        })}

                        <li className="dayview-day dayview-day-total">
                          <div>
                            <div className="d-flex align-items-center">
                              <h4></h4>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}

                  {info && (info.type === "Quotation" || info.type === "Quotation_Master") && (
                    <div className="dayview pt-4 pl-3 pr-3">
                      {items && Array.isArray(items) &&
                        items.map(
                          (item, key) =>
                            item.offlineItem && (
                              <QuotationItineraryDetailsItem
                                handleItemDelete={this.handleItemDelete}
                                showImagesInPreview={showImagesInPreview}
                                item={item}
                                key={key}
                                isIndividualPrice={true}
                                isRemovePriceAndActionButton={true}
                                proposalInfo={info}
                              />
                            )
                        )}
                    </div>
                  )}
                  {info.termsconditions && info.termsconditions !== "" && <div className="dayview pl-3 pr-3 mb-3"><br /><b>Terms & Conditions : </b>  <HtmlParser text={decode(info.termsconditions)} /></div>}
                </div>

              </div>
            </div>

            <div className="itinerary-landing-coverImg">
              {showImagesInPreview &&
                <img
                  id="titleimage"
                  src={this.getImageCall("titleimage", info.imageURL ?? this.state.locationImg, this.state.locationImg)}
                  alt="" />
              }
            </div>

          </React.Fragment>

        )}

        {this.props.userInfo && portalType !== 'B2C' && (
          <table cellPadding="0" cellSpacing="0" className="contact-details" border="0" width="90%">
            <tbody>
              <tr>
                <td style={{ padding: "16px 0px 8px 0px" }}>
                  {portalType === 'B2C' || this?.props?.userInfo?.provider?.logo?.url ? (
                    <img
                      id="supplierLogo"
                      src={this.getImageCall("supplierLogo",
                        portalType === 'B2C'
                          ? Global.getEnvironmetKeyValue("portalLogo")
                          : this?.props?.userInfo?.provider?.logo?.url)}
                      height={isprint ? "52px" : "42px"}
                      style={isprint ? { height: "52px" } : { height: "42px" }}
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
                      {portalType === 'B2C'
                        ? Global.getEnvironmetKeyValue("portalName")
                        : this?.props?.userInfo?.provider?.name}
                    </h6>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0px 0px 4px 0px" }}>
                  <b>{portalType === 'B2C'
                    ? Global.getEnvironmetKeyValue("portalName")
                    : this?.props?.userInfo?.provider?.name}</b>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0px 0px 8px 0px" }}>
                  <span>{this?.props?.userInfo?.location?.address}</span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0px 0px 8px 0px" }}>
                  <span>
                    Phone :{" "}
                    {(this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode
                      ? this?.props?.userInfo?.contactInformation?.phoneNumberCountryCode + " "
                      : "") + this?.props?.userInfo?.contactInformation?.phoneNumber}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0px 0px 8px 0px" }}>
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
                  <td style={{ padding: "0px 0px 8px 0px" }}>
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
                      <img className='img-responsive mr-1' width="24"
                        style={{ filter: "none" }} src={Facebook} alt="Facebook"></img> </a>
                  }
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
        )}


        {!info && !offlineItems && (
          <div className="itinerary-landing-loader">
            <Loader />
          </div>
        )}

        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}

        {this.state.isShowCurrencySection &&
          <ModelPopup
            header={"Select Currency"}
            sizeClass={"modal-lg"}
            content={
              <div className="container">
                <div className="row">
                  <div className="col-1 p-0">
                    <label></label>
                    <br />
                    <b>1 {Global.getEnvironmetKeyValue("portalCurrencyCode")}</b>
                  </div>
                  <div className="col-2 p-0">
                    <label></label>
                    <br />
                    <b>Equals to </b>
                  </div>
                  <div className="col-4">

                    <div className="form-group">
                      <label htmlFor="conversionRate">Conversion Rate</label>
                      <input type="text" name="conversionRate" id="conversionRate"
                        onChange={this.handleConversionChange}
                        className="form-control" value={this.state.conversionRate} />
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="form-group ">
                      <label htmlFor="currency">Currency</label>
                      <select
                        value={this.state.currency}
                        onChange={(e) => this.handleCurrencyChange(e)}
                        name={"currency"}
                        id={"currency"}
                        className={"form-control"}>
                        {currencyList.map((option, key) => (

                          <option
                            key={key}
                            value={
                              option["value"]
                            }
                          >
                            {option["label"]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 pl-0">
                    <button
                      className="btn btn-primary "
                      onClick={this.handleApplyCurrency}
                    >
                      Apply
                    </button>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={this.handleCurrencySection}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={this.handleResetSection}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>}
            handleHide={this.handleCurrencySection}
          />
        }
      </div>
    );
  }
}

export default ItineraryEmailView;
