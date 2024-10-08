import React from 'react'
import Form from "../common/form";
export class Filter extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "AgencyName": "",
                "EmailId": "",
                "PhoneNumber": "",
                "CategoryId": ""
            },
            errors: {}
        };
    }
    handleFilters = () => {
        this.props.handleFilters(this.state.data);
    };
    handleResetFilters = () => {
        this.setState({
            data: {
                "AgencyName": "",
                "EmailId": "",
                "PhoneNumber": "",
                "CategoryId": ""
            }
        }, () => { this.props.handleFilters(this.state.data); });
    };
    render() {
        const { CategoryList } = this.props;
        return (
            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                <h5 className="text-primary border-bottom pb-2 mb-2">
                    Filters

                </h5>
                <div className="row">
                    <div className="col-lg-4">
                        {this.renderInput("AgencyName", "Agency Name")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderInput("PhoneNumber", "Phone Number")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderInput("EmailId", "Email Address")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderSelect("CategoryId", "Category", CategoryList)}
                    </div>
                    <div className="col-lg-4">
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
                            className="btn btn-primary ml-2"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter
