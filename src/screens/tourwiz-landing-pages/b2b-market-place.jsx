import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import TwBannerMobile from "../../assets/images/tw/001.png";
import SaprSection from "../../assets/images/landing-pg/home-Info-sap.png";
import feature2 from "../../assets/images/tw/Slide-1.png";
import feature3 from "../../assets/images/tw/invoice-module.gif";
import feature4 from "../../assets/images/tw/Slide-2.png";
import feature5 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import tab1 from "../../assets/images/tw/Slide-1.png";
import tab3 from "../../assets/images/tw/Slide-2.png";
import { Link as BrowserRouterLink } from "react-router-dom";
import tab2 from "../../assets/images/tw/Slide-3.png";
import tab4 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import FeaturesScreenCustomerPortal from "../../assets/images/tw/features-screen-customer-portal.gif";
import HomePageFeaturesPartner from "../../components/landing-pages/home-page-features-partner";
import HomePageHowitworksMarketPlace from "../../components/landing-pages/home-page-howitworks-marketplace";
import HomePageReasonsMarketPlace from "../../components/landing-pages/home-page-reasons-marketplace";
import PublicPageWherewe from "../../components/landing-pages/public-page-allofthis-ai";

class B2BMarketPlace extends Component {
  state = {
    tabImage: "tab1",
  };
  hamdleChangeSlideImage = (tab) => {
    this.setState({ tabImage: tab });
  }
  componentDidMount = () => {
    if (!localStorage.getItem("isFromB2Bmarketplace"))
      localStorage.setItem("isFromB2Bmarketplace", "true");
    window.scrollTo(0, 0);
    this.changeTabForEvery4Sec(3);
    this.interval = setInterval(() => this.changeTabForEvery4Sec(3), 15000);
  }
  changeTabForEvery4Sec = (n) => {
    for (let i = 1; i <= n; i++) {
      setTimeout(() => {
        this.setState({ tabImage: "tab" + i })
      }, i * 5000)
    }
  }
  handleRedirect = (page) => {
    this.props.history.push(`/` + page);
  };
  render() {
    const css = `
    html {
      scroll-behavior: smooth;
    }
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    .marketPlaceTab{
      background: linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 18px 18px 18px 18px;
      text-align:center;
      font-size:18px !important;
      padding:18px !important;
    }
    .marketPlaceTab:hover {
      background: linear-gradient(to right, #891d9b, #fa7438) !important;
      color: #fff;
    }
    
    body .tw-marketplace {
      background: url(/static/media/banner-btm-bg.9036b9f6.png) center bottom no-repeat, linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
    background-size: contain !important;
    }
    
    body .tw-partner .tw-home .tw-banner img {
      margin-top: 16px;
      height: 410px;
      cursor: pointer;
    }
    `;
    let { tabImage } = this.state;
    return (
      <div className="tw-public-pages tw-features-page">
        <style>{css}</style>

        <Helmet>
          <title>
            Tourwiz Marketplace | Itinerary Builder, Invoicing,  Accounting, Travel Reconciliation and more
          </title>
          <meta
            name="description"
            content="Take your Travel Business to the next level with Tourwiz B2B Marketplace"
          />
        </Helmet>

        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <div
                className={"hight-z-index mod-search-area"}
                style={{ ...style, transform: "inherit" }}
              >
                <PublicPageHeader />
              </div>
            )}
          </Sticky>

          <div className="tw-partner">
            <div className="tw-home">
              <div className="tw-banner tw-marketplace" style={{ marginBottom: "-80px" }}>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 text-center">
                      <div style={{ marginBottom: "82px" }}>
                        <h2 className="text-white" style={{ fontSize: "36px", fontWeight: "500" }}>
                          Take your Travel Business to the next level with Tourwiz B2B Marketplace
                        </h2>
                        {/* <h3
                          className="mt-4 font-weight-normal"
                          style={{ fontSize: "18px", fontWeight: "400" }}
                        >
                          A platform which connects verified buyers (travel companies registered on Tourwiz) with sellers (content providers like DMC’s, tour operators, airlines, hotel etc) without any intermediaries. Helps travel business of all sizes an opportunity to compete globally
                        </h3> */}

