import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { BaggageFeeInfo } from "../helpers/baggage-info";
import { Trans } from "../helpers/translate";

class BaggageInfo extends Component {
  state = {};

  render() {
    return (
      <div className="baggage-info">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="package"
                type="fill"
                className="mr-3"
                width="30"
                height="30"
              ></SVGIcon>
              {Trans("_baggageFee")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-3">
            <h5>{Trans("_airlineBaggageAndOnlineCheckIn")}</h5>
            <p className="text-secondary">
              {Trans("_baggageFeeSecondaryMessage")}
            </p>
            <ul className="list-unstyled row">
              {BaggageFeeInfo.map((item, key) => {
                return (
                  <li className="col-lg-3" key={key}>
                    <div className="card shadow-sm mb-3">
                      <div className="card-header">{item.airline}</div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-3 align-items-center d-flex">
                            <img src={item.logo} alt="" />
                          </div>
                          <div className="col-lg-9">
                            <ul className="list-unstyled">
                              <li>
                                <a
                                  href={item.baggageAllowances}
                                  target="_blank"
                                  className="text-secondary"
                                >
                                  {Trans("_baggageAllowances")}
                                </a>
                              </li>
                              <li>
                                <a
                                  href={item.onlineCheckIn}
                                  target="_blank"
                                  className="text-secondary"
                                >
                                  {Trans("_onlineCheckIn")}
                                </a>
                              </li>
                              <li>
                                <a
                                  href={item.frequentFlyer}
                                  target="_blank"
                                  className="text-secondary"
                                >
                                  {Trans("_frequentFlyer")}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p>
              {Trans("_ATOLCertificateMessage")}:{" "}
              <a
                target="_blank"
                className="text-primary"
                href="http://www.atol.org.uk/ATOLCertificate"
              >
                www.atol.org.uk/ATOLCertificate
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default BaggageInfo;
