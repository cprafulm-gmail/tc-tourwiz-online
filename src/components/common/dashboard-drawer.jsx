import React, { useState } from 'react';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import DrawerHeader from './drawer-header';
import DrawerTab from './drawer-tab';
import DrawerContent from './drawer-content';
function DashboardDrawer(props) {
  const css = `
  .navOneBtn {
    background:  #f2f2f2; //#ced4da ;//#fa7438;
    font-size: 16px;
    box-shadow: none;
    color:#891d9b !important;
  }
  .navOneBtn:hover {
    background:#e6e6e6;
  }
  .navTwoBtn {
    background: #f2f2f2;//#feddcd; // #6c757d;
    font-size: 16px;
    box-shadow: none;
    color:#891d9b !important;
  }
  .navTwoBtn:hover {
    background:#e6e6e6;
  }
  .navThirdBtn {
    background:#f2f2f2; //#feddcd; //#eef2f4f2;  //#891d9b;
    font-size: 16px;
    box-shadow: none;
    color:#891d9b !important;
  }
  .navThirdBtn:hover {
    background:#e6e6e6;
  }
  .title-bg-drawer{
    background:#EDDEF0 !important;
    color:#891d9b !important;
  }
  .quickInput{
    width:100px !important;
    border-right: none !important;
  }
  .searchBtn{
    background: #f2f2f2 !important;
    border:none;
    border-left: none !important;
  }
  .input-group{
    width: 100% !important;
  }
  .tabText{
    color:#212529 !important;
    font-size:15px;
  }
  .heroText{
    font-size: 24px;
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .heroText label {
    // color:#212529 !important;
       font-weight: 400;
  }
.heroText label span {
  color:#fa7438 !important;
  font-weight: 900;
  opacity:0.8;
}
.navMobBtn{
  background: #f2f2f2; //#eef2f4f2;
}
.navMobBtn img:hover {
  opacity:0.6;
}
.form-control
{
  background: #f2f2f2;
  border:none;
}
  `
  const [tab, setTab] = useState('Release Note')
  const handleMode = (mode) => {
    setTab(mode);
  }
  const handleClose = () => {
    props.handleClose();
  }
  return (
    <>
      <style>{css}</style>
      <Drawer
        placement="right"
        width={window.innerWidth >= 768 ? "80%" : "100%"}
        level={null}
        open={props.drawerOpen}
        onClose={props.handleClose}
      >
        <div className='container'>
          <DrawerHeader
            handleClose={handleClose}
          />
          <DrawerTab
            handleMode={handleMode}
          />
          <DrawerContent
            tab={tab}
            {...props}
          />
        </div>
      </Drawer>
    </>
  );
}

export default DashboardDrawer;
