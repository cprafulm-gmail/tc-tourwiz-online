import React, { useState } from 'react';
import sendIcon from "../assets/images/send-fill.svg";
import infoIcon from "../assets/images/info-circle.svg";
import handIcons from "../assets/images/hand-index.svg";
const style = {
  formcontrol: {
    borderRadius: "12px",
    border: "1px solid #ced4da",
    fontSize: "15px",
    boxShadow: "none",
  },
  formcBtn: {
    borderRadius: "12px",
    fontSize: "18px",
    boxShadow: "none",
  },
  chat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "15px",
    borderRadius: "20px",
    // whiteSpace: "pre-wrap",
    // overflowWrap: "break-word",
    // wordWrap: "break-word"
  },
  useChat: {
    border: "none",
    background: "#EDDEF0",
    fontSize: "15px",
    borderRadius: "20px",
  },
  card: {
    border: "none",
    borderRadius: "15px",
  },
}
function PackageAssistantFooter(props) {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpSection, setHelpSection] = useState(false);
  const handleInputChange = (event) => {
    props.handleFetchData('');
    setInputValue(event.target.value);
    props.handleFetchInputData(event.target.value);
  };
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    props.handleFetchInputData(inputValue);
    props.handleFetchData('');
    const response = await getResponseFromOpenAI(inputValue);
    setResponse(response);
    props.handleFetchData(response);

    setInputValue("");
  };
  const helpQuestion = (mode) => {
    setHelpSection(mode);
  }
  const getResponseFromOpenAI = async (input) => {
    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "openai-organization": "org-XiRI7QBzy9AFOHndMWdWQOks",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          prompt: input,
          max_tokens: 1000,
          n: 1,
          temperature: 0.5,
        }),
      }
    );
    const data = await response.json();
    setLoading(false);
    return data.choices[0].text;
  };
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

      default:
        setInputValue("something went wrong");
        break;
    }
  }
  return (
    <React.Fragment>
      <div className='container'>
        <div className='row'>
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
          {helpSection && <>
            <div className='col-lg-12  d-flex justify-content-center'>
              <div class="alert alert-warning alert-dismissible fade show mx-4 w-100" role="alert">
                Sample Prompts
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={() => helpQuestion(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
            <div className='col-lg-12' style={{ overflowY: "auto", maxHeight: "350px" }} >
              <div className='row'>
                <div className='col-lg-12'>
                  <h6 className='text-primary mx-5'>Sample Itinerary creation prompts for one destination</h6>
                  <hr className='text-primary border-1 border-primary mx-5' />
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Generate a 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(1)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>

                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Plan a 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(2)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Make a 5-day itinerary for [city name] including top attractions and must-try food dishes.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(3)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Design a 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(4)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Create a 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(5)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12'>
                  <h6 className='text-primary mx-5'>Sample Itinerary prompts for Multi-destinations</h6>
                  <hr className='text-primary border-1 border-primary mx-5' />
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Generate a 2-week itinerary with airport transfers for [city 1] and [city 2] including top attractions and must-try food options in each location.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(6)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Plan a 5-day trip with airport transfers to [city 1], [city 2], and [city 3] highlighting outdoor activities and unique food experiences in each place.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(7)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Make a 7-day itinerary with airport transfers for [city 1], [city 2], and [city 3] showcasing both historical landmarks and traditional food specialties in each location.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(8)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Design a 3-day itinerary with airport transfers for [city 1] and [city 2] focusing on cultural attractions and local cuisine in each place.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(9)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-lg-12'>
                  <div class="mt-3" style={style.card}>
                    <div class="d-flex flex-row p-3">
                      <div class="ml-2 p-3 w-100" style={style.chat}>
                        <p>Create a 4-day itinerary with airport transfers for [city 1], [city 2], and [city 3] that includes top tourist sites and food recommendations in each location.</p>
                      </div>
                      <button
                        className='ml-1 btn btn-sm'
                        onClick={() => setHelpInput(10)}
                        style={style.useChat}
                      >
                        <img src={handIcons} style={{ width: "14px" }} alt='topside' />
                        <br />Use
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
          <div className='col-lg-12'>
            <div class="form-group px-3 d-flex flex-row">
              <button
                className='btn btn-sm'
                style={style.formcBtn}
                onClick={() => helpQuestion(!helpSection)}
                data-toggle="tooltip"
                data-placement="top"
                title="Sample Prompts"
              >
                <img
                  style={{ filter: "none" }}
                  src={infoIcon}
                  alt=""
                />
              </button>
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

export default PackageAssistantFooter