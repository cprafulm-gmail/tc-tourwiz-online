import React, { Component, createContext, useContext, useEffect } from "react";
import Input from "./form-input";
// import TimeDuration from "./form-time-duration";
// import InputDuration from "./form-duration";
// import Textarea from "./form-text-area";
// import Select from "./form-select";
// import ContactInput from "./form-contact";
// import DateInput from "./form-date";
// import BirhtDateInput from "./form-birthdate";
// import PassportExpiryDateInput from "./form-passport-expiry";
// import SingleDateCalendar from "./form-singledate-calendar";
// import DateDurationInput from "./form-date-duration";
// import PaymentDateInput from "./form-payment-date";
import moment from "moment";

export const FormCtx = createContext({
  data: {},
  errors: {},
});

export const RenderInput = (props) => {

  const { name, label, type, disable, onBlurCB, minlength, maxlength } = props;
  const { data, setDatas, addData, errors, validateData } = useContext(FormCtx);
  const field = data[name] || {};
  const fieldError = errors[name] || "";
  const { value = "" } = field;

  useEffect(() => {
    addData({
      field: props,
      value: "",
    });
  }, []);

  useEffect(() => {
    if (field.value !== undefined) {
      validateData(name);
    }
  }, [value]);

  let rest = {};
  if (onBlurCB) {
    rest = {
      onBlur: handleOnBlur,
      onBlurCB: onBlurCB,
    };
  }

  if (maxlength > 0) rest.maxlength = maxlength;
  if (minlength > 0) rest.minlength = minlength;

  return (
    <Input
      type={type}
      name={name}
      label={label}
      value={value}
      disabled={disable}
      onChange={handleChange} //(event) => setDatas(event, field)}
      error={errors[name]}
      {...rest}
    />
  );
};

export const InputNew = (props) => {

  const { id } = props;
  const { data, setDatas, addData, errors, validateData } = useContext(FormCtx);
  const field = data[id] || {};
  const fieldError = errors[id] || "";
  const { value = "" } = field;


  useEffect(() => {
    addData({
      field: props,
      value: "",
    });
  }, []);

  useEffect(() => {
    if (field.value !== undefined) {
      validateData(id);
    }
  }, [value]);

  return field ? (
    <div>
      <input
        type="text"
        value={field && value}
        onChange={(event) => setDatas(event, field)}
      />
      <p>{fieldError}</p>
    </div>
  ) : (
    ""
  );
};

export default class FormFC extends Component {
  state = {
    data: {},
    errors: {},
  };

  render() {

    const { data, errors } = this.state;
    const formCtx = {
      data,
      errors,
      addData: (datai) => {
        this.addData(datai);
      },
      setDatas: this.setDatas,
      validateData: this.validateData,
    };

    return (
      <form action="">
        <FormCtx.Provider value={formCtx}>
          {this.props.children}
        </FormCtx.Provider>
      </form>
    );
  }

  setDatas = (event, { id }) => {

    event.persist();

    const { data } = this.state;
    const field = data[id];

    this.addData({
      field: {
        ...field,
        value: event.currentTarget.value,
      },
    });
  };

  addData = ({ field }) => {

    const { id, name } = field;

    field = {
      value: "",
      ...field,
    };

    if (id || name) {
      this.setState((prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            [id || name]: field,
          },
        };
      });

      return;
    }

    throw new Error(`please add 'id' field to the input: ${field}`);
  };

  validateData = (id) => {

    let error = "";

    console.log("*********************");
    console.log(this.state.errors);
    console.log("*********************");

    const {
      value: fieldValue,
      validate,
      displayName,
      customRules = {},
    } = this.state.data[id];
    const rules = validate ? validate.split("|") : "";

    if (rules.length) {
      for (const rule in rules) {
        const ruleName = rules[rule];
        const validation = validations[ruleName] || customRules[ruleName];
        const isRuleSatisfied =
          ruleName !== "required" && !fieldValue
            ? true
            : validation.rule().test(fieldValue.toString());

        if (!isRuleSatisfied) {
          error = validation.formatter.apply(null, [displayName || id]);
        }

        if (error !== "") {
          break;
        }
      }

      this.setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          [id]: error,
        },
      }));
    }
  };
}

