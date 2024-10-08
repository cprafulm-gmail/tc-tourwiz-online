import React, { Component } from "react";
import BannerImg from "../assets/images/landing-pg/about-us.png";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import * as Global from "../helpers/global";
import { Link } from "react-scroll";

class About extends Component {
  state = {
    isLoginPopup: true,
    matches: window.matchMedia("(min-width: 768px)").matches,
  };

  handleLoginPopup = () => {
    this.setState({
      isLoginPopup: !this.state.isLoginPopup,
    });
  };

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
    if (e.target.name === "agentname") {
      this.setState({
        agentname: e.target.value.trim(),
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
            localStorage.setItem("agentName", this.state.agentname);
            if (data.status.code === 0) {
              if (localStorage.getItem("afUserType") === null)
                localStorage.setItem("afUserType", data.response.afUserType);
              this.setState({ isButtonLoding: false });
              let isPersonateEnabled = Global.getEnvironmetKeyValue(
                "isPersonateEnabled"
              );
              if (isPersonateEnabled) {
                this.getPortals();
              } else {
                this.props.handleLoginBox(data);
                !this.state.quotationMode
                  ? this.props.history.push(`/`)
                  : this.props.history.push(`/Dashboard-Tourwiz`);
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
            : this.props.history.push(`/Dashboard-Tourwiz`);
        });
      }.bind(this)
    );
  };

