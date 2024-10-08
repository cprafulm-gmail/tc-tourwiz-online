import React, { Component } from "react";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import SVGIcon from "../../helpers/svg-icon";
import Customerselection from "../../components/reports/customer-selection";
import * as DropdownList from "../../helpers/dropdown-list";
import Loader from "../../components/common/loader";

class QuotationCreateCopy extends Form {
  state = {
    data: {
      customerName: "",
      email: "",
      phone: "",
      title: "",
      duration: "",
      startDate: "",
      endDate: "",
      dates: "",
      datesIsValid: "valid",
      cutOfDays: 1,
      stayInDays: 4,
      createdDate: "",
      status: "",
      phoneNotoValidate: "",
      fromCopy: true,
      imageURL: "",
      imageExtension: "",
      ImageName: "",
      configurations: Global.itineraryConfigurations
    },
    addcustomer: false,
    selectcustomer: true,
    customeraction: "selectcustomer",
    isCustomerSet: false,
    customerData: {},
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;
    if (!this.validateFormData(data.customerName, "require"))
      errors.customerName = "Customer Name required";

    if (data.email && !this.validateFormData(data.email, "email")) errors.email = "Invalid Email";

    if (!this.validateFormData(data.phone, "require") || data.phone === "+91-") errors.phone = "Phone required";

    if (data.phone === "" || !this.validateFormData(data.phone, "require") || data.phone === "1-" || data.phone.split('-')[1] === "") errors.phone = "Phone required";

    if (data.phone && data.phone !== "")
      if (!this.validateFormData(data.phone, "phonenumber")) errors.phone = "Invalid Contact Phone";

    if (data.phone !== "" &&
      !this.validateFormData(data.phone, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.phone = Trans("_error_mobilenumber_phonenumber_length");

    if (!this.validateFormData(data.title, "require"))
      errors.title = this.props.type === "Quotation"
        ? Trans("_quotationReplaceKey") + " title required"
        : this.props.type === "Quotation_Master"
          ? Trans("_quotationReplaceKey") + " Master title required"
          : this.props.type === "Itinerary_Master"
            ? "Itinerary Master title required"
            : this.props.type + " title required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleCreate = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    let data = { ...this.state.data }
    data.adult = this.props.adult;
    data.children = this.props.children;
    data.infant = this.props.infant;
    data.budget = this.props.budget;
    data.priority = this.props.priority;
    data.followupDate = this.props?.followupDate;
    data.startDate = this.props.startDate;
    data.endDate = this.props.endDate;
    data.status = this.props.status;
    data.tripType = this.props.tripType;
    data.createdDate = moment().format('YYYY-MM-DD');
    data.userId = this.props.userId;
    data.duration = this.props.duration;
    data.imageURL = this.props.imageURL;
    data.configurations = this.props?.configurations;
    data.termsconditions = this.props?.termsconditions;
    data.isQuickProposal = this.props?.isQuickProposal;
    // data.documentPath = this.props?.documentPath;
    // data.quickproposalcomments = this.props?.quickproposalcomments;
    if (this.props.type === "Package" || this.props.type === "Master Package" || this.props.type === "Marketplace Package") {
      let propsdata = { ...this.props.data };
      propsdata.packageName = data.title;
      propsdata.twCustomerName = data.customerName;
      propsdata.twCustomerEmail = data.email;
      propsdata.twCustomerPhone = data.phone;
      propsdata.twUserId = this.state.customerData.userID;
      propsdata.CustomerName = data.customerName;
      propsdata.CustomerEmail = data.email;
      propsdata.CustomerPhone = data.phone;
      propsdata.twUserId = this.state.customerData.userID;
      propsdata["UserId"] = this.state.customerData.userID;
      this.props.handleCreate(propsdata);
    }
    else
      this.props.handleCreate(data);
  };

  setData = () => {
    let defautData = { ...this.state.data };

    let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    let quotationDetails = JSON.parse(localStorage.getItem("quotationDetails"));

    defautData.title = this.props.title ? "Copy Of " + this.props.title : "";
    if (this.props.type === "Package" || this.props.type === "Master Package" || this.props.type === "Marketplace Package")
      defautData.title = this.props.data.packageName ? this.props.type === "Master Package" ? this.props.data.packageName : "Copy Of " + this.props.data.packageName : "";
    else if (this.props.type === "Quotation_Master" || this.props.type === "Itinerary_Master") {
      defautData.title = this.props.title;
    }
    else {
      defautData.title = this.props.title ? "Copy Of " + this.props.title : "";
    }

    defautData.customerName = this.props.mode === "Edit" ? this.props.customerName :
      bookingForInfo && bookingForInfo.displayName
        ? bookingForInfo.displayName
        : this.props.customerName || "";

    // defautData.email = this.props.mode === "Edit" ? this.props.email :
    //   bookingForInfo && bookingForInfo.contactInformation
    //     ? bookingForInfo.contactInformation.email
    //     : this.props.email || "";

    defautData.phone = "";

    defautData.phoneNotoValidate = defautData.phone;

    defautData.startDate = this.props.mode === "Edit" ? this.props.startDate :
      bookingForInfo && bookingForInfo.startDate
        ? bookingForInfo.startDate
        : this.props.startDate || new Date();

    defautData.endDate = this.props.mode === "Edit" ? this.props.endDate :
      bookingForInfo && bookingForInfo.endDate
        ? bookingForInfo.endDate
        : this.props.endDate || new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000);

    defautData.duration = this.GetDuration(defautData.startDate, defautData.endDate);

    defautData.createdDate = this.props.mode === "Edit" ? this.props.createdDate :
      bookingForInfo && bookingForInfo.createdDate
        ? bookingForInfo.createdDate
        : this.props.createdDate || new Date();

    defautData.configurations = this.props.mode === "Edit" ? quotationDetails?.configurations : this.state.data.configurations;

    if (defautData.createdDate === "0001-01-01T00:00:00")
      defautData.createdDate = new Date();
    defautData.status = this.props.status ? this.props.status : "";
    defautData.userId = this.props.userId ?? 0;
    let customerData = {}
    if (sessionStorage.getItem("customer-info")
      && JSON.parse(sessionStorage.getItem("customer-info"))
      && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1) {
      customerData = JSON.parse(sessionStorage.getItem("customer-info"));
      defautData.email = customerData.contactInformation.email;
      defautData.phone = customerData.contactInformation.phoneNumber;
      defautData.customerName = customerData.displayName;
    }
    if (this.props.type === "Marketplace Package") {
      defautData.customerName = "Demo Customer";
      defautData.email = "democustomer@tourwiz.com";
      defautData.phone = "+91-1234567890";
    }
    if (!defautData.phone) {
      let countrName = Global.getEnvironmetKeyValue("PortalCountryName");
      let countryFlagCode = "";
      const foundCountry = DropdownList.CountryList.find(
        element => element.name === countrName.toString()
      );
      //If get countryCode then only update state
      if (foundCountry && foundCountry !== "undefined") {
        countryFlagCode = "+" + foundCountry.countryCode.toString() + "-";
      }
      defautData.phone = countryFlagCode
    }
    this.setState({
      errors: {},
      data: defautData,
      customerData,
      isCustomerSet: (this.props.type === "Marketplace Package" || (sessionStorage.getItem("customer-info")
        && JSON.parse(sessionStorage.getItem("customer-info"))
        && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1))
    });
  };

  setDate = (startDate, endDate) => {
    let newData = { ...this.state.data };
    newData.dates = { checkInDate: startDate, checkOutDate: endDate };
    newData.datesIsValid = "valid";
    newData.startDate = startDate;
    newData.endDate = endDate;
    newData.duration = this.GetDuration(startDate, endDate);
    this.setState({ data: newData });
  };

  GetDuration = (startDate, endDate) => {
    var tmpStartDate = moment([
      moment(startDate)._d.getFullYear(),
      moment(startDate)._d.getMonth(),
      moment(startDate)._d.getDate(),
    ]);
    var tmpEndDate = moment([
      moment(endDate)._d.getFullYear(),
      moment(endDate)._d.getMonth(),
      moment(endDate)._d.getDate(),
    ]);
    var totaldaysduration = tmpEndDate.diff(tmpStartDate, "days") + 1;
    return totaldaysduration;
  };

  componentDidMount() {
    this.setData();
  }

  handlecustomercheckbox = (e) => {
    let target = e.target;
    let countrName = Global.getEnvironmetKeyValue("PortalCountryName");
    let countryFlagCode = "";
    const foundCountry = DropdownList.CountryList.find(
      element => element.name === countrName.toString()
    );
    //If get countryCode then only update state
    if (foundCountry && foundCountry !== "undefined") {
      countryFlagCode = "+" + foundCountry.countryCode.toString() + "-";
    }
    if (target.name === "selectcustomer") {
      if (target.checked === true) {
        let statedata = this.state.data;
        // statedata.customerName = this.props.customerName;
        statedata.customerName = "";
        statedata.email = "";
        statedata.phone = countryFlagCode;
        this.setState({
          customerData: sessionStorage.getItem("customer-info")
            && JSON.parse(sessionStorage.getItem("customer-info"))
            && Object.keys(JSON.parse(sessionStorage.getItem("customer-info"))).length > 1 ? JSON.parse(sessionStorage.getItem("customer-info")) : {},
          data: statedata,
          selectcustomer: true,
          addcustomer: false,
          customeraction: "selectcustomer",
          isCustomerSet: false
        });
      } else {
        let statedata = this.state.data;
        statedata.customerName = "";
        statedata.email = "";
        statedata.phone = countryFlagCode;
        this.setState({
          data: statedata,
          selectcustomer: false,
          addcustomer: true,
          customeraction: "addcustomer",
        });
        sessionStorage.removeItem("reportCustomer");
      }
    }
  };
  resetCustomer = () => {
    let countrName = Global.getEnvironmetKeyValue("PortalCountryName");
    let countryFlagCode = "";
    const foundCountry = DropdownList.CountryList.find(
      element => element.name === countrName.toString()
    );
    //If get countryCode then only update state
    if (foundCountry && foundCountry !== "undefined") {
      countryFlagCode = "+" + foundCountry.countryCode.toString() + "-";
    }
    this.setState({
      isCustomerSet: false,
      customerData: {},
      data: { ...this.state.data, customerName: "", email: "", phone: countryFlagCode }
    });
  }
  selectCustomer = (data) => {
    let statedata = this.state.data;
    statedata.customerName = this.props.type === "Marketplace Package" ? "Demo Customer" : data.displayName;
    statedata.email = this.props.type === "Marketplace Package" ? "democustomer@tourwiz.com" : data.contactInformation.email;
    statedata.phone = this.props.type === "Marketplace Package" ? "+91-1234567890" : data.contactInformation.phoneNumber;
    if (this.props.type === "Package" || this.props.type === "Marketplace Package") {
      statedata.title = this.props.data.packageName ? "Copy Of " + this.props.data.packageName : "";
    }
    else if (this.props.type === "Master Package") {
      statedata.title = this.props.data.packageName ? "" + this.props.data.packageName : "";
    }
    else if (this.props.type === "Quotation_Master" || this.props.type === "Itinerary_Master") {
      statedata.title = this.props.title;
    }
    else {
      statedata.title = this.props.title ? "Copy Of " + this.props.title : "";
    }

    this.setState({ isCustomerSet: false }, () => {
      this.setState({ customerData: data, isCustomerSet: true, data: statedata }, () => {
      });
    });
  }

  render() {
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    const { type } = this.props;
    let emailId = "";//this.props.email;
    let agentID = this.props.userInfo.agentID;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block" tabIndex='-1'>
          <div
            className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {(type === "Master Package" ? "Use " : "Copy ") + (this.props.type === "Quotation"
                    ? Trans("_quotationReplaceKey")
                    : (this.props.type === "Quotation_Master"
                      ? Trans("_quotationReplaceKey") + " Master"
                      : this.props.type === "Itinerary_Master"
                        ? "Itinerary Master"
                        : this.props.type))}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleHide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="quotation-create border p-3 mt-3 bg-white shadow-sm mb-3 position-relative">
                  <div className="row">
                    {(type === "Quotation" || type === "Quotation_Master") && (
                      <React.Fragment>
                        <div className="col-lg-12 mb-4">
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="selectcustomer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.selectcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Select Customer
                            </label>
                          </div>
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="customer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.addcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Add Customer
                            </label>
                          </div>
                        </div>
                        {this.state.customeraction === "addcustomer" &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative">
                              {this.renderInput("customerName", "Customer * (e.g. Firstname Lastname)")}{" "}
                            </div>

                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"))}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        {this.state.customeraction !== "addcustomer" && this.state.data.title &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative mb-3">
                              <Customerselection
                                email={emailId}
                                agentID={agentID}
                                selectCustomer={this.selectCustomer.bind(this)}
                                resetCustomer={this.resetCustomer.bind(this)}
                                customerData={this.state.customerData}
                                isCustomerSet={this.state.isCustomerSet}
                                ishidelabel={true}
                              />
                            </div>
                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"))}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        <div className="col-lg-6">
                          {this.renderInput("title", Trans("_quotationTitleWithStar").replace("##Quotation##", Trans("_quotationReplaceKey")))}
                        </div>

                        {((this.state.customeraction !== "addcustomer" && this.state.isCustomerSet) || this.state.customeraction == "addcustomer") &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-primary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {type === "Quotation" ? Trans("_quotationReplaceKey")
                                    : type === "Quotation_Master" ? Trans("_quotationReplaceKey") + " Master"
                                      : type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button onClick={this.handleCreate} className="btn btn-primary w-100">
                                  Copy {type === "Quotation" ? Trans("_quotationReplaceKey")
                                    : type === "Quotation_Master" ? Trans("_quotationReplaceKey") + " Master"
                                      : type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {((this.state.customeraction !== "addcustomer" && !this.state.isCustomerSet)) &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {type === "Quotation" ? Trans("_quotationReplaceKey")
                                    : type === "Quotation_Master" ? Trans("_quotationReplaceKey") + " Master"
                                      : type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  Copy {type === "Quotation" ? Trans("_quotationReplaceKey")
                                    : type === "Quotation_Master" ? Trans("_quotationReplaceKey") + " Master"
                                      : type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {this.props.isErrorMsg && (
                          <div className="col-lg-12">
                            <h6 className="alert alert-danger mt-3 d-inline-block">
                              {this.props.isErrorMsg}
                            </h6>
                          </div>
                        )}
                      </React.Fragment>
                    )}

                    {(type === "Itinerary" || type === "Itinerary_Master") && (
                      <React.Fragment>
                        <div className="col-lg-12 mb-4">
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="selectcustomer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.selectcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Select Customer
                            </label>
                          </div>
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="customer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.addcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Add Customer
                            </label>
                          </div>
                        </div>
                        {this.state.customeraction === "addcustomer" &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative">
                              {this.renderInput("customerName", "Customer * (e.g. Firstname Lastname)")}{" "}
                            </div>

                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"))}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        {this.state.customeraction !== "addcustomer" && this.state.data.title &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative mb-3">
                              <Customerselection
                                email={emailId}
                                agentID={agentID}
                                selectCustomer={this.selectCustomer.bind(this)}
                                resetCustomer={this.resetCustomer.bind(this)}
                                customerData={this.state.customerData}
                                isCustomerSet={this.state.isCustomerSet}
                                ishidelabel={true}
                                selectCustomerEmail={this.props.email}
                              />
                            </div>
                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"), "text", true)}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        <div className="col-lg-6">
                          {this.renderInput("title", Trans("Itinerary Title *"))}
                        </div>

                        {/* <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("startDate", Trans("_fromDate"), moment().format("YYYY-MM-DD"))}
                        </div>

                        <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("endDate", Trans("_toDate"), this.state.data.startDate)}
                        </div>

                        <div className="col-lg-2">
                          {this.renderInput("duration", Trans("Duration (Days)"), "text", true)}
                        </div> */}

                        {((this.state.customeraction !== "addcustomer" && this.state.isCustomerSet) || this.state.customeraction == "addcustomer") &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-primary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button onClick={this.handleCreate} className="btn btn-primary w-100">
                                  Copy {(this.props.type === "Quotation"
                                    ? Trans("_quotationReplaceKey")
                                    : (this.props.type === "Quotation_Master"
                                      ? Trans("_quotationReplaceKey") + " Master"
                                      : this.props.type === "Itinerary_Master"
                                        ? "Itinerary Master"
                                        : this.props.type))}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {((this.state.customeraction !== "addcustomer" && !this.state.isCustomerSet)) &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {(this.props.type === "Quotation"
                                    ? Trans("_quotationReplaceKey")
                                    : (this.props.type === "Quotation_Master"
                                      ? Trans("_quotationReplaceKey") + " Master"
                                      : this.props.type === "Itinerary_Master"
                                        ? "Itinerary Master"
                                        : this.props.type))}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  Copy {(this.props.type === "Quotation"
                                    ? Trans("_quotationReplaceKey")
                                    : (this.props.type === "Quotation_Master"
                                      ? Trans("_quotationReplaceKey") + " Master"
                                      : this.props.type === "Itinerary_Master"
                                        ? "Itinerary Master"
                                        : this.props.type))}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {this.props.isErrorMsg && (
                          <div className="col-lg-12">
                            <h6 className="alert alert-danger mt-3 d-inline-block">
                              {this.props.isErrorMsg}
                            </h6>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                    {(type === "Package" || type === "Master Package") && (
                      <React.Fragment>
                        <div className="col-lg-12 mb-4">
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="selectcustomer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.selectcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Select Customer
                            </label>
                          </div>
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="customer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.addcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Add Customer
                            </label>
                          </div>
                        </div>
                        {this.state.customeraction === "addcustomer" &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative">
                              {this.renderInput("customerName", "Customer * (e.g. Firstname Lastname)")}{" "}
                            </div>

                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"))}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        {this.state.customeraction !== "addcustomer" && this.state.data.title &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative mb-3">
                              <Customerselection
                                email={emailId}
                                agentID={agentID}
                                selectCustomer={this.selectCustomer.bind(this)}
                                resetCustomer={this.resetCustomer.bind(this)}
                                customerData={this.state.customerData}
                                isCustomerSet={this.state.isCustomerSet}
                                ishidelabel={true}
                                selectCustomerEmail={this.props.email}
                              />
                            </div>
                            <div className="col-lg-6">
                              {this.renderInput("email", Trans("_email"), "text", true)}
                            </div>

                            <div className="col-lg-6">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        <div className="col-lg-6">
                          {this.renderInput("title", Trans("Package Title *"))}
                        </div>

                        {/* <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("startDate", Trans("_fromDate"), moment().format("YYYY-MM-DD"))}
                        </div>

                        <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("endDate", Trans("_toDate"), this.state.data.startDate)}
                        </div>

                        <div className="col-lg-2">
                          {this.renderInput("duration", Trans("Duration (Days)"), "text", true)}
                        </div> */}

                        {((this.state.customeraction !== "addcustomer" && this.state.isCustomerSet) || this.state.customeraction == "addcustomer") &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-primary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  {type === "Master Package" ? "Use " + type : "Copy " + type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button onClick={this.handleCreate} className="btn btn-primary w-100">
                                  {type === "Master Package" ? "Use " + type : "Copy " + type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {((this.state.customeraction !== "addcustomer" && !this.state.isCustomerSet)) &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  {type === "Master Package" ? "Use " + type : "Copy " + type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  {type === "Master Package" ? "Use " + type : "Copy " + type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {this.props.isErrorMsg && (
                          <div className="col-lg-12">
                            <h6 className="alert alert-danger mt-3 d-inline-block">
                              {this.props.isErrorMsg}
                            </h6>
                          </div>
                        )}
                      </React.Fragment>
                    )}

                    {type === "Marketplace Package" && (
                      <React.Fragment>
                        <div className="col-lg-12 mb-4 d-none">
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="selectcustomer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.selectcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Select Customer
                            </label>
                          </div>
                          <div className="custom-control custom-switch d-inline-block col-lg-6">
                            <input
                              id="customer"
                              name="customer"
                              type="checkbox"
                              className="custom-control-input"
                              checked={this.state.addcustomer}
                              onChange={this.handlecustomercheckbox}
                            />
                            <label className="custom-control-label" htmlFor="customer">
                              Add Customer
                            </label>
                          </div>
                        </div>
                        {this.state.customeraction === "addcustomer" &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative d-none">
                              {this.renderInput("customerName", "Customer * (e.g. Firstname Lastname)")}{" "}
                            </div>

                            <div className="col-lg-6 d-none">
                              {this.renderInput("email", Trans("_email"))}
                            </div>

                            <div className="col-lg-6 d-none">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        {this.state.customeraction !== "addcustomer" && this.state.data.title &&
                          <React.Fragment>
                            <div className="col-lg-12 position-relative mb-3 d-none">
                              <Customerselection
                                email={emailId}
                                agentID={agentID}
                                selectCustomer={this.selectCustomer.bind(this)}
                                resetCustomer={this.resetCustomer.bind(this)}
                                customerData={this.state.customerData}
                                isCustomerSet={this.state.isCustomerSet}
                                ishidelabel={true}
                                selectCustomerEmail={this.props.email}
                              />
                            </div>
                            <div className="col-lg-6 d-none">
                              {this.renderInput("email", Trans("_email"), "text", true)}
                            </div>

                            <div className="col-lg-6 d-none">
                              {this.renderContactInput("phone", Trans("_lblContactPhoneWithStar"))}
                            </div>
                          </React.Fragment>
                        }

                        <div className="col-lg-6">
                          {this.renderInput("title", Trans("Package Title *"))}
                        </div>

                        {/* <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("startDate", Trans("_fromDate"), moment().format("YYYY-MM-DD"))}
                        </div>

                        <div className="col-lg-2">
                          {this.renderCurrentDateWithDuration("endDate", Trans("_toDate"), this.state.data.startDate)}
                        </div>

                        <div className="col-lg-2">
                          {this.renderInput("duration", Trans("Duration (Days)"), "text", true)}
                        </div> */}

                        {((this.state.customeraction !== "addcustomer" && this.state.isCustomerSet) || this.state.customeraction == "addcustomer") &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-primary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button onClick={this.handleCreate} className="btn btn-primary w-100">
                                  Copy {type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {((this.state.customeraction !== "addcustomer" && !this.state.isCustomerSet)) &&
                          <div className="col-lg-6">
                            <div className="form-group phone">
                              <label className="d-block">&nbsp;&nbsp;</label>
                              {this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Copy {type}
                                </button>
                              }
                              {!this.props.isBtnLoading &&
                                <button className="btn btn-secondary w-100">
                                  Copy {type}
                                </button>
                              }
                            </div>
                          </div>
                        }
                        {this.props.isErrorMsg && (
                          <div className="col-lg-12">
                            <h6 className="alert alert-danger mt-3 d-inline-block">
                              {this.props.isErrorMsg}
                            </h6>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </div>

                  {this.props.customerName && !this.props.removedeletebutton && (
                    <button
                      className="btn btn-sm position-absolute p-1 border-left border-bottom rounded-0 bg-light"
                      style={{ top: "0px", right: "0px" }}
                      onClick={this.handleCreate}
                    >
                      <SVGIcon
                        name="times"
                        width="16"
                        height="16"
                        className="d-flex align-items-center text-secondary"
                      ></SVGIcon>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>






    );
  }
}

export default QuotationCreateCopy;
