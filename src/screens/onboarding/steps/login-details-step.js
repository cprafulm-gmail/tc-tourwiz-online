import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
} from "react-social-login-buttons";
import * as React from "react";
import { BackDrop, Button } from "../components/base-components";
import { fadeIn } from "react-animations";
import { StepContent } from "../components/wizard-container";

const slideInUpAnimation = keyframes`${fadeIn}`;

const OtpContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: white;
  height: 50%;
  z-index: 5;
  border-top: 1px solid #CCC;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  box-shadow: 0px -20px 50px rgba(111, 111, 111, 0.2);
  animation: 0.2s ${slideInUpAnimation}
`;

export const NavItem = (props) => {
  return (
    <li className="nav-item" onClick={props.onClick}>
      <a
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
        className={`nav-link ${props.active ? "active" : ""}`}
        id={`pills-${props.val}-tab`}
        data-toggle="pill"
        role="tab"
        aria-controls={`pills-${props.val}`}
        aria-selected={`${"" + props.active}`}
      >
        {props.label}
      </a>
    </li>
  );
};

const SocialMedia = (props) => {
  return (
    <div>
      <GoogleLoginButton />
      <FacebookLoginButton />
      <LinkedInLoginButton />
    </div>
  );
};

const Email = (props) => {
  return (
    <div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="e.g. yourname@email.domain"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input type="password" className="form-control" id="passoword" placeholder="" />
      </div>
    </div>
  );
};

const Phone = (props) => {
  return (
    <div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Phone Number
        </label>
        <input
          type="email"
          className="form-control"
          id="telephone"
          placeholder="e.g. +91-8555972735"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password-telephone" className="form-label">
          Password
        </label>
        <input
          type="password-telephone"
          className="form-control"
          id="telephone-password"
          placeholder=""
        />
      </div>
    </div>
  );
};

const LoginDetails = (props) => {
  const [tab, setTab] = useState("social");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpType, setOtpType] = useState("email");

  const { setNextState } = props;

  const openOtp = (type) => {
    setOtpType(type);
    setOtpVisible(true);
  };

  const tabs = [
    {
      key: "social",
      label: "Social",
      nextState: {
        type: "none",
        disabled: true,
        label: "Login with preferred account to continue",
      },
    },
    {
      key: "email",
      label: "Email",
      nextState: {
        disabled: false,
        label: "Verify Email",
        onNext: () => openOtp("email"),
      },
    },
    {
      key: "phone",
      label: "Phone",
      nextState: {
        disabled: false,
        label: "Verify Phone",
        onNext: () => openOtp("phone"),
      },
    },
  ];

  useEffect(() => {
    setNextState?.(tabs.find((x) => x.key === tab).nextState);
  }, [tab]);

  return (
    <StepContent {...props}>
      <div className="alert alert-success" role="alert">
        Description on Login Details
      </div>

      <div class="card">
        <div className="card-header">
          <ul className="nav nav-pills card-header-pills">
            {tabs.map((x) => (
              <NavItem
                active={x.key === tab}
                key={x.key}
                val={x.key}
                label={x.label}
                onClick={() => {
                  setTab(x.key);
                  setNextState?.(x.nextState);
                }}
              />
            ))}
          </ul>
        </div>
        <div className="card-body">
          {tab === "social" && <SocialMedia />}
          {tab === "email" && <Email />}
          {tab === "phone" && <Phone />}
        </div>
      </div>

      {otpVisible && <BackDrop>&nbsp;</BackDrop>}
      {otpVisible && (
        <OtpContainer active={otpVisible}>
          <div
            style={{
              marginTop: "100px",
            }}
          >
            <h5>Please check your {otpType} for OTP and enter below to verify</h5>
            <br />
            <input
              style={{
                paddingLeft: `20px`,
                letterSpacing: `38px`,
                border: `0`,
                fontSize: "39px",
                backgroundImage: `linear-gradient(to left, rgba(111, 111, 111, 0.4) 70%, rgba(255, 255, 255, 0) 0%)`,
                backgroundPosition: `bottom`,
                backgroundSize: `60px 2px`,
                backgroundRepeat: `repeat-x`,
                backgroundPositionX: `50px`,
                width: `368px`,
                overflow: "none",
              }}
              type="text"
              maxlength="6"
              onChangeCapture={(e) => {
                if (e.target.value?.length == 6) {
                  setNextState(null);
                  props.goNext?.();
                  setOtpVisible(false);
                }
              }}
              autoFocus
            />
            <br />
            <Button
              style={{
                marginTop: "40px",
              }}
              type={""}
              onClick={() => setOtpVisible(false)}
            >
              Cancel
            </Button>
          </div>
        </OtpContainer>
      )}
    </StepContent>
  );
};

export default LoginDetails;
