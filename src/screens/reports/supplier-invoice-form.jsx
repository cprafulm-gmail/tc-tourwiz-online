import React from 'react'
import Form from "../../components/common/form";
import QuotationMenu from "../../components/quotation/quotation-menu";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import TableLoading from "../../components/loading/table-loading";
import Datecomp from "./../../helpers/date";
import BusinessDropdown from "../../components/reports/business-dropdown";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import SingleDate from "../../components/common/form-birthdate";
import Pagination from "./../../components/booking-management/booking-pagination";
import moment from "moment";
import Loader from "../../components/common/loader";
import MessageBar from '../../components/admin/message-bar';
import Select from "react-select";
import * as Global from "../../helpers/global";
import { Helmet } from "react-helmet";

class SupplierInvoice extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "SupplierId": "",
                "BusinessId": "",
                "InvoiceDate": "",
                "InvoiceNumber": "",
                "InvoiceDurationStartDate": "",
                "InvoiceDurationEndDate": "",
                "InvoiceCurrencyCode": "",
                "InvoiceAmount": "",
                "InvoiceTax1": "",
                "InvoiceNetAmount": "",
                "NoOfConfirmBooking": "",
                "NoOfCancelBooking": "",
                "NoOfBookingReconciled": "",
                "InvoiceReconciliationStatus": "Pending",
                "DueAmount": "",
                "Comment": "",
                "CreatedBy": ""
            },
            isLoadingSupplier: false,
            errors: {},
            PendingInvoicedBooking: {
                result: [],
                pageInfo: {
                    currentPage: 0,
                    pageLength: 10,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    totalResults: 0
                },
                filters: {},
                isLoading: false,
                selectedRecordIds: []
            },
            SelectedBookingToInvoice: {
                result: [],
                isLoading: false,
                selectedRecordIds: []
            },
            SavedRemovedBookings: {
                result: [],
                selectedRecordIds: []
            },
            supplierList: [],
            isLoading: false,
            isEditModeLoading: false,
            mode: "add",
            commentHistory: [],
            selectedTab: "PendingBookings"
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
    setDates = (id, mode) => {
        let newData = { ...this.state.data };
        const date = moment(new Date()).format("YYYY-MM-DD");
        newData.InvoiceDate = date;
        newData.InvoiceDurationStartDate = moment().add(-1, 'M').format('YYYY-MM-DD');
        newData.InvoiceDurationEndDate = date;
        newData.DueDate = date;
        if (mode === "add") {
            let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))
            if (reportBusinessSupplier && reportBusinessSupplier["supplierList"]
                && reportBusinessSupplier["businessID"]
                && reportBusinessSupplier["supplierId"]) {
                newData["SupplierId"] = reportBusinessSupplier["supplierId"];
                newData["BusinessId"] = reportBusinessSupplier["businessID"];
                this.setState({ supplierList: reportBusinessSupplier["supplierList"] });
                const SelectedSupplier = reportBusinessSupplier["supplierList"].filter((param) => { return param.providerId === parseInt(newData["SupplierId"]) })[0];
                newData["InvoiceCurrencyCode"] = SelectedSupplier ? SelectedSupplier["currencySymbol"] : Global.getEnvironmetKeyValue("portalCurrencySymbol");
            }
        }
        this.setState({ data: newData, invoiceId: id, mode });
    };
    componentDidMount() {
        const { mode, id } = this.props.match.params;
        this.setDates(id, mode.toLowerCase());
        if (mode.toLowerCase() === "edit") {
            this.getInvoiceDetails(id);
            this.getCommentHistory(id);
        }
    }
    getCommentHistory(id) {
        let reqURL = "reconciliation/supplier/invoice/comments?invoiceid=" + id;
        apiRequester_unified_api(
            reqURL,
            {},
            function (resonsedata) {
                this.setState({ commentHistory: resonsedata.response });
            }.bind(this),
            "GET"
        );
    }
    getInvoiceDetails = (id) => {
        this.setState({ isLoading: true, isEditModeLoading: true });
        let reqURL = "reconciliation/supplier/invoice/details?invoiceid=" + id;
        apiRequester_unified_api(
            reqURL,
            {},
            function (resonsedata) {
                let { data } = this.state;
                if (resonsedata.response.length > 0) {
                    const InvoiceDetail = resonsedata.response[0];
                    data = {

                        "SupplierId": InvoiceDetail.supplierId,
                        "BusinessId": InvoiceDetail.businessId,
                        "InvoiceDate": InvoiceDetail.invoiceDate,
                        "InvoiceNumber": InvoiceDetail.invoiceNumber,
                        "InvoiceDurationStartDate": InvoiceDetail.invoiceDurationStartDate,
                        "InvoiceDurationEndDate": InvoiceDetail.invoiceDurationEndDate,
                        "InvoiceCurrencyCode": InvoiceDetail.invoiceCurrencyCode,
                        "InvoiceAmount": InvoiceDetail.invoiceAmount,
                        "InvoiceTax1": InvoiceDetail.invoiceTax1,
                        "InvoiceNetAmount": InvoiceDetail.invoiceNetAmount,
                        "NoOfConfirmBooking": InvoiceDetail.noOfConfirmBooking,
                        "NoOfCancelBooking": InvoiceDetail.noOfCancelBooking,
                        "NoOfBookingReconciled": InvoiceDetail.noOfBookingReconciled,
                        "InvoiceReconciliationStatus": InvoiceDetail.invoiceReconciliationStatus,
                        "DueAmount": InvoiceDetail.dueAmount,
                        "DueDate": InvoiceDetail.dueDate,
                        "Comment": "",
                        "invoiceId": InvoiceDetail.supplierInvoicesAndReconciliationId
                    }
                }
                this.setState({ data, isLoading: false, isEditModeLoading: false }, () => {
                    this.getPendingInvoicedBooking();
                    this.getSelectedBooking()
                });
                this.getSupplier(data.BusinessId);
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
    getPendingInvoicedBooking = () => {
        let { PendingInvoicedBooking, data } = this.state;
        if (!data.BusinessId || data.BusinessId === "" || !data.SupplierId || data.SupplierId === "" || !data.InvoiceDurationStartDate || data.InvoiceDurationStartDate === "" || !data.InvoiceDurationEndDate || data.InvoiceDurationEndDate === "") {
            this.setState({ PendingInvoicedBooking });
            return;
        }
        const { userInfo: { agentID } } = this.props;
        PendingInvoicedBooking.isLoading = true;
        this.setState({ PendingInvoicedBooking });
        let reqURL = `reconciliation/supplier/reconciliation/details?businessid=${data.BusinessId}&supplierid=${data.SupplierId}&providerid=${agentID}&fromdate=${data.InvoiceDurationStartDate}&todate=${data.InvoiceDurationEndDate}&reconciliationstatus=ALL&pagesize=${PendingInvoicedBooking.pageInfo.pageLength}&pagenumber=${PendingInvoicedBooking.pageInfo.currentPage + 1}${data.invoiceId ? "&invoiceid=" + data.invoiceId : ""}&type=pending`;
        reqURL = reqURL + `&usertype=${this.props.userInfo.afUserType}`;
        apiRequester_unified_api(
            reqURL,
            {},
            function (ResponceData) {
                if (typeof ResponceData.response === "string") {
                    ResponceData.response = [];
                    PendingInvoicedBooking.result = [];
                    PendingInvoicedBooking.isLoading = false;
                    this.setState({ PendingInvoicedBooking });
                    return;
                }
                PendingInvoicedBooking.result = ResponceData.response;
                PendingInvoicedBooking.isLoading = false;
                let pageInfo = PendingInvoicedBooking.pageInfo;
                if (ResponceData.response.length > 0) {
                    let totalRecords = ResponceData.response[0].totalRows;
                    pageInfo["hasNextPage"] = totalRecords > pageInfo.currentPage * pageInfo.pageLength;
                    pageInfo["hasPreviousPage"] = pageInfo.currentPage > 1;
                    pageInfo["totalResults"] = totalRecords;
                    //pageInfo["currentPage"] = pageInfo.currentPage;
                } else {
                    pageInfo["hasNextPage"] = false;
                    pageInfo["hasPreviousPage"] = false;
                    pageInfo["totalResults"] = 0;
                }
                PendingInvoicedBooking.pageInfo = {
                    currentPage: ResponceData?.pageInfo?.page - 1,
                    pageLength: ResponceData?.pageInfo?.pageSize,
                    hasNextPage: ResponceData?.pageInfo?.totalRecords > ResponceData?.pageInfo?.page * ResponceData?.pageInfo?.pageSize,
                    hasPreviousPage: ResponceData?.pageInfo?.page > 1,
                    totalResults: ResponceData?.pageInfo?.totalRecords
                };
                //PendingInvoicedBooking.pageInfo = pageInfo;
                this.setState({ PendingInvoicedBooking });
            }.bind(this),
            "GET"
        );

    }
    getSelectedBooking = () => {
        let { SelectedBookingToInvoice, data } = this.state;
        const { userInfo: { agentID } } = this.props;
        SelectedBookingToInvoice.isLoading = true;
        this.setState({ SelectedBookingToInvoice });
        let reqURL = `reconciliation/supplier/reconciliation/details?businessid=${data.BusinessId}&supplierid=${data.SupplierId}&providerid=${agentID}&reconciliationstatus=ALL&pagesize=0&pagenumber=0${data.invoiceId ? "&invoiceid=" + data.invoiceId : ""}&type=selected`;
        apiRequester_unified_api(
            reqURL,
            {},
            function (ResoonceData) {
                if (typeof ResoonceData.response === "string" || ResoonceData.error) {
                    data.response = [];
                }
                else {
                    SelectedBookingToInvoice.result = ResoonceData?.response.map((item) => {
                        if (item.supplierReconciledAmout !== item.supplierBookingAmount) {
                            item.IsPending = true;
                        }
                        item.IsSaved = true;
                        return item;
                    });
                    data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
                    data.InvoiceNetAmount = this.calculateInvoiceAmount(SelectedBookingToInvoice.result);
                    data.InvoiceAmount = data.InvoiceNetAmount;
                    SelectedBookingToInvoice.isLoading = false;
                    this.setState({ SelectedBookingToInvoice, data });
                }
            }.bind(this),
            "GET"
        );

    }
    handlePaginationResults = (pageNumber, pageLength) => {
        let { PendingInvoicedBooking } = this.state;
        PendingInvoicedBooking.pageInfo.currentPage = parseInt(pageNumber);
        PendingInvoicedBooking.pageInfo.pageLength = pageLength;
        this.setState({ PendingInvoicedBooking });
        this.getPendingInvoicedBooking();
    }
    handleFilterChange = () => {
        let { PendingInvoicedBooking } = this.state;
        PendingInvoicedBooking.result = [];
        let pageInfo = PendingInvoicedBooking.pageInfo;
        pageInfo["hasNextPage"] = false;
        pageInfo["hasPreviousPage"] = false;
        pageInfo["totalResults"] = 0;
        pageInfo["currentPage"] = 0;
        pageInfo["pageLength"] = 10;

        let SelectedBookingToInvoice = {
            result: this.state.SelectedBookingToInvoice.result,
            isLoading: false,
            selectedRecordIds: this.state.SelectedBookingToInvoice.selectedRecordIds
        };

        let SavedRemovedBookings = {
            result: this.state.SavedRemovedBookings.result,
            isLoading: false,
            selectedRecordIds: this.state.SavedRemovedBookings.selectedRecordIds
        };

        //**********Setp 1**********
        //*selected list --> filter record
        //*Get item(s) which is need to be moved from "selected list" to "removed list".
        let selectedRemoved = SelectedBookingToInvoice.result.filter(item => moment(this.state.data.InvoiceDurationEndDate).isBefore(moment(item.bookingDate.split('T')[0])));
        //*remove record from "removed list" 
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.filter(item => moment(this.state.data.InvoiceDurationEndDate).isSameOrAfter(moment(item.bookingDate.split('T')[0])));
        //*remove record from "removed list" "selectedRecordIds[]"
        selectedRemoved.map(item => {
            //*Select List : Remove from "selectedRecordIds" array
            if (SelectedBookingToInvoice.selectedRecordIds.indexOf(item.itineraryDetailId) > -1)
                SelectedBookingToInvoice.selectedRecordIds.slice(SelectedBookingToInvoice.selectedRecordIds.indexOf(item.itineraryDetailId), 1);
        });
        //*removed List : Add item to "result" array
        SavedRemovedBookings.result = SavedRemovedBookings.result.concat(selectedRemoved);

        //**********Setp 2**********
        //~removed list --> filter record
        //~Get item(s) which is need to be moved from "removed list" to "selected list".
        let selectedRemoved1 = SavedRemovedBookings.result.filter(item => moment(this.state.data.InvoiceDurationEndDate).isSameOrAfter(moment(item.bookingDate.split('T')[0])));
        //~remove record from "removed list" 
        SavedRemovedBookings.result = SavedRemovedBookings.result.filter(item => moment(this.state.data.InvoiceDurationEndDate).isBefore(moment(item.bookingDate.split('T')[0])));
        //~remove record from "removed list" "selectedRecordIds[]"
        selectedRemoved1.map(item => {
            //~Select List : Remove from "selectedRecordIds" array
            if (SavedRemovedBookings.selectedRecordIds.indexOf(item.itineraryDetailId) > -1)
                SavedRemovedBookings.selectedRecordIds.slice(SavedRemovedBookings.selectedRecordIds.indexOf(item.itineraryDetailId), 1);
        });
        //~selected List : Add item to "result" array
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.concat(selectedRemoved1);

        this.setState({ PendingInvoicedBooking, SavedRemovedBookings, SelectedBookingToInvoice }, () => { this.getPendingInvoicedBooking(); this.AddSavedRemovedBookingToSelectedBooking(); });
    }
    selectBookingToInvoice = (e, record) => {
        let { SelectedBookingToInvoice } = this.state;
        let selectedRecordIds = SelectedBookingToInvoice.selectedRecordIds;
        if (e.target.checked) {
            selectedRecordIds.push(record.itineraryDetailId)
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.itineraryDetailId);
            selectedRecordIds.splice(recordIndex, 1);
        }
        SelectedBookingToInvoice.selectedRecordIds = selectedRecordIds;
        this.setState({ SelectedBookingToInvoice });
    }
    selectPendingInvoicedBooking = (e, record) => {
        let { PendingInvoicedBooking } = this.state;
        let selectedRecordIds = PendingInvoicedBooking.selectedRecordIds;
        if (e.target.checked) {
            selectedRecordIds.push(record.itineraryDetailId)
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.itineraryDetailId);
            selectedRecordIds.splice(recordIndex, 1);
        }
        PendingInvoicedBooking.selectedRecordIds = selectedRecordIds;
        this.setState({ PendingInvoicedBooking });
    }
    selectSavedRemovedBooking = (e, record) => {
        let { SavedRemovedBookings } = this.state;
        let selectedRecordIds = SavedRemovedBookings.selectedRecordIds;
        if (e.target.checked) {
            selectedRecordIds.push(record.itineraryDetailId)
        } else {
            let recordIndex = selectedRecordIds.indexOf(record.itineraryDetailId);
            selectedRecordIds.splice(recordIndex, 1);
        }
        SavedRemovedBookings.selectedRecordIds = selectedRecordIds;
        this.setState({ SavedRemovedBookings });
    }
    AddToSelectedBooking = () => {
        let { PendingInvoicedBooking, SelectedBookingToInvoice, data } = this.state;
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.concat(PendingInvoicedBooking.result.filter((param) => { return PendingInvoicedBooking.selectedRecordIds.indexOf(param.itineraryDetailId) > -1 }));
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.map(obj => ({ ...obj }));
        data.InvoiceAmount = this.calculateInvoiceAmount(SelectedBookingToInvoice.result);
        data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
        PendingInvoicedBooking.selectedRecordIds = [];
        this.setState({ PendingInvoicedBooking, SelectedBookingToInvoice });
    }
    AddSavedRemovedBookingToSelectedBooking = () => {
        let { SavedRemovedBookings, SelectedBookingToInvoice, data } = this.state;
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.concat(SavedRemovedBookings.result.filter((param) => { return SavedRemovedBookings.selectedRecordIds.indexOf(param.itineraryDetailId) > -1 }));
        SavedRemovedBookings.result = SavedRemovedBookings.result.filter((param) => { return SavedRemovedBookings.selectedRecordIds.indexOf(param.itineraryDetailId) < 0 });
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.map(obj => ({ ...obj }));
        data.InvoiceAmount = this.calculateInvoiceAmount(SelectedBookingToInvoice.result);
        data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
        SavedRemovedBookings.selectedRecordIds = [];
        this.setState({ SavedRemovedBookings, SelectedBookingToInvoice });
    }
    calculateInvoiceAmount = (selectedBookingList) => {
        return selectedBookingList.reduce((sum, item) => { return sum + parseFloat(item.supplierBookingAmount) }, 0);
    }
    calculateReconcileAmount = (selectedBookingList) => {
        return selectedBookingList.reduce((sum, item) => { return sum + (item.IsPending ? parseFloat(item.supplierReconciledAmout ? item.supplierReconciledAmout : 0) : parseFloat(item.supplierBookingAmount)) }, 0);
    }
    RemoveFromSelectedBooking = () => {
        let { SelectedBookingToInvoice, PendingInvoicedBooking, data, SavedRemovedBookings } = this.state;
        const SavedRemovedBookingsResult = SelectedBookingToInvoice.result.filter((param) => { return param.IsSaved && SelectedBookingToInvoice.selectedRecordIds.indexOf(param.itineraryDetailId) > -1 });
        SavedRemovedBookings.result = SavedRemovedBookings.result.concat(SavedRemovedBookingsResult);
        SavedRemovedBookings.result = SavedRemovedBookings.result.map(obj => ({ ...obj }));
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.filter((param) => { return SelectedBookingToInvoice.selectedRecordIds.indexOf(param.itineraryDetailId) < 0 });
        SelectedBookingToInvoice.result = SelectedBookingToInvoice.result.map(obj => ({ ...obj }));

        data.InvoiceAmount = this.calculateInvoiceAmount(SelectedBookingToInvoice.result);
        data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
        SelectedBookingToInvoice.selectedRecordIds = [];
        this.setState({ SelectedBookingToInvoice, PendingInvoicedBooking, SavedRemovedBookings });
    }
    checkAllSelectedBooking = (e) => {
        let { SelectedBookingToInvoice } = this.state;
        if (e.target.checked) {
            let newSelectedRecordIds = SelectedBookingToInvoice.result.filter((item) => { return SelectedBookingToInvoice.selectedRecordIds.indexOf(item.itineraryDetailId) === -1 }).map((item) => { return item.itineraryDetailId });
            SelectedBookingToInvoice.selectedRecordIds = SelectedBookingToInvoice.selectedRecordIds.concat(newSelectedRecordIds);
        } else {
            SelectedBookingToInvoice.selectedRecordIds = [];
        }
        this.setState({ SelectedBookingToInvoice });
    }
    isCheckAllSelectedBooking = () => {
        let { SelectedBookingToInvoice } = this.state;
        const RecordIds = SelectedBookingToInvoice.result.map((item) => { return item.itineraryDetailId });
        if (RecordIds.length === 0)
            return false;
        const selectedRecordIds = SelectedBookingToInvoice.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    checkAllPendingInvoicedBooking = (e) => {
        let { SelectedBookingToInvoice, PendingInvoicedBooking } = this.state;
        if (e.target.checked) {
            const SelectedInvoicesId = SelectedBookingToInvoice.result.map((item) => { return item.itineraryDetailId });
            let newSelectedRecordIds = PendingInvoicedBooking.result
                .filter((item) => {
                    return SelectedInvoicesId.indexOf(item.itineraryDetailId) < 0
                        && PendingInvoicedBooking.selectedRecordIds.indexOf(item.itineraryDetailId) === -1
                })
                .map((item) => {
                    if (item.supplierBookingAmount !== 0)
                        return item.itineraryDetailId
                }).filter(Boolean);
            PendingInvoicedBooking.selectedRecordIds = PendingInvoicedBooking.selectedRecordIds.concat(newSelectedRecordIds);
        } else {
            PendingInvoicedBooking.selectedRecordIds = [];
        }
        this.setState({ PendingInvoicedBooking });
    }
    isCheckAllPendingInvoicedBookings = () => {
        let { PendingInvoicedBooking } = this.state;
        const RecordIds = PendingInvoicedBooking.result.map((item) => { return item.itineraryDetailId });
        if (RecordIds.length === 0)
            return false;
        const selectedRecordIds = PendingInvoicedBooking.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    checkAllSavedRemovedBooking = (e) => {
        let { SavedRemovedBookings } = this.state;
        if (e.target.checked) {
            const SelectedInvoicesId = SavedRemovedBookings.selectedRecordIds;
            let newSelectedRecordIds = SavedRemovedBookings.result.filter((item) => { return SelectedInvoicesId.indexOf(item.itineraryDetailId) < 0 }).map((item) => { return item.itineraryDetailId });
            SavedRemovedBookings.selectedRecordIds = SelectedInvoicesId.concat(newSelectedRecordIds);
        } else {
            SavedRemovedBookings.selectedRecordIds = [];
        }
        this.setState({ SavedRemovedBookings });
    }
    isCheckAllSavedRemovedBooking = () => {
        let { SavedRemovedBookings } = this.state;
        const RecordIds = SavedRemovedBookings.result.map((item) => { return item.itineraryDetailId });
        if (RecordIds.length === 0)
            return false;
        const selectedRecordIds = SavedRemovedBookings.selectedRecordIds;
        return RecordIds.every(v => selectedRecordIds.includes(v));
    }
    handleBusiness = (businessID, newSupplierList) => {
        let { data, supplierList } = this.state;
        data.BusinessId = businessID;
        supplierList = newSupplierList;
        this.setState({ data, supplierList });
        this.handleFilterChange();
    }
    handleDataChange = (e) => {
        let { data } = this.state;
        if (e.target.name === "SupplierId" && e.target.value != "") {
            const SelectedSupplier = this.state.supplierList.filter((param) => { return param.providerId === parseInt(e.target.value) })[0];
            data["InvoiceCurrencyCode"] = SelectedSupplier["currencySymbol"];
        }
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "SupplierId")
            this.handleFilterChange();
    }
    validateInvoiceNumber = () => {
        const { data } = this.state;
        let reqURL = "reconciliation/supplier/invoice/validate?invoicenumber=" + btoa(data.InvoiceNumber.replaceAll('-', '+dash')) + "&supplierid=" + data.SupplierId + "&invoicedate=" + data.InvoiceDate + (data.invoiceId ? "&invoiceid=" + data.invoiceId : "");
        apiRequester_unified_api(
            reqURL,
            {},
            function (resonsedata) {
                if (resonsedata.response.status === "valid") {
                    this.saveInvoice();
                } else {
                    const { errors } = this.state;
                    errors["InvoiceNumber"] = resonsedata.response.error;
                    errors["BRNList"] = resonsedata.response.error;
                    this.setState({ errors, isLoading: false });
                }
            }.bind(this),
            "GET"
        );
    }
    validateInvoiceInformation = () => {

        const errors = {};
        const { data, SelectedBookingToInvoice } = this.state;

        if (!data.SupplierId || !this.validateFormData(data.SupplierId, "require"))
            errors.SupplierId = "Supplier required";

        if (!this.validateFormData(data.BusinessId, "require"))
            errors.BusinessId = "Business required";

        if (!this.validateFormData(data.InvoiceNumber, "require"))
            errors.InvoiceNumber = "Invoice Number required";
        else if (data.InvoiceNumber && !this.validateFormData(data.InvoiceNumber, "special-characters-not-allowed", /[<>'"\[\]]/))
            errors.InvoiceNumber = "<,',\",[,] and > characters not allowed";

        if (!this.validateFormData(data.InvoiceDate, "require_date"))
            errors.InvoiceDate = "Invoice Date required";
        if (!this.validateFormData(data.DueDate, "require_date"))
            errors.InvoiceDate = "Invoice Due Date required";
        if (!this.validateFormData(data.InvoiceDurationStartDate, "require_date"))
            errors.InvoiceDurationStartDate = "Invoice Duration Start Date required";

        if (!this.validateFormData(data.InvoiceDurationEndDate, "require_date"))
            errors.InvoiceDurationEndDate = "Invoice Duration End Date required";

        if (!this.validateFormData(data.InvoiceCurrencyCode, "require"))
            errors.InvoiceCurrencyCode = "Invoice Currency required";

        if (!this.validateFormData(data.Comment, "require"))
            errors.Comment = "Comment required";
        else if (data.Comment && !this.validateFormData(data.Comment, "special-characters-not-allowed", /[<>]/))
            errors.Comment = "< and > characters not allowed";

        if (SelectedBookingToInvoice.result.length === 0) {
            errors.BRNList = "Please select at least one booking for the Invoice.";
        } else {
            const InvalidRecord = SelectedBookingToInvoice.result.filter((param) => { return param.IsPending && (!param.supplierReconciledAmout || param.supplierReconciledAmout === "" || param.supplierReconciledAmout <= 0) });
            if (InvalidRecord.length > 0)
                errors.BRNList = "Supplier Amount can not be less or equal to 0 or blank or text for Selected Reference Numner " + InvalidRecord[0].bookingRef;

        }

        if (data.InvoiceNetAmount && !this.validateFormData(data.InvoiceNetAmount, "numeric"))
            errors.InvoiceNetAmount = "Please enter Invoice Net Amount in decimal only";

        return Object.keys(errors).length === 0 ? null : errors;
    }
    saveInvoiceClick = () => {
        const errors = this.validateInvoiceInformation();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isLoading: true })
        this.validateInvoiceNumber();
    }
    saveInvoice = () => {
        let { data, SelectedBookingToInvoice, mode } = { ...this.state };
        const { userInfo: { agentID, userID } } = this.props;
        const bookingdetails = SelectedBookingToInvoice.result.map(obj => ({
            "portalAgentId": obj.portalAgentId,
            "businessId": obj.businessId,
            "bookingRef": obj.bookingRef,
            "itineraryDetailId": obj.itineraryDetailId,
            "supplierName": obj.supplierName,
            "supplierBookingAmount": obj.supplierBookingAmount,
            "supplierBookingCurrency": obj.supplierBookingCurrency,
            "supplierReconciledAmout": obj.IsPending ? obj.supplierReconciledAmout : obj.supplierBookingAmount,
            "supplierReconciledCurrency": obj.supplierBookingCurrency,
        }));
        if (mode === "add") {
            data["CreatedBy"] = userID;
        } else {
            data["UpdatedBy"] = userID;
        }
        let reqOBJ = {
            "request": {
                ...data,
                InvoiceNetAmount: data["ReconcileAmount"],
                InvoiceAmount: data["ReconcileAmount"],
                DueAmount: data["ReconcileAmount"],
                providerId: agentID,
                bookingdetails
            }
        };
        this.setState({ isLoading: true });
        let reqURL = `reconciliation/supplier/invoice/${mode === "add" ? "add" : "update"}`;
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata.error) {
                    let { errors } = this.state;
                    errors.BRNList = resonsedata.error;
                    this.setState({ isLoading: false, errors });
                } else {
                    this.setState({ isLoading: false });
                    this.setState({ showSuccessMessage: true });
                }
            }.bind(this),
            "POST"
        );

    }
    handleDateChangeEvent = (value, id) => {
        const { data, errors } = { ...this.state };

        if (id === "InvoiceDurationStartDate" && new Date(value) > new Date(data["InvoiceDurationEndDate"])) {
            errors[id] = "Start Date can not be greater than End Date.";
            this.setState({ errors });
            return;
        }
        else if (id === "InvoiceDurationEndDate" && new Date(value) < new Date(data["InvoiceDurationStartDate"])) {
            errors[id] = "End Date can not be less than Start Date.";
            this.setState({ errors });
            return;
        } else {
            if (errors["InvoiceDurationStartDate"]) delete errors["InvoiceDurationStartDate"];
            if (errors["InvoiceDurationEndDate"]) delete errors["InvoiceDurationEndDate"];
        }
        data[id] = value;
        this.setState({ data });
        this.handleFilterChange();
    };
    changePendingCheckbox = (e, record) => {
        let { SelectedBookingToInvoice, data } = this.state;
        let selectedRecordIndex = SelectedBookingToInvoice.result.indexOf(record);
        SelectedBookingToInvoice.result[selectedRecordIndex]["IsPending"] = e.target.checked;
        data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
        this.setState({ SelectedBookingToInvoice, data });
    }
    changesupplierReconciledAmout = (e, record) => {
        let { SelectedBookingToInvoice, data } = this.state;
        let selectedRecordIndex = SelectedBookingToInvoice.result.indexOf(record);
        SelectedBookingToInvoice.result[selectedRecordIndex]["supplierReconciledAmout"] = e.target.value;
        data.ReconcileAmount = this.calculateReconcileAmount(SelectedBookingToInvoice.result);
        this.setState({ SelectedBookingToInvoice, data });
    }
    RedirectToInvoiceList = () => {
        this.props.history.push(`/SupplierInvoices`);
    }
    render() {
        const { data, PendingInvoicedBooking, SelectedBookingToInvoice, supplierList, errors, commentHistory, mode, selectedTab, SavedRemovedBookings, isLoading, isEditModeLoading, showSuccessMessage } = this.state;
        const SelectedInvoicesId = SelectedBookingToInvoice.result.map((item) => { return item.itineraryDetailId });
        const { userInfo: { agentID } } = this.props;
        const pageInfoIndex = [{ item: PendingInvoicedBooking.pageInfo }];
        let agentSupplier = [];
        let tourwizSupplier = [];
        let supplierOptions = [];
        if (supplierList.length > 0) {
            agentSupplier = supplierList.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
            tourwizSupplier = supplierList.filter(x => x.isTourwizSupplier === 1).map(item => { return { label: item.fullName, value: item.providerId } });
            supplierOptions = [
                {
                    label: "Agent Supplier",
                    options: agentSupplier
                },
                {
                    label: "Tourwiz Supplier",
                    options: tourwizSupplier
                }
            ];
        }
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {mode === "add" ? "Add " : "Edit "}Supplier Invoice
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
                            {mode === "add" ? "Add " : "Edit "}Supplier Invoice
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        {isEditModeLoading &&
                            <div className="col-lg-8">
                                <div className="container ">
                                    <Loader />
                                </div>
                            </div>
                        }
                        {!isEditModeLoading &&
                            <div className="col-lg-9 ">
                                <div className="container ">
                                    {showSuccessMessage &&
                                        <MessageBar Message={`Supplier Invoice ${mode === "add" ? "added" : "updated"} successfully.`} handleClose={() => this.RedirectToInvoiceList()} />
                                    }
                                    <div className="row border mt-2">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group " + "business"}>
                                                <BusinessDropdown providerID={agentID} handleBusiness={this.handleBusiness} BusinessId={data.BusinessId} />
                                                {errors["BusinessId"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["BusinessId"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group " + "SupplierId"}>
                                                <label htmlFor={"SupplierId"}>{"Supplier *"}</label>
                                                <Select
                                                    placeholder="Select Supplier..."
                                                    id={"SupplierId"}
                                                    defaultValue={{
                                                        label: "Select",
                                                        value: "",
                                                    }}
                                                    value={supplierList.filter(x => x.providerId === parseInt(data.SupplierId)).map(item => { return { label: item.fullName, value: item.providerId } })}
                                                    options={supplierOptions}
                                                    onChange={(e) => {
                                                        this.handleDataChange({ "target": { "name": "SupplierId", "value": e.value } });
                                                    }}
                                                    noOptionsMessage={() => "No supplier available"}
                                                    isLoading={this.state.isLoadingSupplier}
                                                />
                                                {errors["SupplierId"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["SupplierId"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group InvoiceNumber"}>
                                                <label htmlFor={"InvoiceNumber"}>{"Invoice Number *"}</label>

                                                <input
                                                    type="text"
                                                    name={"InvoiceNumber"}
                                                    id={"InvoiceNumber"}
                                                    value={data.InvoiceNumber}
                                                    className={"form-control " || (errors["InvoiceNumber"] && "error-bdr")}
                                                    onChange={(e) => this.handleDataChange(e)}
                                                />
                                                {errors["InvoiceNumber"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["InvoiceNumber"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderSingleDate(
                                                "InvoiceDate",
                                                Trans("Invoice Date *"),
                                                moment(),
                                                moment().add(-12, 'M')
                                            )}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <SingleDate
                                                type={"text"}
                                                name={"InvoiceDurationStartDate"}
                                                value={data["InvoiceDurationStartDate"]}
                                                label={"Invoice Duration Start Date *"}
                                                conditiondate={new Date().setFullYear(new Date().getFullYear() + 25)}
                                                onChange={({ currentTarget: input }, picker) => { this.handleDateChangeEvent(picker.startDate.format("YYYY-MM-DD"), "InvoiceDurationStartDate") }}
                                            />
                                            {errors["InvoiceDurationStartDate"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["InvoiceDurationStartDate"]}
                                                </small>
                                            )}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <SingleDate
                                                type={"text"}
                                                name={"InvoiceDurationEndDate"}
                                                value={data["InvoiceDurationEndDate"]}
                                                label={"Invoice Duration End Date *"}
                                                conditiondate={new Date().setFullYear(new Date().getFullYear() + 25)}
                                                onChange={({ currentTarget: input }, picker) => { this.handleDateChangeEvent(picker.startDate.format("YYYY-MM-DD"), "InvoiceDurationEndDate") }}
                                            />
                                            {errors["InvoiceDurationEndDate"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["InvoiceDurationEndDate"]}
                                                </small>
                                            )}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group InvoiceAmount">
                                                <label htmlFor="InvoiceAmount">Invoice Net Amount *</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div className="input-group-text">{data.InvoiceCurrencyCode}</div>
                                                    </div>
                                                    <input type="text" disabled={true} name="InvoiceNetAmount" id="InvoiceNetAmount" className="form-control " value={parseFloat(data.InvoiceAmount ? data.InvoiceAmount : 0) + parseFloat(data.InvoiceTax1 ? data.InvoiceTax1 : 0) + (isNaN(data.ReconcileAmount - data.InvoiceAmount) ? 0 : data.ReconcileAmount - data.InvoiceAmount)} />
                                                </div>
                                                {errors["InvoiceCurrencyCode"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["InvoiceCurrencyCode"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderSingleDate(
                                                "DueDate",
                                                Trans("Invoice Due Date *"),
                                                moment(),
                                                moment().add(-12, 'M')
                                            )}
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            {this.renderTextarea(
                                                "Comment",
                                                Trans("Notes *")
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-lg-5 border  pr-0 pl-0">
                                            <div className="bg-light p-1">
                                                {mode === "add" &&
                                                    <b>Pending Bookings</b>
                                                }
                                                {mode === "edit" &&
                                                    <ul className="nav nav-tabs">
                                                        <li className="nav-item">
                                                            <button className={selectedTab === "PendingBookings" ? "nav-link active" : "nav-link"} type="button" onClick={() => { this.setState({ selectedTab: "PendingBookings" }) }}>Pending Bookings</button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button className={selectedTab === "SavedRemovedBookings" ? "nav-link active" : "nav-link"} type="button" onClick={() => { this.setState({ selectedTab: "SavedRemovedBookings" }) }}>Removed Bookings({SavedRemovedBookings.result.length})</button>
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                            <div className=" border-bottom pt-0 pb-2 ">
                                                {selectedTab === "PendingBookings" &&
                                                    <div className="table-responsive">
                                                        <table className="table small border-bottom">
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th><input type="checkbox" checked={this.isCheckAllPendingInvoicedBookings()} onChange={(e) => { this.checkAllPendingInvoicedBooking(e) }} /></th>
                                                                    <th >Booking Date</th>
                                                                    <th >Reference No.</th>
                                                                    <th >Booking Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {PendingInvoicedBooking.isLoading &&
                                                                    <TableLoading columns={4} />
                                                                }
                                                                {!PendingInvoicedBooking.isLoading
                                                                    && PendingInvoicedBooking.result
                                                                        .filter((param) => { return SelectedInvoicesId.indexOf(param.itineraryDetailId) < 0 })
                                                                        .map((item, key) => {
                                                                            return (
                                                                                <tr key={key}>
                                                                                    {item.supplierBookingAmount !== 0
                                                                                        ? <td>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={PendingInvoicedBooking.selectedRecordIds.indexOf(item.itineraryDetailId) > -1}
                                                                                                onChange={(e) => { this.selectPendingInvoicedBooking(e, item) }} />
                                                                                        </td>
                                                                                        : <td>&nbsp;</td>}
                                                                                    <td ><Datecomp date={item.bookingDate} /></td>
                                                                                    <td >{item.bookingRef}</td>
                                                                                    <td >{item.supplierBookingCurrency + " " + item.supplierBookingAmount}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                }
                                                                {!PendingInvoicedBooking.isLoading && PendingInvoicedBooking.result.filter((param) => { return SelectedInvoicesId.indexOf(param.itineraryDetailId) < 0 }).length === 0 && (
                                                                    <tr><td className="text-center" colSpan={4}>No Bookings to display.</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                        {!PendingInvoicedBooking.isLoading && PendingInvoicedBooking.result.length > 0 && (
                                                            <div className="hide-pageInfo pl-2 pr-2">
                                                                <Pagination
                                                                    pageInfoIndex={pageInfoIndex}
                                                                    handlePaginationResults={this.handlePaginationResults}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                {selectedTab === "SavedRemovedBookings" &&
                                                    <div className="table-responsive">
                                                        <table className="table small">
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th><input type="checkbox" checked={this.isCheckAllSavedRemovedBooking()} onChange={(e) => { this.checkAllSavedRemovedBooking(e) }} /></th>
                                                                    <th >Booking Date</th>
                                                                    <th >Reference No.</th>
                                                                    <th >Booking Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {SavedRemovedBookings.result.map((item, key) => {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td><input type="checkbox" checked={SavedRemovedBookings.selectedRecordIds.indexOf(item.itineraryDetailId) > -1} onChange={(e) => { this.selectSavedRemovedBooking(e, item) }} /></td>
                                                                            <td ><Datecomp date={item.bookingDate} /></td>
                                                                            <td >{item.bookingRef}</td>
                                                                            <td >{item.supplierBookingCurrency + " " + item.supplierBookingAmount}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                                }
                                                                {SavedRemovedBookings.result.length === 0 && (
                                                                    <tr><td className="text-center" colSpan={4}>No Bookings to display.</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-1 d-flex flex-column justify-content-center align-items-center">
                                            {selectedTab === "SavedRemovedBookings" &&
                                                <button className="btn btn-sm btn-primary m-1" onClick={this.AddSavedRemovedBookingToSelectedBooking}>{">"}</button>
                                            }
                                            {selectedTab === "PendingBookings" &&
                                                <button className="btn btn-sm btn-primary m-1" onClick={this.AddToSelectedBooking}>{">"}</button>
                                            }
                                            <button className="btn btn-sm btn-primary m-1" onClick={this.RemoveFromSelectedBooking}>{"<"}</button>
                                        </div>
                                        <div className="col-lg-6 border pr-0 pl-0">
                                            <div className="bg-light p-1">
                                                <b>Selected Bookings</b>
                                            </div>
                                            <div className="pt-0 pb-2 ">
                                                <div className="table-responsive">
                                                    <table className="table small">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th><input type="checkbox" checked={this.isCheckAllSelectedBooking()} onChange={(e) => { this.checkAllSelectedBooking(e) }} /></th>
                                                                <th >Booking Date</th>
                                                                <th >Reference No.</th>
                                                                <th >Booking Amount</th>
                                                                <th >Change Supplier Amount</th>
                                                                <th >Supplier Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {SelectedBookingToInvoice.isLoading &&
                                                                <TableLoading columns={6} />
                                                            }
                                                            {!SelectedBookingToInvoice.isLoading && SelectedBookingToInvoice.result.map((item, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td><input type="checkbox" checked={SelectedBookingToInvoice.selectedRecordIds.indexOf(item.itineraryDetailId) > -1} onChange={(e) => { this.selectBookingToInvoice(e, item) }} /></td>
                                                                        <td ><Datecomp date={item.bookingDate} /></td>
                                                                        <td style={{ wordBreak: "break-word" }}>{item.bookingRef}</td>
                                                                        <td >{item.supplierBookingCurrency + " " + item.supplierBookingAmount}</td>
                                                                        <td><input type="checkbox" checked={item.IsPending === true} onChange={(e) => { this.changePendingCheckbox(e, item) }} /></td>
                                                                        <td >
                                                                            {item.IsPending &&
                                                                                <div className="input-group input-group-sm">
                                                                                    <div className="input-group-prepend">
                                                                                        <div className="input-group-text">{item.supplierBookingCurrency}</div>
                                                                                    </div>
                                                                                    <input type="number" style={{ minWidth: "75px" }}
                                                                                        className="form-control"
                                                                                        value={item.supplierReconciledAmout}
                                                                                        onChange={(e) => { this.changesupplierReconciledAmout(e, item) }}></input>
                                                                                </div>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            }
                                                            {!SelectedBookingToInvoice.isLoading && SelectedBookingToInvoice.result.length === 0 && (
                                                                <tr><td className="text-center" colSpan={6}>Add Pending Bookings.</td></tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-lg-4">
                                            <div className="form-group DeficiatAmount">
                                                <label htmlFor="DeficiatAmount">Deficit Amount</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div className="input-group-text">{data.InvoiceCurrencyCode}</div>
                                                    </div>
                                                    <input type="text" disabled={true} name="DeficiatAmount" id="DeficiatAmount" className="form-control " value={isNaN(data.ReconcileAmount - data.InvoiceAmount) ? 0 : data.ReconcileAmount - data.InvoiceAmount} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group ReconcileAmount">
                                                <label htmlFor="ReconcileAmount">Reconcile Amount</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <div className="input-group-text">{data.InvoiceCurrencyCode}</div>
                                                    </div>
                                                    <input type="text" disabled={true} name="ReconcileAmount" id="ReconcileAmount" className="form-control " value={parseFloat(data.ReconcileAmount ? data.ReconcileAmount : 0)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            {errors["BRNList"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["BRNList"]}
                                                </small>
                                            )}
                                            {isLoading ?
                                                <button
                                                    className="btn btn-primary mr-2 float-right"
                                                    type="submit">
                                                    <span
                                                        className="spinner-border spinner-border-sm mr-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    {Trans("_save")}
                                                </button> :
                                                <button
                                                    className="btn btn-primary mr-2 float-right"
                                                    type="submit"
                                                    onClick={() => this.saveInvoiceClick()}
                                                > {Trans("_save")}
                                                </button>}

                                            <button
                                                className="btn btn-secondary mr-2 float-right"
                                                type="submit"
                                                onClick={() => this.RedirectToInvoiceList()}
                                            >
                                                {Trans("_cancel")}
                                            </button>
                                        </div>
                                    </div>
                                    {mode === "edit" &&

                                        <div className="row ">
                                            <div className="col-lg-12">
                                                <div className="p-1 text-primary">
                                                    <h4>Notes History</h4>
                                                </div>
                                                <div className="pt-0 border">
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead className="thead-light">
                                                                <tr className="d-flex">
                                                                    <th className="col-4">Date</th>
                                                                    <th className="col-8">Notes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {commentHistory.map((item) => {
                                                                    return (
                                                                        <tr className="d-flex">
                                                                            <td className="col-4"><Datecomp date={moment.utc(item.commentDate).local()} />{" " + moment.utc(item.commentDate).local().format("HH:mm:ss")}</td>
                                                                            <td className="col-8">{item.comment}</td>
                                                                        </tr>)
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div >
        )
    }
}
export default SupplierInvoice

