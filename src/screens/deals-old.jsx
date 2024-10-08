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

class DealsOLD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comingsoon:false,
            results: [],
            currentPage: 0,
            pageSize: 9,
            hasNextPage: false,
            isBtnLoading: false,
            isShowDetails: false,
            ownerDetails:null,
            isloadingDetails:false,
            selectedAdvertiseName:"",
            pageInfo: {
                currentPage: 0,
                pageLength: 9,
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

    getData = (pageCount) => {
        this.setState({isBtnLoading:true});
        var reqURL = "api/v1/advertisement/list";
        
        var reqOBJ = {
            "Request": {
                "Data": {
                    "ProviderId": Global.getEnvironmetKeyValue("portalId")
                },
                "PageInfoIndex": [
                    {
                        "Type": "default",
                        "Item": {
                            "PageLength": this.state.pageSize,
                            "CurrentPage": pageCount && pageCount,
                        }
                    }
                ]
            }
        };
        apiRequester(
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

                if (data.response.pageInfo.totalResultItems > 0) {
                    let pageInfo = this.state.pageInfo;
                    pageInfo["currentPage"] = data.response.pageInfo.currentPage
                    pageInfo["pageLength"] = data.response.pageInfo?.pageLength
                    pageInfo["hasNextPage"] = data.response.pageInfo?.hasNextPage
                    pageInfo["hasPreviousPage"] = data.response.pageInfo?.hasPreviousPage
                    pageInfo["totalResults"] = data.response.pageInfo?.totalResultItems
                    this.setState({ results: data.response.data, pageInfo, isBtnLoading: false })
                }
                else {
                    this.setState({ results: [], isBtnLoading: false });
                }
            
            },
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

    getOwnerDetails = (redirectURL, advertiseName, id) =>{
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
                if(!data.response?.companyName) {
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
                        (data.response.cityName ? ", " + data.response.cityName :"") + 
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
                    isShowDetails: true,
                    isloadingDetails: false
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
            isloadingDetails
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
                                Offers
                            
                            <button className="btn btn-sm btn-primary pull-right mr-2" onClick={this.handleComingSoon}>
                                Manage Offers
                            </button>
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
                            <h3 className="mb-3">Sample Offers</h3>
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
                                        {!isBtnLoading && results && results.length > 0 && results.map((item, index)=>{
                                        return <div className={"col-lg-4"} key={index}>
                                                <div className="mb-4 card">
                                                    <div className="card-header">
                                                        <h6>{item.advertiseName}</h6>
                                                    </div>
                                                    <div className="card-body">
                                                       
                                                        <p className="card-text" style={{"min-height":"50px"}}>{item.advertiseDescription}</p>
                                                        
                                                        {item.type === "Web_HTML" && <HtmlParser text={item.htmlContent} />}
                                                    </div>
                                                    {item.type === "Web_Image" && <a target="_blank" href={item?.detailsUrl ?? "#"}><img className="w-100" src={item.imageUrl} /></a>}
                                                    <button {...rest} className="btn btn-primary rounded-0" onClick={()=>this.getOwnerDetails(item?.detailsUrl, item.advertiseName, item.advetiseID)}>View Details</button>
                                                </div>
                                            </div>
                                        })}
                                    </React.Fragment>
                                        <div className="col-lg-12 report-pagination">
                                            {!isBtnLoading &&
                                                this.state.results &&
                                                this.state.results.length > 0 && (
                                                    <Pagination
                                                        pageInfoIndex={pageInfoIndex}
                                                        handlePaginationResults={this.handlePaginationResults.bind(this)}
                                                        mode={"card"}
                                                    />
                                                )}
                                                 {!isBtnLoading &&
                                                (this.state.results &&
                                                this.state.results.length === 0) && (
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

export default DealsOLD;
