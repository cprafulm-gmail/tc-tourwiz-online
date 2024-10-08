import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import Amount from "../../helpers/amount";
import * as Global from "../../helpers/global";

class LoginMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserMenu: false,
      quotationMode: true,
    };
    this.nodeUserMenu = React.createRef();
    this.nodeUserMenuLink = React.createRef();
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

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
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

    return (
      <React.Fragment>
        {/* {isLoggedIn && isOfflineBookingEnabled && (
          <div
            className="mr-1 mb-1 shadow-center btn btn-secondary"
            style={{
              position: "fixed",
              left: "20px",
              bottom: "15px",
              zIndex: "1000",
              width: "300px",
            }}
          >
            <marquee>
              <div className="">{this.getAutoCancelBookingDetails()}</div>
            </marquee>
          </div>
        )} */}

        {isLoginMenu && localStorage.getItem("ssotoken") === null && (
          <div className="navbar pull-right p-0 pr-3">
            {this.state.quotationMode && (isB2B || isAdmin) && isLoggedIn && (
              <Link
                className="btn btn-link p-0 m-0 mr-3 text-secondary d-none"
                to="/about-us"
                rel="noopener noreferrer"
              >
                About Us
              </Link>
            )}

            {isLoggedIn ? (
              <ul className="row list-unstyled p-0 m-0">
                {this.state.quotationMode && (isB2B || isAdmin) && (
                  <li className="ml-3">
                    <Link
                      to="/"
                      className="btn btn-sm m-0 btn-outline-primary d-flex dashboard-btn"
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

                <li className="ml-3">
                  <button
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
                    {isB2C === true && userInfo.firstName !== "" && userInfo.lastName !== ""
                      ? userInfo.firstName + " " + userInfo.lastName
                      : userInfo.provider ? userInfo.provider.name
                        : userInfo.userDisplayName}
                  </button>
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
                      <li className="pb-2 mb-2 border-bottom">
                        <Link
                          onClick={() => this.handleUserMenu()}
                          to="/"
                          className="btn btn-link p-0 m-0 text-secondary"
                        >
                          {Trans("_dashboard")}
                        </Link>
                      </li>

                      {isB2C && (
                        <li>
                          <Link
                            onClick={() => this.props.handleLogOut()}
                            className="btn btn-link p-0 m-0 text-secondary"
                          >
                            {Trans("_signOut")}
                          </Link>
                        </li>
                      )}
                      {isB2C === false && (
                        <li>
                          <Link
                            onClick={() => this.props.handleLogOut()}
                            className="btn btn-link p-0 m-0 text-secondary"
                          >
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
                </ul>
              )
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default LoginMenu;
