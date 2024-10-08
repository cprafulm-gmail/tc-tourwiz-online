import React from "react";
import { Trans } from "../../helpers/translate";

const Policies = props => {
  const policies = props.policies !== undefined ? props.policies : [];
  return (
    <div className="policies row mb-4">
      <div className="col-12">
        <h4 className="font-weight-bold">{Trans("_titlePolicies")}</h4>
        <ul className="row list-unstyled mb-4">
          {policies.map((item, key) => {
            return (
              <li className="col-12 mt-1 mb-1" key={key}>
                {item.description}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Policies;
