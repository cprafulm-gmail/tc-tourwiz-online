import React from 'react'
import Form from "../../components/common/form"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader"

export class Modal extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                BranchName: null,
                Address1: null,
                Address2: null,
                CityId: null,
                StateId: null,
                CountryId: null,
                PostalCode: null,
                ContactPerson: null,
                CellPhone: null,
                ParentBranchID: ""
            },
            errors: {},
            parentBranch: [],
            CountryList: [],
            StateList: [], CityList: [],
            isLoading: false,
            isSubmitLoading: false,
        };
    }

    componentDidMount() {
        this.getParentBranch()
        this.getCountry()
        if (this.props.popup.type !== "Add") {
            this.setState({ isLoading: true })
            let data = this.state.data;
            let fData = this.props.popup.data
            data["Address1"] = fData["address1"]
            data["Address2"] = fData["address2"]
            data["BranchName"] = fData["name"]
            data["CellPhone"] = fData["phone1"]
            data["ContactPerson"] = fData["contactPerson"]
            data["ParentBranchID"] = fData["parentBranchID"]
            data["CityId"] = fData["city"]
            data["CountryId"] = fData["country"]
            data["StateId"] = fData["state"]
            data["ProviderBranchID"] = fData["providerBranchID"]
            data["PostalCode"] = fData["postalCode"]
            // cityName: "Mumbai"

            // rowNum: 1
            // totalRows: 1
            this.setState({ data, isLoading: false }, () => {
                this.getStateList(this.state.data["CountryId"], true)
                //  this.setState({ isLoading: false })
            })
        }
    }

    getParentBranch() {
        let reqOBJ = {
            Request: {
                ProviderID: this.props.popup.agentID,
            }
        }

        let reqURL = "admin/lookup/parentbranch"

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                let arr = [{ name: "Select", value: "" }]
                for (let value of data.response) {
                    arr.push({ name: value.name, value: value.branchId })
                }
                this.setState({ parentBranch: arr })
            }.bind(this),
            "POST"
        );
    }

    getCountry = () => {

        const reqOBJ = {
            request: {
            }
        };
        let reqURL = "admin/lookup/country";
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
            this.setState({ CountryList: resonsedata.response })
        }.bind(this), "POST");
    }

    handleValidations = () => {
        const errors = {};
        const { data } = this.state;

        if (!data.CityId || !this.validateFormData(data.CityId, "require"))
            errors.CityId = "City Name required";

        if (!data.StateId || !this.validateFormData(data.StateId, "require"))
            errors.StateId = "State Name required";

        if (!data.CountryId || !this.validateFormData(data.CountryId, "require"))
            errors.CountryId = "Country Name required";

        if (!data.BranchName || !this.validateFormData(data.BranchName, "require"))
            errors.BranchName = "Branch Name required";

        if (!data.ParentBranchID || !this.validateFormData(data.ParentBranchID, "require"))
            errors.ParentBranchID = "Branch Name required";

        if (!data.PostalCode || !this.validateFormData(data.PostalCode, "require"))
            errors.PostalCode = "Pin Code required";

        if (!data.Address1 || !this.validateFormData(data.Address1, "require"))
            errors.Address1 = "Address1 required";

        if (!data.CellPhone || !this.validateFormData(data.CellPhone, "require"))
            errors.CellPhone = "Phone Number required";

        if (!data.ContactPerson || !this.validateFormData(data.ContactPerson, "require"))
            errors.ContactPerson = "Contact Person required";

        return Object.keys(errors).length === 0 ? null : errors;
    }

    handleSubmit = () => {
        const errors = this.handleValidations();

        this.setState({ errors: errors || {} });
        if (errors) return;

        this.setState({ isSubmitLoading: true })

        if (this.props.popup.type === "Add") {
            let reqOBJ = {
                request: {
                    ...this.state.data,
                }
            }

            let reqURL = "admin/branch/add"
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
                        this.setState({ errors, isSubmitLoading: false })
                        this.props.getBranch()
                        this.props.handleClose(true)
                    }

                }.bind(this),
                "POST"
            );
        }
        else {

            let reqOBJ = {
                request: {
                    ...this.state.data,
                    // ClassId: this.props.popup.classID,
                    ProviderId: this.props.popup.agentID
                }
            }

            let reqURL = "admin/branch/update"
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
                        this.setState({ errors, isSubmitLoading: false })
                        this.props.getBranch()
                        this.props.handleClose(true)
                    }
                }.bind(this),
                "POST"
            );
        }
    }

    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "CountryId")
            this.getStateList(e.target.value);
        if (e.target.name === "StateId")
            this.getCityList(e.target.value);
    }

    getStateList = (countryId, isFirstCall) => {
        let { data } = this.state;
        // CityId: null,
        // StateId: null,
        // CountryId: null,
        if (!isFirstCall) {
            data.StateId = "";
            data.CityId = "";
        }

        if (countryId === "") {
            this.setState({ StateList: [], CityList: [], data });
            return;
        }
        const reqOBJ = {
            request: {
                IsActive: "true",
                CountryID: countryId
            }
        };
        let reqURL = "admin/lookup/state";
        this.setState({ LoadingStateList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ StateList: resonsedata.response, CityList: [], data, LoadingStateList: false });
            if (isFirstCall && data.StateId) {
                this.getCityList(data.StateId, true);
            }
        }.bind(this), "POST");
    }
    getCityList = async (stateId, isFirstCall) => {
        let { data } = this.state;
        if (!isFirstCall) {
            data.CityId = "";
        }

        if (stateId === "") {
            this.setState({ CityList: [], data });
            return;
        }
        const reqOBJ = {
            request: {
                IsActive: "true",
                StateID: stateId,
                CountryID: data.CountryId
            }
        };
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }

    render() {
        let { data, CountryList, errors, LoadingStateList,
            StateList, CityList, LoadingCityList, isLoading } = this.state
        let disabled = this.props.popup.type === "View"
        return (
            <div>
                <div className="model-popup">
                    <div className="modal fade show d-block">
                        <div
                            className={
                                "modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                            }
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{this.props.popup.type + " Branch"}</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => { this.props.handleClose() }}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                {!isLoading ?
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                {this.renderInput("BranchName", "Branch Name *", "text", disabled)}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("ContactPerson", "Contact Person *", "text", disabled)}
                                            </div>

                                            <div className="col-md-6">
                                                <div className={"form-group " + "ParentBranch"}>
                                                    <label htmlFor={"ParentBranchID"}>{"Parent Branch *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.ParentBranchID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"ParentBranchID"}
                                                            id={"ParentBranchID"}
                                                            disabled={disabled}
                                                            className={"form-control"}>

                                                            {this.state.parentBranch.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["value"]
                                                                    }
                                                                >
                                                                    {option["name"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors["ParentBranchID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["ParentBranchID"]}
                                                        </small>
                                                    )}
                                                </div>


                                                {/* {this.renderSelect("ParentBranchID", "Parent Branch *", this.state.parentBranch)} */}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("Address1", "Address1 *", "text", disabled)}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("Address2", "Address2", "text", disabled)}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("CellPhone", "Phone Number *", "text", disabled)}
                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "Country"}>
                                                    <label htmlFor={"Country"}>{"Country *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.CountryId}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"CountryId"}
                                                            id={"CountryID"}
                                                            disabled={disabled}
                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {CountryList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["countryId"]
                                                                    }
                                                                >
                                                                    {option["countryName"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors["CountryId"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["CountryId"]}
                                                        </small>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "StateId"}>
                                                    <label htmlFor={"StateId"}>{"State *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.StateId}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"StateId"}
                                                            id={"StateID"}
                                                            disabled={disabled}
                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {StateList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["stateId"]
                                                                    }
                                                                >
                                                                    {option["stateName"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {LoadingStateList ? (
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-2"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    {errors["StateId"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["StateId"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "CityID"}>
                                                    <label htmlFor={"CityID"}>{"City *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.CityId}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"CityId"}
                                                            id={"CityId"}
                                                            disabled={disabled}
                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {CityList && CityList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["cityId"]
                                                                    }
                                                                >
                                                                    {option["cityName"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {LoadingCityList ? (
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-2"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    {errors["CityId"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["CityId"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("PostalCode", "Pin Code *", "text", disabled)}
                                            </div>
                                        </div>
                                    </div>
                                    : <Loader />}
                                <div class="modal-footer">
                                    {this.state.errors["submit"] && <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                        {this.state.errors["submit"]} </small>}
                                    <button type="button"
                                        onClick={() => { this.props.handleClose() }}
                                        class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    {this.props.popup.type !== "View" && <button type="button" class="btn btn-primary"
                                        onClick={() => { this.handleSubmit() }}
                                    >{this.props.popup.type}
                                        {this.state.isSubmitLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                    </button>}
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
