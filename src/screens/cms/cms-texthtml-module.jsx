import React, { Component } from "react";
import { apiRequesterCMS } from "../../services/requester-cms";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import * as Global from "../../helpers/global";
import MessageBar from "../../components/admin/message-bar";
import { cmsConfig } from "../../helpers/cms-config";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { encode, decode } from "html-entities";
class CMSTextHTMLModule extends Component {
  state = {
    showSuccessMessage: false,
    editSource: false,
    data: {
      HTMLPortalID: 0,
      HTMLModuleID: 0,
      HTMLModuleContent: ""
    },
    HTMLModuleList: [],
    resultHTMLModule: "",
    isBtnLoading: false,
  };

  componentDidMount() {
    this.getHTMLModuleList();
  }

  getHTMLModuleList = () => {
    this.setState({ isLoading: true });
    const reqOBJ = {};
    let reqURL = "cms/htmlmodule/list?siteurl=" + this.props.portalURL.replace("http://", "").replace("https://", "").replace("/cms", "");
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      let dataState = this.state.data;
      dataState.HTMLPortalID = resonsedata && resonsedata.response && resonsedata.response[0].portalID > 0 && resonsedata.response[0].portalID;
      this.setState({ dataState });
      this.setState({ HTMLModuleList: resonsedata.response, isLoading: false, data: dataState });
    }.bind(this), "GET");
  }

  getHTMLModuleDetails = (id) => {
    if (id > 0) {
      this.setState({ isLoading: true });
      const reqOBJ = {};
      let reqURL = "cms/htmlmodule/get?mid=" + id;
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        this.setState({ resultHTMLModule: resonsedata.response, isLoading: false });
      }.bind(this), "GET");
    }
    else {

      this.setState({ resultHTMLModule: "", isLoading: false });
    }
  }
  updateHTMLModuleContent = () => {
    let data = this.state.data;
    this.setState({ isBtnLoading: true });
    const reqOBJ = {
      request: {
        PortalID: data.HTMLPortalID,
        ModuleID: data.HTMLModuleID,
        HTMLContent: data.HTMLModuleContent
      },
    };
    let reqURL = "cms/htmlmodule/update";
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {

      this.setState({ isBtnLoading: false, isLoading: false, showSuccessMessage: true });
    }.bind(this), "POST");
  }


  handleHTMLModuleChange1 = (e) => {
    this.setState({
      editSource: !this.state.editSource,
    });
  }
  handleHTMLModuleChange = (e) => {
    let { data } = this.state;
    data[e.target.name] = e.target.value;
    this.setState({ data });
    if (e.target.name === "HTMLModuleID" && e.target.value > -1)
      this.getHTMLModuleDetails(e.target.value);
  }

  render() {
    const { id, editSource, results, isLoading, activeTab, module, showSuccessMessage, tabs,
      isDeleteConfirmPopup, isShowForm, idForEdit, mode, data, HTMLModuleList, resultHTMLModule, disabled, isBtnLoading } = this.state;
    const { cmsSettings } = this.props;

    var pretty = require('pretty');
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
              Text HTML Modules Details
            </h1>
          </div>
        </div>
        {showSuccessMessage && (
          <MessageBar
            Message={`Content updated successfully.`}
            handleClose={() => this.setState({ showSuccessMessage: false })}
          />
        )}
        <div className="col-lg-6 col-md-6 col-sm-6">
          <div className={"form-group " + "ParentBranch"}>
            <label htmlFor={"HTMLModuleID"}>{"Select Text HTML Module *"}</label>
            <div className="input-group">
              <select
                value={data.HTMLModuleID}
                onChange={(e) => this.handleHTMLModuleChange(e)}
                name={"HTMLModuleID"}
                id={"HTMLModuleID"}
                className={"form-control"}>
                <option key={0} value={''}>Select</option>
                {this.state.HTMLModuleList.map((option, key) => option["htmlPages"] !== "HTML-Widget" && option["htmlPages"] !== "HowItWorks" && (

                  <option
                    key={key}
                    value={
                      option["moduleID"]
                    }
                  >
                    {option["htmlPages"]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {resultHTMLModule && <React.Fragment> <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="form-group locationName clearfix">
            {/* {"Tab" + i}
                                {"Active " + activeTab} */}
            {"Tab Description"}
            <CKEditor
              key={"asdasd"}
              id={"tab1"}
              editor={ClassicEditor} config={Global.toolbarFCK}
              data={resultHTMLModule ? decode(resultHTMLModule[0].desktopHtml) : ""}
              onChange={(event, editor) => {

                const data = editor.getData();
                let dataState = this.state.data;
                dataState.HTMLModuleContent = encode(data);
                this.setState({ dataState });
              }}
            />
            <div>
              <button onClick={(e) => this.handleHTMLModuleChange1(e)} style={{ border: "0px", position: "absolute", top: "31px", background: "none", right: "24px" }} >Source</button>
            </div>

            {editSource && <textarea onChange={e => { var newData = this.state.data; newData.HTMLModuleContent = e.target.value; this.setState({ data: newData }) }} style={{ width: "96.8%", borderColor: "#c4c4c4", position: "absolute", top: "63px", height: "86.4%" }} value={resultHTMLModule ? pretty(decode(resultHTMLModule[0].desktopHtml)) : ""}></textarea>}

          </div>
        </div>

          <div className="col-lg-12 col-md-12 col-sm-12">

            <div className="row mt-3">

              {!disabled && (
                <div className="col-lg-2 mt-2">
                  <div className="form-group">
                    {!isBtnLoading ? <button
                      onClick={() => this.updateHTMLModuleContent()}
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      {isBtnLoading ? (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      Update
                    </button> :
                      <button
                        className="btn btn-primary w-100 text-capitalize"
                      >

                        {isBtnLoading ? (
                          <span
                            className="spinner-border spinner-border-sm mr-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        Update
                      </button>}
                  </div>
                </div>
              )}
              {/* {!disabled && (
                <div className="col-lg-2 mt-2">
                  <div className="form-group">
                    <button
                      onClick={() =>
                        this.props.history.push("/HotdealsList")
                      }
                      className="btn btn-primary w-100 text-capitalize"
                    >
                      {" "}
                      Cancel
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </React.Fragment>
        }
      </div>
    );
  }
}

export default CMSTextHTMLModule;
