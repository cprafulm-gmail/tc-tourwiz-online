import React from "react";

const ViewBookingLoading = () => {
  const loading = [...Array(3).keys()];
  return (
    <div className="bookings bookings-loading">
      {loading.map((item, key) => {
        return (
          <div className="card shadow-sm mb-3" key={key}>
            <div className="card-header">
              <b className="w-25 d-inline-block">&nbsp;</b>
            </div>
            <div className="card-body pb-1 ">
              <ul className="list-unstyled row border-bottom mb-3">
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
                <li className="col-lg-4 mb-3">
                  <div className="row">
                    <label className="col-lg-12 mb-0 text-secondary w-25">
                      <b className="w-50 d-inline-block mb-2">&nbsp;</b>
                    </label>
                    <label className="col-lg-12 w-25">
                      <b className="w-25 d-inline-block">&nbsp;</b>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewBookingLoading;
