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
                <li>Package Module</li>
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
              <h2 style={{ fontSize: "21px" }}>Rev up your revenue and slash your workload by 70% with TourWizAI Lite<sup>BETA</sup>, TourWiz ERP and B2B Marketplace</h2>
              <h5 className="mt-1" style={{ fontSize: "18px" }}>Discover amazing deals now!</h5>

              <ul className="list-unstyled">
                <li>Increase in revenue for travel agents, tour operator and DMC’s</li>
                <li>Access to global content and increase sales reach</li>
                <li>Reduce costs and work with TourWizAI Lite <sup>BETA</sup>, the game changer in travel planning</li>
                <li>Use readymade itineraries from Marketplace</li>
                <li>Inquiry automation</li>
                <li>Get website/landing page with pre-filled content</li>
              </ul>
              <h5 className="mt-2" style={{ color: "#ffd500" }}>
                Sign up now for a free account to learn more about how TourWiz can help your business thrive
              </h5>
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
}

export default LoginScreenMWRightContentAI;
