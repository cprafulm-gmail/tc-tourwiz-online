import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import CoTravelerList from "../components/view/view-cotraveler-info";
import Loader from "../components/common/loader";
import ActionModal from "../helpers/action-modal";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import FileBase64 from "../components/common/FileBase64";
import * as Global from "../helpers/global";
import CallCenter from "../components/call-center/call-center";
import Amount from "../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import MessageBar from '../components/admin/message-bar';
import Config from "../config.json";
import { Helmet } from "react-helmet";

let dataArr = [];

class CoTravelers extends Form {
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
      isLoading: this.props.match.params.mode === "Edit",
      coTravelerInfo: [],
      showActionModal: false,
      isCustomerPage: props.location.pathname.toLowerCase().includes("/customer/"),
      traveler: null,
      isAssignedAirBusiness: AirBusiness,
      isMilesCardNotAllowed: isMilesCardNotAllowed,
      milescardList: [{ name: Trans("_select"), value: "" }],
      customerClassList: [{ name: Trans("_select"), value: "" }],
      branchList: [{ name: Trans("_select"), value: "" }],
      ismilescardholder: false,
      userInfo: "",
      showErrow: false,
      files_document: [],
      data: {
        firstname: "",
        lastname: "",
        gender: "Male",
        phonenumber: "",
        alternetphonenumber: "",
        country: DropdownList.CountryList.find(
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
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
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
        ).value,
        issueingcountry: DropdownList.CountryList.find(
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
        ).value,
        milescard: "",
        milescardnumber: "",
        email: "",
        customerclass: "",
        branch: "",
        isUploadDocument: Global.getEnvironmetKeyValue("isUploadDocument"),
        rawData: "",
        url: "",
        ischeckbalance: false,
        balance: 0,
        maxcreditlimit: 0,
        servicetaxregnumber: ""
      },
      entityID: "",
      userID: "",
      agentID: "",
      customerID: "",
      showLoader: this.props.match.params.mode === "Edit",
      errors: {},
      isshowauthorizepopup: false,
      messageBarText: "",
      messageBarType: "",
    };
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  getCustomerClassLookup = async () => {
    var reqURL = "api/v1/lookup";
    var reqOBJ = {
      request: "customerclass",
    };

    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
        }.bind(this)
      );
    });
  };

  getBranchLookup = async () => {
    var reqURL = "api/v1/lookup";
    var reqOBJ = {
      request: "branch",
    };
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
        }.bind(this)
      );
    });
  };

  // Callback~
  getFilesDocument(files_document) {
    this.setState({ uploadDocValidationImage: "" });
    if (
      !files_document.file.type.includes("image/")
    ) {
      this.setState({ uploadDocValidationImage: "Invalid file selected." });
      return;
    }
    else if (files_document.file.size > 1024000) {
      this.setState({ uploadDocValidationImage: "File size should not be greater then 1 MB." });
      return;
    }
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
      if (this.state.files_document.base64.includes("data:image/jpeg;base64,")) {
        tempRawData = this.state.files_document.base64.replace("data:image/jpeg;base64,", "");
      } else if (this.state.files_document.base64.includes("data:image/png;base64,", "")) {
        tempRawData = this.state.files_document.base64.replace("data:image/png;base64,", "");
      } else if (this.state.files_document.base64.includes("data:application/msword;base64,", "")) {
        tempRawData = this.state.files_document.base64.replace(
          "data:application/msword;base64,",
          ""
        );
      } else if (this.state.files_document.base64.includes("data:application/pdf;base64,", "")) {
        tempRawData = this.state.files_document.base64.replace("data:application/pdf;base64,", "");
      } else if (
        this.state.files_document.base64.includes("data:application/x-zip-compressed;base64,", "")
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
          uploadDocValidation: "notValidExtensions",
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

  milesCardHolder = () => {
    var copyData = { ...this.state.data };
    copyData.milescard = "";
    copyData.milescardnumber = "";
    this.setState({
      ismilescardholder: !this.state.ismilescardholder,
      data: copyData,
    });
  };
  checkbalance = () => {
    var copyData = { ...this.state.data };
    copyData.ischeckbalance = !this.state.data.ischeckbalance
    this.setState({
      data: copyData,
    });
  };
  getMilesCardLookup = () => {
    let lang = localStorage.getItem("lang");
    let availableLang = Global.getEnvironmetKeyValue("availableLanguages");
    var reqURL = "api/v1/lookup";
    var reqOBJ = {
      info: {
        cultureCode: availableLang.filter((x) => x.cultureName?.startsWith(lang))[0]?.cultureName,
      },
      request: "smc",
    };
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
        }.bind(this)
      );
    });
  };
  /**
   * get list of co-traveler added by user
   */
  getCoTravelers = async () => {
    this.setState({
      isLoading: true,
    });
    var reqURL = "api/v1/cotraveler/details";
    var reqOBJ = {
      Request: "",
    };
    if (this.state.isCustomerPage) {
      reqURL = "api/v1/customers";
      reqOBJ = {
        Request: {
          PageInfoIndex: [
            {
              Type: "default",
              Item: {
                PageLength: "100",
                CurrentPage: "0",
              },
            },
          ],
        },
      };
    }
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
        }.bind(this)
      );
    });

  };
  handleListResponse = async () => {
    var data = await this.getCoTravelers();

    data.response !== undefined
      ? this.setState({
        showLoader: false,
        isLoading: false,
        coTravelerInfo: this.state.isCustomerPage ? data.response.data : data.response,
        traveler: null,
      })
      : this.setState({
        showLoader: false,
        isLoading: true,
        traveler: null,
      });
    dataArr = [];
    if (this.props.match.params.id !== undefined) {
      dataArr = Object.values(this.state.coTravelerInfo).filter((item) => {
        return item.customerID === this.props.match.params.id;
      });
      /**
       * Check for co-traveler's  data
       */
      if (dataArr !== undefined && dataArr.length > 0) {
        var copyData = { ...this.state.data };
        copyData.firstname = dataArr[0].firstName;
        copyData.lastname = dataArr[0].lastName;
        copyData.gender = dataArr[0].genderDesc;

        if (
          dataArr[0].contactInformation.phoneNumberCountryCode !== undefined &&
          dataArr[0].contactInformation.phoneNumber !== undefined
        ) {
          copyData.phonenumber =
            dataArr[0].contactInformation.phoneNumberCountryCode +
            "-" +
            dataArr[0].contactInformation.phoneNumber;
        }

        if (
          dataArr[0].contactInformation.homePhoneNumberCountryCode !== undefined &&
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
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : dataArr[0].location.countryID !== undefined
              ? DropdownList.CountryList.find((x) =>
                x.value.includes(dataArr[0].location.countryID)
              ).value
              : dataArr[0].location.country !== undefined
                ? DropdownList.CountryList.find((x) => x.name.includes(dataArr[0].location.country))
                  .value
                : DropdownList.CountryList.find(
                  (element) =>
                    element.isoCode ===
                    Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
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
        copyData.documentnumber =
          dataArr[0].documentNumber !== undefined ? dataArr[0].documentNumber : "";
        copyData.expirydate =
          dataArr[0].passportExpirationDate !== undefined
            ? dataArr[0].passportExpirationDate
            : "";
        copyData.nationality =
          dataArr[0].nationalityCode !== undefined && dataArr[0].nationalityCode === ""
            ? DropdownList.CountryList.find(
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : DropdownList.CountryList.find((x) =>
              x.value.includes(dataArr[0].nationalityCode.toUpperCase())
            ).value;
        copyData.issueingcountry =
          dataArr[0].issuingCountryCode !== undefined && dataArr[0].issuingCountryCode === ""
            ? DropdownList.CountryList.find(
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : DropdownList.CountryList.find((x) =>
              x.value.includes(dataArr[0].issuingCountryCode.toUpperCase())
            ).value;
        copyData.milescard = dataArr[0].milesCard !== undefined ? dataArr[0].milesCard : "";
        copyData.milescardnumber = dataArr[0].milesCardNumber !== undefined ? dataArr[0].milesCardNumber : "";
        copyData.url = dataArr[0].documents !== undefined ? dataArr[0].documents[0].url : "";
        copyData.ischeckbalance = dataArr[0].checkBalance !== undefined ? dataArr[0].checkBalance : false;
        copyData.balance = dataArr[0].agentBalance !== undefined ? dataArr[0].agentBalance : 0;
        copyData.maxcreditlimit = dataArr[0].maxCreditLimit !== undefined && dataArr[0].maxCreditLimit > 0 ? dataArr[0].maxCreditLimit : 0;
        copyData.servicetaxregnumber = dataArr[0].serviceTaxRegNumber !== undefined ? dataArr[0].serviceTaxRegNumber : "";
        this.setState({
          data: copyData,
          isLoading: false,
          entityID: dataArr[0].entityID,
          userID: dataArr[0].userID,
          agentID: dataArr[0].agentID,
          customerID: dataArr[0].customerID,
          ismilescardholder: dataArr[0].milesCard && dataArr[0].milesCardNumber ? true : false,
        });
      }
    }
    return Promise.resolve(1);
  }
  async componentDidMount() {
    if (this.props.match.params.mode === "list") {
      await this.handleListResponse();
    }
    if (this.state.isCustomerPage
      && this.props.match.params.mode === "edit"
      && this.props.match.params.id !== undefined) {
      this.editCoTraveler(this.props.match.params.id);
    }

    var promises = [];
    promises.push(this.getMilesCardLookup());
    promises.push(this.getBranchLookup());
    promises.push(this.getCustomerClassLookup());
    Promise.all(promises).then(
      function () {
        var milesCardResponseData = arguments[0][0];
        let MilesCardList = [{ name: Trans("_select"), value: "" }];
        if (milesCardResponseData.response !== undefined && milesCardResponseData.status.code === 0) {
          milesCardResponseData.response.map((item) => MilesCardList.push({ name: item.name, value: item.id }));
        }

        var branchResponseData = arguments[0][1];
        let Branches = [{ name: Trans("_select"), value: "" }];
        if (branchResponseData.response !== undefined && branchResponseData.status.code === 0) {
          branchResponseData.response.map((item) => Branches.push({ name: item.name, value: item.id }));
        }

        var customerClassResponseData = arguments[0][2];

        let CustomerClass = [{ name: Trans("_select"), value: "" }];
        if (customerClassResponseData.response !== undefined && customerClassResponseData.status.code === 0) {
          customerClassResponseData.response.map((item) => CustomerClass.push({ name: item.name, value: item.id }));
        }
        this.setState({
          milescardList: MilesCardList,
          branchList: Branches,
          customerClassList: CustomerClass,
          isLoading: false,
          showLoader: false
        });

      }.bind(this),
      function (err) {
        this.setState({ isErrorMsg: true })
      }.bind(this));

  }

  editCoTraveler = (coTravelerId, customerType) => {
    if (this.state.isCustomerPage) {
      this.props.match.params.id ?
        this.props.history.push("/Customer/edit/" + coTravelerId + "/" + this.props.match.params.id)
        : this.props.history.push("/Customer/edit/" + coTravelerId);
      this.setState({
        showLoader: true,
      });
      var reqURL = "api/v1/customer/detail";
      var reqOBJ = {
        request: {
          entityID: coTravelerId,
        },
      };

      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          this.setState({
            showLoader: false,
            isLoading: false,
            traveler: null,
          });
          if (this.props.match.params.id !== undefined) {
            dataArr = [];
            dataArr.push(data.response);
            let dataArrList = [];
            dataArrList = Object.values(this.state.coTravelerInfo).filter((item) => {
              return item.entityID === this.props.match.params.id;
            });
            /**
             * Check for co-traveler's  data
             */
            if (dataArr !== undefined && dataArr.length > 0) {
              var copyData = { ...this.state.data };
              copyData.firstname = dataArr[0].firstName;
              copyData.lastname = dataArr[0].lastName;
              copyData.gender = dataArr[0].genderDesc;
              copyData.branch =
                dataArr[0].defaultBranchID !== undefined
                  ? dataArr[0].defaultBranchID
                  : dataArrList.length > 0 && dataArrList[0].defaultBranchID !== undefined
                    ? dataArrList[0].defaultBranchID
                    : "";
              copyData.customerclass =
                dataArr[0].customerClassID !== undefined
                  ? dataArr[0].customerClassID
                  : dataArrList.length > 0 && dataArrList[0].customerClassID !== undefined
                    ? dataArrList[0].customerClassID
                    : "";

              if (
                dataArr[0].contactInformation.phoneNumberCountryCode !== undefined &&
                dataArr[0].contactInformation.phoneNumber !== undefined
              ) {
                copyData.phonenumber =
                  dataArr[0].contactInformation.phoneNumberCountryCode +
                  "-" +
                  dataArr[0].contactInformation.phoneNumber;
              }
              if (
                dataArr[0].contactInformation.homePhoneNumberCountryCode !== undefined &&
                dataArr[0].contactInformation.homePhoneNumber !== undefined
              ) {
                copyData.alternetphonenumber =
                  dataArr[0].contactInformation.homePhoneNumberCountryCode +
                  "-" +
                  dataArr[0].contactInformation.homePhoneNumber;
              }
              copyData.email =
                dataArr[0].contactInformation.email !== undefined
                  ? dataArr[0].contactInformation.email
                  : "";
              copyData.country =
                dataArr[0].location.countryID === ""
                  ? DropdownList.CountryList.find(
                    (element) =>
                      element.isoCode ===
                      Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
                  ).value
                  : dataArr[0].location.countryID !== undefined
                    ? DropdownList.CountryList.find((x) =>
                      x.value.includes(dataArr[0].location.countryID)
                    ).value
                    : dataArr[0].location.country !== undefined
                      ? DropdownList.CountryList.find((x) =>
                        x.name.includes(dataArr[0].location.country)
                      ).value
                      : DropdownList.CountryList.find(
                        (element) =>
                          element.isoCode ===
                          Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
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
              copyData.documentnumber =
                dataArr[0].documentNumber !== undefined ? dataArr[0].documentNumber : "";
              copyData.expirydate =
                dataArr[0].passportExpirationDate !== undefined
                  ? dataArr[0].passportExpirationDate
                  : "";
              copyData.nationality =
                dataArr[0].nationalityCode !== undefined && dataArr[0].nationalityCode === ""
                  ? DropdownList.CountryList.find(
                    (element) =>
                      element.isoCode ===
                      Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
                  ).value
                  : DropdownList.CountryList.find((x) =>
                    x.value.includes(dataArr[0].nationalityCode.toUpperCase())
                  ).value;
              copyData.issueingcountry =
                dataArr[0].issuingCountryCode !== undefined && dataArr[0].issuingCountryCode === ""
                  ? DropdownList.CountryList.find(
                    (element) =>
                      element.isoCode ===
                      Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
                  ).value
                  : DropdownList.CountryList.find((x) =>
                    x.value.includes(dataArr[0].issuingCountryCode.toUpperCase())
                  ).value;
              copyData.milescard = dataArr[0].milesCard !== undefined ? dataArr[0].milesCard : "";
              copyData.milescardnumber =
                dataArr[0].milesCardNumber !== undefined ? dataArr[0].milesCardNumber : "";
              copyData.url =
                data.response.documents !== undefined ? data.response.documents[0].url : "";
              copyData.ischeckbalance = dataArr[0].checkBalance !== undefined ? dataArr[0].checkBalance : false;
              copyData.balance = dataArr[0].agentBalance !== undefined ? dataArr[0].agentBalance : 0;
              copyData.maxcreditlimit = dataArr[0].maxCreditLimit !== undefined && dataArr[0].maxCreditLimit > 0 ? dataArr[0].maxCreditLimit : 0;
              copyData.servicetaxregnumber = dataArr[0].serviceTaxRegNumber !== undefined ? dataArr[0].serviceTaxRegNumber : "";
              this.setState({
                data: copyData,
                isLoading: false,
                entityID: dataArr[0].entityID,
                userID: dataArr[0].userID,
                agentID: dataArr[0].agentID,
                customerID: dataArr[0].customerID,
                ismilescardholder:
                  dataArr[0].milesCard && dataArr[0].milesCardNumber ? true : false,
              });
            }
          }
        }.bind(this)
      );
    } else {
      this.props.history.push("/CoTraveller/edit/" + coTravelerId + (this.props.match.params.id ? "/" + this.props.match.params.id : ""));
      //Get current selected co-traveler profile
      dataArr = Object.values(this.state.coTravelerInfo).filter((item) => {
        return item.customerID === coTravelerId;
      });
      /**
       * Check for co-traveler's  data
       */
      if (dataArr !== undefined && dataArr.length > 0) {
        var copyData = { ...this.state.data };
        copyData.firstname = dataArr[0].firstName;
        copyData.lastname = dataArr[0].lastName;
        copyData.gender = dataArr[0].genderDesc;

        if (
          dataArr[0].contactInformation.phoneNumberCountryCode !== undefined &&
          dataArr[0].contactInformation.phoneNumber !== undefined
        ) {
          copyData.phonenumber =
            dataArr[0].contactInformation.phoneNumberCountryCode +
            "-" +
            dataArr[0].contactInformation.phoneNumber;
        }
        if (
          dataArr[0].contactInformation.homePhoneNumberCountryCode !== undefined &&
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
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : dataArr[0].location.countryID !== undefined
              ? DropdownList.CountryList.find((x) => x.value.includes(dataArr[0].location.countryID))
                .value
              : dataArr[0].location.country !== undefined
                ? DropdownList.CountryList.find((x) => x.name.includes(dataArr[0].location.country))
                  .value
                : DropdownList.CountryList.find(
                  (element) =>
                    element.isoCode ===
                    Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
                ).value;
        copyData.birthdate = dataArr[0].birthDate;
        copyData.anniversarydate = dataArr[0].anniversaryDate;
        copyData.city = dataArr[0].location.city;
        copyData.address = dataArr[0].location.address;
        copyData.zipcode = dataArr[0].location.zipCode;

        copyData.documenttype =
          dataArr[0].documentType !== undefined ? dataArr[0].documentType : "";
        copyData.documentnumber =
          dataArr[0].documentType !== undefined
            ? dataArr[0].documentType.toLowerCase() === "passportnumber"
              ? dataArr[0].documentNumber
              : ""
            : "";
        copyData.socialsecuritynumber =
          dataArr[0].documentType !== undefined
            ? dataArr[0].documentType.toLowerCase() === "nationalidcard"
              ? dataArr[0].documentNumber
              : ""
            : "";
        // copyData.documentnumber = dataArr[0].documentNumber;
        copyData.expirydate =
          dataArr[0].passportExpirationDate !== undefined ? dataArr[0].passportExpirationDate : "";
        copyData.nationality =
          dataArr[0].nationalityCode !== undefined && dataArr[0].nationalityCode === ""
            ? DropdownList.CountryList.find(
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : DropdownList.CountryList.find((x) =>
              x.value.includes(dataArr[0].nationalityCode.toUpperCase())
            ).value;
        copyData.issueingcountry =
          dataArr[0].issuingCountryCode !== undefined && dataArr[0].issuingCountryCode === ""
            ? DropdownList.CountryList.find(
              (element) =>
                element.isoCode ===
                Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
            ).value
            : DropdownList.CountryList.find((x) =>
              x.value.includes(dataArr[0].issuingCountryCode.toUpperCase())
            ).value;
        copyData.milescard = dataArr[0].milesCard !== undefined ? dataArr[0].milesCard : "";
        copyData.milescardnumber =
          dataArr[0].milesCardNumber !== undefined ? dataArr[0].milesCardNumber : "";
        copyData.url = dataArr[0].documents !== undefined ? dataArr[0].documents[0].url : "";
        copyData.ischeckbalance = dataArr[0].checkBalance !== undefined ? dataArr[0].checkBalance : false;
        copyData.balance = dataArr[0].agentBalance !== undefined ? dataArr[0].agentBalance : 0;
        copyData.maxcreditlimit = dataArr[0].maxCreditLimit !== undefined && dataArr[0].maxCreditLimit > 0 ? dataArr[0].maxCreditLimit : 0;
        copyData.servicetaxregnumber = dataArr[0].serviceTaxRegNumber !== undefined ? dataArr[0].serviceTaxRegNumber : "";
        this.setState({
          data: copyData,
          isLoading: false,
          entityID: dataArr[0].entityID,
          userID: dataArr[0].userID,
          agentID: dataArr[0].agentID,
          customerID: dataArr[0].customerID,
          ismilescardholder: dataArr[0].milesCard && dataArr[0].milesCardNumber ? true : false,
        });
      }
    }
  };
  askForDelete = (data) => {
    this.setState({ showActionModal: true, traveler: data });
  };
  /**
   * Hide action dialog
   */
  hideActionDialog = () => {
    this.setState({ showActionModal: false });
  };
  /**
   * Delete Selected Co-Traveler using api
   */
  deleteCoTraveler = () => {
    this.hideActionDialog();

    const { traveler } = this.state;

    /**
     * Check for traveler object null value
     */
    if (traveler && traveler !== null) {
      var reqURL = "api/v1/cotraveler/delete";
      var reqOBJ = {
        Request: traveler,
      };

      apiRequester(
        reqURL,
        reqOBJ,
        async function (data) {
          await this.handleListResponse();
        }.bind(this)
      );
    }
  };

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    this.props.match.params.mode === "edit"
      ? this.state.isCustomerPage
        ? this.updateCustomer()
        : this.updateCoTraveler()
      : this.state.isCustomerPage
        ? this.addCustomer()
        : this.addCoTraveler();
  };
  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (this.state.isCustomerPage) {
      if (!this.validateFormData(data.email, "require"))
        errors.email = Trans("_error_email_require");
      else if (!this.validateFormData(data.email, "email"))
        errors.email = Trans("_error_email_email");
    }

    if (!this.validateFormData(data.firstname, "require"))
      errors.firstname = Trans("_error_firstname_require");
    else if (!this.validateFormData(data.firstname, "special-characters-not-allowed", /[<>]/))
      errors.firstname = "< and > characters not allowed";
    else if (!this.validateFormData(data.firstname, "length", { min: 2, max: 50 }))
      errors.firstname = Trans("_error_firstname_length");

    if (this.state.data.ischeckbalance) {

      if (!this.validateFormData(data.maxcreditlimit, "require"))
        errors.maxcreditlimit = Trans("_error_maxcreditlimit_require");
      else if (data.maxcreditlimit < 0)
        errors.maxcreditlimit = Trans("_error_maximumcredit_limit");
      else if (isNaN(data.maxcreditlimit))
        errors.maxcreditlimit = Trans("_error_maximumcredit_limit_numeric");
    }

    // if(Global.getEnvironmetKeyValue("portalType") === "B2B"){
    //   if (!this.validateFormData(data.servicetaxregnumber, "alpha_numeric"))
    //    errors.servicetaxregnumber = Trans("_error_servicetaxregnumber_alpha_space");
    // }

    //lastname
    if (!this.validateFormData(data.lastname, "require"))
      errors.lastname = Trans("_error_lastname_require");
    else if (!this.validateFormData(data.lastname, "special-characters-not-allowed", /[<>]/))
      errors.lastname = "< and > characters not allowed";
    else if (!this.validateFormData(data.lastname, "length", { min: 2, max: 50 }))
      errors.lastname = Trans("_error_lastname_length");

    if (!this.validateFormData(data.gender, "require"))
      errors.gender = Trans("_error_gender_require");

    //Phone number
    const tempmobilenumber = parsePhoneNumberFromString(data.phonenumber);

    if (Config.codebaseType !== undefined && Config.codebaseType === "tourwiz") {
      if (data.phonenumber.split('-').length === 2 && data.phonenumber.endsWith("-")) {
        //Do nothing
      }
      else {
        //do validation
        if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber"))
          errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
        else if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber_length", {
          min: 8,
          max: 14,
        })
        )
          errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");
      }
    }
    else {
      if (Config.codebaseType !== undefined && Config.codebaseType !== "tourwiz"
        && !this.validateFormData(data.phonenumber, "require_phoneNumber"))
        errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
      if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber"))
        errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
      else if (data.phonenumber && !this.validateFormData(data.phonenumber, "phonenumber_length", {
        min: 8,
        max: 14,
      })
      )
        errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");
      else if (Config.codebaseType !== undefined && Config.codebaseType !== "tourwiz"
        && !tempmobilenumber) errors.phonenumber = Trans("_error_mobilenumber_require");
    }
    // if (!this.validateFormData(data.birthdate, "require"))
    //   errors.birthdate = Trans("_error_birthDate_require");

    // if (!this.validateFormData(data.zipcode, "require"))
    //   errors.zipcode = Trans("_error_ZipCodeOrPostalCode_require");
    if (data.zipcode !== undefined && data.zipcode !== "") {
      if (!this.validateFormData(data.zipcode, "special-characters-not-allowed", /[<>]/))
        errors.zipcode = "< and > characters not allowed"
      else if (!this.validateFormData(data.zipcode, "length", { min: 4, max: 10 }))
        errors.zipcode = Trans("_error_ZipCodeOrPostalCode_length");
    }
    if (!this.validateFormData(data.city, "require")) errors.city = Trans("_error_city_require");
    else if (!this.validateFormData(data.city, "length", { min: 2, max: 50 }))
      errors.city = Trans("_error_city_length");
    else if (!this.validateFormData(data.city, "special-characters-not-allowed", /[<>]/))
      errors.city = "< and > characters not allowed";

    if (data.address && !this.validateFormData(data.address, "special-characters-not-allowed", /[<>]/))
      errors.address = "< and > characters not allowed";

    // if (!this.validateFormData(data.address, "require"))
    //   errors.address = Trans("_error_address_require");
    // else if (!this.validateFormData(data.address, "length", { min: 2, max: 50 }))
    //   errors.address = Trans("_error_address_length");

    if (this.state.isAssignedAirBusiness) {
      if (Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === null) {
        if (!this.validateFormData(data.nationality, "require"))
          errors.nationality = Trans("_error_nationality_require");

        if (!this.validateFormData(data.documenttype === false ? "" : data.documenttype, "require"))
          errors.documenttype = Trans("_error_documentType_require");

        if (data.documenttype !== false && data.documenttype.toLowerCase() === "passportnumber") {
          //documentNumber
          if (!this.validateFormData(data.documentnumber, "require"))
            errors.documentnumber = Trans("_error_documentNumber_require");
          else if (!this.validateFormData(data.documentnumber, "special-characters-not-allowed", /[<>]/))
            errors.documentnumber = "< and > characters not allowed";
          else if (
            !this.validateFormData(data.documentnumber, "length", {
              min: 5,
              max: 20,
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
              addMonth: 6,
            })
          )
            errors.passportExpirationDate = Trans("_error_passportExpirationDate_pastdate");
        } else if (
          data.documenttype !== false &&
          data.documenttype.toLowerCase() === "nationalidcard"
        ) {
          //socialsecuritynumber
          if (!this.validateFormData(data.socialsecuritynumber, "require"))
            errors.socialsecuritynumber = Trans("_error_socialSecurityNumber_require");
          else if (!this.validateFormData(data.socialsecuritynumber, "alpha_numeric"))
            errors.socialsecuritynumber = Trans("_error_socialSecurityNumber_alpha_numeric");
          else if (
            !this.validateFormData(data.socialsecuritynumber, "length", {
              min: 2,
              max: 20,
            })
          )
            errors.socialsecuritynumber = Trans("_error_socialSecurityNumber_length");
        }
        if (!this.validateFormData(data.issueingcountry, "require"))
          errors.issueingcountry = Trans("_error_issueingcountry_require");
      }

      if (this.state.ismilescardholder) {
        if (!this.validateFormData(data.milescard, "require"))
          errors.milescard = Trans("_error_milescard_require");
        else if (!this.validateFormData(data.milescard, "length", { min: 2, max: 20 }))
          errors.milescard = Trans("_error_milescard_length");
        else if (!this.validateFormData(data.milescard, "special-characters-not-allowed", /[<>]/))
          errors.milescard = "< and > characters not allowed";

        if (!this.validateFormData(data.milescardnumber, "require"))
          errors.milescardnumber = Trans("_error_milescardnumber_require");
        else if (
          !this.validateFormData(data.milescardnumber, "length", {
            min: 2,
            max: 20,
          })
        )
          errors.milescardnumber = Trans("_error_milescardnumber_length");
        else if (!this.validateFormData(data.milescardnumber, "special-characters-not-allowed", /[<>]/))
          errors.milescardnumber = "< and > characters not allowed";
      }

      if (data.gstnumber && !this.validateFormData(data.gstnumber, "alpha_numeric"))
        errors.gstnumber = Trans("Invalid GST Number");

      if (data.registrationnumber && !this.validateFormData(data.registrationnumber, "special-characters-not-allowed", /[<>]/))
        errors.registrationnumber = "< and > characters not allowed";

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

  goBack = async () => {
    dataArr = [];
    this.setState({
      messageBarText: "",
      messageBarType: "",
      showActionModal: false,
      ismilescardholder: false,
      data: {
        firstname: "",
        lastname: "",
        gender: "Male",
        phonenumber: "",
        alternetphonenumber: "",
        country: DropdownList.CountryList.find(
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
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
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
        ).value,
        issueingcountry: DropdownList.CountryList.find(
          (element) =>
            element.isoCode === Global.getEnvironmetKeyValue("PortalCountryCode").toUpperCase()
        ).value,
        milescard: "",
        milescardnumber: "",
        email: "",
        customerclass: "",
        branch: "",
        isUploadDocument: Global.getEnvironmetKeyValue("isUploadDocument"),
        rawData: "",
        url: "",
        ischeckbalance: false,
        balance: 0,
        maxcreditlimit: 0,
        servicetaxregnumber: "",
      },
    });
    if (this.state.isCustomerPage) {
      this.props.history.push("/Customer/list");
      await this.handleListResponse();
    } else {
      let customerType = this.props.match.url.split("/");
      customerType = this.props.match.params.mode === 'add' ? customerType[customerType.length - 2] : customerType[customerType.length - 1];
      let editcustomerType = this.props.location.pathname.split("/");
      editcustomerType = this.props.match.params.mode === 'edit' ? editcustomerType[editcustomerType.length - 1] : editcustomerType[editcustomerType.length - 2];
      if (this.props.match.params.mode === 'edit') {
        customerType = editcustomerType;
      }
      customerType.includes("corporate") ? this.props.history.push("/CoTraveller/list/" + customerType) : this.props.history.push("/CoTraveller/list");

      await this.handleListResponse();
    }
  };
  /*
   ** Call api for add new co-traveler
   */
  addCoTraveler() {
    //Validate form inputs

    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true,
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
      const tempPhoneNumber = parsePhoneNumberFromString(this.state.data.phonenumber);
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
      const tempHomePhoneNumber = parsePhoneNumberFromString(this.state.data.alternetphonenumber);
      changedHomePhoneNumber = tempHomePhoneNumber.nationalNumber;
      changedHomePhoneNumberCountryCode = "+" + tempHomePhoneNumber.countryCallingCode;
    }

    /* const tempPhoneNumber = parsePhoneNumberFromString(
        this.state.data.phonenumber
      ); */
    const mode = this.props.match.params.mode;
    let customerType = this.props.match.url.split("/");
    customerType = mode === 'add' ? customerType[customerType.length - 2] : customerType[customerType.length - 1];
    let editcustomerType = this.props.location.pathname.split("/");
    editcustomerType = mode === 'edit' ? editcustomerType[editcustomerType.length - 1] : editcustomerType[editcustomerType.length - 2];
    if (mode === 'edit') {
      customerType = editcustomerType;
    }

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
          country: CountryList.find((x) => x.value === this.state.data.country).name,
          city: this.state.data.city,
          address: this.state.data.address,
          zipCode: this.state.data.zipcode,
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,

          phoneNumber: changedPhoneNumber,
          phoneNumberCountryCode: changedPhoneNumberCountryCode,

          homePhoneNumber: changedHomePhoneNumber,
          homePhoneNumberCountryCode: changedHomePhoneNumberCountryCode,
        },
        birthDate: this.state.data.birthdate,
        milesCard: this.state.data.milescard,
        milesCardNumber: this.state.data.milescardnumber,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType:
          this.state.data.documenttype === undefined || this.state.data.documenttype === ""
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
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0],
        Documents: [
          {
            RawData: this.state.data.rawData,
            URL: this.state.data.url,
          },
        ],
        CheckBalance: this.state.data.ischeckbalance,
        MaxCreditLimit: this.state.data.maxcreditlimit,
        ServiceTaxRegNumber: this.state.data.servicetaxregnumber,
      },
      flags: {},
    };

    var reqURL = "api/v1/cotraveler/create";

    apiRequester(
      reqURL,
      reqOBJ,
      async function (data) {
        this.setState({
          isLoading: false,
        });

        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse();
          //this.props.history.push("/CoTraveller/list");
          const mode = this.props.match.params.mode;
          if (mode === "edit") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerUpdatedSuccessfully")
                : customerType.includes("corporate") ? "Employee Updated Successfully" : Trans("_coTravellerUpdatedSuccessfully")
            });
          }
          else if (mode === "add") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerAddedSuccessfully")
                : customerType.includes("corporate") ? "Employee Added Successfully" : Trans("_coTravellerAddedSuccessfully")
            });
          }
        } else {
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, data.status.message) });
        };
      }.bind(this)
    );
  }

  /*
   ** Call api for update co-traveler info
   */
  updateCoTraveler() {
    //Validate form inputs

    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true,
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
      this.state.data.phonenumber !== null &&
      this.state.data.phonenumber !== "undefined-undefined"
    ) {
      const tempPhoneNumber = parsePhoneNumberFromString(this.state.data.phonenumber);
      if (tempPhoneNumber) {
        changedPhoneNumber = tempPhoneNumber.nationalNumber;
        changedPhoneNumberCountryCode = "+" + tempPhoneNumber.countryCallingCode;
      }
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
      const tempHomePhoneNumber = parsePhoneNumberFromString(this.state.data.alternetphonenumber);
      if (tempHomePhoneNumber) {
        changedHomePhoneNumber = tempHomePhoneNumber.nationalNumber;
        changedHomePhoneNumberCountryCode = "+" + tempHomePhoneNumber.countryCallingCode;
      }
    }
    const mode = this.props.match.params.mode;
    let customerType = this.props.match.url.split("/");
    customerType = mode === 'add' ? customerType[customerType.length - 2] : customerType[customerType.length - 1];
    let editcustomerType = this.props.location.pathname.split("/");
    editcustomerType = mode === 'edit' ? editcustomerType[editcustomerType.length - 1] : editcustomerType[editcustomerType.length - 2];
    if (mode === 'edit') {
      customerType = editcustomerType;
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
          country: CountryList.find((x) => x.value === this.state.data.country).name,
          city: this.state.data.city,
          address: this.state.data.address,
          zipCode: this.state.data.zipcode,
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,
          phoneNumber: changedPhoneNumber,
          phoneNumberCountryCode: changedPhoneNumberCountryCode,

          homePhoneNumber: changedHomePhoneNumber,
          homePhoneNumberCountryCode: changedHomePhoneNumberCountryCode,
        },

        birthDate: this.state.data.birthdate,
        milesCard: this.state.data.milescard,
        milesCardNumber: this.state.data.milescardnumber,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType:
          this.state.data.documenttype === undefined || this.state.data.documenttype === ""
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
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0],
        Documents: [
          {
            RawData: this.state.data.rawData,
            URL: this.state.data.url,
          },
        ],
        checkBalance: this.state.data.ischeckbalance,
        maxCreditLimit: this.state.data.maxcreditlimit,
        serviceTaxRegNumber: this.state.data.servicetaxregnumber,
      },
      flags: {},
    };

    var reqURL = "api/v1/cotraveler/update";

    apiRequester(
      reqURL,
      reqOBJ,
      async function (data) {
        this.setState({
          isLoading: false,
        });

        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse();
          //this.props.history.push("/CoTraveller/list");
          const mode = this.props.match.params.mode;
          if (mode === "edit") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerUpdatedSuccessfully")
                : customerType.includes("corporate") ? "Employee Updated Successfully" : Trans("_coTravellerUpdatedSuccessfully")
            });
          }
          else if (mode === "add") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerAddedSuccessfully")
                : Trans("_coTravellerAddedSuccessfully")
            });
          }
        } else {
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, data.status.message) });
        };
      }.bind(this)
    );
  }

  /*
   ** Call api for add new co-traveler
   */
  addCustomer() {
    //Validate form inputs

    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true,
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
      const tempPhoneNumber = parsePhoneNumberFromString(this.state.data.phonenumber);
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
      const tempHomePhoneNumber = parsePhoneNumberFromString(this.state.data.alternetphonenumber);
      changedHomePhoneNumber = tempHomePhoneNumber.nationalNumber;
      changedHomePhoneNumberCountryCode = "+" + tempHomePhoneNumber.countryCallingCode;
    }

    /* const tempPhoneNumber = parsePhoneNumberFromString(
        this.state.data.phonenumber
      ); */
    var reqOBJ = {
      request: {
        userID: this.state.userID,
        agentID: this.state.agentID,
        customerClassID: this.state.data.customerclass,
        profilePicture: null,
        userDisplayName: this.state.data.firstname + " " + this.state.data.lastname,
        IsNewsLetterSubscription: false,
        IsActive: false,
        SupplierXML: null,
        LoginName: null,
        firstName: this.state.data.firstname,
        MiddleName: null,
        lastName: this.state.data.lastname,
        Password: null,
        Provider: null,
        DateFormatType: null,
        ProviderCurrency: null,
        OfficeID: null,
        RatePercentage: 0.0,
        DiscountChangePercentage: 0.0,
        CancelWaiveOffPercentage: 0.0,

        location: {
          Id: this.state.data.country.split("_")[0],
          CommonCode: null,
          CultureIrrelevantName: null,
          Name: null,
          countryID: this.state.data.country.split("_")[0],
          country: CountryList.find((x) => x.value === this.state.data.country).name,
          city: this.state.data.city,
          address: this.state.data.address,
          zipCode: this.state.data.zipcode,
          Yype: null,
          Latitude: 0.0,
          Longitude: 0.0,
          Priority: 0,
          State: "",
          District: "",
          Image: null,
          Flags: null,
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,

          Description: null,
          phoneNumber: changedPhoneNumber,
          phoneNumberCountryCode: changedPhoneNumberCountryCode,

          homePhoneNumber: changedHomePhoneNumber,
          homePhoneNumberCountryCode: changedHomePhoneNumberCountryCode,
          ActlFormatHomePhoneNumber: null,
          Fax: null,
          Email: this.state.data.email,
          WorkEmail: null,
        },
        birthDate: this.state.data.birthdate,
        milesCard: this.state.data.milescard,
        milesCardNumber: this.state.data.milescardnumber,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType:
          this.state.data.documenttype === undefined || this.state.data.documenttype === ""
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
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0],
        CardType: null,
        CardNumber: null,
        IsSelfSubscribed: false,
        GmtTimeDifference: 0,
        TimeZoneID: null,
        IsHeadOffice: false,
        IsEmployee: false,
        BusinessProviders: null,
        BookingMode: null,
        AgentBalance: this.state.data.balance !== 0 ? this.state.data.balance : 0.0,
        Crmid: null,
        CanSendEmail: false,
        Age: 0,
        Type: null,
        CompanyName: null,
        CustomLogoPath: null,
        CustomHomeURL: null,
        ParentCompanyName: null,
        defaultBranchID: this.state.data.branch,
        BookedOnBranch: null,
        SupportEmail: null,
        IsPortalAdmin: false,
        OpenIDs: null,
        AnniversaryDate: this.state.data.anniversarydate,
        IsCoPAX: false,
        SeqNo: 0,
        ProfilePercentage: 0,
        CreatedDate: "0001-01-01T00:00:00",
        LoginCount: 0,
        TotalBookingAmount: 0.0,
        Documents: [
          {
            RawData: this.state.data.rawData,
            URL: this.state.data.url,
          },
        ],
        CheckBalance: this.state.data.ischeckbalance,
        MaxCreditLimit: this.state.data.maxcreditlimit,
        ServiceTaxRegNumber: this.state.data.servicetaxregnumber,
      },
      Flags: {
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" ? true : false
      },
    };

    var reqURL = "api/v1/customer/create";

    apiRequester(
      reqURL,
      reqOBJ,
      async function (data) {
        this.setState({
          isLoading: false,
        });
        dataArr = [];
        if (data.status.code === 0) {
          await this.handleListResponse();
          //this.props.history.push("/CoTraveller/list");
          const mode = this.props.match.params.mode;
          if (mode === "edit") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerUpdatedSuccessfully")
                : Trans("_coTravellerUpdatedSuccessfully")
            });
          }
          else if (mode === "add") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerAddedSuccessfully")
                : Trans("_coTravellerAddedSuccessfully")
            });
          }
        } else {
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, data.status.message) });
        };
      }.bind(this)
    );
  }

  /*
   ** Call api for update co-traveler info
   */
  updateCustomer() {
    //Validate form inputs
    const { CountryList } = DropdownList;
    this.setState({
      isLoading: true,
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
      const tempPhoneNumber = parsePhoneNumberFromString(this.state.data.phonenumber);
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
      const tempHomePhoneNumber = parsePhoneNumberFromString(this.state.data.alternetphonenumber);
      changedHomePhoneNumber = tempHomePhoneNumber.nationalNumber;
      changedHomePhoneNumberCountryCode = "+" + tempHomePhoneNumber.countryCallingCode;
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
        customerClassID: this.state.data.customerclass,
        profilePicture: null,
        MemberNumber: this.state.data.membernumber,
        userDisplayName: this.state.data.firstname + " " + this.state.data.lastname,
        IsNewsLetterSubscription: false,
        IsActive: false,
        SupplierXML: null,
        LoginName: null,
        firstName: this.state.data.firstname,
        MiddleName: null,
        lastName: this.state.data.lastname,
        Password: null,
        Provider: null,
        DateFormatType: null,
        ProviderCurrency: null,
        OfficeID: null,
        RatePercentage: 0.0,
        DiscountChangePercentage: 0.0,
        CancelWaiveOffPercentage: 0.0,

        location: {
          Id: this.state.data.country.split("_")[0],
          CommonCode: null,
          CultureIrrelevantName: null,
          Name: null,
          countryID: this.state.data.country.split("_")[0],
          country: CountryList.find((x) => x.value === this.state.data.country).name,
          city: this.state.data.city,
          address: this.state.data.address,
          zipCode: this.state.data.zipcode,
          Yype: null,
          Latitude: 0.0,
          Longitude: 0.0,
          Priority: 0,
          State: "",
          District: "",
          Image: null,
          Flags: null,
        },
        contactInformation: {
          name: this.state.data.firstname + " " + this.state.data.lastname,

          Description: null,
          phoneNumber: changedPhoneNumber,
          phoneNumberCountryCode: changedPhoneNumberCountryCode,

          ActlFormatPhoneNumber: null,
          homePhoneNumber: changedHomePhoneNumber,
          homePhoneNumberCountryCode: changedHomePhoneNumberCountryCode,
          ActlFormatHomePhoneNumber: null,
          Fax: null,
          Email: this.state.data.email,
          WorkEmail: null,
        },
        birthDate: this.state.data.birthdate,
        milesCard: this.state.data.milescard,
        milesCardNumber: this.state.data.milescardnumber,
        anniversaryDate: this.state.data.anniversarydate,
        genderDesc: this.state.data.gender,
        gender: this.state.data.gender === "Male" ? "M" : "F",
        actlGender: this.state.data.gender === "Male" ? "19" : "20",
        documentType:
          this.state.data.documenttype === undefined || this.state.data.documenttype === ""
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
        issuingCountryCode: this.state.data.issueingcountry.split("_")[0],
        CardType: null,
        CardNumber: null,
        IsSelfSubscribed: false,
        GmtTimeDifference: 0,
        TimeZoneID: null,
        IsHeadOffice: false,
        IsEmployee: false,
        BusinessProviders: null,
        BookingMode: null,
        AgentBalance: this.state.data.balance !== 0 ? this.state.data.balance : 0.0,
        Crmid: null,
        CanSendEmail: false,
        Age: 0,
        Type: null,
        CompanyName: null,
        CustomLogoPath: null,
        CustomHomeURL: null,
        ParentCompanyName: null,
        CustomerCareEmail: null,
        defaultBranchID: this.state.data.branch,
        BookedOnBranch: null,
        SupportEmail: null,
        IsPortalAdmin: false,
        OpenIDs: null,
        AnniversaryDate: this.state.data.anniversarydate,
        IsCoPAX: false,
        SeqNo: 0,
        ProfilePercentage: 0,
        CreatedDate: "0001-01-01T00:00:00",
        LoginCount: 0,
        TotalBookingAmount: 0.0,
        Documents: [
          {
            RawData: this.state.data.rawData,
            URL: this.state.data.url,
          },
        ],
        CheckBalance: this.state.data.ischeckbalance,
        MaxCreditLimit: this.state.data.maxcreditlimit,
        ServiceTaxRegNumber: this.state.data.servicetaxregnumber,
      },
      Flags: {
        isCustomerMode: true,
      },
    };
    var reqURL = "api/v1/customer/update";

    apiRequester(
      reqURL,
      reqOBJ,
      async function (data) {
        this.setState({
          isLoading: false,
        });
        dataArr = [];
        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse();
          //this.props.history.push("/CoTraveller/list");

          const mode = this.props.match.params.mode;
          if (mode === "edit") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerUpdatedSuccessfully")
                : Trans("_coTravellerUpdatedSuccessfully")
            });
          }
          else if (mode === "add") {
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerAddedSuccessfully")
                : Trans("_coTravellerAddedSuccessfully")
            });
          }
        } else {
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, data.status.message) });
        };
      }.bind(this)
    );
  }
  getErrorMessage = (code, message) => {
    switch (Number(code)) {
      case 260029:
        return "Given Email is associated with another customer. Kindly enter another email."
      case 260031:
        return "Given mobile number is associated with another customer. Kindly enter another mobile number."
      default:
        return message;
    }
  }
  render() {
    const { CountryList, Gender } = DropdownList;
    const documentType =
      this.state.data.documenttype !== undefined && this.state.data.documenttype
        ? this.state.data.documenttype.toLowerCase()
        : "";
    let DocumentTypes = [{ name: Trans("_select"), value: "" }];
    let DocumentDetailsNonMandatoryInProfile = Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === "true" ? true : false;
    Global.getEnvironmetKeyValue("documentTypes").map((item) => {
      DocumentTypes.push({ name: item.description, value: item.name });
    });
    const { isLoading, coTravelerInfo, messageBarText, messageBarType } = this.state;

    let IsCustomerCheckBalanceEnabled = Global.getEnvironmetKeyValue("IsCustomerCheckBalanceEnabled", "cobrand") === "true" ? true : false;

    const mode = this.props.match.params.mode;
    let customerType = this.props.match.url.split("/");
    customerType = mode === 'add' ? customerType[customerType.length - 2] : customerType[customerType.length - 1];
    let editcustomerType = this.props.location.pathname.split("/");
    editcustomerType = mode === 'edit' ? editcustomerType[editcustomerType.length - 1] : editcustomerType[editcustomerType.length - 2];
    if (mode === 'edit') {
      customerType = editcustomerType;
    }
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsAnniverseryNotAllowed = Global.getEnvironmetKeyValue("IsAnniverseryNotAllowed", "cobrand") === "true" ? true : false;
    if ((mode === "add" || mode === "edit") && !AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-editcotraveller-customers")) {
      this.props.history.push('/');
    }
    return (
      <React.Fragment key={mode}>
        {mode === "add" || mode === "edit" ? (
          <div className="profile" key={mode}>
            <div className="title-bg pt-3 pb-3 mb-3">
              <Helmet>
                <title>
                  {mode === "edit"
                    ? this.state.isCustomerPage
                      ? Trans("_editCustomer")
                      : editcustomerType.includes("corporate") ? "Edit Employee" : Trans("_editCoTraveler")
                    : this.state.isCustomerPage
                      ? Trans("_addCustomer")
                      : customerType.includes("corporate") ? "Add Employee" : Trans("_addCoTraveler")}
                </title>
              </Helmet>
              <div className="container">
                <h1 className="text-white m-0 p-0 f30">
                  <SVGIcon
                    name="user-plus"
                    type="fill"
                    className="mr-3"
                    width="30"
                    height="30"
                  ></SVGIcon>
                  {mode === "edit"
                    ? this.state.isCustomerPage
                      ? Trans("_editCustomer")
                      : editcustomerType.includes("corporate") ? "Edit Employee" : Trans("_editCoTraveler")
                    : this.state.isCustomerPage
                      ? Trans("_addCustomer")
                      : customerType.includes("corporate") ? "Add Employee" : Trans("_addCoTraveler")}
                </h1>
              </div>
            </div>
            <div className="container">
              {this.state.showLoader ? (
                <Loader />
              ) : (
                <div className="contact-details border p-3 bg-white box-shadow mt-3">
                  {this.state.isCustomerPage && (
                    <div className="row">
                      <div className="col-lg-4 col-sm-12">
                        {this.renderInput(
                          "email",
                          Trans("_lblEmailWithStar"),
                          "text",
                          mode === "edit"
                        )}
                      </div>
                    </div>
                  )}
                  {(IsCustomerCheckBalanceEnabled && Global.getEnvironmetKeyValue("portalType") === "B2B") &&
                    <div className="row">
                      <div className="col-lg-2 col-sm-12">
                        <input
                          type="checkbox"
                          className="mr-2"
                          style={{ position: "relative" }}
                          id="chkcheckbalance"
                          checked={this.state.data.ischeckbalance}
                          onChange={() => this.checkbalance()}
                        />
                        <label
                          className=""
                          htmlFor="chkAgree"
                          onClick={() => this.checkbalance()}
                        >
                          {Trans("_label_allowcheckbal")}
                        </label>
                      </div>
                      <div className="col-lg-4 col-sm-12">

                        <b className="ml-3 pt-1 d-flex" title="Available balance">
                          <SVGIcon
                            name="money-bill-alt"
                            className="align-sub mr-3"
                            type="fill"
                            width="24"
                            height="34"
                          ></SVGIcon>
                          <label
                            className=""
                            htmlFor="lblbal"
                          >
                            {Trans("_currentBalance") + " : "}
                          </label>
                          <Amount amount={this.state.data.balance} currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol") ? Global.getEnvironmetKeyValue("portalCurrencySymbol") : "$"} />
                        </b>
                      </div>
                      <div className="col-lg-3 col-sm-12">
                        {this.renderInput("maxcreditlimit", Trans("_label_maxcreeditlimitwithstar"), "text", !this.state.data.ischeckbalance ? true : false)}
                      </div>
                      <div className="col-lg-3 col-sm-12">
                        {this.renderInput("servicetaxregnumber", Trans("_label_servicetaxregnumber"))}
                      </div>
                      <div className="col-lg-12 col-sm-12">
                        <label
                          className=""
                        >
                          {Trans("_note_maxcreditandbal").replace("##symbol##", Global.getEnvironmetKeyValue("portalCurrencySymbol"))}
                        </label>
                      </div>
                    </div>
                  }
                  <h5 className="text-primary mb-4 mt-4">
                    {Trans("_titlePersonalInformation") + " : "}
                  </h5>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12">
                      {this.renderSelect("gender", Trans("_lblGenderWithStar"), Gender)}
                    </div>
                    {!customerType.includes("corporate") &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("firstname", Trans("_lblFirstNameWithStar"))}
                        </div>

                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("lastname", Trans("_lblLastNameWithStar"))}
                        </div>
                      </React.Fragment>}
                    {customerType.includes("corporate") &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("firstname", "Employee First Name *")}
                        </div>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("lastname", "Employee Last Name *")}
                        </div>
                      </React.Fragment>
                    }
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12">
                      {this.renderBirthDate("birthdate", Trans("_lblBirthdate"))}
                    </div>
                    {!IsAnniverseryNotAllowed &&
                      <div className="col-lg-4 col-sm-12">
                        {this.renderBirthDate("anniversarydate", Trans("_lblAnniversarydate"))}
                      </div>
                    }
                    {this.state.isCustomerPage && (
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderSelect(
                            "customerclass",
                            Trans("_lblCusstomeClass"),
                            this.state.customerClassList,
                            "value",
                            "name"
                          )}
                        </div>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderSelect(
                            "branch",
                            Trans("_lblBranch"),
                            this.state.branchList,
                            "value",
                            "name"
                          )}
                        </div>
                      </React.Fragment>
                    )}
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
                      {this.renderSelect("country", Trans("_lblCountryWithStar"), CountryList)}
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
                      {this.renderInput("zipcode", Trans("_lblZipCodeOrPostalCode"))}
                    </div>
                  </div>
                  {this.state.isAssignedAirBusiness && (
                    <React.Fragment>
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
                              {this.renderInput("documentnumber",
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
                        <div className="col-lg-4 col-sm-12">
                          {this.renderSelect("nationality", Trans("_lblNationality"), CountryList)}
                        </div>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderSelect(
                            "issueingcountry",
                            Trans("_lblIssuingCountry"),
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

                            {this.state.data.url !== undefined && this.state.data.url !== "" && (
                              <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-success mt-n4 mb-0 p-1 d-inline-block">
                                  {Trans("_uploadedFile") + " : " + this.state.data.url}
                                </small>
                              </div>
                            )}
                            {this.state.uploadDocValidationImage && (
                              <small className="alert alert-danger p-1 mt-1 d-inline-block">
                                {this.state.uploadDocValidationImage}
                              </small>
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
                      {!this.state.isMilesCardNotAllowed && this.state.ismilescardholder && (
                        <div className="row">
                          <div className="col-lg-4 col-sm-12">
                            {this.renderSelect(
                              "milescard",
                              Trans("_lblMilesCard"),
                              this.state.milescardList,
                              "value",
                              "name"
                            )}
                          </div>
                          <div className="col-lg-4 col-sm-12">
                            {this.renderInput("milescardnumber", Trans("_lblMilesCardNumber"))}
                          </div>
                        </div>
                      )}
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

              {this.state.showActionModal && mode === "edit" ? (
                <div className="col-centered mb-5 ml-5">
                  <ActionModal
                    title={
                      this.state.isCustomerPage ? Trans("_myCustomers") : Trans("_myCoTravelers")
                    }
                    message={
                      this.state.isCustomerPage
                        ? Trans("_customerUpdatedSuccessfully")
                        : Trans("_coTravellerUpdatedSuccessfully")
                    }
                    positiveButtonText={Trans("_ok")}
                    onPositiveButton={this.goBack}
                    handleHide={this.goBack}
                  />{" "}
                </div>
              ) : this.state.showActionModal && mode === "add" ? (
                <div className="col-centered mb-5 ml-5">
                  <ActionModal
                    title={
                      this.state.isCustomerPage ? Trans("_myCustomers") : Trans("_myCoTravelers")
                    }
                    message={
                      this.state.isCustomerPage
                        ? Trans("_customerAddedSuccessfully")
                        : Trans("_coTravellerAddedSuccessfully")
                    }
                    positiveButtonText={Trans("_ok")}
                    onPositiveButton={this.goBack}
                    handleHide={this.goBack}
                  />{" "}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="profile" key={mode}>
            <div className="title-bg pt-3 pb-3 mb-3">
              <Helmet>
                <title>
                  {this.state.isCustomerPage ? Trans("_myCustomers") :
                    customerType.includes("corporate") ? "My Employee(s)" : Trans("_myCoTravelers")
                  }
                </title>
              </Helmet>
              <div className="container">
                <div className="row">
                  <div className="col-lg-9">
                    <h1 className="text-white m-0 p-0 f30">
                      <SVGIcon
                        name="users"
                        width="30"
                        type="fill"
                        height="30"
                        className="mr-3"
                      ></SVGIcon>
                      {this.state.isCustomerPage ? Trans("_myCustomers") :
                        customerType.includes("corporate") ? "My Employee(s)" : Trans("_myCoTravelers")
                      }
                    </h1>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-end">
                    <span className="pull-right">
                      <AuthorizeComponent title="CoTraveller-list~Customer-addcotraveller-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                        {customerType.includes("corporate") ? <button
                          className="btn btn-primary"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-addcotraveller-customers") ?
                            this.state.isCustomerPage
                              ? this.props.history.push("/Customer/add")
                              : this.props.history.push("/CoTraveller/add/" + customerType + "/")
                            : this.setState({ isshowauthorizepopup: true })
                          }
                        >
                          {this.state.isCustomerPage ? Trans("_addCustomer") : "Add Employee"}
                        </button>
                          : <button
                            className="btn btn-primary"
                            onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "CoTraveller-list~Customer-addcotraveller-customers") ?
                              this.state.isCustomerPage
                                ? this.props.history.push("/Customer/add")
                                : this.props.history.push("/CoTraveller/add")
                              : this.setState({ isshowauthorizepopup: true })
                            }
                          >
                            {this.state.isCustomerPage ? Trans("_addCustomer") : Trans("_addCoTraveler")}
                          </button>}
                      </AuthorizeComponent>
                      {(!this.state.isCustomerPage &&
                        Global.getEnvironmetKeyValue("portalType") !== "B2C" &&
                        Global.getEnvironmetKeyValue("EnableCoTravelerForB2BPortal", "cobrand") !== null)
                        ?
                        <button
                          className="btn btn-primary ml-2"
                          onClick={() =>
                            this.state.isCustomerPage
                              ? this.props.history.push("/")
                              : this.props.history.push("/Customer/list")
                          }
                        >
                          Back
                        </button> : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              {!isLoading ? (
                <React.Fragment>
                  {isPersonateEnabled && this.state.isCustomerPage && (
                    <div className="mt-2 mb-3">
                      <CallCenter />
                    </div>
                  )}
                  <div className="border bg-white shadow-sm ">
                    <div className="p-2 mt-3">
                      <h6 className="ml-3 mr-3 mb-2 text-muted">
                        {this.state.isCustomerPage
                          ? Trans("_myCustomerNote")
                          : Trans("_myCoTravellerNote")}
                      </h6>
                    </div>
                    <ul className="list-unstyled row p-4">
                      <CoTravelerList
                        items={coTravelerInfo}
                        onEdit={this.editCoTraveler}
                        onDelete={this.askForDelete}
                        isCustomerPage={this.state.isCustomerPage}
                        userInfo={this.props.userInfo}
                        history={this.props.history}
                        parentId={this.props.match.params.id}
                        customerType={customerType}
                      />
                    </ul>
                    <div className="col-centered mb-5 ml-5"></div>
                  </div>
                </React.Fragment>
              ) : (
                <Loader />
              )}
              {this.state.showActionModal && mode !== "list" ? (
                <div className="col-centered mb-5 ml-5">
                  <ActionModal
                    title={
                      this.state.isCustomerPage ? Trans("_myCustomers") : Trans("_myCoTravelers")
                    }
                    message={
                      this.state.isCustomerPage
                        ? Trans("_myCustomers")
                        : Trans("_coTravellerUpdatedSuccessfully")
                    }
                    positiveButtonText={Trans("_ok")}
                    onPositiveButton={this.goBack}
                    handleHide={this.goBack}
                  />{" "}
                </div>
              ) : this.state.showActionModal ? (
                <div className="col-centered mb-5 ml-5">
                  <ActionModal
                    title={Trans("_alert")}
                    message={
                      this.state.isCustomerPage
                        ? Trans("_customerConfirmationOnDelete")
                        : customerType.includes("corporate") ? "Are you sure you want to delete this employee?" : Trans("_coTravellertConfirmationOnDelete")
                    }
                    positiveButtonText={Trans("_yes")}
                    negativeButtonText={Trans("_no")}
                    onPositiveButton={this.deleteCoTraveler}
                    onNegativeButton={this.hideActionDialog}
                    handleHide={this.hideActionDialog}
                  />{" "}
                </div>
              ) : null}
            </div>
            {this.state.isshowauthorizepopup &&
              <ModelPopupAuthorize
                header={""}
                content={""}
                handleHide={this.hideauthorizepopup}
                history={this.props.history}
              />
            }
          </div>
        )}
        {messageBarText && messageBarType &&
          <MessageBar type={messageBarType} Message={messageBarText} handleClose={() => messageBarType === "success" ? this.goBack() : this.setState({ messageBarText: "", messageBarType: "" })} />
        }
      </React.Fragment>
    );
  }
}

export default CoTravelers;
