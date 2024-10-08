import React, { Component } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import { cmsConfig } from "../../helpers/cms-config";
import { Link } from "react-router-dom";
import ImageSlider from "../../components/details/image-slider";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import SVGIcon from "../../helpers/svg-icon";
import PriceConverter from "../../components/common/PriceConverter";

class CMSDealsList extends Component {
  state = {
    items: [],
    isLoading: true,
  };
  getDeals = () => {

    const { cmsSettings, siteurl } = this.props;
    let reqOBJ = {};

    let reqURL = this.props.match.params.module === "locations" ? "cms/toplocations?" + siteurl + "&culturecode=en-US" : this.props.match.params.module === "packages" ? "cms/packages?" + siteurl + "&pagenumber=1&pagesize=50" : "cms/deals?" + siteurl + "&pagenumber=1&pagesize=50";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({ items: data?.response || [], isLoading: false });
      },
      "GET"
    );
  };

  getLocations = () => {
    const { siteurl } = this.state;

    let reqOBJ = {};
    let reqURL = "cms/toplocations?" + siteurl + "&culturecode=en-US";

    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({ items: data?.response || [] });
      },
      "GET"
    );
  };



  componentDidMount() {
    this.getDeals();
  }

  render() {
    const { items, isLoading } = this.state;
    const { cmsSettings } = this.props;

    let imageURL =
      process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + (this.props.match.params.module === "locations" ? "/LocationsGuide/images/" : "/SpecialsPromotions/images/");

    return (
      <div>
        {<CMSPageTitle title={this.props.match.params.module.toUpperCase()} icon="map-marker" />}
        {!isLoading && this.props.match.params.module !== "locations" && (

          <div className="cp-home-deals" style={{ marginTop: "-15px", paddingTop: "20px", background: "#eaeeee" }}>
            <div className="container">
              <div className="row">
                {items &&
                  items.map((x, key) => {
                    const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: this.props.toBeConvertCurrency });
                    return (<React.Fragment>
                      <div key={key} className="col-lg-4 mb-4">
                        <div className="bg-white shadow">
                          <img
                            class="img-fluid"
                            src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                            alt={x?.shortDescription}
                          />
                          <div className="p-4" style={{ height: "146px" }}>
                            <h5 className="font-weight-bold mb-3">
                              <Link to={"/details/deals/" + x?.specialPromotionID}>
                                {x?.shortDescription}
                              </Link>
                              {x?.offerPrice > 0 && (<span className="text-primary pull-right" style={{ marginLeft: '.5rem' }}>
                                {x?.symbol + " " + x?.offerPrice}
                              </span>
                              )}
                              {x?.price > 0 && (<span className="text-primary pull-right" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                                {convertedCurrency + " " + convertedPrice}
                              </span>
                              )}
                            </h5>
                            {/* <p className="small text-secondary mb-0">
                            <HtmlParser text={decode(x?.summaryDescription)} />
                          </p> */}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {!isLoading && this.props.match.params.module === "locations" && (

          <div className="cp-home-locations" style={{ background: "#EAEEEE", marginTop: "-15px", paddingTop: "20px" }}>
            <div className="container">
              <div className="row">
                {items &&
                  items.map((x, key) => (
                    <div key={key} className={key === 0 ? "col-lg-3 mb-3 pr-0" : "col-lg-3 mb-3 pr-0"}>
                      <Link to={"/details/locations/" + x?.locationID}>
                        <div className="bg-white shadow overflow-hidden">
                          <img
                            class="img-fluid"
                            src={x?.locationImage.indexOf(".s3.") > 0 ? x?.locationImage : x?.locationImage.indexOf("preprod-images.thetripcentre.com/cms") > 0 ? x?.locationImage : imageURL + x?.locationImage}
                            alt={x?.locationTitle}
                          />
                          <h5 className="p-2 font-weight-bold text-center text-white position-relative" style={{ background: "rgba(0,0,0,.5)" }}>
                            {x?.locationTitle}
                          </h5>
                        </div>
                      </Link>
                    </div>
                  ))}
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
    );
  }
}

export default CMSDealsList;
