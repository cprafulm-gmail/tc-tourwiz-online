import React, { useState } from 'react';
import trashImage from "../assets/images/x-circle -light.svg";
import sendIcon from "../assets/images/send-fill.svg";
import shareIcon from "../assets/images/share.svg";
import HtmlParser from "../helpers/html-parser";
import SVGIcon from "../helpers/svg-icon";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const style = {
  card: {
    // width: "300px",
    border: "none",
    borderRadius: "15px",
    // border: "1px solid #ced4da",
    // borderRadius: "15px"
  },
  chat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "15px",
    borderRadius: "20px",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordWrap: "break-word"
  },
  moveChat: {
    border: "none",
    background: "#2d2d4136",
    fontSize: "15px",
    borderRadius: "20px",
  },
  copyChat: {
    border: "none",
    background: "#f1824738",
    fontSize: "15px",
    borderRadius: "20px",
  },
  alertBox: {
    fontSize: "12px",
    borderRadius: "20px",
  },
  bgwhite: {
    border: "1px solid #E7E7E9",
    fontSize: "15px",
    borderRadius: "20px",
  },
  img: {
    borderRadius: "20px",
  },
  dot: {
    fontWeight: "bold",
  },
}
function PackageAssistant(props) {
  const [copied, setCopied] = useState(false);
  const [versionBox, setVersionBox] = useState(true);
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(props.responseData);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    setTimeout(() => {
      props.closeAssitant(false);
    }, 3000);
  };
  function handleVersionBox() {
    setVersionBox(false);
  }
  let chatActionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
  return (
    <React.Fragment>
      <div class="container">
        <div className='row'>
          {versionBox &&
            <div className='col-lg-12 mt-3 d-flex justify-content-center'>
              <div class="alert alert-warning alert-dismissible fade show mx-4" role="alert"
                style={style.alertBox}>
                <strong>This version is still in the testing phase.</strong> The provided structure is only a guide, and the itinerary must be modified to match the actual package after being copied.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={handleVersionBox}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          }
          <div className='col-lg-12'>
            <div class="mt-3" style={style.card}>
              <div>
                {props.responseData && <div class="d-flex flex-row p-3">
                  <div class="mr-2 p-3 w-100 d-flex justify-content-end" style={style.chat}><span class="">{props.inputData}</span></div>
                </div>
                }
                {props.responseData && <>

                  <div class="d-flex flex-row p-3">
                    <div class="ml-2 p-3" style={style.chat}>
                      {props.responseData}
                    </div>
                  </div>
                  <div className='d-flex flex-row p-3'>
                    <div class="ml-2 p-3" style={style.copyChat}>
                      <button
                        className='btn btn-sm'
                        onClick={handleCopyToClipboard}
                      >
                        {copied
                          ? <span className='alert alert-sm p-0 text-primary' >
                            <SVGIcon
                              name="copy"
                              width="12"
                              height="12"
                              className="text-dark"
                            ></SVGIcon>
                            &nbsp;Copied</span>
                          : <span className='alert alert-sm p-0'>
                            <SVGIcon
                              name="copy"
                              width="12"
                              height="12"
                              className="text-dark"
                            ></SVGIcon>
                            &nbsp;
                            Copy To Clipboard </span>}
                      </button>
                    </div>
                    <div class="ml-2 p-3 d-none" style={style.moveChat}>
                      <button
                        className='btn btn-sm'
                        onClick={() => props.getResponseData(props.responseData)}
                      >
                        <img src={shareIcon} style={{ width: "14px" }} alt='topside' />
                        &nbsp; Move to Itinerary Section
                      </button>
                    </div>
                  </div>
                </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PackageAssistant