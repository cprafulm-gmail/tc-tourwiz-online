import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import "bootstrap-daterangepicker/daterangepicker.css";
import { apiRequester_unified_api } from "../../services/requester-unified-api"
import Pagination from "../../components/booking-management/booking-pagination"
import TableLoading from "../../components/loading/table-loading"
import Filters from "../../components/reports/supplier-management-filter"
import QuotationMenu from "../../components/quotation/quotation-menu";
import Modal from "../../components/reports/supplier-add-edit-modal"
import DownLoadExcel from "../../components/reports/supplier-management-excel"
import ExcelIcon from "../../assets/images/reports/excel.png"
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";

export class SupplierManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFilters: false,
            isLoading: false,
            filter: {
                business: null,
                companyname: null,
                contactperson: null,
                email: null,
                phone: null,
                pagenumber: 1,
                pagesize: 10,
                isAgentSupplierOnly: true
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
            businessList: [],
            modalData: null,
            isDownloadExcel: false,
            exportData: [],
            isshowauthorizepopup: false,
        };
    }

    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    getBusinesses = () => {
        const { userInfo: { agentID } } = this.props;
        let reqURL = "reconciliation/supplier/business?providerid=" + agentID;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                var count = 0;
                data.response.forEach(function (e, a) {
                    if (e.businessType === "Air")
                        data.response[count].businessType = "Flight";
                    count = count + 1;
                });
                this.setState({ businessList: data.response }, () => { this.LoadSupplier() });
            }.bind(this),
            "GET"
        );
    }
    LoadSupplier = () => {
        if (sessionStorage.getItem("reportBusinessSupplier")) {
            const results = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"));
            const { userInfo: { agentID } } = this.props;
            if (results && results.providerID === agentID && results.businessID !== this.state.filter.businessID) {
                this.setState({ selectedValue: results.businessID, business: results.businessList });
                let { filter } = this.state;
                filter.business = results.businessID;
                this.setState({ filter }, () => { this.getSuppliers() });
            }
        }
    }
    componentDidMount() {
        this.getBusinesses();
    }

    getSuppliers(isExport) {
        const { userInfo: { agentID } } = this.props;
        let reqOBJ = {}
        let filter = this.state.filter
        if ((filter["business"] === "" || !filter["business"])) {
            return
        }
        if (isExport) {
            filter["pagesize"] = 0
            filter["pagenumber"] = 0
        }
        if (!isExport) { this.setState({ isLoading: true }) }

        let reqURL = "reconciliation/supplier/list?providerid=" + agentID
        for (let key of Object.keys(filter)) {
            if (key != "providerid" && filter[key]) {
                reqURL = reqURL + `&${key}=${filter[key]}`
            }
        }
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response && data.response.length > 0) {
                    if (!isExport) {
                        let pageInfo = this.state.pageInfo;
                        pageInfo["currentPage"] = data?.pageInfo?.page - 1
                        pageInfo["pageLength"] = data?.pageInfo?.pageSize
                        pageInfo["hasNextPage"] = data?.pageInfo?.totalRecords > data?.pageInfo?.page * data?.pageInfo?.pageSize
                        pageInfo["hasPreviousPage"] = data?.pageInfo?.page > 1
                        pageInfo["totalResults"] = data?.pageInfo?.totalRecords

                        this.setState({ gridData: data.response, pageInfo, isLoading: false })
                    }
                    else {
                        let arr = []
                        for (let fld of data.response) {
                            fld["businessId"] = this.getBusinessName(fld["businessId"])
                            arr.push(fld)
                        }
                        this.setState({ exportData: arr, isDownloadExcel: true })
                    }
                }
                else {
                    this.setState({ gridData: [], isLoading: false })
                }
            }.bind(this),
            "GET"
        );
    }
    handleFilters(data) {
        let filter = {
            ...this.state.filter, ...data, ...{ pagenumber: 1 }
        };
        this.setState({ filter }, () => { this.getSuppliers() });
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
    handlePaginationResults(pageNumber, pageLength) {

        let filter = this.state.filter;
        filter["pagenumber"] = parseInt(pageNumber) + 1
        filter["pagesize"] = pageLength

        this.setState({ filter })
        this.getSuppliers()

    }
    getBusinessName = (businessid) => {
        let obj = this.state.businessList.find((val) => (val.businessTypeId === businessid))
        //{businessType: "Hotel", businessTypeId: 1}
        return obj && obj["businessType"] ? obj["businessType"] : "";
    }

    handleClose = (resetData) => {
        this.setState({ modalData: null })
        if (resetData) {
            this.getSuppliers()
        }
    }
    editSupplier = (data) => {
        if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierManagement~reconciliation-add-supplier")) { this.setState({ modalData: data.supplierID }) }
        else { this.setState({ isshowauthorizepopup: true }) }
    }
    handleDownload = () => {
        this.getSuppliers(true)
    }

    render() {
        let pageInfoIndex = [{ item: this.state.pageInfo }];
        const { userInfo: { agentID } } = this.props;
        const { gridData, isLoading, modalData, isDownloadExcel, exportData } = this.state
        return (
            <div>
                {modalData && (<Modal providerID={agentID} type={modalData} closePopup={this.handleClose.bind(this)} />)}
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Supplier Management
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
                            Supplier Management
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="container col-lg-9">
                            <Filters removeData={() => {
                                this.setState({
                                    gridData: []
                                })
                            }} agentID={agentID} handleFilters={this.handleFilters.bind(this)} userInfo={this.props.userInfo} />
                            <AuthorizeComponent title="SupplierManagement~reconciliation-add-supplier" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                <button onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierManagement~reconciliation-add-supplier") ? this.setState({ modalData: "Add" }) : this.setState({ isshowauthorizepopup: true }) }} className="btn btn-primary mb-2">Add New Supplier</button>
                            </AuthorizeComponent>
                            {gridData.length > 0 &&
                                <AuthorizeComponent title="SupplierManagement~reconciliation-exporttoexcel-supplier" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                                    <a onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "SupplierManagement~reconciliation-exporttoexcel-supplier") ? this.handleDownload() : this.setState({ isshowauthorizepopup: true }) }} className=" float-right  m-2">
                                        <img title="Download Excel" style={{ cursor: "pointer" }} height={20} src={ExcelIcon} />
                                    </a>
                                </AuthorizeComponent>
                                // <button onClick={() => { this.handleDownload() }} className="btn btn-primary float-right mb-2">Download Excel</button>
                            }
                            <div className="table-responsive-lg">
                                <table className="table border">
                                    <thead className="thead-light">
                                        <tr>
                                            {["#", "Business", "Supplier Id", "Supplier Name", "Contact Person",
                                                "Contact Phone", "Email Address", "Actions"
                                            ].map((data) => {
                                                return (<th scope="col">{data}</th>)
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && (<TableLoading columns={8} />)}
                                        {
                                            !isLoading && gridData &&
                                            gridData.length > 0 && gridData.map((data, index) => {

                                                return (<tr>
                                                    <th scope="row" onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{data.rowNum}</th>
                                                    <td onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{this.getBusinessName(data["businessId"])}</td>
                                                    <td onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{data.supplierID}</td>
                                                    <td style={{ "word-break": "break-word", cursor: "pointer" }} onClick={() => this.editSupplier(data)}>{data.supplierName}</td>
                                                    <td onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{data.contactPerson ? data.contactPerson : "---"}</td>
                                                    <td onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{data.phone ? data.phone : "---"}</td>
                                                    <td onClick={() => this.editSupplier(data)} style={{ cursor: "pointer" }}>{data.email ? data.email : "---"}</td>
                                                    <td><AuthorizeComponent title="SupplierManagement~reconciliation-add-supplier" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}><button onClick={() => this.editSupplier(data)} className="btn btn-sm btn-primary">Edit</button></AuthorizeComponent></td>
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
                            <div className="col-lg-12 report-pagination">
                                {!isLoading && (gridData &&
                                    gridData.length > 0) && (
                                        <Pagination
                                            pageInfoIndex={pageInfoIndex}
                                            handlePaginationResults={this.handlePaginationResults.bind(this)}
                                        />
                                    )}
                            </div>

                        </div>
                    </div>

                </div>
                {isDownloadExcel && (<DownLoadExcel onExportComplete={() => { this.setState({ isDownloadExcel: false, exportData: [] }) }} data={exportData} filename={"supplier-list"} />)}
                {this.state.isshowauthorizepopup &&
                    <ModelPopupAuthorize
                        header={""}
                        content={""}
                        handleHide={this.hideauthorizepopup}
                        history={this.props.history}
                    />
                }
            </div>
        )
    }
}

export default SupplierManagement
