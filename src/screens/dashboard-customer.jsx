import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import QuotationMenuCustomer from "../components/quotation/quotation-menu-customer";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import { Link, Link as ReactLink } from "react-router-dom";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopup from "../helpers/model";
import InquiryView from "../components/quotation/inquiry-view";

class DashboardCustomer extends Component {
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
      isViewInquiry: false,
      isSOnboardingInfo: true,
      isCMSWebsite: true,
      currentPlanendDate: "",
      currentPlanendName: "",
      currentPlanDuration: "",
    };
  }

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
          });
        }
      },
      "GET"
    );
  };

  getQuotations = () => {
    var reqURL = "quotations?type=Quotation&page=0&records=10";
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;
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
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };
  getItineraries = () => {
    var reqURL = "quotations?type=Itinerary&page=0&records=10";
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;
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
          (item) => (
            item.data.type === "Itinerary" && resultsItineraries.push(item)
          )
        );
        this.setState(
          {
            results: data.result,
            resultsItineraries,
            itinerariesCount: data?.paging?.totalRecords ?? 0,
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };

  getInquiries = () => {
    var reqURL = "inquiries?page=0&records=10";
    if (localStorage.getItem('portalType') === 'B2C')
      reqURL += "&customerId=" + this.props.userInfo.customerID;
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
          },
          () => this.getCount()
        );
      },
      "GET"
    );
  };

  getCount = () => {
    let inquiriesCount = 0,
      itinerariesCount = 0,
      quotationsCount = 0,
      bookingsCount = 0;

    // if (this.state.results) {
    //   this.state.results.map((x) => {
    //     x.data.type === "Itinerary" && itinerariesCount++;
    //     x.data.type === "Quotation" && quotationsCount++;
    //   });
    // }
    if (this.state.resultsInquiry) {
      inquiriesCount = this.state.inquiriesCount;
    }
    if (this.state.resultsItineraries) {
      itinerariesCount = this.state.itinerariesCount;
    }
    if (this.state.resultsQuotations) {
      quotationsCount = this.state.quotationsCount;
    }
    if (this.state.bookings) {
      bookingsCount = this.state.bookings.pageInfo.totalResults;
    }

    this.setState({
      inquiriesCount,
      itinerariesCount,
      quotationsCount,
      bookingsCount,
      inquiriesLoading: this.state.resultsInquiry,
      itinerariesLoading: this.state.results,
      quotationsLoading: this.state.results,
      bookingsLoading: this.state.bookings,
    });
  };

  getPackages = () => {
    var reqURL =
      "cms/package/getall?page=0&ismaster=false&iscmspackage=false&records=5&packagetheme=0";
    if (localStorage.getItem('portalType') === 'B2C') {
      reqURL += "&phone=" + this.props.userInfo.contactInformation.phoneNumber;
    }
    const reqOBJ = {};
    apiRequester_unified_api(reqURL, reqOBJ, function (data) {
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

  // Getting All Types of Booking
  getBookings = () => {
    var reqURL = "api/v1/mybookings";
    var reqOBJ = {
      Request: {
        Data: "upcoming",
      },
      Flags: {},
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      let resultsBookings = [];
      data.response.data.map((x) =>
        x[Object.keys(x)[0]].map((item) => {
          resultsBookings.push(item);
        })
      );
      this.setState(
        { bookings: data.response, resultsBookings },
        () => (this.getCount(), this.setBookingData())
      );
    });
  };
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

  getAuthToken = () => {
    this.getQuotations();
    this.getItineraries();
    this.getInquiries();
    this.getPackages();
    this.getBookings(this.state.defaultFilters);
    /* var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
      this.getQuotations();
      this.getBookings(this.state.defaultFilters);
    }); */
  };
  viewDetailsMode = (id) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard~dashboard-latestpackages")) {
      let portalURL = window.location.origin;
      let portalType = localStorage.getItem('portalType')
      if (portalType === 'B2C') {
        portalURL = window.location.href.toLowerCase();
        window.open(`${portalURL}${portalURL.endsWith('/') ? '' : '/'}Packageview/${btoa(id)}`, "_blank");
      }
      else {
        window.open(`${portalURL}${portalURL.endsWith('/') ? '' : '/'}Packageview/${btoa(id)}`, "_blank");
      }
    }
    else
      this.setState({ isshowauthorizepopup: true });
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

  handleSOnboardingInfo = () => {
    this.setState({ isSOnboardingInfo: !this.state.isSOnboardingInfo });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAuthToken();
    this.getCurrentSubscriptionDetails();
  }

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");

    const {
      itinerariesCount,
      quotationsCount,
      bookingsCount,
      packagesFollowUpCount,
      packagesCount,
      perDayBooking,
      inquiriesCount,
      resultsQuotations,
      resultsItineraries,
      resultsBookings,
      resultsPackages,
      isViewInquiry,
      isSubscriptionMsg,
      isSOnboardingInfo,
      isCMSWebsite,
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
              <div className="col-lg-3">
                <QuotationMenuCustomer handleMenuClick={this.handleRedirect} />
              </div>

              <div className="col-lg-9">
                <div className="mt-4">

                  {isSOnboardingInfo && (
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="border bg-white rounded p-3 mb-3 position-relative">
                          <h5>Welcome {this.props.userInfo.firstName + ' ' + this.props.userInfo.lastName},</h5>

                          <ul className="list-unstyled row mb-2">
                            <li className="col-lg-6 mt-2">
                              <Link
                                to="/Bookings"
                                className="text-secondary"
                              >
                                My Bookings
                              </Link>
                            </li>
                            <li className="col-lg-6 mt-2">
                              <Link
                                to="/EditProfile"
                                className="text-secondary"
                              >
                                Update Profile
                              </Link>
                            </li>
                            <li className="col-lg-6 mt-2">
                              <Link
                                to="/EditProfile"
                                className="text-secondary"
                              >
                                Change Password
                              </Link>
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
                  )}

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

                      <div className="col-lg-6 d-flex1 mb-4">
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
                              onClick={() => {
                                this.props.history.push("/ItineraryList");
                              }}
                            >
                              View All
                            </button>
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
                                                href="javascript:void(0)"
                                                onClick={() =>
                                                  this.quotationDetails(
                                                    item,
                                                    "Itinerary"
                                                  )
                                                }
                                                className="text-primary"
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

                      <div className="col-lg-6 d-flex">
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
                              onClick={() => {
                                this.props.history.push("/QuotationList");
                              }}
                            >
                              View All
                            </button>
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
                                                href="javascript:void(0)"
                                                onClick={() =>
                                                  this.quotationDetails(
                                                    item,
                                                    "Quotation"
                                                  )
                                                }
                                                className="text-primary"
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
                      <div className="col-lg-6 d-flex ">
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
                                                    ? this.viewDetailsMode(item.specialPromotionID)
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
                    </div>

                    <div className="mt-4 row">
                      <div className="col-lg-12 d-flex">
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
                                this.props.history.push("/Bookings");
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
                                            <div className="col-lg-5">
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

                                            <div className="col-lg-2 text-right">
                                              <div>{item.bookingStatus}</div>
                                            </div>
                                            <div className="col-lg-1 text-right">
                                              <div>
                                                <ReactLink
                                                  to={`/ViewBooking/view/${item.itineraryRefNo
                                                    }/${btoa(item.bookingRefNo)}`}
                                                  className="text-primary"
                                                >
                                                  View
                                                </ReactLink>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardCustomer;
