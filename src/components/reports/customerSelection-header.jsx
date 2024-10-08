import React, { Component } from 'react'

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customername: ""
        };
    }
    render() {
        return (
            <div className="w-100 pr-3 mb-3 customer-selection">
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                </div>
                            </div>
                            <input
                                type="text"
                                value={this.state.customername}
                                className="form-control"
                                onChange={e => this.setState({ customername: e.target.value })}
                                placeholder={"Customer Selection"}
                            />
                            {this.state.customername && (
                                <button
                                    className="reset-btn position-absolute btn btn-link text-secondary"
                                //   onClick={this.props.resetQuery}
                                >
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            )}
                            <div className="input-group-append">
                                {!this.props.isLoading ? <button className="btn btn-primary"
                                onClick={() => this.props.getCustomer(this.state)}
                                >
                                    {"Search"}
                                </button>
                                : 
                                <button className="btn btn-primary">
                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                        {"Search"}
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}
