import React, { lazy, Suspense, useContext } from "react";
import { StickyContainer, Sticky } from "react-sticky";
import "../../assets/css/cp-template-1.css";
import Config from "../../config.json";
import { CMSContext } from "./cms-context";
const CMSLocations = React.lazy(() => import('../../components/cms/cms-locations'));
const CMSNewsLetter = React.lazy(() => import('../../components/cms/cms-newsletter'));
const CMSHome = (props) => {
  const {
    cmsState,
    cmsProps
  } = useContext(CMSContext);
  const getLoaderContent = () => {
    return <div className="row p-3">
      <div className="container ">
        {/* <Loader /> */}
      </div>
    </div>
  };

  var { cmsSettings, cmsContents, ipCurrencyCode } = cmsState;
  let componentFooter = null;
  let componentDelasPackages = null;
  if (cmsSettings === undefined || cmsSettings.themeName === "AF-010") {
    var CMSSlider10 = lazy(() => import('../../components/cms/cms-slider'));
    var CMSFooter10 = lazy(() => import('../../components/cms/cms-footer'));
    var CMSDeals10 = lazy(() => import('../../components/cms/cms-deals'));
    var CMSPackages10 = lazy(() => import('../../components/cms/cms-packages'));
    var CMSWhyus10 = lazy(() => import('../../components/cms/cms-whyus'));
    var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));
    componentDelasPackages = //<StickyContainer>
      <Suspense fallback={getLoaderContent}>

        <CMSSlider10 />
        {/* <Sticky topOffset={400}>
        {({ style }) => (
          <div
            className={
              "hight-z-index mod-search-area"
            }
            style={{ ...style, transform: "inherit" }}> */}
        <CMSWhyus10 />
        {/* </div>
        )}
      </Sticky> */}
        <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />
        <CMSDeals10 />
        <CMSPackages10 />
        <CMSLocations />
        <CMSNewsLetter />
        <CMSFooter10 />
      </Suspense>
    // </StickyContainer>;

  } else if (cmsSettings.themeName === "AF-002") {
    var CMSSlider2 = lazy(() => import('../../components/cms/AF-002/cms-slider'));
    var CMSFooter2 = lazy(() => import('../../components/cms/AF-002/cms-footer'));
    var CMSDeals2 = lazy(() => import('../../components/cms/AF-002/cms-deals'));
    var CMSPackages2 = lazy(() => import('../../components/cms/AF-002/cms-packages'));
    var CMSWhyus2 = lazy(() => import('../../components/cms/cms-whyus'));
    var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));
    componentDelasPackages = <Suspense fallback={getLoaderContent}>
      <CMSSlider2 />
      <CMSDeals2 />
      <CMSWhyus2 />
      <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />
      <CMSPackages2 />
      <CMSLocations />
      <CMSNewsLetter />
      <CMSFooter2 />
    </Suspense>;
  } else if (cmsSettings.themeName === "AF-003") {
    var CMSSlider3 = lazy(() => import('../../components/cms/AF-003/cms-slider'));
    var CMSFooter3 = lazy(() => import('../../components/cms/AF-003/cms-footer'));
    var CMSDeals3 = lazy(() => import('../../components/cms/AF-003/cms-deals'));
    var CMSPackages3 = lazy(() => Config.codebaseType === "tourwiz-marketplace" ? import('../../components/cms/AF-003/cms-packages-marketplace') : import('../../components/cms/AF-003/cms-packages'));
    var CMSWhyus3 = lazy(() => import('../../components/cms/cms-whyus'));
    var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));
    componentDelasPackages = <Suspense fallback={getLoaderContent}>
      <CMSSlider3 />
      <CMSWhyus3 />
      <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />
      {Config.codebaseType !== "tourwiz-marketplace" && <CMSDeals3 />}
      <CMSPackages3 />
      {Config.codebaseType !== "tourwiz-marketplace" && <CMSLocations />}
      {Config.codebaseType !== "tourwiz-marketplace" && <CMSNewsLetter />}
      <CMSFooter3 />
    </Suspense>;
  } else if (cmsSettings.themeName === "AF-001") {
    var CMSSlider1 = lazy(() => import('../../components/cms/AF-001/cms-slider'));
    var CMSFooter1 = lazy(() => import('../../components/cms/AF-001/cms-footer'));
    var CMSDeals1 = lazy(() => import('../../components/cms/AF-001/cms-deals'));
    var CMSPackages1 = lazy(() => import('../../components/cms/AF-001/cms-packages'));
    var CMSWhyus1 = lazy(() => import('../../components/cms/cms-whyus'));
    var CMSNewsLetter1 = React.lazy(() => import('../../components/cms/AF-001/cms-newsletter'));
    var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));
    componentDelasPackages = <Suspense fallback={getLoaderContent}>
      <CMSSlider1 />
      <CMSWhyus1 />
      <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />
      <CMSDeals1 />
      <CMSPackages1 />
      <CMSNewsLetter1 />
      <CMSFooter1 />
    </Suspense>;
  } else if (cmsSettings.themeName === "AF-005") {
    var CMSSlider2 = lazy(() => import('../../components/cms/AF-005/cms-slider'));
    var CMSFooter2 = lazy(() => import('../../components/cms/AF-005/cms-footer'));
    var CMSDeals2 = lazy(() => import('../../components/cms/AF-005/cms-deals'));
    var CMSLastMinuteDeals = lazy(() => import('../../components/cms/AF-005/cms-lastminute-deals'));
    var CMSPackages2 = lazy(() => import('../../components/cms/AF-005/cms-packages'));
    var CMSBookCount = lazy(() => import('../../components/cms/AF-005/cms-booking-count'));
    var CMSWhyus2 = lazy(() => import('../../components/cms/AF-005/cms-whyus'));
    var CMSLocations2 = lazy(() => import('../../components/cms/AF-005/cms-locations'));
    var CMSVideo = lazy(() => import('../../components/cms/AF-005/cms-video'));
    var CMSTestimonials = lazy(() => import('../../components/cms/AF-005/cms-testimonials'));
    var CMSCopyrights = lazy(() => import('../../components/cms/AF-005/cms-copywrite'))
    var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));
    componentDelasPackages = <Suspense fallback={getLoaderContent}>
      <CMSSlider2 />
      <CMSWhyus2 />
      <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />
      <CMSDeals2 />
      <CMSPackages2 />
      <CMSLocations2 />
      <CMSLastMinuteDeals />
      <CMSBookCount />
      <CMSVideo />
      <CMSTestimonials Title="TESTIMONIALS" SubTitle="CLIENT" />
      {/* <CMSPackages2 /> */}
      {/* <CMSNewsLetter /> */}
      {/* <CMSFooter2 /> */}
      <CMSCopyrights />
    </Suspense>;
  }
  const css = `
    .AF-003.cm-pages div.cp-header {
      background: none !important;
      box-shadow: none !important;    
      border: none !important;
    }`;
  return (
    <div className="cm-pages">
      <style>{css}</style>
      {componentDelasPackages}
    </div>
  );
}

export default CMSHome;