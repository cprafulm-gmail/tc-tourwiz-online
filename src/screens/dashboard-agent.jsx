import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import QuotationMenu from "../components/quotation/quotation-menu";
import DateComp from "../helpers/date";
// import CallCenter from "../components/call-center/call-center";
import { Link, Link as ReactLink } from "react-router-dom";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import Loader from "../components/common/loader";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import InquiryView from "../components/quotation/inquiry-view";
import ModelPopup from "../helpers/model";
import TaxConfigurationPopup from "../components/quotation/tax-configuration-popup";
import info from "../assets/images/dashboard/info-circle.svg";
import ReactTooltip from 'react-tooltip';
import CreateInquiryIcon from "../assets/images/dashboard/create-inquiry.png";
import CreateItineraryIcon from "../assets/images/dashboard/create-itinerary.png";
import CreateQuotationIcon from "../assets/images/dashboard/create-quotation.png";
import ManagePackageIcon from "../assets/images/dashboard/manage-package.svg";
import ManageAgencyIconnew from "../assets/images/dashboard/manage-agency-new.svg";
import ManageInquiryIconnew from "../assets/images/dashboard/manage-inquiry-new.svg";
import ManageInquiryIcon from "../assets/images/dashboard/manage-inquiry.svg";
import ManageQuotationIconnew from "../assets/images/dashboard/manage-quotation-new.svg";
import ManagebookingIconnew from "../assets/images/dashboard/manage-account-new.svg";
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import AssistantModelPopup from "../helpers/assistant-model";
import PackageAIAssitantTrial from "../screens/package-ai-assistant-trial";
import HtmlParser from "../helpers/html-parser";
import { Helmet } from "react-helmet";
import SelfServicePortal from "./self-service-portal";

