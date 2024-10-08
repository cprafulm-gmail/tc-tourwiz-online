import React, { memo, useContext } from "react";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../screens/cms/cms-context";
import { Link } from "react-scroll";
import iconDeal from "../../assets/images/tw/ico-deal.png";
import iconDealActive from "../../assets/images/tw/ico-deal-hover.png";
import iconPackage from "../../assets/images/tw/ico-packages.png";
import iconPackageActive from "../../assets/images/tw/ico-packages-hover.png";
import { useState } from "react";
import { useRef } from "react";
import { StickyContainer, Sticky } from "react-sticky";

const CMSWhyus = memo(() => {
  const { cmsState: { cmsContents } } = useContext(CMSContext);
  const scss = `body .boxx:hover, body h5.font-weight-bold.text-center:hover {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
    transition: all .4s ease;
    -webkit-transition: all .4s ease;
}`;

  const scss1 = `body .cp-home-why-us-active {
  background-color: #6DB3F2;
  background-image: url('http://localhost:3000/static/media/bg-deals.352c74d1.png');
  background: url('http://localhost:3000/static/media/bg-deals.352c74d1.png') no-repeat right 50%; border-right: 0px solid transparent;
  color: #fdb40f;
  text-decoration: none !important;
}
`;
  return (
    <div className="cp-home-why-us">
      <div className="container">
        <HtmlParser text={decode(cmsContents.howItWorkContent[0] !== undefined ? cmsContents.howItWorkContent[0].desktopHtml : "")} />
      </div>
    </div>
  );
});

export default CMSWhyus;
