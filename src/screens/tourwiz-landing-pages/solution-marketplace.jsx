import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Link as BrowserRouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import TwBannerSlide1 from "../../assets/images/tw/001.png";
import SaprSection from "../../assets/images/landing-pg/home-Info-sap.png";
import feature1 from "../../assets/images/tw/features-screen-customer-portal.gif";
import feature2 from "../../assets/images/tw/Slide-1.png";
import feature3 from "../../assets/images/tw/invoice-module.gif";
import feature4 from "../../assets/images/tw/Slide-2.png";
import feature5 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import tab1 from "../../assets/images/tw/Slide-1.png";
import tab3 from "../../assets/images/tw/Slide-2.png";
import tab2 from "../../assets/images/tw/Slide-3.png";
import tab4 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import HomePageFeaturesPartner from "../../components/landing-pages/home-page-features-partner";
import HomePageHowitworksMarketPlace from "../../components/landing-pages/home-page-howitworks-marketplace";
import PublicPageWherewe from "../../components/landing-pages/public-page-allofthis-partner";
import HomePageReasonsMarketPlace from "../../components/landing-pages/home-page-reasons-marketplace";

class ContentPartners extends Component {
  state = {
    tabImage: "tab1",
  };
  hamdleChangeSlideImage = (tab) => {
    this.setState({ tabImage: tab });
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.changeTabForEvery4Sec(4);
    this.interval = setInterval(() => this.changeTabForEvery4Sec(4), 20000);
  }
  changeTabForEvery4Sec = (n) => {
    for (let i = 1; i <= n; i++) {
      setTimeout(() => {
        this.setState({ tabImage: "tab" + i })
      }, i * 5000)
    }
  }
  handleRedirect = (page) => {
    this.props.history.push(`/` + page + "-partner");
  };
  render() {
    const css = `
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    html {
      scroll-behavior: smooth;
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
            Content Partner | Travel Agents Billing Software | Tourwiz
          </title>
          <meta
            name="description"
            content="Showcase your offers, promotions to 30K+ verified Tourwiz B2B subscribers. Open for all content providers (airline, hotels DMC’s, activity operators car rentals). Sign up now."
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
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-7 d-flex align-items-center text-center">
                          <div style={{ marginBottom: "82px" }}>
                            <h2 className="text-white mt-0" style={{ fontSize: "36px", fontWeight: "500" }}>
                              Reach 26k+ Agents Globally with the TourWiz Partner Program
                            </h2>
                            <h5 className="text-white" style={{ fontSize: "18px", fontWeight: "400" }}>
                              Add a powerful revenue growth channel to your business and boost your brand visibility and sales at no cost!
                            </h5>
                            {/* <button className="btn btn-lg mt-3">
                            Start Free
                            </button> */}
                            <a href="https://partners.tourwizonline.com/signup"
                              target="_blank"
                              style={{ paddingTop: "12px" }}
                              className="btn btn-lg mt-3">
                              Become a Partner
                            </a>
                            {/* <Link
                              to="/book-demo"
                              className="btn btn-lg mt-3 btn-book-demo"
                            >
                              Book a Demo
                            </Link>
                            <button className="btn btn-lg mt-3 tw-banner-video-btn d-none ">
                              Watch Video
                            </button> */}
                          </div>
                        </div>

                        <div className="col-lg-5 slideImage">
                          <img
                            src={TwBannerSlide1}
                            alt="TourWiz - Virtual companion for travel professionals"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-partner">
            <div className="tw-home">
              <HomePageFeaturesPartner handleRedirect={this.handleRedirect} />
              <HomePageReasonsMarketPlace />
              <HomePageHowitworksMarketPlace handleLoginPopup={this.handleRedirect} />
            </div>
          </div>

          <div style={{ margin: "48px 0px" }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mb-5 mt-3">
                  <h3
                    className="font-weight-bold text-center"
                    style={{ fontSize: "2rem", color: "#f18247" }}
                  >
                    Benefits of the Tourwiz B2B Partner Program
                  </h3>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <img
                    src={feature1}
                    alt=""
                    style={{ width: "100%", boxShadow: "0 0rem 1rem rgb(0 0 0 / 15%)" }}
                  />
                </div>

                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      Increase your reach
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      First of its kind platform in travel which connects verified buyers and sellers directly without any intermediaries
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
                      Increase sales
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Using our simple tools Create and publish packages, offers promotions deals on marketplace  get more visibility
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
                      Never lose an inquiry
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      All inquiries made on the marketplace directly register in your Tourwiz CRM along with email WhatsApp notifications. Be on top of all inquiries.
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
                      Direct connect with agencies
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Utilize our campaign services to send email campaigns to all verified Tourwiz subscribers. Increase the visibility of your promotions / offers.
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
                      Scale your business to new heights
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      You may have many agencies giving you business but with Tourwiz Marketplace, you have access to tens of thousands of travel businesses globally.
                    </h5>
                  </div>
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
                      Publish deals
                    </h5>
                    <h6 className="text-secondary">
                      Publish deals on your website and marketplace simultaneously
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
                      Digital Footprints Forever
                    </h5>
                    <h6 className="text-secondary">
                      Campaigns are one time, marketplace is forever accessible
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
                      Indirect Reach
                    </h5>
                    <h6 className="text-secondary">
                      Indirectly reach millions of travellers via agencies landing pages, generate more agency inquiries
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
                    onClick={() => { this.hamdleChangeSlideImage("tab4") }}
                  >
                    <h5 className={tabImage === "tab4" ? "" : "text-dark"} id="#tab3"
                      onClick={() => { this.hamdleChangeSlideImage("tab4") }}>
                      Add On Services
                    </h5>
                    <h6 className="text-secondary">
                      Tourwiz marketplace can offer intermediary services  like financial guarantees or fulfilment services only if needed by either the buyer or the seller else they communicate directly.
                    </h6>
                  </div>
                </div>
                <div className="col-lg-5">
                  <img
                    src={tabImage === "tab1" && tab1
                      || tabImage === "tab2" && tab2
                      || tabImage === "tab3" && tab3
                      || tabImage === "tab4" && tab4}
                    alt=""
                    style={{ width: "100%", marginTop: "48px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tw-partner">
            <div className="tw-home">
              <div className="tw-public-pages">
                <PublicPageWherewe handleLoginPopup={this.handleRedirect} mode="Marketplace" />
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

export default ContentPartners;