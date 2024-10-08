import React, { Component } from 'react'
import GetInquiryEmail from '../components/quotation/inquiry-email-form'
import { renderToString } from 'react-dom/server'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import XLSX from "xlsx";
import TableLoading from "../components/loading/table-loading"
import moment from "moment";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester } from "../services/requester";
import ModelPopup from "../helpers/model";
import * as Global from "../helpers/global";
import DateComp from "../helpers/date";
import QuotationMenuCustomer from '../components/quotation/quotation-menu-customer';
import Amount from "../helpers/amount";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import Form from '../components/common/form';
import { apiRequester_unified_api } from '../services/requester-unified-api';
import { Helmet } from "react-helmet";

class ImportInquiries extends Form {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            customerList: null,
            isLoading: false,
            dataErrors: {},
            successRowNum: [],
            errorRowNum: [],
            completedRows: 0,
            importComplete: false,
            importProcessing: false,
            fileName: null,
            showInstructionPopup: false,
            isImportLimitExceededFrom: 0,
            maximumRowsallowed: 1000,
            popupSizeClass: "",
            popupHeader: "",
            popupContent: ""
        };
    }
    timer = ms => new Promise(res => setTimeout(res, ms));
    /* getAuthToken = () => {
        var reqURL = "api/v1/user/token";
        var reqOBJ = {};
        apiRequester(reqURL, reqOBJ, (data) => {
            localStorage.setItem("userToken", data.response);
        });
    }; */
    componentDidMount() {
        if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~inquiries-import-inquiries")) {
            this.props.history.push('/');
        }
        //this.getAuthToken();
        this.getCoTravelers();
    }
    getCoTravelers = () => {
        this.setState({
            isLoading: true,
        });

        var reqURL = "reconciliation/customer/list?pagenumber=1&pagesize=100000&createdfromdate=2020-01-01&createdtodate=2050-01-01";
        var reqOBJ = {
            Request: "",
        };

        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                data.response.data = data.response.map(item => {
                    if (item.contactInformation.phoneNumber.indexOf('-') > -1) {
                        item.contactInformation.phoneNumberCountryCode = item.contactInformation.phoneNumber.split('-')[0]
                        item.contactInformation.phoneNumber = item.contactInformation.phoneNumber.split('-')[1]
                    }
                    return item;
                })
                this.setState({
                    isLoading: false,
                    customerList: data.response
                });
            }.bind(this), "GET"
        );

        /*
        var reqURL = "api/v1/cotraveler/details";
        var reqOBJ = {
            Request: "",
        };

        reqURL = "api/v1/customers";
        reqOBJ = {
            Request: {
                PageInfoIndex: [
                    {
                        Type: "default",
                        Item: {
                            PageLength: "10000",
                            CurrentPage: "0",
                        },
                    },
                ],
            },
        };

        apiRequester(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({
                    isLoading: false,
                    customerList: data.response
                });
            }.bind(this)
        );
        */
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
                this.setState({ fileName: null, error: "Please select XLSX file.", dataErrors: {} });
                return;
            }
        }

        var reader = new FileReader();
        this.setState({ fileName: file.name, error: null, dataErrors: {} });
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            try {
                let data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                let excelData = XLSX.utils.sheet_to_json(ws, { blankrows: false });
                let dataErrors = {};
                let headers = this.get_header_row(ws);
                let isValidHeader = headers.every(function (element, index) { return excelFields.filter(x => x === element).length > 0 });
                let isImportLimitExceededFrom = 0;

                if (!isValidHeader) {
                    dataErrors = { "File": "Invalid content found in file. Please use template file." }
                    excelData = [];
                }
                else if (excelData.length > 0) {
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
                excelData.map((item, index) => {
                    item.rowNum = index + 1
                })
                this.setState({ results: excelData, isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, dataErrors, isImportLimitExceededFrom })
            } catch (e) {
                this.setState({ results: [], error: "Error while reading file.", isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, importProcessing: false, isImportLimitExceededFrom: 0 })
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

        var DisplayDateFormate = Global.getEnvironmetKeyValue("DisplayDateFormate");
        let dataErrors = {};
        let tripCounter = 0;
        let tripItemCounter = 0;
        let field = "";
        data.map((row, index) => {
            row = this.removeUnwantedDatefromImport(row);
            let nth = "";
            let tripCounter = index + 1;
            nth = this.getNth(tripCounter);
            row["Sr"] = tripCounter;
            field = 'Inquiry Type';
            if (row[field]) {
                let business = ['package', 'packages',
                    'hotel', 'Hotel',
                    'activity', 'Activity', 'activities', 'Activities',
                    'transfers', 'transfer', 'Transfers', 'Transfer',
                    'flight', 'flights', 'air', 'Flight', 'Flights', 'Air',
                    'Package', 'Packages',
                    'Visa', 'visa',
                    'Rail', 'rail',
                    'Forex', 'forex',
                    'Bus', 'bus',
                    'Rent a Car', 'rent a car']
                if (business.indexOf(row[field].toLowerCase()) === -1) {
                    dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " inquiry";
                } else if (row[field].toLowerCase() === "flight" || row[field].toLowerCase() === "flights" || row[field].toLowerCase() === "air") {
                    row[field] = "air";
                }
                if (!this.validateData(field, row[field])) {
                    dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";
                }
            }

            field = 'Customer Name';
            if (!row[field]) {
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
            }
            else if (!this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Invalid Customer Name on " + (tripCounter) + nth + " inquiry";

            field = 'Email';
            // if (!row[field])
            //     row[field] = row["Contact Phone"] + process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@");
            if (row[field] && this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Invalid email on " + (tripCounter) + nth + " inquiry";
            //else if(this.state.customerList.data.filter(x=>x.contactInformation.email === row['Email']).length === 0 )
            //    dataErrors[tripCounter + "_" + field] = field +" not registered for " + (tripCounter) + nth + " trip. Kindly add customer first.";

            field = 'Contact Phone';
            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
            else if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " inquiry";
            /* else if (this.state.customerList.data.filter(x => x.contactInformation.email !== row['Email']).length === 0
                && this.state.customerList.data.filter(x =>
                    x.contactInformation.phoneNumberCountryCode.replace('+', '') + "-" + x.contactInformation.phoneNumber
                    === row['Contact Phone'].replace('+', '')
                ).length > 0)
                dataErrors[tripCounter + "_" + field] = field + " already register with another customer for " + (tripCounter) + nth + " trip. Kindly add customer first."; */
            else
                row[field] = row[field].indexOf('+') === -1 ? '+' + row[field] : row[field];

            if (!dataErrors[tripCounter + "_Eamil"] && !dataErrors[tripCounter + "_Contact Phone"]) {
                let isPhoneExist = this.state.customerList.data.filter(x => x.contactInformation?.phoneNumberCountryCode && x.contactInformation?.phoneNumber &&
                    x.contactInformation?.phoneNumberCountryCode?.replace('+', '') + "-" + x.contactInformation?.phoneNumber
                    === row['Contact Phone'].replace('+', '')).length > 0;
                if (isPhoneExist && row['Email']) {
                    if (this.state.customerList.data.filter(x => x.contactInformation?.phoneNumberCountryCode && x.contactInformation?.phoneNumber &&
                        x.contactInformation?.phoneNumberCountryCode?.replace('+', '') + "-" + x.contactInformation?.phoneNumber
                        === row['Contact Phone'].replace('+', '')
                        && x.contactInformation.email.replace('+', '') !== row['Email'].replace('+', '')).length > 0) {
                        if (this.state.customerList.data.filter(x => x.contactInformation.email == row['Email']).length === 0)
                            dataErrors[tripCounter + "_Contact Phone"] = "Phone number is associated with another email address" + " on " + (tripCounter) + nth + " inquiry";
                        else
                            dataErrors[tripCounter + "_Email"] = "Email address associated with another phone number" + " on " + (tripCounter) + nth + " inquiry";
                    }

                }
                else if (this.state.customerList.data.filter(x => x.contactInformation.email !== "" && x.contactInformation.email === row['Email']).length > 0)
                    dataErrors[tripCounter + "_Email"] = "Email Associated with another phone number" + " on " + (tripCounter) + nth + " inquiry";
            }

            if (row['Inquiry Type'].toLowerCase() === 'packages')
                field = 'Package Name';
            if (row['Inquiry Type'].toLowerCase() === 'air')
                field = 'Sector';
            if (row['Inquiry Type'].toLowerCase() === 'hotel')
                field = 'Hotel Name/Location/City';
            if (row['Inquiry Type'].toLowerCase() === 'activity')
                field = 'Activity/SIGHTEEINGS/Type';
            if (row['Inquiry Type'].toLowerCase() === 'transfers' || row['Inquiry Type'].toLowerCase() === 'rent a car')
                field = 'Pick Up Location';

            if (row['Inquiry Type'].toLowerCase() === 'visa')
                field = 'Country';
            if (row['Inquiry Type'].toLowerCase() === 'rail' || row['Inquiry Type'].toLowerCase() === 'bus')
                field = 'Destination From';

            if (row['Inquiry Type'].toLowerCase() === 'forex')
                field = 'Currency Type';

            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
            else if (!this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            if (row['Inquiry Type'].toLowerCase() === 'transfers' || row['Inquiry Type'].toLowerCase() === 'rent a car')
                field = 'Drop Off Location';
            if (row['Inquiry Type'].toLowerCase() === 'rail' || row['Inquiry Type'].toLowerCase() === 'bus')
                field = 'Destination To';

            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
            else if (!this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";


            field = 'Status';
            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
            else if (!this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = 'Inquiry Source';
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = 'Referred By';
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = 'Social Media';
            if (row['Inquiry Source'] === "Social Media" && row[field] !== "Google" && row[field] !== 'Facebook' && row[field] !== 'Instagram' && row[field] !== 'LinkedIn') {
                dataErrors[tripCounter + "_" + field] = "Please enter a social media type as 'Instagram' or 'Facebook' or 'Google' or 'LinkedIn'";
            }
            if (row[field] && !this.validateData(field, row[field])) {
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";
            }

            field = 'Trip Type';
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = 'Booking For Source';
            if (!row[field] || row[field] === '') {
                row[field] = 'Individual';
            }
            else if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = 'Start Date';

            let StartDate = this.getMomentDate(row[field]);
            if (StartDate) {
                row[field] = StartDate.format('YYYY-MM-DD');
            }
            if (row['Inquiry Type'].toLowerCase() === 'package')
                field = 'Start Date';
            if (row['Inquiry Type'].toLowerCase() === 'air' || row['Inquiry Type'].toLowerCase() === 'rail' || row['Inquiry Type'].toLowerCase() === 'bus')
                field = 'Departure Date';
            if (row['Inquiry Type'].toLowerCase() === 'hotel')
                field = 'Check In';
            if (row['Inquiry Type'].toLowerCase() === 'activity')
                field = 'Start Date';
            if (row['Inquiry Type'].toLowerCase() === 'transfers' || row['Inquiry Type'].toLowerCase() === 'rent a car')
                field = 'Pick Up Date';
            if (row['Inquiry Type'].toLowerCase() === 'visa' || row['Inquiry Type'].toLowerCase() === 'forex')
                field = 'Travel Date';

            StartDate = this.getMomentDate(row[field]);
            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
            else if (StartDate) {
                row[field] = StartDate.format('YYYY-MM-DD');
                if (row['Inquiry Type'].toLowerCase() === 'hotel') {
                    let durationdays = (parseInt(row["Duration"]) + 1);
                    row['End Date'] = StartDate.add(durationdays, 'D').format('YYYY-MM-DD');
                }
                else
                    row['End Date'] = StartDate.add(5, 'D').format('YYYY-MM-DD');
            }
            else if (row[field] && this.validateData(field, row[field])) {
                dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
            }


            if (row['Inquiry Type'].toLowerCase() === 'air' || row['Inquiry Type'].toLowerCase() === 'rail' || row['Inquiry Type'].toLowerCase() === 'bus') {
                field = 'Arrival Date';
                if (!row[field]) {
                    dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
                }
                else if (this.getMomentDate(row[field])) {
                    row[field] = this.getMomentDate(row[field]);
                }
            }

            field = 'Followup Date';
            let FollowupDate = this.getMomentDate(row[field]);
            if (!row[field])
                dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
            else if (!FollowupDate) {
                dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
            }
            else if (FollowupDate) {
                row[field] = FollowupDate.format('YYYY-MM-DD');
            }

            field = "Send Email?"
            if (row[field] && row[field].toLowerCase() !== "yes" && row[field].toLowerCase() !== "no")
                dataErrors[tripCounter + "_" + field] = "Invalid Send Email? on " + (tripCounter) + nth + " inquiry";

            field = "Budget";
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Decimal data required for " + field + " on " + (tripCounter) + nth + " inquiry";

            field = "Adults";
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Numeric data required for " + field + " on " + (tripCounter) + nth + " inquiry";
            if (row[field] && !this.validateFormData(row[field], "length", { min: 0, max: 2 }))
                dataErrors[tripCounter + "_" + field] = field + " count must be between 0 to 99 on " + (tripCounter) + nth + " inquiry";

            field = "Children";
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Numeric data required for " + field + " on " + (tripCounter) + nth + " inquiry";
            if (row[field] && !this.validateFormData(row[field], "length", { min: 0, max: 2 }))
                dataErrors[tripCounter + "_" + field] = field + " count must be between 0 to 99 on " + (tripCounter) + nth + " inquiry";

            field = "Infant";
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "Numeric data required for " + field + " on " + (tripCounter) + nth + " inquiry";
            if (row[field] && !this.validateFormData(row[field], "length", { min: 0, max: 2 }))
                dataErrors[tripCounter + "_" + field] = field + " count must be between 0 to 99 on " + (tripCounter) + nth + " inquiry";

            field = "Other Requirements";
            if (row[field] && !this.validateData(field, row[field]))
                dataErrors[tripCounter + "_" + field] = "< and > characters not allowed for " + field + " on " + (tripCounter) + nth + " inquiry";

            if (row['Inquiry Type'].toLowerCase() !== 'bus' && row['Inquiry Type'].toLowerCase() !== 'rent a car' && row['Inquiry Type'].toLowerCase() !== 'forex' && row['Inquiry Type'].toLowerCase() !== 'air' && row['Inquiry Type'].toLowerCase() !== 'transfers' && row['Inquiry Type'].toLowerCase() !== 'rail') {
                field = "Duration";
                if (row[field] && parseInt(row[field]) < 0) {
                    dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
                }
                else if (!row[field]) {
                    dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " inquiry";
                }
            }
            else if (row[field] && !this.validateData(field, row[field])) {
                dataErrors[tripCounter + "_" + field] = "Numeric data required for " + field + " on " + (tripCounter) + nth + " inquiry";
            }
            else if (row[field] && parseInt(row[field]) <= 0) {
                dataErrors[tripCounter + "_" + field] = field + "must be greater than zero on " + (tripCounter) + nth + " inquiry";
            }
            let OtherRecords = data.filter(x => x !== row);

            if (row.Email) {
                if (this.state.customerList.data.filter(x => x.contactInformation.email.replace('+', '') === row['Email'].replace('+', '')).length === 0) {
                    let DuplicateEmail = OtherRecords.filter(x => x.Email && x.Email.replace('+', '') == row.Email.replace('+', ''));
                    if (DuplicateEmail.length > 0)
                        dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Contact Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry, New customer will be added with " + row["Contact Phone"];
                    else if (OtherRecords.filter(x => x["Contact Phone"] && row["Contact Phone"] && x["Contact Phone"].replace('+', '') === row["Contact Phone"].replace('+', '')
                        && x.Email && x.Email.replace('+', '') != row.Email.replace('+', '')).length > 0) {
                        dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Contact Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry, New customer will be added with " + row["Contact Phone"];
                    }
                }

                //let b = OtherRecords.filter(x => x["Contact Phone"].replace('+', '') === row["Contact Phone"].replace('+', ''));
                //let c = b.filter(x => x.Email.replace('+', '') !== row.Email.replace('+', '') && x.Email !== '');
            }
            /* else if (OtherRecords.filter(x => x.Email && x["Contact Phone"] && row["Contact Phone"] && x["Contact Phone"].replace('+', '') === row["Contact Phone"].replace('+', '')).length > 0) {
                 dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Contact Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry";
             } */
        });
        return dataErrors;
    }
    removeUnwantedDatefromImport = (row) => {
        let constObj = [];
        switch (row['Inquiry Type'].toLowerCase()) {
            case 'hotel': constObj = hotelFields; break;
            case 'package': constObj = packageFields; break;
            case 'packages': constObj = packageFields; break;
            case 'activity': constObj = activityFields; break;
            case 'activities': constObj = activityFields; break;
            case 'transfers': constObj = transferFields; break;
            case 'transfer': constObj = transferFields; break;
            case 'flight': constObj = flightFields; break;
            case 'flights': constObj = flightFields; break;
            case 'air': constObj = flightFields; break;
            case 'visa': constObj = visaFields; break;
            case 'rail': constObj = railFields; break;
            case 'bus': constObj = busFields; break;
            case 'forex': constObj = forexFields; break;
            case 'rent a car': constObj = rentAcarFields; break;
        }
        Object.keys(row).map(item => {
            if (constObj.indexOf(item) === -1) {
                row[item] = '';
            }
        })
        return row;
    }
    getMomentDate(dateString, DisplayDateFormate) {
        if (!DisplayDateFormate)
            DisplayDateFormate = 'YYYY-MM-DD'; //Global.getEnvironmetKeyValue("DisplayDateFormate");
        let StartDate = undefined;
        if (typeof dateString === "number" && Number(dateString))
            StartDate = moment(this.ExcelDateTimeToJSDateTime(Number(dateString)));
        else if (moment(dateString, DisplayDateFormate).isValid())
            StartDate = moment(dateString, DisplayDateFormate);
        else if (moment(dateString, 'YYYY/MM/DD').isValid())
            StartDate = moment(dateString, 'YYYY/MM/DD');
        return StartDate;
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

    validateData = (dataItem, value) => {
        let returnValue = true;
        switch (dataItem) {
            case "Email":

                returnValue = (!this.validateFormData(value, "email"))
                break;
            case "Start Date":
            case "Followup Date":
                returnValue = (!this.validateFormData(value, "date-format"))
                break;
            case "Contact Phone":
                value = value.toString()
                if (value.indexOf("-") === -1 || value.indexOf("-") === 0)
                    returnValue = false;
                else if (value.split('-')[0] === "+" || value.split('-')[0] === "")
                    returnValue = false;
                else if (value.split("-").length === 0 || value.split("-").length > 2)
                    returnValue = false;
                else if (value.indexOf("+").length === -1 || value.indexOf("-").length > 2)
                    returnValue = false;
                else if (isNaN(Number(value.split('-')[0])) || isNaN(Number(value.split('-')[1])))
                    returnValue = false;
                else if (!this.validateFormData(value, "phonenumber"))
                    returnValue = false;
                break;
            case "Budget":
                returnValue = this.validateFormData(value, "numeric");
                break;
            case "Adults":
            case "Children":
            case "Infant":
                returnValue = this.validateFormData(value, "only-numeric");
                break;
            case "Customer Name":
                returnValue = this.validateFormData(value, "alpha_space");
                break;
            case "Inquiry Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            // case "Inquiry Title":
            //     returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
            //     break;
            case "Other Requirements":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Status":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Inquiry Source":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Referred By":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Social Media":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Trip Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Booking For Source":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Duration":
                returnValue = this.validateFormData(value, "numeric");
                break;
            case "Package Name":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Package Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Sector":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Hotel Name/Location/City":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Star Rating":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Activity/SIGHTEEINGS/Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Country":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Pick Up Location":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Drop Off Location":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Destination From":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Destination To":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Journey Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Class":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Currency Type":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Category":
                returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
                break;
            case "Departure Date":
            case "Check In":
            case "Travel Date":
            case "Pick Up Date":
            case "Arrival Date":
                returnValue = (!this.validateFormData(value, "date-format"))
                break;
            case "Pick Up Time":
            case "Duration":
                returnValue = this.validateFormData(value, "numeric");
                break;
            case "Amount":
                returnValue = this.validateFormData(value, "numeric");
                break;
            case "Adults":
            case "Children":
            case "Infant":
                returnValue = this.validateFormData(value, "length", { min: 0, max: 2 });
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
            case "require_phoneNumber":
                output = data.indexOf("-") > -1 && data.split("-")[1] !== "";
                output = output || (data.indexOf("-") > -1 && data !== "");
                break;
            case "length":
                data = data.toString();
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
            case "phonenumber":
                output = data.indexOf("+") === data.lastIndexOf("+");
                output = output && data.indexOf("-") === data.lastIndexOf("-");
                output =
                    output &&
                    data.replace("+", "").replace("-", "").length ===
                    data.replace("+", "").replace("-", "").replace(/\D/g, "").length;
                break;
            case "phonenumber_length":
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
                if (output && parseInt(data.split('-')[0]) > 2100 || parseInt(data.split('-')[0]) < 2020) output = false;
                if (output && parseInt(data.split('-')[1]) > 12 || parseInt(data.split('-')[1]) < 0) output = false;
                if (output && parseInt(data.split('-')[2]) > 31 || parseInt(data.split('-')[1]) < 0) output = false;
                break;
            default:
                output = false;
                break;
        }
        return output;
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
    handleReset = () => {
        this.setState({
            results: [],
            customerList: null,
            isLoading: false,
            dataErrors: {},
            successRowNum: [],
            errorRowNum: [],
            completedRows: 0,
            importComplete: false,
            importProcessing: false,
            fileName: null,
            showInstructionPopup: false,
            isImportLimitExceededFrom: 0,
            maximumRowsallowed: 1000,
            popupSizeClass: "",
            popupHeader: "",
            popupContent: ""
        })
        this.getCoTravelers();
    }
    confirmImport = () => {

        let message = "Are you sure, you wants to import Inquiries?";
        let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];
        if (rowHavingErrors.length > 0)
            message = `Total ${this.state.results.length - rowHavingErrors.length} valid Itineraries will be imported from ${this.state.results.length} available in uploaded excel. Are you sure want to import partial records?`;

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
    importRecords = async () => {

        this.setState({ importProcessing: true, showInstructionPopup: false, popupContent: "", popupHeader: "" });
        let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];

        const data = [...this.state.results].filter(x => rowHavingErrors.indexOf(x.Sr) === -1);
        let successRowNum = [];
        let errorRowNum = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let dataErrors = null;

            if (!item["Customer Name"]) {
                dataErrors = "Customer name required for inquiry number " + item["rowNum"];
            }
            // else if (!item["Email"]) {
            //     dataErrors = "Email Address required for inquiry number " + item["rowNum"];
            // }
            else if (!item["Contact Phone"]) {
                dataErrors = "Contact Phone required for inquiry number " + item["rowNum"];
            }
            // else if (!item["Inquiry Title"]) {
            //     dataErrors = "Inquiry Title required for inquiry number " + item["rowNum"];
            // }
            else if (!item["Status"]) {
                dataErrors = "Status required for inquiry number " + item["rowNum"];
            }
            if (dataErrors) {
                errorRowNum.push(item["rowNum"]);
            } else {
                /* if (this.state.customerList.data.filter(x => x.contactInformation.email === item['Email']).length === 0) {
                    let resCustomer = await this.saveCustomers(item);
                    if (resCustomer === 260029)
                        errorRowNum.push(item["rowNum"]);
                    else {
                        let res = await this.saveInquiry(item);
                        if (res) {
                            successRowNum.push(item["rowNum"]);
     
                        } else errorRowNum.push(item["rowNum"]);
                    }
                }
                else { */

                let res = await this.saveInquiry(item);

                if (res) {
                    successRowNum.push(item["rowNum"]);

                } else errorRowNum.push(item["rowNum"]);
                //}
            }
            this.updatecompletedRows(item["rowNum"]);
            await this.timer(100);
        }
        this.setState({ successRowNum, errorRowNum, importComplete: true, completedRows: 0, importProcessing: false }, () => {
            this.downloadFailedRecords();
        });
    }
    saveCustomers = async (item) => {

        var reqURL = "inquiry";
        var reqOBJ = {
            request: {
                userDisplayName: item["Customer Name"],
                firstName: item["Customer Name"].indexOf(" ") === -1 ? item["Customer Name"] : item["Customer Name"].split(' ')[0],
                lastName: item["Customer Name"].indexOf(" ") === -1 ? item["Customer Name"] : item["Customer Name"].split(' ')[1],
                Location: {
                    Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
                    CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
                    Country: Global.getEnvironmetKeyValue("PortalCountryName"),
                },
                ContactInformation: {
                    PhoneNumber: item["Contact Phone"].split('-')[1],
                    PhoneNumberCountryCode: item["Contact Phone"].split('-')[0],
                    Email: item["Email"],
                },
            },
            flags: {
                createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
                createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(item.Email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
            }
        };

        var reqURL = "api/v1/customer/create";

        return new Promise(function (resolve, reject) {
            apiRequester(reqURL, reqOBJ, (data) => {
                resolve(data.status.code)
            });
        })
    }
    downloadFailedRecords = () => {
        const { results, errorRowNum } = { ...this.state };
        if (errorRowNum && errorRowNum.length > 0) {
            const failedRecords = results.filter((x) => { return errorRowNum.indexOf(x.rowNum) > -1 });
            let records = [];
            failedRecords.map((x) => {
                records.push({
                    "Inquiry Type": x["Inquiry Type"],
                    "Customer Name": x["Customer Name"],
                    "Email": x["Email"],
                    "Priority": x["Priority"],
                    "Contact Phone": x["Contact Phone"],
                    "Status": x["Status"],
                    "Inquiry Source": x["Inquiry Source"],
                    "Referred By": x["Referred By"],
                    "Social Media": x["Social Media"],
                    "Trip Type": x["Trip Type"],
                    "Booking For Source": x["Booking For Source"],
                    "Start Date": x["Start Date"],
                    "Duration": x["Duration"],
                    "Followup Date": x["Followup Date"],
                    "Followup Time": x["Followup Time"],
                    "Budget": x["Budget"],
                    "Adults": x["Adults"],
                    "Children": x["Children"],
                    "Infant": x["Infant"],
                    "Other Requirements": x["Other Requirements"],
                    "Send Email?": x["Send Email?"],
                    "Package Name": x["Package Name"],
                    "Package Type": x["Package Type"],
                    "Sector": x["Sector"],
                    "Hotel Name/Location/City": x["Hotel Name/Location/City"],
                    "Star Rating": x["Star Rating"],
                    "Activity/SIGHTEEINGS/Type": x["Activity/SIGHTEEINGS/Type"],
                    "Country": x["Country"],
                    "Pick Up Location": x["Pick Up Location"],
                    "Drop Off Location": x["Drop Off Location"],
                    "Destination From": x["Destination From"],
                    "Destination To": x["Destination To"],
                    "Journey Type": x["Journey Type"],
                    "Class": x["Class"],
                    "Currency Type": x["Currency Type"],
                    "Category": x["Category"],
                    "Departure Date": x["Departure Date"],
                    "Check In": x["Check In"],
                    "Travel Date": x["Travel Date"],
                    "Pick Up Date": x["Pick Up Date"],
                    "Arrival Date": x["Arrival Date"],
                    "Duration": x["Duration"],
                    "Pick Up Time": x["Pick Up Time"],
                    "Amount": x["Amount"]
                });
            })
            const workbook1 = XLSX.utils.json_to_sheet(records);
            workbook1['!cols'] = [{ wpx: 125 }, { wpx: 125 }, { wpx: 200 }, { wpx: 125 }, { wpx: 125 }, { wpx: 150 },
            { wpx: 100 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 80 }, { wpx: 100 }, { wpx: 100 }, { wpx: 80 },
            { wpx: 80 }, { wpx: 80 }, { wpx: 100 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
            { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
            { wpx: 150 }];
            const workbook = {
                SheetNames: ['Inquiries'],
                Sheets: {
                    'Inquiries': workbook1
                }
            };
            return XLSX.writeFile(workbook, `Failed_Inquiries_Records.xlsx`);
        }
    }
    updatecompletedRows = (rowNum) => {
        this.setState({
            completedRows: rowNum
        });
    }
    saveInquiry = async (item) => {


        let startDate = item["Inquiry Type"].toLowerCase() === "air" ? item["Departure Date"]
            : item["Inquiry Type"].toLowerCase() === "hotel" ? item["Check In"]
                : item["Inquiry Type"].toLowerCase() === "visa" ? item["Travel Date"]
                    : item["Inquiry Type"].toLowerCase() === "transfers" ? item["Pick Up Date"]
                        : item["Inquiry Type"].toLowerCase() === "rail" ? item["Departure Date"]
                            : item["Inquiry Type"].toLowerCase() === "forex" ? item["Travel Date"]
                                : item["Inquiry Type"].toLowerCase() === "bus" ? item["Departure Date"]
                                    : item["Inquiry Type"].toLowerCase() === "rent a car" ? item["Pick Up Date"] : item["Start Date"];
        if (Number(item["Duration"]) === 0) {
            item["Duration"] = 0;
        }
        else {
            item["Duration"] = item["Duration"] || 4;
        }
        if (item["Inquiry Type"].toLowerCase() === 'air' || item["Inquiry Type"].toLowerCase() === 'rail' || item["Inquiry Type"].toLowerCase() === 'bus') {
            item["Duration"] = this.GetDuration(startDate, item["End Date"]);
        }

        if (item["Inquiry Type"].toLowerCase() !== 'air' && item["Inquiry Type"].toLowerCase() !== 'air' && item["Inquiry Type"].toLowerCase() !== 'rail' && item["Inquiry Type"].toLowerCase() !== 'bus')
            item["End Date"] = moment(startDate).add((Number(item["Duration"]) > 0 ? Number(item["Duration"]) - 1 : Number(item["Duration"])), "days").format("YYYY-MM-DD");

        if (item["Inquiry Type"].toLowerCase() === 'air' || item["Inquiry Type"].toLowerCase() === 'rail' || item["Inquiry Type"].toLowerCase() === 'bus')
            item["End Date"] = moment(startDate).add((Number(item["Duration"]) > 0 ? Number(item["Duration"]) - 1 : Number(item["Duration"])), "days").add(1, "days").format("YYYY-MM-DD");

        var reqURL = "inquiry";
        /* if (item["Contact Phone"] && !item["Email"])
            item["Email"] = item["Contact Phone"] + process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"); */

        let reqOBJ = {
            "title": item["Inquiry Type"].toLowerCase() === "packages" ? item["Package Name"]
                : item["Inquiry Type"].toLowerCase() === "air" ? item["Sector"]
                    : item["Inquiry Type"].toLowerCase() === "hotel" ? item["Hotel Name/Location/City"]
                        : item["Inquiry Type"].toLowerCase() === "activity" ? item["Activity/SIGHTEEINGS/Type"]
                            : item["Inquiry Type"].toLowerCase() === "visa" ? item["Country"]
                                : item["Inquiry Type"].toLowerCase() === "transfers" ? item["Pick Up Location"]
                                    : item["Inquiry Type"].toLowerCase() === "rail" ? item["Destination From"]
                                        : item["Inquiry Type"].toLowerCase() === "forex" ? item["Currency Type"]
                                            : item["Inquiry Type"].toLowerCase() === "bus" ? item["Destination From"]
                                                : item["Inquiry Type"].toLowerCase() === "rent a car" ? item["Pick Up Location"]
                                                    : item["Inquiry Title"],

            "from": item["Customer Name"],
            "fromEmail": item["Email"] ?? '',
            "data": {
                "customerName": item["Customer Name"],
                "email": item["Email"] ?? '',
                "phone": item["Contact Phone"],
                "destination": item["Inquiry Title"],

                "duration": item["Duration"],
                "month": item["Month"],
                "typetheme": "",
                "budget": item["Inquiry Type"] === "Forex" ? (item["Amount"] && item["Amount"] !== "" ? item["Amount"] : "0.00") : item["Budget"] ? (item["Budget"] !== "" ? item["Budget"] : "0.00") : "0.00",
                "inclusions": "",
                "adults": item["Adults"] ? item["Adults"] : "",
                "children": item["Children"] ? item["Children"] : "",
                "infant": item["Infant"] ? item["Infant"] : "",
                "requirements": item["Other Requirements"] ? item["Other Requirements"] : "",
                "inquirySource": item["Inquiry Source"] ? item["Inquiry Source"] : "",
                "SocialMediaSource": item["Inquiry Source"] === "Social Media" ? item["Social Media"] : "",
                "referenceby": item["Inquiry Source"] === "Social Media" ? item["Social Media"] ? item["Social Media"] : "" : item["Inquiry Source"] === "Referred By" ? item["Referred By"] ? item["Referred By"] : "" : "",
                "tripType": item["Inquiry Type"] === "Visa" ? (item["Category"] ? item["Category"] : "")
                    : item["Trip Type"] ? item["Trip Type"] : "",
                "inquiryType": item["Inquiry Type"] === "flight" || item["Inquiry Type"] === "air" ? "Air" : item["Inquiry Type"],
                "bookingFor": item["Booking For Source"] ? item["Booking For Source"] : "Individual",
                "startDate": item["Inquiry Type"].toLowerCase() === "air" ? item["Departure Date"]
                    : item["Inquiry Type"].toLowerCase() === "hotel" ? item["Check In"]
                        : item["Inquiry Type"].toLowerCase() === "visa" ? item["Travel Date"]
                            : item["Inquiry Type"].toLowerCase() === "transfers" ? item["Pick Up Date"]
                                : item["Inquiry Type"].toLowerCase() === "rail" ? item["Departure Date"]
                                    : item["Inquiry Type"].toLowerCase() === "forex" ? item["Travel Date"]
                                        : item["Inquiry Type"].toLowerCase() === "bus" ? item["Departure Date"]
                                            : item["Inquiry Type"].toLowerCase() === "rent a car" ? item["Pick Up Date"] : item["Start Date"],
                "followupDate": item["Followup Date"],
                "priority": item["Priority"],
                "followup_time": item["Followup Time"] === undefined ? "00:00" : item["Followup Time"],
                "title": item["Inquiry Type"] === "Packages" ? item["Package Name"]
                    : item["Inquiry Type"] === "Air" ? item["Sector"]
                        : item["Inquiry Type"] === "Hotel" ? item["Hotel Name/Location/City"]
                            : item["Inquiry Type"] === "Activity" ? item["Activity/SIGHTEEINGS/Type"]
                                : item["Inquiry Type"] === "Visa" ? item["Country"]
                                    : item["Inquiry Type"] === "Transfers" ? item["Pick Up Location"]
                                        : item["Inquiry Type"] === "Rail" ? item["Destination From"]
                                            : item["Inquiry Type"] === "Forex" ? item["Currency Type"]
                                                : item["Inquiry Type"] === "Bus" ? item["Destination From"]
                                                    : item["Inquiry Type"] === "Rent a Car" ? item["Pick Up Location"]
                                                        : item["Inquiry Title"],
                "endDate": item["End Date"],
                "status": item["Status"],
                "classtype": item["Inquiry Type"] === "Packages" ? item['Package Type'] : item["Inquiry Type"] === "air" ? item["Class"] : item['Star Rating'],
                "journeytype": item['Journey Type'],
                "destinationlocation": (item["Inquiry Type"] === "Transfers" || item["Inquiry Type"] === "Rent a Car")
                    ? item["Drop Off Location"] : item["Destination To"],
                "pickuptime": item["Pick Up Time"]
            },
            "status": item["Status"],
            "startDate": item["Inquiry Type"].toLowerCase() === "air" ? item["Departure Date"]
                : item["Inquiry Type"].toLowerCase() === "hotel" ? item["Check In"]
                    : item["Inquiry Type"].toLowerCase() === "visa" ? item["Travel Date"]
                        : item["Inquiry Type"].toLowerCase() === "transfers" ? item["Pick Up Date"]
                            : item["Inquiry Type"].toLowerCase() === "rail" ? item["Departure Date"]
                                : item["Inquiry Type"].toLowerCase() === "forex" ? item["Travel Date"]
                                    : item["Inquiry Type"].toLowerCase() === "bus" ? item["Departure Date"]
                                        : item["Inquiry Type"].toLowerCase() === "rent a car" ? item["Pick Up Date"] : item["Start Date"],
            "endDate": item["End Date"],
            "followupDate": item["Followup Date"],
            "followup_time": item["Followup Time"],
            "priority": item["Priority"],
            createCustomer_validateEmailAndPhone: false,
            createCustomer_UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
            createCustomer_iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && !(item.Email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
        }

        if (item["Send Email?"] && item["Send Email?"].toLowerCase() === "yes") {

            let emailBody = renderToString(<GetInquiryEmail item={reqOBJ} userInfo={this.props.userInfo} />)
            reqOBJ["isSendEmail"] = "true";
        }
        return new Promise(function (resolve, reject) {

            apiRequester_quotation_api(reqURL, reqOBJ, (data) => {

                resolve(data.status)
            });
        })
    }
    downloadTemplate = () => {

        const template = [{
            "Inquiry Type": "",
            "Customer Name": "",
            "Email": "",
            "Priority": "",
            "Contact Phone": "",
            "Status": "",
            "Inquiry Source": "",
            "Referred By": "",
            "Social Media": "",
            "Trip Type": "",
            "Booking For Source": "",
            "Start Date": "",
            "Duration": "",
            "Followup Date": "",
            "Followup Time": "",
            "Budget": "",
            "Adults": "",
            "Children": "",
            "Infant": "",
            "Other Requirements": "",
            "Send Email?": "",
            "Package Name": "",
            "Package Type": "",
            "Sector": "",
            "Hotel Name/Location/City": "",
            "Star Rating": "",
            "Activity/SIGHTEEINGS/Type": "",
            "Country": "",
            "Pick Up Location": "",
            "Drop Off Location": "",
            "Destination From": "",
            "Destination To": "",
            "Journey Type": "",
            "Class": "",
            "Currency Type": "",
            "Category": "",
            "Departure Date": "",
            "Check In": "",
            "Travel Date": "",
            "Pick Up Date": "",
            "Arrival Date": "",
            "Pick Up Time": "",
            "Amount": ""
        }]
        const workbook1 = XLSX.utils.json_to_sheet(template);
        workbook1['!cols'] = [
            { wpx: 125 }, { wpx: 125 }, { wpx: 200 }, { wpx: 125 }, { wpx: 125 }, { wpx: 150 },
            { wpx: 100 }, { wpx: 150 }, { wpx: 150 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 125 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 100 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 },
            { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
            { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 }, { wpx: 150 },
            { wpx: 150 }];
        const workbook = {
            SheetNames: ['Inquiries'],
            Sheets: {
                'Inquiries': workbook1
            }
        };
        return XLSX.writeFile(workbook, `Inquiries.xlsx`);
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
    handleInstructionPopup = () => {
        this.setState({
            popupSizeClass: "modal-lg",
            showInstructionPopup: !this.state.showInstructionPopup,
            popupHeader: "Import Instructions",
            popupContent: <div>
                <ul>
                    <li>If Referred By is selected as Inquiry Source then value should be entered for Referred By column.</li>
                    <li>If Social Media is selected as Inquiry Source then value should be entered for Social Media column.</li>
                    <li>Budget column value should be numeric. eg. For 10012 INR values should be passed as 10012</li>
                    <li>Adult, Children and Infant column values should be numeric.</li>
                    <li>Please enter Contact Phone with ' (single quote) sign as prefix</li>
                    <li>Contact Phone should start with country code (with "+" prefix) and it should contain "-" in between country code and phone number. eg. +91-1234567890</li>
                    <li>Please enter Start Date and Follow up date in YYYY-MM-DD format with ' (single quote) sign as prefix</li>
                    <li>Please enter date in HH:MM format(24 Hour) with ' (single quote) sign as prefix for all date columns (Followup Time, Pick Up Time)</li>
                    <li>Kindly enter valid data as per given below table for respective fields.</li>
                    <li className="mt-2">
                        <div className="container">
                            <div className="row">
                                <div className="col-6 pl-0">
                                    <table className="table border mt-1 ">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Inquiry Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>hotel</td>
                                            </tr>
                                            <tr>
                                                <td>flight</td>
                                            </tr>
                                            <tr>
                                                <td>activity</td>
                                            </tr>
                                            <tr>
                                                <td>packages</td>
                                            </tr>
                                            <tr>
                                                <td>transfers</td>
                                            </tr>
                                            <tr>
                                                <td>visa</td>
                                            </tr>
                                            <tr>
                                                <td>rail</td>
                                            </tr>
                                            <tr>
                                                <td>forex</td>
                                            </tr>
                                            <tr>
                                                <td>bus</td>
                                            </tr>
                                            <tr>
                                                <td>rent a car</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6 pl-0">
                                    <table className="table border mt-1">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Inquiry Source</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Call Center</td>
                                            </tr>
                                            <tr>
                                                <td>Walkin</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                            </tr>
                                            <tr>
                                                <td>Referred By</td>
                                            </tr>
                                            <tr>
                                                <td>Social Media</td>
                                            </tr>
                                            <tr>
                                                <td>Self</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table border mt-1">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Inquiry Source (Social Media)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Facebook</td>
                                            </tr>
                                            <tr>
                                                <td>Instagram</td>
                                            </tr>
                                            <tr>
                                                <td>Google</td>
                                            </tr>
                                            <tr>
                                                <td>LinkedIn</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6 pl-0">
                                    <table className="table border mt-1">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Trip Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Domestic</td>
                                            </tr>
                                            <tr>
                                                <td>International</td>
                                            </tr>
                                            <tr>
                                                <td>Both</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6 pl-0">
                                    <table className="table border mt-1 ">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Booking For</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Individual</td>
                                            </tr>
                                            <tr>
                                                <td>Corporate</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 pl-0 table-responsive">
                                    <table className="table border mt-1 ">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Columns</th>
                                                <th>Packages</th>
                                                <th>Flight</th>
                                                <th>Hotel</th>
                                                <th>Activity</th>
                                                <th>Visa</th>
                                                <th>Transfers</th>
                                                <th>Rail</th>
                                                <th>Forex</th>
                                                <th>Bus</th>
                                                <th className='text-nowrap'>Rent a Car</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Customer Name</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Priority</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Contact Phone</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Status</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Inquiry Source</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Trip Type</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Booking For Source</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Start Date</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Duration</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Followup Date</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Followup Time</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Budget</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Adults</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Children</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Infant</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Other Requirements</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Referred By</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Social Media</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Send Email?</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Package Name</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Package Type</td>
                                                <td className='text-center' packages="">&#10003;</td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Sector</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Hotel Name/Location/City</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Star Rating</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel="">&#10003;</td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Activity/SIGHTEEINGS/Type</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Country</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Pick Up Location</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Drop Off Location</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Destination From</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Destination To</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Journey Type</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Class</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Currency Type</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Category</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Departure Date</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Check In</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity="">&#10003;</td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Travel Date</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa="">&#10003;</td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Pick Up Date</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Arrival Date</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight="">&#10003;</td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail="">&#10003;</td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus="">&#10003;</td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                            <tr>
                                                <td>Pick Up Time</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers="">&#10003;</td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex=""></td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar="">&#10003;</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td className='text-center' packages=""></td>
                                                <td className='text-center' flight=""></td>
                                                <td className='text-center' hotel=""></td>
                                                <td className='text-center' activity=""></td>
                                                <td className='text-center' visa=""></td>
                                                <td className='text-center' transfers=""></td>
                                                <td className='text-center' rail=""></td>
                                                <td className='text-center' forex="">&#10003;</td>
                                                <td className='text-center' bus=""></td>
                                                <td className='text-center' rentACar=""></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        });
    };
    render() {
        const { results, isLoading, error, fileName, completedRows, importComplete, successRowNum, errorRowNum, dataErrors, importProcessing, isImportLimitExceededFrom } = this.state;
        let progress = parseInt(completedRows * 100 / results.length);
        if (progress === 0) progress = 3;

        let rowHavingErrors = dataErrors && [...new Set(Object.keys(dataErrors).map(item => {
            return Number(item.split('_')[0]);
        }))];
        let isShowImportInquiry = !isLoading && results &&
            results?.length > 0 && !importProcessing && !importComplete && (results?.length ?? 0) !== (rowHavingErrors?.length ?? 0);
        return (
            <div>
                <Helmet>
                    <title>
                        Import Inquiries
                    </title>
                </Helmet>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            Import Inquiries
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            {localStorage.getItem('portalType') === 'B2C'
                                ? <QuotationMenuCustomer handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                                : <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                            }
                        </div>
                        <div className="col-lg-9">
                            <div className="container">
                                <div className="row">
                                    {(!importProcessing && !importComplete) &&
                                        <div className="col-lg-6 col-md-6 mt-2">

                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input"
                                                    onChange={this.handleChange.bind(this)}
                                                    multiple={false}
                                                    accept={".xlsx"}
                                                    id="customFile" />
                                                <label className="custom-file-label" htmlFor="customFile">
                                                    {fileName && fileName.length > 0 ? fileName : "Select Inquiry XLSX file"}</label>

                                                {error && error.length > 0 &&
                                                    <small className="alert alert-danger mt-2 p-1 d-inline-block">
                                                        {error}
                                                    </small>
                                                }
                                            </div>
                                        </div>
                                    }

                                    {isShowImportInquiry ?
                                        <div className="col-lg-3 col-md-6 mt-2">
                                            <button onClick={() => this.confirmImport()} className="btn btn-primary">Import Inquiry</button>
                                        </div>

                                        : importComplete ?
                                            <div className="col-lg-9 col-md-6 mt-2">
                                                <button onClick={() => this.handleReset()} className="btn btn-primary">Import Again</button>
                                            </div>
                                            : <div className={"col-lg-" + (importProcessing ? 9 : 3) + " col-md-6 mt-2"} ></div>
                                    }

                                    <div className="col-lg-3 col-md-6 mt-2">
                                        <a onClick={this.handleInstructionPopup}>
                                            <SVGIcon
                                                name="info-circle"
                                                width="24"
                                                height="24"
                                                className="mt-2"
                                            ></SVGIcon>
                                        </a>
                                        <button onClick={this.downloadTemplate} className="btn btn-primary float-right">Download Template</button>
                                    </div>
                                </div>

                                {importProcessing &&
                                    <div className="row mt-3">
                                        <div className="col-lg-12">
                                            <div className="progress">
                                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{completedRows + "/" + results.length} Processed</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {isImportLimitExceededFrom > 0 && !importProcessing && !importComplete &&
                                    <div className="row">
                                        <div className="col-lg-12 ">
                                            <div className="alert alert-primary mt-2 mb-0" role="alert">
                                                First {results.length} items have been imported from the uploaded excel file containing {isImportLimitExceededFrom} items.
                                            </div>
                                        </div>
                                    </div>
                                }
                                {importComplete &&
                                    <div className="row mt-3">
                                        <div className="col-lg-8">
                                            <small className="alert alert-success mt-2 mr-2 mb-0 p-1 d-inline-block">
                                                {successRowNum.length + " inquiries imported."}
                                            </small>
                                            {errorRowNum && errorRowNum.length > 0 &&
                                                <small className="alert alert-danger mt-2  mb-0 p-1 d-inline-block">
                                                    {errorRowNum.length + " inquiries not imported."}
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
                                                        {
                                                            ["#",
                                                                "Inquiry Type",
                                                                "Customer Name",
                                                                "Email Address",
                                                                "Priority",
                                                                "Contact Phone",
                                                                "Status",
                                                                "Inquiry Source",
                                                                "Referred By",
                                                                "Social Media",
                                                                "Trip Type",
                                                                "Booking For Source",
                                                                "Start Date",
                                                                "Duration",
                                                                "Followup Date",
                                                                "Followup Time",
                                                                "Budget",
                                                                "Adults",
                                                                "Children",
                                                                "Infant",
                                                                "Other Requirements",
                                                                "Send Email?",
                                                                "Package Name",
                                                                "Package Type",
                                                                "Sector",
                                                                "Hotel Name/Location/City",
                                                                "Star Rating",
                                                                "Activity/SIGHTEEINGS/Type",
                                                                "Country",
                                                                "Pick Up Location",
                                                                "Drop Off Location",
                                                                "Destination From",
                                                                "Destination To",
                                                                "Journey Type",
                                                                "Class",
                                                                "Currency Type",
                                                                "Category",
                                                                "Departure Date",
                                                                "Check In",
                                                                "Travel Date",
                                                                "Pick Up Date",
                                                                "Arrival Date",
                                                                "Pick Up Time",
                                                                "Amount"
                                                            ].map((data, index) => {
                                                                return (<th width={table_column_width[data]} scope="col" key={index}>{data}</th>)
                                                            })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {isLoading && (<TableLoading columns={16} />)}
                                                    {
                                                        !isLoading && results &&
                                                        results.length > 0 && results.map((item, index) => {
                                                            let successClass = "";
                                                            if (importComplete) {
                                                                let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
                                                                    return Number(item.split('_')[0]);
                                                                }))];

                                                                if (rowHavingErrors.indexOf(item["Sr"]) === -1) {
                                                                    successClass = "alert-success";
                                                                }
                                                            }
                                                            return (<tr className={successClass}>
                                                                <th scope="row">{item.rowNum}</th>
                                                                <td className={dataErrors[(index + 1) + "_Inquiry Type"] ? "alert-danger" : ""} style={{ "textTransform": "capitalize" }}>{item["Inquiry Type"]?.toLowerCase() === "air" ? "Flight" : item["Inquiry Type"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Customer Name"] ? "alert-danger" : ""}>{item["Customer Name"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Email"] ? "alert-danger" : ""}>{item["Email"] && item["Email"].endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")) ? "" : item["Email"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Priority"] ? "alert-danger" : ""}>{item["Priority"] === "" || item["Priority"] === undefined ? "" : item["Priority"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Contact Phone"] ? "alert-danger" : ""}>{item["Contact Phone"]}</td>
                                                                {/* <td className={dataErrors[(index + 1) + "_Inquiry Title"] ? "alert-danger" : ""}>{item["Inquiry Title"]}</td> */}
                                                                <td className={dataErrors[(index + 1) + "_Status"] ? "alert-danger" : ""}>{item["Status"]}</td>
                                                                <td>{item["Inquiry Source"]}</td>
                                                                <td>{item["Referred By"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Social Media"] ? "alert-danger" : ""}>{item["Social Media"]}</td>
                                                                <td>{item["Trip Type"]}</td>
                                                                <td>{item["Booking For Source"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Start Date"] ? "alert-danger" : ""}>{item["Start Date"] ? DateComp({ date: item["Start Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Duration"] ? "alert-danger" : ""}>{item["Duration"] ? item["Duration"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Followup Date"] ? "alert-danger" : ""}>{DateComp({ date: item["Followup Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}</td>
                                                                <td className={dataErrors[(index + 1) + "_Followup Time"] ? "alert-danger" : ""}>{item["Followup Time"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Budget"] ? "alert-danger" : ""}>{item["Budget"] ? <Amount amount={item["Budget"]} currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} /> : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Adults"] ? "alert-danger" : ""}>{item["Adults"] ? item["Adults"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Children"] ? "alert-danger" : ""}>{item["Children"] ? item["Children"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Infant"] ? "alert-danger" : ""}>{item["Infant"] ? item["Infant"] : ""}</td>
                                                                <td>{item["Other Requirements"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Send Email?"] ? "alert-danger" : ""}>{item["Send Email?"]}</td>
                                                                <td className={dataErrors[(index + 1) + "_Package Name"] ? "alert-danger" : ""}>{item["Package Name"] ? item["Package Name"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Package Type"] ? "alert-danger" : ""}>{item["Package Type"] ? item["Package Type"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Sector"] ? "alert-danger" : ""}>{item["Sector"] ? item["Sector"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Hotel Name/Location/City"] ? "alert-danger" : ""}>{item["Hotel Name/Location/City"] ? item["Hotel Name/Location/City"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Star Rating"] ? "alert-danger" : ""}>{item["Star Rating"] ? item["Star Rating"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Activity/SIGHTEEINGS/Type"] ? "alert-danger" : ""}>{item["Activity/SIGHTEEINGS/Type"] ? item["Activity/SIGHTEEINGS/Type"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Country"] ? "alert-danger" : ""}>{item["Country"] ? item["Country"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Pick Up Location"] ? "alert-danger" : ""}>{item["Pick Up Location"] ? item["Pick Up Location"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Drop Off Location"] ? "alert-danger" : ""}>{item["Drop Off Location"] ? item["Drop Off Location"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Destination From"] ? "alert-danger" : ""}>{item["Destination From"] ? item["Destination From"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Destination To"] ? "alert-danger" : ""}>{item["Destination To"] ? item["Destination To"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Journey Type"] ? "alert-danger" : ""}>{item["Journey Type"] ? item["Journey Type"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Class"] ? "alert-danger" : ""}>{item["Class"] ? item["Class"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Currency Type"] ? "alert-danger" : ""}>{item["Currency Type"] ? item["Currency Type"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Category"] ? "alert-danger" : ""}>{item["Category"] ? item["Category"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Departure Date"] ? "alert-danger" : ""}>{item["Departure Date"] ? DateComp({ date: item["Departure Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Check In"] ? "alert-danger" : ""}>{item["Check In"] ? DateComp({ date: item["Check In"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Travel Date"] ? "alert-danger" : ""}>{item["Travel Date"] ? DateComp({ date: item["Travel Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Pick Up Date"] ? "alert-danger" : ""}>{item["Pick Up Date"] ? DateComp({ date: item["Pick Up Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Arrival Date"] ? "alert-danger" : ""}>{item["Arrival Date"] ? DateComp({ date: item["Arrival Date"], format: Global.getEnvironmetKeyValue("DisplayDateFormate") }) : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Pick Up Time"] ? "alert-danger" : ""}>{item["Pick Up Time"] ? item["Pick Up Time"] : ""}</td>
                                                                <td className={dataErrors[(index + 1) + "_Amount"] ? "alert-danger" : ""}>{item["Amount"] ? <Amount amount={item["Amount"]} currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} /> : ""}</td>
                                                            </tr>)
                                                        })}
                                                    {
                                                        !isLoading && results &&
                                                        results.length === 0 &&
                                                        <tr>
                                                            <td className="text-center" colSpan={6}>No inquiries found.</td>
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
                {
                    this.state.showInstructionPopup ? (
                        <ModelPopup
                            sizeClass={this.state.popupSizeClass ?? "modal-lg"}
                            header={this.state.popupHeader}
                            content={this.state.popupContent}
                            handleHide={this.handleInstructionPopup}
                        />
                    ) : null
                }
            </div>
        )
    }
}

const table_column_width = {
    "#": 50,
    "Inquiry Type": 100,
    "Customer Name": 300,
    "Email Address": 250,
    "Priority": 125,
    "Contact Phone": 200,
    "Status": 200,
    "Inquiry Source": 150,
    "Trip Type": 150,
    "Booking For Source": 150,
    "Start Date": 100,
    "Duration": 100,
    "Followup Date": 100,
    "Followup Time": 100,
    "Budget": 100,
    "Adults": 100,
    "Children": 100,
    "Infant": 100,
    "Other Requirements": 300,
    "Referred By": 200,
    "Social Media": 200,
    "Send Email?": 100,
    "Package Name": 250,
    "Package Type": 250,
    "Sector": 250,
    "Hotel Name/Location/City": 250,
    "Star Rating": 250,
    "Activity/SIGHTEEINGS/Type": 250,
    "Country": 250,
    "Pick Up Location": 250,
    "Drop Off Location": 250,
    "Destination From": 250,
    "Destination To": 250,
    "Journey Type": 250,
    "Class": 250,
    "Currency Type": 250,
    "Category": 150,
    "Departure Date": 100,
    "Check In": 100,
    "Travel Date": 100,
    "Pick Up Date": 100,
    "Arrival Date": 100,
    "Pick Up Time": 100,
    "Amount": 100
}
const excelFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Package Name",
    "Package Type",
    "Sector",
    "Hotel Name/Location/City",
    "Star Rating",
    "Activity/SIGHTEEINGS/Type",
    "Country",
    "Pick Up Location",
    "Drop Off Location",
    "Destination From",
    "Destination To",
    "Journey Type",
    "Class",
    "Currency Type",
    "Category",
    "Departure Date",
    "Check In",
    "Travel Date",
    "Pick Up Date",
    "Arrival Date",
    "Pick Up Time",
    "Amount"
]

const packageFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Package Name",
    "Package Type",
];
const flightFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Sector",
    "Journey Type",
    "Class",
    "Departure Date",
    "Arrival Date",
];
const hotelFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Hotel Name/Location/City",
    "Star Rating",
    "Check In",
]
const activityFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Activity/SIGHTEEINGS/Type",
]
const visaFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Country",
    "Category",
    "Travel Date",
]
const transferFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Pick Up Location",
    "Drop Off Location",
    "Pick Up Date",
    "Pick Up Time",
]
const railFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Destination From",
    "Destination To",
    "Class",
    "Departure Date",
    "Arrival Date",
]
const forexFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Currency Type",
    "Travel Date",
    "Amount",
];
const busFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Destination From",
    "Destination To",
    "Departure Date",
    "Arrival Date",
]
const rentAcarFields = [
    "Inquiry Type",
    "Customer Name",
    "Email",
    "Priority",
    "Contact Phone",
    "Status",
    "Inquiry Source",
    "Trip Type",
    "Booking For Source",
    "Start Date",
    "Duration",
    "Followup Date",
    "Followup Time",
    "Budget",
    "Adults",
    "Children",
    "Infant",
    "Other Requirements",
    "Referred By",
    "Social Media",
    "Send Email?",
    "Pick Up Location",
    "Drop Off Location",
    "Pick Up Date",
    "Pick Up Time",
]
export default ImportInquiries;
