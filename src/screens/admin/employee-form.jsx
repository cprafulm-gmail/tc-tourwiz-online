import React from "react";
import Form from "../../components/common/form";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { apiRequester } from "../../services/requester";
import Loader from "../../components/common/loader";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Trans } from "../../helpers/translate";
import ManageEmployee from "../../assets/images/dashboard/manage-employee.png";
import MessageBar from '../../components/admin/message-bar';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelLimitExceeded from "../../helpers/modelforlimitexceeded";
import * as Global from "../../helpers/global";
import Config from "../../config.json";
import { Helmet } from "react-helmet";

class SupplierInvoice extends Form {
    constructor(props) {
        super(props);
        this.state = {
            providerID: this.props.userInfo.portalAgentID,
            data: {
                ProviderID: this.props.userInfo.agentID,
                FirstName: "",
                MiddleName: "",
                LastName: "",
                Address1: "",
                Address2: "",
                CityID: "",
                StateID: "",
                CountryID: "",
                PostalCode: "",
                BranchID: "22272",
                IsActive: true,
                CrewNatureID: 1,
                CellPhone: "",
                BirthDate: "1980-12-01",
                EmailID: "",
                Notes: "",
                UserName: "",
                Password: "",
                ConfirmPassword: "",
                UserID: ""
            },
            errors: {},
            isLoading: false,
            mode: "add",
            CountryList: [],
            StateList: [],
            CityList: [],
            UserRoleList: [],
            BranchList: [],
            SelectedRoleID: [],
            isSubscriptionPlanend: false,
            configsettings: [],
            SelectedConfigurationID: [],
            employeeAccess: [],
            isDeleteAllowed: true
        };
    }

