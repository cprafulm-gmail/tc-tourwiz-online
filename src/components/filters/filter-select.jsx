import React from "react";
import { Trans } from "../../helpers/translate";

const FilterSelect = props => {
  const { name, defaultValue, values: items } = props;

  const handleSelect = e => {
    props.handleFilters(name, e.target.value);
  };

  return (
    <div className="col-lg-12 col-sm-6 filter-currency">
      <div className="border-bottom mb-3">
        <h3>{Trans("_filter" + name)}</h3>
        <ul className="list-unstyled">
          <li>
            <select
              className="form-control"
              defaultValue={defaultValue}
              onChange={handleSelect}
            >
              {items.map((item, key) => {
                return (
                  <option key={key} value={item}>
                    {Trans(
                      "_filter" +
                      props.businessName +
                      name.toLowerCase() +
                      item
                    ) !==
                      "_filter" +
                      props.businessName +
                      name.toLowerCase() +
                      item
                      ? Trans(
                        "_filter" +
                        props.businessName +
                        name.toLowerCase() +
                        item
                      )
                      : item}
                  </option>
                );
              })}
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FilterSelect;
