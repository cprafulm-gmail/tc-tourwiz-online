import React from "react";

const FilterCurrency = props => {
  const name = props.name;
  const items = props.values;

  return (
    <div className="filter-section filter-Currency">
      <h2>{name}</h2>
      <ul>
        <li>
          <select className="ComboBox" defaultValue="SAR">
            {items.map(item => {
              return (
                <option
                  key={item}
                  value={item}
                  onClick={() => props.handleFilters(name, item)}
                >
                  {item}
                </option>
              );
            })}
          </select>
        </li>
      </ul>
    </div>
  );
};

export default FilterCurrency;
