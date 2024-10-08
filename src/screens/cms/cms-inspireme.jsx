import React, { Component } from "react";
import MessageBar from "../../components/admin/message-bar";
import { cmsConfig } from "../../helpers/cms-config";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import FileBase64 from "../../components/common/FileBase64";
import Loader from "../../components/common/loader";
import ActionModal from "../../helpers/action-modal";
import onlineBooking from "../../assets/images/customer-portal/template-images/DeleteSVG.svg";
import SVGIcon from "../../helpers/svg-icon";

class CMSInspireMe extends Component {
  state = {
    showSuccessMessage: false,
    title: "",
    description: "",
    portalID: 0,
    inspireMeID: 0,
    isDeleteConfirmPopup: false,
    deleteItem: 0,
    errors: {},
    data: {
      fileExtension: "",
      fileContentType: "",
      fileData: "",
      fileName: "",
      image: "",
      imageValidation: ""
    },
    isLoading: false,
    isBtnLoading: false,
    bannerImagesList: [],
    resultBannerImages: "",
    mode: "list"
  };

  componentDidMount() {
    this.getCMSPortalSetting();
  }
  editInspireMe = (indexID) => {

    let { title, description, inspireMeID, portalID, data, mode, bannerImagesList } = this.state;
    title = bannerImagesList[indexID].title;
    description = bannerImagesList[indexID].description;
    inspireMeID = bannerImagesList[indexID].inspireMeID;
    portalID = bannerImagesList[indexID].portalId;
    mode = "edit";
    data.image = bannerImagesList[indexID].imageName;
    this.setState({ title, description, inspireMeID, portalID, mode, data });
  }

