import React from "react";
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
import ManagePackageIcon from "../../assets/images/dashboard/manage-package.svg";
import CreateItineraryIcon from "../../assets/images/dashboard/create-itinerary.png";
import ManageItineraryIcon from "../../assets/images/dashboard/manage-itinerary.png";
import FlightPaperRateIcon from "../../assets/images/dashboard/flightpaperrate.svg";
import CreateQuotationIcon from "../../assets/images/dashboard/create-quotation.png";
import ManageQuotationIcon from "../../assets/images/dashboard/manage-qotations.png";
import ManageCustomerIconnew from "../../assets/images/dashboard/manage-customer-new.svg";
import ManageReportsIconnew from "../../assets/images/dashboard/manage-reports-new.svg";
import ManageLocations from "../../assets/images/dashboard/location-edit.svg";
import DashboardIconnew from "../../assets/images/dashboard/dashboard-new.svg";
import ManageAgencyIconnew from "../../assets/images/dashboard/manage-agency-new.svg";
import searchIcon from "../../assets/images/dashboard/search.svg";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";


const QuotationMenuItemsTripCenter = ({ ...rest }) => {
  let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
  let IsLiveSearchEnable = Global.getEnvironmetKeyValue("IsLiveSearchEnable", "cobrand");
  const role = localStorage.getItem("afUserType");

  const userInfo = rest.userInfo;
  return (
    <div
      className="shadow-sm p-3 agent-dashboard-menu praful"
      style={{ height: "100%" }}
    >
      <ul className="list-unstyled p-0 m-0">
        <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.handleRedirect("/", undefined, "dashboard-menu~dashboard")}
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
        <AuthorizeComponent title="dashboard-menu~customizeddeals" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(141, "dashboard-menu~customizeddeals")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManagePackageIcon}
                  alt=""
                />
              </figure>
              Customized Deals
            </button>
            {rest.subMenyKey === 141 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                {/* <AuthorizeComponent title="dashboard-menu~deals-create-deal" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/hotdeals/add", undefined, "dashboard-menu~deals-create-deal")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Create Deal
                    </button>
                  </li>
                </AuthorizeComponent> */}
                <AuthorizeComponent title="dashboard-menu~customizeddeals" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/HotdealsList", undefined, "dashboard-menu~customizeddeals")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Manage Deals
                    </button>
                  </li>
                </AuthorizeComponent>
                {/* <AuthorizeComponent title="dashboard-menu~inquiries-import-inquiries" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/ImportInquiries")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/ImportInquiries", undefined, "dashboard-menu~inquiries-import-inquiries")}
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
                  </AuthorizeComponent> */}
              </ul>
            )}
          </li>
        </AuthorizeComponent>

        <AuthorizeComponent title="dashboard-menu~destinations" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>

          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(144, "dashboard-menu~destinations")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageLocations}
                  alt=""
                />
              </figure>
              Destinations
            </button>
            {rest.subMenyKey === 144 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                {/* <AuthorizeComponent title="dashboard-menu~deals-create-deal" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Location/add", undefined, "dashboard-menu~deals-create-deal")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Create Destination
                    </button>
                  </li>
                </AuthorizeComponent> */}
                <AuthorizeComponent title="dashboard-menu~destinations" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/LocationList", undefined, "dashboard-menu~destinations")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Manage Destinations
                    </button>
                  </li>
                </AuthorizeComponent>
              </ul>
            )}
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~paperrates" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(15, "dashboard-menu~paperrates")}
            >
              <figure>
                <img
                  style={{ filter: "none", height: "20px", opacity: 0.5 }}
                  src={FlightPaperRateIcon}
                  alt=""
                />
              </figure>
              Paper Rates
            </button>
            {rest.subMenyKey === 15 && (
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
                        (rest.getActive("/paperrateslist")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/paperrateslist", undefined, "dashboard-menu~paperrates-manage")}
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
                        (rest.getActive("/paperratesbookings")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/Bookings/onlypaperratesbookings", undefined, "dashboard-menu~paperrates-bookings")}
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
        {/* </AuthorizeComponent> */}
        <AuthorizeComponent title="dashboard-menu~agentsettings" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(9, "dashboard-menu~agentsettings")}
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
            {rest.subMenyKey === 9 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~agentsettings-profile" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/UpdateProfile")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/UpdateProfile", undefined, "dashboard-menu~agentsettings-profile")}
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
                        (rest.getActive("/EmployeeList") ||
                          rest.getActiveForm("/Employee")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/EmployeeList", undefined, "dashboard-menu~agentsettings-employees")}
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
                        (rest.getActive(
                          "/ChangePassword"
                        )
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect(
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
                {/* <AuthorizeComponent title="dashboard-menu~agentsettings-agency-configurations" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/AgencyConfiguration")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/AgencyConfiguration", undefined, "dashboard-menu~agentsettings-agency-configurations")}
                    >
                      <figure>
                        <img src={CompanyProf} alt="" />
                      </figure>
                      Agency Configuration
                    </button>
                  </li>
                </AuthorizeComponent> */}
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

              </ul>
            )}
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~customer" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(4, "dashboard-menu~customer")}
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
            {rest.subMenyKey === 4 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~customer-customers" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className="btn btn-link text-secondary ml-3 "
                      onClick={() => rest.handleRedirect("/Customer/list", undefined, "dashboard-menu~customer-customers")}
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
                      onClick={() => rest.handleRedirect("/Bookings", undefined, "dashboard-menu~customer-bookings")}
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
              onClick={() => rest.toggleSubMenu(5, "dashboard-menu~report")}
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
            {rest.subMenyKey === 5 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~report-booking" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BookingReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/BookingReport", undefined, "dashboard-menu~report-booking")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Booking Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-sales" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SalesReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/SalesReport", undefined, "dashboard-menu~report-sales")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Sales Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-revenue" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/RevenueReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/RevenueReport", undefined, "dashboard-menu~report-revenue")}
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
        {
          IsLiveSearchEnable &&
          <AuthorizeComponent title="dashboard-menu~bookonline" type="button" rolepermissions={userInfo.rolePermissions}>
            <li className="mb-4">
              <button
                className="btn btn-link text-secondary"
                onClick={() => rest.toggleSubMenu(13, "dashboard-menu~bookonline")}
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
              {rest.subMenyKey === 13 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~bookonline-search" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/search")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/search", undefined, "dashboard-menu~bookonline-search")
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
                          (rest.getActive("/Balance")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/Balance", undefined, "dashboard-menu~bookonline-Balance")
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
                          (rest.getActive("/FailedBookings")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/FailedBookings", undefined, "dashboard-menu~bookonline-failedbookings")
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
                          (rest.getActive("/OfflineBookings")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/OfflineBookings", undefined, "dashboard-menu~bookonline-offlinebookings")
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
                          (rest.getActive("/IssueDocuments")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() =>
                          rest.handleRedirect("/IssueDocuments", undefined, "dashboard-menu~bookonline-IssueDocuments")
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
      </ul >

      <ul className="list-unstyled p-0 m-0 d-none">
        <li>
          <button
            className="btn btn-link text-primary"
            onClick={() => rest.handleRedirect("/Dashboard-Agent")}
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
                onClick={() => rest.handleRedirect("/Inquiry")}
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
                onClick={() => rest.handleRedirect("/InquiryList")}
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
                onClick={() => rest.handleRedirect("/Itinerary/Create")}
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
                onClick={() => rest.handleRedirect("/ItineraryList")}
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
                onClick={() => rest.handleRedirect("/Quotation/Create")}
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
                onClick={() => rest.handleRedirect("/QuotationList")}
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
                onClick={() => rest.handleRedirect("/Bookings")}
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
                onClick={() => rest.handleRedirect("/Customer/list")}
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
                rest.handleRedirect("/Entity/AgentList.aspx", "back-office")
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
                  rest.handleRedirect("Admin|CrewList.aspx", "back-office")
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
                  rest.handleRedirect(
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
                onClick={() => rest.handleRedirect("/", "Reports")}
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
                  rest.handleRedirect(
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
                  rest.handleRedirect(
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
              onClick={() => rest.handleRedirect("/", "back-office")}
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
              onClick={() => rest.handleRedirect("/", "back-office")}
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
                  rest.handleRedirect("/Entity/AgentList.aspx", "back-office")
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
                    rest.handleRedirect(
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
                    rest.handleRedirect(
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
                onClick={() => rest.handleRedirect("/", "back-office")}
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
                    rest.handleRedirect(
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
                  rest.handleRedirect(
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
                    rest.handleRedirect(
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
                onClick={() => rest.handleRedirect("/", "back-office")}
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
                onClick={() => rest.handleRedirect("/", "back-office")}
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
        rest.isshowauthorizepopup &&
        <ModelPopupAuthorize
          header={""}
          content={""}
          handleHide={rest.hideauthorizepopup}
          history={rest.history}
        />
      }
    </div >
  );
};

export default QuotationMenuItemsTripCenter;
