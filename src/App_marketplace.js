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
import CMSHomeCustomer from "./screens/cms/cms-home-customer";
import CMSHeader from "./components/cms/cms-header";
import CMSCopywrite from "./components/cms/cms-copywrite";
import CMSCopywrite05 from "./components/cms/AF-005/cms-copywrite";
import LoginCustomer from "./screens/login-customer";
import CMSAbout from "./screens/cms/cms-about";
import CMSBlogs from "./screens/cms/cms-blog-list";
import CMSAbout05 from "./screens/cms/AF-005/cms-about";
import CMSTerms from "./screens/cms/cms-terms";
import CMSDetails from "./screens/cms/cms-details";
import CMSDealsList from "./screens/cms/cms-deals-list";
import CMSDetails05 from "./screens/cms/AF-005/cms-details";
import DashboardCustomer from "./screens/dashboard-customer";
import CMSContact from "./screens/cms/cms-contact";
import CMSContact05 from "./screens/cms/AF-005/cms-contact";
import CMSInquiry from "./screens/cms/cms-inquiry";
import Terms from "./screens/tourwiz-landing-pages/terms";
import About from "./screens/tourwiz-landing-pages/about";
import Pricing from "./screens/tourwiz-landing-pages/pricing";
import StaticDeals from "./screens/tourwiz-landing-pages/static-deals";
import DemoBook from "./screens/tourwiz-landing-pages/demo-book";
import ItineraryEmailView from "./screens/itinerary-email-view";
import AgentLogin from "./screens/agent-login";
import PackageView from "./screens/package-view";
import SessionExpired from "./screens/session-expired.jsx"
import Config from "./config.json";
import { StickyContainer, Sticky } from "react-sticky";
import HotdealsView from "./screens/hotdeals-view";

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
const Dashboard = lazy(() => import('./screens/home'));
const Quotation = lazy(() => import('./screens/quotation'));
const QuotationList = lazy(() => import('./screens/quotation-list'));
const Login = lazy(() => import('./screens/login'));
const DashboardTourwiz = lazy(() => import('./screens/dashboard-agent'));
const Inquiry = lazy(() => import('./screens/inquiry'));
const InquiryList = lazy(() => import('./screens/inquiry-list'));
const BackOffice = lazy(() => import('./screens/backoffice'));
const Reports = lazy(() => import('./screens/reports'));
const DashboardAgent = lazy(() => import('./screens/dashboard-agent'));
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
const BookingReport = lazy(() => import('./screens/reports/booking-report'));
const CollectionReport = lazy(() => import('./screens/reports/collection-report'));
const SupplierPaymentReport = lazy(() => import('./screens/reports/supplier-payment-report'));
const SalesReport = lazy(() => import('./screens/reports/sales-report'));
const RevenueReport = lazy(() => import('./screens/reports/revenue-report'));
const LeadsReport = lazy(() => import('./screens/reports/leads-report'));
const SupplierReport = lazy(() => import('./screens/reports/supplier-report'));
const OutstandingReport = lazy(() => import('./screens/reports/outstanding-report'));
const ImportCustomer = lazy(() => import('./screens/import-customer'));
const Deals = lazy(() => import('./screens/deals'));
const BillingAndSubscription = lazy(() => import('./screens/billing-subscription'));
const BillingAndSubscriptionHistory = lazy(() => import('./screens/billing-subscription-history'));
const DebitNote = lazy(() => import('./screens/debit-note'));
const CreditNote = lazy(() => import('./screens/credit-note'));
const Rewards = lazy(() => import('./screens/rewards'));
const CMSHome = lazy(() => import('./screens/cms/cms-home'));
const CMSSelectTemplate = lazy(() => import('./screens/cms-select-template'));
const CMSManageContent = lazy(() => import('./screens/cms-manage-content'));
const CMSWebsite = lazy(() => import('./screens/cms-website'));
const DealsPartnerForm = lazy(() => import('./screens/deals-partner-form'));
const BSPCommission = lazy(() => import('./screens/bsp-commission'));
const ManualInvoice = lazy(() => import('./screens/manualinvoice'));
const Configurations = lazy(() => import('./screens/admin/configurations'));
const PackageForm = lazy(() => import('./screens/package-form'));
const PackageList = lazy(() => import('./screens/package-list'));
//const PackageView = lazy(() => import('./screens/package-view'));
const HotdealsForm = lazy(() => import('./screens/hotdeals-form'));
const HotdealsList = lazy(() => import('./screens/hotdeals-list'));
//const HotdealsView = lazy(() => import('./screens/hotdeals-view'));
const LocationForm = lazy(() => import('./screens/location-form'));
const LocationList = lazy(() => import('./screens/location-list'));
const MarkupSetup = lazy(() => import('./screens/admin/markup-setup'));
const TaxConfiguration = lazy(() => import('./components/quotation/tax-configuration'));

