import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const Sorting = (props) => {
  let code = "default";

  const availableSortingIndex =
    props.availableSortingIndex !== undefined && props.availableSortingIndex.find((x) => x.code === code) !== undefined
      ? props.availableSortingIndex.find((x) => x.code === code).item
      : [];

  const appliedSortingIndex =
    props.appliedSortingIndex !== undefined && props.appliedSortingIndex.find((x) => x.code === code) !== undefined
      ? props.appliedSortingIndex.find((x) => x.code === code).item
      : [];

  const sortResults = (sortBy) => {
    sortBy.name === appliedSortingIndex.name
      ? appliedSortingIndex.order === -1
        ? (sortBy.order = 1)
        : (sortBy.order = -1)
      : sortBy.order === 0
      ? (sortBy.order = 1)
      : (sortBy.order = -1);

    props.handleSorting(sortBy);
  };
  const itemCount =
    props.pageInfoIndex !== undefined && props.pageInfoIndex.find((x) => x.code === code) !== undefined
      ? props.pageInfoIndex.find((x) => x.code === code).item.filteredResults
      : null;
  
  return (
    itemCount > 0 && (
      <div className="result-sorting d-inline-block">
        <b className="d-inline-block font-weight-normal">{Trans("_sortBy")} :</b>
        <ul className="list-unstyled d-inline-block m-0 p-0">
          {props.isfromTourwiz !== undefined && availableSortingIndex.filter(x=>x.name !=="rate").map((item) => {
              const classes =
                item.name === appliedSortingIndex.name
                  ? appliedSortingIndex.order === -1
                    ? "active"
                    : "active asc"
                  : "";
  
              return (
                <li key={item.name} className="d-inline-block ml-2">
                  <button
                    name={item.name}
                    className={classes + " btn btn-outline-secondary border"}
                    onClick={() => sortResults(item)}
                  >
                    {Trans("_sort" + item.name)}
                    <SVGIcon
                      name={classes === "active asc" ? "caret-up" : "caret-down"}
                      className="ml-2"
                      type="fill"
                    ></SVGIcon>
                  </button>
                </li>
              );
            })
          }

          {!props.isfromTourwiz && 
            availableSortingIndex.map((item) => {
              const classes =
                item.name === appliedSortingIndex.name
                  ? appliedSortingIndex.order === -1
                    ? "active"
                    : "active asc"
                  : "";
  
              return (
                <li key={item.name} className="d-inline-block ml-2">
                  <button
                    name={item.name}
                    className={classes + " btn btn-outline-secondary border"}
                    onClick={() => sortResults(item)}
                  >
                    {Trans("_sort" + item.name)}
                    <SVGIcon
                      name={classes === "active asc" ? "caret-up" : "caret-down"}
                      className="ml-2"
                      type="fill"
                    ></SVGIcon>
                  </button>
                </li>
              );
            })
          }

        </ul>
      </div>
    )
  );
};

export default Sorting;
