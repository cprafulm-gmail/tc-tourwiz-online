import React, { Component } from 'react'
import Form from '../components/common/form';
import { Trans } from '../helpers/translate';
import SVGIcon from "../helpers/svg-icon";
import ArrowLeftRight from "../assets/images/arrow-left-right.svg";
import QuotationMenu from "../components/quotation/quotation-menu";
import TimeField from 'react-simple-timefield';
import moment from 'moment';
import { apiRequester_quotation_api } from "../services/requester-quotation";
import * as Global from "../helpers/global";
import TaxQuotationAddOffline from '../components/quotation/tax-quotation-add-offline';
import AutoComplete from '../components/search/auto-complete';
import ActionModal from "../helpers/action-modal";
import Loader from "../components/common/loader";

class AddPaperRatesForm extends Form {
  state = {
    fromLocation: [],
    toLocation: [],
    fromLocationIsValid: "valid",
    toLocationIsValid: "valid",
    data: {
      business: "air",
      costPrice: "0",
      sellPrice: "0",
      departStartDate: "",
      departEndDate: "",
      departStartTime: "",
      departEndTime: "",
      departAirlineName: "",
      departFlightNumber: "",
      departClass: "",
      departStops: "",
      departDurationH: "",
      departDurationM: "",
      returnStartDate: "",
      returnEndDate: "",
      returnStartTime: "",
      returnEndTime: "",
      returnAirlineName: "",
      returnFlightNumber: "",
      returnClass: "",
      returnStops: "",
      returnDurationH: "",
      returnDurationM: "",
      isRoundTrip: true,
      description: "",
      seats: "",
      holdseats: 0,
      blockedseats: 0,
      avilableseats: 0,
      supplier: "",
      brn: "0",
      supplierCostPrice: "",
      supplierTaxPrice: "",
      markupPrice: "",
      CGSTPrice: 0,
      IGSTPrice: 0,
      SGSTPrice: 0,
      amountWithoutGST: 0,
      isInclusive: false,
      percentage: 0,
      processingFees: 0,
      amountWithoutGST: 0,
      isInclusive: false,
      taxType: "CGSTSGST",
      totalAmount: 0,
      isSellPriceReadonly: false,
      tpExtension: [],
    },
    isOnRequest: false,
    errors: {},
    hasErrorResponse: false,
    isLoading: this.props.editMode ? true : false,
  };

