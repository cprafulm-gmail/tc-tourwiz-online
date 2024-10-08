import React from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import Form from "../../components/common/form"
import ActionModal from "../../helpers/action-modal";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/manualInvoice-filter"
import QuotationMenu from "../../components/quotation/quotation-menu";
import Datecomp from "../../helpers/date";
import InvoicePdf from "../../components/reports/invoice-pdf";
import AllInvoiceExcel from "../../components/reports/manual-invoice-list-excel";
import InvoiceListPdf from "../../components/reports/invoice-list-pdf";
import * as Global from "../../helpers/global"
import ExcelIcon from "../../assets/images/reports/excel.png"
import Amount from "../../helpers/amount";
import VoucherInvoice from "../../screens/voucher-invoice";
import { Trans } from "../../helpers/translate";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import * as encrypt from "../../helpers/encrypto";
import ManualInvoicesAppliedFilter from '../../components/quotation/manual-invoice-applied-filter';
import { apiRequester_dxcoretourwizonline_api } from '../../services/requester-dxcoretourwizonline';
import MessageBar from '../../components/admin/message-bar';
import { Helmet } from "react-helmet";

class ManualInvoices extends Form {

    constructor(props) {
        super(props);
        this.state = {
            isFilters: false,
            isAddInvoice: false,
            isLoading: false,
            data: {
                customer: {},
                customerName: ""
            },
            filter: {
                type: "",
                customerid: null,
                customerName: "",
                pagenumber: null,
                pagesize: 10,
                invoicenumber: "",
                createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                createdtodate: moment().format('YYYY-MM-DD'),
                dateMode: "",
                specificmonth: "1",
                searchBy: "",
                invoicereconciliationstatus: ""
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
            customerData: {},
            showPDF: false,
            PDFData: {},
            deleteItem: "",
            isDeleteConfirmPopup: false,
            isExportToExcel: false,
            isExportToPDF: false,
            isshowauthorizepopup: false,
            showDeleteSuccessMessage: false,
        };
        this.myRef = null;
    }

    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    showHideFilters = () => {
        this.setState({ isFilters: !this.state.isFilters });
    };

    getInvoices(isExport, type) {
        let filter = this.state.filter

        this.setState({ isLoading: true })

        let reqOBJ = {}
        let reqURL = "tw/manualinvoice/list?"
        for (let key of Object.keys(filter)) {
            if (key != "customerName" && filter[key]) {
                if (isExport && key === "pagesize") {
                    reqURL = reqURL + (reqURL.endsWith('?') ? "" : "&") + "pagesize=0";
                }
                else if (!(key === "invoicereconciliationstatus" && filter[key] === "All")) {
                    reqURL = reqURL + (reqURL.endsWith('?') ? "" : "&") + `${key}=${filter[key]}`;
                }
            }
        }
        apiRequester_dxcoretourwizonline_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (isExport) {
                    if (type === "Excel") {
                        let arr = []
                        for (let fld of data.response) {
                            fld["customerName"] = fld.customerName;
                            fld["invoiceDate"] = moment(new Date(fld["invoiceDate"])).format(Global.DateFormate);
                            fld["invoiceDueDate"] = moment(new Date(fld["invoiceDueDate"])).format(Global.DateFormate);
                            fld["invoiceStartDate"] = moment(new Date(fld["invoiceStartDate"])).format(Global.DateFormate);
                            fld["invoiceEndDate"] = moment(new Date(fld["invoiceEndDate"])).format(Global.DateFormate);
                            fld["lastPaymentDate"] = fld["lastPaymentDate"] && fld["lastPaymentDate"] != "0001-01-01T00:00:00" ? moment(new Date(fld["lastPaymentDate"])).format(Global.DateFormate) : "--";
                            fld["invoiceNetAmount"] = fld.invoiceNetAmount;
                            fld["paidAmount"] = fld.paidAmount;
                            fld["dueAmount"] = fld.dueAmount;
                            fld["invoiceTaxAmount"] = fld.invoiceTaxAmount;
                            fld["invoiceTotalAmount"] = fld.invoiceTotalAmount;
                            arr.push(fld);
                        }
                        this.setState({ ExportData: arr, isExportToExcel: true });
                    }
                    else {
                        this.setState({ ExportData: data.response, isExportToPDF: true });
                    }
                } else if (data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.page - 1
                    pageInfo["pageLength"] = data?.pageInfo?.records
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.records
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
    selectCustomer = (data) => {
        let filter = this.state.filter
        filter["customerid"] = data["customerID"]
        filter["customerName"] = data.customerName;
        this.setState({ customerData: data, filter });
    }
    handleFilters(data, customerData) {
        let filter = this.state.filter

        filter["createdfromdate"] = data["createdfromdate"] ?
            moment(new Date(data["createdfromdate"])).format(Global.DateFormate) : null;
        filter["createdtodate"] = data["createdtodate"] ?
            moment(new Date(data["createdtodate"])).format(Global.DateFormate) : null;
        filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
        filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "";
        filter["invoicereconciliationstatus"] = data["invoicereconciliationstatus"] ? data["invoicereconciliationstatus"] : "";
        filter["invoicenumber"] = data["invoicenumber"] ? data["invoicenumber"] : "";
        filter["customerid"] = data.customerid;
        filter["customerName"] = data.customerName;
        filter["type"] = data.type;
        filter["specificmonth"] = data.specificmonth;
        this.setState({ filter, customerData })
        this.getInvoices()
    }
    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        let pageInfo = this.state.pageInfo;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = Number(pageLength)

        this.setState({ filter })
        this.getInvoices()

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
    HidePDF = () => {
        this.setState({ showPDF: false, PDFData: {} });
    }
    exportPDF = (agentcustomerInvoiceId) => {
        this.getInvoiceDetailData(agentcustomerInvoiceId);
    }
    getInvoiceDetailData = (agentcustomerInvoiceId) => {
        var reqURL =
            "reconciliation/customer/invoice?agentcustomerinvoiceid=" + agentcustomerInvoiceId;
        var reqOBJ = {};
        let InvoiceDetails = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                InvoiceDetails.header = data.response;
                if (InvoiceDetails.itenary && InvoiceDetails.paymentHistory)
                    this.setState({ showPDF: true, PDFData: InvoiceDetails });
            }.bind(this),
            "GET"
        );
        reqURL =
            "reconciliation/customer/invoice/itinerary/list?agentcustomerinvoiceid=" + agentcustomerInvoiceId;
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                InvoiceDetails.itenary = data.response ? data.response : [];
                if (InvoiceDetails.header && InvoiceDetails.paymentHistory)
                    this.setState({ showPDF: true, PDFData: InvoiceDetails });
            }.bind(this),
            "GET"
        );
        reqURL =
            "reconciliation/customer/invoice/payment/history?agentcustomerinvoiceid=" + agentcustomerInvoiceId;
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                InvoiceDetails.paymentHistory = data.response ? data.response : [];
                if (InvoiceDetails.header && InvoiceDetails.itenary)
                    this.setState({ showPDF: true, PDFData: InvoiceDetails });
            }.bind(this),
            "GET"
        );
    }
    export = (type) => {
        this.getInvoices(true, type);
    }
    onExportComplete = () => {
        this.setState({ isExportToExcel: false, isExportToPDF: false, ExportData: [], isLoading: false })
    }
    downloadInvoice = (data) => {
        this.redirectToVoucher("Voucher", data.itineraryID, 1548, "Hotel")
    }

    getinvoicedetail = (invoiceid) => {
        let reqURL = "tw/manualinvoice/details?invoiceid=" + Number(invoiceid)
        let reqOBJ = {}
        apiRequester_dxcoretourwizonline_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response.length > 0) {
                    let newItemsData = data.response[0].itemsUUID;
                    let portalURL = window.location.origin;
                    let mode = 'single';
                    if (data.response[0].type === "Invoice") {
                        var win = window.open(
                            `${portalURL}/viewmanualinvoice/Invoice/${invoiceid}`,
                            "_blank"
                        );
                        win.focus();
                    }
                    if (data.response[0].type === "Voucher") {
                        newItemsData.forEach(element => {
                            let portalURL = window.location.origin;
                            let mode = 'single';
                            var win = window.open(
                                `${portalURL}/viewmanualinvoice/Voucher/${invoiceid}/${element}`,
                                "_blank"
                            );
                            win.focus();
                        });
                    }
                }
            }.bind(this),
            "GET"
        );
    }

    viewInvoices = (invoiceid) => {
        this.getinvoicedetail(invoiceid);
    }
    deleteInvoices = (item, invoice) => {
        this.setState({
            deleteItem: item,
            invoiceNumber: invoice,
            isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
        });
    };
    handleConfirmDelete = (isConfirmDelete) => {
        this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
        isConfirmDelete && this.confirmDeleteInvoice();
    };
    confirmDeleteInvoice = () => {
        let reqURL = "tw/manualinvoice/delete";
        let invoiceId = this.state.deleteItem
        let reqOBJ = { request: { invoiceId } };
        apiRequester_dxcoretourwizonline_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({ showDeleteSuccessMessage: true });
                this.getInvoices();
            }.bind(this),
            "POST"
        );
    }
    componentDidMount() {
        this.getInvoices();
    }

    hideDeleteSuccessMessage = () => {
        this.setState({ showDeleteSuccessMessage: false });
    }
    removeFilter = (filterName, customerData) => {
        let filter = this.state.filter;
        filter[filterName] = "";
        this.setState({ filter, customerData, results: [], defaultResults: [], currentPage: 0 }, () => this.getInvoices());
        this.handleFilters(filter, "filter");
        this.myRef.setDefaultFilter();
    }
    editInvoice = (data) => {
        debugger;
        if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ManualInvoices~invoice-edit-invoice")) { this.props.history.push(`/Manual${data.type}/Edit/` + data.agentCustomerInvoiceID) }
        else { this.setState({ isshowauthorizepopup: true }) }
    }


    // Redirect to View Voucher Page
    redirectToVoucher = (mode, itineraryID, bookingID, businessName) => {
        let isShowVoucherInPopup = Global.getEnvironmetKeyValue(
            "ShowVoucherInPopup",
            "cobrand"
        );
        if (!isShowVoucherInPopup) {
            let portalURL = window.location.origin;
            var win = window.open(
                `${portalURL}/Voucher/${mode}/${businessName}/${itineraryID}/${bookingID}`,
                "_blank"
            );
            win.focus();
        } else {
            this.setState({
                showPopup: true,
                popupTitle: Trans("_" + mode),
                popupSizeClass: "modal-lg",
                popupContent: (
                    <React.Fragment>
                        <VoucherInvoice
                            mode={mode}
                            itineraryid={itineraryID}
                            bookingid={bookingID}
                            businessName={businessName}
                        />
                    </React.Fragment>
                )
            });
        }
    };
    render() {
        const { pageInfo, isDeleteConfirmPopup, customerData, isLoading, gridData, isFilters, showDeleteSuccessMessage } = this.state
        let pageInfoIndex = [{ item: pageInfo }];
        const { userInfo: { agentID } } = this.props;

        let IsFilterApplied = false;

        if (this.state.filter.customerid !== null
            || this.state.filter.customerName !== ""
            || this.state.filter.type !== ""
            || (this.state.filter.invoicenumber !== "")
            || this.state.filter.dateMode !== ""
            || this.state.filter.searchBy !== ""
            || this.state.filter.invoicereconciliationstatus !== ""
        ) {
            IsFilterApplied = true;
        }

        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Manual Invoices
                        </title>
                    </Helmet>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9">
                                <h1 className="text-white m-0 p-0 f30">
                                    <SVGIcon
                                        name="file-text"
                                        width="24"
                                        height="24"
                                        className="mr-3"
                                    ></SVGIcon>
                                    Manual Invoices
                                </h1>
                            </div>
                            <div className="col-lg-3 d-flex justify-content-start">
                                <button
                                    className="btn btn-sm btn-light pull-right mr-2"
                                    onClick={this.showHideFilters}
                                >
                                    Filters
                                </button>
                                <AuthorizeComponent title="dashboard-menu~invoice-manage-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                    <button
                                        className="btn btn-sm btn-primary pull-right mr-2"
                                        onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~invoice-create-invoice") ? this.props.history.push(`/manualinvoice/Create`) : this.setState({ isshowauthorizepopup: true }) }}
                                    >
                                        Create Invoice
                                    </button>
                                </AuthorizeComponent>
                                <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                    <button
                                        className="btn btn-sm btn-primary pull-right mr-2"
                                        onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~invoice-create-invoice") ? this.props.history.push(`/ManualVoucher/Create`) : this.setState({ isshowauthorizepopup: true }) }}
                                    >
                                        Create Voucher
                                    </button>
                                </AuthorizeComponent>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            {isFilters && (
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                        <Filters
                                            onRef={ref => (this.myRef = ref)}
                                            handleFilters={this.handleFilters.bind(this)}
                                            showHideFilters={this.showHideFilters}
                                            filterData={this.state.filter}
                                            agentID={agentID}
                                            customerData={customerData}
                                        />
                                    </div>
                                </div>

                            )}

                            <div className="row">
                                <div className='col-lg-11'>
                                    {IsFilterApplied &&

                                        <ManualInvoicesAppliedFilter
                                            filterData={this.state.filter}
                                            removeFilter={this.removeFilter}
                                        />

                                    }
                                </div>
                                <div className="col-lg-1">
                                    {this.state.gridData &&
                                        this.state.gridData.length > 0 &&
                                        <React.Fragment>
                                            <AuthorizeComponent title="ManualInvoices~invoice-export-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                <a onClick={() => this.export("Excel")} className=" float-right  m-2">
                                                    <img title="Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                                </a>
                                            </AuthorizeComponent>
                                        </React.Fragment>
                                    }
                                </div>
                                <div className="col-lg-12">
                                    <div className="table-responsive-lg">
                                        <table className="table border small table-column-width">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["#", "Customer Name", "Invoice / Voucher Date", "Invoice Due Date", "Invoice / Voucher Number", "Invoice Amount",
                                                        "Paid Amount / Due Amount",
                                                        "Reconciliation Status", "Actions"
                                                    ].map((data) => {
                                                        return (<th width={table_column_width[data]} scope="col">{data}</th>)
                                                    })}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.isLoading && (<TableLoading columns={9} />)}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length > 0 && this.state.gridData.map((data, index) => {
                                                        return (<tr>
                                                            {/* <tr onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ManualInvoices~invoice-edit-invoice") ? this.props.history.push(`/Manual${data.type}/Edit/` + data.agentCustomerInvoiceID) : this.setState({ isshowauthorizepopup: true })} style={{ cursor: "pointer" }}> */}
                                                            <th scope="row" onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.rowNum}</th>
                                                            <td className='text-capitalize' onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.customerName}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                <Datecomp date={data.invoiceDate} /></td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.type === "Invoice" ? <Datecomp date={data.invoiceDueDate} /> : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.invoiceNumber}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.type === "Invoice" ? <Amount amount={data.invoiceNetAmount} currencyCode={data.bookingCurrency} /> : "---"}</td>
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.type === "Invoice" ? <React.Fragment>
                                                                    <Amount amount={data.paidAmount} currencyCode={data.bookingCurrency} /><br />
                                                                    <Amount amount={data.dueAmount} currencyCode={data.bookingCurrency} />
                                                                </React.Fragment> : "---"}</td>
                                                            {/* <td>{data.lastPaymentDate && data.lastPaymentDate != "0001-01-01T00:00:00" ? <Datecomp date={data.lastPaymentDate} /> : "--"}</td> */}
                                                            <td onClick={() => this.editInvoice(data)} style={{ cursor: "pointer" }}>
                                                                {data.type === "Invoice" ? data.invoiceReconciliationStatus : "---"}</td>
                                                            <td>
                                                                <div className="">
                                                                    <React.Fragment>
                                                                        <div className="custom-dropdown-btn position-relative">
                                                                            <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center">
                                                                                <div className="border-right pr-2">Actions</div>
                                                                                <SVGIcon
                                                                                    name="angle-arrow-down"
                                                                                    width="8"
                                                                                    height="8"
                                                                                    className="ml-2"
                                                                                ></SVGIcon>
                                                                            </button>

                                                                            <div className="custom-dropdown-btn-menu position-absolute">
                                                                                <ul className="list-unstyled border bg-white shadow-sm p-2 rounded">
                                                                                    <AuthorizeComponent title="ManualInvoices~invoice-edit-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                        <li>
                                                                                            <button
                                                                                                className="btn btn-sm text-nowrap w-100 text-left"
                                                                                                onClick={() => this.editInvoice(data)}
                                                                                            >
                                                                                                Edit {data.type}
                                                                                            </button>
                                                                                        </li>
                                                                                    </AuthorizeComponent>
                                                                                    <AuthorizeComponent title="ManualInvoices~invoice-view-voucher" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                        {data.type === "Voucher" &&
                                                                                            <li>
                                                                                                <button
                                                                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                                                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ManualInvoices~invoice-view-voucher") ? this.viewInvoices(data.agentCustomerInvoiceID) : this.setState({ isshowauthorizepopup: true })}
                                                                                                >
                                                                                                    View Voucher(s)
                                                                                                </button>
                                                                                            </li>
                                                                                        }
                                                                                    </AuthorizeComponent>
                                                                                    <AuthorizeComponent title="ManualInvoices~invoice-view-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                        {data.type === "Invoice" &&
                                                                                            <li>
                                                                                                <button
                                                                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                                                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ManualInvoices~invoice-view-invoice") ? this.viewInvoices(data.agentCustomerInvoiceID) : this.setState({ isshowauthorizepopup: true })}
                                                                                                >
                                                                                                    View Invoice(s)
                                                                                                </button>
                                                                                            </li>
                                                                                        }
                                                                                    </AuthorizeComponent>
                                                                                    {data.brnDetails.length === 0 &&
                                                                                        <AuthorizeComponent title="ManualInvoices~invoice-delete-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                            <li>
                                                                                                <button
                                                                                                    className="btn btn-sm text-nowrap w-100 text-left"
                                                                                                    onClick={() =>
                                                                                                        AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ManualInvoices~invoice-delete-invoice")
                                                                                                            ? this.deleteInvoices(data.agentCustomerInvoiceID, data.invoiceNumber)
                                                                                                            : this.setState({ isshowauthorizepopup: true })}
                                                                                                >
                                                                                                    Delete {data.type}
                                                                                                </button>
                                                                                            </li>
                                                                                        </AuthorizeComponent>
                                                                                    }
                                                                                    {/* {data.itineraryID !== 0 &&
                                                                                        <li>
                                                                                            <button
                                                                                                className="btn btn-sm text-nowrap w-100 text-left"
                                                                                                onClick={() => this.downloadInvoice(data)}
                                                                                            >
                                                                                                Download Invoice
                                                                                            </button>
                                                                                        </li>
                                                                                    } */}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </React.Fragment>
                                                                </div>
                                                            </td>
                                                        </tr>)
                                                    })}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={9}>No records found.</td>
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
                                    {isDeleteConfirmPopup && (
                                        <ActionModal
                                            title="Confirm Delete"
                                            message={`Are you sure you want to delete ${this.state.gridData.find(x => x.agentCustomerInvoiceID === this.state.deleteItem).type} (${this.state.invoiceNumber})?`}
                                            positiveButtonText="Confirm"
                                            onPositiveButton={() => this.handleConfirmDelete(true)}
                                            handleHide={() => this.handleConfirmDelete(false)}
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {this.state.showPDF &&
                    <div>
                        <InvoicePdf actionHide={this.HidePDF} printData={this.state.PDFData} customerData={this.state.customerData} />
                    </div>
                }
                {this.state.isExportToExcel &&
                    <AllInvoiceExcel isfrommanualinvoicelist={true} onExportComplete={this.onExportComplete} InvoiceList={this.state.ExportData} filename={this.state.customerData.name} />
                }
                {this.state.isExportToPDF &&
                    <InvoiceListPdf onExportComplete={this.onExportComplete} InvoiceList={this.state.ExportData} customerData={this.state.customerData} filename={this.state.customerData.name} />
                }
                {this.state.isshowauthorizepopup &&
                    <ModelPopupAuthorize
                        header={""}
                        content={""}
                        handleHide={this.hideauthorizepopup}
                        history={this.props.history}
                    />
                }
                {showDeleteSuccessMessage && this.state.gridData.find(x => x.agentCustomerInvoiceID === this.state.deleteItem)?.type &&
                    <MessageBar Message={`${this.state.gridData.find(x => x.agentCustomerInvoiceID === this.state.deleteItem)?.type ?? ""} deleted successfully.`} handleClose={this.hideDeleteSuccessMessage} />
                }
            </div>
        )
    }
}


const table_column_width = {
    "#": 15,
    "Customer Name": 120,
    "Invoice / Voucher Date": 80,
    "Invoice / Voucher Number": 130,
    "Invoice Due Date": 80,
    "Invoice Amount": 130,
    "Paid Amount / Due Amount": 100,
    "Reconciliation Status": 80,
    "Actions": 100
}

export default ManualInvoices
