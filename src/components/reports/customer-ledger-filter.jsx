import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import * as Global from "../../helpers/global";

export default class Filters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
            },
            errors: {}
        };
    }

    handleFilters = () => {
        this.props.handleFilters(this.state.data);
    };

    handleResetFilters = () => {
        const data = {
            fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            todate: moment().format('YYYY-MM-DD'),
            invoicenumber: ""
        }
        this.setState({ data });
        this.props.handleFilters(data);
    };

    render() {
        return (
            <div className="mb-3 mt-3">
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
                        <div className="col-lg-4">
                            {this.renderSingleDate(
                                "fromdate",
                                Trans("_fromDate"),
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-4">
                            {this.renderSingleDate(
                                "todate",
                                Trans("_toDate"),
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-4">
                            {this.renderInput("invoicenumber", "Invoice Number")}
                        </div>
                        <div className="col-lg-4">

                            <div className="form-group">
                                <label className="d-block">&nbsp;</label>
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
                                    className="btn btn-primary  ml-2"
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