import React from "react";
import Form from "../components/common/form";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import Loader from "../components/common/loader";
import MessageBar from "../components/admin/message-bar";
import * as Global from "../helpers/global";
import moment from "moment";
import FileBase64 from "../components/common/FileBase64";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
import { cmsConfig } from "../helpers/cms-config";
import Config from "../config.json";

class LocationForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
      ...cmsConfig,
      mode: this.props.isFromContentManager ? this.props.mode : this.props.match.params.mode.toLowerCase(),
      showSuccessMessage: false,
      isLoading: false,
      isEditModeLoading: false,
      errors: {},
      CurrencyList: [],
      LoadingCurrencyList: false,
      data: {
        siteURL: cmsConfig.siteurl.replace("siteurl=", ""),
        locationTitle: "",
        locationImage: "",
        totalHotels: "",
        hotelStartsFrom: "",
        hotelCurrency: "",
        fightsStartsFrom: "",
        fightsCurrency: "",
        isShowOnHomePage: Config.codebaseType === "tourwiz-tripcenter" ? true : true,
        fileExtension: "",
        fileContentType: "",
        fileData: "",
        fileName: "",
        locationImage: "",
        locationImageValidate: "",
        locationTabs: [{
          id: this.generateUUID(),
          tabTitle: "",
          tabDetails: "",
          fileExtension: "",
          fileContentType: "",
          fileData: "",
          fileName: "",
          tabImage: "",
          isDeleted: false,
          tabTitleValidate: "",
          tabDetailsValidate: "",
          tabImageValidate: "",
        }]
      },
      locationTabsObj: {
        id: 3,
        tabTitle: "",
        tabDetails: "",
        fileExtension: "",
        fileContentType: "",
        fileData: "",
        fileName: "",
        tabImage: "",
        tabTitleValidate: "",
        tabDetailsValidate: "",
        tabImageValidate: "",
        isDeleted: false,
      },
      activeTab: "Tab 0",
    };
  }

  getBranchList = () => {
    const { providerID, data } = this.state;
    const reqOBJ = {};
    let reqURL = "cms/package/getcurrency";
    this.setState({ LoadingBranchList: true });
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        this.setState({
          CurrencyList: resonsedata.response,
          LoadingCurrencyList: false,
        });
      }.bind(this),
      "GET"
    );
  };
  handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };
  componentDidMount() {
    this.getBranchList();
    const { mode, id } = this.props.isFromContentManager ? this.props : this.props.match.params;
    if (mode.toLowerCase() === "edit" || mode.toLowerCase() === "view") {
      this.getLocationDetails(id);
    }
  }
  getLocationDetails = (id) => {
    this.setState({ isLoading: true, isEditModeLoading: true });
    const reqOBJ = {
      request: {
      },
    };
    let reqURL = "cms/locationdetails?itemid=" + id + "&portalid=9858";
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        let data = resonsedata.response.details[0];
        data.locationTitle = resonsedata.response.details[0].locationTitle;
        //data.locationImage = resonsedata.response.details[0].locationImage.indexOf(".s3.") > 0 ? resonsedata.response.details[0]?.locationImage : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + resonsedata.response.details[0]?.portalID + "/LocationsGuide/images/" + resonsedata.response.details[0]?.locationImage;
        data.locationImage = resonsedata.response.details[0].locationImage;
        data.totalHotels = resonsedata.response.details[0].totalHotels;
        data.hotelStartsFrom = resonsedata.response.details[0].hotelStartsFrom;
        data.hotelCurrency = resonsedata.response.details[0].hotelCurrency;
        data.fightsStartsFrom = resonsedata.response.details[0].fightsStartsFrom;
        data.fightsCurrency = resonsedata.response.details[0].fightsCurrency;
        data.isShowOnHomePage = resonsedata.response.details[0].showOnHome;
        data.locationImageValidate = "";
        data.fileName = "";
        data.locationTabs = resonsedata.response.tabs.map(item => {
          item["id"] = item.locationTabID;
          item["isDefaultImage"] = false;
          item["isDeleted"] = false;
          item["fileExtension"] = "jpg";
          item["tabImage"] = item.tabImage;
          item["tabImageValidate"] = "";
          item["fileName"] = "";
          item["tabDetailsValidate"] = "";
          item["tabTitleValidate"] = "";

          delete item["createdby"];
          delete item["createddate"];
          delete item["updatedby"];
          delete item["updateddate"];
          delete item["specialpromotionimageid"];
          delete item["specialpromotionid"];
          return item;
        });
        this.setState({ data, isLoading: false, isEditModeLoading: false });
      }.bind(this),
      "GET"
    );
  };
  validateInformation = () => {
    const errors = {};
    const { data, mode } = this.state;

    if (!this.validateFormData(data.locationTitle, "require"))
      errors.locationTitle = "Destination Title required";
    //  if (!this.validateFormData(data.locationImage, "require"))
    //    errors.locationImage = "Lead Image Required.";       
    if (data.locationImage === "" && data.fileName === "" && !this.validateFormData(data.fileName, "require"))
      errors.locationImageValidate = "Destination Image Required.";
    data.locationTabs = data.locationTabs.map((item, key) => {
      if (!this.validateFormData(item.tabTitle, "require")) {
        item["tabTitleValidate"] = "Tab title required";
        errors.tabTitleValidate = "Tab title required";
      }
      else
        item["tabTitleValidate"] = "";
      if (!this.validateFormData(item.tabDetails, "require")) {
        item["tabDetailsValidate"] = "Tab description required";
        errors.tabDetailsValidate = "Tab description required";
      }
      else
        item["tabDetailsValidate"] = "";
      // if (!this.validateFormData(item.fileName, "require"))
      //   item["tabImageValidate"] = "Tab image required"
      return item;
    });
    this.setState({ data });
    return Object.keys(errors).length === 0 ? null : errors;
  };

  saveLocationClick = () => {
    const errors = this.validateInformation();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.saveLocation();
  };
  saveLocation = () => {
    const { mode } = { ...this.state };
    let data = Object.assign({}, this.state.data);
    data["siteURL"] = this.props.isFromContentManager ? (this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "")) : cmsConfig.siteurl.replace("siteurl=", "").replace("/cms", "");
    delete data["locationImageValidate"];
    let LocationInfo = Object.assign({}, data);
    this.setState({ isLoading: true });
    let reqURL = `cms/location${mode.toLowerCase() === "add" ? "/add" : "/update"
      }`;

    let reqOBJ = { request: LocationInfo };
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      function (resonsedata) {
        if (resonsedata?.response === "success") {
          this.setState({ isLoading: false, showSuccessMessage: true });
          this.props.isFromContentManager && this.props.handleShowHideForm(0)
        } else {
          let { errors } = this.state;
          errors.SaveError = "Oops! something went wrong";
          this.setState({ isLoading: false, errors });
        }
      }.bind(this),
      "POST"
    );
  };
  getFiles(isLeadImage, mode, files) {
    let data = this.state.data;
    if (
      files &&
      files !== "undefined" &&
      files.base64 &&
      files.base64 !== "undefined"
    ) {
      if (files.file.size > 1024000) {
        if (isLeadImage) {
          data.locationImageValidate = "File size should not be greater then 1 MB.";
        } else {

          var foundIndex = data.locationTabs.findIndex(x => x.id == mode);
          data.locationTabs[foundIndex].tabImageValidate = "File size should not be greater then 1 MB.";
        }
        this.setState({ data });
        return;
      }
      if (files.type.includes("image/")) {
        if (isLeadImage) {
          data.fileExtension = files.name.split(".").at(-1);
          data.fileContentType = files.type;
          data.fileData = files.base64;
          data.fileName = files.name;
          data.locationImage = "";
          data.locationImageValidate = ""
        }
        else {
          var foundIndex = data.locationTabs.findIndex(x => x.id == mode);
          data.locationTabs[foundIndex].fileExtension = files.name.split(".").at(-1);
          data.locationTabs[foundIndex].fileContentType = files.type;
          data.locationTabs[foundIndex].fileData = files.base64;
          data.locationTabs[foundIndex].fileName = files.name;
          data.locationTabs[foundIndex].tabImage = "";
          data.locationTabs[foundIndex].tabImageValidate = ""
        }
        this.setState({ data });
      } else if (files.type.includes("image/")
      ) {
        if (isLeadImage)
          this.setState({
            uploadDocValidationLeadImage: "Invalid file selected.",
          });
        else
          this.setState({ uploadDocValidationImage: "Invalid file selected." });
      }
    } else if (files.type.includes("image/")) {
      if (isLeadImage) {
        data.locationImageValidate = "Invalid file selected.";
      } else {
        var foundIndex = data.locationTabs.findIndex(x => x.id == mode);
        data.locationTabs[foundIndex].tabImageValidate = "Invalid file selected.";
      }
      this.setState({ data });
    }
  }
  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };
  removeTab = (id) => {
    let data = this.state.data;
    data.locationTabs.splice(id, 1);
    this.setState({ data, activeTab: "Tab " + (id - 1) });
  };

  removeImage = (id) => {
    let data = this.state.data;
    if (id == -1) {
      data.fileExtension = "";
      data.fileContentType = "";
      data.fileData = "";
      data.fileName = "";
      data.locationImage = "";
      data.locationImageValidate = "";
    }
    else {
      var foundIndex = data.locationTabs.findIndex(x => x.id == id);
      data.locationTabs[foundIndex].fileExtension = "";
      data.locationTabs[foundIndex].fileContentType = "";
      data.locationTabs[foundIndex].fileData = "";
      data.locationTabs[foundIndex].fileName = "";
      data.locationTabs[foundIndex].tabImage = "";
      data.locationTabs[foundIndex].tabImageValidate = "";
    }
    this.setState({ data });
  };
  handleOnChange = () => {
    let data = this.state.data;
    data.isShowOnHomePage = !data.isShowOnHomePage;
    this.setState({ data });
  };

  handleTabChangeTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleTabChange = (tab) => {
    let data = this.state.data;
    let sampleImageObj = {
      id: this.generateUUID(),
      tabTitle: "",
      tabDetails: "",
      fileExtension: "",
      fileContentType: "",
      fileData: "",
      fileName: "",
      tabImage: "",
      isDeleted: false,
      tabTitleValidate: "",
      tabDetailsValidate: "",
      tabImageValidate: "",
    };

    if (data.locationTabs.length < 5) {
      data.locationTabs.push(sampleImageObj);
      var tt = "Tab " + (data.locationTabs.length - 1);
      this.setState({ data, activeTab: tt });
    }
  };
  handleChangeTabTitle = (e, id) => {
    let data = this.state.data;
    var foundIndex = data.locationTabs.findIndex(x => x.id == id);
    if (e.target.name === "tabTitle") {
      data.locationTabs[foundIndex].tabTitle = e.target.value;
    }
    if (e.target.name === "tabDetails") {
      data.locationTabs[foundIndex].tabDetails = e.target.value.trim();
    }
    this.setState({ data });
  };

  RedirectToList = () => {
    this.props.isFromContentManager ?
      this.props.handleShowHideForm(0) : this.props.history.push(`/LocationList`);
  };

  handleShowHideForm = (flag) => {
    this.props.handleShowHideForm(flag);
  }

  render() {
    const {
      data,
      errors,
      mode,
      isLoading,
      isEditModeLoading,
      showSuccessMessage,
      CurrencyList,
      LoadingCurrencyList,
      activeTab,
    } = this.state;
    const disabled = mode === "view";
    const isEditMode = mode === "edit";
    return (
      <div>
        <div className={this.props.isFromContentManager ? "border-bottom pt-1 pb-1 mb-3" : "title-bg pt-3 pb-3 mb-3"}>
          <div className="container">
            <h1 className={this.props.isFromContentManager ? "text-dark text-left m-0 p-0 f30" : "text-white m-0 p-0 f30"}>
              {mode === "add" ? "Add " : mode === "view" ? "View " : "Edit "}
              Destination
              <span className="pull-right">
                <button
                  className="btn btn-sm btn-primary pull-right mr-2"
                  onClick={() => this.props.isFromContentManager ? this.handleShowHideForm(0) : this.RedirectToList()}
                >
                  Back
                </button>
              </span>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className={this.props.isFromContentManager ? "d-none" : "col-lg-3 hideMenu"}>
              <QuotationMenu
                handleMenuClick={this.handleMenuClick}
                userInfo={this.props.userInfo}
              />
            </div>
            {isEditModeLoading && (
              <div className="col-lg-8">
                <div className="container ">
                  <Loader />
                </div>
              </div>
            )}
            {!isEditModeLoading && (
              <div className={this.props.isFromContentManager ? "col-lg-12 p-0 text-left" : "col-lg-9 "}>
                <div className="container ">
                  {showSuccessMessage && (
                    <MessageBar
                      Message={`Destination ${mode === "add" ? "added" : "updated"
                        } successfully.`}
                      handleClose={() => this.RedirectToList()}
                    />
                  )}
                  {data.status === "REJECTED" && (
                    <div className="col-lg-12 alert alert-danger mt-2 p-1 d-inline-block">
                      <p className="m-2">
                        Your location has been <strong>Rejected</strong> due to
                        below reason.
                      </p>
                      <blockquote className="m-2 ml-4">
                        <i>{data.statusReason}</i>
                      </blockquote>
                    </div>
                  )}
                  <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                      Destination Details
                    </h5>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        {this.renderInput(
                          "locationTitle",
                          "Destination Title *",
                          "text"
                        )}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                        {this.renderInput("totalHotels", "totalHotels", "number")}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                        {this.renderInput("hotelStartsFrom", "Hotel Starts From", "number")}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                        <div className={"form-group " + "hotelCurrency"}>
                          <label htmlFor={"hotelCurrency"}>{"Hotel Currency"}</label>
                          <div className="input-group">
                            <select
                              value={data.currencyID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"hotelCurrency"}
                              id={"hotelCurrency"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>
                                Select
                              </option>
                              {CurrencyList.map((option, key) => (
                                <option key={key} value={option["fightsCurrency"]}>
                                  {option["displayName"] +
                                    " (" +
                                    option["symbol"] +
                                    ")"}
                                </option>
                              ))}
                            </select>
                            {LoadingCurrencyList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["hotelCurrency"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["hotelCurrency"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                        {this.renderInput(
                          "fightsStartsFrom",
                          "Fights Starts From",
                          "number"
                        )}
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12" style={{ display: "none" }}>
                        <div className={"form-group " + "fightsCurrency"}>
                          <label htmlFor={"fightsCurrency"}>{"Fights Currency"}</label>
                          <div className="input-group">
                            <select
                              value={data.currencyID}
                              onChange={(e) => this.handleDataChange(e)}
                              name={"fightsCurrency"}
                              id={"fightsCurrency"}
                              disabled={disabled}
                              className={"form-control"}
                            >
                              <option key={0} value={""}>
                                Select
                              </option>
                              {CurrencyList.map((option, key) => (
                                <option key={key} value={option["fightsCurrency"]}>
                                  {option["displayName"] +
                                    " (" +
                                    option["symbol"] +
                                    ")"}
                                </option>
                              ))}
                            </select>
                            {LoadingCurrencyList ? (
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                          {errors["fightsCurrency"] && (
                            <small className="alert alert-danger mt-2 p-1 d-inline-block">
                              {errors["fightsCurrency"]}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="col-sm-12 p-0">
                          <FileBase64
                            multiple={false}
                            onDone={this.getFiles.bind(this, true, "")}
                            name="uploadDocument"
                            label={"Upload Image"}
                            placeholder={"Select Image file"}
                            className="w-100 col-lg-12"
                          />
                        </div>
                        <div className="col-sm-12 p-0 pull-left" style={{ marginTop: "-6px" }}>
                          {data.locationImageValidate != "" && (
                            <small className="alert alert-danger m-0 p-1 d-inline-block">
                              {data.locationImageValidate}
                            </small>
                          )}
                          {errors["locationImageValidate"] && (
                            <small className="alert alert-danger m-0 p-1 d-inline-block">
                              {errors["locationImageValidate"]}
                            </small>
                          )}
                        </div>
                        <div className="col-sm-12 m-0 p-0 pull-left">
                          {data.locationImage != "" && (
                            <div
                              className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                              role="alert"
                            >
                              <div className="alert alert-warning alert-dismissible fade show p-1">
                                <span>
                                  <a
                                    className="btn btn-link  text-primary"
                                    href={data.locationImage}
                                    target="_blank"
                                  >
                                    Download Location Image{" "}
                                  </a>
                                </span>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="alert"
                                  aria-label="Close"
                                  onClick={() => this.removeImage(-1)}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            </div>
                          )}
                          {data.fileName != "" && (
                            <div
                              className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                              role="alert"
                            >
                              <div className="alert alert-warning alert-dismissible fade show">
                                {data.fileName}
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="alert"
                                  aria-label="Close"
                                  onClick={() => this.removeImage(-1)}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {Config.codebaseType !== "tourwiz-tripcenter" && (<div className="col-lg-4 col-md-6 col-sm-12">
                        <div className={"form-group " + "isShowOnHomePage"}>
                          <label htmlFor={"isShowOnHomePage"}>{""}</label>
                          <div className="input-group">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="isShowOnHomePage"
                                id="isShowOnHomePage"
                                onChange={this.handleOnChange}
                                value={data.isShowOnHomePage}
                                checked={data.isShowOnHomePage}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="IsActiveYes"
                              >
                                Is show on home page ?
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                      <div className="col-lg-4 col-md-6 col-sm-12 mt-4" style={{ textAlign: "left" }}>
                        <a
                          className=" mt-3"
                          href="javascript:void(0);"
                          style={{ top: "-60px", right: "-15px" }}
                          onClick={() => this.handleTabChange(3)}
                        >
                          Add Destination Tab
                        </a>
                      </div>
                      <div className="col-lg-12 d-flex package-tab-row  mt-3">
                        {data.locationTabs.map((locationTab, i) => (
                          <div
                            className={
                              activeTab === "Tab " + i ||
                                data.locationTabs.length === 1
                                ? "package-tab active"
                                : "package-tab"
                            }
                            key={i}
                          >
                            <span
                              onClick={() =>
                                this.handleTabChangeTab("Tab " + i)
                              }>
                              {"Tab " + (i + 1)}
                            </span>
                            {i !== 0 && (
                              <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"

                              >
                                <span aria-hidden="true" onClick={() => this.removeTab(i)}>&times;</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="col-lg-12">
                        {data.locationTabs.map((locationTab, i) => (
                          <div
                            className="col-sm-12 p-0 mt-3"
                            style={
                              activeTab === "Tab " + i ||
                                data.locationTabs.length === 1
                                ? { display: "block" }
                                : { display: "none" }
                            }
                          >
                            <div
                              className="col-lg-12 d-flex p-0">
                              <div className="col-lg-6 col-md-6 col-sm-12 pull-left">

                                <div className="form-group">
                                  <label htmlFor="username">Tab Title *</label>
                                  <input
                                    className={
                                      "form-control " +
                                      (!locationTab.tabTitleValidate ? "" : "")
                                    }
                                    value={locationTab.tabTitle}
                                    name="tabTitle"
                                    id="tabTitle"
                                    type="text"
                                    placeholder="Tab title"
                                    onChange={(e) => { this.handleChangeTabTitle(e, locationTab.id) }}
                                  />
                                  {/* {locationTab.tabTitleValidate !== "" && (<small class="alert alert-danger mt-2 p-1 d-inline-block">{locationTab.tabTitleValidate}</small>)} */}
                                </div>
                              </div>

                              <div className="col-lg-6 col-md-6 col-sm-12" style={{ display: "none" }}>
                                <div className="col-sm-12 p-0">
                                  <FileBase64
                                    multiple={false}
                                    onDone={this.getFiles.bind(
                                      this,
                                      false,
                                      locationTab.id
                                    )}
                                    name={"uploadDocument" + i}
                                    label={"Upload Image "}
                                    placeholder={"Select Image file"}
                                    className="w-100 col-lg-12"
                                  />
                                </div>
                                <div className="col-sm-12 p-0 pull-left" style={{ marginTop: "-6px" }}>
                                  {locationTab.tabImageValidate != "" && (
                                    <small className="alert alert-danger m-0 p-1 d-inline-block">
                                      {locationTab.tabImageValidate}
                                    </small>
                                  )}
                                  {errors["tabImageValidate"] && (
                                    <small className="alert alert-danger ml-3 mt-2 p-1 d-inline-block">
                                      {errors["tabImageValidate"]}
                                    </small>
                                  )}
                                </div>
                                <div className="col-sm-12 m-0 p-0 pull-left">
                                  {locationTab.tabImage != "" && (
                                    <div
                                      className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                      role="alert"
                                    >
                                      <div className="alert alert-warning alert-dismissible fade show p-1">
                                        <span>
                                          <a
                                            className="btn btn-link  text-primary"
                                            href={locationTab.tabImage}
                                            target="_blank"
                                            download={`location.pdf`}
                                          >
                                            Download Location Tab Image{" "}
                                          </a>
                                        </span>
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="alert"
                                          aria-label="Close"
                                          onClick={() => this.removeImage(locationTab.id)}
                                        >
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {locationTab.fileName != "" && (
                                    <div
                                      className="col-lg-12 col-md-6 col-sm-12 m-0 p-0"
                                      role="alert"
                                    >
                                      <div className="alert alert-warning alert-dismissible fade show">
                                        {locationTab.fileName}
                                        <button
                                          type="button"
                                          className="close"
                                          data-dismiss="alert"
                                          aria-label="Close"
                                          onClick={() => this.removeImage(locationTab.id)}
                                        >
                                          <span aria-hidden="true">&times;</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="form-group locationName clearfix">
                                {/* {"Tab" + i}
                                {"Active " + activeTab} */}
                                {"Tab Description"}
                                <CKEditor
                                  key={i}
                                  id={"tab" + i}
                                  editor={ClassicEditor} config={Global.toolbarFCK}
                                  data={decode(locationTab.tabDetails)}
                                  onChange={(event, editor) => {
                                    const rowData = editor.getData();
                                    let data = this.state.data;
                                    var foundIndex = data.locationTabs.findIndex(x => x.id == locationTab.id);
                                    data.locationTabs[foundIndex].tabDetails = encode(rowData);
                                    this.setState({ data });
                                  }}
                                />

                                {/* <div className="col-sm-12 p-0 pull-left" style={{ marginTop: "6px" }}>
                                  {locationTab.tabDetailsValidate != "" && (
                                    <small className="alert alert-danger m-0 p-1 d-inline-block">
                                      {locationTab.tabDetailsValidate}
                                    </small>
                                  )}
                                  {errors["tabDetailsValidate"] && (
                                    <small className="alert alert-danger m-0 p-1 d-inline-block">
                                      {errors["tabDetailsValidate"]}
                                    </small>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          className="col-sm-12 mt-3">
                          {data.locationTabs.map((locationTab, i) => (
                            <React.Fragment>
                              {locationTab.tabTitleValidate !== "" && (
                                <React.Fragment>
                                  <small class="alert alert-danger mb-1 p-1 d-inline-block">{locationTab.tabTitleValidate + "   for Tab " + (i + 1)}</small>
                                  <br />
                                </React.Fragment>)}
                              {locationTab.tabDetailsValidate != "" && (
                                <React.Fragment><small className="alert alert-danger mb-1 p-1 d-inline-block">
                                  {locationTab.tabDetailsValidate + " for Tab " + (i + 1)}
                                </small>
                                  <br />
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      {errors["SaveError"] && (
                        <small className="alert alert-danger mt-2 p-1 d-inline-block">
                          {errors["SaveError"]}
                        </small>
                      )}
                      {!disabled && (
                        <button
                          className="btn btn-primary mr-2 float-left"
                          type="submit"
                          onClick={() => this.saveLocationClick()}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-border-sm mr-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          Save
                        </button>
                      )}
                      <button
                        className="btn btn-secondary mr-2 float-left"
                        type="submit"
                        onClick={() => this.props.isFromContentManager ? this.handleShowHideForm(0) : this.RedirectToList()}
                      >
                        {disabled ? "Back" : "Cancel"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default LocationForm;

const status = [
  { value: "CREATED", name: "Draft" },
  { value: "REQUESTFORPUBLISH", name: "Request For Publish" },
  { value: "PUBLISHED", name: "Published" },
  { value: "REJECTED", name: "Rejected" },
];
