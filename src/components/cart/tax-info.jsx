import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import Select from "react-select";
import * as Global from "../../helpers/global";
import info from "../../assets/images/dashboard/info-circle.svg";

class TaxInfo extends Component {
    constructor(props) {
        super(props);
        var farebreakup = [];
        if (this.props.cartItems[0].fareBreakup.find(x => x.code === "customtax")?.item
            && this.props.cartItems[0].fareBreakup.find(x => x.code === "customtax")?.item.length > 0)
            farebreakup = this.props.cartItems[0].fareBreakup.find(x => x.code === "customtax")?.item[0].displayRateInfo;
        this.state = {
            data: {
                processingFee: farebreakup ? (farebreakup.find(x => x.purpose === "156")?.amount ?? 0) : 0,
                taxType: this.props.cartItems[0].data.config.find(x => x.key === "gstTaxType")?.value ?? "CGSTSGST",
                CGST: parseFloat(this.props.cartItems[0].data.config.find(x => x.key === "tax157")?.value ?? 0),
                SGST: parseFloat(this.props.cartItems[0].data.config.find(x => x.key === "tax158")?.value ?? 0),
                IGST: parseFloat(this.props.cartItems[0].data.config.find(x => x.key === "tax159")?.value ?? 0),
                tax160: farebreakup ? (farebreakup.find(x => x.purpose === "160")?.amount ?? 0) : 0,
                tax161: farebreakup ? (farebreakup.find(x => x.purpose === "161")?.amount ?? 0) : 0,
                tax162: farebreakup ? (farebreakup.find(x => x.purpose === "162")?.amount ?? 0) : 0,
                tax163: farebreakup ? (farebreakup.find(x => x.purpose === "163")?.amount ?? 0) : 0,
                tax164: farebreakup ? (farebreakup.find(x => x.purpose === "164")?.amount ?? 0) : 0,
                isInclusive: (this.props.cartItems[0].data.config.find(x => x.key === "isInclusiveGST")?.value ?? "false") === "true" ? true : false,
                customTaxConfiguration: this.getCustomTaxConfiguration(),
                taxPercentage: parseFloat(this.props.cartItems[0].data.config.find(x => x.key === "GSTPercentage")?.value ?? 18),
                amountWithoutGST: 0,
                istax160Modified: false,
                istax161Modified: false,
                istax162Modified: false,
                istax163Modified: false,
                istax164Modified: false,
            },
            prevProcessingFee: 0,
            prevPercentage: 0,
            errors: {},
            taxList: this.getTaxOptions(),
            isShowTaxSuccessMessage: false
        };
    }

    handleIsInclusive = () => {
        let data = this.state.data;
        data.isInclusive = !data.isInclusive
        const errors = {};
        if (data.processingFee <= 0 && data.isInclusive === true) {
            errors.processingFee = "Processing fee required";
            return this.setState({ errors });
        }
        data = this.porcessFees(data);
        this.setState({ data, isShowTaxSuccessMessage: false }, () => { if (this.props.mode === "manual-cancel") this.props.updateGSTInfo(data) });
    }

    getCustomTaxConfiguration = () => {
        try {
            let environment = JSON.parse(localStorage.getItem("environment"));
            let business = this.props.cartItems[0].data.business.toLowerCase();
            if (business === "transfers" || business === "custom" || business === "package") business = "activity";
            return environment.customTaxConfigurations.find(x => x.business.toLowerCase() === business);
        }
        catch { }
        return [];
    }

    getTaxOptions() {
        const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
            && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
        if (IsGSTApplicable) {
            return [
                { value: "CGSTSGST", label: "CGST/SGST" },
                { value: "IGST", label: "IGST" },
            ]
        }
        return [];
    }

