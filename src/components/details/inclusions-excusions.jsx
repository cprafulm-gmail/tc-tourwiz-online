import React from "react";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";

const InclusionsExcusions = (props) => {
  const inclusions =
    props.tpExtension.find((x) => x.key === "inclusions") &&
    props.tpExtension.find((x) => x.key === "inclusions").value;

  const exclusions =
    props.tpExtension.find((x) => x.key === "exclusions") &&
    props.tpExtension.find((x) => x.key === "exclusions").value;

  return (
    <React.Fragment>
      <div className="policies row mb-4 inclusionsexclusions">
        {inclusions && (
          <div className="col-6 ">
            <h4 className="font-weight-bold">{Trans("_titleInclusions")}</h4>
            <HtmlParser
              text={inclusions.replace("<![CDATA[", "").replace("]]>", "")}
            />
          </div>
        )}

        {!inclusions && props.business === "transfers" && (
          <div className="col-6 ">
            <h4 className="font-weight-bold">{Trans("_titleInclusions")}</h4>
            <HtmlParser
              text={Trans("_noinclusions")}
            />
          </div>
        )}

        {exclusions && (
          <div className="col-6">
            <h4 className="font-weight-bold">{Trans("_titleExclusions")}</h4>
            <HtmlParser
              text={exclusions.replace("<![CDATA[", "").replace("]]>", "")}
            />
          </div>
        )}

        {!exclusions && props.business === "transfers" && (
          <div className="col-6">
            <h4 className="font-weight-bold">{Trans("_titleExclusions")}</h4>
            <HtmlParser
              text={Trans("_noexclusions")}
            />
          </div>
        )}

      </div>
    </React.Fragment>
  );
};

export default InclusionsExcusions;
