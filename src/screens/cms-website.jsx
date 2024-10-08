import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import MessageBar from '../components/admin/message-bar';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
var __html = require("../assets/templates/cms-signup-email.html");

class CMSWebsite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portalURL: "",
      isCMSPortalCreated: false,
      isLoading: true,
      ownSubDomainName: '',
      isAvailableSubDomain: null,
      availableSubDomainResponseStatus: null,
      isLoading_DefaultSubdomain: false,
      isLoading_Custom_Subdomain: false,
      isLoading_Custom_Subdomain_process: false,
      Custom_Subdomain_process_Message: "",
      customDomainError: "",
      isshowauthorizepopup: false,
      showPopup: false,
      successfailuremsg: "",
    };
  }

  closePopup = () => {
    window.location.reload();
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };
  setDataToState = (res) => {
    this.setState({
      isLoading_Custom_Subdomain: false,
      ownSubDomainName: "",
      isLoading_Custom_Subdomain_process: false,
      Custom_Subdomain_process_Message: res.response === "success" ? "Custom domain updated successfully." : "Custom domain update failed.",
      isAvailableSubDomain: null
    }, () => this.getBasicData());
  }
  proceedUpdateCustomSubDomain = () => {

    this.setState({ isLoading_Custom_Subdomain_process: true });
    this.proceedVerifySubDomain(function (data, state) {
      var reqURL = "tw/portal/updateurl";
      let reqOBJ = {
        CurrentportalUrl: state.portalURL.toLowerCase().replace("https://", "http://"),
        NewportalUrl: "http://" + state.ownSubDomainName.toLowerCase() + process.env.REACT_APP_B2CCMSADMINDOMAIN
      }
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        (data) => {
          this.setDataToState(data);
        }, 'POST');
    }.bind(this));
  }

  proceedVerifySubDomain = (callback) => {
    let subDomainName = this.state.ownSubDomainName.toLowerCase();
    if (!subDomainName) {
      this.setState({ customDomainError: "Subdomain should not be blank.", isAvailableSubDomain: null });
    }
    else if ("https://" + subDomainName + process.env.REACT_APP_B2CCMSADMINDOMAIN.toLowerCase() === this.state.portalURL.toLowerCase()) {
      this.setState({ customDomainError: "Subdomain should not same as Website URL.", isAvailableSubDomain: null });
    }
    else {
      this.setState({ isLoading_Custom_Subdomain: true });
      var reqURL = "tw/portal/availability";
      reqURL += "?portalurl=http://" + subDomainName + process.env.REACT_APP_B2CCMSADMINDOMAIN;
      apiRequester_unified_api(
        reqURL,
        null,
        (data) => {
          if (!data.response && typeof callback === 'function')
            callback(data, this.state);
          else
            this.setState({ isLoading_Custom_Subdomain: false, isAvailableSubDomain: !data.response });
        }, 'GET');
    }
  }

  handleOwnSubDomain = (e) => {
    const output = /^[a-zA-Z0-9.-]+$/g.test(e.target.value);
    if (output)
      this.setState({ customDomainError: false, isAvailableSubDomain: null, ownSubDomainName: e.target.value.toLowerCase() });
  }

  proceedDefaultSubDomain = () => {
    this.setState({ isLoading_DefaultSubdomain: true });
    var reqURL = "tw/cmsportal/setup";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        this.setState({ showPopup: data?.result === "success", isLoading_DefaultSubdomain: false, availableSubDomainResponseStatus: data?.result === "success", successfailuremsg: data?.result === "success" ? "Website domain successfully created." : "Ooops! Please try after sometime." });
        if (data?.result === "success") {

        }
      }, 'GET');
  }

  getCurrentSubscriptionDetails = () => {
    let pricedetails = [];
    var reqURL =
      "tw/subscription/details";
    var reqOBJ = {};
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response.length > 0) {
          this.setState({
            currentPlanendName: data.response[0].planName,
            currentPlanDuration: data.response[0].planDuration
          });
        }
      },
      "GET"
    );
  };

  componentDidMount() {
    this.getCurrentSubscriptionDetails();
    this.getBasicData();
  }

  getBasicData = () => {

    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        this.setState({ isLoading: false, portalURL: data.response[0].customHomeURL.toLowerCase().replace("http://", "https://"), isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true" });
      }, 'GET');
  }

  render() {
    var template = { __html: __html };
    if (this.state.portalURL) {

      template.__html = template.__html.replace('{{firstName}}', this.props.userInfo.userDisplayName);
      template.__html = template.__html.replace('{{email}}', this.props.userInfo.contactInformation.email);

      template.__html = template.__html.replace('{{url}}', this.state.portalURL);
      let userName = this.state.portalURL.split('.')[0].replace('http://', '').replace('https://', '');
      template.__html = template.__html.replace('{{userName}}', userName);
      template.__html = template.__html.replace('{{userName1}}', userName);
      template.__html = template.__html.replace('{{password}}', userName);
    }
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {this.props.location.pathname.indexOf("/ChangeDomain") > -1 ? "Change Domain Your Website" : "Claim Your Website"}
            </title>
          </Helmet>
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {this.props.location.pathname.indexOf("/ChangeDomain") > -1 ? "Change Domain Your Website" : "Claim Your Website"}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 hideMenu">
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div>
            <div className="col-lg-9 mt-0">
              <div className="container">

                <div className="row">
                  <div className="col-lg-12">
                    {/* <h4>Choose Website Domain</h4> */}
                    {/* <p className="mt-4">
                      We offer complete flexibility when it comes to the domain for your website.
                      Choose your preferred option to get started. You can always switch later.
                    </p> */}
                    <p className="mt-0">
                      Are you tired of missing out on potential business because you don’t
                      have a user-friendly online website with lots of content
                      for your customers? Look no further than TourWiz! Get yourself TourWiz’s oneclick setup website pre-loaded with 700+ itineraries and embedded with marketing tools. Just like major OTA platforms. Compete with the best!!!!
                      We have many options :
                    </p>
                  </div>
                  {!this.state.isCMSPortalCreated &&
                    <div class="card m-2 text-justify d-none">
                      <div class="card-header">
                        <b className="text-secondary">Host Website on your domain</b>
                      </div>
                      <div class="card-body">
                        <p class="card-text">B2C Customer Landing page allows customers an online interface where they can log in and access Marketplace deals, Itineraries, Packages, Proposals, Bookings, as well as check ledger against Invoices.</p>
                        Website URL :  <a className={"badge btn btn-" + "success mb-2"} target="_blank" href={"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.portalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '')}>
                          {"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.portalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '')}</a><br />
                      </div>
                    </div>
                  }
                  <div class="card m-2 text-justify d-none">
                    <div class="card-header">
                      <b className="text-secondary">Already have a website but need a microsite for content</b>
                    </div>
                    <div class="card-body">
                      <p class="card-text">
                        Choose this option if you already have a website but would still like to get the microsite for the pre-loaded itineraries and marketing tools. Please create a subdomain to your main domain like mymicrosite.mydomain.com, Provide us the sub-domain information at
                        {/* <h6 className="text-secondary mb-3 mt-2"> */}
                        <a
                          href="mailto:sales@tourwizonline.com"
                          className="text-primary"
                        >
                          {" "}sales@tourwizonline.com
                        </a>
                        {/* </h6> */}
                      </p>
                      {!this.state.isCMSPortalCreated && (this.state.currentPlanendName === "Trial" || this.state.currentPlanendName === "Basic") &&
                        <button
                          onClick={() =>
                            AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-customsubdomain-proceed")
                              ? this.proceedUpdateCustomSubDomain()
                              : this.setState({ isshowauthorizepopup: true })
                          }
                          className="btn btn-primary mt-1"
                        >
                          Claim your website
                        </button>
                      }
                    </div>
                  </div>

                  <div class="card m-2 text-justify">
                    <div class="card-header">
                      <b className="text-secondary">Don’t have a domain or already have a website but still want the Microsite</b>
                    </div>
                    <div class="card-body">
                      <p><b>Option 1</b></p>
                      <p class="card-text">
                      Choose this option if you don’t have your own domain, or already have a website and do not want to disturb it , we will assign a default subdomain to your website - [company name].yourtripplans.com. You can continue with that till you decide on a better name or get your own domain.
                      </p>
                      <div class="card-body">

                        Website URL : {!this.state.isCMSPortalCreated ? <span class={"p-1 mb-2 badge badge-" + (this.state.isCMSPortalCreated ? "success" : "secondary")}>{this.state.portalURL}{" "}</span>
                          : <a className={"btn btn-" + (this.state.isCMSPortalCreated ? "success badge p-2 mb-2" : "secondary")} target="_blank" href={this.state.portalURL}>{this.state.portalURL}</a>}<br />
                        {!this.state.isLoading && !this.state.isCMSPortalCreated && this.state.availableSubDomainResponseStatus !== true &&
                          <React.Fragment>
                            {this.state.isLoading_DefaultSubdomain
                              ? <button className="btn btn-primary">
                                <span className="spinner-border spinner-border-sm mr-2"></span> Proceed
                              </button>
                              : <button onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-proceed") ? this.proceedDefaultSubDomain() : this.setState({ isshowauthorizepopup: true })} className="btn btn-primary">
                                Proceed
                              </button>}
                          </React.Fragment>}
                        {this.state.availableSubDomainResponseStatus === true &&
                          <div className="pb-2 mt-1">
                            <small class="alert alert-success p-1" role="alert">Website domain successfully created.</small>
                          </div>}
                        {this.state.availableSubDomainResponseStatus === false &&
                          <div className="pb-2 mt-1">
                            <small class="alert alert-danger p-1" role="alert">Ooops! Please try after sometime.</small>
                          </div>}
                      </div>
                      <p><b>Option 2</b></p>
                      <p class="card-text">
                        Don’t like the default sub-domain, no problem you can choose your own subdomain. Eg. [name of your choice].yourtripplans.com (Subject to availability)
                      </p>
                      {!this.state.isCMSPortalCreated &&
                        <b className="card-text text-primary">
                          To Change domain, first proceed with Default Subdomain
                        </b>}
                      {this.state.isCMSPortalCreated &&
                        <React.Fragment>
                          <div class="col-lg-6 input-group mb-3 p-0">
                            <div class="input-group-prepend">
                              <span class="input-group-text">https://</span>
                            </div>
                            <input type="text" maxlength="30" value={this.state.ownSubDomainName} onChange={(e) => this.handleOwnSubDomain(e)} class="form-control text-lowercase" placeholder="Your own subdomain" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div class="input-group-append">
                              <span class="input-group-text" id="basic-addon2">{process.env.REACT_APP_B2CCMSADMINDOMAIN}</span>
                            </div>
                          </div>
                          {this.state.customDomainError &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-danger p-1" role="alert">{this.state.customDomainError}</small>
                            </div>}
                          {this.state.isAvailableSubDomain === true &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-success p-1" role="alert">Selected subdomain available</small>
                            </div>}

                          {this.state.Custom_Subdomain_process_Message &&
                            <div className="pb-2 mt-1">
                              <small class={"alert alert-" + (this.state.Custom_Subdomain_process_Message.indexOf('failed') === -1 ? "success" : "danger") + " p-1"} role="alert">{this.state.Custom_Subdomain_process_Message}</small>
                            </div>}
                          {this.state.isAvailableSubDomain === false &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-danger p-1" role="alert">Selected subdomain not available. Please try another subdomain.</small>
                            </div>}

                          {this.state.isLoading_Custom_Subdomain && !this.state.isLoading_Custom_Subdomain_process &&
                            < button className="btn btn-primary mr-2">
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              Check Availability
                            </button>}
                          {!this.state.isLoading_Custom_Subdomain &&
                            <button onClick={this.proceedVerifySubDomain} className="btn btn-primary mr-2">
                              Check Availability
                            </button>}
                          {this.state.isAvailableSubDomain && this.state.isLoading_Custom_Subdomain &&
                            <button className="btn btn-primary">
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              Proceed
                            </button>
                          }
                          {this.state.isAvailableSubDomain && !this.state.isLoading_Custom_Subdomain &&
                            <button
                              onClick={() =>
                                AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-customsubdomain-proceed")
                                  ? this.proceedUpdateCustomSubDomain()
                                  : this.setState({ isshowauthorizepopup: true })
                              }
                              className="btn btn-primary"
                            >
                              Proceed
                            </button>
                          }
                        </React.Fragment>
                      }
                      <p class="card-text">
                        We offer complete flexibility when it comes to the domain name for your website. Choose your preferred option to get started. You can always switch later.
                      </p>
                      <p class="card-text">
                        Upgrade your marketing strategy today. Invest in the TourWiz Website solution and enjoy a surge in business and customer retention! Whatever it takes to help we have a solution. Contact us for more info:
                      </p>
                      {/* {!this.state.isCMSPortalCreated &&
                        <button
                          onClick={() =>
                            AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-customsubdomain-proceed")
                              ? this.proceedUpdateCustomSubDomain()
                              : this.setState({ isshowauthorizepopup: true })
                          }
                          className="btn btn-primary mt-1"
                        >
                          Claim your website
                        </button>
                      } */}
                    </div>
                  </div>

                  <div class="card m-2 text-justify">
                    <div class="card-header">
                      <b className="text-secondary">Host Website on your domain</b>
                    </div>
                    <div class="card-body">
                      <p class="card-text">
                        You already have a domain and would like us to host it there
                        All you need to do is provide us with the information.
                        This option will allow us to map your website to your own domain.
                        <h6 className="text-secondary mb-3 mt-2">If you need any assistance with your custom domain setup, please send us a message <Link to="contact-us" target="_blank" className="text-primary">here</Link> or at <a
                          href="mailto:sales@tourwizonline.com"
                          className="text-primary"
                        >
                          sales@tourwizonline.com
                        </a></h6>
                        {!this.state.isCMSPortalCreated && (this.state.currentPlanendName === "Trial" || this.state.currentPlanendName === "Basic") &&
                          <button
                            onClick={() =>
                              AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-customsubdomain-proceed")
                                ? this.proceedUpdateCustomSubDomain()
                                : this.setState({ isshowauthorizepopup: true })
                            }
                            className="btn btn-primary mt-1"
                          >
                            Claim your website
                          </button>
                        }
                      </p>
                      {/* <p class="card-text">Choose this option if you don’t have your own domain and would like to continue with the default subdomain we’ve assigned to your website - [company name]{process.env.REACT_APP_B2CCMSADMINDOMAIN}</p>
                      Website URL : {!this.state.isCMSPortalCreated ? <span class={"p-2 mb-2 badge badge-" + (this.state.isCMSPortalCreated ? "success" : "secondary")}>{this.state.portalURL}{" "}</span>
                        : <a className={"btn btn-" + (this.state.isCMSPortalCreated ? "success mb-2" : "secondary")} target="_blank" href={this.state.portalURL}>{this.state.portalURL}</a>}<br />
                      {!this.state.isLoading && !this.state.isCMSPortalCreated && this.state.availableSubDomainResponseStatus !== true &&
                        <React.Fragment>
                          {this.state.isLoading_DefaultSubdomain
                            ? <button className="btn btn-primary">
                              <span className="spinner-border spinner-border-sm mr-2"></span> Proceed
                            </button>
                            : <button onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-proceed") ? this.proceedDefaultSubDomain() : this.setState({ isshowauthorizepopup: true })} className="btn btn-primary">
                              Proceed
                            </button>}
                        </React.Fragment>}
                      {this.state.availableSubDomainResponseStatus === true &&
                        <div className="pb-2 mt-1">
                          <small class="alert alert-success p-1" role="alert">Website domain successfully created.</small>
                        </div>}
                      {this.state.availableSubDomainResponseStatus === false &&
                        <div className="pb-2 mt-1">
                          <small class="alert alert-danger p-1" role="alert">Ooops! Please try after sometime.</small>
                        </div>} */}

                      {/* {this.state.isCMSPortalCreated &&
                        <div>
                          Admin URL{" "}:{"  "}
                          <a className="btn btn-primary" target="_blank" href={this.state.portalURL.replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, process.env.REACT_APP_B2CCMSADMINDOMAIN)}>
                            {this.state.portalURL.replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, process.env.REACT_APP_B2CCMSADMINDOMAIN)}
                          </a>
                        </div>
                      } */}
                      {/* <button onClick={this.sendmail} className="ml-2 btn btn-primary d-none">
                        Send Email
                      </button> */}

                    </div>
                  </div>
                  <div class="card m-2 text-justify d-none">
                    <div class="card-header">
                      <b className="text-secondary">Custom Subdomain</b>
                    </div>
                    <div class="card-body">
                      <p class="card-text">Choose this option if you don’t have your own domain but prefer to choose your own subdomain. Eg. [name of your choice]{process.env.REACT_APP_B2CCMSADMINDOMAIN} (Subject to availability)</p>
                      <b class="card-text text-primary">Coming Soon</b>
                    </div>
                  </div>

                  <div class="card m-2 text-justify d-none">
                    <div class="card-header">
                      <b className="text-secondary">Custom Subdomain</b>
                    </div>
                    <div class="card-body">
                      <p class="card-text">Choose this option if you don’t have your own domain but prefer to choose your own subdomain. Eg. [name of your choice]{process.env.REACT_APP_B2CCMSADMINDOMAIN} (Subject to availability)</p>
                      {!this.state.isCMSPortalCreated &&
                        <b className="card-text text-primary">
                          To Change domain, first proceed with Default Subdomain
                        </b>}
                      {this.state.isCMSPortalCreated &&
                        <React.Fragment>
                          <div class="col-lg-6 input-group mb-3 p-0">
                            <div class="input-group-prepend">
                              <span class="input-group-text">https://</span>
                            </div>
                            <input type="text" maxlength="30" value={this.state.ownSubDomainName} onChange={(e) => this.handleOwnSubDomain(e)} class="form-control text-lowercase" placeholder="Your own subdomain" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div class="input-group-append">
                              <span class="input-group-text" id="basic-addon2">{process.env.REACT_APP_B2CCMSADMINDOMAIN}</span>
                            </div>
                          </div>
                          {this.state.customDomainError &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-danger p-1" role="alert">{this.state.customDomainError}</small>
                            </div>}
                          {this.state.isAvailableSubDomain === true &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-success p-1" role="alert">Selected subdomain available</small>
                            </div>}

                          {this.state.Custom_Subdomain_process_Message &&
                            <div className="pb-2 mt-1">
                              <small class={"alert alert-" + (this.state.Custom_Subdomain_process_Message.indexOf('failed') === -1 ? "success" : "danger") + " p-1"} role="alert">{this.state.Custom_Subdomain_process_Message}</small>
                            </div>}
                          {this.state.isAvailableSubDomain === false &&
                            <div className="pb-2 mt-1">
                              <small class="alert alert-danger p-1" role="alert">Selected subdomain not available. Please try another subdomain.</small>
                            </div>}

                          {this.state.isLoading_Custom_Subdomain && !this.state.isLoading_Custom_Subdomain_process &&
                            < button className="btn btn-primary mr-2">
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              Check Availability
                            </button>}
                          {!this.state.isLoading_Custom_Subdomain &&
                            <button onClick={this.proceedVerifySubDomain} className="btn btn-primary mr-2">
                              Check Availability
                            </button>}
                          {this.state.isAvailableSubDomain && this.state.isLoading_Custom_Subdomain &&
                            <button className="btn btn-primary">
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              Proceed
                            </button>
                          }
                          {this.state.isAvailableSubDomain && !this.state.isLoading_Custom_Subdomain &&
                            <button
                              onClick={() =>
                                AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "claimyourwebsite~claimyourwebsite-customsubdomain-proceed")
                                  ? this.proceedUpdateCustomSubDomain()
                                  : this.setState({ isshowauthorizepopup: true })
                              }
                              className="btn btn-primary"
                            >
                              Proceed
                            </button>
                          }
                        </React.Fragment>
                      }
                    </div>
                  </div>

                  <div class="card m-2 text-justify d-none">
                    <div class="card-header">
                      <b className="text-secondary">Custom Domain</b>
                    </div>
                    <div class="card-body">
                      <p class="card-text">This option will allow you to map your website to your own domain. It can be a domain you have already purchased or you’re planning to purchase. If you want, we can even purchase a domain for you (at an additional cost)</p>
                      <h6 className="text-secondary mb-3">If you need any assistance with your custom domain setup, please send us a message <Link to="contact-us" target="_blank" className="text-primary">here</Link> or at <a
                        href="mailto:sales@tourwizonline.com"
                        className="text-primary"
                      >
                        sales@tourwizonline.com
                      </a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.portalURL &&
          <div className="d-none" id="emailHTML" dangerouslySetInnerHTML={template} />
        }
        {this.state.showPopup &&
          <MessageBar Message={this.state.successfailuremsg} handleClose={() => this.closePopup()} />
        }
        {this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
      </div>
    );
  }
}

export default CMSWebsite;
