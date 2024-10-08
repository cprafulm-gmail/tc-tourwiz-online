import React, { Component } from "react";
import Form from "../common/form";
import { apiRequester_unified_api } from "../../services/requester-unified-api";

class AgentSignUp extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91-",
      password: "",
      confirmPassword: "",
    },
    errors: {},
    isRegisterSuccess: false,
    isRegisterFailed: false,
    isEmailEntered: false,
    RegisterErrorMsg:"",
    isRegistering:false
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstName, "require"))
      errors.firstName = "First Name required";
    else if (!this.validateFormData(data.firstName, "length",{min : 2}))
      errors.firstName = "First Name must be between 2 and 50 characters long";

    if (!this.validateFormData(data.lastName, "require"))
      errors.lastName = "Last Name required";
    else if (!this.validateFormData(data.lastName, "length",{min : 2}))
      errors.lastName = "Last Name must be between 2 and 50 characters long";
    
    if (!this.validateFormData(data.email, "require"))
      errors.email = "Email Address required";

    if (!this.validateFormData(data.phone, "require"))
      errors.phone = "Phone Number required";
    else if (data.phone.indexOf("-") > -1 && !this.validateFormData(data.phone.split('-')[1], "require"))
      errors.phone = "Phone Number required";
    else if (data.phone.indexOf("-") > -1 && !this.validateFormData(data.phone.split('-')[1], "only-numeric"))
      errors.phone = "Enter valid Phone Number";  
    else if (!this.validateFormData(data.phone, "phonenumber_length"))
      errors.phone = "Phone Number must be between 8 and 14 digit long";
      
    if (!this.validateFormData(data.password, "require"))
      errors.password = "Password required";
    else if (!this.validateFormData(data.password, "length",{min : 6}))
      errors.password = "Minimum 6 character password required";

    if (!this.validateFormData(data.confirmPassword, "require"))
      errors.confirmPassword = "Confirm Password required";

    if (data?.password !== data?.confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password must match";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  validateEmail = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.email, "email"))
      errors.email = "Please enter valid email address.";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSignup = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.setState({isRegistering:true}, this.handleRegistration());
  };

  handleRegistration = () => {
    let data = this.state.data;

    var reqURL = "tw/setup";
    var reqOBJ = {
      firstName: data.firstName,
      lastName: data.lastName,
      customerCareEmail: data.email,
      loginName: data.email,
      identificationCode: data.email,
      phoneNumber: data.phone,
      displayName: data.firstName + " " + data.lastName,
      password: data.password,
      currencySymbol: "INR",
      zoneName: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    };

    apiRequester_unified_api(reqURL, reqOBJ, (data) => {
      if (data?.status) {
        this.setState({ isRegisterSuccess: true });
      } else {
        if(data?.validationErrors){
          let errors = {};
          if(data?.validationErrors.customerCareEmail)
            errors.email = "Email address is already taken.";
          if(data?.validationErrors.phoneNumber)
            errors.phone = "Phone Number is already taken.";
          this.setState({ 
            isRegistering: false,
            isRegisterFailed: false,
            RegisterErrorMsg: data?.validationErrors.phoneNumber ? data?.validationErrors.phoneNumber : data?.validationErrors.customerCareEmail ? data?.validationErrors.customerCareEmail :"Email address is already taken.",
            errors
           });
          
        }
        else{
          this.setState({ 
            isRegistering: false,
            isRegisterFailed: false,
            RegisterErrorMsg: "Email address is already taken."
           });
        }
      }
    });
  };

  handleEmail = () => {
    const errors = this.validateEmail();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { data } = this.state;
    this.setState({ isEmailEntered: !this.state.isEmailEntered });
    var reqURL = "register/email";
    var reqOBJ = { email: data?.email };
    apiRequester_unified_api(reqURL, reqOBJ, () => {});
  };

  render() {
    const { isRegisterSuccess, isRegisterFailed, isEmailEntered, RegisterErrorMsg } = this.state;
    return (
      <div>
        <div className="model-popup">
          <div className="modal fade show d-block">
            <div
              className={
                "modal-dialog modal-dialog-centered modal-dialog-scrollable " +
                (isEmailEntered && "modal-lg")
              }
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-capitalize">Register</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => {
                      this.props.closePopup();
                    }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {!isRegisterSuccess && !isRegisterFailed && (
                    <div>
                      {!isEmailEntered && (
                        <div className="row">
                          <div className="col-lg-12">
                            {this.renderInputParam({name : "email", label : "Email Address *", maxlength: 100})}
                          </div>

                          <div className="col-lg-12 text-right">
                            <button
                              onClick={() => this.handleEmail()}
                              className="btn btn-primary"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {isEmailEntered && (
                        <div className="row">
                          <div className="col-lg-6">
                            {this.renderInputParam({name : "firstName", label : "First Name *", minlength: 2, maxlength: 50})}
                          </div>

                          <div className="col-lg-6">
                            {this.renderInputParam({name : "lastName", label : "Last Name *", minlength: 2, maxlength: 50})}
                          </div>

                          <div className="col-lg-6">
                            {this.renderInputParam({name : "email", label : "Email Address *", maxlength: 100})}
                          </div>

                          <div className="col-lg-6">
                            {this.renderContactInput(
                              "phone",
                              "Phone Number * (e.g. 9823999999)"
                            )}
                          </div>

                          <div className="col-lg-6">
                            {this.renderInputParam({name : "password", label : "Password *", type : "password", minlength: 2, maxlength: 30})}
                          </div>

                          <div className="col-lg-6">
                            {this.renderInput(
                              "confirmPassword",
                              "Confirm Password *",
                              "password"
                            )}
                          </div>

                          {this.state.isRegistering && 
                            <div className="col-lg-12 text-right">
                              <button className="btn btn-primary">
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                Register
                                </button>
                            </div>
                          }
                          {!this.state.isRegistering && 
                            <div className="col-lg-12 text-right">
                              <button
                                onClick={() => this.handleSignup()}
                                className="btn btn-primary"
                              >
                                Register
                              </button>
                          </div>
                          }
                        </div>
                      )}
                    </div>
                  )}

                  {isRegisterSuccess && (
                    <div>
                      <h3 className="mt-5 text-primary text-center">
                        Welcome aboard !
                      </h3>
                      <h6 className="mt-3 mb-5 text-center">
                        Please go ahead and login with your credentials.
                      </h6>
                    </div>
                  )}

                  {isRegisterFailed && (
                    <div>
                      <h3 className="mt-5 text-primary text-center">
                        Oops ! something went wrong.
                      </h3>
                      <h6 className="mt-3 text-center">
                        We were unable to create your account, please try again
                        later.
                      </h6>
                      <p className="mt-3 mb-5 text-center">
                        {RegisterErrorMsg}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      </div>
    );
  }
}

export default AgentSignUp;
