import React, { Component } from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";

class CoTravelerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isshowauthorizepopup: false,
    };
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  render() {
    const { items } = this.props;

    if (items === "undefined" || items === null || items.length === 0) {
      return (
        <div className="col-6">
          <ul className="list-unstyled p-4 ">
            <div className="w-100">
              {this.props.isCustomerPage
                ? Trans("_viewNoCustomerFound")
                : Trans("_viewNoCoTravellerFound")}
            </div>
          </ul>
        </div>
      );
    }

    return items.map((traveler, index) => {
      if (this.props.customerType.includes("corporate")) {
        return (
          Number(traveler.customerID) !== Number(this.props.parentId.replace("corporate-", "")) &&
          <div className="col-lg-4" key={index}>
            <ul className="list-unstyled p-4 ">
              <li>
                <div className="w-100">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div>
                        <label>{Trans("_viewName") + " : "}</label>{" "}
                        <label>
                          {traveler.userDisplayName !== undefined &&
                            traveler.userDisplayName !== ""
                            ? traveler.userDisplayName
                            : traveler.firstName + " " + traveler.lastName}
                        </label>
                      </div>
                      <div>
                        <label>{Trans("_viewGender") + " : "}</label>{" "}
                        <label>{traveler.genderDesc}</label>
                      </div>
                      <div>
                        <label>{Trans("_viewBirthday") + " : "}</label>{" "}
                        <label>
                          {traveler.birthDate === "0001-01-01T00:00:00" ? (
                            "---"
                          ) : (
                            <Date date={traveler.birthDate} />
                          )}
                        </label>
                      </div>
                      <div className="mt-2 float-right">
                        <span>
                          <AuthorizeComponent title="CoTraveller-list~Customer-editcotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-editcotraveller-customers") ?
                                this.props.onEdit(
                                  this.props.isCustomerPage
                                    ? traveler.entityID
                                    : traveler.customerID
                                )
                                : this.setState({ isshowauthorizepopup: true })
                              }
                            >
                              {Trans("_viewBtnEdit")}
                            </button>
                          </AuthorizeComponent>
                        </span>
                        <span> </span>
                        {!this.props.isCustomerPage && (
                          <span>
                            <AuthorizeComponent title="CoTraveller-list~Customer-deletecotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-editcotraveller-customers") ? this.props.onDelete(traveler) : this.setState({ isshowauthorizepopup: true })}
                              >
                                {Trans("_viewBtnDelete")}
                              </button>
                            </AuthorizeComponent>
                          </span>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            {this.state.isshowauthorizepopup &&
              <ModelPopupAuthorize
                header={""}
                content={""}
                handleHide={this.hideauthorizepopup}
                history={this.props.history}
              />
            }
          </div>
        );
      }
      else {
        return (
          <div className="col-lg-4" key={index}>
            <ul className="list-unstyled p-4 ">
              <li>
                <div className="w-100">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div>
                        <label>{Trans("_viewName") + " : "}</label>{" "}
                        <label>
                          {traveler.userDisplayName !== undefined &&
                            traveler.userDisplayName !== ""
                            ? traveler.userDisplayName
                            : traveler.firstName + " " + traveler.lastName}
                        </label>
                      </div>
                      <div>
                        <label>{Trans("_viewGender") + " : "}</label>{" "}
                        <label>{traveler.genderDesc}</label>
                      </div>
                      <div>
                        <label>{Trans("_viewBirthday") + " : "}</label>{" "}
                        <label>
                          {traveler.birthDate === "0001-01-01T00:00:00" ? (
                            "---"
                          ) : (
                            <Date date={traveler.birthDate} />
                          )}
                        </label>
                      </div>
                      <div className="mt-2 float-right">
                        <span>
                          <AuthorizeComponent title="CoTraveller-list~Customer-editcotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-editcotraveller-customers") ?
                                this.props.onEdit(
                                  this.props.isCustomerPage
                                    ? traveler.entityID
                                    : traveler.customerID
                                )
                                : this.setState({ isshowauthorizepopup: true })
                              }
                            >
                              {Trans("_viewBtnEdit")}
                            </button>
                          </AuthorizeComponent>
                        </span>
                        <span> </span>
                        {!this.props.isCustomerPage && (
                          <span>
                            <AuthorizeComponent title="CoTraveller-list~Customer-deletecotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-editcotraveller-customers") ? this.props.onDelete(traveler) : this.setState({ isshowauthorizepopup: true })}
                              >
                                {Trans("_viewBtnDelete")}
                              </button>
                            </AuthorizeComponent>
                          </span>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            {this.state.isshowauthorizepopup &&
              <ModelPopupAuthorize
                header={""}
                content={""}
                handleHide={this.hideauthorizepopup}
                history={this.props.history}
              />
            }
          </div>
        );
      }
    });
  }
}

export default CoTravelerList;
