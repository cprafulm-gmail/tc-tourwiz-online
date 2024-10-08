import React from 'react';
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from "../../components/quotation/quotation-menu";
import Form from "../../components/common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import MessageBar from '../../components/admin/message-bar';
import { Helmet } from "react-helmet";
export class ChangePassword extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                OldPassword: "",
                Password: "",
                retypePassword: "",
                userID: 0
            },
            errors: {},
            isLoading: false
        };
    }

    handleValueChange = (value, id) => {
        let data = this.state.data;
        data[id] = value
        this.setState({ data: data })
    }
    componentDidMount() {
        const { userID } = this.props.userInfo;

        if (userID) {
            this.setState({ userID });
        } else {
            this.RedirectToEmployeeList();
        }
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

    handleChangePassword = () => {
        let { data, userID } = this.state;
        let errors = {};
        if (!data["OldPassword"] || !data["Password"] || !data["retypePassword"]) {
            if (!data["OldPassword"]) {
                errors["OldPassword"] = "Enter Old Password"
            }
            if (!data["Password"]) {
                errors["Password"] = "Enter Password"
            }
            if (!data["retypePassword"]) {
                errors["retypePassword"] = "Re-type Password"
            }
        }

        if (data["Password"].length < 6) {
            errors["Password"] = "Password should be of Minimum 6 letters"
        }

        if (data["OldPassword"] && !this.validateFormData(data["OldPassword"], "special-characters-not-allowed", /[<>'&` "]/))
            errors["OldPassword"] = "<,>,',&,`,\" and blank space characters not allowed";

        if (data["Password"] && !this.validateFormData(data["Password"], "special-characters-not-allowed", /[<>'&` "]/))
            errors["Password"] = "<,>,',&,`,\" and blank space characters not allowed";

        if (data["retypePassword"] && !this.validateFormData(data["retypePassword"], "special-characters-not-allowed", /[<>'&` "]/))
            errors["retypePassword"] = "<,>,',&,`,\" and blank space characters not allowed";

        if (Object.keys(errors).length > 0) {
            this.setState({ errors: errors })
            return;
        }

        if (data.Password === data.retypePassword) {
            let reqURL = "admin/employee/password/change"
            let reqOBJ = {
                request: {
                    OldPassword: data["OldPassword"],
                    Password: data["Password"],
                    userID
                }
            }
            this.setState({ isLoading: true, errors });
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (resonsedata) {
                    if (resonsedata.error) {
                        let { errors } = this.state;
                        errors.SaveError = resonsedata.error;
                        this.setState({ isLoading: false, errors });
                    } else {
                        this.setState({ isLoading: false, showSuccessMessage: true });
                        this.props.handleLogOut();
                    }
                }.bind(this),
                "POST"
            );
        }
        else {
            errors["retypePassword"] = "Password doesn't match"
            this.setState({ errors: errors })
        }
    }
    RedirectToEmployeeList = () => {
        this.props.history.push(`/`);
    };
    render() {
        let { errors, isLoading, showSuccessMessage } = this.state;
        return (
            <div>
                <div>
                    <div className="title-bg pt-3 pb-3 mb-3">
                        <Helmet>
                            <title>
                                Change Password
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
                                Change Password
                            </h1>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 hideMenu">
                                <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-8">

                                <div className="container">
                                    {showSuccessMessage &&
                                        <MessageBar Message={`Password changed successfully.`} handleClose={() => this.RedirectToEmployeeList()} />
                                    }
                                    <div className="form-group">
                                        <label for={"oldPassword"}>Old Password&nbsp;&nbsp;</label>
                                        <input
                                            className="form-control"
                                            id="oldPassword"
                                            name="oldPassword"
                                            type="password"
                                            onChange={(e) => { this.handleValueChange(e.target.value, "OldPassword") }}
                                        />
                                        {errors["OldPassword"] && (
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["OldPassword"]}
                                            </small>
                                        )}
                                    </div>


                                    <div className="form-group">
                                        <label htmlFor={"newPassword"}>New Password&nbsp;&nbsp;</label>
                                        <input
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            onChange={(e) => { this.handleValueChange(e.target.value, "Password") }}
                                        />
                                        {errors["Password"] && (
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["Password"]}
                                            </small>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={"retypePassword"}>Confirm New Password&nbsp;&nbsp;</label>
                                        <input
                                            className="form-control"
                                            id="retypePassword"
                                            name="retypePassword"
                                            type="password"
                                            onChange={(e) => { this.handleValueChange(e.target.value, "retypePassword") }}
                                        />
                                        {errors["retypePassword"] && (
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["retypePassword"]}
                                            </small>
                                        )}
                                    </div>

                                    {errors["SaveError"] && (
                                        <div className="form-group">
                                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                {errors["SaveError"]}
                                            </small>
                                        </div>
                                    )}
                                    <div className="form-group">

                                        <button
                                            name="Save"
                                            onClick={() => this.handleChangePassword()}
                                            className="btn btn-primary"
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
                                        <button
                                            name="Cancel"
                                            className="btn btn-primary  ml-2"
                                            onClick={() => this.RedirectToEmployeeList()}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword
