import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

const PaymentDateInput = ({ name, label, error, ...rest }) => {
  const value =
    rest.value !== "" && rest.value !== "0001-01-01" && rest.value !== "0001-01-01T00:00:00"
      ? rest.value
      : "";

  return (
    <div className={"form-group " + name}>
      <label htmlFor={name}>{label}</label>
      <DateR
        id={name}
        autoApply={true}
        autoUpdateInput={false}
        locale={{ format: Global.getEnvironmetKeyValue("DisplayDateFormate") }}
        singleDatePicker={true}
        showDropdowns={true}
        onApply={rest.onChange}
        drops= {document.getElementById(name) != null && window.innerHeight - document.getElementById(name).getBoundingClientRect().bottom < 200 ? "up" : "down"}
      >
        <input
          {...rest}
          value={
            value !== ""
              ? moment(new Date(value)).format(Global.getEnvironmetKeyValue("DisplayDateFormate"))
              : ""
          }
          name={name}
          id={name}
          className={"form-control bg-white"}
          readOnly
        />
        <SVGIcon
          name="calendar"
          width="16"
          height="16"
          style={{
            position: "absolute",
            top: "43px",
            right: "24px",
          }}
        ></SVGIcon>
      </DateR>
      {error && <small className="alert alert-danger mt-2 p-1 d-inline-block">{error}</small>}
    </div>
  );
};

export default PaymentDateInput;
