import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import flight from "../../../assets/images/customer-portal/template-images/our-services-flight.png";
import hotel from "../../../assets/images/customer-portal/template-images/our-services-hotel.png";
import holiday from "../../../assets/images/customer-portal/template-images/our-services-holiday-package.png";
import life from "../../../assets/images/customer-portal/template-images/our-services-life.png";
import transfers from "../../../assets/images/customer-portal/template-images/our-services-transfers.png";
import visas from "../../../assets/images/customer-portal/template-images/our-services-visas.png";
import cruises from "../../../assets/images/customer-portal/template-images/our-services-cruises.png";
import attractions from "../../../assets/images/customer-portal/template-images/our-services-attractions.png";
import villa from "../../../assets/images/customer-portal/template-images/villa.png";
import SVGIcon from "../../../helpers/svg-icon";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";
import PriceConverter from "../../common/PriceConverter";

const CMSDeals = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, ipCurrencyCode } = cmsState;
  let imageURL =
    process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
    cmsSettings?.portalID +
    "/SpecialsPromotions/images/";

  const params = {
    navigation: {
      nextEl: ".swiper-button-next-deal",
      prevEl: ".swiper-button-prev-deal"
    },
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 0
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 0
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 0
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  }
  const goNext = () => {
    document.querySelector('.swiper-button-next-deal').click();
  };

  const goPrev = () => {
    document.querySelector('.swiper-button-prev-deal').click();
  };
  return (
    <React.Fragment>
      <div className="cp-home-our-service">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 pb-5 pt-5">
              <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h2 className="our-services-title">OUR SERVICES</h2>
                  <p className="our-services-p">
                    Become an Agent & Get Access to Our Wide Array at Travel
                    Services
                  </p>
                  <div className="d-flex justify-content-center our-services-all-items">
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={flight} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Flights</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={hotel} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Hotels</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={holiday} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Holiday Packages</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={villa} alt="" className="w-50" />
                      </div>
                      <div className="our-services-name">
                        <span>Villas</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={attractions} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Attractions</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={transfers} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Transfers</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={cruises} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Cruises</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={visas} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Visas</span>
                      </div>
                    </div>
                    <div className="our-services-item">
                      <div className="our-services-icon">
                        <img src={life} alt="" />
                      </div>
                      <div className="our-services-name">
                        <span>Insurance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-deals">
        <div className="container">
          <p className="deals-sub-title">MOST POPULAR</p>
          <h2 className="deals-title">Hotels</h2>
          <div className="row">
            <Swiper {...params}>
              {cmsContents.dealsContent &&
                cmsContents.dealsContent.map(
                  (x, key) => {
                    const [convertedPrice, convertedCurrency] = PriceConverter({ amount: x?.price, currentCurrency: ipCurrencyCode || "INR" });
                    return (<div key={key} className="col-lg-3 mb-4">
                      <div className="bg-white populer-deals">
                        <div>
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
                              {x?.shortDescription.split('-')[0].length > 20 ? x?.shortDescription.split('-')[0].substring(0, 20) + "..." : x?.shortDescription.split('-')[0]}
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
                          <div className="price w-100">
                            {x?.summaryDescription.length > 50 ?
                              <HtmlParser text={decode(x?.summaryDescription).substring(0, 50)} /> + "..." : <HtmlParser text={decode(x?.summaryDescription)} />}
                          </div>
                          <div className="price w-100" style={{ display: "none" }}>
                            {x?.price > 0 && `Starting at`}

                            {x?.offerPrice > 0 && (<span
                              style={{ textDecoration: x?.price > 0 ? 'line-through' : 'none', marginRight: '.6rem' }}>

                              {x?.offerPrice + " "}
                            </span>)}
                            {x?.price > 0 && (<span>
                              {convertedCurrency + " " + convertedPrice + ""}
                            </span>)}
                            /-* per person

                          </div>
                        </div>

                        <div className="" style={{
                          position: "absolute",
                          bottom: "12px",
                          left: "0",
                          right: "0",
                          height: "26px"
                        }}>
                          <Link
                            to={"/details/deals/" + x?.specialPromotionID}
                            className="btn-booknow"
                          >
                            BOOK NOW
                          </Link>
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
                {cmsContents.dealsContent.length > 4 && (
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

export default CMSDeals;
