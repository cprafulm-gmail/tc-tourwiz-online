import React, { useCallback, useContext, useMemo } from "react";
import Slider1 from "../../assets/images/customer-portal/template-images/slider-1.png";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../screens/cms/cms-context";
import { useState } from "react";

const CMSSlider = () => {
  const { cmsState, cmsProps } = useContext(CMSContext);
  const { cmsSettings, cmsContents } = cmsState;
  const [state, setState] = useState({
    activeTab: "SPECIALPACKAGES",
  });

  const handleTabs = useCallback((activeTab) => {
    setState((prevState) => {
      if (prevState.activeTab !== activeTab) {
        return { ...prevState, activeTab };
      }
      return prevState;
    });
  }, []);

  const imgSlider = useMemo(() => {
    if (cmsContents.sliderContent.length > 0) {
      return cmsContents.sliderContent[0].imagePath.indexOf(".s3.") > 0
        ? cmsContents.sliderContent[0].imagePath
        : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT +
        cmsContents.response[0].portalID +
        "/InspireMe/images/" +
        cmsContents.sliderContent[0].imageName;
    } else {
      return Slider1;
    }
  }, [cmsContents]);

  const SCSS = `
  span.sectionTabs.active 
  {
    font-weight: 500;
    height: 58px;
    padding-top: 15px;
    margin: -5px 0px;
    background: rgb(241, 130, 71) !important;
    box-shadow: 0 1px 10px black;
    color: #fff !important;
  }
  span.sectionTabs 
  {
    cursor: pointer !important;
    width: 240px;
    color: rgb(241, 130, 71) !important;
  }
  span.sectionTabs:hoverrr 
  {
    font-weight: 500;
    height: 58px;
    padding-top: 15px;
    margin: -5px 0px;
    background: rgb(241, 130, 71) !important;
    box-shadow: 0 1px 10px black;
    color: #fff !important;
  }
  `;
  return (
    <div className="cp-home-slider">
      <style>{SCSS}</style>
      <div className="d-flex align-items-end justify-content-center">
        <div className="text-center mb-4 rounded-0 border-0 bg-white">
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
    </div >
  );
};

export default CMSSlider;
