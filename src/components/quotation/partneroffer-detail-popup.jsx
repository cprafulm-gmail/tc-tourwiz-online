import React, { Component } from "react";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import ImageSlider from "../details/image-slider";
import HtmlParser from "../../helpers/html-parser";
import Date from "../../helpers/date";

class PartnerOfferDetailsPopup extends Component {
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
                  {details.availableOffer[0].name ? <HtmlParser text={details.availableOffer[0].name.length > 55 ? details.availableOffer[0].name.substring(0, 55) + "..." : details.availableOffer[0].name} /> : "Loading Details..."}
                </h5>
                <button type="button" className="close" onClick={this.props.hideQuickBook}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {details !== "" && (
                  <div className="row">

                    <div className="col-lg-3  float-left">
                      <img src={details.imagesdata && details.imagesdata.filter(x => x.isDefaultImage === true) ? details.imagesdata.filter(x => x.isDefaultImage === true)[0].url : ""} style={{ width: 150, height: 150 }} />
                    </div>
                    <div className="col-lg-9  float-right">
                      <div className="row pl-2">
                        <div className="col-lg-3">
                          Offer Start Date:
                        </div>
                        <div className="col-lg-8">
                          {<Date date={details.availableOffer[0].offerStartDate} format={"DD/MM/YYYY"} />}
                        </div>
                        <div className="col-lg-3">
                          Offer End Date:
                        </div>
                        <div className="col-lg-8">
                          {<Date date={details.availableOffer[0].offerEndDate} format={"DD/MM/YYYY"} />}
                        </div>
                        <div className="col-lg-8">
                          {details.availableOffer[0].description}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 float-left mt-3">
                      <ul className="nav nav-pills bg-light p-2">
                        {details.availableOffer[0].advT_HTMLText !== undefined && details.availableOffer[0].advT_HTMLText.length > 0 && (
                          <li className="nav-item">
                            <button
                              onClick={() => this.changeTabs("overview")}
                              className={tab === "overview" ? activeClass : defaultClass}
                            >
                              {Trans("_overview")}
                            </button>
                          </li>
                        )}


                        {details.imagesdata !== undefined && details.imagesdata.length > 0 && (
                          <li className="nav-item">
                            <button
                              onClick={() => this.changeTabs("photos")}
                              className={tab === "photos" ? activeClass : defaultClass}
                            >
                              {Trans("_photo")}
                            </button>
                          </li>
                        )}
                        {details.pdFdata !== undefined && details.pdFdata.length > 0 && (
                          <li className="nav-item">
                            <button
                              onClick={() => this.changeTabs("documents")}
                              className={tab === "documents" ? activeClass : defaultClass}
                            >
                              {Trans("Documents")}
                            </button>
                          </li>
                        )}
                      </ul>

                      <div className="row quick-book">
                        <div className="col-lg-12">
                          <div className="pt-3 pl-2">
                            {tab === "overview" && <HtmlParser text={details.availableOffer[0].advT_HTMLText} />}

                            {tab === "photos" && (
                              <ImageSlider
                                images={details.imagesdata}
                                businessName={"hotel"}
                                noofimage={1}
                              />
                            )}
                            {tab === "documents" && details?.pdFdata?.map((item, index) => {
                              return <span key={index}><a className="btn btn-link  text-primary" href={item.fileURL} target="_blank" download={`offer${index + 1}.pdf`}>Download PDF {index + 1}</a></span>
                            })}
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

export default PartnerOfferDetailsPopup;
