import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester } from "../../services/requester";
import { apiRequester_quotation_api } from "../../services/requester-quotation";
import QuotationReportFilters from "../../components/quotation/quotation-report-filters";
import TableLoading from "../../components/loading/table-loading"
import Pagination from "../../components/booking-management/booking-pagination"
import ExcelExport from "../../components/reports/inquiry-excel"
import * as Global from "../../helpers/global";
import DateComp from "../../helpers/date";
import Amount from "../../helpers/amount";
import moment from "moment";
import XLSX from "xlsx";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import ActivityLogDetails from "../../components/quotation/activity-log-details";
import ModelPopup from '../../helpers/model';
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { Helmet } from "react-helmet";

class InquiryReport extends Component {
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
            currentPage: 0,
            pageSize: 10,
            hasNextPage: false,
            isBtnLoading: false,
            filter: {
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
                groupBy: "customer",//"inquirytype",
                stayInDays: 30,
                priority: "",
            },
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            isshowauthorizepopup: false,
            activityLogDetails: null,
            isBtnLoading_activityLog: false,
            employeeList: [{ label: "All", value: 0 }],
            inquiryReportTableColumn: [],
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    handleHideActivityLogPopup = () => {
        this.setState({
            activityLogDetails: null,
        });
    };

    getActivityLogDetails = (item) => {
        this.setState({ isErrorMsg: "", isBtnLoading_activityLog: true });
        let id = item.id;

        var reqURL = "inquiry/activitylog?id=" + id;

        apiRequester_quotation_api(reqURL, null, (data) => {
            if (data.error)
                this.setState({ isErrorMsg: data.error, isBtnLoading_activityLog: false });
            else {
                this.setState({
                    isBtnLoading_activityLog: false,
                    activityLogDetails: data.response,
                });
            }
        }, 'GET');
    };

    handleFilters = (data) => {
        this.getInquiryColumn(data["inquirytype"]);
        let filter = this.state.filter;
        filter["customername"] = data["customername"] ? data["customername"] : "";
        filter["inquiryNumber"] = data["inquiryNumber"] ? data["inquiryNumber"] : "";
        filter["email"] = data["email"] ? data["email"] : "";
        filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
        filter["bookedBy"] = data["bookedBy"] ? data["bookedBy"] : "";
        filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "";
        filter["fromDate"] = data["fromDate"] ?
            moment(new Date(data["fromDate"])).format(Global.DateFormate) : null;
        filter["toDate"] = data["toDate"] ?
            moment(new Date(data["toDate"])).format(Global.DateFormate) : null;
        filter["phone"] = data["phone"] ? data["phone"] : "";
        //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"inquirytype";
        filter["title"] = data["title"] ? data["title"] : "";
        if (data["inquirysource"]) {
            filter["inquirysource"] = data["inquirysource"].toLowerCase() === "other" ? data["othersource"] : data["inquirysource"];
        } else {
            filter["inquirysource"] = "";
        }
        filter["triptype"] = data["triptype"] ? data["triptype"] : "";
        filter["inquirytype"] = data["inquirytype"] ? data["inquirytype"] : "";
        filter["bookingfor"] = data["bookingfor"] ? data["bookingfor"] : "";
        filter["priority"] = data["priority"] ? data["priority"] : "";
        this.setState({ filter });
        this.getInquiries();
    };

    setgroupby = (value) => {
        let filter = this.state.filter;
        filter.groupBy = value;
        this.setState({ filter });
        this.getInquiries();
    }

