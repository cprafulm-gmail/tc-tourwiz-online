import React from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import UserIconImg from "../../assets/images/dashboard/user.jpg";
import OndGoTravelsIndore from "../../assets/images/dashboard/ond-go-travels-indore.png";
import RegentTravelsMumbai from "../../assets/images/dashboard/regent-travels-mumbai.png"
import JaanviHolidaysPune from "../../assets/images/dashboard/jaanvi-holidays-pune.png";
import FlyInSkyBangalore from "../../assets/images/dashboard/fly-in-sky-bangalore.png";
import EnjoyDaysHoliday from "../../assets/images/dashboard/enjoy-days-holiday-surat.png";
import BestourTravelsBang from "../../assets/images/dashboard/bestour-travels-bang.png";
import AllianceVacations from "../../assets/images/dashboard/alliance-vacations-indore.png";
import UniversalAirTravel from "../../assets/images/dashboard/universal-air-travel-and-tours-bang.png";
import TourismEnterprisesMumbai from "../../assets/images/dashboard/tourism-enterprises-mumbai.png";
import SunskyHolidaysMumbai from "../../assets/images/dashboard/sunsky-holidays-mumbai.png";
import NextHolidayTestimonial from "../../assets/images/dashboard/NextHolidayTestimonial.png";
import { Trans } from "../../helpers/translate";

const HomePageTestimonial = (props) => {
  const params = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    loop: true,
    breakpoints: {
      1024: {
        slidesPerView: 3,
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
    document.querySelector('.swiper-button-next').click();
  };

  const goPrev = () => {
    document.querySelector('.swiper-button-prev').click();
  };

  return (

    <div className="tw-testimonial mt-5 mb-5">
      <div className="container" style={{ position: "relative" }}>
        <div className="row">
          <div className="col-lg-12">
            <h2>Testimonials</h2>
          </div>
        </div>

        <div className="row">
          <Swiper {...params}>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={OndGoTravelsIndore} alt="Ondgo Travels" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Mandeep Duggal</span></div>
                    <div className="col-lg-12 p-0"><span>Ondgo Travels, Indore.</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    The thing I love about TourWiz is they provide CRM and accounting all in one package. Also, The system captures data with just one click making it stand out from other solutions available in the market today.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={NextHolidayTestimonial} alt="Next Holiday" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  {/* <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Sandeep Shah</span></div>
                    <div className="col-lg-12 p-0"><span>Next Holiday, Mumbai.</span></div>
                  </div> */}
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    Tourwiz is very good platform for travel agents for making itinerary and holiday packages. It easy to understand and fast too. Very useful for daily use.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={TourismEnterprisesMumbai} alt="Tourism Enterprises" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Siddhesh</span></div>
                    <div className="col-lg-12 p-0"><span>Tourism Enterprises, Mumbai.</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    The accounting & reconciliation is the feature I find very useful and keeping track of suppliers using the supplier reconciliation is also the thing that makes TourWiz better from the other solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={FlyInSkyBangalore} alt="Fly in sky" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Mohamed Rafi</span></div>
                    <div className="col-lg-12 p-0"><span>Fly in sky, Bangalore</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz is fantastic to work with from start to finish. It is a great tool to manage suppliers and to perform accounting . TourWiz is a unique solution present in the current market as it provides so many features all in one single place.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={JaanviHolidaysPune} alt="Jaanvi Holidays" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Vinod</span></div>
                    <div className="col-lg-12 p-0"><span>Jaanvi Holidays, Pune</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz provides a support tool that helps travel agents manage their business online. For me it has helped to leverage my customers with help of the Customer Portal Feature that makes their software great.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={EnjoyDaysHoliday} alt="ENJOY DAYS HOLIDAYS" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Venkatesh Mekala</span></div>
                    <div className="col-lg-12 p-0"><span>ENJOY DAYS HOLIDAYS, Surat</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz is very easy to use, takes little time to set up. Itineraries and {Trans("_quotationReplaceKeys")} are very easy to edit and are very easy for users to access. I like that I can copy previous Itineraries. A great tool.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 d-none" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={RegentTravelsMumbai} alt="Regent Travels" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Rupal Kunkawlekar</span></div>
                    <div className="col-lg-12 p-0"><span>Regent Travels, Mumbai</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz is a business accelerator that allows professionals to manage their business online.It is very very user friendly and easy to learn. They have built a great tool and I am really satisfied with using it.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={AllianceVacations} alt="Alliance Vacations" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Himanshu Rajak</span></div>
                    <div className="col-lg-12 p-0"><span>Alliance Vacations, Indore</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz is very easy to use, it takes little time to set up. Itineraries and {Trans("_quotationReplaceKeys")} are very easy to edit and also importing your old data can be done with one single click.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={SunskyHolidaysMumbai} alt="Sunsky Holidayz" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Rajendra Bobade</span></div>
                    <div className="col-lg-12 p-0"><span>Sunsky Holidayz, Mumbai</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    TourWiz has provided me with a great support system.It has helped me to manage the business online from any place in the world.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={UniversalAirTravel} alt="Universal air travel and tours" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv ">
                    <div className="col-lg-12 p-0"><span className="username">Shaik Uzair Ahmed</span></div>
                    <div className="col-lg-12 p-0"><span>Universal air travel and tours, Bangalore </span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    I used to spend countless hours making {Trans("_quotationReplaceKeys")} and doing accounting .When I stumbled on TourWiz I couldn’t believe it! In 10 minutes I had it set up and have been raving about it ever since.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3" style={{ boxSizing: "border-box" }}>
              <div className="tw-testimonial-box">
                <div className="testimonialLogo col-lg-12 p-0">
                  <img src={BestourTravelsBang} alt="Bestour Travels" />
                  <hr className="m-0" />
                </div>
                <div className="row  testimonialTitle w-100">
                  {/* <div className="col-lg-2 p-0 imgDiv"><img src={UserIconImg} /></div>  */}
                  <div className="col-lg-12 p-0 contentDiv">
                    <div className="col-lg-12 p-0"><span className="username">Amol Chilwant</span></div>
                    <div className="col-lg-12 p-0"><span>Anmol Holidays, Pune</span></div>
                  </div>
                </div>
                <div className="col-lg-12 p-0 testimonialContent">
                  <p>
                    I found TourWiz very user friendly and the convenience that TourWiz provides is very impressive. I am able to access the required data from any place on any device you just log in and you are good to go.
                  </p>
                </div>
              </div>
            </div>
          </Swiper>
        </div>
        <div className="swiper-button-prev-custom" onClick={goPrev}></div>
        <div className="swiper-button-next-custom" onClick={goNext}></div>
      </div>
    </div>
  );
};

export default HomePageTestimonial;