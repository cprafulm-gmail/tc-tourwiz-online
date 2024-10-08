import { useState } from "react";
import styled from "styled-components";
import backgroundImage from "../images/travel-world.jpg";
import SignupWizard from "./signup-wizard";
import JoinTeam from "./join-team";
import ForgotPassword from "./forgot-password";
import { global, TourwizApi } from "../api";
import SignupResult from "./signup-result";
import LandingMenu from "../../tourwiz-landing-pages/landing-menu";
import { apiRequester } from "../../../services/requester";

const LoginForm = styled.div``;

const ImageContainer = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginScreen = (props) => {
  const [signupVisible, setSignUpVisible] = useState(false);
  const [signupResult, setSignupResult] = useState();
  const [joinTeamVisible, setJoinTeamVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({});
  const [loginError, setLoginError] = useState();

  const handleLogin = (res) => {
    if (res) {
      localStorage.setItem("loginToken", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      //getLoginDetails();
    } else {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const getLoginDetails = () => {
    var reqURL = "api/v1/user/details";
    var reqOBJ = {
      Request: "",
      Flags: { usecallcenterinfo: true },
    };
    apiRequester(reqURL, reqOBJ, (data) => {
    });
  };

  return (
    <>
      <div className="container position-relative">
        <LandingMenu loginscreen={true} />
        <div className="row">
          <div className="col-lg-3">
            <div className="pt-4">
              <div className={`alert ${loginError ? "alert-danger" : "alert-info"}`} role="alert">
                {loginError ? "Invalid Credentials" : "Please sign in to continue"}
              </div>

              <div>
                <label htmlFor="inputEmail" className="visually-hidden">
                  Email address
                </label>
                <input
                  type="email"
                  id="inputEmail"
                  className="form-control"
                  placeholder="Enter your registered email"
                  required=""
                  autoFocus=""
                  onChange={(e) => {
                    setLoginCredentials({
                      ...loginCredentials,
                      id: e.target.value,
                    });
                    setLoginError(null);
                  }}
                />
              </div>

              <div className="mt-2">
                <label htmlFor="inputPassword" className="visually-hidden">
                  Password
                </label>

                <input
                  type="password"
                  id="inputPassword"
                  className="form-control"
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setLoginCredentials({
                      ...loginCredentials,
                      password: e.target.value,
                    });
                    setLoginError(null);
                  }}
                  required=""
                />
              </div>

              <button
                className="mt-3 w-100 btn btn-primary"
                type="submit"
                onClick={() => {
                  TourwizApi.login(loginCredentials.id, loginCredentials.password)
                    .then((res) => {
                      if (res.error) {
                        setLoginError(true);
                      } else {
                        handleLogin(res);
                        setLoginError(false);
                      }
                    })
                    .catch((e) => {
                      handleLogin(false);
                      setLoginError(true);
                    });
                }}
              >
                Sign in
              </button>

              <button
                className="mt-3 mb-2 w-100 btn btn-outline-secondary"
                onClick={() => setJoinTeamVisible(true)}
              >
                Join your team
              </button>
              <button
                className="btn btn-sm btn-link text-primary w-100"
                onClick={() => setForgotPasswordVisible(true)}
              >
                Forgot Password?
              </button>

              <div className="border-top mt-2 pt-3">
                <h5 className="d-block mb-3">Don't have an account?</h5>

                <button className="w-100 btn btn-primary" onClick={() => setSignUpVisible(true)}>
                  Register here
                </button>
              </div>
            </div>
          </div>
          <ImageContainer className="col-lg-9">&nbsp;</ImageContainer>
        </div>
      </div>

      {signupVisible && (
        <SignupWizard
          onSignupComplete={(result) => {
            setSignUpVisible(false);
            setSignupResult({
              result: result,
            });
          }}
          onClose={() => {
            setSignUpVisible(false);
            global.reset();
          }}
        />
      )}
      {joinTeamVisible && <JoinTeam onClose={() => setJoinTeamVisible(false)} />}
      {forgotPasswordVisible && <ForgotPassword onClose={() => setForgotPasswordVisible(false)} />}
      {signupResult && (
        <SignupResult onClose={() => setSignupResult(null)} signupResult={signupResult} />
      )}
    </>
  );
};

export default LoginScreen;
