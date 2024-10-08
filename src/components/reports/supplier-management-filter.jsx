import React from "react";
import Form from "../common/form";
import BusinessDD from "./business-dropdown"

class Filters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                contactperson: "",
                phone: "",
                email: "",
                business: "",
                companyname: ""
            },
            errors: {}
        };
    }

    handleFilters = () => {
        //alert(JSON.stringify(this.state.data))
        const errors = this.validateFilter();

        this.setState({ errors: errors || {} });
        if (errors) return;
        this.props.handleFilters(this.state.data);
    };

    handleResetFilters = () => {

        this.setState({
            data: {
                contactperson: "",
                phone: "",
                email: "",
                business: "",
                companyname: ""
            },
            errors: {}
        }, () => {
            sessionStorage.removeItem("reportBusinessSupplier")
            this.props.removeData();
        });


    };
    handleBusiness = (value, sList) => {
        let vData = this.state.data;
        vData["business"] = value;
        vData["providerid"] = ""
        let arr = [{ name: "Select", value: "" }]
        for (let supplier of sList) {
            arr.push({ name: supplier.fullName, value: supplier.providerId })
        }
        this.setState({ data: vData })
    };

    validateFilter = () => {
        const errors = {};
        const { data } = this.state;

        if (!data.business || !this.validateFormData(data.business, "require"))
            errors.business = "Business required";

        return Object.keys(errors).length === 0 ? null : errors;
    }

    render() {
        const { errors, data } = this.state
        return (
            <div className="mb-3 mt-3">
                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                        Filters
                    </h5>
                    <div className="row">
                        <div className="col-lg-4">
                            <BusinessDD
                                BusinessId={data["business"] ? data["business"] : -1}
                                providerID={this.props.agentID}
                                handleBusiness={this.handleBusiness.bind(this)}
                                afUserType={this.props.userInfo.afUserType}
                            />
                            {errors["business"] && (
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                    {errors["business"]}
                                </small>
                            )}
                        </div>
                        <div className="col-lg-4">
                            {this.renderInput("companyname", "Supplier Name")}
                            {/* {this.renderSelect("providerid", "Supplier *", supplierList)} */}
                        </div>
                        <div className="col-lg-4">
                            {this.renderInput("contactperson", "Contact Person")}
                        </div>
                        <div className="col-lg-4">
                            {this.renderInput("phone", "Phone Number")}
                        </div>

                        <div className="col-lg-4">
                            {this.renderInput("email", "Email Address")}
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
                                onClick={this.handleResetFilters.bind(this)}
                                className="btn btn-primary ml-2"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default Filters
