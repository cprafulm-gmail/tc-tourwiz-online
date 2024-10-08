import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import CompanyProf from "../assets/images/dashboard/company-prof.png";
import MakeBooking from "../assets/images/dashboard/make-booking.png";
import ManageAgents from "../assets/images/dashboard/manage-agents.png";
import ManageBooking from "../assets/images/dashboard/manage-booking.png";
import ManageCustomer from "../assets/images/dashboard/manage-customer.png";
import ManageEmployee from "../assets/images/dashboard/manage-employee.png";
import ManageRevenue from "../assets/images/dashboard/manage-revenue.png";
import ManageWallet from "../assets/images/dashboard/manage-wallet.png";
import MyWallet from "../assets/images/dashboard/my-wallet.png";
import Reports from "../assets/images/dashboard/reports.png";
import AffiliatePortals from "../assets/images/dashboard/affiliate-portals.png";
import ContentManagement from "../assets/images/dashboard/content-management.png";
import CustomerClass from "../assets/images/dashboard/customer-class.png";
import EmailTemplates from "../assets/images/dashboard/email-templates.png";
import MarketingCenter from "../assets/images/dashboard/marketing-center.png";
import PortalPolicies from "../assets/images/dashboard/portal-policies.png";
import Settings from "../assets/images/dashboard/settings.png";
import Suppliers from "../assets/images/dashboard/suppliers.png";
import * as Global from "../helpers/global";
import CallCenter from "../components/call-center/call-center";
import { Trans } from "../helpers/translate";

class Dashboard extends Component {
  state = { quotationMode: true };

  handleRedirect = (req, redirect) => {
    //let backofficeURL = 'http://backoffice.travelcarma.com';
    //let reportURL = 'http://tcreports.travelcarma.com';
    let portalId = Global.getEnvironmetKeyValue("portalId");

    let backofficeURL = window.location.protocol + '//' + window.location.host.replace(window.location.host.split('.')[0], 'backoffice');
    let reportURL = window.location.protocol + '//' + window.location.host.replace(window.location.host.split('.')[0], 'reports');

    // if (portalId === "15552" || portalId === "13608") {
    //   backofficeURL = 'https://backoffice.umrahvisit.online';
    //   reportURL = 'http://reports.umrahvisit.online';
    // }

    let redirectUrl = redirect === "back-office" ? backofficeURL + req : reportURL;

    !redirect ? this.props.history.push(`${req}`) : window.open(redirectUrl, "_blank");
  };

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");
    //const role = "B2BPortalAdminEmployee";

