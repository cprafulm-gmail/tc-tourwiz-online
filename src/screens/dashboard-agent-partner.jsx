import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import QuotationMenuPartner from "../components/quotation/quotation-menu-partener";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import HtmlParser from "../helpers/html-parser";

class DashboardAgentPartner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      resultsInquiry: "",
      bookings: "",
      pageNo: 1,
      pageSize: 10,
      inquiriesCount: "",
      itinerariesCount: "",
      quotationsCount: "",
      bookingsCount: "",
      inquiriesLoading: true,
      itinerariesLoading: true,
      quotationsLoading: true,
      bookingsLoading: true,
      isBtnLoading: true,
      week: "",
      perDayBooking: "",
      isSubscriptionMsg: true,
      isSOnboardingInfo: true,
      isRewardPoints: true,
      currentPlanendDate: "",
      currentPlanendName: "",
      currentPlanDuration: "",
      totalrewardpoints: 0,
      isCMSWebsite: true,
    };
  }

  getLoadingHTML = () => {
    return [...Array(4).keys()].map(() => {
      return (
        <div className="pl-3 pr-3 pt-2 bookings-loading">
          <div className="pb-2">
            <div className="row">
              <div className="col-lg-6">
                <b className="w-50 d-inline-block mb-2">&nbsp;</b>
              </div>
              <div className="col-lg-4">
                <b className="w-50 d-inline-block mb-2">&nbsp;</b>
              </div>
              <div className="col-lg-2">
                <b className="w-50 d-inline-block mb-2">&nbsp;</b>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  handleSubscriptionMsg = () => {
    this.setState({ isSubscriptionMsg: !this.state.isSubscriptionMsg });
  };

  handleRewardPoints = () => {
    this.setState({ isRewardPoints: !this.state.isRewardPoints });
  };

  handleSOnboardingInfo = () => {
    this.setState({ isSOnboardingInfo: !this.state.isSOnboardingInfo });
  };

  getData = (pageCount) => {
    this.setState({ results: [], isBtnLoading: true });

    var reqURL = "admin/partner/offer/list?PageNumber=" + this.state.pageNo + "&PageSize=" + this.state.pageSize;

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

  handleRedirect = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      //window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };

  getAuthToken = () => {
    this.getData();
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      this.getData();
    }); */
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAuthToken();
    //this.setState({ isBtnLoading: false });
  }

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");
    const {
      perDayBooking,
      results,
      isBtnLoading
    } = this.state;

    const data = {
      labels: [
        "18 Dec",
        "19 Dec",
        "20 Dec",
        "21 Dec",
        "22 Dec",
        "23 Dec",
        "24 Dec",
      ],
      datasets: [
        {
          label: "Inquiries",
          backgroundColor: "rgba(235, 72, 134, 1)",
          borderColor: "rgba(235, 72, 134, 1)",
          data: [4, 8, 6, 7, 3, 1, 6],
          fill: false,
        },
        {
          label: "Itineraries",
          backgroundColor: "rgba(70, 197, 241, 1)",
          borderColor: "rgba(70, 197, 241, 1)",
          data: [6, 10, 4, 5, 8, 4, 5],
          fill: false,
        },
        {
          label: "Quotations",
          backgroundColor: "rgba(255, 185, 45, 1)",
          borderColor: "rgba(255, 185, 45, 1)",
          data: [5, 8, 4, 3, 6, 10, 4],
          fill: false,
        },
        {
          label: "Bookings",
          backgroundColor: "rgba(135, 94, 192, 1)",
          borderColor: "rgba(135, 94, 192, 1)",
          data: perDayBooking,
          fill: false,
        },
      ],
    };

    const css = `
    .navbar .dashboard-btn {
        display: none !important;
    }`;

    return (
      <div className="agent-dashboard">
        <style>{css}</style>
        <div className="title-bg pt-3 pb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30 d-inline">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("_dashboard")}

              <button className="btn btn-sm btn-primary pull-right mr-2" onClick={() => { this.props.history.push(`/Offers/Add`) }}>
                Add Offer
              </button>
              <button className="btn btn-sm btn-primary pull-right mr-2" onClick={() => { this.props.history.push(`/Partner-Deals`) }}>
                All Offers
              </button>
            </h1>
            {/* {isPersonateEnabled && (
              <div className="pull-right" style={{ marginTop: "-2px" }}>
                <CallCenter />
              </div>
            )} */}
          </div>
        </div>
        <div className="container">

          <div className="row">
            <div className="col-lg-3">
              <QuotationMenuPartner handleMenuClick={this.handleRedirect} />
            </div>

            <div className="col-lg-9">
              <div className="container">
                <div className="row">
                  <h3 className="mt-2 pl-3">Latest Offers</h3>
                  <React.Fragment>
                    <div className="col-lg-12 mb-3">
                      Get access to amazing offers from our trusted partners.
                    </div>
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
                    {!isBtnLoading && results && results.length > 0 && results.map((item, index) => {
                      return index < 6 && <div className={"col-lg-4"} key={index}>
                        <div className="mb-4 card">
                          <div className="card-header">
                            <h6 data-html="true" data-placement="top" title={item.name}>{(item.name).trim().length > 20 ? (item.name).trim().substr(0, 20) + '...' : item.name}</h6>
                          </div>
                          <div className="card-body">

                            <p className="card-text" style={{ "min-height": "50px", "height": "72px", "overflow": "hidden", "text-overflow": "ellipsis" }} data-html="true" data-placement="top" title={item.description}>{(item.description).trim().length > 100 ? (item.description).trim().substr(0, 100) + '...' : item.description}</p>

                            {item.type === "Web_HTML" && <HtmlParser text={item.advT_HTMLText} />}
                          </div>
                          {item.url && item.url !== "" && <img className="w-100" src={item.url} style={{ "object-fit": "fill", "height": "220px" }} />}
                          <button className="btn btn-primary rounded-0 d-none" onClick={() => this.getOffersDetails(item)} >View Details</button>
                        </div>
                      </div>
                    })}
                    {!isBtnLoading && (!results || results.length === 0) &&
                      <div className={"col-lg-12"}>
                        No Offer(s) Found.
                      </div>
                    }
                  </React.Fragment>
                </div>




              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardAgentPartner;
