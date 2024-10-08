import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import { Link } from "react-router-dom";
import CMSContentManager from "../screens/cms/cms-content-manager"
import { Helmet } from "react-helmet";
class CMSManageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      portalURL: "",
      isCMSPortalCreated: false,
      showtext: false
    };
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

  componentDidMount() {
    this.getBasicData();
  }

  getBasicData = () => {

    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        this.setState({ isLoading: false, portalURL: data.response[0].customHomeURL, isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true" });
      }, 'GET');
  }

  render() {
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              Manage Content
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
              Manage Content
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-3 hideMenu">
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div> */}
            <div className="col-lg-12 d-flex flex-wrap ">{/* justify-content-center align-content-center */}
              <div className="container">
                <div className="row">

                  <div className="col-lg-12 text-center text-secondary">
                    {/* <h1 className="">Coming Soon</h1> */}
                    <div className="module">
                      <h5>
                        This feature will allow you to manage your website
                        content (eg. pages, content, emails, inquiries etc), You
                        can also do branding, your customer can sign in to the
                        website and view booking, do payments, view shared
                        itineraries and quotations and much more!
                      </h5>

                      {!this.state.isLoading && this.state.isCMSPortalCreated &&
                        < React.Fragment >
                          <div className="mt-5 d-none">
                            <h5>Admin URL{" "}:{" "}</h5>
                            <a className="btn btn-primary mb-3" target="_blank" href={this.state.portalURL.replace(process.env.REACT_APP_B2CPORTALDOMAIN, process.env.REACT_APP_B2CCMSADMINDOMAIN)}>
                              {this.state.portalURL.replace(process.env.REACT_APP_B2CPORTALDOMAIN, process.env.REACT_APP_B2CCMSADMINDOMAIN)}
                            </a>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                    <div className=" d-none">
                      <label>&nbsp;</label>
                      <h5>Password Reset{" "}:{" "}</h5>
                      <h6>If you've lost your password or wish to reset it,</h6>
                      <h6 className="mb-4">use the link below to get started</h6>
                      <a className="btn btn-primary mb-3" target="_blank"
                        href={this.state.portalURL.replace(process.env.REACT_APP_B2CPORTALDOMAIN, process.env.REACT_APP_B2CCMSADMINDOMAIN) + "/cms/AccountLogin.aspx?ctl=SendPassword&language=en-US"}
                      >Reset Your Password</a>

                    </div>
                    <CMSContentManager {...this.state} {...this.props} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    );
  }
}

export default CMSManageContent;
