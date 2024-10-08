import React, { Component } from 'react'
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";
import Select from "react-select";
import ModelPopupAuthorize from '../../helpers/modelforauthorize';
import ActionModal from "../../helpers/action-modal";
import { dateToNumber } from 'react-export-excel/dist/ExcelPlugin/utils/DataUtil';
import Loader from '../common/loader';
import { apiRequester_unified_api } from '../../services/requester-unified-api';
import MessageBar from '../admin/message-bar';

export class EmployeeAccessManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderID: this.props.userInfo.agentID
            },
            selectedUserID: props.employeeList
                .filter(x => x.crewNatureId !== 3)
                .find(x => x.isLoggedinEmployee)?.value ?? 0,
            errors: {},
            isBtnLoading: false,
            isLoading: false,
            saveError: "",
            employeeAccess: this.generateEmployeeAccessList(this.props.configSettings),
            employeeList: this.props.employeeList.filter(x => x.crewNatureId !== 3),
            SelectedConfigurationID: this.props.configSettings.filter(x => x.category === "RoleModule")
                .filter(x => x.isSelected == true).map((item) => {
                    return item.configSettingID;
                }),
            isSaveConfirmPopup: false,
            isemployeeroleaccessset: false
        };
    }
    hideAuthorizePopup = () => {
        this.setState({ isShowAuthorizePopup: false });
    }

    generateEmployeeAccessList = (configSettings) => {
        let accesslist = [];
        configSettings.filter(x => x.category === "RoleModule").map((item, index) => {
            accesslist.push({ name: item.displayName, value: item.isSelected, configSettingID: item.configSettingID, providerConfigSettingsID: item.providerConfigSettingsID });
        });
        return accesslist;
    }

    validate = () => {
        const errors = {};
        const { data, SelectedConfigurationID } = this.state;
        if (this.state.selectedUserID === 0) {
            errors["SaveError"] = "Please Select Assigned to";
        }
        return Object.keys(errors).length === 0 ? null : errors;
    };

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

    handleSubmit = () => {
        this.setState({ isBtnLoading: true, isSaveConfirmPopup: false });
        const { data, SelectedConfigurationID, employeeAccess, selectedUserID } = { ...this.state };
        let ConfigurationInfo = Object.assign({}, data);
        let objselectedConfigSettings = [];

        employeeAccess.map((data, index) => {
            objselectedConfigSettings.push({
                ProviderConfigSettingsID: data.providerConfigSettingsID,
                ConfigSettingID: data.configSettingID,
                Value: SelectedConfigurationID.find(x => x == data.configSettingID) ? 'true' : 'false'
            });
        });
        ConfigurationInfo.ConfigSettingsToSave = objselectedConfigSettings;
        ConfigurationInfo.UserID = selectedUserID;
        ConfigurationInfo.Category = "RoleModule";
        const reqOBJ = {
            request: ConfigurationInfo
        };

        let reqURL = "admin/updateconfigurations";
        this.setState({});
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            if (resonsedata && resonsedata.response && resonsedata.response.status === "success") {
                this.setState({ isBtnLoading: false, isSaveConfirmPopup: false, showSuccessMessage: true });
            }
            else {
                this.setState({ isBtnLoading: false, isSaveConfirmPopup: false, saveError: resonsedata.error })
            }
        }.bind(this), "POST");
    }

    handleChange = async ({ currentTarget: input }) => {
        this.setState({ isLoading: true });
        const data = this.state;
        data.selectedUserID = input.value;
        let configurations = await this.props.getConfigurations(data);
        let employeeAccess = this.generateEmployeeAccessList(configurations.configsettings);
        let SelectedConfigurationID = configurations.configsettings.filter(x => x.category === "RoleModule")
            .filter(x => x.isSelected == true).map((item) => {
                return item.configSettingID;
            })
        this.setState({ employeeAccess, isLoading: false, SelectedConfigurationID });
    };

    handleConfirmSave = (isConfirmDelete) => {
        this.setState({ isSaveConfirmPopup: false });
        isConfirmDelete && this.handleSubmit();
    };

    handleOnSubmit = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isSaveConfirmPopup: true });
    }

    closePopup() {
        this.setState({ showSuccessMessage: false });
        //window.location.reload();
    }

    render() {
        let { errors, isBtnLoading, showSuccessMessage, employeeAccess, isSaveConfirmPopup, isLoading, SelectedConfigurationID } = this.state
        const customStyles = {
            control: styles => ({ ...styles, "textTransform": "capitalize" }),
            option: styles => ({ ...styles, "textTransform": "capitalize" }),
            menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
        };
        return (
            <div className='col-lg-12'>
                {showSuccessMessage &&
                    <MessageBar Message={`Access rights saved successfully.`} handleClose={() => this.closePopup(true)} />
                }
                <div className="container">

                    <div className="row">
                        <div className='col-lg-12 mt-4'>
                            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                <h5 className="text-primary border-bottom pb-2 mb-2">
                                    Employee Access Management
                                </h5>
                                <div className='row'>
                                    <div className='col-lg-4'>
                                        <label htmlFor={"employees"}>{"Assigned To"}</label>
                                        <div className={"form-group"}>
                                            <Select
                                                styles={customStyles}
                                                placeholder="Select Employee..."
                                                id={"employee"}
                                                defaultValue={this.state.selectedUserID}
                                                value={this.state.employeeList.find(x => x.value === this.state.selectedUserID)}
                                                options={this.state.employeeList}
                                                onChange={(e) => {
                                                    this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                                                }}
                                                noOptionsMessage={() => "No employee(s) available"}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-12'>
                                        <div className='row'>
                                            {isLoading &&
                                                <React.Fragment>
                                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                        <Loader />
                                                    </div>
                                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                                </React.Fragment>
                                            }
                                            {!isLoading && employeeAccess.map((item, index) => {
                                                return (
                                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                        <input style={{ marginRight: "10px" }}
                                                            id={item.configSettingID}
                                                            type="checkbox"
                                                            onChange={(e) => this.checkEmployeeAccess(e, item.configSettingID)}
                                                            value={item.configSettingID}
                                                            checked={SelectedConfigurationID.length > 0 ? SelectedConfigurationID.indexOf(item.configSettingID) > -1 : false}
                                                        />
                                                        <label htmlFor={item}>{" " + item.name}</label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className="col-lg-12">
                                    {errors["SaveError"] && (
                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                            {errors["SaveError"]}
                                        </small>
                                    )}
                                    {errors["SelectedConfigurationID"] && (
                                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                            {errors["SelectedConfigurationID"]}
                                        </small>
                                    )}
                                </div>
                                <div class="col-lg-12 mr-2">
                                    <button className="btn btn-primary mr-2 float-right"
                                        onClick={() => {
                                            AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "AgencyConfiguration~agentsettings-saveconfiguration")
                                                ? this.handleOnSubmit()
                                                : this.setState({ isShowAuthorizePopup: true })
                                        }}
                                    >
                                        {isBtnLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                        Save</button>
                                    <button className="btn btn-secondary mr-2 float-right"
                                        onClick={() => { this.props.history.push(`/`); }}
                                    >Cancel</button>
                                </div>
                            </div>
                        </div>

                        {/* <div className='col-lg-12 border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-4'>
                            <h5 className="text-primary border-bottom pb-2 mb-2">
                                Employee Access Management
                            </h5>
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <label htmlFor={"employees"}>{"Assigned To"}</label>
                                    <div className={"form-group"}>
                                        <Select
                                            styles={customStyles}
                                            placeholder="Select Employee..."
                                            id={"employee"}
                                            defaultValue={this.state.selectedUserID}
                                            value={this.state.employeeList.find(x => x.value === this.state.selectedUserID)}
                                            options={this.state.employeeList}
                                            onChange={(e) => {
                                                this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                                            }}
                                            noOptionsMessage={() => "No employee(s) available"}
                                        />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='row'>
                                        {isLoading &&
                                            <React.Fragment>
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                    <Loader />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                            </React.Fragment>
                                        }
                                        {!isLoading && employeeAccess.map((item, index) => {
                                            return (
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                    <input style={{ marginRight: "10px" }}
                                                        id={item.configSettingID}
                                                        type="checkbox"
                                                        onChange={(e) => this.checkEmployeeAccess(e, item.configSettingID)}
                                                        value={item.configSettingID}
                                                        checked={SelectedConfigurationID.length > 0 ? SelectedConfigurationID.indexOf(item.configSettingID) > -1 : false}
                                                    />
                                                    <label htmlFor={item}>{" " + item.name}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="col-lg-12">
                            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm mt-4">
                                <h5 className="text-primary border-bottom pb-2 mb-2">
                                    Employee Access Management
                                </h5>
                                <div className="col-md-3">
                                    <label htmlFor={"employees"}>{"Assigned To"}</label>
                                    <div className={"form-group"}>
                                        <Select
                                            styles={customStyles}
                                            placeholder="Select Employee..."
                                            id={"employee"}
                                            defaultValue={this.state.selectedUserID}
                                            value={this.state.employeeList.find(x => x.value === this.state.selectedUserID)}
                                            options={this.state.employeeList}
                                            onChange={(e) => {
                                                this.handleChange({ currentTarget: { value: e.value, name: "userID" } })
                                            }}
                                            noOptionsMessage={() => "No employee(s) available"}
                                        />
                                    </div>
                                </div>
                                <div className="row mx-0">

                                    {isLoading &&
                                        <React.Fragment>
                                            <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                <Loader />
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12 mb-2"></div>
                                        </React.Fragment>
                                    }
                                    {!isLoading && employeeAccess.map((item, index) => {
                                        return (
                                            <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                <input style={{ marginRight: "10px" }}
                                                    id={item.configSettingID}
                                                    type="checkbox"
                                                    onChange={(e) => this.checkEmployeeAccess(e, item.configSettingID)}
                                                    value={item.configSettingID}
                                                    checked={SelectedConfigurationID.length > 0 ? SelectedConfigurationID.indexOf(item.configSettingID) > -1 : false}
                                                />
                                                <label htmlFor={item}>{" " + item.name}</label>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                            <AuthorizeComponent title="AgencyConfiguration~agentsettings-saveconfiguration" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                <div className='row mt-3'>
                                    <div className="col-lg-12">
                                        {errors["SaveError"] && (
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["SaveError"]}
                                            </small>
                                        )}
                                        {errors["SelectedConfigurationID"] && (
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["SelectedConfigurationID"]}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </AuthorizeComponent>
                            <div className='row'>
                                <div class="col-lg-12 mr-2">
                                    <button className="btn btn-primary mr-2 float-right"
                                        onClick={() => {
                                            AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "AgencyConfiguration~agentsettings-saveconfiguration")
                                                ? this.handleOnSubmit()
                                                : this.setState({ isShowAuthorizePopup: true })
                                        }}
                                    >
                                        {isBtnLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : null}
                                        Save</button>
                                    <button className="btn btn-secondary mr-2 float-right"
                                        onClick={() => { this.props.history.push(`/`); }}
                                    >Cancel</button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    {
                        this.state.isShowAuthorizePopup &&
                        <ModelPopupAuthorize
                            header={""}
                            content={""}
                            handleHide={this.hideAuthorizePopup}
                            history={this.props.history}
                        />
                    }
                    {
                        isSaveConfirmPopup && (
                            <ActionModal
                                title="Confirm"
                                message="Are you sure you want to change access rights?"
                                positiveButtonText="Confirm"
                                onPositiveButton={() => this.handleConfirmSave(true)}
                                handleHide={() => this.handleConfirmSave(false)}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}

export default EmployeeAccessManagement
