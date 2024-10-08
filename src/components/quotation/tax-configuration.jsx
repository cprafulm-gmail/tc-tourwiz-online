import React from 'react'
import Form from '../common/form'
import * as Global from "../../helpers/global";
import { apiRequester_unified_api } from "../../services/requester-unified-api";
import { apiRequester } from "../../services/requester";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";
import SVGIcon from "../../helpers/svg-icon";
import QuotationMenu from './quotation-menu';
import { Trans } from "../../helpers/translate";
import ActionModal from "../../helpers/action-modal";
import Loader from "../common/loader";
import ModelPopupAuthorize from "../../helpers/modelforauthorize";
import { Helmet } from "react-helmet";
class TaxConfiguration extends Form {

  state = {
    taxTab: null,
    taxTabAssign: '',
    taxes: [],
    defaultSelectedPurpose: [],
    errors: {},
    isSucessMsg: false,
    isSucessMsgAssign: false,
    isErrorMsg: false,
    isErrorMsgAssign: false,
    isBtnLoading: false,
    isBtnLoadingAssignTax: false,
    errorMsg: "",
    errorMsgAssign: "",
    isshowauthorizepopup: false,
  }

  hideauthorizepopup = () => {
    this.setState({ isshowauthorizepopup: !this.state.isshowauthorizepopup });
  }

  async componentDidMount() {
    await this.handleSetPersonate();
    if (!AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "dashboard-menu~agentsettings-tax-configuration")) {
      this.props.history.push('/');
    }

    if (!(JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations) {
      return;
    }
    let taxTab = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations[0].business.toLowerCase();
    let taxes = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === (taxTab)).taxes;
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    let defaultSelectedPurpose = taxes
      .filter(x => parseInt(x.purpose) > 159)
      .filter((element, index) => element.name === ("Tax" + (index + 1)) ? element.isShowOnUI : true)
      .map(y => y.purpose);

