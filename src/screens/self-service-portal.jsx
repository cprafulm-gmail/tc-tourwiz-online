import React from 'react'
import trashImage from "../assets/images/x-circle -light.svg";
import { useHistory } from 'react-router-dom';
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
function SelfServicePortal(props) {
  const handleBack = () => {
    props.handleHide()
  }
  const history = useHistory();
  const headerAssitant = "Customer Self-Service Portal";
  const handleTrialPortal = () => {
    props.handleHide();
    history.push('/QuickPackage/add');
  }
  return (
    <>
      <div className='row  m-0 w-100'>
        <div className='col-lg-12 p-0'>
          <div class="d-flex flex-row justify-content-between pt-2 pb-2 pl-0 pr-0 w-100  text-white" style={style.adiv}>
            <div className='ml-3'>
              <h3 className="badge glow">NEW</h3>
            </div>
            <span class="pb-3">{headerAssitant}
              {/* <sup className='fw-bold' style={{ fontSize: "10px" }}> BETA</sup> */}
            </span>
            <div className='mr-3'>
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
        <div className='col-lg-12 mt-3 d-flex justify-content-center'>

          <div class="alert alert-warning alert-dismissible fade show" role="alert"
            style={style.alertBox}>
            Introducing our ground-breaking <strong className='ml-1'>Customer Self-Service Portal </strong>, a game-changer in the B2B industry. Let your customers effortlessly manage their own travel documents, review statements, download invoices, and even make direct payments for any outstanding amounts. Here is how it works..<br />
            <ul className='mt-2'>
              <li className=''>First you will have to create a customer in TourWiz using the customer menu option and then add customer. The customer will get an welcome email with a password.</li><br />

              <li className=''>Share this link: <a className={" text-primary "} target="_blank" href={props.customerPortalURL}>
                <strong className='ml-1'>Customer Self-Service Portal</strong></a> with the customer via email or whatsapp</li><br />
              <li className=''>When customer clicks on the link he will be taken to you Customer Self Service Portal</li><br />
              <li>They can then use the sign-in option to sign in using their username and the password they received in the welcome email</li>
              <li className=''>There is no sign up feature on this portal as this portal is only for "your customers" whom you have registered and created documents for them</li><br />
              <li className=''>Once customer logs in, they will see a dashboard with all the activities you have done for them.</li><br />
            </ul>
          </div>
        </div>
      </div>
      <div className='row m-0 w-100'>
        <div className='col-lg-12 mt-1 mb-4 d-flex justify-content-center'>
          <a className={"btn btn-" + "primary mb-2 mt-2 p-2 mb-2 badge "} target="_blank" href={props.customerPortalURL}>
            Try It</a>
          {/* <button
            className='btn btn-sm btn-primary'
            onClick={handleTrialPortal}
          >
            Try It
          </button> */}
        </div>
      </div>
    </>
  )
}

export default SelfServicePortal