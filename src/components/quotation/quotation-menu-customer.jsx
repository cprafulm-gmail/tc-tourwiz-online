import React, { Component } from "react";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import CompanyProf from "../../assets/images/dashboard/company-prof.png";
import ManageAgents from "../../assets/images/dashboard/manage-agents.png";
import ManageBooking from "../../assets/images/dashboard/manage-booking.png";
import ManageCustomer from "../../assets/images/dashboard/manage-customer.png";
import ManageEmployee from "../../assets/images/dashboard/manage-employee.png";
import ManageRevenue from "../../assets/images/dashboard/manage-revenue.png";
import ManageWallet from "../../assets/images/dashboard/manage-wallet.png";
import Reports from "../../assets/images/dashboard/reports.png";
import AffiliatePortals from "../../assets/images/dashboard/affiliate-portals.png";
import ContentManagement from "../../assets/images/dashboard/content-management.png";
import CustomerClass from "../../assets/images/dashboard/customer-class.png";
import EmailTemplates from "../../assets/images/dashboard/email-templates.png";
import MarketingCenter from "../../assets/images/dashboard/marketing-center.png";
import PortalPolicies from "../../assets/images/dashboard/portal-policies.png";
import Settings from "../../assets/images/dashboard/settings.png";
import Suppliers from "../../assets/images/dashboard/suppliers.png";
import CreateInquiryIcon from "../../assets/images/dashboard/inquiry.svg";
import ManageInquiryIcon from "../../assets/images/dashboard/manage-inquiry.png";
import CreateItineraryIcon from "../../assets/images/dashboard/create-itinerary.png";
import ManageItineraryIcon from "../../assets/images/dashboard/manage-itinerary.png";
import CreateQuotationIcon from "../../assets/images/dashboard/create-quotation.png";
import ManageQuotationIcon from "../../assets/images/dashboard/manage-qotations.png";
import ManagePackageIcon from "../../assets/images/dashboard/packages.svg";
import ManageInvoiceIcon from "../../assets/images/dashboard/invoices.svg";
class QuotationMenuCustomer extends Component {
  state = { subMenyKey: 0 };

  handleRedirect = (req, redirect) => {
    this.props.handleMenuClick(req, redirect);
  };

  toggleSubMenu = (key) => {
    this.setState({ subMenyKey: this.state.subMenyKey === key ? 0 : key });
  };

  getActive = (path) => {
    let url = window.location.pathname;
    let active = false;
    if (url === path) {
      active = true;
    }

    return active;
  };

