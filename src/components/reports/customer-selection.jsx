import React, { Component } from 'react';
import CustomerSelectionPopUp from "./customer-selection-popup";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { apiRequester } from "../../services/requester";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

export class Customerselection extends Component {
    constructor(props) {
        super(props);
        let customerData = this.props.customerData;
        this.state = {
            isShowPopup: false,
            data: customerData,
            isCustomerSelected: customerData && Object.keys(customerData).length > 0,
            results: customerData && Object.keys(customerData).length > 0 ? [customerData] : [],
            isLoading: false,
            isDirty: false,
            isSelectingCustomer: false
        };
    }
    closePopup() {
        this.setState({ isShowPopup: false })
    }
    selectCustomer = (item, isFromSelection) => {
        if (this.props.mode === "text-only") {
            this.setState({ data: item, isCustomerSelected: true, results: [item], isLoading: false });
            this.props.selectCustomer && this.props.selectCustomer(item);
            return;
        }
        let query = '';
        if (item.email)
            query = item.email
        if (item.contactInformation.email)
            query = item.contactInformation.email;
        if (item.contactInformation.phoneNumber)
            query = item.contactInformation.phoneNumber;
        if (query)
            this.setpersonateForCustomer(query, item);
    }
    setpersonateForCustomer = (email, item) => {
        let bookingForInfo = JSON.parse(sessionStorage.getItem("customer-info"));
        if (bookingForInfo !== null && Object.keys(bookingForInfo).length > 1) {
            if (email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))) {
                email = email.replace(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"), "").replace('+', "");
            }
            if (email.indexOf('@') === -1
                && email.replace('+', "") === bookingForInfo.contactInformation.phoneNumber.replace('+', "")) {
                this.props.selectCustomer && this.props.selectCustomer(bookingForInfo);
                return;
            }
            else if (email === bookingForInfo.contactInformation.email) {
                this.props.selectCustomer && this.props.selectCustomer(bookingForInfo);
                return;
            }
        }
        sessionStorage.setItem("customer-info", JSON.stringify(item)); // For Newly implement <CustomerAddSelect>
        let results = [item];
        this.setState({ data: item, isCustomerSelected: true, results, isLoading: false, isSelectingCustomer: false });
        this.closePopup();
        this.props.selectCustomer && this.props.selectCustomer(item);
    };
    componentDidMount() {
        if (this.props.mode === "text-only") {
            //Do not delete this condition
        }
        else if (sessionStorage.getItem("customer-info")) {
            let results = {};
            results = [JSON.parse(sessionStorage.getItem("customer-info"))];
            if (results.length > 0) {
                const Customer = results[0];
                if (Customer.entityID != this.state.data.entityID)
                    this.selectCustomer(Customer);
            }
        }
        else if (this.props.email) {
            this.getCustomer(this.props.email);
        }
    }
    resetCustomer = () => {
        sessionStorage.removeItem("customer-info");
        let results = [];
        this.setState({ data: null, isCustomerSelected: false, results, isLoading: false, isSelectingCustomer: false });
        this.props.resetCustomer && this.props.resetCustomer();
        return;
    }
    change = (item) => {
        if (this.props.mode === "text-only") {
            if (item && item.length > 0)
                this.selectCustomer(item[0]);
            else
                this.props.selectCustomer && this.props.selectCustomer([]);
        }
        else if (item && item.length > 0) {
            this.selectCustomer(item[0]);
        }
    }
    getCustomer(query) {
        this.setState({ isLoading: true })
        let reqURL = "reconciliation/customer/list?createdfromdate=2020-01-01&createdtodate=2050-12-31&agentid=" + this.props.agentID;
        reqURL = query ? reqURL + "&" + (this.props.email ? "emailid" : "customername") + "=" + query.replace("+", "") : reqURL;

        let reqOBJ = {}
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({ results: data.response, isLoading: false })
                if (localStorage.getItem('portalType') === 'B2C' &&
                    data.response && data.response.length > 0) {
                    this.selectCustomer(data.response[0]);
                }
            }.bind(this),
            "GET"
        );
    }
    onInputChange = () => {
        this.setState({ isCustomerSelected: false, isDirty: true })
    }
    render() {
        const { data, isCustomerSelected, isShowPopup, results, isLoading, isDirty, isSelectingCustomer } = this.state
        return (
            <React.Fragment>
                {this.props.mode === "text-only" &&
                    <div className={"form-group "}>
                        <label htmlFor={"customer"}>Customer Name</label>
                        <AsyncTypeahead
                            emptyLabel={"No customer found!"}
                            id="asyncTypeaheadControl"
                            isLoading={isLoading}
                            //isInvalid={!isCustomerSelected && isDirty}
                            defaultSelected={isCustomerSelected ? [data] : []}
                            selected={isCustomerSelected ? [data] : []}
                            options={results && results.length === 0 ? [] : results}
                            onChange={this.change}
                            useCache={false}
                            onInputChange={this.onInputChange}
                            searchText={"Searching customer"}
                            labelKey={option =>
                                `${option.name ?? option.firstName + ' ' + (option.lastName ?? "")}`
                            }
                            placeholder={
                                isSelectingCustomer ? "Selecting customer..." : "Type here to search customer"
                            }
                            onSearch={query => {
                                this.getCustomer(query)
                            }}
                            renderMenuItemChildren={(option, props) => (
                                <div>
                                    <span>{(option.name ?? option.firstName) + ' ' + (option.cellPhone ?? option.contactInformation?.phoneNumber ?? "")}</span>
                                </div>
                            )}
                        />
                    </div>
                }
                {this.props.mode !== "text-only" && localStorage.getItem('portalType') !== 'B2C' &&
                    <div className="form-row">
                        {!this.props.ishidelabel &&
                            <div className="col-auto d-flex flex-column justify-content-center align-items-center">
                                <span className="">Customer Selection</span>
                            </div>
                        }
                        <div className={!this.props.ishidelabel ? "col-md-6" : "col-md-12"}>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </div>
                                </div>
                                {/* <input className="form-control" disabled value={data.name ? data.name + " - " + data.cellPhone : ""} type="text"></input> */}
                                <AsyncTypeahead
                                    emptyLabel={"No customer found!"}
                                    id="asyncTypeaheadControl"
                                    isLoading={isLoading}
                                    ///isInvalid={!isCustomerSelected && isDirty}
                                    defaultSelected={isCustomerSelected ? [data] : []}
                                    selected={isCustomerSelected ? [data] : []}
                                    options={results && results.length === 0 ? [] : results}
                                    onChange={this.change}
                                    useCache={false}
                                    onInputChange={this.onInputChange}
                                    searchText={"Searching customer"}
                                    labelKey={option =>
                                        `${option.name ?? option.firstName + ' ' + (option.lastName ?? "")}`
                                    }
                                    placeholder={
                                        isSelectingCustomer ? "Selecting customer..." : "Type here to search customer"
                                    }
                                    onSearch={query => {
                                        this.getCustomer(query)
                                    }}
                                    renderMenuItemChildren={(option, props) => (
                                        <div>
                                            <span>{(option.name ?? option.firstName) + ' ' + (option.cellPhone ?? option.contactInformation?.phoneNumber ?? "")}</span>
                                        </div>
                                    )}
                                />

                                <div className="input-group-append">
                                    {this.state.isCustomerSelected &&
                                        <button
                                            className="reset-btn position-absolute btn btn-link text-secondary"
                                            onClick={this.resetCustomer}
                                            style={{ right: "64px" }}
                                        >
                                            <i className="fa fa-times" aria-hidden="true"></i>
                                        </button>}
                                    <button
                                        className="btn btn-primary reset-btn "
                                        onClick={() => { this.setState({ isShowPopup: true }) }}
                                    >
                                        {"Select"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {isShowPopup && (
                    <CustomerSelectionPopUp closePopup={this.closePopup.bind(this)} selectCustomer={this.selectCustomer} agentID={this.props.agentID} />
                )}
            </React.Fragment>
        )
    }
}

export default Customerselection