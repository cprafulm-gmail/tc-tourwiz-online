import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import * as Global from "../../helpers/global";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import BusinessDD from "./business-dropdown"
import Select from "react-select";

export default class ReportsFilters extends Form {
    constructor(props) {
        super(props);

        let businessList = Global.getEnvironmetKeyValue("availableBusinesses").map(
            business => {
                return { value: business.aliasId ? business.aliasId : business.id, name: Trans("_" + business.name) };
            }
        );

        if (this.props.reportType === "SupplierReport" || this.props.providerId && this.props.reportType === "SupplierPaymentReport")
            businessList = [];

        this.state = {
            data: {
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                stayInDays: 30,
                customername: "",
                inquiryNumber: "",
                businessId: "",
                bookingrefno: "",
                bookedBy: null,
                groupBy: this.props.groupByfilter,
                searchBy: "",
                bookingStatus: "",
                dateMode: "",
                specificmonth: "1",
                inquiryType: "",
                inquiryDetails: "",
                opportunityStatus: "",
                opportunityStage: "",
                supplier: "",
                customerId: "",
                supplierId: "",
                transactionToken: "",
                itineraryRefNo: "",
                priority: ""
            },
            bookedByData: [{ label: "All", value: 0 }],
            businessList: businessList,
            supplierList: [{ name: "All", value: '' }],
            dataSupplier: [],
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
            fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            customername: "",
            inquiryNumber: "",
            businessId: "",
            bookingrefno: "",
            bookedBy: null,
            groupBy: this.props.groupByfilter,
            searchBy: "",
            bookingStatus: "",
            dateMode: "",
            specificmonth: "1",
            inquiryType: "",
            inquiryDetails: "",
            opportunityStatus: "",
            opportunityStage: "",
            supplier: "",
            customerId: "",
            supplierId: "",
            transactionToken: "",
            itineraryRefNo: "",
            priority: "",
        };
        this.setState({
            data,
            //businessList: [],
            supplierList: [{ name: "All", value: '' }]
        }, this.props.handleFilters(data), sessionStorage.removeItem("reportBusinessSupplier"));

    };

    redirectToReport = (e) => {
        this.props.history.push(`/${e}`);
    }

    componentDidMount() {
        if (this.props.reportType !== "SupplierReport"
            && this.props.reportType !== "SupplierPaymentReport")

            if (this.props.providerId && (this.props.reportType === "SupplierReport" || this.props.providerId && this.props.reportType === "SupplierPaymentReport")) {

                let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))

