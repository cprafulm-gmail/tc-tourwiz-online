import React, { Component } from "react";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";

class PromoCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promoCode: "",
      errors: {},
      isBtnLoading: false,
      isRemoveBtnLoading: false,
      discountAmount: "",
    };
  }

  validate = () => {
    const errors = {};
    if (this.state.promoCode === "")
      errors.promoCode = Trans("_pleaseEnterPromoCode");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  submitPromoCode = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.setState({ isBtnLoading: true });
    this.props.handlePromoCode(this.state.promoCode);
  };

  removePromoCode = () => {
    this.setState({
      isRemoveBtnLoading: true,
      isBtnLoading: false,
      promoCode: "",
    });
    this.props.removePromoCode();
  };

  setAppliedPromoCode = () => {
    const appliedPromoCode =
      this.props.cart.inputs.appliedInputs.length > 0 &&
      this.props.cart.inputs.appliedInputs.find(
        (x) => x.type === "promocode"
      ) &&
      this.props.cart.inputs.appliedInputs.find((x) => x.type === "promocode")
        .code;

    const discountAmount =
      appliedPromoCode &&
      this.props.cart.displayCharges.find(
        (x) => x.description === "Discount"
      ) &&
      this.props.cart.displayCharges.find((x) => x.description === "Discount")
        .amount;
    this.setState({
      promoCode: appliedPromoCode ? appliedPromoCode : "",
      discountAmount: discountAmount ? discountAmount : "",
    });
  };

  componentDidMount() {
    this.setAppliedPromoCode();
  }

  render() {
    const {
      promoCode,
      errors,
      isBtnLoading,
      isRemoveBtnLoading,
      discountAmount,
    } = this.state;

    const promoCodeValid = this.props.cart.inputs.appliedInputs.length > 0;
    
    const discountAmountNew =
    promoCodeValid &&
      this.props.cart.displayCharges.find(
        (x) => x.description === "Discount"
      ) &&
      this.props.cart.displayCharges.find((x) => x.description === "Discount")
        .amount;
    return (
      <div className="payment-form row">
        <div className="col-lg-9">
          <div className="input-group shadow-sm">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fa fa-gift mr-2" aria-hidden="true"></i>{Trans("_iHaveAnOfferCode")}
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder= {Trans("_enterOfferCode")}
              onChange={(e) => this.setState({ promoCode: e.target.value })}
              value={promoCode}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={this.submitPromoCode}
              >
                {isBtnLoading && this.props.isPromoBtnLoading && (
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                )}
                {Trans("_apply")}
              </button>
            </div>

            {promoCodeValid && (
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  onClick={this.removePromoCode}
                >
                  {isRemoveBtnLoading && this.props.isPromoBtnLoading && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  {Trans("_remove")}
                </button>
              </div>
            )}
          </div>
          {errors.promoCode && (
            <small className="alert alert-danger mt-2 p-1 d-inline-block">
              {errors.promoCode}
            </small>
          )}

          {(this.props.promoCodeMsg || discountAmountNew) && promoCodeValid
            ? !errors.promoCode && (
                <small className="alert alert-success mt-2 p-1 d-inline-block">
                  {Trans("_promoCodeAppliedSuccessfullyMessage1")}{" "}
                  <Amount amount={Math.abs(discountAmountNew)} /> {" "}{Trans("_promoCodeAppliedSuccessfullyMessage2")}
                </small>
              )
            : this.props.promoCodeMsg === 0 &&
              !errors.promoCode && (
                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                  {Trans("_invalidPromoCodeMessage")}
                </small>
              )}
          {promoCode && promoCodeValid && !this.props.promoCodeMsg === 0 && (
            <small className="alert alert-success mt-2 p-1 d-inline-block">
          {Trans("_promoCodeAppliedSuccessfullyMessage1")}{" "}
              <Amount amount={Math.abs(discountAmount)} /> {" "}{Trans("_promoCodeAppliedSuccessfullyMessage2")}
            </small>
          )}
        </div>
      </div>
    );
  }
}

export default PromoCode;
