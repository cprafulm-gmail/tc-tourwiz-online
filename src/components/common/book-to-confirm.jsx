import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import { apiRequester } from "../../services/requester";
import Config from "../../config.json";
import PaymentMode from "../payment/payment-mode";

class BookToConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentGatewayCharges: this.props.paymentGatewayCharges,
      paymentMode: {
        paymentGatewayInputInfo: Global.getEnvironmetKeyValue(
          "paymentGatewayInputInfo"
        )
      },
      selectedPaymentMode: this.props.selectedPaymentMode,
      isLoading: true,
      isBtnLoading: false,
      CommentType: "Cash",
      Comment: "",
      isValidComment: true
    };
  }

  bookCart = () => {
    if (this.state.isBtnLoading) return;
    if (this.state.Comment === "") {
      this.setState({ isValidComment: false });
      return false;
    } else this.setState({ isValidComment: true });

    this.setState({
      isBtnLoading: true
    });

    let selectedPaymentMode = this.state.selectedPaymentMode.toLowerCase();
    let paymentMode = this.state.paymentMode.paymentGatewayInputInfo.find(
      x => x.code.toLowerCase() === selectedPaymentMode
    );

    let strURL = this.props.match.url.split("/");
    strURL[strURL.findIndex(element => element.toLowerCase() === "view")] = "view_fromConfirm";
    strURL = strURL.join("/");

    var reqURL = "api/v1/cart/book";
    var reqOBJ = {
      paymentGatewayID: paymentMode.code,
      paymentReturnUrl:
        window.location.origin + strURL,
      Request: atob(this.props.match.params.brn),
      Flags: {}
    };

    apiRequester(reqURL, reqOBJ, function (data) {
      window.location.href = Config.paymentInitUrl + data.response.data;
    });
  };

  setPaymentMode = e => {
    this.setState({
      selectedPaymentMode: e
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ Comment: input.value });
  };

  render() {
    return (
      <React.Fragment>
        <PaymentMode
          paymentGatewayCharges={this.state.paymentGatewayCharges}
          paymentMode={this.state.paymentMode}
          setPaymentMode={this.setPaymentMode}
          paymentInfo={this.props.paymentInfo}
        />
        <div className="card shadow-sm mb-3">
          <div className="card-header">
            <h5 className="m-0 p-0">{Trans("_comment")}</h5>
          </div>
          <div className="card-body position-relative">
            <ul className="list-unstyled p-0 m-0">
              <li className="row">
                <label className="col-3">{Trans("_commentType")} : </label>
                <span className="col-7">
                  <select
                    className="form-control form-control form-control-sm"
                    onChange={e => this.setState({ Comment: e.target.value })}
                    defaultValue={this.state.CommentType}
                  >
                    <option value="Cash">{Trans("_commentTypeCash")}</option>
                    <option value="Bank Transfers">
                      {Trans("_commentTypeBankTransfers")}
                    </option>
                    <option value="Cheque">
                      {Trans("_commentTypeCheque")}
                    </option>
                    <option value="Other">{Trans("_commentTypeOther")}</option>
                  </select>
                </span>
              </li>
              <li className="row mt-3">
                <label className="col-3">{Trans("_comment")} : </label>
                <span className="col-7">
                  <span className="star-rating">
                    <textarea
                      cols={60}
                      rows={3}
                      className={"form-control "}
                      onChange={this.handleChange}
                    ></textarea>
                    {!this.state.isValidComment && (
                      <small className="alert alert-danger mt-2 p-1 d-inline-block">
                        {Trans("_error_comment_valid")}
                      </small>
                    )}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <button className="btn btn-primary" onClick={this.bookCart}>
          {this.state.isBtnLoading && (
            <span className="spinner-border spinner-border-sm mr-2"></span>
          )}
          {Trans("_btnConfirmBooking")}
        </button>
      </React.Fragment>
    );
  }
}

export default BookToConfirm;
