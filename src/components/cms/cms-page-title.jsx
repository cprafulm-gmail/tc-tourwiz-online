import React, { memo } from "react";
import SVGIcon from "../../helpers/svg-icon";
import { Helmet } from "react-helmet";
const CMSPageTitle = memo(({ icon, title }) => {
  return (
    <div className="title-bg pt-3 pb-3 mb-3">
      <Helmet>
        <title>
          {title || "Page Title"} - Inquiry
        </title>
      </Helmet>
      <div className="container">
        <h1 className="text-white m-0 p-0 f30">
          <SVGIcon
            name={icon || "user-friends"}
            width="24"
            height="24"
            className="mr-3"
          ></SVGIcon>
          {title || "Page Title"}
        </h1>
      </div>
    </div>
  );
});

export default CMSPageTitle;
