import React from "react";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";

const RulesRegulations = (props) => {
  const rulesAndRegulations =
    props.tpExtension.find((x) => x.key === "rulesAndRegulations") &&
    props.tpExtension.find((x) => x.key === "rulesAndRegulations").value;

  return (
    <React.Fragment>
      {rulesAndRegulations && (
        <div className="policies row mb-4 termsConditions">
          <div className="col-12 ">
            <h4 className="font-weight-bold">{Trans("_termsAndConditions")}</h4>
            <HtmlParser text={rulesAndRegulations} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default RulesRegulations;
