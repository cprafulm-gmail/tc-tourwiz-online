import React, { Component } from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import moment from "moment";

class UmrahPackageFlightDetails extends Form {
    state = {
        data: {
            "arrivalairportcode": this.props.data?.arrivalairportcode ? this.props.data.arrivalairportcode : '',
            "arrivalflightnumber": this.props.data?.arrivalflightnumber ? this.props.data.arrivalflightnumber : '',
            "arrivaldate": this.props.data?.arrivaldate ? this.props.data.arrivaldate : '',
            "arrivaltime": this.props.data?.arrivaltime ? this.props.data.arrivaltime : '',
            "departureairportcode": this.props.data?.departureairportcode ? this.props.data.departureairportcode : '',
            "departureflightnumber": this.props.data?.departureflightnumber ? this.props.data.departureflightnumber : '',
            "departuredate": this.props.data?.departuredate ? this.props.data.departuredate : '',
            "departuretime": this.props.data?.departuretime ? this.props.data.departuretime : ''
        },
        errors: {},
    }


    handleChildSubmit = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        //if (errors) return;
        let data = this.state.data;
        this.props.getUmrahFlightDeteils({
            data: data,
            isErrors: errors !== null,
        });
    };

    validate = () => {
        const errors = {};
        const { data } = this.state;
        if (!this.validateFormData(data.arrivalairportcode, "require"))
            errors.arrivalairportcode = Trans("_error_arrivalairportcode_require");
        if (!this.validateFormData(data.arrivalflightnumber, "require"))
            errors.arrivalflightnumber = Trans("_error_arrivalflightnumber_require");
        if (!this.validateFormData(data.arrivaldate, "require"))
            errors.arrivaldate = Trans("_error_arrivaldate_require");
        // if (!this.validateFormData(data.arrivaltime, "require"))
        //     errors.arrivaltime = Trans("_error_arrivaltime_require");
        if (!this.validateFormData(data.departureairportcode, "require"))
            errors.departureairportcode = Trans("_error_departureairportcode_require");
        if (!this.validateFormData(data.departureflightnumber, "require"))
            errors.departureflightnumber = Trans("_error_departureflightnumber_require");
        if (!this.validateFormData(data.departuredate, "require"))
            errors.departuredate = Trans("_error_departuredate_require");
        // if (!this.validateFormData(data.departuretime, "require"))
        //     errors.departuretime = Trans("_error_departuretime_require");
        return Object.keys(errors).length === 0 ? null : errors;
    };
    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    render() {
        const umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"));
        let startdate = moment(new Date(umrahPackageDetails.startDate)).add(-1, 'days').set({h: 0, m: 0});
        let enddate = moment(new Date(umrahPackageDetails.endDate)).add(-1, 'days').set({h: 0, m: 0});
        return (
            <div className="quotation-create border mt-3 bg-white shadow-sm mb-3 position-relative">
                <div class="border-bottom bg-light d-flex p-3">
                    <div class="mr-auto d-flex align-items-center">
                        <h6 class="font-weight-bold m-0 p-0">Flight Details</h6>
                    </div>
                </div>
                <div className="p-3">
                    <div className="row">
                        <div className="col-lg-3">
                            {/* {this.renderInput("arrivalairportcode", Trans("_umrahpackagearrivalairportcode"))} */}
                            {this.renderSelect("arrivalairportcode", Trans("_umrahpackagearrivalairportcode"),
                                [{
                                    "key": "--select--",
                                    "value": "",
                                },
                                {
                                    "key": "Medina Airport, Saudi Arabia",
                                    "value": "MED",
                                },
                                {
                                    "key": "Jeddah Airport, Saudi Arabia",
                                    "value": "JED",
                                }]
                                , "value", "key")}
                        </div>
                        <div className="col-lg-3">
                            {this.renderInput("arrivalflightnumber", Trans("_umrahpackagearrivalflightnumber"))}
                        </div>
                        <div className="col-lg-3">
                            {this.renderPassportExpiryDate("arrivaldate", Trans("_umrahpackagearrivaldate"), startdate, "withtime", 1)}
                        </div>
                        {/* <div className="col-lg-3">
                            {this.renderInput("arrivaltime", Trans("_umrahpackagearrivaltime"), "text")}
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-lg-3">
                            {this.renderSelect("departureairportcode", Trans("_umrahpackagedepartureairportcode"),
                                [{
                                    "key": "--select--",
                                    "value": "",
                                },
                                {
                                    "key": "Medina Airport, Saudi Arabia",
                                    "value": "MED",
                                },
                                {
                                    "key": "Jeddah Airport, Saudi Arabia",
                                    "value": "JED",
                                }]
                                , "value", "key")}
                        </div>
                        <div className="col-lg-3">
                            {this.renderInput("departureflightnumber", Trans("_umrahpackagedepartureflightnumber"))}
                        </div>
                        <div className="col-lg-3">
                            {this.renderPassportExpiryDate("departuredate", Trans("_umrahpackagedeparturedate"), enddate, "withtime", 2)}
                        </div>
                        {/* <div className="col-lg-3">
                            {this.renderInput("departuretime", Trans("_umrahpackagedeparturetime"), "text")}
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default UmrahPackageFlightDetails;

