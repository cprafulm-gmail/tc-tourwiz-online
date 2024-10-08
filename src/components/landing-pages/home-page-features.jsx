import React, { Component } from "react";
import FeaturesItineraryBuilder from "../../assets/images/tw/features-itinerary-builder.png";
import FeaturesAccountingReconciliation from "../../assets/images/tw/features-accounting-reconciliation.svg";
import FeaturesAgencyManagement from "../../assets/images/tw/features-agency-management.png";
import FeaturesReportsAnalytics from "../../assets/images/tw/features-reports-analytics.svg";
import FeaturesCustomerPortal from "../../assets/images/tw/features-customer-portal.png";
import FeaturesTravelCrm from "../../assets/images/tw/features-travel-crm.png";
import FeaturesPackagemodule from "../../assets/images/tw/packages.png";
import FeaturesInvoicingModule from "../../assets/images/tw/invoice.png";
import FeaturesB2BMarketPlace from "../../assets/images/tw/marketplace-purple.png";
import FeaturesAIAssistant from "../../assets/images/tw/AI-purple.png";

class HomePageFeatures extends Component {
  state = {
    activeTab: "b2b-marketplace",
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <div className="tw-features">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 tw-features-icons">
              <div className="row">
                <div className="col-lg-6 align-items-center d-flex">
                  <div className="w-100">
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "b2b-marketplace" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("b2b-marketplace")}
                    >
                      <img
                        src={FeaturesB2BMarketPlace}
                        alt="TourWiz - B2B Marketplace"
                      />
                      <h5>B2B Marketplace</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "package-module" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("package-module")}
                    >
                      <img
                        src={FeaturesPackagemodule}
                        alt="TourWiz - Package Module icon"
                      />
                      <h5>Package Module</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "customer-portal" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("customer-portal")}
                    >
                      <img
                        src={FeaturesCustomerPortal}
                        alt="TourWiz - Travel Reporting icon"
                      />
                      <h5>Travel Website</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "itinerary-builder" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("itinerary-builder")}
                    >
                      <img
                        src={FeaturesItineraryBuilder}
                        alt="TourWiz - Itinerary Builder icon"
                      />
                      <h5>Itinerary Builder</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box mt-5" +
                        (activeTab === "reports-analytics" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("reports-analytics")}
                    >
                      <img
                        src={FeaturesReportsAnalytics}
                        alt="TourWiz - Travel Reporting icon"
                      />
                      <h5>Reports & Analytics</h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 align-items-center d-flex">
                  <div className="w-100">
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "tourWizAI-lite" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("tourWizAI-lite")}
                    >
                      <img
                        src={FeaturesAIAssistant}
                        alt="TourWiz - TourWizAI Lite Beta"
                      />
                      <h5>TourWizAI Lite<sup style={{ fontSize: "15px" }}>BETA</sup></h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "invoicing-module" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("invoicing-module")}
                    >
                      <img
                        src={FeaturesInvoicingModule}
                        alt="TourWiz - Invoicing Module icon"
                      />
                      <h5>Invoicing Module</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "accounting-reconciliation"
                          ? " active"
                          : "")
                      }
                      onClick={() =>
                        this.handleTabChange("accounting-reconciliation")
                      }
                    >
                      <img
                        src={FeaturesAccountingReconciliation}
                        alt="TourWiz - Travel Accounting icon"
                      />
                      <h5>Accounting & Reconciliation</h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "travel-crm" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("travel-crm")}
                    >
                      <img
                        src={FeaturesTravelCrm}
                        alt="TourWiz - Travel CRM icon"
                      />
                      <h5>
                        Travel <br />
                        CRM
                      </h5>
                    </div>
                    <div
                      className={
                        "tw-features-box" +
                        (activeTab === "agency-management" ? " active" : "")
                      }
                      onClick={() => this.handleTabChange("agency-management")}
                    >
                      <img
                        src={FeaturesAgencyManagement}
                        alt="TourWiz - Agency Management icon"
                      />
                      <h5>Agency Management</h5>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 tw-features-content">
              <div className="tw-features-details">
                <div className="tw-features-title">
                  <h5 className="tw-sub-title-letter">F</h5>
                  <h2 className="tw-sub-title">Features</h2>
                  <h4 className="tw-sub-title-text text-center">We Offer</h4>
                </div>

                <div className="d-none tw-features-icons-mobile">
                  <div className="row">
                    <div className="col-lg-12">
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "b2b-marketplace" ? " active" : "")
                        }
                        onClick={() => this.handleTabChange("b2b-marketplace")}
                      >
                        <img
                          src={FeaturesB2BMarketPlace}
                          alt="TourWiz - B2B Marketplace"
                        />
                        <h5>B2B Marketplace</h5>
                      </div>
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "tourWizAI-lite" ? " active" : "")
                        }
                        onClick={() => this.handleTabChange("tourWizAI-lite")}
                      >
                        <img
                          src={FeaturesAIAssistant}
                          alt="TourWiz - TourWizAI Lite Beta"
                        />
                        <h5>TourWizAI Lite<sup>BETA</sup></h5>
                      </div>
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "package-module" ? " active" : "")
                        }
                        onClick={() => this.handleTabChange("package-module")}
                      >
                        <img
                          src={FeaturesPackagemodule}
                          alt="TourWiz - Package Module icon"
                        />
                        <h5>Package Module</h5>
                      </div>
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "invoicing-module" ? " active" : "")
                        }
                        onClick={() => this.handleTabChange("invoicing-module")}
                      >
                        <img
                          src={FeaturesInvoicingModule}
                          alt="TourWiz - Invoicing Module icon"
                        />
                        <h5>Invoicing Module</h5>
                      </div>
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "customer-portal" ? " active" : "")
                        }
                        onClick={() =>
                          this.handleTabChange("customer-portal")
                        }
                      >
                        <img
                          src={FeaturesCustomerPortal}
                          alt="Reports & Analytics"
                        />
                        <h5>Travel Website</h5>
                      </div>
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "accounting-reconciliation"
                            ? " active"
                            : "")
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
                      <div
                        className={
                          "tw-features-box" +
                          (activeTab === "itinerary-builder" ? " active" : "")
                        }
                        onClick={() =>
                          this.handleTabChange("itinerary-builder")
                        }
                      >
                        <img
                          src={FeaturesItineraryBuilder}
                          alt="Itinerary Builder"
                        />
                        <h5>Itinerary Builder</h5>
                      </div>
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
                          (activeTab === "reports-analytics" ? " active" : "")
                        }
                        onClick={() =>
                          this.handleTabChange("reports-analytics")
                        }
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
                        onClick={() =>
                          this.handleTabChange("agency-management")
                        }
                      >
                        <img
                          src={FeaturesAgencyManagement}
                          alt="Agency Management"
                        />
                        <h5>Agency Management</h5>
                      </div>
                    </div>
                  </div>
                </div>

                {activeTab === "default" && (
                  <React.Fragment>
                    <h3>Supercharge Your Business</h3>
                    <p>
                      TourWiz is a comprehensive solution for travel
                      professionals that handles your entire workflow from
                      inquiry to booking to accounting. It’s your office
                      on-the-go!
                    </p>
                    <ul className="list-unstyled">
                      <li>Available 24x7 on both web and mobile</li>
                      <li>Designed with your actual workflows in mind</li>
                      <li>As user-friendly as the apps you use every day</li>
                      <li>
                        Reduces manual effort so you can focus more on selling
                      </li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "itinerary-builder" && (
                  <React.Fragment>
                    <h3>Itinerary Builder</h3>
                    <p>
                      TourWiz makes the process of creating itineraries and
                      proposals a breeze! Build multi-day itineraries with rich
                      content in just a few clicks and share them with your
                      clients as a PDF/Link via Email, Whatsapp etc.
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        Look up Global Flight/Hotel/Activities/Transfers with
                        details
                      </li>
                      <li>Set up Pricing at Service Level or Package Level</li>
                      <li>Copy & Reuse itineraries for other customers</li>
                      <li>
                        All your Itineraries and Quotations are saved in one
                        place
                      </li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "travel-crm" && (
                  <React.Fragment>
                    <h3>Travel CRM</h3>
                    <p>
                      TourWiz provides key details of all your leads and
                      customers at your fingertips and to help you create fully
                      personalized quotations and itineraries for them in
                      minutes. With TourWiz you can streamline your marketing
                      activities and maximize bookings.
                    </p>
                    <ul className="list-unstyled">
                      <li>Have customer & supplier details at your fingertips</li>
                      <li>Capture inquiries from multiple sources</li>
                      <li>
                        Allocate inquiries and track progress & communication
                      </li>
                      <li>Get follow-up alerts for inquiries and proposals</li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "accounting-reconciliation" && (
                  <React.Fragment>
                    <h3>Accounting & Reconciliation</h3>
                    <p>
                      TourWiz simplifies your accounting and minimizes costly
                      manual errors by automatically reconciling receipts &
                      payments with suppliers and customers. It can handle
                      accounting for both offline bookings & bookings made in
                      third-party systems, giving you total flexibility.
                    </p>
                    <ul className="list-unstyled">
                      <li>Invoice generation based on proposals</li>
                      <li>Manage all your customer payables & receivables</li>
                      <li>Customer & Supplier Ledgers and Statements</li>
                      <li>
                        Debit & credit memos for offline cancellations, last
                        minute issues etc.
                      </li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "reports-analytics" && (
                  <React.Fragment>
                    <h3>Reports & Analytics</h3>
                    <p>
                      TourWiz automatically generates a wide range of reports to
                      help you monitor your agency’s performance to make
                      informed business decisions. No more hassle of manually
                      entering data and configuring complex formulae in Excel to
                      find out how your business is doing.
                    </p>
                    <ul className="list-unstyled">
                      <li>Consolidated view of inquiries from all sources</li>
                      <li>Bookings, sales and revenue reports</li>
                      <li>Customer-wise collection and outstanding reports</li>
                      <li>Supplier payment report</li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "agency-management" && (
                  <React.Fragment>
                    <h3>Agency Management</h3>
                    <p>
                      With TourWiz you can manage various aspects of your agency
                      including your branch details, employees and suppliers
                      from one place to run your business more efficiently.
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        Profile setup for branding & customer documentation
                      </li>
                      <li>Set up currency, GST No, CIN No for invoicing</li>
                      <li>
                        Centrally set up & manage employees across multiple
                        branches
                      </li>
                      <li>Manage agent credit & track their transactions</li>
                    </ul>
                  </React.Fragment>
                )}
                {activeTab === "b2b-marketplace" && (
                  <React.Fragment>
                    <h3>B2B Marketplace</h3>
                    <p>
                      TourWiz, a leading B2B travel marketplace
                      that offers a wide range of travel products
                      and services to travel agents, tour operators,
                      and travel companies or “buyers”.
                    </p>
                    <ul className="list-unstyled">
                      <li>And best of all Tourwiz b2B Marketplace access is completely free</li>
                      <li>Share Marketplace deals with your customers through your CRM</li>
                      <li>No more losing customers to OTA’s</li>
                      <li>Maximize your revenues</li>
                    </ul>
                  </React.Fragment>
                )}
                {activeTab === "tourWizAI-lite" && (
                  <React.Fragment>
                    <h3>TourWizAI Lite<sup style={{ fontSize: "18px" }}>BETA</sup></h3>
                    <p>
                      The lightning fast itinerary builder.
                      Don't miss out on the chance to experience
                      the incredible potential of AI for travel planning.
                    </p>
                    <ul className="list-unstyled">
                      <li>
                        TourWizAI Lite<sup>BETA</sup> uses artificial intelligence to generate personalized itineraries based on your queries or prompts.
                      </li>
                      {/* <li>Set up currency, GST No, CIN No for invoicing</li>
                      <li>
                        Centrally set up & manage employees across multiple
                        branches
                      </li>
                      <li>Manage agent credit & track their transactions</li> */}
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "package-module" && (
                  <React.Fragment>
                    <h3>Package Module</h3>
                    <p><b style={{ fontWeight: "600" }}>Impress your clients & simplify your workflow by building stunning packages!</b><br />
                      The package module allows you to build a detailed package of your travel services provided to your client. It gives an overview of the package to the client like travel dates, inclusions, exclusions, T&C, and Price guidelines, and allows you to upload PDFs & images of your choice.
                    </p>
                    <ul className="list-unstyled">
                      <li>All your Packages are stored in one place</li>
                      <li>Build detailed packages in one place that can be retrieved in just a click.</li>
                      <li>Easily send packages via a mobile-friendly link to your customers</li>
                      <li>Send stunning detailed packages to your customers</li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "invoicing-module" && (
                  <React.Fragment>
                    <h3>Invoicing Module</h3>
                    <p><b style={{ fontWeight: "600" }}>Never lose on payments with our GST-ready invoices! </b> <br />
                      You can now create and manage invoices through our Invoicing module. This feature helps travel agents to create, print, and share invoices with their customers and also collect payments. With this feature, you can add details of invoices, all services, prices, and guests so that you do not miss out on any important details.
                    </p>
                    <ul className="list-unstyled">
                      <li>Create & Manage invoices in one place</li>
                      <li>The most efficient way to get GST-ready invoices</li>
                      <li>All of your client's invoices at one place</li>
                    </ul>
                  </React.Fragment>
                )}

                {activeTab === "customer-portal" && (
                  <React.Fragment>
                    <h3>Travel Website</h3>
                    <p><b style={{ fontWeight: "600" }}>Get your own mobile-friendly CMS-based website at a fraction of the cost of getting it developed outside!</b> Showcase your packages and deals to customers, allow them to send inquiries, view itineraries, invoices, bookings and even make payments against invoices online!
                    </p>
                    <ul className="list-unstyled">
                      <li>Ready templates to choose from</li>
                      <li>
                        Easily customizable with your logo, branding and content
                      </li>
                      <li>No additional hosting charges</li>
                      <li>Mapping with your own domain</li>
                      {/* <li>
                        Take online payments from customers against invoices
                      </li> */}
                    </ul>
                  </React.Fragment>
                )}

                {(activeTab !== "b2b-marketplace" && activeTab !== "tourWizAI-lite") ? <button
                  className="btn btn-lg mt-3"
                  onClick={() => this.props.handleRedirect("features", activeTab)}
                >
                  Read More
                </button> : <button
                  className="btn btn-lg mt-3"
                  onClick={() => this.props.handleRedirect((activeTab !== "tourWizAI-lite" ? "b2b-market-place" : "tourwizAI"), "")}
                >
                  {activeTab !== "tourWizAI-lite" ? "Read More" : "Try It"}
                </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageFeatures;
// 