import { useState } from "react";
import WizardContainer from "./wizard-container";
import IntroductionStep from "../steps/introduction-step";
import CustomizationStep from "../steps/customization-step";
import LoginDetails from "../steps/login-details-step";
import InviteStep from "../steps/invite-step";
import EmailLoginDetailsStep from "../steps/email-login-details-step";

const SignupWizard = (props) => {
  let [step, setStep] = useState(0);

  let [showSignupResult, setSignupResult] = useState();

  let [nextState, setNextState] = useState({
    disabled: false,
    label: "Next",
  });

  const next = () => {
    setStep((step + 1) % 3);
    if (nextState?.onNext) {
      nextState.onNext();
    }
  };

  return (
    <div
      style={{
        textAlign: "left",
      }}
    >
      <WizardContainer
        step={step}
        nextState={nextState}
        onNext={next}
        onClose={props.onClose}
        onBack={() => {
          setStep(step - 1 < 0 ? 0 : step - 1);
          setNextState(null);
        }}
        steps={[
          {
            key: "Get Started",
            title: "Tell us about your business",
          },
          {
            key: "Customize",
            title: "How would you like to customize your experience ?",
          },
          {
            key: "Login Details",
            title: "How would you like to Login ?",
          },
        ]}
      >
        <IntroductionStep
          setNextState={setNextState}
          nextState={nextState}
          isVisible={step === 0}
          step={0}
        />
        <CustomizationStep
          setNextState={setNextState}
          nextState={nextState}
          isVisible={step === 1}
          step={1}
        />
        <EmailLoginDetailsStep
          setNextState={setNextState}
          nextState={nextState}
          isVisible={step === 2}
          goNext={next}
          onSignupComplete={props.onSignupComplete}
          step={2}
        />
      </WizardContainer>
    </div>
  );
};

export default SignupWizard;
