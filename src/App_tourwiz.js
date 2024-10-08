import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import ArrowUp from "./assets/images/dashboard/up-arrow.png";
import TagManager from "react-gtm-module";
import Loader from "./components/common/loader";
import Environment from "./base/environment";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Contact from "./screens/tourwiz-landing-pages/contact";
import ThankYou from "./screens/tourwiz-landing-pages/thank-you";
import Features from "./screens/tourwiz-landing-pages/features";
import LoginScreenMW from "./screens/onboarding/components/login-screen-mw";
import LoginScreenMWGPS from "./screens/onboarding/components/login-screen-mw-gps";
import SignupThankYouGPS from "./screens/onboarding/components/signup-thank-you-gps";
import SignupThankYou from "./screens/onboarding/components/signup-thank-you";
import SignupThankYouAdmin from "./screens/onboarding/components/signup-thank-you-admin";
import SignupThankYouHajj from "./screens/onboarding/components/signup-thank-you-hajj";
import SignupThankYouMP from "./screens/onboarding/components/signup-thank-you-marketplace";
import LoginScreenPartnerMW from "./screens/onboarding/components/login-screen-partner-marketplace";
import Terms from "./screens/tourwiz-landing-pages/terms";
import About from "./screens/tourwiz-landing-pages/about";
import TravelAgents from "./screens/tourwiz-landing-pages/solution-travel-agent";
import TourOperator from "./screens/tourwiz-landing-pages/solution-tour-operator";
import ContentPartners from "./screens/tourwiz-landing-pages/solution-marketplace";
import B2BMarketPlace from "./screens/tourwiz-landing-pages/b2b-market-place";
import B2BMarketPlacePartner from "./screens/tourwiz-landing-pages/b2b-market-place-partner";
import Pricing from "./screens/tourwiz-landing-pages/pricing";
import Marketplace from "./screens/tourwiz-landing-pages/market-place";
import CMSDetails from "./screens/cms/cms-details";
import CMSInquiry from "./screens/cms/cms-inquiry";
import CMSBlogs from "./screens/cms/cms-blog-list";
import StaticDeals from "./screens/tourwiz-landing-pages/static-deals";
import DemoBook from "./screens/tourwiz-landing-pages/demo-book";
import ItineraryEmailView from "./screens/itinerary-email-view";
import AgentLogin from "./screens/agent-login-mw";
import PackageView from "./screens/package-view";
import QuickPackageView from "./screens/quick-package-view";
import SessionExpired from "./screens/session-expired.jsx"
import TaxConfiguration from "./components/quotation/tax-configuration";
import PackageSelection from "./components/quotation/package-selection";
import { CMSContext } from "./screens/cms/cms-context";
import { ErrorBoundary } from 'react-error-boundary';
import LoginScreenMWHajj from "./screens/onboarding/components/login-screen-mw-hajj";
import PublicPageHomeHajj from "./screens/public-page-home-hajj";
import LoginScreenAiAssistant from "./screens/onboarding/components/login-screen-mw-ai-assistant";
import SignupAiAssistantThankYou from "./screens/onboarding/components/signup-thank-you-ai-assistant";
import PackageAIAssitantTrial from "./screens/package-ai-assistant-trial";
import OpenAIAssistantTrial from "./screens/itinerary-ai-assistant-trial";
import OpenMarketPlacePackagePreview from "./screens/marketplace-open-package-preview";

import Template1 from "./screens/cms/cms-template-preview/cms-home-template1";
import Template2 from "./screens/cms/cms-template-preview/cms-home-template2";
import Template3 from "./screens/cms/cms-template-preview/cms-home-template3";
import Template4 from "./screens/cms/cms-template-preview/cms-home-template4";
import EnvironmentAsync from "./base/environmentAsync";
import QuotationReport from "./screens/quotation-reports";

