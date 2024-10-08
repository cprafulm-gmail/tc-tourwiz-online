import React, { Component } from "react";
import { hinge } from "react-animations";
import FeaturesItineraryBuilder from "../../assets/images/tw/002.png";
import FeaturesAccountingReconciliation from "../../assets/images/tw/features-accounting-reconciliation.png";
import FeaturesAgencyManagement from "../../assets/images/tw/features-agency-management.png";
import FeaturesReportsAnalytics from "../../assets/images/tw/features-reports-analytics.png";
import FeaturesTravelCrm from "../../assets/images/tw/features-travel-crm.png";

class HomePageFeatures extends Component {
  state = {
    activeTab: "itinerary-builder",
    showMore: false,
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <div className="tw-features">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-lg-6 tw-features-icons">
              <div className="row">
                <div className="col-lg-12 align-items-center d-flex">
                  <div className="w-100">
                    <div>
                      <img
                        src={FeaturesItineraryBuilder}
                        alt="TourWiz - Travel CRM icon"
                        style={{ width: "95%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 tw-features-content">
              <div className="tw-features-details mt-0">
                <React.Fragment>
                  {this.props.mode !== "marketplace" &&
                    this.props.mode !== "travelagents" &&
                    this.props.mode !== "touroprator" &&
                    <h2 class="tw-sub-title">What’s the TourWiz <br /> Partner Program ?</h2>}
                  {this.props.mode === "marketplace" && <h2 class="tw-sub-title">What’s the TourWiz <br /> B2B Marketplace ?</h2>}
                  {this.props.mode === "travelagents" && <h2 class="tw-sub-title">What’s the TourWiz <br />for Travel Agents ?</h2>}
                  {this.props.mode === "touroprator" && <h2 class="tw-sub-title">What’s the TourWiz <br />for Tour Operators ?</h2>}
                  {this.props.mode !== "marketplace" &&
                    this.props.mode !== "travelagents" &&
                    this.props.mode !== "touroprator" &&
                    <p><h5 className="tw-partner-sidebar" style={this.state.showMore ? { height: "81%" } : { height: "66%" }}><span>&nbsp;</span></h5>
                      <p className="ml-0">TourWiz provides a unique B2B SaaS platform where you can promote your deals on flights, hotels, activities, transfers, package and other services to attract thousands of travel professionals registered on our platform.</p>
                      {this.state.showMore && (<><p className="ml-0">TourWiz gives you full control over your promotions, how they appear on the platform and whom you want to show them to. The agents registered on our platform will connect directly with you for bookings. </p>
                        <p className="ml-0">Our goal is to connect demand with supply and help travel businesses maximize their revenue potential.</p>
                        <p className="ml-0">It’s the most cost-effective way to promote your offerings to a global audience and get more business.</p>
                      </>)}
                    </p>
                  }
                  {this.props.mode === "marketplace" &&
                    <p><h5 className="tw-partner-sidebar" style={this.state.showMore ? { height: "81%" } : { height: "66%" }}><span>&nbsp;</span></h5>
                      <p className="ml-0">TourWiz, a leading B2B travel marketplace that
                        offers a wide range of travel products and services to travel agents,
                        tour operators, and travel companies or “buyers”.</p>
                      {this.state.showMore && (<><p className="ml-0">TourWiz provides buyers direct access to a vast network of “sellers”,
                        including but not limited to hotels, activities, transfers, and packages,
                        allowing travel agents to easily find and book the best products for their clients.</p>
                        <p className="ml-0">Our unique model connects small and medium-sized travel companies with global content providers,
                          on a one-to-one basis.</p>
                        <p className="ml-0">By cutting out the middleman, TourWiz is revolutionizing the way travel businesses
                          (buyers and sellers) can compete with the OTA’s  and reach their full revenue potential.</p>
                      </>)}
                    </p>
                  }
                  {this.props.mode === "travelagents" &&
                    <p><h5 className="tw-partner-sidebar" style={this.state.showMore ? { height: "81%" } : { height: "66%" }}><span>&nbsp;</span></h5>
                      <p className="ml-0">Everything on a single cloud-based platform to help you automate sales and easily manage your business from anywhere, on any device. <br />Sell your travel products online via multiple channels, efficiently manage your operations with our extensive back-office automation module and track your agency's performance through in-depth business reports.</p>
                      {/* {this.state.showMore && (<><p className="ml-0">Sell your travel products online via multiple channels, efficiently manage your operations with our extensive back-office automation module and track your agency's performance through in-depth business reports.</p>
                      </>)} */}
                    </p>
                  }
                  {this.props.mode === "touroprator" &&
                    <p><h5 className="tw-partner-sidebar" style={this.state.showMore ? { height: "81%" } : { height: "52%" }}><span>&nbsp;</span></h5>
                      <p className="ml-0">Allows you to manage all your inventory, invoices. It allows you to design tour packages, apply business rules and sell them to your customers online.
                        get the advantages of SaaS but at the same time allows them full control over data and reporting.</p>
                      {/* {this.state.showMore && (<><p className="ml-0">TourWiz gives you full control over your promotions, how they appear on the platform and whom you want to show them to. The agents registered on our platform will connect directly with you for bookings. </p>
                        <p className="ml-0">Our goal is to connect demand with supply and help travel businesses maximize their revenue potential.</p>
                        <p className="ml-0">It’s the most cost-effective way to promote your offerings to a global audience and get more business.</p>
                      </>)} */}
                    </p>
                  }
                </React.Fragment>
                {this.props.mode !== "touroprator" && this.props.mode !== "travelagents" && <button
                  className="btn btn-lg mt-3"
                  onClick={() => this.setState(prevState => ({
                    showMore: !prevState.showMore
                  }))}
                >
                  {this.state.showMore ? "Read Less" : "Read More"}
                </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageFeatures;