const handleChange = ({ currentTarget: input }) => {
  const sanitizedValue = input.value; //DOMPurify.sanitize(input.value);
  if (
    (input.name === "departDurationH" ||
      input.name === "departDurationM" ||
      input.name === "returnDurationH" ||
      input.name === "returnDurationM") &&
    isNaN(Number(sanitizedValue))
  )
    return;

  const data = { ...this.state.data };
  if (input.name === "customitemType") {
    data["otherType"] = "";
  }

  if (input.label === "bookedBy") {
    data[input.label] = input.value;
  } else {
    data[input.name] = input.value;
  }

  this.setState({ data, valueChanged: true }, () => {
    if (
      input.name === "taxType" ||
      input.name === "customitemType" ||
      input.name === "CGSTPrice" ||
      input.name === "SGSTPrice" ||
      input.name === "IGSTPrice"
    )
      // For Manual Invoice page
      this.handleAmountFields(input.value, {
        target: { name: input.name, value: input.value },
      });
  });
};

const handleOnBlur = (e, callback) => {
  let value = e.target.value;
  callback(value, e);
};

const onTimeFocus = (event) => {
  if (event.target.value === "HH:MM") {
    const data = { ...this.state.data };
    data[event.target.name] = "00:00";
    this.setState({ data });
  }
};
const onTimeBlur = (event) => {
  if (event.target.value === "00:00") {
    const data = { ...this.state.data };
    data[event.target.name] = "HH:MM";
    this.setState({ data });
  }
};

const onTimeChange = (event, value) => {
  value = value.replace(/H/g, "0").replace(/M/g, "0");
  const newTime = value.replace(/-/g, ":");
  const time = newTime.substr(0, 5);
  const timeSeconds = newTime.substr(0, 5);
  const timeSecondsCustomColon = newTime.substr(0, 5);

  const data = { ...this.state.data };
  data[event.target.name] =
    value === "00:00"
      ? "HH:MM"
      : time.split(":")[0] + "h " + time.split(":")[1] + "m";
  this.setState({ data });
};

const handleDateChange = ({ currentTarget: input }, picker) => {
  const data = { ...this.state.data };
  data[input.firstChild.name] = picker.startDate.format("YYYY-MM-DD");
  if (input.firstChild.name === "departStartDate") {
    data["departEndDate"] = picker.startDate.format("YYYY-MM-DD");
    data["returnStartDate"] = picker.startDate.format("YYYY-MM-DD");
    data["returnEndDate"] = picker.startDate.format("YYYY-MM-DD");
  }
  if (input.firstChild.name === "departEndDate") {
    data["returnStartDate"] = picker.startDate.format("YYYY-MM-DD");
    data["returnEndDate"] = picker.startDate.format("YYYY-MM-DD");
  }
  if (input.firstChild.name === "returnStartDate") {
    data["returnEndDate"] = picker.startDate.format("YYYY-MM-DD");
  }
  // if (input.firstChild.name === "startDate") {
  //   data["endDate"] = picker.startDate.format("YYYY-MM-DD");
  // }
  this.setState({ data });
};

const handleDateChangeWithDuration = ({ currentTarget: input }, picker) => {
  const data = { ...this.state.data };
  data[input.firstChild.name] = picker.startDate.format("YYYY-MM-DD");
  if (
    input.firstChild.name === "startDate" ||
    input.firstChild.name === "bookingFromDate" ||
    input.firstChild.name === "fromDate"
  ) {
    let startdate = "";
    if (input.firstChild.name === "startDate") startdate = data.startDate;
    else if (input.firstChild.name === "bookingFromDate") {
      startdate = data.bookingFromDate;
      data.bookingToDate = moment(data.bookingFromDate)
        .add(7, "days")
        .format("YYYY-MM-DD");
    } else if (input.firstChild.name === "fromDate") {
      startdate = data.fromDate;
      data["toDate"] = moment(data.fromDate).add(1, "M").format("YYYY-MM-DD");
    } else if (input.firstChild.name === "followupDate")
      startdate = data.fromDate;

    if (data.stayInDays !== undefined)
      data.endDate = moment(startdate)
        .add(data.stayInDays, "days")
        .format("YYYY-MM-DD");
    if (data.stayInDays !== undefined && input.firstChild.name === "fromDate")
      data.toDate = moment(startdate)
        .add(
          data.stayInDays === 30 ? 1 : data.stayInDays,
          data.stayInDays === 30 ? "month" : "days"
        )
        .format("YYYY-MM-DD");

    if (
      input.firstChild.name === "startDate" &&
      data.followupDate !== undefined
    ) {
      data.followupDate = moment(startdate)
        .add(-1, "days")
        .format("YYYY-MM-DD");
      if (moment(startdate).isSameOrBefore(moment(), "day"))
        data.followupDate = moment(startdate).format("YYYY-MM-DD");
    }
  }
  if (data.duration !== undefined && data.followupDate === undefined)
    data.duration = this.GetDuration(data.startDate, data.endDate);
  this.setState({ data });
};

