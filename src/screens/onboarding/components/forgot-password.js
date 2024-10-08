import Modal from "./modal";
import { TourwizApi } from "../api";
import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as Global from "../../../helpers/global";
import Config from "../../../config";

const recaptchaRef = React.createRef();
const ForgotPasswordResult = (props) => {
    return (
        <Modal title={props.isSuccess ? (props.isGeneratePassword ? "Password Generated Successfully" : "Password Updated Successfully") : "Oops ! Something went wrong"}
            onClose={props.onClose} footer={[
                <button type="button" className="btn btn-outline-secondary" onClick={props.onClose}>Close</button>
            ]}>
            {props.isSuccess ? "You can login with your new password" : "Please make sure you entered a valid OTP, please try again later."}
        </Modal>
    );
}



const ForgotPassword = (props) => {

    const [loginId, setLoginId] = useState();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState();
    const [password, setPassword] = useState();
    const [verifyPassword, setVerifyPassword] = useState();
    const [showResult, setShowResult] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [ErrorCaptcha, setErrorCaptcha] = useState("");
    const [ErrorEmailid, setErrorEmailid] = useState("");
    const [isInvalidPassword, setIsInvalidPassword] = useState(true);
    const [isInvalidVerifyPassword, setIsInvalidVerifyPassword] = useState(true);
    const [isInvalidEmailId, setIsInvalidEmailId] = useState(true);
    const passerrormsg = "<,>,',&,`,\" and blank space characters not allowed";
    const validate = (isfrompassword, value) => {
        var options = /[<>'&` "]/;

        var ispasswordinvalid = false;
        var isverifypasswordinvalid = false;
        if (!options.test(password))
            setIsInvalidPassword(true);
        else {
            setIsInvalidPassword(false);
            ispasswordinvalid = true;
        }

        if (!options.test(verifyPassword))
            setIsInvalidVerifyPassword(true);
        else {
            setIsInvalidVerifyPassword(false);
            isverifypasswordinvalid = true;
        }
        if (isverifypasswordinvalid || ispasswordinvalid) {
            return false;
        }
        else
            return true;

    }

    const validateEmail = (value) => {
        var options = /^(?:[a-zA-Z0-9!#$%'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        var isEmailinvalid = false;
        if (options.test(loginId))
            setIsInvalidEmailId(true);
        else {
            setIsInvalidEmailId(false);
            isEmailinvalid = true;
        }

        if (isEmailinvalid) {
            return false;
        }
        else
            return true;

    }

    return (
        <>
            {showResult && <ForgotPasswordResult onClose={props.onClose} isSuccess={isSuccess} />}
            {!showResult && <Modal title={props.isGeneratePassword ? "Generate Password" : "Reset your password"} onClose={props.onClose} footer={[
                <button type="button" className="btn btn-outline-secondary" onClick={props.onClose}>Close</button>,
                <button type="button" className="btn btn-primary"
                    disabled={otpSent && (otp?.length !== 6 || password === undefined || password?.length < 4 || password !== verifyPassword)}
                    onClick={() => {
                        if (otpSent && validate(true, password)) {
                            TourwizApi.forgotPassword(loginId, password, otp, props.isFromB2CPortal).then((res) => {
                                setSuccess(res.result === "ok");
                                setShowResult(true);
                            }).catch(() => {
                                setSuccess(false);
                                setShowResult(true);
                            })
                        } else {
                            if (recaptchaRef.current.getValue() !== "" && recaptchaRef.current.getValue() !== undefined && loginId !== "" && loginId !== undefined) {
                                if (validateEmail(loginId)) {
                                    TourwizApi.sendPasswordOtp(loginId
                                        , Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true"
                                            ? recaptchaRef.current.getValue() : ""
                                        , props.isFromB2CPortal).then((data) => {
                                            if (data.error) {
                                                setErrorEmailid(data.error);
                                                setErrorCaptcha("");
                                            }
                                            else {
                                                setOtpSent(true);
                                                setErrorEmailid("");
                                                setErrorCaptcha("");
                                            }
                                        }).catch(() => {
                                            setOtpSent(true);
                                        })
                                }
                                else {
                                    setErrorEmailid("Please enter valid email address");
                                    setErrorCaptcha("");
                                }
                            }
                            else if ((recaptchaRef.current.getValue() === "" || recaptchaRef.current.getValue() === undefined) && (loginId === "" || loginId === undefined)) {
                                setErrorEmailid("Enter your email address");
                                setErrorCaptcha("Please verify captcha");
                            }
                            else if (loginId === "" || loginId === undefined) {
                                setErrorEmailid("Enter your email address");
                                setErrorCaptcha("");
                            }
                            else if (recaptchaRef.current.getValue() === "" || recaptchaRef.current.getValue() === undefined) {
                                setErrorEmailid("");
                                setErrorCaptcha("Please verify captcha");
                            }
                        }

                    }}>{otpSent ? "Verify Email" : "Get OTP"}</button>
            ]}>
                <label htmlFor="inputEmail" className="visually-hidden">Email Address</label>
                <input disabled={otpSent} type="email" id="inputEmail" className="form-control"
                    placeholder="Enter your email address" required=""
                    onChange={(e) => {
                        setLoginId(e.target.value);
                    }}
                    autoFocus="" />
                {!otpSent && ErrorEmailid !== "" && (
                    <div className="col-lg-12 col-sm-12 m-0 p-0">
                        <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                            {ErrorEmailid}
                        </small>
                    </div>
                )}
                {!otpSent && Global.getEnvironmetKeyValue("ISALLOWCAPTCHA", "cobrand") === "true" && (
                    <div className="pt-3">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={(Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") !== "") ? Global.getEnvironmetKeyValue("GoogleCaptchSiteKey", "cobrand") : Config.GoogleCaptchSiteKey}
                            hl={'en'}
                        />
                        {ErrorCaptcha !== "" && (
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                    {ErrorCaptcha}
                                </small>
                            </div>
                        )}
                    </div>)}
                {otpSent && <>
                    <hr />
                    <label htmlFor="inputPassword" className="visually-hidden">Enter New Password</label>
                    <input type="password" id="inputPassword"
                        className={`form-control ${(password?.length > 4 && password === verifyPassword ? "is-valid" : "")}`}
                        placeholder="Enter new password" required=""
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        autoFocus="" />
                    <PasswordStrengthBar style={{
                        height: "1px"
                    }} password={password} />
                    {!isInvalidPassword && <div className="alert alert-danger mt-1">{passerrormsg}</div>}
                    <label htmlFor="inputVerifyPassword" className="visually-hidden">Verify Password</label>
                    <input type="password" id="inputVerifyPassword"
                        className={`form-control ${(password?.length > 4 && password === verifyPassword ? "is-valid" : "")}`}
                        placeholder="Verify Password" required=""
                        onChange={(e) => {
                            setVerifyPassword(e.target.value);
                        }}
                        autoFocus="" />
                    {!isInvalidVerifyPassword && <div className="alert alert-danger mt-1">{passerrormsg}</div>}
                    <hr />
                    <label htmlFor="inputOtp" className="visually-hidden">OTP</label>
                    <input type="number" id="inputOtp" className="form-control"
                        placeholder="Enter OTP" required=""
                        onChange={(e) => {
                            setOtp(e.target.value);
                        }}
                        autoFocus="" />
                </>}
            </Modal>}
        </>
    )
}
    ;

export default ForgotPassword;
