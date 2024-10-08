import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";
import FlightPaperRateIcon from "../../assets/images/dashboard/flightpaperrate.svg";
class SearchWidgetModeHomeTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  routeChange = () => {
    this.props.history.push(`umrah-package/Create`);
  }

  render() {
    let isUmrahB2C = localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C";
    const { businessName, isPaperRateMode } = this.props;
    return (
      <ul className="list-unstyled search-tabs mt-4 border-left border-bottom">
        {Global.getEnvironmetKeyValue("availableBusinesses").filter(x => x.name !== "custom" && Global.getEnvironmetKeyValue("removeFlightFromSearchWidget", "cobrand") === "true" ? x.name !== "air" : x.name !== "custom").map(
          (item, index) => {
            if (localStorage.getItem("isUmrahPortal") && item.name === "activity") {
            }
            else {
              return (
                <React.Fragment key={index}>
                  <li className={businessName === item.name && !isPaperRateMode ? "active" : null}>
                    <button
                      className="btn btn-light text-left border-top rounded-0 w-100 pt-2 pb-2"
                      onClick={() => this.props.changeTab(item.name, null, false)}
                    >
                      <SVGIcon
                        name={item.name}
                        className="mr-2"
                        width="16"
                        type="fill"
                      ></SVGIcon>{" "}
                      {Trans("_widgetTab" + item.name + "")}
                    </button>
                  </li>

                </React.Fragment>
              );
            }
          }
        )}
        {
          Global.getEnvironmetKeyValue("availableBusinesses").filter(x => x.name === "air").length > 0 &&
          Global.getEnvironmetKeyValue("isAirPaperRateEnabled", "cobrand") === "true" &&
          <li className={businessName === "air" && isPaperRateMode ? "active" : null}>
            <button
              className="btn btn-light text-left border-top rounded-0 w-100 pt-2 pb-2"
              onClick={() => this.props.changeTab("air", null, true)}
            >
              <img
                className="pb-1"
                style={{ filter: "none", height: "20px" }}
                src={FlightPaperRateIcon}
                alt=""
              />{" "}
              Flight Paper Rates
            </button>
          </li>
        }
        {
          isUmrahB2C &&
          <li className={businessName === 'umrah-package' ? "active" : null}>
            <button
              className="btn btn-light text-left border-top rounded-0 w-100 pt-2 pb-2"
              onClick={() => this.routeChange()}
            >
              <SVGIcon
                name={'umrahpackage'}
                className="mr-2"
                width="16"
                type="fill"
              ></SVGIcon>{" "}
              {Trans("_widgetTab" + 'umrahpackage' + "")}
            </button>
          </li>
        }
      </ul>
    );
  }
}

export default SearchWidgetModeHomeTabs;
