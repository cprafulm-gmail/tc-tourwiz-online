import React, { useState } from 'react';
import RealeaseNotesIcon from "../../assets/images/releasenotes.svg";
import InfoIcon from "../../assets/images/info-circle.svg";
import SupportIcon from "../../assets/images/support.svg";
function DrawerTab(props) {
  const [activeTab, setActiveTab] = useState('Release Note');

  const handleMode = (mode) => {
    setActiveTab(mode);
    props.handleMode(mode);
  }
  const css = `
  .activeBtn{
    background: #e6e6e6;
  }
  `
  return (
    window.innerWidth >= 768 ?
      <div className='row'>
        <style>{css}</style>
        <div className='col-lg-12 mb-3'>
          <div className='row d-flex justify-content-between'>
            <div className={activeTab === "Release Note" ? "col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 activeBtn" : 'col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 navOneBtn'}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Release Notes"
              onClick={() => handleMode("Release Note")}
            >
              <img
                style={{ filter: "none", width: "28px" }}
                src={RealeaseNotesIcon}
                alt=""
              />
              <button className='btn btn-sm tabText'>
                Release Notes
              </button>
            </div>
            <div className={activeTab === "Help" ? 'col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 activeBtn' : 'col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 navTwoBtn'}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Help"
              onClick={() => handleMode("Help")}
            >
              <img
                style={{ filter: "none", width: "28px" }}
                src={InfoIcon}
                alt=""
              />
              <button className='btn btn-sm tabText'>
                Help
              </button>
            </div>
            <div className={activeTab === "Support" ? 'col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 activeBtn' : 'col-lg-4 d-flex justify-content-start pl-5 pt-3 pb-3 navThirdBtn'}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Support"
              onClick={() => handleMode("Support")}
            >
              <img
                style={{ filter: "none", width: "28px" }}
                src={SupportIcon}
                alt=""
              />
              <button className='btn btn-sm tabText'>
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
      :
      <div className='row'>
        <style>{css}</style>
        <div className='col-lg-12 mb-3'>
          <div className='row'>
            <div className='col-lg-4 px-5 pt-3 pb-3 navMobBtn d-flex justify-content-between'
            >
              <img
                style={{ filter: "none", width: "28px" }}
                src={RealeaseNotesIcon}
                alt="releasenotes"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Release Notes"
                onClick={() => handleMode("Release Note")}
              />
              <img
                style={{ filter: "none", width: "28px" }}
                src={InfoIcon}
                alt="help"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Help"
                onClick={() => handleMode("Help")}
              />
              <img
                style={{ filter: "none", width: "28px" }}
                src={SupportIcon}
                alt="support"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Support"
                onClick={() => handleMode("Support")}
              />

            </div>
          </div>
        </div>
      </div>
  )
}

export default DrawerTab;