  componentDidMount() {
    let url = window.location.pathname;
    url = url.indexOf("/", 2) > 1 ? url.substring(0, url.indexOf("/", 2)) : url;
    if (["/ImportInquiries"].indexOf(url) > -1) this.toggleSubMenu(1);
    else if (["/ContentLibrary", "/ImportItinerary"].indexOf(url) > -1)
      this.toggleSubMenu(2);
    else if (
      [
        "/CustomerReconciliation",
        "/CustomerLedger",
        "/SupplierInvoices",
        "/SupplierInvoice",
        "/SupplierLedgers",
        "/SupplierManagement",
        "/SupplierPayment",
        "/DebitNote",
        "/CreditNote"
      ].indexOf(url) > -1
    )
      this.toggleSubMenu(7);
    else if (
      [
        "/UpdateProfile",
        "/EmployeeList",
        "/Employee",
        "/Customer",
        "/BranchManagement",
        "/CategoryManagement",
        // "/AgentWalletManagement",
        "/ImportCustomer",
      ].indexOf(url) > -1
    )
      this.toggleSubMenu(9);
    else if (
      [
        "/InquiryReport",
        "/BookingReport",
        "/CollectionReport",
        "/SupplierPaymentReport",
        "/SalesReport",
        "/RevenueReport",
        "/OutstandingReport",
        "/LeadsReport",
        "/SupplierReport",
      ].indexOf(url) > -1
    )
      this.toggleSubMenu(5);
    else if (["/CustomerInvoices", "/ImportBookings"].indexOf(url) > -1)
      this.toggleSubMenu(4);
    else if (
      ["/Backoffice/MyAccount|ChangePassword.aspx"].indexOf(
        window.location.hash
      ) > -1
    )
      this.toggleSubMenu(9);
    else if (
      ["/Backoffice/Admin/BSPGDSValidate.aspx"].indexOf(window.location.hash) >
      -1
    )
      this.toggleSubMenu(7);
    else if (
      ["/BillingAndSubscription", "/BillingAndSubscriptionHistory"].indexOf(
        url
      ) > -1
    )
      this.toggleSubMenu(10);
  }
  getActiveForm = (path) => {
    let url = window.location.pathname;
    url = url.indexOf("/", 2) > 1 ? url.substring(0, url.indexOf("/", 2)) : url;
    let active = false;
    if (url === path) {
      active = true;
    }
    return active;
  };
  render() {
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");

    const { subMenyKey } = this.state;

    return (
      <div
        className="shadow-sm p-3 agent-dashboard-menu"
        style={{ height: "100%" }}
      >

        <ul className="list-unstyled p-0 m-0">
          <li>
            <button
              className="btn btn-link text-secondary"
              className={
                "btn btn-link " +
                (this.getActive("/Dashboard-Tourwiz") ? "text-primary" : "text-secondary")
              }
              onClick={() => this.handleRedirect("/")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIcon}
                  alt=""
                />
              </figure>
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/InquiryList")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={CreateInquiryIcon}
                  alt=""
                />
              </figure>
              My Inquiries
            </button>
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/PackageList")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManagePackageIcon}
                  alt=""
                />
              </figure>
              My Packages
            </button>
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/ItineraryList")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageItineraryIcon}
                  alt=""
                />
              </figure>
              My Itineraries
            </button>
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/QuotationList")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIcon}
                  alt=""
                />
              </figure>
              My {Trans("_quotationReplaceKeys")}
            </button>
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/CustomerInvoices")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageInvoiceIcon}
                  alt=""
                />
              </figure>
              My Invoices
            </button>
          </li>
          <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive("/CustomerReconciliation")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() =>
                this.handleRedirect("/CustomerReconciliation")
              }
            >
              <figure>
                <img src={ManageBooking} alt="" />
              </figure>
              My Ledger
            </button>
          </li>

          <li>
            <button
              className="btn btn-link text-secondary"
              className={
                "btn btn-link " +
                (this.getActive("/Profile") ? "text-primary" : "text-secondary")
              }
              onClick={() => this.handleRedirect("/Profile")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIcon}
                  alt=""
                />
              </figure>
              My Profile
            </button>
          </li>
          <li className="mb-4">
            <button
              className="btn btn-link text-secondary"
              className={
                "btn btn-link " +
                (this.getActive("/Bookings") ? "text-primary" : "text-secondary")
              }
              onClick={() => this.handleRedirect("/Bookings")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIcon}
                  alt=""
                />
              </figure>
              My Bookings
            </button>
          </li>
        </ul>

        <ul className="list-unstyled p-0 m-0 d-none">
          <li>
            <button
              className="btn btn-link text-primary"
              onClick={() => this.handleRedirect("/Dashboard-Agent")}
            >
              <figure>
                <img src={Reports} alt="" />
              </figure>
              Dashboard
            </button>
          </li>

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "B2BPortalAdmin" ||
            role === "CompanyPortalAdmin" ||
            role === "B2CPortalAdmin" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() =>
                    this.handleRedirect(
                      "MyAccount|ChangePassword.aspx",
                      "back-office"
                    )
                  }
                >
                  <figure>
                    <img src={CompanyProf} alt="" />
                  </figure>
                  {Trans("Change Password")}
                </button>
              </li>
            )}

        </ul>
      </div>
    );
  }
}

export default QuotationMenuCustomer;
