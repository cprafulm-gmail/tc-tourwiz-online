import * as React from "react";
import styled from "styled-components";
import {Clear} from "./base-components";

const StepperBox = styled.div.attrs(props => {
    return {
        className: `${props.active ? "text-primary" : ""}`
    }
})`
  padding: ${props => props.active ? "5px 20px 5px 10px" : "5px 20px 5px 0px"};
  display: inline-block;
  margin: 5px;
  float: left;
  border-radius: 5px;
  color: ${props => props.active ? "" : "rgba(111, 111, 111)"}
`

const StepperNumber = styled.div.attrs(props => {
    return {
        className: `${props.active ? "bg-primary" : props.success ? "bg-success" : ""}`
    }
})`
  padding: 1px;
  border: ${props => props.active ? "" : "1px solid rgba(111, 111, 111, 0.2)"};
  border-radius: 50%;
  height: 28px;
  width: 28px;
  display: inline-block;
  text-align: center;
  margin: 10px;
  color: ${props => props.active ? "rgba(255,255,255, 1)" : props.success ? "white" : "rgba(111, 111, 111)"}
`

const StepperItem = (props) => <StepperBox {...props}>
    <StepperNumber {...props}>{props.success ? '✓' : props.index}</StepperNumber>
    {props.label}
</StepperBox>

const Stepper = (props) => <div style={{
    marginTop: "10px",
    textAlign: "left",
}}>
    <div style={{}}>
        {props.steps.map((x, i) => <StepperItem success={i < props.step} active={i === props.step} key={x.key ?? x}
                                                label={x.key ?? x} index={i + 1}/>)}
        <Clear/>
    </div>

    <div style={{
        padding: "10px",
        marginLeft: "19px",
        marginTop: "10px"
    }}>
        <h2>{props.steps[props.step].title}</h2>
    </div>

</div>

export default Stepper;
