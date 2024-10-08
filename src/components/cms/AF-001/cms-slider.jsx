import React, { useContext } from "react";
import Slider1 from "../../../assets/images/customer-portal/template-images/template-1-slide-image.jpg";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import { useState } from "react";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSSlider = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents, imageSliderContent } = cmsState;

  const [state, setState] = useState({
    activeTab: "SPECIALPACKAGES",
  });

  const handleTabs = (activeTab) => {

    // scrollRef.current.scrollIntoView({ behavior: "smooth" })
    setState({ ...state, activeTab });
  };
  const SCSS = `
  span.sectionTabs.active 
  {
    font-weight: 500;
    height: 58px;
    padding-top: 15px;
    margin: -5px 0px;
    background: #f9676b !important;
    box-shadow: 0 1px 10px black;
    color: #fff !important;
  }
  span.sectionTabs 
  {
    cursor: pointer !important;
    width: 240px;
    background: #fff !important;
    color: #000 !important;
  }
  .AF-001 .cp-home-slider .btn.sectionTabs:hover {
    background: #fff !important;
}
.AF-001 .cp-home-slider .btn.sectionTabs.active:hover {
  background: #f9676b !important;
  color: #fff !important;
}
  `
  let imgSlider = cmsContents.sliderContent.length > 0 ? cmsContents.sliderContent[0].imagePath : Slider1
  return (
    <div className="container">
      <div className="row d-flex align-items-center justify-content-center">
        <div className="cp-home-slider">
          <div className="d-flex align-items-end justify-content-center">
            {/* <div className="text-center">
              <HtmlParser text={decode(imageSliderContent)} />
              <Link className="btn btn-lg btn-primary mt-4 shadow" to="/login">
                Sign In
              </Link>
            </div> */}


            <div className="text-center mb-5 rounded-0 border-0 bg-white">
              <style>{SCSS}</style>
              {/* <HtmlParser text={decode(imageSliderContent)} /> */}

              <Link
                className="boxx"
                activeClass="active"
                href="#"
                to="cp-home-packages"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                style={{ color: "#000" }}
                onClick={() => handleTabs("SPECIALPACKAGES")}
              >
                <span className={state.activeTab === "SPECIALPACKAGES" ? "sectionTabs align-items-center justify-content-center btn btn-lg ml-3 btn-primary border-0 rounded-0 cursor-pointer  active" : "sectionTabs align-items-center justify-content-center btn btn-lg ml-3 btn-primary border-0 rounded-0 cursor-pointer "}>
                  SPECIAL PACKAGES
                </span>
              </Link>
              <Link
                activeClass="active"
                href="#"
                to="cp-home-deals"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                style={{ color: "#000" }}
                onClick={() => handleTabs("POPULARDEALS")}
              >
                <span className={state.activeTab === "POPULARDEALS" ? "sectionTabs align-items-center justify-content-center btn btn-lg mr-3 ml-3 btn-primary border-0 rounded-0 cursor-pointer  active" : "sectionTabs align-items-center justify-content-center btn btn-lg mr-3 ml-3 btn-primary border-0 rounded-0 cursor-pointer "}>
                  POPULAR DEALS
                </span>
              </Link>
            </div>
          </div>
          <img src={imgSlider} alt="" />
        </div>
      </div>
    </div >
  );
};

export default CMSSlider;
