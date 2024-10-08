import React, { Component } from 'react'
import Form from "../../components/common/form"
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { apiRequester } from "../../services/requester";
import FileBase64 from "../../components/common/FileBase64"
import Loader from "../../components/common/loader";
import ShowLogo from "../../components/admin/show-logo";
import MessageBar from '../../components/admin/message-bar';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import { Helmet } from "react-helmet";
export class UpdateProfile extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                City: "",
                State: "",
                Country: "",
                ProviderType: "",
                AgencyName: "",
                Address: "",
                PostalCode: "",
                WebsiteURL: "",
            },
            errors: {},
            StateList: [],
            CityList: [],
            timeZones: [],
            CountryList: [],
            DateFormates: [],
            isLoading: false,
            isSaving: false,
            fileName: "",
            FileToRemove: "",
            showLogo: false,
            saveError: "",
            isShowPopup: false,
            gstnumbercheckbox: true,
            taxationinfocheckbox: false,
            isshowauthorizepopup: false,
            uploadDocValidationImage: ""
        };
    }
    hideauthorizepopup = () => {
        this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
    }

    componentDidMount() {
        this.getCountryList()
        this.getDateFormate()
        this.getTimeZone()
        this.getData()
    }

    closePopup() {
        this.setState({ isShowPopup: false, showSuccessMessage: false });
        window.location.reload();
    }

    handletaxationcheckbox = (e) => {
        let target = e.target;
        if (target.name === "gstnumber") {
            if (target.checked === true) {
                let statedata = this.state.data;
                this.setState({
                    data: statedata,
                    gstnumbercheckbox: true,
                    taxationinfocheckbox: false,
                });
            } else {
                let statedata = this.state.data;
                this.setState({
                    data: statedata,
                    gstnumbercheckbox: false,
                    taxationinfocheckbox: true,
                });
            }
        }
    };

    getData = () => {
        const { userInfo: { agentID, userID } } = this.props;
        const reqOBJ = {
        };
        let reqURL = "admin/user/details";
        this.setState({ isLoading: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {

            let iData = {}
            let data = resonsedata.response[0]
            iData["ProviderId"] = agentID;
            iData["UserId"] = userID;
            iData["ProviderType"] = data["providerType"]
            iData["AgencyName"] = data["agencyName"]
            iData["Address"] = data["address"]
            iData["PostalCode"] = data["pin"]
            iData["City"] = (data["countryId"] != 101 && data["cityId"] == 8) ? "" : data["cityId"]
            iData["State"] = (data["countryId"] != 101 && data["stateId"] == 16) ? "" : data["stateId"]
            iData["Country"] = data["countryId"]
            iData["CellPhoneNumber"] = data["companyPhoneNumber"]
            iData["PhoneNumber"] = data["phoneNumber"]
            iData["CustomerCareEmail"] = data["customerCareEmail"]
            iData["FirstName"] = data["firstName"]
            iData["LastName"] = data["lastName"]
            iData["AlternatePhone"] = data["alternatePhone"]
            iData["EmailId"] = data["email"]
            iData["DateFormate"] = data["dateFormatType"]
            iData["ThemeId"] = data["themeID"]
            iData["CultureId"] = data["cultureID"]
            iData["WebsiteURL"] = data["websiteURL"]

            if (data["gstNo"] !== "" || data["panNo"] !== "" || data["cinNo"] !== "") {
                iData["GSTNo"] = data["gstNo"]
                iData["CINNo"] = data["cinNo"]
                iData["PANNo"] = data["panNo"]
            }
            if (data["ibanNo"] !== "") {
                iData["IBANNo"] = data["ibanNo"]
            }
            iData["Currency"] = data["currencySymbol"]
            iData["TimeZone"] = data["zoneName"]
            iData["LogoPath"] = data["customLogoPath"]
            iData["ProviderContactID"] = data["providerContactID"] ? data["providerContactID"] : 0;
            iData["bankName"] = data["bankName"];
            iData["accountHolderName"] = data["accountHolderName"];
            iData["ifscCode"] = data["ifscCode"];
            iData["swiftCode"] = data["swiftCode"];
            iData["bankBranchName"] = data["bankBranchName"];
            iData["bankAccountNumber"] = data["bankAccountNumber"];
            iData["faceBookURL"] = data["faceBookURL"];
            iData["linkedInURL"] = data["linkedinURL"];
            iData["instagramURL"] = data["instagramURL"];
            let fileName = null;
            if (data["customLogoPath"] && data["customLogoPath"].length > 0) {
                const filepaths = data["customLogoPath"].split("/");
                fileName = filepaths[filepaths.length - 1];
            }

            let selectionoftaxationinfo;
            if (data["gstNo"] !== "" || data["panNo"] !== "" || data["cinNo"] !== "") {
                selectionoftaxationinfo = true;
            }
            else if (data["ibanNo"] !== "") {
                selectionoftaxationinfo = false;
            }
            else {
                selectionoftaxationinfo = true;
            }
            this.setState({ data: iData, fileName, isLoading: false, FileToRemove: fileName, gstnumbercheckbox: selectionoftaxationinfo, taxationinfocheckbox: data["ibanNo"] !== "" ? true : false }, () => {
                this.getStateList(this.state.data["Country"], true)
            })
            // "UserId":15228,

        }.bind(this), "GET");
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

    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "Country")
            this.getStateList(e.target.value);
        if (e.target.name === "State")
            this.getCityList(e.target.value);
    }
    getCountryList = () => {
        const { userInfo: { agentID } } = this.props;

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

        if (!isFirstCall) {
            data.State = "";
            data.City = "";
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
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }
    // setInitData = async (stateId, cityId) => {
    //     let data = this.state.data
    //     data["State"] = stateId
    //     data["City"] = cityId
    //     this.setState({ data })
    // }
    getDateFormate = () => {
        let reqURL = "admin/lookup/dateformat";
        apiRequester_unified_api(reqURL, {}, function (resonsedata) {
            let arr = []
            // zoneName
            for (let value of resonsedata.response) {
                arr.push({ name: value, value })
            }
            this.setState({ DateFormates: arr });

        }.bind(this), "GET");
    }
    getTimeZone = () => {

        let reqURL = "admin/lookup/timezone";
        apiRequester_unified_api(reqURL, {}, function (resonsedata) {
            let arr = []
            // zoneName
            for (let value of resonsedata.response) {
                arr.push({ name: value.zoneName, value: value.zoneName })
            }
            this.setState({ timeZones: arr })
        }.bind(this), "GET");
    }
    getFilesDocument = (files_document) => {
        this.setState({ uploadDocValidationImage: "" });
        if (
            !files_document.file.type.includes("image/")
        ) {
            this.setState({ uploadDocValidationImage: "Invalid file selected." });
            return;
        }
        else if (files_document.file.size > 1024000) {
            this.setState({ uploadDocValidationImage: "File size should not be greater then 1 MB." });
            return;
        }

        let data = { ...this.state.data }
        data["LogoPath"] = files_document.base64;

        let tempRawData = "";
        if (files_document.base64.includes("data:image/jpeg;base64,")) {
            tempRawData = files_document.base64.replace(
                "data:image/jpeg;base64,",
                ""
            );
        } else if (
            files_document.base64.includes("data:image/png;base64,", "")
        ) {
            tempRawData = files_document.base64.replace(
                "data:image/png;base64,",
                ""
            );
        } else if (
            files_document.base64.includes("data:application/msword;base64,", "")
        ) {
            tempRawData = files_document.base64.replace(
                "data:application/msword;base64,",
                ""
            );
        } else if (
            files_document.base64.includes("data:application/pdf;base64,", "")
        ) {
            tempRawData = files_document.base64.replace(
                "data:application/pdf;base64,",
                ""
            );
        } else if (
            files_document.base64.includes(
                "data:application/x-zip-compressed;base64,",
                ""
            )
        ) {
            tempRawData = files_document.base64.replace(
                "data:application/x-zip-compressed;base64,",
                ""
            );
        } else if (
            files_document.base64.includes(
                "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
                ""
            )
        ) {
            tempRawData = files_document.base64.replace(
                "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
                ""
            );
        }

        let filedata_base64 = tempRawData;
        const reqOBJ = {
            Name: files_document.name,
            Extension: "." + files_document.type.split("/")[1],
            ContentType: files_document.type,
            Data: filedata_base64
        };
        let reqURL = "tw/image/validate";
        this.setState({ isSaving: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            if (resonsedata && resonsedata.response && resonsedata.response.toLowerCase() === "success") {

                data["fileExtension"] = "." + files_document.type.split("/")[1];
                data["fileContentType"] = files_document.type;
                data["fileData"] = filedata_base64;
                data["fileName"] = files_document.name;

                this.setState({ data, fileName: files_document.name, isSaving: false });
            }
            else {
                this.setState({ uploadDocValidationImage: "Invalid file selected.", isSaving: false });
                return;
            }
        }.bind(this), "POST");
    }

    validate = () => {
        const errors = {};
        const { data } = this.state;
        if (!this.validateFormData(data.AgencyName, "require"))
            errors.AgencyName = "Agency Name required";
        else if (data.AgencyName && !this.validateFormData(data.AgencyName, "special-characters-not-allowed", /[<>]/))
            errors.AgencyName = "< and > characters not allowed";

        if (!this.validateFormData(data.PostalCode, "require"))
            errors.PostalCode = "Last Name required";
        else if (data.PostalCode && !this.validateFormData(data.PostalCode, "special-characters-not-allowed", /[<>]/))
            errors.PostalCode = "< and > characters not allowed";

        if (!this.validateFormData(data.Address, "require"))
            errors.Address = "Address required";
        else if (data.Address && !this.validateFormData(data.Address, "special-characters-not-allowed", /[<>]/))
            errors.Address = "< and > characters not allowed";

        if (!this.validateFormData(data.Country, "require"))
            errors.Country = "Please select Country";

        if (data.CellPhoneNumber)
            if (!this.validateFormData(data.CellPhoneNumber, "phonenumber")) errors.CellPhoneNumber = "Invalid Cell Phone Number";

        if (data.CellPhoneNumber &&
            !this.validateFormData(data.CellPhoneNumber, "phonenumber_length", {
                min: 8,
                max: 14,
            })
        )
            errors.CellPhoneNumber = Trans("_error_mobilenumber_phonenumber_length");

        if (data.CustomerCareEmail && !this.validateFormData(data.CustomerCareEmail, "email")) errors.CustomerCareEmail = "Invalid Customer Care Email";

        if (data.AlternatePhone)
            if (!this.validateFormData(data.AlternatePhone, "phonenumber")) errors.AlternatePhone = "Invalid Alternate Phone Number";

        if (data.AlternatePhone &&
            !this.validateFormData(data.AlternatePhone, "phonenumber_length", {
                min: 8,
                max: 14,
            })
        )
            errors.AlternatePhone = Trans("_error_mobilenumber_phonenumber_length");

        if (!this.validateFormData(data.State, "require"))
            errors.State = "Please select State";

        if (!this.validateFormData(data.City, "require"))
            errors.City = "Please select City";

        if (data.FirstName && !this.validateFormData(data.FirstName, "special-characters-not-allowed", /[<>]/))
            errors.FirstName = "< and > characters not allowed";
        if (data.LastName && !this.validateFormData(data.LastName, "special-characters-not-allowed", /[<>]/))
            errors.LastName = "< and > characters not allowed";

        if (data.EmailId && !this.validateFormData(data.EmailId, "email")) errors.EmailId = "Invalid Email";

        if (data.PhoneNumber)
            if (!this.validateFormData(data.PhoneNumber, "phonenumber")) errors.PhoneNumber = "Invalid Phone Number";

        if (data.PhoneNumber &&
            !this.validateFormData(data.PhoneNumber, "phonenumber_length", {
                min: 8,
                max: 14,
            })
        )
            errors.PhoneNumber = Trans("_error_mobilenumber_phonenumber_length");

        if (data.GSTNo && !this.validateFormData(data.GSTNo, "alpha_numeric_space"))
            errors.GSTNo = "Invalid GST Number";

        if (data.CINNo && !this.validateFormData(data.CINNo, "alpha_numeric_space"))
            errors.CINNo = "Invalid CIN Number";

        if (data.PANNo && !this.validateFormData(data.PANNo, "alpha_numeric_space"))
            errors.PANNo = "Invalid PAN Number";

        if (data.IBANNo && !this.validateFormData(data.IBANNo, "special-characters-not-allowed", /[<>]/))
            errors.IBANNo = "< and > characters not allowed";

        if (data.bankAccountNumber && !this.validateFormData(data.bankAccountNumber, "special-characters-not-allowed", /[<>]/))
            errors.bankAccountNumber = "< and > characters not allowed";

        if (data.bankName && !this.validateFormData(data.bankName, "special-characters-not-allowed", /[<>]/))
            errors.bankName = "< and > characters not allowed";

        if (data.accountHolderName && !this.validateFormData(data.accountHolderName, "special-characters-not-allowed", /[<>]/))
            errors.accountHolderName = "< and > characters not allowed";

        if (data.ifscCode && !this.validateFormData(data.ifscCode, "special-characters-not-allowed", /[<>]/))
            errors.ifscCode = "< and > characters not allowed";

        if (data.swiftCode && !this.validateFormData(data.swiftCode, "special-characters-not-allowed", /[<>]/))
            errors.swiftCode = "< and > characters not allowed";

        if (data.bankBranchName && !this.validateFormData(data.bankBranchName, "special-characters-not-allowed", /[<>]/))
            errors.bankBranchName = "< and > characters not allowed";

        if (data.WebsiteURL && !this.validateFormData(data.WebsiteURL, "website_url", /[<>]/))
            errors.WebsiteURL = "Please enter a valid Website URL";

        if (!this.validateFormData(data.faceBookURL, "special-characters-not-allowed", /[<>]/))
            errors.faceBookURL = "< and > characters not allowed";

        if (!this.validateFormData(data.linkedInURL, "special-characters-not-allowed", /[<>]/))
            errors.linkedInURL = "< and > characters not allowed";

        if (!this.validateFormData(data.instagramURL, "special-characters-not-allowed", /[<>]/))
            errors.instagramURL = "< and > characters not allowed";
        return Object.keys(errors).length === 0 ? null : errors;
    };
    handleSubmit = async () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        let data = { ...this.state.data }

        if (this.state.gstnumbercheckbox) {
            data["IBANNo"] = "";
        }
        else if (this.state.taxationinfocheckbox) {
            data["GSTNo"] = "";
            data["CINNo"] = "";
            data["PANNo"] = "";
        }
        const reqOBJ = {
            request: { ...data }
        };
        let UpdatedDateFormate = data.DateFormate;
        let reqURL = "admin/user/update";
        this.setState({ isSaving: true });
        let resonsedata = await this.handleCall(reqURL, reqOBJ);

        this.setState({ isSaving: false });
        if (resonsedata && resonsedata.response && resonsedata.response.status === "success") {
            localStorage.setItem("dateFormat", UpdatedDateFormate);
            await this.getLoginDetails();
            this.setState({ isShowPopup: true, showSuccessMessage: true });
        }
        else {
            this.setState({ saveError: resonsedata.error })
        }
    }

    handleCall = async (reqURL, reqOBJ) => {

        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
                resolve(resonsedata);
            }.bind(this), "POST");
        });
    }

    getLoginDetails = async () => {
        if (localStorage.getItem('environment') === null) {
            return;
        }
        var reqURL = "api/v1/user/details";
        let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
        isPersonateEnabled = isPersonateEnabled === null ? false : isPersonateEnabled;
        var reqOBJ = {
            Request: "",
            Flags: { usecallcenterinfo: false },
        };
        return new Promise(function (resolve, reject) {
            apiRequester(
                reqURL,
                reqOBJ,
                function (data) {
                    resolve();
                }.bind(this)
            );
        });
    };

    handleSocialMedia = (e, name) => {
        const { data } = this.state;
        if (name == "Facebook") {
            data.faceBookURL = e.target.value === "" ? "" : e.target.value.startsWith('https://')
                ? e.target.value
                : "http://" + e.target.value.toLowerCase();
        }
        if (name == "Linkedin") {
            data.linkedInURL = e.target.value === "" ? "" : e.target.value.startsWith('https://')
                ? e.target.value
                : "http://" + e.target.value.toLowerCase();
        }
        if (name == "Instagram") {
            data.instagramURL = e.target.value === "" ? "" : e.target.value.startsWith('https://')
                ? e.target.value
                : "http://" + e.target.value.toLowerCase();
        }
        this.setState({ data });
    }
    handleOwnSubDomain = (e) => {
        const { data } = this.state;

        data.WebsiteURL = e.target.value === "" ? "" : e.target.value.startsWith('https://')
            ? e.target.value
            : "http://" + e.target.value.toLowerCase();
        this.setState({ data });
    }
    render() {
        let { data, errors, CountryList, CityList, StateList, disabled, DateFormates, isLoading, LoadingStateList, LoadingCityList, isSaving, saveError, showSuccessMessage, isShowPopup } = this.state
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {"Update Profile"}
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            {"Update Profile"}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        {isLoading &&
                            <div className="col-lg-8">
                                <div className="container ">
                                    <Loader />
                                </div>
                            </div>
                        }
                        {showSuccessMessage &&
                            <MessageBar Message={`Profile updated successfully.`} handleClose={() => this.closePopup(true)} />
                        }
                        {!isLoading &&
                            <div className="col-lg-9">
                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Agency Details
                                    </h5>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("AgencyName", "Agency Name *", "text", disabled)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("Address", "Address *", "text", disabled)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("PostalCode", "Pin Code *", "text", disabled)}
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group " + "Country"}>
                                                <label htmlFor={"Country"}>{"Country *"}</label>
                                                <div className="input-group">
                                                    <select
                                                        value={data.Country}
                                                        onChange={(e) => this.handleDataChange(e)}
                                                        name={"Country"}
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
                                                {errors["Country"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["Country"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group " + "StateID"}>
                                                <label htmlFor={"StateID"}>{"State *"}</label>
                                                <div className="input-group">
                                                    <select
                                                        value={data.State}
                                                        onChange={(e) => this.handleDataChange(e)}
                                                        name={"State"}
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
                                                {errors["State"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["State"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className={"form-group " + "CityID"}>
                                                <label htmlFor={"CityID"}>{"City *"}</label>
                                                <div className="input-group">
                                                    <select
                                                        value={data.City}
                                                        onChange={(e) => this.handleDataChange(e)}
                                                        name={"City"}
                                                        id={"CityID"}
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
                                                {errors["City"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["City"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderContactInput("CellPhoneNumber", "Phone Number", "text", false, true)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("CustomerCareEmail", "Customer Care Email", "text", true)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderContactInput("AlternatePhone", "Alternate Phone", "text", disabled)}
                                        </div>

                                    </div>
                                </div>

                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Representative Details
                                    </h5>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("FirstName", "First Name", "text", disabled)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("LastName", "Last Name", "text", disabled)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("EmailId", "Email Address", "text", disabled)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderContactInput("PhoneNumber", "Phone Number", "text", disabled)}
                                        </div>
                                    </div>
                                </div>

                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Agency Preferences
                                    </h5>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderSelect("DateFormate", "Date Format", DateFormates)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <FileBase64
                                                multiple={false}
                                                onDone={this.getFilesDocument.bind(this)}
                                                name="uploadDocument"
                                                label={"Logo"}
                                                msg={"Recommended size of (150px x 90px)"}
                                                placeholder={"Choose File"}
                                                className="w-100 col-lg-12"
                                            />
                                            {!this.state.uploadDocValidationImage && data.LogoPath !== undefined && data.LogoPath !== "" && (
                                                <div className="col-lg-12 col-sm-12 m-0 p-0">
                                                    <small className="alert alert-success mt-n4 mb-0 p-1 d-inline-block">
                                                        <a onClick={() => { this.setState({ showLogo: true }) }}>Preview {this.state.fileName}</a>
                                                    </small>
                                                </div>
                                            )}
                                            {this.state.uploadDocValidationImage && (
                                                <small className="alert alert-danger p-1 mt-1 d-inline-block">
                                                    {this.state.uploadDocValidationImage}
                                                </small>
                                            )}
                                            {/* <small style={{ color: "blue", cursor: "pointer" }} className="alert d-inline-block">
                                                <a onClick={() => { window.open(data.LogoPath) }}>Click here to open</a>
                                            </small>
                                            {this.renderInput("", "Logo", "text", disabled)} */}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderSelect("TimeZone", "Time Zone", this.state.timeZones)}
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("Currency", "Currency", "text", true)}
                                        </div>
                                        <div class="col-lg-4 col-md-6 col-sm-12 input-group ">
                                            <div className="form-group Currency">
                                                <label>Website URL</label>
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">http://</span>
                                                    <input type="text" name="WebsiteURL" maxlength="200" value={this.state.data.WebsiteURL
                                                        ? this.state.data.WebsiteURL.replace("http://", "").replace("https://", "")
                                                        : ""}
                                                        onChange={(e) => this.handleOwnSubDomain(e, "Website")}
                                                        class="form-control text-lowercase" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                                </div>
                                                {errors["WebsiteURL"] && (
                                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                                        {errors["WebsiteURL"]}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Registration Details
                                    </h5>
                                    <div className="row mt-3">
                                        <div className="col-lg-6 mb-4">
                                            <div className="custom-control custom-switch d-inline-block col-lg-6">
                                                <input
                                                    id="taxationinfo"
                                                    name="gstnumber"
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    checked={this.state.gstnumbercheckbox}
                                                    onChange={this.handletaxationcheckbox}
                                                />
                                                <label className="custom-control-label" htmlFor="taxationinfo">
                                                    GST Information
                                                </label>
                                            </div>
                                            <div className="custom-control custom-switch d-inline-block col-lg-6">
                                                <input
                                                    id="taxationinfo"
                                                    name="taxationinfo"
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    checked={this.state.taxationinfocheckbox}
                                                    onChange={this.handletaxationcheckbox}
                                                />
                                                <label className="custom-control-label" htmlFor="taxationinfo">
                                                    IBAN Information
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            {this.renderInput("AgencyName", "Official Name", "text", disabled)}
                                        </div>
                                        {this.state.gstnumbercheckbox &&
                                            <React.Fragment>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    {this.renderInput("GSTNo", "GST No", "text", disabled)}
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    {this.renderInput("CINNo", "CIN No", "text", disabled)}
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    {this.renderInput("PANNo", "PAN Number", "text", disabled)}
                                                </div>
                                            </React.Fragment>
                                        }
                                        {this.state.taxationinfocheckbox &&
                                            <React.Fragment>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    {this.renderInput("IBANNo", "IBAN Number", "text", '', '', 0, 50)}
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Bank Details
                                    </h5>
                                    <div className="row">
                                        <React.Fragment>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("accountHolderName", "Account Holder Name", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("bankAccountNumber", "Account No", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("bankName", "Bank Name", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("ifscCode", "IFSC Code", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("swiftCode", "SWIFT Code", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("bankBranchName", "Branch Name", "text", disabled)}
                                            </div>
                                        </React.Fragment>
                                    </div>
                                </div>
                                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                    <h5 className="text-primary border-bottom pb-2 mb-2">
                                        Social Media Details
                                    </h5>
                                    <div className="row">
                                        <React.Fragment>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label>Facebook</label>
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">http://</span>
                                                    <input type="text" name="faceBookURL" maxlength="200" value={this.state.data.faceBookURL
                                                        ? this.state.data.faceBookURL.replace("http://", "").replace("https://", "")
                                                        : ""}
                                                        onChange={(e) => this.handleSocialMedia(e, "Facebook")}
                                                        class="form-control text-lowercase" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                                </div>
                                                {errors["faceBookURL"] && (
                                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                                        {errors["faceBookURL"]}</small>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label>Instagram</label>
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">http://</span>
                                                    <input type="text" name="faceBookURL" maxlength="200" value={this.state.data.instagramURL
                                                        ? this.state.data.instagramURL.replace("http://", "").replace("https://", "")
                                                        : ""}
                                                        onChange={(e) => this.handleSocialMedia(e, "Instagram")}
                                                        class="form-control text-lowercase" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                                </div>
                                                {errors["instagramURL"] && (
                                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                                        {errors["instagramURL"]}</small>
                                                )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12 mt-2 mb-3">
                                                <label>LinkedIn</label>
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">http://</span>
                                                    <input type="text" name="linkedInURL" maxlength="200" value={this.state.data.linkedInURL
                                                        ? this.state.data.linkedInURL.replace("http://", "").replace("https://", "")
                                                        : ""}
                                                        onChange={(e) => this.handleSocialMedia(e, "Linkedin")}
                                                        class="form-control text-lowercase" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                                </div>
                                                {errors["linkedInURL"] && (
                                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                                        {errors["linkedInURL"]}</small>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    </div>
                                </div>
                                <AuthorizeComponent title="UpdateProfile~agentsettings-saveprofile" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            {errors["SaveError"] && (
                                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                    {errors["SaveError"]}
                                                </small>
                                            )}


                                            {isSaving ?
                                                <button className="btn btn-primary mr-2 float-right">
                                                    <span
                                                        className="spinner-border spinner-border-sm mr-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Save
                                                </button> :
                                                <button className="btn btn-primary mr-2 float-right"
                                                    onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "UpdateProfile~agentsettings-saveprofile") ? this.handleSubmit() : this.setState({ isshowauthorizepopup: true }) }}>
                                                    Save
                                                </button>}

                                            <button className="btn btn-secondary mr-2 float-right"
                                                onClick={() => { this.props.history.push(`/`); }}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                </AuthorizeComponent>
                            </div>
                        }
                    </div>
                    {this.state.showLogo &&
                        <ShowLogo src={data.LogoPath} closePopup={() => { this.setState({ showLogo: false }) }} />
                    }
                    {this.state.isshowauthorizepopup &&
                        <ModelPopupAuthorize
                            header={""}
                            content={""}
                            handleHide={this.hideauthorizepopup}
                            history={this.props.history}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default UpdateProfile