const GetDuration = (startDate, endDate) => {
  var tmpStartDate = moment([
    moment(startDate)._d.getFullYear(),
    moment(startDate)._d.getMonth(),
    moment(startDate)._d.getDate(),
  ]);
  var tmpEndDate = moment([
    moment(endDate)._d.getFullYear(),
    moment(endDate)._d.getMonth(),
    moment(endDate)._d.getDate(),
  ]);
  var totaldaysduration = tmpEndDate.diff(tmpStartDate, "days") + 1;
  return totaldaysduration;
};

const handleDateChangeEvent = ({ currentTarget: input }, picker) => {
  const data = { ...this.state.data };
  input.parentElement.classList.forEach((c) => {
    if (c.startsWith("fromName-")) {
      data[c.replace("fromName-", "")] = picker.startDate.format("YYYY-MM-DD");
    } else if (c.startsWith("toName-")) {
      data[c.replace("toName-", "")] = picker.endDate.format("YYYY-MM-DD");
    }
  });
  this.setState({ data });
};

const onPhoneNumberBlur = (status, value, country, number, id, event) => {
  const data = { ...this.state.data };
  data[event.currentTarget.name] = "+" + country.dialCode + "-" + value;
  this.setState({ data });
};

export const renderButton = (label) => {
  return (
    <button onClick={this.handleSubmit} className="btn btn-primary">
      {label}
    </button>
  );
};

export const renderInputParam = ({
  name = "",
  label = "",
  type = "text",
  disable = false,
  onBlurCB = undefined,
  minlength = 0,
  maxlength = 0,
}) => {
  return this.renderInput(
    name,
    label,
    type,
    disable,
    onBlurCB,
    minlength,
    maxlength
  );
};

export const renderInputPlaceholder = (
  name,
  label,
  type = "text",
  disable = false,
  onBlurCB,
  minlength,
  maxlength
) => {
  const { data, errors } = this.state;
  let rest = {};
  if (onBlurCB) {
    rest = {
      onBlur: this.handleOnBlur,
      onBlurCB: onBlurCB,
    };
  }

  if (maxlength > 0) rest.maxlength = maxlength;
  if (minlength > 0) rest.minlength = minlength;

  return (
    <Input
      type={type}
      name={name}
      label={label}
      value={data[name]}
      disabled={disable}
      onChange={handleChange}
      error={errors[name]}
      placeholder={label}
      {...rest}
    />
  );
};

// renderDuration(name, label, disable = false) {
//   const { data, errors } = this.state;
//   let rest = {};
//   return (
//     <InputDuration
//       type={"text"}
//       name={name}
//       label={label}
//       value={[data[name[0]], data[name[1]]]}
//       onChange={handleChange}
//       error={[errors[name[0]], errors[name[1]]]}
//       disabled={disable}
//     />
//   );
// }

// renderTextarea(name, label, placeholder, type = "textarea", disable = false) {
//   const { data, errors } = this.state;
//   return (
//     <Textarea
//       type={type}
//       name={name}
//       label={label}
//       value={data[name]}
//       disabled={disable}
//       onChange={handleChange}
//       error={errors[name]}
//       placeholder={placeholder}
//     />
//   );
// }

// renderSelect(
//   name,
//   label,
//   options,
//   dataProperty,
//   displayProperty,
//   disable = false,
//   onBlurCB
// ) {
//   const { data, errors } = this.state;
//   let rest = {};
//   if (onBlurCB) {
//     rest = {
//       onBlur: this.handleOnBlur,
//       onBlurCB: onBlurCB,
//     };
//   }
//   return (
//     <Select
//       name={name}
//       value={data[name]}
//       label={label}
//       options={options}
//       onChange={handleChange}
//       error={errors[name]}
//       dataProperty={dataProperty}
//       displayProperty={displayProperty}
//       disabled={disable}
//       {...rest}
//     />
//   );
// }

// renderBirthDate(name, label, typestring, conditiondate, type = "text") {
//   const { data, errors } = this.state;
//   return (
//     <BirhtDateInput
//       type={type}
//       name={name}
//       value={data[name]}
//       label={label}
//       onChange={this.handleDateChange}
//       error={errors[name]}
//       typestring={typestring}
//       conditiondate={conditiondate}
//     />
//   );
// }

