import React, { Component } from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import DateRangePicker from "../common/date-range";
import moment from "moment";

class ManualBookingAddOffline extends Form {
  state = {
    data: {
      business: this.props.business,
      fromLocation: "",
      toLocation: "",
      toLocationCity: "",
      name: "",
      startDate: "",
      endDate: "",
      costPrice: "",
      sellPrice: "",
      vendor: "",
      brn: "",
      itemType: "",
      noRooms: "",
      rating: "",
      duration: "",
      guests: "",
      adult: "",
      child: "",
      infant: "",
      pickupType: "",
      dropoffType: "",
      pickupTime: "",
      departStartDate: "",
      departEndDate: "",
      departStartTime: "",
      departEndTime: "",
      departAirlineName: "",
      departFlightNumber: "",
      departClass: "",
      departStops: "",
      departDuration: "",
      returnStartDate: "",
      returnEndDate: "",
      returnStartTime: "",
      returnEndTime: "",
      returnAirlineName: "",
      returnFlightNumber: "",
      returnClass: "",
      returnStops: "",
      returnDuration: "",
      isRoundTrip: false,
      uuid: "",
      day: 1,
      toDay: 1,
      nights: 1,
      dayDepart: 1,
      dayDepartEnd: 1,
      dayReturn: 1,
      dayReturnEnd: 1,
      dates: {
        checkInDate: moment()
          .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.cutOffDays, 'days')
          .format(Global.DateFormate),
        checkOutDate: moment()
          .add(Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.cutOffDays
            + Global.getEnvironmetKeyValue("availableBusinesses").find((x) => x.name === this.props.business)?.stayInDays, 'days')
          .format(Global.DateFormate)
      },
      datesIsValid: "valid",
      cutOfDays: 3,
      stayInDays: 1,
      description: "",
    },
    errors: {},
    staticBRN: "",
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (this.props.business === "hotel" || this.props.business === "activity") {
      if (!this.validateFormData(data.toLocation, "require"))
        errors.toLocation = "Location required";
      if (!this.validateFormData(data.name, "require")) errors.name = "Name required";
      if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
    }

    if (this.props.business === "hotel") {
      if (!this.validateFormData(data.endDate, "require")) errors.endDate = "Check Out required";
      if (!this.validateFormData(data.itemType, "require")) errors.itemType = "Room Type required";
      if (!this.validateFormData(data.noRooms, "require")) errors.noRooms = "No of Rooms required";
    }

    if (this.props.business === "activity") {
      if (!this.validateFormData(data.duration, "require")) errors.duration = "Duration required";
      if (!this.validateFormData(data.guests, "require")) errors.guests = "Guests required";
      if (!this.validateFormData(data.itemType, "require"))
        errors.itemType = "Activity Type required";
    }

    if (this.props.business === "transfers") {
      if (!this.validateFormData(data.fromLocation, "require"))
        errors.fromLocation = "Pickup Location required";
      if (!this.validateFormData(data.pickupType, "require")) errors.pickupType = "Type required";
      if (!this.validateFormData(data.toLocation, "require"))
        errors.toLocation = "Dropoff Location required";
      if (!this.validateFormData(data.dropoffType, "require")) errors.dropoffType = "Type required";
      if (!this.validateFormData(data.startDate, "require")) errors.startDate = "Check In required";
      if (!this.validateFormData(data.duration, "require")) errors.duration = "Start Time required";
      if (!this.validateFormData(data.guests, "require")) errors.guests = "Guests required";
      if (!this.validateFormData(data.itemType, "require"))
        errors.itemType = "Transfers Type required";
    }

