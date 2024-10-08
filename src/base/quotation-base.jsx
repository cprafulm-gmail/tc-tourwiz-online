import React, { Component } from "react";
import { apiRequester } from "../services/requester";

class QuotationBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  generateQuotation = (data) => {
    this.props.history.push("/Quotation/Details");
    localStorage.setItem("quotationDetails", JSON.stringify(data));

    this.props.match.params.mode === "Create" && this.createCart();
  };

  createCart = () => {
    let reqURL = "api/v1/cart/create";
    let reqOBJ = {
      Request: {},
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        localStorage.setItem("cartLocalId", data.response);
      }.bind(this)
    );
  };

  handleEdit = () => {
    this.props.history.push("/Quotation/Edit");
  };

  handleResults = (businessName) => {
    this.setState({
      isSearch: false,
      isResults: true,
      businessName: businessName,
    });
  };

  handleSearchRequest = (searchParam) => {
    this.setState({
      searchRequest: searchParam,
      resultKey: this.state.resultKey + 1,
      isResults: true,
    });
    this.handleResults(searchParam.businessName);
  };

  deleteResults = () => {
    this.setState({ isResults: false });
  };

  bookQuotation = () => {
    this.props.history.push(`/Cart`);
  };

  sendEmail = () => {
    this.setState({
      isEmail: !this.state.isEmail,
    });
  };

  addItem = (item) => {
    const quotationItems = JSON.parse(localStorage.getItem("quotationItems"));
    let items = quotationItems ? quotationItems : [];
    items.push(item);
    this.setState({ items, detailsKey: this.state.detailsKey + 1 });
    localStorage.setItem("quotationItems", JSON.stringify(items));
  };

  handleItemDelete = (item) => {
    const quotationItems = JSON.parse(localStorage.getItem("quotationItems"));
    let items = quotationItems ? quotationItems : [];
    if (item.business === "air") {
      if (!item.offlineItem) {
        items = items.filter((x) => (x.token && x.token) !== (item.token && item.token));
      } else {
        items = items.filter(
          (x) =>
            (x.offlineItem && x.offlineItem.uuid) !== (item.offlineItem && item.offlineItem.uuid)
        );
      }
    } else {
      if (!item.offlineItem) {
        items = items.filter(
          (x) => (x.itemDtl && x.itemDtl.id) !== (item.itemDtl && item.itemDtl.id)
        );
      } else {
        items = items.filter(
          (x) =>
            (x.offlineItem && x.offlineItem.uuid) !== (item.offlineItem && item.offlineItem.uuid)
        );
      }
    }

    this.setState({ items, detailsKey: this.state.detailsKey + 1 });
    localStorage.setItem("quotationItems", JSON.stringify(items));
  };

  changeQuotationTab = (businessName) => {
    this.setState({ businessName });
  };

  resetQuotation = () => {
    localStorage.removeItem("quotationDetails");
    localStorage.removeItem("quotationItems");
    localStorage.removeItem("cartLocalId");
    this.setState({ items: [] });
  };

  handleOffline = (item) => {
    this.addItem({ offlineItem: item });
  };
}

export default QuotationBase;
