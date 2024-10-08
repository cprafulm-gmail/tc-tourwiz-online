import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";

class FilterCheckBoxRelative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      numberOfItem: 10
    };
  }

  filterShowHide = (type) => {
    if (type) {
      this.setState({
        isShow: !this.state.isShow,
        numberOfItem: this.state.numberOfItem + 20
      });
    }
    else {
      this.setState({
        isShow: !this.state.isShow,
        numberOfItem: 10
      });
    }
  };

  render() {
    const name = this.props.name;
    const items = this.props.values;
    const count = this.props.minMaxList;

    const ulClass =
      items.length > 10 ? (this.state.isShow ? "" : "filter-hide1") : "";

    return (
      <React.Fragment>
        {items.length > 0 ? (
          <div className={"col-lg-12 col-sm-6 filter-" + name}>
            <div className="border-bottom mb-3">
              {name === "amenity" &&
                (this.props.businessName === "activity" ||
                  this.props.businessName === "transfers" ||
                  this.props.businessName === "package") ? (
                  <h3>{Trans("_" + this.props.businessName + "TypeFilter")}</h3>
                ) : (name === "category" && this.props.businessName === "vehicle" ?
                  (<h3>{Trans("_filtercarType")}</h3>) :
                  (<h3>{Trans("_filter" + name)}</h3>)
                )}

              <ul className={"list-unstyled " + ulClass}>
                {items.map((item, key) => {
                  let ischecked = false;
                  ischecked = (this.props.appliedFilters.find((x) => x.name === name).values.find((x) => x === item) !== undefined &&
                    this.props.appliedFilters.find((x) => x.name === name).values.find((x) => x === item).length > 0)
                  return key < this.state.numberOfItem && item !== "" ? (
                    <li key={key}>
                      <div className="custom-control custom-checkbox m-0">
                        <input
                          className="custom-control-input"
                          type="checkbox"
                          checked={ischecked}
                          id={"_filter" +
                            this.props.businessName +
                            name.toLowerCase() +
                            item}
                          value={item}
                          name={"_filter" +
                            this.props.businessName +
                            name.toLowerCase() +
                            item}
                        />
                        <label
                          name={"_filter" +
                            this.props.businessName +
                            name.toLowerCase() +
                            item}
                          htmlFor={"_filter" +
                            this.props.businessName +
                            name.toLowerCase() +
                            item}
                          title={
                            Trans(
                              "_filter" +
                              this.props.businessName +
                              name.toLowerCase() +
                              item
                            ) !==
                              "_filter" +
                              this.props.businessName +
                              name.toLowerCase() +
                              item
                              ? Trans(
                                "_filter" +
                                this.props.businessName +
                                name.toLowerCase() +
                                item
                              )
                              : ""
                          }
                          onClick={() => this.props.handleFilters(name, item)}
                          className="custom-control-label text-capitalize"
                        >
                          <HtmlParser text=
                            {Trans(
                              "_filter" +
                              this.props.businessName +
                              name.toLowerCase() +
                              item
                            ) !==
                              "_filter" +
                              this.props.businessName +
                              name.toLowerCase() +
                              item
                              ? Trans(
                                "_filter" +
                                this.props.businessName +
                                name.toLowerCase() +
                                item
                              )
                              : item}
                          />
                        </label>

                        {count && count.find(x => x.name === item) && (
                          <label
                            className="position-absolute text-small text-primary"
                            style={{ right: "0px" }}
                          >
                            {count.find(x => x.name === item).minValue
                              ? count.find(x => x.name === item).minValue
                              : count.find(x => x.name === item).count}
                          </label>
                        )}
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>
              {items.length > this.state.numberOfItem ? (
                <button
                  className="btn btn-link p-0 m-0 mb-2 text-primary"
                  onClick={() => this.filterShowHide(true)}
                >
                  {Trans("_filterShowMore")}
                </button>
              ) : items.length > 10 ? (
                <button
                  className="btn btn-link p-0 m-0 mb-2 text-primary"
                  onClick={() => this.filterShowHide(false)}
                >
                  {Trans("_filterShowLess")}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default FilterCheckBoxRelative;
