import React, { Component } from "react";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import TravelCarmaLogo from "../../assets/images/tw/travelcarma-logo.png";
import MonarchLogo from "../../assets/images/tw/monarch-logo.png";
import WeServeIcon1 from "../../assets/images/tw/we-serve-icon1.svg";
import WeServeIcon2 from "../../assets/images/tw/we-serve-icon2.svg";
import WeServeIcon3 from "../../assets/images/tw/we-serve-icon3.svg";
import WeServeIcon4 from "../../assets/images/tw/we-serve-icon4.svg";
import HowTourWizBorn from "../../assets/images/tw/how-tourwiz-born.svg";
import TeamPhoto1 from "../../assets/images/tw/team-photo-1-swapnil-saha.png";
import TeamPhoto2 from "../../assets/images/tw/team-photo-2-ashok-mistry.png";
import TeamPhoto3 from "../../assets/images/tw/team-photo-3-amit-kadiya.png";
import TeamPhoto4 from "../../assets/images/tw/team-photo-4-chintan-goswami.png";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";
import { Trans } from "../../helpers/translate";

class About extends Component {
  state = {};

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;

    return (
      <div className="tw-public-pages tw-about-page">
        <style>{css}</style>

        <Helmet>
          <title>Tourwiz About Us | B2B Travel Booking System | Best Software For Online Travel Agency</title>
          <meta
            name="description"
            content="Get the smart B2B Travel Booking System today! Manage Everything in One Place. Best Software For Online Travel Agency. Trusted by 26k+ successful travel agents."
          />
        </Helmet>
        <StickyContainer>

          <Sticky>
            {({ style }) => (<div
              className={
                "hight-z-index mod-search-area"
              }
              style={{ ...style, transform: "inherit" }}
            >
              <PublicPageHeader />
            </div>
            )}
          </Sticky>

          <div className="tw-common-banner mb-0">
            <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h1>About Us</h1>
                  <h2>
                    TourWiz provides travel professionals all the digital tools
                    and content they need to work more efficiently, deliver a
                    superior customer experience and grow their business in the
                    post-pandemic world
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-about-page-info d-none">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h2>Who are we</h2>
                  {/* <h3>
                  TourWiz is a joint venture by <b>TravelCarma</b>, one of the
                  world’s top travel technology brands and{" "}
                  <b>Monarch Networth Capital</b>, a leading financial services
                  company in India.
                </h3> */}
                  <h3>
                    Our Leadership
                  </h3>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  {/* <img src={TravelCarmaLogo} alt="TravelCarma" /> */}
                  <p style={{ textAlign: "justify" }}>Mr.Saurabh Mehta, our Co-Founder, a Technology strategist and entrepreneurial innovator skilled at
                    building world class products using cutting edge technologies and managing international projects
                    and relationships. He has post graduate degree in engineering from the United States and over 28
                    years’ experience in Planning, Designing and Implementing Information Systems for a variety of
                    businesses all around the world. His experience spans projects in a number of countries in the
                    EU, Asia, Caribbean, North America, ANZ and Latin America. He is also the Chief Technology Architect
                    and mentor to <a href="https://www.travelcarma.com" target="_blank">TravelCarma.com</a>, investor at Dxchange and Founder Director at Avani Cimcon Technologies
                    Ltd one of the first true offshore companies to offer turnkey product development services to their
                    global customers right from 1994.
                  </p>
                </div>
                <div className="col-lg-6 d-none">
                  {/* <img src={MonarchLogo} alt="Monarch" /> */}
                  <p style={{ textAlign: "justify" }}>
                    Mr. Swapnil Shaha, our Co-Founder and CEO is an accomplished management professional with 26 years of career progression in Global Sales, Business Development, Technology Developments, operations and process automations. He has more than 16 years of rich experience in the Travel & Tourism industry across Geographies and businesses. He has strong industry domain knowledge with excellent understanding of technology in order to respond to the New-Age-Consumer. He has held critical roles in Retail and Distribution, Corporate & Online Travel with some of India’s largest travel companies. He has an entrepreneurial mindset with astute Financial and Analytical capability meshed with a keen appreciation of customer and employee expectations and aspirations. A focused sales leader who inspires the team with his pragmatic approach with a proven history of building, guiding and retaining high-performance teams that develop and implement strategies for accelerated growth.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <h4>
                    He has more than 16 years of rich experience in the Travel & Tourism industry across Geographies and businesses. He has strong industry domain knowledge with excellent understanding of technology in order to respond to the New-Age-Consumer.
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-about-page-weserve mt-0">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h2>Who we serve</h2>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 text-center">
                  <img src={WeServeIcon1} alt="Leisure Travel Agencies" />
                  <h4>Leisure Travel Agencies</h4>
                </div>
                <div className="col-lg-3 text-center">
                  <img src={WeServeIcon2} alt="Home-based Agents" />
                  <h4>Home-based Agents</h4>
                </div>
                <div className="col-lg-3 text-center">
                  <img src={WeServeIcon3} alt="Outbound Tour Operators" />
                  <h4>Outbound Tour Operators</h4>
                </div>
                <div className="col-lg-3 text-center">
                  <img src={WeServeIcon4} alt="DMCs/Inbound Tour Operators" />
                  <h4>DMCs/Inbound Tour Operators</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-about-page-born">
            <div className="container">
              <div className="row">
                <div className="col-lg-7">
                  <h2>How TourWiz was born</h2>
                  <h3>We saw a huge problem</h3>
                  <p>
                    Over the years, we observed that travel agents and tour
                    operators use multiple tools and spreadsheets to manage their
                    day-to-day operations and sales.
                  </p>
                  <p>
                    This is not only time-consuming and leads to costly errors,
                    but also hampers their sales and growth potential.
                  </p>
                </div>
                <div className="col-lg-5 text-center">
                  <img src={HowTourWizBorn} alt="How TourWiz was born" />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <h4>
                    We analyzed the solutions out there, and found that there’s no
                    single application which:
                  </h4>
                  <ul className="list-unstyled row">
                    <li className="col-lg-6">
                      Has everything they want in one place
                    </li>
                    <li className="col-lg-6">
                      Is aligned with their actual workflows
                    </li>
                    <li className="col-lg-6">
                      Works with both offline and online bookings
                    </li>
                    <li className="col-lg-6">Is easy-to-use</li>
                    <li className="col-lg-6">
                      Works seamlessly on both desktop and mobile
                    </li>
                    <li className="col-lg-6">Is easy on the pocket</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className="tw-about-page-solution"
            style={{ marginBottom: "-42px" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h2>So we built a solution</h2>
                  <h3>
                    We interviewed hundreds of travel professionals and worked
                    tirelessly to design an end-to-end solution to match their
                    needs and make their life a whole lot easier.
                  </h3>
                  <h3>
                    <b>
                      With TourWiz we have covered the entire business workflow:
                    </b>
                  </h3>

                  <div className="tw-about-page-solution-info">
                    <div className="row">
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Add customer
                        </div>
                      </div>
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Capture inquiry
                        </div>
                      </div>
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Create an itinerary/{Trans("_quotationReplaceKey")}
                        </div>
                      </div>
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Generate invoice
                        </div>
                      </div>
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Confirm booking & issue booking voucher
                        </div>
                      </div>
                      <div className="col-lg-2 p-0">
                        <div className="tw-about-page-solution-blt">
                          Get reconciliation & business reports
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4>
                    With TourWiz, travel professionals can automate several
                    time-consuming aspects of their business and have all their
                    critical business data at their fingertips, leaving them with
                    more time to craft and sell great experiences to clients.
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-about-page-team d-none">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h2>Meet the Management Team</h2>
                  <h3>
                    TourWiz was founded by a team with extensive experience in
                    travel and technology, having worked with travel businesses of
                    all shapes and sizes.
                  </h3>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 col-md-6 text-center">
                  <div className="tw-about-page-team-photo">
                    <img src={TeamPhoto1} alt="Team Photo 1" />
                    <div>
                      <h4>Swapnil Shaha</h4>
                      {/* <h5>Manager</h5> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                  <div className="tw-about-page-team-photo">
                    <img src={TeamPhoto2} alt="Team Photo 2" />
                    <div>
                      <h4>Ashok Mistry</h4>
                      {/* <h5>Manager</h5> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                  <div className="tw-about-page-team-photo">
                    <img src={TeamPhoto3} alt="Team Photo 3" />
                    <div>
                      <h4>Amit Kadiya</h4>
                      {/* <h5>Manager</h5> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 text-center">
                  <div className="tw-about-page-team-photo">
                    <img src={TeamPhoto4} alt="Team Photo 4" />
                    <div>
                      <h4>Chintan Goswami</h4>
                      {/* <h5>Manager</h5> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PublicPageFindus />
          <PublicPageWherewe />
          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />
        </StickyContainer>
      </div>
    );
  }
}

export default About;
