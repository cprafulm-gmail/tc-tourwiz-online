import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu-partener";
import Pagination from "../components/booking-management/booking-pagination"
import * as Global from "../helpers/global";
import HtmlParser from "../helpers/html-parser";
import ModelPopup from "../helpers/model";
import ComingSoon from "../helpers/coming-soon";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import moment from "moment";
import Date from "../helpers/date";
import { Trans } from "../helpers/translate";
import ActionModal from "../helpers/action-modal";
import OfferDetailsPopup from "../components/quotation/partneroffer-detail-popup";

class DealsPartnerAgentclicksDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingsoon:false,
            results: [],
            currentPage: 0,
            pageNo: 1,
            pageSize: 5,
            totalRecords:0,
            hasNextPage: false,
            isBtnLoading: false,
            isShowDetails: false,
            ownerDetails:null,
            isloadingDetails:false,
            selectedAdvertiseName:"",
            isDeleteConfirmPopup: false,
            deleteItem: "",
            isDetailPopup:false,
            offerpreviewdetails:"",
            details:""
        };
    }
    
    handleComingSoon = () => {
        this.setState({
          comingsoon: !this.state.comingsoon,
        });
    };

    handleItemDelete = (offerid) => {
        this.setState({ deleteItem:offerid, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
      };

    handleConfirmDelete = (isConfirmDelete,) => {
        this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
        isConfirmDelete && this.onPublish(this.state.deleteItem);
      };

      onEdit = (offerid) =>{

    }
    
    showHidePreviewDetailPopup = (item) =>{
        var detailsdata = "";
        var reqURL = "offer?OfferID="+item.offerID;
        
        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                
                if(data.error)
                {
                    this.setState({
                        results:[],
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
                else{
                    this.setState({isDetailPopup: !this.state.isDetailPopup,details:data.response});
                }
            },
            "GET"
        );
    }

    showHideDetailPopup = () => {
        this.setState({ isDetailPopup: !this.state.isDetailPopup });
    };

    onPublish = (offerid) =>{
        
        var reqURL = "admin/partner/offer/publish";
        
        var reqOBJ = {
            "Request": {
                "OfferID": offerid,
                "Status":"REQUESTFORPUBLISH"
            }
        };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                
                if(data.error)
                {
                    this.setState({
                        results:[],
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
            },
            
        );

        this.getData();
    }

    handlePaging = () => {
        var data = this.state.pageInfo;
        data = data + 1 
        this.setState({ pageNo: this.state.pageNo + 1 }, () => this.getData());
      };

    getData = (pageCount) => {
        this.setState({isBtnLoading:true});
        var reqURL = "admin/partner/offer/clickcountlist?"+"OfferID="+this.props.match.params.offerid+"&PageNumber="+this.state.pageNo+"&PageSize="+this.state.pageSize;
        var reqOBJ = {};
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            (data) => {
                
                if(data.error)
                {
                    this.setState({
                        results:[],
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
                    
                    let results = this.state.results
                    ? this.state.results.concat(data.response)
                    : data.response;
                    
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
    RedirectToListPage = () => {
        this.props.history.push(`/Partner-Deals`);
    };
    render() {
        const {
            results,
            isBtnLoading,
            pageInfo,
            pageNo,
            pageSize,
            isloadingDetails,
            isDeleteConfirmPopup
        } = this.state;
        let pageInfoIndex = [{ item: pageInfo }];
        let rest={disabled : isloadingDetails}
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
                                Agent wise Offer Clicks
                                <span className="pull-right">
                                    <button
                                    className="btn btn-primary"
                                    onClick={()=>(this.RedirectToListPage())}
                                    >
                                    Back
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
                                    <React.Fragment>
                                         <div class="table-responsive">
                                         {
                                            <table className="table border small ">
                                                <thead className="thead-light">
                                                <tr>
                                                    <th>Company Name</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>City Name</th>
                                                    <th>Country</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {results && results.length > 0 &&
                                                    results.map((item,) => (

                                                    <tr>
                                                        <td>{item.companyName ? item.companyName : '--'}</td>
                                                        <td>{item.firstName + ' ' + item.lastName}</td>
                                                        <td>{item.customerCareEmail ? item.customerCareEmail : '--'}</td>
                                                        <td>{item.cellPhone ? item.cellPhone : '--'}</td>
                                                        <td>{item.cityName ? item.cityName : '--'}</td>
                                                        <td>{item.countryName ? item.countryName : '--'}</td>
                                                    </tr>
                                                ))
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
                {this.state.isShowDetails ? (
                    <ModelPopup
                        header={this.state.selectedAdvertiseName}
                        content={this.state.ownerDetails}
                        handleHide={this.handleHidePopup}
                    />
                    ) : null}
                {isDeleteConfirmPopup && (
                    <ActionModal
                        title="Confirm Publish"
                        message={<HtmlParser text={"Are you sure you want to publish this offer?<br/>Once you request for publish offer, you can not edit offer until Approved or Rejected."} />}
                        positiveButtonText="Confirm"
                        onPositiveButton={() => this.handleConfirmDelete(true)}
                        handleHide={() => this.handleConfirmDelete(false)}
                    />
                    )}
            </React.Fragment>
        )
    }
}

export default DealsPartnerAgentclicksDetails;
