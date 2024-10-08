import React, { Component } from "react";
import { apiRequester } from "../../../services/requester";
import { Trans } from "../../../helpers/translate";
import * as Global from "../../../helpers/global";
import styled from "styled-components"; import backgroundImage from "../images/travel-world.jpg";
import SignupWizard from "./signup-wizard";
import ForgotPassword from "./forgot-password";
import JoinTeam from "./join-team";
import SignupResult from "./signup-result";
import PublicPageHeader from "../../../components/landing-pages/public-page-header-tripcentre";
import PublicPageFindus from "../../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../../components/landing-pages/public-page-footer-tripcentre";
import PublicPageCopyrights from "../../../components/landing-pages/public-page-copyrights";
import { Helmet } from "react-helmet";
import AgentSignUpNew from "../../../components/onboarding/agent-signup-new-tripcentre";
import SignupBgImgStep1 from "../../../assets/images/tw/sign-up-page-bg-step1.png";
import SigninBgImg from "../../../assets/images/customer-portal/template-images/Signin-step.png";
import SignupBgImg from "../../../assets/images/customer-portal/template-images/Signup-step.png";
import SigninBgImg1 from "../../../assets/images/customer-portal/template-images/4-layers.png";
import AgentPartnerSignUpNew from "../../../components/onboarding/agent-partner-signup-new";
import CMSCopyrights from "../../../components/cms/AF-005/cms-copywrite";
import { StickyContainer, Sticky } from "react-sticky";
import * as encrypt from "../../../helpers/encrypto";
import ReCAPTCHA from "react-google-recaptcha";
import Config from "../../../config";
import flight from "../../../assets/images/customer-portal/template-images/our-services-flight.png";
import hotel from "../../../assets/images/customer-portal/template-images/our-services-hotel.png";
import holiday from "../../../assets/images/customer-portal/template-images/our-services-holiday-package.png";
import life from "../../../assets/images/customer-portal/template-images/our-services-life.png";
import transfers from "../../../assets/images/customer-portal/template-images/our-services-transfers.png";
import visas from "../../../assets/images/customer-portal/template-images/our-services-visas.png";
import cruises from "../../../assets/images/customer-portal/template-images/our-services-cruises.png";
import attractions from "../../../assets/images/customer-portal/template-images/our-services-attractions.png";


const recaptchaRef = React.createRef();

