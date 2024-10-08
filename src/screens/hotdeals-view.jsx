import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_LocationImage } from "../services/requester-location-img";
import QuotationItineraryDetailsItem from "../components/quotation/quotation-itinerary-details-item";
import Date from "../helpers/date";
import Loader from "../components/common/loader";
import ComingSoon from "../helpers/coming-soon";
import Amount from "../helpers/amount";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import PackageEmail from "./package-email";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import { scroller } from "react-scroll";
import * as Global from "../helpers/global";

class HotdealsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      info: "",
      offlineItems: "",
      locationImg: "",
      copyUrl: false,
      comingsoon: false,
      isprint: false,
      isEditModeLoading: false
    };
  }

  getPackageDetails = (id) => {
    this.setState({ isLoading: true, isEditModeLoading: true });
    const reqOBJ = {};
    let reqURL =
      "cms/package/getbyid?id=" +
      atob(this.props.match.params.id); //getbyid?id=" + id;
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let data = resonsedata.response.package[0];
        data.termsConditions = resonsedata.response.package[0].termsConditions;
        data.description = resonsedata.response.package[0].description;
        data.packageName = resonsedata.response.package[0].shortDescription;
        data.images = resonsedata.response.images.map((item) => {
          item["id"] = item.imageid;
          item["isDefaultImage"] = false;
          item["isDeleted"] = false;
          item["fileExtension"] = "jpg";
          item["fileURL"] = item.imagepath;
          item["portalID"] = resonsedata.response.package[0].portalID;
          delete item["createdby"];
          delete item["createddate"];
          delete item["updatedby"];
          delete item["updateddate"];
          delete item["specialpromotionimageid"];
          delete item["specialpromotionid"];
          return item;
        });
        data.inclusionExclusion = resonsedata.response.inclusionExclusion.map(
          (item) => {
            item["id"] = item.inclusionExclusionID;
            item["isInclusion"] = item.isInclusion;
            item["description"] = item.shortDescription;
            item["isDeleted"] = false;
            return item;
          }
        );

        // var obj = {};
        // obj["imageid"] = 190824;
        // obj["imagepath"] = resonsedata.response.package[0].smallImagePath;
        // obj["isDefaultImage"] = true;
        // obj["isDeleted"] = false;
        // obj["id"] = resonsedata.response.package[0].smallImageID;
        // obj["fileExtension"] = "jpg";
        // obj["fileURL"] = resonsedata.response.package[0].smallImagePath;
        // obj["portalID"] = resonsedata.response.package[0].portalID;
        // data.images.push(obj);

        data.packageBrochure = [];
        if (resonsedata.response.package[0].brochureFileName) {
          var objPDF = {};
          objPDF["isDefaultImage"] = true;
          objPDF["isDeleted"] = false;
          objPDF["id"] = resonsedata.response.package[0].specialPromotionID;
          objPDF["fileExtension"] = "pdf";
          objPDF["fileURL"] = resonsedata.response.package[0].brochureFileName;
          objPDF["portalID"] = resonsedata.response.package[0].portalID;
          data.packageBrochure.push(objPDF);
        }
        if (resonsedata.response.package[0].twOthers) {
          let supplierObj = JSON.parse(
            resonsedata.response.package[0].twOthers
          );
          data["supplierCurrency"] = supplierObj.supplierCurrency;
          data["conversionRate"] = supplierObj.conversionRate;
          data["supplierCostPrice"] = supplierObj.supplierCostPrice;
          data["supplierTaxPrice"] = supplierObj.supplierTaxPrice;
          data["costPrice"] = supplierObj.costPrice;
          data["markupPrice"] = supplierObj.markupPrice;
          data["discountPrice"] = supplierObj.discountPrice;
          data["CGSTPrice"] = supplierObj.CGSTPrice;
          data["SGSTPrice"] = supplierObj.SGSTPrice;
          data["IGSTPrice"] = supplierObj.IGSTPrice;
          data["brn"] = supplierObj.brn;
          data["bookBefore"] = supplierObj.bookBefore;
        }
        this.setState({ data, isLoading: false, isEditModeLoading: false });
      }.bind(this),
      "GET"
    );
  };
  getDetails = () => {
    var reqURL = "quotation?id=" + this.props.match.params.id;
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
    };

    let offlineItems =
      details?.offlineItems && JSON.parse(details.offlineItems);
    this.setState({ info, offlineItems });
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
    var textField = document.createElement("textarea");
    textField.innerText = window.location.href;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
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

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        // heightLeft -= pageHeight;

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
          const { data } = this.state.data;
          doc.save('My Package.pdf');
        }
      })
      .then(() => {
        this.setState({
          isprint: false
        });
      })
  }
  componentDidMount() {
    this.getPackageDetails(0);
  }

  getBrealPoints = () => {
    return {
      1199: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      992: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      759: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      553: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    };
  };
  getBase64Image22 = (url) => {
    const img = new Image();
    //img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      //var dataURL = canvas.toDataURL("image/png");
      //return dataURL.replace(/^data:image\/(png|jpg|webp|jpeg);base64,/, "");
    }
    img.src = url
  }
  getBase64Image11 = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg|webp|jpeg);base64,/, "");
  }

  getImageCall = (uuid, imgUrl) => {
    if (imgUrl) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          var data = reader.result;
          data = atob(data.replace("data:text/plain;base64,", ""));
          document.getElementById(uuid).src = data;
        }.bind(this);
        reader.readAsDataURL(xhr.response);
      }.bind(this);
      xhr.open('GET', process.env.REACT_APP_IMAGEHANDLER_ENDPOINT + "/image?isbase64ImageString=true&url=" + imgUrl);
      xhr.responseType = 'blob';
      xhr.send();
    }
  }

  scrollToEmailSection = () => {
    scroller.scrollTo("package-email", {
      duration: 1000,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -15
    });
  };


  render() {
    const { data, info, offlineItems, copyUrl, isprint, isEditModeLoading } = this.state;
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
          (totalPrice = Number(totalPrice) + Number(item.offlineItem.sellPrice))
      );

    const css = `
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    .page-height {
      display: none;}
    .contact-details {
      font-size: 14px;
      margin-left: 30px;
      margin-top: -37px;
    }
      `;

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
    const oneday = 24 * 60 * 60 * 1000;
    let NoOfDays = 4;
    // data && ( NoOfDays =  Math.abs(
    //     (new Date(data.validFrom) -
    //       new Date(data.validTo)) /
    //       oneday
    //   )
    // );

    const params = {
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: this.getBrealPoints(),
    };
    const itemsStar = [];
    let startCount = !isEditModeLoading ? parseInt(data.rating, 10) : 0;

    for (var i = 0; i < startCount; i++) {
      itemsStar.push(<SVGIcon
        name="star"
        key={i}
        type="fill"
        width="14"
        height="14"
        className="text-primary"
      ></SVGIcon>)
    }

    return (
      <div id="preview">
        <style>{css}</style>
        {isprint &&
          <div>
            <style>{cssPrint}</style>
          </div>
        }
        {!isEditModeLoading && (
          <React.Fragment>
            <div className="quotation itinerary-landing-page">
              <div className="itinerary-landing-coverBg pt-4 pb-4 mb-3 d-flex align-items-center">
                <div className="container">
                  <h1 className="text-white m-0 p-0 text-center title-name">
                    {data.shortDescription && data.shortDescription}
                  </h1>
                  {startCount > 0 && (
                    <div className="text-white mt-3 text-center">
                      <small>
                        <b>
                          {itemsStar}
                        </b>
                      </small>
                    </div>
                  )}
                  <div className="text-white mt-3 text-center">
                    <small>
                      Start Date:{" "}
                      <b>
                        <Date date={data.validFrom}></Date>
                      </b>
                    </small>
                    <small className="ml-4">
                      End Date:{" "}
                      <b>
                        <Date date={data.validTo}></Date>
                      </b>
                    </small>
                    {/* <small className="ml-4">
                        No of Days: <b>
                          {NoOfDays}</b>
                      </small> */}
                  </div>
                  <div className="text-center text-white mt-3">
                    <h5
                      className="border d-inline-block rounded"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        padding: "6px 16px",
                      }}
                    >
                      Price: <Amount amount={data.price} currencySymbol={data.symbol} />
                    </h5>

                  </div>

                  <div data-html2canvas-ignore
                    className="text-center mt-3"
                    style={{ position: "absolute", right: "8px", top: "0px" }}
                  >
                    <button
                      className="btn btn-sm btn-outline-primary text-white border mr-2"
                      onClick={this.copyToClipboard}
                    >
                      Copy Link
                    </button>

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
                  </div>
                  <div data-html2canvas-ignore
                    className="text-center mt-3"
                    style={{ position: "absolute", right: "8px", top: "200px" }}
                  >
                    {/* {this.props.userInfo && (<button
                      className="btn btn-sm btn-outline-primary text-white border mr-2"
                      onClick={() => this.scrollToEmailSection()}
                    >
                      Email Package
                    </button>)} */}
                    {data.brochureFileName && (
                      <a className="btn btn-sm btn-outline-primary text-white border mr-2"
                        href={data.brochureFileName}
                        target="_blank"
                        download={`Package - ${data.shortDescription && data.shortDescription}.pdf`}
                      >
                        Download Package Brochure{" "}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="quotation-details mt-3 mb-5">

                  <div className="row mt-4">

                    {data.summaryDescription && (
                      <div className="col-lg-12 mt-4">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Overview</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Terms"}
                          >
                            <HtmlParser
                              text={decode(data.summaryDescription)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {data.description && (
                      <div className="col-lg-12 mt-4 ">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Itinerary</b></div>
                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Itinerary"}
                          >
                            <HtmlParser text={decode(data.description)} />
                          </div>
                        </div>
                      </div>
                    )}

                    {data.inclusionExclusion && data.inclusionExclusion.filter((x) => x.isInclusion).length > 0 && (
                      <div className="col-lg-12 mt-4">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Inclusion</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Inclusion"}
                          >
                            <ul>
                              {data.inclusionExclusion && data.inclusionExclusion.map((y) => y.isInclusion && (
                                <li>{y?.description}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {data.inclusionExclusion && data.inclusionExclusion.filter((x) => !x.isInclusion).length > 0 && (
                      <div className="col-lg-12 mt-4">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Exclusion</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Exclusion"}
                          >
                            <ul>
                              {data.inclusionExclusion.map((y) => !y.isInclusion && (
                                <li>{y?.description}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>)}

                    {data.images && data.images.length > 0 && (
                      <div className="col-lg-12 mt-4" data-html2canvas-ignore>
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Photo Gallery</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div className="col-lg-2"></div>
                          <div
                            className={"col-lg-8 pb-3 cms-details-Exclusion"} style={{ margin: "0px auto" }}
                          >
                            <div className={"details-photoslider details-photoslider-photos"}>
                              {data.images.length > 0 && (
                                <Swiper {...params}>
                                  {data.images.map(function (item, key) {
                                    return (
                                      <div key={key}>
                                        <img
                                          src={item.imagepath}
                                          alt=""
                                        />
                                      </div>
                                    );
                                  })}
                                </Swiper>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>)}

                    {data.twPriceGuideLine && (
                      <div className="col-lg-12 mt-4 ">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Price Guideline</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Itinerary"}
                          >
                            <HtmlParser text={decode(data.twPriceGuideLine)} />
                          </div>
                        </div>
                      </div>
                    )}

                    {data.termsConditions && (
                      <div className="col-lg-12 mt-4">
                        <div style={{ background: "rgb(241, 241, 241)", padding: "8px", borderRadius: "4px;" }}><b>Terms & Conditions</b></div>

                        <div className="pt-3 shadow-sm" style={{ border: "1px solid rgb(241, 241, 241)" }}>
                          <div
                            className={"col-lg-12 pb-3 cms-details-Terms"}
                          >
                            <HtmlParser
                              text={decode(data.termsConditions)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="package-landing-coverImg">
              <img id="bannerImg" src={this.getImageCall("bannerImg", data.smallImagePath)} alt="" />
            </div>
          </React.Fragment>
        )}

        {isEditModeLoading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
          >
            <Loader />
          </div>
        )}

        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}

      </div>

    );
  }
}

export default HotdealsView;
