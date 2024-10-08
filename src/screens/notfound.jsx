import React from "react";
import { Trans } from "../helpers/translate";

const NotFound = () => {
  return (
    <div className="container">
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        <h2
          className="text-secondary font-weight-bold"
          style={{ fontSize: "8rem", opacity: "0.7" }}
        >
          404
        </h2>
        <h3 className="font-weight-bold text-primary">{Trans("_ooopsPageNotFound")}</h3>
        <p className="text-secondary mt-3">
          {Trans("_ooopsPageNotFoundNote")}

        </p>
      </div>
    </div>
  );
};

export default NotFound;
