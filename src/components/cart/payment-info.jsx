import React from "react";
import Form from "../common/form";
import * as DropdownList from "../../helpers/dropdown-list";
import * as Global from "../../helpers/global";
import { Trans } from "../../helpers/translate";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SVGIcon from "../../helpers/svg-icon";
import Amount from "../../helpers/amount";
import moment from "moment";

class PaymentInfo extends Form {
  state = {
    isFollowupDate: false,
    data: {
      isPayment: false,
      type: "",
      paymentAmount: this.props.cartItem.displayCharges.find(x => x.description === "Total").amount,
      paymentAmountEdit: Number(this.props.cartItem.displayCharges.find(x => x.description === "Total").amount.toFixed(2)),
      paymentAmountError: "",
      paymentMode: "Cash",
      paymentdate: moment().format(Global.DateFormate),
      paymentfollowupdate: moment().format(Global.DateFormate),
      transactionNumber: "",
      bankName: "",
      branchName: "",
      chequeNumber: "",
      chequeDate: moment().format(Global.DateFormate),
      CardLastFourDigit: "",
      comment: "",
      cartItem: this.props.cartItem.items.map(item => {
        return {
          "cartItemID": item.cartItemID,
          "business": item.data.business,
          "name": item.data.business !== "air" ? item.data.name : (item.data.tripType === "multicity"
            ? item.data.items.reduce((sum, item) => sum + (sum === "" ? "" : ", ") + item.locationInfo.fromLocation.id + " - " + item.locationInfo.toLocation.id, "") :
            item.data.tripType === "roundtrip"
              ? item.data.items[0].locationInfo.fromLocation.id + " - " +
              item.data.items[0].locationInfo.toLocation.id + " - " +
              item.data.items[0].locationInfo.fromLocation.id
              : item.data.items[0].locationInfo.fromLocation.id + " - " +
              item.data.items[0].locationInfo.toLocation.id),
          "currencyCode": item.fareBreakup[item.fareBreakup.length - 1].item[0].currencyCode,
          "bookingAmountEdit": item.fareBreakup[item.fareBreakup.length - 1].item[0].totalAmount,
          "bookingAmount": item.fareBreakup[item.fareBreakup.length - 1].item[0].totalAmount,
          "error": ""
        }
      })
    },
    errors: {}
  };

  businessBadgeClass = (business) => {
    return business === "hotel"
      ? "hotel"
      : business === "activity"
        ? "activity"
        : business === "package"
          ? "package"
          : business === "air"
            ? "plane"
            : business === "transportation"
              ? "transportation"
              : business === "transfers"
                ? "transfers"
                : business === "vehicle"
                  ? "vehicle"
                  : business === "groundservice"
                    ? "groundservice"
                    : "";
  };

