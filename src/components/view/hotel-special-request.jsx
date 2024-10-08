import React from "react";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";

const ViewSpecialRequest = props => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_specialRequest")}</h5>
      </div>
      <div className="card-body">
        <p className="p-0 m-0 ml-3">
          {<HtmlParser text={props.specialRequest} />}
        </p>
      </div>
    </div>
  );
};

export default ViewSpecialRequest;