    if (!this.validateFormData(data.costPrice, "require")) errors.costPrice = "Cost Price required";
    if (!this.validateFormData(data.sellPrice, "require")) errors.sellPrice = "Sell Price required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleAddItem = () => {
    let data = this.state.data;
    data.business = this.props.business;
    data.uuid = this.generateUUID();
    if (this.props.type === "Itinerary") {
      data.startDate = moment(data.startDate)
        .add(data.day - 1, "days")
        .format("MM/DD/YYYY");
      data.endDate = moment(data.startDate).add(data.nights, "days").format("MM/DD/YYYY");

      data.departStartDate = moment(data.departStartDate)
        .add(data.dayDepart - 1, "days")
        .format("MM/DD/YYYY");
      data.departEndDate = moment(data.departStartDate)
        .add(data.dayDepartEnd - 1, "days")
        .format("MM/DD/YYYY");

      data.returnStartDate = moment(data.departStartDate)
        .add(data.dayReturn - 1, "days")
        .format("MM/DD/YYYY");
      data.returnEndDate = moment(data.departStartDate)
        .add(data.dayReturnEnd - 1, "days")
        .format("MM/DD/YYYY");
    }
    this.props.handleOffline(data);
    if (this.props.type === "Itinerary") {
      this.setDates();
    }
  };

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    this.setState({ data: newData });
  };

  changeairTripType = () => {
    let newData = { ...this.state.data };
    newData.isRoundTrip = !this.state.data.isRoundTrip;
    this.setState({ data: newData });
  };

  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  setDates = () => {
    let newData = { ...this.state.data };
    newData.startDate = new Date();
    newData.endDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    newData.departStartDate = new Date();
    newData.departEndDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    newData.returnStartDate = new Date();
    newData.returnEndDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    this.setState({ data: newData });
  };

  setImportData = () => { };

  componentDidMount() {
    this.setDates();
  }

  render() {
    const { business } = this.props;
    const type = "Quotation";
    const count = 2;
    const duration = [];
    let days = [];
    let nights = [];
    duration.map((item) => {
      days.push({ name: "Day " + (item + 1), value: item + 1 });
      nights.push({ name: item + 1, value: item + 1 });
    });
    nights.pop();

    let returnDays = [...Array(count + 3).keys()];
    let daysReturn = [];
    returnDays.map((item) => {
      daysReturn.push({ name: "Day " + (item + 1), value: item + 1 });
    });

    const starRating = [
      { name: "Select", value: "" },
      { name: "1", value: "1" },
      { name: "2", value: "2" },
      { name: "3", value: "3" },
      { name: "4", value: "4" },
      { name: "5", value: "5" },
    ];

    const PickupStartTime = [
      { name: "Select", value: "" },
      { name: "12:00 am", value: "12:00 am" },
      { name: "12:30 am", value: "12:30 am" },
      { name: "12:59 am", value: "12:59 am" },
      { name: "01:00 am", value: "01:00 am" },
      { name: "01:30 pm", value: "01:30 pm" },
      { name: "01:59 am", value: "01:59 am" },
      { name: "02:00 am", value: "02:00 am" },
      { name: "02:30 am", value: "02:30 am" },
      { name: "02:59 am", value: "02:59 am" },
      { name: "03:00 am", value: "03:00 am" },
      { name: "03:30 am", value: "03:30 am" },
      { name: "03:59 am", value: "03:59 am" },
      { name: "04:00 am", value: "04:00 am" },
      { name: "04:30 am", value: "04:30 am" },
      { name: "04:59 am", value: "04:59 am" },
      { name: "05:00 am", value: "05:00 am" },
      { name: "05:30 am", value: "05:30 am" },
      { name: "05:59 am", value: "05:59 am" },
      { name: "06:00 am", value: "06:00 am" },
      { name: "06:30 am", value: "06:30 am" },
      { name: "06:59 am", value: "06:59 am" },
      { name: "07:00 am", value: "07:00 am" },
      { name: "07:30 am", value: "07:30 am" },
      { name: "07:59 am", value: "07:59 am" },
      { name: "08:00 am", value: "08:00 am" },
      { name: "08:30 am", value: "08:30 am" },
      { name: "08:59 am", value: "08:59 am" },
      { name: "09:00 am", value: "09:00 am" },
      { name: "09:30 am", value: "09:30 am" },
      { name: "09:59 am", value: "09:59 am" },
      { name: "10:00 am", value: "10:00 am" },
      { name: "10:30 am", value: "10:30 am" },
      { name: "10:59 am", value: "10:59 am" },
      { name: "11:00 am", value: "11:00 am" },
      { name: "11:30 am", value: "11:30 am" },
      { name: "11:59 am", value: "11:59 am" },
      { name: "12:00 pm", value: "12:00 pm" },
      { name: "12:30 pm", value: "12:30 pm" },
      { name: "12:59 pm", value: "12:59 pm" },
      { name: "01:00 pm", value: "01:00 pm" },
      { name: "01:30 pm", value: "01:30 pm" },
      { name: "01:59 pm", value: "01:59 pm" },
      { name: "02:00 pm", value: "02:00 pm" },
      { name: "02:30 pm", value: "02:30 pm" },
      { name: "02:59 pm", value: "02:59 pm" },
      { name: "03:00 pm", value: "03:00 pm" },
      { name: "03:30 pm", value: "03:30 pm" },
      { name: "03:59 pm", value: "03:59 pm" },
      { name: "04:00 pm", value: "04:00 pm" },
      { name: "04:30 pm", value: "04:30 pm" },
      { name: "04:59 pm", value: "04:59 pm" },
      { name: "05:00 pm", value: "05:00 pm" },
      { name: "05:30 pm", value: "05:30 pm" },
      { name: "05:59 pm", value: "05:59 pm" },
      { name: "06:00 pm", value: "06:00 pm" },
      { name: "06:30 pm", value: "06:30 pm" },
      { name: "06:59 pm", value: "06:59 pm" },
      { name: "07:00 pm", value: "07:00 pm" },
      { name: "07:30 pm", value: "07:30 pm" },
      { name: "07:59 pm", value: "07:59 pm" },
      { name: "08:00 pm", value: "08:00 pm" },
      { name: "08:30 pm", value: "08:30 pm" },
      { name: "08:59 pm", value: "08:59 pm" },
      { name: "09:00 pm", value: "09:00 pm" },
      { name: "09:30 pm", value: "09:30 pm" },
      { name: "09:59 pm", value: "09:59 pm" },
      { name: "10:00 pm", value: "10:00 pm" },
      { name: "10:30 pm", value: "10:30 pm" },
      { name: "10:59 pm", value: "10:59 pm" },
      { name: "11:00 pm", value: "11:00 pm" },
      { name: "11:30 pm", value: "11:30 pm" },
      { name: "11:59 pm", value: "11:59 pm" },
    ];

    const durationList = [
      { name: "Select", value: "" },
      { name: "30 minutes", value: "30 minutes" },
      { name: "1 hour", value: "1 hour" },
      { name: "1 hour 30 minutes", value: "1 hour 30 minutes" },
      { name: "2 hours", value: "2 hours" },
      { name: "2 hours 30 minutes", value: "2 hours 30 minutes" },
      { name: "3 hours", value: "3 hours" },
      { name: "3 hours 30 minutes", value: "3 hours 30 minutes" },
      { name: "4 hours", value: "4 hours" },
      { name: "4 hours 30 minutes", value: "4 hours 30 minutes" },
      { name: "5 hours", value: "5 hours" },
      { name: "5 hours 30 minutes", value: "5 hours 30 minutes" },
      { name: "6 hours", value: "6 hours" },
      { name: "6 hours 30 minutes", value: "6 hours 30 minutes" },
      { name: "7 hours", value: "7 hours" },
      { name: "7 hours 30 minutes", value: "7 hours 30 minutes" },
      { name: "8 hours", value: "8 hours" },
      { name: "8 hours 30 minutes", value: "8 hours 30 minutes" },
      { name: "9 hours", value: "9 hours" },
      { name: "9 hours 30 minutes", value: "9 hours 30 minutes" },
      { name: "10 hours", value: "10 hours" },
      { name: "10 hours 30 minutes", value: "10 hours 30 minutes" },
      { name: "11 hours", value: "11 hours" },
      { name: "11 hours 30 minutes", value: "11 hours 30 minutes" },
      { name: "12 hours", value: "12 hours" },
      { name: "12 hours 30 minutes", value: "12 hours 30 minutes" },
      { name: "13 hours", value: "13 hours" },
      { name: "13 hours 30 minutes", value: "13 hours 30 minutes" },
      { name: "14 hours", value: "14 hours" },
      { name: "14 hours 30 minutes", value: "14 hours 30 minutes" },
      { name: "15 hours", value: "15 hours" },
      { name: "15 hours 30 minutes", value: "15 hours 30 minutes" },
      { name: "16 hours", value: "16 hours" },
      { name: "16 hours 30 minutes", value: "16 hours 30 minutes" },
      { name: "17 hours", value: "17 hours" },
      { name: "17 hours 30 minutes", value: "17 hours 30 minutes" },
      { name: "18 hours", value: "18 hours" },
      { name: "18 hours 30 minutes", value: "18 hours 30 minutes" },
      { name: "19 hours", value: "19 hours" },
      { name: "19 hours 30 minutes", value: "19 hours 30 minutes" },
      { name: "20 hours", value: "20 hours" },
      { name: "20 hours 30 minutes", value: "20 hours 30 minutes" },
      { name: "21 hours", value: "21 hours" },
      { name: "21 hours 30 minutes", value: "21 hours 30 minutes" },
      { name: "22 hours", value: "22 hours" },
      { name: "22 hours 30 minutes", value: "22 hours 30 minutes" },
      { name: "23 hours", value: "23 hours" },
      { name: "23 hours 30 minutes", value: "23 hours 30 minutes" },
      { name: "1 day", value: "1 day" },
    ];

    return (
      <div className="p-3">
        <div className="row">
          {(business === "hotel" || business === "activity") && (
            <React.Fragment>
              <div className="col-lg-3">{this.renderInput("name", "Name")}</div>
              <div className="col-lg-3">{this.renderInput("toLocation", "Address / Location")}</div>
            </React.Fragment>
          )}

          {business === "hotel" && (
            <React.Fragment>
              {type === "Quotation" && (
                <div className="col-lg-4">
                  <DateRangePicker
                    isValid={this.props.datesIsValid}
                    cutOfDays={this.state.data.cutOfDays}
                    stayInDays={this.state.data.stayInDays}
                    minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                    maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                    isSingleDateRangePicker={false}
                    handleDateChange={this.setDate}
                    dates={this.props.dates}
                    business={business}
                  />
                </div>
              )}

              {type === "Itinerary" && (
                <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days)}</div>
              )}

              {type === "Itinerary" && (
                <div className="col-lg-2">
                  {this.renderSelect("nights", "No of Nights", nights)}
                </div>
              )}

              <div className="col-lg-2">
                {this.renderSelect("rating", "Star Rating", starRating)}
              </div>

              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-3 text-nowrap">
                    {this.renderInput("noRooms", "No of Rooms")}
                  </div>
                  <div className="col-lg-9">{this.renderInput("itemType", "Room Type")}</div>
                </div>
              </div>
            </React.Fragment>
          )}

          {business === "activity" && (
            <React.Fragment>
              {type === "Quotation" && (
                <div className="col-lg-2">
                  {this.renderCurrentDate("startDate", "Date", this.state.data.startDate)}
                </div>
              )}

              {type === "Itinerary" && (
                <div className="col-lg-2">{this.renderSelect("day", "Itinerary Day", days)}</div>
              )}

              <div className="col-lg-2">
                {!this.props.importItem && this.renderSelect("duration", "Duration", durationList)}
                {this.props.importItem && this.renderInput("duration", "Duration")}
              </div>

              <div className="col-lg-2">{this.renderInput("guests", "No of Guests")}</div>
              <div className="col-lg-5">{this.renderInput("itemType", "Activity Type")}</div>
            </React.Fragment>
          )}

          {business === "air" && (
            <React.Fragment>
              <div className="col-lg-2">
                <label className="d-block" style={{ marginBottom: "14px" }}>
                  Trip Type
                </label>
                <div className="BE-Search-Radio">
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

              <div className="col-lg-5">{this.renderInput("fromLocation", "From")}</div>

              <div className="col-lg-5">{this.renderInput("toLocation", "To")}</div>

              <div className="col-lg-12">
                {this.state.data.isRoundTrip && (
                  <span className="d-block text-primary mb-2">Enter Departure Flight Details</span>
                )}
                <div className="row">
                  <div className="col-lg-3">
                    <div className="row">
                      {type === "Quotation" && (
                        <div className="col-lg-7">
                          {this.renderCurrentDate(
                            "departStartDate",
                            "Depart Date",
                            this.state.data.departStartDate
                          )}
                        </div>
                      )}

                      {type === "Itinerary" && (
                        <div className="col-lg-7">
                          {this.renderSelect("dayDepart", "Depart Day", days)}
                        </div>
                      )}

                      <div className="col-lg-5">
                        {this.renderTimeDuration("departStartTime", "Depart Time")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="row">
                      {type === "Quotation" && (
                        <div className="col-lg-7">
                          {this.renderCurrentDate(
                            "departEndDate",
                            "Arrival Date",
                            this.state.data.departEndDate
                          )}
                        </div>
                      )}

                      {type === "Itinerary" && (
                        <div className="col-lg-7">
                          {this.renderSelect("dayDepartEnd", "Arrival Day", days)}
                        </div>
                      )}

                      <div className="col-lg-5">
                        {this.renderTimeDuration("departEndTime", "Arrival Time")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
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
                      <div className="col-lg-5">{this.renderInput("departClass", "Class")}</div>
                      <div className="col-lg-4">
                        {this.renderTimeDuration("departDuration", "Duration")}
                      </div>
                      <div className="col-lg-3">{this.renderInput("departStops", "Stops")}</div>
                    </div>
                  </div>
                </div>
              </div>

              {this.state.data.isRoundTrip && (
                <div className="col-lg-12">
                  <span className="d-block text-primary mb-2">Enter Return Flight Details</span>
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="row">
                        {type === "Quotation" && (
                          <div className="col-lg-7">
                            {this.renderCurrentDate(
                              "returnStartDate",
                              "Depart Date",
                              this.state.data.returnStartDate
                            )}
                          </div>
                        )}

                        {type === "Itinerary" && (
                          <div className="col-lg-7">
                            {this.renderSelect("dayReturn", "Depart Day", days)}
                          </div>
                        )}

                        <div className="col-lg-5">
                          {this.renderTimeDuration("returnStartTime", "Depart Time")}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="row">
                        {type === "Quotation" && (
                          <div className="col-lg-7">
                            {this.renderCurrentDate(
                              "returnEndDate",
                              "Arrival Date",
                              this.state.data.returnEndDate
                            )}
                          </div>
                        )}

                        {type === "Itinerary" && (
                          <div className="col-lg-7">
                            {this.renderSelect("dayReturnEnd", "Arrival Day", daysReturn)}
                          </div>
                        )}

                        <div className="col-lg-5">
                          {this.renderTimeDuration("returnEndTime", "Arrival Time")}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
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
                          {this.renderTimeDuration("returnDuration", "Duration")}
                        </div>
                        <div className="col-lg-3">{this.renderInput("returnStops", "Stops")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-lg-3">
                <div className="row">
                  <div className="col-lg-4">{this.renderInput("adult", "Adult")}</div>
                  <div className="col-lg-4">{this.renderInput("child", "Child")}</div>
                  <div className="col-lg-4">{this.renderInput("infant", "Infant")}</div>
                </div>
              </div>

              {/* <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-6">{this.renderInput("vendor", "Vendor/Supplier")}</div>
                  <div className="col-lg-6">{this.renderInput("brn", "BRN")}</div>
                </div>
              </div> */}
            </React.Fragment>
          )}

          {business === "transfers" && (
            <React.Fragment>
              {!this.props.importItem && (
                <React.Fragment>
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("fromLocation", "Pick-up Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("pickupType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.renderInput("toLocation", "Drop-off Location")}
                      </div>
                      <div className="col-lg-6 text-nowrap d-none">
                        {this.renderInput("dropoffType", "Type (eg. Airport, Hotel)")}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              {this.props.importItem && (
                <div className="col-lg-8">{this.renderInput("name", "Transfer Name")}</div>
              )}

              <div className="col-lg-4">
                <div className="row">
                  {type === "Quotation" && (
                    <div className="col-lg-6">
                      {this.renderCurrentDate(
                        "startDate",
                        "Transfers Date",
                        this.state.data.startDate
                      )}
                    </div>
                  )}

                  {type === "Itinerary" && (
                    <div className="col-lg-6">
                      {this.renderSelect("day", "Itinerary Day", days)}
                    </div>
                  )}

                  {this.props.importItem && (
                    <div className="col-lg-6 text-nowrap">
                      {this.renderInput("duration", "Duration")}
                    </div>
                  )}

                  {!this.props.importItem && (
                    <div className="col-lg-6 text-nowrap">
                      {this.renderSelect("pickupTime", "Pick-up Time", PickupStartTime)}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-8 text-nowrap">
                    {this.renderInput("itemType", "Vehicle Type (eg. Bus, Sedan)")}
                  </div>
                  <div className="col-lg-4">{this.renderInput("guests", "No of Guests")}</div>
                </div>
              </div>
            </React.Fragment>
          )}

          {business === "custom" && (
            <React.Fragment>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-4">{this.renderInput("toLocation", "Location")}</div>
                  <div className="col-lg-5">{this.renderInput("name", "Item Name")}</div>
                  {type === "Quotation" && (
                    <div className="col-lg-3">
                      {this.renderCurrentDate("startDate", "Date", this.state.data.startDate)}
                    </div>
                  )}
                  {type === "Itinerary" && (
                    <div className="col-lg-3">
                      {this.renderSelect("day", "Itinerary Day", days)}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-3">
                {this.renderInput("itemType", "Item Type (eg. Restaurant, Guide)")}
              </div>
            </React.Fragment>
          )}

          {/* {(business === "hotel" || business === "activity") && (
            <div className="col-lg-3">
              <div className="row">
                <div className="col-lg-6">{this.renderInput("vendor", "Vendor/Supplier")}</div>
                <div className="col-lg-6">{this.renderInput("brn", "BRN")}</div>
              </div>
            </div>
          )} */}

          {/* {business === "transfers" && (
            <React.Fragment>
              <div className="col-lg-4">
                <div className="row">
                  <div className="col-lg-6">{this.renderInput("vendor", "Vendor/Supplier")}</div>
                  <div className="col-lg-6">{this.renderInput("brn", "BRN")}</div>
                </div>
              </div>
            </React.Fragment>
          )} */}

          <div className={business === "custom" ? "col-lg-3" : "col-lg-4"}>
            <div className="row">
              {/* <div className="col-lg-6">{this.renderInput("costPrice", "Cost Price")}</div> */}
              <div className="col-lg-6">{this.renderInput("sellPrice", "Sell Price")}</div>
            </div>
          </div>

          <div className="col-lg-12">
            {this.renderTextarea(
              "description",
              "Description",
              "Add your own description or notes about the item you would like to share with the client."
            )}
          </div>

          <div className="col-lg-2">
            <div className="form-group">
              <button
                onClick={() => this.handleAddItem()}
                className="btn btn-primary w-100 text-capitalize"
              >
                Book {Trans("_widgetTab" + business + "")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManualBookingAddOffline;
