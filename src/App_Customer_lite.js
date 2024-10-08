import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Environment from "./base/environment";
import EnvironmentAsync from "./base/environmentAsync";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Bookings from "./screens/bookings";
import ViewBooking from "./screens/view-booking";
import VoucherInvoice from "./screens/voucher-invoice";
import BookingStatus from "./screens/booking-status";
import Profile from "./screens/profile";
import EditProfile from "./screens/edit-profile";
import PageNotFound from "./screens/notfound";
import CMSHome from "./screens/cms/cms-home-customer";
import LoginCustomer from "./screens/login-customer";
import CMSHeader from "./components/cms/cms-header";
import CMSCopywrite from "./components/cms/cms-copywrite";
import CMSAbout from "./screens/cms/cms-about";
import CMSDetails from "./screens/cms/cms-details";
import DashboardCustomer from "./screens/dashboard-customer";
import CMSContact from "./screens/cms/cms-contact";
import CMSInquiry from "./screens/cms/cms-inquiry";
import Loader from "./components/common/loader";
import CMSTerms from "./screens/cms/cms-terms";
import Quotation from "./screens/quotation";
import QuotationList from "./screens/quotation-list";
import CustomerReconciliation from "./screens/reports/customer-reconciliation";
import ItineraryEmailView from "./screens/itinerary-email-view";
import SessionExpired from "./screens/session-expired.jsx"
import LoginScreenMW from "./screens/onboarding/components/login-screen-mw";
import CMSDealsList from "./screens/cms/cms-deals-list";
import PackageView from "./screens/package-view";
import { CMSContext } from "./screens/cms/cms-context";
import MarketplaceDealsPreview from "./screens/marketplace-deals-preview";
import InquiryList from "./screens/inquiry-list";
import PackageList from "./screens/package-list";
import ManualInvoiceItemPrint from "./screens/manual-item-print-invoice";
import CustomerInvoices from "./screens/reports/customer-invoices";

class AppCustomerLite extends EnvironmentAsync {

