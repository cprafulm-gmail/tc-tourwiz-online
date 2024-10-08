import React, {useState} from "react";
import {StepContent} from "../components/wizard-container";
import {Button} from "../components/base-components";
import {NavItem} from "./login-details-step";

const InviteStep = (props) => {

    const [invitedMembers, setInvitedMembers] = useState([]);
    const [fromMode, setFromMode] = useState("email");

    return <StepContent {...props}>

        <div className="card">
            <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                    <NavItem key={"email"} label={"Email"} val={"email"} active={fromMode === "email"}
                             onClick={() => setFromMode("email")}/>
                    <NavItem key={"phone"} label={"Phone"} val={"phone"} active={fromMode === "phone"}
                             onClick={() => setFromMode("phone")}/>
                </ul>
            </div>
            <div className="card-body">
                <div className="row g-3">
                    <div className={"col-auto"}>
                        <input type="text" className="form-control" placeholder="email"
                               aria-label="email" aria-describedby="button-addon2"/>
                    </div>
                    <div className={"col-auto"}>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2">Invite</button>
                    </div>
                </div>
            </div>
        </div>


    </StepContent>
}

export default InviteStep;
