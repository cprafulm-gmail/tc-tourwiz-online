import React, { Component } from 'react'
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import * as Global from "../../helpers/global";
export class BusinessDD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            business: [],
            selectedValue: "",
            isLoading: false
        };
    }
    getBusinesses = () => {
        // this.setState({ isLoading: true });
        // let reqURL = "reconciliation/supplier/business?providerid=" + this.props.providerID;
        // apiRequester_unified_api(
        //     reqURL,
        //     {},
        //     function (data) {
        //         var count = 0;
        //         data.response.forEach(function (e, a) {
        //             if (e.businessType === "Air")
        //                 data.response[count].businessType = "Flight";
        //             count = count + 1;
        //         });
        //         let businessList = data.response;
        //         if (this.props.calledFrom === "manualinvoice") {
        //             businessList = businessList.filter(x => x.businessType !== "Package");
        //         }
        //         this.setState({ business: businessList, isLoading: false });
        //     }.bind(this),
        //     "GET"
        // );
        this.setState({ isLoading: true });
        let businessList = [];
        Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
            var name = item.name;
            var itemid = item.id;
            name = name[0].toUpperCase() + name.substring(1);
            if (name.toLowerCase() === 'transfers' || name.toLowerCase() === 'package' || name.toLowerCase() === 'custom')
                itemid = item.aliasId;
            businessList.push({ businessType: name === 'Air' ? 'Flight' : name, businessTypeId: itemid, key: index });
        });
        if (this.props.calledFrom === "manualinvoice") {
            businessList = businessList.filter(x => x.businessType !== "Package");
        }
        this.setState({ business: businessList, isLoading: false });
    }
    getSupplier = (businessID) => {
        this.setState({ isLoading: true });
        let reqURL = "reconciliation/supplier/business/suppliers?businessid=" + businessID + "&providerid=" + this.props.providerID;
        if (this.props.afUserType) {
            reqURL = reqURL + "&usertype=" + this.props.afUserType
        }
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                this.setState({ isLoading: false });
                this.props.handleBusiness(businessID, data.response);
                sessionStorage.setItem("reportBusinessSupplier", JSON.stringify({ providerID: this.props.providerID, businessID, businessList: this.state.business, supplierList: data.response }));
            }.bind(this),
            "GET"
        );
    }
    componentDidMount() {
        if (this.props.calledFrom !== "manualinvoice" && sessionStorage.getItem("reportBusinessSupplier")) {
            const results = JSON.parse(sessionStorage.getItem("reportBusinessSupplier"));
            if (results && results.providerID == this.props.providerID && results.businessID != this.state.selectedValue) {
                this.setState({ selectedValue: results.businessID, business: results.businessList });
                this.props.handleBusiness(results.businessID, results.supplierList);
            } else {
                sessionStorage.removeItem("reportBusinessSupplier");
                this.getBusinesses();
            }
        } else
            this.getBusinesses();
    }
    handleValueChange(event) {
        this.setState({ selectedValue: event.target.value });
        if (!event.target.value || event.target.value === "") {
            sessionStorage.removeItem("reportBusinessSupplier");
            this.props.handleBusiness('', []);
        } else
            this.getSupplier(event.target.value);
    }
    render() {
        let { business, selectedValue, isLoading } = this.state;
        let { BusinessId, disabled, calledFrom } = this.props;
        selectedValue = BusinessId ? BusinessId : selectedValue;
        return (
            <React.Fragment>
                <label htmlFor={"business"}>{calledFrom === "reports-filters" ? "Product " : "Business *"}</label>
                <div className="input-group">
                    <select
                        value={selectedValue}
                        onChange={(e) => calledFrom === "manualinvoice" ? this.props.handleBusiness(e.target.value) : this.handleValueChange(e)}
                        name={"business"}
                        id={"business"}
                        className={"form-control"}
                        disabled={disabled}>
                        <option key={0} value={''}>{calledFrom === "reports-filters" ? "All" : "Select"}</option>
                        {business.map((option, key) => (
                            <option
                                key={key}
                                value={
                                    calledFrom === "manualinvoice" ? (option["businessType"].toLowerCase() === "flight" ? "air" : option["businessType"].toLowerCase()) : option["businessTypeId"]
                                }
                                className="text-capitalize"
                            >
                                {option["businessType"]}
                            </option>
                        ))}
                    </select>
                    {isLoading ? (
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </React.Fragment>
        )
    }
}

export default BusinessDD
