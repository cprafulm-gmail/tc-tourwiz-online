import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import SVGIcon from "../../../helpers/svg-icon";
import { CMSContext } from "../../../screens/cms/cms-context";
import PriceConverter from "../../common/PriceConverter";

const CMSLastMinuteDeals = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, toBeConvertCurrency } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/";

  const params = {
    navigation: {
      nextEl: ".swiper-button-next-lm-deal1",
      prevEl: ".swiper-button-prev-lm-deal1"
    },
    breakpoints: {
      1024: {
        slidesPerView: 6,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 0
      }
    }
  }
  const goNext = () => {
    document.querySelector('.swiper-button-next-lm-deal1').click();
  };

  const goPrev = () => {
    document.querySelector('.swiper-button-prev-lm-deal1').click();
  };
  return (
    <React.Fragment>
      <div className="cp-home-lastminute-deals">
        <div className="container">
          <p className="lastminute-deals-sub-title">EASY</p>
          <h2 className="lastminute-deals-title">VISA DESTINATIONS</h2>
          <div className="rosw">
            <Swiper {...params}>
              {cmsContents.lastMinuteDealsContent &&
                cmsContents.lastMinuteDealsContent.map(
                  (x, key) => {

                    const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: toBeConvertCurrency });
                    return (
                      <div key={key} className="lastminute-deal-item mb-4"
                        style={{ boxSizing: "border-box", height: "auto" }}
                        title={x?.shortDescription.split('-')[0]}>
                        <div className="lastminute-deals">
                          <div className="lastminute-deal-item-img">
                            <img
                              className="img-fluid"
                              src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                              alt={x?.shortDescription}
                            />
                          </div>
                          <div className="lastminute-deals-content">
                            <h5>
                              <Link
                                to={"/details/deals/" + x?.specialPromotionID}
                              >
                                {x?.shortDescription.split('-')[0].length > 25 ? x?.shortDescription.split('-')[0].substring(0, 25) + "..." : x?.shortDescription.split('-')[0]}
                              </Link>
                            </h5>
                            <div className="days font-weight-bold" style={{ display: "none" }}>
                              {x?.shortDescription.split('-').length > 1 && x?.shortDescription.split('-')[1]}
                            </div>
                            {x?.price > 0 &&
                              <div className="price w-100" style={{ display: "none" }}>
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
                    );
                  }
                )}
            </Swiper>
          </div>
          <div className="row">
            <div className="col-lg-12 pt-5">
              <div className="swiper-button-prev-custom" onClick={goPrev}>
                <SVGIcon name="chevron-left" width="28" height="28" className="fa-2x text-dark swipper-navigation-prev"></SVGIcon>

              </div>
              <div className="swiper-button-next-custom" onClick={goNext}>
                <SVGIcon name="chevron-right" width="28" height="28" className="fa-2x text-dark swipper-navigation-next"></SVGIcon></div>

              <div className="d-flex align-items-center justify-content-center mt-2 h-100 ">
                {cmsContents.lastMinuteDealsContent.length > 4 && (
                  <Link
                    to={"/list/deals"}
                    className="btn-showmore"
                    style={{ display: "none" }}
                  >
                    SHOW MORE
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CMSLastMinuteDeals;
