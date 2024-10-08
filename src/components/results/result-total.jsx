import React from "react";
import { Trans } from "../../helpers/translate";

const TotalItems = (props) => {
  let code = "default";
  const itemCount =
    props.pageInfoIndex !== undefined && props.pageInfoIndex.find((x) => x.code === code) !== undefined
      ? props.pageInfoIndex.find((x) => x.code === code).item.filteredResults
      : null;
  return (
    props.pageInfoIndex !== undefined && props.pageInfoIndex.find((x) => x.code === code) !== undefined && (
      <h5>
        <span>{itemCount}</span> <b>{Trans("_title" + props.businessName)}</b>{" "}
        {Trans("_foundMatchingYourSearch")}
      </h5>
    )
  );
};

export default TotalItems;
