import React, { Component } from "react";

class ModelPopupAuthorize extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickOutside = event => {
    if (event.key === "Escape") {
      this.props.handleHide();
    }
    return true;
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleClickOutside);
  }

  render() {
    const { header, content } = this.props;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block" tabIndex='-1'>
          <div
            className={
              "modal-dialog modal-dialog-centered modal-dialog-scrollable " +
              (this.props.sizeClass ? this.props.sizeClass : "")
            }
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{"Subscription"}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleHide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{"Subscribe your plan soon to access all exclusive features."}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => (this.props.history ? this.props.history.push(`/BillingAndSubscription`) : window.location.reload(window.location.origin + '/BillingAndSubscription'))}>Proceed</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default ModelPopupAuthorize;
