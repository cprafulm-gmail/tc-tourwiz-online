import React, { Component } from "react";
import ContactInfo from "./contact-info";
import Traveller from "./traveller";
import QuotationTravellerAir from "./quotation-traveller-air";
import { Trans } from "../../helpers/translate";
import PaymentInfo from "./payment-info";
import InvoiceType from "./invoice-type";

class TravellersManualBooking extends Component {
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

    if (paxCountArr === undefined) {
      this.paxCount.push(data);
    } else {
      if (paxCountArr.count === data.count) {
        this.paxCount = this.paxCount.filter(item => item !== paxCountArr);
        this.paxCount.push(data);
      }
    }
    let count = this.props.items.length;
    count++; //contact info
    if (this.props.displayCharges.find(x => x.description === "Total").amount > 0) {
      count++; //payment info
    }
    if (this.props.items.length > 1) {
      const isTWPackage = this.props.items.filter(x => x.data.business === "package").length > 0
        && this.props.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0;
      if (!isTWPackage && this.props.displayCharges.find(x => x.description === "Total").amount > 0)
        count++; //invoice info
    }

    if (this.paxCount.length === count) {
      this.props.handleAddTravellers(this.paxCount);
      this.setState({ isBtnLoading: !this.state.isBtnLoading });
    }
  };

  onSubmit = () => {
    let errorMessages = [];
    if (this.props.items.reduce((sum, item) => sum + (item.availabilityStatus === 3 ? 1 : 0), 0) > 0)
      errorMessages.push(Trans("_cartUnavailableMessage"));

    if (errorMessages.length > 0) {
      this.setState({
        isBtnLoading: false,
        errorMessages: errorMessages,
      });
      return false;
    }

    [...Array(this.props.items.length).keys()].map(count =>
      this[`traveller${count}`].handleSubmit()
    );
    this[`contact`].handleSubmit();
    if (this.props.displayCharges.find(x => x.description === "Total").amount > 0) {
      this[`payment`].handleSubmit();
      const isTWPackage = this.props.items.filter(x => x.data.business === "package").length > 0
        && this.props.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0;
      if (this.props.items.length > 1 && !isTWPackage)
        this[`invoice`].handleSubmit();
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.items.length !== prevProps.items.length) {
      this.setState({
        isBtnLoading: false,
        errorMessages: [],
      });
      return false;
    }
  };

  render() {
    const { userInfo } = this.props;
    let tempAvailabilityStatus = false;
    [...Array(this.props.items.length).keys()].map(count => {
      if (this.props.items[count].availabilityStatus === 3) {
        if (this.props.items.length === 1) {
          tempAvailabilityStatus = true;
        }
      }
      return true;
    });
    let isShowInvoiceTypeSection = false;
    if (this.props.displayCharges.find(x => x.description === "Total").amount > 0
      && this.props.items.length > 1)
      isShowInvoiceTypeSection = true;
    const isTWPackage = this.props.items.filter(x => x.data.business === "package").length > 0
      && this.props.items.filter(x => x.data.business !== "package").reduce((x, y) => x + y.data.amount, 0) === 0;
    if (isTWPackage)
      isShowInvoiceTypeSection = false;

    return (
      <div className="booking-form">
        {[...Array(this.props.items.length).keys()].map(count => {
          return this.props.items[count].availabilityStatus === 3 ?
            "" :
            this.props.items[count].data.business !== "air" ? (
              <Traveller
                key={count + 1}
                onRef={ref => (this[`traveller${count}`] = ref)}
                count={count + 1}
                handleSubmit={this.handleSubmit}
                handleRemoveGuest={this.removeGuest}
                cartItem={this.props}
                userInfo={userInfo}
                continueAsGuest={this.props.continueAsGuest}
              />
            ) : (
              <QuotationTravellerAir
                key={count + 1}
                onRef={ref => (this[`traveller${count}`] = ref)}
                count={count + 1}
                handleSubmit={this.handleSubmit}
                handleRemoveGuest={this.removeGuest}
                cartItem={this.props}
                userInfo={userInfo}
                continueAsGuest={this.props.continueAsGuest}
              />
            );
        })}
        {tempAvailabilityStatus ? "" : (
          <ContactInfo
            onRef={ref => (this[`contact`] = ref)}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            count={0}
            userInfo={userInfo}
            continueAsGuest={this.props.continueAsGuest}
          />)}
        {this.props.displayCharges.find(x => x.description === "Total").amount > 0
          &&
          <PaymentInfo
            onRef={ref => (this[`payment`] = ref)}
            handleSubmit={this.handleSubmit}
            userInfo={userInfo}
            cartItem={this.props}
            count={-1}
          />}
        {isShowInvoiceTypeSection
          && <InvoiceType
            onRef={ref => (this[`invoice`] = ref)}
            handleSubmit={this.handleSubmit}
            count={-2} />
        }

        {tempAvailabilityStatus ? "" : (
          <button className="btn btn-primary mt-4" onClick={this.onSubmit}>
            {this.state.isBtnLoading ? (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            ) : null}
            Generate Invoice
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
      </div>
    );
  }
}

export default TravellersManualBooking;
