import React from "react";

const ItineraryNotification = (props) => {
  return (
    <div className="model-popup ">
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Alert</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => props.handleMultipleHotel()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body text-center">
              <p className="mt-3">Multiple hotels added in the same day.</p>
              <button
                type="button"
                className="mt-2 btn btn-primary btn-sm"
                onClick={() => props.handleMultipleHotel()}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default ItineraryNotification;
