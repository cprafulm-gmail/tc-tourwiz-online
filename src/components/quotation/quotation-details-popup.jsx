import React, { Component } from "react";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import Rooms from "../details/rooms";
import Amenities from "../details/amenities";
import OverView from "../details/overview";
import AllAmenities from "../details/all-amenities";
import ImageSlider from "../details/image-slider";
import InclusionsExcusions from "./../details/inclusions-excusions";
import RulesRegulations from "./../details/rules-regulations";
import ItineraryDetails from "./../details/itenary-details";
import Schedule from "../details/schedule";
import HtmlParser from "../../helpers/html-parser";

class QuotationDetailsPopup extends Component {
  state = { tab: this.props.activeTab ? this.props.activeTab : "overview" };

  changeTabs = (tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { details, businessName } = this.props;
    const { tab } = this.state;
    const defaultClass = "btn btn-sm btn-link text-secondary";
    const activeClass = "btn btn-sm btn-primary btn-active";
    
    return (
      <div className="model-popup quotation-detail-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {details.name ? <HtmlParser text={details.name} /> : "Loading Details..."}
                </h5>
                <button type="button" className="close" onClick={this.props.hideQuickBook}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {details !== "" && (
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="quick-book-cont">
                        <ul className="nav nav-pills bg-light p-2">
                          {details.description !== undefined && details.description.length > 0 && (
                            <li className="nav-item">
                              <button
                                onClick={() => this.changeTabs("overview")}
                                className={tab === "overview" ? activeClass : defaultClass}
                              >
                                {Trans("_overview")}
                              </button>
                            </li>
                          )}

                          {businessName === "hotel" &&
                            details.amenities !== undefined &&
                            details.amenities.length > 0 && (
                              <li className="nav-item">
                                <button
                                  onClick={() => this.changeTabs("amenities")}
                                  className={tab === "amenities" ? activeClass : defaultClass}
                                >
                                  {Trans("_facilities")}
                                </button>
                              </li>
                            )}

                          {(businessName === "activity" ||
                            businessName === "package" ||
                            businessName === "transfers") && details.tpExtension &&
                            ((details.tpExtension.find((x) => x.key === "inclusions") &&
                              details.tpExtension.find((x) => x.key === "inclusions").value) ||
                              (details.tpExtension.find((x) => x.key === "exclusions") &&
                                details.tpExtension.find((x) => x.key === "exclusions").value)) && (
                              <li className="nav-item">
                                <button
                                  onClick={() => this.changeTabs("amenities")}
                                  className={tab === "amenities" ? activeClass : defaultClass}
                                >
                                  {Trans("_jumpToInclusionsExclusions")}
                                </button>
                              </li>
                            )}

                          {businessName === "package" &&
                            details.tpExtension.find((x) => x.key === "itenaryDetails") &&
                            details.tpExtension.find((x) => x.key === "itenaryDetails").value && (
                              <li className="nav-item">
                                <button
                                  onClick={() => this.changeTabs("itineraryDetails")}
                                  className={
                                    tab === "itineraryDetails" ? activeClass : defaultClass
                                  }
                                >
                                  {Trans("_jumpToItineraryDetails")}
                                </button>
                              </li>
                            )}

                          {(businessName !== "activity" &&
                            businessName !== "package" &&
                            businessName !== "transfers") && details.images !== undefined && details.images.length > 0 && (
                            <li className="nav-item">
                              <button
                                onClick={() => this.changeTabs("photos")}
                                className={tab === "photos" ? activeClass : defaultClass}
                              >
                                {Trans("_photo")}
                              </button>
                            </li>
                          )}

                          {(businessName === "activity" ||
                            businessName === "package" ||
                            businessName === "transfers") && details.tpExtension &&
                            details.tpExtension.find((x) => x.key === "rulesAndRegulations") &&
                            details.tpExtension.find((x) => x.key === "rulesAndRegulations")
                              .value && (
                              <li className="nav-item">
                                <button
                                  onClick={() => this.changeTabs("termsConditions")}
                                  className={tab === "termsConditions" ? activeClass : defaultClass}
                                >
                                  {Trans("_jumpToTermsAndConditions")}
                                </button>
                              </li>
                            )}
                        </ul>

                        <div className="row quick-book">
                          <div className="col-lg-12">
                            <div className="pt-3 pl-2">
                              {tab === "overview" && <OverView {...details} />}

                              {tab === "amenities" && (
                                <React.Fragment>
                                  {businessName === "hotel" && <Amenities {...details} />}
                                  {businessName !== "hotel" && <InclusionsExcusions {...details} />}
                                </React.Fragment>
                              )}

                              {tab === "amenities-icons" && (
                                <div className="amenities-icons fade show">
                                  <AllAmenities {...details} />
                                </div>
                              )}

                              {tab === "termsConditions" && <RulesRegulations {...details} />}

                              {tab === "itineraryDetails" && <ItineraryDetails {...details} />}

                              {tab === "photos" && (
                                <ImageSlider
                                  {...details}
                                  businessName={businessName}
                                  noofimage={3}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {details === "" && (
                  <div className="row">
                    <div
                      className="col-lg-12 d-flex align-items-center justify-content-center"
                      style={{ minHeight: "240px" }}
                    >
                      {this.props.isDetailsResponseLoading && (
                        <React.Fragment>
                          <span
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              top: "10px",
                              right: "25px",
                            }}
                            onClick={() => this.hideQuickBook()}
                          >
                            <SVGIcon name="times"></SVGIcon>
                          </span>
                          <h5>{Trans("_detail" + businessName + "NotAvailable")}</h5>
                        </React.Fragment>
                      )}

                      {!this.props.isDetailsResponseLoading && <Loader />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default QuotationDetailsPopup;
