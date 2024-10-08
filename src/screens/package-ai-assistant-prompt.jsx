import React from 'react'
const style = {
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
    color: "#891d9b",
    // borderRadius: "15px",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottom: "1px solid #891d9b",
    fontSize: "14px",
    fontWeight: "500",
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
function PackageAIAssistantPrompt(props) {
  return (
    <React.Fragment>
      {/*Start Pacakage Overview Tab */}
      {/* {props.promptMode === "Pacakage Overview" &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Overview creation prompts for one destination
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate an overview of 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine in 2-5 lines
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(11)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Plan an overview of 3-day trip to [city name] with a mix of popular tourist sites and food recommendations in 2-5 lines.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(12)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make an overview of 5-day itinerary for [city name] including top attractions and must-try food dishes in 2-5 lines.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(13)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Design an overview of 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences in 2-5 lines.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(14)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Create an overview of 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties in 2-5 lines.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(15)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      } */}
      {/*End Pacakage Overview Tab */}
      {/*Start Pacakage Itinerary Tab */}
      {props.promptMode === "Pacakage Itinerary" && !props.trialMode &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Itinerary creation prompts for one destination
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(1)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Plan a 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(2)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make a 5-day itinerary for [city name] including top attractions and must-try food dishes.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(3)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Design a 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(4)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Create a 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(5)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Itinerary creation prompts for multiple destination
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a 2-week itinerary with airport transfers for [city 1] and [city 2] including top attractions and must-try food options in each location.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(6)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Plan a 5-day trip with airport transfers to [city 1], [city 2], and [city 3] highlighting outdoor activities and unique food experiences in each place.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(7)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make a 7-day itinerary with airport transfers for [city 1], [city 2], and [city 3] showcasing both historical landmarks and traditional food specialties in each location.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(8)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Design a 3-day itinerary with airport transfers for [city 1] and [city 2] focusing on cultural attractions and local cuisine in each place.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(9)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Create a 4-day itinerary with airport transfers for [city 1], [city 2], and [city 3] that includes top tourist sites and food recommendations in each location.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(10)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      }
      {/*End Pacakage Itinerary Tab */}
      {/*Start Pacakage Flight Details Tab */}
      {/* {props.promptMode === "Pacakage Flight" &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Flight Details Prompts
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    One way flight options for [Airport 1] to [Airport 2] with details.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(16)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Round Trip way flight options for [Airport 1] to [Airport 2] with details.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(17)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Multi Destination flight options for [Airport 1] to [Airport 2] to [Airport 3] with details.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(18)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      } */}
      {/*End Pacakage Flight Details Tab */}
      {/*Start Pacakage Inclusion & exclusion Tab */}
      {(props.promptMode === "Pacakage Incusion" || props.promptMode === "Pacakage exclusion") &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Inclusion & Exclusion Prompts
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  {/* <li class="list-group-item d-flex justify-content-between align-items-center">
                    Provide Inclusions and Exclusions for [city name] Package.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(19)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li> */}
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate Inclusions and Exclusions for [city name] Itinerary.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(20)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      }
      {/*End Pacakage Incusion exclusion Tab  */}
      {/*Start Pacakage Price Guideline Tab */}
      {props.promptMode === "Pacakage PriceGuidelines" &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Price Guideline Prompts.
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a Price Guideline table for itinerary for [city name] with a focus on cultural attractions and local cuisine.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(21)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  {/* <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a Price Guideline table 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(22)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make a Price Guideline table 5-day itinerary for [city name] including top attractions and must-try food dishes.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(23)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </>
      }
      {/*End Pacakage Price Guideline Tab  */}
      {/*Start Pacakage Terms & Conditions Tab */}
      {props.promptMode === "Pacakage Terms" &&
        <>
          <div className='col-lg-6 mt-3'>
            <div className='row' style={{ overflowY: "auto", maxHeight: "300px" }} >
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Terms & Conditions Prompts.
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Terms & Conditions for itinerary for [city name] highlighting outdoor activities and unique food experiences.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(24)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  {/* <li class="list-group-item d-flex justify-content-between align-items-center">
                    Terms & Conditions for 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(25)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Terms & Conditions for 5-day itinerary for [city name] including top attractions and must-try food dishes.
                    <button
                      className='ml-1 btn btn-sm'
                      onClick={() => props.setHelpInput(26)}
                      style={{ textDecoration: "underline", fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </>
      }
      {props.trialMode &&
        <>
          <div className={!props.isQuickMode ? 'col-lg-8 p-0' : 'col-lg-12 p-0'}>
            <div className='row'>
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Itinerary creation prompts for one destination
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a 2-day itinerary for [city name] with a focus on cultural attractions and local cuisine.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(1)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Plan a 3-day trip to [city name] with a mix of popular tourist sites and food recommendations.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(2)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make a 5-day itinerary for [city name] including top attractions and must-try food dishes.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(3)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Design a 1-week itinerary for [city name] highlighting outdoor activities and unique food experiences.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(4)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Create a 10-day itinerary for [city name] showcasing both historical landmarks and traditional food specialties.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(5)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Recommendations for Indian restaurants in Paris, Rome, and Venice.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(27)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={!props.isQuickMode ? 'col-lg-8 p-0' : 'col-lg-12 p-0'}>
            <div className='row'>
              <div className='col-lg-12'>
                <ul class="list-group" style={style.promptChat}>
                  <li class="list-group-item d-flex justify-content-between align-items-center" style={style.bdiv}>
                    Sample Itinerary creation prompts for multiple destination
                    <button type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={() => props.helpQuestion(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Generate a 2-week itinerary with airport transfers for [city 1] and [city 2] including top attractions and must-try food options in each location.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(6)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Plan a 5-day trip with airport transfers to [city 1], [city 2], and [city 3] highlighting outdoor activities and unique food experiences in each place.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(7)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Make a 7-day itinerary with airport transfers for [city 1], [city 2], and [city 3] showcasing both historical landmarks and traditional food specialties in each location.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(8)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Design a 3-day itinerary with airport transfers for [city 1] and [city 2] focusing on cultural attractions and local cuisine in each place.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(9)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Create a 4-day itinerary with airport transfers for [city 1], [city 2], and [city 3] that includes top tourist sites and food recommendations in each location.
                    <button
                      className='ml-1 btn btn-sm btn-primary rounded px-3'
                      onClick={() => props.setHelpInput(10)}
                      style={{ fontSize: "12px" }}
                    >
                      Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      }
      {/*End Pacakage Terms & Conditions Tab*/}
    </React.Fragment>
  )
}

export default PackageAIAssistantPrompt