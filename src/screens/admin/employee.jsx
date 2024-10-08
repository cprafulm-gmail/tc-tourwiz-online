import React, { Component } from 'react'
import "bootstrap-daterangepicker/daterangepicker.css";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/admin/employee-filtes";
import QuotationMenu from "../../components/quotation/quotation-menu";
import DownloadIcon from "../../assets/images/reports/download.png";
import DownLoadExcel from "../../components/admin/employee-excel"
import ManageEmployee from "../../assets/images/dashboard/manage-employee.png";
import DeleteConfirmation from "../../components/admin/delete-confirmation-dialog";
import MessageBar from '../../components/admin/message-bar';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import * as GlobalEvents from "../../helpers/global-events";
import ModelLimitExceeded from "../../helpers/modelforlimitexceeded";
import { Helmet } from "react-helmet";

class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            filter: {
                PageNumber: 1,
                PageSize: 10,
                CrewName: "",
                FirstName: "",
                LastName: "",
                CellPhone: "",
                EmailId: "",
                CityName: "",
                CrewNatureID: "",
                IsActive: true,
                ClassName: ""
            },
            result: [],
            pageInfo: {
                currentPage: 0,
                pageLength: 10,
                hasNextPage: false,
                hasPreviousPage: false,
                totalResults: 0
            },
            isExportToExcel: false,
            ExportData: [],
            isshowauthorizepopup: false,
            isSubscriptionPlanend: false,
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    hidelimitpopup = () => {
        this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
    }

    componentDidMount() {
        this.getEmployees();
    }
    getEmployees(isExport) {
        let reqOBJ = { Request: { ...this.state.filter } };
        let reqURL = "admin/employee/list";
        if (!isExport) {
            this.setState({ isLoading: true });
        }
        else {
            reqOBJ["Request"]["PageNumber"] = 0;
            reqOBJ["Request"]["PageSize"] = 0;
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.error) {
                    data.response = [];
                }
                if (isExport) {
                    this.setState({ ExportData: data.response.filter(x => x.crewNatureID !== 3), isExportToExcel: true });
                } else if (data.response.length > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data?.pageInfo?.pageNumber - 1
                    pageInfo["pageLength"] = data?.pageInfo?.pageSize
                    pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.pageNumber * data?.pageInfo?.pageSize
                    pageInfo["hasPreviousPage"] = data?.pageInfo?.pageNumber > 1
                    pageInfo["totalResults"] = data?.pageInfo?.totalRecords - 1
                    this.setState({ result: data.response.filter(x => x.crewNatureID !== 3), pageInfo, isLoading: false })
                }
                else {
                    this.setState({ result: [], isLoading: false })
                }
            }.bind(this),
            "POST"
        );
    }
    handleFilters(data) {
        let filter = { ...this.state.filter, ...data };
        filter["PageNumber"] = 1;
        this.setState({ filter }, () => { this.getEmployees(); });

    }
    handlePaginationResults(pageNumber, pageLength) {
        let filter = this.state.filter;
        filter["PageNumber"] = parseInt(pageNumber) + 1;
        filter["PageSize"] = pageLength;
        this.setState({ filter }, () => { this.getEmployees(); });
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
    export = () => {
        this.getEmployees(true);
    }
    onExcelExportComplete = () => {
        this.setState({ ExportData: [], isExportToExcel: false })
    }
    redirectToEmployeeForm = (type, crewId) => {
        this.props.history.push(`/Employee/${type}${crewId ? "/" + crewId : ""}`);
    }
    changePassword = (userID) => {
        this.props.history.push({
            pathname: '/ChangePassword',
            UserId: userID
        });
    }
    editEmployee = (data) => {
        if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-editemployee")) { this.redirectToEmployeeForm("Edit", data.crewId) }
        else { this.setState({ isshowauthorizepopup: true }) }
    }

    confirmDeleteEmployee = (crewid) => {
        this.setState({ crewId: crewid });
    }
    deleteEmployee = (crewId) => {
        let reqURL = "admin/employee/delete";
        let reqOBJ = {
            Request: {
                CrewID: crewId
            }
        };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata.error) {
                    alert(resonsedata.error);
                } else {
                    this.setState({ crewId: null, showSuccessMessage: true });
                    this.getEmployees();
                }
            }.bind(this),
            "POST"
        );
    }
    render() {
        const { userInfo: { agentID } } = this.props;
        const { pageInfo, isLoading, result, isExportToExcel, ExportData, crewId, showSuccessMessage } = this.state
        let pageInfoIndex = [{ item: pageInfo }];


        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Employees
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <img width="24" className="mr-3"
                                height="24" src={ManageEmployee} alt="" />
                            Employees
                        </h1>
                    </div>
                </div>
                <div className="container">
                    {showSuccessMessage &&
                        <MessageBar Message={`Employee deleted successfully.`} handleClose={() => { this.setState({ showSuccessMessage: null }) }} />
                    }
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 mb-2 mt-2">
                                    <Filters
                                        agentID={agentID}
                                        handleFilters={this.handleFilters.bind(this)}
                                        data={this.state.filter}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <AuthorizeComponent title="EmployeeList~agentsettings-addemployee" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                        <button onClick={() => { !GlobalEvents.handleCheckforFreeExcess(this.props, "EmployeeList~agentsettings-addemployee") ? this.setState({ isSubscriptionPlanend: true }) : AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-addemployee") ? this.redirectToEmployeeForm("Add", null) : this.setState({ isshowauthorizepopup: true }) }} className="btn btn-primary  mb-2">Add Employee</button>
                                    </AuthorizeComponent>
                                    <AuthorizeComponent title="EmployeeList~agentsettings-exportemployee" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                        {result &&
                                            result.length > 0 &&
                                            (<a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-exportemployee") ? this.export() : this.setState({ isshowauthorizepopup: true }) }} className=" float-right  m-2">
                                                <img style={{ cursor: "pointer" }} height={20} src={DownloadIcon} />
                                            </a>)
                                            // <button onClick={() => { this.handleExcelDownload() }} className="btn btn-primary float-right  mb-2">Download</button>
                                        }
                                    </AuthorizeComponent>
                                </div>
                                <div className="container col-lg-12">
                                    <div className="table-responsive-lg">
                                        <table className="table border">
                                            <thead className="thead-light">
                                                <tr>
                                                    {["First Name", "Last Name", "Email Address",
                                                        "Phone Number", "Actions"
                                                    ].map((data, key) => {
                                                        return (<th key={key} scope="col">{data}</th>)
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading && (<TableLoading columns={5} />)}
                                                {
                                                    !isLoading && result &&
                                                    result.length > 0 && result.map((data, key) => {
                                                        return (<tr key={key}>
                                                            <td onClick={() => this.editEmployee(data)} style={{ cursor: "pointer" }}>{data.firstName}</td>
                                                            <td onClick={() => this.editEmployee(data)} style={{ cursor: "pointer" }}>{data.lastName}</td>
                                                            <td onClick={() => this.editEmployee(data)} style={{ cursor: "pointer" }}>{data.email}</td>
                                                            <td onClick={() => this.editEmployee(data)} style={{ cursor: "pointer" }}>{data.cellPhone}</td>
                                                            {/* <td>{data.cityName}</td> */}
                                                            {/* <td>{data.isActive}</td> */}
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
                                                                            {/* {data.userID && <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => this.changePassword(data.userID)} >Change Password</button></li>} */}
                                                                            <AuthorizeComponent title="dashboard-menu~agentsettings-employees" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-exportemployee") ? this.redirectToEmployeeForm("View", data.crewId) : this.setState({ isshowauthorizepopup: true }) }}>View</button></li>
                                                                            </AuthorizeComponent>
                                                                            <AuthorizeComponent title="EmployeeList~agentsettings-editemployee" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                                                                <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => this.editEmployee(data)}>Edit</button></li>
                                                                            </AuthorizeComponent>
                                                                            {/* {!data.userID && <li><button type="button" className="btn btn-sm text-nowrap w-100 text-left" onClick={() => this.confirmDeleteEmployee(data.crewId)}>Delete</button></li>} */}
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
                                                        <td className="text-center" colSpan={7}>No records found.</td>
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
                            {crewId && <DeleteConfirmation
                                handleClose={() => {
                                    this.setState({ crewId: null });
                                }}
                                handleDelete={() => { this.deleteEmployee(crewId) }}
                            />}
                            {isExportToExcel &&
                                (<DownLoadExcel onExportComplete={() => { this.onExcelExportComplete() }} data={ExportData} filename={"employee-list"} />)}
                            {this.state.isshowauthorizepopup &&
                                <ModelPopupAuthorize
                                    header={""}
                                    content={""}
                                    handleHide={this.hideauthorizepopup}
                                    history={this.props.history}
                                />
                            }
                            {
                                this.state.isSubscriptionPlanend &&
                                <ModelLimitExceeded
                                    header={"Plan Limitations Exceeded"}
                                    content={"The maximum recommended plan has been exceeded"}
                                    handleHide={this.hidelimitpopup}
                                    history={this.props.history}
                                />
                            }
                        </div>
                    </div >
                </div>
            </div >
        )


    }
}

export default Employees
