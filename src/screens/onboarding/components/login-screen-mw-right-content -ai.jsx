import React from "react";
import SignupBgImgStep1 from "../../../assets/images/tw/sign-up-page-bg-step1.png";
import SigninBgImg from "../../../assets/images/tw/signin-bg.png";

const LoginScreenMWRightContentAI = (props) => {
  const page = props.page;
  return (
    <React.Fragment>
      {page === "signin" ? (
        <>
          <div className={page === "signin" ? "signin-img" : "signup-img"}>
            <img
              src={page === "signin" ? SigninBgImg : SignupBgImgStep1}
              alt=""
            />
          </div>

          <div className="signin-info">
            <div>
              {/* <h2>Say Goodbye to Spreadsheets!</h2> */}
              <ul className="list-unstyled">
                <li>AI Package Module</li>
                <li>Itinerary Builder</li>
                <li>Reports & Analytics</li>
                <li>Agency Management</li>
                <li>Accounting & Reconciliation</li>
                <li>Travel CRM</li>
                <li>Customer Portal</li>
                <li>Invoice Module</li>
              </ul>
              {/* <h5 className="mt-4" style={{ color: "#ffd500" }}>All Features as below</h5> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={page === "signin" ? "signin-img signup-img" : "signup-img"}>
            <img
              src={page === "signin" ? SigninBgImg : SignupBgImgStep1}
              alt=""
            />
          </div>
          <div className="signup-info">
            <div>
              <h2>AI Say Goodbye to Spreadsheets!</h2>
              <h5 className="mt-1">Many more reasons to Switch to TourWiz!</h5>

              <ul className="list-unstyled">
                <li>Web & mobile-friendly to help you manage your agency from anywhere</li>
                <li>High data security & 99.9% uptime guaranteed by Amazon cloud hosting</li>
                <li>You don’t need to have your own booking system/supplier APIs to use it</li>
                <li>Easy on the pocket - Available for very low & affordable subscription plans</li>
                <li>Get in-depth accounting & business reports</li>
              </ul>
              <h5 className="mt-4" style={{ color: "#ffd500" }}>
                Plus access to exclusive offers from our partners
              </h5>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default LoginScreenMWRightContentAI;
