import React from "react";

const Textarea = ({ name, label, error, ...rest }) => {
  return (
    <div className={"form-group " + name}>
      {label && label !== "" && <label htmlFor={name}>{label}</label>}
      <textarea
        {...rest}
        cols={60}
        rows={3}
        name={name}
        id={name}
        className={"form-control " || (error && "error-bdr")}
      ></textarea>
      {error && (
        <small className="alert alert-danger mt-2 p-1 d-inline-block">
          {error}
        </small>
      )}
    </div>
  );
};

export default Textarea;
