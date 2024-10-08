import React, { Component } from "react";
import Loader from "../components/common/loader";
import { Trans } from "../helpers/translate";

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //this.getBookings(this.state.type);
  }

  render() {
    return (
      <div className="container">
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          <Loader />
    <small className="text-secondary">{Trans("_authorisingUser")}</small>
        </div>
      </div>
    );
  }
}

export default Splash;
