import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";

import CreateQuotations from "../assets/images/dashboard/content-management.png";
import ManageQuotations from "../assets/images/dashboard/reports.png";
import CreateItineraies from "../assets/images/dashboard/portal-policies.png";
import ManageItineraies from "../assets/images/dashboard/reports.png";
import ManageBooking from "../assets/images/dashboard/manage-booking.png";
import ManageCustomer from "../assets/images/dashboard/manage-customer.png";

import * as Global from "../helpers/global";
import CallCenter from "../components/call-center/call-center";
import { Trans } from "../helpers/translate";

class DashboardTourwiz extends Component {
  state = { quotationMode: true };

  handleRedirect = (req, redirect) => {
    let redirectUrl =
      redirect === "back-office"
        ? "http://backoffice.travelcarma.com" + req
        : "http://tcreports.travelcarma.com";

    !redirect
      ? this.props.history.push(`${req}`)
      : window.open(redirectUrl, "_blank");
  };

  componentDidMount = () => { };

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsQuotation = Global.getEnvironmetKeyValue("IsQuotation", "cobrand");
    const role = localStorage.getItem("afUserType");

    return (
      <div className="dashboard">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30 d-inline">
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {Trans("_dashboard")}
            </h1>
            {isPersonateEnabled && (
              <div className="pull-right d-none" style={{ marginTop: "-2px" }}>
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
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") &&
              IsQuotation && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Inquiry")}>
                    Create Inquiry
                  </h3>
                  <figure>
                    <img src={CreateQuotations} alt="" />
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
                  <h3 onClick={() => this.handleRedirect("/InquiryList")}>
                    Manage Inquiries
                  </h3>
                  <figure>
                    <img src={ManageQuotations} alt="" />
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
                    <img src={CreateItineraies} alt="" />
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
                    <img src={ManageItineraies} alt="" />
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
                    <img src={CreateQuotations} alt="" />
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
                    <img src={ManageQuotations} alt="" />
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
              role === "B2BPortalAdmin" ||
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Bookings")}>
                    {Trans("_manageBookings")}
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
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Backoffice/Home")}>
                    {Trans("Backoffice")}{" "}
                    <sup style={{ fontSize: "0.8rem" }}>Beta</sup>
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
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Reports")}>
                    {Trans("Reports")}{" "}
                    <sup style={{ fontSize: "0.8rem" }}>Beta</sup>
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
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3 onClick={() => this.handleRedirect("/Dashboard-Agent")}>
                    {Trans("Dashboard")}{" "}
                    <sup style={{ fontSize: "0.8rem" }}>Beta</sup>
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
              role === "B2CPortalAdmin" ||
              role === "CompanyPortalAdminEmployee" ||
              role === "B2CPortalAdminEmployee") && (
                <div>
                  <h3>
                    {Trans("Quick Book")}{" "}
                    <sup style={{ fontSize: "0.8rem" }}>Coming Soon</sup>
                  </h3>
                  <figure>
                    <img src={ManageBooking} alt="" />
                  </figure>
                </div>
              )}
          </div>
        </div>

        <div
          className="mt-5 bg-light pt-4 pb-2"
          style={{ marginBottom: "-24px" }}
        >
          <div className="container text-center">
            <h6 className="text-primary font-weight-bold">
              Note: As this is a pre-release beta version aimed at obtaining
              user feedback, it has certain limitations.
            </h6>
            <b className="mb-2 d-block">
              This means that in this version you will not be able to:
            </b>
            <ul className="list-unstyled">
              <li className="mb-2">Create your own account</li>
              <li className="mb-2">
                Upload your own logo for the sample itinerary/quotation emails
              </li>
              <li className="mb-2">Book the quotations or itineraries</li>
              <li className="mb-2">Change the default currency(USD)</li>
              <li className="mb-2">
                Manage bookings (Current data in the manage bookings section is
                for demo purposes only)
              </li>
            </ul>
            <b className="d-block mb-3">
              All these features and many more will be available in the public
              release version to be launched soon
            </b>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardTourwiz;
