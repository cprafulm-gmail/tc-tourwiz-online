import React, { Component } from "react";
import { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import QuotationMenuItems from "./quotation-menu-items";
import QuotationMenuItemsTripcenter from "./quotation-menu-items-tripcenter";
import Config from "../../config.json";
import * as GlobalEvent from "../../helpers/global-events";

class QuotationMenu extends Component {
  state = { subMenyKey: 0, isshowauthorizepopup: false, isSubscriptionPlanend: false };

  handleRedirect = (req, redirect, authorizeelement) => {
    if (!GlobalEvent.handleCheckforFreeExcess(this.props, authorizeelement)) {
      this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
      return;
    }
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

  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
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
      this.toggleSubMenu(9, (["/ContentLibrary"].indexOf(url) > -1 ? "dashboard-menu~itineraries-content-library" : "dashboard-menu~itineraries-import-itineraries"));
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
        "/BSPCommission",
        "/ImportSupplier"
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
      else if (["/ImportSupplier"].indexOf(url) > -1)
        this.toggleSubMenu(7, "dashboard-menu~reconciliation-import-supplier");
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
        "/AgencyConfiguration",
        "/TaxConfiguration"
        // "/AgentWalletManagement",
      ].indexOf(url) > -1
    ) {
      if (["/UpdateProfile"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-profile");
      else if (["/EmployeeList"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-employees");
      else if (["/MarkupSetup"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-markup-setup");
      else if (["/AgencyConfiguration"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-agency-configurations");
      else if (["/ChangePassword"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-changepassword");
      else if (["/Employee"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-employees");
      else if (["/TaxConfiguration"].indexOf(url) > -1)
        this.toggleSubMenu(9, "dashboard-menu~agentsettings-tax-configuration");

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
        "/AttendanceReport"
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
      else if (["/AttendanceReport"].indexOf(url) > -1)
        this.toggleSubMenu(5, "dashboard-menu~report-attendancereport");
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
        this.toggleSubMenu(9, "dashboard-menu~accountsettings-billingsubscription");
      else
        this.toggleSubMenu(9, "dashboard-menu~accountsettings-billingsubscription");
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
    if (!this.props.userInfo.rolePermissions) {
      return <React.Fragment></React.Fragment>
    }
    return (Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace") ? (
      <QuotationMenuItems
        getActive={this.getActive}
        getActiveForm={this.getActiveForm}
        toggleSubMenu={this.toggleSubMenu}
        handleRedirect={this.handleRedirect}
        hideauthorizepopup={this.hideauthorizepopup}
        hidelimitpopup={this.hidelimitpopup}
        {...this.state}
        {...this.props} />
    ) : (
      <QuotationMenuItemsTripcenter
        getActive={this.getActive}
        getActiveForm={this.getActiveForm}
        toggleSubMenu={this.toggleSubMenu}
        handleRedirect={this.handleRedirect}
        hideauthorizepopup={this.hideauthorizepopup}
        hidelimitpopup={this.hidelimitpopup}
        {...this.state}
        {...this.props} />
    );
  }
}

export default QuotationMenu;
