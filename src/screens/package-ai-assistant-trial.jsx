import React, { useEffect, useState } from 'react';
import sendIcon from "../assets/images/send-fill.svg";
import infoIcon from "../assets/images/info-circle.svg";
import SVGIcon from "../helpers/svg-icon";
import trashImage from "../assets/images/x-circle -light.svg";
import PackageAIAssistantPrompt from './package-ai-assistant-prompt';
import { apiRequester } from '../services/requester';
import { useHistory } from 'react-router-dom';
import ModelPopup from '../helpers/model';
const style = {
  html: {
    scrollBehavior: "smooth"
  },
  ItineraryHeader: {
    textAlign: "center",
    marginTop: "30px",
    color: "#fa7438",
    fontWeight: 600,
    // fontFamily: "Poppins",
    fontSize: "32px",

  },
  glow: {
    animation: "blinker 1s linear infinite",
    color: "black",
    background: "#fff"//"linear-gradient(135deg,rgba(235, 72, 134, 1) 0%,rgba(184, 85, 164, 1) 100%)",
  },

  formcBtnDisable: {
    backgroundColor: "#fa7438",
    border: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",
    color: "#fff",
    cursor: "not-allowed",
  },
  message: {
    textAlign: "center",
    marginTop: "30px",
    // color: "#fa7438",
    // fontWeight: 600,
    fontSize: "24px",

  },
  adiv: {
    background: "linear-gradient(90deg,#fa7438 0,#891d9b)",
    // borderRadius: "15px",
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
    // borderRadius: "12px",
    // backgroundColor: "#ffeeba",
    border: "1px solid #ced4da",
    // borderBottom: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",
    height: "62px",
  },
  formcontrolDesc: {
    borderRadius: "12px",
    border: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",
    // height: "62px",
  },
  formcBtn: {
    // borderRadius: "12px",
    backgroundColor: "#ffeeba",
    border: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",

  },
  formcBtnPrompt: {
    // borderRadius: "12px",
    backgroundColor: "#891d9b",
    border: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",
    color: "#fff",

  },
  formcBtnGenrate: {
    // borderRadius: "12px",
    backgroundColor: "#fa7438",
    border: "1px solid #ced4da",
    fontSize: "16px",
    boxShadow: "none",
    color: "#fff",

  },
  promptChat: {
    border: "none",
    // background: "#EDDEF0",
    fontSize: "14px",
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
    border: "1px solid #ced4da",
    // boxShadow: "0px 10px 12px 10px #ced4da",
    background: "#EDDEF0",
    fontSize: "15px",
    borderRadius: "20px",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    color: "black",
  },
  errorChat: {
    border: "1px solid red",
    // boxShadow: "0px 10px 12px 10px #ced4da",
    background: "#EDDEF0",
    fontSize: "15px",
    borderRadius: "20px",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    color: "black",
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
    fontSize: "14px",
    borderRadius: "20px",
  },
  warningBox: {
    position: "absolute",
    top: "32px",
    right: "0px",
    bottom: "0px",
    fontSize: "10px",
    borderRadius: "20px",
  },
  warningCheckBox: {
    position: "absolute",
    top: "33px",
    right: "83px",
    bottom: "0px",
    fontSize: "8px",
    cursor: "pointer",
    height: "11px",
    width: "30px",
    backgroundColor: "black",
    // borderRadius: "20px",
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
function PackageAIAssitantTrial(props) {
  const [inputValue, setInputValue] = useState(props.isEditMode !== "edit" ? "Create a 5 Days itinerary for Paris highlighting outdoor activities, unique food experiences and cultural attractions." : "");
  const [chatHistory, setChatHistoryResponse] = useState([]);
  const [chatErrorMsg, setChatErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpSection, setHelpSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [versionBox, setVersionBox] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [isInputView, setIsInputView] = useState("");
  const [shareRedirectPopup, setShareRedirectPopup] = useState(false);
  const [hideFromDashboard, setHideFromDashboard] = useState(false);
  const history = useHistory();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    setChatErrorMsg("");
    setLoading(true);
    setIsInputView(true);
    setHelpSection(false);
    event.preventDefault();
    await pre_getResponseFromOpenAI(inputValue);
  };
  useEffect(() => {
    setIsInputView(false);
  }, []);
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
      props.isQuickMode && props.handleSetItinerary(objChatHistory);
    }
    else {
      objChatHistory.push({ searchKey: input, responseData: "We are unable to process your query at the moment, as we are currently experiencing a high volume of requests. Please try again after some time." })
      setChatErrorMsg("We are unable to process your query at the moment, as we are currently experiencing a high volume of requests. Please try again after some time.");
      // setChatHistoryResponse(objChatHistory);
      props.isQuickMode && props.handleSetItinerary(objChatHistory);
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
            resolve({ code: 0, error: "This is general error message." });
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
      case 27:
        setInputValue("Recommendations for Indian restaurants in Paris, Rome, and Venice.");
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
  const handleTrialMode = () => {
    props.handleHide();
    if (props.isFromDashBoard) {
      history.push('/QuickPackage/add');
    }
    else {
      history.push('/tourwizAI');
    }

  }
  const handleBack = () => {
    props.trialMode ? props.handleHide() : history.push('/');
  }
  const headerAssitant = "TourWizAI Lite";
  const handleRedirectSignup = () => {
    setShareRedirectPopup(!shareRedirectPopup);
  }
  const handleLogin = () => {
    history.push('/signup-ai-assistant');
  }
  const handleCancel = () => {
    setChatHistoryResponse([]);
    setTitle("");
    setInputValue("Create a 5 Days itinerary for Paris highlighting outdoor activities, unique food experiences and cultural attractions.");
  }
  const handleHideShowDashboardPopup = () => {
    setHideFromDashboard(!hideFromDashboard);
    if (!hideFromDashboard) {
      localStorage.setItem("showTourwizAIPopup", false);
    }
    else {
      localStorage.removeItem('showTourwizAIPopup');
    }
  }
  const css = `
  .glow{
    animation: blinker 1s linear infinite;
    color:"white";
  }
  @keyframes blinker {
  
    50% {
      opacity: 0;
   }
  }
  `;
  return (
    <React.Fragment>
      <div className='row m-0 w-100'>
        <style>{css}</style>
        {props.trialMode &&
          <>
            <div className='row  m-0 w-100'>
              <div className='col-lg-12 p-0'>
                <div class="d-flex flex-row justify-content-between pt-2 pb-2 pl-0 pr-0 w-100  text-white" style={style.adiv}>
                  <div className='ml-3'>
                    <h3 className="badge glow">NEW</h3>
                  </div>
                  <span class="pb-3">{headerAssitant} <sup className='fw-bold' style={{ fontSize: "10px" }}> BETA</sup></span>
                  <div className='mr-3'>
                    {!props.isFromDashBoard &&
                      <>
                        <input
                          type="checkbox"
                          id="selectQuotation"
                          // style={{ marginRight: "10px" }}
                          // value={hideFromDashboard}
                          checked={hideFromDashboard ? true : false}
                          onChange={handleHideShowDashboardPopup}
                          style={style.warningCheckBox}
                        />
                        <label style={style.warningBox} className='ml-1'>Don't show again</label>
                      </>
                    }
                    <img
                      style={{ filter: "none", width: "16px" }}
                      src={trashImage}
                      alt=""
                      onClick={handleBack}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0 w-100' style={{ overflowY: "auto", maxHeight: "350px" }} >
              {versionBox && <>
                {props.isFromDashBoard ? <div className='col-lg-12 mt-3 d-flex justify-content-center'>
                  <div class="alert alert-warning alert-dismissible fade show" role="alert"
                    style={style.alertBox}>
                    <span>Simply type in your queries or use the provided sample prompts to get started. Click the <b>“Prompt”</b>button, select readymade sample and click  <b>“use”</b> button and replace the text in [square brackets] with your text and generate. Edit save and reuse Itineraries.<br /></span>
                    <ul className='mt-2'>
                      <li className=''>Imagine a scenario <i>“A client calls and says he needs an “IDEA” of an itinerary for 3 nights in Paris 3 nights in Venice and 3 nights in Rome with some recommendations 5 star hotels near city center and vegan restaurants and maybe approx. pricing, arrival from NY and depart from Venice.</i> <b>Can you respond in minutes with a return email?</b> </li><br />
                      <li className=''><b>If you are doing things the old fashioned way</b> Think of the time you will be spending!!  </li><br />

                      <li className=''>But what if you had a tool that could streamline the entire process and reduce your workload by 70%? With TourWizAI Lite <sup>BETA</sup>, you can do just that.</li><br />
                      <li className=''>To edit the AI generated Itineraries for inserting customer preferences and your own preferred changes or recommendations you can use the editor provided. </li><br />
                      <li className=''>You can save work using the “Save” button, Save and send allows you to share the itineraries via email and whatsapp and other media. </li><br />
                      <li className=''> TourWizAI Lite <sup>BETA</sup> is in Beta. So we would advise our users to use the itineraries as a starting point and do their own research to ensure the itinerary meets their specific requirements and that they are aware they would need to add any potential changes or restrictions that may impact their clients trip. </li><br />
                      <li className=''>With the provided editor, you can easily customize AI-generated itineraries.</li>
                    </ul>
                  </div>
                </div>
                  :
                  <div className='col-lg-12 mt-3 d-flex justify-content-center'>

                    <div class="alert alert-warning alert-dismissible fade show" role="alert"
                      style={style.alertBox}>
                      <strong className='ml-4'>Introducing TourWizAI Lite <sup>BETA</sup> </strong> –  The lightning fast Itinerary builder.<br />
                      <ul className='mt-2'>
                        <li className=''>Imagine a scenario “A client calls and says he needs an “IDEA” of an itinerary for 3 nights in Paris 3 nights in Venice and 3 nights in Rome with some recommendations 5 star hotels near city center and vegan restaurants and approx. pricing, </li><br />
                        <li className=''>Can you respond in minutes with a return email? With TourWizAI Lite <sup>BETA</sup>, you can!!!! </li><br />

                        <li className=''>TourWizAI Lite <sup>BETA</sup> is specifically designed to respond to these types of queries quickly and efficiently, impressing your customers and helping you close deals faster.</li><br />
                        <li className=''>Don't waste any more time on tedious tasks. Test drive TourWizAI Lite <sup>BETA</sup> today and experience the power of fast, accurate travel itinerary creation.</li><br />
                      </ul>
                    </div>
                  </div>
                }
              </>
              }

            </div>

            <div className='row m-0 w-100'>
              <div className='col-lg-12 mt-1 mb-4 d-flex justify-content-center'>
                <button
                  className='btn btn-sm btn-primary'
                  onClick={handleTrialMode}
                >
                  Try It
                </button>
              </div>
            </div>
          </>
        }
        {!props.trialMode &&
          <>
            {(!props.isQuickMode ? chatHistory.length === 0 : true) &&
              <div className='container'>
                {!props.isQuickMode &&
                  <>
                    <div className='row mb-3 d-flex justify-content-center'>
                      {!props.trialMode && <>
                        <div className='col-lg-12 w-100' style={style.message}>
                          <h6 style={{ lineHeight: "1.6" }}><span className='text-primary'>TourWizAI Lite<sup>BETA</sup></span> uses artificial intelligence to generate personalized itineraries based on your queries or prompts.</h6>
                        </div>
                        {/* <div className='col-lg-12 w-100 text-center my-5'>
                      <h4 className='' style={{ fontSize: "42px", fontWeight: "600", color: "#ced4da" }}>Try TourWizAI Lite</h4>
                    </div> */}
                      </>
                      }
                    </div>
                    <div className='row mb-3 d-flex justify-content-center mt-2'>
                      {!props.trialMode && <>
                        <div className='col-lg-8 w-100'>
                          <label>Itinerary Description/Title</label>
                          <input
                            type="text"
                            className='form-control'
                            name='title'
                            style={style.formcontrolDesc}
                            value={title}
                            placeholder="Enter Itinerary Short Description"
                            onChange={handleTitleChange}
                          />
                        </div>
                      </>
                      }
                    </div>
                  </>
                }
                <div className='row d-flex justify-content-center'>
                  <div className={props.isQuickMode ? `col-lg-12 p-0 card-body` : 'col-lg-8 card-body'}>
                    {props.isQuickMode && <label className=''>Your Query</label>}
                    <div class="d-flex flex-row justify-content-between">
                      <button
                        type='button'
                        className='btn btn-sm btn-muted d-block border'
                        style={style.formcBtnPrompt}
                        onClick={() => helpQuestion(!helpSection)}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Sample Prompt"

                      >
                        <i class="fa fa-question-circle" aria-hidden="true" style={{ fontSize: "24px" }}></i>
                        <small className='f10'>Prompt</small>
                      </button>
                      <div className='w-100'>
                        <textarea class="form-control"
                          rows="2"
                          placeholder="Type your message"
                          style={style.formcontrol}
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      </div>
                      {!loading &&
                        <button
                          type='button'
                          className='btn btn-sm btn-muted d-block border'
                          style={style.formcBtnGenrate}
                          onClick={handleSubmit}
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Genrate"


                        >
                          <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ fontSize: "24px" }}></i>
                          <small className='f10'>Generate</small>
                        </button>
                      }
                      {loading &&
                        <button
                          type='button'
                          className='btn btn-sm btn-muted d-block border'
                          style={style.formcBtnDisable}
                          // onClick={handleSubmit}
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Genrate"
                        >
                          <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ fontSize: "24px" }}></i>
                          <small className='f10'>Generate</small>
                        </button>
                      }
                    </div>

                  </div>
                </div>
                {helpSection &&
                  <div className='row m-0 w-100 d-flex justify-content-center mt-3' style={style.promptChat}>
                    <PackageAIAssistantPrompt
                      promptMode={props.promptMode}
                      helpQuestion={helpQuestion}
                      setHelpInput={setHelpInput}
                      location={location}
                      isQuickMode={props.isQuickMode}
                      trialMode={true}
                    />
                  </div>
                }
              </div>
            }
            <div className='container'>
              <div className='row m-0 w-100 d-flex justify-content-center'>
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
                {chatErrorMsg !== "" &&
                  <div className={props.isQuickMode ? 'col-lg-12 text-center mt-4' : 'col-lg-8 text-center'} style={style.errorChat}>
                    <div class="p-2">
                      {chatErrorMsg}
                    </div>
                  </div>
                }
              </div>
              {chatHistory.length === 0 && !props.isQuickMode &&
                <div className='row d-flex justify-content-center'>
                  <div className='col-lg-12 w-100' style={style.message}>
                    <h6 style={{ lineHeight: "1.6" }}> Simply type in your own queries or use the provided sample prompts to get started. <span className='text-primary'>Click the “use” button </span>and replace the text in<span className='text-primary'> [square brackets] </span>with your text and generate.</h6>
                    <h6 style={{ lineHeight: "1.6" }}>We allow to edit, save and share generated itineraries with your customers even in our freemium model
                      <button
                        className='ml-0 btn btn-link text-primary'
                        onClick={handleLogin}
                      >
                        click here
                      </button>
                    </h6>
                  </div>
                </div>
              }
              {!props.isQuickMode &&
                <div className='row d-flex justify-content-center mt-2'>
                  <div className='col-lg-8'>
                    <div className='row mt-2'>
                      <div className='col-lg-12'>
                        {!props.trialMode &&
                          <div class="mt-3" style={style.card}>

                            {chatErrorMsg === "" && chatHistory.map(itemResponse => {
                              return <div>
                                {itemResponse.searchKey &&
                                  <div class="d-flex flex-row pt-2 pb-2 pl-0 pr-0 mb-3" style={style.ItineraryHeader}>
                                    <div class="p-2 w-100 d-flex justify-content-center"><span class="">{title !== "" ? title : itemResponse.searchKey}</span></div>
                                  </div>
                                }

                                {itemResponse.responseData && <>
                                  <div
                                    className='d-flex justify-content-center pt-2 pb-2 mb-3 pl-0 pr-0'
                                  >
                                    {copied &&
                                      <button
                                        type="button"
                                        class="btn btn-primary btn-circle btn-xl mr-2"
                                        onClick={() => handleCopyToClipboard(itemResponse.responseData)}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Copied to clipboard"
                                      >
                                        <SVGIcon
                                          name="copy"
                                          width="12"
                                          height="12"
                                          className="text-light"
                                        ></SVGIcon>
                                        <small className='text-dark'>Copied</small>
                                      </button>
                                    }
                                    {!copied &&
                                      <button
                                        type="button"
                                        class="btn btn-secondary btn-circle btn-xl mr-2"
                                        onClick={() => handleCopyToClipboard(itemResponse.responseData)}
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Copied to clipboard"
                                      >
                                        <SVGIcon
                                          name="copy"
                                          width="12"
                                          height="12"
                                          className="text-light"
                                        ></SVGIcon>
                                        <small className='text-dark'>copy</small>
                                      </button>
                                    }
                                    <button type="button" class="ml-1 btn btn-circle btn-xl mr-2" style={{ background: "#891d9b", color: "#fff" }}
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-share-alt" aria-hidden="true"></i>
                                      <small className='text-dark'>Share</small>
                                    </button>
                                    <button type="button" class="ml-1 btn btn-primary btn-circle btn-xl mr-2"
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-eye" aria-hidden="true"></i>
                                      <small className='text-dark'>Preview</small>
                                    </button>
                                    {/* <button type="button" class="ml-1 btn btn-success btn-circle btn-xl mr-2">
                                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                                    <small className='text-dark'>Whatsapp</small>
                                  </button> */}
                                    <button type="button" class="ml-1 btn btn-info text-light btn-circle btn-xl mr-2"
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                      <small className='text-dark'>Save</small>
                                    </button>
                                    <button type="button" class="ml-1 btn btn-dark btn-circle btn-xl mr-2"
                                      onClick={handleCancel}
                                    >
                                      <i class="fa fa-chevron-left" aria-hidden="true"></i>
                                      <small className='text-dark'>Back</small>
                                    </button>
                                  </div>
                                  <div
                                    className='d-flex justify-content-start pt-2 pb-2 mt-3 mb-1 pl-0 pr-0'
                                  >
                                    <h5 className='' style={{ color: "#891d9b" }}>{title !== "" ? itemResponse.searchKey : "Itinerary"}
                                    </h5>
                                  </div>
                                  <div class="d-flex flex-row p-2" style={style.chat}>
                                    <div class="p-2">
                                      {itemResponse.responseData}
                                    </div>
                                  </div>
                                  <div
                                    className='d-flex justify-content-center pt-2 pb-2 mt-3 mb-3 pl-0 pr-0'
                                  >
                                    {copied &&
                                      <button
                                        type="button"
                                        class="btn btn-primary btn-circle btn-xl mr-2"
                                        onClick={() => handleCopyToClipboard(itemResponse.responseData)}
                                      >
                                        <SVGIcon
                                          name="copy"
                                          width="12"
                                          height="12"
                                          className="text-light"
                                        ></SVGIcon>
                                        <small className='text-dark'>Copied</small>
                                      </button>
                                    }
                                    {!copied &&
                                      <button
                                        type="button"
                                        class="btn btn-secondary btn-circle btn-xl mr-2"
                                        onClick={() => handleCopyToClipboard(itemResponse.responseData)}
                                      >
                                        <SVGIcon
                                          name="copy"
                                          width="12"
                                          height="12"
                                          className="text-light"
                                        ></SVGIcon>
                                        <small className='text-dark'>copy</small>
                                      </button>
                                    }
                                    <button type="button" class="ml-1 btn btn-circle btn-xl mr-2"
                                      style={{ background: "#891d9b", color: "#fff" }}
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-share-alt" aria-hidden="true"></i>
                                      <small className='text-dark'>Share</small>
                                    </button>
                                    <button type="button" class="ml-1 btn btn-primary btn-circle btn-xl mr-2"
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-eye" aria-hidden="true"></i>
                                      <small className='text-dark'>Preview</small>
                                    </button>
                                    {/* <button type="button" class="ml-1 btn btn-success btn-circle btn-xl mr-2">
                                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                                    <small className='text-dark'>Whatsapp</small>
                                  </button> */}
                                    <button type="button" class="ml-1 btn btn-info text-light btn-circle btn-xl mr-2"
                                      onClick={handleRedirectSignup}
                                    >
                                      <i class="fa fa-floppy-o" aria-hidden="true"></i>
                                      <small className='text-dark'>Save</small>
                                    </button>
                                    <button type="button" class="ml-1 btn btn-dark btn-circle btn-xl mr-2"
                                      onClick={handleCancel}
                                    >
                                      <i class="fa fa-chevron-left" aria-hidden="true"></i>
                                      <small className='text-dark'>Back</small>
                                    </button>
                                  </div>
                                  <div
                                    className='d-flex justify-content-center pt-2 pb-2 mt-3 mb-3 pl-0 pr-0'
                                  >
                                    <h6 className='text-center'>Your feedback matters! Help us improve and provide exceptional service by sharing your thoughts at
                                      <a href='mailto:sales@tourwizonline.com' style={{ color: "#891d9b" }}>&nbsp; sales@tourwizonline.com</a>
                                    </h6>
                                  </div>
                                </>
                                }
                              </div>
                            })}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </>
        }
      </div>
      {shareRedirectPopup &&
        <ModelPopup
          sizeClass={"modal-lg"}
          header={"Unlock Features"}
          content={<div><div>Unlock the full potential of TourwizAI Lite <sup>BETA</sup> by signing up today! It's free !!!</div>
            <button type="button" class="ml-1 btn btn-primary btn-xl m-2 pull-right"
              onClick={handleLogin}
            >Start Free</button></div>}
          handleHide={() => setShareRedirectPopup(!shareRedirectPopup)}
        />}
    </React.Fragment>
  )
}

export default PackageAIAssitantTrial