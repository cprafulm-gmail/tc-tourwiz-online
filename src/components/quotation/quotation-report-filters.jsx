import React, { Component } from "react";
import Form from "../common/form";
import moment from "moment";
import Select from "react-select";

export default class QuotationReportFilters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                customername: "",
                inquiryNumber: "",
                email: "",
                phone: "",
                title: "",
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                inquirysource: "",
                othersource: "",
                triptype: "",
                inquirytype: "",
                bookingfor: "",
                dateMode: "",
                specificmonth: "1",
                searchBy: "",
                groupBy: "inquirytype",
                stayInDays: 30,
                bookedBy: null,
                priority: "",
            },
            errors: {},
            isBtnLoading: false,
            isBtnLoadingMode: ''
        };
    }

    handleFilters = () => {
        var data = this.state.data;
        if (data.inquirysource === "All")
            data.inquirysource = "";
        if (this.state.data.dateMode === "specific-month") {
            var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
            data.fromDate = date;
            data.toDate = date;
            if (data.searchBy === "")
                data.dateMode = "";
            this.props.handleFilters(this.state.data);
        }
        else {
            if (data.searchBy === "")
                data.dateMode = "";
            this.props.handleFilters(this.state.data);
        }
    };
    handleResetFilters = () => {
        const data = {
            customername: "",
            inquiryNumber: "",
            email: "",
            phone: "",
            title: "",
            fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            inquirysource: "",
            triptype: "",
            inquirytype: "",
            bookingfor: "",
            dateMode: "",
            specificmonth: "1",
            searchBy: "",
            groupBy: "inquirytype",
            bookedBy: null,
            priority: "",
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
        /* let filter = this.state.data;
    
        filter.fromDate = moment().format('YYYY-MM-DD');
        filter.toDate = moment().format('YYYY-MM-DD');
        filter.searchBy = "followupdate";
        filter.dateMode = "today"; */
        let valueObj = inquirysource.find(x => (x.value === this.props.filterData.inquirysource || x.name === this.props.filterData.inquirysource));
        if (valueObj) {
            this.props.filterData.inquirysource = valueObj.type ?? valueObj.name;
        }
        else {
            this.props.filterData.othersource = this.props.filterData.inquirysource;
            this.props.filterData.inquirysource = "Other";
        }

        this.setState({ data: this.props.filterData });
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        //if (this.props.filterMode)
        this.setDefaultFilter();

    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    render() {
        const customStyles = {
            control: styles => ({ ...styles, "textTransform": "capitalize" }),
            option: styles => ({ ...styles, "textTransform": "capitalize", "backgroundColor": "white", "color": "black" }),
            menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
        };
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
                            {this.renderSelect("inquirytype", "Inquiry Type", inquirytype)}
                        </div>
                        <div className="col-lg-3">
                            {this.renderInput("title", "Title")}
                        </div>
                        {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") &&
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
                            </React.Fragment>}
                        <div className="col-lg-3">
                            {this.renderSelect("inquirysource", "Inquiry Source", inquirysource)}
                        </div>
                        {this.state.data.inquirysource === "Other" &&
                            <div className="col-lg-3">
                                {this.renderInput("othersource", "Inquiry Source (Other)")}
                            </div>}
                        <div className="col-lg-3">
                            {this.renderSelect("triptype", "Trip Type", triptype)}
                        </div>
                        <div className="col-lg-3">
                            {this.renderSelect("bookingfor", "Booking For Source", bookingfor)}
                        </div>
                        {this.props.reportType === "InquiryReport" && this.props.employeeList.find(x => x.crewID === 3 && x.isLoggedinEmployee) &&
                            <div className="col-lg-3">
                                <div className={"form-group"}>
                                    <label htmlFor={"bookedBy"}>{"Employee"}</label>
                                    <Select
                                        styles={customStyles}
                                        placeholder={this.props.employeeList.find(x => x.value === 0).label}
                                        id={"bookedBy"}
                                        value={this.state.data.bookedBy ? this.props.employeeList.find(x => x.userID === this.state.data.bookedBy) : null}
                                        options={this.props.employeeList}
                                        onChange={(e) => {
                                            this.handleChange({ currentTarget: { value: e.userID, label: "bookedBy" } })
                                        }}
                                        noOptionsMessage={() => "No employee(s) available"}
                                        isLoading={false}
                                    />
                                </div>
                            </div>}

                        <div className="col-lg-3">
                            {this.renderInput("inquiryNumber", "Inquiry Number")}
                        </div>
                        {localStorage.getItem('portalType') !== 'B2C' && localStorage.getItem("userToken") &&
                            <React.Fragment>
                                <div className="col-lg-3">
                                    <div className={"form-group"}>
                                        <label htmlFor={"priority"}>{"Priority"}</label>
                                        <Select
                                            styles={customStyles}
                                            placeholder="Select priority..."
                                            id={"priority"}
                                            value={prioritylist.find(x => x.value === this.state.data.priority)}
                                            options={prioritylist}
                                            onChange={(e) => {
                                                this.handleChange({ currentTarget: { value: e.value, name: "priority" } })
                                            }}
                                            noOptionsMessage={() => "No priority(s) available"}
                                            isLoading={this.state.isLoadingEmployees}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        <div className="col-lg-3">
                            {this.renderSelect("searchBy", "Search By", searchBy)}
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
                                {!this.props.isBtnLoadingMode &&
                                    <button
                                        name="Apply"
                                        onClick={this.handleFilters}
                                        className="btn btn-primary">
                                        Apply
                                    </button>}
                                {this.props.isBtnLoadingMode && this.props.isBtnLoadingMode === '' &&
                                    <button
                                        name="Apply"
                                        onClick={this.handleFilters}
                                        className="btn btn-primary">
                                        Apply
                                    </button>}
                                {this.props.isBtnLoadingMode && this.props.isBtnLoadingMode !== '' &&
                                    <button className="btn btn-primary" >
                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                        Apply
                                    </button>}
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

const searchBy = [
    { value: "", name: "Select" },
    { value: "createddate", name: "Created Date" },
    { value: "startdate", name: "Start Date" },
    { value: "followupdate", name: "Followup Date" }
];

const inquirysource = [
    { value: "", name: "All" },
    { name: "Call Center", value: "Call Center" },
    { name: "Walkin", value: "Walkin" },
    { name: "Email", value: "Email" },
    { value: "Website", name: "Website" },
    { name: "Referred By", value: "Referred By" },
    { name: "Social Media", value: "Social Media" },
    { name: "Self", value: "Self" },
    { name: "Other", value: "Other" }
];

const triptype = [
    { value: "", name: "All" },
    { value: "Domestic", name: "Domestic" },
    { value: "International", name: "International" },
    { value: "Both", name: "Both" }
];

const prioritylist = [
    { label: "All", value: "" },
    { label: "High", value: "High" },
    { label: "Moderate", value: "Moderate" },
    { label: "Low", value: "Low" },
];

const inquirytype = [
    { value: "", name: "All" },
    { value: "Packages", name: "Packages" },
    { value: "Air", name: "Flight" },
    { value: "Hotel", name: "Hotel" },
    { value: "Activity", name: "Activity" },
    { value: "Transfers", name: "Transfers" },
    { value: "Visa", name: "Visa" },
    { value: "Rail", name: "Rail" },
    { value: "Forex", name: "Forex" },
    { value: "Bus", name: "Bus" },
    { value: "Rent a Car", name: "Rent a Car" }
];

const bookingfor = [
    { value: "", name: "All" },
    { value: "Individual", name: "Individual" },
    { value: "Corporate", name: "Corporate" }
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