    porcessFees = (data) => {
        let { taxPercentage } = this.state.data;
        let processingFees = isNaN(Number(data.processingFee)) ? 0 : Number(data.processingFee);
        let CGST = isNaN(Number(data.CGST)) ? 0 : Number(data.CGST);
        let SGST = isNaN(Number(data.SGST)) ? 0 : Number(data.SGST);
        let IGST = isNaN(Number(data.IGST)) ? 0 : Number(data.IGST);

        let CGSTSGST = taxPercentage / 2; //divided percentage for CGST & SGST
        if (!isNaN(Number(processingFees) > 0) && data.taxType) {
            let tmpData = this.porcessTaxInfo(processingFees, data, taxPercentage);
            data.CGST = tmpData.CGST;
            data.SGST = tmpData.SGST;
            data.IGST = tmpData.IGST;
            data.amountWithoutGST = tmpData.amountWithoutGST;
            /* if (data.isInclusive) {
                data.IGST = Number(data.IGST) > 0 ? Number(data.IGST) : processingFees - (processingFees * (100 / (100 + taxPercentage)));
                data.IGST = Number(data.IGST.toFixed(2));
                if (data.taxType === "CGSTSGST") {
                    data.CGST = Number(data.CGST) > 0 ? Number(data.CGST) : Number((data.IGST / 2).toFixed(2));
                    data.SGST = Number(data.SGST) > 0 ? Number(data.SGST) : Number((data.IGST / 2).toFixed(2));
                    if (processingFees !== Number(this.state.prevProcessingFee)
                        || taxPercentage !== Number(this.state.prevPercentage)) {
                        data.CGST = Number((data.IGST / 2).toFixed(2));
                        data.SGST = Number((data.IGST / 2).toFixed(2));
                    }
                    data.IGST = 0;
                }
                else {
                    data.CGST = 0;
                    data.SGST = 0;
                }
            }
            else {
                data.IGST = Number(data.IGST) > 0 ? Number(data.IGST) : Number((processingFees * (taxPercentage / 100)).toFixed(2));
                if (data.taxType === "CGSTSGST") {
                    data.CGST = Number(data.CGST) > 0 ? Number(data.CGST) : Number(((processingFees * CGSTSGST) / 100).toFixed(2));
                    data.SGST = Number(data.SGST) > 0 ? Number(data.SGST) : Number(((processingFees * CGSTSGST) / 100).toFixed(2));
                    if (processingFees !== Number(this.state.prevProcessingFee)
                        || taxPercentage !== Number(this.state.prevPercentage)) {
                        data.CGST = Number(((processingFees * CGSTSGST) / 100).toFixed(2));
                        data.SGST = Number(((processingFees * CGSTSGST) / 100).toFixed(2));
                    }
                    data.IGST = 0;
                }
                else if (processingFees !== Number(this.state.prevProcessingFee)
                    || taxPercentage !== Number(this.state.prevPercentage)) {
                    data.IGST = Number(((processingFees * taxPercentage) / 100).toFixed(2));
                }
                else {
                    data.CGST = 0;
                    data.SGST = 0;
                }
            } */
            data.customTaxConfiguration.taxes.find(y => y.name.toLowerCase() === 'processing fee').amount = processingFees;
            data.customTaxConfiguration.taxes.find(y => y.name.toLowerCase() === 'cgst').amount = data.CGST;
            data.customTaxConfiguration.taxes.find(y => y.name.toLowerCase() === 'sgst').amount = data.SGST;
            data.customTaxConfiguration.taxes.find(y => y.name.toLowerCase() === 'igst').amount = data.IGST;

            let business = this.props.cartItems[0].data.business.toLowerCase();
            data.tax160 = this.getCustomTaxAmount('160', business, processingFees, data.istax160Modified, data.tax160);
            data.tax161 = this.getCustomTaxAmount('161', business, processingFees, data.istax161Modified, data.tax161);
            data.tax162 = this.getCustomTaxAmount('162', business, processingFees, data.istax162Modified, data.tax162);
            data.tax163 = this.getCustomTaxAmount('163', business, processingFees, data.istax163Modified, data.tax163);
            data.tax164 = this.getCustomTaxAmount('164', business, processingFees, data.istax164Modified, data.tax164);

            this.setState({ prevProcessingFee: data.processingFee, prevPercentage: taxPercentage });
        }
        return data;
    }

