import React from "react";
import Form from "../common/form";
import GuestAir from "./guest-air";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class TravellerAir extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      paxCount: this.getPaxInfo(),
      route: this.getRouteInfo(),
      dateInfo: this.props.cartItem.items[this.props.count - 1].data.dateInfo
    };
    this.paxCountArr = [];
  }

  validate = () => {
    const errors = {};
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = () => {
    this.state.paxCount.map((item, count) =>
      this[`pax${count}`].handleChildSubmit()
    );
  };

  handleChildSubmit = data => {
    this.paxCountArr = data.count === 0 ? [] : this.paxCountArr;
    if (data.isErrors) return;
    let paxArray = this.paxCountArr.find(o => o.count === data.count);
    if (paxArray === undefined) {
      this.paxCountArr.push(data);
    } else {
      if (paxArray.count === data.count) {
        this.paxCountArr = this.paxCountArr.filter(item => item !== paxArray);
        this.paxCountArr.push(data);
      }
    }

    let isValidateDuplicateData = this.validateDuplicateData();
    if (
      !isValidateDuplicateData &&
      this.paxCountArr.length === this.state.paxCount.length
    ) {
      let guestsData = this.state.data;
      guestsData.guests = this.paxCountArr;
      this.setState({
        data: guestsData
      });

      this.handleParentSubmit();
    }
  };

  validateDuplicateData = () => {
    let isDuplicatePaxName = false;
    let isDuplicatePassport = false;
    if (
      this.paxCountArr.length > 1 &&
      this.paxCountArr.length === this.state.paxCount.length
    ) {
      let i = 0;
      for (i = 0; i <= this.paxCountArr.length; i++) {
        let j = 0;
        for (j = i + 1; j <= this.paxCountArr.length - (i + 1); j++) {
          if (
            !isDuplicatePaxName &&
            this.paxCountArr[i].data.firstName ===
            this.paxCountArr[j].data.firstName &&
            this.paxCountArr[i].data.lastName ===
            this.paxCountArr[j].data.lastName
          ) {
            isDuplicatePaxName = true;
          }
          if (
            !isDuplicatePassport &&
            this.paxCountArr[i].data.documentNumber ===
            this.paxCountArr[j].data.documentNumber
          ) {
            isDuplicatePassport = true;
          }
          if (isDuplicatePaxName || isDuplicatePassport) {
            this[`pax${i}`].handleChildSubmitDuplicateValidation({
              isDuplicatePaxName,
              isDuplicatePassport
            });
            this[`pax${j}`].handleChildSubmitDuplicateValidation({
              isDuplicatePaxName,
              isDuplicatePassport
            });
          }
        }
      }
    }
    return isDuplicatePaxName || isDuplicatePassport;
  };
  handleParentSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.props.handleSubmit({ count: this.props.count, data: this.state.data });
  };

  getPaxInfo = () => {
    const cartItem = this.props.cartItem.items[this.props.count - 1].data
      .paxInfo;

    let paxCountArr = cartItem.reduce((sum, item) => {
      [...Array(item.quantity).keys()].reduce((sumQty, itemQty) => {
        sum.push(item);
        return sum;
      }, []);
      return sum;
    }, []);

    return paxCountArr;
  };

  getRouteInfo = () => {
    const cartItem = this.props.cartItem.items[this.props.count - 1].data;
    let route =
      cartItem.items.length > 1
        ? cartItem.items[0].locationInfo.fromLocation.id +
        " - " +
        cartItem.items[0].locationInfo.toLocation.id +
        " - " +
        cartItem.items[0].locationInfo.fromLocation.id
        : cartItem.items[0].locationInfo.fromLocation.id +
        " - " +
        cartItem.items[0].locationInfo.toLocation.id;
    if (cartItem.tripType === "multicity")
      route = cartItem.items.reduce((sum, item) => sum + (sum === "" ? "" : ", ") + item.locationInfo.fromLocation.id + " - " + item.locationInfo.toLocation.id, "");
    return route;
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { userInfo } = this.props;
    const { addons, inputs } = this.props.cartItem.items[this.props.count - 1];

    return (
      <div className="traveller-details border p-3 bg-white box-shadow mb-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon
            name="user-alt"
            className="mr-2"
            width="20"
            height="20"
          ></SVGIcon>
          {(localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" ? Trans("_mutamerDetails") : Trans("_travelersDetails")) + " - "}
          <span className="text-primary text-capitalize">
            {this.state.route.replaceAll("&amp;", "&").replaceAll("&Amp;", "&")}
          </span>
        </h5>

        <p className="flightnotes text-secondary">{Trans("_infoTravellerDetailsAir")}</p>
        {
          localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" &&
          <React.Fragment> <p className="mt-3 flightnotes text-secondary">{Trans("_infoTravellerDetailsAirMutamer1")}</p>

            <p className="mt-3 mb-3 flightnotes text-secondary">{Trans("_infoTravellerDetailsAirMutamer2")}</p>
          </React.Fragment>
        }

        {this.state.paxCount.map((cartItem, key) => {
          return (
            <GuestAir
              key={key}
              onRef={ref => (this[`pax${key}`] = ref)}
              handleChildSubmit={this.handleChildSubmit}
              count={key}
              userInfo={userInfo}
              dateInfo={this.state.dateInfo}
              {...cartItem}
              {...addons}
              {...inputs}
              continueAsGuest={this.props.continueAsGuest}
              propsCartItems={this.props.cartItem.items}
              supplierquestions={this.props.cartItem.items[this.props.count - 1].inputs}
              business={this.props.cartItem.items[this.props.count - 1].data.business}
              isPaperRateBooking={this.props.isPaperRateBooking}
              isInternational={this.props.isInternational}
            />
          );
        })}

        <p className="text-secondary mb-0">
          {Trans("_infantMessageInTraveller")}
        </p>
      </div>
    );
  }
}

export default TravellerAir;
