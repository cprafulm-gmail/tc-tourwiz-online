import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

const SingleDateCalendar = ({ name, label, error, type, ...rest }) => {
  const value =
    rest.value !== "" &&
      rest.value !== "0001-01-01" &&
      rest.value !== "0001-01-01T00:00:00"
      ? rest.value
      : "";

  const startdate = rest.istransfers === "false" && type === "withtime" ? moment(rest.startdate).format('YYYY-MM-DD')
    : rest.istransfers === "true" ? moment(
      new Date().setMonth(rest.istransfers ? new Date(rest.startdate).getMonth() + 0 : new Date(rest.startdate).getMonth() + 6)
    ).format('YYYY-MM-DD') : moment(rest.startdate).format('YYYY-MM-DD');
  const mindate = moment(rest.mindate ? rest.mindate : startdate);
  var htmlForString = name + "_" + (+ new Date())
  return (
    <div className={"form-group " + name} key={+ new Date()}>
      <label htmlFor={htmlForString}>{label}</label>
      {!rest.disabled &&
        <DateR
          id={htmlForString}
          startDate={
            value !== ""
              ? moment(value).isBefore(moment(startdate))
                ? moment(startdate)
                : moment(value)
              : moment(startdate)
          }
          endDate={
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
              : name === "followupDate" || rest.maxdate ? moment(rest.maxdate)
                : moment().add(25, 'years')}
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
          drops={document.getElementById(name) != null && window.innerHeight - document.getElementById(name).getBoundingClientRect().bottom < 200 ? "up" : "down"}
        >
          <input
            {...rest}
            value={
              value !== ""
                ? moment(new Date(value)).format(
                  type === "withtime" ? Global.getEnvironmetKeyValue("DisplayDateFormate") + ' HH:mm' : Global.getEnvironmetKeyValue("DisplayDateFormate")
                )
                : ""
            }
            name={name}
            id={htmlForString}
            className={"form-control bg-white"}
            readOnly
          />
          <SVGIcon name="calendar" width="16" height="16" style={{
            position: "absolute",
            top: "43px",
            right: "24px"
          }}></SVGIcon>
        </DateR>
      }
      {rest.disabled &&
        <React.Fragment>
          <input
            {...rest}
            value={
              value !== ""
                ? moment(new Date(value)).format(
                  type === "withtime" ? Global.getEnvironmetKeyValue("DisplayDateFormate") + ' HH:mm' : Global.getEnvironmetKeyValue("DisplayDateFormate")
                )
                : ""
            }
            name={name}
            id={name}
            className={"form-control"}
            disabled={true}
          />
          <SVGIcon name="calendar" width="16" height="16" style={{
            position: "absolute",
            top: "43px",
            right: "24px"
          }}></SVGIcon>
        </React.Fragment>
      }
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

export default SingleDateCalendar;
