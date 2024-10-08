import React, { Component } from 'react'
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader";
import { Trans } from "../../helpers/translate";
import MessageBar from '../admin/message-bar';

export class SupplierModal extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                BusinessId: null,
                SupplierName: null,
                ContactPerson: null,
                Email: null,
                CurrencyCode: null,
                Address: null,
                IsOfflineSupplier: true,
                Phone: null,
                serviceTaxRegNumber: null,
                Country: null,
                State: null,
                City: null,
                canEdit: true,
                ServiceFee: null,
                Discount: null,
            },
            errors: {},
            businessList: [],
            currencyList: [],
            StateList: [],
            CountryList: [],
            CityList: [],
            isLoading: false,
            isSaveInProgress: false,
            saveError: ""
        };
    }
    componentDidMount() {

        this.getBusinesses();
        this.getCurrency();
        this.getCountry();
        if (this.props.type !== "Add") {
            this.getData()
        }
    }
    getData = () => {
        this.setState({ isLoading: true });
        let reqURL = "reconciliation/supplier/details?providerid=" + this.props.type;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let val = {}
                if (data.response && data.response.length > 0) {
                    data = data.response[0];
                    val["BusinessId"] = data["businessId"]
                    val["SupplierName"] = data["supplierName"]
                    val["ContactPerson"] = data["contactPerson"]
                    val["CurrencyCode"] = data["currencySymbol"]
                    val["Email"] = data["email"]
                    val["Phone"] = data["phone"]
                    val["supplierID"] = data["supplierID"]
                    val["Country"] = data["companyCountry"]
                    val["State"] = data["companyState"]
                    val["City"] = data["companyCity"]
                    val["canEdit"] = parseInt(data["canEdit"]) === 1
                    val["Address"] = data["address"]
                    val["serviceTaxRegNumber"] = data["serviceTaxRegNumber"]
                    // "canEdit": 1
                }
                this.setState({ data: val, isLoading: false }, () => {
                    this.getStateList(this.state.data["Country"], true)
                });
            }.bind(this),
            "GET"
        );

    }
    getCurrency = () => {
        let reqURL = "reconciliation/supplier/currencies"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = [{ name: "Select", value: "" }]
                for (let field of data.response) {
                    arr.push({ name: field["currencyCode"], value: field["currencyCode"] })
                }

                this.setState({ currencyList: arr });
            }.bind(this),
            "GET"
        );
    }
    getBusinesses = () => {
        let reqURL = "reconciliation/supplier/business?providerid=" + this.props.providerID;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = [{ name: "Select", value: "" }]
                for (let field of data.response) {
                    arr.push({ name: field["businessType"] === "Air" ? "Flight" : field["businessType"], value: field["businessTypeId"] })
                }
                this.setState({ businessList: arr });
            }.bind(this),
            "GET"
        );
    }

    handleSubmit = () => {
        const errors = this.validateData();

        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isSaveInProgress: true, saveError: "" });

        let reqURL = `reconciliation/supplier/${this.props.type === "Add" ? "add" : "update"}`;
        let body = {}
        body["request"] = { ...this.state.data };
        if (this.props.type === "Add")
            body["request"]["ProviderId"] = this.props.providerID
        apiRequester_unified_api(
            reqURL,
            body,
            function (data) {
                this.setState({ isSaveInProgress: false })
                if (data && data.response && (data.response.supplierId || data.response.status === "success")) {
                    this.setState({ showSuccessMessage: true });
                }
                else {
                    this.setState({ saveError: data.error })
                }
            }.bind(this)
        );
    }

    getCountry = () => {

        const reqOBJ = {
            request: {
                providerID: this.props.agentID
            }
        };
        let reqURL = "reconciliation/supplier/lookup/country";
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {

            resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
            this.setState({ CountryList: resonsedata.response })
        }.bind(this), "POST");
    }

    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "Country")
            this.getStateList(e.target.value);
        if (e.target.name === "State")
            this.getCityList(e.target.value);
    }

    getStateList = (countryId, isFirstCall) => {
        let { data } = this.state;

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
        let reqURL = "reconciliation/supplier/lookup/state";
        this.setState({ LoadingStateList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ StateList: resonsedata.response, CityList: [], data, LoadingStateList: false });
            if (isFirstCall && data.State) {
                this.getCityList(data.State, true);
            }
        }.bind(this), "POST");
    }
    getCityList = async (stateId, isFirstCall) => {
        let { data } = this.state;
        if (!isFirstCall) {
            data.City = "";
        }

        if (stateId === "") {
            this.setState({ CityList: [], data });
            return;
        }
        const reqOBJ = {
            request: {
                IsActive: "true",
                StateID: stateId,
                CountryID: data.Country
            }
        };
        let reqURL = "reconciliation/supplier/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }

    handleCountryChange = (e) => {
        let data = this.state.data;
        data["Country"] = e.target.value;
        data["City"] = null
        this.setState({ data })
        this.getCity()
    }
    validateData = () => {
        const errors = {};
        const { data } = this.state;

        if (!data.SupplierName || !this.validateFormData(data.SupplierName, "require"))
            errors.SupplierName = "Supplier Name required";
        else if (data.SupplierName && !this.validateFormData(data.SupplierName, "special-characters-not-allowed", /[<>_]/))
            errors.SupplierName = " <,>,_ characters not allowed";

        if (!data.ContactPerson || !this.validateFormData(data.ContactPerson, "require"))
            errors.ContactPerson = "Contact Person required";
        else if (data.ContactPerson && !this.validateFormData(data.ContactPerson, "alpha_space"))
            errors.ContactPerson = "Invalid Contact Person Name";

        if (data.Address && !this.validateFormData(data.Address, "special-characters-not-allowed", /[<>]/))
            errors.Address = "< and > characters not allowed";

        if (data.Phone)
            if (!this.validateFormData(data.Phone, "phonenumber")) errors.Phone = "Invalid Phone Number";

        if (data.Phone &&
            !this.validateFormData(data.Phone, "phonenumber_length", {
                min: 8,
                max: 14,
            })
        )
            errors.Phone = Trans("_error_mobilenumber_phonenumber_length");

        if (!data.Email || !this.validateFormData(data.Email, "require"))
            errors.Email = "Email Addess required";
        else if (!this.validateFormData(data.Email, "email"))
            errors.Email = "Email Address is not valid";

        if (!data.BusinessId || !this.validateFormData(data.BusinessId, "require"))
            errors.BusinessId = "Business required";

        if (!data.Country || !this.validateFormData(data.Country, "require"))
            errors.Country = "Country required";

        // if (!data.City || !this.validateFormData(data.City, "require"))
        //     errors.City = "City required";

        // if (!data.State || !this.validateFormData(data.State, "require"))
        //     errors.State = "State required";

        if (data.serviceTaxRegNumber && !this.validateFormData(data.serviceTaxRegNumber, "special-characters-not-allowed", /[<>]/))
            errors.serviceTaxRegNumber = "< and > characters not allowed";

        if (data.ServiceFee && !this.validateFormData(data.ServiceFee, "numeric"))
            errors.ServiceFee = "Enter Service Fee in decimal only";

        if (data.Discount && !this.validateFormData(data.Discount, "numeric"))
            errors.Discount = "Enter Commission in decimal only";

        return Object.keys(errors).length === 0 ? null : errors;
    }
    render() {
        const { businessList, data, LoadingStateList, StateList,
            CountryList, errors, CityList, currencyList, isLoading,
            LoadingCityList,
            isSaveInProgress, saveError, showSuccessMessage } = this.state;
        const canEdit = data.canEdit;
        return (
            <div>
                <div>
                    <div className="model-popup">
                        <div className="modal fade show d-block">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-capitalize">
                                            {this.props.type === "Add" ? "Add Supplier" : "Edit Supplier"}
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => { this.props.closePopup(false) }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {isLoading && (<Loader />)}
                                    {!isLoading && <div className="modal-body" style={{ display: "grid", placeItems: "center" }}>
                                        {showSuccessMessage &&
                                            <MessageBar Message={`Supplier ${this.props.type === "Add" ? "added" : "updated"} successfully.`} handleClose={() => this.props.closePopup(true)} />
                                        }
                                        <div className="row m-2 border" >
                                            <div className={canEdit ? "col-md-6" : "col-md-6 disable-select"}>
                                                {this.renderSelect("BusinessId", "Business *", businessList, "value", "name", !canEdit)}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("SupplierName", "Supplier *", "text", !canEdit)}
                                            </div >
                                            {this.props.type !== "Add" &&
                                                <div className="col-md-6">
                                                    {this.renderInput("supplierID", "Supplier Id", "text", true)}
                                                </div>
                                            }
                                            <div className="col-md-6">
                                                {this.renderInput("ContactPerson", "Contact Person *")}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("Email", "Email Address *")}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderInput("Address", "Address")}
                                            </div>
                                            <div className="col-md-6">
                                                {this.renderContactInput("Phone", "Contact Phone")}
                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "Country"}>
                                                    <label htmlFor={"Country"}>{"Country *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.Country}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"Country"}
                                                            id={"Country"}
                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {CountryList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["countryID"]
                                                                    }
                                                                >
                                                                    {option["countryName"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors["Country"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["Country"]}
                                                        </small>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "State"}>
                                                    <label htmlFor={"State"}>{"State"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.State}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"State"}
                                                            id={"State"}

                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {StateList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["stateID"]
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
                                                    {errors["State"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["State"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={"form-group " + "City"}>
                                                    <label htmlFor={"City"}>{"City"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.City}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"City"}
                                                            id={"City"}

                                                            className={"form-control"}>
                                                            <option key={0} value={''}>Select</option>
                                                            {CityList && CityList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["cityID"]
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
                                                    {errors["City"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["City"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={canEdit ? "col-md-6" : "col-md-6 disable-select"}>
                                                {this.renderSelect("CurrencyCode", "Currency", currencyList, "value", "name", !canEdit)}
                                            </div>
                                            {/* <div className="col-md-6">
                                                <label className="d-block">&nbsp;</label>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                        onChange={(e) => {
                                                            data["IsOfflineSupplier"] = !data["IsOfflineSupplier"];
                                                            this.setState({ data })
                                                        }} type="checkbox" checked={this.state.data.IsOfflineSupplier} />
                                                    <label className="form-check-label ml-3" for="IsOfflineSupplier">Is Offline Supplier</label>
                                                </div>
                                            </div> */}
                                            <div className="col-md-6">
                                                {this.renderInput("serviceTaxRegNumber", "Tax Number (e.g GST,VAT,IBAN)")}
                                            </div>
                                            <div className="col-md-6 d-none">
                                                {this.renderInput("ServiceFee", "Service Fee (in %)")}
                                            </div>
                                            <div className="col-md-6 d-none">
                                                {this.renderInput("Discount", "Commission (in %)")}
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    <div className="modal-footer">
                                        {saveError && saveError.length > 0 &&
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {saveError}
                                            </small>
                                        }
                                        <button
                                            name="Cancel"
                                            onClick={() => { this.props.closePopup(false) }}
                                            className="btn btn-secondary  float-left mr-2"
                                        >
                                            {Trans("_cancel")}
                                        </button>
                                        <button
                                            name="Submit"
                                            onClick={!isSaveInProgress ? () => this.handleSubmit() : ""}
                                            className="btn btn-primary float-left"
                                        >
                                            {isSaveInProgress ? (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            ) : null}
                                            {Trans("_save")}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                </div>
            </div >
        )
    }
}

export default SupplierModal
