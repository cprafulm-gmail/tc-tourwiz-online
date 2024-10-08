import React from "react";
import ManageBooking from "../../assets/images/dashboard/manage-booking.png";
import CustomerPaymentInfoForm from "../../components/reports/customer-payment-info-form";
import BRNSelection from "../../components/reports/brn-selection";
import InvoiceSelection from "../../components/reports/invoice-selection-list";
import CustomerReconciliationBase from "../../base/customer-reconciliation-base";
import InvoicePrint from "../../components/reports/invoice-print";
import InvoicePdf from "../../components/reports/invoice-pdf";
import Customerselection from "../../components/reports/customer-selection";
import QuotationMenu from "../../components/quotation/quotation-menu";
import moment from "moment";
import QuotationMenuCustomer from "../../components/quotation/quotation-menu-customer";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { Helmet } from "react-helmet";

class CustomerReconciliation extends CustomerReconciliationBase {
    constructor(props) {
        super(props);
        this.state = {
            isFilters: false,
            isLoading: true,
            showPrint: false,
            printData: {},
            errors: {},
            display: "InvoiceSelection",
            breadcrumb: [],
            customerData: sessionStorage.getItem("customer-info")
                && JSON.parse(sessionStorage.getItem("customer-info"))
                && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1
                ? JSON.parse(sessionStorage.getItem("customer-info"))
                : {},
            InvoiceTab: {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
                selectedRecords: [],
                isLoading: true,
                selectedRecordIds: []
            },
            isShowPaymentDueDate: false,
            BRNTab: {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
                selectedRecords: [],
                isLoading: true,
                selectedRecordIds: []
            },
            paymentType: "full",
            isCustomerSet: sessionStorage.getItem("customer-info")
                && JSON.parse(sessionStorage.getItem("customer-info"))
                && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1
        };
    }
    componentDidMount() {
        let data = sessionStorage.getItem("customer-info") ? JSON.parse(sessionStorage.getItem("customer-info")) : {};
        if (localStorage.getItem('portalType') === 'B2C')
            this.getCustomer(this.getCustomerInvoices);
        else if (data
            && Object.keys(data).length > 1) {
            this.setState({
                customerData: data,
                isCustomerSet: true,
                display: "InvoiceSelection",
                breadcrumb: [{ display: "InvoiceSelection", name: data.firstName + (data.lasName ? " " + data.lasName : "") }],
                paymentType: "full"
            }, () => {
                this.getCustomerInvoices();
            });
        }
    }

