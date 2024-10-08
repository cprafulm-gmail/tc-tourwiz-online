import Input from "./form-input";
import ContactInput from "./form-contact";
import Select from "./form-select";
import SingleDateCalendar from "./form-singledate-calendar";
import moment from "moment";
import TimeDuration from "./form-time-duration";
import InputDuration from "./form-duration";
import Textarea from "./form-text-area";
import DateInput from "./form-date";
import BirhtDateInput from "./form-birthdate";
import PassportExpiryDateInput from "./form-passport-expiry";
import DateDurationInput from "./form-date-duration";
import PaymentDateInput from "./form-payment-date";

function useForm(props) {
  const { schema, onSubmit, data, setData, errors, setErrors } = props;

  const handleOnBlur = (e, callback) => {
    let value = e.target.value;
    callback(value, e);
  };

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

    if (input.name === "customitemType") {
      data["otherType"] = "";
    }

    if (input.label === "bookedBy") {
      data[input.label] = input.value;
    } else {
      data[input.name] = input.value;
    }

    // const errorMessage = validateProperty(input);
    // const errors = { ...error };
    // errorMessage
    //     ? (errors[input.name] = errorMessage)
    //     : delete errors[input.name];
    // setError(errors);
    setData((prevState) => {
      return { ...prevState, [input.name]: input.value };
    });

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

  const onPhoneNumberBlur = (status, value, country, number, id, event) => {
    setData((prevState) => {
      return {
        ...prevState,
        [event.currentTarget.name]: "+" + country.dialCode + "-" + value,
      };
    });
  };

  const handleDateChangeWithDuration = ({ currentTarget: input }, picker) => {
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
      data.duration = GetDuration(data.startDate, data.endDate);
    setData((prevState) => {
      return {
        ...prevState,
        [input.firstChild.name]: picker.startDate.format("YYYY-MM-DD"),
      };
    });
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

  const handleDateChange = ({ currentTarget: input }, picker) => {
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
    setData((prevState) => {
      return {
        ...prevState,
        [input.firstChild.name]: picker.startDate.format("YYYY-MM-DD"),
      };
    });
  };

  const onTimeFocus = (event) => {
    if (event.target.value === "HH:MM") {
      setData((prevData) => {
        return { ...prevData, [event.target.name]: "00:00" };
      });
    }
  };

  const onTimeBlur = (event) => {
    if (event.target.value === "00:00") {
      setData((prevData) => {
        return { ...prevData, [event.target.name]: "HH:MM" };
      });
    }
  };

  const onTimeChange = (event, value) => {
    value = value.replace(/H/g, "0").replace(/M/g, "0");
    const newTime = value.replace(/-/g, ":");
    const time = newTime.substr(0, 5);
    const timeSeconds = newTime.substr(0, 5);
    const timeSecondsCustomColon = newTime.substr(0, 5);

    let dataChange =
      value === "00:00"
        ? "HH:MM"
        : time.split(":")[0] + "h " + time.split(":")[1] + "m";
    setData((prevData) => {
      return { ...prevData, [event.target.name]: dataChange };
    });
  };

  const handleDateChangeEvent = ({ currentTarget: input }, picker) => {
    input.parentElement.classList.forEach((c) => {
      if (c.startsWith("fromName-")) {
        setData((prevState) => {
          return {
            ...prevState,
            [c.replace("fromName-", "")]: picker.startDate.format("YYYY-MM-DD"),
          };
        });
      } else if (c.startsWith("toName-")) {
        setData((prevState) => {
          return {
            ...prevState,
            [c.replace("toName-", "")]: picker.startDate.format("YYYY-MM-DD"),
          };
        });
      }
    });
  };

  const renderButton = (label) => {
    return (
      <button
        // disabled={validation() === null ? false : true}
        className="btn btn-primary mt-4 w-100"
        type="submit"
      >
        {label}
      </button>
    );
  };

  const renderInput = ({
    name,
    label,
    type = "text",
    disable = false,
    onBlurCB,
    minlength,
    maxlength,
  }) => {
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
        value={data[name]}
        disabled={disable}
        onChange={handleChange}
        error={errors[name]}
        {...rest}
      />
    );
  };

  const renderContactInput = ({
    name,
    label,
    type = "text",
    isDefaultLoad,
    isReadOnly = false,
  }) => {
    return (
      <ContactInput
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={handleChange}
        onPhoneNumberBlur={onPhoneNumberBlur}
        error={errors[name]}
        isDefaultLoad={isDefaultLoad}
        isReadOnly={isReadOnly}
      />
    );
  };

  const renderSingleDate = ({
    name,
    label,
    startdate,
    mindate,
    type = "text",
    disabled,
    onChange,
    maxDate,
  }) => {
    return (
      <SingleDateCalendar
        type={"text"}
        name={name}
        value={
          data[name] !== "" &&
            data[name] !== "0001-01-01" &&
            data[name] !== "0001-01-01T00:00:00"
            ? data[name]
            : ""
        }
        startdate={startdate}
        label={label}
        onChange={onChange ? onChange : handleDateChange}
        error={errors[name]}
        istransfers={type === "textTransfers" ? "true" : "false"}
        mindate={mindate ? mindate : moment().format("YYYY-MM-DD")}
        maxdate={maxDate}
        disabled={disabled}
      />
    );
  };

  const renderCurrentDateWithDuration = ({
    name,
    label,
    startdate,
    enddate,
    type = "text",
    disabled
  }) => {
    let mindate = "";
    let maxdate = "";
    if (name === "bookingToDate") {
      mindate = data["bookingFromDate"];
    } else if (name === "toDate") {
      mindate = data["fromDate"];
    } else if (name === "bookBefore") {
      mindate = data["validFrom"];
    } else {
      mindate = startdate;
    }
    if (enddate) maxdate = enddate;
    return renderSingleDate({
      name,
      label,
      startdate,
      mindate,
      type,
      disabled,
      "onchange": {},
      maxdate
    });
  };

  const renderSelect = ({
    name,
    label,
    options,
    dataProperty,
    displayProperty,
    disable = false,
    onBlurCB,
  }) => {
    let rest = {};
    if (onBlurCB) {
      rest = {
        onBlur: handleOnBlur,
        onBlurCB: onBlurCB,
      };
    }

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={handleChange}
        error={errors[name]}
        dataProperty={dataProperty}
        displayProperty={displayProperty}
        disabled={disable}
        {...rest}
      />
    );
  };

  const renderTimeDuration = ({
    name,
    label,
    type = "time",
    disable = false,
  }) => {
    return (
      <TimeDuration
        name={name}
        label={label}
        value={
          data[name] === ""
            ? "HH:MM"
            : data[name].replace("h", "").replace("m", "").replace(" ", ":")
        }
        disabled={disable}
        onChange={onTimeChange}
        onFocus={onTimeFocus}
        onBlur={onTimeBlur}
        error={errors[name]}
      />
    );
  };

  const renderDuration = ({ name, label, disable = false }) => {
    let rest = {};
    return (
      <InputDuration
        type={"text"}
        name={name}
        label={label}
        value={[data[name[0]], data[name[1]]]}
        onChange={handleChange}
        error={[errors[name[0]], errors[name[1]]]}
        disabled={disable}
      />
    );
  };

  const renderTextarea = ({
    name,
    label,
    placeholder,
    type = "textarea",
    disable = false
  }) => {
    return (
      <Textarea
        type={type}
        name={name}
        label={label}
        value={data[name]}
        disabled={disable}
        onChange={handleChange}
        error={errors[name]}
        placeholder={placeholder}
      />
    );
  };

  const renderDate = ({
    fromName,
    toName,
    fromLabel,
    toLabel,
    singledatepicker,
    showdropdowns,
    type = "text",
    minDate,
  }) => {
    return (
      <DateInput
        type={type}
        fromName={fromName}
        toName={toName}
        fromdate={data[fromName]}
        todate={data[toName]}
        mindate={moment()}
        maxdate={moment()}
        showdropdowns={showdropdowns}
        singledatepicker={singledatepicker}
        fromLabel={fromLabel}
        toLabel={toLabel}
        onChange={handleDateChangeEvent}
        error={errors[fromName]}
        conditiondate={"conditiondate"}
      />
    );
  };

  const renderBirthDate = ({
    name,
    label,
    typestring,
    conditiondate,
    type = "text",
  }) => {
    return (
      <BirhtDateInput
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={handleDateChange}
        error={errors[name]}
        typestring={typestring}
        conditiondate={conditiondate}
      />
    );
  };

  const renderPassportExpiryDate = ({
    name,
    label,
    startdate,
    type = "text",
    stayIndays = 0,
  }) => {
    return (
      <PassportExpiryDateInput
        type={type === "textTransfers" ? "text" : "text"}
        name={name}
        value={
          data[name] !== "" &&
            data[name] !== "0001-01-01" &&
            data[name] !== "0001-01-01T00:00:00"
            ? data[name]
            : ""
        }
        startdate={startdate}
        label={label}
        onChange={handleDateChange}
        error={errors[name]}
        istransfers={type === "textTransfers" ? "true" : "false"}
        stayInDays={stayIndays}
      />
    );
  };

  const renderPaymentDate = (name, label) => {
    return (
      <PaymentDateInput
        type={"text"}
        name={name}
        value={
          data[name] !== "" &&
            data[name] !== "0001-01-01" &&
            data[name] !== "0001-01-01T00:00:00"
            ? data[name]
            : ""
        }
        label={label}
        onChange={handleDateChange}
        error={errors[name]}
        istransfers={"false"}
      />
    );
  };

  return {
    validateFormData,
    renderButton,
    renderInput,
    renderContactInput,
    renderSingleDate,
    renderCurrentDateWithDuration,
    renderSelect,
    renderTimeDuration,
    renderDuration,
    renderTextarea,
    renderDate,
    renderBirthDate,
    renderPassportExpiryDate,
    renderPaymentDate,
  };
}

export default useForm;
