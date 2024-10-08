import React from "react";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";

const ItineraryDetails = (props) => {
  const itineraryDetails =
    props.tpExtension.find((x) => x.key === "itenaryDetails") &&
    props.tpExtension.find((x) => x.key === "itenaryDetails").value;

  return (
    <React.Fragment>
      {itineraryDetails && (
        <div className="row mb-4 itenaryDetails">
          <div className="col-12 ">
            <h4 className="font-weight-bold">
              {Trans("_titleItineraryDetails")}
            </h4>
            <HtmlParser text={itineraryDetails} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ItineraryDetails;
