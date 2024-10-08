import React from "react";
import UPSCheck from "../../assets/images/tw/USP-right.svg";
import UPSUnCheck from "../../assets/images/tw/USP-wrong.svg";
import BulletPlus from "../../assets/images/tw/bullet-plus.png";
import BulletMinus from "../../assets/images/tw/bullet-minus.png";

const HomePageUPS = (props) => {
  return (

    <div className="tw-USP-details">
      <div className="container">
        <div class="row">
          <div class="col-lg-12">
            <h2>Why Choose TourWiz</h2>
          </div>
        </div>
        <div className="tw-USP-container">
          <div className="">

            <ul className="tw-USP-ul list-unstyled">
              <li className="row tw-plan-inclusion-mobile-title">
                <span className="col-8"></span>
                <span className="col-2 p-0 text-center"></span>
                <span className="col-2 p-0 text-center">Other Solutions</span>
              </li>
              <li className="row">
                <span className="col-8">100% cloud-based solution (no installation required)</span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSCheck} alt="" />
                </span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSUnCheck} alt="" />
                </span>
              </li>
              {props.isShowMoreUSP && (
                <React.Fragment>
                  <li className="row">
                    <span className="col-8">Built-in search engine with global flight & hotel content</span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">Capturing & tracking of inquiries from multiple sources</span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">Creation of quotations & itineraries from inquiries</span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">
                      Follow-up alerts for inquiries, quotations & invoices
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">Communicate with clients & suppliers through all modules </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">Recording of offline bookings for accounting & reports</span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                </React.Fragment>
              )}
              <li className="row">
                <span className="col-8">Auto-invoice generation and tracking for payments</span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSCheck} alt="" />
                </span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSUnCheck} alt="" />
                </span>
              </li>
              <li className="row">
                <span className="col-8">Customer portal with access to quotes, itineraries, invoices & bookings</span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSCheck} alt="" />
                </span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSUnCheck} alt="" />
                </span>
              </li>
              {props.isShowMoreUSP && (
                <React.Fragment>
                  <li className="row">
                    <span className="col-8">B2C & corporate clients can make online payments against invoices </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                  <li className="row">
                    <span className="col-8">Accounting module with customer & supplier reconciliation</span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSCheck} alt="" />
                    </span>
                    <span className="col-2 p-0 text-center align-self-center">
                      <img src={UPSUnCheck} alt="" />
                    </span>
                  </li>
                </React.Fragment>
              )}
              <li className="row">
                <span className="col-8">Ability to set up your website with own branding in just a few clicks</span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSCheck} alt="" />
                </span>
                <span className="col-2 p-0 text-center align-self-center">
                  <img src={UPSUnCheck} alt="" />
                </span>
              </li>
            </ul>
            <div className="tw-USP-column" style={window.innerWidth <= 768 ? props.isShowMoreUSP ? { height: "104.5%" } : { height: "113%" } : props.isShowMoreUSP ? { height: "113%" } : { height: "132%" }}>
              <span>TourWiz</span>

              <button
                onClick={() => props.handleShowmoreUSP()}
                className="position-absolute start-0 text-white end-0 btn btn-lg"
                style={{ bottom: "0", left: "0", right: "0" }}
              >
                {props.isShowMoreUSP ? (
                  <img src={BulletMinus} />
                ) : (
                  <img src={BulletPlus} />
                )}
                View {props.isShowMoreUSP ? "Less" : "More"}
              </button>
            </div>
          </div>

        </div><div className="pt-3" style={{ textAlign: "center" }}><h4><span style={{ color: "#8c2d9a", fontWeight: "bolder" }}>Get all of this on our SaaS Platform from less than</span><span style={{ color: "#f18247", fontWeight: "bolder", marginLeft: "10px", display: "inline-block" }}> ₹ 20/day</span></h4></div>
      </div>
    </div>
  );
};

export default HomePageUPS;
