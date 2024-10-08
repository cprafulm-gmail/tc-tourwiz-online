import React, { useState, useEffect } from 'react';
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { Typeahead } from "react-bootstrap-typeahead";
import SVGIcon from '../../helpers/svg-icon';
import ModelPopup from '../../helpers/model';
import useForm from "./useForm";
import { Trans } from "../../helpers/translate";
import { apiRequester } from '../../services/requester';
import * as Global from "../../helpers/global";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../../components/common/authorize-component";

const CustomerAddSelect = (props) => {

    const [errors, setErrors] = useState({});
    const [state, setState] = useState({
        isCustomerCreateBtnLoading: false,
        isCustomerCreatedMessage: null,
        isErrorMsg: '',
    });
    const [labelName, setLabelName] = useState(props.labelName ?? 'Customer');
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState(sessionStorage.getItem("customer-info")
        ? [JSON.parse(sessionStorage.getItem("customer-info"))]
        : []);
    const [defaultCustomers, setDefaultCustomers] = useState(sessionStorage.getItem("customer-info")
        ? [JSON.parse(sessionStorage.getItem("customer-info"))]
        : []);
    const [selectedCustomer, setSelectedCustomer] = useState(
        props.selectedCustomer
        ?? (sessionStorage.getItem("customer-info") ? JSON.parse(sessionStorage.getItem("customer-info")) : {}));
    const [popup, setPopup] = useState({
        popupContent: '',
        popupTitle: '',
        showPopup: false,
        sizeClass: ''
    });
    const [data, setData] = useState({
        customerName: "",
        email: "",
        phonenumber: ""
    });
    const rule = {
        data,
        setData,
        errors,
        setErrors,
    };

    const {
        renderInput,
        renderContactInput,
        validateFormData,
    } = useForm(rule);
    const css_Typeahead = `.dropdown-item:hover {
        color: #fff;
        text-decoration: none;
        background-color: #007bff;
    }`;//rgb(200, 81, 17)

    useEffect(() => {
        if (!props.selectedCustomer && sessionStorage.getItem("customer-info")) {
            var customerType = JSON.parse(sessionStorage.getItem("customer-info")).customerType ?? 'Customer';
            if (customerType.toLowerCase() === 'individual') customerType = 'Customer';
            if ((labelName.toLowerCase() === 'individual' ? "Customer" : labelName) != customerType) {
                sessionStorage.removeItem("customer-info");
                setSelectedCustomer({});
            }
        }
        if (!props.selectedCustomer && !sessionStorage.getItem("customer-info")) {
            //Get customers
            (async () => {
                setIsLoading(true);
                const customers = await fetchCustomers(props.selectedCustomer ?? null);
                setIsLoading(false);
                setCustomers(customers);
                setDefaultCustomers(customers);
            })();
        }
    }, []);

    //Get customer from API
    const fetchCustomers = async (query) => {
        let reqURL = "reconciliation/customer/list?pagesize=15&pagenumber=1&sortby=createddate&sortorder=desc&createdfromdate=2020-01-01&createdtodate=2050-12-31";
        reqURL = query ? reqURL + "&query=" + query.replace("+", "") : reqURL;
        reqURL = labelName !== 'Customer' ? reqURL + "&customertype=" + labelName : reqURL;

        let reqOBJ = {}
        return new Promise((resolve, reject) => {
            apiRequester_unified_api(
                reqURL,
                reqOBJ,
                function (data) {
                    data.response = data.response.map(item => {
                        let domainString = process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER;
                        if (item.contactInformation.email.replace('+', '').replace('-', '').toLowerCase().indexOf(item.contactInformation.phoneNumber.replace('+', '').replace('-', '')) > -1
                            || item.contactInformation.email.toLowerCase() === item.contactInformation.phoneNumber + domainString.replace('.', "@").toLowerCase()) {
                            item.contactInformation.email = '';
                            item.email = '';
                        }
                        return item;
                    })
                    resolve(data.response ?? []);
                }.bind(this),
                "GET"
            );
        });
    }

    const onChange = async (query) => {
        //Case : When selected customer removed by clicking 'X' button, Get resent created customer
        if (query.length === 0) {
            setIsLoading(true);
            setSelectedCustomer({});
            sessionStorage.removeItem("customer-info");
            const customers = await fetchCustomers();
            setIsLoading(false);
            setCustomers(customers);
            setDefaultCustomers(customers);
            props.handleChange();
        }
        //Case : User has selected customer from list
        else {
            setSelectedCustomer({ ...query[0] });
            sessionStorage.setItem("customer-info", JSON.stringify({ ...query[0] }));
            props.handleChange({ ...query[0] });
        }
    }

    const onInputChange = async (query) => {
        //Case : When user write someting in textbox, then get customer list from database
        if (query.length >= 3) {
            setIsLoading(true);
            const customers = await fetchCustomers(query);
            setIsLoading(false);
            setCustomers(customers);
        }
    }

    const closePopup = () => {
        if (state.isCustomerCreateBtnLoading) return;
        setState({
            isCustomerCreateBtnLoading: false,
            isCustomerCreatedMessage: null,
            isErrorMsg: '',
        });
        setPopup({
            popupContent: '',
            popupTitle: '',
            showPopup: false,
            sizeClass: ''
        });
        setData({
            customerName: "",
            email: "",
            phonenumber: ""
        });
        setErrors({});
    }

    const addCustomerPopup = () => {
        setPopup({ popupTitle: 'New ' + labelName, showPopup: true, });
    }

    const validateCustomerData = () => {
        const errors = {};

        if (!validateFormData(data.customerName, "require")) {
            errors.customerName = labelName + " name required";
        }
        else if (!validateFormData(data.customerName, "special-characters-not-allowed", /[<>]/)) {
            errors.customerName = "< and > characters not allowed";
        }
        if (data.email && !validateFormData(data.email, "email"))
            errors.email = "Enter valid Email";
        if (!validateFormData(data.phonenumber, "require") ||
            data.phonenumber === "1-" ||
            data.phonenumber.split("-")[1] === ""
        )
            errors.phonenumber = "Phone required";

        if (data.phonenumber && data.phonenumber !== "" && !validateFormData(data.phonenumber, "phonenumber"))
            errors.phonenumber = "Invalid Contact Phone";

        if (data.phonenumber && !validateFormData(data.phonenumber, "phonenumber_length", {
            min: 8, max: 14,
        }))
            errors.phonenumber = Trans("_error_mobilenumber_phonenumber_length");

        return Object.keys(errors).length === 0 ? null : errors;
    }

    const createCustomer = async () => {
        if (state.isCustomerCreateBtnLoading) return new Promise(function (resolve, reject) { resolve() });
        const errors = validateCustomerData();
        if (errors && Object.keys(errors).length > 0) {
            setErrors(errors || {});
            setState({
                ...state,
                isCustomerCreateBtnLoading: false,
            });
            if (errors) return new Promise(function (resolve, reject) { resolve() });
        }
        setErrors(errors || {});
        setState({ isCustomerCreateBtnLoading: true });
        let data = await addCustomer();
        if (data.status.code === 260029) {
            setState({
                isCustomerCreateBtnLoading: false,
                isErrorMsg: labelName + " already exist"
            });
        }
        else if (data.status.code === 260031) {
            setState({
                isCustomerCreateBtnLoading: false,
                isErrorMsg: "Given phone number is associated with another " + labelName + ". Kindly enter another phone number."
            });
        }
        else {
            setState({
                isCustomerCreateBtnLoading: false,
                isCustomerCreatedMessage: 'Success'
            });
            (async () => {
                setIsLoading(true);
                const customers = await fetchCustomers();
                setIsLoading(false);
                setCustomers(customers);
                setDefaultCustomers(customers);
            })();
        }
        return new Promise(function (resolve, reject) { resolve() });
    };

    const addCustomer = async () => {
        var customerData = { ...data }
        var reqURL = "api/v1/customer/create";
        var reqOBJ = {
            Request: {
                UserDisplayName: customerData.customerName.trim(),
                FirstName: customerData.customerName.trim()?.split(" ")[0],
                LastName: customerData.customerName.trim()?.split(" ")[1] !== undefined ? customerData.customerName.trim()?.split(" ")[1] : ' ',
                Location: {
                    Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
                    CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
                    Country: Global.getEnvironmetKeyValue("PortalCountryName"),
                },
                ContactInformation: {
                    PhoneNumber: customerData.phonenumber,
                    PhoneNumberCountryCode: "",
                    Email: customerData.email ? customerData.email : (customerData.phonenumber + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace('.', "@"))
                },
                CustomerType: labelName !== 'Corporate' ? "Individual" : "Corporate",
            },
            Flags: {
                validateEmailAndPhone: true,
                UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
                iscmsportalcreated: props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(customerData.email ?? process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"))
            },
        };

        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, (data) => {
                resolve(data);
            });
        });
    };
    return (<React.Fragment>
        <style>{css_Typeahead}</style>
        <div className="form-group customer">
            <label for="customer">{labelName}</label>
            <div className="input-group mb-3">
                <Typeahead
                    disabled={props.isReadOnly}
                    flip={true}
                    emptyLabel={`No ${labelName} found!`}
                    clearButton={!props.isReadOnly}
                    id="asyncTypeaheadControl"
                    isLoading={isLoading}
                    selected={Object.keys(selectedCustomer).length > 0 ? [selectedCustomer] : []}
                    options={customers}
                    onChange={onChange}
                    useCache={false}
                    onInputChange={onInputChange}
                    searchText={"Searching"}
                    promptText="Searching"
                    labelKey={option =>
                        `${option.name ?? (option.firstName + ' ' + (option.lastName ?? ""))}${option.contactInformation?.email ? (' | ' + option.contactInformation?.email) : ''}${option.contactInformation?.phoneNumber ? (' | ' + option.contactInformation?.phoneNumber) : ""}`
                    }
                    placeholder={"Type here to search " + labelName}
                    onSearch={query => {
                        fetchCustomers(query)
                    }}
                    renderMenuItemChildren={(option, props) => (
                        <div>
                            <span className='text-capitalize'>{option.name ?? option.firstName}</span>
                            <small className="pull-right text-lowercase">
                                {option.email} &nbsp;&nbsp;&nbsp;&nbsp;
                                {(option.contactInformation?.phoneNumber ?? option.contactInformation?.phoneNumber ?? "")}</small>
                        </div>
                    )}
                />
                {!props.isReadOnly &&
                    <div className="input-group-append">
                        <AuthorizeComponent title="Customer-list~customer-add-customers"
                            type="button"
                            rolepermissions={props?.userInfo?.rolePermissions ? props?.userInfo?.rolePermissions : null}
                        >
                            <button className="btn btn-primary btn btn-outline-secondary text-white"
                                type="button"
                                onClick={addCustomerPopup}
                            >
                                Add {labelName}
                            </button>
                        </AuthorizeComponent>
                    </div>
                }
            </div>
            {props.errors?.customerName &&
                <small class="alert alert-danger m-0 p-1 d-inline-block">Customer required</small>
            }
        </div>
        {popup.showPopup ? (
            <ModelPopup
                header={popup.popupTitle}
                sizeClass={popup.sizeClass}
                handleHide={closePopup}
                content=<div>
                    {state.isCustomerCreatedMessage
                        ? <div className="row text-center">
                            <div className="col-lg-12">
                                {labelName} created successfully!
                            </div>
                            <div className="col-lg-12">
                                <button className="btn btn-link"
                                    type="button" onClick={() => {
                                        setState({ isCustomerCreateBtnLoading: false, isCustomerCreatedMessage: null, isErrorMsg: '', });
                                        setData({ customerName: "", email: "", phonenumber: "" });
                                        setErrors({});
                                    }} >
                                    Create new customer
                                </button>
                            </div>
                        </div>
                        : <div className="row">
                            <div className="col-lg-12">
                                {renderInput({ label: labelName === "Corporate" ? labelName + " Name *" : "Customer Name* (e.g. Firstname Lastname)", name: "customerName", minlength: 2, maxlength: 50 })}
                            </div>
                            <div className="col-lg-12">
                                {renderContactInput({ label: labelName + " Phone Number *", name: "phonenumber", isDefaultLoad: true, })}
                            </div>
                            <div className="col-lg-12">
                                {renderInput({ label: labelName + " Email", name: "email", minlength: 5, maxlength: 100 })}
                            </div>

                            {state.isErrorMsg &&
                                <div className="col-lg-12">
                                    <small class="alert alert-danger mt-2 p-1 d-inline-block">{state.isErrorMsg}</small>
                                </div>}
                            <div className="col-lg-12 float-right">
                                <button className="btn btn-primary btn btn-outline-secondary text-white ml-3 float-right" type="button" onClick={closePopup}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary btn btn-outline-secondary text-white float-right" type="button" onClick={createCustomer}>
                                    {state.isCustomerCreateBtnLoading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>}
                                    Create {labelName}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            />
        ) : null
        }
    </React.Fragment>);
}
export default CustomerAddSelect;
