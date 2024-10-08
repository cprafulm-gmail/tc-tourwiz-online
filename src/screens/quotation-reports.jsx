import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import { Helmet } from "react-helmet";
import moment from "moment";
import { Trans } from "../helpers/translate";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import QuotationMenu from '../components/quotation/quotation-menu';
import QuotationListFilters from "../components/quotation/quotation-list-filters";
import QuotationReportFilters from "../components/quotation/quotation-report-filters";
import TableLoading from "../components/loading/table-loading"
import Pagination from "../components/booking-management/booking-pagination"
import ExcelExport from "../components/reports/inquiry-excel"
import * as Global from "../helpers/global";
import DateComp from "../helpers/date";
import Amount from "../helpers/amount";
import XLSX from "xlsx";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../components/common/authorize-component";
import ModelPopupAuthorize from "../helpers/modelforauthorize";
import ActivityLogDetails from "../components/quotation/activity-log-details";
import ModelPopup from '../helpers/model';
class QuotationReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: "",
      isDeleteConfirmPopup: false,
      deleteItem: "",
      type: "Itinerary",
      importItineraries: "",
      exportData: null,
      isImport: false,
      isFilters: true,
      currentPage: 0,
      pageSize: 10,
      hasNextPage: false,
      isBtnLoading: false,
      filter: {
        customername: "",
        email: "",
        phone: "",
        title: "",
        fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        dateMode: "",
        specificmonth: "1",
        searchBy: "",
        groupBy: "customer",//"inquirytype",
        stayInDays: 30,
        type: "",
      },
      pageInfo: {
        currentPage: 0,
        pageLength: 10,
        hasNextPage: false,
        hasPreviousPage: false,
        totalResults: 0
      },
      isshowauthorizepopup: false,
      activityLogDetails: null,
      isBtnLoading_activityLog: false,
      employeeList: [{ label: "All", value: 0 }],
      quotationReportTableColumn: [],
      isBtnLoadingMode: "",
    };
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
  getQuotationReport = (isExport) => {
    debugger;
    if (!isExport) { this.setState({ isBtnLoading: true }) }
    var reqURL = "inquiries";
    let cPage = !isExport ? this.state.currentPage : 0
    let pSize = !isExport ? this.state.pageSize : 1000
    // var reqURL = "/quotations/report?page=0&records=10&datefrom=2023-05-23&dateto=2023-06-23&datemode=&searchby=&groupby=customer&type=Itinerary";
    var reqURL =
      "/quotations/report?page=" +
      +cPage +
      "&records=" +
      pSize;

    if (this.state.filter.customername)
      reqURL += "&customername=" + this.state.filter.customername;
    if (this.state.filter.email)
      reqURL += "&email=" + this.state.filter.email;
    if (this.state.filter.phone)
      reqURL += "&phone=" + this.state.filter.phone;
    if (this.state.filter.title)
      reqURL += "&title=" + this.state.filter.title;
    if (this.state.filter.fromDate)
      reqURL += "&datefrom=" + this.state.filter.fromDate;
    if (this.state.filter.toDate)
      reqURL += "&dateto=" + this.state.filter.toDate;
    reqURL += "&datemode=" + this.state.filter.dateMode;


    reqURL += "&searchby=" + this.state.filter.searchBy;
    reqURL += "&groupby=" + this.state.filter.groupBy;
    if (this.state.filter.type)
      reqURL += "&type=" + this.state.filter.type;
    var reqOBJ = {};

    apiRequester_quotation_api(
      reqURL,
      reqOBJ,
      (data) => {
        if (data.error) {
          debugger;
          this.setState({
            results: [],
            defaultResults: [],
            isBtnLoading: false,
            pageInfo: {
              currentPage: 0,
              pageLength: 10,
              hasNextPage: false,
              hasPreviousPage: false,
              totalResults: 0
            }
          });
          return true;
        }

        let results = data.response.data;
        let dataValue = [];
        let rowCount = 0;
        results.map(groupItem => {
          if (this.state.filter.groupBy === "customer") {
            dataValue.push({
              rowCount: rowCount,
              type: "header",
              customerName: groupItem.customerName
            });
          }
          // else if (this.state.filter.groupBy === "inquirytype") {
          //   dataValue.push({
          //     rowCount: rowCount,
          //     type: "header",
          //     inquiryType: groupItem.inquiryType === "Air" ? "Flight" : groupItem.inquiryType
          //   });
          // }
          // else if (this.state.filter.groupBy === "salesteamwise") {
          //   dataValue.push({
          //     rowCount: rowCount,
          //     type: "header",
          //     salesteamwise: groupItem.salesteamwise
          //   });
          // }
          else {
            dataValue.push({
              rowCount: rowCount,
              type: "header",
              customerId: groupItem.customerId,
              customerName: groupItem.customerName,
              cellPhone: groupItem.cellPhone
            });
          }
          groupItem.details.map(item => {
            if (item.email && item.email.endsWith(process.env.REACT_APP_B2CPORTALDOMAIN.replace(".", "@"))) {
              item.email = "";
            }
            dataValue.push({
              rowCount: rowCount++,
              type: "data",
              ...item
            });
          });
          dataValue.push({
            rowCount: rowCount - 1,
            type: "footer",
            status: "Total :",
            budget: groupItem.totalBudget,
          });
        });
        if (results.length > 0) {
          dataValue.push({
            rowCount: rowCount - 1,
            type: "footer",
            status: "Grand Total :",
            budget: dataValue.reduce((sum, item) => sum + (item.type === "data" && item.budget ? item.budget : 0), 0)
          });
        }
        if (!isExport) {
          debugger;
          let pageInfo = this.state.pageInfo;
          let totalRecords = data.response.data.reduce((sum, item) => sum + item.details.length, 0);
          if (results.length > 0) {
            pageInfo["currentPage"] = 0;
            pageInfo["pageLength"] = parseInt(this.state.pageSize);
            pageInfo["hasNextPage"] = this.state.currentPage + 1 < Math.ceil(totalRecords / parseInt(this.state.pageSize));
            pageInfo["hasPreviousPage"] = this.state.currentPage > 1;
            pageInfo["totalResults"] = totalRecords; //data[data.length-1].rowCount + 1;
          }
          debugger;
          this.setState({
            results: dataValue,
            defaultResults: results,
            isBtnLoading: false,
            pageInfo,
            currentPage: 0
          });
        }
        else {
          debugger;
          this.setState({ exportData: dataValue }, () => this.getExcelReport(dataValue));
          debugger;
        }
      },
      "GET"
    );
  };
  getExcelReport(data) {
    const { inquirytype } = this.state.filter;
    debugger;
    let exportData = this.state.exportData.map((item, index) => {
      let headerData = "";
      if (item.type === "header" && this.state.filter.groupBy === "customer") {
        headerData = item.customerName;
      }
      else
        headerData = item.customerName;
      debugger;

      return {
        "Customer Name": item.customerName,
        "Title": item.name,
        "Email": item.email,
        "Phone": item.phone,
        "Duration": item.duration,
        "Start Date": item.startDate,
        "End Date": item.endDate,
        "Created Date": item.createdDate,
        "Status": item.status,
        "Item Type": item.item_type,
        "Booking For": item.bookingFor,
        "Trip Type": item.tripType,
        "Followup Date": item.followupDate,
        "Adult": item.adult,
        "Children": item.children,
        "Infant": item.infant,
        "Priority": item.priority,
        "Budget": item.budget,
      }
    });

    if (exportData.length === 0) {
      exportData = [{
        "Customer Name": "",
        "Title": "",
        "Email": "",
        "Phone": "",
        "Duration": "",
        "Start Date": "",
        "End Date": "",
        "Created Date": "",
        "Status": "",
        "Item Type": "",
        "Booking For": "",
        "Trip Type": "",
        "Followup Date": "",
        "Adult": "",
        "Children": "",
        "Infant": "",
        "Priority": "",
        "Budget": "",
      }]
    }




    const workbook1 = XLSX.utils.json_to_sheet(exportData);
    workbook1['!cols'] = [
      { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 200 }, { wpx: 150 },
      { wpx: 300 }, { wpx: 200 }, { wpx: 200 }, { wpx: 200 }, { wpx: 100 },
      { wpx: 100 }, { wpx: 100 }, { wpx: 75 }, { wpx: 100 }, { wpx: 100 },
      { wpx: 200 }, { wpx: 100 }
    ];
    const workbook = {
      SheetNames: ['Inquiry Report'],
      Sheets: {
        'Inquiry Report': workbook1
      }
    };
    this.setState({ exportData: [], reportLoading: false })
    return XLSX.writeFile(workbook, `InquiryReport.xlsx`);
  }
  getQuotationColumn = (inquirytype) => {
    let tableQuotationData = [
      "Customer Name",
      "Title",
      "Email",
      "Phone",
      "Duration",
      "Start Date",
      "End Date",
      "Created Date",
      "Status",
      "Item Type",
      "Booking For",
      "Trip Type",
      "Followup Date",
      "No Of Travelers",
      "Priority",
      "Budget",
    ];

    this.setState({
      quotationReportTableColumn: tableQuotationData
    })
  }
  componentDidMount() {
    this.getQuotationColumn("");
    this.getQuotationReport();
  }
  showHideFilters = () => {
    this.setState({ isFilters: !this.state.isFilters });
  };
  handleFilters = (data, mode) => {

    let filter = this.state.filter;

    filter["customername"] = data["customername"] ? data["customername"] : "";
    filter["email"] = data["email"] ? data["email"] : "";
    filter["dateMode"] = data["dateMode"] ? data["dateMode"] : "";
    filter["searchBy"] = data["searchBy"] ? data["searchBy"] : "";
    filter["fromDate"] = data["fromDate"] ?
      moment(new Date(data["fromDate"])).format(Global.DateFormate) : null;
    filter["toDate"] = data["toDate"] ?
      moment(new Date(data["toDate"])).format(Global.DateFormate) : null;
    filter["phone"] = data["phone"] ? data["phone"] : "";
    //filter["groupBy"] = data["groupBy"] ?data["groupBy"]:"inquirytype";
    filter["title"] = data["title"] ? data["title"] : "";
    filter["specificmonth"] = data.specificmonth;

    this.setState({ filter, results: [], defaultResults: [], currentPage: 0 }, () => this.getQuotationReport(false));

  };
  handlePaginationResults = (pageNumber, pageLength) => {
    pageNumber = parseInt(pageNumber);
    let pageInfo = this.state.pageInfo;
    if (this.state.results.length > 0) {
      pageInfo["currentPage"] = pageNumber
      pageInfo["pageLength"] = pageLength
      pageInfo["hasNextPage"] = Math.ceil(this.state.results[this.state.results.length - 1].rowCount / pageLength) - 1 > pageNumber
      pageInfo["hasPreviousPage"] = pageNumber > 0
      pageInfo["totalResults"] = this.state.results[this.state.results.length - 1].rowCount + 1
    }
    this.setState({
      currentPage: parseInt(pageNumber),
      pageSize: pageLength,
      pageInfo: pageInfo
    });
  }
  render() {
    const {
      results,
      isFilters,
      isBtnLoading,
      pageInfo,
    } = this.state;
    let startRow = this.state.currentPage === 0 ? 0 : (this.state.currentPage * parseInt(this.state.pageSize));
    let endRow = ((this.state.currentPage * parseInt(this.state.pageSize)) + parseInt(this.state.pageSize)) - 1;
    let renderData = [];
    if (results)
      renderData = results.filter(x => x.rowCount >= startRow && x.rowCount <= endRow);

    let pageInfoIndex = [{ item: pageInfo }];
    const { inquirytype } = this.state.filter;
    const { quotationReportTableColumn } = this.state;
    const title = Trans("_quotationReplaceKey");
    return (
      <div>
        <div className="title-bg pt-3 pb-3 mb-3">
          <Helmet>
            <title>
              {title + " Report"}
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
              {title + " Report"}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 hideMenu">
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div>
            <div className="col-lg-9 mt-2">
              <div className="container">
                <div className="row">
                  <div className="border pt-2 pl-3 pr-3 shadow-sm col-12 mb-3">
                    <div className="mb-3 mt-2 float-left">
                      <label for="reportType" className="pr-3">Report Type</label>
                    </div>
                    <div className="mb-3 mt-1 float-left">
                      <select
                        id="reportType"
                        name="reportType"
                        className="form-control"
                        style={{ width: "auto" }}
                      // onChange={(e) => this.setgroupby(e.target.value)}
                      >
                        <option value="customer">Inquiry Report - Customer Wise</option>
                        {/* <option value="inquirytype">Inquiry Report - Inquiry Type Wise</option> */}
                        {/* {this.state.employeeList.find(x => x.crewID === 3 && x.isLoggedinEmployee)
                          && <option value="salesteamwise">Inquiry Report - Sales Team Wise</option>} */}
                      </select>
                    </div>
                    <div className="mb-3 mt-1 float-right">
                      {!isBtnLoading &&
                        <React.Fragment>
                          {!this.state.reportLoading &&
                            <button
                              className="btn btn-sm btn-primary pull-right"
                              onClick={() => this.getQuotationReport(true)}
                            >Export</button>
                          }
                          {this.state.reportLoading &&
                            <button
                              className="btn btn-sm btn-primary pull-right"
                            >
                              {this.state.reportLoading &&
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              }
                              Export
                            </button>
                          }

                        </React.Fragment>
                      }
                    </div>
                    <div className="mb-3 mt-1 float-right">
                      <button
                        className="btn btn-sm btn-light pull-right mr-2"
                        onClick={this.showHideFilters}
                      >
                        Filters
                      </button>
                    </div>
                  </div>
                  {isFilters && (
                    <QuotationListFilters
                      onRef={ref => (this.myRef = ref)}
                      mode={this.state.type.toLowerCase()}
                      filterData={this.state.filter}
                      handleFilters={this.handleFilters}
                      showHideFilters={this.showHideFilters}
                      filterMode={this.props.match.params.filtermode}
                      isBtnLoadingMode={this.state.isBtnLoadingMode}
                    />
                  )}
                </div>
                <div className="row">
                  <div className="table-responsive">
                    <table className="table border table-column-width" id="sheet1">
                      <thead className="thead-light">
                        <tr>
                          {
                            quotationReportTableColumn.map((data, key) => {
                              return (
                                <th width={table_column_width[data]} key={key} scope="col">{data}</th>
                              )
                            })}
                        </tr>
                      </thead>
                      <tbody>
                        {isBtnLoading && (<TableLoading columns={17} />)}
                        {
                          !isBtnLoading && results &&
                          results.length > 0 &&
                          renderData.map((item, index) => {
                            let noOfTraveller = (Number(item.adult ? item.adult : 0) + Number(item.children ? item.children : 0) + Number(item.infant ? item.infant : 0));
                            var grouptitle = "";
                            if (this.state.filter.groupBy === "customer")
                              grouptitle = item.customerName
                            else if (this.state.filter.groupBy === "salesteamwise")
                              grouptitle = item.salesteamwise
                            return (item.type === "header" ?
                              <tr key={index} className="tbody-group-header">
                                <th colSpan="16">{grouptitle}</th>
                              </tr>
                              : item.type === "data" ?
                                <tr key={index}>
                                  <td className="text-capitalize" style={{ "wordBreak": "break-word" }} id="1">{item.customerName ? item.customerName : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="1">{item.name ? item.name : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="2">{item.email ? item.email : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="3">{item.phone ? item.phone : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="4">{item.duration ? item.duration : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="5">{item.startDate ? <DateComp date={item.startDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="6">{item.endDate ? <DateComp date={item.endDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="7">{item.createdDate ? <DateComp date={item.createdDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="8">{item.status ? item.status : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="9">{item.item_type ? item.item_type : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="15">{item.bookingFor ? item.bookingFor : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="16">{item.tripType ? item.tripType : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="17">{item.followupDate ? <DateComp date={item.followupDate} format={Global.getEnvironmetKeyValue("DisplayDateFormate")} /> : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="18">{noOfTraveller ? noOfTraveller : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="21">{item.priority ? item.priority : "-"}</td>
                                  <td style={{ "wordBreak": "break-word" }} id="24">{item.budget ? <Amount amount={item.budget} currencyCode={item.currencyCode} /> : "-"}</td>
                                </tr>
                                : item.type === "footer" ?
                                  <tr key={index} className="tbody-group-footer">
                                    {(inquirytype !== "" && (inquirytype === "Packages"
                                      || inquirytype === "Hotel"
                                      || inquirytype === "Transfers"
                                      || inquirytype === "Bus"
                                      || inquirytype === "Rent a Car")) &&
                                      <th>&nbsp;</th>
                                    }
                                    {(inquirytype !== "" &&
                                      (inquirytype === "Air" || inquirytype === "Rail")) &&
                                      <> <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                      </>
                                    }
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>                                                                        <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>{item.duration}</th>
                                    {inquirytype !== "" && <th>&nbsp;</th>}
                                    <th>&nbsp;</th>
                                    <th><Amount amount={item.budget} /></th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                  </tr>
                                  : "")
                          })}
                        {
                          !isBtnLoading && results &&
                          results.length === 0 &&
                          <tr>
                            <td className="text-center" colSpan={9}>No records found.</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="col-lg-12 report-pagination">
                    {!isBtnLoading && (results &&
                      results.length > 0) && (
                        <Pagination
                          pageInfoIndex={pageInfoIndex}
                          handlePaginationResults={this.handlePaginationResults}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default QuotationReport

const table_column_width = {
  "Customer Name": 200,
  "Title": 200,
  "Email": 250,
  "Phone": 200,
  "Duration": 100,
  "Start Date": 200,
  "End Date": 200,
  "Created Date": 200,
  "Status": 100,
  "Item Type": 100,
  "Booking For": 200,
  "Trip Type": 150,
  "Followup Date": 200,
  "No Of Travelers": 100,
  "Priority": 100,
  "Budget": 150,
}