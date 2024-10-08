import React from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import Form from "../../components/common/form"
import Customerselection from "../../components/reports/customer-selection"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/customerInvoice-filter"
import QuotationMenu from "../../components/quotation/quotation-menu";
import Datecomp from "../../helpers/date";
import InvoicePdf from "../../components/reports/invoice-pdf";
import AllInvoiceExcel from "../../components/reports/invoice-list-excel";
import InvoiceListPdf from "../../components/reports/invoice-list-pdf";
import * as Global from "../../helpers/global"
import ExcelIcon from "../../assets/images/reports/excel.png"
import PdfIcon from "../../assets/images/reports/pdf.png"
import Amount from "../../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";
import QuotationMenuCustomer from '../../components/quotation/quotation-menu-customer';
import DownloadInvoice from "../../assets/images/dashboard/download.svg";
class CustomerInvoices extends Form {

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
                customerid: null,
                pagenumber: null,
                pagesize: null,
                invoicenumber: null,
                createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                createdtodate: moment().format('YYYY-MM-DD'),
                invoicereconciliationstatus: null
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
            isExportToExcel: false,
            isExportToPDF: false,
            isshowauthorizepopup: false,
        };
        this.refFilterSection = React.createRef();
    }

    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }
    showHideFilters = () => {
        this.setState({ isFilters: !this.state.isFilters });
    };
    getInvoices(isExport, type) {
        let filter = this.state.filter
        // if (!filter["customerid"]) {
        //     return;
        // }
        if (!isExport) {
            this.setState({ isLoading: true })
            //filter["pagesize"] = null;
        }
        else {
            filter["pagesize"] = "0";
        }

        let reqOBJ = {}

        let reqURL = "reconciliation/customer/invoice/list?customerid=" + filter["customerid"]
        for (let key of Object.keys(filter)) {
            if (key != "customerid" && filter[key]) {
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
                        let arr = []
                        for (let fld of data.response) {
                            fld["invoiceDate"] = moment(new Date(fld["invoiceDate"])).format(Global.DateFormate)
                            fld["invoiceStartDate"] = moment(new Date(fld["invoiceStartDate"])).format(Global.DateFormate)
                            fld["invoiceEndDate"] = moment(new Date(fld["invoiceEndDate"])).format(Global.DateFormate)
                            fld["lastPaymentDate"] = fld["lastPaymentDate"] && fld["lastPaymentDate"] != "0001-01-01T00:00:00" ? moment(new Date(fld["lastPaymentDate"])).format(Global.DateFormate) : "--"
                            fld["invoiceNetAmount"] = fld.invoiceNetAmount
                            fld["paidAmount"] = fld.paidAmount
                            fld["dueAmount"] = fld.dueAmount
                            fld["invoiceTaxAmount"] = fld.invoiceTaxAmount
                            fld["invoiceTotalAmount"] = fld.invoiceTotalAmount
                            arr.push(fld)
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

    selectCustomer = async (data) => {

        let filter = this.state.filter
        filter["customerid"] = data["customerID"]
        this.setState({ customerData: data, customerName: data["displayName"], filter })
        this.getInvoices();
    }
    resetCustomer = () => {
        var customerID = null;
        if (localStorage.getItem('portalType') === 'B2C') {
            customerID = this.props.userInfo?.customerID;
        }
        this.setState({
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            customerData: localStorage.getItem('portalType') === 'B2C'
                ? JSON.parse(sessionStorage.getItem("customer-info"))
                : {},
            data: {
                customer: {},
                customerName: ""
            },
            filter: {
                customerid: customerID,
                pagenumber: null,
                pagesize: null,
                invoicenumber: null,
                createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                createdtodate: moment().format('YYYY-MM-DD'),
                invoicereconciliationstatus: null
            },
            gridData: [],
            isLoading: false
        }, () => this.state.isFilters && this.refFilterSection.current.handleResetFilters())
    }
    customerInfo = () => {
        let CustomerInfo = {
            "rowNum": 1,
            "totalRows": 1,
            "email": this.props.userInfo?.contactInformation?.email,
            "contactInformation": {
                "email": this.props.userInfo?.contactInformation?.email,
                "phoneNumber": this.props.userInfo?.contactInformation?.phoneNumberCountryCode + "-" + this.props.userInfo?.contactInformation?.phoneNumber
            },
            "customerID": this.props.userInfo?.customerID,
            "name": this.props.userInfo?.loggedInUserDisplayName,
            "firstName": this.props.userInfo?.firstName,
            "lastName": this.props.userInfo?.lastName,
            "displayName": this.props.userInfo?.loggedInUserDisplayName,
            "cellPhone": this.props.userInfo?.contactInformation?.phoneNumberCountryCode + "-" + this.props.userInfo?.contactInformation?.phoneNumber,
            "gender": this.props.userInfo?.genderDesc,
            "branchId": this.props.userInfo?.defaultBranchID,
            "agentID": this.props.userInfo?.agentID,
            "entityID": this.props.userInfo?.entityID,
            "userID": this.props.userInfo?.userID,
            "customerType": this.props.userInfo?.customerType,
        }
        return CustomerInfo;
    }
    componentDidMount() {
        if (localStorage.getItem('portalType') === 'B2C') {
            if (sessionStorage.getItem("customer-info") === null) {
                let customerInfo = this.customerInfo();
                sessionStorage.setItem("customer-info", JSON.stringify(customerInfo));
            }
            let data = JSON.parse(sessionStorage.getItem("customer-info"));
            let filter = this.state.filter
            filter["customerid"] = this.props.userInfo?.customerID;
            this.setState({ customerData: data, customerName: "", filter })
        }
        this.getInvoices();
        // if (sessionStorage.getItem("customer-info")) {
        //     debugger;
        //     let data = JSON.parse(sessionStorage.getItem("customer-info"));
        //     if (Object.keys(data).length > 1) {
        //         let filter = this.state.filter
        //         filter["customerid"] = data["customerID"]
        //         this.setState({ customerData: data, customerName: "", filter })
        //         this.getInvoices();
        //     }
        // }
    }
    handleFilters(data) {
        let filter = this.state.filter
        filter["customerid"] = localStorage.getItem('portalType') === 'B2C'
            ? this.props.userInfo?.customerID
            : data["customerid"]
                ? data["customerid"]
                : null;
        filter["createdfromdate"] = data["createdfromdate"] ?
            moment(new Date(data["createdfromdate"])).format(Global.DateFormate) : null;
        filter["createdtodate"] = data["createdtodate"] ?
            moment(new Date(data["createdtodate"])).format(Global.DateFormate) : null;
        filter["invoicereconciliationstatus"] = data["invoicereconciliationstatus"] ? data["invoicereconciliationstatus"] : null

        this.setState({ filter })
        this.getInvoices()
    }
    handlePaginationResults(pageNumber, pageLength) {
        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength


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
    handleClick = (invoiceID, invoiceNumber, business, bookingID, itineraryID) => {
        if (invoiceNumber.startsWith("M-")) {
            let portalURL = window.location.origin;
            let portalType = localStorage.getItem('portalType')
            if (portalType === 'B2C') {
                portalURL = window.location.href.toLowerCase().replace('/customerinvoices', '')
                var win = window.open(
                    `${portalURL}/viewmanualinvoice/Invoice/${invoiceID}`,
                    "_blank"
                );
                win.focus();
            }
            else {
                var win = window.open(
                    `${portalURL}/viewmanualinvoice/Invoice/${invoiceID}`,
                    "_blank"
                );
                win.focus();
            }

        }
        else {
            let portalURL = window.location.origin;
            let portalType = localStorage.getItem('portalType')
            if (portalType === 'B2C') {
                portalURL = window.location.href.toLowerCase().replace('/customerinvoices', '')
                var win = window.open(
                    `${portalURL}/Voucher/invoice/${business}/${itineraryID}/${bookingID}`,
                    "_blank"
                );
                win.focus();
            }
            else {
                var win = window.open(
                    `${portalURL}/Voucher/invoice/${business}/${itineraryID}/${bookingID}`,
                    "_blank"
                );
                win.focus();
            }
        }
    }
    onExportComplete = () => {
        this.setState({ isExportToExcel: false, isExportToPDF: false, ExportData: [] })
    }
    render() {
        const { pageInfo, customerData, isLoading, gridData, isFilters } = this.state
        let pageInfoIndex = [{ item: pageInfo }];
        const { userInfo: { agentID } } = this.props;
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Customer Invoices
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
                            Customer Invoices
                            <button
                                className="btn btn-sm btn-light pull-right mr-2"
                                onClick={this.showHideFilters}
                            >
                                Filters
                            </button>
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            {localStorage.getItem('portalType') === 'B2C'
                                ? <QuotationMenuCustomer handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                                : <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                            }
                        </div>
                        <div className="col-lg-9">

                            {/* <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 mb-2 ml-1">
                                    <Customerselection
                                        key={JSON.stringify(customerData)}
                                        agentID={agentID}
                                        customerData={customerData}
                                        selectCustomer={this.selectCustomer.bind(this)}
                                        resetCustomer={this.resetCustomer.bind(this)}
                                    />
                                </div>
                            </div> */}
                            {isFilters && (
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                        <Filters
                                            ref={this.refFilterSection}
                                            handleFilters={this.handleFilters.bind(this)}
                                            showHideFilters={this.showHideFilters}
                                            selectCustomer={this.selectCustomer.bind(this)}
                                            agentID={agentID}
                                            customerData={this.state.customerData}
                                            resetCustomer={this.resetCustomer.bind(this)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-lg-12">
                                    {this.state.gridData &&
                                        this.state.gridData.length > 0 &&
                                        localStorage.getItem('portalType') !== 'B2C' &&
                                        <React.Fragment>
                                            <AuthorizeComponent title="CustomerInvoices~customer-invoices-excel" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                <a onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerInvoices~customer-invoices-excel") ? this.export("Excel") : this.setState({ isshowauthorizepopup: true })} className=" float-right  m-2">
                                                    <img title="Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                                </a>
                                            </AuthorizeComponent>
                                            {/* <AuthorizeComponent title="CustomerInvoices~customer-invoices-pdf" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                <a onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerInvoices~customer-invoices-excel") ? this.export("PDF") : this.setState({ isshowauthorizepopup: true })} className=" float-right  m-2">
                                                    <img title="PDF" style={{ cursor: "pointer" }} height={20} src={PdfIcon} />
                                                </a>
                                            </AuthorizeComponent> */}
                                            {/* <button onClick={() => this.export("Excel")} className="btn btn-primary float-right  mb-2">Excel</button>
                                            <button onClick={() => this.export("PDF")} className="btn btn-primary float-right mr-2 mb-2">PDF</button> */}
                                        </React.Fragment>
                                    }
                                </div>
                                <div className="col-lg-12">
                                    <div className="table-responsive">
                                        <table className="table border small">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["#", localStorage.getItem('portalType') !== 'B2C' ? "Customer Name" : "", "Invoice Date", "Invoice Number", "Invoice Amount",
                                                        "Paid Amount", "Due Amount", "Last Payment Date",
                                                        " Reconciliation Status", "Actions"
                                                    ].map((data) => {
                                                        return (
                                                            data !== "" && <th scope="col"> {data}</th>)
                                                    })}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.isLoading && (<TableLoading columns={10} />)}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length > 0 && this.state.gridData.map((data, index) => {
                                                        return (<tr>
                                                            <th scope="row">{data.rowNum}</th>
                                                            {localStorage.getItem('portalType') !== 'B2C' && <td>{data.customerName}</td>}
                                                            <td><Datecomp date={data.invoiceDate} /></td>
                                                            <td>{data.invoiceNumber}</td>
                                                            <td>{<Amount amount={data.invoiceNetAmount} currencyCode={data.bookingCurrency} />}</td>
                                                            <td>{<Amount amount={data.paidAmount} currencyCode={data.bookingCurrency} />}</td>
                                                            <td>{<Amount amount={data.dueAmount} currencyCode={data.bookingCurrency} />}</td>
                                                            <td>{data.lastPaymentDate && data.lastPaymentDate != "0001-01-01T00:00:00" ? <Datecomp date={data.lastPaymentDate} /> : "--"}</td>
                                                            <td>{data.invoiceReconciliationStatus}</td>
                                                            <td>
                                                                {/* {localStorage.getItem('portalType') === 'B2C' ? */}
                                                                <AuthorizeComponent title="ManualInvoices~invoice-view-invoice" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                    <a onClick={() => this.handleClick(data?.agentCustomerInvoiceID, data?.invoiceNumber,
                                                                        data?.brnDetails[0]?.business.toLowerCase() === "flight" ? "air" :
                                                                            data?.brnDetails[0]?.business.toLowerCase() === "car rental" ? "vehicle"
                                                                                : data?.brnDetails[0]?.business, data?.brnDetails[0]?.bookingID, data?.brnDetails[0]?.itineraryID)}>
                                                                        <img title="Invoice" style={{ cursor: "pointer", marginLeft: "15px" }} height={20} src={DownloadInvoice} />
                                                                    </a>
                                                                </AuthorizeComponent>
                                                                {/* : <AuthorizeComponent title="CustomerInvoices~customer-invoices-pdf" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                    <a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CustomerInvoices~customer-invoices-excel") ? this.exportPDF(data.agentCustomerInvoiceID) : this.setState({ isshowauthorizepopup: true }) }} className="m-1">
                                                                        <img title="PDF" style={{ cursor: "pointer" }} height={20} src={PdfIcon} />
                                                                    </a>
                                                                </AuthorizeComponent>} */}
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
                                </div>
                            </div>

                        </div>
                    </div >
                </div>
                {this.state.showPDF &&
                    <div>
                        <InvoicePdf actionHide={this.HidePDF} userInfo={this.props.userInfo} printData={this.state.PDFData} customerData={this.state.customerData} />
                    </div>
                }
                {this.state.isExportToExcel &&
                    <AllInvoiceExcel onExportComplete={this.onExportComplete} InvoiceList={this.state.ExportData} filename={this.state.customerData.displayName} />
                }
                {this.state.isExportToPDF &&
                    <InvoiceListPdf onExportComplete={this.onExportComplete} InvoiceList={this.state.ExportData} customerData={this.state.customerData} filename={this.state.customerData.displayName} />
                }
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

export default CustomerInvoices