  handleSubmit = () => {
    if (Number(this.state.data.cartItem.reduce((sum, item) => sum + item.bookingAmountEdit, 0).toFixed(2)) != this.state.data.paymentAmountEdit) {
      let data = this.state.data;
      data.paymentAmountError = "Total Payment Amount should be match with Total itinerary Payment Amount";
      this.setState({ data });
      return;
    }
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    var data = { ...this.state.data };
    if (data.paymentAmountEdit == Number(data.cartItem.reduce((a, b) => a + b.bookingAmount, 0).toFixed(2)))
      data.type = "full"
    this.props.handleSubmit({ count: this.props.count, data: data });
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (data.isPayment) {
      if (data.paymentMode === "Cash" || data.paymentMode === "Online") {
        if (!this.validateFormData(data.transactionNumber, "require"))
          errors.transactionNumber = "Transaction Number required."
        else if (!this.validateFormData(data.transactionNumber, "special-characters-not-allowed", /[<>'"]/))
          errors.transactionNumber = "<,>,' and \" characters not allowed";
      }

      if (data.paymentMode === "CreditCard" || data.paymentMode === "DebitCard") {
        if (!this.validateFormData(data.bankName, "require"))
          errors.bankName = "Bank Name required.";
        else if (data.bankName && !this.validateFormData(data.bankName, "special-characters-not-allowed", /[<>]/))
          errors.bankName = "< and > characters not allowed";
        if (!this.validateFormData(data.CardLastFourDigit, "require"))
          errors.CardLastFourDigit = "Card Number required";
        if (!this.validateFormData(data.CardLastFourDigit, "numeric"))
          errors.CardLastFourDigit = "Card Number should be numeric only.";
      }

      if (data.paymentMode === "Cheque") {
        if (!this.validateFormData(data.bankName, "require"))
          errors.bankName = "Bank Name required.";
        else if (data.bankName && !this.validateFormData(data.bankName, "special-characters-not-allowed", /[<>]/))
          errors.bankName = "< and > characters not allowed";

        if (!this.validateFormData(data.branchName, "require"))
          errors.branchName = "Branch Name required.";
        if (data.branchName && !this.validateFormData(data.branchName, "special-characters-not-allowed", /[<>]/))
          errors.branchName = "< and > characters not allowed";

        if (!this.validateFormData(data.chequeNumber, "require"))
          errors.chequeNumber = "Cheque Number required.";
        else if (!this.validateFormData(data.chequeNumber, "only-numeric"))
          errors.chequeNumber = "Enter valid Cheque Number.";
      }

      if (!this.validateFormData(data.comment, "require"))
        errors.comment = "Comment required.";
      else if (data.comment && !this.validateFormData(data.comment, "special-characters-not-allowed", /[<>'"]/))
        errors.comment = "<,>,' and \" characters not allowed";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  changePayment = (e) => {
    const { data } = this.state;
    data.isPayment = !e.target.checked;
    data.type = "";
    data.paymentAmountError = "";
    this.setState({ data });
  }

  changePaymentAmount = (e) => {
    let paymentAmount = parseInt(e.target.value);//this.state.paymentAmount;
    const { data } = this.state;

    if (isNaN(parseInt(e.target.value)))
      paymentAmount = 0;

    data.paymentAmountEdit = paymentAmount;
    if (data.paymentAmountEdit > data.paymentAmount) {
      data.paymentAmountError = "Total Payment amount must be less then or equal total booking amount.";
      this.setState({ paymentAmountEdit: paymentAmount, data });
      return;
    }
    else if (data.paymentAmountEdit === 0) {
      data.paymentAmountError = "Payment amount should not 0.";
      this.setState({ paymentAmountEdit: paymentAmount, data });
      return;
    }
    else
      data.paymentAmountError = "";
    let isFollowupDate = data.paymentAmount !== paymentAmount;
    data.cartItem.map((item, index) => {
      if (paymentAmount > item.bookingAmount)
        data.cartItem[index].bookingAmountEdit = item.bookingAmount;
      else
        data.cartItem[index].bookingAmountEdit = paymentAmount;
      paymentAmount = paymentAmount - data.cartItem[index].bookingAmountEdit;
    });
    this.setState({ paymentAmountEdit: paymentAmount, data, isFollowupDate })
  }

  handleItemAmout = (e) => {
    const { data } = this.state;
    let cartItem = data.cartItem
    if (isNaN(parseInt(e.target.value))) {
      cartItem.find(x => x.cartItemID === e.target.id).bookingAmountEdit = 0;
      return;
    }
    else {
      cartItem.find(x => x.cartItemID === e.target.id).bookingAmountEdit = parseInt(e.target.value);
      if (cartItem.find(x => x.cartItemID === e.target.id).bookingAmountEdit > cartItem.find(x => x.cartItemID === e.target.id).bookingAmount) {
        cartItem.find(x => x.cartItemID === e.target.id).error = "Itinerary payment amount less then or equal total booking amount.";
      }
      else
        cartItem.find(x => x.cartItemID === e.target.id).error = "";
    }

    data.cartItem = cartItem;
    this.setState({ data });
  }

  changePaymentType = (type) => {
    const { data } = this.state;
    let paymentAmount = this.state.data.paymentAmount;
    this.state.data.paymentAmountEdit = this.state.data.paymentAmount;
    if (type.toLowerCase() !== "partial")
      delete data.paymentfollowupdate;
    data.cartItem.map((item, index) => {
      if (paymentAmount > item.bookingAmount)
        data.cartItem[index].bookingAmountEdit = item.bookingAmount;
      else
        data.cartItem[index].bookingAmountEdit = paymentAmount;
      paymentAmount = paymentAmount - data.cartItem[index].bookingAmountEdit;
    });
    data.type = type;
    data.isPayment = true;
    data.paymentAmountError = "";
    this.setState({ data });
  }

  changePaymentMode = (type) => {
    const { data } = this.state;
    data.paymentMode = type;
    this.setState({ data });
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const mode = [
      { name: "Cash", value: "Cash" },
      { name: "Cheque", value: "Cheque" },
      { name: "Online", value: "Online" }
    ];
    if (this.state.data.cartItem.reduce((sum, item) => sum + item.bookingAmountEdit, 0) === 0) {
      return <React.Fragment></React.Fragment>
    }
    return (
      <div className="contact-details border p-3 bg-white box-shadow mt-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon
            name="envelope"
            width="20"
            height="20"
            className="mr-2"
          ></SVGIcon>
          Payment Information
        </h5>


        <div className="row">
          <div className="col-lg-12">
            <div className="row form-group ml-0">

              <div className="col-sm-3 custom-control custom-switch">
                <input
                  type="checkbox"
                  checked={this.state.data.type === "full" ? true : false}
                  className="custom-control-input"
                  id="customSwitch1"
                  onChange={(e) => this.changePaymentType("full")}
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  Full Payment
                </label>
              </div>
              <div className="col-sm-3 custom-control custom-switch">
                <input
                  type="checkbox"
                  checked={this.state.data.type === "partial" ? true : false}
                  className="custom-control-input"
                  id="customSwitch2"
                  onChange={(e) => this.changePaymentType("partial")}
                />
                <label className="custom-control-label" htmlFor="customSwitch2">
                  Partial Payment
                </label>
              </div>
              <div className="col-lg-3 custom-control custom-switch form-group">
                <input
                  type="checkbox"
                  checked={!this.state.data.isPayment}
                  className="custom-control-input"
                  id="isPayment"
                  onChange={(e) => this.changePayment(e)}
                />
                <label className="custom-control-label" for="isPayment" >No Payment</label>
              </div>
            </div>
          </div>
        </div>

        {this.state.data.isPayment &&
          <React.Fragment>

            <div className="row mb-3">
              <div className="col-lg-3 input-group">
                <label>Total Payment Amount</label>
              </div>
              <div className="col-lg-3 input-group">
                <div className="input-group-prepend">
                  <div className="input-group-text">{Global.getEnvironmetKeyValue("portalCurrencySymbol")}</div>
                </div>
                <input
                  readOnly={this.state.data.type === "full" ? true : false}
                  className={"form-control"}
                  onChange={e => this.changePaymentAmount(e)}
                  value={this.state.data.paymentAmountEdit}
                />
                {this.state.data.paymentAmountError && (
                  <small className="alert alert-danger mt-2 p-1 d-inline-block">
                    {this.state.data.paymentAmountError}
                  </small>
                )}
              </div>
            </div>
            <div className="row m-0 mb-3">
              <label className="col-lg-6 font-weight-bold p-0">Itinerary Details</label>
              <label className="col-lg-2 font-weight-bold"></label>
              <label className="col-lg-3 font-weight-bold">Itinerary Payment Amount</label>
            </div>
            {this.state.data.cartItem.map(item => {
              return <div className="row">
                <div className="col-lg-6">
                  <div className="row">
                    <label for="paymentAmount" className="col-lg-12">
                      <SVGIcon
                        name={this.businessBadgeClass(item.business)}
                        width="15"
                        height="15"
                        type="fill"
                      ></SVGIcon>{" "} {Trans("_widgetTab" + item.business)} - {item.name}</label>
                  </div>
                </div>
                <div className="col-lg-2 form-group">
                  <label for="paymentAmount" className="col-lg-12"><Amount currencyCode={item.currencyCode} amount={item.bookingAmount} /></label>
                </div>
                <div className="col-lg-3 input-group form-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">{Global.getEnvironmetKeyValue("portalCurrencySymbol")}</div>
                  </div>
                  <input
                    readOnly={item.bookingAmount === 0 || this.state.data.type === "full" ? true : false}
                    id={item.cartItemID}
                    name={item.cartItemID}
                    className={"form-control"}
                    onChange={e => this.handleItemAmout(e)}
                    value={item.bookingAmountEdit}
                  />
                  {item.error && (
                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                      {item.error}
                    </small>
                  )}

                </div>
              </div>
            })}
            <div className="row">
              <div className="col-lg-4">
                <div className="row"></div>
              </div>
              <div className="col-lg-4 form-group">
                <label for="paymentAmount" className="col-lg-12">Total Itinerary Payment Amount</label>
              </div>
              <div className="col-lg-3 input-group form-group">
                <div className="input-group-prepend">
                  <div className="input-group-text">{Global.getEnvironmetKeyValue("portalCurrencySymbol")}</div>
                </div>
                <input
                  readOnly={true}
                  className={"form-control"}
                  value={Number(this.state.data.cartItem.reduce((sum, item) => sum + item.bookingAmountEdit, 0).toFixed(2))}
                />
                {Number(this.state.data.cartItem.reduce((sum, item) => sum + item.bookingAmountEdit, 0).toFixed(2)) > this.state.data.paymentAmountEdit && (
                  <small className="alert alert-danger mt-2 p-1 d-inline-block">
                    Total itinerary Payment Amount should be less then or equal to Total Payment Amount
                  </small>
                )}
              </div>
            </div>
            <div className="row m-0 mb-3">
              <label className="col-lg-6 font-weight-bold p-0">Payment Details</label>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="row form-group ml-0">
                  <div className="col-sm-2 custom-control custom-switch">
                    <input
                      type="checkbox"
                      checked={this.state.data.paymentMode === "Cash" ? true : false}
                      className="custom-control-input"
                      id="paymentMode1"
                      onChange={(e) => this.changePaymentMode("Cash")}
                    />
                    <label className="custom-control-label" htmlFor="paymentMode1">
                      Cash
                    </label>
                  </div>
                  <div className="col-sm-2 custom-control custom-switch">
                    <input
                      type="checkbox"
                      checked={this.state.data.paymentMode === "Cheque" ? true : false}
                      className="custom-control-input"
                      id="paymentMode2"
                      onChange={(e) => this.changePaymentMode("Cheque")}
                    />
                    <label className="custom-control-label" htmlFor="paymentMode2">
                      Cheque
                    </label>
                  </div>
                  <div className="col-sm-2 custom-control custom-switch">
                    <input
                      type="checkbox"
                      checked={this.state.data.paymentMode === "Online" ? true : false}
                      className="custom-control-input"
                      id="paymentMode3"
                      onChange={(e) => this.changePaymentMode("Online")}
                    />
                    <label className="custom-control-label" htmlFor="paymentMode3">
                      Online
                    </label>
                  </div>
                  <div className="col-sm-2 custom-control custom-switch">
                    <input
                      type="checkbox"
                      checked={this.state.data.paymentMode === "CreditCard" ? true : false}
                      className="custom-control-input"
                      id="paymentMode4"
                      onChange={(e) => this.changePaymentMode("CreditCard")}
                    />
                    <label className="custom-control-label" htmlFor="paymentMode4">
                      Credit Card
                    </label>
                  </div>
                  <div className="col-sm-2 custom-control custom-switch">
                    <input
                      type="checkbox"
                      checked={this.state.data.paymentMode === "DebitCard" ? true : false}
                      className="custom-control-input"
                      id="paymentMode5"
                      onChange={(e) => this.changePaymentMode("DebitCard")}
                    />
                    <label className="custom-control-label" htmlFor="paymentMode5">
                      Debit Card
                    </label>
                  </div>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 m-0">
                {this.renderCurrentDateWithDuration("paymentdate", "Payment Date", moment().add(-1, 'months'), moment())}
              </div>
              {(this.state.isFollowupDate && this.state.data.type.toLowerCase() === "partial") &&
                <div className="col-lg-3 m-0">
                  {this.renderPassportExpiryDate("paymentfollowupdate", "Payment Followup Date", this.state.data.paymentfollowupdate)}
                </div>}
            </div>
            {(this.state.data.paymentMode === "Cash" || this.state.data.paymentMode === "Online") &&
              <div className="row m-0">
                {this.renderInput("transactionNumber", "Reference Number")}
              </div>
            }
            {(this.state.data.paymentMode === "CreditCard" || this.state.data.paymentMode === "DebitCard") &&
              <div className="row">
                <div className="col-lg-3 m-0">
                  {this.renderInput("bankName", "Bank Name")}
                </div>
                <div className="col-lg-4 m-0">
                  {this.renderInput("CardLastFourDigit",
                    "Card Number (Last 4 Digits)",
                    "text",
                    false,
                    "",
                    4,
                    4)}
                </div>
              </div>
            }
            {this.state.data.paymentMode === "Cheque" &&
              <div className="row">
                <div className="col-lg-3 m-0">
                  {this.renderInput("bankName", "Bank Name")}
                </div>
                <div className="col-lg-3 m-0">
                  {this.renderInput("branchName", "Branch Name")}
                </div>
                <div className="col-lg-3 m-0">
                  {this.renderInput("chequeNumber", "Cheque Number")}
                </div>
                <div className="col-lg-3 m-0">
                  {this.renderCurrentDateWithDuration("chequeDate", "Cheque Date", moment().add(-3, 'months'), moment())}
                </div>
              </div>
            }
            <div className="row m-0">
              {this.renderTextarea("comment", "Comment")}
            </div>
          </React.Fragment>}
      </div>
    );
  }
}

export default PaymentInfo;
