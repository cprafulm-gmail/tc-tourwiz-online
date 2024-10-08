import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

const PassportExpiryDateInput = ({ name, label, error, type, ...rest }) => {
  const value =
    rest.value !== "" &&
      rest.value !== "0001-01-01" &&
      rest.value !== "0001-01-01T00:00:00"
      ? rest.value
      : "";

  //Add 2 month in passport expiry date field .
  const startdate = rest.istransfers === "false" && type === "withtime" ? moment(rest.startdate)
    : moment().add(rest.istransfers ? 0 : 6, "months").format(Global.DateFormate);

  return (
    <div className={"form-group " + name}>
      <label htmlFor={name}>{label}</label>
      <DateR
        id={name}
        startDate={
          value !== ""
            ? moment(value).isBefore(moment(startdate))
              ? moment(startdate)
              : moment(value)
            : moment(startdate)
        }
        minDate={moment(startdate)}
        maxDate={
          rest.istransfers === "false" && type === "withtime" ?
            moment(startdate).add(rest.stayInDays, 'days').set({ h: 23, m: 59 })
            : moment().add(25, 'year')}
        autoApply={true}
        autoUpdateInput={false}
        locale={{ format: Global.getEnvironmetKeyValue("DisplayDateFormate") }}
        singleDatePicker={true}
        datePicker={true}
        timePicker={type === "withtime" ? true : false}
        showDropdowns={true}
        timePicker24Hour={true}
        timePickerIncrement={1}
        timePickerSeconds={false}
        onApply={rest.onChange}
        drops= {document.getElementById(name) != null && window.innerHeight - document.getElementById(name).getBoundingClientRect().bottom < 200 ? "up" : "down"}
      >
        <input
          {...rest}
          value={
            value !== ""
              ? moment(value).format(
                type === "withtime" ? Global.getEnvironmetKeyValue("DisplayDateFormate") + ' HH:mm' : Global.getEnvironmetKeyValue("DisplayDateFormate")
              )
              : ""
          }
          name={name}
          id={name}
          className={"form-control bg-white"}
          readOnly
        />
        <SVGIcon name="calendar" width="16" height="16" style={{
          position: "absolute",
          top: "43px",
          right: "24px"
        }}></SVGIcon>
      </DateR>
      {
        error && (
          <small className="alert alert-danger mt-2 p-1 d-inline-block">
            {error}
          </small>
        )
      }
    </div >
  );
};

export default PassportExpiryDateInput;
