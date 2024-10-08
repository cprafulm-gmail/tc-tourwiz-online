import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import * as Global from "../helpers/global";
import PublicPageFooter from "../components/landing-pages/public-page-footer";
import PublicPageClients from "../components/landing-pages/public-page-clients";
import PublicPageWherewe from "../components/landing-pages/public-page-wherewe";
import PublicPageFindus from "../components/landing-pages/public-page-findus";
import PublicPageCopyrights from "../components/landing-pages/public-page-copyrights";
import PublicPageHeader from "../components/landing-pages/public-page-header";
import HomePageBanner from "../components/landing-pages/home-page-banner";
import HomePageFeatures from "../components/landing-pages/home-page-features";
import HomePageHowitworks from "../components/landing-pages/home-page-howitworks";
import HomePageReasons from "../components/landing-pages/home-page-reasons";
import HomePageBlog from "../components/landing-pages/home-page-blog";
import HomePageVideo from "../components/landing-pages/home-page-video";
import PublicPageRewardsPoint from "../components/landing-pages/public-page-rewards-point";
import PublicPageNewsLatter from "../components/landing-pages/public-page-newslatter";
import PublicPageTestimonial from "../components/landing-pages/public-page-testimonial";
import PublicPageUSP from "../components/landing-pages/home-page-usp";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import CookieConsent, { Cookies } from "react-cookie-consent";
import $ from "jquery";
import { Link } from "react-router-dom";
import popupImg from "../assets/images/tw/popupImg.jpg";
import PublicPageDMC from "../components/landing-pages/home-page-dmc";
import ModelPopup from "../helpers/model";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAIAssitant from "./package-ai-assistant";
import PackageAIAssitantTrial from "./package-ai-assistant-trial";

class AgentLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false,
      username: "",
      password: "",
      email: "",
      isButtonLoding: false,
      isValidUsername: true,
      isValidPassword: true,
      isValidEmail: true,
      isShowForgotPassword: false,
      showSuccessMsg: false,
      errorMessage: "",
      quotationMode: true,
      isLoginPopup: true,
      agentname: "",
      coll1: false,
      coll2: false,
      matches: window.matchMedia("(min-width: 768px)").matches,
      isShowVideo: true,
      blogPosts: [],
      isOpen: false,
      isShowMoreUSP: false,
      isBrowserValid: false,
      isTrialAI: false,
    };
  }

  handleChangecoll1 = (e) => {
    if (this.state.coll1) this.setState({ coll1: false, coll2: false });
    else this.setState({ coll1: true, coll2: false });
  };

  handleChangecoll2 = (e) => {
    if (this.state.coll2) this.setState({ coll2: false, coll1: false });
    else this.setState({ coll2: true, coll1: false });
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

  forgotPassword = () => {
    let isValidate = true;
    var regxEmail =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.state.username === "") {
      isValidate = false;
      this.setState({
        isValidUsername: !(this.state.username === ""),
        errorMessage: Trans("_rqUserNameEmail"),
      });
    } else {
      isValidate = true;
      this.setState({
        isValidUsername: true,
      });
    }
    if (this.state.email === "") {
      isValidate = false;
      this.setState({
        isValidEmail: false,
        errorMessage: Trans("_rqUserNameEmail"),
      });
    } else if (!regxEmail.test(this.state.email)) {
      isValidate = false;
      this.setState({
        isValidEmail: false,
        errorMessage: Trans("_error_email_email"),
      });
    } else {
      if (isValidate) isValidate = true;
      this.setState({
        isValidEmail: true,
      });
    }
    if (isValidate) {
      this.setState({
        isValidUsername: true,
        isValidEmail: true,
        isButtonLoding: true,
        errorMessage: "",
      });
      var reqURL = "api/v1/user/forgotpassword";
      let ContactInformation = null;
      ContactInformation = {
        Email: this.state.email,
      };

      var reqOBJ = {
        Request: {
          ContactInformation,
          userID: this.state.username,
          CanSendEmail: true,
        },
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.setState({
            isButtonLoding: false,
          });
          if (data.status.code === 0) {
            this.setState({
              errorMessage: Trans("_forgotPasswordMessageEmail"),
              showSuccessMsg: true,
              username: "",
              email: "",
            });
          } else {
            let message =
              Trans("_" + data.status.code) === "_" + data.status.code
                ? data.status.message
                : Trans("_" + data.status.code);
            this.setState({
              errorMessage: message,
              showSuccessMsg: false,
            });
          }
        }.bind(this)
      );
    }
  };

  authUser = () => {
    let isValidate = true;
    if (this.state.username === "" || this.state.password === "") {
      isValidate = false;
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        errorMessage: Trans("_rqUserNamePassword"),
      });
    } else {
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
            LoginName: this.state.username,
            Password: this.state.password,
            ContactInformation: { Email: this.state.username },
          },
        };

        apiRequester(
          reqURL,
          reqOBJ,
          function (data) {
            localStorage.setItem("agentName", this.state.agentname);
            if (data.status.code === 0) {
              if (localStorage.getItem("afUserType") === null)
                localStorage.setItem("afUserType", data.response.afUserType);
              this.setState({ isButtonLoding: false });
              let isPersonateEnabled =
                Global.getEnvironmetKeyValue("isPersonateEnabled");
              if (isPersonateEnabled) {
                this.getPortals();
              } else {
                this.props.handleLoginBox(data);
                !this.state.quotationMode
                  ? this.props.history.push(`/`)
                  : this.props.history.push(`/Dashboard-Tourwiz`);
              }
            } else {
              this.setState({
                isButtonLoding: false,
                errorMessage: Trans("_incorrectUserNamePassword"),
              });
            }
          }.bind(this)
        );
      }
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!this.state.isShowForgotPassword) this.authUser();
      else this.forgotPassword();
    }
  };

  getPortals = () => {
    let reqURL = "api/v1/callcenter/portals";
    let reqOBJ = {
      Request: "",
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
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
      }.bind(this)
    );
  };

  handleSelect = (req) => {
    this.setState({
      isCallCenterLoader: true,
    });

    let reqURL = "api/v1/callcenter/setpersonate";
    let reqOBJ = {
      Request: req.id,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
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
          !this.state.quotationMode
            ? this.props.history.push(`/`)
            : this.props.history.push(`/Dashboard-Tourwiz`);
        });
      }.bind(this)
    );
  };

  handleLoginPopup = () => {
    this.props.history.push(`/login`);
  };

  handleLoginPopupOld = () => {
    this.setState({
      isLoginPopup: !this.state.isLoginPopup,
    });
  };

  handleLoginPopup1 = () => {
    if (this.state.coll1) {
      this.setState({
        coll1: !this.state.coll1,
      });
    } else {
      this.setState({
        coll1: !this.state.coll1,
      });
    }
  };

  handleLoginPopup2 = () => {
    this.setState({
      isLoginPopup: !this.state.isLoginPopup,
    });
  };

  handleVideo = () => {
    this.setState({ isShowVideo: !this.state.isShowVideo });
  };

  handleShowmoreUSP = () => {
    this.setState({ isShowMoreUSP: !this.state.isShowMoreUSP });
  };

  handleRedirect = (page, param) => {
    param === undefined ?
      this.props.history.push(`/` + page) : this.props.history.push(`/` + page + `/` + param);
  };


  ajaxRequesterBlog = () => {
    $.ajax({
      url: "https://www.tourwizonline.com/blog/wp-json/wp/v2/posts",
      type: "GET",
      data: {},
      dataType: "JSON",
    }).done((data) => {
      this.setState({
        blogPosts: data
      });
    });
  };


  componentDidMount() {
    this.handleAssistant();
    this.checkBrowserCompatibility();
    this.ajaxRequesterBlog();
  }
  checkBrowserCompatibility = () => {
    const { detect } = require('detect-browser');
    const browser = detect();
    let browserVersion;
    let browserName;
    switch (browser && browser.name) {
      case 'chrome':
        browserName = browser.name !== '' ? browser.name : '';
        browserVersion = parseInt(browser.version);
        if (browserVersion < 85) {
          this.setState({ isBrowserValid: true });
        }
        else {
          this.setState({ isBrowserValid: false });
        }
        console.log('supported');
        break;
      case 'firefox':
        browserName = browser.name !== '' ? browser.name : '';
        browserVersion = browser.version !== '' ? browser.version.split('.')[0] : '';
        if (browserVersion < 85) {
          this.setState({ isBrowserValid: true });
        }
        else {
          this.setState({ isBrowserValid: false });
        }
        console.log('supported');
        break;
      case 'edge':
        browserName = browser.name !== '' ? browser.name : '';
        browserVersion = browser.version !== '' ? browser.version.split('.')[0] : '';
        if (browserVersion < 85) {
          this.setState({ isBrowserValid: true });
        }
        else {
          this.setState({ isBrowserValid: false });
        }
        console.log('kinda ok');
        break;

      default:
        console.log('not supported');
        break;
    }
  }
  togglePopup = () => {
    this.setState({ isOpen: false });
  }
  handleHidePopup = () => {
    this.setState({
      isBrowserValid: !this.state.isBrowserValid,
    });
  };
  handleAssistant = () => {
    this.setState({ isTrialAI: !this.state.isTrialAI });
  }
  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }
  /* Popup style */
.popup-box {
  position: fixed;
  background: rgba(0,0,0,0.6);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
}
 