    hidelimitpopup = () => {
        this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
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
    getUserRoleList = () => {
        const { providerID } = this.state;
        const reqOBJ = {
            request: {
            }
        };
        let reqURL = "admin/lookup/role";
        this.setState({ LoadingUserRoles: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            let SelectedRoleID = resonsedata.response.map(x => x.roleId);
            this.setState({ SelectedRoleID, UserRoleList: resonsedata.response, LoadingUserRoles: false })
        }.bind(this), "POST");
    }
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
            data.StateID = "";
            data.CityID = "";
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
            if (isLoadingEditMode && data.StateID) {
                this.getCityList(data.StateID, true);
            }
        }.bind(this), "POST");
    }
    getCityList = (stateId, isLoadingEditMode) => {
        let { data } = this.state;
        if (!isLoadingEditMode)
            data.CityID = "";
        if (stateId === "") {
            this.setState({ CityList: [], data });
            return;
        }
        const reqOBJ = {
            request: {
                IsActive: "true",
                StateID: stateId,
                CountryID: data.CountryID
            }
        };
        let reqURL = "admin/lookup/city";
        this.setState({ LoadingCityList: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ CityList: resonsedata.response, data, LoadingCityList: false });
        }.bind(this), "POST");
    }
    componentDidMount = async () => {
        this.getCountryList();
        this.getUserRoleList();
        this.getBranchList();
        const { mode, id } = this.props.match.params;
        if (mode.toLowerCase() !== "edit" && mode.toLowerCase() !== "view" && Config.codebaseType === "tourwiz") {
            await this.fillConfigurations();
        }
        if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
            this.setState({ mode: mode.toLowerCase() });
            await this.getEmployeeDetails(id, Config.codebaseType === "tourwiz" ? this.fillConfigurations : null);
        }
    }
    checkEmployeeAccess = (e, configId) => {
        let { SelectedConfigurationID } = this.state;
        if (e.target.checked) {
            SelectedConfigurationID.push(configId);
        } else {
            let configIndex = SelectedConfigurationID.indexOf(configId);
            SelectedConfigurationID.splice(configIndex, 1);
        }
        this.setState({ SelectedConfigurationID });
    }

    fillConfigurations = async () => {
        let configurations = [];
        let employeeAccess = [];
        let SelectedConfigurationID = [];
        configurations = await this.getConfigurations();
        employeeAccess = await this.generateEmployeeAccessList(configurations.configsettings);
        SelectedConfigurationID = configurations.configsettings.filter(x => x.category === "RoleModule")
            .filter(x => x.isSelected == true).map((item) => {
                return item.configSettingID;
            });
        let Isdeleteallowed = employeeAccess.find(x => x.configSettingID === 18).value;
        this.setState({ ...configurations, employeeAccess, SelectedConfigurationID, isDeleteAllowed: Isdeleteallowed });
    }

    getEmployeeDetails = async (id, callback) => {
        this.setState({ isLoading: true, isEditModeLoading: true });
        const reqOBJ = {
            request: {
                CrewId: id
            }
        };
        let reqURL = "admin/employee/details";
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            if (resonsedata.response.length > 0) {
                const response = resonsedata.response[0];
                const data = {
                    CrewID: response.crewId,
                    FirstName: response.firstName,
                    MiddleName: response.middleName,
                    LastName: response.lastName,
                    Address1: response.address1,
                    Address2: "",
                    CityID: (response.country != 101 && response.city == 8) ? "" : response.city,
                    StateID: (response.country != 101 && response.state == 16) ? "" : response.state,
                    CountryID: response.country,
                    PostalCode: "",
                    CrewNatureID: response.crewNatureID,
                    CellPhone: response.cellPhone,
                    BirthDate: "1980-12-01",
                    EmailID: response.email,
                    Notes: "",
                    BranchID: response.branchID,
                    IsActive: response.isActive === "Yes",
                    UserID: response.userID
                };

                if (response.userID) {
                    this.setState({ data }, () =>
                        this.getEmployeeUserDetails(response.userID, id));
                    callback();
                } else
                    this.setState({ data, isLoading: false, isEditModeLoading: false });
                if (response.country) {
                    this.getStateList(response.country, true);
                }
            }
        }.bind(this), "POST");
    }
    getEmployeeUserDetails = (id, crewid) => {
        this.setState({ isLoading: true, isEditModeLoading: true });
        let reqURL =
            "admin/employee/user/details?crewid=" + crewid + "&userid=" + id;
        apiRequester_unified_api(reqURL, {}, function (resonsedata) {
            if (resonsedata.response.length > 0) {
                const response = resonsedata.response[0];
                let { data } = this.state;
                data.BranchID = response.defaultBranch ?? data.BranchID;
                data.UserName = response.loginName;
                data.LanguageId = response.language;
                let SelectedRoleID = [...new Set(response.rolesID.split(",").map(Number).concat(this.state.UserRoleList.map(x => x.roleId)))]
                this.setState({ isLoading: false, SelectedRoleID: SelectedRoleID, isEditModeLoading: false })
            }
        }.bind(this), "GET");
    };
    validateInformation = () => {
        const errors = {};
        const { data, SelectedRoleID, mode, SelectedConfigurationID, employeeAccess } = this.state;

        if (!this.validateFormData(data.FirstName, "require"))
            errors.FirstName = "First Name required";
        if (!this.validateFormData(data.LastName, "require"))
            errors.LastName = "Last Name required";
        if (!this.validateFormData(data.Address1, "require"))
            errors.Address1 = "Address required";
        else if (data.Address1 && !this.validateFormData(data.Address1, "special-characters-not-allowed", /[<>]/))
            errors.Address1 = "< and > characters not allowed";
        if (!this.validateFormData(data.CityID, "require"))
            errors.CityID = "City required";
        if (!this.validateFormData(data.StateID, "require"))
            errors.StateID = "State required";
        if (!this.validateFormData(data.CountryID, "require"))
            errors.CountryID = "Country required";
        if (!this.validateFormData(data.BranchID, "require"))
            errors.BranchID = "Branch required";
        //Phone number

        if (!this.validateFormData(data.CellPhone, "require"))
            errors.CellPhone = "Phone Number required";
        else if (!this.validateFormData(data.CellPhone, "require_phoneNumber"))
            errors.CellPhone = Trans("_error_phoneNumber_phonenumber");
        else if (!this.validateFormData(data.CellPhone, "phonenumber"))
            errors.CellPhone = Trans("_error_phoneNumber_phonenumber");
        else if (
            !this.validateFormData(data.CellPhone, "phonenumber_length", {
                min: 8,
                max: 14
            })
        )
            errors.CellPhone = Trans("_error_phoneNumber_phonenumber_length");

        if (!this.validateFormData(data.EmailID, "require"))
            errors.EmailID = "Email required";
        else if (!this.validateFormData(data.EmailID, "email"))
            errors.EmailID = "Email is not valid";
        if (mode === "add") {
            if (!this.validateFormData(data.EmailID, "require"))
                errors.EmailID = "Email required";
            else if (data.EmailID && !this.validateFormData(data.EmailID, "special-characters-not-allowed", /[<>'&` "]/))
                errors.EmailID = "<,>,',&,`,\" and blank space characters not allowed";
            if (!this.validateFormData(data.Password, "require"))
                errors.Password = "Password required";
            else if (data.Password && !this.validateFormData(data.Password, "special-characters-not-allowed", /[<>'&` "]/))
                errors.Password = "<,>,',&,`,\" and blank space characters not allowed";
            else if (data.Password.length < 6)
                errors.Password = "Password should be of Minimum 6 letters";
            if (!this.validateFormData(data.ConfirmPassword, "require"))
                errors.ConfirmPassword = "Confirm Password required";
            else if (data.ConfirmPassword && !this.validateFormData(data.ConfirmPassword, "special-characters-not-allowed", /[<>'&` "]/))
                errors.ConfirmPassword = "<,>,',&,`,\" and blank space characters not allowed";
            else if (data.ConfirmPassword != data.Password)
                errors.ConfirmPassword = "Confirm Password not matching with Password";
        }
        if (mode === "add" || data.UserID) {
            if (SelectedRoleID.length === 0)
                errors.SelectedRoleID = "Select at least one role";
        }

        if (data.FirstName && !this.validateFormData(data.FirstName, "special-characters-not-allowed", /[<>]/))
            errors.FirstName = "< and > characters not allowed";
        if (data.LastName && !this.validateFormData(data.LastName, "special-characters-not-allowed", /[<>]/))
            errors.LastName = "< and > characters not allowed";
        if (Config.codebaseType === "tourwiz" && SelectedConfigurationID.length === 0) {
            errors.SelectedConfigurationID = "Kindly select atleast one module access.";
        }
        return Object.keys(errors).length === 0 ? null : errors;
    }
    saveEmployeeClick = () => {
        const errors = this.validateInformation();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.saveEmployee();
    };
    saveEmployee = () => {
        const { data, mode, SelectedRoleID, SelectedConfigurationID, employeeAccess, isDeleteAllowed } = { ...this.state };
        let EmployeeInfo = Object.assign({}, data);
        this.setState({ isLoading: true });
        let reqURL = `admin/employee/${mode === "add" ? "add" : "update"}`;
        EmployeeInfo.BranchID = [EmployeeInfo.BranchID];
        EmployeeInfo.SelectedRoleID = SelectedRoleID;
        let UserInfo = {};
        let UpdateEmployee = false;
        let ConfigurationInfo = Object.assign({}, null);
        let objselectedConfigSettings = [];

        if (employeeAccess.length > 0) {
            employeeAccess.map((data, index) => {
                if (data.configSettingID !== 18) {
                    objselectedConfigSettings.push({
                        ProviderConfigSettingsID: data.providerConfigSettingsID,
                        ConfigSettingID: data.configSettingID,
                        Value: SelectedConfigurationID.find(x => x == data.configSettingID) ? 'true' : 'false'
                    });
                }
            });
            objselectedConfigSettings.push({
                ProviderConfigSettingsID: employeeAccess.find(x => x.configSettingID === 18).providerConfigSettingsID,
                ConfigSettingID: employeeAccess.find(x => x.configSettingID === 18).configSettingID,
                Value: this.state.isDeleteAllowed ? 'true' : 'false'
            });
        }

        ConfigurationInfo.ConfigSettingsToSave = objselectedConfigSettings;
        //ConfigurationInfo.UserID = selectedUserID;
        ConfigurationInfo.Category = "RoleModule";

        if (mode === "add") {
            UserInfo = {
                UserName: EmployeeInfo.EmailID,
                Password: EmployeeInfo.Password,
                ConfirmPassword: EmployeeInfo.ConfirmPassword,
                ProviderID: EmployeeInfo.ProviderID,
                UserDisplayName: EmployeeInfo.FirstName + " " + EmployeeInfo.LastName
            }
            //delete EmployeeInfo["UserName"];
            delete EmployeeInfo["Password"];
            delete EmployeeInfo["ConfirmPassword"];
            delete EmployeeInfo["ProviderID"];
        } else {
            if (EmployeeInfo.UserID && EmployeeInfo.UserID != "")
                UpdateEmployee = true;
            UserInfo = {
                UserDisplayName: EmployeeInfo.FirstName + " " + EmployeeInfo.LastName,
                Language: EmployeeInfo.LanguageId,
                UserID: EmployeeInfo.UserID
            }
            //delete EmployeeInfo["UserName"];
            delete EmployeeInfo["LanguageId"];
            delete EmployeeInfo["UserID"];
        }
        UserInfo.BranchID = EmployeeInfo.BranchID;
        EmployeeInfo.UserDisplayName = EmployeeInfo.FirstName + " " + EmployeeInfo.LastName;
        EmployeeInfo.ConfigurationInfo = ConfigurationInfo;
        UserInfo.ConfigurationInfo = ConfigurationInfo;
        let reqOBJ = { request: EmployeeInfo };

        let quotaUsage = localStorage.getItem("quotaUsage");
        quotaUsage = JSON.parse(quotaUsage);
        let quota = Global.LimitationQuota["EmployeeList~agentsettings-addemployee"];

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata.error) {
                    let { errors } = this.state;
                    if (resonsedata.code && resonsedata.code === 101) {
                        this.setState({ isLoading: false, isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
                    }
                    if (resonsedata.error.toLowerCase() === "user name already exist") {
                        errors.EmailID = "Email already exist";
                    }
                    else {
                        errors.SaveError = resonsedata.error;
                    }
                    this.setState({ isLoading: false, errors });
                }
                else if (mode === "edit" && resonsedata?.response?.status === "success") {
                    if (UpdateEmployee) {
                        this.updateEmployeeUser(UserInfo);
                        this.getLoginDetails();
                    }
                    else {
                        this.setState({ isLoading: false });
                        this.setState({ showSuccessMessage: true });
                    }
                }
                else if (mode === "add") {
                    if (resonsedata.response && resonsedata.response.crewId) {
                        UserInfo.CrewID = resonsedata.response.crewId;

                        this.createEmployeeUser(UserInfo);
                    } else {
                        let { errors } = this.state;
                        errors.SaveError = "Oops! something went wrong";
                        this.setState({ isLoading: false, errors });
                    }
                }
            }.bind(this),
            "POST"
        );
    };
    getLoginDetails = () => {
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
        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                if (data.response !== undefined) {
                }
            }.bind(this)
        );
    };
    createEmployeeUser = (UserInfo) => {
        const { SelectedRoleID } = { ...this.state };
        let reqURL = `admin/employee/login/create`;

        let quotaUsage = localStorage.getItem("quotaUsage");
        quotaUsage = JSON.parse(quotaUsage);
        let quota = Global.LimitationQuota["EmployeeList~agentsettings-addemployee"];

        UserInfo.UserDisplayName = UserInfo.UserDisplayName;
        UserInfo.Language = 1;
        UserInfo.HintQuestion = 1;
        UserInfo.OtherHintQuestion = "";
        UserInfo.HintAnswer = "";
        UserInfo.SelectedRoleID = SelectedRoleID;
        delete UserInfo["ProviderID"];
        let reqOBJ = { request: UserInfo };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata.error) {
                    let { errors } = this.state;
                    errors.SaveError = resonsedata.error;
                    this.setState({ isLoading: false, errors });
                    this.deleteEmployee(UserInfo.CrewID)
                } else {
                    if (quotaUsage["totalUsed" + quota] === null)
                        quotaUsage["totalUsed" + quota] = 1;
                    else
                        quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
                    localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
                    this.setState({ isLoading: false });
                    this.setState({ showSuccessMessage: true });
                }
            }.bind(this),
            "POST"
        );
    }
    updateEmployeeUser = (UserInfo) => {
        const { SelectedRoleID } = { ...this.state };
        let reqURL = `admin/employee/login/update`;
        UserInfo.SelectedRoleID = SelectedRoleID;
        let reqOBJ = { request: UserInfo };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {
                if (resonsedata.error) {
                    let { errors } = this.state;
                    errors.SaveError = resonsedata.error;
                    this.setState({ isLoading: false, errors });
                } else {
                    this.setState({ isLoading: false });
                    this.setState({ showSuccessMessage: true });
                }
            }.bind(this),
            "POST"
        );
    }
    deleteEmployee = (crewId) => {
        let reqURL = "admin/employee/delete";
        let reqOBJ = {
            Request: {
                CrewID: crewId
            }
        };
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (resonsedata) {

            }.bind(this),
            "POST"
        );
    }
    handleDataChange = (e) => {
        let { data } = this.state;
        data[e.target.name] = e.target.value;
        this.setState({ data });
        if (e.target.name === "CountryID")
            this.getStateList(e.target.value);
        if (e.target.name === "StateID")
            this.getCityList(e.target.value);
    }
    checkRoleId = (e, roleId) => {
        let { SelectedRoleID } = this.state;
        if (e.target.checked) {
            SelectedRoleID.push(roleId);
        } else {
            let roleIndex = SelectedRoleID.indexOf(roleId);
            SelectedRoleID.splice(roleIndex, 1);
        }
        this.setState({ SelectedRoleID });
    }
    RedirectToEmployeeList = () => {
        this.props.history.push(`/EmployeeList`);
    };
    IsActiveChange = (value) => {
        const { data } = this.state;
        data.IsActive = value;
        this.setState({ data });
    }
    generateEmployeeAccessList = async (configSettings) => {
        let accesslist = [];
        configSettings.filter(x => x.category === "RoleModule").map((item, index) => {
            accesslist.push({ name: item.displayName, value: item.isSelected, configSettingID: item.configSettingID, providerConfigSettingsID: item.providerConfigSettingsID });
        });
        return accesslist;
    }

    getConfigurations = async () => {
        const reqOBJ = {};
        let reqURL = "admin/getconfigurations";
        if (this.state.data.UserID) {
            reqURL += "?userid=" + this.state.data.UserID;
        }
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
                resolve({ configsettings: resonsedata.response });

            }.bind(this), "GET");
        });
    }
    changeDeleteAllowed = () => {
        this.setState({ isDeleteAllowed: !this.state.isDeleteAllowed });
    }

    render() {
        const { employeeAccess, SelectedConfigurationID, data, errors, mode, isLoading, isEditModeLoading, CountryList, StateList, CityList, UserRoleList, SelectedRoleID, BranchList, LoadingUserRoles, LoadingBranchList, LoadingCountryList, LoadingStateList, LoadingCityList, showSuccessMessage } = this.state;
        const disabled = (mode === "view");
        const isEditMode = (mode === "edit");
        if (isEditMode && !AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "EmployeeList~agentsettings-editemployee")) {
            this.props.history.push('/');
        }
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            {mode === "add" ? "Add " : mode === "view" ? "View " : "Edit "}Employee
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <img width="24" className="mr-3"
                                height="24" src={ManageEmployee} alt="" />
                            {mode === "add" ? "Add " : mode === "view" ? "View " : "Edit "}Employee
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
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
                                        <MessageBar Message={`Employee ${mode === "add" ? "added" : "updated"} successfully.`} handleClose={() => this.RedirectToEmployeeList()} />
                                    }
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Personal Details
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("FirstName", "First Name *", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("LastName", "Last Name *", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("EmailID", "Email Address *", "text", (disabled || isEditMode))}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderContactInput("CellPhone", "Phone Number *", "text", null, (disabled === true ? true : false))}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                {this.renderInput("Address1", "Address *", "text", disabled)}
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                                                <div className={"form-group " + "BranchID"}>
                                                    <label htmlFor={"BranchID"}>{"Branch *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.BranchID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"BranchID"}
                                                            id={"BranchID"}
                                                            disabled={disabled}
                                                            className={"form-control"}
                                                            defaultValue={this.state.data.BranchID}>
                                                            {/* <option key={0} value={''}>Select</option> */}
                                                            {BranchList.map((option, key) => (

                                                                <option
                                                                    key={key}
                                                                    value={
                                                                        option["branchId"]
                                                                    }
                                                                >
                                                                    {option["name"]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {LoadingBranchList ? (
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
                                                    {errors["BranchID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["BranchID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "CountryID"}>
                                                    <label htmlFor={"CountryID"}>{"Country *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.CountryID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"CountryID"}
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
                                                    {errors["CountryID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["CountryID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "StateID"}>
                                                    <label htmlFor={"StateID"}>{"State *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.StateID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"StateID"}
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
                                                    {errors["StateID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["StateID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "CityID"}>
                                                    <label htmlFor={"CityID"}>{"City *"}</label>
                                                    <div className="input-group">
                                                        <select
                                                            value={data.CityID}
                                                            onChange={(e) => this.handleDataChange(e)}
                                                            name={"CityID"}
                                                            id={"CityID"}
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
                                                    {errors["CityID"] && (
                                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                            {errors["CityID"]}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className={"form-group " + "IsActive"}>
                                                    <label htmlFor={"IsActive"}>{"Active"}</label>
                                                    <div className="input-group">
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" disabled={disabled} type="radio" name="IsActive" id="yes" onClick={() => this.IsActiveChange(true)} value={true} checked={data.IsActive === true} />
                                                            <label className="form-check-label" for="IsActiveYes">Yes</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" disabled={disabled} type="radio" name="IsActive" id="no" value={false} onClick={() => this.IsActiveChange(false)} checked={data.IsActive === false} />
                                                            <label className="form-check-label" for="IsActiveNo">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            Access Permission
                                        </h5>
                                        <div className="row">
                                            {LoadingUserRoles &&
                                                <div className="container ">
                                                    <Loader />
                                                </div>
                                            }
                                            {UserRoleList.map((item, index) => {
                                                return (
                                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                        <div className="form-check form-check-inline">
                                                            <input className="form-check-input" disabled={disabled} type="checkbox" checked={SelectedRoleID.indexOf(item.roleId) > -1} id={"role" + index} onChange={(e) => { this.checkRoleId(e, item.roleId) }} value={item.roleId} />
                                                            <label className="form-check-label" htmlFor={"role" + index}>{" " + item.roleName}</label>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                {errors["SelectedRoleID"] && (
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {errors["SelectedRoleID"]}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                            User Credentials
                                        </h5>
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <form autocomplete="off">
                                                    {this.renderInput("EmailID", "Email Address *", "text", (disabled || isEditMode))}
                                                </form>

                                            </div>
                                            {!isEditMode && !disabled &&
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <form autocomplete="off">

                                                        {this.renderInput("Password", "Password *", "password", disabled)}
                                                    </form>

                                                </div>
                                            }
                                            {!isEditMode && !disabled &&
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <form autocomplete="off">

                                                        {this.renderInput("ConfirmPassword", "Confirm Password *", "password", disabled)}
                                                    </form>

                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {employeeAccess.length > 0 &&
                                        <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-3">
                                            <h5 className="text-primary border-bottom pb-2 mb-2">
                                                Access Rights
                                                <div className="mb-3 custom-control custom-switch float-right">
                                                    <input
                                                        type="checkbox"
                                                        checked={disabled === true ? false : this.state.isDeleteAllowed}
                                                        className="custom-control-input"
                                                        id="percentage"
                                                        onChange={(e) => this.changeDeleteAllowed()}
                                                    />
                                                    <label className="custom-control-label" htmlFor="percentage">
                                                        Delete Allowed
                                                    </label>
                                                </div>
                                            </h5>
                                            <div className='row'>
                                                {employeeAccess.map((item, index) => {
                                                    if (item.configSettingID !== 18) {
                                                        return (
                                                            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                                <div className=" custom-control custom-checkbox">
                                                                    <input
                                                                        className="custom-control-input"
                                                                        style={{ marginRight: "10px" }}
                                                                        id={item.configSettingID}
                                                                        type="checkbox"
                                                                        disabled={disabled}
                                                                        onChange={(e) => this.checkEmployeeAccess(e, item.configSettingID)}
                                                                        value={item.configSettingID}
                                                                        checked={SelectedConfigurationID.length > 0 ? SelectedConfigurationID.indexOf(item.configSettingID) > -1 : false}
                                                                    />
                                                                    <label className="custom-control-label" htmlFor={item.configSettingID}>{" " + item.name}</label>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                            {
                                                errors["SelectedConfigurationID"] && (
                                                    <small className="alert alert-danger p-1 d-inline-block">
                                                        {errors["SelectedConfigurationID"]}
                                                    </small>
                                                )
                                            }
                                        </div>
                                    }
                                    <AuthorizeComponent title="EmployeeList~agentsettings-editemployee" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
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
                                                        onClick={() => this.saveEmployeeClick()}
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
                                                    onClick={() => this.RedirectToEmployeeList()}
                                                >
                                                    {disabled ? "Back" : "Cancel"}
                                                </button>
                                            </div>
                                        </div>
                                    </AuthorizeComponent>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {
                    this.state.isSubscriptionPlanend &&
                    <ModelLimitExceeded
                        header={"Plan Limitations Exceeded"}
                        content={"The maximum recommended plan has been exceeded"}
                        handleHide={this.hidelimitpopup}
                        history={this.props.history}
                    />
                }
            </div>
        );
    }
}
export default SupplierInvoice;
