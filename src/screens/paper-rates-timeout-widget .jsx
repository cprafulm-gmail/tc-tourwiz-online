import React, { Component } from 'react'
import Duration from "../assets/images/clock.svg";

class PaperRateTimeOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    this.props.handleRelease();
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
                />
                &nbsp;&nbsp;Session Expired
                <button className='btn border-0 text-light pull-right'>
                  X
                </button>
              </h5>
            </div>
            <div className='col-lg-12 card-body bg-muted text-center mt-2'>
              <h3>
                <small>
                  <img
                    className="pb-1"
                    style={{ filter: "none", height: "30px" }}
                    src={Duration}
                    alt=""
                  />
                </small>&nbsp;&nbsp; Your session has expired.</h3>
              <p>You will be redirected to the Search page.</p>
            </div>
            <div className='row mb-4'>
              <div className='col-lg-12 d-flex justify-content-center'>
                <button
                  className='btn btn-outline-primary'
                  onClick={() => this.props.history.push(`/`)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default PaperRateTimeOut;