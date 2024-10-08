import React, { Component } from 'react'
import Form from '../components/common/form';
import moment from "moment";

class AttendanceGenrateReport extends Form {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                fromDate: moment().add(-1, 'M').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
                dateMode: "last-7-days",
                specificmonth: "1",
            },
            errors: {},
        };
    }
    getDateDetails = () => {
        if (this.state.data.dateMode === "specific-month") {
            var data = this.state.data;
            var date = (moment().set('month', this.state.data.specificmonth - 1)).format('YYYY-MM-DD')
            data.fromDate = date;
            data.toDate = date;
            this.props.getDateDetails(this.state.data);
        }
        else {
            this.props.getDateDetails(this.state.data);
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="col-lg-3">
                    {this.renderSelect("dateMode", "Attendance Date", dateMode, "value", "type")}
                </div>
                {this.state.data.dateMode === "specific-month" &&
                    <div className="col-lg-3">
                        {this.renderSelect("specificmonth", "Specific Month", month, "value", "name")}
                    </div>
                }
                {(this.state.data.dateMode === "specific-date" || this.state.data.dateMode === "between-dates") &&
                    <div className="col-lg-3">
                        {this.renderCurrentDateWithDuration("fromDate", (this.state.data.dateMode === "specific-date" ? "Specific Date" : "Start Date"), '2010-01-01')}
                    </div>
                }
                {this.state.data.dateMode === "between-dates" &&
                    <div className="col-lg-3">
                        {this.renderCurrentDateWithDuration("toDate", "End Date", '2010-01-01')}
                    </div>
                }
                <div className='col-lg-3'>
                    <label className="d-block">&nbsp;</label>
                    {this.props.isBtnLoading ? <button
                        name="Apply"
                        className="btn btn-primary"
                    >
                        Apply
                    </button> :
                        <button
                            name="Apply"
                            onClick={this.getDateDetails}
                            className="btn btn-primary"
                        >
                            Apply
                        </button>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default AttendanceGenrateReport;
const dateMode = [
    { type: "This Month", value: "this-month" },
    { type: "Previous Month", value: "previous-month" },
    { type: "Specific Month", value: "specific-month" },
    { type: "Today", value: "today" },
    { type: "Yesterday", value: "yesterday" },
    { type: "Last 7 days", value: "last-7-days" },
    { type: "Specific Date", value: "specific-date" },
    { type: "Between Dates", value: "between-dates" }
];
const month = [
    { value: "1", name: "January" },
    { value: "2", name: "February" },
    { value: "3", name: "March" },
    { value: "4", name: "April" },
    { value: "5", name: "May" },
    { value: "6", name: "June" },
    { value: "7", name: "July" },
    { value: "8", name: "August" },
    { value: "9", name: "September" },
    { value: "10", name: "October" },
    { value: "11", name: "November" },
    { value: "12", name: "December" },
];