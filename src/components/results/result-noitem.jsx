import React from "react";
import { Trans } from "../../helpers/translate";

const noItemsFound = () => {
  return (
    <div className="row align-items-center ">
      <div className="col-lg-6 pt-4 pb-3">
        <h5>{Trans("_noHotelsFound")}</h5>
      </div>
    </div>
  );
};

export default noItemsFound;
