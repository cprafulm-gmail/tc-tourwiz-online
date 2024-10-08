import React from "react";

const CartLoading = () => {
  return (
    <div className="row mt-4 cart-loading">
      <div className="col-9">
        <div className="border bg-white">
          <div className="row">
            <div className="col-3 d-inline-block">
              <div className="cart-loading-img h-100 d-flex align-items-center justify-content-center">
                <div
                  className="spinner-border-sm spinner-border"
                  role="status"
                ></div>
              </div>
            </div>
            <div className="col-9 p-3">
              <h5 className="w-75">&nbsp;</h5>

              <ul className="list-unstyled m-0 p-0">
                <li className="pt-1 pb-1">
                  <b className="d-block w-50">&nbsp;</b>
                </li>
                <li className="pt-1 pb-1">
                  <b className="d-block w-25">&nbsp;</b>
                </li>
                <li className="pt-1 pb-1">
                  <b className="d-block w-25">&nbsp;</b>
                </li>
                <li className="pt-1 pb-1">
                  <b className="d-block w-25">&nbsp;</b>
                </li>
              </ul>

              <button className="btn btn-link p-0 m-0 mr-3 pull-right w-25">
                &nbsp;
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-3">
        <div className="border bg-white">
          <div className="row">
            <div className="col-12">
              <div className="p-3">
                <h5>&nbsp;</h5>
                <ul className="list-unstyled p-0 m-0">
                  <li className="row">
                    <div className="col-lg-12">
                      <b className="d-block w-75 mb-2">&nbsp;</b>
                      <b className="d-block w-50 mb-2">&nbsp;</b>
                      <b className="d-block w-50 mb-2">&nbsp;</b>
                      <b className="d-block w-25 mb-2">&nbsp;</b>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
