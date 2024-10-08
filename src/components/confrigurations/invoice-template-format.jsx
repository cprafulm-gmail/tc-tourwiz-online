import React, { Component } from 'react'
import Form from "../../components/common/form"
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import ActionModal from "../../helpers/action-modal";
import imgInvoiceTemplate1 from "../../assets/images/customer-invoice/invoiceTemplate1.jpg";
import imgInvoiceTemplate2 from "../../assets/images/customer-invoice/invoiceTemplate2.jpg";
import MessageBar from '../../components/admin/message-bar';
import ModelPopup from '../../helpers/model';

export class InvoiceTemplate extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderID: this.props.userInfo.agentID
            },
            errors: {},
            isLoading: this.props.isLoading,
            isBtnLoading: false,
            saveError: "",
            isShowPopup: false,
            configSettings: this.props.configSettings.filter(x => x.category === "Other" && x.displayName === "Invoice Template Type"),
            selectedConfigurationID: this.props.configSettings.filter(x => x.category === "Other" && x.displayName === "Invoice Template Type").length > 0
                ? this.props.configSettings.filter(x => x.category === "Other" && x.displayName === "Invoice Template Type")[0].configSettingID
                : 0,
            isSaveConfirmPopup: false,
            isShowAuthorizePopup: false,
            selectedTemplateName: this.props.configSettings.filter(x => x.category === "Other" && x.displayName === "Invoice Template Type").length > 0
                ? this.props.configSettings.filter(x => x.category === "Other" && x.displayName === "Invoice Template Type")[0].value
                : "vertical",
            previewInvoiceTemplate: false,
            invoiceprefix: this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix").length > 0
                && this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0].value && this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0].value !== ""
                ? this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0].value
                : "INV",
            invoiceprefixdisabled: this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix").length > 0
                && this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0].value && this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0].value !== ""
                ? true
                : false
        };
    }
    hideAuthorizePopup = () => {
        this.setState({ isShowAuthorizePopup: !this.state.isShowAuthorizePopup });
    }

    validate = () => {
        const errors = {};

        if (this.state.invoiceprefix === "") {
            errors["saveinvoiceprefixerror"] = "Invoice Prefix Required.";
        }
        else if (this.state.invoiceprefix.length < 2) {
            errors["saveinvoiceprefixerror"] = "Enter at least 2 character in invoice prefix.";
        }
        else if (!this.validateFormData(this.state.invoiceprefix, "only-alpha")) {
            errors["saveinvoiceprefixerror"] = "Enter only alpha characters.";
        }

        return Object.keys(errors).length === 0 ? null : errors;
    }

    handleSubmit = () => {
        const { data, configSettings } = { ...this.state };
        let ConfigurationInfo = Object.assign({}, data);




        let objselectedInvoiceSettings = [];
        objselectedInvoiceSettings = configSettings.find(x => x.category === 'Other' && x.displayName === "Invoice Template Type");
        objselectedInvoiceSettings = [{
            ProviderconfigSettingsID: objselectedInvoiceSettings.providerConfigSettingsID,
            ConfigSettingID: objselectedInvoiceSettings.configSettingID,
            value: this.state.selectedTemplateName
        }
        ]

        if (!this.state.invoiceprefixdisabled && this.state.invoiceprefix.toLowerCase() !== "inv" && this.state.invoiceprefix !== "") {
            let objInvoiceprefixSettings = [];
            objInvoiceprefixSettings = this.props.configSettings.filter(x => x.category === "Invoice" && x.displayName === "Agent Invoice Prefix")[0]
            objselectedInvoiceSettings.push({
                ProviderconfigSettingsID: objInvoiceprefixSettings.providerConfigSettingsID,
                ConfigSettingID: objInvoiceprefixSettings.configSettingID,
                value: this.state.invoiceprefix
            });
        }
        ConfigurationInfo.ConfigSettingsToSave = objselectedInvoiceSettings;
        const reqOBJ = {
            request: ConfigurationInfo
        };
        let reqURL = "admin/updateconfigurations";
        this.setState({ isBtnLoading: true });
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
            this.setState({ isBtnLoading: false });
            if (resonsedata && resonsedata.response && resonsedata.response.status === "success") {
                this.setState({ isShowPopup: true, showSuccessMessage: true });
            }
            else {
                this.setState({ saveError: resonsedata.error })
            }
        }.bind(this), "POST");

    }
    handleConfirmSave = (isConfirmDelete) => {
        this.setState({ isSaveConfirmPopup: !this.state.isSaveConfirmPopup });
        isConfirmDelete && this.handleSubmit();
    };
    handleonsubmit = () => {
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) {
            return;
        }
        else {
            this.setState({ isSaveConfirmPopup: !this.state.isSaveConfirmPopup });
        }
    }
    handleInvoiceTemplate = (template) => {
        this.setState({ selectedTemplateName: template })
    }
    closePopup() {
        this.setState({ isShowPopup: false, showSuccessMessage: false });
        window.location.reload();
    }
    handleHide = () => {
        this.setState({
            previewInvoiceTemplate: false,
        });
    };
    handlePreviewInvoice = (template) => {
        this.setState({
            previewInvoiceTemplate: true, selectedTemplateName: template
        });
    }
    handleprefixchange = (e) => {
        this.setState({
            invoiceprefix: e.target.value
        });
    }
    render() {
        let { errors, isBtnLoading, showSuccessMessage, isSaveConfirmPopup } = this.state

        return (
            <React.Fragment>
                {showSuccessMessage &&
                    <MessageBar Message={`Configurations saved successfully.`} handleClose={() => this.closePopup(true)} />
                }
                <div className='col-lg-12 mt-4'>
                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                        <h5 className="text-primary border-bottom pb-2 mb-2">
                            Invoice Template
                        </h5>
                        <div className='row'>
                            <div className='col-lg-6  d-flex justify-content-center'>
                                <div className="shadow position-relative" style={{ height: "150", width: "75px" }}>
                                    <img
                                        class="img-fluid border"
                                        src={imgInvoiceTemplate1}
                                        alt="Invoice Template 2"
                                        onClick={() => { this.handlePreviewInvoice("vertical") }}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-6  d-flex justify-content-center'>
                                <div className="shadow position-relative"
                                    style={{ height: "fit-content", width: "100px", marginTop: "25px" }}>
                                    <img
                                        class="img-fluid border"
                                        src={imgInvoiceTemplate2}
                                        alt="Invoice Template 1"
                                        onClick={() => { this.handlePreviewInvoice("horizontal") }}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-6 d-flex justify-content-center mt-2'>
                                <div className=" custom-control custom-checkbox">
                                    <input
                                        className="custom-control-input"
                                        type="checkbox"
                                        id="selectInvoiceTemplate1"
                                        value="vertical"
                                        checked={this.state.selectedTemplateName === "vertical" ? true : false}
                                        onChange={() => { this.handleInvoiceTemplate("vertical") }}
                                    />
                                    <label className='custom-control-label pl-2'
                                        onClick={() => { this.handleInvoiceTemplate("vertical") }}
                                    >
                                        Vertical Invoice
                                    </label>
                                </div>
                            </div>
                            <div className='col-lg-6 d-flex justify-content-center'>
                                <div className=" custom-control custom-checkbox" style={{ marginTop: "8px" }}>
                                    <input
                                        className="custom-control-input"
                                        type="checkbox"
                                        id="selectInvoiceTemplate2"
                                        value="horizontal"
                                        checked={this.state.selectedTemplateName === "horizontal" ? true : false}
                                        onChange={() => { this.handleInvoiceTemplate("horizontal") }}
                                    />
                                    <label className='custom-control-label pl-2'
                                        onClick={() => { this.handleInvoiceTemplate("horizontal") }}
                                    >
                                        Horizontal Invoice
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='col-lg-12 mt-4'>
                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                        <h5 className="text-primary border-bottom pb-2 mb-2 mt-2">
                            Invoice Number Prefix <small>(e.g INV0000000001 / M-INV0000000001)</small>
                        </h5>
                        <div className='col-lg-6 d-flex p-0'>
                            <label className='col-lg-3 mt-1 p-0'>Invoice Prefix : </label>
                            <input type="text"
                                name={"invprefix"}
                                id={"invprefix"}
                                className="form-control "
                                minLength="2"
                                maxLength="3"
                                disabled={this.state.invoiceprefixdisabled}
                                value={this.state.invoiceprefix}
                                onChange={(e) => { this.handleprefixchange(e) }}
                            />
                        </div>
                        <h6 className="text-secondary pb-2 mb-2 mt-2">Changing the invoice prefix is a one-time process. After modifying, further alterations to it are not permitted.</h6>
                    </div>
                </div>
                <AuthorizeComponent title="AgencyConfiguration~agentsettings-saveconfiguration" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                    <div className="col-lg-12 mt-3">
                        {errors["SaveError"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                {errors["SaveError"]}
                            </small>
                        )}
                        {errors["selectedConfigurationID"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                {errors["selectedConfigurationID"]}
                            </small>
                        )}
                        {errors["saveinvoiceprefixerror"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                {errors["saveinvoiceprefixerror"]}
                            </small>
                        )}
                        <button className="btn btn-primary mr-2 float-right"
                            onClick={() => { AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "AgencyConfiguration~agentsettings-saveconfiguration") ? this.handleonsubmit() : this.setState({ isShowAuthorizePopup: true }) }}
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
                </AuthorizeComponent>
                {this.state.isShowAuthorizePopup &&
                    <ModelPopupAuthorize
                        header={""}
                        content={""}
                        handleHide={this.hideAuthorizePopup}
                        history={this.props.history}
                    />
                }
                {this.state.previewInvoiceTemplate &&
                    <ModelPopup
                        header={"Sample Invoice"}
                        content={<img
                            class="img-fluid border"
                            src={this.state.selectedTemplateName === "horizontal"
                                ? imgInvoiceTemplate2 : imgInvoiceTemplate1}
                        />}
                        handleHide={this.handleHide}
                    />
                }
                {isSaveConfirmPopup && (
                    <ActionModal
                        title="Confirm"
                        message="Are you sure you want to change configuration?"
                        positiveButtonText="Confirm"
                        onPositiveButton={() => this.handleConfirmSave(true)}
                        handleHide={() => this.handleConfirmSave(false)}
                    />
                )}
            </React.Fragment>
        )
    }
}

export default InvoiceTemplate
