import React, { Component } from 'react'
import SVGIcon from "../helpers/svg-icon";
import QuotationMenu from "../components/quotation/quotation-menu";
class DebitNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleMenuClick = (req, redirect) => {
        if (redirect) {
            if (redirect === "back-office")
                this.props.history.push(`/Backoffice/${req}`);
            else {
                this.props.history.push(`/Reports`);
            }
            window.location.reload();
        } else {
            this.props.history.push(`${req}`);
        }
    };
    render() {
        return (
            <div>
                <div className="title-bg pt-3 pb-3 mb-3">
                    <div className="container">
                        <h1 className="text-white m-0 p-0 f30">
                            <SVGIcon
                                name="file-text"
                                width="24"
                                height="24"
                                className="mr-3"
                            ></SVGIcon>
                            Debit Note
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 hideMenu">
                            <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
                        </div>
                        <div className="col-lg-9 d-flex flex-wrap justify-content-center align-content-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 text-center text-secondary">
                                        <h1 className="">Coming Soon</h1>
                                        <div className="module">
                                            <h5>Debit note will be generated from supplier reconciliation screen to the supplier</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default DebitNote;