const Results = lazy(() => import('./screens/results'));
const Details = lazy(() => import('./screens/details'));
const Home = lazy(() => import('./screens/home'));
const Cart = lazy(() => import('./screens/cart'));
const Bookings = lazy(() => import('./screens/bookings_tourwiz'));
const ViewBooking = lazy(() => import('./screens/view-booking'));
const VoucherInvoice = lazy(() => import('./screens/voucher-invoice'));
const ManualInvoicePrint = lazy(() => import('./screens/manual-item-print-invoice'));
const BookingStatus = lazy(() => import('./screens/booking-status'));
const Signup = lazy(() => import('./screens/signup'));
const Profile = lazy(() => import('./screens/profile'));
const EditProfile = lazy(() => import('./screens/edit-profile'));
const CoTravelers = lazy(() => import('./screens/co-travelers'));
const ManageCoTravelers = lazy(() => import('./screens/manage-co-travelers'));
const AddCoTraveler = lazy(() => import('./screens/add-cotraveler'));
const EditCoTraveler = lazy(() => import('./screens/edit-cotraveler'));
const Payment = lazy(() => import('./screens/payment'));
const Balance = lazy(() => import('./screens/balance'));
const EWalletStatement = lazy(() => import('./screens/EWalletStatement'));
const OfflineBookings = lazy(() => import('./screens/offline-bookings'));
const FailedBookings = lazy(() => import('./screens/failed-bookings'));
const IssueDocuments = lazy(() => import('./screens/issue-documents'));
const ManageCustomers = lazy(() => import('./screens/manage-customers'));
const PageNotFound = lazy(() => import('./screens/notfound'));
const AddCustomer = lazy(() => import('./screens/add-customer'));
const BaggageInfo = lazy(() => import('./screens/baggage-info'));
const Quotation = lazy(() => import('./screens/quotation'));
const MasterQuotation = lazy(() => import('./screens/master-quotation'));
const QuotationList = lazy(() => import('./screens/quotation-list'));
const MasterQuotationList = lazy(() => import('./screens/master-quotation-list'));
const Login = lazy(() => import('./screens/login'));
const DashboardTourwiz = lazy(() => import('./screens/dashboard-agent'));
const Inquiry = lazy(() => import('./screens/inquiry'));
const InquiryList = lazy(() => import('./screens/inquiry-list'));
const BackOffice = lazy(() => import('./screens/backoffice'));
const Reports = lazy(() => import('./screens/reports'));
const ManualBookingCart = lazy(() => import('./screens/manualbookingcart'));
const CustomerReconciliation = lazy(() => import('./screens/reports/customer-reconciliation'));
const CustomerInvoices = lazy(() => import('./screens/reports/customer-invoices'));
const ManualInvoices = lazy(() => import('./screens/reports/manual-invoices-list'));
const CustomerLedger = lazy(() => import('./screens/reports/customer-ledgers'));
const SupplierInvoiceForm = lazy(() => import('./screens/reports/supplier-invoice-form'));
const SupplierInvoices = lazy(() => import('./screens/reports/supplier-invoices'));
const SupplierLedgers = lazy(() => import('./screens/reports/suppliers-ledgers'));
const SupplierManagement = lazy(() => import('./screens/reports/supplier-management'));
const SupplierPayment = lazy(() => import('./screens/reports/supplier-payment'));
const EmployeeList = lazy(() => import('./screens/admin/employee'));
const EmployeeForm = lazy(() => import('./screens/admin/employee-form'));
const ChangePassword = lazy(() => import('./screens/admin/change-password'));
const UpdateProfile = lazy(() => import('./screens/admin/update-profile'));
const CategoryManagement = lazy(() => import('./screens/admin/category-management'));
const BranchManagement = lazy(() => import('./screens/admin/branch-management'));
const AgentWalletManagement = lazy(() => import('./screens/admin/agent-wallet-management'));
const ImportInquiries = lazy(() => import('./screens/import-inquiries'));
const ImportItineraryQuotation = lazy(() => import('./screens/import-itinerary-quotation'));
const ImportBookings = lazy(() => import('./screens/import-bookings'));
const ContentLibrary = lazy(() => import('./screens/content-library'));
const InquiryReport = lazy(() => import('./screens/reports/inquiry-report'));
const AttendanceReport = lazy(() => import('./screens/attendance-report'));
const BookingReport = lazy(() => import('./screens/reports/booking-report'));
const CollectionReport = lazy(() => import('./screens/reports/collection-report'));
const SupplierPaymentReport = lazy(() => import('./screens/reports/supplier-payment-report'));
const SalesReport = lazy(() => import('./screens/reports/sales-report'));
const RevenueReport = lazy(() => import('./screens/reports/revenue-report'));
const LeadsReport = lazy(() => import('./screens/reports/leads-report'));
const SupplierReport = lazy(() => import('./screens/reports/supplier-report'));
const OutstandingReport = lazy(() => import('./screens/reports/outstanding-report'));
const ImportCustomer = lazy(() => import('./screens/import-customer'));
const ImportSupplier = lazy(() => import('./screens/import-Supplier'));
const Deals = lazy(() => import('./screens/deals'));
const MarketplaceDeals = lazy(() => import('./screens/marketplace-deals'));
const MarketplaceDealsPreview = lazy(() => import('./screens/marketplace-deals-preview'));
const MarketplaceDealsCategory = lazy(() => import('./screens/marketplace-deals-category'));
const CommunityDeals = lazy(() => import('./screens/community-deals'));
const BillingAndSubscription = lazy(() => import('./screens/billing-subscription'));
const BillingAndSubscriptionHistory = lazy(() => import('./screens/billing-subscription-history'));
const DebitNote = lazy(() => import('./screens/debit-note'));
const CreditNote = lazy(() => import('./screens/credit-note'));
const Rewards = lazy(() => import('./screens/rewards'));
const ContentLibraryModel = lazy(() => import('./components/quotation/ContentLibrary'));
const CMSHome = lazy(() => import('./screens/cms/cms-home'));
const CMSSelectTemplate = lazy(() => import('./screens/cms-select-template'));
const CMSManageContent = lazy(() => import('./screens/cms-manage-content'));
const CMSWebsite = lazy(() => import('./screens/cms-website'));
const DealsPartnerForm = lazy(() => import('./screens/deals-partner-form'));
const BSPCommission = lazy(() => import('./screens/bsp-commission'));
const ManualInvoice = lazy(() => import('./screens/manualinvoice'));
const Configurations = lazy(() => import('./screens/admin/configurations'));
const ConfigurationAgency = lazy(() => import('./screens/admin/configurations-agency'));
const SecurityObjectsAgency = lazy(() => import('./screens/admin/security-objects-agency'));
const PackageForm = lazy(() => import('./screens/package-form'));
const PackageList = lazy(() => import('./screens/package-list'));
const QuickPackageForm = lazy(() => import('./screens/quick-package-form'));
const QuickPackageList = lazy(() => import('./screens/quick-package-list'));
const PackageMarketPlaceForm = lazy(() => import('./screens/package-form-marketplace'));
const PackageMarketPlaceList = lazy(() => import('./screens/package-list-marketplace'));
//const PackageView = lazy(() => import('./screens/package-view'));
const HotdealsForm = lazy(() => import('./screens/hotdeals-form'));
const HotdealsList = lazy(() => import('./screens/hotdeals-list'));
const LocationForm = lazy(() => import('./screens/location-form'));
const LocationList = lazy(() => import('./screens/location-list'));
const MarkupSetup = lazy(() => import('./screens/admin/markup-setup'));
const PaperRates = lazy(() => import('./screens/add-paper-rates'));
const PaperRatesList = lazy(() => import('./screens/paper-rates-list'));


