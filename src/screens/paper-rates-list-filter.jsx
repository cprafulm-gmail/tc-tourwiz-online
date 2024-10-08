import React, { Component } from 'react'
import Form from '../components/common/form';
import { Trans } from '../helpers/translate';
import moment from 'moment';
import * as Global from "../helpers/global";
import SVGIcon from "../helpers/svg-icon";
import AutoComplete from '../components/search/auto-complete';

class PaperRatesListFilter extends Form {
  state = {
    fromLocation: [],
    toLocation: [],
    data: {
      isRoundTrip: 'both',
      fromLocationIsValid: "valid",
      toLocationIsValid: "valid",
      departStartDate: "",
      departEndDate: "",
      departAirlineName: '',
      departClass: '',
      departStops: '',
      supplier: '',
      searchBy: "",
      dateMode: "",/*"this-month"*/
      specificmonth: "1",
      fromDate: '',/*moment().add(-1, 'M').format('YYYY-MM-DD')*/
      toDate: '',/*moment().format('YYYY-MM-DD'),*/
    },
    isOnRequest: false,
    errors: {},
  };

  changeairTripType = (triptype) => {
    let newData = { ...this.state.data };
    if (triptype === 'both') {
      newData.isRoundTrip = 'both';
      newData.both = !this.state.data.both;
    }
    else if (triptype === 'roundtrip') {
      newData.isRoundTrip = 'roundtrip';
    }
    else if (triptype === 'oneway') {
      newData.isRoundTrip = 'oneway';
    }
    this.setState({ data: newData });
  };
  componentDidMount() {
    this.setDates();
  }
  setDates = () => {
    let newData = { ...this.state.data };
    newData.departStartDate = new Date();
    newData.departStartDate = moment();
    newData.departEndDate = new Date();
    newData.departEndDate = moment().add(1, "days");
    newData.returnStartDate = new Date();
    newData.returnStartDate = moment();
    newData.returnEndDate = new Date();
    newData.returnEndDate = moment().add(1, "days");
    this.setState({ data: newData });
  };
  handlePaperRatesFilter = () => {
    let state = this.state;
    this.setState({ state })
    if (this.state.data.dateMode === "specific-month") {
      var data = this.state.data;
      var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
      data.departStartDate = date;
      data.departEndDate = date;
    }
    this.props.handlePaperRatesFilter(state);
  }
  resetPaperRatesFilter = (mode) => {
    let state = this.state;
    state.fromLocation = [];
    state.toLocation = [];
    state.data.isRoundTrip = 'both';
    state.data.fromLocationIsValid = "valid";
    state.data.toLocationIsValid = "valid";
    state.data.departStartDate = "";
    state.data.departEndDate = "";
    state.data.departAirlineName = '';
    state.data.supplier = '';
    state.data.departClass = '';
    state.data.departStops = '';
    state.data.searchBy = '';
    this.setState({ state });
    if (mode === "adminList") {
      this.props.handlePaperRatesFilter(state);
      this.setDates();
    }
    else {
      this.props.handlePaperRatesUserFilter(state);
    }
  }
  handlePaperRatesUserFilter = () => {
    let state = this.state;
    this.setState({ state });
    this.props.handlePaperRatesUserFilter(state);
  }
  closeFilters = () => {
    this.props.closeFilter(false);
  }
  setFromLocation = (fromLocation) => {
    if (fromLocation === undefined) {
      fromLocation = "";
      this.setState({
        fromLocation: fromLocation,
        fromLocationIsValid: "invalid",
        toLocation: this.state.toLocation,
        toLocationIsValid: this.state.toLocationIsValid,
      });
    }
    if (fromLocation)
      this.setState({
        fromLocation: fromLocation,
        fromLocationIsValid: "valid",
      });
  }
  setToLocation = (toLocation) => {
    if (toLocation === undefined) {
      toLocation = "";
      this.setState({
        toLocation: toLocation,
        toLocationIsValid: "invalid",
      });
    }
    if (toLocation)
      this.setState({
        toLocation: toLocation,
        toLocationIsValid: "valid",
      });
  };
  handleSwapLocation = () => {
    this.setState({
      toLocation: JSON.parse(JSON.stringify(this.state.fromLocation)),
      fromLocation: JSON.parse(JSON.stringify(this.state.toLocation)),
    });
  };
  render() {
    const filterType = this.props.filterType;
    const businessName = "air";
    return (
      <React.Fragment>
        {filterType === "adminList" &&
          <div className="row">
            <div className="col-lg-12">
              <div className="bg-light border mb-2 pt-2 pb-2 pl-3 pr-3">
                <div className='row '>
                  <div className='col-lg-6 border-bottom '>
                    <h6 className='text-primary'>Filter</h6>
                  </div>
                  <div className='col-lg-6 border-bottom'>
                    <button
                      type="button"
                      className="close"
                      onClick={this.props.closeFilters}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="col-lg-12 d-flex mt-2">
                    <div class="pr-4 pt-2">
                      <div className="BE-Search-Radio">
                        <label className="d-block">Trip Type</label>
                        <div className="custom-control custom-switch d-inline-block mr-4">
                          <input
                            id="chkroundtrip"
                            name="chkroundtrip"
                            type="checkbox"
                            className="custom-control-input"
                            checked={this.state.data.isRoundTrip === 'roundtrip' ? true : false}
                            onChange={() => this.changeairTripType('roundtrip')}
                          />
                          <label className="custom-control-label" htmlFor="chkroundtrip">
                            Round Trip
                          </label>
                        </div>
                        <div className="custom-control custom-switch d-inline-block mr-4">
                          <input
                            id="chkoneway"
                            name="chkoneway"
                            type="checkbox"
                            className="custom-control-input"
                            checked={this.state.data.isRoundTrip === 'oneway' ? true : false}
                            onChange={() => this.changeairTripType('oneway')}
                          />
                          <label className="custom-control-label" htmlFor="chkoneway">
                            One Way
                          </label>
                        </div>
                        <div className="custom-control custom-switch d-inline-block mr-4">
                          <input
                            id="chkboth"
                            name="chkboth"
                            type="checkbox"
                            className="custom-control-input"
                            checked={this.state.data.isRoundTrip === 'both' ? true : false}
                            onChange={() => this.changeairTripType('both')}
                          />
                          <label className="custom-control-label" htmlFor="chkboth">
                            Both
                          </label>
                        </div>
                      </div>
                      {/* <div className="BE-Search-Radio">
                        <label className="d-block">Trip Type</label>
                        <ul>
                          <li className="checked">

                            <input
                              checked={this.state.data.isRoundTrip}
                              value="RoundTrip"
                              name="Direction"
                              type="radio"
                              onChange={() => this.changeairTripType()}
                            />
                            <label>{Trans("_airTripDirection_Roundtrip")}</label>
                          </li>
                          <li>
                            <input
                              value="OneWay"
                              name="Direction"
                              type="radio"
                              checked={!this.state.data.isRoundTrip}
                              onChange={() => this.changeairTripType()}
                            />
                            <label>{Trans("_airTripDirection_Oneway")}</label>
                          </li>
                        </ul>
                      </div> */}
                    </div>
                    <div class=" flex-fill">
                      <label htmlFor="fromlocation">
                        {Trans("_widget" + businessName + "FromLocationTitle")}
                      </label>
                      <AutoComplete
                        isValid={this.state.data.fromLocationIsValid}
                        businessName={businessName}
                        handleLocation={this.setFromLocation}
                        mode="From"
                        selectedOptions={
                          this.state.fromLocation && this.state.fromLocation.id
                            ? [this.state.fromLocation]
                            : []
                        }
                      />
                    </div>
                    <div class="mt-4 ">
                      <button className='mt-2 btn border-0 btn-link text-secondary'
                        onClick={this.handleSwapLocation}
                      >
                        <SVGIcon name="swap" width="16" height="16" type="lineal" />
                      </button>
                    </div>
                    <div class=" flex-fill">
                      <label htmlFor="tolocation">
                        {Trans("_widget" + businessName + "ToLocationTitle")}
                      </label>
                      <AutoComplete
                        isValid={this.state.data.toLocationIsValid}
                        businessName={businessName}
                        handleLocation={this.setToLocation}
                        mode="To"
                        selectedOptions={
                          this.state.toLocation && this.state.toLocation.id
                            ? [this.state.toLocation]
                            : []
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3 px-1">
                  <div className='col-lg-3'>
                    {this.renderInput("supplier", "Supplier")}
                  </div>
                  {/* <div className="col-lg-2">
                    {this.renderSelect("searchBy", "Search By", searchBy)}
                  </div>
                  <div className="col-lg-2">
                    {this.renderSelect("dateMode", "Date", dateMode, "value", "type")}
                  </div>

                  {(this.state.data.dateMode === "specific-date" || this.state.data.dateMode === "between-dates") &&
                    <div className="col-lg-3">
                      {this.renderCurrentDateWithDuration("departStartDate", (this.state.data.dateMode === "specific-date" ? "Specific Date" : "Start Date"), '2010-01-01')}
                    </div>
                  }

                  {this.state.data.dateMode === "between-dates" &&
                    <div className="col-lg-3">
                      {this.renderCurrentDateWithDuration("departEndDate", "End Date", '2010-01-01', this.state.data.fromDate)}
                    </div>
                  }

                  {this.state.data.dateMode === "specific-month" &&
                    <div className="col-lg-3">
                      {this.renderSelect("specificmonth", "Specific Month", month, "value", "name")}
                    </div>
                  } */}
                  <div className='col-lg-2'>
                    {this.renderInput("departAirlineName", "Airline Name")}
                  </div>
                  <div className='col-lg-2'>
                    {this.renderInput("departClass", "Class")}
                  </div>
                  <div className='col-lg-1'>
                    {this.renderInput("departStops", "Stops")}
                  </div>
                </div>
                <div className='row mt-3 px-1'>
                  <div className='col-lg-12 d-flex justify-content-end'>
                    <button
                      className='btn btn-primary'
                      onClick={() => this.handlePaperRatesFilter()}
                    >Apply</button>
                    <button
                      className='ml-3 btn btn-primary'
                      onClick={() => this.resetPaperRatesFilter("adminList")}
                    >Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {filterType === "userList" &&
          <div className="row">
            <div className="col-lg-12">
              <div className="bg-light border mb-2 pt-2 pb-2 pl-3 pr-3">
                <div className='row '>
                  <div className='col-lg-6 border-bottom '>
                    <h6 className='text-primary'>Filter</h6>
                  </div>
                  <div className='col-lg-6 border-bottom'>
                    <button
                      type="button"
                      className="close"
                      onClick={this.props.closeFilters}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
                <div className="row mt-3 px-1 ">
                  {/* <div className='col-lg-2'>
                    {this.renderInput("supplier", "Supplier")}
                  </div> */}
                  <div className='col-lg-2'>
                    {this.renderInput("departAirlineName", "Airline Name")}
                  </div>
                  <div className='col-lg-2'>
                    {this.renderInput("departClass", "Class")}
                  </div>
                  <div className='col-lg-1'>
                    {this.renderInput("departStops", "Stops")}
                  </div>
                  <div className='col-lg-5 mt-4'>
                    <button
                      className='btn btn-primary mt-1'
                      onClick={() => this.handlePaperRatesUserFilter()}
                    >
                      Apply
                    </button>
                    <button
                      className='ml-3 btn btn-primary mt-1'
                      onClick={() => this.resetPaperRatesFilter("userList")}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }
}

export default PaperRatesListFilter

const searchBy = [
  { value: "", name: "--Select--" },
  { value: "departdate", name: "Depart Date" },
  { value: "arrivaldate", name: "Arrival Date" }
];
const dateMode = [
  { type: "This Year", value: "this-year" },
  { type: "Previous Year", value: "previous-year" },
  { type: "This Month", value: "this-month" },
  { type: "Previous Month", value: "previous-month" },
  { type: "Specific Month", value: "specific-month" },
  { type: "Today", value: "today" },
  { type: "Tomorrow", value: "tomorrow" },
  { type: "Yesterday", value: "yesterday" },
  { type: "Specific Date", value: "specific-date" },
  { type: "Between Dates", value: "between-dates" }
];
const month = [
  { value: "1", name: "January" },
  { value: "2", name: "February" },
  { value: "3", name: "March" },
  { value: "4", name: "April" },
  { value: "5", name: "May" },
  { value: "6", name: "June" },
  { value: "7", name: "July" },
  { value: "8", name: "August" },
  { value: "9", name: "September" },
  { value: "10", name: "October" },
  { value: "11", name: "November" },
  { value: "12", name: "December" },
];