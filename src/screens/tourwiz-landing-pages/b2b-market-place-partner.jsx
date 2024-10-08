import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import TwBannerSlide1 from "../../assets/images/tw/Slide-3.png";
import SaprSection from "../../assets/images/landing-pg/home-Info-sap.png";
import feature2 from "../../assets/images/tw/Slide-1.png";
import feature3 from "../../assets/images/tw/invoice-module.gif";
import feature4 from "../../assets/images/tw/Slide-2.png";
import feature5 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import tab1 from "../../assets/images/tw/Slide-1.png";
import tab3 from "../../assets/images/tw/Slide-2.png";
import { Link as BrowserRouterLink } from "react-router-dom";
import tab2 from "../../assets/images/tw/Slide-3.png";
import tab4 from "../../assets/images/tw/features-screen-accounting-reconciliation.gif";
import FeaturesScreenCustomerPortal from "../../assets/images/tw/features-screen-customer-portal.gif";
import PublicPageFooterPartner from "../../components/landing-pages/public-page-footer-partner";
import PublicPageClientsPartner from "../../components/landing-pages/public-page-clients-partner";
import PublicPageWherewePartner from "../../components/landing-pages/public-page-wherewe-partner";
import PublicPageAboutUsPartner from "../../components/landing-pages/public-page-aboutus-partner";
import PublicPageAllofthisPartner from "../../components/landing-pages/public-page-allofthis-partner";
import PublicPageFindusPartner from "../../components/landing-pages/public-page-findus-partner";
import PublicPageCopyrightsPartner from "../../components/landing-pages/public-page-copyrights-partner";
import PublicPageHeaderPartner from "../../components/landing-pages/public-page-header-partner";
import HomePageBannerPartner from "../../components/landing-pages/home-page-banner-partner";
import HomePageFeaturesPartner from "../../components/landing-pages/home-page-features-partner";
import HomePageHowitworksPartner from "../../components/landing-pages/home-page-howitworks-partner";
import HomePageWhoIsItPartner from "../../components/landing-pages/home-page-whoisit-partner";
import HomePageReasonsPartner from "../../components/landing-pages/home-page-reasons-partner";
import HomePageVideoPartner from "../../components/landing-pages/home-page-video-partner";
import AgentPartnerLogin from "../../screens/agent-partner-login";

class B2BMarketPlace extends Component {
  state = {
    tabImage: "tab1",
  };
  hamdleChangeSlideImage = (tab) => {
    this.setState({ tabImage: tab });
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.changeTabForEvery4Sec(4);
    this.interval = setInterval(() => this.changeTabForEvery4Sec(4), 20000);
  }
  changeTabForEvery4Sec = (n) => {
    for (let i = 1; i <= n; i++) {
      setTimeout(() => {
        this.setState({ tabImage: "tab" + i })
      }, i * 5000)
    }
  }
  render() {
    const css = `
    html {
      scroll-behavior: smooth;
    }
    header, footer, .agent-login, .landing-pg {
        display: none;
    }
    .marketPlaceTab{
      background: linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 18px 18px 18px 18px;
      text-align:center;
      font-size:18px !important;
      padding:18px !important;
    }
    .marketPlaceTab:hover {
      background: linear-gradient(to right, #891d9b, #fa7438) !important;
      color: #fff;
    }
    `;
    let { tabImage } = this.state;
    return (
      <AgentPartnerLogin
        {...this.props}
        {...this.state}
        handleLoginBox={this.handleLoginBox}
        getLoginDetails={this.getLoginDetails}
        mode="marketPlacePartner"
      />
    );
  }
}

export default B2BMarketPlace;
