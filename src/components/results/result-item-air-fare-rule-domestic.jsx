import React, { Component } from "react";
import { apiRequester } from "../../services/requester";
import HtmlParser from "../../helpers/html-parser";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";

class ResultItemAirFareRuleDomestic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fareRules: this.props.fareRules ? this.props.fareRules : null,
      activeTab: "price",
    };
  }
  getFareRules = (token, callback) => {
    let reqURL = "api/v1/air/farerules";
    let reqOBJ = {
      Request: {
        Token: this.props.searchToken,
        Data: this.props.flightOptionToken,
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          fareRules: data.response,
        });
        if (this.props.handlefareRules) this.props.handlefareRules(data.response);
      }.bind(this)
    );
  };

  handleChangeTabs = (flightOptionToken, tabName) => {
    if (this.props.handleChangeTabs) this.props.handleChangeTabs(flightOptionToken, tabName);
    else {
      this.setState({
        activeTab: tabName,
      });
    }
  };

  componentDidMount = () => {
    if (!this.props.fareRules) this.getFareRules();
  };

  render() {
    let activeTab = this.props.handleChangeTabs ? this.props.activeTab : this.state.activeTab;

    let onwordTripName =
      this.props.items[0].item[0].locationInfo.fromLocation.id +
      "-" +
      this.props.items[0].item[this.props.items[0].item.length - 1].locationInfo.toLocation.id;
    // let returnTripName =
    //   this.props.tripType === "roundtrip"
    //     ? this.props.items[1].item[0].locationInfo.fromLocation.id +
    //       "-" +
    //       this.props.items[1].item[this.props.items[1].item.length - 1].locationInfo.toLocation.id
    //     : "";
    let fareHTML = () => {
      if (this.state.fareRules) {
        let data =
          activeTab === "price" || activeTab === "onword"
            ? this.state.fareRules.slice(0, this.props.items[0].item.length)
            : this.state.fareRules.slice(
                this.props.items[0].item.length,
                this.props.items[0].item.length + this.props.items[1].item.length
              );
        return data.map((item, itemKey) => {
          return item.item.map((rule, ruleKey) => {
            return (
              <React.Fragment key={ruleKey}>
                {ruleKey === 0 && (
                  <li>
                    <br />
                    <h6 className="d-block">
                      {this.props.items[activeTab === "price" || activeTab === "onword" ? 0 : 1]
                        .item[itemKey].locationInfo.fromLocation.name +
                        " - " +
                        this.props.items[activeTab === "price" || activeTab === "onword" ? 0 : 1]
                          .item[itemKey].locationInfo.toLocation.name +
                        " (" +
                        this.props.items[activeTab === "price" || activeTab === "onword" ? 0 : 1]
                          .item[itemKey].code +
                        ")"}
                    </h6>
                  </li>
                )}
                <li key={ruleKey}>
                  <b className="d-block">
                    <HtmlParser text={rule.key} />
                  </b>
                  <span className="d-block">
                    <HtmlParser text={rule.value} />
                  </span>
                </li>
              </React.Fragment>
            );
          });
        });
      }
    };

    return (
      <div className={"col-lg-" + (this.props.fromPage === "result-item-row" ? "12" : "12")}>
        <div className={this.props.fromPage === "result-item-row" ? "mt-3" : ""}>
          <label className=" font-weight-bold  text-primary">
            {this.props.fromPage === "result-item-row" ? Trans("_priceRules") : ""}
          </label>
          {this.state.fareRules && (
            <div className={this.props.fromPage === "result-item-row" ? "pull-right" : "pull-left"}>
              <button
                className={
                  "btn btn-sm m-0 pt-0 pb-0 mr-2 " +
                  (activeTab === "price"
                    ? "btn-info"
                    : activeTab === "onword"
                    ? "btn-info"
                    : "btn-light")
                }
                onClick={() => this.handleChangeTabs(this.props.flightOptionToken, "onword")}
              >
                {onwordTripName}
              </button>
              {/* {this.props.tripType === "roundtrip" && (
                <button
                  className={
                    "btn btn-sm m-0 pt-0 pb-0 mr-2 " +
                    (activeTab === "price"
                      ? "btn-light"
                      : activeTab === "return"
                      ? "btn-info"
                      : "btn-light")
                  }
                  onClick={() => this.handleChangeTabs(this.props.flightOptionToken, "return")}
                >
                  {returnTripName}
                </button>
              )} */}
            </div>
          )}
          <div
            className={
              this.props.fromPage === "result-item-row"
                ? "border p-3 overflow-auto"
                : "pull-left mt-3"
            }
            style={{ maxHeight: "200px", minHeight: "200px" }}
          >
            <div>
              {this.state.fareRules ? (
                <div>
                  <ul className="list-unstyled m-0 small">{fareHTML()}</ul>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultItemAirFareRuleDomestic;
