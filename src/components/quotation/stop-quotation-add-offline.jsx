import React, { Component } from 'react'
import addStops from "../../assets/images/add-stops.svg"
import checkIcon from "../../assets/images/check.svg"
import removeStops from "../../assets/images/remove-stops.svg"
import cancelStops from "../../assets/images/x-circle.svg"
import moment from "moment";
import * as Global from "../../helpers/global";
import TimeField from 'react-simple-timefield';
import Form from '../common/form';
import AutoComplete from '../search/auto-complete'
import { Trans } from '../../helpers/translate'
export class FlightStops extends Form {

  state = {
    data: {
      stopsID: this.props.data.stopsID,
      stopLocationList: [],
      stopLocation: "",
      startDate: (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master")
        ? (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
          .add((this.props.dayDepartEnd ? this.props.dayDepartEnd : 1) - 1, 'days')).format('YYYY-MM-DD')
        : moment(this.props.maxDate).add(-1, 'days').format('YYYY-MM-DD'),
      departStartTime: "",
      endDate: (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master")
        ? (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
          .add((this.props.dayDepartEnd ? this.props.dayDepartEnd : 1) - 1, 'days')).format('YYYY-MM-DD')
        : this.props.minDate,
      departEndTime: "",
      departAirlineName: "",
      departAirline: [],
      departFlightNumber: "",
      departClass: "",
      departDurationH: "",
      departDurationM: "",
      departDuration: "",
      layOverTime: ""
    },
    departStops: [],
    errors: {},
    isConfirmDelete: false,
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    let data = this.state.data;
    let isUpdateParentState = false;
    let isUpdateSelfState = false;
    let startDate = '';
    let endDate = '';

    if (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master") {
      if (this.props.dayDepart) {
        isUpdateSelfState = this.props.dayDepart !== prevProps.dayDepart;
        if (!isUpdateSelfState)
          isUpdateSelfState = this.props.dayDepartEnd !== prevProps.dayDepartEnd;
        startDate = (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
          .add(this.props.dayDepartEnd - 1, 'days')).format('YYYY-MM-DD');

        endDate =
          (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
            .add(this.props.dayDepartEnd - 1, 'days')).format('YYYY-MM-DD');
      }
      else if (this.props.dayReturn) {
        isUpdateSelfState = this.props.dayReturn !== prevProps.dayReturn;
        if (!isUpdateSelfState)
          isUpdateSelfState = this.props.dayReturnEnd !== prevProps.dayReturnEnd;
        startDate = (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayReturn ? "startDate" : "endDate"])
          .add(this.props.dayReturnEnd - 1, 'days')).format('YYYY-MM-DD');

        endDate =
          (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayReturn ? "startDate" : "endDate"])
            .add(this.props.dayReturnEnd - 1, 'days')).format('YYYY-MM-DD');
      }

    } else {
      isUpdateSelfState = this.props.minDate !== prevProps.minDate;
      if (!isUpdateSelfState)
        isUpdateSelfState = this.props.maxDate !== prevProps.maxDate;
      startDate = this.props.maxDate;
      endDate = this.props.minDate;
    }
    if (isUpdateSelfState && startDate && endDate) {
      let { data } = this.state;
      data.startDate = startDate;
      data.endDate = endDate;
      data.departStartDate = data.startDate;
      data.departEndDate = data.endDate

      this.setState({ data });
    }

    if (Object.keys(data).length !== Object.keys(prevState.data).length) {
      isUpdateParentState = true;
    }
    Object.keys(this.state.data).map(item => {
      if (!isUpdateParentState) {
        isUpdateParentState = data[item] != prevState.data[item];
      }
    });
    if (isUpdateParentState) {
      let { data } = this.state;
      if (data.departStartTime !== "" && data.departEndTime !== "") {
        let temp = (this.getTimeDifference(data.departStartTime, data.departEndTime,
          data.startDate, data.endDate)).toString();
        let data1 = (temp / 60).toString();
        data.layOverTime = data1.split(".")[0] + "h " + temp % 60 + "m ";
      }
      if (data.departDurationH !== "" && data.departDurationM !== "") {
        data.departDuration = data.departDurationH + "h " + data.departDurationM + "m";
      }
      else {
        data.departDuration = "0h 0m";
      }

      data.totaldepartDuration =
        (data.departDurationH !== "" ? parseInt(data.departDurationH) : 0) * 60 +
        (data.departDurationM !== "" ? parseInt(data.departDurationM) : 0);

      this.props.saveStops(data)
    }

  }
  getStopLocation = () => {
    let getStopLocation = {
      "id": this.props?.data?.stopLocation,
      "name": this.props?.data?.stopLocation,
      "address": this.props?.data?.stopLocation,
    }
    this.setState(preState => ({
      data: {
        ...preState.data,
        stopLocation: this.props.data.stopLocation,
        stopLocationList: getStopLocation,
      }
    }));
  }
  setStopLocation = (stopLocation) => {

    let stoplocation = {
      "id": stopLocation?.id,
      "name": stopLocation?.name,
      "address": stopLocation?.address,
    }
    if (stopLocation === undefined) {
      stopLocation = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          stopLocation: stoplocation?.address === undefined ? stopLocation : stoplocation.address,
          stopLocationList: stoplocation,
        }
      }));
    }
    if (stopLocation)
      this.setState(preState => ({
        data: {
          ...preState.data,
          stopLocation: stoplocation?.address === undefined ? stopLocation : stoplocation.address,
          stopLocationList: stoplocation,
        }
      }));
  };
  handleConfirmDelete = (mode) => {
    this.setState({ isConfirmDelete: mode })
  }
  handleDepartFlight = (data) => {
    let departFlight = {
      "id": data?.id,
      "name": data?.name,
      "address": data?.provider,
    }
    if (data === undefined || data === "") {
      data = "";
      this.setState(preState => ({
        data: {
          ...preState.data,
          departAirlineName: departFlight?.address === undefined ? data : departFlight.address,
          departAirline: departFlight,
        }
      }));
    }
    if (data) {
      this.setState(preState => ({
        data: {
          ...preState.data,
          departAirlineName: departFlight?.address === undefined ? data : departFlight.address,
          departAirline: departFlight,
        }
      }));
    }
  };
  getDepartFlight = () => {
    let getDepart = {
      "id": this.props?.data?.departAirlineName,
      "name": this.props?.data?.departAirlineName,
      "address": this.props?.data?.departAirlineName,
    }
    this.setState(preState => ({
      data: {
        ...preState.data,
        departAirlineName: this.props.data.departAirlineName,
        departAirline: getDepart,
      }
    }));
  }
  componentDidMount = () => {
    this.setImportData(this.props.data);
    this.props.data && this.getStopLocation();
    this.props.data && this.getDepartFlight();
  }
  setImportData = (item) => {
    if (Object.keys(item).length > 1)
      this.setState({ data: item });
  }
  getTimeDifference = (time1, time2, startDate, endDate) => {
    let a = new Date(startDate).toISOString().slice(0, 10);
    let b = new Date(endDate).toISOString().slice(0, 10);
    const date1 = new Date(`${a}T${(time1 === "" || time1 === undefined) ? "00:00" : time1}:00`);
    const date2 = new Date(`${b}T${(time2 === "" || time2 === undefined) ? "00:00" : time2}:00`);
    const diff = (date2.getTime() - date1.getTime()) / 1000 / 60;
    return Math.abs(diff);
  }

  render() {
    const { business, type } = this.props;
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"));
    const isPringAllowed = !((type === "Itinerary" || type === "Itinerary_Master")
      ? (quotationInfo.configurations?.isPackagePricing ?? false)
      : false);

    let currencyList = [{ name: "Select", value: "" }];
    Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        name: x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode + " (" + x.symbol + ")",
      })
    );

    let startDate = (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master")
      ? (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
        .add(this.props.dayDepartEnd - 1, 'days')).format('YYYY-MM-DD')
      : this.props.maxDate;

    let endDate = (this.props.type === "Itinerary" || this.props.type === "Itinerary_Master")
      ? (moment(JSON.parse(localStorage.getItem("quotationDetails") ?? localStorage.getItem("ManualInvoiceItems"))[this.props.dayDepart ? "startDate" : "endDate"])
        .add(this.props.dayDepart - 1, 'days')).format('YYYY-MM-DD')
      : this.props.minDate;

    return (
      <>
        <div className="col-lg-12" >
          <div className="row card m-1">
            <div className="card-header">
              <h6 className="text-primary">Stop {this.state.data.stopsID}
              </h6>
            </div>
            <div className='card-body'>
              <div className="row">
                <div className="col-lg-2" id="stopLocation">
                  <label htmlFor="stopLocation">{Trans("Stop Location")}</label>
                  <AutoComplete
                    isValid="valid"
                    businessName={business}
                    handleLocation={this.setStopLocation}
                    selectedOptions={this.state.data.stopLocationList && this.state.data.stopLocationList.id
                      ? [this.state.data.stopLocationList]
                      : []}
                    mode="From"
                  />
                </div>

                {/* <div className="col-lg-2">{this.renderInput("toStopLocation", "Arrival To")}</div> */}
                <div className="col-lg-2">
                  {this.renderSingleDate(
                    "endDate",
                    "Arrival Date",
                    this.state.data.endDate,
                    endDate,
                    "text",
                    false,
                    undefined,
                    startDate
                  )}
                </div>
                <div className="col-lg-2">
                  <div className="form-group departEndTime">
                    <label htmlFor="departEndTime">Arrival Time</label>
                    <TimeField
                      className="form-control w-100"
                      name="departEndTime"
                      value={this.state.data.departEndTime}
                      onChange={e => this.handleChange({ currentTarget: e.target })}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <label>Layover Time</label>
                  <div class="input-group-prepend">
                    <input type="text" name="layoutTime" maxlength="30"
                      value={this.state.data.layOverTime}
                      disabled={true}
                      class="form-control text-lowercase" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-2">
                  {this.renderSingleDate(
                    "startDate",
                    "Depart Date",
                    this.state.data.startDate,
                    endDate,
                    "text",
                    false,
                    undefined,
                    startDate
                  )}
                </div>

                <div className="col-lg-2">
                  <div className="form-group departStartTime">
                    <label htmlFor="departStartTime">Depart Time</label>
                    <TimeField
                      className="form-control w-100"
                      name="departStartTime"
                      value={this.state.data.departStartTime}
                      onChange={e => this.handleChange({ currentTarget: e.target })}
                    />
                  </div>
                </div>
                <div className="col-lg-2" id="fromLocation">
                  <label htmlFor="airline">Depart Airline Name</label>
                  <AutoComplete
                    isValid="valid"
                    businessName={business}
                    handleLocation={this.handleDepartFlight}
                    mode="airline"
                    selectedOptions={this.state.data.departAirline && this.state.data.departAirline.id
                      ? [this.state.data.departAirline] : []}
                  />
                </div>
                <div className="col-lg-2">
                  {this.renderInput("departFlightNumber", "Depart Flight Number")}
                </div>
                <div className="col-lg-2">{this.renderInput("departClass", "Depart Class")}</div>
                <div className="col-lg-1 ml-3">
                  {this.renderDuration(["departDurationH", "departDurationM"], "Duration")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default FlightStops