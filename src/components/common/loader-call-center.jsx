import React from "react";
import { Trans } from "../../helpers/translate";

const LoaderCallCenter = () => {
  return (
    <div
      className="d-flex justify-content-center w-100 h-100 position-fixed pt-5"
      style={{
        zIndex: 1000,
        left: "0px",
        top: "132px",
        background: "rgba(256, 256, 256, 0.7)"
      }}
    >
      <div className="spinner-border" role="status">
        <span className="sr-only">{Trans("_loadingText")}</span>
      </div>
    </div>
  );
};

export default LoaderCallCenter;
