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
import ManageInquiryIcon from "../../assets/images/dashboard/manage-inquiry.svg";
import CreateItineraryIcon from "../../assets/images/dashboard/create-itinerary.png";
import ManageItineraryIcon from "../../assets/images/dashboard/manage-itinerary.png";
import CreateQuotationIcon from "../../assets/images/dashboard/create-quotation.png";
import ManageQuotationIcon from "../../assets/images/dashboard/manage-qotations.png";
import ManageInquiryIconnew from "../../assets/images/dashboard/manage-inquiry-new.svg";
import ManagePackageIcon from "../../assets/images/dashboard/manage-package.svg";
import ManageQuotationIconnew from "../../assets/images/dashboard/manage-quotation-new.svg";
import ManageCustomerIconnew from "../../assets/images/dashboard/manage-customer-new.svg";
import ManageAccountIconnew from "../../assets/images/dashboard/manage-account-new.svg";
import ManageReportsIconnew from "../../assets/images/dashboard/manage-reports-new.svg";
import DashboardIconnew from "../../assets/images/dashboard/dashboard-new.svg";
import ManageAccountSettingIconnew from "../../assets/images/dashboard/manage-account-setting-new.svg";
import ManageAgencyIconnew from "../../assets/images/dashboard/manage-agency-new.svg";
import ManageWebsiteIconnew from "../../assets/images/dashboard/manage-website-new.svg";
import OffersIconnew from "../../assets/images/dashboard/offers-new.svg";
import RewardsIconnew from "../../assets/images/dashboard/rewards-new.svg";
import ManualInvoiceIconnew from "../../assets/images/dashboard/manual-invoice.svg";
import searchIcon from "../../assets/images/dashboard/search.svg";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";

class QuotationMenu extends Component {
  state = { subMenyKey: 0, isshowauthorizepopup: false };

  handleRedirect = (req, redirect, authorizeelement) => {
    if (AuthorizeComponentCheck((this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null), authorizeelement)) {
      this.setState({ isshowauthorizepopup: false });
      this.props.handleMenuClick(req, redirect);
    }
    else {
      this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }
  };

  toggleSubMenu = (key, authorizeelement) => {
    if (AuthorizeComponentCheck((this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null), authorizeelement)) {
      this.setState({ subMenyKey: this.state.subMenyKey === key ? 0 : key, isshowauthorizepopup: false });
    }
    else {
      this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }
  };

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

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
    if (["/ImportInquiries"].indexOf(url) > -1) this.toggleSubMenu(1, "dashboard-menu~inquiries-import-inquiries");
    else if (["/ContentLibrary", "/ImportItinerary"].indexOf(url) > -1) {
      this.toggleSubMenu(2, (["/ContentLibrary"].indexOf(url) > -1 ? "dashboard-menu~itineraries-content-library" : "dashboard-menu~itineraries-import-itineraries"));
    }
    else if (["/ImportQuotation"].indexOf(url) > -1) {
      this.toggleSubMenu(3, "dashboard-menu~quotation-import-quotation");
    }
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
        "/BSPCommission"
      ].indexOf(url) > -1
    ) {
      if (["/CustomerReconciliation"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-customer-reconciliation");
      else if (["/CustomerLedger"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-customer-ledger");
      else if (["/SupplierInvoices"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-supplier-reconciliation");
      else if (["/SupplierInvoice"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-supplier-reconciliation");
      else if (["/SupplierLedgers"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-supplier-ledger");
      else if (["/SupplierManagement"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-supplier-management");
      else if (["/SupplierPayment"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-supplier-reconciliation");
      else if (["/DebitNote"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-debit-note");
      else if (["/CreditNote"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-credit-note");
      else if (["/BSPCommission"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~dashboard");
    }
    else if (
      [
        "/UpdateProfile",
        "/EmployeeList",
        "/ChangePassword",
        "/Employee",
        "/Customer",
        "/BranchManagement",
        "/CategoryManagement",
        "/MarkupSetup",
        // "/AgentWalletManagement",
      ].indexOf(url) > -1
    ) {
      if (["/UpdateProfile"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-profile");
      else if (["/EmployeeList"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-employees");
      else if (["/MarkupSetup"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-markup-setup");
      else if (["/ChangePassword"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-changepassword");
      else if (["/Employee"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-employees");
      else if (["/Employee"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-employees");
    }
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
    ) {
      if (["/InquiryReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-inquiry");
      else if (["/BookingReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-booking");
      else if (["/CollectionReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-collection");
      else if (["/SupplierPaymentReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-supplierpayment");
      else if (["/SalesReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-sales");
      else if (["/RevenueReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-revenue");
      else if (["/OutstandingReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-outstanding");
      else if (["/LeadsReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-leads");
      else if (["/SupplierReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-supplier");
    }
    else if (["/ImportCustomer", "/CustomerInvoices", "/ImportBookings"].indexOf(url) > -1) {
      if (["/ImportCustomer"].indexOf(url) > -1)
        this.toggleSubMenu(4, "dashboard-menu~customer-import-customers");
      else if (["/CustomerInvoices"].indexOf(url) > -1)
        this.toggleSubMenu(4, "dashboard-menu~customer-invoices");
      else
        this.toggleSubMenu(4, "bookings~customer-bookings-import");
    }
    else if (
      ["/Backoffice/MyAccount|ChangePassword.aspx"].indexOf(
        window.location.hash
      ) > -1
    )
      this.toggleSubMenu(9, "dashboard-menu~agentsettings-changepassword");
    else if (
      ["/Backoffice/Admin/BSPGDSValidate.aspx"].indexOf(window.location.hash) >
      -1
    )
      this.toggleSubMenu(7, "");
    else if (
      ["/BillingAndSubscription", "/BillingAndSubscriptionHistory"].indexOf(
        url
      ) > -1
    ) {
      if (["/BillingAndSubscription"].indexOf(url) > -1)
        this.toggleSubMenu(10, "dashboard-menu~accountsettings-billingsubscription");
      else
        this.toggleSubMenu(10, "dashboard-menu~accountsettings-billingsubscription");
    }
    else if (
      ["/CustomerWebsite", "/SelectTemplate", "/ManageContent", "/Configuration"].indexOf(
        url
      ) > -1
    ) {
      if (["/CustomerWebsite"].indexOf(url) > -1)
        this.toggleSubMenu(11, "dashboard-menu~managewebsite-claimyourwebsite");
      else if (["/SelectTemplate"].indexOf(url) > -1)
        this.toggleSubMenu(11, "dashboard-menu~managewebsite-selecttemplatetheme");
      else if (["/ManageContent"].indexOf(url) > -1)
        this.toggleSubMenu(11, "dashboard-menu~managewebsite-managecontent");
      else if (["/Configuration"].indexOf(url) > -1)
        this.toggleSubMenu(11, "dashboard-menu~agentsettings-configurations");
    }
    else if (["/ManualInvoices"].indexOf(url) > -1)
      this.toggleSubMenu(12, "dashboard-menu~invoice-manage-invoice");
    else if (["/paperrates"].indexOf(url) > -1)
      this.toggleSubMenu(15, "dashboard-menu~paperrates-create");
    else if (["/paperrateslist"].indexOf(url) > -1)
      this.toggleSubMenu(15, "dashboard-menu~paperrates-manage");
    else if (["/paperratesbookings"].indexOf(url) > -1)
      this.toggleSubMenu(15, "dashboard-menu~paperrates-bookings");
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
    let IsLiveSearchEnable = Global.getEnvironmetKeyValue("IsLiveSearchEnable", "cobrand");
    const role = localStorage.getItem("afUserType");

    const { subMenyKey } = this.state;
    const { userInfo } = this.props;

    return (
      <div
        className="shadow-sm p-3 agent-dashboard-menu"
        style={{ height: "100%" }}
      >
        <ul className="list-unstyled p-0 m-0">
          {/* <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive("/Dashboard-Agent")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() => this.handleRedirect("/Dashboard-Agent")}
            >
              <figure>
                <img src={Reports} alt="" />
              </figure>
              Dashboard
            </button>
          </li> */}
          {/* 
          <AuthorizeComponent title="dashboard-menu~inquiries" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(1, "dashboard-menu~inquiries")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageInquiryIcon}
                    alt=""
                  />
                </figure>
                Inquiries
              </button>
              {subMenyKey === 1 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/Inquiry", undefined, "dashboard-menu~inquiries-create-inquiry")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={CreateInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Create Inquiry
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~inquiries-manage-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/InquiryList", undefined, "dashboard-menu~inquiries-manage-inquiry")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Manage Inquiries
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~inquiries-import-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ImportInquiries")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/ImportInquiries", undefined, "dashboard-menu~inquiries-import-inquiries")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Import Inquiries
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~packages" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(14, "dashboard-menu~packages")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManagePackageIcon}
                    alt=""
                  />
                </figure>
                Packages
              </button>
              {subMenyKey === 14 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~packages-create-package" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/package/add", undefined, "dashboard-menu~packages-create-package")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={CreateInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Create Package
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~packages-manage-package" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/PackageList", undefined, "dashboard-menu~packages-manage-package")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Manage Packages
                      </button>
                    </li>
                  </AuthorizeComponent>
                  {/* <AuthorizeComponent title="dashboard-menu~inquiries-import-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ImportInquiries")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/ImportInquiries", undefined, "dashboard-menu~inquiries-import-inquiries")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageInquiryIcon}
                            alt=""
                          />
                        </figure>
                        Import Inquiries
                      </button>
                    </li>
                  </AuthorizeComponent> *s/}
        </ul>
              )}
      </li>
          </AuthorizeComponent >
          <AuthorizeComponent title="dashboard-menu~itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(2, "dashboard-menu~itineraries")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageInquiryIconnew}
                    alt=""
                  />
                </figure>
                Itineraries
              </button>
              {subMenyKey === 2 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~itineraries-create-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/Itinerary/Create", undefined, "dashboard-menu~itineraries-create-itineraries")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={CreateItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Create Itinerary
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~itineraries-manage-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/ItineraryList", undefined, "dashboard-menu~itineraries-manage-itineraries")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Manage Itineraries
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~itineraries-content-library" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ContentLibrary")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/ContentLibrary", undefined, "dashboard-menu~itineraries-content-library")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Content Library
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~itineraries-import-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ImportItinerary")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/ImportItinerary", undefined, "dashboard-menu~itineraries-import-itineraries")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Import Itinerary
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~quotation" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(3, "dashboard-menu~quotation")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageQuotationIconnew}
                    alt=""
                  />
                </figure>
                Quotations
              </button>
              {subMenyKey === 3 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/Quotation/Create", undefined, "dashboard-menu~quotation-create-quotation")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={CreateQuotationIcon}
                            alt=""
                          />
                        </figure>
                        Create Quotation
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~quotation-manage-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/QuotationList", undefined, "dashboard-menu~quotation-manage-quotation")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageQuotationIcon}
                            alt=""
                          />
                        </figure>
                        Manage Quotations
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~quotation-import-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        //className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/ImportQuotation", undefined, "dashboard-menu~quotation-import-quotation")}
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ImportQuotation")
                            ? "text-primary"
                            : "text-secondary")
                        }
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageQuotationIcon}
                            alt=""
                          />
                        </figure>
                        Import Quotations
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~manual-invoices" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(12, "dashboard-menu~manual-invoices")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManualInvoiceIconnew}
                    alt=""
                  />
                </figure>
                Invoices
              </button>
              {subMenyKey === 12 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/invoice/Create", undefined, "dashboard-menu~invoice-create-invoice")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Create Invoice
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~invoice-manage-invoice" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={"btn btn-link ml-3 " +
                          (this.getActive("/ManualInvoices")
                            ? "text-primary"
                            : "text-secondary")}
                        onClick={() => this.handleRedirect("/ManualInvoices", undefined, "dashboard-menu~invoice-manage-invoice")}
                      >
                        <figure>
                          <img
                            style={{ filter: "none" }}
                            src={ManageItineraryIcon}
                            alt=""
                          />
                        </figure>
                        Manage Invoices
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent> * /}
    {/* <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => this.handleRedirect("/Customer/list")}
            >
              <figure>
                <img src={ManageCustomer} alt="" />
              </figure>
              Customers
            </button>
          </li> */}
          <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.handleRedirect("/", undefined, "dashboard-menu~dashboard")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={DashboardIconnew}
                    alt=""
                  />
                </figure>
                Dashboard
              </button>
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~paperrates" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(15, "dashboard-menu~paperrates")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageItineraryIcon}
                    alt=""
                  />
                </figure>
                Paper Rates
              </button>
              {subMenyKey === 15 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  {/* <AuthorizeComponent title="dashboard-menu~paperrates-create" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/paperrates")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/paperrates", undefined, "dashboard-menu~paperrates-create")}
                    >
                      <figure>
                        <img src={CompanyProf} alt="" />
                      </figure>
                      Create Paper Rates
                    </button>
                  </li>
                </AuthorizeComponent> */}
                  <AuthorizeComponent title="dashboard-menu~paperrates-manage" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/paperrateslist")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/paperrateslist", undefined, "dashboard-menu~paperrates-manage")}
                      >
                        <figure>
                          <img src={ManageEmployee} alt="" />
                        </figure>
                        Manage Paper Rates
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~paperrates-bookings" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/paperpatesbookings")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/paperpatesbookings", undefined, "dashboard-menu~paperrates-bookings")}
                      >
                        <figure>
                          <img src={ManageEmployee} alt="" />
                        </figure>
                        Paper Rates Bookings
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~agentsettings" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(9, "dashboard-menu~agentsettings")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageAgencyIconnew}
                    alt=""
                  />
                </figure>
                Agency Settings
              </button>
              {subMenyKey === 9 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~agentsettings-profile" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/UpdateProfile")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/UpdateProfile", undefined, "dashboard-menu~agentsettings-profile")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Profile
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~agentsettings-employees" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/EmployeeList") ||
                            this.getActiveForm("/Employee")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/EmployeeList", undefined, "dashboard-menu~agentsettings-employees")}
                      >
                        <figure>
                          <img src={ManageEmployee} alt="" />
                        </figure>
                        Employees
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~agentsettings-changepassword" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive(
                            "/ChangePassword"
                          )
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          this.handleRedirect(
                            "ChangePassword"
                            , undefined
                            , "dashboard-menu~agentsettings-changepassword"
                          )
                        }
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Change Password
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~agentsettings-tax-configuration" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/TaxConfiguration")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/TaxConfiguration", undefined, "dashboard-menu~agentsettings-tax-configuration")
                        }
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Tax Configuration
                      </button>
                    </li>
                  </AuthorizeComponent>
                  {/* <AuthorizeComponent title="dashboard-menu~paperrates-create" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/paperrates")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/paperrates", undefined, "dashboard-menu~paperrates-create")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Create Air Paper Rate
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~paperrates-manage" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/paperrateslist")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/paperrateslist", undefined, "dashboard-menu~paperrates-manage")}
                      >
                        <figure>
                          <img src={ManageEmployee} alt="" />
                        </figure>
                        Manage Paper Air Rates
                      </button>
                    </li>
                  </AuthorizeComponent> */}

                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~customer" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(4, "dashboard-menu~customer")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageCustomerIconnew}
                    alt=""
                  />
                </figure>
                Customer
              </button>
              {subMenyKey === 4 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~customer-customers" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3 "
                        onClick={() => this.handleRedirect("/Customer/list", undefined, "dashboard-menu~customer-customers")}
                      >
                        <figure>
                          <img src={ManageCustomer} alt="" />
                        </figure>
                        Customers
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~customer-bookings" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className="btn btn-link text-secondary ml-3"
                        onClick={() => this.handleRedirect("/Bookings", undefined, "dashboard-menu~customer-bookings")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Bookings
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~report" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(5, "dashboard-menu~report")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageReportsIconnew}
                    alt=""
                  />
                </figure>
                Reports
              </button>
              {subMenyKey === 5 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~report-booking" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/BookingReport")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/BookingReport", undefined, "dashboard-menu~report-booking")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Booking Report
                      </button>
                    </li>
                  </AuthorizeComponent>
                  {/* <AuthorizeComponent title="dashboard-menu~report-sales" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/SalesReport")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/SalesReport", undefined, "dashboard-menu~report-sales")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Sales Report
                      </button>
                    </li>
                  </AuthorizeComponent> */}
                  <AuthorizeComponent title="dashboard-menu~report-revenue" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/RevenueReport")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/RevenueReport", undefined, "dashboard-menu~report-revenue")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Revenue Report
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          {/* <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive("/Backoffice/Admin|CrewList.aspx")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() =>
                this.handleRedirect("Admin|CrewList.aspx", "back-office")
              }
            >
              <figure>
                <img src={ManageEmployee} alt="" />
              </figure>
              Employees
            </button>
          </li> */}
          {/* <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive(
                  "/Backoffice/BackOffice|SupplierReconciliationList.aspx"
                )
                  ? "text-primary"
                  : "text-secondary")
              }
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
            Supplier  Reconciliation
            </button>
          </li> */}

          {/* reconciliation  */}
          {/* <AuthorizeComponent title="dashboard-menu~reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(7, "dashboard-menu~reconciliation")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageAccountIconnew}
                    alt=""
                  />
                </figure>
                Accounts / Reconciliation
              </button>
              {subMenyKey === 7 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~reconciliation-customer-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/CustomerReconciliation")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          this.handleRedirect("/CustomerReconciliation", undefined, "dashboard-menu~reconciliation-customer-reconciliation")
                        }
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Customer Reconciliation
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-customer-ledger" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/CustomerLedger")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/CustomerLedger", undefined, "dashboard-menu~reconciliation-customer-ledger")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Customer Ledger
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-supplier-management" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/SupplierManagement")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => {
                          this.handleRedirect("/SupplierManagement", undefined, "dashboard-menu~reconciliation-supplier-management");
                        }}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Supplier Management
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-supplier-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/SupplierInvoices") ||
                            this.getActiveForm("/SupplierInvoice") ||
                            this.getActiveForm("/SupplierPayment")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/SupplierInvoices", undefined, "dashboard-menu~reconciliation-supplier-reconciliation")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Supplier Reconciliation
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-supplier-ledger" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/SupplierLedgers")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => {
                          this.handleRedirect("/SupplierLedgers", undefined, "dashboard-menu~reconciliation-supplier-ledger");
                        }}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Supplier Ledgers
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-bsp-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/BSPCommission")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          this.handleRedirect("/BSPCommission", undefined, "dashboard-menu~dashboard")
                        }
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        BSP Reconciliation
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-debit-note" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/DebitNote") ||
                            this.getActiveForm("/DebitNote") ||
                            this.getActiveForm("/DebitNote")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/DebitNote", undefined, "dashboard-menu~reconciliation-debit-note")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Debit Note
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~reconciliation-credit-note" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/CreditNote") ||
                            this.getActiveForm("/CreditNote") ||
                            this.getActiveForm("/CreditNote")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/CreditNote", undefined, "dashboard-menu~reconciliation-credit-note")}
                      >
                        <figure>
                          <img src={ManageBooking} alt="" />
                        </figure>
                        Credit Note
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          
          
          <AuthorizeComponent title="dashboard-menu~accountsettings" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(10, "dashboard-menu~accountsettings")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageAccountSettingIconnew}
                    alt=""
                  />
                </figure>
                Account Settings
              </button>
              {subMenyKey === 10 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~accountsettings-billingsubscription" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/BillingAndSubscription")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          this.handleRedirect("/BillingAndSubscription", undefined, "dashboard-menu~accountsettings-billingsubscription")
                        }
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Billing and Subscription
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~accountsettings-paymenthistory" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/BillingAndSubscriptionHistory")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          this.handleRedirect("/BillingAndSubscriptionHistory", undefined, "dashboard-menu~accountsettings-billingsubscription")
                        }
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Payment History
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~managewebsite" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                className="btn btn-link text-secondary"
                onClick={() => this.toggleSubMenu(11, "dashboard-menu~managewebsite")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageWebsiteIconnew}
                    alt=""
                  />
                </figure>
                Manage Website
              </button>
              {subMenyKey === 11 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~managewebsite-claimyourwebsite" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/CustomerWebsite")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/CustomerWebsite", undefined, "dashboard-menu~managewebsite-claimyourwebsite")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Claim Your Website
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~managewebsite-selecttemplatetheme" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/SelectTemplate")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/SelectTemplate", undefined, "dashboard-menu~managewebsite-selecttemplatetheme")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Select Template / Theme
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~managewebsite-managecontent" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/ManageContent")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/ManageContent", undefined, "dashboard-menu~managewebsite-managecontent")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Manage Content
                      </button>
                    </li>
                  </AuthorizeComponent>
                  <AuthorizeComponent title="dashboard-menu~agentsettings-configurations" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (this.getActive("/Configuration")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => this.handleRedirect("/Configuration", undefined, "dashboard-menu~agentsettings-configurations")}
                      >
                        <figure>
                          <img src={CompanyProf} alt="" />
                        </figure>
                        Configuration
                      </button>
                    </li>
                  </AuthorizeComponent>
                </ul>
              )}
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~offers" type="button" rolepermissions={userInfo.rolePermissions}>
            <li>
              <button
                //className="btn btn-link text-secondary"
                className={
                  "btn btn-link " +
                  (this.getActive("/Deals") ? "text-primary" : "text-secondary")
                }
                onClick={() => this.handleRedirect("/Deals", undefined, "dashboard-menu~offers")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={OffersIconnew}
                    alt=""
                  />
                </figure>
                Offers
              </button>
            </li>
          </AuthorizeComponent>
          <AuthorizeComponent title="dashboard-menu~rewardprogram" type="button" rolepermissions={userInfo.rolePermissions}>
            <li className={IsLiveSearchEnable ? "" : "mb-4"}>
              <button
                className={
                  "btn btn-link " +
                  (this.getActive("/Rewards")
                    ? "text-primary"
                    : "text-secondary")
                }
                onClick={() => this.handleRedirect("/Rewards", undefined, "dashboard-menu~rewardprogram")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={RewardsIconnew}
                    alt=""
                  />
                </figure>
                Reward Program
              </button>
            </li>
          </AuthorizeComponent> */}
          {
            IsLiveSearchEnable &&
            <AuthorizeComponent title="dashboard-menu~bookonline" type="button" rolepermissions={userInfo.rolePermissions}>
              <li className="mb-4">
                <button
                  className="btn btn-link text-secondary"
                  onClick={() => this.toggleSubMenu(13, "dashboard-menu~bookonline")}
                >
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={searchIcon}
                      alt=""
                    />
                  </figure>
                  Book Online
                </button>
                {subMenyKey === 13 && (
                  <ul className="list-unstyled p-0 m-0 sub-menu">
                    <AuthorizeComponent title="dashboard-menu~bookonline-search" type="button" rolepermissions={userInfo.rolePermissions}>
                      <li>
                        <button
                          className={
                            "btn btn-link ml-3 " +
                            (this.getActive("/search")
                              ? "text-primary"
                              : "text-secondary")
                          }
                          onClick={() =>
                            this.handleRedirect("/search", undefined, "dashboard-menu~bookonline-search")
                          }
                        >
                          <figure>
                            <img src={CompanyProf} alt="" />
                          </figure>
                          Search
                        </button>
                      </li>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~bookonline-Balance" type="button" rolepermissions={userInfo.rolePermissions}>
                      <li>
                        <button
                          className={
                            "btn btn-link ml-3 " +
                            (this.getActive("/Balance")
                              ? "text-primary"
                              : "text-secondary")
                          }
                          onClick={() =>
                            this.handleRedirect("/Balance", undefined, "dashboard-menu~bookonline-Balance")
                          }
                        >
                          <figure>
                            <img src={CompanyProf} alt="" />
                          </figure>
                          My Balance
                        </button>
                      </li>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~bookonline-failedbookings" type="button" rolepermissions={userInfo.rolePermissions}>
                      <li>
                        <button
                          className={
                            "btn btn-link ml-3 " +
                            (this.getActive("/FailedBookings")
                              ? "text-primary"
                              : "text-secondary")
                          }
                          onClick={() =>
                            this.handleRedirect("/FailedBookings", undefined, "dashboard-menu~bookonline-failedbookings")
                          }
                        >
                          <figure>
                            <img src={CompanyProf} alt="" />
                          </figure>
                          Failed Bookings
                        </button>
                      </li>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~bookonline-offlinebookings" type="button" rolepermissions={userInfo.rolePermissions}>
                      <li>
                        <button
                          className={
                            "btn btn-link ml-3 " +
                            (this.getActive("/OfflineBookings")
                              ? "text-primary"
                              : "text-secondary")
                          }
                          onClick={() =>
                            this.handleRedirect("/OfflineBookings", undefined, "dashboard-menu~bookonline-offlinebookings")
                          }
                        >
                          <figure>
                            <img src={CompanyProf} alt="" />
                          </figure>
                          Offline Bookings
                        </button>
                      </li>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~bookonline-IssueDocuments" type="button" rolepermissions={userInfo.rolePermissions}>
                      <li>
                        <button
                          className={
                            "btn btn-link ml-3 " +
                            (this.getActive("/IssueDocuments")
                              ? "text-primary"
                              : "text-secondary")
                          }
                          onClick={() =>
                            this.handleRedirect("/IssueDocuments", undefined, "dashboard-menu~bookonline-IssueDocuments")
                          }
                        >
                          <figure>
                            <img src={CompanyProf} alt="" />
                          </figure>
                          Issue Documents
                        </button>
                      </li>
                    </AuthorizeComponent>
                  </ul>
                )}
              </li>
            </AuthorizeComponent>
          }
          {/* <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive("/Reports")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() => this.handleRedirect("/", "Reports")}
            >
              <figure>
                <img src={Reports} alt="" />
              </figure>
              Reports
            </button>
          </li>
          <li>
            <button
              className={
                "btn btn-link " +
                (this.getActive("/Backoffice/MyAccount|UpdateProfile.aspx")
                  ? "text-primary"
                  : "text-secondary")
              }
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
              Profile
            </button>
          </li> */}
        </ul >

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
                  {Trans("_manageQuotation").replace("##Quotation##", Trans("_quotationReplaceKey"))}
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
                      "ChangePassword"
                      , undefined
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
        {
          this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
      </div >
    );
  }
}

export default QuotationMenu;
