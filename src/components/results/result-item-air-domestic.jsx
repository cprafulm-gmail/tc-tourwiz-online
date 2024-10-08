import React, { Component } from "react";
import ResultItemAirDetails from "./result-item-air-details";
import ResultItemAirItem from "./result-item-air-item";
import ResultItemAirFare from "./result-item-air-fare";
import ResultItemAirTabs from "./result-item-air-tabs";
import Advertisement from "./result-advertisement";
import { Trans } from "../../helpers/translate";
import ResultItemAirItemDomestic from "./result-item-air-item-domestic";

class ResultItemAirDomestic extends Component {
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
    let code = this.props.routeType;
    const advt = this.props.data.find((x) => x.code === "advertisement");
    return (
      <div className="search-results search-results-air">
        {/* {advt && <Advertisement {...advt} />} */}
        <div className="row">
          {this.props.data.find((x) => x.code === code).item.length === 0 ? (
            <h6 className="ml-3">{Trans("_noairFound")}</h6>
          ) : null}

          {this.props.data
            .find((x) => x.code === code)
            .item.map((items, key) => {
              return (
                <div className="result-item col-lg-12" key={key}>
                  <div className="row no-gutters border shadow-sm mb-2">
                    <div className="col-lg-12">
                      <ResultItemAirItemDomestic
                        {...items}
                        routeType={this.props.routeType}
                        handleFlightSelect={this.props.handleFlightSelect}
                        isfromTourwiz={this.props.isfromTourwiz}
                      />
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

export default ResultItemAirDomestic;