                if (reportBusinessSupplier && reportBusinessSupplier["supplierList"]
                    && reportBusinessSupplier["businessId"]
                    && reportBusinessSupplier["supplierId"]) {
                    let data = this.state.data
                    data["supplierid"] = reportBusinessSupplier["supplierId"]
                    let arr = [{ name: "All", value: '' }]
                    reportBusinessSupplier["supplierList"].map(supplier => {
                        arr.push({ name: supplier.fullName, value: supplier.providerId })
                    });
                    this.setState({ supplierList: arr, data }, () => {
                        this.handleFilters();
                    });
                }
            }
    }

    handleBusiness = (value, sList) => {
        let vData = this.state.data;
        vData["businessId"] = value;
        vData["supplierid"] = null;
        let arr = [{ name: "All", value: '' }]
        for (let supplier of sList) {
            arr.push({ name: supplier.fullName, value: supplier.providerId })
        }
        this.setState({ data: vData, supplierList: arr, dataSupplier: sList })
    };

    render() {
        const Business = this.state.businessList;
        if (Business && Business.length > 0 && Business[0].id !== "") {
            Business.splice(0, 0, {
                id: "",
                name: Trans("_all")
            });
        }
        let HideSupplierName = (Global.getEnvironmetKeyValue("HideSupplierName", "cobrand")
            && Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") === "true") ? false : true;
        const customStyles = {
            control: styles => ({ ...styles, "textTransform": "capitalize" }),
            option: styles => ({ ...styles, "textTransform": "capitalize", "backgroundColor": "white", "color": "black" }),
            menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
        };
        return (
            <React.Fragment>

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
                            {this.props.reportType !== "LeadsReport" && this.props.reportType !== "SupplierReport" && this.props.reportType !== "SupplierPaymentReport" && this.props.reportType !== "BookingReport" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("businessId", "Product", Business)}
                                </div>
                            }
                            {(this.props.reportType === "SupplierReport" || this.props.reportType === "SupplierPaymentReport" || this.props.reportType === "BookingReport") &&
                                <React.Fragment>
                                    <div className="col-lg-3">
                                        <BusinessDD
                                            BusinessId={this.state.data.businessId ? this.state.data.businessId : -1}
                                            providerID={this.props.providerId}
                                            handleBusiness={this.handleBusiness.bind(this)}
                                            calledFrom={"reports-filters"}
                                            afUserType={this.props.userinfo?.afUserType}
                                        />
                                    </div>
                                    {HideSupplierName && <div className="col-lg-3">
                                        {this.renderSelect("supplierId", "Supplier", this.state.supplierList)}
                                    </div>}
                                </React.Fragment>
                            }

                            {this.props.reportType === "LeadsReport" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("inquiryType", "Inquiry Type", inquiryType, "value", "name")}
                                </div>
                            }

                            {this.props.reportType === "LeadsReport" &&
                                <React.Fragment>
                                    <div className="col-lg-3">
                                        {this.renderSelect("opportunityStatus", "Opportunity Status", opportunityStatus, "value", "name")}
                                    </div>
                                    <div className="col-lg-3">
                                        {this.renderSelect("opportunityStage", "Opportunity Stage", opportunityStage, "value", "name")}
                                    </div>
                                </React.Fragment>
                            }

                            {this.props.reportType !== "LeadsReport" && this.props.reportType !== "SupplierReport" && this.props.reportType !== "SupplierPaymentReport" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("bookingStatus", Trans("_status"), this.props.reportType === "BookingReport" ? allBookingStatus : myBookingStatus)}
                                </div>
                            }
                            {((this.props.reportType !== "SupplierReport"
                                && this.props.reportType !== "SupplierPaymentReport") &&
                                ((this.props.reportType === "LeadsReport" &&
                                    this.props.employeeList.filter(x => x.crewID === 3 && x.isLoggedinEmployee).length === 1) || this.props.reportType !== "LeadsReport")) &&
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
                                </div>
                            }

                            {this.props.reportType === "SalesReport" &&
                                <div className="col-lg-3">
                                    {this.renderInput("customerId", "Customer ID")}
                                </div>
                            }

                            {this.props.reportType === "BookingReport" &&
                                <React.Fragment>
                                    <div className="col-lg-3">
                                        {this.renderInput("transactionToken", "Transaction Token")}
                                    </div>
                                    <div className="col-lg-3">
                                        {this.renderInput("itineraryRefNo", "Itinerary Reference Number")}
                                    </div>
                                    <div className="col-lg-3">
                                        {this.renderInput("bookingrefno", "Booking ID")}
                                    </div>
                                    <div className="col-lg-3">
                                        {this.renderInput("customername", "Customer Details")}
                                    </div>
                                </React.Fragment>
                            }

                            {this.props.reportType !== "LeadsReport" && this.props.reportType !== "SupplierReport" && this.props.reportType !== "SupplierPaymentReport" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("searchBy", "Search By", searchBy)}
                                </div>
                            }


                            {this.props.reportType === "LeadsReport" &&
                                <div className="col-lg-3">
                                    {this.renderInput("inquiryNumber", "Inquiry Number")}
                                </div>
                            }

                            {this.props.reportType === "LeadsReport" &&
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
                            }
                            {this.props.reportType === "LeadsReport" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("searchBy", "Search By", searchByLeadReport)}
                                </div>
                            }
                            {this.state.data.searchBy &&
                                <div className="col-lg-3">
                                    {this.renderSelect("dateMode", "Date", dateMode, "value", "type")}
                                </div>}

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
                </div >
            </React.Fragment>
        );
    }
}

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

