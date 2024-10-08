import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "../../components/common/loader";
import Select from "react-select";
import ActionModal from "../../helpers/action-modal";
import MessageBar from '../../components/admin/message-bar';
import Form from "../../components/common/form";

export class SecurityObjectsAgency extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ProviderID: this.props.userInfo.agentID,
                securityobject: "",
                securityobjectkey: "",
                password: ""
            },
            isLoading: false,
            securityObjectdetails: "",
            selectedTemplateName: "vertical",
            selectedObjectID: "",
            selectedRoleModuleID: "",
            isAdminAccess: false,
            isDeleteObject: false,
            errors: {},
            isBtnLoading: false,
            isSaveConfirmPopup: false,
            saveError: "",
            mode: "Edit",
            password: 'actl2018',
            isloggedin: false
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
    componentDidMount = async () => {
        this.setState({ isLoading: true });
        let securityObjectdetails = await this.getSecurityObjectDetails();
        this.setState({ securityObjectdetails: securityObjectdetails.securityObjectdetails, isLoading: false });
    }
    getEmployees = async () => {
        let reqOBJ = { Request: { IsActive: true, PageNumber: 0, PageSize: 0 } };
        let reqURL = "admin/employee/list";
        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (data) {
                    if (data.response.length > 0) {
                        let employeesOptions = data.response.map(item => {
                            return {
                                label: item.fullName ?? item.firstName + " " + item.lastName,
                                value: item.userID,
                                isLoggedinEmployee: item.isLoggedinEmployee,
                                crewNatureId: item.crewNatureID,
                            }
                        });
                        resolve({ employeesOptions })
                    }
                    else {
                        resolve({ employeesOptions: [] })
                    }
                }.bind(this),
                "POST");
        });
    }
    getSecurityObjectDetails = async (data) => {
        const reqOBJ = {};
        let reqURL = "admin/security/getdetails";

        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
                resolve({ securityObjectdetails: resonsedata.response });

            }.bind(this), "GET");
        });
    }

    handleChange = async ({ currentTarget: input }) => {
        let selectedObjectID = this.state.selectedObjectID;
        let selectedRoleModuleID = this.state.selectedRoleModuleID;
        let isAdminAccess = false;
        let isDeleteObject = false;
        if (input.name === "securityobject") {
            selectedObjectID = input.value;
            selectedRoleModuleID = this.state.securityObjectdetails.objectKeyDetails.find(x => x.objectID === input.value).configSettingId;
            isAdminAccess = this.state.securityObjectdetails.objectKeyDetails.find(x => x.objectID === input.value).isAdminAccess;
            isDeleteObject = this.state.securityObjectdetails.objectKeyDetails.find(x => x.objectID === input.value).isDeleteObject;
        }
        else {
            selectedRoleModuleID = input.value;
        }
        this.setState({ selectedObjectID, selectedRoleModuleID, isAdminAccess, isDeleteObject });
    };

    changeAdminAccess = () => {
        this.setState({ isAdminAccess: !this.state.isAdminAccess });
    }
    changeDeleteObject = () => {
        this.setState({ isDeleteObject: !this.state.isDeleteObject });
    }

    handleConfirmSave = (isConfirmDelete) => {
        this.setState({ isSaveConfirmPopup: false });
        isConfirmDelete && this.handleSubmit();
    };

    handleOnSubmit = (mode) => {
        const errors = this.validate(mode);
        this.setState({ errors: errors || {} });
        if (errors) return;
        this.setState({ isSaveConfirmPopup: true, mode });
    }

    handleSubmit = () => {
        this.setState({ isBtnLoading: true, isSaveConfirmPopup: false });
        if (this.state.mode === 'Edit') {
            const reqOBJ = {
                request: {
                    objectID: this.state.selectedObjectID,
                    isAdminAccess: this.state.isAdminAccess,
                    isDeleteObject: this.state.isDeleteObject,
                    configSettingId: this.state.selectedRoleModuleID
                }
            };

            let reqURL = "admin/security/updatedetails";
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
        else {

            const reqOBJ = {
                request: {
                    ParentObjectID: this.state.selectedObjectID,
                    DisplayName: this.state.data.securityobject,
                    ObjectKeyID: this.state.data.securityobjectkey,
                    IsAdminAccess: this.state.isAdminAccess,
                    IsDeleteObject: this.state.isDeleteObject,
                    ConfigSettingId: this.state.selectedRoleModuleID
                }
            };

            let reqURL = "admin/security/insertdetails";
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

    }

    validate = (mode) => {
        const errors = {};
        const { selectedObjectID, data } = this.state;
        if (mode === "Edit") {
            if (selectedObjectID === '') {
                errors["SaveError"] = "Please Select Security Object";
            }
        }
        else {
            if (selectedObjectID === '') {
                errors["SaveError"] = "Please Select Security Parent Object";
            }

            if (!this.validateFormData(data.securityobject, "require")) errors.securityobject = "Security Object required";

            if (data.securityobject !== "" && !this.validateFormData(data.securityobject, "special-characters-not-allowed", /[<>]/))
                errors.securityobject = "< and > characters not allowed";

            if (!this.validateFormData(data.securityobjectkey, "require")) errors.securityobjectkey = "Security Object Key required";

            if (data.securityobjectkey !== "" && !this.validateFormData(data.securityobjectkey, "special-characters-not-allowed", /[<>]/))
                errors.securityobjectkey = "< and > characters not allowed";

        }

        return Object.keys(errors).length === 0 ? null : errors;
    };

    handleAddClick = () => {
        this.setState({ mode: 'Add' });
    }

    handleLoginClick = () => {
        if (this.state.data.password === this.state.password) {
            this.setState({ isloggedin: true });
        }
    }
    handlePassword = (e) => {
        let { data } = this.state;
        data.password = e.target.value;
        this.setState({ data });
    }
    render() {
        let { isLoading, securityObjectdetails, isBtnLoading, errors, isSaveConfirmPopup, showSuccessMessage, mode, isloggedin } = this.state
        const customStylesObjects = {
            control: styles => ({ ...styles, "textTransform": "capitalize" }),
            option: styles => ({ ...styles, "textTransform": "capitalize" }),
            menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' }),
            valueContainer: (provided, state) => ({
                ...provided,
                height: '50px',
                padding: '0 6px'
            }),
        };
        const customStyles = {
            control: styles => ({ ...styles, "textTransform": "capitalize" }),
            option: styles => ({ ...styles, "textTransform": "capitalize" }),
            menu: styles => ({ ...styles, width: 'auto', 'minWidth': '100%' })

        };

        let SecurityObjectOptions = [];
        let SecurityParentObjectOptions = [];
        let RoleModuleOptions = [];
        if (securityObjectdetails) {
            SecurityObjectOptions = securityObjectdetails.objectKeyDetails.map(item => {
                return {
                    label: item.objectDisplayName,
                    value: item.objectID,
                    key: item.objectKeyID
                }
            });
            SecurityParentObjectOptions = securityObjectdetails.objectKeyDetails.filter(x => (x.parentObjectID === 503 || x.parentObjectID === 1)).map(item => {
                return {
                    label: item.objectDisplayName,
                    value: item.objectID,
                    key: item.objectKeyID
                }
            });
            RoleModuleOptions = securityObjectdetails.roleModuleDetails.map(item => {
                return {
                    label: item.displayName,
                    value: item.configSettingID,
                }
            });
        }
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            {"Security Objects"}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>

                        {!isloggedin &&

                            <React.Fragment>
                                <div className="col-lg-9">
                                    <div className="container ">
                                        <div className="form-group password">
                                            <label for="password">Password *</label>
                                            <input type="password" maxlength="100" minlength="2" name="password" id="password"
                                                className="form-control "
                                                value={this.state.data.password}
                                                onChange={this.handlePassword} />
                                        </div>
                                        {/* {this.renderInputParam({
                                            name: "password",
                                            label: "Password *",
                                            type: "password",
                                            minlength: 2,
                                            maxlength: 100,
                                        })} */}
                                    </div>
                                    <button className="btn btn-primary mr-2 float-right"
                                        onClick={() => { this.handleLoginClick() }}
                                    >Login</button>
                                </div>
                            </React.Fragment>

                        }

                        {isloggedin && isLoading &&
                            <div className="col-lg-8">
                                <div className="container ">
                                    <Loader />
                                </div>
                            </div>
                        }

                        {isloggedin && !isLoading &&

                            <div className="col-lg-9">
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        {showSuccessMessage &&
                                            <MessageBar Message={`Security Objects saved successfully.`} handleClose={() => this.closePopup(true)} />
                                        }
                                        <div className="container">
                                            <div className="row">
                                                <div className='col-lg-12 mt-4'>
                                                    <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                                                        <h5 className="text-primary border-bottom pb-2 mb-2">
                                                            Security Objects Management
                                                            <button className="btn btn-primary float-right"
                                                                style={{ padding: "2px 12px" }}
                                                                onClick={() => { this.handleAddClick() }}
                                                            >
                                                                {isBtnLoading ? (
                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-2"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                ) : null}
                                                                Add</button>
                                                        </h5>
                                                        {mode === 'Edit' &&
                                                            <React.Fragment>
                                                                <div className='row'>
                                                                    <div className='col-lg-9'>
                                                                        <label htmlFor={"objectkey"}>{"Security Object"}</label>
                                                                        <div className={"form-group"}>
                                                                            <Select
                                                                                styles={customStylesObjects}
                                                                                placeholder="Select Object Key..."
                                                                                id={"objectkey"}
                                                                                options={SecurityObjectOptions}
                                                                                getOptionLabel={(option) => <div><React.Fragment><b>{option.label}</b><br />{option.key}</React.Fragment></div>}
                                                                                value={SecurityObjectOptions.find(x => x.value === this.state.selectedObjectID)}
                                                                                onChange={(e) => {
                                                                                    this.handleChange({ currentTarget: { value: e.value, name: "securityobject" } })
                                                                                }}
                                                                                noOptionsMessage={() => "No Security Object(s) available"}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </React.Fragment>
                                                        }
                                                        {mode === 'Add' &&
                                                            <React.Fragment>
                                                                <div className='row'>
                                                                    <div className='col-lg-4'>
                                                                        <label htmlFor={"objectkey"}>{"Security Parent Object"}</label>
                                                                        <div className={"form-group"}>
                                                                            <Select
                                                                                styles={customStyles}
                                                                                placeholder="Select Object Key..."
                                                                                id={"objectkey"}
                                                                                options={SecurityParentObjectOptions}
                                                                                getOptionLabel={(option) => <div><React.Fragment>{option.label}</React.Fragment></div>}
                                                                                value={SecurityParentObjectOptions.find(x => x.value === this.state.selectedObjectID)}
                                                                                onChange={(e) => {
                                                                                    this.handleChange({ currentTarget: { value: e.value, name: "securityobject" } })
                                                                                }}
                                                                                noOptionsMessage={() => "No Security Object(s) available"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-lg-4'>
                                                                        {this.renderInput("securityobject", "Secutiry Object")}
                                                                    </div>

                                                                    <div className='col-lg-4'>
                                                                        {this.renderInput("securityobjectkey", "Secutiry Object Key")}
                                                                    </div>

                                                                </div>

                                                            </React.Fragment>
                                                        }
                                                        <div className='row'>
                                                            <div className='col-lg-4'>
                                                                <label htmlFor={"objectkey"}>{"Module Name"}</label>
                                                                <div className={"form-group"}>
                                                                    <Select
                                                                        styles={customStyles}
                                                                        placeholder="Select Role Module..."
                                                                        id={"objectkey"}
                                                                        options={RoleModuleOptions}
                                                                        value={RoleModuleOptions.find(x => x.value === this.state.selectedRoleModuleID)}
                                                                        onChange={(e) => {
                                                                            this.handleChange({ currentTarget: { value: e.value, name: "rolemodule" } })
                                                                        }}
                                                                        noOptionsMessage={() => "No Role Module(s) available"}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <label htmlFor={"objectkey"}>&nbsp;</label>
                                                                <div className={"form-group"}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.isAdminAccess}

                                                                        id="percentage"
                                                                        onChange={(e) => this.changeAdminAccess()}
                                                                    /> Is Admin Access
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <label htmlFor={"objectkey"}>&nbsp;</label>
                                                                <div className={"form-group"}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.isDeleteObject}

                                                                        id="percentage"
                                                                        onChange={(e) => this.changeDeleteObject()}
                                                                    /> Is Delete Object
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
                                                        </div>
                                                        <div class="col-lg-12 mr-2">

                                                            {!isBtnLoading &&
                                                                <button className="btn btn-primary mr-2 float-right"
                                                                    onClick={() => { this.handleOnSubmit(mode === 'Edit' ? 'Edit' : 'Add') }}
                                                                >
                                                                    {isBtnLoading ? (
                                                                        <span
                                                                            className="spinner-border spinner-border-sm mr-2"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                    ) : null}
                                                                    Save</button>
                                                            }
                                                            {isBtnLoading &&
                                                                <button className="btn btn-primary mr-2 float-right">
                                                                    {isBtnLoading ? (
                                                                        <span
                                                                            className="spinner-border spinner-border-sm mr-2"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        ></span>
                                                                    ) : null}
                                                                    Save</button>
                                                            }

                                                            <button className="btn btn-secondary mr-2 float-right"
                                                                onClick={() => { this.props.history.push(`/`); }}
                                                            >Cancel</button>
                                                        </div>
                                                    </div>



                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }


                    </div>
                </div >
                {
                    isSaveConfirmPopup && (
                        <ActionModal
                            title="Confirm"
                            message="Are you sure want to save security objects?"
                            positiveButtonText="Confirm"
                            onPositiveButton={() => this.handleConfirmSave(true)}
                            handleHide={() => this.handleConfirmSave(false)}
                        />
                    )
                }
            </div >
        )
    }
}

export default SecurityObjectsAgency
