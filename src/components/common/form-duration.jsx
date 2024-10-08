import React from "react";

const InputDuration = ({ name, label, error, ...rest }) => {
  return (
    <div className={"form-group row " + name}>
      {label !== "" && <label htmlFor={name}>{label}</label>}
      {/* <input {...rest} name={name} id={name} className="form-control" /> */}
      <div class="input-group col-6 m-0 p-0">
        <input
          onChange={rest.onChange}
          value={rest.value[0]}
          name={name[0]}
          id={name[0]}
          className={"form-control p-2 " + (error && error[0] && " border border-danger")}
          // onBlur={e => rest.onBlur && rest.onBlur(e, rest.onBlurCB)}
          placeholder={"hh"}
          maxLength={3}
          disabled={rest.disabled}
        />
        {error[0] && (
          <small className="alert alert-danger mt-2 p-1 d-inline-block">
            {error[0]}
          </small>
        )}
        {/* <div class="input-group-append">
        <span class="input-group-text" id="basic-addon2">h</span>
      </div> */}
      </div>
      <div class="input-group col-6 m-0 p-0">
        <input
          onChange={rest.onChange}
          value={rest.value[1]}
          name={name[1]}
          id={name[1]}
          className={"form-control p-2 " + (error && error[1] && " border border-danger")}
          // onBlur={e => rest.onBlur && rest.onBlur(e, rest.onBlurCB)}
          placeholder={"mm"}
          maxLength={2}
          disabled={rest.disabled}
        />
        {/* <div class="input-group-append">
          <span class="input-group-text" id="basic-addon2">m</span>
        </div> */}
        {error[1] && (
          <small className="alert alert-danger mt-2 p-1 d-inline-block">
            {error[1]}
          </small>
        )}
      </div>
      {/* <input {...rest} name={name} id={name} className={error && "error-bdr"} /> */}

    </div>
  );
};

const validatenumber = (data, mode) => {

}
export default InputDuration;
