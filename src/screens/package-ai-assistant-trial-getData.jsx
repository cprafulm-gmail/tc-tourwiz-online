import React, { useEffect, useState } from 'react';
import sendIcon from "../assets/images/send-fill.svg";
import infoIcon from "../assets/images/info-circle.svg";
import SVGIcon from "../helpers/svg-icon";
import trashImage from "../assets/images/x-circle -light.svg";
import PackageAIAssistantPrompt from './package-ai-assistant-prompt';
import { apiRequester } from '../services/requester';
import { useHistory } from 'react-router-dom';
const style = {
  adiv: {
    background: "linear-gradient(90deg,#fa7438 0,#891d9b)",
    borderRadius: "15px",
    boxShadow: "10px 10px lightblue",
    // borderBottomRightRadius: 0,
    // borderBottomLeftRadius: 0,
    // fontSize: "16px",
    // height: "46px",
  },
  bdiv: {
    color: "#fff",
    borderRadius: "15px",
    boxShadow: "10px 10px 10px 10px #EDDEF0",
  },
  formcontrol: {
    borderRadius: "12px",
    border: "1px solid #ced4da",
    fontSize: "14px",
    boxShadow: "none",
  },
  formcBtn: {
    background: "#EDDEF0 !important",
    color: "#fa7438",
    borderRadius: "12px",
    fontSize: "16px",
    boxShadow: "none",
  },
  formcBtnDisable: {
    background: "#EDDEF0 !important",
    color: "#fa7438",
    borderRadius: "12px",
    fontSize: "16px",
    boxShadow: "none",
    cursor: "not-allowed",
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
function PackageAIAssitantTrialGetData(props) {
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistoryResponse] = useState([]);
  const [noOfDay, setNoOfDay] = useState("");
  const [chatErrorMsg, setChatErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpSection, setHelpSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [versionBox, setVersionBox] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const history = useHistory();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleNoOfDayChange = (event) => {
    setNoOfDay(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handleSellPriceChange = (event) => {
    setSellPrice(event.target.value);
  }
  const handleSubmit = async (event) => {
    let inputString = noOfDay + " days itinerary for " + inputValue;
    setLoading(true);
    event.preventDefault();
    await pre_getResponseFromOpenAI(inputString);
  };
  const helpQuestion = (mode) => {
    setHelpSection(mode);
    setVersionBox(false);
  }
  const pre_getResponseFromOpenAI = async (input) => {
    let response = await getResponseFromOpenAI(input);
    let objChatHistory = [...chatHistory];
    if (response.code === 1) {
      // objChatHistory.push({ searchKey: input, responseData: response.data })
      props.getPreResponse(input, response.data)
      // setChatHistoryResponse(objChatHistory);
    }
    else {
      let errorMsg = "An error occurred. If this issue persists try again."
      props.getPreError(input, errorMsg);
      // objChatHistory.push({ searchKey: input, responseData: "An error occurred. If this issue persists try again." })
      // setChatErrorMsg(objChatHistory);
    }
    setLoading(false);
    setInputValue("");
    setNoOfDay("");
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
  const handleBack = () => {
    props.trialMode ? props.handleHide() : history.push('/');
  }
  return (
    <React.Fragment>
      <div class="container" >
        <div class="row">
          <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div class="card border-0 shadow rounded-3 my-5" style={style.adiv}>
              <div class="card-body p-4 p-sm-5" style={style.bdiv}>
                <h2 class="card-title text-center mb-5 fw-light fs-5">TourwizAI</h2>
                <form>
                  <div class="form-floating mb-3">
                    {/* <label>Destination</label> */}
                    <input type="text"
                      class="form-control"
                      placeholder="Destination"
                      style={style.formcontrol}
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div class="form-floating mb-3">
                    {/* <label>No Of Days</label> */}
                    <input type="text"
                      class="form-control"
                      placeholder="# Number of Days"
                      style={style.formcontrol}
                      value={noOfDay}
                      onChange={handleNoOfDayChange}
                    />
                  </div>
                  <div class="d-block">
                    {(loading && inputValue !== "" && noOfDay !== "") &&
                      <button class="btn btn-light btnLogin text-uppercase fw-bold w-100"
                        type="submit"
                        style={style.formcBtn}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Build Itinerary"
                      >
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>Build Itinerary
                      </button>
                    }
                    {(!loading && inputValue !== "" && noOfDay !== "") &&
                      <button class="btn btn-light btnLogin text-uppercase fw-bold w-100"
                        type="submit"
                        style={style.formcBtn}
                        onClick={handleSubmit}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Build Itinerary"
                      >
                        Build Itinerary
                      </button>
                    }
                    {(inputValue === "" || noOfDay === "") &&
                      <button class="btn btn-light btnLogin text-uppercase fw-bold w-100"
                        type="submit"
                        style={style.formcBtnDisable}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Build Itinerary"
                        disabled={true}

                      >
                        Build Itinerary
                      </button>
                    }
                    {(loading && inputValue !== "" && noOfDay !== "") &&
                      <small className='text-light f20'>Please bear with me for a moment as I generate your itinerary.</small>
                    }
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PackageAIAssitantTrialGetData