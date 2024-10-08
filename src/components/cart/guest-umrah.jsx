import React from "react";
import Form from "../common/form";
import * as DropdownList from "../../helpers/dropdown-list";
import { Trans } from "../../helpers/translate";
import moment from "moment";
import * as Global from "../../helpers/global";
import FileBase64 from "../../components/common/FileBase64";
import { apiRequester } from "../../services/requester";
import Amount from "../../helpers/amount";

class GuestUmrah extends Form {
  state = {
    files: [],
    data: {
      gender: "Male",
      firstName: "",
      lastName: "",
      birthDate: "",
      documentType: "",
      documentNumber: "",
      socialSecurityNumber: "",
      issuingCountryCode: Global.getEnvironmetKeyValue("PortalCountryCode"),
      isUploadDocument: Global.getEnvironmetKeyValue("isUploadDocument"),
      passportExpirationDate: "",
      nationalityCode: JSON.parse(localStorage.getItem("umrahPackageDetails"))?.umrahNationality ?? Global.getEnvironmetKeyValue("PortalCountryCode"),
      gccNumber: "",
      iqamaIdNumber: "",
      mealType: "",
      seatType: "",
      baggageDepType: "",
      baggageArrType: "",
      requestType: "",
      flyerCard: "",
      flyerCardNumber: "",
      typeString: this.props.typeString,
      rawData: "",
      url: "",
    },
    errors: {},
    uploadDocValidation: "",
    isSpecialRequest: false,
    travelers: [],
    isSaveTraveler: false,
  };

  handleChildSubmitDuplicateValidation = (errorTypes) => {
    const errors = {};
    if (errorTypes.isDuplicatePaxName) {
      errors.firstName = Trans("_error_firstname_duplicate");
      errors.lastName = Trans("_error_lastname_duplicate");
    }
    if (errorTypes.isDuplicatePassport) {
      errors.documentNumber = Trans("_error_documentNumber_duplicate");
    }
    this.setState({ errors: errors });
  };

  handleChildSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    //if (errors) return;
    let data = this.state.data;
    data.isSaveTraveler = this.state.isSaveTraveler;

