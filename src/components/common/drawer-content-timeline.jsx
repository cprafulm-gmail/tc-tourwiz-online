import React, { useState, useEffect } from 'react';
import data from './release-notes.json';

function DrawerTimeLine() {
  const css = `
  .timeline {
    border-left: 1px solid hsl(0, 0%, 90%);
    position: relative;
    list-style: none;
  }
  
  .timeline .timeline-item {
    position: relative;
  }
  
  .timeline .timeline-item:after {
    position: absolute;
    display: block;
    top: 0;
  }
  
  .timeline .timeline-item:after {
    background-color: #fa7438;
    left: -46px;
    border-radius: 50%;
    height: 11px;
    width: 11px;
    content: "";
  }
  .releasenotesItem
  {
    font-size:14px;
    color:black;
    list-style-type:  disc !important;
  }
  .title:hover{
   color:#b855a4 !important;
  //  text-decoration: underline !important;
  }
  `
  const [releasedata, setReleaseData] = useState([]);
  useEffect(() => {
    setReleaseData(data);
  }, []);

  return (
    <div className='col-lg-12'>
      <style>{css}</style>
      <div className='row'>
        <div className='col-lg-12'>
          <section className="pt-2 pb-5">
            <ul className="timeline">
              {releasedata.map(item => (
                <li className="timeline-item mb-5" key={item.id}>
                  <h5 className="fw-bold text-secondary">{item.releaseDate}</h5>
                  {/* <p className="text-muted mb-2 font-weight-normal">{item.title}</p> */}
                  <ul className="text-justify p-0" style={{ listStyleType: "none" }}>
                    {item.releaseNote.map((item) => {
                      return (
                        <>
                          <li className='text-dark mt-2 mb-1'>
                            {item.featuresType === "new" &&
                              <span className="badge badge-success glowNew mr-2">New</span>
                            }
                            <u className='title'>{item.title}</u>
                          </li>
                          {item.notes.map((item) => {
                            return (<li className='releasenotesItem ml-3'>{item}</li>
                            )
                          })}
                        </>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DrawerTimeLine;