import React, { Component } from "react";
import ResultItemAirDetails from "./result-item-air-details";
import ResultItemAirFare from "./result-item-air-fare";
import ResultItemAirTabs from "./result-item-air-tabs";
import { Trans } from "../../helpers/translate";
import ResultItemAirItemDomestic from "./result-item-air-item-domestic";
import Amount from "../../helpers/amount";
import ResultItemAirFareDomestic from "./result-item-air-fare-domestic";

class ResultItemAirDomesticSelected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemProps: [],
      fareRules: null,
      isSelected: false,
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

  handleSelectionValidation = () => {
    (this.props.selectedFlights[0].token || this.props.selectedFlights[1].token) &&
      this.setState({
        isSelected: true,
      });
  };

  handleCart = (item) => {
    item = {
      items: item,
      business:"air",
      paxInfo:[],
      tripType:"roundtrip",
      isDomestic:true,
      dateInfo:[],
    };
    this.props.handleCart("","","",item);
  }

  render() {
    let totalPrice = 0;
    this.props.selectedFlights.map((items) => (totalPrice = totalPrice + items.amount));
    const selectedFlights = [this.props.selectedFlights[0], this.props.selectedFlights[1]];

    return (
      <div className="selected-flight">
        <div
          className="position-fixed w-100"
          style={{ bottom: "0px", left: "0px", zIndex: "1001" }}
        >
          <div className="container">
            <div className="search-results-air title-bg p-2">
              <div className="row no-gutters">
                <div className="col-lg-10">
                  <div className="row no-gutters">
                    {selectedFlights.map((items, key) => {
                      return (
                        <div className="result-item col-lg-6 pr-2" key={key}>
                          {items.token && (
                            <React.Fragment>
                              <ResultItemAirItemDomestic
                                {...items}
                                handelDetails={this.showDetails}
                                handleCart={this.props.handleCart}
                                isBtnLoading={this.props.isBtnLoading}
                                isShow={
                                  this.state.itemProps.find((x) => x.token === items.token) ===
                                  undefined
                                    ? false
                                    : this.state.itemProps.find((x) => x.token === items.token)
                                        .isShow
                                }
                                routeType={this.props.routeType}
                                isSelectedItem="true"
                              />

                              {this.state.itemProps.find((x) => x.token === items.token) !==
                                undefined &&
                                this.state.itemProps.find((x) => x.token === items.token)
                                  .isShow && (
                                  <div className="bg-white">
                                    <div className="row">
                                      <div className="col-lg-12">
                                        <div className="border-top p-2 pb-0">
                                          {!this.props.isfromTourwiz &&
                                            <ResultItemAirTabs
                                              activeTab={
                                                this.state.itemProps.find(
                                                  (x) => x.token === items.token
                                                ) !== undefined
                                                  ? this.state.itemProps.find(
                                                      (x) => x.token === items.token
                                                    ).activeTab
                                                  : "itinerary"
                                              }
                                              token={items.token}
                                              changeTabs={this.changeTabs}
                                              isfromTourwiz={this.props.isfromTourwiz}
                                            />
                                          }
                                          {this.state.itemProps.find(
                                            (x) => x.token === items.token
                                          ) !== undefined &&
                                          this.state.itemProps.find((x) => x.token === items.token)
                                            .activeTab === "itinerary" ? (
                                            <div style={{ maxHeight: "208px", overflow: "auto" }}>
                                              <ResultItemAirDetails {...items} />
                                            </div>
                                          ) : (
                                            <ResultItemAirFareDomestic
                                              {...items}
                                              activeTab={
                                                this.state.itemProps.find(
                                                  (x) => x.token === items.token
                                                ) !== undefined
                                                  ? this.state.itemProps.find(
                                                      (x) => x.token === items.token
                                                    ).activeTab
                                                  : "itinerary"
                                              }
                                              handleChangeTabs={this.changeTabs}
                                              searchToken={this.props.searchToken}
                                              fareRules={this.state.fareRules}
                                              handlefareRules={this.handlefareRules}
                                              isDomestic="true"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </React.Fragment>
                          )}

                          {!items.token && (
                            <div
                              className="d-flex h-100 justify-content-center align-items-center text-secondary bg-white"
                              style={{ minHeight: "80px" }}
                            >
                              <div
                                className={
                                  this.state.isSelected
                                    ? "alert alert-danger m-0 pt-1 pb-1 pl-3 pr-3"
                                    : ""
                                }
                              >
                                Please Select {!selectedFlights[0].token ? "Departure" : "Return"}{" "}
                                Flight
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-lg-2 d-flex align-items-center bg-white justify-content-center">
                  <div>
                    {!this.props.isfromTourwiz &&
                      <h2
                        className="text-primary font-weight-bold text-center mb-1"
                        style={{ fontSize: "1.2rem" }}
                      >
                        <Amount amount={totalPrice} />
                      </h2>
                    }
                    
                    
                    {!this.props.isfromTourwiz && !this.props.isBtnLoading &&
                      selectedFlights[0].token &&
                      selectedFlights[1].token && (
                        <button
                          className="btn btn-primary mt-1"
                          onClick={() =>
                            this.props.handleCart(this.props.searchToken, [
                              selectedFlights[0].token,
                              selectedFlights[1].token,
                            ])
                          }
                        >
                          {Trans("_bookNow")}
                        </button>
                      )}

                    {this.props.isfromTourwiz && !this.props.isBtnLoading &&
                      selectedFlights[0].token &&
                      selectedFlights[1].token && (
                        <button
                          className="btn btn-primary mt-1"
                          onClick={() =>
                            this.handleCart([
                              selectedFlights[0],
                              selectedFlights[1],
                            ])
                          }
                        >
                          Add to {this.props.type}
                        </button>
                      )}

                    {!this.props.isBtnLoading &&
                      (!selectedFlights[0].token || !selectedFlights[1].token) && (
                        <button
                          className="btn btn-secondary mt-1"
                          onClick={() => this.handleSelectionValidation()}
                        >
                          {this.props.isfromTourwiz ? "Add to " + this.props.type : Trans("_bookNow")}
                        </button>
                      )}

                    {this.props.isBtnLoading && (
                      <button className="btn btn-primary mt-1">
                        {this.props.isBtnLoading[0] === this.props.selectedFlights[0].token && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        {this.props.isfromTourwiz ? "Add to " + this.props.type : Trans("_bookNow")}
                      </button>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultItemAirDomesticSelected;
