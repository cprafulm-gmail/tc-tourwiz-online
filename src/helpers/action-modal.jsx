import React, { Component } from "react";

class ConfirmationModal extends Component {
  render() {
    const {
      title,
      message,
      positiveButtonText,
      negativeButtonText
    } = this.props;

    return (
      <div className="model-popup">
        <div className="modal fade show d-block" tabIndex='-1'>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title ? title : 'Alert'}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={this.props.handleHide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{message}</div>
              <div className="modal-footer">
                {
                  negativeButtonText && negativeButtonText !== 'undefined' && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.onNegativeButton}>{negativeButtonText ? negativeButtonText : 'NO'}</button>
                  )
                }
                {
                  positiveButtonText && positiveButtonText !== 'undefined' && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={this.props.onPositiveButton}>{positiveButtonText ? positiveButtonText : 'YES'}</button>
                  )
                }

              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    )
  }
}

export default ConfirmationModal;
