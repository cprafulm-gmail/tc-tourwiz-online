import React, { lazy, Suspense, useContext, useCallback, useMemo, useState, useEffect, memo } from "react";
import "../../assets/css/cp-template-1.css";
import Config from "../../config.json";
import { CMSContext } from "./cms-context";


var CMSSlider10 = lazy(() => import('../../components/cms/cms-slider'));
var CMSFooter10 = lazy(() => import('../../components/cms/cms-footer'));
var CMSDeals10 = lazy(() => import('../../components/cms/cms-deals'));
var CMSPackages10 = lazy(() => import('../../components/cms/cms-packages'));
var MarketplacePackages = lazy(() => import('../../components/cms/AF-003/cms-packages-marketplace'));

var CMSSlider2 = lazy(() => import('../../components/cms/AF-002/cms-slider'));
var CMSFooter2 = lazy(() => import('../../components/cms/AF-002/cms-footer'));
var CMSDeals2 = lazy(() => import('../../components/cms/AF-002/cms-deals'));
var CMSPackages2 = lazy(() => import('../../components/cms/AF-002/cms-packages'));

var CMSSlider3 = lazy(() => import('../../components/cms/AF-003/cms-slider'));
var CMSFooter3 = lazy(() => import('../../components/cms/AF-003/cms-footer'));
var CMSDeals3 = lazy(() => import('../../components/cms/AF-003/cms-deals'));
var CMSPackages3 = lazy(() => import('../../components/cms/AF-003/cms-packages'));

var CMSSlider1 = lazy(() => import('../../components/cms/AF-001/cms-slider'));
var CMSFooter1 = lazy(() => import('../../components/cms/AF-001/cms-footer'));
var CMSDeals1 = lazy(() => import('../../components/cms/AF-001/cms-deals'));
var CMSPackages1 = lazy(() => import('../../components/cms/AF-001/cms-packages'));
var CMSNewsLetter1 = React.lazy(() => import('../../components/cms/AF-001/cms-newsletter'));

const CMSWhyus = lazy(() => import('../../components/cms/cms-whyus'));
const CMSLocations = lazy(() => import('../../components/cms/cms-locations'));
const CMSNewsLetter = lazy(() => import('../../components/cms/cms-newsletter'));

const CMSHome = memo((props) => {
  const { cmsState } = useContext(CMSContext);
  const { cmsSettings, cmsContents, ipCurrencyCode } = cmsState

  const getLoaderContent = useCallback(() => {
    return <div className="row p-3">
      <div className="container ">
        {/* <Loader /> */}
      </div>
    </div>
  }, []);
  debugger
  return (
    <>
      <Suspense fallback={getLoaderContent()}>

        {cmsSettings.themeName === "AF-010" && <CMSSlider10 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-010" && <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-010" && <CMSDeals10 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-010" && <CMSPackages10 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-010" && <CMSLocations cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-010" && <CMSNewsLetter cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-010" && <CMSFooter10 />}

        {/* Code to render CMSDeals1, CMSDeals2, CMSDeals3 based on cmsSettings */}
        {cmsSettings.themeName === "AF-003" && <CMSSlider3 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-003" && <CMSWhyus cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-003" && <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-003" && <CMSDeals3 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-003" && <CMSPackages3 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-003" && <CMSLocations cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-003" && <CMSNewsLetter cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-003" && <CMSFooter3 />}

        {/* Code to render CMSFooter1, CMSFooter2, CMSFooter3 based on cmsSettings */}
        {cmsSettings.themeName === "AF-002" && <CMSSlider2 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-002" && <CMSDeals2 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-002" && <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-002" && <CMSWhyus cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-002" && <CMSPackages2 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-002" && <CMSLocations cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-002" && <CMSNewsLetter cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-002" && <CMSFooter2 />}

        {/* Code to render CMSSlider1, CMSSlider2, CMSSlider3 based on cmsSettings */}
        {cmsSettings.themeName === "AF-001" && <CMSSlider1 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-001" && <CMSWhyus cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-001" && <MarketplacePackages cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />}
        {cmsSettings.themeName === "AF-001" && <CMSFooter1 />}
        {cmsSettings.themeName === "AF-001" && <CMSDeals1 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-001" && <CMSPackages1 cmsContents={cmsContents} />}
        {cmsSettings.themeName === "AF-001" && <CMSNewsLetter cmsContents={cmsContents} />}
        {/* {cmsSettings.themeName === "AF-001" && <CMSLocations cmsContents={cmsContents} ipCurrencyCode={ipCurrencyCode} />} */}
      </Suspense>
    </>
  );
});

export default CMSHome;