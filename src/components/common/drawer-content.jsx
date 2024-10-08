import React from 'react';
import SupportForm from './drawer-content-form';
import DrawerTimeLine from './drawer-content-timeline';
import TourwizHelp from './drawer-content-help';

function DrawerContent(props) {
  const css = `
  .content-bg{
    background-color: #eef2f4f2 !important;
    border-radius: 14px;
  }
  `
  return (
    <>
      <style>{css}</style>
      {props.tab === "Release Note" &&
        <div className='row mx-2'>
          <DrawerTimeLine />
        </div>
      }
      {props.tab === "Help" &&
        <div className='row mx-2'>
          <TourwizHelp />
        </div>
      }
      {props.tab === "Support" &&
        <div className='row mx-2'>
          <SupportForm
            {...props}
          />
        </div>
      }
    </>
  )
}

export default DrawerContent;