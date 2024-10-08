import React, { Component } from 'react'
import Duration from "../assets/images/clock.svg";

class PaperRatesTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <>
        <div className='container'>
          <div className='row card'>
            <div class=" col-lg-12 card-header">
              <h5 className='text-dark font-weight-bold pt-1'>
                <img
                  className="pb-1"
                  style={{ filter: "none", height: "30px" }}
                  src={Duration}
                  alt=""
                /> &nbsp;&nbsp;Session Timeout
                <small className='font-weight-bold h4 text-primary pull-right'>{this.props.minutes} <small>Min</small> {this.props.seconds} <small>Sec</small></small>

              </h5>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default PaperRatesTimer;