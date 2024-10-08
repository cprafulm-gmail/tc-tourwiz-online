import * as React from "react";
import Stepper from "./stepper";
import styled, { keyframes } from "styled-components";
import { Button, Clear } from "./base-components";
import { fadeIn } from "react-animations";

const slideOutLeftAnimation = keyframes`${fadeIn}`;

const ContentContainer = styled.div.attrs({
  className: "col-sm",
})`
  border: 1px solid rgba(0,0,0,0.2);
  margin: 10px;
  background: white;
  padding-bottom: 15px;
  border-radius: 0.3rem;
  position: absolute;
  width: 600px;
  left: 50vw;
  top: 50vh;
  z-index: 999;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 0px 2px 5px rgba(111, 111, 111, 0.1);
  @media (max-width: 1400px) { top: calc(50vh + 60px);};
`;

const Backdrop = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(222, 222, 222, 0.85);
  left: 0;
  top: 0;
  position: fixed;
  backdrop-filter: blur(8px);
`;

const StepContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  padding: 10px 40px 20px 40px;
`;

export const StepContent = styled.div`
  animation: 0.3s ${slideOutLeftAnimation};
  display: ${(props) => (props.isVisible ? "block" : "none")}
`;

class WizardContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"container"}>
        <Backdrop onClick={this.props.onClose} />
        <div className={["row", "justify-content-md-center"]}>
          <ContentContainer>
            <Stepper steps={this.props.steps} step={this.props.step ?? 0} />

            <StepContainer>{this.props.children}</StepContainer>

            <hr />

            <Button
              type={this.props.nextState?.type ?? "primary"}
              position={"right"}
              onClick={this.props.nextState?.onNext ?? this.props.onNext}
              disabled={this.props.nextState?.disabled}
            >
              {this.props.nextState?.loading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              &nbsp;{this.props.nextState?.label ?? "Next"}
            </Button>
            {this.props.step > 0 && (
              <Button position={"left"} onClick={this.props.onBack}>
                Back
              </Button>
            )}
            {this.props.step === 0 && (
              <Button position={"left"} onClick={this.props.onClose}>
                Cancel
              </Button>
            )}
            <Clear />
          </ContentContainer>
        </div>
      </div>
    );
  }
}

export default WizardContainer;
