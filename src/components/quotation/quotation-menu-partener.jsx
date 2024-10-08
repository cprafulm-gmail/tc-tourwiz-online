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
import CreateInquiryIcon from "../../assets/images/dashboard/create-inquiry.png";
import ManageInquiryIcon from "../../assets/images/dashboard/manage-inquiry.png";
import CreateItineraryIcon from "../../assets/images/dashboard/create-itinerary.png";
import ManageItineraryIcon from "../../assets/images/dashboard/manage-itinerary.png";
import CreateQuotationIcon from "../../assets/images/dashboard/create-quotation.png";
import ManageQuotationIcon from "../../assets/images/dashboard/manage-qotations.png";

class QuotationMenuPartner extends Component {
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
        "/CreditNote",
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
    else if (
      ["/CustomerWebsite", "/SelectTemplate", "/ManageContent"].indexOf(
        url
      ) > -1
    )
      this.toggleSubMenu(11);
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
              onClick={() => this.handleRedirect("/Dashboard-Tourwiz")}
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
              onClick={() => this.toggleSubMenu(9)}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageInquiryIcon}
                  alt=""
                />
              </figure>
              Partner Settings
            </button>
            {subMenyKey === 9 && (
              <ul className="list-unstyled p-0 m-0">
                <li>
                  <button
                    className={
                      "btn btn-link ml-3 " +
                      (this.getActive("/UpdateProfile")
                        ? "text-primary"
                        : "text-secondary")
                    }
                    onClick={() => this.handleRedirect("/UpdateProfile")}
                  >
                    <figure>
                      <img src={CompanyProf} alt="" />
                    </figure>
                    Profile
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              className="btn btn-link text-secondary"
              className={
                "btn btn-link " +
                (this.getActive("/Deals") ? "text-primary" : "text-secondary")
              }
              onClick={() => this.handleRedirect("/Partner-Deals")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIcon}
                  alt=""
                />
              </figure>
              Manage Offers
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
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/Inquiry")}
                >
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={CreateInquiryIcon}
                      alt=""
                    />
                  </figure>
                  {Trans("Create Inquiry")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/InquiryList")}
                >
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={ManageInquiryIcon}
                      alt=""
                    />
                  </figure>
                  {Trans("Manage Inquiries")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/Itinerary/Create")}
                >
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={CreateItineraryIcon}
                      alt=""
                    />
                  </figure>
                  {Trans("Create Itinerary")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
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
                  {Trans("Manage Itineraries")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/Quotation/Create")}
                >
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={CreateQuotationIcon}
                      alt=""
                    />
                  </figure>
                  {Trans("_createQuotation")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            IsQuotation && (
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
                  {Trans("_manageQuotation").replace("##Quotation##", Trans("_quotationReplaceKeys"))}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "B2BPortalAdmin" ||
            role === "B2CPortalAdmin" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/Bookings")}
                >
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                  {Trans("_manageBookings")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "B2BPortalAdminEmployee" ||
            role === "B2BPortalAgentEmployee" ||
            role === "B2BPortalAdmin" ||
            role === "B2CPortalAdmin" ||
            role === "CompanyPortalAdminEmployee" ||
            role === "B2CPortalAdminEmployee") &&
            !localStorage.getItem("isUmrahPortal") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/Customer/list")}
                >
                  <figure>
                    <img src={ManageCustomer} alt="" />
                  </figure>
                  {Trans("_manageCustomers")}
                </button>
              </li>
            )}

          {(role === "CompanyPortalAdmin" || role === "admin") && (
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() =>
                  this.handleRedirect("/Entity/AgentList.aspx", "back-office")
                }
              >
                <figure>
                  <img src={ManageAgents} alt="" />
                </figure>
                {Trans("_B2BB2CProfileManagement")}
              </button>
            </li>
          )}

          {(role === "B2BPortalAgent" ||
            role === "CompanyPortalAdmin" ||
            role === "B2CPortalAdmin" ||
            role === "B2BPortalAdmin") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() =>
                    this.handleRedirect("Admin|CrewList.aspx", "back-office")
                  }
                >
                  <figure>
                    <img src={ManageEmployee} alt="" />
                  </figure>
                  {Trans("_manageEmployees")}
                </button>
              </li>
            )}

          {(role === "B2BPortalAgent" ||
            role === "CompanyPortalAdmin" ||
            role === "B2CPortalAdmin" ||
            role === "B2BPortalAdmin") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() =>
                    this.handleRedirect(
                      "BackOffice|SupplierReconciliationList.aspx",
                      "back-office"
                    )
                  }
                >
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                  {Trans("Reconciliation")}
                </button>
              </li>
            )}

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
                  onClick={() => this.handleRedirect("/", "Reports")}
                >
                  <figure>
                    <img src={Reports} alt="" />
                  </figure>
                  {Trans("_reports")}
                </button>
              </li>
            )}

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
                      "MyAccount|UpdateProfile.aspx",
                      "back-office"
                    )
                  }
                >
                  <figure>
                    <img src={CompanyProf} alt="" />
                  </figure>
                  {Trans("_myProfile")}
                </button>
              </li>
            )}

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

          {role === "admin" && false && (
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.handleRedirect("/", "back-office")}
              >
                <figure>
                  <img src={ContentManagement} alt="" />
                </figure>
                {Trans("_manageContent")}
              </button>
            </li>
          )}

          {role === "admin" && false && (
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.handleRedirect("/", "back-office")}
              >
                <figure>
                  <img src={MarketingCenter} alt="" />
                </figure>
                {Trans("_marketingCenter")}
              </button>
            </li>
          )}

          {(role === "CompanyPortalAdmin" ||
            role === "admin" ||
            role === "B2BPortalAdmin") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() =>
                    this.handleRedirect("/Entity/AgentList.aspx", "back-office")
                  }
                >
                  <figure>
                    <img src={Suppliers} alt="" />
                  </figure>
                  {Trans("_manageSuppliers")}
                </button>
              </li>
            )}

          <li style={{ display: "none" }}>
            {(role === "B2BPortalAdmin" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2CPortalAdmin" ||
              role === "B2CPortalAdminEmployee" ||
              role === "CompanyPortalAdmin") && (
                <li>
                  <button
                    className="btn btn-link text-secondary"
                    onClick={() =>
                      this.handleRedirect(
                        "/Backoffice/EmailTemplateList.aspx",
                        "back-office"
                      )
                    }
                  >
                    <figure>
                      <img src={EmailTemplates} alt="" />
                    </figure>
                    {Trans("_emailTemplates")}
                  </button>
                </li>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && (
                <li>
                  <button
                    className="btn btn-link text-secondary"
                    onClick={() =>
                      this.handleRedirect(
                        "/Agency/MarkupSetup.aspx",
                        "back-office"
                      )
                    }
                  >
                    <figure>
                      <img src={ManageRevenue} alt="" />
                    </figure>
                    {Trans("_manageRevenue")}
                  </button>
                </li>
              )}

            {role === "admin" && false && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/", "back-office")}
                >
                  <figure>
                    <img src={AffiliatePortals} alt="" />
                  </figure>
                  {Trans("_affiliatePortals")}
                </button>
              </li>
            )}

            {(role === "B2BPortalAgent" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && (
                <li>
                  <button
                    className="btn btn-link text-secondary"
                    onClick={() =>
                      this.handleRedirect(
                        "/Admin/CustomerClassList.aspx",
                        "back-office"
                      )
                    }
                  >
                    <figure>
                      <img src={CustomerClass} alt="" />
                    </figure>
                    {Trans("_customerClasses")}
                  </button>
                </li>
              )}

            {(role === "B2CPortalAdmin" || role === "B2BPortalAdmin") && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() =>
                    this.handleRedirect(
                      "/Policies/AdditionalChargePolicyList.aspx",
                      "back-office"
                    )
                  }
                >
                  <figure>
                    <img src={PortalPolicies} alt="" />
                  </figure>
                  {Trans("_portalPolicies")}
                </button>
              </li>
            )}

            {(role === "B2BPortalAgent" ||
              role === "CompanyPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && (
                <li>
                  <button
                    className="btn btn-link text-secondary"
                    onClick={() =>
                      this.handleRedirect(
                        "/Billing/AgentBalanceList.aspx",
                        "back-office"
                      )
                    }
                  >
                    <figure>
                      <img src={ManageWallet} alt="" />
                    </figure>
                    {Trans("_manageWallets")}
                  </button>
                </li>
              )}

            {role === "admin" && false && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/", "back-office")}
                >
                  <figure>
                    <img src={Settings} alt="" />
                  </figure>
                  {Trans("_settings")}
                </button>
              </li>
            )}

            {role === "admin" && false && (
              <li>
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.handleRedirect("/", "back-office")}
                >
                  <figure>
                    <img src={CompanyProf} alt="" />
                  </figure>
                  {Trans("_corporateBooking")}
                </button>
              </li>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default QuotationMenuPartner;