    getInquiries = (isExport) => {
        if (!isExport) { this.setState({ isBtnLoading: true }) }
        var reqURL = "inquiries";
        let cPage = !isExport ? this.state.currentPage : 0
        let pSize = !isExport ? this.state.pageSize : 1000
        var reqURL =
            "inquiries?page=" +
            +cPage +
            "&records=" +
            pSize;
        if (this.state.filter.bookingfor)
            reqURL += "&bookingfor=" + this.state.filter.bookingfor;
        if (this.state.filter.customername)
            reqURL += "&customername=" + this.state.filter.customername;
        if (this.state.filter.inquiryNumber)
            reqURL += "&inquiryNumber=" + this.state.filter.inquiryNumber;
        if (this.state.filter.email)
            reqURL += "&email=" + this.state.filter.email;
        if (this.state.filter.phone)
            reqURL += "&phone=" + this.state.filter.phone;
        if (this.state.filter.title)
            reqURL += "&title=" + this.state.filter.title;
        if (this.state.filter.fromDate)
            reqURL += "&datefrom=" + this.state.filter.fromDate;
        if (this.state.filter.toDate)
            reqURL += "&dateto=" + this.state.filter.toDate;
        if (this.state.filter.inquirysource && this.state.filter.inquirysource !== 'All')
            reqURL += "&inquirysource=" + this.state.filter.inquirysource;
        if (this.state.filter.triptype)
            reqURL += "&triptype=" + this.state.filter.triptype;
        if (this.state.filter.inquirytype)
            reqURL += "&inquirytype=" + this.state.filter.inquirytype;
        if (this.state.filter.priority)
            reqURL += "&priority=" + this.state.filter.priority;
        reqURL += "&datemode=" + this.state.filter.dateMode;
        if (Number(this.state.filter.bookedBy) > 0)
            reqURL += "&bookedby=" + this.state.filter.bookedBy
        reqURL += "&searchby=" + this.state.filter.searchBy;
        reqURL += "&groupby=" + this.state.filter.groupBy;
        var reqOBJ = {};

        apiRequester_quotation_api(
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
                    if (this.state.filter.groupBy === "customer") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            customerName: groupItem.customerName
                        });
                    } else if (this.state.filter.groupBy === "inquirytype") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            inquiryType: groupItem.inquiryType === "Air" ? "Flight" : groupItem.inquiryType
                        });
                    } else if (this.state.filter.groupBy === "salesteamwise") {
                        dataValue.push({
                            rowCount: rowCount,
                            type: "header",
                            salesteamwise: groupItem.salesteamwise
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
                        if (item.email && item.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))) {
                            item.email = "";
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
                        status: "Total :",
                        budget: groupItem.totalBudget,
                    });
                });
                if (results.length > 0) {
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        status: "Grand Total :",
                        budget: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.budget ? item.budget : 0), 0)
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
        const { inquirytype } = this.state.filter;
        let exportData = this.state.exportData.map((item, index) => {
            let headerData = "";
            if (item.type === "header" && this.state.filter.groupBy === "inquirytype") {
                headerData = item.inquiryType === "Air" ? "Flight" : item.inquiryType;
                item.inquiryType = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "customer") {
                headerData = item.customerName;
                item.customerName = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "salesteamwise") {
                headerData = item.salesteamwise;
                item.customerName = "";
            } else
                headerData = item.customerName;
            return {
                "Customer Name": headerData,
                "Inquiry Number": item.inquiryNumber,
                "Inquiry Type": item.inquiryType === "Air" ? "Flight" : item.inquiryType,
                "Priority": item.type === "data" && (item.inquiry_priority === "" || item.inquiry_priority === undefined) ? "--" : item.inquiry_priority,
                "Email Address": item.email,
                "Phone Number": item.phone,
                "Title": (item.destination_location && inquirytype === "")
                    ? item.title + " - " + item.destination_location
                    : item.title,
                "destinationlocation": item.destination_location,
                "classtype": item.class_type,
                "journeytype": item.journey_type,
                "Created By": item.createdByUserName,
                "Created Date": item.type == "data" ? DateComp({ date: item.created_date, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Assignee": item.assignedUserName,
                "Inquiry Source": item.inquirySource,
                "Reference By": item.referred_by,
                "Trip Type": item.tripType,
                "Booking For Source": item.bookingFor,
                "Start Date": item.type == "data" ? DateComp({ date: item.start_date, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Duration (Nights)": item.type !== "header" ? (item.inquiryType === "Air" || item.inquiryType === "Rail" || item.inquiryType === "Bus") ? DateComp({ date: item.end_date, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : (item.inquiryType === "Transfers" || item.inquiryType === "Rent a Car") ? item.pickuptime : item.duration : "",
                "Follow-up Date": item.type == "data" ? DateComp({ date: item.followUpDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Follow-up Time": item.type == "data" && (item.followup_time === "" || null) ? "00:00" : item.followup_time,
                "Inquiry Status": item.type !== "header" ? item.status : "",
                "Budget": Amount({ amount: item.budget }),
                "No Of Travelers": item.noOfPax ? item.noOfPax : "--",
                "Other Requirements": item.requirements ? item.requirements : "--"
            }
        });

        if (exportData.length === 0) {
            exportData = [{
                "Customer Name": "No records found.",
                "Inquiry Number": "",
                "Inquiry Type": "",
                "Priority": "",
                "Email Address": "",
                "Phone Number": "",
                "Title": "",
                "destinationlocation": "",
                "classtype": "",
                "journeytype": "",
                "Created By": "",
                "Created Date": "",
                "Assignee": "",
                "Inquiry Source": "",
                "Reference By": "",
                "Trip Type": "",
                "Booking For Source": "",
                "Start Date": "",
                "Duration (Nights)": "",
                "Follow-up Date": "",
                "Follow-up Time": "",
                "Inquiry Status": "",
                "Budget": "",
                "No Of Travelers": "",
                "Other Requirements": "",
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
        function deleteKey(originalKey, exportData) {
            for (var i = 0; i < exportData.length; i++) {
                var obj = exportData[i];
                Object.keys(obj).map(key => {
                    if (key === originalKey) {
                        delete obj[key];
                    }
                });
            }
            return exportData;
        }


        if (inquirytype === '') {
            deleteKey('destinationlocation', exportData);
            deleteKey('classtype', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('Duration (Nights)', exportData);
        }
        else if (inquirytype === 'Packages') {
            changeKey('Title', 'Package Name', exportData);
            changeKey('classtype', 'Package Type', exportData);
            deleteKey('destinationlocation', exportData);
            deleteKey('journeytype', exportData);
            changeKey('Duration (Nights)', 'Duration (Days)', exportData);
        }
        else if (inquirytype === "Air") {
            changeKey('Title', 'Sector', exportData);
            changeKey('Start Date', 'Departure date', exportData);
            changeKey('Duration (Nights)', 'Arrival Date', exportData);
            changeKey('classtype', 'Class', exportData);
            changeKey('journeytype', 'Journey Type', exportData);
            deleteKey('destinationlocation', exportData);
        }
        else if (inquirytype === "Hotel") {
            changeKey('Title', 'Hotel Name/Location/City', exportData);
            changeKey('Start Date', 'Check In', exportData);
            changeKey('classtype', 'Star Rating', exportData);
            deleteKey('destinationlocation', exportData);
            deleteKey('journeytype', exportData);
        }
        else if (inquirytype === "Activity") {
            changeKey('Title', 'Activity/SIGHTEEINGS/Type', exportData);
            deleteKey('destinationlocation', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
            changeKey('Duration (Nights)', 'Duration', exportData);
        }
        else if (inquirytype === "Visa") {
            changeKey('Title', 'Country', exportData);
            changeKey('Trip Type', 'Category', exportData);
            changeKey('Start Date', 'Travel Date', exportData);
            changeKey('Duration (Nights)', 'Duration (Days)', exportData);
            deleteKey('destinationlocation', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
            changeKey('Other Requirements', 'Nationality / Documents Recieved / Remarks', exportData);
        }
        else if (inquirytype === "Transfers") {
            changeKey('Title', 'Pick Up Location', exportData);
            changeKey('destinationlocation', 'Drop Off Location', exportData);
            changeKey('Start Date', 'Pick Up Date', exportData);
            changeKey('Duration (Nights)', 'Pick Up Time', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
        }
        else if (inquirytype === "Rail") {
            changeKey('Title', 'Destination From', exportData);
            changeKey('destinationlocation', 'Destination To', exportData);
            changeKey('Start Date', 'Departure Date', exportData);
            changeKey('Duration (Nights)', 'Arrival Date', exportData);
            changeKey('classtype', 'Class', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
        }
        else if (inquirytype === "Forex") {
            changeKey('Title', 'Currency Type', exportData);
            changeKey('Start Date', 'Travel Date', exportData);
            changeKey('Budget', 'Amount', exportData);
            deleteKey('destinationlocation', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('Duration (Nights)', exportData);
            deleteKey('No Of Travelers', exportData);
            deleteKey('classtype', exportData);
        }
        else if (inquirytype === "Bus") {
            changeKey('Title', 'Destination From', exportData);
            changeKey('destinationlocation', 'Destination To', exportData);
            changeKey('Start Date', 'Departure Date', exportData);
            changeKey('Duration (Nights)', 'Arrival Date', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
        }
        else if (inquirytype === "Rent a Car") {
            changeKey('Title', 'Pick Up Location', exportData);
            changeKey('destinationlocation', 'Drop Off Location', exportData);
            changeKey('Start Date', 'Pick Up Date', exportData);
            changeKey('Duration (Nights)', 'Pick Up Time', exportData);
            deleteKey('journeytype', exportData);
            deleteKey('classtype', exportData);
        }



        const workbook1 = XLSX.utils.json_to_sheet(exportData);
        workbook1['!cols'] = [
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 200 }, { wpx: 150 },
            { wpx: 300 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 75 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 200 }, { wpx: 100 }, { wpx: 100 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 300 }
        ];
        const workbook = {
            SheetNames: ['Inquiry Report'],
            Sheets: {
                'Inquiry Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `InquiryReport.xlsx`);
    }

    getAuthToken = () => {
        this.getInquiries();
        /* var reqURL = "api/v1/user/token";
        var reqOBJ = {};
        apiRequester(reqURL, reqOBJ, (data) => {
            localStorage.setItem("userToken", data.response);
            this.getInquiries();
        }); */
    };

    showHideFilters = () => {
        this.setState({ isFilters: !this.state.isFilters });
    };

    handlePaginationResults = (pageNumber, pageLength) => {
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
        this.getAuthToken();
        this.getInquiryColumn("");
        this.getEmployeeList();
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
    getInquiryColumn = (inquirytype) => {
        let tableInquiryData = [
            "Customer Name",
            "Inquiry Number",
            "Inquiry Type",
            "Priority",
            "Email Address",
            "Phone Number",
            "Title",
            "destinationlocation",
            "classtype",
            "journeytype",
            "Created By",
            "Created Date",
            "Assignee",
            "Inquiry Source",
            "Reference By",
            "Trip Type",
            "Booking For Source",
            "Start Date",
            "Inquiry Status",
            "Follow-Up Date",
            "Follow-Up Time",
            "Duration (Nights)",
            "Budget",
            "No Of Travelers",
            "Other Requirements",
            "Activity Log"
        ];
        function changeKey(originalKey, newKey, tableInquiryData) {
            var index = tableInquiryData.indexOf(originalKey);
            if (~index) {
                tableInquiryData[index] = newKey;
            }
            return tableInquiryData;
        }
        function deleteKey(originalKey, tableInquiryData) {
            var index = tableInquiryData.indexOf(originalKey);
            if (~index) {
                delete tableInquiryData[index];
            }
            return tableInquiryData;
        }
        if (inquirytype === '') {
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('Duration (Nights)', tableInquiryData);
        }
        else if (inquirytype === 'Packages') {
            changeKey('Title', 'Package Name', tableInquiryData);
            changeKey('classtype', 'Package Type', tableInquiryData);
            changeKey('Duration (Nights)', 'Duration (Days)', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            // deleteKey('Duration (Nights)', tableInquiryData);
        }
        else if (inquirytype === "Air") {
            changeKey('Title', 'Sector', tableInquiryData);
            changeKey('Start Date', 'Departure Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Arrival Date', tableInquiryData);
            changeKey('classtype', 'Class', tableInquiryData);
            changeKey('journeytype', 'Journey Type', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
        }
        else if (inquirytype === "Hotel") {
            changeKey('Title', 'Hotel Name/Location/City', tableInquiryData);
            changeKey('Start Date', 'Check In', tableInquiryData);
            changeKey('classtype', 'Star Rating', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
        }
        else if (inquirytype === "Activity") {
            changeKey('Title', 'Activity/SIGHTEEINGS/Type', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
            changeKey('Duration (Nights)', 'Duration', tableInquiryData);
        }
        else if (inquirytype === "Visa") {
            changeKey('Title', 'Country', tableInquiryData);
            changeKey('Trip Type', 'Category', tableInquiryData);
            changeKey('Start Date', 'Travel Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Duration (Days)', tableInquiryData);
            changeKey('Other Requirements', 'Nationality / Documents Recieved / Remarks', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        else if (inquirytype === "Transfers") {
            changeKey('Title', 'Pick Up Location', tableInquiryData);
            changeKey('destinationlocation', 'Drop Off Location', tableInquiryData);
            changeKey('Start Date', 'Pick Up Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Pick Up Time', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        else if (inquirytype === "Rail") {
            changeKey('Title', 'Destination From', tableInquiryData);
            changeKey('destinationlocation', 'Destination To', tableInquiryData);
            changeKey('Start Date', 'Departure Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Arrival Date', tableInquiryData);
            changeKey('classtype', 'Class', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        else if (inquirytype === "Forex") {
            changeKey('Title', 'Currency Type', tableInquiryData);
            changeKey('Start Date', 'Travel Date', tableInquiryData);
            changeKey('Budget', 'Amount', tableInquiryData);
            deleteKey('destinationlocation', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            changeKey('Duration (Nights)', '', tableInquiryData);
            changeKey('No Of Travelers', '', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        else if (inquirytype === "Bus") {
            changeKey('Title', 'Destination From', tableInquiryData);
            changeKey('destinationlocation', 'Destination To', tableInquiryData);
            changeKey('Start Date', 'Departure Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Arrival Date', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        else if (inquirytype === "Rent a Car") {
            changeKey('Title', 'Pick Up Location', tableInquiryData);
            changeKey('destinationlocation', 'Drop Off Location', tableInquiryData);
            changeKey('Start Date', 'Pick Up Date', tableInquiryData);
            changeKey('Duration (Nights)', 'Pick Up Time', tableInquiryData);
            deleteKey('journeytype', tableInquiryData);
            deleteKey('classtype', tableInquiryData);
        }
        this.setState({
            inquiryReportTableColumn: tableInquiryData
        })
    }
    render() {
        const {
            results,
            isFilters,
            isBtnLoading,
            pageInfo,
        } = this.state;
        let startRow = this.state.currentPage === 0 ? 0 : (this.state.currentPage * parseInt(this.state.pageSize));
        let endRow = ((this.state.currentPage * parseInt(this.state.pageSize)) + parseInt(this.state.pageSize)) - 1;
        let renderData = [];
        if (results)
            renderData = results.filter(x => x.rowCount >= startRow && x.rowCount <= endRow);

        let pageInfoIndex = [{ item: pageInfo }];
        const { inquirytype } = this.state.filter;
        const { inquiryReportTableColumn } = this.state;
        return (
            <React.Fragment>
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Inquiry Report
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
                                Inquiry Report
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
                                                <option value="customer">Inquiry Report - Customer Wise</option>
                                                <option value="inquirytype">Inquiry Report - Inquiry Type Wise</option>
                                                {this.state.employeeList.find(x => x.crewID === 3 && x.isLoggedinEmployee)
                                                    && <option value="salesteamwise">Inquiry Report - Sales Team Wise</option>}
                                            </select>
                                        </div>

                                        <div className="mb-3 mt-1 float-right">
                                            {!isBtnLoading &&
                                                <React.Fragment>
                                                    <AuthorizeComponent title="InquiryReport~report-export-inquiry" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "InquiryReport~report-export-inquiry") ? this.getInquiries(true) : this.setState({ isshowauthorizepopup: true }) }}
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
                                        <QuotationReportFilters
                                            handleFilters={this.handleFilters}
                                            showHideFilters={this.showHideFilters}
                                            reportType={"InquiryReport"}
                                            filterData={this.state.filter}
                                            employeeList={this.state.employeeList}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <div className="table-responsive">
                                        <table className="table border table-column-width" id="sheet1">
                                            <thead className="thead-light">
                                                <tr>
                                                    {
                                                        inquiryReportTableColumn.map((data, key) => {
                                                            return (
                                                                <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                            )
                                                        })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isBtnLoading && (<TableLoading columns={15} />)}
                                                {
                                                    !isBtnLoading && results &&
                                                    results.length > 0 &&
                                                    renderData.map((item, index) => {
                                                        var grouptitle = "";
                                                        if (this.state.filter.groupBy === "inquirytype")
                                                            grouptitle = item.inquiryType === "Air" ? "Flight" : item.inquiryType
                                                        else if (this.state.filter.groupBy === "customer")
                                                            grouptitle = item.customerName
                                                        else if (this.state.filter.groupBy === "salesteamwise")
                                                            grouptitle = item.salesteamwise
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="16">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td className="text-capitalize" style={{ "wordBreak": "break-word" }}>{item.customerName}</td>
                                                                    <td>{item.inquiryNumber}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.inquiryType === "Air" ? "Flight" : item.inquiryType}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}> {(item.inquiry_priority === null || item.inquiry_priority === "" || item.inquiry_priority === undefined) ? "--" : item.inquiry_priority}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.email}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.phone}</td>
                                                                    {inquirytype !== "" && <td style={{ "wordBreak": "break-word" }}>{item.title}</td>}
                                                                    {inquirytype === "" && <td style={{ "wordBreak": "break-word" }}>{item.destination_location ? item.title + " - " + item.destination_location : item.title}</td>}
                                                                    {inquirytype !== "" && (item.inquiryType === "Transfers"
                                                                        || item.inquiryType === "Rail"
                                                                        || item.inquiryType === "Bus"
                                                                        || item.inquiryType === "Rent a Car") &&
                                                                        <td style={{ "wordBreak": "break-word" }}>{item.destination_location}</td>
                                                                    }
                                                                    {inquirytype !== "" && (item.inquiryType === "Packages"
                                                                        || item.inquiryType === "Air"
                                                                        || item.inquiryType === "Hotel"
                                                                        || item.inquiryType === "Rail") &&
                                                                        <td style={{ "wordBreak": "break-word" }}>{item.class_type}</td>
                                                                    }
                                                                    {inquirytype !== "" && item.inquiryType === "Air" &&
                                                                        <td style={{ "wordBreak": "break-word" }}>{item.journey_type}</td>
                                                                    }
                                                                    <td className="text-capitalize" style={{ "wordBreak": "break-word" }}>{item.createdByUserName}</td>
                                                                    <td className="text-capitalize" style={{ "wordBreak": "break-word" }}><DateComp date={item.created_date} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td className="text-capitalize" style={{ "wordBreak": "break-word" }}>{item.assignedUserName}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{(item.inquirySource === null || item.inquirySource === "" || item.inquirySource === undefined) ? "--" : item.inquirySource}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{(item.referred_by === null || item.referred_by === "" || item.referred_by === undefined) ? "--" : item.referred_by}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{(item.tripType === null || item.tripType === "" || item.tripType === undefined) ? "--" : item.tripType}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.bookingFor}</td>
                                                                    <td><DateComp date={item.start_date} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td>{item.status}</td>
                                                                    <td><DateComp date={item.followUpDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.followup_time === "" || null ? "00:00" : item.followup_time}</td>
                                                                    {inquirytype !== "" &&
                                                                        <td>{inquirytype === "Air" || inquirytype === "Rail" || inquirytype === "Bus" ? <DateComp date={item.end_date} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : (inquirytype === "Transfers" || inquirytype === "Rent a Car") ? item.pickuptime : (inquirytype === "Forex") ? "" : item.duration}
                                                                        </td>
                                                                    }
                                                                    <td><Amount amount={item.budget} currencyCode={item.currencyCode} /></td>
                                                                    <td>{(inquirytype === "Forex") ? "" : item.noOfPax ? item.noOfPax : "--"}</td>
                                                                    <td style={{ "wordBreak": "break-word" }}>{item.requirements ? item.requirements : "--"}</td>
                                                                    <td><button className="btn btn-link m-0 p-0 text-secondary"
                                                                        onClick={() => { this.getActivityLogDetails(item) }}
                                                                    >
                                                                        <i className="fa fa-download" aria-hidden="true"></i>{" "}
                                                                    </button></td>
                                                                </tr>
                                                                : item.type === "footer" ?
                                                                    <tr key={index} className="tbody-group-footer">
                                                                        {(inquirytype !== "" && (inquirytype === "Packages"
                                                                            || inquirytype === "Hotel"
                                                                            || inquirytype === "Transfers"
                                                                            || inquirytype === "Bus"
                                                                            || inquirytype === "Rent a Car")) &&
                                                                            <th>&nbsp;</th>
                                                                        }
                                                                        {(inquirytype !== "" &&
                                                                            (inquirytype === "Air" || inquirytype === "Rail")) &&
                                                                            <> <th>&nbsp;</th>
                                                                                <th>&nbsp;</th>
                                                                            </>
                                                                        }
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>{item.duration}</th>
                                                                        {inquirytype !== "" && <th>&nbsp;</th>}
                                                                        <th>&nbsp;</th>
                                                                        <th><Amount amount={item.budget} /></th>
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
                                                    handlePaginationResults={this.handlePaginationResults}
                                                />
                                            )}
                                    </div>
                                    {this.state.activityLogDetails ? (
                                        <ModelPopup
                                            header={"Activity Log"}
                                            content={<ActivityLogDetails activityLogDetails={this.state.activityLogDetails} userInfo={this.props.userInfo} />}
                                            handleHide={this.handleHideActivityLogPopup}
                                        />
                                    ) : null}
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
    "Customer Name": 200,
    "Inquiry Number": 150,
    "Inquiry Type": 100,
    "Priority": 100,
    "Email Address": 250,
    "Phone Number": 200,
    "Package Name": 200,
    "Package Type": 200,
    "Country": 200,
    "Class": 200,
    "Journey Type": 200,
    "Star Rating": 150,
    "Pick Up Location": 250,
    "Drop Off Location": 250,
    "Destination From": 250,
    "Destination To": 250,
    "Sector": 200,
    "Hotel Name/Location/City": 200,
    "Activity/SIGHTEEINGS/Type": 250,
    "Currency Type": 200,
    "Title": 200,
    "Created By": 200,
    "Created Date": 200,
    "Assignee": 200,
    "Inquiry Source": 150,
    "Reference By": 150,
    "Category": 150,
    "Trip Type": 150,
    "Booking For Source": 150,
    "Check In": 120,
    "Travel Date": 120,
    "Start Date": 120,
    "End Date": 120,
    "Pick Up Date": 120,
    "Pick Up Time": 120,
    "Departure Date": 120,
    "Follow-Up Date": 150,
    "Follow-Up Time": 150,
    "Duration (Nights)": 100,
    "Duration": 100,
    "Arrival Date": 100,
    "Amount": 150,
    "Budget": 150,
    "No Of Travelers": 100,
    "Other Requirements": 300,
    "Nationality / Documents Recieved / Remarks": 300,
    "Inquiry Status": 200,
    "Activity Log": 100,
    "Duration (Days/Night(s))": 200,
    "Duration (Days)": 200
}

export default InquiryReport;
