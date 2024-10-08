import React, { Component } from "react";
import Form from "../components/common/form";
import moment from "moment";

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
        dateMode: "this-month",
        specificmonth: "1",
        searchBy: "createddate",
        rating: 0
      },
      errors: {}
    };
  }

  handleFilters = () => {
    if (this.state.data.dateMode === "specific-month") {
      var data = this.state.data;
      var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
      data.fromDate = date;
      data.toDate = date;
      this.props.handleFilters(this.state.data);
    }
    else
      this.props.handleFilters(this.state.data);
  };

  handleResetFilters = () => {
    const data = {
      packagename: "",
      customername: "",
      email: "",
      phone: "",
      fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      dateMode: "this-month",
      specificmonth: "1",
      searchBy: "createddate",
      rating: 0
    };
    this.setState({
      data,
      businessList: [],
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

  componentDidMount() {
    //if (this.props.filterMode)
    this.props.onRef(this);
    this.setDefaultFilter();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { name, title, email, phone } = this.state;

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
            <div className="col-lg-3">
              {this.renderInput("packagename", "Package Name")}
            </div>
            <div className="col-lg-3">
              {this.renderInput("customername", "Customer Name")}
            </div>
            <div className="col-lg-3">
              {this.renderInput("email", "Email")}
            </div>
            <div className="col-lg-3">
              {this.renderInput("phone", "Phone")}
            </div>
            <div className="col-lg-3">
              {this.renderSelect("rating", "Star Rating", startRating)}
            </div>
            <div className="col-lg-3">
              {this.renderSelect("searchBy", "Search By", searchByItinerary)}
            </div>
            <div className="col-lg-3">
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
  { value: "createddate", name: "Created Date" },
  { value: "startdate", name: "Start Date" },
  { value: "enddate", name: "End Date" }
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
