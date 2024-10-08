import React, { Component } from "react";
import Form from "../common/form";
import moment from "moment";

export default class QuotationReportFilters extends Form {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        customername: "",
        email: "",
        phone: "",
        title: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        //groupBy: "inquirytype",
        type: "",
        stayInDays: 30,
      },
      errors: {},
      isBtnLoadingMode: "",

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
      this.props.handleFilters(this.state.data, "filter");
    }
    else
      if (data.searchBy === "")
        data.dateMode = "";
    this.props.handleFilters(this.state.data, "filter");
  };

  handleResetFilters = () => {

    const data = {
      customername: "",
      email: "",
      phone: "",
      title: "",
      fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      dateMode: "",
      specificmonth: "1",
      searchBy: "",
      type: "Itinerary",
      //groupBy: "inquirytype",
      stayInDays: 30,
    };
    this.setState({
      data,
      businessList: [],
      supplierList: [{ name: "Select", value: '' }]
    });
    sessionStorage.removeItem("reportBusinessSupplier");
    this.props.handleFilters(data, "reset");
  };

  setDefaultFilter = () => {
    /* 
    let filter = this.state.data;

    filter.fromDate = moment().format('YYYY-MM-DD');
    filter.toDate = moment().format('YYYY-MM-DD');
    filter.searchBy = "bookbefore";
    filter.dateMode = "today"; 
    */
    this.setState({ data: this.props.filterData, isBtnLoadingMode: this.props.isBtnLoadingMode, });
  }

  componentDidMount() {
    this.props.onRef(this);
    //if (this.props.filterMode)
    this.setDefaultFilter();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { name, title, email, phone } = this.state;
    let mode = this.props.mode;
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
              {this.renderInput("title", "Title")}
            </div>
            {(mode === 'quotation' || mode === 'itinerary') &&
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
              {this.renderSelect("searchBy", "Search By", this.props.mode === "itinerary" ? searchByItinerary : searchByQuotation)}
            </div>
            <div className="col-lg-3">
              {this.renderSelect("type", "Type", Type)}
            </div>
            {(this.state.data.searchBy !== "") &&
              <div className="col-lg-3">
                {this.renderSelect("dateMode", "Date", dateMode, "value", "type")}
              </div>
            }
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
                {(this.props.isBtnLoadingMode === "" || this.props.isBtnLoadingMode !== "filter") && (
                  <button
                    name="Apply"
                    onClick={this.handleFilters}
                    className="btn btn-primary"
                  >
                    Apply
                  </button>
                )}
                {this.props.isBtnLoadingMode === "filter" && (
                  <button className="btn btn-primary">
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Apply
                  </button>
                )}
                {(this.props.isBtnLoadingMode === "" || this.props.isBtnLoadingMode !== "reset") &&
                  <button
                    name="reset"
                    onClick={this.handleResetFilters}
                    className="btn btn-primary  ml-2"

                  >
                    Reset
                  </button>
                }
                {this.props.isBtnLoadingMode === "reset" && (
                  <button className="btn btn-primary ml-2">
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Reset
                  </button>
                )}

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
  { value: "bookbefore", name: "Book Before" }
];

const searchByQuotation = [
  { value: "", name: "Select" },
  { value: "createddate", name: "Created Date" },
  { value: "bookbefore", name: "Book Before" }
];
const Type = [
  { value: "Itienerary", name: "Itienerary" },
  { value: "Quotation", name: "Quotation" },
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
