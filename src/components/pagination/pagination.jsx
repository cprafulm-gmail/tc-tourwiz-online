import React from "react";
import { Trans } from "../../helpers/translate";

const Pagination = props => {
  const {
    currentPage,
    hasPreviousPage,
    hasNextPage
  } = props.pageInfoIndex[0].item;

  return (
    <nav>
      <ul className="pagination justify-content-end">
        <li className={hasPreviousPage ? "page-item" : "page-item disabled"}>
          <button
            className="page-link"
            onClick={() => props.handlePaginationResults(currentPage - 1)}
          >
            {Trans("_previous")}
          </button>
        </li>
        <li className="page-item">
          <span className="page-link">{currentPage + 1}</span>
        </li>
        <li className={hasNextPage ? "page-item" : "page-item disabled"}>
          <button
            className="page-link"
            onClick={() => props.handlePaginationResults(currentPage + 1)}
          >
            {Trans("_next")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
