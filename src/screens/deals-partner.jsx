import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu-partener";
import { apiRequester } from "../services/requester";
import Pagination from "../components/booking-management/booking-pagination"
import * as Global from "../helpers/global";
import HtmlParser from "../helpers/html-parser";
import fixedDeals from "../assets/templates/fixed-deals";
import ModelPopup from "../helpers/model";
import ComingSoon from "../helpers/coming-soon";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import moment from "moment";
import Date from "../helpers/date";
import { Trans } from "../helpers/translate";
import ActionModal from "../helpers/action-modal";
import OfferDetailsPopup from "../components/quotation/partneroffer-detail-popup";
import OfferAgentFilters from "../components/common/offer-agent-filters";

class DealsPartner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingsoon: false,
            results: [],
            currentPage: 0,
            isFilters: true,
            pageNo: 1,
            pageSize: 10,
            totalRecords: 0,
            hasNextPage: false,
            isBtnLoading: false,
            ownerDetails: null,
            isloadingDetails: false,
            selectedAdvertiseName: "",
            isDeleteConfirmPopup: false,
            deleteItem: "",
            isDetailPopup: false,
            offerpreviewdetails: "",
            showPopup: false,
            details: "",
            filter: {
                business: "all",
                name: "",
                city: "",
                state: "",
                country: "",
                status: "",
                locationName: "",
                fromDate: moment().format('YYYY-MM-DD'),
                toDate: moment().add(1, 'M').format('YYYY-MM-DD'),
                startfromDate: moment().format('YYYY-MM-DD'),
                starttoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
                endfromDate: moment().format('YYYY-MM-DD'),
                endtoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
            },
        };
    }
    handleComingSoon = () => {
        this.setState({
            comingsoon: !this.state.comingsoon,
        });
    };

    handleItemPublish = (offerid) => {
        this.setState({ deleteItem: offerid, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    };

    handleOffer = (mode, item) => {
        var reqURL = "admin/partner/offer/action";
        var reqOBJ = {};
        if (mode === "delete") {
            reqOBJ = {
                "Request": {
                    "actionMode": "delete",
                    "OfferID": item.offerID
                }
            };
        }
        else if (mode === "active") {
            reqOBJ = {
                "Request": {
                    "actionMode": "active",
                    "OfferID": item.offerID,
                    "isActive": !item.isActive
                }
            };
        }
        else if (mode === "inactive") {
            reqOBJ = {
                "Request": {
                    "actionMode": "active",
                    "OfferID": item.offerID,
                    "isActive": !item.isActive
                }
            };
        }

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {

                if (data.error) {
                    return true;
                }
                else {
                    this.getData();
                }
            }
        );
    };
    confirmInActiveRecords = (mode, item) => {
        this.setState({ isStartProcessing: 'processing', showPopup: false, popupContent: "", popupHeader: "" });
        this.handleOffer(mode, item);

    }
    hidePopup = () => {
        this.setState({ showPopup: !this.state.showPopup });
    }

    confirmInActive = (mode, item) => {
        let message = mode === 'inactive' ? "Are you sure you want to Inactive the selected offer?" : "Are you sure you want to active the selected offer?";
        this.setState({
            popupSizeClass: "",
            showPopup: !this.state.showPopup,
            popupContent: this.state.showPopup ? "" : (
                <div>

                    <div>{message}</div>
                    <button
                        className="btn btn-primary pull-right m-1 "
                        onClick={() => this.confirmInActiveRecords(mode, item)}
                    >
                        Yes
                    </button>

                    <button
                        className="btn btn-primary pull-right m-1 "
                        onClick={() => this.setState({ showPopup: false, popupContent: "", popupHeader: "" })}
                    >
                        No
                    </button>
                </div>
            ),
            popupHeader: "Are you sure ?"
        });
    }

    handleConfirmDelete = (isConfirmDelete,) => {
        this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
        isConfirmDelete && this.onPublish(this.state.deleteItem);
    };

    ViewAgentClicks = (offerid) => {
        this.props.history.push("/Partner-Deals-Clicks/" + offerid);
    }

    handleFilters = (data) => {
        let filter = this.state.filter;
        filter["name"] = data["name"] ? data["name"] : "";
        filter["status"] = data["status"] ? data["status"] : "all";
        filter["startfromDate"] = data["startfromDate"] ?
            moment(data["startfromDate"]).format(Global.DateFormate) : null;
        filter["starttoDate"] = data["starttoDate"] ?
            moment(data["starttoDate"]).format(Global.DateFormate) : null;
        filter["endfromDate"] = data["endfromDate"] ?
            moment(data["endfromDate"]).format(Global.DateFormate) : null;
        filter["endtoDate"] = data["endtoDate"] ?
            moment(data["endtoDate"]).format(Global.DateFormate) : null;
        this.setState({ filter });
        this.getData();
    }

    showHidePreviewDetailPopup = (item) => {
        var detailsdata = "";
        var reqURL = "admin/offer?OfferID=" + item.offerID;
        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {

                if (data.error) {
                    this.setState({
                        results: [],
                        isBtnLoading: false,
                        pageInfo: {
                            currentPage: 0,
                            pageLength: 9,
                            hasNextPage: false,
                            hasPreviousPage: false,
                            totalResults: 0
                        }
                    });
                    return true;
                }
                else {
                    this.setState({ isDetailPopup: !this.state.isDetailPopup, details: data.response });
                }
            },
            "GET"
        );
    }

    showHideDetailPopup = () => {
        this.setState({ isDetailPopup: !this.state.isDetailPopup });
    };

    onPublish = (offerid) => {

        var reqURL = "admin/partner/offer/publish";

        var reqOBJ = {
            "Request": {
                "OfferID": offerid,
                "Status": "REQUESTFORPUBLISH"
            }
        };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {

                if (data.error) {
                    this.setState({
                        results: [],
                        isBtnLoading: false,
                        pageInfo: {
                            currentPage: 0,
                            pageLength: 9,
                            hasNextPage: false,
                            hasPreviousPage: false,
                            totalResults: 0
                        }
                    });
                    return true;
                }
                else {
                    this.getData();
                }
            },

        );
    }

    handlePaging = () => {
        var data = this.state.pageInfo;
        data = data + 1
        this.setState({ pageNo: this.state.pageNo + 1 }, () => this.getData());
    };

    getData = (pageCount) => {
        this.setState({ isBtnLoading: true });

        var reqURL = "admin/partner/offer/list?PageNumber=" + this.state.pageNo + "&PageSize=" + this.state.pageSize;
        reqURL += "&startfromdate=" + this.state.filter.startfromDate;
        reqURL += "&starttodate=" + this.state.filter.starttoDate;
        reqURL += "&endfromdate=" + this.state.filter.endfromDate;
        reqURL += "&endtodate=" + this.state.filter.endtoDate;
        if (this.state.filter.name !== '')
            reqURL += "&name=" + this.state.filter.name;
        if (this.state.filter.status !== '' && this.state.filter.status.toLowerCase() !== "all")
            reqURL += "&status=" + this.state.filter.status;

        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {

                if (data.error) {
                    this.setState({
                        results: [],
                        isBtnLoading: false,
                        pageInfo: {
                            currentPage: 0,
                            pageLength: 9,
                            hasNextPage: false,
                            hasPreviousPage: false,
                            totalResults: 0
                        }
                    });
                    return true;
                }

                if (data.pageInfo.totalRecords > 0) {

                    let results = this.state.pageNo === 1
                        ? data.response
                        : this.state.results.concat(data.response);

                    let pageInfo = data.pageInfo;
                    this.setState({ results: results, pageInfo, isBtnLoading: false })
                }
                else {
                    this.setState({ results: [], isBtnLoading: false });
                }

            },
            "GET"
        );
    };

    handlePaginationResults(pageNumber, pageLength) {
        this.setState(
            {
                pageSize: pageLength,
                isLoading: !this.state.isLoading
            },
            () => this.getData(pageNumber)
        );

    }

    componentDidMount() {
        this.getData();
    }

    getOwnerDetails = (redirectURL, advertiseName, id) => {
        this.setState({
            isloadingDetails: true
        });
        var reqURL = "api/v1/advertisement/get-owner-details";
        var reqOBJ = {
            "Request": {
                "AdvetiseId": id,
                "UserId": this.props.userInfo.userID
            }
        };
        apiRequester(
            reqURL,
            reqOBJ,
            (data) => {
                if (!data.response?.companyName) {
                    this.setState({
                        isloadingDetails: false
                    });
                    return;
                };
                let ownerDetails = <div>
                    <p className="text-primary"><b>Get in touch with our partner to avail this offer.</b></p>
                    <p>Contact Name : {data.response.companyName}</p>
                    <p>Email : {data.response.customerCareEmail}</p>
                    <p>Phone Number : {data.response.companyPhone1}</p>
                    <p>Address : {
                        data.response.companyAddress1 +
                        (data.response.cityName ? ", " + data.response.cityName : "") +
                        (data.response.stateName ? ", " + data.response.stateName : "") +
                        (data.response.companyPostalCode ? ", " + data.response.companyPostalCode : "") +
                        (data.response.CountryName ? ", " + data.response.CountryName : "")
                    }</p>
                    {redirectURL &&
                        <p className="text-primary"><a className="text-primary text-decoration-line" target="_blank" href={redirectURL}>More Details</a></p>}
                </div>
                this.setState({
                    ownerDetails,
                    selectedAdvertiseName: advertiseName,
                    showPopup: true,
                    isloadingDetails: false,
                    popupContent: ownerDetails,
                    popupHeader: advertiseName,
                });
            },
        );

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

    RedirectToAddPage = (Mode, Id) => {
        this.props.history.push(`/Offers/${Mode}` + (Id ? "/" + Id : ""));
    };
    render() {
        const {
            results,
            isBtnLoading,
            pageInfo,
            pageNo,
            pageSize,
            isloadingDetails,
            isDeleteConfirmPopup,
            isFilters
        } = this.state;
        let pageInfoIndex = [{ item: pageInfo }];
        let rest = { disabled: isloadingDetails }
        return (
            <React.Fragment>
                {this.state.comingsoon && (
                    <ComingSoon handleComingSoon={this.handleComingSoon} />
                )}
                <div className="quotation quotation-list">
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <div className="container">
                            <h1 className="text-white m-0 p-0 f30">
                                <SVGIcon
                                    name="file-text"
                                    width="24"
                                    height="24"
                                    className="mr-3"
                                ></SVGIcon>
                                Manage Offers
                                <span className="pull-right">
                                    <button
                                        className="btn btn-sm btn-primary pull-right mr-2"
                                        onClick={() => (this.RedirectToAddPage('Add'))}
                                    >
                                        Add Offer
                                    </button>
                                </span>
                            </h1>

                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} />
                        </div>
                        <div className={"col-lg-9"}>
                            <div className="container">
                                <div className="row">
                                    <h3 className="mb-3">My Offers</h3>
                                    {isFilters && (
                                        <OfferAgentFilters
                                            handleFilters={this.handleFilters}
                                            offertype={"Partner"}
                                            history={this.props.history}
                                            providerId={this.props.userInfo.agentID}
                                            userID={this.props.userInfo.userID}
                                            business={this.state.business}
                                        />
                                    )}
                                </div>
                                <div className="row">
                                    <React.Fragment>
                                        <div className="table-responsive">
                                            {
                                                <table className="table border small table-column-width ">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            {[
                                                                "Name",
                                                                "Description",
                                                                "Start Date",
                                                                "End Date",
                                                                "Status",
                                                                'View Count',
                                                                "Actions",
                                                            ].map((data, key) => {
                                                                return (
                                                                    <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                                                                )
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {!isBtnLoading && results && results.length > 0 &&
                                                            results.map((item,) => (

                                                                <tr>
                                                                    <td style={{ "word-break": "break-all" }}><div style={{ "max-height": "43px", overflow: "hidden" }} title={item.name}>{item.name.length > 55 ? item.name.substring(0, 55) + "..." : item.name}</div></td>
                                                                    <td style={{ "word-break": "break-all" }}><div style={{ "max-height": "43px", "text-overflow": "ellipsis", overflow: "hidden" }} title={item.description ? item.description : '--'}>{item.description ? (item.description.length > 90 ? item.description.substring(0, 90) + "..." : item.description) : '--'}</div></td>
                                                                    <td><Date date={item.offerStartDate} format={"DD/MM/YYYY"} /></td>
                                                                    <td>{moment(item.offerEndDate).format("DD/MM/YYYY")}</td>
                                                                    {item.status === "REJECTED"
                                                                        ? <td style={{ "textTransform": "capitalize" }}><abbr title={item.statusReason}>rejected</abbr></td>
                                                                        : <td style={{ "textTransform": "capitalize" }}>{item.status === "REQUESTFORPUBLISH" ? "Request For Publish" : item.status === "CREATED" ? "Draft" : item.status.toLowerCase()}</td>
                                                                    }
                                                                    <td>
                                                                        {item.offerClickCount > 0 &&
                                                                            <button
                                                                                className="btn btn-link btn-sm"
                                                                                onClick={() => this.ViewAgentClicks(item.offerID)}
                                                                            >
                                                                                {item.offerClickCount}
                                                                            </button>

                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() => this.showHidePreviewDetailPopup(item)}
                                                                        >
                                                                            {Trans("Preview")}
                                                                        </button>
                                                                        {" "}
                                                                        {(item.status !== "REQUESTFORPUBLISH" && item.status !== "PUBLISHED" && (item.status === "CREATED" || item.status === "REJECTED")) &&
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => this.RedirectToAddPage('Edit', item.offerID)}
                                                                            >
                                                                                {Trans("_viewBtnEdit")}
                                                                            </button>
                                                                        }
                                                                        {" "}
                                                                        {(item.status !== "REQUESTFORPUBLISH" && item.status !== "PUBLISHED" && item.status !== "REJECTED") &&

                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => this.handleItemPublish(item.offerID)}
                                                                            >
                                                                                {Trans("Publish")}
                                                                            </button>

                                                                        }
                                                                        {" "}
                                                                        {item.status !== "REQUESTFORPUBLISH" && item.status !== "PUBLISHED" &&
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => this.handleOffer('delete', item)}
                                                                            >
                                                                                {Trans("_viewBtnDelete")}
                                                                            </button>
                                                                        }
                                                                        {" "}
                                                                        {item.status === "PUBLISHED" &&
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => this.confirmInActive(item.isActive ? 'inactive' : 'active', item)}
                                                                            >
                                                                                {Trans(item.isActive ? "Inactive" : "Active")}
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        {!isBtnLoading && !results || results.length === 0 &&
                                                            <tr>
                                                                <td className="text-center" colSpan={5}>No records found.</td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                    </React.Fragment>
                                    {results && results.length > 0 && (
                                        <React.Fragment>
                                            {pageNo < pageInfo.totalRecords / pageSize && (
                                                <div className=" col-lg-12 p-2 text-center">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => this.handlePaging()}
                                                    >
                                                        Show More
                                                    </button>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
                                    {this.state.isDetailPopup && (
                                        <OfferDetailsPopup
                                            details={this.state.details}
                                            hideQuickBook={this.showHideDetailPopup}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isDeleteConfirmPopup && (
                    <ActionModal
                        title="Are you sure you want to publish this offer?"
                        message={<HtmlParser text={"Once you request for publishing, you will not be able to edit this offer. Your offer will undergo an internal review and will be published upon approval. In the event of rejection, we will state the reason(s) and allow you to make changes and re-publish the offer."} />}
                        positiveButtonText="Confirm"
                        onPositiveButton={() => this.handleConfirmDelete(true)}
                        handleHide={() => this.handleConfirmDelete(false)}
                    />
                )}
                {this.state.showPopup ? (
                    <ModelPopup
                        sizeClass={this.state.popupSizeClass ?? "modal-lg"}
                        header={this.state.popupHeader}
                        content={this.state.popupContent}
                        handleHide={this.hidePopup}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}

const table_column_width = {
    "Name": 200,
    "Description": 300,
    "Start Date": 100,
    "End Date": 100,
    "Status": 150,
    "View Count": 100,
    "Actions": 400,
}

export default DealsPartner;
