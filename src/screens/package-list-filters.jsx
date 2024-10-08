import React, { Component } from "react";
import Form from "../components/common/form";
import moment from "moment";
import { apiRequester_unified_api } from "../services/requester-unified-api";

export default class PackageListFilters extends Form {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        packagename: "",
        customername: "",
        email: "",
        phone: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        rating: 0,
        countryID: "",
        stateID: "",
        cityID: ""
      },
      errors: {},
      CountryList: [],
      LoadingCountryList: false,
      StateList: [],
      LoadingStateList: false,
      CityList: [],
      LoadingCityList: false,
    };
  }

  handleFilters = () => {
    var data = this.state.data;
    if (this.state.data.dateMode === "specific-month") {
      var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
      data.fromDate = date;
      data.toDate = date;
      if (data.searchBy === "")
        data.dateMode = "";
      this.props.handleFilters(this.state.data);
    }
    else
      if (data.searchBy === "")
        data.dateMode = "";
    this.props.handleFilters(this.state.data);
  };

  handleDataChange = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    this.setState({ data });
    if (e.target.name === "countryID")
      this.getBookingStateList(e.target.value);
    if (e.target.name === "stateID")
      this.getBookingCityList(e.target.value);
  }
  handleDataChangeOld = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    this.setState({ data });
    if (e.target.name === "countryID") this.getCityList(e.target.value);
  };

  handleResetFilters = () => {
    const data = {
      packagename: "",
      customername: "",
      email: "",
      phone: "",
      fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      dateMode: "",
      specificmonth: "1",
      searchBy: "",
      rating: 0,
      countryID: "",
      stateID: "",
      cityID: "",
      packagetheme: ""
    };
    this.setState({
      data,
      businessList: [],
      StateList: [],
      CityList: [],
      supplierList: [{ name: "Select", value: '' }]
    });
    sessionStorage.removeItem("reportBusinessSupplier");
    this.props.handleFilters(data);
  };

  setDefaultFilter = () => {
    /* 
    let filter = this.state.data;

    filter.fromDate = moment().format('YYYY-MM-DD');
    filter.toDate = moment().format('YYYY-MM-DD');
    filter.searchBy = "bookbefore";
    filter.dateMode = "today"; 
    */
    this.setState({ data: this.props.filterData });
  }


  getCountryList = () => {
    const { providerID } = this.state;
    const reqOBJ = {};
    let reqURL = "cms/package/getcountry";
    this.setState({ LoadingCountryList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        resonsedata.response = resonsedata.response.sort((a, b) =>
          a.countryName > b.countryName
            ? 1
            : b.countryName > a.countryName
              ? -1
              : 0
        );
        this.setState({
          CountryList: resonsedata.response,
          LoadingCountryList: false,
        });
      }.bind(this),
      "GET"
    );
  };
  getStateList = (countryID, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode) {
      data.stateID = "";
      data.cityID = "";
    }
    if (countryID === "") {
      this.setState({ StateList: [], CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        countryID: countryID,
      },
    };
    let reqURL = "admin/lookup/state";
    this.setState({ LoadingStateList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        this.setState({
          StateList: resonsedata.response,
          CityList: [],
          data,
          LoadingStateList: false,
        });
        if (isLoadingEditMode && data.stateID) {
          this.getCityList(data.stateID, true);
        }
      }.bind(this),
      "POST"
    );
  };
  getCityList = (countryID, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode) data.cityID = "";
    if (countryID === "") {
      this.setState({ CityList: [], data });
      return;
    }
    const reqOBJ = {};
    let reqURL = "cms/package/getcitybycountry?countryid=" + countryID;
    this.setState({ LoadingCityList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        this.setState({
          CityList: resonsedata.response,
          data,
          LoadingCityList: false,
        });
      }.bind(this),
      "GET"
    );
  };

  getBookingCountryList = () => {
    const { providerID } = this.state;
    const reqOBJ = {
      request: {
      }
    };
    let reqURL = "admin/lookup/country";
    this.setState({ LoadingCountryList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
      this.setState({ CountryList: resonsedata.response, LoadingCountryList: false })
    }.bind(this), "POST");
  }
  getBookingStateList = (countryId, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode) {
      data.state = "";
      data.city = "";
    }
    if (countryId === "") {
      this.setState({ StateList: [], CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        CountryID: countryId
      }
    };
    let reqURL = "admin/lookup/state";
    this.setState({ LoadingStateList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ StateList: resonsedata.response, CityList: [], data, LoadingStateList: false });
      if (isLoadingEditMode && data.state) {
        this.getCityList(data.state, true);
      }
    }.bind(this), "POST");
  }
  getBookingCityList = (stateId, isLoadingEditMode) => {
    let { data } = this.state;
    if (!isLoadingEditMode)
      data.cityID = "";
    if (stateId === "") {
      this.setState({ CityList: [], data });
      return;
    }
    const reqOBJ = {
      request: {
        IsActive: "true",
        StateID: stateId,
        CountryID: data.countryID
      }
    };
    let reqURL = "admin/lookup/city";
    this.setState({ LoadingCityList: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
    }.bind(this), "POST");
  }

  componentDidMount() {
    //if (this.props.filterMode)
    this.props.onRef(this);
    this.getBookingCountryList();
    this.setDefaultFilter();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { name, title, email, phone, data, CountryList, StateList, CityList, LoadingCityList, LoadingStateList, LoadingCountryList } = this.state;

    return (
      <div className="mb-3 col-12 pl-0 pr-0">
        <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
          <h5 className="text-primary border-bottom pb-2 mb-2">
            Filters
            <button
              type="button"
              className="close"
              onClick={this.props.showHideFilters}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h5>

          <div className="row">
            <div className={this.props.isHidePackageType ? "d-none" : "col-lg-3"}>
              {this.renderSelect("packagetheme", "Category", themeType)}
            </div>
            <div className="col-lg-3">
              {this.renderInput("packagename", "Package Name")}
            </div>
            {!this.props.isMarkeetPlace &&
              localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") &&
              <React.Fragment>
                <div className="col-lg-3">
                  {this.renderInput("customername", "Customer Name")}
                </div>
                <div className="col-lg-3">
                  {this.renderInput("email", "Email")}
                </div>
                <div className="col-lg-3">
                  {this.renderInput("phone", "Phone")}
                </div>
              </React.Fragment>
            }
            <div className="col-lg-3">
              {this.renderSelect("rating", "Star Rating", startRating)}
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className={"form-group " + "Country"}>
                <label htmlFor={"countryID"}>{"Country"}</label>
                <div className="input-group">
                  <select
                    value={data.countryID}
                    onChange={(e) => this.handleDataChange(e)}
                    name={"countryID"}
                    id={"countryID"}
                    className={"form-control"}>
                    <option key={0} value={''}>Select</option>
                    {CountryList.map((option, key) => (
                      <option
                        key={key}
                        value={
                          option["countryId"]
                        }
                      >
                        {option["countryName"]}
                      </option>
                    ))}
                  </select>
                  {LoadingCountryList ? (
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className={"form-group " + "State"}>
                <label htmlFor={"stateID"}>{"State"}</label>
                <div className="input-group">
                  <select
                    value={data.stateID}
                    onChange={(e) => this.handleDataChange(e)}
                    name={"stateID"}
                    id={"stateID"}
                    className={"form-control"}>
                    <option key={0} value={''}>Select</option>
                    {StateList.map((option, key) => (

                      <option
                        key={key}
                        value={
                          option["stateId"]
                        }
                      >
                        {option["stateName"]}
                      </option>
                    ))}
                  </select>
                  {LoadingStateList ? (
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className={"form-group " + "city"}>
                <label htmlFor={"cityID"}>{"City"}</label>
                <div className="input-group">
                  <select
                    value={data.cityID}
                    onChange={(e) => this.handleDataChange(e)}
                    name={"cityID"}
                    id={"cityID"}
                    className={"form-control"}>
                    <option key={0} value={''}>Select</option>
                    {CityList.map((option, key) => (

                      <option
                        key={key}
                        value={
                          option["cityId"]
                        }
                      >
                        {option["cityName"]}
                      </option>
                    ))}
                  </select>
                  {LoadingCityList ? (
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              {this.renderSelect("searchBy", "Search By", searchByItinerary)}
            </div>
            <div className={`col-lg-3 ${this.state.data.searchBy === "" && "d-none"}`}>
              {this.renderSelect("dateMode", "Date", dateMode, "value", "type")}
            </div>

            {(this.state.data.dateMode === "specific-date" || this.state.data.dateMode === "between-dates") &&
              <div className="col-lg-3">
                {this.renderCurrentDateWithDuration("fromDate", (this.state.data.dateMode === "specific-date" ? "Specific Date" : "Start Date"), '2010-01-01')}
              </div>
            }

            {this.state.data.dateMode === "between-dates" &&
              <div className="col-lg-3">
                {this.renderCurrentDateWithDuration("toDate", "End Date", '2010-01-01')}
              </div>
            }

            {this.state.data.dateMode === "specific-month" &&
              <div className="col-lg-3">
                {this.renderSelect("specificmonth", "Specific Month", month, "value", "name")}
              </div>
            }

            <div className="col-lg-3">

              <div className="form-group">
                <label className="d-block">&nbsp;</label>
                <button
                  name="Apply"
                  onClick={this.handleFilters}
                  className="btn btn-primary"
                >
                  Apply
                </button>
                <button
                  name="reset"
                  onClick={this.handleResetFilters}
                  className="btn btn-primary  ml-2"
                >
                  Reset
                </button>


              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const searchByItinerary = [
  { value: "", name: "Select" },
  { value: "createddate", name: "Created Date" },
  { value: "startdate", name: "Start Date" },
  { value: "enddate", name: "End Date" },
  { value: "bookbefore", name: "Book Before Date" }
];

const themeType = [
  { value: "0", name: "Select" },
  { value: "3", name: "Holiday" },
  { value: "1", name: "Hotel" },
  { value: "2", name: "Flight" },
  { value: "5", name: "Activity" },
  { value: "11", name: "Transfers" },
  { value: "12", name: "Other" },
];

const startRating = [
  { value: "0", name: "Select" },
  { value: "1", name: "1" },
  { value: "2", name: "2" },
  { value: "3", name: "3" },
  { value: "4", name: "4" },
  { value: "5", name: "5" }
];

const dateMode = [
  { type: "Select", value: "" },
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
]
const month = [
  { value: "", name: "Select" },
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
