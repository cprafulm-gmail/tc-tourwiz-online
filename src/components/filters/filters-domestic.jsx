import React, { Component } from "react";
import FilterCheckBox from "./filter-checkbox";
import FilterCheckBoxRelative from "./filter-checkbox-relative";
import FilterCheckBoxLookup from "./filter-checkbox-lookup";
import FilterRange from "./filter-range";
import FilterSelect from "./filter-select";
import FilterName from "./filter-name";
import MapLocationSearchInput from "./filter-map-autocomplete";
import FilterStarRating from "./filter-starrating";
import FilterRangeList from "./filter-rangelist";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import FilterCheckBoxDomestic from "./filter-checkbox-domestic";
import FilterRangeListDomestic from "./filter-rangelist-domestic";

class FiltersDomestic extends Component {
  constructor(props) {
    super(props);
    this.state = { code: "departure" };
    this.currentFilters = [];
  }

  filterResults = (filterName, filterValue) => {
    let filterArr = this.currentFilters;
    let filterNameArr = filterArr.find((o) => o.name === filterName);

    if (filterNameArr === undefined) {
      if (
        filterName === "currency" ||
        filterName === "name" ||
        filterName === "startingLocations"
      ) {
        filterArr.push({
          name: filterName,
          defaultValue: filterValue,
        });
      } else if (filterName === "pricerange" || filterName === "duration") {
        filterArr.push({
          name: filterName,
          minValue: filterValue.minValue,
          maxValue: filterValue.maxValue,
        });
      } else if (
        filterName === "departurestarttime" ||
        filterName === "departureendtime" ||
        filterName === "arrivalstarttime" ||
        filterName === "arrivalendtime"
      ) {
        filterArr.push({
          name: filterName,
          minMaxList: [filterValue],
        });
      } else if (filterName === "placemap") {
        filterArr.push({
          name: filterName,
          minMaxList: filterValue.minMaxList,
          MinValue: filterValue.MinValue,
          MaxValue: filterValue.MaxValue,
        });
      } else if (filterName === "transportationvehiclemodel") {
        filterArr.push({
          name: filterName,
          minMaxList: [
            {
              MinValue: filterValue.minValue,
              MaxValue: filterValue.maxValue,
            },
          ],
        });
      } else {
        filterArr.push({
          name: filterName,
          values: [filterValue],
        });
      }
    } else {
      if (
        filterName === "currency" ||
        filterName === "name" ||
        filterName === "startingLocations"
      ) {
        filterNameArr.defaultValue = filterValue;
      } else if (filterName === "pricerange" || filterName === "duration") {
        filterNameArr.minValue = filterValue.minValue;
        filterNameArr.maxValue = filterValue.maxValue;
      } else if (
        filterName === "departurestarttime" ||
        filterName === "departureendtime" ||
        filterName === "arrivalstarttime" ||
        filterName === "arrivalendtime"
      ) {
        if (filterNameArr.minMaxList.some((e) => e.minValue === filterValue.minValue)) {
          if (filterNameArr.minMaxList.length !== 1) {
            filterNameArr.minMaxList = filterNameArr.minMaxList.filter(
              (item) => item.minValue !== filterValue.minValue
            );
          } else {
            this.currentFilters = filterArr.filter((item) => item !== filterNameArr);
          }
        } else {
          filterNameArr.minMaxList.push(filterValue);
        }
      } else if (filterName === "placemap") {
        filterNameArr.minMaxList = filterValue.minMaxList;
        filterNameArr.MinValue = filterValue.MinValue;
        filterNameArr.MaxValue = filterValue.MaxValue;
      } else if (filterName === "transportationvehiclemodel") {
        if (
          filterNameArr.minMaxList.filter(
            (x) => x.MinValue === filterValue.minValue && x.MaxValue === filterValue.maxValue
          ).length > 0
        ) {
          filterNameArr.minMaxList = filterNameArr.minMaxList.filter(
            (x) => x.MinValue !== filterValue.minValue && x.MaxValue !== filterValue.maxValue
          );
          if (filterNameArr.minMaxList.length === 0)
            this.currentFilters = filterArr.filter((item) => item !== filterNameArr);
        } else
          filterNameArr.minMaxList.push({
            MinValue: filterValue.minValue,
            MaxValue: filterValue.maxValue,
          });
      } else {
        if (filterNameArr.values.includes(filterValue)) {
          if (filterNameArr.values.length !== 1) {
            filterNameArr.values = filterNameArr.values.filter((item) => item !== filterValue);
          } else {
            this.currentFilters = filterArr.filter((item) => item !== filterNameArr);
          }
        } else {
          filterNameArr.values.push(filterValue);
        }
      }
    }

    if (this.state.code === "departure") {
      this.props.handleFilterDepart(this.currentFilters);
    } else {
      this.props.handleFilterReturn(this.currentFilters);
    }
  };

  clearFilters = () => {
    this.props.handleFilter([], true);
  };

  BindRelativeFiltersOnListLoad = () => {
    let AppliedFilterArr = [];
    this.props.appliedFilters.map((item) => {
      if (item.name === "pricerange" || item.name === "duration") {
        AppliedFilterArr.push({
          name: item.name,
          minValue: item.minValue,
          maxValue: item.maxValue,
        });
      } else if (
        item.name === "currency" ||
        item.name === "name" ||
        item.name === "startingLocations"
      ) {
        AppliedFilterArr.push({
          name: item.name,
          defaultValue: item.defaultValue,
        });
      } else if (
        item.name === "departurestarttime" ||
        item.name === "departureendtime" ||
        item.name === "arrivalstarttime" ||
        item.name === "arrivalendtime"
      ) {
        AppliedFilterArr.push({
          name: item.name,
          minMaxList: item.values,
        });
      } else if (item.name === "placemap") {
        AppliedFilterArr.push({
          name: item.name,
          minMaxList: item.minMaxList,
          MinValue: item.MinValue,
          MaxValue: item.MaxValue,
        });
      } else if (item.name === "transportationvehiclemodel") {
        AppliedFilterArr.push({
          name: item.name,
          minMaxList: [
            {
              MinValue: item.minValue,
              MaxValue: item.maxValue,
            },
          ],
        });
      } else {
        AppliedFilterArr.push({
          name: item.name,
          values: item.values,
        });
      }
    });
    if (this.currentFilters.length === 0) this.currentFilters = AppliedFilterArr;
  };

