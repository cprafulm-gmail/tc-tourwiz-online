import React from "react";
import Form from "../components/common/form";
import QuotationMenuPartner from "../components/quotation/quotation-menu-partener";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Loader from "../components/common/loader";
import MessageBar from '../components/admin/message-bar';
import * as Global from "../helpers/global";
import moment from "moment";
import MapLocationSearchInput from "../components/filters/filter-map-autocomplete";
import FileBase64 from "../components/common/FileBase64";
import { Trans } from "../helpers/translate";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Config from "../config.json";

class DealsPartnerForm extends Form {
    constructor(props) {
        super(props);
        this.state = {
            offerImages: [],
            offerPDF: [],
            providerID: this.props.userInfo.portalAgentID,
            mode: this.props.match.params.mode.toLowerCase(),
            showSuccessMessage: false,
            isLoading: false,
            isEditModeLoading: false,
            errors: {},
            CountryList: [],
            LoadingCountryList: false,
            StateList: [],
            LoadingStateList: false,
            CityList: [],
            LoadingCityList: false,
            data: {
                offerID: "",
                name: "",
                businessID: 0,
                description: "",
                ADVT_HTMLText: "<p>Detailed <strong>Info</strong> for an <i>offer</i>.</p>",
                redirectURL: "",
                latitude: "",
                longitude: "",
                locationName: "",//taj mahal
                surroundingArea: "30",
                countryID: "",
                stateID: "",
                cityID: "",
                offerStartDate: moment().add(10, 'd').format(Global.DateFormate),
                offerEndDate: moment().add(20, 'd').format(Global.DateFormate),
                status: "",
                images: [],
                imagesURL: [],
                offerPDF: []
            },
            sampleImageObj: {
                fileExtension: "",
                fileContentType: "",
                fileData: "",
                fileName: "",
            }
        };
    }
    handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                this.props.history.push(`/Backoffice/${req}`);
            else {
                this.props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            this.props.history.push(`${req}`);
        }
    };
    getBranchList = () => {
        const { providerID, data } = this.state;
        const reqOBJ = {
            request: {
            }
        };
        let reqURL = "admin/lookup/branch";
        this.setState({ LoadingBranchList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ BranchList: resonsedata.response, LoadingBranchList: false })
        }.bind(this), "POST");
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
            data.stateID = "";
            data.cityID = "";
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
            if (isLoadingEditMode && data.stateID) {
                this.getCityList(data.stateID, true);
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
                CountryID: data.countryID
            }
        };
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }
    componentDidMount() {
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
        this.getCountryList();
        const { mode, id } = this.props.match.params;
        if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
            this.getOfferDetails(id);
        }
    }
    getOfferDetails = (id) => {
        this.setState({ isLoading: true, isEditModeLoading: true });
        let reqURL = "admin/offer?OfferID=" + this.props.match.params.id;
        apiRequester_unified_api(reqURL, "", function (resonsedata) {
            let data = resonsedata.response.availableOffer[0];
            data.ADVT_HTMLText = resonsedata.response.availableOffer[0].advT_HTMLText;
            data.images = resonsedata.response.imagesdata.map(item => {
                item.offerImageID = item.id;
                delete item["id"];
                return item;
            });
            data.offerPDF = resonsedata.response.pdFdata.map(item => {
                item.offerImageID = item.id;
                delete item["id"];
                return item;
            });
            this.setState({ data, isLoading: false, isEditModeLoading: false }, () => {
                if (this.state.data["countryID"]) this.getStateList(this.state.data["countryID"], true)
            });
        }.bind(this), "GET");
    }
    validateInformation = () => {
        const errors = {};
        const { data, SelectedRoleID, mode } = this.state;

        if (!this.validateFormData(data.name, "require"))
            errors.name = "Name required";
        else if (data.name && !this.validateFormData(data.name, "special-characters-not-allowed", /[<>]/))
            errors.name = "< and > characters not allowed";

        if (data.description && !this.validateFormData(data.description, "special-characters-not-allowed", /[<>]/))
            errors.description = "< and > characters not allowed";

        let offerStartDate = moment(data.offerStartDate);
        let offerEndDate = moment(data.offerEndDate);
        if (offerStartDate.isAfter(offerEndDate))
            errors.offerEndDate = "Offer end date should not be greater than offer start date.";
        if (!this.validateFormData(data.redirectURL, "require"))
            errors.redirectURL = "Redirect URL required";
        else if (data.redirectURL && !this.validateFormData(data.redirectURL, "special-characters-not-allowed", /[<>]/))
            errors.redirectURL = "< and > characters not allowed";
        if (!this.validateFormData(data.description, "require"))
            errors.description = "Description required";
        else if (data.description && !this.validateFormData(data.description, "special-characters-not-allowed", /[<>]/))
            errors.description = "< and > characters not allowed";
        if (this.state.offerImages.filter(x => x.IsDefaultImage).length === 0 && data.images.filter(x => x.isDefaultImage).length === 0)
            errors.LeadImage = "Lead Image Required.";
        /* if (this.state.offerImages.filter(x => !x.IsDefaultImage).length === 0 && data.images.filter(x => !x.isDefaultImage).length === 0)
            errors.OfferImages = "Atlease one offer images required."; */

        if (data.locationName && !this.validateFormData(data.locationName, "alpha_space"))
            errors.locationName = "Invalid Location Name";

        if (data.latitude && !this.validateFormData(data.latitude, "numeric"))
            errors.latitude = "Please enter Latitude in decimal only";

        if (data.longitude && !this.validateFormData(data.longitude, "numeric"))
            errors.longitude = "Please enter Longitude in decimal only";

        return Object.keys(errors).length === 0 ? null : errors;
    }

    saveOfferClick = () => {
        const errors = this.validateInformation();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.saveOffer();
    };
    saveOffer = () => {
        const { mode } = { ...this.state };
        let data = Object.assign({}, this.state.data);
        data.images = data.images.concat(this.state.offerImages);
        data.PDFList = data.offerPDF.concat(this.state.offerPDF);
        delete data["offerPDF"];
        delete data["isActive"];
        delete data["isDeleted"];
        delete data["status"];
        //delete data["offerPDF"];

        let OfferInfo = Object.assign({}, data);
        this.setState({ isLoading: true });
        let reqURL = `admin/partner/offer${mode.toLowerCase() === "add" ? "/add" : "/update"}`;

        let reqOBJ = { request: OfferInfo };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata?.response?.status === "success") {
                    this.setState({ isLoading: false, showSuccessMessage: true });
                }
                else {
                    let { errors } = this.state;
                    errors.SaveError = "Oops! something went wrong";
                    this.setState({ isLoading: false, errors });
                }
            }.bind(this),
            "POST"
        );
    };
    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "countryID")
            this.getStateList(e.target.value);
        if (e.target.name === "stateID")
            this.getCityList(e.target.value);
    }
    getFiles(isLeadImage, mode, files) {
        this.setState({ files: files, uploadDocValidationLeadImage: "", uploadDocValidationPDF: "", uploadDocValidationImage: "" });
        if (files && files !== "undefined" && files.base64 && files.base64 !== "undefined") {
            if (mode === "image" && files.file.size > 1024000) {
                if (isLeadImage) {
                    this.setState({ uploadDocValidationLeadImage: "File size should not be greater then 1 MB." });
                }
                else {
                    this.setState({ uploadDocValidationImage: "File size should not be greater then 1 MB." });
                }

                return;
            }
            if (mode === "pdf" && files.file.size > 5120000) {
                this.setState({ uploadDocValidationPDF: "File size should not be greater then 5 MB." });
                return;
            }

            let errors = Object.assign({}, this.state.errors);
            if (isLeadImage) {
                delete errors["LeadImage"];
                delete errors["uploadDocValidationLeadImage"];
            }
            else if (mode === "pdf") {
                delete errors["uploadDocValidationPDF"];
            }
            let tempRawData = "";
            if (this.state.files.base64.includes("data:image/jpeg;base64,")) {
                tempRawData = this.state.files.base64.replace(
                    "data:image/jpeg;base64,",
                    ""
                );
            } else if (
                this.state.files.base64.includes("data:image/png;base64,", "")
            ) {
                tempRawData = this.state.files.base64.replace(
                    "data:image/png;base64,",
                    ""
                );
            } else if (
                this.state.files.base64.includes("data:application/msword;base64,", "")
            ) {
                tempRawData = this.state.files.base64.replace(
                    "data:application/msword;base64,",
                    ""
                );
            } else if (
                this.state.files.base64.includes("data:application/pdf;base64,", "")
            ) {
                tempRawData = this.state.files.base64.replace(
                    "data:application/pdf;base64,",
                    ""
                );
            } else if (
                this.state.files.base64.includes(
                    "data:application/x-zip-compressed;base64,",
                    ""
                )
            ) {
                tempRawData = this.state.files.base64.replace(
                    "data:application/x-zip-compressed;base64,",
                    ""
                );
            } else if (
                this.state.files.base64.includes(
                    "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
                    ""
                )
            ) {
                tempRawData = this.state.files.base64.replace(
                    "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
                    ""
                );
            }
            let filedata_base64 = tempRawData;
            const reqOBJ = {
                Name: this.state.files.name,
                Extension: this.state.files.name.split('.').at(-1),
                ContentType: this.state.files.type,
                Data: filedata_base64,
            };
            let reqURL = "tw/image/validate";
            this.setState({ isSaving: true });
            apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
                if (resonsedata && resonsedata.response && resonsedata.response.toLowerCase() === "success") {
                    if (mode === "image" && this.state.files.type.includes("image/")) {
                        let offerImages = this.state.offerImages;
                        if (isLeadImage)
                            offerImages = offerImages.filter(x => !x.IsDefaultImage);
                        let sampleImageObj = {
                            id: this.generateUUID(),
                            IsDefaultImage: isLeadImage,
                            fileExtension: this.state.files.name.split('.').at(-1),
                            fileContentType: this.state.files.type,
                            fileData: this.state.files.base64,
                            fileName: this.state.files.name,
                        };

                        offerImages.push(sampleImageObj);
                        this.setState({ offerImages });
                    }
                    else if (mode === "pdf" && this.state.files.type === "application/pdf") {
                        let offerPDF = this.state.offerPDF;
                        let sampleImageObj = {
                            id: this.generateUUID(),
                            fileExtension: this.state.files.name.split('.').at(-1),
                            fileContentType: this.state.files.type,
                            fileData: this.state.files.base64,
                            fileName: this.state.files.name,
                        }
                        offerPDF.push(sampleImageObj);
                        this.setState({ offerPDF });
                    }
                    else if (mode === "image" && !this.state.files.type.includes("image/")) {
                        if (isLeadImage)
                            this.setState({ uploadDocValidationLeadImage: "Invalid file selected." });
                        else
                            this.setState({ uploadDocValidationImage: "Invalid file selected." });
                    }
                    else if (mode === "pdf" && !this.state.files.type.includes("pdf/")) {
                        this.setState({ uploadDocValidationPDF: "Invalid file selected." });
                    }
                }
                else {
                    if (mode === "image") {
                        if (isLeadImage)
                            this.setState({
                                uploadDocValidationLeadImage: "Invalid file selected.",
                            });
                        else
                            this.setState({ uploadDocValidationImage: "Invalid file selected." });
                    }
                    else if (mode === "pdf") {
                        let packageBrochure = this.state.packageBrochure;
                        if (!packageBrochure) {
                            this.setState({
                                uploadDocValidationPDF: "Invalid file selected.",
                                packageBrochure,
                            });
                            return;
                        }
                        packageBrochure.shift();
                        this.setState({
                            uploadDocValidationPDF: "Invalid file selected.",
                            packageBrochure,
                        });
                    }
                }
            }.bind(this), "POST");
        }
        else if (mode === "image" && !this.state.files.type.includes("image/")) {
            if (isLeadImage)
                this.setState({ uploadDocValidationLeadImage: "Invalid file selected." });
            else
                this.setState({ uploadDocValidationImage: "Invalid file selected." });
        }
        else if (mode === "pdf" && !this.state.files.type.includes("pdf/")) {
            this.setState({ uploadDocValidationPDF: "Invalid file selected." });
        }
    }
    RedirectToList = () => {
        this.props.history.push(`/Partner-Deals`);
    };

    generateUUID = () => {
        let dt = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    };

    removeImage = (id) => {
        let offerImages = this.state.offerImages.filter(x => x.id !== id);
        let data = this.state.data;
        if (data.images && data.images.filter(x => x.offerImageID === id).length > 0)
            data.images.filter(x => x.offerImageID === id)[0].isDeleted = 1;
        if (data.imagesURL && data.imagesURL.filter(x => x.id === id).length > 0)
            data.imagesURL.filter(x => x.id === id)[0].isDeleted = 1;
        this.setState({ offerImages, data });
    }

    removePDF = (id) => {
        let offerPDF = this.state.offerPDF.filter(x => x.id !== id);
        let data = this.state.data;
        if (data.offerPDF && data.offerPDF.filter(x => x.offerImageID === id).length > 0)
            data.offerPDF.filter(x => x.offerImageID === id)[0].isDeleted = 1;
        this.setState({ offerPDF, data });
    }

    updateHTML = (htmldata) => {
        let data = this.state.data;
        data.ADVT_HTMLText = htmldata;
        this.setState({ data });
    };
    RedirectToListPage = () => {
        this.props.history.push(`/Partner-Deals`);
    };
    filterResults = (contolName, locationName, lat, long) => {
        let data = this.state.data;
        data.latitude = lat;
        data.locationName = locationName;
        data.longitude = long;
        this.setState({ data });
    }
    render() {
        const { data, errors, mode, isLoading, isEditModeLoading, CountryList, StateList, CityList, LoadingCountryList, LoadingStateList, LoadingCityList, showSuccessMessage } = this.state;
        const disabled = (mode === "view");
        const isEditMode = (mode === "edit");
        const Business = Global.getEnvironmetKeyValue("availableBusinesses").map(
            business => {
                return { value: business.aliasId ? business.aliasId : business.id, name: Trans("_" + business.name) };
            }
        );
        Business.splice(0, 0, {
            id: "0",
            value: 0,
            name: Trans("_all")
        });

        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            {mode === "add" ? "Add " : mode === "view" ? "View " : "Edit "}Offer
                            <span className="pull-right">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => (this.RedirectToListPage())}
                                >
                                    Back
                                </button>
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenuPartner handleMenuClick={this.handleMenuClick} />
                        </div>
                        {isEditModeLoading && (
                            <div className="col-lg-8">
                                <div className="container ">
                                    <Loader />
                                </div>
                            </div>
                        )}
                        {!isEditModeLoading && (
                            <div className="col-lg-9 ">
                                <div className="container ">
                                    {showSuccessMessage &&
                                        <MessageBar Message={`Offer ${mode === "add" ? "added" : "updated"} successfully.`} handleClose={() => this.RedirectToList()} />
                                    }
                                    {data.status === "REJECTED" &&
                                        <div className="col-lg-12 alert alert-danger mt-2 p-1 d-inline-block">
                                            <p className="m-2">Your offer has been <strong>Rejected</strong> due to below reason.</p>
                                            <blockquote className="m-2 ml-4"><i>{data.statusReason}</i></blockquote>
                                        </div>
                                    }
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Offer Details
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("name", "Name *", "text", disabled, '', 2, 100)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderPassportExpiryDate("offerStartDate", "Offer Start Date", moment().add(70, 'y').format(Global.DateFormate))}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderPassportExpiryDate("offerEndDate", "Offer End Date", moment().add(70, 'y').format(Global.DateFormate))}
                                            </div>
                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                {this.renderTextarea("description", "Description", "Description", "textarea", disabled)}
                                            </div>
                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                {this.renderSelect("businessID", "Product", Business)}
                                            </div>
                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                {this.renderInput("redirectURL", "Redirect URL *", "text", disabled)}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "CountryID"}>
                                                    <label htmlFor={"CountryID"}>{"Country"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.countryID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"countryID"}
                                                            id={"countryID"}
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
                                                    {errors["countryID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["countryID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "StateID"}>
                                                    <label htmlFor={"StateID"}>{"State"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.stateID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"stateID"}
                                                            id={"stateID"}
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
                                                    {errors["StateID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["StateID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "cityID"}>
                                                    <label htmlFor={"cityID"}>{"City"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.cityID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"cityID"}
                                                            id={"cityID"}
                                                            disabled={disabled}
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
                                                    {errors["cityID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["cityID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "IsActive"}>
                                                    <label htmlFor={"IsActive"}>{"Active"}</label>
                                                    <div className="input-group">
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" disabled={disabled} type="radio" name="IsActive" id="yes" onClick={() => this.IsActiveChange(true)} value={true} checked={data.IsActive === true} />
                                                            <label className="form-check-label" htmlFor="IsActiveYes">Yes</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" disabled={disabled} type="radio" name="IsActive" id="no" value={false} onClick={() => this.IsActiveChange(false)} checked={data.IsActive === false} />
                                                            <label className="form-check-label" htmlFor="IsActiveNo">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                        </div>

                                    </div>
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Other Details
                                        </h5>
                                        <div className="row">
                                            {window.google &&
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <MapLocationSearchInput
                                                        minValue={this.state.data.latitude ?? null}
                                                        maxValue={this.state.data.longitude ?? null}
                                                        locationName={this.state.data.locationName}
                                                        name={"partner-offer-location"}
                                                        handleFilters={this.filterResults}
                                                    />
                                                    {/* {this.renderInput("locationName", "Location Name", "text", disabled)} */}
                                                </div>
                                            }
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("latitude", "Latitude", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("longitude", "longitude", "text", disabled)}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12 col-md-6 col-sm-12">
                                                {/* {this.renderTextarea("ADVT_HTMLText", "Offer details", "Detailed Info for an offer.", disabled)} */}
                                                <div className="form-group locationName">
                                                    <label htmlFor="locationName">Offer details</label>
                                                    <CKEditor
                                                        editor={ClassicEditor} config={Global.toolbarFCK}
                                                        data={this.state.data.ADVT_HTMLText}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            this.updateHTML(data);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Lead Image
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-8 col-md-6 col-sm-12">
                                                <FileBase64
                                                    multiple={false}
                                                    onDone={this.getFiles.bind(this, true, 'image')}
                                                    name="uploadDocument"
                                                    label={"Upload Image"}
                                                    placeholder={"Select Image file"}
                                                    className="w-100 col-lg-12"
                                                />
                                            </div>


                                        </div>
                                        <div className="row">
                                            {this.state.uploadDocValidationLeadImage &&
                                                <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                                    {this.state.uploadDocValidationLeadImage}
                                                </small>
                                            }
                                            {errors["LeadImage"] && (
                                                <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                                    {errors["LeadImage"]}
                                                </small>
                                            )}
                                        </div>
                                        <div className="row">
                                            {this.state.data.images?.filter(x => x.isDefaultImage && !x.isDeleted).map((item, index) => {
                                                return <div className="col-lg-4 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>
                                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removeImage(item.offerImageID)}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <img src={item.url} className="img-fluid img-thumbnail" />
                                                </div>
                                            })}
                                            {!this.state.uploadDocValidationLeadImage && this.state.offerImages?.filter(x => x.IsDefaultImage).map((item, index) => {
                                                return <div className="col-lg-4 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>
                                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removeImage(item.id)}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <img src={item.fileData} className="img-fluid img-thumbnail" />
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Offer Images
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-8 col-md-6 col-sm-12">
                                                <FileBase64
                                                    multiple={false}
                                                    onDone={this.getFiles.bind(this, false, 'image')}
                                                    name="uploadDocument"
                                                    label={"Upload Image"}
                                                    placeholder={"Select Image file"}
                                                    className="w-100 col-lg-12"
                                                />
                                            </div>


                                        </div>
                                        <div className="row">
                                            {this.state.uploadDocValidationImage &&
                                                <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                                    {this.state.uploadDocValidationImage}
                                                </small>
                                            }
                                            {errors["OfferImages"] && (
                                                <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                                    {errors["OfferImages"]}
                                                </small>
                                            )}
                                        </div>
                                        <div className="row">
                                            {this.state.data.images?.filter(x => !x.isDefaultImage && !x.isDeleted).map((item, index) => {
                                                return <div className="col-lg-4 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>
                                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removeImage(item.offerImageID)}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <img src={item.url} className="img-fluid img-thumbnail" />
                                                </div>
                                            })}
                                            {!this.state.uploadDocValidationImage && this.state.offerImages?.filter(x => !x.IsDefaultImage).map((item, index) => {
                                                return <div className="col-lg-4 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>
                                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removeImage(item.id)}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <img src={item.fileData} className="img-fluid img-thumbnail" />
                                                </div>
                                            })}

                                        </div>
                                    </div>
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Documents (PDF Only)
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-8 col-md-6 col-sm-12">
                                                <FileBase64
                                                    multiple={false}
                                                    onDone={this.getFiles.bind(this, false, 'pdf')}
                                                    name="uploadDocument"
                                                    label={"Upload PDF"}
                                                    placeholder={"Select PDF file"}
                                                    className="w-100 col-lg-12"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            {this.state.uploadDocValidationPDF &&
                                                <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                                    {this.state.uploadDocValidationPDF}
                                                </small>
                                            }
                                        </div>
                                        <div className="row mb-3">
                                            {this.state.data?.offerPDF?.filter(x => !x.isDeleted).map((item, index) => {
                                                return <div className="col-lg-8 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>
                                                    <div className="alert alert-warning alert-dismissible fade show">
                                                        <span><a className="btn btn-link  text-primary" href={item.fileURL} target="_blank" download={`offer${index + 1}.pdf`}>Download PDF {index + 1}</a></span>
                                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removePDF(item.offerImageID)}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            })}
                                            {!this.state.uploadDocValidationPDF && this.state.offerPDF?.map((item, index) => {
                                                return <div className="col-lg-8 col-md-6 col-sm-12 mt-3 " role="alert" key={index}>

                                                    <div className="alert alert-warning alert-dismissible fade show">
                                                        {item.fileName}
                                                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.removePDF(item.id)}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            })}
                                        </div>

                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            {errors["SaveError"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["SaveError"]}
                                                </small>
                                            )}
                                            {!disabled &&
                                                <button
                                                    className="btn btn-primary mr-2 float-right"
                                                    type="submit"
                                                    onClick={() => this.saveOfferClick()}
                                                >
                                                    {isLoading ? (
                                                        <span
                                                            className="spinner-border spinner-border-sm mr-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                    ) : null}
                                                    Save
                                                </button>
                                            }
                                            <button
                                                className="btn btn-secondary mr-2 float-right"
                                                type="submit"
                                                onClick={() => this.RedirectToList()}
                                            >
                                                {disabled ? "Back" : "Cancel"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default DealsPartnerForm;

const status = [
    { value: "CREATED", name: "Draft" },
    { value: "REQUESTFORPUBLISH", name: "Request For Publish" },
    { value: "PUBLISHED", name: "Published" },
    { value: "REJECTED", name: "Rejected" }
];
