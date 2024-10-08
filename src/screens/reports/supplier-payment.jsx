import React, { Component } from 'react'
import QuotationMenu from "../../components/quotation/quotation-menu";
import SVGIcon from "../../helpers/svg-icon";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import SupplierBRNPayment from "../../components/reports/supplier-brn-payment";
import PaymentInfoForm from "../../components/reports/supplier-payment-form";
import InvoiceSelection from "../../components/reports/supplier-invoice-payment";
import SupplierPaymentSteps from "../../components/reports/supplier-payment-steps";
import DownloadInvoice from "../../components/reports/supplier-invoice-details-pdf";
import PrintInvoice from "../../components/reports/supplier-invoice-details-print";
class SupplierPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "SupplierId": "",
                //"BusinessId": "",
                "ProviderId": this.props.userInfo.agentID,
                "CreatedBy": this.props.userInfo.userID
            },
            errors: {},
            supplierList: [],
            isLoading: false,
            InvoiceTab: {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: { pagenumber: 1, pagesize: 10 },
                selectedRecords: [],
                isLoading: false,
                selectedRecordIds: []

            },
            BRNTab: {
                result: [],
                selectedRecords: [],
                isLoading: true,
                selectedRecordIds: []
            },
            paymentType: "",
            display: "none",
            isSupplierSet: false,
            isFilters: false,
            statusList: [],
            isExport: false,
            isPrint: false,
            exportData: {}

        };
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
    getStatusList = () => {
        let reqURL = "reconciliation/customer/status?type=reconcilition"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = [];
                for (let value of data.response) {
                    if (value === "All") {
                        arr.push({ name: value, value: "" })
                    }
                    else {
                        arr.push({ name: value, value })
                    }
                }
                this.setState({ statusList: arr })
            }.bind(this),
            "GET"
        );
    }
    getSupplier = (businessID) => {
        this.setState({ isLoading: true });
        const { userInfo: { agentID } } = this.props;
        let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID + "&providerid=" + agentID;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ isLoading: false, supplierList: data.response });
            }.bind(this),
            "GET"
        );
    }
    handleBusiness = (businessID, newSupplierList) => {
        let { data, InvoiceTab } = this.state;
        data.BusinessId = businessID;
        data.SupplierId = "";
        const supplierList = newSupplierList;
        InvoiceTab.selectedRecords = [];
        InvoiceTab.selectedRecordIds = [];
        this.setState({ data, supplierList, display: "none", isSupplierSet: false });
    }
    getBRNList = () => {
        let { data, BRNTab, InvoiceTab } = this.state;
        BRNTab.isLoading = true;
        this.setState({ BRNTab });
        var reqURL = "reconciliation/supplier/invoices/getbrnlist?supplierid=" + data.SupplierId +
            "&selectedinvoiceids=" + InvoiceTab.selectedRecordIds.join(",");
        apiRequester_unified_api(
            reqURL,
            {},
            function (responseData) {
                BRNTab.result = responseData.response.filter(x => { return x.supplierDueAmount > 0 });
                BRNTab.isLoading = false;
                this.setState({
                    BRNTab
                });
            }.bind(this),
            "GET"
        );
    }
    getInvoices() {
        let { data, InvoiceTab } = this.state;
        if (!(data["SupplierId"])) {
            return;
        }
        let { filters } = InvoiceTab;
        // if (this.props.location.Supplierinfo.fromdate !== "") {
        //     filters["fromdate"] = this.props.location.Supplierinfo.fromdate;
        // }
        InvoiceTab.isLoading = true;
        this.setState({ InvoiceTab, display: "InvoiceSelection", isSupplierSet: true });
        let reqURL = "reconciliation/supplier/invoice/listwithbrn?"
            + "supplierid=" + data["SupplierId"]
            + "&mode=payment"
        for (let key of Object.keys(filters)) {
            if (filters[key]) {
                if (!(key === "invoicereconciliationstatus" && filters[key] === "All")) {
                    reqURL = reqURL + `&${key}=${filters[key]}`
                }
            }
        }
        apiRequester_unified_api(
            reqURL,
            {},
            function (resonseData) {
                if (typeof resonseData.response === "string") {
                    resonseData.response = [];
                    InvoiceTab.result = [];
                    InvoiceTab.isLoading = false;
                    this.setState({ InvoiceTab });
                    return;
                }
                InvoiceTab.result = resonseData.response;
                InvoiceTab.pageInfo = {
                    currentPage: resonseData?.pageInfo?.page - 1,
                    pageLength: resonseData?.pageInfo?.pageSize,
                    hasNextPage: resonseData?.pageInfo?.totalRecords > resonseData?.pageInfo?.page * resonseData?.pageInfo?.pageSize,
                    hasPreviousPage: resonseData?.pageInfo?.page > 1,
                    totalResults: resonseData?.pageInfo?.totalRecords
                };
                InvoiceTab.isLoading = false;
                this.setState({
                    InvoiceTab
                });
            }.bind(this),
            "GET"
        );
    }
    handleInvoiceFilters = (filters) => {
        let { InvoiceTab } = this.state;
        InvoiceTab.filters = filters;
        InvoiceTab.selectedRecords = [];
        InvoiceTab.selectedRecordIds = [];
        this.setState({ InvoiceTab, display: "none" }, () => { this.getInvoices() })
    }
    handleInvoicePaginationResults = (pageNumber, pageLength) => {
        let { InvoiceTab } = this.state;
        InvoiceTab.filters["pagenumber"] = parseInt(pageNumber) + 1
        InvoiceTab.filters["pagesize"] = pageLength
        this.setState({ InvoiceTab }, () => { this.getInvoices() })
    }
    handleDataChange = (e) => {
        let { data, InvoiceTab } = this.state;
        data[e.target.name] = e.target.value;
        InvoiceTab.selectedRecords = [];
        InvoiceTab.selectedRecordIds = [];
        const isSupplierSet = e.target.value && e.target.value != ""
        this.setState({ data, InvoiceTab, display: "none", isSupplierSet }, () => {
            this.getInvoices();
        });
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
        } else if (paymentType === "partial") {
            BRNTab.selectedRecordIds = [];
            BRNTab.selectedRecords = [];
            BRNTab.isLoading = true;
            this.setState({ display: "BRNSelection", Amount: amount, InvoiceTab, BRNTab, paymentType }, () => { this.getBRNList(); });
            return;
        }
        this.setState({ display: paymentType === "full" || paymentType === "brnPayment" ? "SaveForm" : "BRNSelection", Amount: amount, InvoiceTab, BRNTab, paymentType });
    }
    RedirectToInvoiceList = () => {
        this.props.history.push(`/SupplierInvoices`);
    }
    back = (display) => {
        this.setState({ display });
    }
    stepClick = (step) => {
        switch (step) {
            case "SelectSupplier":
                let { data } = this.state;
                data.SupplierId = "";
                this.setState({ display: "none", data, isSupplierSet: false })
                break;
            case "InvoiceSelection":
                this.setState({ display: "InvoiceSelection" })
                break;
            case "BRNSelection":
                this.setState({ display: "BRNSelection" })
                break;
        }
    }
    // getSupplier = (businessID) => {
    //     this.setState({ isLoading: true });
    //     const { userInfo: { agentID } } = this.props;
    //     let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID + "&providerid=" + agentID;
    //     apiRequester(
    //         reqURL,
    //         {},
    //         function (data) {
    //             this.setState({ isLoading: false, supplierList: data.response });
    //         }.bind(this),
    //         "GET"
    //     );
    // }
    showHideFilters = (isFilters) => {
        this.setState({ isFilters });
    }
    componentDidMount() {
        this.getStatusList();
        this.getSupplierList()
        const { location: { Supplierinfo } } = this.props;
        if (Supplierinfo && Supplierinfo.SupplierId) {
            let { data } = this.state;
            //data.BusinessId = Supplierinfo.BusinessId;
            data.SupplierId = Supplierinfo.SupplierId;
            this.setState({ data }, () => {
                this.getInvoices();
            });
            // this.getSupplier(data.BusinessId);

        }
        else {
            this.RedirectToInvoiceList();
        }
    }
    getSupplierList = () => {
        const { userInfo: { agentID } } = this.props;
        let reqURL = "reconciliation/supplier/all?providerid=" + agentID
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ supplierList: data.response })
            }.bind(this),
            "GET"
        );
    }
    btnaction = (invoiceId, type) => {
        const { userInfo: { agentID } } = this.props
        let reqURL = "reconciliation/supplier/invoice/report?invoiceid=" + invoiceId
            + "&providerid=" + agentID
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ exportData: data.response, isExport: type === "PDF", isPrint: type === "Print" });
            }.bind(this),
            "GET"
        );
    }
    render() {
        const { data, errors, supplierList, BRNTab, isSupplierSet, display, paymentType } = this.state;
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            Supplier Invoice Payment
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>

                        <div className="col-lg-9 ">
                            <div className="container ">
                                <SupplierPaymentSteps isSupplierSet={isSupplierSet} display={display} paymentType={paymentType} stepClick={this.stepClick} />
                                <div className="row mt-2">
                                    <div className="col-lg-2"></div>
                                    {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className={"form-group " + "business"}>
                                            <BusinessDropdown providerID={data.ProviderId} handleBusiness={this.handleBusiness} BusinessId={data.BusinessId} disabled={!data.BusinessId === false} />
                                            {errors["BusinessId"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["BusinessId"]}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    */}
                                    <div className="col-sm-8">
                                        <div className={"form-group " + "SupplierId"}>
                                            <label htmlFor={"SupplierId"}>{"Supplier *"}</label>
                                            <div className="input-group">
                                                <select
                                                    value={data.SupplierId}
                                                    onChange={(e) => this.handleDataChange(e)}
                                                    name={"SupplierId"}
                                                    id={"SupplierId"}
                                                    disabled={!data.SupplierId === false}
                                                    className={"form-control"}>
                                                    <option key={0} value={''}>Select</option>
                                                    {supplierList.map((option, key) => (

                                                        <option
                                                            key={key}
                                                            value={
                                                                option["providerId"]
                                                            }
                                                        >
                                                            {option["fullName"]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors["SupplierId"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["SupplierId"]}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-2"></div>
                                </div>
                                {!isSupplierSet && (
                                    <div className="row">
                                        <div className="col-lg-4 mt-4">
                                            <button
                                                className="btn mr-2 float-left btn-secondary"
                                                type="submit"
                                                onClick={() => this.RedirectToInvoiceList()}
                                            >
                                                Back To Invoices
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {this.state.display === "InvoiceSelection" && (
                                    <InvoiceSelection isFilters={this.state.isFilters} showHideFilters={this.showHideFilters} handleFilters={this.handleInvoiceFilters} showSaveForm={this.showSaveForm} {...this.state.InvoiceTab} handlePaginationResults={this.handleInvoicePaginationResults} btnaction={this.btnaction} RedirectToInvoiceList={this.RedirectToInvoiceList} status={this.state.statusList} />
                                )}
                                {this.state.display === "BRNSelection" && (
                                    <SupplierBRNPayment showSaveForm={this.showSaveForm} {...BRNTab} back={this.back} />
                                )}
                                {this.state.display === "SaveForm" && (this.state.paymentType === "full" || this.state.paymentType === "brnPayment") && (
                                    <PaymentInfoForm Amount={this.state.Amount} back={this.back} SelectedRecords={this.state.paymentType === "full" ? this.state.InvoiceTab.selectedRecords : this.state.BRNTab.selectedRecords} paymentType={this.state.paymentType} onSaveSuccess={this.RedirectToInvoiceList} headerData={data} />
                                )}
                            </div>
                        </div>
                        {this.state.isExport && (
                            <DownloadInvoice
                                filename=""
                                onExportComplete={
                                    () => { this.setState({ isExport: false, exportData: {} }) }
                                }
                                data={this.state.exportData}
                            />
                        )}
                        {this.state.isPrint && (
                            <PrintInvoice
                                filename=""
                                onExportComplete={
                                    () => { this.setState({ isPrint: false, exportData: {} }) }
                                }
                                data={this.state.exportData}
                            />
                        )}
                    </div>
                </div>
            </div >
        )
    }
}
export default SupplierPayment;

