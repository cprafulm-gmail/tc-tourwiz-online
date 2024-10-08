import React, { useState } from 'react';
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
import Register from "../../assets/images/person-circle.svg";
import Login from "../../assets/images/person-check.svg";
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
function TourwizHelpNav(props) {
  const [defaultDrawerMode, setDefaultDrawerMode] = useState({
    inquiries: false,
    itineraries: false,
    proposals: false,
    package: false,
    accountSettings: false,
    agencySettings: false,
    manageWebsite: false,
  })
  const [drawerMode, setDrawerMode] = useState({
    inquiries: false,
    itineraries: false,
    proposals: false,
    package: false,
    accountSettings: false,
    agencySettings: false,
    manageWebsite: false,
  });
  const handleTabMode = (mode) => {
    props.fetchTabMode(mode);
  }
  const handleDrawerMode = (e) => {
    const { name, value } = e.target;
    setDrawerMode({ ...defaultDrawerMode, [name]: value === 'true' ? true : false });
  }
  const css = `
  .agent-dashboard-menu {
    margin: 0px 0px 0px 0px;
}
.marketPlaceBtn {
  // box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset, 0px 0px 10px 0px #E48A3C;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#E48A3C), to(rgba(222, 135, 61, 0.24))), url("http://www.eatweartravel.com/wp-content/uploads/2015/04/i-love-shopping_1920x1200_83206.jpg");
  background-image: linear-gradient(to bottom, #E48A3C, rgba(222, 135, 61, 0.24)), url("http://www.eatweartravel.com/wp-content/uploads/2015/04/i-love-shopping_1920x1200_83206.jpg");
}
.marketPlaceBtn:hover {
  // box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset, 0px 0px 30px 0px #E48A3C;
  color: white;
}
.marketPlaceBtn:hover {
  // box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.16) inset, 0px 0px 30px 0px #E48A3C;
}
.marketPlaceBtn:hover:before {
  -webkit-transform: scale(1.2);
          transform: scale(1.2);
}
.marketPlaceBtn:before {
  content: "";
}
.marketPlaceBtn b {
  color: #FFD9B4;
  font-weight: 700;
}
.marketPlaceBtn {
  border: none;
  border-radius: 4px;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.48);
  overflow: hidden;
  // padding: 20px 50px 20px 70px;
  padding:10px 0px 10px 0px;
  font-size: 20px;
  position: relative;
  color: white;
  outline: none;
  cursor: pointer;
  width: 100%;
  -webkit-transition: background-position .7s,box-shadow .4s;
  transition: background-position .7s,box-shadow .4s;
  background-size: 110%;
  font-family: 'Oswald', sans-serif;
}
.marketPlaceBtn:hover {
  background-position: 0% 30%;
}

.marketPlaceBtn:before {
  font-family: FontAwesome;
  display: block;
  position: absolute;
}
.marketPlaceBtn:before {
  -webkit-transition: all 1s;
  transition: all 1s;
  font-size: 30px;
  left: 25px;
  top: 4px;
  // top: 19px;

}

`
  return (
    <>
      <style>{css}</style>
      <div
        className="shadow-sm agent-dashboard-menu"
        style={{ height: "100%" }}
      >
        {/* <button className='btn border-0 marketPlaceBtn'>Marketplace</button>
        <hr /> */}
        <ul className="list-unstyled p-0 m-0">
          <li>
            <button
              id="Register"
              name='register'
              className="btn btn-link text-secondary"
              onClick={() => handleTabMode('register')}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={Register}
                  alt=""
                />
              </figure>
              Register
            </button>
          </li>
          <li>
            <button
              id="Login"
              name='login'
              className="btn btn-link text-secondary"
              onClick={() => handleTabMode('login')}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={Login}
                  alt=""
                />
              </figure>
              Log In
            </button>
          </li>
          <li>
            <button
              id="Inquiries"
              className="btn btn-link text-secondary"
              name="inquiries"
              value={!drawerMode.inquiries}
              onClick={(e) => handleDrawerMode(e)}
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
            {drawerMode.inquiries &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="CreateInquiry"
                    name='createInquiries'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('createInquiries')}
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
                <li>
                  <button
                    id="manageInquiries"
                    className={
                      "btn btn-link ml-3 text-secondary"
                    }
                    name='manageInquiries'
                    onClick={() => handleTabMode('manageInquiries')}
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
                <li>
                  <button
                    id="ImportInquiries"
                    className={
                      "btn btn-link ml-3 text-secondary"
                    }
                    name='importInquiries'
                    onClick={() => handleTabMode('importInquiries')}
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
              </ul>
            }
          </li>
          <li>
            <button
              id="Proposals"
              className="btn btn-link text-secondary"
              name="proposals"
              value={!drawerMode.proposals}
              onClick={(e) => handleDrawerMode(e)}
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
            {drawerMode.proposals &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="CreateProposal"
                    name='createProposal'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('createProposal')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Create {Trans("_quotationReplaceKey")}
                  </button>
                </li>
                <li>
                  <button
                    id="ManageProposal"
                    name='manageProposal'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('manageProposal')}
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
                <li>
                  <button
                    id="ImportProposals"
                    name='importProposals'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('importProposals')}
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
              </ul>
            }
          </li>
          <li>
            <button
              id="Itineraries"
              className="btn btn-link text-secondary"
              name="itineraries"
              value={!drawerMode.itineraries}
              onClick={(e) => handleDrawerMode(e)}
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
            {drawerMode.itineraries &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="CreateItinerary"
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('createItinerary')}
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
                <li>
                  <button
                    id="ManageItineraries"
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('manageItineraries')}
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

                <li>
                  <button
                    id="ImportItinerary"
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('importItinerary')}
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
              </ul>
            }
          </li>
          <li>
            <button
              id="Invoices"
              className="btn btn-link text-secondary"
              name="invoices"
              onClick={() => handleTabMode('invoices')}
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
          <li>
            <button
              id="AgencySettings"
              className="btn btn-link text-secondary"
              name="agencySettings"
              value={!drawerMode.agencySettings}
              onClick={(e) => handleDrawerMode(e)}
            >
              <figure>
                <img
                  style={{ filter: "none" }}
                  src={ManageAgencyIconnew}
                  alt=""
                />
              </figure>
              Administration
            </button>
            {drawerMode.agencySettings &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="Profile"
                    name='profile'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('profile')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    id="Employees"
                    name='employees'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('employees')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={ManageEmployee}
                        alt=""
                      />
                    </figure>
                    Employees
                  </button>
                </li>
                <li>
                  <button
                    id="AgencyConfiguration"
                    name='agencyConfiguration'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('agencyConfiguration')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Agency Configuration
                  </button>
                </li>
                <li>
                  <button
                    id="TaxConfiguration"
                    name='taxConfiguration'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('taxConfiguration')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Tax Configuration
                  </button>
                </li>
                <li>
                  <button
                    id="ContentLibrary"
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('contentLibrary')}
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
                <li>
                  <button
                    id="BillingandSubscription"
                    name='billingSubscription'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('billingSubscription')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Billing and Subscription
                  </button>
                </li>
                <li>
                  <button
                    id="PaymentHistory"
                    name='paymentHistory'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('paymentHistory')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Payment History
                  </button>
                </li>
              </ul>
            }
          </li>
          <li>
            <button
              id="ManageWebsite"
              className="btn btn-link text-secondary"
              name="manageWebsite"
              value={!drawerMode.manageWebsite}
              onClick={(e) => handleDrawerMode(e)}
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
            {drawerMode.manageWebsite &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="claim-your-website"
                    name='claimWebsite'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('claimWebsite')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Claim Your Website
                  </button>
                </li>
                <li>
                  <button
                    id="select-theme"
                    name='selectTheme'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('selectTheme')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={ManageEmployee}
                        alt=""
                      />
                    </figure>
                    Select Template / Theme
                  </button>
                </li>
                <li>
                  <button
                    id="manage-content"
                    name='manageContent'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('manageContent')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Manage Content
                  </button>
                </li>
              </ul>
            }
          </li>
          {/* <li>
            <button
              id="accountSettings"
              className="btn btn-link text-secondary"
              name="accountSettings"
              value={!drawerMode.accountSettings}
              onClick={(e) => handleDrawerMode(e)}
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
            {drawerMode.accountSettings &&
              <ul className="list-unstyled p-0 m-0 sub-menu">
                <li>
                  <button
                    id="BillingandSubscription"
                    name='billingSubscription'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('billingSubscription')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Billing and Subscription
                  </button>
                </li>
                <li>
                  <button
                    id="PaymentHistory"
                    name='paymentHistory'
                    className="btn btn-link text-secondary ml-3"
                    onClick={() => handleTabMode('paymentHistory')}
                  >
                    <figure>
                      <img
                        style={{ filter: "none" }}
                        src={CompanyProf}
                        alt=""
                      />
                    </figure>
                    Payment History
                  </button>
                </li>
              </ul>
            }
          </li> */}
        </ul>
      </div>
    </>
  )
}

export default TourwizHelpNav;