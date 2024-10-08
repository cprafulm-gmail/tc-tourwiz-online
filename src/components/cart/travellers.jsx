import React, { Component } from "react";
import ContactInfo from "./contact-info";
import Traveller from "./traveller";
import TravellerAir from "./traveller-air";
import TravellerUmrah from "./traveller-umrah";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import { apiRequester } from "../../services/requester";

class Travellers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guestsCount: [...Array(this.props.items.length).keys()],
      isBtnLoading: false,
      errorMessages: [],
    };
    this.paxCount = [];
  }

  handleSubmit = data => {
    let paxCountArr = this.paxCount.find(o => o.count === data.count);
    var isB2CUmrahPortal = localStorage.getItem("umrahPackageDetails") && true; // localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C";

    if (paxCountArr === undefined) {
      this.paxCount.push(data);
      if (isB2CUmrahPortal && this.props.items.length === this.paxCount.length)
        this.paxCount = this.getPaxCountObjectforUmrah(this.paxCount, this.props.items);
    } else {
      if (paxCountArr.count === data.count) {
        this.paxCount = this.paxCount.filter(item => item !== paxCountArr);
        this.paxCount.push(data);
      }
    }

    if (isB2CUmrahPortal && this.props.items.length === this.paxCount.length) {
      this.paxCount = this.getPaxCountObjectforUmrah(this.paxCount, this.props.items);
    }

    if (this.paxCount.length === this.props.items.length + 1) {
      if (isB2CUmrahPortal && this.paxCount.find(x => x && x.data.guests && x.data.guests[0].business === "hotel")) {
        let gccNationalityCode = ["BH", "KW", "OM", "QA", "AE", "SA"];
        let isGCCPax = this.paxCount.find(x => x.data.guests[0].business === 'hotel').data.guests[0].data.nationalityCode;
        isGCCPax = gccNationalityCode.indexOf(isGCCPax) === -1 ? false : true;
        if (!isGCCPax) {
          this.ValidateMutamerInfo(this.paxCount, (paxCount) => {
            this.props.handleAddTravellers(paxCount);
            this.setState({ isBtnLoading: !this.state.isBtnLoading });
          });
        }
        else {
          this.props.handleAddTravellers(this.paxCount);
          this.setState({ isBtnLoading: !this.state.isBtnLoading });
        }
      }
      else {
        this.props.handleAddTravellers(this.paxCount);
        this.setState({ isBtnLoading: !this.state.isBtnLoading });
      }
    }
  };

  ValidateMutamerInfo = (paxCount, callback) => {
    var reqURL = "api/v1/ewallet/validatemutamer";
    var reqOBJ = {
      Request: {
        "REQUEST": {
          "MUTAMER_DATA": paxCount.find(x => x.data.guests[0].business === 'hotel').data.guests.map((item, index) => {
            return {
              "PASSPORT_NO": item.data.documentNumber,
              "NATIONALITY": item.data.nationalityCode,//"91",
              "PASSPORT_EXPIRY_DATE": item.data.passportExpirationDate,
              "BIRTHDATE": item.data.birthDate,
              "GENDER": item.data.gender === "Male" ? "1" : "0",
              "COUNTRY": item.data.nationalityCode,
              "MAHRAM_PASSPORT": item.data.documentNumber
            }
          })

        }
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.response.response.error_Code === "0") {
          if (callback)
            callback(paxCount);
        }
        else {
          this.setState({
            isBtnLoading: false,
            errorMessages: [data.response.response.error_Description],
          });
        }
      }.bind(this)
    );
  };

  getPaxCountObjectforUmrah = (paxCount, items) => {
    let umrahPackageDetails = JSON.parse(localStorage.getItem("umrahPackageDetails"))
    var isUmrahFeeCalculated = false
    var tmppaxCount = items.map((item, index) => {
      if (!paxCount.find(x => x && x.data.guests && x.data.guests[0].business === "air"))
        return;
      var data = paxCount.find(x => x.data.guests[0].business === "air").data.guests[0].data;
      var obj = paxCount.filter(x => x.data.guests && x.data.guests.filter(x => x?.business === item.data.business).length > 0);
      if (item.data.business === "hotel") {
        var selectedVisaFee = item.addons.availableAddons.filter(x => x.type === "umrahVisaFee").map(item => { return item.item[0].id });
        selectedVisaFee = isUmrahFeeCalculated ? null : selectedVisaFee;
        var hotelObject = JSON.parse(JSON.stringify(paxCount.find(x => x.data.guests[0].business === "air")));
        hotelObject.count = items.map((item, index) => { return item.data.business }).indexOf(item.data.business) + 1;
        if (selectedVisaFee?.length > 0)
          isUmrahFeeCalculated = true;
        if (item.inputs.availableInputs.filter(x => x.type === "umrahflightdetails").length > 0) {
          if (umrahPackageDetails.umrahFlight) {
            let umrahFlightDetails = umrahPackageDetails.umrahFlightDetails;
            hotelObject.data.input_umrahFlightDetails = item.inputs.availableInputs.filter(x => x.type === "umrahflightdetails")[0].item.map(item => {
              let keyValue = umrahFlightDetails[item.id.split('_')[2]];
              keyValue = item.id.indexOf('date') > -1 ? keyValue.split(' ')[0] : keyValue;
              keyValue = item.id.indexOf('time') > -1 ? umrahFlightDetails[item.id.split('_')[2].replace('time', 'date')].split(' ')[1] : keyValue;
              return {
                "key": item.id,
                "Value": [keyValue]
              };
            })
          }
        }
        hotelObject.data.guests.map((item1, index) => {
          hotelObject.data.guests[index].business = 'hotel';
          item1.data.visaFeeType = selectedVisaFee && selectedVisaFee[index];
          item1.data.AvailableInputs = hotelObject.data.input_umrahFlightDetails;
          item1.data.code = item.data.items[0]?.item[0]?.code ?? "";
          item1.data.token = item.data.items[0]?.item[0]?.token ?? item.data.items[0]?.item[0]?.code ?? "";
          return true;
        });
        return hotelObject;
      }
      else if (item.data.business === "hotel" || item.data.business === "groundservice" || item.data.business === "transportation") {
        return {
          "count": items.map((item, index) => { return item.data.business }).indexOf(item.data.business) + 1,
          "data": {
            "guests": [
              {
                "business": item.data.business,
                "count": 0,
                "data": {
                  "gender": data.gender,
                  "firstName": data.firstName,
                  "lastName": data.lastName,
                  "birthDate": data.birthDate,
                  "code": item.data.items[0].item[0].code,
                  "token": item.data.items[0].item[0].token ?? item.data.items[0].item[0].code,
                  "documentNumber": data.documentNumber,
                  "nationalityCode": data.nationalityCode,
                  "additionalServices": obj.length ? obj[0].data.guests[0].data.additionalServices : [],
                  "AvailableInputs": obj.length ? obj[0].data.guests[0].data.AvailableInputs : [],
                  "add_arrivhotel": "",
                  "add_direccionhtl": "",
                  "add_hotel": "",
                  "business": item.data.business,
                  "isSaveTraveler": false
                },
                "isErrors": false
              }
            ]
          }
        }
      }
      else if (item.data.business === "air") {
        return paxCount.find(x => x.data.guests[0].business === "air");
      }
      else
        return
    });

    tmppaxCount = tmppaxCount.filter(Boolean)

    if (!paxCount[paxCount.length - 1].data.guests)
      tmppaxCount.push(paxCount[paxCount.length - 1]);
    if (tmppaxCount.filter(Boolean).length > 0)
      return tmppaxCount;
    else
      return paxCount;
  }

  onSubmit = () => {
    let errorMessages = [];
    if (localStorage.getItem("umrahPackageDetails"))
      errorMessages = this.props.bookUmrahPackage();

    if (this.props.items.reduce((sum, item) => sum + (item.availabilityStatus === 3 ? 1 : 0), 0) > 0)
      errorMessages.push(Trans("_cartUnavailableMessage"));

    if (this.props.items.reduce((sum, item) => sum + (item.availabilityStatus === 4 ? 1 : 0), 0) > 0)
      errorMessages.push("Time Out for booking");

    if (errorMessages.length > 0) {
      this.setState({
        isBtnLoading: false,
        errorMessages: errorMessages,
      });
      return false;
    }

    [...Array(this.props.items.length).keys()].map(count => {
      if (localStorage.getItem("umrahPackageDetails")) { //localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C") {
        if (this.props.items[count].data.business === "air" && count === this.props.items.findIndex(x => x.data.business === 'air')) {
          this[`traveller${count}`].handleSubmit();
        }

        if (this.props.items[count].data.business === "groundservice"
          && this.props.items[count].inputs.availableInputs.filter((x) => x.type === "additionalServices").length > 0
          && count === this.props.items.findIndex(x => x.data.business === 'groundservice')) {
          this[`traveller${count}`].handleSubmit();
        }

        if (this.props.items[count].data.business === "transportation"
          && this.props.items[count].addons.availableAddons.length > 0
          && count === this.props.items.findIndex(x => x.data.business === 'transportation')) {
          this[`traveller${count}`].handleSubmit();
        }

        if (count === 0 && localStorage.getItem("umrahPackageDetails") && this.props.items.findIndex(x => x.data.business === 'air') === -1) {
          this[`travellerUmrah`].handleSubmit();
        }

      }
      else
        this[`traveller${count}`].handleSubmit();
    }
    );
    this[`contact`].handleSubmit();
  };

  componentDidUpdate = prevProps => {
    let returnValue = true;
    if (this.state.isBtnLoading && this.props.continueAsGuestMessage.length > 0) {
      this.setState({
        isBtnLoading: false,
        errorMessages: [],
      });
      returnValue = false;
    }

    if (this.state.isBtnLoading && this.props.customerCrateErrorMsg) {
      this.setState({
        isBtnLoading: false,
      });
      returnValue = false;
    }

    if (this.props.items.length !== prevProps.items.length) {
      this.setState({
        isBtnLoading: false,
        errorMessages: [],
      });
      returnValue = false;
    }
    return returnValue;
  };

  render() {
    const { userInfo } = this.props;
    let tempAvailabilityStatus = false;
    [...Array(this.props.items.length).keys()].map(count => {
      if (this.props.items[count].availabilityStatus === 3 || this.props.items[count].availabilityStatus === 4) {
        if (this.props.items.length === 1) {
          tempAvailabilityStatus = true;
        }
      }
      return true;
    });
    return (
      <div className="booking-form">


        {[...Array(this.props.items.length).keys()].map(count => {

          //if (localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" &&
          if (localStorage.getItem("umrahPackageDetails") &&
            (this.props.items[count].data.business === "hotel" ||
              (this.props.items[count].data.business === "transportation" && this.props.items[count].addons.availableAddons.length === 0) ||
              (this.props.items[count].data.business === "groundservice" && this.props.items[count].inputs.availableInputs.filter((x) => x.type === "additionalServices").length === 0) ||
              (this.props.items[count].data.business === "air" && count !== this.props.items.findIndex(x => x.data.business === 'air')))) {
            return null;
          }

          return this.props.items[count].availabilityStatus === 3 || this.props.items[count].availabilityStatus === 4 || this.props.items[count].availabilityStatus === 5 ?
            "" :
            this.props.items[count].data.business !== "air" ? (
              <React.Fragment>
                <Traveller
                  key={count + 1}
                  onRef={ref => (this[`traveller${count}`] = ref)}
                  count={count + 1}
                  handleSubmit={this.handleSubmit}
                  handleRemoveGuest={this.removeGuest}
                  cartItem={this.props}
                  userInfo={userInfo}
                  continueAsGuest={this.props.continueAsGuest}
                  isPaperRateBooking={this.props.isPaperRateBooking}
                  IsInternational={this.props.IsInternational}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TravellerAir
                  key={count + 1}
                  onRef={ref => (this[`traveller${count}`] = ref)}
                  count={count + 1}
                  handleSubmit={this.handleSubmit}
                  handleRemoveGuest={this.removeGuest}
                  cartItem={this.props}
                  userInfo={userInfo}
                  continueAsGuest={this.props.continueAsGuest}
                  isPaperRateBooking={this.props.isPaperRateBooking}
                  isInternational={this.props.IsInternational}
                />
              </React.Fragment>
            );
        })}
        {localStorage.getItem("umrahPackageDetails") && this.props.items.findIndex(x => x.data.business === 'air') === -1 &&
          <TravellerUmrah
            key={1}
            onRef={ref => (this[`travellerUmrah`] = ref)}
            count={1}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            cartItem={this.props}
            userInfo={userInfo}
            continueAsGuest={this.props.continueAsGuest}
          />
        }
        {tempAvailabilityStatus ? "" : (
          <ContactInfo
            onRef={ref => (this[`contact`] = ref)}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            count={0}
            userInfo={userInfo}
            continueAsGuest={this.props.continueAsGuest}
            customerCrateErrorMsg={this.props.customerCrateErrorMsg}
          />)}

        {localStorage.getItem("umrahPackageDetails") &&
          <div class="traveller-details border p-3 bg-white box-shadow mt-3">
            <h5 class="border-bottom pb-3 mb-3 font-weight-bold">
              <SVGIcon name="edit" width="18" height="18" type="lineal" className="mr-2" ></SVGIcon>Please Note</h5>
            <div>{Trans("_umrahPackageMessageOnCartPage1")}</div>
            <div class="mt-2">{Trans("_umrahPackageMessageOnCartPage2")}</div>
            <div class="mt-2">{Trans("_umrahPackageMessageOnCartPage3")}</div>
            <div class="mt-2">{Trans("_umrahPackageMessageOnCartPage4")}</div>
            <div class="mt-2">{Trans("_umrahPackageMessageOnCartPage5")}</div>
          </div>
        }

        {tempAvailabilityStatus ? "" : (
          <button className="btn btn-primary mt-4" onClick={this.onSubmit}>
            {this.state.isBtnLoading ? (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            ) : null}
            {Trans("_continueBooking")}
          </button>)}

        {this.state.errorMessages.length > 0 && (
          <div className="alert alert-danger mt-3" role="alert">
            <span>{Trans("_ooops")}</span>
            <ul>
              {this.state.errorMessages.map((error) => {
                return <li>{error}</li>;
              })}
            </ul>
          </div>
        )}
        {this.props.continueAsGuestMessage.length > 0 && (
          <div className="alert alert-danger mt-3" role="alert">
            {this.props.continueAsGuestMessage.map((error) => {
              return <span>{error}</span>;
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Travellers;
