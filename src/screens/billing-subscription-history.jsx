import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import moment from "moment";
import Amount from "../helpers/amount";
import Date from "../helpers/date";
import * as Global from "../helpers/global";
import { Link } from "react-router-dom";
import ModelPopup from '../helpers/model';
import SubscriptionReceipt from "./subscription-receipt";
import failureDownload from "../assets/images/x-circle.svg"
import { Helmet } from "react-helmet";

class BillingAndSubscriptionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "travel-crm",
      activePoint: "",
      currentPlan: "monthly",
      currentPlanType: "india",
      paymenthistory: [],
      historyServiceCalled: false,
      isViewReceiptDetails: [],
    };
    this.myRef = React.createRef();
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

  changePlan = (plan) => {
    this.setState({
      currentPlan: plan
        ? plan
        : this.state.currentPlan === "monthly"
          ? "yearly"
          : "monthly",
    });
  };

  componentDidMount() {
    var reqURL = "tw/subscription/paymenthistory";
    var reqOBJ = {};

    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data.response !== null) {
        this.setState({ historyServiceCalled: true, paymenthistory: data.response });
      }
    }, "GET");
  }
  handleHidePopup = () => {
    this.setState({
      isViewReceipt: !this.state.isViewReceipt,
    });
  };
  getReceiptDetails = (paymentHistory) => {
    this.setState({ isViewReceipt: true, isViewReceiptDetails: paymentHistory })
  }

  render() {
    const { currentPlan, currentPlanType, paymenthistory, historyServiceCalled, isViewReceiptDetails } = this.state;
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              Payment History
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
              Payment History
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 hideMenu">
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div>
            <div className="col-lg-9">
              <div className="table-responsive">
                {
                  <table className="table border small ">
                    <thead className="thead-light">
                      <tr>
                        <th>Transaction ID</th>
                        <th>Plan Details</th>
                        <th>Payment Date</th>
                        <th>Plan Start Date</th>
                        <th>Plan End Date</th>
                        {/* <th>Plan Extended Days</th> */}
                        <th>Paid Amount</th>
                        <th>Payment Status</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyServiceCalled && paymenthistory.length > 0 &&
                        paymenthistory.map((item, key) => (

                          <tr key={key}>
                            <td>{item.transactionToken}</td>
                            <td>{item.planDetails}</td>
                            <td><Date date={item.paymentDate} format={"DD/MM/YYYY hh:mm A"} /></td>
                            <td>{moment(item.startDate).format("DD/MM/YYYY")}</td>
                            <td>{moment(item.endDate).format("DD/MM/YYYY")}</td>
                            {/* <td>{item.extendedDays}</td> */}
                            <td>{<Amount amount={item.totalPaymentAmount} currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR" ? "USD" : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />}</td>
                            <td style={{ "textTransform": "capitalize" }}>{item.paymentStatus}</td>
                            <td className="text-center">
                              {item.paymentStatus === "failure" ?
                                <button className="btn btn-link m-0 p-0 text-secondary"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="The payment for this plan has failed."
                                >
                                  <img
                                    style={{ filter: "none" }}
                                    src={failureDownload}
                                    alt=""
                                  />
                                </button>
                                : <button className="btn btn-link m-0 p-0 text-secondary"
                                  onClick={() => { this.getReceiptDetails(item) }}
                                >
                                  <i className="fa fa-download" aria-hidden="true"></i>{" "}
                                </button>}
                            </td>
                          </tr>
                        ))

                      }

                      {historyServiceCalled && paymenthistory.length === 0 &&
                        <tr key={"key"}>
                          <td colSpan="6" className="text-center">
                            <br />
                            Your payment history will appear here once your paid
                            subscription starts.
                            <br />
                            <br />
                          </td>
                        </tr>

                      }

                      {/* <tr key={"key"}>
                        <td>TW73826478AG</td>
                        <td>Basic Plan - Monthly</td>
                        <td>30/09/2021</td>
                        <td>01/10/2021</td>
                        <td>30/10/2021</td>
                        <td>Rs. 675.00</td>
                        <td className="text-center">
                          <button className="btn btn-link m-0 p-0 text-secondary">
                            <i className="fa fa-download" aria-hidden="true"></i>{" "}
                          </button>
                        </td>
                      </tr>

                      <tr key={"key"}>
                        <td>TW73826478AG</td>
                        <td>Basic Plan - Monthly</td>
                        <td>30/09/2021</td>
                        <td>01/10/2021</td>
                        <td>30/10/2021</td>
                        <td>Rs. 675.00</td>
                        <td className="text-center">
                          <button className="btn btn-link m-0 p-0 text-secondary">
                            <i className="fa fa-download" aria-hidden="true"></i>{" "}
                          </button>
                        </td>
                      </tr>

                      <tr key={"key"}>
                        <td>TW73826478AG</td>
                        <td>Basic Plan - Monthly</td>
                        <td>30/09/2021</td>
                        <td>01/10/2021</td>
                        <td>30/10/2021</td>
                        <td>Rs. 675.00</td>
                        <td className="text-center">
                          <button className="btn btn-link m-0 p-0 text-secondary">
                            <i className="fa fa-download" aria-hidden="true"></i>{" "}
                          </button>
                        </td>
                      </tr> */}

                      {/* <tr key={"key"}>
                        <td colSpan="6">No Data Available</td>
                      </tr> */}
                    </tbody>
                  </table>
                }
                {/* {historyServiceCalled && paymenthistory.length === 0 &&
                        <h5 className="mt-4">No record(s) found.</h5>
                } */}
              </div>
              <h6 className="text-secondary mb-3">
                If you need any assistance with your subscription, please send us a message <Link to="contact-us" target="_blank" className="text-primary">here</Link> or at <a
                  href="mailto:sales@tourwizonline.com"
                  className="text-primary"
                >
                  sales@tourwizonline.com
                </a>
              </h6>
            </div>
          </div>
        </div>
        {
          this.state.isViewReceipt &&
          <ModelPopup
            header="Payment Receipt"
            content={<SubscriptionReceipt
              {...this.props}
              {...this.state}
              paymenthistory={isViewReceiptDetails}
            />
            }
            sizeClass="modal-dialog modal-lg modal-dialog-centered"
            handleHide={this.handleHidePopup}
          />
        }
      </div>

    );
  }
}

export default BillingAndSubscriptionHistory;
