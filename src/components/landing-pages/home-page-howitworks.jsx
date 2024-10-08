import React, { Component } from "react";
import HowitworksMobile from "../../assets/images/tw/howitworks-mobile.gif";
import BulletPlus from "../../assets/images/tw/bullet-plus.png";
import BulletMinus from "../../assets/images/tw/bullet-minus.png";
import { Trans } from "../../helpers/translate";

class HomePageHowitworks extends Component {
  state = {
    activeTab: "tab-1",
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <div className="tw-howitworks">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>See How it Works</h2>
              <h4>
                Say goodbye to spreadsheets and manage your business with ease
              </h4>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-5">
              <img
                className="tw-howitworks-info-img"
                src={HowitworksMobile}
                alt="See How it Works"
              />
            </div>
            <div className="col-lg-7">
              <div className="tw-howitworks-info">
                <div>
                  <h3 onClick={() => this.handleTabChange("tab-1")}>
                    {activeTab === "tab-1" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Never Lose an Inquiry
                  </h3>
                  {activeTab === "tab-1" && (
                    <ul>
                      <li>
                        Capture and manage all your inquiries in one place
                      </li>
                      <li>
                        Store details like service type (flight/hotel/package
                        etc), source(phone/email/whatsapp etc), trip type
                        (domestic/international), duration, budget and special
                        requirements
                      </li>
                      <li>
                        You can also import your past inquiries for centralized
                        tracking
                      </li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-2")}>
                    {activeTab === "tab-2" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Build Impressive Itineraries & {Trans("_quotationReplaceKeys")}
                  </h3>

                  {activeTab === "tab-2" && (
                    <ul>
                      <li>
                        Create an itinerary or quotation based on inquiry in a
                        few clicks
                      </li>
                      <li>
                        Use our in-built database to look up and add flights,
                        accommodation, activities, transportation etc (with your
                        own rates), or add your own content
                      </li>
                      <li>
                        Based on what you add, TourWiz automatically generates a
                        beautiful itinerary with photos, details and your
                        branding
                      </li>
                      <li>Share via email, web link or PDF</li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-3")}>
                    {activeTab === "tab-3" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Elevate your Customer Experience
                  </h3>

                  {activeTab === "tab-3" && (
                    <ul>
                      <li>
                        Our Travel CRM simplifies customer management and helps
                        you deliver a superior experience to your clients
                      </li>
                      <li>
                        Set up all your leads & customers with their personal
                        details, contact details, passport info, credit limit
                        etc, or import your existing data
                      </li>
                      <li>
                        Use this data to create personalized proposals and
                        emails
                      </li>
                      <li>
                        Track customer-wise inquiries, itineraries, quotations,
                        invoices and bookings
                      </li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-4")}>
                    {activeTab === "tab-4" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Automate your Accounting
                  </h3>

                  {activeTab === "tab-4" && (
                    <ul>
                      <li>
                        TourWiz automates your accounting and makes it super
                        easy to track your finances
                      </li>
                      <li>
                        Create proposals and generate invoices from the system
                      </li>
                      <li>
                        Make bookings against those invoices offline or in a
                        third-party system
                      </li>
                      <li>
                        Record the payments and receipts for those bookings in
                        TourWiz and get error-free accounting and reconciliation
                        reports
                      </li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-5")}>
                    {activeTab === "tab-5" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Always Stay on Top of Your Business
                  </h3>

                  {activeTab === "tab-5" && (
                    <ul>
                      <li>
                        TourWiz automatically generates reports based on your
                        usage
                      </li>
                      <li>
                        Every time you log in you get a dashboard which shows
                        the latest inquiries, itineraries, quotations and
                        bookings to give you a bird’s-eye-view
                      </li>
                      <li>
                        You can also get in-depth reports to accurately track
                        inquiries, bookings, sales, collections, supplier
                        payments and much more..
                      </li>
                      <li>
                        All reports include advanced filters to help you quickly
                        find what you want
                      </li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-6")}>
                    {activeTab === "tab-6" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Impress your clients with stunning packages!
                  </h3>

                  {activeTab === "tab-6" && (
                    <ul>
                      <li>All your Packages are stored in one place</li>
                      <li>Build detailed packages in one place that can be retrieved in just a click.</li>
                      <li>Easily send packages via a mobile-friendly link to your customers</li>
                    </ul>
                  )}
                </div>

                <div>
                  <h3 onClick={() => this.handleTabChange("tab-7")}>
                    {activeTab === "tab-7" ? (
                      <img src={BulletMinus} />
                    ) : (
                      <img src={BulletPlus} />
                    )}
                    Never lose on payments with our GST-ready invoices!
                  </h3>

                  {activeTab === "tab-7" && (
                    <ul>
                      <li>Never lose on payments!</li>
                      <li>Create & Manage invoices in one place</li>
                      <li>Get GST-ready invoices in a simple way</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="d-none row tw-howitworks-info-img-mobile">
            <div className="col-lg-12">
              <img
                src={HowitworksMobile}
                alt="How TourWiz works - Itinerary Builder, Travel CRM, Travel Accounting"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageHowitworks;