    getCustomTaxAmount = (purpose, business, amountToCalculate, istaxModified, currentAmount) => {
        if (istaxModified) return currentAmount;
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

    handledata = (name, value) => {
        let data = { ...this.state.data };
        const errors = {};
        if (name === 'processingFee' && value !== "" && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
            errors.processingFee = (this.props.mode === "manual-cancel" ? "Invalid Cancellation Fee" : "Invalid Processing Fee");
            data[name] = value;
            return this.setState({ data, errors });
        }

        data[name] = value;
        data = this.porcessFees(data);

        this.setState({ data, errors, isShowTaxSuccessMessage: false }, () => { if (this.props.mode === "manual-cancel") this.props.updateGSTInfo(data) }
        );
    }

    handleGSTInfo = () => {
        let data = this.state.data;
        let dataparam = [];
        if (!isNaN(Number(data.processingFee) > 0) && data.taxType) {
            if (data.CGST > 1)
                dataparam.push({ name: "CGST", amount: data.CGST });
            if (data.SGST > 1)
                dataparam.push({ name: "SGST", amount: data.SGST });
            if (data.IGST > 1)
                dataparam.push({ name: "IGST", amount: data.IGST });
        }
        this.props.handleGSTInfo(dataparam);
    }

    updateGSTInfo = (cartitemId) => {
        let config = {};
        let data = this.state.data;
        let errors = this.state.errors;
        errors.totalAmount = "";
        let total = Number(data.processingFee) + Number(data.CGST) + Number(data.SGST) + Number(data.IGST) + Number(data.tax160) + Number(data.tax161) + Number(data.tax162) + Number(data.tax163) + Number(data.tax164);
        if (total <= 0) {
            errors.totalAmount = "Please enter at least one tax value.";
            this.setState({ errors });
            return;
        }

        if (this.state.taxList.length > 0) {
            config["isInclusiveGST"] = data.isInclusive;
            config["taxPercentage"] = data.taxPercentage;
            config["gstTaxType"] = data.taxType;

            config["tax" + data.customTaxConfiguration.taxes.find(x => x.name === "Processing Fee").purpose] = parseFloat(data.processingFee)
            //= data.isInclusive ? parseFloat(data.processingFee) - (data.IGST + data.CGST + data.SGST) : parseFloat(data.processingFee);
            if (data.CGST > 1 && data.taxType === "CGSTSGST") {

                config["tax" + data.customTaxConfiguration.taxes.find(x => x.name === "CGST").purpose] = data.CGST;
            }
            if (data.SGST > 1 && data.taxType === "CGSTSGST") {
                config["tax" + data.customTaxConfiguration.taxes.find(x => x.name === "SGST").purpose] = data.SGST;
            }
            if (data.IGST > 1 && data.taxType === "IGST") {
                config["tax" + data.customTaxConfiguration.taxes.find(x => x.name === "IGST").purpose] = data.IGST;
            }
        }
        if (data.tax160 > 1) { config["tax160"] = data.tax160; }
        if (data.tax161 > 1) { config["tax161"] = data.tax161; }
        if (data.tax162 > 1) { config["tax162"] = data.tax162; }
        if (data.tax163 > 1) { config["tax163"] = data.tax163; }
        if (data.tax164 > 1) { config["tax164"] = data.tax164; }

        var reqOBJ = {
            Request: [
                {
                    CartItemID: cartitemId,
                    CartID: localStorage.getItem("cartLocalId"),
                    config: config,
                    customTaxConfiguration: data.customTaxConfiguration
                }
            ],
            Flags: { lockcartifunlocked: true },
        };
        this.setState({ isShowTaxSuccessMessage: true }, () => { this.props.updateGSTInfo(reqOBJ); });

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

    handleTaxPercentage = (e) => {
        let data = this.state.data
        data.taxPercentage = parseInt(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
        data = this.porcessFees(this.state.data);
        this.setState({ data, isShowTaxSuccessMessage: false });
    }

    handleTaxes = (e) => {
        let data = this.state.data;
        //if (data["is" + e.target.name + "Modified"] === true) return;
        if (Number(data[e.target.name]) !== parseInt(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))) {
            data["is" + e.target.name + "Modified"] = true;
        }
        data[e.target.name] = parseInt(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value));
        this.setState({ data, isShowTaxSuccessMessage: false });
    }

    render() {
        const taxList = this.state.taxList;
        const env = JSON.parse(localStorage.getItem("environment"));
        let generalTaxes = [];
        let business = this.props.cartItems[0].data.business.toLowerCase();
        if (business === "transfers" || business === "custom" || business === "package") business = "activity";
        if (env.customTaxConfigurations && env.customTaxConfigurations
            .find(x => x.business.toLowerCase() === business)) {
            generalTaxes = env.customTaxConfigurations
                .find(x => x.business.toLowerCase() === business)
                .taxes.filter(tax => tax.isShowOnUI === true && Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
                .map(item => { return { "name": item.name, "purpose": item.purpose } })
                .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
        }

        if (taxList.length === 0 && generalTaxes.length === 0)
            return <></>;
        else if (this.props.mode === "manual-cancel")
            return (
                <>
                    <div className="col-lg-3">
                        <div className="form-group">
                            <label htmlFor="processingFee">Cancellation Fee</label>
                            <input type="numeric" name="processingFee" id="processingFee" className="form-control "
                                onChange={(e) => this.handledata(e.target.name, e.target.value)} />
                            {this.state.errors.processingFee !==
                                undefined &&
                                this.state.errors.processingFee !==
                                "" && (
                                    <div className="col-lg-12 col-sm-12 m-0 p-0">
                                        <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                            {this.state.errors.processingFee}
                                        </small>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <label htmlFor=""></label>
                        <div className="custom-control custom-switch mt-3 ">
                            <input
                                id="isInclusive"
                                name="isInclusive"
                                type="checkbox"
                                className="custom-control-input"
                                checked={this.state.data.isInclusive}
                                onChange={this.handleIsInclusive}
                            />
                            <label className="custom-control-label" htmlFor="isInclusive">
                                Inclusive GST
                            </label>
                        </div>
                    </div>

                    {taxList.map(item => {
                        return <div className="col-lg-3">
                            <div className="custom-control custom-switch my-3">
                                <input
                                    id={item.value}
                                    name={item.value}
                                    type="radio"
                                    className="custom-control-input"
                                    checked={item.value === this.state.data.taxType}
                                    onChange={(e) => this.handledata("taxType", item.value)}
                                />
                                <label className="custom-control-label" htmlFor={item.value}>
                                    {item.label}
                                </label>
                            </div>
                        </div>
                    })}


                    <div className="col-lg-3">
                        <div className="form-group">
                            <label htmlFor="taxPercentage">Tax Percentage</label>
                            <input type="text" name="taxPercentage" id="taxPercentage" className="form-control" onChange={this.handleTaxPercentage} value={Number(this.state.data.taxPercentage)} />
                        </div>
                    </div>

                    {this.state.data.taxType === "IGST" &&
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="IGST">IGST</label>
                                <input type="text" name="IGST" id="IGST" className="form-control" value={Number(this.state.data.IGST)} />
                            </div>
                        </div>}
                    {this.state.data.taxType === "CGSTSGST" && <>
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="CGST">CGST</label>
                                <input type="text" name="CGST" id="CGST" className="form-control" value={Number(this.state.data.CGST)} />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label htmlFor="SGST">SGST</label>
                                <input type="text" name="SGST" id="SGST" className="form-control" value={Number(this.state.data.SGST)} />
                            </div></div>
                    </>}
                    {/* {!isNaN(Number(this.state.data.processingFee)) && Number(this.state.data.processingFee) > 0 && this.state.data.taxType &&
                            <div className="col-lg-12 d-flex align-items-end">
                                <div className="form-group">
                                    {this.props.isLoadingTaxInfo ?
                                        <button className="btn btn-primary">
                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                            Apply
                                        </button>
                                        :
                                        <button className="btn btn-primary" onClick={() => this.updateGSTInfo(this.props.cartItems[0].cartItemID)} >
                                            Apply
                                        </button>
                                    }

                                </div>
                            </div>
                        } */}
                </>
            );
        else
            return (
                <div className="contact-details border p-3 bg-white box-shadow mt-3">
                    <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
                        <SVGIcon
                            name="tax"
                            width="20"
                            height="20"
                            className="mr-2"
                        ></SVGIcon>
                        Tax Details
                    </h5>
                    <div className="row ">
                        {taxList.length > 0 &&
                            <React.Fragment>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="processingFee">Processing Fee</label>
                                        <input type="text" name="processingFee" id="processingFee" className="form-control"
                                            value={Number(this.state.data.processingFee)}
                                            onChange={(e) => this.handledata(e.target.name, e.target.value)} />

                                        {this.state.errors.processingFee !==
                                            undefined &&
                                            this.state.errors.processingFee !==
                                            "" && (
                                                <div className="col-lg-12 col-sm-12 m-0 p-0">
                                                    <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                                        {this.state.errors.processingFee}
                                                    </small>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                {this.state.data.amountWithoutGST > 0 &&
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="taxAmountWithoutGST" style={{ "fontSize": "0.8em" }}>Amount without GST</label>
                                            <input type="numeric" name="taxAmountWithoutGST" id="taxAmountWithoutGST" className="form-control" disabled={true} value={this.state.data.amountWithoutGST} />
                                        </div>
                                    </div>}
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="taxPercentage">Tax Category</label>

                                        <button className='btn disabled' data-toggle="tooltip" data-placement="right" title="Percentage is divided equally between CGST and SGST"
                                            style={{ position: "absolute", top: "-7px", right: "10px" }}>
                                            <figure>
                                                <img
                                                    style={{ filter: "none" }}
                                                    src={info}
                                                    alt=""
                                                />
                                            </figure>
                                        </button>
                                        <select className="form-control"
                                            defaultValue={this.state.data.taxType}
                                            onChange={(e) => this.handledata("taxType", e.target.value)}
                                        >
                                            {taxList.map(item => {
                                                return <option value={item.value}>{item.label}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="taxPercentage">Percentage (%)</label>
                                        <input type="numeric" name="taxPercentage" id="taxPercentage" className="form-control" onChange={this.handleTaxPercentage} value={Number(this.state.data.taxPercentage)} />
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <label htmlFor="">Inclusive GST</label>
                                    <div className="custom-control custom-switch  ">
                                        <input
                                            id="isInclusive"
                                            name="isInclusive"
                                            type="checkbox"
                                            className="custom-control-input"
                                            checked={this.state.data.isInclusive}
                                            onChange={this.handleIsInclusive}
                                        />
                                        <label className="custom-control-label" htmlFor="isInclusive" style={{ fontSize: "0.8em" }}>
                                        </label>
                                    </div>
                                </div>
                                {this.state.data.taxType === "IGST" &&
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label htmlFor="IGST">IGST</label>
                                            <input type="text" name="IGST" id="IGST" className="form-control" onChange={(e) => this.handledata(e.target.name, e.target.value)} value={Number(this.state.data.IGST)} />
                                        </div>
                                    </div>}
                                {this.state.data.taxType === "CGSTSGST" && <>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="CGST">CGST</label>
                                            <input type="text" name="CGST" id="CGST" className="form-control" onChange={(e) => this.handledata(e.target.name, e.target.value)} value={Number(this.state.data.CGST)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="SGST">SGST</label>
                                            <input type="text" name="SGST" id="SGST" className="form-control" onChange={(e) => this.handledata(e.target.name, e.target.value)} value={Number(this.state.data.SGST)} />
                                        </div>
                                    </div>
                                </>}
                            </React.Fragment>}
                    </div>
                    <div className="row">
                        {generalTaxes.length > 0 &&
                            <React.Fragment>
                                {generalTaxes.map((item, count) => {
                                    return <div className="col-lg-6">
                                        <div className="form-group">
                                            <label for={item.purpose}>{item.name}</label>
                                            <input type="text" name={"tax" + item.purpose} className="form-control"
                                                onChange={this.handleTaxes}
                                                value={Number(this.state.data["tax" + item.purpose])} />
                                        </div>
                                    </div>
                                })}
                            </React.Fragment>
                        }
                        {((!isNaN(Number(this.state.data.processingFee))
                            && this.state.data.taxType)
                            || Number(this.state.data.tax160) > 0
                            || Number(this.state.data.tax161) > 0
                            || Number(this.state.data.tax162) > 0
                            || Number(this.state.data.tax163) > 0
                            || Number(this.state.data.tax164) > 0)
                            && <div className="col-lg-12 d-flex align-items-end">
                                <div className="form-group">
                                    {this.props.isLoadingTaxInfo ?
                                        <button className="btn btn-primary">
                                            <span className="spinner-border spinner-border-sm mr-2"></span>
                                            Apply
                                        </button>
                                        :
                                        <button className="btn btn-primary"
                                            onClick={() => this.updateGSTInfo(this.props.cartItems[0].cartItemID)}>
                                            Apply
                                        </button>
                                    }
                                </div>
                            </div>
                        }
                        {this.state.errors.totalAmount &&
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-danger mt-2 mb-0 p-1 d-inline-block">
                                    {this.state.errors.totalAmount}
                                </small>
                            </div>}

                        {this.state.isShowTaxSuccessMessage && this.props.taxInfoSuccessMessage &&
                            <div className="col-lg-12 col-sm-12 m-0 p-0">
                                <small className="alert alert-success mt-2 mb-0 p-1 d-inline-block">
                                    Tax(es) applied successfuly.
                                </small>
                            </div>}
                    </div>
                </div>
            );
    }
}

export default TaxInfo;

const TaxList = [
    { label: "CGST (9%), SGST (9%)", value: "CGSTSGST" },
    { label: "IGST (18%)", value: "IGST" }
];