import React, { useEffect, useState } from 'react';
import sendIcon from "../assets/images/send-fill.svg";
import infoIcon from "../assets/images/info-circle.svg";
import handIcons from "../assets/images/hand-index.svg";
import shareIcon from "../assets/images/share.svg";
import SVGIcon from "../helpers/svg-icon";
import trashImage from "../assets/images/x-circle -light.svg";
import PackageAIAssistantPrompt from './package-ai-assistant-prompt';
import { apiRequester_unified_api } from '../services/requester-unified-api';
import { apiRequester } from '../services/requester';

const style = {
  html: {
    scrollBehavior: "smooth"
  },
  adiv: {
    background: "linear-gradient(90deg,#fa7438 0,#891d9b)",
    borderRadius: "15px",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    fontSize: "16px",
    height: "46px",
  },
  bdiv: {
    // background: "linear-gradient(90deg,#fa7438 0,#891d9b)",
    color: "#fa7438",
    borderRadius: "15px",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottom: "1px solid #fa7438",
    fontSize: "14px",
    // height: "26px",
  },
  formcontrol: {
    borderRadius: "12px",
    border: "1px solid #ced4da",
    fontSize: "14px",
    boxShadow: "none",
  },
  formcBtn: {
    borderRadius: "12px",
    fontSize: "16px",
    boxShadow: "none",
  },
  promptChat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "12px",
    borderRadius: "20px",
  },
  useChat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "14px",
    borderRadius: "20px",
  },
  card: {
    border: "none",
    borderRadius: "15px",
  },
  chat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "14px",
    borderRadius: "20px",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordWrap: "break-word"
  },
  moveChat: {
    border: "none",
    background: "#2d2d4136",
    fontSize: "14px",
    borderRadius: "20px",
  },
  copyChat: {
    border: "none",
    background: "#f1824738",
    fontSize: "14px",
    borderRadius: "20px",
  },
  alertBox: {
    fontSize: "12px",
    borderRadius: "20px",
  },
  bgwhite: {
    border: "1px solid #E7E7E9",
    fontSize: "14px",
    borderRadius: "20px",
  },
  img: {
    borderRadius: "20px",
  },
  dot: {
    fontWeight: "bold",
  },
}
function PackageAIAssitant(props) {
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistoryResponse] = useState([]);
  const [chatErrorMsg, setChatErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpSection, setHelpSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [versionBox, setVersionBox] = useState(true);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    await pre_getResponseFromOpenAI(inputValue);
  };
  const helpQuestion = (mode) => {
    setHelpSection(mode);
    setVersionBox(false);
  }
  const pre_getResponseFromOpenAI = async (input) => {
    let response = await getResponseFromOpenAI(input);
    let objChatHistory = [...chatHistory];
    if (response.code === 1) {
      objChatHistory.push({ searchKey: input, responseData: response.data })
      setChatHistoryResponse(objChatHistory);
    }
    else {
      objChatHistory.push({ searchKey: input, responseData: "An error occurred. If this issue persists try again." })
      setChatErrorMsg(objChatHistory);
    }
    setLoading(false);
    setInputValue("");
  }
  const getResponseFromOpenAI = async (input) => {
    let reqOBJ = { Request: input };
    let reqURL = "api/v1/openai";
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          if (data.error) {
            reject({ code: 0, error: "This is general error message." });
          }
          else
            // resolve({ requestData: input, aiResponseData: data.response[0] });
            resolve({ code: 1, data: data.response[0] });
        }.bind(this),
        "POST"
      );
    });
  }
  const setHelpInput = (selectedHelp) => {
    switch (selectedHelp) {
      case 1:
        setInputValue("Generate a 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine.");
        setHelpSection(false);
        break;
      case 2:
        setInputValue("Plan a 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.");
        setHelpSection(false);
        break;
      case 3:
        setInputValue("Make a 5-day itinerary for [city name] including top attractions and must-try food dishes.");
        setHelpSection(false);
        break;
      case 4:
        setInputValue("Design a 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences.");
        setHelpSection(false);
        break;
      case 5:
        setInputValue("Create a 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.");
        setHelpSection(false);
        break;
      case 6:
        setInputValue("Generate a 2-week itinerary with airport transfers for [city 1] and [city 2] including top attractions and must-try food options in each location.");
        setHelpSection(false);
        break;
      case 7:
        setInputValue("Plan a 5-day trip with airport transfers to [city 1], [city 2], and [city 3] highlighting outdoor activities and unique food experiences in each place.");
        setHelpSection(false);
        break;
      case 8:
        setInputValue("Make a 7-day itinerary with airport transfers for [city 1], [city 2], and [city 3] showcasing both historical landmarks and traditional food specialties in each location.");
        setHelpSection(false);
        break;
      case 9:
        setInputValue("Design a 3-day itinerary with airport transfers for [city 1] and [city 2] focusing on cultural attractions and local cuisine in each place.");
        setHelpSection(false);
        break;
      case 10:
        setInputValue("Create a 4-day itinerary with airport transfers for [city 1], [city 2], and [city 3] that includes top tourist sites and food recommendations in each location.");
        setHelpSection(false);
        break;
      case 11:
        setInputValue("Generate an overview of 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine in 2-5 lines.");
        setHelpSection(false);
        break;
      case 12:
        setInputValue("Plan an overview of 3-day trip to [city name] with a mix of popular tourist sites and food recommendations in 2-5 lines.");
        setHelpSection(false);
        break;
      case 13:
        setInputValue("Make an overview of 5-day itinerary for [city name] including top attractions and must-try food dishes in 2-5 lines.");
        setHelpSection(false);
        break;
      case 14:
        setInputValue("Design an overview of 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences in 2-5 lines.");
        setHelpSection(false);
        break;
      case 15:
        setInputValue("Create an overview of 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties in 2-5 lines.");
        setHelpSection(false);
        break;
      case 16:
        setInputValue("One way flight options for [Airport 1] to [Airport 2] with details.");
        setHelpSection(false);
        break;
      case 17:
        setInputValue("Round Trip way flight options for [Airport 1] to [Airport 2] with details.");
        setHelpSection(false);
        break;
      case 18:
        setInputValue("Multi Destination flight options for [Airport 1] to [Airport 2] to [Airport 3] with details.");
        setHelpSection(false);
        break;
      case 19:
        setInputValue("Provide Inclusions and Exclusions for [city name] Package.");
        setHelpSection(false);
        break;
      case 20:
        setInputValue("Generate Inclusions and Exclusions for [city name] Itinerary.");
        setHelpSection(false);
        break;
      case 21:
        setInputValue("Generate a Price Guideline table for itinerary for [city name] with a focus on cultural attractions and local cuisine.");
        setHelpSection(false);
        break;
      case 22:
        setInputValue("Generate a Price Guideline table 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.");
        setHelpSection(false);
        break;
      case 23:
        setInputValue("Make a Price Guideline table 5-day itinerary for [city name] including top attractions and must-try food dishes.");
        setHelpSection(false);
        break;
      case 24:
        setInputValue("Terms & Conditions for itinerary for [city name] highlighting outdoor activities and unique food experiences.");
        setHelpSection(false);
        break;
      case 25:
        setInputValue("Terms & Conditions for 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.");
        setHelpSection(false);
        break;
      case 26:
        setInputValue("Terms & Conditions for 5-day itinerary for [city name] including top attractions and must-try food dishes.");
        setHelpSection(false);
        break;
      default:
        setInputValue("something went wrong");
        break;
    }
  }
  const handleCopyToClipboard = (response) => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    setTimeout(() => {
      props.handleHide()
    }, 3000);
  };
  function handleVersionBox() {
    setVersionBox(false);
  }
  return (
    <React.Fragment>
      <div className='row m-0 w-100'>
        <div className='row  m-0 w-100'>
          <div className='col-lg-12 p-0'>
            <div class="d-flex flex-row justify-content-between pt-2 pb-2 pl-0 pr-0 w-100  text-white" style={style.adiv}>
              <div className='ml-3'>
                {(props.promptMode !== "Pacakage Overview"
                  && props.promptMode !== "Pacakage Flight"
                  && props.promptMode !== "Itinerary"
                ) && <img
                    style={{ filter: "none", width: "16px" }}
                    src={infoIcon}
                    alt=""
                    onClick={() => helpQuestion(!helpSection)}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Sample Prompts"
                  />
                }
              </div>
              <span class="pb-3">AI Based Package Assistant <sup className='fw-bold' style={{ fontSize: "10px" }}> BETA</sup></span>
              <div className='mr-3'>
                <img
                  style={{ filter: "none", width: "16px" }}
                  src={trashImage}
                  alt=""
                  onClick={() => props.handleHide()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row m-0 w-100' style={{ overflowY: "auto", maxHeight: "350px" }} >
          {versionBox &&
            <div className='col-lg-12 mt-3 d-flex justify-content-center'>
              <div class="alert alert-warning alert-dismissible fade show" role="alert"
                style={style.alertBox}>
                <strong>This version is still in the testing phase.</strong> The provided structure is only a guide, and the itinerary must be modified to match the actual package after being copied.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={handleVersionBox}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          }

          {helpSection &&
            <PackageAIAssistantPrompt
              promptMode={props.promptMode}
              helpQuestion={helpQuestion}
              setHelpInput={setHelpInput}
            />
          }
          <div className={helpSection ? 'col-lg-6' : 'col-lg-12'}>
            <div class="mt-3" style={style.card}>
              {chatHistory.map(itemResponse => {
                return <div>
                  {itemResponse.searchKey && <div class="d-flex flex-row pt-2 pb-2 pl-0 pr-0 mb-3" style={style.chat}>
                    <div class="p-2 w-100 d-flex justify-content-end"><span class="">{itemResponse.searchKey}</span></div>
                  </div>
                  }
                  {itemResponse.responseData && <>

                    <div class="d-flex flex-row p-2" style={style.chat}>
                      <div class="p-2">
                        {itemResponse.responseData}
                      </div>
                    </div>
                    <div className='d-flex flex-row pt-2 pb-2 pl-0 pr-0'>
                      <div class="pt-2 pb-2 pl-0 pr-0" style={style.copyChat}>
                        <button
                          className='btn btn-sm'
                          onClick={() => handleCopyToClipboard(itemResponse.responseData)}
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
                      <div class="pt-2 pb-2 pl-0 pr-0 d-none" style={style.moveChat}>
                        <button
                          className='btn btn-sm'
                        // onClick={() => props.getResponseData(props.responseData)}
                        >
                          <img src={shareIcon} style={{ width: "14px" }} alt='topside' />
                          &nbsp; Move to Itinerary Section
                        </button>
                      </div>
                    </div>
                  </>
                  }
                </div>
              })}
              {/* <div>
                {response && <div class="d-flex flex-row pt-2 pb-2 pl-0 pr-0 mb-3" style={style.chat}>
                  <div class="p-2 w-100 d-flex justify-content-end"><span class="">{inputValue}</span></div>
                </div>
                }
                {response && <>

                  <div class="d-flex flex-row p-2" style={style.chat}>
                    <div class="p-2">
                      {response}
                    </div>
                  </div>
                  <div className='d-flex flex-row pt-2 pb-2 pl-0 pr-0'>
                    <div class="pt-2 pb-2 pl-0 pr-0" style={style.copyChat}>
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
                    <div class="pt-2 pb-2 pl-0 pr-0 d-none" style={style.moveChat}>
                      <button
                        className='btn btn-sm'
                      // onClick={() => props.getResponseData(props.responseData)}
                      >
                        <img src={shareIcon} style={{ width: "14px" }} alt='topside' />
                        &nbsp; Move to Itinerary Section
                      </button>
                    </div>
                  </div>
                </>
                }
              </div> */}
            </div>
          </div>
        </div>
        <div className='row m-0 w-100'>
          {loading === true &&
            <div className='col-lg-12 text-center'>
              <div class="spinner-grow text-secondary" style={{ width: "1rem", height: "1rem" }} role="status">
                <span class="visually-hidden"></span>
              </div>
              <div class="spinner-grow text-secondary" style={{ width: "1rem", height: "1rem" }} role="status">
                <span class="visually-hidden"></span>
              </div>
              <div class="spinner-grow text-secondary" style={{ width: "1rem", height: "1rem" }} role="status">
                <span class="visually-hidden"></span>
              </div>
            </div>
          }

          <div className='col-lg-12'>
            <div class="form-group px-3 d-flex flex-row">
              <textarea class="form-control"
                rows="2"
                placeholder="Type your message"
                style={style.formcontrol}
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                className='btn btn-sm'
                style={style.formcBtn}
                onClick={handleSubmit}
                data-toggle="tooltip"
                data-placement="top"
                title="Send"
              >
                <img
                  style={{ filter: "none" }}
                  src={sendIcon}
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PackageAIAssitant