class DashboardAgent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: "",
      resultsInquiry: "",
      bookings: "",
      inquiriesCount: "",
      itinerariesCount: "",
      quotationsCount: "",
      bookingsCount: "",
      inquiriesLoading: true,
      itinerariesLoading: true,
      quotationsLoading: true,
      bookingsLoading: true,
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
      customerPortalURL: "",
      isCMSPortalCreated: true,
      followupRecords_itinerary: 0,
      followupRecords_quotation: 0,
      followupRecords_inquiry: 0,
      followupRecords_package: 0,
      isshowauthorizepopup: false,
      itemtoview: "",
      isViewInquiry: false,
      currentPlanextendedDays: "",
      currentPlanStatus: "",
      actualPlanEndDate: "",
      ShowTaxConfigurationPopup: false,
      isSubscriptionPlanend: false,
      isTrialAI: false,
      releaseNoteDetails: null,
    };
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
  }
  ViewInquiry = (item) => {
    this.setState({
      isViewInquiry: !this.state.isViewInquiry,
      itemtoview: item
    });
  };

  handleHidePopup = () => {
    this.setState({
      isViewInquiry: !this.state.isViewInquiry,
      itemtoview: ""
    });
  };

  getRewardpoints = () => {
    var reqURL =
      "reward/summary";
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      {},
      function (data) {
        if (data.response) {
          this.setState({ totalrewardpoints: data.response.totalRewardPoints });
        }
      }.bind(this),
      "GET"
    );
  };
  getCurrentSubscriptionDetails = () => {
    let pricedetails = [];
    var reqURL =
      "tw/subscription/details";
    var reqOBJ = {};
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response.length > 0) {
          this.setState({
            currentPlanendDate: data.response[0].endDate,
            currentPlanendName: data.response[0].planName,
            currentPlanDuration: data.response[0].planDuration,
            currentPlanextendedDays: data.response[0].extendedDays,
            currentPlanStatus: data.response[0].status,
            actualPlanEndDate: data.response[0].actualEndDate
          });
        }
      },
      "GET"
    );
  };
  getItineraries = () => {
    var reqURL = "quotations?type=Itinerary&page=0&records=10&isFollowupCountRequired=true";
    var reqOBJ = {
      Request: "",
      flags: {
        persisted: true,
      },
    };

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let resultsItineraries = [];

        data.result.map(
          (item) =>
            item.data.type === "Itinerary" && resultsItineraries.push(item)
        );
        this.setState(
          {
            results: data.result,
            resultsItineraries,
            itinerariesCount: data?.paging?.totalRecords ?? 0,
            followupRecords_itinerary: data?.followupRecords ?? 0,
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };
  getQuotations = () => {
    var reqURL = "quotations?type=Quotation&page=0&records=10&isFollowupCountRequired=true";
    var reqOBJ = {
      Request: "",
      flags: {
        persisted: true,
      },
    };

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {

        let resultsQuotations = [];

        data.result.map(
          (item) =>
            item.data.type === "Quotation" && resultsQuotations.push(item)
        );
        this.setState(
          {
            results: data.result,
            resultsQuotations,
            quotationsCount: data?.paging?.totalRecords ?? 0,
            followupRecords_quotation: data?.followupRecords ?? 0
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };

  getInquiries = () => {
    var reqURL = "inquiries?page=0&records=10&isFollowupCountRequired=true";
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        let results = data.result;

        this.setState(
          {
            resultsInquiry: results,
            inquiriesCount: data?.paging?.totalRecords ?? 0,
            followupRecords_inquiry: data?.followupRecords ?? 0
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };

  getCount = () => {
    this.setState({
      inquiriesLoading: this.state.resultsInquiry,
      itinerariesLoading: this.state.results,
      quotationsLoading: this.state.results,
      bookingsLoading: this.state.bookings,
      packagesLoading: this.state.packages,
    });
  };

  // Getting All Types of Booking
  getBookings = () => {
    var reqURL = "api/v1/mybookings";
    var reqOBJ = {
      Request: {
        Data: "all",
      },
      Flags: {},
      Info: { PersonateId: localStorage.getItem("personateId") }
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      let resultsBookings = [];
      data.response.data.map((x) =>
        x[Object.keys(x)[0]].map((item) => {
          resultsBookings.push(item);
        })
      );

      this.setState(
        {
          bookings: data.response,
          resultsBookings,
          bookingsCount: data.response.pageInfo.totalResults,
        },
        () => (this.getCount(), this.setBookingData())
      );
    });
  };

  setBookingData = () => {
    if (this.state.bookings) {
      var week = [];
      let daywisebooking = [[], [], [], [], [], [], []];

      [...Array(7).keys()].map((key) =>
        week.push(moment(new Date()).subtract(key, "days").format("DD MMM"))
      );
      week.sort();

      this.state.bookings.data.map((item, key) => {
        let booking = item[Object.keys(item)[0]][0];
        let date = moment(booking.bookingDate).format("DD MMM");

        week.map(
          (item, key) => date === week[key] && daywisebooking[key].push(date)
        );
      });

      let perDayBooking = [];
      week.map((item, key) => perDayBooking.push(daywisebooking[key].length));

      this.setState({ week, perDayBooking });
    }
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

  getBasicDataForCustomerPortal = () => {
    var reqURL = "tw/portal/info";
    apiRequester_unified_api(
      reqURL,
      null,
      (data) => {
        if (data.error) return;
        else {
          localStorage.setItem("customHomeURL", data?.response[0].customHomeURL);
          localStorage.setItem("isCMSPortalCreated", data?.response[0].isCMSPortalCreated === "true");
          this.setState({ customerPortalURL: data?.response[0].customHomeURL, isCMSPortalCreated: data?.response[0].isCMSPortalCreated === "true", ShowTaxConfigurationPopup: data?.response[0].showTaxConfigurationPopup === "true" });
        }
      }, 'GET');
  }

  getPackages = () => {
    var reqURL =
      "cms/package/getall?page=0&ismaster=false&iscmspackage=false&records=5&packagetheme=0";
    const reqOBJ = {};
    apiRequester_unified_api(reqURL, reqOBJ, function (data) {
      debugger
      this.setState(
        {
          packages: data.response,
          resultsPackages: data.response,
          packagesCount: data.paging.totalRecords,
          packagesFollowUpCount: data.response.filter((x) => x.packagethemeid !== 13 && (new Date().toISOString().split('T')[0]) === x.bookBefore?.split('T')[0]).length,
        },
        () => (this.getCount())

      );
    }.bind(this), "GET");
  }

  getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      this.getQuotations();
      this.getItineraries();
      this.getInquiries();
      this.getPackages();
      this.getBookings(this.state.defaultFilters);
      this.getBasicDataForCustomerPortal();
      this.getCurrentSubscriptionDetails();
      this.getRewardpoints();
    });
  };

  quotationDetails = (item, type) => {
    let customerDetails = {
      customerName: item.data.customerName,
      email: item.data.email,
      phone: item.data.phone,
      title: item.data.name,
      terms: item.data.terms,
      duration: item.data.duration,
      startDate: item.data.startDate,
      endDate: item.data.endDate,
      type: item.data.type,
      status: item.data.status,
      inquiryId: item.data.inquiryId,
      configurations: item.data.configurations
    };

    let quotationItems = [];

    item.data.offlineItems &&
      JSON.parse(item.data.offlineItems) &&
      JSON.parse(item.data.offlineItems).map(
        (item) => item.offlineItem && quotationItems.push(item)
      );

    localStorage.setItem("cartLocalId", item.id ? item.id : "");
    localStorage.setItem("quotationDetails", JSON.stringify(customerDetails));
    localStorage.setItem("quotationItems", JSON.stringify(quotationItems));
    this.props.history.push(`/${type}/Details`);
  };

  getLoadingHTML = (subscription) => {
    if (!subscription) {
      return [...Array(4).keys()].map((item) => {
        return (
          <div className="pl-3 pr-3 pt-2 bookings-loading" key={item}>
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
    }
    else if (subscription === "subscription") {
      return (
        <div className="pl-3 pr-3 pt-2 bookings-loading">
          <div className="pb-2">
            <div className="row">
              <div className="col-lg-12">
                <b className="w-100 d-inline-block mb-2">&nbsp;</b>
              </div>
              <div className="col-lg-12">
                <b className="w-100 d-inline-block mb-2">&nbsp;</b>
              </div>
              <div className="col-lg-12">
                <b className="w-100 d-inline-block mb-2">&nbsp;</b>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (subscription === "reward") {
      return (
        <div className="pl-3 pr-3 pt-2 bookings-loading">
          <div className="row">
            <div className="col-lg-12">
              <b className="w-100 d-inline-block mb-2">&nbsp;</b>
            </div>
          </div>
        </div>
      );
    }
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

  handleAssistant = () => {
    this.setState({ isTrialAI: !this.state.isTrialAI });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAuthToken();
    if (this.props.userInfo.isMaintananceActivityOnTourwiz) {
      this.getReleaseNoteDetails();
    }
  }


  getReleaseNoteDetails = async () => {
    var fileData = await this.postData();
    var todayDate = new Date().toISOString().split('T')[0];
    if (fileData.releaseDates.filter(x => x === todayDate).length > 0) {
      var notedData = fileData.ReleaseNotes.find(x => x.date === todayDate);
      if (notedData) {
        if (moment().isBetween(moment(notedData.starttime), moment(notedData.endtime))) {
          this.setState({ releaseNoteDetails: notedData });
        }
      }
    }
  };
  postData = async (url = "", data = {}) => {
    let responseData = '';
    await fetch(process.env.REACT_APP_GETRELEASENOTE_ENDPOINT)
      .then(response => response.json())
      .then(response => responseData = response)
      .catch(err => console.error(err));
    return responseData;

  };
  render() {
    if (!this.props.userInfo.rolePermissions
      || (this.props.userInfo.rolePermissions && !AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~dashboard"))
    ) {
      return <div className="row p-3">
        <div className="container ">
          <Loader />
        </div>
      </div>;
    }
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");
    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    const {
      itinerariesCount,
      quotationsCount,
      bookingsCount,
      packagesCount,
      packagesFollowUpCount,
      perDayBooking,
      perDayPackage,
      inquiriesCount,
      resultsQuotations,
      resultsItineraries,
      resultsBookings,
      resultsPackages,
      isSubscriptionMsg,
      isSOnboardingInfo,
      isRewardPoints,
      isCMSWebsite,
      customerPortalURL,
      isCMSPortalCreated,
      followupRecords_itinerary,
      followupRecords_quotation,
      followupRecords_inquiry,
      isViewInquiry,
      releaseNoteDetails
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
        {
          label: "Packages",
          backgroundColor: "rgba(135, 94, 192, 1)",
          borderColor: "rgba(135, 94, 192, 1)",
          data: perDayPackage,
          fill: false,
        },
      ],
    };

    const css = `
    .navbar .dashboard-btn {
        display: none !important;
    }
    .glowNew{
      animation: blinker 1s linear infinite;
      background:linear-gradient(135deg,
        rgba(235, 72, 134, 1) 0%,
        rgba(184, 85, 164, 1) 100%)
    }
    .glow{
      animation: blinker 1s linear infinite;
      color:"white";
    }
    @keyframes blinker {
    
      50% {
        opacity: 0;
     }
    }
    `;
    return (
      <div className="agent-dashboard">
        <style>{css}</style>
        <Helmet>
          <title>
            Dashboard
          </title>
        </Helmet>
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
            </h1>
            {/* {isPersonateEnabled && (
              <div className="pull-right" style={{ marginTop: "-2px" }}>
                <CallCenter />
              </div>
            )} */}
          </div>
        </div>
        <div className="container">
          <div>
            <div className="row">
              <div className="col-lg-3 hideMenu">
                <QuotationMenu handleMenuClick={this.handleRedirect} userInfo={this.props.userInfo} {...this.props} />
              </div>

              <div className="col-lg-9">
                <div className="mt-4">

                  {/* {this.props.userInfo.rolePermissions && (
                    <AuthorizeComponent title="dashboard-menu~marketplacepackage-view-community" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                      <div className="row agent-dashboard-countboxes mb-3">
                        <div className="col-lg-6">
                          <div className="p-0 agent-dashboard-countbox agent-dashboard-countbox-5 shadow-sm">
                            <Link
                              to="/Marketplace"
                              target="_blank"
                              className="text-white text-decoration-none"
                            ><h5 className="m-0 p-3">Marketplace</h5></Link>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="p-0 agent-dashboard-countbox agent-dashboard-countbox-6 shadow-sm">

                            <Link
                              to="/community"
                              target="_blank"
                              className="text-white text-decoration-none"
                            ><h5 className="m-0 p-3">Community</h5></Link>
                          </div>
                        </div>
                      </div>

                    </AuthorizeComponent>)} */}
                  {/* {!this.state.currentPlanendDate &&
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          {this.getLoadingHTML('subscription')}
                        </div>
                      </div>
                    </div>
                  } */}
                  {releaseNoteDetails &&
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert text-white" style={{ background: "#fd3d3dab" }}>
                          <HtmlParser text={releaseNoteDetails.message} />
                        </div>
                      </div>
                    </div>
                  }
                  {!isCMSPortalCreated &&
                    <div className="row d-none">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          <span className="badge badge-success glowNew mr-2">New</span>
                          <>{`Customer Self-Management Portal: TourWiz by default provides you a special page where your registered customers can log in and see all their travel information, like Inquiries, review quotes Itineraries, plans, invoices, ledger, unpaid invoices reports. They can even make payments on this page, if you have registered with us for payments.`}</>
                          <>{this.state.showMoreMicrosite && <> <br /><br />The Corporate/customer self-service portal lets the customers manage their travel saving you and your employees a lot of time and effort thus resulting in saving of tens of thousands.<br /><br />

                            * Actual amount depends on the number of corporates and customers
                            The special page also has content from the marketplace. Any inquiry made by a customer from this page is logged into your TourWiz CRM. Even if you sell 5 packages extra a month using this content, it will give you additional revenue in tens of thousands per annum thus recovering your subscriptions.</>}</>
                          <button
                            onClick={() =>
                              this.setState({ showMoreMicrosite: !this.state.showMoreMicrosite })}
                            className="btn btn-link pull-right p-0 m-0 text-primary"
                          >
                            {this.state.showMoreMicrosite ? `Less...` : `More...`}
                          </button>
                          <br />
                          <br />
                          Just share this link with your registered customers
                          <br /><a className={"btn btn-" + "primary mb-2 mt-2 p-2 mb-2 badge "} target="_blank" href={"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.customerPortalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '').replace('.mytriponline.net', '')}>
                            {"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.customerPortalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '').replace('.mytriponline.net', '')}</a><br />

                        </div>
                      </div>
                    </div>
                  }
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="alert alert-light border text-dark">
                        <span className="badge badge-success glowNew mr-2">New</span>
                        <button
                          onClick={() => this.props.history.push("/Quotation/CreateQuick")}
                          className="btn btn-link p-0 text-primary"
                        >
                          Quick Proposal
                        </button> Users can now send quick proposals to their customers, along with the ability to upload documents.
                      </div>
                    </div>
                  </div>
                  {!isCMSPortalCreated &&
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          <span className="badge badge-success glowNew mr-2">New</span>
                          {/* <button
                          onClick={() => this.props.history.push("/QuickPackage/add")}
                          className="btn btn-link p-0 text-primary"
                        >
                          TourWizAI Lite<sup>BETA</sup>
                        </button>  */}
                          Introducing our ground-breaking <b className="text-primary"><a className={"text-primary "} target="_blank" href={"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.customerPortalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '').replace('.mytriponline.net', '')}>
                            Customer Self-Service Portal</a></b>, a game-changer in the B2B industry. Let your customers effortlessly manage their own travel documents, review statements, download invoices, and even make direct payments...
                          <button
                            onClick={() => this.handleAssistant()}
                            className="btn btn-link pull-right p-0 m-0 text-primary"
                          >
                            More...
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                  {false && isSubscriptionMsg && this.state.currentPlanendDate && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          {this.state.currentPlanendName === "Trial" && this.state.currentPlanStatus && this.state.currentPlanStatus.toLowerCase() !== "expired" &&
                            <React.Fragment>
                              Thank you for signing up for a freemium plan of TourWiz.
                              {/* <a className="ml-1" data-tip="React-tooltip">
                                <img
                                  style={{ filter: "none" }}
                                  src={info}
                                  alt=""
                                />
                              </a>
                              <ReactTooltip aria-haspopup="true" role="example">
                                <b className="pb-1">Tasks</b>
                                <ul className="list-unstyled p-0 pb-0 mb-0">
                                  <li className="pb-1 text-left">30 Inquiries</li>
                                  <li className="pb-1 text-left">05 Packages</li>
                                  <li className="pb-1 text-left">05 Itineraries</li>
                                  <li className="pb-1 text-left">05 Quotations</li>
                                  <li className="pb-1 text-left">05 Customers</li>
                                  <li className="pb-1 text-left">01 Employee</li>
                                </ul>
                              </ReactTooltip> */}
                            </React.Fragment>
                          }

                          {this.state.currentPlanendName !== "Trial" && this.state.currentPlanStatus && this.state.currentPlanStatus.toLowerCase() !== "expired" &&
                            <React.Fragment>
                              Thank you for subscription of a {this.state.currentPlanendName + '-' + this.state.currentPlanDuration} plan of TourWiz, Your plan will end on {this.state.currentPlanendDate ? (<DateComp date={this.state.currentPlanendDate} format={"ll"} />) : '---'}
                            </React.Fragment>
                          }

                          {this.state.currentPlanStatus && this.state.currentPlanendName !== "Trial" && this.state.currentPlanStatus.toLowerCase() === "expired" &&
                            <React.Fragment>
                              <span class="text-danger font-weight-bold">Your subscription of a {this.state.currentPlanendName === "Trial" ? "freemium" : this.state.currentPlanendName + '-' + this.state.currentPlanDuration} plan of TourWiz has been expired. Kindly renew your subscription to access all system features.</span>
                              <br />
                            </React.Fragment>
                          }

                          {this.state.currentPlanStatus && this.state.currentPlanendName === "Trial" && this.state.currentPlanStatus.toLowerCase() === "expired" &&
                            <React.Fragment>
                              <span class="text-danger font-weight-bold">Subscribe your plan soon to access all exclusive features.</span>
                              <br />
                            </React.Fragment>
                          }

                          <br />
                          <Link
                            to="/BillingAndSubscription"
                            className="text-primary"
                          >
                            Manage your Billing & Subscription
                          </Link>

                          {this.state.currentPlanextendedDays > 0 && this.state.currentPlanStatus.toLowerCase() !== "expired" && this.state.currentPlanendName !== "Trial" &&
                            <span><br /><br />As per your request, we have extended your subscription of {this.state.currentPlanendName === "Trial" ? "freemium" : this.state.currentPlanendName + '-' + this.state.currentPlanDuration} plan by {this.state.currentPlanextendedDays} day(s) effective from {<DateComp date={this.state.actualPlanEndDate} format={"ll"} />}.</span>
                          }
                          <button
                            className="btn btn-link pull-right p-0 m-0 text-secondary"
                            onClick={this.handleSubscriptionMsg}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCMSWebsite && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          {customerPortalURL && isCMSPortalCreated ? "Preview your website : " : "Get yourself a professional website/microsite pre-loaded with 700+ itineraries and more at a nominal price."}
                          {/* {!customerPortalURL &&
                            <Link
                              to="/CMSHome"
                              target="_blank"
                              className="text-primary ml-3"
                            >
                              Preview Website
                            </Link>
                          } */}
                          {
                            customerPortalURL && isCMSPortalCreated && <>
                              <a
                                href={customerPortalURL}
                                target="_blank"
                                className="btn btn-primary mb-2 mt-2 p-2 mb-2 badge text-white ml-3"
                              >
                                {customerPortalURL}
                              </a>
                              <Link
                                to="/ChangeDomain"
                                className="text-primary ml-3"
                              >
                                Change Domain
                              </Link>
                              <Link
                                to="/SelectTemplate"
                                className="text-primary ml-3"
                              >
                                Change Template
                              </Link>
                            </>
                          }

                          {
                            !isCMSPortalCreated &&
                            <>
                              <Link
                                to="/SelectTemplate"
                                className="text-primary ml-3"
                              >
                                Select Template
                              </Link>
                              <Link
                                to="/CustomerWebsite"
                                className="text-primary ml-3"
                              >
                                Claim Your Website
                              </Link></>
                          }

                        </div >
                      </div >
                    </div >
                  )
                  }
                  {/* {this.state.totalrewardpoints === 0 &&
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="alert alert-light border text-dark">
                          {this.getLoadingHTML('reward')}
                        </div>
                      </div>
                    </div>
                  } */}
                  <AuthorizeComponent title="dashboard-menu~rewardprogram" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                    {false && isRewardPoints && this.state.totalrewardpoints > 0 && (
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="alert alert-light border text-dark">
                            You have earned{" "}
                            <b className="text-primary">
                              {this.state.totalrewardpoints}
                            </b>{" "}
                            reward points.
                            <Link to="/Rewards" className="text-primary ml-3">
                              How to earn reward points?
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </AuthorizeComponent>
                  {
                    isSOnboardingInfo && (
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="alert alert-light border text-dark">
                            <h5>Let’s help you get started</h5>

                            <ul className="list-unstyled row mb-2">
                              <li className="col-lg-6 mt-2">
                                <button
                                  onClick={() => this.props.history.push("/QuickPackage/add")}
                                  className="btn btn-link p-0 text-primary"
                                >
                                  TourWizAI Lite<sup>BETA</sup>
                                </button>
                              </li>
                              <li className="col-lg-6 mt-2">
                                <Link
                                  to="/BillingAndSubscription"
                                  className="text-primary"
                                >
                                  Manage your Billing & Subscription
                                </Link>
                              </li>
                              <li className="col-lg-6 mt-2">
                                {AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~agentsettings-profile") ?
                                  <Link
                                    to="/UpdateProfile"
                                    className="text-secondary"
                                  >
                                    Set up your business details
                                  </Link> :
                                  <button
                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~agentsettings-profile") ? this.history.push("/UpdateProfile") : this.setState({ isshowauthorizepopup: true })}
                                    className="btn btn-link p-0 text-secondary "
                                  >
                                    Set up your business details
                                  </button>
                                }
                              </li>
                              <li className="col-lg-6 mt-2">
                                {AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-addemployee") ?
                                  <button onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "EmployeeList~agentsettings-addemployee")
                                    ? this.setState({ isSubscriptionPlanend: true }) :
                                    this.props.history.push("/Employee/Add")}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Set up your employees
                                  </button> :
                                  <button
                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-addemployee") ? this.history.push("/Employee/Add") : this.setState({ isshowauthorizepopup: true })}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Set up your employees
                                  </button>
                                }
                              </li>
                              <li className="col-lg-6 mt-2">
                                {AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~customer-add-customers") ?
                                  <button onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "Customer-list~customer-add-customers")
                                    ? this.setState({ isSubscriptionPlanend: true }) :
                                    this.props.history.push("/Customer/add")}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Add customers
                                  </button> :
                                  <button
                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~customer-add-customers") ? this.history.push("/Customer/add") : this.setState({ isshowauthorizepopup: true })}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Add customers
                                  </button>
                                }
                              </li>

                              <li className="col-lg-6 mt-2">
                                {AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry") ?
                                  <button
                                    onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~inquiries-create-inquiry")
                                      ? this.setState({ isSubscriptionPlanend: true }) :
                                      this.props.history.push("/Inquiry")}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Add inquiry
                                  </button> :
                                  <button
                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-create-inquiry") ? this.history.push("/Inquiry") : this.setState({ isshowauthorizepopup: true })}
                                    className="btn btn-link p-0 text-secondary"
                                  >
                                    Add inquiry
                                  </button>
                                }
                              </li>

                            </ul>

                            <button
                              className="btn btn-primary"
                              onClick={this.handleSOnboardingInfo}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                padding: "0px",
                                margin: "0px",
                                textAlign: "center",
                                border: "0px none",
                                width: "20px",
                                height: "20px",
                                lineHeight: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                              }}
                            >
                              <span
                                aria-hidden="true"
                                style={{ marginTop: "-4px" }}
                              >
                                &times;
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  }



                  <div className="row agent-dashboard-countboxes">
                    <div className="col-lg-2 count-box">
                      <div className="agent-dashboard-countbox agent-dashboard-countbox-1 shadow-sm">
                        <h2>{inquiriesCount}</h2>
                        <h5>Inquiries</h5>
                      </div>
                    </div>

                    <div className="col-lg-2 count-box">
                      <div className="agent-dashboard-countbox agent-dashboard-countbox-2 shadow-sm">
                        <h2>{itinerariesCount}</h2>
                        <h5>Itineraries</h5>
                      </div>
                    </div>

                    <div className="col-lg-2 count-box">
                      <div className="agent-dashboard-countbox agent-dashboard-countbox-3 shadow-sm">
                        <h2>{quotationsCount}</h2>
                        <h5>{Trans("_quotationReplaceKeys")}</h5>
                      </div>
                    </div>

                    <div className="col-lg-2 count-box">
                      <div className="agent-dashboard-countbox agent-dashboard-countbox-4-1 shadow-sm">
                        <h2>{packagesCount}</h2>
                        <h5>Packages</h5>
                      </div>
                    </div>

                    <div className="col-lg-2 count-box">
                      <div className="agent-dashboard-countbox agent-dashboard-countbox-4 shadow-sm">
                        <h2>{bookingsCount}</h2>
                        <h5>Bookings</h5>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="row">
                      <AuthorizeComponent title="dashboard~dashboard-latestinquiries" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        <div className="col-lg-6 d-flex mb-4">
                          <div className="shadow-sm bg-white d-block w-100">
                            <h6 className="p-3 border-bottom mb-0">
                              Latest Inquiries{" "}
                              <button
                                className="btn btn-link-primary pull-right text-primary"
                                style={{
                                  padding: "0px",
                                  margin: "0px",
                                  lineHeight: "18px",
                                }}
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                  "dashboard-menu~inquiries-manage-inquiry")
                                  ? this.props.history.push("/InquiryList")
                                  : this.setState({ isshowauthorizepopup: true })
                                }
                              >
                                View All
                              </button>
                              {followupRecords_inquiry > 0 &&
                                <small class="badge badge-primary p-1 pull-right mr-2 agent-dashboard-countbox-1" type="button"
                                  onClick={() => {
                                    this.props.history.push("/InquiryList/followup-today");
                                  }}>
                                  Today's Follow-up
                                  <span class="badge badge-light ml-1">
                                    {followupRecords_inquiry}
                                  </span>

                                </small>}
                            </h6>
                            <div className="small">
                              <div className="pt-2 pb-2">
                                {this.state.resultsInquiry &&
                                  this.state.resultsInquiry.map(
                                    (item, key) =>
                                      key < 5 && (
                                        <div className="pl-3 pr-3 pt-2" key={key}>
                                          <div className="pb-2">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div>{item.title}</div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div>{item.from}</div>
                                              </div>
                                              <div className="col-lg-2">
                                                <div>
                                                  <a
                                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                      "dashboard~dashboard-latestinquiries-view")
                                                      ? this.ViewInquiry(item)
                                                      : this.setState({ isshowauthorizepopup: true })
                                                    }
                                                    className="text-primary"
                                                    style={{ "cursor": "pointer" }}
                                                  >
                                                    View
                                                  </a>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                {this.state.resultsInquiry === "" &&
                                  this.getLoadingHTML()}
                                {inquiriesCount === 0 && (
                                  <div className="pl-3 pr-3 pt-2">
                                    No Records available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AuthorizeComponent>
                      <AuthorizeComponent title="dashboard~dashboard-latestitineraries" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        <div className="col-lg-6 d-flex mb-4">
                          <div className="shadow-sm bg-white d-block w-100">
                            <h6 className="p-3 border-bottom mb-0">
                              Latest Itineraries
                              <button
                                className="btn btn-link-primary pull-right text-primary"
                                style={{
                                  padding: "0px",
                                  margin: "0px",
                                  lineHeight: "18px",
                                }}

                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                  "dashboard-menu~itineraries-manage-itineraries")
                                  ? this.props.history.push("/ItineraryList")
                                  : this.setState({ isshowauthorizepopup: true })
                                }

                              >
                                View All
                              </button>
                              {followupRecords_itinerary > 0 &&
                                <small class="badge badge-primary p-1 pull-right mr-2 agent-dashboard-countbox-2" type="button"
                                  onClick={() => {
                                    this.props.history.push("/ItineraryList/supplier-followup-today");
                                  }}>
                                  Today's Supplier Follow-up
                                  <span class="badge badge-light ml-1">{followupRecords_itinerary}</span>
                                </small>}
                            </h6>
                            <div className="small">
                              <div className="pt-2 pb-2">
                                {resultsItineraries &&
                                  resultsItineraries.map(
                                    (item, key) =>
                                      key < 5 && (
                                        <div className="pl-3 pr-3 pt-2" key={key}>
                                          <div className="pb-2">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div>{item.data.name}</div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div>
                                                  {item.data.customerName}
                                                </div>
                                              </div>
                                              <div className="col-lg-2">
                                                <a
                                                  onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                    "dashboard~dashboard-latestitineraries-view")
                                                    ? this.quotationDetails(item, "Itinerary")
                                                    : this.setState({ isshowauthorizepopup: true })
                                                  }
                                                  className="text-primary"
                                                  style={{ "cursor": "pointer" }}
                                                >
                                                  View
                                                </a>
                                                {/* Quotation */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                {!resultsItineraries && this.getLoadingHTML()}
                                {itinerariesCount === 0 && (
                                  <div className="pl-3 pr-3 pt-2">
                                    No Records available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AuthorizeComponent>
                      {isViewInquiry && (
                        <ModelPopup
                          header={this.state.itemtoview.title}
                          content={<InquiryView
                            item={this.state.itemtoview}
                            handleHide={this.handleHidePopup}
                            userInfo={this.props.userInfo}
                          />
                          }
                          handleHide={this.handleHidePopup}
                        />
                      )}
                    </div>

                    <div className="row">
                      <AuthorizeComponent title="dashboard~dashboard-latestquotations" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        <div className="col-lg-6 d-flex mb-4">
                          <div className="shadow-sm bg-white d-block w-100">
                            <h6 className="p-3 border-bottom mb-0">
                              Latest {Trans("_quotationReplaceKeys")}
                              <button
                                className="btn btn-link-primary pull-right text-primary"
                                style={{
                                  padding: "0px",
                                  margin: "0px",
                                  lineHeight: "18px",
                                }}

                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                  "dashboard-menu~quotation-manage-quotation")
                                  ? this.props.history.push("/QuotationList")
                                  : this.setState({ isshowauthorizepopup: true })
                                }
                              >
                                View All
                              </button>
                              {followupRecords_quotation > 0 &&
                                <small class="badge badge-primary p-1 pull-right mr-2 agent-dashboard-countbox-3" type="button"
                                  onClick={() => {
                                    this.props.history.push("/QuotationList/supplier-followup-today");
                                  }}>
                                  Today's Supplier Follow-up
                                  <span class="badge badge-light ml-1">{followupRecords_quotation}</span>
                                </small>}
                            </h6>
                            <div className="small">
                              <div className="pt-2 pb-2">
                                {resultsQuotations &&
                                  resultsQuotations.map(
                                    (item, key) =>
                                      key < 5 && (
                                        <div className="pl-3 pr-3 pt-2" key={key}>
                                          <div className="pb-2">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div>{item.data.name}</div>
                                              </div>

                                              <div className="col-lg-4">
                                                <div>
                                                  {item.data.customerName}
                                                </div>
                                              </div>
                                              <div className="col-lg-2">
                                                <a
                                                  onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                    "dashboard~dashboard-latestquotations-view")
                                                    ? this.quotationDetails(item, "Quotation")
                                                    : this.setState({ isshowauthorizepopup: true })
                                                  }
                                                  className="text-primary"
                                                  style={{ "cursor": "pointer" }}
                                                >
                                                  View
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                {!resultsQuotations && this.getLoadingHTML()}
                                {quotationsCount === 0 && (
                                  <div className="pl-3 pr-3 pt-2">
                                    No Records available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AuthorizeComponent>
                      <AuthorizeComponent title="dashboard~dashboard-latestpackages" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        <div className="col-lg-6 d-flex mb-4">
                          <div className="shadow-sm bg-white d-block w-100">
                            <h6 className="p-3 border-bottom mb-0">
                              Latest Packages
                              <button
                                className="btn btn-link-primary pull-right text-primary"
                                style={{
                                  padding: "0px",
                                  margin: "0px",
                                  lineHeight: "18px",
                                }}
                                onClick={() => {
                                  AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                    "dashboard~dashboard-latestpackages")
                                    ? this.props.history.push("/PackageList")
                                    : this.setState({ isshowauthorizepopup: true })
                                }}
                              >
                                View All
                              </button>
                              {resultsPackages && resultsPackages.length > 0 && packagesFollowUpCount > 0 &&
                                <small class="badge badge-primary p-1 pull-right mr-2 agent-dashboard-countbox-4-1" type="button"
                                  onClick={() => {
                                    this.props.history.push("/PackageList/followup");
                                  }}>
                                  Today's Supplier Follow-up
                                  <span class="badge badge-light ml-1">{packagesFollowUpCount}</span>
                                </small>}
                            </h6>
                            <div className="small">
                              <div className="pt-2 pb-2">
                                {resultsPackages &&
                                  resultsPackages.slice(0, 5).map(
                                    (item, key) =>
                                      key < 5 && (
                                        <div className="pl-3 pr-3 pt-2" key={key}>
                                          <div className="pb-2">
                                            <div className="row">
                                              <div className="col-lg-5">
                                                <div
                                                  style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {item.shortDescription}
                                                </div>
                                              </div>
                                              <div className="col-lg-3">
                                                <div
                                                  style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {item.twCustomerName}
                                                </div>
                                              </div>

                                              <div className="col-lg-2 text-right">
                                                <div>{item.bookingStatus}</div>
                                              </div>
                                              <div className="col-lg-1 text-right">
                                                <div>
                                                  <a
                                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                      "dashboard~dashboard-latestpackages")
                                                      ? window.open(`/Packageview/${btoa(item.specialPromotionID)}`, "_blank")//this.props.history.push(`/Packageview/${btoa(item.specialPromotionID)}`)
                                                      : this.setState({ isshowauthorizepopup: true })
                                                    }
                                                    className="text-primary"
                                                    style={{ "cursor": "pointer" }}
                                                  >
                                                    View
                                                  </a>

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                {!resultsPackages && this.getLoadingHTML()}
                                {packagesCount === 0 && (
                                  <div className="pl-3 pr-3 pt-2">
                                    No Records available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AuthorizeComponent>
                    </div>

                    <div className="row">
                      <AuthorizeComponent title="dashboard~dashboard-latestbookings" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        <div className="col-lg-12 d-flex mb-4">
                          <div className="shadow-sm bg-white d-block w-100">
                            <h6 className="p-3 border-bottom mb-0">
                              Latest Bookings
                              <button
                                className="btn btn-link-primary pull-right text-primary"
                                style={{
                                  padding: "0px",
                                  margin: "0px",
                                  lineHeight: "18px",
                                }}
                                onClick={() => {
                                  AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                    "dashboard~dashboard-latestbookings")
                                    ? this.props.history.push("/Bookings")
                                    : this.setState({ isshowauthorizepopup: true })
                                }}
                              >
                                View All
                              </button>
                            </h6>
                            <div className="small">
                              <div className="pt-2 pb-2">
                                {resultsBookings &&
                                  resultsBookings.slice(0, 5).map(
                                    (item, key) =>
                                      key < 5 && (
                                        <div className="pl-3 pr-3 pt-2" key={key}>
                                          <div className="pb-2">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div
                                                  style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {item.businessDescription +
                                                    " - " +
                                                    item.details}
                                                </div>
                                              </div>
                                              <div className="col-lg-3">
                                                <div
                                                  style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  {item.firstName +
                                                    " " +
                                                    item.lastName}
                                                </div>
                                              </div>

                                              <div className="col-lg-2 text-center">
                                                <div>{item.bookingStatus}</div>
                                              </div>
                                              <div className="col-lg-1 text-center">
                                                <div>
                                                  <a
                                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                      "dashboard~dashboard-latestbookings")
                                                      ? this.props.history.push(`/ViewBooking/view/${item.itineraryRefNo
                                                        }/${btoa(item.bookingRefNo)}`)
                                                      : this.setState({ isshowauthorizepopup: true })
                                                    }
                                                    className="text-primary"
                                                    style={{ "cursor": "pointer" }}
                                                  >
                                                    View
                                                  </a>

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                {!resultsBookings && this.getLoadingHTML()}
                                {bookingsCount === 0 && (
                                  <div className="pl-3 pr-3 pt-2">
                                    No Records available
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AuthorizeComponent>
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
                      {/* {this.state.isTrialAI &&
                        <AssistantModelPopup
                          content={
                            <PackageAIAssitantTrial
                              handleHide={this.handleAssistant}
                              promptMode="Itinerary"
                              trialMode={true}
                              isFromDashBoard={true}
                            />}
                          sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
                          handleHide={this.handleAssistant}
                        />
                      } */}
                      {this.state.isTrialAI &&
                        <AssistantModelPopup
                          content={<SelfServicePortal
                            handleHide={this.handleAssistant}
                            customerPortalURL={"https://www" + process.env.REACT_APP_B2CCMSADMINDOMAIN + '/' + this.state.customerPortalURL.replace("http://", '').replace('https://', '').replace(process.env.REACT_APP_B2CCMSADMINDOMAIN, '').replace('.mytriponline.tech', '').replace('.mytriponline.net', '')}
                          />}

                          sizeClass="modal-dialog modal-lg modal-dialog-centered p-0"
                          handleHide={this.handleAssistant}
                        />
                      }
                      <AuthorizeComponent title="dashboard-menu~agentsettings-tax-configuration" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        {this.state.ShowTaxConfigurationPopup && localStorage.getItem("showTaxConfigurationPopup") === null && <TaxConfigurationPopup />}
                      </AuthorizeComponent>
                    </div>
                  </div>
                  {
                    this.state.currentPlanendName === "Trial" && quotaUsage && (
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="alert alert-light border text-dark">
                            <h5><SVGIcon
                              name="limit"
                              width="24"
                              height="24"
                              className="mr-3"
                            ></SVGIcon>Usage Statistics</h5>
                            <ul className="list-unstyled row mb-2">
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManageInquiryIcon}
                                  alt=""
                                />
                                <b className="text-primary"> Inquiry - </b>{Number(quotaUsage.totalUsedinquiryQuota === null ? 0 : quotaUsage.totalUsedinquiryQuota) + "/" + quotaUsage.inquiryQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManageInquiryIconnew}
                                  alt=""
                                />
                                <b className="text-primary"> Itinerary - </b>{Number(quotaUsage.totalUseditineraryQuota === null ? 0 : quotaUsage.totalUseditineraryQuota) + "/" + quotaUsage.itineraryQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManageQuotationIconnew}
                                  alt=""
                                />
                                <b className="text-primary"> {Trans("_quotationReplaceKey")} - </b>{Number(quotaUsage.totalUsedquotationQuota === null ? 0 : quotaUsage.totalUsedquotationQuota) + "/" + quotaUsage.quotationQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManagePackageIcon}
                                  alt=""
                                />
                                <b className="text-primary"> Package - </b>{Number(quotaUsage.totalUsedpackageQuota === null ? 0 : quotaUsage.totalUsedpackageQuota) + "/" + quotaUsage.packageQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManagebookingIconnew}
                                  alt=""
                                />
                                <b className="text-primary"> Booking - </b>{Number(quotaUsage.totalUsedbookingQuota === null ? 0 : quotaUsage.totalUsedbookingQuota) + "/" + quotaUsage.bookingQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManageAgencyIconnew}
                                  alt=""
                                />
                                <b className="text-primary"> Customer - </b>{Number(quotaUsage.totalUsedcustomerQuota === null ? 0 : quotaUsage.totalUsedcustomerQuota) + "/" + quotaUsage.customerQuota}

                              </li>
                              <li className="col-lg-6 mt-2">

                                <img
                                  style={{ filter: "none", height: "22px", width: "22px" }}
                                  src={ManageAgencyIconnew}
                                  alt=""
                                />
                                <b className="text-primary"> Employee - </b>{Number(quotaUsage.totalUsedemployeeQuota === null ? 0 : quotaUsage.totalUsedemployeeQuota) + "/" + quotaUsage.employeeQuota}

                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div >
              </div >
            </div >
          </div >
        </div >
      </div >
    );
  }
}

export default DashboardAgent;
