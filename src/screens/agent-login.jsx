import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";

class AgentLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false,
      username: "",
      password: "",
      email: "",
      isButtonLoding: false,
      isValidUsername: true,
      isValidPassword: true,
      isValidEmail: true,
      isShowForgotPassword: false,
      showSuccessMsg: false,
      errorMessage: "",
      quotationMode: false,
    };
  }

  handleChange = (e) => {
    if (e.target.name === "username") {
      this.setState({
        username: e.target.value.trim(),
        isValidUsername: true,
      });
    }
    if (e.target.name === "password") {
      this.setState({
        password: e.target.value.trim(),
        isValidPassword: true,
        errorMessage: "",
      });
    }
    if (e.target.name === "email") {
      this.setState({
        email: e.target.value.trim(),
        isValidEmail: true,
        errorMessage: "",
      });
    }
  };

  forgotPassword = () => {
    let isValidate = true;
    var regxEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.state.username === "") {
      isValidate = false;
      this.setState({
        isValidUsername: !(this.state.username === ""),
        errorMessage: Trans("_rqUserNameEmail"),
      });
    } else {
      isValidate = true;
      this.setState({
        isValidUsername: true,
      });
    }
    if (this.state.email === "") {
      isValidate = false;
      this.setState({
        isValidEmail: false,
        errorMessage: Trans("_rqUserNameEmail"),
      });
    } else if (!regxEmail.test(this.state.email)) {
      isValidate = false;
      this.setState({
        isValidEmail: false,
        errorMessage: Trans("_error_email_email"),
      });
    } else {
      if (isValidate) isValidate = true;
      this.setState({
        isValidEmail: true,
      });
    }
    if (isValidate) {
      this.setState({
        isValidUsername: true,
        isValidEmail: true,
        isButtonLoding: true,
        errorMessage: "",
      });
      var reqURL = "api/v1/user/forgotpassword";
      let ContactInformation = null;
      ContactInformation = {
        Email: this.state.email,
      };

      var reqOBJ = {
        Request: {
          ContactInformation,
          userID: this.state.username,
          CanSendEmail: true,
        },
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.setState({
            isButtonLoding: false,
          });
          if (data.status.code === 0) {
            this.setState({
              errorMessage: Trans("_forgotPasswordMessageEmail"),
              showSuccessMsg: true,
              username: "",
              email: "",
            });
          } else {
            let message =
              Trans("_" + data.status.code) === "_" + data.status.code
                ? data.status.message
                : Trans("_" + data.status.code);
            this.setState({
              errorMessage: message,
              showSuccessMsg: false,
            });
          }
        }.bind(this)
      );
    }
  };

  authUser = () => {
    let isValidate = true;
    if (this.state.username === "" || this.state.password === "") {
      isValidate = false;
      this.setState({
        isValidUsername: !(this.state.username === ""),
        isValidPassword: !(this.state.password === ""),
        errorMessage: Trans("_rqUserNamePassword"),
      });
    } else {
      isValidate = true;
      this.setState({
        isButtonLoding: true,
        isValidUsername: true,
        isValidPassword: true,
        errorMessage: "",
      });
      if (isValidate) {
        var reqURL = "api/v1/user/login";
        var reqOBJ = {
          Request: {
            LoginName: this.state.username,
            Password: this.state.password,
            ContactInformation: { Email: this.state.username },
          },
        };

        apiRequester(
          reqURL,
          reqOBJ,
          function (data) {

            if (data.status.code === 0) {
              if (localStorage.getItem("afUserType") === null)
                localStorage.setItem("afUserType", data.response.afUserType);
              this.setState({ isButtonLoding: false });
              let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
              if (isPersonateEnabled) {
                this.getPortals();
              }
              else {
                this.props.handleLoginBox(data);
                !this.state.quotationMode
                  ? this.props.history.push(`/`)
                  : this.props.history.push(`/Quotation/Create`);
              }
            } else {
              this.setState({
                isButtonLoding: false,
                errorMessage: Trans("_incorrectUserNamePassword"),
              });
            }
          }.bind(this)
        );
      }
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!this.state.isShowForgotPassword) this.authUser();
      else this.forgotPassword();
    }
  };

  getPortals = () => {
    let reqURL = "api/v1/callcenter/portals";
    let reqOBJ = {
      Request: "",
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 41070) {
          this.setState({
            isLoading: true,
          });
        } else {
          this.setState({
            portals: data.response,
            portal: sessionStorage.getItem("portalId")
              ? sessionStorage.getItem("portalId")
              : data.response[0].name,
            isLoading: false,
          });
          let portals = data.response;
          let portalId = sessionStorage.getItem("portalId");
          let personateId = portalId
            ? portals.find((x) => x.id === portalId).defaultPersonateId
            : portals[0].defaultPersonateId;

          let req = {
            id: personateId,
            details: { firstName: "" },
          };
          this.handleSelect(req);
        }
      }.bind(this)
    );
  };

  handleSelect = (req) => {
    this.setState({
      isCallCenterLoader: true,
    });

    let reqURL = "api/v1/callcenter/setpersonate";
    let reqOBJ = {
      Request: req.id,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.setItem("personateId", req.id);
        sessionStorage.setItem("callCenterType", req.type);
        sessionStorage.setItem("bookingFor", req.details.firstName);
        sessionStorage.setItem("bookingForInfo", JSON.stringify(req.details));
        localStorage.setItem("environment", JSON.stringify(data.response));
        localStorage.removeItem("cartLocalId");
        this.setState({
          bookingFor: req.details.firstName,
          isCallCenterDetails: !this.state.isCallCenterDetails,
        });
        this.props.getLoginDetails((data) => {
          this.props.handleLoginBox(data);
          !this.state.quotationMode
            ? this.props.history.push(`/`)
            : this.props.history.push(`/Quotation/Create`);
        });
      }.bind(this)
    );
  };

  render() {
    return (
      <div className="agent-login">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon name="sign-in" className="mr-3" type="fill" width="24" height="24"></SVGIcon>
              {Trans("_titleAgentLogin")}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              {!this.state.isShowForgotPassword ? (
                <div className="border bg-white shadow-sm p-4 mt-4">
                  <h4 className="mb-3">{Trans("_titleAgentLogin")}</h4>
                  <div className="form-group">
                    <label>{Trans("_lblUserName")}</label>
                    <input
                      className={
                        "form-control " +
                        (!this.state.isValidUsername ? "border border-danger" : "")
                      }
                      value={this.state.username ? this.state.username : ""}
                      name="username"
                      type="text"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <div className="form-group">
                    <label>{Trans("_lblPassword")}</label>
                    <input
                      className={
                        "form-control " +
                        (!this.state.isValidPassword ? "border border-danger" : "")
                      }
                      value={this.state.password ? this.state.password : ""}
                      name="password"
                      type="password"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  {!(this.state.isValidPassword && this.state.isValidUsername) ? (
                    <span className="text-center">
                      <small
                        className={
                          "alert text-center mt-0 p-1 d-inline-block " +
                          (this.state.showSuccessMsg ? "alert-success" : "alert-danger")
                        }
                      >
                        {this.state.errorMessage}
                      </small>
                    </span>
                  ) : null}
                  <div className="form-group">
                    <button className="btn btn-primary w-100" type="submit" onClick={this.authUser}>
                      {this.state.isButtonLoding ? (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      {Trans("_btnLogin")}
                    </button>
                  </div>
                  {this.state.isValidPassword &&
                    this.state.isValidUsername &&
                    this.state.errorMessage &&
                    this.state.errorMessage !== "" ? (
                    <span className="text-center">
                      <small
                        className={
                          "alert text-center mt-0 p-1 d-inline-block " +
                          (this.state.showSuccessMsg ? "alert-success" : "alert-danger")
                        }
                      >
                        {this.state.errorMessage}
                      </small>
                    </span>
                  ) : null}
                  <div className="form-group mb-0">
                    <button
                      type="button"
                      className="btn btn-link w-100 text-right"
                      onClick={() =>
                        this.setState({
                          isShowForgotPassword: true,
                          isValidUsername: true,
                          isValidPassword: true,
                          isValidEmail: true,
                          email: "",
                          username: "",
                          errorMessage: "",
                          password: "",
                          isButtonLoding: false,
                          showSuccessMsg: false,
                        })
                      }
                    >
                      {Trans("_forgotPassword")}?
                    </button>
                  </div>
                </div>
              ) : (
                //Forgot Password Modal View
                <div className="border bg-white shadow-sm p-4 mt-4">
                  <h4 className="mb-3">{Trans("_forgotPassword")}</h4>

                  <div className="form-group">
                    <label>{Trans("_lblUserName")}</label>
                    <input
                      className={
                        "form-control " +
                        (!this.state.isValidUsername ? "border border-danger" : "")
                      }
                      value={this.state.username ? this.state.username : ""}
                      name="username"
                      type="text"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <div className="form-group">
                    <label>{Trans("_email")}</label>
                    <input
                      className={
                        "form-control " + (!this.state.isValidEmail ? "border border-danger" : "")
                      }
                      value={this.state.email ? this.state.email : ""}
                      name="email"
                      type="text"
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  {!(this.state.isValidEmail && this.state.isValidUsername) ? (
                    <span className="text-center">
                      <small
                        className={
                          "alert text-center mt-0 p-1 d-inline-block " +
                          (this.state.showSuccessMsg ? "alert-success" : "alert-danger")
                        }
                      >
                        {this.state.errorMessage}
                      </small>
                    </span>
                  ) : null}
                  <div className="form-group">
                    <button
                      className="btn btn-primary w-100"
                      type="submit"
                      onClick={this.forgotPassword}
                    >
                      {this.state.isButtonLoding ? (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      {Trans("_forgotPassword")}
                    </button>
                  </div>
                  {this.state.isValidEmail &&
                    this.state.isValidUsername &&
                    this.state.errorMessage &&
                    this.state.errorMessage !== "" ? (
                    <span className="text-center">
                      <small
                        className={
                          "alert text-center mt-0 p-1 d-inline-block " +
                          (this.state.showSuccessMsg ? "alert-success" : "alert-danger")
                        }
                      >
                        {this.state.errorMessage}
                      </small>
                    </span>
                  ) : null}
                  <div className="form-group mb-0">
                    <button
                      type="button"
                      className="btn btn-link w-100 text-right"
                      onClick={() =>
                        this.setState({
                          isShowForgotPassword: false,
                          username: "",
                          isValidUsername: true,
                          isValidPassword: true,
                          errorMessage: "",
                          password: "",
                          phoneNumber: "",
                          isButtonLoding: false,
                          showSuccessMsg: false,
                        })
                      }
                    >
                      {Trans("_btnBack")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AgentLogin;
