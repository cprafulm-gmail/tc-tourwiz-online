import React from "react";
import Form from "../common/form";
import Guest from "./guest-manualinvoice";
import GuestTransfers from "./manualinvoice-guest-transfers";
import HtmlParser from "../../helpers/html-parser";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class TravellerManual extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      paxCount: this.getPaxInfo(),
      itemDetails: this.getItemDetails()
    };
    this.paxCountArr = [];
  }

  handleSubmit = () => {
    const cartItem = this.props.cartItem;
    if (cartItem.business !== "custom" && cartItem.business !== "activity" && cartItem.business !== "transfers") {
      this.state.paxCount.map((item, count) =>
        this[`pax${count}`].handleChildSubmit()
      );
    }
    else {
      this[`pax${1}`].handleChildSubmit()
    }

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
    if (
      this.paxCountArr.length > 1 &&
      this.paxCountArr.length === this.state.paxCount.length
    ) {
      let i = 0;
      for (i = 0; i <= this.paxCountArr.length && !isDuplicatePaxName; i++) {
        let j = 0;
        for (
          j = i + 1;
          j <= this.paxCountArr.length - (i + 1) && !isDuplicatePaxName;
          j++
        ) {
          if (
            this.paxCountArr[i].data.firstName !== '' &&
            this.paxCountArr[j].data.firstName !== '' &&
            this.paxCountArr[i].data.lastName !== '' &&
            this.paxCountArr[j].data.lastName !== '' &&

            this.paxCountArr[i].data.firstName !== 'TBA' &&
            this.paxCountArr[j].data.firstName !== 'TBA' &&
            this.paxCountArr[i].data.lastName !== 'TBA' &&
            this.paxCountArr[j].data.lastName !== 'TBA' &&

            this.paxCountArr[i].data.firstName ===
            this.paxCountArr[j].data.firstName &&
            this.paxCountArr[i].data.lastName ===
            this.paxCountArr[j].data.lastName
          ) {
            isDuplicatePaxName = true;
            this[`pax${i}`].handleChildSubmitDuplicateValidation();
            this[`pax${j}`].handleChildSubmitDuplicateValidation();
          }
        }
      }
    }
    return isDuplicatePaxName;
  };

  handleParentSubmit = () => {
    this.props.handleSubmit({ count: this.props.count, data: this.state.data });
  };

  getPaxInfo = () => {
    const cartItem = this.props.cartItem;
    let paxCountArr =
      cartItem.business === "hotel" || cartItem.business === "transfers" || cartItem.business === "transportation" || cartItem.business === "vehicle" || cartItem.business === "groundservice"
        ? cartItem.items.map(items => items).flat()
        : cartItem.items;
    if (cartItem.business === "vehicle") {
      paxCountArr = [paxCountArr[0]];
    }
    //this change done for addon - additional services
    if ((cartItem.business === "transportation" || cartItem.business === "groundservice") || (cartItem.business === "hotel" && localStorage.getItem("umrahPackageDetails"))) {
      paxCountArr = [paxCountArr[0]]; //Need to remove all vehicle ("objectIdentifier": "transportationOption") except 1st. it render paxinfo 1 time
    }

    return paxCountArr;
  };

  getItemDetails = () => {
    const itemDetails = this.props.cartItem;
    return Trans("_" + itemDetails.business.toLowerCase());
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { userInfo, guestdetails } = this.props;
    const businessName = this.props.cartItem.business ? this.props.cartItem.business : this.props.cartItem.items[0].data.business;
    return (
      <div className="traveller-details border p-3 bg-white box-shadow mb-3">

        <React.Fragment>
          <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
            <SVGIcon
              name="user-alt"
              className="mr-2"
              width="20"
              height="20"
            ></SVGIcon>
            {Trans(businessName === "hotel" ? "_travelersDetails" : "_viewTravelersDetailsAir")}
            {/* <span className="text-primary text-capitalize">
              <HtmlParser text={this.state.itemDetails} />
            </span> */}
          </h5>
        </React.Fragment>

        {businessName === "hotel" &&
          this.props.cartItem.hotelPaxInfo.map((cartItem, key) => {
            return (
              <Guest
                key={key}
                business={businessName}
                onRef={ref => (this[`pax${key}`] = ref)}
                handleChildSubmit={this.handleChildSubmit}
                count={key}
                userInfo={guestdetails && guestdetails[key] ? guestdetails[key].data : userInfo}
                guestdetails={guestdetails && guestdetails[key] ? guestdetails : userInfo}
                {...cartItem}
                addons={null}
                supplierquestions={null}
                data={null}//used for transportaion due to render first vehicle and show Additinal services for all vehcles
                continueAsGuest={null}
              />
            );
          })
        }

        {businessName !== "hotel" && businessName !== "transfers" && Number(this.props.cartItem.guests) > 0 &&
          <Guest
            key={1}
            business={businessName}
            onRef={ref => (this[`pax${1}`] = ref)}
            handleChildSubmit={this.handleChildSubmit}
            count={1}
            userInfo={guestdetails && guestdetails[0] ? guestdetails[0].data : userInfo}
            guestdetails={guestdetails && guestdetails[0] ? guestdetails : userInfo}
            {...this.props.cartItem}
            addons={null}
            supplierquestions={null}
            data={null}//used for transportaion due to render first vehicle and show Additinal services for all vehcles
            continueAsGuest={null}
          />
        }

        {businessName === "transfers" && Number(this.props.cartItem.guests) > 0 &&
          <GuestTransfers
            key={1}
            business={businessName}
            onRef={ref => (this[`pax${1}`] = ref)}
            handleChildSubmit={this.handleChildSubmit}
            count={1}
            userInfo={guestdetails && guestdetails[0] ? guestdetails[0].data : userInfo}
            guestdetails={guestdetails && guestdetails[0] ? guestdetails : userInfo}
            {...this.props.cartItem}
            addons={null}
            supplierquestions={null}
            data={null}
            continueAsGuest={null}
          />
        }

      </div>
    );
  }
}

export default TravellerManual;
