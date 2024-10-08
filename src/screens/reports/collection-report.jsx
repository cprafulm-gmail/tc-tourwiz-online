import React, { Component, useDebugValue } from 'react'
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

class CollectionReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: "",
            isDeleteConfirmPopup: false,
            deleteItem: "",
            type: "Itinerary",
            importItineraries: "",
            exportData: null,
            isImport: false,
            isFilters: true,
            filter: {
                businessId: "",
                bookingStatus: "",
                groupBy: "customer",
                searchBy: "",
                dateMode: "",
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                pagenumber: null,
                pagesize: 10,
                bookedBy: null,
            },
            currentPage: 0,
            pageSize: 10,
            hasNextPage: false,
            isBtnLoading: false,
            reportLoading: false,
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            isshowauthorizepopup: false,
            employeeList: [{ label: "All", value: 0 }],
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
        filter["agentname"] = data["agentname"] ? data["agentname"] : "";
        filter["bookedBy"] = data["bookedBy"] ? data["bookedBy"] : "";
        filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "bookingdate";
        //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"customer";
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
        var reqURL = "tw/reports/collection?pagenumber=1&pagesize=0";
        /*
        let cPage = !isExport ? this.state.currentPage===0 ? 1 : this.state.currentPage : 1
        let pSize = !isExport ? this.state.pageSize : 1000
        var reqURL =
            "tw/reports/outstanding?pagenumber=" +
            +cPage +
            "&pagesize=" +
            pSize;
        */
        reqURL += "&groupBy=" + this.state.filter.groupBy;

        if (this.state.filter.businessId)
            reqURL += "&businessId=" + this.state.filter.businessId;

        if (this.state.filter.bookingStatus)
            reqURL += "&bookingstatusId=" + this.state.filter.bookingStatus;

        if (Number(this.state.filter.bookedBy) > 0)
            reqURL += "&bookedby=" + this.state.filter.bookedBy
        reqURL += "&searchBy=" + this.state.filter.searchBy;
        reqURL += "&datemode=" + this.state.filter.dateMode;

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
                    } else if (this.state.filter.groupBy === "salesteamwise") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            agentName: groupItem.agentName
                        });
                    }
                    else {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            customerId: groupItem.customerId,
                            customerName: groupItem.customerName,
                            cellPhone: groupItem.cellPhone
                        });
                    }
                    groupItem.details.map(item => {
                        var finalCollectionDate = "";
                        var overDueDays = "";
                        if (moment(item.bookingDateTime, 'YYYY-MM-DD').isBefore(moment(item.startDate, 'YYYY-MM-DD').add(-7, 'days'))) {
                            finalCollectionDate = moment(item.startDate, 'YYYY-MM-DD').add(-7, 'days');
                        }
                        else {
                            finalCollectionDate = moment(item.startDate);
                        }
                        overDueDays = (moment()).diff((finalCollectionDate), 'days') > 0 ? moment().diff(moment(finalCollectionDate), 'days') : "--";
                        dataValue.push({
                            rowCount: rowCount++,
                            type: "data",
                            ...item,
                            finalCollectionDate: moment(finalCollectionDate).format(Global.getEnvironmetKeyValue("DisplayDateFormate")),
                            overDueDays: overDueDays
                        });
                    });
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        destination: "Total :",
                        baseAmount: groupItem.totalBaseAmount,
                        tax: groupItem.totalTax,
                        fees: groupItem.totalFees,
                        totalBookingAmount: groupItem.totalTotalBookingAmount,
                        discountAmount: groupItem.totalDiscountAmount,
                        netAmount: groupItem.totalNetAmount,
                        paidAmount: groupItem.totalPaidAmount,
                        pandingAmount: groupItem.totalPandingAmount,
                        cancellationCharges: groupItem.totalCancellationCharges,
                        refund: groupItem.totalRefund,
                        currencyCode: groupItem.details[0].currencyCode
                    });
                });
                if (results.length > 0) {
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        destination: "Grand Total :",
                        baseAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalBaseAmount ? item.totalBaseAmount : 0), 0),
                        tax: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax ? item.tax : 0), 0),
                        fees: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.fees ? item.fees : 0), 0),
                        totalBookingAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalBookingAmount ? item.totalBookingAmount : 0), 0),
                        discountAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.discountAmount ? item.discountAmount : 0), 0),
                        netAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.netAmount ? item.netAmount : 0), 0),
                        paidAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.paidAmount ? item.paidAmount : 0), 0),
                        pandingAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.pandingAmount ? item.pandingAmount : 0), 0),
                        cancellationCharges: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.cancellationCharges ? item.cancellationCharges : 0), 0),
                        refund: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.refund ? item.refund : 0), 0),
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

    getExcelReport() {
        let exportData = this.state.exportData.map((item) => {
            let headerData = "";
            if (item.type === "header" && this.state.filter.groupBy === "customer") {
                headerData = item.customerName && item.cellPhone ? item.customerName + " (" + item.cellPhone + ")" : "";
                item.customerName = "";
                item.cellPhone = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "product") {
                headerData = item.product === "Air" ? "Flight" : item.product;
                item.product = "";
            } else if (item.type === "header" && this.state.filter.groupBy === "salesteamwise") {
                headerData = item.agentName;
                item.agentName = "";
            } else
                headerData = item.customerName && item.cellPhone ? item.customerName + " (" + item.cellPhone + ")" : "";
            return {
                "Customer Details": headerData,
                "Customer ID": item.customerId,
                "Product": item.product === "Air" ? "Flight" : item.product,
                "Booked By": item.agentName,
                "Booking Date": item.bookingDateTime ? DateComp({ date: item.bookingDateTime, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Booking ID": item.bookingID,
                "Status": item.bookingStatus,
                "Start Date": item.startDate ? DateComp({ date: item.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "End Date": item.endDate ? DateComp({ date: item.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Total Passengers": item.totalPassengers,
                "Booking Details": item.destination,
                "Total Booking Amount": Amount({ amount: item.totalBookingAmount, currencyCode: item.currencyCode }),
                "Discount Given if any": Amount({ amount: item.discountAmount, currencyCode: item.currencyCode }),
                "Net Value": Amount({ amount: item.netAmount, currencyCode: item.currencyCode }),
                "Initial Payment Due Date": item.type === "data" ? "--" : "",
                "Amount collected": Amount({ amount: item.paidAmount, currencyCode: item.currencyCode }),
                "Amount pending for collection": Amount({ amount: item.pandingAmount, currencyCode: item.currencyCode }),
                "Payment Followup Date": item.type === "data" ? item.pandingAmount != 0 ? DateComp({ date: item.paymentFollowupDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "--" : "",
                "Final Collection Date": item.type === "data" ? item.pandingAmount != 0 ? item.finalCollectionDate : "--" : "",
                "OverDue by Days": item.overDueDays
            }
        });

        if (exportData.length === 0) {
            exportData = [{
                "Customer Details": "No records found.",
                "Customer ID": "",
                "Product": "",
                "Booked By": "",
                "Booking Date": "",
                "Booking ID": "",
                "Status": "",
                "Start Date": "",
                "End Date": "",
                "Total Passengers": "",
                "Booking Details": "",
                "Total Booking Amount": "",
                "Discount Given if any": "",
                "Net Value": "",
                "Initial Payment Due Date": "",
                "Amount collected": "",
                "Amount pending for collection": "",
                "Payment Followup Date": "",
                "Final Collection Date": "",
                "OverDue by Days": "",
            }]
        }

        const workbook1 = XLSX.utils.json_to_sheet(exportData);
        workbook1['!cols'] = [
            { wpx: 200 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 75 }, { wpx: 100 },
            { wpx: 200 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }
        ];
        const workbook = {
            SheetNames: ['Collection Report'],
            Sheets: {
                'Collection Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `CollectionReport.xlsx`);
    }

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
                    let employeeList = data.response.map((item) => {
                        return {
                            label: item.firstName + ' ' + item.lastName,
                            userID: item.userID ?? 0,
                            crewID: item.crewNatureID,
                            isLoggedinEmployee: item.isLoggedinEmployee
                        };
                    })
                    employeeList.unshift({ label: "All", value: 0 });
                    this.setState({ employeeList });
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

    render() {
        const {
            results,
            isFilters,
            isBtnLoading,
            pageInfo
        } = this.state;
        let startRow = this.state.currentPage === 0 ? 0 : (this.state.currentPage * parseInt(this.state.pageSize));
        let endRow = ((this.state.currentPage * parseInt(this.state.pageSize)) + parseInt(this.state.pageSize)) - 1;
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
                                Collection Report
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
                                Collection Report
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
                                                <option value="customer">Collection Report - Customer Wise</option>
                                                <option value="product">Collection Report - Product Wise</option>
                                                <option value="salesteamwise">Collection Report - Sales Team Wise</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 mt-1 float-right">
                                            <AuthorizeComponent title="CollectionReport~report-export-collection" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                {!isBtnLoading &&
                                                    <React.Fragment>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CollectionReport~report-export-collection") ? this.getData(true) : this.setState({ isshowauthorizepopup: true }) }}
                                                            >
                                                                Export
                                                            </button>
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
                                                    </React.Fragment>
                                                }
                                            </AuthorizeComponent>
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
                                            reportType={"CollectionReport"}
                                            history={this.props.history}
                                            groupByfilter={this.state.filter.groupBy}
                                            employeeList={this.state.employeeList}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <div className="table-responsive">
                                        <table className="table border table-column-width">
                                            <thead className="thead-light">
                                                <tr>
                                                    {[
                                                        "Customer Details",
                                                        "Customer ID",
                                                        "Product",
                                                        "Booked By",
                                                        "Booking Date",
                                                        "Booking ID",
                                                        "Status",
                                                        "Start Date",
                                                        "End Date",
                                                        "Total Passengers",
                                                        "Booking Details",
                                                        "Total Booking Amount",
                                                        "Discount Given if any",
                                                        "Net Value",
                                                        "Initial Payment Due Date",
                                                        "Amount collected",
                                                        "Amount pending for collection",
                                                        "Payment Followup Date",
                                                        "Final Collection Date",
                                                        "OverDue by Days"
                                                    ].map((data, key) => {
                                                        return (
                                                            <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isBtnLoading && (<TableLoading columns={19} />)}
                                                {
                                                    !isBtnLoading && results &&
                                                    results.length > 0 &&
                                                    renderData.map((item, index) => {
                                                        var grouptitle = "";
                                                        if (this.state.filter.groupBy === "product")
                                                            grouptitle = item.product === "Air" ? "Flight" : item.product
                                                        else if (this.state.filter.groupBy === "salesteamwise")
                                                            grouptitle = item.agentName
                                                        else if (this.state.filter.groupBy === "customer")
                                                            grouptitle = item.customerName + " (" + item.cellPhone + ") - (" + item.customerId + ")"
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="19">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td className="text-capitalize" style={{ "word-break": "break-word" }}>{item.customerName} ({item.cellPhone})</td>
                                                                    <td>{item.customerId}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.product === "Air" ? "Flight" : item.product}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.agentName}</td>
                                                                    <td><DateComp date={item.bookingDateTime} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookingID}</td>
                                                                    <td>{item.bookingStatus}</td>
                                                                    <td><DateComp date={item.startDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><DateComp date={item.endDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td>{item.totalPassengers}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.destination}</td>
                                                                    <td><Amount amount={item.totalBookingAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td><Amount amount={item.discountAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td><Amount amount={item.netAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td><DateComp date={item.bookingDateTime} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><Amount amount={item.paidAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td><Amount amount={item.pandingAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td>{item.pandingAmount != 0 ? <DateComp date={item.paymentFollowupDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : "--"}</td>
                                                                    <td>{item.pandingAmount != 0 ? item.finalCollectionDate : "--"}</td>
                                                                    <td>{item.overDueDays}</td>
                                                                </tr>
                                                                : item.type === "footer" ?
                                                                    <tr key={index} className="tbody-group-footer">
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>{item.destination}</th>
                                                                        <th><Amount amount={item.totalBookingAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th><Amount amount={item.discountAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th><Amount amount={item.netAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th>&nbsp;</th>
                                                                        <th><Amount amount={item.paidAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th><Amount amount={item.pandingAmount} currencyCode={item.currencyCode} /></th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                    </tr>
                                                                    : "")
                                                    })
                                                }
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
    "Customer Details": 250,
    "Customer ID": 150,
    "Product": 100,
    "Booked By": 150,
    "Booking Date": 100,
    "Booking ID": 250,
    "Status": 150,
    "Start Date": 110,
    "End Date": 100,
    "Total Passengers": 100,
    "Booking Details": 250,
    "Total Booking Amount": 150,
    "Discount Given if any": 150,
    "Net Value": 150,
    "Initial Payment Due Date": 150,
    "Amount collected": 150,
    "Amount pending for collection": 250,
    "Payment Followup Date": 150,
    "Final Collection Date": 150,
    "OverDue by Days": 100,
}
//Collection Report
export default CollectionReport;

