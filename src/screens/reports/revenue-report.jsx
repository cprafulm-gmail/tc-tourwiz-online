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

class RevenueReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: "",
            isDeleteConfirmPopup: false,
            deleteItem: "",
            type: "Itinerary",
            importItineraries: "",
            exportData: null,
            exportData: false,
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
        filter["customername"] = data["customername"] ? data["customername"] : "";
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
        var reqURL = "tw/reports/revenue?pagenumber=1&pagesize=0";

        if (this.state.filter.businessId)
            reqURL += "&businessId=" + this.state.filter.businessId

        if (this.state.filter.bookingStatus)
            reqURL += "&bookingstatusId=" + this.state.filter.bookingStatus

        if (this.state.filter.dateMode === "specific-date" || this.state.filter.dateMode === "between-dates" || this.state.filter.dateMode === "specific-month")
            reqURL += "&fromdate=" + this.state.filter.fromDate + "&todate=" + this.state.filter.toDate;

        if (Number(this.state.filter.bookedBy) > 0)
            reqURL += "&bookedby=" + this.state.filter.bookedBy
        reqURL += "&searchBy=" + this.state.filter.searchBy
        reqURL += "&datemode=" + this.state.filter.dateMode
        reqURL += "&groupBy=" + this.state.filter.groupBy;

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
                        dataValue.push({
                            rowCount: rowCount++,
                            type: "data",
                            ...item
                        });
                    });
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        paymentMode: "Total :",
                        baseAmount: groupItem.totalBaseAmount,
                        tax: groupItem.totalTax,
                        fees: groupItem.totalFees,
                        processingFees: groupItem.totalProcessingFees,
                        cgst: groupItem.totalCGST,
                        sgst: groupItem.totalSGST,
                        igst: groupItem.totalIGST,
                        tax1: groupItem.totalTax1,
                        tax2: groupItem.totalTax2,
                        tax3: groupItem.totalTax3,
                        tax4: groupItem.totalTax4,
                        tax5: groupItem.totalTax5,
                        totalBookingAmount: groupItem.totalTotalBookingAmount,
                        discountAmount: groupItem.totalDiscountAmount,
                        netAmount: groupItem.totalNetAmount,
                        paidAmount: groupItem.totalPaidAmount,
                        pandingAmount: groupItem.totalPandingAmount,
                        cancellationCharges: groupItem.totalCancellationCharges,
                        cancellationFees: groupItem.totalCancellationFees,
                        refund: groupItem.totalRefund,
                        revenue: groupItem.totalRevenue,
                        currencyCode: groupItem.details[0].currencyCode
                    });
                });
                if (results.length > 0) {
                    dataValue.push({
                        rowCount: rowCount - 1,
                        type: "footer",
                        paymentMode: "Grand Total :",
                        baseAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.baseAmount ? item.baseAmount : 0), 0),
                        tax: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax ? item.tax : 0), 0),
                        fees: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.fees ? item.fees : 0), 0),
                        processingFees: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.processingFees ? item.processingFees : 0), 0),
                        cgst: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.cgst ? item.cgst : 0), 0),
                        sgst: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.sgst ? item.sgst : 0), 0),
                        igst: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.igst ? item.igst : 0), 0),
                        tax1: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax1 ? item.tax1 : 0), 0),
                        tax2: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax2 ? item.tax2 : 0), 0),
                        tax3: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax3 ? item.tax3 : 0), 0),
                        tax4: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax4 ? item.tax4 : 0), 0),
                        tax5: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.tax5 ? item.tax5 : 0), 0),
                        totalBookingAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalBookingAmount ? item.totalBookingAmount : 0), 0),
                        discountAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.discountAmount ? item.discountAmount : 0), 0),
                        netAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.netAmount ? item.netAmount : 0), 0),
                        paidAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.paidAmount ? item.paidAmount : 0), 0),
                        cancellationCharges: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.cancellationCharges ? item.cancellationCharges : 0), 0),
                        cancellationFees: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.cancellationFees ? item.cancellationFees : 0), 0),
                        refund: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.refund ? item.refund : 0), 0),
                        revenue: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.revenue ? item.revenue : 0), 0),
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

    removeNNumber = (input) => {

        if (Number(input).toString().indexOf('.') === -1)
            return Number(input);
        else if (Number(input).toString().split('.')[1].length > 2)
            return Number(Number(input).toFixed(2));
        else
            return Number(Number(input).toFixed(2));
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

    getExcelReport() {

        let exportData = this.state.exportData.map((item) => {
            let headerData = "";
            const env = JSON.parse(localStorage.getItem("environment"));
            let generalTaxes = [];
            if (env.customTaxConfigurations && env.customTaxConfigurations.length > 0) {
                generalTaxes = env.customTaxConfigurations[0]
                    .taxes.filter(tax => Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
                    .map(item => { return { "name": item.name, "purpose": item.purpose } })
                    .filter(x => ["Tax1", "Tax2", "Tax3", "Tax4", "Tax5"].indexOf(x.name) === -1)
                    .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
            }

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
            var objGeneral = {
                "Customer Details": headerData,
                "Customer ID": item.customerId,
                "Itinerary Reference Number": item.itineraryRefNo,
                "Transaction Token": item.transactionToken,
                "Status": item.bookingStatus,
                "Booking ID": item.bookingID,
                "Booking Date": item.type == "data" ? DateComp({ date: item.bookingDateTime, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Booking Details": item.destination,
                "Product": item.product === "Air" ? "Flight" : item.product,
                "Start Date": item.type === "data" ? DateComp({ date: item.startDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "End Date": item.type === "data" ? DateComp({ date: item.endDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Cost Price": Amount({ amount: item.baseAmount, currencyCode: item.currencyCode }),
                "Transaction Fee": Amount({ amount: item.fees, currencyCode: item.currencyCode }),
            }
            const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
                && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
            if (IsGSTApplicable) {
                var objGST = {
                    "Processing Fees": Amount({ amount: item.processingFees, currencyCode: item.currencyCode }),
                    "CGST": Amount({ amount: item.cgst, currencyCode: item.currencyCode }),
                    "SGST": Amount({ amount: item.sgst, currencyCode: item.currencyCode }),
                    "IGST": Amount({ amount: item.igst, currencyCode: item.currencyCode }),
                    "Invlusive GST": item.type === "data" ? item.isInclusiveGST ? "Yes" : "No" : "",
                }
                Object.assign(objGeneral, objGST);
            }
            if (generalTaxes.find(x => x.purpose === "160")) {
                let taxName = generalTaxes.find(x => x.purpose === "160").name;
                objGeneral[taxName] = Amount({ amount: item.tax1, currencyCode: item.currencyCode })
            }
            if (generalTaxes.find(x => x.purpose === "161")) {
                let taxName = generalTaxes.find(x => x.purpose === "161").name;
                objGeneral[taxName] = Amount({ amount: item.tax2, currencyCode: item.currencyCode })
            }
            if (generalTaxes.find(x => x.purpose === "162")) {
                let taxName = generalTaxes.find(x => x.purpose === "162").name;
                objGeneral[taxName] = Amount({ amount: item.tax3, currencyCode: item.currencyCode })
            }
            if (generalTaxes.find(x => x.purpose === "163")) {
                let taxName = generalTaxes.find(x => x.purpose === "163").name;
                objGeneral[taxName] = Amount({ amount: item.tax4, currencyCode: item.currencyCode })
            }
            if (generalTaxes.find(x => x.purpose === "164")) {
                let taxName = generalTaxes.find(x => x.purpose === "164").name;
                objGeneral[taxName] = Amount({ amount: item.tax5, currencyCode: item.currencyCode })
            }
            let objGeneralRamain = {
                "Selling Price": Amount({ amount: item.totalBookingAmount, currencyCode: item.currencyCode }),
                "Commission": item.type !== "header" ? "--" : "",
                "Net Revenue": Amount({ amount: item.revenue, currencyCode: item.currencyCode }),
                "Cancel Fee": item.cancellationFees
                    ? Amount({ amount: item.cancellationFees, currencyCode: item.currencyCode })
                    : item.bookingStatus === ("Confirmed" || undefined)
                        ? "--"
                        : item.type === "header"
                            ? ""
                            : Amount({ amount: item.cancellationCharges, currencyCode: item.currencyCode })

            }
            Object.assign(objGeneral, objGeneralRamain);
            return objGeneral;

        });
        const env = JSON.parse(localStorage.getItem("environment"));
        let generalTaxes = [];
        if (env.customTaxConfigurations && env.customTaxConfigurations.length > 0) {
            generalTaxes = env.customTaxConfigurations[0]
                .taxes.filter(tax => Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
                .map(item => { return { "name": item.name, "purpose": item.purpose } })
                .filter(x => ["Tax1", "Tax2", "Tax3", "Tax4", "Tax5"].indexOf(x.name) === -1)
                .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
        }

        var ObjGeneral1 = {
            "Customer Details": "No records found.",
            "Customer ID": "",
            "Itinerary Reference Number": "",
            "Transaction Token": "",
            "Status": "",
            "Booking ID": "",
            "Booking Date": "",
            "Booking Details": "",
            "Product": "",
            "Start Date": "",
            "End Date": "",
            "Payment Mode": "",
            "Cost Price": "",
            "Transaction Fee": "",
        }
        var excelColSize = [{ wpx: 200 }, { wpx: 100 }, { wpx: 150 }, { wpx: 100 }, { wpx: 125 },
        { wpx: 150 }, { wpx: 100 }, { wpx: 200 }, { wpx: 100 }, { wpx: 100 },
        { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },]
        const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
            && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
        if (IsGSTApplicable) {
            var objGST1 = {
                "Processing Fees": "",
                "CGST": "",
                "SGST": "",
                "IGST": "",
                "Inclusive GST": "",
            }
            Object.assign(ObjGeneral1, objGST1);
            var tmpExcelColSize = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]
            excelColSize = excelColSize.concat(tmpExcelColSize);
        }
        if (generalTaxes.find(x => x.purpose === "160")) {
            let taxName = generalTaxes.find(x => x.purpose === "160").name;
            ObjGeneral1[taxName] = "";
            excelColSize = excelColSize.concat([{ wpx: 100 }]);
        }
        if (generalTaxes.find(x => x.purpose === "161")) {
            let taxName = generalTaxes.find(x => x.purpose === "161").name;
            ObjGeneral1[taxName] = "";
            excelColSize = excelColSize.concat([{ wpx: 100 }]);
        }
        if (generalTaxes.find(x => x.purpose === "162")) {
            let taxName = generalTaxes.find(x => x.purpose === "162").name;
            ObjGeneral1[taxName] = "";
            excelColSize = excelColSize.concat([{ wpx: 100 }]);
        }
        if (generalTaxes.find(x => x.purpose === "163")) {
            let taxName = generalTaxes.find(x => x.purpose === "163").name;
            ObjGeneral1[taxName] = "";
            excelColSize = excelColSize.concat([{ wpx: 100 }]);
        }
        if (generalTaxes.find(x => x.purpose === "164")) {
            let taxName = generalTaxes.find(x => x.purpose === "164").name;
            ObjGeneral1[taxName] = "";
            excelColSize = excelColSize.concat([{ wpx: 100 }]);
        }

        let objGeneralRamain = {
            "Selling Price": "",
            "Commission": "",
            "Net Revenue": "",
            "Cancel Fee": "",
        }
        excelColSize = excelColSize.concat([{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }]);
        Object.assign(ObjGeneral1, objGeneralRamain);

        if (exportData.length === 0) {
            exportData.push(ObjGeneral1);
            exportData = [ObjGeneral1]
        }

        const workbook1 = XLSX.utils.json_to_sheet(exportData);
        workbook1['!cols'] = excelColSize

        const workbook = {
            SheetNames: ['Revenue Report'],
            Sheets: {
                'Revenue Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `RevenueReport.xlsx`);
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
        let renderData = [];
        if (results)
            renderData = results.filter(x => x.rowCount >= startRow && x.rowCount <= endRow);

        let pageInfoIndex = [{ item: pageInfo }];
        const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
            && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
        const env = JSON.parse(localStorage.getItem("environment"));
        let generalTaxes = [];
        if (env.customTaxConfigurations && env.customTaxConfigurations.length > 0) {
            generalTaxes = env.customTaxConfigurations[0]
                .taxes.filter(tax => Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
                .map(item => { return { "name": item.name, "purpose": item.purpose } })
                .filter(x => ["Tax1", "Tax2", "Tax3", "Tax4", "Tax5"].indexOf(x.name) === -1)
                .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
        }

        let table_column_render = [...table_column];

        if (IsGSTApplicable) {
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Processing Fees");
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "CGST");
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "SGST");
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "IGST");
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Inclusive GST");
        }
        if (generalTaxes.find(x => x.purpose === "160"))
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Tax160");
        if (generalTaxes.find(x => x.purpose === "161"))
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Tax161");
        if (generalTaxes.find(x => x.purpose === "162"))
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Tax162");
        if (generalTaxes.find(x => x.purpose === "163"))
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Tax163");
        if (generalTaxes.find(x => x.purpose === "164"))
            table_column_render.splice(table_column_render.indexOf("Selling Price"), 0, "Tax164");

        return (
            <React.Fragment>
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Revenue Report
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
                                Revenue Report
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
                                                <option value="customer">Revenue Report - Customer Wise</option>
                                                <option value="product">Revenue Report - Product Wise</option>
                                                <option value="salesteamwise">Revenue Report - Sales Team Wise</option>
                                            </select>
                                        </div>
                                        <div className="mb-3 mt-1 float-right">
                                            <AuthorizeComponent title="RevenueReport~report-export-revenue" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                {!isBtnLoading &&
                                                    <React.Fragment>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "RevenueReport~report-export-revenue") ? this.getData(true) : this.setState({ isshowauthorizepopup: true }) }}
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
                                            reportType={"RevenueReport"}
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
                                                    {table_column_render.map((data, key) => {
                                                        return (
                                                            <th width={table_column_width[data]} key={key} scope="col">
                                                                {data.startsWith("Tax") ? generalTaxes.find(x => data.replace("Tax", "") === x.purpose).name : data}
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isBtnLoading && (<TableLoading columns={28} />)}
                                                {!isBtnLoading && results &&
                                                    results.length > 0 &&
                                                    renderData.map((item, index) => {
                                                        var grouptitle = "";
                                                        if (this.state.filter.groupBy === "product")
                                                            grouptitle = item.product === "Air" ? "Flight" : item.product
                                                        else if (this.state.filter.groupBy === "salesteamwise")
                                                            grouptitle = item.agentName
                                                        else if (this.state.filter.groupBy === "customer") {
                                                            grouptitle = item.customerName;
                                                            if (item.cellPhone) {
                                                                grouptitle = grouptitle + " (" + item.cellPhone + ") ";
                                                            }
                                                            if (item.customerId) {
                                                                grouptitle = grouptitle + " - (" + item.customerId + ")";
                                                            }
                                                        }
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="21">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td className="text-capitalize" style={{ "word-break": "break-word" }}>{item.customerName} {item.cellPhone ? "(" + item.cellPhone + ")" : ""}</td>
                                                                    <td>{item.customerId ? item.customerId : "--"}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.itineraryRefNo}</td>
                                                                    <td>{item.transactionToken}</td>
                                                                    <td>{item.bookingStatus}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.bookingID}</td>
                                                                    <td><DateComp date={item.bookingDateTime} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.destination}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.product === "Air" ? "Flight" : item.product}</td>
                                                                    <td><DateComp date={item.startDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><DateComp date={item.endDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td><Amount amount={item.baseAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td><Amount amount={item.fees} currencyCode={item.fees} /></td>
                                                                    {IsGSTApplicable && <>
                                                                        <td><Amount amount={item.processingFees ? item.processingFees : 0} currencyCode={item.currencyCode} /></td>
                                                                        <td><Amount amount={item.cgst ? item.cgst : 0} currencyCode={item.currencyCode} /></td>
                                                                        <td><Amount amount={item.sgst ? item.sgst : 0} currencyCode={item.currencyCode} /></td>
                                                                        <td><Amount amount={item.igst ? item.igst : 0} currencyCode={item.currencyCode} /></td>
                                                                        <td>{item.isInclusiveGST === true ? "Yes" : "No"}</td>
                                                                    </>}
                                                                    {generalTaxes.find(x => x.purpose === "160") &&
                                                                        <td><Amount amount={item.tax1 ? item.tax1 : 0} currencyCode={item.currencyCode} /></td>}
                                                                    {generalTaxes.find(x => x.purpose === "161") &&
                                                                        <td><Amount amount={item.tax2 ? item.tax2 : 0} currencyCode={item.currencyCode} /></td>}
                                                                    {generalTaxes.find(x => x.purpose === "162") &&
                                                                        <td><Amount amount={item.tax3 ? item.tax3 : 0} currencyCode={item.currencyCode} /></td>}
                                                                    {generalTaxes.find(x => x.purpose === "163") &&
                                                                        <td><Amount amount={item.tax4 ? item.tax4 : 0} currencyCode={item.currencyCode} /></td>}
                                                                    {generalTaxes.find(x => x.purpose === "164") &&
                                                                        <td><Amount amount={item.tax5 ? item.tax5 : 0} currencyCode={item.currencyCode} /></td>}
                                                                    <td><Amount amount={item.totalBookingAmount} currencyCode={item.currencyCode} /></td>
                                                                    <td>--</td>
                                                                    <td><Amount amount={item.revenue} currencyCode={item.currencyCode} /></td>
                                                                    <td>{item.cancellationFees
                                                                        ? <Amount amount={item.cancellationFees} currencyCode={item.currencyCode} />
                                                                        : item.bookingStatus === ("Confirmed" || undefined)
                                                                            ? "--"
                                                                            : item.type === "header"
                                                                                ? ""
                                                                                : item.type === "footer"
                                                                                    ? <Amount amount={item.revenue} currencyCode={item.currencyCode} />
                                                                                    : <Amount amount={item.cancellationCharges} currencyCode={item.currencyCode} />}</td>
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
                                                                        <th>{item.paymentMode}</th>
                                                                        <th><Amount amount={this.removeNNumber(item.baseAmount)} currencyCode={item.currencyCode} /></th>
                                                                        <th><Amount amount={this.removeNNumber(item.fees)} currencyCode={item.currencyCode} /></th>
                                                                        {IsGSTApplicable && <>
                                                                            <th><Amount amount={item.processingFees ? this.removeNNumber(item.processingFees) : 0} currencyCode={item.currencyCode} /></th>
                                                                            <th><Amount amount={item.cgst ? this.removeNNumber(item.cgst) : 0} currencyCode={item.currencyCode} /></th>
                                                                            <th><Amount amount={item.sgst ? this.removeNNumber(item.sgst) : 0} currencyCode={item.currencyCode} /></th>
                                                                            <th><Amount amount={item.igst ? this.removeNNumber(item.igst) : 0} currencyCode={item.currencyCode} /></th>
                                                                            <th>&nbsp;</th>
                                                                        </>}
                                                                        {generalTaxes.find(x => x.purpose === "160") &&
                                                                            <th><Amount amount={item.tax1 ? this.removeNNumber(item.tax1) : 0} currencyCode={item.currencyCode} /></th>}
                                                                        {generalTaxes.find(x => x.purpose === "161") &&
                                                                            <th><Amount amount={item.tax2 ? this.removeNNumber(item.tax2) : 0} currencyCode={item.currencyCode} /></th>}
                                                                        {generalTaxes.find(x => x.purpose === "162") &&
                                                                            <th><Amount amount={item.tax3 ? this.removeNNumber(item.tax3) : 0} currencyCode={item.currencyCode} /></th>}
                                                                        {generalTaxes.find(x => x.purpose === "163") &&
                                                                            <th><Amount amount={item.tax4 ? this.removeNNumber(item.tax4) : 0} currencyCode={item.currencyCode} /></th>}
                                                                        {generalTaxes.find(x => x.purpose === "164") &&
                                                                            <th><Amount amount={item.tax5 ? this.removeNNumber(item.tax5) : 0} currencyCode={item.currencyCode} /></th>}
                                                                        <th><Amount amount={this.removeNNumber(item.totalBookingAmount)} currencyCode={item.currencyCode} /></th>
                                                                        <th>--</th>
                                                                        <th><Amount amount={this.removeNNumber(item.revenue)} currencyCode={item.currencyCode} /></th>
                                                                        <th><Amount amount={this.removeNNumber(item.cancellationCharges)} currencyCode={item.currencyCode} /></th>
                                                                    </tr>
                                                                    : "")
                                                    })}
                                                {
                                                    !isBtnLoading && results &&
                                                    results.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={7}>No records found.</td>
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
    "Itinerary Reference Number": 200,
    "Transaction Token": 200,
    "Status": 150,
    "Booking ID": 250,
    "Booking Date": 100,
    "Booking Details": 300,
    "Product": 100,
    "Start Date": 100,
    "End Date": 100,
    "Cost Price": 150,
    "Tax": 150,
    "Transaction Fee": 150,
    "Selling Price": 150,
    "Commission": 150,
    "Net Revenue": 150,
    "Cancel Fee": 150,
    "Processing Fees": 150,
    "Fees": 150,
    "CGST": 150,
    "SGST": 150,
    "IGST": 150,
    "Inclusive GST": 150,
    "Tax160": 150,
    "Tax161": 150,
    "Tax162": 150,
    "Tax163": 150,
    "Tax164": 150,
}

const table_column = ["Customer Details",
    "Customer ID",
    "Itinerary Reference Number",
    "Transaction Token",
    "Status",
    "Booking ID",
    "Booking Date",
    "Booking Details",
    "Product",
    "Start Date",
    "End Date",
    "Cost Price",
    "Transaction Fee",
    "Selling Price",
    "Commission",
    "Net Revenue",
    "Cancel Fee"
]
//Revenue report
export default RevenueReport;
