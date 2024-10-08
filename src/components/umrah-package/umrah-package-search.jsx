import React, { Component } from "react";
import SearchWidget from "../search/search-widget";
import SearchWidgetUmrahPackage from "../search/search-widget-umrah-package";

class UmrahPackageSearch extends SearchWidget {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSearchRequest = (searchParam) => {
    this.props.handleSearchRequest(searchParam);
  };

  render() {
    return (
      <SearchWidgetUmrahPackage
        history={this.props.history}
        mode={"home"}
        handleSearchRequest={this.handleSearchRequest}
        changeQuotationTab={this.props.changeQuotationTab}
        handleOffline={this.props.handleOffline}
        type={this.props.type}
        quotationInfo={this.props.quotationInfo}
        isShowSearch={this.props.isShowSearch}
        isUmrahPackage={true}
      />
    );
  }
}

export default UmrahPackageSearch;
