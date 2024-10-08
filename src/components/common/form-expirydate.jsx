import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import SVGIcon from "../../helpers/svg-icon";

const ExpiryDateInput = ({ name, label, error, ...rest }) => {
  return (
    <div className={"form-group " + name}>
      <label htmlFor={name}>{label}</label>
      <DateR
        id={name}
        startDate={
          rest.value !== ""
            ? moment(new Date(rest.value)).format("DD/MM/YYYY")
            : moment(new Date()).format("DD/MM/YYYY")
        }
        minDate={moment(new Date()).format("DD/MM/YYYY")}
        autoApply={true}
        autoUpdateInput={false}
        locale={{ format: "DD/MM/YYYY" }}
        singleDatePicker={true}
        showDropdowns={true}
        onApply={rest.onChange}
        drops= {document.getElementById(name) != null && window.innerHeight - document.getElementById(name).getBoundingClientRect().bottom < 200 ? "up" : "down"}
      >
        <input
          {...rest}
          value={
            rest.value !== ""
              ? moment(new Date(rest.value)).format("DD/MM/YYYY")
              : ""
          }
          name={name}
          id={name}
          className={"form-control bg-white"}
          readOnly
        />
        {/* <input
          {...rest}
          value={
            rest.value !== ""
              ? moment(new Date(rest.value)).format("DD/MM/YYYY")
              : ""
          }
          name={name}
          id={name}
          className={error && "error-bdr"}
          readOnly
        /> */}
        <SVGIcon name="calendar" width="16" height="16" style={{
          position: "absolute",
          top: "43px",
          right: "24px"
        }}></SVGIcon>
      </DateR>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};

export default ExpiryDateInput;
