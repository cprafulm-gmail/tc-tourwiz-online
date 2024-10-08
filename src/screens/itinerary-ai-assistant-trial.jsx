import React, { Component } from "react";
import { Link } from "react-scroll";
import PublicPageHeader from "../components/landing-pages/public-page-header";
import PublicPageFindus from "../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../components/landing-pages/public-page-clients";
import PublicPageFooter from "../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../components/landing-pages/public-page-copyrights";
import BulletPlus from "../assets/images/tw/bullet-plus-black.png";
import BulletMinus from "../assets/images/tw/bullet-minus-orange.png";
import PlanIconBasic from "../assets/images/tw/plan-icon-basic.svg";
import PlanIconPlus from "../assets/images/tw/plan-icon-plus.svg";
import PlanCheck from "../assets/images/tw/plan-check.svg";
import PlanUnCheck from "../assets/images/tw/plan-uncheck.svg";
import PlanDiscountArrow from "../assets/images/tw/plan-discount-arrow.svg";
import PricingBgImage from "../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import { Link as BrowserRouterLink } from "react-router-dom";
import SVGIcon from "../helpers/svg-icon";
import info from "../assets/images/dashboard/info-circle.svg";
import ReactTooltip from 'react-tooltip';
import { Trans } from "../helpers/translate";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import PackageAIAssitantTrial from "./package-ai-assistant-trial";

const OpenAIAssistantTrial = (props) => {
  const [state, setState] = useState({
    activeTab: "travel-crm",
    activePoint: "",
    activeAllPoints: [],
    currentPlan: "yearly",
    currentPlanType: "india",
    countryName: "",
    countryLoaded: false,
    isDisableTourwizAi: false,
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
    return fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name.toLowerCase() === "india" || data?.country_name.toLowerCase() === "not found") {
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
.page-height {
  display: none !important;
}
`;
  const { activeTab, activePoint, currentPlan, currentPlanType, activeAllPoints } = state;
  return (
    <div className="tw-public-pages tw-pricing-page">
      <style>{css}</style>

      <Helmet>
        <title>TourWizAI Lite beta | Travel Agency Software Price</title>
        <meta
          name="description"
          content="TourWizAI Lite beta | Travel Agency Software Price"
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
        <div className="tw-common-banner mb-0">
          <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1 className="">Introducing TourWizAI Lite
                  <sup className='fw-bold pt-2'
                    style={{
                      fontSize: "18px", fontWeight: "400"
                    }}>
                    BETA
                  </sup>
                </h1>
                <h2>
                  The lightning fast itinerary builder.<br />
                  Don't miss out on the chance to experience the incredible potential of AI for travel planning.
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-plan-header mb-5">
          <div className="container">
            <div className="row">
              <PackageAIAssitantTrial
                hideHeader={false}
                promptMode="Pacakage Itinerary"
                trialMode={false}
              />
            </div>
          </div>
        </div>
        <PublicPageFooter
          trialAIMode={true}
        />
        <PublicPageCopyrights />
      </StickyContainer>
    </div>
  );
}

export default OpenAIAssistantTrial;
