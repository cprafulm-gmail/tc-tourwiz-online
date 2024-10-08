import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SVGIcon from "../../../helpers/svg-icon";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";
import PriceConverter from "../../common/PriceConverter";
import PlainTextComponent from "../plain-text-from-html";

const CMSLocations = React.lazy(() => import('../../../components/cms/AF-001/cms-locations'));

const CMSDeals = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, ipCurrencyCode } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";

  return (
    <div className="cp-home-deals">
      <div className="container">
        <h1 className="mb-4 font-weight-bold text-whiste text-center mb-0 text-uppercase">Hot Deals</h1>
        <h3 className="mb-4 font-weight-bold text-whiste text-center mb-5 text-uppercase">Show More</h3>
        <div className="row">
          <div className=" col-lg-6 p-0">
            {cmsContents.dealsContent &&
              cmsContents.dealsContent.map((x, key) => {
                const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: ipCurrencyCode || "INR" });
                return key < 3 && (
                  <div key={key} className="col-lg-12 hotdeals-item mb-3 pb-3">
                    <div className="bg-white populer-deals">
                      <div className="col-lg-4 pull-left p-0">
                        <img
                          class="img-fluid"
                          src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                          alt={x?.shortDescription}
                        />
                      </div>
                      <div className="p-0 col-lg-8 pull-left populer-deals-content">
                        <h5 className="col-lg-12 font-weight-bold mb-2 pr-0">
                          <Link to={"/details/deals/" + x?.specialPromotionID}>
                            {x?.shortDescription}
                          </Link>
                        </h5>
                        <div className="col-lg-12 pull-left d-inline pr-0">
                          <div className="col-lg-9 p-0 pull-left d-inline">
                            <p className="small text-secondary mb-0">
                              {/* <HtmlParser text={decode(x?.summaryDescription)} /> */}
                              <PlainTextComponent htmlString={decode(x?.summaryDescription)} />
                            </p>
                          </div>
                          <div className="p-0 col-lg-3  pull-left populer-deals-content">
                            <div className="col-lg-12 mt-2 p-0 mb-2 d-inline font-weight-bold price">

                              {x?.price > 0 && (<span className="text-white ml-3" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                                {convertedCurrency + " " + convertedPrice}
                              </span>
                              )}
                              {x?.offerPrice > 0 && (<span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                                {x?.symbol + " " + x?.offerPrice}
                              </span>
                              )}
                            </div>
                            <div className="col-lg-12 pull-left d-inline">
                              <Link className="btn btn-lg btn-primary mt-1 pt-0 pb-0 shadow" to={"/details/deals/" + x?.specialPromotionID}>More
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div className="d-flex align-items-center justify-content-center AF-003 populer-deals">
              {cmsContents.dealsContent.length > 3 && (
                <button
                  className="btn btn-lg btn-info mt-1 pt-1 pb-1 shadow border-0 ">

                  <Link to={"/list/deals"}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Show More
                  </Link>
                </button>
              )}
            </div>
          </div>
          <div className=" col-lg-6 p-0">
            <CMSLocations />
            <div className="AF-001 populer-deals d-flex align-items-center justify-content-center"  >
              {cmsContents.topLocationsContents.length > 4 && (
                <button
                  class="btn btn-lg btn-danger mt-1 pt-1 pb-1 shadow">
                  <Link to={"/list/locations"}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Show More
                  </Link></button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDeals;
