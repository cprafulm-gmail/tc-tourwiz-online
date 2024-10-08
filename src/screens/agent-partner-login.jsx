import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import * as Global from "../helpers/global";
import "../assets/css/style-tw-partners.css";
import PublicPageFooterPartner from "../components/landing-pages/public-page-footer-partner";
import PublicPageClientsPartner from "../components/landing-pages/public-page-clients-partner";
import PublicPageWherewePartner from "../components/landing-pages/public-page-wherewe-partner";
import PublicPageAboutUsPartner from "../components/landing-pages/public-page-aboutus-partner";
import PublicPageAllofthisPartner from "../components/landing-pages/public-page-allofthis-partner";
import PublicPageFindusPartner from "../components/landing-pages/public-page-findus-partner";
import PublicPageCopyrightsPartner from "../components/landing-pages/public-page-copyrights-partner";
import PublicPageHeaderPartner from "../components/landing-pages/public-page-header-partner";
import HomePageBannerPartner from "../components/landing-pages/home-page-banner-partner";
import HomePageFeaturesPartner from "../components/landing-pages/home-page-features-partner";
import HomePageHowitworksPartner from "../components/landing-pages/home-page-howitworks-partner";
import HomePageWhoIsItPartner from "../components/landing-pages/home-page-whoisit-partner";
import HomePageReasonsPartner from "../components/landing-pages/home-page-reasons-partner";
import HomePageVideoPartner from "../components/landing-pages/home-page-video-partner";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import CookieConsent, { Cookies } from "react-cookie-consent";
import { Link } from "react-router-dom";
import PublicPageHeader from "../components/landing-pages/public-page-header";
import PublicPageFooter from "../components/landing-pages/public-page-footer";

class AgentPartnerLogin extends Component {
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
      isShowVideo: false,
      isMarketPlacePartnerMode: this.props.mode === "marketPlacePartner" ? true : false,
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

  handleRedirect = (page) => {
    debugger
    const partner = this.state.isMarketPlacePartnerMode ? "-partner" : "";
    this.props.history.push(`/` + page + partner);
  };

  render() {
    let { isMarketPlacePartnerMode } = this.state;
    return (
      <div className="tw-partner" style={{ backgroundColor: "#fff" }}>
        <div className="tw-public-pages tw-home">
          <Helmet>
            <title>
              TourWiz Partner Program | Reach thousands of agents globally
            </title>
            <meta
              name="description"
              content="With the TourWiz partner program, you can promote your deals & products to thousands of travel professionals worldwide"
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
                {isMarketPlacePartnerMode ? <PublicPageHeader /> : <PublicPageHeaderPartner />}
              </div>
              )}
            </Sticky>
            <HomePageBannerPartner
              handleLoginPopup={this.handleRedirect}
              handleVideo={this.handleVideo}
              {...this.props}
            />
            {/* {this.state.isShowVideo && (
          <HomePageVideoPartner handleVideo={this.handleVideo} />
            )*/}
            <HomePageFeaturesPartner handleRedirect={this.handleRedirect} />
            <HomePageWhoIsItPartner handleLoginPopup={this.handleRedirect} />
            <PublicPageAllofthisPartner handleLoginPopup={this.handleRedirect} />
            <HomePageReasonsPartner handleLoginPopup={this.handleRedirect} />
            <HomePageHowitworksPartner handleLoginPopup={this.handleRedirect} />
            <PublicPageAboutUsPartner />
            {/* <PublicPageFindusPartner />
        <PublicPageWherewePartner /> */}
            <PublicPageClientsPartner />
            {isMarketPlacePartnerMode ? <PublicPageFooter /> : <PublicPageFooterPartner />}
            <PublicPageCopyrightsPartner />
            <CookieConsent enableDeclineButton flipButtons
              location="bottom"
              cookieName="acceptCustomerCookie"
              style={{ fontSize: "15px", }}
            >We use cookies to give you the best online experience. By using our website you agree to the use of cookies in accordance with TourWiz <Link to="/terms-of-use" style={{ color: "#f18247" }}>privacy policy</Link>{" "}
              <span style={{ fontSize: "10px", display: "none" }}>This bit of text is smaller :O</span>
            </CookieConsent>
          </StickyContainer>
        </div>
      </div>
    );
  }
}

export default AgentPartnerLogin;
