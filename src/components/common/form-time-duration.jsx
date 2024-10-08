import React from "react";
import TimeField from 'react-simple-timefield';

const TimeDuration = ({ name, label, error, ...rest }) => {
  return (
    <div className={"form-group " + name}>
      {label !== "" && <label htmlFor={name}>{label}</label>}
      
      <TimeField
        {...rest}
        name={name}
        id={name}
        className={"form-control w-100 " || (error && "error-bdr")}
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

export default TimeDuration;
