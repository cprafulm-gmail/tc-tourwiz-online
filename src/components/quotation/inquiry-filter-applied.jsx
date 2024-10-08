import React, { Component } from 'react'

const InquiryAppliedFilter = props => {

    return (
        <div className='mb-2'>
            <b class="text-primary ">Applied Filters:</b>
            {Object.keys(filterSettings).map((item, index) => {
                let filterSetting = filterSettings[item];
                let value = props.filterData[item];
                if (filterSetting.lookup) {
                    let valueObj = filterSetting.lookup.find(x => x.value === value);
                    if (valueObj) {
                        value = valueObj.type ?? valueObj.name;
                    }
                    else
                        value = "Other";
                }

                //Custom Code Starts
                if (item === "dateMode" && props.filterData[item] === 'specific-date') {
                    value += (" - " + props.filterData["fromDate"]);
                }
                else if (item === "dateMode" && props.filterData[item] === 'between-dates') {
                    value += (" - " + props.filterData["fromDate"] + " to " + props.filterData["toDate"]);
                }
                else if (item === "dateMode" && props.filterData[item] === 'specific-month') {
                    value += (" - " + monthLookup.find(x => x.value === props.filterData["specificmonth"]).name);
                }
                //Custom Code Ends

                return !filterSetting
                    ? <div key={index}></div>
                    : props.filterData[item]
                        ? <div className="btn-group m-1" key={index}>
                            <span className="badge badge-info badge-info-custom">{filterSetting.title ?? ""}  <b>{value}</b>
                                {(filterSetting.isNonRemoveable === undefined || filterSetting.isNonRemoveable !== true) &&
                                    <small className='m-1' style={{ "cursor": "pointer" }} onClick={() => props.removeFilter(item)}> X</small>
                                }
                            </span>
                        </div>
                        : ""
            })}
        </div>
    )
}

const searchByLookup = [
    { value: "", name: "Select" },
    { value: "createddate", name: "Created Date" },
    { value: "startdate", name: "Start Date" },
    { value: "bookbefore", name: "Book Before" },
    { value: "followupdate", name: "Followup Date" }
]

const dateModeLookup = [
    { type: "Select", value: "" },
    { type: "This Year", value: "this-year" },
    { type: "Previous Year", value: "previous-year" },
    { type: "This Month", value: "this-month" },
    { type: "Previous Month", value: "previous-month" },
    { type: "Specific Month", value: "specific-month" },
    { type: "Today", value: "today" },
    { type: "Tomorrow", value: "tomorrow" },
    { type: "Yesterday", value: "yesterday" },
    { type: "Specific Date", value: "specific-date" },
    { type: "Between Dates", value: "between-dates" }
]
const inquirysourceLookup = [
    { value: "", name: "All" },
    { name: "Call Center", value: "Call Center" },
    { name: "Walkin", value: "Walkin" },
    { name: "Email", value: "Email" },
    { value: "Website", name: "Website" },
    { name: "Referred By", value: "Referred By" },
    { name: "Social Media", value: "Social Media" },
    { name: "Self", value: "Self" },
    { name: "Other", value: "Other" }
];

const triptypeLookup = [
    { value: "", name: "All" },
    { value: "Domestic", name: "Domestic" },
    { value: "International", name: "International" },
    { value: "Both", name: "Both" }
];

const inquirytypeLookup = [
    { value: "", name: "All" },
    { value: "Packages", name: "Packages" },
    { value: "Air", name: "Flight" },
    { value: "Hotel", name: "Hotel" },
    { value: "Activity", name: "Activity" },
    { value: "Transfers", name: "Transfers" },
    { value: "Visa", name: "Visa" },
    { value: "Rail", name: "Rail" },
    { value: "Forex", name: "Forex" },
    { value: "Bus", name: "Bus" },
    { value: "Rent a Car", name: "Rent a Car" }
];

const bookingforLookup = [
    { value: "", name: "All" },
    { value: "Individual", name: "Individual" },
    { value: "Corporate", name: "Corporate" }
];

const monthLookup = [
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
const filterSettings = {
    inquirytype: { title: "Inquiry Type", lookup: inquirytypeLookup },
    title: { title: "Title" },
    customername: { title: "Customer Name" },
    email: { title: "Email" },
    phone: { title: "Phone" },
    inquirysource: { title: "Inquiry Source", lookup: inquirysourceLookup },
    triptype: { title: "Trip Type", lookup: triptypeLookup },
    bookingfor: { title: "Booking For", lookup: bookingforLookup },
    searchBy: { title: "Search By", isNonRemoveable: true, lookup: searchByLookup },
    dateMode: { isNonRemoveable: true, lookup: dateModeLookup },
}

export default InquiryAppliedFilter;

