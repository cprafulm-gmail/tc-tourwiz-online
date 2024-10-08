import React, { Component } from 'react'

export class DeleteConfirmationDialog extends Component {
    render() {
        return (
            <div>
                <div className="model-popup">
                    <div className="modal fade show d-block">
                        <div
                            className={
                                "modal-dialog modal-dialog-centered modal-dialog-scrollable "
                            }
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation Dialog</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={this.props.handleClose}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">Are you sure to delete this record?</div>
                                <div class="modal-footer">
                                    <button type="button"
                                        onClick={this.props.handleClose}
                                        class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-danger"
                                        onClick={this.props.handleDelete}>Delete</button>
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

export default DeleteConfirmationDialog
