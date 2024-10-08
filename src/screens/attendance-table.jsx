import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import moment from "moment";
import QuotationMenu from "../components/quotation/quotation-menu";
import * as Global from "../helpers/global";
import Datecomp from '../helpers/date';

class AttendanceTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendanceReportData: [],
            dates: [],
            isHideEmpTime: false,
        };
    }
    timeConvert = (n) => {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "m";
    }
    handleHideTime = (isHideEmpTime) => {
        this.setState({ isHideEmpTime: !isHideEmpTime });
    }

    render() {
        let { isHideEmpTime } = this.state;
        let { attendanceReportData, attedanceReportFromDate, attendanceReportToDate, isBtnLoading } = this.props.attendanceReportData;
        let attedanceDetailsData = attendanceReportData;
        let dates = [];
        let startDate = moment(attedanceReportFromDate.split('T')[0]).format(Global.DateFormate);
        let EndDate = moment(attendanceReportToDate.split('T')[0]).format(Global.DateFormate);
        while (startDate <= EndDate) {
            dates.push(startDate);
            startDate = moment(startDate).add(1, "days").format(Global.DateFormate);
        }

        let gmtTimeDifference = (new Date()).getTimezoneOffset() * -1;
        //let gmtTimeDifference = userInfo.gmtTimeDifference;

        return (

            <React.Fragment>
                <div className="col-lg-12">
                    <div className='row'>
                        <div className='col-lg-6'>
                            <h4 className='text-primary'>Attendance Report
                            </h4>
                        </div>
                        <div className='col-lg-5'>
                            <div className="custom-control custom-switch d-inline-block mr-4  pull-right mb-3">
                                <input
                                    id="showTimeReport"
                                    name="showTimeReport"
                                    type="checkbox"
                                    className="custom-control-input"
                                    value={this.state.isHideEmpTime}
                                    checked={this.state.isHideEmpTime ? true : false}
                                    onChange={() => { this.handleHideTime(this.state.isHideEmpTime) }}
                                />

                                <label
                                    className="custom-control-label text-secondary"
                                    htmlFor="showTimeReport"
                                >
                                    {/* {this.state.isHideEmpTime ? "Show Time" : "Hide Time"} */}
                                    <small style={{ fontSize: "1rem" }}><p>Attendance View</p></small>
                                </label>

                            </div>
                        </div>
                        <div className='col-lg-1'>
                            {!this.state.reportLoading &&
                                <button className="btn btn-sm btn-primary pull-right" onClick={() => this.props.getExcelReport(true, this.state.isHideEmpTime)}>Export</button>
                            }
                            {this.props.isAttendanceReport &&
                                <button
                                    className="btn btn-sm btn-primary pull-right"
                                >
                                    {this.props.isAttendanceReport &&
                                        <span className="spinner-border spinner-border-sm mr-2"></span>
                                    }
                                    Export
                                </button>
                            }
                        </div>
                    </div>

                </div>

                <div className='col-lg-12'>
                    <div className="table-responsive">
                        <table className="table border table-column-width" id="sheet1">
                            <thead className="thead-light">
                                <tr>
                                    <th width={isHideEmpTime ? 200 : table_column_width["Employee"]}
                                        rowspan={!isHideEmpTime ? "2" : "0"}
                                        scope="col"
                                        className='sticky-col first-col p-5'
                                        style={{ borderRight: "2px solid #dee2e6" }}>Employee</th>
                                    {dates.map((data, key) => {
                                        return (
                                            <React.Fragment>
                                                <th width={isHideEmpTime ? 120 : table_column_width["Date"]}
                                                    key={key} scope="col"
                                                    colspan={!isHideEmpTime ? "3" : "0"}
                                                    style={{ borderRight: "2px solid #dee2e6", borderBottom: "2px solid #dee2e6" }}
                                                    className="text-center">
                                                    <Datecomp date={dates[key]} />

                                                </th>
                                            </React.Fragment>
                                        )
                                    })}
                                </tr>
                                {!isHideEmpTime &&
                                    <tr>
                                        {dates.map((data, key) => {
                                            return (
                                                <React.Fragment>
                                                    <td className='p-1  text-center' width={table_column_width["In"]} scope="col" style={{ borderBottom: "2px solid #dee2e6", borderRight: "2px solid #dee2e6" }}>In</td>
                                                    <td className='p-1  text-center' width={table_column_width["Out"]} scope="col" style={{ borderBottom: "2px solid #dee2e6", borderRight: "2px solid #dee2e6" }}>Out</td>
                                                    <td className='p-1  text-center' width={table_column_width["Total"]} scope="col" style={{ borderRight: "2px solid #dee2e6", borderBottom: "2px solid #dee2e6" }}>Total</td>
                                                </React.Fragment>
                                            )
                                        })}
                                    </tr>}
                            </thead>
                            <tbody>
                                {attedanceDetailsData.map((data, key) => {
                                    return (
                                        <tr>
                                            <td
                                                className='p-1 pl-3 sticky-col first-col'
                                                width={table_column_width["Emp Name"]}
                                                scope="col"
                                                style={{ borderRight: "2px solid #dee2e6" }}
                                            >{data.name}</td>

                                            {dates.map(datemap => {
                                                return <React.Fragment>
                                                    {!isHideEmpTime && <td className='p-1 text-center' width={table_column_width["Emp In"]} scope="col" style={{ borderRight: "2px solid #dee2e6" }}>{data['in-' + datemap] ? moment(data['in-' + datemap]).add(gmtTimeDifference, 'minutes').format('LT') : "-"}</td>}
                                                    {!isHideEmpTime && <td className='p-1  text-center' width={table_column_width["Emp Out"]} scope="col" style={{ borderRight: "2px solid #dee2e6" }}>
                                                        <div>{data['out-' + datemap] ? moment(data['out-' + datemap]).add(gmtTimeDifference, 'minutes').format('LT') : "-"}</div>
                                                        {data['out-' + datemap] && data['out-' + datemap].indexOf(datemap) === -1 &&
                                                            <small><Datecomp date={moment(data['out-' + datemap]).add(gmtTimeDifference, 'minutes')} /></small>}
                                                    </td>}
                                                    <td className='p-1  text-center' width={table_column_width["Emp Total"]} scope="col" style={{ borderRight: "2px solid #dee2e6" }}>
                                                        {data['time-' + datemap] ? this.timeConvert(data['time-' + datemap]) : "-"}
                                                    </td>
                                                </React.Fragment>
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default AttendanceTable;

const table_column_width = {
    "Employee": 200,
    "Date": 240,
    "In": 80,
    "Out": 80,
    "Total": 80,
    "Emp Name": 200,
    "Emp In": 80,
    "Emp Out": 80,
    "Emp Total": 80,
}
