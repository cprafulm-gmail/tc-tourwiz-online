import React, { Component } from "react";
import { Link } from "react-scroll";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import BulletPlus from "../../assets/images/tw/bullet-plus-black.png";
import BulletMinus from "../../assets/images/tw/bullet-minus-orange.png";
import PlanIconBasic from "../../assets/images/tw/plan-icon-basic.svg";
import PlanIconPlus from "../../assets/images/tw/plan-icon-plus.svg";
import PlanCheck from "../../assets/images/tw/plan-check.svg";
import PlanUnCheck from "../../assets/images/tw/plan-uncheck.svg";
import PlanDiscountArrow from "../../assets/images/tw/plan-discount-arrow.svg";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import { Link as BrowserRouterLink } from "react-router-dom";
import SVGIcon from "../../helpers/svg-icon";
import info from "../../assets/images/dashboard/info-circle.svg";
import ReactTooltip from 'react-tooltip';
import { Trans } from "../../helpers/translate";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Pricing = (props) => {
  const [state, setState] = useState({
    activeTab: "travel-crm",
    activePoint: "",
    activeAllPoints: [],
    currentPlan: "quarterly",
    currentPlanType: "india",
    countryName: "",
    countryLoaded: false
  });
  const myRef = useRef();


  const handlePointChange = (point) => {
    setState((prevState) => {
      return {
        ...prevState,
        activePoint: state.activePoint !== point ? point : "",
      };
    });
  };

  const handlePointCheck = (point) => {
    let { activeAllPoints } = state;
    const index = activeAllPoints.indexOf(point);
    activeAllPoints.includes(point) ? activeAllPoints.splice(index, 1) : activeAllPoints.push(point);
    setState((prevState) => {
      return {
        ...prevState,
        activeAllPoints
      };
    });
  }
  const changePlan = (plan) => {
    if (state.currentPlanType === "india" && state.currentPlan === "quarterly")
      plan = "yearly";
    else if ((state.currentPlanType === "india" && state.currentPlan === "yearly"))
      plan = "quarterly";
    else if ((state.currentPlanType !== "india" && state.currentPlan === "yearly"))
      plan = "monthly";
    else if ((state.currentPlanType !== "india" && state.currentPlan === "monthly"))
      plan = "yearly";

    setState((prevState) => {
      return {
        ...prevState,
        currentPlan: plan,
      };
    });
  };

  const changePlanType = (plan) => {
    setState((prevState) => {
      return {
        ...prevState,
        currentPlanType: plan,
      };
    });
  };
  const getCountry = () => {
    if (localStorage.getItem('country-manual')) {
      setState((prevState) => {
        return {
          ...prevState, countryName: "United States", currentPlanType: "international", countryLoaded: true
        };
      })
      return;
    }
    return fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name.toLowerCase() === "india") {
          setState((prevState) => { return { ...prevState, countryName: data?.country_name, currentPlanType: "india", countryLoaded: true }; })
        }
        else {
          setState((prevState) => { return { ...prevState, countryName: "india", currentPlanType: "international", countryLoaded: true }; })
        }
        console.log(data, data?.country_name);
      }).catch((err) => {
        setState((prevState) => { return { ...prevState, countryName: "", currentPlanType: "international", countryLoaded: true }; })
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getCountry();
    props.location.pathname === "/pricing/faq" &&
      myRef.current.scrollIntoView();
  }, []);

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
`;
  const scssHideWebsite = `
