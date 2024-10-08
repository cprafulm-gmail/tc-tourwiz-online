import React, { useContext } from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import UserIconImg from "../../../assets/images/dashboard/user.jpg";
import SVGIcon from "../../../helpers/svg-icon";
import OndGoTravelsIndore from "../../../assets/images/customer-portal/template-images/userImg.png";
import RegentTravelsMumbai from "../../../assets/images/dashboard/regent-travels-mumbai.png";
import JaanviHolidaysPune from "../../../assets/images/dashboard/jaanvi-holidays-pune.png";
import FlyInSkyBangalore from "../../../assets/images/dashboard/fly-in-sky-bangalore.png";
import EnjoyDaysHoliday from "../../../assets/images/dashboard/enjoy-days-holiday-surat.png";
import BestourTravelsBang from "../../../assets/images/dashboard/bestour-travels-bang.png";
import AllianceVacations from "../../../assets/images/dashboard/alliance-vacations-indore.png";
import UniversalAirTravel from "../../../assets/images/dashboard/universal-air-travel-and-tours-bang.png";
import TourismEnterprisesMumbai from "../../../assets/images/dashboard/tourism-enterprises-mumbai.png";
import SunskyHolidaysMumbai from "../../../assets/images/dashboard/sunsky-holidays-mumbai.png";
import { cmsConfig } from "../../../helpers/cms-config";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSTestimonial = ({ Title, SubTitle }) => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const params = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev"
    // },
    loop: true,
    breakpoints: {
      1024: {
        slidesPerView: Title === "TESTIMONIALS" ? 2 : 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: Title === "TESTIMONIALS" ? 2 : 3,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };
  const goNext = () => {
    document.querySelector(".swiper-button-next").click();
  };

  const goPrev = () => {
    document.querySelector(".swiper-button-prev").click();
  };
  const sadsa = decode((cmsContents.testimonialContents && cmsContents.testimonialContents[0]?.desktopHtml) || "");

  const doc = new DOMParser().parseFromString(sadsa, "text/html");
  const HTMLArray = [...doc.body.children].map(el => el.outerHTML);
  return (
    cmsContents.testimonialContents !== undefined &&
    cmsContents.testimonialContents !== "" &&
    cmsContents.testimonialContents.length > 0 && (
      <div className="cp-home-testimonial">
        <div className="container" style={{ position: "relative" }}>
          <div className="row">
            <div className=" col-lg-12 p-0">
              <div className=" col-lg-3 pull-right testimonial-heading">
                <p className="testimonial-sub-title">{SubTitle}</p>
                <h2 className="testimonial-title">{Title}</h2>
              </div>
              <div className="offset-lg-1 pull-right col-lg-8 testimonial-items">
                <Swiper {...params}>
                  {HTMLArray.map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="p-3 bg-white mb-5 mt-3 shadaow h-100"
                        style={{
                          boxSizing: "border-box",
                          boxShadow: "2px -3px 7px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <HtmlParser text={item} />
                      </div>
                    );
                  })}
                  {/* <div className="p-3 bg-white mb-5 mt-3 shadow" style={{ boxSizing: "border-box" }}>
                  <div className="tw-testimonial-box">
                    <div className="col-lg-12 ml-0 p-0 testimonialContent">
                      <p>
                        The thing I love about TourWiz is they provide CRM and accounting all in one package. </p>
                      <p> Also, The system captures data with just one click making it stand out from other solutions available in the market today.
                      </p>
                    </div>
                    <div className="row mt-5 text-right testimonialTitle w-100">
                      <div className="col-lg-10 p-0 contentDiv">
                        <div className="col-lg-12 p-0"><span className="username">Mandeep Duggal</span></div>
                        <div className="col-lg-12 p-0"><span>Ondgo Travels, Indore.</span></div>
                      </div>
                      <div className="col-lg-2 p-0 imgDiv"><img style={{ width: "90%" }} src={OndGoTravelsIndore} /></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white mb-5 mt-3 shadow" style={{ boxSizing: "border-box" }}>
                  <div className="tw-testimonial-box">
                    <div className="col-lg-12 ml-0 p-0 testimonialContent">
                      <p>
                        The thing I love about TourWiz is they provide CRM and accounting all in one package. </p>
                      <p> Also, The system captures data with just one click making it stand out from other solutions available in the market today.
                      </p>
                    </div>
                    <div className="row mt-5 text-right testimonialTitle w-100">
                      <div className="col-lg-10 p-0 contentDiv">
                        <div className="col-lg-12 p-0"><span className="username">Mandeep Duggal</span></div>
                        <div className="col-lg-12 p-0"><span>Ondgo Travels, Indore.</span></div>
                      </div>
                      <div className="col-lg-2 p-0 imgDiv"><img style={{ width: "90%" }} src={OndGoTravelsIndore} /></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white mb-5 mt-3 shadow" style={{ boxSizing: "border-box" }}>
                  <div className="tw-testimonial-box">
                    <div className="col-lg-12 ml-0 p-0 testimonialContent">
                      <p>
                        The thing I love about TourWiz is they provide CRM and accounting all in one package. </p>
                      <p> Also, The system captures data with just one click making it stand out from other solutions available in the market today.
                      </p>
                    </div>
                    <div className="row mt-5 text-right testimonialTitle w-100">
                      <div className="col-lg-10 p-0 contentDiv">
                        <div className="col-lg-12 p-0"><span className="username">Mandeep Duggal</span></div>
                        <div className="col-lg-12 p-0"><span>Ondgo Travels, Indore.</span></div>
                      </div>
                      <div className="col-lg-2 p-0 imgDiv"><img style={{ width: "90%" }} src={OndGoTravelsIndore} /></div>
                    </div>
                  </div>
                </div> */}
                </Swiper>
              </div>
            </div>
          </div>
          {/* <div className="swiper-button-prev-custom" onClick={goPrev}></div>
        <div className="swiper-button-next-custom" onClick={goNext}></div> */}
        </div>
      </div>
    )
  );
};

export default CMSTestimonial;
