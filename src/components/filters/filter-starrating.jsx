import React from "react";
import StarRating from "../common/star-rating";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const FilterStarRating = props => {
  const name = props.name;
  const items = props.values;

  return (
    <React.Fragment>
      {items.length > 1 ? (
        <div className={"col-lg-12 col-sm-6 filter-" + name}>
          <div className="border-bottom mb-3">
            <h3>{Trans("_filter" + name)}</h3>
            <ul className="list-unstyled">
              {items.map(item => {
                return item !== "" ? (
                  <li key={item}>
                    <div className="custom-control custom-checkbox m-0">
                      <input
                        className="custom-control-input"
                        type="checkbox"
                        id={item}
                        value={item}
                        name={item}
                      />
                      <label
                        name={item}
                        htmlFor={item}
                        title={item}
                        onClick={() => props.handleFilters(name, item)}
                        className="custom-control-label text-capitalize"
                      >
                        <span className="star-rating">
                          {item === "0" ? (
                            <SVGIcon name="star" width="14" height="14" className="text-primary"></SVGIcon>
                          ) : (
                              <StarRating {...[item]} />
                            )}
                        </span>
                      </label>
                    </div>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default FilterStarRating;
