import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
import AttendanceTable from './attendance-table';
import { apiRequester_unified_api } from "../services/requester-unified-api";
import AttendanceGenrateReport from './attendance-genrate-report';
import Loader from '../components/common/loader';
import moment from "moment";
import XLSX from "xlsx";
import * as Global from "../helpers/global";
import Datecomp from '../helpers/date';
import { Helmet } from "react-helmet";

class AttendanceReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceReportData: [],
            attedanceReportFromDate: '',
            attendanceReportToDate: '',
            dateMode: 'last-7-days',
            fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            isBtnLoading: false,
            specificmonth: "1",
            exportData: false,
            getDates: [],
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
    getDateDetails = (data) => {
        this.setState({ dateMode: data.dateMode, fromDate: data.fromDate, toDate: data.toDate });
        this.getAttedanceReport(data.dateMode, data.fromDate, data.toDate, this.props.getExcelReport);
    }
    getAttedanceReport = (dateMode, fromDate, toDate) => {
        this.setState({ isBtnLoading: true });
        let reqOBJ = {};
        let reqURL = "user/attandencereport?datefrom=" + fromDate + "&dateto=" + toDate + "&datemode=" + dateMode;
        apiRequester_unified_api(
            reqURL,
            reqOBJ,
            function (data) {
                this.setState({
                    attendanceReportData: data.response.attendanceData,
                    attedanceReportFromDate: data.response.fromDate,
                    attendanceReportToDate: data.response.toDate,
                    isBtnLoading: false
                })
            }.bind(this),
            "POST"
        );
    }
    timeConvert = (n) => {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "m";
    }
    getExcelReport = (data, isHideEmpTime) => {
        let gmtTimeDifference = (new Date()).getTimezoneOffset() * -1;
        let getDates = [];
        let startDate = moment(this.state.attedanceReportFromDate.split('T')[0]).format(Global.DateFormate);
        let EndDate = moment(this.state.attendanceReportToDate.split('T')[0]).format(Global.DateFormate);
        while (startDate <= EndDate) {
            getDates.push(startDate);
            startDate = moment(startDate).add(1, "days").format(Global.DateFormate);
        }
        var header = ["Employee"];
        var objGeneral1 = {
            "Employee": "",
        }
        getDates.map((data, key) => {
            header.push(Datecomp({ date: getDates[key] }));
            !isHideEmpTime && header.push('');
            !isHideEmpTime && header.push('');
            !isHideEmpTime && (objGeneral1['in-' + getDates[key]] = "In");
            !isHideEmpTime && (objGeneral1['out-' + getDates[key]] = "Out");
            !isHideEmpTime && (objGeneral1['time-' + getDates[key]] = "Total");
        });

        let exportData = this.state.attendanceReportData.map((item) => {
            var objGeneral = {
                "Employee": item.name,
            }
            var objDate;

            getDates.map((data, key) => {
                objGeneral[isHideEmpTime ? getDates[key] : 'in-' + getDates[key]] = item['in-' + getDates[key]]
                    ? moment(item['in-' + getDates[key]]).add(gmtTimeDifference, 'minutes').format('LT')
                    : "-" ?? "-";
                objGeneral[isHideEmpTime ? getDates[key] : 'out-' + getDates[key]]
                    = item['out-' + getDates[key]] && item['out-' + getDates[key]].indexOf(getDates[key]) !== -1
                        ? moment(item['out-' + getDates[key]]).add(gmtTimeDifference, 'minutes').format('LT')
                        : item['out-' + getDates[key]] && item['out-' + getDates[key]].indexOf(getDates[key]) === -1
                            ? moment(item['out-' + getDates[key]]).add(gmtTimeDifference, 'minutes').format('LT') + "\n" + Datecomp({ date: moment(item['out-' + getDates[key]]).add(gmtTimeDifference, 'minutes') })
                            : "-"
                            ?? "-";

                objGeneral[isHideEmpTime ? getDates[key] : 'time-' + getDates[key]] = item['time-' + getDates[key]] ? this.timeConvert(item['time-' + getDates[key]]) : "-" ?? "-";
            })
            Object.assign(objGeneral, objDate);
            return objGeneral;
        })

        var ObjGeneral1 = {
            "Employee Details": "No records found.",
        }
        var objGST1 = {
            "Employee Details": "No Data ",
        }
        Object.assign(ObjGeneral1, objGST1);
        exportData = [objGeneral1].concat(exportData)
        if (exportData.length === 0) {
            exportData.push(ObjGeneral1);
            exportData = [ObjGeneral1]
        }

        //Had to create a new workbook and then add the header
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([]);
        var wscols = [];
        isHideEmpTime ? wscols = [{ wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },]
            : wscols = [
                { wch: 20 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
                { wch: 10 }, { wch: 10 }, { wch: 10 },
            ]

        ws['!cols'] = wscols;
        XLSX.utils.sheet_add_aoa(ws, [header]);

        //Starting in the second row to avoid overriding and skipping headers
        XLSX.utils.sheet_add_json(ws, exportData, { origin: 'A2', skipHeader: true });

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'AttendanceReport.xlsx');
    }
    getDate = () => {
        let { attendanceReportData, attedanceReportFromDate, attendanceReportToDate } = this.state;
        const dates = [];
        while (attedanceReportFromDate <= attendanceReportToDate) {
            dates.push(new Date(attedanceReportFromDate));
            attedanceReportFromDate.setDate(attedanceReportFromDate.getDate() + 1);
        }
        this.setState({ dates });
    }
    componentDidMount() {
        this.getAttedanceReport(this.state.dateMode, this.state.fromDate, this.state.toDate);
    }
    render() {
        let { attendanceReportData, attedanceReportFromDate, attendanceReportToDate } = this.state;
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <Helmet>
                        <title>
                            Attendance Report
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
                            Attendance Report
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9 mt-2">
                            <div className='row'>
                                <AttendanceGenrateReport
                                    getDateDetails={this.getDateDetails}
                                    isBtnLoading={this.state.isBtnLoading}
                                />
                            </div>
                            {!this.state.isBtnLoading && attendanceReportData.length > 0 &&
                                <div className='row'>
                                    <AttendanceTable
                                        attendanceReportData={this.state}
                                        isBtnLoading={this.state.isBtnLoading}
                                        getExcelReport={this.getExcelReport}
                                    />
                                </div>
                            }
                            {this.state.isBtnLoading &&
                                <div className='mt-5'>
                                    <Loader />
                                </div>}
                            {!this.state.isBtnLoading && attendanceReportData.length === 0 &&
                                <div className='row'>
                                    <div className="col-lg-12 mt-5 text-center">
                                        <span>No attendance data found!</span>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AttendanceReport;
