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
import ModelLimitExceeded from "../../helpers/modelforlimitexceeded";


const QuotationMenuItems = ({ ...rest }) => {
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
        {/* <li>
            <button
              className={
                "btn btn-link " +
                (rest.getActive("/Dashboard-Agent")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() => rest.handleRedirect("/Dashboard-Agent")}
            >
              <figure>
                <img src={Reports} alt="" />
              </figure>
              Dashboard
            </button>
          </li> */}


        {/* ##--redesign menu item section start--## */}
        <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Dashboard"
              className={
                ((rest.getActive("/Dashboard-Tourwiz") || rest.getActive("/"))
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/Dashboard-Tourwiz", undefined, "dashboard-menu~dashboard")}
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
        <AuthorizeComponent title="dashboard-menu~inquiries" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              id="Inquiries"
              className={
                (rest.getActive("/InquiryList")
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/InquiryList", undefined, "dashboard-menu~inquiries-manage-inquiry")}
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
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~quotation" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Proposals"
              className={
                (rest.getActive("/QuotationList")
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/QuotationList", undefined, "dashboard-menu~quotation-manage-quotation")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIconnew}
                  alt=""
                />
              </figure>
              {Trans("_quotationReplaceKeys")}
            </button>
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Itineraries"
              className={
                (rest.getActive("/ItineraryList")
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/ItineraryList", undefined, "dashboard-menu~itineraries-manage-itineraries")}
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
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~packages" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              id="CustomerPackages"
              className={
                (rest.getActive("/PackageList")
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/PackageList", undefined, "dashboard-menu~packages-manage-package")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManagePackageIcon}
                  alt=""
                />
              </figure>
              Customized Packages
            </button>
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~manual-invoices" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Invoices"
              className={
                (rest.getActive("/ManualInvoices")
                  ? "btn btn-link text-primary"
                  : "btn btn-link text-secondary")}
              onClick={() => rest.handleRedirect("/ManualInvoices", undefined, "dashboard-menu~invoice-manage-invoice")}
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
          </li>
        </AuthorizeComponent>
        {/* ##--redesign menu item section end--## */}


        {/* <AuthorizeComponent title="dashboard-menu~inquiries" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              id="Inquiries"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(1, "dashboard-menu~inquiries")}
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
            {rest.subMenyKey === 1 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~inquiries-create-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateInquiry"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Inquiry", undefined, "dashboard-menu~inquiries-create-inquiry")}
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
                      id="ManageInquiries"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/InquiryList", undefined, "dashboard-menu~inquiries-manage-inquiry")}
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
                      id="ImportInquiries"
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
                </AuthorizeComponent>
              </ul>
            )}
          </li>
        </AuthorizeComponent> */}
        {/* <AuthorizeComponent title="dashboard-menu~packages" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              id="CustomerPackages"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(14, "dashboard-menu~packages")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManagePackageIcon}
                  alt=""
                />
              </figure>
              Customized Packages
            </button>
            {rest.subMenyKey === 14 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~master-packages-create-package" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateMasterPackage"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/masterpackage/add", undefined, "dashboard-menu~master-packages-create-package")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Create Master Package
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-packages-manage-package" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterPackages"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/masterpackagelist", undefined, "dashboard-menu~master-packages-manage-package")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Manage Master Packages
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~packages-create-package" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreatePackage"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/package/add", undefined, "dashboard-menu~packages-create-package")}
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
                      id="ManagePackages"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/PackageList", undefined, "dashboard-menu~packages-manage-package")}
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
              </ul>
            )}
          </li>
        </AuthorizeComponent> */}

        <AuthorizeComponent title="dashboard-menu~marketplacepackage" type="button" rolepermissions={userInfo.rolePermissions ? userInfo.rolePermissions : null}>
          <li>
            <button
              id="MarketplacePackages"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(141, "dashboard-menu~marketplacepackage")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManagePackageIcon}
                  alt=""
                />
              </figure>
              Marketplace Packages
            </button>
            {rest.subMenyKey === 141 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~marketplacepackage-create-marketplacepackage" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateMarketPlacePackage"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/packagemarketplace/add", undefined, "dashboard-menu~marketplacepackage-create-marketplacepackage")}
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
                <AuthorizeComponent title="dashboard-menu~marketplacepackage-manage-marketplacepackage" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMarketPlacePackage"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/packagemarketplacelist", undefined, "dashboard-menu~marketplacepackage-manage-marketplacepackage")}
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
              </ul>
            )}
          </li>
        </AuthorizeComponent>
        {/* <AuthorizeComponent title="dashboard-menu~itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Itineraries"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(2, "dashboard-menu~itineraries")}
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
            {rest.subMenyKey === 2 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~master-itineraries-create-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateMasterItinerary"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Itinerary_Master/Create", undefined, "dashboard-menu~master-itineraries-create-itineraries")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateItineraryIcon}
                          alt=""
                        />
                      </figure>
                      Create Master Itinerary
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-itineraries-manage-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterItineraries"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/ItineraryList_Master", undefined, "dashboard-menu~master-itineraries-manage-itineraries")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageItineraryIcon}
                          alt=""
                        />
                      </figure>
                      Manage Master Itineraries
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~itineraries-create-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateItinerary"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Itinerary/Create", undefined, "dashboard-menu~itineraries-create-itineraries")}
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
                      id="ManageItineraries"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/ItineraryList", undefined, "dashboard-menu~itineraries-manage-itineraries")}
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
                      id="ContentLibrary"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ContentLibrary")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/ContentLibrary", undefined, "dashboard-menu~itineraries-content-library")}
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
                      id="ImportItinerary"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ImportItinerary")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/ImportItinerary", undefined, "dashboard-menu~itineraries-import-itineraries")}
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
        </AuthorizeComponent> */}
        {/* <AuthorizeComponent title="dashboard-menu~quotation" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Proposals"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(3, "dashboard-menu~quotation")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageQuotationIconnew}
                  alt=""
                />
              </figure>
              {Trans("_quotationReplaceKeys")}
            </button>
            {rest.subMenyKey === 3 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~master-quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateMasterProposal"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Quotation_Master/Create", undefined, "dashboard-menu~master-quotation-create-quotation")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateQuotationIcon}
                          alt=""
                        />
                      </figure>
                      Create Master {Trans("_quotationReplaceKey")}
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-quotation-manage-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterProposal"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/QuotationList_Master", undefined, "dashboard-menu~master-quotation-manage-quotation")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageQuotationIcon}
                          alt=""
                        />
                      </figure>
                      Manage Master {Trans("_quotationReplaceKeys")}
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~quotation-create-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateProposal"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Quotation/Create", undefined, "dashboard-menu~quotation-create-quotation")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={CreateQuotationIcon}
                          alt=""
                        />
                      </figure>
                      Create {Trans("_quotationReplaceKey")}
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~quotation-manage-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageProposal"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/QuotationList", undefined, "dashboard-menu~quotation-manage-quotation")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageQuotationIcon}
                          alt=""
                        />
                      </figure>
                      Manage {Trans("_quotationReplaceKeys")}
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~quotation-import-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ImportProposals"
                      //className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/ImportQuotation", undefined, "dashboard-menu~quotation-import-quotation")}
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ImportQuotation")
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
                      Import {Trans("_quotationReplaceKeys")}
                    </button>
                  </li>
                </AuthorizeComponent>
              </ul>
            )}
          </li>
        </AuthorizeComponent> */}
        {/* <AuthorizeComponent title="dashboard-menu~manual-invoices" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Invoices"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(12, "dashboard-menu~manual-invoices")}
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
            {rest.subMenyKey === 12 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateInvoice"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/ManualInvoice/Create", undefined, "dashboard-menu~invoice-create-invoice")}
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
                <AuthorizeComponent title="dashboard-menu~invoice-create-invoice" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CreateVoucher"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/Manualvoucher/Create", undefined, "dashboard-menu~invoice-create-invoice")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageItineraryIcon}
                          alt=""
                        />
                      </figure>
                      Create Voucher
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~invoice-manage-invoice" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageInvoices/Voucher"
                      className={"btn btn-link ml-3 " +
                        (rest.getActive("/ManualInvoices")
                          ? "text-primary"
                          : "text-secondary")}
                      onClick={() => rest.handleRedirect("/ManualInvoices", undefined, "dashboard-menu~invoice-manage-invoice")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageItineraryIcon}
                          alt=""
                        />
                      </figure>
                      Manage Invoices/Voucher
                    </button>
                  </li>
                </AuthorizeComponent>
              </ul>
            )}
          </li>
        </AuthorizeComponent> */}
        {/* <li>
            <button
              className="btn btn-link text-secondary"
              onClick={() => rest.handleRedirect("/Customer/list")}
            >
              <figure>
                <img src={ManageCustomer} alt="" />
              </figure>
              Customers
            </button>
          </li> */}
        <AuthorizeComponent title="dashboard-menu~customer" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Customer"

              className="btn btn-link text-secondary dropdown-toggle"
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
              <span class="caret"></span>
            </button>
            {rest.subMenyKey === 4 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~customer-customers" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="Customers"
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
                {/* <AuthorizeComponent title="dashboard-menu~customer-import-customers" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ImportCustomers"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ImportCustomer")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/ImportCustomer", undefined, "dashboard-menu~customer-import-customers")}
                    >
                      <figure>
                        <img src={ManageCustomer} alt="" />
                      </figure>
                      Import Customers
                    </button>
                  </li>
                </AuthorizeComponent> */}
                <AuthorizeComponent title="dashboard-menu~customer-invoices" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CustomerInvoices"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/CustomerInvoices")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/CustomerInvoices", undefined, "dashboard-menu~customer-invoices")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Invoices
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~customer-bookings" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="Bookings"
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
                {/* <AuthorizeComponent title="bookings~customer-bookings-import" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ImportBookings"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ImportBookings")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/ImportBookings", undefined, "bookings~customer-bookings-import")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Import Bookings
                    </button>
                  </li>
                </AuthorizeComponent> */}
              </ul>
            )}
          </li>
        </AuthorizeComponent>
        {/* <li>
            <button
              className={
                "btn btn-link " +
                (rest.getActive("/Backoffice/Admin|CrewList.aspx")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() =>
                rest.handleRedirect("Admin|CrewList.aspx", "back-office")
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
                (rest.getActive(
                  "/Backoffice/BackOffice|SupplierReconciliationList.aspx"
                )
                  ? "text-primary"
                  : "text-secondary")
              }
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
            Supplier  Reconciliation
            </button>
          </li> */}

        {/* reconciliation  */}
        <AuthorizeComponent title="dashboard-menu~reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Accounts/Reconciliation"
              className="btn btn-link text-secondary dropdown-toggle"
              onClick={() => rest.toggleSubMenu(7, "dashboard-menu~reconciliation")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageAccountIconnew}
                  alt=""
                />
              </figure>
              Accounts / Reconciliation
              <span class="caret"></span>
            </button>
            {rest.subMenyKey === 7 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~reconciliation-customer-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CustomerReconciliation"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/CustomerReconciliation")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/CustomerReconciliation", undefined, "dashboard-menu~reconciliation-customer-reconciliation")
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
                      id="CustomerLedger"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/CustomerLedger")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/CustomerLedger", undefined, "dashboard-menu~reconciliation-customer-ledger")}
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
                      id="SupplierManagement"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SupplierManagement")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => {
                        rest.handleRedirect("/SupplierManagement", undefined, "dashboard-menu~reconciliation-supplier-management");
                      }}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Supplier Management
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~reconciliation-import-supplier" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ImportSupplier"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ImportSupplier")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => {
                        rest.handleRedirect("/ImportSupplier", undefined, "dashboard-menu~reconciliation-import-supplier");
                      }}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Import Suppliers
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~reconciliation-supplier-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="SupplierReconciliation"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SupplierInvoices") ||
                          rest.getActiveForm("/SupplierInvoice") ||
                          rest.getActiveForm("/SupplierPayment")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/SupplierInvoices", undefined, "dashboard-menu~reconciliation-supplier-reconciliation")}
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
                      id="SupplierLedgers"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SupplierLedgers")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => {
                        rest.handleRedirect("/SupplierLedgers", undefined, "dashboard-menu~reconciliation-supplier-ledger");
                      }}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Supplier Ledger
                    </button>
                  </li>
                </AuthorizeComponent>
                {/* <AuthorizeComponent title="dashboard-menu~reconciliation-bsp-reconciliation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="BSPReconciliation"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BSPCommission")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/BSPCommission", undefined, "dashboard-menu~dashboard")
                      }
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      BSP Reconciliation
                    </button>
                  </li>
                </AuthorizeComponent> */}
                {/* <AuthorizeComponent title="dashboard-menu~reconciliation-debit-note" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/DebitNote") ||
                          rest.getActiveForm("/DebitNote") ||
                          rest.getActiveForm("/DebitNote")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/DebitNote", undefined, "dashboard-menu~reconciliation-debit-note")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Debit Note
                    </button>
                  </li>
                </AuthorizeComponent> */}
                {/* <AuthorizeComponent title="dashboard-menu~reconciliation-credit-note" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/CreditNote") ||
                          rest.getActiveForm("/CreditNote") ||
                          rest.getActiveForm("/CreditNote")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/CreditNote", undefined, "dashboard-menu~reconciliation-credit-note")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Credit Note
                    </button>
                  </li>
                </AuthorizeComponent> */}
              </ul>
            )}
          </li>
        </AuthorizeComponent>
        <AuthorizeComponent title="dashboard-menu~report" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Reports"
              className="btn btn-link text-secondary dropdown-toggle"
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
              <span class="caret"></span>
            </button>
            {rest.subMenyKey === 5 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~report-inquiry" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="InquiryReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/InquiryReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/InquiryReport", undefined, "dashboard-menu~report-inquiry")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Inquiry Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <li className="d-none">
                  <button
                    id="quotationReport"
                    className={
                      "btn btn-link ml-3 " +
                      (rest.getActive("/QuotationReport")
                        ? "text-primary"
                        : "text-secondary")
                    }
                    onClick={() => rest.handleRedirect("/QuotationReport", undefined, "dashboard-menu~report-inquiry")}
                  >
                    <figure>
                      <img src={ManageBooking} alt="" />
                    </figure>
                    Proposal Report
                  </button>
                </li>
                <AuthorizeComponent title="dashboard-menu~report-booking" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="BookingReport"
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
                      id="SalesReport"
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
                      id="RevenueReport"
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
                <AuthorizeComponent title="dashboard-menu~report-outstanding" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="OutstandingReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/OutstandingReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/OutstandingReport", undefined, "dashboard-menu~report-outstanding")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Outstanding Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-collection" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="CollectionReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/CollectionReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/CollectionReport", undefined, "dashboard-menu~report-collection")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Collection Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-leads" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="LeadsReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/LeadsReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/LeadsReport", undefined, "dashboard-menu~report-leads")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Leads Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-supplier" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="SupplierReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SupplierReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/SupplierReport", undefined, "dashboard-menu~report-supplier")}
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Supplier Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-supplierpayment" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="SupplierPaymentReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/SupplierPaymentReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/SupplierPaymentReport", undefined, "dashboard-menu~report-supplierpayment")
                      }
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Supplier Payment Report
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~report-attendancereport" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="AttendanceReport"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/AttendanceReport")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/AttendanceReport", undefined, "dashboard-menu~report-attendancereport")
                      }
                    >
                      <figure>
                        <img src={ManageBooking} alt="" />
                      </figure>
                      Attendance Report
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
              id="AgencySettings"
              className="btn btn-link text-secondary dropdown-toggle"
              onClick={() => rest.toggleSubMenu(9, "dashboard-menu~agentsettings")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageAgencyIconnew}
                  alt=""
                />
              </figure>
              Administration
              <span class="caret"></span>
            </button>
            {rest.subMenyKey === 9 && (
              <ul className="list-unstyled p-0 m-0 sub-menu ">
                <AuthorizeComponent title="dashboard-menu~agentsettings-profile" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="Profile"
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
                      id="Employees"
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
                {/*<li>
                  <button
                    className={
                      "btn btn-link ml-3 " +
                      (rest.getActive("/CategoryManagement")
                        ? "text-primary"
                        : "text-secondary")
                    }
                    onClick={() => rest.handleRedirect("/CategoryManagement")}
                  >
                    <figure>
                      <img src={ManageBooking} alt="" />
                    </figure>
                    Category Management
                  </button>
                </li>
                <li>
                  <button
                    className={
                      "btn btn-link ml-3 " +
                      (rest.getActive("/BranchManagement")
                        ? "text-primary"
                        : "text-secondary")
                    }
                    onClick={() => rest.handleRedirect("/BranchManagement")}
                  >
                    <figure>
                      <img src={ManageBooking} alt="" />
                    </figure>
                    Branch Management
                  </button>
                </li>*/}
                {/* <li>
                  <button
                    className={
                      "btn btn-link ml-3 " +
                      (rest.getActive("/AgentWalletManagement")
                        ? "text-primary"
                        : "text-secondary")
                    }
                    onClick={() => rest.handleRedirect("/AgentWalletManagement")}
                  >
                    <figure>
                      <img src={ManageBooking} alt="" />
                    </figure>
                    Agent Wallet Management
                  </button>
                </li> */}
                <AuthorizeComponent title="dashboard-menu~agentsettings-changepassword" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ChangePassword"
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
                <AuthorizeComponent title="dashboard-menu~agentsettings-markup-setup" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="MarkupSetup"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/MarkupSetup")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/MarkupSetup", undefined, "dashboard-menu~agentsettings-markup-setup")
                      }
                    >
                      <figure>
                        <img src={CompanyProf} alt="" />
                      </figure>
                      Markup Setup
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~agentsettings-agency-configurations" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="AgencyConfiguration"
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
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~agentsettings-tax-configuration" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="TaxConfiguration"
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
                <AuthorizeComponent title="dashboard-menu~itineraries-content-library" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ContentLibrary"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/ContentLibrary")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() => rest.handleRedirect("/ContentLibrary", undefined, "dashboard-menu~itineraries-content-library")}
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
                <AuthorizeComponent title="dashboard-menu~accountsettings-billingsubscription" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="BillingandSubscription"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BillingAndSubscription")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/BillingAndSubscription", undefined, "dashboard-menu~accountsettings-billingsubscription")
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
                      id="PaymentHistory"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BillingAndSubscriptionHistory")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/BillingAndSubscriptionHistory", undefined, "dashboard-menu~accountsettings-billingsubscription")
                      }
                    >
                      <figure>
                        <img src={CompanyProf} alt="" />
                      </figure>
                      Payment History
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-packages-manage-package" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterPackages"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/masterpackagelist", undefined, "dashboard-menu~master-packages-manage-package")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageInquiryIcon}
                          alt=""
                        />
                      </figure>
                      Master Packages
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-itineraries-manage-itineraries" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterItineraries"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/ItineraryList_Master", undefined, "dashboard-menu~master-itineraries-manage-itineraries")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageItineraryIcon}
                          alt=""
                        />
                      </figure>
                      Master Itineraries
                    </button>
                  </li>
                </AuthorizeComponent>
                <AuthorizeComponent title="dashboard-menu~master-quotation-manage-quotation" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="ManageMasterProposal"
                      className="btn btn-link text-secondary ml-3"
                      onClick={() => rest.handleRedirect("/QuotationList_Master", undefined, "dashboard-menu~master-quotation-manage-quotation")}
                    >
                      <figure>
                        <img
                          style={{ filter: "none" }}
                          src={ManageQuotationIcon}
                          alt=""
                        />
                      </figure>
                      Master {Trans("_quotationReplaceKeys")}
                    </button>
                  </li>
                </AuthorizeComponent>
              </ul>
            )}
          </li>
        </AuthorizeComponent>
        {/* <AuthorizeComponent title="dashboard-menu~accountsettings" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="AccountSettings"
              className="btn btn-link text-secondary"
              onClick={() => rest.toggleSubMenu(10, "dashboard-menu~accountsettings")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageAccountSettingIconnew}
                  alt=""
                />
              </figure>
              Subscriptions
            </button>
            {rest.subMenyKey === 10 && (
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <AuthorizeComponent title="dashboard-menu~accountsettings-billingsubscription" type="button" rolepermissions={userInfo.rolePermissions}>
                  <li>
                    <button
                      id="BillingandSubscription"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BillingAndSubscription")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/BillingAndSubscription", undefined, "dashboard-menu~accountsettings-billingsubscription")
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
                      id="PaymentHistory"
                      className={
                        "btn btn-link ml-3 " +
                        (rest.getActive("/BillingAndSubscriptionHistory")
                          ? "text-primary"
                          : "text-secondary")
                      }
                      onClick={() =>
                        rest.handleRedirect("/BillingAndSubscriptionHistory", undefined, "dashboard-menu~accountsettings-billingsubscription")
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
        </AuthorizeComponent> */}
        <AuthorizeComponent title="dashboard-menu~managewebsite" type="button" rolepermissions={userInfo.rolePermissions}>
          {localStorage.getItem("isCMSPortalCreated") === "false" ? <li>
            <button
              // className={
              //   "btn btn-link dropdown-toggle" +
              //   (rest.getActive("/Dashboard-Agent")
              //     ? "text-primary"
              //     : "text-secondary")
              // }
              className="btn btn-link text-secondary dropdown-toggle"
              onClick={() => rest.handleRedirect("/CustomerWebsite", undefined, "dashboard-menu~managewebsite-claimyourwebsite")}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageWebsiteIconnew}
                  alt="" />
              </figure>
              Claim Website
              <span class="caret"></span>
            </button>
          </li> :
            <li>
              <button
                id="ManageWebsite"
                className="btn btn-link text-secondary dropdown-toggle"
                onClick={() => rest.toggleSubMenu(11, "dashboard-menu~managewebsite")}
              >
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={ManageWebsiteIconnew}
                    alt=""
                  />
                </figure>
                Manage Website
                <span class="caret"></span>
              </button>
              {rest.subMenyKey === 11 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~managewebsite-claimyourwebsite" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        id="ClaimYourWebsite"
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/CustomerWebsite")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/CustomerWebsite", undefined, "dashboard-menu~managewebsite-claimyourwebsite")}
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
                        id="SelectTemplate/Theme"
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/SelectTemplate")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/SelectTemplate", undefined, "dashboard-menu~managewebsite-selecttemplatetheme")}
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
                        id="ManageContent"
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/ManageContent")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/ManageContent", undefined, "dashboard-menu~managewebsite-managecontent")}
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
                        id="Configuration"
                        className={
                          "btn btn-link ml-3 " +
                          (rest.getActive("/Configuration")
                            ? "text-primary"
                            : "text-secondary")
                        }
                        onClick={() => rest.handleRedirect("/Configuration", undefined, "dashboard-menu~agentsettings-configurations")}
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
          }
        </AuthorizeComponent>
        {/* <AuthorizeComponent title="dashboard-menu~offers" type="button" rolepermissions={userInfo.rolePermissions}>
          <li>
            <button
              id="Offers"
              //className="btn btn-link text-secondary"
              className={
                "btn btn-link " +
                (rest.getActive("/Deals") ? "text-primary" : "text-secondary")
              }
              onClick={() => rest.handleRedirect("/Deals", undefined, "dashboard-menu~offers")}
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
        </AuthorizeComponent> */}
        {/* <AuthorizeComponent title="dashboard-menu~rewardprogram" type="button" rolepermissions={userInfo.rolePermissions}>
          <li className={IsLiveSearchEnable ? "" : "mb-4"}>
            <button
              className={
                "btn btn-link " +
                (rest.getActive("/Rewards")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() => rest.handleRedirect("/Rewards", undefined, "dashboard-menu~rewardprogram")}
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
        {IsLiveSearchEnable &&
          <AuthorizeComponent title="dashboard-menu~bookonline" type="button" rolepermissions={userInfo.rolePermissions}>
            <li className="mb-4">
              <button
                id="BookOnline"
                className="btn btn-link text-secondary dropdown-toggle"
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
                <span class="caret"></span>
              </button>
              {rest.subMenyKey === 13 && (
                <ul className="list-unstyled p-0 m-0 sub-menu">
                  <AuthorizeComponent title="dashboard-menu~bookonline-search" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        id="Search"
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
                  <AuthorizeComponent title="dashboard-menu~bookonline-failedbookings" type="button" rolepermissions={userInfo.rolePermissions}>
                    <li>
                      <button
                        id="FailedBookings"
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
                        id="OfflineBookings"
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
                </ul>
              )}
            </li>
          </AuthorizeComponent>
        }
        {/* <li>
            <button
              className={
                "btn btn-link " +
                (rest.getActive("/Reports")
                  ? "text-primary"
                  : "text-secondary")
              }
              onClick={() => rest.handleRedirect("/", "Reports")}
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
                (rest.getActive("/Backoffice/MyAccount|UpdateProfile.aspx")
                  ? "text-primary"
                  : "text-secondary")
              }
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
              Profile
            </button>
          </li> */}
      </ul>

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
      {
        rest.isSubscriptionPlanend &&
        <ModelLimitExceeded
          header={"Plan Limitations Exceeded"}
          content={"The maximum recommended plan has been exceeded"}
          handleHide={rest.hidelimitpopup}
          history={rest.history}
        />
      }
    </div>
  );
};

export default QuotationMenuItems;
