import React from "react";
import CallCenterBase from "../../base/call-center-base";
import CallCenterDetails from "./call-center-details";
import CallCenterSelection from "./call-center-selection";
import LoaderCallCenter from "../common/loader-call-center";

class CallCenter extends CallCenterBase {
  constructor(props) {
    super(props);
    this.state = {
      portals: "",
      portal: "",
      bookingFor: sessionStorage.getItem("bookingFor") ? sessionStorage.getItem("bookingFor") : "",
      isLoading: true,
      isCallCenterDetails: false,
      results: "",
      isCallCenterLoader: false,
      isShowPopup: true,
    };
  }

  componentDidMount() {
    this.getPortals();
  }

  render() {
    const { portals, isLoading, isCallCenterDetails, isCallCenterLoader, isShowPopup } = this.state;

    return (
      <div className="call-center-container">
        <div className="d-flex justify-content-center flex-wrap call-center">
          <CallCenterSelection
            {...this.state}
            handleCallCenterDetails={this.handleCallCenterDetails}
            resetQuery={this.resetQuery}
            handlePortal={this.handlePortal}
            key={this.state.bookingFor}
          />
        </div>
        {!isLoading && isCallCenterDetails && isShowPopup && (
          <CallCenterDetails
            {...this.state}
            portals={portals}
            handleCallCenterDetails={this.handleCallCenterDetails}
            handleQuery={this.handleQuery}
            handleSelect={this.handleSelect}
          />
        )}
        {isCallCenterLoader && !isShowPopup && <LoaderCallCenter />}
      </div>
    );
  }
}

export default CallCenter;
