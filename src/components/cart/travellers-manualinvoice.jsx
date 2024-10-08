import React, { Component } from "react";
import ContactInfo from "./contact-info";
import TravellerManual from "./traveller-manualinvoice";
import TravellerAirManualinvoice from "./traveller-air-maunalinvoice";
import { Trans } from "../../helpers/translate";
import PaymentInfo from "./payment-info";

class TravellersManualinvoice extends Component {
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
    //if (this.paxCount.length === this.props.items.length + 2) {
    this.props.handleAddTravellers(this.paxCount);
    this.setState({ isBtnLoading: !this.state.isBtnLoading });
    //}
  };

  onSubmit = () => {
    [...Array(this.props.items.length).keys()].map(count =>
      this[`traveller${count === 0 ? count + 1 : count}`].handleSubmit()
    );

    // this[`contact`].handleSubmit();
    // this[`payment`].handleSubmit();
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
    const { userInfo, guestdetails } = this.props;
    let tempAvailabilityStatus = false;
    return (
      <div className="booking-form">
        {this.props.business !== "air" ? (
          <TravellerManual
            key={+ new Date()}
            onRef={ref => (this[`traveller${1}`] = ref)}
            count={1}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            cartItem={this.props}
            userInfo={userInfo}
            guestdetails={guestdetails}
            continueAsGuest={this.props.continueAsGuest}
          />
        ) : (
          <TravellerAirManualinvoice
            key={+ new Date()}
            onRef={ref => (this[`traveller${1}`] = ref)}
            count={1}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            cartItem={this.props}
            userInfo={userInfo}
            guestdetails={guestdetails}
            continueAsGuest={this.props.continueAsGuest}
          />
        )
        }
        {/* {tempAvailabilityStatus ? "" : (
          <ContactInfo
            onRef={ref => (this[`contact`] = ref)}
            handleSubmit={this.handleSubmit}
            handleRemoveGuest={this.removeGuest}
            count={0}
            userInfo={userInfo}
            continueAsGuest={this.props.continueAsGuest}
          />)}

        <PaymentInfo key={+ new Date()}
          onRef={ref => (this[`payment`] = ref)}
          handleSubmit={this.handleSubmit}
          userInfo={userInfo}
          cartItem={this.props}
          count={-1}
        /> */}

        {(
          <button className="btn btn-primary mt-4" onClick={this.onSubmit}>
            {this.state.isBtnLoading ? (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            ) : null}
            {this.props.importItem ? Trans("Update to " + this.props.category) : Trans("Add to " + this.props.category)}
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

export default TravellersManualinvoice;
