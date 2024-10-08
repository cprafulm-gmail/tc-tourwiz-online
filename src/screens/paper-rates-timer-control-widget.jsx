import React, { PureComponent } from 'react'
import Countdown from 'react-countdown';
import PaperRatesTimer from "./paper-rates-timer-widget";
import PaperRateTimeOut from "./paper-rates-timeout-widget ";

class PaperRatesTimerControl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paperRateTotalTimeForExpire: this.props.paperRateTotalTimeForExpire
    };
  }

  renderTimer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <PaperRateTimeOut {...this.props} history={this.props.history} handleRelease={this.props.handleReleasePaperRatesSeats} />
    } else {
      return <PaperRatesTimer minutes={minutes} seconds={seconds} key={seconds} />
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return false; //Do not change condition
  }

  render() {
    return <Countdown
      date={this.state.paperRateTotalTimeForExpire}
      //date={Date.now() + 10000}
      renderer={this.renderTimer}
    />;
  }
}

export default PaperRatesTimerControl;