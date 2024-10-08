import React, { Component } from "react";
import SearchWidget from "../search/search-widget";
import SearchWidgetQuotation from "../search/search-widget-quotation";

class QuotationSearch extends SearchWidget {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSearchRequest = (searchParam) => {
    this.props.handleSearchRequest(searchParam);
  };

  render() {
    return (
      <SearchWidgetQuotation
        history={this.props.history}
        mode={"home"}
        handleSearchRequest={this.handleSearchRequest}
        changeQuotationTab={this.props.changeQuotationTab}
        handleOffline={this.props.handleOffline}
        type={this.props.type}
        quotationInfo={this.props.quotationInfo}
        isShowSearch={this.props.isShowSearch}
        userInfo={this.props.userInfo}
      />
    );
  }
}

export default QuotationSearch;