    getCustomer(callback) {
        this.setState({ isLoading: true })
        let reqURL = "reconciliation/customer/list?createdfromdate=2020-01-01&createdtodate=2050-12-31";
        reqURL = reqURL + "&emailid=" + this.props.userInfo.contactInformation.email.replace("+", "");

        let reqOBJ = {}
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({ results: data.response, isLoading: false })
                if (localStorage.getItem('portalType') === 'B2C' &&
                    data.response && data.response.length > 0) {

                    this.setState({
                        customerData: data.response[0],
                        isCustomerSet: true,
                        breadcrumb: [{ display: "InvoiceSelection", name: data.response[0].firstName }]
                    }, () => { callback(undefined, data.response); });
                }
            }.bind(this),
            "GET"
        );
    }

    /* componentDidMount() {
        if (sessionStorage.getItem("bookingForInfo")) {
            let data = JSON.parse(sessionStorage.getItem("bookingForInfo"));
            if (Object.keys(data).length > 1) {
                this.setState({ customerData: JSON.parse(sessionStorage.getItem("bookingForInfo")), isCustomerSet: true, display: "InvoiceSelection", breadcrumb: [{ display: "InvoiceSelection", name: data.firstName + (data.lasName ? " " + data.lasName : "") }], paymentType: "full" }, () => {
                    this.getCustomerInvoices();
                });
            }
        }
    } */
    showHideFilters = () => {
        this.setState({ isFilters: !this.state.isFilters })
    }
    showHideBRNFilters = () => {
        this.setState({ isBRNFilters: !this.state.isBRNFilters })
    }
    showAdditionals = () => {
        let breadcrumb = this.state.breadcrumb;

        breadcrumb.push({
            display: "additionals",
            name: "Pay Additionals"
        });

        this.setState({ display: "additionals", breadcrumb });
    }
    showSaveForm = (amount, selectedRecords, paymentType, selectedRecordIds) => {
        let InvoiceTab = this.state.InvoiceTab;
        let BRNTab = this.state.BRNTab;
        if (paymentType === "full") {
            InvoiceTab.selectedRecordIds = selectedRecordIds;
            InvoiceTab.selectedRecords = selectedRecords;
        } else if (paymentType === "brnPayment") {
            BRNTab.selectedRecordIds = selectedRecordIds;
            BRNTab.selectedRecords = selectedRecords;

            let dueAmountArray = selectedRecords.map(x => (x.dueAmount));
            let reconciliationAmountArray = selectedRecords.map(x => (Number(x.ReconciliationAmount)));
            let isPaymentDueDate = false;
            const sumofDueAmount = dueAmountArray.flat().reduce((sum, item) => sum + item, 0);
            const sumofReconciliationAmount = reconciliationAmountArray.flat().reduce((sum, item) => sum + item, 0);

            if (sumofDueAmount > sumofReconciliationAmount) {
                isPaymentDueDate = true;
            }
            this.setState({ isShowPaymentDueDate: isPaymentDueDate })
        }

        let breadcrumb = this.state.breadcrumb;
        switch (paymentType) {
            case "full":
                breadcrumb.push({
                    display: "SaveForm",
                    name: "Pay Invoice(s)"
                });
                break;
            case "brnPayment":
                breadcrumb.push({
                    display: "SaveForm",
                    name: "Pay"
                });
                break;
            default:
                breadcrumb.push({
                    display: "BRNSelection",
                    name: "Pay by BRNs"
                });
                break;
        }
        this.setState({ display: paymentType === "full" || paymentType === "brnPayment" ? "SaveForm" : "BRNSelection", Amount: amount, breadcrumb, InvoiceTab, BRNTab, paymentType });
        if (paymentType !== "full" && paymentType !== "brnPayment" && this.state.BRNTab.isLoading === true) {
            this.getCustomerBRNs();
        }
    }
    back = () => {
        let breadcrumb = this.state.breadcrumb;
        let index = breadcrumb.findIndex((item) => item.display === this.state.display);
        breadcrumb.length = index;
        this.setState({ display: breadcrumb[breadcrumb.length - 1].display, breadcrumb: breadcrumb });
    }
    breadcrumbClick = (display) => {
        let breadcrumb = this.state.breadcrumb;
        let index = breadcrumb.findIndex((item) => item.display === display);
        breadcrumb.length = index + 1;
        this.setState({ display: display, breadcrumb: breadcrumb });
    }
    Breadcrumbs = () => (
        <div className="row">
            <div className="col-lg-12">

                <ol className="breadcrumb  breadcrumb-arrow">
                    {this.state.breadcrumb.map((item, index) => {
                        return <li key={index} className={this.state.breadcrumb.length === index + 1 ? 'breadcrumb-item text-white active' : 'breadcrumb-item text-white completed'}><a onClick={() => { this.breadcrumbClick(item.display) }}>
                            {item.name}</a></li>
                    })}
                </ol>

            </div>
        </div>
    );
    steps = () => (
        <div className="row">

            <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="report-steps">
                    <div className="container">
                        <div className="row pt-3 pb-3 justify-content-center">
                            <div className={this.state.isCustomerSet ?
                                "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                "step col-3 d-flex flex-wrap justify-content-center "}>
                                <span className="d-flex">
                                    <a className="d-flex" onClick={() => { this.breadcrumbClick("InvoiceSelection") }} disabled={!this.state.isCustomerSet}>1</a>
                                </span>
                                <label className="text-secondary m-0 w-100 text-center mt-1">Select Customer</label>
                            </div>
                            {this.state.display === "BRNSelection" || (this.state.display === "SaveForm" && this.state.paymentType === "brnPayment") ? (
                                <div className={this.state.display !== "BRNSelection" ?
                                    "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                    "step col-3 d-flex flex-wrap justify-content-center "}>
                                    <span className="d-flex">
                                        <a className="d-flex" onClick={() => { this.breadcrumbClick("BRNSelection") }} disabled={this.state.display === "BRNSelection"}>2</a>
                                    </span>
                                    <label className="text-secondary m-0 w-100 text-center mt-1">Select BRN(s)</label>
                                </div>
                            ) :
                                <div className={this.state.display === "SaveForm" ?
                                    "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                    "step col-3 d-flex flex-wrap justify-content-center "}>
                                    <span className="d-flex">
                                        <a className="d-flex" onClick={() => { this.breadcrumbClick("InvoiceSelection") }} disabled={this.state.display !== "SaveForm"}>2</a>
                                    </span>
                                    <label className="text-secondary m-0 w-100 text-center mt-1">Select Invoices</label>
                                </div>
                            }
                            <div className={"step col-3 d-flex flex-wrap justify-content-center "}>
                                <span className="d-flex">
                                    <a className="d-flex" onClick={() => { this.breadcrumbClick("InvoiceSelection") }} disabled={true}>3</a>
                                </span>
                                <label className="text-secondary m-0 w-100 text-center mt-2">Payment Information</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    handleInvoicePaginationResults = (pageNumber, pageLength) => {
        let invoiceTab = this.state.InvoiceTab;
        invoiceTab.pageInfo.currentPage = pageNumber;
        invoiceTab.pageInfo.pageLength = pageLength;
        invoiceTab.isLoading = true;
        this.setState({ InvoiceTab: invoiceTab });
        this.getCustomerInvoices();
    }
    handleInvoiceFilters = (filters) => {
        let invoiceTab = this.state.InvoiceTab;
        invoiceTab.filters = filters;
        invoiceTab.isLoading = true;
        invoiceTab.SelectedRecords = [];
        invoiceTab.selectedRecordIds = [];
        this.setState({ InvoiceTab: invoiceTab });
        this.getCustomerInvoices();
    }
    handleBRNFilters = (filters) => {
        let BRNTab = this.state.BRNTab;
        BRNTab.pageInfo.currentPage = 0;
        BRNTab.pageInfo.pageLength = 10;
        BRNTab.filters = filters;
        BRNTab.isLoading = true;
        BRNTab.SelectedRecords = [];
        BRNTab.selectedRecordIds = [];
        this.setState({ BRNTab });
        this.getCustomerBRNs();
    }
    handleBRNPaginationResults = (pageNumber, pageLength) => {
        let BRNTab = this.state.BRNTab;
        BRNTab.pageInfo.currentPage = pageNumber;
        BRNTab.pageInfo.pageLength = pageLength;
        BRNTab.isLoading = true;
        this.setState({ BRNTab });
        this.getCustomerBRNs();
    }
    actionHide = () => {
        this.setState({ showPrint: false, showPDF: false, printData: {} });
    }
    btnaction = (agentcustomerInvoiceId, type) => {
        this.getInvoiceDetailData(agentcustomerInvoiceId, type);
    }
    resetCustomer = () => {
        let BRNTab = {
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
            selectedRecords: [],
            isLoading: true,
            selectedRecordIds: []
        };
        let InvoiceTab = {
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
            selectedRecords: [],
            isLoading: true,
            selectedRecordIds: []
        };

        this.setState({ customerData: {}, isCustomerSet: false, BRNTab, InvoiceTab })
        return;
    }
    selectCustomer = (data) => {
        this.setState({ isCustomerSet: false }, () => {
            let InvoiceTab = {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
                selectedRecords: [],
                isLoading: true,
                selectedRecordIds: []
            };
            let BRNTab = {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
                selectedRecords: [],
                isLoading: true,
                selectedRecordIds: []
            };
            this.setState({ customerData: data, isCustomerSet: true, display: "InvoiceSelection", BRNTab, InvoiceTab, breadcrumb: [{ display: "InvoiceSelection", name: data.firstName }], paymentType: "full" }, () => {
                this.getCustomerInvoices();
            });
        });
    }
    onSaveSuccess = () => {
        let InvoiceTab = {
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
            selectedRecords: [],
            isLoading: true,
            selectedRecordIds: []
        };
        let BRNTab = {
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            filters: { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD') },
            selectedRecords: [],
            isLoading: true,
            selectedRecordIds: []
        }
        this.setState({ display: "InvoiceSelection", BRNTab, InvoiceTab, breadcrumb: [{ display: "InvoiceSelection", name: this.state.customerData.displayName ?? this.state.customerData.firstName }], paymentType: "full" }, () => {
            this.getCustomerInvoices();
        });
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
    render() {
        const { userInfo: { agentID } } = this.props;
        const emailId = localStorage.getItem('portalType') === 'B2C' ? this.props.userInfo?.contactInformation?.email : null;
        return (
            <div className="quotation quotation-list">
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {localStorage.getItem('portalType') === 'B2C' ? "My Ledger" : "Customer Reconciliation"}
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <img
                                width="24"
                                height="24"
                                className="mr-3"
                                src={ManageBooking}
                                alt=""
                            />
                            {localStorage.getItem('portalType') === 'B2C' ? "My Ledger" : "Customer Reconciliation"}
                            {this.state.isCustomerSet && this.state.display === "InvoiceSelection" && (
                                <button
                                    className="btn btn-sm btn-light pull-right mr-2"
                                    onClick={this.showHideFilters}
                                >
                                    Filters
                                </button>
                            )}
                            {this.state.isCustomerSet && this.state.display === "BRNSelection" && (
                                <button
                                    className="btn btn-sm btn-light pull-right mr-2"
                                    onClick={this.showHideBRNFilters}
                                >
                                    Filters
                                </button>
                            )}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            {localStorage.getItem('portalType') === 'B2C'
                                ? <QuotationMenuCustomer handleMenuClick={this.handleMenuClick} />
                                : <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                            }
                        </div>
                        <div className="col-lg-9 col-md-12 col-sm-12">
                            {localStorage.getItem('portalType') !== 'B2C' && this.steps()}
                            {this.state.display !== "InvoiceSelection" && this.Breadcrumbs()}
                            {this.state.display === "InvoiceSelection" &&
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 mb-2 ml-1">
                                        <Customerselection
                                            key={JSON.stringify(this.state.customerData)}
                                            email={emailId}
                                            agentID={agentID}
                                            selectCustomer={this.selectCustomer.bind(this)}
                                            resetCustomer={this.resetCustomer}
                                            customerData={this.state.customerData}
                                            isCustomerSet={this.state.isCustomerSet}
                                        />
                                    </div>
                                </div>
                            }
                            {this.state.isCustomerSet && this.state.display === "InvoiceSelection" && (
                                <InvoiceSelection isFilters={this.state.isFilters} showHideFilters={this.showHideFilters}
                                    handleFilters={this.handleInvoiceFilters} showSaveForm={this.showSaveForm} showAdditionals={this.showAdditionals}
                                    {...this.state.InvoiceTab} handlePaginationResults={this.handleInvoicePaginationResults}
                                    btnaction={this.btnaction} userInfo={this.props.userInfo} history={this.props.history} />
                            )}
                            {this.state.isCustomerSet && this.state.display === "BRNSelection" && (
                                <BRNSelection isFilters={this.state.isBRNFilters} showHideFilters={this.showHideBRNFilters}
                                    handleFilters={this.handleBRNFilters} showSaveForm={this.showSaveForm} {...this.state.BRNTab}
                                    BRNList={this.state.BRNList} back={this.back}
                                    handlePaginationResults={this.handleBRNPaginationResults} />
                            )}
                            {
                                this.state.display === "SaveForm" && (this.state.paymentType === "full" || this.state.paymentType === "brnPayment") && (
                                    <CustomerPaymentInfoForm Amount={this.state.Amount} back={this.back}
                                        SelectedRecords={this.state.paymentType === "full" ? this.state.InvoiceTab.selectedRecords : this.state.BRNTab.selectedRecords}
                                        isShowPaymentDueDate={this.state.isShowPaymentDueDate}
                                        paymentType={this.state.paymentType} onSaveSuccess={this.onSaveSuccess} />
                                )
                            }
                            {this.state.display === "additionals" &&
                                <CustomerPaymentInfoForm Amount={0} back={this.back}
                                    paymentType={"additionals"} onSaveSuccess={this.onSaveSuccess} />
                            }
                            {this.state.showPrint &&
                                <div style={{ display: "none" }}>
                                    <InvoicePrint actionHide={this.actionHide} userInfo={this.props.userInfo} printData={this.state.printData} customerData={this.state.customerData} />
                                </div>
                            }
                            {this.state.showPDF &&
                                <div>
                                    < InvoicePdf actionHide={this.actionHide} userInfo={this.props.userInfo} printData={this.state.printData} customerData={this.state.customerData} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default CustomerReconciliation;
