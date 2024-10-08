import React, { Component } from "react";
import PublicPageHeader from "../components/landing-pages/public-page-header";
import PublicPageFooter from "../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../components/landing-pages/public-page-copyrights";
import { Helmet } from "react-helmet";
import { apiRequesterCMS } from "../services/requester-cms";
import { StickyContainer, Sticky } from "react-sticky";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { CMSContext } from "../screens/cms/cms-context";
import Config from "../config.json";
import SVGIcon from "../helpers/svg-icon";
import Loader from "../components/common/loader";
import ImageSlider from "../components/details/image-slider";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import * as Global from "../helpers/global";
import PriceConverter from "../components/common/PriceConverter";

function OpenMarketPlacePackagePreview(props) {
  const [state, setState] = useState({
    id: 0,
    module: "",
    result: "",
    copyUrl: false,
    isB2B: Config.codebaseType === "tourwiz" ? true : false,
    isLoading: true,
    activeTab: "overview",
    currentCurrency: "USD",
    currentCurrencyRateData: [],
  });
  const scrollRef = useRef();

  let currencyList = [];
  Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
    currencyList.push({
      label: x.description + " - " + x.isoCode + " (" + x.symbol + ")",
      value: x.isoCode,
    })
  );
  const handleCurrencyChange = (e) => {
    debugger
    setState((prevState) => { return { ...prevState, currentCurrency: e.target.value }; })
  }
  const getCurrentCurrencyRate = () => {
    return fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setState((prevState) => { return { ...prevState, currentCurrencyRateData: data.rates }; })
      });
    // .then((res) => {
    //   debugger;
    //   setState((prevState) => { return { ...prevState, currentCurrencyRateData: res.json() }; })
    // })
    // .then((data) => {
    //   console.log(data, data?.country_name);
    // });
  };
  const convertCurrency = (amount, conversionFactor, conversionCode, toBeConvertedFactor, toBeCurrencyCode) => {
    debugger
    if (state.currentCurrencyRateData[toBeCurrencyCode] && false) {
      const test = toBeCurrencyCode === conversionCode ? 1 : (1 / state.currentCurrencyRateData[toBeCurrencyCode]);
      return Math.round((amount / conversionFactor) * test * 100) / 100;
    }
    else
      return Math.round((amount / conversionFactor) * toBeConvertedFactor * 100) / 100;
  };

  let availableCurrencies = Global.getEnvironmetKeyValue("availableCurrencies");
  let toBeConvert = availableCurrencies.filter((x) => x.isoCode === state.currentCurrency)[0];
  //useEffect(() => { getCurrentCurrencyRate(); }, []);

  const getCountry = () => {
    if (localStorage.getItem('country-manual')) {
      setState((prevState) => {
        return {
          ...prevState, currentCurrency: "USD"
        };
      })
      return;
    }
    return fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name.toLowerCase() === "india" || data?.country_name.toLowerCase() === "not found") {
          setState((prevState) => { return { ...prevState, currentCurrency: "INR" }; });
          getDetails();
        }
        else {
          setState((prevState) => { return { ...prevState, currentCurrency: "USD" }; });
          getDetails();
        }
        console.log(data, data?.country_name);
      }).catch((err) => {
        setState((prevState) => { return { ...prevState, currentCurrency: "INR" }; });
        getDetails();
      });
  };
  useEffect(() => { getCountry(); }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    //getDetails();
  }, []);
  const getDetails = () => {
    let reqOBJ = {};
    let reqURL =
      "cms/" +
      "specialpromotiondetails" +
      "?portalid=0&itemid=" +
      props.packageID;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        delete data?.response.tabs["priceGuideLine"];
        setState({
          ...state, result: data?.response || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };
  const handleTabs = (activeTab) => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" })
    setState({ ...state, activeTab });
  };
  const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }
  .tw-plan-box .tw-addon-services ul li::before {
    content: "";
    margin-right: 8px;
    background: url(/static/media/addon-services-bullet.377b36fb.png) left top no-repeat;
    width: 17px;
    height: 13px;
    background-size: 15px 11px;
    display: inline-block;
    position: absolute;
    left: 0px;
    top: 12px;
}
.tw-plan-box .tw-addon-services ul li.cross::before {
  background: url(/static/media/bullet-cross.253e7bd8.png) left top no-repeat !important;
}
.tblplaninclusion table tr{
  border-bottom: 1px solid lightgrey;
}
.tblplaninclusion table
{
  border: solid 1px #ccc;
  margin-top: 25px;
}
.tblplaninclusion table tr>th
{
  padding: 10px;
  background: lightgrey;
}
.tblplaninclusion table tr>td
{
  padding: 10px;
}
.tblplaninclusion table tr>td.acctitle{
  padding: 10px;
  font-weight:bold;
}
.tblplaninclusion table tr td.imgcheckuncheck, .tblplaninclusion table tr th.imgcheckuncheck{
    text-align:center;
}
.tw-plan-intro h2{
// margin-top:-17px !important;
}
.page-height {
  display: none !important;
}
.package-tab span {
  height: 100%;
  // border-bottom: 1px solid #f19049;
  white-space: nowrap;
}`;
  const details = state.result.details ? state.result.details[0] : "";
  const title = (details && details?.shortdescription);
  let images = [];
  state.result?.tabs?.photoGallery &&
    state.result?.tabs?.photoGallery.map((x) =>
      images.push({
        url: x.imagepath.indexOf(".s3.") > 0 ? x.imagepath :
          process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
          details?.portalID +
          "/SpecialsPromotions/" +
          x.imagepath,
      })
    );

  let starItems = [];
  for (var i = 0; i < details?.rating; i++) {
    starItems.push(<SVGIcon
      name="star"
      key={i}
      type="fill"
      width="14"
      height="14"
      className="text-primary"
    ></SVGIcon>);
  }
  let supplierObj = details && JSON.parse(details?.twOthers);
  let supplierCurrencySymbol = supplierObj ? supplierObj?.supplierCurrency ? supplierObj?.supplierCurrency : details?.currencySymbol : details?.currencySymbol;

  const flighDetails = supplierObj && supplierObj?.flight;
  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
  console.log("specialPromotionType", details?.specialPromotionType)
  const [convertedPrice, convertedCurrency] = PriceConverter({ amount: details?.price, currentCurrency: props.ipCurrencyCode || "INR" });

  return (
    <div className="tw-public-pages tw-pricing-page">
      <style>{css}</style>

      <Helmet>
        <title>TourWiz Marketplace Preview</title>
        <meta
          name="description"
          content="TourWiz Marketplace Preview"
        />
      </Helmet>

      <StickyContainer>
        <Sticky>
          {({ style }) => (<div
            className={
              "hight-z-index mod-search-area"
            }
            style={{ ...style, transform: "inherit" }}
          >
            <PublicPageHeader />
          </div>
          )}
        </Sticky>
        {state.isLoading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 90px)", opacity: ".5" }}
          >
            <Loader />
          </div>
        )}
        {title !== "" &&
          <div className="title-bg pt-3 pb-3 mb-3" >{/* style={{ background: "#EDDEF0", color: "#891d9b" }} */}
            <div className="container">
              <div className="row">
                <div className="col-lg-9">
                  <h1 className="text-white m-0 p-0 f30">
                    <SVGIcon
                      name={"map-marker"}
                      width="24"
                      height="24"
                      className="mr-3"
                    ></SVGIcon>
                    {title}
                  </h1>
                </div>
                <div className="col-lg-3 d-flex justify-content-end">
                  <Link className="btn btn-sm btn-light pull-right mr-2 " to={"/signup-marketplace"}>
                    Share Package
                  </Link>

                  <select
                    value={state.currentCurrency}
                    onChange={(e) => handleCurrencyChange(e)}
                    name={"currency"}
                    id={"currency"}
                    className={"form-contrdol  btn btn-sm btn-light d-none pull-right mr-2"}>
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

            </div>
          </div>
        }
        {!state.isLoading && state.module !== "locations" && (
          <div
            style={{ minHeight: "calc(100vh - 284px)" }}
            className="container mt-4 mb-5"
          >
            <div className="row">
              <div className="col-lg-4">
                <img
                  class="img-fluid"
                  src={details?.imagepath}
                  alt={details?.shortdescription}
                />
              </div>
              <div className="col-lg-8">
                <h5 className="font-weight-bold">
                  {details?.shortdescription}
                </h5>
                <div><span title="Package star rating">{starItems}</span>
                  {details?.specialPromotionType && details?.rating ? ` | ` : ``}
                  <span title="Package type">{details?.specialPromotionType !== "" && details?.specialPromotionType !== null && details?.specialPromotionType ? `${details?.specialPromotionType} ` : ``}</span>
                  {((details?.specialPromotionType || details?.rating) && (!isNaN(parseInt(details.duration)) && parseInt(details.duration) > 0)) ? ` | ` : ``}
                  <span title="Package duration">{!isNaN(parseInt(details.duration)) && (parseInt(details.duration) > 0) && (parseInt(details.duration) > 1 ? `${parseInt(details.duration)} D / ${parseInt(details.duration) - 1} N` : `${parseInt(details.duration)} D`)}</span></div>
                <div className="mb-3"></div>
                {/* <p className="text-secondary">{<HtmlParser text={decode(details?.summarydescription)} />}</p> */}
                <h5 className="text-primary font-weight- w-100" style={{ textDecoration: details?.offerPrice > 0 ? 'line-through' : 'none', marginRight: '.6rem', float: 'left' }}>
                  {/* {details?.currencySymbol + " " + details?.price} */}

                  {convertedPrice > 0 && "Starting at  " + convertedCurrency + " " + convertedPrice + " "}

                  <span style={{ fontSize: "15px" }} className="d-block text-secondary"> per person</span>
                </h5 >
                {details?.brochureFileName && (
                  <a className="btn btn-sm btn-primary"
                    href={details?.brochureFileName}
                    target="_blank" style={{ position: "absolute", top: "0px", right: "0px", color: "fff" }}
                    download={`Package - ${details?.shortDescription && details?.shortDescription}.pdf`}
                  >
                    Download Brochure{" "}
                  </a>
                )
                }
                <Link className="btn btn-primary mt-3" to={"/signup-marketplace"}>
                  Send Inquiry
                </Link>
              </div >
            </div >
            <div ref={scrollRef} />
            <div className="row mt-4" >
              <div className="col-lg-12 package-tab-row" style={{
                width: "auto", overflowX: "auto"
              }} >
                <div className="row ">
                  <div className="col-lg-12 d-flex flex-row text-capitalize">
                    <div
                      className={
                        "package-tab" +
                        (state.activeTab === "overview" ? " active" : "")
                      }
                      onClick={() => handleTabs("overview")}
                    >
                      <span>Overview</span>
                    </div>
                    {state.result?.tabs &&
                      Object.keys(state.result?.tabs).map(
                        (x) =>
                          ((x === "flightDetails" && flighDetails !== undefined && flighDetails !== "") || (state.result?.tabs[x] && state.result?.tabs[x][0] != undefined &&
                            state.result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != "" &&
                            state.result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != undefined)) && (
                            <div
                              className={
                                "package-tab" +
                                (state.activeTab === x ? " active" : "")
                              }
                              onClick={() => handleTabs(x)}
                            >
                              <span> {x === "photoGallery" ? "Photo Gallery" : x === "priceGuideLine" ? "Price Guideline" : x === "termsConditions" ? "Terms & Conditions" : x === "flightDetails" ? "Flight Details" : x}</span>
                            </div>
                          )
                      )}

                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="mt-4">
                  {state.result?.tabs ?
                    Object.keys(state.result?.tabs).map(
                      (x) =>
                        state.activeTab === x && (
                          <div className={"cms-details-" + x}>
                            {state.activeTab === "overview" && (
                              <HtmlParser text={decode(details?.summarydescription).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")} />
                            )}
                            {x === "description" &&
                              state.result?.tabs[x] &&
                              state.result?.tabs[x][0]?.description && (
                                <HtmlParser
                                  text={decode(state.result?.tabs[x][0]?.description).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                />
                              )}
                            {state.activeTab === "flightDetails" && flighDetails && (
                              <HtmlParser
                                text={decode(flighDetails).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                              />
                            )}
                            {x === "priceGuideLine" &&
                              state.result?.tabs[x] &&
                              state.result?.tabs[x][0]?.priceGuideLine && (
                                <HtmlParser
                                  text={decode(state.result?.tabs[x][0]?.priceGuideLine).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                />
                              )}
                            {x === "termsConditions" &&
                              state.result?.tabs[x] &&
                              state.result?.tabs[x][0]?.termsConditions && (
                                <HtmlParser
                                  text={decode(state.result?.tabs[x][0]?.termsConditions).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
                                />
                              )}

                            {(x === "inclusion" || x === "exclusion") && (
                              <p>
                                {state.result?.tabs[x].map((y) => (
                                  <p><HtmlParser text={decode(y?.shortdescription)} /></p>
                                ))}
                              </p>
                            )}

                            {x === "photoGallery" && (
                              <div className="row">
                                <div className="col-lg-2"></div>
                                <div className="col-lg-8">
                                  <ImageSlider
                                    images={images}
                                    businessName={"hotel"}
                                    noofimage={1}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                    ) : (
                      <div className={"cms-details-" + state.activeTab}>
                        {state.activeTab === "overview" && (
                          <HtmlParser text={decode(details?.summarydescription).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")} />
                        )}
                      </div>)}
                </div>
              </div>
            </div>
          </div >
        )}
        <PublicPageCopyrights />
      </StickyContainer >
    </div >
  );
}

export default OpenMarketPlacePackagePreview