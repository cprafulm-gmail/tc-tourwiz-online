import ReactExport from "react-export-excel";
import React from "react";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import Datecomp from "../../helpers/date";
import Amount from "../../helpers/amount";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class DownloadEWalletStatement extends React.Component {

    render() {
        let dataSet1 = this.props.data;
        return (
            <ExcelFile
                filename="E-Wallet Statement"
                element={
                    <button className="btn btn-sm btn-primary form-control">
                        <SVGIcon
                            name="filter"
                            width="12"
                            height="12"
                            className="mr-1"
                            type="fill"
                        ></SVGIcon>
                        {Trans("Export")}
                    </button>
                }>
                <ExcelSheet data={dataSet1} name="E-Wallet Statement">
                    <ExcelColumn label="Transaction Date Time"
                        value={col => true ? Datecomp({ date: col.transactionDate }) + " " + Datecomp({ date: col.transactionDate, format: "LT" }) : ""}
                    />
                    <ExcelColumn label="Transaction Amount" value={col => true ? Amount({ amount: col.transactionAmount }) : ""} />
                    <ExcelColumn label="Transaction Type" value="transactionType" />
                    <ExcelColumn label="Comment" value={"comment"} />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default DownloadEWalletStatement;