  componentDidMount() {
    if (this.props.businessName === "vehicle") {
      this.BindRelativeFiltersOnListLoad();
    }
  }

  render() {
    const code = this.state.code;

    const businessName = this.props.businessName;
    return (
      this.props.availableFiltersIndex !== undefined && (
        <div className="filter-area border bg-white p-3 shadow-sm">
          <div className="row">
            <div className="col-lg-12">
              <h6 className="border-bottom mb-3 pb-3 font-weight-bold">
                <SVGIcon
                  name="filter"
                  width="16"
                  height="16"
                  className="mr-2"
                  type="fill"
                ></SVGIcon>
                {Trans("_filterBy")}
                <button
                  className="btn btn-link m-0 p-0 text-primary pull-right"
                  onClick={this.clearFilters}
                >
                  {Trans("_filterClear")}
                </button>
              </h6>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={"nav-link rounded-0" + (code === "departure" ? " active" : "")}
                    onClick={() => this.setState({ code: "departure" })}
                  >
                    Departure
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={"nav-link rounded-0" + (code === "arrival" ? " active" : "")}
                    onClick={() => this.setState({ code: "arrival" })}
                  >
                    Return
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="row"
            style={this.state.code === "arrival" ? { display: "none" } : { display: "" }}
          >
            {this.props.availableFiltersIndex
              .find((x) => x.code === "departure")
              ?.item.map((item) => {
                return item.type === "checkBox" ? (
                  <React.Fragment key={item.name}>
                    {item.name === "starrating" ? (
                      <FilterStarRating {...item} handleFilters={this.filterResults} />
                    ) : item.name === "transportationvehicletype" ||
                      item.name === "transportationvehiclecategory" ? (
                      <FilterCheckBoxLookup
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                        isfromTourwiz={this.props.isfromTourwiz !== undefined}
                      />
                    ) : this.props.businessName === "vehicle" ? (
                      <FilterCheckBoxRelative
                        {...item}
                        appliedFilters={this.props.appliedFilters}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                        isfromTourwiz={this.props.isfromTourwiz !== undefined}
                      />
                    ) : (
                      <FilterCheckBoxDomestic
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                        route="departure"
                        isfromTourwiz={this.props.isfromTourwiz !== undefined}
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={item.name}>
                    {item.type === "range" && (
                      <FilterRange
                        {...item}
                        handleFilters={this.filterResults}
                        filterCurrencySymbol={this.props.filterCurrencySymbol}
                        isfromTourwiz={this.props.isfromTourwiz !== undefined}
                      />
                    )}
                    {item.type === "radio" && !this.props.isfromTourwiz && (
                      <FilterSelect
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                      />
                    )}
                    {item.name === "name" && (
                      <FilterName
                        {...item}
                        businessName={businessName}
                        handleFilters={this.filterResults}
                      />
                    )}
                    {item.type === "rangeList" && (
                      <FilterRangeListDomestic
                        {...item}
                        handleFilters={this.filterResults}
                        results={this.props}
                        route="departure"
                      />
                    )}
                    {item.type === "map" && this.props.locationName && (
                      <MapLocationSearchInput
                        {...item}
                        handleFilters={this.filterResults}
                        results={this.props}
                        locationName={this.props.locationName}
                      />
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          <div
            className="row"
            style={this.state.code === "departure" ? { display: "none" } : { display: "" }}
          >
            {this.props.availableFiltersIndex
              .find((x) => x.code === "arrival")
              ?.item.map((item) => {
                return item.type === "checkBox" ? (
                  <React.Fragment key={item.name}>
                    {item.name === "starrating" ? (
                      <FilterStarRating {...item} handleFilters={this.filterResults} />
                    ) : item.name === "transportationvehicletype" ||
                      item.name === "transportationvehiclecategory" ? (
                      <FilterCheckBoxLookup
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                      />
                    ) : this.props.businessName === "vehicle" ? (
                      <FilterCheckBoxRelative
                        {...item}
                        appliedFilters={this.props.appliedFilters}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                      />
                    ) : (
                      <FilterCheckBoxDomestic
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                        route="arrival"
                      />
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={item.name}>
                    {item.type === "range" && (
                      <FilterRange
                        {...item}
                        handleFilters={this.filterResults}
                        filterCurrencySymbol={this.props.filterCurrencySymbol}
                      />
                    )}
                    {item.type === "radio" && (
                      <FilterSelect
                        {...item}
                        handleFilters={this.filterResults}
                        businessName={businessName}
                      />
                    )}
                    {item.name === "name" && (
                      <FilterName
                        {...item}
                        businessName={businessName}
                        handleFilters={this.filterResults}
                      />
                    )}
                    {item.type === "rangeList" && (
                      <FilterRangeListDomestic
                        {...item}
                        handleFilters={this.filterResults}
                        results={this.props}
                        route="arrival"
                      />
                    )}
                    {item.type === "map" && this.props.locationName && (
                      <MapLocationSearchInput
                        {...item}
                        handleFilters={this.filterResults}
                        results={this.props}
                        locationName={this.props.locationName}
                      />
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )
    );
  }
}

export default FiltersDomestic;