    this.props.handleChildSubmit({
      count: this.props.count,
      business: "air",
      data: data,
      isErrors: errors !== null,
    });
  };

  // Callback~
  getFiles(files) {
    this.setState({ files: files });
    let tempURL = "";
    let tempRawData = "";
    if (
      this.state.files &&
      this.state.files !== "undefined" &&
      this.state.files.base64 &&
      this.state.files.base64 !== "undefined"
    ) {
      tempURL = this.state.files.name;
      if (this.state.files.base64.includes("data:image/jpeg;base64,")) {
        tempRawData = this.state.files.base64.replace(
          "data:image/jpeg;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:image/png;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:image/png;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:application/msword;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes("data:application/pdf;base64,", "")
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/pdf;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes(
          "data:application/x-zip-compressed;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/x-zip-compressed;base64,",
          ""
        );
      } else if (
        this.state.files.base64.includes(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        )
      ) {
        tempRawData = this.state.files.base64.replace(
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
          ""
        );
      } else {
        tempRawData = "";
        let copyData = { ...this.state.data };

        copyData.rawData = "";
        copyData.url = "";
        this.setState({
          data: copyData,
          uploadDocValidation: "notValidExtensions",
        });
      }
      if (this.state.files.file.size > 524288) {
        tempRawData = "";
        let copyData = { ...this.state.data };

        copyData.rawData = "";
        copyData.url = "";
        this.setState({ data: copyData, uploadDocValidation: "notValidSize" });
      }
    }

    if (tempRawData !== "" && tempURL !== "") {
      let copyData = { ...this.state.data };

      copyData.rawData = tempRawData;
      copyData.url = tempURL;
      this.setState({ data: copyData, uploadDocValidation: "" });
    }
  }

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.firstName, "require"))
      errors.firstName = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstName, "special-characters-not-allowed", /[<>]/))
      errors.firstName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.firstName, "length", { min: 2, max: 50 })
    )
      errors.firstName = Trans("_error_firstname_length");

    //lastname
    if (!this.validateFormData(data.lastName, "require"))
      errors.lastName = Trans("_error_lastname_require");
    else if (!this.validateFormData(data.lastName, "special-characters-not-allowed", /[<>]/))
      errors.lastName = "< and > characters not allowed";
    else if (
      !this.validateFormData(data.lastName, "length", { min: 2, max: 50 })
    )
      errors.lastName = Trans("_error_lastname_length");

    if (!this.validateFormData(data.documentType, "require"))
      errors.documentType = Trans("_error_documentType_require");

    if (data.documentType.toLowerCase() === "passportnumber") {
      //documentNumber
      if (!this.validateFormData(data.documentNumber, "require"))
        errors.documentNumber = Trans("_error_documentNumber_require");
      else if (!this.validateFormData(data.documentNumber, "alpha_numeric"))
        errors.documentNumber = Trans("_error_documentNumber_alpha_numeric");
      else if (
        !this.validateFormData(data.documentNumber, "length", {
          min: 5,
          max: 20,
        })
      )
        errors.documentNumber = Trans("_error_documentNumber_length");

      //passportExpirationDate
      if (!this.validateFormData(data.passportExpirationDate, "require"))
        errors.passportExpirationDate = Trans(
          "_error_passportExpirationDate_require"
        );
      else if (
        !this.validateFormData(data.passportExpirationDate, "require_date")
      )
        errors.passportExpirationDate = Trans(
          "_error_passportExpirationDate_require"
        );
      else if (
        !this.validateFormData(data.passportExpirationDate, "pastdate", {
          conditionDate: this.props.dateInfo.endDate,
          addMonth: 6,
        })
      )
        errors.passportExpirationDate = Trans(
          "_error_passportExpirationDate_pastdate"
        );
    } else if (data.documentType.toLowerCase() === "nationalidcard") {
      //socialSecurityNumber
      if (!this.validateFormData(data.socialSecurityNumber, "require"))
        errors.socialSecurityNumber = Trans(
          "_error_socialSecurityNumber_require"
        );
      else if (
        !this.validateFormData(data.socialSecurityNumber, "alpha_numeric")
      )
        errors.socialSecurityNumber = Trans(
          "_error_socialSecurityNumber_alpha_numeric"
        );
      else if (
        !this.validateFormData(data.socialSecurityNumber, "length", {
          min: 2,
          max: 20,
        })
      )
        errors.socialSecurityNumber = Trans(
          "_error_socialSecurityNumber_length"
        );
    }

    //birthDate
    if (!this.validateFormData(data.birthDate, "require"))
      errors.birthDate = Trans("_error_birthDate_require");
    //Upload Document
    if (data.isUploadDocument) {
      if (this.state.uploadDocValidation === "notValidExtensions")
        errors.url = Trans("_error_uploadDocument_notValidExtensions");
      else if (this.state.uploadDocValidation === "notValidSize")
        errors.url = Trans("_error_uploadDocument_notValidSize");
      else if (!this.validateFormData(data.url, "require"))
        errors.url = Trans("_error_uploadDocument_require");
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  setUserInfo = (traveler) => {
    const {
      gender,
      firstName,
      lastName,
      birthDate,
      documentType,
      documentNumber,
      issuingCountryCode,
      passportExpirationDate,
      nationalityCode,
      documents,
      milesCard,
      milesCardNumber
    } = traveler ? traveler : this.props.userInfo;
    let userInfo = { ...this.state.data };
    userInfo.gender = gender ? (gender === "M" ? "Male" : "Female") : "Male";
    userInfo.firstName = firstName ? firstName : "";
    userInfo.lastName = lastName ? lastName : "";
    userInfo.birthDate =
      birthDate !== ""
        ? moment(new Date(birthDate)) >=
          this.getMinDateForBirthDate(
            this.props.typeString,
            this.props.dateInfo.endDate
          ) &&
          moment(new Date(birthDate)) <=
          this.getMaxDateForBirthDate(
            this.props.typeString,
            this.props.dateInfo.endDate
          )
          ? birthDate
          : ""
        : "";
    userInfo.documentType = documentType ? documentType : "";
    userInfo.documentNumber =
      documentType !== undefined &&
        documentType.toLowerCase() === "passportnumber"
        ? documentNumber
        : "";
    userInfo.socialSecurityNumber =
      documentType !== undefined &&
        documentType.toLowerCase() === "nationalidcard"
        ? documentNumber
        : "";
    userInfo.issuingCountryCode = issuingCountryCode
      ? issuingCountryCode
      : Global.getEnvironmetKeyValue("PortalCountryCode");

    var umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"))
    if (umrahPackageDetails?.umrahNationality) {
      userInfo.nationalityCode = umrahPackageDetails.umrahNationality
    }
    else
      userInfo.nationalityCode = nationalityCode
        ? nationalityCode
        : Global.getEnvironmetKeyValue("PortalCountryCode");
    let passportExpirationMinDate = moment(
      new Date(this.props.dateInfo.endDate).setMonth(
        new Date(this.props.dateInfo.endDate).getMonth() + 6
      )
    );
    if (passportExpirationDate !== "") {
      let passportExpirationUserDate = moment(new Date(passportExpirationDate));
      userInfo.passportExpirationDate = passportExpirationMinDate.isBefore(
        passportExpirationUserDate
      )
        ? passportExpirationDate
        : "";
    } else userInfo.passportExpirationDate = "";

    if (documents !== undefined && documents !== null && documents[0].url !== undefined && documents[0].url !== null && documents[0].url !== "")
      userInfo.url = documents[0].url
    else
      userInfo.url = "";

    if (milesCardNumber && milesCard && this.props.availableInputs.filter(x => x.type === "milescard").length > 0
      && this.props.availableInputs.filter(x => x.type === "milescard")[this.props.count]
      && this.props.availableInputs.filter(x => x.type === "milescard")[this.props.count].item
      && this.props.availableInputs.filter(x => x.type === "milescard")[this.props.count].item.filter(x => x.originID === milesCard).length > 0) {
      userInfo.flyerCard = this.props.availableInputs.filter(x => x.type === "milescard")[this.props.count].item.filter(x => x.originID === milesCard)[0].id
      userInfo.flyerCardNumber = milesCardNumber;
    }

    (this.props.count === 0 || traveler) &&
      this.setState({
        data: userInfo,
      });
  };

  getMinDateForBirthDate = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate ? new Date(conditiondate) : new Date();
    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 100;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 18;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 2;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 100;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
      conditiondate.setDate(conditiondate.getDate() + 1);
    } else {
      conditiondate.setFullYear(conditiondate.getFullYear() - 100);
      conditiondate.setDate(conditiondate.getDate() + 1);
    }
    return moment(conditiondate);
  };

  getMaxDateForBirthDate = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate ? new Date(conditiondate) : new Date();

    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 18;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 2;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 0;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 12;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
    }

    return moment(conditiondate);
  };

  handleSpecialRequest = () => {
    this.setState({ isSpecialRequest: !this.state.isSpecialRequest });
  };

  handleFrequentFlyer = () => {
    this.setState({ isFrequentFlyer: !this.state.isFrequentFlyer });
  };

  getTravelers = () => {
    var reqURL = "api/v1/cotraveler/details";
    var reqOBJ = {
      Request: "",
    };

    apiRequester(reqURL, reqOBJ, (data) => {
      this.setState({ travelers: data.response });
    });
  };

  setTravelers = (e) => {
    let traveler = this.state.travelers.find(
      (x) => x.customerID === e.target.value
    );

    this.setUserInfo(traveler);
  };

  saveTraveler = () => {
    this.setState({ isSaveTraveler: !this.state.isSaveTraveler });
  };

  componentDidMount() {
    this.props.onRef(this);
    if (!this.props.continueAsGuest) {
      this.setUserInfo();
      this.getTravelers();
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const portalType =
      Global.getEnvironmetKeyValue("portalType") === "B2C" ? true : false;
    const passengerType =
      this.props.typeString === "ADT"
        ? "Adult"
        : this.props.typeString === "CHD"
          ? "Child"
          : localStorage.getItem("umrahPackageDetails") ? "Adult" : "Infant";

    const { Gender, CountryList } = DropdownList;
    const { isSpecialRequest, isFrequentFlyer, travelers } = this.state;
    const { documentType } = this.state.data;

    let documentTypes = [{ name: Trans("_select"), value: "" }];
    Global.getEnvironmetKeyValue("documentTypes").map((item) => {
      documentTypes.push({ name: item.description, value: item.name });
      return true;
    });

    let seatList = [{ name: Trans("_select"), value: "" }];
    let mealList = [{ name: Trans("_select"), value: "" }];
    let baggageListDep = [{ name: Trans("_select"), value: "" }];
    let baggageListArr = [{ name: Trans("_select"), value: "" }];
    let requestList = [{ name: Trans("_select"), value: "" }];
    let flyerCardList = [{ name: Trans("_select"), value: "" }];

    let propsCartItems = this.props.propsCartItems;
    let hotelCartItem = propsCartItems.find(x => x.data.business === 'hotel');

    let visaFeeAmount = 0;
    let count = (this.props.count + 1).toString();
    if (hotelCartItem) {
      const { addons, inputs } = hotelCartItem;
      let visaFeeAmountObj = addons.availableAddons.find(x => x.code === 'pax_' + count);
      if (visaFeeAmountObj)
        visaFeeAmount = visaFeeAmountObj.item[0].amount;
    }
    return (
      <div className="row">
        <div className="col-lg-12">
          <h6 className="mb-3 mt-2">
            {(localStorage.getItem("isUmrahPortal") ? Trans("_pilgrimTypeTitle") : Trans("_passengerTypeTitle")) + " : "}
            <span className="font-weight-bold text-primary">
              {Trans("_lbl" + passengerType)}
            </span>
          </h6>
        </div>

        {!this.props.continueAsGuest && portalType && travelers.length > 0 && (
          <div className="col-lg-3">
            <div className="form-group travelers">
              <label htmlFor="travelers">{Trans("_lblTravelers")}</label>
              <select
                name="travelers"
                id="travelers"
                className="form-control"
                onChange={(e) => this.setTravelers(e)}
              >
                <option value="">{Trans("_select")}</option>
                {travelers.map((item) => {
                  return (
                    <option key={item.customerID} value={item.customerID}>
                      {item.firstName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        <div className="col-lg-3">
          {this.renderSelect("gender", Trans("_lblGenderWithStar"), Gender)}
        </div>
        <div className="col-lg-3">
          {this.renderInput("firstName", Trans("_lblFirstNameWithStar"))}
        </div>
        <div className="col-lg-3">
          {this.renderInput("lastName", Trans("_lblLastNameWithStar"))}
        </div>
        <div className="col-lg-3">
          {this.renderBirthDate(
            "birthDate",
            Trans("_lblBirthdateWithStar"),
            this.props.typeString
            //,this.props.dateInfo.endDate
          )}
        </div>
        <div className="col-lg-3">
          {this.renderSelect(
            "nationalityCode",
            Trans("_lblNationalityWithStar"),
            CountryList,
            "isoCode",
            "name"
          )}
        </div>
        <div className="col-lg-3">
          {this.renderSelect(
            "documentType",
            Trans("_lblDocumentTypeWithStar"),
            documentTypes
          )}
        </div>
        {documentType === "PASSPORTNUMBER" && (
          <React.Fragment>
            <div className="col-lg-3">
              {this.renderInput(
                "documentNumber",
                Trans("_lblPassportNumberWithStar")
              )}
            </div>
            <div className="col-lg-3">
              {this.renderPassportExpiryDate(
                "passportExpirationDate",
                Trans("_lblExpiryDateWithStar"),
                this.props.dateInfo.endDate
              )}
            </div>
          </React.Fragment>
        )}
        {documentType === "NationalIDCard" && (
          <div className="col-lg-3">
            {this.renderInput("socialSecurityNumber", "Social Security Number")}
          </div>
        )}

        <div className="col-lg-3">
          {this.renderSelect(
            "issuingCountryCode",
            Trans("_lblIssuingCountryWithStar"),
            CountryList,
            "isoCode",
            "name"
          )}
        </div>
        {this.state.data.isUploadDocument && (
          <div className="col-lg-3 col-sm-12">
            <FileBase64
              multiple={false}
              onDone={this.getFiles.bind(this)}
              name="uploadDocument"
              label={Trans("_lblUploadSocument")}
              placeholder={Trans("_chooseFile")}
              className="w-100 col-lg-12"
            />

            {this.state.data.url !== undefined && this.state.data.url !== "" && (
              <div className="col-lg-12 col-sm-12 m-0 p-0">
                <small className="alert alert-success mt-n4 mb-0 p-1 d-inline-block">
                  {Trans("_lblUploadSocument") + " : " + this.state.data.url}
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

        <div className="col-lg-12 mb-3">
          {propsCartItems.find(x => x.data.business === 'hotel')
            && localStorage.getItem("umrahPackageDetails")
            && (visaFeeAmount || visaFeeAmount === 0)
            &&
            <span
              className="alert alert-info d-inline-block p-2"
            >{Trans("_mutamerVisaFee")} : <Amount amount={visaFeeAmount} />
            </span>
          }
        </div>
      </div>
    );
  }
}

export default GuestUmrah;
