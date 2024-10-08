import React, { Component } from "react";
import PublicPageHeader from "../../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../../components/landing-pages/public-page-copyrights";
import { Helmet } from "react-helmet";
import SignupBgImgStep1 from "../../../assets/images/tw/sign-up-page-bg-step1.png";
import { StickyContainer, Sticky } from "react-sticky";

const SignupThankYou = (props) => {
  const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;
  return (
    <React.Fragment>
      <div className="tw-public-pages tw-login-page">
        <style>{css}</style>

        <Helmet>
          <title>{props.location.pathname.replace("/", "").charAt(0).toUpperCase() + props.location.pathname.replace("/", "").slice(1)} | Tourwiz</title>
          <meta
            name="description"
            content="Sign up for TourWiz - A Virtual Companion for Travel professionals that gives you an Itinerary Builder, Travel CRM, Accounting & Reports in one online solution"
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

          <div className="container position-relative onboarding-main-page">
            <div className="row">
              <div className="col-lg-4">
                <div className="pt-4">
                  <div className="mt-3 mb-3 pb-2">
                    <h3
                      className="mt-3 mb-3 border-bottom pb-3"
                      style={{ color: "#f18247", fontSize: "24px" }}
                    >
                      Register Here
                    </h3>
                    <h5
                      style={{
                        color: "#666",
                        fontSize: "15px",
                        fontWeight: "normal",
                      }}
                    >
                      As this is a B2B only platform, we require some additional information for giving access.
                    </h5>
                    <h4
                      style={{
                        color: "#892b9c",
                        fontSize: "20px",
                        fontWeight: "normal",
                      }}
                    >
                      It takes less than a minute!
                    </h4>
                    <h5
                      style={{
                        color: "#666",
                        fontSize: "15px",
                        fontWeight: "normal",
                      }}
                    >
                      No Credit Card required | No Commitments
                    </h5>
                  </div>

                  <div className="mb-4">
                    <div>
                      <h3 className="mt-5 text-primary text-center">Welcome aboard !</h3>
                      <h6 className="mt-3 mb-5 text-center">
                        Please go ahead and login with your credentials.
                      </h6>
                    </div>
                  </div>
                  <div className="border-top mt-3 pt-4 mb-5">
                    <h5 className="d-block mb-3">
                      {"Already have an account?"}
                    </h5>

                    <button
                      className="w-100 btn btn-outline-primary btn-signup"
                      onClick={() => props.history.push("/signin")}
                    >
                      {"Sign in"}
                    </button>
                  </div>
                </div>
              </div>


              <div className="col-lg-8 signup-img-col">
                <div className={"signup-img"}>
                  <img
                    src={SignupBgImgStep1}
                    alt=""
                  />
                </div>

                <div className="signup-info">
                  <div>
                    <h2 style={{ fontSize: "21px" }}>Rev up your revenue and slash your workload by 70% with TourWizAI Lite<sup>BETA</sup>, TourWiz ERP and B2B Marketplace</h2>
                    <h5 className="mt-1" style={{ fontSize: "18px" }}>Discover amazing deals now!</h5>

                    <ul className="list-unstyled">
                      <li>Increase in revenue for travel agents, tour operator and DMC’s</li>
                      <li>Access to global content and increase sales reach</li>
                      <li>Reduce costs and work with TourWizAI Lite <sup>BETA</sup>, the game changer in travel planning</li>
                      <li>Use readymade itineraries from Marketplace</li>
                      <li>Inquiry automation</li>
                      <li>Get website/landing page with pre-filled content</li>
                    </ul>
                    <h5 className="mt-2" style={{ color: "#ffd500" }}>
                      Sign up now for a free account to learn more about how TourWiz can help your business thrive
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {signupVisible && (
              <SignupWizard
                onSignupComplete={setSignupResult}
                onClose={setSignUpVisible}
              />
            )}

            {isShowForgotPassword && (
              <ForgotPassword onClose={() => setForgotPasswordVisible()} />
            )}

            {joinTeamVisible && (
              <JoinTeam onClose={() => setJoinTeamVisible()} />
            )}

            {signupResultVisible && (
              <SignupResult
                onClose={() => setSignupResult()}
                signupResult={signupResult}
              />
            )} */}

          <div style={{ marginTop: "-42px" }}>
            <PublicPageFindus />
          </div>

          <PublicPageWherewe />
          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />
        </StickyContainer>
      </div >
    </React.Fragment>
  );
}

export default SignupThankYou;
// 