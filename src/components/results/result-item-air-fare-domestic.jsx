import React, { Component } from "react";
import { apiRequester } from "../../services/requester";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";
import ResultItemAirFareRule from "./result-item-air-fare-rule";
import Loader from "../common/loader";
import ResultItemAirFareRuleDomestic from "./result-item-air-fare-rule-domestic";

class ResultItemAirFareDomestic extends Component {
  constructor(props) {
    super(props);
    this.state = { fareBreakup: null, isFareRules: false };
  }

  getFarebreakup = (param_item, itemid) => {
    let reqURL = "api/v1/farebreakup/details";
    let reqOBJ = {
      Request: {
        Token: this.props.searchToken,
        Data: [
          {
            Key: this.props.token,
            Value: [],
          },
        ],
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          fareBreakup: data.response,
        });
      }.bind(this)
    );
  };

  componentDidMount = () => {
    this.getFarebreakup();
  };

  render() {
    let tmpPriceBrackup =
      this.state.fareBreakup &&
      this.state.fareBreakup.map((cart_inner_Item, cart_inner_index) => {
        return {
          title: cart_inner_Item.item[0].displayRateInfo[0].description,
          itemArr: cart_inner_Item.item.map((cart_inner1_Item, cart_inner1_index) => {
            if (cart_inner1_Item.type === "") {
              return cart_inner1_Item.displayRateInfo.map((cart_inner2_Item, cart_inner2_index) => {
                return {
                  name: cart_inner2_Item.description,
                  amount: cart_inner1_Item.totalAmount,
                  lable: cart_inner2_Item.description,
                };
              });
            } else {
              return {
                name:
                  cart_inner1_Item.quantity +
                  " " +
                  (cart_inner1_Item.type === "0"
                    ? Trans("_lblAdult")
                    : cart_inner1_Item.type === "1"
                    ? Trans("_lblChild")
                    : cart_inner1_Item.type === "2"
                    ? Trans("_lblInfant")
                    : "") +
                  " (x " +
                  cart_inner1_Item.displayRateInfo[0].displayAmount +
                  ")",
                amount: cart_inner1_Item.totalAmount,
                lable: cart_inner1_Item.displayRateInfo[0].title,
              };
            }
          }),
        };
      });
    tmpPriceBrackup = tmpPriceBrackup ? tmpPriceBrackup.flat() : [];
    let priceBrackup = [];
    let i = 0;
    while (i < tmpPriceBrackup.length) {
      if (tmpPriceBrackup[i].itemArr[0]) {
        if (Array.isArray(tmpPriceBrackup[i].itemArr[0])) {
          let j = 0;
          while (j < tmpPriceBrackup[i].itemArr[0].length) {
            priceBrackup.push(tmpPriceBrackup[i].itemArr[0][j]);
            j++;
          }
        } else {
          priceBrackup.push(tmpPriceBrackup[i]);
        }
      }
      i++;
    }

    return (
      <div className="row">
        {!this.state.isFareRules && (
          <div className="col-lg-12">
            <div className="mt-3">
              <label className=" font-weight-bold  text-primary">
                {Trans("_PriceBreakupLabel")}
              </label>
              <div className="border pt-3 pl-3 pr-3">
                {this.state.fareBreakup ? (
                  <React.Fragment>
                    <ul className="list-unstyled p-0 m-0">
                      {priceBrackup &&
                        priceBrackup.map((item, index) => {
                          //Room Wise Loop
                          return (
                            <React.Fragment key={index}>
                              {item.title !== undefined && (
                                <li className="row">
                                  <label className="col-lg-12 font-weight-bold  text-primary">
                                    {Trans("_lbl" + item.title.replace(" ", ""))}
                                  </label>
                                </li>
                              )}
                              {item.title !== undefined ? (
                                item.itemArr.map((item_inner, index) => {
                                  //Room Wise Loop
                                  return (
                                    <li className="row">
                                      <label className="col-lg-8">{item_inner.name}</label>
                                      <b className="col-lg-4 pl-0 text-right">
                                        <Amount amount={item_inner.amount}></Amount>
                                      </b>
                                    </li>
                                  );
                                })
                              ) : (
                                <li
                                  className={
                                    item.name.toLowerCase() === "total amount"
                                      ? "row border-top pt-2 pb-1 font-weight-bold  text-primary"
                                      : "row"
                                  }
                                >
                                  <label className="col-lg-8">
                                    {Trans("_lbl" + item.name.replace(" ", ""))}
                                  </label>
                                  <b className="col-lg-4 pl-0 text-right">
                                    <Amount amount={item.amount}></Amount>
                                  </b>
                                </li>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </ul>{" "}
                  </React.Fragment>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        )}

        {this.state.isFareRules && (
          <ResultItemAirFareRuleDomestic
            {...this.props}
            tripLocationDetails={this.props.items[0].LocationInfo}
            flightOptionToken={this.props.token}
            fromPage={"result-item-row"}
            fareRules={this.props.fareRules}
            handlefareRules={this.props.handlefareRules}
          />
        )}

        <div className="col-lg-12">
          {!this.state.isFareRules && (
            <button
              className="btn btn-link text-primary p-0 mt-2"
              onClick={() => this.setState({ isFareRules: true })}
            >
              {Trans("_priceRules")}
            </button>
          )}

          {this.state.isFareRules && (
            <button
              className="btn btn-link text-primary p-0 mt-2"
              onClick={() => this.setState({ isFareRules: false })}
            >
              {Trans("_PriceBreakupLabel")}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default ResultItemAirFareDomestic;
