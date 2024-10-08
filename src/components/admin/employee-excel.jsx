import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class InvoiceListExcel extends React.Component {
    componentDidMount() {
        document.getElementById("excel").click();
        this.props.onExportComplete();
    }
    render() {
        return (
            <ExcelFile filename={this.props.filename} element={<button id="excel">Download</button>}>
                <ExcelSheet data={this.props.data} name="Supplier">

                    <ExcelColumn label={"First Name"} value={"firstName"} />
                    <ExcelColumn label={"Last Name"} value={"lastName"} />
                    <ExcelColumn label={"Email Address"} value={"email"} />
                    <ExcelColumn label={"Phone Number"} value={"cellPhone"} />
                    <ExcelColumn label={"City"} value={"cityName"} />
                    {/* <ExcelColumn label={"Active"} value={"isActive"} /> */}
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
export default InvoiceListExcel;