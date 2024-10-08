import React from 'react'
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";

export class Filter extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                BranchName: "",
                ContactPerson: "",
                CityId: 0,
                StateId: 0,
                CountryId: 0,
            },
            errors: {},
            CountryList: [],
            StateList: [],
            CityList: []
        };
    }

    componentDidMount() {
        this.getCountry()
    }

    handleFilters = () => {
        this.props.handleFilters(this.state.data)
    }

    handleResetFilters = () => {
        this.setState({
            data: {
                BranchName: "",
                ContactPerson: "",
                CityId: 0,
                StateId: 0,
                CountryId: 0,
            }
        }, () => { this.handleFilters() })
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
                CountryID: data.CountryId
            }
        };
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
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

    render() {
        const { data, CountryList, StateList, CityList, errors, LoadingCityList, LoadingStateList } = this.state;
        return (
            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                <h5 className="text-primary border-bottom pb-2 mb-2">
                    Filters
                </h5>
                <div className="row">
                    <div className="col-md-4">
                        {this.renderInput("BranchName", "Branch Name")}
                    </div>
                    <div className="col-md-4">
                        {this.renderInput("ContactPerson", "Contact Person")}
                    </div>
                    <div className="col-md-4">
                        <div className={"form-group " + "Country"}>
                            <label htmlFor={"Country"}>{"Country"}</label>
                            <div className="input-group">
                                <select
                                    value={data.CountryId}
                                    onChange={(e) => this.handleDataChange(e)}
                                    name={"CountryId"}
                                    id={"CountryID"}
                                    //   disabled={disabled}
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
                            {errors["CountryID"] && (
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                    {errors["CountryID"]}
                                </small>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className={"form-group " + "StateId"}>
                            <label htmlFor={"StateId"}>{"State"}</label>
                            <div className="input-group">
                                <select
                                    value={data.StateId}
                                    onChange={(e) => this.handleDataChange(e)}
                                    name={"StateId"}
                                    id={"StateID"}
                                    // disabled={disabled}
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
                                    {errors["StateID"]}
                                </small>
                            )}
                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className={"form-group " + "CityID"}>
                            <label htmlFor={"CityID"}>{"City"}</label>
                            <div className="input-group">
                                <select
                                    value={data.CityId}
                                    onChange={(e) => this.handleDataChange(e)}
                                    name={"CityId"}
                                    id={"CityId"}
                                    //disabled={disabled}
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
                            {errors["CityID"] && (
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                    {errors["CityID"]}
                                </small>
                            )}
                        </div>

                    </div>
                    <div className="col-lg-4">
                        <label className="d-block">&nbsp;</label>
                        <button
                            name="Apply"
                            onClick={this.handleFilters.bind(this)}
                            className="btn btn-primary"
                        >
                            Search
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
            </div>
        )
    }
}

export default Filter
