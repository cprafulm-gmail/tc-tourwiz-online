import React, { Component } from 'react'
import Form from "../common/form";
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../common/loader";
import MessageBar from '../admin/message-bar';
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import ActionModal from "../../helpers/action-modal";
import { Link, Link as ReactLink } from "react-router-dom";

export class EmailConfriguration extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderID: this.props.userInfo.agentID
            },
            errors: {},
            isBtnLoading: false,
            saveError: "",
            configsettings: this.props.configsettings.filter(x => x.category === "Email"),
            SelectedConfigurationID: this.props.configsettings.filter(x => x.category === "Email")
                .filter(x => x.isSelected == true).map((item) => {
                    return item.configSettingID;
                }),
            isSaveConfirmPopup: false,
            isShowAuthorizePopup: false
        };
    }
    hideAuthorizePopup = () => {
        this.setState({ isShowAuthorizePopup: !this.state.isShowAuthorizePopup });
    }

    closePopup() {
        this.setState({ showSuccessMessage: false });
        //window.location.reload();
    }

    checkRoleId = (e, configId) => {
        let { SelectedConfigurationID } = this.state;
        if (e.target.checked) {
            SelectedConfigurationID.push(configId);
        } else {
            let configIndex = SelectedConfigurationID.indexOf(configId);
            SelectedConfigurationID.splice(configIndex, 1);
        }
        this.setState({ SelectedConfigurationID });
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

    validate = () => {
        const errors = {};
        const { data, SelectedConfigurationID } = this.state;

        return Object.keys(errors).length === 0 ? null : errors;
    };

    handleSubmit = () => {
        const errors = this.validate();
        this.setState({ isBtnLoading: errors ? false : true, errors: errors || {}, isSaveConfirmPopup: false });
        if (errors) return;
        const { data, SelectedConfigurationID, configsettings } = { ...this.state };
        let ConfigurationInfo = Object.assign({}, data);

        let objselectedConfigSettings = [];

        configsettings.map((data, index) => {
            objselectedConfigSettings.push({
                ProviderConfigSettingsID: data.providerConfigSettingsID,
                ConfigSettingID: data.configSettingID,
                Value: SelectedConfigurationID.find(x => x == data.configSettingID) ? 'true' : 'false'
            });
        });
        ConfigurationInfo.ConfigSettingsToSave = objselectedConfigSettings;
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
    handleConfirmSave = (isConfirmDelete) => {
        this.setState({ isSaveConfirmPopup: false });
        isConfirmDelete && this.handleSubmit();
    };
    handleOnSubmit = () => {
        this.setState({ isSaveConfirmPopup: true });
    }

    render() {
        let { errors, isBtnLoading, showSuccessMessage, configsettings, SelectedConfigurationID, isSaveConfirmPopup } = this.state
        let isCMSPortalCreated = this.props.userInfo.iscmsportalcreated && this.props.userInfo.iscmsportalcreated === 'true';

        return (
            <div>
                {showSuccessMessage &&
                    <MessageBar Message={`Configurations saved successfully.`} handleClose={() => this.closePopup(true)} />
                }
                <div className="container">
                    <div className="row">

                        <div className="col-lg-12">
                            <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                <h5 className="text-primary border-bottom pb-2 mb-2">
                                    Send Email Notifications
                                </h5>
                                {!isCMSPortalCreated && //this.props.userInfo.iscmsportalcreated && this.props.userInfo.iscmsportalcreated !== 'true' &&
                                    <div className="alert alert-light border text-dark">
                                        <React.Fragment>
                                            <SVGIcon
                                                name="warning"
                                                width="24"
                                                height="24"
                                                className="mr-3"
                                            ></SVGIcon>
                                            In order to change Email Notification configuration you need to claim the website first.

                                            <Link
                                                to="/CustomerWebsite"
                                                className="text-primary ml-3"
                                            >
                                                Claim Your Website
                                            </Link>
                                        </React.Fragment>
                                    </div>
                                }
                                {!isCMSPortalCreated &&
                                    <div className="row mx-0" style={{ background: "#c2cbcb" }}>
                                        {configsettings.map((item, index) => {
                                            return (
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                    <div className=" custom-control custom-checkbox">
                                                        <input className="custom-control-input" type="checkbox" disabled={!isCMSPortalCreated} checked={SelectedConfigurationID.length > 0 ? SelectedConfigurationID.indexOf(item.configSettingID) > -1 : false} id={"settings" + index} onChange={(e) => { this.checkRoleId(e, item.configSettingID) }} value={item.configSettingID} /> {/*onChange={(e) => { this.checkRoleId(e, item.roleId) }} */}
                                                        <label className="custom-control-label" htmlFor={"settings" + index}>{" " + item.displayName}</label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {isCMSPortalCreated &&
                                    <div className="row mx-0">
                                        {configsettings.map((item, index) => {
                                            return (
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-2">
                                                    <div className=" custom-control custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            type="checkbox"
                                                            checked={SelectedConfigurationID.length > 0
                                                                ? SelectedConfigurationID.indexOf(item.configSettingID) > -1
                                                                : false}
                                                            id={"settings" + index}
                                                            onChange={(e) => { this.checkRoleId(e, item.configSettingID) }}
                                                            value={item.configSettingID} /> {/*onChange={(e) => { this.checkRoleId(e, item.roleId) }} */}
                                                        <label className="custom-control-label" htmlFor={"settings" + index}>{" " + item.displayName}</label>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }

                            </div>
                            {isCMSPortalCreated &&
                                <AuthorizeComponent title="Configuration~agentsettings-saveconfiguration" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                    <div className="row mt-3">
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

                                            <button className="btn btn-primary mr-2 float-right"
                                                onClick={() => {
                                                    AuthorizeComponentCheck(this.props.userInfo.rolePermissions,
                                                        "Configuration~agentsettings-saveconfiguration")
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
                                </AuthorizeComponent>
                            }
                        </div>

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
                                message="Are you sure you want to change configuration?"
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

export default EmailConfriguration
