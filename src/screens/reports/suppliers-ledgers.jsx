import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import { apiRequester_unified_api } from "../../services/requester-unified-api"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/supplier-ledger-filter"
import QuotationMenu from "../../components/quotation/quotation-menu";
import Datecomp from "../../helpers/date";
import moment from "moment"
import ExcelIcon from "../../assets/images/reports/excel.png";
import XLSX from "xlsx";
import Amount from "../../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

export class SupplierLedgers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilters: false,
            isLoading: false,
            filter: {
                businessid: null,
                supplierid: null,
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
                reconcillationstatus: null,
                pagenumber: null,
                pagesize: null
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
            currencyCode: "",
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
    }
    getLedgers() {
        this.setState({ isLoading: true })
        let reqOBJ = {}
        let filter = this.state.filter
        let reqURL = "reconciliation/supplier/ledger?businessid=" + filter["businessid"]
        reqURL = reqURL + "&usertype=" + this.props.userInfo.afUserType
        for (let key of Object.keys(filter)) {
            if (key != "businessid" && filter[key]) {
                reqURL = reqURL + `&${key}=${filter[key]}`
            }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (Array.isArray(data.response) && data.response.length > 0) {
                    this.setState({ gridData: data.response, isLoading: false })
                }
                else {
                    this.setState({ gridData: [], isLoading: false })
                }
            }.bind(this),
            "GET"
        );
    }
    handleFilters(data, currencyCode, supplierName) {
        let filter = this.state.filter

        for (let key of Object.keys(data)) {
            if (data[key]) {
                filter[key] = data[key]
            }
            else {
                filter[key] = ""
            }
            if (key === "supplierid") {
                let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))
                reportBusinessSupplier["supplierId"] = data[key]
                sessionStorage.setItem("reportBusinessSupplier", JSON.stringify(reportBusinessSupplier))
            }
        }

        this.setState({ filter, currencyCode, supplierName })
        this.getLedgers()
    }
    removeData() {
        this.setState({ gridData: [] });
    }
    ExcelDownload = () => {
        let gridData = [...this.state.gridData];
        const { currencyCode, supplierName } = this.state;
        let records = [];
        gridData.map((x, index) => {
            records.push({
                "Sr. No.": index + 1,
                "Transaction Date": Datecomp({ date: x.transactionDate }),
                "Invoice Number": x["invoiceNumber"],
                // "Payable Amount": x.payableAmount !== 0 ? currencyCode + " " + x.payableAmount : "",
                // "Paid Amount": x.paidAmount !== 0 ? currencyCode + " " + x.paidAmount : "",
                // "Particular": x.paymentMode
                //     + (x.transactionRefNumber ? " - " + x.transactionRefNumber : "")
                //     + (x.chequeNumber ? " - No.:" + x.chequeNumber : "")
                //     + (x.chequeDate ? ", Date:" + Datecomp({ date: x.chequeDate }) : "")
                //     + (x.chequeBank ? ", Bank:" + x.chequeBank : "")
                //     + (x.chequeBranch ? ", Branch:" + x.chequeBranch : "")
                "Total Invoice Amount": x.payableAmount === 0 ? "---" : Amount({ amount: x.payableAmount, currencyCode: currencyCode }),
                "Paid Amount": x.paidAmount === 0 ? "---" : Amount({ amount: x.paidAmount, currencyCode: currencyCode }),
                "Total Due Amount": Amount({ amount: x.dueAmount, currencyCode: currencyCode }),
                "Due Date": x.dueDate ? <Datecomp date={x.dueDate} /> : "---",
                "Status": x.invoiceReconciliationStatus,
                "Payment Mode": x.paymentMode === "CreditCard" ? "Credit Card" : x.paymentMode === "DebitCard" ? "Debit Card" : x.paymentMode,
                "Cheque Date": x.chequeDate ? <Datecomp date={x.chequeDate} /> : "---",
                "Cheque Number, Bank Name, Branch": x.paymentMode === "Cheque" ? x.chequeNumber + ", " + x.chequeBank + ", " + x.chequeBranch : (x.paymentMode === "CreditCard" || x.paymentMode === "DebitCard") ? x.chequeBank : "---",
                "Transaction No.": x.transactionRefNumber ? x.transactionRefNumber : "---",
                "Card Number": x.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + x.cardLastFourDigit : "---"
            });
        });
        const workbook1 = XLSX.utils.json_to_sheet(records);
        workbook1['!cols'] = [{ wpx: 40 }, { wpx: 80 }, { wpx: 125 }, { wpx: 100 }, { wpx: 100 }, { wpx: 200 }];
        workbook1['!printHeader'] = [1, 1];
        const workbook = {
            SheetNames: ['Supplier Ledgers'],
            Sheets: {
                'Supplier Ledgers': workbook1
            }
        };
        return XLSX.writeFile(workbook, `SupplierLedger-${supplierName}.xlsx`);
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
        let afUserType = this.props.userInfo.afUserType;
        const { gridData, isLoading, currencyCode, statusList } = this.state
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Supplier Ledger
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
                            Supplier Ledger
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            <Filters agentID={agentID} removeData={this.removeData.bind(this)} handleFilters={this.handleFilters.bind(this)} statusList={statusList} afUserType={afUserType} />
                            <div className="col-lg-12">
                                <AuthorizeComponent title="dashboard-menu~reconciliation-supplier-ledger" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                    {this.state.gridData &&
                                        this.state.gridData.length > 0 &&
                                        (<a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~reconciliation-supplier-ledger") ? this.ExcelDownload() : this.setState({ isshowauthorizepopup: true }) }} className=" float-right  m-2">
                                            <img title="Download Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                        </a>)
                                        // <button onClick={() => { this.handleExcelDownload() }} className="btn btn-primary float-right  mb-2">Download</button>
                                    }
                                </AuthorizeComponent>
                            </div>
                            <div className="table-responsive">
                                <table id="supplierLedger" className="table border table-column-width">
                                    <thead className="thead-light">
                                        <tr>
                                            {["#", "Transaction Date", "Invoice Number", "Total Invoice Amount",
                                                "Paid Amount", "Total Due Amount",
                                                "Due Date",
                                                "Status",
                                                "Payment Mode",
                                                "Cheque Date",
                                                "Cheque Number, Bank Name, Branch",
                                                "Transaction No.",
                                                "Card Number"
                                            ].map((data, index) => {
                                                return (<th width={table_column_width[data]} key={index} scope="col">{data}</th>);
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && (<TableLoading columns={12} />)}
                                        {
                                            !isLoading && gridData &&
                                            gridData.length > 0 && gridData.map((data, index) => {
                                                return (<tr>
                                                    <th scope="row">{index + 1}</th>
                                                    <td><Datecomp date={data.transactionDate} /></td>
                                                    <td style={{ "word-break": "break-word" }}>{data.invoiceNumber}</td>
                                                    <td>{data.payableAmount !== 0 ? <Amount amount={data.payableAmount} currencyCode={currencyCode} /> : "---"}</td>
                                                    <td>{data.paidAmount !== 0 ? <Amount amount={data.paidAmount} currencyCode={currencyCode} /> : "---"}</td>
                                                    <td><Amount amount={data.dueAmount} currencyCode={currencyCode} /></td>
                                                    <td>{data.dueDate ? <Datecomp date={data.dueDate} /> : "---"}</td>
                                                    <td>{data.invoiceReconciliationStatus}</td>
                                                    <td>{data.paymentMode === "CreditCard" ? "Credit Card" : data.paymentMode === "DebitCard" ? "Debit Card" : data.paymentMode}</td>
                                                    <td>{data.chequeDate ? <Datecomp date={data.chequeDate} /> : "---"} </td>
                                                    <td style={{ "word-break": "break-word" }}>{data.paymentMode === "Cheque" ? data.chequeNumber + ", " + data.chequeBank + ", " + data.chequeBranch : (data.paymentMode === "CreditCard" || data.paymentMode === "DebitCard") ? data.chequeBank : "---"}</td>
                                                    <td style={{ "word-break": "break-word" }}>{data.transactionRefNumber ? data.transactionRefNumber : "---"}</td>
                                                    <td style={{ "word-break": "break-word" }}>{data.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + data.cardLastFourDigit : "---"}</td>
                                                </tr>)
                                            })}
                                        {
                                            !isLoading && gridData &&
                                            gridData.length === 0 &&
                                            <tr>
                                                <td className="text-center" colSpan={8}>No records found.</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
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
                </div>
            </div>
        )
    }
}
const table_column_width = {
    "#": 30,
    "Transaction Date": 100,
    "Invoice Number": 150,
    "Total Invoice Amount": 150,
    "Paid Amount": 150,
    "Total Due Amount": 150,
    "Due Date": 150,
    "Status": 150,
    "Payment Mode": 100,
    "Cheque Date": 100,
    "Cheque Number, Bank Name, Branch": 200,
    "Transaction No.": 200,
    "Card Number": 200
}
export default SupplierLedgers
