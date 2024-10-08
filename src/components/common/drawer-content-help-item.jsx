import React from 'react';
import Welcome from './drawer-help-section/welcome';
import Register from './drawer-help-section/register';
import Login from './drawer-help-section/login';
import BillingAndSubscription from './drawer-help-section/billing-subscription';
import PaymentHistory from './drawer-help-section/payment-history';
import Profile from './drawer-help-section/profile';
import AgencyConfiguration from './drawer-help-section/agencyConfig';
import EmployeesForm from './drawer-help-section/employeeForm.jsx';
import TaxConfiguration from './drawer-help-section/taxConfiguration';
import CreateInquiries from './drawer-help-section/createInquiry';
import ImportInquiries from './drawer-help-section/importInquiry';
import ManageInquiries from './drawer-help-section/manageInquiries';
import CreateItineraries from './drawer-help-section/createItinerary';
import ManageItineraries from './drawer-help-section/manageItinerary';
import ContentLibrary from './drawer-help-section/contentLibrary';
import ImportItineraries from './drawer-help-section/importItinerary';
import CreateProposals from './drawer-help-section/createProposals';
import ManageProposals from './drawer-help-section/manageProposals';
import ImportProposals from './drawer-help-section/importProposals';
import Invoices from './drawer-help-section/invoices';
import ClaimYourWebsite from './drawer-help-section/claimWebsite';
import SelectTemplate from './drawer-help-section/select-template';
import ManageContent from './drawer-help-section/manage-content';
function TourwizHelpSection(props) {
  const { tab } = props;
  const css = `
.tw-addon-services{
 background: none !important;
padding: 0px 0px !important;
}
`
  return (
    <>
      <style>{css}</style>
      {tab === "welcome" &&
        <Welcome />
      }
      {tab === "register" &&
        <Register />
      }
      {tab === "login" &&
        <Login />
      }
      {
        tab === "profile" &&
        <Profile />
      }
      {
        tab === "employees" &&
        <EmployeesForm />
      }
      {
        tab === "agencyConfiguration" &&
        <AgencyConfiguration />
      }
      {
        tab === "taxConfiguration" &&
        <TaxConfiguration />
      }
      {
        tab === "billingSubscription" &&
        <BillingAndSubscription />
      }
      {
        tab === "paymentHistory" &&
        <PaymentHistory />
      }
      {
        tab === "createInquiries" &&
        <CreateInquiries />
      }
      {
        tab === "manageInquiries" &&
        <ManageInquiries />
      }
      {
        tab === "importInquiries" &&
        <ImportInquiries />
      }
      {
        tab === "createItinerary" &&
        <CreateItineraries />
      }
      {
        tab === "manageItineraries" &&
        <ManageItineraries />
      }
      {
        tab === "contentLibrary" &&
        <ContentLibrary />
      }
      {
        tab === "importItinerary" &&
        <ImportItineraries />
      }
      {
        tab === "createProposal" &&
        <CreateProposals />
      }
      {
        tab === "manageProposal" &&
        <ManageProposals />
      }
      {
        tab === "importProposals" &&
        <ImportProposals />
      }
      {
        tab === "invoices" &&
        <Invoices />
      }
      {
        tab === "claimWebsite" &&
        <ClaimYourWebsite />
      }
      {
        tab === "selectTheme" &&
        <SelectTemplate />
      }
      {
        tab === "manageContent" &&
        <ManageContent />
      }
    </>
  )
}

export default TourwizHelpSection