import React from "react";

const PublicPageWherewe = (props) => {
  return (
    <div className="tw-allofthis">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h1>All of this - Absolutely Free!</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            {/* <button
              onClick={() => props.handleLoginPopup("signup")}
              className="btn btn-lg"
            >
            Join Now
          </button> */}
            <a href="/signup-ai-assistant"
              target="_blank"
              style={{ paddingTop: "12px" }}
              className="btn btn-lg">
              Join Now
            </a>
          </div>
        </div>
      </div>
      <div className="allofthis-banner-overlay" style={props.mode === "Marketplace" ? { position: "relative" } : { position: "absolute" }}></div>
    </div>
  );
};

export default PublicPageWherewe;
