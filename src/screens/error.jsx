import React, { Component } from "react";
import { Trans } from "../helpers/translate";

class Error extends Component {
  state = {};
  render() {
    return (
      <div className="container">
        <h2>{Trans("_ooopsSomeThingWentWrong")}</h2>
      </div>
    );
  }
}

export default Error;
