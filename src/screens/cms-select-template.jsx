import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import MessageBar from "../components/admin/message-bar";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import { apiRequesterCMS } from "../services/requester-cms";
import QuotationMenu from "../components/quotation/quotation-menu";
import TemplateThumb1 from "../assets/images/customer-portal/template-1-thumb.png";
import TemplateThumb2 from "../assets/images/customer-portal/template-2-thumb.png";
import TemplateThumb3 from "../assets/images/customer-portal/template-3-thumb.png";
import TemplateThumb4 from "../assets/images/customer-portal/template-4-thumb.png";
import Template2 from "../assets/images/customer-portal/template-2.png";
import Template3 from "../assets/images/customer-portal/template-3.png";
import Template4 from "../assets/images/customer-portal/template-4.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const CMSSelectTemplate = (props) => {
  const [state, setState] = useState({ cmsSettings: "", Name: "", EmailAddress: "", themeCode: "", isCMSPortalCreated: true, customHomeURL: "", showSuccessMessage: false });

  const handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        props.history.push(`/Backoffice/${req}`);
      else {
        props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      props.history.push(`${req}`);
    }
  };

  const getCMSPortalSetting = async (siteurl) => {
    let reqOBJ = {};
    debugger
    let reqURL = "cms/portal/details?siteurl=" + siteurl.replace("http://", "") + "/cms";
    return new Promise((resolve, reject) => {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          setState((prevState) => {
            return {
              ...prevState,
              cmsSettings: (data?.response && data?.response[0]) || "",
              themeCode: (data?.response && data?.response[0].themeName) || "",
              customHomeURL: siteurl
            };
          });
          resolve();
        },
        "GET"
      );
    });
  };


  const updateCMSPortalTheme = async (TemplateId) => {
    let reqOBJ = {
      Request: {
        PortanlURL: state.customHomeURL,
        TemplateId: TemplateId,
        EmailAddress: state.EmailAddress,
        UserName: state.Name
      }
    };
    debugger
    let reqURL = "cms/portaltheme/update";
    return new Promise((resolve, reject) => {
      apiRequesterCMS(
        reqURL,
        reqOBJ,
        (data) => {
          if (data?.response !== "failed") {
            setState((prevState) => {
              return {
                ...prevState,
                themeCode: data?.response,
                showSuccessMessage: true
              };
            });
            resolve();
          }
          else {
            reject();
          }
        },
        "POST"
      );
    });
  };

  const getUserData = async () => {
    const reqOBJ = {
    };
    let reqURL = "admin/user/details";
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
        let data = resonsedata.response[0]
        let Name = data.firstName + " " + data.lastName;
        let EmailAddress = data.customerCareEmail;
        setState((prevState) => { return { ...prevState, Name, EmailAddress } });
        resolve();
      }.bind(this), "GET");
    });
  }

  useEffect(() => {
    (async () => { await getBasicData(); await getUserData(); })();
  }, []);

  const getBasicData = async () => {

    var reqURL = "tw/portal/info";
    return new Promise((resolve, reject) => {
      apiRequester_unified_api(
        reqURL,
        null,
        (data) => {

          if (data.response[0].isCMSPortalCreated === "true") {
            setState((prevState) => {
              return {
                ...prevState, isLoading: false, customHomeURL: data.response[0].customHomeURL, isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true"
              };
            });
            (async () => { await getCMSPortalSetting(data.response[0].customHomeURL); })();
          }
          resolve();
          //setState({ isLoading: false, portalURL: data.response[0].customHomeURL, isCMSPortalCreated: data.response[0].isCMSPortalCreated === "true" });
        }, 'GET');
    });
  }

  const { cmsSettings, themeCode, isCMSPortalCreated, showSuccessMessage } = state;
  const css = `
    .demoA { filter: blur(2px); }
    .frontB {
      display: flex;
      background: #8df5ad47;
      text-align: center;
      align-items: center;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 79px;
      margin: auto;
      top: 0;
      margin-left: auto;
      margin-right: auto;
      z-index: 100;
      justify-content: center;
      color: #fff;
      font-size: 20px;
      text-shadow: 2px 2px #545454;
  }`
  return (
    <div className="profile">
      <style>{css}</style>
      <div className="title-bg pt-3 pb-3 mb-3">
        <Helmet>
          <title>
            Select Template
          </title>
        </Helmet>
        <div className="container">
          <h1 className="text-white m-0 p-0 f30">
            <SVGIcon
              name="file-text"
              width="24"
              height="24"
              className="mr-3"
            ></SVGIcon>
            Select Template
          </h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {showSuccessMessage && (
            <MessageBar
              Message={`Template updated successfully.`}
              handleClose={() => setState((prevState) => { return { ...prevState, showSuccessMessage: !showSuccessMessage }; })}
            />
          )}
          <div className="col-lg-3 hideMenu">
            <QuotationMenu handleMenuClick={handleMenuClick} userInfo={props.userInfo} />
          </div>
          <div className="col-lg-9 mt-4">
            <h4 className="text-primary mb-3">Templates</h4>
            {(!isCMSPortalCreated || (isCMSPortalCreated && themeCode !== "")) ? (
              <div className="row">
                <div className="col-lg-3">
                  <div className="shadow position-relative">
                    {themeCode === "AF-010" ? (<div>
                      <div className="frontB">Selected</div>
                      <img
                        class="img-fluid demoA"
                        src={TemplateThumb1}
                        alt="Template 1"
                      />
                    </div>) : (<img
                      class="img-fluid" style={{ cursor: "pointer" }}
                      src={TemplateThumb1}
                      alt="Template 1"
                      onClick={() => updateCMSPortalTheme(1)}
                      title="Select template"
                    />)}
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      to="/Template1"
                      target="_blank"
                    >
                      Live Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 1</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    {themeCode === "AF-003" ? (<div>
                      <div className="frontB">Selected</div>
                      <img
                        class="img-fluid demoA"
                        src={TemplateThumb2}
                        alt="Template 1"
                      />
                    </div>) : (<img
                      class="img-fluid" style={{ cursor: "pointer" }}
                      src={TemplateThumb2}
                      alt="Template 2"
                      onClick={() => updateCMSPortalTheme(2)}
                      title="Select template"
                    />)}
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      to="/Template2"
                      target="_blank"
                    >
                      Live Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 2</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    {themeCode === "AF-002" ? (<div>
                      <div className="frontB">Selected</div>
                      <img
                        class="img-fluid demoA"
                        src={TemplateThumb3}
                        alt="Template 1"
                      />
                    </div>) : (<img
                      class="img-fluid" style={{ cursor: "pointer" }}
                      src={TemplateThumb3}
                      alt="Template 3"
                      onClick={() => updateCMSPortalTheme(3)}
                      title="Select template"
                    />)}
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      to="/Template3"
                      target="_blank"
                    >
                      Live Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 3</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    {themeCode === "AF-001" ? (<div>
                      <div className="frontB">Selected</div>
                      <img
                        class="img-fluid demoA"
                        src={TemplateThumb4}
                        alt="Template 1"
                      />
                    </div>) : (<img
                      class="img-fluid" style={{ cursor: "pointer" }}
                      src={TemplateThumb4}
                      alt="Template 4"
                      onClick={() => updateCMSPortalTheme(4)}
                      title="Select template"
                    />)}
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      to="/Template4"
                      target="_blank"
                    >
                      Live Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 4</h5>
                  </div>
                </div>
              </div >) : (<div className="row">
                <div className="col-lg-3">
                  <div className="shadow position-relative">
                    <img
                      class="img-fluid"
                      src={TemplateThumb1}
                      alt="Template 1"
                    />
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      to="/CMSHome"
                      target="_blank"
                    >
                      Live Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 1</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    <img
                      class="img-fluid"
                      src={TemplateThumb2}
                      alt="Template 2"
                    />{" "}
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      onClick={() => window.open(Template2, "_blank")}
                    >
                      Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 2</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    <img
                      class="img-fluid"
                      src={TemplateThumb3}
                      alt="Template 3"
                    />
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      onClick={() => window.open(Template3, "_blank")}
                    >
                      Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 3</h5>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="shadow">
                    <img
                      class="img-fluid"
                      src={TemplateThumb4}
                      alt="Template 4"
                    />
                    <Link
                      className="btn btn-primary w-100"
                      style={{ borderRadius: "0px" }}
                      onClick={() => window.open(Template4, "_blank")}
                    >
                      Preview
                    </Link>
                    <h5 className="text-center p-2 m-0">Template 4</h5>
                  </div>
                </div>
              </div>)}
          </div >
        </div >
      </div >
    </div >
  );
}

export default CMSSelectTemplate;
