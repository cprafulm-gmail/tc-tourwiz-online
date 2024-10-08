import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import SVGIcon from "../../helpers/svg-icon";
import { Trans } from "../../helpers/translate";
import HtmlParser from "../../helpers/html-parser";

class VehicleRentalConditionContent extends Component {
    render() {
        return (
            <React.Fragment>
                < ReactToPrint
                    trigger={() => (
                        <button className="btn btn-primary btn-sm ml-2 pull-right">
                            <SVGIcon name="print" className="mr-1"></SVGIcon>
                            {Trans("_btnPrint")}
                        </button>
                    )}
                    content={() => this.componentRef}
                />
                <PrintContent
                    results={this.props.rentalcontenthtml}
                    ref={el => (this.componentRef = el)}
                />

            </React.Fragment>
        )
    }
}


class PrintContent extends Component {
    render() {
        return <div class="printcontent">{this.props.results}</div>
    }
}


export default VehicleRentalConditionContent;