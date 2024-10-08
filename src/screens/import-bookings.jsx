import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import XLSX from "xlsx";
import TableLoading from "../components/loading/table-loading"
import moment from "moment";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import { apiRequester, apiRequesterAsync } from "../services/requester";
import templateFile from './../assets/templates/import-booking.xlsx';
import * as Global from "./../helpers/global";
import * as DropdownList from "../helpers/dropdown-list";
import ModelPopup from "../helpers/model";
import { apiRequester_unified_api } from '../services/requester-unified-api';
import { Helmet } from "react-helmet";

class ImportBookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingObject: [],
      results: {},
      resultsGuests: {},
      isLoading: false,
      dataErrors: null,
      successRowNum: [],
      errorRowNum: [],
      completedRows: 0,
      totalSubRows: 0,
      completedSubRows: 0,
      importComplete: false,
      fileName: null,
      customerList: null,
      isStartProcessing: 'pending',
      processingTripNumber: -1,
      showInstructionPopup: false,
      isImportLimitExceededFrom: 0,
      maximumRowsallowed: 1000,
      popupSizeClass: "",
      popupHeader: "",
      popupContent: "",
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
    //this.getAuthToken();
    this.getCoTravelers();
  }
  getCoTravelers = () => {
    this.setState({
      isLoading: true,
    });

    var reqURL = "api/v1/cotraveler/details";
    var reqOBJ = {
      Request: "",
    };

    reqURL = "reconciliation/customer/list?pagenumber=1&pagesize=100000&createdfromdate=2020-01-01&createdtodate=2050-01-01";
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
        let styleSet = "background-color: green ; color: #ffffff ; font-weight: bold ; padding: 4px ;";
        let data = e.target.result;
        let readedData = XLSX.read(data, { type: 'binary' });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        let excelData = XLSX.utils.sheet_to_json(ws, { blankRows: false });
        let excelDataGuests = [];
        let headersGuest = [];

        if (readedData.SheetNames.length == 1) {
          dataErrors = { "File": "Invalid content found in file. Please use template file." };
          excelData = this.state.results;
        }
        else {
          const wsnameGuests = readedData.SheetNames[1];
          const wsGuests = readedData.Sheets[wsnameGuests];

          var range = XLSX.utils.decode_range(readedData.Sheets[wsnameGuests]['!ref']);
          range.s.r = 14; // 0 == XLSX.utils.decode_col("A")
          range.e.c = 13; // 6 == XLSX.utils.decode_col("G")
          var new_range = XLSX.utils.encode_range(range);
          excelDataGuests = XLSX.utils.sheet_to_json(wsGuests, { blankRows: false, range: new_range });
          headersGuest = this.get_header_row(wsGuests, true);

        }

        let dataErrors = {};
        let headers = this.get_header_row(ws, false);
        let isValidHeader = headers.every(function (element, index) { return excelFields.filter(x => x === element).length > 0 });
        let isValidHeaderGuest = headersGuest.every(function (element, index) { return excelFieldsGuest.filter(x => x === element).length > 0 });
        let isImportLimitExceededFrom = 0;
        if (readedData.SheetNames.length == 1 || !isValidHeader || !isValidHeaderGuest) {
          dataErrors = { "File": "Invalid content found in file. Please use template file." };
          excelData = this.state.results;
        }
        else if (excelData.length > 0) {
          dataErrors = this.validateImportData(excelData, excelDataGuests);
          if (excelData.length > this.state.maximumRowsallowed) {
            let maximumRowsallowed = this.state.maximumRowsallowed;
            isImportLimitExceededFrom = excelData.length;
            if (excelData.filter(x => x["tripCounter"] === excelData[this.state.maximumRowsallowed]["tripCounter"]).length !== excelData[this.state.maximumRowsallowed]["tripItemCounter"])
              maximumRowsallowed = maximumRowsallowed - (excelData.filter(x => x["tripCounter"] === excelData[this.state.maximumRowsallowed]["tripCounter"]).length - excelData[this.state.maximumRowsallowed]["tripItemCounter"] + 1)
            excelData = excelData.slice(0, maximumRowsallowed);
            Object.keys(dataErrors).map(key => {
              if (key.indexOf('_') > -1) {
                if (excelData[excelData.length - 1]["tripCounter"] + 1 < Number(key.split('_')[0]))
                  delete dataErrors[key];
              }
            });
          }
        }
        else {
          dataErrors = { "File": "No data found in file" };
          excelData = this.state.results;
        }
        let bookingObject = [];
        let rowHavingErrors = dataErrors && [...new Set(Object.keys(dataErrors).map(item => {
          return Number(item.split('_')[0]);
        }))];
        const totalTrip = excelData.reduce((sum, item) => sum < item.tripCounter ? item.tripCounter : sum, 0) + 1;
        for (let i = 0; i < totalTrip; i++) {
          let tripCounter = i;
          let excelItineraryObject = excelData.find(x => x["tripCounter"] === tripCounter && x.tripItemCounter === 0);
          let excelItineraryItemObject = excelData.filter(x => x["tripCounter"] === tripCounter);

          if (rowHavingErrors.indexOf(excelItineraryObject.tripCounter + 1) !== -1)
            continue;
          let bookingItemObject = {
            "isBookingSuccess": null,
            "isBookingProcessed": false,
            "irn": "",
            "tripNumber": excelItineraryObject.TripNumber,
            "tripName": excelItineraryObject.TripName,
            "customerName": excelItineraryObject.CustomerName,
            "email": excelItineraryObject.Email,
            "phone": excelItineraryObject.Phone,
            "tripStartDate": excelItineraryObject.TripStartDate,
            "tripEndDate": excelItineraryObject.TripEndDate,
            "duration": excelItineraryObject.Duration,
            items: excelItineraryItemObject.map(item => {
              return {
                "business": item.Business ?? "",
                "fromLocation": item.FromLocation ?? "",
                "toLocation": item.ToLocation ?? "",
                "name": item.Name ?? "",
                "startDate": item.StartDate ?? "",
                "endDate": item.EndDate ?? "",
                "supplierCurrency": item.SupplierCurrency ?? "",
                "conversionRate": item.ConversionRate ?? "",
                "supplierCostPrice": item.SupplierCostPrice ?? "",
                "supplierTax": item.SupplierTax ?? "",
                "costPrice": item.AgentCostPrice ?? "",
                "agentMarkup": item.AgentMarkup ?? "",
                "Discount": item.Discount ?? "",
                "CGST": item.CGST ?? "",
                "SGST": item.SGST ?? "",
                "IGST": item.IGST ?? "",
                "sellPrice": item.SellPrice ?? "",
                "vendor": item.Vendor ?? "",
                "confirmationNumber": item.ConfirmationNumber ?? "",
                "itemType": item.ItemType ?? "",
                "description": item.Description ?? "",
                "bookBefore": item.BookBefore ?? "",
                //"supplierCostPrice": item.SupplierCostPrice ?? "",
                "day": item.Day ?? "",
                //"numberOfRooms": item.NumberOfRooms ?? "",
                "rating": item.Rating ?? "",
                "mealType": item.MealType ?? "",
                "duration": item.Duration ?? "",
                "guests": item.Guests ?? "",
                "noofAdult": item.NoofAdult ?? "",
                "noofChild": item.NoofChild ?? "",
                "noofInfant": item.NoofInfant ?? "",
                "pickupTime": item.PickupTime ?? "",
                "dayDepart": item.DayDepart ?? "",
                "dayDepartEnd": item.DayDepartEnd ?? "",
                "departStartDate": item.DepartStartDate ?? "",
                "departEndDate": item.DepartEndDate ?? "",
                "departStartTime": item.DepartStartTime ?? "",
                "departEndTime": item.DepartEndTime ?? "",
                "departAirlineName": item.DepartAirlineName ?? "",
                "departFlightNumber": item.DepartFlightNumber ?? "",
                "departClass": item.DepartClass ?? "",
                "departStops": item.DepartStops ?? "",
                "departDurationHour": item.DepartDurationHour ?? "",
                "departDurationMinute": item.DepartDurationMinute ?? "",
                "dayReturn": item.DayReturn ?? "",
                "dayReturnEnd": item.DayReturnEnd ?? "",
                "returnStartDate": item.ReturnStartDate ?? "",
                "returnEndDate": item.ReturnEndDate ?? "",
                "returnStartTime": item.ReturnStartTime ?? "",
                "returnEndTime": item.ReturnEndTime ?? "",
                "returnAirlineName": item.ReturnAirlineName ?? "",
                "returnFlightNumber": item.ReturnFlightNumber ?? "",
                "returnClass": item.ReturnClass ?? "",
                "returnStops": item.ReturnStops ?? "",
                "returnDurationHour": item.ReturnDurationHour ?? "",
                "returnDurationMinute": item.ReturnDurationMinute ?? "",
                "roundTrip": item.RoundTrip ?? "",
                "nights": item.Nights ?? "",
                "hotelPaxInfo": (item.Business ?? "").toLowerCase() === "hotel" ? this.getHotelPaxInfoObj(item) : [],
              }
            })
          }
          bookingObject.push(bookingItemObject);
        }
        this.setState({ bookingObject, dataErrors, results: excelData, resultsGuests: excelDataGuests, isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, isImportLimitExceededFrom })
      } catch (e) {
        this.setState({ results: [], error: "Error while reading file.", isLoading: false, successRowNum: [], errorRowNum: [], importComplete: false, isImportLimitExceededFrom: 0 })
      }
    };
    e.target.value = '';
  }
  get_header_row = (sheet, isGuest) => {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    R = isGuest ? 14 : R;
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */

      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

      headers.push(hdr);
    }
    return headers;
  }

  validateImportData = (data, dataGuest) => {
    let styleSet = "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;";
    var DisplayDateFormate = Global.getEnvironmetKeyValue("DisplayDateFormate");
    let dataErrors = {};
    let tripCounter = 0;
    let tripItemCounter = 0;
    let field = "";
    let duplicatePhoneList2 = data.map((item, index) => { return item.Phone ? { index, Phone: item.Phone.replace('+', ''), Email: item.Email ? item.Email.toLowerCase() : "" } : null }).filter(Boolean)
      .map((item, index) => { return { tripCounter: index + 1, ...item } });
    data.map((row, index) => {
      let nth = "";
      let nthItem = "";

      let TripStartDate = this.getMomentDate(row["TripStartDate"]);
      let TripEndDate = this.getMomentDate(row["TripEndDate"]);
      let BookBefore = this.getMomentDate(row["BookBefore"]);
      let StartDate = this.getMomentDate(row["StartDate"]);
      let EndDate = this.getMomentDate(row["EndDate"]);

      if (row["TripNumber"] || row["TripName"] || row["CustomerName"] || row["Phone"] || row["TripStartDate"] || row["TripEndDate"]) {

        tripCounter++;
        tripItemCounter = 1;

        row["tripCounter"] = tripCounter - 1;
        row["tripItemCounter"] = tripItemCounter - 1;
        nth = this.getNth(tripCounter);
        nthItem = this.getNth(tripItemCounter);

        field = 'TripNumber';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        else if (row[field] && this.validateData('Header-' + field, row[field]))
          dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

        field = 'TripName';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + field] = "< and > characters not allowed on " + (tripCounter) + nth + " trip";
        /* field = 'Owner';
        if(!row[field])
            dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip"; */

        field = 'CustomerName';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        else if (row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + field] = "Invalid Customer Name on " + (tripCounter) + nth + " trip";

        field = 'Email';
        if (row[field] && this.validateData('Header-' + field, row[field])) {
          dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
        }

        field = 'Phone';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        else if (row[field] && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
        else
          row[field] = row[field].indexOf('+') === -1 ? '+' + row[field] : row[field];

        if (!dataErrors[tripCounter + "_Eamil"] && !dataErrors[tripCounter + "_Phone"]) {
          if (!row['Email'] &&
            this.state.customerList.data.filter(x => (x.contactInformation.phoneNumberCountryCode ? x.contactInformation.phoneNumberCountryCode.replace('+', '') : "") + "-" + x.contactInformation.phoneNumber === row['Phone'].replace('+', '')).length > 0) {
            //dataErrors[tripCounter + "_" + field] = "Phone number already associate with another customer for " + (tripCounter) + nth + " trip. Kindly update phone number";
          }
          else if (this.state.customerList.data.filter(x => x.contactInformation.email === row['Email']).length === 0 &&
            this.state.customerList.data.filter(x => (x.contactInformation.phoneNumberCountryCode ? x.contactInformation.phoneNumberCountryCode.replace('+', '') : "") + "-" + x.contactInformation.phoneNumber === row['Phone'].replace('+', '')).length > 0) {
            dataErrors[tripCounter + "_" + field] = "Phone number already associate with another customer for " + (tripCounter) + nth + " trip. Kindly update phone number";
          }
          else if (this.state.customerList.data.filter(x => x.contactInformation.email === row['Email']).length > 0 &&
            this.state.customerList.data.filter(x => x.contactInformation.email !== row['Email'] &&
              (x.contactInformation.phoneNumberCountryCode ? x.contactInformation.phoneNumberCountryCode.replace('+', '') : "") + "-" + x.contactInformation.phoneNumber === row['Phone'].replace('+', '')).length > 0) {
            dataErrors[tripCounter + "_" + field] = "Phone number already associate with another customer for " + (tripCounter) + nth + " trip. Kindly update phone number";
          }
        }

        if (!dataErrors[tripCounter + "_Eamil"] && !dataErrors[tripCounter + "_Phone"]) {
          let isPhoneExist = this.state.customerList.data.filter(x =>
            (x.contactInformation.phoneNumberCountryCode ?? "").replace('+', '') + "-" + x.contactInformation.phoneNumber
            === row['Phone'].replace('+', '')).length > 0;
          if (isPhoneExist && row['Email']) {
            if (this.state.customerList.data.filter(x =>
              (x.contactInformation.phoneNumberCountryCode ?? "").replace('+', '') + "-" + x.contactInformation.phoneNumber
              === row['Phone'].replace('+', '')
              && x.contactInformation.email.replace('+', '') !== row['Email'].replace('+', '')).length > 0) {
              if (this.state.customerList.data.filter(x => x.contactInformation.email == row['Email']).length === 0) {
                dataErrors[tripCounter + "_Phone"] = "Phone number is associated with another email address" + " on " + (tripCounter) + nth + " inquiry";
              }
              else {
                dataErrors[tripCounter + "_Email"] = "Email address associated with another phone number" + " on " + (tripCounter) + nth + " inquiry";
              }
            }

          }
          else if (row['Email'] !== '' && this.state.customerList.data.filter(x => x.contactInformation.email === row['Email']).length > 0) {
            dataErrors[tripCounter + "_Email"] = "Email Associated with another phone number" + " on " + (tripCounter) + nth + " inquiry";
          }
        }

        let OtherRecords = duplicatePhoneList2.filter(x => x.tripCounter != tripCounter);

        if (row.Email) {
          if (this.state.customerList.data.filter(x => x.contactInformation.email.replace('+', '') === row['Email'].replace('+', '')).length === 0) {
            let DuplicateEmail = OtherRecords.filter(x => x.Email && x.Email.replace('+', '') == row.Email.replace('+', ''));
            if (DuplicateEmail.length > 0) {
              dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry, New customer will be added with " + row["Phone"];
            }
            else if (OtherRecords.filter(x => x["Phone"] && row["Phone"] && x["Phone"].replace('+', '') === row["Phone"].replace('+', '')
              && x.Email && x.Email.replace('+', '') != row.Email.replace('+', '')).length > 0) {
              dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry, New customer will be added with " + row["Phone"];
            }
          }

          //let b = OtherRecords.filter(x => x["Phone"].replace('+', '') === row["Phone"].replace('+', ''));
          //let c = b.filter(x => x.Email.replace('+', '') !== row.Email.replace('+', '') && x.Email !== '');
        }
        else if (OtherRecords.filter(x => x.Email && x["Phone"] && row["Phone"] && x["Phone"].replace('+', '') === row["Phone"].replace('+', '')).length > 0) {
          let filteredRecords = OtherRecords.filter(x => x.Email && x["Phone"] && row["Phone"] && x["Phone"].replace('+', '') === row["Phone"].replace('+', ''));
          let emailAgainstPhone = this.state.customerList.data.find(x => (x.contactInformation.phoneNumberCountryCode ? x.contactInformation.phoneNumberCountryCode.replace('+', '') : "") + "-" + x.contactInformation.phoneNumber === row['Phone'].replace('+', ''))?.contactInformation.email ?? '';
          if ([...new Set(filteredRecords.map(x => x.Email).filter(Boolean))].length > 1) {
            dataErrors[tripCounter + "_Email"] = "Email Should be unique against phone number(" + row["Phone"] + ")" + " on " + (tripCounter) + nth + " inquiry, New customer will be added with " + row["Phone"];
          }
        }
        field = 'TripStartDate';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        else if (!TripStartDate)
          dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
        else
          row[field] = TripStartDate.format('YYYY-MM-DD');

        field = 'TripEndDate';
        if (!row[field])
          dataErrors[tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip";
        else if (!TripEndDate)
          dataErrors[tripCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";
        else
          row[field] = TripEndDate.format('YYYY-MM-DD');

        if (!dataErrors[tripCounter + "_TripEndDate"] && !dataErrors[tripCounter + "TripStartDate"]) {
          let duration = TripEndDate.diff(TripStartDate, 'days');
          if (duration < 0) {
            field = 'TripStartDate';
            dataErrors[tripCounter + "_" + field] = "Trip Start Date must be before date of Trip End Date on " + (tripCounter) + nth + " trip";
          }
          else
            data[index]["TripDuration"] = duration;
        }
      }
      else {
        nth = this.getNth(tripCounter);
        tripItemCounter++;
        nthItem = this.getNth(tripItemCounter);
        row["tripCounter"] = tripCounter - 1;
        row["tripItemCounter"] = tripItemCounter - 1;
      }

      field = 'Name';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + field] = " < and > characters not allowed on " + (index + 1) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'SupplierCurrency';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + field] = " < and > characters not allowed on " + (index + 1) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ConversionRate';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + field] = "Please enter " + field + " in decimal on " + (index + 1) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'SupplierCostPrice';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + field] = "Please enter " + field + " in decimal on " + (index + 1) + nth + " trip " + tripItemCounter + nthItem + " item";


      field = 'FromLocation';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "< and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ToLocation';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "< and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'Business';
      if (!row[field]) {
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      } else {
        let business = ['hotel', 'activity', 'transfers', 'flight', 'flights', 'air', 'custom']
        if (business.indexOf(row[field].toLowerCase()) === -1) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        } else if (row[field].toLowerCase() === "flight") {
          row[field] = "air";
        }
      }
      field = 'BookBefore';
      if (BookBefore) {
        row[field] = BookBefore.format('YYYY-MM-DD');
      }

      let tmpTripDetails = data.find(x => x.tripCounter === row['tripCounter'] && x.tripItemCounter === 0);

      if (tripItemCounter === 0) {
        if (!StartDate && TripStartDate)
          data[index]["StartDate"] = TripStartDate.format('YYYY-MM-DD');
        else if (StartDate) {
          data[index]["StartDate"] = StartDate.format('YYYY-MM-DD');
        }
        else {
          field = 'Start Date';
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid Start Date on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
        if (!EndDate && TripEndDate)
          data[index]["EndDate"] = TripEndDate.format('YYYY-MM-DD');
        else if (EndDate) {
          row[field]["EndDate"] = EndDate.format('YYYY-MM-DD');
        }
        else {
          field = 'End Date';
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid End Date on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
      }
      else {
        TripStartDate = this.getMomentDate(tmpTripDetails["StartDate"]);
        TripEndDate = this.getMomentDate(tmpTripDetails["EndDate"]);

        if (StartDate && TripStartDate)
          data[index]["StartDate"] = TripStartDate.format('YYYY-MM-DD');
        else if (StartDate) {
          data[index]["StartDate"] = StartDate.format('YYYY-MM-DD');//.format(DisplayDateFormate);
        }
        if (!EndDate && TripEndDate)
          data[index]["EndDate"] = TripEndDate.format('YYYY-MM-DD');
        else if (EndDate) {
          data[index]["EndDate"] = EndDate.format('YYYY-MM-DD');
        }
      }
      if (StartDate && EndDate) {
        let dateDiff = EndDate.diff(StartDate, 'days')
        if (dateDiff < 0) {
          field = 'Start Date';
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Start Date must be before date of End Date on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
        else {
          data[index]["Day"] = EndDate.diff(StartDate, 'days') + 1;
          data[index]["Nights"] = row['Business'].toLowerCase() === "hotel" ? data[index]["Day"] - 1 : "";
          data[index]["Dates"] = {
            "checkInDate": StartDate.format('YYYY-MM-DD'),
            "checkOutDate": EndDate.format('YYYY-MM-DD')
          }
        }
      }
      else {
        data[index]["Day"] = 1;
        data[index]["Nights"] = "";
        data[index]["Dates"] = null;
      }
      if (TripStartDate && StartDate) {
        data[index]["Day"] = StartDate.diff(TripStartDate, 'days') + 1;
        if (data[index]["Day"] < 0) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_StartDate"] = "StartDate should be greater than or equal to TripStartDate Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
      }

      field = 'Rating';
      if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "hotel" && row[field] && isNaN(Number(row[field])))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Rating should be between 0 to 5";
      field = 'PickupTime';
      if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "transfers" && row[field] && row[field]) {
        if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = this.ExcelDateTimeToJSDateTime(row[field]).getHours() + ":" + this.ExcelDateTimeToJSDateTime(row[field]).getMinutes();
        }
        else if (row[field].indexOf(":") === -1)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. PickupTime should be in format of HH:MM (24 hour format)";
        else if (row[field].split(':')[0] === "" || row[field].split(':')[1] === "" || isNaN(Number(row[field].split(':')[0])) || isNaN(Number(row[field].split(':')[1])))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. PickupTime should be in format of HH:MM (24 hour format)";
      }

      //Flight : Set values
      if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air") {

        if (!row["DepartStops"]) row["DepartStops"] = "0";
        if (!row["ReturnStops"]) row["ReturnStops"] = "0";
        if (!row["DepartDurationHour"]) row["DepartDurationHour"] = 0;
        if (!row["DepartDurationMinute"]) row["DepartDurationMinute"] = 0;
        if (!row["ReturnDurationHour"]) row["ReturnDurationHour"] = 0;
        if (!row["ReturnDurationMinute"]) row["ReturnDurationMinute"] = 0;

        if (row["DepartDurationHour"] && row["DepartDurationMinute"])
          row["DepartDuration"] = row["DepartDurationHour"] + 'h ' + row["DepartDurationMinute"] + 'm';
        else
          row["DepartDuration"] = "";
        if (row["DepartDurationHour"] && row["DepartDurationMinute"])
          row["TotalDepartDuration"] = (row["DepartDurationHour"] * 60) + row["DepartDurationMinute"];
        else
          row["TotalDepartDuration"] = "";
        if (row["ReturnDurationHour"] && row["ReturnDurationMinute"])
          row["ReturnDuration"] = row["ReturnDurationHour"] + 'h ' + row["ReturnDurationMinute"] + 'm';
        else
          row["ReturnDuration"] = "";
        if (row["ReturnDurationHour"] && row["ReturnDurationMinute"])
          row["TotalReturnDuration"] = (row["ReturnDurationHour"] * 60) + row["ReturnDurationMinute"];
        else
          row["TotalReturnDuration"] = "";

        field = 'DepartStartDate';
        if (!row[field] && tmpTripDetails["TripStartDate"])
          row[field] = tmpTripDetails["TripStartDate"];
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = moment(this.ExcelDateTimeToJSDateTime(Number(row[field]))).format(DisplayDateFormate);
        }
        field = 'DepartEndDate';
        if (!row[field] && tmpTripDetails["TripStartDate"])
          row[field] = tmpTripDetails["TripStartDate"];
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = moment(this.ExcelDateTimeToJSDateTime(Number(row[field]))).format(DisplayDateFormate);
        }
        field = 'ReturnStartDate';
        if (!row[field] && tmpTripDetails["TripEndDate"])
          row[field] = tmpTripDetails["TripEndDate"];
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = moment(this.ExcelDateTimeToJSDateTime(Number(row[field]))).format(DisplayDateFormate);
        }
        field = 'ReturnEndDate';
        if (!row[field] && tmpTripDetails["TripEndDate"])
          row[field] = tmpTripDetails["TripEndDate"];
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = moment(this.ExcelDateTimeToJSDateTime(Number(row[field]))).format(DisplayDateFormate);
        }

        field = "DepartStartTime";
        if (!row[field]) row[field] = "00:00"
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = this.ExcelDateTimeToJSDateTime(row[field]).getHours() + ":" + this.ExcelDateTimeToJSDateTime(row[field]).getMinutes();
        }
        field = "DepartEndTime";
        if (!row[field]) row[field] = "00:00"
        else if (typeof row[field] === "number" && Number(row[field])) {
          row[field] = this.ExcelDateTimeToJSDateTime(row[field]).getHours() + ":" + this.ExcelDateTimeToJSDateTime(row[field]).getMinutes();
        }
        field = "ReturnStartTime";
        if (!row[field]) row[field] = "00:00"
        field = "ReturnEndTime";
        if (!row[field]) row[field] = "00:00"

        field = 'DayDepart';
        if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && !row[field])
          row[field] = 1;
        else if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && row[field] && isNaN(Number(row[field])))
          row[field] = 1;
        field = 'DayDepartEnd';
        if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && !row[field])
          row[field] = 1;
        else if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && row[field] && isNaN(Number(row[field])))
          row[field] = 1;
        if (row["RoundTrip"].toLowerCase() === "yes") {
          field = "ReturnStartTime";
          if (!row[field]) row[field] = "00:00"
          else if (typeof row[field] === "number" && Number(row[field])) {
            row[field] = this.ExcelDateTimeToJSDateTime(row[field]).getHours() + ":" + this.ExcelDateTimeToJSDateTime(row[field]).getMinutes();
          }
          field = "ReturnEndTime";
          if (!row[field]) row[field] = "00:00"
          else if (typeof row[field] === "number" && Number(row[field])) {
            row[field] = this.ExcelDateTimeToJSDateTime(row[field]).getHours() + ":" + this.ExcelDateTimeToJSDateTime(row[field]).getMinutes();
          }
          field = 'DayReturn';
          if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && !row[field])
            row[field] = 2;
          else if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && row[field] && isNaN(Number(row[field])))
            row[field] = 2;
          field = 'DayReturnEnd';
          if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && !row[field])
            row[field] = 2;
          else if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "air" && row[field] && isNaN(Number(row[field])))
            row[field] = 2;
        }
        else {
          row["ReturnStartTime"] = "";
          row["ReturnEndTime"] = "";
          row["DayReturn"] = "";
          row["DayReturnEnd"] = "";
          row["ReturnStops"] = "";
          row["ReturnDurationHour"] = "";
          row["ReturnDurationMinute"] = "";
        }
      }

      //validate : Amount fields
      // if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
      //   dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'SupplierTax';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'AgentCostPrice';
      if (dataErrors[tripCounter + "_" + tripItemCounter + "_SupplierCostPrice"] || dataErrors[tripCounter + "_" + tripItemCounter + "_SupplierTax"]) {  //(isNaN(Number(row[field])) || Number(row[field]) < 0) {
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      }
      else {
        row[field] = (isNaN(Number(row['SupplierCostPrice'])) ? 0 : Number(row['SupplierCostPrice'])) +
          (isNaN(Number(row['SupplierTax'])) ? 0 : Number(row['SupplierTax']))
      }
      field = 'AgentMarkup';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on" + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'Discount';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on" + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'CGST';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on" + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'SGST';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on" + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      field = 'IGST';
      if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0)
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal on" + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'SellPrice';
      if (dataErrors[tripCounter + "_" + tripItemCounter + "_SupplierCostPrice"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_SupplierTax"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_AgentMarkup"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_Discount"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_CGST"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_SGST"]
        || dataErrors[tripCounter + "_" + tripItemCounter + "_IGST"]
      ) {
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      }
      else {
        let TotalFields = (!isNaN(Number(row['SupplierCostPrice'])) ? 1 : 0)
          + (!isNaN(Number(row['SupplierTax'])) ? 1 : 0)
          + (!isNaN(Number(row['AgentMarkup'])) ? 1 : 0)
          + (!isNaN(Number(row['CGST'])) ? 1 : 0)
          + (!isNaN(Number(row['SGST'])) ? 1 : 0)
          + (!isNaN(Number(row['IGST'])) ? 1 : 0)
          + (!isNaN(Number(row['Discount'])) ? 1 : 0)
        if (TotalFields > 0) {
          let SellPrice = (!isNaN(Number(row['SupplierCostPrice'])) ? Number(row['SupplierCostPrice']) : 0)
            + (!isNaN(Number(row['SupplierTax'])) ? Number(row['SupplierTax']) : 0)
            + (!isNaN(Number(row['AgentMarkup'])) ? Number(row['AgentMarkup']) : 0)
            + (!isNaN(Number(row['CGST'])) ? Number(row['CGST']) : 0)
            + (!isNaN(Number(row['SGST'])) ? Number(row['SGST']) : 0)
            + (!isNaN(Number(row['IGST'])) ? Number(row['IGST']) : 0)
            - (!isNaN(Number(row['Discount'])) ? Number(row['Discount']) : 0)
          row[field] = SellPrice;
          if (SellPrice < 0) {
            dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
          }
        }
        else {
          if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0)
            dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
          else {
            row["SellPrice"] = isNaN(Number(row[field])) ? 1 : Number(row[field]);
            row["AgentCostPrice"] = isNaN(Number(row[field])) ? 1 : Number(row[field]);
          }
        }
      }

      field = 'Vendor';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " <,>,_ characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ConfirmationNumber';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "<,>,$,&,\",[,],/,.,? and ' characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ItemType';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'Description';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'Rating';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "in decimal for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'MealType';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'Duration';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'Guests';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'NoofAdult';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'NoofChild';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'NoofInfant';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'PickupTime';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'RoundTrip';
      if (row[field] && row[field] !== "" && row[field].toLowerCase() !== "yes" && row[field].toLowerCase() !== "no")
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid Trip type for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DayDepart';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DayDepartEnd';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartStartTime';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartEndTime';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartAirlineName';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartFlightNumber';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartClass';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartStops';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + "  in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartDurationHour';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DepartDurationMinute';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DayReturn';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'DayReturnEnd';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      if (row["StartDate"] && row["EndDate"]) {
        let ItemStartDate = this.getMomentDate(row["StartDate"]);
        let ItemEndDate = this.getMomentDate(row["EndDate"]);

        field = 'StartDate';
        if (!ItemStartDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

        field = 'EndDate';
        if (!ItemEndDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

      }

      if (row["DepartStartDate"] && row["DepartEndDate"]) {
        let ItemStartDate = this.getMomentDate(row["DepartStartDate"]);
        let ItemEndDate = this.getMomentDate(row["DepartEndDate"]);

        field = 'DepartStartDate';
        if (!ItemStartDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

        field = 'DepartEndDate';
        if (!ItemEndDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

      }

      if (row["ReturnStartDate"] && row["ReturnEndDate"]) {
        let ItemStartDate = this.getMomentDate(row["ReturnStartDate"]);
        let ItemEndDate = this.getMomentDate(row["ReturnEndDate"]);

        field = 'ReturnStartDate';
        if (!ItemStartDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

        field = 'ReturnEndDate';
        if (!ItemEndDate)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip";

      }

      field = 'ReturnStartTime';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnEndTime';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnAirlineName';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnFlightNumber';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnClass';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnStops';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnDurationHour';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      field = 'ReturnDurationMinute';
      if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
        dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";

      //validate : Hotel Adult/child/room type fields
      if (!dataErrors[tripCounter + "_" + tripItemCounter + "_Business"] && row["Business"].toLowerCase() === "hotel") {
        field = 'Room1Adults';
        if (row[field] && row[field] !== "" && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room1Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room1RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room1Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room1Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }

        field = 'Room2Adults';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room2Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room2RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room2Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room2Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }

        field = 'Room3Adults';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room3Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room3RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room3Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room3Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }

        field = 'Room4Adults';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room4Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room4RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room4Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room4Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }

        field = 'Room5Adults';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room5Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room5RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room5Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room5Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }

        field = 'Room6Adults';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 6)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 6 Adult allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room6Children';
        if (row[field] && isNaN(Number(row[field])) || Number(row[field]) < 0 || Number(row[field]) > 3)
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item. Maximum 3 child(ren) allowed in single room.";
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Please enter " + field + " in numeric on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        field = 'Room6RoomType';
        if (row[field] && row[field] !== "" && !this.validateData(field, row[field]))
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = " < and > characters not allowed on " + field + " " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item.";
        if (row[field] && !row["Room6Adults"]) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_" + field] = "Room6Adults required for " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
        let getHotelPaxInfoObj = this.getHotelPaxInfoObj(row);
        if (getHotelPaxInfoObj.length === 0) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_Room1Adults"] = "Room1Adults required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
      }

    });

    tripCounter = 0;
    tripItemCounter = 0;
    let business = '';
    dataGuest.map((row, index) => {

      let nth = "";
      let nthItem = "";

      if (row["TripNumber"]) {
        business = '';
        tripCounter++;
        tripItemCounter = 1;

        row["tripCounter"] = tripCounter - 1;
        row["tripItemCounter"] = tripItemCounter - 1;
        nth = this.getNth(tripCounter);
        nthItem = this.getNth(tripItemCounter);

        field = 'TripNumber';
        if (!row[field])
          dataErrors["guest_" + tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip" + tripItemCounter + nthItem + " guest row";
        else if (row[field] && this.validateData('Header-' + field, row[field]))
          dataErrors["guest_" + tripCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip" + tripItemCounter + nthItem + " guest row";
        else if (data.filter(x => x.TripNumber === row[field]).length > 0) {
          let tripCounter1 = data.filter(x => x.TripNumber === row[field])[0].tripCounter;
          if (data.filter(x => x.tripCounter === tripCounter1).filter(x => x.Business.toLowerCase() === "air" || x.Business.toLowerCase() === "flight").length > 0) {
            business = 'air';
          }
          else
            business = 'hotel';
        }
        else {
          return;
        }
      }
      else {
        nth = this.getNth(tripCounter);
        tripItemCounter++;
        nthItem = this.getNth(tripItemCounter);
        row["tripCounter"] = tripCounter - 1;
        row["tripItemCounter"] = tripItemCounter - 1;
      }

      field = 'FirstName';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      else if (row[field] && !this.validateData(field, row[field])) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Enter valid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }

      field = 'LastName';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      else if (row[field] && !this.validateData(field, row[field])) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Enter valid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }

      field = 'Gender';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      } else if (row[field].toUpperCase() !== 'FEMALE' && row[field].toUpperCase() !== 'MALE') {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      let BirthDate = this.getMomentDate(row["BirthDate"]);
      field = 'BirthDate';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      else if (!BirthDate) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      else
        row[field] = BirthDate.format('YYYY-MM-DD');

      field = 'City';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      else if (row[field] && !this.validateData(field, row[field])) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Enter valid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }


      field = 'Country/Nationality';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      } else if (!DropdownList.CountryList.find((x) => x.name === row[field])) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }

      field = 'Type';
      if (!row[field]) {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      } else if (row[field].toUpperCase() !== 'ADT' && row[field].toUpperCase() !== 'CHD' && row[field].toUpperCase() !== 'INF') {
        dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
      }
      if (business === 'air') {
        field = 'BirthDate';
        if (!dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_BirthDate"] && !dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_Type"]) {
          //DepartStartDate
          let minDate = this.getMinDateForBirthDateValidation(row["Type"]).format('YYYY-MM-DD');
          let maxDate = this.getMaxDateForBirthDateValidation(row["Type"]).format('YYYY-MM-DD');
          if (!BirthDate.isBetween(minDate, maxDate)) {
            dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Select BirthDate according to Type(ADT/CHD/INF) for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
          }

        }

        field = 'PassportNumber';
        if (!row[field]) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        }
        else if (row[field] && !this.validateData(field, row[field])) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Enter valid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        }

        let PassportExpireDate = this.getMomentDate(row["PassportExpireDate"]);
        field = 'PassportExpireDate';
        if (!row[field]) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        } else if (!PassportExpireDate) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        }
        else
          row[field] = PassportExpireDate.format('YYYY-MM-DD');

        field = 'PassportIssueingCountry';
        if (!row[field]) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = field + " Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        } else if (!DropdownList.CountryList.find((x) => x.name === row[field])) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_" + field] = "Invalid " + field + " on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " guest row";
        }
      }

    });

    data.map((item, index) => {

      let guests = [];
      let nth = "";
      let nthItem = "";
      nth = this.getNth(item.tripCounter + 1);
      nthItem = this.getNth(item.tripItemCounter + 1);

      let tripCounter = item.tripCounter + 1;
      let tripItemCounter = item.tripItemCounter + 1;

      let getHotelPaxInfoObj = this.getHotelPaxInfoObj(item);
      if (item["Business"] && item["Business"].toLowerCase() === "hotel" && getHotelPaxInfoObj.length === 0) {
        dataErrors[tripCounter + "_" + tripItemCounter + "_Room1Adults"] = "Room1Adults required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
      }
      else if (item["Business"] && item["Business"].toLowerCase() === "hotel" && getHotelPaxInfoObj.length > 0) {
        guests = dataGuest.filter(x => x.tripCounter === item.tripCounter); //&& x.Type ==="ADT"
        guests = guests.slice(0, getHotelPaxInfoObj.length);
        if (guests.length < getHotelPaxInfoObj.length) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_pax_ADT"] = "Guest required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
      }
      else if (item["Business"] && (item["Business"].toLowerCase() === "activity" || item["Business"].toLowerCase() === "transfers" || item["Business"].toLowerCase() === "custom")) {
        guests = dataGuest.filter(x => x.tripCounter === item.tripCounter); // && x.Type ==="ADT"
        guests = guests.slice(0, 1);
        if (guests.length === 0) {
          dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_pax_ADT"] = "Atleast 1 guest required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
      }
      else if (item["Business"] && (item["Business"].toLowerCase() === "flight" || item["Business"].toLowerCase() === "air")) {
        if (item["Business"] && isNaN(parseInt(item["NoofAdult"]))) {
          dataErrors[tripCounter + "_" + tripItemCounter + "_No of. Adult"] = "No of. Adult Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        }
        // if(item["Business"] && isNaN(parseInt(item["NoofChild"] === ""? "0" : item["NoofChild"] ))){
        //     dataErrors[tripCounter + "_" + tripItemCounter + "_No of. Child"] = "No of. Child Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        // }
        // if(item["Business"] && isNaN(parseInt(item["NoofInfant"] === ""? "0" : item["NoofInfant"] ))){
        //     dataErrors[tripCounter + "_" + tripItemCounter + "_No of. Infant"] = "No of. Infant Required on " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
        // }
        if (!isNaN(parseInt(item["NoofAdult"]))) {
          let guestsADT = dataGuest.filter(x => x.tripCounter === item.tripCounter && x.Type === "ADT");
          guestsADT = guestsADT.slice(0, parseInt(item["NoofAdult"]));
          guests = guests.concat(guestsADT);
          if (guestsADT.length < parseInt(item["NoofAdult"])) {
            dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_pax_ADT"] = parseInt(item["NoofAdult"]) + " adult guest required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
          }
        }
        if (!isNaN(parseInt(item["NoofChild"]))) {
          let guestsCHD = dataGuest.filter(x => x.tripCounter === item.tripCounter && x.Type === "CHD");
          guestsCHD = guestsCHD.slice(0, parseInt(item["NoofChild"]));
          guests = guests.concat(guestsCHD);
          if (guestsCHD.length < parseInt(item["NoofChild"])) {
            dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_pax_CHD"] = parseInt(item["NoofChild"]) + " child guest required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
          }
        }
        if (!isNaN(parseInt(item["NoofInfant"]))) {
          let guestsINF = dataGuest.filter(x => x.tripCounter === item.tripCounter && x.Type === "INF");
          guestsINF = guestsINF.slice(0, parseInt(item["NoofInfant"]));
          guests = guests.concat(guestsINF);
          if (guestsINF.length < parseInt(item["NoofInfant"])) {
            dataErrors["guest_" + tripCounter + "_" + tripItemCounter + "_pax_INF"] = parseInt(item["NoofInfant"]) + " infant guest required for " + (tripCounter) + nth + " trip " + tripItemCounter + nthItem + " item";
          }
        }
      }
    });

    [...Array(data.reduce((sum, item) => sum < item.tripCounter ? item.tripCounter : sum, 0) + 1).keys()].map(tripCounter => {
      let nth = this.getNth(tripCounter + 1);
      let trips = data.filter(x => x.tripCounter === tripCounter);

      if (trips.map(item => { return item.ConfirmationNumber }).filter(Boolean).length != [...new Set(trips.map(item => { return item.ConfirmationNumber }).filter(Boolean))].length)
        dataErrors["duplicateBrn_" + tripCounter] = "ConfirmationNumber must be unique within itinerary on " + (tripCounter + 1) + nth + " trip";
    });

    return dataErrors;
  }

  getHotelPaxInfoObj = item => {
    let hotelPaxInfoObj = []
    for (let i = 1; i <= 6; i++) {
      let adult = item['Room' + i + 'Adults'];
      let child = item['Room' + i + 'Children'];
      let type = item['Room' + i + 'RoomType'];
      if (adult || type) {
        hotelPaxInfoObj.push({
          "roomID": hotelPaxInfoObj.length + 1,
          "noOfAdults": Number(adult),
          "noOfChild": child ? Number(child) : 0,
          "roomType": type,
          "childAge": [...Array(Number(child ?? 0)).keys()].map(() => 5)
        });
      }
    }
    return hotelPaxInfoObj;
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

  getMinDateForBirthDateValidation = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate
      ? new Date(conditiondate)
      : new Date();
    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 2);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 100;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 12;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 2;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 100;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
      conditiondate.setDate(conditiondate.getDate() + 1);
    } else {
      conditiondate.setFullYear(conditiondate.getFullYear() - 100);
      conditiondate.setDate(conditiondate.getDate() + 1);
    }
    return moment(conditiondate);
  };

  getMaxDateForBirthDateValidation = (typestring, conditiondate) => {
    let diffNumber = 0;
    conditiondate = conditiondate
      ? new Date(conditiondate)
      : new Date();

    if (typestring) {
      //flight Case only
      if (typestring !== "ADT-CHD")
        conditiondate.setMonth(conditiondate.getMonth() + 0);

      //Flight Case
      if (typestring === "ADT") {
        diffNumber = 12;
      } //Flight Case
      else if (typestring === "CHD") {
        diffNumber = 2;
      } //Flight Case
      else if (typestring === "INF") {
        diffNumber = 0;
      } //Hotel Case
      else if (typestring === "ADT-CHD") {
        diffNumber = 12;
      }
      conditiondate.setFullYear(conditiondate.getFullYear() - diffNumber);
    }

    return moment(conditiondate);
  };

  getNth = function (d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  confirmImport = () => {
    let message = "Are you sure, you wants to import Bookings?";
    let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
      return Number(item.split('_')[0]);
    }))];
    if (this.state.bookingObject && rowHavingErrors.length > 0) {
      message = `Total ${this.state.bookingObject.length} valid Itineraries will be imported from ${this.state.results[this.state.results.length - 1]["tripCounter"] + 1} available in uploaded excel. Are you sure want to import partial records?`;
    }
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
  importRecords = () => {
    this.setState({ isStartProcessing: 'processing', showInstructionPopup: false, popupContent: "", popupHeader: "" });
    this.startImportRecords();
  }

  startImportRecords = () => {
    let rowHavingErrors = this.state.dataErrors && [...new Set(Object.keys(this.state.dataErrors).map(item => {
      return Number(item.split('_')[0]);
    }))];
    let tripNumber = (this.state.processingTripNumber ?? 0) + 1;
    let tripDetails = [...this.state.bookingObject].filter(x => rowHavingErrors.indexOf(x.tripCounter + 1) === -1); //let tripDetails = this.state.bookingObject;
    let customerList = this.state.customerList;

    let trip = tripDetails[tripNumber];
    if (tripDetails.length <= tripNumber) {
      this.setState({ isStartProcessing: 'completed', importComplete: true, processingTripNumber: -1 });
      return;
    }

    this.setState({
      totalSubRows: 6 + trip.items.length,
      completedSubRows: 0,
      processingTripNumber: tripNumber
    });

    let guestList = this.state.resultsGuests.filter(x => x.tripCounter === this.state.resultsGuests.filter(x => x.TripNumber === trip.tripNumber)[0].tripCounter)
    //this.addTravelers(localStorage.getItem("cartLocalId"), trip, guestList)
    //this.getPaymentMode(null,localStorage.getItem("cartLocalId"));
    if (customerList.data.filter(x => x.contactInformation.email === trip['email']).length === 0) {
      this.addCustomer(trip, guestList, this.setpersonate, this.createCart);
    }
    else {
      this.setpersonate(trip, guestList, this.createCart)
    }
  }
  addCustomer = (trip, guestList, callback, callbackfn) => {
    var reqURL = "api/v1/customer/create";
    let reqOBJ = {
      Request: {
        UserDisplayName: trip.customerName,
        FirstName: trip.customerName?.split(" ")[0],
        LastName: trip.customerName?.split(" ")[1] !== undefined ? trip.customerName?.split(" ")[1] : "",
        Location: {
          Id: Global.getEnvironmetKeyValue("PortalCountryCode"),
          CountryID: Global.getEnvironmetKeyValue("PortalCountryCode"),
          Country: Global.getEnvironmetKeyValue("PortalCountryName"),
        },
        ContactInformation: {
          PhoneNumber: trip.phone.split("-")[1],
          PhoneNumberCountryCode: trip.phone.split("-")[0],
          Email: trip.email ? trip.email : trip.phone + process.env.REACT_APP_B2CPORTALDOMAINFORCUSTOMER.replace(".", "@"),
        },
      },
      flags: {
        validateEmailAndPhone: "true",
        UseAgentDetailInEmail: Global.getEnvironmetKeyValue("UseAgentDetailInEmail", "cobrand") === "true" ? true : false,
        iscmsportalcreated: this.props.userInfo.issendregistrationemail.toLowerCase() === "true" && (trip.email ?? process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@")).endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))
      }
    }

    apiRequester(reqURL, reqOBJ, (data) => {
      //todo:Check for email and phone number combination
      if (data.status.code !== 260029 && data.status.code !== 260031 && data.status.code !== 0) {
        this.crashFound("add-customer");
      }
      else {
        this.setState({
          completedSubRows: 1
        });
        callback(trip, guestList, callbackfn);
      }
    });
  };
  setpersonate = (trip, guestList, callback) => {
    let reqURL = "api/v1/callcenter/setpersonateforcustomer";
    let reqOBJ = {
      Request: trip.phone,
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code !== 0) {
          this.crashFound("set-personate");
        }
        else {
          sessionStorage.setItem("personateId", data.response);
          sessionStorage.setItem("callCenterType", data.userDetail.type);
          sessionStorage.setItem("bookingForInfo", JSON.stringify(data.userDetail.details));
          sessionStorage.setItem("bookingFor", data.userDetail.details.firstName);
          this.setState({
            completedSubRows: 2
          });
          callback(trip, guestList);
        }
      }.bind(this)
    );
  };

  createCart = (trip, guestList) => {

    let reqURL = "api/v1/cart/create";
    let reqOBJ = { Request: {} };
    apiRequester(reqURL, reqOBJ, (data) => {
      if (data.status.code !== 0) {
        this.crashFound("cart-create");
      }
      else {
        localStorage.setItem("cartLocalId", data.response);
        this.setState({
          completedSubRows: this.state.completedSubRows + 1
        });
        this.addToCart(data.response, trip, guestList);
      }
    });
  }
  addToCart = async (cartId, trip, guestList) => {
    let objTripDetails = {
      "name": trip.tripName,
      "customerName": trip.customerName,
      "email": trip.email,
      "phone": trip.phone,
      "startDate": trip.tripStartDate,
      "endDate": trip.tripEndDate,
      "duration": trip.duration,
      "offlineItems": trip.items.map(item => {
        let newItem = { ...item };
        for (let [oldKey, value] of Object.entries(newItem)) {
          let newKey = (oldKey.charAt(0).toLowerCase() + oldKey.slice(1)).split(' ').join('').split('.').join('');
          if (newKey === "confirmationNumber")
            newKey = "brn";
          else if (newKey === "numberOfRooms")
            newKey = "noRooms";
          else if (newKey === "noofAdult")
            newKey = "adult";
          else if (newKey === "noofChild")
            newKey = "child";
          else if (newKey === "noofInfant")
            newKey = "infant";
          else if (newKey === "business")
            value = value.toLowerCase();
          else if (newKey === "departDurationHour")
            newKey = "departDurationH";
          else if (newKey === "departDurationMinute")
            newKey = "departDurationM";
          else if (newKey === "returnDurationHour")
            newKey = "returnDurationH";
          else if (newKey === "returnDurationMinute")
            newKey = "returnDurationM";
          else if (newKey === "roundTrip") {
            newKey = "isRoundTrip";
            value = value.toLowerCase() === "yes" ? true : false;
          }
          else if (newKey === "supplierTax") {
            newKey = "supplierTaxPrice";
          }
          else if (newKey === "agentCostPrice") {
            newKey = "costPrice";
          }
          else if (newKey === "agentMarkup") {
            newKey = "markupPrice";
          }
          else if (newKey === "discount") {
            newKey = "discountPrice";
          }
          else if (newKey === "cGST") {
            newKey = "CGSTPrice";
          }
          else if (newKey === "sGST") {
            newKey = "SGSTPrice";
          }
          else if (newKey === "iGST") {
            newKey = "IGSTPrice";
          }
          if (newKey !== oldKey)
            delete Object.assign(newItem, { [newKey]: value })[oldKey];
        }
        if (newItem.departDurationH && newItem.departDurationM)
          newItem.departDuration = newItem.departDurationH + 'h ' + newItem.departDurationM + 'm';
        if (newItem.departDurationH && newItem.departDurationM)
          delete Object.assign(newItem, { ["totaldepartDuration"]: (newItem.departDurationH * 60) + newItem.departDurationM })["totalDepartDuration"];
        if (newItem.returnDurationH && newItem.returnDurationM)
          newItem.returnDuration = newItem.returnDurationH + 'h ' + newItem.returnDurationM + 'm';
        if (newItem.returnDurationH && newItem.returnDurationM)
          delete Object.assign(newItem, { ["totalreturnDuration"]: (newItem.returnDurationH * 60) + newItem.returnDurationM })["totalReturnDuration"];
        newItem.uuid = this.generateUUID();
        return { offlineItem: newItem }
      })
    };

    for (let item of objTripDetails.offlineItems) {
      await this.CallAddToCart(cartId, item);
    }

    this.addTravelers(cartId, trip, guestList);
  }

  CallAddToCart = async (cartId, item) => {
    let reqURL = "api/v1/cart/add";
    let reqData = await this.getRequestInfo(item.offlineItem, item.offlineItem.business);
    let reqOBJ = {
      Request: {
        CartID: cartId,
        Data: reqData,
      },
    };

    await apiRequesterAsync(reqURL, reqOBJ, (data) => {
      if (data.status.code !== 0) {
        this.crashFound("add-to-cart");
      }
      else {
        this.setState({
          completedSubRows: this.state.completedSubRows + 1
        });
      }
    });

    return new Promise((resolve, reject) => {
      return resolve(true);
    });
  }

  addTravelers = async (cartId, trip, guestList) => {
    var reqURL = "api/v1/cart";
    var reqOBJ = {
      Request: localStorage.getItem("cartLocalId"),
      Flags: { lockcartifunlocked: true },
    };
    let cartResponse = await apiRequesterAsync(reqURL, reqOBJ, (data) => {
      return data.response;
    });

    let contact = {
      firstName: trip.customerName.split(' ')[0],
      lastName: trip.customerName.split(' ')[1],
      phoneNumber: trip.phone,
      city: guestList[0].City,
      countryID: DropdownList.CountryList.find(
        (x) => x.name === guestList[0]["Country/Nationality"]
      ).isoCode,
      country: guestList[0]["Country/Nationality"],
      email: trip.email,
      gender: guestList[0].Gender
    }

    reqURL = "api/v1/cart/travellers/add";
    reqOBJ = this.getTravellerData(cartId, cartResponse, contact, guestList);
    apiRequesterAsync(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code !== 0) {
          this.crashFound("add-traveler");
        }
        else {
          this.setState({
            completedSubRows: this.state.completedSubRows + 1
          });
          this.getPaymentMode(trip, cartId);
        }
      }.bind(this)
    );
  }

  getTravellerData = (cartId, cartResponse, contact, data) => {
    //tripItemCounter
    let returnData = cartResponse.items.map((cartItem) => {
      let guestRowData = [];
      if (cartItem.data.business !== "air") {
        guestRowData = data.filter(x => x.Type === "ADT").slice(0, cartItem.data.business === "hotel" ? cartItem.data.items[0].item.length : 1);
      }
      else {
        let ADTQty = cartItem.data.paxInfo.find(x => x.typeString === "ADT")?.quantity ?? 0;
        let CHDQty = cartItem.data.paxInfo.find(x => x.typeString === "CHD")?.quantity ?? 0;
        let INFQty = cartItem.data.paxInfo.find(x => x.typeString === "INF")?.quantity ?? 0;
        let guestsADT = data.filter(x => x.Type === "ADT").slice(0, ADTQty);
        guestRowData = guestRowData.concat(guestsADT);
        let guestsCHD = data.filter(x => x.Type === "CHD").slice(0, CHDQty);
        guestRowData = guestRowData.concat(guestsCHD);
        let guestsINF = data.filter(x => x.Type === "INF").slice(0, INFQty);
        guestRowData = guestRowData.concat(guestsINF);
      }

      let guestData = guestRowData.map((guest) => {
        return {
          IsMainPax: true,
          LocationInfo: {},
          Details: {
            FirstName: guest.FirstName,
            LastName: guest.LastName,
            Location: {
              City: contact.city,
              country: DropdownList.CountryList.find(
                (x) => x.isoCode === contact.countryID
              ).name,
              countryID: contact.countryID,
            },
            ContactInformation: {
              Name: guest.FirstName + " " + guest.LastName,
              phoneNumber: contact.phoneNumber.split("-")[1],
              phoneNumberCountryCode: contact.phoneNumber.split("-")[0],
              Email: contact.email,
            },
            Age: moment().diff(guest.BirthDate, "years"),
            GenderDesc: guest.Gender,
            Gender:
              guest.Gender.toLowerCase() === "male"
                ? "M"
                : guest.Gender.toLowerCase() === "female"
                  ? "F"
                  : guest.Gender,
            NationalityCode: DropdownList.CountryList.find(
              (x) => x.name === guest["Country/Nationality"]
            ).isoCode,
            BirthDate: guest.BirthDate,
            OpenIDs: {},
            documentType: "PASSPORTNUMBER",
            PassportExpirationDate: guest.PassportExpireDate,
            IssuingCountryCode: guest.PassportIssueingCountry ? DropdownList.CountryList.find(
              (x) => x.name === guest.PassportIssueingCountry
            ).isoCode ? DropdownList.CountryList.find(
              (x) => x.name === guest.PassportIssueingCountry
            ).isoCode : Global.getEnvironmetKeyValue("PortalCountryCode")
              : Global.getEnvironmetKeyValue("PortalCountryCode"),
            documentNumber: guest.PassportNumber,
            Documents: [
              {
                type: "PASSPORTNUMBER",
                Id: guest.PassportNumber,
                DateInfo: {
                  EndDate: guest.PassportExpireDate,
                },
                LocationInfo: {
                  FromLocation: {
                    CountryID: guest.PassportIssueingCountry ? DropdownList.CountryList.find(
                      (x) => x.name === guest.PassportIssueingCountry
                    ).isoCode ? DropdownList.CountryList.find(
                      (x) => x.name === guest.PassportIssueingCountry
                    ).isoCode : Global.getEnvironmetKeyValue("PortalCountryCode")
                      : Global.getEnvironmetKeyValue("PortalCountryCode"),
                  },
                },
              },
            ]
          },
          Age: moment().diff(guest.BirthDate, "years"),
          Addons: [],
          Documents: [
            {
              type: "PASSPORTNUMBER",
              Id: guest.PassportNumber,
              DateInfo: {
                EndDate: guest.PassportExpireDate,
              },
              LocationInfo: {
                FromLocation: {
                  CountryID: guest.PassportIssueingCountry ? DropdownList.CountryList.find(
                    (x) => x.name === guest.PassportIssueingCountry
                  ).isoCode ? DropdownList.CountryList.find(
                    (x) => x.name === guest.PassportIssueingCountry
                  ).isoCode : Global.getEnvironmetKeyValue("PortalCountryCode")
                    : Global.getEnvironmetKeyValue("PortalCountryCode"),
                },
              },
            },
          ],
          //stopInfo: this.getStopInfo(guest),
          BookingDetails: (cartItem.data.business === "hotel" || cartItem.data.business === "transfers") ? {
            //isBoardingPassValid: true
            businessObjectItemID: cartItem.data.items[0].item[0].code,
            businessObjectItemCode: cartItem.data.items[0].item[0].code,
          } : {},
          TypeString: guest.Type,
          config: [],
          Flags: {
            saveAsCoTraveler: false,
            saveasguestcustomer: false,
          },
        };
      });

      return {
        code: cartItem.cartItemID,
        type: cartItem.cartItemID,
        Item: [].concat.apply([], guestData),
        Config: [],
      };
    });

    return {
      "contactDetails": {
        "LoginName": contact.email,
        "FirstName": contact.firstName,
        "LastName": contact.lastName,
        "Location": {
          "City": contact.city,
          "country": contact.country,
          "countryID": contact.countryID
        },
        "ContactInformation": {
          "phoneNumber": contact.phoneNumber.split('-')[1],
          "phoneNumberCountryCode": contact.phoneNumber.split('-')[0],
          "Email": contact.email
        },
        "Gender": contact.gender.toLowerCase() === "male" ? "M" : contact.gender.toLowerCase() === "female" ? "F" : contact.gender,
        "Token": "booking for " + contact.firstName + " " + contact.lastName
      },
      "Request": {
        "cartID": cartId,
        "Data": returnData
      }
    }
  };

  getPaymentMode = (trip, cartId) => {
    var reqURL = "api/v1/application/environment";
    var reqOBJ = {
      Request: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code !== 0) {
          this.crashFound("get-payment-mode");
        }
        else {
          this.bookCart(trip, cartId, data.response);
        }
      }.bind(this)
    );
  };

  bookCart = (trip, cartId, statePaymentMode) => {
    let paymentMode = statePaymentMode.paymentGatewayInputInfo.find(
      (x) => x.code.toLowerCase() === "agentbalance"
    );

    var reqURL = "api/v1/cart/book";
    var reqOBJ = {
      paymentGatewayID: paymentMode.code,
      paymentReturnUrl:
        window.location.origin + (window.location.pathname.toLocaleLowerCase() === '/be.aspx' ? '/be.aspx/' : '/')
        + "importBookings/" + cartId,
      Request: cartId,
      Flags: {},
      ItineraryName: "booking for "// + trip.customerName,
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 260030) {
          //Do Nothing : 
        }
        else if (data.status.code === 41081) {
          //Do Nothing : 
        } else {
          //Do Next Step :
          if (data.status.code === 1) {
            this.crashFound("cart-book");
          }
          else {
            this.setState({
              completedSubRows: this.state.completedSubRows + 1
            });
            this.bookItinerary(data.response.data);
          }
        }
      }.bind(this)
    );
  };

  bookItinerary = (txnToken) => {
    let reqURL = "v1/pg/transaction/complete/manual";
    var reqOBJ = {
      Request: {
        Data: txnToken,
        GatewayResponseMessage: "",
        PaymentStatus: "Completed",
        PaymentType: "Sale",
        GatewayRefNo: this.generateUUID(),
        MerchantRefNo: txnToken,
        GatewayResponseCode: "0",
        IsWriteLog: true
      }
    };
    apiRequesterAsync(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code !== 0) {
          this.crashFound("book-itinerary");
        }
        else {
          this.setState({
            completedSubRows: this.state.completedSubRows + 1
          });
          this.getTransactionStatus(txnToken);
        }
      }.bind(this)
    );
  }
  getTransactionStatus = (txnToken) => {
    let reqURL = "v1/pg/transaction/statusbytoken/" + txnToken;
    apiRequester(
      reqURL,
      {},
      function (data) {
        if (data.response.action !== "redirect")
          this.getTransactionStatus(txnToken)
        else {
          this.afterBookingviewCart(data.response.data.split('/')[data.response.data.split('/').length - 1]);
        }
      }.bind(this)
      , "GET");
  }

  afterBookingviewCart = (cartId) => {
    var reqURL = "api/v1/cart";
    var reqOBJ = {
      Request: cartId,
      Flags: { lockcartifunlocked: true },
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        let irn = data?.response?.itineraryReferenceNumber;
        if (!irn)
          this.crashFound("get-irn");
        else {
          //let brn = data.response.items[0].bookingReferenceCode;
          let bookingObject = this.state.bookingObject;
          bookingObject[this.state.processingTripNumber]["irn"] = irn;
          bookingObject[this.state.processingTripNumber]["isBookingSuccess"] = true;
          bookingObject[this.state.processingTripNumber]["isBookingProcessed"] = true;
          this.setState({
            completedSubRows: this.state.completedSubRows + 1,
            bookingObject: bookingObject,
            completedRows: this.state.completedRows + 1
          }, () => this.clearCart(cartId));
        }
      }.bind(this)
    );
  }
  clearCart = (cartId) => {
    var reqURL = "api/v1/cart/clear";
    var reqOBJ = {
      Request: {
        CartID: cartId,
      },
      Flags: {},
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        sessionStorage.removeItem("personateId");
        sessionStorage.removeItem("callCenterType");
        localStorage.removeItem("cartLocalId");
        this.startImportRecords();
      }.bind(this)
    );
  }
  crashFound = (stage) => {
    let bookingObject = this.state.bookingObject;
    bookingObject[this.state.processingTripNumber]["irn"] = "Booking failed!";
    bookingObject[this.state.processingTripNumber]["isBookingProcessed"] = true;
    bookingObject[this.state.processingTripNumber]["isBookingSuccess"] = false;
    sessionStorage.removeItem("personateId");
    sessionStorage.removeItem("callCenterType");
    localStorage.removeItem("cartLocalId");
    this.setState({
      completedSubRows: this.state.completedSubRows + 1,
      bookingObject: bookingObject,
      completedRows: this.state.completedRows + 1
    }, () => this.startImportRecords());
  }

  updatecompletedRows = (rowNum) => {
    this.setState({
      completedRows: rowNum
    });
  }
  saveIitnerary = async (data) => {
    var reqURL = "quotation";
    let reqOBJ = {
      "name": data.TripName,
      "owner": data.CustomerName,
      "isPublic": true,
      "type": this.props.mode,
      "data": {
        "name": data.TripName,
        "customerName": data.CustomerName,
        "email": data.Email,
        "phone": data.Phone,
        "offlineItems": JSON.stringify(data.offlineItems),
        "duration": data.Duration,
        "startDate": data.TripStartDate,
        "endDate": data.TripEndDate,
        "type": this.props.mode,
        "createdDate": moment().format(Global.DateFormate),
        "status": "saved",
        "agentName": ""
      }
    }


    return new Promise(function (resolve, reject) {
      apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
        resolve(data)
      });
    });
  }
  generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };
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
  validateData = (dataItem, value) => {
    let returnValue = true;
    switch (dataItem) {
      case "CustomerName":
      case "FirstName":
      case "LastName":
        returnValue = this.validateFormData(value, "alpha_space");
        break;
      case "Header-Email":
        returnValue = (!this.validateFormData(value, "email"))
        break;
      case "Header-TripNumber":
        returnValue = (!this.validateFormData(value, "only-numeric"))
        break;
      case "TripStartDate":
      case "TripEndDate":
        returnValue = (!this.validateFormData(value, "date-format"))
        break;
      case "Phone":
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
        break;
      case "TripName":
      case "FromLocation":
      case "ToLocation":
      case "Name":
      case "SupplierCurrency":
      case "ItemType":
      case "Description":
      case "MealType":
      case "Duration":
      case "PickupTime":
      case "DepartStartTime":
      case "DepartEndTime":
      case "DepartAirlineName":
      case "DepartFlightNumber":
      case "DepartClass":
      case "ReturnStartTime":
      case "ReturnEndTime":
      case "ReturnFlightNumber":
      case "ReturnAirlineName":
      case "ReturnClass":
      case "Room1RoomType":
      case "Room2RoomType":
      case "Room3RoomType":
      case "Room4RoomType":
      case "Room5RoomType":
      case "Room6RoomType":
      case "City":
      case "PassportNumber":
        returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>]/);
        break;
      case "Vendor":
        returnValue = this.validateFormData(value, "special-characters-not-allowed", /[<>_]/);
        break;
      case "ConfirmationNumber":
        returnValue = this.validateFormData(value, "special-characters-not-allowed", /[`$&'<>"\[\]/.?]/);
        break;
      case "ConversionRate":
      case "SupplierCostPrice":
      case "SupplierTax":
      case "AgentCostPrice":
      case "AgentMarkup":
      case "Discount":
      case "CGST":
      case "SGST":
      case "IGST":
      case "SellPrice":
      case "Rating":
        returnValue = this.validateFormData(value, "numeric");
        break;
      case "Guests":
      case "NoofAdult":
      case "NoofChild":
      case "NoofInfant":
      case "DayDepart":
      case "DayDepartEnd":
      case "DepartStops":
      case "DepartDurationHour":
      case "DepartDurationMinute":
      case "DayReturn":
      case "DayReturnEnd":
      case "ReturnStops":
      case "ReturnDurationHour":
      case "ReturnDurationMinute":
      case "Room1Adults":
      case "Room2Adults":
      case "Room3Adults":
      case "Room4Adults":
      case "Room5Adults":
      case "Room6Adults":
      case "Room1Children":
      case "Room2Children":
      case "Room3Children":
      case "Room4Children":
      case "Room5Children":
      case "Room6Children":
        returnValue = this.validateFormData(value, "only-numeric");
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
        if (output && parseInt(data.split('-')[0]) > 2300 || parseInt(data.split('-')[0]) < 1900) output = false;
        if (output && parseInt(data.split('-')[1]) > 12 || parseInt(data.split('-')[1]) < 0) output = false;
        if (output && parseInt(data.split('-')[2]) > 31 || parseInt(data.split('-')[1]) < 0) output = false;
        break;
      default:
        output = false;
        break;
    }
    return output;
  }

  getRequestInfo = async (item, business) => {
    let returnValue = [];
    if (business === "hotel") {
      returnValue = [
        {
          ManualItem: {
            business: item.business,
            Name: item.name && item.name !== "" ? item.name : "Unnamed Hotel",
            Amount: item.sellPrice && item.sellPrice !== "" ? item.sellPrice : "1",
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID:
                  item.details?.locationInfo?.fromLocation.countryID ||
                  "Unnamed",
                City: item.toLocation !== "" ? item.toLocation : "Unnamed",
                Name:
                  item.toLocationCity !== "" ? item.toLocationCity : "Unnamed",
                CountryID:
                  item.details?.locationInfo?.fromLocation.countryID ||
                  "Unnamed",
                Type: "Location",
                Priority: 1,
              },
            },
            objectIdentifier: item.business,
            Rating: item.rating,
            RatingType: "Star",
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.endDate).format("YYYY-MM-DD"),
            },
            paxInfo: item.hotelPaxInfo,
            images: item.imgUrl ? [
              {
                URL: item.imgUrl,
                Type: "default",
                Title: "Hotel",
                IsDefault: true
              }
            ] : [],
            config: this.getbrnconfig(item),
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            items: [{
              item: [...Array(item.hotelPaxInfo.length).keys()].map((data, index) => {
                let itemType = item.hotelPaxInfo[index].roomType;
                return {
                  name: (itemType && itemType) || "Unnamed Room",
                  id: (itemType && itemType) || "Unnamed Room",
                  business: 'hotel',
                  objectIdentifier: "room",
                  paxInfo: this.getRoomWiseHotelPaxObj(item, index)
                };
              }),
            }],
          },
        },
      ];
    } else if (business === "air") {
      if (!item.isRoundTrip) {
        returnValue = [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "oneway",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocationName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocationCity || "Unnamed",
                  City: item.fromLocationCity || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocationName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocationCity || "Unnamed",
                  City: item.toLocationCity || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate:
                  moment(item.departStartDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departStartTime !== ""
                    ? item.departStartTime + ":00"
                    : "00:00:00"),
                endDate:
                  moment(item.departEndDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departEndTime !== ""
                    ? item.departEndTime + ":00"
                    : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: item.child !== "" ? parseInt(item.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: item.infant !== "" ? parseInt(item.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.vendor,
                  },
                },
              ],
              StopDetails: [item.departStops !== "" ? item.departStops : 0],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.departStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departStartTime !== ""
                        ? item.departStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.departEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departEndTime !== ""
                        ? item.departEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "durationHours",
                      value:
                        item.departDuration
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totaldepartDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                      ],
                      images: item.departImg ? [{
                        URL: item.departImg,
                        Type: "default",
                        IsDefault: true
                      }] : [],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      } else {
        returnValue = [
          {
            ManualItem: {
              business: item.business,
              objectIdentifier: "flightOption",
              TripType: "roundtrip",
              Amount: item.sellPrice !== "" ? item.sellPrice : "1",
              CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
              totalDuration:
                item.departDuration
                  ? parseInt(item.departDuration.split(" ")[0].replace("h", ""))
                  : "0",
              TicketTimeLimit:
                moment(item.departEndDate).format("YYYY-MM-DD") +
                "T" +
                (item.departEndTime !== ""
                  ? item.departEndTime + ":00"
                  : "00:00:00"),
              Description: item.Description,
              LocationInfo: {
                FromLocation: {
                  ID: item.fromLocation || "Unnamed",
                  Name: item.fromLocationName || "Unnamed",
                  CountryID: item.fromLocation || "Unnamed",
                  Country: item.fromLocationCity || "Unnamed",
                  City: item.fromLocationCity || "Unnamed",
                  Type: "Location",
                },
                ToLocation: {
                  ID: item.toLocation || "Unnamed",
                  Name: item.toLocationName || "Unnamed",
                  CountryID: item.toLocation || "Unnamed",
                  Country: item.toLocationCity || "Unnamed",
                  City: item.toLocationCity || "Unnamed",
                  Type: "Location",
                },
              },
              dateInfo: {
                startDate:
                  moment(item.departStartDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departStartTime !== ""
                    ? item.departStartTime + ":00"
                    : "00:00:00"),
                endDate:
                  moment(item.departEndDate).format("YYYY-MM-DD") +
                  "T" +
                  (item.departEndTime !== ""
                    ? item.departEndTime + ":00"
                    : "00:00:00"),
              },
              paxInfo: [
                {
                  typeString: "ADT",
                  quantity: item.adult,
                  type: 0,
                },
                {
                  typeString: "CHD",
                  quantity: item.child !== "" ? parseInt(item.child) : 0,
                  type: 1,
                },
                {
                  typeString: "INF",
                  quantity: item.infant !== "" ? parseInt(item.infant) : 0,
                  type: 2,
                },
              ],
              config: this.getbrnconfig(item),
              vendors: [
                {
                  item: {
                    name: item.vendor,
                  },
                },
              ],
              StopDetails: [
                item.departStops !== "" ? item.departStops : 0,
                item.returnStops !== "" ? item.returnStops : 0,
              ],
              tpExtension: [
                {
                  key: "durationHours",
                  value:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                },
                {
                  key: "durationMinutes",
                  value:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[1].replace("m", "")
                      )
                      : "0",
                },
              ],
              items: [
                {
                  totalDuration:
                    item.departDuration
                      ? parseInt(
                        item.departDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.departStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departStartTime !== ""
                        ? item.departStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.departEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.departEndTime !== ""
                        ? item.departEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.departClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.departDuration
                          ? parseInt(
                            item.departDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.departDuration
                          ? parseInt(
                            item.departDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totaldepartDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.departAirlineName,
                          },
                        },
                      ],
                      images: [{
                        URL: item.departImg,
                        Type: "default",
                        IsDefault: true
                      }],
                      Code: item.departFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.departClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.departDuration
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.departDuration
                              ? parseInt(
                                item.departDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
                {
                  totalDuration:
                    item.returnDuration
                      ? parseInt(
                        item.returnDuration.split(" ")[0].replace("h", "")
                      )
                      : "0",
                  dateInfo: {
                    startDate:
                      moment(item.returnStartDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.returnStartTime !== ""
                        ? item.returnStartTime + ":00"
                        : "00:00:00"),
                    endDate:
                      moment(item.returnEndDate).format("YYYY-MM-DD") +
                      "T" +
                      (item.returnEndTime !== ""
                        ? item.returnEndTime + ":00"
                        : "00:00:00"),
                  },
                  LocationInfo: {
                    FromLocation: {
                      ID: item.toLocation || "Unnamed",
                      Name: item.toLocationName || "Unnamed",
                      CountryID: item.toLocation || "Unnamed",
                      Country: item.toLocationCity || "Unnamed",
                      City: item.toLocationCity || "Unnamed",
                      Type: "Location",
                    },
                    ToLocation: {
                      ID: item.fromLocation || "Unnamed",
                      Name: item.fromLocationName || "Unnamed",
                      CountryID: item.fromLocation || "Unnamed",
                      Country: item.fromLocationCity || "Unnamed",
                      City: item.fromLocationCity || "Unnamed",
                      Type: "Location",
                    },
                  },
                  tpExtension: [
                    {
                      key: "cabinClass",
                      value: item.returnClass,
                    },
                    {
                      key: "durationHours",
                      value:
                        item.returnDuration
                          ? parseInt(
                            item.returnDuration.split(" ")[0].replace("h", "")
                          )
                          : "0",
                    },
                    {
                      key: "durationMinutes",
                      value:
                        item.returnDuration
                          ? parseInt(
                            item.returnDuration.split(" ")[1].replace("m", "")
                          )
                          : "0",
                    },
                  ],
                  item: [
                    {
                      journeyDuration: item.totalreturnDuration,
                      vendors: [
                        {
                          type: "airline",
                          item: {
                            code: "6E",
                            name: item.returnAirlineName,
                          },
                        },
                        {
                          type: "operatingAirline",
                          item: {
                            code: "6E",
                            name: item.returnAirlineName,
                          },
                        },
                      ],
                      images: item.returnImg ? [{
                        URL: item.returnImg,
                        Type: "default",
                        IsDefault: true
                      }] : [],
                      Code: item.returnFlightNumber,
                      business: "air",
                      objectIdentifier: "flight",
                      tpExtension: [
                        {
                          key: "cabinClass",
                          value: item.returnClass,
                        },
                        {
                          key: "durationHours",
                          value:
                            item.returnDuration
                              ? parseInt(
                                item.returnDuration
                                  .split(" ")[0]
                                  .replace("h", "")
                              )
                              : "0",
                        },
                        {
                          key: "durationMinutes",
                          value:
                            item.returnDuration
                              ? parseInt(
                                item.returnDuration
                                  .split(" ")[1]
                                  .replace("m", "")
                              )
                              : "0",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ];
      }
    } else if (business === "activity") {
      returnValue = [
        {
          ManualItem: {
            business: item.business,
            objectIdentifier: "activity",
            Name: item.name && item.name !== "" ? item.name : "Unnamed",
            Description: item.description,
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.startDate).format("YYYY-MM-DD"),
            },
            images: item.imgUrl ? [{
              URL: item.imgUrl,
              Type: "default",
              IsDefault: true
            }] : [],
            TPExtension: [
              {
                Key: "duration",
                Value: item.duration,
              },
            ],
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests !== "" ? item.guests : "1",
                type: 0,
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                City: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                Name: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                CountryID: "AE",
                Type: "Location",
                Priority: 1,
              },
            },
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    name:
                      item.itemType && item.itemType[0] !== "" ? item.itemType[0] : "Unnamed",
                    business: "activity",
                    objectIdentifier: "activityOption",
                  },
                ],
              },
            ],
          },
        },
      ];
    } else if (business === "transfers") {
      returnValue = [
        {
          ManualItem: {
            tripType: !item.isRoundTrip ? "oneway" : "roundtrip",
            business: "transfers",
            objectIdentifier: "transfers",
            Description: item.description,
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            dateInfo: {
              startDate:
                moment(item.startDate).format("YYYY-MM-DD") + "T00:00:00",
              endDate:
                moment(item.startDate).format("YYYY-MM-DD") + "T00:00:00",
              startTime:
                item.pickupTime && item.pickupTime !== "" ? item.pickupTime.split(":")[0] : "00",
              endTime:
                item.pickupTime && item.pickupTime !== ""
                  ? item.pickupTime.split(":")[1].split(" ")[0]
                  : "00",
              type: null,
            },
            images: item.imgUrl ? [{
              URL: item.imgUrl,
              Type: "default",
              IsDefault: true
            }] : [],
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests && item.guests !== "" ? item.guests : "1",
                type: 0,
              },
            ],
            tpExtension: [
              {
                Key: "adultCount",
                Value: item.guests && item.guests !== "" ? item.guests : "1",
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID: item.fromLocation || "Unnamed",
                Name: item.fromLocation || "Unnamed",
                CountryID: item.fromLocation || "Unnamed",
                Type: item.pickupType && item.pickupType !== "" ? item.pickupType : "Airport",
              },
              ToLocation: {
                ID: item.toLocation && item.toLocation || "Unnamed",
                Name: item.toLocation && item.toLocation || "Unnamed",
                CountryID: item.toLocation && item.toLocation || "Unnamed",
                Type: item.dropoffType && item.dropoffType !== "" ? item.dropoffType : "Airport",
              },
            },
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    business: "transfers",
                    objectIdentifier: "transfersoption",
                    tpExtension: [
                      {
                        Key: "adultCount",
                        Value: item.guests && item.guests !== "" ? item.guests : "2",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ];
    } else if (business === "custom") {
      returnValue = [
        {
          ManualItem: {
            business: "activity",
            objectIdentifier: "activity",
            flags: {
              isCustomBusiness: true,
            },
            Amount: item.sellPrice !== "" ? item.sellPrice : "1",
            paxInfo: [
              {
                typeString: "ADT",
                quantity: item.guests !== "" ? item.guests : "2",
                type: 0,
              },
            ],
            CurrencyRefCode: Global.getEnvironmetKeyValue("portalCurrencyCode"),
            LocationInfo: {
              FromLocation: {
                ID: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                City: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                Name: item.toLocation && item.toLocation !== "" ? item.toLocation : "Unnamed",
                CountryID: "AE",
                Type: "Location",
                Priority: 1,
              },
            },
            Name: item.name && item.name !== "" ? item.name : "Unnamed",
            Description: item.description,
            dateInfo: {
              startDate: moment(item.startDate).format("YYYY-MM-DD"),
              endDate: moment(item.startDate).format("YYYY-MM-DD"),
            },
            vendors: [
              {
                item: {
                  name: item.vendor,
                },
              },
            ],
            config: this.getbrnconfig(item),
            items: [
              {
                item: [
                  {
                    name: item.itemType || "Unnamed",
                    business: "activity",
                    objectIdentifier: "activityOption",
                  },
                ],
              },
            ],
          },
        },
      ];
    }
    return new Promise((resolve, reject) => {
      return resolve(returnValue);
    });
  };
  getRoomWiseHotelPaxObj = (hotelItem, index) => {
    let adt = {
      typeString: "ADT",
      quantity: hotelItem.hotelPaxInfo[index].noOfAdults,
      type: 0,
    };

    let chd = [...Array(hotelItem.hotelPaxInfo[index].noOfChild).keys()].flatMap((item, chdindex) => {
      return {
        typeString: "CHD",
        quantity: 1,
        type: 1,
        age: 5//hotelItem.hotelPaxInfo[index].childAge[chdindex]
      }
    });
    if (hotelItem.hotelPaxInfo[index].noOfChild > 0) {
      return [adt, chd].flatMap(x => x);
    }
    else
      return [adt];
  }
  getbrnconfig = (item) => {
    if (item.brn !== "") {
      return [
        {
          key: "BRN",
          value: item.brn.trim(),
        },
        {
          key: "SellPrice",
          value: item.sellPrice && item.sellPrice !== "" ? item.sellPrice : "1",
        },
        {
          key: "CostPrice",
          value: item.costPrice && item.costPrice !== "" ? item.costPrice : "1",
        },
        {
          key: "isOfflineItinerary",
          value: true,
        },
      ];
    } else {
      return [
        {
          key: "SellPrice",
          value: item.sellPrice && item.sellPrice !== "" ? item.sellPrice : "1",
        },
        {
          key: "CostPrice",
          value: item.costPrice && item.costPrice !== "" ? item.costPrice : "1",
        },
        {
          key: "isOfflineItinerary",
          value: true,
        },
      ];
    }
  };
  handleReset = () => {
    sessionStorage.removeItem("personateId");
    sessionStorage.removeItem("callCenterType");
    localStorage.removeItem("cartLocalId");
    this.setState({
      bookingObject: [],
      results: {},
      resultsGuests: {},
      isLoading: false,
      dataErrors: null,
      successRowNum: [],
      errorRowNum: [],
      completedRows: 0,
      totalSubRows: 0,
      completedSubRows: 0,
      importComplete: false,
      fileName: null,
      customerList: null,
      isStartProcessing: 'pending',
      processingTripNumber: -1,
      showInstructionPopup: false,
      isImportLimitExceededFrom: 0,
      maximumRowsallowed: 1000,
      popupSizeClass: "",
      popupHeader: "",
      popupContent: "",
    });
    this.getCoTravelers();
  }
  handleInstructionPopup = () => {
    this.setState({
      showInstructionPopup: !this.state.showInstructionPopup,
      popupSizeClass: "modal-lg",
      popupHeader: "Import Instructions",
      popupContent: <div>
        <ul>
          <li>Maximum {this.state.maximumRowsallowed} trip items can be imported.</li>
          <li>Please enter Contact Phone with ' (single quote) sign as prefix</li>
          <li>Contact Phone should start with country code (with "+" prefix) and it should contain "-" in between country code and phone number. eg. +91-1234567890</li>
          <li>Please enter date in YYYY-MM-DD format with ' (single quote) sign as prefix for all date columns (TripStartDate, TripEndDate, StartDate, EndDate, BookBefore, DepartStartDate, DepartEndDate, ReturnStartDate, ReturnEndDate)</li>
          <li>Please enter date in HH:MM format(24 Hour) with ' (single quote) sign as prefix for all date columns (PickupTime, DepartStartTime, DepartEndTime, ReturnStartTime, ReturnEndTime)</li>
          <li>Kindly enter valid data as per given below table for respective fields.</li>
          <li className="mt-2">
            <div className="container">
              <div className="row">
                <div className="col-6 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr><th>Business Column</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>hotel</td></tr>
                      <tr><td>flight</td></tr>
                      <tr><td>activity</td></tr>
                      <tr><td>transfers</td></tr>
                      <tr><td>custom</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-6 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr><th>Trip columns</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>TripName</td></tr>
                      <tr><td>CustomerName</td></tr>
                      <tr><td>Email</td></tr>
                      <tr><td>Phone</td></tr>
                      <tr><td>TripStartDate</td></tr>
                      <tr><td>TripEndDate</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-6 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr>
                        <th>Item wise price columns <br />
                          <small>Only numeric values allowed.</small>
                        </th>
                      </tr>

                    </thead>
                    <tbody>
                      <tr><td>SupplierCurrency</td></tr>
                      <tr><td>ConversionRate</td></tr>
                      <tr><td>SupplierCostPrice</td></tr>
                      <tr><td>SupplierTax</td></tr>
                      <tr><td>AgentCostPrice</td></tr>
                      <tr><td>AgentMarkup</td></tr>
                      <tr><td>Discount</td></tr>
                      <tr><td>CGST</td></tr>
                      <tr><td>SGST</td></tr>
                      <tr><td>IGST</td></tr>
                      <tr><td>SellPrice</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-6 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr><th>Meal Types (Hotel)</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Vegetarian</td></tr>
                      <tr><td>Non-Vegetarian</td></tr>
                      <tr><td>Jain</td></tr>
                      <tr><td>European Plan</td></tr>
                      <tr><td>Continental Plan</td></tr>
                      <tr><td>American Plan</td></tr>
                      <tr><td>Modified American Plan</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-6 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr><th>Custom Item Types</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Visa</td></tr>
                      <tr><td>Rail</td></tr>
                      <tr><td>Forex</td></tr>
                      <tr><td>Bus</td></tr>
                      <tr><td>Rent a Car</td></tr>
                      <tr><td>Other</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-12 pl-0">
                  <table className="table border mt-1 ">
                    <thead className="thead-light">
                      <tr>
                        <th>Columns</th>
                        <th>hotel</th>
                        <th>flight</th>
                        <th>activity</th>
                        <th>transfers</th>
                        <th>custom</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>FromLocation</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers="">&#10003;</td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ToLocation</td>
                        <td hotel="">&#10003;</td>
                        <td flight="">&#10003;</td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers=""></td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>StartDate</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>EndDate</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>Vendor</td>
                        <td hotel="">&#10003;</td>
                        <td flight="">&#10003;</td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>ConfirmationNumber</td>
                        <td hotel="">&#10003;</td>
                        <td flight="">&#10003;</td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>ItemType</td>
                        <td hotel=""></td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>Description</td>
                        <td hotel="">&#10003;</td>
                        <td flight="">&#10003;</td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>BookBefore</td>
                        <td hotel="">&#10003;</td>
                        <td flight="">&#10003;</td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom="">&#10003;</td>
                      </tr>
                      <tr>
                        <td>Rating</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>MealType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Duration</td>
                        <td hotel=""></td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Guests</td>
                        <td hotel=""></td>
                        <td flight=""></td>
                        <td activity="">&#10003;</td>
                        <td transfers="">&#10003;</td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>PickupTime</td>
                        <td hotel=""></td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers="">&#10003;</td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room1Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room1Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room1RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room2Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room2Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room2RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room3Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room3Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room3RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room4Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room4Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room4RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room5Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room5Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room5RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room6Adults</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room6Children</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>Room6RoomType</td>
                        <td hotel="">&#10003;</td>
                        <td flight=""></td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>NoofAdult</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>NoofChild</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>NoofInfant</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>RoundTrip</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DayDepart</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DayDepartEnd</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartStartDate</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartEndDate</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartStartTime</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartEndTime</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartAirlineName</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartFlightNumber</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartClass</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartStops</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartDurationHour</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DepartDurationMinute</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DayReturn</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>DayReturnEnd</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnStartDate</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnEndDate</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnStartTime</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnEndTime</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnAirlineName</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnFlightNumber</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnClass</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnStops</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnDurationHour</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
                      </tr>
                      <tr>
                        <td>ReturnDurationMinute</td>
                        <td hotel=""></td>
                        <td flight="">&#10003;</td>
                        <td activity=""></td>
                        <td transfers=""></td>
                        <td custom=""></td>
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
    const { results, resultsGuests, isLoading, error, fileName, completedRows, totalSubRows, completedSubRows, importComplete, successRowNum, errorRowNum, dataErrors, bookingObject, isStartProcessing, processingTripNumber, isImportLimitExceededFrom } = this.state;
    const progress = bookingObject.length > 0 ? parseInt(completedRows * 100 / bookingObject.length) : 0;
    const subprogress = parseInt(completedSubRows * 100 / totalSubRows);
    let isShowImportInquiry = !isLoading && results && results.length > 0 && isStartProcessing === 'pending';
    return (
      <div>
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              Import Bookings
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
              Import Bookings
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
                {isStartProcessing === 'pending' &&
                  <div className="row">
                    <div className="col-lg-6 col-md-6 mt-2">
                      <div className="custom-file">
                        <input type="file" className="custom-file-input"
                          onChange={this.handleChange.bind(this)}
                          multiple={false}
                          accept={".xlsx"}
                          id="customFile" />
                        <label className="custom-file-label" htmlFor="customFile">
                          {fileName && fileName.length > 0 ? fileName : "Select bookings XLSX file"}</label>

                        {error && error.length > 0 &&
                          <small className="alert alert-danger mt-2 p-1 d-inline-block">
                            {error}
                          </small>
                        }
                      </div>

                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                      {isShowImportInquiry &&
                        /* {!isLoading && results && dataErrors && Object.keys(dataErrors).length === 0 &&
                          results.length > 0 && !importComplete && */
                        <button onClick={() => this.confirmImport()} className="btn btn-primary">Import Bookings</button>
                      }
                    </div>
                    <div className="col-lg-3 col-md-6 mt-2">
                      <button className="btn btn-primary float-right">
                        <a href={templateFile} className="text-white" download={"Import-Bookings.xlsx"}>Download Template</a>
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
                }
                {isStartProcessing === "processing" &&
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <div className="progress">
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progress + 3}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{completedRows + "/" + (results.reduce((sum, item) => sum < item.tripCounter ? item.tripCounter : sum, 0) + 1)}&nbsp;&nbsp;&nbsp; Processed</div>
                      </div>
                    </div>
                  </div>
                }
                {isStartProcessing === "processing" &&
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <div className="progress">
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${subprogress + 2}%` }} aria-valuenow={subprogress} aria-valuemin="0" aria-valuemax="100">{subprogress}%</div>{/* completedSubRows + "/" + (totalSubRows + 1) */}
                      </div>
                    </div>
                  </div>
                }
                {isStartProcessing === "completed" && bookingObject.length > 0 &&
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <div className="alert alert-success">
                        {bookingObject.filter(x => x.isBookingSuccess === true).length + " booking(s) imported successfully."}
                      </div>
                      {bookingObject.filter(x => x.isBookingSuccess === false).length > 0 &&
                        <div className="alert alert-danger">
                          {bookingObject.filter(x => x.isBookingSuccess === false).length + " booking(s) import failed."}
                        </div>
                      }
                    </div>
                  </div>
                }
                {isStartProcessing === 'completed' &&
                  <div className="row">
                    <div className="col-lg-3">
                      <button onClick={() => this.handleReset()} className="btn btn-primary">Import Again</button>
                    </div>
                  </div>
                }
                {isImportLimitExceededFrom > 0 && isStartProcessing === 'pending' &&
                  <div className="row">
                    <div className="col-lg-12 ">
                      <div class="alert alert-primary mt-2 mb-0" role="alert">
                        First {results.length} items have been imported from the uploaded excel file containing {isImportLimitExceededFrom} items.
                      </div>
                    </div>
                  </div>
                }

                {isStartProcessing !== "pending" &&
                  <div className="row mt-3 small">
                    <div class="col-9 table-responsive">
                      <table class="table border">
                        <thead class="thead-light">
                          <tr>
                            <th>Trip #</th>
                            <th>Trip Name</th>
                            <th>Status / Itinerary Reference Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingObject.map((trip, index) => {
                            return <tr>
                              <td>{trip.tripNumber}</td>
                              <td>{trip.tripName}</td>
                              <td style={{ "color": processingTripNumber === index ? "blue" : trip.isBookingProcessed === true ? trip.isBookingSuccess === true ? "green" : "red" : "" }}>
                                {processingTripNumber === index ? "Processing..." : trip.isBookingProcessed === false ? 'Pending' : trip.isBookingSuccess === true ? trip.irn : "booking failed"}
                              </td>
                            </tr>
                          })}

                        </tbody>
                      </table>
                    </div>
                  </div>
                }
                {dataErrors && Object.keys(dataErrors).length > 0 &&
                  <div className="row">
                    <div className="col-lg-12 row">
                      <small className="col-lg-12 alert alert-danger mt-2 mb-0 p-1 d-inline-block m-3">
                        {Object.keys(dataErrors).map((item, i) => {
                          return <ul key={i}>
                            <li className="mt-1"> {dataErrors[item]}</li>
                          </ul>
                        })}
                      </small>
                    </div>
                  </div>
                }
                <div className="row mt-3 small">
                  {!isLoading && results && results.length > 0 && [...Array(results.reduce((sum, item) => sum < item.tripCounter ? item.tripCounter : sum, 0) + 1).keys()].map(tripCounter => {
                    const tripData = results.find(x => x["tripCounter"] === tripCounter && x.tripItemCounter === 0)
                    const tripItemData = results.filter(x => x["tripCounter"] === tripCounter)
                    let irn = bookingObject.find(x => x.tripNumber === tripData.TripNumber)?.irn;
                    return <React.Fragment>
                      {/* <Link to={"#collapseExample" + tripCounter} data-toggle="collapse" data-target={"#collapseExample" + tripCounter} className="btn btn-primary m-3">Trip #{tripCounter+1}</Link> */}
                      <span className="btn btn-primary m-3">Trip #{tripData.TripNumber}</span>
                      <div className={"col-lg-12 " + (tripCounter !== 0 ? " " : "")} >
                        <h5>Trip Details
                          {irn && <small style={{ "color": "green" }}> - Itinerary reference number :   {irn} </small>}
                        </h5>

                        <div className="table-responsive">
                          <table className="table border" id="sheet1">
                            <thead className="thead-light">
                              <tr>
                                {["#", "Trip Name", "Customer Name", "Email", "Phone", "Start Date", "End Date", "Duration"].map((data, i) => {
                                  return (<th scope="col" key={i}>{data}</th>)
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading && (<TableLoading columns={8} />)}
                              {!isLoading && results && results.length > 0 &&
                                <tr>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "TripNumber"] ? "alert-danger" : ""} scope="row">{tripData.TripNumber}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "TripName"] ? "alert-danger" : ""} scope="row">{tripData.TripName}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "CustomerName"] ? "alert-danger" : ""}>{tripData["CustomerName"]}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "Email"] ? "alert-danger" : ""}>{tripData["Email"]}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "Phone"] ? "alert-danger" : ""}>{tripData["Phone"]}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "TripStartDate"] ? "alert-danger" : ""}>{tripData["TripStartDate"]}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "TripEndDate"] ? "alert-danger" : ""}>{tripData["TripEndDate"]}</td>
                                  <td className={dataErrors[(tripData.tripCounter + 1) + "_" + "Duration"] ? "alert-danger" : ""}>{tripData["TripDuration"]}</td>
                                </tr>
                              }
                            </tbody>
                          </table>

                        </div>
                      </div>
                      <div className="col-lg-12">
                        <h5>Itinerary Details</h5>
                        <div className="table-responsive">
                          <table className="table border table-column-width" id="sheet2">
                            <thead className="thead-light">
                              <tr>
                                {[
                                  "Business",
                                  "From Location",
                                  "To Location",
                                  "Name",
                                  "Start Date",
                                  "End Date",
                                  //"Cost Price",
                                  //"Sell Price",
                                  "Supplier Currency",
                                  "Conversion Rate",
                                  "Supplier Cost Price",
                                  "Supplier Tax",
                                  "Agent Cost Price",
                                  "Agent Markup",
                                  "Discount",
                                  "CGST",
                                  "SGST",
                                  "IGST",
                                  "Sell Price",
                                  "Vendor",
                                  "Confirmation Number",
                                  "Item Type",
                                  "Description",
                                  "Book Before",
                                  "Day",
                                  "Nights",
                                  "Rating",
                                  "Meal Type",
                                  "Duration",
                                  "Guests",
                                  "Pickup Time",
                                  "Room 1 Adults",
                                  "Room 1 Children",
                                  "Room 1 Room Type",
                                  "Room 2 Adults",
                                  "Room 2 Children",
                                  "Room 2 Room Type",
                                  "Room 3 Adults",
                                  "Room 3 Children",
                                  "Room 3 Room Type",
                                  "Room 4 Adults",
                                  "Room 4 Children",
                                  "Room 4 Room Type",
                                  "Room 5 Adults",
                                  "Room 5 Children",
                                  "Room 5 Room Type",
                                  "Room 6 Adults",
                                  "Room 6 Children",
                                  "Room 6 Room Type",
                                  "No of. Adult",
                                  "No of. Child",
                                  "No of. Infant",
                                  "RoundTrip?",
                                  "Day Depart",
                                  "Day Depart End",
                                  "Depart Start Date",
                                  "Depart End Date",
                                  "Depart Start Time",
                                  "Depart End Time",
                                  "Depart Airline Name",
                                  "Depart Flight Number",
                                  "Depart Class",
                                  "Depart Stops",
                                  "Depart Duration (Hour)",
                                  "Depart Duration (Minute)",
                                  "Depart Duration",
                                  "Total Depart Duration",
                                  "Day Return",
                                  "Day Return End",
                                  "Return Start Date",
                                  "Return End Date",
                                  "Return Start Time",
                                  "Return End Time",
                                  "Return Airline Name",
                                  "Return Flight Number",
                                  "Return Class",
                                  "Return Stops",
                                  "Total Return Duration",
                                  "Return Duration (Hour)",
                                  "Return Duration (Minute)",
                                  "Return Duration",
                                  "Total Depart Duration",
                                ].map((data, key) => {
                                  return (<th width={table_column_width[data]} key={key} scope="col">{data}</th>)
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {
                                tripItemData.map((item, key) => {
                                  let i = (tripData.tripCounter + 1) + "_" + (item.tripItemCounter + 1) + "_";
                                  let brnError = results.filter(x => x.tripCounter === item.tripCounter && x.ConfirmationNumber === item.ConfirmationNumber).length > 1;
                                  let guests = [];
                                  if (item["Business"] && item["Business"].toLowerCase() === "hotel") {
                                    let getHotelPaxInfoObj = this.getHotelPaxInfoObj(item);
                                    if (getHotelPaxInfoObj.length > 0) {
                                      guests = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter);//&& x.Type ==="ADT"
                                      guests = guests.slice(0, getHotelPaxInfoObj.length);
                                    }
                                  }
                                  else if (item["Business"] && (item["Business"].toLowerCase() === "activity" || item["Business"].toLowerCase() === "transfers" || item["Business"].toLowerCase() === "custom")) {
                                    guests = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter);//&& x.Type ==="ADT"
                                    guests = guests.slice(0, 1);
                                  }
                                  else if (item["Business"] && (item["Business"].toLowerCase() === "flight" || item["Business"].toLowerCase() === "air")) {
                                    if (!isNaN(parseInt(item["NoofAdult"]))) {
                                      let guestsADT = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "ADT");
                                      guestsADT = guestsADT.slice(0, parseInt(item["NoofAdult"]));
                                      guests = guests.concat(guestsADT);
                                    }
                                    if (!isNaN(parseInt(item["NoofChild"]))) {
                                      let guestsCHD = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "CHD");
                                      guestsCHD = guestsCHD.slice(0, parseInt(item["NoofChild"]));
                                      guests = guests.concat(guestsCHD);
                                    }
                                    if (!isNaN(parseInt(item["NoofInfant"]))) {
                                      let guestsINF = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "INF");
                                      guestsINF = guestsINF.slice(0, parseInt(item["NoofInfant"]));
                                      guests = guests.concat(guestsINF);
                                    }
                                  }

                                  return (<React.Fragment key={key}>
                                    <tr>
                                      <th className={dataErrors[i + "Business"] ? "alert-danger" : ""} style={{ "textTransform": "capitalize" }} scope="row">{item["Business"]?.toLowerCase() === "air" ? "flight" : item["Business"]}</th>
                                      <td className={dataErrors[i + "From Location"] ? "alert-danger" : ""}>{item["FromLocation"]}</td>
                                      <td className={dataErrors[i + "To Location"] ? "alert-danger" : ""}>{item["ToLocation"]}</td>
                                      <td className={dataErrors[i + "Name"] ? "alert-danger" : ""}>{item["Name"]}</td>
                                      <td className={dataErrors[i + "Start Date"] ? "alert-danger" : ""}>{item["StartDate"]}</td>
                                      <td className={dataErrors[i + "End Date"] ? "alert-danger" : ""}>{item["EndDate"]}</td>
                                      <td className={dataErrors[i + "SupplierCurrency"] ? "alert-danger" : ""}>{item["SupplierCurrency"]}</td>
                                      <td className={dataErrors[i + "ConversionRate"] ? "alert-danger" : ""}>{item["ConversionRate"]}</td>
                                      <td className={dataErrors[i + "SupplierCostPrice"] ? "alert-danger" : ""}>{item["SupplierCostPrice"]}</td>
                                      <td className={dataErrors[i + "SupplierTax"] ? "alert-danger" : ""}>{item["SupplierTax"]}</td>
                                      <td className={dataErrors[i + "AgentCostPrice"] ? "alert-danger" : ""}>{item["AgentCostPrice"]}</td>
                                      <td className={dataErrors[i + "AgentMarkup"] ? "alert-danger" : ""}>{item["AgentMarkup"]}</td>
                                      <td className={dataErrors[i + "Discount"] ? "alert-danger" : ""}>{item["Discount"]}</td>
                                      <td className={dataErrors[i + "CGST"] ? "alert-danger" : ""}>{item["CGST"]}</td>
                                      <td className={dataErrors[i + "SGST"] ? "alert-danger" : ""}>{item["SGST"]}</td>
                                      <td className={dataErrors[i + "IGST"] ? "alert-danger" : ""}>{item["IGST"]}</td>
                                      <td className={dataErrors[i + "SellPrice"] ? "alert-danger" : ""}>{item["SellPrice"]}</td>
                                      <td className={dataErrors[i + "Vendor"] ? "alert-danger" : ""}>{item["Vendor"]}</td>
                                      <td className={dataErrors[i + "Booking Reference Number"] || brnError ? "alert-danger" : ""}>{item["ConfirmationNumber"]}</td>
                                      <td className={dataErrors[i + "Item Type"] ? "alert-danger" : ""}>{item["ItemType"]}</td>
                                      <td className={dataErrors[i + "Description"] ? "alert-danger" : ""}>{item["Description"]}</td>
                                      <td className={dataErrors[i + "Book Before"] ? "alert-danger" : ""}>{item["BookBefore"]}</td>
                                      <td className={dataErrors[i + "Day"] ? "alert-danger" : ""}>{item["Day"]}</td>
                                      <td className={dataErrors[i + "Nights"] ? "alert-danger" : ""}>{item["Nights"]}</td>
                                      <td className={dataErrors[i + "Rating"] ? "alert-danger" : ""}>{item["Rating"]}</td>
                                      <td className={dataErrors[i + "Meal Type"] ? "alert-danger" : ""}>{item["MealType"]}</td>
                                      <td className={dataErrors[i + "Duration"] ? "alert-danger" : ""}>{item["Duration"]}</td>
                                      <td className={dataErrors[i + "Guests"] ? "alert-danger" : ""}>{item["Guests"]}</td>
                                      <td className={dataErrors[i + "Pickup Time"] ? "alert-danger" : ""}>{item["PickupTime"]}</td>
                                      <td className={dataErrors[i + "Room1Adults"] ? "alert-danger" : ""}>{item["Room1Adults"]}</td>
                                      <td className={dataErrors[i + "Room1Children"] ? "alert-danger" : ""}>{item["Room1Children"]}</td>
                                      <td className={dataErrors[i + "Room1RoomType"] ? "alert-danger" : ""}>{item["Room1RoomType"]}</td>
                                      <td className={dataErrors[i + "Room2Adults"] ? "alert-danger" : ""}>{item["Room2Adults"]}</td>
                                      <td className={dataErrors[i + "Room2Children"] ? "alert-danger" : ""}>{item["Room2Children"]}</td>
                                      <td className={dataErrors[i + "Room2RoomType"] ? "alert-danger" : ""}>{item["Room2RoomType"]}</td>
                                      <td className={dataErrors[i + "Room3Adults"] ? "alert-danger" : ""}>{item["Room3Adults"]}</td>
                                      <td className={dataErrors[i + "Room3Children"] ? "alert-danger" : ""}>{item["Room3Children"]}</td>
                                      <td className={dataErrors[i + "Room3RoomType"] ? "alert-danger" : ""}>{item["Room3RoomType"]}</td>
                                      <td className={dataErrors[i + "Room4Adults"] ? "alert-danger" : ""}>{item["Room4Adults"]}</td>
                                      <td className={dataErrors[i + "Room4Children"] ? "alert-danger" : ""}>{item["Room4Children"]}</td>
                                      <td className={dataErrors[i + "Room4RoomType"] ? "alert-danger" : ""}>{item["Room4RoomType"]}</td>
                                      <td className={dataErrors[i + "Room5Adults"] ? "alert-danger" : ""}>{item["Room5Adults"]}</td>
                                      <td className={dataErrors[i + "Room5Children"] ? "alert-danger" : ""}>{item["Room5Children"]}</td>
                                      <td className={dataErrors[i + "Room5RoomType"] ? "alert-danger" : ""}>{item["Room5RoomType"]}</td>
                                      <td className={dataErrors[i + "Room6Adults"] ? "alert-danger" : ""}>{item["Room6Adults"]}</td>
                                      <td className={dataErrors[i + "Room6Children"] ? "alert-danger" : ""}>{item["Room6Children"]}</td>
                                      <td className={dataErrors[i + "Room6RoomType"] ? "alert-danger" : ""}>{item["Room6RoomType"]}</td>
                                      <td className={dataErrors[i + "No of. Adult"] ? "alert-danger" : ""}>{item["NoofAdult"]}</td>
                                      <td className={dataErrors[i + "No of. Child"] ? "alert-danger" : ""}>{item["NoofChild"]}</td>
                                      <td className={dataErrors[i + "No of. Infant"] ? "alert-danger" : ""}>{item["NoofInfant"]}</td>
                                      <td className={dataErrors[i + "RoundTrip?"] ? "alert-danger" : ""}>{item["RoundTrip"]}</td>
                                      <td className={dataErrors[i + "Day Depart"] ? "alert-danger" : ""}>{item["DayDepart"]}</td>
                                      <td className={dataErrors[i + "Day Depart End"] ? "alert-danger" : ""}>{item["DayDepartEnd"]}</td>
                                      <td className={dataErrors[i + "Depart Start Date"] ? "alert-danger" : ""}>{item["DepartStartDate"]}</td>
                                      <td className={dataErrors[i + "Depart End Date"] ? "alert-danger" : ""}>{item["DepartEndDate"]}</td>
                                      <td className={dataErrors[i + "Depart Start Time"] ? "alert-danger" : ""}>{item["DepartStartTime"]}</td>
                                      <td className={dataErrors[i + "Depart End Time"] ? "alert-danger" : ""}>{item["DepartEndTime"]}</td>
                                      <td className={dataErrors[i + "Depart Airline Name"] ? "alert-danger" : ""}>{item["DepartAirlineName"]}</td>
                                      <td className={dataErrors[i + "Depart Flight Number"] ? "alert-danger" : ""}>{item["DepartFlightNumber"]}</td>
                                      <td className={dataErrors[i + "Depart Class"] ? "alert-danger" : ""}>{item["DepartClass"]}</td>
                                      <td className={dataErrors[i + "Depart Stops"] ? "alert-danger" : ""}>{item["DepartStops"]}</td>
                                      <td className={dataErrors[i + "Depart Duration (Hour)"] ? "alert-danger" : ""}>{item["DepartDurationHour"]}</td>
                                      <td className={dataErrors[i + "Depart Duration (Minute)"] ? "alert-danger" : ""}>{item["DepartDurationMinute"]}</td>
                                      <td className={dataErrors[i + "Depart Duration"] ? "alert-danger" : ""}>{item["DepartDuration"]}</td>
                                      <td className={dataErrors[i + "Total Depart Duration"] ? "alert-danger" : ""}>{item["TotalDepartDuration"]}</td>
                                      <td className={dataErrors[i + "Day Return"] ? "alert-danger" : ""}>{item["DayReturn"]}</td>
                                      <td className={dataErrors[i + "Day Return End"] ? "alert-danger" : ""}>{item["DayReturnEnd"]}</td>
                                      <td className={dataErrors[i + "Return Start Date"] ? "alert-danger" : ""}>{item["ReturnStartDate"]}</td>
                                      <td className={dataErrors[i + "Return End Date"] ? "alert-danger" : ""}>{item["ReturnEndDate"]}</td>
                                      <td className={dataErrors[i + "Return Start Time"] ? "alert-danger" : ""}>{item["ReturnStartTime"]}</td>
                                      <td className={dataErrors[i + "Return End Time"] ? "alert-danger" : ""}>{item["ReturnEndTime"]}</td>
                                      <td className={dataErrors[i + "Return Airline Name"] ? "alert-danger" : ""}>{item["ReturnAirlineName"]}</td>
                                      <td className={dataErrors[i + "Return Flight Number"] ? "alert-danger" : ""}>{item["ReturnFlightNumber"]}</td>
                                      <td className={dataErrors[i + "Return Class"] ? "alert-danger" : ""}>{item["ReturnClass"]}</td>
                                      <td className={dataErrors[i + "Return Stops"] ? "alert-danger" : ""}>{item["ReturnStops"]}</td>
                                      <td className={dataErrors[i + "Total Return Duration"] ? "alert-danger" : ""}>{item["RotalreturnDuration"]}</td>
                                      <td className={dataErrors[i + "Return Duration (Hour)"] ? "alert-danger" : ""}>{item["ReturnDurationHour"]}</td>
                                      <td className={dataErrors[i + "Return Duration (Minute)"] ? "alert-danger" : ""}>{item["ReturnDurationMinute"]}</td>
                                      <td className={dataErrors[i + "Return Duration"] ? "alert-danger" : ""}>{item["ReturnDuration"]}</td>
                                      <td className={dataErrors[i + "Total Return Duration"] ? "alert-danger" : ""}>{item["TotalReturnDuration"]}</td>
                                    </tr>
                                    {guests.length > 0 &&
                                      <tr>
                                        <td colSpan="15">
                                          <table className="table border" id="sheet2">
                                            <thead className="thead-light">
                                              <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Gender</th>
                                                <th>Birth Date</th>
                                                <th>City</th>
                                                <th>Country/Nationality</th>
                                                <th>Type</th>
                                                <th>Passport Number</th>
                                                <th>Passport Expire Date</th>
                                                <th>Passport Issuing Country</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {guests.map((itemGuest, key) => {
                                                return (
                                                  <tr key={key}>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "FirstName"] ? "alert-danger" : ""} >{itemGuest.FirstName}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "LastName"] ? "alert-danger" : ""} >{itemGuest.LastName}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Gender"] ? "alert-danger" : ""} >{itemGuest.Gender}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "BirthDate"] ? "alert-danger" : ""} >{itemGuest.BirthDate}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "City"] ? "alert-danger" : ""} >{itemGuest.City}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Country/Nationality"] ? "alert-danger" : ""} >{itemGuest["Country/Nationality"]}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Type"] ? "alert-danger" : ""} >{itemGuest.Type}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportNumber"] ? "alert-danger" : ""} >{itemGuest.PassportNumber}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportExpireDate"] ? "alert-danger" : ""} >{itemGuest.PassportExpireDate}</td>
                                                    <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportIssueingCountry"] ? "alert-danger" : ""} >{itemGuest.PassportIssueingCountry}</td>
                                                  </tr>
                                                )
                                              })
                                              }

                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    }
                                    {guests.length === 0 &&
                                      <tr>
                                        <td colSpan="80">
                                          <span className="col-lg-12 alert alert-danger mb-0 d-inline-block">
                                            Guest information required.
                                          </span>
                                        </td>
                                      </tr>
                                    }
                                  </React.Fragment>)
                                })}


                              {
                                !isLoading && results &&
                                results.length === 0 &&
                                <tr>
                                  <td className="text-center" colSpan={5}>No Bookings found.</td>
                                </tr>
                              }
                            </tbody>
                          </table>

                        </div>
                      </div>
                      <div className={"col-lg-12 mt-3"} >
                        <h5>Traveler Details</h5>
                        <div className="table-responsive">
                          <table className="table border table-column-width" id="sheet1">
                            <thead className="thead-light">
                              <tr>
                                {["Itinerary", "#", "First Name", "Last Name", "Gender", "Birth Date", "City", "Country/Nationality", "Type", "Passport Number", "Passport Expire Date", "Passport Issueing Country"].map((data, i) => {
                                  return (<th width={table_column_width[data]} scope="col" key={i}>{data}</th>)
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {tripItemData.map((item, key) => {
                                let i = (tripData.tripCounter + 1) + "_" + (item.tripItemCounter + 1) + "_";
                                let guests = [];
                                if (item["Business"] && item["Business"].toLowerCase() === "hotel") {
                                  let getHotelPaxInfoObj = this.getHotelPaxInfoObj(item);
                                  guests = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter);//&& x.Type ==="ADT"
                                  guests = guests.slice(0, getHotelPaxInfoObj);
                                }
                                else if (item["Business"] && (item["Business"].toLowerCase() === "activity" || item["Business"].toLowerCase() === "transfers" || item["Business"].toLowerCase() === "custom")) {
                                  guests = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter);//&& x.Type ==="ADT"
                                  guests = guests.slice(0, 1);
                                }
                                else if (item["Business"] && (item["Business"].toLowerCase() === "flight" || item["Business"].toLowerCase() === "air")) {
                                  if (!isNaN(parseInt(item["NoofAdult"]))) {
                                    let guestsADT = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "ADT");
                                    guestsADT = guestsADT.slice(0, parseInt(item["NoofAdult"]));
                                    guests = guests.concat(guestsADT);
                                  }
                                  if (!isNaN(parseInt(item["NoofChild"]))) {
                                    let guestsCHD = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "CHD");
                                    guestsCHD = guestsCHD.slice(0, parseInt(item["NoofChild"]));
                                    guests = guests.concat(guestsCHD);
                                  }
                                  if (!isNaN(parseInt(item["NoofInfant"]))) {
                                    let guestsINF = resultsGuests.filter(x => x.tripCounter === tripData.tripCounter && x.Type === "INF");
                                    guestsINF = guestsINF.slice(0, parseInt(item["NoofInfant"]));
                                    guests = guests.concat(guestsINF);
                                  }
                                }
                                return guests.map((itemGuest, key) => {
                                  return (
                                    <tr key={key}>
                                      <td style={{ "textTransform": "capitalize" }}>{key === 0 ? item.Business.toLowerCase() + " (" + ((item.Business.toLowerCase() === "air" || item.Business.toLowerCase() === "transfers") ? (item.FromLocation + " - " + item.ToLocation) : item.Name) + ")" : ""}</td>
                                      <td>{key + 1}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "FirstName"] ? "alert-danger" : ""} >{itemGuest.FirstName}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "LastName"] ? "alert-danger" : ""} >{itemGuest.LastName}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Gender"] ? "alert-danger" : ""} >{itemGuest.Gender}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "BirthDate"] ? "alert-danger" : ""} >{itemGuest.BirthDate}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "City"] ? "alert-danger" : ""} >{itemGuest.City}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Country/Nationality"] ? "alert-danger" : ""} >{itemGuest["Country/Nationality"]}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "Type"] ? "alert-danger" : ""} >{itemGuest.Type === "ADT" ? "Adult" : itemGuest.Type === "CHD" ? "Child" : "Infant"}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportNumber"] ? "alert-danger" : ""} >{itemGuest.PassportNumber}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportExpireDate"] ? "alert-danger" : ""} >{itemGuest.PassportExpireDate}</td>
                                      <td className={dataErrors["guest_" + (itemGuest.tripCounter + 1) + "_" + (itemGuest.tripItemCounter + 1) + "_" + "PassportIssueingCountry"] ? "alert-danger" : ""} >{itemGuest.PassportIssueingCountry}</td>
                                    </tr>
                                  )
                                })
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </React.Fragment>
                  })}
                  <div className="col-lg-12">
                    <div className="table-responsive"></div>
                  </div>
                </div>
                {isLoading &&
                  <div className="row mt-3 small">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table border" id="sheet1">
                          <thead className="thead-light">
                            <tr>
                              {["Trip Name", "Customer Name", "Email", "Phone", "Start Date", "End Date", "Duration"].map((data, key) => {
                                return (<th scope="col" key={key}>{data}</th>)
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading && (<TableLoading columns={8} />)}

                          </tbody>
                        </table>

                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table border table-column-width" id="sheet2">
                          <thead className="thead-light">
                            <tr>
                              {[
                                "Business",
                                "From Location",
                                "To Location",
                                "Name",
                                "Start Date",
                                "End Date",
                                "Supplier Cost Price",
                                "Supplier Tax",
                                "Agent Cost Price",
                                "Agent Markup",
                                "Discount",
                                "CGST",
                                "SGST",
                                "SGST",
                                "IGST",
                                "Vendor",
                                "Confirmation Number",
                                "Item Type",
                                "Description",
                                "Book Before",
                                "Rating",
                                "Nights",
                                "Meal Type",
                                "Duration",
                                "Guests",
                                "Pickup Time",
                                "Room 1 Adults",
                                "Room 1 Children",
                                "Room 1 Room Type",
                                "Room 2 Adults",
                                "Room 2 Children",
                                "Room 2 Room Type",
                                "Room 3 Adults",
                                "Room 3 Children",
                                "Room 3 Room Type",
                                "Room 4 Adults",
                                "Room 4 Children",
                                "Room 4 Room Type",
                                "Room 5 Adults",
                                "Room 5 Children",
                                "Room 5 Room Type",
                                "Room 6 Adults",
                                "Room 6 Children",
                                "Room 6 Room Type",
                                "No of. Adult",
                                "No of. Child",
                                "No of. Infant",
                                "RoundTrip?",
                                "Day Depart",
                                "Day Depart End",
                                "Depart Start Date",
                                "Depart End Date",
                                "Depart Start Time",
                                "Depart End Time",
                                "Depart Airline Name",
                                "Depart Flight Number",
                                "Depart Class",
                                "Depart Stops",
                                "Depart Duration (Hour)",
                                "Depart Duration (Minute)",
                                "Depart Duration",
                                "Total Depart Duration",
                                "Day Return",
                                "Day Return End",
                                "Return Start Date",
                                "Return End Date",
                                "Return Start Time",
                                "Return End Time",
                                "Return Airline Name",
                                "Return Flight Number",
                                "Return Class",
                                "Return Stops",
                                "Total Return Duration",
                                "Return Duration (Hour)",
                                "Return Duration (Minute)",
                                "Return Duration",
                                "Total Return Duration",
                              ].map((data, key) => {
                                return (<th width={table_column_width[data]} key={key} scope="col">{data}</th>)
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading && (<TableLoading columns={62} />)}
                          </tbody>
                        </table>

                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        {this.state.showInstructionPopup ? (
          <ModelPopup
            sizeClass={this.state.popupSizeClass ?? "modal-lg"}
            header={this.state.popupHeader}
            content={this.state.popupContent
            }
            handleHide={this.handleInstructionPopup}
          />
        ) : null}
      </div >
    )
  }
}

const table_column_width = {
  "Trip Number": 80,
  "Business": 100,
  "From Location": 200,
  "To Location": 200,
  "Name": 300,
  "Start Date": 100,
  "End Date": 100,
  "Vendor": 200,
  "Confirmation Number": 200,
  "Item Type": 200,
  "Description": 200,
  "Supplier Currency": 100,
  "Conversion Rate": 100,
  "Book Before": 100,
  "Rating": 100,
  "Meal Type": 200,
  "Duration": 200,
  "Guests": 100,
  "No of. Adult": 100,
  "No of. Child": 100,
  "No of. Infant": 100,
  "Pickup Time": 100,
  "Depart Start Date": 100,
  "Depart End Date": 100,
  "Depart Start Time": 100,
  "Depart End Time": 100,
  "Depart Airline Name": 200,
  "Depart Flight Number": 150,
  "Depart Class": 100,
  "Depart Stops": 100,
  "Depart Duration (Hour)": 150,
  "Depart Duration (Minute)": 150,
  "Return Start Date": 100,
  "Return End Date": 100,
  "Return Start Time": 100,
  "Return End Time": 100,
  "Return Airline Name": 200,
  "Return Flight Number": 150,
  "Return Class": 100,
  "Return Stops": 100,
  "Total Return Duration": 100,
  "Return Duration (Hour)": 150,
  "Return Duration (Minute)": 150,
  "RoundTrip?": 100,
  "uuid": 400,
  "Day": 100,
  "Nights": 100,
  "Day Depart": 100,
  "Day Depart End": 100,
  "Day Return": 100,
  "Day Return End": 100,
  "Dates": 100,
  "Dates Is Valid": 100,
  "Cut Of Days": 100,
  "Stay In Days": 100,
  "Depart Duration": 100,
  "Return Duration": 100,
  "Total Depart Duration": 100,
  "Supplier Cost Price": 100,
  "Supplier Tax": 100,
  "Agent Cost Price": 100,
  "Agent Markup": 100,
  "Discount": 100,
  "CGST": 100,
  "SGST": 100,
  "SGST": 100,
  "IGST": 100,
  "Sell Price": 100,
  "Room 1 Adults": 100,
  "Room 1 Children": 100,
  "Room 1 Room Type": 200,
  "Room 2 Adults": 100,
  "Room 2 Children": 100,
  "Room 2 Room Type": 200,
  "Room 3 Adults": 100,
  "Room 3 Children": 100,
  "Room 3 Room Type": 200,
  "Room 4 Adults": 100,
  "Room 4 Children": 100,
  "Room 4 Room Type": 200,
  "Room 5 Adults": 100,
  "Room 5 Children": 100,
  "Room 5 Room Type": 200,
  "Room 6 Adults": 100,
  "Room 6 Children": 100,
  "Room 6 Room Type": 200,
  "First Name": 100,
  "Last Name": 100,
  "Gender": 100,
  "Birth Date": 100,
  "City": 100,
  "Country/Nationality": 200,
  "Type": 100,
  "Passport Number": 100,
  "Passport Expire Date": 100,
  "Passport Issueing Country": 200,
  "Itinerary": 150,
  "#": 20
}

const excelFields = [
  "TripNumber",
  "TripName",
  "CustomerName",
  "Email",
  "Phone",
  "TripStartDate",
  "TripEndDate",
  "Business",
  "FromLocation",
  "ToLocation",
  "Name",
  "StartDate",
  "EndDate",
  "Vendor",
  "ConfirmationNumber",
  "ItemType",
  "Description",
  "SupplierCurrency",
  "ConversionRate",
  "BookBefore",
  "Rating",
  "MealType",
  "Duration",
  "Guests",
  "NoofAdult",
  "NoofChild",
  "NoofInfant",
  "PickupTime",
  "DayDepart",
  "DayDepartEnd",
  "DepartStartDate",
  "DepartEndDate",
  "DepartStartTime",
  "DepartEndTime",
  "DepartAirlineName",
  "DepartFlightNumber",
  "DepartClass",
  "DepartStops",
  "DepartDurationHour",
  "DepartDurationMinute",
  "DayReturn",
  "DayReturnEnd",
  "ReturnStartDate",
  "ReturnEndDate",
  "ReturnStartTime",
  "ReturnEndTime",
  "ReturnAirlineName",
  "ReturnFlightNumber",
  "ReturnClass",
  "ReturnStops",
  "ReturnDurationHour",
  "ReturnDurationMinute",
  "RoundTrip",
  "Nights",
  "SupplierCostPrice",
  "SupplierTax",
  "AgentCostPrice",
  "AgentMarkup",
  "Discount",
  "CGST",
  "SGST",
  "SGST",
  "IGST",
  "SellPrice",
  "Room1Adults",
  "Room1Children",
  "Room1RoomType",
  "Room2Adults",
  "Room2Children",
  "Room2RoomType",
  "Room3Adults",
  "Room3Children",
  "Room3RoomType",
  "Room4Adults",
  "Room4Children",
  "Room4RoomType",
  "Room5Adults",
  "Room5Children",
  "Room5RoomType",
  "Room6Adults",
  "Room6Children",
  "Room6RoomType",
]
const excelFieldsGuest = [
  "TripNumber",
  "FirstName",
  "LastName",
  "Gender",
  "BirthDate",
  "City",
  "Country/Nationality",
  "Type",
  "PassportNumber",
  "PassportExpireDate",
  "PassportIssueingCountry",
]
export default ImportBookings;
