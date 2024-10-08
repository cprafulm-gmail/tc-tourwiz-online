import React from 'react'
import Form from "../../components/common/form"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader"

export class Modal extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                Type: "agent",
                CategoryName: null,
                CategoryDescription: null,
                IsActive: true
            },
            errors: {},
            isSubmitLoading: false,
            isLoading: false
        };
    }

    componentDidMount() {
        if (this.props.popup.type === "Update") {
            this.fetchData()
        }
    }

    onRadiochange = (value) => {
        const { data } = this.state;
        data.Type = value;
        this.setState({ data });
    }
    IsActiveChange = (value) => {
        const { data } = this.state;
        data.IsActive = value;
        this.setState({ data });
    }
    fetchData = () => {
        this.setState({ isLoading: true })
        // admin/class/details?providerid=
        let reqOBJ = {}

        let reqURL = "admin/class/details?classid=" + this.props.popup.classID + "&type=" + this.props.popup.categoryType
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (res) {
                const { categoryName, categoryDescription, isActive } = res.response[0]
                let data = {
                    Type: this.props.popup.categoryType,
                    CategoryName: categoryName,
                    CategoryDescription: categoryDescription,
                    IsActive: isActive
                }
                this.setState({ data, isLoading: false })
            }.bind(this),
            "GET"
        );
    }

    handleSubmit = () => {
        const errors = this.handleValidations();

        this.setState({ errors: errors || {} });
        if (errors) return;

        this.setState({ isSubmitLoading: true })
        if (this.props.popup.type === "Add") {
            let reqOBJ = {
                request: {
                    ...this.state.data
                }
            }

            let reqURL = "admin/class/add"
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (data) {
                    if (data.error) {
                        let errors = this.state.errors
                        errors["submit"] = data.error
                        this.setState({ isSubmitLoading: false, errors })
                    }
                    else {
                        let errors = this.state.errors
                        errors["submit"] = null
                        this.setState({ isSubmitLoading: false, errors }, () => {
                            this.props.getCategory()
                            this.props.handleClose(true)
                        })
                    }

                }.bind(this),
                "POST"
            );
        }
        else {
            let reqOBJ = {
                request: {
                    ...this.state.data,
                    ClassId: this.props.popup.classID
                }
            }

            let reqURL = "admin/class/update"
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (data) {
                    this.setState({ isSubmitLoading: false }, () => {
                        this.props.getCategory()
                        this.props.handleClose(true)
                    })
                }.bind(this),
                "POST"
            );
        }
    }

    handleValidations = () => {
        const errors = {};
        const { data } = this.state;

        if (!data.CategoryName || !this.validateFormData(data.CategoryName, "require"))
            errors.CategoryName = "Category Name required";
        else if (!data.CategoryName || !this.validateFormData(data.CategoryName, "length", { max: 50 }))
            errors.CategoryName = "Maximum 50 characters are allowed.";
        else if (!data.CategoryName || !this.validateFormData(data.CategoryName, "special-characters-not-allowed", /[`!@#$%^&*()+=\[\]{};:"\\|,.<>\/?~]/))
            errors.CategoryName = "special characters are not allowed.";

        if (!data.CategoryDescription || !this.validateFormData(data.CategoryDescription, "require"))
            errors.CategoryDescription = "Category Description required";
        else if (!data.CategoryDescription || !this.validateFormData(data.CategoryDescription, "length", { max: 100 }))
            errors.CategoryDescription = "Maximum 100 characters are allowed.";

        return Object.keys(errors).length === 0 ? null : errors;
    }

    render() {
        let { data, isLoading } = this.state
        return (
            <div>
                <div className="model-popup">
                    <div className="modal fade show d-block">
                        <div
                            className={
                                "modal-dialog modal-dialog-centered modal-dialog-scrollable md"
                            }
                        >
                            <div className="modal-content">

                                <div className="modal-header">
                                    <h5 className="modal-title">{this.props.popup.type + " Category"} </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => { this.props.handleClose() }}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                {isLoading ? <Loader /> :
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className={"form-group " + "Type"}>
                                                    <label htmlFor={"type"}>{"Type"}</label>
                                                    <div className="input-group">
                                                        <div className="form-check form-check-inline" onClick={() => (this.props.popup.type !== "Update" ? this.onRadiochange("agent") : null)}>
                                                            <input className="form-check-input" disabled={this.props.popup.type === "Update"} type="radio" name="Type" id="agent"
                                                                onChange={() => this.onRadiochange("agent")} value={data.Type}
                                                                checked={data.Type === "agent"} />
                                                            <label className="form-check-label" htmlFor="IsActiveYes">Agent</label>
                                                        </div>
                                                        <div className="form-check form-check-inline" onClick={() => (this.props.popup.type !== "Update" ? this.onRadiochange("customer") : null)}>
                                                            <input className="form-check-input" disabled={this.props.popup.type === "Update"} type="radio" name="Type" id="Customer"
                                                                value={data.Type} onChange={() => this.onRadiochange("customer")}
                                                                checked={data.Type === "customer"} />
                                                            <label className="form-check-label" htmlFor="IsActiveNo">Customer</label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-12">
                                                {this.renderInput("CategoryName", "Category Name")}
                                            </div>
                                            <div className="col-md-12">
                                                {this.renderTextarea("CategoryDescription", "Category Description")}
                                            </div>
                                            {this.props.popup.type !== "Add" &&
                                                (<div className="col-md-6">
                                                    <div className={"form-group " + "IsActive"}>
                                                        <label htmlFor={"IsActive"}>{"Active"}</label>
                                                        <div className="input-group">
                                                            <div className="form-check form-check-inline" onClick={() => this.IsActiveChange(true)}>
                                                                <input className="form-check-input" type="radio" name="IsActive" id="yes" onChange={() => this.IsActiveChange(true)} value={data.IsActive} checked={data.IsActive === true} />
                                                                <label className="form-check-label" htmlFor="IsActiveYes">Yes</label>
                                                            </div>
                                                            <div className="form-check form-check-inline" onClick={() => this.IsActiveChange(false)}>
                                                                <input className="form-check-input" type="radio" name="IsActive" id="no" value={data.IsActive} onChange={() => this.IsActiveChange(false)} checked={data.IsActive === false} />
                                                                <label className="form-check-label" htmlFor="IsActiveNo">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                )}
                                        </div>
                                    </div>
                                }
                                <div class="modal-footer">
                                    {this.state.errors["submit"] && <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                        {this.state.errors["submit"]} </small>}
                                    <button type="button"
                                        onClick={() => { this.props.handleClose() }}
                                        class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-primary"
                                        onClick={() => { this.handleSubmit() }}
                                    >{this.props.popup.type}
                                        {this.state.isSubmitLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            </div>
        )
    }
}

export default Modal
