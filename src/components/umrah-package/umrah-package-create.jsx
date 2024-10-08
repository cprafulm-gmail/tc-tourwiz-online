import React, { Component } from "react";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import CallCenter from "../../components/call-center/quotation-call-center";
import DateRangePicker from "../common/date-range";
import moment from "moment";
import SVGIcon from "../../helpers/svg-icon";
import HotelPaxWidgetUmrah from "../search/hotel-pax-widget-umrah"
import * as DropdownList from "../../helpers/dropdown-list";

class UmrahPackageCreate extends Form {
  state = {
    data: {
      customerName: "",
      email: "",
      phone: "",
      title: "",
      duration: "",
      startDate: "",
      endDate: "",
      dates: "",
      datesIsValid: "valid",
      cutOfDays: 1,
      stayInDays: 4,
      createdDate: "",
      status: "",
      umrahTravelTo: 0,
      umrahPax: [
        {
          groupID: 1,
          noOfRooms: 1,
          noOfAdults: 2,
          noOfChild: 0
        }
      ],
      umrahNationality: Global.getEnvironmetKeyValue("PortalCountryCode"),
      umrahCountryOfResidence: Global.getEnvironmetKeyValue("PortalCountryCode"),
      umrahRoute: Global.getTransportationLookupData("route").length > 0 ? Global.getTransportationLookupData("route")[0].id : "",
      umrahNoOfVehicle: 1,
      umrahPaxIsValid: "valid",
      umrahFlight: true,
      umrahArrivalAirLocationName: "",
      umrahArrivalAirLocationCode: "",
      umrahArrivalAirLocationCountryCode: "",
      umrahDepartureAirLocationName: "",
      umrahDepartureAirLocationCode: "",
      umrahDepartureAirLocationCountryCode: "",
      umrahHotelCityName1: "",
      umrahHotelLocationCode1: "",
      umrahHotelLocationCountryCode1: "",
      umrahHotelCityName2: "",
      umrahHotelLocationCode2: "",
      umrahHotelLocationCountryCode2: ""
    },
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;
    if (localStorage.getItem("isUmrahPortal")) {
      if (data.umrahTravelTo == 0)
        errors.umrahTravelTo = "Please select Travel To.";
      else {
        //data.customerName = "Customer Name";
        data.title = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).name;
        data.customerName = data.title;
        data.umrahArrivalAirLocationName = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).arrivalAirLocationName;
        data.umrahArrivalAirLocationCode = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).arrivalAirLocationCode;
        data.umrahArrivalAirLocationCountryCode = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).arrivalAirLocationCountryCode;
        data.umrahDepartureAirLocationName = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).departureAirLocationName;
        data.umrahDepartureAirLocationCode = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).departureAirLocationCode;
        data.umrahDepartureAirLocationCountryCode = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).departureAirLocationCountryCode;
        data.umrahHotelCityName1 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelCityName1;
        data.umrahHotelLocationCode1 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelLocationCode1;
        data.umrahHotelLocationCountryCode1 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelLocationCountryCode1;
        data.umrahHotelCityName2 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelCityName2;
        data.umrahHotelLocationCode2 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelLocationCode2;
        data.umrahHotelLocationCountryCode2 = DropdownList.LookupTravelTo.find(x => x.value === data.umrahTravelTo).hotelLocationCountryCode2;
      }
      if (data.umrahPaxIsValid === "invalid")
        errors.umrahPax = Trans("_widgetPaxMessage");
      if (!this.validateFormData(data.umrahNoOfVehicle, "numeric") || isNaN(parseInt(data.umrahNoOfVehicle)))
        errors.umrahNoOfVehicle = "Enter valid No. of Vehicle";
      if (errors.umrahNoOfVehicle === undefined && (parseInt(data.umrahNoOfVehicle) <= 0 || parseInt(data.umrahNoOfVehicle) > 25))
        errors.umrahNoOfVehicle = "No. of Vehicle between 0 and 25.";

      if (errors.umrahNoOfVehicle === undefined) {
        let TotalPax = data.umrahPax.reduce((itemName, item) => itemName + (item.noOfRooms * item.noOfAdults) + (item.noOfRooms * item.noOfChild), 0);
        if (parseInt(data.umrahNoOfVehicle) > TotalPax)
          errors.umrahNoOfVehicle = "No. of Vehicle should not more then total number of passenger";
      }
    }
    else {
      if (!this.validateFormData(data.customerName, "require"))
        errors.customerName = "Customer Name required";

      //if (umrahPax.map)
      // if (TotalPax == 0) {
      //   errors.umrahPax = "Please select valid passenger information."
      // }
      if (!this.validateFormData(data.title, "require"))
        errors.title = "Quotation title required";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleCreate = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.props.handleCreate(this.state.data);
  };

  setData = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(localStorage.getItem("isUmrahPortal") ? localStorage.getItem("umrahPackageDetails") : sessionStorage.getItem("bookingForInfo"));

    defautData.title = this.props.title ? this.props.title : "";

    defautData.customerName =
      bookingForInfo && bookingForInfo.firstName
        ? bookingForInfo.firstName
        : this.props.customerName || "";

    defautData.email =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.email
        : this.props.email || "";

    defautData.phone =
      bookingForInfo && bookingForInfo.contactInformation
        ? bookingForInfo.contactInformation.phoneNumber
        : this.props.phone || "";

    defautData.startDate =
      bookingForInfo && bookingForInfo.startDate
        ? bookingForInfo.startDate
        : this.props.startDate || moment(new Date().setDate(new Date().getDate() + 5)).format(Global.DateFormate);

    defautData.endDate =
      bookingForInfo && bookingForInfo.endDate
        ? bookingForInfo.endDate
        : this.props.endDate ||
        moment(new Date().setDate(new Date().getDate() + 10)).format(Global.DateFormate);

    defautData.duration = this.GetDuration(
      defautData.startDate,
      defautData.endDate
    );

    defautData.createdDate =
      bookingForInfo && bookingForInfo.createdDate
        ? bookingForInfo.createdDate
        : this.props.createdDate || new Date();

    defautData.status = this.props.status ? this.props.status : "";

    if (bookingForInfo != null) {

      defautData.umrahTravelTo =
        bookingForInfo && bookingForInfo.umrahTravelTo
          ? bookingForInfo.umrahTravelTo
          : "";

      defautData.umrahNationality =
        bookingForInfo && bookingForInfo.umrahNationality
          ? bookingForInfo.umrahNationality
          : "";

      defautData.umrahCountryOfResidence =
        bookingForInfo && bookingForInfo.umrahCountryOfResidence
          ? bookingForInfo.umrahCountryOfResidence
          : "";

      defautData.umrahRoute =
        bookingForInfo && bookingForInfo.umrahRoute
          ? bookingForInfo.umrahRoute
          : "";

      defautData.umrahPax =
        bookingForInfo && bookingForInfo.umrahPax
          ? bookingForInfo.umrahPax
          : "";

      defautData.umrahNoOfVehicle =
        bookingForInfo && bookingForInfo.umrahNoOfVehicle
          ? bookingForInfo.umrahNoOfVehicle
          : "";

      defautData.umrahFlight =
        bookingForInfo && bookingForInfo.umrahFlight
          ? bookingForInfo.umrahFlight
          : "";

    }
    this.setState({ data: defautData });
  };

  setDate = (startDate, endDate, message) => {
    let error = this.state.errors;

    if (message) {
      error.date = message;
      this.setState({ errors: error });
      return;
    }
    else
      error.date = null;

    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    newData.duration = this.GetDuration(startDate, endDate);
    this.setState({ data: newData, errors: error });
  };

  GetDuration = (startDate, endDate) => {
    var tmpStartDate = moment([
      moment(startDate)._d.getFullYear(),
      moment(startDate)._d.getMonth(),
      moment(startDate)._d.getDate(),
    ]);
    var tmpEndDate = moment([
      moment(endDate)._d.getFullYear(),
      moment(endDate)._d.getMonth(),
      moment(endDate)._d.getDate(),
    ]);
    var totaldaysduration = tmpEndDate.diff(tmpStartDate, "days") + 1;
    return totaldaysduration;
  };

  componentDidMount() {
    this.setData();
  }

  handlePax = (pax) => {
    let data = this.state.data;
    data.umrahPax = pax;
    if (pax.reduce((sum, item) => sum += ((item.noOfChild * item.noOfRooms) + (item.noOfAdults * item.noOfRooms)), 0) > 9)
      data.umrahPaxIsValid = "invalid";
    else
      data.umrahPaxIsValid = "valid";
    this.setState({
      data: data
    });
  };

  IsUmrahFlight = () => {
    let data = { ...this.state.data };
    data.umrahFlight = !this.state.data.umrahFlight;
    this.setState({
      data
    });
  };

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    const { type } = this.props;

    return (
      <div className="quotation-create border p-3 mt-3 bg-white shadow-sm mb-3 position-relative">
        <div className="row">
          {type === "Quotation" && (
            <React.Fragment>
              <div className="col-lg-3 position-relative">
                {this.renderInput(
                  "customerName",
                  Trans("_customerNamewithstar")
                )}{" "}
                {isPersonateEnabled && (
                  <div
                    className="position-absolute"
                    style={{ right: "20px", top: "32px" }}
                  >
                    <CallCenter />
                  </div>
                )}
              </div>

              <div className="col-lg-3">
                {this.renderInput("email", Trans("_lblEmailWithStar"))}
              </div>

              <div className="col-lg-2">
                {this.renderInput("phone", Trans("_lblContactPhoneWithStar"))}
              </div>

              <div className="col-lg-3">
                {this.renderInput("title", Trans("_quotationTitleWithStar"))}
              </div>

              <div className="col-lg-1">
                <div className="form-group phone">
                  <label>&nbsp;&nbsp;</label>
                  <button
                    onClick={this.handleCreate}
                    className="btn btn-primary"
                  >
                    {this.props.customerName
                      ? Trans("_update")
                      : Trans("_create")}
                  </button>
                </div>
              </div>
            </React.Fragment>
          )}

          {type === "umrah-package" && (
            <React.Fragment>

              {localStorage.getItem("isUmrahPortal") &&
                (
                  <React.Fragment>
                    <div className="col-lg-4">
                      {this.renderSelect("umrahTravelTo", "Travel To", DropdownList.LookupTravelTo, "value", "name")}
                    </div>
                    <div className="col-lg-4 position-relative">
                      {localStorage.getItem("isUmrahPortal") &&
                        <HotelPaxWidgetUmrah
                          roomDetails={this.state.data.umrahPax}
                          handlePax={this.handlePax}
                          isValid={this.umrahPaxIsValid}
                          mode={"umrah-package"}
                        />
                      }
                    </div>

                    {/* <div className="col-lg-4 position-relative">
                      {this.renderSelect("umrahRoute", "Route", JSON.parse(localStorage.getItem("transportation_route_" + localStorage.getItem("lang"))), "id", "name")}
                    </div> */}

                    <div className="col-lg-2 position-relative">
                      {this.renderSelect("umrahNationality", "Nationality", DropdownList.CountryList, "isoCode", "name")}
                    </div>

                    <div className="col-lg-2 position-relative">
                      {this.renderSelect("umrahCountryOfResidence", "Country of Residence", DropdownList.CountryList, "isoCode", "name")}
                    </div>

                    <div className="col-lg-2">
                      {this.renderInput("umrahNoOfVehicle", "No. of Vehicle")}
                    </div>
                  </React.Fragment>
                )
              }
              {!localStorage.getItem("isUmrahPortal") &&
                (
                  <React.Fragment>

                    <div className="col-lg-4 position-relative">
                      {this.renderInput(
                        "customerName",
                        Trans("_customerNamewithstar")
                      )}{" "}
                      {isPersonateEnabled && (
                        <div
                          className="position-absolute"
                          style={{ right: "20px", top: "32px" }}
                        >
                          <CallCenter />
                        </div>
                      )}
                    </div>

                    <div className="col-lg-4">
                      {this.renderInput("email", Trans("_lblEmailWithStar"))}
                    </div>

                    <div className="col-lg-4">
                      {this.renderInput("phone", Trans("_lblContactPhoneWithStar"))}
                    </div>

                    <div className="col-lg-4">
                      {this.renderInput("title", Trans("Itinerary Title *"))}
                    </div>
                  </React.Fragment>
                )
              }

              <div className="col-lg-4">
                <DateRangePicker
                  isValid={this.props.datesIsValid}
                  cutOfDays={this.state.data.cutOfDays}
                  stayInDays={this.state.data.stayInDays}
                  minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                  maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                  isSingleDateRangePicker={false}
                  handleDateChange={this.setDate}
                  dates={
                    this.props.startDate
                      ? {
                        checkInDate: this.state.data.startDate
                          ? this.state.data.startDate
                          : this.props.startDate,
                        checkOutDate: this.state.data.endDate
                          ? this.state.data.endDate
                          : this.props.endDate,
                      }
                      : this.props.dates ? null :
                        {
                          checkInDate: moment(new Date().setDate(new Date().getDate() + 5)).format(Global.DateFormate),
                          checkOutDate: moment(new Date().setDate(new Date().getDate() + 10)).format(Global.DateFormate),
                        }
                  }
                  business={"createItinerary"}
                />
                {this.state.errors && this.state.errors.date &&
                  <small class="alert alert-secondary p-1 d-inline-block">
                    Selectd date not changed due to minimum 5 days stay in required.
                  </small>
                }
              </div>

              <div className="col-lg-2">
                {this.renderInput("duration", Trans("Duration (Days)"))}
              </div>

              <div className="col-lg-4">
                <div className="col-lg-12 custom-control custom-checkbox mt-4">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="chkAgree"
                    checked={!this.state.data.umrahFlight}
                    onChange={() => this.IsUmrahFlight()}
                  />
                  <label
                    className="custom-control-label text-secondary"
                    htmlFor="chkAgree"
                  >{this.state.data.umrahFlight ? "Book Umrah Package Without Flight" : "Book Umrah Package With Flight"}</label>
                </div>
              </div>

              <div className={"col-lg-3"}>
                <div className="form-group phone">
                  <label className="d-block">&nbsp;&nbsp;</label>
                  <button
                    onClick={this.handleCreate}
                    className="btn btn-primary w-100"
                  >
                    {this.props.customerName
                      ? Trans("_update")
                      : Trans("_create")}{" "}
                    {localStorage.getItem("isUmrahPortal") ? "Umrah Package" : "Itinerary"}
                  </button>
                </div>
              </div>
              {this.props.customerName && (
                <div className={"col-lg-4"}>
                  <div className="form-group phone">
                    <label className="d-block">&nbsp;&nbsp;</label>
                    <div class="alert alert-secondary" role="alert">
                      <div className="float-left mt-1 mr-2">
                        <SVGIcon
                          name="info-circle"
                          width="16"
                          height="16"
                          className="d-flex align-items-center text-secondary"
                        ></SVGIcon>
                      </div>
                      <span>All selected items will removed.</span>
                    </div>
                  </div>
                </div>)}
            </React.Fragment>
          )}
        </div>

        {
          this.props.customerName && (
            <button
              className="btn btn-sm position-absolute p-1 border-left border-bottom rounded-0 bg-light"
              style={{ top: "0px", right: "0px" }}
              onClick={this.handleCreate}
            >
              <SVGIcon
                name="times"
                width="16"
                height="16"
                className="d-flex align-items-center text-secondary"
              ></SVGIcon>
            </button>
          )
        }
      </div >
    );
  }
}

export default UmrahPackageCreate;

