import React from 'react';
import { apiRequester_quotation_api } from '../../services/requester-quotation';
import FileBase64 from '../common/FileBase64';
import info from "../../assets/images/dashboard/info-circle.svg";
import  {apiRequester_unified_api}from '../../services/requester-unified-api';

export default class UploadImageSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      uploadDocValidationImage: '',
      invalidImageValidation: '',
      errors: {},
      isSuccess: '',
      isBtnLoading: false,
      isBtnLoadingMode: false
    }
    this.imageMaxSize = 5024000;
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
  removeImage = (id) => {
    let images = this.state.images.filter(
      (x) => x.id !== id
    );
    this.setState({ images });
  };
  getFiles = (isLeadImage, mode, files) => {
    let errors = Object.assign({}, this.state.errors);
    if (isLeadImage) {
      delete errors["LeadImage"];
      delete errors["invalidImageValidation"];
    }
   

    this.setState({ isSuccess: '', uploadDocValidationImage: '', isBtnLoadingMode: true, invalidImageValidation: '' });
    var isInValidImage = false;

    let tempRawData = "";
    if (files.base64.includes("data:image/jpeg;base64,")) {
      tempRawData = files.base64.replace(
        "data:image/jpeg;base64,",
        ""
      );
    } else if (
      files.base64.includes("data:image/png;base64,", "")
    ) {
      tempRawData = files.base64.replace(
        "data:image/png;base64,",
        ""
      );
    } else if (
      files.base64.includes("data:application/msword;base64,", "")
    ) {
      tempRawData = files.base64.replace(
        "data:application/msword;base64,",
        ""
      );
    } else if (
      files.base64.includes("data:application/pdf;base64,", "")
    ) {
      tempRawData = files.base64.replace(
        "data:application/pdf;base64,",
        ""
      );
    } else if (
      files.base64.includes(
        "data:application/x-zip-compressed;base64,",
        ""
      )
    ) {
      tempRawData = files.base64.replace(
        "data:application/x-zip-compressed;base64,",
        ""
      );
    } else if (
      files.base64.includes(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
        ""
      )
    ) {
      tempRawData = files.base64.replace(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
        ""
      );
    }
    let filedata_base64 = tempRawData;

    const reqOBJ = {
      Name: files.name,
      Extension: "." + files.name.split(".").at(-1),
      ContentType: files.type,
      Data: filedata_base64
    };

    let reqURL = "tw/image/validate";
    this.setState({ isSaving: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      if (resonsedata && resonsedata.response && resonsedata.response.toLowerCase() === "success") {
    
    if (
      files &&
      files !== "undefined" &&
      files.base64 &&
      files.base64 !== "undefined"
    ) {
      if (files.file.size > this.imageMaxSize) {
        this.setState({ invalidImageValidation: "File size should not be greater then 5 MB.", });
        return;
      }
      if (files.name.split(".").at(-1) === 'tiff') {
        this.setState({ invalidImageValidation: "Invalid file selected." });
        return;
      }
      if (files.type.includes("image/")) {
        let images = this.state.images;
        let sampleImageObj = {
          id: this.generateUUID(),
          fileExtension: files.name.split(".").at(-1),
          fileContentType: files.type,
          fileSize: files.size.split(" ").at(0),
          fileData: files.base64,
          fileName: files.name.split(".").at(0),
        };
        images.push(sampleImageObj);
        this.setState({ images });
      }
      else {
        this.setState({ invalidImageValidation: "Invalid file selected." });
      }
    }
  }
  else {
    if (mode === "image") {
      if (isLeadImage)
        this.setState({
          invalidImageValidation: "Invalid file selected.",
        });
      else
        this.setState({ invalidImageValidation: "Invalid file selected." });
    }
  }
}.bind(this), "POST");

  }

  saveImages = (files) => {
    if (files.reduce((total, current) => total + parseInt(current.fileSize), 0) > 5500) {
      this.setState({ uploadDocValidationImage: "Image size of all selected images should not be more than 5 MB", isBtnLoading: false })
      return;
    }
    this.setState({
      isBtnLoading: true, uploadDocValidationImage: false
    });
    let reqOBJ = {
      Images:
        files.map((files) => ({
          fileExtension: files.fileExtension,
          fileContentType: files.fileContentType,
          fileData: files.fileData,
          fileName: files.fileName,
          fileSize: files.fileSize,
        }))
    }
    let reqURL = "media/add";
    apiRequester_quotation_api(reqURL, reqOBJ, (files) => {
      if (files.error) {
        this.setState({ uploadDocValidationImage: files.error, images: [], isBtnLoading: false })
      }
      else {
        this.setState({ isSuccess: "Image(s) Uploaded Successfully.", images: [], isBtnLoading: false })
        setTimeout(() => this.setState({ isSuccess: '' }), 2000,)
      }
    });
  };
  render() {
    const { errors, isBtnLoading } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className='row'>
            <div className='col-sm-12 d-flex justify-content-start'>
              <button className='btn text-dark font-weight-bold' style={{ borderTop: "2px solid #ea7c10" }} onClick={() => this.props.modeData('upload')}>Upload</button>
              <button className='btn text-dark' onClick={() => this.props.modeData('media')}>Media</button>
            </div>
          </div>
          <hr className='border border-1 border-dark mb-5' />
          <div className='row'>
            <div className='col-sm-12'>
              <FileBase64
                multiple={false}
                onDone={this.getFiles.bind(this, true, "image")}
                name="uploadDocument"
                placeholder={"Select Image file"}
              />
              {!this.state.images.length > 0 &&
                <button className='btn d-flex justify-content-center disabled' data-toggle="tooltip" data-placement="right" title="The following filetype can be uploaded:JPG , JPEG , PNG , GIF">
                  <figure>
                    <img
                      style={{ filter: "none" }}
                      src={info}
                      alt=""
                    />
                  </figure>
                </button>}
              {this.state.images.length > 0 && <div>
                {!isBtnLoading ?
                  <button className='btn btn-primary mx-3 px-4 text-light' onClick={() => this.saveImages(this.state.images)}>
                    Upload
                  </button> :
                  <button className='btn btn-primary mx-3 px-4 text-light'>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Upload
                  </button>
                }
              </div>
              }
            </div>
          </div>

          <div className='row'>
            <div
              className="col-sm-12 p-0 pull-left"
              style={{ marginTop: "-6px" }}
            >
              {this.state.uploadDocValidationImage && (
                <small className="alert alert-danger ml-3 p-1 d-inline-block">
                  {this.state.uploadDocValidationImage}
                </small>
              )}
              {this.state.invalidImageValidation && (
                <React.Fragment>
                  <small className="alert alert-danger ml-3 p-1 d-inline-block">
                    {this.state.invalidImageValidation}
                  </small>
                  <small className="alert alert-danger ml-3 p-1 d-inline-block">
                    Only files with the following extensions are allowed: GIF, PNG, JPG, JPEG
                  </small>
                </React.Fragment>
              )}
              {errors["images"] && (
                <small className="alert alert-danger ml-3 p-1 d-inline-block">
                  {errors["images"]}
                </small>
              )}
              {!this.state.uploadDocValidationImage && this.state.isSuccess && (
                <small className="success alert-success ml-3 p-1 d-inline-block">
                  {this.state.isSuccess}
                </small>
              )}
            </div>
          </div>

          <div className='row'>
            {this.state.images
              .map((item, index) => {
                return (<>
                  <div
                    className="col-lg-4 col-md-6 col-sm-12 mt-3"
                    role="alert"
                    key={index}
                  >
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => this.removeImage(item.id)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <img
                      src={item.fileData}
                      className="img-responsive img-thumbnail"
                      style={{ height: "150px", width: "250px", objectFit: "cover" }}
                    />
                    <label className='text-center'>
                      {item.fileName.length > 20 ? item.fileName.slice(0, 20) + "..." : (item.fileName + "." + item.fileExtension)}
                    </label>
                  </div>
                </>);
              })}
          </div>
        </div>

      </React.Fragment>
    );
  }
}