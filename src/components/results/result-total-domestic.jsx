import React from "react";
import { Trans } from "../../helpers/translate";

const TotalItemsDomestic = (props) => {
  let code = props.routeType;
  const itemCount =
    props.pageInfoIndex !== undefined
      ? props.pageInfoIndex.find((x) => x.code === code).item.filteredResults
      : null;
  return (
    props.pageInfoIndex !== undefined && (
      <h5 className="border-bottom pb-3" style={{ fontSize: "1.1rem" }}>
        <span>{itemCount}</span>
        <b className="text-primary">
          {(code === "departure" ? " Departure " : " Return ") +
            Trans("_title" + props.businessName)}
        </b>{" "}
        {Trans("_foundMatchingYourSearch")}
      </h5>
    )
  );
};

export default TotalItemsDomestic;
