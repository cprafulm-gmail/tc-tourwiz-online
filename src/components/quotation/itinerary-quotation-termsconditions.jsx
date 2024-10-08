import React, { Component } from "react";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import { apiRequester } from "../../services/requester";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
import AssistantModelPopup from "../../helpers/assistant-model";
import PackageAIAssitant from "../../screens/package-ai-assistant";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";

class ItineraryQuotationTermsConditions extends Form {
  constructor(props) {
    super(props);
    this.state = {
      isSucessMsg: false,
      data: {
        title: "",
        email: "",
        termsconditions: "",
      },
      errors: {},
      saveMode: false,
      isAssistant: false,
      ipCountryName: "",
      isshowauthorizepopup: false,
    };
  }

  saveTerms = () => {
    this.props.saveTermsConditions();
  }
  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }
  handleSaveTermsConditions = (mode) => {
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    quotationInfo.termsconditions = this.state.data.termsconditions;
    const errors = {};
    if (!this.validateFormData(this.state.data.termsconditions, "special-characters-not-allowed", /[<>]/))
      errors.termsconditions = "< and > characters not allowed";
    this.setState({ errors: errors || {} });
    if (Object.keys(errors).length > 0) return;
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    this.props.saveQuotation();

  };

  saveQuotation = () => {
    this.setState({ saveMode: true });

    var reqURL = "api/v1/cart/persist";
    var reqOBJ = {
      Request: {
        metaData: {
          name: this.state.data.title,
          customerName: this.props.customerName,
          email: this.props.email,
          phone: this.props.phone,
          terms: this.state.data.terms,
          offlineItems: localStorage.getItem("quotationItems"),
        },
        cartID: localStorage.getItem("cartLocalId"),
      },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({ savedCartId: data.info.token });
      }.bind(this)
    );
  };

  setData = () => {
    let defautData = { ...this.state.data };
    defautData.title = this.props.title ? this.props.title : "";
    defautData.email = this.props.email ? this.props.email : "";
    defautData.termsconditions = this.props.termsconditions ? this.props.termsconditions : "";
    this.setState({ data: defautData });
  };

  quotationSuccess = () => {
    this.setState({
      isSucessMsg: !this.state.isSucessMsg,
      errors: {},
      showNoItemSelectedError: false
    });
    setTimeout(() => {
      this.setState({ isSucessMsg: false });
    }, 5000);
  };

  quotationEmailPreview = () => {
    this.setState({
      isEmailPreview: !this.state.isEmailPreview,
      isSupplieritinerany: false
    });
    const quotationInfo = JSON.parse(localStorage.getItem("quotationDetails"));
    quotationInfo.termsconditions = this.state.data.terms;
    localStorage.setItem("quotationDetails", JSON.stringify(quotationInfo));
    this.props.saveQuotation();
  };
  getCountry = () => {
    return fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name.toLowerCase() !== "india" && data?.country_name.toLowerCase() !== "not found") {
          this.setState({ ipCountryName: data?.country_name })
        }
        else {
          this.setState({ ipCountryName: "india" })
        }
        console.log(data, data?.country_name);
      }).catch((err) => {
        this.setState({ ipCountryName: "" })
      });
  };
  componentDidMount() {
    this.getCountry();
    this.setData();
  }
  handleAssistant = () => {
    this.setState({ isAssistant: !this.state.isAssistant });
  }
  render() {
    const style = `
  body {
      overflow: hidden;
  }
  .modal-body {
  overflow-y: scroll !important;
  }
    .ck.ck-editor__top.ck-reset_all {
      position: fixed;
      margin-top: -40px;
      width: 53.8%;
  }
  .ck.ck-editor__main {
    margin-top: 25px;
  }
  .ck.ck-reset.ck-editor.ck-rounded-corners {
  width: 735px;
  }
  .ck.ck-balloon-panel.ck-balloon-panel_arrow_nw.ck-balloon-panel_visible.ck-balloon-panel_with-arrow {
  z-index: 1060;
  }
  .ck.ck-balloon-panel.ck-balloon-panel_arrow_n.ck-balloon-panel_visible.ck-balloon-panel_with-arrow
  {
  z-index: 1060 !important;
  }`
    return (
      <div className="model-popup">
        <style>{style}</style>
        <div className="modal fade show d-block" tabindex='-1'>
          <div
            className={"modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{"Terms & Conditions"}</h5>
                <AuthorizeComponent
                  title="ai-assistant~button"
                  type="button"
                  rolepermissions={this.props.userInfo.rolePermissions}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary ml-5"
                    onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "ai-assistant~button") ? this.handleAssistant() : this.setState({ isshowauthorizepopup: true })}
                  >
                    Your AI Assistant
                  </button>
                </AuthorizeComponent>
                <button
                  type="button"
                  className="close"
                  onClick={this.saveTerms}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-lg-12">
                  <CKEditor
                    editor={ClassicEditor} config={Global.toolbarFCK}
                    data={decode(this.props.termsconditions)}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      let dataState = this.state.data;
                      dataState.termsconditions = encode(data);
                      this.setState({ dataState });
                    }}
                  />
                  {this.props.issavedTermsConditions && (
                    <h6 className="alert alert-success mt-3">
                      Saved Successfully!
                    </h6>
                  )}

                </div>
              </div>
              <AuthorizeComponent
                title={
                  this.props.type === "Itinerary"
                    ? "ItineraryDetails~itineraries-terms-and-conditions"
                    : "QuotationDetails~quotation-terms-and-conditions"
                }
                type="button"
                rolepermissions={this.props.userInfo.rolePermissions}
              >
                <div className="modal-footer">
                  {this.props.isBtnLoading &&
                    <button className="btn btn-primary mr-3">
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Save </button>
                  }
                  {!this.props.isBtnLoading &&
                    <button className="btn btn-primary mr-3" onClick={() => this.handleSaveTermsConditions("save")}> Save </button>
                  }
                  <button className="btn btn-primary mr-3" onClick={this.saveTerms}> Cancel </button>
                </div>
              </AuthorizeComponent>
            </div>
          </div>
          {
            this.state.isAssistant &&
            <AssistantModelPopup
              content={
                <PackageAIAssitant
                  handleHide={this.handleAssistant}
                  promptMode="Pacakage Terms"
                />}
              sizeClass="modal-dialog modal-lg modal-dialog-top p-0"
              handleHide={this.handleAssistant}
            />
          }
          {this.state.isshowauthorizepopup &&
            <ModelPopupAuthorize
              header={""}
              content={""}
              handleHide={this.hideauthorizepopup}
              history={this.props.history}
            />
          }
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default ItineraryQuotationTermsConditions;
