import styled from "styled-components";

const Backdrop = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(222, 222, 222, 0.85);
  left: 0px;
  top: 0px;
  position: absolute;
  backdrop-filter: blur(8px);
`;

const Modal = (props) => {
  return (
    <div>
      <Backdrop />

      <div
        className={"modal"}
        style={{
          display: "block",
        }}
        tabIndex={"-1"}
        role={"dialog"}
      >
        <div className={"modal-dialog modal-dialog-centered"} role={"document"}>
          <div
            style={{
              boxShadow: "0px 2px 5px rgba(111, 111, 111, 0.1)",
            }}
            className={"modal-content"}
          >
            <div className={"modal-header"}>
              <h5 className={"modal-title"}>{props.title}</h5>
              <button type="button" className="close" onClick={props.onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={"modal-body"}>{props.children}</div>
            {props.footer && (
              <div className={"modal-footer"}>{props.footer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
