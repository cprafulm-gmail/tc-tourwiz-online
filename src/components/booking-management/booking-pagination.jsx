import React from "react";
import { Trans } from "../../helpers/translate";

const BookingPagination = (props) => {
  const {
    currentPage,
    hasPreviousPage,
    hasNextPage,
    totalResults,
    pageLength,
  } = props.pageInfoIndex[0].item;
  let recordPerPage = [10, 20, 30, 50, 100];
  if(props.mode === "card") {
    recordPerPage = [9, 18, 27, 45, 90];
  }
  const totalPages =
    parseInt(totalResults / pageLength) + (totalResults % pageLength === 0 ? 0 : 1);

  return (
    <nav className="d-flex justify-content-between mt-3">
      <div className="d-flex text-secondary">
        {Trans("_grid_paging_totalRecord")}: <b className="text-primary ml-2">{totalResults}</b>
      </div>

      <div className="d-flex text-secondary">
        {Trans("_grid_paging_recordsPerPage")}
        <select
          className="form-control form-control form-control-sm ml-2"
          style={{ width: "auto" }}
          onChange={(e) => props.handlePaginationResults(0, e.target.value)}
          defaultValue={pageLength}
        >
          {recordPerPage.map((option) => {
            return (
              <option value={option} key={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>

      <div className="d-flex text-secondary">
        {Trans("_grid_paging_gotoPage")}{" "}
        <select
          className="form-control form-control form-control-sm ml-2"
          style={{ width: "auto" }}
          onChange={(e) => props.handlePaginationResults(e.target.value, pageLength)}
          defaultValue={currentPage}
        >
          {[...Array(totalPages).keys()].map((option) => {
            return (
              <option value={option} key={option}>
                {option + 1}
              </option>
            );
          })}
        </select>
      </div>

      <ul className="pagination p-0 m-0">
        <li className={hasPreviousPage ? "page-item" : "page-item disabled"}>
          <button
            className="page-link"
            onClick={() => props.handlePaginationResults(currentPage - 1, pageLength)}
          >
            {Trans("_grid_paging_previous")}
          </button>
        </li>
        <li className="page-item">
          <span className="page-link text-secondary bg-light">
            {Trans("_grid_paging_page")} {currentPage + 1} {Trans("_grid_paging_of")} {totalPages}
          </span>
        </li>
        <li className={hasNextPage ? "page-item" : "page-item disabled"}>
          <button
            className="page-link"
            onClick={() => props.handlePaginationResults(currentPage + 1, pageLength)}
          >
            {Trans("_grid_paging_next")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BookingPagination;
