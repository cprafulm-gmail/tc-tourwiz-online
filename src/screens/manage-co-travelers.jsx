import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import CoTravelerList from "../components/view/view-cotraveler-list";
import Loader from "../components/common/loader";
import ActionModal from "../helpers/action-modal";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import Form from "../components/common/form";
import * as DropdownList from "../helpers/dropdown-list";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import FileBase64 from "../components/common/FileBase64";
import * as Global from "../helpers/global";
import Amount from "../helpers/amount";
import XLSX from "xlsx";
import DateComp from "../helpers/date";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import MessageBar from '../components/admin/message-bar';
import * as GlobalEvents from "../helpers/global-events";
import ModelLimitExceeded from "../helpers/modelforlimitexceeded";
import { Helmet } from "react-helmet";

let dataArr = [];

class ManageCoTravelers extends Form {
  constructor(props) {
    super(props);
    let AirBusiness = false;
    Global.getEnvironmetKeyValue("availableBusinesses") !== undefined &&
      Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
        if (item.name === "air") AirBusiness = true;
      });
    this.state = {
      pageNumber: 1,
      pageLength: 20,
      isLoading: this.props.match.params.mode === "Edit",
      isLoadingExport: false,
      isLoadingViewCotraveler: false,
      ViewCotravelerId: 0,
      coTravelerInfo: [],
      showActionModal: false,
      isCustomerPage: props.location.pathname.toLowerCase().includes("/customer/"),
      traveler: null,
      isAssignedAirBusiness: AirBusiness,
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
        servicetaxregnumber: "",
        filter_name: "",
        filter_email: "",
        filter_phone: "",
        filter_customerType: "",
        gstnumber: "",
        registrationnumber: "",
        panNumber: "",
        customerType: "individual",
      },
      entityID: "",
      userID: "",
      agentID: "",
      customerID: "",
      showLoader: this.props.match.params.mode === "Edit",
      errors: {},
      totalResults: 0,
      gstnumbercheckbox: true,
      taxationinfocheckbox: false,
      isshowauthorizepopup: false,
      isTourwiz: true,
      messageBarText: "",
      messageBarType: "",
      customerType: 'individual',
      isSubscriptionPlanend: false,
      isShowCheckAccessPopup: false,
      isShowPopupContent: ""
    };
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  handleHidePopup = () => {
    this.setState({
      isShowCheckAccessPopup: !this.state.isShowCheckAccessPopup,
      isDeleteCustomer: false,
      isDeleteCustomerID: this.state.traveler.customerID,
    });
  };
  hidelimitpopup = () => {
    this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
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

  getBranchLookup = () => {
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
  getMilesCardLookup = async () => {
    this.setState({
      showLoader: true,
    });
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
  getCoTravelers = async (mode) => {
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
          Data: {
            Name: this.state.data.filter_name,
            phoneNumber: this.state.data.filter_phone,
            email: this.state.data.filter_email,
            customerType: this.state.data.filter_customerType,
          },
          PageInfoIndex: [
            {
              Type: "default",
              Item: {
                PageLength: this.state.pageLength,
                CurrentPage: mode && mode === "paging" ? this.state.pageNumber + 1 : this.state.pageNumber,
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

  async componentDidMount() {
    if (this.props.match.params.mode !== "Edit") {
      await this.handleListResponse('get-lookup');
      if (this.props.match.params.id !== undefined) {
        if (this.state.isCustomerPage) this.editCoTraveler(this.props.match.params.id);
      }
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
  handleListResponse = async (mode) => {
    var data = await this.getCoTravelers(mode);
    let coTraveler = mode && mode === "paging" ? this.state.coTravelerInfo.concat(data.response.data) : data.response.data;
    data.response !== undefined
      ? this.setState({
        showLoader: false,
        isLoading: false,
        coTravelerInfo: coTraveler,
        traveler: null,
        pageNumber: mode && mode === "paging" ? this.state.pageNumber + 1 : this.state.pageNumber,
        totalResults: data.response.pageInfo.totalResults
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

        copyData.phonenumber =
          dataArr[0].contactInformation.phoneNumberCountryCode +
          "-" +
          dataArr[0].contactInformation.phoneNumber;
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
        copyData.gstnumber = dataArr[0].gstNumber !== undefined ? dataArr[0].gstNumber : "";
        copyData.registrationnumber = dataArr[0].registrationNumber !== undefined ? dataArr[0].registrationNumber : "";
        copyData.panNumber = dataArr[0].panNumber !== undefined ? dataArr[0].panNumber : "";
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
  handleFilter = (field, value) => {
    let data = this.state.data;
    if (field === 'name') {
      data.filter_name = value;
    }
    if (field === 'phone') {
      data.filter_phone = value;
    }
    if (field === 'email') {
      data.filter_email = value;
    }
    if (field === 'customerType') {
      data.filter_customerType = value;
    }
    this.setState({ data });
  }
  editCoTraveler = (coTravelerId) => {
    if (this.state.isCustomerPage) {
      this.props.history.push("/Customer/edit/" + coTravelerId);
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
            customerType: data.response.customerType
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

              copyData.phonenumber =
                dataArr[0].contactInformation.phoneNumberCountryCode +
                "-" +
                dataArr[0].contactInformation.phoneNumber;
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
              if (copyData.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")))
                copyData.email = "";
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
              copyData.gstnumber = dataArr[0].gstNumber !== undefined ? dataArr[0].gstNumber : "";
              copyData.panNumber = dataArr[0].panNumber !== undefined ? dataArr[0].panNumber : "";
              copyData.registrationnumber = dataArr[0].registrationNumber !== undefined ? dataArr[0].registrationNumber : "";
              let selectionoftaxationinfo;
              if (dataArr[0].gstnumber && dataArr[0].gstnumber !== "") {
                selectionoftaxationinfo = true;
              }
              else if (dataArr[0].registrationNumber && dataArr[0].registrationNumber !== "") {
                selectionoftaxationinfo = false;
              }
              else {
                selectionoftaxationinfo = true;
              }
              this.setState({
                data: copyData,
                isLoading: false,
                entityID: dataArr[0].entityID,
                userID: dataArr[0].userID,
                agentID: dataArr[0].agentID,
                customerID: dataArr[0].customerID,
                ismilescardholder:
                  dataArr[0].milesCard && dataArr[0].milesCardNumber ? true : false,
                gstnumbercheckbox: selectionoftaxationinfo,
                taxationinfocheckbox: dataArr[0].registrationNumber !== undefined && dataArr[0].registrationNumber !== "" ? true : false,
              });
            }
          }
        }.bind(this)
      );
    } else {
      this.props.history.push("/CoTraveller/edit/" + coTravelerId);
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

        copyData.phonenumber =
          dataArr[0].contactInformation.phoneNumberCountryCode +
          "-" +
          dataArr[0].contactInformation.phoneNumber;
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
        copyData.gstnumber = dataArr[0].gstNumber !== undefined ? dataArr[0].gstNumber : "";
        copyData.panNumber = dataArr[0].panNumber !== undefined ? dataArr[0].panNumber : "";
        copyData.registrationnumber = dataArr[0].registrationNumber !== undefined ? dataArr[0].registrationNumber : "";
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
  viewcotraveler = (email, ViewCotravelerId, customerType) => {
    if (customerType === 'corporate' && !AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~employee-view-employee")) {
      this.setState({ isshowauthorizepopup: true });
      return false
    }
    this.setpersonate(email, ViewCotravelerId, function () {
      this.props.history.push("/CoTraveller/list/" + customerType + "-" + ViewCotravelerId);
    }.bind(this));
  }

  setpersonate = (email, ViewCotravelerId, callback) => {
    this.setState({ isLoadingViewCotraveler: true, ViewCotravelerId: ViewCotravelerId });
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    let reqOBJ = {
      Request: email,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.setItem("personateId", data.response);
        sessionStorage.setItem("callCenterType", data.userDetail.type);
        sessionStorage.setItem("bookingForInfo", JSON.stringify(data.userDetail.details));
        sessionStorage.setItem("bookingFor", data.userDetail.details.firstName);
        callback();
      }.bind(this)
    );
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
  deleteCoTraveler = async () => {
    this.hideActionDialog();
    const { traveler } = this.state;
    this.setState({ isDeleteCustomer: true, isCustomerID: traveler.customerID });
    /**
     * Check for traveler object null value
     */
    var noOfdep = await this.checkCustomerDependency(traveler.customerID);
    if (noOfdep.status === false) {
      this.setState({
        isCustomerID: traveler.customerID,
        isDeleteCustomer: false,
        isShowCheckAccessPopup: true,
        isShowPopupContent: traveler.userDisplayName +
          " (" + traveler?.contactInformation?.phoneNumberCountryCode + "-" + traveler?.contactInformation?.phoneNumber + ") "
          + "cannot be deleted because there are dependent data that still exist."
      })
    }
    else {
      const { traveler } = this.state;
      var reqURL = "api/v1/cotraveler/delete";
      var reqOBJ = {
        Request: traveler,
      };
      this.setState({ pageNumber: 1, isDeleteCustomer: true, isCustomerID: traveler.customerID });
      apiRequester(
        reqURL,
        reqOBJ,
        async function (data) {
          await this.handleListResponse('delete');
        }.bind(this)
      );
    }
  };

  checkCustomerDependency = async (customerID) => {
    var reqURL = "reconciliation/customer/validate";
    var reqOBJ = {
      Request: {
        "customerID": customerID
      },
    };
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
        }.bind(this),
        "POST"
      );
    });
  }
  CheckforAccessQuota = async () => {
    let reqURL = "user/checkaccessquota?type=Customer"
    let reqOBJ = {}
    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.code && data.code === 101) {
            this.setState({ isSubscriptionPlanend: !this.state.isSubscriptionPlanend });
          }
          else if (data.response) {
            resolve();
          }
        }.bind(this),
        "GET"
      );
    });
  }

  handleSubmit = async () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    //TODO:
    if (this.props.match.params.mode === "edit") {
      if (this.state.isCustomerPage) {
        this.updateCustomer()
      }
      else {
        this.updateCoTraveler()
      }
    }
    else {
      if (this.state.isCustomerPage) {
        await this.CheckforAccessQuota();
        this.addCustomer();
      }
      else
        this.addCoTraveler();
    }
  };
  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.state.isTourwiz && this.state.isCustomerPage) {
      if (!this.validateFormData(data.email, "require"))
        errors.email = Trans("_error_email_require");
      else if (data.email && !this.validateFormData(data.email, "email"))
        errors.email = Trans("_error_email_email");
    }
    if (data.email && !this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    if (!this.validateFormData(data.firstname, "require")) {
      if (data.customerType !== "corporate") {
        errors.firstname = Trans("_error_firstname_require");
      }
      else
        errors.firstname = Trans("Corporate Name required");
    }
    else if (!this.validateFormData(data.firstname, "special-characters-not-allowed", /[<>]/)) {
      if (data.customerType !== "corporate") {
        errors.firstname = "< and > characters not allowed";
      }
      else
        errors.firstname = "< and > characters not allowed";
    }
    // else if (!this.validateFormData(data.firstname, "length", { min: 2, max: 50 }))
    //   errors.firstname = Trans("_error_firstname_length");

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
    if (data.customerType !== "corporate" && this.state.customerType !== 'corporate') {
      if (!this.validateFormData(data.lastname, "require"))
        errors.lastname = Trans("_error_lastname_require");
      else if (!this.validateFormData(data.lastname, "special-characters-not-allowed", /[<>]/))
        errors.lastname = "< and > characters not allowed";
      else if (!this.validateFormData(data.lastname, "length", { min: 2, max: 50 }))
        errors.lastname = Trans("_error_lastname_length");
    }


    if (!this.validateFormData(data.gender, "require"))
      errors.gender = Trans("_error_gender_require");

    //Phone number
    const tempmobilenumber = parsePhoneNumberFromString(data.phonenumber);
    if (!this.validateFormData(data.phonenumber, "require_phoneNumber"))
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    else if (!this.validateFormData(data.phonenumber, "phonenumber"))
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber");
    else if (
      !this.validateFormData(data.phonenumber, "phonenumber_length", {
        min: 8,
        max: 14,
      })
    )
      errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");
    else if (!tempmobilenumber) errors.phonenumber = Trans("_error_mobilenumber_require");

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

    // if (!this.validateFormData(data.address, "require"))
    //   errors.address = Trans("_error_address_require");
    // else if (!this.validateFormData(data.address, "length", { min: 2, max: 50 }))
    //   errors.address = Trans("_error_address_length");

    if (data.address && !this.validateFormData(data.address, "special-characters-not-allowed", /[<>]/))
      errors.address = "< and > characters not allowed";

    if (this.state.isAssignedAirBusiness) {
      //if (Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === null)
      {


        if (Global.getEnvironmetKeyValue("DocumentDetailsNonMandatoryInProfile", "cobrand") === null) {

          if (!this.validateFormData(data.issueingcountry, "require"))
            errors.issueingcountry = Trans("_error_issueingcountry_require");

          if (!this.validateFormData(data.nationality, "require"))
            errors.nationality = Trans("_error_nationality_require");

          if (!this.validateFormData(data.documenttype === false ? "" : data.documenttype, "require"))
            errors.documenttype = Trans("_error_documentType_require");
        }
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
            errors.expirydate = Trans("_error_passportExpirationDate_pastdate");
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
      if (Global.getEnvironmetKeyValue("PortalCountryCode") === "IN"
        && data.panNumber && !this.validateFormData(data.panNumber, "alpha_numeric"))
        errors.panNumber = Trans("Invalid PAN Number");

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

  goBack = () => {
    dataArr = [];
    this.setState({
      pageNumber: 1,
      showActionModal: false,
      ismilescardholder: false,
      totalResults: 0,
      messageBarText: "",
      messageBarType: "",
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
        gstnumber: "",
        registrationnumber: "",
        panNumber: "",
      },
    }, async () => {
      if (this.state.isCustomerPage) {
        this.props.history.push("/Customer/list");
        await this.handleListResponse('go-back');
      } else {
        this.props.history.push("/CoTraveller/list");
        await this.handleListResponse('go-back');
      }
    });
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
          this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "nationalidcard"
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
        ServiceTaxRegNumber: this.state.taxationinfocheckbox ? this.state.data.servicetaxregnumber : "",
        gstnumber: this.state.gstnumbercheckbox ? this.state.data.gstnumber : "",
        registrationnumber: this.state.data.registrationNumber,
        panNumber: this.state.data.panNumber,
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
          pageNumber: 1,
        });

        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse('create');

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
          this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "nationalidcard"
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
        serviceTaxRegNumber: this.state.taxationinfocheckbox ? this.state.data.servicetaxregnumber : "",
        gstnumber: this.state.gstnumbercheckbox ? this.state.data.gstnumber : "",
        registrationnumber: this.state.data.registrationnumber,
        panNumber: this.state.data.panNumber,
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
          pageNumber: 1,
        });

        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse('update');

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
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, 'Oops! Something Went Wrong - There may be an issue with your input data. Please try again or visit our help center if you need a hand.') });
        }
      }.bind(this)
    );
  }

  /*
   ** Call api for add new co-traveler
   */
  addCustomer = async () => {
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
    let email = this.state.data.email;
    if (this.state.data.email === "") {
      email = changedPhoneNumberCountryCode + "-" + changedPhoneNumber + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@");
    }
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
          Email: email,
          WorkEmail: null,
        },
        CustomerType: this.state.data.customerType,
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
          this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "nationalidcard"
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
        ServiceTaxRegNumber: this.state.taxationinfocheckbox ? this.state.data.servicetaxregnumber : "",
        gstnumber: this.state.gstnumbercheckbox ? this.state.data.gstnumber : "",
        registrationnumber: this.state.data.registrationnumber,
        panNumber: this.state.data.panNumber,
      },
      flags: {
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" ? true : false
      }
    };

    var reqURL = "api/v1/customer/create";

    let quotaUsage = localStorage.getItem("quotaUsage");
    quotaUsage = JSON.parse(quotaUsage);
    let quota = Global.LimitationQuota["Customer-list~customer-add-customers"];

    apiRequester(
      reqURL,
      reqOBJ,
      async function (data) {
        this.setState({
          isLoading: false,
          pageNumber: 1,
        });
        dataArr = [];
        if (data.status.code === 0) {
          await this.handleListResponse('create');
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
            if (quotaUsage["totalUsed" + quota] === null)
              quotaUsage["totalUsed" + quota] = 1;
            else
              quotaUsage["totalUsed" + quota] = quotaUsage["totalUsed" + quota] + 1;
            localStorage.setItem("quotaUsage", JSON.stringify(quotaUsage));
            this.setState({
              messageBarType: "success",
              messageBarText: this.state.isCustomerPage
                ? Trans("_customerAddedSuccessfully")
                : Trans("_coTravellerAddedSuccessfully")
            });
          }
        } else {
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, 'Oops! Something Went Wrong - There may be an issue with your input data. Please try again or visit our help center if you need a hand.') });
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
    let email = this.state.data.email;
    if (this.state.data.email === "") {
      email = changedPhoneNumberCountryCode + "-" + changedPhoneNumber + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@");
    };
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
          Email: email,
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
          this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "passportnumber"
            ? this.state.data.documentnumber
            : this.state.data.documenttype && this.state.data.documenttype.toLowerCase() === "nationalidcard"
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
        ServiceTaxRegNumber: this.state.taxationinfocheckbox ? this.state.data.servicetaxregnumber : "",
        gstnumber: this.state.gstnumbercheckbox ? this.state.data.gstnumber : "",
        registrationnumber: this.state.data.registrationnumber,
        panNumber: this.state.data.panNumber,
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
          pageNumber: 1,
        });
        dataArr = [];
        if (data.response !== undefined && data.status.code === 0) {
          await this.handleListResponse('update');
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
          this.setState({ messageBarType: "error", messageBarText: this.getErrorMessage(data.status.code, 'Oops! Something Went Wrong - There may be an issue with your input data. Please try again or visit our help center if you need a hand.') });
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
  exportCustomers = () => {
    this.setState({ isLoadingExport: true });

    var reqOBJ = {};
    var reqURL = "tw/export/customer";
    apiRequester_unified_api(reqURL, reqOBJ, (data) => {

      let customers = data.response.customers;
      let exportData = customers.map(item => {
        return {
          "MemberNo": item.memberNo,
          "First Name": item.firstName,
          "Last Name": item.lastName,
          "Gender": item.gender,
          "Birth Date": item.birthDate ? DateComp({ date: item.birthDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
          "Address": item.address,
          "City": item.city,
          "Country": item.countryCode && item.countryCode !== "" ? DropdownList.CountryList.filter(
            element =>
              element.isoCode.toLowerCase() === item.countryCode.toLowerCase()
          )[0]?.name : "",
          "ZipCode": item.zipCode,
          "Phone Number": item.phoneNumber === "+91-" || item.phoneNumber === "91-" || item.phoneNumber === "-" ? "" : (!item.phoneNumber.startsWith('+') ? "+" : "") + item.phoneNumber,

          "Nationality": item.nationalityCode && item.nationalityCode !== "" ? DropdownList.CountryList.filter(
            element =>
              element.isoCode.toLowerCase() === item.nationalityCode.toLowerCase()
          )[0]?.name : "",
          "Email": item.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")) ? '' : item.email,
          "Passport Number": item.passportNumber,
          "Passport Expiration Date": item.passportExpirationDate ? DateComp({ date: item.passportExpirationDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : "",
          "Passport Issueing Country": item.issueCountryCode && item.issueCountryCode !== "" ? DropdownList.CountryList.filter(
            element =>
              element.isoCode.toLowerCase() === item.issueCountryCode.toLowerCase()
          )[0]?.name : "",
          "PAN Number": item.panNumber,
        }
      });
      if (exportData.length === 0) {
        exportData = [{
          "MemberNo": "No records found.",
          "First Name": "",
          "Last Name": "",
          "Gender": "",
          "Birth Date": "",
          "Address": "",
          "City": "",
          "Country": "",
          "ZipCode": "",
          "Phone Number": "",
          "Nationality": "",
          "Email": "",
          "Passport Number": "",
          "Passport Expiration Date": "",
          "Passport Issueing Country": "",
          "PAN Number": ""
        }];
      }
      const workbook1 = XLSX.utils.json_to_sheet(exportData);
      workbook1['!cols'] = [
        { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 80 }, { wpx: 100 },
        { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 75 }, { wpx: 120 },
        { wpx: 100 }, { wpx: 200 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 },
        { wpx: 150 }
      ];
      const workbook = {
        SheetNames: ['Customers'],
        Sheets: {
          'Customers': workbook1
        }
      };

      this.setState({ isLoadingExport: false });

      return XLSX.writeFile(workbook, `Customers.xlsx`);

    }, 'GET');
  }

  handletaxationcheckbox = (e) => {
    let target = e.target;
    if (target.name === "gstnumber") {
      if (target.checked === true) {
        let statedata = this.state.data;
        //statedata.registrationnumber = "";
        this.setState({
          data: statedata,
          gstnumbercheckbox: true,
          taxationinfocheckbox: false,
        });
      } else {
        let statedata = this.state.data;
        //statedata.gstnumber = "";
        this.setState({
          data: statedata,
          gstnumbercheckbox: false,
          taxationinfocheckbox: true,
        });
      }
    }
  };
  changeCustomerType = (Type) => {
    let newData = { ...this.state.data };
    newData.customerType = Type;
    if (Type === "corporate" && AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "inquiries~create-inquiry-corporate")) {
      // if (Type === 'Corporate' && false) {
      this.setState({ data: newData, customerType: Type });
    }
    else if (Type === "individual") {
      this.setState({ data: newData, customerType: Type });
    }
    else {
      this.setState({ isshowauthorizepopup: true })
    }
  };
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
    const { isLoading, coTravelerInfo, isLoadingExport, isLoadingViewCotraveler, ViewCotravelerId, messageBarText, messageBarType } = this.state;

    let IsCustomerCheckBalanceEnabled = Global.getEnvironmetKeyValue("IsCustomerCheckBalanceEnabled", "cobrand") === "true" ? true : false;

    const mode = this.props.match.params.mode;
    let isPersonateEnabled = Global.getEnvironmetKeyValue("isPersonateEnabled");
    let IsCustomerClassNotAllowed = Global.getEnvironmetKeyValue("IsCustomerClassNotAllowed", "cobrand") === "true" ? true : false;
    let IsAnniverseryNotAllowed = Global.getEnvironmetKeyValue("IsAnniverseryNotAllowed", "cobrand") === "true" ? true : false;
    // if ((mode === "add" || mode === "edit") && !AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~customer-edit-customers")) {
    //   this.props.history.push('/');
    // }
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
                      : Trans("_editCoTraveler")
                    : this.state.isCustomerPage
                      ? Trans("_addCustomer")
                      : Trans("_addCoTraveler")}
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
                      : Trans("_editCoTraveler")
                    : this.state.isCustomerPage
                      ? Trans("_addCustomer")
                      : Trans("_addCoTraveler")}
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
                      {mode !== "edit" &&
                        <div className="col-lg-4 col-sm-12">
                          <div className="BE-Search-Radio pt-1">
                            <label className="d-block">Customer Type</label>
                            <ul className="">
                              <li className="checked">
                                <input
                                  checked={(this.state.data.customerType === "individual" || this.state.data.customerType === undefined) ? true : false}
                                  value="individual"
                                  name="Direction"
                                  type="radio"
                                  onChange={() => this.changeCustomerType("individual")}
                                />
                                <label>Individual</label>
                              </li>
                              <li>
                                <input
                                  value="corporate"
                                  name="Direction"
                                  type="radio"
                                  checked={this.state.data.customerType === "corporate" ? true : false}
                                  onChange={() => this.changeCustomerType("corporate")}
                                />
                                <label>Corporate</label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      }
                      <div className="col-lg-4 col-sm-12">
                        {this.renderInput(
                          "email",
                          this.state.isTourwiz ? (this.state.customerType === 'corporate' ? Trans("Corporate Email") : Trans("_email")) : (this.state.customerType === 'corporate' ? Trans("Corporate Email *") : Trans("_lblEmailWithStar")),
                          "text",
                          this.state.isTourwiz ? false : mode === "edit"
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
                    {this.state.customerType !== 'corporate' ?
                      Trans("_titlePersonalInformation") + " : "
                      : Trans("Corporate Information") + " : "
                    }

                  </h5>
                  <div className="row">
                    {this.state.customerType !== 'corporate' &&
                      <div className="col-lg-4 col-sm-12">
                        {this.renderSelect("gender", Trans("_lblGenderWithStar"), Gender)}
                      </div>
                    }
                    {this.state.customerType === 'corporate' ?
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("firstname", "Corporate Name *")}
                        </div>

                        {/* <div className="col-lg-4 col-sm-12">
                          {this.renderInput("lastname", "Corporate Last Name *")}
                        </div> */}
                      </React.Fragment> :
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("firstname", Trans("_lblFirstNameWithStar"))}
                        </div>

                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("lastname", Trans("_lblLastNameWithStar"))}
                        </div>
                      </React.Fragment>
                    }

                  </div>

                  <div className="row">
                    {this.state.customerType !== 'corporate' &&
                      <div className="col-lg-4 col-sm-12">
                        {this.renderBirthDate("birthdate", Trans("_lblBirthdate"))}
                      </div>
                    }
                    {!IsAnniverseryNotAllowed &&
                      <div className="col-lg-4 col-sm-12">
                        {this.renderBirthDate("anniversarydate", Trans("_lblAnniversarydate"))}
                      </div>
                    }
                    {this.state.isCustomerPage && (
                      <React.Fragment>
                        {!IsCustomerClassNotAllowed &&
                          <div className="col-lg-4 col-sm-12">
                            {this.renderSelect(
                              "customerclass",
                              Trans("_lblCusstomeClass"),
                              this.state.customerClassList,
                              "value",
                              "name"
                            )}
                          </div>
                        }
                        <div className="col-lg-4 col-sm-12" style={{ display: "none" }}>
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
                    {this.state.customerType === 'corporate' ?
                      <div className="col-lg-4 col-sm-12">
                        {this.renderContactInput(
                          "phonenumber",
                          "Corporate" + " " + Trans("_lblMobileNumberWithStar"),
                          "number",
                          true
                        )}
                      </div> :
                      <div className="col-lg-4 col-sm-12">
                        {this.renderContactInput(
                          "phonenumber",
                          Trans("_lblMobileNumberWithStar"),
                          "number",
                          true
                        )}
                      </div>}
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
                        {Global.getEnvironmetKeyValue("PortalCountryCode") === "IN" &&
                          <div className="col-lg-4 col-sm-12">
                            {this.renderInput("panNumber",
                              Trans("PAN Number")
                            )}
                          </div>}
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
                                Trans("_lblDocumentNumberWithStar")
                              )}
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
                      {this.state.ismilescardholder && (
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
                          checked={this.state.gstnumbercheckbox}
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
                          checked={this.state.taxationinfocheckbox}
                          onChange={this.handletaxationcheckbox}
                        />
                        <label className="custom-control-label" htmlFor="taxationinfo">
                          IBAN Information
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {this.state.gstnumbercheckbox &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("gstnumber", Trans("GST Number"), "text", '', '', 0, 50)}
                        </div>
                        <div className="col-lg-4 col-sm-12 d-none">
                          {this.renderInput("servicetaxregnumber", Trans("_label_servicetaxregnumber"), "text", '', '', 0, 50)}
                        </div>
                      </React.Fragment>
                    }
                    {this.state.taxationinfocheckbox &&
                      <React.Fragment>
                        <div className="col-lg-4 col-sm-12">
                          {this.renderInput("registrationnumber", Trans("IBAN Number"), "text", '', '', 0, 50)}
                        </div>
                        <div className="col-lg-4 col-sm-12 d-none">
                          {this.renderInput("servicetaxregnumber", Trans("_label_servicetaxregnumber"), "text", '', '', 0, 50)}
                        </div>
                      </React.Fragment>
                    }
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
                  {this.state.isCustomerPage ? Trans("_myCustomers") : Trans("_myCoTravelers")}
                </title>
              </Helmet>
              <div className="container">
                <div className="row">
                  <div className="col-lg-7">
                    <h1 className="text-white m-0 p-0 f30">
                      <SVGIcon
                        name="users"
                        width="30"
                        type="fill"
                        height="30"
                        className="mr-3"
                      ></SVGIcon>
                      {this.state.isCustomerPage ? Trans("_myCustomers") : Trans("_myCoTravelers")}
                    </h1>
                  </div>
                  <div className="col-lg-5 d-flex justify-content-end">
                    <AuthorizeComponent title={this.state.isCustomerPage ? "Customer-list~customer-add-customers" : "CoTraveller-list~Customer-addcotraveller-customers"} type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                      <button
                        className="btn btn-primary"
                        onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "Customer-list~customer-add-customers") && this.state.isCustomerPage ? this.setState({ isSubscriptionPlanend: true }) :
                          AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.state.isCustomerPage ? "Customer-list~customer-add-customers" : "CoTraveller-list~Customer-addcotraveller-customers")) ?
                            this.state.isCustomerPage
                              ? this.props.history.push("/Customer/add")
                              : this.props.history.push("/CoTraveller/add")
                            : this.setState({ isshowauthorizepopup: true })
                        }
                      >
                        {this.state.isCustomerPage ? Trans("_addCustomer") : Trans("_addCoTraveler")}
                      </button>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="dashboard-menu~customer-import-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                      <button
                        className="btn btn-primary ml-3"
                        onClick={() => !GlobalEvents.handleCheckforFreeExcess(this.props, "dashboard-menu~customer-import-customers") && this.state.isCustomerPage ? this.setState({ isSubscriptionPlanend: true }) :
                          AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~customer-import-customers") ?
                            this.props.history.push("/ImportCustomer")
                            : this.setState({ isshowauthorizepopup: true })
                        }
                      >
                        Import Customers
                      </button>
                    </AuthorizeComponent>
                    <AuthorizeComponent title="Customer-list~customer-export-customers" type="button" rolepermissions={this.props.userInfo.rolePermissions ? this.props.userInfo.rolePermissions : null}>
                      {isLoadingExport &&
                        <button
                          className="btn btn-primary ml-3"
                        >
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Export Customers
                        </button>}
                      {!isLoadingExport &&
                        <button
                          className="btn btn-primary ml-3"
                          onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "Customer-list~customer-export-customers") ? this.exportCustomers() : this.setState({ isshowauthorizepopup: true })}
                        >
                          Export Customers
                        </button>}
                    </AuthorizeComponent>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">

              <React.Fragment>

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
                      viewcotraveler={this.viewcotraveler}
                      isCustomerPage={this.state.isCustomerPage}
                      getCoTravelers={this.handleListResponse}
                      totalResults={this.state.totalResults}
                      isLoading={isLoading}
                      handleFilter={this.handleFilter}
                      isLoadingViewCotraveler={isLoadingViewCotraveler}
                      isDeleteCustomer={this.state.isDeleteCustomer}
                      isDeleteCustomerID={this.state.isCustomerID}
                      ViewCotravelerId={ViewCotravelerId}
                      userInfo={this.props.userInfo}
                      history={this.props.history}
                    />
                  </ul>
                  <div className="col-centered mb-5 ml-5"></div>
                </div>
              </React.Fragment>

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
                        : Trans("_coTravellertConfirmationOnDelete")
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
        {
          this.state.isSubscriptionPlanend &&
          <ModelLimitExceeded
            header={"Plan Limitations Exceeded"}
            content={"The maximum recommended plan has been exceeded"}
            handleHide={this.hidelimitpopup}
            history={this.props.history}
          />
        }
        {
          this.state.isShowCheckAccessPopup &&
          <ActionModal
            title="Warning"
            message={this.state.isShowPopupContent}
            positiveButtonText="Ok"
            onPositiveButton={this.handleHidePopup}
            handleHide={this.handleHidePopup}
          />
        }
      </React.Fragment>
    );
  }
}

export default ManageCoTravelers;
