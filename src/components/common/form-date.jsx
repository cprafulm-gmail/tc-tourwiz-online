import React from "react";
import DateR from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const DateInput = ({
  fromName,
  toName,
  fromLabel,
  toLabel,
  error,
  ...rest
}) => {
  const fromdate =
    rest.fromdate !== "" &&
      rest.fromdate !== "0001-01-01" &&
      rest.fromdate !== "0001-01-01T00:00:00"
      ? moment(rest.fromdate)
      : moment();

  const todate =
    rest.todate !== null &&
      rest.todate !== "" &&
      rest.todate !== "0001-01-01" &&
      rest.todate !== "0001-01-01T00:00:00"
      ? moment(rest.todate)
      : moment();

  return (
    <div className={"form-group fromName-" + fromName + " toName-" + toName}>
      <DateR
        id={fromName + toName}
        startDate={moment(fromdate)}
        endDate={rest.todate !== null ? moment(todate) : moment(fromdate)}
        minDate={
          rest.mindate !== null
            ? rest.mindate.add(-100, 'years')
            : moment().add(-100, 'years')
        }
        maxDate={
          rest.maxdate !== null
            ? rest.maxdate.add(100, 'years')
            : moment().add(100, 'years')
        }
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
        singleDatePicker={
          rest.singledatepicker === undefined ? false : rest.singledatepicker
        }
        showDropdowns={
          rest.showdropdowns === undefined ? false : rest.showdropdowns
        }
        onApply={rest.onChange}
        drops= {document.getElementById(fromName) != null && window.innerHeight - document.getElementById(fromName).getBoundingClientRect().bottom < 200 ? "up" : "down"}
      >
        <div className="row">
          <div
            htmlFor={fromName}
            className={
              "form-group col-lg-" + (rest.singledatepicker ? "12" : "6")
            }
          >
            <label htmlFor={fromName}>{fromLabel}</label>
            <input
              {...rest}
              value={
                fromdate !== ""
                  ? moment(fromdate).format(
                    Global.getEnvironmetKeyValue("DisplayDateFormate")
                  )
                  : ""
              }
              name={fromName}
              id={fromName}
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
                right: "24px"
              }}
            ></SVGIcon>
          </div>
          {!rest.singledatepicker && (
            <div className={"form-group col-lg-6"}>
              <label htmlFor={toName}>{toLabel}</label>
              <input
                {...rest}
                value={
                  fromdate !== ""
                    ? moment(todate).format(
                      Global.getEnvironmetKeyValue("DisplayDateFormate")
                    )
                    : ""
                }
                name={toName}
                id={toName}
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
                  right: "24px"
                }}
              ></SVGIcon>
              {/* {!rest.singledatepicker && ()} */}
            </div>
          )}
        </div>
      </DateR>
      {error && (
        <small className="alert alert-danger mt-2 p-1 d-inline-block">
          {error}
        </small>
      )}
    </div>
  );
};

export default DateInput;
