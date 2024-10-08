import React from "react";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";

class UmrahPackageQuickbookGroundService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      isErrorMessage: false,
    }
  }

  render() {
    const { details } = this.props;
    const { data } = this.state;
    return (
      <div className="row quick-book">
        <div className="col-lg-12">
          <div className="pt-3 pl-2">
            <div
              className={
                (data[0].specialRequests.length > 0 ? "card" : "") + (this.state.isErrorMessage ? " mt-3" : "")
              }
            >
              {data[0].specialRequests.length === 0 && (
                <React.Fragment>
                  <HtmlParser text={Trans("NoAdditionalServiceFoundMsg")} />
                  <div className="col-3 pull-right">
                    {this.props.isBtnLoading !== null &&
                      this.props.isBtnLoading !== false ? (
                        <button className="btn btn-primary">
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          {Trans("_bookNow")}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => this.props.handleCart(details.id, details.token)}
                        >
                          {Trans("_bookNow")}
                        </button>
                      )}
                  </div>
                </React.Fragment>
              )}
              {data[0].specialRequests.length !== 0 && (
                <div className="card-header">
                  <div className="container">
                    <div className="row">
                      <div className="col-3">
                        <h6>{Trans("_lbladditionalServices")}</h6>
                      </div>
                      <div className="col-3">
                        <h6>{Trans("_filterPrice")}</h6>
                      </div>
                      <div className="col-3">
                        <h6>{Trans("_sortduration")}</h6>
                      </div>
                      <div className="col-3 pull-right">
                        {this.props.isBtnLoading !== null &&
                          this.props.isBtnLoading !== false ? (
                            <button className="btn btn-primary">
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              {Trans("_bookNow")}
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => this.props.handleCart(details.id, details.token)}
                            >
                              {Trans("_bookNow")}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {data[0].specialRequests.length !== 0 && (
                <div className="card-body">
                  <h6 className="card-title"></h6>
                  <div className="container">
                    <React.Fragment>
                      {data[0].specialRequests.map(
                        (services, key) => {
                          return (
                            <div className="row">
                              <div className="col-3 p-0">
                                {services.name}
                              </div>
                              <div className="col-3">
                                <Amount
                                  amount={services.amount}
                                  currencyCode={services.currencyCode}
                                />
                              </div>
                              <div className="col-3">
                                {services.duration + " " + Trans("_Days")}
                              </div>

                            </div>
                          );
                        }
                      )}
                      <div class="row"><small class="alert alert-info d-inline-block p-2 mt-2">Additional services can be add on next page.</small></div>
                    </React.Fragment>
                  </div>
                </div>
              )
              }
            </div>
            {this.props.details.policies && (
              <div className="mt-3 ml-1">
                <h6>{Trans("_bookingTerms")}</h6>
                <div>
                  {this.props.details.policies.map((item, key) => {
                    return (
                      item.type !== "CreditCard" && (
                        <React.Fragment key={key}>
                          <h6>{item.type}</h6>
                          <ul className="pl-3">
                            <li className="mb-3" key={key}>
                              <HtmlParser text={item.description} />
                            </li>
                          </ul>
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  }
}

export default UmrahPackageQuickbookGroundService;
