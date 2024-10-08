import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import * as Global from "../../helpers/global";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import MapLocationSearchInput from "../filters/filter-map-autocomplete";
import Config from "../../config.json";

export default class OfferAgentFilters extends Form {
    constructor(props) {
        super(props);

        let businessList = Global.getEnvironmetKeyValue("availableBusinesses").map(
            business => {
                return { value: business.aliasId ? business.aliasId : business.id, name: Trans("_" + business.name) };
            }
        );


        this.state = {
            providerID: this.props.providerId,
            CountryList: [],
            LoadingCountryList: false,
            StateList: [],
            LoadingStateList: false,
            CityList: [],
            LoadingCityList: false,
            data: {
                business: this.props.business,
                name: "",
                city: "",
                state: "",
                country: "",
                status: "",
                locationName: "",
                fromDate: moment().format('YYYY-MM-DD'),
                toDate: moment().add(1, 'M').format('YYYY-MM-DD'),
                startfromDate: moment().format('YYYY-MM-DD'),
                starttoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
                endfromDate: moment().format('YYYY-MM-DD'),
                endtoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
            },
            businessList: businessList,
            errors: {}
        };
    }

    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "country")
            this.getStateList(e.target.value);
        if (e.target.name === "state")
            this.getCityList(e.target.value);
    }

    handleFilters = () => {
        this.props.handleFilters(this.state.data);
    };

    handleResetFilters = () => {
        const data = {
            business: this.props.business,
            name: "",
            city: "",
            state: "",
            country: "",
            locationName: "",
            status: "",
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().add(1, 'M').format('YYYY-MM-DD'),
            startfromDate: moment().format('YYYY-MM-DD'),
            starttoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
            endfromDate: moment().format('YYYY-MM-DD'),
            endtoDate: moment().add(1, 'M').format('YYYY-MM-DD'),
        };
        this.setState({
            data,
        }, this.props.handleFilters(data));

    };

    componentDidMount() {
        this.getCountryList();
        if (!window.google) {
            var GoogleMapKey = "";
            if (Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== "") {
                GoogleMapKey = Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand");
            }
            else {
                GoogleMapKey = Config.GoogleMapKey;
            }
            const googleMapScript = document.createElement('script');
            googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GoogleMapKey}&libraries=places`;
            googleMapScript.async = true;
            window.document.body.appendChild(googleMapScript);
            // googleMapScript.addEventListener('load', () => {
            //                     getLatLng();
            //                 });
        }
    }

    getCountryList = () => {
        const { providerID } = this.state;
        const reqOBJ = {
            request: {
            }
        };
        let reqURL = "admin/lookup/country";
        this.setState({ LoadingCountryList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
            this.setState({ CountryList: resonsedata.response, LoadingCountryList: false })
        }.bind(this), "POST");
    }
    getStateList = (countryId, isLoadingEditMode) => {
        let { data } = this.state;
        if (!isLoadingEditMode) {
            data.state = "";
            data.city = "";
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
            if (isLoadingEditMode && data.state) {
                this.getCityList(data.state, true);
            }
        }.bind(this), "POST");
    }
    getCityList = (stateId, isLoadingEditMode) => {
        let { data } = this.state;
        if (!isLoadingEditMode)
            data.cityID = "";
        if (stateId === "") {
            this.setState({ CityList: [], data });
            return;
        }
        const reqOBJ = {
            request: {
                IsActive: "true",
                StateID: stateId,
                CountryID: data.country
            }
        };
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }

    filterResults = (contolName, locationName, lat, long) => {
        let data = this.state.data;
        data.locationName = locationName;
        this.setState({ data });
    }

    render() {
        const { data, CountryList, StateList, CityList, LoadingCountryList, LoadingStateList, LoadingCityList } = this.state;
        const Business = this.state.businessList;
        if (Business && Business.length > 0 && Business[0].id !== "") {
            Business.splice(0, 0, {
                id: "",
                name: Trans("_all")
            });
        }
        return (
            <React.Fragment>

                <div className="mb-3 col-12 pl-0 pr-0">
                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                        <h5 className="text-primary border-bottom pb-2 mb-2">
                            Filters
                            {/* <button
                            type="button"
                            className="close"
                            onClick={this.props.showHideFilters}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button> */}
                        </h5>

                        <div className="row">
                            {this.props.offertype === "Agent" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("business", "Product", Business)}
                                </div>
                            }
                            <div className="col-lg-3">
                                {this.renderInput("name", "Name")}
                            </div>

                            {this.props.offertype !== "Agent" &&
                                <div className="col-lg-3">
                                    {this.renderSelect("status", "Status", OfferStatus)}
                                </div>
                            }

                            {this.props.offertype !== "Agent" &&
                                <React.Fragment>
                                    <div className="col-lg-3">
                                        {this.renderCurrentDateWithDuration("startfromDate", "Start Date", '2010-01-01')}
                                    </div>

                                    <div className="col-lg-3">
                                        {this.renderCurrentDateWithDuration("endtoDate", "End Date", '2010-01-01', this.state.data.endfromDate)}
                                    </div>
                                </React.Fragment>
                            }

                            {this.props.offertype === "Agent" &&
                                <React.Fragment>
                                    <div className="col-lg-3">
                                        {this.renderCurrentDateWithDuration("fromDate", (this.state.data.dateMode === "specific-date" ? "Specific Date" : "Start Date"), moment())}
                                    </div>

                                    <div className="col-lg-3">
                                        {this.renderCurrentDateWithDuration("toDate", "End Date", moment(), this.state.data.fromDate)}
                                    </div>
                                </React.Fragment>
                            }
                            {this.props.offertype === "Agent" &&
                                <React.Fragment>
                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                        <div className={"form-group " + "Country"}>
                                            <label htmlFor={"Country"}>{"Country"}</label>
                                            <div className="input-group">
                                                <select
                                                    value={data.country}
                                                    onChange={(e) => this.handleDataChange(e)}
                                                    name={"country"}
                                                    id={"country"}
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
                                                {LoadingCountryList ? (
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
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                        <div className={"form-group " + "State"}>
                                            <label htmlFor={"State"}>{"State"}</label>
                                            <div className="input-group">
                                                <select
                                                    value={data.state}
                                                    onChange={(e) => this.handleDataChange(e)}
                                                    name={"state"}
                                                    id={"state"}
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
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                        <div className={"form-group " + "city"}>
                                            <label htmlFor={"city"}>{"City"}</label>
                                            <div className="input-group">
                                                <select
                                                    value={data.city}
                                                    onChange={(e) => this.handleDataChange(e)}
                                                    name={"city"}
                                                    id={"city"}
                                                    className={"form-control"}>
                                                    <option key={0} value={''}>Select</option>
                                                    {CityList.map((option, key) => (

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
                                        </div>
                                    </div>
                                    {window.google &&
                                        <div className="col-lg-3">
                                            <MapLocationSearchInput
                                                key={this.state.data.locationName}
                                                minValue={this.state.data.latitude ?? null}
                                                maxValue={this.state.data.longitude ?? null}
                                                locationName={this.state.data.locationName}
                                                name={"partner-offer-location"}
                                                handleFilters={this.filterResults}
                                            />
                                        </div>
                                    }
                                </React.Fragment>
                            }
                            <div className="col-lg-3">

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
            </React.Fragment>
        );
    }
}

const OfferStatus = [
    { value: "all", name: "All" },
    { value: "CREATED", name: "Draft" },
    { value: "REQUESTFORPUBLISH", name: "Request For Publish" },
    { value: "PUBLISHED", name: "Published" },
    { value: "REJECTED", name: "Rejected" }
];



  //Filter for report