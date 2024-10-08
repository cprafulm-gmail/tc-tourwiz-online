import React from 'react'
import trashImage from "../assets/images/x-circle -light.svg";
import bot from "../assets/images/robot.svg";
const style = {
  adiv: {
    background: "linear-gradient(90deg,#fa7438 0,#891d9b)",
    borderRadius: "15px",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    fontSize: "16px",
    height: "46px",
  }
}
function PackageAssistantHeader(props) {
  return (
    <React.Fragment>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="d-flex flex-row justify-content-between p-3 w-100  text-white" style={style.adiv}>
              <img
                style={{ filter: "none" }}
                src={bot}
                alt=""
              />
              <span class="pb-3">AI Based Package Assistant <sup className='fw-bold' style={{ fontSize: "10px" }}> BETA</sup></span>
              <img
                style={{ filter: "none" }}
                src={trashImage}
                alt=""
                onClick={() => props.handleHide()}
              />
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}

export default PackageAssistantHeader