import React, { Component } from "react";
import Form from "../common/form";
import * as Global from "../../helpers/global";
import TaxQuotationAddOffline from "./tax-quotation-add-offline";

class QuotationPackagePricing extends Form {
  state = {
    errors: {},
    data: this.props.data,
  };
  handleTaxQuoationoData = (taxdata) => {
    let data = this.state.data;
    data.CGSTPrice = taxdata.CGSTPrice;
    data.IGSTPrice = taxdata.IGSTPrice;
    data.SGSTPrice = taxdata.SGSTPrice;
    data.amountWithoutGST = taxdata.amountWithoutGST;
    data.isInclusive = taxdata.isInclusive;
    data.percentage = taxdata.percentage;
    data.processingFees = taxdata.processingFees;
    data.tax1 = taxdata.tax1;
    data.tax2 = taxdata.tax2;
    data.tax3 = taxdata.tax3;
    data.tax4 = taxdata.tax4;
    data.tax5 = taxdata.tax5;
    data.taxType = taxdata.taxType;
    data.isTax1Modified = taxdata.isTax1Modified;
    data.isTax2Modified = taxdata.isTax2Modified;
    data.isTax3Modified = taxdata.isTax3Modified;
    data.isTax4Modified = taxdata.isTax4Modified;
    data.isTax5Modified = taxdata.isTax5Modified;
    this.setState({ data }, () => this.handleAmountFields(0, { target: { name: "", value: "" } }));
  }
  handleAmountFields = (value, e) => {

    let business = "package";
    let data = this.state.data;
    if (isNaN(value)) {
      value = 0;
      if (e?.target?.name)
        data[e.target.name] = 0;
    }
    let costPrice = 0;
    let tmpSellPrice = Number(data.sellPrice);
    let taxType = data.taxType ?? "CGSTSGST";
    let conversionRate = isNaN(Number(data.conversionRate)) ? 1 : data.conversionRate === "" ? 1 : Number(data.conversionRate);
    let supplierTaxPrice = isNaN(Number(data.supplierTaxPrice)) ? 0 : Number(data.supplierTaxPrice);
    let supplierCostPrice = isNaN(Number(data.supplierCostPrice)) ? 0 : Number(data.supplierCostPrice);

    costPrice = (supplierCostPrice + supplierTaxPrice) * conversionRate;
    /*
    if (e.target.name === "conversionRate" || e.target.name === "supplierTaxPrice" || e.target.name === "supplierCostPrice") {
      costPrice = (supplierCostPrice + supplierTaxPrice) * conversionRate;
      //data.costPrice = costPrice;
    }
    */
    if (e && e.target.name !== "sellPrice" && supplierTaxPrice === 0 && supplierCostPrice === 0) {
      //data.costPrice = 0;
      costPrice = 0;
    }

    let markupPrice = isNaN(Number(data.markupPrice)) ? 0 : Number(data.markupPrice);
    let discountPrice = isNaN(Number(data.discountPrice)) ? 0 : Number(data.discountPrice);
    let CGSTPrice = isNaN(Number(data.CGSTPrice)) ? 0 : Number(data.CGSTPrice);
    let SGSTPrice = isNaN(Number(data.SGSTPrice)) ? 0 : Number(data.SGSTPrice);
    let IGSTPrice = isNaN(Number(data.IGSTPrice)) ? 0 : Number(data.IGSTPrice);
    if (taxType === "IGST") {
      CGSTPrice = 0;
      SGSTPrice = 0;
    }
    else if (taxType === "CGSTSGST") {
      IGSTPrice = 0;
    }

    let tax1 = isNaN(Number(data.tax1)) ? 0 : Number(data.tax1);
    let tax2 = isNaN(Number(data.tax2)) ? 0 : Number(data.tax2);
    let tax3 = isNaN(Number(data.tax3)) ? 0 : Number(data.tax3);
    let tax4 = isNaN(Number(data.tax4)) ? 0 : Number(data.tax4);
    let tax5 = isNaN(Number(data.tax5)) ? 0 : Number(data.tax5);

    let totalAmount = isNaN(Number(data.totalAmount)) ? 0 : Number(data.totalAmount);

    let processingFees = isNaN(Number(data.processingFees)) ? 0 : Number(data.processingFees);
    let percentage = isNaN(Number(data.percentage))
      ? (Global.getEnvironmetKeyValue("GSTPercentageOnSellPrice", "cobrand"))
      : Number(data.percentage);

    let sellPrice = isNaN(Number(costPrice)) ? 0 : Number(costPrice) + Number(markupPrice);;
    sellPrice = sellPrice - discountPrice;
    sellPrice = sellPrice + processingFees;
    if (processingFees > 0 && !data.isInclusive) {
      sellPrice += (CGSTPrice + SGSTPrice + IGSTPrice);
    }
    sellPrice = Number(sellPrice.toFixed(2));

    data.isSellPriceReadonly = (
      data.conversionRate || data.supplierCostPrice || data.supplierTaxPrice || data.markupPrice
      || data.discountPrice || data.processingFees
    ) ? true : false;
    if (!data.isSellPriceReadonly) {
      sellPrice = tmpSellPrice;
      costPrice = tmpSellPrice;
    }

    let amountToCalculateGST = 0;
    let amountToCalculateTax = 0;
    amountToCalculateTax = costPrice + markupPrice + processingFees - discountPrice;
    if (business === 'package' || business === 'hotel' || business === 'transfers') {
      amountToCalculateGST = processingFees > 0 ? processingFees : data.isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice);
    }
    else if (business === 'custom') {
      data.customitemType === 'Visa' ||
        data.customitemType === 'Rail' ||
        data.customitemType === 'Forex' ||
        data.customitemType === 'Rent a Car' ? amountToCalculateGST = processingFees
        : amountToCalculateGST = Number(data.isSellPriceReadonly ? costPrice + markupPrice + processingFees - discountPrice : Number(sellPrice));
    }
    else {
      amountToCalculateGST = processingFees;
    }

