import React from "react";
import { Route, Switch } from "react-router-dom";
import Environment from "./base/environment";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Results from "./screens/results";
import Details from "./screens/details";
import Home from "./screens/home";
import Cart from "./screens/cart";
import Bookings from "./screens/bookings";
import ViewBooking from "./screens/view-booking";
import VoucherInvoice from "./screens/voucher-invoice";
import BookingStatus from "./screens/booking-status";
import Signup from "./screens/signup";
import Profile from "./screens/profile";
import EditProfile from "./screens/edit-profile";
import CoTravelers from "./screens/co-travelers";
import AddCoTraveler from "./screens/add-cotraveler";
import EditCoTraveler from "./screens/edit-cotraveler";
import Payment from "./screens/payment";
import AgentLogin from "./screens/agent-login";
import Splash from "./screens/splash";
import Balance from "./screens/balance";
import EWalletStatement from "./screens/EWalletStatement";
import OfflineBookings from "./screens/offline-bookings";
import FailedBookings from "./screens/failed-bookings";
import IssueDocuments from "./screens/issue-documents";
import ManageCustomers from "./screens/manage-customers";
import PageNotFound from "./screens/notfound";
import AddCustomer from "./screens/add-customer";
import BaggageInfo from "./screens/baggage-info";
import Dashboard from "./screens/dashboard";
import Quotation from "./screens/quotation";
import Umrahpackage from "./screens/umrah-package";
import QuotationList from "./screens/quotation-list";
import Login from "./screens/login";
import ItineraryEmailView from "./screens/itinerary-email-view";
import messagelistener from "./services/messagelistener";
//import TagManager from "react-gtm-module";
//
// Initialize window messages
messagelistener.init();

class App extends Environment {

  render() {

    const { userInfo, isB2BLoggedIn } = this.state;
    const portalType = localStorage.getItem("portalType");
    // const tagManagerArgs = {
    //   gtmId: "GTM-5QGVJLF",
    // };
    // TagManager.initialize(tagManagerArgs);

    return (
      <React.Fragment>
        <Header
          {...this.state}
          handleLoginBox={this.handleLoginBox}
          handleUserMenu={this.handleUserMenu}
          handleLogOut={this.handleLogOut}
          handleLangChange={this.handleLangChange}
        />

        <div className="page-height">
          {(((portalType === "B2B" || portalType === "BOTH") && userInfo) ||
            portalType === "B2C") && (
              <Switch>
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
                  <Route exact path="/" render={(props) => <Home {...props} {...this.state} />} />
                )}
                <Route path="/Login" component={Login} />
                <Route
                  path="/Results/:businessName/:locationName/:locationID/:countryID/:checkInDate/:checkOutDate/:roomDetails/:filters"
                  component={Results}
                />
                <Route
                  path="/Results/:businessName/:locationName/:locationID/:countryID/:checkInDate/:checkOutDate/:roomDetails/:filters?token="
                  component={Results}
                />
                <Route
                  path="/Details/:businessName/:locationName/:locationID/:countryID/:checkInDate/:checkOutDate/:roomDetails/:filters/:id/:provider/:overridesupplier/:friendlyurl"
                  component={Details}
                />
                <Route path="/Details/:businessName/:token/:id" component={Details} />
                <Route
                  path="/Cart"
                  render={(props) => (
                    <Cart {...props} {...this.state} handleLoginBox={this.handleLoginBox} />
                  )}
                />
                <Route
                  path="/Quotation/:mode"
                  render={(props) => (
                    <Quotation {...props} {...this.state} handleLoginBox={this.handleLoginBox} />
                  )}
                />

                <Route
                  path="/umrah-package/:mode"
                  render={(props) => (
                    <Umrahpackage {...props} {...this.state} handleLoginBox={this.handleLoginBox} />
                  )}
                />

                <Route
                  path="/Itinerary/:mode"
                  render={(props) => (
                    <Quotation {...props} {...this.state} handleLoginBox={this.handleLoginBox} />
                  )}
                />
                <Route path="/QuotationList" component={QuotationList} />
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
                <Route path="/EmailView/:cartId" component={ItineraryEmailView} />
                <Route
                  path="/Signup"
                  render={(props) => (
                    <Signup {...props} {...this.state} handleLoginBox={this.handleLoginBox} />
                  )}
                />
                <Route path="/BaggageInfo" component={BaggageInfo} />
                {userInfo ? (
                  <React.Fragment>
                    <Route path="/Payment" component={Payment} />

                    <Route path="/Bookings" component={Bookings} />
                    <Route
                      path="/ViewBooking/:mode/:irn/:brn/"
                      render={(props) => <ViewBooking {...props} {...this.state} />}
                    />

                    <Route
                      path="/Voucher/:mode/:businessName/:itineraryid/:bookingid"
                      render={(props) => <VoucherInvoice {...props} {...this.state} />}
                    />

                    <Route path="/BookingStatus/:token" component={BookingStatus} />

                    <Route path="/Profile" component={Profile} />
                    <Route path="/EditProfile" component={EditProfile} />
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
                    <Route path="/Balance" render={(props) => <Balance userInfo={userInfo} />} />
                    <Route path="/OfflineBookings" component={OfflineBookings} />
                    <Route
                      path="/FailedBookings"
                      render={(props) => <FailedBookings userInfo={userInfo} />}
                    />
                    <Route path="/EWalletStatement" component={EWalletStatement} />
                    <Route path="/IssueDocuments" component={IssueDocuments} />

                    <Route
                      path="/Customer/:mode/:id?"
                      render={(props) => <CoTravelers userInfo={userInfo} {...props} />}
                    />
                    <Route path="/ManageCustomers" component={ManageCustomers} />
                    <Route path="/AddCustomer" component={AddCustomer} />
                    <Route path="/Search" render={(props) => <Home {...props} {...this.state} />} />
                  </React.Fragment>
                ) : (
                  (this.state.isLoggedIn ||
                    this.state.isLoginMenu ||
                    this.state.isLoginBox ||
                    this.state.isUserMenu ||
                    this.state.isB2BLoggedIn ||
                    this.state.userInfo) && <Route exact path="*" component={PageNotFound} />
                )}
              </Switch>
            )}

          {(portalType === "B2B" || portalType === "BOTH") && !userInfo && (
            <Switch>
              {isB2BLoggedIn === false ? (
                <Route
                  path="*"
                  render={(props) => (
                    <AgentLogin
                      {...props}
                      {...this.state}
                      handleLoginBox={this.handleLoginBox}
                      getLoginDetails={this.getLoginDetails}
                    />
                  )}
                />
              ) : (
                <Route path="*" render={(props) => <Splash {...props} {...this.state} />} />
              )}
            </Switch>
          )}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
