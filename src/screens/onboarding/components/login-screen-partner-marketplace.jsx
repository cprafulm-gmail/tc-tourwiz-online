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
import SignupBgImgStep1 from "../../../assets/images/tw/partner-sign-up-image.jpg";
import SigninBgImg from "../../../assets/images/tw/partner-sign-in-image.jpg";
import AgentPartnerSignUpNew from "../../../components/onboarding/agent-partner-signup-new";
import { StickyContainer, Sticky } from "react-sticky";
import * as encrypt from "../../../helpers/encrypto";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../../config";


const recaptchaRef = React.createRef();

class LoginScreenPartnerMW extends Component {
  state = {
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
  };

  onChangeCaptcha = (value) => {
    this.setState({
      captcha: value,
      isValidCaptcha: true,
    });
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
    } else if (Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && recaptchaRef.current.getValue() === "") {
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

        apiRequester(reqURL, reqOBJ, (data) => {
          localStorage.setItem("agentName", this.state.agentname);
          if (data.status.code === 0) {
            if (localStorage.getItem("afUserType") === null)
              localStorage.setItem("afUserType", data.response.afUserType);
            //this.setState({ isButtonLoding: false });
            let isPersonateEnabled =
              Global.getEnvironmetKeyValue("isPersonateEnabled");
            if (isPersonateEnabled) {
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
      localStorage.setItem("environment", JSON.stringify(data.response));
      localStorage.removeItem("cartLocalId");
      this.setState({
        bookingFor: req.details.firstName,
        isCallCenterDetails: !this.state.isCallCenterDetails,
      });
      this.props.getLoginDetails((data) => {
        this.props.handleLoginBox(data);
        this.setState({
          isButtonLoding: false
        });
        !this.state.quotationMode
          ? this.props.history.push(`/`)
          : this.props.history.push(`/Dashboard-Tourwiz`);
      });
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
    let page = this.state.page === "signin" ? "signup-partner" : "signin-partner";

    this.props.history.push("/" + page);

    this.setState({
      isRegistrationForm: this.state.page === "signin" ? false : true,
      page,
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    let page = this.props.location.pathname === "/signin-partner" ? "signin" : "signup";

    this.setState({
      page,
      isRegistrationForm: page === "signin" ? false : true,
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
  @media (max-width: 768px){
  .tw-public-pages .tw-clients {
    margin-top: 0px !important;
  }
}`;
    return (
      <React.Fragment>
        <div className="tw-public-pages tw-login-page">
          <style>{css}</style>

          {page === "signin" ? (
            <Helmet>
              <title>Sign in to your account | TourWiz</title>
              <meta
                name="description"
                content="Sign in to your TourWiz account anywhere, anytime to manage inquiries, build itineraries, track your bookings and do much more on one platform"
              />
            </Helmet>
          ) : (
            <Helmet>
              <title>Sign up as a partner | TourWiz</title>
              <meta
                name="description"
                content="Sign up for TourWiz - A Virtual Companion for Travel professionals that gives you an Itinerary Builder, Travel CRM, Accounting & Reports in one online solution"
              />
            </Helmet>
          )}

          <StickyContainer>
            <Sticky>
              {({ style }) => (<div
                className={
                  "hight-z-index mod-search-area"
                }
                style={{ ...style, transform: "inherit" }}
              >           <PublicPageHeader />

              </div>
              )}
            </Sticky>

            <div className="container position-relative onboarding-main-page">
              <div className="row">
                <div className="col-lg-4">
                  <div className="pt-4">
                    {page === "signin" ? (
                      <h3
                        className="mt-3 mb-3 border-bottom pb-3"
                        style={{ color: "#f18247", fontSize: "24px" }}
                      >
                        Please sign in to continue
                      </h3>
                    ) : (
                      <div className="mt-3 mb-3 pb-2">
                        <h3
                          className="mt-3 mb-3 border-bottom pb-3"
                          style={{ color: "#f18247", fontSize: "24px" }}
                        >
                          Sign up as a partner
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
                    )}

                    {page === "signin" && (
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

                    {page === "signup" && (
                      <div className="mb-4">
                        <AgentSignUpNew
                          closePopup={() => this.handleRegistrationForm()}
                        />
                      </div>
                    )}

                    {(window.location.host === 'localhost:3001' || window.location.host === 'partners.travelcarma.com' || window.location.host === 'partners.tourwizonline.com' || window.location.host === 'preprod-partners.tourwizonline.com') && isRegistrationForm && page === "signup" && (
                      <div className="mb-4">
                        <AgentPartnerSignUpNew
                          closePopup={() => this.handleRegistrationForm()}
                        />
                      </div>
                    )}

                    {page === "signin" && (
                      <div className="text-center">
                        <button
                          className="mt-2 w-100 btn btn-primary btn-signin"
                          type="submit"
                          onClick={this.authUser}
                        >
                          {isButtonLoding && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                          )}
                          Sign in
                        </button>

                        <button
                          className="mt-3 mb-2 w-100 btn btn-outline-secondary d-none"
                          onClick={() => this.setJoinTeamVisible(true)}
                        >
                          Join your team
                        </button>

                        <button
                          className="btn btn-sm btn-link text-primary mt-2"
                          onClick={() => this.setForgotPasswordVisible()}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <div className="border-top mt-3 pt-4 mb-5">
                      <h5 className="d-block mb-3">
                        {page === "signin"
                          ? "Don't have an account?"
                          : "Already have an account?"}
                      </h5>

                      <button
                        className="w-100 btn btn-outline-primary btn-signup"
                        onClick={() => this.handleRegistrationForm()}
                      >
                        {page === "signin"
                          ? "Sign up for to be a Partner"
                          : "Sign in"}
                      </button>

                      {page === "signin" && (
                        <div className="mt-4">
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
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 signup-img-col">
                  <div className={page === "signin" ? "signup-img partner-signin-img" : "signup-img partner-signup-img"}>
                    <img
                      src={page === "signin" ? SigninBgImg : SignupBgImgStep1}
                      alt=""
                    />
                  </div>

                  <div className="signup-info">
                    <div>
                      <h2>Reach & Attract a Global Audience</h2>
                      <ul className="list-unstyled">
                        <li>Direct connect with thousands of agents worldwide</li>
                        <li>Wider exposure for your brand and products</li>
                        <li>Drive more traffic to your website</li>
                        <li>Generate more B2B inquiries and bookings</li>
                        <li>Cut down your marketing & advertising costs</li>
                      </ul>
                      <h5 className="mt-4" style={{ color: "#ffd500" }}>Plus access to valuable data to generate even more business</h5>
                    </div>
                  </div>
                </div>
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

            <div style={{ marginTop: "-42px" }}>
              <PublicPageFindus />
            </div>
            <PublicPageWherewe />
            <PublicPageClients />
            <PublicPageFooter />
            <PublicPageCopyrights />
          </StickyContainer>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginScreenPartnerMW;
