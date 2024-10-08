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
import FeaturesScreenCustomerPortal from "../../assets/images/tw/features-screen-customer-portal.gif";
import feature1 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import feature2 from "../../assets/images/tw/features-screen-itinerary-builder.gif";
import feature3 from "../../assets/images/tw/invoice-module.gif";
import tab1 from "../../assets/images/tw/features-screen-customer-portal.gif";
import tab2 from "../../assets/images/tw/features-screen-itinerary-builder.gif";
import tab3 from "../../assets/images/tw/features-screen-reports-analytics.png";
import tab4 from "../../assets/images/tw/invoice-module.gif";
import { Link as BrowserRouterLink } from "react-router-dom";
import tab5 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import HomePageFeaturesPartner from "../../components/landing-pages/home-page-features-partner";


class SolutionTravelAgent extends Component {
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
            Travel Agents ERP Software | Travel Agents Billing Software | Tourwiz
          </title>
          <meta
            name="description"
            content="Want to build your own brand online? Tourwiz can help you with Travel ERP software, back-office solutions, Invoicing, CRM, Website Builder, corporate billing management, quote tools and much more."
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
                          <h2 className="text-white" style={{ fontSize: "36px", fontWeight: "500", lineHeight: "48px" }}>
                            Efficiently manage customers,
                            save time, costs and resources.<br /> Your own Travel ERP
                          </h2>
                          {/* <h3
                            className="mt-4 font-weight-normal"
                            style={{ fontSize: "1 rem", lineHeight: "2.0rem", fontWeight: "500" }}
                          >
                            Efficiently Manage customers,
                            provide them with an OTA like experience,
                            save time costs and resources
                          </h3> */}
                          {/* <button className="btn btn-lg mt-3">
                            Start Free
                          </button> */}

                          <BrowserRouterLink to={"/signup/"} style={{ paddingTop: "12px" }} className="btn btn-lg mt-3">
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
              <HomePageFeaturesPartner mode="travelagents" handleRedirect={this.handleRedirect} />
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
                    Benefits of TourWiz Travel Agents
                  </h3>
                </div>
              </div> */}
              <div className="row mt-1">
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
                      Increase your corporate business
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Manage your corporate/retail accounts with tourwiz back-office solutions, Invoicing, reconciliation and quote tools. Never lose an Invoice or a payment
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
                      Have a great looking website up and running in minutes, market your  packages, flight/hotel/activity deals and promotions with tools provided. Impress your customer
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
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-5">
                  <img
                    src={feature2}
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
                      Service your travel  business efficiently
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Create and send custom leisure and M.I.C.E. itineraries / packages in minutes, reuse itineraries, faster turnarounds
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
                      Enhance customer experience
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Simple CRM to manage corporate/retail preferences, employee assignments, Never lose and inquiry. Deliver a personalized experience
                    </h5>
                  </div>
                </div>

                <div className="col-lg-5">
                  <img
                    src={feature3}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3", width: "100%" }}
                />
              </div>

              <div className="row">
                <div className="col-lg-5">
                  <img
                    src={FeatureScreenItinerary}
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
                      Reduce your office workload with tourwiz
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Generate invoices from quotes or create them manually,
                      issue credit/debit notes, account reconciliation,
                      follow-ups, financial reporting. Your automated
                      back-office
                    </h5>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <img
                  src={SaprSection}
                  alt=""
                  style={{ margin: "42px 0px", opacity: "0.3" , width: "100%"}}
                />
              </div>

              <div className="row">
                <div className="col-lg-7 d-flex align-items-center">
                  <div>
                    <h2
                      className="font-weight-normal"
                      style={{ fontSize: "2.4rem", color: "#f18247" }}
                    >
                      Make your life simple
                    </h2>
                    <h5
                      className="mt-4 text-secondary"
                      style={{ lineHeight: "2.0rem" }}
                    >
                      Provide an OTA like experience. Let your retail/corporate
                      clients view their itineraries quotes invoices. Allows
                      them to print or export ledgers, documents, invoices. Take
                      payments via gateway provided. Give control to your
                      customers
                    </h5>
                  </div>
                </div>

                <div className="col-lg-5">
                  <img
                    src={FeatureScreenItinerary}
                    alt=""
                    style={{ width: "100%" }}
                  />
                </div>
              </div> */}

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
                    <h5 className={tabImage === "tab1" ? "" : "text-dark"} id="#tab1" onClick={() => { this.hamdleChangeSlideImage("tab1") }}>Customer Portal</h5>
                    <h6 className="text-secondary">
                      Provide an OTA like experience. Let your retail/corporate manage their travel through our customer portal feature
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
                    <h5 className={tabImage === "tab2" ? "" : "text-dark"} id="#tab2" onClick={() => { this.hamdleChangeSlideImage("tab2") }}>Integrated Suppliers and GDS</h5>
                    <h6 className="text-secondary">
                      Create quotes/proposals in minutes with content library and GDS/LCC integrations send via whatsapp/email
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
                    <h5 className={tabImage === "tab3" ? "" : "text-dark"} id="#tab3" onClick={() => { this.hamdleChangeSlideImage("tab3") }}>Import Data</h5>
                    <h6 className="text-secondary">
                      Import as excel,csv file booking details and generate vouchers e-tickets invoices. export data to other file formats
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
                    <h5 className={tabImage === "tab4" ? "" : "text-dark"} id="#tab4" onClick={() => { this.hamdleChangeSlideImage("tab4") }}>Taxation and GST / VAT Configuration</h5>
                    <h6 className="text-secondary">
                      Configurable taxation fields in invoice like GST VAT inbuilt in invoice
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
                    <h5 className={tabImage === "tab5" ? "" : "text-dark"} id="#tab5" onClick={() => { this.hamdleChangeSlideImage("tab5") }}>Marketplace</h5>
                    <h6 className="text-secondary">
                      Marketplace access allows you connect to DMC’s and suppliers across the globe and get best offers, increase your reach
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

export default SolutionTravelAgent;
