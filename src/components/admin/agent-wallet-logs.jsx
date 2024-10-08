import React, { Component } from 'react'
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import TableLoading from "../../components/loading/table-loading";
import Pagination from "../../components/booking-management/booking-pagination"
import moment from "moment";
import SingleDate from "../common/form-birthdate";
import Datecomp from "./../../helpers/date";

export class WalletLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            filter: {
                AgentId: this.props.AgentId,
                PageNumber: 1,
                PageSize: 10,
                FromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                ToDate: moment().format('YYYY-MM-DD'),
            },
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            errors: {},

        };
    }
    componentDidMount() {
        this.getWalletLogs();
    }
    getWalletLogs = () => {
        this.setState({ isLoading: true });
        let reqURL = "admin/agent/transaction/log";
        const { filter } = this.state;
        const reqOBJ = { request: filter };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.error) {
                    data.response = [];
                }
                if (data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.pageNumber - 1
                    pageInfo["pageLength"] = data?.pageInfo?.pageSize
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.pageNumber * data?.pageInfo?.pageSize
                    pageInfo["hasPreviousPage"] = data?.pageInfo?.pageNumber > 1
                    pageInfo["totalResults"] = data?.pageInfo?.totalRecords
                    this.setState({ result: data.response, pageInfo, isLoading: false })
                }
                else {
                    this.setState({ result: [], isLoading: false });
                }
            }.bind(this),
            "POST"
        );
    }
    handleValueChange(value, id) {
        let { filter } = this.state;
        let errors = {};
        if (id === "FromDate" && new Date(value) > new Date(filter["ToDate"])) {
            errors["FromDate"] = "From Date can not be greater To End Date.";
            this.setState({ errors });
            return;
        }
        else if (id === "ToDate" && new Date(value) < new Date(filter["FromDate"])) {
            errors["ToDate"] = "To Date can not be less than From Date.";
            this.setState({ errors });
            return;
        } else {
            if (errors["FromDate"]) delete errors["FromDate"];
            if (errors["ToDate"]) delete errors["ToDate"];
            this.setState({ errors });
        }
        filter[id] = value;
        filter["PageNumber"] = 1;
        this.setState({ filter }, () => { this.getWalletLogs(); })
    }
    handlePaginationResults(pageNumber, pageLength) {
        let filter = this.state.filter;
        filter["PageNumber"] = parseInt(pageNumber) + 1;
        filter["PageSize"] = pageLength;
        this.setState({ filter }, () => { this.getWalletLogs(); });
    }
    render() {
        const { isLoading, errors, filter, result, pageInfo } = this.state;
        const { AgencyName } = this.props;
        let pageInfoIndex = [{ item: pageInfo }];
        return (
            <div>
                <div>
                    <div className="model-popup">
                        <div className="modal fade show d-block">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-capitalize">
                                            Agent Wallet Transaction Log
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => { this.props.closePopup() }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body ">
                                        <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                            <h5 className="text-primary border-bottom pb-2 mb-2">
                                                Filters
                </h5>
                                            <div className="row mb-2">
                                                <div className="col-md-4">
                                                    <label htmlFor={"AgencyName"}>{"Agency Name"}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" value={AgencyName} disabled={true}></input>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <SingleDate
                                                        type={"text"}
                                                        name={"FromDate mb-1"}
                                                        value={filter["FromDate"]}
                                                        label={"Transaction From Date"}
                                                        onChange={({ currentTarget: input }, picker) => { this.handleValueChange(picker.startDate.format("YYYY-MM-DD"), "FromDate") }}
                                                    />
                                                    {errors["FromDate"] && (
                                                        <small className="alert alert-danger p-1 d-inline-block">
                                                            {errors["FromDate"]}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4">
                                                    <SingleDate
                                                        type={"text"}
                                                        name={"ToDate mb-1"}
                                                        value={filter["ToDate"]}
                                                        label={"Transaction To Date"}
                                                        onChange={({ currentTarget: input }, picker) => { this.handleValueChange(picker.startDate.format("YYYY-MM-DD"), "ToDate") }}

                                                    />
                                                    {errors["ToDate"] && (
                                                        <small className="alert alert-danger p-1 d-inline-block">
                                                            {errors["ToDate"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row small mt-2">
                                            <div className="container col-lg-12">
                                                <div className="table-responsive-lg">
                                                    <table className="table border">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                {["Payment Date", "Payment Type",
                                                                    "Reference Number", "Opening Balance", "Amount", "Comment"
                                                                ].map((data, key) => {
                                                                    return (<th key={key} scope="col">{data}</th>)
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {isLoading && (<TableLoading columns={6} />)}
                                                            {
                                                                !isLoading && result &&
                                                                result.length > 0 && result.map((data, key) => {
                                                                    return (<tr key={key}>
                                                                        <td><Datecomp date={data.paymentDt} /></td>
                                                                        <td>{data.transactionType}</td>
                                                                        <td>{data.receiptNo ? data.receiptNo : "---"}</td>
                                                                        <td>{data.openingBalance}</td>
                                                                        <td>{data.amount}</td>
                                                                        <td>{data.reason}</td>
                                                                    </tr>)
                                                                })}
                                                            {
                                                                !isLoading && result &&
                                                                result.length === 0 &&
                                                                <tr>
                                                                    <td className="text-center" colSpan={6}>No records found.</td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 report-pagination">
                                                {!isLoading && (result &&
                                                    result.length > 0) && (
                                                        <Pagination
                                                            pageInfoIndex={pageInfoIndex}
                                                            handlePaginationResults={this.handlePaginationResults.bind(this)}
                                                        />
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            name="Cancel"
                                            onClick={() => { this.props.closePopup() }}
                                            className="btn btn-secondary  float-left mr-2"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                </div>
            </div >
        )
    }
}

export default WalletLogs
