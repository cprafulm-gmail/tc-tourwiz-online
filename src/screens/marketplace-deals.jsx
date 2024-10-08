import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import PackageListFilters from "../components/cms/AF-003/cms-package-filters";
import PlainTextComponent from "../components/cms/plain-text-from-html";
import Loader from "../components/common/loader";
import PackageAppliedFilter from "../components/quotation/package-filter-applied";
import Config from "../config.json";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import { useState } from "react";
import { Link as JumpTo } from "react-scroll";
import { useRef } from "react";
import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { Helmet } from "react-helmet";
import PriceConverter from "../components/common/PriceConverter";
import flight from "../assets/images/customer-portal/template-images/our-services-flight.png";
import hotel from "../assets/images/customer-portal/template-images/our-services-hotel.png";
import holiday from "../assets/images/customer-portal/template-images/our-services-holiday-package.png";
import life from "../assets/images/customer-portal/template-images/our-services-life.png";
import transfers from "../assets/images/customer-portal/template-images/our-services-transfers.png";
import visas from "../assets/images/customer-portal/template-images/our-services-visas.png";
import cruises from "../assets/images/customer-portal/template-images/our-services-cruises.png";
import attractions from "../assets/images/customer-portal/template-images/our-services-attractions.png";
import villa from "../assets/images/customer-portal/template-images/villa.png";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="col-lg-12 text-center mt-5">
      <p>Something went wrong:</p>
      {/* <pre>{error.message}</pre> */}
      {/* <button onClick={() => resetErrorBoundary.props.history.push(`/`)}>Try again</button> */}
    </div>
  );
};
const MarketplaceDeals = (props) => {
  const location = useLocation();
  const IsCMS = location.pathname.indexOf("/MarketplacePackages") > -1 ? true : false;
  let themeCode = props.match.params.mode;
  let packageThemeId = themeCode ? atob(themeCode) : null;
  if (!localStorage.getItem("isFromB2Bmarketplace"))
    localStorage.setItem("isFromB2Bmarketplace", "true");
  const [filter, setFilter] = useState({
    packagename: "",
    customername: "",
    email: "",
    phone: "",
    fromDate: moment().add(-1, "M").format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    dateMode: "",
    specificmonth: "1",
    searchBy: "",
    rating: 0,
    packagetheme: "0"
  });
  const [state, setState] = useState({
    results: [],
    isFilters: false,
    isShowFilters: false,
    currentPage: 0,
    pageSize: 12,
    totalRecords: 0,
    hasNextPage: false,
    isLoading: false,
    isBtnLoading: true,
  });
  let myRef = null;

  useEffect(() => {
    debugger;
    (async function () {

      await getPackageDetails(
        state.isFilters ? "filter" : state.currentPage ? "pageing" : ""
      );
    })();
  }, [state.currentPage]);
  // useEffect(() => {
  //   debugger;
  //   (async function () {

  //     await getPackageDetails(
  //       state.isFilters ? "filter" : state.currentPage ? "pageing" : ""
  //     );
  //   })();
  // }, [state.isFilters, state.currentPage]);
  const getPackageDetails = async (mode, themeid) => {
    debugger
    const PThemeID = (themeCode !== undefined && themeCode !== null && packageThemeId !== null) ? packageThemeId : -1;
    setState((prevState) => {
      return {
        ...prevState,
        results: mode === "filter" ? [] : state.results,
        isBtnLoading: true,
        isBtnLoadingPageing: true,
        isLoading: true,
      };
    });
    var reqURL =
      "cms/marketplace/package/list?page=" +
      state.currentPage +
      "&records=" +
      state.pageSize;
    if (filter.packagename) reqURL += "&packagename=" + filter.packagename;
    if (filter.customername) reqURL += "&customername=" + filter.customername;
    if (filter.email) reqURL += "&email=" + filter.email;
    if (filter.phone) reqURL += "&phone=" + filter.phone;
    if (filter.rating > 0) reqURL += "&rating=" + filter.rating;
    if (filter.fromDate) reqURL += "&datefrom=" + filter.fromDate;
    if (filter.toDate) reqURL += "&dateto=" + filter.toDate;
    if (filter.countryid) reqURL += "&countryid=" + filter.countryid;
    if (filter.stateid) reqURL += "&stateid=" + filter.stateid;
    if (filter.cityid) reqURL += "&cityid=" + filter.cityid;
    if (filter.dateMode) reqURL += "&datemode=" + filter.dateMode;
    if (filter.searchBy) reqURL += "&searchby=" + filter.searchBy;
    if (filter.packagetheme) reqURL += "&packagetheme=" + (themeid ? themeid : filter.packagetheme);
    // reqURL += "&packagetheme=" + PThemeID;

    //reqURL += "&groupby=nogroup";//+filter.groupBy;
    if (localStorage.getItem("portalType") === "B2C")
      reqURL += "&customerId=" + props.userInfo.customerID;
    const reqOBJ = {};
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (resonsedata) {
          let results = state.results || [];
          if (mode === "pageing")
            results = results.concat(resonsedata.response);
          else results = resonsedata.response;
          let hasNextPage = true;
          if (resonsedata?.paging?.totalRecords && resonsedata?.paging?.totalRecords > results.length) {
            hasNextPage = true;
          } else {
            hasNextPage = false;
          }
          //setState({ results: resonsedata.response, isLoading: false, isBtnLoading: false });
          setState((prevState) => {
            return {
              ...prevState,
              results,
              isFilters: false,
              defaultResults: results,
              hasNextPage,
              isLoading: false,
              totalRecords: resonsedata?.paging?.totalRecords ?? 0,
              isBtnLoading: false,
              isBtnLoadingPageing:
                mode === "pageing" ? false : state.isBtnLoadingPageing,
            };
          });
          resolve();
        }.bind(this),
        "GET"
      );
    });
  };
  const setDefaultFilter = (callback) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        fromDate: moment().format("YYYY-MM-DD"),
        toDate: moment().format("YYYY-MM-DD"),
        searchBy: "bookbefore",
        dateMode: "today",
      };
    });
    callback(false, "initial-load");
  };
  const showHideFilters = () => {
    setState((prevState) => {
      return { ...prevState, isShowFilters: !state.isShowFilters };
    });
  };
  const handleCategoryClick = (id) => {
    setFilter((prevState) => {
      return {
        ...prevState,
        packagetheme: id + ""
      };
    });

    setState((prevState) => {
      return {
        ...prevState,
        isFilters: true,
        results: [],
        defaultResults: [],
        currentPage: 0,
        totalRecords: 0,
      };
    });
    setState((prevState) => {
      return { ...prevState, ...filter };
    });
    (async function () {

      await getPackageDetails("filter", id + "");
    })();
  }

  const handleFilters = (dataFilter) => {
    filter["packagetheme"] = dataFilter?.packagetheme ?? "";
    filter["packagename"] = dataFilter?.packagename ?? "";
    filter["customername"] = dataFilter?.customername ?? "";
    filter["email"] = dataFilter?.email ?? "";
    filter["dateMode"] = dataFilter?.dateMode ?? "";
    filter["searchBy"] = dataFilter?.searchBy ?? "";
    filter["countryid"] = dataFilter?.countryID ?? "";
    filter["stateid"] = dataFilter?.stateID ?? "";
    filter["cityid"] = dataFilter?.cityID ?? "";
    filter["fromDate"] = dataFilter.fromDate
      ? moment(new Date(dataFilter.fromDate)).format(Global.DateFormate)
      : null;
    filter["toDate"] = filter.toDate
      ? moment(new Date(dataFilter.toDate)).format(Global.DateFormate)
      : null;
    filter["phone"] = dataFilter?.phone ?? "";
    //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"inquirytype";
    filter["rating"] = dataFilter.rating ? parseInt(dataFilter.rating) : 0;
    filter["specificmonth"] = dataFilter.specificmonth;

    setState((prevState) => {
      return {
        ...prevState,
        isFilters: true,
        results: [],
        defaultResults: [],
        currentPage: 0,
        totalRecords: 0,
      };
    });
    setState((prevState) => {
      return { ...prevState, ...filter };
    });

    (async function () {

      await getPackageDetails("filter");
    })();
  };

  const handlePaginationResults = (currentPage) => {
    setState((prevState) => {
      return { ...prevState, currentPage };
    });
  };

  const generateStartRating = (rating) => {
    return (
      rating > 0 &&
      [...Array(parseInt(rating, 10)).keys()].map((item) => {
        return (
          <SVGIcon
            name="star"
            key={item}
            type="fill"
            width="14"
            height="14"
            className="text-primary"
          ></SVGIcon>
        );
      })
    );
  };

  const removeFilter = (filterName) => {
    let filter = filter;
    filter[filterName] = "";
    setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () =>
      getPackageDetails("filter")
    );
    handleFilters(filter);
    myRef.setDefaultFilter();
  };
  const { results, isFilters, isShowFilters, currentPage, hasNextPage, isBtnLoading } = state;

  //let imageURL =  process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";
  const css = `
  .cp-home-deals { background: none; }
        body .showMore {
            text-align: center;
            background: rgb(241, 130, 71) !important;
            overflow: hidden;
        }
        .swiper-container.swiper-container-initialized.swiper-container-horizontal {
          width: 100% !important;
        }
        .AF-005 .cp-home-our-service .our-services-icon img {
          height: auto ;
          width: auto ;
      }
        .AF-005 .cp-home-our-service .our-services-item {
          margin: 0px 40px;
        }
        p.small.text-secondary.mb-0.deal-list-description p {
          margin: 0px !important
        }
        .our-services-item a.active {
          color: rgb(241, 130, 71) !important;
      }
      .our-services-item a.active .our-services-icon {
        border: 2px solid rgb(241, 130, 71) !important;
      }`;

  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
  const order = [3, 2, 1, 5, 11];

  const groupedData = state.totalRecords > 0 && results.reduce((acc, curr) => {
    if (!acc[curr.packageThemeID]) {
      acc[curr.packageThemeID] = [];
    }
    acc[curr.packageThemeID].push(curr);
    return acc;
  }, {});
  return (
    <div className="profile">
      <div className="title-bg pt-3 pb-3 mb-3">
        <Helmet>
          <title>
            {location.pathname.indexOf("/MarketplacePackages") > -1 ? "Marketplace BETA" : "Customer Packages"}
          </title>
        </Helmet>
        <div className="container">
          <h1 className="text-white m-0 p-0 f30">
            <SVGIcon
              name="file-text"
              width="24"
              height="24"
              className="mr-3"
            ></SVGIcon>
            {location.pathname.indexOf("/MarketplacePackages") > -1 ? "Marketplace" : "Packages"}
            {location.pathname.indexOf("/MarketplacePackages") > -1 && <sup style={{ fontSize: "11px", top: "-1.5em" }}>BETA</sup>}
            {(themeCode !== undefined && themeCode !== null && packageThemeId !== null) && <button
              className="btn btn-sm btn-light pull-right mr-2"
              onClick={() => { props.history.push(`/MarketplacePackages`); getPackageDetails("", "back"); }}
            >
              Back
            </button>}
            <button
              className="btn btn-sm btn-light pull-right mr-2"
              onClick={showHideFilters}
            >
              Filters
            </button>
            {/* <select
              value={state.currentCurrency}
              onChange={(e) => handleCurrencyChange(e)}
              name={"currency"}
              id={"currency"}
              className={"form-contrdol  btn btn-sm btn-light pull-right mr-2 d-none"}>
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
            </select> */}
          </h1>
        </div>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="cp-home-deals pt-3">
          <style>{css}</style>
          <div className="container">
            <div className="row" style={{ display: "none" }}>
              <button
                className="btn btn-sm btn-light pull-right mr-2"
                onClick={showHideFilters}
              >
                Filters
              </button>
              {/* <h2 className="mb-4 font-weight-bold text-white">Popular Deals</h2> */}
              {results && isShowFilters && (
                <PackageListFilters
                  onRef={(ref) => (myRef = ref)}
                  handleFilters={handleFilters}
                  showHideFilters={showHideFilters}
                  filterData={filter}
                  //groupByfilter={filter.groupBy}
                  filterMode={props.match.params.filtermode}
                  isHidePackageType={true}
                />
              )}
              {
                <div className="row">
                  <div className="mb-3 col-12 pl-0 pr-0">
                    <PackageAppliedFilter
                      filterData={filter}
                      removeFilter={removeFilter}
                    />
                  </div>
                </div>
              }
            </div>
            <div className="row">
              <div className="col-lg-12">
                {results && isShowFilters && (
                  <PackageListFilters
                    onRef={(ref) => (myRef = ref)}
                    handleFilters={handleFilters}
                    showHideFilters={showHideFilters}
                    filterData={filter}
                    //groupByfilter={filter.groupBy}
                    filterMode={props.match.params.filtermode}
                    isFromMarketplace={true}
                    isHidePackageType={true}
                  />
                )}
              </div>
            </div>
            {/* {<div className="col-lg-12 ">
              <div className="row">
                <div className="mb-3 col-lg-12 pl-0 pr-0">
                  <PackageAppliedFilter
                    filterData={filter}
                    removeFilter={removeFilter}
                  />
                </div>
              </div>
            </div>
            } */}

            <div className="row">

              <div className="AF-005 w-100">
                <div className="cp-home-our-service pt-0">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 pb-2 pt-0">
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="text-center">
                            <div className="d-flex justify-content-center our-services-all-items">
                              <div className="our-services-item" >
                                <Link style={{ color: "#000" }} className={filter.packagetheme === 0 || filter.packagetheme === "0" || filter.packagetheme === "" ? "active" : ""} onClick={() => handleCategoryClick(0)}>
                                  <div className="our-services-icon">
                                    <img src={holiday} alt="" />
                                  </div>
                                  <div className="our-services-name">
                                    <span>{"All"}</span>
                                  </div></Link></div>
                              {order.map((packageThemeID, index) => {
                                // return groupedData[packageThemeID] && (
                                return (
                                  <div className="our-services-item" >
                                    {/* <JumpTo
                                      activeClass="active"
                                      className="text-dark"
                                      href="#"
                                      to={`${packageThemeID}`}
                                      spy={true}
                                      smooth={true}
                                      offset={-20}
                                      duration={500}
                                    > */}
                                    <Link style={{ color: "#000" }} className={filter.packagetheme === (packageThemeID + "") ? "active" : ""} onClick={() => handleCategoryClick(packageThemeID)}>
                                      <div className="our-services-icon">
                                        <img className={packageThemeID === 3 ? "w-50" : ""} src={packageThemeID === 3 ? villa :
                                          packageThemeID === 2 ? flight :
                                            packageThemeID === 1 ? hotel :
                                              packageThemeID === 5 ? attractions :
                                                packageThemeID === 11 ? transfers :
                                                  ""} alt="" />
                                      </div>
                                      <div className="our-services-name">
                                        <span>{packageThemeID === 3 ? "Holidays" :
                                          packageThemeID === 2 ? "Flights" :
                                            packageThemeID === 1 ? "Hotels" :
                                              packageThemeID === 5 ? "Activities" :
                                                packageThemeID === 11 ? "Transfers" :
                                                  ""}</span>
                                      </div></Link>
                                    {/* </JumpTo> */}
                                  </div>);
                              })}
                              {/* <div className="our-services-item">
                                <JumpTo
                                  activeClass="active"
                                  className="text-dark"
                                  href="#"
                                  to="2"
                                  spy={true}
                                  smooth={true}
                                  offset={-20}
                                  duration={500}
                                >
                                  <div className="our-services-icon">
                                    <img src={flight} alt="" />
                                  </div>
                                  <div className="our-services-name">
                                    <span>Flights</span>
                                  </div>
                                </JumpTo>
                              </div>
                              <div className="our-services-item">
                                <JumpTo
                                  activeClass="active"
                                  className="text-dark"
                                  href="#"
                                  to="1"
                                  spy={true}
                                  smooth={true}
                                  offset={-20}
                                  duration={500}
                                >
                                  <div className="our-services-icon">
                                    <img src={hotel} alt="" />
                                  </div>
                                  <div className="our-services-name">
                                    <span>Hotels</span>
                                  </div>
                                </JumpTo>
                              </div>
                              <div className="our-services-item">
                                <JumpTo
                                  activeClass="active"
                                  className="text-dark"
                                  href="#"
                                  to="5"
                                  spy={true}
                                  smooth={true}
                                  offset={-20}
                                  duration={500}
                                >
                                  <div className="our-services-icon">
                                    <img src={attractions} alt="" />
                                  </div>
                                  <div className="our-services-name">
                                    <span>Activity</span>
                                  </div>
                                </JumpTo>
                              </div>
                              <div className="our-services-item">
                                <JumpTo
                                  activeClass="active"
                                  className="text-dark"
                                  href="#"
                                  to="11"
                                  spy={true}
                                  smooth={true}
                                  offset={-20}
                                  duration={500}
                                >
                                  <div className="our-services-icon">
                                    <img src={transfers} alt="" />
                                  </div>
                                  <div className="our-services-name">
                                    <span>Transfers</span>
                                  </div>
                                </JumpTo>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {state.totalRecords > 0 && results
                ? results.map((x, key) => {

                  const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: props.ipCurrencyCode });
                  return (
                    <div key={x.packageThemeID} className="col-lg-3 mb-4">
                      <div
                        className="bg-white populer-deals border"
                        style={{ minHeight: "367px" }}
                      >
                        <div className="clo-lg-12 d-block border border-3 border-white">
                          {x?.smallImagePath ? <img
                            className="img-fluid"
                            src={
                              (x?.smallImagePath.indexOf(".s3.") > 0
                                ? x?.smallImagePath
                                : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
                                x?.portalID +
                                "/SpecialsPromotions/images/" +
                                x?.smallImagePath)
                            }
                            alt={x?.shortDescription}
                          /> : <img
                            className="img-fluid"
                            src={"https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/Default_1.jpg"
                            }
                            alt={x?.shortDescription}
                          />}
                        </div>
                        <div className="p-2 populer-deals-content bg-white">
                          <span style={{ position: "absolute", marginTop: "-23px", right: "27px", padding: "0px 10px", borderRadius: "20px", fontWeight: "500", background: "rgb(241 130 71)", color: "#fff" }}>
                            {(!isNaN(parseInt(x.duration)) && parseInt(x.duration) > 1) && (parseInt(x.duration) > 1 ?
                              (`${parseInt(x.duration)}D/${parseInt(x.duration) - 1}N`) :
                              (`${parseInt(x.duration)}D`))}</span>
                          <h5 className="font-weight-bold mb-3">
                            <Link target={"_blank"} to={"/details/deals/" + x?.specialPromotionID}>
                              {x?.shortDescription}
                            </Link>
                          </h5>
                          <div className="clo-lg-12 d-block">
                            <p className="small text-secondary mb-0 deal-list-description">
                              {/* <HtmlParser text={decode(x?.summaryDescription)} />  */}
                              <PlainTextComponent htmlString={decode(x?.summaryDescription)} />
                            </p>
                          </div>
                          <div className="clo-lg-12 mb-2 d-block font-weight-bold price">
                            {x?.price > 0 && (
                              <>
                                Starting at
                                <span
                                  className="text-dark ml-2 font-weight-bold"
                                  style={{
                                    textDecoration:
                                      x?.offerPrice > 0 ? "line-through" : "none",
                                  }}
                                >

                                  {(convertedCurrency + " ") + convertedPrice}
                                  {/* {portalCurrency + " " + x?.price + " "} */}
                                </span>
                                <span style={{ fontSize: "15px" }} className="d-block"> per person</span>
                              </>
                            )}
                            {x?.offerPrice > 0 && (
                              <span
                                className="text-dark ml-2 font-weight-bold "
                                style={{ marginLeft: ".5rem" }}
                              >
                                {(Config.codebaseType === "tourwiz-marketplace"
                                  ? "INR "
                                  : "INR ") + x?.offerPrice}
                              </span>
                            )}
                          </div>
                          <div
                            className="clo-lg-12 d-block"
                            style={{
                              position: "absolute",
                              bottom: "9px",
                              width: "285px",
                            }}
                          >
                            <Link
                              className="btn btn-lg btn-primary showMore text-white mt-1 pt-1 pb-1 shadow w-100 rounded-0 "
                              style={{
                                background: "rgb(241 130 71);",
                              }}
                              target={"_blank"}
                              to={"/details/deals/" + x?.specialPromotionID}
                            >
                              More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    // <div key={key} className="col-lg-3 mb-4">
                    //   <div
                    //     className="bg-white populer-deals border"
                    //     style={{ minHeight: "355px" }}
                    //   >
                    //     <div className="clo-lg-12 d-block border border-3 border-white">
                    //       <img
                    //         className="img-fluid"
                    //         src={
                    //           x?.smallImagePath.indexOf(".s3.") > 0
                    //             ? x?.smallImagePath
                    //             : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
                    //             x?.portalID +
                    //             "/SpecialsPromotions/images/" +
                    //             x?.smallImagePath
                    //         }
                    //         alt={x?.shortDescription}
                    //       />
                    //     </div>
                    //     <div className="p-2 populer-deals-content bg-white">
                    //       <span style={{ position: "absolute", marginTop: "-23px", right: "27px", padding: "0px 10px", borderRadius: "20px", fontWeight: "500", background: "rgb(241 130 71)", color: "#fff" }}> {!isNaN(parseInt(x.duration)) && (parseInt(x.duration) > 1 ? `${parseInt(x.duration)}D/${parseInt(x.duration) - 1}N` : `${parseInt(x.duration)}D`)}</span>
                    //       <h5 className="font-weight-bold mb-3">
                    //         <Link to={"/details/deals/" + x?.specialPromotionID}>
                    //           {x?.shortDescription}
                    //         </Link>
                    //       </h5>
                    //       <div className="clo-lg-12 d-block">
                    //         <p className="small text-secondary mb-0 deal-list-description">
                    //           <HtmlParser text={decode(x?.summaryDescription)} />
                    //         </p>
                    //       </div>
                    //       {x?.price > 0 &&
                    //         <div className="clo-lg-12 mb-2 d-block font-weight-bold price">
                    //           Starting at
                    //           {x?.price > 0 && (
                    //             <>
                    //               <span
                    //                 className="text-dark ml-2 font-weight-bold"
                    //                 style={{
                    //                   textDecoration:
                    //                     x?.offerPrice > 0 ? "line-through" : "none",
                    //                 }}
                    //               >
                    //                 {(Config.codebaseType === "tourwiz-marketplace"
                    //                   ? "INR "
                    //                   : "INR ") + x?.price + " "}
                    //               </span>
                    //               <span style={{ fontSize: "15px" }} className="d-block"> per person</span>
                    //             </>
                    //           )}
                    //           {x?.offerPrice > 0 && (
                    //             <span
                    //               className="text-dark ml-2 font-weight-bold "
                    //               style={{ marginLeft: ".5rem" }}
                    //             >
                    //               {portalCurrency + " " + x?.offerPrice}
                    //             </span>
                    //           )}
                    //         </div>
                    //       }
                    //       <div
                    //         className="clo-lg-12 d-block"
                    //         style={{
                    //           position: "absolute",
                    //           bottom: "10px",
                    //           width: "285px",
                    //         }}
                    //       >
                    //         <Link
                    //           className="btn btn-lg btn-primary showMore text-white mt-1 pt-1 pb-1 shadow w-100 rounded-0 "
                    //           style={{
                    //             background: "rgb(241 130 71);",
                    //           }}
                    //           to={"/details/deals/" + x?.specialPromotionID}
                    //         >
                    //           More
                    //         </Link>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </div>
                  )
                })
                : isBtnLoading && (
                  <div className="col-lg-12 font-weight-bold d-flex  m-0 p-0 pt-5 d-flex justify-content-center align-items-center">
                    <Loader />
                  </div>
                )}
              {!isBtnLoading && state.totalRecords == 0 && results && (
                <h6 className="col-lg-12 font-weight-bold d-flex  m-0 p-0 pt-5 d-flex justify-content-center align-items-center">
                  No Packages found!
                </h6>
              )}
            </div>
            <div>
              {state.totalRecords > 0 && results && (
                <nav>
                  <ul className="pagination justify-content-center mt-3">
                    <li
                      className={
                        state.totalRecords > 0
                          ? "page-item"
                          : "page-item disabled d-none"
                      }
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        "flex-grow": "2"
                      }}
                    >
                      <span className="text-primary">
                        Showing{" "}
                        {(state.currentPage + 1) * state.pageSize >
                          state.totalRecords
                          ? state.totalRecords
                          : (state.currentPage + 1) * state.pageSize}{" "}
                        out of {state.totalRecords}
                      </span>
                      <button
                        className={"page-link" + (!hasNextPage ? " d-none" : "")}
                        style={{ marginRight: "160px" }}
                        onClick={() => handlePaginationResults(currentPage + 1)}
                      >
                        {isBtnLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Show More
                      </button>
                      <div></div>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div >
      </ErrorBoundary >
    </div >
  );
};

export default MarketplaceDeals;
