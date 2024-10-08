import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import Timer from "react-compound-timer";
import moment from "moment";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import Loader from "./loader";
import Config from "./../../config.json"
import { withRouter } from 'react-router-dom';
import QuotationMenu from "../quotation/quotation-menu";
import QuestionIcon from "../../assets/images/question.svg";
import QuestionMobIcon from "../../assets/images/question-square.svg";
import DashboardDrawer from "./dashboard-drawer";

class LoginMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserMenu: false,
      quotationMode: true,
      isshowauthorizepopup: false,
      ClockInDateTime: "",
      IsClockOut: false,
      isbtnLoading: false,
      isbtnLoadingLogout: false,
      screenWidth: window.innerWidth,
      isMobileMenu: false,
      drawerOpen: false,
    };
    this.handleResize = this.handleResize.bind(this);
    this.nodeUserMenu = React.createRef();
    this.nodeUserMenuLink = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userInfo.useralreadyClockindata
      && props.userInfo?.useralreadyClockindata[0]?.logInDateTime
      && state.ClockInDateTime === "" && !state.isbtnLoading)
      return {
        ClockInDateTime: props.userInfo?.useralreadyClockindata[0]?.logInDateTime,
      };
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  handleLogout = () => {
    this.setState({
      isbtnLoadingLogout: true
    }, () => this.props.handleLogOut());
  }
  handleUserMenu = (data) => {
    if (data !== undefined)
      this.setState({
        isUserMenu: false,
      });
    else {
      this.setState({
        isUserMenu: !this.state.isUserMenu,
      });
    }
  };

  handleClickOutside = (event) => {
    if (this.nodeUserMenu.current !== null && this.nodeUserMenu.current.contains(event.target)) {
      return true;
    } else if (
      this.nodeUserMenuLink.current !== null &&
      this.nodeUserMenuLink.current.contains(event.target)
    ) {
      this.handleUserMenu();
      return true;
    } else {
      this.handleUserMenu(false);
    }
    return true;
  };

  handleClockIn = () => {

    const portalType = Global.getEnvironmetKeyValue("portalType");
    const isB2C = portalType === "B2C";

    var username = isB2C === true && this.props.userInfo.firstName !== "" && this.props.userInfo.lastName !== ""
      ? this.props.userInfo.firstName + " " + this.props.userInfo.lastName
      : this.props.userInfo.provider ? this.props.userInfo.provider.name
        : this.props.userInfo.userDisplayName;
    this.setState({
      isbtnLoading: true
    });

    var reqURL =
      "user/clockin";
    var reqOBJ = {
      LoginName: username,
      clocktype: "clockin"
    };

    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response.length > 0) {
          //const style = 'background-color: darkblue; color: white; padding: 4px';
          //console.log("%cResponse", style, "ClockInDateTime", data.response);
          this.setState({
            ClockInDateTime: data.response,
            isbtnLoading: false
          });
        }
      },
    );
  }

  handleClockOut = () => {
    const portalType = Global.getEnvironmetKeyValue("portalType");
    const isB2C = portalType === "B2C";
    this.setState({
      isbtnLoading: true
    });
    var username = isB2C === true && this.props.userInfo.firstName !== "" && this.props.userInfo.lastName !== ""
      ? this.props.userInfo.firstName + " " + this.props.userInfo.lastName
      : this.props.userInfo.provider ? this.props.userInfo.provider.name
        : this.props.userInfo.userDisplayName;

    var reqURL =
      "user/clockout";
    var reqOBJ = {
      LoginName: username,
      clocktype: "clockout"
    };
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.response.length > 0) {
          this.setState({
            ClockInDateTime: "",
            IsClockOut: true,
            isbtnLoading: false
          });
        }
      },
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleResize() {
    this.setState({ screenWidth: window.innerWidth });
  }

  getAutoCancelBookingDetails = () => {
    let { userInfo } = this.props;

    if (
      userInfo.todaysBooking === 0 &&
      userInfo.pastBooking === 0 &&
      userInfo.upcommingBooking === 0
    ) {
      return Trans("_autoCancel_NoRecordMessage");
    } else {
      return (
        <Fragment>
          {userInfo.todaysBooking > 0 && (
            <span className="">
              {Trans("_autoCancel_TodaysDateBookingCountMsg").replace(
                "##TodaysDateBookingCount##",
                userInfo.todaysBooking
              )}
            </span>
          )}
          {userInfo.pastBooking > 0 && (
            <span className="ml-2 ">
              {Trans("_autoCancel_PastDateBookingCountMsg").replace(
                "##PastDateBookingCount##",
                userInfo.pastBooking
              )}
            </span>
          )}
          {userInfo.upcommingBooking > 0 && (
            <span className="ml-2 ">
              {Trans("_autoCancel_UpcomingDateBookingCountMsg").replace(
                "##UpcomingDateBookingCount##",
                userInfo.upcommingBooking
              )}
            </span>
          )}
          <span className="ml-2 ">{Trans("_autoCancel_TotalBookingCountForAdminMsg")}</span>
        </Fragment>
      );
    }
  };
  handleRedirect = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      //window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
    this.setState({ isMobileMenu: false });
  };

  handleMobileMenu = () => {
    this.setState({ isMobileMenu: !this.state.isMobileMenu });
  }
  handleDrawerClose = () => {
    const { drawerOpen } = this.state;
    this.setState({ drawerOpen: !drawerOpen });
  }
  render() {
    const { isLoginMenu, isLoggedIn, isLoginBox, userInfo } = this.props;
    const portalType = Global.getEnvironmetKeyValue("portalType");
    const isB2C = portalType === "B2C";
    const isB2B = portalType === "B2B";
    const isAdmin = portalType === "BOTH";
    const isOfflineBookingEnabled = Global.getEnvironmetKeyValue("isOfflineBookingEnabled");
    const isIssueDocumentEnabled = Global.getEnvironmetKeyValue("isIssueDocumentEnabled");
    const isFailTransactionEnabled = Global.getEnvironmetKeyValue("isFailTransactionEnabled");
    const isLedgerBalanceEnabled = Global.getEnvironmetKeyValue("isLedgerBalanceEnabled");

    const isShowEWalletStatement = Global.getEnvironmetKeyValue("isShowEWalletStatement");

    const isCustomerManagementEnabled = Global.getEnvironmetKeyValue("isCustomerManagementEnabled");

    let isShowClockIn = userInfo?.isShowClockIn;
    let isUserAlreadyClockIn = userInfo?.isUserAlreadyClockIn;
    if (this.state.ClockInDateTime && this.state.ClockInDateTime !== "") {
      isUserAlreadyClockIn = true;
      isShowClockIn = false;
    }
    else if (isShowClockIn)
      isShowClockIn = true;

    var IsClockedOutForDay = userInfo?.IsClockedOutForDay;
    if (this.state.IsClockOut) {
      isUserAlreadyClockIn = false;
      isShowClockIn = false;
      IsClockedOutForDay = true;
    }

    var loginDateTimeUTC = moment(this.state.ClockInDateTime);

    let gmtTimeDifference = (new Date()).getTimezoneOffset() * -1;

    var loginDateTime = loginDateTimeUTC.clone().add(gmtTimeDifference, 'minutes');
    let screenWidth = this.state.screenWidth;
    var diff = moment().local().diff(loginDateTime, 'seconds');
    const showMenuCss = `
    .mobileMenuDrawer{
      width:100%;
        position: absolute;
        transition: height 2s;
        z-index: 10;
        top: 72px;
        left: 0px;
    }
    `
    const hideMenuCss = `
    .mobileMenuDrawer{
      width:100%;
        position: absolute;
        transition: height 2s;
        z-index: 10;
        top: 72px;
        left: 0px;
        display:none;
    }
    `
    return (
      <React.Fragment>
        {isLoginMenu && localStorage.getItem("ssotoken") === null && (
          <div className='row'>
            <style>{this.state.isMobileMenu ? showMenuCss : hideMenuCss}</style>
            <div className='col-lg-12 d-flex flex-row justify-content-between  pt-2 w-100'>
              <div class="d-flex flex-row justify-content-between  w-100">
                {screenWidth >= 768 &&
                  <div className="d-flex justify-content-end">
                    <ul className="row list-unstyled p-0 m-0 navbar d-flex justify-content-end">

                      {this.props.userInfo.rolePermissions && (
                        <React.Fragment>
                          <AuthorizeComponent title="dashboard-menu~marketplacepackage-view-marketplacepackage" type="button" rolepermissions={this.props.userInfo.rolePermissions}>

                            {this.props.location.pathname.indexOf("/MarketplacePackages") === -1 && <li className="ml-3 d-flex align-items-center justify-content-center" id="marketplace">
                              <Link
                                to="/MarketplacePackages"
                                // target="_blank"
                                className="btn btn-sm btn-primary btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn1 d-flex align-items-center justify-content-center text-white"
                              >
                                {"Marketplace"}
                              </Link>
                            </li>}
                            {this.state.quotationMode && (isB2B || isAdmin) && (
                              <>
                                <li className="quick-btn ml-3 d-flex align-items-center justify-content-center" id="marketplace">
                                  <Link
                                    to="/QuickPackage/add"
                                    className="btn btn-sm btn-primary btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn1 d-flex align-items-center justify-content-center text-white "
                                  >
                                    TourWizAI Lite
                                  </Link>
                                </li>
                                <li className="ml-3" id="help">
                                  <button
                                    className="btn btn-muted  d-flex justify-content-center p-0 m-0"
                                    onClick={this.handleDrawerClose}
                                  >
                                    <img
                                      style={{ filter: "none", width: "28px", }}
                                      src={QuestionMobIcon}
                                      alt=""
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title="Help"
                                    />
                                  </button>
                                </li>
                              </>
                            )}
                          </AuthorizeComponent>
                          <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                            {this.state.quotationMode && (isB2B || isAdmin || true) && (
                              <li className="" id="dashboard">
                                <Link
                                  to="/"
                                  className="ml-3 btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn"
                                >
                                  <SVGIcon
                                    name="list-ul"
                                    className="mr-2 d-flex "
                                    width="20"
                                    height="20"
                                  ></SVGIcon>
                                  {Trans("_dashboard")}
                                </Link>
                              </li>
                            )}
                          </AuthorizeComponent>
                        </React.Fragment>
                      )}

                      <AuthorizeComponent title="dashboard-menu~report-clockin" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                        {this.state.ClockInDateTime !== "" && !this.state.IsClockOut &&
                          <li className="ml-3">
                            {/* https://volkov97.github.io/react-compound-timer/#!/Timer/17 */}
                            <Timer
                              // initialTime={60000 * diff} //OK
                              // initialTime={1000 * (diff < 0 ? diff * -1 : diff)}
                              initialTime={1000 * diff}
                              lastUnit="h"
                            >
                              {({ start, resume, pause, stop, reset, getTimerState, getTime }) => (
                                <React.Fragment>
                                  <div className="text-primary font-weight-bold">
                                    Clocked In : <Timer.Hours />h:<Timer.Minutes />m:<Timer.Seconds />s
                                  </div>

                                </React.Fragment>
                              )}
                            </Timer>
                          </li>
                        }
                        {isShowClockIn &&
                          <li className="ml-3">
                            <button
                              className="btn btn-sm m-0 btn-outline-primary d-flex"
                              onClick={() => this.handleClockIn()}
                            >
                              {this.state.isbtnLoading && (
                                <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                              )}
                              {!this.state.isbtnLoading &&
                                <SVGIcon
                                  name="timer"
                                  width="20"
                                  height="20"
                                  className="mr-2 d-flex"
                                ></SVGIcon>
                              }
                              {Trans("Clock In")}

                            </button>

                          </li>
                        }
                        {isUserAlreadyClockIn &&
                          <li className="ml-3">
                            <button
                              className="btn btn-sm m-0 btn-outline-primary d-flex"
                              onClick={this.handleClockOut}
                            >
                              {this.state.isbtnLoading && (
                                <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                              )}
                              {!this.state.isbtnLoading &&
                                <SVGIcon
                                  name="timer"
                                  className="mr-2 d-flex "
                                  width="20"
                                  height="20"
                                ></SVGIcon>
                              }
                              {Trans("Clock Out")}
                            </button>
                          </li>
                        }
                        {IsClockedOutForDay && IsClockedOutForDay === true &&
                          <li className="ml-3">
                            <React.Fragment>
                              <div className="text-primary font-weight-bold">
                                Clocked Out for Day
                              </div>
                            </React.Fragment>
                          </li>
                        }
                      </AuthorizeComponent>
                    </ul>
                  </div>
                }

                <div className="d-flex justify-content-end">
                  {isLoggedIn ? (
                    <ul className="row list-unstyled p-0 m-0 d-flex justify-content-end">
                      {screenWidth <= 768 &&
                        <>
                          <li className="ml-3 d-none" id="help">
                            <button
                              className="btn btn-muted  d-flex justify-content-center p-0 m-0"
                              onClick={this.handleDrawerClose}
                            >
                              <img
                                style={{ filter: "none", width: "28px", }}
                                src={QuestionMobIcon}
                                alt=""
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Help"
                              />
                            </button>
                          </li>
                          <li className="ml-3">
                            <button
                              className="btn btn-sm p-0 m-0 text-secondary text-capitalize"
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title="Menu"
                              onClick={this.handleMobileMenu}
                            >
                              <SVGIcon
                                name="list-ul"
                                className="mr-2 d-flex "
                                width="28"
                                height="28"
                              ></SVGIcon>
                            </button>
                          </li>
                        </>
                      }
                      <li className="ml-3">
                        {screenWidth <= 768 ?
                          <button
                            className="btn btn-circle p-0 m-0 text-secondary text-capitalize"
                            ref={this.nodeUserMenuLink}
                          >
                            <SVGIcon
                              name="user-circle"
                              className="align-text-top mr-2"
                              type="fill"
                              width="28"
                              height="28"
                            ></SVGIcon>
                          </button>
                          : <button
                            className="btn btn-link p-0 m-0 text-secondary text-capitalize"
                            ref={this.nodeUserMenuLink}
                          >
                            <SVGIcon
                              name="user-circle"
                              className="align-text-top mr-2"
                              type="fill"
                              width="20"
                              height="20"
                            ></SVGIcon>
                            {(isB2C === true && userInfo.firstName !== "" && userInfo.lastName !== "")
                              ? userInfo.firstName + " " + userInfo.lastName
                              : userInfo.provider ? userInfo.provider.name
                                : userInfo.userDisplayName}
                            {userInfo.loggedInUserDisplayName && portalType !== "B2C" &&
                              <React.Fragment> ({userInfo.loggedInUserDisplayName})</React.Fragment>
                            }
                          </button>
                        }
                        {this.state.isUserMenu && (
                          <ul
                            className="login-menu list-unstyled position-absolute p-3 m-0 border bg-white shadow"
                            ref={this.nodeUserMenu}
                            style={
                              isB2C
                                ? { minWidth: "200px" }
                                : {
                                  minWidth: "200px",
                                  maxWidth: "250px",
                                  right: "0px",
                                }
                            }
                          >
                            {isB2C && (
                              <li className="pb-2 mb-2 border-bottom">
                                <Link
                                  onClick={() => this.handleUserMenu()}
                                  to="/Profile"
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {Trans("_myProfile")}
                                </Link>
                              </li>
                            )}
                            {screenWidth <= 768 &&
                              <li className="pb-2 mb-2 border-bottom">
                                {(isB2C === true && userInfo.firstName !== "" && userInfo.lastName !== "")
                                  ? userInfo.firstName + " " + userInfo.lastName
                                  : userInfo.provider ? userInfo.provider.name
                                    : userInfo.userDisplayName}
                                {userInfo.loggedInUserDisplayName && portalType !== "B2C" &&
                                  <React.Fragment> ({userInfo.loggedInUserDisplayName})</React.Fragment>
                                }
                              </li>
                            }
                            {screenWidth <= 768 &&
                              <AuthorizeComponent title="dashboard-menu~report-clockin" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                {this.state.ClockInDateTime !== "" && !this.state.IsClockOut &&
                                  <li className="pb-2">
                                    {/* https://volkov97.github.io/react-compound-timer/#!/Timer/17 */}
                                    <Timer
                                      // initialTime={60000 * diff} //OK
                                      // initialTime={1000 * (diff < 0 ? diff * -1 : diff)}
                                      initialTime={1000 * diff}
                                      lastUnit="h"
                                    >
                                      {({ start, resume, pause, stop, reset, getTimerState, getTime }) => (
                                        <React.Fragment>
                                          <div className="text-primary font-weight-bold">
                                            Clocked In : <Timer.Hours />h:<Timer.Minutes />m:<Timer.Seconds />s
                                          </div>

                                        </React.Fragment>
                                      )}
                                    </Timer>
                                  </li>
                                }
                                {isShowClockIn &&
                                  <li className="pb-2">
                                    <button
                                      className="btn btn-sm m-0 btn-outline-primary d-flex"
                                      onClick={() => this.handleClockIn()}
                                    >
                                      {this.state.isbtnLoading && (
                                        <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                                      )}
                                      {!this.state.isbtnLoading &&
                                        <SVGIcon
                                          name="timer"
                                          width="20"
                                          height="20"
                                          className="mr-2 d-flex"
                                        ></SVGIcon>
                                      }
                                      {Trans("Clock In")}

                                    </button>

                                  </li>
                                }
                                {isUserAlreadyClockIn &&
                                  <li className="pb-2">
                                    <button
                                      className="btn btn-sm m-0 btn-outline-primary d-flex"
                                      onClick={this.handleClockOut}
                                    >
                                      {this.state.isbtnLoading && (
                                        <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                                      )}
                                      {!this.state.isbtnLoading &&
                                        <SVGIcon
                                          name="timer"
                                          className="mr-2 d-flex "
                                          width="20"
                                          height="20"
                                        ></SVGIcon>
                                      }
                                      {Trans("Clock Out")}
                                    </button>
                                  </li>
                                }
                                {IsClockedOutForDay && IsClockedOutForDay === true &&
                                  <li className="pb-2">
                                    <React.Fragment>
                                      <div className="text-primary font-weight-bold">
                                        Clocked Out for Day
                                      </div>
                                    </React.Fragment>
                                  </li>
                                }
                              </AuthorizeComponent>
                            }

                            <AuthorizeComponent title="dashboard-menu~dashboard" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              {this.state.quotationMode && (isB2B || isAdmin) && (
                                <li className="pb-2 mb-2 border-bottom">
                                  <Link
                                    onClick={() => this.handleUserMenu()}
                                    to="/"
                                    className="btn btn-link p-0 m-0 text-secondary"
                                  >
                                    {Trans("_dashboard")}
                                  </Link>
                                </li>
                              )}
                            </AuthorizeComponent>

                            {this.props.userInfo.rolePermissions && (
                              <AuthorizeComponent title="dashboard-menu~marketplacepackage-view-marketplacepackage" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                                {this.state.quotationMode && (isB2B || isAdmin) && screenWidth <= 768 && (
                                  <li className="pb-2 mb-2 border-bottom">
                                    <Link
                                      to="/MarketplacePackages"
                                      target="_blank"
                                      className="btn btn-link p-0 m-0 text-secondary"
                                    >
                                      {"Marketplace"}
                                    </Link>
                                  </li>
                                )}
                              </AuthorizeComponent>
                            )}
                            {this.state.quotationMode && (isB2B || isAdmin) && screenWidth <= 768 && (
                              <li className="pb-2 mb-2 border-bottom">
                                <Link
                                  to="/QuickPackage/add"
                                  target="_blank"
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  TourWizAI Lite
                                </Link>
                              </li>
                            )}
                            <AuthorizeComponent title="dashboard-menu~customer-bookings" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              <li className="pb-2 mb-2 border-bottom">
                                <Link
                                  onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~customer-bookings") ? this.handleUserMenu() : this.setState({ isshowauthorizepopup: true })}
                                  to="/Bookings"
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {Trans("_myBookings")}
                                </Link>
                              </li>
                            </AuthorizeComponent>
                            <AuthorizeComponent title="dashboard-menu~customer-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              {this.state.quotationMode && isCustomerManagementEnabled && (
                                <li className="pb-2 mb-2 border-bottom">
                                  <Link
                                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~customer-customers") ? this.handleUserMenu() : this.setState({ isshowauthorizepopup: true })}
                                    to="/Customer/list"
                                    className="btn btn-link p-0 m-0 text-secondary"
                                  >
                                    {Trans("_manageCustomers")}
                                  </Link>
                                </li>
                              )}
                            </AuthorizeComponent>
                            {(isB2B || isAdmin) && (
                              <React.Fragment>
                                {!this.state.quotationMode && !localStorage.getItem("isUmrahPortal") && isLedgerBalanceEnabled && (
                                  <li className="pb-2 mb-2 border-bottom">
                                    <Link
                                      onClick={() => this.handleUserMenu()}
                                      to="/Balance"
                                      className="btn btn-link p-0 m-0 text-secondary"
                                    >
                                      {Trans("_myBalance")}
                                    </Link>
                                  </li>
                                )}

                                {isShowEWalletStatement && (
                                  <li className="pb-2 mb-2 border-bottom">
                                    <Link
                                      onClick={() => this.handleUserMenu()}
                                      to="/EWalletStatement"
                                      className="btn btn-link p-0 m-0 text-secondary"
                                    >
                                      {Trans("_EWalletStatement")}
                                    </Link>
                                  </li>
                                )}

                                {/* {isFailTransactionEnabled && (
                            <AuthorizeComponent title="dashboard-menu~bookonline-failedbookings" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              <li className="pb-2 mb-2 border-bottom">
                                <Link
                                  onClick={() => this.handleUserMenu()}
                                  to="/FailedBookings"
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {Trans("_failedBookings")}
                                </Link>
                              </li>
                            </AuthorizeComponent>
                          )}
                          {isOfflineBookingEnabled && (
                            <AuthorizeComponent title="dashboard-menu~bookonline-offlinebookings" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              <li className="pb-2 mb-2 border-bottom">
                                <Link
                                  onClick={() => this.handleUserMenu()}
                                  to="/OfflineBookings"
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {Trans("_offlineBookings")}
                                </Link>
                              </li>
                            </AuthorizeComponent>
                          )} */}
                                {!this.state.quotationMode && isIssueDocumentEnabled && (
                                  <li className="pb-2 mb-2 border-bottom">
                                    <Link
                                      onClick={() => this.handleUserMenu()}
                                      to="/IssueDocuments"
                                      className="btn btn-link p-0 m-0 text-secondary"
                                    >
                                      {Trans("_issueDocuments")}
                                    </Link>
                                  </li>
                                )}
                                {!this.state.quotationMode && isCustomerManagementEnabled && (
                                  <li className="pb-2 mb-2 border-bottom">
                                    <Link
                                      onClick={() => this.handleUserMenu()}
                                      to="/Customer/list"
                                      className="btn btn-link p-0 m-0 text-secondary"
                                    >
                                      {Trans("_manageCustomers")}
                                    </Link>
                                  </li>
                                )}
                              </React.Fragment>
                            )}
                            <AuthorizeComponent title="Customer-list~customer-viewcotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions}>
                              {isB2C && (
                                <li className="pb-2 mb-2 border-bottom">
                                  <Link
                                    onClick={() => this.handleUserMenu()}
                                    to="/CoTraveller/list"
                                    className="btn btn-link p-0 m-0 text-secondary"
                                  >
                                    {Trans("_myCoTravelers")}
                                  </Link>
                                </li>
                              )}
                            </AuthorizeComponent>
                            {isB2C && (
                              <li>
                                <Link
                                  onClick={() => this.handleLogout()}
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {this.state.isbtnLoadingLogout && (
                                    <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                                  )}
                                  {Trans("_signOut")}
                                </Link>
                              </li>
                            )}
                            {isB2C === false && (
                              <li>
                                <Link
                                  onClick={() => this.handleLogout()}
                                  className="btn btn-link p-0 m-0 text-secondary"
                                >
                                  {this.state.isbtnLoadingLogout && (
                                    <span className="spinner-border spinner-border-sm mr-2 mt-1"></span>
                                  )}
                                  {Trans("_signOut")}
                                </Link>
                              </li>
                            )}
                          </ul>
                        )}
                      </li>
                      {userInfo.agentBalance !== undefined &&
                        userInfo.agentBalance !== "" &&
                        userInfo.agentBalance !== 0.0 &&
                        !localStorage.getItem("isUmrahPortal") && (
                          <li className="ml-3 d-none">
                            <b className="ml-3 pt-1 d-flex" title="Available balance">
                              <SVGIcon
                                name="money-bill-alt"
                                className="align-sub mr-3"
                                type="fill"
                                width="24"
                                height="34"
                              ></SVGIcon>
                              <Amount amount={userInfo.agentBalance} />
                            </b>
                          </li>
                        )}
                    </ul>
                  ) : (
                    isB2C && (
                      <ul className="row list-unstyled p-0 m-0">
                        {window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) === -1 &&
                          <React.Fragment>
                            <li className="ml-3">
                              <button
                                className="btn btn-link p-0 m-0 text-secondary"
                                onClick={() => this.props.handleLoginBox()}
                                ref={(node) => {
                                  this.node = node;
                                }}
                              >
                                <SVGIcon name="sign-in" className="mr-2" type="fill" width="16"></SVGIcon>
                                {Trans("_signIn")}
                              </button>
                              {isLoginBox && (
                                <Login
                                  onLoginSuccess={this.props.handleLoginBox}
                                  onRef={this.nodea}
                                  parentref={this.node}
                                />
                              )}
                            </li>
                            <li className="ml-3">
                              <Link to="/Signup" className="btn btn-link p-0 m-0 text-secondary">
                                <SVGIcon
                                  name="sign-up"
                                  className="mr-2 align-middle"
                                  type="fill"
                                  width="16"
                                ></SVGIcon>
                                {Trans("_signUp")}
                              </Link>
                            </li>
                          </React.Fragment>
                        }
                        {window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1 &&
                          <li className="ml-3">
                            <button
                              className="btn btn-link p-0 m-0 text-secondary"
                              onClick={() => this.props.history.push('/login')}
                            >
                              <SVGIcon name="sign-in" className="mr-2" type="fill" width="16"></SVGIcon>
                              {Trans("_signIn")}
                            </button>
                          </li>
                        }
                      </ul>
                    )
                  )}
                  {this.state.isshowauthorizepopup &&
                    <ModelPopupAuthorize
                      header={""}
                      content={""}
                      handleHide={this.hideauthorizepopup}
                      history={this.props.history}
                    />
                  }
                  {this.state.drawerOpen &&
                    <DashboardDrawer
                      handleClose={this.handleDrawerClose}
                      drawerOpen={this.state.drawerOpen}
                      {...this.props}
                    />
                  }
                </div>
              </div>
            </div>
            {screenWidth <= 768 && <div className="col-lg-12 mobileMenuDrawer p-0">
              <QuotationMenu handleMenuClick={this.handleRedirect} userInfo={this.props.userInfo} {...this.props} />
            </div>
            }
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(LoginMenu);
