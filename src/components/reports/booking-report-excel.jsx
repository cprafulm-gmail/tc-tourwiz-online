import React from "react";
import Datecomp from "../../helpers/date";
import XLSX from "xlsx";
class BookingReportExcel extends React.Component {
    componentDidMount() {
        let { data } = this.props;
        const ExportData = [];
        data.map((item) => {
            const itinerary = item[Object.keys(item)[0]];
            const bookingHeader = item[Object.keys(item)[0]][0];
            itinerary.map((booking) => {
                (
                    ExportData.push({
                        Itinerary: bookingHeader.itineraryRefNo,
                        "Business Name": booking.businessShortDescription ===
                            "Excursion"
                            ? "Activity"
                            : booking.businessShortDescription === "GroundService"
                                ? "Ground Service"
                                : booking.businessShortDescription

                                + " - " + booking.details,
                        "Booking Reference Number": booking.bookingRefNo,
                        "Booking Status": (booking.bookingStatus === "Amend Request" ? "AmendRequest" : booking.bookingStatus),
                        "Booking Date": Datecomp({ date: booking.bookingDate }),
                        "Check-In": Datecomp({ date: booking.startDate }),
                        "Check-Out": Datecomp({ date: booking.endDate }),
                        "Guest Name":
                            booking.firstName
                            + " " +
                            booking.lastName,
                        "Emial Address": booking.email,
                        "Deadline Date": Datecomp({ date: booking.deadlineDate }),
                    }))
            })
        })
        const workbook1 = XLSX.utils.json_to_sheet(ExportData);
        workbook1['!cols'] = [{ wpx: 125 }, { wpx: 200 }, { wpx: 125 }, { wpx: 100 }, { wpx: 75 }, { wpx: 75 }, { wpx: 75 }, { wpx: 150 }, { wpx: 150 }, { wpx: 75 }];
        const workbook = {
            SheetNames: ['Booking Report'],
            Sheets: {
                'Booking Report': workbook1
            }
        };
        this.props.onExportComplete();
        return XLSX.writeFile(workbook, `${this.props.filename}.xlsx`);
    }
    render() {
        return null;
    }
}
export default BookingReportExcel;