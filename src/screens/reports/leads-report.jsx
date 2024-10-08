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

class LeadsReport extends Component {
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
                inquiryDetails: "",
                opportunityStatus: "",
                inquiryNumber: "",
                opportunityStage: "",
                dateMode: "",
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                pagenumber: null,
                pagesize: 10,
                priority: ""
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
        filter["inquiryType"] = data["inquiryType"] ? data["inquiryType"] : "";
        filter["inquiryDetails"] = data["inquiryDetails"] ? data["inquiryDetails"] : "";
        filter["opportunityStatus"] = data["opportunityStatus"] ? data["opportunityStatus"] : "";
        filter["inquiryNumber"] = data["inquiryNumber"] ? data["inquiryNumber"] : "";
        filter["opportunityStage"] = data["opportunityStage"] ? data["opportunityStage"] : "";
        filter["bookedBy"] = data["bookedBy"] ? data["bookedBy"] : "";
        filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "createddate";
        filter["priority"] = data["priority"] ? data["priority"] : "";
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
        var reqURL = "tw/reports/lead?pagenumber=1&pagesize=0";
        /*
        let cPage = !isExport ? this.state.currentPage===0 ? 1 : this.state.currentPage : 1
        let pSize = !isExport ? this.state.pageSize : 1000
        var reqURL =
            "tw/reports/lead?entityId=123"// + this.props.userInfo.entityID
            +"&pagenumber=" +
            +cPage +
            "&pagesize=" +
            pSize;
        */
        reqURL += "&groupBy=" + this.state.filter.groupBy;

        if (this.state.filter.inquiryType)
            reqURL += "&inquiryType=" + this.state.filter.inquiryType;
        if (Number(this.state.filter.bookedBy) > 0)
            reqURL += "&bookedby=" + this.state.filter.bookedBy
        reqURL += "&searchBy=" + this.state.filter.searchBy;
        reqURL += "&datemode=" + this.state.filter.dateMode;

