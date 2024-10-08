import React, { Component } from 'react'
import SVGIcon from "../../helpers/svg-icon";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import info from "../../assets/images/dashboard/info-circle.svg";

class TaxQuotationAddOffline extends Form {
  state = {
    IsGSTApplicable: Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
      && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true",
    isStateInited: false,
    data: {
      taxType: this.props.data.taxType,
      processingFees: Number(this.props.data.processingFees),
      CGSTPrice: Number(this.props.data.CGSTPrice),
      SGSTPrice: Number(this.props.data.SGSTPrice),
      IGSTPrice: Number(this.props.data.IGSTPrice),
      isInclusive: this.props.data.isInclusive,
      percentage: Number(this.props.data.percentage),
      amountWithoutGST: Number(this.props.data.amountWithoutGST),
      tax1: Number(this.props.data.tax1),
      tax2: Number(this.props.data.tax2),
      tax3: Number(this.props.data.tax3),
      tax4: Number(this.props.data.tax4),
      tax5: Number(this.props.data.tax5),
      isTax1Modified: this.props.data.isTax1Modified,
      isTax2Modified: this.props.data.isTax2Modified,
      isTax3Modified: this.props.data.isTax3Modified,
      isTax4Modified: this.props.data.isTax4Modified,
      isTax5Modified: this.props.data.isTax5Modified,
    },
    sellPricePercentage: (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand")),
    processingFeePercentage: Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
      && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true"
      ? Global.getBusinessWiseGSTPercentage(this.props.business.toLowerCase(), this.props.data.taxType)
      : 0,
    prevData: {
      processingFees: Number(this.props.data.processingFees)
    },
    errors: this.props.errors,
  }

  static getDerivedStateFromProps(props, state) {
    if (typeof props.data.markupPrice === 'undefined')
      return { ...state };
    let data = { ...state.data };
    let business = props.business.toLowerCase();
    let processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
    let sellPrice = isNaN(Number(props.data.sellPrice)) ? 0 : Number(props.data.sellPrice);
    let amountToCalculateGST = processingFees > 0
      ? processingFees
      : (Number(props.data.costPrice) + Number(props.data.markupPrice) + processingFees + Number(props.data.discountPrice)) > 0
        ? Number(props.data.costPrice) + Number(props.data.markupPrice) + processingFees - Number(props.data.discountPrice)
        : sellPrice - (Number(data.tax1) + Number(data.tax2) + Number(data.tax3) + Number(data.tax4) + Number(data.tax5));
    if (amountToCalculateGST < 0)
      amountToCalculateGST = 0;
    let amountToCalculateTax = 0;
    amountToCalculateTax = Number(props.data.costPrice) + Number(props.data.markupPrice) + Number(props.data.processingFees) - Number(props.data.discountPrice);
    let percentage = isNaN(Number(data.percentage)) ? 0 : Number(data.percentage);
    /*
    let IGSTPrice = isNaN(Number(data.IGSTPrice)) ? 0 : Number(data.IGSTPrice);
    let SGSTPrice = isNaN(Number(data.SGSTPrice)) ? 0 : Number(data.SGSTPrice);
    let CGSTPrice = isNaN(Number(data.CGSTPrice)) ? 0 : Number(data.CGSTPrice);
    */
    let taxType = data.taxType;

    if (percentage > 0) {
      if (business === "air" || business === "activity"
        || (props.business.toLowerCase() === "custom" && (
          props.data.customitemType === 'Visa' ||
          props.data.customitemType === 'Rail' ||
          props.data.customitemType === 'Forex' ||
          props.data.customitemType === 'Rent a Car'))
      ) {
        //percentage = state.processingFeePercentage;
        amountToCalculateGST = processingFees > 0 ? processingFees : 0;
      }

      if (!isNaN(Number(amountToCalculateGST)) && Number(amountToCalculateGST) <= 0) {
        data.CGSTPrice = 0;
        data.SGSTPrice = 0;
        data.IGSTPrice = 0;
        data.amountWithoutGST = 0;
      }
      else if (!isNaN(Number(amountToCalculateGST)) && taxType) {
        if (data.isInclusive) {
          data.IGSTPrice = amountToCalculateGST - (amountToCalculateGST * (100 / (100 + percentage)));
          data.IGSTPrice = Number(data.IGSTPrice.toFixed(2));
          if (taxType === "CGSTSGST") {
            data.CGSTPrice = Number((data.IGSTPrice / 2).toFixed(2));
            data.SGSTPrice = Number((data.IGSTPrice / 2).toFixed(2));
            data.IGSTPrice = 0;
          }
          else {
            data.CGSTPrice = 0;
            data.SGSTPrice = 0;
          }
        }
        else {
          data.IGSTPrice = Number((amountToCalculateGST * (percentage / 100)).toFixed(2));
          if (taxType === "CGSTSGST") {
            data.CGSTPrice = Number((data.IGSTPrice / 2).toFixed(2));
            data.SGSTPrice = Number((data.IGSTPrice / 2).toFixed(2));
            data.IGSTPrice = 0;
          }
          else {
            data.CGSTPrice = 0;
            data.SGSTPrice = 0;
          }
        }
      }
      //data.amountForGST = amountToCalculateGST;
      if (data.isInclusive) {
        data.amountWithoutGST = amountToCalculateGST - data.CGSTPrice - data.SGSTPrice - data.IGSTPrice;
        data.amountWithoutGST = Number(data.amountWithoutGST.toFixed(2));
      } else
        data.amountWithoutGST = 0;
    }
    data.tax1 = TaxQuotationAddOffline.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, data.tax1);
    data.tax2 = TaxQuotationAddOffline.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, data.tax2);
    data.tax3 = TaxQuotationAddOffline.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, data.tax3);
    data.tax4 = TaxQuotationAddOffline.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, data.tax4);
    data.tax5 = TaxQuotationAddOffline.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, data.tax5);

    // if (state.valueChanged === true)
    //   return { valueChanged: false, errors: props.errors };
    // else
    return { data, valueChanged: false, errors: props.errors };
  }
  static getCustomTaxAmount(purpose, business, amountToCalculate, isTaxModified, currentAmount) {
    if (isTaxModified) return currentAmount;
    let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
      ?.customTaxConfigurations
      ?.find(x => x.business.toLowerCase() === business.toLowerCase())
      ?.taxes;
    //Fixed Crash - Immediate Solution
    if (!customTaxConfigurations && (business === "package" || business === "transfers" || business === "custom")) {
      customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
        ?.customTaxConfigurations
        ?.find(x => x.business.toLowerCase() === 'activity'.toLowerCase())
        ?.taxes;
    }
    customTaxConfigurations = customTaxConfigurations?.filter(x => x.chargeType.toLowerCase() === "percentage");

    if (customTaxConfigurations?.find(y => y.purpose === purpose)?.chargeValue > 0) {
      return Number(((customTaxConfigurations?.find(y => y.purpose === purpose)?.chargeValue * amountToCalculate) / 100).toFixed(2));
    }
    return 0;
  }
  porcessTaxInfo = (baseAmount, data, taxPercentage) => {
    let taxType = data.taxType;
    if (!isNaN(Number(baseAmount) > 0) && Number(baseAmount) <= 0)
      return { amountWithoutGST: 0, CGST: 0, SGST: 0, IGST: 0 };

    if (!isNaN(Number(baseAmount) > 0) && taxType) {
      if (data.isInclusive) {
        data.IGST = baseAmount - (baseAmount * (100 / (100 + taxPercentage)));
        data.IGST = Number(data.IGST.toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
      else {
        data.IGST = Number((baseAmount * (taxPercentage / 100)).toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
    }
    //data.amountForGST = baseAmount;
    if (data.isInclusive) {
      data.amountWithoutGST = baseAmount - data.CGST - data.SGST - data.IGST;
      data.amountWithoutGST = Number(data.amountWithoutGST.toFixed(2));
    } else
      data.amountWithoutGST = 0;
    return data;
  }

  handleIsInclusive = () => {
    let data = this.state.data;
    data.isInclusive = !data.isInclusive;
    this.setState({ data });
    this.handleAmountFields();
  }
  handleAmountFields = (value, e) => {
    let data = { ...this.state.data };
    let business = this.props.business.toLowerCase();
    let processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
    let sellPrice = isNaN(Number(this.props.data.sellPrice)) ? 0 : Number(this.props.data.sellPrice);
    if (e && e.target.name === "processingFees" && Number(processingFees) !== Number(this.state.prevData.processingFees) && Number(value) === 0) {
      sellPrice -= Number(this.state.prevData.processingFees);
    }
    let amountToCalculateGST = processingFees > 0 ? processingFees : sellPrice;
    if (amountToCalculateGST < 0)
      amountToCalculateGST = 0;
    let amountToCalculateTax = 0;
    let percentage = isNaN(Number(data.percentage)) ? 0 : Number(data.percentage);
    if (processingFees !== this.state.prevData.processingFees) {
      percentage = processingFees <= 0 ? this.state.sellPricePercentage : this.state.processingFeePercentage;
    }
    if (e && (e.target.name === "taxType" && processingFees > 0)) {
      percentage = Global.getBusinessWiseGSTPercentage(business, value);
    }
    if (business === "air" || business === "activity"
      || (this.props.business.toLowerCase() === "custom" && (
        this.props.data.customitemType === 'Visa' ||
        this.props.data.customitemType === 'Rail' ||
        this.props.data.customitemType === 'Forex' ||
        this.props.data.customitemType === 'Rent a Car'))
    ) {
      //percentage = this.state.processingFeePercentage;
      amountToCalculateGST = processingFees > 0 ? processingFees : 0;
    }
    let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
    let calculatedIGSTPrice = tmpData.IGST;
    let calculatedCGSTPrice = tmpData.CGST;
    let calculatedSGSTPrice = tmpData.SGST;

    let IGSTPrice = isNaN(data.IGSTPrice) ? 0 : (data.IGSTPrice);
    let SGSTPrice = isNaN(data.SGSTPrice) ? 0 : (data.SGSTPrice);
    let CGSTPrice = isNaN(data.CGSTPrice) ? 0 : (data.CGSTPrice);

    /*
        let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
        
        let calculatedIGSTPrice = Number(((amountToCalculateGST * percentage) / 100).toFixed(2));
        let calculatedCGSTPrice = Number(((amountToCalculateGST * CGSTSGST) / 100).toFixed(2));
        let calculatedSGSTPrice = Number(((amountToCalculateGST * CGSTSGST) / 100).toFixed(2));
    */
    if (e && (e.target.name === "CGSTPrice" || e.target.name === "SGSTPrice" || e.target.name === "IGSTPrice")) {
      if (e.target.name === "CGSTPrice" && value !== calculatedCGSTPrice) {
        CGSTPrice = isNaN(value) ? 0 : value;
        SGSTPrice = data.SGSTPrice;
        //percentage = 0;
      }
      if (e.target.name === "SGSTPrice" && value !== calculatedSGSTPrice) {
        CGSTPrice = data.CGSTPrice;
        SGSTPrice = isNaN(value) ? 0 : value;
        //percentage = 0;
      }
      if (e.target.name === "IGSTPrice" && value !== calculatedIGSTPrice) {
        IGSTPrice = isNaN(value) ? 0 : value;
        //percentage = 0;
      }
    }
    else if (percentage > 0) {
      CGSTPrice = tmpData.CGST;
      SGSTPrice = tmpData.SGST;
      IGSTPrice = tmpData.IGST;
      data.amountWithoutGST = tmpData.amountWithoutGST;
    }

    let taxType = data.taxType;

    data.processingFees = processingFees;
    data.percentage = percentage;
    data.CGSTPrice = this.state.IsGSTApplicable === true || '' ? CGSTPrice : 0;
    data.SGSTPrice = this.state.IsGSTApplicable === true || '' ? SGSTPrice : 0;
    data.IGSTPrice = this.state.IsGSTApplicable === true || '' ? IGSTPrice : 0;
    data.tax1 = !data.isTax1Modified ? isNaN(Number(data.tax1)) ? 0 : Number(data.tax1) : (isNaN(Number(data.tax1)) ? 0 : data.tax1);
    data.tax2 = !data.isTax2Modified ? isNaN(Number(data.tax2)) ? 0 : Number(data.tax2) : (isNaN(Number(data.tax2)) ? 0 : data.tax2);
    data.tax3 = !data.isTax3Modified ? isNaN(Number(data.tax3)) ? 0 : Number(data.tax3) : (isNaN(Number(data.tax3)) ? 0 : data.tax3);
    data.tax4 = !data.isTax4Modified ? isNaN(Number(data.tax4)) ? 0 : Number(data.tax4) : (isNaN(Number(data.tax4)) ? 0 : data.tax4);
    data.tax5 = !data.isTax5Modified ? isNaN(Number(data.tax5)) ? 0 : Number(data.tax5) : (isNaN(Number(data.tax5)) ? 0 : data.tax5);
    data.taxType = taxType;
    const prevData = {
      processingFees: data.processingFees
    }
    this.setState({ data, isStateInited: true, prevData }, () => {
      this.props.handleTaxQuoationoData(data);
    });
  }

  render() {
    const { IsGSTApplicable } = this.state;
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = this.props.business.toLowerCase();
    if (business === "transfers" || business === "custom" || business === "package") business = "activity";
    let generalTaxes = [];
    if (env.customTaxConfigurations && env.customTaxConfigurations
      .find(x => x.business.toLowerCase() === business.toLowerCase())) {
      generalTaxes = env.customTaxConfigurations
        .find(x => x.business.toLowerCase() === business.toLowerCase())
        .taxes.filter(tax => tax.isShowOnUI && Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
        .map(item => { return { "name": item.name, "purpose": item.purpose } })
        .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    }
    return (
      <React.Fragment>
        {IsGSTApplicable &&
          <React.Fragment>
            <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
              {this.renderInput("processingFees", "Processing fees", "text", this.props.ViewInDisabled, this.handleAmountFields)}
            </div>
            {Number(this.state.data.processingFees) > 0 && this.state.data.amountWithoutGST > 0 &&
              <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
                <div className="form-group amountWithoutGST">
                  <label for="amountWithoutGST" style={{ fontSize: "0.8em" }}>Processing fees (Without GST)</label>
                  <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={this.state.data.amountWithoutGST} />
                </div>
              </div>
            }
            <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3 btn-group" : "col-lg-2 btn-group"}>
              {this.renderSelect("taxType", "Tax Category", taxOptions, "value", "label", this.props.ViewInDisabled, this.handleAmountFields)}
              <button className='mt-4 btn  disabled' data-toggle="tooltip" data-placement="right" title="Percentage is divided equally between CGST and SGST">
                <figure>
                  <img
                    style={{ filter: "none" }}
                    src={info}
                    alt=""
                  />
                </figure>
              </button>
            </div>
            <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : 'col-lg-2 input-group'}>
              {this.renderInput("percentage", "Percentage (%)", "text", this.props.ViewInDisabled, this.handleAmountFields)}
            </div>
            <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
              <label for=""></label>
              <div className="custom-control custom-switch mt-3 ">
                <input
                  id="isInclusive"
                  name="isInclusive"
                  type="checkbox"
                  className="custom-control-input"
                  checked={this.state.data.isInclusive}
                  onChange={this.handleIsInclusive}
                // disabled={ViewInDisabled ? true : false}
                />
                <label className="custom-control-label" htmlFor="isInclusive">
                  Inclusive GST
                </label>
              </div>
            </div>
            {this.state.data.taxType !== "IGST" &&
              <React.Fragment>
                <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
                  {this.renderInput("CGSTPrice", "CGST", "text", this.props.ViewInDisabled, this.handleAmountFields)}
                </div>
                <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
                  {this.renderInput("SGSTPrice", "SGST", "text", this.props.ViewInDisabled, this.handleAmountFields)}
                </div>
              </React.Fragment>
            }
            {this.state.data.taxType === "IGST" &&
              <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
                {this.renderInput("IGSTPrice", "IGST", "text", this.props.ViewInDisabled, this.handleAmountFields)}
              </div>
            }
          </React.Fragment>
        }
        {
          generalTaxes.length > 0 &&
          <React.Fragment>
            {generalTaxes.map((item, count) => {
              return (!this.props.paperrates || this.props.business.toLowerCase() === "package") ? <div className={this.props.paperrates && this.props.paperrates === "true" ? "col-lg-3" : "col-lg-2"}>
                {this.renderInput("tax" + ((parseInt(item.purpose) - 160) + 1), item.name, "text", this.props.ViewInDisabled, this.handleAmountFields)}
              </div> : <div></div>
            })}
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default TaxQuotationAddOffline;

const taxOptions = [
  { value: "CGSTSGST", label: "CGST/SGST" },
  { value: "IGST", label: "IGST" }

]