  getCMSPortalSetting = (id) => {
    let reqOBJ = {};
    this.setState({ isLoading: true });
    let reqURL = "cms/bannerimage/get?siteurl=" + this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "") + "/cms";
    if (id) {
      reqURL += "&id=" + id;
    }
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (dataRes) => {
        let data = this.state.data;
        data.image = (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].imageName) || "";
        this.setState({
          bannerImagesList: (dataRes?.response && dataRes?.response) || [],
          resultBannerImages: (dataRes?.response && dataRes?.response) || "",
          title: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].title) || "",
          description: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].description) || "",
          inspireMeID: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].inspireMeID) || 0,
          portalID: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].portalId) || 0,
          data,
          mode: "list",
          isLoading: false
        });
      },
      "GET"
    );
  };
  addInspireMe = () => {
    const errors = {};
    let data = this.state.data;
    if (this.state.title === "")
      errors.title = "Title is required";
    if (this.state.description === "")
      errors.description = "Description is required";
    if (data.image === "" && data.fileData === "")
      errors.imageValidation = "Banner image is required";

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errorsNew || {} });
    if (errorsNew) return;
    this.setState({ isBtnLoading: true });
    const reqOBJ = {
      request: {
        inspireMeID: this.state.inspireMeID,
        Title: this.state.title,
        Description: this.state.description,
        Link: "",
        Duration: 2,
        ImageName: data.image,
        fileExtension: data.fileExtension,
        fileContentType: data.fileContentType,
        fileData: data.fileData,
        fileName: data.fileName
      },
    };
    let reqURL = "cms/bannerimage/update";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      if (resonsedata.response && resonsedata.response === "success") {
        this.getCMSPortalSetting();
        this.setState({ isBtnLoading: false, isLoading: false, showSuccessMessage: true, mode: "list" });
      }
    }.bind(this), "POST");
  }
  updateInspireMe = () => {
    const errors = {};
    let data = this.state.data;
    if (this.state.title === "")
      errors.title = "Title is required";
    if (this.state.description === "")
      errors.description = "Description is required";
    if (data.image === "" && data.fileData === "")
      errors.imageValidation = "Banner image is required";

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errorsNew || {} });
    if (errorsNew) return;
    this.setState({ isBtnLoading: true });
    //let data = this.state.data;
    const reqOBJ = {
      request: {
        inspireMeID: this.state.inspireMeID,
        Title: this.state.title,
        Description: this.state.description,
        Link: "",
        Duration: 2,
        ImageName: data.image,
        fileExtension: data.fileExtension,
        fileContentType: data.fileContentType,
        fileData: data.fileData,
        fileName: data.fileName
      },
    };
    let reqURL = "cms/bannerimage/update";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      if (resonsedata.response && resonsedata.response === "success") {
        this.getCMSPortalSetting();
        this.setState({ isBtnLoading: false, isLoading: false, showSuccessMessage: true, mode: "list" });
      }
    }.bind(this), "POST");
  }

  getFiles(isLeadImage, mode, files) {
    let data = this.state.data;
    if (
      files &&
      files !== "undefined" &&
      files.base64 &&
      files.base64 !== "undefined"
    ) {
      if (files.file.size > 1024000) {
        data.imageValidation = "File size should not be greater then 1 MB.";
        this.setState({ data });
        return;
      }
      if (files.type.includes("image/")) {
        data.fileExtension = files.name.split(".").at(-1);
        data.fileContentType = files.type;
        data.fileData = files.base64;
        data.fileName = files.name;
        data.image = "";
        data.imageValidation = ""
        this.setState({ data });
      } else if (!files.type.includes("image/")
      ) {

        data.imageValidation = "Invalid file selected.";
        this.setState({ data });
      }
    } else if (files.type.includes("image/")) {
      data.imageValidation = "Invalid file selected.";
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

  deletePackage = (id) => {
    this.setState({
      deleteItem: id,
      isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup,
      currentPage: 0,
    });
  };

  handleConfirmDeletePackage = () => {
    this.setState({ isLoading: true });
    const reqOBJ = {
      request: {
        inspireMeID: this.state.deleteItem
      },
    };
    let reqURL = "cms/bannerimage/delete";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.getCMSPortalSetting();
    }.bind(this), "POST");
  };
  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.handleConfirmDeletePackage();
  };

  render() {
    const { showSuccessMessage, data, errors, isLoading,
      title, description, inspireMeID, portalID, mode, bannerImagesList,
      isDeleteConfirmPopup, isBtnLoading,
      deleteItem } = this.state;
    const { cmsSettings } = this.props;

    return (
      <div>
        <div className="border-bottom pt-1 pb-1 mb-3">
          <div className="container">
            <h1 className="text-dark m-0 p-0 f30">
              {/* <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon> */}
              Manage Banner Images
              <button
                className="btn btn-sm btn-primary pull-right mr-2"
                onClick={() => this.editInspireMe(0)}
              >
                Update Banner Image
              </button>
            </h1>
          </div>
        </div>
        {isLoading && (
          <div className="col-lg-12 mt-5">
            <div className="container pt-5">
              <Loader />
            </div>
          </div>
        )}
        {showSuccessMessage && (
          <MessageBar
            Message={`Content updated successfully.`}
            handleClose={() => this.setState({ showSuccessMessage: false })}
          />
        )}
        {!isLoading && mode === "list" && (
          <div className="row mt-4">
            {bannerImagesList && bannerImagesList.length > 0 && bannerImagesList.map((item, index) => {
              return index === 0 && (
                <div className="col-lg-4 pull-left">
                  <div className="mb-4 card tw-offers-card shadow border-0" key={index}>
                    <a href='#' onClick={() => this.editInspireMe(index)}>
                      <img className="w-100" style={{ height: "200px" }} src={item?.imageName.indexOf(".s3.") > 0 ? item?.imageName : process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + portalID + "/InspireMe/images/" + item?.imageName} />
                    </a>
                    <button
                      className="btn btn-primary tw-offers-card-btn"
                      onClick={() => this.editInspireMe(index)}
                    >
                      {item.title}
                    </button>
                    {/* <button
                      className="btn btn-sm position-absolute text-nowrap p-0" style={{ right: "-10px", top: "-10px" }}
                      onClick={() => this.deletePackage(item.inspireMeID)}
                    >
                      <img style={{ width: "22px" }} src={onlineBooking} alt="" />
                    </button> */}
                  </div>
                </div>
              )
            })
            }
          </div>
        )}
        {!isLoading && mode === "edit" &&
          <React.Fragment>
            <div className="col-lg-6 col-md-6 col-sm-12 pull-left">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <label htmlFor={"title"}>{"Banner Title"}</label>
                <div className="input-group form-group">
                  <input type="text" className="form-control"
                    value={title}
                    onChange={e =>
                      this.setState({ title: e.target.value })
                    }
                  />
                  {this.state.errors.title !== undefined &&
                    this.state.errors.title !== "" && (
                      <div className="col-lg-12 col-sm-12 m-0 p-0">
                        <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                          {this.state.errors.title}
                        </small>
                      </div>
                    )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <label htmlFor={"description"}>{"Banner Description"}</label>
                <div className="input-group form-group">
                  <input type="text" className="form-control"
                    value={description}
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }></input>
                  {this.state.errors.description !== undefined &&
                    this.state.errors.description !== "" && (
                      <div className="col-lg-12 col-sm-12 m-0 p-0">
                        <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                          {this.state.errors.description}
                        </small>
                      </div>
                    )}
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="col-sm-12 p-0 pull-left">
                  <FileBase64
                    multiple={false}
                    onDone={this.getFiles.bind(this, true, "")}
                    name="uploadDocument"
                    label={"Upload Image"}
                    placeholder={"Select Banner Image file"}
                    className="w-100 col-lg-12"
                  />
                </div>
                <div className="col-sm-12 p-0 pull-left">
                  {data.imageValidation != "" && (
                    <small className="alert alert-danger m-0 p-1 d-inline-block">
                      {data.imageValidation}
                    </small>
                  )}
                  {errors["imageValidation"] && (
                    <small className="alert alert-danger m-0 p-1 d-inline-block">
                      {errors["imageValidation"]}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 pull-left">

              {data.fileName === "" && data.image && data.image !== "Images/logo.gif" && data.image !== "Images/noLogo.png" && (

                <div className="col-lg-12 col-md-12 p-0 col-sm-12">
                  <label htmlFor={"title"}>{"Uploaded banner Image"}</label>
                  <img style={{ width: "100%" }} src={data.image.indexOf("s3") > -1 ? data.image : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + portalID + "/InspireMe/images/" + data.image)} />
                </div>
              )}
              {data.fileName != "" && (
                <div className="col-lg-12 col-md-12 p-0 col-sm-12">
                  <label htmlFor={"title"}>{"Uploaded banner Image"}</label>
                  <img style={{ width: "100%" }} src={data.fileData} />
                </div>
              )}
            </div>

            <div className="row col-lg-12 mt-3">
              <div className="col-lg-12">
                <div className="col-lg-12 mt-3">
                  {errors["SaveError"] && (
                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                      {errors["SaveError"]}
                    </small>
                  )}

                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => inspireMeID ? this.updateInspireMe() : this.addInspireMe()}
                  >
                    {isBtnLoading ? (
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    {inspireMeID ? "Update Banner Image" : "Add Banner Image"}
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        }


        {isDeleteConfirmPopup && (
          <ActionModal
            title="Confirm Delete"
            message="Are you sure you want to delete this item?"
            positiveButtonText="Confirm"
            onPositiveButton={() => this.handleConfirmDelete(true)}
            handleHide={() => this.handleConfirmDelete(false)}
          />
        )}
      </div>
    );
  }
}

export default CMSInspireMe;
