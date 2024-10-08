import React, { Component } from "react";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import { InlineWidget } from "react-calendly";
import { StickyContainer, Sticky } from "react-sticky";

class StaticDeals extends Component {
  state = {};

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;
    return (
      <div className="tw-public-pages tw-offers-page">
        <style>{css}</style>

        <Helmet>
          <title>Book a Demo</title>
          <meta
            name="description"
            content="Get access to amazing deals from our trusted partners when you
            sign up"
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
                  <h1>Book a Demo</h1>
                  <h2>
                    See TourWiz in action with one of our product experts
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <p>Feature is not available or Service cannot be accessed at this time </p>
                  {/*                 
      <InlineWidget url="https://www.calendly.com/trialdemo" styles={{
  height: '850px'
}} /> */}
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
}

export default StaticDeals;