const allBookingStatus = [
    { value: "", name: Trans("_all") },
    { value: "10", name: Trans("_bookingStatusBooked") },
    { value: "1", name: Trans("_bookingStatusConfirmed") },
    { value: "7", name: Trans("_bookingStatusCancel") },
    { value: "2", name: Trans("_bookingStatusCancelRequest") },
    { value: "3", name: Trans("_bookingStatusAmendRequest") },
    { value: "4", name: Trans("_bookingStatusRequestInProcess") },
    { value: "8", name: Trans("_bookingStatusExpiredRequest") },
    { value: "9", name: Trans("_bookingStatusDeniedRequest") },
    { value: "6", name: Trans("_bookingStatusModifiedSucessfully") },
    { value: "13", name: Trans("_bookingStatusAutoCancel") },
    { value: "14", name: Trans("_bookingStatusAutoCancelFailure") },
    { value: "17", name: Trans("_bookingStatusFailed") },
    { value: "18", name: Trans("_bookingStatusSystemVoid") },
    // { value: "5", name: Trans("_bookingStatusOnRequest") },
    // { value: "11", name: Trans("System Cancel") },
    // { value: "12", name: Trans("_bookingStatusBooked") },
    // { value: "15", name: Trans("_bookingStatusTicketOnProcess") },
    // { value: "16", name: Trans("_bookingStatuseTicketSuspended") },
]
const myBookingStatus = [
    { value: "", name: Trans("_all") },
    { value: "1", name: Trans("_bookingStatusConfirmed") },
    { value: "7", name: Trans("_bookingStatusCancel") }
];

const searchBy = [
    { value: "", name: "Select" },
    { value: "bookingdate", name: "Booking Date" },
    { value: "checkindate", name: "Check-in Date" }
];

const searchByLeadReport = [
    { value: "", name: "Select" },
    { value: "createddate", name: "Created Date" },
    { value: "startdate", name: "Start Date" },
    { value: "followupdate", name: "Followup Date" }
];

const groupBy = [
    { value: "customer", name: "Customer" },
    { value: "product", name: "Product" }
];


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

const inquiryType = [
    { value: "", name: Trans("_all") },
    { value: "Hotel", name: "Hotel" },
    { value: "Air", name: "Flight" },
    { value: "Activity", name: "Activity" },
    { value: "Custom", name: "Custom" },
    { value: "Packages", name: "Packages" },
    { value: "Transfers", name: "Transfers" },
    { value: "Visa", name: "Visa" },
    { value: "Rail", name: "Rail" },
    { value: "Forex", name: "Forex" },
    { value: "Bus", name: "Bus" },
    { value: "Rent a Car", name: "Rent a Car" },
];

const prioritylist = [
    { label: "All", value: "" },
    { label: "High", value: "High" },
    { label: "Moderate", value: "Moderate" },
    { label: "Low", value: "Low" },
];

const opportunityStage = [
    { value: "", name: "All" },
    { value: "Open", name: "Open" },
    { value: "In Progress", name: "In Progress" },
    { value: "Completed", name: "Completed" }
];

const opportunityStatus = [
    { value: "", name: "All" },
    { value: "Open", name: "Open" },
    { value: "Completed", name: "Completed" },
    { value: "Expired", name: "Expired/Closed" },
    { value: "Deleted", name: "Deleted" },
];

const supplier = [
    { value: "", name: "All" },
    { value: "Open", name: "supplier-1" },
    { value: "In-Progress", name: "supplier-2" },
    { value: "Completed", name: "supplier-3" }
];

  //Filter for report