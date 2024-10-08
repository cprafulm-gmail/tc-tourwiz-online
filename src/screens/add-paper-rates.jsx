import React, { Component } from 'react';
import SVGIcon from "../helpers/svg-icon";
import { Trans } from "../helpers/translate";
import QuotationMenu from "../components/quotation/quotation-menu";
import { apiRequester } from "../services/requester";
import { apiRequester_quotation_api } from "../services/requester-quotation";
import AddPaperRatesForm from './paper-rates-form';

class paperrates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isErrorMsg: "",
      isBtnLoading: false,
      isSucessMsg: false,
      paperRateDetails: [],
      paperRateID: "",
      editMode: "add"
    }
  }
  componentDidMount() {
    //this.getAuthToken();
    const editMode = this.props.location.pathname === "/paperrates" ? false : true;
    this.setState({ editMode });
  }
  /* getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = {};
    apiRequester(reqURL, reqOBJ, (data) => {
      localStorage.setItem("userToken", data.response);
    });
  }; */
  addPaperRates = (state) => {
    this.setState({ isErrorMsg: "", isBtnLoading: true });
    let data = state.data;
    let fromLocation = state.fromLocation;
    let toLocation = state.toLocation;
    let isOnRequest = state.isOnRequest
    var reqURL = "paperrates/addupdate";
    var reqOBJ = {
      business: 4,
      isroundtrip: data.isRoundTrip,
      fromlocation: fromLocation.city,
      tolocation: toLocation.city,
      fromairport: fromLocation.name,
      toairport: toLocation.name,
      fromairportcode: fromLocation.id,
      toairportcode: toLocation.id,
      departfromdate: data.departStartDate + " " + data.departStartTime,
      departtodate: data.departEndDate + " " + data.departEndTime,
      departStartTime: data.departStartTime,
      departEndTime: data.departEndTime,
      departduration: data.departDurationH + "h " + data.departDurationM + "m",
      departairline: data.departAirlineName,
      departflightnumber: data.departFlightNumber,
      departstops: data.departStops,
      departclass: data.departClass,
      returnfromdate: data.returnStartDate + " " + data.returnStartTime,
      returntodate: data.returnEndDate + " " + data.returnEndTime,
      returnStartTime: data.returnStartTime,
      returnEndTime: data.returnEndTime,
      returnduration: data.returnDurationH + "h " + data.returnDurationM + "m",
      returnairline: data.returnAirlineName,
      returnflightnumber: data.returnFlightNumber,
      returnstops: data.returnStops,
      returnclass: data.returnClass,
      supplier: data.supplier,
      supplierprice: data.supplierCostPrice,
      suppliertax: data.supplierTaxPrice,
      sellprice: data.sellPrice,
      markup: data.markupPrice,
      gsttype: data.taxType,
      cgst: data.CGSTPrice,
      sgst: data.SGSTPrice,
      igst: data.IGSTPrice,
      onrequestprice: isOnRequest,
      description: data.description,
      seats: data.seats,
      onhold: data.holdseats,
      blocked: data.blockedseats,
      mode: "add",
      paperrateid: "",
      fromLocationCountry: fromLocation.country,
      toLocationCountry: toLocation.country,
      ProcessingFees: data.processingFees,
      Percentage: data.percentage,
      amountWithoutGST: data.amountWithoutGST,
      isInclusive: data.isInclusive

    }
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      }
      else {
        this.setState({
          isSucessMsg: true,
          isBtnLoading: false,
          paperratesInfo: reqOBJ,
        });
        setTimeout(() => {
          this.setState({ isSucessMsg: false });
          this.props.history.push(`/paperrateslist`);
        }, 2000);
      }
    });

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
  updatePaperRates = (state) => {
    this.setState({ isErrorMsg: "", isBtnLoading: true });
    let data = state.data;
    let fromLocation = state.fromLocation;
    let toLocation = state.toLocation;
    let isOnRequest = state.isOnRequest
    let paperRateID = this.props.location.pathname.replace("/paperrates/", "");

    var reqURL = "paperrates/addupdate";
    var reqOBJ = {
      business: 4,
      isroundtrip: data.isRoundTrip,
      fromlocation: fromLocation.city,
      tolocation: toLocation.city,
      fromairport: fromLocation.name,
      toairport: toLocation.name,
      fromairportcode: fromLocation.id,
      toairportcode: toLocation.id,
      departfromdate: data.departStartDate,
      departtodate: data.departEndDate,
      departfromdate: data.departStartDate + "T" + data.departStartTime,
      departtodate: data.departEndDate + "T" + data.departEndTime,
      departduration: data.departDurationH + "h " + data.departDurationM + "m",
      departairline: data.departAirlineName,
      departflightnumber: data.departFlightNumber,
      departstops: data.departStops,
      departclass: data.departClass,
      returnfromdate: data.returnStartDate + "T" + data.returnStartTime,
      returntodate: data.returnEndDate + "T" + data.returnEndTime,
      returnStartTime: data.returnStartTime,
      returnEndTime: data.returnEndTime,
      returnduration: data.returnDurationH + "h " + data.returnDurationM + "m",
      returnairline: data.returnAirlineName,
      returnflightnumber: data.returnFlightNumber,
      returnstops: data.returnStops,
      returnclass: data.returnClass,
      supplier: data.supplier,
      supplierprice: data.supplierCostPrice,
      suppliertax: data.supplierTaxPrice,
      sellprice: data.sellPrice,
      markup: data.markupPrice,
      gsttype: data.taxType,
      cgst: data.CGSTPrice,
      sgst: data.SGSTPrice,
      igst: data.IGSTPrice,
      onrequestprice: isOnRequest,
      description: data.description,
      seats: data.seats,
      onhold: data.holdseats,
      blocked: data.blockedseats,
      mode: "update",
      paperrateid: paperRateID,
      fromLocationCountry: fromLocation.country,
      toLocationCountry: toLocation.country,
      ProcessingFees: data.processingFees,
      Percentage: data.percentage,
      amountWithoutGST: data.amountWithoutGST,
      isInclusive: data.isInclusive
    }
    apiRequester_quotation_api(reqURL, reqOBJ, (data) => {
      if (data.error) {
        this.setState({ isErrorMsg: data.error, isBtnLoading: false });
      }
      else {
        this.setState({
          isSucessMsg: true,
          isBtnLoading: false,
          paperratesInfo: reqOBJ,
        });
        setTimeout(() => {
          this.setState({ isSucessMsg: false });
          this.props.history.push(`/paperrateslist`);
        }, 2000);

      }

    });
  };
  render() {
    const { isErrorMsg, isSucessMsg, isBtnLoading, paperRateDetails } = this.state;
    const editMode = this.props.location.pathname === "/paperrates" ? false : true;
    return (
      <React.Fragment>
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="file-text"
                width="24"
                height="24"
                className="mr-3"
              ></SVGIcon>
              {!editMode ? "Create" : "Edit"} Paper Rates
              <button
                className="btn btn-sm btn-primary pull-right"
                onClick={() => this.props.history.push(`/paperrateslist`)}
              >
                {Trans("Manage Paper Rates")}
              </button>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <AddPaperRatesForm
              handlePaperRates={!this.state.editMode ? this.addPaperRates : this.updatePaperRates}
              isBtnLoading={isBtnLoading}
              isSucessMsg={isSucessMsg}
              isErrorMsg={isErrorMsg}
              editMode={editMode}
              history={this.props.history}
              paperRateID={this.props.location.pathname.replace("/paperrates/", "")}
              paperRateDetails={paperRateDetails}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default paperrates