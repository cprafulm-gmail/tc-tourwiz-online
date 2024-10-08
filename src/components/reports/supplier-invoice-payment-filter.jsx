import React from "react";
import Form from "../common/form";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment"
class Filters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                fromdate: this.props.filters.fromdate ? this.props.filters.fromdate : moment(new Date()).format("YYYY-MM-DD"),
                invoicenumber: this.props.filters.invoicenumber,
                reconcillationstatus: this.props.filters.reconcillationstatus
            },
            errors: {},
            isFilters: this.props.isFilters
        };
    }
    handleFilters = () => {
        let { data } = this.state;
        data["todate"] = data["fromdate"];
        this.props.handleFilters(data);
    };

    handleResetFilters = () => {
        this.setState({
            data: {
                fromdate: "",
                todate: "",
                reconcillationstatus: null
            }
        });
        this.props.handleFilters({});

    };
    showHideFilters = () => {
        let { isFilters } = this.state;
        isFilters = !isFilters;
        this.setState({ isFilters });
        this.props.showHideFilters(isFilters);
    }
    render() {
        const { isFilters } = this.state;
        const { status } = this.props;
        return (
            <div className="mb-3 mt-3">
                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                        <SVGIcon
                            name="filter"
                            width="16"
                            height="16"
                            type="fill"
                            className="mr-2"
                        ></SVGIcon><span>Filters</span>
                        <button
                            className="btn btn-link p-0 m-0 text-primary pull-right"
                            onClick={() => this.showHideFilters()}
                        >
                            {isFilters ? "Hide Filter" : "Show Filter"}
                        </button>
                    </h5>
                    {isFilters &&
                        <div className="row">
                            <div className="col-lg-4">
                                {this.renderInput("invoicenumber", "Invoice Number")}
                            </div>
                            <div className="col-lg-4">
                                {this.renderBirthDate("fromdate", "Invoice Date")}
                            </div>
                            <div className="col-lg-4">
                                {this.renderSelect("reconcillationstatus", "Reconcilition Status", status)}
                            </div>
                            <div className="col-lg-4">
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
                    }
                </div>
            </div >
        );
    }
}

export default Filters
