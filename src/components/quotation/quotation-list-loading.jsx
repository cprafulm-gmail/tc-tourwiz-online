import React from "react";

const QuotationListLoading = () => {
  const loading = [...Array(5).keys()];
  return (
    <React.Fragment>
      <div className="quotation-search-results quotation-results-loading">
        <div className="row">
          {loading.map((item, key) => {
            return (
              <div className="quotation-result-item col-lg-12" key={key}>
                <div className="row no-gutters border-bottom p-3">
                  <div className="col-lg-6">
                    <h2>&nbsp;</h2>
                    <small className="mr-3 text-secondary d-inline-block">&nbsp;</small>
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-start">
                    &nbsp;
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-center">
                    <div>
                      <h3>&nbsp;</h3>
                    </div>
                  </div>

                  <div className="col-lg-2 d-flex align-items-center justify-content-end">
                    <h2>&nbsp;</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuotationListLoading;
