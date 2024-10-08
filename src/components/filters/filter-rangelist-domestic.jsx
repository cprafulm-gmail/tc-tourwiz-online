import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class FilterRangeListDomestic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  filterShowHide = () => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  render() {
    const name = this.props.name;
    const items = this.props.minMaxList;
    const ulClass = items.length > 10 ? (this.state.isShow ? "" : "filter-hide") : "";
    const route = this.props.route;

    return (
      <React.Fragment>
        {items.length > 1 && (
          <div className={"col-lg-12 col-sm-6 filter-" + name}>
            <div className="border-bottom mb-3">
              <h3 style={{ textTransform: "none" }}>
                {Trans("_filter" + name)}
                {items.find((x) => x.name) && items.find((x) => x.name).name}
              </h3>

              <ul className={"list-unstyled " + ulClass}>
                {items.map((item, key) => {
                  item.minValue === "00:00" && (item.label = "Early Morning");
                  item.minValue === "07:00" && (item.label = "Morning");
                  item.minValue === "12:00" && (item.label = "Afternoon");
                  item.minValue === "19:00" && (item.label = "Evening");
                  return (
                    item.minValue !== "" && (
                      <li key={key}>
                        <div className="custom-control custom-checkbox m-0">
                          <input
                            className="custom-control-input"
                            type="checkbox"
                            id={name + item.minValue + item.maxValue + route}
                            value={name + item.minValue + item.maxValue}
                            name={name + item.minValue + item.maxValue + route}
                          />
                          <label
                            name={name + item.minValue + item.maxValue + route}
                            htmlFor={name + item.minValue + item.maxValue + route}
                            title={name + item.minValue + item.maxValue}
                            onClick={() => this.props.handleFilters(name, item)}
                            className="custom-control-label text-capitalize"
                          >
                            {item.label && item.label + " ("}
                            {item.minValue + " - " + item.maxValue}
                            {item.label && ")"}
                          </label>
                          <label
                            className="position-absolute text-small text-primary"
                            style={{ right: "0px" }}
                          >
                            {item.count}
                          </label>
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
              {items.length > 10 ? (
                <button
                  className="btn btn-link p-0 m-0 mb-2 text-primary"
                  onClick={this.filterShowHide}
                >
                  {this.state.isShow ? Trans("_filterShowLess") : Trans("_filterShowMore")}
                </button>
              ) : null}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default FilterRangeListDomestic;
