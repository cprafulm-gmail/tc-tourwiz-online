import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import TableLoading from "../../components/loading/table-loading"
import Pagination from "../../components/booking-management/booking-pagination"
import Filters from "../../components/admin/category-filters"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import DeleteConfirmation from "../../components/admin/delete-confirmation-dialog"
import Modal from "../../components/admin/category-add-update-modal"
import MessageBar from "../../components/admin/message-bar"

class CategoryManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddInvoice: false,
            isLoading: false,
            filter: {
                pagenumber: 1,
                pagesize: 10,
                type: "agent"
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
            deleteIndex: false,
            popup: null,
            showMessage: false
        };
    }

    componentDidMount() {
        this.getCategory()
    }

    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength

        this.setState({ filter }, () => { this.getCategory() })

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

    handleFilters(data) {
        let filter = this.state.filter
        for (let key of Object.keys(data)) {
            filter[key] = data[key]
        }
        filter["pagenumber"] = 1;
        this.setState({ filter }, () => { this.getCategory(); });

    }

    getCategory() {
        this.setState({ isLoading: true })
        const { userInfo: { agentID } } = this.props;
        let filter = this.state.filter
        let reqOBJ = {}

        let reqURL = "admin/class/list?"
        for (let key of Object.keys(filter)) {
            // if (!(key === "invoicereconciliationstatus" && filter[key] === "All")) {
            reqURL = reqURL + `&${key}=${filter[key]}`
            //   }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.page - 1
                    pageInfo["pageLength"] = data?.pageInfo?.pageSize
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.pageSize
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

    handleDelete() {
        //admin/class/delete
        this.setState({ deleteIndex: null })
        let reqOBJ = {
            request: {
                ClassId: this.state.deleteIndex,
                Type: this.state.filter.type
            }
        }

        let reqURL = "admin/class/delete"
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.handleClose()
                this.getCategory()
                this.setState({ showMessage: "deleted" })
            }.bind(this),
            "POST"
        );
    }

    handleClose() {
        this.setState({ deleteIndex: null })
    }

    render() {
        const { userInfo: { agentID } } = this.props;
        const {
            pageInfo, isLoading, gridData, popup, showMessage
        } = this.state
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
                            Category Management
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} />
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 mb-2 mt-2">
                                    <Filters
                                        agentID={agentID}
                                        handleFilters={this.handleFilters.bind(this)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <button onClick={() => { this.setState({ popup: { type: "Add" } }) }}
                                        className="btn btn-primary  mb-2">Add Category
                                    </button>
                                </div>
                                <div className="container col-lg-12">
                                    <div className="table-responsive-lg">
                                        <table className="table border">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["Category Name", "Description",
                                                        "Type",
                                                        "Active", "Actions"
                                                    ].map((data, key) => {
                                                        return (
                                                            <th key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.isLoading && (<TableLoading columns={5} />)}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length > 0 &&
                                                    this.state.gridData.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{data.categoryName}</td>
                                                                <td>{data.categoryDescription}</td>
                                                                <td>{this.state.filter.type === "agent" ? "Agent" : "Customer"}</td>
                                                                <td>{data.isActive ? "Yes" : "No"}</td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-primary m-1"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                popup:
                                                                                    { type: "Update", classID: data.classID, categoryType: this.state.filter.type }
                                                                            })
                                                                        }}>
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { this.setState({ deleteIndex: data.classID }) }}
                                                                        className="btn btn-sm btn-primary m-1">
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>)
                                                    })}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={5}>No records found.</td>
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
                                {this.state.deleteIndex && <DeleteConfirmation
                                    handleClose={() => {
                                        this.handleClose()
                                    }}
                                    handleDelete={() => { this.handleDelete() }}
                                />}
                                {this.state.popup && <>
                                    <Modal
                                        agentId={agentID}
                                        getCategory={this.getCategory.bind(this)}
                                        handleClose={(val) => {
                                            let x = this.state.popup

                                            this.setState({ popup: null, showMessage: val ? x.type === "Add" ? "added" : "updated" : false })
                                        }} popup={popup} />
                                </>}
                            </div>
                            {showMessage && <MessageBar
                                Message={`Category ${showMessage} successfully.`}
                                handleClose={() => { this.setState({ showMessage: false }) }}
                            />}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default CategoryManagement
