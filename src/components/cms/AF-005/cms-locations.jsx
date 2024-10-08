import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import SVGIcon from "../../../helpers/svg-icon";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSLocations = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  let imageURL = process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + cmsSettings?.portalID + "/LocationsGuide/images/";

  const params = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    loop: true,
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
        spaceBetween: 10
      }
    }
  }
  const goNext = () => {
    document.querySelector('.swiper-button-next').click();
  };

  const goPrev = () => {
    document.querySelector('.swiper-button-prev').click();
  };

  return (
    <div className="cp-home-locations">
      <div className="container" style={{ position: "relative" }}>
        <p className="deals-sub-title">NOW Popular</p>
        <h2 className="deals-title">Destinations</h2>
        <div className="rows">
          <Swiper {...params}>
            {cmsContents.topLocationsContents &&
              cmsContents.topLocationsContents.map(
                (x, key) => (
                  <div
                    key={key}
                    className="location-item"
                    style={{ boxSizing: "border-box", height: "auto" }}
                    title={x?.locationTitle}
                  >
                    <Link to={"/details/locations/" + x?.locationID}>
                      <div className="location-item-image overflow-hidden" style={{ background: "linear-gradient(176deg, rgb(234, 238, 238) 0px, rgb(245, 191, 36))", borderRadius: "0.7rem" }}>
                        <img
                          class="img-fluid"
                          src={x?.locationImage.indexOf(".s3.") > 0 ? x?.locationImage : imageURL + x?.locationImage}
                          alt={x?.locationTitle}
                        />
                      </div>
                      <h5 className="location-item-tittle position-relative" title={x?.locationTitle}>
                        {x?.locationTitle.length > 15 ? x?.locationTitle.substring(0, 15) + "..." : x?.locationTitle}
                      </h5>
                    </Link>
                  </div>
                )
              )}
          </Swiper>
        </div>
        <div className="row">
          <div className="col-lg-12 pt-4 mt-4">
            <div className="swiper-button-prev-custom" onClick={goPrev}>
              <SVGIcon name="chevron-left" width="28" height="28" className="fa-2x text-dark swipper-navigation-prev"></SVGIcon>

            </div>
            <div className="swiper-button-next-custom" onClick={goNext}>
              <SVGIcon name="chevron-right" width="28" height="28" className="fa-2x text-dark swipper-navigation-next"></SVGIcon></div>
            <div className="d-flex align-items-center justify-content-center mt-2 h-100 ">

              <Link to={"/list/locations"} className="btn-showmore" style={{ display: "none" }}>
                SHOW MORE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSLocations;
