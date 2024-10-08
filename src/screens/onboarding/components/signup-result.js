import Modal from "./modal";

const SignupResult = (props) => {
  return (
    <Modal
      title={
        props.signupResult ? "Welcome aboard !" : "Oops ! something went wrong"
      }
      footer={[
        <button onClick={props.onClose} className="btn btn-outline-secondary">
          Close
        </button>,
      ]}
    >
      {props.signupResult
        ? "Please go ahead and login with your credentials"
        : "We were unable to create your account, please try again later"}
    </Modal>
  );
};

export default SignupResult;
