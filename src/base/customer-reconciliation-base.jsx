import { Component } from "react";
import { apiRequester_unified_api } from "../services/requester-unified-api";
class CustomerReconciliationBase extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getCustomerInvoices = (customerID) => {

        let invoiceTab = this.state.InvoiceTab;
        var reqURL =

            "reconciliation/customer/invoice/list?customerid=" +
            this.state.customerData.customerID +
            "&pagenumber=" +
            (parseInt(invoiceTab.pageInfo.currentPage) + 1) +
            "&pagesize=" +
            invoiceTab.pageInfo.pageLength +
            (invoiceTab.filters.fromDate ? "&createdfromdate=" + invoiceTab.filters.fromDate : "") +
            (invoiceTab.filters.toDate ? "&createdtodate=" + invoiceTab.filters.toDate : "") +
            (invoiceTab.filters.invoiceNo ? "&invoicenumber=" + invoiceTab.filters.invoiceNo : "") +
            (invoiceTab.filters.status && invoiceTab.filters.status !== "All" ? "&invoicereconciliationstatus=" + invoiceTab.filters.status : "");

        var reqOBJ = {};

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {

                let InvoiceTab = this.state.InvoiceTab;
                InvoiceTab.result = data.response;
                InvoiceTab.pageInfo = {
                    currentPage: data?.pageInfo?.page - 1,
                    pageLength: data?.pageInfo?.records,
                    hasNextPage: data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.records,
                    hasPreviousPage: data?.pageInfo?.page > 1,
                    totalResults: data?.pageInfo?.totalRecords
                };
                InvoiceTab.isLoading = false;
                this.setState({
                    InvoiceTab
                });
            }.bind(this),
            "GET"
        );
    };
    getCustomerBRNs = () => {
        const bRNTab = this.state.BRNTab;
        var reqURL =
            "reconciliation/customer/invoice/payment/brnlist?customerid=" +
            this.state.customerData.customerID +
            "&pagenumber=" +
            (parseInt(bRNTab.pageInfo.currentPage) + 1) +
            "&pagesize=" +
            bRNTab.pageInfo.pageLength +
            (bRNTab.filters.fromDate ? "&createdfromdate=" + bRNTab.filters.fromDate : "") +
            (bRNTab.filters.toDate ? "&createdtodate=" + bRNTab.filters.toDate : "") +
            (bRNTab.filters.invoiceNo ? "&invoicenumber=" + bRNTab.filters.invoiceNo : "")
            ;

        var reqOBJ = {};

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {

                let BRNTab = this.state.BRNTab;
                BRNTab.result = data.response;
                BRNTab.pageInfo = {
                    currentPage: data?.pageInfo?.page - 1,
                    pageLength: data?.pageInfo?.records,
                    hasNextPage: data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.records,
                    hasPreviousPage: data?.pageInfo?.page > 1,
                    totalResults: data?.pageInfo?.totalRecords
                };
                BRNTab.isLoading = false
                this.setState({
                    BRNTab
                });
            }.bind(this),
            "GET"
        );
    };
    getInvoiceDetailData = (agentcustomerInvoiceId, type) => {
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
                    this.setState({ showPrint: type === "Print", showPDF: type === "PDF", printData: InvoiceDetails });
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
                    this.setState({ showPrint: type === "Print", showPDF: type === "PDF", printData: InvoiceDetails });
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
                    this.setState({ showPrint: type === "Print", showPDF: type === "PDF", printData: InvoiceDetails });
            }.bind(this),
            "GET"
        );
    }
}
export default CustomerReconciliationBase;