.box {
  position: relative;
  width: 40%;
  margin: 0 auto;
  height: auto;
  max-height: 70vh;
  margin-top: calc(110vh - 85vh - 20px);
  background: #fff;
  border-radius: 4px;
  padding: 0px;
  /*border: 1px solid #999;*/
  overflow: auto;
}
.popupFadeIn {  
  animation: fadein 2s;
  -moz-animation: fadein 2s; /* Firefox */
  -webkit-animation: fadein 2s; /* Safari and Chrome */
  -o-animation: fadein 2s; /* Opera */
}
.popupFadeOut {  
  display: none;
  animation: fadeout 2s;
  -moz-animation: fadeout 2s; /* Firefox */
  -webkit-animation: fadeout 2s; /* Safari and Chrome */
  -o-animation: fadeout 2s; /* Opera */
}
@keyframes fadein {
  from {
      opacity:0;
  }
  to {
      opacity:1;
  }
}
@-moz-keyframes fadein { /* Firefox */
  from {
      opacity:0;
  }
  to {
      opacity:1;
  }
}
@-webkit-keyframes fadein { /* Safari and Chrome */
  from {
      opacity:0;
  }
  to {
      opacity:1;
  }
}
@-o-keyframes fadein { /* Opera */
  from {
      opacity:0;
  }
  to {
      opacity: 1;
  }
}
/**/

@keyframes fadeout {
  from {
      opacity:1;
  }
  to {
      opacity:0;
  }
}
@-moz-keyframes fadeout { /* Firefox */
  from {
      opacity:1;
  }
  to {
      opacity:0;
  }
}
@-webkit-keyframes fadeout { /* Safari and Chrome */
  from {
      opacity:1;
  }
  to {
      opacity:0;
  }
}
@-o-keyframes fadeout { /* Opera */
  from {
      opacity:1;
  }
  to {
      opacity:0;
  }
}
.close-icon {
  content: 'x';
  cursor: pointer;
  position: fixed;
  right: calc(32% - 35px);
  top: calc(110vh - 85vh - 33px);
  background: #ededed;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  line-height: 20px;
  text-align: center;
  border: 1px solid #999;
  font-size: 20px;
}

.swiper-button-next, .swiper-button-prev {
  display: none !important;
} 

@media (max-width: 575px) { 
  
.box {
  width: 85%;
}
.close-icon {  
  right: calc(15% - 35px);
}
}`;

    return (
      <div className="tw-public-pages tw-home">
        <style>{css}</style>

        <Helmet>
          <title>
            FREE Itinerary Builder For Travel Agents | Tourwiz - Home
          </title>
          <meta
            name="description"
            content="TourWiz offers you a FREE travel itinerary builder at lightning-fast speed. Simple and easy-to-use for Travel Agents Itinerary Builder. Manage leads, quotations, invoices, suppliers, customers and the entire process with Tourwiz."
          />
        </Helmet>

        <div className={this.state.isOpen ? "popup-box popupFadeIn" : "popup-box popupFadeOut"}>
          <div className="box">
            <span className="close-icon" onClick={this.togglePopup}>x</span>
            <img src={popupImg} alt="" style={{ width: "100%" }} />
          </div>
        </div>
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
          <HomePageBanner
            handleLoginPopup={this.handleRedirect}
            handleVideo={this.handleVideo}
            handleRedirect={this.handleRedirect}
          />
          {/* {this.state.isShowVideo && (
            <HomePageVideo handleVideo={this.handleVideo} />
          )} */}

          {/* <PublicPageDMC handleRedirect={this.handleRedirect} /> */}
          <HomePageFeatures handleRedirect={this.handleRedirect} />
          <HomePageHowitworks />
          <PublicPageUSP  {...this.state} handleShowmoreUSP={this.handleShowmoreUSP} />
          <HomePageReasons handleLoginPopup={this.handleRedirect} />
          <PublicPageRewardsPoint handleLoginPopup={this.handleRedirect} />
          <PublicPageTestimonial handleLoginPopup={this.handleRedirect} />
          <PublicPageNewsLatter {...this.props} />
          <HomePageBlog blogPosts={this.state.blogPosts} />
          <PublicPageFindus />
          <PublicPageWherewe />
          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />
          <CookieConsent enableDeclineButton flipButtons
            location="bottom"
            cookieName="acceptCustomerCookie"
            buttonText="Accept"
            declineButtonText="Decline"
            style={{ fontSize: "15px", }}
          >We use cookies to give you the best online experience. By using our website you agree to the use of cookies in accordance with TourWiz <Link to="/terms-of-use" style={{ color: "#f18247" }}>privacy policy</Link>{" "}
            <span style={{ fontSize: "10px", display: "none" }}>This bit of text is smaller :O</span>
          </CookieConsent>
        </StickyContainer>
        {
          this.state.isBrowserValid &&
          <ModelPopup
            header="WARNING"
            content={
              <React.Fragment>
                <h6>Your Current Browser Is Outdated!</h6>
              </React.Fragment>
            }
            handleHide={this.handleHidePopup} />
        }
        {
          this.state.isTrialAI &&
          localStorage.getItem("showTourwizAIPopup") === null &&
          <AssistantModelPopup
            content={
              <PackageAIAssitantTrial
                handleHide={this.handleAssistant}
                promptMode="Itinerary"
                trialMode={true}
              />}
            sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
            handleHide={this.handleAssistant}
          />
        }
      </div>
    );
  }
}

export default AgentLogin;
