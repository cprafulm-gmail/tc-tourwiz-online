import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../screens/cms/cms-context";
import PriceConverter from "../common/PriceConverter";
import PlainTextComponent from "./plain-text-from-html";

const CMSDeals = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, ipCurrencyCode } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/SpecialsPromotions/images/";
  return (
    <div className="cp-home-deals">
      <div className="container">
        <h2 className="mb-4 font-weight-bold text-white">Popular Deals</h2>
        <div className="row">
          {cmsContents.dealsContent &&
            cmsContents.dealsContent.map((x, key) => {
              const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: ipCurrencyCode || "INR" });
              return key < 3 && (
                <div key={key} className="col-lg-4 mb-4">
                  <div className="bg-white shadow">
                    <img
                      class="img-fluid"
                      src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                      alt={x?.shortDescription}
                    />
                    <div className="p-4">
                      <h5 className="font-weight-bold mb-3">
                        <Link to={"/details/deals/" + x?.specialPromotionID}>
                          {x?.shortDescription}
                        </Link>
                        {x?.offerPrice > 0 && (<span className="text-primary pull-right" style={{ marginLeft: '.5rem' }}>
                          {convertedCurrency + " " + x?.offerPrice}
                        </span>
                        )}
                        {x?.price > 0 && (<span className="text-primary pull-right" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                          {convertedCurrency + " " + convertedPrice}
                        </span>
                        )}
                      </h5>
                      <p className="small text-secondary mb-0">
                        {/* <HtmlParser text={decode(x?.summaryDescription)} /> */}
                        <PlainTextComponent htmlString={decode(x?.summaryDescription)} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="d-flex align-items-center justify-content-center ">
          {cmsContents.dealsContent.length > 3 && (
            <button
              className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow border-0 ">

              <Link to={"/list/deals"}
                style={{ textDecoration: "none", color: "white" }}
              >
                Show More
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSDeals;
