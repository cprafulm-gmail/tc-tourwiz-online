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

class SupplierPaymentReport extends Component {
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
                groupBy: "supplier",
                searchBy: null,
                dateMode: "",
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                pagenumber: 1,
                pagesize: 10,
                bookedBy: null,
                customerId: '',
                supplierId: '',
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
        //filter["groupBy"] = data["groupBy"] ? data["groupBy"] : "supplier";
        filter["supplierId"] = data["supplierId"] ? data["supplierId"] : "";
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
        var reqURL = "tw/reports/supplierpayment?pagenumber=1&pagesize=0";

        if (this.state.filter.businessId)
            reqURL += "&businessId=" + this.state.filter.businessId

        if (this.state.filter.supplierId)
            reqURL += "&supplierId=" + this.state.filter.supplierId

        reqURL += "&datemode=" + this.state.filter.dateMode
        reqURL += "&groupBy=" + this.state.filter.groupBy;

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
                            supplierId: groupItem.supplierId,
                            supplier: groupItem.supplier
                        });
                    }
                    groupItem.details.map(item => {
                        dataValue.push({
                            rowCount: rowCount++,
                            type: "data",
                            ...item
                        });
                    });
                    if (this.state.filter.groupBy === "supplier") {
                        dataValue.push({
                            rowCount: rowCount - 1,
                            type: "footer",
                            supplierID: "Total :",
                            totalValue: groupItem.totalTotalValue,
                            totalSalesMade: groupItem.totalTotalSalesMade,
                            refundsMade: groupItem.totalRefundsMade,
                            commissionOwed: groupItem.totalCommissionOwed,
                            totalRefundsMade: groupItem.totalTotalRefundsMade,
                            netSupplierPayment: groupItem.totalNetSupplierPayment,
                            paidAmount: groupItem.totalPaidAmount,
                            pendingAmount: groupItem.totalPendingAmount,
                            currencyCode: groupItem.details[0].currencyCode,
                            supplierCurrency: groupItem.details[0].supplierCurrency
                        });
                    }
                });
                // if (results.length > 0) {
                //     dataValue.push({
                //         rowCount: rowCount - 1,
                //         type: "footer",
                //         supplierID: "Grand Total :",
                //         totalValue: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalValue ? item.totalValue : 0), 0),
                //         totalSalesMade: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalSalesMade ? item.totalSalesMade : 0), 0),
                //         refundsMade: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.refundsMade ? item.refundsMade : 0), 0),
                //         commissionOwed: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.commissionOwed ? item.commissionOwed : 0), 0),
                //         totalRefundsMade: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.totalRefundsMade ? item.totalRefundsMade : 0), 0),
                //         netSupplierPayment: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.netSupplierPayment ? item.netSupplierPayment : 0), 0),
                //         paidAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.paidAmount ? item.paidAmount : 0), 0),
                //         pendingAmount: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.pendingAmount ? item.pendingAmount : 0), 0),
                //     });
                // }
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
        this.getData();
    }

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
            if (item.type === "header" && this.state.filter.groupBy === "supplier") {
                headerData = item.supplier;
                item.supplier = "";
            }
            else if (item.type === "header" && this.state.filter.groupBy === "product") {
                headerData = item.product === "Air" ? "Flight" : item.product;
                item.product = "";
            } else
                headerData = item.supplier && item.cellPhone ? item.supplier : "";
            return {
                "Invocie Date": item.type == "header" ? headerData : item.type == "data" ? DateComp({ date: item.invoiceDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
                "Invoice Number": item.invoiceNumber,
                "Product": item.product === "Air" ? "Flight" : item.product,
                "Supplier": item.supplier,
                "Supplier ID": item.supplierID,
                "Total Value": Amount({ amount: item.totalValue, currencyCode: item.SupplierCurrency }),
                "Supplier Currency Rate": item.type === "data" ? parseFloat(item.supplierCurrencyConversionRate).toFixed(5) : "",
                "Total sales made": Amount({ amount: item.totalSalesMade, currencyCode: item.currencyCode }),
                "Refunds made": Amount({ amount: item.refundsMade, currencyCode: item.currencyCode }),
                "Commission owed": Amount({ amount: item.commissionOwed, currencyCode: item.currencyCode }),
                "Total refunds made": Amount({ amount: item.totalRefundsMade, currencyCode: item.currencyCode }),
                "Net Supplier Payment": Amount({ amount: item.netSupplierPayment, currencyCode: item.SupplierCurrency }),
                "Paid Amount": Amount({ amount: item.paidAmount }),
                "Pending Amount": Amount({ amount: item.pendingAmount }),
                "Payment Due Date": item.type == "data" ? DateComp({ date: item.paymentDueDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""
            }
        });

        if (exportData.length === 0) {
            exportData = [{
                "Invocie Date": "No records found.",
                "Invoice Number": "",
                "Product": "",
                "Supplier": "",
                "Supplier ID": "",
                "Total Value": "",
                "Supplier Currency Conversion Rate": "",
                "Total sales made": "",
                "Refunds made": "",
                "Commission owed": "",
                "Total refunds made": "",
                "Net Supplier Payment": "",
                "Paid Amount": "",
                "Pending Amount": "",
                "Payment Due Date": "",
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
            SheetNames: ['Supplier Payment Report'],
            Sheets: {
                'Supplier Payment Report': workbook1
            }
        };
        this.setState({ exportData: [], reportLoading: false })
        return XLSX.writeFile(workbook, `SupplierPaymentReport.xlsx`);
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

        return (
            <React.Fragment>
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Supplier Payment Report
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
                                Supplier Payment Report
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
                                                <option value="supplier">Supplier Report - supplier Wise</option>
                                                <option value="product">Supplier Report - Product Wise</option>
                                            </select>
                                        </div>

                                        <div className="mb-3 mt-1 float-right">
                                            <AuthorizeComponent title="SupplierPaymentReport~report-export-supplierpayment" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                {!isBtnLoading &&
                                                    <React.Fragment>
                                                        {!this.state.reportLoading &&
                                                            <button
                                                                className="btn btn-sm btn-primary pull-right"
                                                                onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierPaymentReport~report-export-supplierpayment") ? this.getData(true) : this.setState({ isshowauthorizepopup: true }) }}
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
                                            reportType={"SupplierPaymentReport"}
                                            history={this.props.history}
                                            providerId={this.props.userInfo.agentID}
                                            userID={this.props.userInfo.userID}
                                            groupByfilter={this.state.filter.groupBy}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <div className="table-responsive">
                                        <table className="table border table-column-width" id="sheet1">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th width={table_column_width["Invoice Date"]} rowSpan="2">Invoice Date</th>
                                                    <th width={table_column_width["Invoice Number"]} rowSpan="2">Invoice Number</th>
                                                    {/* border-bottom: 2px solid #209e478c;
                                                    border-bottom: 2px solid #4a92da; */}
                                                    <th width={table_column_width["Money In"]} colSpan="6">Money In</th>
                                                    <th width={table_column_width["Money Out"]} colSpan="3">Money Out</th>
                                                    <th width={table_column_width["Net Supplier Payment"]} rowSpan="2">Net Supplier Payment</th>
                                                    <th width={table_column_width["Paid Amount"]} rowSpan="2">Paid Amount</th>
                                                    <th width={table_column_width["Pending Amount"]} rowSpan="2">Pending Amount</th>
                                                    <th width={table_column_width["Payment Due Date"]} rowSpan="2">Payment Due Date</th>
                                                </tr>
                                                <tr>
                                                    {[
                                                        "Product",
                                                        "Supplier",
                                                        "Supplier ID",
                                                        "Total Value",
                                                        "Supplier Currency Conversion Rate",
                                                        "Total sales made",
                                                        "Refunds made",
                                                        "Commission owed",
                                                        "Total refunds made",
                                                    ].map((data, key) => {
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
                                                        if (this.state.filter.groupBy === "product")
                                                            grouptitle = item.product === "Air" ? "Flight" : item.product
                                                        else if (this.state.filter.groupBy === "supplier")
                                                            grouptitle = item.supplier
                                                        return (item.type === "header" ?
                                                            <tr key={index} className="tbody-group-header">
                                                                <th colSpan="18">{grouptitle}</th>
                                                            </tr>
                                                            : item.type === "data" ?
                                                                <tr key={index}>
                                                                    <td><DateComp date={item.invoiceDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.invoiceNumber}</td>
                                                                    <td>{item.product === "Air" ? "Flight" : item.product}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.supplier}</td>
                                                                    <td style={{ "word-break": "break-word" }}>{item.supplierID}</td>
                                                                    <td><Amount amount={item.totalValue} currencyCode={item.supplierCurrency} /></td>
                                                                    <td>{parseFloat(item.supplierCurrencyConversionRate).toFixed(5)}</td>
                                                                    <td><Amount amount={item.totalSalesMade} /></td>
                                                                    <td><Amount amount={item.refundsMade} /></td>
                                                                    <td><Amount amount={item.commissionOwed} /></td>
                                                                    <td><Amount amount={item.totalRefundsMade} /></td>
                                                                    <td><Amount amount={item.netSupplierPayment} /></td>
                                                                    <td><Amount amount={item.paidAmount} /></td>
                                                                    <td><Amount amount={item.pendingAmount} /></td>
                                                                    <td><DateComp date={item.paymentDueDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /></td>
                                                                </tr>
                                                                : item.type === "footer" ?
                                                                    <tr key={index} className="tbody-group-footer">
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>&nbsp;</th>
                                                                        <th>{item.supplierID}</th>
                                                                        <th><Amount amount={item.totalValue} currencyCode={item.supplierCurrency} /></th>
                                                                        <th>&nbsp;</th>
                                                                        <th><Amount amount={item.totalSalesMade} /></th>
                                                                        <th><Amount amount={item.refundsMade} /></th>
                                                                        <th><Amount amount={item.commissionOwed} /></th>
                                                                        <th><Amount amount={item.totalRefundsMade} /></th>
                                                                        <th><Amount amount={item.netSupplierPayment} /></th>
                                                                        <th><Amount amount={item.paidAmount} /></th>
                                                                        <th><Amount amount={item.pendingAmount} /></th>
                                                                        <th>&nbsp;</th>
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
    "Invoice Date": 100,
    "Invoice Number": 200,
    "Money In": 1050,
    "Money Out": 450,
    "Net Supplier Payment": 150,
    "Paid Amount": 150,
    "Pending Amount": 150,
    "Payment Due Date": 150,
    "Product": 100,
    "Supplier": 150,
    "Supplier ID": 100,
    "Booking number": 350,
    "Name of customer": 250,
    "Number of participants": 100,
    "Booking channel": 150,
    "Total Value": 150,
    "Supplier Currency Conversion Rate": 250,
    "Total sales made": 150,
    "Refunds made": 150,
    "Commission owed": 150,
    "Total number of cancellations": 150,
    "Total refunds made": 150,
    "Total commissions owed": 150
}

//Supplier Payment Report
export default SupplierPaymentReport;
