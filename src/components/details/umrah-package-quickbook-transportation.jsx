import React from "react";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";

class UmrahPackageQuickbookTransportation extends React.Component {
  constructor(props) {
    super(props);
    let data = this.props.data;
    if (this.props.data.length > 0 && props.details.items.length > 0) {
      data[0].pax = props.details.items[0].item[0].availabilityCount >= this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity ? this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity : 0;
      data[0].vehicle = props.details.items[0].item[0].quantity >= this.props.requestObject().Request.Filters.find(x => x.Column === "quantity").Query ? this.props.requestObject().Request.Filters.find(x => x.Column === "quantity").Query : 0;
    }
    this.state = {
      data: data,
      isErrorMessage: false,
    }
  }

  //Transportation Method
  handleTransportationSelection = (mode, id, value) => {
    let data = this.state.data;
    if (mode === "quantity") data.find((x) => x.id === id).vehicle = value;
    else if (mode === "availabilityCount")
      data.find((x) => x.id === id).pax = value;
    this.setState({ data });
  };

  getSelectedValue = (mode, id) => {
    let data = this.state.data;
    if (mode === "quantity") return data.find((x) => x.id === id).vehicle;
    else if (mode === "availabilityCount")
      return data.find((x) => x.id === id).pax;
  };

  //Transportation Method
  getTransportationAmount = (data, id) => {
    if (data.length === 0) return 0;
    else {
      let vehicleData = data.filter((x) => x.id === id)[0];
      let amount =
        vehicleData.amount *
        (parseInt(vehicleData.vehicle) === 0 ? 1 : vehicleData.vehicle);
      return amount;
    }
  };

  render() {
    const { details } = this.props;
    return (
      <div className="row quick-book">
        <div className="col-lg-12">
          <div className="pt-3 pl-2">
            {this.props.isErrorMessage && (
              <span className="alert alert-danger mb-2">
                {Trans("_error_transportation_Detail_ValidationMessage1")}
              </span>
            )}

            <div
              className={
                "card" + (this.props.isErrorMessage ? " mt-3" : "")
              }
            >
              <div className="card-header">
                <div className="container">
                  <div className="row">
                    <div className="col-3">
                      <h6>{Trans("_transportation")}</h6>
                    </div>
                    <div className="col-2">
                      <h6>{Trans("_vehicleQuantity")}</h6>
                    </div>
                    <div className="col-3">
                      <h6>{Trans("_VehicleNoOfPersion")}</h6>
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
                            onClick={() => this.props.handleCart()}
                          >
                            {Trans("_bookNow")}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {details.items[0].item.map((item, key) => {
                return (
                  <div className="card-body" key={key}>
                    <h6 className="card-title">{item.name}</h6>
                    <div className="container">
                      <div className="row">
                        <div className="col-3 p-0">
                          <span className="d-block">
                            {Trans("_vehicleCategory")} :{" "}
                            {
                              item.tpExtension.find(
                                (x) => x.key === "categoryName"
                              ).value
                            }
                          </span>
                          <span className="d-block">
                            {Trans("_vehicleModel")} :{" "}
                            {
                              item.tpExtension.find(
                                (x) => x.key === "modelFrom"
                              ).value
                            }{" "}-{" "}
                            {
                              item.tpExtension.find(
                                (x) => x.key === "modelTo"
                              ).value
                            }
                          </span>
                        </div>
                        <div className="col-2">
                          <select
                            className="form-control"
                            onChange={(e) =>
                              this.handleTransportationSelection(
                                "quantity",
                                item.id,
                                e.target.value
                              )
                            }
                            defaultValue={this.getSelectedValue("quantity", item.id)}
                          >
                            <option>{0}</option>
                            {[...Array(item.quantity > parseInt(this.props.requestObject().Request.Filters.filter((x) => x.Column === "quantity")[0].Query) ? parseInt(this.props.requestObject().Request.Filters.filter((x) => x.Column === "quantity")[0].Query) : item.quantity).keys()].map(
                              (item) => {
                                return <option>{item + 1}</option>;
                              }
                            )}
                          </select>
                        </div>
                        <div className="col-2">
                          <select
                            className="form-control"
                            onChange={(e) =>
                              this.handleTransportationSelection(
                                "availabilityCount",
                                item.id,
                                e.target.value
                              )
                            }
                            defaultValue={this.getSelectedValue("availabilityCount", item.id)}
                          >
                            <option>{0}</option>
                            {[
                              ...Array(item.availabilityCount > parseInt(this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity) ? parseInt(this.props.requestObject().Request.PaxInfo[0].Item[0].Quantity) : item.availabilityCount).keys(),
                            ].map((item) => {
                              return <option>{item + 1}</option>;
                            })}
                          </select>
                        </div>
                        <div className="col-2">
                          <span
                            className={
                              "d-block pull-right text-primary font-weight-bold btn btn-link "
                            }
                            onClick={() =>
                              this.props.showPriceFarebreakup(
                                null,
                                item.id,
                                this.props.details.token
                              )
                            }
                          >
                            <Amount
                              amount={this.getTransportationAmount(
                                this.state.data,
                                item.id
                              )}
                              currencyCode={
                                item.displayRateInfo.find(
                                  (x) => x.purpose === "10"
                                ).currencyCode
                              }
                            />
                          </span>
                        </div>
                      </div>

                      {item.specialRequests && (
                        <div className="row">
                          <div className="col p-0">
                            <React.Fragment>
                              <small className="mr-2">{Trans("_additionalFacilities")} :</small>
                              {item.specialRequests[0].specialRequestItems.map(
                                (services, key) => {
                                  return (
                                    <span
                                      key={key}
                                      className="badge badge-light border border-primary font-weight-normal pt-1 pb-1 pl-2 pr-2 mr-2"
                                    >
                                      {services.description}
                                    </span>
                                  );
                                }
                              )}
                              {item.specialRequests[0].specialRequestItems.length > 0 && <small class="alert alert-info d-inline-block p-2 mt-2 ml-3">Additional facilities can be add on next page.</small>}
                            </React.Fragment>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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

export default UmrahPackageQuickbookTransportation;
