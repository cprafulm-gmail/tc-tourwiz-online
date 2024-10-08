import React from "react";
import Form from "../common/form";
import QuotationGuestAir from "./quotation-guest-air";
import ManualInvoiceGuestAir from "./manualinvoice-guest-air";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

class TravellerAirManualinvoice extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      paxCount: this.getPaxInfo(),
      adultpaxCount: this.getadultPaxInfo(),
      childpaxCount: this.getchildPaxInfo(),
      infantpaxCount: this.getinfantPaxInfo(),
      route: "",
      dateInfo: ""
    };
    this.paxCountArr = [];
  }

  validate = () => {
    const errors = {};
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = () => {
    const cartItem = this.props.cartItem;

    this.state.paxCount.map((item, count) =>
      this[`pax${count}`].handleChildSubmit()
    );

    // [...Array(Number(cartItem.adult)).keys()].map((item, count) =>
    //   this[`pax${count}`].handleChildSubmit()
    // );

    // [...Array(Number(cartItem.child)).keys()].map((item, count) =>
    //   this[`pax${count}`].handleChildSubmit()
    // );

    // [...Array(Number(cartItem.infant)).keys()].map((item, count) =>
    //   this[`pax${count}`].handleChildSubmit()
    // );
  };

  handleChildSubmit = data => {
    const cartItem = this.props.cartItem;
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

  getPaxInfo = () => {
    const cartItem = this.props.cartItem;
    let paxCountArr = [];

    paxCountArr =
      [...Array(Number(cartItem.adult)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty + "_ADT");
        return sumQty;
      }, []);

    if (paxCountArr.length > 0) {
      let a = [...Array(Number(cartItem.child)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty + "_CHD");
        return sumQty;
      }, [])

      let b = [...Array(Number(cartItem.infant)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty + "_INF");
        return sumQty;
      }, []);

      paxCountArr = paxCountArr.concat(a);
      paxCountArr = paxCountArr.concat(b);
    }


    return paxCountArr;
  };

  validateDuplicateData = () => {
    let isDuplicatePaxName = false;
    let isDuplicatePassport = false;
    let isdomestic = JSON.parse(localStorage.getItem("quotationDetails"));
    if (isdomestic !== null && isdomestic.tripType !== undefined) {
      if (isdomestic.tripType.toLowerCase() === "domestic")
        isdomestic = true;
      else if (isdomestic.tripType.toLowerCase() === "international" || isdomestic.tripType.toLowerCase() === "both")
        isdomestic = false;
    }
    else
      isdomestic = true;
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
          }
          if (!isdomestic &&
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

  getadultPaxInfo = () => {
    const cartItem = this.props.cartItem;
    let paxCountArr =
      [...Array(Number(cartItem.adult)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty);
        return sumQty;
      }, []);
    return paxCountArr;
  };

  getchildPaxInfo = () => {
    const cartItem = this.props.cartItem;
    let paxCountArr =
      [...Array(Number(cartItem.child)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty);
        return sumQty;
      }, []);
    return paxCountArr;
  };

  getinfantPaxInfo = () => {
    const cartItem = this.props.cartItem;
    let paxCountArr =
      [...Array(Number(cartItem.infant)).keys()].reduce((sumQty, itemQty) => {
        sumQty.push(itemQty);
        return sumQty;
      }, []);
    return paxCountArr;
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const { userInfo, guestdetails } = this.props;
    const { addons, inputs } = this.props.cartItem.items[this.props.count - 1];
    let isdomestic = JSON.parse(localStorage.getItem("quotationDetails"));
    if (isdomestic !== null && isdomestic.tripType !== undefined) {
      if (isdomestic.tripType.toLowerCase() === "domestic")
        isdomestic = true;
      else if (isdomestic.tripType.toLowerCase() === "international" || isdomestic.tripType.toLowerCase() === "both")
        isdomestic = false;
    }
    else
      isdomestic = true;
    return (
      <div className="traveller-details border p-3 bg-white box-shadow mb-3">
        <h5 className="border-bottom pb-3 mb-3 font-weight-bold">
          <SVGIcon
            name="user-alt"
            className="mr-2"
            width="20"
            height="20"
          ></SVGIcon>
          {(localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" ? Trans("_mutamerDetails") : Trans("_travelersDetails"))}
        </h5>

        <p className="flightnotes text-secondary">{Trans("_infoTravellerDetailsAir")}</p>
        {
          localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType") === "B2C" &&
          <React.Fragment> <p className="mt-3 flightnotes text-secondary">{Trans("_infoTravellerDetailsAirMutamer1")}</p>

            <p className="mt-3 mb-3 flightnotes text-secondary">{Trans("_infoTravellerDetailsAirMutamer2")}</p>
          </React.Fragment>
        }
        {this.state.paxCount.map((item, key) => {
          return (<ManualInvoiceGuestAir
            key={key}
            typeString={item.split('_')[1]}
            onRef={ref => (this[`pax${key}`] = ref)}
            handleChildSubmit={this.handleChildSubmit}
            count={key}
            userInfo={guestdetails && guestdetails[key] ? guestdetails[key].data : userInfo}
            dateInfo={this.state.dateInfo}
            {...this.props.cartItem}
            {...addons}
            {...inputs}
            continueAsGuest={null}
            propsCartItems={this.props.cartItem}
            isDomestic={isdomestic}
            supplierquestions={null}
            business={null}
          />)
        })
        }
        {/* {Number(this.props.cartItem.adult) > 0 &&
          [...Array(Number(this.props.cartItem.adult)).keys()].map((key) => {
            return (<ManualInvoiceGuestAir
              key={key}
              typeString={'ADT'}
              onRef={ref => (this[`pax${key}`] = ref)}
              handleChildSubmit={this.handleChildSubmit}
              count={key}
              userInfo={guestdetails ? guestdetails[key].data : userInfo}
              dateInfo={this.state.dateInfo}
              {...this.props.cartItem}
              {...addons}
              {...inputs}
              continueAsGuest={null}
              propsCartItems={this.props.cartItem}
              isDomestic={isdomestic}
              supplierquestions={null}
              business={null}
            />)
          })
        } */}

        {/* {Number(this.props.cartItem.child) > 0 &&
          [...Array(Number(this.props.cartItem.child)).keys()].map((key) => {
            return (<ManualInvoiceGuestAir
              key={key}
              typeString={'CHD'}
              onRef={ref => (this[`pax${key}`] = ref)}
              handleChildSubmit={this.handleChildSubmit}
              count={key}
              userInfo={guestdetails ? guestdetails[key].data : userInfo}
              dateInfo={this.state.dateInfo}
              {...this.props.cartItem}
              {...addons}
              {...inputs}
              continueAsGuest={null}
              propsCartItems={this.props.cartItem}
              isDomestic={isdomestic}
              supplierquestions={null}
              business={null}
            />)
          })
        }

        {Number(this.props.cartItem.infant) > 0 &&
          [...Array(Number(this.props.cartItem.infant)).keys()].map((key) => {
            return (<ManualInvoiceGuestAir
              key={key}
              typeString={'INF'}
              onRef={ref => (this[`pax${key}`] = ref)}
              handleChildSubmit={this.handleChildSubmit}
              count={key}
              userInfo={guestdetails ? guestdetails[key].data : userInfo}
              dateInfo={this.state.dateInfo}
              {...this.props.cartItem}
              {...addons}
              {...inputs}
              continueAsGuest={null}
              propsCartItems={this.props.cartItem}
              isDomestic={isdomestic}
              supplierquestions={null}
              business={null}
            />)
          })
        } */}

        {/* <p className="text-secondary mb-0">
          {Trans("_infantMessageInTraveller")}
        </p> */}
      </div>
    );
  }
}

export default TravellerAirManualinvoice;
