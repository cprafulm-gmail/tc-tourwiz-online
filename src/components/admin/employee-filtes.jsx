import React from 'react'
import Form from "../common/form";
export class Filter extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                "FirstName": "",
                "LastName": "",
                "CellPhone": "",
                "EmailId": "",
                "IsActive": true
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
                "FirstName": "",
                "LastName": "",
                "CellPhone": "",
                "EmailId": "",
                "IsActive": true
            }
        }, () => { this.props.handleFilters(this.state.data); });
    };
    IsActiveChange = (value) => {
        const { data } = this.state;
        data.IsActive = value;
        this.setState({ data });
    }
    render() {
        return (
            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                <h5 className="text-primary border-bottom pb-2 mb-2">
                    Filters

                </h5>
                <div className="row">
                    <div className="col-lg-4">
                        {this.renderInput("FirstName", "First Name")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderInput("LastName", "Last Name")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderInput("EmailId", "Email Address")}
                    </div>
                    <div className="col-lg-4">
                        {this.renderInput("CellPhone", "Phone Number")}
                    </div>
                    <div className="col-lg-4">
                        <div className={"form-group " + "IsActive"}>
                            <label htmlFor="IsActive">Active</label>
                            <div className="input-group">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="IsActive" id="yes" onChange={() => this.IsActiveChange(true)} value={this.state.data.IsActive} checked={this.state.data.IsActive === true} />
                                    <label className="form-check-label" htmlFor="IsActiveYes">Yes</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="IsActive" id="no" value={this.state.data.IsActive} onChange={() => this.IsActiveChange(false)} checked={this.state.data.IsActive === false} />
                                    <label className="form-check-label" htmlFor="IsActiveNo">No</label>
                                </div>
                            </div>
                        </div>
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
