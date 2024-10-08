import React, { Component } from "react";
import SearchWidget from "../components/search/search-widget";
import CallCenter from "../components/call-center/call-center";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import CartIcon from "../components/common/cart-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import Config from "../config";
import { Helmet } from "react-helmet";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleRedirect = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      //window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };

  render() {
    const css = `
    .navbar .dashboard-btn {
        display: none !important;
    }`;
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    return Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? (
      <React.Fragment>
        {Global.getEnvironmetKeyValue("isCart") !== null &&
          Global.getEnvironmetKeyValue("isCart") && (
            <CartIcon
              key={this.props.isLoggedIn}
              isDisplay={1}
              {...this.props}
            />
          )}
        {isPersonateEnabled && (
          <div className="mt-4">
            <CallCenter />
          </div>
        )}
        <SearchWidget
          history={this.props.history}
          match={this.props.match}
          mode={"home"}
        />
      </React.Fragment>
    ) : (
      <div className="agent-dashboard">
        <style>{css}</style>
        <div className="title-bg pt-3 pb-3">
          <Helmet>
            <title>
              {Trans("_dashboard")}
            </title>
          </Helmet>
          <div className="container">
            <h1 className="text-white m-0 p-0 f30 d-inline">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("_dashboard")}
            </h1>
            {/* {isPersonateEnabled && (
                <div className="pull-right" style={{ marginTop: "-2px" }}>
                  <CallCenter />
                </div>
              )} */}
          </div>
        </div>
        <div className="container">
          <div>
            <div className="row">
              <div className="col-lg-3">
                <QuotationMenu handleMenuClick={this.handleRedirect} userInfo={this.props.userInfo} {...this.props} />
              </div>

              <div className="col-lg-9">
                <div className="mt-4">
                  <React.Fragment>
                    {Global.getEnvironmetKeyValue("isCart") !== null &&
                      Global.getEnvironmetKeyValue("isCart") && (
                        <CartIcon
                          key={this.props.isLoggedIn}
                          isDisplay={1}
                          {...this.props}
                        />
                      )}
                    {isPersonateEnabled && (
                      <div className="mt-4">
                        <CallCenter />
                      </div>
                    )}
                    <SearchWidget
                      history={this.props.history}
                      match={this.props.match}
                      mode={"home"}
                    />
                  </React.Fragment>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
