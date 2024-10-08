import React from "react";

const Select = ({
  name,
  label,
  options,
  error,
  dataProperty,
  displayProperty,
  ...rest
}) => {
  return (
    <div className={"form-group " + name}>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className={"form-control"}
        onBlur={e => rest.onBlur && rest.onBlur(e, rest.onBlurCB)}>
        {options.map((option, key) => (
          <option
            key={key}
            value={
              dataProperty !== undefined ? option[dataProperty] : option.value
            }
          >
            {displayProperty !== undefined
              ? option[displayProperty]
              : option.name}
          </option>
        ))}
      </select>
      {/* <select name={name} id={name} {...rest} className={error && "error-bdr"}>
        {options.map((option, key) => (
          <option key={key} value={option.value}>
            {option.name}
          </option>
        ))}
      </select> */}
      {error && (
        <small className="alert alert-danger mt-2 p-1 d-inline-block">
          {error}
        </small>
      )}
    </div>
  );
};

export default Select;
