import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import SVGIcon from "../../helpers/svg-icon";

class OverView extends Component {
  constructor(props) {
    super(props);
    this.state = { showOverview: true };
  }

  con;

  render() {
    const { businessName, description, tpExtension, items } = this.props;

    const hideShowOverview = this.state.showOverview
      ? "overview-content text-secondary"
      : "text-secondary";

    const hideShowBtn = description
      ? description.length > 700
        ? this.state.showOverview
          ? true
          : false
        : false
      : false;

    const operationalDays =
      (businessName === "activity" || businessName === "package") && items && items[0].item[0].tpExtension &&
      items[0].item[0].tpExtension.find((x) => x.key === "operationalDays") &&
      items[0].item[0].tpExtension.find((x) => x.key === "operationalDays")
        .value;

    const businessType = (businessName === "activity" || businessName === "package") && this.props.amenities && this.props.amenities.length > 0
      ? this.props.amenities.map(item => { return item.name }).join(', ')
      : "";//businessName === "activity" ? Trans("_activity") : businessName === "package" ? Trans("_package") : 

    return (
      <React.Fragment>
        <div className="overview row mb-4 mt-4">
          <div className="col-12">
            {description && (
              <React.Fragment>
                <h4 className="font-weight-bold">{Trans("_overviewTitle")}</h4>
                <p className={hideShowOverview}>
                  <HtmlParser text={description} />
                </p>
              </React.Fragment>
            )}

            {hideShowBtn ? (
              <button
                className="btn btn-link p-0 text-primary"
                onClick={() => this.setState({ showOverview: false })}
              >
                {Trans("_overviewShowMore")}
              </button>
            ) : null}
          </div>
        </div>
        {(businessName === "activity" || businessName === "transfers" || businessName === "package") && tpExtension  && (
          <div className="overview row mb-4 mt-4">
            <div className="col-12">
              <React.Fragment>
                <h4 className="font-weight-bold">
                  {businessName === "activity"
                    ? Trans("_titleActivityDetails") +
                    (tpExtension.find((x) => x.key === "businessTypeName") &&
                      tpExtension.find((x) => x.key === "businessTypeName")
                        .value)
                    : businessName === "transfers" ? Trans("_titletransfersDetails") +
                    (tpExtension.find((x) => x.key === "businessTypeName") &&
                      tpExtension.find((x) => x.key === "businessTypeName")
                        .value)
                    :Trans("_titlePackageDetails") +
                    (tpExtension.find((x) => x.key === "businessTypeName") &&
                      tpExtension.find((x) => x.key === "businessTypeName")
                        .value)}
                </h4>
                <ul className="list-unstyled m-0 mt-3">
                  {businessType &&
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_packageType")}
                        </span>
                        <b className="col-lg-10">
                          {businessType}
                        </b>
                      </div>
                    </li>
                  }
                  {tpExtension.find((x) => x.key === "operatorName") && tpExtension.find((x) => x.key === "operatorName").value !== '' && (
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_operator")} :
                        </span>
                        <b className="col-lg-10">
                          {tpExtension.find((x) => x.key === "operatorName") !==
                            undefined
                            ? tpExtension.find((x) => x.key === "operatorName")
                              .value
                            : "--"}
                        </b>
                      </div>
                    </li>
                  )}
                  {tpExtension.find((x) => x.key === "duration") && (
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_packageDuration")}
                        </span>
                        <b className="col-lg-10">
                          {tpExtension.find((x) => x.key === "duration") !==
                            undefined
                            ? tpExtension.find((x) => x.key === "duration")
                              .value
                            : "--"}
                        </b>
                      </div>
                    </li>
                  )}
                  {businessName === "transfers" && (
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_category")}
                        </span>
                        <b className="col-lg-10">
                          {this.props.category !==
                            undefined
                            ? this.props.category
                            : "--"}
                        </b>
                      </div>
                    </li>
                  )}
                  {operationalDays && (
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_packageAvailableOn")}
                        </span>
                        <b className="col-lg-10">{operationalDays}</b>
                      </div>
                    </li>
                  )}
                  {tpExtension.find((x) => x.key === "departurePoint") &&
                    tpExtension.find((x) => x.key === "departurePoint")
                      .value && (
                      <li className="mb-2 border p-2 pl-3">
                        <div className="row">
                          <span className="col-lg-2">
                            <SVGIcon
                              name="check-square"
                              className="mr-2 text-primary"
                            ></SVGIcon>
                            {Trans("_packageStartingPlace")}
                          </span>
                          <b className="col-lg-10">
                            {
                              tpExtension.find(
                                (x) => x.key === "departurePoint"
                              ).value
                            }
                          </b>
                        </div>
                      </li>
                    )}
                  {tpExtension.find((x) => x.key === "pdfUrl") && (
                    <li className="mb-2 border p-2 pl-3">
                      <div className="row">
                        <span className="col-lg-2">
                          <SVGIcon
                            name="check-square"
                            className="mr-2 text-primary"
                          ></SVGIcon>
                          {Trans("_downloadPdf")}
                        </span>
                        <b className="col-lg-10">
                          {tpExtension.find((x) => x.key === "pdfUrl") !==
                            undefined &&
                            tpExtension.find((x) => x.key === "pdfUrl").value !==
                            "" ? (
                              <a
                                className="text-primary font-weight-normal"
                                href={
                                  tpExtension.find((x) => x.key === "pdfUrl")
                                    .value
                                }
                                target="_blank"
                                download
                              >
                                {Trans("_downloadPdfClickHere")}
                              </a>
                            ) : (
                              "--"
                            )}
                        </b>
                      </div>
                    </li>
                  )}
                </ul>
              </React.Fragment>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default OverView;
