import React, { Component, useState } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import { cmsConfig } from "../../helpers/cms-config";
import { Link } from "react-router-dom";
import ImageSlider from "../../components/details/image-slider";
import HtmlParser from "../../helpers/html-parser";
import SVGIcon from "../../helpers/svg-icon";
import { decode } from "html-entities";
import Config from "../../config.json";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import * as Global from "../../helpers/global";
import { CMSContext } from "./cms-context";
import PriceConverter from "../../components/common/PriceConverter";

const CMSDetails = (props) => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const [state, setState] = useState({
    id: 0,
    module: "",
    result: "",
    copyUrl: false,
    isB2B: Config.codebaseType === "tourwiz" ? true : false,
    isLoading: true,
    activeTab:
      props.match.params.module !== "locations"
        ? "overview"
        : "Overview",
  });
  const scrollRef = useRef();

  useEffect(() => { getDetails(); }, []);
  const getDetails = () => {
    let reqOBJ = {};
    let reqURL =
      "cms/" +
      (props.match.params.module !== "locations" ? "specialpromotiondetails" : "locationdetails") +
      "?portalid=0&itemid=" +
      props.match.params.id;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {

        let supplierObj = data?.response.details && data?.response.details[0] && data?.response.details[0]?.twOthers && JSON.parse(data?.response.details[0]?.twOthers);

        const flighDetails = supplierObj && supplierObj?.flight;
        const hotelDetails = supplierObj && supplierObj?.hotelDetails;
        const qualifyingKeys = data?.response?.tabs && Object.keys(data?.response?.tabs).filter((x, key) => {
          return (
            ((x === "flightDetails" && flighDetails !== undefined && flighDetails !== "") || (x === "hotelDetails" && hotelDetails !== undefined && hotelDetails !== "") || (data?.response?.tabs[x] && data?.response?.tabs[x][0] != undefined &&
              data?.response?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != "" &&
              data?.response?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != undefined))
          );
        });
        let firstKey = qualifyingKeys ? qualifyingKeys[0] : "";
        if (props.match.params.module === "locations")
          firstKey = data?.response?.tabs[0]?.tabTitle
        setState({
          ...state, result: data?.response || "",
          isLoading: false,
          activeTab: (data?.response && data?.response.details[0].summarydescription) ? "overview" : firstKey
        });
      },
      "GET"
    );
  };

  const handleTabs = (activeTab) => {

    scrollRef.current.scrollIntoView({ behavior: "smooth" })
    setState({ ...state, activeTab });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDetails();
  }, []);



  const copyToClipboard = () => {
    let isB2B = state.isB2B;
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
    setState((prevState) => {
      return { ...prevState, copyUrl: true };
    });
    setTimeout(() => {
      setState((prevState) => {
        return { ...prevState, copyUrl: false };
      });
    }, 5000);
  };
  const details = state.result.details ? state.result.details[0] : "";
  const title = (details && details?.shortdescription) || "Details";

  const defaultImg = (details && details?.imagepath) ? details?.imagepath.indexOf(".s3.") > 0 ? details?.imagepath :
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/" +
    details?.imagepath : "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg";

  const defaultImgLoc =
    (details && details?.locationImage) ? details?.locationImage.indexOf(".s3.") > 0 ? details?.locationImage : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
      cmsSettings?.portalID +
      "/LocationsGuide/images/" +
      details?.locationImage : "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg";

  let images = [];
  state.result?.tabs?.photoGallery &&
    state.result?.tabs?.photoGallery.map((x) =>
      images.push({
        url: x.imagepath.indexOf(".s3.") > 0 ? x.imagepath :
          process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
          cmsSettings?.portalID +
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
  let supplierObj = details && details?.twOthers && JSON.parse(details?.twOthers);
  let supplierCurrencySymbol = supplierObj && details?.twOthers ? supplierObj?.supplierCurrency ? supplierObj?.supplierCurrency : details?.currencySymbol : details?.currencySymbol;

  const flighDetails = supplierObj && supplierObj?.flight;
  const hotelDetails = supplierObj && supplierObj?.hotelDetails;
  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
  console.log("specialPromotionType", details?.specialPromotionType)

  const [convertedPrice, convertedCurrency] = PriceConverter({ amount: details?.price || 0, currentCurrency: props.ipCurrencyCode });
  return (
    <div>
      {/* <CMSPageTitle title={title} icon="map-marker" /> */}

      <div className="title-bg pt-3 pb-3 mb-3">
        <div className="container">
          <h1 className="text-white m-0 p-0 f30">
            <SVGIcon
              name={"map-marker"}
              width="24"
              height="24"
              className="mr-3"
            ></SVGIcon>
            {title || "Page Title"}

            {/* {props.isLoggedIn &&  */}
            <button
              className="btn btn-sm btn-light pull-right mr-2 "
              onClick={() => copyToClipboard()}
            >
              Share Package
            </button>
            {/* } */}
            {state.copyUrl && (
              <div
                className="alert alert-sm alert-success  pull-right mt-4 pl-2 pr-2 pt-0 pb-0 "
                style={{ fontSize: "0.9rem", position: "absolute", right: "20px" }}
              >
                Copied Link URL to your clipboard
              </div>
            )}
          </h1>
        </div>
      </div>
      {!state.isLoading && props.match.params.module !== "locations" && (
        <div
          style={{ minHeight: "calc(100vh - 284px)" }}
          className="container mt-4 mb-5"
        >
          <div className="row">
            <div className="col-lg-4">
              <img
                class="img-fluid"
                src={defaultImg || defaultImgLoc || details?.imagepath || "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg"}
                alt={details?.shortdescription}
              />
            </div>
            <div className="col-lg-8">
              <h5 className="font-weight-bold">
                {details?.shortdescription}
              </h5>
              <div><span title="Package star rating">{starItems}</span>
                {details?.specialPromotionType && details?.rating ? ` | ` : ``}
                <span title="Package type">{details?.specialPromotionType !== "" && details?.specialPromotionType !== null && details?.specialPromotionType ? `${details?.specialPromotionType}` : ``}</span>
                {((details?.specialPromotionType || details?.rating) && (!isNaN(parseInt(details.duration)) && parseInt(details.duration) > 0)) ? ` | ` : ``}
                <span title="Package duration">{!isNaN(parseInt(details.duration)) && (parseInt(details.duration) > 0) && (parseInt(details.duration) > 1 ? `${parseInt(details.duration)}D/${parseInt(details.duration) - 1}N` : `${parseInt(details.duration)}D`)}</span></div>
              <div className="mb-3"></div>
              {/* <p className="text-secondary">{<HtmlParser text={decode(details?.summarydescription)} />}</p> */}
              {(details?.price > 0) && (<h5 className="text-primary font-weight- w-100" style={{ textDecoration: details?.offerPrice > 0 ? 'line-through' : 'none', marginRight: '.6rem', float: 'left' }}>
                {/* {details?.currencySymbol + " " + details?.price} */}
                {(details?.isShowOnMarketPlace ? "Starting at " + convertedCurrency : convertedCurrency + " ") + " " + convertedPrice + " "}

                <span style={{ fontSize: "15px" }} className="d-block text-secondary"> per person</span>
              </h5>)}
              {details?.offerPrice > 0 && (<h5 className="text-primary font-weight- w-100">
                {/* {details?.currencySymbol + " " + details?.offerPrice} */}
                {(details?.isShowOnMarketPlace ? "Starting at " + portalCurrency : cmsState?.cmsContents?.agentDetails?.currencySymbol + " ") + " " + details?.offerPrice}
              </h5>)}
              {details?.brochureFileName && (
                <a className="btn btn-sm btn-primary"
                  href={details?.brochureFileName}
                  target="_blank" style={{ position: "absolute", top: "0px", right: "0px", color: "fff" }}
                  download={`Package - ${details?.shortDescription && details?.shortDescription}.pdf`}
                >
                  Download Brochure{" "}
                </a>
              )}
              <Link className="btn btn-primary mt-3" to={"/customerinquiry/" + props.match.params.id}>
                Send Inquiry
              </Link>
            </div>
          </div>

          <div ref={scrollRef} />

          <div className="row mt-4">
            <div className="col-lg-12">
              <ul className={details?.summarydescription ? "nav nav-tabs" : "nav nav-tabs"}>
                {details?.summarydescription && <li className="nav-item mr-2">
                  <button
                    class={
                      "nav-link p-2 rounded-0 text-capitalize" +
                      ((details?.summarydescription && state.activeTab === "overview") ? " active" : "")
                    }
                    onClick={() => handleTabs("overview")}
                  >
                    {"Overview"}
                  </button>
                </li>}
                {state.result?.tabs &&
                  Object.keys(state.result?.tabs).map(
                    (x, key) =>

                      ((x === "flightDetails" && flighDetails !== undefined && flighDetails !== "") || (x === "hotelDetails" && hotelDetails !== undefined && hotelDetails !== "") || (state.result?.tabs[x] && state.result?.tabs[x][0] != undefined &&
                        state.result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != "" &&
                        state.result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != undefined)) && (
                        <li className="nav-item mr-2">
                          <button
                            class={
                              "nav-link p-2 rounded-0 text-capitalize" +
                              ((!details?.summarydescription && state.activeTab === "" && key === 1) ? " active" : state.activeTab === x ? " active" : "")
                            }
                            onClick={() => handleTabs(x)}
                          >
                            {x === "photoGallery" ? "Photo Gallery" : x === "priceGuideLine" ? "Price Guideline" : x === "termsConditions" ? "Terms & Conditions" : x === "flightDetails" ? "Flight Details" : x === "hotelDetails" ? "Hotel Details" : x === "description" ? "Itinerary" : x}
                          </button>
                        </li>
                      )
                  )}
              </ul>

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
                          {state.activeTab === "hotelDetails" && hotelDetails && (
                            <HtmlParser
                              text={decode(hotelDetails).replace("<table>", "<table style='width: 100%; border: 1px solid #dee2e6;'>").replaceAll("<td>", "<td style='border-left: 1px solid #dee2e6;'>").replaceAll("<th>", "<th style='border-left: 1px solid #dee2e6;'>")}
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
        </div>
      )}

      {!state.isLoading && props.match.params.module === "locations" && (
        <div
          style={{ minHeight: "calc(100vh - 284px)" }}
          className="container mt-4 mb-5"
        >
          <div className="row">
            <div className="col-lg-2">
              <img
                class="img-fluid"
                src={defaultImgLoc}
                alt={details?.shortdescription}
              />
            </div>
            <div className="col-lg-10">
              <h5 className="font-weight-bold">{details?.locationTitle}</h5>
              <p className="text-secondary">{<HtmlParser text={decode(details?.summarydescription)} />}</p>
              {state.result?.tabs && (
                <div
                  className="text-secondary"
                  style={{ overflow: "hidden", maxHeight: "120px" }}
                >
                  {state.result?.tabs[0]?.tabDetails && (
                    <HtmlParser text={decode(state.result?.tabs[0]?.tabDetails)} />
                  )}
                </div>
              )}
            </div>
          </div>

          <div ref={scrollRef} />

          <div className="row mt-4">
            <div className="col-lg-12">
              <ul className="nav nav-tabs">
                {state.result?.tabs &&
                  state.result?.tabs.map((x) => (
                    <li>
                      <button
                        class={
                          "nav-link p-2 rounded-0 text-capitalize" +
                          (state.activeTab === x?.tabTitle ? " active" : "")
                        }
                        onClick={() => handleTabs(x?.tabTitle)}
                      >
                        {x?.tabTitle}
                      </button>
                    </li>
                  ))}
              </ul>

              <div className="mt-4">
                {state.result?.tabs &&
                  state.result?.tabs.map(
                    (x) =>
                      state.activeTab === x?.tabTitle && (
                        <div className={"cms-details-" + x}>
                          <HtmlParser text={decode(x?.tabDetails)} />
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {state.isLoading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
}

export default CMSDetails;
