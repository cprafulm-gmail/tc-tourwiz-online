import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import ActionModal from "../../helpers/action-modal";
import QuotationDetailsItems from "./quotation-details-items";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";
import { Trans } from "../../helpers/translate";
import FileBase64 from "../../components/common/FileBase64";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
import * as Global from "../../helpers/global";
import { apiRequester_unified_api } from "../../services/requester-unified-api";


class QuotationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "cart",
      cart: null,
      isRemoveCartLoading: null,
      deleteItem: "",
      isDeleteConfirmPopup: false,
      isDetailPopup: false,
      data: {
        quickproposalcomments: props.quickproposalcomments || ""
      },
      fileName: props.fileName || "",
      filePath: props.documentPath || "",
      uploadDocValidationImage: "",
      isSaving: false,
    };
  }
  handleItemDelete = (item) => {
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, ((this.props.type === "Quotation" || this.props.type === "Quotation_Master") ? "QuotationDetails~quotation-delete-item" : "ItineraryDetails~itineraries-delete-item"))) {
      this.setState({ deleteItem: item, isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    }
    else {
      this.props.handleItemDelete(item);
    }
  };

  handleConfirmDelete = (isConfirmDelete) => {
    this.setState({ isDeleteConfirmPopup: !this.state.isDeleteConfirmPopup });
    isConfirmDelete && this.props.handleItemDelete(this.state.deleteItem);
  };

  showHideDetailPopup = () => {
    this.setState({ isDetailPopup: !this.state.isDetailPopup });
  };
  getselecteditemstoBook = (data) => {
    this.props.getselecteditemsBook(data);
  }

  getFilesDocument = (files_document) => {
    this.setState({ uploadDocValidationImage: "", isSaving: true });
    if (
      !files_document.file.type.includes("pdf")
      && !files_document.file.type.includes("image/")
    ) {
      this.setState({ uploadDocValidationImage: "Invalid file selected." });
      return;
    }
    else if (files_document.file.size > 4194304) {
      this.setState({ uploadDocValidationImage: "File size should not be greater then 4 MB." });
      return;
    }
    let data = { ...this.state.data }
    data["documentPath"] = files_document.base64;

    let tempRawData = "";
    if (files_document.base64.includes("data:image/jpeg;base64,")) {
      tempRawData = files_document.base64.replace(
        "data:image/jpeg;base64,",
        ""
      );
    } else if (
      files_document.base64.includes("data:image/png;base64,", "")
    ) {
      tempRawData = files_document.base64.replace(
        "data:image/png;base64,",
        ""
      );
    } else if (
      files_document.base64.includes("data:application/msword;base64,", "")
    ) {
      tempRawData = files_document.base64.replace(
        "data:application/msword;base64,",
        ""
      );
    } else if (
      files_document.base64.includes("data:application/pdf;base64,", "")
    ) {
      tempRawData = files_document.base64.replace(
        "data:application/pdf;base64,",
        ""
      );
    } else if (
      files_document.base64.includes(
        "data:application/x-zip-compressed;base64,",
        ""
      )
    ) {
      tempRawData = files_document.base64.replace(
        "data:application/x-zip-compressed;base64,",
        ""
      );
    } else if (
      files_document.base64.includes(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
        ""
      )
    ) {
      tempRawData = files_document.base64.replace(
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
        ""
      );
    }

    let filedata_base64 = tempRawData;
    const reqOBJ = {
      Name: files_document.name,
      Extension: "." + files_document.type.split("/")[1],
      ContentType: files_document.type,
      Data: filedata_base64
    };
    let reqURL = "tw/image/validate";
    this.setState({ isSaving: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      if (resonsedata && resonsedata.response && resonsedata.response.toLowerCase() === "success") {

        data["fileExtension"] = "." + files_document.type.split("/")[1];
        data["fileContentType"] = files_document.type;
        data["fileData"] = filedata_base64;
        data["fileName"] = files_document.name;

        // let localQuotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
        // localQuotationInfo.fileExtension = "." + files_document.type.split("/")[1];
        // localQuotationInfo.fileContentType = files_document.type;
        // localQuotationInfo.fileData = filedata_base64;
        // localQuotationInfo.fileName = files_document.name;
        // localStorage.setItem(
        //   "quotationDetails",
        //   JSON.stringify(localQuotationInfo)
        // );
        //this.props.savequot();
        this.setState({ data, fileName: files_document.name, isSaving: false });
      }
      else {
        this.setState({ uploadDocValidationImage: "Invalid file selected.", isSaving: false });
        return;
      }
    }.bind(this), "POST");
  }

  render() {
    this.props.detailsRef.current = this.state;
    const { items, userInfo, type } = this.props;
    const { isDeleteConfirmPopup } = this.state;
    let quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    let tmpTypeConcate = type.includes('Master') ? "master-" : '';
    return (
      <div className="quotation-details border shadow-sm mt-3">
        <div className="border-bottom bg-light d-flex p-3">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              name={"file-text"}
              className="mr-2 d-flex align-items-center"
              width="24"
              type="fill"
            ></SVGIcon>
            <h6 className="font-weight-bold m-0 p-0">{this.props.isQuickProposal ? "Quick " + Trans("_quotationReplaceKey") : Trans("_quotationReplaceKey")} Details</h6>
          </div>
          {!this.props.isQuickProposal && quotationInfo.status.toLowerCase() !== "booked" &&
            <AuthorizeComponent
              title={"QuotationDetails~" + tmpTypeConcate + "quotation-terms-and-conditions"}
              type="button"
              rolepermissions={this.props.userInfo.rolePermissions}
            >
              <button
                className="btn btn-sm btn-outline-primary ml-2 mr-2 pull-right"
                onClick={() => this.props.savetermsconditions()}
              >
                Terms & Conditions
              </button>
            </AuthorizeComponent>
          }
        </div>
        {!this.props.isQuickProposal &&
          items.map(
            (item, key) =>
              item.offlineItem && (
                <QuotationDetailsItems
                  key={key}
                  handleItemDelete={this.handleItemDelete}
                  handleItemEdit={this.props.handleItemEdit}
                  item={item}
                  type={this.props.type}
                  userInfo={userInfo}
                  getselecteditemstoBook={this.getselecteditemstoBook}
                  isRemovePriceAndActionButton={true}
                />
              )
          )
        }

        {this.props.isQuickProposal &&
          <div className="border-bottom p-3 quotation-details-item dayview-item">
            <div className="container">
              <div className="row">
                {/* <div className="col-lg-1 pr-0">
                  <label>Attached File</label>
                </div> */}
                <div className="col-lg-5 d-flex justify-content-start pr-0">
                  <p className="mr-3 pt-2">Attached File</p>

                  <FileBase64
                    multiple={false}
                    onDone={this.getFilesDocument.bind(this)}
                    name="uploadDocument"
                    // label={"Attached File"}
                    placeholder={"Select file"}
                    className="pr-0"
                  />


                </div>
                <div className="col-lg-7 p-0 d-flex justify-content-start pr-0">
                  {!this.state.uploadDocValidationImage && (
                    <>
                      {this.state.isSaving
                        ? <span className="text-success mt-1">
                          <span
                            className="spinner-border spinner-border-sm mr-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {this.state.fileName !== "" ? this.state.fileName : this.props.fileName}
                        </span>
                        : <span className="text-success mt-1">{this.state.fileName !== "" ? this.state.fileName : this.props.fileName}</span>}
                    </>
                  )}
                  {this.state.filePath !== "" &&
                    <a
                      className="btn btn-link  text-primary"
                      href={this.state.filePath
                      }
                      target="_blank"
                      download={this.state.fileName}
                    >
                      Download
                    </a>
                  }
                  {this.state.uploadDocValidationImage && (
                    <small className="alert alert-danger p-1 mt-1 mr-2">
                      {this.state.uploadDocValidationImage}
                    </small>
                  )}
                  <p className="pt-2 text-secondary">( Supported Format : pdf, jpg, png, jpeg )</p>
                </div>
                <div className="col-lg-12">
                  <CKEditor
                    editor={ClassicEditor} config={Global.toolbarFCK}
                    data={decode(this.state.data.quickproposalcomments)}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      let dataState = this.state.data;
                      dataState.quickproposalcomments = encode(data);
                      // let localQuotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
                      // localQuotationInfo.quickproposalcomments = encode(data);
                      // localStorage.setItem(
                      //   "quotationDetails",
                      //   JSON.stringify(localQuotationInfo)
                      // );
                      //this.props.savequot();
                      this.setState({ dataState });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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

export default QuotationDetails;
