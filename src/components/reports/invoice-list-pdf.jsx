import React from "react";
import jsPDF from 'jspdf';
import { renderToString } from 'react-dom/server';
import Datecomp from "../../helpers/date";
import autoTable from 'jspdf-autotable'
import Amount from "../../helpers/amount";

class InvoiceListPdf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.printRef = React.createRef();
    }
    // componentDidMount() {
    //     const string = renderToString(this.Prints());
    //     const pdf = new jsPDF("l", "px", [900, 1000]);

    //     pdf.html(string,
    //         {
    //             callback: function (doc) {
    //                 pdf.save(this.props.filename);
    //             }.bind(this),
    //             x: 25,
    //             y: 25
    //         });

    // }
    componentDidMount() {
        let printData = this.props.printData;
        const pdf = new jsPDF("l");
        pdf.setFont("default", "bold");
        let x = 10;
        let y = 20;
        pdf.setFontSize(18);
        autoTable(pdf, {
            html: '#customerinforLabel', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold', fontSize: 18 }
            }
        });
        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#customerInfo', theme: "plain", startY: y,
            columnStyles: {
                0: { fontStyle: 'bold' }
            }
        });
        y = pdf.lastAutoTable.finalY;

        autoTable(pdf, {
            html: '#InvoiceinforLabel', theme: "plain", startY: y + 5,
            columnStyles: {
                0: { fontStyle: 'bold', fontSize: 18 }
            }
        });
        y = pdf.lastAutoTable.finalY;
        autoTable(pdf, {
            html: '#InvoiceInfo', theme: "striped", startY: y, showHead: "everyPage",

        });

        pdf.save(this.props.filename);
        this.props.onExportComplete();
    }
    Prints = () => {
        let InvoiceList = this.props.InvoiceList;
        let customerData = this.props.customerData;
        return (
            <div style={{ width: "900px", "word-wrap": "break-word" }}>
                <table id="customerinforLabel">
                    <tr>
                        <td>
                            Customer Information
                        </td>
                    </tr>
                </table>
                <table id="customerInfo">
                    <tr>
                        <td>
                            Name:
                        </td>
                        <td>
                            {customerData?.firstName}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Email Address:
                        </td>
                        <td>
                            {customerData?.contactInformation?.email ? customerData?.contactInformation?.email : '---'}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Contact Phone:
                        </td>
                        <td>
                            {customerData?.contactInformation?.phoneNumber}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Address:
                        </td>
                        <td>
                            {customerData?.fullAddress}
                        </td>
                    </tr>
                </table>
                <table id="InvoiceinforLabel">
                    <tr>
                        <td>
                            Invoice(s) Information
                        </td>
                    </tr>
                </table>
                <table id="InvoiceInfo"
                    style={{ borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }}
                    border={1}>
                    <thead>
                        <tr style={{ backgroundColor: "#05859e", color: "white" }}>
                            <th>Sr.No.</th>
                            <th>Invoice Date</th>
                            <th>Invoice Number</th>
                            {/* <th>Invoice Currency</th> */}
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Due Amount</th>
                            <th>Last Payment Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    {InvoiceList && InvoiceList.length > 0 &&
                        InvoiceList.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item?.invoiceDate ? <Datecomp date={item.invoiceDate} /> : ""}</td>
                                <td>{item?.invoiceNumber}</td>
                                {/* <td>{item.bookingCurrency}</td> */}
                                <td><Amount amount={item?.invoiceTotalAmount} currencyCode={item.bookingCurrency} /></td>
                                <td><Amount amount={item?.paidAmount} currencyCode={item.bookingCurrency} /></td>
                                <td><Amount amount={item?.dueAmount} currencyCode={item.bookingCurrency} /></td>
                                <td>{item?.lastPaymentDate && item.lastPaymentDate !== "0001-01-01T00:00:00" ? <Datecomp date={item.lastPaymentDate} /> : null}</td>
                                <td>{item?.invoiceReconciliationStatus}</td>
                            </tr>
                        })
                    }
                </table>

                {/* <div style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}>
                    
                    
                </div>
                
                <table style={{ borderCollapse: "collapse", width: "100%", "word-wrap": "break-word" }} border={1}>
                    <tr style={{ backgroundColor: "#05859e", color: "white" }}>
                        <th>Sr.No.</th>
                        <th>Invoice Date</th>
                        <th>Invoice Number</th>
                        <th>Invoice Currency</th>
                        <th>Total Amount</th>
                        <th>Tax Amount</th>
                        <th>Net Amount</th>
                        <th>Paid Amount</th>
                        <th>Due Amount</th>
                        <th>Last Payment Date</th>
                        <th>Status</th>
                        <th>Comments</th>
                    </tr>
                    {InvoiceList && InvoiceList.length > 0 &&
                        InvoiceList.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.invoiceDate ? <Datecomp date={item.invoiceDate} /> : ""}</td>
                                <td>{item.invoiceNumber}</td>
                                <td>{item.bookingCurrency}</td>
                                <td>{item.invoiceTotalAmount}</td>
                                <td>{item.invoiceTaxAmount}</td>
                                <td>{item.invoiceNetAmount}</td>
                                <td>{item.paidAmount}</td>
                                <td>{item.dueAmount}</td>
                                <td>{item.lastPaymentDate ? <Datecomp date={item.lastPaymentDate} /> : null}</td>
                                <td>{item.invoiceReconciliationStatus}</td>
                                <td>{item.comments}</td>
                            </tr>
                        })
                    }
                </table>
             */}

            </div>
        )
    }
    render() {
        return (
            this.Prints()
        );
    }
}
export default InvoiceListPdf;