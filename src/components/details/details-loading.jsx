import React from "react";

const DetailsLoading = () => {
  const loading = [...Array(30).keys()];
  return (
    <React.Fragment>
      <div className="details-loading container">
        <div className="row">
          <div className="col-8 pt-4 pb-4">
            <h3 className="font-weight-bold d-inline-block w-75">&nbsp;</h3>

            <h6 className="text-secondary w-25">&nbsp;</h6>
          </div>

          <div className="col-4 pt-4 pb-4 text-right">
            <h6 className="text-right font-weight-bold d-inline-block mr-3 w-25">
              &nbsp;
            </h6>
            <button className="btn btn-primary w-25">&nbsp;</button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-3">
            <div className="details-loading-img d-flex align-items-center justify-content-center">
              <div
                className="spinner-border-sm spinner-border"
                role="status"
              ></div>
            </div>
          </div>
          <div className="col-3">
            <div className="details-loading-img d-flex align-items-center justify-content-center">
              <div
                className="spinner-border-sm spinner-border"
                role="status"
              ></div>
            </div>
          </div>
          <div className="col-3">
            <div className="details-loading-img d-flex align-items-center justify-content-center">
              <div
                className="spinner-border-sm spinner-border"
                role="status"
              ></div>
            </div>
          </div>
          <div className="col-3">
            <div className="details-loading-img d-flex align-items-center justify-content-center">
              <div
                className="spinner-border-sm spinner-border"
                role="status"
              ></div>
            </div>
          </div>
        </div>

        <div className="row mb-4 mt-5">
          <div className="col-12">
            <h3 className="w-50">&nbsp;</h3>
            <ul className="row list-unstyled mb-4">
              {loading.map((item, key) => {
                return (
                  <li className="col-4 mt-1 mb-1" key={key}>
                    <h6>&nbsp;</h6>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetailsLoading;
