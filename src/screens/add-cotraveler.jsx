import React from "react";
import { apiRequester } from "../services/requester";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import Loader from "../components/common/loader";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import Config from "../config.json";

class AddCoTraveler extends Form {
  state = {
    isLoading: false,
    userInfo: "",
    showErrow: false,
    data: {
      firstname: "",
      lastname: "",
      gender: "Male",
      phonenumber: "",
      alternetphonenumber: "",
      country: DropdownList.CountryList.find(
        element =>
          element.isoCode ===
          Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
      ).value,
      birthdate: "",
      anniversarydate: "",
      city: "",
      address: "",
      zipcode: "",
      documenttype: "",
      documentnumber: "",
      socialsecuritynumber: "",
      expirydate: "",
      nationality: DropdownList.CountryList.find(
        element =>
          element.isoCode ===
          Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
      ).value,
      issueingcountry: DropdownList.CountryList.find(
        element =>
          element.isoCode ===
          Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
      ).value
    },
    entityID: "",
    userID: "",
    agentID: "",
    customerID: "",
    showLoader: false,
    errors: {}
  };

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    this.addCoTraveler();
  };
  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstname, "require"))
      errors.firstname = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstname, "special-characters-not-allowed", /[<>]/))
      errors.firstname = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.firstname, "length", { min: 2, max: 50 })
    )
      errors.firstname = Trans("_error_firstname_length");

    //lastname
    if (!this.validateFormData(data.lastname, "require"))
      errors.lastname = Trans("_error_lastname_require");
    else if (!this.validateFormData(data.lastname, "special-characters-not-allowed", /[<>]/))
      errors.lastname = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.lastname, "length", { min: 2, max: 50 })
    )
      errors.lastname = Trans("_error_lastname_length");

    if (!this.validateFormData(data.gender, "require"))
      errors.gender = Trans("_error_gender_require");

    //Phone number
    const tempmobilenumber = parsePhoneNumberFromString(data.phonenumber);
    if (Config.codebaseType !== undefined && Config.codebaseType === "tourwiz" && !this.validateFormData(data.phonenumber, "require_phoneNumber"))
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    if (!this.validateFormData(data.phonenumber, "phonenumber"))
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    else if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber_length", {
      min: 8,
      max: 14
    })
    )
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");
    else if (Config.codebaseType !== undefined && Config.codebaseType === "tourwiz" && !tempmobilenumber)
      errors.phonenumber = Trans("_error_mobilenumber_require");

    if (!this.validateFormData(data.nationality, "require"))
      errors.nationality = Trans("_error_nationality_require");

    if (!this.validateFormData(data.documenttype, "require"))
      errors.documenttype = Trans("_error_documentType_require");

    if (data.documenttype.toLowerCase() === "passportnumber") {
      //documentNumber
      if (!this.validateFormData(data.documentnumber, "require"))
        errors.documentnumber = Trans("_error_documentNumber_require");
      else if (!this.validateFormData(data.documentnumber, "alpha_numeric"))
        errors.documentnumber = Trans("_error_documentNumber_alpha_numeric");
      else if (
        !this.validateFormData(data.documentnumber, "length", {
          min: 5,
          max: 20
        })
      )
        errors.documentnumber = Trans("_error_documentNumber_length");

      //passportExpirationDate
      if (!this.validateFormData(data.expirydate, "require"))
        errors.expirydate = Trans("_error_passportExpirationDate_require");
      else if (!this.validateFormData(data.expirydate, "require_date"))
        errors.expirydate = Trans("_error_passportExpirationDate_require");
      else if (
        !this.validateFormData(data.expirydate, "pastdate", {
          addMonth: 6
        })
      )
        errors.passportExpirationDate = Trans(
          "_error_passportExpirationDate_pastdate"
        );
    } else if (data.documenttype.toLowerCase() === "nationalidcard") {
      //socialsecuritynumber
      if (!this.validateFormData(data.socialsecuritynumber, "require"))
        errors.socialsecuritynumber = Trans(
          "_error_socialSecurityNumber_require"
        );
      else if (
        !this.validateFormData(data.socialsecuritynumber, "alpha_numeric")
      )
        errors.socialsecuritynumber = Trans(
          "_error_socialSecurityNumber_alpha_numeric"
        );
      else if (
        !this.validateFormData(data.socialsecuritynumber, "length", {
          min: 2,
          max: 20
        })
      )
        errors.socialsecuritynumber = Trans(
          "_error_socialSecurityNumber_length"
        );
    }

    // if (!this.validateFormData(data.birthdate, "require"))
    //   errors.birthdate = Trans("_error_birthDate_require");

    // if (!this.validateFormData(data.zipcode, "require"))
    //   errors.zipcode = Trans("_error_ZipCodeOrPostalCode_require");
    if (data.zipcode !== undefined && data.zipcode !== "") {
      if (!this.validateFormData(data.zipcode, "alpha_numeric"))
        errors.zipcode = Trans("_error_ZipCodeOrPostalCode_alpha_numeric");
      else if (
        !this.validateFormData(data.zipcode, "length", { min: 4, max: 10 })
      )
        errors.zipcode = Trans("_error_ZipCodeOrPostalCode_length");
    }
    if (!this.validateFormData(data.city, "require"))
      errors.city = Trans("_error_city_require");
    else if (!this.validateFormData(data.city, "alpha_space"))
      errors.city = Trans("_error_city_alpha_space");
    else if (!this.validateFormData(data.city, "length", { min: 2, max: 50 }))
      errors.city = Trans("_error_city_length");

    if (!this.validateFormData(data.address, "require"))
      errors.address = Trans("_error_address_require");

    if (!this.validateFormData(data.issueingcountry, "require"))
      errors.issueingcountry = Trans("_error_issueingcountry_require");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  componentDidMount() { }

  goBack() {
    this.props.history.push("/CoTraveller/list");
  }
  /*
   ** Call api for add new co-traveler
   */
  addCoTraveler() {
    //Validate form inputs

    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true
    });

    let changedPhoneNumber = "";
    let changedPhoneNumberCountryCode = "";
    let changedHomePhoneNumber = "";
    let changedHomePhoneNumberCountryCode = "";

    /**
     * Check for null or emptyu value
     */
    if (
      this.state.data.phonenumber &&
      this.state.data.phonenumber !== "undefined" &&
      this.state.data.phonenumber !== null
    ) {
      const tempPhoneNumber = parsePhoneNumberFromString(
        this.state.data.phonenumber
      );
      changedPhoneNumber = tempPhoneNumber.nationalNumber;
      changedPhoneNumberCountryCode = "+" + tempPhoneNumber.countryCallingCode;
    }

    /**
     * Check for null or emptyu value
     */
    if (
      this.state.data.alternetphonenumber &&
      this.state.data.alternetphonenumber !== "undefined" &&
      this.state.data.alternetphonenumber !== null &&
      this.state.data.alternetphonenumber !== "undefined-undefined"
    ) {
      const tempHomePhoneNumber = parsePhoneNumberFromString(
        this.state.data.alternetphonenumber
      );
      changedHomePhoneNumber = tempHomePhoneNumber.nationalNumber;
      changedHomePhoneNumberCountryCode =
        "+" + tempHomePhoneNumber.countryCallingCode;
    }

    /* const tempPhoneNumber = parsePhoneNumberFromString(
        this.state.data.phonenumber
      ); */

    var reqOBJ = {
      request: {
        entityID: this.state.entityID,
        userID: this.state.userID,
        agentID: this.state.agentID,
        customerID: this.state.customerID,
        profilePicture: null,
        loginName: this.state.data.firstname + " " + this.state.data.lastname,
        firstName: this.state.data.firstname,
        lastName: this.state.data.lastname,

        location: {
          countryID: this.state.data.country.split("_")[0],
          country: CountryList.find(x => x.value === this.state.data.country)
            .name,
          city: this.state.data.city,
          address: this.state.data.address,
          zipCode: this.state.data.zipcode
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,

          phoneNumber: changedPhoneNumber,
          phoneNumberCountryCode: changedPhoneNumberCountryCode,

          homePhoneNumber: changedHomePhoneNumber,
          homePhoneNumberCountryCode: changedHomePhoneNumberCountryCode
        },
        birthDate: this.state.data.birthdate,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType:
          this.state.data.documenttype === undefined ||
            this.state.data.documenttype === ""
            ? ""
            : this.state.data.documenttype,
        documentNumber:
          this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype.toLowerCase() === "nationalidcard"
              ? this.state.data.socialsecuritynumber
              : "",
        passportExpirationDate: this.state.data.expirydate,
        nationalityCode: this.state.data.nationality.split("_")[0],
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0]
      },
      flags: {}
    };

    var reqURL = "api/v1/cotraveler/create";

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          isLoading: false
        });

        data.response !== undefined && data.status.code === 0
          ? this.props.history.push("/CoTraveller/list")
          : window.alert(data.status.message);
      }.bind(this)
    );
  }
  render() {
    const { CountryList, Gender } = DropdownList;
    const documentType = this.state.data.documenttype.toLowerCase();
    let DocumentTypes = [{ name: Trans("_select"), value: "" }];
    Global.getEnvironmetKeyValue("documentTypes").map(item => {
      DocumentTypes.push({ name: item.description, value: item.name });
    });
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="user-plus"
                type="fill"
                className="mr-3"
                width="30"
                height="30"
              ></SVGIcon>
              {Trans("_addCoTraveler")}
            </h1>
          </div>
        </div>
        <div className="container">
          {this.state.showLoader ? (
            <Loader />
          ) : (
            <div className="contact-details border p-3 bg-white box-shadow mt-3">
              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titlePersonalInformation") + " : "}
              </h5>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderSelect(
                    "gender",
                    Trans("_lblGenderWithStar"),
                    Gender
                  )}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput(
                    "firstname",
                    Trans("_lblFirstNameWithStar")
                  )}
                </div>

                <div className="col-lg-4 col-sm-12">
                  {this.renderInput("lastname", Trans("_lblLastNameWithStar"))}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderBirthDate("birthdate", Trans("_lblBirthdate"))}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderBirthDate(
                    "anniversarydate",
                    Trans("_lblAnniversarydate")
                  )}
                </div>
              </div>

              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titleContactInformation") + " : "}
              </h5>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderContactInput(
                    "phonenumber",
                    (Config.codebaseType !== undefined && Config.codebaseType === "tourwiz") ? Trans("_lblMobileNumber") : Trans("_lblMobileNumberWithStar"),
                    "number",
                    true
                  )}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderSelect(
                    "country",
                    Trans("_lblCountryWithStar"),
                    CountryList
                  )}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput("city", Trans("_lblCityWithStar"))}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput("address", Trans("_lblAddressWithStar"))}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput(
                    "zipcode",
                    Trans("_lblZipCodeOrPostalCode")
                  )}
                </div>
              </div>

              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titleDocumentDetails") + " : "}
              </h5>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderSelect(
                    "documenttype",
                    Trans("_lblDocumentTypeWithStar"),
                    DocumentTypes
                  )}
                </div>

                {documentType.toLowerCase() === "passportnumber" && (
                  <React.Fragment>
                    <div className="col-lg-4 col-sm-12">
                      {this.renderInput("documentnumber", Trans("_documentNumber") + " *")}
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      {this.renderPassportExpiryDate(
                        "expirydate",
                        Trans("_lblExpiryDateWithStar"),
                        new Date()
                      )}
                    </div>
                  </React.Fragment>
                )}
                {documentType.toLowerCase() === "nationalidcard" && (
                  <div className="col-lg-4 col-sm-12">
                    {this.renderInput(
                      "socialsecuritynumber",
                      Trans("_lblSocialSecurityNumberWithStar")
                    )}
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderSelect(
                    "nationality",
                    Trans("_lblNationality"),
                    CountryList
                  )}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderSelect(
                    "issueingcountry",
                    Trans("_lblIssuingCountry"),
                    CountryList
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 mt-4">
                  <button
                    className="btn btn-primary mr-2 float-right"
                    type="submit"
                    onClick={() => this.handleSubmit()}
                  >
                    {this.state.isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    {Trans("_save")}
                  </button>
                  <button
                    className="btn btn-secondary mr-2 float-right"
                    type="submit"
                    onClick={() => {
                      this.goBack();
                    }}
                  >
                    {Trans("_cancel")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddCoTraveler;