.imgcheckuncheck.plan-Website {
  display: none;
}
`;
  const { activeTab, activePoint, currentPlan, currentPlanType, activeAllPoints } = state;
  return (
    <div className="tw-public-pages tw-pricing-page">
      <style>{css}</style>

      <Helmet>
        <title>Tourwiz Pricing | Travel Agency Software Price</title>
        <meta
          name="description"
          content="Manage all your leads, Customer Packages, Itineary, accoutning, Flight Booking, invoicing all through Travel Agency Ticketing Software Tourwiz. Visit us. "
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
        <div className="tw-common-banner">
          <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1>Amazing Value & ROI Out-of-the-box</h1>
                <h2>
                  We want to empower travel professionals and help them bounce
                  back with the right digital tools at an extremely affordable
                  cost. Whether you are an individual or an agency, we offer
                  flexible plans to fit your needs and budget.
                </h2>
              </div>
            </div>
          </div>
        </div>
        {state.countryName === "" && state.countryLoaded && <><div className="tw-plan-selection-tabs">
          <div className="container" name="plans">
            <div className="row">
              <div className="col-lg-12">
                <button
                  className={
                    "btn btn-primary" + (currentPlanType === "india" ? " act" : "")
                  }
                  onClick={() => changePlanType("india")}
                >
                  India
                </button>
                <button
                  className={
                    "btn btn-primary" +
                    (currentPlanType === "international" ? " act" : "")
                  }
                  onClick={() => changePlanType("international")}
                >
                  International
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        }
        {state.countryLoaded && <div className="tw-plan-header">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 tw-plan-intro">
                <div className="row">
                  <div className="col-lg-12 ">
                    <h2>Pricing Plans</h2>
                  </div>
                  {/* <div className="col-lg-12">
                    <h3>The best-value-for-money solution in the market</h3>
                    <div className={"tw-plan-switch " + currentPlan}>
                      <h4>
                        <img src={PlanDiscountArrow} alt="" />
                        {currentPlanType === "international" ? '10%' : '20%'} OFF
                      </h4>
                      {currentPlanType === "india" &&
                        <span onClick={() => changePlan("quarterly")}>
                          Quarterly
                        </span>
                      }
                      {currentPlanType !== "india" &&
                        <span onClick={() => changePlan("monthly")}>
                          Monthly
                        </span>
                      }
                      <b onClick={() => changePlan("")}></b>
                      <span onClick={() => changePlan("yearly")}>
                        Yearly
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className={currentPlanType === "india" ? "col-lg-3 col-md-6 pr-0" : "col-lg-4 col-md-6"}>
                <div className="tw-plan-box FREEMIUM">
                  <h2>
                    <img src={PlanIconBasic} alt="BASIC" />{currentPlanType !== "india" && <br />}
                    {"FREEMIUM"}
                  </h2>

                  {currentPlan === "quarterly" && currentPlanType === "india" && (
                    <h3>
                      ₹0<span>&nbsp;</span>
                    </h3>
                  )}

                  {currentPlan === "yearly" && currentPlanType === "india" && (
                    <h3>
                      ₹0<span>&nbsp;</span>
                    </h3>
                  )}

                  {currentPlan === "quarterly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $0<span>&nbsp;</span>
                      </h3>
                    )}

                  {currentPlan === "monthly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $0<span>&nbsp;</span>
                      </h3>
                    )}

                  {currentPlan === "yearly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $0<span>&nbsp;</span>
                      </h3>
                    )}

                  <h4>
                    Single User
                    {/* <a className="ml-1" data-tip="React-tooltip">
                        <img
                          style={{ filter: "none" }}
                          src={info}
                          alt=""
                        />
                      </a>
                      <ReactTooltip aria-haspopup="true" role="example">
                        <b className="pb-1">Tasks</b>
                        <ul className="list-unstyled p-0 pb-0 mb-0">
                          <li className="pb-1 text-left">30 Inquiries</li>
                          <li className="pb-1 text-left">05 Packages</li>
                          <li className="pb-1 text-left">05 Itineraries</li>
                          <li className="pb-1 text-left">05 {Trans("_quotationReplaceKeys")}</li>
                          <li className="pb-1 text-left">05 Customers</li>
                          <li className="pb-1 text-left">01 Employee</li>
                        </ul>
                      </ReactTooltip> */}
                  </h4>

                  <BrowserRouterLink to="/signup" className="btn btn-primary">
                    Start Free
                  </BrowserRouterLink>
                  <h4>Limited Offer *</h4>
                </div>
              </div>

              <div className={currentPlanType === "india" ? "col-lg-3 col-md-6 pr-0" : "col-lg-4 col-md-6"}>
                <div className="tw-plan-box BASIC-PLUS ">
                  <h2>
                    <img src={PlanIconBasic} alt="BASIC" />{currentPlanType !== "india" && <br />}
                    {currentPlanType === "india" ? "BASIC" : "PLUS"}
                  </h2>

                  {currentPlan === "quarterly" && currentPlanType === "india" && (
                    <h3>
                      ₹625<span>PER MONTH - BILLED QUARTERLY</span>
                    </h3>
                  )}

                  {currentPlan === "yearly" && currentPlanType === "india" && (
                    <h3>
                      ₹500<span>PER MONTH - BILLED ANNUALLY</span>
                    </h3>
                  )}

                  {currentPlan === "monthly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $35<span>PER MONTH - BILLED QUARTERLY</span>
                      </h3>
                    )}

                  {currentPlan === "quarterly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $30<span>PER MONTH - BILLED QUARTERLY</span>
                      </h3>
                    )}

                  {currentPlan === "yearly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $27<span>PER MONTH - BILLED ANNUALLY</span>
                      </h3>
                    )}

                  <h4>Unlimited Users</h4>
                  <BrowserRouterLink to={"/signup/" + btoa((currentPlanType === "international" ? "int" : "dom") + "~" + (currentPlan === "yearly" ? "y" : (currentPlanType === "india" ? "q" : "m")) + "~" + (currentPlanType === "india" ? "BASIC" : "PLUS"))} className="btn btn-primary">
                    Register Here
                  </BrowserRouterLink>
                  <h4>No Card Required</h4>
                </div>
              </div>

              <div className={currentPlanType === "india" ? "col-lg-3 col-md-6 pr-0" : "col-lg-4 col-md-6"}>
                <div className="tw-plan-box PLUS-PREMIUM">
                  <h2>
                    <img src={PlanIconPlus} alt="BASIC" />{currentPlanType !== "india" && <br />}
                    {currentPlanType === "india" ? "PLUS" : "PREMIUM"}
                  </h2>

                  {currentPlan === "quarterly" && currentPlanType === "india" && (
                    <h3>
                      ₹1250<span>PER MONTH - BILLED QUARTERLY</span>
                    </h3>
                  )}

                  {currentPlan === "yearly" && currentPlanType === "india" && (
                    <h3>
                      ₹1000<span>PER MONTH - BILLED ANNUALLY</span>
                    </h3>
                  )}

                  {currentPlan === "monthly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $35<span>PER MONTH - BILLED QUARTERLY</span>
                      </h3>
                    )}

                  {currentPlan === "quarterly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $35<span>PER MONTH - BILLED QUARTERLY</span>
                      </h3>
                    )}

                  {currentPlan === "yearly" &&
                    currentPlanType === "international" && (
                      <h3>
                        $32<span>PER MONTH - BILLED ANNUALLY</span>
                      </h3>
                    )}

                  <h4>Unlimited Users</h4>
                  <BrowserRouterLink to={"/signup/" + btoa((currentPlanType === "international" ? "int" : "dom") + "~" + (currentPlan === "yearly" ? "y" : (currentPlanType === "india" ? "q" : "m")) + "~" + (currentPlanType === "india" ? "PLUS" : "PREMIUM"))} className="btn btn-primary">
                    Register Here
                  </BrowserRouterLink>
                  <h4>No Card Required</h4>
                </div>
              </div>
              {currentPlanType === "india" ?
                <div className={currentPlanType === "india" ? "col-lg-3 col-md-6 pr-0" : "col-lg-4 col-md-6"}>
                  <div className="tw-plan-box WEBSITE">
                    <h2>
                      <img src={PlanIconBasic} alt="WEBSITE" />{currentPlanType !== "india" && <br />}
                      {currentPlanType === "india" ? "WEBSITE" : "WEBSITE"}
                    </h2>

                    {currentPlan === "quarterly" && currentPlanType === "india" && (
                      <h3>
                        ₹625<span>PER MONTH - BILLED QUARTERLY</span>
                      </h3>
                    )}

                    {currentPlan === "yearly" && currentPlanType === "india" && (
                      <h3>
                        ₹500<span>PER MONTH - BILLED ANNUALLY</span>
                      </h3>
                    )}

                    {currentPlan === "monthly" &&
                      currentPlanType === "international" && (
                        <h3>
                          $30<span>PER MONTH - BILLED QUARTERLY</span>
                        </h3>
                      )}

                    {currentPlan === "quarterly" &&
                      currentPlanType === "international" && (
                        <h3>
                          $30<span>PER MONTH - BILLED QUARTERLY</span>
                        </h3>
                      )}

                    {currentPlan === "yearly" &&
                      currentPlanType === "international" && (
                        <h3>
                          $27<span>PER MONTH - BILLED ANNUALLY</span>
                        </h3>
                      )}

                    <h4>Unlimited Users</h4>
                    <BrowserRouterLink to={"/signup/" + btoa((currentPlanType === "international" ? "int" : "dom") + "~" + (currentPlan === "yearly" ? "y" : (currentPlanType === "india" ? "q" : "m")) + "~" + (currentPlanType === "india" ? "WEBSITE" : "WEBSITE"))} className="btn btn-primary">
                      Register Here
                    </BrowserRouterLink>
                    <h4>No Card Required</h4>
                  </div>
                </div> : <style>{scssHideWebsite}</style>
              }
            </div>
          </div>
        </div>
        }

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tblplaninclusion table-responsive">
                <table cellpadding="0" align="center" cellspacing="0" border="0" width="100%" className="table">
                  <tbody>
                    <tr>
                      <th width="60%">Features</th>
                      <th width="10%" className="imgcheckuncheck">FREEMIUM</th>
                      <th width="10%" className="imgcheckuncheck">{currentPlanType === "india" ? "BASIC" : "PLUS"}</th>
                      <th width="10%" className="imgcheckuncheck plan-Premium">{currentPlanType === "india" ? "PLUS" : "PREMIUM"}</th>
                      {currentPlanType === "india" && <th width="10%" className="imgcheckuncheck plan-Website">WEBSITE</th>}
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">Dashboard</td></tr>
                    <tr>
                      <td>Number of Users</td>
                      <td className="imgcheckuncheck">1</td>
                      <td className="imgcheckuncheck">Unlimited</td>
                      <td className="imgcheckuncheck plan-Premium">Unlimited</td>
                      <td className="imgcheckuncheck plan-Website">Unlimited</td>
                    </tr>
                    <tr>
                      <td>View Inquries , Itinerires , {Trans("_quotationReplaceKeys")}, Booking</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">Inquiry</td></tr>
                    <tr>
                      <td>Add and manage all your leads & customers at one place</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Indvidual (B2C & B2B) - Inquiry Management - Create Inquiry, Save, Preview ,Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Export Inquiries</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Inquries- View , Edit , Delete (Inquiry, Itinerary , {Trans("_quotationReplaceKeys")})</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Corporate - Inquiry Management - Create Inquiry, Save and Preview /Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Show Activity Log -Activity done on the inquiry e.g track,status etc..</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Import existing inquiries from Excel with one click</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">CUSTOMER PACKAGE BUILDER</td></tr>
                    <tr>
                      <td>Customer Package- Build your own package - Create ,Edit, Save , Preview, Send to Customer</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Build detailed packages in one place that can be retrieved in just a click.</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Share Package   through Copy Link , Download Pdf , Print </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Send stunning detailed packages to your customers</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Mobile Compatible Packages</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Share & Send package to Supplier for rates</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Package- Copy package , Share via Whatsapp</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">ITINERARY BUILDER</td></tr>
                    <tr>
                      <td>Create & Manage Itinerary - Create Inquiry, Save and Preview /Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Share Itinerary  Copy Link , Download Pdf , Print </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Generate Invoice </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Export Itinerary</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Mobile Compatible Itineraries</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Lead Status and Follow Up</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Confirm Bookings</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Master Itinerary -Create , Copy , Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Master Itinerary - Create/ Send itinerary  </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Copying similar itineraries and sharing with customers</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Sharing Itinerary on Whatsapp</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Import existing itineraries from Excel with one click</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Content Library- ability to add destination , sightseeings images</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Create Unlimited Itineraries</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">{Trans("_quotationReplaceKey").toUpperCase()} BUILDER</td></tr>
                    <tr>
                      <td>CREATE Master {Trans("_quotationReplaceKeys")} -Create , Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>{Trans("_quotationReplaceKeys")}- Create Inquiry, Save and Preview /Send</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Share {Trans("_quotationReplaceKeys")}   through Copy Link , Download Pdf , Print </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>{Trans("_quotationReplaceKey")} Builder - Add Cart with Multiple products</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Generate Invoice </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Export {Trans("_quotationReplaceKeys")}</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Mobile Compatible {Trans("_quotationReplaceKeys")}</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Master {Trans("_quotationReplaceKeys")}- Copy/ Send {Trans("_quotationReplaceKeys")} to other customers</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Sharing {Trans("_quotationReplaceKeys")} on Whatsapp, Copy Itinerary</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Import {Trans("_quotationReplaceKeys")}</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">INVOICE</td></tr>
                    <tr>
                      <td>Create Invoice - Create , Add & Manage Invoice</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>The most efficient way to get GST-ready invoices</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Add to Bookings</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">CUSTOMER</td></tr>
                    <tr>
                      <td>Individual - Add , Export</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Invoice details</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Booking details of customer & business wise </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Customer Invoice </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Corporate Customer - Add , Export , Import</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Import Customer , Booking</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Generate Booking Vouchers</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Generate Itinerary Documents</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">ACCOUNTS & RECONCILIATION</td></tr>
                    <tr>
                      <td>Create Invoice (Add to Booking + Add to Customer ledger + Add to All Ledger)</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Track customer invoicing and payments</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Customer reconciliation/ leder</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Create Invoice (Update Invoice)</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Supplier Profile</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Record Supplier Invoices</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Record Payments to Suppliers</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Generate Supplier Statements</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">REPORTS</td></tr>
                    <tr>
                      <td>Inquiry Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Leads Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Booking Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Sales Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Revenue Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Customer Outstanding/Collection Reports</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Supplierwise Payments & Collection Report</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">AGENCY MANAGEMENT</td></tr>
                    <tr>
                      <td>Agency Profile Management</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Employee Management</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">ACCOUNT SETTING</td></tr>
                    <tr>
                      <td>Billing and Subscription </td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Payment History</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">WEBSITE / MARKETING</td></tr>
                    <tr>
                      <td>CMS based website with your branding</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Easily Manage your own website content e.g select Templete/Theme</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Customers can view itineraries, {Trans("_quotationReplaceKeys")}, invoices and bookings online</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Inquirable Fixed Packages</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Hot Deals and Promotions</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Clients can submit inquiries</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Manage Bookings</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">OFFERS</td></tr>
                    <tr>
                      <td>View current offers on Hotels/Flights/Sightseeings/Transfers/Packages</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">MARKETPLACE</td></tr>
                    <tr>
                      <td>Get access to amazing deals from our trusted partners when you sign up</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Newsletter sign-up</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">CUSTOMER LOGIN</td></tr>
                    <tr>
                      <td>Manage Bookings</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Clients can submit inquiries</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Inquirable Fixed Packages</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Hot Deals and Promotions</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td>Customers can view itineraries, {Trans("_quotationReplaceKeys")}, invoices and bookings online</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                    <tr>
                      <td colspan="5" className="acctitle">REWARDS PROGRAM</td></tr>
                    <tr>
                      <td>Redeem Reward point against your Subscription</td>
                      <td className="imgcheckuncheck"><img src={"/static/media/bullet-cross.253e7bd8.png"} alt="" /></td>
                      <td className="imgcheckuncheck"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Premium"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                      <td className="imgcheckuncheck plan-Website"><img src={"/static/media/addon-services-bullet.377b36fb.png"} alt="" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="col-lg-12 tw-addon-services">
                <div className="col-lg-12">
                  <h2>Add-on Services</h2>
                  <h3>
                    We provide a range of services to help you get the most out of
                    your TourWiz experience & grow your business - Available at an
                    additional cost
                  </h3>
                </div>
              </div>
              <div className="col-lg-12 mt-0 tw-addon-services">
                <div className="col-lg-12">
                  <div className="col-lg-12">
                    <ul className="list-unstyled row">
                      <li className="col-lg-6">Dedicated Support and Training Hours</li>
                      <li className="col-lg-6">Account Manager</li>
                      <li className="col-lg-6">Training & Coaching</li>
                      <li className="col-lg-6">Email & Scheduled Call Support</li>
                      <li className="col-lg-6">
                        Data Import Assistance for Customers and Suppliers Data
                      </li>
                      <li className="col-lg-6">Technical Consulting</li>
                      <li className="col-lg-6">Business Strategy Consulting</li>
                      <li className="col-lg-6">Digital Marketing Support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-plan-freetrial">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <h2>
                  Not sure which plan is best for your business?
                </h2>
                <BrowserRouterLink to="/signup" className="btn btn-primary">
                  Start Free
                </BrowserRouterLink>
              </div>
            </div>
          </div>
        </div>
        <div className="container tw-plan-faq tw-features-comingsoon" ref={myRef}>
          <div className="row">
            <div className="col-lg-12">
              <h2>Frequently Asked Questions</h2>

              <div className="row">
                <div className="col-lg-12">
                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-1")}
                      className={activePoint === "tab-1" ? "act" : ""}
                    >
                      {activePoint === "tab-1" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Do I need to enter my credit card details to sign up?
                    </h4>
                    {activePoint === "tab-1" && (
                      <p>
                        No, you can sign up for TourWiz without
                        your credit card details.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-2")}
                      className={activePoint === "tab-2" ? "act" : ""}
                    >
                      {activePoint === "tab-2" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Is there a setup fee?
                    </h4>
                    {activePoint === "tab-2" && (
                      <p>
                        We don’t charge a setup fee. You just need to pay a
                        subscription fee, depending on
                        the option you choose.
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-lg-12">
                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-5")}
                      className={activePoint === "tab-5" ? "act" : ""}
                    >
                      {activePoint === "tab-5" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What is included in my plan?
                    </h4>
                    {activePoint === "tab-5" && (
                      <p>
                        We have 4 plans.{" "}
                        <Link
                          activeClass="active"
                          className="btn btn-link text-primary p-0 m-0"
                          href="#"
                          to="plans"
                          spy={true}
                          smooth={true}
                          offset={-10}
                          duration={500}
                        >
                          Click here for details
                        </Link>
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-6")}
                      className={activePoint === "tab-6" ? "act" : ""}
                    >
                      {activePoint === "tab-6" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Do you provide a discount?
                    </h4>
                    {activePoint === "tab-6" && (
                      <p>
                        Yes, you can get a 20% discount on the monthly
                        subscription fee if you choose the yearly plan.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-7")}
                      className={activePoint === "tab-7" ? "act" : ""}
                    >
                      {activePoint === "tab-7" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What payment modes do you accept?
                    </h4>
                    {activePoint === "tab-7" && (
                      <p>We accept all international debit and credit cards.</p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-8")}
                      className={activePoint === "tab-8" ? "act" : ""}
                    >
                      {activePoint === "tab-8" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Will I be locked into a long-term contract?
                    </h4>
                    {activePoint === "tab-8" && (
                      <p>
                        No. TourWiz is pay-as-you-go, which means you can cancel
                        anytime without any penalty.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-9")}
                      className={activePoint === "tab-9" ? "act" : ""}
                    >
                      {activePoint === "tab-9" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Can I upgrade/downgrade my plan?
                    </h4>
                    {activePoint === "tab-9" && (
                      <p>Yes, you can change your plan anytime.</p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-10")}
                      className={activePoint === "tab-10" ? "act" : ""}
                    >
                      {activePoint === "tab-10" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      How do you ensure the privacy & security of my data in your
                      system?
                    </h4>
                    {activePoint === "tab-10" && (
                      <p>
                        Our platform is hosted on Amazon Web Services (AWS), which
                        is built on an extremely secure cloud infrastructure
                        offering the highest standards of privacy and security. We
                        also provide in-built firewall security. Moreover, our
                        databases are accessible only through web services. Refer
                        to our privacy policy to know more.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-11")}
                      className={activePoint === "tab-11" ? "act" : ""}
                    >
                      {activePoint === "tab-11" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Do I need to have my own inventory to use TourWiz?
                    </h4>
                    {activePoint === "tab-11" && (
                      <p>
                        No, you don’t need to have your own inventory or supplier
                        APIs to use TourWiz. You can import your offline bookings
                        into TourWiz for voucher generation, accounting
                        reconciliation and MIS reports.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-12")}
                      className={activePoint === "tab-12" ? "act" : ""}
                    >
                      {activePoint === "tab-12" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Can I import my Excel data into TourWiz?
                    </h4>
                    {activePoint === "tab-12" && (
                      <p>
                        Absolutely. You can easily import your customer data and
                        inquiries stored in Excel into TourWiz.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-13")}
                      className={activePoint === "tab-13" ? "act" : ""}
                    >
                      {activePoint === "tab-13" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Does TourWiz provide travel content?
                    </h4>
                    {activePoint === "tab-13" && (
                      <p>
                        Yes, TourWiz comes with an in-built database of flights,
                        hotels, activities and transfers to help you save you time
                        looking up details on other websites while creating
                        itineraries or {Trans("_quotationReplaceKeys")}.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-14")}
                      className={activePoint === "tab-14" ? "act" : ""}
                    >
                      {activePoint === "tab-14" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Can I add my own pricing?
                    </h4>
                    {activePoint === "tab-14" && (
                      <p>
                        Yes, we give you the flexibility to enter your cost price
                        and selling price for every item you add, be it flight,
                        hotel, activity, transfer or something else. Your pricing
                        will automatically reflect in the itineraries, {Trans("_quotationReplaceKeys")}
                        and invoices generated by the system.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-141")}
                      className={activePoint === "tab-141" ? "act" : ""}
                    >
                      {activePoint === "tab-141" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What is the TourWiz Reward Program?
                    </h4>
                    {activePoint === "tab-141" && (
                      <p>
                        Our Reward Program allows you to earn reward points on various
                        actions you take in the system, such as adding inquiries, creating
                        itineraries/{Trans("_quotationReplaceKeys")}, adding bookings etc. You can redeem these
                        points against your TourWiz subscription for some amazing savings.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-15")}
                      className={activePoint === "tab-15" ? "act" : ""}
                    >
                      {activePoint === "tab-15" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Do I need to download and Install TourWiz to use it?
                    </h4>
                    {activePoint === "tab-15" && (
                      <p>
                        No, TourWiz is 100% web-based so you don’t need to
                        download anything. You just need an internet connection
                        and you can run TourWiz in your web browser.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-16")}
                      className={activePoint === "tab-16" ? "act" : ""}
                    >
                      {activePoint === "tab-16" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What about updates?
                    </h4>
                    {activePoint === "tab-16" && (
                      <p>
                        TourWiz is a SaaS based application which means that all
                        product updates, including new features will be
                        automatically made available to you as and when they are
                        released.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-17")}
                      className={activePoint === "tab-17" ? "act" : ""}
                    >
                      {activePoint === "tab-17" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Does TourWiz run on mobile?
                    </h4>
                    {activePoint === "tab-17" && (
                      <p>
                        Yes, the entire application has been mobile-optimized to
                        run perfectly on all smartphones and tablets. This means
                        you can manage your business even on-the-go!
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-18")}
                      className={activePoint === "tab-18" ? "act" : ""}
                    >
                      {activePoint === "tab-18" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Can I put my own branding on the itineraries, {Trans("_quotationReplaceKeys")},
                      invoices and vouchers?
                    </h4>
                    {activePoint === "tab-18" && (
                      <p>
                        Absolutely. You can upload your logo and set up your
                        business details in the system and all the documents and
                        emails generated will carry your branding.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-181")}
                      className={activePoint === "tab-18" ? "act" : ""}
                    >
                      {activePoint === "tab-181" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What is the TourWiz Partner Program?
                    </h4>
                    {activePoint === "tab-181" && (
                      <p>
                        TourWiz Partner Program provides travel professionals access to amazing deals
                        on flights, hotels, packages etc from our partner brands. You can avail these
                        deals on their website or directly connect with them for more details.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-19")}
                      className={activePoint === "tab-19" ? "act" : ""}
                    >
                      {activePoint === "tab-19" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Have other questions?
                    </h4>
                    {activePoint === "tab-19" && (
                      <p>
                        <BrowserRouterLink to="/contact-us">Get in touch with us</BrowserRouterLink> and we’ll
                        be happy to address any queries/concerns you may have.
                      </p>
                    )}
                  </div>
                  <div>
                    <h4
                      onClick={() => handlePointChange("tab-20")}
                      className={activePoint === "tab-20" ? "act" : ""}
                    >
                      {activePoint === "tab-20" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      What is Limited Offer*?
                    </h4>
                    {activePoint === "tab-20" && (
                      <p>
                        Limited offer allows 1 user, 30 Inquires, 5 Package, 5 Itineraries, 5 {Trans("_quotationReplaceKeys")}, 5 Customers.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PublicPageFindus />
        <PublicPageWherewe />
        <PublicPageClients />
        <PublicPageFooter />
        <PublicPageCopyrights />
      </StickyContainer>
    </div>
  );
}

export default Pricing;
