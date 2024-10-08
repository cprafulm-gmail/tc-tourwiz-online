import React, { Component } from "react";
import { apiRequester } from "../../../services/requester";
import { Trans } from "../../../helpers/translate";
import * as Global from "../../../helpers/global";
import styled from "styled-components";
import backgroundImage from "../images/travel-world.jpg";
import SignupWizard from "./signup-wizard";
import ForgotPassword from "./forgot-password";
import JoinTeam from "./join-team";
import SignupResult from "./signup-result";
import PublicPageHeader from "../../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../../components/landing-pages/public-page-copyrights";
import { Helmet } from "react-helmet";
import AgentSignUpNew from "../../../components/onboarding/agent-signup-new";
import SignupBgImgStep1 from "../../../assets/images/tw/sign-up-page-bg-step1-hajj.jpg";
import ComingSoonGIF from "../../../assets/images/tw/ComingSoonGIF.gif";
import SigninBgImg from "../../../assets/images/tw/signup-hajj-girl.png";
import AgentPartnerSignUpNew from "../../../components/onboarding/agent-partner-signup-new";
import { StickyContainer, Sticky } from "react-sticky";
import * as encrypt from "../../../helpers/encrypto";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../../config";


const recaptchaRef = React.createRef();

class LoginScreenMWHajj extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
      loginStatus: false,
      username: "",
      password: "",
      isValidUsername: true,
      isValidPassword: true,
      errorMessage: "",
      showSuccessMsg: false,
      isShowForgotPassword: false,
      signupVisible: false,
      isRegistrationForm: false,
      captcha: "",
      isValidCaptcha: true,
      IsFromAutoPopulated: false,
    };
  }

  onChangeCaptcha = (value) => {
    this.setState({
      captcha: value,
      isValidCaptcha: true,
    });
  }

  authUserAwkward = () => {
    this.setState({ IsFromAutoPopulated: !this.state.IsFromAutoPopulated });
  }

  authUser = () => {
    let isValidate = true;
    if (this.state.username === "" || this.state.password === "") {
      isValidate = false;
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        errorMessage: Trans("_rqUserNamePassword"),
      });
    } else if ((this.state.username !== "preprodtourwizautomation@gmail.com"
      && this.state.username !== "tourwizautomation@gmail.com"
      && !this.state.IsFromAutoPopulated)
      && Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && recaptchaRef.current.getValue() === "") {
      isValidate = false;
      this.setState({
        isValidCaptcha: !(recaptchaRef.current.getValue() === "")
      });
    }
    else {
      isValidate = true;
      this.setState({
        isButtonLoding: true,
        isValidUsername: true,
        isValidPassword: true,
        errorMessage: "",
      });
      if (isValidate) {
        var reqURL = "api/v1/user/login";
        var reqOBJ = {
          Request: {
            LoginName: encrypt.encryptUsingAES256(this.state.username),
            Password: encrypt.encryptUsingAES256(this.state.password),
            ContactInformation: { Email: encrypt.encryptUsingAES256(this.state.username) },
            CaptchaToken: Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" ? recaptchaRef.current.getValue() : "",
          },
        };
        if (this.state.IsFromAutoPopulated) {
          reqOBJ.Flags = { IsFromAutoPopulated: this.state.IsFromAutoPopulated }
        }
        apiRequester(reqURL, reqOBJ, (data) => {
          localStorage.setItem("agentName", this.state.agentname);
          if (data.status.code === 0) {
            if (localStorage.getItem("afUserType") === null)
              localStorage.setItem("afUserType", data.response.afUserType);
            //this.setState({ isButtonLoding: false });
            let isPersonateEnabled =
              Global.getEnvironmetKeyValue("isPersonateEnabled");
            if (isPersonateEnabled) {
              this.props.getLoginDetails((data) => {
                this.props.handleLoginBox(data);
                this.setState({
                  isButtonLoding: false,
                });
                this.props.isRedirectToRequestedURL
                  ? window.location.href.replace(
                    window.location.origin + "/#",
                    ""
                  )
                  : !this.state.quotationMode
                    ? this.props.history.push(`/`)
                    : this.props.history.push(`/Dashboard-Tourwiz`);
              });
              this.getPortals();
            } else {
              this.props.handleLoginBox(data);
              this.setState({ isButtonLoding: false });
              !this.state.quotationMode
                ? this.props.history.push(`/`)
                : this.props.history.push(`/Dashboard-Tourwiz`);
            }
          } else if (data.status.code === 22) {
            recaptchaRef.current.reset();
            this.setState({
              isValidCaptcha: true
            });
          } else {
            recaptchaRef.current.reset();
            this.setState({
              isButtonLoding: false,
              isValidCaptcha: true,
              errorMessage: Trans("_incorrectUserNamePassword"),
            });
          }
        });
      }
    }
  };

  getPortals = () => {
    let reqURL = "api/v1/callcenter/portals";
    let reqOBJ = {
      Request: "",
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      if (data.status.code === 41070) {
        this.setState({
          isLoading: true,
        });
      } else {
        this.setState({
          portals: data.response,
          portal: sessionStorage.getItem("portalId")
            ? sessionStorage.getItem("portalId")
            : data.response[0].name,
          isLoading: false,
        });
        let portals = data.response;
        let portalId = sessionStorage.getItem("portalId");
        let personateId = portalId
          ? portals.find((x) => x.id === portalId).defaultPersonateId
          : portals[0].defaultPersonateId;

        let req = {
          id: personateId,
          details: { firstName: "" },
        };
        this.handleSelect(req);
      }
    });
  };

  handleSelect = (req) => {
    this.setState({
      isCallCenterLoader: true,
    });

    let reqURL = "api/v1/callcenter/setpersonate";
    let reqOBJ = {
      Request: req.id,
    };
    apiRequester(reqURL, reqOBJ, (data) => {
      sessionStorage.setItem("personateId", req.id);
      sessionStorage.setItem("callCenterType", req.type);
      sessionStorage.setItem("bookingFor", req.details.firstName);
      sessionStorage.setItem("bookingForInfo", JSON.stringify(req.details));
      localStorage.setItem("personateId", req.id);
      localStorage.setItem("environment", JSON.stringify(data.response));
      localStorage.removeItem("cartLocalId");
      this.setState({
        bookingFor: req.details.firstName,
        isCallCenterDetails: !this.state.isCallCenterDetails,
      });
      /* this.props.getLoginDetails((data) => {
        this.props.handleLoginBox(data);
        this.setState({
          isButtonLoding: false
        });
        this.props.isRedirectToRequestedURL
          ? window.location.href.replace(window.location.origin + "/#", "")
          : !this.state.quotationMode
            ? this.props.history.push(`/`)
            : this.props.history.push(`/Dashboard-Tourwiz`);
      }); */
    });
  };

  handleChange = (e) => {
    if (e.target.name === "username") {
      this.setState({
        username: e.target.value.trim(),
        isValidUsername: true,
      });
    }
    if (e.target.name === "password") {
      this.setState({
        password: e.target.value.trim(),
        isValidPassword: true,
        errorMessage: "",
      });
    }
    if (e.target.name === "email") {
      this.setState({
        email: e.target.value.trim(),
        isValidEmail: true,
        errorMessage: "",
      });
    }
    if (e.target.name === "agentname") {
      this.setState({
        agentname: e.target.value.trim(),
        isValidEmail: true,
        errorMessage: "",
      });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!this.state.isShowForgotPassword) this.authUser();
      else this.forgotPassword();
    }
  };

  setSignUpVisible = (result) => {
    this.setState({ signupVisible: !this.state.signupVisible });
  };

  setForgotPasswordVisible = () => {
    this.setState({ isShowForgotPassword: !this.state.isShowForgotPassword });
  };

  setJoinTeamVisible = () => {
    this.setState({ joinTeamVisible: !this.state.joinTeamVisible });
  };

  setSignupResult = (result) => {
    this.setState({
      signupResultVisible: !this.state.signupResultVisible,
      signupVisible: false,
      signupResult: result,
    });
  };

  handleRegistrationForm = () => {
    let page = this.state.page === "signin-hajj" ? "signup-hajj" : "signin-hajj";

    this.props.history.push("/" + page);

    this.setState({
      isRegistrationForm: this.state.page === "signin-hajj" ? false : true,
      page,
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    let page = this.props.location.pathname === "/signin-hajj" ? "signin-hajj" : "signup-hajj";
    page = this.props.isRedirectToRequestedURL ? "signin-hajj" : page;
    // page = "signin-hajj"
    this.setState({
      page,
      isRegistrationForm: page === "signin-hajj" ? false : true,
    });
  }

  render() {
    const {
      page,
      username,
      password,
      isValidUsername,
      isValidPassword,
      errorMessage,
      showSuccessMsg,
      isButtonLoding,
      signupVisible,
      isShowForgotPassword,
      joinTeamVisible,
      signupResultVisible,
      signupResult,
      isRegistrationForm,
      captcha,
      isValidCaptcha,
    } = this.state;

    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }
  .tw-public-pages .tw-header {
    background: linear-gradient(to right, #5db082 0%, #b5cc46 100%) !important;
  }
  .tw-public-pages .tw-header nav .btn {
    border-color:#fff;
    border-radius: 42px;
    font-weight: bold;
    color:#5f8d4e;
    background: #fff !important;
}
body .tw-public-pages .tw-header nav .btn:hover {
  color: #285430 !important;
  background: #fff !important;
  border: solid 1px #fff;
  transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}
.tw-login-page .btn-signin {
  background: linear-gradient(to right, #5db082 0%, #b5cc46 100%) !important;
  border-color: #285430 !important;
}
.btn-outline-primary:hover {
  background: linear-gradient(to right, #5db082 0%, #b5cc46 100%) !important;
  border-color: #fff;
}
.btn-outline-primary {
  color: #5db082;
  border-color: #5db082;
}
body .tw-public-pages .tw-findus {
  background: url(/static/media/find-us-bg.312654f3.png) center center no-repeat, linear-gradient(to right, #5db082 0%, #b5cc46 100%) !important;
  margin: 42px 0px 0px 0px !important;
  padding: 48px 0px !important;
  color: #fff !important;
  text-align: center !important;
  background-size: cover !important;
}
.tw-public-pages .tw-clients {
  background:linear-gradient(to right, #b5cc46 0%, #5db082 100%) !important;
  padding: 42px 0px 42px 0px;
  color: #fff;
}
.tw-public-pages .tw-clients h3 b {
  color: #fff;
  font-weight: 900;
}
body .tw-public-pages .tw-award {
  background: url(/static/media/award-bg.1cf3dc2b.png) center center no-repeat, linear-gradient(to right, #5db082 0%, #b5cc46 100%);
  margin: 42px 0px 0px 0px;
  padding: 15px 0px;
  color: #fff;
  text-align: center;
  background-size: cover;
}

.tw-public-pages .tw-footer {
  background: url(https://lma.org.au/wp-content/uploads/2022/09/Banner.png) center center no-repeat;
  padding: 62px 0px 42px 0px;
  background-size: cover;
  color: #fff;
  font-size: 18px;
}
body .tw-login-page .signin-img {
  position: absolute !important;
  top: 0px !important;
  right: -13.7% !important;
  width: 106.7% !important;
  height: 100vh !important;
  z-index: -1 !important;
  background: linear-gradient(150deg, #b5cc46 0%, #b5cc46 15%, #f5f1f0 30%, #b5cc46 45%, #f5f1f0 60%, #b5cc46 50%, #f5f1f0 60%, #b5cc46 70%, #f5f1f0 90%, #b5cc46 100%);

}
body .tw-login-page .signin-img img {
  position: relative !important;
  margin: 11.5% 0px 0px 55%;
  height: 75%;
  object-fit: cover;
}
  `;

    return (
      <React.Fragment>
        <div className="tw-public-pages tw-login-page">
          <style>{css}</style>

          {page === "signin-hajj" ? (
            <Helmet>
              <title>Sign in to your account | TourWiz</title>
              <meta
                name="description"
                content="Sign in to your TourWiz account anywhere, anytime to manage inquiries, build itineraries, track your bookings and do much more on one platform"
              />
            </Helmet>
          ) : (
            <Helmet>
              <title>Register Here | TourWiz</title>
              <meta
                name="description"
                content="Sign up for TourWiz - A Virtual Companion for Travel professionals that gives you an Itinerary Builder, Travel CRM, Accounting & Reports in one online solution"
              />
            </Helmet>
          )}

          <StickyContainer>
            {Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-customer" && Config.codebaseType !== "tourwiz-marketplace" && (
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
              </Sticky>)}

            <div className="container position-relative onboarding-main-page">
              <div className="row">
                <div className="col-lg-4">
                  <div className="pt-4">
                    {page === "signin-hajj" ? (
                      <h3
                        className="mt-3 mb-3 border-bottom pb-3"
                        style={{ color: "#5db082", fontSize: "24px" }}
                      >
                        Please sign in to continue
                      </h3>
                    ) : (
                      <div className="mt-3 mb-3 pb-2">
                        <h3
                          className="mt-3 mb-3 border-bottom pb-3"
                          style={{ color: "#5db082", fontSize: "24px" }}
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
                            color: "#5db082",
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
                    )}

                    {page === "signin-hajj" && (
                      <React.Fragment>
                        {!isValidPassword && !isValidUsername && (
                          <div
                            className={
                              "alert " +
                              (showSuccessMsg ? "alert-success" : "alert-danger")
                            }
                          >
                            {errorMessage}
                          </div>
                        )}

                        {isValidPassword &&
                          isValidUsername &&
                          errorMessage &&
                          errorMessage !== "" && (
                            <div
                              className={
                                "alert " +
                                (showSuccessMsg
                                  ? "alert-success"
                                  : "alert-danger")
                              }
                            >
                              {errorMessage}
                            </div>
                          )}

                        <div className="form-group">
                          <label htmlFor="username">Email address</label>
                          <input
                            className={
                              "form-control " +
                              (!isValidUsername ? "border border-danger" : "")
                            }
                            value={username ? username : ""}
                            name="username"
                            id="username"
                            type="text"
                            placeholder="Enter your registered email"
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            className={
                              "form-control " +
                              (!isValidPassword ? "border border-danger" : "")
                            }
                            value={password ? password : ""}
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && (
                          <div className="form-group">
                            <ReCAPTCHA
                              ref={recaptchaRef}
                              sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                              hl={'en'}
                              onChange={this.onChangeCaptcha}
                            />
                            {!isValidCaptcha && (
                              <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                  {"Please verify captcha"}
                                </small>
                              </div>
                            )}
                          </div>)}
                      </React.Fragment>
                    )}

                    {window.location.host !== 'partners.travelcarma.com' && window.location.host !== 'partners.tourwizonline.com' && isRegistrationForm && page === "signup-hajj" && (
                      <div className="mb-4">
                        <AgentSignUpNew
                          closePopup={() => this.handleRegistrationForm()}
                          {...this.props}
                          getLoginDetails={this.props.getLoginDetails}
                          handleLoginBox={this.props.handleLoginBox}
                          getPortals={this.getPortals}
                          signUpMode="hajj-umrah"
                        />
                      </div>
                    )}

                    {(window.location.host === 'partners.travelcarma.com' || window.location.host === 'partners.tourwizonline.com') && isRegistrationForm && page === "signup-hajj" && (
                      <div className="mb-4">
                        <AgentPartnerSignUpNew
                          closePopup={() => this.handleRegistrationForm()}
                        />
                      </div>
                    )}
                    {page === "signin-hajj" && (
                      <div className="text-center">
                        {!isButtonLoding ?
                          <button
                            className="mt-2 w-100 btn btn-primary btn-signin"
                            type="submit"
                            onClick={this.authUser}
                          >

                            Sign in
                          </button>
                          : <button
                            className="mt-2 w-100 btn btn-primary btn-signin"
                          >
                            <span className="spinner-border spinner-border-sm mr-2"></span>Sign in
                          </button>
                        }
                        <button
                          className="mt-3 mb-2 w-100 btn btn-outline-secondary d-none"
                          onClick={() => this.setJoinTeamVisible(true)}
                        >
                          Join your team
                        </button>

                        <button
                          className="btn btn-sm btn-link text-success mt-2"
                          onClick={() => this.setForgotPasswordVisible()}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                    {Config.codebaseType !== "tourwiz-marketplace" && (
                      <div className="border-top mt-3 pt-4 mb-5">
                        <h5 className="d-block mb-3">
                          {page === "signin-hajj"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        </h5>

                        <button
                          className="w-100 btn btn-outline-primary btn-signup"
                          onClick={() => this.handleRegistrationForm()}
                        >
                          {page === "signin-hajj"
                            ? "Register Here"
                            : "Sign in"}
                        </button>

                        {page === "signin-hajj" && (
                          <div className="mt-4">
                            <h4
                              style={{
                                color: "#5db082",
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
                        )}
                      </div>
                    )}
                  </div>
                </div>


                {page === "signin-hajj" ? (<div className="col-lg-8 signin-img-col">
                  <>
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
                  </>
                  <div className="signin-comingsoon">
                    <div className="signin-comingsoon-img">
                      <img
                        src={ComingSoonGIF}
                        alt=""
                      />
                    </div>
                    <div className="signin-comingsoon-content">
                      <ul className="list-unstyled">
                        <li>Automatic Alerts & Reminders</li>
                        <li>Online Payments</li>
                      </ul>
                    </div>
                  </div>
                </div>) : (<div className="col-lg-8 signup-img-col">
                  <div className={page === "signin-hajj" ? "signin-img signup-img" : "signup-img"}>
                    <img
                      src={page === "signin-hajj" ? SigninBgImg : SignupBgImgStep1}
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
                </div>)}
              </div>
            </div>

            {signupVisible && (
              <SignupWizard
                onSignupComplete={this.setSignupResult}
                onClose={this.setSignUpVisible}
              />
            )}

            {isShowForgotPassword && (
              <ForgotPassword onClose={() => this.setForgotPasswordVisible()} />
            )}

            {joinTeamVisible && (
              <JoinTeam onClose={() => this.setJoinTeamVisible()} />
            )}

            {signupResultVisible && (
              <SignupResult
                onClose={() => this.setSignupResult()}
                signupResult={signupResult}
              />
            )}

            {Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-customer" && Config.codebaseType !== "tourwiz-marketplace" && (
              <React.Fragment>
                <div style={{ marginTop: "-42px" }}>
                  <PublicPageFindus />
                </div>

                <PublicPageWherewe />
                <PublicPageClients />
                <PublicPageFooter />
                <PublicPageCopyrights />
              </React.Fragment>
            )}
          </StickyContainer>
        </div>
        <button id="Awkward"
          className="mt-2 w-100 btn btn-primary btn-signin d-none"
          type="submit"
          onClick={this.authUserAwkward}
        >Awkward</button>
      </React.Fragment>
    );
  }
}

export default LoginScreenMWHajj;
