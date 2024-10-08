import React from "react";
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import * as Global from "../../helpers/global";
import Customerselection from "./customer-selection";
class Filters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                createdtodate: moment().format('YYYY-MM-DD'),
                invoicereconciliationstatus: ''
            },
            errors: {},
            status: [],
            customerData: Object.keys(this.props.customerData).length > 0 ? this.props.customerData : {}
        };
    }

    componentDidMount() {
        let reqURL = "reconciliation/customer/status?type=reconcilition"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = []
                for (let value of data.response) {
                    arr.push({ name: value, value })
                }
                this.setState({ status: arr })
            }.bind(this),
            "GET"
        );
    }

    handleFilters = () => {
        this.props.handleFilters(this.state.data);
    };

    handleResetFilters = () => {
        const data = {
            createdfromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            createdtodate: moment().format('YYYY-MM-DD'),
            invoicereconciliationstatus: '',
            customerid: '',
            customerName: ''
        };
        this.setState({ data, customerData: {} });
        this.props.handleFilters(data);

    };
    selectCustomer = (item) => {
        let data = this.state.data;
        data["customerid"] = item.customerID;
        data["customerName"] = item.displayName;
        this.setState({ data, customerData: item });
    }
    render() {
        const { showHideFilters } = this.props
        const { status } = this.state
        return (
            <div className="mb-3 mt-3">
                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                        Filters
                        <button
                            type="button"
                            className="close"
                            onClick={showHideFilters}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h5>

                    <div className="row">
                        {localStorage.getItem('portalType') !== 'B2C' &&
                            <div className="col-lg-4">
                                <Customerselection
                                    key={JSON.stringify(this.state.customerData)}
                                    agentID={this.props.agentID}
                                    customerData={this.state.customerData}
                                    selectCustomer={this.selectCustomer}
                                    resetCustomer={this.handleResetFilters}
                                    mode="text-only" />
                            </div>}
                        <div className="col-lg-4">
                            {this.renderSingleDate(
                                "createdfromdate",
                                Trans("Invoice From Date"),
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-4">
                            {this.renderSingleDate(
                                "createdtodate",
                                Trans("Invoice To Date"),
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-4">
                            {this.renderSelect("invoicereconciliationstatus", "Reconciliation Status", status)}
                        </div>
                        <div className={localStorage.getItem('portalType') === 'B2C'
                            ? "col-lg-4 "
                            : "col-lg-4 mt-2"}>
                            <button
                                name="Apply"
                                onClick={this.handleFilters}
                                className={localStorage.getItem('portalType') === 'B2C'
                                    ? "btn btn-primary mr-2"
                                    : "btn btn-primary mt-4"}>
                                Apply
                            </button>
                            <button
                                name="reset"
                                onClick={this.handleResetFilters}
                                className={localStorage.getItem('portalType') === 'B2C'
                                    ? "btn btn-primary"
                                    : "btn btn-primary ml-2 mt-4"}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Filters
