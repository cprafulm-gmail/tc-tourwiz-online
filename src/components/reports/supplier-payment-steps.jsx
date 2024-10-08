import React, { Component } from 'react';
class SupplierPaymentSteps extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { isSupplierSet, display, paymentType } = this.props;
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="report-steps">
                        <div className="container">
                            <div className="row pt-3 pb-3 justify-content-center">
                                <div className={isSupplierSet ?
                                    "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                    "step col-3 d-flex flex-wrap justify-content-center "}>
                                    <span className="d-flex">
                                        <a className="d-flex" onClick={() => this.props.stepClick("SelectSupplier")} disabled={!isSupplierSet}>1</a>
                                    </span>
                                    <label className="text-secondary m-0 w-100 text-center mt-1">Select Supplier</label>
                                </div>
                                <div className={isSupplierSet && display != "InvoiceSelection" ?
                                    "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                    "step col-3 d-flex flex-wrap justify-content-center "}>
                                    <span className="d-flex">
                                        <a className="d-flex" onClick={() => this.props.stepClick("InvoiceSelection")} disabled={display !== "SaveForm"}>2</a>
                                    </span>
                                    <label className="text-secondary m-0 w-100 text-center mt-1">Select Invoices</label>
                                </div>
                                {display === "BRNSelection" || (display === "SaveForm" && paymentType === "brnPayment") ? (
                                    <div className={display !== "BRNSelection" ?
                                        "step col-3 d-flex flex-wrap justify-content-center active completed" :
                                        "step col-3 d-flex flex-wrap justify-content-center "}>
                                        <span className="d-flex">
                                            <a className="d-flex" onClick={() => this.props.stepClick("BRNSelection")} disabled={display === "BRNSelection"}>3</a>
                                        </span>
                                        <label className="text-secondary m-0 w-100 text-center mt-1">Select BRN(s)</label>
                                    </div>
                                ) : null}
                                <div className={"step col-3 d-flex flex-wrap justify-content-center "}>
                                    <span className="d-flex">
                                        <a className="d-flex" onClick={() => { this.breadcrumbClick("InvoiceSelection") }} disabled={true}>
                                            {display === "BRNSelection" || (display === "SaveForm" && paymentType === "brnPayment") ? 4 : 3}
                                        </a>
                                    </span>
                                    <label className="text-secondary m-0 w-100 text-center mt-2">Payment Information</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default SupplierPaymentSteps;