  render() {
    const pageBannerImg = {
      backgroundSize: "100%",
      position: "absolute",
      width: "100%",
      height: "130px",
      left: "0",
      top: "0",
      marginTop: "75px",
      background: `url("${BannerImg}") center -89px no-repeat`,
    };
    const pageBannerOverlay = {
      backgroundSize: "100%",
      position: "absolute",
      width: "100%",
      height: "130px",
      left: "0",
      top: "0",
      marginTop: "75px",
      background: "rgba(0,0,0,.6)",
    };
    return (
      <React.Fragment>
        {this.props.userInfo == "" ? (<div className="container position-relative">
          <Link className={this.state.matches ? " position-absolute landing-pg-hdr-btn text-nowrap text-secondary text-decoration-none" : "landing-pg-hdr-btn text-nowrap text-secondary text-decoration-none"} style={this.state.matches ? { top: "-50px", right: "125px" } : {}} to="/about-us">About Us</Link>
          <button
            className="btn btn-primary position-absolute landing-pg-hdr-btn text-nowrap"
            onClick={() => this.handleLoginPopup()}
          >
            Sign-in
          </button>
        </div>) : null}


        <div className="page-banner d-flex align-items-center justify-content-center text-white">
          <div className="page-title container position-relative text-center mt-5 pb-3" style={{ zIndex: 1 }}>
            <h1 className="font-weight-bold text-uppercase">About us</h1>
          </div>
          <div className="page-banner-img" style={pageBannerImg}></div>
          <div className="page-banner-overlay" style={pageBannerOverlay}></div>
        </div>

        <div className="container-sm mt-5 mb-5 p-0 ">
          <div className="container">
            <div className="text-justify">
              <h2 className="mb-3">Backed by Industry Powerhouses</h2>
              <p>
                TourWiz is promoted by TravelCarma (www.travelcarma.com), one of the world’s top ten travel technology brands with more than 20 years of experience in travel technology, and Monarch Networth Capital (https://www.mnclgroup.com), one of the leading financial services providers in India with over two decades of experience.
              </p>
              <p>
                Together they bring their rich experience in travel technology and finance to provide a stable online platform for travel agents. Backed by capital from Monarch and technology from Travelcarma, Tourwiz has the technical and financial wherewithal to provide travel businesses with a robust cutting edge technology solution for years to come.
              </p>
              <h2 className="mb-3 mt-5">How TourWiz was born</h2>
              <p>
                TourWiz was founded by a team of technocrats and seasoned travellers with over 20 years of experience in travel technology working with travel businesses of all shapes and sizes.
              </p>
              <p>
                Having closely seen how travel agents work over the years, we realized that most of them still rely on Excel sheets, Word documents and in some cases, even pen-and-paper to manage their business.
              </p>
              <p>Whether it’s capturing inquiries, creating itineraries & proposals, recording bookings, or reconciling accounting with suppliers and customers, agents are spending a huge amount of time and effort doing all this manually. Why?</p>
              <p>Are they not tech savvy? Are they happy doing things this way? Not really</p>
              <p>In fact, we conducted extensive research during the pandemic to get to the heart of the matter. We found out that there is in fact a huge demand among agents (more so after COVID) for a better and more efficient online solution, particularly for managing itineraries, customers and accounting.</p>
              <p>The problem though was that nobody was offering a travel application that fits all their needs, one that is aligned with their offline workflows, has all the functionalities they need, is as user-friendly as the other apps they use everyday, all while being easy on the pockets.</p>
              <p>So we decided to build a solution ourselves. </p>
              <p>We used our knowledge and experience in both Travel and IT, reached out to a ton of travel professionals for inputs, and worked tirelessly to design an end-to-end solution that would make life a whole lot easier for agents and allow them to focus more on selling and crafting great experiences for their clients.</p>
              <p>TourWiz is the product of all that research and hard work.</p>
            </div>
          </div>
        </div>

        {!this.state.isLoginPopup && (
          <div className="model-popup">
            <div className="modal fade show d-block">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {!this.state.isShowForgotPassword
                        ? Trans("Sign-in")
                        : //? Trans("_titleAgentLogin")
                        Trans("_forgotPassword")}
                    </h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.handleLoginPopup()}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {!this.state.isShowForgotPassword ? (
                      <div className="p-2">
                        <div className="form-group d-none">
                          <label>{Trans("Your Name")}</label>
                          <input
                            className={
                              "form-control " +
                              (!this.state.isValidUsername
                                ? "border border-danger"
                                : "")
                            }
                            value={
                              this.state.agentname ? this.state.agentname : ""
                            }
                            name="agentname"
                            type="text"
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>

                        <div className="form-group">
                          <label>{Trans("_lblUserName")}</label>
                          <input
                            className={
                              "form-control " +
                              (!this.state.isValidUsername
                                ? "border border-danger"
                                : "")
                            }
                            value={
                              this.state.username ? this.state.username : ""
                            }
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
                              (!this.state.isValidPassword
                                ? "border border-danger"
                                : "")
                            }
                            value={
                              this.state.password ? this.state.password : ""
                            }
                            name="password"
                            type="password"
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {!(
                          this.state.isValidPassword &&
                          this.state.isValidUsername
                        ) ? (
                          <span className="text-center">
                            <small
                              className={
                                "alert text-center mt-0 p-1 d-inline-block " +
                                (this.state.showSuccessMsg
                                  ? "alert-success"
                                  : "alert-danger")
                              }
                            >
                              {this.state.errorMessage}
                            </small>
                          </span>
                        ) : null}
                        <div className="form-group">
                          <button
                            className="btn btn-primary w-100 mt-2"
                            type="submit"
                            onClick={this.authUser}
                          >
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
                                (this.state.showSuccessMsg
                                  ? "alert-success"
                                  : "alert-danger")
                              }
                            >
                              {this.state.errorMessage}
                            </small>
                          </span>
                        ) : null}
                        <div className="form-group mb-0">
                          <button
                            type="button"
                            className="btn btn-link text-primary w-100 text-right d-none"
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
                      <div className="p-2">
                        <div className="form-group">
                          <label>{Trans("_lblUserName")}</label>
                          <input
                            className={
                              "form-control " +
                              (!this.state.isValidUsername
                                ? "border border-danger"
                                : "")
                            }
                            value={
                              this.state.username ? this.state.username : ""
                            }
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
                              "form-control " +
                              (!this.state.isValidEmail
                                ? "border border-danger"
                                : "")
                            }
                            value={this.state.email ? this.state.email : ""}
                            name="email"
                            type="text"
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {!(
                          this.state.isValidEmail && this.state.isValidUsername
                        ) ? (
                          <span className="text-center">
                            <small
                              className={
                                "alert text-center mt-0 p-1 d-inline-block " +
                                (this.state.showSuccessMsg
                                  ? "alert-success"
                                  : "alert-danger")
                              }
                            >
                              {this.state.errorMessage}
                            </small>
                          </span>
                        ) : null}
                        <div className="form-group">
                          <button
                            className="btn btn-primary w-100 mt-2"
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
                                (this.state.showSuccessMsg
                                  ? "alert-success"
                                  : "alert-danger")
                              }
                            >
                              {this.state.errorMessage}
                            </small>
                          </span>
                        ) : null}
                        <div className="form-group mb-0">
                          <button
                            type="button"
                            className="btn btn-link w-100 text-right text-primary"
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
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default About;
