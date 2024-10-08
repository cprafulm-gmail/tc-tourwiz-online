import React, { Component } from "react";
import FeaturesItineraryBuilder from "../../assets/images/tw/features-itinerary-builder.png";
import FeaturesAccountingReconciliation from "../../assets/images/tw/features-accounting-reconciliation.svg";
import FeaturesAgencyManagement from "../../assets/images/tw/features-agency-management.png";
import FeaturesReportsAnalytics from "../../assets/images/tw/features-reports-analytics.svg";
import FeaturesCustomerPortal from "../../assets/images/tw/features-customer-portal.png";
import FeaturesTravelCrm from "../../assets/images/tw/features-travel-crm.png";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import BulletPlus from "../../assets/images/tw/bullet-plus-black.png";
import BulletMinus from "../../assets/images/tw/bullet-minus-orange.png";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import FeaturesScreenTravelCRM from "../../assets/images/tw/features-screen-travel-crm.gif";
import FeaturesScreenItineraryBuilder from "../../assets/images/tw/features-screen-itinerary-builder.gif";
import FeaturesScreenAccountingReconciliation from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import FeaturesScreenReportsAnalytics from "../../assets/images/tw/features-screen-reports-analytics.gif";
import FeaturesScreenAgencyManagement from "../../assets/images/tw/features-screen-agency-management.gif";
import FeaturesScreenCustomerPortal from "../../assets/images/tw/features-screen-customer-portal.gif";
import FeaturesScreenInvoicingModule from "../../assets/images/tw/invoice-module.gif";
import FeaturesScreenPackageModule from "../../assets/images/tw/package-module.gif";
import FeaturesScreenTourwizAI from "../../assets/images/tw/tourwizAI.gif";
import FeaturesScreenB2BMarketPlace from "../../assets/images/tw/b2bmarketplace.gif";
import FeaturesB2BMarketPlace from "../../assets/images/tw/marketplace-purple.png";
import FeaturesAIAssistant from "../../assets/images/tw/AI-purple.png";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import Sample1 from "../../assets/images/tw/Itenary-section1.jpg";
import Sample2 from "../../assets/images/tw/Itenary-section2.jpg";
import Sample3 from "../../assets/images/tw/Itenary-section3.jpg";
import Sample4 from "../../assets/images/tw/Itenary-section4.jpg";
import itinerarySamplePDF1 from '../../assets/templates/Maldives-Sample-Itinerary.pdf';
import itinerarySamplePDF2 from '../../assets/templates/Ladakh-Sample-Itinerary.pdf';
import itinerarySamplePDF3 from '../../assets/templates/Sri Lanka-Sample-Itinerary.pdf';
import itinerarySamplePDF4 from '../../assets/templates/Himachal-Sample-Itinerary.pdf';
import FeaturesPackagemodule from "../../assets/images/tw/packages.png";
import FeaturesInvoicingModule from "../../assets/images/tw/invoice.png";
import { Trans } from "../../helpers/translate";
import { Link } from "react-router-dom";

class Features extends Component {
  state = {
    activeTab: this.props.match.params.featurename ? this.props.match.params.featurename : "b2b-Marketplace",
    activePoint: "",
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
    this.props.history.push(`/features/` + tab);
  };

  handlePointChange = (point) => {
    this.setState({
      activePoint: this.state.activePoint !== point ? point : "",
    });
  };