    this.setState({ taxTab, taxes, defaultSelectedPurpose });
  }

  handleTabType = (mode) => {
    if (mode === "") {
      this.setState({ taxTabAssign: mode, selectedTaxes: [], isSucessMsgAssign: "", isErrorMsgAssign: false, errorMsgAssign: "" });
    }
    let selectedTaxes = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === mode).taxes;
    let GSTTaxes = selectedTaxes.filter(x => Number(x.purpose) === 157 || Number(x.purpose) === 158 || Number(x.purpose) === 159);
    selectedTaxes = selectedTaxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    //let defaultSelectedPurpose = selectedTaxes.filter(x => x.isShowOnUI === true).map(y => y.purpose);
    selectedTaxes = selectedTaxes
      .filter(x => parseInt(x.purpose) > 159)
      .filter((element, index) => element.name === ("Tax" + (index + 1)) ? false : true)

    selectedTaxes = [...GSTTaxes, ...selectedTaxes];

    selectedTaxes = selectedTaxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    this.setState({ taxTabAssign: mode, selectedTaxes, isErrorMsgAssign: false, errorMsgAssign: "", isSucessMsgAssign: "", });
  }

  handleTaxName = (e, purpose) => {
    let taxes = this.state.taxes;
    let selectedTax = taxes.find(x => x.purpose === purpose);
    selectedTax.name = e.target.value;
    selectedTax.description = e.target.value;
    taxes = [...(taxes.filter(x => x.purpose !== purpose)), selectedTax];
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0))
    let errors = this.state.errors;
    if (e.target.value === "") {
      errors[purpose] = "Tax Name is Mandatory";
    }
    else {
      delete errors[purpose];
    }
    this.setState({ taxes, errors });
  }

  handleSelect = (purpose) => {
    let taxes = this.state.taxes;
    let selectedTax = taxes.find(x => x.purpose === purpose);
    selectedTax.isShowOnUI = !selectedTax.isShowOnUI;
    taxes = [...(taxes.filter(x => x.purpose !== purpose)), selectedTax];
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0))
    this.setState({ taxes });
  }

  handleSelectAssign = (purpose) => {
    let taxes = this.state.selectedTaxes;
    let selectedTax = taxes.find(x => x.purpose === purpose);
    selectedTax.isShowOnUI = !selectedTax.isShowOnUI;
    taxes = [...(taxes.filter(x => x.purpose !== purpose)), selectedTax];
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0))
    this.setState({ selectedTaxes: taxes });
  }

  saveData = async () => {
    if (Object.keys(this.state.errors).length > 0) {
      return;
    }
    this.setState({ isShowConfirmPopup: false, isErrorMsg: "", isSucessMsg: '', isBtnLoading: true });
    var promises = [];
    let isAirBusiness = false;
    let isActivityBusiness = false;
    let taxTab = this.state.taxTab;

    if ((JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'hotel')) {
      let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'hotel')
      let taxes = customTaxConfigurations.taxes.map(item => {
        var inputData = this.state.taxes.find(x => x.purpose === item.purpose);
        /*
        let isNameChanged = false;
        let defaultTaxName = ["Tax1", "Tax2", "Tax3", "Tax4", "Tax5"];
        
        if (defaultTaxName.indexOf(inputData.name) > -1)
          isNameChanged = true;
        */
        let isShowOnUI = (item.additionalChargeID === 0) ? false : item.isShowOnUI;
        if (item.name !== inputData.name && inputData.isShowOnUI)
          isShowOnUI = false;
        item.isShowOnUI = isShowOnUI;
        item.name = inputData.isShowOnUI ? inputData.name : item.name;
        item.description = inputData.isShowOnUI ? inputData.name : item.name;
        return item;
      });
      taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
      promises.push(await this.handleSubmit('hotel', this.state.taxTab, taxes, this.props.userInfo.agentID, this.props.userInfo.userID));
    }

    if ((JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'air')) {
      let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'air')
      let taxes = customTaxConfigurations.taxes.map(item => {
        var inputData = this.state.taxes.find(x => x.purpose === item.purpose);
        let isShowOnUI = (item.additionalChargeID === 0) ? false : item.isShowOnUI;
        if (item.name !== inputData.name && inputData.isShowOnUI)
          isShowOnUI = false;
        item.isShowOnUI = isShowOnUI;
        item.name = inputData.isShowOnUI ? inputData.name : item.name;
        item.description = inputData.isShowOnUI ? inputData.name : item.name;
        return item;
      });
      taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
      promises.push(await this.handleSubmit('air', this.state.taxTab, taxes, this.props.userInfo.agentID, this.props.userInfo.userID));
      isAirBusiness = true;
    }
    if ((JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'activity')) {
      let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === 'activity')
      let taxes = customTaxConfigurations.taxes.map(item => {
        var inputData = this.state.taxes.find(x => x.purpose === item.purpose);
        let isShowOnUI = (item.additionalChargeID === 0) ? false : item.isShowOnUI;
        if (item.name !== inputData.name && inputData.isShowOnUI)
          isShowOnUI = false;
        item.isShowOnUI = isShowOnUI;
        item.name = inputData.isShowOnUI ? inputData.name : item.name;
        item.description = inputData.isShowOnUI ? inputData.name : item.name;
        return item;
      });
      taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
      promises.push(await this.handleSubmit('activity', this.state.taxTab, taxes, this.props.userInfo.agentID, this.props.userInfo.userID));
      isActivityBusiness = true;
    }
    Promise.all(promises).then(
      function () {
        if (arguments[0][0].error || (isAirBusiness && arguments[0][1].error) || (isActivityBusiness && arguments[0][2].error)) {
          this.setState({ isErrorMsg: true })
        }
      }.bind(this),
      function (err) {
        this.setState({ isErrorMsg: true })
      }.bind(this));

    await this.setpopupFlag();

    await this.getEnvironmentDetails();
  }

  setpopupFlag = async () => {
    let reqURL = "admin/disabletaxconfig";
    apiRequester_unified_api(reqURL, null, function (response) {
    }.bind(this), "POST");
  }

  getEnvironmentDetails = async () => {
    await this.handleSetPersonate();

    let taxTab = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations[0].business.toLowerCase();
    let taxes = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === (taxTab)).taxes;
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    let defaultSelectedPurpose = taxes
      .filter(x => parseInt(x.purpose) > 159)
      .filter((element, index) => element.name === ("Tax" + (index + 1)) ? element.isShowOnUI : true)
      .map(y => y.purpose);

    this.setState({ isSucessMsg: true, isBtnLoading: false, taxTab, taxes, defaultSelectedPurpose })
  }

  handleSubmit = async (business, taxTab, taxes, agentID, userID) => {
    // let taxes = this.state.taxes;
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === business)

    var reqURL = "admin/additionalcharges/policy/addupdate";

    var reqOBJ =
    {
      "request": {
        "ProviderId": agentID,
        "UserId": userID,
        "AdditionalChargePolicyID": customTaxConfigurations.additionalChargePolicyID,
        "Business": customTaxConfigurations.businessID,
        "Policies":
          taxes
            .map(x => {
              return {
                "ChargeId": x.additionalChargeID,
                "ChargeName": x.name, // x.isShowOnUI ? x.name : customTaxConfigurations.taxes.find(tax => tax.purpose === x.purpose).name,
                "ChargeDescription": x.name, //x.isShowOnUI ? x.name : customTaxConfigurations.taxes.find(tax => tax.purpose === x.purpose).description,
                "PurposeId": x.purpose,
                "IsShowOnBE": x.isShowOnUI,
                "ChargeValue": x.chargeValue,
                "Type": x.chargeType
              }
            })
      }
    }

    return new Promise(function (resolve, reject) {
      apiRequester_unified_api(
        reqURL,
        reqOBJ,
        function (data) {
          resolve(data);
          /* if (data.error)
            this.setState({ isErrorMsg: true })
          else
            resolve();
          this.setState({ isSucessMsg: true }) */
        }.bind(this),
        "POST"
      );
    });
  }

  handleSetPersonate = async () => {
    let reqURL = "api/v1/callcenter/setpersonate";
    let reqOBJ = {
      Request: sessionStorage.getItem("personateId") ?? localStorage.getItem("personateId"),
    };
    return new Promise(function (resolve, reject) {
      apiRequester(
        reqURL,
        reqOBJ,
        function (data) {
          localStorage.setItem("environment", JSON.stringify(data.response));
          localStorage.removeItem("cartLocalId");
          resolve(data);
        }.bind(this)
      );
    });
  };

  handleRedirect = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      //window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };

  validateData = () => {
    if (Object.keys(this.state.errors).length > 0) {
      return;
    }
    let { taxes, isErrorMsg, errorMsg } = this.state
    if (taxes.filter(x => x.isShowOnUI && parseInt(x.purpose) > 159).length === 0) {
      isErrorMsg = true;
      errorMsg = "Kindly select atleast one tax."
      this.setState({ taxes, isErrorMsg, errorMsg })
    }
    else
      this.setState({ isShowConfirmPopup: true, isErrorMsg: false, errorMsg: "" })
  }
  validateDataAssign = () => {
    if (Object.keys(this.state.errors).length > 0) return;
    let taxes = this.state.selectedTaxes;
    if (taxes.filter(x => x.isShowOnUI && x.purpose > 159).length === 0) {
      let isErrorMsgAssign = true;
      let errorMsgAssign = "Kindly select atleast one tax."
      this.setState({ isErrorMsgAssign, errorMsgAssign })
    }
    else
      this.setState({ isShowConfirmPopupAssign: true, isErrorMsgAssign: false, errorMsgAssign: "" })
  }

  saveDataAssign = async () => {
    this.setState({ isShowConfirmPopupAssign: false, isErrorMsgAssign: "", isSucessMsgAssign: '', isBtnLoadingAssignTax: true });
    let customTaxConfigurations = (JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.find(x => x.business.toLowerCase() === this.state.taxTabAssign)
    let taxes = customTaxConfigurations.taxes.map(item => {
      //var inputData = this.state.taxes.find(x => x.purpose === item.purpose);
      item.isShowOnUI = this.state.selectedTaxes.find(x => x.purpose === item.purpose) ? this.state.selectedTaxes.find(x => x.purpose === item.purpose).isShowOnUI : item.isShowOnUI;
      item.chargeValue = Number(this.state.selectedTaxes.find(x => x.purpose === item.purpose) ? this.state.selectedTaxes.find(x => x.purpose === item.purpose).chargeValue : item.chargeValue);
      item.chargeType = this.state.selectedTaxes.find(x => x.purpose === item.purpose) ? this.state.selectedTaxes.find(x => x.purpose === item.purpose).chargeType : item.chargeType;
      item.name = item.name;
      item.description = item.description;
      return item;
    });
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    await this.handleSubmit(this.state.taxTabAssign, this.state.taxTabAssign, taxes, this.props.userInfo.agentID, this.props.userInfo.userID);
    await this.handleSetPersonate();
    this.setState({ isSucessMsgAssign: true, taxTabAssign: '', isShowConfirmPopupAssign: false, isBtnLoadingAssignTax: false });
  }

  handleTaxPercentage = (e, purpose) => {
    if (Number(e.target.value) < 0) {
      return;
    }
    let taxes = this.state.selectedTaxes;
    let selectedTax = taxes.find(x => x.purpose === purpose);
    selectedTax.chargeValue = e.target.value === "" ? '' : (purpose === "158" ? (Number(e.target.value) / 2) : e.target.value);
    if (isNaN(selectedTax.chargeValue))
      selectedTax.chargeValue = 0;
    selectedTax.chargeType = Number(e.target.value) === 0 ? "Fixed" : 'Percentage';
    taxes = [...(taxes.filter(x => x.purpose !== purpose)), selectedTax];
    if (purpose === "158") {
      let selectedTax = taxes.find(x => x.purpose === "157");
      selectedTax.chargeValue = e.target.value === "" ? '' : (Number(e.target.value) / 2);
      if (isNaN(selectedTax.chargeValue))
        selectedTax.chargeValue = 0;
      selectedTax.chargeType = Number(e.target.value) === 0 ? "Fixed" : 'Percentage';
      taxes = [...(taxes.filter(x => x.purpose !== "157")), selectedTax];
    }
    taxes = taxes.sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0))
    let errors = this.state.errors;
    delete errors[purpose + '_tax'];
    if (errors[purpose] === undefined && e.target.value !== "") {
      if (isNaN(e.target.value) || Number(e.target.value) > 99.99) {
        errors[purpose + '_tax'] = "Invalid Tax Percentage.";
      }
    }
    this.setState({ selectedTaxes: taxes, errors });
  }

  render() {
    const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
      && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
    let { taxes, defaultSelectedPurpose } = this.state;
    if (taxes.length === 0) {
      return <div className="row p-3">
        <div className="container ">
          <Loader />
        </div>
      </div>;
    }
    return (
      <div className="agent-dashboard">
        <React.Fragment>
          <div className="title-bg pt-3 pb-3">
            <Helmet>
              <title>
                {Trans("Tax Configuration")}
              </title>
            </Helmet>
            <div className="container">
              <h1 className="text-white m-0 p-0 f30 d-inline">
                <SVGIcon
                  name="file-text"
                  width="24"
                  height="24"
                  className="mr-3"
                ></SVGIcon>
                {Trans("Tax Configuration")}
                {/* <button
                  className="btn btn-sm btn-primary pull-right"
                  onClick={this.handleSetPersonate}
                >
                  {Trans("Refresh")}
                </button> */}
              </h1>
            </div>
          </div>
          <div className='container'>

            <div className='row'>
              <div className="col-lg-3 hideMenu">
                <QuotationMenu handleMenuClick={this.handleRedirect} userInfo={this.props.userInfo} {...this.props} />
              </div>
              <div className="col-lg-9 mt-4">
                {!(JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations ?
                  <h4>No tax setup available.</h4>
                  :
                  <div className="container">
                    {/* <div className='col-lg-4 btn-group'>
                      {(JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.map(item => {
                        return <button
                          className='btn'
                          style={{
                            borderTop: "" + (this.state.taxTab === item.business.toLowerCase() ?
                              "2px solid #ea7c10"
                              : "")
                          }}
                          onClick={() => this.handleTabType(item.business.toLowerCase())}>{item.business.toLowerCase() === "activity" ? "Activity/Transfers/Custom/Package" : item.business}</button>
                      })}
                    </div>
                    <hr className='border border-muted' /> */}
                    {IsGSTApplicable &&
                      Object.keys(taxes).length > 0 && taxes.filter(x => x.purpose >= 156 && x.purpose <= 159).length > 0 &&
                      <React.Fragment>
                        <div className="border-bottom bg-light d-flex p-3">
                          <div className="mr-auto d-flex align-items-center">
                            <SVGIcon
                              name={"file-text"}
                              className="mr-2 d-flex align-items-center"
                              width="24"
                              type="fill"
                            ></SVGIcon>
                            <h6 className="font-weight-bold m-0 p-0">GST Taxes</h6>
                          </div>
                        </div>
                        <div className='row p-3'>
                          {Object.keys(taxes).length > 0 && taxes.filter(x => x.purpose >= 156 && x.purpose <= 159).map((item, index) => {
                            return <div className=" col-lg-5 ">{/* form-check form-switch */}
                              <div className={"form-group "}>
                                {/* <label htmlFor={"GSTtaxName" + item.purpose}>Tax Name {index + 1}</label> */}
                                <input
                                  name={"GSTtaxName" + item.purpose}
                                  className={"form-control"}
                                  value={item.name}
                                  disabled={true}
                                  onChange={(e) => this.handleTaxName(e, item.purpose)}
                                />
                              </div>
                            </div>
                          })}
                        </div>
                      </React.Fragment>}

                    <div className="border-bottom bg-light d-flex p-3">

                      <div className="mr-auto d-flex align-items-center">
                        <SVGIcon
                          name={"file-text"}
                          className="mr-2 d-flex align-items-center"
                          width="24"
                          type="fill"
                        ></SVGIcon>
                        <h6 className="font-weight-bold m-0 p-0">Taxes</h6>
                        <small className='ml-3 text-primary'>Kindly specify possible tax names (For all business)</small>
                      </div>
                    </div>
                    <div className='row px-3 pt-3 mb-0'>
                      {Object.keys(taxes).length > 0 && taxes.filter(x => x.purpose > 159).map((item, index) => {
                        return <div className=" col-lg-5 form-check form-switch ">{/* form-check form-switch */}

                          <div className={"form-group"}>
                            {/* <label htmlFor={"taxName" + item.purpose}>Tax Name {index + 1}</label> */}
                            <input className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"
                              //checked={item.name === "" ? item.isShowOnUI : item.name === ("Tax" + (index + 1)) ? item.isShowOnUI : true}
                              checked={defaultSelectedPurpose.indexOf(item.purpose) > -1 ? true : item.isShowOnUI}
                              disabled={defaultSelectedPurpose.indexOf(item.purpose) > -1}
                              onChange={() => this.handleSelect(item.purpose)} />
                            <input
                              name={"taxName" + item.purpose}
                              className={"form-control " + (this.state.errors[item.purpose] ? " border border-danger" : "")}
                              value={item.name}
                              disabled={defaultSelectedPurpose.indexOf(item.purpose) > -1}
                              onChange={(e) => this.handleTaxName(e, item.purpose)}
                              minLength="1"
                              maxLength="30"
                            />
                            {this.state.errors && this.state.errors[item.purpose] &&
                              <small className='' style={{ color: "red" }}>{this.state.errors[item.purpose]}</small>
                            }

                          </div>
                        </div>
                      })}

                    </div>

                    {((IsGSTApplicable && this.state.defaultSelectedPurpose.length < 9)
                      || (!IsGSTApplicable && this.state.defaultSelectedPurpose.length < 5)) &&
                      <div className='row  '>
                        <div className='col-lg-3'>

                          {!this.state.isBtnLoading ? <button onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "agentsettings-tax-configuration~save") ? this.validateData() : this.setState({ isshowauthorizepopup: true })}
                            className="btn btn-primary w-100 text-capitalize">
                            Save
                          </button> : <button className="btn btn-primary  w-100 text-capitalize" >
                            <span className="spinner-border spinner-border-sm mr-2"></span>Save
                          </button>
                          }

                        </div>
                      </div>
                    }
                    {this.state.isSucessMsg && (
                      <div className="row">
                        <div className="col-lg-12">
                          <h6 className="alert alert-success mt-3 d-inline-block">
                            Tax Details Saved Successfully!
                          </h6>
                        </div>
                      </div>
                    )}

                    {this.state.isErrorMsg && (
                      <div className="row">
                        <div className="col-lg-12">
                          <h6 className="alert alert-danger mt-3 d-inline-block">
                            {this.state.errorMsg ? this.state.errorMsg : "Oops ! something went wrong."}
                          </h6>
                        </div>
                      </div>
                    )}
                    {this.state.defaultSelectedPurpose.length > 0 &&
                      // {taxes.length > 0 && taxes?.filter(x => x.isShowOnUI && parseInt(x.purpose) > 159).length > 0 &&
                      <React.Fragment>
                        <div className="border-bottom bg-light d-flex p-3 pt-5">
                          <div className="mr-auto d-flex align-items-center">
                            <SVGIcon
                              name={"file-text"}
                              className="mr-2 d-flex align-items-center"
                              width="24"
                              type="fill"
                            ></SVGIcon>
                            <h6 className="font-weight-bold m-0 p-0">Assign & configure tax business wise</h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 mt-3">
                            <select
                              className={"form-control"}
                              onChange={(e) => this.handleTabType(e.target.value)}
                              defaultValue={this.state.taxTabAssign}
                              value={this.state.taxTabAssign}
                            >
                              <option value="">--Select--</option>
                              {(JSON.parse(localStorage.getItem("environment"))).customTaxConfigurations.map(item => {
                                return <option key={item.business.toLowerCase()} value={item.business.toLowerCase()}>
                                  {item.business.toLowerCase() === "activity" ? "Activity/Transfers/Custom/Package" : item.business &&
                                    item.business.toLowerCase() === "air" ? "Flight" : item.business}
                                </option>
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='row p-3'>
                          {this.state.taxTabAssign !== null && this.state.taxTabAssign !== ""
                            && this.state.selectedTaxes && Object.keys(this.state.selectedTaxes).length > 0
                            && this.state.selectedTaxes.map((item, index) => {

                              return item.purpose === "157" ? <React.Fragment></React.Fragment> : <div className=" col-lg-5 form-check form-switch ">{/* form-check form-switch */}
                                <div className="row">
                                  <div className="col-lg-8">
                                    <div className={"form-group input-group"}>
                                      {/* <label htmlFor={"taxName" + item.purpose}>Tax Name {index + 1}</label> */}
                                      <input className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id={"assign-taxName" + item.purpose}
                                        checked={item.isShowOnUI}
                                        disabled={(JSON.parse(localStorage.getItem("environment")))
                                          .customTaxConfigurations.find(x => x.business.toLowerCase() === this.state.taxTabAssign)
                                          .taxes.find(x => x.purpose === item.purpose).isShowOnUI}
                                        onChange={() => this.handleSelectAssign(item.purpose)} />
                                      <input
                                        name={"assign-taxName" + item.purpose}
                                        className={"form-control " + (this.state.errors[item.purpose] ? " border border-danger" : "")}
                                        value={item.purpose === "158" ? "CGST/SGST" : item.name}
                                        disabled={(item.purpose === "158" || item.purpose === "159")
                                          ? true : defaultSelectedPurpose.indexOf(item.purpose) > -1}
                                        minLength="1"
                                        maxLength="30"
                                      />
                                      {this.state.errors && this.state.errors[item.purpose] &&
                                        <small className='' style={{ color: "red" }}>{this.state.errors[item.purpose]}</small>
                                      }
                                    </div>
                                  </div>
                                  <div className="col-lg-4 pl-0">
                                    <div className={"form-group input-group"}>
                                      <input type="text"
                                        className={"form-control " + (this.state.errors[item.purpose + '_tax'] ? " border border-danger" : "")}
                                        placeholder={"0.00"}
                                        name={"chargeType" + item.purpose}
                                        value={item.chargeValue === 0
                                          ? (item.chargeType === "Fixed"
                                            ? Global.getBusinessWiseGSTPercentage(this.state.taxTabAssign, item.name) === 0
                                              ? ""
                                              : Global.getBusinessWiseGSTPercentage(this.state.taxTabAssign, item.name)
                                            : "")
                                          : (item.purpose === "158" && Number(item.chargeValue) > 0
                                            ? (parseFloat(Number(item.chargeValue)) * 2)
                                            : item.chargeValue)}
                                        onChange={(e) => this.handleTaxPercentage(e, item.purpose)}
                                        style={{ textAlign: "right" }}
                                        disabled={!item.isShowOnUI}
                                      />
                                      <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            })}
                        </div>
                        {this.state.taxTabAssign !== null && this.state.taxTabAssign !== "" &&
                          <div className='row'>
                            <div className='col-lg-3'>
                              {!this.state.isBtnLoadingAssignTax ? <button onClick={() => AuthorizeComponentCheck(this.props.userInfo.rolePermissions, "agentsettings-tax-configuration~save") ? this.validateDataAssign() : this.setState({ isshowauthorizepopup: true })}
                                className="btn btn-primary w-100 text-capitalize">
                                Assign tax
                              </button> : <button className="btn btn-primary  w-100 text-capitalize" >
                                <span className="spinner-border spinner-border-sm mr-2"></span>Assign Tax
                              </button>
                              }
                            </div>
                          </div>
                        }

                        {this.state.isSucessMsgAssign && (
                          <div className="row">
                            <div className="col-lg-12">
                              <h6 className="alert alert-success mt-3 d-inline-block">
                                Tax Details Saved Successfully!
                              </h6>
                            </div>
                          </div>
                        )}

                        {this.state.isErrorMsgAssign && (
                          <div className="row">
                            <div className="col-lg-12">
                              <h6 className="alert alert-danger mt-3 d-inline-block">
                                {this.state.errorMsgAssign ? this.state.errorMsgAssign : "Oops ! something went wrong."}
                              </h6>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </React.Fragment >
        {
          this.state.isShowConfirmPopup &&
          <ActionModal
            title="Are you sure?"
            message="Are you sure you want to save tax details?"
            positiveButtonText="Confirm"
            onPositiveButton={() => this.saveData()}
            handleHide={() => this.setState({ isShowConfirmPopup: false })}
          />
        }
        {
          this.state.isShowConfirmPopupAssign &&
          <ActionModal
            title="Are you sure?"
            message="Are you sure you want to save tax details?"
            positiveButtonText="Confirm"
            onPositiveButton={() => this.saveDataAssign()}
            handleHide={() => this.setState({ isShowConfirmPopupAssign: false })}
          />
        }
        {this.state.isshowauthorizepopup &&
          <ModelPopupAuthorize
            header={""}
            content={""}
            handleHide={this.hideauthorizepopup}
            history={this.props.history}
          />
        }
      </div >)
  }
}
export default TaxConfiguration