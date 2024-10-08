import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class ExcelExport extends React.Component {
    componentDidMount() {
        document.getElementById("excel").click();
        this.props.onExportComplete();
    }
    render() {
        let { data } = this.props;

        return (
            <ExcelFile filename={"inquiry-report"} element={<button style={{ display: "none" }} id="excel">Download</button>}>
                <ExcelSheet data={data} name="Inquiry">
                    <ExcelColumn label="Customer Name" value="customerName" />
                    <ExcelColumn label="Email Address" value="email" />
                    <ExcelColumn label="Contact Phone" value="phone" />
                    <ExcelColumn label="Inquiry Title / Details" value="title" />
                    <ExcelColumn label="Inquiry Source" value="inquirySource" />
                    <ExcelColumn label="Trip Type" value="tripType" />
                    <ExcelColumn label="Inquiry Type" value="inquiryType" />
                    <ExcelColumn label="Booking For Source" value="bookingFor" />
                    <ExcelColumn label="Duration (Days)" value="duration" />
                    <ExcelColumn label="Month" value="month" />
                    <ExcelColumn label="Budget" value="budget" />
                    <ExcelColumn label="Adults" value="adults" />
                    <ExcelColumn label="Children" value="children" />
                    <ExcelColumn label="Infant(s)" value="infant" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
export default ExcelExport;