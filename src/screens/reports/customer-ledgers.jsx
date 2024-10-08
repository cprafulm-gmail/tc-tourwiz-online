import React from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import Form from "../../components/common/form"
import Customerselection from "../../components/reports/customer-selection"
import { apiRequester_unified_api } from "../../services/requester-unified-api"
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/customer-ledger-filter"
import Details from "../../components/reports/customer-ledger-tablerow"
import * as Global from "../../helpers/global"
import QuotationMenu from "../../components/quotation/quotation-menu";
import ExcelIcon from "../../assets/images/reports/excel.png";
import XLSX from "xlsx";
import Datecomp from "../../helpers/date";
import Amount from "../../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import ModelPopup from '../../helpers/model';
import CustomerLedgerReceipt from '../customer-ledger-receipt';
import { Helmet } from "react-helmet";

class CustomerLedger extends Form {
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
                pagesize: 10,
                invoicenumber: null,
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD')
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
            customerData: sessionStorage.getItem("customer-info")
                && JSON.parse(sessionStorage.getItem("customer-info"))
                && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1
                ? JSON.parse(sessionStorage.getItem("customer-info"))
                : {},
            isViewReceiptDetails: [],
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
    getLedgers(isExcel) {
        let filter = { ...this.state.filter };
        if (!filter["customerid"]) {
            return;
        }
        let reqOBJ = {};
        if (isExcel) {
            filter["pagenumber"] = 0;
            filter["pagesize"] = 1000;
        }
        else
            this.setState({ isLoading: true })
        let reqURL = "reconciliation/customer/ledger?customerid=" + filter["customerid"]
        for (let key of Object.keys(filter)) {
            if (key != "customerid" && filter[key]) {
                reqURL = reqURL + `&${key}=${filter[key]}`
            }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (isExcel) {
                    this.ExportExcel(data);
                    return;
                }
                if (data.response.customerLedgerList.length > 0) {

                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.page - 1
                    pageInfo["pageLength"] = data?.pageInfo?.records
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.records
                    pageInfo["hasPreviousPage"] = data?.pageInfo?.page > 1
                    pageInfo["totalResults"] = data?.pageInfo?.totalRecords

                    this.setState({ creditPaymentDetials: data.response.creditPaymentDetials, gridData: data.response.customerLedgerList, pageInfo, isLoading: false })
                }
                else {
                    this.setState({ gridData: [], isLoading: false })
                }
            }.bind(this),
            "GET"
        );
    }
    ExportExcel = (data) => {
        if (!data || !data.response || !data.response.customerLedgerList || data.response.customerLedgerList.length === 0)
            return;
        let records = [];
        data.response.customerLedgerList.map((x) => {
            records.push({
                "Sr. No.": x.rowNum,
                "Customer Name": x.customerName,
                "Invoice Number": x.invoiceNumber,
                "Date": Datecomp({ date: x.invoiceDate }),
                "Business": x.business,
                "Total  Basic": Amount({ amount: x.totalBasic, currencyCode: x.bookingCurrency }),
                "Total Item Amount": Amount({ amount: x.totalItemAmount, currencyCode: x.bookingCurrency }),
                "Total Taxes": Amount({ amount: x.totalTaxes, currencyCode: x.bookingCurrency }),
                "Service Charges": Amount({ amount: x.serviceCharges, currencyCode: x.bookingCurrency }),
                "Discount": Amount({ amount: x.discount, currencyCode: x.bookingCurrency }),
                "Net Amount": Amount({ amount: x.netAmount, currencyCode: x.bookingCurrency }),
                "Paid Amount": Amount({ amount: x.paidAmount, currencyCode: x.bookingCurrency }),
                "Due Amount": Amount({ amount: x.dueAmount, currencyCode: x.bookingCurrency }),
                "Payment Date": Datecomp({ date: x.paymentDate }),
                "Payment Mode": x.paymentMode === "CreditCard" ? "Credit Card" : x.paymentMode === "DebitCard" ? "Debit Card" : x.paymentMode,
                "Cheque Date": x.paymentMode !== undefined && x.paymentMode === "Cheque" && x.chequeDate && x.chequeDate != "0001-01-01T00:00:00" ? Datecomp({ date: x.chequeDate }) : "--",
                "Cheque Number": x.paymentMode !== undefined && x.paymentMode === "Cheque" && x.chequeNumber ? x.chequeNumber : "--",
                "Bank Name": x.paymentMode !== undefined && (x.paymentMode === "Cheque" || x.paymentMode === "CreditCard" || x.paymentMode === "DebitCard") && x.bankName ? x.bankName : "--",
                "Branch": x.paymentMode !== undefined && x.paymentMode === "Cheque" && x.branchName ? x.branchName : "--",
                "Transaction No": x.transactionToken !== undefined && x.transactionToken !== "" ? x.transactionToken : "--",
                "Card Number": x.cardLastFourDigit !== undefined && x.cardLastFourDigit !== "" ? "xxxx-xxxx-xxxx-" + x.cardLastFourDigit : "--"
            });
        })

        const workbook1 = XLSX.utils.json_to_sheet(records);
        //const workbook2 = XLSX.utils.json_to_sheet(PaymentDetials);
        workbook1['!cols'] = [{ wpx: 40 }, { wpx: 80 }, { wpx: 125 }, { wpx: 90 }, { wpx: 90 }, { wpx: 200 }];
        //workbook2['!cols'] = [{ wpx: 80 }, { wpx: 100 }, { wpx: 90 }, { wpx: 90 }, { wpx: 80 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }];
        workbook1['!printHeader'] = [1, 1];
        //workbook2['!printHeader'] = [1, 1];
        const workbook = {
            SheetNames: ['Customer Ledgers'],
            Sheets: {
                'Customer Ledgers': workbook1
            }
        };
        return XLSX.writeFile(workbook, `CustomerLedger-${this.state.customer?.displayName ?? "NA"}.xlsx`);
    }
    ExcelDownload = () => {
        this.getLedgers(true);
    }
    selectCustomer = async (data) => {

        let filter = this.state.filter
        filter["customerid"] = data["customerID"]
        this.setState({ customerData: data, customerName: data["firstName"], filter })
        this.getLedgers();
    }
    resetCustomer = () => {
        this.setState({
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            customerData: {},
            isViewReceiptDetails: [],
            data: {
                customer: {},
                customerName: ""
            },
            filter: {
                customerid: null,
                pagenumber: null,
                pagesize: 10,
                invoicenumber: null,
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD')
            },
            gridData: [],
            isLoading: false,
            creditPaymentDetials: null
        }, () => this.state.isFilters && this.refFilterSection.current.handleResetFilters())
    }
    componentDidMount() {
        if (sessionStorage.getItem("customer-info")) {
            let data = JSON.parse(sessionStorage.getItem("customer-info"));
            if (Object.keys(data).length > 1) {
                let filter = this.state.filter
                filter["customerid"] = data["customerID"]
                this.setState({ customerData: data, customer: data, customerName: data.displayName ? data.displayName : data.firstName + (data.lasName ? " " + data.lasName : ""), filter })
                this.getLedgers();
            }
        }
    }
    handleFilters(data) {
        let filter = this.state.filter

        filter["fromdate"] = data["fromdate"] ?
            moment(new Date(data["fromdate"])).format(Global.DateFormate) : null;
        filter["todate"] = data["todate"] ?
            moment(new Date(data["todate"])).format(Global.DateFormate) : null;
        filter["invoicenumber"] = data["invoicenumber"] ? data["invoicenumber"] : null;

        this.setState({ filter })
        this.getLedgers()
    }
    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength

        this.setState({ filter })
        this.getLedgers()

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
    getReceiptDetails = (paymentHistory) => {
        this.setState({ isViewReceipt: true, isViewReceiptDetails: paymentHistory })
    }
    handleHidePopup = () => {
        this.setState({
            isViewReceipt: !this.state.isViewReceipt,
        });
    };
    render() {
        let pageInfoIndex = [{ item: this.state.pageInfo }];
        const { customerData, isViewReceiptDetails } = this.state;
        const { userInfo: { agentID } } = this.props;
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Customer Ledger
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
                            Customer Ledger
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
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 mb-2 ml-1">
                                        <Customerselection
                                            key={JSON.stringify(customerData)}
                                            agentID={agentID}
                                            customerData={customerData}
                                            selectCustomer={this.selectCustomer.bind(this)}
                                            resetCustomer={this.resetCustomer.bind(this)}
                                        />
                                    </div>
                                </div>
                                {this.state.isFilters && (
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12 mb-2">
                                            <Filters
                                                ref={this.refFilterSection}
                                                handleFilters={this.handleFilters.bind(this)}
                                                showHideFilters={this.showHideFilters}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="row">
                                    {!this.state.isLoading && this.state.gridData.length > 0 &&
                                        <div class="col-lg-12">
                                            <AuthorizeComponent title="dashboard-menu~reconciliation-customer-ledger" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                                {this.state.gridData &&
                                                    this.state.gridData.length > 0 &&
                                                    (<a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~reconciliation-customer-ledger") ? this.ExcelDownload() : this.setState({ isshowauthorizepopup: true }) }} className=" float-right  m-2">
                                                        <img title="Download Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                                    </a>)
                                                }
                                            </AuthorizeComponent>
                                            <span class=" float-right m-2 hide-notes">Balance :&nbsp;
                                                <b>
                                                    <Amount amount={this.state.gridData[0].balance < 0 ? (this.state.gridData[0].balance * -1) : this.state.gridData[0].balance} />{this.state.gridData[0].balance > 0 ? " Cr " : " Dr "}
                                                </b>
                                            </span>
                                        </div>
                                    }
                                    <div className="col-sm-12 col-md-12 col-lg-12">
                                        <div className="table-responsive">
                                            <table className="table border small table-column-width">
                                                <thead className="thead-light">
                                                    <tr>
                                                        {["#", "Customer Name", "Ref. Number", "Type", "Date", "Business", "Total  Basic", "Total Item Amount",
                                                            "Total Taxes", "Service Charges", "Discount", "Net Amount", "Paid Amount", "Due Amount", "Payment Date", "Payment Mode",
                                                            "Cheque Date", "Cheque Number, Bank Name, Branch", "Transaction No", "Card Number", "Receipt"
                                                        ].map((data, index) => {
                                                            return (<th width={table_column_width[data]} key={index} scope="col">{data}</th>)
                                                        })}

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.isLoading && (<TableLoading columns={20} />)}
                                                    {
                                                        !this.state.isLoading && this.state.gridData.map((data, index) => {
                                                            return (
                                                                <Details
                                                                    creditPaymentDetials={this.state.creditPaymentDetials}
                                                                    data={data}
                                                                    index={index}
                                                                    userInfo={this.props.userInfo}
                                                                    getReceiptDetails={this.getReceiptDetails}
                                                                />
                                                            )
                                                        })}
                                                    {
                                                        !this.state.isLoading && this.state.gridData.length === 0 &&
                                                        <tr><td colSpan={9} className="text-center">No record found.</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {!this.state.isLoading && this.state.gridData.length > 0 &&
                                    <div className="row hide-notes">
                                        <div class="col-lg-12">
                                            <span class=" float-right  m-2">Balance :&nbsp;
                                                <b>
                                                    <Amount amount={this.state.gridData[0].balance < 0 ? (this.state.gridData[0].balance * -1) : this.state.gridData[0].balance} />{this.state.gridData[0].balance > 0 ? " Cr " : " Dr "}
                                                </b>
                                            </span>
                                        </div>
                                    </div>
                                }
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12  report-pagination">
                                        {!this.state.isLoading && this.state.gridData.length > 0 && (
                                            <Pagination
                                                pageInfoIndex={pageInfoIndex}
                                                handlePaginationResults={this.handlePaginationResults.bind(this)}
                                            />
                                        )}
                                    </div>
                                </div>
                                {this.state.isshowauthorizepopup &&
                                    <ModelPopupAuthorize
                                        header={""}
                                        content={""}
                                        handleHide={this.hideauthorizepopup}
                                        history={this.props.history}
                                    />
                                }
                                {
                                    this.state.isViewReceipt &&
                                    <ModelPopup
                                        header="Payment Receipt"
                                        content={<CustomerLedgerReceipt
                                            {...this.props}
                                            {...this.state}
                                            paymenthistory={isViewReceiptDetails}
                                        />}
                                        sizeClass="modal-dialog modal-lg modal-dialog-centered"
                                        handleHide={this.handleHidePopup}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const table_column_width = {
    "#": 50,
    "Customer Name": 150,
    "Ref. Number": 125,
    "Date": 80,
    "Business": 100,
    "Total  Basic": 120,
    "Total Item Amount": 120,
    "Total Taxes": 100,
    "Service Charges": 120,
    "Discount": 100,
    "Net Amount": 120,
    "Paid Amount": 120,
    "Due Amount": 120,
    "Payment Date": 80,
    "Payment Mode": 100,
    "Cheque Date": 80,
    "Cheque Number, Bank Name, Branch": 150,
    "Card Number": 150,
    "Transaction No": 150,
    "Receipt": 100,
    "Type": 150,
}

export default CustomerLedger
