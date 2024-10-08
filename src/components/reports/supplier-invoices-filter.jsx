import React from 'react'
import Form from "../common/form";
import SingleDate from "../common/form-birthdate";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import moment from "moment";
import Select from "react-select";

export class Filter extends Form {
    constructor(props) {
        super(props);
        this.state = {
            // business: [],
            supplier: [],
            errors: {},
            isLoadingSupplier: true
        };
    }

    componentDidMount() {
        let reqURL = "reconciliation/supplier/all?providerid=" + this.props.agentID
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ supplier: data.response, isLoadingSupplier: false })
            }.bind(this),
            "GET"
        );
    }

    handleValueChange(value, id) {
        let { errors } = this.state;
        let { data } = this.props;
        if (id === "fromdate" && new Date(value) > new Date(data["todate"])) {
            errors[id] = "From Date can not be greater To End Date.";
            this.setState({ errors });
            return;
        }
        else if (id === "todate" && new Date(value) < new Date(data["fromdate"])) {
            errors[id] = "To Date can not be less than From Date.";
            this.setState({ errors });
            return;
        } else {
            if (errors["fromdate"]) delete errors["fromdate"];
            if (errors["todate"]) delete errors["todate"];
        }

        if (id === "supplierid") {
            let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))
            if (!reportBusinessSupplier) {
                reportBusinessSupplier = {}
            }
            reportBusinessSupplier["supplierId"] = value
            sessionStorage.setItem("reportBusinessSupplier", JSON.stringify(reportBusinessSupplier))

        }

        if (id === "businessid" && data.businessid != value) {
            data["supplierid"] = "";
        }

        data[id] = value;
        if (id == "datemode" && value === "specific-month") {
            var date = (moment().set('month', data["specificmonth"] - 1)).format('YYYY-MM-DD')
            data["fromdate"] = date;
            data["todate"] = date;
        }
        if (id == "specificmonth") {
            var date = (moment().set('month', parseInt(value) - 1)).format('YYYY-MM-DD')
            data["fromdate"] = date;
            data["todate"] = date;
        }

        this.props.handleFilters(data);
    }
    // handleBusiness(value, supplierList) {
    //     this.setState({ supplier: supplierList }, () => { this.handleValueChange(value, "businessid"); })
    // }
    render() {
        const { supplier, errors } = this.state;
        const { status, data } = this.props;
        let agentSupplier = supplier.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
        let tourwizSupplier = supplier.filter(x => x.isTourwizSupplier === 1).map(item => { return { label: item.fullName, value: item.providerId } });
        const supplierOptions = [
            {
                label: "Agent Supplier",
                options: agentSupplier
            },
            {
                label: "Tourwiz Supplier",
                options: tourwizSupplier
            }
        ];
        const customStyles = {
            control: styles => ({
                ...styles,

            }),
            option: styles => ({
                ...styles,

            }),
            menu: styles => ({
                ...styles,
                width: 'auto',
                'min-width': '100%'
            })

        };
        return (
            <div>
                <div className="conatiner">
                    <div className="row">
                        {/* <div className="col-md-3">
                            <BusinessDD BusinessId={data.businessid} providerID={this.props.agentID} handleBusiness={(value, supplierList) => this.handleBusiness(value, supplierList)} />
                        </div> */}
                        <div className="col-md-3">
                            <div className={"form-group " + "supplier"}>
                                <label htmlFor={"supplier"}>{"Supplier *"}</label>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select Supplier..."
                                    id={"supplier"}
                                    defaultValue={{
                                        label: "Select",
                                        value: "",
                                    }}
                                    value={supplier.filter(x => x.providerId === parseInt(data["supplierid"])).map(item => { return { label: item.fullName, value: item.providerId } })}
                                    options={supplierOptions}
                                    onChange={(e) => {
                                        this.handleValueChange(e.value, "supplierid");
                                    }}
                                    noOptionsMessage={() => "No supplier available"}
                                    isLoading={this.state.isLoadingSupplier}
                                />
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className={"form-group InvoiceNumber"}>
                                <label htmlFor={"InvoiceNumber"}>Invoice Number</label>
                                <input
                                    name={"InvoiceNumber"}
                                    id={"InvoiceNumber"}
                                    className={"form-control"}
                                    value={data["invoicenumber"]}
                                    onChange={(e) => { this.handleValueChange(e.target.value, "invoicenumber") }}
                                />

                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={"form-group brn"}>
                                <label htmlFor={"brn"}>Booking Reference Number</label>
                                <input
                                    name={"brn"}
                                    id={"brn"}
                                    className={"form-control"}
                                    value={data["bookingrefno"]}
                                    onChange={(e) => { this.handleValueChange(e.target.value, "bookingrefno") }}
                                />

                            </div>
                        </div>

                        <div className="col-md-3">
                            <label className="d-block">Status</label>
                            <Select
                                id={"Status"}
                                defaultValue={{
                                    label: "All",
                                    value: "",
                                }}
                                value={status.filter(x => x === data.reconcillationstatus).map((statusdata, key) => {
                                    return {
                                        label: statusdata,
                                        value: statusdata,
                                    }
                                })}
                                options={status.map((statusdata, key) => {
                                    return {
                                        label: statusdata,
                                        value: statusdata,
                                    }
                                })}
                                onChange={(e) => { this.handleValueChange(e.value, "reconcillationstatus") }}
                                noOptionsMessage={() => "No status available"}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="d-block">Search By</label>
                            <select
                                value={data.searchby}
                                onChange={(e) => { this.handleValueChange(e.target.value, "searchby") }}
                                name={"options"}
                                id={"options1"}
                                className={"form-control"}>
                                {searchbylist.map((data, key) => (
                                    <option
                                        key={key}
                                        value={
                                            data.value
                                        }
                                    >
                                        {data.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="d-block">Date</label>
                            <select
                                value={data.datemode}
                                onChange={(e) => { this.handleValueChange(e.target.value, "datemode") }}
                                name={"dateMode"}
                                id={"dateMode"}
                                className={"form-control"}>
                                {dateMode.map((data, key) => (
                                    <option
                                        key={key}
                                        value={
                                            data.value
                                        }
                                    >
                                        {data.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(data["datemode"] === "specific-date" || data["datemode"] === "between-dates") &&
                            <div className="col-md-3">
                                <SingleDate
                                    type={"text"}
                                    name={"fromdate"}
                                    value={data["fromdate"]}
                                    label={"From Date"}
                                    conditiondate={new Date().setFullYear(new Date().getFullYear() + 25)}
                                    onChange={({ currentTarget: input }, picker) => { this.handleValueChange(picker.startDate.format("YYYY-MM-DD"), "fromdate") }}
                                />
                                {errors["fromdate"] && (
                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                        {errors["fromdate"]}
                                    </small>
                                )}
                            </div>
                        }
                        {data["datemode"] === "between-dates" &&
                            <div className="col-md-3">
                                <SingleDate
                                    type={"text"}
                                    name={"todate"}
                                    value={data["todate"]}
                                    label={"To Date"}
                                    conditiondate={new Date().setFullYear(new Date().getFullYear() + 25)}
                                    onChange={({ currentTarget: input }, picker) => { this.handleValueChange(picker.startDate.format("YYYY-MM-DD"), "todate") }}
                                />
                                {errors["todate"] && (
                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                        {errors["todate"]}
                                    </small>
                                )}
                            </div>
                        }

                        {data["datemode"] === "specific-month" &&
                            <div className="col-lg-3">
                                <label className="d-block">Specific Month</label>
                                <select
                                    value={data.specificmonth}
                                    onChange={(e) => { this.handleValueChange(e.target.value, "specificmonth") }}
                                    name={"specificmonth"}
                                    id={"specificmonth"}
                                    className={"form-control"}>
                                    {month.map((data, key) => (
                                        <option
                                            key={key}
                                            value={
                                                data.value
                                            }
                                        >
                                            {data.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const searchbylist = [
    { value: "", name: "Select" },
    { value: "invoicedate", name: "Invoice Date" },
    { value: "invoiceduedate", name: "Invoice Due Date" },
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

export default Filter
