import React, { Component } from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import TableLoading from "../../components/loading/table-loading"
import ComingSoon from "../../helpers/coming-soon";
import * as Global from "../../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import Config from "../../config.json";


class CoTravelerList extends Component {
  state = {
    comingsoon: false,
    isshowauthorizepopup: false,
    customerType: "",
    isHideCorporateFilter: Config.codebaseType === "tourwiz" ? true : false,
  };

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  editCotraveler = (traveler) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~customer-edit-customers")) {
      this.props.onEdit(this.props.isCustomerPage
        ? traveler.entityID
        : traveler.customerID, traveler.customerType)
    }
    else {
      this.setState({ isshowauthorizepopup: true })
    }
  }
  viewcotraveler = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };
  changeCustomerType = (Type) => {
    this.setState({ customerType: Type });
    this.props.handleFilter('customerType', Type);
  };
  render() {
    const { items, getCoTravelers, totalResults, isLoading, isLoadingViewCotraveler, ViewCotravelerId } = this.props;
    const { customerType, isHideCorporateFilter } = this.state;
    const table_column_width = {
      "_viewName": 270,
      "_viewGender": 100,
      "_viewBirthday": 150,
      "Email": 300,
      "Phone": 150,
      "action1": 50,
      "action2": 150,
      "action3": !this.props.isCustomerPage ? 150 : 0
    }

    return (
      <React.Fragment>
        <div class="mb-3 col-12 pl-0 pr-0">
          <div class="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
            <h5 class="text-primary border-bottom pb-2 mb-2">Filters</h5>
            <div class="row">
              {isHideCorporateFilter &&
                <div class="col-lg-3">
                  <div className="BE-Search-Radio pt-1">
                    <label className="d-block">Customer Type</label>
                    <ul className="">
                      <li className="checked">
                        <input
                          value=""
                          name="Direction"
                          type="radio"
                          checked={this.state.customerType === "" ? true : false}
                          // checked={this.state.customerType === "Corporate" ? true : false}
                          onChange={() => this.changeCustomerType("")}
                        />
                        <label>All</label>
                      </li>
                      <li>
                        <input
                          checked={this.state.customerType === "Individual" ? true : false}
                          value="Individual"
                          name="Direction"
                          type="radio"
                          onChange={() => this.changeCustomerType("Individual")}
                        />
                        <label>Individual</label>
                      </li>
                      <li>
                        <input
                          value="Corporate"
                          name="Direction"
                          type="radio"
                          checked={this.state.customerType === "Corporate" ? true : false}
                          onChange={() => this.changeCustomerType("Corporate")}
                        />
                        <label>Corporate</label>
                      </li>
                    </ul>
                  </div>
                  {/* <div class="form-group inquirytype">
                  <label htmlFor="customerType">Customer Type</label>
                  <input type="text" name="customerType" onChange={(e) => this.props.handleFilter('customerType', e.target.value)} class="form-control" />
                </div> */}
                </div>}
              {customerType === 'Corporate' ? <div class="col-lg-3">
                <div class="form-group inquirytype">
                  <label htmlFor="name">Corporate Name</label>
                  <input type="text" name="name" onChange={(e) => this.props.handleFilter('name', e.target.value)} class="form-control" />
                </div>
              </div> : <div class="col-lg-3">
                <div class="form-group inquirytype">
                  <label htmlFor="name">Customer Name</label>
                  <input type="text" name="name" onChange={(e) => this.props.handleFilter('name', e.target.value)} class="form-control" />
                </div>
              </div>
              }
              {this.state.comingsoon && (
                <ComingSoon handleComingSoon={this.handleComingSoon} />
              )}
              {customerType === 'Corporate' ? <div class="col-lg-3">
                <div class="form-group inquirytype">
                  <label htmlFor="phone">Corporate Phone Number</label>
                  <input type="text" name="phone" onChange={(e) => this.props.handleFilter('phone', e.target.value)} class="form-control" />
                </div>
              </div> : <div class="col-lg-3">
                <div class="form-group inquirytype">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="text" name="phone" onChange={(e) => this.props.handleFilter('phone', e.target.value)} class="form-control" />
                </div>
              </div>
              }
              {customerType === 'Corporate' ? <div class="col-lg-3">
                <div class="form-group inquirytype">
                  <label htmlFor="email">Corporate Email</label>
                  <input type="text" name="email" onChange={(e) => this.props.handleFilter('email', e.target.value)} class="form-control" />
                </div>
              </div> :
                <div class="col-lg-3">
                  <div class="form-group inquirytype">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" onChange={(e) => this.props.handleFilter('email', e.target.value)} class="form-control" />
                  </div>
                </div>}
              <div class="col-lg-3">
                <div class="form-group">
                  <label class="d-block">&nbsp;</label>
                  <button name="Apply" onClick={() => getCoTravelers('filter')} class="btn btn-primary">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {((items === "undefined" || items === null || items.length === 0) && !isLoading) ?
          <div className="col-6">
            <ul className="list-unstyled p-4 ">
              <div className="w-100">
                {this.props.isCustomerPage
                  ? Trans("_viewNoCustomerFound")
                  : Trans("_viewNoCoTravellerFound")}
              </div>
            </ul>
          </div>
          :
          <React.Fragment>
            <div class="table-responsive">
              <table class="table border table-column-width">
                <thead class="thead-light">
                  <tr>
                    <th width={table_column_width['_viewName']}>{Trans("_viewName")}</th>
                    <th width={table_column_width['_viewGender']}>{Trans("_viewGender")}</th>
                    <th width={table_column_width['_viewBirthday']}>{Trans("_viewBirthday")}</th>
                    <th width={table_column_width['Email']}>Email</th>
                    <th width={table_column_width['Phone']}>Phone</th>
                    <th width={table_column_width['action1']}>&nbsp;</th>
                    {!this.state.isCustomerPage &&
                      Global.getEnvironmetKeyValue("portalType") !== "B2C" &&
                      Global.getEnvironmetKeyValue("EnableCoTravelerForB2BPortal", "cobrand") !== null &&
                      <th width={table_column_width['action2']}>&nbsp;</th>}

                    <AuthorizeComponent title="Customer-list~customer-delete-customers" type="button"
                      rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                      {(!this.props.isCustomerPage || this.props.isCustomerPage) &&
                        <th width={table_column_width['action3']}></th>}
                    </AuthorizeComponent>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (<TableLoading columns={8} />)}
                  {!isLoading && items.map((traveler, index) => {
                    return <tr>
                      <td style={{ "word-break": "break-word", cursor: "pointer" }} onClick={() => this.editCotraveler(traveler)} >
                        {traveler.userDisplayName !== undefined && traveler.userDisplayName !== ""
                          ? traveler.userDisplayName
                          : traveler.firstName + " " + traveler.lastName}
                      </td>
                      <td onClick={() => this.editCotraveler(traveler)} style={{ cursor: "pointer" }}>
                        {traveler.genderDesc}
                      </td>
                      <td onClick={() => this.editCotraveler(traveler)} style={{ cursor: "pointer" }}>
                        {traveler.birthDate === "0001-01-01T00:00:00" ? ("---") : (<Date date={traveler.birthDate} />)}
                      </td>
                      <td style={{ "word-break": "break-word", cursor: "pointer" }} onClick={() => this.editCotraveler(traveler)}>
                        {!traveler.contactInformation.email ? "----" : traveler.contactInformation.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? "---" : traveler.contactInformation.email}
                      </td>
                      <td onClick={() => this.editCotraveler(traveler)} style={{ cursor: "pointer" }}>
                        {traveler.contactInformation.phoneNumberCountryCode}-{traveler.contactInformation.phoneNumber}
                      </td>
                      <td>
                        <AuthorizeComponent title="Customer-list~customer-edit-customers" type="button"
                          rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                          {traveler.contactInformation.email !== 'democustomer@tourwiz.com' &&
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => this.editCotraveler(traveler)}
                            >
                              {traveler.customerType === 'corporate' ? Trans("_viewBtnEdit") : Trans("_viewBtnEdit")}
                            </button>
                          }
                        </AuthorizeComponent>
                      </td>
                      {
                        (!this.state.isCustomerPage &&
                          Global.getEnvironmetKeyValue("portalType") !== "B2C" &&
                          Global.getEnvironmetKeyValue("EnableCoTravelerForB2BPortal", "cobrand") !== null) &&
                        <td>
                          {traveler.contactInformation.email !== 'democustomer@tourwiz.com' &&
                            isLoadingViewCotraveler &&
                            <button
                              className="btn btn-primary btn-sm"
                            >
                              {ViewCotravelerId === traveler.customerID &&
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              }
                              {traveler.customerType === 'corporate' ? "View Employee" : "View Co-traveller"}
                            </button>
                          }
                          {traveler.contactInformation.email !== 'democustomer@tourwiz.com' &&
                            !isLoadingViewCotraveler &&
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => this.props.viewcotraveler(traveler.contactInformation.email ? traveler.contactInformation.email : (traveler.contactInformation.phoneNumberCountryCode + "-" + traveler.contactInformation.phoneNumber), traveler.customerID, traveler.customerType)}
                            >
                              {traveler.customerType === 'corporate' ? "View Employee" : "View Co-traveller"}
                            </button>
                          }

                        </td>
                      }
                      <td>
                        <AuthorizeComponent title="Customer-list~customer-delete-customers" type="button"
                          rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                          {(!this.props.isCustomerPage
                            || (this.props.isCustomerPage
                              && traveler.contactInformation.email !== 'democustomer@tourwiz.com')) &&

                            <span>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => this.props.onDelete(traveler)}
                              >
                                {this.props?.isDeleteCustomer && this.props?.isDeleteCustomerID === traveler.customerID &&
                                  <span className="spinner-border spinner-border-sm mr-2 "></span>
                                }
                                {Trans("_viewBtnDelete")}
                              </button>
                            </span>

                          }
                        </AuthorizeComponent>
                      </td>
                    </tr>
                  })
                  }
                </tbody>
              </table>
            </div>
            {
              items.length < totalResults &&
              <nav className="col-12">
                <ul class="pagination justify-content-center mt-3">
                  <li class="page-item">
                    <button onClick={() => getCoTravelers('paging')} class="page-link">Show More</button>
                  </li>
                </ul>
              </nav>
            }
            {
              this.state.isshowauthorizepopup &&
              <ModelPopupAuthorize
                header={""}
                content={""}
                handleHide={this.hideauthorizepopup}
                history={this.props.history}
              />
            }
          </React.Fragment>
        }
      </React.Fragment >
    )

  }
}

export default CoTravelerList;
