import React, { useState } from 'react';
import TourwizHelpNav from './drawer-content-help-sidebar';
import TourwizHelpSection from './drawer-content-help-item';

function TourwizHelp() {
  const [contentTabMode, setContentTabMode] = useState('welcome');
  const fetchTabMode = (mode) => {
    console.log(mode);
    setContentTabMode(mode);
  }
  return (
    <>
      <div className='col-lg-3 p-0 m-0'><TourwizHelpNav fetchTabMode={fetchTabMode} /></div>
      <div className='col-lg-9'><TourwizHelpSection tab={contentTabMode} /></div>
    </>
  )
}

export default TourwizHelp;