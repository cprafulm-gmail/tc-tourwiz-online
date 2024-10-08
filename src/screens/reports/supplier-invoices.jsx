import React from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import Form from "../../components/common/form"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/supplier-invoices-filter";
import QuotationMenu from "../../components/quotation/quotation-menu";
import Datecomp from "../../helpers/date";
import InvoiceXls from "../../components/reports/supplier-invoice-reconcilation-report-xls"
import InvoiceDetails from "../../components/reports/supplier-invoice-details"
import ExportExcel from "../../components/reports/supplier-invoice-excel"
import ExcelIcon from "../../assets/images/reports/excel.png";
import moment from "moment"
import Amount from "../../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

class SupplierInvoices extends Form {
    constructor(props) {
        super(props);
        this.state = {
            isAddInvoice: false,
            isLoading: false,
            filter: {
                supplierid: "",
                pagenumber: 1,
                pagesize: 10,
                invoicenumber: "",
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
                reconcillationstatus: null,
                datemode: "",
                specificmonth: "1",
                searchby: "",
            },
            gridData: [],
            errors: {},
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            showPDF: false,
            PDFData: {},
            isExportToExcel: false,
            isExportToPDF: false,
            popup: null,
            InvoiceReport: {},
            DownloadReport: false,
            supplierList: [],
            statusList: [],
            isshowauthorizepopup: false,
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }
    getStatusList = () => {
        let reqURL = "reconciliation/customer/status?type=reconcilition"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ statusList: data.response })
            }.bind(this),
            "GET"
        );
    }
    componentDidMount() {
        this.getStatusList();
        let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))

        if (reportBusinessSupplier && reportBusinessSupplier["supplierId"]) {

            let { filter } = this.state
            filter["supplierid"] = reportBusinessSupplier["supplierId"]

            this.setState({ supplierList: reportBusinessSupplier["supplierList"], filter });
            this.getInvoices();
        }
    }
    getInvoices(isExport, type) {
        let filter = this.state.filter
        if (!filter["supplierid"]) {
            alert("Select Business & Supplier to get data")
            return;
        }
        if (!isExport)
            this.setState({ isLoading: true })
        else {
            filter["pagesize"] = "0";
            filter["pagenumber"] = 0
        }
        let reqOBJ = {}

        let reqURL = "reconciliation/supplier/invoice/listwithbrn?supplierid=" + filter["supplierid"]
        for (let key of Object.keys(filter)) {
            if (key != "supplierid" && filter[key]) {
                if (!(key === "invoicereconciliationstatus" && filter[key] === "All")) {
                    reqURL = reqURL + `&${key}=${filter[key]}`
                }
            }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {

                if (isExport) {
                    if (type === "Excel") {

                        this.setState({ ExportData: data.response, isExportToExcel: true });
                    }
                    else {
                        this.setState({ ExportData: data.response, isExportToExcel: type === "Excel", isExportToPDF: type === "PDF" });
                    }
                } else if (data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.page - 1
                    pageInfo["pageLength"] = data?.pageInfo?.pageSize
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.pageSize
                    pageInfo["hasPreviousPage"] = data?.pageInfo?.page > 1
                    pageInfo["totalResults"] = data?.pageInfo?.totalRecords

                    this.setState({ gridData: data.response, pageInfo, isLoading: false })
                }
                else {
                    this.setState({ gridData: [], isLoading: false })
                }
            }.bind(this),
            "GET"
        );
    }

    handleFilters(data) {
        if (data["supplierid"]) {
            let filter = this.state.filter
            for (let key of Object.keys(data)) {
                filter[key] = data[key]
            }
            delete filter["specificmonth"];
            filter["pagenumber"] = 1;
            this.setState({ filter });
            this.getInvoices();
        } else {
            this.setState({ gridData: [] });
        }
    }
    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength


        this.setState({ filter })
        this.getInvoices()

    }

    HidePDF = () => {
        this.setState({ showPDF: false, PDFData: {} });
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
    export = (type) => {
        this.getInvoices(true, type);
    }

    backClick = () => {
        this.setState({ popup: null })
    }
    RedirectToInvoiceForm = (invoiceId) => {
        if (invoiceId)
            this.props.history.push(`/SupplierInvoice/Edit/${invoiceId}`);
        else
            this.props.history.push(`/SupplierInvoice/Add`);
    }
    getInvoiceDetailData = (agentcustomerInvoiceId, invoiceId) => {
        var reqURL =
            "reconciliation/supplier/invoice/report?invoiceid=" + invoiceId + "&providerid=" + agentcustomerInvoiceId;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ InvoiceReport: data.response, DownloadReport: true });
            }.bind(this),
            "GET"
        );
    }

    onReportDownloadComplete = () => {
        this.setState({ InvoiceReport: {}, DownloadReport: false });
    }
    editInvoice = (data) => {
        if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierInvoices~reconciliation-add-invoice")) { this.RedirectToInvoiceForm(data.supplierInvoicesAndReconciliationId) }
        else { this.setState({ isshowauthorizepopup: true }) }
    }
    handleExcelDownload = () => {
        this.export("Excel")
    }

    onExcelExportComplete = () => {
        this.setState({ ExportData: [], isExportToExcel: false })
    }
    redirectToPayment = () => {
        const { filter } = this.state;
        this.props.history.push({
            pathname: '/SupplierPayment',
            Supplierinfo: { BusinessId: 1, SupplierId: filter.supplierid, fromdate: filter.fromdate }

        })
    }
    render() {
        const { userInfo: { agentID } } = this.props;
        const { pageInfo, isLoading, gridData, popup, InvoiceReport, DownloadReport, isExportToExcel, statusList, filter } = this.state;
        let pageInfoIndex = [{ item: pageInfo }];
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {popup ? "Payment History" : "Supplier Invoices"}
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
                            {popup ? "Payment History" : "Supplier Invoices"}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        {!popup ? <div className="col-lg-9">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 mb-2 mt-2">
                                    <Filters
                                        agentID={agentID}
                                        handleFilters={this.handleFilters.bind(this)}
                                        showHideFilters={this.showHideFilters}
                                        data={this.state.filter}
                                        status={statusList}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <AuthorizeComponent title="SupplierInvoices~reconciliation-add-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                        <button onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierInvoices~reconciliation-add-invoice") ? this.RedirectToInvoiceForm() : this.setState({ isshowauthorizepopup: true }) }} className="btn btn-primary  mb-2">Add New Invoice</button>
                                    </AuthorizeComponent>
                                    <AuthorizeComponent title="SupplierInvoices~reconciliation-pay-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                        {(filter.supplierid) &&
                                            <button type="button" className="btn btn-primary ml-2  mb-2" onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierInvoices~reconciliation-pay-invoice") ? this.redirectToPayment() : this.setState({ isshowauthorizepopup: true }) }}>Pay Invoices</button>
                                        }
                                    </AuthorizeComponent>
                                    <AuthorizeComponent title="SupplierInvoices~reconciliation-download-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                        {this.state.gridData &&
                                            this.state.gridData.length > 0 &&
                                            (<a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierInvoices~reconciliation-download-invoice") ? this.handleExcelDownload() : this.setState({ isshowauthorizepopup: true }) }} className=" float-right  m-2">
                                                <img title="Download Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                            </a>)
                                            // <button onClick={() => { this.handleExcelDownload() }} className="btn btn-primary float-right  mb-2">Download</button>
                                        }
                                    </AuthorizeComponent>
                                </div>
                                <div className="col-lg-12">
                                    <div className="table-responsive">
                                        <table className="table border small table-column-width">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["#", "Invoice No", "Invoice Date",
                                                        "Business",
                                                        "Booking Ref. No.",
                                                        "Customer Name",
                                                        "Invoice Amount",
                                                        /* "Tax Amount", */
                                                        "Paid Amount", "Due Amount", "Payment Due Date", "Status",
                                                        "Conversion Rate",
                                                        "Booking Currency",
                                                        "Comments",
                                                        "Payment Date",
                                                        "Payment Mode",
                                                        "Cheque Date",
                                                        "Cheque Number, Bank Name, Branch",
                                                        "Transaction No.",
                                                        "Card Number",
                                                        "Actions"
                                                    ].map((data, key) => {
                                                        return (
                                                            <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {this.state.isLoading && (<TableLoading columns={21} />)}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length > 0 && this.state.gridData.map((data, index) => {
                                                        return (<tr key={index}>
                                                            <th onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }} scope="row">{data.rowNum}</th>
                                                            <td onClick={() => this.editInvoice(data)} style={{ "word-break": "break-word", cursor: "pointer" }}>{data.invoiceNumber}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}><Datecomp date={data.invoiceDate} /></td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.business === "Air" ? "Flight" : data.business}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ "word-break": "break-word", cursor: "pointer" }}>
                                                                {data.brnDetails.map((brnitem, key) => {
                                                                    return <React.Fragment> {(key > 0 ? <br /> : '')} {brnitem.bookingRefNo}</React.Fragment>
                                                                })}
                                                            </td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ "word-break": "break-word", cursor: "pointer" }}>
                                                                {data.brnDetails.map((brnitem, key) => {
                                                                    return <React.Fragment> {(key > 0 ? <br /> : '')} {brnitem.customerName}</React.Fragment>
                                                                })}
                                                            </td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}><Amount amount={data.invoiceNetAmount} currencyCode={data.invoiceCurrencyCode} /></td>
                                                            {/* <td><Amount amount={data.taxAmount} currencyCode={data.invoiceCurrencyCode} /></td> */}
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}><Amount amount={((data.invoiceNetAmount * 1000) - (data.dueAmount * 1000)) / 1000} currencyCode={data.invoiceCurrencyCode} /></td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}><Amount amount={data.dueAmount} currencyCode={data.invoiceCurrencyCode} /></td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.dueDate ? <Datecomp date={data.dueDate} /> : null}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.invoiceReconciliationStatus}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.brnDetails.map((brnitem, key) => {
                                                                    return <React.Fragment> {(key > 0 ? <br /> : '')} {parseFloat(brnitem.conversionFactor).toFixed(5)}</React.Fragment>
                                                                })}
                                                            </td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.brnDetails.map((brnitem, key) => {
                                                                    return <React.Fragment> {(key > 0 ? <br /> : '')} {brnitem.supplierBookingCurrency}</React.Fragment>
                                                                })}
                                                            </td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].comments}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].paymentDate ? <Datecomp date={data.brnDetails[0].paymentDate} /> : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].paymentMode ? data.brnDetails[0].paymentMode === "CreditCard" ? "Credit Card" : data.brnDetails[0].paymentMode === "DebitCard" ? "Debit Card" : data.brnDetails[0].paymentMode : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].chequeDate ? <Datecomp date={data.brnDetails[0].chequeDate} /> : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].paymentMode === "Cheque" ? data.brnDetails[0].chequeNumber + ", " + data.brnDetails[0].chequeBank + ", " + data.brnDetails[0].chequeBranch : (data.brnDetails[0].paymentMode === "CreditCard" || data.brnDetails[0].paymentMode === "DebitCard") ? data.brnDetails[0].chequeBank : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].transactionRefNumber ? data.brnDetails[0].transactionRefNumber : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>{data.brnDetails[0].cardLastFourDigit ? "xxxx-xxxx-xxxx-" + data.brnDetails[0].cardLastFourDigit : "---"}</td>
                                                            <td>
                                                                <div className="custom-dropdown-btn position-relative">
                                                                    <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center">
                                                                        <div className="border-right pr-2">Actions</div>
                                                                        <i className="align-middle">
                                                                            <svg width="8" height="8" className="align-baseline ml-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284.929 284.929" xmlns="http://www.w3.org/1999/xlink"><g><path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441 L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082 c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647 c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"></path></g></svg>
                                                                        </i>
                                                                    </button>
                                                                    <div className="custom-dropdown-btn-menu position-absolute">
                                                                        <ul className="list-unstyled border bg-white shadow-sm p-2 rounded">
                                                                            <AuthorizeComponent title="SupplierInvoices~reconciliation-add-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                                                                {data.invoiceReconciliationStatus === "Pending" &&
                                                                                    <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => this.editInvoice(data)} >Edit Invoice</button></li>
                                                                                }
                                                                            </AuthorizeComponent>
                                                                            <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => { this.setState({ popup: data }) }}>Payment History</button></li>
                                                                            <AuthorizeComponent title="SupplierInvoices~reconciliation-download-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierInvoices~reconciliation-download-invoice") ? this.getInvoiceDetailData(agentID, data.supplierInvoicesAndReconciliationId) : this.setState({ isshowauthorizepopup: true })}>Download</button></li>
                                                                            </AuthorizeComponent>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>)
                                                    })}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={8}>No records found.</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-lg-12 report-pagination">
                                    {!isLoading && (gridData &&
                                        gridData.length > 0) && (
                                            <Pagination
                                                pageInfoIndex={pageInfoIndex}
                                                handlePaginationResults={this.handlePaginationResults.bind(this)}
                                            />
                                        )}
                                </div>
                            </div>

                        </div> :
                            <div className="col-lg-9">
                                <InvoiceDetails backClick={this.backClick.bind(this)} id={popup} />
                            </div>
                        }
                    </div >
                </div>
                {DownloadReport === true &&
                    <InvoiceXls InvoiceReport={InvoiceReport} onReportDownloadComplete={this.onReportDownloadComplete} />
                }
                {isExportToExcel && (
                    <ExportExcel
                        filename="supplier-invoices"
                        data={this.state.ExportData}
                        onExportComplete={() => { this.onExcelExportComplete() }}
                    />
                )}
                {this.state.isshowauthorizepopup &&
                    <ModelPopupAuthorize
                        header={""}
                        content={""}
                        handleHide={this.hideauthorizepopup}
                        history={this.props.history}
                    />
                }
            </div >
        )
    }
}

const table_column_width = {
    "#": 30,
    "Invoice No": 130,
    "Invoice Date": 80,
    "Business": 80,
    "Booking Ref. No.": 200,
    "Customer Name": 150,
    "Invoice Amount": 120,
    "Tax Amount": 120,
    "Paid Amount": 120,
    "Due Amount": 120,
    "Payment Due Date": 80,
    "Status": 100,
    "Conversion Rate": 100,
    "Booking Currency": 100,
    "Comments": 250,
    "Payment Date": 80,
    "Payment Mode": 100,
    "Cheque Date": 80,
    "Cheque Number, Bank Name, Branch": 150,
    "Transaction No.": 150,
    "Card Number": 150,
    "Actions": 130,
}
export default SupplierInvoices
