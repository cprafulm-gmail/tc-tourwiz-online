import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import { Link } from "react-router-dom";
import PlanIconBasic from "../assets/images/tw/plan-icon-basic.svg";
import PlanIconPlus from "../assets/images/tw/plan-icon-plus.svg";
import PlanDiscountArrow from "../assets/images/tw/plan-discount-arrow.svg";
import { apiRequester } from "../services/requester";
import Config from "../config.json";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Date from "../helpers/date";
import * as Global from "../helpers/global";
import ComingSoon from "../helpers/coming-soon";
import info from "../assets/images/dashboard/info-circle.svg";
import ReactTooltip from 'react-tooltip';
import { Trans } from "../helpers/translate";
import { Helmet } from "react-helmet";

class BillingAndSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "travel-crm",
      activePoint: "",
      activePlan: "",
      currentPlan: this.props.match.params?.plan ? (atob(this.props.match.params.plan)).split('~')[1] : "q", //m = monthly & y = yearly
      currentPlanType: this.props.match.params?.plan ? ((atob(this.props.match.params.plan)).split('~')[0] === "int" ? "international" : "india") : (Global.getEnvironmetKeyValue("portalCurrencyCode") === "INR" ? "india" : "international"),
      isSuccess: false,
      isFailure: false,
      successFailureMsg: "",
      txnToken: "",
      gateWayrefNo: "",
      isPlanDetails: false,
      promoCode: "",
      currentPlanendDate: "",
      currentPlanendName: "",
      isLoading: false,
      pricedetails: [],
      isPromoCodeValid: true,
      currentPlanDuration: "",
      planStartdate: "",
      planEnddate: "",
      comingsoon: false,
      currentPlanextendedDays: "",
      currentPlanStatus: "",
      isPromoCodeApplied: false,
      isPromoCodeAppliedSuccess: false,
      isNewRegisteredUser: true,
      changeToMonthly: "",
      isBtnLoading: false,
      paymentid: 0,
      defaultPromoCode: ""
    };
    this.myRef = React.createRef();
  }

  getCurrentSubscriptionDetails = () => {

    let pricedetails = [];
    var reqURL = "tw/subscription/details";
    var reqOBJ = {};
    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data.response.length > 0) {
        this.setState({
          currentPlanendDate: data.response[0].endDate,
          currentPlanendName: data.response[0].planName,
          currentPlanDuration: data.response[0].planDuration,
          currentPlanextendedDays: data.response[0].extendedDays,
          currentPlanStatus: data.response[0].status,
          isNewRegisteredUser: data.response[0].isNewRegisteredUser,
          paymentid: data.response[0].paymentId,
          defaultPromoCode: data.response[0].defaultPromoCode
        });
      }

    }, "GET");

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

  makepayment = (isUseDifferentCard) => {
    this.setState({ isLoading: true });
    let PlanPeriod = this.state.currentPlan;
    let promocode = this.state.promoCode;
    if (this.state.paymentid === 0 && promocode.toLowerCase() === "march2022")
      promocode = "";
    if (this.state.changeToMonthly !== "")
      PlanPeriod = "m";
    let reqURL = "api/v1/plan/payment";
    let reqOBJ = {
      request: {
        AgentID: parseInt(this.props.userInfo.agentID),
        PlanID: "",
        Plan: this.state.activePlan === "" ? "Basic" : this.state.activePlan,
        IsInternational: Global.getEnvironmetKeyValue("portalCurrencyCode") === "INR" ? false : true,
        Period: PlanPeriod,
        PromoCode: promocode,
        PaymentGateway: isUseDifferentCard ? "CCAvenue" : "RazorPay",
        paymentGatewayID: isUseDifferentCard ? "CCAvenue" : "RazorPay",
        ReturnUrl: window.location.origin
          + (window.location.pathname.toLocaleLowerCase() === '/be.aspx' ? '/be.aspx/' : '/')
          + "BillingAndSubscription",
        CurrencySymbol: Global.getEnvironmetKeyValue("portalCurrencyCode") === "INR" ? "INR" : "USD"
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 0) {
          window.location.href = Config.paymentInitUrl + data.response.response;
        }
      }.bind(this)
    );
  }

  changePlan = (plan) => {
    if (this.state.currentPlanType === "india" && this.state.currentPlan === "q")
      plan = "y";
    else if ((this.state.currentPlanType === "india" && this.state.currentPlan === "y"))
      plan = "q";
    else if ((this.state.currentPlanType !== "india" && this.state.currentPlan === "y"))
      plan = "m";
    else if ((this.state.currentPlanType !== "india" && this.state.currentPlan === "m"))
      plan = "y";

    this.setState({
      currentPlan: plan,
      changeToMonthly: ""
    });
  };

  changePlanMonthly = () => {
    let changeToMonthly = this.state.changeToMonthly;
    this.setState({
      changeToMonthly: changeToMonthly === "" ? "m" : ""
    });
  };

  changePlanType = (plan) => {
    this.setState({
      currentPlanType: plan,
    });
  };

  componentDidMount() {
    if (this.props.match.params?.plan) {
      let planvalue = atob(this.props.match.params.plan);
      if (planvalue) {
        this.handlePlanDetails(planvalue.split('~')[2], planvalue.split('~')[1]);
      }
    }
    let transactiontoken = this.props.match.params.transactiontoken;
    if (transactiontoken && transactiontoken !== "plan") {
      let reqURL = "v1/pg/plan/payment/status/" + transactiontoken;
      let reqOBJ = {};
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.status.code === 0) {
            let action = data.response.action;
            let actionDescription = data.response.actionDescription;
            let txnToken = data.response.data;
            let gateWayrefNo = data.response.gateWayrefNo;
            let planStartdate = data.response.planStartDate;
            let planEnddate = data.response.planEndDate;
            let planName = data.response.planName;
            let planPeriod = data.response.planPeriod;
            if (planPeriod === "q")
              planPeriod = "Quarterly";
            else if (planPeriod === "m")
              planPeriod = "Monthly";
            else if (planPeriod === "y")
              planPeriod = "Yearly";
            /*
            {
              "action": "success",
              "actionDescription": "Completed",
              "data": "0921-AA00053",
              "gateWayrefNo": "310007552912"
            }
              */
            //window.location.href = Config.paymentInitUrl + data.response.response;
            let successFailureMsg = "";
            if (action !== "error") {
              successFailureMsg = "You have successfully subscribed to " + (planName && planPeriod ? planName + " - " + planPeriod : "Freemium") + " plan.";
              this.setState({ isSuccess: true, successFailureMsg: successFailureMsg, txnToken: txnToken, gateWayrefNo: gateWayrefNo, planStartdate: planStartdate, planEnddate: planEnddate });
            }
            else {
              successFailureMsg = "Your payment failed please try again.";
              this.setState({ isSuccess: false, isFailure: true, successFailureMsg: successFailureMsg, txnToken: txnToken });
            }
          }
        }.bind(this)
        , "GET");
    }

    this.getCurrentSubscriptionDetails();

  }

  handleChangePromoCode = (e) => {
    this.setState({ promoCode: e.target.value, isPromoCodeValid: e.target.value === "" ? false : true })
  }

  handlePlanDetails = (planType, planDuration) => {

    if (this.state.isPlanDetails && planType === "close") {
      this.setState({ isPlanDetails: false, promoCode: "", isPromoCodeValid: true });
      return;
    }

    if (!this.state.promoCode && planDuration === "promo") {
      this.setState({ isPromoCodeValid: false });
      return;
    }

    let pricedetails = [];
    let PlanPeriod = this.state.currentPlan;
    let promocode = this.state.promoCode;
    if (this.state.paymentid === 0 && promocode.toLowerCase() === "march2022")
      promocode = "";
    if (this.state.changeToMonthly !== "")
      PlanPeriod = "m";
    this.setState({ pricedetails: pricedetails, isBtnLoading: true, isPromoCodeApplied: this.state.promoCode && planDuration === "promo" ? true : false });
    var reqURL = "tw/subscription/paymentdetails?" + "planname=" + planType + "&planduration=" + (PlanPeriod === "promo" ? this.state.currentPlan : PlanPeriod) + "&promocode=" + promocode + (this.state.currentPlanType === "international" ? "&isinternatioanl=true" : "");//+parseInt(this.props.userInfo.agentID);
    var reqOBJ = {};

    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data.response !== null && data.response.length > 0) {
        pricedetails.push({
          value: data.response[0].subscriptionFee,
          discount: data.response[0].discountAmount,
          gst: data.response[0].gstAmount,
          total: data.response[0].totalAmount,
        });
        var isPromoCodeAppliedSuccess = false;
        if (this.state.isPromoCodeApplied && data.response[0].discountAmount) {
          isPromoCodeAppliedSuccess = true;
        }
        let selectedPlanDetails = this.state.pricedetails[0];
        this.setState({ activePlan: planType, selectedPlanDetails, isPromoCodeAppliedSuccess, isBtnLoading: false });
        this.setState({ isPlanDetails: true });
      }
    }, "GET");

    // const priceBreakup = [
    //   { value: "625", discount: "0", gst: "112", total: "737" },
    //   { value: "1250", discount: "0", gst: "225", total: "1475" },
    //   { value: "7500", discount: "-1500", gst: "1080", total: "7080" },
    //   { value: "15000", discount: "-3000", gst: "2160", total: "14160" },
    // ];

    // let selectedPlanDetails = this.state.pricedetails[0];

    // if (planType === "Basic" && this.state.currentPlan === "m") {
    //   selectedPlanDetails = priceBreakup[0];
    // }
    // if (planType === "Plus" && this.state.currentPlan === "m") {
    //   selectedPlanDetails = priceBreakup[1];
    // }
    // if (planType === "Basic" && this.state.currentPlan === "y") {
    //   selectedPlanDetails = priceBreakup[2];
    // }
    // if (planType === "Plus" && this.state.currentPlan === "y") {
    //   selectedPlanDetails = priceBreakup[3];
    // }


  };
  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  render() {
    const { currentPlan, currentPlanType, isPlanDetails, selectedPlanDetails, changeToMonthly } = this.state;
    console.log(Global.getEnvironmetKeyValue("portalCurrencyCode"));
    let planPeriod = this.state.currentPlan === "y" ? "Yearly" : (this.state.currentPlan === "m" ? "Monthly" : "Quarterly");
    if (changeToMonthly !== "")
      planPeriod = "Monthly";
    return (
      <React.Fragment>
        {this.state.comingsoon && (
          <ComingSoon handleComingSoon={this.handleComingSoon} />
        )}
        <div className="profile">
          <div className="title-bg pt-3 pb-3 mb-3">
            <Helmet>
              <title>
                Billing and Subscription
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
                Billing and Subscription
              </h1>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 hideMenu">
                <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} {...this.props} />
              </div>
              <div className="col-lg-9">

                {(currentPlanType === "india" || Global.getEnvironmetKeyValue("portalCurrencyCode") === "INR") && (
                  <div className="tw-plan-selection-tabs" name="plans" style={{ display: "none" }}>
                    <div className="container">
                      <button
                        className={
                          "btn btn-primary" + (currentPlanType === "india" ? " act" : "")
                        }
                        onClick={() => this.changePlanType("india")}
                      >
                        India
                      </button>
                      <button
                        className={
                          "btn btn-primary" +
                          (currentPlanType === "international" ? " act" : "")
                        }
                        onClick={() => this.changePlanType("international")}
                      >
                        International
                      </button>
                    </div>
                  </div>)}
                <div className="row mt-4">
                  <div className="col-lg-6">
                    <div>
                      <h3>Manage your Subscription</h3>
                      {this.state.currentPlanendName !== "" && this.state.currentPlanendName !== "Trial" &&
                        <p className="text-secondary">
                          You are currently using a {this.state.currentPlanendName + " - " + this.state.currentPlanDuration} Plan.
                        </p>
                      }
                      {this.state.currentPlanendName !== "" && this.state.currentPlanendName === "Trial" && this.state.currentPlanStatus !== "Expired" &&
                        <p className="text-secondary">
                          You are currently using a Freemium Plan.
                        </p>
                      }


                      <div className="tw-plan-header">
                        {/* <div className="tw-plan-intro p-0 mt-0 mb-4 text-left">
                          <div
                            className={"m-0 tw-plan-switch " + (currentPlan === "y" ? "yearly" : "monthly")}
                            style={{ transform: "scale(0.6)", whiteSpace: "nowrap", left: "-48px" }}
                          >
                            <h4>
                              <img src={PlanDiscountArrow} alt="" />
                              {currentPlanType === "international" ? '10%' : '20%'} OFF
                            </h4>
                            {currentPlanType === "india" &&
                              <React.Fragment>
                                <span onClick={() => this.changePlan("q")}>
                                  Quarterly
                                </span>
                                <b onClick={() => this.changePlan("")}></b>
                              </React.Fragment>
                            }
                            {currentPlanType !== "india" &&
                              <React.Fragment>
                                <span onClick={() => this.changePlanMonthly("m")}>
                                  Monthly
                                </span>
                                <b onClick={() => this.changePlan()}></b>
                              </React.Fragment>
                            }

                            <span onClick={() => this.changePlan("y")}>
                              Yearly
                            </span>
                          </div>
                        </div> */}




                        {/*{!this.state.isNewRegisteredUser && currentPlanType === "india" &&
                          <div className="mb-3 custom-control custom-switch">
                            <input
                              type="checkbox"
                              checked={this.state.changeToMonthly !== "" ? true : false}
                              className="custom-control-input"
                              id="percentage"
                              onChange={(e) => this.changePlanMonthly("m")}
                            />
                            <label className="custom-control-label" htmlFor="percentage">
                              Subscribe Monthly
                            </label>
                          </div>
                          // <div className="mb-3">
                          //   <span onClick={() => this.changePlanMonthly("m")}>
                          //     
                          //   </span>
                          // </div>
                        }*/}
                        <small className="text-secondary d-none">
                          You can cancel your subscription anytime
                        </small>



                      </div>
                    </div>

                  </div>
                  <div className="col-lg-6">
                    {this.state.currentPlanendName !== "" && this.state.currentPlanendName !== "Trial" && this.state.currentPlanStatus !== "Expired" &&
                      <h5 className="mb-3 text-secondary">
                        Current Plan:{" "}
                        <span className="text-primary">{this.state.currentPlanendName !== "Trial" && this.state.currentPlanDuration ? this.state.currentPlanendName + " - " + this.state.currentPlanDuration : "Freemium"}</span>
                      </h5>
                    }
                    {this.state.currentPlanendName !== "" && this.state.currentPlanendName === "Trial" && this.state.currentPlanStatus !== "Expired" &&
                      <h5 className="mb-3 text-secondary">
                        Current Plan:{" "}
                        <span className="text-primary">{this.state.currentPlanendName !== "Trial" && this.state.currentPlanDuration ? this.state.currentPlanendName + " - " + this.state.currentPlanDuration : "Freemium"}</span>
                        {/* <a className="ml-1" data-tip="React-tooltip">
                          <img
                            style={{ filter: "none" }}
                            src={info}
                            alt=""
                          />
                        </a>
                        <ReactTooltip aria-haspopup="true" role="example">
                          <b className="pb-1">Tasks</b>
                          <ul className="list-unstyled p-0 mb-0">
                            <li className="pb-1 text-left">30 Inquiries</li>
                            <li className="pb-1 text-left">05 Packages</li>
                            <li className="pb-1 text-left">05 Itineraries</li>
                            <li className="pb-1 text-left">05 {Trans("_quotationReplaceKeys")}</li>
                            <li className="pb-1 text-left">05 Customers</li>
                            <li className="pb-1 text-left">01 Employee</li>
                          </ul >
                        </ReactTooltip > */}
                      </h5 >
                    }
                    {
                      this.state.currentPlanendName !== "" && this.state.currentPlanendName !== "Trial" && this.state.currentPlanendDate &&
                      <h5 className="mb-3">
                        {this.state.currentPlanendName && this.state.currentPlanDuration ? this.state.currentPlanendName + " - " + this.state.currentPlanDuration : "Freemium"} Plan Ends:{" "}
                        <b className="text-primary"><Date date={this.state.currentPlanendDate} format={"ll"} /></b>
                      </h5>
                    }
                    {/* {this.state.currentPlanendName !== "" && this.state.currentPlanendName === "Trial" && this.state.currentPlanStatus !== "Expired" &&
                      <h5 className="mb-3">
                        Freemium Trial Ends:{" "}
                        <b className="text-primary">{this.state.currentPlanendDate ? <Date date={this.state.currentPlanendDate} format={"ll"} /> : "Mar 31, 2022"}</b>
                      </h5>
                    } */}
                    <p>
                      Explore our{" "}
                      <Link
                        to="/pricing"
                        target="_blank"
                        className="text-primary"
                      >
                        Plans here
                      </Link>
                    </p>
                    <p>
                      You can check your{" "}
                      <Link
                        to="/BillingAndSubscriptionHistory"
                        className="text-primary"
                      >
                        Payment History here
                      </Link>
                    </p>
                    {
                      this.state.isSuccess &&
                      <div
                        className="p-3 text-center mb-3 shadow-sm"
                        style={{ background: "#f18247" }}
                      >
                        <h5 className="mb-3">
                          {this.state.successFailureMsg}
                        </h5>

                        <p className="mb-2">
                          Your subscription starts from{" "}
                          <b>
                            {
                              <Date
                                date={this.state.planStartdate}
                                format={"ll"}
                              />
                            }
                          </b>
                        </p>
                        <p className="mb-2">
                          Subscription ends on{" "}
                          <b>
                            {
                              <Date
                                date={this.state.planEnddate}
                                format={"ll"}
                              />
                            }
                          </b>
                        </p>
                        <p className="mb-2">
                          Payment Transaction Token : {this.state.txnToken}
                        </p>
                        <p className="mb-1">
                          Payment Gateway Reference Number :{" "}
                          {this.state.gateWayrefNo}
                        </p>
                      </div>
                    }

                    {
                      this.state.isFailure &&
                      <div
                        className="p-3 text-center mb-3 shadow-sm"
                        style={{ background: "#f18247" }}
                      >
                        <h5 className="mb-3">
                          {this.state.successFailureMsg}
                        </h5>
                        <p>
                          Payment Transaction Token : {this.state.txnToken}
                        </p>
                      </div>
                    }
                  </div >
                  <div className="col-lg-12 mt-3">

                    <div className="row tw-plan-header">
                      {/* <div className="col-lg-3">
                        <div className="tw-plan-box m-0">
                          <h2>
                            <img src={PlanIconBasic} alt="BASIC" />
                            <span className="d-block">
                              {"Freemium"}
                            </span>
                          </h2>

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹0<span>&nbsp;</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹0<span>&nbsp;</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹0<span>&nbsp;</span>
                              </h3>
                            )}

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "international" && (
                              <h3>
                                $0<span>&nbsp;</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $0<span>&nbsp;</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $0<span>&nbsp;</span>
                              </h3>
                            )}

                          <h4>50 Tasks, 1 User
                            <a className="ml-1" data-tip="React-tooltip">
                              <img
                                style={{ filter: "none" }}
                                src={info}
                                alt=""
                              />
                            </a>
                            <ReactTooltip aria-haspopup="true" role="example">
                              <b className="pb-1">Tasks</b>
                              <ul className="list-unstyled p-0 mb-0">
                                <li className="pb-1 text-left">30 Inquiries</li>
                                <li className="pb-1 text-left">05 Packages</li>
                                <li className="pb-1 text-left">05 Itineraries</li>
                                <li className="pb-1 text-left">05 Quotations</li>
                                <li className="pb-1 text-left">05 Customers</li>
                                <li className="pb-1 text-left">01 Employee</li>
                              </ul>
                            </ReactTooltip>
                          </h4>
                          <button
                            onClick={() => (currentPlanType === "international" ? this.handlePlanDetails(currentPlanType === "india" ? "Basic" : "Plus", 'm') : this.handlePlanDetails(currentPlanType === "india" ? "Basic" : "Plus", 'm'))}
                            className="btn btn-primary"
                          >
                            Add Payment
                          </button>
                        </div>
                      </div> */}

                      <div className="col-lg-4">
                        <div className="tw-plan-box m-0">
                          <h2>
                            <img src={PlanIconBasic} alt="BASIC" />
                            <span className="d-block">
                              {currentPlanType === "india" ? "BASIC" : "PLUS"}
                            </span>
                          </h2>

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹625<span>PER MONTH</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹625<span>PER MONTH - BILLED QUARTERLY</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹500<span>PER MONTH - BILLED ANNUALLY</span>
                              </h3>
                            )}

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "international" && (
                              <h3>
                                $30<span>PER MONTH</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $30<span>PER MONTH - BILLED QUARTERLY</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $27<span>PER MONTH - BILLED ANNUALLY</span>
                              </h3>
                            )}

                          <h4>Unlimited Users</h4>
                          <button
                            onClick={() => (currentPlanType === "international" ? this.handlePlanDetails(currentPlanType === "india" ? "Basic" : "Plus", 'm') : this.handlePlanDetails(currentPlanType === "india" ? "Basic" : "Plus", 'm'))}
                            className="btn btn-primary"
                          >
                            Add Payment
                          </button>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="tw-plan-box m-0">
                          <h2>
                            <img src={PlanIconPlus} alt="BASIC" />
                            <span className="d-block">
                              {currentPlanType === "india" ? "PLUS" : "PREMIUM"}
                            </span>
                          </h2>

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹1250<span>PER MONTH</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹1250<span>PER MONTH - BILLED QUARTERLY</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "india" && (
                              <h3>
                                ₹1000<span>PER MONTH - BILLED ANNUALLY</span>
                              </h3>
                            )}

                          {(currentPlan === "m" || changeToMonthly !== "") &&
                            currentPlanType === "international" && (
                              <h3>
                                $35<span>PER MONTH</span>
                              </h3>
                            )}

                          {currentPlan === "q" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $35<span>PER MONTH - BILLED QUARTERLY</span>
                              </h3>
                            )}

                          {currentPlan === "y" && changeToMonthly === "" &&
                            currentPlanType === "international" && (
                              <h3>
                                $32<span>PER MONTH - BILLED ANNUALLY</span>
                              </h3>
                            )}

                          <h4>Unlimited Users</h4>
                          <button
                            onClick={() => (currentPlanType === "international" ? this.handlePlanDetails(currentPlanType === "india" ? "Plus" : "Premium", 'y') : this.handlePlanDetails(currentPlanType === "india" ? "Plus" : "Premium", 'y'))}
                            className="btn btn-primary"
                          >
                            Add Payment
                          </button>
                        </div>
                      </div>
                      {currentPlanType === "india" &&
                        <div className="col-lg-4">
                          <div className={currentPlanType === "india" ? "tw-plan-box m-1" : "tw-plan-box m-0"}>
                            <h2>
                              <img src={PlanIconBasic} alt="WEBSITE" />
                              <span className="d-block">
                                {currentPlanType === "india" ? "WEBSITE" : "WEBSITE"}
                              </span>
                            </h2>

                            {(currentPlan === "m" || changeToMonthly !== "") &&
                              currentPlanType === "india" && (
                                <h3>
                                  ₹625<span>PER MONTH</span>
                                </h3>
                              )}

                            {currentPlan === "q" && changeToMonthly === "" &&
                              currentPlanType === "india" && (
                                <h3>
                                  ₹625<span>PER MONTH - BILLED QUARTERLY</span>
                                </h3>
                              )}

                            {currentPlan === "y" && changeToMonthly === "" &&
                              currentPlanType === "india" && (
                                <h3>
                                  ₹500<span>PER MONTH - BILLED ANNUALLY</span>
                                </h3>
                              )}

                            {(currentPlan === "m" || changeToMonthly !== "") &&
                              currentPlanType === "international" && (
                                <h3>
                                  $30<span>PER MONTH</span>
                                </h3>
                              )}

                            {currentPlan === "q" && changeToMonthly === "" &&
                              currentPlanType === "international" && (
                                <h3>
                                  $30<span>PER MONTH - BILLED QUARTERLY</span>
                                </h3>
                              )}

                            {currentPlan === "y" && changeToMonthly === "" &&
                              currentPlanType === "international" && (
                                <h3>
                                  $27<span>PER MONTH - BILLED ANNUALLY</span>
                                </h3>
                              )}

                            <h4>Unlimited Users</h4>
                            <button
                              onClick={() => (currentPlanType === "international" ? this.handlePlanDetails(currentPlanType === "india" ? "Website" : "Website", 'm') : this.handlePlanDetails(currentPlanType === "india" ? "Website" : "Website", 'm'))}
                              className="btn btn-primary"
                            >
                              Add Payment
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div >
              </div >
            </div >
          </div >
          {isPlanDetails && (
            <div className="model-popup quotation-detail-popup">
              <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Payment Details</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => this.handlePlanDetails("close")}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="row mb-4">
                        <div class="col-9 mb-2"><i><b> Your plan selection : {this.state.activePlan} - {planPeriod}</b></i></div>
                        <div className="col-9">
                          <label for="title">Promo Code and Discount</label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className={"form-control " + (!this.state.isPromoCodeValid ? "border-danger" : "")}
                              placeholder="Enter Promo Code eg. TourWizDis"
                              value={this.state.promoCode}
                              onChange={(e) => this.handleChangePromoCode(e)}
                            />
                            {!this.state.isBtnLoading ?
                              <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={() => this.handlePlanDetails(this.state.activePlan, 'promo')}>
                                  Apply
                                </button>
                              </div> : <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                  <span className="spinner-border spinner-border-sm mr-2"></span> Apply
                                </button>
                              </div>}
                          </div>
                        </div>
                        {this.state.paymentid > 0 && (currentPlan === "m" || changeToMonthly !== "") && currentPlanType !== "international" &&
                          <div class="col-12 mt-3">
                            <SVGIcon
                              name="offer"
                              width="24"
                              height="24"
                              className="mr-1"
                            ></SVGIcon>
                            <label for="title" className="text-primary">Use code <b>March2022</b> to unlock special offer.</label>
                          </div>
                        }
                        {(currentPlan === "y") && changeToMonthly === "" && currentPlanType !== "international" &&
                          <div class="col-12 mt-3">
                            <SVGIcon
                              name="offer"
                              width="24"
                              height="24"
                              className="mr-1"
                            ></SVGIcon>
                            <label for="title" className="text-primary">Use code <b>{this.state.defaultPromoCode && this.state.defaultPromoCode !== "" ? this.state.defaultPromoCode : 'Happy20'}</b> to unlock special offer.</label>
                          </div>
                        }
                        {currentPlan === "y" && changeToMonthly === "" && currentPlanType === "international" &&
                          <div class="col-12 mt-3">
                            <SVGIcon
                              name="offer"
                              width="24"
                              height="24"
                              className="mr-1"
                            ></SVGIcon>
                            <label for="title" className="text-primary">Use code <b>{this.state.defaultPromoCode && this.state.defaultPromoCode !== "" ? this.state.defaultPromoCode : 'Happy10'}</b> to unlock special offer.</label>
                          </div>
                        }
                        {/* {this.state.isPromoCodeAppliedSuccess && this.state.promoCode &&
                          <div class="col-12">
                            <label for="title" className="text-primary">
                              <b>Congratulations! You have saved {currentPlanType === "india" ? "₹" : "$"}{selectedPlanDetails.discount} with {this.state.promoCode}.</b>
                            </label>
                          </div>
                        } */}
                      </div>


                      <div className="row">
                        <div className="col-lg-5">
                          <div>
                            <div className="row">
                              <div className="col-7">Plan Value : </div>
                              <div className="col-5 text-right">
                                {currentPlanType === "india" ? "₹" : "$"}{selectedPlanDetails.value}
                              </div>
                            </div>

                            <div className="row mt-2">
                              <div className="col-7">Discount : </div>
                              <div
                                className="col-5 text-right"
                                style={{ color: "green" }}
                              >
                                {currentPlanType === "india" ? "₹" : "$"}{selectedPlanDetails.discount}
                              </div>
                            </div>

                            {currentPlanType === "india" &&
                              <div className="row mt-2">
                                <div className="col-7">GST : </div>
                                <div className="col-5 text-right">
                                  {currentPlanType === "india" ? "₹" : "$"}{selectedPlanDetails.gst}
                                </div>
                              </div>
                            }
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="border-top mt-2"></div>
                              </div>
                            </div>

                            <div className="row mt-2">
                              <div className="col-7">
                                <b className="text-primary">Total : </b>
                              </div>
                              <div className="col-5 text-right">
                                <b className="text-primary">
                                  {currentPlanType === "india" ? "₹" : "$"}{selectedPlanDetails.total}
                                </b>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-12 text-center">
                          {this.state.isLoading &&
                            <button
                              className="btn btn-primary mt-4 mb-2"
                              style={{ minWidth: "40%" }}
                            >
                              <span className="spinner-border spinner-border-sm mr-2"></span> Pay Now
                            </button>
                          }
                          {!this.state.isLoading &&
                            <button
                              className="btn btn-secondary mt-4 mb-2"
                              style={{ minWidth: "40%" }}
                              //onClick={() => this.makepayment()}
                              disabled={true}

                            >
                              Pay Now
                            </button>
                          }
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 text-center text-danger font-weight-bold">
                          We apologize for the inconvenience. Due to some technical issues, we are unable to process your payment at the moment.
                        </div>
                      </div>
                      {/* {currentPlanType === "india" &&
                        <div className="row">
                          <div className="col-lg-12 text-center">
                            To pay with HDFC Bank, please
                            {!this.state.isLoading &&
                              <button
                                className="btn btn-link text-primary p-0 m-0 pl-1 mb-1 font-weight-bold"
                                onClick={() => this.makepayment(true)}
                              >
                                Click Here
                              </button>
                            }
                            {this.state.isLoading &&
                              <button
                                className="btn btn-link text-primary p-0 m-0 pl-1 mb-1 font-weight-bold"
                              >
                                Click Here
                              </button>
                            }
                          </div>
                        </div>
                      } */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show"></div>
            </div>
          )}
        </div >
      </React.Fragment >
    );
  }
}

export default BillingAndSubscription;
