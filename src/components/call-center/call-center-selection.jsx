import React, { Component } from "react";
import { Trans } from "../../helpers/translate";

class CallCenterSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portal: this.props.portal,
      bookingFor: this.props.bookingFor
    };
  }

  handlePortal = e => {
    localStorage.removeItem("cartLocalId");
    this.setState({ portal: e.target.value });
    this.props.handlePortal(e.target.value);
  };

  render() {
    const { isLoading, portals } = this.props;
    return (
      <div className="form-row align-items-center">
        <div className="col-auto">
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fa fa-cog" aria-hidden="true"></i>
              </div>
            </div>
            <select
              className="form-control"
              onChange={this.handlePortal}
              value={this.state.portal ? this.state.portal : (this.props.portal ? this.props.portal : "")}
              disabled={this.props.isPortalsDisabled}
            >
              {!isLoading &&
                portals.map(option => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        <div className="col-auto">
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fa fa-user" aria-hidden="true"></i>
              </div>
            </div>
            <input
              type="text"
              value={this.state.bookingFor}
              className="form-control"
              onChange={e => this.setState({ bookingFor: e.target.value })}
              placeholder={Trans("_bookingForGuestCustomer")}
            />
            {this.state.bookingFor && (
              <button
                className="reset-btn position-absolute btn btn-link text-secondary"
                onClick={this.props.resetQuery}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            )}
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={() => this.props.handleCallCenterDetails(this.state)}
              >
                {Trans("_select")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CallCenterSelection;
