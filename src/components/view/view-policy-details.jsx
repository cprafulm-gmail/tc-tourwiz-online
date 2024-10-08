import React from "react";
import { Trans } from "../../helpers/translate";

const ViewPolicyDetails = (props) => {
  return (
    props.businessObject.policies.length > 0 &&
    props.businessObject.policies[0].description !== "" && (
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="m-0 p-0">{Trans("_viewPolicyDetails")}</h5>
        </div>
        <div className="card-body">
          <ul className="p-0 m-0 ml-3">
            {props.businessObject.policies.map(function (item, key) {
              if (item.description === "") {
                return "";
              } else {
                return (
                  <li key={key} className="mb-2">
                    {(props.businessObject.business === "activity" ||
                      props.businessObject.business === "package") && (
                      <b>{item.name} : </b>
                    )}
                    {item.description.replace(/(<([^>]+)>)/gi, "")}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    )
  );
};

export default ViewPolicyDetails;