  componentDidMount() {
    this.props.match.params.featurename.toLowerCase() === "all-features" ? window.scrollTo(0, 0) : window.scrollTo(0, 240);
  }

  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }
  .tw-features-box {
    width:150px !important;
  }`;
    var { activeTab, activePoint } = this.state;
    activeTab = this.props.match.params.featurename.toLowerCase() === "all-features" ? "b2b-Marketplace" : activeTab;
    return (
      <div className="tw-public-pages tw-features-page">
        <style>{css}</style>

        <Helmet>
          <title>
            Tourwiz Features | Itinerary Builder, Invoicing,  Accounting, Travel Reconciliation and more
          </title>
          <meta
            name="description"
            content="Sign Up Free or Schedule a Demo to see all features of Tourwiz at no cost. Itinerary Builder, Invoicing Software, Travel Agents Accounting software, Tour Operator Back Office Software and many more."
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
                  <h1>TourWiz Features</h1>
                  <h2>
                    TourWiz comes with a wide range of functionalities to help you
                    run your business more efficiently and increase your sales
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-features-icons">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 d-flex justify-content-between" style={{ overflow: "auto" }}>

                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "b2b-Marketplace" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("b2b-Marketplace")}
                  >
                    <img src={FeaturesB2BMarketPlace} alt="Package Module" />
                    <h5>B2B Marketplace</h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "tourWizAI-Lite" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("tourWizAI-Lite")}
                  >
                    <img src={FeaturesAIAssistant} alt="Package Module" />
                    <h5>TourWizAI <br />Lite <sup style={{ fontSize: "8px" }}>BETA</sup></h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "package-module" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("package-module")}
                  >
                    <img src={FeaturesPackagemodule} alt="Package Module" />
                    <h5>Package Module</h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "invoicing-module" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("invoicing-module")}
                  >
                    <img src={FeaturesInvoicingModule} alt="Invoicing Module" />
                    <h5>Invoicing Module</h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "customer-portal" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("customer-portal")}
                  >
                    <img src={FeaturesCustomerPortal} alt="Agency Management" />
                    <h5>Travel Website</h5>
                  </div>

                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "accounting-reconciliation" ? " active" : "")
                    }
                    onClick={() =>
                      this.handleTabChange("accounting-reconciliation")
                    }
                  >
                    <img
                      src={FeaturesAccountingReconciliation}
                      alt="Accounting & Reconciliation"
                    />
                    <h5>Accounting & Reconciliation</h5>
                  </div>
                  {/* </div>

                <div className="col-lg-6 d-flex justify-content-between"> */}

                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "travel-crm" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("travel-crm")}
                  >
                    <img src={FeaturesTravelCrm} alt="Travel CRM" />
                    <h5>
                      Travel <br />
                      CRM
                    </h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "itinerary-builder" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("itinerary-builder")}
                  >
                    <img src={FeaturesItineraryBuilder} alt="Itinerary Builder" />
                    <h5>Itinerary Builder</h5>
                  </div>
                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "reports-analytics" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("reports-analytics")}
                  >
                    <img
                      src={FeaturesReportsAnalytics}
                      alt="Reports & Analytics"
                    />
                    <h5>Reports & Analytics</h5>
                  </div>

                  <div
                    className={
                      "tw-features-box" +
                      (activeTab === "agency-management" ? " active" : "")
                    }
                    onClick={() => this.handleTabChange("agency-management")}
                  >
                    <img src={FeaturesAgencyManagement} alt="Agency Management" />
                    <h5>Agency Management</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-features-details">
            <div className="container">

              {activeTab === "b2b-Marketplace" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>B2B Marketplace</h2>
                    <p>
                      Take your Travel Business to the next level with Tourwiz B2B Marketplace
                    </p>
                    <p>TourWiz, a leading B2B travel marketplace that offers a wide range of travel products and services to travel agents, tour operators, and travel companies or “buyers”.</p>
                    <p>TourWiz provides buyers direct access to a vast network of “sellers”, including but not limited to hotels, activities, transfers, and packages, allowing travel agents to easily find and book the best products for their clients.</p>
                    <p>Our unique model connects small and medium-sized travel companies with global content providers, on a one-to-one basis.</p>
                    <p>By cutting out the middleman, TourWiz is revolutionizing the way travel businesses (buyers and sellers) can compete with the OTA’s and reach their full revenue potential.</p>
                    <ul className="list-unstyled">
                      <li>Share Marketplace deals with your customers through your CRM</li>
                      <li>Best of all Tourwiz b2B Marketplace access is completely free</li>
                      <li>No more losing customers to OTA’s</li>
                      <li>Keep track of Inquires made</li>
                      <li>Maximize your revenues</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img src={FeaturesScreenB2BMarketPlace} alt="Invoicing Module" />
                  </div>
                </div>
              )}
              {activeTab === "tourWizAI-Lite" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>TourWizAI Lite <sup>BETA</sup></h2>
                    <p>
                      The lightning fast itinerary builder.
                      Don't miss out on the chance to experience the incredible potential of AI for travel planning.
                    </p>
                    {/* <p>You can now create and manage invoices through our Invoicing module. This feature helps travel agents to create, print, and share invoices with their customers and also collect payments. With this feature, you can add details of invoices, all services, prices, and guests so that you do not miss out on any important details.</p>
                    <p>Our travel agents can now create GST/VAT/TAX - ready invoices at their fingertips!</p> */}
                    <ul className="list-unstyled">
                      <li>TourWizAI Lite <sup>BETA</sup> uses artificial intelligence to generate personalized itineraries based on your queries or prompts.</li>
                      <li>Simply type in your own queries or use the provided sample prompts to get started. Click the “use” button and replace the text in [square brackets] with your text and generate.</li>
                      {/* <li>All of your client's invoices at one place</li> */}
                    </ul>
                    <Link className="btn btn-outline-primary ml-4 mb-5" to="/tourwizAI"> Try It</Link>
                  </div>
                  <div className="col-lg-7">
                    <img src={FeaturesScreenTourwizAI} alt="Invoicing Module" />
                  </div>
                </div>
              )}
              {activeTab === "invoicing-module" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Invoicing Module</h2>
                    <p>
                      Never lose on payments with our GST/VAT/Tax - ready invoices!
                    </p>
                    <p>You can now create and manage invoices through our Invoicing module. This feature helps travel agents to create, print, and share invoices with their customers and also collect payments. With this feature, you can add details of invoices, all services, prices, and guests so that you do not miss out on any important details.</p>
                    <p>Our travel agents can now create GST/VAT/Tax - ready invoices at their fingertips!</p>
                    <ul className="list-unstyled">
                      <li>Create & Manage invoices in one place</li>
                      <li>The most efficient way to get GST/VAT/Tax - ready invoices</li>
                      <li>All of your client's invoices at one place</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img src={FeaturesScreenInvoicingModule} alt="Invoicing Module" />
                  </div>
                </div>
              )}

              {activeTab === "package-module" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Package Module</h2>
                    <p>
                      Impress your clients & simplify your workflow by building stunning packages!
                    </p>
                    <p>The package module allows you to build a detailed package of your travel services provided to your client. It gives an overview of the package to the client like travel dates, inclusions, exclusions, T&C, and Price guidelines, and allows you to upload PDFs & images of your choice.
                      This package is shareable via a mobile-friendly link with customers.
                      With the option of adding photos, content databases, and supplier integrations, it’s the tool you need to deliver jaw-dropping packages that set you apart.
                    </p>
                    <p>And all of these options are built into an in-house package module!</p>
                    <ul className="list-unstyled">
                      <li>All your Packages are stored in one place</li>
                      <li>Build detailed packages in one place that can be retrieved in just a click.</li>
                      <li>Easily send packages via a mobile-friendly link to your customers</li>
                      <li>Send stunning detailed packages to your customers</li>
                      <li>Create templates and a library of your frequently used content and save time</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img src={FeaturesScreenPackageModule} alt="Package Module" />
                  </div>
                </div>
              )}

              {activeTab === "travel-crm" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Travel CRM</h2>
                    <p>
                      TourWiz ensures you have all your inquiries and customer
                      details at your fingertips to fulfill client needs quickly
                      and more effectively. With our Travel CRM you can oversee
                      your entire sales pipeline and streamline your marketing
                      activities to maximize bookings.
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        Add and manage all your leads & customers at one place
                      </li>
                      <li>Capture inquiries from multiple sources</li>
                      <li>Build {Trans("_quotationReplaceKeys")} and itineraries from inquiries</li>
                      <li>
                        Use our travel database for {Trans("_quotationReplaceKeys")} and/or add your own
                        services(visa, forex etc){" "}
                      </li>
                      <li>Set lead status and follow up</li>
                      <li>Sales Pipeline View</li>
                      <li>
                        Generate branded quotes, invoices and booking vouchers
                      </li>
                      <li>
                        Add bookings and manage their
                        status(booked,confirmed,cancelled etc)
                      </li>
                      <li>Import your existing inquiries and {Trans("_quotationReplaceKeys")} from Excel with one click</li>
                      <li>Configure follow up dates for inquiries through a calendar view and get alerts on dashboard</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img src={FeaturesScreenTravelCRM} alt="Travel CRM" />
                  </div>
                </div>
              )}

              {activeTab === "itinerary-builder" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Itinerary Builder</h2>
                    <p>
                      Creating custom itineraries/packages using excel sheets or
                      word documents can be extremely time-consuming. TourWiz
                      includes an easy-to-use itinerary builder to help you
                      generate fully customized itineraries with photos, details
                      and your own branding in minutes.
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        Built-in content database of Flights, Hotels, Activities
                        and Transfers
                      </li>
                      <li>
                        Set up your own rates at service level or package level
                      </li>
                      <li>Add your own services</li>
                      <li>
                        Auto-calculation of total price based on items added
                      </li>
                      <li>Add terms & conditions, inclusions and exclusions</li>
                      <li>
                        Share itineraries with rich content as a weblink or PDF
                      </li>
                      <li>Show itemized pricing and/or package pricing</li>
                      <li>
                        Add attachments to itineraries (e.g. vouchers/booking
                        confirmation files)
                      </li>
                      <li>Copy and reuse itineraries for other customers</li>
                      <li>Import existing itineraries from Excel with one click</li>
                      <li>Send itineraries & quotes to suppliers for availability check with single click</li>
                      <li>Set ‘Book before’ dates to confirm booking before payment to supplier becomes due</li>

                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img
                      src={FeaturesScreenItineraryBuilder}
                      alt="Itinerary Builder"
                    />
                  </div>
                </div>
              )}

              {activeTab === "accounting-reconciliation" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Accounting & Reconciliation</h2>
                    <p>
                      TourWiz automates your manual accounting process to a large
                      degree, minimizing the risk of costly errors. Our Travel
                      Accounting module provides you with all the accounting
                      reports you need to easily track your finances. It also
                      makes it easier for you to reconcile payments with suppliers
                      and customers.
                    </p>
                    <ul className="list-unstyled">
                      <li>Customer Ledger</li>
                      <li>Supplier Ledger</li>
                      <li>Track customer invoicing and payments</li>
                      <li>Manage Supplier Profile</li>
                      <li>Record Supplier Invoices</li>
                      <li>Record Payments to Suppliers</li>
                      <li>Customer Reconciliation</li>
                      <li>Supplier Reconciliation</li>
                      <li>Calculation of GST and other taxes</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img
                      src={FeaturesScreenAccountingReconciliation}
                      alt="Accounting & Reconciliation"
                    />
                  </div>
                </div>
              )}

              {activeTab === "reports-analytics" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Reports & Analytics</h2>
                    <p>
                      Get a birds eye view of your business without manually
                      entering rows and rows of data and configuring complex
                      formulas in Excel. See your latest inquiries, itineraries,
                      {Trans("_quotationReplaceKeys")} and bookings through our dashboard view. Get
                      auto-generated business reports to track bookings, revenue,
                      payments, inventory etc to the last penny.
                    </p>
                    <ul className="list-unstyled">
                      <li>Consolidated view of inquiries from all sources</li>
                      <li>
                        Filters for source, status, priority or any other preset
                        parameter
                      </li>
                      <li>Booking Reports</li>
                      <li>Sales Reports</li>
                      <li>Revenue Reports</li>
                      <li>Outstanding & Collection Reports</li>
                      <li>Supplier Payment Reports</li>
                      <li>Inventory Reports</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img
                      src={FeaturesScreenReportsAnalytics}
                      alt="Reports & Analytics"
                    />
                  </div>
                </div>
              )}

              {activeTab === "agency-management" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Agency Management</h2>
                    <p>
                      TourWiz helps you set up all your business details in one
                      place and apply them in documents and emails, rather than
                      having to manually enter them every time. This can save you
                      a lot of effort and time.
                    </p>
                    <ul className="list-unstyled">
                      <li>Create your business profile</li>
                      <li>
                        Configure details like name, address, phone, email, logo,
                        GST no etc
                      </li>
                      <li>Set up employees with roles and permissions</li>
                      <li>Set up branches and assign employees to branch</li>
                      <li>Create and manage agent wallets (credit)</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img
                      src={FeaturesScreenAgencyManagement}
                      alt="Agency Management"
                    />
                  </div>
                </div>
              )}

              {activeTab === "customer-portal" && (
                <div className="row">
                  <div className="col-lg-5">
                    <h2>Travel Website</h2>
                    <p>
                      TourWiz gives you the option of providing your B2C and
                      Corporate customers an online interface where they can log
                      in and access deals, fixed packages, {Trans("_quotationReplaceKeys")},
                      itineraries, bookings, as well as make payments against
                      invoices.
                    </p>
                    <ul className="list-unstyled">
                      <li>CMS based website with your branding</li>
                      <li>Easily Manage your own website content</li>
                      <li>Inquirable Fixed Packages</li>
                      <li>Hot Deals and Promotions</li>
                      <li>Clients can submit inquiries</li>
                      <li>Manage Bookings</li>
                      <li>Newsletter sign-up</li>
                      <li>Customers can view itineraries, {Trans("_quotationReplaceKeys")}, invoices and bookings online</li>
                    </ul>
                  </div>
                  <div className="col-lg-7">
                    <img
                      src={FeaturesScreenCustomerPortal}
                      alt="Customer Portal"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {activeTab === "itinerary-builder" && (
            <div className="tw-sample-itinerary">
              <div className="container">
                <h2>Sample Itineraries</h2>
                <h3 className="subheading">Generate attractive itineraries like these with your branding in just a few clicks</h3>


                <div className="row  justify-content-center">
                  <div className="col-lg-3 mt-5 pl-4 pr-4">
                    <div className="tw-sample-box">
                      <div className="w-100">
                        <img className="w-100"
                          src={Sample1}
                          alt="Get registered as a partner"
                        />
                      </div>
                      <div className="tw-sample-content">
                        <h3>Maldives</h3>
                        <a href={itinerarySamplePDF1} target="_blank" className="btn btn-primary btn-sm">View PDF</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 mt-5 pl-4 pr-4">
                    <div className="tw-sample-box">
                      <div className="w-100">
                        <img className="w-100"
                          src={Sample2}
                          alt="Get registered as a partner"
                        />
                      </div>
                      <div className="tw-sample-content">
                        <h3>Ladakh</h3>
                        <a href={itinerarySamplePDF2} target="_blank" className="btn btn-primary btn-sm">View PDF</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 mt-5 pl-4 pr-4">
                    <div className="tw-sample-box">
                      <div className="w-100">
                        <img className="w-100" src={Sample3} alt="Create offers in the system by adding details and photos" />
                      </div><div className="tw-sample-content">
                        <h3>Sri Lanka</h3>
                        <a href={itinerarySamplePDF3} target="_blank" className="btn btn-primary btn-sm">View PDF</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 mt-5 pl-4 pr-4">
                    <div className="tw-sample-box">

                      <div className="w-100"><img className="w-100" src={Sample4} alt="Preview and publish your offers" />
                      </div><div className="tw-sample-content">
                        <h3>Himachal</h3>
                        <a href={itinerarySamplePDF4} target="_blank" className="btn btn-primary btn-sm">View PDF</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="tw-addon-services">
            <div className="container">
              <h2>Add-on Services</h2>
              <h3>
                We provide a range of services to help you get the most out of
                your TourWiz experience & grow your business - Available at an
                additional cost
              </h3>
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

          <div className="tw-features-comingsoon">
            <div className="container">
              <h2>Coming Soon</h2>
              <h3>
                We’re always adding new features to the product. Here are some
                upcoming features we are working on
              </h3>

              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-1")}
                      className={activePoint === "tab-1" ? "act" : ""}
                    >
                      {activePoint === "tab-1" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      B2B Agents Module
                    </h4>
                    {activePoint === "tab-1" && (
                      <ul>
                        <li>Manage Agent Profile</li>
                        <li>Agent Mark-up, Margins or Commission Rules Setup</li>
                        <li>Automated Agent Price Calculation Based on Rules</li>
                        <li>Manage Multiple Agent Users</li>
                        <li>
                          Agent Branding for {Trans("_quotationReplaceKeys")} and Booking Documentation
                        </li>
                        <li>Agent Booking Reports</li>
                        <li>Agent Invoicing and Record Payments</li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-2")}
                      className={activePoint === "tab-2" ? "act" : ""}
                    >
                      {activePoint === "tab-2" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Task Management
                    </h4>
                    {activePoint === "tab-2" && (
                      <ul>
                        <li>Create Tasks</li>
                        <li>Task Allocation</li>
                        <li>Task Reports</li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-3")}
                      className={activePoint === "tab-3" ? "act" : ""}
                    >
                      {activePoint === "tab-3" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Automatic Alerts & Reminders
                    </h4>
                    {activePoint === "tab-3" && (
                      <ul>
                        <li>Notifications & Alerts</li>
                        <li>Balance Due Reminders</li>
                        <li>Customer Payment Reminders</li>
                        <li>Date of Birth Reminders</li>
                        <li>Welcome Home Notifications</li>
                        <li>Supplier Confirmation Alerts</li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-4")}
                      className={activePoint === "tab-4" ? "act" : ""}
                    >
                      {activePoint === "tab-4" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Product or Service Contracts Loading
                    </h4>
                    {activePoint === "tab-4" && (
                      <ul>
                        <li>Accommodation Contracts</li>
                        <li>Tours / Activities Contracting</li>
                        <li>Transfer Contracting</li>
                        <li>Car Hire Contracting</li>
                        <li>Add-on Contracting</li>
                        <li>Insurance Contracting</li>
                      </ul>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-5")}
                      className={activePoint === "tab-5" ? "act" : ""}
                    >
                      {activePoint === "tab-5" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Group Booking Management
                    </h4>
                    {activePoint === "tab-5" && (
                      <ul>
                        <li>Group Booking – Per Person Price Calculator</li>
                        <li>Bulk Import of Passengers</li>
                        <li>
                          Online Passenger Data Collection With Booking Specific
                          Registration Forms
                        </li>
                        <li>Define Group Size Range Pricing</li>
                        <li>Payment Manager</li>
                        <li>Pax Allocation and Rooming List</li>
                        <li>Reports</li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-6")}
                      className={activePoint === "tab-6" ? "act" : ""}
                    >
                      {activePoint === "tab-6" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      B2C Online Booking Engine
                    </h4>
                    {activePoint === "tab-6" && (
                      <ul>
                        <li>Bookable website</li>
                        <li>
                          Live availability and pricing from integrated suppliers
                        </li>
                        <li>Dynamic packaging</li>
                        <li>Booking process automation</li>
                        <li>Sales tools (widgets and availability calendars)</li>
                        <li>Custom integrations</li>
                        <li>
                          Receive online payments to your chosen Payment Gateway
                        </li>
                        <li>
                          Supplier API Integrations(Flights, Hotels, Transfers,
                          Car Hire)
                        </li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-7")}
                      className={activePoint === "tab-7" ? "act" : ""}
                    >
                      {activePoint === "tab-7" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Content Library
                    </h4>
                    {activePoint === "tab-7" && (
                      <ul>
                        <li>Use Pre-Saved Itinerary Modules.</li>
                        <li>Map View</li>
                        <li>Ability to upload photos for items</li>
                        <li>Cover Photo for Itinerary</li>
                        <li>Content migration service</li>
                        <li>
                          Full domain masking (itinerary links masked to your
                          domain)
                        </li>
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-8")}
                      className={activePoint === "tab-8" ? "act" : ""}
                    >
                      {activePoint === "tab-8" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Online Payments
                    </h4>
                    {activePoint === "tab-8" && (
                      <ul>
                        <li>Share payment links with customers</li>
                        <li>Clients can make online payments against invoices through the customer portal</li>
                      </ul>
                    )}
                  </div>
                  {/* 
                  <div>
                    <h4
                      onClick={() => this.handlePointChange("tab-10")}
                      className={activePoint === "tab-10" ? "act" : ""}
                    >
                      {activePoint === "tab-10" ? (
                        <img src={BulletMinus} />
                      ) : (
                        <img src={BulletPlus} />
                      )}
                      Online Payments
                    </h4>
                    {activePoint === "tab-10" && (
                      <ul>
                      </ul>
                    )}
                  </div> */}
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

export default Features;
