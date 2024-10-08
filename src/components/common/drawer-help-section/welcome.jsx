import React from 'react'
import { Link } from "react-router-dom";
import bulletian from '../../../assets/images/caret-right-fill.svg';
import closeIcon from "../../../assets/images/x.svg";
import { useState } from 'react';
function Welcome() {
  const [announcement, setAnnouncment] = useState(true);
  const handleClose = () => {
    setAnnouncment(false);
  }
  return (
    <>
      {announcement ?
        <div className='row help-content-item'>
          <div className='col-lg-12'>
            <div className='row'>
              <div className='col-lg-12'>
                <div class="px-2 rounded-3" >
                  {/* <blockquote>
                  <h4 id="tourwiz-menu-changes">📢 <strong className="text-primary">Important Menu Re-arrangement Announcement</strong></h4>
                </blockquote> */}
                  <div className='announcement mt-0'>
                    <h5 className='d-flex justify-content-between mb-3'>
                      <strong className="text-secondary">📢 Important Menu Re-arrangement Announcement</strong>
                      <button className='btn btn-circle'
                        onClick={handleClose}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Close"
                      >
                        <img
                          style={{ filter: "none", width: "28px" }}
                          src={closeIcon}
                          alt=""
                        />
                      </button>
                    </h5>
                    <p>We are excited to inform you about the recent changes in the menu structure of TourWiz. This update aims to enhance usability and streamline your workflow. Please take note of the following modifications</p>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Inquiries</strong>
                    </p>
                    <ul>
                      <li>Inquiries &gt; Create Inquiry</li>
                      <li>Inquiries &gt; Manage Inquiries</li>
                      <li>Inquiries &gt; Import Inquiries</li>
                    </ul>
                    <ul>
                      <li>Now when user clicks on Inquiries menu, system will open Inquiry list (Manage Inquiries) page.</li>
                      <li>In the Manage Inquiries page header now user will have Create Inquiry and Import Inquiries options.</li>
                    </ul>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Itineraries</strong>
                    </p>
                    <ul>
                      <li>Itineraries &gt; Create Master Itinerary</li>
                      <li>Itineraries &gt; Manage Master Itineraries</li>
                      <li>Itineraries &gt; Create Itinerary</li>
                      <li>Itineraries &gt; Manage Itineraries</li>
                      <li>Itineraries &gt; Import Itineraries</li>
                    </ul>
                    <ul>
                      <li>Now when user clicks on Itineraries menu, system will open Itineraries list (Manage Itineraries) page.</li>
                      <li>In the Manage Itineraries page header now user will have Create Itinerary and Import Itineraries options.</li>
                      <li>The Manage Master Itineraries option has been moved under the <strong className="text-primary">Administration</strong> menu.</li>
                      <li>In the Manage Master Itinerary page header now user will have Create Master Itinerary option.</li>
                    </ul>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Proposals</strong>
                    </p>
                    <ul>
                      <li>Proposals &gt; Create Master Proposal</li>
                      <li>Proposals &gt; Manage Master Proposals</li>
                      <li>Proposals &gt; Create Proposal</li>
                      <li>Proposals &gt; Manage Proposals</li>
                      <li>Proposals &gt; Import Proposals</li>
                    </ul>
                    <ul>
                      <li>Now when user clicks on Proposals menu, system will open Proposals list (Manage Proposals) page.</li>
                      <li>In the Manage Proposals page header now user will have Create Proposal and Import Proposals options.</li>
                      <li>The Manage Master Proposals option has been moved under the <strong className="text-primary">Administration</strong> menu.</li>
                      <li>In the Manage Master Proposal page header now user will have Create Master Proposal option.</li>
                    </ul>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Customized Packages</strong>
                    </p>
                    <ul>
                      <li>Customized Packages &gt; Create Master Package</li>
                      <li>Customized Packages &gt; Manage Master Packages</li>
                      <li>Customized Packages &gt; Create Package</li>
                      <li>Customized Packages &gt; Manage Packages</li>
                    </ul>
                    <ul>
                      <li>Now when user clicks on Packages menu, system will open Packages list (Manage Packages) page.</li>
                      <li>In the Manage Packages page header now user will have Create Package option.</li>
                      <li>The Manage Master Packages option has been moved under the <strong className="text-primary">Administration</strong> menu.</li>
                      <li>In the Manage Master Package page header now user will have Create Master Package option.</li>
                    </ul>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Invoices</strong>
                    </p>
                    <ul>
                      <li>Invoices &gt; Create Invoice</li>
                      <li>Invoices &gt; Create Voucher</li>
                      <li>Invoices &gt; Manage Invoices/Vouchers</li>
                    </ul>
                    <ul>
                      <li>Now when user clicks on Invoices menu, system will open Invoices list (Manage Invoices) page.</li>
                      <li>In the Manage Invoices page header now user will have Create Invoices and Create Voucher options.</li>
                    </ul>
                    <p>
                      <img
                        src={bulletian}
                        className='mr-1'
                        alt=""
                        width="18"
                        height="18"
                      />
                      <strong className="text-secondary">Administration</strong>
                    </p>
                    <ul>
                      <li>The former <strong className="text-primary">Agency Settings</strong> has been renamed to <strong className="text-primary">Administration.</strong></li>
                      <li>Within the <strong className="text-primary">Administration</strong> section, you can manage master itineraries, master proposals, and master packages.</li>
                    </ul>
                    <p>These changes are designed to provide a more organized and user-friendly experience within TourWiz. We believe these updates will optimize your efficiency and enable you to navigate through the application seamlessly. If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
                    <p>Thank you for your continued support and feedback as we strive to improve your TourWiz experience!</p>
                    <p>Best regards,
                      <br />
                      <strong className='text-primary'> The TourWiz Team</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : <div className='row help-content-item'>
          <div className='col-lg-12'>
            <div className='row'>
              <div className='col-lg-12'>
                <div class="px-2 rounded-3" >
                  <blockquote>
                    <h4 id="getting-started-with-tourwiz">Getting Started with TourWiz</h4>
                  </blockquote>
                  <p>TourWiz is an all-in-one solution tool that manages your travel business by replacing spreadsheets and simplifying workflow.</p>
                  <p>Packed full of helpful features, it is also user-friendly, transparent &amp; affordable.</p>
                  <p>With TourWiz, travel professionals can automate several time-consuming aspects of their business and have all their critical business data at their fingertips, leaving them with more time to craft and sell great experiences to clients.</p>
                  <p>TourWiz provides travel professionals all the digital tools and content they need to work more efficiently, deliver a superior customer experience and grow their business in the post-pandemic world.</p>
                  {/* <hr class="my-4" /> */}
                  <p>TourWiz comes with a wide range of functionalities to help you run your business more efficiently and increase your sales.</p>
                  <div className="tw-addon-services">
                    <div className="container">
                      <div className="col-lg-12">
                        <ul className="list-unstyled row">
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/b2b-Marketplace">B2B Marketplace</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/tourWizAI-Lite">TourWizAI Lite BETA</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/package-module">Package Module</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/invoicing-module">Invoicing Module</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/customer-portal">Travel Website</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/accounting-reconciliation">Accounting & Reconciliation</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/travel-crm">Travel CRM</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/itinerary-builder">Itinerary Builder</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/reports-analytics">Reports & Analytics</Link></li>
                          <li className="col-lg-6"><Link className='text-dark' target='_blank' to="/features/agency-management">Agency Management</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Welcome