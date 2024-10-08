import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className={"form-group " + name}>
      {label !== "" && <label htmlFor={name}>{label}</label>}
      {/* <input {...rest} name={name} id={name} className="form-control" /> */}
      <input
        {...rest}
        name={name}
        id={name}
        className={"form-control " || (error && "error-bdr")}
        onBlur={e => rest.onBlur && rest.onBlur(e, rest.onBlurCB)}
        autocomplete="off"
      />
      {/* <input {...rest} name={name} id={name} className={error && "error-bdr"} /> */}
      {error && (
        <small className="alert alert-danger mt-2 p-1 d-inline-block">
          {error}
        </small>
      )}
    </div>
  );
};

export default Input;
