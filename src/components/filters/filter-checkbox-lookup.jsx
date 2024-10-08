import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class FilterCheckBoxLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  filterShowHide = () => {
    this.setState({
      isShow: !this.state.isShow
    });
  };

  render() {
    const name = this.props.name;
    const items = this.props.values;
    const count = this.props.minMaxList;

    const ulClass =
      items.length > 10 ? (this.state.isShow ? "" : "filter-hide") : "";

    const getlookupvalue = (type, id) => {
      type = type === "transportationvehiclecategory" ? type = "categories" : type;
      type = type === "transportationvehicletype" ? type = "vehicletypes" : type;

      let lookupData = JSON.parse(localStorage.getItem("transportation_" + type + "_" + localStorage.getItem("lang")))
      if (lookupData && lookupData.filter(x => x.id === id).length > 0)
        return lookupData.filter(x => x.id === id)[0].name;
      else
        return "";
    }
    return (
      <React.Fragment>
        {items.length > 1 ? (
          <div className={"col-lg-12 col-sm-6 filter-" + name}>
            <div className="border-bottom mb-3">
              {name === "amenity" &&
                (this.props.businessName === "activity" ||
                  this.props.businessName === "package") ? (
                  <h3>{Trans("_" + this.props.businessName + "TypeFilter")}</h3>
                ) : (
                  <h3>{Trans("_filter" + name)}</h3>
                )}
              <ul className={"list-unstyled " + ulClass}>
                {items.map(item => {
                  return item !== "" ? (
                    <li key={"_filter" +
                      this.props.businessName +
                      name.toLowerCase() +
                      item}>
                      <div className="custom-control custom-checkbox m-0">
                        <input
                          className="custom-control-input"
                          type="checkbox"
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
                            getlookupvalue(name, item)
                          }
                          onClick={() => this.props.handleFilters(name, item)}
                          className="custom-control-label text-capitalize"
                        >
                          {getlookupvalue(name, item)}
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
              {items.length > 10 ? (
                <button
                  className="btn btn-link p-0 m-0 mb-2 text-primary"
                  onClick={this.filterShowHide}
                >
                  {this.state.isShow
                    ? Trans("_filterShowLess")
                    : Trans("_filterShowMore")}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default FilterCheckBoxLookup;
