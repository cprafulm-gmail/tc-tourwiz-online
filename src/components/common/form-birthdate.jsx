import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const BirthDateInput = ({ name, label, error, ...rest }) => {
  const value =
    rest.value !== "" &&
      rest.value !== "0001-01-01" &&
      rest.value !== "0001-01-01T00:00:00"
      ? rest.value
      : "";

  const getMinDate = () => {
    let diffNumber = 0;
    let conditiondate = rest.conditiondate
      ? new Date(rest.conditiondate)
      : new Date();
    if (rest.typestring) {
      //flight Case only
      if (rest.typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (rest.typestring === "ADT") {
        diffNumber = 100;
      } //Flight Case
      else if (rest.typestring === "CHD") {
        diffNumber = 12;
      } //Flight Case
      else if (rest.typestring === "INF") {
        diffNumber = 2;
      } //Hotel Case
      else if (rest.typestring === "ADT-CHD") {
        diffNumber = 100;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
      conditiondate.setDate(conditiondate.getDate() + 1);
    } else {
      conditiondate.setFullYear(conditiondate.getFullYear() - 100);
      conditiondate.setDate(conditiondate.getDate() + 1);
    }
    return moment(conditiondate);
  };

  const getMaxDate = () => {
    let diffNumber = 0;
    let conditiondate = rest.conditiondate
      ? new Date(rest.conditiondate)
      : new Date();

    if (rest.typestring) {
      //flight Case only
      if (rest.typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 0);

      //Flight Case
      if (rest.typestring === "ADT") {
        diffNumber = 12;
      } //Flight Case
      else if (rest.typestring === "CHD") {
        diffNumber = 2;
      } //Flight Case
      else if (rest.typestring === "INF") {
        diffNumber = 0;
      } //Hotel Case
      else if (rest.typestring === "ADT-CHD") {
        diffNumber = 12;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
    }

    return moment(conditiondate);
  };

  return (
    <div className={"form-group " + name}>
      <label htmlFor={name}>{label}</label>
      <DateR
        id={name}
        startDate={
          value !== ""
            ? moment(value) < getMaxDate()
              ? moment(value)
              : getMaxDate()
            : getMaxDate()
        }
        endDate={
          value !== ""
            ? moment(value) < getMaxDate()
              ? moment(value)
              : getMaxDate()
            : getMaxDate()
        }
        minDate={getMinDate()}
        maxDate={getMaxDate()}
        autoApply={true}
        autoUpdateInput={false}
        locale={{
          format: Global.getEnvironmetKeyValue("DisplayDateFormate"),
          applyLabel: Trans("_datePickerApply"),
          cancelLabel: Trans("_datePickerCancel"),
          fromLabel: Trans("_datePickerFrom"),
          toLabel: Trans("_datePickerTo"),
          customRangeLabel: Trans("_datePickerCustom"),
          daysOfWeek: [
            Trans("_datePickerDaySu"),
            Trans("_datePickerDayMo"),
            Trans("_datePickerDayTu"),
            Trans("_datePickerDayWe"),
            Trans("_datePickerDayTh"),
            Trans("_datePickerDayFr"),
            Trans("_datePickerDaySa")
          ],
          monthNames: [
            Trans("_datePickerMonthJanuary"),
            Trans("_datePickerMonthFebruary"),
            Trans("_datePickerMonthMarch"),
            Trans("_datePickerMonthApril"),
            Trans("_datePickerMonthMay"),
            Trans("_datePickerMonthJune"),
            Trans("_datePickerMonthJuly"),
            Trans("_datePickerMonthAugust"),
            Trans("_datePickerMonthSeptember"),
            Trans("_datePickerMonthOctober"),
            Trans("_datePickerMonthNovember"),
            Trans("_datePickerMonthDecember")
          ]
        }}
        singleDatePicker={true}
        showDropdowns={true}
        onApply={rest.onChange}
        drops= {document.getElementById(name) != null && window.innerHeight - document.getElementById(name).getBoundingClientRect().bottom < 200 ? "up" : "down"}
      >
        <input
          {...rest}
          value={
            value !== ""
              ? moment(value).format(
                Global.getEnvironmetKeyValue("DisplayDateFormate")
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
      {error && (
        <small className="alert alert-danger mt-2 p-1 d-inline-block">
          {error}
        </small>
      )}
    </div>
  );
};

export default BirthDateInput;