class AppTripCenter extends Environment {

  getLoaderContent = () => {
    return <div className="row p-3">
      <div className="container ">
        {/* <Loader /> */}
      </div>
    </div>
  }

  render() {

    const { userInfo, isB2BLoggedIn, cmsSettings } = this.state;
    const portalType = localStorage.getItem("portalType");

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


    let component = null;
    if (cmsSettings === undefined || cmsSettings.themeName === "AF-010") {
      var CMSHeader1 = lazy(() => import('./components/cms/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings.themeName === "AF-002") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-002/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings.themeName === "AF-003") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-003/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings.themeName === "AF-001") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-001/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings.themeName === "AF-005") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-005/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    }
    var cssClass = cmsSettings ? cmsSettings.themeName + " cm-pages" : "cm-pages";
    return (
      <React.Fragment>
        <style>{css}</style>
        <Switch>
          {!userInfo && cmsSettings && (
            <div className={Config.codebaseType === undefined || Config.codebaseType === "tourwiz-marketplace" ? cssClass : ""}>

              <StickyContainer>

                <Sticky>
                  {({ style }) => (<div
                    className={
                      "hight-z-index mod-search-area"
                    }
                    style={{ ...style, transform: "inherit" }}
                  >
                    {(portalType === "B2B" || portalType === "BOTH") &&
                      isB2BLoggedIn === false && cmsSettings &&
                      (Config.codebaseType === undefined || Config.codebaseType === "tourwiz-marketplace")
                      && component}

                  </div>
                  )}
                </Sticky>
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
                    />
                  )}
                />
                <Route
                  key="signin"
                  path="/signin"
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
                {/* {Config.codebaseType === "tourwiz-marketplace" && window.location.hostname === "agents.thetripcentre.com" && ( */}
                <Route
                  key="signup"
                  path="/signup"
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
                {/* )} */}
                {/* {(portalType === "B2B" || portalType === "BOTH") &&
                isB2BLoggedIn === false && cmsSettings && (Config.codebaseType === undefined || Config.codebaseType === "tourwiz-marketplace") && componentAbout} */}

                <Route path="/about"
                  render={(props) => Config.codebaseType === "tourwiz-tripcenter" ? (
                    <CMSAbout05 {...props} {...this.state} />
                  ) : (
                    <CMSAbout {...props} {...this.state} />
                  )}
                />
                <Route path="/blogs" component={CMSBlogs} />
                <Route path="/contact"
                  render={(props) => Config.codebaseType === "tourwiz-tripcenter" ? (
                    <CMSContact05 {...props} {...this.state} />
                  ) : (
                    <CMSContact {...props} {...this.state} />
                  )}
                />
                {/* <Route path="/contact" component={CMSContact} /> */}
                <Route path="/about-us" component={About} />
                <Route path="/contact-us" component={Contact} />
                <Route path="/thank-you" component={ThankYou} />
                <Route path="/features/:featurename?" component={Features} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/pricing/faq" component={Pricing} />
                <Route path="/terms-of-use" component={Terms} />
                <Route path="/partner-offers" component={StaticDeals} />
                <Route path="/book-demo" component={DemoBook} />
                <Route path="/EmailView/:cartId"
                  render={(props) => <ItineraryEmailView userInfo={userInfo} {...props} />}
                />
                <Route path="/terms" component={CMSTerms} />
                <Route
                  path="/details/:module/:id"
                  render={(props) => cmsSettings && cmsSettings.themeName && Config.codebaseType === "tourwiz-tripcenter" ? (
                    <CMSDetails05 {...props} {...this.state} />
                  ) : (
                    <CMSDetails {...props} {...this.state} />
                  )}
                />
                <Route
                  path="/list/:module"
                  render={(props) => cmsSettings && cmsSettings.themeName && Config.codebaseType === "tourwiz-tripcenter" ? (
                    <CMSDealsList {...props} {...this.state} />
                  ) : (
                    <CMSDealsList {...props} {...this.state} />
                  )}
                />
                <Route
                  path="/customerinquiry/:id"
                  render={(props) => (
                    <CMSInquiry {...props} {...this.state} />
                  )}
                />
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
                {/* {(portalType === "B2B" || portalType === "BOTH") &&
                isB2BLoggedIn === false && ( */}
                <Route
                  exact
                  path="/"
                  render={(props) =>
                    window.location.hash !== "/about-us" &&
                    window.location.hash !== "/contact-us" &&
                    window.location.pathname !== "/about" &&
                    window.location.pathname !== "/contact" &&
                    window.location.pathname !== "/thank-you" &&
                    window.location.pathname !== "/features" &&
                    window.location.hash !== "/pricing" &&
                    window.location.pathname !== "/pricing/faq" &&
                    window.location.pathname !== "/terms-of-use" &&
                    window.location.pathname !== "/login" &&
                    window.location.pathname !== "/partner-offers" &&
                    window.location.pathname !== "/book-demo" &&
                    window.location.pathname !== "/signin" &&
                    window.location.pathname !== "/signup" && (
                      Config.codebaseType === undefined || Config.codebaseType !== "tourwiz-marketplace" || (Config.codebaseType === "tourwiz-marketplace" && window.location.hostname === "agents.thetripcentre.com") ?
                        (<LoginScreenMW
                          {...props}
                          {...this.state}
                          userInfo={userInfo}
                          handleLoginBox={this.handleLoginBox}
                          getLoginDetails={this.getLoginDetails}
                          callAuth={this.appAuth}
                          isRedirectToRequestedURL={true}
                        />) :
                        (<CMSHomeCustomer
                          {...props}
                          {...this.state}
                          handleLoginBox={this.handleLoginBox}
                          getLoginDetails={this.getLoginDetails}
                        />)
                    )
                  }
                />

                {/* // )} */}
                {(portalType === "B2B" || portalType === "BOTH") &&
                  isB2BLoggedIn === false && cmsSettings && (Config.codebaseType === undefined || Config.codebaseType === "tourwiz-tripcenter") ? <CMSCopywrite05 {...this.state} /> : <CMSCopywrite {...this.state} />}
              </StickyContainer>
            </div>)}
          <Route path="/PackageView/:id"
            render={(props) => (<PackageView {...props} {...this.state} userInfo={userInfo} />)}
          />
          <Route path="/HotdealsView/:id"
            render={(props) => (<HotdealsView {...props} {...this.state} userInfo={userInfo} />)}
          />
        </Switch>

        {(((portalType === "B2B" || portalType === "BOTH") && userInfo) ||
          portalType === "B2C") && (
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
                        render={(props) => <Dashboard {...props} {...this.state} />}
                      />
                    ) : portalType === "B2B" || portalType === "BOTH" ? (
                      <Route
                        exact
                        path="/"
                        render={(props) => <Dashboard {...props} {...this.state} />}
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
                        />
                      )}
                    />
                    <Route
                      path="/Invoice/:mode/:id?"
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
                        <ManualInvoices {...this.state} {...props} />
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
                      path="/Dashboard-Agent"
                      render={(props) => (
                        <DashboardAgent {...props} userInfo={userInfo} />
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
                    <Route path="/ItineraryList/:filtermode?" render={(props) => (
                      <QuotationList
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
                      path="/Package/:mode/:id?"
                      render={(props) => (
                        <PackageForm {...this.state} {...props} />
                      )}
                    />
                    <Route
                      path="/PackageList"
                      render={(props) => (
                        <PackageList {...this.state} {...props} />
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
                      path="/Location/:mode/:id?"
                      render={(props) => (
                        <LocationForm {...this.state} {...props} />
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
                        <ChangePassword {...this.state} {...props} userInfo={userInfo} />
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
                    <Route
                      path="/Deals"
                      render={(props) => <Deals {...props} {...this.state} userInfo={userInfo} />}
                    />
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
                          path="/ViewBooking/:mode/:irn/:brn/:data?"
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
                          path="/manualinvoice/:invoiceid/:itemid?"
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
                          path="/BillingAndSubscription/:transactiontoken?"
                          render={(props) => (
                            <BillingAndSubscription {...props} {...this.state} />
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
                          render={(props) => <CMSHome {...props} {...this.state} />}
                        />
                        <Route
                          path="/CustomerWebsite"
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
                          path="/MarkupSetup"
                          render={(props) => (
                            <MarkupSetup  {...props} {...this.state} />
                          )}
                        />
                        <Route
                          path="/TaxConfiguration"
                          render={(props) => (
                            <TaxConfiguration  {...props} {...this.state} userInfo={userInfo} />
                          )}
                        />

                      </React.Fragment>
                    ) : (
                      (this.state.isLoggedIn ||
                        this.state.isLoginMenu ||
                        this.state.isLoginBox ||
                        this.state.isUserMenu ||
                        this.state.isB2BLoggedIn ||
                        this.state.userInfo) && (
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

export default AppTripCenter;
