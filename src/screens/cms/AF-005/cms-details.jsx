import React, { Component } from "react";
import { apiRequesterCMS } from "../../../services/requester-cms";
import CMSPageTitle from "../../../components/cms/cms-page-title";
import Loader from "../../../components/common/loader";
import { cmsConfig } from "../../../helpers/cms-config";
import { Link } from "react-router-dom";
import ImageSlider from "../../../components/details/image-slider";
import CMSCopyrights from "../../../components/cms/AF-005/cms-copywrite";
import HtmlParser from "../../../helpers/html-parser";
import SVGIcon from "../../../helpers/svg-icon";
import { decode } from "html-entities";

class CMSDetails extends Component {
  state = {
    ...cmsConfig,
    result: "",
    isLoading: true,
    activeTab:
      this.props.match.params.module !== "locations"
        ? "overview"
        : "Overview",
  };
  scrollRef = React.createRef();

  getDetails = () => {
    const { id, module } = this.state;
    const { cmsSettings } = this.props;

    let reqOBJ = {};
    let reqURL =
      "cms/" +
      (module !== "locations" ? "specialpromotiondetails" : "locationdetails") +
      "?portalid=" +
      cmsSettings.portalID +
      "&itemid=" +
      id;
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          result: data?.response || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };

  handleTabs = (activeTab) => {
    this.setState({ activeTab }, () =>
      this.scrollRef.current.scrollIntoView({ behavior: "smooth" })
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState(
      {
        id: this.props.match.params.id,
        module: this.props.match.params.module,
      },
      () => this.getDetails()
    );
  }

  render() {
    const { id, result, isLoading, activeTab, module } = this.state;
    const { cmsSettings } = this.props;

    const details = result.details ? result.details[0] : "";
    const title = (details && details?.shortdescription) || "Details";
    const defaultImg = (details && details?.imagepath) ? details?.imagepath.indexOf(".s3.") > 0 ? details?.imagepath :
      process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
      cmsSettings?.portalID +
      "/SpecialsPromotions/images/" +
      details?.imagepath : "";

    const defaultImgLoc =
      (details && details?.locationImage) ? details?.locationImage.indexOf(".s3.") > 0 ?
        details?.locationImage : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
          cmsSettings?.portalID +
          "/LocationsGuide/images/" +
          details?.locationImage) : "";
    let images = [];
    result?.tabs?.photoGallery &&
      result?.tabs?.photoGallery.map((x) =>
        images.push({
          url: x.imagepath.indexOf(".s3.") > 0 ? x.imagepath :
            process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
            cmsSettings?.portalID +
            "/SpecialsPromotions/" +
            x.imagepath,
        })
      );
    let starItems = [];
    for (var i = 0; i < details?.rating; i++) {
      starItems.push(<SVGIcon
        name="star"
        key={i}
        type="fill"
        width="14"
        height="14"
        className="text-primary"
      ></SVGIcon>);
    }

    return (
      <React.Fragment>
        <div style={{ background: "rgb(234 238 238 / 41%)" }}>
          {/* <CMSPageTitle title={title} icon="map-marker" /> */}
          {!isLoading && module !== "locations" && (
            <div
              style={{ minHeight: "calc(100vh - 284px)" }}
              className="container pt-4 pb-5"
            >
              <div className="row">
                <div className="col-lg-4">
                  <img
                    class="img-fluid"
                    src={defaultImg || defaultImgLoc || details?.imagepath}
                    alt={details?.shortdescription}
                  />
                </div>
                <div className="col-lg-8">
                  <h5 className="font-weight-bold text-uppercase  ">
                    {details?.shortdescription.split('-')[0]}
                  </h5>
                  {details?.brochureFileName && (
                    <a className="btn btn-sm btn-primary"
                      href={details?.brochureFileName}
                      target="_blank" style={{ position: "absolute", top: "0px", right: "0px", color: "fff" }}
                      download={`Package - ${details?.shortDescription && details?.shortDescription}.pdf`}
                    >
                      Download Brochure{" "}
                    </a>
                  )}
                  <div className="days font-weight-bold">
                    {details?.shortdescription.split('-').length > 1 && details?.shortdescription.split('-')[1]}
                  </div>
                  {details?.price > 0 &&
                    <span className="w-100">{"Starting at "}

                      <SVGIcon
                        name="rupee"
                        className="mr-1"
                        width="12"
                        height="12"
                        type="fill"
                      ></SVGIcon>
                      {details?.offerPrice > 0 && (<span
                        style={{ textDecoration: details?.price > 0 ? 'line-through' : 'none', marginRight: '.6rem' }}>

                        {details?.offerPrice + " "}
                      </span>)}
                      {details?.price > 0 && (<span>
                        {details?.price + ""}
                      </span>)}
                      {" /-* "}
                    </span>
                  }

                  <div>{starItems}</div>
                  <div className="mb-2">{details?.specialPromotionType}</div>
                  {/* <p className="text-secondary mt-3 mb-3">{<HtmlParser text={decode(details?.summarydescription)} />}</p> */}
                  <Link className="btn btn-primary mt-3" to={"/customerinquiry/" + id}>
                    Inquiry now
                  </Link>
                </div>
              </div>

              <div ref={this.scrollRef} />

              <div className="row mt-4">
                <div className="col-lg-12">
                  <ul className="nav nav-tabs">
                    <li className="nav-item mr-2">
                      <button
                        class={
                          "nav-link p-2 rounded-0 text-capitalize" +
                          (activeTab === "overview" ? " active" : "")
                        }
                        onClick={() => this.handleTabs("overview")}
                      >
                        {"Overview"}
                      </button>
                    </li>
                    {result?.tabs &&
                      Object.keys(result?.tabs).map(
                        (x) =>
                          result?.tabs[x] && result?.tabs[x][0] != undefined &&
                          result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != "" &&
                          result?.tabs[x][0][x === "inclusion" || x === "exclusion" ? "shortdescription" : x === "photoGallery" ? "imagepath" : x === "priceGuideLine" ? "priceGuideLine" : x] != undefined && (
                            <li className="nav-item">
                              <button
                                class={
                                  "nav-link p-2 rounded-0 text-capitalize" +
                                  (activeTab === x ? " active" : "")
                                }
                                onClick={() => this.handleTabs(x)}
                              >
                                {x === "photoGallery" ? "Photo Gallery" : x === "priceGuideLine" ? "Price Guideline" : x === "termsConditions" ? "Terms Conditions" : x}
                              </button>
                            </li>
                          ))}
                  </ul>

                  <div className="mt-4">
                    {result?.tabs &&
                      Object.keys(result?.tabs).map(
                        (x) =>
                          activeTab === x && (
                            <div className={"cms-details-" + x}>
                              {x === "overview" && (
                                <HtmlParser text={decode(details?.summarydescription)} />
                              )}
                              {x === "description" &&
                                result?.tabs[x] &&
                                result?.tabs[x][0]?.description && (
                                  <HtmlParser
                                    text={decode(result?.tabs[x][0]?.description)}
                                  />
                                )}
                              {x === "flightDetails" &&
                                result?.tabs[x] &&
                                result?.tabs[x][0]?.flightDetails && (
                                  <HtmlParser
                                    text={decode(result?.tabs[x][0]?.flightDetails)}
                                  />
                                )}
                              {x === "priceGuideLine" &&
                                result?.tabs[x] &&
                                result?.tabs[x][0]?.priceGuideLine && (
                                  <HtmlParser
                                    text={decode(result?.tabs[x][0]?.priceGuideLine)}
                                  />
                                )}
                              {x === "termsConditions" &&
                                result?.tabs[x] &&
                                result?.tabs[x][0]?.termsConditions && (
                                  <HtmlParser
                                    text={decode(result?.tabs[x][0]?.termsConditions)}
                                  />
                                )}

                              {(x === "inclusion" || x === "exclusion") && (
                                <ul>
                                  {result?.tabs[x].map((y) => (
                                    <li>{y?.shortdescription}</li>
                                  ))}
                                </ul>
                              )}

                              {x === "photoGallery" && (
                                <div className="row">
                                  <div className="col-lg-2"></div>
                                  <div className="col-lg-8">
                                    <ImageSlider
                                      images={images}
                                      businessName={"hotel"}
                                      noofimage={1}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && module === "locations" && (
            <div
              style={{ minHeight: "calc(100vh - 284px)" }}
              className="container pt-4 mb-5"
            >
              <div className="row">
                <div className="col-lg-2">
                  <img
                    class="img-fluid"
                    src={defaultImgLoc}
                    alt={details?.shortdescription}
                  />
                </div>
                <div className="col-lg-10">
                  <h5 className="font-weight-bold">{details?.locationTitle}</h5>
                  <p className="text-secondary">{<HtmlParser text={decode(details?.summarydescription)} />}</p>
                  {result?.tabs && (
                    <div
                      className="text-secondary"
                      style={{ overflow: "hidden", maxHeight: "120px" }}
                    >
                      {result?.tabs[0]?.tabDetails && (
                        <HtmlParser text={decode(result?.tabs[0]?.tabDetails)} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div ref={this.scrollRef} />

              <div className="row mt-4">
                <div className="col-lg-12">
                  <ul className="nav nav-tabs">
                    {result?.tabs &&
                      result?.tabs.map((x, key) => (
                        <li>
                          <button
                            class={
                              "nav-link p-2 rounded-0 text-capitalize" +
                              (activeTab === x?.tabTitle || key === 0 ? " active" : "")
                            }
                            onClick={() => this.handleTabs(x?.tabTitle)}
                          >
                            {x?.tabTitle}
                          </button>
                        </li>
                      ))}
                  </ul>

                  <div className="mt-4">
                    {result?.tabs &&
                      result?.tabs.map(
                        (x, key) =>
                          (activeTab === x?.tabTitle || key === 0) && (

                            <div className={"cms-details-" + x}>
                              <HtmlParser text={decode(x?.tabDetails)} />
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
            >
              <Loader />
            </div>
          )}
        </div>
        <CMSCopyrights {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default CMSDetails;