    return (
      <div className="dashboard">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30 d-inline">
              <SVGIcon name="list-ul" width="24" height="24" className="mr-3"></SVGIcon>
              {Trans("_dashboard")}
            </h1>
            {isPersonateEnabled && (
              <div className="pull-right dashboard-call-center" style={{ marginTop: "-2px" }}>
                <CallCenter />
              </div>
            )}
          </div>
        </div>
        <div className="container">
          <div className="dashboard-boxes mt-4">
            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "B2BPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Bookings")}>{Trans("_manageBookings")}</h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Search")}>{Trans("_makeBookings")}</h3>
                  <figure>
                    <img src={MakeBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "B2BPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              !localStorage.getItem("isUmrahPortal") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Customer/list")}>
                    {Trans("_manageCustomers")}
                  </h3>
                  <figure>
                    <img src={ManageCustomer} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              !localStorage.getItem("isUmrahPortal") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Balance")}>{Trans("_myWallet")}</h3>
                  <figure>
                    <img src={MyWallet} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              IsQuotation && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Quotation/Create")}>
                    {Trans("_createQuotation")}
                  </h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              IsQuotation && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/QuotationList")}>
                    {Trans("_manageQuotation").replace("##Quotation##", Trans("_quotationReplaceKeys"))}
                  </h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              IsQuotation && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Itinerary/Create")}>
                    {Trans("Create Itinerary")}
                  </h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              IsQuotation && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/ItineraryList")}>
                    {Trans("Manage Itineraries")}
                  </h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "B2BPortalAdmin" ||
              role === "CompanyPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3
                    onClick={() =>
                      this.handleRedirect("/MyAccount/UpdateProfile.aspx", "back-office")
                    }
                  >
                    {Trans("_myProfile")}
                  </h3>
                  <figure>
                    <img src={CompanyProf} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent") && !localStorage.getItem("isUmrahPortal") && (
              <div>
                <h3 onClick={() => this.handleRedirect("/Entity/AgentList.aspx", "back-office")}>
                  {Trans("_manageAgents")}
                </h3>
                <figure>
                  <img src={ManageAgents} alt="" />
                </figure>
              </div>
            )}

            {(role === "B2BPortalAdmin") && (
              <div>
                <h3 onClick={() => this.handleRedirect("/Entity/AgentList.aspx", "back-office")}>
                  {Trans("_manageAgents")}
                </h3>
                <figure>
                  <img src={ManageAgents} alt="" />
                </figure>
              </div>
            )}


            {(role === "CompanyPortalAdmin" || role === "admin") && (
              <div>
                <h3 onClick={() => this.handleRedirect("/Entity/AgentList.aspx", "back-office")}>
                  {Trans("_B2BB2CProfileManagement")}
                </h3>
                <figure>
                  <img src={ManageAgents} alt="" />
                </figure>
              </div>
            )}

            {(role === "B2BPortalAgent" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2BPortalAgentEmployee" ||
              role === "B2BPortalAdmin" ||
              role === "CompanyPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("", "report")}>{Trans("_reports")}</h3>
                  <figure>
                    <img src={Reports} alt="" />
                  </figure>
                </div>
              )}

            {role === "admin" && false && (
              <div>
                <h3 onClick={() => this.handleRedirect("/", "back-office")}>
                  {Trans("_manageContent")}
                </h3>
                <figure>
                  <img src={ContentManagement} alt="" />
                </figure>
              </div>
            )}

            {role === "admin" && false && (
              <div>
                <h3 onClick={() => this.handleRedirect("/", "back-office")}>
                  {Trans("_marketingCenter")}
                </h3>
                <figure>
                  <img src={MarketingCenter} alt="" />
                </figure>
              </div>
            )}

            {(role === "CompanyPortalAdmin" || role === "admin" || role === "B2BPortalAdmin") && !localStorage.getItem("isUmrahPortal") && (
              <div>
                <h3 onClick={() => this.handleRedirect("/Entity/AgentList.aspx", "back-office")}>
                  {Trans("_manageSuppliers")}
                </h3>
                <figure>
                  <img src={Suppliers} alt="" />
                </figure>
              </div>
            )}

            {(role === "B2BPortalAgent" ||
              role === "CompanyPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Admin/CrewList.aspx", "back-office")}>
                    {Trans("_manageEmployees")}
                  </h3>
                  <figure>
                    <img src={ManageEmployee} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAdmin" ||
              role === "B2BPortalAdminEmployee" ||
              role === "B2CPortalAdmin" ||
              role === "B2CPortalAdminEmployee" ||
              role === "CompanyPortalAdmin") && (
                <div>
                  <h3
                    onClick={() =>
                      this.handleRedirect("/Backoffice/EmailTemplateList.aspx", "back-office")
                    }
                  >
                    {Trans("_emailTemplates")}
                  </h3>
                  <figure>
                    <img src={EmailTemplates} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2BPortalAgent" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Agency/MarkupSetup.aspx", "back-office")}>
                    {Trans("_manageRevenue")}
                  </h3>
                  <figure>
                    <img src={ManageRevenue} alt="" />
                  </figure>
                </div>
              )}

            {role === "admin" && false && (
              <div>
                <h3 onClick={() => this.handleRedirect("/", "back-office")}>
                  {Trans("_affiliatePortals")}
                </h3>
                <figure>
                  <img src={AffiliatePortals} alt="" />
                </figure>
              </div>
            )}

            {(role === "B2BPortalAgent" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && !localStorage.getItem("isUmrahPortal") && (
                <div>
                  <h3
                    onClick={() =>
                      this.handleRedirect("/Admin/CustomerClassList.aspx", "back-office")
                    }
                  >
                    {Trans("_customerClasses")}
                  </h3>
                  <figure>
                    <img src={CustomerClass} alt="" />
                  </figure>
                </div>
              )}

            {(role === "B2CPortalAdmin" || role === "B2BPortalAdmin") && (
              <div>
                <h3
                  onClick={() =>
                    this.handleRedirect("/Policies/AdditionalChargePolicyList.aspx", "back-office")
                  }
                >
                  {Trans("_portalPolicies")}
                </h3>
                <figure>
                  <img src={PortalPolicies} alt="" />
                </figure>
              </div>
            )}

            {(role === "B2BPortalAgent" ||
              role === "CompanyPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "B2BPortalAdmin") && !localStorage.getItem("isUmrahPortal") && (
                <div>
                  <h3
                    onClick={() =>
                      this.handleRedirect("/Billing/AgentBalanceList.aspx", "back-office")
                    }
                  >
                    {Trans("_manageWallets")}
                  </h3>
                  <figure>
                    <img src={ManageWallet} alt="" />
                  </figure>
                </div>
              )}

            {role === "admin" && false && (
              <div>
                <h3 onClick={() => this.handleRedirect("/", "back-office")}>
                  {Trans("_settings")}
                </h3>
                <figure>
                  <img src={Settings} alt="" />
                </figure>
              </div>
            )}

            {role === "admin" && false && (
              <div>
                <h3 onClick={() => this.handleRedirect("/", "back-office")}>
                  {Trans("_corporateBooking")}
                </h3>
                <figure>
                  <img src={CompanyProf} alt="" />
                </figure>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
