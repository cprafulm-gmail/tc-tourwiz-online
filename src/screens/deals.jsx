import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester } from "../services/requester";
import Pagination from "../components/booking-management/booking-pagination"
import * as Global from "../helpers/global";
import HtmlParser from "../helpers/html-parser";
import fixedDeals from "../assets/templates/fixed-deals";
import ModelPopup from "../helpers/model";
import ComingSoon from "../helpers/coming-soon";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import OfferDetailsPopup from "../components/quotation/partneroffer-detail-popup";
import OfferAgentFilters from "../components/common/offer-agent-filters";
import moment from "moment";
import { Helmet } from "react-helmet";
class Deals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingsoon: false,
            results: [],
            agentofferresults: [],
            currentPage: 0,
            isFilters: !this.props.match.params.data,
            business: "",
            pageNo: 0,
            pageSize: 9,
            totalRecords: 0,
            isBtnLoading: false,
            isShowDetails: false,
            IsshowStaticDeals: true,
            IsshowAgentDeals: false,
            ownerDetails: null,
            isloadingDetails: false,
            selectedAdvertiseName: "",
            isDetailPopup: false,
            details: "",
            advertisename: "",
            filter: {
                business: "all",
                name: "",
                city: "",
                state: "",
                country: "",
                locationName: "",
                fromDate: moment().format('YYYY-MM-DD'),
                toDate: moment().add(1, 'M').format('YYYY-MM-DD'),
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

    handleComingSoon = () => {
        this.setState({
            comingsoon: !this.state.comingsoon,
        });
    };

    handlePaginationResults(pageNumber, pageLength) {
        this.setState(
            {
                pageSize: pageLength,
                isLoading: !this.state.isLoading,
                pageNo: pageNumber
            },
            () => this.getAgentOffersDetails(this.state.business)
        );

    }

    handleFilters = (data) => {
        let filter = this.state.filter;

        filter["business"] = data["business"] ? data["business"] : "all";
        filter["name"] = data["name"] ? data["name"] : "";
        filter["city"] = data["city"] ? data["city"] : "";
        filter["state"] = data["state"] ? data["state"] : "";
        filter["country"] = data["country"] ? data["country"] : "";
        filter["locationName"] = data["locationName"] ? data["locationName"] : "";
        filter["fromDate"] = data["fromDate"] ?
            moment(new Date(data["fromDate"])).format(Global.DateFormate) : null;
        filter["toDate"] = data["toDate"] ?
            moment(new Date(data["toDate"])).format(Global.DateFormate) : null;
        this.setState({ filter });
        this.getAgentOffersDetails(this.state.filter.business);
    }

    componentDidMount() {
        if (!localStorage.getItem("userToken"))
            this.getAuthToken();
        else {
            if (this.props.match.params.data)
                this.getAgentOffersDetails("all");
        }
        this.setState({ results: staticdeals.data, isBtnLoading: false });
    }

    getAuthToken = () => {
        if (this.props.match.params.data)
            this.getAgentOffersDetails("all");
        /* var reqURL = "api/v1/user/token";
        var reqOBJ = {};
        apiRequester(reqURL, reqOBJ, (data) => {
            localStorage.setItem("userToken", data.response);
            if (this.props.match.params.data)
                this.getAgentOffersDetails("all");
        }); */
    };

    gotoBack = () => {
        this.setState({
            IsshowStaticDeals: true,
            IsshowAgentDeals: false
        });
    }

    getOffersDetails = (item) => {

        var reqURL = "admin/agent/offer/click";

        var reqOBJ = {
            "Request": {
                "OfferID": item.offerID
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
                    this.getofferdetailsinfo(item);
                }
            }, "POST"
        );
    }

    getofferdetailsinfo = (item) => {
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
    getAgentOffersDetails = (item) => {
        let filter = this.state.filter;
        filter.business = staticdeals.data.find(x => x.business === item.toLowerCase()).business;
        this.setState({
            filter,
            isloadingDetails: true,
            IsshowStaticDeals: false,
            business: staticdeals.data.find(x => x.business === item.toLowerCase()).business,
            advertisename: staticdeals.data.find(x => x.business === item.toLowerCase()).advertiseName,
            agentofferresults: []
        });
        var reqURL = "admin/agent/offer/list?PageNumber=" + this.state.pageNo + "&PageSize=" + this.state.pageSize;
        if (this.state.filter.business.toLowerCase() !== "all")
            reqURL += "&BusinessID=" + this.state.filter.business;
        reqURL += "&fromdate=" + this.state.filter.fromDate;
        reqURL += "&todate=" + this.state.filter.toDate;
        if (this.state.filter.name !== '')
            reqURL += "&name=" + this.state.filter.name;
        if (this.state.filter.locationName !== '')
            reqURL += "&locationname=" + this.state.filter.locationName;
        if (this.state.filter.country !== '')
            reqURL += "&country=" + this.state.filter.country;
        if (this.state.filter.state !== '')
            reqURL += "&state=" + this.state.filter.state;
        if (this.state.filter.city !== '')
            reqURL += "&city=" + this.state.filter.city;
        if (this.props.match.params.data)
            reqURL += "&isFromOfferEmail=" + this.props.match.params.data;
        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                if (!data.response) {
                    this.setState({
                        isloadingDetails: false
                    });
                    return;
                };

                if (data.pageInfo.totalRecords > 0) {

                    let results = this.state.agentofferresults
                        ? this.state.agentofferresults.concat(data.response)
                        : data.response;

                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data.pageInfo.pageNumber;
                    pageInfo["pageLength"] = data.pageInfo?.pageSize;
                    pageInfo["hasNextPage"] = this.state.pageNo + 1 < Math.ceil(data.pageInfo?.totalRecords / parseInt(this.state.pageSize));
                    pageInfo["hasPreviousPage"] = this.state.pageNo > 0;
                    pageInfo["totalResults"] = data.pageInfo?.totalRecords;

                    this.setState({
                        agentofferresults: results, pageInfo, isBtnLoading: false, isShowDetails: false,
                        isloadingDetails: false,
                        IsshowAgentDeals: true
                    })
                }
                else {
                    this.setState({ agentofferresults: [], isBtnLoading: false, isloadingDetails: false, IsshowAgentDeals: true });
                }
            },
            "GET"
        );

    }

    handlePaging = () => {
        var data = this.state.pageInfo;
        data = data + 1
        this.setState({ pageNo: this.state.pageNo + 1 }, () => this.getAgentOffersDetails(this.state.business));
    };

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
    handleHidePopup = () => {

        this.setState({
            isShowDetails: !this.state.isShowDetails
        });
    };

    render() {
        const {
            results,
            isBtnLoading,
            pageInfo,
            isloadingDetails,
            agentofferresults,
            pageNo,
            pageSize,
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
                        <Helmet>
                            <title>
                                Offers
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
                                Offers
                                {this.state.IsshowAgentDeals &&
                                    <button className="btn btn-sm btn-primary pull-right mr-2" onClick={() => { this.gotoBack() }}>
                                        Back
                                    </button>
                                }
                            </h1>

                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className={"col-lg-9"}>
                            {this.state.IsshowStaticDeals &&
                                <div className="container">
                                    <h3 className="mb-3">Offers
                                        <button className="btn btn-sm btn-primary pull-right mr-2" onClick={() => this.getAgentOffersDetails("all")}>
                                            All Offers
                                        </button>
                                    </h3>
                                    <div className="row">
                                        <React.Fragment>

                                            {isBtnLoading && [...Array(6).keys()].map((item, key) => {
                                                return <div className={"col-lg-4"}>
                                                    <div className="card mt-3 bookings bookings-loading">
                                                        <div className="card-header">
                                                            <b className="w-100 d-inline-block mb-2">&nbsp;</b>
                                                        </div>
                                                        <div className="card-body">
                                                            <p className="card-title"><b className="w-100 d-inline-block mb-2">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            )}
                                            {!isBtnLoading && results && results.length > 0 && results.filter(x => x.business !== "all").map((item, index) => {
                                                return <div className={"col-lg-4"} key={index}>
                                                    <div className="mb-4 card">
                                                        <div className="card-header">
                                                            <h6>{item.advertiseName}</h6>
                                                        </div>
                                                        <div className="card-body">

                                                            <p className="card-text" style={{ "min-height": "50px", "height": "72px", "overflow": "hidden", "text-overflow": "ellipsis" }}>{item.advertiseDescription}</p>

                                                            {item.type === "Web_HTML" && <HtmlParser text={item.htmlContent} />}
                                                        </div>
                                                        {item.type === "Web_Image" && <a target="_blank" href={item?.detailsUrl ?? "#"}><img className="w-100" src={item.imageUrl} style={{ "object-fit": "cover", "height": "220px" }} /></a>}
                                                        <button {...rest} className="btn btn-primary rounded-0" onClick={() => this.getAgentOffersDetails(item.business)}>View Details</button>
                                                    </div>
                                                </div>
                                            })}
                                        </React.Fragment>
                                    </div>
                                </div>
                            }
                            {this.state.isDetailPopup && (
                                <OfferDetailsPopup
                                    details={this.state.details}
                                    hideQuickBook={this.showHideDetailPopup}
                                />
                            )}
                            {this.state.IsshowAgentDeals &&
                                <div className="container">
                                    <h3 className="mb-3">{this.state.advertisename}</h3>
                                    {isFilters && (
                                        <OfferAgentFilters
                                            handleFilters={this.handleFilters}
                                            offertype={"Agent"}
                                            history={this.props.history}
                                            providerId={this.props.userInfo.agentID}
                                            userID={this.props.userInfo.userID}
                                            business={this.state.business}
                                        />
                                    )}

                                    <div className="row">
                                        <React.Fragment>

                                            {isBtnLoading && [...Array(6).keys()].map((item, key) => {
                                                return <div className={"col-lg-4"}>
                                                    <div className="card mt-3 bookings bookings-loading">
                                                        <div className="card-header">
                                                            <b className="w-100 d-inline-block mb-2">&nbsp;</b>
                                                        </div>
                                                        <div className="card-body">
                                                            <p className="card-title"><b className="w-100 d-inline-block mb-2">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                            <p className="card-title mb-0"><b className="w-100 d-inline-block mb-0">&nbsp;</b></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            )}
                                            {!isBtnLoading && agentofferresults && agentofferresults.length > 0 && agentofferresults.map((item, index) => {
                                                return <div className={"col-lg-4"} key={index}>
                                                    <div className="mb-4 card">
                                                        <div className="card-header">
                                                            <h6 data-html="true" data-placement="top" title={item.name}>{(item.name).trim().length > 20 ? (item.name).trim().substr(0, 20) + '...' : item.name}</h6>
                                                        </div>
                                                        <div className="card-body">

                                                            <p className="card-text" style={{ "min-height": "50px", "height": "72px", "overflow": "hidden", "text-overflow": "ellipsis" }} data-html="true" data-placement="top" title={item.description}>{(item.description).trim().length > 100 ? (item.description).trim().substr(0, 100) + '...' : item.description}</p>

                                                            {item.type === "Web_HTML" && <HtmlParser text={item.advT_HTMLText} />}
                                                        </div>
                                                        {item.url && item.url !== "" && <a target='_blank' href={item.redirectURL ? (item.redirectURL.includes("http") ? item.redirectURL : "http://" + item.redirectURL) : '#'}><img className="w-100" src={item.url} style={{ "object-fit": "fill", "height": "220px" }} /></a>}
                                                        <button {...rest} className="btn btn-primary rounded-0" onClick={() => this.getOffersDetails(item)} >View Details</button>
                                                    </div>
                                                </div>
                                            })}

                                        </React.Fragment>
                                        <div className="col-lg-12 report-pagination">
                                            {!isBtnLoading &&
                                                this.state.agentofferresults &&
                                                this.state.agentofferresults.length > 0 && (
                                                    <Pagination
                                                        pageInfoIndex={pageInfoIndex}
                                                        handlePaginationResults={this.handlePaginationResults.bind(this)}
                                                        mode={"card"}
                                                    />
                                                )}
                                            {!isBtnLoading &&
                                                (!this.state.agentofferresults ||
                                                    this.state.agentofferresults.length === 0) && (
                                                    <div class="col-lg-9 d-flex flex-wrap justify-content-center align-content-center">
                                                        <div className="col-lg-9 d-flex flex-wrap justify-content-center align-content-center">
                                                            <div className="container">
                                                                <div className="row mt-3">
                                                                    <div className="col-lg-12 text-center text-secondary">
                                                                        <h4>No offers available.</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {this.state.isShowDetails ? (
                    <ModelPopup
                        header={this.state.selectedAdvertiseName}
                        content={this.state.ownerDetails}
                        handleHide={this.handleHidePopup}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}

let staticdeals = {
    "data": [
        {
            "advetiseID": 8,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Hotel Offers",
            "business": "1",
            "advertiseDescription": "Get Exciting Hotel Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/Hotel.png",
            "htmlContent": "",
            "rowCount": 1
        },
        {
            "advetiseID": 7,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Flight Offers",
            "business": "4",
            "advertiseDescription": "Get Exciting Flight Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/Flights.png",
            "htmlContent": "",
            "rowCount": 2
        },
        {
            "advetiseID": 6,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Package Offers",
            "business": "8",
            "advertiseDescription": "Get Exciting Package Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/Package.png",
            "htmlContent": "",
            "rowCount": 3
        },
        {
            "advetiseID": 5,
            "detailsUrl": "/Static-Deals",
            "advertiseName": "Transfer Offers",
            "business": "9",
            "advertiseDescription": "Get Exciting Transfer Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/transfer.png",
            "htmlContent": "",
            "rowCount": 4
        },
        {
            "advetiseID": 4,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Excursion Offers ",
            "business": "5",
            "advertiseDescription": "Get Exciting Excursion Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/activity.png",
            "htmlContent": "",
            "rowCount": 5
        },
        {
            "advetiseID": 2,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Cruise Offers",
            "business": "5",
            "advertiseDescription": "Get Exciting Cruise Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/cruise.jpg",
            "htmlContent": "",
            "rowCount": 6
        },
        {
            "advetiseID": 2,
            "detailsUrl": "/partner-offers",
            "advertiseName": "Custom Offers",
            "business": "14",
            "advertiseDescription": "Get Exciting Custom Offers",
            "type": "Web_Image",
            "imageUrl": "https://backoffice.tourwizonline.com/MarketingImages/defaultImages/custom.png",
            "htmlContent": "",
            "rowCount": 6
        },
        {
            "advetiseID": 2,
            "detailsUrl": "/partner-offers",
            "advertiseName": "All Offers",
            "business": "all",
            "advertiseDescription": "All Offers",
            "type": "",
            "imageUrl": "",
            "htmlContent": "",
            "rowCount": 7
        }
    ]
}

export default Deals;
