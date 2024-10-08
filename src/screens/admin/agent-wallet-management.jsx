import React, { Component } from 'react'
import "bootstrap-daterangepicker/daterangepicker.css";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading";
import Filters from "../../components/admin/agent-wallet-management-filtes";
import WalletTransaction from "../../components/admin/agent-wallet-transaction";
import WalletLogs from "../../components/admin/agent-wallet-logs";
import QuotationMenu from "../../components/quotation/quotation-menu";
import SVGIcon from "../../helpers/svg-icon";
class AgentWalletManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            filter: {
                ProviderID: this.props.userInfo.portalAgentID,
                PageNumber: 1,
                PageSize: 10,
                AgencyName: "",
                EmailId: "",
                PhoneNumber: "",
                CategoryId: ""
            },
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            CategoryList: [{ value: "", name: "Select" }],
            showTransaction: false,
            showLogs: false,
            AgentId: null
        };
    }

    componentDidMount() {
        this.getCategoryList()
        this.getAgentList();
    }
    getCategoryList = () => {
        const { userInfo: { agentID } } = this.props;
        let reqURL = `admin/class/list?providerid=${agentID}&type=agent&pagenumber=0&pagesize=0`;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                if (data.error) {
                    data.response = [];
                }
                if (data.response.length > 0) {
                    const CategoryList = [{ value: "", name: "Select" }].concat(data.response.map((item) => { return { value: item.classID, name: item.categoryName } }));
                    this.setState({ CategoryList })
                }
                else {
                    this.setState({ CategoryList: [{ value: "", name: "Select" }] })
                }
            }.bind(this),
            "GET"
        );
    }
    getAgentList() {
        let reqOBJ = { request: { ...this.state.filter } };
        let reqURL = "admin/agent/transaction";
        this.setState({ isLoading: true })
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
    handleFilters(data) {
        let filter = { ...this.state.filter, ...data };
        filter["PageNumber"] = 1;
        this.setState({ filter }, () => { this.getAgentList(); });

    }
    handlePaginationResults(pageNumber, pageLength) {
        let filter = this.state.filter;
        filter["PageNumber"] = parseInt(pageNumber) + 1;
        filter["PageSize"] = pageLength;
        this.setState({ filter }, () => { this.getAgentList(); });
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
    closePopup = (updateResult) => {
        this.setState({ AgentId: null, showLogs: false, showTransaction: false });
        if (updateResult) {
            this.getAgentList();
        }
    }
    showAgentLogs = (agentID, agencyName) => {
        this.setState({ AgentId: agentID, AgencyName: agencyName, showLogs: true });
    }
    showTransactionModal = (agentID) => {
        this.setState({ AgentId: agentID, showTransaction: true });
    }
    render() {
        const { userInfo: { portalAgentID, userID, providerCurrency: { factor } } } = this.props;
        const { pageInfo, isLoading, result, CategoryList, showTransaction, showLogs, AgentId, AgencyName } = this.state;
        let pageInfoIndex = [{ item: pageInfo }];
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
                            Agent Wallet Management
                        </h1>
                    </div>
                </div>
                <div className="container">
                    {showTransaction && (
                        <WalletTransaction ProviderId={portalAgentID} UserId={userID} ConversionFactor={factor} AgentId={AgentId} closePopup={this.closePopup} />
                    )}
                    {showLogs && (
                        <WalletLogs AgentId={AgentId} AgencyName={AgencyName} closePopup={() => { this.closePopup() }} />
                    )}

                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} />
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 mb-2 mt-2">
                                    <Filters
                                        handleFilters={this.handleFilters.bind(this)}
                                        data={this.state.filter}
                                        CategoryList={CategoryList}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="container col-lg-12">
                                    <div className="table-responsive-lg">
                                        <table className="table border">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["Agency Name", "Phone Number", "Email Address",
                                                        "Category", "Credit Amount", "Credit Balance", "Balance", "Actions"
                                                    ].map((data, key) => {
                                                        return (<th key={key} scope="col">{data}</th>)
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && (<TableLoading columns={8} />)}
                                                {
                                                    !isLoading && result &&
                                                    result.length > 0 && result.map((data, key) => {
                                                        return (<tr key={key}>
                                                            <td>{data.agencyName}</td>
                                                            <td>{data.phone}</td>
                                                            <td>{data.email}</td>
                                                            <td>{data.agentClassName}</td>
                                                            <td>{data.creditAmount}</td>
                                                            <td>{data.creditBalance}</td>
                                                            <td>{data.balance}</td>
                                                            <td>
                                                                <div className="custom-dropdown-btn position-relative">
                                                                    <button className="btn btn-sm bg-light border align-items-center d-flex justify-content-center">
                                                                        <div className="border-right pr-2">Actions</div>
                                                                        <i className="align-middle">
                                                                            <svg width="8" height="8" className="align-baseline ml-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284.929 284.929" xmlns="http://www.w3.org/1999/xlink"><g><path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441 L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082 c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647 c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"></path></g></svg>
                                                                        </i>
                                                                    </button>
                                                                    <div className="custom-dropdown-btn-menu position-absolute">
                                                                        <ul className="list-unstyled border bg-white shadow-sm p-2 rounded">
                                                                            <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => { this.showAgentLogs(data.agentID, data.agencyName) }}>Logs</button></li>
                                                                            <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => { this.showTransactionModal(data.agentID) }}>Transact</button></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>)
                                                    })}
                                                {
                                                    !isLoading && result &&
                                                    result.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={8}>No records found.</td>
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
                    </div >
                </div>
            </div >
        )


    }
}

export default AgentWalletManagement;
