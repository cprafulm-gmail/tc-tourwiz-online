import React, { Component } from "react";

class ModelPopup extends Component {
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
                <h5 className="modal-title">{header}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleHide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{content}</div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default ModelPopup;
