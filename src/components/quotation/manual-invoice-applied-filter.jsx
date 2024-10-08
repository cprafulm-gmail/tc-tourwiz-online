import React, { Component } from 'react'

const ManualInvoicesAppliedFilter = props => {
    return (
        <div>
            <b className="text-primary ">Applied Filters:</b>
            {Object.keys(filterSettings).map((item, index) => {
                let filterSetting = filterSettings[item];
                let value = props.filterData[item];
                if (filterSetting.lookup) {
                    let valueObj = filterSetting.lookup.find(x => x.value === value);
                    value = valueObj.type ?? valueObj.name;
                }

                //Custom Code Starts
                if (item === "dateMode" && props.filterData[item] === 'specific-date') {
                    value += (" - " + props.filterData["createdfromdate"]);
                }
                else if (item === "dateMode" && props.filterData[item] === 'between-dates') {
                    value += (" - " + props.filterData["createdfromdate"] + " to " + props.filterData["createdtodate"]);
                }
                else if (item === "dateMode" && props.filterData[item] === 'specific-month') {
                    value += (" - " + monthLookup.find(x => x.value === props.filterData["specificmonth"]).name);
                }

                {/* if (item === "dateMode" && props.filterData[item] === "specific-month") {
                    let valueObj = filterSetting.lookup.specificmonth.find(x => x.value === value);
                    value = valueObj.type ?? valueObj.name;
                } */}
                //Custom Code Ends

                return !filterSetting
                    ? <div key={index}></div>
                    : props.filterData[item]
                        ? <div className="btn-group m-1" key={index}>
                            <span className="badge badge-info badge-info-custom">{filterSetting.title ?? ""}   <b>{value}</b>
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
const searchByItineraryLookup = [
    { value: "", name: "Select" },
    { value: "invoicedate", name: "Invoice Date" },
    { value: "invoiceduedate", name: "Invoice Due Date" }
];

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
    customerName: { title: "Search By" },
    invoicenumber: { title: "Invoice Number" },
    searchBy: { title: "Search By", isNonRemoveable: true, lookup: searchByItineraryLookup },
    dateMode: { isNonRemoveable: true, lookup: dateModeLookup },
    invoicereconciliationstatus: { title: "Reconciliation Status" },
    type: { title: "Type" },
}

export default ManualInvoicesAppliedFilter;

