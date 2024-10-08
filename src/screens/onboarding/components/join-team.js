import styled from "styled-components";
import Modal from "./modal";

const JoinTeamForm = styled.div`
  border: 1px solid #ccc;
  margin: 10px;
  background: white;
  border-radius: 5px;
  position: absolute;
  width: 400px;
  padding: 30px;
  left: 50vw;
  top: 50vh;
  z-index: 999;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 0px 2px 5px rgba(111, 111, 111, 0.1);
`

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(222, 222, 222, 0.85);
  left: 0;
  top: 0;
  position: absolute;
  backdrop-filter: blur(8px);
`

const JoinTeam = (props) => {
    return (
        <Modal
            title={"Join your team"}
            onClose={props.onClose}
            footer={[
                <button onClick={props.onClose} className="btn btn-outline-secondary">Cancel</button>,
                <button className="btn btn-primary" type="submit">Verify and Join</button>
            ]}
        >
            <div className="alert alert-success" role="alert">
                Please fill up below details from your team invitation
            </div>

            <label htmlFor="inputTeam" className="visually-hidden">Team Name</label>
            <input type="text" id="inputTeam" className="form-control"
                   placeholder="Enter your team name" required=""
                   autoFocus=""></input>

            <label htmlFor="inputEmail" className="visually-hidden">Email Address</label>
            <input type="email" id="inputEmail" className="form-control"
                   placeholder="Enter your email address" required=""
                   autoFocus=""></input>

            <label htmlFor="inputPassword" className="visually-hidden">Password</label>
            <input type="password" id="inputPassword" className="form-control"
                   placeholder="Set new password"
                   required=""></input>

            <label htmlFor="inputConfirmPassword" className="visually-hidden">Confirm Password</label>
            <input type="password" id="inputConfirmPassword" className="form-control"
                   placeholder="Confirm password"
                   required=""></input>
            <label htmlFor="inputOtp" className="visually-hidden">Enter OTP</label>
            <input type="otp" id="inputOtp" className="form-control"
                   placeholder="Enter OTP received in invitation"
                   required=""></input>
        </Modal>
    )
}

export default JoinTeam;
