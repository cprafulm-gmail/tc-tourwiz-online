import React from "react";
import { Trans } from "../../helpers/translate";

const LazyLoading = (props) => {
  let code = "default";
  const { currentPage, hasNextPage } =
    props.pageInfoIndex !== undefined && props.pageInfoIndex.find((x) => x.code === code) !== undefined ? props.pageInfoIndex.find((x) => x.code === code).item : [];

  return (
    props.pageInfoIndex !== undefined && (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={hasNextPage ? "page-item" : "page-item disabled d-none"}>
            <button
              className="page-link"
              onClick={() => props.handlePaginationResults(currentPage + 1)}
            >
              {Trans("_lazyLoadingShowMore")}
            </button>
          </li>
        </ul>
      </nav>
    )
  );
};

export default LazyLoading;
