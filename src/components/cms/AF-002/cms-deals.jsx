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
              return key < 3 && (
                <div key={key} className="col-lg-4 mb-4">
                  <div className="bg-white shadow populer-deals">
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
                      <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold">
                        {/* {x?.price > 0 && Price} */}
                        {x?.price > 0 && (<span className="text-white ml-3" style={{ textDecoration: x?.offerPrice > 0 ? 'line-through' : 'none', }}>
                          {convertedPrice + " " + convertedCurrency}
                        </span>
                        )}
                        {x?.offerPrice > 0 && (<span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                          {x?.symbol + " " + x?.offerPrice}
                        </span>
                        )}
                      </div>
                      <div className="clo-lg-12 d-block">
                        <Link className="m-3 d-block" to={"/details/deals/" + x?.specialPromotionID}>
                          <SVGIcon
                            name="chevron-right"
                            className="mr-2 "
                            width="15"
                            height="15"
                          ></SVGIcon>
                        </Link>
                      </div>
                    </div>
                    <div className="clo-lg-12 d-block">
                      <img
                        class="img-fluid"
                        src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                        alt={x?.shortDescription}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="AF-002 d-flex align-items-center justify-content-center ">
          {cmsContents.dealsContent.length > 3 && (
            <button
              className="btn btn-lg btn btn-dark mt-1 pt-1 pb-1 shadow" style={{ background: "#152b38" }}>

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