// renderPassportExpiryDate(
//   name,
//   label,
//   startdate,
//   type = "text",
//   stayIndays = 0
// ) {
//   const { data, errors } = this.state;
//   return (
//     <PassportExpiryDateInput
//       type={type === "textTransfers" ? "text" : "text"}
//       name={name}
//       value={
//         data[name] !== "" &&
//         data[name] !== "0001-01-01" &&
//         data[name] !== "0001-01-01T00:00:00"
//           ? data[name]
//           : ""
//       }
//       startdate={startdate}
//       label={label}
//       onChange={this.handleDateChange}
//       error={errors[name]}
//       istransfers={type === "textTransfers" ? "true" : "false"}
//       stayInDays={stayIndays}
//     />
//   );
// }

// // renderSingleDate1({ name, label, startdate, mindate, type = "text", disabled }) {
// //   this.renderSingleDate(name, label, startdate, mindate, type = "text", disabled);
// // }

// renderSingleDate(
//   name,
//   label,
//   startdate,
//   mindate,
//   type = "text",
//   disabled,
//   onChange,
//   maxDate
// ) {
//   const { data, errors } = this.state;
//   return (
//     <SingleDateCalendar
//       type={"text"}
//       name={name}
//       value={
//         data[name] !== "" &&
//         data[name] !== "0001-01-01" &&
//         data[name] !== "0001-01-01T00:00:00"
//           ? data[name]
//           : ""
//       }
//       startdate={startdate}
//       label={label}
//       onChange={
//         onChange ? this.handleDateChangeWithDuration : this.handleDateChange
//       }
//       error={errors[name]}
//       istransfers={type === "textTransfers" ? "true" : "false"}
//       mindate={mindate ? mindate : moment().format("YYYY-MM-DD")}
//       maxdate={maxDate}
//       disabled={disabled}
//     />
//   );
// }

// renderCurrentDate(name, label, startdate, type = "text") {
//   const { data, errors } = this.state;
//   return (
//     <PassportExpiryDateInput
//       type={type === "textTransfers" ? "text" : type}
//       name={name}
//       value={
//         data[name] !== "" &&
//         data[name] !== "0001-01-01" &&
//         data[name] !== "0001-01-01T00:00:00"
//           ? data[name]
//           : ""
//       }
//       startdate={startdate}
//       label={label}
//       onChange={this.handleDateChange}
//       error={errors[name]}
//       istransfers={type === "textTransfers" ? "true" : "false"}
//     />
//   );
// }

// renderCurrentDateWithDuration(
//   name,
//   label,
//   startdate,
//   enddate,
//   type = "text",
//   disabled
// ) {
//   const { data, errors } = this.state;
//   let minDate = "";
//   let maxDate = "";
//   if (name === "bookingToDate") {
//     minDate = data["bookingFromDate"];
//   } else if (name === "toDate") {
//     minDate = data["fromDate"];
//   } else {
//     minDate = startdate;
//   }
//   if (enddate) maxDate = enddate;
//   return this.renderSingleDate(
//     name,
//     label,
//     startdate,
//     minDate,
//     type,
//     disabled,
//     "onchange",
//     maxDate
//   );
//   // return (
//   //   <DateDurationInput
//   //     type={type === "textTransfers" ? "text" : "text"}
//   //     name={name}
//   //     value={
//   //       data[name] !== "" &&
//   //         data[name] !== "0001-01-01" &&
//   //         data[name] !== "0001-01-01T00:00:00"
//   //         ? data[name]
//   //         : ""
//   //     }
//   //     startdate={startdate}
//   //     label={label}
//   //     onChange={this.handleDateChangeWithDuration}
//   //     error={errors[name]}
//   //     istransfers={type === "textTransfers" ? "true" : "false"}
//   //     withDuration={"true"}
//   //     minDate={minDate}
//   //     maxDate={maxDate}
//   //   />
//   // );
// }

// renderPaymentDate(name, label) {
//   const { data, errors } = this.state;
//   return (
//     <PaymentDateInput
//       type={"text"}
//       name={name}
//       value={
//         data[name] !== "" &&
//         data[name] !== "0001-01-01" &&
//         data[name] !== "0001-01-01T00:00:00"
//           ? data[name]
//           : ""
//       }
//       label={label}
//       onChange={this.handleDateChange}
//       error={errors[name]}
//       istransfers={"false"}
//     />
//   );
// }