  componentDidMount() {
    this.setDates();
    const editMode = this.props.editMode;
    editMode && this.props.paperRateDetails && this.getPaperRatesDetails();
  }
  handleOnChange = () => {
    let data = this.state;
    data.isOnRequest = !data.isOnRequest;
    this.setState({ isOnRequest: data.isOnRequest });
  };
  getPaperRatesDetails = () => {
    let paperRateID = this.props.paperRateID;
    var reqURL = "paperrates/details?paperrateid=" + paperRateID;
    var reqOBJ = "";
    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (!data.response) {
          this.setState({ isLoading: false, hasErrorResponse: true });
          return;
        }

        let newData = this.state;
        let response = data.response;

        let fromLocation = {
          "id": response.fromAirportCode,
          "name": response.fromAirport,
          "countryID": response.fromLocationCountry,
          "country": response.fromLocationCountry,
          "latitude": 23.0744,
          "longitude": 72.6277,
          "priority": 0,
          "address": response.fromLocation + "," + " " + response.fromAirport + " (" + response.fromAirportCode + ") " + response.fromLocationCountry,
          "city": response.fromLocation
        }
        let toLocation = {
          "id": response.toAirportCode,
          "name": response.toAirport,
          "countryID": response.toLocationCountry,
          "country": response.toLocationCountry,
          "latitude": 23.0744,
          "longitude": 72.6277,
          "priority": 0,
          "address": response.toLocation + "," + " " + response.toAirport + " (" + response.toAirportCode + ") " + response.toLocationCountry,
          "city": response.toLocation
        }
        newData.data.isRoundTrip = response.isRoundtrip;
        newData.fromLocation = fromLocation;
        newData.toLocation = toLocation;
        newData.isOnRequest = response.onRequestPrice;
        newData.data.departFlightNumber = response.departFlightNumber;
        newData.data.departClass = response.departClass;
        newData.data.departAirlineName = response.departAirline;
        newData.data.departDurationH = response.departDuration.replace("h", "").replace("m", "").split(' ')[0];
        newData.data.departStartDate = moment(response.departFromDate).format('YYYY-MM-DD');
        newData.data.departEndDate = moment(response.departToDate).format('YYYY-MM-DD');
        newData.data.departStartTime = response.departFromDate.split('T')[1];
        newData.data.departEndTime = response.departToDate.split('T')[1];
        newData.data.departDurationM = response.departDuration.replace("h", "").replace("m", "").split(' ')[1];
        newData.data.departStops = response.departStops;
        newData.data.returnAirlineName = response.returnAirline;
        newData.data.returnClass = response.returnClass;
        newData.data.returnDurationH = response.returnDuration && response.returnDuration.replace("h", "").replace("m", "").split(' ')[0];
        newData.data.returnDurationM = response.returnDuration && response.returnDuration.replace("h", "").replace("m", "").split(' ')[1];
        newData.data.returnStartDate = moment(response.returnFromDate).format('YYYY-MM-DD');
        newData.data.returnEndDate = moment(response.returnToDate).format('YYYY-MM-DD');
        newData.data.returnStartTime = response.returnFromDate.split('T')[1];;
        newData.data.returnEndTime = response.returnToDate.split('T')[1];
        newData.data.returnStops = response.returnStops;
        newData.data.returnFlightNumber = response.returnFlightNumber;
        newData.data.supplierCostPrice = response.supplierPrice;
        newData.data.supplierTaxPrice = response.supplierTax;
        newData.data.supplier = response.supplier;
        newData.data.markupPrice = response.markup;
        newData.data.sellPrice = response.sellPrice;
        newData.data.processingFees = response.processingFees;
        newData.data.percentage = response.percentage;
        newData.data.IGSTPrice = response.igst;
        newData.data.CGSTPrice = response.cgst;
        newData.data.SGSTPrice = response.sgst;
        newData.data.taxType = response.gsTtype;
        newData.data.description = response.description;
        newData.data.seats = response.seats;
        newData.data.blockedseats = response.blocked;
        newData.data.amountWithoutGST = response.amountWithoutGST;
        newData.data.isInclusive = response.isInclusive;
        // newData.data.isInclusive=response.
        this.setState({
          isLoading: false, newData
        });
      },
      "GET"
    );
  };
  handleAmountFields = (value, e) => {

    let data = { ...this.state.data };
    let sellPrice = data.sellPrice;
    let tempSellPrice = Number(data.supplierCostPrice) + Number(data.supplierTaxPrice)
      + Number(data.markupPrice) + Number(data.processingFees) +
      Number(data.CGSTPrice) + Number(data.SGSTPrice) + Number(data.IGSTPrice);

    if (tempSellPrice === 0) {
      sellPrice = Number(data.sellPrice);
    }
    else {
      sellPrice = data.isInclusive ? Number(data.supplierCostPrice) + Number(data.supplierTaxPrice) + Number(data.markupPrice) + Number(data.CGSTPrice) + Number(data.SGSTPrice) + Number(data.IGSTPrice) + Number(data.amountWithoutGST) : Number(data.supplierCostPrice) + Number(data.supplierTaxPrice) + Number(data.markupPrice) + Number(data.CGSTPrice) + Number(data.SGSTPrice) + Number(data.IGSTPrice) + Number(data.processingFees);
    }
    data.sellPrice = Number(sellPrice);
    data.isSellPriceReadonly = (
      data.supplierCostPrice || data.supplierTaxPrice || data.markupPrice
      || data.processingFees
    ) ? true : false;
    this.setState({ data });
  }
  changeairTripType = () => {
    let newData = { ...this.state.data };
    newData.isRoundTrip = !this.state.data.isRoundTrip;
    this.setState({ data: newData });
  };
  handleTaxQuoationoData = (taxdata) => {
    let data = { ...this.state.data };
    data.CGSTPrice = taxdata.CGSTPrice;
    data.IGSTPrice = taxdata.IGSTPrice;
    data.SGSTPrice = taxdata.SGSTPrice;
    data.amountWithoutGST = taxdata.amountWithoutGST;
    data.isInclusive = taxdata.isInclusive;
    data.percentage = taxdata.percentage;
    data.processingFees = taxdata.processingFees;
    data.taxType = taxdata.taxType;
    this.setState({ data }, () => this.handleAmountFields(0, { target: { name: "", value: "" } }));
  }
  setDates = () => {
    let newData = { ...this.state.data };
    newData.departStartDate = moment().add(3, "days").format(Global.InnerDateFormate);
    newData.departEndDate = newData.departStartDate;
    newData.returnStartDate = newData.departEndDate;
    newData.returnEndDate = newData.returnStartDate;
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
  handlePaperRatesSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    let data = Object.assign({}, this.state.data);
    let state = this.state;
    this.props.handlePaperRates(state);
  }
  validate = () => {
    const errors = {};
    const { data } = { ...this.state };
    if (this.state.fromLocation.length === 0) {
      this.setFromLocation(undefined);
      errors.fromLocation = "From Location name required"
    }
    if (this.state.toLocation.length === 0) {
      this.setToLocation(undefined);
      errors.toLocation = "To Location name required"
    }
    if (!this.validateFormData(data.departAirlineName, "require")) errors.departAirlineName = "Airline name required";
    else if (data.departAirlineName && data.departAirlineName !== "" && !this.validateFormData(data.departAirlineName, "special-characters-not-allowed", /[<>]/)) errors.departAirlineName = "Invalid airline name";
    else if (errors) {
      delete Object.assign(errors)["departAirlineName"];
    }

    if (!this.validateFormData(data.departFlightNumber, "require")) errors.departFlightNumber = "Depart flight number required";
    else if (data.departFlightNumber && data.departFlightNumber !== "" && !this.validateFormData(data.departFlightNumber, "special-characters-not-allowed", /[<>]/)) errors.departFlightNumber = "Invalid Flight Number";
    else if (errors) {
      delete Object.assign(errors)["departFlightNumber"];
    }

    if (data.departDurationH && data.departDurationH !== "" && !this.validateFormData(data.departDurationH, "only-numeric")) errors.departDurationH = "Please enter Departure Duration Hour in numeric only";
    else if (errors) {
      delete Object.assign(errors)["departDurationH"];
    }
    if (data.departDurationM && data.departDurationM !== "" && !this.validateFormData(data.departDurationM, "only-numeric")) errors.departDurationM = "Please enter Departure Duration Minute in numeric only";
    else if (errors) {
      delete Object.assign(errors)["departDurationM"];
    }
    if (data.departStops && data.departStops !== "" && !this.validateFormData(data.departStops, "only-numeric")) errors.departStops = "Please enter stops in numeric only";
    else if (errors) {
      delete Object.assign(errors)["departStops"];
    }
    if (!this.validateFormData(data.departClass, "require")) errors.departClass = "Depart class name required";
    else if (data.departClass && data.departClass !== "" && !this.validateFormData(data.departClass, "special-characters-not-allowed", /[<>]/)) errors.departClass = "< and > characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["departClass"];
    }

    if (data.isRoundTrip) {
      if (!this.validateFormData(data.returnAirlineName, "require")) errors.returnAirlineName = "Return airline name required";
      else if (data.returnAirlineName && data.returnAirlineName !== "" && !this.validateFormData(data.returnAirlineName, "special-characters-not-allowed", /[<>]/)) errors.returnAirlineName = "Invalid airline name";
      else if (errors) {
        delete Object.assign(errors)["returnAirlineName"];
      }

      if (!this.validateFormData(data.returnFlightNumber, "require")) errors.returnFlightNumber = "Return flight number required";
      else if (data.returnFlightNumber && data.returnFlightNumber !== "" && !this.validateFormData(data.returnFlightNumber, "special-characters-not-allowed", /[<>]/)) errors.returnFlightNumber = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["returnFlightNumber"];
      }
      if (!this.validateFormData(data.returnClass, "require")) errors.returnClass = "Return class name required";
      else if (data.returnClass && data.returnClass !== "" && !this.validateFormData(data.returnClass, "special-characters-not-allowed", /[<>]/)) errors.returnFlightNumber = "< and > characters not allowed";
      else if (errors) {
        delete Object.assign(errors)["returnClass"];
      }
      if (data.returnDurationH && data.returnDurationH !== "" && !this.validateFormData(data.returnDurationH, "only-numeric")) errors.returnDurationH = "Please enter Return Duration Hour in numeric only";
      else if (errors) {
        delete Object.assign(errors)["returnDurationH"];
      }

      if (data.returnDurationM && data.returnDurationM !== "" && !this.validateFormData(data.returnDurationM, "only-numeric")) errors.returnDurationM = "Please enter Return Duration Minute in numeric only";
      else if (errors) {
        delete Object.assign(errors)["returnDurationM"];
      }

      if (data.returnStops && data.returnStops !== "" && !this.validateFormData(data.returnStops, "only-numeric")) errors.returnStops = "Please enter Return stops in numeric only";
      else if (errors) {
        delete Object.assign(errors)["returnStops"];
      }
    }
    if (!this.validateFormData(data.seats, "require")) errors.seats = "Seats required";
    else if (data.seats && data.seats !== "" && !this.validateFormData(data.seats, "only-numeric")) errors.seats = "Please enter seats in numeric only";
    else if (errors) {
      delete Object.assign(errors)["seats"];
    }
    if (data.description && !this.validateFormData(data.description, "special-characters-not-allowed", /[<>]/)) errors.description = "< and > characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["description"];
    }
    // if (data.seats && !this.validateFormData(data.seats, "only-numeric")) errors.seats = "Please enter seats in numeric only";
    if (!this.validateFormData(data.sellPrice, "require")) errors.sellPrice = "Sell Price required";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }
    if (data.supplierCostPrice && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.markupPrice && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup in decimal only";
    else if (errors) {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.processingFees && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter Processing Fees in decimal only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.percentage && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter Percentage in decimal only";
    else if (errors) {
      delete Object.assign(errors)["percentage"];
    }
    if (data.CGSTPrice && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.description && !this.validateFormData(data.description, "special-characters-not-allowed", /[<>]/)) errors.description = "< and > characters not allowed";
    else if (errors) {
      delete Object.assign(errors)["description"];
    }
    if (isNaN(Number(data.sellPrice)) || Number(data.sellPrice) <= 0) {
      errors.sellPrice = "Sell Price should not be less than or equal to 0";
    }
    if (Number(data.seats) < Number(data.blockedseats)) {
      errors.seats = "Total available seats count can not be less than Booked seats.";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  goBack = () => {
    this.setState({
      isSucessMsg: false
    }, () => {
      this.props.history.push(`/paperrateslist`);
    });
  };

  render() {
    const businessName = "air";
    const { isBtnLoading, isSucessMsg, isErrorMsg } = this.props;
    const { isLoading, hasErrorResponse } = this.state;
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    return (
      <React.Fragment>
        {isLoading &&
          <div className="col-lg-12 text-center p-3">
            <div className="container ">
              <Loader />
            </div>
          </div>}
        {!isLoading &&
          <React.Fragment>
            {hasErrorResponse
              ? <div className="col-lg-12 text-center p-3">
                <h6 className='text-secondary mb-3'>OOps! Some thing went wrong. Kindly try again after some time.</h6>
              </div>
              : <div className="col-lg-12 mt-2">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12 text-secondary">
                      <div className="module">
                        <div className='container'>
                          <div className='row mb-4'>
                            <div class="col-lg-12 d-flex">
                              <div class="pr-4 pt-2">
                                <div className="BE-Search-Radio">
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
                                </div>
                              </div>
                              <div class=" flex-fill">
                                <label htmlFor="fromlocation">
                                  {Trans("_widget" + businessName + "FromLocationTitle")}
                                </label>
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
                            </div>
                          </div>
                          {/* Departure Flight Details Section Start*/}
                          <div className='row'>
                            <div className="col-lg-12">
                              <span className="d-block text-primary mb-2">Enter Departure Flight Details</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="row">
                                <div className="col-lg-6">
                                  {this.renderSingleDate(
                                    "departStartDate",
                                    "Depart Date",
                                    this.state.data.departStartDate,
                                    moment().add(3, "days").format(Global.InnerDateFormate)
                                  )}
                                </div>
                                <div className="col-lg-6">
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
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="row">
                                <div className="col-lg-6">
                                  {this.renderSingleDate(
                                    "departEndDate",
                                    "Arrival Date",
                                    this.state.data.departEndDate,
                                    this.state.data.departStartDate
                                  )}
                                </div>
                                <div className="col-lg-6">
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
                              </div>
                            </div>


                          </div>
                          <div className='row'>
                            <div className="col-lg-6">
                              <div className="row">
                                <div className="col-lg-6">
                                  {this.renderInput("departAirlineName", "Airline Name")}
                                </div>
                                <div className="col-lg-6">
                                  {this.renderInput("departFlightNumber", "Flight Number")}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="row">
                                <div className="col-lg-6">{this.renderInput("departClass", "Class")}</div>
                                <div className="col-lg-3">
                                  {this.renderDuration(["departDurationH", "departDurationM"], "Duration")}
                                </div>
                                <div className="col-lg-3">{this.renderInput("departStops", "Stops")}</div>
                              </div>
                            </div>
                            {!this.state.data.isRoundTrip &&
                              <div className='col-lg-3 d-flex justify-content-center'>
                                <div className="input-group">
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="isOnRequest"
                                      id="isOnRequest"
                                      onChange={this.handleOnChange}
                                      value={this.state.isOnRequest}
                                      checked={this.state.isOnRequest}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="IsActiveYes"
                                    >
                                      On Request ?
                                    </label>
                                  </div>
                                </div>
                              </div>
                            }
                          </div>
                          {/* Departure Flight Details Section End*/}

                          {/* Return Flight Details Section Start */}
                          {this.state.data.isRoundTrip && (
                            <div className='row'>
                              <div className="col-lg-12">
                                <span className="d-block text-primary mb-2">Enter Return Flight Details</span>
                              </div>
                            </div>
                          )}
                          {this.state.data.isRoundTrip && (
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-6">
                                    {this.renderSingleDate(
                                      "returnStartDate",
                                      "Depart Date",
                                      this.state.data.returnStartDate,
                                      this.state.data.departEndDate
                                    )}
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group returnStartTime">
                                      <label htmlFor="returnStartTime">Depart Time</label>
                                      <TimeField
                                        className="form-control w-100"
                                        name="returnStartTime"
                                        value={this.state.data.returnStartTime}
                                        onChange={e => this.handleChange({ currentTarget: e.target })}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-6">
                                    {this.renderSingleDate(
                                      "returnEndDate",
                                      "Arrival Date",
                                      this.state.data.returnEndDate,
                                      this.state.data.returnStartDate
                                    )}
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group returnEndTime">
                                      <label htmlFor="returnEndTime">Arrival Time</label>
                                      <TimeField
                                        className="form-control w-100"
                                        name="returnEndTime"
                                        value={this.state.data.returnEndTime}
                                        onChange={e => this.handleChange({ currentTarget: e.target })}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          )}
                          {this.state.data.isRoundTrip && (
                            <div className='row'>
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-6">
                                    {this.renderInput("returnAirlineName", "Airline Name")}
                                  </div>
                                  <div className="col-lg-6">
                                    {this.renderInput("returnFlightNumber", "Flight Number")}
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="row">
                                  <div className="col-lg-5">{this.renderInput("returnClass", "Class")}</div>
                                  <div className="col-lg-4">
                                    {this.renderDuration(["returnDurationH", "returnDurationM"], "Duration")}
                                  </div>
                                  <div className="col-lg-3">{this.renderInput("returnStops", "Stops")}</div>
                                </div>
                              </div>
                              <div className='col-lg-3 d-flex justify-content-center'>
                                <div className="input-group">
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="isOnRequest"
                                      id="isOnRequest"
                                      onChange={this.handleOnChange}
                                      value={this.state.isOnRequest}
                                      checked={this.state.isOnRequest}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="IsActiveYes"
                                    >
                                      On Request ?
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Return Flight Details Section End */}

                          <div className='row'>
                            <div className="col-lg-12">
                              <span className="d-block text-primary mb-2">Enter Price & Availability Details</span>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-lg-6'>
                              <div className='row'>
                                <div className="col-lg-6">{this.renderInput("supplier", "Supplier")}</div>
                                <div className="col-lg-6">
                                  {this.renderInput("supplierCostPrice", "Supplier Price", "text", false, this.handleAmountFields)}
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-6'>
                              <div className='row'>

                                <div className="col-lg-6">
                                  {this.renderInput("supplierTaxPrice", "Supplier Tax", "text", false, this.handleAmountFields)}
                                </div>
                                <div className="col-lg-3">
                                  {this.renderInput("markupPrice", "Markup", "text", false, this.handleAmountFields)}
                                </div>

                                <div className="col-lg-3">
                                  {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", this.state.data.isSellPriceReadonly, this.handleAmountFields)}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="row">
                                <TaxQuotationAddOffline
                                  business="air"
                                  handleTaxQuoationoData={this.handleTaxQuoationoData}
                                  data={this.state.data}
                                  errors={this.state.errors}
                                  paperrates="true"
                                />
                                <div className="col-lg-3">{this.renderInput("seats", "Seats", "text", false, undefined, 0, 3)}</div>
                              </div>
                            </div>
                          </div>

                          <div className='row'>
                            <div className="col-lg-9">
                              {this.renderTextarea(
                                "description",
                                "Description",
                                "Add your own description or notes about the paper rates."
                              )}
                            </div>
                            <div className="col-lg-3">
                              <div className="form-group">
                                <label className="d-block">&nbsp;</label>
                                {!isBtnLoading ?
                                  <button
                                    onClick={() => this.handlePaperRatesSubmit()}
                                    className="btn btn-primary w-100 text-capitalize">
                                    {this.props.editMode ? "Edit" : "Add"}{" "}
                                    Paper Rates
                                  </button> : <button className="btn btn-primary" >
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                    {this.props.editMode ? "Edit" : "Add"}{" "}
                                    Paper Rates
                                  </button>
                                }
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            {isSucessMsg && (
                              <>
                                <div className="col-centered mb-5 ml-5">
                                  <ActionModal
                                    title="Success"
                                    message={
                                      !this.props.editMode
                                        ? "Paper Rates Added Successfully !"
                                        : "Paper Rates Updated Successfully !"
                                    }
                                    positiveButtonText={Trans("_ok")}
                                    onPositiveButton={this.goBack}
                                    handleHide={this.goBack}
                                  />
                                </div>
                              </>
                            )}
                            {isErrorMsg && (
                              <div className="col-lg-12">
                                <h6 className="alert alert-danger mt-3 d-inline-block">
                                  {isErrorMsg}
                                </h6>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default AddPaperRatesForm;