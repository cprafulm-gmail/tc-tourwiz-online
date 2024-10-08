import React, { Component } from "react";
import SearchWidgetModeHomeWidget from "./search-widget-mode-home-widget";
import SearchWidgetModeHomeTabs from "./search-widget-mode-home-tabs";
import Config from "../../config.json";

class SearchWidgetModeHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className={Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? "col-lg-2" : ""}></div>
          <div className={Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? "col-lg-8" : "col-lg-12"}>
            <div className="row mt-4">
              <div className="col-lg-3 pr-lg-0">
                <SearchWidgetModeHomeTabs {...this.props} />
              </div>
              <div className="col-lg-9 pl-lg-0">
                <SearchWidgetModeHomeWidget {...this.props} />
              </div>
              <div className="col-lg-3 pl-lg-0">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchWidgetModeHome;
