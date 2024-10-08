import React from "react";
import { Route, Switch } from "react-router-dom";
import Environment from "./base/environment";
import Header from "./components/common/header-partner";
import Footer from "./components/common/footer";
import Home from "./screens/home";
import Login from "./screens/login";
import ItineraryEmailView from "./screens/itinerary-email-view";
import Contact from "./screens/tourwiz-landing-pages/contact-partner";
import ThankYou from "./screens/tourwiz-landing-pages/thank-you";
import Features from "./screens/tourwiz-landing-pages/features";
import Terms from "./screens/tourwiz-landing-pages/terms";
import About from "./screens/tourwiz-landing-pages/about";
import Pricing from "./screens/tourwiz-landing-pages/pricing";
import TagManager from "react-gtm-module";
import DealsPartner from "./screens/deals-partner";
import StaticDeals from "./screens/tourwiz-landing-pages/static-deals";
import AgentPartnerLogin from "./screens/agent-partner-login";
import LoginScreenPartnerMW from "./screens/onboarding/components/login-screen-partner-mw";
import DashboardAgentPartner from "./screens/dashboard-agent-partner"
import UpdateProfilePartner from "./screens/admin/update-profile-partner";
import DealsPartnerAgentclicksDetails from "./screens/deals-partner-agent-clicks-details";
import DealsPartnerForm from "./screens/deals-partner-form";
import ArrowUp from "./assets/images/dashboard/up-arrow.png";

class AppPartner extends Environment {

  render() {
    const { userInfo, isB2BLoggedIn } = this.state;
    const portalType = localStorage.getItem("portalType");

    // Integrated Google Analytics
    // ReactGA.initialize("UA-5235714-40");
    // ReactGA.pageview(window.location.pathname + window.location.search);

    // Integrated hotjar
    // hotjar.initialize("2373302", "6");

    const tagManagerArgs = {
      gtmId: "GTM-N4TR5DC",
    };

    TagManager.initialize(tagManagerArgs);

    const css = `
  .goToTopButton {position: fixed;
    width: auto;
    right: 9%;
    bottom: 20px;
    height: auto;
    padding: 10px;
    z-index: 1;
    cursor: pointer;
    border-radius: 50%;
    background: rgb(241, 130, 71);
    box-shadow: 0px 0px 32px rgb(0 0 0 / 50%);}
    
  @media (max-width: 768px){
    .goToTopButton {
      right: 24%;
      padding: 12px;}
  }`;

    return (
      <React.Fragment>
        <style>{css}</style>
        <Switch>
          <Route
            key="login"
            path="/login"
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
            key="signin"
            path="/signin"
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
            key="signup"
            path="/signup"
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
          <Route path="/about-us" component={About} />
          <Route path="/contact-us" component={Contact} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/features" component={Features} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/pricing/faq" component={Pricing} />
          <Route path="/terms-of-use" component={Terms} />
          <Route path="/partner-offers" component={StaticDeals} />
          <Route path="/EmailView/:cartId" component={ItineraryEmailView} />

          {(portalType === "B2B" || portalType === "BOTH") &&
            !userInfo &&
            isB2BLoggedIn === false && (
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
                  window.location.hash !== "/signin" &&
                  window.location.hash !== "/signup" && (
                    <AgentPartnerLogin
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
                  {(portalType === "B2B" || portalType === "BOTH") &&
                    userInfo &&
                    userInfo.isPortalAdmin ? (
                    <Route
                      exact
                      path="/"
                      render={(props) => <DashboardAgentPartner {...props} {...this.state} />}
                    />
                  ) : portalType === "B2B" || portalType === "BOTH" ? (
                    <Route
                      exact
                      path="/"
                      render={(props) => <DashboardAgentPartner {...props} {...this.state} />}
                    />
                  ) : (
                    <Route
                      exact
                      path="/"
                      render={(props) => <Home {...props} {...this.state} />}
                    />
                  )}
                  <Route path="/Login" component={Login} />
                  <Route path="/Dashboard-Agent" component={DashboardAgentPartner} />
                  <Route
                    path="/Dashboard-Tourwiz"
                    render={(props) => (
                      <DashboardAgentPartner
                        {...props}
                        {...this.state}
                        userInfo={userInfo}
                      />
                    )}
                  />
                  <Route
                    path="/UpdateProfile"
                    render={(props) => (
                      <UpdateProfilePartner {...this.state} {...props} />
                    )}
                  />
                  <Route
                    path="/Deals"
                    render={(props) => <DealsPartner {...props} {...this.state} />}
                  />
                  <Route
                    path="/Partner-Deals"
                    render={(props) => <DealsPartner {...props} {...this.state} />}
                  />
                  <Route
                    path="/Partner-Deals-Clicks/:offerid"
                    render={(props) => <DealsPartnerAgentclicksDetails {...props} {...this.state} />}
                  />
                  <Route
                    path="/Offers/:mode/:id?"
                    render={(props) => (
                      <DealsPartnerForm {...this.state} {...props} />
                    )}
                  />
                </Switch>
              </div>

              <Footer />
            </React.Fragment>
          )}
        <div className="goToTopButton" onClick={this.scrollToTop} style={{ display: (document.documentElement.scrollTop > 300 ? "block" : "none") }}>
          <img src={ArrowUp} style={{ width: "36px" }} alt='topside'></img></div>
      </React.Fragment>
    );
  }
}

export default AppPartner;
