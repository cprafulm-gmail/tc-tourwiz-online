import React, { Component } from "react";
import ResultItemAirDetails from "./result-item-air-details";
import ResultItemAirItem from "./result-item-air-item";
import ResultItemAirFare from "./result-item-air-fare";
import ResultItemAirTabs from "./result-item-air-tabs";
import Advertisement from "./result-advertisement";
import { Trans } from "../../helpers/translate";

class ResultItemAir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemProps: [],
      fareRules: null,
    };
  }

  showDetails = (itemToken) => {
    let itemProps = this.state.itemProps;

    if (itemProps.find((x) => x.token === itemToken) === undefined)
      itemProps.push({
        token: itemToken,
        activeTab: "itinerary",
        isShow: true,
      });
    else
      itemProps.find((x) => x.token === itemToken).isShow = !itemProps.find(
        (x) => x.token === itemToken
      ).isShow;

    this.setState({
      itemProps: itemProps,
    });
  };

  handlefareRules = (fareRules) => {
    this.setState({
      fareRules,
    });
  };
  changeTabs = (itemToken, activeTab) => {
    let itemProps = this.state.itemProps;

    itemProps.find((x) => x.token === itemToken).activeTab = activeTab;

    this.setState({
      itemProps: itemProps,
    });
  };

  render() {
    let code = "default";
    const advt = this.props.data.find((x) => x.code === "advertisement");
    return (
      <div className="search-results search-results-air">
        {advt && this.props.data.find((x) => x.code === code) !== undefined && <Advertisement {...advt} />}
        <div className="row">
          {(this.props.data.find((x) => x.code === code) === undefined || this.props.data.find((x) => x.code === code).item.length === 0) ? (
            <h6 className="ml-3">{Trans("_noairFound")}</h6>
          ) : null}
          {this.props.data
            .find((x) => x.code === code) !== undefined && this.props.data
            .find((x) => x.code === code)
            .item.map((items, key) => {
              return (
                <div className="result-item col-lg-12" key={key}>
                  <div className="row no-gutters border shadow-sm mb-3">
                    <div className="col-lg-12">
                      <ResultItemAirItem
                        {...items}
                        handelDetails={this.showDetails}
                        handleCart={this.props.handleCart}
                        isBtnLoading={this.props.isBtnLoading}
                        isShow={
                          this.state.itemProps.find((x) => x.token === items.token) === undefined
                            ? false
                            : this.state.itemProps.find((x) => x.token === items.token).isShow
                        }
                        addToWishList={this.props.addToWishList}
                        wishList={this.props.wishList}
                      />
                      {this.state.itemProps.find((x) => x.token === items.token) !== undefined &&
                        this.state.itemProps.find((x) => x.token === items.token).isShow && (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="border-top p-4 pb-0">
                                <ResultItemAirTabs
                                  activeTab={
                                    this.state.itemProps.find((x) => x.token === items.token) !==
                                    undefined
                                      ? this.state.itemProps.find((x) => x.token === items.token)
                                          .activeTab
                                      : "itinerary"
                                  }
                                  token={items.token}
                                  changeTabs={this.changeTabs}
                                />
                                {this.state.itemProps.find((x) => x.token === items.token) !==
                                  undefined &&
                                this.state.itemProps.find((x) => x.token === items.token)
                                  .activeTab === "itinerary" ? (
                                  <ResultItemAirDetails {...items} />
                                ) : (
                                  <ResultItemAirFare
                                    {...items}
                                    activeTab={
                                      this.state.itemProps.find((x) => x.token === items.token) !==
                                      undefined
                                        ? this.state.itemProps.find((x) => x.token === items.token)
                                            .activeTab
                                        : "itinerary"
                                    }
                                    handleChangeTabs={this.changeTabs}
                                    searchToken={this.props.searchToken}
                                    fareRules={this.state.fareRules}
                                    handlefareRules={this.handlefareRules}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default ResultItemAir;
