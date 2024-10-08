import React from "react";
import { apiRequester } from "../services/requester";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import Loader from "../components/common/loader";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";

let dataArr = [];

class EditCoTraveler extends Form {
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
      country: "AF_93",
      birthdate: "",
      anniversarydate: "",
      city: "",
      address: "",
      zipcode: "",
      documenttype: "",
      documentnumber: "",
      socialsecuritynumber: "",
      expirydate: "",
      nationality: "AF_93",
      issueingcountry: "AF_93"
    },
    entityID: "",
    userID: "",
    agentID: "",
    customerID: "",
    showLoader: false,
    errors: {}
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
    // if (!this.validateFormData(data.phonenumber, "require_phoneNumber"))
    //   errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    if (!this.validateFormData(data.phonenumber, "phonenumber"))
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    else if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber_length", {
      min: 8,
      max: 14
    })
    )
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");
    // else if (!tempmobilenumber)
    //   errors.phonenumber = Trans("_error_mobilenumber_require");

    if (!this.validateFormData(data.nationality, "require"))
      errors.nationality = Trans("_error_nationality_require");

    if (Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === null) {
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

      if (!this.validateFormData(data.expirydate, "require_date"))
        errors.expirydate = Trans("_error_passportExpirationDate_require");
      else if (
        !this.validateFormData(data.expirydate, "pastdate", {
          addMonth: 6
        })
      )
        errors.expirydate = Trans("_error_passportExpirationDate_pastdate");

      if (!this.validateFormData(data.issueingcountry, "require"))
        errors.issueingcountry = Trans("_error_issueingcountry_require");
    }
    // if (!this.validateFormData(data.documenttype, "require"))
    //   errors.documenttype = Trans("_error_documentType_require");
    // //documentNumber
    // if (!this.validateFormData(data.documentnumber, "require"))
    //   errors.documentnumber = Trans("_error_documentNumber_require");
    // else if (!this.validateFormData(data.documentnumber, "alpha_numeric"))
    //   errors.documentnumber = Trans("_error_documentNumber_alpha_numeric");
    // else if (
    //   !this.validateFormData(data.documentnumber, "length", { min: 5, max: 20 })
    // )
    //   errors.documentnumber = Trans("_error_documentNumber_length");

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

    // if (!this.validateFormData(data.address, "require"))
    //   errors.address = Trans("_error_address_require");



    return Object.keys(errors).length === 0 ? null : errors;
  };
  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    this.updateCoTraveler();
  };
  componentDidMount() {
    this.getCoTravelers();
  }

  /**
   * get list of co-traveler added by user
   */
  getCoTravelers = () => {
    this.setState({
      isLoading: true
    });

    var reqURL = "api/v1/cotraveler/details";
    var reqOBJ = {
      Request: ""
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response !== undefined) {
          //Get current selected co-traveler profile
          dataArr = Object.values(data.response).filter(item => {
            return item.customerID === this.props.match.params.id;
          });
          /**
           * Check for co-traveler's data
           */
          if (dataArr !== undefined && dataArr.length > 0) {
            var copyData = { ...this.state.data };
            copyData.firstname = dataArr[0].firstName;
            copyData.lastname = dataArr[0].lastName;
            copyData.gender = dataArr[0].genderDesc;

            copyData.phonenumber =
              dataArr[0].contactInformation.phoneNumberCountryCode +
              "-" +
              dataArr[0].contactInformation.phoneNumber;
            if (
              dataArr[0].contactInformation.homePhoneNumberCountryCode !==
              undefined &&
              dataArr[0].contactInformation.homePhoneNumber !== undefined
            ) {
              copyData.alternetphonenumber =
                dataArr[0].contactInformation.homePhoneNumberCountryCode +
                "-" +
                dataArr[0].contactInformation.homePhoneNumber;
            }
            copyData.country =
              dataArr[0].location.countryID === ""
                ? DropdownList.CountryList.find(
                  element =>
                    element.isoCode ===
                    Global.getEnvironmetKeyValue(
                      "PortalCountryCode"
                    ).toUpperCase()
                ).value
                : DropdownList.CountryList.find(x =>
                  x.value.includes(dataArr[0].location.countryID)
                ).value;
            copyData.birthdate = dataArr[0].birthDate;
            copyData.anniversarydate = dataArr[0].anniversaryDate;
            copyData.city = dataArr[0].location.city;
            copyData.address = dataArr[0].location.address;
            copyData.zipcode = dataArr[0].location.zipCode;

            copyData.documenttype =
              dataArr[0].documentType !== undefined && dataArr[0].documentType;
            copyData.documentnumber =
              dataArr[0].documentType !== undefined &&
                dataArr[0].documentType.toLowerCase() === "passportnumber"
                ? dataArr[0].documentNumber
                : "";
            copyData.socialsecuritynumber =
              dataArr[0].documentType !== undefined &&
                dataArr[0].documentType.toLowerCase() === "nationalidcard"
                ? dataArr[0].documentNumber
                : "";
            copyData.documentnumber = dataArr[0].documentNumber;
            copyData.expirydate = dataArr[0].passportExpirationDate;
            copyData.nationality =
              dataArr[0].nationalityCode === ""
                ? DropdownList.CountryList.find(
                  element =>
                    element.isoCode ===
                    Global.getEnvironmetKeyValue(
                      "PortalCountryCode"
                    ).toUpperCase()
                ).value
                : DropdownList.CountryList.find(x =>
                  x.value.includes(dataArr[0].nationalityCode.toUpperCase())
                ).value;
            copyData.issueingcountry =
              dataArr[0].issuingCountryCode === ""
                ? DropdownList.CountryList.find(
                  element =>
                    element.isoCode ===
                    Global.getEnvironmetKeyValue(
                      "PortalCountryCode"
                    ).toUpperCase()
                ).value
                : DropdownList.CountryList.find(x =>
                  x.value.includes(
                    dataArr[0].issuingCountryCode.toUpperCase()
                  )
                ).value;
            this.setState({
              data: copyData,
              isLoading: false,
              entityID: dataArr[0].entityID,
              userID: dataArr[0].userID,
              agentID: dataArr[0].agentID,
              customerID: dataArr[0].customerID
            });
          }
        } else {
          this.setState({
            isLoading: true,
            showErrow: true
          });
        }
      }.bind(this)
    );
  };

  goBack() {
    this.props.history.push("/CoTraveller/list");
  }
  /*
   ** Call api for update co-traveler info
   */
  updateCoTraveler() {
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

    //Creat request object
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

    var reqURL = "api/v1/cotraveler/update";

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
    let DocumentDetailsNonMandatoryInProfile = Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === "true" ? true : false;
    Global.getEnvironmetKeyValue("documentTypes").map(item => {
      DocumentTypes.push({ name: item.description, value: item.name });
      return true;
    });
    let IsAnniverseryNotAllowed = Global.getEnvironmetKeyValue("IsAnniverseryNotAllowed", "cobrand") === "true" ? true : false;
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
              {Trans("_editCoTraveler")}
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
                {!IsAnniverseryNotAllowed &&
                  <div className="col-lg-4 col-sm-12">
                    {this.renderBirthDate(
                      "anniversarydate",
                      Trans("_lblAnniversarydate")
                    )}
                  </div>
                }
              </div>

              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titleContactInformation") + " : "}
              </h5>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderContactInput(
                    "phonenumber",
                    Trans("_lblMobileNumber"),
                    "number"
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
                  {this.renderInput("address", Trans("_lblAddress"))}
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
                    !DocumentDetailsNonMandatoryInProfile ? Trans("_lblDocumentTypeWithStar") : Trans("_lblDocumentType"),
                    DocumentTypes
                  )}
                </div>

                {documentType.toLowerCase() === "passportnumber" && (
                  <React.Fragment>
                    <div className="col-lg-4 col-sm-12">
                      {this.renderInput(
                        "documentnumber",
                        !DocumentDetailsNonMandatoryInProfile ? Trans("_lblDocumentNumberWithStar") : Trans("_lblDocumentNumber")
                      )}
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      {this.renderPassportExpiryDate(
                        "expirydate",
                        !DocumentDetailsNonMandatoryInProfile ? Trans("_lblExpiryDateWithStar") : Trans("_lblExpiryDate"),
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

export default EditCoTraveler;