    if (e && e.target.name === "sellPrice" || !data.isSellPriceReadonly) {
      costPrice = sellPrice;
      amountToCalculateTax = sellPrice;
      if (percentage > 0) {
        let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
        CGSTPrice = tmpData.CGST;
        SGSTPrice = tmpData.SGST;
        IGSTPrice = tmpData.IGST;
        //data.amountWithoutGST = tmpData.amountWithoutGST;
        /* 
        let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
        let IGSTPrice = (amountToCalculateGST * percentage) / 100;  //  calculate price for IGST
        let CGSTSGSTPrice = (amountToCalculateGST * CGSTSGST) / 100; // calculate price for CGST & SGST
        if (taxType !== "IGST") {
          IGSTPrice = 0;
          CGSTPrice = CGSTSGSTPrice;
          SGSTPrice = CGSTSGSTPrice;
        } */
      }

      tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
      tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
      tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
      tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
      tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);

      if (!data.isInclusive)
        totalAmount = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
      else
        totalAmount = Number(sellPrice);

      totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
    }
    else {
      if (processingFees === 0) {
        if (percentage > 0) {
          let percentage = isNaN(Number(data.percentage)) ? 0 : Number(data.percentage);
          let tmpData = this.porcessTaxInfo(amountToCalculateGST, data, percentage);
          CGSTPrice = tmpData.CGST;
          SGSTPrice = tmpData.SGST;
          IGSTPrice = tmpData.IGST;
          //data.amountWithoutGST = tmpData.amountWithoutGST;
          /* let CGSTSGST = percentage / 2; //divided percentage for CGST & SGST
          let IGSTPrice = (amountToCalculateGST * percentage) / 100;  //  calculate price for IGST
          let CGSTSGSTPrice = (amountToCalculateGST * CGSTSGST) / 100; // calculate price for CGST & SGST
          if (taxType !== "IGST") {
            IGSTPrice = 0;
            CGSTPrice = CGSTSGSTPrice;
            SGSTPrice = CGSTSGSTPrice;
          } */
        }
        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);

        totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
        if (!data.isInclusive)
          totalAmount = Number(Number(Number(sellPrice) + CGSTPrice + SGSTPrice + IGSTPrice).toFixed(2));
        else
          totalAmount = 0;
        totalAmount += Number(Number(tax1 + tax2 + tax3 + tax4 + tax5).toFixed(2));
      }
      else {
        tax1 = this.getCustomTaxAmount('160', business, amountToCalculateTax, data.isTax1Modified, tax1);
        tax2 = this.getCustomTaxAmount('161', business, amountToCalculateTax, data.isTax2Modified, tax2);
        tax3 = this.getCustomTaxAmount('162', business, amountToCalculateTax, data.isTax3Modified, tax3);
        tax4 = this.getCustomTaxAmount('163', business, amountToCalculateTax, data.isTax4Modified, tax4);
        tax5 = this.getCustomTaxAmount('164', business, amountToCalculateTax, data.isTax5Modified, tax5);
        totalAmount = Number(Number(Number(sellPrice) + Number(tax1 + tax2 + tax3 + tax4 + tax5)).toFixed(2));
      }
    }

    //data.conversionRate = conversionRate;
    //data.supplierTaxPrice = supplierTaxPrice;
    //data.supplierCostPrice = supplierCostPrice;
    data.costPrice = costPrice;
    data.markupPrice = markupPrice;
    data.discountPrice = discountPrice;
    data.taxType = taxType;
    data.percentage = percentage;
    data.CGSTPrice = CGSTPrice;
    data.SGSTPrice = SGSTPrice;
    data.IGSTPrice = IGSTPrice;
    data.tax1 = tax1;
    data.tax2 = tax2;
    data.tax3 = tax3;
    data.tax4 = tax4;
    data.tax5 = tax5;
    data.totalAmount = Number(totalAmount.toFixed(2));
    data.processingFees = processingFees;
    data.sellPrice = sellPrice;
    this.setState({ data });
  }

  getCustomTaxAmount = (purpose, business, amountToCalculate, isTaxModified, currentAmount) => {
    if (isTaxModified) return currentAmount;
    let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
      .customTaxConfigurations
      .find(x => x.business.toLowerCase() === business.toLowerCase())
      ?.taxes;
    //Fixed Crash - Immediate Solution
    if (!customTaxConfigurations && (business === "package" || business === "transfers" || business === "custom")) {
      customTaxConfigurations = (JSON.parse(localStorage.getItem("environment")))
        .customTaxConfigurations
        .find(x => x.business.toLowerCase() === 'activity'.toLowerCase())
        ?.taxes;
    }
    customTaxConfigurations = customTaxConfigurations.filter(x => x.chargeType.toLowerCase() === "percentage");
    if (customTaxConfigurations.find(y => y.purpose === purpose)?.chargeValue > 0) {
      return Number(((customTaxConfigurations.find(y => y.purpose === purpose).chargeValue * amountToCalculate) / 100).toFixed(2));
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
  validateAndSave = () => {
    let { data, errors } = this.state;
    errors = this.validate();
    if (errors === null)
      errors = {};
    if (data.isSellPriceReadonly && (isNaN(Number(data.costPrice)) || !isNaN(Number(data.costPrice)) && Number(data.costPrice) === 0)) {
      errors.costPrice = "Cost Price should not be 0";
    }
    else if (!isNaN(Number(data.costPrice)) && Number(data.costPrice) < 0) {
      errors.costPrice = "Cost Price should not be less than 0";
    }
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (!isNaN(Number(data.sellPrice)) && Number(data.sellPrice) < 0) {
      errors.sellPrice = "Sell Price should not be less than 0";
    }
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }

    if (data.sellPrice && data.sellPrice !== "" && !this.validateFormData(data.sellPrice, "numeric")) errors.sellPrice = "Please enter sell price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }
    if (data.conversionRate && data.conversionRate !== "" && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in numeric only";
    else if (errors) {
      delete Object.assign(errors)["conversionRate"];
    }
    if (data.supplierCostPrice && data.supplierCostPrice !== "" && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && data.supplierTaxPrice !== "" && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.costPrice && data.costPrice !== "" && !this.validateFormData(data.costPrice, "numeric")) errors.costPrice = "Please enter agent cost price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (data.markupPrice && data.markupPrice !== "" && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.discountPrice && data.discountPrice !== "" && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["discountPrice"];
    }
    if (data.processingFees && data.processingFees !== "" && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter Processing Fees price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.percentage && data.percentage !== "" && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter Percentage in numeric only";
    else if (errors) {
      delete Object.assign(errors)["percentage"];
    }
    if (data.CGSTPrice && data.CGSTPrice !== "" && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && data.SGSTPrice !== "" && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && data.IGSTPrice !== "" && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.tax1 && data.tax1 !== "" && !this.validateFormData(data.tax1, "numeric")) errors.tax1 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax1"];
    }
    if (data.tax2 && data.tax2 !== "" && !this.validateFormData(data.tax2, "numeric")) errors.tax2 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax2"];
    }
    if (data.tax3 && data.tax3 !== "" && !this.validateFormData(data.tax3, "numeric")) errors.tax3 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax3"];
    }
    if (data.tax4 && data.tax4 !== "" && !this.validateFormData(data.tax4, "numeric")) errors.tax4 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax4"];
    }
    if (data.tax5 && data.tax5 !== "" && !this.validateFormData(data.tax5, "numeric")) errors.tax5 = "Please enter tax price in numeric only";
    else if (errors) {
      delete Object.assign(errors)["tax5"];
    }

    if (errors && Object.keys(errors).length > 0) {
      this.setState({
        errors
      });
      return;
    }
    if (Object.keys(errors).length === 0) {
      errors = {};
      this.setState({
        errors
      });
      this.props.handlePackageAmount(this.state.data);
    }
  }

  validate = () => {
    const { errors, data } = this.state;
    if (!this.validateFormData(data.costPrice, "require")) errors.costPrice = "Cost Price required";
    else if (errors) {
      delete Object.assign(errors)["costPrice"];
    }
    if (!this.validateFormData(data.sellPrice, "require")) errors.sellPrice = "Sell Price required";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }
    if (data.sellPrice && !this.validateFormData(data.sellPrice, "numeric")) errors.sellPrice = "Please enter sell price in decimal only";
    else if (errors) {
      delete Object.assign(errors)["sellPrice"];
    }
    if (data.conversionRate && !this.validateFormData(data.conversionRate, "numeric")) errors.conversionRate = "Please enter conversion rate in decimal only";
    else if (errors) {
      delete Object.assign(errors)["conversionRate"];
    }
    if (data.supplierCostPrice && !this.validateFormData(data.supplierCostPrice, "numeric")) errors.supplierCostPrice = "Please enter supplier cost price in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierCostPrice"];
    }
    if (data.supplierTaxPrice && !this.validateFormData(data.supplierTaxPrice, "numeric")) errors.supplierTaxPrice = "Please enter supplier tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["supplierTaxPrice"];
    }
    if (data.markupPrice && !this.validateFormData(data.markupPrice, "numeric")) errors.markupPrice = "Please enter agent markup in decimal only";
    else if (errors) {
      delete Object.assign(errors)["markupPrice"];
    }
    if (data.discountPrice && !this.validateFormData(data.discountPrice, "numeric")) errors.discountPrice = "Please enter discount in decimal only";
    else if (errors) {
      delete Object.assign(errors)["discountPrice"];
    }
    if (data.processingFees && !this.validateFormData(data.processingFees, "numeric")) errors.processingFees = "Please enter Processing Fees in decimal only";
    else if (errors) {
      delete Object.assign(errors)["processingFees"];
    }
    if (data.percentage && !this.validateFormData(data.percentage, "numeric")) errors.percentage = "Please enter Percentage in decimal only";
    else if (errors) {
      delete Object.assign(errors)["percentage"];
    }
    if (data.CGSTPrice && !this.validateFormData(data.CGSTPrice, "numeric")) errors.CGSTPrice = "Please enter CGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["CGSTPrice"];
    }
    if (data.SGSTPrice && !this.validateFormData(data.SGSTPrice, "numeric")) errors.SGSTPrice = "Please enter SGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["SGSTPrice"];
    }
    if (data.IGSTPrice && !this.validateFormData(data.IGSTPrice, "numeric")) errors.IGSTPrice = "Please enter IGST in decimal only";
    else if (errors) {
      delete Object.assign(errors)["IGSTPrice"];
    }
    if (data.tax1 && !this.validateFormData(data.tax1, "numeric")) errors.tax1 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax1"];
    }
    if (data.tax2 && !this.validateFormData(data.tax2, "numeric")) errors.tax2 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax2"];
    }
    if (data.tax3 && !this.validateFormData(data.tax3, "numeric")) errors.tax3 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax3"];
    }
    if (data.tax4 && !this.validateFormData(data.tax4, "numeric")) errors.tax4 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax4"];
    }
    if (data.tax5 && !this.validateFormData(data.tax5, "numeric")) errors.tax5 = "Please enter tax in decimal only";
    else if (errors) {
      delete Object.assign(errors)["tax5"];
    }
    if (isNaN(Number(data.costPrice)) || Number(data.costPrice) <= 0) {
      errors.costPrice = "Cost Price should not be less than or equal to 0";
    }
    if (isNaN(Number(data.sellPrice)) || Number(data.sellPrice) <= 0) {
      errors.sellPrice = "Sell Price should not be less than or equal to 0";
    }
    return Object.keys(errors).length === 0 ? null : errors;
  };

  render() {
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    let currencyList = [{ name: "Select", value: "" }];
    Global.getEnvironmetKeyValue("availableCurrencies").map((x) =>
      currencyList.push({
        name: x.isoCode + " (" + x.symbol + ")",
        value: x.isoCode + " (" + x.symbol + ")",
      })
    );
    const business = "package";
    return (
      <div className="container">
        <div className="row">
          {this.state.data.isInclusive && this.state.data.sellPrice > 0 && Number(this.state.data.processingFees) === 0 && Number(this.state.data.amountWithoutGST) > 0 &&
            <div className="col-lg-3">
              <div className="form-group amountWithoutGST">
                <label for="amountWithoutGST" style={{ "fontSize": "0.9em" }}>Sell Price (Without GST)</label>
                <input type="text" disabled name="amountWithoutGST" id="amountWithoutGST" class="form-control " value={this.state.data.amountWithoutGST} />
              </div>
            </div>
          }
          <div className="col-lg-3">
            {this.renderInput("sellPrice", "Sell Price (" + portalCurrency + ")", "text", this.state.data.isSellPriceReadonly, this.handleAmountFields)}
          </div>

          {this.state.data.totalAmount > 0 &&
            <div className="col-lg-3">
              {this.renderInput("totalAmount", "Total Amount (" + portalCurrency + ")", "text", true, this.handleAmountFields)}
            </div>}
          {/*  <div className="col-lg-3">
            <div class="form-group">
              <label>&nbsp;</label>
              <button
                className="btn btn-primary form-control"
                onClick={() => this.validateAndSave(this.state.data)}
              >
                Save
              </button>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-lg-3">
            {this.renderSelect("supplierCurrency", "Supplier Currency", currencyList)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("conversionRate", "Conversion Rate", "text", false, this.handleAmountFields)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("supplierCostPrice", "Supplier Cost Price", "text", false, this.handleAmountFields)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("supplierTaxPrice", "Supplier Tax", "text", false, this.handleAmountFields)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("costPrice", "Agent Cost Price (" + portalCurrency + ")", "text", true)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("markupPrice", "Agent Markup", "text", false, this.handleAmountFields)}
          </div>

          <div className="col-lg-3">
            {this.renderInput("discountPrice", "Discount", "text", false, this.handleAmountFields)}
          </div>
          <TaxQuotationAddOffline
            business={business}
            handleTaxQuoationoData={this.handleTaxQuoationoData}
            data={this.state.data}
            errors={this.state.errors}
            paperrates="true"
          />
        </div>
        <div className="row border-top" >
          <div className="col-lg-12">
            <div className="col-lg-3 pull-right mt-3 p-0">
              <div class="form-group">
                <button
                  className="btn btn-primary form-control"
                  onClick={() => this.validateAndSave(this.state.data)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default QuotationPackagePricing;
