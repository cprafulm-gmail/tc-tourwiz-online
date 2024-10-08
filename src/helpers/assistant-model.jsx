import React, { Component } from "react";

class AssistantModelPopup extends Component {
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
    const { header, content, footer } = this.props;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block" tabIndex='-1'>
          <div
            className={
              "modal-dialog modal-dialog-centered modal-dialog-scrollable p-0 m-0" +
              (this.props.sizeClass ? this.props.sizeClass : "")
            }
          >
            <div className="modal-content p-0 m-0" style={{
              border: "none",
              borderRadius: "15px",
            }}>
              <div className="modal-header border-0 p-0 m-0">
                {header}
              </div>
              <div className="modal-body p-0 m-0">{content}</div>
              <div class="modal-footer border-0 p-0 m-0">
                {footer}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show p-0"></div>
      </div>
    );
  }
}

export default AssistantModelPopup;
