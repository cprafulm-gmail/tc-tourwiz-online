import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Link as JumpTo } from "react-scroll";
import moment from "moment";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import PackageListFilters from "../components/cms/AF-003/cms-package-filters";
import flight from "../assets/images/customer-portal/template-images/our-services-flight.png";
import hotel from "../assets/images/customer-portal/template-images/our-services-hotel.png";
import holiday from "../assets/images/customer-portal/template-images/our-services-holiday-package.png";
import life from "../assets/images/customer-portal/template-images/our-services-life.png";
import transfers from "../assets/images/customer-portal/template-images/our-services-transfers.png";
import visas from "../assets/images/customer-portal/template-images/our-services-visas.png";
import cruises from "../assets/images/customer-portal/template-images/our-services-cruises.png";
import attractions from "../assets/images/customer-portal/template-images/our-services-attractions.png";
import villa from "../assets/images/customer-portal/template-images/villa.png";
import Loader from "../components/common/loader";
import PackageAppliedFilter from "../components/quotation/package-filter-applied";
import Config from "../config.json";
import HtmlParser from "../helpers/html-parser";
import { decode } from "html-entities";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import PriceConverter from "../components/common/PriceConverter";

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
    packagetheme: ""
  });
  const [state, setState] = useState({
    results: [],
    isFilters: false,
    isShowFilters: false,
    currentPage: 0,
    pageSize: 50,
    totalRecords: 0,
    hasNextPage: false,
    isLoading: false,
    isBtnLoading: true,
  });
  let myRef = null;

  useEffect(() => {
    (async function () {

      await getPackageDetails(
        state.isFilters ? "filter" : state.currentPage ? "pageing" : ""
      );
    })();
  }, [state.isFilters, state.currentPage]);
  const getPackageDetails = async (mode, ThemeId) => {
    setState((prevState) => {
      return {
        ...prevState,
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
    if (filter.packagetheme) reqURL += "&packagetheme=" + filter.packagetheme;

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

  const handleFilters = (dataFilter) => {
    filter["packagename"] = dataFilter?.packagename ?? "";
    filter["packagetheme"] = dataFilter?.packagetheme ?? "0";
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
  const css = `.cp-home-deals { background: none; }
        body .showMore {
            text-align: center;
            background: rgb(241, 130, 71) !important;
            overflow: hidden;
        }
        .swiper-container.swiper-container-initialized.swiper-container-horizontal {
          width: 100% !important;
        }
        .AF-005 .cp-home-our-service .our-services-icon img {
          height: auto !important;
          width: auto !important;
      }
        .AF-005 .cp-home-our-service .our-services-item {
          margin: 0px 40px;
        }
        p.small.text-secondary.mb-0.deal-list-description p {
          margin: 0px !important
        }
        `;
  const order = [3, 2, 1, 5, 11]; // Given order of package theme IDs
  // const groupedData = state.totalRecords > 0 && order.reduce((acc, curr) => {
  //   const data = results.filter((result) => result.packageThemeID === curr); // Filter data for current package theme ID
  //   if (data.length > 0) {
  //     acc[curr] = data;
  //   }
  //   return acc;
  // }, {});

  // const orderedData = state.totalRecords > 0 && oorder.reduce((acc, key) => {
  //   if (state.totalRecords > 0) {
  //     if (groupedData[key]) {
  //       acc[key] = groupedData[key];
  //     }
  //     return acc;
  //   }
  // }, {});
  const groupedData = state.totalRecords > 0 && results.reduce((acc, curr) => {
    if (!acc[curr.packageThemeID]) {
      acc[curr.packageThemeID] = [];
    }
    acc[curr.packageThemeID].push(curr);
    return acc;
  }, {});
  // .px-3.shadow-lg.mb-5.bg-white.rounded.border.border-rounded
  const params123 = {
    navigation: {
      nextEl: ".swiper-button-next.px-3.shadow-lg.mb-5.bg-white.rounded.border.border-rounded",
      prevEl: ".swiper-button-prev.px-3.shadow-lg.mb-5.bg-white.rounded.border.border-rounded"
    },
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 0
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 0
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 0
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  }
  let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");

  return (
    <div className="profile">
      <div className="title-bg pt-3 pb-3 mb-3">
        <div className="container">
          <h1 className="text-white m-0 p-0 f30">
            <SVGIcon
              name="file-text"
              width="24"
              height="24"
              className="mr-3"
            ></SVGIcon>
            Marketplace
            <sup style={{ fontSize: "11px", top: "-1.5em" }}>BETA</sup>
            <button
              className="btn btn-sm btn-light pull-right mr-2"
              onClick={showHideFilters}
            >
              Filters
            </button>
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
                  isFromMarketplace={true}
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

            <div className="row">

              <div className="AF-005 w-100">
                <div className="cp-home-our-service pt-0">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 pb-2 pt-0">
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="text-center">
                            {/* <h2 className="our-services-title">OUR SERVICES</h2>
                            <p className="our-services-p">
                              Become an Agent & Get Access to Our Wide Array at Travel
                              Services
                            </p> */}
                            <div className="d-flex justify-content-center our-services-all-items">
                              {state.totalRecords > 0 && order.map((packageThemeID, index) => {
                                return groupedData[packageThemeID] && (
                                  <div className="our-services-item" >
                                    <JumpTo
                                      activeClass="active"
                                      className="text-dark"
                                      href="#"
                                      to={`${packageThemeID}`}
                                      spy={true}
                                      smooth={true}
                                      offset={-20}
                                      duration={500}
                                    >
                                      <div className="our-services-icon">
                                        <img src={packageThemeID === 3 ? holiday :
                                          packageThemeID === 2 ? flight :
                                            packageThemeID === 1 ? hotel :
                                              packageThemeID === 5 ? attractions :
                                                packageThemeID === 11 ? transfers :
                                                  ""} alt="" />
                                      </div>
                                      <div className="our-services-name">
                                        <span>{packageThemeID === 3 ? "Holiday" :
                                          packageThemeID === 2 ? "Flight" :
                                            packageThemeID === 1 ? "Hotel" :
                                              packageThemeID === 5 ? "Activity" :
                                                packageThemeID === 11 ? "Transfer" :
                                                  ""}</span>
                                      </div>
                                    </JumpTo>
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
            <div>

              {state.totalRecords > 0 && order.map((packageThemeID, index) => {
                return groupedData[packageThemeID] && (
                  <div className="row mb-4" key={packageThemeID}>
                    <div className="col-lg-12 d-flex align-items-baseline justify-content-between" name={packageThemeID}>
                      <h2 className="w-100 mb-4">{packageThemeID === 3 ? "Holiday" : packageThemeID === 2 ? "Flight" : packageThemeID === 1 ? "Hotel" : packageThemeID === 5 ? "Activity" : packageThemeID === 11 ? "Transfer" : ""}</h2>
                      <Link className="text-secondary w-25 text-right h6" onClick={() => getPackageDetails("", packageThemeID)} to={`/Marketplace/${btoa(packageThemeID)}`}> View All </Link>
                    </div>

                    <Swiper {...params123}>
                      {results.filter(x => x.packageThemeID === parseInt(packageThemeID)).map(x => {

                        const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: props.ipCurrencyCode });
                        return (
                          <div key={x.packageThemeID} className="col-lg-3 mb-4">
                            <div
                              className="bg-white populer-deals border"
                              style={{ minHeight: "367px" }}
                            >
                              <div className="clo-lg-12 d-block border border-3 border-white">
                                <img
                                  className="img-fluid"
                                  src={
                                    x?.smallImagePath.indexOf(".s3.") > 0
                                      ? x?.smallImagePath
                                      : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
                                      x?.portalID +
                                      "/SpecialsPromotions/images/" +
                                      x?.smallImagePath
                                  }
                                  alt={x?.shortDescription}
                                />
                              </div>
                              <div className="p-2 populer-deals-content bg-white">
                                <span style={{ position: "absolute", marginTop: "-23px", right: "27px", padding: "0px 10px", borderRadius: "20px", fontWeight: "500", background: "rgb(241 130 71)", color: "#fff" }}>
                                  {(!isNaN(parseInt(x.duration)) && parseInt(x.duration) > 0) && (parseInt(x.duration) > 1 ?
                                    (`${parseInt(x.duration)}D/${parseInt(x.duration) - 1}N`) :
                                    (`${parseInt(x.duration)}D`))}</span>
                                <h5 className="font-weight-bold mb-3">
                                  <Link to={"/details/deals/" + x?.specialPromotionID}>
                                    {x?.shortDescription}
                                  </Link>
                                </h5>
                                <div className="clo-lg-12 d-block">
                                  <p className="small text-secondary mb-0 deal-list-description">
                                    <HtmlParser text={decode(x?.summaryDescription)} />
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
                                        {convertedCurrency + " " + convertedPrice + " "}
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
                                    bottom: "35px",
                                    width: "285px",
                                  }}
                                >
                                  {props.isLoggedIn ? <Link
                                    className="btn btn-lg btn-primary showMore text-white mt-1 pt-1 pb-1 shadow w-100 rounded-0 "
                                    style={{
                                      background: "rgb(241 130 71);",
                                    }}
                                    target="_self"
                                    to={"/details/deals/" + x?.specialPromotionID}
                                  >
                                    More
                                  </Link> :
                                    <Link
                                      className="btn btn-lg btn-primary showMore text-white mt-1 pt-1 pb-1 shadow w-100 rounded-0 "
                                      style={{
                                        background: "rgb(241 130 71);",
                                      }}
                                      target="_blank"
                                      to="/signup"
                                    >
                                      More
                                    </Link>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Swiper>
                  </div>

                )
              })}
              {/* {Object.keys(groupedData).map(packageThemeID => {

                return (
                  <div className="row mb-4" key={packageThemeID}>
                    <div className="col-lg-12 d-flex align-items-baseline justify-content-between" name={packageThemeID}>
                      <h2 className="w-100 mb-4">{packageThemeID === "3" ? "Holiday" : packageThemeID === "2" ? "Flight" : packageThemeID === "1" ? "Hotel" : packageThemeID === "5" ? "Activity" : "Transfer"}</h2>
                      <Link className="text-secondary w-25 text-right h6" onClick={() => getPackageDetails("", packageThemeID)} to={`/Marketplace/${btoa(packageThemeID)}`}> View All </Link>
                    </div>
                  </div>
                )
              })} */}
            </div>
            {isBtnLoading && (
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
        </div>
      </ErrorBoundary >
    </div >
  );
};

export default MarketplaceDeals;
