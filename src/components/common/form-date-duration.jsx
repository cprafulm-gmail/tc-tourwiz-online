import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

const DateDurationInput = ({ name, label, error, type, ...rest }) => {
  //Params understanding in <DateR>
  //startDate, endDate => Selection Range OR seleced Value 
  //minDate, maxDate => available maximum and minimum date which is available for selection (Generaly used for disable dates.)
  //Do not remove below line , purpose : in case of single date picker, it gives range (in this case we do not need any kind of range.)
  //key={moment().unix()} 
  const value =
    rest.value !== "" &&
      rest.value !== "0001-01-01" &&
      rest.value !== "0001-01-01T00:00:00"
      ? rest.value
      : "";

  //Add 2 month in passport expiry date field .
  const startdate = rest.istransfers === "false" && type === "withtime" ? moment(rest.startdate).format('YYYY-MM-DD')
    : rest.istransfers === "true" ? moment(
      new Date().setMonth(rest.istransfers ? new Date(rest.startdate).getMonth() + 0 : new Date(rest.startdate).getMonth() + 6)
    ).format('YYYY-MM-DD') : moment(rest.startdate).format('YYYY-MM-DD');
  const mindate = moment(rest.minDate);
  return (
    //Do not delete key from below line
    <div className={"form-group " + name} key={moment().unix()}>
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
        minDate={mindate}
        maxDate={
          rest.istransfers === "false" && type === "withtime" ?
            moment(startdate).add(rest.stayInDays, 'days').set({ h: 23, m: 59 })
            : name === "followupDate" ? moment(rest.maxDate) :
              moment(
                new Date().setFullYear(new Date(mindate).getFullYear() + 25)
              )}
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

export default DateDurationInput;