  getLoaderContent = () => {
    return <div className="row p-3">
      <div className="container ">
        <Loader />
      </div>
    </div>
  }
  render() {
    const { userInfo, cmsSettings, isCMSPortalResponseDone, isB2BLoggedIn } = this.state;

    const portalType = localStorage.getItem("portalType");
    let component = null;
    if (cmsSettings === null || cmsSettings?.themeName === "AF-010") {
      var CMSHeader1 = lazy(() => import('./components/cms/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings?.themeName === "AF-002") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-002/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings?.themeName === "AF-003") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-003/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    } else if (cmsSettings?.themeName === "AF-001") {
      var CMSHeader1 = lazy(() => import('./components/cms/AF-001/cms-header'));
      component = <Suspense fallback={this.getLoaderContent()}>
        <CMSHeader1 {...this.state} />
      </Suspense>;
    }

    const cmsState = this.state;
    const cmsProps = this.props;
    const cmsCtx = {
      cmsState,
      cmsProps
    };

    if (window.location.href.replace(window.location.origin, '').length < 2) {
      let environment = JSON.parse(localStorage.getItem("environment"));
      //environment.portalUrl
      let portalUrl = environment.portalUrl.replace('http://', '').replace('https://', '')
        .replace(process.env.REACT_APP_B2CPORTALDOMAIN, '')
      window.location.href = window.location.origin + "/" + portalUrl;
    }
    if (this.state.isLoadingWebSite)
      return <div className="spinnerLanding show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="spinnerLanding-only">Loading...</span>
        </div>
      </div>
    else {
      return (
        <React.Fragment>
          <Switch>

            <CMSContext.Provider
              value={cmsCtx} >
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

              {portalType &&
                <Route
                  path="/EmailView/:cartId"
                  render={(props) => (
                    <ItineraryEmailView {...props} {...this.state} />
                  )}
                />
              }
              {portalType &&
                <Route path="/PackageView/:id"
                  render={(props) => (<PackageView {...props} {...this.state} userInfo={userInfo} />)}
                />
              }

              {window.location.pathname != "/expired" && window.location.pathname.indexOf("/Packageview/") < 0 && window.location.pathname.indexOf("/EmailView/") < 0 && (
                <React.Fragment>
                  {!userInfo &&
                    isB2BLoggedIn === false && (
                      <div>{/* className={cmsSettings?.themeName + " " + window.location.pathname + " cm-pages"} */}
                        {/* <div className={"AF-002 cm-pages"}> */}
                        {/* {component} */}
                        {/* <CMSHeader {...this.state} /> */}
                        {/* <Route
                      exact
                      path="/"
                      render={(props) => (
                        <Loader />
                      )}
                    /> */}
                        <Header
                          {...this.state}
                          handleLoginBox={this.handleLoginBox}
                          handleUserMenu={this.handleUserMenu}
                          handleLogOut={this.handleLogOut}
                          handleLangChange={this.handleLangChange}
                          isCustomerHeader={true}
                        />

                        <Route path="/login" component={LoginCustomer} />
                        <Route
                          path="/details/:module/:id"
                          render={(props) => (
                            <CMSDetails {...props} {...this.state} />
                          )}
                        />
                        <Route
                          path="/customerinquiry/:id"
                          render={(props) => (
                            <CMSInquiry {...props} {...this.state} />
                          )}
                        />
                        <Route
                          path="/list/:module"
                          render={(props) => (
                            <CMSDealsList {...props} {...this.state} />
                          )}
                        />

                        <Route
                          path="/contact"
                          render={(props) => (
                            <CMSContact {...props} {...this.state} />
                          )}
                        />
                        {/* <CMSCopywrite {...this.state} /> */}

                        <Route
                          exact
                          path="/"
                          render={(props) => <MarketplaceDealsPreview {...props} {...this.state} userInfo={userInfo} />}
                        />
                        <Footer />
                      </div>
                    )}

                  {userInfo && (
                    <React.Fragment>
                      <Header
                        {...this.state}
                        handleLoginBox={this.handleLoginBox}
                        handleUserMenu={this.handleUserMenu}
                        handleLogOut={this.handleLogOut}
                        handleLangChange={this.handleLangChange}
                        isCustomerHeader={true}
                      />
                      <div className="page-height">
                        {userInfo ? (
                          <React.Fragment>
                            <Route
                              exact
                              path="/"
                              render={(props) => (
                                <DashboardCustomer
                                  {...props}
                                  {...this.state}
                                  handleLoginBox={this.handleLoginBox}
                                  getLoginDetails={this.getLoginDetails}
                                />
                              )}
                            />
                            <Route path="/Bookings" component={Bookings} />

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
                                <ManualInvoiceItemPrint {...props} {...this.state} userInfo={userInfo} />
                              )}
                            />
                            <Route
                              path="/BookingStatus/:token"
                              component={BookingStatus}
                            />
                            <Route path="/Profile" component={Profile} />
                            <Route path="/EditProfile" component={EditProfile} />
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
                              path="/Itinerary/:mode"
                              render={(props) => (
                                <Quotation
                                  {...props}
                                  {...this.state}
                                  handleLoginBox={this.handleLoginBox}
                                />
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
                            <Route
                              path="/details/:module/:id"
                              render={(props) => (
                                <CMSDetails {...props} {...this.state} />
                              )}
                            />
                            <Route
                              path="/PackageList/:filter?"
                              render={(props) => (
                                <PackageList {...this.state} {...props} />
                              )}
                            />
                            <Route path="/InquiryList/:filtermode?" render={(props) => (
                              <InquiryList
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
                              path="/MarketplacePackages/:mode?"
                              render={(props) => <MarketplaceDealsPreview {...props} {...this.state} userInfo={userInfo} />}
                            />
                            <Route
                              path="/CustomerInvoices"
                              render={(props) => (
                                <CustomerInvoices {...this.state} {...props} userInfo={userInfo} />
                              )}
                            />
                            <Route
                              path="/CustomerReconciliation"
                              render={(props) => (
                                <CustomerReconciliation {...this.state} {...props} />
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
                      </div>
                      <Footer />
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}


              {cmsSettings === null && window.location.pathname.indexOf("/customerinquiry/") > -1 && (

                <Route
                  path="/customerinquiry/:id"
                  render={(props) => (
                    <CMSInquiry {...props} {...this.state} />
                  )}
                />
              )}
              {isCMSPortalResponseDone && cmsSettings !== undefined && cmsSettings === null && window.location.pathname.indexOf("/details/deals/") < 0 && window.location.pathname.indexOf("/customerinquiry/") < 0 && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "100vh" }}
                >
                  Site is Not Available...
                </div>
              )}

              {cmsSettings && cmsSettings?.portalID === 0 && !userInfo && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "100vh" }}
                >
                  <Route exact path="/" component={LoginCustomer} />
                </div>
              )}

              {cmsSettings && cmsSettings?.portalID === 0 && userInfo && (
                <React.Fragment>
                  <Header
                    {...this.state}
                    handleLoginBox={this.handleLoginBox}
                    handleUserMenu={this.handleUserMenu}
                    handleLogOut={this.handleLogOut}
                    handleLangChange={this.handleLangChange}
                    isCustomerHeader={true}
                  />
                  <div className="page-height">
                    <React.Fragment>
                      {userInfo ? (
                        <React.Fragment>
                          <Route
                            exact
                            path="/"
                            render={(props) => (
                              <DashboardCustomer
                                {...props}
                                {...this.state}
                                handleLoginBox={this.handleLoginBox}
                                getLoginDetails={this.getLoginDetails}
                              />
                            )}
                          />
                          <Route path="/Bookings" component={Bookings} />
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
                              <ManualInvoiceItemPrint {...props} {...this.state} userInfo={userInfo} />
                            )}
                          />
                          <Route
                            path="/BookingStatus/:token"
                            component={BookingStatus}
                          />
                          <Route path="/Profile" component={Profile} />
                          <Route path="/EditProfile" component={EditProfile} />
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
                    </React.Fragment>
                  </div>
                  <Footer />
                </React.Fragment>
              )}

              {/* {cmsSettings === "" && !isCMSPortalResponseDone && (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh", opacity: ".5" }}
              >
                <Loader />
              </div>
            )} */}
            </CMSContext.Provider>
            <Redirect to="/preprod-BusinessName287" />
          </Switch>
        </React.Fragment>
      );
    }
  }
}

export default AppCustomerLite;
