import React from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import BusinessDD from "./business-dropdown"
import moment from "moment";
import Select from "react-select";
import * as Global from "../../helpers/global";
class Filters extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
                supplierid: "",
                invoicenumber: "",
                reconcillationstatus: null,
                isAgentSupplierOnly: true
            },
            errors: {},
            supplierList: [{ name: "Select", value: '' }],
            dataSupplier: []
        };
    }

    componentDidMount() {
        let reportBusinessSupplier = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"))

        if (reportBusinessSupplier && reportBusinessSupplier["supplierList"]
            && reportBusinessSupplier["businessID"]
            && reportBusinessSupplier["supplierId"]) {
            let data = this.state.data
            data["supplierid"] = reportBusinessSupplier["supplierId"]
            let arr = [{ name: "Select", value: '' }]
            reportBusinessSupplier["supplierList"].map(supplier => {
                arr.push({ name: supplier.fullName, value: supplier.providerId })
            })
            this.setState({ supplierList: arr, data }, () => {
                this.handleFilters();
            })
        }
    }

    handleFilters = () => {
        //alert(JSON.stringify(this.state.data))
        const errors = this.validateFilter();

        this.setState({ errors: errors || {} });
        if (errors) return;

        let data = this.state.dataSupplier.find((fld) => (fld.providerId === parseInt(this.state.data.supplierid)))
        if (data)
            this.props.handleFilters(this.state.data, data.currencySymbol, data.fullName);
    };

    validateFilter = () => {
        const errors = {};
        const { data } = this.state;

        if (!data.supplierid || !this.validateFormData(data.supplierid, "require"))
            errors.supplierid = "Supplier required";

        if (!data.businessid || !this.validateFormData(data.businessid, "require"))
            errors.businessid = "Business required";

        // if ( new Date(data["fromdate"]) > new Date(data["todate"])) {
        //         errors["fromdate"] = "From Date can not be greater To End Date."; 
        //     }
        if (new Date(data["todate"]) < new Date(data["fromdate"])) {
            errors["todate"] = "To Date can not be less than From Date.";
        }
        else {
            if (errors["fromdate"]) delete errors["fromdate"];
            if (errors["todate"]) delete errors["todate"];
        }

        return Object.keys(errors).length === 0 ? null : errors;
    }

    handleResetFilters = () => {
        this.setState({
            data: {
                fromdate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                todate: moment().format('YYYY-MM-DD'),
                businessid: "",
                supplierid: "",
                invoicenumber: "",
                reconcillationstatus: [{ name: "Select", value: '' }],
                isAgentSupplierOnly: true
            },
            errors: {},
            supplierList: [{ name: "Select", value: '' }]
        });
        sessionStorage.removeItem("reportBusinessSupplier")
        this.props.removeData();

    };
    handleStatusChange = (value, id) => {
        let { data } = this.state;
        data["reconcillationstatus"] = value;
        this.setState({ data });
    }
    handleBusiness = (value, sList) => {
        let vData = this.state.data;
        vData["businessid"] = value;
        vData["supplierid"] = null;
        let arr = [{ name: "Select", value: '' }]
        for (let supplier of sList) {
            arr.push({ name: supplier.fullName, value: supplier.providerId })
        }
        this.setState({ data: vData, supplierList: arr, dataSupplier: sList })
    };

    render() {
        const { supplierList, dataSupplier, errors, data } = this.state;
        const { statusList } = this.props;
        let agentSupplier = [];
        let tourwizSupplier = [];
        let supplierOptions = [];
        if (dataSupplier.length > 0) {
            agentSupplier = dataSupplier.filter(x => x.isTourwizSupplier === 0).map(item => { return { label: item.fullName, value: item.providerId } });
            tourwizSupplier = dataSupplier.filter(x => x.isTourwizSupplier === 1).map(item => { return { label: item.fullName, value: item.providerId } });
            supplierOptions = [
                {
                    label: "Agent Supplier",
                    options: agentSupplier
                },
                {
                    label: "Tourwiz Supplier",
                    options: tourwizSupplier
                }
            ];
        }
        return (
            <div className="mb-3 mt-3">


                <div className="border pt-2 pb-2 pl-3 pr-3 shadow-sm">
                    <h5 className="text-primary border-bottom pb-2 mb-2">
                        Filters

                    </h5>

                    <div className="row">
                        <div className="col-lg-3">
                            <BusinessDD
                                BusinessId={data.businessid === "" ? -1 : data.businessid}
                                providerID={this.props.agentID}
                                handleBusiness={this.handleBusiness.bind(this)} afUserType={this.props.afUserType} />
                            {errors["businessid"] && (
                                <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                    {errors["businessid"]}
                                </small>
                            )}
                        </div>
                        <div className="col-lg-3">
                            <div className={"form-group " + "SupplierId"}>
                                <label htmlFor={"SupplierId"}>{"Supplier *"}</label>
                                <Select
                                    placeholder="Select Supplier..."
                                    id={"supplierid"}
                                    defaultValue={{
                                        label: "Select",
                                        value: "",
                                    }}
                                    value={dataSupplier.filter(x => x.providerId === parseInt(data.supplierid)).map(item => { return { label: item.fullName, value: item.providerId } })}
                                    options={supplierOptions}
                                    /* onChange={(e) => this.handleDataChange(e)} */
                                    onChange={(e) => {
                                        this.handleChange({ "currentTarget": { "name": "supplierid", "value": e.value } });
                                    }}
                                    noOptionsMessage={() => "No supplier available"}
                                    isLoading={this.state.isLoadingSupplier}
                                />
                                {errors["supplierid"] && (
                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                        {errors["supplierid"]}
                                    </small>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            {this.renderSingleDate(
                                "fromdate",
                                "Invoice From Date",
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-3">
                            {this.renderSingleDate(
                                "todate",
                                "Invoice To Date",
                                moment().format(Global.DateFormate),
                                moment("2001-01-01").format(Global.DateFormate),
                            )}
                        </div>
                        <div className="col-lg-3">
                            {this.renderInput("invoicenumber", "Invoice Number")}
                        </div>
                        <div className="col-md-3">
                            <label className="d-block">Status</label>
                            <select
                                value={data.reconcillationstatus}
                                onChange={(e) => { this.handleStatusChange(e.target.value, "statusdata") }}
                                name={"options"}
                                id={"options1"}
                                className={"form-control"}>
                                {statusList.map((statusdata, key) => (
                                    <option
                                        key={key}
                                        value={
                                            statusdata
                                        }
                                    >
                                        {statusdata}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-3">
                            <label className="d-block">&nbsp;</label>
                            <button
                                name="Apply"
                                onClick={this.handleFilters}
                                className="btn btn-primary"
                            >
                                Apply
                            </button>
                            <button
                                name="reset"
                                onClick={this.handleResetFilters}
                                className="btn btn-primary ml-2"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default Filters