const ErrorFallback = ({ error, resetErrorBoundary }) => {

  return (
    <div role="alert" className="col-lg-12 text-center mt-5">
      <p>Something went wrong:</p>
      {/* <pre>{error.message}</pre> */}
      {/* <button onClick={() => resetErrorBoundary.props.history.push(`/`)}>Try again</button> */}
    </div>
  );
};
class AppTourwiz extends EnvironmentAsync {

  getLoaderContent = () => {
    return <div className="row p-3">
      <div className="container ">
        <Loader />
      </div>
    </div>
  }


  render() {
    const { userInfo, isB2BLoggedIn } = this.state;
    const portalType = localStorage.getItem("portalType");

    const cmsState = this.state;
    const cmsProps = this.props;
    const cmsCtx = {
      cmsState,
      cmsProps
    };
    // Integrated Google Analytics
    // ReactGA.initialize("UA-5235714-40");
    // ReactGA.pageview(window.location.pathname + window.location.search);

    // Integrated hotjar
    // hotjar.initialize("2373302", "6");
    if (process.env.NODE_ENV === "production") {
      const tagManagerArgs = {
        gtmId: process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID//'GTM-W8HHKSL',
      };
      TagManager.initialize(tagManagerArgs);
    }

    const css = `
    .goToTopButton {
    display: none !important;
    position: fixed;
    width: auto;
    right: 9%;
    bottom: 20px;
    height: auto;
    padding: 10px;
    z-index: 1;
    cursor: pointer;
    border-radius: 50%;
    background: rgb(241, 130, 71);
    box-shadow: 0px 0px 32px rgb(0 0 0 / 50%);}`;
    //window.addEventListener('scroll', this.toggleVisible);
    if (this.state.isLoadingWebSite && window.location.pathname.toLowerCase() !== "/template1" && window.location.pathname.toLowerCase() !== "/template2" && window.location.pathname.toLowerCase() !== "/template3" && window.location.pathname.toLowerCase() !== "/template4")
      return <div className="spinnerLanding show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="spinnerLanding-only">Loading...</span>
        </div>
      </div>
    else
      return (
        <React.Fragment>
          <style>{css}</style>

          <Switch>
            <Route
              key="login"
              path="/login"
              render={(props) => (
                <LoginScreenMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                  handleLoginEvent={this.handleTourwizLogin}
                />
              )}
            />


            <Route
              path="/Template1"
              render={(props) => <Template1 {...props} {...this.state} />}
            />
            <Route
              path="/Template2"
              render={(props) => <Template2 {...props} {...this.state} />}
            />
            <Route
              path="/Template3"
              render={(props) => <Template3 {...props} {...this.state} />}
            />
            <Route
              path="/Template4"
              render={(props) => <Template4 {...props} {...this.state} />}
            />
            <Route
              key="signin"
              path="/:mode?/signin"
              render={(props) => (
                <LoginScreenMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                  handleLoginEvent={this.handleTourwizLogin}
                />
              )}
            />
            <Route
              key="signin-hajj-umrah"
              path="/signin-hajj-umrah"
              render={(props) => (
                <LoginScreenMWHajj
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signup"
              path="/:mode?/signup/:plandetail?"
              render={(props) => (
                <LoginScreenMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signup-admin"
              path="/signup-admin"
              render={(props) => (
                <LoginScreenMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                  isAdminSignup="true"
                />
              )}
            />
            <Route
              key="signin-gps"
              path="/signin-gps"
              render={(props) => (
                <LoginScreenMWGPS
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signup-gps"
              path="/signup-gps"
              render={(props) => (
                <LoginScreenMWGPS
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signin-ai-assistant"
              path="/signin-ai-assistant"
              render={(props) => (
                <LoginScreenAiAssistant
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signup-marketplace"
              path="/signup-marketplace"
              render={(props) => (
                <LoginScreenAiAssistant
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signup-ai-assistant"
              path="/signup-ai-assistant"
              render={(props) => (
                <LoginScreenAiAssistant
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route path="/:mode?/thankyou" component={SignupThankYou} />
            <Route path="/thankyou-gps" component={SignupThankYouGPS} />
            <Route path="/thankyou-ai-assistant" component={SignupAiAssistantThankYou} />
            <Route path="/thankyou-marketplace" component={SignupThankYouMP} />
            <Route path="/thankyou-admin" component={SignupThankYouAdmin} />
            <Route path="/thankyou-hajj-umrah" component={SignupThankYouHajj} />

            <Route
              key="signup-hajj-umrah"
              path="/signup-hajj-umrah"
              render={(props) => (
                <LoginScreenMWHajj
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                  callAuth={this.appAuth}
                />
              )}
            />
            <Route
              key="signin-partner"
              path="/signin-partner"
              render={(props) => (
                <LoginScreenPartnerMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                />
              )}
            />
            <Route
              key="signup-partner"
              path="/signup-partner"
              render={(props) => (
                <LoginScreenPartnerMW
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                />
              )}
            />
            <Route path="/travel-agents" component={TravelAgents} />
            <Route path="/tour-operator" component={TourOperator} />
            <Route path="/content-partners" component={ContentPartners} />
            <Route path="/b2b-market-place" component={B2BMarketPlace} />
            <Route path="/b2b-market-place-partner" component={B2BMarketPlacePartner} />
            <Route path="/about-us" component={About} />
            <Route path="/contact-us" component={Contact} />
            <Route path="/thank-you" component={ThankYou} />
            <Route path="/features/:featurename?" component={Features} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/pricing/faq" component={Pricing} />
            <Route path="/terms-of-use" component={Terms} />
            <Route path="/partner-offers" component={StaticDeals} />
            <Route path="/market-place" component={Marketplace} />
            <Route path="/book-demo" component={DemoBook} />
            <Route path="/tourwizAI"
              render={(props) => <OpenAIAssistantTrial hideHeader={false}
                promptMode="Pacakage Itinerary" />}
            />
            <Route path="/marketplace/package/preview"
              render={(props) => <OpenMarketPlacePackagePreview packageID="48305" />}
            />
            <Route path="/marketplace/package/umrah-preview"
              render={(props) => <OpenMarketPlacePackagePreview packageID="51400" />}
            />
            <Route path="/marketplace/package/mauritius-preview"
              render={(props) => <OpenMarketPlacePackagePreview packageID="49513" />}
            />
            <Route path="/marketplace/package/kashmir-preview"
              render={(props) => <OpenMarketPlacePackagePreview packageID="51407" />}
            />
            {(portalType === "B2B" || portalType === "BOTH") &&
              <Route path="/EmailView/:cartId"
                render={(props) => <ItineraryEmailView userInfo={userInfo} {...props} />}
              />
            }
            {(portalType === "B2B" || portalType === "BOTH") &&
              <Route path="/PackageView/:id"
                render={(props) => (<PackageView {...props} {...this.state} userInfo={userInfo} />)}
              />
            }
            {(portalType === "B2B" || portalType === "BOTH") &&
              <Route path="/MasterPackageView/:id"
                render={(props) => (<PackageView {...props} {...this.state} userInfo={userInfo} />)}
              />
            }
            {(portalType === "B2B" || portalType === "BOTH") &&
              <Route path="/QuickPackageView/:id"
                render={(props) => (<QuickPackageView {...props} {...this.state} userInfo={userInfo} />)}
              />
            }
            <Route
              path="/expired"
              render={(props) => (
                <SessionExpired
                  {...props}
                  {...this.state}
                  userInfo={userInfo}
                  handleLogoutExpire={this.handleLogoutExpire}
                  handleLogOut={this.handleLogOut}
                />
              )}
            />

            <Route
              path="/home-hajj"
              render={(props) => (
                <PublicPageHomeHajj
                  {...props}
                  {...this.state}
                  handleLoginBox={this.handleLoginBox}
                  getLoginDetails={this.getLoginDetails}
                />
              )}
            />
            {(window.location.pathname.toLowerCase() !== "/marketplace" && window.location.pathname.toLowerCase() !== "/preview" && (portalType === "B2B" || portalType === "BOTH") &&
              !userInfo &&
              isB2BLoggedIn === false) && (
                <Route
                  path="*"
                  render={(props) =>
                    window.location.hash !== "/about-us" &&
                    window.location.hash !== "/contact-us" &&
                    window.location.hash !== "/thank-you" &&
                    window.location.hash !== "/features" &&
                    window.location.hash !== "/pricing" &&
                    window.location.hash !== "/pricing/faq" &&
                    window.location.hash !== "/terms-of-use" &&
                    window.location.hash !== "/login" &&
                    window.location.hash !== "/partner-offers" &&
                    window.location.hash !== "/book-demo" &&
                    window.location.hash !== "/signin" &&
                    window.location.hash !== "/signup-admin" &&
                    window.location.hash !== "/signup" &&
                    window.location.hash !== "/signup-ai-assistant" &&
                    window.location.hash !== "/signup-marketplace" &&
                    window.location.hash !== "/signup-gps" &&
                    window.location.hash !== "/signup-hajj-umrah" &&
                    window.location.hash !== "/signup-partner" &&
                    (
                      <AgentLogin
                        {...props}
                        {...this.state}
                        handleLoginBox={this.handleLoginBox}
                        getLoginDetails={this.getLoginDetails}
                      />
                    )
                  }
                />
              )}
          </Switch>
          {(window.location.pathname.toLowerCase() === "/marketplace" || window.location.pathname.toLowerCase() === "/preview" || (((portalType === "B2B" || portalType === "BOTH") && userInfo) ||
            portalType === "B2C")) && (
              <React.Fragment>
                <Header
                  {...this.state}
                  handleLoginBox={this.handleLoginBox}
                  handleUserMenu={this.handleUserMenu}
                  handleLogOut={this.handleLogOut}
                  handleLangChange={this.handleLangChange}
                />

                <div className="page-height">
                  <Switch>
                    <Suspense fallback={this.getLoaderContent()}>
                      {(portalType === "B2B" || portalType === "BOTH") &&
                        userInfo &&
                        userInfo.isPortalAdmin ? (
                        <Route
                          exact
                          path="/"
                          render={(props) => <DashboardTourwiz {...props} {...this.state} />}
                        />
                      ) : portalType === "B2B" || portalType === "BOTH" ? (
                        <Route
                          exact
                          path="/"
                          render={(props) => <DashboardTourwiz {...props} {...this.state} />}
                        />
                      ) : (
                        <Route
                          exact
                          path="/"
                          render={(props) => <Home {...props} {...this.state} />}
                        />
                      )}
                      <Route path="/Login" component={Login} />
                      <Route
                        path="/Results/:businessName/:locationName/:locationID/:countryID/:checkInDate/:checkOutDate/:roomDetails/:filters"
                        component={Results}
                      />
                      <Route
                        path="/Details/:businessName/:locationName/:locationID/:countryID/:checkInDate/:checkOutDate/:roomDetails/:filters/:id/:provider/:overridesupplier/:friendlyurl"
                        component={Details}
                      />
                      {/* <Route
                      path="/Details/:businessName/:token/:id"
                      component={Details}
                    /> */}
                      <Route
                        path="/Cart"
                        render={(props) => (
                          <Cart
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                          />
                        )}
                      />
                      <Route
                        path="/Quotation/:mode"
                        render={(props) => (
                          <Quotation
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/Quotation_Master/:mode"
                        render={(props) => (
                          <MasterQuotation
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/ManualInvoice/:mode/:id?"
                        render={(props) => (
                          <ManualInvoice
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/ManualVoucher/:mode/:id?"
                        render={(props) => (
                          <ManualInvoice
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/ManualInvoices"
                        render={(props) => (
                          <ManualInvoices {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/Itinerary/:mode"
                        render={(props) => (
                          <Quotation
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                          />
                        )}
                      />
                      <Route
                        path="/Itinerary_Master/:mode"
                        render={(props) => (
                          <MasterQuotation
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/Dashboard-Agent"
                        render={(props) => (
                          <DashboardTourwiz {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/details/:module/:id"
                        render={(props) => (
                          <CMSContext.Provider
                            value={cmsCtx} >
                            <CMSDetails {...props} {...this.state} />
                          </CMSContext.Provider>
                        )}
                      />
                      <Route
                        path="/customerinquiry/:id"
                        render={(props) => (

                          <CMSContext.Provider
                            value={cmsCtx} >
                            <CMSInquiry {...props} {...this.state} />
                          </CMSContext.Provider>
                        )}
                      />
                      <Route path="/QuotationList/:filtermode?" render={(props) => (
                        <QuotationList
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                        />
                      )}
                      />
                      <Route path="/QuotationList_Master/:filtermode?" render={(props) => (
                        <MasterQuotationList
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                        />
                      )}
                      />
                      <Route path="/ItineraryList/:filtermode?" render={(props) => (
                        <QuotationList
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                        />
                      )}
                      />
                      <Route path="/ItineraryList_Master/:filtermode?" render={(props) => (
                        <MasterQuotationList
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                        />
                      )}
                      />
                      <Route
                        path="/Dashboard-Tourwiz"
                        render={(props) => (
                          <DashboardTourwiz
                            {...props}
                            {...this.state}
                            userInfo={userInfo}
                          />
                        )}
                      />
                      <Route
                        path="/Inquiry"
                        render={(props) => <Inquiry {...props} {...this.state} />}
                      />
                      <Route path="/InquiryList/:filtermode?" render={(props) => (
                        <InquiryList
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                        />
                      )}
                      />
                      <Route
                        path="/masterpackage/:mode/:id?"
                        render={(props) => (
                          <PackageForm {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/masterpackagelist/:filter?"
                        render={(props) => (
                          <PackageList {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/activepackagelist/:filter?"
                        render={(props) => (
                          <PackageMarketPlaceList {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/Package/:mode/:id?/:inquiryid?"
                        render={(props) => (
                          <PackageForm {...this.state} {...props} />
                        )}
                      />
                      {/* <Route
                      path="/QuickPackage/:mode/:id?"
                      render={(props) => (
                        <PackageForm {...this.state} {...props} />
                      )}
                    />
                    <Route
                      path="/QuickPackageList/:filter?"
                      render={(props) => (
                        <PackageList {...this.state} {...props} />
                      )}
                    /> */}
                      <Route
                        path="/PackageList/:filter?"
                        render={(props) => (
                          <PackageList {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/QuickPackage/:mode/:id?"
                        render={(props) => (
                          <QuickPackageForm {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/QuickPackageList/:filter?"
                        render={(props) => (
                          <QuickPackageList {...this.state} {...props} />
                        )}
                      />

                      <Route
                        path="/Hotdeals/:mode/:id?"
                        render={(props) => (
                          <HotdealsForm {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/HotdealsList"
                        render={(props) => (
                          <HotdealsList {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/packagemarketplace/:mode/:id?"
                        render={(props) => (
                          <PackageForm {...this.state} {...props} />
                          // <PackageMarketPlaceForm {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/packagemarketplacelist"
                        render={(props) => (
                          <PackageMarketPlaceList {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/Location/:mode/:id?"
                        render={(props) => (
                          <LocationForm {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/PackagePage"
                        render={(props) => (
                          <PackageSelection {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/LocationList"
                        render={(props) => (
                          <LocationList {...this.state} {...props} />

                        )}
                      />


                      <Route path="/Backoffice/:page"
                        render={(props) => <BackOffice {...props} {...this.state} userInfo={userInfo} />}
                      />

                      <Route path="/Reports"
                        render={(props) => <Reports userInfo={userInfo} {...props} />}
                      />
                      <Route
                        path="/CustomerReconciliation"
                        render={(props) => (
                          <CustomerReconciliation {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/UpdateProfile"
                        render={(props) => (
                          <UpdateProfile {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/Configuration"
                        render={(props) => (
                          <Configurations {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SecurityObjects"
                        render={(props) => (
                          <SecurityObjectsAgency {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/AgencyConfiguration"
                        render={(props) => (
                          <ConfigurationAgency {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/CategoryManagement"
                        render={(props) => (
                          <CategoryManagement {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/BranchManagement"
                        render={(props) => (
                          <BranchManagement {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/AgentWalletManagement"
                        render={(props) => (
                          <AgentWalletManagement {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/CustomerInvoices"
                        render={(props) => (
                          <CustomerInvoices {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/CustomerLedger"
                        render={(props) => (
                          <CustomerLedger {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SupplierInvoice/:mode/:id?"
                        render={(props) => (
                          <SupplierInvoiceForm {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/DebitNote"
                        render={(props) => <DebitNote {...this.state} {...props} />}
                      />
                      <Route
                        path="/CreditNote"
                        render={(props) => <CreditNote {...this.state} {...props} />}
                      />
                      <Route
                        path="/BSPCommission"
                        render={(props) => (
                          <BSPCommission {...this.state} {...props} />
                        )}
                      />
                      <Route
                        path="/Rewards"
                        render={(props) => <Rewards {...this.state} {...props} userInfo={userInfo} />}
                      />
                      <Route
                        path="/DocumentLibrary"
                        render={(props) => <ContentLibraryModel />}
                      />
                      <Route
                        path="/SupplierInvoices"
                        render={(props) => (
                          <SupplierInvoices {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SupplierLedgers"
                        render={(props) => (
                          <SupplierLedgers {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SupplierManagement"
                        render={(props) => (
                          <SupplierManagement {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SupplierPayment"
                        render={(props) => (
                          <SupplierPayment {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/EmployeeList"
                        render={(props) => (
                          <EmployeeList {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/Employee/:mode/:id?"
                        render={(props) => (
                          <EmployeeForm {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route path="/ChangePassword"
                        render={(props) => (
                          <ChangePassword {...this.state} {...props} userInfo={userInfo} handleLogOut={this.handleLogOutAfterChangePassword} />
                        )}
                      />
                      <Route
                        path="/QuickBookCart"
                        render={(props) => (
                          <ManualBookingCart
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                          />
                        )}
                      />
                      <Route
                        path="/Signup"
                        render={(props) => (
                          <Signup
                            {...props}
                            {...this.state}
                            handleLoginBox={this.handleLoginBox}
                          />
                        )}
                      />
                      <Route path="/BaggageInfo" component={BaggageInfo} />
                      <Route
                        path="/ImportInquiries"
                        render={(props) => (
                          <ImportInquiries {...props} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/ImportQuotation"
                        render={(props) => (
                          <ImportItineraryQuotation {...props} mode="Quotation" userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/ImportItinerary"
                        render={(props) => (
                          <ImportItineraryQuotation {...props} mode="Itinerary" userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/ImportBookings"
                        render={(props) => <ImportBookings {...props} userInfo={userInfo} />}
                      />
                      <Route path="/ContentLibrary"
                        render={(props) => (
                          <ContentLibrary {...props} userInfo={userInfo} />
                        )}
                      />

                      <Route path="/InquiryReport"
                        render={(props) => <InquiryReport userInfo={userInfo} {...props} />}
                      />
                      <Route path="/QuotationReport"
                        render={(props) => <QuotationReport userInfo={userInfo} {...props} />}
                      />
                      <Route path="/AttendanceReport"
                        render={(props) => <AttendanceReport userInfo={userInfo} {...props} />}
                      />
                      <Route
                        path="/BookingReport"
                        render={(props) => (
                          <BookingReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/CollectionReport"
                        render={(props) => (
                          <CollectionReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SalesReport"
                        render={(props) => <SalesReport {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/RevenueReport"
                        render={(props) => (
                          <RevenueReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/OutstandingReport"
                        render={(props) => (
                          <OutstandingReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/LeadsReport"
                        render={(props) => <LeadsReport {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/SupplierReport"
                        render={(props) => (
                          <SupplierReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route
                        path="/SupplierPaymentReport"
                        render={(props) => (
                          <SupplierPaymentReport {...props} {...this.state} userInfo={userInfo} />
                        )}
                      />
                      <Route path="/ImportCustomer"
                        render={(props) => <ImportCustomer {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route path="/ImportSupplier"
                        render={(props) => <ImportSupplier {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/Deals"
                        render={(props) => <Deals {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/Preview"
                        render={(props) => <MarketplaceDealsPreview {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/MarketplacePackagesold"
                        render={(props) => <MarketplaceDealsCategory {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/MarketplacePackages/:mode?"
                        render={(props) => <MarketplaceDeals {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/Community"
                        render={(props) => <CommunityDeals {...props} {...this.state} userInfo={userInfo} />}
                      />


                      <Route path="/blogs" component={CMSBlogs} />
                      <Route
                        path="/Deals-New"
                        render={(props) => <Deals {...props} {...this.state} userInfo={userInfo} />}
                      />
                      <Route
                        path="/Offers/:mode/:id?"
                        render={(props) => (
                          <DealsPartnerForm {...this.state} {...props} userInfo={userInfo} />
                        )}
                      />
                      {userInfo ? (
                        <React.Fragment>
                          <Route path="/Payment"
                            render={(props) => <Payment userInfo={userInfo} {...props} />}
                          />
                          <Route path="/Bookings"
                            render={(props) => <Bookings userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/ViewBooking/:mode/:irn/:brn/"
                            render={(props) => (
                              <ViewBooking {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/Voucher/:mode/:businessName/:itineraryid/:bookingid"
                            render={(props) => (
                              <VoucherInvoice {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/viewmanualinvoice/:mode/:invoiceid/:itemid?"
                            render={(props) => (
                              <ManualInvoicePrint {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/BookingStatus/:token"
                            render={(props) => <BookingStatus userInfo={userInfo} {...props} />}
                          />
                          <Route path="/Profile"
                            render={(props) => <Profile userInfo={userInfo} {...props} />}
                          />
                          <Route path="/EditProfile"
                            render={(props) => <EditProfile userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/CoTraveller/:mode/:id?"
                            render={(props) => <CoTravelers userInfo={userInfo} {...props} />}
                          />
                          <Route path="/AddCoTraveler"
                            render={(props) => <AddCoTraveler userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/EditCoTraveler/:id"
                            render={(props) => <EditCoTraveler userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/Balance"
                            render={(props) => <Balance userInfo={userInfo} />}
                          />
                          <Route
                            path="/OfflineBookings"
                            render={(props) => <OfflineBookings userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/FailedBookings"
                            render={(props) => <FailedBookings userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/EWalletStatement"
                            component={EWalletStatement}
                          />
                          <Route path="/IssueDocuments"
                            render={(props) => <IssueDocuments userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/Customer/:mode/:id?"
                            render={(props) => <ManageCoTravelers userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/ManageCustomers"
                            render={(props) => <ManageCustomers userInfo={userInfo} {...props} />}
                          />
                          <Route path="/AddCustomer"
                            render={(props) => <AddCustomer userInfo={userInfo} {...props} />}
                          />
                          <Route
                            path="/Search"
                            render={(props) => <Home {...props} {...this.state} />}
                          />
                          <Route
                            path="/BillingAndSubscription/:transactiontoken?/:plan?"
                            render={(props) => (
                              <BillingAndSubscription userInfo={userInfo} {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/BillingAndSubscriptionHistory"
                            render={(props) => (
                              <BillingAndSubscriptionHistory
                                {...props}
                                {...this.state}
                              />
                            )}
                          />
                          <Route
                            path="/CMSHome"
                            render={(props) =>
                              <CMSContext.Provider
                                value={cmsCtx} ><CMSHome {...props} {...this.state} /></CMSContext.Provider>}
                          />
                          <Route
                            path="/CustomerWebsite"
                            render={(props) => (
                              <CMSWebsite {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/ChangeDomain"
                            render={(props) => (
                              <CMSWebsite {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/SelectTemplate"
                            render={(props) => (
                              <CMSSelectTemplate {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/ManageContent"
                            render={(props) => (
                              <CMSManageContent {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/ManageContent/:type/:mode/:id?"
                            render={(props) => (
                              <PackageForm {...this.state} {...props} />
                            )}
                          />
                          <Route
                            path="/MarkupSetup"
                            render={(props) => (
                              <MarkupSetup  {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/TaxConfiguration"
                            render={(props) => (
                              <TaxConfiguration  {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/paperrates"
                            render={(props) => (
                              <PaperRates  {...props} {...this.state} />
                            )}
                          />
                          <Route
                            path="/paperrateslist"
                            render={(props) => (
                              <PaperRatesList  {...props} {...this.state} />
                            )}
                          />

                        </React.Fragment>
                      ) : (
                        ((this.state.isLoggedIn ||
                          this.state.isLoginMenu ||
                          this.state.isLoginBox ||
                          this.state.isUserMenu ||
                          this.state.isB2BLoggedIn ||
                          this.state.userInfo) && window.location.pathname.toLowerCase() !== "/marketplace" && window.location.pathname.toLowerCase() !== "/preview") && (
                          <Route exact path="*" component={PageNotFound} />
                        )
                      )}
                    </Suspense>
                  </Switch>
                </div>
                <Footer />
              </React.Fragment>
            )
          }
          <div className="goToTopButton" onClick={this.scrollToTop} style={{ display: (document.documentElement.scrollTop > 300 ? "block" : "none") }}>
            <img src={ArrowUp} style={{ width: "36px" }} alt='topside'></img></div>

        </React.Fragment>
      );
  }
}

export default AppTourwiz;
