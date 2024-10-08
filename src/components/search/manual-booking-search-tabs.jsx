import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

class ManualBookingSearchTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    return (
      <div className="quotation-btn text-center">
        {Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
          return (
            <React.Fragment key={index}>
              {(item.name === "hotel" || item.name === "air" || item.name === "activity") && (
                <button className="btn" onClick={() => this.props.changeTab(item.name)}>
                  <SVGIcon name={item.name + "new"} width="28" type="fill"></SVGIcon>{" "}
                  <small>{Trans("_widgetTab" + item.name + "")}</small>
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default ManualBookingSearchTabs;