                        <BrowserRouterLink to={"/signup-marketplace"} style={{ paddingTop: "12px" }} className="btn btn-lg mt-3">
                          Start Free
                        </BrowserRouterLink>
                        <BrowserRouterLink to={"/Preview"} target="_blank" style={{ paddingTop: "12px" }} className="btn ml-3 btn-lg mt-3">
                          Preview
                        </BrowserRouterLink>
                        <button className="btn btn-lg mt-3 tw-banner-video-btn d-none ">
                          Watch Video
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-5">
                      <img
                        //onClick={props.handleVideo}
                        src={TwBannerMobile}
                        alt="TourWiz - Virtual companion for travel professionals"
                        style={{ width: "100%", }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <HomePageFeaturesPartner mode="marketplace" handleRedirect={this.handleRedirect} />
              <HomePageReasonsMarketPlace />
              <HomePageHowitworksMarketPlace handleLoginPopup={this.handleRedirect} />
            </div>
          </div>
          <div className="tw-partner">
            <div className="tw-home">
              <div className="tw-public-pages">
                <PublicPageWherewe handleLoginPopup={this.handleRedirect} mode="Marketplace" />
              </div>
            </div>
          </div>
          <div style={{ margin: "48px 0px" }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h3
                    className="font-weight-bold text-center"
                    style={{ fontSize: "2rem", color: "#f18247" }}
                  >
                    Benefits of the Tourwiz B2B Marketplace
                  </h3>
                </div>
              </div>
              {/* for tourwiz subscribers */}
              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""

                  style={{ margin: "2px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>
              {/* <div className="row">
                <div className="col-lg-12">
                  <h3
                    className="font-weight-bold"
                    style={{ fontSize: "2rem", color: "#f18247" }}
                  >
                    For Tourwiz Subscribers
                  </h3>
                </div>
              </div> */}
              <div className="row">
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      Maximize your revenues
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      You get direct access to global content providers without any intermediaries.
                      This allows you to manage your pricing for your customers so you maximize your revenues.
                    </h5>
                  </div>
                </div>

                <div className="col-lg-5">
                  <img
                    src={feature2}
                    alt=""
                    style={{ width: "100%", boxShadow: "0 0rem 1rem rgb(0 0 0 / 15%)" }}
                  />
                </div>
              </div>

              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-5">
                  <img
                    src={feature3}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      No more losing customers to OTA’s
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      As Tourwiz subscribers you get direct access to global content partners and thus you are able to provide more options
                      and offers to your customers at very competitive rates as there are no middlemen. Now they don’t need to go elsewhere
                      as they get content with your service.
                    </h5>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      Keep track of Inquires made
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      All marketplace inquiries to content providers are logged into your Tourwiz CRM as
                      Tourwiz subscribers. This allows you to follow up with the content partners using
                      the CRM tools provided
                    </h5>
                  </div>
                </div>

                <div className="col-lg-5">
                  <img
                    src={feature4}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-5">
                  <img
                    src={feature5}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      Share Marketplace deals with your customers through your CRM
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Tourwiz subscribers can directly share deals from the marketplace with
                      their customers using the share deals option. You can follow up the same
                      as a proposal from the tourwiz CRM.
                    </h5>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      And best of all Tourwiz b2B Marketplace access is completely free
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Tourwiz subscribers get free access to the marketplace once they
                      login @ tourwizonline.com and click on the marketplace tab.
                    </h5>
                  </div>
                </div>

                <div className="col-lg-5">
                  <img
                    src={FeaturesScreenCustomerPortal}
                    alt=""
                    style={{ width: "100%", boxShadow: "0 0rem 1rem rgb(0 0 0 / 15%)" }}
                  />
                </div>
              </div>

              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px 28px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-7">
                  <div
                    className="tw-travel-agents shadow bg-white"
                    style={{
                      background: "#fff",
                      boxShadow: "0 0rem 1rem rgba(0, 0, 0, 0.15)",
                      padding: "16px 16px 12px 16px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                    }}
                    onClick={() => { this.hamdleChangeSlideImage("tab1") }}
                  >
                    <h5 className={tabImage === "tab1" ? "" : "text-dark"} id="#tab1"
                      onClick={() => { this.hamdleChangeSlideImage("tab1") }}>
                      Digital Footprints Forever
                    </h5>
                    <h6 className="text-secondary">
                      Marketplace is forever accessible. Even if you don’t remember the email promotion you can find it on the marketplace
                    </h6>
                  </div>
                  <div
                    className="tw-travel-agents shadow bg-white"
                    style={{
                      background: "#fff",
                      boxShadow: "0 0rem 1rem rgba(0, 0, 0, 0.15)",
                      padding: "16px 16px 12px 16px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                    }}
                    onClick={() => { this.hamdleChangeSlideImage("tab2") }}
                  >
                    <h5 className={tabImage === "tab2" ? "" : "text-dark"} id="#tab2"
                      onClick={() => { this.hamdleChangeSlideImage("tab2") }}>
                      Increase your inquiries
                    </h5>
                    <h6 className="text-secondary">
                      Marketplace deals are visible on your customer portal page too.
                      Every time customers come to log in to see their travel information
                      they see the marketplace deals. Even corporates see the same
                    </h6>
                  </div>
                  <div
                    className="tw-travel-agents shadow bg-white"
                    style={{
                      background: "#fff",
                      boxShadow: "0 0rem 1rem rgba(0, 0, 0, 0.15)",
                      padding: "16px 16px 12px 16px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                    }}
                    onClick={() => { this.hamdleChangeSlideImage("tab3") }}
                  >
                    <h5 className={tabImage === "tab3" ? "" : "text-dark"} id="#tab3"
                      onClick={() => { this.hamdleChangeSlideImage("tab3") }}>
                      Intermediary services (add-on)
                    </h5>
                    <h6 className="text-secondary">
                      Tourwiz marketplace can offer intermediary services  like
                      financial guarantees or fulfilment services only if needed
                      by either the buyer or the seller
                    </h6>
                  </div>
                  {/* <div
                    className="tw-travel-agents shadow bg-white"
                    style={{
                      background: "#fff",
                      boxShadow: "0 0rem 1rem rgba(0, 0, 0, 0.15)",
                      padding: "16px 16px 12px 16px",
                      borderRadius: "4px",
                      marginBottom: "16px",
                    }}
                    onClick={() => { this.hamdleChangeSlideImage("tab4") }}
                  >
                    <h5 className={tabImage === "tab4" ? "" : "text-dark"} id="#tab3"
                      onClick={() => { this.hamdleChangeSlideImage("tab4") }}>
                      Campaign Services (add-on)
                    </h5>
                    <h6 className="text-secondary">
                      Utilize our campaign services to send email campaigns to all verified Tourwiz subscribers Increase the visibility of your promotions / offers
                    </h6>
                  </div> */}
                </div>
                <div className="col-lg-5">
                  <img
                    src={tabImage === "tab1" && tab1
                      || tabImage === "tab2" && tab2
                      || tabImage === "tab3" && tab3}
                    // || tabImage === "tab4" && tab4}
                    alt=""
                    style={{ width: "100%", marginTop: "48px" }}
                  />
                </div>
              </div>
            </div>
          </div>


          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />
        </StickyContainer>
      </div>
    );
  }
}

export default B2BMarketPlace;
