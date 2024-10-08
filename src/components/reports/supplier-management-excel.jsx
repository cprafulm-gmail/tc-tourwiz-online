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
        let { data } = this.props;
        data.map((item) => {
            item.contactPerson = item.contactPerson ? item.contactPerson : "---";
            item.phone = item.phone ? item.phone : "---";
            item.email = item.email ? item.email : "---";
            item.companyAddress1 = item.companyAddress1 ? item.companyAddress1 : "---";
            item.serviceTaxRegNumber = item.serviceTaxRegNumber ? item.serviceTaxRegNumber : "---";
        });
        return (
            <ExcelFile filename={this.props.filename} element={<button id="excel">Download</button>}>
                <ExcelSheet data={this.props.data} name="Supplier">
                    <ExcelColumn label={"Business"} value={"businessId"} />
                    <ExcelColumn label={"Supplier Name"} value={"supplierName"} />
                    <ExcelColumn label={"Supplier Id"} value={"supplierID"} />
                    <ExcelColumn label={"Contact Person"} value={"contactPerson"} />
                    <ExcelColumn label={"Phone"} value={"phone"} />
                    <ExcelColumn label={"Email Address"} value={"email"} />
                    <ExcelColumn label={"Address"} value={"companyAddress1"} />
                    <ExcelColumn label={"Currency"} value={"currencySymbol"} />
                    <ExcelColumn label={"Country"} value={"countryName"} />
                    <ExcelColumn label={"State"} value={"stateName"} />
                    <ExcelColumn label={"City"} value={"cityName"} />
                    <ExcelColumn label={"serviceTaxRegNumber"} value={"serviceTaxRegNumber"} />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
export default InvoiceListExcel;