import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import { ReconciliationStatus } from "../../helpers/dropdown-list";
import moment from "moment";
import * as Global from "../../helpers/global";
class ReconciliationDetailFilters extends Form {
  constructor(props) {
    super(props);
    this.state = { data: this.props.filters, errors: {} };
  }
  handleFilters = () => {
    this.props.handleFilters(this.state.data);
  };
  handleResetFilters = () => {
    const data = { fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD'), invoiceNo: "", status: "" };
    this.setState({ data });
    this.props.handleFilters(data);
  };
  render() {
    const { type } = this.props;
    return (
      <div className="mb-1">
        <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
          <h5 className="text-primary border-bottom pb-2 mb-2">
            Filters
            <button
              type="button"
              className="close"
              onClick={this.props.showHideFilters}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </h5>

          <div className="row">
            <div className="col-lg-3">
              {this.renderSingleDate(
                "fromDate",
                "Invoice " + Trans("_fromDate"),
                moment().format(Global.DateFormate),
                moment("2001-01-01").format(Global.DateFormate),
              )}
            </div>
            <div className="col-lg-3">
              {this.renderSingleDate(
                "toDate",
                "Invoice " + Trans("_toDate"),
                moment().format(Global.DateFormate),
                moment("2001-01-01").format(Global.DateFormate),
              )}
            </div>
            {/* <div className="col-lg-6">
              {this.renderDate(
                "fromDate",
                "toDate",
                "Invoice " + Trans("_fromDate"),
                "Invoice " + Trans("_toDate")
              )}
            </div> */}
            {type === "Invoice" && (
              <div className="col-lg-3">
                {this.renderSelect("status", "Status", ReconciliationStatus)}
              </div>
            )}
            {(type === "Invoice" || type === "BRN") && (
              <div className="col-lg-3">
                {this.renderInput("invoiceNo", "Invoice Number")}
              </div>
            )}
            <div className="col-lg-3">
              <div className="form-group">
                {type === "BRN" && (
                  <label className="d-block">&nbsp;</label>
                )}
                <button
                  name="Apply"
                  onClick={this.handleFilters}
                  className="btn btn-primary"
                >
                  Apply
                </button>
                <button
                  name="reset"
                  onClick={this.handleResetFilters}
                  className="btn btn-primary ml-2"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default ReconciliationDetailFilters;
