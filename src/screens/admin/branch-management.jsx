import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import TableLoading from "../../components/loading/table-loading"
import Pagination from "../../components/booking-management/booking-pagination"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Modal from "../../components/admin/branch-add-update-modal"
import DeleteConfirmation from "../../components/admin/delete-confirmation-dialog"
import Filters from "../../components/admin/branch-filters"
import MessageBar from "../../components/admin/message-bar"

class BranchManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            filter: {
                providerBranchID: null,
                CityId: 0,
                CountryId: 0,
                BranchName: "",
                ContactPerson: "",
                PageNumber: 1,
                PageSize: 10
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
            popup: null,
            deleteData: null,
            showMessage: false
        };
    }


    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        filter["PageNumber"] = parseInt(pageNumber) + 1
        filter["PageSize"] = pageLength

        this.setState({ filter })
        this.getBranch()
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

    componentDidMount() {
        this.getBranch()
    }

    getBranch = () => {
        this.setState({ isLoading: true })
        const { userInfo: { agentID, defaultBranchID } } = this.props;
        let filter = this.state.filter
        let reqOBJ = {
            Request: {
                // 2892,
                providerBranchID: defaultBranchID ? defaultBranchID : 0,
                // 2942,
                ...filter
            }
        }

        let reqURL = "admin/branch/list"

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response && data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.pageNumber - 1
                    pageInfo["pageLength"] = data?.pageInfo?.pageSize
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.pageNumber * data?.pageInfo?.pageSize
                    pageInfo["hasPreviousPage"] = data?.pageInfo?.pageNumber > 1
                    pageInfo["totalResults"] = data?.pageInfo?.totalRecords

                    this.setState({ gridData: data.response, pageInfo, isLoading: false })
                }
                else {
                    this.setState({ gridData: [], isLoading: false })
                }
            }.bind(this),
            "POST"
        );
    }

    handleDelete = (value) => {
        let reqOBJ = {
            request: {
                ProviderBranchID: value
            }
        }
        let reqURL = "admin/branch/delete"

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({ showMessage: "Deleted" })
                this.getBranch();
            }.bind(this),
            "POST"
        );
    }

    handleFilters = (data) => {
        let filter = this.state.filter

        for (let key of Object.keys(data)) {
            filter[key] = data[key]
        }

        this.setState({ filter }, () => {
            this.getBranch()
        })
    }

    render() {

        const { userInfo: { agentID } } = this.props;
        const {
            pageInfo, isLoading, gridData,
            popup, showMessage
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
                            Branch Management
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
                                        handleFilters={(data) => { this.handleFilters(data) }}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <button onClick={() => {
                                        this.setState({ popup: { type: "Add", agentID } })
                                    }} className="btn btn-primary  mb-2">Add Branch</button>
                                </div>
                                <div className="container col-lg-12">
                                    <div className="table-responsive-lg">
                                        <table className="table border">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["Name", "Address",
                                                        "City",
                                                        "Phone Number", "Contact Person",
                                                        "Actions"
                                                    ].map((data, key) => {
                                                        return (
                                                            <th key={key} scope="col">{data}</th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.isLoading && (<TableLoading columns={6} />)}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length > 0 && this.state.gridData.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{data.name}</td>
                                                                <td>{data.address1 + (data.address2 ? (", " + data.address2) : "")}</td>
                                                                <td>{data.cityName}</td>
                                                                <td>{data.phone1}</td>
                                                                <td>{data.contactPerson}</td>
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

                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left"
                                                                                    onClick={() => { this.setState({ popup: { type: "View", agentID, data, disable: true } }) }} >View Branch</button></li>
                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left"
                                                                                    onClick={() => { this.setState({ popup: { type: "Update", agentID, data } }) }}>Edit Branch</button></li>
                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left"
                                                                                    onClick={() => { this.setState({ deleteData: data["providerBranchID"] }) }}>Delete Branch</button></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                {
                                                    !this.state.isLoading && this.state.gridData &&
                                                    this.state.gridData.length === 0 &&
                                                    <tr>
                                                        <td className="text-center" colSpan={7}>No records found.</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {this.state.deleteData &&
                                    <>
                                        <DeleteConfirmation
                                            handleDelete={() => { this.handleDelete(this.state.deleteData); this.setState({ deleteData: null }) }}
                                            handleClose={() => { this.setState({ deleteData: null }) }}
                                        />
                                    </>}

                                <div className="col-lg-12 report-pagination">
                                    {!isLoading && (gridData &&
                                        gridData.length > 0) && (
                                            <Pagination
                                                pageInfoIndex={pageInfoIndex}
                                                handlePaginationResults={this.handlePaginationResults.bind(this)}
                                            />
                                        )}
                                </div>
                                {showMessage && <MessageBar
                                    Message={`Branch ${showMessage} successfully.`}
                                    handleClose={() => { this.setState({ showMessage: false }) }}
                                />}
                            </div>
                            {popup &&
                                <Modal
                                    getBranch={() => { this.getBranch() }}
                                    popup={popup}
                                    handleClose={(val) => {
                                        let x = this.state.popup;
                                        this.setState({ popup: null, showMessage: val ? x.type === "Add" ? "Added" : "Updated" : null })
                                    }}
                                />
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default BranchManagement
