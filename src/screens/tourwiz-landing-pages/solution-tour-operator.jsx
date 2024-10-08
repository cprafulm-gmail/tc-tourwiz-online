import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import TwBannerSlide1 from "../../assets/images/tw/Slide-3.png";
import SaprSection from "../../assets/images/landing-pg/home-Info-sap.png";
import feature1 from "../../assets/images/tw/features-screen-itinerary-builder.gif";
import feature2 from "../../assets/images/tw/features-screen-customer-portal.gif";
import feature3 from "../../assets/images/tw/invoice-module.gif";
import feature4 from "../../assets/images/tw/invoice-module.gif";
import feature5 from "../../assets/images/tw/Slide-2.png";
import tab1 from "../../assets/images/tw/Slide-1.png";
import tab2 from "../../assets/images/tw/Slide-3.png";
import { Link as BrowserRouterLink } from "react-router-dom";
import tab3 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import tab4 from "../../assets/images/tw/features-screen-agency-management.png";
import tab5 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import HomePageFeaturesPartner from "../../components/landing-pages/home-page-features-partner";

class SolutionTourAgent extends Component {
  state = {
    tabImage: "tab1",
  };
  hamdleChangeSlideImage = (tab) => {
    this.setState({ tabImage: tab });
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.changeTabForEvery4Sec(5);
    this.interval = setInterval(() => this.changeTabForEvery4Sec(5), 25000);
  }
  changeTabForEvery4Sec = (n) => {
    for (let i = 1; i <= n; i++) {
      setTimeout(() => {
        this.setState({ tabImage: "tab" + i })
      }, i * 5000)
    }
  }
  render() {
    const css = `
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    html {
      scroll-behavior: smooth;
    }`;
    let { tabImage } = this.state;
    return (
      <div className="tw-public-pages tw-features-page">
        <style>{css}</style>

        <Helmet>
          <title>
            DMC's + Tour Operator | Travel Agents Billing Software | Tourwiz
          </title>
          <meta
            name="description"
            content="Provide an OTA-like experience by creating customized itineraries in minutes. Get a beautiful website to place your offers & promotions. Increase your B2B reach. Manage employees, their sales and other details."
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

          <div className="tw-home">
            <div className="tw-banner">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-7 d-flex align-items-center text-center">
                        <div style={{ marginBottom: "82px" }}>
                          <h2 className="text-white" style={{ fontSize: "36px", fontWeight: "500" }}>
                            Reduce your workload,<br /> save time, make more money,<br /> scale your business
                          </h2>
                          {/* <h3
                            className="mt-4 font-weight-normal"
                            style={{ fontSize: "1 rem", lineHeight: "2.0rem", fontWeight: "500" }}
                          >
                            Manage Inquiries, Create beautiful branded itineraries and quotes with social media sharing, close deals, autogenerate invoices from itineraries, manage customer billing, account reconciliation etc
                          </h3> */}
                          {/* <button className="btn btn-lg mt-3">
                            Start Free
                          </button> */}

                          <BrowserRouterLink to={"/signup/"} style={{ paddingTop: "12px" }} className="btn btn-lg mt-3 ml-5">
                            Start Free
                          </BrowserRouterLink>
                          {/* <Link
                            to="/book-demo"
                            className="btn btn-lg mt-3 btn-book-demo"
                          >
                            Book a Demo
                          </Link> */}
                          <button className="btn btn-lg mt-3 tw-banner-video-btn d-none ">
                            Watch Video
                          </button>
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

          {/* <div className="tw-partner d-none">
            <div className="tw-home">
              <HomePageFeaturesPartner mode="touroprator" handleRedirect={this.handleRedirect} />
            </div>
          </div> */}

          <div style={{ margin: "48px 0px" }}>
            <div className="container">
              {/* <div className="row mb-5 mt-3 d-none">
                <div className="col-lg-12 mb-5 mt-3">
                  <h3
                    className="font-weight-bold text-center"
                    style={{ fontSize: "2rem", color: "#f18247" }}
                  >
                    Benefits of TourWiz Tour Operators
                  </h3>
                </div>
              </div> */}
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
                      Impress Your Customers
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Create & send beautiful itineraries in minutes via WhatsApp / email, embellish them with photos and videos Reuse Itineraries
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
                      Build your own brand  online
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Get a beautiful website up and running in minutes, publish your fixed packages deals and offers Market via social media, emails using tools provided. Provide an OTA Like Experience.
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
                      Increase your B2B reach
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Place your offers, promotions on TourWiz B2B Marketplace for verified B2B subscribers,
                      market to them directly with our  campaign services, service them efficiently with our quotation solutions.
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
                    src={feature5}
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
                    src={feature4}
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
                      Simple CRM get all your inquiries  from prospects across marketplace into your CRM, respond immediately with template based quotes and proposals through email / WhatsApp.
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
                      Reduce Workload
                    </h5>
                    <h6 className="text-secondary">
                      Generate invoices, do reconciliation, take payments Your automated back-office reduce workload.
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
                      Get Live Content
                    </h5>
                    <h6 className="text-secondary">
                      Get live content from our api providers for flights hotels activities.
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
                      Tax Configurations
                    </h5>
                    <h6 className="text-secondary">
                      Configurable taxation fields in invoice like GST VAT inbuilt in invoice.
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
                    <h5 className={tabImage === "tab4" ? "" : "text-dark"} id="#tab4"
                      onClick={() => { this.hamdleChangeSlideImage("tab4") }}>
                      Agency Management
                    </h5>
                    <h6 className="text-secondary">
                      Manage employees their sales and other details.
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
                    onClick={() => { this.hamdleChangeSlideImage("tab5") }}
                  >
                    <h5 className={tabImage === "tab5" ? "" : "text-dark"} id="#tab5"
                      onClick={() => { this.hamdleChangeSlideImage("tab5") }}>
                      Manage Accounting
                    </h5>
                    <h6 className="text-secondary">
                      Customer portal allows your travel agents / Customers to  manage their travel documents and accounting.
                    </h6>
                  </div>
                </div>
                <div className="col-lg-5">
                  <img
                    src={tabImage === "tab1" && tab1
                      || tabImage === "tab2" && tab2
                      || tabImage === "tab3" && tab3
                      || tabImage === "tab4" && tab4
                      || tabImage === "tab5" && tab5}
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

export default SolutionTourAgent;
