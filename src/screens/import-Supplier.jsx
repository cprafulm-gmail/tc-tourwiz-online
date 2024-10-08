import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import XLSX from "xlsx";
import TableLoading from "../components/loading/table-loading"
import moment from "moment";
import * as Global from "../helpers/global";
import { apiRequester } from "../services/requester";
import templateFile from './../assets/templates/Import-Suppliers.xlsx';
import ModelPopup from "../helpers/model";
import { apiRequester_unified_api } from '../services/requester-unified-api';
import { Helmet } from "react-helmet";

class ImportSupplier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            isLoading: false,
            isImportInProcess: false,
            dataErrors: null,
            successRowNum: [],
            errorRowNum: [],
            completedRows: 0,
            importComplete: false,
            fileName: null,
            customerList: null,
            showInstructionPopup: false,
            popupHeader: "",
            popupContent: "",
            isImportLimitExceededFrom: 0,
            maximumRowsallowed: 1000,
            businessList: [],
            currencyList: [],
            StateList: [],
            CountryList: [],
            CityList: [],
        };
    }
    timer = ms => new Promise(res => setTimeout(res, ms));
    getBusinesses = () => {
        const { userInfo: { agentID } } = this.props;
        let reqURL = "reconciliation/supplier/business?providerid=" + agentID;
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = [{ name: "Select", value: "" }]
                for (let field of data.response) {
                    arr.push({ name: field["businessType"] === "Air" ? "Flight" : field["businessType"], value: field["businessTypeId"] })
                }
                this.setState({ businessList: arr });
            }.bind(this),
            "GET"
        );
    }
    getCurrency = () => {
        let reqURL = "reconciliation/supplier/currencies"
        apiRequester_unified_api(
            reqURL,
            {},
            function (data) {
                let arr = [{ name: "Select", value: "" }]
                for (let field of data.response) {
                    arr.push({ name: field["currencyCode"], value: field["currencyCode"] })
                }

                this.setState({ currencyList: arr });
            }.bind(this),
            "GET"
        );
    }
    handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                this.props.history.push(`/Backoffice/${req}`);
            else {
                this.props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            this.props.history.push(`${req}`);
        }
    };
    removeEmpty = (obj) => {
        let objOld = { ...obj };
        Object.keys(obj).forEach(k =>
            (obj[k] && typeof obj[k] === 'object') && this.removeEmpty(obj[k]) ||
            (!obj[k] && obj[k] !== undefined) && delete obj[k]
        );
        return (Object.keys(obj)).length > 0 ? objOld : null;
    };
    handleChange = (e) => {
        e.preventDefault();
        let files = e.target.files;
        if (!files || files.length === 0)
            return;
        let file = files[0];
        const fileExtension = file.name.split(".")
        if (fileExtension && fileExtension.length > 1) {
            const extension = fileExtension[fileExtension.length - 1];
            if (extension.toLowerCase() != "xlsx") {
                this.setState({ fileName: null, error: "Please select XLSX file.", dataErrors: null });
                return;
            }
        }
        var reader = new FileReader();
        this.setState({ fileName: file.name, error: null, dataErrors: null, results: {}, successRowNum: [], errorRowNum: [], importComplete: false });
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            try {
                let data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                let excelData = XLSX.utils.sheet_to_json(ws, {
                    header: 0, defval: null,
                    blankrows: true
                });
                let dataErrors = [];
                //Remove Empty elements
                excelData = excelData.map(item => this.removeEmpty(item)).filter(Boolean);
                let headers = this.get_header_row(ws);
                let isValidHeader = headers.every(function (element, index) { return excelFields.filter(x => x === element).length > 0 });
                let isImportLimitExceededFrom = 0;
                if (!isValidHeader) {
                    dataErrors = { "File": "Invalid content found in file. Please use template file." };
                    excelData = this.state.results;
                }
                else if (excelData && excelData.length > 0) {
                    if (excelData.length > this.state.maximumRowsallowed) {
                        isImportLimitExceededFrom = excelData.length;
                        excelData = excelData.slice(0, this.state.maximumRowsallowed);
                    }
                    dataErrors = this.validateImportData(excelData);
                }
                else {
                    dataErrors = { "File": "No data found in file" };
                    excelData = this.state.results;
                }
                if (excelData.length > 0) {
                    excelData.map((item, index) => {
                        item.rowNum = index + 1
                    })
                }
                this.setState({ results: excelData, isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, dataErrors, isImportLimitExceededFrom })
            } catch (e) {
                this.setState({ results: [], error: "Error while reading file.", isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, isImportLimitExceededFrom: 0 })
            }
        };
        e.target.value = '';
    }

    get_header_row = (sheet) => {
        var headers = [];
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for (C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */

            var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
            if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

            headers.push(hdr);
        }
        return headers;
    }
    validateImportData = (data) => {
        let dataErrors = {};
        const requiredFields = ["business", "suppliername", "contactperson", "email", "country"]
        data.map((row, index) => {
            let nth = this.getNth(index + 1);
            row["sr"] = index;
            for (let [oldKey, value] of Object.entries(row)) {
                let newKey = (oldKey.charAt(0).toLowerCase() + oldKey.slice(1)).split(' ').join('').split('.').join('');

                if (requiredFields.indexOf(oldKey) > -1 && !row[oldKey]) {
                    dataErrors[index + "_" + oldKey] = oldKey + " Required on " + (index + 1) + nth + " row";
                }
                else if (row[oldKey]) {
                    let error = row[oldKey] && this.validateData(oldKey, row[oldKey])
                    if (typeof error === "boolean" && error === true) {
                        dataErrors[index + "_" + oldKey] = "Invalid " + oldKey + " on " + (index + 1) + nth + " row";
                    }
                    else if (typeof error === "string") {
                        dataErrors[index + "_" + oldKey] = error + " on " + (index + 1) + nth + " row";
                    }
                    else if (oldKey === "phonecountrycode" && row[oldKey].toString().indexOf("+") === -1)
                        row[oldKey] = "+" + row[oldKey].toString();
                }
                delete Object.assign(row)[oldKey];
                Object.assign(row, { [newKey]: value });
            }
            row.rowNum = index + 1;

            var c = this.state.CountryList;

            if (row["country"]) {
                row["countryID"] = this.state.CountryList.filter(
                    element =>
                        element.countryName.toLowerCase() === row["country"].toLowerCase()
                )[0].countryID;
            }

            let business = ['package', 'packages',
                'hotel', 'Hotel',
                'hotels', 'Hotels',
                'activity', 'Activity', 'activities', 'Activities',
                'transfers', 'transfer', 'Transfers', 'Transfer',
                'flight', 'flights', 'air', 'Flight', 'Flights', 'Air',
                'Package', 'Packages',
                'Custom', 'Customs',
                'custom', 'customs',
            ]
            if (row.business && business.indexOf(row.business.toLowerCase()) === -1) {
                dataErrors[index + "_business"] = "Invalid business on " + (index + 1) + nth + " row";
            }
            // if (row.business && this.state.businessList.filter(element => element.name.toLowerCase() === row.business.toLowerCase()).length === 0) {
            //     dataErrors[index + "_business"] = "Invalid business on " + (index + 1) + nth + " row";
            // }

        });

        return dataErrors;
    }

    getNth = function (d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
    validateData = (dataItem, value) => {
        let returnValue = false;
        switch (dataItem) {
            case "email":
                returnValue = (!this.validateFormData(value, "email"));
                break;
            case "country":
                returnValue = this.state.CountryList.filter(
                    element =>
                        element.countryName.toLowerCase() === value.toLowerCase()
                );
                returnValue = returnValue.length === 0;
                break;
            case "taxnumber(e.g GST,VAT,IBAN)":
                returnValue = (!this.validateFormData(value, "alpha_numeric_space"))
                break;
            case "suppliername":
            case "address":
            case "city":
            case "country":
            case "taxnumber(e.g GST,VAT,IBAN)":
                returnValue = (!this.validateFormData(value, "special-characters-not-allowed", /[<>]/))
                break;
        }
        return returnValue;
    }
    validateFormData(data, type, options) {
        if (typeof data === "string") data = data.trim();
        let output = false;
        switch (type) {
            case "require":
                output = data !== "";
                break;
            case "require_date":
                output = data !== "" && data !== "0001-01-01T00:00:00";
                break;
            case "require_cotactphone":
                output = data.indexOf("-") > -1 && data.split("-")[1] !== "";
                output = output || (data.indexOf("-") > -1 && data !== "");
                break;
            case "length":
                if (options.min !== undefined && options.max !== undefined)
                    output = data.length >= options.min && data.length <= options.max;
                else if (options.min) output = data.length >= options.min;
                else if (options.max) output = data.length <= options.max;
                else output = false;
                break;
            case "only-numeric":
                output = /^[+]?\d+$/g.test(data);
                break;
            case "numeric":
                output = /^[0-9.]+$/g.test(data);
                break;
            case "alpha_space":
                output = /^[a-zA-Z '\-\_]+$/g.test(data);
                break;
            case "special-characters-not-allowed":
                //Below are not allowed -> need to pass in options parameter
                //Please do not break below combination
                // \-   \[   \]    \\    \/
                //options = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
                //e.g. /[@$]/
                //e.g. /[!@#$%^&]/
                output = options.test(data);
                output = !output;
                break;
            case "alpha_numeric":
                output = /^[a-zA-Z0-9]+$/g.test(data);
                break;
            case "alpha_numeric_space":
                output = /^[a-zA-Z0-9 ]+$/g.test(data);
                break;
            case "email":
                var regxEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                output = regxEmail.test(data);
                break;
            case "contactphone":
                output = data.indexOf("+") === data.lastIndexOf("+");
                output = output && data.indexOf("-") === data.lastIndexOf("-");
                output =
                    output &&
                    data.replace("+", "").replace("-", "").length ===
                    data.replace("+", "").replace("-", "").replace(/\D/g, "").length;
                break;
            case "contactphone_length":
                output =
                    data.indexOf("-") > -1 &&
                    data.split("-")[1].length >= 8 &&
                    data.split("-")[1].length <= 14;
                output = output || (data.indexOf("-") === -1 && data.length >= 8 && data.length <= 14);
                break;
            case "pastdate":
                let dateValue = moment(new Date(data));
                let conditionDate =
                    options.conditionDate === undefined ? new Date() : new Date(options.conditionDate);
                let maxDate = moment(conditionDate.setMonth(conditionDate.getMonth() + options.addMonth));
                output = maxDate.isBefore(dateValue);
                break;
            case "date-format":
                output = true;
                if (output && data.split('-').length !== 3) output = false;
                if (output && data.split('-')[0].length != 4) output = false;
                if (output && (data.split('-')[1].length > 2 || data.split('-')[1].length === 0)) output = false;
                if (output && (data.split('-')[2].length > 2 || data.split('-')[1].length === 0)) output = false;
                if (output && Number.isInteger(data.split('-')[0])) output = false;
                if (output && Number.isInteger(data.split('-')[1])) output = false;
                if (output && Number.isInteger(data.split('-')[2])) output = false;
                if (output && parseInt(data.split('-')[0]) > 2100 || parseInt(data.split('-')[0]) < 1900) output = false;
                if (output && parseInt(data.split('-')[1]) > 12 || parseInt(data.split('-')[1]) < 0) output = false;
                if (output && parseInt(data.split('-')[2]) > 31 || parseInt(data.split('-')[1]) < 0) output = false;
                break;
            default:
                output = false;
                break;
        }
        return output;
    }

    importRecords = async () => {
        this.setState({ showInstructionPopup: false, popupContent: "", popupHeader: "", isImportInProcess: true });
        let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];
        const data = [...this.state.results].filter(x => rowHavingErrors.indexOf(x.sr) === -1);
        // this.setState({ importComplete: true });
        //const data = [...this.state.results];
        let successRowNum = [];
        let errorRowNum = [];

        for (let i = 0; i < data.length; i++) {
            let item = data[i];

            let res = await this.saveSuppliers(item);
            if (res) {
                successRowNum.push(item["rowNum"]);

            } else errorRowNum.push(item["rowNum"]);

            this.updatecompletedRows(item["rowNum"]);
            await this.timer(100);

        }
        this.setState({ successRowNum, errorRowNum, importComplete: true, completedRows: 0, isImportInProcess: false });
    }
    updatecompletedRows = (rowNum) => {
        this.setState({
            completedRows: rowNum
        });
    }
    saveSuppliers = async (item) => {
        const { userInfo: { agentID } } = this.props;
        let reqURL = `reconciliation/supplier/add`;
        let business;

        if (item.business.toLowerCase() === "package" || item.business.toLowerCase() === "packages")
            business = "package";
        if (item.business.toLowerCase() === "hotel" || item.business.toLowerCase() === "hotels")
            business = "hotel";
        if (item.business.toLowerCase() === "activity" || item.business.toLowerCase() === "activities")
            business = "activity";
        if (item.business.toLowerCase() === "transfers" || item.business.toLowerCase() === "transfer")
            business = "transfers";
        if (item.business.toLowerCase() === "flight" || item.business.toLowerCase() === "flights" || item.business.toLowerCase() === "air")
            business = "flight";
        if (item.business.toLowerCase() === "custom" || item.business.toLowerCase() === "customs")
            business = "custom";

        let body = {}
        body["request"] = {
            "BusinessId": this.state.businessList.filter(element => element.name.toLowerCase() === business)[0].value,
            "SupplierName": item.suppliername,
            "ContactPerson": item.contactperson,
            "Email": item.email,
            "CurrencyCode": item.currency,
            "Address": item.address,
            "IsOfflineSupplier": true,
            "Phone": (item.phonecountrycode && item.contactphone ? "+" + (item.phonecountrycode + '-' + item.contactphone) : ""),
            "serviceTaxRegNumber": item["taxnumber(egGST,VAT,IBAN)"],
            "Country": this.state.CountryList.filter(element => element.countryName.toLowerCase() === item.country.toLowerCase())[0].countryID,
            "State": null,
            "City": null,
            "canEdit": true,
            "ServiceFee": null,
            "Discount": null,
            "StateId": "",
            "CityId": "",
            "ProviderId": agentID
        };

        return new Promise(function (resolve, reject) {
            apiRequester_unified_api(reqURL, body, function (data) {
                resolve(data.response.supplierId)
            });
        })
    }
    handleInstructionPopup = () => {
        this.setState({
            showInstructionPopup: !this.state.showInstructionPopup,
            popupContent: this.state.showInstructionPopup ? "" : <div>
                <ul>
                    <li>Kindly select country from given options(dropdown) for country.</li>
                    <li>Kindly select currency from given options(dropdown) for currency.</li>
                    <li>Kindly enter valid data as per given below table for respective fields.</li>
                    <li>
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <table className="table border mt-1 ">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Business</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Hotel</td>
                                            </tr>
                                            <tr>
                                                <td>Flight</td>
                                            </tr>
                                            <tr>
                                                <td>Activity</td>
                                            </tr>
                                            <tr>
                                                <td>Packages</td>
                                            </tr>
                                            <tr>
                                                <td>Transfers</td>
                                            </tr>
                                            <tr>
                                                <td>Custom</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>,

            popupHeader: this.state.showInstructionPopup ? "" : "Import Instructions"
        });
    };

    confirmImport = () => {
        let message = "Are you sure, you wants to import supplier?";
        let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];
        if (rowHavingErrors.length > 0)
            message = `Total ${this.state.results.length - rowHavingErrors.length} valid supplier will be imported from ${this.state.results.length} available in uploaded excel. Are you sure want to import partial records?`;

        this.setState({
            popupSizeClass: rowHavingErrors.length > 0 ? "modal-lg" : "",
            showInstructionPopup: !this.state.showInstructionPopup,
            popupContent: this.state.showInstructionPopup ? "" : (
                <div>
                    <div>{message}</div>
                    <button
                        className="btn btn-primary pull-right m-1 "
                        onClick={() => this.importRecords()}
                    >
                        Yes
                    </button>

                    <button
                        className="btn btn-primary pull-right m-1 "
                        onClick={() => this.setState({ showInstructionPopup: false, popupContent: "", popupHeader: "" })}
                    >
                        No
                    </button>
                </div>
            ),

            popupHeader: "Are you sure ?"
        });
    }
    getCountry = () => {
        const { userInfo: { agentID } } = this.props;
        const reqOBJ = {
            request: {
                providerID: agentID
            }
        };
        let reqURL = "reconciliation/supplier/lookup/country";
        apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {

            resonsedata.response = resonsedata.response.sort((a, b) => (a.countryName > b.countryName) ? 1 : ((b.countryName > a.countryName) ? -1 : 0));
            this.setState({ CountryList: resonsedata.response })
        }.bind(this), "POST");
    }

    componentDidMount() {
        this.getBusinesses();
        this.getCurrency();
        this.getCountry();
    }

    ExcelDateTimeToJSDateTime(val) {
        const utc_days = Math.floor(val - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        const fractional_day = val - Math.floor(val) + 0.0000001;
        let total_seconds = Math.floor(86400 * fractional_day);
        const seconds = total_seconds % 60;
        total_seconds -= seconds;
        const hours = Math.floor(total_seconds / (60 * 60));
        const minutes = Math.floor(total_seconds / 60) % 60;
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
    }

    resetImport = () => {
        this.setState({
            results: [],
            isLoading: false,
            isImportInProcess: false,
            dataErrors: null,
            successRowNum: [],
            errorRowNum: [],
            completedRows: 0,
            importComplete: false,
            fileName: null,
            showInstructionPopup: false,
            popupHeader: "",
            popupContent: "",
            isImportLimitExceededFrom: 0,
            maximumRowsallowed: 1000,
        });
    }

    render() {
        const { results, isLoading, error, fileName, completedRows, importComplete, successRowNum, errorRowNum, dataErrors, isImportInProcess, isImportLimitExceededFrom } = this.state;
        const progress = parseInt(completedRows * 100 / results.length);
        let rowHavingErrors = dataErrors && [...new Set(Object.keys(dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];
        let isShowImportInquiry = !isLoading && results &&
            results.length > 0 && !isImportInProcess && !importComplete && (results?.length ?? 0) !== (rowHavingErrors?.length ?? 0);

        const noOfRecordsToImport = results.length > 0 && [...results].filter(x => rowHavingErrors.indexOf(x.sr) === -1).length;
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Import Suppliers
                        </title>
                    </Helmet>
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            Import Suppliers
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 mt-2">
                                        {!isImportInProcess && !importComplete &&
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input"
                                                    onChange={this.handleChange.bind(this)}
                                                    multiple={false}
                                                    accept={".xlsx"}
                                                    id="customFile" />
                                                <label class="custom-file-label" htmlFor="customFile">
                                                    {fileName && fileName.length > 0 ? fileName : "Select Suppliers XLSX file"}</label>

                                                {error && error.length > 0 &&
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {error}
                                                    </small>
                                                }
                                            </div>
                                        }
                                        {importComplete &&
                                            <button onClick={() => this.resetImport()} className="btn btn-primary">Import Again</button>
                                        }
                                    </div>
                                    <div className="col-lg-3 col-md-6 mt-2">
                                        {isShowImportInquiry &&
                                            /* {!isLoading && results && !isImportInProcess &&
                                                results.length > 0 && !importComplete &&
                                                dataErrors && Object.keys(dataErrors).length === 0 && */
                                            <button onClick={() => this.confirmImport()} className="btn btn-primary">Import Supplier</button>
                                        }
                                    </div>
                                    <div className="col-lg-3 col-md-6 mt-2">
                                        <button className="btn btn-primary float-right">
                                            <a href={templateFile} className="text-white" download={"Import-Suppliers.xlsx"}>Download Template</a>
                                        </button>
                                        <a onClick={this.handleInstructionPopup}>
                                            <SVGIcon
                                                name="info-circle"
                                                width="24"
                                                height="24"
                                                className="mt-2"
                                            ></SVGIcon>
                                        </a>
                                    </div>
                                </div>
                                {isImportLimitExceededFrom > 0 && !isImportInProcess && !importComplete &&
                                    <div className="row">
                                        <div className="col-lg-12 ">
                                            <div class="alert alert-primary mt-2 mb-0" role="alert">
                                                First {noOfRecordsToImport} items have been imported from the uploaded excel file containing {isImportLimitExceededFrom} items.
                                            </div>
                                        </div>
                                    </div>
                                }
                                {(isImportInProcess || completedRows && completedRows > 0) ?
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <div class="progress">
                                                <div class="progress-bar bg-primary" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{completedRows + "/" + noOfRecordsToImport} Processed</div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                {importComplete &&
                                    <div className="row mt-3">
                                        <div className="col-lg-8">
                                            <small className="alert alert-success mt-2 mr-2 mb-0 p-1 d-inline-block">
                                                {successRowNum.length + " supplier(s) imported successfully."}
                                            </small>
                                            {errorRowNum && errorRowNum.length > 0 &&
                                                <small className="alert alert-danger mt-2  mb-0 p-1 d-inline-block">
                                                    {errorRowNum.length + " supplier(s) not imported."}
                                                </small>
                                            }
                                        </div>
                                    </div>
                                }
                                {dataErrors && Object.keys(dataErrors).length > 0 &&
                                    <div className="row">
                                        <div className="col-lg-12 row">
                                            <small className="col-lg-12 alert alert-danger mt-2 mb-0 p-1 d-inline-block m-3">
                                                {Object.keys(dataErrors).map(item => {
                                                    return <ul>
                                                        <li className="mt-1"> {dataErrors[item]}</li>
                                                    </ul>
                                                })}
                                            </small>
                                        </div>
                                    </div>
                                }
                                <div className="row mt-3 small">
                                    <div className="col-lg-12">
                                        <div className="table-responsive">
                                            <table className="table border table-column-width">
                                                <thead className="thead-light">
                                                    <tr>
                                                        {["#", "Business", "Supplier Name", "Contact Person", "Email", "Address", "Contact Phone", "Country", "Currency", "Tax Number (e.g GST,VAT,IBAN)"
                                                        ].map((data, key) => {
                                                            return (<th width={table_column_width[data]} key={key} scope="col">{data}</th>)
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading && (<TableLoading columns={16} />)}
                                                    {
                                                        !isLoading && results &&
                                                        results.length > 0 && results.map((item, i) => {
                                                            let successClass = "";
                                                            if (importComplete) {
                                                                let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
                                                                    return Number(item.split('_')[0]);
                                                                }))];

                                                                if (rowHavingErrors.indexOf(item["sr"]) === -1) {
                                                                    successClass = "alert-success";
                                                                }
                                                            }
                                                            return (<tr className={successClass}>
                                                                <th scope="row">{item.rowNum}</th>
                                                                <td className={dataErrors[i + "_business"] ? "alert-danger" : ""}>{item.business}</td>
                                                                <td className={dataErrors[i + "_suppliername"] ? "alert-danger" : ""}>{item["suppliername"]}</td>
                                                                <td className={dataErrors[i + "_contactperson"] ? "alert-danger" : ""}>{item["contactperson"]}</td>
                                                                <td className={dataErrors[i + "_email"] ? "alert-danger" : ""}>{item["email"]}</td>
                                                                <td className={dataErrors[i + "_address"] ? "alert-danger" : ""}>{item["address"]}</td>
                                                                <td className={dataErrors[i + "_phonecountrycode"] || dataErrors[i + "_contactphone"] ? "alert-danger" : ""}>{item["phonecountrycode"] && item["contactphone"] ? item["phonecountrycode"] + "-" + item["contactphone"] : ""}</td>
                                                                <td className={dataErrors[i + "_country"] ? "alert-danger" : ""}>{item["country"]}</td>
                                                                <td className={dataErrors[i + "_currency"] ? "alert-danger" : ""}>{item["currency"]}</td>
                                                                <td className={dataErrors[i + "_taxnumber(egGST,VAT,IBAN)"] ? "alert-danger" : ""}>{item["taxnumber(egGST,VAT,IBAN)"]}</td>
                                                            </tr>)
                                                        })}
                                                    {
                                                        !isLoading && results &&
                                                        results.length === 0 &&
                                                        <tr>
                                                            <td className="text-center" colSpan={10}>No Supplier(s) found.</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showInstructionPopup ? (
                    <ModelPopup
                        sizeClass={this.state.popupSizeClass ?? "modal-lg"}
                        header={"Import Instructions"}
                        content={this.state.popupContent}
                        handleHide={this.handleInstructionPopup}
                    />
                ) : null}
            </div>
        )
    }
}

const table_column_width = {
    "#": 30,
    "Business": 100,
    "Supplier Name": 100,
    "Contact Person": 100,
    "Email": 200,
    "Address": 200,
    "Contact Phone": 150,
    "Country": 100,
    "Currency": 100,
    "Tax Number (e.g GST,VAT,IBAN)": 125,
}

const excelFields = [
    "business",
    "suppliername",
    "contactperson",
    "email",
    "address",
    "phonecountrycode",
    "contactphone",
    "country",
    "currency",
    "taxnumber(e.g GST,VAT,IBAN)"
]
export default ImportSupplier;