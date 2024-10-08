import React, { Component } from 'react'


export class ShowLogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div>
                    <div className="model-popup">
                        <div className="modal fade show d-block">
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title text-capitalize">
                                            Logo
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => { this.props.closePopup() }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body ">
                                        <img style={{ maxWidth: "100%" }} src={this.props.src} alt="logo" />
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            name="Cancel"
                                            onClick={() => { this.props.closePopup() }}
                                            className="btn btn-secondary  float-left mr-2"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show"></div>
                    </div>
                </div>
            </div >
        )
    }
}
export default ShowLogo
