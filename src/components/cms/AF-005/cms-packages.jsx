import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import { Grid, Pagination } from "swiper";
import SVGIcon from "../../../helpers/svg-icon";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";
import PriceConverter from "../../common/PriceConverter";

const CMSPackages = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, toBeConvertCurrency } = cmsState;
  //const packages = deals;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/";

  const params = {
    slidesPerView: 2,
    slidesPerColumn: 2,
    spaceBetween: 0,
    navigation: {
      nextEl: ".swiper-button-next-package",
      prevEl: ".swiper-button-prev-package"
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  }
  const goNext = () => {
    document.querySelector('.swiper-button-next-package').click();
  };

  const goPrev = () => {
    document.querySelector('.swiper-button-prev-package').click();
  };

  const css = `.swiper-container-multirow-column > .swiper-wrapper {
    flex-direction: inherit;
  }`;

  return (
    <React.Fragment>
      <div className="cp-home-packages">
        <style>{css}</style>
        <div className="container">
          <p className="packages-sub-title">BEST OFFERS</p>
          <h2 className="packages-title">FLIGHTS</h2>
          <div className="rzow">
            <Swiper {...params}>
              {cmsContents.packagesContent &&
                cmsContents.packagesContent.map(
                  (x, key) => {

                    const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: toBeConvertCurrency });
                    return (
                      <div key={key} className={"mb-4 mt-0 praful-" + x?.shortDescription.split('-')[0]} title={x?.shortDescription.split('-')[0]} >
                        <div className="col-lg-12 p-0 bg-white packages ">
                          <div className="col-lg-5 p-0 pull-left package-item-img">
                            <img
                              className="img-fluid"
                              src={x?.smallImagePath.indexOf(".s3.") > 0 ? x?.smallImagePath : imageURL + x?.smallImagePath}
                              alt={x?.shortDescription}
                            />
                          </div>
                          <div className="col-lg-7 package-item-content">
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
                            <div className="days font-weight-bold" style={{ display: "none" }}>
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
                            <div className="price summery w-100">
                              {x?.summaryDescription.length > 50 ?
                                <HtmlParser text={decode(x?.summaryDescription).substring(0, 50)} /> + "..." : <HtmlParser text={decode(x?.summaryDescription)} />}
                            </div>
                            <div className="d-flex align-items-start justify-content-start mt-2 h-100 ">
                              <Link
                                to={"/details/deals/" + x?.specialPromotionID}
                                className="btn-booknow"
                              >
                                BOOK NOW
                              </Link>
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

                              </div>}
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
                {cmsContents.packagesContent.length > 4 && (
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

export default CMSPackages;