class LoginScreenMW extends Component {
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
    IsFromAutoPopulated: process.env.NODE_ENV === "development" ? true : false,
  };

  onChangeCaptcha = (value) => {
    this.setState({
      captcha: value,
      isValidCaptcha: true,
    });
  }
  authUserAwkward = () => {
    this.setState({ IsFromAutoPopulated: !this.state.IsFromAutoPopulated });
  }
  authUser = async () => {
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
        var data = await this.getLogin();
        if (data.status.code === 0) {
          var res = await this.props.handleLoginEvent();
          if (res === "error") {
            recaptchaRef.current.reset();
            this.setState({
              isButtonLoding: false,
              isValidCaptcha: true,
              errorMessage: Trans("_incorrectUserNamePassword"),
            });
          }
          else {
            this.props.isRedirectToRequestedURL
              ? window.location.href.replace(
                window.location.origin + "/#",
                ""
              )
              : !this.state.quotationMode
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
      }
    }
  };
  getLogin = async () => {
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
    return new Promise(function (resolve, reject) {
      apiRequester(reqURL, reqOBJ, (data) => {
        resolve(data);
      });
    });
  }
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
    let page = this.state.page === "signin" ? "signup" : "signin";

    this.props.history.push("/" + page);

    this.setState({
      isRegistrationForm: this.state.page === "signin" ? false : true,
      page,
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    let page = this.props.location.pathname === "/signin" ? "signin" : "signup";
    page = this.props.isRedirectToRequestedURL ? "signin" : page;
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
              <title>Register Here | TourWiz</title>
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
              >
                {Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" && <PublicPageHeader />}
              </div>
              )}
            </Sticky>

            <div className="container position-relative onboarding-main-page">
              <div className="row">
                <div className="col-lg-12">{page === "signin" ? (
                  <h3
                    className="mt-5 mb-3 text-uppercase text-dark font-weight-bold border-3 border-warning pb-3"
                    style={{ color: "#f18247", fontSize: "24px", borderBottom: "3px solid #dee2e6" }}
                  >
                    Login Now! To avail the fabulous deals
                  </h3>
                ) : (
                  <div className="mt-3 mb-3 pb-2">
                    <h3
                      className="mt-5 mb-3 text-uppercase text-dark font-weight-bold border-3 border-warning pb-3"
                      style={{ color: "#f18247", fontSize: "24px", borderBottom: "3px solid #dee2e6" }}
                    >
                      Register Now! To  grab the Best Deals
                    </h3>
                  </div>
                )}</div>
                <div className="col-lg-6">
                  <div className="pt-4">
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
                          {/* <label htmlFor="username">Email address</label> */}
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
                          {/* <label htmlFor="password">Password</label> */}
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

                    {window.location.host !== 'partners.travelcarma.com' && window.location.host !== 'partners.tourwizonline.com' && isRegistrationForm && page === "signup" && (
                      <div className="mb-4">
                        <AgentSignUpNew  {...this.props}
                          closePopup={() => this.handleRegistrationForm()}
                        />
                      </div>
                    )}

                    {(window.location.host === 'partners.travelcarma.com' || window.location.host === 'partners.tourwizonline.com') && isRegistrationForm && page === "signup" && (
                      <div className="mb-4">
                        <AgentPartnerSignUpNew
                          closePopup={() => this.handleRegistrationForm()}
                        />
                      </div>
                    )}
                    {page === "signin" && (
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
                          className="btn btn-sm btn-link text-dark mt-2"
                          onClick={() => this.setForgotPasswordVisible()}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    {window.location.hostname === "agents.thetripcenter.com" && (
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
                            ? "Register Here"
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
                      </div>)}
                  </div>
                </div>

                <div className="col-lg-6 signup-img-col mh-auto mb-5">

                  <div className="signup-info position-relative text-center bg-white d-block">
                    <img
                      className={page === "signin" ? "w-100" : "w-100 p-3"}
                      src={page === "signin" ? SigninBgImg : SignupBgImg}
                      alt=""
                    />
                    {/* <img
                      src={page === "signin" ? SigninBgImg1 : SigninBgImg1}
                      alt=""
                    /> */}

                    <div className="cp-signin-our-service pt-0 pb-2">
                      <div className="container">
                        <div className="row">
                          <div className="col-lg-12">
                            <div class="d-flex align-items-center justify-content-center">
                              <div class="text-center">
                                <div className="d-flex justify-content-center our-services-all-items">
                                  {page !== "signin" ? (
                                    <React.Fragment>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon border-0" style={{ height: "50px" }}>
                                          <img src={flight} alt="" style={{ width: "45px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Flights</span>
                                        </div>
                                      </div>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon border-0" style={{ height: "50px" }}>
                                          <img src={hotel} alt="" style={{ width: "48px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Hotels</span>
                                        </div>
                                      </div>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon border-0" style={{ height: "50px" }}>
                                          <img src={holiday} alt="" style={{ width: "34px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Holiday Packages</span>
                                        </div>
                                      </div></React.Fragment>) : (
                                    <React.Fragment>
                                      {/* <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={attractions} alt="" />
                      </div>
                      <div className="our-services-name text-dark">
                        <span>Attractions</span>
                      </div>
                    </div> */}
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon">
                                          <img src={transfers} alt="" style={{ width: "35px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Transfers</span>
                                        </div>
                                      </div>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon">
                                          <img src={cruises} alt="" style={{ width: "50px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Cruises</span>
                                        </div>
                                      </div>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon">
                                          <img src={visas} alt="" style={{ width: "37px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Visas</span>
                                        </div>
                                      </div>
                                      <div className="our-services-item ml-2 mr-2">
                                        <div className="our-services-icon">
                                          <img src={life} alt="" style={{ width: "40px" }} />
                                        </div>
                                        <div className="our-services-name text-dark">
                                          <span>Insurance</span>
                                        </div>
                                      </div>
                                    </React.Fragment>)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button id="Awkward"
                      className="mt-2 w-100 btn btn-primary btn-signin d-none"
                      type="submit"
                      onClick={this.authUserAwkward}
                    >Awkward</button>
                    {/* <div>
                      <h2>Say Goodbye to Spreadsheets!</h2>
                      <ul className="list-unstyled">
                        <li>Capture & track all your inquiries at one place</li>
                        <li>Build itineraries with global content in minutes</li>
                        <li>Generate personalized quotes & invoices</li>
                        <li>Record bookings and track payments & receipts</li>
                        <li>Get in-depth accounting & business reports</li>
                      </ul>
                      <h5 className="mt-4" style={{ color: "#ffd500" }}>Plus access to exclusive offers from our partners</h5>
                    </div> */}
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

            {Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" && <React.Fragment> <div style={{ marginTop: "-42px" }}>
              <PublicPageFindus />
            </div>

              <PublicPageWherewe />
              <PublicPageClients />
              <PublicPageFooter />
              <PublicPageCopyrights />
            </React.Fragment>}
          </StickyContainer>
        </div>
        <CMSCopyrights {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default LoginScreenMW;
