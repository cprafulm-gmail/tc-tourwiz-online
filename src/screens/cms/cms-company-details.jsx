import React, { Component } from "react";
import MessageBar from "../../components/admin/message-bar";
import { cmsConfig } from "../../helpers/cms-config";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import FileBase64 from "../../components/common/FileBase64";
import Loader from "../../components/common/loader";

class CMSCompanyDetails extends Component {
  state = {
    showSuccessMessage: false,
    websiteTitle: "",
    copyright: "",
    portalID: 0,
    errors: {},
    data: {
      fileExtension: "",
      fileContentType: "",
      fileData: "",
      fileName: "",
      logo: "",
      logoValidation: ""
    },
    isLoading: false,
    isBtnLoading: false,
    HTMLModuleList: [],
    resultHTMLModule: "",
  };

  componentDidMount() {
    this.getCMSPortalSetting();
  }

  getCMSPortalSetting = () => {
    let reqOBJ = {};
    this.setState({ isLoading: true });
    let reqURL = "cms/portal/details?siteurl=" + (this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "") + "/cms");
    apiRequester_unified_api(
      reqURL,
      reqOBJ,
      (dataRes) => {
        let data = this.state.data;
        data.logo = (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].logoFile) || "";
        this.setState({
          websiteTitle: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].webSiteTitle) || "",
          copyright: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].footerText) || "",
          portalID: (dataRes?.response && dataRes?.response[0] && dataRes?.response[0].portalID) || 0,
          data,
          isLoading: false
        });
      },
      "GET"
    );
  };
  updateHTMLModuleContent = () => {
    const errors = {};
    if (this.state.websiteTitle === "")
      errors.websiteTitle = "Website tile is required";
    if (this.state.copyright === "")
      errors.copyright = "Copyright is required";

    const errorsNew = Object.keys(errors).length === 0 ? null : errors;
    this.setState({ errors: errorsNew || {} });
    if (errorsNew) return;
    this.setState({ isBtnLoading: true });
    let data = this.state.data;
    const reqOBJ = {
      request: {
        portalID: this.state.portalID,
        CompanyTitle: this.state.websiteTitle,
        CompanyCopyrights: this.state.copyright,
        CompanyLogo: data.logo,
        fileExtension: data.fileExtension,
        fileContentType: data.fileContentType,
        fileData: data.fileData,
        fileName: data.fileName
      },
    };
    let reqURL = "cms/portaldetails/update";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      this.setState({ isBtnLoading: false, isLoading: false, showSuccessMessage: true });
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
        data.logoValidation = "File size should not be greater then 1 MB.";
        this.setState({ data });
        return;
      }
      if (files.type.includes("image/")) {
        data.fileExtension = files.name.split(".").at(-1);
        data.fileContentType = files.type;
        data.fileData = files.base64;
        data.fileName = files.name;
        data.logo = "";
        data.logoValidation = ""
        this.setState({ data });
      } else if (!files.type.includes("image/")
      ) {

        data.logoValidation = "Invalid file selected.";
        this.setState({ data });
      }
    } else if (files.type.includes("image/")) {
      data.logoValidation = "Invalid file selected.";
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

  render() {
    const { showSuccessMessage, data, errors, isLoading,
      websiteTitle, portalID,
      copyright, isBtnLoading } = this.state;
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
              Company Details
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
        {/* {!isLoading && websiteTitle && */}
        <React.Fragment>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <label htmlFor={"webSiteTitle"}>{"Website Title"}</label>
            <div className="input-group form-group">
              <input type="text" className="form-control"
                value={websiteTitle}
                onChange={e =>
                  this.setState({ websiteTitle: e.target.value })
                }
              />
              {this.state.errors.brn !== undefined &&
                this.state.errors.brn !== "" && (
                  <div className="col-lg-12 col-sm-12 m-0 p-0">
                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                      {this.state.errors.brn}
                    </small>
                  </div>
                )}
            </div>
          </div>
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="col-sm-6 pl-0 pull-left">
              <FileBase64
                multiple={false}
                onDone={this.getFiles.bind(this, true, "")}
                name="uploadDocument"
                label={"Upload Logo"}
                placeholder={"Select Logo Image file"}
                className="w-100 col-lg-12"
              />
            </div>
            <div className="col-sm-6 pl-0 pull-left">
              {data.logo && data.logo !== "Images/logo.gif" && data.logo !== "Images/noLogo.png" && (
                <img style={{ width: "250px", height: "80px" }} src={data.logo.indexOf("s3") > -1 ? data.logo : (process.env.REACT_APP_CMSIMAGEHANDLER_ENDPOINT + portalID + "/" + data.logo)} />
              )}
              {data.fileName != "" && (
                <img style={{ width: "250px", height: "80px" }} src={data.fileData} />
              )}
            </div>
            <div className="col-sm-12 p-0 pull-left">
              {data.logoValidation != "" && (
                <small className="alert alert-danger m-0 p-1 d-inline-block">
                  {data.logoValidation}
                </small>
              )}
              {errors["logoValidation"] && (
                <small className="alert alert-danger m-0 p-1 d-inline-block">
                  {errors["logoValidation"]}
                </small>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <label htmlFor={"copyright"}>{"Copyright"}</label>
            <div className="input-group">
              <input type="text" className="form-control"
                value={copyright}
                onChange={e =>
                  this.setState({ copyright: e.target.value })
                }></input>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="col-lg-12 mt-3">
                {errors["SaveError"] && (
                  <small className="alert alert-danger mt-2 p-1 d-inline-block">
                    {errors["SaveError"]}
                  </small>
                )}
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => this.updateHTMLModuleContent()}
                >
                  {isBtnLoading ? (
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  Update
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
        {/* } */}
      </div>
    );
  }
}

export default CMSCompanyDetails;
