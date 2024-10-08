import React, { useContext } from "react";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import { CMSContext } from "../../../screens/cms/cms-context";

const CMSWhyus = () => {
  const { cmsState } = useContext(CMSContext);
  const { cmsContents } = cmsState;
  return (
    <div className="cp-home-why-us">
      <div className="container">
        <HtmlParser text={decode(cmsContents.howItWorkContent[0] !== undefined ? cmsContents.howItWorkContent[0].desktopHtml : "")} />
      </div>
    </div>
  )
};

export default CMSWhyus;
