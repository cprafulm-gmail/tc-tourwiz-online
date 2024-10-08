import React, { Component } from "react";
import Form from "../common/form";
import moment from "moment";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Customerselection from "../reports/customer-selection";

export default class Filters extends Form {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                type: "",
                customerName: "",
                email: "",
                phone: "",
                title: "",
                createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                createdtodate: moment().format('YYYY-MM-DD'),
                dateMode: "",
                invoicenumber: "",
                specificmonth: "1",
                searchBy: "",
                //groupBy: "inquirytype",
                stayInDays: 30,
                invoicereconciliationstatus: "All"
            },
            errors: {},
            status: [],
            customerData: Object.keys(this.props.customerData).length > 0 ? this.props.customerData : {}
        };
    }

    handleFilters = () => {
        var data = this.state.data;
        if (this.state.data.dateMode === "specific-month") {
            var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
            data.createdfromdate = date;
            data.createdtodate = date;
            if (data.searchBy === "")
                data.dateMode = "";
            this.props.handleFilters(this.state.data, this.state.customerData);
        }
        else
            if (data.searchBy === "")
                data.dateMode = "";
        this.props.handleFilters(this.state.data, this.state.customerData);
    };

    handleResetFilters = () => {
        const data = {
            type: "",
            customerName: "",
            customerid: null,
            email: "",
            phone: "",
            title: "",
            createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            createdtodate: moment().format('YYYY-MM-DD'),
            dateMode: "",
            specificmonth: "1",
            invoicenumber: "",
            searchBy: "",
            //groupBy: "inquirytype",
            stayInDays: 30,
            invoicereconciliationstatus: "All"
        };
        this.setState({
            data, customerData: {}
        });
        this.props.handleFilters(data, {});
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

    selectCustomer = (item) => {
        let data = this.state.data;
        data["customerid"] = item.customerID;
        data["customerName"] = item.displayName;
        this.setState({ data, customerData: item });
    }

    componentDidMount() {
        //if (this.props.filterMode)
        this.props.onRef(this);
        this.setDefaultFilter();
        let reqURL = "reconciliation/customer/status?type=reconcilition"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = []
                for (let value of data.response) {
                    arr.push({ name: value, value })
                }
                this.setState({ status: arr })
            }.bind(this),
            "GET"
        );
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    render() {
        const { name, title, email, phone, customerData } = this.state;
        const { status } = this.state
        const { agentID } = this.props;
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
                        <div className="col-lg-4">
                            <Customerselection
                                key={JSON.stringify(customerData)}
                                agentID={agentID}
                                customerData={customerData}
                                selectCustomer={this.selectCustomer}
                                /* resetCustomer={this.resetCustomer} */
                                mode="text-only" />
                        </div>
                        <div className="col-lg-2">
                            {this.renderSelect("type", "Type", invoiceType)}
                        </div>
                        <div className="col-lg-3">
                            {this.renderInput("invoicenumber", "Invoice / Voucher Number")}
                        </div>
                        <div className="col-lg-3">
                            {this.renderSelect("searchBy", "Search By", searchByItinerary)}
                        </div>

                        {this.state.data.searchBy !== "" &&
                            <div className="col-lg-3">
                                {this.renderSelect("dateMode", "Date", dateMode, "value", "type")}
                            </div>
                        }
                        {(this.state.data.dateMode === "specific-date" || this.state.data.dateMode === "between-dates") &&
                            <div className="col-lg-3">
                                {this.renderCurrentDateWithDuration("createdfromdate", (this.state.data.dateMode === "specific-date" ? "Specific Date" : "Start Date"), '2010-01-01')}
                            </div>
                        }

                        {this.state.data.dateMode === "between-dates" &&
                            <div className="col-lg-3">
                                {this.renderCurrentDateWithDuration("createdtodate", "End Date", '2010-01-01')}
                            </div>
                        }

                        {this.state.data.dateMode === "specific-month" &&
                            <div className="col-lg-3">
                                {this.renderSelect("specificmonth", "Specific Month", month, "value", "name")}
                            </div>
                        }
                        <div className="col-lg-3">
                            {this.renderSelect("invoicereconciliationstatus", "Reconciliation Status", status)}
                        </div>
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
    { value: "invoicedate", name: "Invoice Date" },
    { value: "invoiceduedate", name: "Invoice Due Date" }
];

const searchByQuotation = [
    { value: "", name: "Select" },
    { value: "createddate", name: "Created Date" },
    { value: "bookbefore", name: "Book Before" }
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

const invoiceType = [
    { value: "", name: "All" },
    { value: "Invoice", name: "Invoice" },
    { value: "Voucher", name: "Voucher" }
];
