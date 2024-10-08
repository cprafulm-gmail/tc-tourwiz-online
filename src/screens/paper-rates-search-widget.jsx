import React, { Component } from 'react';
import ArrowLeftRight from "../assets/images/arrow-left-right.svg";
import AutoComplete from '../components/search/auto-complete';
import { Trans } from '../helpers/translate';
import moment from 'moment';
import Form from '../components/common/form';



export class PaperRateSearchWidget extends Form {
  state = {
    isRoundTrip: true,
    fromLocation: [],
    toLocation: [],
    FromAirportCode: '',
    ToAirportCode: '',
    DepartAirline: '',
    ReturnAirline: '',
    fromLocationIsValid: "valid",
    toLocationIsValid: "valid",
    results: [],
    resultsExport: "",
    notRecordFound: false,
    data: {
      departStartDate: "",
      departEndDate: "",
      returnStartDate: "",
      returnEndDate: "",
    },
    errors: {},

  }
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
        FromAirportCode: fromLocation.id,
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
        ToAirportCode: toLocation.id,
        toLocation: toLocation,
        toLocationIsValid: "valid",
      });
  };
  handleSearchMode = () => {
    const data = this.state;
    this.props.handleSearchMode(data);
  }
  handleViewAll = () => {
    const data = this.state.data;
    const newData = this.state;
    newData.fromLocation = [];
    newData.toLocation = [];
    newData.FromAirportCode = '';
    newData.ToAirportCode = '';
    newData.DepartAirline = '';
    newData.ReturnAirline = '';
    data.departStartDate = "";
    data.departEndDate = "";
    data.returnStartDate = "";
    data.returnEndDate = "";
    this.props.handleViewAllMode(data);
  }
  changeairTripType = () => {
    const isRoundTrip = !this.state.isRoundTrip;
    this.setState({ isRoundTrip });
    this.props.changeairTripType(isRoundTrip);
  };
  render() {
    const businessName = this.props.businessName;
    return (
      <div className="title-bg pt-3 pb-3 mb-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 d-flex justify-content-center">
              <div className="BE-Search-Radio pt-1">
                <ul className="pt-1">
                  <li className="checked">
                    <input
                      checked={this.state.isRoundTrip}
                      value="RoundTrip"
                      name="Direction"
                      type="radio"
                      onChange={() => this.changeairTripType()}
                    />
                    <label className="pt-2 pb-2">{Trans("_airTripDirection_Roundtrip")}</label>
                  </li>
                  <li>
                    <input
                      value="OneWay"
                      name="Direction"
                      type="radio"
                      checked={!this.state.isRoundTrip}
                      onChange={() => this.changeairTripType()}
                    />
                    <label className="pt-2 pb-2">{Trans("_airTripDirection_Oneway")}</label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <AutoComplete
                isValid={this.state.fromLocationIsValid}
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
            <div className='col-lg-1 d-flex justify-content-center'>
              <div className='row'>
                <div className='col-lg-12 '>
                  <button className='btn border-0'>
                    <img
                      style={{ filter: "none", height: "24px" }}
                      src={ArrowLeftRight}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <AutoComplete
                isValid={this.state.toLocationIsValid}
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
            <div className="col-lg-1">
              <button
                className="btn btn-primary"
                onClick={this.handleSearchMode}
              >
                Search
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-2 d-flex justify-content-center">
              {this.renderSingleDate(
                "departStartDate",
                "Depart Date",
                this.state.data.departStartDate,
                moment('2001-01-01').format('YYYY-MM-DD')
              )}
            </div>
            <div className="col-lg-2 d-flex justify-content-center">
              {this.renderSingleDate(
                "departEndDate",
                "Arrival Date",
                this.state.data.departEndDate,
                moment('2001-01-01').format('YYYY-MM-DD')
              )}
            </div>
            {this.state.isRoundTrip &&
              <>
                <div className="col-lg-2 d-flex justify-content-center">
                  {this.renderSingleDate(
                    "returnStartDate",
                    "Depart Date-(Return)",
                    this.state.data.returnStartDate,
                    moment('2001-01-01').format('YYYY-MM-DD')
                  )}
                </div>
                <div className="col-lg-2 d-flex justify-content-center">
                  {this.renderSingleDate(
                    "returnEndDate",
                    "Arrival Date-(Return)",
                    this.state.data.returnEndDate,
                    moment('2001-01-01').format('YYYY-MM-DD')
                  )}
                </div>
              </>
            }
            <div className="col-lg-2 mt-2 pt-4">
              <button
                className="btn btn-primary"
                onClick={this.handleViewAll}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PaperRateSearchWidget