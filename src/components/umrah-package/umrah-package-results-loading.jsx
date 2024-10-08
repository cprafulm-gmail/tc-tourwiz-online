import React from "react";

const UmrahPackageResultsLoading = ({ businessName, type }) => {
  const loading = [...Array(5).keys()];
  return (
    <React.Fragment>
      <div className="quotation-results-total quotation-results-loading d-flex p-2 pl-3 pr-3 m-0 bg-light">
        <div className="mr-auto d-flex align-items-center">
          <h2 className="font-weight-bold m-0 p-0" style={{ minWidth: "400px" }}>
            &nbsp;
          </h2>
        </div>
      </div>
      <div className="quotation-search-results quotation-results-loading border-top">
        <div className="row">
          <div className="col-lg-12">
            <div className="mt-5 d-block">
              <div className="preloader">
                <div className="lds-ellipsis">
                  <span></span> <span></span> <span></span>
                </div>
              </div>
            </div>

            <h4 className="mt-4 text-center">
              Fetching live inventory from our {businessName === "air" ? "flight" : businessName}{" "}
              database.
            </h4>

            <h5 className="mt-2 pb-5 text-center font-weight-bold text-primary border-bottom">
              {type === "Itinerary" && "You will be able to change the pricing."}
            </h5>
          </div>
        </div>

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

export default UmrahPackageResultsLoading;