// renderDate(
//   fromName,
//   toName,
//   fromLabel,
//   toLabel,
//   singledatepicker,
//   showdropdowns,
//   type = "text",
//   minDate
// ) {
//   const { data, errors } = this.state;
//   return (
//     <DateInput
//       type={type}
//       fromName={fromName}
//       toName={toName}
//       fromdate={data[fromName]}
//       todate={data[toName]}
//       mindate={moment()}
//       maxdate={moment()}
//       showdropdowns={showdropdowns}
//       singledatepicker={singledatepicker}
//       fromLabel={fromLabel}
//       toLabel={toLabel}
//       onChange={this.handleDateChangeEvent}
//       error={errors[fromName]}
//       conditiondate={"conditiondate"}
//     />
//   );
// }

// renderContactInput(
//   name,
//   label,
//   type = "text",
//   isDefaultLoad,
//   isReadOnly = false
// ) {
//   const { data, errors } = this.state;
//   return (
//     <ContactInput
//       type={type}
//       name={name}
//       value={data[name]}
//       label={label}
//       onChange={handleChange}
//       onPhoneNumberBlur={this.onPhoneNumberBlur}
//       error={errors[name]}
//       isDefaultLoad={isDefaultLoad}
//       isReadOnly={isReadOnly}
//     />
//   );
// }

// renderTimeDuration(name, label, type = "time", disable = false) {
//   const { data, errors } = this.state;
//   return (
//     <TimeDuration
//       name={name}
//       label={label}
//       value={
//         data[name] === ""
//           ? "HH:MM"
//           : data[name].replace("h", "").replace("m", "").replace(" ", ":")
//       }
//       disabled={disable}
//       onChange={this.onTimeChange}
//       onFocus={this.onTimeFocus}
//       onBlur={this.onTimeBlur}
//       error={errors[name]}
//     />
//   );
// }

const validations = {
  required: {
    rule: () => /\S/,
    formatter(fieldName) {
      return `${fieldName} is required.`;
    },
  },
  numeric: {
    rule: () => /^\d+$/,
    formatter(fieldName) {
      return `${fieldName} should contain only numbers.`;
    },
  },
  email: {
    rule: () => /\S+@\S+\.\S+/,
    formatter(fieldName) {
      return `${fieldName} should contain only numbers.`;
    },
  },
};

const validateFormData = (data, type, options) => {
  if (typeof data === "string") data = data.trim();
  let output = false;
  switch (type) {
    case "require":
      output = data !== "" && data !== undefined;
      break;
    case "require_date":
      output = data !== "" && data !== "0001-01-01T00:00:00";
      break;
    case "require_phoneNumber":
      output = data.indexOf("-") > -1 && data.split("-")[1] !== "";
      output = output || (data.indexOf("-") > -1 && data !== "");
      break;
    case "length":
      if (options.min !== undefined && options.max !== undefined)
        output = data.length >= options.min && data.length <= options.max;
      else if (options.min) output = data.length >= options.min;
      else if (options.max) output = data.length <= options.max;
      else output = false;
      break;
    case "only-numeric":
      output = /^[+]?\d+$/g.test(data);
      break;
    case "numeric":
      output = /^[0-9.]+$/g.test(data);
      break;
    case "alpha_space":
      output = /^[a-zA-Z '\-\_]+$/g.test(data);
      break;
    case "alpha_numeric_space":
      output = /^[a-zA-Z0-9 ]+$/g.test(data);
      break;
    case "special-characters-not-allowed":
      //Below are not allowed -> need to pass in options parameter
      //Please do not break below combination
      // \-   \[   \]    \\    \/
      //options = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      //e.g. /[@$]/
      //e.g. /[!@#$%^&]/
      output = options.test(data);
      output = !output;
      break;
    case "alpha_numeric":
      output = /^[a-zA-Z0-9]+$/g.test(data);
      break;
    case "email":
      var regxEmail =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      output = regxEmail.test(data);
      break;
    case "phonenumber":
      output = data.indexOf("+") === data.lastIndexOf("+");
      output = output && data.indexOf("-") === data.lastIndexOf("-");
      output =
        output &&
        data.replace("+", "").replace("-", "").length ===
        data.replace("+", "").replace("-", "").replace(/\D/g, "").length;
      break;
    case "phonenumber_length":
      output =
        data.indexOf("-") > -1 &&
        data.split("-")[1].length >= 8 &&
        data.split("-")[1].length <= 14;
      output =
        output ||
        (data.indexOf("-") === -1 && data.length >= 8 && data.length <= 14);
      break;
    case "pastdate":
      let dateValue = moment(data);
      let conditionDate =
        options.conditionDate === undefined
          ? moment()
          : moment(options.conditionDate);
      let maxDate = conditionDate.add(options.addMonth, "months");
      output = maxDate.isBefore(dateValue);
      break;
    default:
      output = false;
      break;
  }
  return output;
};