        if (this.state.filter.inquiryDetails)
            reqURL += "&inquiryDetails=" + this.state.filter.inquiryDetails;
        if (this.state.filter.opportunityStatus)
            reqURL += "&opportunityStatus=" + this.state.filter.opportunityStatus;
        if (this.state.filter.inquiryNumber)
            reqURL += "&inquiryNumber=" + this.state.filter.inquiryNumber;
        if (this.state.filter.opportunityStage)
            reqURL += "&opportunityStage=" + this.state.filter.opportunityStage;
        if (this.state.filter.priority)
            reqURL += "&priority=" + this.state.filter.priority;
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
                            productType: groupItem.productType === "Air" ? "Flight" : groupItem.productType
                        });
                    } else if (this.state.filter.groupBy === "salesteamwise") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            bookedBy: groupItem.bookedBy
                        });
                    } else {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            nameoftheCustomer: groupItem.nameoftheCustomer,
                        });
                    }
                    groupItem.details.map(item => {
                        if (item.emailAddress && item.emailAddress.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))) {
                            item.emailAddress = "";
                        }
                        dataValue.push({
                            rowCount: rowCount++,
                            type: "data",
                            ...item
                        });
                    });
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        opportunityLastModified: "Total :",
                        rsValue: groupItem.totalRsValue
                    });
                });

                if (results.length > 0) {
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        opportunityLastModified: "Grand Total :",
                        rsValue: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.rsValue ? item.rsValue : 0), 0)
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
                headerData = item.nameoftheCustomer;
                item.nameoftheCustomer = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "product") {
                headerData = item.productType === "Air" ? "Flight" : item.productType;
                item.productType = "";
            } else if (item.type === "header" && this.state.filter.groupBy === "salesteamwise") {
                headerData = item.bookedBy;
                item.bookedBy = "";
            } else
                headerData = item.nameoftheCustomer;
            let destinationlocation = (item.destination_location === "" || item.destination_location === undefined)
                ? "" : " - " + item.destination_location;
            return {
                "Customer": headerData,
                "Inquiry Number": item.inquiryNumber,
                "Priority": item.type === "data" && (item.inquiry_priority === null || item.inquiry_priority === "" || item.inquiry_priority === undefined) ? "--" : item.inquiry_priority,
                "No of passengers": item.noofpassengers,
                "Created By": item.createdByUserName,
                "Created Date": item.type === "data" ? DateComp({ date: item.dateCreated, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Assignee": item.assignedUserName,
                "Booked By": item.bookedBy,
                "Product Type": item.productType === "Air" ? "Flight" : item.productType,
                "Opportunity Status": item.opportunityStatus,
                "Opportunity Stage": item.opportunityStage,
                "Opportunity Last Modified": item.type === "footer" ? item.opportunityLastModified : item.opportunityLastModified ? DateComp({ date: item.opportunityLastModified, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Budget": Amount({ amount: item.rsValue, currencyCode: item.currencyCode }),
                "Status": item.status,
                "Inquiry Details": item.type === "data" ? item.inquiryDetails + destinationlocation : "",
                "Primary Contact": item.primaryContact,
                "Email Address": item.emailAddress,
                "Phone Number": item.phoneNumber,
                "Remarks": item.remarks
            }
        });

        if (exportData.length === 0) {
            exportData = [{
                "Customer": "No records found.",
                "Inquiry Number": "",
                "Priority": "",
                "No of passengers": "",
                "Created By": "",
                "Created Date": "",
                "Assignee": "",
                "Booked By": "",
                "Product Type": "",
                "Opportunity Status": "",
                "Opportunity Stage": "",
                "Opportunity Last Modified": "",
                "Budget": "",
                "Status": "",
                "Inquiry Details": "",
                "Primary Contact": "",
                "Email Address": "",
                "Phone Number": "",
                "Remarks": "",
            }]
        }

        function changeKey(originalKey, newKey, exportData) {
            for (var i = 0; i < exportData.length; i++) {
                let isDeleteAndAdd = false;
                var obj = exportData[i];
                var oldElementIndex = Object.keys(obj).indexOf(originalKey);
                Object.keys(obj).map(key => {
                    if (key === originalKey) {
                        isDeleteAndAdd = true;
                    }
                    if (isDeleteAndAdd) {
                        const val = obj[key];
                        delete obj[key];
                        obj[key === originalKey ? newKey : key] = val;
                    }
                });
            }
            return exportData;
        }
        const { inquiryType } = this.state.filter;
        if (inquiryType === 'Packages') {
            changeKey('Inquiry Details', 'Package Name', exportData);
        }
        else if (inquiryType === "Air") {
            changeKey('Inquiry Details', 'Sector', exportData);
        }
        else if (inquiryType === "Hotel") {
            changeKey('Inquiry Details', 'Hotel Name/Location/City', exportData);
        }
        else if (inquiryType === "Activity") {
            changeKey('Inquiry Details', 'Activity/SIGHTEEINGS/Type', exportData);
        }
        else if (inquiryType === "Visa") {
            changeKey('Inquiry Details', 'Country/Type', exportData);
        }
        else if (inquiryType === "Transfers") {
            changeKey('Inquiry Details', 'Pick Up & Drop Location', exportData);
        }
        else if (inquiryType === "Rail") {
            changeKey('Inquiry Details', 'Sector', exportData);
        }
        else if (inquiryType === "Forex") {
            changeKey('Inquiry Details', 'Currency Type', exportData);
            changeKey('Budget', 'Amount', exportData);
        }
        else if (inquiryType === "Bus") {
            changeKey('Inquiry Details', 'Sector', exportData);
        }
        else if (inquiryType === "Rent a Car") {
            changeKey('Inquiry Details', 'Pick Up & Drop Location', exportData);
        }

        const workbook1 = XLSX.utils.json_to_sheet(exportData);
        workbook1['!cols'] = [
            { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 125 },
            { wpx: 200 }, { wpx: 150 }, { wpx: 100 }, { wpx: 150 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 300 }
        ];
        const workbook = {
            SheetNames: ['Leads Report'],
            Sheets: {
                'Leads Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `LeadsReport.xlsx`);
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
        let { inquiryType } = this.state.filter;
        return (
            <React.Fragment>
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Leads Report
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
                                Leads Report
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
                                                <option value="customer">Leads Report - Customer Wise</option>
                                                <option value="product">Leads Report - Product Wise</option>
                                                {this.state.employeeList.find(x => x.crewID === 3 && x.isLoggedinEmployee) &&
                                                    <option value="salesteamwise">Leads Report - Sales Team Wise</option>}
                                            </select>
                                        </div>
                                        <div className="mb-3 mt-1 float-right">
                                            <AuthorizeComponent title="LeadsReport~report-export-leads" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                {!isBtnLoading &&
                                                    <React.Fragment>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "LeadsReport~report-export-leads") ? this.getData(true) : this.setState({ isshowauthorizepopup: true }) }}
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
                                            reportType={"LeadsReport"}
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
                                                        "Customer",
                                                        "Inquiry Number",
                                                        "Priority",
                                                        "No of passengers",
                                                        "Created By",
                                                        "Created Date",
                                                        "Assignee",
                                                        "Booked By",
                                                        "Product Type",
                                                        "Opportunity Status",
                                                        "Opportunity Stage",
                                                        "Opportunity Last Modified",
                                                        inquiryType === "Forex" ? "Amount" : "Budget",
                                                        "Status",
                                                        inquiryType === "Packages" ? "Package Name"
                                                            : inquiryType === "Air" ? "Sector"
                                                                : inquiryType === "Hotel" ? "Hotel Name/Location/City"
                                                                    : inquiryType === "Activity" ? "Activity/SIGHTEEINGS/Type"
                                                                        : inquiryType === "Visa" ? "Country/Type"
                                                                            : inquiryType === "Transfers" ? "Pick Up & Drop Location"
                                                                                : inquiryType === "Rail" ? "Sector"
                                                                                    : inquiryType === "Forex" ? "Currency Type"
                                                                                        : inquiryType === "Bus" ? "Sector"
                                                                                            : inquiryType === "Rent a Car" ? "Pick Up & Drop Location"
                                                                                                : "Inquiry Details",
                                                        "Primary Contact",
                                                        "Email Address",
                                                        "Phone Number",
                                                        "Remarks"
                                                    ].map((data, key) => {
                                                        return (
                                                            <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isBtnLoading && (<TableLoading columns={18} />)}
                                                {!isBtnLoading && results &&
                                                    results.length > 0 &&
                                                    renderData.map((item, index) => {
                                                        var grouptitle = "";
                                                        if (this.state.filter.groupBy === "product")
                                                            grouptitle = item.productType === "Air" ? "Flight" : item.productType;
                                                        else if (this.state.filter.groupBy === "salesteamwise")
                                                            grouptitle = item.bookedBy;
                                                        else if (this.state.filter.groupBy === "customer")
                                                            grouptitle = item.nameoftheCustomer;
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="18">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td className="text-capitalize" style={{ "word-break": "break-word" }}>{item.nameoftheCustomer}</td>
                                                                    <td>{item.inquiryNumber}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{(item.inquiry_priority === null || item.inquiry_priority === "" || item.inquiry_priority === undefined) ? "--" : item.inquiry_priority}</td>
                                                                    <td>{item.noofpassengers}</td>
                                                                    <td className="text-capitalize" style={{ "word-break": "break-word" }}>{item.createdByUserName}</td>
                                                                    <td><DateComp date={item.dateCreated} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td className="text-capitalize" style={{ "word-break": "break-word" }}>{item.assignedUserName}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookedBy}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.productType === "Air" ? "Flight" : item.productType}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.opportunityStatus}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.opportunityStage}</td>
                                                                    <td><DateComp date={item.opportunityLastModified} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><Amount amount={item.rsValue} /></td>
                                                                    <td>{item.status}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.inquiryDetails}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.primaryContact}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.emailAddress}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.phoneNumber}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{(item.remarks === "" || item.remarks === undefined) ? "--" : item.remarks}</td>
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
                                                                        <th>&nbsp;</th>
                                                                        <th>{item.opportunityLastModified}</th>
                                                                        <th><Amount amount={item.rsValue} currencyCode={item.currencyCode} /></th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                    </tr>
                                                                    : "")
                                                    })
                                                }
                                                {!isBtnLoading && results &&
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
    "Customer": 250,
    "Inquiry Number": 150,
    "Priority": 100,
    "Created Date": 100,
    "No of passengers": 100,
    "Created By": 200,
    "Assignee": 200,
    "Booked By": 200,
    "Product Type": 120,
    "Opportunity Status": 150,
    "Opportunity Stage": 150,
    "Opportunity Last Modified": 150,
    "Budget": 150,
    "Amount": 150,
    "Package Name": 250,
    "Country/Type": 250,
    "Pick Up & Drop Location": 250,
    "Sector": 250,
    "Hotel Name/Location/City": 250,
    "Activity/SIGHTEEINGS/Type": 250,
    "Currency Type": 250,
    "Inquiry Details": 250,
    "Primary Contact": 200,
    "Email Address": 250,
    "Phone Number": 200,
    "Remarks": 300,
    "Status": 200,
}
//Lead Report
export default LeadsReport;