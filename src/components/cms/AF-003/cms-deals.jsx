import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SVGIcon from "../../../helpers/svg-icon";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";
import PriceConverter from "../../common/PriceConverter";
import PlainTextComponent from "../plain-text-from-html";

const CMSDeals = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, ipCurrencyCode } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";

  return (
    <div className="cp-home-deals">
      <div className="container">
        {/* <h2 className="mb-4 font-weight-bold text-white">Popular Deals</h2> */}
        <div className="row">
          {cmsContents.dealsContent &&
            cmsContents.dealsContent.map((x, key) => {
              const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: ipCurrencyCode || "INR" });
              return key < 4 && (
                <div key={key} className="col-lg-3 mb-4">
                  <div className="bg-white populer-deals">
                    <div className="clo-lg-12 d-block border border-3 border-white">
                      <img
                        class="img-fluid"
                        src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                        alt={x?.shortDescription}
                      />
                    </div>
                    <div className="p-4 populer-deals-content">
                      <h5 className="font-weight-bold mb-3">
                        <Link to={"/details/deals/" + x?.specialPromotionID}>
                          {x?.shortDescription}
                        </Link>
                      </h5>
                      <div className="clo-lg-12 d-block">
                        <p className="small text-secondary mb-0">
                          {/* <HtmlParser text={decode(x?.summaryDescription)} /> */}
                          <PlainTextComponent htmlString={decode(x?.summaryDescription)} />
                        </p>
                      </div>
                      <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold price">
                        {/* {x?.price > 0 && Price} */}
                        {x?.price > 0 && (<span className="text-white ml-3" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                          {convertedCurrency + " " + convertedPrice}
                        </span>
                        )}
                        {x?.offerPrice > 0 && (<span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                          {x?.symbol + " " + x?.offerPrice}
                        </span>
                        )}
                      </div>
                      <div className="clo-lg-12 d-block">
                        <Link className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow" to={"/details/deals/" + x?.specialPromotionID}>More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="d-flex align-items-center justify-content-center AF-003 populer-deals">
          {cmsContents.dealsContent.length > 4 && (
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
    </div >
  );
};

export default CMSDeals;
