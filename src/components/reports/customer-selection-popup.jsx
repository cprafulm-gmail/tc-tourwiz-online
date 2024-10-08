import React, { Component } from 'react';
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader";
import Header from "./customerSelection-header";
import Pagination from "../../components/booking-management/booking-pagination"
export default class CustomerSelectionPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingForCustomer: "",
            customerSearch: "",
            results: [],
            filter: {
                customername: "",
                pagesize: 10
            },
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
        };
    }
    componentDidMount() {
        this.getCustomer({})
    }
    getCustomer() {
        this.setState({ isLoading: true });
        let data = { ...this.state.filter }
        let reqURL = "reconciliation/customer/list?createdfromdate=2020-01-01&createdtodate=2050-12-31&agentid=" + this.props.agentID
        reqURL = data["customername"] ? reqURL + "&customername=" + (data["customername"]) : reqURL
        reqURL = data["pagenumber"] ? reqURL + "&pagenumber=" + data["pagenumber"] : reqURL
        reqURL = data["pagesize"] ? reqURL + "&pagesize=" + data["pagesize"] : reqURL
        reqURL = data["sortby"] ? reqURL + "&sortby=" + data["sortby"] : reqURL
        reqURL = data["sortorder"] ? reqURL + "&sortorder=" + data["sortorder"] : reqURL
        reqURL = data["createdfromdate"] ? reqURL + "&createdfromdate=" + data["createdfromdate"] : reqURL
        reqURL = data["createdtodate"] ? reqURL + "&createdtodate=" + data["createdtodate"] : reqURL
        reqURL = data["emailid"] ? reqURL + "&emailid=" + data["emailid"] : reqURL
        let reqOBJ = {}
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (responseData) {
                let pageInfo = this.state.pageInfo;
                pageInfo["currentPage"] = responseData?.pageInfo?.page - 1
                pageInfo["pageLength"] = responseData?.pageInfo?.records
                pageInfo["hasNextPage"] = responseData?.pageInfo?.totalRecords > responseData?.pageInfo?.page * responseData?.pageInfo?.records
                pageInfo["hasPreviousPage"] = responseData?.pageInfo?.page > 1
                pageInfo["totalResults"] = responseData?.pageInfo?.totalRecords
                this.setState({ results: responseData.response, isLoading: false, pageInfo })
            }.bind(this),
            "GET"
        );
    }
    handlePaginationResults = (pageNumber, pageLength) => {
        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength
        this.setState({ filter }, () => { this.getCustomer() });
    }
    setCustomer = (data) => {
        let filter = this.state.filter;
        filter["customername"] = data.customername;
        filter["pagenumber"] = 0;
        this.setState({ filter }, () => { this.getCustomer() });
    }
    render() {
        let pageInfoIndex = [{ item: this.state.pageInfo }];
        const { isLoadingForCustomer } = this.state
        return (
            <div>
                <div className="model-popup call-center-selection">
                    <div className="modal fade show d-block">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-capitalize">
                                        Customer Selection
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={this.props.closePopup}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Header getCustomer={this.setCustomer.bind(this)} />
                                    {this.state.isLoading ? (<Loader />) : (<div className="border shadow-sm">
                                        <div className="table-responsive">
                                            <table className="table offline-booking-table">
                                                <thead>
                                                    <tr>
                                                        <th className="align-middle bg-light">#</th>
                                                        <th className="align-middle bg-light">Name</th>
                                                        <th className="align-middle bg-light">Contact No.</th>
                                                        <th className="align-middle bg-light">Address</th>
                                                        <th className="align-middle bg-light">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.results.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{data["rowNum"]}</td>
                                                                <td>{data["name"]}</td>
                                                                <td>{data["cellPhone"]}</td>
                                                                <td>{data["address1"]}</td>
                                                                <td>
                                                                    {!isLoadingForCustomer &&
                                                                        <button
                                                                            className="btn btn-sm btn-primary"
                                                                            onClick={() => {
                                                                                this.setState({ isLoadingForCustomer: data["customerID"] }, () => this.props.selectCustomer(data, 'fromSelection'));
                                                                            }}
                                                                        >Select</button>
                                                                    }
                                                                    {isLoadingForCustomer && data["customerID"] === isLoadingForCustomer &&
                                                                        < button
                                                                            className="btn btn-sm btn-primary"
                                                                        ><span className="spinner-border spinner-border-sm mr-2"></span>
                                                                            Select</button>
                                                                    }
                                                                    {isLoadingForCustomer && data["customerID"] !== isLoadingForCustomer &&
                                                                        < button
                                                                            className="btn btn-sm btn-primary"
                                                                        >Select</button>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    {!this.state.isLoading && this.state.results.length === 0 &&
                                                        <tr>
                                                            <td className="text-center" colSpan={5}>No records found.</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>

                                    )}
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12  report-pagination">
                                            {!this.state.isLoading && this.state.results.length > 0 && (
                                                <Pagination
                                                    pageInfoIndex={pageInfoIndex}
                                                    handlePaginationResults={this.handlePaginationResults.bind(this)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            </div>
        )
    }
}