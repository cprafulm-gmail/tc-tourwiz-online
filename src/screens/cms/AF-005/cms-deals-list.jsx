import React, { Component } from "react";
import { apiRequesterCMS } from "../../../services/requester-cms";
import Loader from "../../../components/common/loader";
import { Link } from "react-router-dom";
import SVGIcon from "../../../helpers/svg-icon";
import PriceConverter from "../../../components/common/PriceConverter";

class CMSDealsList extends Component {
  state = {
    items: [],
    isLoading: true,
  };
  getDeals = () => {

    const { cmsSettings, siteurl } = this.props;
    let reqOBJ = {};

    let reqURL = this.props.match.params.module === "locations" ? "cms/toplocations?" + siteurl + "&culturecode=en-US" : "cms/deals?" + siteurl + "&pagenumber=1&pagesize=20";
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
        {/* <CMSPageTitle title="asdasd" icon="map-marker" /> */}
        {!isLoading && this.props.match.params.module !== "locations" && (

          <div className="cp-home-deals pt-0">
            <div className="container">

              <div className="mt-3 mb-3 pb-2">
                <h3
                  className="mt-3 mb-3 text-uppercase text-dark font-weight-bold border-3 border-warning pb-3"
                  style={{ color: "#f18247", fontSize: "24px", borderBottom: "3px solid #dee2e6" }}
                >
                  Deals
                </h3>
              </div><div className="row">
                {items &&
                  items.map((x, key) => {
                    const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: this.props.ipCurrencyCode || "INR" });
                    return (<React.Fragment>
                      <div key={key} className="col-lg-3 mb-4">
                        <div className="bg-white populer-deals">
                          <div className="clo-lg-12 d-block">
                            <img
                              className="img-fluid"
                              src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                              alt={x?.shortDescription}
                            />
                          </div>
                          <div className="populer-deals-content">
                            <h5>
                              <Link
                                to={"/details/deals/" + x?.specialPromotionID}
                              >
                                {/* <SVGIcon
                                  name="map-marker"
                                  className="mr-1"
                                  width="18"
                                  height="18"
                                  type="fill"
                                ></SVGIcon> */}
                                {x?.shortDescription.split('-')[0]}
                              </Link>
                            </h5>
                            <div className="days font-weight-bold">
                              {x?.shortDescription.split('-').length > 1 && x?.shortDescription.split('-')[1]}
                              {/* {Math.ceil(
                                Math.abs(
                                  new Date(x?.validFrom).getTime() -
                                    new Date(x?.validTo).getTime()
                                ) /
                                  (1000 * 3600 * 24)
                              ) + " "}
                              Nights /{" "}
                              {Math.ceil(
                                Math.abs(
                                  new Date(x?.validFrom).getTime() -
                                    new Date(x?.validTo).getTime()
                                ) /
                                  (1000 * 3600 * 24)
                              ) - 1}{" "}
                              Days */}
                            </div>
                            {x?.price > 0 &&
                              <div className="price w-100">
                                {x?.price > 0 && `Starting at`}

                                {/* <SVGIcon
                                  name="rupee"
                                  className="ml-1 mr-1"
                                  width="12"
                                  height="12"
                                  type="fill"
                                ></SVGIcon> */}
                                {x?.offerPrice > 0 && (<span
                                  style={{ textDecoration: x?.price > 0 ? 'line-through' : 'none', marginRight: '.6rem' }}>

                                  {x?.offerPrice + " "}
                                </span>)}
                                {x?.price > 0 && (<span>
                                  {convertedCurrency + " " + convertedPrice + ""}
                                </span>)}
                                /-* per person

                              </div>
                            }
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

          <div className="cp-home-locations pt-0" style={{ background: "#EAEEEE" }}>
            <div className="container">

              <div className="mt-3 mb-3 pb-2">
                <h3
                  className="mt-3 mb-3 text-uppercase text-dark font-weight-bold border-3 border-warning pb-3"
                  style={{ color: "#f18247", fontSize: "24px", borderBottom: "3px solid #dee2e6" }}
                >
                  Popular Destinations
                </h3>
              </div><div className="row">
                {items &&
                  items.map((x, key) => (
                    <div key={key} className={key === 0 ? "col-lg-4 mb-3 pr-0" : "col-lg-4 mb-3 pr-0"}>
                      <Link to={"/details/locations/" + x?.locationID}>
                        <div className="bg-white shadow overflow-hidden">
                          <img
                            class="img-fluid"
                            src={x?.locationImage.indexOf(".s3.") > 0 ? x?.locationImage : imageURL + x?.locationImage}
                            alt={x?.locationTitle}
                          />
                          <h5 className="p-2 font-weight-bold text-center text-white position-relative">
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
