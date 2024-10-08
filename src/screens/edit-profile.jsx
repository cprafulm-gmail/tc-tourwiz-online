import React from "react";
import { apiRequester } from "../services/requester";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import Loader from "../components/common/loader";
import ActionModal from "../helpers/action-modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import FileBase64 from "../components/common/FileBase64";
import moment from "moment";
import Config from "../config.json";

class EditProfile extends Form {
  constructor(props) {
    super(props);

    let AirBusiness = false;
    Global.getEnvironmetKeyValue("availableBusinesses") !== undefined &&
      Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
        if (item.name === "air") AirBusiness = true;
      });
    let isMilesCardNotAllowed =
      Global.getEnvironmetKeyValue("ISMILESCARDNOTALLOWED", "cobrand") === "true" ? true : false;

    this.state = {
      isLoading: false,
      userInfo: "",
      showErrow: false,
      showActionModal: false,
      ismilescardholder: false,
      isMilesCardNotAllowed: isMilesCardNotAllowed,
      isAssignedAirBusiness: AirBusiness,
      isGSTInformation: true,
      isTaxationInformation: false,
      milescardList: [{ name: Trans("_select"), value: "" }],
      files: [],
      files_document: [],
      data: {
        firstname: "",
        lastname: "",
        gender: "Male",
        email: "",
        mobilenumber: "",
        country: "",
        birthdate: "",
        anniversarydate: "",
        city: "",
        address: "",
        zipcode: "",
        documenttype: "",
        documentnumber: "",
        socialsecuritynumber: "",
        expirydate: "",
        nationality: "",
        issueingcountry: "",
        profileURL: "",
        password: "",
        confirmpassword: "",
        milescard: "",
        milescardnumber: "",
        isUploadDocument: Global.getEnvironmetKeyValue("isUploadDocument"),
        rawData: "",
        url: "",
        gstnumber: "",
        panNumber: "",
        registrationnumber: "",
      },
      entityID: "",
      userID: "",
      agentID: "",
      customerID: "",
      showLoader: true,
      errors: {},
      showHideText: Trans("_showChangePassword"),
      isShowChangePassword: false
    };
    //Call api to get user's profile data
    //this.getMilesCardLookup();
  }
  goBack = () => {
    this.setState({
      showActionModal: false
    });
    this.props.history.push("/Profile");
  };
  milesCardHolder = () => {
    var copyData = { ...this.state.data };
    copyData.milescard = "";
    copyData.milescardnumber = "";

    this.setState({
      ismilescardholder: !this.state.ismilescardholder,
      data: copyData
    });
  };

  // Callback~
  getFilesDocument(files_document) {
    this.setState({ files_document: files_document });
    let tempURL = "";
    let tempRawData = "";
    if (
      this.state.files_document &&
      this.state.files_document !== "undefined" &&
      this.state.files_document.base64 &&
      this.state.files_document.base64 !== "undefined"
    ) {
      tempURL = this.state.files_document.name;
      if (
        this.state.files_document.base64.includes("data:image/jpeg;base64,")
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:image/jpeg;base64,",
          ""
        );
      } else if (
        this.state.files_document.base64.includes("data:image/png;base64,", "")
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:image/png;base64,",
          ""
        );
      } else if (
        this.state.files_document.base64.includes(
          "data:application/msword;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (
        this.state.files_document.base64.includes(
          "data:application/pdf;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:application/pdf;base64,",
          ""
        );
      } else if (
        this.state.files_document.base64.includes(
          "data:application/x-zip-compressed;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:application/x-zip-compressed;base64,",
          ""
        );
      } else if (
        this.state.files_document.base64.includes(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files_document.base64.replace(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        );
      } else {
        tempRawData = "";
        var copyData = { ...this.state.data };

        copyData.rawData = "";
        copyData.url = "";
        this.setState({
          data: copyData,
          uploadDocValidation: "notValidExtensions"
        });
      }
      if (this.state.files_document.file.size > 524288) {
        tempRawData = "";
        var copyData = { ...this.state.data };

        copyData.rawData = "";
        copyData.url = "";
        this.setState({ data: copyData, uploadDocValidation: "notValidSize" });
      }
    }

    if (tempRawData !== "" && tempURL !== "") {
      var copyData = { ...this.state.data };

      copyData.rawData = tempRawData;
      copyData.url = tempURL;
      this.setState({ data: copyData, uploadDocValidation: "" });
    }
  }

  /*
   ** Call Signup api
   */
  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    this.saveProfile();
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
    if (this.state.isShowChangePassword) {
      if (!this.validateFormData(data.password, "require"))
        errors.password = Trans("_error_password_require");
      else if (
        !this.validateFormData(data.password, "length", { min: 6, max: 20 })
      )
        errors.password = Trans("_error_password_length");

      if (!this.validateFormData(data.confirmpassword, "require"))
        errors.confirmpassword = Trans("_error_confirmpassword_require");
      else if (data.password !== data.confirmpassword)
        errors.confirmpassword = Trans("_error_confirmpassword_not_match");
    }
    if (!this.validateFormData(data.gender, "require"))
      errors.gender = Trans("_error_gender_require");

    if (!this.validateFormData(data.email, "require"))
      errors.email = Trans("_error_email_require");
    else if (!this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    //Phone number
    const tempmobilenumber = parsePhoneNumberFromString(data.mobilenumber);
    if (!this.validateFormData(data.mobilenumber, "require_phoneNumber"))
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber");
    else if (!this.validateFormData(data.mobilenumber, "phonenumber"))
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber");
    else if (
      !this.validateFormData(data.mobilenumber, "phonenumber_length", {
        min: 8,
        max: 14
      })
    )
      errors.mobilenumber = Trans("_error_mobilenumber_phonenumber_length");
    else if (!tempmobilenumber)
      errors.mobilenumber = Trans("_error_mobilenumber_require");

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

    // if (!this.validateFormData(data.birthdate, "require_date"))
    //   errors.birthdate = Trans("_error_birthDate_require");
    if (!this.validateFormData(data.city, "require"))
      errors.city = Trans("_error_city_require");
    else if (!this.validateFormData(data.city, "alpha_space"))
      errors.city = Trans("_error_city_alpha_space");
    else if (!this.validateFormData(data.city, "length", { min: 2, max: 50 }))
      errors.city = Trans("_error_city_length");

    if (data.panNumber && !this.validateFormData(data.panNumber, "alpha_numeric")) {
      errors.address = Trans("Enter valid PAN Number");
    } else if (data.panNumber &&
      !this.validateFormData(data.panNumber, "length", {
        min: 5,
        max: 15
      })) {
      errors.panNumber = Trans("Enter valid PAN Number");
    }
    if (Config.codebaseType !== "tourwiz-customer") {
      if (!this.validateFormData(data.address, "require"))
        errors.address = Trans("_error_address_require");
      else if (!this.validateFormData(data.address, "length", { min: 2, max: 50 }))
        errors.address = Trans("_error_address_length");
    }

    if (this.state.isAssignedAirBusiness) {
      if (Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === null) {
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
        if (!this.validateFormData(data.issueingcountry, "require"))
          errors.issueingcountry = Trans("_error_issueingcountry_require");
      }

      if (this.state.ismilescardholder) {
        if (!this.validateFormData(data.milescard, "require"))
          errors.milescard = Trans("_error_milescard_require");
        else if (
          !this.validateFormData(data.milescard, "length", { min: 2, max: 20 })
        )
          errors.milescard = Trans("_error_milescard_length");

        if (!this.validateFormData(data.milescardnumber, "require"))
          errors.milescardnumber = Trans("_error_milescardnumber_require");
        else if (
          !this.validateFormData(data.milescardnumber, "length", {
            min: 2,
            max: 20
          })
        )
          errors.milescardnumber = Trans("_error_milescardnumber_length");
      }

      //Upload Document
      if (data.isUploadDocument) {
        if (this.state.uploadDocValidation === "notValidExtensions")
          errors.url = Trans("_error_uploadDocument_notValidExtensions");
        else if (this.state.uploadDocValidation === "notValidSize")
          errors.url = Trans("_error_uploadDocument_notValidSize");
        else if (!this.validateFormData(data.url, "require"))
          errors.url = Trans("_error_uploadDocument_require");
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };
  // Callback~
  getFiles(files) {
    this.setState({ files: files });
  }
  /**
   * Get user's profile data
   */
  getUserDetails = () => {
    this.setState({
      showLoader: true
    });
    var reqURL = "api/v1/user/details";
    var reqOBJ = {
      Request: ""
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        /**
         * Check response status
         */
        if (data.response !== undefined && data.status.code === 0) {
          var copyData = { ...this.state.data };

          copyData.firstname = data.response.firstName;
          copyData.lastname = data.response.lastName;
          copyData.gender = data.response.genderDesc;
          copyData.email = data.response.contactInformation.email;
          copyData.mobilenumber =
            data.response.contactInformation.phoneNumberCountryCode +
            "-" +
            data.response.contactInformation.phoneNumber;

          copyData.country =
            data.response.location.countryID === ""
              ? DropdownList.CountryList.find(
                element =>
                  element.isoCode ===
                  Global.getEnvironmetKeyValue(
                    "PortalCountryCode"
                  ).toUpperCase()
              ).value
              : DropdownList.CountryList.find(x =>
                x.value.includes(data.response.location.countryID)
              ).value;
          copyData.birthdate = data.response.birthDate;
          copyData.anniversarydate = data.response.anniversaryDate;
          copyData.city = data.response.location.city;
          copyData.address = data.response.location.address;
          copyData.zipcode = data.response.location.zipCode;
          copyData.profileURL = data.response.profilePicture.url;
          copyData.gstnumber = data.response.gstNumber;
          copyData.panNumber = data.response.panNumber;
          copyData.registrationnumber = data.response.registrationNumber;
          copyData.documenttype =
            data.response.documentType !== undefined
              ? data.response.documentType
              : "";
          copyData.documentnumber =
            data.response.documentType !== undefined &&
              data.response.documentType.toLowerCase() === "passportnumber"
              ? data.response.documentNumber
              : "";
          copyData.socialsecuritynumber =
            data.response.documentType !== undefined &&
              data.response.documentType.toLowerCase() === "nationalidcard"
              ? data.response.documentNumber
              : "";
          copyData.expirydate = data.response.passportExpirationDate;
          copyData.nationality =
            data.response.nationalityCode === ""
              ? DropdownList.CountryList.find(
                element =>
                  element.isoCode ===
                  Global.getEnvironmetKeyValue(
                    "PortalCountryCode"
                  ).toUpperCase()
              ).value
              : DropdownList.CountryList.find(x =>
                x.value.includes(data.response.nationalityCode)
              ).value;
          copyData.issueingcountry =
            data.response.issuingCountryCode === ""
              ? DropdownList.CountryList.find(
                element =>
                  element.isoCode ===
                  Global.getEnvironmetKeyValue(
                    "PortalCountryCode"
                  ).toUpperCase()
              ).value
              : DropdownList.CountryList.find(x =>
                x.value.includes(data.response.issuingCountryCode)
              ).value;
          copyData.milescard = data.response.milesCard;
          copyData.milescardnumber = data.response.milesCardNumber;
          copyData.url =
            data.response.documents !== undefined
              ? data.response.documents[0].url
              : "";
          let isSelectionofTaxationInfo = true;
          if (data.response.gstNumber && data.response.gstNumber !== "") {
            isSelectionofTaxationInfo = true;
          }
          else if (data.response.registrationNumber && data.response.registrationNumber !== "") {
            isSelectionofTaxationInfo = false;
          }
          this.setState({
            data: copyData,
            entityID: data.response.entityID,
            userID: data.response.userID,
            agentID: data.response.agentID,
            customerID: data.response.customerID,
            ismilescardholder:
              data.response.milesCard && data.response.milesCardNumber
                ? true
                : false,
            isGSTInformation: isSelectionofTaxationInfo,
            isTaxationInformation: !isSelectionofTaxationInfo,
            //data.response.profilePicture.utl
          });
        }

        this.setState({
          showLoader: false
        });
      }.bind(this)
    );
  };
  /*
   ** Call update profile api
   */
  saveProfile = () => {
    let profileImgName = null;
    let profileImgRaw = null;

    //Validate form inputs

    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true
    });
    //Parse mobile number object
    const tempPhoneNumber = parsePhoneNumberFromString(
      this.state.data.mobilenumber
    );
    /**
     * Check for profile picture is uploaded or not
     * If yes then get imagename and rawData fro file
     */
    if (
      this.state.files &&
      this.state.files !== "undefined" &&
      this.state.files.base64 &&
      this.state.files.base64 !== "undefined"
    ) {
      profileImgName = this.state.files.name;
      if (this.state.files.base64.includes("data:image/jpeg;base64,")) {
        profileImgRaw = this.state.files.base64.replace(
          "data:image/jpeg;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:image/png;base64,", "")
      ) {
        profileImgRaw = this.state.files.base64.replace(
          "data:image/png;base64,",
          ""
        );
      }
    }

    var reqOBJ = {
      request: {
        entityID: this.state.entityID,
        userID: this.state.userID,
        agentID: this.state.agentID,
        customerID: this.state.customerID,
        password: this.state.isShowChangePassword
          ? this.state.data.password
          : null,
        profilePicture: {
          url: profileImgName,
          rawData: profileImgRaw,
          updatedDate: moment().format("DD/MM/YYYY")
        },
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
          phoneNumber: tempPhoneNumber.nationalNumber,
          phoneNumberCountryCode: "+" + tempPhoneNumber.countryCallingCode,
          email: this.state.data.email
        },
        birthDate: this.state.data.birthdate,
        milesCard: this.state.data.milescard,
        milesCardNumber: this.state.data.milescardnumber,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType: this.state.data.documenttype,
        documentNumber:
          this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype.toLowerCase() === "nationalidcard"
              ? this.state.data.socialsecuritynumber
              : "",
        passportExpirationDate: this.state.data.expirydate,
        nationalityCode: this.state.data.nationality.split("_")[0],
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0],
        CanSendEmail: true,

        Documents: [
          {
            RawData:
              this.state.data.rawData !== "" ? this.state.data.rawData : null,
            URL: this.state.data.rawData !== "" ? this.state.data.url : null
          }
        ],
        gstNumber: this.state.data.gstnumber,
        panNumber: this.state.data.panNumber,
        registrationNumber: this.state.data.registrationnumber,
      },
      flags: {}
    };

    var reqURL = "api/v1/user/update";

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          isLoading: false
        });
        data.response !== undefined && data.status.code === 0
          ? this.setState({
            showActionModal: true
          })
          : window.alert(data.status.message);
      }.bind(this)
    );
  };

  handleShowAdditionalOptions = () => {
    this.setState({
      isShowChangePassword: !this.state.isShowChangePassword,
      showHideText:
        this.state.showHideText === Trans("_showChangePassword")
          ? Trans("_hideChangePassword")
          : Trans("_showChangePassword")
    });
  };
  handletaxationcheckbox = (e) => {
    let target = e.target;
    if (target.name === "gstnumber") {
      if (target.checked === true) {
        this.setState({
          isGSTInformation: true,
          isTaxationInformation: false,
        });
      } else {
        this.setState({
          isGSTInformation: false,
          isTaxationInformation: true,
        });
      }
    }
  };
  getMilesCardLookup = () => {
    this.setState({
      showLoader: true
    });
    let lang = localStorage.getItem("lang");
    if (lang === null) {
      localStorage.setItem("lang", "en-US");
      lang = lang === null ? "en-US" : lang;
    }
    let availableLang = Global.getEnvironmetKeyValue("availableLanguages");
    var reqURL = "api/v1/lookup";
    var reqOBJ = {
      info: {
        cultureCode: availableLang.filter(x =>
          x.cultureName.startsWith(lang)
        )[0].cultureName
      },
      request: "smc"
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        /**
         * Check response status
         */
        let MilesCardList = [{ name: Trans("_select"), value: "" }];
        if (data.response !== undefined && data.status.code === 0) {
          data.response.map(item =>
            MilesCardList.push({ name: item.name, value: item.id })
          );
        }

        this.setState({
          milescardList: MilesCardList
        });

        this.getUserDetails();
      }.bind(this)
    );
  };

  componentDidMount() {
    this.getMilesCardLookup();
  }

  render() {
    const { CountryList, Gender } = DropdownList;
    const documentType = this.state.data.documenttype.toLowerCase();
    let DocumentTypes = [{ name: Trans("_select"), value: "" }];
    let DocumentDetailsNonMandatoryInProfile = Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === "true" ? true : false;
    Global.getEnvironmetKeyValue("documentTypes").map(item => {
      DocumentTypes.push({ name: item.description, value: item.name });
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
              {Trans("_editProfile")}
            </h1>
          </div>
        </div>
        <div className="container">
          {this.state.showLoader ? (
            <Loader />
          ) : (
            <div className="contact-details border p-3 bg-white box-shadow mt-3">
              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titleLoginInformation") + " : "}
              </h5>
              <div className="row">
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput(
                    "email",
                    Trans("_lblEmailWithStar"),
                    "",
                    true
                  )}
                </div>
                <div className="col-lg-4 col-sm-12 pt-2">
                  <button
                    className="btn btn-primary p-0 m-0 text-white p-1 pl-3 pr-3 mt-4"
                    onClick={this.handleShowAdditionalOptions}
                  >
                    {this.state.showHideText}
                  </button>
                </div>
              </div>

              {this.state.isShowChangePassword && (
                <div className="row">
                  <div className="col-lg-4 col-sm-12">
                    {this.renderInput(
                      "password",
                      Trans("_rqMinPasswordMessageWithStar"),
                      "password"
                    )}
                  </div>
                  <div className="col-lg-4 col-sm-12">
                    {this.renderInput(
                      "confirmpassword",
                      Trans("_lblConfirmPassword"),
                      "password"
                    )}
                  </div>
                </div>
              )}
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
                <div className="col-lg-4 col-sm-12">
                  {this.state.files &&
                    this.state.files !== "undefined" &&
                    this.state.files.base64 &&
                    this.state.files.base64 !== "undefined" &&
                    this.state.files.base64 !== null ? (
                    <img
                      src={this.state.files.base64}
                      className="profile-img d-inline-block pull-right ml-0 mt-3 col-lg-3 p-0"
                      alt=""
                    />
                  ) : this.state.data.profileURL !== "" &&
                    this.state.data.profileURL !== null &&
                    this.state.data.profileURL !== undefined ? (
                    <img
                      src={this.state.data.profileURL}
                      className="profile-img d-inline-block pull-right ml-0 mt-3 col-lg-3 p-0"
                      alt=""
                    />
                  ) : (
                    <span className="profile-img d-inline-block pull-right ml-0 mt-3 col-lg-3 p-0">
                      <SVGIcon
                        name="user-circle"
                        width="55"
                        height="60"
                        type="fill"
                        fill="#6c757d"
                      ></SVGIcon>
                    </span>
                  )}
                  <FileBase64
                    multiple={false}
                    onDone={this.getFiles.bind(this)}
                    name="userProfile"
                    label={Trans("_lblUserProfile")}
                    placeholder={Trans("_chooseFile")}
                  />
                </div>
              </div>
              <h5 className="text-primary mb-4 mt-4">
                {Trans("_titleContactInformation") + " : "}
              </h5>
              <div className="row praful">
                <div className="col-lg-4 col-sm-12">
                  {this.renderContactInput(
                    "mobilenumber",
                    Trans("_lblMobileNumberWithStar"),
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
                  {this.renderInput("address", Config.codebaseType !== "tourwiz-customer" ? Trans("_lblAddressWithStar") : "Address")}
                </div>
                <div className="col-lg-4 col-sm-12">
                  {this.renderInput(
                    "zipcode",
                    Trans("_lblZipCodeOrPostalCode")
                  )}
                </div>
              </div>
              {this.state.isAssignedAirBusiness && (
                <React.Fragment>
                  <h5 className="text-primary mb-4 mt-4">
                    {Trans("_titleDocumentInformation") + " : "}
                  </h5>
                  <div className="row">
                    {Config.codebaseType !== "travelcarma" &&
                      <div className="col-lg-4 col-sm-12">
                        {this.renderInput("panNumber", "Pan Number", "text", '', '', 0, 15)}
                      </div>}
                    <div className="col-lg-4 col-sm-12">
                      {this.renderSelect(
                        "documenttype",
                        !DocumentDetailsNonMandatoryInProfile ? Trans("_lblDocumentTypeWithStar") : Trans("_lblDocumentType"),
                        DocumentTypes
                      )}
                    </div>

                    {documentType === "passportnumber" && (
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
                    {documentType === "nationalidcard" && (
                      <div className="col-lg-4 col-sm-12">
                        {this.renderInput(
                          "socialsecuritynumber",
                          Trans("_lblSocialSecurityNumberWithStar")
                        )}
                      </div>
                    )}
                    <div className="col-lg-4 col-sm-12">
                      {this.renderSelect(
                        "nationality",
                        !DocumentDetailsNonMandatoryInProfile ? Trans("_lblNationalityWithStar") : Trans("_lblNationality"),
                        CountryList
                      )}
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      {this.renderSelect(
                        "issueingcountry",
                        !DocumentDetailsNonMandatoryInProfile ? Trans("_lblIssuingCountryWithStar") : Trans("_lblIssuingCountry"),
                        CountryList
                      )}
                    </div>

                    {this.state.data.isUploadDocument && (
                      <div className="col-lg-4 col-sm-12">
                        <FileBase64
                          multiple={false}
                          onDone={this.getFilesDocument.bind(this)}
                          name="uploadDocument"
                          label={Trans("_lblUploadSocument")}
                          placeholder={Trans("_chooseFile")}
                          className="w-100 col-lg-12"
                        />

                        {this.state.data.url !== undefined &&
                          this.state.data.url !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-success mt-n4 mb-0 p-1 d-inline-block">
                                {Trans("_uploadedFile") + " : " + this.state.data.url}
                              </small>
                            </div>
                          )}

                        {this.state.errors.url !== undefined &&
                          this.state.errors.url !== "" &&
                          this.state.data.url === "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                              <small className="alert alert-danger mt-n4 mb-0 p-1 d-inline-block">
                                {this.state.errors.url}
                              </small>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  {!this.state.isMilesCardNotAllowed &&
                    <div className="row">
                      <div className="col-lg-4 col-sm-12">
                        <input
                          type="checkbox"
                          className="mr-2"
                          style={{ position: "relative" }}
                          id="chkmilescardholder"
                          checked={this.state.ismilescardholder}
                          onChange={() => this.milesCardHolder()}
                        />
                        <label
                          className=""
                          htmlFor="chkAgree"
                          onClick={() => this.milesCardHolder()}
                        >
                          {Trans("_lblMilesOrFrequentFlyerCardHolder")}
                        </label>
                      </div>
                    </div>
                  }
                  <h5 className="text-primary mb-4 mt-4">
                    {Trans("Taxation Information") + " : "}
                  </h5>
                  <div className="row">
                    <div className="col-lg-6 mb-4" key={+ new Date()}>
                      <div className="custom-control custom-switch d-inline-block col-lg-6">
                        <input
                          id="taxationinfo"
                          name="gstnumber"
                          type="checkbox"
                          className="custom-control-input"
                          checked={this.state.isGSTInformation}
                          onChange={this.handletaxationcheckbox}
                        />
                        <label className="custom-control-label" htmlFor="taxationinfo">
                          GST Information
                        </label>
                      </div>
                      <div className="custom-control custom-switch d-inline-block col-lg-6">
                        <input
                          id="taxationinfo"
                          name="taxationinfo"
                          type="checkbox"
                          className="custom-control-input"
                          checked={this.state.isTaxationInformation}
                          onChange={this.handletaxationcheckbox}
                        />
                        <label className="custom-control-label" htmlFor="taxationinfo">
                          IBAN Information
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {this.state.isGSTInformation &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("gstnumber", Trans("GST Number"), "text", '', '', 0, 50)}
                        </div>
                      </React.Fragment>
                    }
                    {this.state.isTaxationInformation &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("registrationnumber", Trans("IBAN Number"), "text", '', '', 0, 50)}
                        </div>
                      </React.Fragment>
                    }
                  </div>
                  {!this.state.isMilesCardNotAllowed &&
                    <React.Fragment>
                      {this.state.ismilescardholder && (
                        <div className="row">
                          <div className="col-lg-4 col-sm-12">
                            {/* {this.renderInput("milescard", Trans("_lblMilesCard"))} */}
                            {this.renderSelect(
                              "milescard",
                              Trans("_lblMilesCard"),
                              this.state.milescardList,
                              "value",
                              "name"
                            )}
                          </div>

                          <div className="col-lg-4 col-sm-12">
                            {this.renderInput(
                              "milescardnumber",
                              Trans("_lblMilesCardNumber")
                            )}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  }
                </React.Fragment>
              )}
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

          {this.state.showActionModal ? (
            <div className="col-centered mb-5 ml-5">
              <ActionModal
                title={Trans("_myProfile")}
                message={Trans("_myProfileUpdatedSuccessfully")}
                positiveButtonText={Trans("_ok")}
                onPositiveButton={this.goBack}
                handleHide={this.goBack}
              />{" "}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default EditProfile;
