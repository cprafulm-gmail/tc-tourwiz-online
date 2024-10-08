import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import ReportsFilters from "../../components/reports/reports-filters";
import TableLoading from "../../components/loading/table-loading"
import Pagination from "../../components/booking-management/booking-pagination"
import moment from "moment";
import * as Global from "../../helpers/global";
import DateComp from "../../helpers/date";
import Amount from "../../helpers/amount";
import XLSX from "xlsx";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

class BookingReport extends Component {
    constructor(props) {
        super(props);
        let reportBusinessSupplier = sessionStorage.getItem("reportBusinessSupplier")
        if (reportBusinessSupplier) {
            const results = JSON.parse(reportBusinessSupplier);
            if (results && results.providerID == props.userInfo.agentID) {
                results.businessID = "";
                sessionStorage.setItem("reportBusinessSupplier", JSON.stringify(reportBusinessSupplier))
            }
        }
        this.state = {
            results: "",
            isDeleteConfirmPopup: false,
            deleteItem: "",
            type: "Itinerary",
            importItineraries: "",
            exportData: false,
            reportLoading: false,
            isImport: false,
            isFilters: true,
            filter: {
                businessId: "",
                bookingStatus: "",
                groupBy: "itinerary",
                searchBy: "",
                dateMode: "",
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                pagenumber: 1,
                pagesize: 10,
                bookedBy: null,
                customerId: '',
                supplierId: '',
                transactionToken: "",
                itineraryRefNo: "",
                customername: "",
                bookingrefno: null,
            },
            currentPage: 0,
            pageSize: 10,
            hasNextPage: false,
            isBtnLoading: false,
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            isshowauthorizepopup: false,
            employeeData: [{ label: "All", value: 0 }],
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    handleFilters(data) {
        let filter = this.state.filter;
        filter["businessId"] = data["businessId"] ? data["businessId"] : "";
        filter["bookingStatus"] = data["bookingStatus"] ? data["bookingStatus"] : "";
        filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
        filter["fromDate"] = data["fromDate"] ?
            moment(new Date(data["fromDate"])).format(Global.DateFormate) : null;
        filter["toDate"] = data["toDate"] ?
            moment(new Date(data["toDate"])).format(Global.DateFormate) : null;
        filter["bookedBy"] = data["bookedBy"] ? data["bookedBy"] : "";
        //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"supplier";
        filter["supplierId"] = data["supplierId"] ? data["supplierId"] : "";
        filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "bookingdate";
        filter["transactionToken"] = data["transactionToken"] ? data["transactionToken"] : "";
        filter["itineraryRefNo"] = data["itineraryRefNo"] ? data["itineraryRefNo"] : "";
        filter["customername"] = data["customername"] ? data["customername"] : "";
        filter["bookingRefNo"] = data["bookingrefno"] ? data["bookingrefno"] : "";
        this.setState({ filter });
        this.getData();
    }

    setgroupby = (value) => {
        let filter = this.state.filter;
        filter.groupBy = value;
        this.setState({ filter });
        this.getData();
    }

    getData = (isExport) => {
        if (!isExport) { this.setState({ isBtnLoading: true }) }
        if (isExport) { this.setState({ reportLoading: true }) }
        var reqURL = "tw/reports/booking?pagenumber=1&pagesize=0";

        if (this.state.filter.businessId)
            reqURL += "&businessId=" + this.state.filter.businessId;

        if (this.state.filter.supplierId)
            reqURL += "&supplierId=" + this.state.filter.supplierId;

        if (this.state.filter.bookingStatus)
            reqURL += "&bookingstatusId=" + this.state.filter.bookingStatus;

        if (this.state.filter.transactionToken)
            reqURL += "&transactiontoken=" + this.state.filter.transactionToken;

        if (this.state.filter.itineraryRefNo)
            reqURL += "&itineraryrefno=" + this.state.filter.itineraryRefNo;

        if (this.state.filter.customername)
            reqURL += "&customername=" + this.state.filter.customername;

        if (this.state.filter.bookingRefNo)
            reqURL += "&bookingrefno=" + this.state.filter.bookingRefNo;

        reqURL += "&datemode=" + this.state.filter.dateMode;
        reqURL += "&groupby=" + this.state.filter.groupBy;
        if (Number(this.state.filter.bookedBy) > 0)
            reqURL += "&bookedby=" + this.state.filter.bookedBy
        reqURL += "&searchby=" + this.state.filter.searchBy;

        if (this.state.filter.dateMode === "specific-date" || this.state.filter.dateMode === "between-dates" || this.state.filter.dateMode === "specific-month")
            reqURL += "&fromdate=" + this.state.filter.fromDate + "&todate=" + this.state.filter.toDate;

        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                if (data.error) {
                    this.setState({
                        results: [],
                        defaultResults: [],
                        isBtnLoading: false,
                        pageInfo: {
                            currentPage: 0,
                            pageLength: 10,
                            hasNextPage: false,
                            hasPreviousPage: false,
                            totalResults: 0
                        }
                    });
                    return true;
                }

                let results = data.response.data;
                let dataValue = [];
                let rowCount = 0;
                results.map(groupItem => {
                    if (this.state.filter.groupBy === "product") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            product: groupItem.product === "Air" ? "Flight" : groupItem.product
                        });
                    } else if (this.state.filter.groupBy === "supplier") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            supplierID: groupItem.supplierID,
                            supplier: groupItem.supplier
                        });
                    }
                    if (this.state.filter.groupBy === "salesteamwise") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            bookedBy: groupItem.agentName
                        });
                    } else if (this.state.filter.groupBy === "itinerary") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            itineraryRefNo: groupItem.itineraryRefNo
                        });
                    }
                    groupItem.details.map(item => {
                        dataValue.push({
                            rowCount: rowCount++,
                            type: "data",
                            ...item
                        });
                    });
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        checkOutDate: "Total :",
                        bookingAmount: groupItem.totalBookingAmount,
                        currencyCode: groupItem.details[0].currencyCode
                    });
                });
                if (results.length > 0) {
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        checkOutDate: "Grand Total :",
                        bookingAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.bookingAmount ? item.bookingAmount : 0), 0)
                    });
                }
                if (!isExport) {
                    let pageInfo = this.state.pageInfo;
                    let totalRecords = data.response.data.reduce((sum, item) => sum + item.details.length, 0);
                    if (results.length > 0) {
                        pageInfo["currentPage"] = 0;
                        pageInfo["pageLength"] = parseInt(this.state.pageSize);
                        pageInfo["hasNextPage"] = this.state.currentPage + 1 < Math.ceil(totalRecords / parseInt(this.state.pageSize));
                        pageInfo["hasPreviousPage"] = this.state.currentPage > 1;
                        pageInfo["totalResults"] = totalRecords; //data[data.length-1].rowCount + 1;
                    }

                    this.setState({
                        results: dataValue,
                        defaultResults: results,
                        isBtnLoading: false,
                        pageInfo,
                        currentPage: 0
                    });
                }
                else {
                    this.setState({ exportData: dataValue }, () => this.getExcelReport());
                }
            },
            "GET"
        );
    };

    showHideFilters = () => {
        this.setState({ isFilters: !this.state.isFilters });
    };

    handlePaginationResults(pageNumber, pageLength) {
        pageNumber = parseInt(pageNumber);
        let pageInfo = this.state.pageInfo;
        if (this.state.results.length > 0) {
            pageInfo["currentPage"] = pageNumber
            pageInfo["pageLength"] = pageLength
            pageInfo["hasNextPage"] = Math.ceil(this.state.results[this.state.results.length - 1].rowCount / pageLength) - 1 > pageNumber
            pageInfo["hasPreviousPage"] = pageNumber > 0
            pageInfo["totalResults"] = this.state.results[this.state.results.length - 1].rowCount + 1
        }
        this.setState({
            currentPage: parseInt(pageNumber),
            pageSize: pageLength,
            pageInfo: pageInfo
        });
    }

    componentDidMount() {
        this.getEmployeeList();
        this.getData();
    }
    getEmployeeList = () => {
        var reqURL = "admin/employee/list";
        var reqOBJ = {
            "Request": {
                "ProviderID": this.props.providerId,
                "PageNumber": 1,
                "PageSize": 500,
                "CrewNatureID": "",
                "IsActive": true,
                "ClassName": ""
            }
        };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                if (data.error) {
                    data.response = [{ label: "All", value: 0 }];
                }
                else {
                    let employeeData = data.response.map((item) => {
                        return {
                            label: item.firstName + ' ' + item.lastName,
                            userID: item.userID ?? 0,
                            crewID: item.crewNatureID,
                            isLoggedinEmployee: item.isLoggedinEmployee
                        };
                    })
                    employeeData.unshift({ label: "All", value: 0 });
                    this.setState({ employeeData });
                }
            },
            "POST"
        );
    };

    handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                this.props.history.push(`/Backoffice/${req}`);
            else {
                this.props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            this.props.history.push(`${req}`);
        }
    };

    getExcelReport() {
        let exportData = this.state.exportData.map((item) => {
            let headerData = "";
            if (item.type === "header" && this.state.filter.groupBy === "itinerary") {
                headerData = item.itineraryRefNo;
                item.itineraryRefNo = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "product") {
                headerData = item.product === "Air" ? "Flight" : item.product;
                item.product = "";
            } else if (item.type === "header" && this.state.filter.groupBy === "salesteamwise") {
                headerData = item.bookedBy;
                item.bookedBy = "";
            } else if (item.type === "header" && this.state.filter.groupBy === "Supplier") {
                headerData = item.supplier;
                item.supplier = "";
            } else
                headerData = item.itineraryRefNo;
            return {
                "Itinerary Reference Number": headerData,
                "Booking ID": item.bookingRef,
                "Product": item.product === "Air" ? "Flight" : item.product,
                "Booking Status": item.bookingStatus,
                "Booking Date": item.type === "data" ? DateComp({ date: item.bookingDateTime, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Start Date": item.type === "data" ? DateComp({ date: item.checkInDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "End Date": item.type === "data" ? DateComp({ date: item.checkOutDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : item.type === "footer" ? item.checkOutDate : "",
                "Total Value": Amount({ amount: item.bookingAmount, currencyCode: item.currencyCode }),
                "Booking Details": item.bookingDetails,
                "Booked by": item.supplier,
                "Supplier": item.supplier,
                "Supplier ID": item.supplierID,
                "Transaction Token": item.transactionToken,
                "Customer Details": item.type == "data" ? item.customerFirstName + " " + item.customerLastName + " (" + item.customerPhoneNumber + ")" : "",
            }
        });

        if (exportData.length === 0) {
            exportData = [{
                "Itinerary Reference Number": "No records found.",
                "Booking ID": "",
                "Product": "",
                "Booking Status": "",
                "Booking Date": "",
                "Start Date": "",
                "End Date": "",
                "Total Value": "",
                "Booking Details": "",
                "Booked by": "",
                "Supplier": "",
                "Supplier ID": "",
                "Transaction Token": "",
                "Customer Details": ""
            }]
        }

        const workbook1 = XLSX.utils.json_to_sheet(exportData);
        workbook1['!cols'] = [
            { wpx: 100 }, { wpx: 200 }, { wpx: 75 }, { wpx: 175 }, { wpx: 75 },
            { wpx: 100 }, { wpx: 75 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 125 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }
        ];
        const workbook = {
            SheetNames: ['Booking Report'],
            Sheets: {
                'Booking Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `BookingReport.xlsx`);
    }

    render() {
        const {
            results,
            isFilters,
            isBtnLoading,
            pageInfo
        } = this.state;
        let startRow = this.state.currentPage === 0 ? 0 : (this.state.currentPage * parseInt(this.state.pageSize));
        let endRow = ((this.state.currentPage * parseInt(this.state.pageSize)) + parseInt(this.state.pageSize)) - 1;
        let HideSupplierName = (Global.getEnvironmetKeyValue("HideSupplierName", "cobrand")
            && Global.getEnvironmetKeyValue("HideSupplierName", "cobrand") === "true") ? false : true;
        let renderData = [];
        if (results)
            renderData = results.filter(x => x.rowCount >= startRow && x.rowCount <= endRow);

        let pageInfoIndex = [{ item: pageInfo }];

        return (
            <React.Fragment>
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Booking Report
                            </title>
                        </Helmet>
                        <div className="container">
                            <h1 className="text-white m-0 p-0 f30">
                                <SVGIcon
                                    name="file-text"
                                    width="24"
                                    height="24"
                                    className="mr-3"
                                ></SVGIcon>
                                Booking Report
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            <div className="container">
                                <div className="row">
                                    <div className="border pt-2 pl-3 pr-3 shadow-sm col-12 mb-3">
                                        <div className="mb-3 mt-2 float-left">
                                            <label for="reportType" className="pr-3">Report Type</label>
                                        </div>
                                        <div className="mb-3 mt-1 float-left">
                                            <select
                                                id="reportType"
                                                name="reportType"
                                                className="form-control"
                                                style={{ width: "auto" }}
                                                onChange={(e) => this.setgroupby(e.target.value)}
                                            >
                                                <option value="itinerary">Booking Report - Itinerary Wise</option>
                                                <option value="product">Booking Report - Product Wise</option>
                                                {HideSupplierName && <option value="supplier">Booking Report - supplier Wise</option>}
                                                <option value="salesteamwise">Booking Report - Sales Team Wise</option>
                                            </select>
                                        </div>

                                        <div className="mb-3 mt-1 float-right">
                                            {!isBtnLoading &&
                                                <React.Fragment>
                                                    <AuthorizeComponent title="BookingReport~report-export-booking" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "BookingReport~report-export-booking") ? this.getData(true) : this.setState({ isshowauthorizepopup: true }) }}
                                                            >Export</button>
                                                        }
                                                        {this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                            >
                                                                {this.state.reportLoading &&
                                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                                }
                                                                Export
                                                            </button>
                                                        }
                                                    </AuthorizeComponent>
                                                </React.Fragment>
                                            }
                                        </div>
                                        <div className="mb-3 mt-1 float-right">
                                            <button
                                                className="btn btn-sm btn-light pull-right mr-2"
                                                onClick={this.showHideFilters}
                                            >
                                                Filters
                                            </button>
                                        </div>
                                    </div>
                                    {isFilters && (
                                        <ReportsFilters
                                            handleFilters={this.handleFilters.bind(this)}
                                            showHideFilters={this.showHideFilters.bind(this)}
                                            reportType={"BookingReport"}
                                            history={this.props.history}
                                            providerId={this.props.userInfo.agentID}
                                            userID={this.props.userInfo.userID}
                                            groupByfilter={this.state.filter.groupBy}
                                            employeeList={this.state.employeeData}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <div className="table-responsive">
                                        <table className="table border table-column-width" id="sheet1">
                                            <thead className="thead-light">
                                                <tr>
                                                    {[
                                                        "Itinerary Reference Number",
                                                        "Booking ID",
                                                        "Product",
                                                        "Booking Status",
                                                        "Booking Date",
                                                        "Start Date",
                                                        "End Date",
                                                        "Total Value",
                                                        "Booking Details",
                                                        "Booked by",
                                                        HideSupplierName ? "Supplier" : "",
                                                        HideSupplierName ? "Supplier ID" : "",
                                                        "Transaction Token",
                                                        "Customer Details",
                                                    ].map((data, key) => {
                                                        return (
                                                            <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isBtnLoading && (<TableLoading columns={14} />)}
                                                {
                                                    !isBtnLoading && results &&
                                                    results.length > 0 &&
                                                    renderData.map((item, index) => {
                                                        var grouptitle = "";
                                                        if (this.state.filter.groupBy === "product")
                                                            grouptitle = item.product === "Air" ? "Flight" : item.product;
                                                        else if (this.state.filter.groupBy === "supplier")
                                                            grouptitle = item.supplier;
                                                        else if (this.state.filter.groupBy === "itinerary")
                                                            grouptitle = item.itineraryRefNo;
                                                        else if (this.state.filter.groupBy === "salesteamwise")
                                                            grouptitle = item.bookedBy;
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="18">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td>{item.itineraryRefNo}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookingRef}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.product === "Air" ? "Flight" : item.product}</td>
                                                                    <td>{item.bookingStatus}</td>
                                                                    <td><DateComp date={item.bookingDateTime} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><DateComp date={item.checkInDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><DateComp date={item.checkOutDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><Amount amount={item.bookingAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookingDetails}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookedBy}</td>
                                                                    {HideSupplierName ? <td style={{ "word-break": "break-word" }}>{item.supplier}</td> : <td></td>}
                                                                    {HideSupplierName ? <td>{item.supplierID}</td> : <td></td>}
                                                                    <td>{item.transactionToken}</td>
                                                                    <td className="text-capitalize">{item.customerFirstName}{" "}{item.customerLastName}({item.customerPhoneNumber})</td>
                                                                </tr>
                                                                : item.type === "footer" ?
                                                                    <tr key={index} className="tbody-group-footer">
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>{item.checkOutDate}</th>
                                                                        <th><Amount amount={item.bookingAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        {HideSupplierName && <th>&nbsp;</th>}
                                                                        {HideSupplierName && <th>&nbsp;</th>}
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                    </tr>
                                                                    : "")
                                                    })}
                                                {
                                                    !isBtnLoading && results &&
                                                    results.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={9}>No records found.</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-lg-12 report-pagination">
                                        {!isBtnLoading && (results &&
                                            results.length > 0) && (
                                                <Pagination
                                                    pageInfoIndex={pageInfoIndex}
                                                    handlePaginationResults={this.handlePaginationResults.bind(this)}
                                                />
                                            )}
                                    </div>
                                    {this.state.isshowauthorizepopup &&
                                        <ModelPopupAuthorize
                                            header={""}
                                            content={""}
                                            handleHide={this.hideauthorizepopup}
                                            history={this.props.history}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const table_column_width = {
    "Itinerary Reference Number": 200,
    "Booking ID": 250,
    "Product": 100,
    "Booking Status": 150,
    "Booking Date": 100,
    "Start Date": 100,
    "End Date": 100,
    "Total Value": 150,
    "Booking Details": 300,
    "Booked by": 150,
    "Supplier": 260,
    "Supplier ID": 120,
    "Transaction Token": 200,
    "Customer Details": 300
}

//Booking report - 2021-10-29
export default BookingReport;
