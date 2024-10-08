import { useState } from "react";
import { StepContent } from "../components/wizard-container";
import * as React from "react";
import { useEffect } from "react";
import { TourwizApi, global } from "../api";
import PasswordStrengthBar from "react-password-strength-bar";
import { BackDrop, Button } from "../components/base-components";
import { fadeIn } from "react-animations";
import styled, { keyframes } from "styled-components";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";

const slideInUpAnimation = keyframes`${fadeIn}`;

const OtpContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: white;
  height: 50%;
  z-index: 5;
  border-top: 1px solid #ccc;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  box-shadow: 0px -20px 50px rgba(111, 111, 111, 0.2);
  animation: 0.2s ${slideInUpAnimation};
`;

const EmailLoginDetailsStep = (props) => {
  const [isEmailValid, setEmailValid] = useState(false);

  const { setNextState } = props;

  const [isFormValid, setFormValid] = useState(false);

  const [formValidation, setFormValidation] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const [isLoading, setLoading] = useState(false);

  const [password, setPassword] = useState();

  const [otpVisible, setOtpVisible] = useState(false);
  const [otpType, setOtpType] = useState("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);

  const openOtp = (type) => {
    setOtpType(type);
    setOtpVisible(true);
  };

  const validateForm = () => {
    let validationResult = { ...formValidation };

    // 1. Validate first name
    validationResult.firstName = global.login.firstName?.length >= 2;

    // 2. Validate last name
    validationResult.lastName = global.login.lastName?.length >= 2;

    // 3. Validate email
    validationResult.email = isEmailValid;

    // 4. Validate password
    validationResult.password =
      global.login.password?.length > 4 &&
      global.login.password === global.login.confirmPassword;

    setFormValidation(validationResult);

    setFormValid(
      validationResult.firstName &&
      validationResult.lastName &&
      validationResult.email &&
      validationResult.password
    );
  };

  const onNext = () => {
    setNextState({
      disabled: true,
      loading: true,
      label: "Sending OTP",
    });
    TourwizApi.setup(global, true)
      .then(() => {
        openOtp("email");
        setNextState({
          disabled: false,
          loading: false,
          label: "Verify Email",
          onNext: onNext,
        });
      })
      .catch(() => {
        openOtp("email");
        setNextState({
          disabled: false,
          loading: false,
          label: "Verify Email",
          onNext: onNext,
        });
      });
    // Register
    // setNextState({
    //     disabled: true,
    //     loading: true,
    //     label: "Enter OTP"
    // });
    // TourwizApi.setup(global).then((res)=> {
    //     props.onSignupComplete(true);
    // }).catch((e)=> {
    //     props.onSignupComplete(false);
    // })
  };

  const handleTermsCheck = (e) => { };

  useEffect(() => {
    if (props.isVisible) {
      setNextState({
        disabled: !isFormValid,
        loading: false,
        label: "Verify Email",
        onNext: onNext,
      });
    }
  }, [props.isVisible, isFormValid]);

  return (
    <StepContent {...props}>
      {/*<div className="alert alert-success" role="alert">*/}
      {/*    Description on Login*/}
      {/*</div>*/}

      <label htmlFor="firstName" className="form-label">
        Name *
      </label>
      <div className="input-group mb-3">
        <input
          type="text"
          id={"firstName"}
          className={`form-control ${formValidation.firstName ? "is-valid" : ""
            }`}
          placeholder="First Name"
          aria-label="First Name"
          onChange={(e) => {
            global.login.firstName = e.target.value;
            validateForm();
          }}
        />
        <input
          type="text"
          id={"lastName"}
          className={`form-control ${formValidation.lastName ? "is-valid" : ""
            }`}
          placeholder="Last Name"
          aria-label="Last Name"
          onChange={(e) => {
            global.login.lastName = e.target.value;
            validateForm();
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="emailAddress" className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          className={`form-control ${isEmailValid ? "is-valid" : ""}`}
          id="emailAddress"
          placeholder="Enter your email"
          onChange={(e) => {
            if (
              e.target.value.match(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
            ) {
              TourwizApi.validateEmail(e.target.value)
                .then((res) => {
                  if (res.result) {
                    setEmailValid(true);
                    global.login.email = e.target.value;
                    validateForm();
                  } else {
                    global.login.email = null;
                    setEmailValid(false);
                    validateForm();
                  }
                })
                .catch(() => {
                  global.login.email = null;
                  setEmailValid(false);
                  validateForm();
                });
            } else {
              global.login.email = null;
              setEmailValid(false);
              validateForm();
            }
          }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password *
        </label>
        <input
          type="password"
          className={`form-control ${formValidation.password ? "is-valid" : ""
            }`}
          id="password"
          placeholder="Create new password"
          onChange={(e) => {
            global.login.password = e.target.value;
            validateForm();
            setPassword(e.target.value);
          }}
        />
        <PasswordStrengthBar
          style={{
            height: "1px",
          }}
          password={password}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password *
        </label>
        <input
          type="password"
          className={`form-control ${formValidation.password ? "is-valid" : ""
            }`}
          id="confirmPassword"
          placeholder="Confirm Password"
          onChange={(e) => {
            global.login.confirmPassword = e.target.value;
            validateForm();
          }}
        />
      </div>

      <div>
        <input
          type="checkbox"
          id="termsCheck"
          name="termsCheck"
          className="mr-2"
          checked
          onChange={(e) => {
            handleTermsCheck(e);
          }}
        />
        <label htmlFor="termsCheck" style={{ marginBottom: "0px" }}>
          I agree to the{" "}
          {/* <a href="#/terms-of-use" target="_blank">
            Terms and Conditions
          </a> */}
          <Link
            className="text-primary"
            to="/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </Link>
        </label>
      </div>

      {otpVisible && <BackDrop>&nbsp;</BackDrop>}
      {otpVisible && (
        <OtpContainer active={otpVisible}>
          <div
            style={{
              marginTop: "50px",
              width: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              className={`alert alert-${otpError ? "error" : "info"}`}
              role="alert"
            >
              {otpError
                ? "Invalid OTP"
                : `Please check your ${otpType} for OTP and enter below to verify`}
            </div>
            <br />
            <OtpInput
              style={{
                justifyContent: "center !important",
              }}
              inputStyle={"otp-input-style"}
              value={otp}
              numInputs={6}
              onChange={(e) => {
                setOtp(e);
                if (e.length === 6) {
                  setLoading(true);
                  setOtpError(false);
                  global.login.otp = e;
                  TourwizApi.setup(global)
                    .then((res) => {
                      setLoading(false);
                      if (res.error && res.error.includes("otp")) {
                        setOtpError(true);
                      } else {
                        props.onSignupComplete(true);
                      }
                    })
                    .catch((e) => {
                      props.onSignupComplete(false);
                      setLoading(false);
                    });
                }
              }}
            />
            <br />
            <Button
              style={{
                marginTop: "40px",
              }}
              type={""}
              onClick={() => {
                setOtpVisible(false);
              }}
            >
              {isLoading ? "Registering..." : "Cancel"}
            </Button>
          </div>
        </OtpContainer>
      )}
    </StepContent>
  );
};

export default EmailLoginDetailsStep;
