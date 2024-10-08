import React, { Component } from "react";
import ResultItemAirDetails from "./result-item-air-details";
import UmrahPackageResultItemAirItem from "./umrah-package-result-item-air-item";
import ResultItemAirFare from "./result-item-air-fare";
import ResultItemAirTabs from "./result-item-air-tabs";
import { Trans } from "../../helpers/translate";

class UmrahPackageResultItemAir extends Component {
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
    return (
      <div className="search-results search-results-air border-bottom">
        <div className="row">
          {this.props.data[0].item.length === 0 ? (
            <h6 className="ml-3">{Trans("_noairFound")}</h6>
          ) : null}
          {this.props.data[0].item.map((items, key) => {
            return (
              <div className="result-item col-lg-12" key={key}>
                <div className="row no-gutters border-top">
                  <div className="col-lg-12">
                    <UmrahPackageResultItemAirItem
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
                      type={this.props.type}
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

export default UmrahPackageResultItemAir;
