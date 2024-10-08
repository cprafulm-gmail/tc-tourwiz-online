import React, { Component } from 'react'

export class MessageBar extends Component {
    componentDidMount() {
        if (!this.props.type || (this.props.type && this.props.type === "success"))
            setTimeout(() => {
                this.props.handleClose();
            }, 2500);
    }
    render() {
        return (
            <div>
                <div className="model-popup">
                    <div className="modal fade show d-block">
                        <div className="modal-dialog  ">
                            <div className="modal-content">
                                <div className={"alert " + (this.props.type && this.props.type === "error" ? "alert-danger" : "alert-success") + " fade show mb-0"} role="alert">
                                    <strong>{this.props.type && this.props.type === "error" ? "Ooops!" : "Success"}</strong>
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.props.handleClose}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <hr className="mt-1 mb-1"></hr>
                                    <p>{this.props.Message}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </div>
            </div>
        )
    }
}

export default MessageBar;
